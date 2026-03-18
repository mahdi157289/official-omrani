import 'server-only';
import Redis from 'ioredis';

/**
 * Redis Cache Utility
 * Handles session-based caching with time-based expiration (1 hour)
 */

let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 * Falls back to in-memory cache if Redis is unavailable
 */
function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        // Retry up to 3 times
        if (times > 3) {
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000); // Exponential backoff
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('error', (err) => {
      console.warn('Redis connection error:', err);
      // Don't throw, fallback to in-memory cache
    });

    return redisClient;
  } catch (error) {
    console.warn('Failed to create Redis client:', error);
    return null;
  }
}

// In-memory fallback cache
const memoryCache = new Map<string, { data: any; expires: number }>();
const MEMORY_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Generate cache key with session prefix
 */
function getCacheKey(sessionId: string, key: string): string {
  return `${sessionId}:${key}`;
}

/**
 * Get value from cache (Redis or memory)
 */
export async function getCache<T>(
  sessionId: string,
  key: string
): Promise<T | null> {
  const cacheKey = getCacheKey(sessionId, key);

  // Try Redis first
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      const value = await client.get(cacheKey);
      if (value) {
        return JSON.parse(value) as T;
      }
    } catch (error) {
      console.warn('Redis get error, falling back to memory:', error);
    }
  }

  // Fallback to memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }

  // Remove expired entry
  if (cached) {
    memoryCache.delete(cacheKey);
  }

  return null;
}

/**
 * Set value in cache (Redis or memory)
 */
export async function setCache<T>(
  sessionId: string,
  key: string,
  value: T,
  ttl: number = 60 * 60 // 1 hour in seconds
): Promise<void> {
  const cacheKey = getCacheKey(sessionId, key);
  const serialized = JSON.stringify(value);

  // Try Redis first
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      await client.setex(cacheKey, ttl, serialized);
      return;
    } catch (error) {
      console.warn('Redis set error, falling back to memory:', error);
    }
  }

  // Fallback to memory cache
  memoryCache.set(cacheKey, {
    data: value,
    expires: Date.now() + ttl * 1000,
  });
}

/**
 * Delete cache entry
 */
export async function deleteCache(sessionId: string, key: string): Promise<void> {
  const cacheKey = getCacheKey(sessionId, key);

  // Try Redis first
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      await client.del(cacheKey);
    } catch (error) {
      console.warn('Redis delete error:', error);
    }
  }

  // Remove from memory cache
  memoryCache.delete(cacheKey);
}

/**
 * Clear all cache entries for a session
 */
export async function clearSessionCache(sessionId: string): Promise<void> {
  const pattern = `${sessionId}:*`;

  // Try Redis first
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      console.warn('Redis clear error:', error);
    }
  }

  // Clear memory cache
  for (const key of memoryCache.keys()) {
    if (key.startsWith(sessionId)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Preload data and cache it
 */
export async function preloadAndCache<T>(
  sessionId: string,
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 60 * 60 // 1 hour
): Promise<T> {
  // Check cache first
  const cached = await getCache<T>(sessionId, key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  await setCache(sessionId, key, data, ttl);
  return data;
}

/**
 * Cleanup expired memory cache entries
 */
export function cleanupMemoryCache(): void {
  const now = Date.now();
  for (const [key, value] of memoryCache.entries()) {
    if (value.expires <= now) {
      memoryCache.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryCache, 5 * 60 * 1000);
}
