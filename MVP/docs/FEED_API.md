# Feed API Documentation

## Overview

The Feed API (`GET /api/feed`) provides a unified, paginated endpoint for fetching videos with business information, filtered by location, category, and other parameters. It uses cursor-based pagination for optimal performance and supports real-time distance filtering.

## Endpoint

```
GET /api/feed
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | No* | Latitude for location-based filtering |
| `lng` | number | No* | Longitude for location-based filtering |
| `radiusMi` | number | No* | Radius in miles for location filtering |
| `category` | string | No | Business category filter (`restaurants`, `clothing`, `art`, `entertainment`) |
| `cursor` | string | No | Pagination cursor in format `createdAt:id` |
| `limit` | number | No | Number of items per page (default: 20, max: 50) |

*Note: `lat`, `lng`, and `radiusMi` must all be provided together for location filtering.

## Response Format

```typescript
interface FeedResponse {
  videos: VideoWithBusiness[];
  nextCursor: string | null;
  hasMore: boolean;
  totalInRadius?: number; // Only present when location filtering is used
}
```

## Example Usage

### Basic Feed (No Location)
```bash
curl "http://localhost:3000/api/feed?limit=10"
```

### Location-Based Feed
```bash
curl "http://localhost:3000/api/feed?lat=42.45667&lng=-76.47441&radiusMi=5&limit=10"
```

### Category-Filtered Feed
```bash
curl "http://localhost:3000/api/feed?lat=42.45667&lng=-76.47441&radiusMi=10&category=restaurants"
```

### Pagination
```bash
# First page
curl "http://localhost:3000/api/feed?lat=42.45667&lng=-76.47441&radiusMi=10&limit=5"

# Next page using cursor from previous response
curl "http://localhost:3000/api/feed?lat=42.45667&lng=-76.47441&radiusMi=10&limit=5&cursor=2025-09-20T15:12:49.585Z:cmfseqxtd0011ufwkmismvuct"
```

## Client Hook Usage

### Basic Hook
```typescript
import { useFeed } from '@/lib/hooks/useFeed';

function MyComponent() {
  const {
    videos,
    loading,
    error,
    hasMore,
    totalInRadius,
    loadMore,
    refresh,
    isLoadingMore,
  } = useFeed({
    latitude: 42.45667,
    longitude: -76.47441,
    radiusMi: 10,
    category: 'RESTAURANTS',
    limit: 20,
  });

  // Component logic...
}
```

### Hook with Location Store
```typescript
import { useFeedWithLocation } from '@/lib/hooks/useFeed';

function MyComponent() {
  const feedData = useFeedWithLocation({
    category: 'RESTAURANTS',
    limit: 20,
  });
  
  // Automatically uses user's location from store
}
```

### Infinite Scroll Hook
```typescript
import { useInfiniteFeed } from '@/lib/hooks/useFeed';

function InfiniteScrollComponent() {
  const feedData = useInfiniteFeed({
    latitude: 42.45667,
    longitude: -76.47441,
    radiusMi: 10,
  });
  
  // Automatically loads more when scrolling near bottom
}
```

## Performance Characteristics

### Database Optimization
- Fetches maximum 200 items from database before filtering
- Uses indexed sorting by `createdAt` and `id` for pagination
- Distance filtering performed in JavaScript for SQLite compatibility

### Caching Strategy
- Hook automatically detects parameter changes
- Cancels previous requests when parameters change
- Implements request deduplication via abort controllers

### Pagination
- Cursor-based pagination for consistent results
- Stable sorting using `createdAt` + `id` combination
- No duplicate items across pages

## Error Handling

### API Errors
- **400**: Invalid parameters (missing location data, invalid cursor format)
- **500**: Internal server error

### Client Hook Errors
- Network errors are captured and exposed via `error` state
- Aborted requests (parameter changes) don't trigger error state
- Partial data preserved when pagination fails

## Location Filtering Logic

1. **Database Query**: Fetch videos with optional category filter
2. **Distance Calculation**: Apply Haversine formula to each video's business location
3. **Filtering**: Remove videos outside the specified radius
4. **Sorting**: Maintain consistent sort order for pagination
5. **Pagination**: Apply limit and generate next cursor

## Integration Examples

### Replace Existing Video Fetching
```typescript
// Before: Multiple endpoints
const restaurantVideos = await fetch('/api/videos?category=restaurants');
const nearbyVideos = await fetch('/api/videos/nearby?lat=...');

// After: Single feed endpoint
const { videos } = useFeed({
  latitude: userLat,
  longitude: userLng,
  radiusMi: 10,
  category: 'RESTAURANTS'
});
```

### Homepage Integration
```typescript
// Show mixed content from all categories
const { videos: recentVideos } = useFeed({
  latitude: userLocation?.latitude,
  longitude: userLocation?.longitude,
  radiusMi: userRadius,
  limit: 6
});
```

### Category Page Integration
```typescript
// Replace CategoryPage's business fetching
const { videos: categoryVideos } = useFeed({
  latitude: userLocation?.latitude,
  longitude: userLocation?.longitude,
  radiusMi: userRadius,
  category: pageCategory
});
```

## Migration Guide

### From `/api/videos`
1. Replace endpoint calls with `useFeed` hook
2. Update component to handle pagination
3. Remove manual distance calculations

### From `/api/businesses`  
1. Use feed endpoint for video-focused business discovery
2. Keep existing business endpoint for business-only data
3. Leverage `totalInRadius` for count displays

## Future Enhancements

- [ ] Add sorting options (distance, popularity, date)
- [ ] Implement search/filtering by business name or video title
- [ ] Add caching layer (Redis) for improved performance
- [ ] Support for real-time updates via WebSockets
- [ ] Add analytics tracking for feed interactions
