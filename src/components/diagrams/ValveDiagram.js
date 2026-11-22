'use client';
import { INK, EDGE, key, body, nameLabel, noteLabel } from './diagramStyle';

// Three piston valves on a valve block: trumpet, horn, euphonium, tuba. Redrawn November 2026; treat the geometry as locked.
// A pressed valve is filled and sits lower, so the picture reads even in a poor photocopy.

const STEPS = ['whole step', 'half step', '1½ steps'];

export default function ValveDiagram({ elements = [], size = 'md', blank = false, labels = false }) {
  const s = new Set(blank ? [] : elements);
  const h = labels ? 124 : 90;
  const w = labels ? '100%' : size === 'lg' ? 260 : size === 'sm' ? 110 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox={`0 0 200 ${h}`} style={{ display: 'block', maxWidth: size === 'md' ? 220 : undefined, margin: '0 auto' }}>
      <rect {...body} x="14" y="52" width="172" height="26" rx="6" />
      {[1, 2, 3].map(i => {
        const on = s.has(`valve-${i}`);
        const x = 50 * i;
        const cy = on ? 40 : 30;
        return (
          <g key={i}>
            <rect x={x - 5} y={cy} width="10" height={58 - cy} style={{ fill: '#fff', stroke: EDGE, strokeWidth: 1.5 }} />
            <circle {...key(on)} cx={x} cy={cy} r="17" />
            <text x={x} y={cy + 5.5} textAnchor="middle" fontSize="15" style={{ ...nameLabel.style, fill: on ? '#fff' : INK }}>{i}</text>
            {labels && (
              <>
                <text {...nameLabel} x={x} y="94" textAnchor="middle" fontSize="8.5">{['1st', '2nd', '3rd'][i - 1]} valve</text>
                <text {...noteLabel} x={x} y="105" textAnchor="middle" fontSize="7.5">{STEPS[i - 1]}</text>
              </>
            )}
          </g>
        );
      })}
      {labels && <text {...noteLabel} x="100" y="119" textAnchor="middle" fontSize="7">how far each valve lowers the pitch</text>}
    </svg>
  );
}
