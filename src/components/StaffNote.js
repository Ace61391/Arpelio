'use client';
import { staffStep, parseNote, STAFF_LINES } from './staffPosition.mjs';

// Note positions are computed in staffPosition.mjs (no lookup tables).

export default function StaffNote({ note, clef = 'treble', width = 56, className = '' }) {
  const step = staffStep(note, clef);
  // A name we cannot read gets no staff at all: a note in the wrong place is worse than none.
  if (step === null) return null;
  const accidental = parseNote(note).accidental;
  const hasSharp = accidental === '#';
  const hasFlat = accidental === 'b';

  const sp = 5;
  const staffLineSteps = clef === 'bass' ? STAFF_LINES.bass : STAFF_LINES.treble;
  const midLine = clef === 'bass' ? 8 : 5;
  const baseY = 60;
  const noteY = baseY - step * sp;
  const nr = 5;
  const stemLen = 28;

  const noteX = (hasSharp || hasFlat) ? 40 : 34;
  const stemUp = step < midLine;
  const clefY = baseY - staffLineSteps[1] * sp;

  // Ledger lines
  const ledgers = [];
  const lowestStaffStep = staffLineSteps[0];
  const highestStaffStep = staffLineSteps[4];
  if (step <= lowestStaffStep - 2) {
    for (let s = lowestStaffStep - 2; s >= step; s -= 2) {
      ledgers.push(baseY - s * sp);
    }
  }
  if (step >= highestStaffStep + 2) {
    for (let s = highestStaffStep + 2; s <= step; s += 2) {
      ledgers.push(baseY - s * sp);
    }
  }
  // Middle C needs no special case: it is one ledger line below the treble staff and one above the bass
  // staff, and the two loops above draw exactly that.

  const allY = [
    ...staffLineSteps.map(s => baseY - s * sp),
    noteY - 8,
    noteY + 8,
    stemUp ? noteY - stemLen : noteY + stemLen,
    ...ledgers.map(y => y - 2),
    ...ledgers.map(y => y + 2),
  ];
  const minY = Math.min(...allY) - 10;
  const maxY = Math.max(...allY) + 10;
  const h = maxY - minY;

  return (
    <svg width={width} height={Math.max(50, Math.min(100, h))} viewBox={`0 ${minY} ${width} ${h}`} className={className}>
      {/* Staff lines */}
      {staffLineSteps.map(s => (
        <line key={s} x1={2} y1={baseY - s * sp} x2={width - 2} y2={baseY - s * sp} stroke="#b0b5c0" strokeWidth={0.6} />
      ))}
      {/* Clef */}
      <text x={3} y={clefY + (clef === 'bass' ? 8 : 13)} fontSize={clef === 'bass' ? 22 : 28} fill="#7a8294" fontFamily="serif">
        {clef === 'bass' ? '𝄢' : '𝄞'}
      </text>
      {/* Ledger lines */}
      {ledgers.map((y, i) => (
        <line key={`l${i}`} x1={noteX - 10} y1={y} x2={noteX + 10} y2={y} stroke="#b0b5c0" strokeWidth={0.6} />
      ))}
      {/* Note head */}
      <ellipse cx={noteX} cy={noteY} rx={nr} ry={nr * 0.7} fill="#1a1d23" transform={`rotate(-12,${noteX},${noteY})`} />
      {/* Stem */}
      {stemUp ? (
        <line x1={noteX + nr} y1={noteY} x2={noteX + nr} y2={noteY - stemLen} stroke="#1a1d23" strokeWidth={1} />
      ) : (
        <line x1={noteX - nr} y1={noteY} x2={noteX - nr} y2={noteY + stemLen} stroke="#1a1d23" strokeWidth={1} />
      )}
      {/* Accidentals */}
      {hasSharp && <text x={noteX - 12} y={noteY + 4} fontSize={11} fill="#1a1d23" fontWeight="500">♯</text>}
      {hasFlat && <text x={noteX - 12} y={noteY + 4} fontSize={11} fill="#1a1d23" fontWeight="500">♭</text>}
    </svg>
  );
}
