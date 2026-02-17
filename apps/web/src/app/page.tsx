import Link from 'next/link';

import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { ProjectCard } from '@/components/project-card';
import { Section } from '@/components/section';
import { getProjects, getSite } from '@/lib/strapi';
import type { SocialLink } from '@/lib/types';

export const revalidate = 60;

const findSocial = (socials: SocialLink[] | undefined, label: string): string => {
  if (!socials) {
    return '#';
  }

  const match = socials.find((item) => item.label.toLowerCase() === label.toLowerCase());
  return match?.url ?? '#';
};

export default async function Home() {
  const [site, projects] = await Promise.all([getSite(), getProjects()]);

  const githubUrl = findSocial(site.socials, 'github');
  const cvUrl = process.env.NEXT_PUBLIC_CV_URL ?? '#';

  return (
    <>
      <section id="home" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-7rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.42),rgba(56,189,248,0.24)_45%,transparent_74%)] blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />

        <Container>
          <div className="relative z-10 max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Portafolio</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-6xl">{site.name}</h1>
            <p className="text-lg text-[var(--text-secondary)] sm:text-xl">{site.headline}</p>
            {site.location ? <p className="text-sm text-[var(--text-muted)]">{site.location}</p> : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#projects" className="btn-primary rounded-full px-5 py-2.5 text-sm font-medium">
                Ver proyectos
              </a>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="btn-secondary rounded-full px-5 py-2.5 text-sm">
                GitHub
              </a>
              <a href={cvUrl} target="_blank" rel="noreferrer" className="btn-secondary rounded-full px-5 py-2.5 text-sm">
                CV
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Section id="about" title="About" description="Resumen profesional editable desde Strapi.">
        <div className="max-w-3xl">
          <Markdown content={site.about ?? ''} />
        </div>
      </Section>

      <Section id="projects" title="Projects" description="Listado rápido y enfocado en impacto.">
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.documentId} project={project} />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/projects" className="btn-secondary inline-flex items-center rounded-full px-5 py-2 text-sm">
                Ver todos
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Aún no hay proyectos publicados.</p>
        )}
      </Section>

      <Section id="contact" title="Contact" description="Canales directos para colaboración o propuestas.">
        <div className="space-y-6">
          {site.email ? (
            <p>
              <a href={`mailto:${site.email}`} className="text-lg text-[var(--accent-cyan)] underline underline-offset-4">
                {site.email}
              </a>
            </p>
          ) : null}

          <ul className="flex flex-wrap gap-3">
            {(site.socials ?? []).map((social) => (
              <li key={`${social.label}-${social.url}`}>
                <a href={social.url} target="_blank" rel="noreferrer" className="btn-secondary inline-flex rounded-full px-3.5 py-1.5 text-sm">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
