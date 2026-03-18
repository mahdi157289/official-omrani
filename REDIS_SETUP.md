# Redis Setup Guide

## Installation

### Windows
1. Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
2. Or use WSL2 with Redis: `wsl --install` then `sudo apt-get install redis-server`
3. Or use Docker: `docker run -d -p 6379:6379 redis:latest`

### macOS
```bash
brew install redis
brew services start redis
```

### Linux
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
```

## Configuration

### Environment Variables
Add to your `.env.local`:
```
REDIS_URL=redis://localhost:6379
```

Or for remote Redis:
```
REDIS_URL=redis://username:password@host:port
```

## Testing

1. Start Redis server
2. Run your Next.js app: `npm run dev`
3. Check Redis connection in browser console (should see cache operations)

## Fallback

If Redis is unavailable, the system automatically falls back to in-memory caching. This ensures the app works even without Redis, though cache won't persist across server restarts.

## Session Management

- Sessions are stored in browser localStorage
- Session ID format: `session-{timestamp}-{random}`
- Sessions expire after 1 hour of inactivity
- Cache is cleared when session expires or browser closes

## Cache Keys

All cache keys are prefixed with session ID:
- `{sessionId}:products:featured`
- `{sessionId}:packages:all`
- `{sessionId}:images:hero`
- `{sessionId}:3d:models:*`

## Monitoring

Check Redis cache:
```bash
redis-cli
> KEYS *
> GET {sessionId}:products:featured
> TTL {sessionId}:products:featured
```
