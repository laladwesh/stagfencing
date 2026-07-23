const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find({ parentSlug: null }).sort({ sortOrder: 1 });
  res.json(categories);
});

router.get("/:slug", async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return res.status(404).json({ error: "Category not found" });

  const subCategories = await Category.find({ parentSlug: category.slug }).sort({ sortOrder: 1 });
  res.json({ ...category.toObject(), subCategories });
});

module.exports = router;
