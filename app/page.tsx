import { BrandHeader } from '@/components/BrandHeader';
import { TierCard } from '@/components/TierCard';

export default function Home() {
  return (
    <main className="site">
      <div className="site-inner">
        <header className="site-header">
          <BrandHeader />
        </header>

        <p className="eyebrow">Comparative Market Analysis</p>
        <h1>Resource Realty CMA Reports</h1>
        <p className="lede">
          Three tiers of analysis, gated by Cloudflare Access: open methodology,
          client-shared CMAs, and internal deal work.
        </p>

        <div className="tier-grid">
          <TierCard tier="public" />
          <TierCard tier="semi" />
          <TierCard tier="private" />
        </div>

        <footer className="site-footer">
          resource-realty.org · cma.resource-realty.org
        </footer>
      </div>
    </main>
  );
}
