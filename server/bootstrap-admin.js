// Usage: node server/bootstrap-admin.js you@email.com
// Promotes an existing account to admin. The account must already exist —
// sign in once (Google or OTP) before running this.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/User");

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node server/bootstrap-admin.js you@email.com");
    process.exitCode = 1;
    await mongoose.connection.close().catch(() => {});
    return;
  }

  await connectDB();
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { isAdmin: true },
    { returnDocument: "after" }
  );

  if (!user) {
    console.error(`No account found for ${email} — sign in at least once first, then re-run this.`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error("Failed:", err);
  await mongoose.connection.close().catch(() => {});
});
