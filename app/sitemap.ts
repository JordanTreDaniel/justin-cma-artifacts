import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/content/registry';

export const dynamic = 'force-static';

// Substitution #1: canonical site URL is cma.resource-realty.org.
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cma.resource-realty.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const publicItems = getPublicContent();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now },
    { url: `${BASE_URL}/public/`, lastModified: now },
  ];

  // Only public-tier URLs are listed — semi/private are Access-gated and
  // noindex; putting them in a sitemap would leak slugs to crawlers.
  const publicPages: MetadataRoute.Sitemap = publicItems.map((item) => ({
    url: `${BASE_URL}/public/${item.slug}/`,
    lastModified: now,
  }));

  return [...staticPages, ...publicPages];
}
