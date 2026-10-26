import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared CMA Reports',
  description: 'Access-controlled client CMA reports',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SemiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="site">{children}</div>;
}
