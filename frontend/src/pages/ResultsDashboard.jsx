import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  TrendingUp,
  Share2,
  Download,
  ArrowLeft,
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";

export default function ResultsDashboard() {
  const { pollId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Left Sidebar */}
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

      {/* Main Content */}
      <div className="ml-16 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Polls
              </button>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Frontend Framework Poll Results
                </h1>
                <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium">
                  Live
                </span>
              </div>
              <p className="text-gray-600">
                Real-time results from 4,219 developers worldwide
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Votes</p>
                  <p className="text-3xl font-bold text-gray-900">4,219</p>
                  <p className="text-green-600 text-sm">+12% today</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Countries</p>
                  <p className="text-3xl font-bold text-gray-900">67</p>
                  <p className="text-green-600 text-sm">Global reach</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Engagement</p>
                  <p className="text-3xl font-bold text-gray-900">89%</p>
                  <p className="text-green-600 text-sm">High activity</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Time Left</p>
                  <p className="text-3xl font-bold text-gray-900">2d</p>
                  <p className="text-orange-600 text-sm">Poll closing soon</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 font-bold">⏰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vote Distribution */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Vote Distribution
              </h3>
              <div className="space-y-4">
                {/* React */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          ⚛
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">React</span>
                    </div>
                    <span className="font-bold text-gray-900">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: "42%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">1,772 votes</p>
                </div>

                {/* Vue */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">
                          V
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">Vue</span>
                    </div>
                    <span className="font-bold text-gray-900">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">1,181 votes</p>
                </div>

                {/* Angular */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">
                          A
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">Angular</span>
                    </div>
                    <span className="font-bold text-gray-900">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">844 votes</p>
                </div>

                {/* Svelte */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">
                          ⚡
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">Svelte</span>
                    </div>
                    <span className="font-bold text-gray-900">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">422 votes</p>
                </div>
              </div>
            </div>

            {/* Geographic Map */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Geographic Distribution
              </h3>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">
                    Interactive World Map
                  </p>
                  <p className="text-gray-500 text-sm">
                    Votes distributed across 67 countries
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🇺🇸 United States</span>
                      <span className="font-medium">1,267 votes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🇮🇳 India</span>
                      <span className="font-medium">892 votes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🇩🇪 Germany</span>
                      <span className="font-medium">634 votes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">🇬🇧 United Kingdom</span>
                      <span className="font-medium">521 votes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="mt-8 bg-white p-8 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Real-time Activity
              </h3>
              <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Anonymous User</p>
                    <p className="text-sm text-gray-500">
                      Voted for React • San Francisco, CA
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">2 minutes ago</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Anonymous User</p>
                    <p className="text-sm text-gray-500">
                      Voted for Vue • Mumbai, India
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">3 minutes ago</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Anonymous User</p>
                    <p className="text-sm text-gray-500">
                      Voted for Svelte • Berlin, Germany
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
