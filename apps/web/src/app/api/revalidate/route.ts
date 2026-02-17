import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

import { STRAPI_CACHE_TAGS } from '@/lib/strapi';

type RevalidateWebhookPayload = {
  secret?: string;
  model?: string;
  uid?: string;
  event?: string;
  slug?: string;
  tags?: string[];
  paths?: string[];
  entry?: {
    slug?: string;
  };
};

type RevalidateTarget = {
  tags: string[];
  paths: string[];
};

const getAllowedSecret = (): string => process.env.REVALIDATE_SECRET ?? '';

const normalizeDelimitedValues = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizePath = (value: string): string | null => {
  if (!value) {
    return null;
  }

  if (!value.startsWith('/')) {
    return null;
  }

  return value;
};

const normalizeTag = (value: string): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
};

const unique = (values: string[]): string[] => [...new Set(values)];

const normalizeModel = (payload: RevalidateWebhookPayload, modelFromQuery?: string | null): string => {
  const rawModel = modelFromQuery ?? payload.model ?? payload.uid ?? '';
  return rawModel.toLowerCase();
};

const normalizeSlug = (payload: RevalidateWebhookPayload, slugFromQuery?: string | null): string => {
  const rawSlug = slugFromQuery ?? payload.slug ?? payload.entry?.slug ?? '';
  return rawSlug.trim();
};

const getRevalidateTargetByModel = (model: string, slug: string): RevalidateTarget => {
  const tags: string[] = [];
  const paths: string[] = [];

  if (model.includes('site')) {
    tags.push(STRAPI_CACHE_TAGS.site, STRAPI_CACHE_TAGS.homepage);
    paths.push('/');
  }

  if (model.includes('project')) {
    tags.push(STRAPI_CACHE_TAGS.projects, STRAPI_CACHE_TAGS.homepage, STRAPI_CACHE_TAGS.sitemap);
    paths.push('/', '/projects', '/sitemap.xml');

    if (slug) {
      tags.push(`${STRAPI_CACHE_TAGS.projectPrefix}${slug}`);
      paths.push(`/projects/${slug}`);
    }
  }

  if (model.includes('tag')) {
    tags.push(STRAPI_CACHE_TAGS.projects, STRAPI_CACHE_TAGS.homepage, STRAPI_CACHE_TAGS.sitemap);
    paths.push('/', '/projects', '/sitemap.xml');
  }

  return {
    tags: unique(tags),
    paths: unique(paths),
  };
};

const applyRevalidation = (tags: string[], paths: string[]): void => {
  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  for (const path of paths) {
    revalidatePath(path);
  }
};

const unauthorizedResponse = () =>
  NextResponse.json(
    {
      ok: false,
      message: 'Invalid revalidation secret.',
    },
    {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    },
  );

const successResponse = (tags: string[], paths: string[], event?: string) =>
  NextResponse.json(
    {
      ok: true,
      revalidatedAt: new Date().toISOString(),
      tags,
      paths,
      event: event ?? null,
    },
    {
      headers: { 'Cache-Control': 'no-store' },
    },
  );

const safeJson = async (request: NextRequest): Promise<RevalidateWebhookPayload> => {
  try {
    return (await request.json()) as RevalidateWebhookPayload;
  } catch {
    return {};
  }
};

const extractAuthorizationSecret = (request: NextRequest): string | undefined => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return undefined;
  }

  const [scheme, token] = authHeader.trim().split(/\s+/, 2);
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return undefined;
  }

  return token;
};

const getIncomingSecret = (request: NextRequest, payloadSecret?: string): string | undefined => {
  const fromBody = payloadSecret?.trim();
  if (fromBody) {
    return fromBody;
  }

  const fromQuery = request.nextUrl.searchParams.get('secret')?.trim();
  if (fromQuery) {
    return fromQuery;
  }

  const fromHeader = request.headers.get('x-revalidate-secret')?.trim();
  if (fromHeader) {
    return fromHeader;
  }

  return extractAuthorizationSecret(request);
};

const validateSecret = (secret: string | undefined): boolean => {
  const allowedSecret = getAllowedSecret();
  return Boolean(allowedSecret) && allowedSecret === secret;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = getIncomingSecret(request);
  if (!validateSecret(secret)) {
    return unauthorizedResponse();
  }

  const requestedTags = normalizeDelimitedValues(request.nextUrl.searchParams.get('tag'))
    .map(normalizeTag)
    .filter((tag): tag is string => Boolean(tag));

  const requestedPaths = normalizeDelimitedValues(request.nextUrl.searchParams.get('path'))
    .map(normalizePath)
    .filter((path): path is string => Boolean(path));

  const model = normalizeModel({}, request.nextUrl.searchParams.get('model'));
  const slug = normalizeSlug({}, request.nextUrl.searchParams.get('slug'));
  const targetByModel = getRevalidateTargetByModel(model, slug);

  const tags = unique([...requestedTags, ...targetByModel.tags]);
  const paths = unique([...requestedPaths, ...targetByModel.paths]);

  applyRevalidation(tags, paths);
  return successResponse(tags, paths);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = await safeJson(request);
  const secret = getIncomingSecret(request, payload.secret);
  if (!validateSecret(secret)) {
    return unauthorizedResponse();
  }

  const model = normalizeModel(payload);
  const slug = normalizeSlug(payload);
  const targetByModel = getRevalidateTargetByModel(model, slug);

  const manualTags = (payload.tags ?? [])
    .map(normalizeTag)
    .filter((tag): tag is string => Boolean(tag));

  const manualPaths = (payload.paths ?? [])
    .map(normalizePath)
    .filter((path): path is string => Boolean(path));

  const tags = unique([...manualTags, ...targetByModel.tags]);
  const paths = unique([...manualPaths, ...targetByModel.paths]);

  applyRevalidation(tags, paths);
  return successResponse(tags, paths, payload.event);
}
