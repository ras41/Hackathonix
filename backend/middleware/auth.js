import jwt from "jsonwebtoken";
import User from "../models/user.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7);
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Missing authorization token" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const userId = payload?.sub;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found for token" });
    }

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    if (error.message === "JWT_SECRET is not set") {
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};
