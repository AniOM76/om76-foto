import PhotoGallery from '@/components/gallery/PhotoGallery';
import { sampleGalleryPhotos } from '@/lib/sampleData';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            OM76 Photo Portfolio
          </h1>
          <p className="mt-2 text-gray-600">
            A showcase of photography and visual storytelling
          </p>
        </div>
      </header>

      {/* Main Gallery */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhotoGallery photos={sampleGalleryPhotos} columns={4} gap={16} />
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
