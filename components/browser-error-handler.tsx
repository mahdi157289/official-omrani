'use client';

import { useEffect } from 'react';

export function BrowserErrorHandler() {
  useEffect(() => {
    // #region agent log
    const browserInfo = typeof navigator !== 'undefined' ? {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
      isEdge: /Edg/.test(navigator.userAgent),
      isFirefox: /Firefox/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
    } : {};

    // #endregion

    // Global error handler - catch ALL errors including React errors
    const handleError = (event: ErrorEvent) => {
      
      // Also log to console for immediate visibility
      console.error('BrowserErrorHandler caught error:', event);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    };

    // Set up error handlers immediately
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError, true); // Use capture phase
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Also catch React errors that might not bubble to window
      const originalConsoleError = console.error;
      console.error = (...args) => {
        originalConsoleError.apply(console, args);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('error', handleError, true);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      }
    };
  }, []);

  return null;
}
