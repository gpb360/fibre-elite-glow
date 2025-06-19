/**
 * Video Testing Suite
 * 
 * Comprehensive testing utilities for video components
 * Tests playback, performance, accessibility, and cross-browser compatibility
 */

export interface VideoTestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface VideoTestSuite {
  results: VideoTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
}

export class VideoTester {
  private results: VideoTestResult[] = [];

  // Test video element creation and basic properties
  async testVideoElementCreation(videoSrc: string): Promise<VideoTestResult> {
    const testName = 'Video Element Creation';
    
    try {
      const video = document.createElement('video');
      video.src = videoSrc;
      video.preload = 'metadata';
      
      const canPlay = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 5000);
        
        video.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          resolve(true);
        });
        
        video.addEventListener('error', () => {
          clearTimeout(timeout);
          resolve(false);
        });
      });

      const result: VideoTestResult = {
        testName,
        passed: canPlay,
        message: canPlay ? 'Video element created and metadata loaded successfully' : 'Failed to load video metadata',
        details: {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState
        },
        timestamp: new Date()
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result: VideoTestResult = {
        testName,
        passed: false,
        message: `Error creating video element: ${error}`,
        timestamp: new Date()
      };
      
      this.results.push(result);
      return result;
    }
  }

  // Test video format support
  testVideoFormatSupport(): VideoTestResult {
    const testName = 'Video Format Support';
    const video = document.createElement('video');
    
    const formats = {
      mp4: video.canPlayType('video/mp4'),
      webm: video.canPlayType('video/webm'),
      ogg: video.canPlayType('video/ogg')
    };

    const supportedFormats = Object.entries(formats)
      .filter(([_, support]) => support !== '')
      .map(([format, _]) => format);

    const result: VideoTestResult = {
      testName,
      passed: supportedFormats.length > 0,
      message: `Supported formats: ${supportedFormats.join(', ') || 'None'}`,
      details: formats,
      timestamp: new Date()
    };

    this.results.push(result);
    return result;
  }

  // Test autoplay capability
  async testAutoplaySupport(): Promise<VideoTestResult> {
    const testName = 'Autoplay Support';
    
    try {
      const video = document.createElement('video');
      video.muted = true;
      video.autoplay = true;
      video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAr1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAIAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwFkAAr/4QAYZ2QACqzZX4iIhAAAAwAEAAADAKA8SJZYAQAGaOvjyyLA/fj4AAAAABRidHJ0AAAAAAAEAAAABAAAAARzdHNzAAAAAAAAAAEAAAABAAAAFHN0dHMAAAAAAAAAAQAAAAEAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTcuODMuMTAw';
      
      document.body.appendChild(video);
      
      const playPromise = video.play();
      const autoplaySupported = await playPromise.then(() => true).catch(() => false);
      
      document.body.removeChild(video);

      const result: VideoTestResult = {
        testName,
        passed: autoplaySupported,
        message: autoplaySupported ? 'Autoplay is supported' : 'Autoplay is blocked or not supported',
        timestamp: new Date()
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result: VideoTestResult = {
        testName,
        passed: false,
        message: `Error testing autoplay: ${error}`,
        timestamp: new Date()
      };
      
      this.results.push(result);
      return result;
    }
  }

  // Test video loading performance
  async testVideoLoadingPerformance(videoSrc: string): Promise<VideoTestResult> {
    const testName = 'Video Loading Performance';
    
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      const startTime = performance.now();
      
      const loadTime = await new Promise<number>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 10000);
        
        video.addEventListener('loadedmetadata', () => {
          clearTimeout(timeout);
          const endTime = performance.now();
          resolve(endTime - startTime);
        });
        
        video.addEventListener('error', () => {
          clearTimeout(timeout);
          reject(new Error('Video load error'));
        });
        
        video.src = videoSrc;
      });

      const passed = loadTime < 3000; // Should load metadata within 3 seconds
      
      const result: VideoTestResult = {
        testName,
        passed,
        message: `Video metadata loaded in ${loadTime.toFixed(2)}ms`,
        details: { loadTime, threshold: 3000 },
        timestamp: new Date()
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result: VideoTestResult = {
        testName,
        passed: false,
        message: `Performance test failed: ${error}`,
        timestamp: new Date()
      };
      
      this.results.push(result);
      return result;
    }
  }

  // Test intersection observer for lazy loading
  testIntersectionObserverSupport(): VideoTestResult {
    const testName = 'Intersection Observer Support';
    
    const supported = 'IntersectionObserver' in window;
    
    const result: VideoTestResult = {
      testName,
      passed: supported,
      message: supported ? 'Intersection Observer is supported' : 'Intersection Observer is not supported',
      timestamp: new Date()
    };

    this.results.push(result);
    return result;
  }

  // Test video accessibility features
  testVideoAccessibility(): VideoTestResult {
    const testName = 'Video Accessibility Features';
    
    const video = document.createElement('video');
    const features = {
      controls: 'controls' in video,
      textTracks: 'textTracks' in video,
      tabIndex: video.tabIndex !== undefined,
      ariaLabel: video.setAttribute && video.getAttribute
    };

    const supportedFeatures = Object.entries(features)
      .filter(([_, supported]) => supported)
      .map(([feature, _]) => feature);

    const result: VideoTestResult = {
      testName,
      passed: supportedFeatures.length >= 3,
      message: `Accessibility features available: ${supportedFeatures.join(', ')}`,
      details: features,
      timestamp: new Date()
    };

    this.results.push(result);
    return result;
  }

  // Test device capabilities
  testDeviceCapabilities(): VideoTestResult {
    const testName = 'Device Capabilities';
    
    const capabilities = {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      hasTouch: 'ontouchstart' in window,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
    };

    const result: VideoTestResult = {
      testName,
      passed: true,
      message: 'Device capabilities detected',
      details: capabilities,
      timestamp: new Date()
    };

    this.results.push(result);
    return result;
  }

  // Run comprehensive test suite
  async runFullTestSuite(videoSrc?: string): Promise<VideoTestSuite> {
    console.log('🧪 Starting Video Testing Suite...\n');
    
    this.results = []; // Reset results
    
    // Basic tests
    this.testVideoFormatSupport();
    this.testIntersectionObserverSupport();
    this.testVideoAccessibility();
    this.testDeviceCapabilities();
    
    // Async tests
    await this.testAutoplaySupport();
    
    if (videoSrc) {
      await this.testVideoElementCreation(videoSrc);
      await this.testVideoLoadingPerformance(videoSrc);
    }

    // Calculate summary
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      successRate: 0
    };
    
    summary.successRate = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;

    return {
      results: this.results,
      summary
    };
  }

  // Generate test report
  generateReport(testSuite: VideoTestSuite): string {
    const { results, summary } = testSuite;
    
    let report = '📊 Video Testing Report\n';
    report += '='.repeat(50) + '\n\n';
    
    report += `📈 Summary:\n`;
    report += `   Total Tests: ${summary.total}\n`;
    report += `   Passed: ${summary.passed}\n`;
    report += `   Failed: ${summary.failed}\n`;
    report += `   Success Rate: ${summary.successRate.toFixed(1)}%\n\n`;
    
    report += `📋 Detailed Results:\n`;
    report += '-'.repeat(30) + '\n';
    
    results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      report += `${index + 1}. ${status} ${result.testName}\n`;
      report += `   ${result.message}\n`;
      if (result.details) {
        report += `   Details: ${JSON.stringify(result.details, null, 2)}\n`;
      }
      report += '\n';
    });
    
    return report;
  }
}

// Export singleton instance
export const videoTester = new VideoTester();
