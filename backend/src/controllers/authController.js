const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const { successResponse } = require("../utils/responses");
const { setAuthCookie, signToken } = require("../utils/tokens");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = signToken(user._id);
  setAuthCookie(res, token);

  return successResponse(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "sholoana_admin");
  return successResponse(res, { loggedOut: true });
});

const me = asyncHandler(async (req, res) => {
  return successResponse(res, { user: req.user });
});

module.exports = { login, logout, me };
