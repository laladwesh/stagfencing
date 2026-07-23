const Stripe = require("stripe");

let client = null;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error("Stripe is not configured — set STRIPE_SECRET_KEY in .env");
    err.status = 503;
    throw err;
  }
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

module.exports = { getStripe };
