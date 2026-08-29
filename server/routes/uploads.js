const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");
const { uploadBuffer } = require("../lib/s3");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
});

const ALLOWED_FOLDERS = new Set([
  "reviews",
  "services",
  "service-categories",
  "gallery",
  "shop",
]);

router.post("/", requireAuth, upload.array("files", 5), async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "No files uploaded" });

  const folder = ALLOWED_FOLDERS.has(req.body.folder) ? req.body.folder : "reviews";

  const uploaded = await Promise.all(
    files.map((file) =>
      uploadBuffer({
        buffer: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        folder,
      })
    )
  );

  res.status(201).json({ files: uploaded.map((f) => f.url) });
});

module.exports = router;
