const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumedAt: Date,
  },
  { timestamps: true }
);

module.exports = model("Otp", otpSchema);
