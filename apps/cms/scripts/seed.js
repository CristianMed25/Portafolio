const { compileStrapi, createStrapi } = require('@strapi/core');

const SITE_UID = 'api::site.site';
const PROJECT_UID = 'api::project.project';
const TAG_UID = 'api::tag.tag';

const now = new Date();

const run = async () => {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).register();
  await strapi.bootstrap();

  try {
    const existingSiteCount = await strapi.db.query(SITE_UID).count();
    const existingProjectCount = await strapi.db.query(PROJECT_UID).count();

    if (existingSiteCount > 0 || existingProjectCount > 0) {
      console.log('Seed omitido: la base de datos ya contiene contenido.');
      return;
    }

    await strapi.entityService.create(SITE_UID, {
      data: {
        name: 'Tu Nombre',
        headline: 'Desarrollador Web • Backend/Full-stack',
        location: 'Ciudad, País',
        about: `Soy un desarrollador enfocado en construir productos claros, rápidos y mantenibles.

Trabajo con enfoque en performance, DX y experiencia de usuario.`,
        email: 'tuemail@ejemplo.com',
        socials: [
          { label: 'GitHub', url: 'https://github.com/tuusuario', icon: 'github' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tuusuario', icon: 'linkedin' },
        ],
        publishedAt: now,
      },
    });

    const tagSeed = [
      { name: 'Backend', slug: 'backend', publishedAt: now },
      { name: 'Frontend', slug: 'frontend', publishedAt: now },
      { name: 'API', slug: 'api', publishedAt: now },
    ];

    for (const tag of tagSeed) {
      await strapi.entityService.create(TAG_UID, { data: tag });
    }

    const projectSeed = [
      {
        title: 'Portafolio Minimal',
        slug: 'portafolio-minimal',
        summary: 'Sitio personal de alto rendimiento conectado a CMS.',
        description: `Proyecto de portafolio con enfoque en velocidad, legibilidad y despliegue simple.

- Next.js App Router
- Strapi como CMS
- Renderizado accesible`,
        featured: true,
        order: 1,
        stack: ['Next.js', 'TypeScript', 'Tailwind', 'Strapi'],
        repoUrl: 'https://github.com/tuusuario/portafolio-minimal',
        demoUrl: 'https://tu-dominio.dev',
        liveUrl: 'https://tu-dominio.dev',
        publishedAt: now,
      },
      {
        title: 'Dashboard de Métricas',
        slug: 'dashboard-metricas',
        summary: 'Panel para visualizar eventos y KPIs de producto.',
        description: `Dashboard técnico para seguimiento de uso y errores.

Incluye filtros por fechas, vistas agregadas y exportación.`,
        featured: true,
        order: 2,
        stack: ['React', 'Node.js', 'PostgreSQL'],
        repoUrl: 'https://github.com/tuusuario/dashboard-metricas',
        demoUrl: 'https://demo.tu-dominio.dev',
        liveUrl: 'https://demo.tu-dominio.dev',
        publishedAt: now,
      },
      {
        title: 'API de Reservas',
        slug: 'api-reservas',
        summary: 'Servicio backend para gestionar reservas y disponibilidad.',
        description: 'Backend REST documentado con validaciones, paginación y autenticación JWT.',
        featured: false,
        order: 3,
        stack: ['Node.js', 'TypeScript', 'SQLite'],
        repoUrl: 'https://github.com/tuusuario/api-reservas',
        demoUrl: '',
        liveUrl: '',
        publishedAt: now,
      },
    ];

    for (const project of projectSeed) {
      await strapi.entityService.create(PROJECT_UID, { data: project });
    }

    console.log('Seed completado: sitio + tags + proyectos creados.');
  } finally {
    await strapi.destroy();
  }
};

run().catch((error) => {
  console.error('Error ejecutando seed:', error);
  process.exitCode = 1;
});
