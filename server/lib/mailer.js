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
        quote.selection?.serviceName || quote.selection?.style || quote.selection?.color
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

function orderItemsHtml(order) {
  const rows = (order.items || [])
    .map((item) => {
      const selections = item.selections && typeof item.selections === "object" ? Object.values(item.selections).filter(Boolean).join(" · ") : "";
      return `<tr>
        <td style="padding:6px 12px 6px 0;color:#111;">${item.name}${selections ? `<br/><span style="color:#888;font-size:12px;">${selections}</span>` : ""}</td>
        <td style="padding:6px 12px;color:#666;text-align:center;">${item.quantity}</td>
        <td style="padding:6px 0;color:#111;text-align:right;">$${(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>`;
    })
    .join("");

  return `
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:0 12px 6px 0;color:#888;font-size:12px;">Item</td>
          <td style="padding:0 12px 6px;color:#888;font-size:12px;text-align:center;">Qty</td>
          <td style="padding:0 0 6px;color:#888;font-size:12px;text-align:right;">Price</td>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;border-top:1px solid #eee;padding-top:8px;">
      <tr><td style="padding:2px 0;color:#666;">Subtotal</td><td style="padding:2px 0;text-align:right;color:#111;">$${(order.subtotal || 0).toFixed(2)}</td></tr>
      ${order.discount ? `<tr><td style="padding:2px 0;color:#666;">Discount</td><td style="padding:2px 0;text-align:right;color:#111;">-$${order.discount.toFixed(2)}</td></tr>` : ""}
      <tr><td style="padding:2px 0;color:#666;">${order.deliveryMethod || "Delivery"}</td><td style="padding:2px 0;text-align:right;color:#111;">${order.deliveryFee ? `$${order.deliveryFee.toFixed(2)}` : "Free"}</td></tr>
      <tr><td style="padding:6px 0 0;font-weight:bold;color:#111;">Total</td><td style="padding:6px 0 0;text-align:right;font-weight:bold;color:#111;">$${(order.total || 0).toFixed(2)}</td></tr>
    </table>
  `;
}

function bankTransferDetailsHtml(order) {
  const accountName = process.env.BANK_ACCOUNT_NAME;
  const bsb = process.env.BANK_BSB;
  const accountNumber = process.env.BANK_ACCOUNT_NUMBER;

  if (!accountName || !bsb || !accountNumber) {
    return `<p style="color:#b91c1c;">Bank details are not yet configured — call 0431 703 770 for transfer instructions.</p>`;
  }

  return `
    <table cellpadding="0" cellspacing="0">
      ${row("Account name", accountName)}
      ${row("BSB", bsb)}
      ${row("Account number", accountNumber)}
      ${row("Reference", `<strong>${order.reference}</strong> (please use this exact reference)`)}
    </table>
    <p style="color:#666;">Your order ships once we receive payment.</p>
  `;
}

async function sendOrderConfirmationEmail(order, customerEmail, customerName) {
  const transport = getTransporter();
  if (!transport) {
    console.log(`\n[mailer] SMTP not configured — order confirmation for ${order.reference} not sent to ${customerEmail}\n`);
    return;
  }

  await transport.sendMail({
    from: process.env.MAIL_FROM || "Stag Fencing <no-reply@stagfencing.com.au>",
    to: customerEmail,
    subject: `Order confirmed — ${order.reference}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
        <p>Hi ${customerName || "there"},</p>
        <p>Thanks for your order — here's your receipt.</p>
        <h2 style="margin:16px 0 4px;">Order ${order.reference}</h2>
        ${orderItemsHtml(order)}
        ${
          order.paymentMethod === "bank_transfer"
            ? `<h3 style="margin:16px 0 4px;">Bank transfer details</h3>${bankTransferDetailsHtml(order)}`
            : `<p style="margin-top:16px;color:#666;">Paid by card — you're all set.</p>`
        }
        <p style="margin-top:16px;">Questions? Call 0431 703 770 or reply to this email.</p>
        <p>— Stag Fencing</p>
      </div>
    `,
  });
}

async function sendOrderNotificationEmail(order, customerEmail, customerName) {
  const transport = getTransporter();
  const to = process.env.ORDER_NOTIFY_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || "quote@stagfencing.com.au";

  if (!transport) {
    console.log(`\n[mailer] SMTP not configured — new order ${order.reference} would be emailed to ${to}\n`);
    return;
  }

  await transport.sendMail({
    from: process.env.MAIL_FROM || "Stag Fencing <no-reply@stagfencing.com.au>",
    to,
    replyTo: customerEmail,
    subject: `New order — ${order.reference} · $${(order.total || 0).toFixed(2)} · ${order.paymentMethod}`,
    html: `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
        <h2 style="margin:0 0 4px;">New order — ${order.reference}</h2>
        <table cellpadding="0" cellspacing="0">
          ${row("Customer", `${customerName || ""} · <a href="mailto:${customerEmail}">${customerEmail}</a>`)}
          ${row("Payment", `${order.paymentMethod} · ${order.status}`)}
          ${row("Delivery", order.deliveryMethod)}
          ${order.address ? row("Address", [order.address.street, order.address.apartment, order.address.suburb, order.address.state, order.address.postcode].filter(Boolean).join(", ")) : ""}
          ${row("Notes", order.notes)}
        </table>
        <h3 style="margin:16px 0 4px;">Items</h3>
        ${orderItemsHtml(order)}
      </div>
    `,
  });
}

module.exports = {
  sendOtpEmail,
  sendQuoteRequestEmail,
  sendQuoteConfirmationEmail,
  sendOrderConfirmationEmail,
  sendOrderNotificationEmail,
};
