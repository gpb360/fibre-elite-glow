import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { videoOptimizer, VideoPerformanceMetrics } from '@/utils/videoOptimization';

interface OptimizedVideoPlayerProps {
  sources: {
    src: string;
    type: string;
    quality?: {
      width: number;
      height: number;
      bitrate: number;
      format: 'mp4' | 'webm';
    };
  }[];
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  aspectRatio?: 'video' | 'square' | 'wide';
  overlay?: React.ReactNode;
  showCustomControls?: boolean;
  enableOptimization?: boolean;
  showPerformanceInfo?: boolean;
}

export function OptimizedVideoPlayer({
  sources,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  onPlay,
  onPause,
  onEnded,
  aspectRatio = 'video',
  overlay,
  showCustomControls = false,
  enableOptimization = true,
  showPerformanceInfo = false,
}: OptimizedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<VideoPerformanceMetrics | null>(null);
  const [connectionInfo, setConnectionInfo] = useState(videoOptimizer.getConnectionInfo());

  // Get optimal video source
  const optimalSource = enableOptimization 
    ? videoOptimizer.getOptimalVideoSource(sources)
    : sources[0]?.src || '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Setup optimization if enabled
    if (enableOptimization) {
      videoOptimizer.setupLazyLoading(video);
      setIsOptimized(true);

      // Monitor performance
      if (showPerformanceInfo) {
        videoOptimizer.monitorVideoPerformance(video).then(setPerformanceMetrics);
      }
    }

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [enableOptimization, showPerformanceInfo, onPlay, onPause, onEnded]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  const getConnectionIcon = () => {
    switch (connectionInfo.effectiveType) {
      case '4g':
        return <Wifi className="h-3 w-3 text-green-500" />;
      case '3g':
        return <Wifi className="h-3 w-3 text-yellow-500" />;
      case '2g':
      case 'slow-2g':
        return <WifiOff className="h-3 w-3 text-red-500" />;
      default:
        return <Wifi className="h-3 w-3 text-gray-500" />;
    }
  };

  const getQualityBadge = () => {
    if (!enableOptimization) return null;

    const quality = connectionInfo.effectiveType === '4g' ? 'HD' :
                   connectionInfo.effectiveType === '3g' ? 'SD' : 'Low';
    
    const variant = quality === 'HD' ? 'default' : 
                   quality === 'SD' ? 'secondary' : 'outline';

    return (
      <Badge variant={variant} className="text-xs">
        {quality}
      </Badge>
    );
  };

  if (hasError) {
    return (
      <div className={cn(
        'relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center',
        aspectRatioClasses[aspectRatio],
        className
      )}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Unable to load video</p>
          {poster && (
            <img
              src={poster}
              alt="Video thumbnail"
              className="mt-2 max-w-full max-h-32 object-cover rounded"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg bg-black group',
      aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        controls={controls && !showCustomControls}
        playsInline
      >
        {sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {/* Optimization Info */}
      {(isOptimized || showPerformanceInfo) && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOptimized && (
            <div className="flex items-center gap-1 bg-black/70 rounded px-2 py-1">
              {getConnectionIcon()}
              <span className="text-xs text-white">
                {connectionInfo.effectiveType.toUpperCase()}
              </span>
              {getQualityBadge()}
            </div>
          )}
          
          {performanceMetrics && showPerformanceInfo && (
            <div className="bg-black/70 rounded px-2 py-1 text-xs text-white">
              Load: {performanceMetrics.loadTime.toFixed(0)}ms
            </div>
          )}
        </div>
      )}

      {/* Overlay Content */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}

      {/* Custom Controls */}
      {showCustomControls && (
        <>
          {/* Play/Pause Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {!isPlaying && (
              <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                {connectionInfo.saveData && (
                  <Badge variant="outline" className="text-xs text-white border-white/30">
                    Data Saver
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OptimizedVideoPlayer;
