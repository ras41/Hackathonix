import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  TrendingUp,
  ArrowLeft,
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  PauseCircle,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { usePoll } from "../context/PollContext";
import { useAuth } from "../context/AuthContext";

const formatVoteTime = (timestamp) =>
  new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const formatCoordinate = (value) =>
  typeof value === "number" ? value.toFixed(4) : "N/A";

export default function ResultsDashboard() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { getResults, closePoll, reopenPoll } = usePoll();
  const { user, isAuthenticated } = useAuth();

  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [togglingStatus, setTogglingStatus] = useState(false);

  const loadResults = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getResults(pollId);
      setResultsData(data);
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Failed to load results");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResults();

    const pollInterval = window.setInterval(() => {
      loadResults(true);
    }, 10000);

    return () => window.clearInterval(pollInterval);
  }, [pollId]);

  const poll = resultsData?.poll;
  const voteResults = resultsData?.results || [];
  const votes = resultsData?.votes || [];
  const totalVotes = resultsData?.totalVotes || 0;

  const locationStats = useMemo(() => {
    const uniqueLocationPairs = new Set(
      votes
        .filter(
          (vote) =>
            Number.isFinite(vote.latitude) && Number.isFinite(vote.longitude),
        )
        .map((vote) => `${vote.latitude.toFixed(3)},${vote.longitude.toFixed(3)}`),
    );
    return uniqueLocationPairs.size;
  }, [votes]);

  const leadingOption = useMemo(() => {
    if (!voteResults.length) {
      return null;
    }

    return [...voteResults].sort((a, b) => b.votes - a.votes)[0];
  }, [voteResults]);

  const recentVotes = useMemo(() => {
    return [...votes]
      .sort(
        (first, second) =>
          new Date(second.timestamp).getTime() -
          new Date(first.timestamp).getTime(),
      )
      .slice(0, 8);
  }, [votes]);

  const isOwner = isAuthenticated && poll?.userId === user?.id;

  const handleTogglePollStatus = async () => {
    if (!poll || !isOwner) {
      return;
    }

    setTogglingStatus(true);

    try {
      if (poll.isActive) {
        await closePoll(poll._id);
      } else {
        await reopenPoll(poll._id);
      }
      await loadResults(true);
    } catch (toggleError) {
      setError(toggleError.message || "Failed to update poll status");
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Results unavailable
          </h1>
          <p className="text-gray-600 mb-6">
            This poll does not exist or its results cannot be loaded.
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
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">G</span>
              </button>
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
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center"
        >
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

      <div className="ml-16 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {poll.question}
                </h1>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    poll.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {poll.isActive ? "Live" : "Closed"}
                </span>
              </div>
              {poll.description && (
                <p className="text-gray-600 max-w-3xl">{poll.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadResults(true)}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              {isOwner && (
                <button
                  onClick={handleTogglePollStatus}
                  disabled={togglingStatus}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
                >
                  {poll.isActive ? (
                    <PauseCircle className="w-4 h-4" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                  <span>{poll.isActive ? "Close Poll" : "Reopen Poll"}</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalVotes.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Leading Option</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {leadingOption?.option || "-"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Tracked Locations</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {locationStats}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Poll Id</p>
                  <p className="text-2xl font-bold text-gray-900">{poll._id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Vote Distribution
              </h3>
              {voteResults.length === 0 ? (
                <p className="text-gray-600">No options available.</p>
              ) : (
                <div className="space-y-4">
                  {voteResults.map((result) => (
                    <div key={result.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {result.option}
                        </span>
                        <span className="font-bold text-gray-900">
                          {result.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-500 h-3 rounded-full"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {result.votes} votes
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Vote Activity
              </h3>
              {recentVotes.length === 0 ? (
                <p className="text-gray-600">No votes submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentVotes.map((vote) => (
                    <div
                      key={vote._id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <p className="text-gray-900 font-medium mb-1">
                        Option: {vote.option}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Coordinates: {formatCoordinate(vote.latitude)},{" "}
                        {formatCoordinate(vote.longitude)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatVoteTime(vote.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
