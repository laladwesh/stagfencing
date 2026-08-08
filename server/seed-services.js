require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const ServiceCategory = require("./models/ServiceCategory");
const Service = require("./models/Service");

const IMG = "/hero-bg.png";

const AREAS = ["Perth metro", "Joondalup", "Wanneroo", "Rockingham", "Mandurah", "Bunbury & the South West"];

const FENCE_COLOURS = [
  { label: "Basalt", hex: "#4B4D4C" },
  { label: "Black", hex: "#1B1B1B" },
  { label: "Dune", hex: "#9C8768" },
  { label: "Monument", hex: "#3A3B3C" },
  { label: "Paperbark", hex: "#A8927B" },
  { label: "Primrose", hex: "#E9DFAF" },
  { label: "Surfmist", hex: "#E8E4D9" },
  { label: "White", hex: "#FAFAFA" },
  { label: "Woodland Grey", hex: "#6E6C64" },
];

const TIMBER_LOOK = [
  { label: "Jarrah", hex: "#6B3F2A" },
  { label: "Teak", hex: "#8B5A2B" },
];

const SLAT_TIMBER_LOOK = [
  { label: "Kwila", hex: "#6B3F2A" },
  { label: "Western Red Cedar", hex: "#8B5A2B" },
];

const HARDWARE_FINISHES = [
  { label: "Polished Stainless", hex: "#C7C9C7" },
  { label: "Satin Stainless", hex: "#B8B9B4" },
  { label: "Matte Black", hex: "#1C1C1C" },
  { label: "Black", hex: "#1B1B1B" },
  { label: "Monument", hex: "#3A3B3C" },
  { label: "Woodland Grey", hex: "#6E6C64" },
  { label: "Surfmist", hex: "#E8E4D9" },
  { label: "White", hex: "#FAFAFA" },
  { label: "Dune", hex: "#9C8768" },
];

const POOL_POWDER_COLOURS = [
  { label: "Gloss Black", hex: "#161616" },
  { label: "Pearl White", hex: "#F4F3EF" },
  { label: "Matte Black", hex: "#1C1C1C" },
  { label: "Black", hex: "#1B1B1B" },
  { label: "Monument", hex: "#3A3B3C" },
  { label: "Woodland Grey", hex: "#6E6C64" },
  { label: "Surfmist", hex: "#E8E4D9" },
  { label: "White", hex: "#FAFAFA" },
  { label: "Dune", hex: "#9C8768" },
];

const STANDARD_TRUST = (rating = "5.0") => [`${rating} · 300+ Google reviews`, "Licensed & insured"];

function statTiles(warranty, install, extra = "$0", extraLabel = "Measure & written quote") {
  return [
    { value: warranty, label: warranty.includes("yr") ? "Warranty" : "Every barrier certified" },
    { value: install, label: install.includes("day") ? "Typical install" : "Typical install" },
    { value: "5.0", label: "300+ Google reviews" },
    { value: extra, label: extraLabel },
  ];
}

function process(finalStepTitle, finalStepDesc, bookDesc, measureDesc, installDesc) {
  return [
    { title: "Call or book online", description: bookDesc },
    { title: "Free measure", description: measureDesc },
    { title: "Install", description: installDesc },
    { title: finalStepTitle, description: finalStepDesc },
  ];
}

function reviewPool(n1, l1, c1, n2, l2, c2, n3, l3, c3) {
  return [
    { name: n1, location: l1, rating: 5, comment: c1 },
    { name: n2, location: l2, rating: 5, comment: c2 },
    { name: n3, location: l3, rating: 4, comment: c3 },
  ];
}

async function seed() {
  await connectDB();

  console.log("Clearing existing services data...");
  await Promise.all([ServiceCategory.deleteMany({}), Service.deleteMany({})]);

  console.log("Seeding service categories...");
  const categoryDefs = [
    {
      name: "Colorbond Fencing",
      slug: "colorbond-fencing",
      image: IMG,
      fromPrice: 100,
      priceUnit: "per lineal metre",
      sortOrder: 1,
      hasRange: false,
    },
    {
      name: "Slat Fencing Range",
      slug: "aluminium-slat-fencing-perth",
      image: IMG,
      fromPrice: 190,
      priceUnit: "per lineal metre",
      sortOrder: 2,
      hasRange: false,
    },
    {
      name: "Pool Fencing Range",
      slug: "pool-fencing",
      image: IMG,
      fromPrice: 100,
      priceUnit: "per lineal metre",
      sortOrder: 3,
      hasRange: true,
      rangeBannerTitle: "Pool Fencing Range",
      rangeBannerSubtitle: "Six compliant pool fencing styles — glass, aluminium and batten.",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Every compliant way to fence a Perth pool — from frameless glass to budget tubular. Each range below is supplied and installed to AS 1926.1 with certified self-closing gates; tap a range for full pricing, options and recent jobs.",
    },
    {
      name: "Retaining Walls",
      slug: "retaining-walls",
      image: IMG,
      fromPrice: 190,
      priceUnit: "per m²",
      sortOrder: 4,
      hasRange: true,
      rangeBannerTitle: "Retaining Walls",
      rangeBannerSubtitle: "Engineered retaining systems for Perth blocks — Limestone & Post & Panel",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Cream limestone block and concrete post-and-panel retaining for Perth blocks. Both systems are engineered to suit your soil and height, priced per square metre of wall face and installed with drainage and backfill done properly.",
    },
    {
      name: "Gates & Automation",
      slug: "gates-automation",
      image: IMG,
      fromPrice: 690,
      priceUnit: "installed",
      sortOrder: 5,
      hasRange: true,
      rangeBannerTitle: "Gates & Automation",
      rangeBannerSubtitle: "Swing, sliding and automated gates to match your fence",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Gates made to match your fence — swing, sliding and full automation. Every gate below is fabricated to your opening and can be automated with Centurion motors, wired or solar.",
    },
    {
      name: "Security Fencing",
      slug: "security-fencing",
      image: IMG,
      fromPrice: 30,
      priceUnit: "per lineal metre",
      sortOrder: 6,
      hasRange: true,
      rangeBannerTitle: "Security Fencing",
      rangeBannerSubtitle: "Garrison, chainmesh and custom enclosures for serious security",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Serious perimeter security for homes, schools and commercial sites. Pick a system below for pricing and options — every job is engineered for its wind region with gates keyed to suit.",
    },
    {
      name: "Blade Fencing",
      slug: "blade-fencing",
      image: IMG,
      fromPrice: 190,
      priceUnit: "per lineal metre",
      sortOrder: 7,
      hasRange: false,
    },
    {
      name: "Asbestos Fence Removal",
      slug: "asbestos-fence-removal",
      image: IMG,
      fromPrice: 30,
      priceUnit: "per lineal metre",
      sortOrder: 8,
      hasRange: false,
    },
    {
      name: "PVC Fencing Range",
      slug: "pvc-fencing",
      image: IMG,
      fromPrice: 110,
      priceUnit: "per lineal metre",
      sortOrder: 9,
      hasRange: true,
      rangeBannerTitle: "PVC Fencing Range",
      rangeBannerSubtitle: "Six compliant PVC fencing styles — glass, aluminium and batten.",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Low-maintenance uPVC fencing that never needs painting — full-privacy panels and classic picket styles, supplied and installed with a 30-year PVC materials warranty. Tap a range for pricing and options.",
    },
    {
      name: "Modular Walls",
      slug: "modular-walls",
      image: IMG,
      fromPrice: 430,
      priceUnit: "per lineal metre",
      sortOrder: 10,
      hasRange: false,
    },
  ];

  const categoryDocs = await ServiceCategory.create(categoryDefs);
  const catBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c]));

  console.log("Seeding services...");

  const services = [];

  // ---------- Colorbond Fencing (single service) ----------
  services.push({
    category: catBySlug["colorbond-fencing"]._id,
    isCategoryRoot: true,
    name: "Colorbond Fencing",
    slug: "colorbond-fencing",
    cardImage: IMG,
    fromPrice: 100,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Colorbond Fencing",
    bannerTitle: "Colorbond Fencing",
    bannerSubtitle: "Colorbond fencing supplied and installed across Perth — colours matched, offcuts gone",
    bannerCta: "Colorbond Fencing Calculator",
    title: "Colorbond Fencing Perth",
    description:
      "Solid COLORBOND® steel fencing, supplied and installed by our own crews across Perth and the South West. Genuine BlueScope panels in 22 Colorbond colours, posts cemented in, offcuts gone — most standard boundary fences are measured, quoted and installed inside a week.",
    trustBadges: [...STANDARD_TRUST(), "120-day workmanship warranty"],
    statTiles: [
      { value: "120 day", label: "workmanship warranty" },
      { value: "1 week", label: "order to install" },
      { value: "5.0", label: "500+ Google reviews" },
      { value: "$0", label: "measure & written quote" },
    ],
    swatchGroupLabel: "Pick your colour",
    swatchNote: "3 of the 22 Colorbond colours shown — full range available to order",
    swatches: FENCE_COLOURS,
    stylesLabel: "Heights & pricing",
    styles: [
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207392843-f3178349b89487f3.png", name: "1200mm", fromPrice: 100, priceUnit: "lm", popular: true },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207393747-5524d78b01130d8c.png", name: "1500mm", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207393950-a63a70082c37d20f.png", name: "1800mm", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207394154-cfb338114ba615e9.png", name: "2100mm", priceUnit: "priced at quote" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts cemented in-ground, string-lined",
      "Genuine BlueScope panels, rails & capping",
      "Full site cleanup — offcuts & packaging gone",
      "120-day workmanship warranty",
    ],
    popularAddOns: [
      "Old fence removal & tip fees",
      "Asbestos fence removal (licensed)",
      "Lattice or slat height extensions",
      "Matching single & double gates",
      "Plinths for retained or sloping blocks",
    ],
    waRules: [
      "Dividing Fences Act: boundary neighbours usually share the cost — we prepare the paperwork either side can sign.",
      "Footings and post spacing rated to your wind region (N1-N3), coastal or inland.",
      "Pool-side runs certified to AS 1926.1 where the fence forms part of a pool barrier.",
    ],
    processTitle: "From first call to last panel",
    processSteps: process(
      "Walkthrough",
      "You sign off, walking the 120-day workmanship warranty and leave the site clean.",
      "Tell us the boundary, height and colour you have in mind.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Most homes are done in 1 week — posts cemented, panels levelled."
    ),
    recentJobsTitle: "Recent Colorbond jobs around Perth",
    recentJobs: [
      { image: IMG, caption: "Tapping · 42lm · Monument" },
      { image: IMG, caption: "Baldivis · 28lm · Surfmist" },
      { image: IMG, caption: "Karrinyup · 36lm · Woodland Grey" },
    ],
    reviews: reviewPool(
      "Sarah M.",
      "Joondalup, May 2026",
      "Quoted Tuesday, fence up the following Friday. Crew cemented every post and left the yard cleaner than they found it.",
      "Daniel R.",
      "Rockingham, April 2026",
      "Old asbestos fence gone and new Monument Colorbond up in two days. One fixed price, no surprises on the invoice.",
      "Meg & Tony",
      "Bunbury, June 2026",
      "Matched the neighbour's colour perfectly and sorted the shared-cost paperwork for us. Rain pushed the start back a day, hence four stars."
    ),
    faqTitle: "Colorbond FAQs",
    faqs: [
      {
        question: "How much does Colorbond fencing cost in Perth?",
        answer:
          "Colorbond fencing starts from $100 per lineal metre supplied and installed. Height, access and site prep move the final number — your written quote is fixed.",
      },
      {
        question: "Who pays for a boundary fence in WA?",
        answer:
          "Under the Dividing Fences Act, neighbours who share a boundary usually split a standard dividing fence 50/50. We prepare the paperwork so both sides can sign off before work starts.",
      },
      {
        question: "How long does installation take?",
        answer:
          "Most standard boundary runs are measured, quoted and installed within two weeks, with the physical install itself usually done in 1-2 days.",
      },
      {
        question: "Can you build over a retaining wall or sloping block?",
        answer:
          "Yes — we use plinths and stepped panels to keep the fence line straight over sloping or retained ground, priced into your written quote.",
      },
      {
        question: "Is Colorbond okay near the coast?",
        answer:
          "Yes — we rate footings and post spacing to your wind region, and use coastal-grade fixings for exposed sites.",
      },
    ],
    relatedServices: [
      "Aluminium slat fencing",
      "Pool fencing",
      "Gates & automation",
      "Fence removal & disposal",
      "Retaining walls",
    ],
    areasServiced: AREAS,
  });

  // ---------- Slat Fencing Range (single service) ----------
  services.push({
    category: catBySlug["aluminium-slat-fencing-perth"]._id,
    isCategoryRoot: true,
    name: "Slat Fencing Range",
    slug: "aluminium-slat-fencing-perth",
    cardImage: IMG,
    fromPrice: 190,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Slat Fencing",
    bannerTitle: "Aluminium Slat Fencing",
    bannerSubtitle: "Horizontal slat privacy fencing, powder-coated and rust-proof",
    bannerCta: "Get A Free Quote",
    title: "Aluminium Slat Fencing Perth",
    description:
      "Powder-coated Eco-Slat aluminium fencing and privacy screens, made to measure in 38, 65 and 100mm blades — horizontal or vertical, wood-look or Colorbond-matched, installed by our own crews.",
    trustBadges: [...STANDARD_TRUST(), "120-day workmanship warranty"],
    statTiles: [
      { value: "120 day", label: "workmanship warranty" },
      { value: "1 week", label: "order to install" },
      { value: "5.0", label: "500+ Google reviews" },
      { value: "$0", label: "measure & written quote" },
    ],
    swatchGroupLabel: "Pick your colour or wood-look",
    swatchNote: "22 Colorbond powder-coat colours · Kwila & Western Red Cedar wood-look",
    swatches: [...FENCE_COLOURS, ...SLAT_TIMBER_LOOK],
    stylesLabel: "Blades, gaps & pricing",
    styles: [
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207394355-c9ae8dfbcde0756c.png", name: "65 x 16.5mm slat", fromPrice: 190, priceUnit: "lm", popular: true },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207394560-798585e477ceb4b8.png", name: "90 x 16.5mm slat", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207394762-8bb80d03eabffc9e.png", name: "Wood-look 65mm", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207394998-01291e3129d566d0.png", name: "Custom gaps 6-40mm", priceUnit: "privacy line/airflow at quote" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts cemented or plate-mounted to suit",
      "Powder-coated aluminium slats, posts & channels",
      "Full site cleanup — offcuts and packaging gone",
      "120-day workmanship warranty",
    ],
    popularAddOns: [
      "Old fence removal & tip fees",
      "Asbestos fence removal (licensed)",
      "Letterbox, infill & feature panels",
      "Matching slat gates (Gate-Maker kits)",
      "Automation for slat & sliding gates",
    ],
    waRules: [
      "Dividing Fences Act: boundary neighbours usually share the cost — we prepare the paperwork either side can sign.",
      "Screens over 1.8m and exposed sites get engineered posts and footings (wind regions N1-N3).",
      "New pools, horizontal slats need gaps under 10mm to satisfy AS 1926.1 — we flag it at measure.",
    ],
    processTitle: "From first call to last slat",
    processSteps: process(
      "Walkthrough",
      "You sign off, walking the 120-day workmanship warranty and leave the site clean.",
      "Tell us the run, blade size and finish you have in mind.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Screens made to measure, then fitted in 1 week on site."
    ),
    recentJobsTitle: "Recent slat jobs around Perth",
    recentJobs: [
      { image: IMG, caption: "Mount Lawley · 18 lm · Monument 65mm" },
      { image: IMG, caption: "Scarborough · Feature screen · Kwila" },
      { image: IMG, caption: "Applecross · 24 lm · Black 90mm" },
    ],
    reviews: reviewPool(
      "P.K.",
      "Mount Lawley, May 2026",
      "Wanted the kwila look without the timber upkeep — you honestly can't tell it's aluminium until you touch it. Screen was up in a day.",
      "B.T.",
      "Scarborough, June 2026",
      "Measured Monday, powder-coated screens fitted the Thursday after. Gaps set exactly right for privacy from the street.",
      "T.H.",
      "Applecross, April 2026",
      "Matching pedestrian gate closes like a bank vault. Ran a week longer than hoped on school holidays, hence four stars."
    ),
    faqTitle: "Slat fencing FAQs",
    faqs: [
      {
        question: "How much does slat fencing cost in Perth?",
        answer:
          "Aluminium slat fencing and screens start from $190 per lineal metre supplied and installed. Blade size, gaps and access move the number — your written quote is fixed.",
      },
      {
        question: "Who pays for a boundary fence in WA?",
        answer:
          "Under the Dividing Fences Act, neighbours who share a boundary usually split a standard dividing fence 50/50. We prepare the paperwork so both sides can sign off before work starts.",
      },
      {
        question: "How long does installation take?",
        answer: "Most screens are made to measure and fitted within 1 week of your written quote being locked in.",
      },
      {
        question: "Do wood-look slats fade or peel?",
        answer:
          "No — the wood-look finish is a powder-coat woodgrain wrap baked onto the aluminium, so it won't peel, split or grey off like real timber.",
      },
      {
        question: "Can slat fencing go around a pool?",
        answer:
          "Yes — with reduced gaps and non-climbable zone spacing, our slat systems can be built to satisfy AS 1926.1.",
      },
    ],
    relatedServices: ["Colorbond fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
    areasServiced: AREAS,
  });

  // ---------- Pool Fencing Range (6 services) ----------
  const poolCat = catBySlug["pool-fencing"]._id;

  function poolService({
    name,
    slug,
    fromPrice,
    tagline,
    description,
    swatchGroupLabel,
    swatchNote,
    swatches,
    styles,
    installIncludes,
    addOns,
    recentJobsTitle,
    recentJobs,
    reviews,
    faqTitle,
    faqs,
  }) {
    return {
      category: poolCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit: "per lineal metre",
      heroImage: IMG,
      breadcrumbLabel: `Pool Fencing / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Get A Free Quote",
      title: `${name} Pool Fencing`,
      description,
      trustBadges: [...STANDARD_TRUST(), "AS 1926.1 compliant"],
      statTiles: [
        { value: "AS 1926.1", label: "every barrier certified" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      swatchGroupLabel,
      swatchNote: swatchNote || "Spigots, posts & gates — the glass or mesh itself stays clear",
      swatches,
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: installIncludes || [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "Certificate-grade materials, polished edges",
        "Full site cleanup — offcuts & packaging gone",
        "Compliance certificate + workmanship warranty",
      ],
      popularAddOns: addOns || [
        "Old pool fence removal & tip fees",
        "MagnaLatch® self-latching gate upgrades",
        "Soft-close hydraulic hinges & polished pool latch",
        "LED post & garden lighting",
        "Non-climb zone planting & landscaping advice",
      ],
      waRules: [
        "AS 1926.1: 1200mm minimum height, gaps under 100mm and a 900mm non-climbable zone — designed in from the start.",
        "Gates self-close and self-latch from any position, with the release 1500mm off the ground.",
        "WA councils inspect pool barriers — we build to pass first time and hand over the paperwork.",
      ],
      processTitle: "From first call to final inspection",
      processSteps: process(
        "Walkthrough",
        "We check every gap and latch, then hand over the compliance paperwork.",
        "Tell us the pool area, style and gate positions you have in mind.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Core-drilled, cemented and levelled — most pools done in 1 week."
      ),
      recentJobsTitle: recentJobsTitle || `Recent ${name.toLowerCase()} fences around Perth`,
      recentJobs: recentJobs || [
        { image: IMG, caption: "Hillarys · 14 lm" },
        { image: IMG, caption: "Baldivis · 22 lm" },
        { image: IMG, caption: "Dalkeith · Fenced + gate" },
      ],
      reviews:
        reviews ||
        reviewPool(
          "Nadia S.",
          "Hillarys, May 2026",
          `${name} around the plunge pool and you barely know it's there. Passed council inspection on the first visit.`,
          "Chris B.",
          "Baldivis, June 2026",
          "Fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
          "The Levens",
          "Dalkeith, April 2026",
          "Looks fantastic in the afternoon light and the soft-close gate is superb. Spigots covered aren't even late, hence four stars."
        ),
      faqTitle: faqTitle || `${name} FAQs`,
      faqs: faqs || [
        {
          question: `How much does ${name.toLowerCase()} cost?`,
          answer: `${name} starts around $${fromPrice} per lineal metre supplied and installed. Every job is priced off a free on-site measure with a fixed written quote.`,
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Spigots or channel — which mounting is better?", answer: "Spigot-fixed suits most timber or concrete decks; channel mounting gives a cleaner look on new pours — we'll recommend one at your measure." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
      relatedServices: ["Aluminium slat fencing", "Colorbond fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    poolService({
      name: "Frameless Glass",
      slug: "frameless-glass-pool-fencing",
      fromPrice: 330,
      tagline: "Frameless glass pool fencing — 12mm toughened glass on marine-grade spigots",
      description:
        "12mm Grade-A toughened glass on 2205 stainless spigots — supplied and installed to AS 1926.1, with certified self-closing gates and council handover paperwork.",
      swatchGroupLabel: "Frame & hardware finishes",
      swatchNote: "Spigots, posts & gates — the glass itself stays frameless",
      swatches: HARDWARE_FINISHES,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Semi-frameless (budget)", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "Channel-fixed frameless", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Spigot-fixed frameless", fromPrice: 330, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Frameless glass gates", priceUnit: "priced at quote" },
      ],
      installIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "12mm Grade-A toughened glass, polished edges",
        "Full site cleanup — offcuts and packaging gone",
        "Compliance certificate + workmanship warranty",
      ],
      recentJobsTitle: "Recent frameless glass fences in Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · Frameless glass · 14 lm" },
        { image: IMG, caption: "Baldivis · Tubular Black · 22 lm" },
        { image: IMG, caption: "Dalkeith · Frameless + glass gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "Frameless glass around the plunge pool and you barely know it's there. Passed council inspection on the first visit.",
        "Chris B.",
        "Baldivis, June 2026",
        "Tubular fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Glass is spotless and the soft-close gate is superb. Spigot covers arrived a week late, hence four stars."
      ),
      faqTitle: "Frameless glass FAQs",
      faqs: [
        {
          question: "How much does frameless glass pool fencing cost?",
          answer:
            "Frameless glass pool fencing starts from $330 per lineal metre supplied and installed to AS 1926.1. Panel layout and site access move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Spigots or channel — which mounting is better?", answer: "Spigot-fixed suits most timber or concrete decks; channel mounting gives a cleaner look on new pours — we'll recommend one at your measure." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  services.push(
    poolService({
      name: "Tubular Aluminium",
      slug: "tubular-aluminium-pool-fencing",
      fromPrice: 100,
      tagline: "Tubular aluminium pool fencing — powder-coated, rust-proof and installed to AS 1926.1",
      description:
        "Powder-coated tubular aluminium in flat-top and loop-top profiles — rust-free, kid-tough and installed to AS 1926.1 with self-closing, self-latching gates.",
      swatchGroupLabel: "Powder-coat colours",
      swatchNote: "Standard powder-coat range — Colorbond-matched colours available on request",
      swatches: POOL_POWDER_COLOURS,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Loop-top tubular", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "Double-top rail", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Flat-top tubular", fromPrice: 100, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Tubular gates", priceUnit: "priced at quote" },
      ],
      statTiles: [
        { value: "AS 1926.1", label: "every barrier certified" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "500+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      recentJobsTitle: "Recent tubular pool fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · Flat-top tubular · 18 lm" },
        { image: IMG, caption: "Baldivis · Tubular Black · 22 lm" },
        { image: IMG, caption: "Dalkeith · Loop-top + tubular gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "Flat-top tubular around the pool and it just disappears into the garden. Passed council inspection first go and the kids can't budge the gate.",
        "Chris B.",
        "Baldivis, June 2026",
        "Tubular fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Powder-coat finish looks brand new after a full summer. Crew were quick and tidy — one panel bracket needed a follow-up visit, hence four stars."
      ),
      faqTitle: "Tubular aluminium FAQs",
      faqs: [
        {
          question: "How much does tubular pool fencing cost?",
          answer:
            "Tubular aluminium pool fencing starts from $100 per lineal metre supplied and installed to AS 1926.1. Runs, corners and gates move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Flat-top or loop-top — what's the difference?", answer: "Flat-top gives a clean architectural line and is our most popular profile; loop-top adds a rolled top rail for a softer, more traditional look — both are AS 1926.1 compliant." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  services.push(
    poolService({
      name: "Perf Pool",
      slug: "perf-pool-fencing",
      fromPrice: 330,
      tagline: "Perforated aluminium pool panels — privacy, airflow and AS 1926.1 compliance in one screen",
      description:
        "Perforated aluminium panels that screen the pool without boxing it in — non-climbable, rust-free and in Colorbond-matched colours.",
      swatchGroupLabel: "Panel colours & patterns",
      swatchNote: "Powder-coated both faces — Colorbond-matched colours and custom patterns available",
      swatches: POOL_POWDER_COLOURS,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Slotted perf", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "Custom-pattern perf", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Round-hole perf", fromPrice: 330, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Perf pool gates", priceUnit: "priced at quote" },
      ],
      recentJobsTitle: "Recent perf pool fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · Round-hole perf · 16 lm" },
        { image: IMG, caption: "Baldivis · Tubular Black · 22 lm" },
        { image: IMG, caption: "Dalkeith · Slotted perf + gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "Perf panels give us privacy from the neighbours but the pool still gets the sea breeze. Council inspection passed first go.",
        "Chris B.",
        "Baldivis, June 2026",
        "Tubular fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Pattern looks fantastic in the afternoon light. Install was quick and tidy — colour matching took an extra week, hence four stars."
      ),
      faqTitle: "Perf pool fencing FAQs",
      faqs: [
        {
          question: "How much does perf pool fencing cost?",
          answer:
            "Perforated pool fencing starts from $330 per lineal metre supplied and installed to AS 1926.1. Pattern and panel layout move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Is perforated fencing pool compliant?", answer: "Yes — every pattern and hole size we offer is engineered under 100mm gaps to satisfy AS 1926.1." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  services.push(
    poolService({
      name: "Free Standing Batten",
      slug: "free-standing-batten-fencing",
      fromPrice: 360,
      tagline: "Frameless vertical battens — architectural lines, pool-compliant spacing, zero visible frame",
      description:
        "Vertical aluminium battens with no visible frame — architectural lines at compliant sub-100mm spacing, powder-coated or timber-look, installed to AS 1926.1 with certified gates.",
      swatchGroupLabel: "Batten colours & timber looks",
      swatchNote: "Powder-coat and woodgrain-wrap options — Colorbond-matched colours available on request",
      swatches: [...FENCE_COLOURS, ...TIMBER_LOOK],
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Timber-look batten", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "Wide-blade batten", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Standard 40mm batten", fromPrice: 360, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Batten gates", priceUnit: "priced at quote" },
      ],
      addOns: [
        "Old pool fence removal & tip fees",
        "MagnaLatch® self-latching gate upgrades",
        "Timber-look woodgrain wraps — Jarrah, Teak & Oak",
        "LED post & garden lighting",
        "Non-climb zone planting & landscaping advice",
      ],
      recentJobsTitle: "Recent batten fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · 40mm batten · 12 lm" },
        { image: IMG, caption: "Baldivis · Tubular Black · 22 lm" },
        { image: IMG, caption: "Dalkeith · Timber-look + batten gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "The battens read like a designer screen, not a pool fence. Spacing passed council first go and the timber-look hasn't faded.",
        "Chris B.",
        "Baldivis, June 2026",
        "Tubular fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Concealed fixings make the whole run look seamless. One gate needed re-tensioning after a month — sorted same week, hence four stars."
      ),
      faqTitle: "Frameless batten FAQs",
      faqs: [
        {
          question: "How much does batten fencing cost in Perth?",
          answer:
            "Free standing batten fencing starts from $360 per lineal metre supplied and installed. Batten profile and spacing move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Are battens compliant around pools?", answer: "Yes — free standing battens are spaced under 100mm with an engineered non-climbable zone to satisfy AS 1926.1." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  services.push(
    poolService({
      name: "Pik Round Batten",
      slug: "pik-round-batten-fencing",
      fromPrice: 470,
      tagline: "Frameless round battens — soft cylindrical profiles with pool-compliant spacing",
      description:
        "Cylindrical aluminium battens with no visible frame, including organic curved profiles — a softer take on the batten look at compliant sub-100mm spacing.",
      swatchGroupLabel: "Batten colours & timber looks",
      swatchNote: "Powder-coat and woodgrain-wrap options — Colorbond-matched colours available on request",
      swatches: [...FENCE_COLOURS, ...TIMBER_LOOK],
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Timber-look round", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "65mm Pik round batten", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Standard 50mm round", fromPrice: 470, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Round batten gates", priceUnit: "priced at quote" },
      ],
      addOns: [
        "Old pool fence removal & tip fees",
        "MagnaLatch® self-latching gate upgrades",
        "Timber-look woodgrain wraps — Jarrah, Teak & Oak",
        "LED post & garden lighting",
        "Non-climb zone planting & landscaping advice",
      ],
      recentJobsTitle: "Recent Pik round batten fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · 50mm Pik round batten · 11 lm" },
        { image: IMG, caption: "Baldivis · Tubular Black · 22 lm" },
        { image: IMG, caption: "Dalkeith · Timber-look rounds + gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "The round profile catches the light beautifully — softer than flat battens and the pool area feels resort-like. Passed inspection first go.",
        "Chris B.",
        "Baldivis, June 2026",
        "Tubular fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Woodgrain rounds look like real timber without the upkeep. One batten arrived scratched and was swapped promptly, hence four stars."
      ),
      faqTitle: "Round batten FAQs",
      faqs: [
        {
          question: "How much does Pik round batten fencing cost?",
          answer:
            "Pik round batten fencing starts from $470 per lineal metre supplied and installed. Batten size and curves move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "Round or flat battens — which suits my home?", answer: "Round battens suit softer, resort-style gardens; flat battens read more architectural — we'll bring samples of both to your measure." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  services.push(
    poolService({
      name: "Barr Fencing",
      slug: "barr-fencing",
      fromPrice: 220,
      tagline: "Through-rail floating batten fencing — a seamless, identical finish on both sides",
      description:
        "Barr threads the horizontal rails through precision-punched holes in each batten, so the fence reads clean and identical from both sides — a true floating-batten look with nothing bolted on. Powder-coated aluminium, pool-compliant.",
      swatchGroupLabel: "Powder-coat colours",
      swatchNote: "Standard powder-coat range — Colorbond-matched colours available on request",
      swatches: POOL_POWDER_COLOURS,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395201-4c461c6f3e802777.png", name: "Wide 65mm batten", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395408-45d5b2174282be6e.png", name: "Double through-rail", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395610-4e7a6297f50ff1ab.png", name: "Standard 40mm batten", fromPrice: 220, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207395813-5aa4bf7b2609746b.png", name: "Barr gates", priceUnit: "priced at quote" },
      ],
      installIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "Through-rail battens — seamless on both sides",
        "Full site cleanup — offcuts and packaging gone",
        "Compliance certificate + workmanship warranty",
      ],
      addOns: [
        "Old pool fence removal & tip fees",
        "MagnaLatch® self-latching gate upgrades",
        "Colour-matched letterbox & fence returns",
        "LED post & garden lighting",
        "Non-climb zone planting & landscaping advice",
      ],
      recentJobsTitle: "Recent barr fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Hillarys · 40mm batten · 20 lm" },
        { image: IMG, caption: "Baldivis · Standard batten · 22 lm" },
        { image: IMG, caption: "Dalkeith · Wide batten + gate" },
      ],
      reviews: reviewPool(
        "Nadia S.",
        "Hillarys, May 2026",
        "Identical on both sides and nothing rattles in the sea breeze. Inspection passed first go.",
        "Chris B.",
        "Baldivis, June 2026",
        "Batten fence up in a day and the gate latches like it means it. Inspector ticked every box, zero rework.",
        "The Levens",
        "Dalkeith, April 2026",
        "Sharp, squared-off look that suits the render. Install ran a day over on the second stage, hence four stars — finish is faultless."
      ),
      faqTitle: "Barr fencing FAQs",
      faqs: [
        {
          question: "How much does Barr fencing cost in Perth?",
          answer:
            "Barr floating batten fencing starts from $220 per lineal metre supplied and installed. Batten profile and rail count move the number — your written quote is fixed.",
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done within 1 week once your written quote is locked in." },
        { question: "What is Barr through-rail fencing?", answer: "Barr threads the horizontal rails through precision-punched holes in each batten, so there's nothing bolted on and the fence looks identical from both sides." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
    })
  );

  // ---------- Retaining Walls (2 services) ----------
  const retainCat = catBySlug["retaining-walls"]._id;

  const RETAIN_SLEEPER_COLOURS = [
    { label: "Smooth Grey", hex: "#9A9A97" },
    { label: "Charcoal", hex: "#3A3B3C" },
    { label: "Limestone", hex: "#D8CBB0" },
    { label: "Woodgrain", hex: "#8B5A2B" },
    { label: "Sandstone", hex: "#C9AE83" },
    { label: "Monument", hex: "#3A3B3C" },
    { label: "Basalt", hex: "#4B4D4C" },
    { label: "Dune", hex: "#9C8768" },
    { label: "Black", hex: "#1B1B1B" },
  ];

  function retainService({
    name,
    slug,
    fromPrice,
    tagline,
    bannerCta,
    description,
    swatchGroupLabel,
    swatchNote,
    swatches,
    styles,
    installIncludes,
    processStepBook,
    processStepInstall,
    processStepWalkthrough,
    recentJobsTitle,
    recentJobs,
    reviews,
    faqTitle,
    faqs,
  }) {
    return {
      category: retainCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit: "per m²",
      heroImage: IMG,
      breadcrumbLabel: `Retaining Walls / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: bannerCta || "Retaining Calculator",
      title: `${name} Retaining Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Engineering on request"],
      statTiles: [
        { value: "120 day", label: "workmanship warranty" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      swatchGroupLabel: swatchGroupLabel || "Sleeper finishes",
      swatchNote: swatchNote || "Powder-coated sleepers — Colorbond-matched colours available",
      swatches,
      stylesLabel: "Wall options & pricing",
      styles,
      everyInstallIncludes: installIncludes || [
        "Free on-site measure & fixed written quote",
        "Site cut, levels and string-lines set",
        "Sleepers clip-lock and cut to width on site",
        "Ag-pipe drainage & gravel backfill behind the wall",
        "Engineer certification where required + workmanship warranty",
      ],
      popularAddOns: [
        "Old wall demolition & removal",
        "Limestone-look & feature capping",
        "Fence brackets on top of the wall",
        "Steps, corners & tiered garden beds",
        "Council permit lodgement handled for you",
      ],
      waRules: [
        "Walls retaining over 500mm need an engineer's design and a council building permit — we arrange both.",
        "Retaining isn't covered by the Dividing Fences Act — we'll clarify who's responsible before anyone pays.",
        "Surcharge loads from driveways, pools and sheds are allowed for in the design, with drainage to code.",
      ],
      processTitle: "From first call to final backfill",
      processSteps: process(
        "Walkthrough",
        "You sign off, we hand over certification and leave the site clean.",
        processStepBook || "Tell us the wall length, height and what sits above it.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        processStepInstall || "Sleepers stacked and clipped, drainage set — backfilled and compacted."
      ),
      recentJobsTitle: recentJobsTitle || `Recent ${name} walls around Perth`,
      recentJobs: recentJobs || [
        { image: IMG, caption: "Wanneroo · 18m · In concrete" },
        { image: IMG, caption: "Byford · Tiered · Woodgrain" },
        { image: IMG, caption: "Duncraig · 12m · Monument" },
      ],
      reviews:
        reviews ||
        reviewPool(
          "Marcus D.",
          "Wanneroo, May 2026",
          "Sloping block terraced into two flat lawns. Engineer drawings, permit, drainage — all sorted without us chasing a thing.",
          "Jess & Sam",
          "Byford, June 2026",
          "Old limestone wall was leaning badly. The new wall went up in three days and the backfill was spotless.",
          "Alan P.",
          "Duncraig, April 2026",
          "Woodgrain finish looks like timber sleepers but won't ever rot. Crane day moved once for weather, hence four stars."
        ),
      faqTitle: faqTitle || `${name} FAQs`,
      faqs: faqs || [
        {
          question: `How much do ${name.toLowerCase()} retaining walls cost?`,
          answer: `${name} retaining walls start from $${fromPrice} per square metre of wall face, supplied and installed. Height, engineering and access move the number — your written quote is fixed.`,
        },
        { question: "Do I need council approval for a retaining wall?", answer: "Walls over 500mm need an engineer's design and a council building permit — we arrange both as part of the job." },
        { question: "How long does installation take?", answer: "Most standard walls are done within 1 week depending on length and access." },
        { question: "Who pays for a retaining wall on a boundary?", answer: "Retaining isn't covered by the Dividing Fences Act — responsibility depends on who benefits from the wall, we'll clarify before anyone pays." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Colorbond fencing"],
      areasServiced: AREAS,
    };
  }

  services.push(
    retainService({
      name: "Limestone",
      slug: "limestone-retaining",
      fromPrice: 190,
      tagline: "Limestone stackable sleepers — retaining walls and under-fence plinths, rot- and termite-proof",
      description:
        "Cream reconstituted limestone blocks on engineered footings — the classic Perth retaining look for pools, terraces and boundary walls. Priced per square metre of wall face, engineered to your soil and height, with drainage and backfill done properly.",
      swatchNote: "Smooth & woodgrain Limestone sleepers — colours to match your fence",
      swatches: RETAIN_SLEEPER_COLOURS,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396017-fc22203a54e43243.png", name: "Cream limestone block", fromPrice: 190, priceUnit: "m²", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396217-46571f4ff0f6d54d.png", name: "Capping & piers", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396419-521d71d538e665e5.png", name: "Under-fence plinth", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396622-67b49f64ee71fb37.png", name: "Supply + install", priceUnit: "priced at on-site quote" },
      ],
      recentJobsTitle: "Recent Limestone walls around Perth",
      recentJobs: [
        { image: IMG, caption: "Wanneroo · 18m · In concrete" },
        { image: IMG, caption: "Byford · Tiered · Limestone Woodgrain" },
        { image: IMG, caption: "Duncraig · 12m · Limestone Smooth" },
      ],
      reviews: reviewPool(
        "Marcus D.",
        "Wanneroo, May 2026",
        "Sloping block terraced into two flat lawns. Engineer drawings, permit, drainage — all sorted without us chasing a thing.",
        "Jess & Sam",
        "Byford, June 2026",
        "Old limestone wall was leaning badly. The new Limestone sleeper wall went up in three days and the backfill was spotless.",
        "Alan P.",
        "Duncraig, April 2026",
        "Woodgrain Limestone looks like timber sleepers but won't ever rot. Crane day moved once for weather, hence four stars — wall itself is faultless."
      ),
      faqTitle: "Limestone FAQs",
      faqs: [
        {
          question: "How much do limestone retaining walls cost?",
          answer:
            "Limestone retaining walls start from $190 per square metre of wall face, supplied and installed. Height, engineering and access move the number — your written quote is fixed.",
        },
        { question: "Do I need council approval for a retaining wall?", answer: "Walls over 500mm need an engineer's design and a council building permit — we arrange both as part of the job." },
        { question: "How long does installation take?", answer: "Most standard walls are done within 1 week depending on length and access." },
        { question: "Who pays for a retaining wall on a boundary?", answer: "Retaining isn't covered by the Dividing Fences Act — responsibility depends on who benefits from the wall, we'll clarify before anyone pays." },
        { question: "Limestone or concrete sleepers — which one?", answer: "Limestone gives the classic Perth look and suits heritage-style homes; concrete Post & Panel is faster to install and takes greater heights — we'll talk you through the trade-off at your free measure." },
      ],
    })
  );

  services.push(
    retainService({
      name: "Post & Panel",
      slug: "post-and-panel-retaining",
      fromPrice: 240,
      tagline: "Post & Panel aluminium stackable sleepers — featherweight, Colorbond-matched, walls up to 800mm",
      description:
        "Concrete sleepers — plain or sandstone-look — dropped into galvanised steel posts. The workhorse retaining system for Perth blocks: engineered to height, priced per square metre of wall face, drainage and backfill included.",
      swatchGroupLabel: "Sleeper colours",
      swatchNote: "Powder-coated Post & Panel sleepers — Colorbond-matched colours standard",
      swatches: RETAIN_SLEEPER_COLOURS,
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396017-fc22203a54e43243.png", name: "Plain concrete sleeper", fromPrice: 240, priceUnit: "m²", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396217-46571f4ff0f6d54d.png", name: "Sandstone-look sleeper", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396419-521d71d538e665e5.png", name: "Under-fence plinth", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396622-67b49f64ee71fb37.png", name: "Supply + install", priceUnit: "priced at on-site quote" },
      ],
      installIncludes: [
        "Free on-site measure & fixed written quote",
        "Site cut, levels and string-lines set",
        "Colour-matched 75x75mm posts, sleepers clipped in",
        "Ag-pipe drainage & gravel backfill behind the wall",
        "Engineer certification where required + workmanship warranty",
      ],
      processStepInstall: "Posts set, sleepers slotted and clipped, drainage in — backfilled.",
      recentJobsTitle: "Recent Post & Panel walls around Perth",
      recentJobs: [
        { image: IMG, caption: "Wanneroo · 18m · 1m concrete" },
        { image: IMG, caption: "Byford · Tiered · Post & Panel Basalt" },
        { image: IMG, caption: "Duncraig · 12m · Post & Panel Monument" },
      ],
      reviews: reviewPool(
        "Marcus D.",
        "Wanneroo, May 2026",
        "Sloping block terraced into two flat lawns. Engineer drawings, permit, drainage — all sorted without us chasing a thing.",
        "Jess & Sam",
        "Byford, June 2026",
        "Old limestone wall was leaning badly. The new Post & Panel wall went up in three days and the backfill was spotless.",
        "Alan P.",
        "Duncraig, April 2026",
        "Post & Panel matches our Monument fence perfectly. Crane day moved once for weather, hence four stars."
      ),
      faqTitle: "Post & Panel FAQs",
      faqs: [
        {
          question: "How much do post & panel retaining walls cost?",
          answer:
            "Post and panel retaining walls start from $240 per square metre of wall face, supplied and installed. Height, engineering and access move the number — your written quote is fixed.",
        },
        { question: "Do I need council approval for a retaining wall?", answer: "Walls over 500mm need an engineer's design and a council building permit — we arrange both as part of the job." },
        { question: "How long does installation take?", answer: "Most standard walls are done within 1 week depending on length and access." },
        { question: "Who pays for a retaining wall on a boundary?", answer: "Retaining isn't covered by the Dividing Fences Act — responsibility depends on who benefits from the wall, we'll clarify before anyone pays." },
        { question: "Post & Panel or Limestone — which one?", answer: "Post & Panel is faster to install and takes greater heights; Limestone gives the classic Perth look — we'll talk you through the trade-off at your free measure." },
      ],
    })
  );

  // ---------- Gates & Automation (3 services) ----------
  const gatesCat = catBySlug["gates-automation"]._id;

  function gateService({
    name,
    slug,
    fromPrice,
    priceUnit,
    tagline,
    description,
    swatchGroupLabel,
    styles,
    recentJobsTitle,
    recentJobs,
    reviews,
    faqTitle,
    faqs,
  }) {
    return {
      category: gatesCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit,
      heroImage: IMG,
      breadcrumbLabel: `Gates & Automation / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Get A Free Quote",
      title: name === "Automation" ? "Gate Automation Perth" : `${name} Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Centsys & FAAC dealer"],
      statTiles: [
        { value: "120 day", label: "workmanship warranty" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      swatchGroupLabel: swatchGroupLabel || "Match your fence colour",
      swatchNote: "Matches your fence range — 22 Colorbond colours, slat & tubular infills",
      swatches: FENCE_COLOURS,
      stylesLabel: "Gate types & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts and hinges engineered for the gate weight",
        "Powder-coated frame with infill matched to your fence",
        "Full site cleanup — offcuts and packaging gone",
        "120-day workmanship warranty",
      ],
      popularAddOns: [
        "Automation retrofit to your existing gate",
        "Solar power & battery backup",
        "Video intercom & keypad entry",
        "Extra remotes & smart-phone control",
        "Photocells & safety edges",
      ],
      waRulesTitle: "Automated the safe way — handled for you",
      waRules: [
        "Powered gates installed to AS/NZS 60335.2.103 — obstruction sensing, safe force limits and a manual release for outages.",
        "Photocells and safety edges specified wherever kids, pets or the public cross the gate line.",
        "240V runs done by a licensed electrician; solar kits where trenching doesn't make sense.",
      ],
      processTitle: "From first call to first click of the remote",
      processSteps: process(
        "Walkthrough",
        "We pair your remotes and phones, then hand over manuals and warranty.",
        name === "Automation"
          ? "Tell us the gate type, opening size and power situation."
          : "Tell us the opening, the look and whether you want it automated.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Gate fabricated to size, hung and automated — most in a single day."
      ),
      recentJobsTitle: recentJobsTitle || `Recent ${name.toLowerCase()} around Perth`,
      recentJobs: recentJobs || [
        { image: IMG, caption: "Karrinyup · Double swing · Monument" },
        { image: IMG, caption: "Canning Vale · Single swing + kit" },
        { image: IMG, caption: "Nedlands · Slat pedestrian gate" },
      ],
      reviews:
        reviews ||
        reviewPool(
          "Rohan V.",
          "Karrinyup, May 2026",
          "Double swing gates automated with the Centsys kit — the app has them open before we're in the street. Neat wiring, dead-level hang.",
          "Dana W.",
          "Canning Vale, June 2026",
          "Double swing over the driveway closes dead level every time — hinges feel like they'll outlast the house.",
          "The Ngs",
          "Nedlands, April 2026",
          "Pedestrian gate matches the slat fence perfectly. Second remote took a fortnight to arrive, hence four stars."
        ),
      faqTitle: faqTitle || `${name} FAQs`,
      faqs: faqs || [
        { question: `How much does a ${name.toLowerCase()} cost in Perth?`, answer: `${name} starts from $${fromPrice} ${priceUnit === "installed" ? "supplied and fitted" : priceUnit}. Opening size, materials and automation move the number — your written quote is fixed.` },
        { question: "Swing or sliding — which suits my driveway?", answer: "Swing suits most standard driveways; sliding is better where space in front of the gate is tight or sloped." },
        { question: "How long does installation take?", answer: "Most gates are fabricated, hung and automated in a single day once your written quote is locked in." },
        { question: "What happens in a power outage?", answer: "Every automated gate has a manual release so you're never locked in or out." },
        { question: "Can you automate my existing gate?", answer: "In most cases yes — we'll check your gate's weight and frame during the free measure." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Security fencing", "Fence removal & disposal", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    gateService({
      name: "Swing Gates",
      slug: "swing-gates",
      fromPrice: 810,
      priceUnit: "installed",
      tagline: "Single & double swing gates — made to match your fence, automated on request",
      description:
        "Single and double swing gates fabricated to your opening — matched to your fence in slat, tubular or Colorbond infill, and automated with Centsys swing kits.",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396820-59786857961644fb.png", name: "Single swing", fromPrice: 810, priceUnit: "installed", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397020-bebcd2953be329dd.png", name: "Double swing", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397226-d78fd6d1498ae8b6.png", name: "Pedestrian gate", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397429-dff52ff2e7eec1e4.png", name: "Swing automation kits", fromPrice: 1190, priceUnit: "fitted" },
      ],
    })
  );

  services.push(
    gateService({
      name: "Sliding Gates",
      slug: "sliding-gates",
      fromPrice: 1710,
      priceUnit: "installed",
      tagline: "Track & cantilever sliding gates — big openings, tight driveways, one-finger glide",
      description:
        "Track-mounted and cantilever sliding gates for wide or sloping openings — matched to your fence and automated with Centsys D-series slide motors.",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396820-59786857961644fb.png", name: "Track-mounted slider", fromPrice: 1710, priceUnit: "installed", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397020-bebcd2953be329dd.png", name: "Cantilever slider", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397226-d78fd6d1498ae8b6.png", name: "Telescopic slider", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397429-dff52ff2e7eec1e4.png", name: "Slide automation kits", fromPrice: 1190, priceUnit: "fitted" },
      ],
      recentJobsTitle: "Recent sliding gates around Perth",
      recentJobs: [
        { image: IMG, caption: "Karrinyup · Cantilever · Monument" },
        { image: IMG, caption: "Canning Vale · Sliding · D5 SMART" },
        { image: IMG, caption: "Nedlands · Track slider · slat infill" },
      ],
      reviews: reviewPool(
        "Rohan V.",
        "Karrinyup, May 2026",
        "Cantilever slider swallows our sloped driveway with room to spare — the app has it open before we're off the street.",
        "Dana W.",
        "Canning Vale, June 2026",
        "Sliding gate glides on one finger even unpowered. The manual release saved us in the first blackout.",
        "The Ngs",
        "Nedlands, April 2026",
        "Track slider matches the slat fence perfectly. Second remote took a fortnight to arrive, hence four stars — gate itself is superb."
      ),
      faqTitle: "Sliding gate FAQs",
      faqs: [
        { question: "How much does a sliding gate cost in Perth?", answer: "Sliding gates start from $1,710 supplied and fitted. Opening width, track type and automation move the number — your written quote is fixed." },
        { question: "Swing or sliding — which suits my driveway?", answer: "Swing suits most standard driveways; sliding is better where space in front of the gate is tight or sloped." },
        { question: "How long does installation take?", answer: "Most gates are fabricated, hung and automated in a single day once your written quote is locked in." },
        { question: "What happens in a power outage?", answer: "Every automated gate has a manual release so you're never locked in or out." },
        { question: "Can you automate my existing gate?", answer: "In most cases yes — we'll check your gate's weight and frame during the free measure." },
      ],
    })
  );

  services.push(
    gateService({
      name: "Automation",
      slug: "automation",
      fromPrice: 1190,
      priceUnit: "fitted",
      tagline: "Centsys gate automation — new installs and retrofits, wired or solar",
      description:
        "Centsys swing and slide motors fitted to new gates or retrofitted to yours — obstruction sensing, battery backup and app control, hardwired or solar.",
      swatchGroupLabel: "Match your gate colour",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207396820-59786857961644fb.png", name: "Swing kit (single)", fromPrice: 1190, priceUnit: "fitted", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397020-bebcd2953be329dd.png", name: "Swing kit (double)", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397226-d78fd6d1498ae8b6.png", name: "Slide kit (D5 SMART)", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397429-dff52ff2e7eec1e4.png", name: "Solar power packs", priceUnit: "priced at quote" },
      ],
      recentJobsTitle: "Recent automation jobs around Perth",
      recentJobs: [
        { image: IMG, caption: "Karrinyup · Swing kit retrofit" },
        { image: IMG, caption: "Canning Vale · Sliding + D5 SMART" },
        { image: IMG, caption: "Nedlands · Solar slide kit" },
      ],
      reviews: reviewPool(
        "Rohan V.",
        "Karrinyup, May 2026",
        "Double swing gates automated with the Centsys kit — the app has them open before we're in the street. Neat wiring, dead-level hang.",
        "Dana W.",
        "Canning Vale, June 2026",
        "Sliding gate glides on one finger even unpowered. The manual release saved us in the first blackout.",
        "The Ngs",
        "Nedlands, April 2026",
        "Retrofit kit brought our 10-year-old gate back to life. Second remote took a fortnight to arrive, hence four stars."
      ),
      faqTitle: "Gate automation FAQs",
      faqs: [
        { question: "How much does gate automation cost in Perth?", answer: "Gate automation starts from $1,190 per Centsys or FAAC motor, fitted. Gate weight, solar and accessories move the number — your written quote is fixed." },
        { question: "Wired or solar — which is better?", answer: "Wired suits gates near mains power; solar suits remote entries where trenching isn't practical — either keeps a battery backup for outages." },
        { question: "How long does installation take?", answer: "Most gates are fabricated, hung and automated in a single day once your written quote is locked in." },
        { question: "What happens in a power outage?", answer: "Every automated gate has a manual release so you're never locked in or out." },
        { question: "Can you automate my existing gate?", answer: "In most cases yes — we'll check your gate's weight and frame during the free measure." },
      ],
    })
  );

  // ---------- Security Fencing (3 services) ----------
  const securityCat = catBySlug["security-fencing"]._id;

  function securityService({
    name,
    slug,
    fromPrice,
    priceUnit,
    tagline,
    description,
    swatchNote,
    styles,
    recentJobsTitle,
    recentJobs,
    reviews,
    faqTitle,
    faqs,
  }) {
    return {
      category: securityCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit,
      heroImage: IMG,
      breadcrumbLabel: `Security Fencing / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Get A Free Quote",
      title: name === "Enclosures" ? "Security Enclosures Perth" : `${name} Fencing Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Homes & commercial"],
      statTiles: [
        { value: "120 day", label: "workmanship warranty" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      swatchGroupLabel: "Powder-coat colours",
      swatchNote: swatchNote || "Black as standard — powder-coat to any of 22 Colorbond colours",
      swatches: FENCE_COLOURS,
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-set in concrete at engineered centres",
        "Galvanised + powder-coated steel panels & fixings",
        "Full site cleanup — offcuts and packaging gone",
        "120-day workmanship warranty",
      ],
      popularAddOns: [
        "Old fence removal & tip fees",
        "Matching pedestrian & sliding gates",
        "Access control — keypads & swipe entry",
        "Anti-climb spikes & extensions",
        "CCTV & lighting conduit runs",
      ],
      waRulesTitle: "Built to WA rules — handled for you",
      waRules: [
        "Front boundaries: open garrison usually earns more height allowance than solid fencing — we confirm your council's rules.",
        "Anti-climb by design: spear tops and rail positions that leave no foothold, following CPTED principles.",
        "Commercial runs engineered for wind region and soil, with gates keyed alike across the site.",
      ],
      processTitle: "From first call to locked gate",
      processSteps: process(
        "Walkthrough",
        "Keys and remotes handed over, warranty logged, site left clean.",
        "Tell us the perimeter, the height and what you're protecting.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Panels bolted at engineered centres — most sites done in 1-3 days."
      ),
      recentJobsTitle: recentJobsTitle || `Recent ${name.toLowerCase()} fences around Perth`,
      recentJobs: recentJobs || [
        { image: IMG, caption: "Malaga · Warehouse · 86 lm spear-top" },
        { image: IMG, caption: "Como · School boundary · Flat-top" },
        { image: IMG, caption: "Balcatta · Garrison + keyed gates" },
      ],
      reviews:
        reviews ||
        reviewPool(
          "Tony M.",
          "Malaga, May 2026",
          "Spear-top garrison around the yard and the break-ins stopped. Straight runs, clean welds, done in two days.",
          "Leanne F.",
          "Como, June 2026",
          "School boundary replaced over the holidays with zero disruption. Paperwork and site induction handled without chasing.",
          "Strata WA",
          "Balcatta, April 2026",
          "Matching garrison gates keyed alike across the site — one hinge adjusted after handover, hence four stars."
        ),
      faqTitle: faqTitle || `${name} fencing FAQs`,
      faqs: faqs || [
        { question: `How much does ${name.toLowerCase()} fencing cost in Perth?`, answer: `${name} security fencing starts from $${fromPrice} ${priceUnit === "per lineal metre" ? "per lineal metre" : priceUnit} supplied and installed. Runs and gates move the number — your written quote is fixed.` },
        { question: "How high can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we confirm your council's rules." },
        { question: "How long does installation take?", answer: "Most sites are done within 1 week depending on length and gate count." },
        { question: "Garrison or chainmesh — which do I need?", answer: "Garrison suits street frontages and higher-visibility security; chainmesh suits large perimeter or commercial runs on a budget." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    securityService({
      name: "Garrison",
      slug: "garrison-fencing",
      fromPrice: 120,
      priceUnit: "per lineal metre",
      tagline: "Garrison steel security fencing — flat-top and spear-top, engineered anti-climb",
      description:
        "Welded steel garrison panels in flat-top and spear-top profiles — anti-climb by design, powder-coated for coastal WA and engineered for homes, schools and commercial sites.",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397633-23071dd351bd698f.png", name: "Garrison flat-top", fromPrice: 120, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397835-09f83ea4b2037789.png", name: "Garrison spear-top", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398035-51c571723649d11e.png", name: "Garrison gates", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398237-43f434c43a33b72e.png", name: "Commercial runs", priceUnit: "engineered · priced at quote" },
      ],
      recentJobsTitle: "Recent garrison fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Malaga · Warehouse · 86 lm spear-top" },
        { image: IMG, caption: "Como · School boundary · Flat-top" },
        { image: IMG, caption: "Balcatta · Garrison + keyed gates" },
      ],
      faqTitle: "Garrison fencing FAQs",
      faqs: [
        { question: "How much does garrison fencing cost in Perth?", answer: "Garrison security fencing starts from $120 per lineal metre supplied and installed in 1.8m or 2.1m heights. Runs and gates move the number — your written quote is fixed." },
        { question: "How high can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we confirm your council's rules." },
        { question: "How long does installation take?", answer: "Most sites are done within 1 week depending on length and gate count." },
        { question: "Garrison or chainmesh — which do I need?", answer: "Garrison suits street frontages and higher-visibility security; chainmesh suits large perimeter or commercial runs on a budget." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
    })
  );

  services.push(
    securityService({
      name: "Chainmesh",
      slug: "chainmesh-fencing",
      fromPrice: 30,
      priceUnit: "per lineal metre",
      tagline: "Chainmesh fencing — the workhorse perimeter for yards, courts and commercial sites",
      description:
        "Galvanised and PVC-coated chainmesh on pipe frameworks — fast, economical perimeter fencing for yards, sports courts, schools and commercial compounds.",
      swatchNote: "Galvanised as standard · PVC-coated in black or green",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397633-23071dd351bd698f.png", name: "Galvanised chainmesh", fromPrice: 30, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397835-09f83ea4b2037789.png", name: "PVC-coated (black/green)", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398035-51c571723649d11e.png", name: "Barbed-wire topped", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398237-43f434c43a33b72e.png", name: "Chainmesh gates", priceUnit: "single & double · at quote" },
      ],
      recentJobsTitle: "Recent chainmesh fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Malaga · Warehouse · 120 lm chainmesh" },
        { image: IMG, caption: "Como · Tennis court · PVC black" },
        { image: IMG, caption: "Balcatta · Compound + double gates" },
      ],
      faqTitle: "Chainmesh FAQs",
      faqs: [
        { question: "How much does chainmesh fencing cost in Perth?", answer: "Chainmesh fencing starts from $30 per lineal metre supplied and installed. Height, coating and gates move the number — your written quote is fixed." },
        { question: "How high can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we confirm your council's rules." },
        { question: "How long does installation take?", answer: "Most sites are done within 1 week depending on length and gate count." },
        { question: "Garrison or chainmesh — which do I need?", answer: "Garrison suits street frontages and higher-visibility security; chainmesh suits large perimeter or commercial runs on a budget." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
    })
  );

  services.push(
    securityService({
      name: "Enclosures",
      slug: "enclosures",
      fromPrice: 760,
      priceUnit: "per enclosure",
      tagline: "Custom enclosures & compounds — bin stores, plant cages, courts and secure yards",
      description:
        "Design-and-build enclosures in garrison, chainmesh and slat — bin stores, pump and plant cages, sports courts, dog runs and lock-up compounds, engineered and keyed to suit.",
      swatchNote: "Custom finishes — galvanised or powder-coated to any of 22 Colorbond colours",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397633-23071dd351bd698f.png", name: "Bin & store enclosures", fromPrice: 760, priceUnit: "installed", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397835-09f83ea4b2037789.png", name: "Plant & pump cages", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398035-51c571723649d11e.png", name: "Sports court enclosures", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398237-43f434c43a33b72e.png", name: "Secure compounds", priceUnit: "engineered · priced at quote" },
      ],
      recentJobsTitle: "Recent enclosures around Perth",
      recentJobs: [
        { image: IMG, caption: "Malaga · Plant compound + gates" },
        { image: IMG, caption: "Como · School bin store" },
        { image: IMG, caption: "Balcatta · Bin enclosure + gates" },
      ],
      reviews: reviewPool(
        "Tony M.",
        "Malaga, May 2026",
        "Plant cage went up around live equipment without a single shutdown — keyed alike with the main gates.",
        "Leanne F.",
        "Como, June 2026",
        "School boundary replaced over the holidays with zero disruption. Paperwork and site induction handled without chasing.",
        "Strata WA",
        "Balcatta, April 2026",
        "Bin store enclosure looks better than the building. One hinge adjusted after handover, hence four stars."
      ),
      faqTitle: "Enclosure FAQs",
      faqs: [
        { question: "How much does a security enclosure cost?", answer: "Security enclosures start from $760 per enclosure, designed and installed. Size, materials and locks move the number — your written quote is fixed." },
        { question: "How high can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we confirm your council's rules." },
        { question: "How long does installation take?", answer: "Most sites are done within 1 week depending on length and gate count." },
        { question: "Do you design the enclosure for us?", answer: "Yes — we design to your equipment, access and council requirements, then confirm layout before we build." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
    })
  );

  services.push(
    securityService({
      name: "Palisade",
      slug: "palisade-fencing",
      fromPrice: 330,
      priceUnit: "per lineal metre",
      tagline: "Palisade steel security fencing — flat-top and spear-top, engineered to suit",
      description:
        "Heavy-duty steel palisade fencing for serious perimeters — schools, industrial yards and commercial sites. Custom heights, hot-dip galvanised or powder-coated, engineered for the wind region and installed by our own crews.",
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397633-23071dd351bd698f.png", name: "Palisade standard", fromPrice: 330, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207397835-09f83ea4b2037789.png", name: "Spear-top palisade", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398035-51c571723649d11e.png", name: "Palisade gates", priceUnit: "kinds of quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398237-43f434c43a33b72e.png", name: "Commercial runs", priceUnit: "engineered · priced at quote" },
      ],
      recentJobsTitle: "Recent palisade fences around Perth",
      recentJobs: [
        { image: IMG, caption: "Malaga · Warehouse · 86 lm spear-top" },
        { image: IMG, caption: "Como · School boundary · Flat-top" },
        { image: IMG, caption: "Balcatta · Palisade + keyed gates" },
      ],
      faqTitle: "Palisade fencing FAQs",
      faqs: [
        { question: "How much does palisade fencing cost in Perth?", answer: "Palisade security fencing starts from $330 per lineal metre supplied and installed. Height, pale profile and gates move the number — your written quote is fixed." },
        { question: "How high can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we confirm your council's rules." },
        { question: "How long does installation take?", answer: "Most sites are done within 1 week depending on length and gate count." },
        { question: "Palisade or chainmesh — which do I need?", answer: "Palisade suits serious perimeter security and industrial sites; chainmesh suits large perimeter or commercial runs on a budget." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
    })
  );

  // ---------- Blade Fencing (single service) ----------
  services.push({
    category: catBySlug["blade-fencing"]._id,
    isCategoryRoot: true,
    name: "Blade Fencing",
    slug: "blade-fencing",
    cardImage: IMG,
    fromPrice: 190,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Blade Fencing",
    bannerTitle: "Radiator / Blade",
    bannerSubtitle: "Blade fencing — deep-profile blades that read like architecture, not fencing",
    bannerCta: "Get A Free Quote",
    title: "Blade Fencing Perth",
    description:
      "Designer vertical blade fencing — deep radiator profiles and direct-fixed frameless blades, in select powder-coat colours and wood-look finishes. Pool-compliant options to 1.2m, supplied and installed by our own crews across Perth and the South West.",
    trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Designer range"],
    statTiles: [
      { value: "120 day", label: "workmanship warranty" },
      { value: "1 week", label: "order to install" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "measure & written quote" },
    ],
    swatchGroupLabel: "Pick your colour or wood-look",
    swatchNote: "22 Colorbond colours + Kwila & Western Red Cedar wood-look",
    swatches: [...FENCE_COLOURS, ...SLAT_TIMBER_LOOK],
    stylesLabel: "Styles & pricing",
    styles: [
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398440-afcc870ef67608b6.png", name: "Radiator profile", fromPrice: 190, priceUnit: "lm", popular: true },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398647-4860eec64130abac.png", name: "Frameless profile", priceUnit: "priced on quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207398875-4d6838eeec4b912f.png", name: "Wood-look blades", priceUnit: "priced on quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399080-5a39acacd5b95349.png", name: "Blade gates", priceUnit: "priced on quote" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts and channels set to a laser-straight line",
      "Powder-coated aluminium blades, framed or direct-fixed",
      "Full site cleanup — offcuts and packaging gone",
      "120-day workmanship warranty",
    ],
    popularAddOns: [
      "Old fence removal & tip fees",
      "Matching blade gates & letterboxes",
      "Integrated LED strip lighting",
      "Intercom, keypad & gate automation",
      "Rendered plinths & feature piers",
    ],
    waRulesTitle: "Built to WA rules — handled for you",
    waRules: [
      "Vertical blades with gaps under 100mm can form a compliant pool barrier (AS 1926.1) — unlike horizontal slats.",
      "R-Codes: front fences over 1.2m must be visually permeable — designer blade spacing satisfies it, confirmed with your council.",
      "Exposed frontages get engineered posts and footings for their wind region.",
    ],
    processTitle: "From first call to last blade",
    processSteps: process(
      "Walkthrough",
      "You sign off, we log the 120-day workmanship warranty and leave the site clean.",
      "Tell us the frontage, the style and the look you're after.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Blades cut and fixed to a string-perfect line — most in 1 week."
    ),
    recentJobsTitle: "Recent blade fences in Perth",
    recentJobs: [
      { image: IMG, caption: "City Beach · Radiator 65 · Monument" },
      { image: IMG, caption: "Mount Pleasant · Radiator 90 · Basalt" },
      { image: IMG, caption: "Subiaco · Radiator blade + gate" },
    ],
    reviews: reviewPool(
      "Sophie R.",
      "City Beach, May 2026",
      "Radiator blades give the frontage real depth — the shadow lines change all day and the house finally looks finished.",
      "Owen J.",
      "Mount Pleasant, June 2026",
      "Deep blades at compliant spacing around the courtyard — bold from the street, near-private from the deck.",
      "The Karims",
      "Subiaco, April 2026",
      "Radiator blades and the matching gate are stunning. Colour batch took an extra week, hence four stars."
    ),
    faqTitle: "Blade fencing FAQs",
    faqs: [
      {
        question: "How much does blade fencing cost in Perth?",
        answer:
          "Blade fencing starts from $190 per lineal metre supplied and installed — the radiator profile is priced in your written quote, which is fixed.",
      },
      { question: "Radiator or standard blade — what's the difference?", answer: "Radiator profile is a deep 65-90mm blade with a bold shadow line for exposed frontages; the standard frameless profile is a slimmer, cleaner architectural line — both are priced on quote." },
      { question: "How long does installation take?", answer: "Most frontages are cut, fixed and levelled within 1 week once your written quote is locked in." },
      { question: "Can blade fencing go around a pool?", answer: "Yes — with sub-100mm spacing and a certified gate, blade fencing can form part of a compliant AS 1926.1 pool barrier." },
      { question: "Will a tall blade fence pass council rules?", answer: "In most cases yes with permeable spacing — we confirm your specific council's R-Codes requirement before you commit." },
    ],
    relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
    areasServiced: AREAS,
  });

  // ---------- Asbestos Fence Removal (single service) ----------
  services.push({
    category: catBySlug["asbestos-fence-removal"]._id,
    isCategoryRoot: true,
    name: "Asbestos Fence Removal",
    slug: "asbestos-fence-removal",
    cardImage: IMG,
    fromPrice: 80,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Asbestos Fence Removal",
    bannerTitle: "Asbestos Fence Removal",
    bannerSubtitle: "WA government licensed asbestos removal — safe, wrapped, gone",
    bannerCta: "Get A Free Quote",
    title: "Asbestos Fence Removal Perth",
    description:
      'Safe, certified removal of asbestos "super six" fences by a WA government licensed removalist — our own trained crew, not subcontractors. Sheets are wet down, hand-lifted and double-wrapped, disposed of at a licensed facility with receipts supplied, and a new Colorbond fence can start the same day.',
    trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "WA licensed removalist"],
    statTiles: [
      { value: "Licensed", label: "WA govt asbestos removalist" },
      { value: "1 week", label: "order to install" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "measure & written quote" },
    ],
    swatchGroupLabel: "",
    swatchNote: "",
    swatches: [],
    identificationTitle: "Is my fence asbestos?",
    identificationSubtitle: "Three quick tells — then text us a photo and we'll confirm for free",
    identificationCards: [
      {
        image: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207400906-4e2d88b2bb7dfdbe.png",
        title: 'Corrugated "super six" profile',
        description: "Deep, wavy sheets in flat panels — the classic asbestos fence look.",
      },
      {
        image: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207401108-ac615804041e1842.png",
        title: "Grey, brittle & pre-1990",
        description: "Dull cement-grey that chips at the base, on a home built before 1990.",
      },
      {
        image: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207401312-83c09875a2214792.png",
        title: "Moulded capping on top",
        description: "A rounded capping strip riding the sheet tops is a near-certain giveaway.",
      },
    ],
    stylesLabel: "Removal options & pricing",
    styles: [
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207400095-b78a0f60ab5177a2.png", name: "Removal only", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207400299-725e5369a23aae5c.png", name: "Remove + replace", fromPrice: 80, priceUnit: "lm · min. job", popular: true },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207400502-f19b4570af240e9e.png", name: "Sheds, cladding & eaves", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207400703-a6b2a8be2a832851.png", name: "Disposal docs & clearance", priceUnit: "included on every job" },
    ],
    everyInstallIncludes: [
      "Free confirmation & fixed written quote",
      "Wet-down, hand removal — sheets never broken",
      "Double-wrapped and sealed to 200μm spec",
      "Disposal at a licensed facility, receipts supplied",
      "Site raked, checked and visually cleared",
    ],
    popularAddOns: [
      "Same-day Colorbond replacement fence",
      "Shed, eave & cladding removal",
      "Independent air monitoring & clearance report",
      "Soil testing where fragments are found",
      "Old footings & concrete carted away",
    ],
    waRulesTitle: "Done to WA law — handled for you",
    waRules: [
      "In WA, anything over 10m² of asbestos must be removed by a licensed contractor — a fence run is well past that. We hold the WA government licence.",
      "Never water-blast, cut or snap sheets — it releases fibres and it's illegal on asbestos. Wet-down hand removal only.",
      "Sheets travel double-wrapped under manifest to a licensed facility — disposal receipts come with your invoice.",
    ],
    processTitle: "From first photo to clear site",
    processSteps: process(
      "Disposal & clearance",
      "Licensed-facility disposal with receipts — the new fence can start the same day.",
      "Send photos or book a free measure — we confirm it's asbestos at no charge.",
      "Removal, disposal and any replacement fence — one written price within 48 hours.",
      "Wet down, hand-lifted, double-wrapped — no breaking, no dust, usually one day."
    ),
    recentJobsTitle: "Recent removals around Perth",
    recentJobs: [
      { image: IMG, caption: "Bayswater · 32 lm super six + Colorbond" },
      { image: IMG, caption: "Melville · Fence + shed cladding" },
      { image: IMG, caption: "Midland · 40 lm · clearance report" },
    ],
    reviews: reviewPool(
      "Helen G.",
      "Bayswater, May 2026",
      "Gone in a morning — wet down, wrapped and carted off with the paperwork to prove it. New Colorbond up by the weekend.",
      "Jarrad K.",
      "Melville, June 2026",
      "They confirmed it was asbestos from a photo, quoted the removal and the new fence in one price. No dust, no drama.",
      "Fiona R.",
      "Midland, April 2026",
      "Crew treated it seriously — suits, signage, the lot. Tip receipts took a few days to email through, hence four stars."
    ),
    faqTitle: "Asbestos removal FAQs",
    faqs: [
      {
        question: "How much does asbestos fence removal cost?",
        answer:
          "Licensed asbestos fence removal and replacement starts from $80 per lineal metre with a minimum job charge. Colorbond, PVC or slat replacement is priced in your fixed written quote.",
      },
      { question: "Is it dangerous to just leave the fence there?", answer: "Undisturbed, well-sealed asbestos sheeting is low-risk, but cracked, chipped or crumbling sheets can release fibres — if in doubt, get it checked." },
      { question: "Can I remove an asbestos fence myself?", answer: "In WA, only a licensed asbestos removalist can legally remove more than 10m² of bonded asbestos — a standard fence run is well over that threshold." },
      { question: "Do I get proof it was disposed of legally?", answer: "Yes — disposal receipts from the licensed facility come with your invoice, which most councils and future buyers will ask to see." },
      { question: "Can you put up the new fence the same day?", answer: "In most cases yes — if you book removal and a new Colorbond, PVC or slat fence together, we aim to do both in the same visit." },
    ],
    relatedServices: ["Colorbond fencing", "Pool fencing", "Gates & automation", "Slat fencing range", "Retaining walls"],
    areasServiced: AREAS,
  });

  // ---------- PVC Fencing Range (2 services) ----------
  const pvcCat = catBySlug["pvc-fencing"]._id;

  function pvcService({
    name,
    slug,
    fromPrice,
    tagline,
    description,
    swatches,
    styles,
    faqTitle,
    faqQuestion,
    faqAnswer,
  }) {
    return {
      category: pvcCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit: "per lineal metre",
      heroImage: IMG,
      breadcrumbLabel: `PVC Fencing / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Fence Calculator",
      title: `${name} Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "30-yr PVC + 120-day workmanship"],
      statTiles: [
        { value: "30 yr", label: "PVC materials warranty" },
        { value: "1 week", label: "order to install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "measure & written quote" },
      ],
      swatchGroupLabel: "Finish & styles",
      swatchNote: "White as standard — full-privacy and combination styles",
      swatches,
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts cemented in-ground, string-lined",
        "Genuine BlueScope panels, rails & capping",
        "Full site cleanup — offcuts and packaging gone",
        "30-yr PVC materials + 120-day workmanship",
      ],
      popularAddOns: [
        "Old fence removal & tip fees",
        "Asbestos fence removal (licensed)",
        "Lattice or slat height extensions",
        "Matching single & double gates",
        "Plinths for retained or sloping blocks",
      ],
      waRules: [
        "Dividing Fences Act: boundary neighbours usually share the cost — we prepare the paperwork either side can sign.",
        "Footings and post spacing rated to your wind region (N1-N3), coastal or inland.",
        "Pool-side runs certified to AS 1926.1 where the fence forms part of a pool barrier.",
      ],
      processTitle: "From first call to last panel",
      processSteps: process(
        "Walkthrough",
        "You sign off, we log the 120-day workmanship warranty and leave the site clean.",
        "Tell us the boundary, height and colour you have in mind.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Most homes are done in 1 week — posts cemented, panels levelled."
      ),
      recentJobsTitle: "Recent PVC jobs around Perth",
      recentJobs: [
        { image: IMG, caption: "Tapping · 42lm · Monument" },
        { image: IMG, caption: "Baldivis · 28lm · Surfmist" },
        { image: IMG, caption: "Karrinyup · 36lm · Woodland Grey" },
      ],
      reviews: reviewPool(
        "Sarah M.",
        "Joondalup, May 2026",
        "Quoted Tuesday, fence up the following Friday. Crew cemented every post and left the yard cleaner than they found it.",
        "Daniel R.",
        "Rockingham, April 2026",
        `Old asbestos fence gone and new Monument ${name.includes("Picket") ? "PVC picket" : "PVC"} up in two days. One fixed price, no surprises on the invoice.`,
        "Meg & Tony",
        "Bunbury, June 2026",
        "Matched the neighbour's colour perfectly and sorted the shared-cost paperwork for us. Rain pushed the start back a day, hence four stars."
      ),
      faqTitle: faqTitle || "PVC FAQs",
      faqs: [
        { question: faqQuestion, answer: faqAnswer },
        {
          question: "Who pays for a boundary fence in WA?",
          answer:
            "Under the Dividing Fences Act, neighbours who share a boundary usually split a standard dividing fence 50/50. We prepare the paperwork so both sides can sign off before work starts.",
        },
        { question: "How long does installation take?", answer: "Most standard boundary runs are measured, quoted and installed within a week." },
        { question: "Can you build over a retaining wall or sloping block?", answer: "Yes — we use plinths and stepped panels to keep the fence line straight over sloping or retained ground, priced into your written quote." },
        { question: "Is PVC okay near the coast?", answer: "Yes — uPVC won't rust, rot or corrode, making it a strong option for exposed coastal sites." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    pvcService({
      name: "PVC Privacy Fencing",
      slug: "pvc-privacy-fencing",
      fromPrice: 160,
      tagline: "PVC privacy fencing supplied and installed across Perth — colours matched, mess gone",
      description:
        "Premium uPVC privacy fencing in classic white — full-privacy 1.8m panels and picket styles that never need painting. Supplied and installed by our own crews across Perth and the South West, backed by a 30-year PVC materials warranty, measured and installed inside a week.",
      swatches: [
        { label: "Full privacy", hex: "#F2F1EC" },
        { label: "Privacy + lattice", hex: "#F2F1EC" },
        { label: "Privacy + picket", hex: "#F2F1EC" },
        { label: "Combination", hex: "#F2F1EC" },
      ],
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399282-7c2810059e80dd13.png", name: "Full privacy 1.8m", fromPrice: 160, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399488-be81c0f8c182aca7.png", name: "Privacy + lattice top", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399690-7bcffb6e06ad1499.png", name: "Privacy + picket top", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399892-0644e6c42a98a87f.png", name: "Gates to match", priceUnit: "priced at quote" },
      ],
      faqQuestion: "How much does PVC privacy fencing cost?",
      faqAnswer:
        "PVC privacy fencing starts from $160 per lineal metre supplied and installed. Panel style, gates and access move the number — your written quote is fixed.",
    })
  );

  services.push(
    pvcService({
      name: "PVC Picket Fencing",
      slug: "pvc-picket-fencing",
      fromPrice: 110,
      tagline: "PVC picket fencing supplied and installed across Perth — colours matched, mess gone",
      description:
        "Semi-privacy uPVC picket fencing at around 1.15m — Modern, New England, Gothic and Hamptons profiles in classic white that never need painting. Supplied and installed by our own crews across Perth and the South West, backed by a 30-year PVC materials warranty.",
      swatches: [
        { label: "Modern", hex: "#F2F1EC" },
        { label: "New England", hex: "#F2F1EC" },
        { label: "Gothic", hex: "#F2F1EC" },
        { label: "Hamptons", hex: "#F2F1EC" },
      ],
      styles: [
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399282-7c2810059e80dd13.png", name: "Modern picket", fromPrice: 110, priceUnit: "lm", popular: true },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399488-be81c0f8c182aca7.png", name: "New England", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399690-7bcffb6e06ad1499.png", name: "Gothic", priceUnit: "priced at quote" },
        { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399892-0644e6c42a98a87f.png", name: "Hamptons", priceUnit: "priced at quote" },
      ],
      faqQuestion: "How much does PVC picket fencing cost?",
      faqAnswer:
        "PVC picket fencing starts from $110 per lineal metre supplied and installed. Picket style, gates and access move the number — your written quote is fixed.",
    })
  );

  // ---------- Modular Walls (single service) ----------
  services.push({
    category: catBySlug["modular-walls"]._id,
    isCategoryRoot: true,
    name: "Modular Walls",
    slug: "modular-walls",
    cardImage: IMG,
    fromPrice: 430,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Modular Walls",
    bannerTitle: "Modular Walls",
    bannerSubtitle: "Modular walling supplied and installed across Perth — colours matched, mess gone",
    bannerCta: "Fence Calculator",
    title: "Modular Wall Fencing Perth",
    description:
      "Rendered modular walling for estate frontages, acoustic barriers and solid boundary statements — engineered panel systems on steel posts, finished to match your home. Designed, supplied and installed by our own crews across Perth and the South West.",
    trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "120-day workmanship warranty"],
    statTiles: [
      { value: "120 day", label: "workmanship warranty" },
      { value: "1 week", label: "order to install" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "measure & written quote" },
    ],
    swatchGroupLabel: "Render finishes",
    swatchNote: "Custom — rendered and painted to any colour (examples shown)",
    swatches: [
      { label: "Off-white", hex: "#EDE9E1" },
      { label: "Sand", hex: "#C9AE83" },
      { label: "Mid-grey", hex: "#8C8C89" },
      { label: "Charcoal", hex: "#333333" },
    ],
    stylesLabel: "Wall types & pricing",
    styles: [
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399282-7c2810059e80dd13.png", name: "Acoustic modular wall", fromPrice: 430, priceUnit: "lm", popular: true },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399488-be81c0f8c182aca7.png", name: "Estate boundary wall", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399690-7bcffb6e06ad1499.png", name: "Feature-clad wall", priceUnit: "priced at quote" },
      { icon: "https://stagfencing-media.s3.ap-southeast-2.amazonaws.com/services/1786207399892-0644e6c42a98a87f.png", name: "Gates & inserts", priceUnit: "priced at quote" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts cemented in-ground, string-lined",
      "Genuine BlueScope panels, rails & capping",
      "Full site cleanup — offcuts and packaging gone",
      "120-day workmanship warranty",
    ],
    popularAddOns: [
      "Old fence removal & tip fees",
      "Asbestos fence removal (licensed)",
      "Lattice or slat height extensions",
      "Matching single & double gates",
      "Plinths for retained or sloping blocks",
    ],
    waRules: [
      "Dividing Fences Act: boundary neighbours usually share the cost — we prepare the paperwork either side can sign.",
      "Footings and post spacing rated to your wind region (N1-N3), coastal or inland.",
      "Pool-side runs certified to AS 1926.1 where the fence forms part of a pool barrier.",
    ],
    processTitle: "From first call to last panel",
    processSteps: process(
      "Walkthrough",
      "You sign off, we log the 120-day workmanship warranty and leave the site clean.",
      "Tell us the boundary, height and colour you have in mind.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Most homes are done in 1 week — posts cemented, panels levelled."
    ),
    recentJobsTitle: "Recent Modular jobs around Perth",
    recentJobs: [
      { image: IMG, caption: "Tapping · 42lm · Monument" },
      { image: IMG, caption: "Baldivis · 28lm · Surfmist" },
      { image: IMG, caption: "Karrinyup · 36lm · Woodland Grey" },
    ],
    reviews: reviewPool(
      "Sarah M.",
      "Joondalup, May 2026",
      "Quoted Tuesday, fence up the following Friday. Crew cemented every post and left the yard cleaner than they found it.",
      "Daniel R.",
      "Rockingham, April 2026",
      "Old asbestos fence gone and new Monument Modular up in two days. One fixed price, no surprises on the invoice.",
      "Meg & Tony",
      "Bunbury, June 2026",
      "Matched the neighbour's colour perfectly and sorted the shared-cost paperwork for us. Rain pushed the start back a day, hence four stars."
    ),
    faqTitle: "Modular FAQs",
    faqs: [
      {
        question: "How much does a modular wall cost in Perth?",
        answer:
          "Modular walls start from $430 per lineal metre supplied and installed. Height, footings, render finish and access move the number — your written quote is fixed.",
      },
      {
        question: "Who pays for a boundary fence in WA?",
        answer:
          "Under the Dividing Fences Act, neighbours who share a boundary usually split a standard dividing fence 50/50. We prepare the paperwork so both sides can sign off before work starts.",
      },
      { question: "How long does installation take?", answer: "Most standard boundary runs are measured, quoted and installed within a week." },
      { question: "Can you build over a retaining wall or sloping block?", answer: "Yes — we use plinths and stepped panels to keep the fence line straight over sloping or retained ground, priced into your written quote." },
      { question: "Is Modular okay near the coast?", answer: "Yes — panels are rendered and painted with coastal-grade coatings and fixed with corrosion-resistant fittings for exposed sites." },
    ],
    relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
    areasServiced: AREAS,
  });

  await Service.create(services);

  console.log(`Seed complete. ${categoryDocs.length} categories, ${services.length} services.`);
  await mongoose.connection.close();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
});
