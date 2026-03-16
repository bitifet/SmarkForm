# Release Prep: 0.13.2

## Release Notes Summary

SmarkForm 0.13.2 fixes a frustrating bug in Chromium-based mobile browsers (Chrome/Brave on Android) where pressing the "Next" key on the virtual keyboard would skip two fields instead of one in scalar list inputs. The root cause is a Chromium engine bug (`IME_ACTION_NEXT`) that fires a synthetic `keydown` event after natively advancing focus; SmarkForm now detects and suppresses this spurious event using a timestamp-based heuristic. A bug report has been filed with the Chromium project (https://issues.chromium.org/issues/492805133). Chromium mobile (Pixel 5 emulation) and Safari mobile are now part of the automated test suite to catch mobile-specific regressions early.

### Features
- Smart value coercion: new documentation section with examples and tests.
- Responsive iframe height (`heightPct`) in sampletabs for better editor experience.
- List item animations applied to Team Event Planner showcase demo.

### Bug Fixes
- Workaround for Chromium/Brave Android `IME_ACTION_NEXT` double-advance in scalar list fields — timestamp-based detection suppresses spurious synthetic `keydown`. (Upstream Chromium bug: https://issues.chromium.org/issues/492805133)

### Other
- Chromium mobile (Pixel 5) and Safari mobile added to Playwright test matrix.
- `npm test` now runs the full browser matrix (chromium, firefox, webkit, chromium-mobile, safari-mobile); `test:quick` picks one browser at random.
- Improved `demoValue` round-trip smoke test generator.
- Documentation clarifications (editor UI references, animations section rewrite, code-tabs padding fix).

---

### Proposed Commit Message (for the final squashed commit)

```
Version 0.13.2
```

---

## Telegram Announcement

<Channel: https://t.me/s/smarkform>

---

🚀 **SmarkForm 0.13.2 is out!**

If you've been seeing double-advance glitches when tapping "Next" on Android keyboards in list fields, this one's for you. We tracked down a Chromium engine bug, shipped a robust workaround, and filed an upstream report so it gets fixed at the source.

Key highlights:
- 🐛 Workaround for Chromium/Brave Android IME "Next" double-field-skip in list inputs.
- 🧪 Chromium mobile + Safari mobile now in the automated test matrix.
- ✨ Smart value coercion docs + responsive sampletabs iframe height.

📦 npm: `npm install smarkform@0.13.2`
🔗 Docs: https://smarkform.bitifet.net
📝 Changelog: https://github.com/bitifet/SmarkForm/releases/tag/0.13.2

---

## Social Media Texts

> All variants below are fully written and ready to copy. Adjust emoji or tone to taste.

### Twitter / X

#### Public (general audience)

```
#SmarkForm 0.13.2 is out! 🚀

Fixed: Chromium/Brave Android keyboard "Next" was skipping 2 fields instead of 1 in list inputs.
Root cause: a Chromium engine bug. Workaround shipped + upstream bug reported.

Also: mobile browsers now in the test matrix 🧪

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#JavaScript #WebDev #Forms #OpenSource
```

---

#### Frontend Developers

```
#SmarkForm 0.13.2 — mobile keyboard bug squashed 🐛📱

Chromium/Brave on Android was double-advancing list inputs when users tapped "Next".
Traced to a Chromium engine bug, workaround shipped, bug filed upstream.

Chromium mobile + Safari mobile now in CI ✅

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#FrontEnd #JavaScript #MobileBugs #WebDev
```

---

#### HTML-driven Devs

```
#SmarkForm 0.13.2 out 🚀

Pure HTML forms that just work — including on Android.
Fixed: virtual keyboard "Next" was skipping fields in list inputs on Chromium/Brave.

No JS required by your markup. SmarkForm handles the edge cases.

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#HTML #WebDev #JavaScript #Forms
```

---

#### Open Source Contributors

```
#SmarkForm 0.13.2 shipped 🛠️

We chased down a Chromium engine bug causing double-advance on Android keyboard.
Workaround merged. Upstream bug filed. Mobile CI added.

Want to help? Check open issues 👉 https://github.com/bitifet/SmarkForm

📦 npm i smarkform@0.13.2

#OpenSource #JavaScript #ContributeToOpenSource
```

---

#### Software Engineering

```
#SmarkForm 0.13.2 🔬

Root-caused a mobile input bug to a Chromium engine quirk (IME_ACTION_NEXT):
→ native focus advance + synthetic keydown = double skip.
→ Fix: timestamp-based detection to suppress the spurious event.

Upstream report filed. Regression tests added.

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#SoftwareEngineering #JavaScript #BugFix
```

---

#### Build in Public

```
#SmarkForm 0.13.2 just shipped 👷

What I shipped today:
✅ Tracked down a Chromium Android keyboard bug
✅ Shipped a workaround in production
✅ Filed upstream bug report
✅ Added mobile CI (Chromium + Safari mobile)

Lesson: always test on mobile browsers too 📱

📦 npm i smarkform@0.13.2

#BuildInPublic #JavaScript #OpenSource
```

---

#### I Can Code

```
Ever wonder why your form skips 2 fields instead of 1 on Android? 🤔

I did too. Turns out it's a Chromium engine bug. #SmarkForm 0.13.2 fixes it.

Short story: native focus + a ghost keydown event = double skip.
Fix: check the timestamps and ignore the ghost.

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#JavaScript #WebDev #ICanCode #Coding
```

---

#### Tech Founders

```
Mobile UX bugs kill conversions. #SmarkForm 0.13.2 fixes one you probably didn't know you had.

Chromium/Brave on Android was skipping 2 form fields instead of 1 on "Next".
Workaround shipped. Upstream bug filed. Mobile test matrix added.

Build better forms, ship faster.

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#TechFounders #JavaScript #ProductDev #WebDev
```

---

#### Web Developers

```
#SmarkForm 0.13.2 🚀

Android users tapping "Next" on the keyboard were skipping 2 fields at once.
We found the Chromium bug, shipped a workaround, and filed it upstream.

Also added Chromium mobile + Safari mobile to the test suite 🧪

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#WebDev #JavaScript #Mobile #Forms
```

---

#### Tech Twitter

```
TIL: Chromium on Android fires a synthetic keydown AFTER natively advancing focus via IME "Next".
If you handle Enter/keydown to move focus, you'll double-advance. 🤦

#SmarkForm 0.13.2 has the fix.

Bug filed: https://issues.chromium.org/issues/492805133

#JavaScript #WebDev #TechTwitter #BrowserBugs
```

---

#### JavaScript

```
#SmarkForm 0.13.2 🐛→✅

Chromium Android: IME "Next" = native focus advance + ghost synthetic keydown.
Result: list inputs skip two fields instead of one.

Fix: timestamp diff between focus and keydown events.
If Δt < threshold → it's an IME advance → suppress keydown.

📦 npm i smarkform@0.13.2

#JavaScript #BugFix #WebDev #Forms
```

---

#### Actually Build in Public

```
Real talk: I shipped a bug fix today for something that took days to debug. 🕵️

Problem: Android keyboard "Next" was skipping 2 fields in @SmarkForm list inputs.
Root cause: a Chromium engine bug that fires a ghost event after advancing focus.
Fix: timestamp-based heuristic to detect and suppress the ghost keydown.

#SmarkForm 0.13.2 is live.

📦 npm i smarkform@0.13.2

#ActuallyBuildInPublic #JavaScript #OpenSource
```

---

#### Front End Fraternity

```
📱 PSA for #FrontEndDev friends:

If your list form inputs double-skip on Android tap-to-next, it's not your code.
It's a Chromium engine bug. #SmarkForm 0.13.2 ships the workaround.

Mobile CI (Chromium + Safari) now guards against future regressions.

📦 npm i smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#FrontEndFraternity #JavaScript #MobileWeb
```

---

### LinkedIn Article

#### Content

**Title:** How We Tracked Down a Chromium Android Keyboard Bug in SmarkForm (and What We Did About It)

**Outline:**

1. **Hook**: A reproducible UX bug on Android — form fields skip twice when tapping "Next".
2. **The investigation**: narrowing it down from "user error" → "SmarkForm bug" → "Chromium engine bug". Describe the `IME_ACTION_NEXT` mechanism.
3. **The fix**: timestamp-based heuristic to detect whether a `keydown` event is a synthetic echo of an IME advance. Show the core code snippet.
4. **Going upstream**: filed a bug report with Chromium issues (https://issues.chromium.org/issues/492805133). Why this matters for the ecosystem.
5. **Mobile CI**: added Chromium mobile (Pixel 5 emulation) and Safari mobile to the Playwright test matrix. How this prevents regressions.
6. **Lessons learned**: always test on mobile browsers; sometimes the bug is not in your code.
7. **Call to action**: link to SmarkForm, GitHub, docs.

#### Hero Image Prompt

A split-screen illustration: on the left, an Android phone showing a multi-field form with an animated arrow skipping two fields (labelled "Before — Chromium bug"). On the right, the same phone with the arrow correctly advancing one field at a time (labelled "After — SmarkForm 0.13.2"). Clean, flat design, purple and white brand colors, subtle code snippet overlay in the background.

---

### LinkedIn Posts

#### Full Stack Titans

```
🐛 We just shipped SmarkForm 0.13.2 — and the backstory is worth a read.

A Chromium engine bug on Android was causing list inputs to skip two fields when users tapped "Next" on the virtual keyboard. After investigation, we traced it to IME_ACTION_NEXT: Chromium advances focus natively AND fires a synthetic keydown — doubling the navigation.

The fix: a timestamp-based heuristic that detects when a keydown is just an echo of an IME advance and suppresses it. Workaround is in production. Upstream bug filed.

We also added Chromium mobile (Pixel 5) and Safari mobile to our Playwright CI matrix so this class of regression can never sneak through again.

If you build forms for web — especially mobile — SmarkForm handles these browser quirks so you don't have to.

🔗 https://smarkform.bitifet.net
📦 npm install smarkform@0.13.2

#FullStack #JavaScript #WebDev #Forms #MobileWeb #OpenSource
```

---

#### Software Developer

```
SmarkForm 0.13.2 is out — and it comes with a debugging story 🕵️

We fixed a mobile UX bug where Chromium/Brave on Android would skip two list-input fields instead of one when the user tapped the keyboard "Next" action.

Root cause: a Chromium engine bug (IME_ACTION_NEXT) that fires a synthetic keydown event after natively advancing focus. SmarkForm now uses a timestamp-based heuristic to detect and suppress the ghost event.

Bug filed upstream: https://issues.chromium.org/issues/492805133

New in this release:
✅ Chromium Android double-advance workaround
✅ Chromium mobile + Safari mobile in CI
✅ Smart value coercion documentation

📦 npm install smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#SoftwareDevelopment #JavaScript #WebDev #OpenSource #BugFix
```

---

#### CSS3/HTML5 The Future of Front End

```
SmarkForm 0.13.2 is live — pure HTML form power, now more reliable on mobile 📱

One of the most important features of SmarkForm is that your markup stays clean HTML. The library handles the hard parts — including this Chromium Android keyboard bug that was causing list inputs to double-advance.

What's new:
• Chromium/Brave Android "Next" double-skip: fixed ✅
• Mobile browsers (Chromium + Safari) now in CI ✅
• Responsive iframe height for embedded examples ✅
• Smart value coercion docs ✅

No framework required. No bloat. Just HTML + SmarkForm.

🔗 https://smarkform.bitifet.net
📦 npm install smarkform@0.13.2

#HTML5 #CSS3 #FrontEnd #JavaScript #WebDev #OpenSource
```

---

#### Software Development

```
Debugging mobile browser bugs is a special kind of adventure. 🎢

SmarkForm 0.13.2 fixes a Chromium Android keyboard issue that caused form list fields to skip twice when users tapped "Next". We identified the root cause (a Chromium engine quirk), shipped a workaround, added targeted tests, and filed an upstream bug report.

This is exactly the kind of browser compatibility work that goes into building reliable open-source libraries.

Release highlights:
• IME_ACTION_NEXT double-advance workaround
• Chromium mobile + Safari mobile CI coverage
• Smart value coercion documentation

📦 npm install smarkform@0.13.2
🔗 https://smarkform.bitifet.net
📋 Bug report: https://issues.chromium.org/issues/492805133

#SoftwareDevelopment #JavaScript #OpenSource #WebDev #QA
```

---

#### Software Engineering

```
A case study in browser compatibility engineering: SmarkForm 0.13.2 🔬

We traced a mobile UX regression to Chromium's IME_ACTION_NEXT mechanism: when a user taps the virtual keyboard "Next" action, the browser advances focus natively AND dispatches a synthetic keydown event. If your JS handles keydown to advance focus in list fields, you get a double-skip.

Our fix: measure the time delta between the focus event and the subsequent keydown. If Δt is below a threshold, the keydown is an IME echo — suppress it.

Takeaways:
1. Mobile browser bugs are real and subtle.
2. Test on actual mobile browser engines (not just desktop + DevTools).
3. File upstream bugs — it helps the ecosystem.

SmarkForm 0.13.2 now includes Chromium mobile and Safari mobile in the CI test matrix.

📦 npm install smarkform@0.13.2
🔗 https://smarkform.bitifet.net

#SoftwareEngineering #JavaScript #BrowserCompatibility #OpenSource #QA
```

---

## Security Notes

No open vulnerabilities after `npm audit`.

---

## Manual Steps for the User

After reviewing this document, please perform the following steps **in this order**:

1. **Remove this file** (`RELEASE_PREP.md`) from the repository root before the squash merge.

2. **Squash and commit** all release-prep commits into a single commit:
   ```bash
   git checkout main
   git merge --squash copilot/prepare-release-0-13-2
   git commit -m "Version 0.13.2"
   git push origin main
   ```

3. **Tag the release**:
   ```bash
   git tag 0.13.2
   git push origin 0.13.2
   ```

4. **Create a GitHub Release** at https://github.com/bitifet/SmarkForm/releases/new:
   - Tag: `0.13.2`
   - Title: `SmarkForm 0.13.2`
   - Body: paste the Release Notes Summary from this document.

5. **Publish to npm**:
   ```bash
   npm publish
   ```

6. **Rebase `stable` on `main`**:
   ```bash
   git checkout stable
   git rebase main
   git push origin stable
   ```
