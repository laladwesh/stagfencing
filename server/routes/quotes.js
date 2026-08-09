const express = require("express");
const crypto = require("crypto");
const QuoteRequest = require("../models/QuoteRequest");
const requireAuth = require("../middleware/requireAuth");
const optionalAuth = require("../middleware/optionalAuth");
const { sendQuoteRequestEmail, sendQuoteConfirmationEmail } = require("../lib/mailer");

const router = express.Router();

router.get("/mine", requireAuth, async (req, res) => {
  const quotes = await QuoteRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ quotes });
});

router.post("/", optionalAuth, async (req, res) => {
  const {
    service,
    propertyType,
    approxLength,
    timeframe,
    notes,
    photos,
    selection,
    calculatorEstimate,
    firstName,
    lastName,
    mobile,
    email,
    siteAddress,
    suburb,
    state,
    postcode,
    preferredDate,
    preferredTime,
    noPreference,
  } = req.body;

  if (!firstName || !lastName || !mobile || !email || !siteAddress || !suburb || !postcode) {
    return res.status(400).json({ error: "Missing required customer details" });
  }

  const reference = `SF-${crypto.randomInt(1000, 9999)}`;

  const quote = await QuoteRequest.create({
    reference,
    user: req.user?._id,
    service,
    propertyType,
    approxLength,
    timeframe,
    notes,
    photos,
    selection,
    calculatorEstimate,
    firstName,
    lastName,
    mobile,
    email,
    siteAddress,
    suburb,
    state,
    postcode,
    preferredDate,
    preferredTime,
    noPreference,
  });

  sendQuoteRequestEmail(quote).catch((err) => console.error("[quotes] notify email failed:", err.message));
  sendQuoteConfirmationEmail(quote).catch((err) => console.error("[quotes] confirmation email failed:", err.message));

  res.status(201).json({ quote });
});

module.exports = router;
