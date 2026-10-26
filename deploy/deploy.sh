#!/usr/bin/env bash
set -euo pipefail

# justin-cma — CF Pages deploy (DIRECT UPLOAD).
#
#   ./deploy/deploy.sh              interactive plan + confirm, then deploy
#   ./deploy/deploy.sh --dry-run    print the plan, touch nothing
#   ./deploy/deploy.sh --yes        skip the confirmation (for scripted runs)
#   ./deploy/deploy.sh --rebuild    force a fresh `npm run build` first
#
# The Pages project `justin-cma` is NOT git-connected — there is no CI deploy,
# no git provider config, and none should be added from here. Every deploy is
# an explicit direct upload of out/.
#
# ⚠  DO NOT DEPLOY UNTIL JORDAN APPROVES. The live site serves the existing
#    static stub from hermes/clover/clients/justin/sites/cma-reports/.

PROJECT_NAME="justin-cma"
DOMAIN="cma.resource-realty.org"
BUILD_DIR="out"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

DRY_RUN=0
ASSUME_YES=0
FORCE_BUILD=0

usage() {
  cat <<'USAGE'
Usage: deploy/deploy.sh [--dry-run] [--yes] [--rebuild]

  --dry-run    Print the deployment plan and exit without touching anything.
  --yes        Skip the confirmation prompt (required when stdin is not a TTY).
  --rebuild    Force `npm run build` even if out/ already exists.
  -h, --help   Show this help.

Target: wrangler pages deploy out/ --project-name=justin-cma --branch=main
Domain: https://cma.resource-realty.org
USAGE
}

die() { echo "ERROR: $*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run|-n) DRY_RUN=1; shift ;;
    --yes|-y)     ASSUME_YES=1; shift ;;
    --rebuild)    FORCE_BUILD=1; shift ;;
    -h|--help)    usage; exit 0 ;;
    *)            die "Unknown flag: $1 (see --help)" ;;
  esac
done

# ── what would happen ─────────────────────────────────────────────────────────
plan() {
  local content_count=0
  for tier in public semi private; do
    local n
    n="$(find "content/$tier" -maxdepth 1 -name '*.html' 2>/dev/null | wc -l | tr -d ' ')"
    content_count=$((content_count + n))
    echo "    content/$tier/  →  /$tier/  ($n artifact$([ "$n" -eq 1 ] || echo 's'))"
  done

  cat <<PLAN

=== justin-cma deploy plan ===
  Repo:       $REPO_ROOT
  Build:      npm run build   (Next.js static export → $BUILD_DIR/)
  Command:    wrangler pages deploy "$BUILD_DIR" --project-name=$PROJECT_NAME --branch=main
  Project:    $PROJECT_NAME (Cloudflare Pages, production branch: main)
  Domain:     https://$DOMAIN
  Tiers:      /public/  200 (open, SEO-indexed)
              /semi/    302 → CF Access Email OTP, 24h  (app justin-cma-semi)
              /private/ 302 → CF Access allowlist, 8h     (app justin-cma-private)
  Registered: $content_count artifact(s) in content/registry.ts
  Git:        NOT connected — direct upload only. This script does not create
              projects, attach domains, or change Access.

  ⚠  DO NOT DEPLOY UNTIL JORDAN APPROVES — the live site currently serves the
     existing static stub (hermes/clover/clients/justin/sites/cma-reports/).
PLAN
}

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "--- DRY RUN — no build, no network, no wrangler call ---"
  plan
  echo ""
  echo "--- end dry run (nothing was executed) ---"
  exit 0
fi

plan
echo ""

# ── confirmation ──────────────────────────────────────────────────────────────
if [[ "$ASSUME_YES" -eq 0 ]]; then
  if [[ -t 0 ]]; then
    read -r -p "Proceed with the deploy to $PROJECT_NAME? [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted — nothing deployed."; exit 0; }
  else
    die "stdin is not a TTY and --yes was not passed. Re-run with --yes to deploy non-interactively."
  fi
fi

# ── build ─────────────────────────────────────────────────────────────────────
if [[ "$FORCE_BUILD" -eq 1 ]] || [[ ! -d "$BUILD_DIR" ]] || [[ -z "$(ls -A "$BUILD_DIR" 2>/dev/null)" ]]; then
  echo "Building Next.js static export..."
  command -v npm >/dev/null || die "npm not found"
  npm run build
  echo "✓ Build complete → $BUILD_DIR/"
else
  echo "✓ Build directory exists ($BUILD_DIR/) — pass --rebuild to force a fresh build"
fi
[[ -d "$BUILD_DIR" ]] || die "$BUILD_DIR/ missing after build"
echo ""

# ── wrangler auth ─────────────────────────────────────────────────────────────
echo "Checking wrangler auth..."
command -v wrangler >/dev/null || die "wrangler not found (npm i -g wrangler)"
wrangler whoami >/dev/null 2>&1 || die "Wrangler not authenticated. Run: wrangler login"
echo "✓ Wrangler authenticated"
echo ""

# ── deploy (direct upload — the ONLY CF mutation this script performs) ────────
echo "Deploying to Cloudflare Pages..."
wrangler pages deploy "$BUILD_DIR" --project-name="$PROJECT_NAME" --branch=main
echo "✓ Deployed to $PROJECT_NAME (branch: main)"
echo ""

cat <<NEXT
=== Next steps ===
1. Verify tiers:  ./deploy/verify.sh
2. Access membership is config-owned — edit
   hermes/clover/clients/justin/config.json → hosting.access.{semi,private}.emails
   then: cd ~/dev/hermes && CLIENT_SLUG=justin ./clover/scripts/provision.sh
3. Never add a git connection to this project — direct upload is the model.
NEXT
