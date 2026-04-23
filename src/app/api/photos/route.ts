import { NextResponse } from 'next/server';
import { fetchPhotosFromFolder } from '@/lib/cloudinary';

export async function GET() {
  try {
    const photos = await fetchPhotosFromFolder('photos');
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Cloudinary API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos from Cloudinary', photos: [] },
      { status: 500 }
    );
  }
}
