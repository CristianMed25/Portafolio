import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/container';
import { Markdown } from '@/components/markdown';
import { getAllProjectSlugs, getProjectBySlug, getStrapiMediaUrl } from '@/lib/strapi';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-static';
export const revalidate = 3600;

export const generateStaticParams = async () => {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
      description: 'No se encontró el proyecto solicitado.',
    };
  }

  return {
    title: project.title,
    description: project.summary ?? 'Detalle de proyecto.',
  };
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const coverUrl = getStrapiMediaUrl(project.cover);
  const coverWidth = project.cover?.width ?? 1400;
  const coverHeight = project.cover?.height ?? 900;
  const demoUrl = project.demoUrl ?? project.liveUrl;
  const galleryItems = project.gallery ?? [];

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/projects" className="text-sm text-[var(--accent-cyan)] underline underline-offset-4">
            Volver a proyectos
          </Link>
        </div>

        <article className="space-y-8">
          <header className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">{project.title}</h1>
            {project.summary ? <p className="max-w-3xl text-base text-[var(--text-secondary)]">{project.summary}</p> : null}

            <div className="flex flex-wrap gap-2">
              {(project.stack ?? []).map((item) => (
                <span key={item} className="chip rounded-full px-2.5 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary rounded-full px-4 py-2 text-sm">
                  Repositorio
                </a>
              ) : null}

              {demoUrl ? (
                <a href={demoUrl} target="_blank" rel="noreferrer" className="btn-secondary rounded-full px-4 py-2 text-sm">
                  Demo en vivo
                </a>
              ) : null}
            </div>
          </header>

          <div className="space-y-6">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={project.cover?.alternativeText ?? project.title}
                width={coverWidth}
                height={coverHeight}
                sizes="(max-width: 1024px) 100vw, 1120px"
                className="w-full rounded-2xl border border-[var(--border-soft)] object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-gradient-to-br from-[rgba(68,120,255,0.2)] via-[rgba(97,88,238,0.22)] to-[rgba(139,92,246,0.24)] text-sm font-medium text-[var(--text-secondary)]">
                Sin imagen de portada
              </div>
            )}

            {galleryItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {galleryItems.map((image) => {
                  const url = getStrapiMediaUrl(image);
                  if (!url) {
                    return null;
                  }

                  return (
                    <Image
                      key={image.documentId}
                      src={url}
                      alt={image.alternativeText ?? project.title}
                      width={image.width ?? 1000}
                      height={image.height ?? 700}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full rounded-xl border border-[var(--border-soft)] object-cover"
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="max-w-3xl">
            <Markdown content={project.description ?? 'Sin descripción disponible.'} />
          </div>
        </article>
      </Container>
    </section>
  );
}
