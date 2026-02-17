# Resultados Performance/Costos (Antes vs Después)

Fecha: 2026-02-17

## Resumen ejecutivo
- **API calls a Strapi:** reducidas por mayor cacheado, dedupe y revalidación bajo demanda.
- **Bandwidth de imágenes:** reducido con `sizes`, formatos modernos y TTL alto de caché de `next/image`.
- **SSR dinámico en Vercel:** páginas principales ahora salen estáticas/ISR; solo `POST/GET /api/revalidate` queda dinámico por diseño.

## 1) Qué llamaba a Strapi antes

### Flujo típico (baseline)
Home -> Projects -> Project detail:
- Home: `getSite()` + `getProjects()` = 2 requests.
- Projects: `getProjects()` = 1 request.
- Detail: `getProjectBySlug(slug)` en metadata + page (potencial 2) = 1-2 requests.
- Total por ciclo de regeneración: **4-5 requests**.

### Factores de costo baseline
- `revalidate: 60` en páginas públicas (regeneración muy frecuente para contenido estable).
- Sin webhook de revalidación bajo demanda.
- Sin backoff al fallar Strapi (reintentos continuos, aunque con fallback mock).

## 2) Cambios implementados

## A. Capa de datos Strapi optimizada
Archivo: `apps/web/src/lib/strapi.ts`
- Se mantuvo acceso centralizado y se reforzó:
  - `cache()` de React para dedupe por request/render.
  - ventanas de cache por recurso:
    - site: 6h
    - projects list: 30m
    - project detail: 1h
    - slugs sitemap/static params: 24h
    - health: 5m
  - tags de revalidación (`strapi:*`) para invalidación selectiva.
  - queries más acotadas en listado (`fields` mínimos; sin links de repo/demo).
  - **circuit breaker**: si Strapi falla, se evita reintentar por 45s y entra fallback mock.
  - logging opcional para auditoría local: `LOG_STRAPI_REQUESTS=true`.

## B. Rutas públicas a estático/ISR
Archivos:
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/projects/page.tsx`
- `apps/web/src/app/projects/[slug]/page.tsx`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/app/health/page.tsx`

Cambios:
- `dynamic = 'force-static'` en páginas públicas.
- ISR ajustado a ventanas mayores (30m, 1h, 1d según ruta).
- `generateStaticParams` sigue activo para slugs y mantiene SEO.

Resultado:
- Navegación normal no dispara SSR por request.
- Mayor proporción de respuestas desde caché/CDN de Vercel.

## C. Revalidación on-demand (webhook-ready)
Archivo: `apps/web/src/app/api/revalidate/route.ts`

Se agregó endpoint protegido con `REVALIDATE_SECRET`:
- `GET /api/revalidate?secret=...&model=project&slug=...`
- `POST /api/revalidate` (payload tipo webhook Strapi)

Acciones:
- `revalidateTag(..., 'max')`
- `revalidatePath(...)`

Tags/paths revalidados por modelo:
- site -> `/`, tags de site/homepage
- project -> `/`, `/projects`, `/projects/[slug]`, `/sitemap.xml`
- tag -> `/`, `/projects`, `/sitemap.xml`

## D. Optimización de imágenes/bandwidth
Archivos:
- `apps/web/src/components/project-card.tsx`
- `apps/web/src/app/projects/[slug]/page.tsx`
- `apps/web/next.config.ts`

Cambios:
- `sizes` responsivos en `<Image />`.
- Uso de dimensiones reales de media cuando existen.
- `images.formats = ['image/avif', 'image/webp']`.
- `images.minimumCacheTTL = 30 días` para cache más agresivo del optimizador.

## E. Variables de entorno
Archivo: `apps/web/.env.example`
- `REVALIDATE_SECRET`
- `LOG_STRAPI_REQUESTS`

## 3) Antes vs después (estimado)

## API calls a Strapi
- Antes:
  - ciclo típico de regeneración: 4-5 calls
  - frecuencia alta por `revalidate: 60s`
- Después:
  - páginas servidas estáticas/ISR con TTL mayor
  - dedupe por `cache()` + fetch cache
  - invalidación puntual por webhook
  - en navegación normal desde caché: **0 calls** a Strapi en runtime de usuario
  - llamadas concentradas en build/regeneración o evento de publicación

## Asset bandwidth
- Antes:
  - menos control de `sizes`; posible sobre-descarga en breakpoints pequeños
- Después:
  - `sizes` en cards y detalle, formatos modernos y TTL alto
  - menos bytes transferidos por imagen y mejor cache hit

## SSR / ejecución dinámica en Vercel
- Antes:
  - mayor frecuencia de regeneración por TTL corto
- Después:
  - Home, listado, detalle, sitemap y health quedan estáticos/ISR
  - dinámico solo `api/revalidate` (intencional, admin-only)

## 4) Opcional (no implementado por costo/trade-off)
- Cloudinary/S3 como provider de media para Strapi (reduce presión de storage local y mejora pipeline de imágenes).
- CDN de media dedicada fuera de Strapi Cloud (si escala el volumen de assets).
- Monitoreo avanzado/paid en Vercel (Analytics avanzados, trazas premium).

## 5) Cómo validar rápido
- Build:
  - `npm --prefix apps/web run build`
  - `npm run build`
- Ver rutas estáticas:
  - revisar salida de build (Home/Projects/Detail/Sitemap como `○` o `●` ISR)
- Probar revalidación manual:
  - `GET /api/revalidate?secret=TU_SECRETO&model=project&slug=mi-slug`
  - validar respuesta JSON `ok: true`.
