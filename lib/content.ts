import fs from 'fs';
import path from 'path';

export type Tier = 'public' | 'semi' | 'private';

export interface ContentItem {
  slug: string;
  title: string;
  tier: Tier;
  description?: string;
  tags?: string[];
  html: string;
}

export function getContentDir(tier: Tier): string {
  return path.join(process.cwd(), 'content', tier);
}

function extractTitle(html: string, slug: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : slug;
}

function extractDescription(html: string): string | undefined {
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  );
  if (descMatch) return descMatch[1].trim();

  const descMatchAlt = html.match(
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i
  );
  return descMatchAlt ? descMatchAlt[1].trim() : undefined;
}

function parseHtmlFile(filePath: string, tier: Tier): ContentItem {
  const slug = path.basename(filePath, '.html');
  const html = fs.readFileSync(filePath, 'utf-8');

  return {
    slug,
    title: extractTitle(html, slug),
    tier,
    description: extractDescription(html),
    html,
  };
}

export function loadContent(tier: Tier): ContentItem[] {
  const dir = getContentDir(tier);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .sort();

  return files.map((file) => parseHtmlFile(path.join(dir, file), tier));
}

export function loadContentItem(tier: Tier, slug: string): ContentItem | null {
  // Reject path traversal — slug must be a simple filename stem
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return null;
  }

  const file = path.join(getContentDir(tier), `${slug}.html`);
  if (!fs.existsSync(file)) return null;

  return parseHtmlFile(file, tier);
}
