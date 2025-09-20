import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { haversineDistance } from '@/lib/geo';
import { stringToCategory, VideoWithBusiness } from '@/lib/db';

interface FeedQuery {
  lat?: string;
  lng?: string;
  radiusMi?: string;
  category?: string;
  cursor?: string; // Format: "createdAt:id"
  limit?: string;
}

interface FeedResponse {
  videos: VideoWithBusiness[];
  nextCursor: string | null;
  hasMore: boolean;
  totalInRadius?: number;
}

interface VideoWithDistance extends VideoWithBusiness {
  distance?: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MAX_FETCH_LIMIT = 200; // Max items to fetch before filtering

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query: FeedQuery = {
      lat: searchParams.get('lat') || undefined,
      lng: searchParams.get('lng') || undefined,
      radiusMi: searchParams.get('radiusMi') || undefined,
      category: searchParams.get('category') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    // Parse and validate parameters
    const latitude = query.lat ? parseFloat(query.lat) : null;
    const longitude = query.lng ? parseFloat(query.lng) : null;
    const radiusMiles = query.radiusMi ? parseFloat(query.radiusMi) : null;
    const limit = Math.min(
      query.limit ? parseInt(query.limit) : DEFAULT_LIMIT,
      MAX_LIMIT
    );

    // Validate location parameters
    const hasLocation = latitude !== null && longitude !== null && radiusMiles !== null;
    if (query.lat || query.lng || query.radiusMi) {
      if (!hasLocation) {
        return NextResponse.json(
          { error: 'lat, lng, and radiusMi must all be provided together' },
          { status: 400 }
        );
      }
      if (isNaN(latitude!) || isNaN(longitude!) || isNaN(radiusMiles!)) {
        return NextResponse.json(
          { error: 'lat, lng, and radiusMi must be valid numbers' },
          { status: 400 }
        );
      }
    }

    // Parse cursor for pagination
    let cursorDate: Date | undefined;
    let cursorId: string | undefined;
    if (query.cursor) {
      try {
        const [dateStr, id] = query.cursor.split(':');
        cursorDate = new Date(dateStr);
        cursorId = id;
        if (isNaN(cursorDate.getTime()) || !cursorId) {
          throw new Error('Invalid cursor format');
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid cursor format. Expected "createdAt:id"' },
          { status: 400 }
        );
      }
    }

    // Parse category filter
    const categoryFilter = query.category ? stringToCategory(query.category) : undefined;

    // Build Prisma query conditions
    const whereConditions: any = {};

    // Add category filter
    if (categoryFilter) {
      whereConditions.business = {
        category: categoryFilter,
      };
    }

    // Add cursor-based pagination
    if (cursorDate && cursorId) {
      whereConditions.OR = [
        {
          createdAt: {
            lt: cursorDate,
          },
        },
        {
          createdAt: cursorDate,
          id: {
            gt: cursorId,
          },
        },
      ];
    }

    // Fetch videos from database
    // We fetch more than needed to account for distance filtering
    const fetchLimit = hasLocation ? MAX_FETCH_LIMIT : limit + 1;
    
    const videos = await prisma.video.findMany({
      where: whereConditions,
      include: {
        business: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
              }
            }
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      take: fetchLimit,
    });

    let filteredVideos: VideoWithDistance[] = videos;
    let totalInRadius: number | undefined;

    // Apply distance filtering if location is provided
    if (hasLocation) {
      const videosWithDistance = videos
        .map(video => {
          // Only calculate distance for businesses with coordinates
          if (!video.business.lat || !video.business.lng) {
            return { ...video, distance: Infinity };
          }
          
          const distance = haversineDistance(
            latitude!,
            longitude!,
            video.business.lat,
            video.business.lng
          );
          
          return { ...video, distance };
        })
        .filter(video => video.distance <= radiusMiles!)
        .sort((a, b) => {
          // Sort by createdAt (desc), then by id (asc) for consistent pagination
          if (a.createdAt.getTime() !== b.createdAt.getTime()) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return a.id.localeCompare(b.id);
        });

      totalInRadius = videosWithDistance.length;
      filteredVideos = videosWithDistance;
    }

    // Apply pagination limit
    const hasMore = filteredVideos.length > limit;
    const paginatedVideos = filteredVideos.slice(0, limit);

    // Generate next cursor
    let nextCursor: string | null = null;
    if (hasMore && paginatedVideos.length > 0) {
      const lastVideo = paginatedVideos[paginatedVideos.length - 1];
      nextCursor = `${lastVideo.createdAt.toISOString()}:${lastVideo.id}`;
    }

    // Remove distance field from response (internal use only)
    const responseVideos = paginatedVideos.map(video => {
      const { distance, ...videoWithoutDistance } = video as VideoWithDistance;
      return videoWithoutDistance;
    });

    const response: FeedResponse = {
      videos: responseVideos,
      nextCursor,
      hasMore,
      ...(totalInRadius !== undefined && { totalInRadius }),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Feed API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export types for client use
export type { FeedResponse, FeedQuery };
