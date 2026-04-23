'use client';

import { useState } from 'react';
import VideoMasonry from './VideoMasonry';
import VideoLightbox from './VideoLightbox';
import type { VimeoVideo } from '@/types/vimeo';

interface VideoGalleryProps {
  videos: VimeoVideo[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function VideoGallery({
  videos,
  columns = 3,
  gap = 16,
  className = '',
}: VideoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (videos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No videos to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <VideoMasonry
        videos={videos}
        columns={columns}
        gap={gap}
        onVideoClick={(_, index) => {
          setSelectedIndex(index);
          setLightboxOpen(true);
        }}
      />
      <VideoLightbox
        videos={videos}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
