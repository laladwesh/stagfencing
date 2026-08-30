// Static shell config only — the actual fence/wall options, names and prices
// are loaded live from the real seeded Service data (see useCalculatorCatalog
// in Calculator.jsx), not hardcoded here. categorySlugs lists which real
// ServiceCategory documents to pull options from.

export const FENCE_CALCULATOR = {
  breadcrumb: "Home / Services / Fence Calculator",
  title: "Fence Calculator",
  subtitle: "Instant fencing estimate — pick a real product and see a live price",
  heading: "Build your fencing estimate",
  headingSubtitle:
    "Pick a fence, set the run, and see a live Perth-metro price. Change anything and it recalculates instantly — no form, no waiting.",
  chooseLabel: "1. CHOOSE YOUR FENCE",
  pricingModel: "linear",
  categorySlugs: [
    "colorbond-fencing",
    "aluminium-slat-fencing-perth",
    "security-fencing",
    "blade-fencing",
    "pvc-fencing",
  ],
  lengthUnitLabel: "Length of fence run",
  defaultLength: 20,
  maxLength: 100,
};

export const RETAINING_CALCULATOR = {
  breadcrumb: "Home / Calculators / Retaining Calculator",
  title: "Retaining Calculator",
  subtitle: "Instant retaining wall estimate — height, length and a real wall system",
  heading: "Build your retaining estimate",
  headingSubtitle:
    "Pick a wall system, set the height and length, and see a live Perth-metro price. Change anything — the estimate updates as you go.",
  chooseLabel: "1. CHOOSE YOUR WALL",
  pricingModel: "area",
  categorySlugs: ["retaining-walls"],
  heightOptions: ["600 mm", "900 mm", "1200 mm", "1500 mm"],
  lengthUnitLabel: "Length of wall run",
  defaultLength: 10,
  maxLength: 60,
};
