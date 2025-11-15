import { useEffect, useCallback } from 'react';

// Custom hook for accessibility features
export const useAccessibility = () => {
  // Skip to main content functionality
  const skipToContent = useCallback((targetId = 'main-content') => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // High contrast mode toggle
  const toggleHighContrast = useCallback(() => {
    const body = document.body;
    const isHighContrast = body.classList.contains('high-contrast');

    if (isHighContrast) {
      body.classList.remove('high-contrast');
      localStorage.setItem('highContrast', 'false');
    } else {
      body.classList.add('high-contrast');
      localStorage.setItem('highContrast', 'true');
    }
  }, []);

  // Font size adjustment
  const adjustFontSize = useCallback((increase = true) => {
    const body = document.body;
    const currentSize = parseFloat(getComputedStyle(body).fontSize);
    const newSize = increase ? currentSize * 1.1 : currentSize / 1.1;

    // Limit font size between 14px and 24px
    const clampedSize = Math.max(14, Math.min(24, newSize));
    body.style.fontSize = `${clampedSize}px`;

    localStorage.setItem('fontSize', clampedSize.toString());
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // Remove after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }, []);

  // Keyboard navigation for focus management
  const trapFocus = useCallback((container) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }

      if (e.key === 'Escape') {
        // Close modal or return focus
        container.setAttribute('aria-hidden', 'true');
        // Return focus to trigger element (you might want to store this)
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Initialize accessibility features
  useEffect(() => {
    // Load saved preferences
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const fontSize = localStorage.getItem('fontSize');

    if (highContrast) {
      document.body.classList.add('high-contrast');
    }

    if (fontSize) {
      document.body.style.fontSize = `${fontSize}px`;
    }

    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:p-2';
    skipLink.onclick = (e) => {
      e.preventDefault();
      skipToContent();
    };

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Cleanup
    return () => {
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink);
      }
    };
  }, [skipToContent]);

  return {
    skipToContent,
    toggleHighContrast,
    adjustFontSize,
    announceToScreenReader,
    trapFocus
  };
};
