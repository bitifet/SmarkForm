---
title: Security Considerations
layout: chapter
permalink: /advanced_concepts/security_considerations
nav_order: 7

---

{% include links.md %}

# {{ page.title }}

<details class="chaptertoc">
<summary>
<strong>📖 Table of Contents</strong>
</summary>

  {{ "
<!-- vim-markdown-toc GitLab -->

* [Secure-by-Default Philosophy](#secure-by-default-philosophy)
* [Security Options are Root-Only](#security-options-are-root-only)
* [Mixin External Template Loading — `allowExternalMixins`](#mixin-external-template-loading--allowexternalmixins)
* [Mixin Script Execution — `allowLocalMixinScripts`, `allowSameOriginMixinScripts`, `allowCrossOriginMixinScripts`](#mixin-script-execution--allowlocalmixinscripts-allowsameoriginmixinscripts-allowcrossoriginmixinscripts)
* [Nested Scripts — `MIXIN_NESTED_SCRIPT_DISALLOWED`](#nested-scripts--mixin_nested_script_disallowed)
* [JSON Encoding — `enableJsonEncoding`](#json-encoding--enablejsonencoding)
* [Error Codes Quick Reference](#error-codes-quick-reference)

<!-- vim-markdown-toc -->
       " | markdownify }}

</details>


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

Security options are set via the **root-level SmarkForm constructor options**
(the second argument to `new SmarkForm(…)`):

```js
const myForm = new SmarkForm(document.getElementById("myForm"), {
  allowExternalMixins: 'same-origin',
  allowLocalMixinScripts: 'allow',
  enableJsonEncoding: true,
  // …
});
```

---

## Security Options are Root-Only

Security option values are **always read exclusively from the root SmarkForm
instance**, regardless of what any descendant component's `data-smark`
attribute may specify.

This is a deliberate security constraint.  Because `data-smark` attributes
can come from external sources (e.g. a cross-origin mixin template), allowing
descendant components to override security options would create a privilege
escalation path: a malicious external template could set
`allowCrossOriginMixinScripts: "allow"` on itself, then reference another
cross-origin mixin with a `<script>` that now executes freely — even if the
root only permitted same-origin scripts.

By reading security options only from the root, SmarkForm ensures the
developer's intent expressed in JavaScript (which an attacker cannot tamper
with) always takes precedence over anything that arrives in HTML.

{: .hint }
> This means you cannot loosen a security policy from within a `data-smark`
> attribute, even for a specific sub-component.  If you need a more permissive
> policy for part of your form, set the broadest policy you need at the root
> level and rely on your template authoring discipline to keep things safe.

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
const myForm = new SmarkForm(document.getElementById("myForm"), {
  allowExternalMixins: 'same-origin',
});
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
| `"noscript"` | Renders the template without executing its `<script>`.  Useful when you trust the template markup but not its scripts. |
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
const myForm = new SmarkForm(document.getElementById("myForm"), {
  allowLocalMixinScripts: 'allow',
});

// Allow templates and scripts from your own server
const myForm = new SmarkForm(document.getElementById("myForm"), {
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

SmarkForm supports all standard HTML `enctype` values (`application/x-www-form-urlencoded`,
`multipart/form-data`, and `text/plain`) by constructing and submitting a real
form under the hood.  In addition, SmarkForm provides its own non-standard
`enctype="application/json"` extension that serialises the form data as JSON
and submits it via `fetch`.

This `application/json` extension is **disabled by default** as a caution
measure.  Although it does not introduce a meaningful additional security risk
compared to standard form submissions, the use of `fetch` can be flagged by
automated security evaluation tools and, unlike traditional form POSTs, JSON
`fetch` requests do not benefit from the browser's built-in same-origin
cookie-sending restrictions that some CSRF defences rely on.

| Setting | Behaviour |
|---|---|
| `enableJsonEncoding: false` *(default)* | Attempting to submit with `enctype="application/json"` throws an error pointing to this option. |
| `enableJsonEncoding: true` | JSON encoding is enabled; `fetch` is used for the submission. |

```js
const myForm = new SmarkForm(document.getElementById("myForm"), {
  enableJsonEncoding: true,
});
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
