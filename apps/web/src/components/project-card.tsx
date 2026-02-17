import Image from 'next/image';
import Link from 'next/link';

import { getStrapiMediaUrl } from '@/lib/strapi';
import type { Project } from '@/lib/types';

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const coverUrl = getStrapiMediaUrl(project.cover);
  const coverAlt = project.cover?.alternativeText || project.title;
  const coverWidth = project.cover?.width ?? 1200;
  const coverHeight = project.cover?.height ?? 800;

  return (
    <article className="surface-card group rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative mb-4 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-gradient-to-br from-[rgba(68,120,255,0.18)] via-[rgba(90,86,233,0.2)] to-[rgba(139,92,246,0.2)]">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              width={coverWidth}
              height={coverHeight}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-52"
            />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm font-medium text-[var(--text-secondary)] sm:h-52">
              Sin imagen
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">{project.title}</h3>
          {project.summary ? <p className="text-sm text-[var(--text-secondary)]">{project.summary}</p> : null}
        </div>
      </Link>

      {project.stack && project.stack.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <li key={item} className="chip rounded-full px-2.5 py-1 text-xs">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
};
