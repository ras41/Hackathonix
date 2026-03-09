import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../utils/api";

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
  const { token } = useAuth();

  const requireToken = () => {
    if (!token) {
      throw new Error("Please log in to continue");
    }
    return token;
  };

  // Create new poll
  const createPoll = async (pollData) => {
    try {
      const newPoll = await apiRequest("/api/polls", {
        method: "POST",
        token: requireToken(),
        body: pollData,
      });
      setPolls((prev) => [newPoll, ...prev]);
      return newPoll;
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  };

  // Get poll by ID
  const getPoll = async (pollId) => {
    try {
      return await apiRequest(`/api/polls/${pollId}`);
    } catch (error) {
      console.error("Error fetching poll:", error);
      throw error;
    }
  };

  // Get all polls for a user
  const getUserPolls = async (userId) => {
    try {
      const userPolls = await apiRequest(`/api/polls/user/${userId}`, {
        token: requireToken(),
      });
      setPolls(userPolls);
      return userPolls;
    } catch (error) {
      console.error("Error fetching user polls:", error);
      throw error;
    }
  };

  // Submit vote
  const submitVote = async (pollId, option, latitude = null, longitude = null) => {
    try {
      const vote = await apiRequest("/api/votes", {
        method: "POST",
        body: { pollId, option, latitude, longitude },
      });
      return vote;
    } catch (error) {
      console.error("Error submitting vote:", error);
      throw error;
    }
  };

  // Get votes for a poll
  const getVotes = async (pollId) => {
    try {
      return await apiRequest(`/api/votes/${pollId}`);
    } catch (error) {
      console.error("Error fetching votes:", error);
      throw error;
    }
  };

  // Get vote results
  const getResults = async (pollId) => {
    try {
      const poll = await getPoll(pollId);
      const votes = await getVotes(pollId);

      const voteCounts = {};
      votes.forEach((vote) => {
        voteCounts[vote.option] = (voteCounts[vote.option] || 0) + 1;
      });

      const results = poll.options.map((option) => ({
        id: option.toString(),
        option,
        votes: voteCounts[option] || 0,
        percentage:
          votes.length > 0
            ? Math.round(((voteCounts[option] || 0) / votes.length) * 100)
            : 0,
        locations: votes
          .filter(
            (vote) =>
              vote.option === option &&
              Number.isFinite(vote.latitude) &&
              Number.isFinite(vote.longitude),
          )
          .map((vote) => ({ lat: vote.latitude, lng: vote.longitude })),
      }));

      return {
        poll,
        results,
        totalVotes: votes.length,
        votes,
      };
    } catch (error) {
      console.error("Error getting results:", error);
      throw error;
    }
  };

  const getAllVotesForUser = async (userId) => {
    try {
      return await apiRequest(`/api/votes/user/${userId}`, {
        token: requireToken(),
      });
    } catch (error) {
      console.error("Error fetching user votes:", error);
      throw error;
    }
  };

  const deletePoll = async (pollId) => {
    try {
      await apiRequest(`/api/polls/${pollId}`, {
        method: "DELETE",
        token: requireToken(),
      });
      setPolls((prev) => prev.filter((poll) => poll._id !== pollId));
    } catch (error) {
      console.error("Error deleting poll:", error);
      throw error;
    }
  };

  // Close poll
  const closePoll = async (pollId) => {
    try {
      const response = await apiRequest(`/api/polls/${pollId}/close`, {
        method: "PATCH",
        token: requireToken(),
      });
      if (response?.poll) {
        setPolls((prev) =>
          prev.map((poll) => (poll._id === pollId ? response.poll : poll)),
        );
      }
      return response;
    } catch (error) {
      console.error("Error closing poll:", error);
      throw error;
    }
  };

  // Reopen poll
  const reopenPoll = async (pollId) => {
    try {
      const response = await apiRequest(`/api/polls/${pollId}/reopen`, {
        method: "PATCH",
        token: requireToken(),
      });
      if (response?.poll) {
        setPolls((prev) =>
          prev.map((poll) => (poll._id === pollId ? response.poll : poll)),
        );
      }
      return response;
    } catch (error) {
      console.error("Error reopening poll:", error);
      throw error;
    }
  };

  const value = {
    polls,
    createPoll,
    getPoll,
    getUserPolls,
    submitVote,
    getVotes,
    getResults,
    getAllVotesForUser,
    deletePoll,
    closePoll,
    reopenPoll,
  };

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
}
