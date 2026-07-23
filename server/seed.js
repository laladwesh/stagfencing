require("dotenv").config();
const connectDB = require("./db");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Review = require("./models/Review");

const PLACEHOLDER_IMAGE = "/hero-bg.png";

const CATEGORIES = [
  { name: "Colorbond Fencing", slug: "colorbond-fencing", description: "Genuine BlueScope Colorbond steel panels, posts and accessories.", image: PLACEHOLDER_IMAGE, sortOrder: 1 },
  { name: "Panels & Posts", slug: "panels-posts", parentSlug: "colorbond-fencing", sortOrder: 1 },
  { name: "Pool Fencing", slug: "pool-fencing", description: "Compliant frameless glass and aluminium pool barriers.", image: PLACEHOLDER_IMAGE, sortOrder: 2 },
  { name: "PVC Fencing", slug: "pvc-fencing", description: "Low-maintenance PVC picket and privacy panels.", image: PLACEHOLDER_IMAGE, sortOrder: 3 },
  { name: "Slat Fencing", slug: "slat-fencing", description: "Aluminium slat privacy and screening panels.", image: PLACEHOLDER_IMAGE, sortOrder: 4 },
  { name: "Retaining Walls", slug: "retaining-walls", description: "Sleeper, block and fibre cement retaining wall kits.", image: PLACEHOLDER_IMAGE, sortOrder: 5 },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing shop data...");
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), Review.deleteMany({})]);

  console.log("Seeding categories...");
  const categoryDocs = await Category.create(CATEGORIES);
  const categoryBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c]));

  console.log("Seeding hero product (Colorbond Fencing Panel)...");
  const heroProduct = await Product.create({
    name: "Colorbond Fencing Panel - (2.4m long) 3x Sheets, 2x Posts, 2x Rails, Screws",
    slug: "colorbond-fencing-panel-24m",
    sku: "768521",
    category: categoryBySlug["colorbond-fencing"]._id,
    subCategorySlug: "panels-posts",
    shortDescription: "Colorbond Steel Fencing",
    description:
      "A complete 2.4m Colorbond fencing bay in one kit — everything needed to stand a full panel between two posts. Genuine BlueScope steel that won't rot, warp or burn, pre-cut for WA conditions and backed by a 10-year manufacturer warranty. Pick a colour and height above and the price updates with your selection.",
    images: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
    unit: "each",
    basePrice: 99.5,
    variantGroups: [
      {
        name: "Colour",
        options: [
          { label: "Basalt", priceModifier: 0 },
          { label: "Black", priceModifier: 0 },
          { label: "Dune", priceModifier: 0 },
          { label: "Monument", priceModifier: 0 },
          { label: "Paperbark", priceModifier: 0 },
          { label: "Primrose", priceModifier: 0 },
          { label: "Surfmist", priceModifier: 0 },
          { label: "White", priceModifier: 0 },
          { label: "Woodland Grey", priceModifier: 0, isDefault: true },
        ],
      },
      {
        name: "Finish",
        options: [
          { label: "Powder Coat", priceModifier: 0 },
          { label: "Kwila Wood-Look", priceModifier: 15, isDefault: true },
          { label: "Western Red Cedar", priceModifier: 15 },
          { label: "Matte Black", priceModifier: 8 },
        ],
      },
      {
        name: "Material",
        options: [
          { label: "BlueScope Steel", priceModifier: 0, isDefault: true },
          { label: "Aluminium", priceModifier: 20 },
          { label: "PVC", priceModifier: 10 },
        ],
      },
      {
        name: "Size / Length",
        options: [
          { label: "1800mm", priceModifier: -10 },
          { label: "2400mm", priceModifier: 0, isDefault: true },
          { label: "3000mm", priceModifier: 15 },
        ],
      },
      {
        name: "Height",
        options: [
          { label: "1200mm", priceModifier: -8 },
          { label: "1500mm", priceModifier: -4 },
          { label: "1800mm", priceModifier: 0, isDefault: true },
          { label: "2100mm", priceModifier: 8 },
        ],
      },
      {
        name: "Brand",
        options: [
          { label: "Centurion", priceModifier: 0, isDefault: true },
          { label: "FMC", priceModifier: 0 },
          { label: "D&D Technologies", priceModifier: 0 },
        ],
      },
    ],
    whatsIncluded: [
      "5x Colorbond sheets (2350mm)",
      "2x posts, cement-in",
      "2x rails with connection brackets",
      "Colour-matched screw pack",
    ],
    specifications: [
      { label: "Panel length", value: "2.4m (2350mm sheets)" },
      { label: "Height options", value: "1200-1500-1800-2100mm" },
      { label: "Material", value: "BlueScope COLORBOND® steel" },
      { label: "Colours", value: "9 standard Colorbond colours" },
      { label: "Weatherproofing", value: "Region A & B compliant" },
      { label: "Warranty", value: "10-year manufacturer warranty" },
    ],
    featured: true,
    relatedSlugs: ["colorbond-fence-post-2400mm", "colorbond-post-cap-50x50", "touch-up-paint-300g"],
  });

  console.log("Seeding accessory products...");
  await Product.create([
    {
      name: "Colorbond Fence Post - 2400mm (In-Ground)",
      slug: "colorbond-fence-post-2400mm",
      sku: "768530",
      category: categoryBySlug["colorbond-fencing"]._id,
      subCategorySlug: "panels-posts",
      shortDescription: "Colorbond Steel Fencing",
      description: "Galvanised steel post for in-ground installation, colour-matched to your panel run.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 38.6,
      variantGroups: [
        {
          name: "Height",
          options: [
            { label: "1800mm", priceModifier: 0 },
            { label: "2100mm", priceModifier: 8 },
            { label: "2400mm", priceModifier: 13.4 },
          ],
        },
      ],
      whatsIncluded: ["1x steel post", "Base plate", "Fixing bolts"],
      specifications: [
        { label: "Material", value: "Galvanised steel" },
        { label: "Installation", value: "In-ground, cement fix" },
      ],
      relatedSlugs: ["colorbond-fencing-panel-24m"],
    },
    {
      name: "Colorbond Post Cap - 50 x 50mm",
      slug: "colorbond-post-cap-50x50",
      sku: "768531",
      category: categoryBySlug["colorbond-fencing"]._id,
      subCategorySlug: "panels-posts",
      shortDescription: "Colorbond Steel Fencing",
      description: "Weatherproof cap for 50 x 50mm posts, colour-matched to the standard Colorbond range.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 4.5,
      whatsIncluded: ["1x post cap"],
      specifications: [{ label: "Fits", value: "50 x 50mm posts" }],
      relatedSlugs: ["colorbond-fencing-panel-24m"],
    },
    {
      name: "Touch Up Paint - 300g Spray Can",
      slug: "touch-up-paint-300g",
      sku: "768532",
      category: categoryBySlug["colorbond-fencing"]._id,
      subCategorySlug: "panels-posts",
      shortDescription: "Colorbond Steel Fencing",
      description: "Genuine Colorbond-matched touch-up spray for scuffs and cut edges.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 17.95,
      whatsIncluded: ["1x 300g spray can"],
      specifications: [{ label: "Coverage", value: "Approx. 1sqm per can" }],
      relatedSlugs: ["colorbond-fencing-panel-24m"],
    },
  ]);

  console.log("Seeding extra Colorbond panel listings (for pagination/filter demo)...");
  const paddingSizes = ["1.8m", "2.1m", "2.4m", "3.0m"];
  const paddingColours = ["Woodland Grey", "Monument", "Surfmist", "Basalt"];
  const paddingDocs = [];
  for (let i = 0; i < 8; i += 1) {
    const size = paddingSizes[i % paddingSizes.length];
    const colour = paddingColours[i % paddingColours.length];
    paddingDocs.push({
      name: `Colorbond Fencing Panel - (${size} long) 3x Sheets, 2x Posts, 2x Rails, Screws`,
      slug: `colorbond-fencing-panel-${size.replace(".", "")}-${i}`,
      sku: `76853${i + 3}`,
      category: categoryBySlug["colorbond-fencing"]._id,
      subCategorySlug: "panels-posts",
      shortDescription: "Colorbond Steel Fencing",
      description: `A complete ${size} Colorbond fencing bay in one kit, in ${colour}.`,
      images: [PLACEHOLDER_IMAGE],
      basePrice: 89 + i * 6,
      variantGroups: [
        { name: "Colour", options: paddingColours.map((c) => ({ label: c, priceModifier: 0 })) },
        {
          name: "Height",
          options: [
            { label: "1200mm", priceModifier: -8 },
            { label: "1800mm", priceModifier: 0 },
            { label: "2100mm", priceModifier: 10 },
          ],
        },
      ],
      whatsIncluded: ["3x Colorbond sheets", "2x posts, cement-in", "2x rails with connection brackets"],
      specifications: [
        { label: "Panel length", value: size },
        { label: "Material", value: "BlueScope COLORBOND® steel" },
      ],
      inStock: i !== 3,
    });
  }
  await Product.create(paddingDocs);

  console.log("Seeding one product per other category...");
  await Product.create([
    {
      name: "Frameless Glass Pool Panel - 1200 x 2000mm",
      slug: "frameless-glass-pool-panel-1200x2000",
      sku: "771001",
      category: categoryBySlug["pool-fencing"]._id,
      shortDescription: "Frameless Glass Pool Fencing",
      description: "AS 1926.1 compliant frameless glass panel for a clear-view pool barrier.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 260,
      variantGroups: [
        {
          name: "Glass thickness",
          options: [
            { label: "10mm", priceModifier: 0 },
            { label: "12mm", priceModifier: 45 },
          ],
        },
      ],
      whatsIncluded: ["1x toughened glass panel", "Spigots", "Fixing kit"],
      specifications: [{ label: "Standard", value: "AS 1926.1 compliant" }],
    },
    {
      name: "PVC Picket Fence Panel - 1800mm",
      slug: "pvc-picket-fence-panel-1800mm",
      sku: "772001",
      category: categoryBySlug["pvc-fencing"]._id,
      shortDescription: "PVC Picket Fencing",
      description: "UV-stabilised PVC picket panel — won't rot, warp or need repainting.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 145,
      whatsIncluded: ["1x picket panel", "2x posts", "Fixing kit"],
      specifications: [{ label: "Material", value: "UV-stabilised PVC" }],
    },
    {
      name: "Aluminium Slat Panel - 2400mm",
      slug: "aluminium-slat-panel-2400mm",
      sku: "773001",
      category: categoryBySlug["slat-fencing"]._id,
      shortDescription: "Aluminium Slat Fencing",
      description: "Horizontal slat privacy panel in powder-coated aluminium.",
      images: [PLACEHOLDER_IMAGE],
      basePrice: 175,
      variantGroups: [
        {
          name: "Colour",
          options: [
            { label: "Monument", priceModifier: 0 },
            { label: "Surfmist", priceModifier: 0 },
            { label: "Woodland Grey", priceModifier: 0 },
          ],
        },
      ],
      whatsIncluded: ["1x slat panel", "2x posts", "Fixing kit"],
      specifications: [{ label: "Material", value: "Powder-coated aluminium" }],
    },
    {
      name: "Sleeper Retaining Wall Kit - Per Metre",
      slug: "sleeper-retaining-wall-kit-per-metre",
      sku: "774001",
      category: categoryBySlug["retaining-walls"]._id,
      shortDescription: "Timber Sleeper Retaining",
      description: "Treated pine sleeper retaining wall kit, priced per linear metre.",
      images: [PLACEHOLDER_IMAGE],
      unit: "per metre",
      basePrice: 85,
      variantGroups: [
        {
          name: "Height",
          options: [
            { label: "300mm", priceModifier: 0 },
            { label: "600mm", priceModifier: 40 },
            { label: "900mm", priceModifier: 85 },
          ],
        },
      ],
      whatsIncluded: ["Sleepers", "H-posts", "Fixings"],
      specifications: [{ label: "Material", value: "Treated pine" }],
    },
  ]);

  console.log("Seeding reviews...");
  await Review.create([
    {
      product: heroProduct._id,
      name: "Sarah M.",
      location: "Joondalup, May 2026",
      rating: 5,
      comment:
        "Panel kit was exactly as described — sheets, posts and rails all colour-matched. Up in a weekend with zero missing screws!",
    },
    {
      product: heroProduct._id,
      name: "Daniel R.",
      location: "Rockingham, April 2026",
      rating: 5,
      comment:
        "Ordered Woodland Grey to match the neighbour's run. Click & Collect from Balcatta was painless and it's genuine BlueScope quality.",
    },
    {
      product: heroProduct._id,
      name: "Meg & Tony",
      location: "Bunbury, June 2026",
      rating: 4,
      comment:
        "Second time buying. Delivery driver called ahead and the panels arrived without a scratch. One post cap was the wrong colour, swapped same day.",
    },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
