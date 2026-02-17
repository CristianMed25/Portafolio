import type { Project, Site } from '@/lib/types';

export const mockSite: Site = {
  id: 1,
  documentId: 'site-mock-1',
  name: 'Tu Nombre',
  headline: 'Desarrollador Web • Backend/Full-stack',
  location: 'Ciudad, País',
  about: `Construyo experiencias web rápidas, mantenibles y claras.

Me enfoco en entregar producto con buena arquitectura, alto rendimiento y UX simple.

Actualmente trabajo en proyectos full-stack con TypeScript, Node.js y arquitecturas modernas.`,
  email: 'tuemail@ejemplo.com',
  socials: [
    {
      id: 1,
      label: 'GitHub',
      url: 'https://github.com/tuusuario',
      icon: 'github',
    },
    {
      id: 2,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/tuusuario',
      icon: 'linkedin',
    },
  ],
  avatar: null,
};

export const mockProjects: Project[] = [
  {
    id: 1,
    documentId: 'project-mock-1',
    title: 'Portafolio Minimal',
    slug: 'portafolio-minimal',
    summary: 'Sitio personal con foco en performance y contenido gestionable.',
    description: `Portafolio one-page y sección de detalle por proyecto.

- Next.js App Router + TypeScript
- Tailwind CSS
- CMS desacoplado con fallback sin backend`,
    featured: true,
    order: 1,
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Strapi'],
    repoUrl: 'https://github.com/tuusuario/portafolio',
    demoUrl: 'https://tu-portafolio.dev',
    liveUrl: 'https://tu-portafolio.dev',
    tags: [
      { id: 1, documentId: 'tag-mock-1', name: 'Frontend', slug: 'frontend' },
      { id: 2, documentId: 'tag-mock-2', name: 'Backend', slug: 'backend' },
    ],
    cover: null,
    gallery: [],
  },
  {
    id: 2,
    documentId: 'project-mock-2',
    title: 'API de Reservas',
    slug: 'api-de-reservas',
    summary: 'Backend REST con validaciones, autenticación y métricas.',
    description: `Servicio backend con endpoints versionados y documentación clara.

- Node.js + TypeScript
- Persistencia SQLite/Postgres
- Enfoque en mantenibilidad`,
    featured: true,
    order: 2,
    stack: ['Node.js', 'TypeScript', 'PostgreSQL'],
    repoUrl: 'https://github.com/tuusuario/api-reservas',
    demoUrl: null,
    liveUrl: null,
    tags: [{ id: 3, documentId: 'tag-mock-3', name: 'API', slug: 'api' }],
    cover: null,
    gallery: [],
  },
  {
    id: 3,
    documentId: 'project-mock-3',
    title: 'Panel de Métricas',
    slug: 'panel-de-metricas',
    summary: 'Visualización de KPIs con filtros por periodo y estado.',
    description: `Interfaz para seguimiento de producto y operaciones en tiempo real.

- Dashboard responsive
- Consultas optimizadas
- UX simple y legible`,
    featured: false,
    order: 3,
    stack: ['React', 'TypeScript', 'Node.js'],
    repoUrl: 'https://github.com/tuusuario/panel-metricas',
    demoUrl: 'https://demo.panel-metricas.dev',
    liveUrl: 'https://demo.panel-metricas.dev',
    tags: [{ id: 4, documentId: 'tag-mock-4', name: 'Dashboard', slug: 'dashboard' }],
    cover: null,
    gallery: [],
  },
];
