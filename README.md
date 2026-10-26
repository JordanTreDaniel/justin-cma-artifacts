# justin-cma-artifacts

Artifact-source repo for **Justin's CMA hosting** — the content and build behind
the Cloudflare Pages project `justin-cma` → **<https://cma.resource-realty.org>**.

Mirrors the structure of the upstream artifact app (`jordan-artifacts`) with five
substitutions, re-pointed to Justin's hosting and the **Resource Realty** brand:

| # | Substitution | Value here |
|---|---|---|
| 1 | Site URL | `https://cma.resource-realty.org` |
| 2 | CF Pages project | `justin-cma` (production branch `main`) |
| 3 | Registry author | `Justin` |
| 4 | Theme tokens | Resource Realty linen system (table below) |
| 5 | Logo | `public/Resource_Realty_Logo_correct_email.jpeg` — see `public/LOGO.md` |

> ## ⚠️ DO NOT DEPLOY UNTIL JORDAN APPROVES
> **The live site serves the existing static stub**
> (`hermes/clover/clients/justin/sites/cma-reports/`, deployed by
> `clover/scripts/provision.sh`). Nothing in this repo has been pushed to
> `justin-cma` yet. `deploy/deploy.sh --dry-run` is safe; a real run replaces
> the live site. **No git connection may be added to the project — direct
> upload only.**

---

## What this repo is

```
content/{public,semi,private}/*.html   self-contained, script-free RR-themed HTML
content/registry.ts                    content source of truth (unregistered slugs 404)
content/magazine.css                   minimal RR base for MagazineShell output
components/MagazineShell.tsx           renderer of record (strips <script>, keeps <style> + font links)
components/{BrandHeader,TierCard,AccessGate}.tsx
app/{public,semi,private}/…            Next.js static-export routes
lib/content.ts                         HTML loader helpers
public/                                static assets (correct logo) + LOGO.md
deploy/{deploy.sh,verify.sh}           direct-upload deploy + tier verification
```

- Build: `npm run build` → static export in `out/` (`output: 'export'`).
- Renderer of record is **MagazineShell**: `<script>` tags in content HTML are
  **stripped** at build; `<style>` blocks and Google Fonts `<link>` tags are
  preserved. Write content as self-contained HTML with no JS.
- Adding artifacts is driven by `justins-skills/skills/artifacts/scripts/add-artifact.sh`
  (`export ARTIFACTS_REPO=~/dev/justin-cma-artifacts`). It patches
  `content/registry.ts` at the closing marker `};` + blank line +
  `export function getContentByTier` — do not reformat that seam.

## Deploy

```bash
./deploy/deploy.sh --dry-run    # print the plan — touches nothing
./deploy/deploy.sh              # interactive confirm, then deploy
```

which runs:

```bash
npm run build
wrangler pages deploy out/ --project-name=justin-cma --branch=main
```

The project is **not git-connected** (no CI deploy, no git provider config) —
every deploy is an explicit direct upload of `out/`. Wrangler auth is
`wrangler login` (human). No `.env` values are needed to build or deploy.

```bash
./deploy/verify.sh              # curl the three tiers (read-only)
./deploy/verify.sh cma.resource-realty.org --artifact public cma-methodology
```

## Tiers & access

| Tier | Path | Gate | Session | Use for |
|---|---|---|---|---|
| **public** | `/public/*` | None — open, SEO-indexed | — | Methodology, case studies. **No PII, no client names.** |
| **semi** | `/semi/*` | CF Access **Email OTP** (app `justin-cma-semi`) | 24h | Client-facing CMAs, presentations. `noindex`. |
| **private** | `/private/*` | CF Access **email allowlist** (app `justin-cma-private`) | 8h | Internal analysis, deal/PII content. `noindex`. |

- Allowlist membership is **config-owned**: `hermes/clover/clients/justin/config.json`
  → `hosting.access.{semi,private}.emails`, then
  `cd ~/dev/hermes && CLIENT_SLUG=justin ./clover/scripts/provision.sh`.
  Never paste individual emails into this repo.
- The two gates are deliberately different shapes (open OTP vs named
  allowlist) — do not normalize one to the other.
- DNS lives in GCP Cloud DNS (zone `resource-realty`, mode `gcp-cname` →
  `justin-cma.pages.dev`). Deploys never touch DNS.

## Theme tokens — Resource Realty (web / linen)

Every artifact must look like **resource-realty.org**. The upstream dark
html-magazine palette (`#0a0a0a` + pink/cyan) does **not** apply here.

| Token | Hex | Use |
|---|---|---|
| background (linen) | `#f8f6f3` | Page background |
| surface / card | `#ffffff` | Cards float white on linen |
| foreground (walnut) | `#1a1814` | Headlines + primary text |
| body copy (muted ink) | `#6b6057` | Paragraph text |
| primary (Boardwalk Blue) | `#1B4D8E` | Links, primary buttons |
| primary hover | `#2C5FA3` | Hover state |
| secondary (warm surface) | `#e8e0d5` | Panels, table headers |
| muted | `#f0ece6` | Wells, code/quote blocks |
| muted-foreground (Warm Tan) | `#8a7d6a` | Labels, captions |
| accent tint | `#e8f0f9` | Info callouts, highlighted rows |
| accent text | `#5c4e3a` | Emphasis / tag text |
| border | `#e0d8cf` | 1px rules, card outlines |
| outline | `#c5b9aa` | Stronger rules, input borders |
| positive green | `#57a773` | Positive deltas only |

| Type | Font | Notes |
|---|---|---|
| Body / UI | **DM Sans** 300/400/500/600 | Body 14–16px / 1.7 |
| Headlines / stats | **Playfair Display** 500/600/700 | h1 ≈ 38px/1.18, h2 ≈ 30px |
| Mono / data | **Geist Mono** 400/500 | Tables, addresses, figures |
| Eyebrow labels | DM Sans 11px uppercase, `letter-spacing: .12em` | Kickers, footer labels |

- Radius: base `0.625rem` (10px) → sm 6 / md 8 (buttons, inputs) / lg 10 / xl 14.
- Cards: `box-shadow: 0 1px 2px rgba(0,0,0,.05)`, hover `0 10px 25px rgba(0,0,0,.08)`.
- CTA: `#1B4D8E` bg, white text, radius 8px, padding `12px 24px`.

**Email/PDF variant (different system — not for web artifacts):**
ink `#0a0a0a` / panel `#141414` / line `#2c2c2c` · gold `#D4AF37` ·
positive `#57a773` · Georgia + Arial + Courier · 600px layout.

### Logo

Use **`Resource_Realty_Logo_correct_email.jpeg`** (21 KB, in `public/`),
`height: 40px; object-fit: contain;`.
**NEVER `Resource_Realty_Logo.jpg`** — misspelled "REALITY", deprecated, and
still 200 at the origin (a 200 is not permission). Details: `public/LOGO.md`.

## Repository hygiene

- `.gitignore` covers `.next/`, `out/`, `node_modules/`, `.wrangler/`,
  `.env*` — build output and env files never get committed.
- No secrets live in this repo. Nothing here needs a token to build.
- Registry edits require a rebuild: `registry.ts` changed but `out/` stale
  means a deploy would serve old content.
