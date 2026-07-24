const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");

const router = express.Router();

const SITE_URL = process.env.SITE_URL || "https://stagfencing.com.au";

// Only the one blog article with real content is indexable — the rest of
// client/src/data/articles.js are "coming soon" stubs marked noindex on the
// client, so they're deliberately left out of the sitemap.
const INDEXABLE_BLOG_SLUGS = ["how-to-choose-the-right-fence"];

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "weekly" },
  { path: "/calculators", priority: "0.7", changefreq: "monthly" },
  { path: "/calculators/fence-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/calculators/retaining-calculator", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "weekly" },
  { path: "/about-us", priority: "0.5", changefreq: "monthly" },
  { path: "/contact-us", priority: "0.5", changefreq: "monthly" },
  { path: "/request-a-quote", priority: "0.8", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.2", changefreq: "yearly" },
  { path: "/blog", priority: "0.6", changefreq: "weekly" },
  { path: "/faqs", priority: "0.6", changefreq: "monthly" },
];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ path, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(SITE_URL + path)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "",
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const [products, shopCategories, serviceCategories, services] = await Promise.all([
      Product.find({}, "slug updatedAt").lean(),
      Category.find({ parentSlug: null }, "slug updatedAt").lean(),
      ServiceCategory.find({}, "slug hasRange updatedAt").lean(),
      Service.find({}, "slug category updatedAt").populate("category", "slug hasRange").lean(),
    ]);

    const entries = [...STATIC_PAGES.map((page) => urlEntry({ ...page, lastmod: new Date() }))];

    for (const slug of INDEXABLE_BLOG_SLUGS) {
      entries.push(urlEntry({ path: `/blog/${slug}`, priority: "0.6", changefreq: "monthly" }));
    }

    for (const category of shopCategories) {
      entries.push(
        urlEntry({ path: `/shop/${category.slug}`, lastmod: category.updatedAt, priority: "0.7", changefreq: "weekly" })
      );
    }

    for (const product of products) {
      entries.push(
        urlEntry({ path: `/product/${product.slug}`, lastmod: product.updatedAt, priority: "0.6", changefreq: "weekly" })
      );
    }

    for (const category of serviceCategories) {
      entries.push(
        urlEntry({
          path: `/services/${category.slug}`,
          lastmod: category.updatedAt,
          priority: "0.8",
          changefreq: "weekly",
        })
      );
    }

    for (const service of services) {
      if (!service.category?.hasRange) continue;
      entries.push(
        urlEntry({
          path: `/services/${service.category.slug}/${service.slug}`,
          lastmod: service.updatedAt,
          priority: "0.7",
          changefreq: "weekly",
        })
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
      "\n"
    )}\n</urlset>\n`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Failed to generate sitemap:", err);
    res.status(500).send("Failed to generate sitemap");
  }
});

module.exports = router;
