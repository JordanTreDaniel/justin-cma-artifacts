import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cma.resource-realty.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Home + public tier stay crawlable (unfurl bots need public pages).
        allow: ['/public/', '/'],
        // Gated tiers are noindex and blocked by CF Access at the edge.
        // /out/ is build output — never a real content path.
        disallow: ['/semi/', '/private/', '/out/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
