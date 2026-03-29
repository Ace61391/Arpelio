'use client';

export default function ClarinetDiagram({ elements = [], size = 'md', blank = false }) {
  const keys = {};
  ['register', 'thumb', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'G#', 'A-key', 'L4-Cs', 'R4-C', 'R4-Cs', 'R4-E'].forEach(k => keys[k] = false);
  if (!blank) elements.forEach(e => { if (e in keys) keys[e] = true; });

  const F = '#1a1d23', E = '#ffffff', S = '#b0b5c0', BG = '#f8f9fb', L = '#7a8294';
  const fc = on => on ? F : E;
  const tc = on => on ? '#fff' : L;
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;
  const cx = 42;

  return (
    <svg width={Math.round(130 * scale)} viewBox="0 0 130 280" style={{ display: 'block' }}>
      <rect x={cx - 14} y={8} width={28} height={255} rx={14} fill={BG} stroke={S} strokeWidth={0.8} />

      <rect x={8} y={12} width={18} height={11} rx={4} fill={fc(keys.register)} stroke={S} strokeWidth={1} />
      <text x={17} y={20} textAnchor="middle" fontSize="6" fill={tc(keys.register)} fontFamily="system-ui" fontWeight="500">Reg</text>

      <rect x={10} y={30} width={14} height={14} rx={4} fill={fc(keys.thumb)} stroke={S} strokeWidth={1} />
      <text x={17} y={40} textAnchor="middle" fontSize="7" fill={tc(keys.thumb)} fontFamily="system-ui" fontWeight="600">T</text>

      {[{ y: 58, k: 'L1', l: '1' }, { y: 88, k: 'L2', l: '2' }, { y: 118, k: 'L3', l: '3' }].map(({ y, k, l }) => (
        <g key={k}>
          <circle cx={cx} cy={y} r={10} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={cx} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      {/* G# side key with leader line */}
      <line x1={cx + 14} y1={77} x2={90} y2={77} stroke={S} strokeWidth={0.6} strokeDasharray="2,2" />
      <rect x={92} y={72} width={22} height={10} rx={4} fill={fc(keys['G#'])} stroke={S} strokeWidth={0.8} />
      <text x={103} y={79} textAnchor="middle" fontSize="6" fill={tc(keys['G#'])} fontFamily="system-ui">G#</text>

      {/* A side key with leader line */}
      <line x1={cx + 14} y1={91} x2={90} y2={91} stroke={S} strokeWidth={0.6} strokeDasharray="2,2" />
      <rect x={92} y={86} width={22} height={10} rx={4} fill={fc(keys['A-key'])} stroke={S} strokeWidth={0.8} />
      <text x={103} y={93} textAnchor="middle" fontSize="6" fill={tc(keys['A-key'])} fontFamily="system-ui">A</text>

      <rect x={6} y={132} width={18} height={10} rx={4} fill={fc(keys['L4-Cs'])} stroke={S} strokeWidth={0.8} />
      <text x={15} y={139} textAnchor="middle" fontSize="5" fill={tc(keys['L4-Cs'])} fontFamily="system-ui">C#</text>

      <line x1={cx - 18} y1={150} x2={cx + 18} y2={150} stroke={S} strokeWidth={0.8} />

      {[{ y: 168, k: 'R1', l: '1' }, { y: 198, k: 'R2', l: '2' }, { y: 228, k: 'R3', l: '3' }].map(({ y, k, l }) => (
        <g key={k}>
          <circle cx={cx} cy={y} r={10} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={cx} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      <rect x={6} y={248} width={18} height={10} rx={4} fill={fc(keys['R4-E'])} stroke={S} strokeWidth={0.8} />
      <text x={15} y={255} textAnchor="middle" fontSize="6" fill={tc(keys['R4-E'])} fontFamily="system-ui">E</text>
      <rect x={28} y={248} width={18} height={10} rx={4} fill={fc(keys['R4-C'])} stroke={S} strokeWidth={0.8} />
      <text x={37} y={255} textAnchor="middle" fontSize="6" fill={tc(keys['R4-C'])} fontFamily="system-ui">C</text>
      <rect x={50} y={248} width={18} height={10} rx={4} fill={fc(keys['R4-Cs'])} stroke={S} strokeWidth={0.8} />
      <text x={59} y={255} textAnchor="middle" fontSize="5" fill={tc(keys['R4-Cs'])} fontFamily="system-ui">C#</text>
    </svg>
  );
}
