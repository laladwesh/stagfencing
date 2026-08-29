require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");
const ServiceCategory = require("./models/ServiceCategory");

const URLS = JSON.parse(
  require("fs").readFileSync(require("path").join(__dirname, "colorbond-image-urls.json"), "utf8")
);

const HERO = URLS["20260827_094515297_iOS.jpg"];
const CARD = URLS["20260822_040015758_iOS.jpg"];
const RECENT_1 = URLS["20260827_094538652_iOS.jpg"];
const RECENT_2 = URLS["20260822_040051901_iOS.jpg"];
const RECENT_3 = URLS["20260822_071238850_iOS.jpg"];

async function run() {
  await connectDB();

  const catRes = await ServiceCategory.updateOne(
    { slug: "colorbond-fencing" },
    { $set: { image: CARD, heroImage: HERO } }
  );
  console.log(`ServiceCategory colorbond-fencing: matched=${catRes.matchedCount} modified=${catRes.modifiedCount}`);

  const svcRes = await Service.updateOne(
    { slug: "colorbond-fencing" },
    {
      $set: {
        cardImage: CARD,
        heroImage: HERO,
        recentJobs: [
          { image: RECENT_1, caption: "Charcoal Colorbond — recent install" },
          { image: RECENT_2, caption: "Cream Colorbond — recent install" },
          { image: RECENT_3, caption: "Bone Colorbond — recent install" },
        ],
      },
    }
  );
  console.log(`Service colorbond-fencing: matched=${svcRes.matchedCount} modified=${svcRes.modifiedCount}`);

  console.log("\nDone — no documents were deleted, only image/heroImage/recentJobs fields updated.");
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Update failed:", err);
  await mongoose.connection.close();
});
