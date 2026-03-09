import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { usePoll } from "../context/PollContext";

const getCurrentLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(null),
      {
        timeout: 8000,
      },
    );
  });

export default function VotePage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { getPoll, submitVote } = usePoll();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loadingPoll, setLoadingPoll] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPoll = async () => {
      setLoadingPoll(true);
      setError("");

      try {
        const pollData = await getPoll(pollId);
        setPoll(pollData);
      } catch (loadError) {
        setError(loadError.message || "Failed to load poll");
      } finally {
        setLoadingPoll(false);
      }
    };

    loadPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || !poll) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const location = await getCurrentLocation();

      if (poll.requireLocation && !location) {
        throw new Error(
          "Location access is required for this poll. Please allow location and try again.",
        );
      }

      await submitVote(
        poll._id,
        selectedOption,
        location?.latitude ?? null,
        location?.longitude ?? null,
      );

      navigate(`/results/${pollId}`);
    } catch (voteError) {
      setError(voteError.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPoll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading poll...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Poll not found
          </h1>
          <p className="text-gray-600 mb-6">
            The poll link is invalid or the poll has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                GeoPulse
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="fixed left-0 top-20 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
        <button className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="ml-16 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>LIVE COMMUNITY POLL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {poll.question}
            </h1>
            {poll.description && (
              <p className="text-lg text-gray-600 mb-3">{poll.description}</p>
            )}
            {!poll.isActive && (
              <p className="text-red-600 font-medium">
                This poll is closed and no longer accepts votes.
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {poll.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                disabled={!poll.isActive}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedOption === option
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } ${!poll.isActive ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl font-semibold text-gray-900">
                    {option}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {poll.isActive && (
            <div className="text-center">
              <button
                onClick={handleVote}
                disabled={!selectedOption || isSubmitting}
                className="bg-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
