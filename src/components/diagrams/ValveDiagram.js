'use client';

// LOCKED TEMPLATE from brass_locked_template_v1.svg

export default function ValveDiagram({ elements = [], size = 'md', blank = false }) {
  const valves = [false, false, false];
  if (!blank) {
    if (elements.includes('valve-1')) valves[0] = true;
    if (elements.includes('valve-2')) valves[1] = true;
    if (elements.includes('valve-3')) valves[2] = true;
  }
  const w = size === 'lg' ? 340 : size === 'sm' ? 120 : 200;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 340 120" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}`}</style>
      <rect fill="#F3F3F3" x="0" y="0" width="340" height="120"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <circle className={valves[i] ? 'pressed' : 'open'} cx={70 + i * 100} cy="60" r="35"/>
          <text x={70 + i * 100} y="68" textAnchor="middle" fontSize="24" fontWeight="700"
            fontFamily="system-ui" fill={valves[i] ? '#fff' : '#000'}>{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
