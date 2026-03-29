'use client';

export default function ValveDiagram({ elements = [], size = 'md', blank = false }) {
  const valves = [false, false, false];
  if (!blank) {
    elements.forEach(e => {
      if (e === 'valve-1') valves[0] = true;
      if (e === 'valve-2') valves[1] = true;
      if (e === 'valve-3') valves[2] = true;
    });
  }

  const F = '#1a1d23', E = '#ffffff', S = '#b0b5c0';
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;

  return (
    <svg width={Math.round(150 * scale)} viewBox="0 0 150 50" style={{ display: 'block' }}>
      {valves.map((on, i) => (
        <g key={i}>
          <circle cx={31 + i * 44} cy={25} r={16} fill={on ? F : E} stroke={on ? F : S} strokeWidth={1.5} />
          <text x={31 + i * 44} y={29} textAnchor="middle" fontSize="14" fill={on ? '#fff' : '#b0b5c0'} fontFamily="system-ui" fontWeight="700">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
