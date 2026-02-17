import qs from 'qs';

import { mockProjects, mockSite } from '@/lib/mock';
import type {
  GetProjectsOptions,
  Project,
  Site,
  StrapiCollectionResponse,
  StrapiMedia,
  StrapiSingleResponse,
} from '@/lib/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const REQUEST_TIMEOUT_MS = 3500;

const sortProjects = (projects: Project[]): Project[] => {
  return [...projects].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    const orderDelta = (a.order ?? 0) - (b.order ?? 0);
    if (orderDelta !== 0) {
      return orderDelta;
    }

    return a.title.localeCompare(b.title);
  });
};

const filterProjects = (projects: Project[], options: GetProjectsOptions): Project[] => {
  const filtered = projects.filter((project) => {
    if (options.featuredOnly && !project.featured) {
      return false;
    }

    if (!options.tag) {
      return true;
    }

    return (project.tags ?? []).some((tag) => tag.slug === options.tag);
  });

  const sorted = sortProjects(filtered);
  if (!options.limit || options.limit <= 0) {
    return sorted;
  }

  return sorted.slice(0, options.limit);
};

const safeStack = (stack: unknown): string[] => {
  if (!Array.isArray(stack)) {
    return [];
  }

  return stack.filter((item): item is string => typeof item === 'string');
};

const normalizeProject = (project: Project): Project => ({
  ...project,
  stack: safeStack(project.stack),
  tags: project.tags ?? [],
  gallery: project.gallery ?? [],
  demoUrl: project.demoUrl ?? project.liveUrl ?? null,
  featured: Boolean(project.featured),
  order: project.order ?? 0,
});

const normalizeProjects = (projects: Project[]): Project[] => {
  return projects.map((project) => normalizeProject(project));
};

const buildApiUrl = (path: string, queryObj?: Record<string, unknown>): string => {
  const query = queryObj
    ? qs.stringify(queryObj, {
        encodeValuesOnly: true,
        skipNulls: true,
      })
    : '';

  return `${STRAPI_URL}${path}${query ? `?${query}` : ''}`;
};

export const getStrapiMediaUrl = (media?: Pick<StrapiMedia, 'url'> | null): string | null => {
  if (!media?.url) {
    return null;
  }

  if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
    return media.url;
  }

  return new URL(media.url, STRAPI_URL).toString();
};

export const strapiFetch = async <T>(
  path: string,
  queryObj?: Record<string, unknown>,
): Promise<T | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const response = await fetch(buildApiUrl(path, queryObj), {
      headers,
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Strapi request failed with status ${response.status}`);
    }

    const data = (await response.json()) as T;
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export const getSite = async (): Promise<Site> => {
  const response = await strapiFetch<StrapiSingleResponse<Site>>('/api/site', {
    fields: ['name', 'headline', 'location', 'about', 'email', 'documentId'],
    populate: {
      avatar: {
        fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
      },
      socials: true,
    },
  });

  if (!response?.data) {
    return mockSite;
  }

  return response.data;
};

export const getProjects = async (options: GetProjectsOptions = {}): Promise<Project[]> => {
  const filters: Record<string, unknown> = {};

  if (options.featuredOnly) {
    filters.featured = { $eq: true };
  }

  if (options.tag) {
    filters.tags = {
      slug: { $eq: options.tag },
    };
  }

  const response = await strapiFetch<StrapiCollectionResponse<Project>>('/api/projects', {
    fields: ['title', 'slug', 'summary', 'featured', 'order', 'stack', 'repoUrl', 'demoUrl', 'liveUrl', 'documentId'],
    sort: ['featured:desc', 'order:asc', 'title:asc'],
    filters,
    pagination: options.limit ? { pageSize: options.limit } : undefined,
    populate: {
      cover: {
        fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
      },
      tags: {
        fields: ['name', 'slug', 'documentId'],
      },
    },
  });

  if (!response?.data) {
    return filterProjects(mockProjects, options);
  }

  return normalizeProjects(response.data);
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const response = await strapiFetch<StrapiCollectionResponse<Project>>('/api/projects', {
    filters: {
      slug: { $eq: slug },
    },
    pagination: {
      pageSize: 1,
    },
    fields: [
      'title',
      'slug',
      'summary',
      'description',
      'featured',
      'order',
      'stack',
      'repoUrl',
      'demoUrl',
      'liveUrl',
      'documentId',
    ],
    populate: {
      cover: {
        fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
      },
      gallery: {
        fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
      },
      tags: {
        fields: ['name', 'slug', 'documentId'],
      },
    },
  });

  if (!response?.data) {
    const fallbackProject = mockProjects.find((project) => project.slug === slug);
    return fallbackProject ? normalizeProject(fallbackProject) : null;
  }

  const project = response.data[0];
  if (!project) {
    return null;
  }

  return normalizeProject(project);
};

export const getAllProjectSlugs = async (): Promise<string[]> => {
  const response = await strapiFetch<StrapiCollectionResponse<Pick<Project, 'slug'>>>('/api/projects', {
    fields: ['slug'],
    sort: ['order:asc', 'title:asc'],
    pagination: {
      pageSize: 200,
    },
  });

  if (!response?.data) {
    return mockProjects.map((project) => project.slug);
  }

  return response.data.map((project) => project.slug).filter((slug): slug is string => Boolean(slug));
};

export const checkStrapiConnection = async (): Promise<boolean> => {
  const response = await strapiFetch<StrapiCollectionResponse<Pick<Project, 'documentId'>>>('/api/projects', {
    fields: ['documentId'],
    pagination: {
      pageSize: 1,
    },
  });

  return Boolean(response);
};
