#!/usr/bin/env bash

npx concurrently \
    -n rollup,site \
    \"npm run watch\" \
    \"npm run servedoc\"
;
