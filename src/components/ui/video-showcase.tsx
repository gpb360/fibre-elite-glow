'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { VideoPlayer } from './video-player';
import { Button } from './button';
import { Badge } from './badge';
import { Play } from 'lucide-react';

interface VideoShowcaseProps {
  videos: {
    id: string;
    title: string;
    description?: string;
    src: string;
    poster?: string;
    badge?: string;
    duration?: string;
  }[];
  className?: string;
  layout?: 'grid' | 'carousel' | 'tabs';
  autoPlay?: boolean;
  showTitles?: boolean;
}

export function VideoShowcase({
  videos,
  className,
  layout = 'grid',
  autoPlay = false,
  showTitles = true,
}: VideoShowcaseProps) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleVideoPlay = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  if (layout === 'tabs') {
    return (
      <div className={cn('w-full', className)}>
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {videos.map((video, index) => (
            <Button
              key={video.id}
              variant={activeVideo === index ? 'default' : 'ghost'}
              onClick={() => setActiveVideo(index)}
              className="mb-2"
            >
              {video.title}
              {video.duration && (
                <span className="ml-2 text-xs opacity-70">
                  {video.duration}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Active Video */}
        <div className="relative">
          <VideoPlayer
            src={videos[activeVideo].src}
            poster={videos[activeVideo].poster}
            autoPlay={autoPlay}
            showCustomControls
            aspectRatio="video"
            className="w-full"
            onPlay={() => handleVideoPlay(videos[activeVideo].id)}
            onPause={handleVideoPause}
          />
          
          {videos[activeVideo].badge && (
            <Badge className="absolute top-4 left-4 bg-green-600 text-white">
              {videos[activeVideo].badge}
            </Badge>
          )}

          {showTitles && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">
                {videos[activeVideo].title}
              </h3>
              {videos[activeVideo].description && (
                <p className="text-gray-600">
                  {videos[activeVideo].description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex-none w-80 snap-start"
            >
              <div className="relative">
                <VideoPlayer
                  src={video.src}
                  poster={video.poster}
                  autoPlay={autoPlay && index === 0}
                  showCustomControls
                  aspectRatio="video"
                  className="w-full"
                  onPlay={() => handleVideoPlay(video.id)}
                  onPause={handleVideoPause}
                />
                
                {video.badge && (
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                    {video.badge}
                  </Badge>
                )}

                {video.duration && (
                  <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                )}
              </div>

              {showTitles && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm">
                      {video.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <div key={video.id} className="relative group">
            <VideoPlayer
              src={video.src}
              poster={video.poster}
              autoPlay={autoPlay && index === 0}
              showCustomControls
              aspectRatio="video"
              className="w-full"
              onPlay={() => handleVideoPlay(video.id)}
              onPause={handleVideoPause}
              overlay={
                playingVideo !== video.id && (
                  <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                )
              }
            />
            
            {video.badge && (
              <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                {video.badge}
              </Badge>
            )}

            {video.duration && (
              <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                {video.duration}
              </Badge>
            )}

            {showTitles && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-gray-600 text-sm">
                    {video.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoShowcase;
