import Link from 'next/link';

import { Container } from '@/components/container';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-base)_76%,transparent)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/#home" className="text-sm font-semibold tracking-wide text-[var(--text-primary)] transition-colors hover:text-[var(--accent-cyan)]">
          Tu Nombre
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
