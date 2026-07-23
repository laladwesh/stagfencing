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
      fromPrice: 85,
      priceUnit: "per lineal metre",
      sortOrder: 1,
      hasRange: false,
    },
    {
      name: "Slat Fencing Range",
      slug: "aluminium-slat-fencing-perth",
      image: IMG,
      fromPrice: 185,
      priceUnit: "per lineal metre",
      sortOrder: 2,
      hasRange: false,
    },
    {
      name: "Pool Fencing Range",
      slug: "pool-fencing",
      image: IMG,
      fromPrice: 110,
      priceUnit: "per lineal metre",
      sortOrder: 3,
      hasRange: true,
      rangeBannerTitle: "Pool Fencing Range",
      rangeBannerSubtitle: "Six compliant fencing styles — glass, aluminium and postless",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Every compliant way to fence a Perth pool — from frameless glass to budget tubular. Each range below is supplied and installed to AS 1926.1 with certified self-closing gates, tap a range below for full pricing, options and recent jobs.",
    },
    {
      name: "Retaining Walls",
      slug: "retaining-walls",
      image: IMG,
      fromPrice: 290,
      priceUnit: "per m²",
      sortOrder: 4,
      hasRange: true,
      rangeBannerTitle: "Retaining Walls",
      rangeBannerSubtitle: "Engineered retaining systems for Perth blocks — Fibrewall & Alumawall",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Engineered post-and-panel retaining for Perth blocks. Both systems below are engineered to suit your soil and height, priced per square metre and installed with drainage and backfill done properly.",
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
      name: "Security Fencing Range",
      slug: "security-fencing",
      image: IMG,
      fromPrice: 95,
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
      name: "Blade Fencing Range",
      slug: "blade-fencing-designer-range",
      image: IMG,
      fromPrice: 260,
      priceUnit: "per lineal metre",
      sortOrder: 7,
      hasRange: true,
      rangeBannerTitle: "Blade Fencing Range",
      rangeBannerSubtitle: "Designer blade fencing for frontages and homeowners front fences",
      rangeBannerCta: "Book A Free Measure",
      rangeIntro:
        "Designer vertical blade fencing for frontages that carry the street. Both profiles are R-Class rated for permeability and can run pool-compliant — tap through for pricing and options.",
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
    fromPrice: 85,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Colorbond Fencing",
    bannerTitle: "Colorbond Fencing",
    bannerSubtitle: "Colorbond fencing supplied and installed across Perth — 9 colours matched, offcuts gone",
    bannerCta: "Colorbond Fencing Calculator",
    title: "Colorbond Fencing Perth",
    description:
      "Solid COLORBOND® steel fencing, supplied and installed by our own crews across Perth and the South West. Genuine BlueScope panels in nine colours, posts cemented in, offcuts gone — most standard boundary fences are measured, quoted and installed inside two weeks.",
    trustBadges: [...STANDARD_TRUST(), "10-yr BlueScope warranty"],
    statTiles: [
      { value: "10 yr", label: "BlueScope warranty" },
      { value: "1-2 days", label: "Typical install" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "Measure & written quote" },
    ],
    swatchGroupLabel: "Pick your colour",
    swatchNote: "All 9 Colorbond colours in stock at Balcatta",
    swatches: FENCE_COLOURS,
    stylesLabel: "Heights & pricing",
    styles: [
      { name: "1200mm", fromPrice: 61, priceUnit: "per lm" },
      { name: "1500mm", fromPrice: 66, priceUnit: "per lm" },
      { name: "1800mm", fromPrice: 76, priceUnit: "per lm", popular: true },
      { name: "2100mm", fromPrice: 89, priceUnit: "per lm" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts cemented in-ground, string-lined",
      "Genuine BlueScope panels, rails & capping",
      "Full site cleanup — offcuts & packaging gone",
      "10-yr product + workmanship warranty",
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
      "You sign off, we log the 10-yr warranty and leave the site clean.",
      "Tell us the boundary, height and colour you have in mind.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Most homes are done in 1-2 days — posts cemented, panels levelled."
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
          "Most boundary fences land between $95 and $150 per lineal metre supplied and installed, depending on height, access and site prep. Your written quote is fixed — no day-rate surprises.",
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
    fromPrice: 185,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Slat Fencing",
    bannerTitle: "Aluminium Slat Fencing",
    bannerSubtitle: "Horizontal slat privacy fencing, powder-coated and rust-proof",
    bannerCta: "Get A Free Quote",
    title: "Aluminium Slat Fencing Perth",
    description:
      "Horizontal aluminium slat privacy fencing — marine-grade, powder-coated and built for Perth's sun and salt air. Concealed fixings, colour-matched posts, and a clean architectural line that suits modern homes.",
    trustBadges: [...STANDARD_TRUST(), "Marine-grade aluminium"],
    statTiles: [
      { value: "10 yr", label: "Powder-coat warranty" },
      { value: "1-2 days", label: "Typical install" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "Measure & written quote" },
    ],
    swatchGroupLabel: "Pick your colour",
    swatchNote: "Colorbond-matched colours available",
    swatches: FENCE_COLOURS,
    stylesLabel: "Styles & pricing",
    styles: [
      { name: "70mm slat", fromPrice: 185, priceUnit: "per lm" },
      { name: "150mm slat", fromPrice: 210, priceUnit: "per lm", popular: true },
      { name: "Slat gates", fromPrice: 620, priceUnit: "per gate" },
      { name: "Privacy screening", fromPrice: 235, priceUnit: "per lm" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Posts cemented in-ground, string-lined",
      "Marine-grade aluminium slats, concealed fixings",
      "Full site cleanup — offcuts & packaging gone",
      "10-yr powder-coat + workmanship warranty",
    ],
    popularAddOns: [
      "Old fence removal & tip fees",
      "Matching single & double gates",
      "LED post & garden lighting",
      "Plinths for retained or sloping blocks",
      "Privacy lattice toppers",
    ],
    waRules: [
      "Dividing Fences Act: boundary neighbours usually share the cost — we prepare the paperwork either side can sign.",
      "Footings and post spacing rated to your wind region (N1-N3), coastal or inland.",
      "Pool-side runs certified to AS 1926.1 where the fence forms part of a pool barrier.",
    ],
    processTitle: "From first call to last slat",
    processSteps: process(
      "Walkthrough",
      "You sign off, we log the warranty and leave the site clean.",
      "Tell us the boundary, height and colour you have in mind.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Most homes are done in 1-2 days — posts cemented, slats levelled."
    ),
    recentJobsTitle: "Recent slat fences around Perth",
    recentJobs: [
      { image: IMG, caption: "Scarborough · 150mm slat · Monument" },
      { image: IMG, caption: "Baldivis · 70mm slat · Surfmist" },
      { image: IMG, caption: "Dalkeith · Slat + gate · Woodland Grey" },
    ],
    reviews: reviewPool(
      "Nadia S.",
      "Scarborough, May 2026",
      "Clean architectural look, exactly what we wanted for the front yard. Posts are dead straight.",
      "Chris B.",
      "Baldivis, June 2026",
      "Slats up in a day, colour match to our existing Colorbond was spot on.",
      "The Levens",
      "Dalkeith, April 2026",
      "Great privacy without feeling boxed in. One slat had a scuff, swapped same week."
    ),
    faqTitle: "Slat fencing FAQs",
    faqs: [
      {
        question: "How much does slat fencing cost?",
        answer:
          "70mm slat starts around $185 per lineal metre supplied and installed, 150mm from $210. Every job is priced off a free on-site measure with a fixed written quote.",
      },
      { question: "What makes slat fencing different from Colorbond?", answer: "Slat fencing uses horizontal aluminium slats with gaps for airflow and a lighter look, while Colorbond is a solid sheet panel — slat suits contemporary street frontages best." },
      { question: "How long does installation take?", answer: "Most standard runs are done in 1-2 days once your written quote is locked in." },
      { question: "Can slat fencing be pool compliant?", answer: "Yes — with reduced gaps and non-climbable zone spacing, our slat systems can be built to AS 1926.1." },
      { question: "Do you handle the council paperwork?", answer: "Yes, on any run near a boundary or pool we prepare the paperwork and handle inspections." },
    ],
    relatedServices: ["Colorbond fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Retaining walls"],
    areasServiced: AREAS,
  });

  // ---------- Pool Fencing Range (6 services) ----------
  const poolCat = catBySlug["pool-fencing"]._id;

  function poolService({ name, slug, fromPrice, tagline, description, swatchGroupLabel, swatches, styles }) {
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
        { value: "AS 1926.1", label: "Every barrier certified" },
        { value: "1-2 days", label: "Typical install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "Measure & written quote" },
      ],
      swatchGroupLabel,
      swatchNote: "Spigots, posts & gates — the glass or mesh itself stays clear",
      swatches,
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "Certificate-grade materials, polished edges",
        "Full site cleanup — offcuts & packaging gone",
        "Compliance certificate + workmanship warranty",
      ],
      popularAddOns: [
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
        "Core-drilled, cemented and levelled — most pools done in 1-2 days."
      ),
      recentJobsTitle: `Recent ${name.toLowerCase()} fences around Perth`,
      recentJobs: [
        { image: IMG, caption: "Hillarys · 14 lm" },
        { image: IMG, caption: "Baldivis · 22 lm" },
        { image: IMG, caption: "Dalkeith · Fenced + gate" },
      ],
      reviews: reviewPool(
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
      faqTitle: `${name} FAQs`,
      faqs: [
        {
          question: `How much does ${name.toLowerCase()} cost?`,
          answer: `${name} starts around $${fromPrice} per lineal metre supplied and installed. Every job is priced off a free on-site measure with a fixed written quote.`,
        },
        { question: "What makes a pool fence legal in WA?", answer: "AS 1926.1 sets the minimum height, gap sizes and non-climbable zone — we design and certify every job to that standard." },
        { question: "How long does installation take?", answer: "Most pool fencing jobs are done in 1-2 days once your written quote is locked in." },
        { question: "Spigots or channel — which mounting is better?", answer: "Spigot-fixed suits most timber or concrete decks; channel mounting gives a cleaner look on new pours — we'll recommend one at your measure." },
        { question: "Do you handle the council inspection?", answer: "Yes — we build to pass first time and hand over your compliance certificate and paperwork." },
      ],
      relatedServices: ["Aluminium slat fencing", "Colorbond fencing", "Gates & automation", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    poolService({
      name: "Frameless Glass",
      slug: "frameless-glass-pool-fencing",
      fromPrice: 290,
      tagline: "Frameless glass pool fencing — 12mm toughened glass on marine-grade spigots",
      description:
        "12mm Grade-A toughened glass on 2205 stainless spigots — supplied and installed to AS 1926.1, with certified self-closing gates and council handover paperwork.",
      swatchGroupLabel: "Frame & hardware finishes",
      swatches: HARDWARE_FINISHES,
      styles: [
        { name: "Semi-frameless (budget)", fromPrice: 245, priceUnit: "per lm" },
        { name: "Channel-fixed frameless", fromPrice: 265, priceUnit: "per lm" },
        { name: "Spigot-fixed frameless", fromPrice: 290, priceUnit: "per lm", popular: true },
        { name: "Frameless glass gates", fromPrice: 980, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    poolService({
      name: "Tubular Aluminium",
      slug: "aluminium-pool-fencing",
      fromPrice: 110,
      tagline: "Tubular aluminium pool fencing — powder-coated, rust-proof and installed to AS 1926.1",
      description:
        "Powder-coated tubular aluminium in flat-top and loop-top profiles — rust-proof, kid-tough and installed to AS 1926.1 with self-closing, self-latching gates.",
      swatchGroupLabel: "Powder-coat colours",
      swatches: FENCE_COLOURS,
      styles: [
        { name: "Loop-top tubular", fromPrice: 105, priceUnit: "per lm" },
        { name: "Double-top rail", fromPrice: 120, priceUnit: "per lm" },
        { name: "Flat-top tubular", fromPrice: 110, priceUnit: "per lm", popular: true },
        { name: "Tubular gates", fromPrice: 420, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    poolService({
      name: "Perf Pool",
      slug: "perf-pool-fencing",
      fromPrice: 185,
      tagline: "Perforated aluminium pool panels that screen the pool without boxing it in",
      description:
        "Perforated aluminium panels that screen the pool without boxing it in — non-climbable, rust-free and in Colorbond-matched colours.",
      swatchGroupLabel: "Panel colours & patterns",
      swatches: FENCE_COLOURS,
      styles: [
        { name: "Slotted perf", fromPrice: 175, priceUnit: "per lm" },
        { name: "Custom-pattern perf", fromPrice: 210, priceUnit: "per lm" },
        { name: "Round-hole perf", fromPrice: 185, priceUnit: "per lm", popular: true },
        { name: "Perf pool gates", fromPrice: 520, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    poolService({
      name: "Frameless Batten",
      slug: "frameless-batten-fencing",
      fromPrice: 340,
      tagline: "Frameless vertical battens — architectural lines, pool-compliant spacing, zero visible frame",
      description:
        "Vertical aluminium battens with no visible frame — architectural lines at compliant sub-100mm spacing, powder-coated or timber-look, installed to AS 1926.1 with certified gates.",
      swatchGroupLabel: "Batten colours & timber looks",
      swatches: [...FENCE_COLOURS, ...TIMBER_LOOK],
      styles: [
        { name: "Timber-look batten", fromPrice: 380, priceUnit: "per lm" },
        { name: "Wide-blade batten", fromPrice: 370, priceUnit: "per lm" },
        { name: "Standard 40mm batten", fromPrice: 340, priceUnit: "per lm", popular: true },
        { name: "Batten gates", fromPrice: 760, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    poolService({
      name: "Round Batten",
      slug: "round-batten-fencing",
      fromPrice: 360,
      tagline: "Frameless round battens — soft cylindrical profiles with pool-compliant spacing",
      description:
        "Cylindrical aluminium battens with no visible frame, including organic curved profiles — a softer take on the batten look at compliant sub-100mm spacing.",
      swatchGroupLabel: "Batten colours & timber looks",
      swatches: [...FENCE_COLOURS, ...TIMBER_LOOK],
      styles: [
        { name: "Timber-look round", fromPrice: 400, priceUnit: "per lm" },
        { name: "65mm round batten", fromPrice: 385, priceUnit: "per lm" },
        { name: "Standard 50mm round", fromPrice: 360, priceUnit: "per lm", popular: true },
        { name: "Round batten gates", fromPrice: 790, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    poolService({
      name: "Barr Fencing",
      slug: "barr-fencing",
      fromPrice: 165,
      tagline: "Barr-profile aluminium pool fencing — a flat-blade budget alternative to tubular",
      description:
        "Flat aluminium barr-profile panels — a budget-friendly step up from tubular with a cleaner blade look, powder-coated and installed to AS 1926.1.",
      swatchGroupLabel: "Powder-coat colours",
      swatches: FENCE_COLOURS,
      styles: [
        { name: "Standard barr", fromPrice: 165, priceUnit: "per lm", popular: true },
        { name: "Wide barr", fromPrice: 185, priceUnit: "per lm" },
        { name: "Barr + top rail", fromPrice: 195, priceUnit: "per lm" },
        { name: "Barr gates", fromPrice: 460, priceUnit: "per gate" },
      ],
    })
  );

  // ---------- Retaining Walls (2 services) ----------
  const retainCat = catBySlug["retaining-walls"]._id;

  function retainService({ name, slug, fromPrice, weightLabel, tagline, description, swatches }) {
    return {
      category: retainCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit: "per lineal metre",
      heroImage: IMG,
      breadcrumbLabel: `Retaining Walls / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Retaining Walls Calculator",
      title: `${name} Retaining Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Engineering on request"],
      statTiles: [
        { value: weightLabel, label: weightLabel.includes("proof") ? "Rated no rot or rust" : "Sleeper weight" },
        { value: "DIY-ready", label: "Installed by us" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "Measure & written quote" },
      ],
      swatchGroupLabel: "Sleeper finishes",
      swatchNote: "Powder-coated sleepers — Colorbond-matched colours available",
      swatches,
      stylesLabel: "Sleeper sizes & pricing",
      styles: [
        { name: "Sleeper 2380mm", fromPrice: Math.round(fromPrice * 0.85), priceUnit: "per sleeper" },
        { name: "Sleeper 3150mm", fromPrice: Math.round(fromPrice * 1.05), priceUnit: "per sleeper", popular: true },
        { name: "Under-fence plinth", fromPrice: Math.round(fromPrice * 0.6), priceUnit: "per lm" },
        { name: "Supply + install", fromPrice, priceUnit: "per m²" },
      ],
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Site cut, levels and string-lines set",
        "Sleepers clip-lock and cut to width on-site",
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
        "You sign off, we hand over cert confirmation and leave the site clean.",
        "Tell us the wall length, height and what should sit above it.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Sleepers clip-locked and cut, drainage — backfill compacted."
      ),
      recentJobsTitle: `Recent ${name} walls around Perth`,
      recentJobs: [
        { image: IMG, caption: "Wanneroo · 18m · In concrete" },
        { image: IMG, caption: "Byford · Tiered · Woodgrain" },
        { image: IMG, caption: "Duncraig · 12m · Monument" },
      ],
      reviews: reviewPool(
        "Marcus D.",
        "Wanneroo, May 2026",
        "Sloping block terraced into two flat lawns. Engineer drawings, permit, drainage — all sorted without us chasing a thing.",
        "Jess & Sam",
        "Byford, June 2026",
        "Old limestone wall was leaning badly. The new wall went up in three days and the backfill was spotless.",
        "Alan P.",
        "Duncraig, April 2026",
        "Woodgrain finish looks like timber sleepers but won't ever rot. Came day moved out for weather, hence four stars."
      ),
      faqTitle: `${name} FAQs`,
      faqs: [
        {
          question: `How much does ${name} retaining cost?`,
          answer: `Sleepers start around $${fromPrice} per lineal metre supplied, and installed depends on height and access. Every job gets a fixed written quote after a free measure.`,
        },
        { question: "Do I need council approval for a retaining wall?", answer: "Walls over 500mm need an engineer's design and a council building permit — we arrange both as part of the job." },
        { question: "How long does installation take?", answer: "Most standard walls are done in 1-3 days depending on length and access." },
        { question: "Who pays for a retaining wall on a boundary?", answer: "Retaining isn't covered by the Dividing Fences Act — responsibility depends on who benefits from the wall, we'll clarify before anyone pays." },
        { question: `${name === "Fibrewall" ? "Fibrewall or concrete sleepers" : "Alumawall or Fibrewall"} — which one?`, answer: "It comes down to weight, budget and look — we'll talk you through the trade-off at your free measure." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Fence removal & disposal", "Colorbond fencing"],
      areasServiced: AREAS,
    };
  }

  services.push(
    retainService({
      name: "Fibrewall",
      slug: "fibrewall-retaining",
      fromPrice: 290,
      weightLabel: "Rot-proof",
      tagline: "Fibrewall stackable sleepers — retaining walls and under-fence plinths, ground up",
      description:
        "Extruded Fibrewall sleepers that clip together and cut to length — used as retaining walls or as plinths under steel fences. Lightweight, easy to handle, and built to shrug off WA rot, rust and termites.",
      swatches: [
        { label: "Smooth Grey", hex: "#9A9A97" },
        { label: "Charcoal", hex: "#3A3B3C" },
        { label: "Limestone", hex: "#D8CBB0" },
        { label: "Woodgrain", hex: "#8B5A2B" },
        { label: "Sandstone", hex: "#C9AE83" },
        { label: "Monument", hex: "#3A3B3C" },
        { label: "Basalt", hex: "#4B4D4C" },
        { label: "Dune", hex: "#9C8768" },
        { label: "Bass", hex: "#1B1B1B" },
      ],
    })
  );

  services.push(
    retainService({
      name: "Alumawall",
      slug: "alumawall-sleeper",
      fromPrice: 310,
      weightLabel: "800mm",
      tagline: "Alumawall aluminium sleepers — lightweight, heatproof, Colorbond-matched, built to 800mm",
      description:
        "Extruded aluminium sleepers that clip together and slot into colour-matched 75×75mm posts — light enough to carry by hand, powder-coated to match your fence, and built for walls up to 800mm. DIY-friendly or contractor-installed.",
      swatches: [
        { label: "Smooth Grey", hex: "#9A9A97" },
        { label: "Charcoal", hex: "#3A3B3C" },
        { label: "Limestone", hex: "#D8CBB0" },
        { label: "Woodgrain", hex: "#8B5A2B" },
        { label: "Sandstone", hex: "#C9AE83" },
        { label: "Monument", hex: "#3A3B3C" },
        { label: "Basalt", hex: "#4B4D4C" },
        { label: "Dune", hex: "#9C8768" },
        { label: "Bass", hex: "#1B1B1B" },
      ],
    })
  );

  // ---------- Gates & Automation (3 services) ----------
  const gatesCat = catBySlug["gates-automation"]._id;

  function gateService({ name, slug, fromPrice, priceUnit, tagline, description, styles }) {
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
      title: `${name} Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Centurion authorised"],
      statTiles: [
        { value: "10 yr", label: "Warranty" },
        { value: "1 day", label: "Typical install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "Measure & written quote" },
      ],
      swatchGroupLabel: "Match your fence colour",
      swatchNote: "Colorbond-matched colours — Colorbond posts also available on request",
      swatches: FENCE_COLOURS,
      stylesLabel: "Gate types & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Fixed and programmed to your opening",
        "Powder-coated frames that match your fence",
        "Full site cleanup — offcuts & packaging gone",
        "10-yr / warranty workmanship warranty",
      ],
      popularAddOns: [
        "Solar power kits",
        "Keypad or intercom entry",
        "Remotes and smartphone control",
        "Additional remotes or keypads",
        "Preventative safety edges",
      ],
      waRulesTitle: "Automated the safe way — handled for you",
      waRules: [
        "Powered gates installed to AS/NZS 60335.2.103 — remote control, force limits and manual release all set correctly.",
        "Photocells and safety edges fitted so the gate stops or reverses before anyone gets hurt.",
        "Grid or off-grid, we confirm your setup covers what's needed before anyone pays.",
      ],
      processTitle: "From first call to first click of the remote",
      processSteps: process(
        "Walkthrough",
        "You sign off, we hand over remotes and the compliance paperwork.",
        "Tell us the gate style, opening width and gate positions you have in mind.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Fitted, programmed and installed — most gates done in 1 day."
      ),
      recentJobsTitle: `Recent ${name.toLowerCase()} around Perth`,
      recentJobs: [
        { image: IMG, caption: "Karrinyup · Gleaming installed" },
        { image: IMG, caption: "Canning Vale · Sliding · 3m" },
        { image: IMG, caption: "Ardross · Two-gate install" },
      ],
      reviews: reviewPool(
        "Fatima H.",
        "Karrinyup, May 2026",
        "Gates automated within the Centurion range — Bunnings-cut the fenceposts pretty well, latch swing spot on.",
        "Genevieve",
        "Canning Vale, June 2026",
        "Gate sliding open in a huge improvement — inspector flagged nothing, buzzer works well.",
        "The Ngs",
        "Ardross, April 2026",
        "Perfectly matched gate colours to the old fence. Remote control paired second visit, hence four stars."
      ),
      faqTitle: `${name} FAQs`,
      faqs: [
        { question: `How much does a ${name.toLowerCase()} cost in Perth?`, answer: `${name} starts around $${fromPrice} ${priceUnit}, depending on opening width and finish. Every job is priced off a free on-site measure.` },
        { question: "Swing or sliding — which suits my driveway?", answer: "Swing suits most standard driveways; sliding is better where space in front of the gate is tight or sloped." },
        { question: "How long does installation take?", answer: "Most gates are fitted, wired and programmed in a single day." },
        { question: "What happens in a power outage?", answer: "Every automated gate has a manual release so you're never locked in or out." },
        { question: "Can you automate my existing gate?", answer: "In most cases yes — we'll check your gate's weight and frame during the free measure." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Security fencing", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    gateService({
      name: "Swing Gates",
      slug: "swing-gates",
      fromPrice: 690,
      priceUnit: "installed",
      tagline: "Single and double swing gates — matched to your fence, all automated with Centurion motors",
      description:
        "Single and double swing gates fabricated to your opening — matched to your fence colour and automated with Centurion motors, wired or solar.",
      styles: [
        { name: "Single swing", fromPrice: 690, priceUnit: "per gate" },
        { name: "Double swing", fromPrice: 1240, priceUnit: "per gate", popular: true },
        { name: "Pedestrian gate", fromPrice: 420, priceUnit: "per gate" },
        { name: "Swing automation kits", fromPrice: 890, priceUnit: "per kit" },
      ],
    })
  );

  services.push(
    gateService({
      name: "Sliding Gates",
      slug: "sliding-gates",
      fromPrice: 2400,
      priceUnit: "installed",
      tagline: "Track-mounted and cantilever sliding gates — for wide openings and automated roadside entries",
      description:
        "Track-mounted and cantilever sliding gates — ideal for wide openings and automated roadside entries, fabricated to your opening and matched to your fence.",
      styles: [
        { name: "Track-mounted slider", fromPrice: 2400, priceUnit: "per gate" },
        { name: "Cantilever slider", fromPrice: 3450, priceUnit: "per gate", popular: true },
        { name: "Telescopic slider", fromPrice: 4200, priceUnit: "per gate" },
        { name: "Slide automation kits", fromPrice: 1250, priceUnit: "per kit" },
      ],
    })
  );

  services.push(
    gateService({
      name: "Automation",
      slug: "automation",
      fromPrice: 1250,
      priceUnit: "fitted",
      tagline: "Centurion swing and slide motors fitted to new or existing gates, battery-backed and solar-ready",
      description:
        "Centurion swing and slide motors fitted to new or existing gates — battery-backed and solar-ready, keyed to remotes, keypad or app control.",
      styles: [
        { name: "Swing automation (single)", fromPrice: 890, priceUnit: "per kit" },
        { name: "Swing automation (double)", fromPrice: 1250, priceUnit: "per kit", popular: true },
        { name: "Slide automation kit", fromPrice: 1650, priceUnit: "per kit" },
        { name: "Solar power packs", fromPrice: 480, priceUnit: "per kit" },
      ],
    })
  );

  // ---------- Security Fencing (3 services) ----------
  const securityCat = catBySlug["security-fencing"]._id;

  function securityService({ name, slug, fromPrice, priceUnit, tagline, description, styles }) {
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
      title: `${name} Fencing Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Forensic & commercial rated"],
      statTiles: [
        { value: "10 yr", label: "Powder-coat warranty" },
        { value: "1-3 days", label: "Typical install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "Measure & written quote" },
      ],
      swatchGroupLabel: "Powder-coat colours",
      swatchNote: "Black is most popular — all Colorbond-matched colours available",
      swatches: FENCE_COLOURS,
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "Galvanised, powder-coated steel panels, rails & gates",
        "Full site cleanup — offcuts & packaging gone",
        "10-yr coating + workmanship warranty",
      ],
      popularAddOns: [
        "Old fence removal & tip fees",
        "Matching powder-coated gates & keypads",
        "Access control — keypads & proximity entry",
        "Anti-climb spikes & topping",
        "CCTV & lighting conduit run",
      ],
      waRules: [
        "Front boundaries typically limit fencing height allowance for solid fencing — we'll confirm your council's rules.",
        "Anti-climb design covers gate frame and post positions, not just infill, following CPTED principles.",
        "Commercial runs are engineered for wind region and soil, with gates keyed and access control coordinated to suit.",
      ],
      processTitle: "From first call to locked gate",
      processSteps: process(
        "Walkthrough",
        "We check every gap and latch, then hand over compliance paperwork.",
        "Tell us the perimeter, style and gate positions you have in mind.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Core-drilled, cemented and levelled — most jobs done in 1-3 days."
      ),
      recentJobsTitle: `Recent ${name.toLowerCase()} around Perth`,
      recentJobs: [
        { image: IMG, caption: "Malaga · Warehouse 120m chainmesh" },
        { image: IMG, caption: "Como · Tennis court fencing" },
        { image: IMG, caption: "Bibra Lake · Boundary + keyed gates" },
      ],
      reviews: reviewPool(
        "Tony M.",
        "Malaga, May 2026",
        "Spear-top garrison around the vent lot the treats are ripped. Straight runs, clean valid, dozen four stars.",
        "Lauren R.",
        "Como, June 2026",
        "Chainmesh replaced over the trellises with zero disruption. Repainters not even ticked.",
        "Strata WA",
        "Bibra Lake, April 2026",
        "Matching gates keyed across the site — one change adjusted after handover, hence four stars."
      ),
      faqTitle: `${name} FAQs`,
      faqs: [
        { question: `How much does ${name.toLowerCase()} cost in Perth?`, answer: `${name} starts around $${fromPrice} ${priceUnit} supplied and installed. Every job is priced off a free on-site measure with a fixed written quote.` },
        { question: "How can a security fence be at the front?", answer: "Most WA councils allow taller security-style fencing behind the primary street setback — we check your specific block during the measure." },
        { question: "How long does installation take?", answer: "Most jobs are done in 1-3 days depending on length and gate count." },
        { question: "Garrison or chainmesh — which do I need?", answer: "Garrison suits street frontages and higher-visibility security; chainmesh suits large perimeter or commercial runs on a budget." },
        { question: "Can you match gates and access control?", answer: "Yes — we keypad, key or app-control gates to match the rest of your access system." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Gates & automation", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    securityService({
      name: "Garrison",
      slug: "garrison-fencing",
      fromPrice: 135,
      priceUnit: "per lineal metre",
      tagline: "Welded steel garrison panels — flat-top and spear-top profiles, anti-climb by design",
      description:
        "Welded steel garrison panels — flat-top and spear-top profiles, anti-climb by design, powder-coated for coastal WA and engineered for homes, schools and commercial sites.",
      styles: [
        { name: "Garrison flat-top", fromPrice: 135, priceUnit: "per lm" },
        { name: "Garrison spear-top", fromPrice: 155, priceUnit: "per lm", popular: true },
        { name: "Garrison gates", fromPrice: 560, priceUnit: "per gate" },
        { name: "Commercial runs", fromPrice: 0, priceUnit: "priced at quote" },
      ],
    })
  );

  services.push(
    securityService({
      name: "Chainmesh",
      slug: "chainmesh-fencing",
      fromPrice: 95,
      priceUnit: "per lineal metre",
      tagline: "Galvanised and PVC-coated chainmesh on pipe frameworks — fast, economical perimeter fencing",
      description:
        "Galvanised and PVC-coated chainmesh on pipe frameworks — fast, economical perimeter fencing for yards, sports courts, schools and commercial sites.",
      styles: [
        { name: "Galvanised chainmesh", fromPrice: 95, priceUnit: "per lm" },
        { name: "PVC-coated (black/green)", fromPrice: 115, priceUnit: "per lm", popular: true },
        { name: "Barbed-wire topped", fromPrice: 135, priceUnit: "per lm" },
        { name: "Chainmesh gates", fromPrice: 380, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    securityService({
      name: "Enclosures",
      slug: "security-enclosures",
      fromPrice: 1900,
      priceUnit: "per enclosure",
      tagline: "Design and build enclosures for bins, chainmesh and blade — bin, pump and plant cages",
      description:
        "Design and build security enclosures for bins, pump and plant cages, sports courts, dog runs and lock-up compounds, engineered and keyed to suit.",
      styles: [
        { name: "Bin & store enclosures", fromPrice: 1900, priceUnit: "per enclosure" },
        { name: "Plant & pump cages", fromPrice: 2450, priceUnit: "per enclosure", popular: true },
        { name: "Sports court enclosures", fromPrice: 0, priceUnit: "priced at quote" },
        { name: "Secure compounds", fromPrice: 0, priceUnit: "priced at quote" },
      ],
    })
  );

  // ---------- Blade Fencing (2 services) ----------
  const bladeCat = catBySlug["blade-fencing-designer-range"]._id;

  function bladeService({ name, slug, fromPrice, tagline, description, styles }) {
    return {
      category: bladeCat,
      isCategoryRoot: false,
      name,
      slug,
      cardImage: IMG,
      fromPrice,
      priceUnit: "per lineal metre",
      heroImage: IMG,
      breadcrumbLabel: `Blade Fencing / ${name}`,
      bannerTitle: name,
      bannerSubtitle: tagline,
      bannerCta: "Get A Free Quote",
      title: `${name} Fencing Perth`,
      description,
      trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "Designer range"],
      statTiles: [
        { value: "10 yr", label: "Powder-coat warranty" },
        { value: "1-2 days", label: "Typical install" },
        { value: "5.0", label: "300+ Google reviews" },
        { value: "$0", label: "Measure & written quote" },
      ],
      swatchGroupLabel: "Pick your colour or wood-look",
      swatchNote: "A curated palette — matte finish shown, more shades on request",
      swatches: [...FENCE_COLOURS, ...TIMBER_LOOK],
      stylesLabel: "Styles & pricing",
      styles,
      everyInstallIncludes: [
        "Free on-site measure & fixed written quote",
        "Posts core-drilled or cemented to engineer spec",
        "Powder-coated aluminium blades, framed or direct-fixed",
        "Full site cleanup — offcuts & packaging gone",
        "10-yr finish + workmanship warranty",
      ],
      popularAddOns: [
        "Old fence removal & tip fees",
        "Matching blade gates & letterboxes",
        "Integrated LED strip lighting",
        "Non-climb zone planting advice",
        "Rendered or featured post caps",
      ],
      waRules: [
        "R-Class fences with gaps under 100mm can form a compliant pool barrier — value fencing details clarified.",
        "R-Codes: front fences over 1.2m can usually be permeable — designer blade spacing certified, if confirmed with your council.",
        "Exposed frontages get engineered posts and footings for their wind region.",
      ],
      processTitle: "From first call to last blade",
      processSteps: process(
        "Walkthrough",
        "We sign off and hand over the warranty paperwork, then leave the site clean.",
        "Tell us the frontage length and colour or wood-look you have in mind.",
        "We walk the site and lock in a fixed written quote within 48 hours.",
        "Blades cut and fixed and levelled — most frontages done in 1-2 days."
      ),
      recentJobsTitle: `Recent ${name.toLowerCase()} fences in Perth`,
      recentJobs: [
        { image: IMG, caption: "City Beach · Monument" },
        { image: IMG, caption: "Mount Pleasant · Woodland Grey" },
        { image: IMG, caption: "Subiaco · Timber-look" },
      ],
      reviews: reviewPool(
        "Sophie R.",
        "City Beach, May 2026",
        "Blades frame the frontage and the house feels finally finished. Neighbours keep asking who did it.",
        "Owen J.",
        "Mount Pleasant, June 2026",
        "Wide blades around the pool and I trust it 100%. Colour matched perfectly, hence five blades.",
        "The Kavlies",
        "Subiaco, April 2026",
        "Timber-look blades and the mid-tang gate stunning. Colour match took a week, hence four stars."
      ),
      faqTitle: `${name} FAQs`,
      faqs: [
        { question: `How much does ${name.toLowerCase()} fencing cost?`, answer: `${name} starts around $${fromPrice} per lineal metre supplied and installed, timber or wood-look from $${fromPrice + 70}. Every job is priced off a free on-site measure with a fixed written quote.` },
        { question: "Framed or frameless blade — what's the difference?", answer: "Framed blade uses a top and bottom rail for a stronger fix; frameless direct-fixes each blade for a cleaner architectural line." },
        { question: "How long does installation take?", answer: "Most frontages are done in 1-2 days once your written quote is locked in." },
        { question: "Can blade fencing go around a pool?", answer: "Yes — with sub-100mm spacing and a certified gate, blade fencing can form part of a compliant pool barrier." },
        { question: "Will a tall blade fence pass council rules?", answer: "In most cases yes with permeable spacing — we confirm your specific council's R-Codes requirement before you commit." },
      ],
      relatedServices: ["Aluminium slat fencing", "Pool fencing", "Colorbond fencing", "Retaining walls"],
      areasServiced: AREAS,
    };
  }

  services.push(
    bladeService({
      name: "Frameless Blade",
      slug: "frameless-blade-range",
      fromPrice: 310,
      tagline: "Direct-fixed vertical blades with no top or bottom frame — flooring, architectural lines and pool-compliant spacing",
      description:
        "Direct-fixed vertical blades with no top or bottom frame — a floating, architectural line at compliant sub-100mm spacing, pool-compliant and courtyard-ready.",
      styles: [
        { name: "Frameless 50mm", fromPrice: 310, priceUnit: "per lm" },
        { name: "Frameless 65mm", fromPrice: 330, priceUnit: "per lm", popular: true },
        { name: "Wood-look frameless", fromPrice: 380, priceUnit: "per lm" },
        { name: "Frameless blade gates", fromPrice: 780, priceUnit: "per gate" },
      ],
    })
  );

  services.push(
    bladeService({
      name: "Radiator Blade",
      slug: "radiator-blade-fencing",
      fromPrice: 380,
      tagline: "Deep 65mm radiator-profile blades with a pronounced shadow line — the boldest front-fence statement in the range",
      description:
        "Deep 65mm radiator-profile blades with a pronounced shadow line — engineered for exposed frontages, pool-compliant on request with matching gate automation.",
      styles: [
        { name: "Radiator 65mm", fromPrice: 380, priceUnit: "per lm" },
        { name: "Radiator 90mm deep", fromPrice: 420, priceUnit: "per lm", popular: true },
        { name: "Radiator + plinth base", fromPrice: 440, priceUnit: "per lm" },
        { name: "Radiator blade gates", fromPrice: 820, priceUnit: "per gate" },
      ],
    })
  );

  // ---------- Asbestos Fence Removal (single service) ----------
  services.push({
    category: catBySlug["asbestos-fence-removal"]._id,
    isCategoryRoot: true,
    name: "Asbestos Fence Removal",
    slug: "asbestos-fence-removal",
    cardImage: IMG,
    fromPrice: 30,
    priceUnit: "per lineal metre",
    heroImage: IMG,
    breadcrumbLabel: "Asbestos Fence Removal",
    bannerTitle: "Asbestos Fence Removal",
    bannerSubtitle: "Licensed removal and disposal of old asbestos fencing across Perth",
    bannerCta: "Get A Free Quote",
    title: "Asbestos Fence Removal Perth",
    description:
      "Licensed removal and disposal of old asbestos-cement fencing — sealed, transported and dumped to WorkSafe WA requirements, with a clearance certificate handed over so you can build the new fence with confidence.",
    trustBadges: ["5.0 · 300+ Google reviews", "Licensed & insured", "WorkSafe WA compliant"],
    statTiles: [
      { value: "Licensed", label: "WorkSafe WA registered" },
      { value: "1 day", label: "Typical removal" },
      { value: "5.0", label: "300+ Google reviews" },
      { value: "$0", label: "Measure & written quote" },
    ],
    swatchGroupLabel: "",
    swatchNote: "",
    swatches: [],
    stylesLabel: "Removal pricing",
    styles: [
      { name: "Standard boundary run", fromPrice: 30, priceUnit: "per lm", popular: true },
      { name: "Removal + tip fees", fromPrice: 38, priceUnit: "per lm" },
      { name: "Removal + new Colorbond", fromPrice: 0, priceUnit: "priced at quote" },
      { name: "Clearance certificate", fromPrice: 0, priceUnit: "included" },
    ],
    everyInstallIncludes: [
      "Free on-site measure & fixed written quote",
      "Sealed, wrapped and removed to WorkSafe WA standard",
      "Licensed transport to an approved disposal site",
      "Full site cleanup — no shards or dust left behind",
      "Clearance certificate handed over on completion",
    ],
    popularAddOns: [
      "New Colorbond fence installed same visit",
      "New slat or blade fence installed same visit",
      "Post holes filled and site levelled",
      "Skip bin for other yard waste",
      "Same-day turnaround where access allows",
    ],
    waRulesTitle: "Handled to WorkSafe WA rules",
    waRules: [
      "Only licensed removalists can legally remove bonded asbestos fencing in WA — our crews and disposal partners are registered.",
      "Sheets are wetted down, wrapped and double-bagged before leaving your property, so nothing becomes airborne.",
      "A clearance certificate is issued on completion, which most councils and future buyers will ask to see.",
    ],
    processTitle: "From first call to final clearance",
    processSteps: process(
      "Walkthrough",
      "You get the clearance certificate and, if booked, we start the new fence.",
      "Tell us the fence length and whether you want a new fence installed same visit.",
      "We walk the site and lock in a fixed written quote within 48 hours.",
      "Sheets sealed, removed and disposed of — most runs done in a day."
    ),
    recentJobsTitle: "Recent asbestos removals around Perth",
    recentJobs: [
      { image: IMG, caption: "Rockingham · 32lm removed + new Colorbond" },
      { image: IMG, caption: "Armadale · 18lm removed" },
      { image: IMG, caption: "Midland · 40lm removed + new slat fence" },
    ],
    reviews: reviewPool(
      "Brendan S.",
      "Rockingham, May 2026",
      "Old asbestos fence gone and the new Colorbond up the same day. Paperwork for the clearance came through fast.",
      "Kayla M.",
      "Armadale, June 2026",
      "Crew wrapped and removed everything without a mess left behind. Certificate arrived the next day.",
      "Dave & Ellen",
      "Midland, April 2026",
      "Booked removal and new fence in one visit, saved us coordinating two trades. One post needed resetting, hence four stars."
    ),
    faqTitle: "Asbestos removal FAQs",
    faqs: [
      { question: "How much does asbestos fence removal cost?", answer: "Standard boundary runs start around $30 per lineal metre, with tip fees from $38. Every job is priced off a free on-site measure with a fixed written quote." },
      { question: "Do I need a licensed removalist?", answer: "Yes — WorkSafe WA requires bonded asbestos fencing to be removed by a licensed asbestos removalist, which we are." },
      { question: "How long does removal take?", answer: "Most standard boundary runs are removed, wrapped and carted away within a day." },
      { question: "Can you install a new fence the same day?", answer: "In most cases yes, if you book removal and a new Colorbond or slat fence together we aim to do both in the same visit." },
      { question: "Will I get proof it's been done properly?", answer: "Yes — you'll get a clearance certificate on completion, which most councils and future buyers will ask to see." },
    ],
    relatedServices: ["Colorbond fencing", "Aluminium slat fencing", "Blade fencing", "Retaining walls"],
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
