'use client';

export default function FluteDiagram({ elements = [], size = 'md', blank = false }) {
  const keys = {};
  ['thumb', 'L1', 'L2', 'L3', 'G#', 'R1', 'R2', 'R3', 'Bb', 'B', 'C', 'C#', 'Eb', 'D#-trill'].forEach(k => keys[k] = false);
  if (!blank) elements.forEach(e => { if (e in keys) keys[e] = true; });

  const F = '#1a1d23', E = '#ffffff', S = '#b0b5c0', BG = '#f8f9fb', L = '#7a8294';
  const fc = on => on ? F : E;
  const tc = on => on ? '#fff' : L;
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;
  const y = 50;

  return (
    <svg width={Math.round(340 * scale)} viewBox="0 0 340 100" style={{ display: 'block' }}>
      <line x1="15" y1={y} x2="325" y2={y} stroke={S} strokeWidth={0.5} />

      <ellipse cx={30} cy={y - 20} rx={9} ry={6} fill={fc(keys.thumb)} stroke={S} strokeWidth={1} />
      <text x={30} y={y - 18} textAnchor="middle" fontSize="7" fill={tc(keys.thumb)} fontFamily="system-ui" fontWeight="500">T</text>

      {[{ x: 60, k: 'L1', l: '1' }, { x: 92, k: 'L2', l: '2' }, { x: 124, k: 'L3', l: '3' }].map(({ x, k, l }) => (
        <g key={k}>
          <circle cx={x} cy={y} r={11} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      <rect x={130} y={y + 16} width={18} height={10} rx={4} fill={fc(keys['G#'])} stroke={S} strokeWidth={1} />
      <text x={139} y={y + 23} textAnchor="middle" fontSize="6" fill={tc(keys['G#'])} fontFamily="system-ui" fontWeight="500">G#</text>

      <line x1={148} y1={y - 16} x2={148} y2={y + 16} stroke={S} strokeWidth={0.6} />

      <ellipse cx={162} cy={y - 18} rx={7} ry={5} fill={fc(keys.Bb)} stroke={S} strokeWidth={0.8} />
      <text x={162} y={y - 16} textAnchor="middle" fontSize="5" fill={tc(keys.Bb)} fontFamily="system-ui">Bb</text>

      {[{ x: 172, k: 'R1', l: '1' }, { x: 204, k: 'R2', l: '2' }, { x: 236, k: 'R3', l: '3' }].map(({ x, k, l }) => (
        <g key={k}>
          <circle cx={x} cy={y} r={11} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      <ellipse cx={220} cy={y - 18} rx={7} ry={5} fill={fc(keys['D#-trill'])} stroke={S} strokeWidth={0.8} />
      <text x={220} y={y - 16} textAnchor="middle" fontSize="5" fill={tc(keys['D#-trill'])} fontFamily="system-ui">D#</text>

      <line x1={252} y1={y - 12} x2={252} y2={y + 12} stroke={S} strokeWidth={0.5} strokeDasharray="2 2" />

      <circle cx={268} cy={y} r={8} fill={fc(keys.Eb)} stroke={S} strokeWidth={1} />
      <text x={268} y={y + 2} textAnchor="middle" fontSize="6" fill={tc(keys.Eb)} fontFamily="system-ui" fontWeight="500">Eb</text>

      <ellipse cx={288} cy={y - 8} rx={7} ry={6} fill={fc(keys['C#'])} stroke={S} strokeWidth={0.8} />
      <text x={288} y={y - 6} textAnchor="middle" fontSize="5" fill={tc(keys['C#'])} fontFamily="system-ui">C#</text>
      <ellipse cx={288} cy={y + 8} rx={7} ry={6} fill={fc(keys.C)} stroke={S} strokeWidth={0.8} />
      <text x={288} y={y + 10} textAnchor="middle" fontSize="5" fill={tc(keys.C)} fontFamily="system-ui">C</text>

      <ellipse cx={308} cy={y} rx={7} ry={6} fill={fc(keys.B)} stroke={S} strokeWidth={0.8} />
      <text x={308} y={y + 2} textAnchor="middle" fontSize="6" fill={tc(keys.B)} fontFamily="system-ui" fontWeight="500">B</text>

      <text x={92} y={92} textAnchor="middle" fontSize="7" fill={L} fontFamily="system-ui">Left hand</text>
      <text x={204} y={92} textAnchor="middle" fontSize="7" fill={L} fontFamily="system-ui">Right hand</text>
      <text x={288} y={92} textAnchor="middle" fontSize="7" fill={L} fontFamily="system-ui">Foot</text>
    </svg>
  );
}
