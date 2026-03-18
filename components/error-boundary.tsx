'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Error fallback component that matches the original UI
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => {
            resetErrorBoundary();
            window.location.reload();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Error handler function that replicates componentDidCatch behavior
// react-error-boundary's onError receives (error, errorInfo) where errorInfo has componentStack
function handleError(error: Error, errorInfo: { componentStack: string }) {
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    const browserInfo = typeof navigator !== 'undefined' ? {
      userAgent: navigator.userAgent,
      vendor: (navigator as any).vendor,
      platform: (navigator as any).platform,
      isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
      isEdge: /Edg/.test(navigator.userAgent),
      isFirefox: /Firefox/.test(navigator.userAgent),
      isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
      chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
    } : {};

    fetch('http://127.0.0.1:7243/ingest/72efc50c-1fa4-41ca-a8cb-e684d22c1c74', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'error-boundary.tsx:handleError',
        message: 'Error caught by boundary',
        data: {
          errorMessage: error.message,
          errorName: error.name,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
          errorToString: String(error),
          ...browserInfo,
          hasWindow: typeof window !== 'undefined',
          hasDocument: typeof document !== 'undefined',
        },
        timestamp: Date.now(),
        hypothesisId: 'C',
        runId: 'debug-v2',
      }),
    }).catch(() => {});
  }

  console.error('ErrorBoundary caught an error:', error, errorInfo);
}

// Main ErrorBoundary function component
export function ErrorBoundary({ children, fallback }: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const browserInfo = typeof navigator !== 'undefined' ? {
        userAgent: navigator.userAgent.substring(0, 100),
        isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test((navigator as any).vendor),
        isEdge: /Edg/.test(navigator.userAgent),
        chromeVersion: /Chrome\/(\d+)/.exec(navigator.userAgent)?.[1],
      } : {};

      const reactErrorBoundaryImportCheck = {
        isDefined: typeof ReactErrorBoundary !== 'undefined',
        type: typeof ReactErrorBoundary,
        isFunction: typeof ReactErrorBoundary === 'function',
        name: (ReactErrorBoundary as any)?.name,
      };

      fetch('http://127.0.0.1:7243/ingest/72efc50c-1fa4-41ca-a8cb-e684d22c1c74', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'error-boundary.tsx:useEffect',
          message: 'ErrorBoundary mounted',
          data: {
            reactErrorBoundaryImportCheck,
            hasReactErrorBoundary: typeof ReactErrorBoundary !== 'undefined',
            hasFallback: !!fallback,
            ...browserInfo,
            hasWindow: typeof window !== 'undefined',
          },
          timestamp: Date.now(),
          hypothesisId: 'C,D',
          runId: 'debug-v2',
        }),
      }).catch(() => {});
    }
  }, [fallback]);

  // Ensure ReactErrorBoundary is available
  if (typeof ReactErrorBoundary === 'undefined' || !ReactErrorBoundary) {
    console.error('ReactErrorBoundary is not available, rendering children without error boundary');
    return <>{children}</>;
  }

  // If custom fallback is provided, use it; otherwise use default ErrorFallback
  const fallbackRender = fallback 
    ? () => fallback as ReactNode
    : ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      );

  return (
    <ReactErrorBoundary
      fallbackRender={fallbackRender}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}
