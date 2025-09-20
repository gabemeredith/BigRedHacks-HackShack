import { NextRequest, NextResponse } from 'next/server';
import { getVideosByLocation, getAllVideos, stringToCategory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const category = searchParams.get('category');

    let videos;

    if (lat && lng && radius) {
      // Get videos by location
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusMiles = parseFloat(radius);

      const categoryFilter = category ? stringToCategory(category) : undefined;

      videos = await getVideosByLocation(latitude, longitude, radiusMiles, categoryFilter);
    } else {
      // Get all videos
      videos = await getAllVideos();
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
