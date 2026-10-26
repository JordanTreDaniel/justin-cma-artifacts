import Link from 'next/link';
import { BrandHeader } from '@/components/BrandHeader';
import { getPublicContent } from '@/content/registry';

export default function PublicIndex() {
  const items = getPublicContent();

  return (
    <div className="site-inner">
      <header className="site-header">
        <BrandHeader />
        <Link href="/" className="back-link">
          ← Home
        </Link>
      </header>

      <p className="eyebrow">Public · Open · SEO-indexed</p>
      <h1>CMA Methodology &amp; Case Studies</h1>
      <p className="lede">
        Public material only — no PII, no client names. Anything
        client-identifying belongs in the shared or private tier.
      </p>

      <div className="artifact-grid">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/public/${item.slug}/`}
            className="artifact-card"
          >
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.tag && <span className="tag">{item.tag}</span>}
          </Link>
        ))}

        {items.length === 0 && (
          <div className="empty-state">No public artifacts registered yet.</div>
        )}
      </div>
    </div>
  );
}
