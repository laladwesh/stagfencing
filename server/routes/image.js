/**
 * On-the-fly image resize proxy: GET /api/img?src=<s3-url>&w=<width>
 *
 * S3 has no image-processing of its own, so a URL with a query param does
 * nothing on S3 directly — this route is what actually makes `?w=` mean
 * something. It fetches the original from our own bucket, resizes it with
 * sharp, and streams back the result with a long, immutable cache header
 * (the output is deterministic for a given src+w, so it's safe to cache
 * forever — both in the browser and in the small in-memory cache below,
 * which avoids re-doing the resize for every visitor).
 *
 * Restricted to our own bucket only, to avoid this becoming an open image
 * proxy for arbitrary URLs.
 */
const express = require("express");
const sharp = require("sharp");

const router = express.Router();

const ALLOWED_HOST = `stagfencing-media.s3.${process.env.AWS_REGION}.amazonaws.com`;
const MAX_WIDTH = 2000;
const CACHE_LIMIT = 300;
const cache = new Map(); // key -> { buffer, contentType }

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  cache.delete(key);
  cache.set(key, hit); // refresh LRU order
  return hit;
}

function cacheSet(key, value) {
  cache.set(key, value);
  if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value);
}

router.get("/", async (req, res) => {
  try {
    const { src, w } = req.query;
    if (!src) return res.status(400).json({ error: "Missing src" });

    let url;
    try {
      url = new URL(src);
    } catch {
      return res.status(400).json({ error: "Invalid src" });
    }
    if (url.host !== ALLOWED_HOST) {
      return res.status(400).json({ error: "src must be a stagfencing-media S3 URL" });
    }

    const width = Math.min(Number(w) || 0, MAX_WIDTH) || undefined;
    const cacheKey = `${url.pathname}|${width || "orig"}`;

    const cached = cacheGet(cacheKey);
    if (cached) {
      res.set("Content-Type", cached.contentType);
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.set("X-Image-Cache", "hit");
      return res.send(cached.buffer);
    }

    const upstream = await fetch(url.toString());
    if (!upstream.ok) return res.status(upstream.status).end();
    const original = Buffer.from(await upstream.arrayBuffer());
    const isPng = url.pathname.toLowerCase().endsWith(".png");

    let output = original;
    if (width) {
      let pipeline = sharp(original).resize({ width, withoutEnlargement: true });
      pipeline = isPng ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 82, mozjpeg: true });
      output = await pipeline.toBuffer();
    }

    const contentType = isPng ? "image/png" : "image/jpeg";
    cacheSet(cacheKey, { buffer: output, contentType });

    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("X-Image-Cache", "miss");
    res.send(output);
  } catch (err) {
    console.error("[image proxy] failed:", err.message);
    res.status(500).json({ error: "Image processing failed" });
  }
});

module.exports = router;
