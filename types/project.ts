export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  demo_url: string | null;
  tags: string[];
  order_index: number;
  created_at?: string;
}

export interface CreateFolderRequest {
  title: string;
  description?: string;
  demo_url?: string;
  image_url?: string;
  tags?: string[];
}

