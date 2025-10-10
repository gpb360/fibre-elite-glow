import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/ui/video-player';
import { useMarketingVideos } from '@/hooks/useMarketingVideos';
import { videoTester, VideoTestSuite, VideoTestResult } from '@/test/video-testing-suite';
import { Play, TestTube, CheckCircle, XCircle, AlertCircle, Download, Monitor, Smartphone, Wifi } from 'lucide-react';

export function VideoTestingDashboard() {
  const { videos, loading } = useMarketingVideos();
  const [testResults, setTestResults] = useState<VideoTestSuite | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0].src);
    }
  }, [videos, selectedVideo]);

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await videoTester.runFullTestSuite(selectedVideo);
      setTestResults(results);
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (passed: boolean) => {
    return (
      <Badge variant={passed ? 'default' : 'destructive'}>
        {passed ? 'PASS' : 'FAIL'}
      </Badge>
    );
  };

  const downloadReport = () => {
    if (!testResults) return;
    
    const report = videoTester.generateReport(testResults);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-test-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🎬 Video Testing Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive testing suite for video components and playback functionality
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Configuration
          </CardTitle>
          <CardDescription>
            Configure and run video compatibility and performance tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Test Video:</label>
            <select
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={loading}
            >
              {loading ? (
                <option>Loading videos...</option>
              ) : (
                videos.map((video) => (
                  <option key={video.id} value={video.src}>
                    {video.title} ({video.duration || 'Unknown duration'})
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={runTests}
              disabled={isRunningTests || !selectedVideo}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isRunningTests ? 'Running Tests...' : 'Run Test Suite'}
            </Button>
            
            {testResults && (
              <Button
                variant="outline"
                onClick={downloadReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Test Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.summary.total}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.summary.passed}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.summary.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.summary.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            {/* Overall Status */}
            <div className="text-center">
              {testResults.summary.successRate >= 80 ? (
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                  ✅ All Systems Go - Ready for Production
                </Badge>
              ) : testResults.summary.successRate >= 60 ? (
                <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
                  ⚠️ Some Issues Detected - Review Required
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">
                  ❌ Critical Issues - Not Ready for Production
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.passed)}
                      <h3 className="font-semibold">{result.testName}</h3>
                    </div>
                    {getStatusBadge(result.passed)}
                  </div>
                  
                  <p className="text-gray-700 mb-2">{result.message}</p>
                  
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Tested at: {result.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Preview */}
      {selectedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Preview & Manual Testing
            </CardTitle>
            <CardDescription>
              Test video playback manually and verify visual quality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <VideoPlayer
                src={selectedVideo}
                poster="/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp"
                showCustomControls={true}
                aspectRatio="video"
                className="w-full"
              />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm">Desktop Ready</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Mobile Optimized</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Bandwidth Adaptive</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Manual Testing Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Desktop Testing</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Video loads and plays smoothly</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Custom controls work properly</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Fullscreen mode functions</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Keyboard navigation works</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Volume controls respond</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Mobile Testing</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Touch controls are responsive</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Video scales properly</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Autoplay policy respected</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Battery usage is reasonable</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Orientation changes handled</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VideoTestingDashboard;
