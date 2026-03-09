import Poll from "../models/poll.js";

const isDbUnavailable = (error) =>
  error?.name === "MongooseServerSelectionError" ||
  error?.message?.includes("buffering timed out");

export const listPolls = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = { isPublic: true };

    if (active === "true" || active === "false") {
      filter.isActive = active === "true";
    }

    const polls = await Poll.find(filter).sort({ createdAt: -1 }).limit(100);

    res.json(polls);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const createPoll = async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ message: "At least 2 valid options are required" });
    }

    const ownerId = req.userId || userId;

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

    res.status(201).json(poll);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json(poll);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getUserPolls = async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const polls = await Poll.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    res.json(polls);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    poll.isActive = false;
    poll.closedAt = new Date();

    await poll.save();

    res.json({ message: "Poll closed", poll });
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const reopenPoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    poll.isActive = true;
    poll.closedAt = null;

    await poll.save();

    res.json({ message: "Poll reopened", poll });
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await poll.deleteOne();

    res.json({ message: "Poll deleted" });
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};
