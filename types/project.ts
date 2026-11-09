export interface TechStackItem {
  category: string;
  skills: string;
  purpose: string;
}

export interface ProjectSummary {
  background?: string;
  role?: string;
  philosophy?: string;
}

export interface ProjectFeature {
  title: string;
  desc: string;
  subitems?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  subtitle?: string;
  githubUrl?: string;
  demoUrl?: string;
  isPrivate?: boolean;
  tags?: string[];
  summary?: ProjectSummary;
  features?: ProjectFeature[];
  techStackTable?: TechStackItem[];
  rawMarkdown?: string;
}

export interface CreateFolderRequest {
  title: string;
  description?: string;
  image?: string;
  link?: string;
}
