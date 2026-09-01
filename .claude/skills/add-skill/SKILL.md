---
name: add-skill
description: Add, remove, or reorganise technologies in the portfolio's Skills section, including creating or merging skill groups. Use when the user says "add Kubernetes to my skills", "I learned Rust", "remove jQuery", "reorganise my skills", or "add a new skill category".
---

# Add or reorganise skills

Skills live in `skills.groups` in [data.js](../../../data.js). Each group is a
label plus a flat list of technology names rendered as small mono chips.

Read [PRINCIPLES.md](../../../PRINCIPLES.md) — §1 (only real skills) and §2
(mono is for short labels, not prose).

```js
{
  label: "Backend & APIs",
  items: ["FastAPI", "Django", "DRF", "Pydantic", "REST", "WebSockets", "gRPC"]
}
```

## Rules that keep this section from turning into a word cloud

**Only list what you'd defend in an interview.** This is the section most prone
to padding. A focused list reads as confidence; a 60-item list reads as a résumé
keyword dump and undercuts the whole page.

**4–7 items per group.** Fewer looks thin, more wraps into a block and loses the
scannable rhythm. If a group exceeds 7, it's usually two groups.

**Order within a group is signal** — most proficient / most central first. The
eye stops after the first few.

**Use canonical names, short form.** `PostgreSQL` not `Postgres` or
`postgresql`. `React` not `React.js` (unless disambiguating from React Native).
Names are rendered in mono at 0.78rem, so anything past ~18 characters
dominates its row — abbreviate (`DRF`, not `Django REST Framework`).

**Group by the problem solved, not by vendor.** The current grouping is
Languages & Core / Backend & APIs / Data & Storage / Architecture & Tools /
Frontend / Analysis & BI. A reader scanning for "can they build an API" should
find one group that answers it.

**Balance the grid.** Groups render two-per-row on desktop, so an even count
(4 or 6) leaves no orphan. Six is the current count — adding a seventh group
leaves a lone box on the last row.

## Adding a group

Append to `skills.groups`. No CSS or HTML change is needed; the grid and the
top rules are generated. Reconsider the balance point above before going odd.

## Removing

Delete the string from `items`. If a group empties, remove the group object —
don't leave a labelled empty row.

## Verify

```bash
python -m http.server 8899 --bind 127.0.0.1
```

- chips render as bordered mono tags, hover turns them accent-green
- no chip wraps mid-word or gets cut off at 390px
- group count still balances the two-column desktop grid
- long names (`Distributed Systems`, `Django REST Framework`) don't blow out
  their row — this is the usual failure, check it specifically
