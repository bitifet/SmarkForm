---
title: "Keyboard Navigation"
layout: chapter
description: "Use Enter-based field navigation, native Tab order and SmarkForm shortcuts where forms provide them."
permalink: "/accessibility/keyboard_navigation"
nav_order: 1
redirect_from:
  - "/working_with_forms/keyboard_navigation"
---


{% include links.md %}
{% include components/sampletabs_ctrl.md %}

# {{ page.title }}

SmarkForm adds keyboard navigation to supported fields. The exact behavior also
depends on the form's markup, native controls, browser, and enabled features.

## Enter / Shift+Enter Navigation

Press `Enter` to move forward to the next field, and `Shift`+`Enter` to move
backward. This field-navigation shortcut skips buttons and other non-field
components. Use `Tab` and `Shift`+`Tab` for the browser's normal sequential
focus order; disabled controls and the form's authored markup affect that order.

{% raw %}<!-- nav_enter_html {{{ -->{% endraw %}
{% capture nav_enter_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>First name:</label>
    <input data-smark type="text" name="first">
  </p>
  <p>
    <label data-smark>Last name:</label>
    <input data-smark type="text" name="last">
  </p>
  <p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
  </p>
  <p>
    <label data-smark>Message:</label>
    <textarea data-smark name="message"></textarea>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_enter_notes {{{ -->{% endraw %}
{% capture nav_enter_notes -%}
Press `Enter` in a single-line field to move to the next one; `Shift`+`Enter`
moves backward. In a textarea, plain `Enter` inserts a newline, `Ctrl`+`Enter`
moves forward, and `Shift`+`Enter` moves backward.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-enter"
   htmlSource=nav_enter_html
   notes=nav_enter_notes
   selected="preview"
   tests=false
%}

## Tab-Flow Exclusion for Hotkey-Equipped Buttons

Hotkey-equipped `addItem` and `removeItem` triggers inside their list context
are removed from sequential `Tab` order, so a long list does not require
tabbing through every row action. Hotkey-equipped controls outside that list
context remain in `Tab` order, including an outer Add button.

- **Inner buttons** (inside list context): Removed from `Tab` flow — users can
  activate them via their hotkey instead.
- **Outer buttons** (siblings of the list): Kept in `Tab` flow — with
  `min_items: 0`, the only way to create the first item is via the outer
  add button, which must remain keyboard-accessible.

{: .hint }
> This tab-order behavior is limited to list `addItem`/`removeItem` triggers
> with hotkeys in their list context. SmarkForm sets `tabindex="-1"` when the
> trigger has no authored `tabindex`; an explicit authored value is preserved.
> If an action is essential, provide a
> visible control that remains in the normal keyboard order; do not rely on a
> CSS-generated hotkey hint as its only description.

{% raw %}<!-- nav_tabflow_html {{{ -->{% endraw %}
{% capture nav_tabflow_html -%}
<div id="myForm$$">
  <button data-smark='{"action":"addItem","context":"items","hotkey":"+"}' title="Add">➕ Add</button>
  <button data-smark='{"action":"removeItem","context":"items","hotkey":"Delete","preserve_non_empty":true}' title="Remove empty">🧹</button>
  <ul data-smark='{"type":"list","name":"items","min_items":1}'>
    <li>
      <input data-smark type="text" name="item" placeholder="Item name">
      <button data-smark='{"action":"removeItem","hotkey":"-"}' title="Remove this">➖</button>
      <button data-smark='{"action":"addItem","hotkey":"+"}' title="Insert here">➕</button>
    </li>
  </ul>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_tabflow_notes {{{ -->{% endraw %}
{% capture nav_tabflow_notes -%}
Press `Tab` through the form — the outer `➕ Add`/`🧹` buttons are reachable, but the inner `➖`/`➕` buttons inside each list item are skipped. Hold `Ctrl` to reveal their hotkey shortcuts instead.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_tabflow_css {{{ -->{% endraw %}
{% capture nav_tabflow_css -%}
{{""}}#myForm$$ [data-hotkey] { position: relative; }
{{""}}#myForm$$ [data-hotkey]::after {
  content: "Ctrl+" attr(data-hotkey);
  position: absolute; top: 0.75em; left: 0;
  font-size: .7em; background: #333; color: #fff;
  padding: 1px 4px; border-radius: 3px; white-space: nowrap;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_tabflow_tests {{{ -->{% endraw %}
{% capture nav_tabflow_tests -%}
export default async ({ page, expect, root }) => {
    await expect(root).toBeVisible();
    const insert = root.getByTitle('Insert here').first();
    await root.locator('input[name="item"]').first().focus();
    await page.keyboard.down('Control');
    await expect(insert).toHaveAttribute('data-hotkey', '+');
    const badge = await insert.evaluate(button => {
        const style = getComputedStyle(button, '::after');
        return {
            position: style.getPropertyValue('position'),
            content: style.getPropertyValue('content'),
        };
    });
    expect(badge.position).toBe('absolute');
    expect(badge.content).toContain('Ctrl+');
    await page.keyboard.up('Control');
    await expect(insert).not.toHaveAttribute('data-hotkey');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_tabflow_demoValue {{{ -->{% endraw %}
{% capture nav_tabflow_demoValue -%}
{"items":[{"item":"Review the agenda"},{"item":"Confirm the venue"},{"item":"Send invitations"}]}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-tabflow"
   htmlSource=nav_tabflow_html
   cssSource=nav_tabflow_css
   notes=nav_tabflow_notes
   demoValue=nav_tabflow_demoValue
   tests=nav_tabflow_tests
   selected="preview"
%}

{: .info :}
> Hold `Ctrl` to discover available hotkeys — each trigger button with a
> hotkey can show a visual hint when the form includes the corresponding CSS.

## Alt+Enter for Collapsed Sections

When navigating with `Enter` / `Shift`+`Enter`, fields inside a closed
`<details>` element are skipped. To navigate into them, hold `Alt` while
pressing `Enter` — SmarkForm automatically opens any closed `<details>`
ancestors along the path. When moving forward from a `<textarea>`, keep `Ctrl`
held as well (`Ctrl`+`Alt`+`Enter`); plain `Enter` inserts a newline there.
For backward navigation into a preceding closed section, use
`Alt`+`Shift`+`Enter`.

This allows you to keep optional sections collapsed by default while still
being able to navigate into them when you need to fill data.

Sequential Enter navigation follows **SmarkForm fields**, not the browser's
native `<summary>` focus stop. If readers should be able to continue navigating
after opening a section, make the `<details>` a SmarkForm form and put a
SmarkForm field in its `<summary>`. A bare summary can still toggle the native
disclosure, but focus there is not a field in SmarkForm's navigation tree; the
next Enter cannot continue from that point into the section's fields.

{% raw %}<!-- nav_details_html {{{ -->{% endraw %}
{% capture nav_details_html -%}
<div id="myForm$$">
  <p>
    <label data-smark>Full name:</label>
    <input data-smark type="text" name="name">
  </p>
  <p>
    <label data-smark>Email:</label>
    <input data-smark type="email" name="email">
  </p>
  <details data-smark='{"type":"form","name":"billing"}'>
    <summary>
      <span data-smark='{"type":"label"}'>Address label:</span>
      <input data-smark type="text" name="label" placeholder="Home or work">
    </summary>
    <p>
      <label data-smark>Street:</label>
      <input data-smark type="text" name="street">
    </p>
    <p>
      <label data-smark>City:</label>
      <input data-smark type="text" name="city">
    </p>
    <p>
      <label data-smark>ZIP:</label>
      <input data-smark type="text" name="zip">
    </p>
  </details>
  <p>
    <label data-smark>Final comments:</label>
    <textarea data-smark name="final_comments" placeholder="Notes for the whole form"></textarea>
  </p>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_details_notes {{{ -->{% endraw %}
{% capture nav_details_notes -%}
With Billing Address collapsed, focus **Address label** and press `Enter`: focus
moves to Final comments, skipping the hidden address fields. `Shift`+`Enter`
moves back to Address label. From that field, `Alt`+`Enter` opens the section and
focuses Street. `Shift`+`Space` from an address field folds it and returns focus
to Address label; another `Shift`+`Space` opens it without losing that field.

The Address label input is deliberately inside `<summary>`. A native summary
without a SmarkForm field can open and close the disclosure, but SmarkForm cannot
resume sequential Enter navigation from its native focus stop.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_details_demoValue {{{ -->{% endraw %}
{% capture nav_details_demoValue -%}
{
  "name": "Taylor Morgan",
  "email": "taylor@example.com",
  "billing": {
    "label": "Home",
    "street": "42 River Lane",
    "city": "Brookside",
    "zip": "12345"
  },
  "final_comments": "Call before delivery."
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- nav_details_tests {{{ -->{% endraw %}
{% capture nav_details_tests -%}
export default async ({ page, expect, root, readField, writeField }) => {
    await expect(root).toBeVisible();
    await writeField('/', {
        name: 'Taylor Morgan',
        email: 'taylor@example.com',
        billing: {
            label: 'Home', street: '42 River Lane', city: 'Brookside',
            zip: '12345',
        },
        final_comments: 'Call before delivery.',
    });

    const details = root.locator('details');
    const label = root.locator('input[name="label"]');
    const street = root.locator('input[name="street"]');
    const comments = root.locator('textarea[name="final_comments"]');

    await label.focus();
    await page.waitForTimeout(25); // Keep the deliberate keypress outside the IME focus guard window.
    await page.keyboard.press('Enter');
    await expect(comments).toBeFocused(); // Closed body fields are skipped.
    await page.keyboard.press('Shift+Enter');
    await expect(label).toBeFocused();

    await page.waitForTimeout(25);
    await page.keyboard.press('Alt+Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(street).toBeFocused();

    await page.keyboard.press('Shift+Space');
    await expect(details).not.toHaveAttribute('open', '');
    await expect(label).toBeFocused();
    await page.keyboard.press('Shift+Space');
    await expect(details).toHaveAttribute('open', '');
    await expect(label).toBeFocused();
    await page.waitForTimeout(25);
    await page.keyboard.press('Enter');
    await expect(street).toBeFocused();

    expect(await readField('/billing/label')).toBe('Home');
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
   formId="nav-details"
   htmlSource=nav_details_html
   notes=nav_details_notes
   demoValue=nav_details_demoValue
   tests=nav_details_tests
   selected="preview"
%}

## Using `<details>` as List Items

A powerful design pattern is to wrap each list item in a `<details>` element
with the item's key identifying field placed inside the `<summary>`.  This
way, even when collapsed, the key information remains visible so the user can
quickly scan the list, while the full details expand on click.

SmarkForm fields inside the `<details>` work exactly as they would anywhere
else — the browser handles the show/hide toggle natively. `Shift+Space` on a
field inside a `<summary>` toggles its `<details>` section; on a field in the
open body it folds the section and returns focus within its summary (to its
first focusable child, or to the summary itself). `Alt+Enter`
provides a separate way to navigate into a collapsed section. Use semantic
markup and test focus and announcements with your target assistive technology.

The contacts example below preserves the key field inside each collapsed
summary. Its co-located test checks Space/Shift+Space, forward/backward list
navigation, and `Alt`+`Enter` / `Alt`+`Shift`+`Enter` into hidden fields.

{% raw %}<!-- collapsible_sections_html {{{ -->{% endraw %}
{% capture collapsible_sections_html -%}
<div id="myForm$$">
  <div data-smark='{"name":"contacts","type":"list","min_items":1,"export_empties":false}'>
    <details>
      <summary>
        <input data-smark type="text" name="fullname" placeholder="Full name">
      </summary>
      <div class="contact-details">
        <input data-smark type="email" name="email" placeholder="Email">
        <input data-smark type="tel" name="phone" placeholder="Phone">
        <button data-smark='{"action":"removeItem","failback":"clear","hotkey":"Delete"}' title="Remove">🗑</button>
      </div>
    </details>
  </div>
  <button data-smark='{"action":"addItem","context":"contacts","hotkey":"+"}'>➕ Add contact</button>
  <textarea data-smark name="notes" placeholder="Notes about this contact list"></textarea>
</div>
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- collapsible_sections_css {{{ -->{% endraw %}
{% capture collapsible_sections_css -%}
{{""}}#myForm$$ {
  font-family: sans-serif;
}
{{""}}#myForm$$ details {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 6px;
  padding: 4px 8px;
}
{{""}}#myForm$$ summary {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  list-style: none;
  user-select: none;
}
{{""}}#myForm$$ summary::before {
  content: "▶";
  font-size: .75em;
  transition: transform .15s;
  flex-shrink: 0;
}
{{""}}#myForm$$ details[open] > summary::before {
  transform: rotate(90deg);
}
{{""}}#myForm$$ summary input {
  flex: 1;
  min-width: 0;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
}
{{""}}#myForm$$ .contact-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 0 2px 1.2em;
}
{{""}}#myForm$$ .contact-details input {
  flex: 1;
  min-width: 120px;
}
{{""}}#myForm$$ .contact-details button {
  margin-left: auto;
}
{{""}}#myForm$$ textarea[name="notes"] {
  display: block;
  width: 100%;
  min-height: 60px;
  margin-top: 8px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}
/* Hold Ctrl to reveal hotkey hints. */
#myForm$$ [data-hotkey] { position: relative; }
#myForm$$ [data-hotkey]::after {
  content: "Ctrl+" attr(data-hotkey);
  position: absolute; top: 0.75em; left: 0;
  font-size: .7em; background: #333; color: #fff;
  padding: 1px 4px; border-radius: 3px; white-space: nowrap;
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- collapsible_sections_js {{{ -->{% endraw %}
{% capture collapsible_sections_js -%}
// Native details plus SmarkForm keyboard navigation; no custom JS is needed.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- collapsible_sections_notes {{{ -->{% endraw %}
{% capture collapsible_sections_notes -%}
**Try it:** Edit a contact name in the summary, expand its details, and use
`Enter`, `Shift`+`Enter`, `Alt`+`Enter`, and `Alt`+`Shift`+`Enter` to test
forward/backward navigation across collapsed list items.
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- collapsible_sections_demoValue {{{ -->{% endraw %}
{% capture collapsible_sections_demoValue -%}
{
  "contacts": [
    {"fullname":"Alice Smith","email":"alice@example.com","phone":"+1 555 100 0001"},
    {"fullname":"Bob Jones","email":"bob@example.com","phone":"+1 555 100 0002"},
    {"fullname":"Carol White","email":"carol@example.com","phone":"+1 555 100 0003"}
  ],
  "notes": ""
}
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% raw %}<!-- collapsible_sections_tests {{{ -->{% endraw %}
{% capture collapsible_sections_tests -%}
export default async ({ page, expect, id, root, readField, writeField }) => {
    await expect(root).toBeVisible();

    const formSel = `#myForm-${id}`;
    const addBtn = root.getByRole('button', { name: '➕ Add contact' });

    // Set up: ensure we have 3 contacts for navigation tests.
    // The form starts with 1 contact (min_items=1); add 2 more.
    await addBtn.click();
    await page.waitForTimeout(50);
    await addBtn.click();
    await page.waitForTimeout(50);

    // ── Issue 1: Space key in <summary> input must NOT toggle <details> ──────
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        const firstSummaryInput = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstSummaryInput.focus();
        await page.waitForTimeout(30); // > IME_FOCUS_AGE_MS

        // Press Space — must type a space, NOT close the <details>
        await page.keyboard.press(' ');

        const stillOpen = await page.evaluate(
            s => document.querySelector(`${s} details`).open, formSel
        );
        expect(stillOpen, 'Space key in summary input must not toggle <details>').toBe(true);
    }

    // ── Shift+Space: toggle <details> but prevent space character from being typed
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        const firstSummaryInput = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        const valueBefore = await firstSummaryInput.inputValue();
        await firstSummaryInput.focus();
        await page.waitForTimeout(30);

        // Shift+Space — must toggle the <details> but NOT type a space
        await page.keyboard.press('Shift+ ');

        const nowClosed = await page.evaluate(
            s => !document.querySelector(`${s} details`).open, formSel
        );
        expect(nowClosed, 'Shift+Space must toggle (close) the <details>').toBe(true);

        const valueAfter = await firstSummaryInput.inputValue();
        expect(valueAfter, 'Shift+Space must not type a space into the input').toBe(valueBefore);
    }

    // ── Shift+Space from body field: fold + refocus to summary ───────────────
    {
        // Open the first contact's <details>
        await page.evaluate(s => {
            document.querySelector(`${s} details`).open = true;
        }, formSel);

        // Focus a field that is inside the body (not <summary>)
        const firstBodyInput = root.locator('details').nth(0).locator('input[name="email"]');
        await firstBodyInput.focus();
        await page.waitForTimeout(30);

        // Shift+Space from the body — must fold (close) the <details>
        await page.keyboard.press('Shift+ ');

        const nowClosed = await page.evaluate(
            s => !document.querySelector(`${s} details`).open, formSel
        );
        expect(nowClosed, 'Shift+Space from body must fold (close) the <details>').toBe(true);

        // Focus must have moved to a field inside <summary> (not lost)
        const focusInSummary = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            return !!active.closest('summary');
        }, formSel);
        expect(focusInSummary, 'Shift+Space from body must refocus a field in <summary>').toBe(true);
    }

    // ── Issue 2: Enter in closed <summary> input → navigate to next item ─────
    {
        // Close all contacts
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = false;
        }, formSel);

        const firstFullname = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstFullname.focus();
        await page.waitForTimeout(30);

        // Enter must skip the hidden email/phone of contact[0] and go to
        // the fullname (summary input) of contact[1]
        await page.keyboard.press('Enter');

        const focusedInSecond = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            if (!active.closest('summary')) return false;
            const details = active.closest('details');
            const allDetails = [...document.querySelectorAll(`${s} details`)];
            return allDetails.indexOf(details) === 1;
        }, formSel);

        expect(
            focusedInSecond,
            'Enter in closed summary input must skip hidden fields and go to next item\'s summary field'
        ).toBe(true);
    }

    // ── Alt+Enter: unfold closed <details> and navigate into hidden fields ────
    {
        // Close all contacts
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = false;
        }, formSel);

        const firstFullname = root.locator('details').nth(0).locator('summary input[name="fullname"]');
        await firstFullname.focus();
        await page.waitForTimeout(30);

        // Alt+Enter must open the first contact's <details> and navigate
        // to the first hidden field (email) inside it
        await page.keyboard.press('Alt+Enter');

        const focusedOnEmail = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            return active.name === 'email'
                && active.closest('details') === document.querySelector(`${s} details`);
        }, formSel);

        expect(
            focusedOnEmail,
            'Alt+Enter in closed summary must unfold the details and navigate to the first hidden field'
        ).toBe(true);

        const firstDetailOpen = await page.evaluate(
            s => document.querySelector(`${s} details`).open, formSel
        );
        expect(firstDetailOpen, 'Alt+Enter must open the closed <details>').toBe(true);
    }

    // ── Issue 3: Enter from last field of last form-type list item ────────────
    {
        // Open all contacts so the phone fields are reachable
        await page.evaluate(s => {
            for (const d of document.querySelectorAll(`${s} details`)) d.open = true;
        }, formSel);

        const lastPhone = root.locator('details').last().locator('input[name="phone"]');
        await lastPhone.focus();
        await page.waitForTimeout(30);

        // Enter must cross the list boundary and land on the notes textarea
        await page.keyboard.press('Enter');

        const focusedOnNotes = await page.evaluate(
            s => document.activeElement === document.querySelector(`${s} [name="notes"]`),
            formSel
        );

        expect(
            focusedOnNotes,
            'Enter from last field of last form-type list item must navigate to field after the list'
        ).toBe(true);
    }

    // ── Backward navigation: Shift+Enter from a field after a list/form ──────
    // All contacts are still open from the previous test.
    {
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        // Shift+Enter from the textarea (no Ctrl needed for backward navigation)
        await page.keyboard.press('Shift+Enter');

        // Should land on 'phone' of the last contact (last field of last item),
        // NOT on 'fullname' (which would happen if focus always dives to first child).
        const focusedOnLastPhone = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            const phone = lastDetail?.querySelector('input[name="phone"]');
            return active === phone;
        }, formSel);

        expect(
            focusedOnLastPhone,
            'Shift+Enter from field after list must land on last field (phone) of last list item'
        ).toBe(true);
    }

    // ── Backward navigation: Shift+Enter from first field of a list item ─────
    {
        // Start on 'fullname' of contact[2] (last contact, first field)
        const lastFullname = root.locator('details').last().locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        // Shift+Enter should cross the list item boundary and land on 'phone'
        // of the previous item (contact[1]) — the last field of that item.
        await page.keyboard.press('Shift+Enter');

        const focusedOnPrevPhone = await page.evaluate(s => {
            const active = document.activeElement;
            if (!active) return false;
            const details = document.querySelectorAll(`${s} details`);
            const secondDetail = details[1]; // contact[1]
            const phone = secondDetail?.querySelector('input[name="phone"]');
            return active === phone;
        }, formSel);

        expect(
            focusedOnPrevPhone,
            'Shift+Enter from first field of a list item must land on last field of previous item'
        ).toBe(true);
    }

    // ── Backward navigation into CLOSED (folded) items ───────────────────────
    // Shift+Enter must SKIP closed items (symmetric with forward navigation).
    // Alt+Shift+Enter must open a closed item and land on its last field.

    // Close all contacts first.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Plain Shift+Enter from notes must SKIP hidden fields and land on
        // the last visible field of the last contact (fullname, in <summary>).
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            return {
                isOpen: lastDetail?.open,
                focusedFullname: active === lastDetail?.querySelector('summary input[name="fullname"]'),
                focusedPhone: active === lastDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Plain Shift+Enter must NOT open a closed <details>'
        ).toBe(false);
        expect(
            result.focusedFullname,
            'Plain Shift+Enter into a closed item must land on its last VISIBLE field (fullname in summary)'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Plain Shift+Enter into a closed item must NOT land on the hidden phone field'
        ).toBe(false);
    }

    // Close all again, then test Alt+Shift+Enter (should open and enter).
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Alt+Shift+Enter from notes must OPEN the last contact and land on its
        // last field (phone).
        const notesFld = root.locator('[name="notes"]');
        await notesFld.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Alt+Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const lastDetail = details[details.length - 1];
            return {
                isOpen: lastDetail?.open,
                focusedPhone: active === lastDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Alt+Shift+Enter into a closed item must open its <details>'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Alt+Shift+Enter into a closed item must land on its last field (phone)'
        ).toBe(true);
    }

    // Close all again, then test crossing item boundary with plain Shift+Enter.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Open last contact just enough to focus its fullname (in <summary>).
        // Plain Shift+Enter must cross the item boundary and land on the last
        // VISIBLE field of the middle contact (fullname in <summary>), NOT open it.
        const lastDetails = root.locator('details').last();
        await page.evaluate(s => {
            const details = document.querySelectorAll(`${s} details`);
            details[details.length - 1].open = true;
        }, formSel);
        await page.waitForTimeout(30);

        const lastFullname = lastDetails.locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const middleDetail = details[1]; // contact[1]
            return {
                isOpen: middleDetail?.open,
                focusedFullname: active === middleDetail?.querySelector('summary input[name="fullname"]'),
                focusedPhone: active === middleDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Plain Shift+Enter crossing to a closed previous item must NOT open it'
        ).toBe(false);
        expect(
            result.focusedFullname,
            'Plain Shift+Enter crossing to a closed previous item must land on its last visible field (fullname)'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Plain Shift+Enter crossing to a closed previous item must NOT focus hidden phone'
        ).toBe(false);
    }

    // Close all again, then test crossing boundary with Alt+Shift+Enter.
    await page.evaluate(s => {
        document.querySelectorAll(`${s} details`).forEach(d => d.open = false);
    }, formSel);
    await page.waitForTimeout(30);

    {
        // Open last contact, focus fullname.  Alt+Shift+Enter must open the
        // middle contact and land on its last field (phone).
        const lastDetails = root.locator('details').last();
        await page.evaluate(s => {
            const details = document.querySelectorAll(`${s} details`);
            details[details.length - 1].open = true;
        }, formSel);
        await page.waitForTimeout(30);

        const lastFullname = lastDetails.locator('summary input[name="fullname"]');
        await lastFullname.focus();
        await page.waitForTimeout(30);

        await page.keyboard.press('Alt+Shift+Enter');
        await page.waitForTimeout(50);

        const result = await page.evaluate(s => {
            const active = document.activeElement;
            const details = document.querySelectorAll(`${s} details`);
            const middleDetail = details[1]; // contact[1]
            return {
                isOpen: middleDetail?.open,
                focusedPhone: active === middleDetail?.querySelector('input[name="phone"]'),
            };
        }, formSel);

        expect(
            result.isOpen,
            'Alt+Shift+Enter crossing to a closed previous item must open it'
        ).toBe(true);
        expect(
            result.focusedPhone,
            'Alt+Shift+Enter crossing to a closed previous item must land on its last field (phone)'
        ).toBe(true);
    }
};
{%- endcapture %}{% raw %}<!-- }}} -->{% endraw %}

{% include components/sampletabs_tpl.md
    formId="collapsible_sections"
    htmlSource=collapsible_sections_html
    cssSource=collapsible_sections_css
    jsSource=collapsible_sections_js
    notes=collapsible_sections_notes
    demoValue=collapsible_sections_demoValue
    selected="preview"
    tests=collapsible_sections_tests
    minHeight=40
%}
