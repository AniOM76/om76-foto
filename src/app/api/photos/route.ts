import { NextResponse } from 'next/server';
// import { fetchAllUserContent } from '@/lib/fetchUserContent';

// Temporary mock data to test deployment without Cloudinary
const mockPhotos = [
  {
    publicId: 'sample-1',
    title: 'Sample Photo 1',
    description: 'This is a test photo to verify the app works',
    category: 'test',
    tags: ['test', 'sample'],
    width: 1200,
    height: 800,
    aspectRatio: 1.5,
    createdAt: '2024-01-15T10:30:00Z',
    alt: 'Sample test photo'
  },
  {
    publicId: 'sample-2',
    title: 'Sample Photo 2',
    description: 'Another test photo for the gallery',
    category: 'test',
    tags: ['test', 'sample'],
    width: 800,
    height: 1200,
    aspectRatio: 0.67,
    createdAt: '2024-01-14T16:45:00Z',
    alt: 'Another sample test photo'
  }
];

export async function GET() {
  try {
    // Temporarily bypassing Cloudinary to test deployment
    // const content = await fetchAllUserContent();
    
    // Return mock data instead
    const content = {
      photos: mockPhotos,
      videos: []
    };
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos', photos: [], videos: [] },
      { status: 500 }
    );
  }
}
