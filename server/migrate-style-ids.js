// One-off fix: older seeded data saved `styles` subdocuments without a
// persisted `_id` (the schema used to have `_id: false`). Reading those back
// through Mongoose mints a fresh, throwaway `_id` on EVERY read (Mongoose
// auto-generates one in memory whenever a subdocument is missing one, but
// never persists it) — so the admin icon-uploader's PUT request never
// matches the same ID twice. A previous version of this script checked
// `!style._id` after hydrating through Mongoose, which is always false
// (Mongoose already filled it in by then) and silently did nothing.
//
// This version reads the raw stored BSON directly via the native driver
// (bypassing Mongoose's auto-generation-on-read), finds styles genuinely
// missing a persisted `_id`, and writes real ones back — without touching
// any other data (icons already uploaded are left alone).
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");

async function migrate() {
  await connectDB();

  const rawDocs = await Service.collection.find({}).toArray();
  let fixedServices = 0;
  let fixedStyles = 0;

  for (const doc of rawDocs) {
    if (!Array.isArray(doc.styles) || doc.styles.length === 0) continue;

    let changed = false;
    const newStyles = doc.styles.map((style) => {
      if (!style._id) {
        changed = true;
        fixedStyles += 1;
        return { ...style, _id: new mongoose.Types.ObjectId() };
      }
      return style;
    });

    if (changed) {
      await Service.collection.updateOne({ _id: doc._id }, { $set: { styles: newStyles } });
      fixedServices += 1;
    }
  }

  console.log(`Done. Fixed ${fixedStyles} style(s) across ${fixedServices} service(s).`);
  await mongoose.connection.close();
}

migrate().catch(async (err) => {
  console.error("Migration failed:", err);
  await mongoose.connection.close();
});
