const { Schema, model } = require("mongoose");

const quoteRequestSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },

    service: String,
    propertyType: String,
    approxLength: String,
    timeframe: String,
    notes: String,
    photos: [String],

    selection: {
      serviceName: String,
      style: String,
      color: String,
      price: Number,
      priceUnit: String,
    },
    calculatorEstimate: {
      label: String,
      detail: String,
      low: Number,
      high: Number,
    },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    siteAddress: { type: String, required: true },
    suburb: { type: String, required: true },
    state: String,
    postcode: { type: String, required: true },

    preferredDate: Date,
    preferredTime: String,
    noPreference: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "lost"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = model("QuoteRequest", quoteRequestSchema);
