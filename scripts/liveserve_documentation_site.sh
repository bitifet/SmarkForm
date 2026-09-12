#!/usr/bin/env bash

cd docs \
    && node ../scripts/generate-chaptertocs.js \
    && bundle install \
    && bundle exec jekyll serve \
        --watch
#        --livereload
