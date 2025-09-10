'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { GalleryPhoto } from '@/types/image';

interface MasonryGalleryProps {
  photos: GalleryPhoto[];
  columns?: number;
  gap?: number;
  onPhotoClick?: (photo: GalleryPhoto, index: number) => void;
}

interface PhotoPosition {
  photo: GalleryPhoto;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function MasonryGallery({
  photos,
  columns = 3,
  gap = 16,
  onPhotoClick,
}: MasonryGalleryProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [photoPositions, setPhotoPositions] = useState<PhotoPosition[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate responsive columns based on screen width
  const getResponsiveColumns = useCallback(
    (width: number) => {
      if (width < 640) return 2; // mobile
      if (width < 1024) return 3; // tablet
      return columns; // desktop
    },
    [columns]
  );

  // Masonry layout algorithm
  const calculateLayout = useCallback(() => {
    if (!containerWidth || photos.length === 0) return;

    const responsiveColumns = getResponsiveColumns(containerWidth);
    const columnWidth =
      (containerWidth - gap * (responsiveColumns - 1)) / responsiveColumns;

    // Track the height of each column
    const columnHeights = new Array(responsiveColumns).fill(0);
    const positions: PhotoPosition[] = [];

    photos.forEach((photo, index) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );

      // Calculate photo dimensions maintaining aspect ratio
      const photoWidth = columnWidth;
      const photoHeight = photoWidth / photo.aspectRatio;

      // Calculate position
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = columnHeights[shortestColumnIndex];

      positions.push({
        photo,
        index,
        x,
        y,
        width: photoWidth,
        height: photoHeight,
      });

      // Update column height
      columnHeights[shortestColumnIndex] += photoHeight + gap;
    });

    setPhotoPositions(positions);
    setContainerHeight(Math.max(...columnHeights) - gap);
  }, [containerWidth, photos, gap, getResponsiveColumns]);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('masonry-container');
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recalculate layout when dependencies change
  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return (
    <div className="w-full">
      <div
        id="masonry-container"
        className="relative w-full"
        style={{ height: containerHeight }}
      >
        {photoPositions.map(({ photo, index, x, y, width, height }) => (
          <motion.div
            key={photo.publicId}
            className="absolute cursor-pointer group"
            style={{
              left: x,
              top: y,
              width,
              height,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            onClick={() => onPhotoClick?.(photo, index)}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={photo.urls.medium}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-xs opacity-90 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
