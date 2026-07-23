const express = require("express");
const crypto = require("crypto");
const Order = require("../models/Order");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/", async (req, res) => {
  const { items, deliveryMethod, subtotal, discount, deliveryFee, total } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must have at least one item" });
  }

  const reference = `SF-${crypto.randomInt(1000, 9999)}`;

  const order = await Order.create({
    user: req.user._id,
    reference,
    items,
    deliveryMethod,
    subtotal,
    discount: discount || 0,
    deliveryFee: deliveryFee || 0,
    total,
  });

  res.status(201).json(order);
});

module.exports = router;
