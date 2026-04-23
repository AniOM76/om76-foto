export interface VimeoPicture {
  width: number;
  height: number;
  link: string;
}

export interface VimeoApiVideo {
  uri: string;
  name: string;
  description: string | null;
  duration: number;
  width: number;
  height: number;
  player_embed_url: string;
  pictures: {
    sizes: VimeoPicture[];
  };
}

export interface VimeoApiResponse {
  total: number;
  page: number;
  per_page: number;
  paging: {
    next: string | null;
    previous: string | null;
    first: string;
    last: string;
  };
  data: VimeoApiVideo[];
}

export interface VimeoVideo {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
  embedUrl: string;
  thumbnail: {
    small: string;
    medium: string;
    large: string;
  };
}
