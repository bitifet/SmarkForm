---
title: Security Considerations
layout: chapter
permalink: /advanced_concepts/security_considerations
nav_order: 7

---

{% include links.md %}

# {{ page.title }}

SmarkForm is designed to be **secure by default**: features that could
introduce cross-origin requests or arbitrary script execution are disabled
unless you explicitly opt in.  This page summarises the security model,
explains the rationale behind each restriction, and provides guidance on
enabling features safely.

---

## Secure-by-Default Philosophy

All security-sensitive SmarkForm features follow the same principle:

> **Off by default.  Opt in explicitly.  Fail loudly when blocked.**

When a blocked feature is triggered, SmarkForm throws a named error (e.g.
`MIXIN_EXTERNAL_FETCH_BLOCKED`) rather than silently ignoring the request.
This means you will notice the restriction immediately in the browser console
and can make a conscious decision about whether and how to permit the feature.

All opt-in options are **root-level SmarkForm constructor options**:

```js
new SmarkForm(document.getElementById("myForm"), {
  allowExternalMixins: 'same-origin',
  allowLocalMixinScripts: 'allow',
  enableJsonEncoding: true,
  // …
});
```

They are inherited by all descendant components via the `inheritedOption`
mechanism, so you only need to set them once on the root instance.

---

## Mixin External Template Loading — `allowExternalMixins`

By default SmarkForm **blocks all attempts to fetch mixin templates from
external URLs** (any mixin type reference that contains a URL path before the
`#templateId` fragment).

| Value | Behaviour |
|---|---|
| `"block"` *(default)* | Throws `MIXIN_EXTERNAL_FETCH_BLOCKED` for any external URL. Cross-origin and same-origin alike. |
| `"same-origin"` | Allows fetching templates from the same origin. Cross-origin URLs throw `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED`. |
| `"allow"` | Fetching is permitted from any origin. |

**Why blocked by default?**  Fetching an external document at page-load time
is a network side-effect that can be surprising, can leak information to
third-party servers, and can introduce content from origins you do not control.

**Safe usage:**  Only set `allowExternalMixins: "same-origin"` or `"allow"`
when you know exactly which URLs will be loaded and you trust them.

```js
// Allow same-origin templates only (most common production case)
new SmarkForm(el, { allowExternalMixins: 'same-origin' });
```

---

## Mixin Script Execution — `allowLocalMixinScripts`, `allowSameOriginMixinScripts`, `allowCrossOriginMixinScripts`

Mixin templates may include a `<script>` element as a **top-level sibling of
the template root** (not nested inside it).  By default, all such scripts are
**blocked** regardless of where the template lives.

The applicable policy option depends on the template's origin:

| Template origin | Option | Default |
|---|---|---|
| Local (in-page `<template>` element) | `allowLocalMixinScripts` | `"block"` |
| External, same origin | `allowSameOriginMixinScripts` | `"block"` |
| External, cross-origin | `allowCrossOriginMixinScripts` | `"block"` |

Each option accepts:

| Value | Behaviour |
|---|---|
| `"block"` *(default)* | Throws a script-blocked error and halts rendering.  Fail loudly. |
| `"noscript"` | Renders the template without executing its `<script>`.  Useful when you trust the markup but not the script. |
| `"allow"` | Executes the script normally. |

**Why blocked by default?**  Mixin scripts run in the page context with full
DOM access.  A template `<script>` from an untrusted source (e.g. a CDN link
you do not fully control, or a third-party template) could exfiltrate form
data or perform other malicious actions.

{: .warning }
> Setting `allowCrossOriginMixinScripts: "allow"` grants complete script
> execution for code from third-party origins.  Only use this if you fully
> control and trust those origins.

**Common patterns:**

```js
// Allow scripts in your own in-page templates (local only)
new SmarkForm(el, { allowLocalMixinScripts: 'allow' });

// Allow templates and scripts from your own server
new SmarkForm(el, {
  allowExternalMixins: 'same-origin',
  allowSameOriginMixinScripts: 'allow',
});
```

---

## Nested Scripts — `MIXIN_NESTED_SCRIPT_DISALLOWED`

Even when script execution is allowed, a `<script>` element may only appear
as a **direct sibling of the template root** inside the `<template>`, never
*inside* the root subtree:

```html
<!-- ✅ Correct — script is a sibling of the root, not inside it -->
<template id="myWidget">
  <div data-smark='{"type":"input"}'>…</div>
  <script>/* runs after each instance renders */</script>
</template>

<!-- ❌ Wrong — script inside the root throws MIXIN_NESTED_SCRIPT_DISALLOWED -->
<template id="myWidget">
  <div data-smark='{"type":"input"}'>
    <script>…</script>
  </div>
</template>
```

This restriction exists because the `<template>` tag prevents the browser from
parsing or executing its contents at page load time (which is intentional),
but nested scripts inside the expanded clone would be executed by the browser
as soon as the clone is inserted into the DOM — bypassing SmarkForm's policy
checks.  Placing scripts at the template top level gives SmarkForm full
visibility and control over them.

---

## JSON Encoding — `enableJsonEncoding`

SmarkForm supports native HTML form submission with
`enctype="application/json"` (sending form data as JSON via `fetch`).  This
feature is **disabled by default** because JSON-encoded `fetch` submissions
bypass the browser's built-in cross-site request forgery (CSRF) protections
that apply to traditional form POSTs.

| Setting | Behaviour |
|---|---|
| `enableJsonEncoding: false` *(default)* | Attempting to submit a form with `enctype="application/json"` throws an error pointing to this option. |
| `enableJsonEncoding: true` | JSON encoding is enabled; `fetch` is used for the submission. |

```js
new SmarkForm(el, { enableJsonEncoding: true });
```

**Before enabling JSON encoding**, ensure your backend is protected against
CSRF.  Typical mitigations include:

* Requiring a custom request header (`X-Requested-With: XMLHttpRequest`) that
  browsers do not include in cross-site `fetch` requests.
* Using CSRF tokens (check them server-side on every mutating request).
* Verifying the `Origin` or `Referer` header server-side.
* Configuring `SameSite=Strict` (or `Lax`) cookies.

For more details and an example, see the [form `submit` action
documentation]({{ "/component_types/type_form" | relative_url }}#submit).

---

## Error Codes Quick Reference

| Error code | Feature | Description |
|---|---|---|
| `MIXIN_EXTERNAL_FETCH_BLOCKED` | `allowExternalMixins` | External URL fetch blocked (policy `"block"`) |
| `MIXIN_CROSS_ORIGIN_FETCH_BLOCKED` | `allowExternalMixins` | Cross-origin fetch blocked (policy `"same-origin"`) |
| `MIXIN_SCRIPT_LOCAL_BLOCKED` | `allowLocalMixinScripts` | Local mixin script blocked (policy `"block"`) |
| `MIXIN_SCRIPT_SAME_ORIGIN_BLOCKED` | `allowSameOriginMixinScripts` | Same-origin mixin script blocked (policy `"block"`) |
| `MIXIN_SCRIPT_CROSS_ORIGIN_BLOCKED` | `allowCrossOriginMixinScripts` | Cross-origin mixin script blocked (policy `"block"`) |
| `MIXIN_NESTED_SCRIPT_DISALLOWED` | *(always)* | `<script>` nested inside template root — unconditionally forbidden |

See the [Error Codes Reference]({{ "/advanced_concepts/error_codes" | relative_url }})
for the full list of SmarkForm error codes.
