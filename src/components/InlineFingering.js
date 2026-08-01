'use client';

// Ordered top-to-bottom finger positions for the compact inline column.
// Head/mouthpiece end at top, foot end at bottom.
const COLUMN_SLOTS = {
  flute:        ['thumb', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  recorder:     ['thumb', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'R4'],
  clarinet:     ['thumb', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  saxophone:    ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'],
  'bb-trumpet': ['valve-1', 'valve-2', 'valve-3'],
  'french-horn':['valve-1', 'valve-2', 'valve-3'],
  euphonium:    ['valve-1', 'valve-2', 'valve-3'],
  'bb-tuba':    ['valve-1', 'valve-2', 'valve-3'],
};

const INK = '#1a1d23';

export default function InlineFingering({ instrumentId, elements = [], width = 18 }) {
  // Trombone: slide position number (circles can't represent a position)
  if (instrumentId === 'trombone') {
    const posEl = elements.find(e => e.startsWith('pos-'));
    const pos = posEl ? posEl.replace('pos-', '') : '–';
    return (
      <svg viewBox="0 0 22 22" width={width + 4} style={{ display: 'block' }}>
        <circle cx="11" cy="11" r="9.5" fill="none" stroke={INK} strokeWidth="1.2" />
        <text x="11" y="15" textAnchor="middle" fontSize="13" fontWeight="700"
          fontFamily="system-ui" fill={INK}>{pos}</text>
      </svg>
    );
  }

  const slots = COLUMN_SLOTS[instrumentId] || ['L1', 'L2', 'L3', 'R1', 'R2', 'R3'];
  const set = new Set(elements);
  const r = 5, gap = 13, padX = 4, padY = 4;
  const w = padX * 2 + r * 2;
  const h = padY * 2 + (slots.length - 1) * gap + r * 2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={width} style={{ display: 'block' }}>
      {slots.map((slot, i) => {
        const cx = padX + r;
        const cy = padY + r + i * gap;
        const pressed = set.has(slot);
        const half = set.has(`${slot}-half`);
        if (half) {
          return (
            <g key={slot}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="1.2" />
              <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} fill={INK} />
            </g>
          );
        }
        return (
          <circle key={slot} cx={cx} cy={cy} r={r}
            fill={pressed ? INK : 'none'}
            stroke={INK} strokeWidth={pressed ? 0 : 1.2} />
        );
      })}
    </svg>
  );
}
