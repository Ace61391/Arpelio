'use client';

// LOCKED TEMPLATE from trombone_locked_template_v1.svg

const POS_X = { 1: 50, 2: 112, 3: 174, 4: 236, 5: 298, 6: 360, 7: 422 };

export default function SlideDiagram({ elements = [], size = 'md', blank = false }) {
  let pos = 1;
  if (!blank) {
    elements.forEach(e => {
      const m = e.match?.(/pos-(\d)/);
      if (m) pos = parseInt(m[1]);
    });
  }
  const w = size === 'lg' ? 460 : size === 'sm' ? 140 : 260;
  const fillW = blank ? 0 : (POS_X[pos] || 50);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 460 100" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}`}</style>
      <rect fill="#F3F3F3" x="0" y="0" width="460" height="100"/>
      <rect className="open" x="20" y="20" width="420" height="40" rx="20"/>
      {!blank && <rect className="pressed" x="20" y="20" width={fillW} height="40" rx="20"/>}
      {[1,2,3,4,5,6,7].map(p => (
        <g key={p}>
          <line x1={POS_X[p]} y1="65" x2={POS_X[p]} y2="75" stroke="#000" strokeWidth={p === pos && !blank ? 2 : 1}/>
          <text x={POS_X[p]} y="90" textAnchor="middle" fontSize="14" fontFamily="system-ui"
            fontWeight={p === pos && !blank ? '700' : '400'} fill="#000">{p}</text>
        </g>
      ))}
    </svg>
  );
}
