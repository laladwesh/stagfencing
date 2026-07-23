const { Schema, model } = require("mongoose");

const serviceCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: String,
    tagline: String,
    fromPrice: Number,
    priceUnit: String,
    sortOrder: { type: Number, default: 0 },
    hasRange: { type: Boolean, default: false },
    rangeBannerTitle: String,
    rangeBannerSubtitle: String,
    rangeBannerCta: String,
    rangeIntro: String,
    heroImage: String,
  },
  { timestamps: true }
);

module.exports = model("ServiceCategory", serviceCategorySchema);
