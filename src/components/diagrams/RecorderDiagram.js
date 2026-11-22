'use client';
import { INK, key, body, guide, divider, nameLabel, noteLabel } from './diagramStyle';

// Recorder, front view (as someone facing the player sees it). Redrawn November 2026; treat the geometry as locked.
//
// Conventions, each checked against published charts (docs/fingering-sources.md):
//   - hole 0, the thumb hole, is on the back, so it is drawn beside the body, a little above hole 1
//   - holes 1-3 left hand, 4-7 right hand, with a divider between the hands
//   - holes 6 and 7 are pairs: the larger hole on the left, the smaller on the right; a half-hole covers the larger one
//   - a pinched thumb is a half-filled circle; a closed bell is a bar under the foot
// holeStyle "single" draws holes 6 and 7 as one hole each, for instruments built that way.

const CX = 60;
const HOLES = { L1: 62, L2: 86, L3: 110, R1: 142, R2: 166 };
const PAIRS = { R3: 188, R4: 220 };

function HalfCircle({ cx, cy, r }) {
  return (
    <>
      <circle {...key(false)} cx={cx} cy={cy} r={r} />
      <path className="half" d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} style={{ fill: INK, stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' }} />
    </>
  );
}

export default function RecorderDiagram({ elements = [], size = 'md', blank = false, holeStyle = 'double', labels = false }) {
  const s = new Set(blank ? [] : elements);
  const single = holeStyle === 'single' || holeStyle === 'simple';
  const vbW = labels ? 215 : 100;
  const scale = size === 'lg' ? 1.3 : size === 'sm' ? 0.46 : 0.7;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={Math.round(vbW * scale)} viewBox={`0 0 ${vbW} 250`} style={{ display: 'block' }}>
      {/* instrument: beak and head, body tapering toward the foot, flared foot joint */}
      <path {...body} d="M52 5 Q60 2 68 5 C71 13 79 20 80 31 L80 40 H40 L40 31 C41 20 49 13 52 5 Z" />
      <rect x="54" y="16" width="12" height="6" rx="1.5" style={{ fill: '#fff', stroke: '#aab1bd', strokeWidth: 1.2 }} />
      <path {...guide} d="M55 25 H65" />
      <path {...body} d="M41 45 H79 L77 198 H43 Z" />
      <rect {...body} x="38" y="40" width="44" height="5" rx="2.5" />
      <path {...body} d="M43 203 C42 214 39 224 36 234 Q60 242 84 234 C81 224 78 214 77 203 Z" />
      <rect {...body} x="40" y="198" width="40" height="5" rx="2.5" />

      {/* left hand / right hand */}
      <path {...divider} d="M46 126 H74" />

      {/* hole 0: thumb */}
      <path {...guide} d="M24 52 H41" strokeDasharray="2 2" />
      {s.has('thumb-half')
        ? <HalfCircle cx={15} cy={52} r={9} />
        : <circle {...key(s.has('thumb'))} cx="15" cy="52" r="9" />}

      {Object.entries(HOLES).map(([k, y]) => <circle key={k} {...key(s.has(k))} cx={CX} cy={y} r="10" />)}

      {/* holes 6 and 7 */}
      {Object.entries(PAIRS).map(([k, y]) => {
        const full = s.has(k);
        const half = s.has(`${k}-half`);
        if (single) {
          return half
            ? <HalfCircle key={k} cx={CX} cy={y} r={8} />
            : <circle key={k} {...key(full)} cx={CX} cy={y} r="8" />;
        }
        return (
          <g key={k}>
            <circle {...key(full || half)} cx="53.5" cy={y + 1.5} r="5.6" />
            <circle {...key(full)} cx="67" cy={y - 1.5} r="4.6" />
          </g>
        );
      })}

      {/* bell closed against the knee */}
      {s.has('bell') && <rect className="pressed" x="40" y="243" width="40" height="5.5" rx="2.75" style={{ fill: INK }} />}

      {labels && (
        <>
          <text {...nameLabel} x="15" y="73" textAnchor="middle" fontSize="10">0</text>
          <text {...noteLabel} x="15" y="82" textAnchor="middle" fontSize="7">thumb</text>
          {[...Object.values(HOLES), ...Object.values(PAIRS)].map((y, i) => (
            <text key={i} {...nameLabel} x="92" y={y + 3.5} fontSize="10">{i + 1}</text>
          ))}
          <path {...guide} d="M108 54 V118 M108 134 V228" />
          <text {...noteLabel} x="113" y="89" fontSize="8">left hand</text>
          <text {...noteLabel} x="113" y="184" fontSize="8">right hand</text>
          <rect x="40" y="243" width="40" height="5.5" rx="2.75" style={{ fill: 'none', stroke: '#aab1bd', strokeWidth: 1.2, strokeDasharray: '2 2' }} />
          <text {...noteLabel} x="92" y="248.5" fontSize="7">bell (closed for high C♯)</text>
        </>
      )}
    </svg>
  );
}
