export type StrapiCollectionResponse<T> = {
  data: T[];
};

export type StrapiSingleResponse<T> = {
  data: T | null;
};

export type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width?: number | null;
  height?: number | null;
};

export type SocialLink = {
  id: number;
  label: string;
  url: string;
  icon?: string | null;
};

export type Tag = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
};

export type Project = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  featured?: boolean;
  order?: number;
  stack?: string[] | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  liveUrl?: string | null;
  cover?: StrapiMedia | null;
  gallery?: StrapiMedia[];
  tags?: Tag[];
};

export type Site = {
  id: number;
  documentId: string;
  name: string;
  headline: string;
  location?: string | null;
  about?: string | null;
  email?: string | null;
  socials?: SocialLink[];
  avatar?: StrapiMedia | null;
};

export type GetProjectsOptions = {
  featuredOnly?: boolean;
  tag?: string;
  limit?: number;
};
