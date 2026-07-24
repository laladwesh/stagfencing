const express = require("express");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");

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

module.exports = router;
