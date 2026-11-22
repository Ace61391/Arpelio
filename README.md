# Arpelio

Fingering charts and printable quiz worksheets for band instruments.

**Live:** [arpelio.com](https://arpelio.com)

## What is this?

A free tool for band and elementary music teachers. Pick an instrument, pick the
notes you are teaching, and print one of three worksheets:

- **Reference chart** — diagram, staff position, and fingering shorthand for every note
- **Quiz: identify the note** — students see a diagram and write the note name
- **Quiz: fill the chart** — students see a note and fill in a blank diagram

Every quiz can print a teacher copy with the answers filled in. No account, no
paywall, no download limit.

There is also a **score import beta** at `/import`: upload a MusicXML file and
Arpelio renders the notation with a fingering diagram under each note. See
"Score import status" below for what does and does not work yet.

## Tech Stack

- **Framework:** Next.js 14 (App Router, React 18)
- **Styling:** Tailwind CSS
- **Notation (beta import only):** OpenSheetMusicDisplay
- **Hosting:** Vercel
- **Data:** instrument JSON in `src/data/`, checked note by note against published charts — sources in [`docs/fingering-sources.md`](docs/fingering-sources.md), ledger in [`docs/fingering-verification.md`](docs/fingering-verification.md)

## Getting Started

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
npm run validate   # check every fingering; also runs automatically before `npm run build`
```

Open [http://localhost:3000](http://localhost:3000).

Before pushing, always check the pages you touched locally — the live site is
the only other place this code runs.

## Instruments

Seven instruments are live, covering 239 notes. Each has a primary fingering per
note, plus alternates, beginner flags, common errors, and practice tips.

| Instrument | Notes | Family | Diagram type |
|---|---|---|---|
| Recorder | 27 | Woodwind | Holes (English/Baroque) |
| Flute | 38 | Woodwind | Keys (Boehm, closed G♯) |
| B♭ Trumpet | 31 | Brass | Valves |
| French Horn | 43 | Brass | Valves |
| Trombone | 31 | Brass | Slide positions 1–7 |
| Euphonium | 31 | Brass | Valves |
| BB♭ Tuba | 38 | Brass | Valves |

Clarinet (40 notes) and saxophone (33 notes) have complete data and diagram
components but are **not public** — they are flagged `hidden: true` in
`src/data/instruments.js`. Their data and key bindings were corrected in the
November 2026 audit; what still needs a check on a real instrument before
unhiding is listed under "Still open" in `docs/fingering-sources.md`.

## Project layout

```
src/
  app/
    page.js                 landing page
    builder/page.js         worksheet builder (the main tool)
    instruments/            chart browser — list + per-instrument pages
    import/page.js          MusicXML score import (beta)
    faq/, contact/          content pages
    sitemap.js, robots.js   SEO
  components/
    FingeringDiagram.js     dispatches to the right diagram by instrument
    InlineFingering.js      compact column used by score import
    diagrams/               one SVG renderer per mechanism type; keymaps.mjs binds keys to shapes
    StaffNote.js            note on a staff
    KeyReference.js         labelled diagram legend
  data/
    instruments.js          instrument metadata + visibility
    loader.js               JSON access
    *.json                  per-instrument fingering data
scripts/
  validate-fingerings.mjs   data checks (npm run validate, runs before every build)
docs/
  fingering-sources.md      what each chart was checked against, and what is still open
  fingering-verification.md note-by-note comparison with each source
```

## Score import status

The import page works for simple cases and is labelled beta on purpose. Known
limitations, roughly in order of how often they will bite:

- **Compressed MusicXML (`.mxl`) is not supported.** MuseScore exports this by
  default; you have to pick "Uncompressed MusicXML". Supporting `.mxl` means
  unzipping it client-side.
- **Clarinet and saxophone are unavailable,** because the pickers filter out
  hidden instruments — so the two biggest sections of a beginner band are
  missing.
- **Transposition does not handle octave displacement.** The offsets in
  `TRANSPOSE_TO_WRITTEN` cover alto sax but not tenor (+14) or baritone (+21),
  and there is no bass clarinet or piccolo. This table also duplicates
  `concert_pitch_offset`, which already exists in every instrument JSON with the
  opposite sign convention — it should read from the data instead.
- **Fingering positions do not survive a window resize.** Coordinates are
  measured once from the rendered SVG; OSMD re-lays out on resize but the
  overlay does not recompute.
- **Multi-part scores are not validated against the chosen instrument.** Picking
  flute fingerings on a clarinet part produces a silently wrong handout.
- Notes outside the instrument's range print "out of range" on the sheet.

## License

Copyright © 2026 Arpelio. All rights reserved.
