const { Schema, model } = require("mongoose");

const swatchSchema = new Schema({ label: String, hex: String }, { _id: false });
const styleSchema = new Schema({
  name: String,
  fromPrice: Number,
  priceUnit: String,
  popular: { type: Boolean, default: false },
  icon: String,
});
const processStepSchema = new Schema({ title: String, description: String }, { _id: false });
const recentJobSchema = new Schema({ image: String, caption: String }, { _id: false });
const reviewSchema = new Schema(
  { name: String, location: String, rating: Number, comment: String },
  { _id: false }
);
const faqSchema = new Schema({ question: String, answer: String }, { _id: false });

const serviceSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
    isCategoryRoot: { type: Boolean, default: false },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    cardImage: String,
    fromPrice: Number,
    priceUnit: String,

    heroImage: String,
    breadcrumbLabel: String,
    bannerTitle: String,
    bannerSubtitle: String,
    bannerCta: String,

    title: String,
    description: String,
    trustBadges: [String],
    statTiles: [{ value: String, label: String }],

    swatchGroupLabel: String,
    swatchNote: String,
    swatches: [swatchSchema],

    stylesLabel: { type: String, default: "Styles & pricing" },
    styles: [styleSchema],

    everyInstallIncludes: [String],
    popularAddOns: [String],

    waRulesTitle: { type: String, default: "Built to WA rules — handled for you" },
    waRules: [String],

    processTitle: String,
    processSteps: [processStepSchema],

    recentJobsTitle: String,
    recentJobs: [recentJobSchema],

    reviews: [reviewSchema],

    faqTitle: String,
    faqs: [faqSchema],

    relatedServices: [String],
    areasServiced: [String],
  },
  { timestamps: true }
);

module.exports = model("Service", serviceSchema);
