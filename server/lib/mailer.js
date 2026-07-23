const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

async function sendOtpEmail(email, code) {
  const transport = getTransporter();

  if (!transport) {
    // No SMTP configured (e.g. local dev) — log the code so the flow is still testable.
    console.log(`\n[mailer] SMTP not configured — OTP for ${email}: ${code}\n`);
    return;
  }

  await transport.sendMail({
    from: process.env.MAIL_FROM || "Stag Fencing <no-reply@stagfencing.com.au>",
    to: email,
    subject: "Your Stag Fencing login code",
    text: `Your login code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your login code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });
}

module.exports = { sendOtpEmail };
