import { cloudinary } from './cloudinary';
import type { PhotoData } from '@/types/image';
import type {
  CloudinarySearchResult,
  CloudinaryResource,
  VideoData,
} from '@/types/cloudinary';

// Fetch all uploaded content from Cloudinary
export async function fetchAllUserContent(): Promise<{
  photos: PhotoData[];
  videos: VideoData[];
}> {
  try {
    // Fetch all resources (both images and videos)
    const result = (await cloudinary.search
      .expression('resource_type:image OR resource_type:video') // Get images and videos
      .sort_by('created_at', 'desc')
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute()) as CloudinarySearchResult;


    const photos: PhotoData[] = [];
    const videos: VideoData[] = [];

    result.resources.forEach((resource: CloudinaryResource) => {
      if (resource.resource_type === 'image') {
        photos.push({
          publicId: resource.public_id,
          title:
            resource.context?.custom?.title ||
            resource.display_name ||
            resource.public_id.split('/').pop() ||
            'Untitled',
          description:
            resource.context?.custom?.description ||
            `Uploaded on ${new Date(resource.created_at).toLocaleDateString()}`,
          category: resource.folder || 'portfolio',
          tags: resource.tags || [],
          width: resource.width,
          height: resource.height,
          aspectRatio: resource.width / resource.height,
          createdAt: resource.created_at,
          alt:
            resource.context?.custom?.alt ||
            resource.context?.custom?.title ||
            resource.display_name ||
            'User uploaded photo',
        });
      } else if (resource.resource_type === 'video') {
        videos.push({
          publicId: resource.public_id,
          title:
            resource.context?.custom?.title ||
            resource.display_name ||
            resource.public_id.split('/').pop() ||
            'Untitled Video',
          description:
            resource.context?.custom?.description ||
            `Video uploaded on ${new Date(resource.created_at).toLocaleDateString()}`,
          category: resource.folder || 'portfolio',
          tags: resource.tags || [],
          width: resource.width,
          height: resource.height,
          duration: resource.duration || 0,
          aspectRatio: resource.width / resource.height,
          createdAt: resource.created_at,
          format: resource.format,
        });
      }
    });


    return { photos, videos };
  } catch (error) {
    console.error('Error fetching user content from Cloudinary:', error);
    return { photos: [], videos: [] };
  }
}

// Fetch content by category (folder or tag)
export async function fetchContentByCategory(category: string): Promise<{
  photos: PhotoData[];
  videos: VideoData[];
}> {
  try {
    let expression: string;
    
    // Gallery uses tag-based filtering, others use folder-based
    if (category === 'gallery') {
      expression = 'tags:Gallery';
    } else {
      // Map URL-friendly names to folder names
      const folderMap: { [key: string]: string } = {
        'portraits': 'portraits',
        'beyond-2025': 'beyond-2025',
        'alvord-2025': 'Alvord-2025',
        'drone': 'drone',
        'misc': 'misc'
      };
      
      const folderName = folderMap[category] || category;
      expression = `folder:${folderName}`;
    }

    const result = (await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute()) as CloudinarySearchResult;

    const photos: PhotoData[] = [];
    const videos: VideoData[] = [];

    result.resources.forEach((resource: CloudinaryResource) => {
      if (resource.resource_type === 'image') {
        photos.push({
          publicId: resource.public_id,
          title:
            resource.context?.custom?.title ||
            resource.display_name ||
            resource.public_id.split('/').pop() ||
            'Untitled',
          description:
            resource.context?.custom?.description ||
            `Uploaded on ${new Date(resource.created_at).toLocaleDateString()}`,
          category: resource.folder || 'portfolio',
          tags: resource.tags || [],
          width: resource.width,
          height: resource.height,
          aspectRatio: resource.width / resource.height,
          createdAt: resource.created_at,
          alt:
            resource.context?.custom?.alt ||
            resource.context?.custom?.title ||
            resource.display_name ||
            'User uploaded photo',
        });
      } else if (resource.resource_type === 'video') {
        videos.push({
          publicId: resource.public_id,
          title:
            resource.context?.custom?.title ||
            resource.display_name ||
            resource.public_id.split('/').pop() ||
            'Untitled Video',
          description:
            resource.context?.custom?.description ||
            `Video uploaded on ${new Date(resource.created_at).toLocaleDateString()}`,
          category: resource.folder || 'portfolio',
          tags: resource.tags || [],
          width: resource.width,
          height: resource.height,
          duration: resource.duration || 0,
          aspectRatio: resource.width / resource.height,
          createdAt: resource.created_at,
          format: resource.format,
        });
      }
    });

    return { photos, videos };
  } catch (error) {
    console.error('Error fetching content by category:', error);
    return { photos: [], videos: [] };
  }
}

// Legacy function - kept for backward compatibility
export async function fetchPhotosFromUserFolder(
  folder: string = ''
): Promise<PhotoData[]> {
  try {
    const expression = folder ? `folder:${folder}` : 'resource_type:image';

    const result = (await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute()) as CloudinarySearchResult;

    return result.resources
      .filter(
        (resource: CloudinaryResource) => resource.resource_type === 'image'
      )
      .map((resource: CloudinaryResource) => ({
        publicId: resource.public_id,
        title:
          resource.context?.custom?.title ||
          resource.display_name ||
          resource.public_id.split('/').pop() ||
          'Untitled',
        description:
          resource.context?.custom?.description ||
          `Uploaded on ${new Date(resource.created_at).toLocaleDateString()}`,
        category: resource.folder || 'portfolio',
        tags: resource.tags || [],
        width: resource.width,
        height: resource.height,
        aspectRatio: resource.width / resource.height,
        createdAt: resource.created_at,
        alt:
          resource.context?.custom?.alt ||
          resource.context?.custom?.title ||
          resource.display_name ||
          'User uploaded photo',
      }));
  } catch (error) {
    console.error('Error fetching photos from folder:', error);
    return [];
  }
}
