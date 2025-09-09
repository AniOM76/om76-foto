import { NextResponse } from 'next/server';
import { fetchAllUserContent } from '@/lib/fetchUserContent';

export async function GET() {
  try {
    const content = await fetchAllUserContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos', photos: [], videos: [] },
      { status: 500 }
    );
  }
}
