require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const ServiceCategory = require("./models/ServiceCategory");

async function run() {
  await connectDB();

  const res = await ServiceCategory.updateOne(
    { slug: "retaining-walls" },
    {
      $set: {
        heroImage:
          "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/gallery/post-and-panel-retaining/1787905562193-8cb8f100a3078866.jpg",
      },
    }
  );
  console.log(`retaining-walls: matched=${res.matchedCount} modified=${res.modifiedCount}`);

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Update failed:", err);
  await mongoose.connection.close();
});
