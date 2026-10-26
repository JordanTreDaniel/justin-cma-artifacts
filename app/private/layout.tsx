import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private CMA Reports',
  description: 'Allowlist-only internal analysis and deal content',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="site">{children}</div>;
}
