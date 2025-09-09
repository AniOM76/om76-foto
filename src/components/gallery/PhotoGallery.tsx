'use client';

import { useState } from 'react';
import MasonryGallery from './MasonryGallery';
import Lightbox from '../lightbox/Lightbox';
import type { GalleryPhoto } from '@/types/image';

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  columns?: number;
  gap?: number;
  className?: string;
}

export default function PhotoGallery({
  photos,
  columns = 3,
  gap = 16,
  className = '',
}: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handlePhotoClick = (photo: GalleryPhoto, index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  if (photos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No photos to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MasonryGallery
        photos={photos}
        columns={columns}
        gap={gap}
        onPhotoClick={handlePhotoClick}
      />

      <Lightbox
        photos={photos}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
