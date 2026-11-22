// Where a written note sits on the staff.
//
// Positions are counted in staff steps: one step is one line-to-space move, so staff lines are two steps
// apart. The position comes from the note's letter and octave, never from a lookup table, so:
//   - every note has a position, however high or low it is
//   - a flat sits on its own letter (B-flat on B's line or space, with a flat sign), not on the letter below
//   - the bottom line of each clef is the note it should be: E4 in treble, G2 in bass

const LETTER = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

// Steps at which the five staff lines are drawn, bottom line first.
export const STAFF_LINES = { treble: [1, 3, 5, 7, 9], bass: [4, 6, 8, 10, 12] };

// The note on the bottom line of each clef.
const BOTTOM_LINE = { treble: ['E', 4], bass: ['G', 2] };

const diatonic = (letter, octave) => octave * 7 + LETTER[letter];

export function parseNote(note) {
  const m = /^([A-G])([#b]?)(-?\d+)$/.exec(note || '');
  return m ? { letter: m[1], accidental: m[2], octave: Number(m[3]) } : null;
}

// Staff step of a written note such as "Bb3" or "F#5". Returns null for a name it cannot read.
export function staffStep(note, clef = 'treble') {
  const n = parseNote(note);
  if (!n) return null;
  const c = clef === 'bass' ? 'bass' : 'treble';
  const [letter, octave] = BOTTOM_LINE[c];
  return diatonic(n.letter, n.octave) - diatonic(letter, octave) + STAFF_LINES[c][0];
}
