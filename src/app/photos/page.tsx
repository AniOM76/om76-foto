'use client';

import { useEffect, useState } from 'react';
import PhotoGallery from '@/components/gallery/PhotoGallery';
import Navigation from '@/components/navigation/Navigation';
import { createGalleryPhoto } from '@/lib/cloudinaryClient';
import type { PhotoData, GalleryPhoto } from '@/types/image';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }
        if (data.photos) {
          setPhotos(
            data.photos.map((p: PhotoData) => createGalleryPhoto(p))
          );
        }
      } catch (err) {
        console.error('Error fetching photos:', err);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-4">
          <PhotoGallery photos={photos} columns={4} gap={16} />
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
