#!/usr/bin/env bash
#
# Run Playwright tests against a single, randomly-chosen browser project.
# The project is picked at random from those listed in playwright.config.js so
# that different runs exercise different browsers without being deterministic.
#
# Usage:
#   npm run test:quick            # build, collect, then run on random browser
#   scripts/test_quick.sh         # run directly (skip pretest)
#
set -euo pipefail

SCRIPT_DIR=$(dirname "${0}")
REPO_ROOT=$(realpath "${SCRIPT_DIR}/..")
CONFIG_FILE="$REPO_ROOT/playwright.config.js"

[ -f "$CONFIG_FILE" ] || { echo "Error: Missing $CONFIG_FILE" >&2; exit 1; }

# Extract project names using the same approach as test_pick.sh.
mapfile -t PROJECTS < <(
  awk '/projects:/{found=1} found' "$CONFIG_FILE" \
    | grep "name:" \
    | perl -pe "s/^.*?'(.*?)'.*\$/\\1/"
)

[ "${#PROJECTS[@]}" -gt 0 ] || { echo "Error: No projects found in $CONFIG_FILE" >&2; exit 1; }

# Pick one project at random.
CHOSEN="${PROJECTS[$((RANDOM % ${#PROJECTS[@]}))]}"
echo "test:quick — running on randomly selected project: $CHOSEN"

cd "$REPO_ROOT"
exec npx --no playwright test --project="$CHOSEN" "$@"
