export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface CreateFolderRequest {
  title: string;
  description?: string;
  image?: string;
  link?: string;
}
