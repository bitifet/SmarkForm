#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DOCS_DIR="${ROOT_DIR}/docs"
DIST_DIR="${ROOT_DIR}/dist"

if [[ ! -d "${DIST_DIR}/examples" ]]; then
    echo "Built dist/examples is missing; run npm run bundle before building the docs." >&2
    exit 1
fi

# `/dist/` serves the downloadable-example selector. `/resources/dist/` is the
# stable download URL space used by the CDN/Download pages and sampletab loader.
mkdir -p \
    "${DOCS_DIR}/dist" \
    "${DOCS_DIR}/resources/dist" \
    "${DOCS_DIR}/_showcase_examples/.example_sources/dist/examples" \
    "${DOCS_DIR}/_old_resources/.example_sources/dist/examples"

cp -R "${DIST_DIR}/." "${DOCS_DIR}/dist/"
cp -R "${DIST_DIR}/." "${DOCS_DIR}/resources/dist/"
cp -R "${DIST_DIR}/examples/." \
    "${DOCS_DIR}/_showcase_examples/.example_sources/dist/examples/"
cp -R "${DIST_DIR}/examples/." \
    "${DOCS_DIR}/_old_resources/.example_sources/dist/examples/"
