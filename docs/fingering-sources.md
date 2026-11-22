# Fingering sources and verification

The fingering data in `src/data/` was audited and corrected in November 2026. This file records what each
chart was checked against, what changed, and what is still open. The note-by-note comparison is in
[fingering-verification.md](fingering-verification.md).

## Sources

| Source | Covers | What it is |
|---|---|---|
| **Woodwind Fingering Guide** (wfg.woodwind.org) — basic charts and key-scheme pages | flute, clarinet, saxophone, recorder | Timothy Reichard's reference site; the standard online chart for woodwinds |
| **Dolmetsch text fingering chart** (dolmetsch.com/textfingeringchart.htm) | recorder | Baroque/English fingerings published by the recorder maker |
| **recorder-fingering** LaTeX package (CTAN, Alan Munn) | recorder | Published typesetting package with a built-in baroque fingering table |
| **NOTEbook** app data (github.com/MJFree34/NOTEbook, Apache-2.0) | flute, clarinet, saxophone, trumpet, single F horn, trombone, baritone/euphonium, 3-valve BB♭ tuba | Chart data of a published iOS fingering-chart app |
| **fingering-components** (github.com/pepperhorn/fingering-components) | flute, clarinet, saxophone, recorder, trumpet, trombone | Fingerings its author transcribed from a published maker's chart; also a front-view key layout |
| **Chromatic slide position chart**, Micah Everett, University of Mississippi (olemiss.edu/lowbrass) | trombone | University studio chart, positions listed in order of preference |
| **Wikibooks: Trombone/Slide Positions**; **The Instrumentalist**, "The Nuances of Alternate Positions" | trombone | Text confirmation of primary and alternate positions |
| **MuseScore trumpet-fingering plugin** (Jojo-Schmitz), **Brass-Fingering-Trainer** (Scotty-R) | trumpet, euphonium | Small independent datasets |
| **LilyPond woodwind diagrams** (`scm/display-woodwind-diagrams.scm`) | clarinet, saxophone key layout | Published engraving software; used only to confirm where keys sit |
| **The harmonic series** | all brass | Computed, not looked up: a valve combination or slide position either can sound a note or it cannot |

Published brass charts from Yamaha, Conn-Selmer and the method books are images or image-only PDFs. They could not be
read mechanically, so no brass fingering here rests on them.

## What changed

**Trumpet** — primaries were already correct. Two alternates could not sound their note: D5 "3" (now 1-3) and G♯5 "1-2" (removed).

**French horn (single F)** — B2–G3, C♯4–F4 and A4–B4 held B♭-horn fingerings; 17 primaries were replaced with F-horn fingerings.
The G♯4 alternate "1-2" could not sound the note and was removed. F6 changed from open to 1st valve.

**Trombone** — B3, C4, C♯4 and D4 showed the alternate position as the primary (now 4th, 3rd, 2nd, 1st, with the old
positions kept as alternates). F♯4 and G4 now show the raised 3rd and 2nd positions that real charts teach, with 5th and 4th as
alternates. The D3 alternate "1st position" was wrong and was removed.

**Euphonium** — E♭4, E4, F♯4, G4, A♭4, A4 and B♭4 were wrong (trumpet fingerings applied by letter name). B♭4 is open, not 1st valve.

**BB♭ tuba** — D1 and E♭1 were removed: they cannot be played on three valves. E1–G1 and F♯3–A3 were wrong, and C♯4–E4 used the
11th partial. B3 (2) and C4 (open) were already in line with real charts and are unchanged; 1-2 and 1 were added as alternates.

**Flute** — B4 and B5 were missing the thumb, which made them identical to C5 and C6 (fixed separately in v27). F♯6 and B6 used the
thumb B♭ lever where the B thumb key is required. B♭6 used the wrong trill key. Low C and low B now show every foot key the pinky holds.
In the diagram, G♯ and the thumb B♭ lever were drawn on each other's shapes, the two trill keys never lit, and low C♯ and low B
were swapped.

**Recorder** — D6 showed a fingering that is not D6. C♯6 needs the bell closed and now shows a bell marker; its duplicate
alternate was removed. G♯4 now uses the half-hole form that three references list, with the full fork as an alternate.

**Clarinet (hidden)** — all seven altissimo notes were missing the thumb. E♭4 and B♭5 used a fork that is not a standard
fingering (now the bottom side key, with the sliver key and the real "one and one" fork as alternates). Throat G♯ used the
right-pinky key. In the diagram every hole from L2 down was drawn one place too high and most keys had no binding.

**Saxophone (hidden)** — the data was correct except F♯6, which needs a key the diagram does not have (see below).
In the diagram, G♯ was drawn on the bis key, palm E♭ and F never lit, and the side keys and the pinky table were bound to
each other's shapes.

## Where the references disagree

- **Recorder B♭5** — WFG and the CTAN package give `t 12-|456-` (used here). Dolmetsch gives `t 12-|-56-` and the maker's chart `t 123|-56-`.
- **Recorder G♯4** — Dolmetsch and the CTAN package give the half-hole; the maker's chart gives the full fork; WFG lists both as basic. Both are in the data.
- **Recorder E♭5** — the maker's chart adds hole 1; WFG, Dolmetsch and the CTAN package agree with the data.
- **Recorder C♯6 / D6** — the CTAN package adds hole 7; WFG and Dolmetsch agree with the data.
- **Flute D♯4, F5, F♯5, G5, B5** — NOTEbook disagrees, but its entries for these notes leave out the thumb or the E♭ key and contradict its own lower octave. WFG and the maker's chart agree with the data.
- **Clarinet B4** — NOTEbook lists only the left-pinky forms; WFG and the maker's chart list the right-pinky form used here.

## Still open

1. **Horn C♯6–F6** have no published single-F chart to check against (NOTEbook stops at C6). They are confirmed by the harmonic series only, and each carries a note saying so.
2. **Saxophone high F♯ key** — the template has no shape for it. F♯6 shows the front-F fingering (NOTEbook's primary, the maker chart's alternate) and the tip describes the high-F♯-key fingering in words. Adding a shape to the template would let the chart show the usual fingering.
3. **Clarinet pinky keys** — which of the two long left-pinky levers is E/B and which is F♯/C♯, and the left/right order of the right-pinky keys, follow LilyPond's and fingering-components' layouts. Confirm against an instrument before the clarinet chart is un-hidden.
4. **Alto recorder** is listed as an instrument but has no chart of its own. The same fingerings give different note names on an F instrument.
5. **Double horn (B♭ side), F-attachment trombone and 4-valve low brass** are not covered.

## Keeping it correct

`npm run validate` (which also runs before `npm run build`) fails if:

- a brass fingering cannot sound its note on the harmonic series, or a primary uses a partial too far out of tune to teach;
- a fingering uses a key that the diagram has no shape for;
- two different notes less than an octave apart would draw the same picture;
- a chart has a gap or a duplicate, or its MIDI number, concert pitch or frequency does not add up;
- `instruments.js` and the data disagree on how many notes a chart has.

The key-to-shape bindings live in one place, `src/components/diagrams/keymaps.mjs`, which the diagrams and the validator share.
