import { PrismaClient, Business, User, Video, Category } from '@prisma/client';
import { haversineDistance } from './geo';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Types for API responses
export type BusinessWithVideos = Business & {
  videos: Video[];
  owner: User;
};

export type VideoWithBusiness = Video & {
  business: Business;
};

// Helper functions for database operations
export async function getBusinessesByLocation(
  latitude: number,
  longitude: number,
  radiusMiles: number,
  category?: Category
): Promise<BusinessWithVideos[]> {
  const businesses = await prisma.business.findMany({
    where: {
      category: category || undefined,
      lat: { not: null },
      lng: { not: null },
    },
    include: {
      videos: true,
      owner: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }
    }
  });

  // Filter by distance
  return businesses.filter(business => {
    if (!business.lat || !business.lng) return false;
    
    const distance = haversineDistance(
      latitude,
      longitude,
      business.lat,
      business.lng
    );
    
    return distance <= radiusMiles;
  });
}

export async function getVideosByLocation(
  latitude: number,
  longitude: number,
  radiusMiles: number,
  category?: Category
): Promise<VideoWithBusiness[]> {
  const videos = await prisma.video.findMany({
    include: {
      business: true
    },
    where: {
      business: {
        category: category || undefined,
        lat: { not: null },
        lng: { not: null },
      }
    }
  });

  // Filter by distance
  return videos.filter(video => {
    if (!video.business.lat || !video.business.lng) return false;
    
    const distance = haversineDistance(
      latitude,
      longitude,
      video.business.lat,
      video.business.lng
    );
    
    return distance <= radiusMiles;
  });
}

export async function getAllBusinesses(): Promise<BusinessWithVideos[]> {
  return await prisma.business.findMany({
    include: {
      videos: true,
      owner: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }
    }
  });
}

export async function getAllVideos(): Promise<VideoWithBusiness[]> {
  return await prisma.video.findMany({
    include: {
      business: true
    }
  });
}

export async function getBusinessById(id: string): Promise<BusinessWithVideos | null> {
  return await prisma.business.findUnique({
    where: { id },
    include: {
      videos: true,
      owner: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }
    }
  });
}

export async function createBusiness(data: {
  name: string;
  website?: string;
  category: Category;
  address?: string;
  lat?: number;
  lng?: number;
  ownerId: string;
}): Promise<Business> {
  return await prisma.business.create({
    data
  });
}

export async function createVideo(data: {
  title: string;
  url: string;
  thumbUrl?: string;
  businessId: string;
}): Promise<Video> {
  return await prisma.video.create({
    data
  });
}

// Utility function to map Prisma Category to lowercase string
export function categoryToString(category: Category): string {
  switch (category) {
    case 'RESTAURANTS':
      return 'restaurant';
    case 'CLOTHING':
      return 'clothing';
    case 'ART':
      return 'art';
    case 'ENTERTAINMENT':
      return 'entertainment';
    default:
      return 'unknown';
  }
}

// Utility function to map string to Prisma Category
export function stringToCategory(category: string): Category {
  switch (category.toLowerCase()) {
    case 'restaurant':
    case 'restaurants':
    case 'food':
      return 'RESTAURANTS';
    case 'clothing':
    case 'fashion':
      return 'CLOTHING';
    case 'art':
    case 'gallery':
      return 'ART';
    case 'entertainment':
    case 'event':
    case 'events':
      return 'ENTERTAINMENT';
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}
