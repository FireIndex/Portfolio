---
name: update-info
description: Update the portfolio's personal information — name, role, hero headline, about text, contact email, phone, social profiles, location, or availability status. Also handles the crawler-visible metadata (title, description, Open Graph, JSON-LD) that must be edited in index.html. Use when the user says "change my headline", "update my email", "I'm not looking for work anymore", "change my job title", or "update my about section".
---

# Update personal info

Most edits are one field in [data.js](../../../data.js). The trap is that some
information exists in **two** places, and updating only `data.js` silently leaves
stale text for search engines and link previews.

Read [PRINCIPLES.md](../../../PRINCIPLES.md) — §1 (content must be real),
§8 (one source, but metadata is the exception).

## The two-place rule

`main.js` rewrites `<title>` and the meta description at runtime, but crawlers
and social scrapers often read the HTML *before* JS runs. So identity-level
changes must be made in both files.

| Change | `data.js` | `index.html` |
|---|---|---|
| Name | `meta.name` | `<title>`, `og:title`, `twitter:title`, `og:site_name`, JSON-LD `name`, author meta |
| Role / job title | `meta.role` | `<title>`, `og:title`, `twitter:title`, JSON-LD `jobTitle` |
| Description | `meta.description` | `description`, `og:description`, `twitter:description` |
| Email | `contact.email` | JSON-LD `email` |
| Social links | `contact.profiles` | JSON-LD `sameAs` |
| Site URL | `meta.url` | `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD `url` |
| Location | `meta.location`, `hero.meta` | JSON-LD `address.addressCountry` |
| Hero headline, about, quote | yes | — (not in metadata) |

Everything else — hero intro, about paragraphs, focus/expertise lists, footer —
is `data.js` only.

`work.html` carries its own `<title>`, `description` and `og:*` block, and
`renderMeta()` deliberately skips non-home pages so it keeps them. If you change
the name or the site URL, update that file too — it is easy to forget.

The site URL still contains `https://example.com` placeholders. When the real
domain is known, replace every occurrence in `index.html`, `work.html` and
`meta.url`.

## Common requests

**Availability status.** `meta.available: false` removes the `● Available` pill
entirely (cleaner than wording it as unavailable). To reword instead, set
`meta.availableLabel`.

**Hero headline.** Keep it a single sentence that says what you build, not an
adjective pile. It renders in Fraunces at up to 5rem, so aim for 8–14 words —
longer wraps to four lines and loses its impact. Check it at 390px too.

**About section.** Three paragraphs is the design's rhythm: where you came from,
what you do now, where you're heading. The `quote` is a pull-quote — one short
declarative sentence, no attribution.

**Adding a social profile.** Append to `contact.profiles`:

```js
{ label: "PyPI", href: "https://pypi.org/user/...", handle: "@username" }
```

`handle` is the small mono line under the label. The grid is `auto-fit` with a
160px minimum, so it reflows on its own — but 3 or 6 entries balance better than
4 or 5 on desktop. Non-http schemes (`tel:`, `mailto:`) are handled correctly and
deliberately don't get `target="_blank"`.

## Verify

Render and check — per §10, don't skip this for "just a text change":

```bash
python -m http.server 8899 --bind 127.0.0.1
```

- the new text appears, and is not clipped or overflowing at 390px
- if you changed identity fields, view source and confirm the *static* HTML
  shows the new value (not just the rendered DOM)
- a long headline or role still fits the nav bar and hero without wrapping badly

Quick check that no placeholder survived:

```bash
grep -rn "example.com" index.html work.html data.js
```

And confirm the nav still fits — six items is close to the limit at ~1024px.
Adding a seventh, or a longer label, is what breaks it.
