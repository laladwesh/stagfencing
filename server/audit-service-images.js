/**
 * Read-only. Reports which ServiceCategory/Service documents still have the
 * placeholder image ("/hero-bg.png") or no image at all, vs real S3 photos.
 * Makes no changes to the database.
 *
 * Usage: docker compose exec app node server/audit-service-images.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");
const ServiceCategory = require("./models/ServiceCategory");

const PLACEHOLDER = "/hero-bg.png";

function status(url) {
  if (!url) return "MISSING";
  if (url === PLACEHOLDER) return "PLACEHOLDER";
  return "real";
}

async function run() {
  await connectDB();

  const categories = await ServiceCategory.find().sort({ sortOrder: 1 });
  const services = await Service.find().populate("category", "name slug").sort({ name: 1 });

  console.log("=== Service categories ===");
  for (const c of categories) {
    const imgStatus = status(c.image);
    const heroStatus = status(c.heroImage);
    if (imgStatus !== "real" || heroStatus !== "real") {
      console.log(`[NEEDS PHOTO] ${c.name} (${c.slug}) — image: ${imgStatus}, heroImage: ${heroStatus}`);
    } else {
      console.log(`[OK] ${c.name} (${c.slug})`);
    }
  }

  console.log("\n=== Services ===");
  for (const s of services) {
    const cardStatus = status(s.cardImage);
    const heroStatus = status(s.heroImage);
    const styleCount = (s.styles || []).length;
    const pricedStyleCount = (s.styles || []).filter((st) => typeof st.fromPrice === "number").length;
    const recentJobsPlaceholder = (s.recentJobs || []).some((j) => status(j.image) !== "real");
    const flags = [];
    if (cardStatus !== "real") flags.push(`cardImage: ${cardStatus}`);
    if (heroStatus !== "real") flags.push(`heroImage: ${heroStatus}`);
    if (recentJobsPlaceholder) flags.push("recentJobs has placeholder/missing image(s)");
    if (styleCount > 0 && pricedStyleCount === 0) flags.push("no styles have a real numeric price (calculator/quote can't use this service)");

    if (flags.length) {
      console.log(`[NEEDS WORK] ${s.name} (${s.category?.slug || "?"}/${s.slug}) — ${flags.join(", ")}`);
    } else {
      console.log(`[OK] ${s.name} (${s.category?.slug || "?"}/${s.slug})`);
    }
  }

  console.log("\nDone — read-only, nothing was changed.");
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Audit failed:", err);
  await mongoose.connection.close();
});
