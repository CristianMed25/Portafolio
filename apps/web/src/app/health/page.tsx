import type { Metadata } from 'next';

import { Container } from '@/components/container';
import { checkStrapiConnection } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Health',
  description: 'Estado de conexión del frontend con Strapi.',
};

export const revalidate = 30;

export default async function HealthPage() {
  const strapiUp = await checkStrapiConnection();
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="surface-card max-w-2xl space-y-4 rounded-2xl p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Health Check</h1>
          <p className="text-sm text-[var(--text-secondary)]">Estado de conectividad para validar despliegue de frontend y CMS.</p>

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-soft)] bg-[rgba(103,121,230,0.1)] px-4 py-2">
              <span className="text-[var(--text-secondary)]">Frontend</span>
              <span className="text-[var(--text-primary)]">OK</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-soft)] bg-[rgba(103,121,230,0.1)] px-4 py-2">
              <span className="text-[var(--text-secondary)]">Strapi ({strapiUrl})</span>
              <span className={strapiUp ? 'text-emerald-300' : 'text-amber-300'}>{strapiUp ? 'Reachable' : 'Unreachable (fallback activo)'}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
