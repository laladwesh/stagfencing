/**
 * Deletes every Product and Review document — this is the fake/demo shop
 * catalog from the original seed.js (8 auto-generated "pagination demo"
 * panel listings, a hero product with nonsensical variants like gate-brand
 * "Centurion/FAAC" attached to a fence panel, a handful of unverified
 * filler products, and entirely fabricated customer reviews with made-up
 * names/comments).
 *
 * Explicitly requested — this IS destructive for Product/Review. Category
 * documents are left alone (they're real topic groupings, still needed by
 * add-real-fencing-products.js).
 *
 * Usage: docker compose exec app node server/clear-scrap-shop-data.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Product = require("./models/Product");
const Review = require("./models/Review");

async function run() {
  await connectDB();

  const productCount = await Product.countDocuments();
  const reviewCount = await Review.countDocuments();

  const productRes = await Product.deleteMany({});
  const reviewRes = await Review.deleteMany({});

  console.log(`Deleted ${productRes.deletedCount}/${productCount} products.`);
  console.log(`Deleted ${reviewRes.deletedCount}/${reviewCount} reviews.`);
  console.log("Categories were left untouched.");
  console.log("\nNext: docker compose exec app node server/add-real-fencing-products.js");

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.connection.close();
});
