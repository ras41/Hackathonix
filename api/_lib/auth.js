import jwt from "jsonwebtoken";
import User from "./models/user.js";
import { connectDB } from "./db.js";

const getJwtSecret = () => process.env.JWT_SECRET || "change-me-in-production";

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7);
};

export async function requireAuth(req) {
  await connectDB();
  
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return { error: { status: 401, message: "Missing authorization token" } };
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const userId = payload?.sub;

    if (!userId) {
      return { error: { status: 401, message: "Invalid token payload" } };
    }

    const user = await User.findById(userId);

    if (!user) {
      return { error: { status: 401, message: "User not found for token" } };
    }

    return { user, userId: user._id.toString() };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { error: { status: 401, message: "Token expired" } };
    }

    if (error.name === "JsonWebTokenError") {
      return { error: { status: 401, message: "Invalid authorization token" } };
    }

    return { error: { status: 500, message: "Authentication failed" } };
  }
}

export function issueToken(userId) {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}
