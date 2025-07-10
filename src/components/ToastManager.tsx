import React, { useState, useEffect } from 'react';
import ToastNotification from './ToastNotification';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'loading' | 'info';
  duration?: number;
}

interface ToastManagerProps {
  status: string;
}

const ToastManager: React.FC<ToastManagerProps> = ({ status }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastStatus, setLastStatus] = useState<string>('');

  useEffect(() => {
    // Only create new toast if status actually changed
    if (status !== lastStatus && status.trim() !== '') {
      const toastType = getToastType(status);
      const newToast: Toast = {
        id: Date.now().toString(),
        message: status,
        type: toastType,
        duration: toastType === 'loading' ? 0 : 5000 // Loading toasts don't auto-dismiss
      };

      // Remove any existing loading toasts if this is a completion status
      if (toastType === 'success' || toastType === 'error') {
        setToasts(prev => prev.filter(toast => toast.type !== 'loading'));
      }

      // Add new toast
      setToasts(prev => [...prev, newToast]);
      setLastStatus(status);
    }
  }, [status, lastStatus]);

  const getToastType = (message: string): 'success' | 'error' | 'loading' | 'info' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('error') || lowerMessage.includes('failed')) {
      return 'error';
    } else if (lowerMessage.includes('successful') || lowerMessage.includes('success') || 
               lowerMessage.includes('downloaded') || lowerMessage.includes('complete')) {
      return 'success';
    } else if (lowerMessage.includes('generating') || lowerMessage.includes('validating') || 
               lowerMessage.includes('testing') || lowerMessage.includes('processing')) {
      return 'loading';
    } else {
      return 'info';
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div style={{
      position: 'fixed' as const,
      top: 0,
      right: 0,
      zIndex: 1000,
      pointerEvents: 'none' as const
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            marginBottom: '12px',
            transform: `translateY(${index * 8}px)`,
            pointerEvents: 'auto' as const
          }}
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastManager;
