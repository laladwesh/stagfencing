const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");
const { uploadBuffer } = require("../lib/s3");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
});

router.post("/", requireAuth, upload.array("files", 5), async (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "No files uploaded" });

  const uploaded = await Promise.all(
    files.map((file) =>
      uploadBuffer({
        buffer: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        folder: "reviews",
      })
    )
  );

  res.status(201).json({ files: uploaded.map((f) => f.url) });
});

module.exports = router;
