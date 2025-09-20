'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  title: string;
  isVisible: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const getYouTubeEmbedUrl = (url: string): string => {
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('youtube.com/watch?v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&showinfo=0&modestbranding=1`;
};

const isVideoFile = (url: string): boolean => {
  return url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') || url.includes('.mov');
};

export default function VideoPlayer({
  url,
  thumbnail,
  title,
  isVisible,
  autoPlay = false,
  muted = true,
  className
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-play when visible
  useEffect(() => {
    if (isVisible && autoPlay) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isVisible, autoPlay]);

  // Handle video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const handleVideoClick = () => {
    if (isVideoFile(url)) {
      setIsPlaying(!isPlaying);
    }
    
    // Show controls temporarily
    setShowControls(true);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Hide controls after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // YouTube iframe
  if (isYouTubeUrl(url)) {
    return (
      <div className={cn("relative w-full h-full bg-black", className)}>
        <iframe
          src={isVisible ? getYouTubeEmbedUrl(url) : 'about:blank'}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* YouTube doesn't allow external controls, so we show a simple overlay */}
        <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
          <span className="text-white text-xs">YouTube</span>
        </div>
      </div>
    );
  }

  // Native video player for MP4 and other video files
  if (isVideoFile(url)) {
    return (
      <div 
        className={cn("relative w-full h-full bg-black cursor-pointer", className)}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={url}
          poster={thumbnail}
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Video Controls Overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}>
          {/* Play/Pause Button */}
          {!isPlaying && (
            <div className="bg-black/60 rounded-full p-4">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          )}
        </div>
        
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={cn(
            "absolute top-4 right-4 bg-black/60 rounded-full p-2 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    );
  }

  // Fallback for other URLs - show as iframe
  return (
    <div className={cn("relative w-full h-full bg-black", className)}>
      <iframe
        src={url}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
        <span className="text-white text-xs">External</span>
      </div>
    </div>
  );
}
