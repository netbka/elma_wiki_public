import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { createServer as createTcpServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { clientKey, createContactServer } from "../server/app.mjs";
import { createContactService, createRateLimiter, validateSubmission } from "../server/contact-handler.mjs";
import { createFileStore } from "../server/file-store.mjs";
import { createSmtpMailer } from "../server/smtp-mailer.mjs";
import { sendContact } from "../src/contactApi.js";

const ID = "3f2b8a51-6c1e-4d7a-9b0e-1a2b3c4d5e6f";
const OTHER_ID = "7a1c9e42-2d3f-4b6a-8c5d-6f5e4d3c2b1a";
const valid = { id: ID, name: "Анна", email: "anna@example.test", message: "Нужно изменить согласование договоров." };

function memoryStore() {
  const records = new Map();
  return {
    records,
    has: async (id) => records.has(id),
    save: async (record) => (records.has(record.id) ? false : (records.set(record.id, { ...record }), true)),
    markDelivered: async (id, deliveredAt) => records.set(id, { ...records.get(id), deliveredAt }),
    pending: async () => [...records.values()].filter((record) => !record.deliveredAt),
  };
}

function fixture({ mailer, store = memoryStore(), limiter } = {}) {
  const sent = [];
  const service = createContactService({
    store,
    mailer: mailer ?? { send: async (record) => sent.push(record) },
    limiter,
    log: () => {},
  });
  const post = (body, contentType = "application/json") =>
    service.handle(
      new Request("http://test.local/api/contact", {
        method: "POST",
        headers: { "content-type": contentType },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      { clientKey: "client" },
    );
  return { service, store, sent, post };
}

test("validation rejects what the form would reject and header-breaking values", () => {
  assert.deepEqual(validateSubmission(valid).value, valid);
  assert.deepEqual(validateSubmission({ ...valid, id: "../../etc/passwd" }).fields, ["id"]);
  assert.deepEqual(validateSubmission({ ...valid, email: "not-an-email" }).fields, ["email"]);
  assert.deepEqual(validateSubmission({ ...valid, email: "a@b.c\r\nBcc: x@y.z" }).fields, ["email"]);
  assert.deepEqual(validateSubmission({ ...valid, name: "Anna\nBcc: x@y.z" }).fields, ["name"]);
  assert.deepEqual(validateSubmission({ ...valid, message: "short" }).fields, ["message"]);
  assert.deepEqual(validateSubmission({ ...valid, message: "x".repeat(4001) }).fields, ["message"]);
  assert.deepEqual(validateSubmission(null).fields, ["id", "email", "message"]);
});

test("stores, delivers and marks a valid request", async () => {
  const { post, store, sent } = fixture();
  const response = await post(valid);
  assert.equal(response.status, 202);
  assert.equal(sent.length, 1);
  assert.ok(store.records.get(ID).deliveredAt);
});

test("a repeated id sends one mail and does not use the rate limit", async () => {
  const { post, sent } = fixture({ limiter: createRateLimiter({ max: 1 }) });
  assert.equal((await post(valid)).status, 202);
  assert.equal((await post(valid)).status, 202);
  assert.equal(sent.length, 1);
});

test("a mail failure keeps the request and the retry delivers it", async () => {
  let up = false;
  const sent = [];
  const { post, service, store } = fixture({
    mailer: {
      send: async (record) => {
        if (!up) throw Object.assign(new Error("down"), { code: "ECONNECTION" });
        sent.push(record);
      },
    },
  });

  assert.equal((await post(valid)).status, 202);
  assert.equal(store.records.get(ID).deliveredAt, null);

  up = true;
  await service.retryPending();
  assert.equal(sent.length, 1);
  assert.ok(store.records.get(ID).deliveredAt);
});

test("a storage failure is reported and nothing is mailed", async () => {
  const store = memoryStore();
  store.save = async () => {
    throw Object.assign(new Error("disk"), { code: "ENOSPC" });
  };
  const { post, sent } = fixture({ store });
  assert.equal((await post(valid)).status, 503);
  assert.equal(sent.length, 0);
});

test("rate limit answers 429 with Retry-After and frees up after the window", async () => {
  let time = 0;
  const limiter = createRateLimiter({ max: 1, windowMs: 1000, now: () => time });
  const { post } = fixture({ limiter });
  assert.equal((await post(valid)).status, 202);

  const limited = await post({ ...valid, id: OTHER_ID });
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "1");

  time = 1000;
  assert.equal((await post({ ...valid, id: OTHER_ID })).status, 202);
});

test("the honeypot looks accepted but keeps nothing", async () => {
  const { post, store, sent } = fixture();
  assert.equal((await post({ ...valid, website: "spam" })).status, 202);
  assert.equal(store.records.size, 0);
  assert.equal(sent.length, 0);
});

test("malformed requests are refused", async () => {
  const { post, service } = fixture();
  assert.equal((await post("{not json")).status, 400);
  assert.equal((await post(valid, "text/plain")).status, 415);
  assert.equal((await post({ ...valid, message: "x".repeat(20000) })).status, 413);
  assert.equal((await post({ ...valid, email: "bad" })).status, 422);
  const get = await service.handle(new Request("http://test.local/api/contact"), { clientKey: "client" });
  assert.equal(get.status, 405);
});

test("file store survives a reopen, refuses duplicates and lists pending", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "contact-store-"));
  t.after(() => rm(directory, { recursive: true, force: true }));

  const first = await createFileStore(directory);
  assert.equal(await first.save({ ...valid, deliveredAt: null }), true);
  assert.equal(await first.save({ ...valid, deliveredAt: null }), false);

  const reopened = await createFileStore(directory);
  assert.equal(await reopened.has(ID), true);
  assert.equal(await reopened.has(OTHER_ID), false);
  assert.deepEqual((await reopened.pending()).map((record) => record.id), [ID]);

  await reopened.markDelivered(ID, "2026-10-31T00:00:00.000Z");
  assert.deepEqual(await reopened.pending(), []);
  assert.deepEqual(await readdir(directory), [`${ID}.json`]);
  assert.equal(JSON.parse(await readFile(path.join(directory, `${ID}.json`), "utf8")).message, valid.message);
});

test("http service answers only the contact path", async (t) => {
  const { service, store } = fixture();
  const server = createContactServer({ service });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;

  assert.equal((await fetch(`${base}/other`)).status, 404);
  const response = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(valid),
  });
  assert.equal(response.status, 202);
  assert.equal(store.records.size, 1);
});

test("client key ignores forwarded headers unless a proxy is trusted", () => {
  const req = { headers: { "x-forwarded-for": "6.6.6.6, 1.2.3.4" }, socket: { remoteAddress: "127.0.0.1" } };
  assert.equal(clientKey(req, false), "127.0.0.1");
  assert.equal(clientKey(req, true), "1.2.3.4");
});

test("smtp mailer sends to the owner with the visitor as Reply-To", async (t) => {
  const received = [];
  const smtp = createTcpServer((socket) => {
    let inData = false;
    let message = "";
    socket.write("220 test\r\n");
    socket.on("data", (chunk) => {
      for (const line of chunk.toString("latin1").split("\r\n").filter((part, index, all) => part || index < all.length - 1)) {
        if (inData) {
          if (line === ".") {
            inData = false;
            received.push(message);
            socket.write("250 ok\r\n");
          } else message += `${line}\n`;
        } else if (/^DATA/i.test(line)) {
          inData = true;
          socket.write("354 go\r\n");
        } else if (/^QUIT/i.test(line)) socket.end("221 bye\r\n");
        else socket.write("250 ok\r\n");
      }
    });
  });
  await new Promise((resolve) => smtp.listen(0, "127.0.0.1", resolve));
  t.after(() => smtp.close());

  const mailer = createSmtpMailer({
    host: "127.0.0.1",
    port: smtp.address().port,
    secure: false,
    ignoreTLS: true,
    from: "site@example.test",
    to: "owner@example.test",
  });
  await mailer.send({ ...valid, name: "Anna", receivedAt: "2026-10-31T00:00:00.000Z" });

  assert.equal(received.length, 1);
  assert.match(received[0], /^To: owner@example\.test$/m);
  assert.match(received[0], /^Reply-To: Anna <anna@example\.test>$/m);
});

test("browser client maps server answers to form states", async () => {
  const answer = (status, body = {}) => async () => new Response(JSON.stringify(body), { status });
  assert.deepEqual(await sendContact("/x", valid, answer(202)), { status: "sent" });
  assert.deepEqual(await sendContact("/x", valid, answer(429)), { status: "rate-limited" });
  assert.deepEqual(await sendContact("/x", valid, answer(422, { fields: ["email"] })), { status: "invalid", fields: ["email"] });
  assert.deepEqual(await sendContact("/x", valid, answer(503)), { status: "failed" });
  assert.deepEqual(await sendContact("/x", valid, async () => { throw new TypeError("offline"); }), { status: "failed" });
});
