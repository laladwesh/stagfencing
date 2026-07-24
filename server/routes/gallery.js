const express = require("express");
const GalleryProject = require("../models/GalleryProject");

const router = express.Router();

router.get("/", async (req, res) => {
  const projects = await GalleryProject.find().sort({ sortOrder: 1, completedDate: -1 });
  res.json({ projects });
});

module.exports = router;
