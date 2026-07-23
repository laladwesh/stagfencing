const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema(
  {
    productSlug: String,
    name: { type: String, required: true },
    image: String,
    selections: Schema.Types.Mixed,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reference: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    deliveryMethod: String,
    address: Schema.Types.Mixed,
    notes: String,
    subtotal: Number,
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: Number,
    paymentMethod: { type: String, enum: ["card", "bank_transfer"], default: "card" },
    stripePaymentIntentId: String,
    status: { type: String, default: "Pending payment" },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
