export const SITE_NAME = "Stag Fencing";
export const SITE_URL = "https://stagfencing.com.au";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-bg.png`;
export const BUSINESS_PHONE = "+61431703770";
export const BUSINESS_EMAIL = "quote@stagfencing.com.au";
export const SERVICE_AREAS = [
  "Perth",
  "Joondalup",
  "Wanneroo",
  "Rockingham",
  "Mandurah",
  "Bunbury",
];

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: "$$",
    areaServed: SERVICE_AREAS.map((suburb) => ({ "@type": "City", name: suburb })),
    address: {
      "@type": "PostalAddress",
      addressRegion: "WA",
      addressCountry: "AU",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "500",
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd({ name, description, path, image, price }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: absoluteUrl(path),
    image,
    areaServed: SERVICE_AREAS.map((suburb) => ({ "@type": "City", name: suburb })),
    provider: { "@type": "HomeAndConstructionBusiness", name: SITE_NAME, url: SITE_URL },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "AUD",
            price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function productJsonLd({ name, description, path, image, price, sku, reviews, ratingValue, reviewCount }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: absoluteUrl(path),
    image,
    sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(path),
    },
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingValue || 5,
            reviewCount,
          },
        }
      : {}),
    ...(reviews && reviews.length
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
            reviewBody: r.body,
          })),
        }
      : {}),
  };
}

export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
