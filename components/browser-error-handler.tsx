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

    fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'browser-error-handler.tsx:useEffect',
        message: 'Browser info detected',
        data: {
          ...browserInfo,
          hasWindow: typeof window !== 'undefined',
          hasDocument: typeof document !== 'undefined',
          reactVersion: typeof window !== 'undefined' && typeof window.React !== 'undefined' ? 'available' : 'unavailable',
        },
        timestamp: Date.now(),
        hypothesisId: 'F',
        runId: 'chrome-debug',
      }),
    }).catch(() => {});
    // #endregion

    // Global error handler - catch ALL errors including React errors
    const handleError = (event: ErrorEvent) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'browser-error-handler.tsx:handleError',
          message: 'Global error caught',
          data: {
            errorMessage: event.message,
            errorFilename: event.filename,
            errorLineno: event.lineno,
            errorColno: event.colno,
            errorStack: event.error?.stack,
            errorName: event.error?.name,
            errorType: event.error?.constructor?.name,
            ...browserInfo,
          },
          timestamp: Date.now(),
          hypothesisId: 'F',
          runId: 'chrome-debug',
        }),
      }).catch(() => {});
      // #endregion
      
      // Also log to console for immediate visibility
      console.error('BrowserErrorHandler caught error:', event);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'browser-error-handler.tsx:handleUnhandledRejection',
          message: 'Unhandled promise rejection',
          data: {
            reason: String(event.reason),
            reasonStack: event.reason?.stack,
            ...browserInfo,
          },
          timestamp: Date.now(),
          hypothesisId: 'F',
          runId: 'chrome-debug',
        }),
      }).catch(() => {});
      // #endregion
    };

    // Set up error handlers immediately
    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError, true); // Use capture phase
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      // Also catch React errors that might not bubble to window
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // #region agent log
        const errorStr = args.map(arg => String(arg)).join(' ');
        if (errorStr.includes('Error') || errorStr.includes('Cannot read') || errorStr.includes('undefined')) {
          fetch('http://127.0.0.1:7242/ingest/29c793d4-1785-44a7-95ca-8aefed5f088b', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'browser-error-handler.tsx:console.error',
              message: 'Console error detected',
              data: {
                errorMessage: errorStr,
                errorArgs: args.map(a => String(a)),
                ...browserInfo,
              },
              timestamp: Date.now(),
              hypothesisId: 'F',
              runId: 'chrome-debug',
            }),
          }).catch(() => {});
        }
        // #endregion
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
