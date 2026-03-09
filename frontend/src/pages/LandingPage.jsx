import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPin, BarChart3, Zap } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="flex justify-between items-center p-6 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">GeoPulse</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Polls
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Pricing
          </a>
        </div>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 text-sm">
                Welcome, {user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 font-medium"
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-purple-600 px-4 py-2 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
              Visualize
              <br />
              <span className="text-purple-600">Opinions</span>
              <br />
              Across the Map
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Engage with your community and see real-time insights through
              interactive geographic polling. The world is your canvas.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/create" : "/register")
                }
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-all"
              >
                {isAuthenticated ? "Create Poll" : "Get Started"}
              </button>
              <button
                onClick={() => navigate("/vote/poll-1")}
                className="text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all"
              >
                Try Demo
              </button>
            </div>
          </div>

          {/* Right Globe Visualization */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full relative overflow-hidden">
                {/* World map representation */}
                <div className="absolute inset-0 p-8">
                  {/* North America */}
                  <div className="absolute top-16 left-16 w-20 h-16 bg-orange-300 rounded-2xl opacity-90"></div>
                  {/* Europe */}
                  <div className="absolute top-12 right-20 w-16 h-12 bg-orange-300 rounded-xl opacity-90"></div>
                  {/* South America */}
                  <div className="absolute bottom-20 left-20 w-12 h-20 bg-orange-300 rounded-2xl opacity-90"></div>
                  {/* Asia */}
                  <div className="absolute top-20 right-12 w-24 h-16 bg-orange-300 rounded-2xl opacity-90"></div>
                  {/* Africa */}
                  <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-14 h-20 bg-orange-300 rounded-xl opacity-90"></div>
                  {/* Australia */}
                  <div className="absolute bottom-16 right-16 w-12 h-8 bg-orange-300 rounded-lg opacity-90"></div>
                </div>

                {/* Location indicator */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>New York, London...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Geographic Insights
            </h2>
            <p className="text-xl text-gray-600">
              Discover how GeoPulse transforms data into visual stories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MapPin className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Geo-aware voting
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cast your vote and see how your location influences the
                conversation in real-time.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BarChart3 className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Live map results
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Watch results bloom across the globe with our dynamic and
                responsive map visualization.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BarChart3 className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-time analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Deep dive into demographic data and spatial trends as they
                happen with advanced tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to start polling?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users mapping out opinions and uncovering
              insights today.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all inline-block"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-8 px-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="text-xl font-semibold text-white">GeoPulse</span>
        </div>
        <div className="flex justify-center space-x-6 mb-4 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
        <p className="text-gray-400 text-sm">
          © 2024 GeoPulse Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
