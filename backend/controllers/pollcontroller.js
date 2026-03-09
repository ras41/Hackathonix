import Poll from "../models/poll.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options, userId } = req.body;

    const poll = await Poll.create({
      question,
      options,
      userId
    });

    res.json(poll);

  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};

export const getUserPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(polls);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const closePoll = async (req, res) => {
  try {

    await Poll.findByIdAndUpdate(req.params.id, {
      isActive: false,
      closedAt: new Date()
    });

    res.json({ message: "Poll closed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reopenPoll = async (req, res) => {
  try {

    await Poll.findByIdAndUpdate(req.params.id, {
      isActive: true,
      closedAt: null
    });

    res.json({ message: "Poll reopened" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePoll = async (req, res) => {
  try {

    await Poll.findByIdAndDelete(req.params.id);

    res.json({ message: "Poll deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};