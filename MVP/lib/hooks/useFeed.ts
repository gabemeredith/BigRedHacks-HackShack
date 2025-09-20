'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoWithBusiness, Category } from '@/lib/db';
import type { FeedResponse } from '@/app/api/feed/route';

interface UseFeedParams {
  latitude?: number;
  longitude?: number;
  radiusMi?: number;
  category?: Category;
  limit?: number;
  enabled?: boolean; // Allow disabling the hook
}

interface UseFeedReturn {
  videos: VideoWithBusiness[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalInRadius?: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  isLoadingMore: boolean;
}

const DEFAULT_LIMIT = 20;

export function useFeed({
  latitude,
  longitude,
  radiusMi,
  category,
  limit = DEFAULT_LIMIT,
  enabled = true,
}: UseFeedParams): UseFeedReturn {
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalInRadius, setTotalInRadius] = useState<number | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Keep track of the last fetch parameters to detect changes
  const lastParams = useRef<string>('');
  const abortController = useRef<AbortController | null>(null);

  // Generate cache key for detecting parameter changes
  const generateCacheKey = useCallback(() => {
    const params = {
      latitude,
      longitude,
      radiusMi,
      category,
      limit,
      enabled,
    };
    return JSON.stringify(params);
  }, [latitude, longitude, radiusMi, category, limit, enabled]);

  // Fetch feed data
  const fetchFeed = useCallback(async (cursor?: string, append = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      // Build query parameters
      const params = new URLSearchParams();
      
      if (latitude !== undefined && longitude !== undefined && radiusMi !== undefined) {
        params.set('lat', latitude.toString());
        params.set('lng', longitude.toString());
        params.set('radiusMi', radiusMi.toString());
      }
      
      if (category) {
        params.set('category', category.toLowerCase());
      }
      
      params.set('limit', limit.toString());
      
      if (cursor) {
        params.set('cursor', cursor);
      }

      const url = `/api/feed?${params.toString()}`;
      const response = await fetch(url, {
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: FeedResponse = await response.json();

      if (append) {
        setVideos(prev => [...prev, ...data.videos]);
      } else {
        setVideos(data.videos);
      }
      
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
      setTotalInRadius(data.totalInRadius);

    } catch (err) {
      // Don't set error for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch feed';
      setError(errorMessage);
      console.error('Feed fetch error:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [enabled, latitude, longitude, radiusMi, category, limit]);

  // Load more videos (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return;
    await fetchFeed(nextCursor, true);
  }, [fetchFeed, hasMore, isLoadingMore, nextCursor]);

  // Refresh feed (reset to first page)
  const refresh = useCallback(async () => {
    setNextCursor(null);
    await fetchFeed();
  }, [fetchFeed]);

  // Auto-fetch when parameters change
  useEffect(() => {
    const currentCacheKey = generateCacheKey();
    
    // Skip if parameters haven't changed
    if (currentCacheKey === lastParams.current) {
      return;
    }
    
    lastParams.current = currentCacheKey;
    
    // Reset state and fetch new data
    setVideos([]);
    setNextCursor(null);
    setHasMore(false);
    setTotalInRadius(undefined);
    
    if (enabled) {
      fetchFeed();
    }
  }, [generateCacheKey, fetchFeed, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    videos,
    loading,
    error,
    hasMore,
    totalInRadius,
    loadMore,
    refresh,
    isLoadingMore,
  };
}

// Hook variant that automatically uses location store
export function useFeedWithLocation(options: Omit<UseFeedParams, 'latitude' | 'longitude' | 'radiusMi'> = {}) {
  // Dynamic import to avoid SSR issues
  const [locationStore, setLocationStore] = useState<any>(null);
  
  useEffect(() => {
    import('@/lib/store/location').then(({ useLocationStore }) => {
      setLocationStore(useLocationStore);
    });
  }, []);

  const { userLocation, radiusMi } = locationStore?.() || { userLocation: null, radiusMi: 5 };

  return useFeed({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    radiusMi,
    ...options,
  });
}

// Utility hook for infinite scroll integration
export function useInfiniteFeed(params: UseFeedParams) {
  const feedData = useFeed(params);
  
  // Auto-load more when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        feedData.hasMore &&
        !feedData.isLoadingMore &&
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 1000
      ) {
        feedData.loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [feedData.hasMore, feedData.isLoadingMore, feedData.loadMore]);

  return feedData;
}
