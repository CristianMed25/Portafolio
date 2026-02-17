import type { Metadata } from 'next';

import { Container } from '@/components/container';
import { ProjectCard } from '@/components/project-card';
import { getProjects } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Listado completo de proyectos publicados.',
};

export const dynamic = 'force-static';
export const revalidate = 1800;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-10 max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">Projects</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Colección completa de proyectos.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.documentId} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No hay proyectos publicados todavía.</p>
        )}
      </Container>
    </section>
  );
}
