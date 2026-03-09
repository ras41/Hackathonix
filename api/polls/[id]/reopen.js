import { connectDB } from "../../_lib/db.js";
import Poll from "../../_lib/models/poll.js";
import { requireAuth } from "../../_lib/auth.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = await requireAuth(req);

  if (auth.error) {
    return res.status(auth.error.status).json({ message: auth.error.message });
  }

  const { id } = req.query;

  try {
    await connectDB();

    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.userId !== auth.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    poll.isActive = true;
    poll.closedAt = null;

    await poll.save();

    return res.json({ message: "Poll reopened", poll });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
