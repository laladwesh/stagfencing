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
  { name: "Gates & Automation", slug: "gates-automation", description: "Swing and sliding gates, with automation kits.", sortOrder: 12 },
  { name: "Modular Walls", slug: "modular-walls", description: "Modular boundary wall panels for Perth homes.", sortOrder: 13 },
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
  {
    name: "Frameless Glass Pool Fencing — Spigot-Fixed",
    slug: "frameless-glass-pool-fencing-spigot-fixed",
    categorySlug: "pool-fencing",
    shortDescription: "AS 1926.1 compliant frameless glass pool fencing",
    description:
      "Spigot-fixed frameless glass pool fencing with no visible frame — the fence that disappears so the pool and yard read as one space. AS 1926.1 compliant.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 330,
    unit: "per lineal metre",
  },
  {
    name: "Tubular Aluminium Pool Fencing — Flat-Top",
    slug: "tubular-aluminium-pool-fencing-flat-top",
    categorySlug: "pool-fencing",
    shortDescription: "Powder-coated tubular aluminium pool fencing",
    description:
      "Powder-coated tubular aluminium pool fencing, flat-top profile — rust-free, kid-tough and installed to AS 1926.1 with self-closing, self-latching gates.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 100,
    unit: "per lineal metre",
  },
  {
    name: "Perforated Pool Fencing — Round-Hole",
    slug: "perforated-pool-fencing-round-hole",
    categorySlug: "pool-fencing",
    shortDescription: "Perforated aluminium pool panels",
    description:
      "Perforated aluminium pool panels, round-hole pattern, that screen the pool without boxing it in — non-climbable, rust-free and AS 1926.1 compliant.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 330,
    unit: "per lineal metre",
  },
  {
    name: "Free Standing Batten Fencing — 40mm",
    slug: "free-standing-batten-fencing-40mm",
    categorySlug: "pool-fencing",
    shortDescription: "Free-standing aluminium batten privacy screen",
    description:
      "Free-standing 40mm aluminium batten fencing at compliant sub-100mm spacing — a pool-compliant privacy screen with no visible frame.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 360,
    unit: "per lineal metre",
  },
  {
    name: "Pik Round Batten Fencing — 50mm",
    slug: "pik-round-batten-fencing-50mm",
    categorySlug: "pool-fencing",
    shortDescription: "Cylindrical aluminium batten privacy screen",
    description:
      "Cylindrical 50mm aluminium battens with no visible frame — a softer take on the batten look, at compliant sub-100mm spacing.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 470,
    unit: "per lineal metre",
  },
  {
    name: "Barr Fencing — 40mm Batten",
    slug: "barr-fencing-40mm-batten",
    categorySlug: "pool-fencing",
    shortDescription: "Through-railed aluminium batten fencing",
    description:
      "Horizontal rails threaded through precision-punched 40mm battens, so the fence reads clean and identical from both sides — a true floating-batten look.",
    image: `${S3}/home-services/1788014157388-3085c6c9fcaf5722.png`,
    basePrice: 220,
    unit: "per lineal metre",
  },
  {
    name: "Single Swing Gate — Installed",
    slug: "single-swing-gate-installed",
    categorySlug: "gates-automation",
    shortDescription: "Single swing gate, matched to your fence",
    description:
      "Single swing gate fabricated to your opening, matched to your fence in slat, tubular or Colorbond infill. Priced installed, ready for automation.",
    image: `${S3}/services/1786207396820-59786857961644fb.png`,
    basePrice: 810,
    unit: "each",
  },
  {
    name: "Modular Wall Panel",
    slug: "modular-wall-panel",
    categorySlug: "modular-walls",
    shortDescription: "Modular boundary wall panel",
    description:
      "Practical modular wall panel for a modern boundary — supplied and installed by our own crews across Perth residential properties.",
    image: `${S3}/home-services/1788014159163-f7b3e5ce6ef0b5c3.png`,
    basePrice: 430,
    unit: "per lineal metre",
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
