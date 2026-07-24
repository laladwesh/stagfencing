const express = require("express");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/categories", async (req, res) => {
  const categories = await ServiceCategory.find().sort({ sortOrder: 1 });
  res.json({ categories });
});

router.get("/categories/:categorySlug", async (req, res) => {
  const category = await ServiceCategory.findOne({ slug: req.params.categorySlug });
  if (!category) return res.status(404).json({ error: "Service category not found" });

  const services = await Service.find({ category: category._id })
    .select("name slug cardImage fromPrice priceUnit")
    .sort({ name: 1 });

  res.json({ category, services });
});

router.get("/detail/:serviceSlug", async (req, res) => {
  const service = await Service.findOne({ slug: req.params.serviceSlug }).populate(
    "category",
    "name slug hasRange"
  );
  if (!service) return res.status(404).json({ error: "Service not found" });

  res.json({ service });
});

// Stopgap admin endpoints (no admin-role concept yet — any signed-in user can use these)
// until the real admin panel exists.
router.get("/admin/all", requireAuth, async (req, res) => {
  const services = await Service.find()
    .select("name slug styles")
    .populate("category", "name")
    .sort({ name: 1 });
  res.json({ services });
});

router.put("/admin/:serviceSlug/styles/:styleId/icon", requireAuth, async (req, res) => {
  const { icon } = req.body;
  const service = await Service.findOne({ slug: req.params.serviceSlug });
  if (!service) return res.status(404).json({ error: "Service not found" });

  const style = service.styles.id(req.params.styleId);
  if (!style) return res.status(404).json({ error: "Style not found" });

  style.icon = icon;
  await service.save();

  res.json({ service });
});

module.exports = router;
