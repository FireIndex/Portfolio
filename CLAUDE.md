# ReadMe — personal portfolio

Static portfolio site. No backend, no build step, no framework, no dependencies.

## Before changing anything

Read **[PRINCIPLES.md](PRINCIPLES.md)**. It is the standard this site is held to,
and the project skills cite it by section number. The three rules broken most
often by accident:

1. **Never invent content** (§1) — no placeholder employers, no rounded-up
   metrics, no unclaimed skills. Missing info gets asked for or omitted.
2. **`--accent` is decorative; `--accent-deep` is text-safe** (§4, §5). `--muted`
   and `--faint` are already at their WCAG AA minimum — darken, never lighten.
3. **Verify in a real browser before reporting done** (§10).

## Layout

```
index.html    home page — curated case studies + about/skills/experience/contact
work.html     full project catalogue (compact typographic rows, no imagery)
styles.css    design tokens + all layout, both pages
data.js       ← ALL site content lives here (window.PORTFOLIO)
main.js       renders both pages from data.js; nav, reveals, active section
assets/       favicon, OG card, project images (WebP) and diagrams (SVG)
old/          previous Webflow-based site + resumes; content source, not shipped
```

**Two pages, one script, one data source.** `main.js` runs on both; each render
function returns early when its container element is missing. `renderWork()`
draws only `featured: true` projects; `renderCatalogue()` draws all of them
grouped by `context`. Keep that no-op-when-absent property if you add a
renderer, or `work.html` will throw.

## Use the skills

Prefer these over ad-hoc edits — they encode the conventions and the
verification steps:

| Skill | For |
|---|---|
| `add-project` | add / edit / remove / reorder a Selected Work entry |
| `curate-work` | choose what the home page features vs the catalogue |
| `update-info` | name, role, headline, about, email, socials, availability |
| `add-experience` | jobs in the timeline, education entries |
| `add-skill` | technologies and skill groups |
| `optimize-assets` | screenshot → WebP, SVG diagrams, favicon, OG card |
| `design-check` | full audit: contrast, overflow, a11y, fallbacks, weight |

Run `design-check` before calling any change finished.

## Things that will trip you up

- **`data.js` must assign `window.PORTFOLIO`.** A top-level `const` is not a
  property of `window`; without the explicit assignment the page renders blank
  with *no console error*.
- **Section and project numbers are derived** from document/array order
  (`[data-section-num]`; project numbers from index). Never hardcode `01`, `02`
  — and note projects have **no `id` field**.
- **Nav anchors are rewritten per page.** `#about` becomes `index.html#about`
  on any page without a hero. Non-anchor hrefs (`work.html`) pass through.
- **`renderMeta()` skips non-home pages** so `work.html` keeps its own
  `<title>` and description.
- **Identity info lives in two places.** `data.js` for the rendered page, and
  `index.html` for `<title>` / `description` / `og:*` / JSON-LD, because
  crawlers read the HTML before JS runs. Update both.
- **The site URL is `https://fireindex.github.io/Portfolio/`** (GitHub Pages
  project site), set in `index.html` and `meta.url`. Update both, plus
  `sitemap.xml` and `robots.txt`, if the domain ever changes.
- **Headless `--screenshot` / `--dump-dom` are unreliable here.** `--window-size`
  doesn't set the layout viewport and `vh` resolves to 0, producing false
  failures. Drive Chrome over CDP with `Emulation.setDeviceMetricsOverride`
  instead (see `design-check`). `/json/new` needs **PUT** and
  `--remote-allow-origins='*'`.
- **Wait for `.project__name`** before asserting on the DOM — the page renders
  from `data.js`, so an early read looks like an empty page.

## Local run

```bash
python -m http.server 8899 --bind 127.0.0.1
```
