# Splash Screen Preloading & Session-Based Redis Cache Implementation Plan

## Overview
Transform the loading experience by:
1. Removing route navigation loaders
2. Preloading all resources during splash screen
3. Implementing session-based Redis caching
4. Reducing skeleton display time to 0.5s

## Architecture

### Flow Diagram
```
User Visits Site
    ↓
Splash Screen Appears (4s)
    ↓
[Parallel Preloading During Splash]
    ├─ Featured Products → Redis Cache
    ├─ Packages → Redis Cache
    ├─ 3D Models → Preload & Cache
    ├─ Critical Images → Preload
    └─ API Routes → Cache Responses
    ↓
Splash Fades Out
    ↓
Content Appears Instantly (from cache)
    ├─ Skeletons show (0.5s max)
    └─ Content loads from Redis
    ↓
Fully Loaded
```

## Implementation Steps

### 1. Install Redis Client
**Package:** `ioredis` or `redis` (Node.js Redis client)
**Command:** `npm install ioredis`

### 2. Create Redis Cache Utility
**File:** `lib/redis-cache.ts`
- Session ID generation
- Cache get/set with session prefix
- Session-based key management
- Cache clearing on session end

### 3. Create Preloader Component
**File:** `components/splash-preloader.tsx`
- Runs during splash screen
- Preloads: products, packages, 3D models, images
- Stores in Redis with session keys
- Tracks preload progress

### 4. Update Splash Screen
**File:** `components/splash-screen.tsx`
- Trigger preloader on mount
- Wait for critical resources
- Fade out when ready (or after 4s max)

### 5. Delete Route Loaders
**Files to Delete:**
- `app/[locale]/loading.tsx` (progress bar)
- Keep `app/[locale]/admin/loading.tsx` (admin needs it)
- Keep `app/[locale]/(shop)/shop/loading.tsx` (skeleton, but update duration)

### 6. Update Skeletons
**File:** `components/ui/skeletons.tsx`
- Add 0.5s timeout/display duration
- Auto-hide after 0.5s

### 7. Create Session Management
**File:** `lib/session-manager.ts`
- Generate unique session ID
- Store in localStorage
- Clear Redis cache on new session
- Session expires on browser close

### 8. Update Data Fetching Functions
**Files to Update:**
- `app/[locale]/(shop)/page.tsx` - Check Redis first
- `components/packages-section.tsx` - Check Redis first
- API routes - Return cached data if available

## Detailed Implementation

### Session ID Generation
```typescript
// Generate on first visit
// Format: session-{timestamp}-{random}
// Store in localStorage
// Use as Redis key prefix
```

### Redis Cache Keys
```
{sessionId}:products:featured
{sessionId}:packages:all
{sessionId}:3d:models:lantern
{sessionId}:3d:models:logo
{sessionId}:images:hero
{sessionId}:images:products:{id}
```

### Preload Priority
1. **Critical (0-1s):** Featured products, hero image
2. **High (1-2s):** Packages, first 4 product images
3. **Medium (2-3s):** Remaining product images, 3D models
4. **Low (3-4s):** Gallery images, other assets

### Cache TTL
- **Session-based:** Cache lives for session duration
- **Auto-clear:** On new session or browser close
- **Fallback:** If Redis unavailable, use in-memory cache

## Files to Create/Modify

**New Files:**
1. `lib/redis-cache.ts` - Redis client wrapper
2. `lib/session-manager.ts` - Session ID management
3. `components/splash-preloader.tsx` - Preloading logic
4. `app/api/cache/preload/route.ts` - Preload API endpoint

**Files to Modify:**
1. `components/splash-screen.tsx` - Add preloader integration
2. `components/ui/skeletons.tsx` - Add 0.5s duration
3. `app/[locale]/(shop)/page.tsx` - Use Redis cache
4. `components/packages-section.tsx` - Use Redis cache
5. `package.json` - Add Redis dependency

**Files to Delete:**
1. `app/[locale]/loading.tsx` - Remove progress bar loader

## Expected Results

**Before:**
- Route navigation: Shows progress bar
- Content load: 500-1000ms
- Skeletons: Show until content loads
- 3D models: Blank space for 2-5s

**After:**
- Route navigation: Instant (no loader)
- Content load: 0-50ms (from Redis)
- Skeletons: 0.5s max, then content
- 3D models: Preloaded, instant display
- Overall: 80-90% faster perceived load

## Considerations

1. **Redis Setup:** Need Redis server (local or cloud)
2. **Session Definition:** Browser session (clears on close) or time-based?
3. **Fallback:** If Redis fails, fall back to direct DB queries
4. **Memory:** Redis memory usage for cached data
5. **Preload Timeout:** What if preload takes >4s?

## Questions to Clarify

1. **Session Definition:** 
   - Browser session (clears on tab close)?
   - Time-based (e.g., 30 minutes)?
   - User-based (per user ID)?

2. **Redis Setup:**
   - Local Redis instance?
   - Cloud Redis (Upstash, Redis Cloud)?
   - Docker container?

3. **Preload Failure:**
   - What if preload fails?
   - Should splash wait or timeout?
   - Fallback strategy?

4. **Cache Invalidation:**
   - Clear on every new session?
   - Keep some data across sessions?
   - Manual clear option?
