require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const GalleryProject = require("./models/GalleryProject");

const URLS = JSON.parse(
  require("fs").readFileSync(require("path").join(__dirname, "colorbond-image-urls.json"), "utf8")
);

const PROJECTS = [
  {
    title: "Charcoal Colorbond with Limestone Plinth",
    image: URLS["20260827_094515297_iOS.jpg"],
    images: [
      URLS["20260827_094515297_iOS.jpg"],
      URLS["20260827_094538652_iOS.jpg"],
      URLS["20260827_094548086_iOS.jpg"],
    ],
    suburb: "Perth, WA",
    service: "Colorbond Fencing",
    serviceSlug: "colorbond-fencing",
    categorySlug: "colorbond-fencing",
    colour: "Monument",
  },
  {
    title: "Cream Colorbond Boundary Fence",
    image: URLS["20260822_040015758_iOS.jpg"],
    images: [URLS["20260822_040015758_iOS.jpg"], URLS["20260822_040051901_iOS.jpg"]],
    suburb: "Perth, WA",
    service: "Colorbond Fencing",
    serviceSlug: "colorbond-fencing",
    categorySlug: "colorbond-fencing",
    colour: "Classic Cream",
  },
  {
    title: "Colorbond Fence with Slat-Top Gate",
    image: URLS["IMG-20241211-WA0029.jpg"],
    images: [URLS["IMG-20241211-WA0029.jpg"]],
    suburb: "Perth, WA",
    service: "Colorbond Fencing",
    serviceSlug: "colorbond-fencing",
    categorySlug: "colorbond-fencing",
    colour: "Primrose",
  },
];

async function run() {
  await connectDB();

  for (const project of PROJECTS) {
    const created = await GalleryProject.create(project);
    console.log(`Created gallery project: ${created.title} (${created._id})`);
  }

  console.log("\nDone — only new documents were added, nothing was deleted or modified.");
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Add failed:", err);
  await mongoose.connection.close();
});
