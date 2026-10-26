import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MagazineShell, { magazineMetadata } from '@/components/MagazineShell';
import { getContentBySlug, getPublicContent } from '@/content/registry';

// Unregistered slugs 404 — the registry is the content source of truth.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicContent().map((entry) => ({
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

  if (!entry || entry.tier !== 'public') {
    return {};
  }

  return magazineMetadata({ tier: 'public', meta: entry, slug });
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getContentBySlug(slug);

  if (!entry || entry.tier !== 'public') {
    notFound();
  }

  return <MagazineShell slug={slug} tier="public" meta={entry} />;
}
