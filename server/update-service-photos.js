require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");
const ServiceCategory = require("./models/ServiceCategory");

const REAL_PHOTOS = JSON.parse(
  require("fs").readFileSync(require("path").join(__dirname, "real-photo-urls.json"), "utf8")
);

async function updateCategory(slug, image, heroImage) {
  const res = await ServiceCategory.updateOne({ slug }, { $set: { image, heroImage } });
  console.log(`ServiceCategory ${slug}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
}

async function updateService(slug, fields) {
  const res = await Service.updateOne({ slug }, { $set: fields });
  console.log(`Service ${slug}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
}

async function run() {
  await connectDB();

  const slat = REAL_PHOTOS["aluminium-slat-fencing-perth"].urls;
  const limestone = REAL_PHOTOS["limestone-retaining"].urls;
  const postPanel = REAL_PHOTOS["post-and-panel-retaining"].urls;
  const chainmesh = REAL_PHOTOS["chainmesh-fencing"].urls;
  const garrison = REAL_PHOTOS["garrison-fencing"].urls;

  console.log("Updating category tile/hero images...");
  await updateCategory("aluminium-slat-fencing-perth", slat[0], slat[1]);
  await updateCategory("retaining-walls", limestone[0], limestone[1]);
  await updateCategory("security-fencing", garrison[0], garrison[1]);

  console.log("\nUpdating service hero/card images + recent jobs...");

  await updateService("aluminium-slat-fencing-perth", {
    cardImage: slat[2],
    heroImage: slat[3],
    recentJobs: [
      { image: slat[4], caption: "Slat fencing — recent install" },
      { image: slat[5], caption: "Slat fencing — recent install" },
      { image: slat[6], caption: "Slat fencing — recent install" },
    ],
  });

  await updateService("limestone-retaining", {
    cardImage: limestone[0],
    heroImage: limestone[1],
    recentJobs: [
      { image: limestone[2], caption: "Limestone retaining — recent install" },
      { image: limestone[3], caption: "Limestone retaining — recent install" },
      { image: limestone[4], caption: "Limestone retaining — recent install" },
    ],
  });

  await updateService("post-and-panel-retaining", {
    cardImage: postPanel[0],
    heroImage: postPanel[1],
    recentJobs: [
      { image: postPanel[2], caption: "Post & Panel retaining — recent install" },
      { image: postPanel[3], caption: "Post & Panel retaining — recent install" },
    ],
  });

  await updateService("garrison-fencing", {
    cardImage: garrison[0],
    heroImage: garrison[1],
    recentJobs: [
      { image: garrison[2], caption: "Garrison fencing — recent install" },
      { image: garrison[3], caption: "Garrison fencing — recent install" },
      { image: garrison[4], caption: "Garrison fencing — recent install" },
    ],
  });

  await updateService("chainmesh-fencing", {
    cardImage: chainmesh[0],
    heroImage: chainmesh[1],
    recentJobs: [
      { image: chainmesh[2], caption: "Chainmesh fencing — recent install" },
      { image: chainmesh[3], caption: "Chainmesh fencing — recent install" },
      { image: chainmesh[4], caption: "Chainmesh fencing — recent install" },
    ],
  });

  console.log("\nDone — no documents were deleted, only image/recentJobs fields updated.");
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Update failed:", err);
  await mongoose.connection.close();
});
