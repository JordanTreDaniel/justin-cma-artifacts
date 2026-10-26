import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public CMA Resources',
  description: 'Open Comparative Market Analysis methodology and case studies',
  openGraph: {
    title: 'Public CMA Resources',
    description: 'Open Comparative Market Analysis methodology and case studies',
    type: 'website',
    url: 'https://cma.resource-realty.org/public/',
  },
  twitter: {
    title: 'Public CMA Resources',
    description: 'Open Comparative Market Analysis methodology and case studies',
    card: 'summary',
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="site">{children}</div>;
}
