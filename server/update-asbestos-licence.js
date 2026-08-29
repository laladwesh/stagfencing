require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");

async function run() {
  await connectDB();

  const res = await Service.updateOne(
    { slug: "asbestos-fence-removal" },
    {
      $set: {
        trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "WA licence WR394"],
        waRules: [
          "In WA, anything over 10m² of asbestos must be removed by a licensed contractor — a fence run is well past that. We hold WA asbestos removal licence WR394.",
          "Never water-blast, cut or snap sheets — it releases fibres and it's illegal on asbestos. Wet-down hand removal only.",
          "Sheets travel double-wrapped under manifest to a licensed facility — disposal receipts come with your invoice.",
        ],
      },
    }
  );
  console.log(`asbestos-fence-removal: matched=${res.matchedCount} modified=${res.modifiedCount}`);

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Update failed:", err);
  await mongoose.connection.close();
});
