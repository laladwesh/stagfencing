const { Schema, model } = require("mongoose");

const optionSchema = new Schema(
  {
    label: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    swatch: String,
    inStock: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const variantGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    options: [optionSchema],
  },
  { _id: false }
);

const specSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: String,
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategorySlug: String,
    shortDescription: String,
    description: String,
    images: [String],
    unit: { type: String, default: "each" },
    basePrice: { type: Number, required: true },
    variantGroups: [variantGroupSchema],
    whatsIncluded: [String],
    specifications: [specSchema],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    relatedSlugs: [String],
    priceMin: { type: Number, default: 0 },
    priceMax: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

function computePriceRange(product) {
  let min = product.basePrice;
  let max = product.basePrice;
  for (const group of product.variantGroups) {
    if (!group.options.length) continue;
    const mods = group.options.map((o) => o.priceModifier || 0);
    min += Math.min(...mods);
    max += Math.max(...mods);
  }
  return { min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100 };
}

productSchema.pre("save", function () {
  const { min, max } = computePriceRange(this);
  this.priceMin = min;
  this.priceMax = max;
});

productSchema.virtual("priceRange").get(function () {
  return { min: this.priceMin, max: this.priceMax };
});

productSchema.index({ name: "text", description: "text" });

module.exports = model("Product", productSchema);
