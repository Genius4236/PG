import { useCallback } from 'react';

// Custom hook for toast notifications
export const useToast = () => {
  const toast = useCallback((message, type = 'info', duration = 4000) => {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = 'absolute top-1 right-2 text-xl font-bold hover:opacity-75';
    closeButton.onclick = () => removeToast(toastElement);

    // Add message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'pr-6';

    toastElement.appendChild(messageElement);
    toastElement.appendChild(closeButton);
    toastContainer.appendChild(toastElement);

    // Animate in
    setTimeout(() => {
      toastElement.classList.remove('translate-x-full');
    }, 10);

    // Auto remove after duration
    const removeTimeout = setTimeout(() => {
      removeToast(toastElement);
    }, duration);

    // Remove toast function
    const removeToast = (element) => {
      clearTimeout(removeTimeout);
      element.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    };

    return {
      dismiss: () => removeToast(toastElement)
    };
  }, []);

  const success = useCallback((message, duration) => toast(message, 'success', duration), [toast]);
  const error = useCallback((message, duration) => toast(message, 'error', duration), [toast]);
  const warning = useCallback((message, duration) => toast(message, 'warning', duration), [toast]);
  const info = useCallback((message, duration) => toast(message, 'info', duration), [toast]);

  return {
    toast,
    success,
    error,
    warning,
    info
  };
};
