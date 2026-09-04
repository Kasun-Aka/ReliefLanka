const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const { hashPassword, verifyPassword, signToken } = require("../utils/auth");

function publicUser(user) {
  return { id: user.uid, email: user.email, role: user.role };
}

function validateCredentials(email, password) {
  return typeof email === "string" && email.includes("@") && typeof password === "string" && password.length >= 6;
}

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!validateCredentials(email, password)) {
    return res.status(400).json({ message: "Use a valid email and a password of at least 6 characters" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const user = await User.create({
    uid: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: "public",
  });
  res.status(201).json({ user: publicUser(user), token: signToken({ uid: user.uid, email: user.email, role: user.role }) });
});

const adminSignup = asyncHandler(async (req, res) => {
  if (!process.env.ADMIN_SIGNUP_CODE || req.body.adminCode !== process.env.ADMIN_SIGNUP_CODE) {
    return res.status(403).json({ message: "A valid admin signup code is required" });
  }
  const { email, password } = req.body;
  if (!validateCredentials(email, password)) {
    return res.status(400).json({ message: "Use a valid email and a password of at least 6 characters" });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const user = await User.create({
    uid: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: "coordinator",
  });
  res.status(201).json({ user: publicUser(user), token: signToken({ uid: user.uid, email: user.email, role: user.role }) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, admin } = req.body;
  const user = await User.findOne({ email: typeof email === "string" ? email.trim().toLowerCase() : email });
  if (!user || !(await verifyPassword(password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }
  if (admin && user.role !== "coordinator") return res.status(403).json({ message: "This account is not an admin account" });
  res.json({ user: publicUser(user), token: signToken({ uid: user.uid, email: user.email, role: user.role }) });
});

module.exports = { signup, adminSignup, login };
