'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/navigation/Navigation';
import VideoGallery from '@/components/video/VideoGallery';
import type { VimeoVideo } from '@/types/vimeo';

export default function VideosPage() {
  const [videos, setVideos] = useState<VimeoVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }
        if (data.videos) setVideos(data.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-4">
          <VideoGallery videos={videos} columns={3} gap={16} />
        </main>
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-4">
            <p className="text-center text-gray-500 text-sm">
              © 2026 600D Photography. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
