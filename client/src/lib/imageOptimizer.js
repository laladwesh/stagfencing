// Utility to optimize image URLs. All current site images are hosted on S3
// (uploaded as-is, no on-the-fly resizing infra), so for S3 URLs this is a
// passthrough — it exists as a single seam to add a resizing/CDN layer later
// (e.g. CloudFront + Lambda@Edge, or an imgproxy) without touching every
// call site. The Cloudinary branch is kept for forward/backward
// compatibility in case any image source other than S3 is ever introduced.
export function getOptimizedUrl(imageUrl, width) {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;

  if (imageUrl.includes(".s3.") && imageUrl.includes(".amazonaws.com")) {
    // No resizing service in front of S3 yet — served as uploaded.
    return imageUrl;
  }

  const marker = "/upload/";
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return imageUrl;

  try {
    const rest = imageUrl.slice(idx + marker.length);
    const nextSlash = rest.indexOf("/");
    const firstSegment = nextSlash === -1 ? rest : rest.slice(0, nextSlash);

    const makeInsert = (existingSeg) => {
      const parts = existingSeg ? existingSeg.split(",").filter(Boolean) : [];
      const hasF = parts.some((p) => p.startsWith("f_") || p === "f_auto");
      const hasQ = parts.some((p) => p.startsWith("q_") || p === "q_auto");
      const hasW = parts.some((p) => p.startsWith("w_"));
      if (width && !hasW) parts.unshift(`w_${width}`);
      if (!hasF) parts.push("f_auto");
      if (!hasQ) parts.push("q_auto");
      return parts.join(",");
    };

    if (/^v\d+$/.test(firstSegment)) {
      const insert = makeInsert("");
      return imageUrl.slice(0, idx + marker.length) + insert + "/" + rest;
    }

    if (
      firstSegment.includes("f_") ||
      firstSegment.includes("q_") ||
      firstSegment.includes("w_") ||
      firstSegment.includes(",")
    ) {
      const insert = makeInsert(firstSegment);
      const remainder = nextSlash === -1 ? "" : rest.slice(nextSlash + 1);
      return imageUrl.slice(0, idx + marker.length) + insert + "/" + remainder;
    }

    const insert = makeInsert("");
    return imageUrl.slice(0, idx + marker.length) + insert + "/" + rest;
  } catch (e) {
    return imageUrl;
  }
}

export default getOptimizedUrl;
