import { NextResponse } from 'next/server';
import { fetchShowcaseVideos } from '@/lib/vimeo';

export async function GET() {
  try {
    const videos = await fetchShowcaseVideos();
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Vimeo API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos from Vimeo', videos: [] },
      { status: 500 }
    );
  }
}
