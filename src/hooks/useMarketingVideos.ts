import { useState, useEffect } from 'react';

export interface MarketingVideo {
  id: string;
  title: string;
  src: string;
  poster?: string;
  usage: string;
  duration?: string;
  fileSize?: string;
  originalName?: string;
  description?: string;
}

export interface VideoConfig {
  videos: MarketingVideo[];
  downloadedAt: string;
  totalVideos: number;
  notes?: string;
}

// Fallback video data in case config file is not available
const FALLBACK_VIDEOS: MarketingVideo[] = [
  {
    id: 'generic-edit',
    title: 'Main promotional video',
    src: '/videos/marketing/generic-edit.mp4',
    poster: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
    usage: 'Hero section background/featured video',
    duration: '2:30',
    description: 'Professional promotional video showcasing Total Essential benefits and features'
  },
  {
    id: 'happy-customers',
    title: 'Customer testimonials',
    src: '/videos/marketing/happy-customers.mp4',
    poster: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
    usage: 'Testimonials section',
    duration: '1:45',
    description: 'Real customer testimonials and success stories'
  },
  {
    id: 'ingredients',
    title: 'Product ingredients showcase',
    src: '/videos/marketing/ingredients.mp4',
    poster: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
    usage: 'Product showcase section',
    duration: '1:20',
    description: 'Detailed showcase of natural ingredients and their benefits'
  },
  {
    id: 'stylish-result',
    title: 'Results demonstration',
    src: '/videos/marketing/stylish-result.mp4',
    poster: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
    usage: 'Health section and product showcase',
    duration: '2:00',
    description: 'Visual demonstration of health and wellness results'
  },
  {
    id: 'open-box-vo',
    title: 'Unboxing with voiceover',
    src: '/videos/marketing/open-box-vo.mp4',
    poster: '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
    usage: 'Product pages',
    duration: '2:15',
    description: 'Professional unboxing experience with detailed product presentation'
  }
];

export function useMarketingVideos() {
  const [videos, setVideos] = useState<MarketingVideo[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideoConfig = async () => {
      try {
        const response = await fetch('/videos/marketing/video-config.json');
        if (response.ok) {
          const config: VideoConfig = await response.json();
          setVideos(config.videos);
        } else {
          // Use fallback videos if config file is not found
          console.warn('Video config not found, using fallback videos');
          setVideos(FALLBACK_VIDEOS);
        }
      } catch (err) {
        console.warn('Failed to load video config, using fallback videos:', err);
        setVideos(FALLBACK_VIDEOS);
        setError('Failed to load video configuration');
      } finally {
        setLoading(false);
      }
    };

    loadVideoConfig();
  }, []);

  // Helper functions to get videos by usage
  const getVideoByUsage = (usage: string): MarketingVideo | undefined => {
    return videos.find(video => video.usage.toLowerCase().includes(usage.toLowerCase()));
  };

  const getVideosByUsage = (usage: string): MarketingVideo[] => {
    return videos.filter(video => video.usage.toLowerCase().includes(usage.toLowerCase()));
  };

  const getVideoById = (id: string): MarketingVideo | undefined => {
    return videos.find(video => video.id === id);
  };

  // Specific video getters for common use cases
  const heroVideo = getVideoByUsage('hero');
  const testimonialsVideo = getVideoByUsage('testimonials');
  const ingredientsVideo = getVideoByUsage('ingredients');
  const resultsVideo = getVideoByUsage('stylish result');
  const unboxingVideo = getVideoByUsage('product pages');
  const showcaseVideos = getVideosByUsage('showcase');

  return {
    videos,
    loading,
    error,
    getVideoByUsage,
    getVideosByUsage,
    getVideoById,
    // Convenience getters
    heroVideo,
    testimonialsVideo,
    ingredientsVideo,
    resultsVideo,
    unboxingVideo,
    showcaseVideos,
  };
}

export default useMarketingVideos;
