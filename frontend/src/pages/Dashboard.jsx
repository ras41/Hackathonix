import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("polls");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mock data for user's polls
  const userPolls = [
    {
      id: "poll-1",
      title: "Frontend Framework Poll",
      description:
        "Which framework do you prefer for large-scale applications?",
      votes: 4219,
      createdAt: "2026-03-07",
      isActive: true,
    },
    {
      id: "poll-2",
      title: "Remote Work Preferences",
      description: "How often do you prefer working from home?",
      votes: 1842,
      createdAt: "2026-03-05",
      isActive: true,
    },
    {
      id: "poll-3",
      title: "Coffee vs Tea",
      description: "What's your preferred morning beverage?",
      votes: 892,
      createdAt: "2026-03-03",
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Left Sidebar */}
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

      {/* Main Content */}
      <div className="ml-16 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your polls and see real-time insights from your global
              audience
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Polls</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {userPolls.length}
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
                    {userPolls
                      .reduce((sum, poll) => sum + poll.votes, 0)
                      .toLocaleString()}
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
                    {userPolls.filter((poll) => poll.isActive).length}
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

          {/* Polls Section */}
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

            <div className="space-y-4">
              {userPolls.map((poll) => (
                <div
                  key={poll.id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {poll.title}
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
                      <p className="text-gray-600 mb-3">{poll.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{poll.votes.toLocaleString()} votes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Created {poll.createdAt}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate(`/results/${poll.id}`)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => navigate(`/vote/${poll.id}`)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Poll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
