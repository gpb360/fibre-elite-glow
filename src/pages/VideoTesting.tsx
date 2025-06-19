import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoTestingDashboard from '@/components/VideoTestingDashboard';

const VideoTesting = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <VideoTestingDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default VideoTesting;
