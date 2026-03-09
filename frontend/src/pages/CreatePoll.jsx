import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePoll } from "../context/PollContext";
import { useToast } from "../components/ui/Toast";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import {
  Bell,
  User,
  Home,
  MessageSquare,
  Settings,
  Sparkles,
  Plus,
  Copy,
  Trash2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { QRCodeSVG as QRCodeReact } from "qrcode.react";

export default function CreatePoll() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPoll } = usePoll();
  const { addToast, ToastContainer } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", ""],
    duration: 7, // days
    allowMultipleVotes: false,
    requireLocation: true,
    isPublic: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPoll, setCreatedPoll] = useState(null);

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Poll title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Poll description is required";
    }
    
    const validOptions = formData.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required";
    }
    
    if (formData.duration < 1 || formData.duration > 30) {
      newErrors.duration = "Duration must be between 1 and 30 days";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const pollData = {
        question: formData.title.trim(),
        description: formData.description.trim(),
        options: formData.options.filter(opt => opt.trim()),
        userId: user.id,
        durationDays: formData.duration,
        allowMultipleVotes: formData.allowMultipleVotes,
        requireLocation: formData.requireLocation,
        isPublic: formData.isPublic,
      };
      
      const newPoll = await createPoll(pollData);
      setCreatedPoll(newPoll);
      setShowSuccessModal(true);
      addToast("Poll created successfully!", "success");
      
    } catch (error) {
      addToast(error.message || "Failed to create poll", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPollUrl = () => {
    const url = `${window.location.origin}/vote/${createdPoll?._id}`;
    navigator.clipboard.writeText(url);
    addToast("Poll URL copied to clipboard!", "success");
  };

  const pollUrl = createdPoll ? `${window.location.origin}/vote/${createdPoll._id}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">GeoPulse</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <div className="fixed left-0 top-20 h-full w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-6">
        <button 
          onClick={() => navigate('/dashboard')}
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Plus className="w-4 h-4" />
              <span>CREATE NEW POLL</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your GeoPulse Poll
            </h1>
            <p className="text-xl text-gray-600">
              Engage your community and visualize opinions across the globe
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <Input
                  label="Poll Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your question?"
                  error={errors.title}
                  className="text-lg font-medium"
                />

                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more context about your poll..."
                  rows={3}
                  error={errors.description}
                />
              </div>

              {/* Options */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Poll Options</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={formData.options.length >= 6}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
                
                {errors.options && (
                  <p className="text-sm text-red-600">{errors.options}</p>
                )}
                
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                      {formData.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Poll Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Duration (days)"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                    error={errors.duration}
                    icon={Clock}
                  />
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Public Poll</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.requireLocation}
                        onChange={(e) => setFormData(prev => ({ ...prev, requireLocation: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Require Location</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.allowMultipleVotes}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowMultipleVotes: e.target.checked }))}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow Multiple Votes</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Creating...' : 'Create Poll'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Poll Created Successfully! 🎉"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {createdPoll?.question}
            </h3>
            <p className="text-gray-600 mb-6">
              Your poll is now live and ready for votes!
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              {createdPoll && (
                <QRCodeReact 
                  value={pollUrl}
                  size={200}
                  level="M"
                />
              )}
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">Poll URL:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-sm bg-white p-2 rounded border">
                  {pollUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPollUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate(`/results/${createdPoll?._id}`)}
                variant="outline"
                className="flex-1"
              >
                View Results
              </Button>
              <Button
                onClick={() => navigate(`/vote/${createdPoll?._id}`)}
                className="flex-1"
              >
                Test Vote
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
