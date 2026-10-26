#!/usr/bin/env bash
set -euo pipefail

# justin-cma — post-deploy tier verification (read-only HTTP checks).
#
#   ./deploy/verify.sh                       → https://cma.resource-realty.org
#   ./deploy/verify.sh <domain>              → override host (no scheme)
#   ./deploy/verify.sh <domain> --artifact <tier> <slug>
#
# Expectations:
#   /            200
#   /public/     200   open, SEO-indexed
#   /semi/       302   → CF Access Email OTP (24h)
#   /private/    302   → CF Access email allowlist (8h)

DOMAIN="cma.resource-realty.org"
ARTIFACT_TIER=""
ARTIFACT_SLUG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --artifact)
      ARTIFACT_TIER="${2:-}"
      ARTIFACT_SLUG="${3:-}"
      shift 3 ;;
    -*)
      echo "Unknown flag: $1" >&2; exit 1 ;;
    *)
      DOMAIN="${1#https://}"; shift ;;
  esac
done

BASE_URL="https://$DOMAIN"
PASS=0
FAIL=0

echo "=== justin-cma tier verification ==="
echo "Testing: $BASE_URL"
echo ""

test_endpoint() {
  local path="$1"
  local expected="$2"
  local description="$3"

  echo -n "Testing $description... "

  # curl prints %{http_code} itself (000 on connection failure); -L is NOT set
  # and --max-redirs 0 makes curl exit 47 on a redirect — capture the code
  # standalone, never append to a command that may fail.
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-redirs 0 \
    "$BASE_URL$path" 2>/dev/null || true)

  if [[ "$http_code" == "$expected" ]]; then
    echo "✓ PASS ($http_code)"
    PASS=$((PASS + 1))
  else
    echo "✗ FAIL (expected $expected, got $http_code)"
    FAIL=$((FAIL + 1))
  fi
}

echo "--- Tier accessibility ---"
test_endpoint "/"          "200" "Root landing page"
test_endpoint "/public/"   "200" "Public index (open)"
test_endpoint "/semi/"     "302" "Semi index → CF Access OTP"
test_endpoint "/private/"  "302" "Private index → CF Access allowlist"

echo ""
echo "--- SEO headers (gated tiers must be noindex) ---"
check_noindex() {
  local path="$1"
  local description="$2"
  echo -n "Testing $description... "
  local header
  header=$(curl -sI --max-redirs 0 "$BASE_URL$path" 2>/dev/null \
    | grep -i '^x-robots-tag:' | head -1 | tr -d '\r' || true)
  if echo "$header" | grep -qi 'noindex'; then
    echo "✓ PASS (${header:-noindex})"
    PASS=$((PASS + 1))
  else
    echo "✗ FAIL (no x-robots-tag noindex; got: ${header:-<none>})"
    FAIL=$((FAIL + 1))
  fi
}
check_noindex "/semi/"    "Semi noindex header"
check_noindex "/private/" "Private noindex header"

# Optional: probe one registered artifact once the registry build is deployed.
# Public → 200, semi/private → 302 (the gate sits in front of the artifact too).
if [[ -n "$ARTIFACT_TIER" && -n "$ARTIFACT_SLUG" ]]; then
  echo ""
  echo "--- Artifact probe ---"
  case "$ARTIFACT_TIER" in
    public)  test_endpoint "/public/$ARTIFACT_SLUG/"  "200" "Artifact /public/$ARTIFACT_SLUG/" ;;
    semi)    test_endpoint "/semi/$ARTIFACT_SLUG/"    "302" "Artifact /semi/$ARTIFACT_SLUG/ (gated)" ;;
    private) test_endpoint "/private/$ARTIFACT_SLUG/" "302" "Artifact /private/$ARTIFACT_SLUG/ (gated)" ;;
    *) echo "Invalid --artifact tier: $ARTIFACT_TIER (public|semi|private)"; exit 1 ;;
  esac
fi

echo ""
echo "=== Results ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [[ "$FAIL" -eq 0 ]]; then
  echo "✓ All checks passed"
  exit 0
fi
echo "✗ Some checks failed"
exit 1
