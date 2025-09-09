export interface PhotoData {
  publicId: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  aspectRatio: number;
  createdAt: string;
  alt: string;
}

export interface PhotoCollection {
  id: string;
  name: string;
  description?: string;
  photos: PhotoData[];
  coverPhoto: string; // publicId of cover photo
}

export interface GalleryPhoto extends PhotoData {
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    fullscreen: string;
  };
}
