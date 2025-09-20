import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isValidCoordinates } from '@/lib/geocode';

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
    const { latitude, longitude } = body;

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Latitude and longitude must be numbers' },
        { status: 400 }
      );
    }

    if (!isValidCoordinates(latitude, longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
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

    // Update coordinates
    const updatedBusiness = await prisma.business.update({
      where: { id: user.business.id },
      data: {
        lat: latitude,
        lng: longitude,
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

    return NextResponse.json({ business: updatedBusiness });

  } catch (error) {
    console.error('Coordinates update error:', error);
    return NextResponse.json(
      { error: 'Failed to update coordinates' },
      { status: 500 }
    );
  }
}
