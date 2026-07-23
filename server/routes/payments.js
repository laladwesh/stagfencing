const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getStripe } = require("../lib/stripe");

const router = express.Router();

router.use(requireAuth);

router.post("/create-intent", async (req, res) => {
  const { amount } = req.body;
  const cents = Math.round(Number(amount) * 100);
  if (!cents || cents <= 0) {
    return res.status(400).json({ error: "A valid amount (in dollars) is required" });
  }

  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount: cents,
    currency: "aud",
    automatic_payment_methods: { enabled: true },
    metadata: { userId: String(req.user._id) },
  });

  res.json({ clientSecret: intent.client_secret, id: intent.id });
});

module.exports = router;
