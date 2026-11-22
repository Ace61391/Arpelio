'use client';
import { INK, EDGE, SOFT, key, nameLabel, noteLabel } from './diagramStyle';

// Trombone slide, mouthpiece to the left. Redrawn November 2026; treat the geometry as locked.
// The slide is drawn out to the position; its full travel shows faintly behind, and the seven positions are numbered markers.
// A blank diagram shows the markers only, for a student to fill in.

const X0 = 70;
const STEP = 40;
const posX = p => X0 + (p - 1) * STEP;

export default function SlideDiagram({ elements = [], size = 'md', blank = false, labels = false }) {
  let pos = null;
  if (!blank) {
    elements.forEach(e => {
      const m = /^pos-(\d)$/.exec(e);
      if (m) pos = parseInt(m[1], 10);
    });
  }
  const h = labels ? 102 : 88;
  const w = labels ? '100%' : size === 'lg' ? 396 : size === 'sm' ? 140 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox={`0 0 330 ${h}`} style={{ display: 'block', maxWidth: size === 'md' ? 330 : undefined, margin: '0 auto' }}>
      {/* mouthpiece and the fixed inner tubes */}
      <path d="M6 30 h22 M6 27 v6" style={{ stroke: EDGE, strokeWidth: 2, strokeLinecap: 'round', fill: 'none' }} />
      <path d={`M28 30 H${X0 - 14} M28 44 H${X0 - 14}`} style={{ stroke: EDGE, strokeWidth: 5, strokeLinecap: 'round', fill: 'none' }} />
      {/* full travel of the slide */}
      <path d={`M${X0 - 14} 30 H${posX(7)} a7 7 0 0 1 0 14 H${X0 - 14}`} style={{ stroke: SOFT, strokeWidth: 7, strokeLinecap: 'round', fill: 'none' }} />
      {/* the slide, out to the position */}
      {pos && (
        <path className="pressed" d={`M${X0 - 14} 30 H${posX(pos)} a7 7 0 0 1 0 14 H${X0 - 14}`}
          style={{ stroke: INK, strokeWidth: 5, strokeLinecap: 'round', fill: 'none' }} />
      )}
      {[1, 2, 3, 4, 5, 6, 7].map(p => {
        const on = pos === p;
        return (
          <g key={p}>
            <path d={`M${posX(p)} 54 V60`} style={{ stroke: EDGE, strokeWidth: 1.5 }} />
            <circle {...key(on)} cx={posX(p)} cy="72" r="10" />
            <text x={posX(p)} y="76" textAnchor="middle" fontSize="11" style={{ ...nameLabel.style, fill: on ? '#fff' : INK }}>{p}</text>
          </g>
        );
      })}
      {labels && (
        <>
          <text {...noteLabel} x={posX(1)} y="96" textAnchor="middle" fontSize="8">slide in</text>
          <text {...noteLabel} x={posX(7)} y="96" textAnchor="middle" fontSize="8">fully out</text>
        </>
      )}
    </svg>
  );
}
