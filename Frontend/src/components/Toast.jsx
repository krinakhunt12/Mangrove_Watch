import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", isVisible, onClose, duration = 8000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80`}>
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">
            {type === "success" ? "Success!" : "Error!"}
          </p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
