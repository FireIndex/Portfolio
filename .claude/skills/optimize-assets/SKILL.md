---
name: optimize-assets
description: Optimise portfolio images — crop screenshots to the 16:10 project frame, convert to WebP, regenerate the favicon or Open Graph card, or author an SVG architecture diagram for work that has no screenshot. Use when the user says "optimise the images", "this screenshot is too big", "add a diagram for X", "the site loads slowly", or "regenerate the OG image".
---

# Optimise assets

Keeps the page fast and the imagery consistent. Per
[PRINCIPLES.md](../../../PRINCIPLES.md) §9: screenshots are WebP at 16:10 under
~150KB; infrastructure work gets a hand-authored SVG diagram.

For reference, the five real screenshots on this site went 2457KB → 389KB (84%
reduction) with no visible quality loss at render size.

## Screenshot → WebP at 16:10

`.project__media` is `aspect-ratio: 16/10` with `object-fit: cover`, so anything
not 16:10 gets cropped by the browser in a way you didn't choose. Crop
deliberately instead:

```bash
python - <<'PY'
from PIL import Image
import os

SRC, DST = "old/images/Something.png", "assets/work-slug.webp"
W, H = 1600, 1000                       # 16:10

im = Image.open(SRC).convert("RGB")
w, h = im.size
if w / h > W / H:                       # too wide → crop sides, keep centre
    nw = int(h * W / H); x = (w - nw) // 2
    im = im.crop((x, 0, x + nw, h))
else:                                   # too tall → crop bottom, anchor top
    nh = int(w * H / W)
    im = im.crop((0, 0, w, nh))
im.resize((W, H), Image.LANCZOS).save(DST, "WEBP", quality=82, method=6)
print(f"{os.path.getsize(DST)/1024:.1f}KB")
PY
```

Why these choices:
- **anchor top** when cropping height — dashboards and web UIs put their title
  and key metrics at the top; centring cuts them off
- **quality 82, method 6** — visually lossless for UI screenshots at render
  size; method 6 is slower to encode but smaller
- **1600×1000** is 2× the largest rendered width, so it stays crisp on retina
  without paying for 1920px

If a file still exceeds ~150KB, drop quality to 75 before increasing dimensions.
Text-heavy screenshots (like the Writer app) compress worst — that's expected.

WebP is safe to use without a PNG fallback; every browser that supports the
site's CSS supports WebP.

## SVG architecture diagram

For backend work with nothing to screenshot. This is the part that deserves real
effort — §9 rules out generic box-and-arrow decoration. Show the mechanism that
makes the system interesting: the packet being dropped and repaired, the
cold-standby taking over, the ordering constraint that must not be violated.

Setup: `viewBox="0 0 800 500"` (16:10), `role="img"`, and an `aria-label` that
describes the mechanism in a sentence.

Palette — use these exact values so the diagram sits in the page:

| Purpose | Hex |
|---|---|
| ground `<rect>` | `#f0ece3` |
| node fill | `#faf8f4` |
| secondary stroke | `#d3ccbe` |
| primary label | `#23211d` |
| secondary label | `#6b6559` |
| primary stroke / emphasis | `#455946` |
| dashed fallback path | `#6b7f6b` |

Conventions the four existing diagrams share — match them:

- left → right flow, with a mono uppercase column header per stage
  (`BROKER FEEDS`, `NORMALIZE`, `SERVE`)
- solid `stroke-width="1.5"` = primary path
- `stroke-dasharray="5 4"` = failover, standby, or reversible path
- rounded `rx="4"` boxes, `stroke-width="1.5"` on the emphasised node
- a hairline rule near the bottom, then one uppercase mono row stating the
  guarantee (`100% DATA INTEGRITY`, `ZERO-DOWNTIME TICK STREAMING`)
- `font-family="monospace"`, sizes 10–13

Text in SVG doesn't wrap — use one `<text>` per line. Keep labels short enough
not to collide with the next column.

Validate:

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('assets/work-slug.svg'); print('ok')"
```

Escape `&` as `&amp;` in labels, and prefer `·` or `—` over ASCII substitutes.

## Favicon

`assets/favicon.svg` is the monogram (`SK`, ivory on charcoal, `rx="12"`), with
`assets/favicon-256.png` as the `alternate icon` and apple-touch fallback. If the
name changes, update both — and keep the shape, since a changed favicon reads as
a different site.

## Open Graph card

`assets/og.svg` is 1200×630 and mirrors the hero: mono `PORTFOLIO / 2026` label,
three lines of Georgia serif (standing in for Fraunces, which isn't available to
an SVG renderer), name and role in mono along the bottom.

It must stay in sync with the hero headline and the role in `index.html`. Some
scrapers don't render SVG — if link previews matter, rasterise to PNG at 1200×630
and point `og:image`/`twitter:image` at that instead.

## Verify

```bash
du -ch index.html styles.css main.js data.js assets/* | tail -1
ls -la assets/
```

Then render the page (per §10) and confirm images aren't stretched, are sharp at
desktop width, and that the first project image is `eager` while the rest are
`lazy`. Delete any asset no longer referenced from `data.js`.
