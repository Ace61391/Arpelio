'use client';

const TREBLE_STEPS = {
  'C4':-1,'C#4':-1,'Db4':-1,'D4':0,'D#4':0,'Eb4':0,'E4':1,'F4':2,'F#4':2,'Gb4':2,
  'G4':3,'G#4':3,'Ab4':3,'A4':4,'A#4':4,'Bb4':4,'B4':5,
  'C5':6,'C#5':6,'Db5':6,'D5':7,'D#5':7,'Eb5':7,'E5':8,'F5':9,'F#5':9,'Gb5':9,
  'G5':10,'G#5':10,'Ab5':10,'A5':11,'A#5':11,'Bb5':11,'B5':12,
  'C6':13,'C#6':13,'Db6':13,'D6':14,'D#6':14,'Eb6':14,'E6':15,'F6':16,'F#6':16,'Gb6':16,
  'G6':17,'G#6':17,'Ab6':17,'A6':18,'A#6':18,'Bb6':18,'B6':19,'C7':20,
};

const BASS_STEPS = {
  'D1':-3,'E1':-2,'F1':-1,'F#1':-1,'G1':0,'G#1':0,'Ab1':0,'A1':1,'A#1':1,'Bb1':1,'B1':2,
  'C2':3,'C#2':3,'Db2':3,'D2':4,'D#2':4,'Eb2':4,'E2':5,'F2':6,'F#2':6,'Gb2':6,
  'G2':7,'G#2':7,'Ab2':7,'A2':8,'A#2':8,'Bb2':8,'B2':9,
  'C3':10,'C#3':10,'Db3':10,'D3':11,'D#3':11,'Eb3':11,'E3':12,'F3':13,'F#3':13,'Gb3':13,
  'G3':14,'G#3':14,'Ab3':14,'A3':15,'A#3':15,'Bb3':15,'B3':16,
  'C4':17,'C#4':17,'Db4':17,'D4':18,'D#4':18,'Eb4':18,'E4':19,'F4':20,'F#4':20,'Gb4':20,
};

export default function StaffNote({ note, clef = 'treble', width = 56, className = '' }) {
  const stepMap = clef === 'bass' ? BASS_STEPS : TREBLE_STEPS;
  const step = stepMap[note] ?? 0;
  const hasSharp = note.includes('#');
  const hasFlat = note.includes('b') && note[0] !== 'B' ? true : (note.startsWith('Bb') || note.startsWith('Db') || note.startsWith('Eb') || note.startsWith('Ab') || note.startsWith('Gb'));

  const sp = 5;
  const staffLineSteps = clef === 'bass' ? [4, 6, 8, 10, 12] : [1, 3, 5, 7, 9];
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
  // Middle C ledger
  if (clef === 'treble' && step === -1) ledgers.push(baseY - (-1) * sp);
  if (clef === 'bass' && step === 17) ledgers.push(baseY - 17 * sp);

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
