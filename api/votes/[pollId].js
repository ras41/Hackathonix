import { connectDB } from "../_lib/db.js";
import Vote from "../_lib/models/vote.js";

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

  const { pollId } = req.query;

  try {
    await connectDB();

    const votes = await Vote.find({ pollId }).sort({ timestamp: 1 });

    return res.json(votes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
