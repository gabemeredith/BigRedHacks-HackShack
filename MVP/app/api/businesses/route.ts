import { NextRequest, NextResponse } from 'next/server';
import { getBusinessesByLocation, getAllBusinesses, stringToCategory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');
    const category = searchParams.get('category');

    let businesses;

    if (lat && lng && radius) {
      // Get businesses by location
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusMiles = parseFloat(radius);

      const categoryFilter = category ? stringToCategory(category) : undefined;

      businesses = await getBusinessesByLocation(latitude, longitude, radiusMiles, categoryFilter);
    } else {
      // Get all businesses
      businesses = await getAllBusinesses();
    }

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
