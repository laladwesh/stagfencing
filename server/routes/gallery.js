const express = require("express");
const GalleryProject = require("../models/GalleryProject");

const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.serviceSlug) filter.serviceSlug = req.query.serviceSlug;
  if (req.query.productSlug) filter.productSlug = req.query.productSlug;
  const projects = await GalleryProject.find(filter).sort({ sortOrder: 1, completedDate: -1 });
  res.json({ projects });
});

module.exports = router;
