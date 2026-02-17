import type { Core } from '@strapi/strapi';

const parseOrigins = (origins: string | undefined): string[] => {
  if (!origins) {
    return [];
  }

  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = Array.from(
  new Set([
    'http://localhost:3000',
    ...parseOrigins(process.env.WEB_ORIGIN),
    ...parseOrigins(process.env.WEB_ORIGINS),
  ]),
);

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
