#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DOCS_DIR="${ROOT_DIR}/docs"
DIST_DIR="${ROOT_DIR}/dist"
LEGACY_EXAMPLES_DIR="${DOCS_DIR}/_showcase_examples/.legacy_examples"
PUBLIC_LEGACY_EXAMPLES_DIR="${DOCS_DIR}/assets/legacy-examples"

if [[ ! -d "${DIST_DIR}" ]]; then
    echo "Built dist directory is missing; run npm run build before building the docs." >&2
    exit 1
fi

# `site.data.package` drives the versioned CDN links. Keep this generated copy
# available to local Jekyll builds without tracking a second package manifest.
cp "${ROOT_DIR}/package.json" "${DOCS_DIR}/_data/package.json"

# `/dist/` and `/resources/dist/` serve the current library bundles. The
# generated Legacy Examples are committed in the hidden archive and copied to
# their public static URL; they are not rebuilt from retired Pug/Sass sources.
rm -rf "${DOCS_DIR}/_showcase_examples/.example_sources"
rm -rf "${DOCS_DIR}/dist" "${DOCS_DIR}/resources/dist" "${PUBLIC_LEGACY_EXAMPLES_DIR}"
mkdir -p \
    "${DOCS_DIR}/dist" \
    "${DOCS_DIR}/resources/dist" \
    "${PUBLIC_LEGACY_EXAMPLES_DIR}"

cp -R "${DIST_DIR}/." "${DOCS_DIR}/dist/"
cp -R "${DIST_DIR}/." "${DOCS_DIR}/resources/dist/"
cp -R "${LEGACY_EXAMPLES_DIR}/." "${PUBLIC_LEGACY_EXAMPLES_DIR}/"
