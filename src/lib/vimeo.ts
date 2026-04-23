import type {
  VimeoApiResponse,
  VimeoApiVideo,
  VimeoPicture,
  VimeoVideo,
} from '@/types/vimeo';

const VIMEO_API_BASE = 'https://api.vimeo.com';

function pickSize(sizes: VimeoPicture[], targetWidth: number): string {
  if (sizes.length === 0) return '';
  const sorted = [...sizes].sort((a, b) => a.width - b.width);
  const match = sorted.find((s) => s.width >= targetWidth);
  return (match ?? sorted[sorted.length - 1]).link;
}

function transformVideo(v: VimeoApiVideo): VimeoVideo {
  const id = v.uri.split('/').pop() ?? '';
  const sizes = v.pictures?.sizes ?? [];
  return {
    id,
    title: v.name,
    description: v.description,
    duration: v.duration,
    width: v.width,
    height: v.height,
    aspectRatio: v.height > 0 ? v.width / v.height : 16 / 9,
    embedUrl: v.player_embed_url,
    thumbnail: {
      small: pickSize(sizes, 400),
      medium: pickSize(sizes, 800),
      large: pickSize(sizes, 1600),
    },
  };
}

export async function fetchShowcaseVideos(): Promise<VimeoVideo[]> {
  const token = process.env.VIMEO_ACCESS_TOKEN;
  const showcaseId = process.env.VIMEO_SHOWCASE_ID;

  if (!token || !showcaseId) {
    throw new Error(
      'Missing Vimeo configuration: VIMEO_ACCESS_TOKEN and VIMEO_SHOWCASE_ID required'
    );
  }

  const url = new URL(`${VIMEO_API_BASE}/me/albums/${showcaseId}/videos`);
  url.searchParams.set('per_page', '100');
  url.searchParams.set('sort', 'manual');
  url.searchParams.set(
    'fields',
    'uri,name,description,duration,width,height,player_embed_url,pictures.sizes'
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vimeo API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as VimeoApiResponse;
  return json.data.map(transformVideo);
}
