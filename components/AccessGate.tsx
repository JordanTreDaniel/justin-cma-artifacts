interface AccessGateProps {
  tier: 'semi' | 'private';
  className?: string;
}

const TIER_COPY = {
  semi: {
    badge: 'Shared',
    note: 'Cloudflare Access · Email OTP · 24h session',
  },
  private: {
    badge: 'Private',
    note: 'Cloudflare Access · Email allowlist · 8h session',
  },
} as const;

/**
 * Client-side visual indicator that the current route is Access-protected.
 * Actual authentication is enforced at the edge by Cloudflare Access — this
 * component only communicates tier state to the visitor. Gate shape differs by
 * tier on purpose: semi is open OTP, private is a strict named allowlist. Do
 * not normalize one to the other.
 */
export function AccessGate({ tier, className = '' }: AccessGateProps) {
  const copy = TIER_COPY[tier];

  return (
    <div className={`gate-badge ${className}`.trim()}>
      <span className="dot" aria-hidden />
      <strong>{copy.badge}</strong>
      <span>{copy.note}</span>
    </div>
  );
}
