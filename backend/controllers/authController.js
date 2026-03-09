import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};
const isDbUnavailable = (error) =>
  error?.name === "MongooseServerSelectionError" ||
  error?.message?.includes("buffering timed out");

const issueToken = (userId) =>
  jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim() || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    const token = issueToken(user._id.toString());

    return res.status(201).json({
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    if (error.message === "JWT_SECRET is not set") {
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }

    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = issueToken(user._id.toString());

    return res.json({
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    if (error.message === "JWT_SECRET is not set") {
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    return res.status(500).json({ message: "Failed to login" });
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};
