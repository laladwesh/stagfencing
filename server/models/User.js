const { Schema, model } = require("mongoose");

const addressSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phone: String,
    street: String,
    apartment: String,
    suburb: String,
    state: String,
    postcode: String,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: String,
    avatar: String,
    googleId: String,
    address: addressSchema,
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
