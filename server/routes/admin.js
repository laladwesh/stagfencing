const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Review = require("../models/Review");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");
const Order = require("../models/Order");

const router = express.Router();

router.use(requireAuth, requireAdmin);

// ---------- Users ----------
router.get("/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

router.put("/users/:id/admin", async (req, res) => {
  const { isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user._id.equals(req.user._id) && !isAdmin) {
    return res.status(400).json({ error: "You can't remove your own admin access" });
  }
  user.isAdmin = !!isAdmin;
  await user.save();
  res.json({ user });
});

// ---------- Shop: categories ----------
router.get("/shop/categories", async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1 });
  res.json({ categories });
});

router.post("/shop/categories", async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

router.put("/shop/categories/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json({ category });
});

router.delete("/shop/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ---------- Shop: products ----------
router.get("/shop/products", async (req, res) => {
  const products = await Product.find().populate("category", "name slug").sort({ name: 1 });
  res.json({ products });
});

router.get("/shop/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product });
});

router.post("/shop/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

router.put("/shop/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  Object.assign(product, req.body);
  await product.save();
  res.json({ product });
});

router.delete("/shop/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ---------- Shop: reviews ----------
router.get("/shop/reviews", async (req, res) => {
  const reviews = await Review.find().populate("product", "name slug").sort({ createdAt: -1 });
  res.json({ reviews });
});

router.delete("/shop/reviews/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ---------- Services: categories ----------
router.get("/services/categories", async (req, res) => {
  const categories = await ServiceCategory.find().sort({ sortOrder: 1 });
  res.json({ categories });
});

router.post("/services/categories", async (req, res) => {
  const category = await ServiceCategory.create(req.body);
  res.status(201).json({ category });
});

router.put("/services/categories/:id", async (req, res) => {
  const category = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  });
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json({ category });
});

router.delete("/services/categories/:id", async (req, res) => {
  await ServiceCategory.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ---------- Services: services ----------
router.get("/services/services", async (req, res) => {
  const services = await Service.find().populate("category", "name slug").sort({ name: 1 });
  res.json({ services });
});

router.get("/services/services/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json({ service });
});

router.post("/services/services", async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ service });
});

router.put("/services/services/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });
  Object.assign(service, req.body);
  await service.save();
  res.json({ service });
});

router.delete("/services/services/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.put("/services/services/:id/styles/:styleId/icon", async (req, res) => {
  const { icon } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const style = service.styles.id(req.params.styleId);
  if (!style) return res.status(404).json({ error: "Style not found" });

  style.icon = icon;
  await service.save();
  res.json({ service });
});

// ---------- Orders ----------
router.get("/orders", async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
});

router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after" });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order });
});

module.exports = router;
