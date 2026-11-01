const TIMEOUT_MS = 30_000;

// Maps every outcome to one of: sent, invalid, rate-limited, failed.
export async function sendContact(endpoint, payload, fetchImpl = fetch) {
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 202) return { status: 'sent' };
    if (response.status === 429) return { status: 'rate-limited' };
    if (response.status === 422) {
      const body = await response.json().catch(() => ({}));
      return { status: 'invalid', fields: Array.isArray(body.fields) ? body.fields : [] };
    }
    return { status: 'failed' };
  } catch {
    return { status: 'failed' };
  }
}
