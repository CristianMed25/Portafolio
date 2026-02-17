import Link from 'next/link';

import { Container } from '@/components/container';

export default function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <div className="surface-card max-w-xl space-y-4 rounded-2xl p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">No encontrado</h1>
          <p className="text-sm text-[var(--text-secondary)]">La ruta solicitada no existe o el contenido aún no está publicado.</p>
          <Link href="/" className="text-sm text-[var(--accent-cyan)] underline underline-offset-4">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </section>
  );
}
