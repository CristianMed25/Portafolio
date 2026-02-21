import type { Project, Site } from '@/lib/types';

export const mockSite: Site = {
  id: 3,
  documentId: 'gppajwmmff79acjlebgygauy',
  name: 'Cristian Javier Medina Barrios',
  headline: 'Desarrollador Web • Backend/Full-stack',
  location: 'Bogotá, Colombia',
  about:
    'Soy desarrollador web con enfoque en backend/full-stack. Me gusta construir sistemas claros y escalables: APIs REST bien estructuradas, autenticación segura, modelado de datos (SQL/NoSQL) y despliegue reproducible (Docker). También disfruto optimizar performance y experiencia de desarrollo (validaciones, documentación con Swagger/OpenAPI, buenas prácticas y organización del código).',
  email: 'crmedinab@unal.edu.co',
  socials: [
    {
      id: 5,
      label: 'Github',
      url: 'https://github.com/CristianMed25',
      icon: 'github',
    },
    {
      id: 6,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/cristian-javier-medina-barrios-0109281ab/',
      icon: 'linkedin',
    },
  ],
  avatar: {
    id: 11,
    documentId: 'qrahmsh3luf0jzyj030tlwot',
    url: 'https://willing-deer-9e0a998776.media.strapiapp.com/mikito_mk_ejecutivo_con_filtro_9e2b5bc8f1.jpg',
    alternativeText: null,
    width: 389,
    height: 389,
  },
};

export const mockProjects: Project[] = [
  {
    id: 2,
    documentId: 'qvin6kh5ypiyybnrnla16ikk',
    title: 'Sitlen',
    slug: 'project',
    summary: 'Plataforma educativa con backend en Firebase y autenticación completa.',
    description: `## Description

Backend para una plataforma educativa (estudiantes, cursos, matrículas/pensiones). Implementé autenticación (registro/login), recuperación y restablecimiento de contraseña, manejo de tokens y utilidades de seguridad. También trabajé en el modelado de datos en Firestore y en decisiones de arquitectura para mantener el proyecto modular y mantenible.

## Bullets

- Auth completa: registro/login, recuperación/restablecimiento de contraseña, manejo de tokens (JWT).

- Modelado y relaciones en Firestore para entidades académicas (estudiantes/cursos/etc.).

- Validación y manejo de errores consistente para endpoints.

- Configuración para entornos (dev/prod/emuladores) y buenas prácticas de secretos/variables.

- Documentación/colecciones para pruebas (Swagger/Postman).`,
    featured: false,
    order: 0,
    stack: ['Node.js', 'Express', 'Firebase', 'Firestore', 'JWT', 'Cloud Functions', 'Swagger', 'Postman'],
    repoUrl: null,
    demoUrl: null,
    liveUrl: null,
    tags: [
      { id: 6, documentId: 'z538xmf8z3gat8asr5regzeu', name: 'Backend', slug: 'backend' },
      { id: 5, documentId: 'rwob4gzmsegy9k2jyj3fka0f', name: 'Frontend', slug: 'frontend' },
    ],
    cover: {
      id: 2,
      documentId: 'l1ln4ezt6zc63lbh0g0shz0b',
      url: 'https://willing-deer-9e0a998776.media.strapiapp.com/sitlen_logo_fd1db1ec21.png',
      alternativeText: null,
      width: 1023,
      height: 939,
    },
    gallery: [
      {
        id: 9,
        documentId: 'hukw38u31rzn78tbqbwpil9z',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/landing_a66fa3d968.png',
        alternativeText: null,
        width: 1855,
        height: 929,
      },
      {
        id: 5,
        documentId: 'twlogsa00ov4b8rdlsrh6gqn',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/home_4353e6df22.png',
        alternativeText: null,
        width: 1853,
        height: 926,
      },
      {
        id: 6,
        documentId: 'gqlvsj41fjbj14ns0e7p1k5h',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/home_2_7b33598ed5.png',
        alternativeText: null,
        width: 1856,
        height: 929,
      },
      {
        id: 10,
        documentId: 'yn3k3fpalzjb0a1j4c2v2j4a',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/login_ab0becf21b.png',
        alternativeText: null,
        width: 1872,
        height: 929,
      },
      {
        id: 3,
        documentId: 'zknbcy00q5of6e7mwtblhent',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/Pagina_principal_admin_59ac70da5f.png',
        alternativeText: null,
        width: 1855,
        height: 931,
      },
      {
        id: 7,
        documentId: 'qurchwxllyfg94j5klw45ovf',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/cuenta_profesor_c313dc4b27.png',
        alternativeText: null,
        width: 1870,
        height: 927,
      },
      {
        id: 4,
        documentId: 'kqvb92q8tumtm82h7dk86c94',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/Pagina_principal_estudiante_7d79e50e41.png',
        alternativeText: null,
        width: 1853,
        height: 922,
      },
      {
        id: 8,
        documentId: 'p0qegy65wtkitya2aql3rbur',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/vista_salon_estudiante_1dc6f4aa1c.png',
        alternativeText: null,
        width: 1855,
        height: 925,
      },
    ],
  },
  {
    id: 11,
    documentId: 'osptjlfld81k59jnj38zwjjt',
    title: 'FindIt UNAL',
    slug: 'project-1',
    summary: 'Plataforma de objetos perdidos/encontrados con chat y notificaciones en tiempo real.',
    description: `## Description

Aplicación web para la comunidad de la Universidad Nacional de Colombia que permite reportar objetos perdidos/encontrados, buscar con filtros y coordinar devoluciones mediante mensajería en tiempo real. Integra autenticación con Google OAuth (solo correos institucionales) y un panel administrativo.

## Bullets (backend):

- API REST en Node/TypeScript/Express con BD MySQL y estructura por controladores/servicios.

- OAuth 2.0 con Google, JWT, roles y panel de administración.

- Chat + notificaciones en tiempo real con Socket.IO.

- Subida/gestión de imágenes con Multer + validaciones con Zod.

- Documentación Swagger/OpenAPI y suite de scripts (lint/test/build).

- Dockerización + compose dev/prod para levantar API + DB.

## Bullets (frontend):

- SPA en React/TS con Tailwind, estado global con Zustand y data-fetching con React Query.

- Tema oscuro/claro + enfoque en performance (lazy loading/code splitting).`,
    featured: false,
    order: 0,
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Node.js', 'Express', 'MySQL', 'Socket.IO', 'OAuth', 'Swagger', 'Docker'],
    repoUrl: 'https://github.com/FindItUnal',
    demoUrl: null,
    liveUrl: null,
    tags: [
      { id: 6, documentId: 'z538xmf8z3gat8asr5regzeu', name: 'Backend', slug: 'backend' },
      { id: 5, documentId: 'rwob4gzmsegy9k2jyj3fka0f', name: 'Frontend', slug: 'frontend' },
    ],
    cover: {
      id: 14,
      documentId: 'ehkmx1uni3s381rm2hdqwyoh',
      url: 'https://willing-deer-9e0a998776.media.strapiapp.com/findit_logo_2_422f95a355.png',
      alternativeText: null,
      width: 1536,
      height: 1024,
    },
    gallery: [
      {
        id: 25,
        documentId: 'y45kly10ev5zl1bnt7nyteji',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/landing_92c408f9ec.png',
        alternativeText: null,
        width: 1866,
        height: 918,
      },
      {
        id: 19,
        documentId: 'bffgr6ujfo20wgn0hkxvd3ps',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/inicio_de_sesion_6fff840f37.png',
        alternativeText: null,
        width: 1866,
        height: 919,
      },
      {
        id: 20,
        documentId: 'nlc4yrcyj1zw4ypp8g5lnm5z',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/home_0acd4b9e90.png',
        alternativeText: null,
        width: 1865,
        height: 917,
      },
      {
        id: 24,
        documentId: 'xhcxob9mwhdri7hl0qaa78ps',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/objeto_detallado_d18b5af745.png',
        alternativeText: null,
        width: 1859,
        height: 909,
      },
      {
        id: 22,
        documentId: 'roug4y36l85gq82z2d2vmoz3',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/inicio_conversacion_e52dcf19c3.png',
        alternativeText: null,
        width: 1863,
        height: 917,
      },
      {
        id: 26,
        documentId: 'sbomffd8gu8bgyvyntybfpan',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/panel_admin_563cacc332.png',
        alternativeText: null,
        width: 1899,
        height: 1065,
      },
      {
        id: 21,
        documentId: 'mt3tgldakm53zoo2dte48rwl',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/Gestion_de_usuarios_fb6851350d.png',
        alternativeText: null,
        width: 1893,
        height: 1055,
      },
      {
        id: 23,
        documentId: 'me6il9237qni7bfu9urmuxdx',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/cuenta_suspendida_b9975b34ee.png',
        alternativeText: null,
        width: 1897,
        height: 1062,
      },
    ],
  },
  {
    id: 10,
    documentId: 'ptem0d7wc8mv8b8sr7ek3g4o',
    title: 'Librería Online',
    slug: 'project-2',
    summary: 'Arquitectura con API Gateway en GraphQL y microservicios en Django y Spring Boot.',
    description: `## Description

Proyecto académico de arquitectura donde se separan dominios en microservicios (usuarios y catálogo/préstamos) y se expone un punto único de entrada mediante un API Gateway en GraphQL. Incluye autenticación en el gateway y despliegue en contenedores para el gateway.

## Bullets

- API Gateway en GraphQL con Apollo Server + REST DataSources (user/purchase/rental).

- Microservicio de usuarios con Django + DRF + JWT + conector a Postgres.

- Microservicios de libros y préstamos con Spring Boot (starter web + data-mongodb).

- Dockerfile del gateway para ejecución reproducible.`,
    featured: false,
    order: 0,
    stack: ['GraphQL', 'Apollo Server', 'Node.js', 'Django', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'Docker'],
    repoUrl:
      'BackUser (Django): https://github.com/JSebastianCelisP/BackUserCiclo4 | BackBook (Spring): https://github.com/JSebastianCelisP/BackBookCiclo4 | API Gateway (GraphQL):  https://github.com/CristianJMB/LibreriaApiGateway',
    demoUrl: null,
    liveUrl: null,
    tags: [],
    cover: {
      id: 13,
      documentId: 'fkkh3ledybaoeyz217zmd6v7',
      url: 'https://willing-deer-9e0a998776.media.strapiapp.com/Logo_libreria_75b7073918.png',
      alternativeText: null,
      width: 1536,
      height: 1024,
    },
    gallery: [
      {
        id: 15,
        documentId: 'ergtjta96arefns05kezq9y5',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/login_b01771235a.png',
        alternativeText: null,
        width: 1897,
        height: 929,
      },
      {
        id: 16,
        documentId: 'it7s77snk8m80v39apv0jfkz',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/interfaz_c251df9a20.png',
        alternativeText: null,
        width: 1899,
        height: 927,
      },
      {
        id: 18,
        documentId: 'bqe5q2ktv3tynw51f3fujt32',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/libros_5c6a2d39c9.png',
        alternativeText: null,
        width: 1902,
        height: 923,
      },
      {
        id: 17,
        documentId: 'xj4dc7r9szndvf2alytcb069',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/detalle_libro_0d8ca38f16.png',
        alternativeText: null,
        width: 1895,
        height: 920,
      },
    ],
  },
  {
    id: 15,
    documentId: 'o4dgn6b3gbtwuyfvaxz8mqmi',
    title: 'Portafolio de proyectos',
    slug: 'project-3',
    summary: 'Sitio personal minimalista de alto rendimiento conectado a CMS headless.',
    description: `## Description

Portafolio de proyectos desarrollado con Next.js (App Router) y Tailwind CSS, conectado a Strapi Cloud como CMS headless. Diseñado bajo un enfoque minimalista, prioriza performance, accesibilidad y despliegue optimizado en Vercel. Permite gestionar dinámicamente proyectos, experiencia y contenido desde el panel de Strapi. El proyecto demuestra arquitectura limpia, consumo eficiente de APIs, uso de ISR para optimización de llamadas y una estructura escalable orientada a producción.

## Bullets (arquitectura general):

Aplicación construida con Next.js App Router y Server Components.

Consumo de API REST desde Strapi Cloud con control de fields y populate para optimizar payload.

Uso de ISR (revalidate) y cache inteligente.

Separación clara entre capa de datos (lib/strapi.ts) y capa de presentación.

## Bullets (backend — Strapi CMS):

Modelado de contenido: Site (single type), Projects (collection type), Tags.

Permisos configurados para rol Public (find/findOne).

Optimización de queries con fields y populate selectivo.

Estructura preparada para webhooks y revalidación on-demand.

## Bullets (frontend — Next.js):

Server Components para reducir bundle JS en cliente.

Fetch centralizado con control de cache (revalidate / force-cache).

Optimización de imágenes con next/image.

Diseño responsive con Tailwind CSS.

Estructura modular y escalable.`,
    featured: false,
    order: 0,
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Strapi', 'REST API', 'ISR', 'Vercel', 'Headless CMS'],
    repoUrl: 'https://github.com/CristianMed25/Portafolio',
    demoUrl: null,
    liveUrl: null,
    tags: [{ id: 6, documentId: 'z538xmf8z3gat8asr5regzeu', name: 'Backend', slug: 'backend' }],
    cover: {
      id: 32,
      documentId: 'imvdp59eqswjl47dlojtf908',
      url: 'https://willing-deer-9e0a998776.media.strapiapp.com/logo_portafolio_910c1b32db.png',
      alternativeText: null,
      width: 1536,
      height: 1024,
    },
    gallery: [
      {
        id: 28,
        documentId: 'sgo46n9k9y5zl1bnt7nyteji',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/projects_d4c6012248.png',
        alternativeText: null,
        width: 1870,
        height: 927,
      },
      {
        id: 29,
        documentId: 'nx7v5ii0u911h7evlo3a5o5u',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/site_4f2c6cb132.png',
        alternativeText: null,
        width: 1857,
        height: 933,
      },
      {
        id: 31,
        documentId: 'u9eot9gj7qrwtp422hgwy7uk',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/media_library_a22999e024.png',
        alternativeText: null,
        width: 1857,
        height: 930,
      },
      {
        id: 30,
        documentId: 'dpxtz6wgxpnilzdkiiw03kr1',
        url: 'https://willing-deer-9e0a998776.media.strapiapp.com/content_type_fbdad78a30.png',
        alternativeText: null,
        width: 1858,
        height: 931,
      },
    ],
  },
];
