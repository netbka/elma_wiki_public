#!/usr/bin/env node
import { createContactServer } from "./app.mjs";
import { createContactService } from "./contact-handler.mjs";
import { createFileStore } from "./file-store.mjs";
import { createSmtpMailer } from "./smtp-mailer.mjs";

const RETRY_INTERVAL_MS = 5 * 60 * 1000;

const required = ["CONTACT_DATA_DIR", "CONTACT_TO", "SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing settings: ${missing.join(", ")}`);
  process.exit(1);
}

const env = process.env;
const port = Number(env.SMTP_PORT ?? 465);

const service = createContactService({
  store: await createFileStore(env.CONTACT_DATA_DIR),
  mailer: createSmtpMailer({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.CONTACT_FROM ?? env.SMTP_USER,
    to: env.CONTACT_TO,
  }),
});

const retry = () => service.retryPending().catch((error) => console.error(`contact retry failed: ${error?.code ?? error?.name}`));

createContactServer({ service, trustProxy: env.CONTACT_TRUST_PROXY === "1" }).listen(
  Number(env.PORT ?? 8787),
  env.HOST ?? "127.0.0.1",
  () => {
    console.log(`Contact service listening on ${env.HOST ?? "127.0.0.1"}:${env.PORT ?? 8787}`);
    retry();
    setInterval(retry, RETRY_INTERVAL_MS);
  },
);
