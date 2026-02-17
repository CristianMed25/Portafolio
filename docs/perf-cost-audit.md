# Auditoría de Performance y Costos (Baseline)

Fecha: 2026-02-17  
Proyecto: `apps/web` (Next.js 16 App Router) + `apps/cms` (Strapi v5)

## Objetivo
Reducir consumo del free tier de Strapi Cloud y Vercel en tres frentes:
- Requests API a Strapi
- Bandwidth de assets (imágenes/medios)
- Render dinámico/ejecución server en Vercel

## Inventario de consumo a Strapi

### Capa de acceso
- Archivo: `apps/web/src/lib/strapi.ts`
- Funciones:
  - `getSite()`
  - `getProjects(options)`
  - `getProjectBySlug(slug)`
  - `getAllProjectSlugs()`
  - `checkStrapiConnection()`
- Todas usan `strapiFetch()` con `next: { revalidate: 60 }` (muy agresivo para contenido tipo portafolio).

### Rutas/páginas que consultan Strapi
- `apps/web/src/app/page.tsx`
  - Llama `getSite()` + `getProjects()`
  - Total: 2 requests por regeneración de caché.
- `apps/web/src/app/projects/page.tsx`
  - Llama `getProjects()`
  - Total: 1 request por regeneración.
- `apps/web/src/app/projects/[slug]/page.tsx`
  - `generateStaticParams()` llama `getAllProjectSlugs()` (build/revalidación).
  - `generateMetadata()` llama `getProjectBySlug(slug)`.
  - Página llama `getProjectBySlug(slug)`.
  - Riesgo de doble fetch por slug (metadata + page), aunque Next puede deduplicar por `fetch`.
- `apps/web/src/app/sitemap.ts`
  - Llama `getAllProjectSlugs()`.
- `apps/web/src/app/health/page.tsx`
  - Llama `checkStrapiConnection()`.

## Baseline de requests por flujo típico

Flujo: Home -> Listado -> Detalle (1 proyecto)
- Home: 2 calls (`/api/site`, `/api/projects`)
- Listado: 1 call (`/api/projects`)
- Detalle: 1-2 calls (`/api/projects?filters[slug]=...`) por metadata + page
- Total estimado baseline: **4-5 calls** por ciclo de regeneración

Notas:
- Con `revalidate: 60`, este ciclo puede repetirse con mucha frecuencia.
- Cuando Strapi cae, el frontend usa fallback mock, pero sigue intentando requests en cada render.

## Payload y consultas
- Ya hay uso de `fields`/`populate`, lo cual es correcto.
- Mejoras detectadas:
  - `getProjects()` pide `repoUrl`/`demoUrl`/`liveUrl` para cards, pero no se usan en Home/Listado.
  - Home consume lista completa de proyectos cuando puede reducirse a subset.
  - `socials: true` en `getSite()` podría acotarse a campos mínimos.

## SSR/ISR y caché actual
- Páginas públicas usan `revalidate = 60`.
- No hay endpoint de revalidación bajo demanda; todo depende de polling por TTL corto.
- No hay estrategia por tags para invalidar selectivamente.

## Assets / imágenes
- Se usa `next/image` en cards y detalle (bien).
- Faltan `sizes` para indicar ancho responsive y reducir bytes servidos.
- `next.config.ts` no fuerza formatos modernos ni `minimumCacheTTL` para imágenes remotas.

## Observabilidad
- No hay contador/logging mínimo para detectar patrones de sobreconsumo de requests.

## Riesgos de costo detectados
- ISR demasiado frecuente para contenido poco cambiante.
- Regeneración por múltiples rutas con queries similares.
- Potencial doble fetch en detalle (metadata + page).
- Reintentos constantes cuando Strapi está caído.
