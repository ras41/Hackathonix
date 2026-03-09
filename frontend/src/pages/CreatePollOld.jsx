import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Bell, User } from "lucide-react";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeployPoll = () => {
    // Simulate poll creation and redirect to vote page
    const pollId = Math.random().toString(36).substr(2, 8).toUpperCase();
    navigate(`/vote/${pollId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  GeoPulse
                </span>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 font-medium"
                >
                  Explore
                </a>
                <a
                  href="#"
                  className="text-purple-600 border-b-2 border-purple-600 pb-1 font-medium"
                >
                  Create Poll
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-600 font-medium"
                >
                  Analytics
                </a>
              </nav>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            ✨ <span>NEW COMMUNITY QUEST</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create your Poll
          </h1>
          <p className="text-xl text-gray-600">
            Gather pulses from your local area in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {/* The Big Question */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                The Big Question
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-4">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    💬
                  </div>
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Where's the best secret coffee spot in downtown?"
                  className="w-full pl-14 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20"
                />
              </div>
            </div>

            {/* Pulse Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pulse Options
              </h3>
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={
                        index === 0
                          ? "The Grumpy Bean"
                          : index === 1
                            ? "Artisan Brews"
                            : `Option ${index + 1}`
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="flex items-center space-x-2 p-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors w-full justify-center text-purple-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Another Option</span>
                  </button>
                )}
              </div>
            </div>

            {/* Deploy Button */}
            <button
              onClick={handleDeployPoll}
              className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-all"
            >
              Deploy Pulse 🚀
            </button>
          </div>

          {/* Right Side - Preview */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Live in the Wild Card */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-bold mb-2">Live in the Wild!</h2>
                <p className="text-purple-100 mb-6">
                  Your poll is now gathering local pulses
                </p>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <p className="text-sm opacity-80 mb-3">geopulse.io/poll/B2</p>
                  <div className="flex justify-center space-x-2">
                    <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                      &lt; Follow
                    </button>
                    <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                      &gt; WhatsApp
                    </button>
                  </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="mx-auto mb-4">
                  <div className="w-24 h-24 bg-white rounded-xl p-3">
                    <div className="w-full h-full bg-black rounded-lg grid grid-cols-8 gap-1 p-1">
                      {Array.from({ length: 64 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-purple-100">SCAN TO VOTE</p>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pro Tip
                </h3>
                <p className="text-gray-600">
                  Polls with at least 3 options tend to get 40% more engagement.
                  Try adding specific local landmarks to spark better debates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                GeoPulse
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 GeoPulse. Made for curious locals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
