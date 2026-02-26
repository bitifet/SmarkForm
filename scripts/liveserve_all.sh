#!/usr/bin/env bash

# Initial build ensures all output files exist before Jekyll starts.
# Without this, a fresh checkout requires restarting `npm run dev` after
# the first rollup build completes.
npm run build && \
npx concurrently \
    -n rollup,site \
    "npm run watch" \
    "npm run servedoc" \
;
