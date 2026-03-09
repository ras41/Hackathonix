import Vote from "../models/vote.js";
import Poll from "../models/poll.js";

const isDbUnavailable = (error) =>
  error?.name === "MongooseServerSelectionError" ||
  error?.message?.includes("buffering timed out");

export const addVote = async (req, res) => {
  try {
    const { pollId, option, latitude, longitude } = req.body;
    const normalizedOption = option?.trim();

    if (!pollId || !normalizedOption) {
      return res.status(400).json({ message: "Poll id and option are required" });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: "Poll closed" });
    }

    if (!poll.options.includes(normalizedOption)) {
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
      option: normalizedOption,
      latitude: hasCoordinates ? parsedLatitude : null,
      longitude: hasCoordinates ? parsedLongitude : null
    });

    req.io.emit(`vote-${pollId}`, vote);

    res.status(201).json(vote);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ pollId: req.params.pollId }).sort({
      timestamp: 1
    });

    res.json(votes);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};

export const getAllVotesForUser = async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const polls = await Poll.find({ userId: req.params.userId });
    const pollIds = polls.map((poll) => poll._id);

    const votes = await Vote.find({ pollId: { $in: pollIds } });

    res.json(votes);
  } catch (error) {
    if (isDbUnavailable(error)) {
      return res.status(503).json({ message: "Database unavailable" });
    }

    res.status(500).json({ error: error.message });
  }
};
