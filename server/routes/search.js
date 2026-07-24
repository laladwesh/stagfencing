const express = require("express");
const Product = require("../models/Product");
const SearchQuery = require("../models/SearchQuery");
const Order = require("../models/Order");

const router = express.Router();

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ results: [] });

  let results = await Product.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
    .populate("category", "name slug")
    .sort({ score: { $meta: "textScore" } })
    .limit(12);

  // $text only matches whole/stemmed words — fall back to a prefix/substring
  // match so partial typing ("tub" -> "Tubular") still returns something.
  if (results.length === 0) {
    results = await Product.find({ name: { $regex: q, $options: "i" } })
      .populate("category", "name slug")
      .limit(12);
  }

  if (q.length >= 2) {
    await SearchQuery.findOneAndUpdate(
      { query: q.toLowerCase() },
      { $inc: { count: 1 }, $set: { lastSearchedAt: new Date() } },
      { upsert: true }
    );
  }

  res.json({ results });
});

router.get("/suggestions", async (req, res) => {
  const popularSearches = await SearchQuery.find().sort({ count: -1 }).limit(10).select("query -_id");

  const pinned = await Product.find({ isPinned: true }).populate("category", "name slug").limit(8);
  const recommended = [...pinned];

  if (recommended.length < 8) {
    const bestSellerAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productSlug", totalQty: { $sum: "$items.quantity" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 20 },
    ]);
    const bestSellerSlugs = bestSellerAgg.map((b) => b._id).filter(Boolean);
    const pinnedIds = new Set(pinned.map((p) => p._id.toString()));

    if (bestSellerSlugs.length) {
      const bestSellerProducts = await Product.find({
        slug: { $in: bestSellerSlugs },
        _id: { $nin: [...pinnedIds] },
      }).populate("category", "name slug");
      const bySlug = Object.fromEntries(bestSellerProducts.map((p) => [p.slug, p]));
      for (const slug of bestSellerSlugs) {
        if (bySlug[slug] && recommended.length < 8) recommended.push(bySlug[slug]);
      }
    }

    if (recommended.length < 8) {
      const usedIds = new Set(recommended.map((p) => p._id.toString()));
      const filler = await Product.find({ _id: { $nin: [...usedIds] } })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(8 - recommended.length);
      recommended.push(...filler);
    }
  }

  res.json({
    popularSearches: popularSearches.map((s) => s.query),
    recommended,
  });
});

module.exports = router;
