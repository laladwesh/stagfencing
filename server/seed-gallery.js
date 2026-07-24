require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const GalleryProject = require("./models/GalleryProject");

const IMG = "/hero-bg.png";

const PROJECTS = [
  { title: "Colorbond Fencing Installation", suburb: "Byford", service: "Colorbond", length: "24 lm", completedDate: new Date("2026-06-15") },
  { title: "Frameless Glass Pool Fencing", suburb: "Baldivis", service: "Pool Fencing", length: "18 lm", completedDate: new Date("2026-05-20") },
  { title: "Aluminium Slat Fencing", suburb: "Mandurah", service: "Slat Fencing", length: "30 lm", completedDate: new Date("2026-05-05") },
  { title: "Sleeper Retaining Wall", suburb: "Ellenbrook", service: "Retaining Walls", length: "12 lm", completedDate: new Date("2026-04-18") },
  { title: "Automated Sliding Gate", suburb: "Armadale", service: "Gates & Automation", length: "6 lm", completedDate: new Date("2026-04-02") },
  { title: "Garrison Security Fencing", suburb: "Joondalup", service: "Security Fencing", length: "40 lm", completedDate: new Date("2026-03-22") },
  { title: "Colorbond Fencing & Gate", suburb: "Rockingham", service: "Colorbond", length: "22 lm", completedDate: new Date("2026-03-10") },
  { title: "Tubular Pool Fencing", suburb: "Wanneroo", service: "Pool Fencing", length: "20 lm", completedDate: new Date("2026-02-14") },
  { title: "Privacy Slat Fencing", suburb: "Bunbury", service: "Slat Fencing", length: "28 lm", completedDate: new Date("2026-02-01") },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing gallery projects...");
  await GalleryProject.deleteMany({});

  console.log("Seeding gallery projects...");
  await GalleryProject.create(
    PROJECTS.map((p, i) => ({ ...p, image: IMG, sortOrder: i }))
  );

  console.log(`Seed complete. ${PROJECTS.length} gallery projects.`);
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
});
