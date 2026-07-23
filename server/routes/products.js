const express = require("express");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Category = require("../models/Category");

const router = express.Router();

const SORT_MAP = {
  "price-asc": { priceMin: 1 },
  "price-desc": { priceMax: -1 },
  newest: { createdAt: -1 },
};

router.get("/", async (req, res) => {
  const { category, subCategory, search, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query;

  const filter = {};

  if (category) {
    const cat = await Category.findOne({ slug: category });
    filter.category = cat ? cat._id : null;
  }
  if (subCategory) filter.subCategorySlug = subCategory;
  if (search) filter.$text = { $search: search };
  if (minPrice || maxPrice) {
    filter.priceMin = {};
    if (maxPrice) filter.priceMin.$lte = Number(maxPrice);
    if (minPrice) filter.priceMax = { $gte: Number(minPrice) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(SORT_MAP[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
  if (!product) return res.status(404).json({ error: "Product not found" });

  const [reviews, related] = await Promise.all([
    Review.find({ product: product._id }).sort({ createdAt: -1 }),
    Product.find({ slug: { $in: product.relatedSlugs || [] } }),
  ]);

  res.json({ product, reviews, related });
});

router.post("/:slug/reviews", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { name, rating, comment, location, photos } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: "name, rating and comment are required" });
  }

  const review = await Review.create({
    product: product._id,
    name,
    rating,
    comment,
    location,
    photos: photos || [],
  });

  res.status(201).json(review);
});

module.exports = router;
