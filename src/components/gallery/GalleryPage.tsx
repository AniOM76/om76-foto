'use client';

import { useState, useEffect } from 'react';
import PhotoGallery from './PhotoGallery';
import Navigation from '@/components/navigation/Navigation';
import { createGalleryPhoto, buildVideoUrl } from '@/lib/cloudinaryClient';
import type { PhotoData, GalleryPhoto } from '@/types/image';
import type { VideoData } from '@/types/cloudinary';

interface GalleryPageProps {
  title: string;
  description: string;
  category?: string; // undefined for Gallery (shows gallery-featured), otherwise folder name
}

export default function GalleryPage({ title, description, category }: GalleryPageProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError('Failed to load content. Please check your connection.');
          return;
        }

        if (data.photos && data.photos.length > 0) {
          const galleryPhotos = data.photos.map((photo: PhotoData) =>
            createGalleryPhoto(photo)
          );
          setPhotos(galleryPhotos);
          setError(null);
        } else {
          setError(`No photos found in ${title.toLowerCase()}.`);
        }

        if (data.videos) {
          setVideos(data.videos);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to connect to content service. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [category, title]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{description}</p>

          {/* Status indicator */}
          <div className="mt-4">
            {loading ? (
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                Loading content...
              </div>
            ) : error ? (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                ⚠️ {error}
              </div>
            ) : (
              <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                ✅ Loaded {photos.length} photos
                {videos.length > 0 ? ` and ${videos.length} videos` : ''}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    poster={`https://res.cloudinary.com/dour8cpte/image/upload/w_400,h_300,c_fill,f_jpg/v1/${video.publicId}.jpg`}
                  >
                    <source
                      src={buildVideoUrl(video.publicId, { 
                        width: 800, 
                        quality: 'auto', 
                        format: 'mp4' 
                      })}
                      type="video/mp4"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 OM76 Photography. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}