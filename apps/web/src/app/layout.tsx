import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import { Navbar } from '@/components/navbar';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tu Nombre | Portafolio',
    template: '%s | Tu Nombre',
  },
  description: 'Portafolio de desarrollo web y backend con enfoque minimalista y performance-first.',
  openGraph: {
    title: 'Tu Nombre | Portafolio',
    description: 'Portafolio de desarrollo web y backend con enfoque minimalista y performance-first.',
    type: 'website',
    url: siteUrl,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} bg-background text-foreground antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
