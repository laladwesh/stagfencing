const { Schema, model } = require("mongoose");

const galleryProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    suburb: String,
    service: String,
    serviceSlug: String,
    productSlug: String,
    colour: String,
    length: String,
    completedDate: Date,
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("GalleryProject", galleryProjectSchema);
