import React from 'react';
import Toast, { ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: ToastProps[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="relative">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 80}px)`,
              zIndex: 1000 - index,
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;