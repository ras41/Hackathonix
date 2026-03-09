import Vote from "../models/vote.js";
import Poll from "../models/poll.js";

export const addVote = async (req, res) => {

  const { pollId, option, latitude, longitude } = req.body;

  const poll = await Poll.findById(pollId);

  if (!poll || !poll.isActive)
    return res.status(400).json({ message: "Poll closed" });

  const vote = await Vote.create({
    pollId,
    option,
    latitude,
    longitude
  });

  req.io.emit(`vote-${pollId}`, vote);

  res.json(vote);
};

export const getVotes = async (req, res) => {

  const votes = await Vote.find({ pollId: req.params.pollId })
    .sort({ timestamp: 1 });

  res.json(votes);
};

export const getAllVotesForUser = async (req, res) => {

  const polls = await Poll.find({ userId: req.params.userId });

  const pollIds = polls.map(p => p._id);

  const votes = await Vote.find({ pollId: { $in: pollIds } });

  res.json(votes);
};