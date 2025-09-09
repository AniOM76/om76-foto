// Cloudinary API response types
export interface CloudinaryResource {
  public_id: string;
  resource_type: 'image' | 'video' | 'raw' | 'auto';
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  url: string;
  secure_url: string;
  folder?: string;
  display_name?: string;
  filename?: string;
  tags: string[];
  context?: {
    custom?: {
      title?: string;
      description?: string;
      alt?: string;
    };
  };
  // Video-specific properties
  duration?: number;
  video?: {
    duration: number;
  };
}

export interface CloudinarySearchResult {
  resources: CloudinaryResource[];
  total_count: number;
  time: number;
  next_cursor?: string;
}

export interface VideoData {
  publicId: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  duration: number;
  aspectRatio: number;
  createdAt: string;
  format: string;
}
