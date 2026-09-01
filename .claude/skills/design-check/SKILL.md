---
name: design-check
description: Audit the portfolio against its design principles — WCAG AA contrast on real composited backgrounds, responsive overflow at mobile/tablet/desktop, semantic HTML and accessibility, reduced-motion and no-JS fallbacks, asset weight, and placeholder leftovers. Use before shipping, after a colour or layout change, or when the user asks "check the site", "is it accessible", "audit the design", or "did I break anything".
---

# Design check

Verifies the site still satisfies [PRINCIPLES.md](../../../PRINCIPLES.md).
Run this after any colour, layout, or content change — and always before
telling the user something is done.

Two real bugs shipped past structural checks on this project and were only
caught by rendering: `const PORTFOLIO` not attaching to `window` (blank page,
**no console error**), and seven text styles failing AA. Static checks alone are
not sufficient.

**Audit both pages.** `index.html` and `work.html` share one stylesheet and one
script, so a change to either can break the other. Run every check below against
both URLs.

## Setup

```bash
python -m http.server 8899 --bind 127.0.0.1    # background it
```

Launch Chrome for CDP (headless `--dump-dom` and `--screenshot` are unreliable
here — `--window-size` doesn't set the layout viewport, and `vh` units resolve
to 0, which produces false failures):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --disable-gpu --remote-debugging-port=9222 \
  --remote-allow-origins='*' --user-data-dir=/tmp/cdp-audit about:blank &
```

Notes: `/json/new` needs **PUT**. Drive it with `websocket-client` (installed).
Use `Emulation.setDeviceMetricsOverride` for real viewports. Wait for
`.project__name` (home) or `.cat-row` (catalogue) before asserting — the pages
render from `data.js`, so an early read looks like a blank page.

## 1. Contrast — the check most likely to fail

Per §5, every text style must meet AA against its **actual composited**
background. Walking up the DOM for the first non-transparent `backgroundColor`
is not enough, and produces both false passes and false failures:

- the nav resolves to `oklab(...)`, which a naive `\d+` regex parses into
  nonsense
- `.project__outcome` sits on `rgba(107,127,107,0.09)` — an alpha wash that must
  be composited over ivory before measuring
- transparent parents mean the real backdrop is `body`

So: composite alpha down to an opaque base, and resolve non-`rgb()` colours by
**rasterising one pixel to a canvas** — `getComputedStyle` on a probe element
returns `oklab(...)` unchanged, and a naive `/[\d.]+/g` match then reads
`0.979547` as an RGB channel and reports near-black:

```js
var cv = document.createElement('canvas'); cv.width = cv.height = 1;
var cx = cv.getContext('2d');
function parse(c) {
  if (/^rgba?\(/.test(c)) {                    // already concrete
    var m = c.match(/[\d.]+/g).map(Number);
    return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 };
  }
  cx.clearRect(0, 0, 1, 1);
  cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);   // canvas forces sRGB conversion
  var d = cx.getImageData(0, 0, 1, 1).data;
  return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
}
```

This matters concretely: the nav is `color-mix(in srgb, ivory 88%, transparent)`,
which computes to `oklab(...)`. Parsed naively, `.nav__brand` reports **1.04:1**
(charcoal on charcoal) when it is actually **15.15:1**. Three of the site's
styles fail spuriously without this.

Check body text ≥ 4.5:1 and large text (≥24px, or ≥18.66px bold) ≥ 3:1. Test at
minimum: `.mono`, `.project__tech li`, `.footer__inner`, `.sec-head__num`,
`.edu__areas li`, `.timeline__highlights li`, `.profile__handle`, `.status`,
`.project__tag`, `.project__org` — and on the catalogue page `.cat-row__num`,
`.cat-row__kind`, `.cat-row__tech li`, `.cat-row__year`, `.cat-row__case`,
`.cat-group__count`. These are the muted styles closest to the line.

If something fails, **darken the token, don't lighten the background.** `--muted`
and `--faint` are already tuned to the minimum; going lighter breaks §5.

Current baseline: **38 of 38 styles pass.** Any failure is either a regression
or a measurement bug — rule out the latter (see the canvas note above) before
changing a colour.

## 2. Responsive overflow

At 390 / 768 / 1440, assert **zero** elements wider than the viewport:

```js
Array.from(document.querySelectorAll('*'))
  .filter(el => { const r = el.getBoundingClientRect();
                  return r.width > 0 && r.right > innerWidth + 1; })
  .map(el => el.tagName + '.' + el.className)
```

Also confirm `document.documentElement.scrollWidth <= innerWidth`.

Then the mobile nav specifically, since it's the one interactive piece:
- toggle is `display: flex` below 900px, `none` above
- clicking it sets `aria-expanded="true"` and `data-open="true"`
- the panel spans the full viewport width (left 0 → right = innerWidth)
- all nav links are visible and inside the panel bounds
- Escape closes it

**Measure link text, not the link box.** `.nav__link` is `display: block`, so
its `getBoundingClientRect()` spans the whole row and reports `left: 0` even
when the text is correctly inset — this hid a real bug where every label sat
flush against the screen edge. Use a Range over the text node:

```js
function textBox(el){
  var r = document.createRange(); r.selectNodeContents(el);
  return r.getBoundingClientRect();
}
```

Assert each label's text `left` equals the gutter and matches `.nav__brand`
above it, and that nothing is within ~8px of either edge, down to 320px.

Two related traps in that panel:

- **Absolute positioning resolves against `.nav__inner`'s _padding_ box**, and
  the gutter *is* padding — so `left/right: 0` already reaches the viewport
  edges. Adding negative insets to "bleed" it overflows by twice the gutter.
  Re-apply the gutter to the rows instead.
- **Set the CDP viewport after load, not only before.** A navigation can reset
  `setDeviceMetricsOverride`, and stale metrics silently report the wrong
  `innerWidth` — which made a 40px overflow look like zero. Re-assert it, and
  disable the network cache, or you will measure the previous stylesheet.

## 2b. Cross-page integrity

Unique to the two-page structure:

- **no dead links** — assert nothing has `href="#"` or an empty `href`
- catalogue titles link out **only** when the project has `links`; internal work
  renders as plain text
- nav anchors on `work.html` are rewritten to `index.html#...`
- `work.html` keeps its own `<title>` (renderMeta must not overwrite it)
- the home page's `NN of NN` count and each catalogue group count match the data
- every `featured: true` project appears on **both** pages

## 3. Semantics and accessibility

- exactly one `<h1>`; no skipped heading levels
- every `<img>` has non-empty `alt`; diagrams describe the mechanism
- every `a[target="_blank"]` has `rel` containing `noopener`
- skip link is the first focusable element
- `main`, `nav[aria-label]`, `footer` present; every `section[aria-labelledby]`
  resolves to a real id
- focus ring visible on links and buttons

## 4. Fallbacks

**Reduced motion** — set via CDP:

```
Emulation.setEmulatedMedia features=[{name:'prefers-reduced-motion',value:'reduce'}]
```

All `.reveal` elements must have `opacity: 1` (count of hidden = 0) and
transitions effectively disabled. Nothing may be permanently invisible.

**No JS** — the `.no-js` class on `<html>` must keep content visible. Note the
site renders *content* from `data.js`, so with JS off the page is intentionally
near-empty; what matters is that no CSS rule hides things that would otherwise show.

## 5. Weight and leftovers

```bash
du -ch index.html work.html styles.css main.js data.js assets/* | tail -1  # < ~1MB
ls -la assets/                                                     # each image < ~150KB
grep -rn "example.com\|Lorem\|TODO\|FIXME\|placeholder" index.html work.html data.js styles.css
python -c "import xml.etree.ElementTree as ET,glob; [ET.parse(f) for f in glob.glob('assets/*.svg')]; print('svg ok')"
```

Also confirm no asset in `assets/` is unreferenced by `data.js`/`index.html`,
and no referenced asset is missing.

## Reporting

State plainly what passed and what failed, with the measured numbers. If a check
produced a suspicious result (a text colour apparently 1.3:1 against its own
colour), investigate whether it's a measurement artifact before reporting it as a
bug — and say which it was. Don't report a clean bill of health for checks you
didn't actually run.
