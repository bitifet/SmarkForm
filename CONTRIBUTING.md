# Contributing to SmarkForm

Thanks for your interest in contributing! This guide explains how to set up your environment, run the project, add tests, and open pull requests.

If anything is unclear, please open a discussion or issue—we’re happy to help.


## Code of Conduct

Please be respectful and keep a positive, collaborative tone. The following behaviors will not be tolerated:
- Offensive or disrespectful comments
- Spam or unauthorized advertising
- Non-constructive or destabilizing behavior

If you experience or witness unacceptable behavior, please contact us at [smarkform@bitifet.net](mailto:smarkform@bitifet.net).


## Ways to Contribute

- Report bugs and propose enhancements via GitHub Issues
- Improve documentation and examples
- Add or improve tests
- Implement features or fixes (preferably after an issue/discussion)


## Getting Started

Prerequisites:
- Node.js 18+ recommended
- Git

1) Fork and clone (recommended workflow)

- On GitHub: click "Fork" on the repository page to create a copy under your account.
- Then clone your fork (replace <your_github_user> with your GitHub username):

```bash
git clone https://github.com/<your_github_user>/SmarkForm.git
cd SmarkForm
# origin now points to your fork (you can push to origin)
# Add the original repo as an upstream remote to stay in sync:
git remote add upstream https://github.com/bitifet/SmarkForm.git
```

2) Install dependencies
```bash
npm install
```

3) Install Playwright browsers
```bash
npx playwright install
```

4) Install system deps (Linux) to run browsers, if needed
```bash
# Linux-only (or when Playwright warns about missing packages)
sudo npx playwright install-deps
```

Tip: If Playwright prints a “Host system is missing dependencies to run browsers” banner, run the command it suggests (usually sudo npx playwright install-deps). On Debian/Ubuntu you may also need packages like libavif.


## Building and Running

- Build the library (ESM and UMD bundles)
```bash
npm run build
```
Outputs:
- dist/SmarkForm.esm.js (ESM)
- dist/SmarkForm.umd.js (UMD)
- Source maps are generated for both.

- Develop with live rebuild and a simple HTTP server
```bash
npm run dev
```
This:
- Builds ESM and UMD into dist
- Generates sourcemaps
- Watches files and rebuilds on change
- Serves a local site so you can open examples quickly


## Tests

The test suite validates the library and also smoke-tests documentation examples.

- Full suite (build + collect docs examples + run Playwright):
```bash
npm test
```

- Run Playwright directly (assumes build + collector already ran):
```bash
npx playwright test
```

- Run a single browser (project):
```bash
npx playwright test --project=chromium
```

- Filter tests by title (regex):
```bash
npx playwright test -g "some test title"
```

- Reduce workers (useful on low-resource environments):
```bash
npx playwright test --workers=1
```

- Headed/debug mode:
```bash
npm run test:headed
# or
npx playwright test --debug
# or
PWDEBUG=1 npx playwright test
```

- View HTML report after a run:
```bash
npx playwright show-report
```

If you see “Failed to load examples manifest” or an empty manifest, run:
```bash
node scripts/collect-docs-examples.js
```

For more details about tests, see:
- [test/README.md](test/README.md)
- [test/WRITING_TESTS.md](test/WRITING_TESTS.md)
- [test/IMPLEMENTATION_DETAILS.md](test/IMPLEMENTATION_DETAILS.md)


## Documentation Site

The documentation (docs/) is built with Jekyll and Just the Docs, and published via GitHub Pages.

Local build:
1) Install Jekyll prerequisites (see official docs)
2) Install bundler and gems via the script below
3) Run the docs site
```bash
npm run doc
```

Then open http://localhost:4000 (or http://<your-ip>:4000).

More details are in [docs/README.md](docs/README.md).


## Project Structure (high-level)

- src/           Library source
- dist/          Build outputs (ESM/UMD)
- docs/          Documentation site (Jekyll / Just the Docs)
- test/          Playwright test suite and helpers
- scripts/       Build, docs, and test orchestration scripts


## Pull Requests

- For non-trivial changes, consider opening an issue/discussion first to align on the approach.
- Branch from the default branch (e.g., main) with a descriptive name:
  - feature/list-reorder-keyboard
  - fix/date-coercion-off-by-one
  - docs/update-quick-start
- Keep commits focused and with clear messages. Conventional Commits are welcome but not required.
- Add or update tests:
  - Unit/integration tests where applicable
  - Documentation example tests when relevant (docs examples are auto-collected and validated)
- Ensure the project builds and tests pass locally:
  ```bash
  npm run build
  npm test
  ```
- In your PR description, link related issues (e.g., “Fixes #123”) and briefly explain what changed and why.


## Reporting Issues

When filing an issue, please include:
- Steps to reproduce
- Expected vs. actual behavior
- Environment info (OS, browser, Node version)
- Minimal reproducible example if possible


## Security

If you find a security vulnerability, please email [smarkform@bitifet.net](mailto:smarkform@bitifet.net). We will work with you to resolve the issue promptly.


## Help

- GitHub Discussions: https://github.com/bitifet/SmarkForm/discussions
- Contact: [smarkform@bitifet.net](mailto:smarkform@bitifet.net)

Thank you for contributing!

