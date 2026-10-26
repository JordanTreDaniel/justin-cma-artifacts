import Link from 'next/link';
import { AccessGate } from '@/components/AccessGate';
import { BrandHeader } from '@/components/BrandHeader';
import { getContentByTier } from '@/content/registry';

export default function PrivateIndex() {
  const items = getContentByTier('private');

  return (
    <div className="site-inner">
      <header className="site-header">
        <BrandHeader />
        <Link href="/" className="back-link">
          ← Home
        </Link>
      </header>

      <AccessGate tier="private" />
      <p className="eyebrow">Private · CF Access allowlist · 8h session</p>
      <h1>Internal Analysis &amp; Deal Content</h1>
      <p className="lede">
        Named-allowlist recipients only (app justin-cma-private). No open OTP on
        this tier. Everything here is noindex.
      </p>

      <div className="artifact-grid">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/private/${item.slug}/`}
            className="artifact-card"
          >
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.tag && <span className="tag">{item.tag}</span>}
          </Link>
        ))}

        {items.length === 0 && (
          <div className="empty-state">No private artifacts registered yet.</div>
        )}
      </div>
    </div>
  );
}
