import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { geocodeAddress } from '@/lib/geocode';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, website, category, address } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Find the user's business
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { business: true }
    });

    if (!user?.business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    let lat = user.business.lat;
    let lng = user.business.lng;
    let geocodeSuccess = false;

    // Try to geocode if address changed and Google API key is available
    if (address && address !== user.business.address) {
      const geocodeResult = await geocodeAddress(address);
      
      if ('latitude' in geocodeResult) {
        lat = geocodeResult.latitude;
        lng = geocodeResult.longitude;
        geocodeSuccess = true;
      }
      // If geocoding fails, we continue without coordinates
    }

    // Update the business
    const updatedBusiness = await prisma.business.update({
      where: { id: user.business.id },
      data: {
        name,
        website: website || null,
        category,
        address: address || null,
        lat,
        lng,
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

    return NextResponse.json({
      business: updatedBusiness,
      geocoded: geocodeSuccess,
    });

  } catch (error) {
    console.error('Business update error:', error);
    return NextResponse.json(
      { error: 'Failed to update business profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        business: {
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
        }
      }
    });

    if (!user?.business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ business: user.business });

  } catch (error) {
    console.error('Business fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business profile' },
      { status: 500 }
    );
  }
}
