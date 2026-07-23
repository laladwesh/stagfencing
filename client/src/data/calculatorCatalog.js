export const FENCE_CALCULATOR = {
  breadcrumb: "Home / Services / Fence Calculator",
  title: "Fence Calculator",
  subtitle: "Instant Colorbond estimate — panels, posts and a ballpark price",
  heading: "Build your fencing estimate",
  headingSubtitle:
    "Pick a fence, set the run, and see a live Perth-metro price. Change anything and it recalculates instantly — no form, no waiting.",
  chooseLabel: "1. CHOOSE YOUR FENCE",
  categories: [
    {
      category: "Privacy & Screening",
      subtitle: "Homes & backyards",
      options: [
        { name: "Colorbond", description: "Classic steel privacy", pricePerMetre: 100 },
        { name: "Colorbond", description: "Classic steel privacy, tall", pricePerMetre: 115 },
        { name: "Colorbond", description: "Classic steel privacy, slotted", pricePerMetre: 108 },
        { name: "Colorbond", description: "Classic steel privacy, corner post", pricePerMetre: 102 },
      ],
    },
    {
      category: "Pool & Garden",
      subtitle: "Compliant & clear-view",
      options: [
        { name: "Colorbond", description: "Compliant, clear-view top", pricePerMetre: 118 },
        { name: "Colorbond", description: "Compliant, solid infill", pricePerMetre: 112 },
      ],
    },
    {
      category: "Security & Boundary",
      subtitle: "Commercial & perimeter",
      options: [
        { name: "Colorbond", description: "Heavy-duty perimeter", pricePerMetre: 130 },
        { name: "Colorbond", description: "Heavy-duty, anti-climb", pricePerMetre: 138 },
      ],
    },
    {
      category: "Pool & Garden",
      subtitle: "Feature & sloping blocks",
      options: [
        { name: "Colorbond", description: "Raked to follow slope", pricePerMetre: 122 },
        { name: "Colorbond", description: "Stepped panels", pricePerMetre: 126 },
      ],
    },
  ],
  styleOptions: ["Standard (Trim clad)", "Modern (Flat panel)", "Rural (Ribbed)"],
  heightOptions: ["1200 mm", "1500 mm", "1800 mm", "2100 mm"],
  thirdDropdownLabel: "Plinth / kickboard",
  thirdDropdownOptions: ["None", "Colorbond plinth", "Concrete kickboard"],
  lengthUnitLabel: "Length of fence run",
  defaultLength: 20,
  maxLength: 100,
};

export const RETAINING_CALCULATOR = {
  breadcrumb: "Home / Calculators / Retaining Calculator",
  title: "Retaining Calculator",
  subtitle: "Instant retaining wall estimate — height, length and sleeper system",
  heading: "Build your retaining estimate",
  headingSubtitle:
    "Pick a wall system, set the height and length, and see a live Perth-metro price. Change anything — the estimate updates as you go.",
  chooseLabel: "1. CHOOSE YOUR WALL",
  categories: [
    {
      category: "Privacy & Screening",
      subtitle: "Homes & backyards",
      options: [
        { name: "Fibrewall Smooth", description: "Classic steel privacy", pricePerMetre: 290 },
        { name: "Fibrewall Woodgrain", description: "Classic steel privacy", pricePerMetre: 305 },
        { name: "Alumawall", description: "Classic steel privacy", pricePerMetre: 310 },
        { name: "Precast Smooth", description: "Classic steel privacy", pricePerMetre: 270 },
      ],
    },
    {
      category: "Pool & Garden",
      subtitle: "Compliant & clear-view",
      options: [
        { name: "Precast Stackstone", description: "Classic steel privacy", pricePerMetre: 285 },
        { name: "Limestone-look", description: "Classic steel privacy", pricePerMetre: 295 },
      ],
    },
    {
      category: "Security & Boundary",
      subtitle: "Commercial & perimeter",
      options: [
        { name: "Alumawall Woodgrain", description: "Classic steel privacy", pricePerMetre: 330 },
        { name: "Concrete Sleeper", description: "Classic steel privacy", pricePerMetre: 265 },
      ],
    },
    {
      category: "Pool & Garden",
      subtitle: "Feature & sloping blocks",
      options: [
        { name: "Fibrewall 3.0m", description: "Classic steel privacy", pricePerMetre: 315 },
        { name: "Alumawall 3.0m", description: "Classic steel privacy", pricePerMetre: 340 },
      ],
    },
  ],
  styleOptions: ["Fibrewall Smooth", "Fibrewall Woodgrain", "Alumawall"],
  heightOptions: ["600 mm", "900 mm", "1200 mm", "1500 mm"],
  thirdDropdownLabel: "Plinth / retaining underneath",
  thirdDropdownOptions: ["None", "Concrete footing", "Engineered footing"],
  lengthUnitLabel: "Length of fence run",
  defaultLength: 10,
  maxLength: 60,
};
