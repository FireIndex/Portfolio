# Portfolio

A static personal portfolio site. Minimal, editorial, no build step and no dependencies.

```
index.html      home page — curated case studies, about, skills, experience
work.html       full project catalogue (compact rows, no imagery)
styles.css      design tokens and all layout, both pages
data.js         ← all content lives here
main.js         renders both pages from data.js, plus nav/reveal behaviour
assets/         favicon, Open Graph card, project images and diagrams
PRINCIPLES.md   the design standard this site is held to
CLAUDE.md       conventions + gotchas for working on it with Claude Code
.claude/skills/ task skills (add-project, curate-work, design-check, ...)
old/            previous site + resumes — content source, not deployed
```

## Two pages, one data source

The home page features a handful of projects as proper case studies; the
catalogue lists everything. Both render from the same `PORTFOLIO` object via the
same `main.js` — a project's `featured` flag decides where it appears, and
`context` (`personal` / `work` / `open-source`) sets its grouping and
attribution. Numbers on both pages are derived from order, so nothing needs
renumbering when you add or reorder.

## Design principles

[PRINCIPLES.md](PRINCIPLES.md) is the standard the site is held to: content
must be real, typography carries the design, the accent stays rare, every text
style meets WCAG AA, and it must still work with JavaScript or animation off.
Read it before making changes.

## Skills

Seven skills in `.claude/skills/` cover the routine edits, each with the
conventions and the verification steps built in:

| Skill | For |
|---|---|
| `/add-project` | add, edit, remove or reorder a Selected Work entry |
| `/curate-work` | choose what the home page features vs the catalogue |
| `/update-info` | name, role, headline, about, email, socials, availability |
| `/add-experience` | jobs in the timeline, education entries |
| `/add-skill` | technologies and skill groups |
| `/optimize-assets` | screenshot → WebP, SVG diagrams, favicon, OG card |
| `/design-check` | full audit: contrast, overflow, a11y, fallbacks, weight |

Run `/design-check` before considering a change finished.

## Editing content

Everything you'd want to change is in [data.js](data.js) — one `PORTFOLIO`
object with a section per part of the page. Nothing in `index.html` or
`main.js` needs to be touched to swap in your own details.

Start with `meta` (name, role, location, email) and work down. To change how
many projects, skills, jobs or schools appear, add or remove entries in the
relevant array; the page adjusts itself.

Two things to update outside `data.js`, since crawlers read them before any
JavaScript runs:

- the `<title>`, `description`, `canonical` and `og:*`/`twitter:*` tags in
  [index.html](index.html) — absolute URLs point at
  `https://fireindex.github.io/Portfolio/`
- the `Person` JSON-LD block at the bottom of `<head>`

## Project images

Two kinds, both at 16:10 to match the frame (which crops with `object-fit:
cover`):

- **Screenshots** → WebP, quality 82, ~1600×1000. The five here came from the
  old site: 2457KB → 389KB.
- **Backend work with nothing to screenshot** → a hand-authored SVG diagram in
  the site's palette, showing the actual mechanism (the failover path, the
  dropped packet, the ordering constraint).

The first project image loads eagerly; the rest are lazy. See
`/optimize-assets` for the exact commands.

To add a résumé, drop the PDF in `assets/` and uncomment the entry in
`contact.profiles`.

## Design tokens

Colour, type scale and spacing are CSS custom properties at the top of
[styles.css](styles.css). The palette is deliberately warm — off-white ivory
rather than `#fff`, deep charcoal rather than `#000`.

One constraint worth keeping if you change the accent: `--accent` is
decorative only (hairlines, dots, the wash behind outcome text), while
`--accent-deep` is the text-safe version. Every text style on the page clears
WCAG AA (4.5:1 for body, 3:1 for large text) against its actual background,
including the muted greys — that's why `--muted` and `--faint` are darker than
they look like they should be.

## Running it

It's static, so open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

Deploy by uploading the folder to any static host — GitHub Pages, Netlify,
Cloudflare Pages. No build step.

## Deploying

Live at **https://fireindex.github.io/Portfolio/**, published by GitHub Actions
on every push to `main` ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

There's no build step — the workflow copies the served files into `_site` and
uploads them as a Pages artifact. Repo docs (`README.md`, `PRINCIPLES.md`,
`CLAUDE.md`, `.claude/`) are deliberately left out of that copy, so **a new
top-level file that should ship must be added to the `Stage site` step.**

One-time setup: **Settings → Pages → Source → GitHub Actions**.

All paths in the HTML are relative, so the site works unchanged under the
`/Portfolio/` subpath. Absolute URLs (canonical, `og:*`, JSON-LD, `sitemap.xml`,
`robots.txt`) are the only place the full domain is written.

## Notes

- Fonts (Fraunces, Inter, JetBrains Mono) come from Google Fonts via an
  `@import` in `styles.css`, with `preconnect` hints in the HTML.
- `data.js` assigns `window.PORTFOLIO` explicitly — a top-level `const` isn't a
  property of `window`, so `main.js` couldn't see it otherwise.
- Scroll reveals are progressive enhancement: with JavaScript disabled the
  `.no-js` class keeps everything visible, and `prefers-reduced-motion` turns
  the transitions off.
- Section reveals, the mobile nav and the active-section highlight are the only
  JavaScript behaviours. There's no router, no framework, no tracking.
