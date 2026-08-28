const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");
const requireAuth = require("../middleware/requireAuth");
const { getStripe } = require("../lib/stripe");
const { sendOrderConfirmationEmail, sendOrderNotificationEmail } = require("../lib/mailer");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/", async (req, res) => {
  const {
    items,
    deliveryMethod,
    address,
    notes,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod,
    stripePaymentIntentId,
  } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must have at least one item" });
  }

  const method = paymentMethod || "card";

  if (method === "card") {
    if (!stripePaymentIntentId) {
      return res.status(400).json({ error: "Missing payment confirmation" });
    }
    let intent;
    try {
      intent = await getStripe().paymentIntents.retrieve(stripePaymentIntentId);
    } catch {
      return res.status(400).json({ error: "Could not verify payment with Stripe" });
    }
    const expectedCents = Math.round(Number(total) * 100);
    if (intent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment has not succeeded" });
    }
    if (intent.amount !== expectedCents) {
      return res.status(400).json({ error: "Payment amount does not match order total" });
    }
    if (intent.metadata?.userId !== String(req.user._id)) {
      return res.status(400).json({ error: "Payment does not belong to this account" });
    }
  }

  const reference = `SF-${crypto.randomInt(1000, 9999)}`;

  const order = await Order.create({
    user: req.user._id,
    reference,
    items,
    deliveryMethod,
    address,
    notes,
    subtotal,
    discount: discount || 0,
    deliveryFee: deliveryFee || 0,
    total,
    paymentMethod: method,
    stripePaymentIntentId,
    status: method === "bank_transfer" ? "Pending payment" : "Paid",
  });

  sendOrderConfirmationEmail(order, req.user.email, req.user.name).catch((err) =>
    console.error("[orders] confirmation email failed:", err.message)
  );
  sendOrderNotificationEmail(order, req.user.email, req.user.name).catch((err) =>
    console.error("[orders] notify email failed:", err.message)
  );

  res.status(201).json(order);
});

module.exports = router;
