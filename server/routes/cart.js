const express = require("express");
const Cart = require("../models/Cart");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.json({ items: cart?.items || [] });
});

router.put("/", async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "items must be an array" });
  }

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items },
    { upsert: true, returnDocument: "after" }
  );

  res.json({ items: cart.items });
});

module.exports = router;
