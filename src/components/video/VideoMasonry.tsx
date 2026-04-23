'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { VimeoVideo } from '@/types/vimeo';

interface VideoMasonryProps {
  videos: VimeoVideo[];
  columns?: number;
  gap?: number;
  onVideoClick?: (video: VimeoVideo, index: number) => void;
}

interface VideoPosition {
  video: VimeoVideo;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function VideoMasonry({
  videos,
  columns = 3,
  gap = 16,
  onVideoClick,
}: VideoMasonryProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [positions, setPositions] = useState<VideoPosition[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  const getResponsiveColumns = useCallback(
    (width: number) => {
      if (width < 640) return 1;
      if (width < 1024) return 2;
      return columns;
    },
    [columns]
  );

  const calculateLayout = useCallback(() => {
    if (!containerWidth || videos.length === 0) return;

    const responsiveColumns = getResponsiveColumns(containerWidth);
    const columnWidth =
      (containerWidth - gap * (responsiveColumns - 1)) / responsiveColumns;

    const columnHeights = new Array(responsiveColumns).fill(0);
    const next: VideoPosition[] = [];

    videos.forEach((video, index) => {
      const shortest = columnHeights.indexOf(Math.min(...columnHeights));
      const w = columnWidth;
      const h = w / video.aspectRatio;
      const x = shortest * (columnWidth + gap);
      const y = columnHeights[shortest];

      next.push({ video, index, x, y, width: w, height: h });
      columnHeights[shortest] += h + gap;
    });

    setPositions(next);
    setContainerHeight(Math.max(...columnHeights) - gap);
  }, [containerWidth, videos, gap, getResponsiveColumns]);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('video-masonry-container');
      if (container) setContainerWidth(container.offsetWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return (
    <div className="w-full">
      <div
        id="video-masonry-container"
        className="relative w-full"
        style={{ height: containerHeight }}
      >
        {positions.map(({ video, index, x, y, width, height }) => (
          <motion.div
            key={video.id}
            className="absolute cursor-pointer group"
            style={{ left: x, top: y, width, height }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            onClick={() => onVideoClick?.(video, index)}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={video.thumbnail.medium}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs opacity-80">
                    {formatDuration(video.duration)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
