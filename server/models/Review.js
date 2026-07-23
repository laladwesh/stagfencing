const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    location: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    photos: [String],
  },
  { timestamps: true }
);

module.exports = model("Review", reviewSchema);
