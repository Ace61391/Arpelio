'use client';

export default function RecorderDiagram({ elements = [], size = 'md', blank = false }) {
  const holes = [false, false, false, false, false, false, false];
  let thumb = 'off';
  if (!blank) {
    elements.forEach(e => {
      if (e === 'thumb') thumb = 'full';
      if (e === 'thumb-half') thumb = 'half';
      const map = { L1: 0, L2: 1, L3: 2, R1: 3, R2: 4, R3: 5, R4: 6 };
      if (map[e] !== undefined) holes[map[e]] = true;
    });
  }

  const F = '#1a1d23', E = '#ffffff', S = '#b0b5c0', BG = '#f8f9fb', L = '#7a8294';
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;

  return (
    <svg width={Math.round(70 * scale)} viewBox="0 0 70 260" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="recHalf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="50%" stopColor={F} /><stop offset="50%" stopColor={E} />
        </linearGradient>
      </defs>
      <rect x={19} y={8} width={32} height={240} rx={16} fill={BG} stroke={S} strokeWidth={0.8} />
      <rect x={27} y={16} width={16} height={12} rx={4}
        fill={thumb === 'full' ? F : thumb === 'half' ? 'url(#recHalf)' : E}
        stroke={thumb === 'half' ? '#4f6df5' : S} strokeWidth={1.2} />
      <text x={50} y={25} fontSize="8" fill={L} fontFamily="system-ui" fontWeight="500">T</text>
      <line x1={25} y1={36} x2={45} y2={36} stroke={S} strokeWidth={0.4} strokeDasharray="2 2" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <circle cx={35} cy={52 + i * 26} r={9} fill={holes[i] ? F : E} stroke={S} strokeWidth={1.2} />
          <text x={52} y={55 + i * 26} fontSize="8" fill={L} fontFamily="system-ui">{i + 1}</text>
        </g>
      ))}
      <line x1={21} y1={117} x2={49} y2={117} stroke={S} strokeWidth={0.8} />
      {[3, 4, 5, 6].map(i => (
        <g key={i}>
          <circle cx={35} cy={130 + (i - 3) * 26} r={9} fill={holes[i] ? F : E} stroke={S} strokeWidth={1.2} />
          <text x={52} y={133 + (i - 3) * 26} fontSize="8" fill={L} fontFamily="system-ui">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
