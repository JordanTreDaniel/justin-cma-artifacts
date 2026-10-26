import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccessGate } from '@/components/AccessGate';
import MagazineShell, { magazineMetadata } from '@/components/MagazineShell';
import { getContentBySlug, getContentByTier } from '@/content/registry';

// Unregistered slugs 404 — the registry is the content source of truth.
export const dynamicParams = false;

export function generateStaticParams() {
  return getContentByTier('semi').map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getContentBySlug(slug);

  if (!entry || entry.tier !== 'semi') {
    return {};
  }

  return magazineMetadata({ tier: 'semi', meta: entry, slug });
}

export default async function SemiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getContentBySlug(slug);

  if (!entry || entry.tier !== 'semi') {
    notFound();
  }

  return (
    <div className="site-inner">
      <AccessGate tier="semi" />
      <MagazineShell slug={slug} tier="semi" meta={entry} />
    </div>
  );
}
