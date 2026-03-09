import { requireAuth } from "../_lib/auth.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = await requireAuth(req);

  if (auth.error) {
    return res.status(auth.error.status).json({ message: auth.error.message });
  }

  return res.json({ user: auth.user.toSafeObject() });
}
