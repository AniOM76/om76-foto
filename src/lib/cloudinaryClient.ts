// Client-side Cloudinary utilities (no server-side imports)
import { env } from './env';
import type { PhotoData, GalleryPhoto } from '@/types/image';

// Image transformation helpers (client-side safe)
export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

export function buildImageUrl(
  publicId: string,
  options: ImageTransformOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const transformations = [
    quality && `q_${quality}`,
    format && `f_${format}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${env.cloudinary.cloudName}/image/upload/${transformations.join(',')}/v1/${publicId}`;
}

// Video URL builder
export function buildVideoUrl(
  publicId: string,
  options: Omit<ImageTransformOptions, 'format'> & { format?: 'auto' | 'mp4' | 'webm' } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  const transformations = [
    quality && `q_${quality}`,
    format && `f_${format}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${env.cloudinary.cloudName}/video/upload/${transformations.join(',')}/v1/${publicId}`;
}

// Gallery-specific image transformations
export const galleryTransforms = {
  thumbnail: (publicId: string) =>
    buildImageUrl(publicId, {
      width: 400,
      height: 400,
      crop: 'thumb',
      gravity: 'auto',
    }),

  medium: (publicId: string) =>
    buildImageUrl(publicId, { width: 800, quality: 'auto' }),

  large: (publicId: string) =>
    buildImageUrl(publicId, { width: 1600, quality: 'auto' }),

  fullscreen: (publicId: string) =>
    buildImageUrl(publicId, { width: 2400, quality: 'auto' }),
};

// Convert PhotoData to GalleryPhoto with all URL variants
export function createGalleryPhoto(photo: PhotoData): GalleryPhoto {
  return {
    ...photo,
    urls: {
      thumbnail: galleryTransforms.thumbnail(photo.publicId),
      medium: galleryTransforms.medium(photo.publicId),
      large: galleryTransforms.large(photo.publicId),
      fullscreen: galleryTransforms.fullscreen(photo.publicId),
    },
  };
}
