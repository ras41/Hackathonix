import { connectDB } from "../_lib/db.js";
import Vote from "../_lib/models/vote.js";
import Poll from "../_lib/models/poll.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      await connectDB();

      const { pollId, option, latitude, longitude } = req.body;

      if (!pollId || !option?.trim()) {
        return res.status(400).json({ message: "Poll id and option are required" });
      }

      const poll = await Poll.findById(pollId);

      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }

      if (!poll.isActive) {
        return res.status(400).json({ message: "Poll closed" });
      }

      if (!poll.options.includes(option)) {
        return res.status(400).json({ message: "Invalid option selected" });
      }

      const parsedLatitude = Number(latitude);
      const parsedLongitude = Number(longitude);
      const hasCoordinates =
        Number.isFinite(parsedLatitude) && Number.isFinite(parsedLongitude);

      if (poll.requireLocation && !hasCoordinates) {
        return res.status(400).json({ message: "Location is required for this poll" });
      }

      const vote = await Vote.create({
        pollId,
        option,
        latitude: hasCoordinates ? parsedLatitude : null,
        longitude: hasCoordinates ? parsedLongitude : null
      });

      return res.status(201).json(vote);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
