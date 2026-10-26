import type { ContentTier, MagazineMeta } from '@/components/MagazineShell';

export interface ContentEntry extends MagazineMeta {
  slug: string;
  tier: ContentTier;
}

// Manually curated registry for justin-cma artifacts (cma.resource-realty.org).
// This file is the content source of truth: unregistered slugs 404
// (dynamicParams=false on every tier route).
//
// Contract with justins-skills/skills/artifacts/scripts/add-artifact.sh:
// the registry object MUST close with exactly
//   };
//
// export function getContentByTier
// — that marker is what the script patches to insert new entries. Do not
// reformat the closing brace or move the export.
//
// PII: public entries are SEO-indexed — never register a client-identifying
// title/description at tier "public".
export const registry: Record<string, ContentEntry> = {
  'cma-methodology': {
    slug: 'cma-methodology',
    tier: 'public',
    title: 'How We Build a Comparative Market Analysis',
    description:
      'The method behind a Resource Realty CMA — comparable selection, adjustment logic, and how to read the resulting price range.',
    tag: 'Methodology',
    published: '2026-10-26',
    author: 'Justin',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How We Build a Comparative Market Analysis',
      description:
        'The method behind a Resource Realty CMA — comparable selection, adjustment logic, and how to read the resulting price range.',
      author: {
        '@type': 'Organization',
        name: 'Justin',
      },
      datePublished: '2026-10-26',
    },
  },
  'sample-client-cma': {
    slug: 'sample-client-cma',
    tier: 'semi',
    title: 'Sample Client CMA — Q4 2026',
    description:
      'Client-facing sample CMA presented behind Cloudflare Access Email OTP (24h session).',
    tag: 'CMA',
    published: '2026-10-26',
    author: 'Justin',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Sample Client CMA — Q4 2026',
      description:
        'Client-facing sample CMA presented behind Cloudflare Access Email OTP (24h session).',
      author: {
        '@type': 'Organization',
        name: 'Justin',
      },
      datePublished: '2026-10-26',
    },
  },
  'internal-deal-review': {
    slug: 'internal-deal-review',
    tier: 'private',
    title: 'Internal Deal Review — Working Draft',
    description:
      'Internal-only deal analysis behind the Cloudflare Access email allowlist (8h session). Contains no live PII in this sample.',
    tag: 'Internal',
    published: '2026-10-26',
    author: 'Justin',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Internal Deal Review — Working Draft',
      description:
        'Internal-only deal analysis behind the Cloudflare Access email allowlist (8h session). Contains no live PII in this sample.',
      author: {
        '@type': 'Organization',
        name: 'Justin',
      },
      datePublished: '2026-10-26',
    },
  },
};

export function getContentByTier(tier: ContentTier): ContentEntry[] {
  return Object.values(registry).filter((entry) => entry.tier === tier);
}

export function getContentBySlug(slug: string): ContentEntry | undefined {
  return registry[slug];
}

export function getPublicContent(): ContentEntry[] {
  return getContentByTier('public');
}
