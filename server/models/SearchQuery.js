const { Schema, model } = require("mongoose");

const searchQuerySchema = new Schema(
  {
    query: { type: String, required: true, unique: true, lowercase: true, trim: true },
    count: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = model("SearchQuery", searchQuerySchema);
