#!/usr/bin/env bash

# Navigate to the docs directory
cd docs || exit 1

# Check if Bundler is installed and install it if necessary
if ! gem query --local --name-matches '^bundler$' --installed >/dev/null 2>&1; then
    echo "Installing Bundler..."
    gem install bundler
else
    echo "Bundler is already installed."
fi

# Check if the Gemfile.lock exists, and if it matches the Gemfile, we'll assume dependencies are up to date
if [ ! -f Gemfile.lock ] || ! bundle check >/dev/null 2>&1; then
    echo "Installing missing gems..."
    bundle install
else
    echo "All gems are already installed."
fi

# Build the Jekyll site
echo "Building the Jekyll site..."
bundle exec jekyll build --trace
