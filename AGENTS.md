# AGENTS.md

## Purpose

This document describes the automated agents, CI/CD workflows, test runners, and helper scripts used by the SmarkForm project. It explains what runs automatically, where configuration lives, how to run things locally, and how to add or change automation safely.

## Overview

- **Playwright test runner**: end-to-end and co-located docs example tests.
- **Collector**: script that extracts docs examples into a manifest used by tests.
- **Build & bundle agents**: rollup-based bundling and scripts to produce dist/.
- **Documentation build and deploy**: Jekyll site, built locally or via GitHub Pages workflow.
- **Local live-serve helpers**: scripts to run dev servers and watchers.
- **GitHub Pages workflow**: deploy docs site from main branch.
- **Dependabot**: monitors npm (devDependencies) and GitHub Actions to propose updates.

## Quick checklist (update AGENTS.md when these change)

When you change or add any of the following, please update this file to reflect the change:
- package.json scripts (build, test, pretest, dev)
- playwright.config.js or files under test/
- scripts/* (collector, build scripts, live-serve helpers)
- rollup.config.js or rollup-plugins/
- docs/ content, co-located examples, or test collection logic
- .github/workflows/* (CI / Pages deployment)

For convenience, include this exact sentence in the PR description when you want the assistant to update AGENTS.md automatically:

**"Please update AGENTS.md to reflect the changes in this PR."**

## Detailed Component Documentation

### Playwright Test Runner

**What it does**: Runs end-to-end tests against the built distribution files and validates documentation examples.

**Configuration**: `playwright.config.js`

**Test location**: `test/` directory

**How to run locally**:
```bash
npm test
```

**Key details**:
- Test files match pattern: `**/*.tests.js`
- Runs tests in Chromium, Firefox, and WebKit
- Generates HTML reports
- Screenshots and traces captured on failure
- `forbidOnly` enabled in CI to prevent `.only` commits

**Troubleshooting**:
- If tests fail, check `playwright-report/index.html` for detailed reports
- Use `npm run test:pick` to run specific test files
- Ensure `npm run build` completes successfully before testing

### Collector Script

**What it does**: Extracts documentation examples into a manifest file that Playwright tests use to validate examples.

**Location**: `scripts/collect-docs-examples.js`

**How to run locally**:
```bash
node scripts/collect-docs-examples.js
```

**Key details**:
- Runs automatically as part of `npm run pretest`
- Scans docs/ for co-located examples
- Creates a manifest used by test suite

**Troubleshooting**:
- If tests can't find examples, re-run the collector
- Check that example files exist in docs/ structure

### Build & Bundle Agents

**What they do**: Bundle the source code using Rollup to produce ESM and UMD distributions in `dist/`.

**Configuration**: `rollup.config.js`, `rollup-plugins/`

**How to run locally**:
```bash
# Production build
npm run build
# or
scripts/build_production_smarkform.sh

# Build everything (library + examples)
npm run bundle
# or
scripts/build_all.sh

# Watch mode for development
npm run watch
# or
scripts/livebuild_dev_smarkform.sh
```

**Key details**:
- Outputs: `dist/SmarkForm.esm.js` (ES module), `dist/SmarkForm.umd.js` (UMD)
- Uses Babel for transpilation with decorators support
- Minification via Terser
- Cleanup plugin for code formatting
- Custom Pug and Sass plugins for examples
- Generates computed metadata (bundle size, last updated)

**Troubleshooting**:
- If build fails, check Node.js version compatibility
- Ensure all devDependencies are installed: `npm install`
- Check rollup.config.js for plugin configuration issues
- Review rollup-plugins/ for custom plugin errors

### Documentation Build and Deploy

**What it does**: Builds the Jekyll documentation site from the `docs/` directory.

**Configuration**: 
- Jekyll config: `docs/_config.yml`
- Workflow: `.github/workflows/pages.yml`

**How to run locally**:
```bash
# Build docs site
npm run doc
# or
scripts/build_documentation_site.sh

# Serve docs with live reload
npm run servedoc
# or
scripts/liveserve_documentation_site.sh

# Run both library and docs in watch mode
npm run dev
# or
scripts/liveserve_all.sh
```

**Key details**:
- Jekyll site in `docs/` directory
- Built package and examples copied into docs for deployment
- `package.json` copied to `docs/_data/` for Jekyll data files
- Built examples copied to `docs/_resources/`

**Troubleshooting**:
- If Jekyll fails, ensure Ruby and bundler are installed
- Run `bundle install` in docs/ directory
- Check Jekyll version compatibility
- Review `docs/Gemfile` for dependencies

### Local Live-Serve Helpers

**What they do**: Run development servers with live reload for rapid iteration.

**Available scripts**:
- `npm run watch` / `scripts/livebuild_dev_smarkform.sh` - Watch library source
- `npm run servedoc` / `scripts/liveserve_documentation_site.sh` - Serve docs with Jekyll
- `npm run dev` / `scripts/liveserve_all.sh` - Run both library watcher and docs server

**How to run locally**:
```bash
# Development mode (both library and docs)
npm run dev
```

**Key details**:
- Uses `concurrently` to run multiple processes
- Library changes trigger automatic rebuilds
- Documentation server provides live reload

**Troubleshooting**:
- If changes don't appear, check that watchers are running
- Ensure ports are not already in use
- Check console output for build errors

### GitHub Pages Workflow

**What it does**: Automatically builds and deploys the documentation site to GitHub Pages when changes are pushed to the `stable` branch.

**Configuration**: `.github/workflows/pages.yml`

**Trigger conditions**:
- Push to `stable` branch
- Changes to `docs/**` paths
- Manual workflow dispatch

**Key steps**:
1. Checkout code
2. Setup Ruby and install Jekyll dependencies
3. Install npm dependencies (from docs directory with working-directory: docs)
4. Build package with `npm run build` (executed from docs directory)
5. Copy built files from parent directory to docs structure
6. Build Jekyll site
7. Upload and deploy to GitHub Pages

Note: The workflow sets `working-directory: docs` as the default, so npm commands execute from the docs directory.

**Troubleshooting**:
- Check Actions tab in GitHub for workflow run details
- Review workflow logs for build failures
- Ensure `stable` branch is up to date
- Verify GitHub Pages settings in repository configuration

### Dependabot

**What it does**: Automatically creates pull requests to update npm dependencies (devDependencies) and GitHub Actions versions.

**Configuration**: `.github/dependabot.yml`

**Monitored ecosystems**:
- `npm` - devDependencies in package.json
- `github-actions` - Actions used in workflow files

**Key details**:
- Checks daily for npm updates
- Checks weekly for GitHub Actions updates
- No runtime dependencies (only devDependencies)
- Helps keep tooling and CI/CD up to date

**How to manage**:
- Review PRs created by Dependabot
- Test updates locally before merging
- Check for breaking changes in changelogs
- Merge updates regularly to avoid large batches

**Troubleshooting**:
- If Dependabot PRs fail CI, review breaking changes
- Check compatibility with Node.js version
- Review package changelogs for migration guides
- Test locally: `npm install <package>@<version>`

## Configuration File Locations

| Component | Configuration File(s) |
|-----------|----------------------|
| Playwright | `playwright.config.js` |
| Rollup | `rollup.config.js`, `rollup-plugins/*` |
| Jekyll | `docs/_config.yml`, `docs/Gemfile` |
| GitHub Actions | `.github/workflows/pages.yml` |
| Dependabot | `.github/dependabot.yml` |
| npm scripts | `package.json` (scripts section) |
| Example collector | `scripts/collect-docs-examples.js` |

## Common Commands Reference

```bash
# Testing
npm test                    # Run all Playwright tests
npm run test:pick          # Run specific test file(s)
npm run pretest            # Build and collect examples (runs before test)

# Building
npm run build              # Build production library
npm run bundle             # Build library and examples
npm run watch              # Watch mode for library

# Documentation
npm run doc                # Build documentation site
npm run servedoc           # Serve docs with live reload
npm run dev                # Watch library + serve docs

# Utility
node scripts/collect-docs-examples.js  # Collect docs examples
```

## Getting Help

- **Issue tracker**: [GitHub Issues](https://github.com/bitifet/SmarkForm/issues)
- **Contributing**: See `CONTRIBUTING.md`
- **Documentation**: [https://smarkform.bitifet.net](https://smarkform.bitifet.net)

## Updating This Document

This document should be kept up to date as automation changes. When you make changes to CI/CD, tests, build scripts, or other automation:

1. Update the relevant section(s) in this file
2. Test your changes locally
3. Commit the AGENTS.md update with your changes

**For automated updates**: Include the sentence "Please update AGENTS.md to reflect the changes in this PR." in your PR description, and the GitHub Copilot Chat Assistant will update this file for you.
