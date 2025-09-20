import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, url, thumbUrl } = body;

    // Validate required fields
    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
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

    // Create the video
    const video = await prisma.video.create({
      data: {
        title,
        url,
        thumbUrl: thumbUrl || null,
        businessId: user.business.id,
      },
      include: {
        business: true
      }
    });

    return NextResponse.json({ video });

  } catch (error) {
    console.error('Video creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
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

    // Get all videos for this business
    const videos = await prisma.video.findMany({
      where: { businessId: user.business.id },
      include: { business: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ videos });

  } catch (error) {
    console.error('Videos fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
