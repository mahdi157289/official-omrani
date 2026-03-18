'use client';

/**
 * Session Manager
 * Manages browser session IDs with time-based expiration (1 hour)
 */

const SESSION_KEY = 'omranis_session_id';
const SESSION_TIMESTAMP_KEY = 'omranis_session_timestamp';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export interface SessionInfo {
  sessionId: string;
  isNewSession: boolean;
}

/**
 * Get or create a session ID
 * Creates new session if:
 * - No session exists
 * - Session is older than 1 hour
 * - Browser was closed and reopened
 */
export function getSessionId(): SessionInfo {
  if (typeof window === 'undefined') {
    // Server-side: generate temporary session
    return {
      sessionId: `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      isNewSession: true,
    };
  }

  try {
    const existingSessionId = localStorage.getItem(SESSION_KEY);
    const existingTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);

    // Check if session exists and is still valid
    if (existingSessionId && existingTimestamp) {
      const timestamp = parseInt(existingTimestamp, 10);
      const now = Date.now();
      const age = now - timestamp;

      // Session is valid if less than 1 hour old
      if (age < SESSION_DURATION) {
        return {
          sessionId: existingSessionId,
          isNewSession: false,
        };
      }
    }

    // Create new session
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const timestamp = Date.now().toString();

    localStorage.setItem(SESSION_KEY, newSessionId);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);

    return {
      sessionId: newSessionId,
      isNewSession: true,
    };
  } catch (error) {
    // Fallback if localStorage is unavailable
    console.warn('Failed to access localStorage, using temporary session:', error);
    return {
      sessionId: `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      isNewSession: true,
    };
  }
}

/**
 * Clear current session
 * Used when explicitly logging out or starting fresh
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);
  } catch (error) {
    console.warn('Failed to clear session:', error);
  }
}

/**
 * Check if current session is new
 */
export function isNewSession(): boolean {
  return getSessionId().isNewSession;
}

/**
 * Refresh session timestamp (extends expiration)
 */
export function refreshSession(): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    }
  } catch (error) {
    console.warn('Failed to refresh session:', error);
  }
}
