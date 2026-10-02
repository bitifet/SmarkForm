#!/usr/bin/env bash

# Generate the initial TOCs, then serve the docs with browser auto-reload.
#
# Jekyll serves on the internal port 4001; browser-sync proxies it on the
# public port 4000 and injects its reload client into every page, so the
# browser reloads automatically whenever `_site` changes (markdown edits,
# regenerated TOC includes, rebuilt dist assets, config tweaks...).
#
# Older layout: `jekyll serve --livereload` (removed in commit 2f7cb353).
# Its eventmachine native dependency fails to load against OpenSSL 3
# (`undefined symbol: SSL_get_peer_certificate`), and the pure-Ruby reactor
# crashes on Ruby 3.2, so devise the Node-based reloader above instead.
cd docs \
    && node ../scripts/generate-chaptertocs.js \
    && bundle install \
    && npx concurrently \
        -k \
        -n toc,site,sync \
        "node ../scripts/watch-chaptertocs.js" \
        "bundle exec jekyll serve --watch --port 4001" \
        "npx browser-sync start --proxy 'http://localhost:4001' --port 4000 --files '_site/**/*' --no-open --no-notify"
