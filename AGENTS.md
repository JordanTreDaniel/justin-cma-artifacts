# AGENTS.md — justin-cma-artifacts

Repo for **Justin's CMA artifacts** (`cma.resource-realty.org`, CF Pages project
`justin-cma`). Full context: `README.md`; hosting contract:
`~/dev/justins-skills/skills/artifacts/` (read `SKILL.md`, route via `INDEX.md`).

## Hard rules

1. **Never deploy without Jordan's explicit approval.** The live site serves an
   existing static stub. `./deploy/deploy.sh --dry-run` is the only safe run.
2. **Direct upload only.** The Pages project is not git-connected; never add a
   git connection, never create/modify Access apps, never touch DNS from here.
3. **Resource Realty theme only.** Linen `#f8f6f3`, walnut `#1a1814`, Boardwalk
   Blue `#1B4D8E`, Playfair Display + DM Sans + Geist Mono. The upstream dark
   magazine palette is superseded for this repo.
4. **Logo:** only `Resource_Realty_Logo_correct_email.jpeg` (in `public/`).
   Never `Resource_Realty_Logo.jpg` (misspelled "REALITY"). See `public/LOGO.md`.
5. **Content HTML is script-free.** MagazineShell strips `<script>`; keep
   artifacts self-contained (`<style>` + Google Fonts links are preserved).
6. **`content/registry.ts` is the source of truth** — unregistered slugs 404.
   Preserve the closing seam the add-artifact script patches:
   `};` + blank line + `export function getContentByTier`.
7. **Tiers:** `public` = open + indexed, **no PII**; `semi`/`private` are gated
   and `noindex`. Allowlist membership lives in
   `hermes/clover/clients/justin/config.json`, never here.
8. **No secrets in this repo.** Nothing requires a token to build or verify.

## Common commands

```bash
npm run dev                 # local dev server
npm run build               # static export → out/
./deploy/deploy.sh --dry-run
./deploy/verify.sh
```
