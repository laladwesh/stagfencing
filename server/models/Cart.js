const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema(
  {
    id: String,
    productId: Schema.Types.ObjectId,
    slug: String,
    sku: String,
    name: String,
    image: String,
    selections: Schema.Types.Mixed,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = model("Cart", cartSchema);
