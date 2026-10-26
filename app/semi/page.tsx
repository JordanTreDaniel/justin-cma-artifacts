import Link from 'next/link';
import { AccessGate } from '@/components/AccessGate';
import { BrandHeader } from '@/components/BrandHeader';
import { getContentByTier } from '@/content/registry';

export default function SemiIndex() {
  const items = getContentByTier('semi');

  return (
    <div className="site-inner">
      <header className="site-header">
        <BrandHeader />
        <Link href="/" className="back-link">
          ← Home
        </Link>
      </header>

      <AccessGate tier="semi" />
      <p className="eyebrow">Shared · CF Access Email OTP · 24h session</p>
      <h1>Client CMA Reports</h1>
      <p className="lede">
        Client deliverables behind Cloudflare Access (app justin-cma-semi).
        Anything here is noindex.
      </p>

      <div className="artifact-grid">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/semi/${item.slug}/`}
            className="artifact-card"
          >
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.tag && <span className="tag">{item.tag}</span>}
          </Link>
        ))}

        {items.length === 0 && (
          <div className="empty-state">No shared artifacts registered yet.</div>
        )}
      </div>
    </div>
  );
}
