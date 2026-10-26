import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import MagazineInteractions from './MagazineInteractions';
import '../content/magazine.css';

export type ContentTier = 'public' | 'semi' | 'private';

export interface MagazineMeta {
  title: string;
  description: string;
  published?: string;
  tag?: string;
  author?: string;
  jsonLd?: Record<string, unknown>;
}

interface MagazineShellProps {
  slug: string;
  tier: ContentTier;
  meta: MagazineMeta;
}

const TIER_ORDER: ContentTier[] = ['public', 'semi', 'private'];

function loadBody(slug: string): string {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return '';
  }

  const contentDir = path.join(process.cwd(), 'content');

  for (const tier of TIER_ORDER) {
    const filePath = path.join(contentDir, tier, `${slug}.html`);
    if (!fs.existsSync(filePath)) continue;

    const html = fs.readFileSync(filePath, 'utf-8');

    // Preserve <style> blocks (self-contained HTML ships CSS in <head>)
    const styles = Array.from(
      html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi),
      (m) => m[1]
    ).join('\n');

    // Preserve font/preconnect links from <head> (not injected into <body>)
    const headLinks = Array.from(
      html.matchAll(
        /<link\b[^>]*(?:href=["']https:\/\/fonts\.[^"']+["'])[^>]*>/gi
      ),
      (m) => m[0]
    ).join('\n');

    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let body = bodyMatch ? bodyMatch[1] : html;

    // Remove script tags — MagazineShell is script-free by contract. Charts,
    // fetch(), and inline JS are dead in content HTML; interactivity must be a
    // Next client component or omitted.
    body = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Prepend styles + font links so head deps survive body extraction
    const head = [
      headLinks,
      styles ? `<style>${styles}</style>` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return head ? `${head}${body}` : body;
  }

  return '';
}

// Substitution #1: site URL — this repo serves cma.resource-realty.org,
// NOT the upstream portfolio domain. Overridable at build time only
// (NEXT_PUBLIC_SITE_URL is inert as a Pages runtime secret).
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cma.resource-realty.org';

export function magazineMetadata({
  tier,
  meta,
  slug,
}: Omit<MagazineShellProps, 'slug'> & { slug: string }): Metadata {
  const url = `${SITE_URL}/${tier}/${slug}/`;

  const base: Metadata = {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      // Absolute canonical URL — unfurlers (Notion/Slack) need this to
      // resolve the page they're embedding.
      url,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      // summary, not summary_large_image: no og:image exists. Large-image
      // cards without an image break some unfurlers.
      card: 'summary',
    },
  };

  // semi + private are gated tiers — always noindex, even though CF Access
  // blocks crawlers at the edge.
  if (tier !== 'public') {
    base.robots = {
      index: false,
      follow: false,
    };
  }

  return base;
}

export default function MagazineShell({ slug, tier, meta }: MagazineShellProps) {
  const body = loadBody(slug);

  return (
    <main className="magazine-root min-h-screen" data-tier={tier}>
      {meta.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: body }} />

      <MagazineInteractions />
    </main>
  );
}
