import nodemailer from "nodemailer";

export function createSmtpMailer({ host, port, secure, user, pass, from, to, ignoreTLS = false }) {
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    ignoreTLS,
    auth: user ? { user, pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return {
    async send({ id, name, email, message, receivedAt }) {
      await transport.sendMail({
        from,
        to,
        replyTo: name ? { name, address: email } : email,
        subject: "ELMA Wiki: новое обращение с сайта",
        text: `Имя: ${name || "не указано"}\nEmail: ${email}\nПолучено: ${receivedAt}\nНомер: ${id}\n\n${message}\n`,
      });
    },
  };
}
