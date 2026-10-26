/* eslint-disable @next/next/no-img-element -- deliberate plain <img>: the logo
   is a static 21 KB asset, served unoptimized from public/. */
/**
 * Resource Realty brand header (landing + tier indexes).
 *
 * LOGO RULE — non-negotiable:
 *   USE    /Resource_Realty_Logo_correct_email.jpeg  (21 KB, copied into this
 *          repo's public/ — self-contained, no cross-repo hotlinking)
 *   NEVER  Resource_Realty_Logo.jpg — the file is misspelled "REALITY" and is a
 *          deprecated rollback asset. It still returns HTTP 200 at the origin;
 *          a 200 is NOT permission. A misspelled logo on a client-facing CMA is
 *          an instant credibility hit.
 *   Master art Resource_Realty_Logo_correct.jpeg (1.6 MB) is print/large only —
 *   never inline.
 *
 * Display: height 40px, object-fit: contain, on light surfaces.
 */
export function BrandHeader({ tagline }: { tagline?: string }) {
  return (
    <div className="brand">
      {/* Correct asset only — see LOGO RULE above. */}
      <img
        src="/Resource_Realty_Logo_correct_email.jpeg"
        alt="Resource Realty"
        height={40}
      />
      <span className="wordmark">
        {tagline ?? 'Comparative Market Analysis'}
      </span>
    </div>
  );
}
