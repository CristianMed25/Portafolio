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

const RAW_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const REQUEST_TIMEOUT_MS = 3500;
const STRAPI_FAILURE_BACKOFF_MS = 45_000;
const DEFAULT_REVALIDATE_SECONDS = 900;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const REVALIDATE_WINDOW = {
  site: 6 * 60 * 60,
  projects: 30 * 60,
  project: 60 * 60,
  slugs: 24 * 60 * 60,
  health: 5 * 60,
} as const;

export const STRAPI_CACHE_TAGS = {
  site: 'strapi:site',
  homepage: 'strapi:homepage',
  projects: 'strapi:projects',
  sitemap: 'strapi:sitemap',
  health: 'strapi:health',
  projectPrefix: 'strapi:project:',
  tagPrefix: 'strapi:tag:',
} as const;

type StrapiFetchOptions = {
  revalidate?: number;
  tags?: string[];
  requestLabel?: string;
};

const normalizeBaseUrl = (value: string): string => {
  try {
    return new URL(value).toString().replace(/\/$/, '');
  } catch {
    return 'http://localhost:1337';
  }
};

const STRAPI_URL = normalizeBaseUrl(RAW_STRAPI_URL);
let strapiUnavailableUntil = 0;
let strapiRequestCount = 0;

const shouldLogStrapiRequests = (): boolean => process.env.LOG_STRAPI_REQUESTS === 'true';

const logStrapi = (message: string): void => {
  if (shouldLogStrapiRequests()) {
    console.info(message);
  }
};

const dedupeTags = (tags: string[] | undefined): string[] | undefined => {
  if (!tags || tags.length === 0) {
    return undefined;
  }

  return [...new Set(tags)];
};

const sortProjects = (projects: Project[]): Project[] => {
  return [...projects].sort((a, b) => {
    const createdAtA = a.createdAt ? Date.parse(a.createdAt) : Number.NaN;
    const createdAtB = b.createdAt ? Date.parse(b.createdAt) : Number.NaN;
    const hasCreatedAtA = Number.isFinite(createdAtA);
    const hasCreatedAtB = Number.isFinite(createdAtB);

    if (hasCreatedAtA && hasCreatedAtB && createdAtA !== createdAtB) {
      return createdAtA - createdAtB;
    }

    return a.id - b.id;
  });
};

const normalizeLimit = (limit: number | undefined): number => {
  if (!limit || limit <= 0) {
    return 0;
  }

  return Math.trunc(limit);
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
  const limit = normalizeLimit(options.limit);

  if (limit === 0) {
    return sorted;
  }

  return sorted.slice(0, limit);
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

const getProjectsTagSet = (tag?: string): string[] => {
  const tags: string[] = [STRAPI_CACHE_TAGS.projects, STRAPI_CACHE_TAGS.homepage];

  if (tag) {
    tags.push(`${STRAPI_CACHE_TAGS.tagPrefix}${tag}`);
  }

  return tags;
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
  options: StrapiFetchOptions = {},
): Promise<T | null> => {
  if (Date.now() < strapiUnavailableUntil) {
    logStrapi(`[strapi] skipping ${path} while circuit breaker is open`);
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const requestId = ++strapiRequestCount;
  const label = options.requestLabel ?? path;
  const url = buildApiUrl(path, queryObj);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }

    const tags = dedupeTags(options.tags);
    const nextOptions = {
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
      ...(tags ? { tags } : {}),
    };

    const response = await fetch(url, {
      headers,
      ...(IS_PRODUCTION ? { next: nextOptions } : { cache: 'no-store' as const }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Strapi request failed with status ${response.status}`);
    }

    strapiUnavailableUntil = 0;
    logStrapi(`[strapi] #${requestId} ok (${label})`);

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    strapiUnavailableUntil = Date.now() + STRAPI_FAILURE_BACKOFF_MS;
    logStrapi(`[strapi] #${requestId} failed (${label}) ${(error as Error).message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export const getSite = async (): Promise<Site> => {
  const response = await strapiFetch<StrapiSingleResponse<Site>>(
    '/api/site',
    {
      fields: ['name', 'headline', 'location', 'about', 'email', 'documentId'],
      populate: {
        avatar: {
          fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
        },
        socials: {
          fields: ['label', 'url', 'icon'],
        },
      },
    },
    {
      revalidate: REVALIDATE_WINDOW.site,
      tags: [STRAPI_CACHE_TAGS.site, STRAPI_CACHE_TAGS.homepage],
      requestLabel: 'site',
    },
  );

  if (!response?.data) {
    return mockSite;
  }

  return response.data;
};

export const getProjects = async (options: GetProjectsOptions = {}): Promise<Project[]> => {
  const filters: Record<string, unknown> = {};
  const featuredOnly = Boolean(options.featuredOnly);
  const cleanTag = options.tag?.trim() ?? '';
  const cleanLimit = normalizeLimit(options.limit);

  if (featuredOnly) {
    filters.featured = { $eq: true };
  }

  if (cleanTag) {
    filters.tags = {
      slug: { $eq: cleanTag },
    };
  }

  const response = await strapiFetch<StrapiCollectionResponse<Project>>(
    '/api/projects',
    {
      fields: ['title', 'slug', 'summary', 'featured', 'order', 'stack', 'documentId', 'createdAt'],
      sort: ['createdAt:asc', 'id:asc'],
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      pagination: cleanLimit > 0 ? { page: 1, pageSize: cleanLimit } : undefined,
      populate: {
        cover: {
          fields: ['url', 'alternativeText', 'width', 'height', 'documentId'],
        },
        tags: {
          fields: ['name', 'slug', 'documentId'],
        },
      },
    },
    {
      revalidate: REVALIDATE_WINDOW.projects,
      tags: getProjectsTagSet(cleanTag),
      requestLabel: cleanTag ? `projects(tag=${cleanTag})` : 'projects',
    },
  );

  if (!response?.data) {
    return filterProjects(mockProjects, {
      featuredOnly,
      tag: cleanTag || undefined,
      limit: cleanLimit || undefined,
    });
  }

  return normalizeProjects(response.data);
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return null;
  }

  const response = await strapiFetch<StrapiCollectionResponse<Project>>(
    '/api/projects',
    {
      filters: {
        slug: { $eq: cleanSlug },
      },
      pagination: {
        page: 1,
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
    },
    {
      revalidate: REVALIDATE_WINDOW.project,
      tags: [STRAPI_CACHE_TAGS.projects, `${STRAPI_CACHE_TAGS.projectPrefix}${cleanSlug}`],
      requestLabel: `project(${cleanSlug})`,
    },
  );

  if (!response?.data) {
    const fallbackProject = mockProjects.find((project) => project.slug === cleanSlug);
    return fallbackProject ? normalizeProject(fallbackProject) : null;
  }

  const project = response.data[0];
  if (!project) {
    return null;
  }

  return normalizeProject(project);
};

export const getAllProjectSlugs = async (): Promise<string[]> => {
  const response = await strapiFetch<StrapiCollectionResponse<Pick<Project, 'slug'>>>(
    '/api/projects',
    {
      fields: ['slug'],
      sort: ['createdAt:asc', 'id:asc'],
      pagination: {
        page: 1,
        pageSize: 200,
      },
    },
    {
      revalidate: REVALIDATE_WINDOW.slugs,
      tags: [STRAPI_CACHE_TAGS.projects, STRAPI_CACHE_TAGS.sitemap],
      requestLabel: 'project-slugs',
    },
  );

  if (!response?.data) {
    return mockProjects.map((project) => project.slug);
  }

  return response.data.map((project) => project.slug).filter((slug): slug is string => Boolean(slug));
};

export const getHomepage = async (): Promise<{ site: Site; projects: Project[] }> => {
  const [site, projects] = await Promise.all([getSite(), getProjects()]);
  return { site, projects };
};

export const checkStrapiConnection = async (): Promise<boolean> => {
  const response = await strapiFetch<StrapiCollectionResponse<Pick<Project, 'documentId'>>>(
    '/api/projects',
    {
      fields: ['documentId'],
      pagination: {
        page: 1,
        pageSize: 1,
      },
    },
    {
      revalidate: REVALIDATE_WINDOW.health,
      tags: [STRAPI_CACHE_TAGS.health],
      requestLabel: 'health-check',
    },
  );

  return Boolean(response);
};
