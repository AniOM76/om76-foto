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
      .expression('*') // Get all resources
      .sort_by('created_at', 'desc')
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute()) as CloudinarySearchResult;

    // Debug logging to see what we get back
    console.log('Cloudinary API Response:', {
      total_count: result.total_count,
      resources_length: result.resources?.length || 0,
      first_few_resources: result.resources?.slice(0, 3).map(r => ({
        public_id: r.public_id,
        resource_type: r.resource_type,
        format: r.format,
        created_at: r.created_at
      }))
    });

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

    console.log('Final result:', {
      photos_count: photos.length,
      videos_count: videos.length,
      photo_ids: photos.map(p => p.publicId).slice(0, 5)
    });

    return { photos, videos };
  } catch (error) {
    console.error('Error fetching user content from Cloudinary:', error);
    return { photos: [], videos: [] };
  }
}

// Fetch photos from a specific folder
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
