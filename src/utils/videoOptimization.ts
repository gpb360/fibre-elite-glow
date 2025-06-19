/**
 * Video Optimization Utilities
 * 
 * Provides performance optimization features for video loading and playback
 */

export interface VideoOptimizationConfig {
  enableLazyLoading: boolean;
  enableBandwidthDetection: boolean;
  enablePreloading: boolean;
  maxConcurrentVideos: number;
  qualityThresholds: {
    high: number; // Mbps
    medium: number; // Mbps
    low: number; // Mbps
  };
}

export interface ConnectionInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

export interface VideoQuality {
  width: number;
  height: number;
  bitrate: number;
  format: 'mp4' | 'webm';
}

export class VideoOptimizer {
  private config: VideoOptimizationConfig;
  private activeVideos: Set<HTMLVideoElement> = new Set();
  private intersectionObserver?: IntersectionObserver;
  private connectionInfo: ConnectionInfo;

  constructor(config: Partial<VideoOptimizationConfig> = {}) {
    this.config = {
      enableLazyLoading: true,
      enableBandwidthDetection: true,
      enablePreloading: false,
      maxConcurrentVideos: 3,
      qualityThresholds: {
        high: 5, // 5 Mbps
        medium: 2, // 2 Mbps
        low: 0.5 // 0.5 Mbps
      },
      ...config
    };

    this.connectionInfo = this.detectConnection();
    this.setupIntersectionObserver();
  }

  // Detect network connection information
  private detectConnection(): ConnectionInfo {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 1,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false
      };
    }

    // Fallback for browsers without Network Information API
    return {
      effectiveType: 'unknown',
      downlink: 2, // Assume medium connection
      rtt: 100,
      saveData: false
    };
  }

  // Setup intersection observer for lazy loading
  private setupIntersectionObserver(): void {
    if (!this.config.enableLazyLoading || !('IntersectionObserver' in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            this.loadVideo(video);
            this.intersectionObserver?.unobserve(video);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );
  }

  // Determine optimal video quality based on connection
  getOptimalQuality(availableQualities: VideoQuality[]): VideoQuality {
    const { downlink, saveData, effectiveType } = this.connectionInfo;

    // If user has data saver enabled, use lowest quality
    if (saveData) {
      return availableQualities.reduce((lowest, current) => 
        current.bitrate < lowest.bitrate ? current : lowest
      );
    }

    // Determine quality based on connection speed
    let targetBitrate: number;
    
    if (downlink >= this.config.qualityThresholds.high || effectiveType === '4g') {
      targetBitrate = Math.max(...availableQualities.map(q => q.bitrate));
    } else if (downlink >= this.config.qualityThresholds.medium || effectiveType === '3g') {
      targetBitrate = availableQualities
        .filter(q => q.height <= 720)
        .reduce((max, current) => Math.max(max, current.bitrate), 0);
    } else {
      targetBitrate = availableQualities
        .filter(q => q.height <= 480)
        .reduce((max, current) => Math.max(max, current.bitrate), 0);
    }

    // Find closest quality to target bitrate
    return availableQualities.reduce((best, current) => {
      const bestDiff = Math.abs(best.bitrate - targetBitrate);
      const currentDiff = Math.abs(current.bitrate - targetBitrate);
      return currentDiff < bestDiff ? current : best;
    });
  }

  // Get optimal video source based on browser support and quality
  getOptimalVideoSource(sources: { src: string; type: string; quality?: VideoQuality }[]): string {
    const video = document.createElement('video');
    
    // Filter sources by browser support
    const supportedSources = sources.filter(source => {
      return video.canPlayType(source.type) !== '';
    });

    if (supportedSources.length === 0) {
      return sources[0]?.src || '';
    }

    // If quality information is available, select optimal quality
    const sourcesWithQuality = supportedSources.filter(s => s.quality);
    if (sourcesWithQuality.length > 0) {
      const optimalQuality = this.getOptimalQuality(sourcesWithQuality.map(s => s.quality!));
      const optimalSource = sourcesWithQuality.find(s => s.quality === optimalQuality);
      if (optimalSource) {
        return optimalSource.src;
      }
    }

    // Prefer MP4 for compatibility, then WebM for efficiency
    const mp4Source = supportedSources.find(s => s.type.includes('mp4'));
    if (mp4Source) return mp4Source.src;

    const webmSource = supportedSources.find(s => s.type.includes('webm'));
    if (webmSource) return webmSource.src;

    return supportedSources[0].src;
  }

  // Setup lazy loading for a video element
  setupLazyLoading(video: HTMLVideoElement): void {
    if (!this.config.enableLazyLoading || !this.intersectionObserver) {
      this.loadVideo(video);
      return;
    }

    // Store original src and remove it to prevent immediate loading
    const originalSrc = video.src;
    if (originalSrc) {
      video.dataset.src = originalSrc;
      video.removeAttribute('src');
    }

    this.intersectionObserver.observe(video);
  }

  // Load video with optimization
  private loadVideo(video: HTMLVideoElement): void {
    const src = video.dataset.src || video.src;
    if (!src) return;

    // Check if we've reached the concurrent video limit
    if (this.activeVideos.size >= this.config.maxConcurrentVideos) {
      // Pause oldest video to make room
      const oldestVideo = this.activeVideos.values().next().value;
      if (oldestVideo) {
        oldestVideo.pause();
        this.activeVideos.delete(oldestVideo);
      }
    }

    // Set up video loading with error handling
    video.addEventListener('loadstart', () => {
      this.activeVideos.add(video);
    });

    video.addEventListener('error', () => {
      this.activeVideos.delete(video);
      this.handleVideoError(video);
    });

    video.addEventListener('ended', () => {
      this.activeVideos.delete(video);
    });

    // Apply connection-based optimizations
    this.applyConnectionOptimizations(video);

    // Load the video
    video.src = src;
    video.load();
  }

  // Apply optimizations based on connection quality
  private applyConnectionOptimizations(video: HTMLVideoElement): void {
    const { effectiveType, saveData } = this.connectionInfo;

    // Adjust preload strategy based on connection
    if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
      video.preload = 'none';
    } else if (effectiveType === '3g') {
      video.preload = 'metadata';
    } else {
      video.preload = this.config.enablePreloading ? 'auto' : 'metadata';
    }

    // Disable autoplay on slow connections
    if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
      video.autoplay = false;
    }
  }

  // Handle video loading errors
  private handleVideoError(video: HTMLVideoElement): void {
    console.warn('Video loading failed:', video.src);
    
    // Try to show poster image if available
    if (video.poster) {
      const img = document.createElement('img');
      img.src = video.poster;
      img.alt = 'Video thumbnail';
      img.className = video.className;
      img.style.cssText = video.style.cssText;
      
      video.parentNode?.replaceChild(img, video);
    }
  }

  // Preload critical videos
  preloadCriticalVideos(videoSources: string[]): void {
    if (!this.config.enablePreloading) return;

    const { effectiveType, saveData } = this.connectionInfo;
    
    // Only preload on good connections
    if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
      return;
    }

    videoSources.forEach((src, index) => {
      // Limit preloading to avoid overwhelming the connection
      if (index >= 2) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // Monitor video performance
  monitorVideoPerformance(video: HTMLVideoElement): Promise<VideoPerformanceMetrics> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      let firstFrameTime: number | null = null;
      let loadedTime: number | null = null;

      const handleLoadedData = () => {
        if (!firstFrameTime) {
          firstFrameTime = performance.now() - startTime;
        }
      };

      const handleCanPlay = () => {
        if (!loadedTime) {
          loadedTime = performance.now() - startTime;
          
          resolve({
            loadTime: loadedTime,
            firstFrameTime: firstFrameTime || loadedTime,
            videoSize: video.videoWidth * video.videoHeight,
            duration: video.duration,
            buffered: video.buffered.length > 0 ? video.buffered.end(0) : 0
          });
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);

      // Cleanup listeners after 10 seconds
      setTimeout(() => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
      }, 10000);
    });
  }

  // Get current connection info
  getConnectionInfo(): ConnectionInfo {
    return { ...this.connectionInfo };
  }

  // Update configuration
  updateConfig(newConfig: Partial<VideoOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Cleanup resources
  destroy(): void {
    this.intersectionObserver?.disconnect();
    this.activeVideos.clear();
  }
}

export interface VideoPerformanceMetrics {
  loadTime: number;
  firstFrameTime: number;
  videoSize: number;
  duration: number;
  buffered: number;
}

// Export singleton instance
export const videoOptimizer = new VideoOptimizer();

// Utility functions
export const getVideoFormat = (src: string): 'mp4' | 'webm' | 'ogg' | 'unknown' => {
  const extension = src.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'mp4':
    case 'm4v':
      return 'mp4';
    case 'webm':
      return 'webm';
    case 'ogg':
    case 'ogv':
      return 'ogg';
    default:
      return 'unknown';
  }
};

export const isVideoSupported = (format: string): boolean => {
  const video = document.createElement('video');
  return video.canPlayType(format) !== '';
};

export const estimateVideoSize = (duration: number, quality: VideoQuality): number => {
  // Rough estimation: bitrate * duration / 8 (convert bits to bytes)
  return (quality.bitrate * 1000 * duration) / 8;
};
