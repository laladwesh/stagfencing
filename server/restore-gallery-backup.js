/**
 * Restores GalleryProject documents from a backup file written by
 * delete-placeholder-gallery-projects.js. Re-inserts with the SAME _id each
 * document originally had, so it's a true undo rather than a duplicate.
 * Skips any id that already exists (safe to re-run).
 *
 * Usage: docker compose exec app node server/restore-gallery-backup.js <backup-filename>
 * e.g.:  docker compose exec app node server/restore-gallery-backup.js gallery-backup-1735689600000.json
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./db");
const GalleryProject = require("./models/GalleryProject");

async function run() {
  const filename = process.argv[2];
  if (!filename) {
    console.error("Usage: node server/restore-gallery-backup.js <backup-filename>");
    process.exit(1);
  }

  const filePath = path.join(__dirname, "backups", filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Backup file not found: ${filePath}`);
    process.exit(1);
  }

  const docs = JSON.parse(fs.readFileSync(filePath, "utf8"));
  await connectDB();

  let restored = 0;
  let skipped = 0;

  for (const doc of docs) {
    const exists = await GalleryProject.findById(doc._id);
    if (exists) {
      console.log(`SKIP  ${doc.title} — already exists`);
      skipped += 1;
      continue;
    }
    await GalleryProject.create(doc);
    console.log(`RESTORED  ${doc.title}`);
    restored += 1;
  }

  console.log(`\n${restored} restored, ${skipped} skipped (already present).`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.connection.close();
});
