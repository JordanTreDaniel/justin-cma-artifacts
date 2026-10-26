import type { Tier } from '@/lib/content';

const TIER_META: Record<
  Tier,
  { label: string; blurb: string; href: string; gate: string }
> = {
  public: {
    label: 'Public',
    blurb: 'Open case studies and methodology — no PII.',
    href: '/public/',
    gate: 'Open · SEO-indexed',
  },
  semi: {
    label: 'Shared',
    blurb: 'Client-facing CMAs and presentations.',
    href: '/semi/',
    gate: 'CF Access · Email OTP · 24h',
  },
  private: {
    label: 'Private',
    blurb: 'Internal analysis and deal content.',
    href: '/private/',
    gate: 'CF Access · Allowlist · 8h',
  },
};

interface TierCardProps {
  tier: Tier;
}

export function TierCard({ tier }: TierCardProps) {
  const meta = TIER_META[tier];

  return (
    <a href={meta.href} className="tier-card">
      <h2 className="tier-label">{meta.label}</h2>
      <p className="tier-blurb">{meta.blurb}</p>
      <span className="tier-gate">{meta.gate}</span>
    </a>
  );
}
