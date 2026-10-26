import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccessGate } from '@/components/AccessGate';
import MagazineShell, { magazineMetadata } from '@/components/MagazineShell';
import { getContentBySlug, getContentByTier } from '@/content/registry';

// Unregistered slugs 404 — the registry is the content source of truth.
export const dynamicParams = false;

export function generateStaticParams() {
  return getContentByTier('private').map((entry) => ({
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

  if (!entry || entry.tier !== 'private') {
    return {};
  }

  return magazineMetadata({ tier: 'private', meta: entry, slug });
}

export default async function PrivatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getContentBySlug(slug);

  if (!entry || entry.tier !== 'private') {
    notFound();
  }

  return (
    <div className="site-inner">
      <AccessGate tier="private" />
      <MagazineShell slug={slug} tier="private" meta={entry} />
    </div>
  );
}
