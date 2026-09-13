#!/usr/bin/env bash

# Generate the initial TOCs, then serve the docs while a watcher refreshes
# the generated TOC includes whenever a markdown file changes (Jekyll's
# --watch picks the include up and rebuilds the page automatically).
cd docs \
    && node ../scripts/generate-chaptertocs.js \
    && bundle install \
    && npx concurrently \
        -k \
        -n toc,site \
        "node ../scripts/watch-chaptertocs.js" \
        "bundle exec jekyll serve --watch"
#        --livereload
