import { connectDB } from "../_lib/db.js";
import Poll from "../_lib/models/poll.js";
import { requireAuth } from "../_lib/auth.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const auth = await requireAuth(req);

    if (auth.error) {
      return res.status(auth.error.status).json({ message: auth.error.message });
    }

    try {
      await connectDB();

      const {
        question,
        description = "",
        options = [],
        userId,
        durationDays,
        allowMultipleVotes = false,
        requireLocation = true,
        isPublic = true
      } = req.body;

      const trimmedQuestion = question?.trim();
      const normalizedOptions = options
        .filter((option) => typeof option === "string")
        .map((option) => option.trim())
        .filter(Boolean);

      if (!trimmedQuestion) {
        return res.status(400).json({ message: "Question is required" });
      }

      if (normalizedOptions.length < 2) {
        return res.status(400).json({ message: "At least 2 valid options are required" });
      }

      const ownerId = auth.userId || userId;

      if (!ownerId) {
        return res.status(400).json({ message: "User id is required" });
      }

      const parsedDuration = Number(durationDays);
      const safeDuration =
        Number.isFinite(parsedDuration) && parsedDuration >= 1
          ? Math.min(Math.floor(parsedDuration), 30)
          : null;

      const expiresAt = safeDuration
        ? new Date(Date.now() + safeDuration * 24 * 60 * 60 * 1000)
        : null;

      const poll = await Poll.create({
        question: trimmedQuestion,
        description: description?.trim() || "",
        options: normalizedOptions,
        userId: ownerId,
        durationDays: safeDuration,
        allowMultipleVotes: Boolean(allowMultipleVotes),
        requireLocation: Boolean(requireLocation),
        isPublic: Boolean(isPublic),
        expiresAt
      });

      return res.status(201).json(poll);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
