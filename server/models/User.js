const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: String,
    avatar: String,
    googleId: String,
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
