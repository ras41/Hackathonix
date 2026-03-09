import { createContext, useContext, useState } from "react";

const PollContext = createContext();

export function usePoll() {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
}

export function PollProvider({ children }) {
  const [polls, setPolls] = useState([]);

  // Create new poll
  const createPoll = (pollData) => {
    const newPoll = {
      id: `poll-${Date.now()}`,
      ...pollData,
      createdAt: new Date().toISOString(),
      votes: {},
      totalVotes: 0,
      isActive: true,
      qrCode: null, // Will be generated
    };

    // Save to localStorage
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    const updatedPolls = [...existingPolls, newPoll];
    localStorage.setItem("geopulse_polls", JSON.stringify(updatedPolls));

    setPolls(updatedPolls);
    return newPoll;
  };

  // Get poll by ID
  const getPoll = (pollId) => {
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    return existingPolls.find((poll) => poll.id === pollId);
  };

  // Get all polls for a user
  const getUserPolls = (userId) => {
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    return existingPolls.filter((poll) => poll.createdBy === userId);
  };

  // Submit vote
  const submitVote = (pollId, optionId, location = null) => {
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    const pollIndex = existingPolls.findIndex((poll) => poll.id === pollId);

    if (pollIndex === -1) {
      throw new Error("Poll not found");
    }

    const poll = existingPolls[pollIndex];

    // Check if already voted (simple check by IP or session)
    const sessionKey = `voted_${pollId}`;
    if (localStorage.getItem(sessionKey)) {
      throw new Error("You have already voted in this poll");
    }

    // Add vote
    const voteId = `vote-${Date.now()}`;
    const newVote = {
      id: voteId,
      optionId,
      location,
      timestamp: new Date().toISOString(),
    };

    if (!poll.votes[optionId]) {
      poll.votes[optionId] = [];
    }
    poll.votes[optionId].push(newVote);
    poll.totalVotes += 1;

    // Save updated polls
    existingPolls[pollIndex] = poll;
    localStorage.setItem("geopulse_polls", JSON.stringify(existingPolls));

    // Mark as voted
    localStorage.setItem(sessionKey, "true");

    setPolls(existingPolls);
    return poll;
  };

  // Get vote results
  const getResults = (pollId) => {
    const poll = getPoll(pollId);
    if (!poll) return null;

    const results = poll.options.map((option) => ({
      id: option.id,
      text: option.text,
      votes: poll.votes[option.id]?.length || 0,
      percentage:
        poll.totalVotes > 0
          ? Math.round(
              ((poll.votes[option.id]?.length || 0) / poll.totalVotes) * 100,
            )
          : 0,
      locations:
        poll.votes[option.id]?.map((vote) => vote.location).filter(Boolean) ||
        [],
    }));

    return {
      poll,
      results,
      totalVotes: poll.totalVotes,
    };
  };

  // Delete poll
  const deletePoll = (pollId, userId) => {
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    const updatedPolls = existingPolls.filter(
      (poll) => poll.id !== pollId || poll.createdBy === userId,
    );
    localStorage.setItem("geopulse_polls", JSON.stringify(updatedPolls));
    setPolls(updatedPolls);
  };

  // Update poll
  const updatePoll = (pollId, updates, userId) => {
    const existingPolls = JSON.parse(
      localStorage.getItem("geopulse_polls") || "[]",
    );
    const pollIndex = existingPolls.findIndex(
      (poll) => poll.id === pollId && poll.createdBy === userId,
    );

    if (pollIndex === -1) {
      throw new Error("Poll not found or unauthorized");
    }

    existingPolls[pollIndex] = { ...existingPolls[pollIndex], ...updates };
    localStorage.setItem("geopulse_polls", JSON.stringify(existingPolls));
    setPolls(existingPolls);

    return existingPolls[pollIndex];
  };

  const value = {
    polls,
    createPoll,
    getPoll,
    getUserPolls,
    submitVote,
    getResults,
    deletePoll,
    updatePoll,
  };

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
}
