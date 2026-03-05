# SmarkForm Build-Computed Data — Agent Knowledge

## What is `computed.json`?

At build time, the Rollup `computed_plugin` in `rollup.config.js` writes a small
JSON file to `docs/_data/computed.json` that captures metadata about the
current build.  Jekyll then makes this data available throughout the docs site
via the `site.data.computed` Liquid variable.

## What the file contains

```json
{
  "bundleSizeKB": 38,
  "lastUpdated": "Thu Mar 05 2026"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `bundleSizeKB` | integer | Size of `dist/SmarkForm.esm.js` rounded to the nearest kilobyte |
| `lastUpdated` | string | `new Date().toDateString()` at the moment the build ran |

## How to use it in documentation

Reference these values in any Jekyll/Liquid template file (`.md`, `.html`) using:

```liquid
{{ site.data.computed.bundleSizeKB }}KB
{{ site.data.computed.lastUpdated }}
```

If you need to match the exact filter chain used elsewhere in the docs:

```liquid
{{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB
```

(The `| textilize` filter is used in existing docs pages; plain `xml_escape` alone is also fine for a numeric value.)

## Important: never hardcode bundle size

**Do NOT** write things like `~38 KB` or `~42 KB` in documentation prose.
Always use `{{ site.data.computed.bundleSizeKB }}KB` so the number stays
accurate after every build.

## Where `computed.json` is generated

`rollup.config.js` — the `computed_plugin.writeBundle()` hook:

```javascript
const bundleSizeKB = Math.round(stats.size / 1024);
const lastUpdated  = (new Date()).toDateString();
await fs.writeFile(
    path.resolve('docs/_data', 'computed.json'),
    JSON.stringify({ bundleSizeKB, lastUpdated })
);
```

The file is regenerated every time `npm run build` (or `npm run watch`) runs.
It is **not** committed to the repository; it lives only in the build output.

## Existing usages in the docs

- `docs/index.md` — `{{ site.data.computed.bundleSizeKB }}KB minified`
- `docs/_about/faq.md` — `{{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB bundle`
- `docs/_about/features.md` — `{{ site.data.computed.bundleSizeKB | xml_escape | textilize }}KB minified!`
- `docs/_about/roadmap.md` — `{{ site.data.computed.lastUpdated }}`
- `docs/_resources/download.md` — `{{ site.data.computed.bundleSizeKB }}KB each`
