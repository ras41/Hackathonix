import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export function Toast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? "transform translate-x-0 opacity-100" : "transform translate-x-full opacity-0"}`}
    >
      <div
        className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${colors[type]}`}
      >
        <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColors[type]}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return { addToast, ToastContainer };
}
