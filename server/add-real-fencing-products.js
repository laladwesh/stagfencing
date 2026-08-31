/**
 * Adds real, accurately-priced shop products built directly from the actual
 * services/styles already in the Service collection (same figures used by
 * the Fence/Retaining calculators) — not invented data. Uses real job
 * photos already uploaded to S3 this project. Skips any product whose slug
 * already exists, so it's safe to re-run. Creates a couple of shop
 * categories that don't exist yet (security-fencing, blade-fencing) via
 * Category.create — nothing existing is deleted or overwritten.
 *
 * Usage: docker compose exec app node server/add-real-fencing-products.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Category = require("./models/Category");
const Product = require("./models/Product");

const S3 = "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com";

const NEW_CATEGORIES = [
  { name: "Security Fencing", slug: "security-fencing", description: "Garrison and chainmesh security fencing for homes, schools and commercial sites.", sortOrder: 10 },
  { name: "Blade Fencing", slug: "blade-fencing", description: "Designer vertical blade fencing — radiator profile and wood-look finishes.", sortOrder: 11 },
];

// One real, currently-priced product per service — matches exactly what the
// Fence/Retaining calculators already quote, so shop and calculator never
// disagree on price.
const PRODUCTS = [
  {
    name: "Colorbond Fencing — 1200mm",
    slug: "colorbond-fencing-1200mm",
    categorySlug: "colorbond-fencing",
    shortDescription: "Colorbond steel fencing, supplied and installed",
    description:
      "Solid COLORBOND® steel fencing, 1200mm height, supplied and installed by our own crews across Perth. Genuine BlueScope panels, posts cemented in.",
    image: `${S3}/colorbond-fencing/1788036174542-92d90e01f0e10dae.jpg`,
    basePrice: 100,
    unit: "per lineal metre",
  },
  {
    name: "Aluminium Slat Fencing — 65 x 16.5mm",
    slug: "aluminium-slat-fencing-65mm",
    categorySlug: "slat-fencing",
    shortDescription: "Powder-coated aluminium slat privacy fencing",
    description:
      "Powder-coated Eco-Slat aluminium fencing, 65mm blades, made to measure and installed by our own crews across Perth and the South West.",
    image: `${S3}/gallery/aluminium-slat-fencing-perth/1787905409260-9f458498f2ac1bf4.jpg`,
    basePrice: 190,
    unit: "per lineal metre",
  },
  {
    name: "Garrison Security Fencing — Flat-Top",
    slug: "garrison-security-fencing-flat-top",
    categorySlug: "security-fencing",
    shortDescription: "Welded steel garrison security fencing",
    description:
      "Welded steel garrison panels, flat-top profile — anti-climb by design, powder-coated for coastal WA conditions, engineered for homes and commercial sites.",
    image: `${S3}/gallery/garrison-fencing/1787905689684-d32319398d3487df.jpg`,
    basePrice: 120,
    unit: "per lineal metre",
  },
  {
    name: "Chainmesh Fencing — Galvanised",
    slug: "chainmesh-fencing-galvanised",
    categorySlug: "security-fencing",
    shortDescription: "Galvanised chainmesh perimeter fencing",
    description:
      "Galvanised chainmesh on pipe frameworks — fast, economical perimeter fencing for yards, sports courts, schools and commercial compounds.",
    image: `${S3}/gallery/chainmesh-fencing/1787905564694-fff5ea27842b69b7.jpg`,
    basePrice: 30,
    unit: "per lineal metre",
  },
  {
    name: "Blade Fencing — Radiator Profile",
    slug: "blade-fencing-radiator-profile",
    categorySlug: "blade-fencing",
    shortDescription: "Designer vertical blade fencing",
    description:
      "Designer vertical blade fencing with a deep radiator profile — architectural lines, powder-coated finish, supplied and installed by our own crews.",
    image: `${S3}/services/1786207398440-afcc870ef67608b6.png`,
    basePrice: 190,
    unit: "per lineal metre",
  },
  {
    name: "PVC Privacy Fencing — Full Privacy 1.8m",
    slug: "pvc-privacy-fencing-1-8m",
    categorySlug: "pvc-fencing",
    shortDescription: "Premium uPVC privacy fencing, classic white",
    description:
      "Premium uPVC privacy fencing in classic white, 1.8m full-privacy panels that never need painting. Backed by a 30-year PVC materials warranty.",
    image: `${S3}/services/1786207399282-7c2810059e80dd13.png`,
    basePrice: 160,
    unit: "per lineal metre",
  },
  {
    name: "PVC Picket Fencing — Modern Profile",
    slug: "pvc-picket-fencing-modern",
    categorySlug: "pvc-fencing",
    shortDescription: "Semi-privacy uPVC picket fencing, classic white",
    description:
      "Semi-privacy uPVC picket fencing at around 1.15m, Modern profile in classic white that never needs painting. Backed by a 30-year PVC materials warranty.",
    image: `${S3}/services/1786207399488-be81c0f8c182aca7.png`,
    basePrice: 110,
    unit: "per lineal metre",
  },
  {
    name: "Limestone Retaining Wall — Cream Block",
    slug: "limestone-retaining-wall-cream-block",
    categorySlug: "retaining-walls",
    shortDescription: "Natural limestone block retaining wall",
    description:
      "Natural cream limestone block retaining wall, built to engineered height with proper drainage — the traditional Perth choice for front-of-house walls and garden terracing.",
    image: `${S3}/gallery/limestone-retaining/1787905489749-911e439c58925df6.jpg`,
    basePrice: 190,
    unit: "per square metre",
  },
  {
    name: "Post & Panel Retaining Wall — Concrete Sleeper",
    slug: "post-and-panel-retaining-wall-concrete-sleeper",
    categorySlug: "retaining-walls",
    shortDescription: "Concrete sleeper retaining wall on steel posts",
    description:
      "Plain concrete sleepers dropped into galvanised steel posts — the workhorse retaining system for Perth blocks, engineered to height with drainage and backfill included.",
    image: `${S3}/gallery/post-and-panel-retaining/1787905544786-110dd4f42ee37417.jpg`,
    basePrice: 240,
    unit: "per square metre",
  },
];

async function run() {
  await connectDB();

  console.log("Ensuring shop categories exist...");
  const categoryBySlug = {};
  for (const cat of NEW_CATEGORIES) {
    let doc = await Category.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await Category.create(cat);
      console.log(`Created category: ${cat.name}`);
    }
    categoryBySlug[cat.slug] = doc;
  }

  console.log("\nAdding real products...");
  let created = 0;
  let skipped = 0;

  for (const p of PRODUCTS) {
    const existing = await Product.findOne({ slug: p.slug });
    if (existing) {
      console.log(`SKIP  ${p.name} — already exists`);
      skipped += 1;
      continue;
    }

    let category = categoryBySlug[p.categorySlug];
    if (!category) {
      category = await Category.findOne({ slug: p.categorySlug });
    }
    if (!category) {
      console.log(`SKIP  ${p.name} — category "${p.categorySlug}" not found`);
      skipped += 1;
      continue;
    }

    await Product.create({
      name: p.name,
      slug: p.slug,
      category: category._id,
      shortDescription: p.shortDescription,
      description: p.description,
      images: [p.image],
      unit: p.unit,
      basePrice: p.basePrice,
      inStock: true,
    });
    console.log(`DONE  ${p.name} — $${p.basePrice} ${p.unit}`);
    created += 1;
  }

  console.log(`\n${created} products created, ${skipped} skipped. Nothing was deleted.`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.connection.close();
});
