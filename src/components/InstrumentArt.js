// Line-art illustrations of each instrument, used on the instrument cards.
// Pure SVG, drawn with currentColor so a card can tint them. Decorative: the card's text names the instrument.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Dot = ({ cx, cy, r = 2.2 }) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;

const ART = {
  recorder: (
    <>
      {/* beak, head, body, flared foot */}
      <path {...S} d="M8 40 L20 31 H34 V45 H20 Z" />
      <path {...S} d="M34 31 H92 L112 27 V49 L92 45 H34" />
      <path {...S} d="M38 31 V45 M92 31 V45" />
      <path {...S} d="M22 35 h6" />
      {[48, 56, 64, 74, 82].map(x => <Dot key={x} cx={x} cy={38} />)}
      <Dot cx={98} cy={38} r={1.8} /><Dot cx={104} cy={38} r={1.6} />
    </>
  ),
  flute: (
    <>
      <rect {...S} x="6" y="33" width="108" height="9" rx="4.5" />
      <path {...S} d="M30 33 V42 M96 33 V42" />
      <ellipse {...S} cx="18" cy="31.5" rx="6" ry="2.6" />
      {[40, 49, 58, 70, 79, 88].map(x => <circle key={x} {...S} cx={x} cy={29.5} r={3.4} />)}
      <path {...S} d="M100 30 h8 M101 26.5 h6" />
      <path {...S} d="M38 46 h22 M68 46 h22" />
    </>
  ),
  'bb-trumpet': (
    <>
      {/* mouthpiece + leadpipe, bell */}
      <path {...S} d="M5 30 h6 M11 27 v6 M11 30 H74" />
      <path {...S} d="M74 30 C88 30 96 26 108 16 V56 C96 46 88 42 74 42 H34 C24 42 24 54 34 54 H60" />
      <path {...S} d="M60 54 C70 54 70 42 60 42" />
      {/* valves */}
      {[42, 52, 62].map(x => (
        <g key={x}>
          <rect {...S} x={x - 3.5} y={24} width={7} height={26} rx={2} />
          <path {...S} d={`M${x} 24 V17 M${x - 3.5} 17 h7`} />
        </g>
      ))}
    </>
  ),
  'french-horn': (
    <>
      {/* coiled body */}
      <circle {...S} cx="50" cy="36" r="23" />
      <circle {...S} cx="50" cy="36" r="14" />
      {/* bell opening to the lower right */}
      <path {...S} d="M66 52 C80 50 92 40 100 26 L114 56 C100 62 82 64 70 58" />
      {/* leadpipe and mouthpiece */}
      <path {...S} d="M34 20 C28 12 20 8 12 8 M12 5 v6" />
      {/* valve levers */}
      <path {...S} d="M44 30 v12 M50 30 v12 M56 30 v12" />
    </>
  ),
  trombone: (
    <>
      {/* hand slide: long U */}
      <path {...S} d="M4 26 H86 M4 26 v-4 M4 26 v4" />
      <path {...S} d="M86 26 C92 26 92 36 86 36 H22" />
      <path {...S} d="M30 26 V36" />
      {/* bell section looping back over the shoulder */}
      <path {...S} d="M22 36 C10 36 10 52 22 52 H70 C84 52 94 56 108 64 V40 C94 48 84 52 70 52" />
      <path {...S} d="M40 36 V52" />
    </>
  ),
  euphonium: (
    <>
      {/* upright body with bell at the top */}
      <path {...S} d="M70 6 H98 L90 24 V50 C90 62 80 68 68 68 H46 C32 68 26 60 26 50 V34" />
      <path {...S} d="M78 24 V48 C78 54 74 58 68 58 H48 C42 58 38 54 38 50 V34" />
      <path {...S} d="M70 6 L78 24" />
      <path {...S} d="M26 34 C26 26 38 26 38 34" />
      {/* valves */}
      {[48, 57, 66].map(x => (
        <g key={x}>
          <rect {...S} x={x - 3} y={28} width={6} height={20} rx={2} />
          <path {...S} d={`M${x} 28 V22 M${x - 3} 22 h6`} />
        </g>
      ))}
      {/* leadpipe */}
      <path {...S} d="M26 40 H12 M12 37 v6" />
    </>
  ),
  'bb-tuba': (
    <>
      {/* wide bell at the top, big body */}
      <path {...S} d="M62 4 H106 L94 22 V48 C94 62 82 69 68 69 H40 C24 69 16 60 16 48 V34" />
      <path {...S} d="M80 22 V46 C80 53 75 57 68 57 H42 C35 57 30 53 30 48 V34" />
      <path {...S} d="M62 4 L80 22" />
      <path {...S} d="M16 34 C16 25 30 25 30 34" />
      {[42, 52, 62].map(x => (
        <g key={x}>
          <rect {...S} x={x - 3.2} y={27} width={6.4} height={21} rx={2} />
          <path {...S} d={`M${x} 27 V21 M${x - 3.2} 21 h6.4`} />
        </g>
      ))}
      <path {...S} d="M16 40 H5 M5 37 v6" />
    </>
  ),
};

export default function InstrumentArt({ instrumentId, className = '' }) {
  const art = ART[instrumentId];
  if (!art) return null;
  return (
    <svg viewBox="0 0 120 72" className={className} aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}

export const hasInstrumentArt = (id) => Boolean(ART[id]);
