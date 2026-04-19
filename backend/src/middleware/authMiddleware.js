const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.[process.env.COOKIE_NAME || "sholoana_admin"] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});

module.exports = { protect };
