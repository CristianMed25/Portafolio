import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/container';
import { getSite, getStrapiMediaUrl } from '@/lib/strapi';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
];

const getInitials = (name: string): string => {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return 'CM';
  }

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? '')
    .join('');
};

export const Navbar = async () => {
  const site = await getSite();
  const avatarUrl = getStrapiMediaUrl(site.avatar);
  const initials = getInitials(site.name);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-base)_76%,transparent)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/#home"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={site.avatar?.alternativeText ?? `Avatar de ${site.name}`}
              width={site.avatar?.width ?? 64}
              height={site.avatar?.height ?? 64}
              sizes="32px"
              className="h-8 w-8 rounded-full border border-[var(--border-strong)] object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-strong)] bg-gradient-to-br from-[rgba(56,189,248,0.34)] via-[rgba(103,121,230,0.36)] to-[rgba(139,92,246,0.38)] text-xs font-semibold text-white"
            >
              {initials}
            </span>
          )}
          <span>{site.name}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-0.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/#projects" className="btn-secondary rounded-full px-4 py-1.5 text-sm">
          Projects
        </Link>
      </Container>
    </header>
  );
};
