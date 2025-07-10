import React, { useState, useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'loading' | 'info';
  duration?: number;
  onClose?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderColor: '#10b981',
          textColor: '#ffffff',
          shadowColor: 'rgba(16, 185, 129, 0.4)'
        };
      case 'error':
        return {
          icon: '🚨',
          bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderColor: '#ef4444',
          textColor: '#ffffff',
          shadowColor: 'rgba(239, 68, 68, 0.4)'
        };
      case 'loading':
        return {
          icon: '⚡',
          bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderColor: '#8b5cf6',
          textColor: '#ffffff',
          shadowColor: 'rgba(139, 92, 246, 0.4)'
        };
      default:
        return {
          icon: '💡',
          bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderColor: '#3b82f6',
          textColor: '#ffffff',
          shadowColor: 'rgba(59, 130, 246, 0.4)'
        };
    }
  };

  const config = getToastConfig();

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed' as const,
        top: '24px',
        right: '24px',
        zIndex: 1000,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        opacity: isExiting ? 0 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: isExiting ? 'none' : 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div
        style={{
          background: config.bgGradient,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${config.borderColor}`,
          borderRadius: '16px',
          padding: '16px 20px',
          minWidth: '320px',
          maxWidth: '480px',
          boxShadow: `0 20px 40px ${config.shadowColor}, 0 8px 16px rgba(0, 0, 0, 0.1)`,
          color: config.textColor,
          position: 'relative' as const,
          overflow: 'hidden' as const
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
            opacity: 0.6
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative' as const,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: '20px',
              flexShrink: 0,
              animation: type === 'loading' ? 'pulse 2s infinite' : 'none'
            }}
          >
            {config.icon}
          </div>

          {/* Message */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1.4',
                wordBreak: 'break-word' as const
              }}
            >
              {message}
            </p>
          </div>

          {/* Loading Spinner */}
          {type === 'loading' && (
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                flexShrink: 0
              }}
            />
          )}

          {/* Close Button */}
          {type !== 'loading' && (
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px',
                flexShrink: 0,
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Progress Bar for Loading */}
        {type === 'loading' && (
          <div
            style={{
              position: 'absolute' as const,
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0 0 15px 15px',
              overflow: 'hidden' as const
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                animation: 'progress 2s ease-in-out infinite',
                borderRadius: '0 0 15px 15px'
              }}
            />
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};

export default ToastNotification;
