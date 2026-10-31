import { createServer } from "node:http";
import { Readable } from "node:stream";

const CONTACT_PATH = "/api/contact";

// Trusts only the entry appended by the proxy in front of this service.
export function clientKey(req, trustProxy) {
  const forwarded = trustProxy ? req.headers["x-forwarded-for"]?.split(",").at(-1)?.trim() : "";
  return forwarded || req.socket.remoteAddress || "unknown";
}

export function createContactServer({ service, trustProxy = false }) {
  return createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url, "http://service.local");
      if (pathname !== CONTACT_PATH) {
        res.writeHead(404).end();
        return;
      }

      const hasBody = !["GET", "HEAD"].includes(req.method);
      const request = new Request(`http://service.local${pathname}`, {
        method: req.method,
        headers: { "content-type": req.headers["content-type"] ?? "" },
        body: hasBody ? Readable.toWeb(req) : undefined,
        duplex: hasBody ? "half" : undefined,
      });

      const response = await service.handle(request, { clientKey: clientKey(req, trustProxy) });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch {
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  });
}
