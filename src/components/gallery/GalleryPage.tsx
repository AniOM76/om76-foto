'use client';

import { useState, useEffect } from 'react';
import PhotoGallery from './PhotoGallery';
import Navigation from '@/components/navigation/Navigation';
import { createGalleryPhoto, buildVideoUrl, buildImageUrl } from '@/lib/cloudinaryClient';
import type { PhotoData, GalleryPhoto } from '@/types/image';
import type { VideoData } from '@/types/cloudinary';

interface GalleryPageProps {
  category?: string; // undefined for Gallery (shows gallery-featured), otherwise folder name
}

export default function GalleryPage({ category }: GalleryPageProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);

  // Remove unused variables for now since we removed the header
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const url = category 
          ? `/api/photos?category=${category}` 
          : '/api/photos?category=gallery';
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
          console.error('API Error:', data.error);
          return;
        }

        if (data.photos && data.photos.length > 0) {
          const galleryPhotos = data.photos.map((photo: PhotoData) =>
            createGalleryPhoto(photo)
          );
          setPhotos(galleryPhotos);
        }

        if (data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      }
    };

    fetchContent();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main content area with sidebar offset */}
      <div className="lg:pl-64">
        {/* Main Gallery */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-4">
        <PhotoGallery photos={photos} columns={4} gap={16} />

        {/* Videos section (if any) */}
        {videos.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.publicId}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <video
                    className="w-full h-48 object-cover"
                    controls
                    preload="metadata"
                    poster={buildImageUrl(video.publicId, {
                      width: 400,
                      height: 300,
                      crop: 'fill',
                      format: 'jpg'
                    })}
                  >
                    <source
                      src={buildVideoUrl(video.publicId, {
                        width: 3840,
                        quality: 'auto',
                        format: 'mp4'
                      })}
                      type="video/mp4"
                    />
                    <source
                      src={buildVideoUrl(video.publicId, {
                        width: 3840,
                        quality: 'auto',
                        format: 'webm'
                      })}
                      type="video/webm"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {video.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Duration: {Math.round(video.duration)}s | {video.width}×
                      {video.height}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-4">
            <p className="text-center text-gray-500 text-sm">
              © 2024 600D Photography. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}