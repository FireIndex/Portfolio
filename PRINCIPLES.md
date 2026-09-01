# Design Principles

The standard this site is held to. Every change should leave these true.
When a request and a principle conflict, say so rather than quietly breaking one.

The goal, in three words: **quietly impressive.** It should read as a portfolio
made by a thoughtful engineer — not a template trying to prove it is a portfolio.

---

## 1. Content earns its place

Nothing goes on the page because a section exists and looks empty. If there is
no real work history, there is no Experience section. If a project has no live
demo, it gets no demo link.

**Never invent content.** No placeholder companies, no rounded-up metrics, no
"Lorem ipsum", no claimed skills that aren't real. If something is missing, ask
for it or leave the section out. A short honest page beats a padded one.

Every number on the page traces back to something real (a resume, a repo, a
deployed app). If a claim can't be sourced, it doesn't ship.

## 1b. The home page is curated, not complete

The home page carries a small number of projects explained properly; everything
else lives in the catalogue (`work.html`). Roughly **5–7 featured** is the
ceiling — past that it stops being a selection and the strongest work gets
diluted by the weakest.

Two supporting rules:

- **Attribute employer-owned work.** Professional projects belong on the page —
  they are often the strongest evidence — but `context: "work"` and an `org`
  must make ownership unambiguous. Never imply company work was a personal
  project, and never publish proprietary code or internal URLs.
- **Demote rather than delete.** Older or smaller work moves to
  `featured: false`, keeping its catalogue row. The catalogue is allowed to be
  complete; the home page is not.

## 2. Typography does the work

Three faces, each with one job. Don't add a fourth.

| Face | Role |
|---|---|
| **Fraunces** | Headings, hero statements, editorial pull-quotes |
| **Inter** | Body text, navigation, buttons, UI |
| **JetBrains Mono** | Labels, metadata, tech names, dates, section numbers |

Headings should feel elegant, not oversized for the sake of being impressive.
Mono is for small supporting text — never for paragraphs.

## 3. Restraint over decoration

Whitespace and hierarchy carry the design. Explicitly avoid:

- gradients (beyond the two hairline fades in the hero), glassmorphism, glow
- giant cards, heavy shadows, thick borders
- flashy or attention-seeking animation
- more than one accent colour
- decorative imagery that doesn't inform

Visual details stay small and deliberate: 1px borders, small mono labels,
section numbering, subtle rules, tightly controlled corner radius (3–5px).

If a new element doesn't clarify something, it doesn't belong.

## 4. Colour is soft, and the accent is rare

Warm off-white ground, deep charcoal text — never `#000` or `#fff` as dominant
colours, never neon, never a saturated brand blue.

Two rules that are easy to get wrong:

- **`--accent` is decorative only** — hairlines, dots, the wash behind outcome
  text. It does not have enough contrast for text.
- **`--accent-deep` is the text-safe accent.** Use it for any coloured text.

The accent should appear sparingly: links, tiny highlights, hover states, the
current-role marker. If it starts feeling like a theme colour, it's overused.

## 5. Accessible is not optional

- **Every text style meets WCAG AA** against its *actual composited*
  background — 4.5:1 for body, 3:1 for large text. This is why `--muted` and
  `--faint` are darker than they intuitively "should" be. Don't lighten them.
- Semantic HTML: one `<h1>`, no skipped heading levels, real landmarks.
- Keyboard reachable, with a visible focus ring. Skip link stays first.
- Every image has meaningful `alt` text. Diagrams describe the *mechanism*,
  not just "a diagram".
- External links get `target="_blank"` **and** `rel="noopener noreferrer"`.

## 6. The site works when things are switched off

Progressive enhancement is the baseline, not a nicety:

- **No JavaScript** → `.no-js` keeps all content visible.
- **`prefers-reduced-motion`** → transitions off, nothing hidden.
- **Animations disabled entirely** → the site should still feel excellent.

Animation is subtle and fast: gentle fades, underline reveals, a slight image
scale on hover. No parallax, no loaders, no cursor-followers, no bouncing, no
scroll-jacking.

## 7. Stay static and dependency-free

No backend, no database, no CMS, no build step, no framework, no tracking.
Plain HTML, CSS and JS served as files.

The only external request is Google Fonts. Don't add a library to solve
something 20 lines of CSS solves.

## 8. One source of content

All copy lives in [data.js](data.js) as the `PORTFOLIO` object. Adding a
project or job means editing that file and nothing else. Both pages
(`index.html` and `work.html`) render from that one object via one `main.js`.

Two deliberate consequences:

- **Section and project numbers are computed** from document/array order in
  `main.js`. Never hardcode `01`, `02` — add, remove or reorder and the rest
  renumber themselves. There is no `id` field on a project.
- **Every render function no-ops when its container is absent**, which is how
  one script serves two pages. Keep that property when adding a renderer.
- `main.js` renders from data and tolerates optional fields (a project with no
  `links`, a job with no `place`). Keep it that way: no field should be
  mandatory just because every current entry happens to have it.

Crawler-visible metadata (`<title>`, `description`, `og:*`, JSON-LD) lives in
`index.html` because it must exist before JS runs. Update both.

## 9. Images are optimised before they ship

- Screenshots → **WebP**, quality ~82, cropped to **16:10**.
- Keep each under ~150KB; the whole page well under ~1MB.
- Backend/infrastructure work has no screenshot — draw a **hand-authored SVG
  diagram** that shows the real mechanism (the failover path, the dropped
  packet, the sequencing gate). Use the site's own palette tokens.
- First project image is `eager`; the rest are `lazy`.

A diagram that just shows boxes labelled "API" and "DB" is decoration. Show
what actually makes the system interesting.

## 10. Verify in a real browser

Structural checks aren't proof. Before calling a change done:

- render it and look at it
- check 390px, 768px and 1440px — **zero horizontally overflowing elements**
- confirm contrast on any colour change, compositing translucent backgrounds
- confirm the mobile nav still opens

Two bugs that shipped past static checks and were only caught by rendering:
`const PORTFOLIO` not attaching to `window` (blank page, no console error), and
seven text styles failing AA. Look at the page.
