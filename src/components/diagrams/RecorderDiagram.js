'use client';

// LOCKED TEMPLATE from recorder_locked_template_v1.svg

const HOLE_MAP = { L1: 0, L2: 1, L3: 2, R1: 3, R2: 4, R3: 5, R4: 6 };
const HALF_MAP = { 'R3-half': 5, 'R4-half': 6 };

export default function RecorderDiagram({ elements = [], size = 'md', blank = false }) {
  const holes = ['open','open','open','open','open','open','open'];
  let thumb = 'open';
  if (!blank) {
    elements.forEach(e => {
      if (e === 'thumb') thumb = 'pressed';
      if (e === 'thumb-half') thumb = 'half';
      if (HOLE_MAP[e] !== undefined) holes[HOLE_MAP[e]] = 'pressed';
      if (HALF_MAP[e] !== undefined) holes[HALF_MAP[e]] = 'half';
    });
  }
  const w = size === 'lg' ? 180 : size === 'sm' ? 55 : 100;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 180 480" style={{display:'block'}}>
      <defs>
        <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.half{fill:url(#hg);stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="50%" stopColor="#000"/><stop offset="50%" stopColor="#F3F3F3"/>
        </linearGradient>
      </defs>
      <rect fill="#F3F3F3" x="0" y="0" width="180" height="480"/>
      <circle className={thumb} cx="60" cy="50" r="20"/>
      <line className="divider" x1="55" y1="85" x2="125" y2="85"/>
      <circle className={holes[0]} cx="90" cy="120" r="22"/>
      <circle className={holes[1]} cx="90" cy="175" r="22"/>
      <circle className={holes[2]} cx="90" cy="230" r="22"/>
      <line className="divider" x1="55" y1="265" x2="125" y2="265"/>
      <circle className={holes[3]} cx="90" cy="300" r="20"/>
      <circle className={holes[4]} cx="90" cy="350" r="20"/>
      <circle className={holes[5]} cx="90" cy="395" r="18"/>
      <circle className={holes[6]} cx="90" cy="435" r="16"/>
    </svg>
  );
}
