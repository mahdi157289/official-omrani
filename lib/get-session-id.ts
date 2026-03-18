import { cookies, headers } from 'next/headers';

/**
 * Get session ID from server-side
 * Checks cookies first, then headers, then generates temporary one
 */
export async function getServerSessionId(): Promise<string> {
  try {
    // Try to get from cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('omranis_session_id');
    if (sessionCookie?.value) {
      return sessionCookie.value;
    }

    // Try to get from headers
    const headersList = await headers();
    const sessionHeader = headersList.get('x-session-id');
    if (sessionHeader) {
      return sessionHeader;
    }
  } catch (error) {
    // Ignore errors in server components
  }

  // Fallback: generate temporary session ID
  return `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
