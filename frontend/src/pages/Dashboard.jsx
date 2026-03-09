import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePoll } from "../context/PollContext";
import {
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  Plus,
  BarChart3,
  Users,
  Clock,
  LogOut,
  Trash2,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) {
    return "Unknown";
  }

  return new Date(dateString).toLocaleDateString();
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getUserPolls, getAllVotesForUser, deletePoll, closePoll, reopenPoll } =
    usePoll();

  const [userPolls, setUserPolls] = useState([]);
  const [voteCountByPollId, setVoteCountByPollId] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionPollId, setActionPollId] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [polls, votes] = await Promise.all([
          getUserPolls(user.id),
          getAllVotesForUser(user.id),
        ]);

        const counts = votes.reduce((accumulator, vote) => {
          const pollId = vote.pollId?.toString();
          accumulator[pollId] = (accumulator[pollId] || 0) + 1;
          return accumulator;
        }, {});

        setUserPolls(polls);
        setVoteCountByPollId(counts);
      } catch (loadError) {
        setError(loadError.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const stats = useMemo(() => {
    const totalVotes = Object.values(voteCountByPollId).reduce(
      (sum, count) => sum + count,
      0,
    );
    const activePolls = userPolls.filter((poll) => poll.isActive).length;

    return {
      totalPolls: userPolls.length,
      totalVotes,
      activePolls,
    };
  }, [userPolls, voteCountByPollId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeletePoll = async (pollId) => {
    const shouldDelete = window.confirm(
      "Delete this poll permanently? This cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    setActionPollId(pollId);
    try {
      await deletePoll(pollId);
      setUserPolls((prev) => prev.filter((poll) => poll._id !== pollId));
      setVoteCountByPollId((prev) => {
        const next = { ...prev };
        delete next[pollId];
        return next;
      });
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete poll");
    } finally {
      setActionPollId("");
    }
  };

  const handleTogglePoll = async (poll) => {
    setActionPollId(poll._id);

    try {
      const response = poll.isActive
        ? await closePoll(poll._id)
        : await reopenPoll(poll._id);
      const updatedPoll = response?.poll;

      if (updatedPoll) {
        setUserPolls((prev) =>
          prev.map((item) => (item._id === poll._id ? updatedPoll : item)),
        );
      }
    } catch (toggleError) {
      setError(toggleError.message || "Failed to update poll status");
    } finally {
      setActionPollId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
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
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
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

      <div className="ml-16 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-600">
              Manage your polls and watch live community voting activity.
            </p>
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
                  <p className="text-gray-500 text-sm">Total Polls</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalPolls}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalVotes.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Polls</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activePolls}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <button
                onClick={() => navigate("/create")}
                className="w-full h-full flex flex-col items-center justify-center space-y-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span className="font-semibold">Create Poll</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Polls</h2>
              <button
                onClick={() => navigate("/create")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Poll</span>
              </button>
            </div>

            {userPolls.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-600 mb-3">No polls created yet.</p>
                <button
                  onClick={() => navigate("/create")}
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Create your first poll
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userPolls.map((poll) => {
                  const votes = voteCountByPollId[poll._id] || 0;
                  const isBusy = actionPollId === poll._id;

                  return (
                    <div
                      key={poll._id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {poll.question}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                poll.isActive
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {poll.isActive ? "Active" : "Closed"}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {poll.description || "No description provided."}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{votes.toLocaleString()} votes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Created {formatDate(poll.createdAt)}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/results/${poll._id}`)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Results
                          </button>
                          <button
                            onClick={() => navigate(`/vote/${poll._id}`)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Open Poll
                          </button>
                          <button
                            onClick={() => handleTogglePoll(poll)}
                            disabled={isBusy}
                            className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                            title={poll.isActive ? "Close poll" : "Reopen poll"}
                          >
                            {poll.isActive ? (
                              <PauseCircle className="w-5 h-5" />
                            ) : (
                              <PlayCircle className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeletePoll(poll._id)}
                            disabled={isBusy}
                            className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
                            title="Delete poll"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
