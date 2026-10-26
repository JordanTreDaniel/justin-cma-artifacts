import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display, Geist_Mono } from 'next/font/google';
import './globals.css';

// Resource Realty brand fonts (web/linen variant).
// Fonts are embedded at build time; content HTML fragments carry their own
// Google Fonts <link> tags, which MagazineShell preserves verbatim.
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const SITE_URL = 'https://cma.resource-realty.org';

export const metadata: Metadata = {
  title: 'Resource Realty — Comparative Market Analysis',
  description:
    'Comparative Market Analysis reports and property research from Resource Realty.',
  openGraph: {
    title: 'Resource Realty — Comparative Market Analysis',
    description:
      'Comparative Market Analysis reports and property research from Resource Realty.',
    type: 'website',
    url: `${SITE_URL}/`,
  },
  twitter: {
    title: 'Resource Realty — Comparative Market Analysis',
    description:
      'Comparative Market Analysis reports and property research from Resource Realty.',
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables MUST hang off <html>: globals.css consumes them from
    // `:root`. A variable first declared on <body> is undefined at :root, the
    // `var()` chain becomes invalid-at-computed-value time, and every heading
    // silently falls back to the system font.
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
