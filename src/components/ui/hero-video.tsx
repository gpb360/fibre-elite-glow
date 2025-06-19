import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  overlay?: React.ReactNode;
  showPlayButton?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export function HeroVideo({
  src,
  poster,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  overlay,
  showPlayButton = true,
  onPlay,
  onPause,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(() => {
          // Autoplay failed, which is common on mobile
          setIsPlaying(false);
        });
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay, onPlay, onPause]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {
        // Handle play failure
        console.warn('Video play failed');
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (hasError) {
    return (
      <div className={cn(
        'relative w-full h-full bg-gray-900 flex items-center justify-center',
        className
      )}>
        {poster ? (
          <img
            src={poster}
            alt="Video fallback"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-center">
            <p>Unable to load video</p>
          </div>
        )}
        {overlay}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden group', className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        muted={isMuted}
        loop={loop}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Overlay */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {showPlayButton && (
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleMute}
          className="bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}

export default HeroVideo;
