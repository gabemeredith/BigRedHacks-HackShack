'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Body, Caption, Title } from '@/components/ui/typography';
import { VStack, HStack } from '@/components/ui/layout';
import VideoPlayer from './VideoPlayer';
import { VideoWithBusiness, categoryToString } from '@/lib/db';
import { useLocationStore } from '@/lib/store/location';
import { haversineDistance } from '@/lib/geo';

interface VideoReelProps {
  video: VideoWithBusiness;
  isVisible: boolean;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
}

export default function VideoReel({
  video,
  isVisible,
  onLike,
  onComment,
  onShare
}: VideoReelProps) {
  const { userLocation } = useLocationStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 50);

  // Calculate distance if user location is available
  const distance = userLocation && video.business.lat && video.business.lng
    ? haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        video.business.lat,
        video.business.lng
      )
    : null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(video.id);
  };

  const handleComment = () => {
    onComment?.(video.id);
  };

  const handleShare = () => {
    onShare?.(video.id);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player */}
      <VideoPlayer
        url={video.url}
        thumbnail={video.thumbUrl || undefined}
        title={video.title}
        isVisible={isVisible}
        autoPlay={isVisible}
        muted={true}
        className="absolute inset-0"
      />

      {/* Distance Chip - Top Left */}
      {distance !== null && (
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
            <MapPin className="w-3 h-3 text-white" />
            <Caption className="text-white font-medium">
              {distance.toFixed(1)} mi
            </Caption>
          </div>
        </div>
      )}

      {/* Content Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="relative p-6">
          <HStack className="items-end justify-between gap-4">
            {/* Content Info */}
            <VStack className="flex-1 gap-3 text-white">
              {/* Business and Category */}
              <VStack className="gap-1">
                <HStack className="items-center gap-2">
                  <Title className="text-white font-semibold text-lg">
                    {video.business.name}
                  </Title>
                  <div className="bg-white/20 rounded-full px-2 py-0.5">
                    <Caption className="text-white text-xs">
                      {categoryToString(video.business.category)}
                    </Caption>
                  </div>
                </HStack>
                
                {video.business.address && (
                  <HStack className="items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/80" />
                    <Caption className="text-white/80">
                      {video.business.address}
                    </Caption>
                  </HStack>
                )}
              </VStack>
              
              {/* Video Title */}
              <Body className="text-white text-base leading-snug">
                {video.title}
              </Body>
            </VStack>

            {/* Action Buttons */}
            <VStack className="items-center gap-6 flex-shrink-0">
              {/* Like Button */}
              <VStack className="items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none h-12 w-12"
                >
                  <Heart 
                    className={cn(
                      "w-6 h-6",
                      isLiked ? "fill-red-500 text-red-500" : "text-white"
                    )} 
                  />
                </Button>
                <Caption className="text-white text-center">
                  {likes}
                </Caption>
              </VStack>

              {/* Comment Button */}
              <VStack className="items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleComment}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none h-12 w-12"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </Button>
                <Caption className="text-white text-center">
                  {Math.floor(Math.random() * 100) + 10}
                </Caption>
              </VStack>

              {/* Share Button */}
              <VStack className="items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border-none h-12 w-12"
                >
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
              </VStack>
            </VStack>
          </HStack>
        </div>
      </div>
    </div>
  );
}
