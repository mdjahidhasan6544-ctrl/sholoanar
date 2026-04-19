const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { seedDatabase } = require("../seed/runSeed");
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

const bootstrap = asyncHandler(async (_req, res) => {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    res.status(409);
    throw new Error("Bootstrap is disabled after the first admin account is created");
  }

  const result = await seedDatabase();
  return successResponse(res, { bootstrapped: true, email: result.email }, 201);
});

const resetDefaultPassword = asyncHandler(async (_req, res) => {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  const password = _req.body?.password || process.env.DEFAULT_ADMIN_PASSWORD;

  if (!email || !password) {
    res.status(500);
    throw new Error("DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("Default admin user not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
  const updatedUser = await User.findById(user._id);
  const verified = updatedUser ? await updatedUser.comparePassword(password) : false;

  return successResponse(res, { reset: true, email: user.email, verified });
});

module.exports = { login, logout, me, bootstrap, resetDefaultPassword };
