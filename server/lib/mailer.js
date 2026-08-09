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

function row(label, value) {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:4px 0;color:#111;">${value}</td></tr>`;
}

function quoteRequestHtml(quote) {
  const preferredDate = quote.preferredDate
    ? new Date(quote.preferredDate).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  return `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
      <h2 style="margin:0 0 4px;">New quote request — ${quote.reference}</h2>
      <p style="margin:0 0 16px;color:#666;">Submitted ${new Date(quote.createdAt || Date.now()).toLocaleString("en-AU")}</p>

      <table cellpadding="0" cellspacing="0">
        ${row("Service", quote.service)}
        ${row("Property type", quote.propertyType)}
        ${row("Approx. length", quote.approxLength)}
        ${row("Timeframe", quote.timeframe)}
        ${row("Notes", quote.notes)}
        ${row("Photos attached", quote.photos?.length ? String(quote.photos.length) : "")}
      </table>

      ${
        quote.selection?.style || quote.selection?.color
          ? `<h3 style="margin:16px 0 4px;">Selection carried from service page</h3>
             <table cellpadding="0" cellspacing="0">
               ${row("Service", quote.selection.serviceName)}
               ${row("Style", quote.selection.style)}
               ${row("Colour", quote.selection.color)}
               ${row("Price", quote.selection.price ? `from $${quote.selection.price} ${quote.selection.priceUnit || ""}` : "")}
             </table>`
          : ""
      }

      ${
        quote.calculatorEstimate?.detail
          ? `<h3 style="margin:16px 0 4px;">Calculator estimate</h3>
             <table cellpadding="0" cellspacing="0">
               ${row("Type", quote.calculatorEstimate.label)}
               ${row("Detail", quote.calculatorEstimate.detail)}
               ${row("Estimate", quote.calculatorEstimate.low ? `$${quote.calculatorEstimate.low.toLocaleString()}–$${quote.calculatorEstimate.high?.toLocaleString?.() || ""}` : "")}
             </table>`
          : ""
      }

      <h3 style="margin:16px 0 4px;">Customer details</h3>
      <table cellpadding="0" cellspacing="0">
        ${row("Name", `${quote.firstName} ${quote.lastName}`)}
        ${row("Mobile", `<a href="tel:${quote.mobile}">${quote.mobile}</a>`)}
        ${row("Email", `<a href="mailto:${quote.email}">${quote.email}</a>`)}
        ${row("Site address", `${quote.siteAddress}, ${quote.suburb} ${quote.state || ""} ${quote.postcode}`)}
      </table>

      <h3 style="margin:16px 0 4px;">Measure booking</h3>
      <table cellpadding="0" cellspacing="0">
        ${row("Preferred date", preferredDate)}
        ${row("Preferred window", quote.noPreference ? "No preference — call to arrange" : quote.preferredTime)}
      </table>

      ${
        quote.photos?.length
          ? `<h3 style="margin:16px 0 4px;">Site photos</h3>
             <div>${quote.photos.map((url) => `<a href="${url}" style="display:inline-block;margin:0 8px 8px 0;"><img src="${url}" width="120" style="border-radius:4px;display:block;" /></a>`).join("")}</div>`
          : ""
      }
    </div>
  `;
}

async function sendQuoteRequestEmail(quote) {
  const transport = getTransporter();
  const to = process.env.QUOTE_NOTIFY_EMAIL || "quote@stagfencing.com.au";
  const html = quoteRequestHtml(quote);

  if (!transport) {
    console.log(`\n[mailer] SMTP not configured — quote request ${quote.reference} would be emailed to ${to}\n`);
    return;
  }

  await transport.sendMail({
    from: process.env.MAIL_FROM || "Stag Fencing <no-reply@stagfencing.com.au>",
    to,
    replyTo: quote.email,
    subject: `New quote request — ${quote.service} · ${quote.firstName} ${quote.lastName} (${quote.reference})`,
    html,
  });
}

async function sendQuoteConfirmationEmail(quote) {
  const transport = getTransporter();
  if (!transport) {
    console.log(`\n[mailer] SMTP not configured — confirmation for ${quote.reference} not sent to ${quote.email}\n`);
    return;
  }

  const preferredDate = quote.preferredDate
    ? new Date(quote.preferredDate).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })
    : null;

  await transport.sendMail({
    from: process.env.MAIL_FROM || "Stag Fencing <no-reply@stagfencing.com.au>",
    to: quote.email,
    subject: `We've got your quote request — ${quote.reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
        <p>Hi ${quote.firstName},</p>
        <p>Thanks for booking a free measure with Stag Fencing. Here's what we've got:</p>
        <p><strong>${quote.service}</strong> — ${quote.propertyType}${quote.approxLength ? ` · ${quote.approxLength}` : ""}</p>
        ${preferredDate ? `<p>Preferred measure window: <strong>${preferredDate}${quote.noPreference ? "" : ` · ${quote.preferredTime}`}</strong></p>` : ""}
        <p>A real person will call within one business day to confirm before we arrive. Reference #${quote.reference}.</p>
        <p>Need to change anything? Call 0431 703 770.</p>
        <p>— Stag Fencing</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail, sendQuoteRequestEmail, sendQuoteConfirmationEmail };
