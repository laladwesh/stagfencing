require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { uploadBuffer } = require("./lib/s3");

const EXTRACT_ROOT = path.join(
  "C:/Users/Asus/AppData/Local/Temp/claude",
  "c--Users-Asus-OneDrive---Indian-Institute-of-Technology-Guwahati-Desktop-stagfencing",
  "f8a15db7-1dfc-4f2f-aafd-47c0a8e82da8/scratchpad/svc_imgs"
);

const FILES = [
  { key: "colorbond-1200mm", path: `${EXTRACT_ROOT}/color/img1/svc/height/Frame.png` },
  { key: "colorbond-1500mm", path: `${EXTRACT_ROOT}/color/img2/svc/height/Frame.png` },
  { key: "colorbond-1800mm", path: `${EXTRACT_ROOT}/color/img3/svc/height/Frame.png` },
  { key: "colorbond-2100mm", path: `${EXTRACT_ROOT}/color/img4/svc/height/Frame.png` },

  { key: "slat-1", path: `${EXTRACT_ROOT}/slat/img1/svc/height/diagram.png` },
  { key: "slat-2", path: `${EXTRACT_ROOT}/slat/img2/svc/height/diagram.png` },
  { key: "slat-3", path: `${EXTRACT_ROOT}/slat/img3/svc/height/diagram.png` },
  { key: "slat-4", path: `${EXTRACT_ROOT}/slat/img4/svc/height/Frame.png` },

  { key: "pool-1", path: `${EXTRACT_ROOT}/pool/frameless/img1/svc/height/Frame.png` },
  { key: "pool-2", path: `${EXTRACT_ROOT}/pool/frameless/img2/svc/height/Frame.png` },
  { key: "pool-3", path: `${EXTRACT_ROOT}/pool/frameless/img3/svc/height/Frame.png` },
  { key: "pool-4", path: `${EXTRACT_ROOT}/pool/frameless/img4/svc/height/Frame.png` },

  { key: "retaining-1", path: `${EXTRACT_ROOT}/retaining/limestone/img1/svc/height/Frame.png` },
  { key: "retaining-2", path: `${EXTRACT_ROOT}/retaining/limestone/img2/svc/height/Frame.png` },
  { key: "retaining-3", path: `${EXTRACT_ROOT}/retaining/limestone/img3/svc/height/Frame.png` },
  { key: "retaining-4", path: `${EXTRACT_ROOT}/retaining/limestone/img4/svc/height/Frame.png` },

  { key: "gates-1", path: `${EXTRACT_ROOT}/gates/swing/img1/svc/height/Frame.png` },
  { key: "gates-2", path: `${EXTRACT_ROOT}/gates/swing/img2/svc/height/Frame.png` },
  { key: "gates-3", path: `${EXTRACT_ROOT}/gates/swing/img3/svc/height/diagram.png` },
  { key: "gates-4", path: `${EXTRACT_ROOT}/gates/swing/img4/svc/height/Frame.png` },

  { key: "security-1", path: `${EXTRACT_ROOT}/security/garrison/img1/svc/height/Frame.png` },
  { key: "security-2", path: `${EXTRACT_ROOT}/security/garrison/img2/svc/height/Frame.png` },
  { key: "security-3", path: `${EXTRACT_ROOT}/security/garrison/img3/svc/height/Frame.png` },
  { key: "security-4", path: `${EXTRACT_ROOT}/security/garrison/img4/svc/height/Frame.png` },

  { key: "blade-1", path: `${EXTRACT_ROOT}/blade/img1/svc/height/Frame.png` },
  { key: "blade-2", path: `${EXTRACT_ROOT}/blade/img2/svc/height/Frame.png` },
  { key: "blade-3", path: `${EXTRACT_ROOT}/blade/img3/svc/height/Frame.png` },
  { key: "blade-4", path: `${EXTRACT_ROOT}/blade/img4/svc/height/Frame.png` },

  { key: "pvc-1", path: `${EXTRACT_ROOT}/pvc/pvc-privacy/img1/svc/height/Frame.png` },
  { key: "pvc-2", path: `${EXTRACT_ROOT}/pvc/pvc-privacy/img2/svc/height/Frame.png` },
  { key: "pvc-3", path: `${EXTRACT_ROOT}/pvc/pvc-privacy/img3/svc/height/Frame.png` },
  { key: "pvc-4", path: `${EXTRACT_ROOT}/pvc/pvc-privacy/img4/svc/height/Frame.png` },

  { key: "asbestos-pricing-1", path: `${EXTRACT_ROOT}/asbestos/options and pricing/img1/svc/height/Frame.png` },
  { key: "asbestos-pricing-2", path: `${EXTRACT_ROOT}/asbestos/options and pricing/img2/svc/height/Frame.png` },
  { key: "asbestos-pricing-3", path: `${EXTRACT_ROOT}/asbestos/options and pricing/img3/svc/height/Frame.png` },
  { key: "asbestos-pricing-4", path: `${EXTRACT_ROOT}/asbestos/options and pricing/img4/svc/height/Frame.png` },

  { key: "asbestos-id-1", path: `${EXTRACT_ROOT}/asbestos/removal/img1/svc/tell/Frame@2x.png` },
  { key: "asbestos-id-2", path: `${EXTRACT_ROOT}/asbestos/removal/img2/svc/tell/Frame.png` },
  { key: "asbestos-id-3", path: `${EXTRACT_ROOT}/asbestos/removal/img3/svc/tell/Frame.png` },
];

async function run() {
  const results = {};
  for (const f of FILES) {
    const buffer = fs.readFileSync(f.path);
    const { url } = await uploadBuffer({
      buffer,
      contentType: "image/png",
      originalName: `${f.key}.png`,
      folder: "services",
    });
    results[f.key] = url;
    console.log(f.key, "->", url);
  }
  fs.writeFileSync(path.join(__dirname, "service-icon-urls.json"), JSON.stringify(results, null, 2));
  console.log(`\nUploaded ${FILES.length} images. Saved to server/service-icon-urls.json`);
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
