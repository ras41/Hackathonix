import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";

export default function VotePage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");

  const handleVote = () => {
    if (selectedOption) {
      navigate(`/results/${pollId}`);
    }
  };

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
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
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
      <div className="ml-16 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Poll Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
              📊 <span>LIVE COMMUNITY POLL</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-8">
              Which frontend framework do you prefer for large-scale
              applications?
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Select an option below to contribute to the global GeoPulse pulse.
            </p>
            <p className="text-gray-500">
              Poll closing in 2 days. 4,219 developers have voted so far.
            </p>
          </div>

          {/* Voting Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* React */}
            <button
              onClick={() => setSelectedOption("React")}
              className={`group relative p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                selectedOption === "React"
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">⚛</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">React</h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 absolute top-6 right-6 ${
                    selectedOption === "React"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === "React" && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            </button>

            {/* Vue */}
            <button
              onClick={() => setSelectedOption("Vue")}
              className={`group relative p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                selectedOption === "Vue"
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">V</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vue</h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 absolute top-6 right-6 ${
                    selectedOption === "Vue"
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === "Vue" && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            </button>

            {/* Angular */}
            <button
              onClick={() => setSelectedOption("Angular")}
              className={`group relative p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                selectedOption === "Angular"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Angular
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 absolute top-6 right-6 ${
                    selectedOption === "Angular"
                      ? "border-red-500 bg-red-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === "Angular" && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            </button>

            {/* Svelte */}
            <button
              onClick={() => setSelectedOption("Svelte")}
              className={`group relative p-8 rounded-3xl border-2 transition-all hover:scale-105 ${
                selectedOption === "Svelte"
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">⚡</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Svelte
                </h3>
                <div
                  className={`w-6 h-6 rounded-full border-2 absolute top-6 right-6 ${
                    selectedOption === "Svelte"
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === "Svelte" && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Submit Button */}
          {selectedOption && (
            <div className="text-center">
              <button
                onClick={handleVote}
                className="bg-purple-600 text-white px-12 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-all"
              >
                Submit Vote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
