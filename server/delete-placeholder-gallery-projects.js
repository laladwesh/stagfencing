/**
 * Deletes every GalleryProject document whose cover `image` is still the
 * placeholder ("/hero-bg.png") — i.e. entries that never got a real photo.
 * Scoped only to that exact match — real entries (including ones with a
 * real `images[]` array but a still-placeholder cover) are untouched unless
 * their `image` field itself is the placeholder.
 *
 * Takes a full backup to server/backups/ BEFORE deleting anything, so this
 * is recoverable — see restore-gallery-backup.js.
 *
 * Usage: docker compose exec app node server/delete-placeholder-gallery-projects.js
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./db");
const GalleryProject = require("./models/GalleryProject");

const PLACEHOLDER = "/hero-bg.png";
const BACKUP_DIR = path.join(__dirname, "backups");

async function run() {
  await connectDB();

  const matches = await GalleryProject.find({ image: PLACEHOLDER }).lean();

  if (!matches.length) {
    console.log(`No gallery projects found with image "${PLACEHOLDER}" — nothing to delete.`);
    await mongoose.connection.close();
    return;
  }

  console.log(`Found ${matches.length} project(s) with placeholder image:`);
  matches.forEach((p) => console.log(` - ${p.title} (${p.categorySlug || "?"}/${p.serviceSlug || "?"})`));

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backupPath = path.join(BACKUP_DIR, `gallery-backup-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(matches, null, 2));
  console.log(`\nBacked up ${matches.length} project(s) to ${backupPath}`);

  const res = await GalleryProject.deleteMany({ image: PLACEHOLDER });
  console.log(`Deleted ${res.deletedCount} project(s).`);
  console.log(`\nIf anything needs restoring: docker compose exec app node server/restore-gallery-backup.js ${path.basename(backupPath)}`);

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.connection.close();
});
