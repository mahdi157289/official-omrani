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
    // Initialization side effects can be run here
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
