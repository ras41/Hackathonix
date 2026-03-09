import { connectDB } from "../../_lib/db.js";
import Poll from "../../_lib/models/poll.js";
import { requireAuth } from "../../_lib/auth.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  await connectDB();

  // GET - Get poll by ID
  if (req.method === "GET") {
    try {
      const poll = await Poll.findById(id);

      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      return res.json(poll);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - Delete poll
  if (req.method === "DELETE") {
    const auth = await requireAuth(req);

    if (auth.error) {
      return res.status(auth.error.status).json({ message: auth.error.message });
    }

    try {
      const poll = await Poll.findById(id);

      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      if (poll.userId !== auth.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await poll.deleteOne();

      return res.json({ message: "Poll deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
