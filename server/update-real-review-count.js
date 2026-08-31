/**
 * The original seed baked a made-up "5.0 · 300+ Google reviews" (and in a
 * few places "500+") into every service's trustBadges and statTiles. The
 * real Google Business Profile is 4.9 stars / 43 reviews. This corrects the
 * text already live in the database — a one-time static fix, not a live
 * sync. Every occurrence site-wide is currently hardcoded as plain text
 * (client and seed source); update the number by hand again if it changes.
 *
 * Non-destructive — only rewrites matching strings inside existing
 * documents' trustBadges/statTiles arrays. Nothing is deleted.
 *
 * Usage: docker compose exec app node server/update-real-review-count.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");

async function run() {
  await connectDB();

  const services = await Service.find({});
  let modified = 0;

  for (const service of services) {
    let changed = false;

    if (service.trustBadges?.length) {
      const newBadges = service.trustBadges.map((badge) => {
        if (/(?:300|500)\+ Google reviews/.test(badge)) {
          changed = true;
          return badge.replace(/5\.0 · (?:300|500)\+ Google reviews/, "4.9 · 43 Google reviews");
        }
        return badge;
      });
      if (changed) service.trustBadges = newBadges;
    }

    if (service.statTiles?.length) {
      const newTiles = service.statTiles.map((tile) => {
        if (tile.label === "300+ Google reviews" || tile.label === "500+ Google reviews") {
          changed = true;
          return { ...tile.toObject?.() ?? tile, value: "4.9", label: "43 Google reviews" };
        }
        return tile;
      });
      if (changed) service.statTiles = newTiles;
    }

    if (changed) {
      await service.save();
      modified += 1;
      console.log(`Updated: ${service.name} (${service.slug})`);
    }
  }

  console.log(`\nDone — ${modified}/${services.length} services updated, nothing deleted.`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Update failed:", err);
  await mongoose.connection.close();
});
