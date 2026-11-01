const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL = /[\u0000-\u001f\u007f]/;
const MAX_BODY_BYTES = 16 * 1024;
const DAY_MS = 24 * 60 * 60 * 1000;

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

// Stops reading at the limit, so an oversized body never accumulates in memory.
async function readBody(request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return Buffer.concat(chunks).toString("utf8");
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(value);
  }
}

export function validateSubmission(input) {
  const fields = [];
  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const name = text(input?.name);
  const email = text(input?.email);
  const message = text(input?.message);

  if (typeof input?.id !== "string" || !ID.test(input.id)) fields.push("id");
  if (name.length > 120 || CONTROL.test(name)) fields.push("name");
  if (email.length > 254 || !EMAIL.test(email) || CONTROL.test(email)) fields.push("email");
  if (message.length < 10 || message.length > 4000) fields.push("message");

  return fields.length ? { fields } : { value: { id: input.id, name, email, message } };
}

export function createRateLimiter({ max = 5, windowMs = 60 * 60 * 1000, now = Date.now } = {}) {
  const hits = new Map();
  return {
    // Returns the seconds to wait, or 0 when the attempt is allowed and counted.
    take(key) {
      const current = now();
      for (const [entry, times] of hits) {
        const recent = times.filter((time) => current - time < windowMs);
        if (recent.length) hits.set(entry, recent);
        else hits.delete(entry);
      }
      const times = hits.get(key) ?? [];
      if (times.length >= max) return Math.max(1, Math.ceil((times[0] + windowMs - current) / 1000));
      hits.set(key, [...times, current]);
      return 0;
    },
  };
}

export function createContactService({ store, mailer, limiter = createRateLimiter(), retentionDays, now = Date.now, log = console.error }) {
  const inFlight = new Set();

  // Delivery is at-least-once: a mail that sent but could not be marked is sent again by the retry.
  async function deliver(record) {
    if (inFlight.has(record.id)) return false;
    inFlight.add(record.id);
    try {
      await mailer.send(record);
      await store.markDelivered(record.id, new Date(now()).toISOString());
      return true;
    } catch (error) {
      log(`contact ${record.id} not delivered: ${error?.code ?? error?.name ?? "error"}`);
      return false;
    } finally {
      inFlight.delete(record.id);
    }
  }

  async function handle(request, { clientKey }) {
    if (request.method !== "POST") return json(405, { error: "method" }, { allow: "POST" });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json(415, { error: "content-type" });
    }

    const raw = await readBody(request);
    if (raw === null) return json(413, { error: "too-large" }, { connection: "close" });

    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      return json(400, { error: "invalid-json" });
    }

    // The honeypot gets the normal answer, so a bot learns nothing and nothing is kept.
    if (input?.website) return json(202, { status: "received" });

    const { fields, value } = validateSubmission(input);
    if (fields) return json(422, { error: "validation", fields });

    try {
      if (await store.has(value.id)) return json(202, { status: "received" });

      const retryAfter = limiter.take(clientKey);
      if (retryAfter) return json(429, { error: "rate-limited" }, { "retry-after": String(retryAfter) });

      const record = { ...value, receivedAt: new Date(now()).toISOString(), deliveredAt: null };
      if (!(await store.save(record))) return json(202, { status: "received" });

      await deliver(record);
      return json(202, { status: "received" });
    } catch (error) {
      log(`contact ${value.id} not stored: ${error?.code ?? error?.name ?? "error"}`);
      return json(503, { error: "unavailable" });
    }
  }

  async function retryPending() {
    for (const record of await store.pending()) await deliver(record);
  }

  // Undelivered requests stay until they reach the owner, whatever their age.
  async function purgeExpired() {
    const cutoff = new Date(now() - retentionDays * DAY_MS).toISOString();
    return store.deleteDeliveredBefore(cutoff);
  }

  return { handle, retryPending, purgeExpired };
}
