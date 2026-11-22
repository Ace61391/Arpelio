# Fingering verification ledger

Every primary fingering in `src/data/*.json`, compared with each independent reference.
Generated on 2026-11-22 after the accuracy fixes. Sources are described in [fingering-sources.md](fingering-sources.md).

**How to read a row**

- **P** — the reference gives this fingering as its primary (basic) fingering for the note.
- **A** — the reference lists this fingering for the note, but not first.
- **✗** — the reference covers the note and gives a different fingering. Every ✗ is explained in fingering-sources.md.
- **–** — the reference does not cover the note.
- **Harmonic series** (brass only) — the partial this fingering sounds. A ✓ means the valves or slide position can physically produce the note on a partial that is usable as a primary.
- **Confirmed by** — how many independent checks agree with Arpelio (P, A, or a ✓ on the harmonic series).

### Recorder (27 notes)

| Note | Arpelio primary | WFG | Dolmetsch | CTAN package | Maker chart | Confirmed by |
|---|---|---|---|---|---|---|
| C4 | T 123\|4567 | P | P | P | P | 4 |
| C#4 | T 123\|456(7) | P | P | P | P | 4 |
| D4 | T 123\|456- | P | P | P | P | 4 |
| D#4 | T 123\|45(6)- | P | P | P | P | 4 |
| E4 | T 123\|45-- | P | P | P | P | 4 |
| F4 | T 123\|4-67 | P | P | P | P | 4 |
| F#4 | T 123\|-56- | P | P | P | P | 4 |
| G4 | T 123\|---- | P | P | P | P | 4 |
| G#4 | T 12-\|45(6)- | P | P | P | ✗ | 3 |
| A4 | T 12-\|---- | P | P | P | P | 4 |
| Bb4 | T 1-3\|4--- | P | P | P | P | 4 |
| B4 | T 1--\|---- | P | P | P | P | 4 |
| C5 | T -2-\|---- | P | P | P | P | 4 |
| C#5 | - 12-\|---- | P | P | P | P | 4 |
| D5 | - -2-\|---- | P | P | P | P | 4 |
| D#5 | - -23\|456- | P | P | P | ✗ | 3 |
| E5 | t 123\|45-- | P | P | P | P | 4 |
| F5 | t 123\|4-6- | P | P | P | P | 4 |
| F#5 | t 123\|-5-- | P | P | P | P | 4 |
| G5 | t 123\|---- | P | P | P | P | 4 |
| G#5 | t 12-\|4--- | P | P | P | P | 4 |
| A5 | t 12-\|---- | P | P | P | P | 4 |
| Bb5 | t 12-\|456- | P | ✗ | P | ✗ | 2 |
| B5 | t 12-\|45-- | P | P | P | P | 4 |
| C6 | t 1--\|45-- | P | P | P | P | 4 |
| C#6 | t 1-3\|4-6- X | P | P | ✗ | – | 2 |
| D6 | t 1-3\|4-6- | P | P | ✗ | – | 2 |

### Flute (38 notes)

| Note | Arpelio primary | WFG | NOTEbook | Maker chart | Confirmed by |
|---|---|---|---|---|---|
| B3 | T 123\|123 B | P | P | – | 2 |
| C4 | T 123\|123 C | P | P | P | 3 |
| C#4 | T 123\|123 C# | P | P | P | 3 |
| D4 | T 123\|123 | P | P | P | 3 |
| D#4 | T 123\|123 Eb | P | ✗ | P | 2 |
| E4 | T 123\|12- Eb | P | P | P | 3 |
| F4 | T 123\|1-- Eb | P | P | P | 3 |
| F#4 | T 123\|--3 Eb | P | P | P | 3 |
| G4 | T 123\|--- Eb | P | P | P | 3 |
| G#4 | T 123 G#\|--- Eb | P | P | P | 3 |
| A4 | T 12-\|--- Eb | P | P | P | 3 |
| A#4 | T 1--\|1-- Eb | P | P | P | 3 |
| B4 | T 1--\|--- Eb | P | P | P | 3 |
| C5 | 1--\|--- Eb | P | P | P | 3 |
| C#5 | ---\|--- Eb | P | P | P | 3 |
| D5 | T -23\|123 | P | P | P | 3 |
| D#5 | T -23\|123 Eb | P | P | P | 3 |
| E5 | T 123\|12- Eb | P | P | P | 3 |
| F5 | T 123\|1-- Eb | P | ✗ | P | 2 |
| F#5 | T 123\|--3 Eb | P | ✗ | P | 2 |
| G5 | T 123\|--- Eb | P | ✗ | P | 2 |
| G#5 | T 123 G#\|--- Eb | P | P | P | 3 |
| A5 | T 12-\|--- Eb | P | P | P | 3 |
| A#5 | T 1--\|1-- Eb | P | P | P | 3 |
| B5 | T 1--\|--- Eb | P | ✗ | P | 2 |
| C6 | 1--\|--- Eb | P | P | P | 3 |
| C#6 | ---\|--- Eb | P | P | P | 3 |
| D6 | T -23\|--- Eb | P | P | P | 3 |
| D#6 | T 123 G#\|123 Eb | P | P | P | 3 |
| E6 | T 12-\|12- Eb | P | P | P | 3 |
| F6 | T 1-3\|1-- Eb | P | P | P | 3 |
| F#6 | T 1-3\|--3 Eb | P | P | P | 3 |
| G6 | 123\|--- Eb | P | P | P | 3 |
| G#6 | -23 G#\|--- Eb | P | P | P | 3 |
| A6 | T -2-\|1-- Eb | P | P | P | 3 |
| A#6 | T ---\|1 Dtr | P | P | P | 3 |
| B6 | T 1-3\|-- D#tr | P | P | P | 3 |
| C7 | 123 G#\|1-- | P | A | P | 3 |

### Bb Trumpet (31 notes)

| Note | Arpelio primary | Harmonic series | NOTEbook | Maker chart | MuseScore plugin | Trainer | Confirmed by |
|---|---|---|---|---|---|---|---|
| F#3 | 1-2-3 | partial 2 ✓ | P | P | P | – | 4 |
| G3 | 1-3 | partial 2 ✓ | P | P | P | – | 4 |
| G#3 | 2-3 | partial 2 ✓ | P | P | P | – | 4 |
| A3 | 1-2 | partial 2 ✓ | P | P | P | P | 5 |
| Bb3 | 1 | partial 2 ✓ | P | P | P | P | 5 |
| B3 | 2 | partial 2 ✓ | P | P | P | P | 5 |
| C4 | Open | partial 2 ✓ | P | P | P | P | 5 |
| C#4 | 1-2-3 | partial 3 ✓ | P | P | P | P | 5 |
| D4 | 1-3 | partial 3 ✓ | P | P | P | P | 5 |
| D#4 | 2-3 | partial 3 ✓ | P | P | P | P | 5 |
| E4 | 1-2 | partial 3 ✓ | P | P | P | P | 5 |
| F4 | 1 | partial 3 ✓ | P | P | P | P | 5 |
| F#4 | 2 | partial 3 ✓ | P | P | P | P | 5 |
| G4 | Open | partial 3 ✓ | P | P | P | P | 5 |
| G#4 | 2-3 | partial 4 ✓ | P | P | P | P | 5 |
| A4 | 1-2 | partial 4 ✓ | P | P | P | P | 5 |
| Bb4 | 1 | partial 4 ✓ | P | P | P | P | 5 |
| B4 | 2 | partial 4 ✓ | P | P | P | P | 5 |
| C5 | Open | partial 4 ✓ | P | P | P | P | 5 |
| C#5 | 1-2 | partial 5 ✓ | P | P | P | P | 5 |
| D5 | 1 | partial 5 ✓ | P | P | P | P | 5 |
| D#5 | 2 | partial 5 ✓ | P | P | P | P | 5 |
| E5 | Open | partial 5 ✓ | P | P | P | P | 5 |
| F5 | 1 | partial 6 ✓ | P | P | P | P | 5 |
| F#5 | 2 | partial 6 ✓ | P | P | P | P | 5 |
| G5 | Open | partial 6 ✓ | P | P | P | P | 5 |
| G#5 | 2-3 | partial 8 ✓ | P | P | P | P | 5 |
| A5 | 1-2 | partial 8 ✓ | P | P | P | P | 5 |
| Bb5 | 1 | partial 8 ✓ | P | P | P | P | 5 |
| B5 | 2 | partial 8 ✓ | P | P | P | P | 5 |
| C6 | Open | partial 8 ✓ | P | P | P | P | 5 |

### French Horn (43 notes)

| Note | Arpelio primary | Harmonic series | NOTEbook | Confirmed by |
|---|---|---|---|---|
| B2 | 2 | partial 2 ✓ | P | 2 |
| C3 | Open | partial 2 ✓ | P | 2 |
| C#3 | 1-2-3 | partial 3 ✓ | P | 2 |
| D3 | 1-3 | partial 3 ✓ | P | 2 |
| D#3 | 2-3 | partial 3 ✓ | P | 2 |
| E3 | 1-2 | partial 3 ✓ | P | 2 |
| F3 | 1 | partial 3 ✓ | P | 2 |
| F#3 | 2 | partial 3 ✓ | P | 2 |
| G3 | Open | partial 3 ✓ | P | 2 |
| G#3 | 2-3 | partial 4 ✓ | P | 2 |
| A3 | 1-2 | partial 4 ✓ | P | 2 |
| Bb3 | 1 | partial 4 ✓ | P | 2 |
| B3 | 2 | partial 4 ✓ | P | 2 |
| C4 | Open | partial 4 ✓ | P | 2 |
| C#4 | 1-2 | partial 5 ✓ | P | 2 |
| D4 | 1 | partial 5 ✓ | P | 2 |
| D#4 | 2 | partial 5 ✓ | P | 2 |
| E4 | Open | partial 5 ✓ | P | 2 |
| F4 | 1 | partial 6 ✓ | P | 2 |
| F#4 | 2 | partial 6 ✓ | P | 2 |
| G4 | Open | partial 6 ✓ | P | 2 |
| G#4 | 2-3 | partial 8 ✓ | P | 2 |
| A4 | 1-2 | partial 8 ✓ | P | 2 |
| Bb4 | 1 | partial 8 ✓ | P | 2 |
| B4 | 2 | partial 8 ✓ | P | 2 |
| C5 | Open | partial 8 ✓ | P | 2 |
| C#5 | 1-2 | partial 10 ✓ | P | 2 |
| D5 | 1 | partial 10 ✓ | A | 2 |
| D#5 | 2 | partial 10 ✓ | P | 2 |
| E5 | Open | partial 10 ✓ | P | 2 |
| F5 | 1 | partial 12 ✓ | P | 2 |
| F#5 | 2 | partial 12 ✓ | P | 2 |
| G5 | Open | partial 12 ✓ | P | 2 |
| G#5 | 2-3 | partial 16 ✓ | P | 2 |
| A5 | 1-2 | partial 16 ✓ | P | 2 |
| Bb5 | 1 | partial 16 ✓ | P | 2 |
| B5 | 2 | partial 16 ✓ | P | 2 |
| C6 | Open | partial 16 ✓ | P | 2 |
| C#6 | 1-2 | partial 20 ✓ | – | 1 |
| D6 | 1 | partial 20 ✓ | – | 1 |
| D#6 | 2 | partial 20 ✓ | – | 1 |
| E6 | Open | partial 20 ✓ | – | 1 |
| F6 | 1 | partial 24 ✓ | – | 1 |

### Trombone (31 notes)

| Note | Arpelio primary | Harmonic series | NOTEbook | Maker chart | Confirmed by |
|---|---|---|---|---|---|
| E2 | 7th | partial 2 ✓ | P | P | 3 |
| F2 | 6th | partial 2 ✓ | P | P | 3 |
| F#2 | 5th | partial 2 ✓ | P | P | 3 |
| G2 | 4th | partial 2 ✓ | P | P | 3 |
| G#2 | 3rd | partial 2 ✓ | P | P | 3 |
| A2 | 2nd | partial 2 ✓ | P | P | 3 |
| Bb2 | 1st | partial 2 ✓ | P | P | 3 |
| B2 | 7th | partial 3 ✓ | P | P | 3 |
| C3 | 6th | partial 3 ✓ | P | P | 3 |
| C#3 | 5th | partial 3 ✓ | P | P | 3 |
| D3 | 4th | partial 3 ✓ | P | P | 3 |
| D#3 | 3rd | partial 3 ✓ | P | P | 3 |
| E3 | 2nd | partial 3 ✓ | P | P | 3 |
| F3 | 1st | partial 3 ✓ | P | P | 3 |
| F#3 | 5th | partial 4 ✓ | P | P | 3 |
| G3 | 4th | partial 4 ✓ | P | P | 3 |
| G#3 | 3rd | partial 4 ✓ | P | P | 3 |
| A3 | 2nd | partial 4 ✓ | P | P | 3 |
| Bb3 | 1st | partial 4 ✓ | P | P | 3 |
| B3 | 4th | partial 5 ✓ | P | P | 3 |
| C4 | 3rd | partial 5 ✓ | P | P | 3 |
| C#4 | 2nd | partial 5 ✓ | P | P | 3 |
| D4 | 1st | partial 5 ✓ | P | P | 3 |
| D#4 | 3rd | partial 6 ✓ | P | P | 3 |
| E4 | 2nd | partial 6 ✓ | P | P | 3 |
| F4 | 1st | partial 6 ✓ | P | P | 3 |
| F#4 | ♯3rd | partial 7 ✓ (raised) | P | P | 3 |
| G4 | ♯2nd | partial 7 ✓ (raised) | P | P | 3 |
| G#4 | 3rd | partial 8 ✓ | P | P | 3 |
| A4 | 2nd | partial 8 ✓ | P | P | 3 |
| Bb4 | 1st | partial 8 ✓ | P | P | 3 |

### Euphonium (31 notes)

| Note | Arpelio primary | Harmonic series | NOTEbook | Trainer | Confirmed by |
|---|---|---|---|---|---|
| E2 | 1-2-3 | partial 2 ✓ | P | P | 3 |
| F2 | 1-3 | partial 2 ✓ | P | P | 3 |
| F#2 | 2-3 | partial 2 ✓ | P | P | 3 |
| G2 | 1-2 | partial 2 ✓ | P | P | 3 |
| G#2 | 1 | partial 2 ✓ | P | P | 3 |
| A2 | 2 | partial 2 ✓ | P | P | 3 |
| Bb2 | Open | partial 2 ✓ | P | P | 3 |
| B2 | 1-2-3 | partial 3 ✓ | P | P | 3 |
| C3 | 1-3 | partial 3 ✓ | P | P | 3 |
| C#3 | 2-3 | partial 3 ✓ | P | P | 3 |
| D3 | 1-2 | partial 3 ✓ | P | P | 3 |
| D#3 | 1 | partial 3 ✓ | P | P | 3 |
| E3 | 2 | partial 3 ✓ | P | P | 3 |
| F3 | Open | partial 3 ✓ | P | P | 3 |
| F#3 | 2-3 | partial 4 ✓ | P | P | 3 |
| G3 | 1-2 | partial 4 ✓ | P | P | 3 |
| G#3 | 1 | partial 4 ✓ | P | P | 3 |
| A3 | 2 | partial 4 ✓ | P | P | 3 |
| Bb3 | Open | partial 4 ✓ | P | P | 3 |
| B3 | 1-2 | partial 5 ✓ | P | P | 3 |
| C4 | 1 | partial 5 ✓ | P | P | 3 |
| C#4 | 2 | partial 5 ✓ | P | P | 3 |
| D4 | Open | partial 5 ✓ | P | P | 3 |
| D#4 | 1 | partial 6 ✓ | P | P | 3 |
| E4 | 2 | partial 6 ✓ | P | P | 3 |
| F4 | Open | partial 6 ✓ | P | P | 3 |
| F#4 | 2-3 | partial 8 ✓ | P | – | 2 |
| G4 | 1-2 | partial 8 ✓ | P | – | 2 |
| G#4 | 1 | partial 8 ✓ | P | – | 2 |
| A4 | 2 | partial 8 ✓ | P | – | 2 |
| Bb4 | Open | partial 8 ✓ | P | – | 2 |

### BBb Tuba (38 notes)

| Note | Arpelio primary | Harmonic series | NOTEbook | Confirmed by |
|---|---|---|---|---|
| E1 | 1-2-3 | partial 2 ✓ | P | 2 |
| F1 | 1-3 | partial 2 ✓ | P | 2 |
| F#1 | 2-3 | partial 2 ✓ | P | 2 |
| G1 | 1-2 | partial 2 ✓ | P | 2 |
| G#1 | 1 | partial 2 ✓ | P | 2 |
| A1 | 2 | partial 2 ✓ | P | 2 |
| Bb1 | Open | partial 2 ✓ | P | 2 |
| B1 | 1-2-3 | partial 3 ✓ | P | 2 |
| C2 | 1-3 | partial 3 ✓ | P | 2 |
| C#2 | 2-3 | partial 3 ✓ | P | 2 |
| D2 | 1-2 | partial 3 ✓ | P | 2 |
| D#2 | 1 | partial 3 ✓ | P | 2 |
| E2 | 2 | partial 3 ✓ | P | 2 |
| F2 | Open | partial 3 ✓ | P | 2 |
| F#2 | 2-3 | partial 4 ✓ | P | 2 |
| G2 | 1-2 | partial 4 ✓ | P | 2 |
| G#2 | 1 | partial 4 ✓ | P | 2 |
| A2 | 2 | partial 4 ✓ | P | 2 |
| Bb2 | Open | partial 4 ✓ | P | 2 |
| B2 | 1-2 | partial 5 ✓ | P | 2 |
| C3 | 1 | partial 5 ✓ | P | 2 |
| C#3 | 2 | partial 5 ✓ | P | 2 |
| D3 | Open | partial 5 ✓ | P | 2 |
| D#3 | 1 | partial 6 ✓ | P | 2 |
| E3 | 2 | partial 6 ✓ | P | 2 |
| F3 | Open | partial 6 ✓ | P | 2 |
| F#3 | 2-3 | partial 8 ✓ | P | 2 |
| G3 | 1-2 | partial 8 ✓ | P | 2 |
| G#3 | 1 | partial 8 ✓ | P | 2 |
| A3 | 2 | partial 8 ✓ | P | 2 |
| Bb3 | Open | partial 8 ✓ | P | 2 |
| B3 | 2 | partial 9 ✓ | P | 2 |
| C4 | Open | partial 9 ✓ | P | 2 |
| C#4 | 2 | partial 10 ✓ | P | 2 |
| D4 | Open | partial 10 ✓ | P | 2 |
| D#4 | 1 | partial 12 ✓ | P | 2 |
| E4 | 2 | partial 12 ✓ | P | 2 |
| F4 | Open | partial 12 ✓ | P | 2 |

### Clarinet (40 notes)

| Note | Arpelio primary | WFG | NOTEbook | Maker chart | Confirmed by |
|---|---|---|---|---|---|
| E3 | T 123\|123 E | P | A | A | 3 |
| F3 | T 123\|123 F | P | P | P | 3 |
| F#3 | T 123\|123 F# | P | P | A | 3 |
| G3 | T 123\|123 | P | P | P | 3 |
| G#3 | T 123\|123 G# | P | P | P | 3 |
| A3 | T 123\|12- | P | P | P | 3 |
| Bb3 | T 123\|1-- | P | P | P | 3 |
| B3 | T 123\|-2- | P | P | P | 3 |
| C4 | T 123\|--- | P | P | P | 3 |
| C#4 | T 123 C#\|--- | P | P | P | 3 |
| D4 | T 12-\|--- | P | P | P | 3 |
| D#4 | T 12-\|sk4 --- | P | P | P | 3 |
| E4 | T 1--\|--- | P | P | P | 3 |
| F4 | T ---\|--- | P | P | P | 3 |
| F#4 | 1--\|--- | P | P | P | 3 |
| G4 | Open | P | P | P | 3 |
| G#4 | G# ---\|--- | P | P | P | 3 |
| A4 | A ---\|--- | P | P | P | 3 |
| Bb4 | R A ---\|--- | P | P | P | 3 |
| B4 | R T 123\|123 E | P | ✗ | A | 2 |
| C5 | R T 123\|123 F | P | P | P | 3 |
| C#5 | R T 123\|123 F# | P | A | A | 3 |
| D5 | R T 123\|123 | P | P | P | 3 |
| D#5 | R T 123\|123 G# | P | P | P | 3 |
| E5 | R T 123\|12- | P | P | P | 3 |
| F5 | R T 123\|1-- | P | P | P | 3 |
| F#5 | R T 123\|-2- | P | P | P | 3 |
| G5 | R T 123\|--- | P | P | P | 3 |
| G#5 | R T 123 C#\|--- | P | P | P | 3 |
| A5 | R T 12-\|--- | P | P | P | 3 |
| Bb5 | R T 12-\|sk4 --- | P | P | P | 3 |
| B5 | R T 1--\|--- | P | P | P | 3 |
| C6 | R T ---\|--- | P | P | P | 3 |
| C#6 | R T -23\|12- | P | P | P | 3 |
| D6 | R T -23\|1-- G# | P | P | P | 3 |
| D#6 | R T -23\|1 B - G# | P | P | P | 3 |
| E6 | R T -23\|--- G# | P | P | P | 3 |
| F6 | R T -23 C#\|--- G# | P | P | P | 3 |
| F#6 | R T -2-\|--- G# | P | P | P | 3 |
| G6 | R T -2-\|12- G# | P | P | P | 3 |

### Saxophone (33 notes)

| Note | Arpelio primary | WFG | NOTEbook | Maker chart | Confirmed by |
|---|---|---|---|---|---|
| Bb3 | 123 Bb\|123 C | P | P | P | 3 |
| B3 | 123 B\|123 C | P | P | P | 3 |
| C4 | 123\|123 C | P | P | P | 3 |
| C#4 | 123 C#\|123 C | P | P | P | 3 |
| D4 | 123\|123 | P | P | P | 3 |
| D#4 | 123\|123 Eb | P | P | P | 3 |
| E4 | 123\|12- | P | P | P | 3 |
| F4 | 123\|1-- | P | P | P | 3 |
| F#4 | 123\|-2- | P | P | P | 3 |
| G4 | 123\|--- | P | P | P | 3 |
| G#4 | 123 G#\|--- | P | P | P | 3 |
| A4 | 12-\|--- | P | P | P | 3 |
| Bb4 | 12-\|Bb--- | P | P | A | 3 |
| B4 | 1--\|--- | P | P | P | 3 |
| C5 | -2-\|--- | P | P | P | 3 |
| C#5 | Open | P | P | P | 3 |
| D5 | O 123\|123 | P | P | P | 3 |
| D#5 | O 123\|123 Eb | P | P | P | 3 |
| E5 | O 123\|12- | P | P | P | 3 |
| F5 | O 123\|1-- | P | P | P | 3 |
| F#5 | O 123\|-2- | P | P | P | 3 |
| G5 | O 123\|--- | P | P | P | 3 |
| G#5 | O 123 G#\|--- | P | P | P | 3 |
| A5 | O 12-\|--- | P | P | P | 3 |
| Bb5 | O 12-\|Bb--- | P | P | A | 3 |
| B5 | O 1--\|--- | P | P | P | 3 |
| C6 | O -2-\|--- | P | P | P | 3 |
| C#6 | O ---\|--- | P | P | P | 3 |
| D6 | O D---\|--- | P | P | P | 3 |
| D#6 | O Eb D---\|--- | P | P | P | 3 |
| E6 | O Eb D---\|E--- | P | P | P | 3 |
| F6 | O Eb D F--\|E--- | P | P | P | 3 |
| F#6 | O f -2-\|Bb--- | – | P | A | 2 |
