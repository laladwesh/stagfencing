const fs = require("fs");
const path = require("path");

const urls = JSON.parse(fs.readFileSync(path.join(__dirname, "service-icon-urls.json"), "utf8"));

const colorbond = [urls["colorbond-1200mm"], urls["colorbond-1500mm"], urls["colorbond-1800mm"], urls["colorbond-2100mm"]];
const slat = [urls["slat-1"], urls["slat-2"], urls["slat-3"], urls["slat-4"]];
const pool = [urls["pool-1"], urls["pool-2"], urls["pool-3"], urls["pool-4"]];
const retaining = [urls["retaining-1"], urls["retaining-2"], urls["retaining-3"], urls["retaining-4"]];
const gates = [urls["gates-1"], urls["gates-2"], urls["gates-3"], urls["gates-4"]];
const security = [urls["security-1"], urls["security-2"], urls["security-3"], urls["security-4"]];
const blade = [urls["blade-1"], urls["blade-2"], urls["blade-3"], urls["blade-4"]];
const pvc = [urls["pvc-1"], urls["pvc-2"], urls["pvc-3"], urls["pvc-4"]];
const asbestosPricing = [urls["asbestos-pricing-1"], urls["asbestos-pricing-2"], urls["asbestos-pricing-3"], urls["asbestos-pricing-4"]];
const asbestosId = [urls["asbestos-id-1"], urls["asbestos-id-2"], urls["asbestos-id-3"]];

// One entry per "styles: [ ... ]" block, IN FILE ORDER.
const blockIconGroups = [
  colorbond, // Colorbond
  slat, // Slat
  pool, // Frameless Glass
  pool, // Tubular Aluminium
  pool, // Perf Pool
  pool, // Free Standing Batten
  pool, // Pik Round Batten
  pool, // Barr Fencing
  retaining, // Limestone
  retaining, // Post & Panel
  gates, // Swing Gates
  gates, // Sliding Gates
  gates, // Automation
  security, // Garrison
  security, // Chainmesh
  security, // Enclosures
  security, // Palisade
  blade, // Blade Fencing
  asbestosPricing, // Asbestos removal pricing
  pvc, // PVC Privacy
  pvc, // PVC Picket
  pvc, // Modular Walls (reusing PVC icons per instruction)
];

const filePath = path.join(__dirname, "seed-services.js");
let content = fs.readFileSync(filePath, "utf8");

let blockIndex = 0;
content = content.replace(/styles: \[([\s\S]*?)\n(\s*)\],/g, (fullMatch, inner, closingIndent) => {
  const icons = blockIconGroups[blockIndex];
  blockIndex += 1;
  if (!icons) {
    throw new Error(`No icon group defined for styles block #${blockIndex} — check blockIconGroups length`);
  }

  let itemIndex = 0;
  const newInner = inner.replace(/\{ name: "/g, () => {
    const icon = icons[itemIndex];
    itemIndex += 1;
    return `{ icon: "${icon}", name: "`;
  });

  if (itemIndex !== icons.length) {
    throw new Error(`Expected ${icons.length} style items in block, found ${itemIndex} (block #${blockIndex})`);
  }

  return `styles: [${newInner}\n${closingIndent}],`;
});

if (blockIndex !== blockIconGroups.length) {
  throw new Error(`Expected ${blockIconGroups.length} styles blocks, found ${blockIndex}`);
}

// Asbestos identification cards (3 images)
let idIndex = 0;
content = content.replace(/\{\n(\s*)image: "",\n(\s*)title: /g, (fullMatch, indent1, indent2) => {
  if (idIndex >= asbestosId.length) return fullMatch;
  const icon = asbestosId[idIndex];
  idIndex += 1;
  return `{\n${indent1}image: "${icon}",\n${indent2}title: `;
});

if (idIndex !== asbestosId.length) {
  throw new Error(`Expected ${asbestosId.length} identification card images, found ${idIndex}`);
}

fs.writeFileSync(filePath, content);
console.log(`Patched ${blockIndex} styles blocks and ${idIndex} identification card images.`);
