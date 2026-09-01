---
name: curate-work
description: Decide which projects appear on the home page versus the full catalogue — promote, demote, reorder, or re-label a project's ownership (personal / work / open-source). Use when the user says "this project shouldn't be on the home page", "feature my new project", "the home page has too many projects", "reorder my work", "hide the old dashboards", or "show all projects".
---

# Curate the work section

Changes which projects the home page features, without deleting anything.
Everything lives in `work.projects` in [data.js](../../../data.js); no HTML or
CSS change is needed.

Read [PRINCIPLES.md](../../../PRINCIPLES.md) §1b — the home page is curated, not
complete.

## The two levers

```js
featured: true,      // home page case study + catalogue row
featured: false,     // catalogue row only

context: "personal", // catalogue grouping + home-page badge
context: "work",     // also needs org: "Employer Name"
context: "open-source",
```

That's the whole mechanism. Flipping `featured` promotes or demotes; changing
`context` re-groups and re-labels.

## Deciding what gets featured

**Ceiling is 5–7.** Past that the home page stops being a selection and the
strongest work gets diluted by the weakest. If the user wants to add an eighth,
ask which one comes off rather than silently growing the list.

A project earns a home-page slot if it clears roughly this bar:

- it demonstrates something the others don't (a different skill, a harder
  problem, a real user-facing result)
- there's something worth *explaining* — a decision, a constraint, a failure
  mode. If the write-up would just restate the tech stack, it's a catalogue row.
- it's work the user would actually want to discuss in an interview

Reasons that are **not** sufficient: it's recent, it's on GitHub, it took a long
time, it has a nice screenshot.

**Never delete real work to tidy the page.** Demote it — the catalogue is
allowed to be complete. Deleting loses a real project; demoting costs nothing.

## Ownership labelling

`personal` is the default and renders no badge; badging everything is noise.

Set `context: "work"` plus `org` on anything employer-owned. This matters
beyond aesthetics: it must never look like company work was a personal side
project. Two things follow from it —

- those entries usually have `links: []`, because internal systems aren't
  public. That is expected; the catalogue renders their titles as plain text
  rather than dead links.
- descriptions should describe architecture and decisions, never include
  proprietary code, internal URLs, or client names beyond the employer.

If the user asks to remove work projects entirely, it's worth saying once that
they're often the strongest technical evidence on the page — then do what they
decide. Demoting to catalogue-only is the usual middle ground.

## Ordering

Featured projects render in array order, alternating image left/right
automatically. Order editorially — strongest and most recent first; the first
one gets the most attention and is the only eager-loaded image.

Keep featured entries grouped at the top of the array and catalogue-only ones
after. Not required, just readable.

Nothing needs renumbering: both pages derive numbers from order.

## Verify

```bash
python -m http.server 8899 --bind 127.0.0.1
```

- home page shows exactly the intended projects, in the intended order
- the `NN of NN` header count is right
- **alternation still reads correctly** — this shifts whenever the featured
  count changes parity, so check it after every promote/demote
- catalogue group counts updated; every featured project still has a row
- promoted projects have an `image` that exists and isn't stretched (catalogue
  rows don't need one, home-page cards do)
- at 390px: no horizontal overflow on either page
