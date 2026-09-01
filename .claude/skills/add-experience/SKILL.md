---
name: add-experience
description: Add or update a job in the portfolio's Experience timeline, or an entry in the Education section. Handles ordering, the current-role marker, and achievement bullets. Use when the user says "I got a new job", "add my new role", "update my job description", "add my degree", or "add a certification".
---

# Add experience or education

Both sections live in [data.js](../../../data.js) — `experience.entries` and
`education.entries`. Both render newest-first from array order.

Read [PRINCIPLES.md](../../../PRINCIPLES.md) — §1 especially. Do not invent a
role, a date range, or an achievement. If the user is vague about dates or
impact, ask; a thin honest entry is fine, a fabricated one is not.

## Experience entry

```js
{
  period: "Sep 2024 — Present",   // en dash, spaced. "Present" for current role
  role: "Quantitative Python Developer",
  org: "Finesse Stock Broking Services Pvt. Ltd.",
  place: "Delhi, India",          // optional; renders after the org, dot-separated
  description: "...",             // 2–3 sentences on scope and the through-line
  highlights: [                   // optional; 2–4 achievement bullets
    "Architected the real-time WebSocket backend — ...",
    "Built an emergency square-off engine handling 2,000+ orders at 4× speed"
  ]
}
```

**Ordering matters for the marker.** The *first* entry in the array gets the
accent-filled timeline dot (all others are grey), because the design uses it to
mean "current". A new job goes at the top of the array. If the user leaves a job
and isn't starting another, change `period` to a closed range — the dot follows
position, not the word "Present", so leaving a finished role first would be wrong.

**`description`** is the shape of the job: what you owned, and the recurring
theme. Not a duty list.

**`highlights`** are the specifics that a recruiter scans for. Lead with the
verb, include the number if there is one. Keep each to one line at desktop
width — they render at 14px and wrap awkwardly past ~110 characters.

Source these from the user's resume when one is available (there are two in
`old/`, framed for different audiences — SDE and Quant). Prefer the framing that
matches the site's positioning rather than mixing both.

## Education entry

```js
{
  degree: "Bachelor of Computer Applications (BCA)",
  institution: "Indira Gandhi National Open University",
  year: "2021 — 2024",
  areas: ["Programming", "Databases", "Data Structures"]   // 3–4, mono, dot-separated
}
```

Keep it compact — per the design brief this section is deliberately minimal.
Don't add GPA, coursework lists, or thesis titles unless asked.

## If a section becomes empty

Per §1, an empty section shouldn't render as an empty shell. If the last
experience entry is removed, remove the whole `<section id="experience">` block
from `index.html`, its nav item from `data.nav`, and the `renderExperience()`
call — then confirm the remaining section numbers renumbered themselves
(they're derived from document order, so they will).

## Verify

```bash
python -m http.server 8899 --bind 127.0.0.1
```

- the new entry appears in the right position
- **the accent dot is on the current role and nowhere else**
- `place` renders dot-separated after the org (or is absent cleanly)
- highlights aren't wrapping mid-word or overflowing at 390px
- education rows stay on one line each at desktop; they stack at mobile
