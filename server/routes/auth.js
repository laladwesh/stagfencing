const express = require("express");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { signToken } = require("../lib/jwt");
const { sendOtpEmail } = require("../lib/mailer");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/otp/request", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const code = generateCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({ email: email.toLowerCase().trim(), codeHash, expiresAt });
  await sendOtpEmail(email, code);

  res.json({ ok: true });
});

router.post("/otp/verify", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

  const normalizedEmail = email.toLowerCase().trim();
  const otp = await Otp.findOne({ email: normalizedEmail, consumedAt: null }).sort({ createdAt: -1 });

  if (!otp) return res.status(400).json({ error: "No code requested for this email" });
  if (otp.expiresAt < new Date()) return res.status(400).json({ error: "Code has expired" });
  if (otp.attempts >= 5) return res.status(400).json({ error: "Too many attempts, request a new code" });

  if (otp.codeHash !== hashCode(code)) {
    otp.attempts += 1;
    await otp.save();
    return res.status(400).json({ error: "Incorrect code" });
  }

  otp.consumedAt = new Date();
  await otp.save();

  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    user = await User.create({ email: normalizedEmail });
  }

  const token = signToken(user);
  res.json({ token, user });
});

router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing Google credential" });
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: "Google login is not configured on the server" });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: "Invalid Google credential" });
  }

  const email = payload.email.toLowerCase().trim();
  let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] });

  if (!user) {
    user = await User.create({
      email,
      name: payload.name,
      avatar: payload.picture,
      googleId: payload.sub,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.name = user.name || payload.name;
    user.avatar = user.avatar || payload.picture;
    await user.save();
  }

  const token = signToken(user);
  res.json({ token, user });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.put("/address", requireAuth, async (req, res) => {
  const { firstName, lastName, phone, street, apartment, suburb, state, postcode } = req.body;
  req.user.address = { firstName, lastName, phone, street, apartment, suburb, state, postcode };
  await req.user.save();
  res.json({ user: req.user });
});

module.exports = router;
