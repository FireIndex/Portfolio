---
name: add-project
description: Add a new project to the portfolio's Selected Work section, or edit/remove/reorder an existing one. Handles the data.js entry, image optimisation (WebP crop or hand-authored SVG diagram), and browser verification. Use when the user says "add a project", "add my new repo to the site", "update the X project", "remove project Y", or "reorder the work section".
---

# Add a project

Adds one project to `work.projects` in [data.js](../../../data.js), with its
image, then verifies it rendered.

Read [PRINCIPLES.md](../../../PRINCIPLES.md) first. The ones that bite here:
content must be real (§1), images must be optimised (§9), verify in a browser (§10).

## 1. Gather what the entry needs

Every field below is required except `links`. Ask only for what you can't find
yourself — check the repo, its README, the deployed URL, or the user's resume in
`old/` before asking.

```js
{
  featured: true,              // true -> home page case study; false -> catalogue only
  context: "work",             // "personal" | "work" | "open-source"
  org: "Finesse Stock Broking",// only on context: "work" — names the employer
  name: "PyData",              // short product name, not a sentence
  kind: "Real-Time Market Data Engine",   // mono subtitle: what class of thing it is
  description: "...",          // 2–3 sentences: problem, approach, the interesting decision
  outcome: "...",              // one sentence, concrete result — see below
  tech: ["Python", "FastAPI"], // 3–5 items, most important first
  year: "2025",
  links: [                     // omit or leave [] if genuinely nothing to link
    { label: "Live demo", href: "https://..." },
    { label: "GitHub",    href: "https://..." }
  ],
  image: "assets/work-pydata.svg",
  alt: "..."                   // describes the mechanism, not "a screenshot"
}
```

There is **no `id` field** — display numbers are derived from array order on
both pages, so inserting or reordering never leaves a stale `04` behind.

## Featured vs catalogue

One array, two views:

- **`featured: true`** → a full case study on the home page (large image,
  description, outcome, tech, links) **and** a row in the catalogue.
- **`featured: false`** → catalogue row only (`work.html`).

Keep the home page to roughly **5–7 featured projects**. Beyond that the page
stops being a curated selection, which is the entire point of the split. If the
user wants to feature an eighth, ask which one comes off.

**`context` sets the catalogue grouping and the home-page badge.** `personal` is
the default and renders no badge — badging everything is noise. `work` and
`open-source` get a small label, and `work` entries also show `org` after the
`kind` line so employer-owned work is never mistaken for a side project. Always
set `context` on professional work; only omit `links` on it if the code is
genuinely not public (internal systems usually aren't — that's expected, and the
catalogue renders those titles as plain text rather than dead links).

An image is only needed for a featured project — the catalogue is deliberately
text-only. A `featured: false` entry still needs `image` if you might promote it
later, but it isn't loaded until then.

**On `description`:** say what was hard, not what the tech stack was. "Combines
X with Y" is filler; "the sequencing is strict because getting it wrong breaks
the position" is the real content.

**On `outcome`:** must be verifiable. A latency number, a throughput figure, a
"deployed publicly", a "published on PyPI". If there is no real outcome, write
what shipped — never invent a percentage. Per §1, an unsourceable claim doesn't ship.

**On `links`:** the first link becomes the destination for the whole image
panel, so put the best one first (live demo > repo > files). Internal or
proprietary work usually has no links — that's fine, `main.js` handles it.

## 2. Prepare the image

**If there is a screenshot** (`assets/work-<slug>.webp`):

```bash
python - <<'PY'
from PIL import Image
im = Image.open("path/to/screenshot.png").convert("RGB")
W, H = 1600, 1000                      # 16:10, matches .project__media
w, h = im.size
if w / h > W / H:                      # cover-crop, centred horizontally
    nw = int(h * W / H); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
else:                                  # anchored top — dashboards put content there
    nh = int(w * H / W); im = im.crop((0, 0, w, nh))
im.resize((W, H), Image.LANCZOS).save("assets/work-SLUG.webp", "WEBP", quality=82, method=6)
PY
```

Check the result is under ~150KB. Raise compression before you accept a heavier file.

**If it is backend/infrastructure work with nothing to screenshot**, author an
SVG diagram (`assets/work-<slug>.svg`) by hand. This is the part worth effort —
per §9 a diagram of boxes labelled "API" and "DB" is decoration. Show the thing
that makes the system interesting: the dropped packet being repaired, the
failover path, the ordering constraint.

Use `viewBox="0 0 800 500"` (16:10) and the site's own palette so it sits in the
page rather than on it:

| Token | Hex | Use |
|---|---|---|
| card ground | `#f0ece3` | the `<rect>` background |
| box fill | `#faf8f4` | node fills |
| border | `#d3ccbe` | secondary node strokes |
| ink | `#23211d` | primary labels |
| muted | `#6b6559` | secondary labels |
| accent-deep | `#455946` | primary flow arrows, emphasis |
| accent | `#6b7f6b` | dashed recovery/fallback paths |

Conventions used by the existing four diagrams — follow them for consistency:
solid stroke = primary path, `stroke-dasharray="5 4"` = failover or reversible
path, uppercase mono row along the bottom = the headline guarantee. Give the
`<svg>` a `role="img"` and an `aria-label` describing the mechanism.

Validate it parses:

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('assets/work-SLUG.svg'); print('ok')"
```

## 3. Insert into data.js

Featured projects render in array order, alternating image left/right
automatically — you don't set the side. Order is editorial: strongest and most
recent first. Keep the featured entries grouped at the top of the array and the
catalogue-only ones after them; it isn't required, but it keeps the file
readable.

Nothing needs renumbering — both pages derive their numbers from order.

## 4. Verify

Never report done without rendering. Start a server, then check in a browser:

```bash
python -m http.server 8899 --bind 127.0.0.1
```

Check **both pages**:

`index.html` (if `featured: true`)
- appears with its derived number, name, `kind`, description, outcome, tech, links
- the image loads (not a broken-image box) and is not visibly stretched
- alternation still reads correctly — no two adjacent projects on the same side
- the `06 of 10` count in the section header updated itself
- `context: "work"` shows the badge and the `org` attribution

`work.html`
- a row appears in the correct ownership group, with the group count updated
- the title links out only if the project has links; plain text otherwise
- featured rows show the "Case study" link back to the home page

Both, at 390px: no horizontal overflow.

Counts and numbers are all derived, so if any look stale something broke.

## Removing, reordering, or demoting

Delete or move the object — no renumbering needed. Delete the now-orphaned image
from `assets/` too; don't leave dead files behind.

**To demote instead of delete**, flip `featured: true` → `false`. The project
keeps its catalogue row and its links; it just stops taking space on the home
page. This is usually the right move for older work, and is preferable to
deleting real projects.

Verify afterwards on both pages — home-page alternation shifts when the featured
count changes parity.
