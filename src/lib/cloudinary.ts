import { v2 as cloudinary } from 'cloudinary';
import { env, validateEnv } from './env';
import type { PhotoData, GalleryPhoto } from '@/types/image';

// Validate environment and configure Cloudinary
try {
  validateEnv();
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
} catch (error) {
  console.error('Cloudinary configuration error:', error);
}

export { cloudinary };

// Image transformation helpers
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

// Responsive image sizes generator
export function generateResponsiveSizes(
  publicId: string,
  sizes: number[]
): { src: string; width: number }[] {
  return sizes.map((width) => ({
    src: buildImageUrl(publicId, { width, quality: 'auto', format: 'auto' }),
    width,
  }));
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

// Fetch photos from Cloudinary folder
export async function fetchPhotosFromFolder(
  folder: string
): Promise<PhotoData[]> {
  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by([['created_at', 'desc']])
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute();

    return result.resources.map((resource: any) => ({
      publicId: resource.public_id,
      title: resource.context?.custom?.title || resource.filename || 'Untitled',
      description: resource.context?.custom?.description,
      category: folder,
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
      aspectRatio: resource.width / resource.height,
      createdAt: resource.created_at,
      alt:
        resource.context?.custom?.alt ||
        resource.context?.custom?.title ||
        'Photo',
    }));
  } catch (error) {
    console.error('Error fetching photos from Cloudinary:', error);
    return [];
  }
}
