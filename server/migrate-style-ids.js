// One-off fix: older seeded data saved `styles` subdocuments without a
// persisted `_id` (the schema used to have `_id: false`). Reading those back
// mints a fresh, throwaway `_id` on every request that's never saved, so the
// admin icon-uploader's PUT request never matches — "Style not found".
// This assigns and PERSISTS a real `_id` to any style missing one, without
// touching any other data (icons already uploaded are left alone).
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");

async function migrate() {
  await connectDB();

  const services = await Service.find();
  let fixedServices = 0;
  let fixedStyles = 0;

  for (const service of services) {
    let changed = false;
    for (const style of service.styles) {
      if (!style._id) {
        style._id = new mongoose.Types.ObjectId();
        changed = true;
        fixedStyles += 1;
      }
    }
    if (changed) {
      service.markModified("styles");
      await service.save();
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
