import { useState, useCallback } from 'react';
import { ToastProps } from '../components/ui/Toast';

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: (toastId: string) => removeToast(toastId),
    };

    setToasts(prev => [newToast, ...prev.slice(0, 2)]); // Keep max 3 toasts
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  };
};