import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaBell } from 'react-icons/fa';
import './NotificationSystem.css';

// Context para o sistema de notificações
const NotificationContext = createContext();

// Hook para usar o sistema de notificações
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
};

// Tipos de notificação
const NOTIFICATION_TYPES = {
  success: {
    icon: FaCheckCircle,
    className: 'toast-success',
    defaultDuration: 4000
  },
  error: {
    icon: FaTimes,
    className: 'toast-error', 
    defaultDuration: 6000
  },
  warning: {
    icon: FaExclamationTriangle,
    className: 'toast-warning',
    defaultDuration: 5000
  },
  info: {
    icon: FaInfoCircle,
    className: 'toast-info',
    defaultDuration: 4000
  },
  loading: {
    icon: FaBell,
    className: 'toast-loading',
    defaultDuration: null // Não fecha automaticamente
  }
};

// Provider do sistema de notificações
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Adicionar notificação
  const addNotification = useCallback((type, title, message = '', options = {}) => {
    const id = Date.now() + Math.random();
    const typeConfig = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.info;
    
    const notification = {
      id,
      type,
      title,
      message,
      icon: typeConfig.icon,
      className: typeConfig.className,
      duration: options.duration !== undefined ? options.duration : typeConfig.defaultDuration,
      persistent: options.persistent || false,
      actions: options.actions || [],
      createdAt: new Date(),
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remover se não for persistente e tiver duration
    if (!notification.persistent && notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  // Remover notificação
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Limpar todas as notificações
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback((title, message, options) => 
    addNotification('success', title, message, options), [addNotification]);
    
  const error = useCallback((title, message, options) => 
    addNotification('error', title, message, options), [addNotification]);
    
  const warning = useCallback((title, message, options) => 
    addNotification('warning', title, message, options), [addNotification]);
    
  const info = useCallback((title, message, options) => 
    addNotification('info', title, message, options), [addNotification]);
    
  const loading = useCallback((title, message, options) => 
    addNotification('loading', title, message, { persistent: true, ...options }), [addNotification]);

  // Atualizar notificação existente
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, ...updates } : n
    ));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    loading,
    updateNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationDisplay 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Componente de exibição das notificações
const NotificationDisplay = ({ notifications, onRemove }) => {
  return (
    <ToastContainer 
      position="top-end" 
      className="notification-container p-3"
      style={{ zIndex: 9999 }}
    >
      {notifications.map((notification) => {
        const IconComponent = notification.icon;
        
        return (
          <Toast
            key={notification.id}
            show={true}
            onClose={() => onRemove(notification.id)}
            className={`notification-toast ${notification.className}`}
            autohide={false} // Controlamos manualmente
          >
            <Toast.Header closeButton={!notification.persistent}>
              <IconComponent className="me-2" />
              <strong className="me-auto">{notification.title}</strong>
              <small className="text-muted">
                {formatTime(notification.createdAt)}
              </small>
            </Toast.Header>
            {(notification.message || notification.actions?.length) && (
              <Toast.Body>
                {notification.message && (
                  <div className="notification-message">
                    {notification.message}
                  </div>
                )}
                {notification.actions?.length > 0 && (
                  <div className="notification-actions mt-2">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${action.variant || 'btn-outline-primary'} me-2`}
                        onClick={() => {
                          action.onClick();
                          if (action.closeOnClick !== false) {
                            onRemove(notification.id);
                          }
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </Toast.Body>
            )}
          </Toast>
        );
      })}
    </ToastContainer>
  );
};

// Utilitário para formatar tempo
const formatTime = (date) => {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'agora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default NotificationProvider;