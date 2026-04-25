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
  // Only log to standard console to prevent local telemetry fetching loop
  console.error('ErrorBoundary caught an error:', error, errorInfo);
}

// Main ErrorBoundary function component
export function ErrorBoundary({ children, fallback }: Props) {
  useEffect(() => {
    // Component mounted listener (No longer tracking local telemetry to avoid port 7243 connection errors)
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
