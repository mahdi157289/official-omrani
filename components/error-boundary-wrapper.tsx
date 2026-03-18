'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from './error-boundary';

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  // Ensure ErrorBoundary is available before rendering
  if (typeof ErrorBoundary === 'undefined' || !ErrorBoundary) {
    console.error('ErrorBoundary is not available, rendering children without error boundary');
    return <>{children}</>;
  }

  useEffect(() => {
    // Avoid module-load/render side effects; do any diagnostics after mount.
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const browserInfo = typeof navigator !== 'undefined' ? {
        userAgent: navigator.userAgent.substring(0, 100),
        isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
        isEdge: /Edg/.test(navigator.userAgent),
        chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
      } : {};

      const errorBoundaryImportCheck = {
        isDefined: typeof ErrorBoundary !== 'undefined',
        type: typeof ErrorBoundary,
        isFunction: typeof ErrorBoundary === 'function',
        name: (ErrorBoundary as any)?.name,
      };

      fetch('http://127.0.0.1:7243/ingest/72efc50c-1fa4-41ca-a8cb-e684d22c1c74', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'error-boundary-wrapper.tsx:useEffect',
          message: 'ErrorBoundaryWrapper mounted',
          data: {
            errorBoundaryImportCheck,
            hasWindow: typeof window !== 'undefined',
            hasDocument: typeof document !== 'undefined',
            hasErrorBoundary: typeof ErrorBoundary !== 'undefined',
            ...browserInfo,
          },
          timestamp: Date.now(),
          hypothesisId: 'A,D',
          runId: 'debug-v2',
        }),
      }).catch(() => {});
    }
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
