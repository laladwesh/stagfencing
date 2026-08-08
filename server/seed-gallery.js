require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const GalleryProject = require("./models/GalleryProject");

const IMG = "/hero-bg.png";
const IMAGES = [IMG, IMG, IMG, IMG];

const PROJECTS = [
  {
    title: "Colorbond Fencing Installation",
    suburb: "Byford",
    service: "Colorbond",
    categorySlug: "colorbond-fencing",
    serviceSlug: "colorbond-fencing",
    productSlug: "colorbond-fence-post-2400mm",
    colour: "Monument",
    length: "24 lm",
    completedDate: new Date("2026-06-15"),
  },
  {
    title: "Frameless Glass Pool Fencing",
    suburb: "Baldivis",
    service: "Pool Fencing",
    categorySlug: "pool-fencing",
    serviceSlug: "frameless-glass-pool-fencing",
    productSlug: "frameless-glass-pool-panel-1200x2000",
    length: "18 lm",
    completedDate: new Date("2026-05-20"),
  },
  {
    title: "Aluminium Slat Fencing",
    suburb: "Mandurah",
    service: "Slat Fencing",
    categorySlug: "aluminium-slat-fencing-perth",
    serviceSlug: "aluminium-slat-fencing-perth",
    productSlug: "aluminium-slat-panel-2400mm",
    colour: "Woodland Grey",
    length: "30 lm",
    completedDate: new Date("2026-05-05"),
  },
  {
    title: "Sleeper Retaining Wall",
    suburb: "Ellenbrook",
    service: "Retaining Walls",
    categorySlug: "retaining-walls",
    serviceSlug: "limestone-retaining",
    productSlug: "sleeper-retaining-wall-kit-per-metre",
    length: "12 lm",
    completedDate: new Date("2026-04-18"),
  },
  {
    title: "Automated Sliding Gate",
    suburb: "Armadale",
    service: "Gates & Automation",
    categorySlug: "gates-automation",
    serviceSlug: "sliding-gates",
    length: "6 lm",
    completedDate: new Date("2026-04-02"),
  },
  {
    title: "Garrison Security Fencing",
    suburb: "Joondalup",
    service: "Security Fencing",
    categorySlug: "security-fencing",
    serviceSlug: "garrison-fencing",
    colour: "Monument",
    length: "40 lm",
    completedDate: new Date("2026-03-22"),
  },
  {
    title: "Colorbond Fencing & Gate",
    suburb: "Rockingham",
    service: "Colorbond",
    categorySlug: "colorbond-fencing",
    serviceSlug: "colorbond-fencing",
    colour: "Basalt",
    length: "22 lm",
    completedDate: new Date("2026-03-10"),
  },
  {
    title: "Tubular Aluminium Pool Fencing",
    suburb: "Wanneroo",
    service: "Pool Fencing",
    categorySlug: "pool-fencing",
    serviceSlug: "tubular-aluminium-pool-fencing",
    length: "20 lm",
    completedDate: new Date("2026-02-14"),
  },
  {
    title: "Privacy Slat Fencing",
    suburb: "Bunbury",
    service: "Slat Fencing",
    categorySlug: "aluminium-slat-fencing-perth",
    serviceSlug: "aluminium-slat-fencing-perth",
    colour: "Black",
    length: "28 lm",
    completedDate: new Date("2026-02-01"),
  },
  {
    title: "Limestone Retaining Wall & Steps",
    suburb: "Canning Vale",
    service: "Retaining Walls",
    categorySlug: "retaining-walls",
    serviceSlug: "limestone-retaining",
    productSlug: "sleeper-retaining-wall-kit-per-metre",
    length: "16 lm",
    completedDate: new Date("2026-01-18"),
  },
  {
    title: "Blade Fencing Screen",
    suburb: "Rockingham",
    service: "Blade Fencing",
    categorySlug: "blade-fencing",
    serviceSlug: "blade-fencing",
    length: "14 lm",
    completedDate: new Date("2025-12-20"),
  },
  {
    title: "Chainmesh Security Fencing",
    suburb: "Kwinana",
    service: "Security Fencing",
    categorySlug: "security-fencing",
    serviceSlug: "chainmesh-fencing",
    length: "50 lm",
    completedDate: new Date("2025-12-05"),
  },
  {
    title: "PVC Picket Fencing",
    suburb: "Baldivis",
    service: "PVC Fencing",
    categorySlug: "pvc-fencing",
    serviceSlug: "pvc-picket-fencing",
    productSlug: "pvc-picket-fence-panel-1800mm",
    colour: "White",
    length: "20 lm",
    completedDate: new Date("2025-11-22"),
  },
  {
    title: "Asbestos Fence Removal & Replace",
    suburb: "Gosnells",
    service: "Asbestos Removal",
    categorySlug: "asbestos-fence-removal",
    serviceSlug: "asbestos-fence-removal",
    length: "18 lm",
    completedDate: new Date("2025-11-08"),
  },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing gallery projects...");
  await GalleryProject.deleteMany({});

  console.log("Seeding gallery projects...");
  await GalleryProject.create(
    PROJECTS.map((p, i) => ({ ...p, image: IMAGES[0], images: IMAGES, sortOrder: i }))
  );

  console.log(`Seed complete. ${PROJECTS.length} gallery projects.`);
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
});
