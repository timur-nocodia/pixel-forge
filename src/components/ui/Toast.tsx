import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'info':
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border backdrop-blur-sm";
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-900/20 border-green-400/30`;
      case 'error':
        return `${baseStyles} bg-red-900/20 border-red-400/30`;
      case 'warning':
        return `${baseStyles} bg-yellow-900/20 border-yellow-400/30`;
      case 'info':
        return `${baseStyles} bg-blue-900/20 border-blue-400/30`;
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 left-4 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 ease-out
        ${getStyles()}
        ${isVisible && !isExiting 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform -translate-y-2 scale-95'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm leading-tight">
            {title}
          </h4>
          {message && (
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={14} className="text-white/60" />
        </button>
      </div>
    </div>
  );
};

export default Toast;