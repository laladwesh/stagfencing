const { verifyToken } = require("../lib/jwt");
const User = require("../models/User");

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = await User.findById(payload.sub);
  } catch {
    req.user = null;
  }
  next();
}

module.exports = optionalAuth;
