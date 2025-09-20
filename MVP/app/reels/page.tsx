'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocationStore } from '@/lib/store/location';
import VideoReel from '@/components/VideoReel';
import { Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';
import { VideoWithBusiness } from '@/lib/db';
import { haversineDistance } from '@/lib/geo';

export default function ReelsPage() {
  const { userLocation, radiusMi } = useLocationStore();
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [filteredVideos, setFilteredVideos] = useState<VideoWithBusiness[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter and sort videos based on location and radius
  useEffect(() => {
    if (!userLocation) {
      setFilteredVideos([]);
      return;
    }

    const filtered = videos
      .filter(video => {
        // Only include videos with valid business coordinates
        if (!video.business.lat || !video.business.lng) return false;
        
        // Calculate distance and filter by radius
        const distance = haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          video.business.lat,
          video.business.lng
        );
        
        return distance <= radiusMi;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

    setFilteredVideos(filtered);
    setCurrentVideoIndex(0); // Reset to first video when filters change
  }, [videos, userLocation, radiusMi]);

  // Handle scroll to change videos
  const handleScroll = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (filteredVideos.length === 0) return;

    if (e.deltaY > 0 && currentVideoIndex < filteredVideos.length - 1) {
      // Scroll down - next video
      setCurrentVideoIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      // Scroll up - previous video
      setCurrentVideoIndex(prev => prev - 1);
    }
  }, [currentVideoIndex, filteredVideos.length]);

  // Handle touch events for mobile swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentVideoIndex < filteredVideos.length - 1) {
      // Swipe up - next video
      setCurrentVideoIndex(prev => prev + 1);
    } else if (isRightSwipe && currentVideoIndex > 0) {
      // Swipe down - previous video
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  // Add/remove scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleScroll);
    };
  }, [handleScroll]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredVideos.length === 0) return;

      if (e.key === 'ArrowDown' && currentVideoIndex < filteredVideos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, filteredVideos.length]);

  const handleVideoAction = (action: string, videoId: string) => {
    console.log(`${action} on video ${videoId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Body className="text-white">Loading videos...</Body>
      </div>
    );
  }

  // No location set state
  if (!userLocation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">📍</div>
          <Body className="text-xl text-white">
            Tap the left button to set your location
          </Body>
          <Body className="text-white/80">
            We need your location to show you videos from nearby businesses in your area.
          </Body>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => {
              // The left toolbar button will handle this
              window.dispatchEvent(new Event('requestLocation'));
            }}
          >
            <LocateFixed className="w-4 h-4 mr-2" />
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  // No videos in range state
  if (filteredVideos.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">🎥</div>
          <Body className="text-xl text-white">
            No videos in your area
          </Body>
          <Body className="text-white/80">
            Try increasing your search radius to {radiusMi + 5} miles to discover more content.
          </Body>
          <Body className="text-white/60 text-sm">
            Currently searching within {radiusMi} miles of your location.
          </Body>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden bg-black relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Container */}
      <div 
        className="flex flex-col h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(-${currentVideoIndex * 100}vh)`
        }}
      >
        {filteredVideos.map((video, index) => (
          <div key={video.id} className="h-screen flex-shrink-0">
            <VideoReel
              video={video}
              isVisible={index === currentVideoIndex}
              onLike={(videoId) => handleVideoAction('like', videoId)}
              onComment={(videoId) => handleVideoAction('comment', videoId)}
              onShare={(videoId) => handleVideoAction('share', videoId)}
            />
          </div>
        ))}
      </div>

      {/* Video Counter */}
      <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
        <Body className="text-white text-sm">
          {currentVideoIndex + 1} / {filteredVideos.length}
        </Body>
      </div>

      {/* Navigation Hints (only show on first video) */}
      {currentVideoIndex === 0 && filteredVideos.length > 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm animate-pulse">
            <Body className="text-white text-xs">
              Scroll or swipe ↕️
            </Body>
          </div>
        </div>
      )}
    </div>
  );
}
