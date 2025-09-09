import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

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
    buildImageUrl(publicId, { width: 400, height: 400, crop: 'thumb', gravity: 'auto' }),
  
  medium: (publicId: string) =>
    buildImageUrl(publicId, { width: 800, quality: 'auto' }),
  
  large: (publicId: string) =>
    buildImageUrl(publicId, { width: 1600, quality: 'auto' }),
  
  fullscreen: (publicId: string) =>
    buildImageUrl(publicId, { width: 2400, quality: 'auto' }),
};