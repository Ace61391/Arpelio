'use client';

export default function SaxDiagram({ elements = [], size = 'md', blank = false }) {
  const keys = {};
  ['octave', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'G#', 'side-Bb', 'side-E', 'side-F#',
    'palm-D', 'palm-Eb', 'palm-F', 'low-B', 'low-Bb', 'low-C', 'low-C#', 'low-Eb'].forEach(k => keys[k] = false);
  if (!blank) elements.forEach(e => { if (e in keys) keys[e] = true; });

  const F = '#1a1d23', E = '#ffffff', S = '#b0b5c0', BG = '#f8f9fb', L = '#7a8294';
  const fc = on => on ? F : E;
  const tc = on => on ? '#fff' : L;
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;
  const cx = 48;

  return (
    <svg width={Math.round(140 * scale)} viewBox="0 0 140 300" style={{ display: 'block' }}>
      <rect x={cx - 16} y={18} width={32} height={250} rx={16} fill={BG} stroke={S} strokeWidth={0.8} />

      <ellipse cx={cx} cy={14} rx={10} ry={6} fill={fc(keys.octave)} stroke={S} strokeWidth={1} />
      <text x={cx} y={17} textAnchor="middle" fontSize="6" fill={tc(keys.octave)} fontFamily="system-ui" fontWeight="500">Oct</text>

      {[{ y: 34, k: 'palm-F', l: 'F' }, { y: 48, k: 'palm-Eb', l: 'Eb' }, { y: 62, k: 'palm-D', l: 'D' }].map(({ y, k, l }) => (
        <g key={k}>
          <rect x={6} y={y} width={20} height={10} rx={4} fill={fc(keys[k])} stroke={S} strokeWidth={0.8} />
          <text x={16} y={y + 7} textAnchor="middle" fontSize="5.5" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="500">{l}</text>
        </g>
      ))}

      {[{ y: 48, k: 'L1', l: '1' }, { y: 80, k: 'L2', l: '2' }, { y: 112, k: 'L3', l: '3' }].map(({ y, k, l }) => (
        <g key={k}>
          <circle cx={cx} cy={y} r={11} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={cx} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      {/* G# side key with leader line */}
      <line x1={cx + 16} y1={110} x2={100} y2={110} stroke={S} strokeWidth={0.6} strokeDasharray="2,2" />
      <rect x={102} y={104} width={24} height={11} rx={4} fill={fc(keys['G#'])} stroke={S} strokeWidth={0.8} />
      <text x={114} y={112} textAnchor="middle" fontSize="6" fill={tc(keys['G#'])} fontFamily="system-ui" fontWeight="500">G#</text>

      <line x1={cx - 20} y1={132} x2={cx + 20} y2={132} stroke={S} strokeWidth={0.8} />

      {/* Side keys with leader lines */}
      {[{ y: 146, k: 'side-E', l: 'E' }, { y: 160, k: 'side-Bb', l: 'Bb' }, { y: 174, k: 'side-F#', l: 'F#' }].map(({ y, k, l }) => (
        <g key={k}>
          <line x1={cx + 16} y1={y + 5} x2={100} y2={y + 5} stroke={S} strokeWidth={0.6} strokeDasharray="2,2" />
          <rect x={102} y={y} width={24} height={10} rx={4} fill={fc(keys[k])} stroke={S} strokeWidth={0.8} />
          <text x={114} y={y + 7} textAnchor="middle" fontSize="5.5" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="500">{l}</text>
        </g>
      ))}

      {[{ y: 152, k: 'R1', l: '1' }, { y: 184, k: 'R2', l: '2' }, { y: 216, k: 'R3', l: '3' }].map(({ y, k, l }) => (
        <g key={k}>
          <circle cx={cx} cy={y} r={11} fill={fc(keys[k])} stroke={S} strokeWidth={1.2} />
          <text x={cx} y={y + 3} textAnchor="middle" fontSize="9" fill={tc(keys[k])} fontFamily="system-ui" fontWeight="600">{l}</text>
        </g>
      ))}

      <rect x={4} y={238} width={18} height={10} rx={3} fill={fc(keys['low-Eb'])} stroke={S} strokeWidth={0.8} />
      <text x={13} y={245} textAnchor="middle" fontSize="5" fill={tc(keys['low-Eb'])} fontFamily="system-ui">Eb</text>
      <rect x={26} y={238} width={16} height={10} rx={3} fill={fc(keys['low-C'])} stroke={S} strokeWidth={0.8} />
      <text x={34} y={245} textAnchor="middle" fontSize="5" fill={tc(keys['low-C'])} fontFamily="system-ui">C</text>
      <rect x={4} y={252} width={18} height={10} rx={3} fill={fc(keys['low-Bb'])} stroke={S} strokeWidth={0.8} />
      <text x={13} y={259} textAnchor="middle" fontSize="5" fill={tc(keys['low-Bb'])} fontFamily="system-ui">Bb</text>
      <rect x={26} y={252} width={16} height={10} rx={3} fill={fc(keys['low-B'])} stroke={S} strokeWidth={0.8} />
      <text x={34} y={259} textAnchor="middle" fontSize="5" fill={tc(keys['low-B'])} fontFamily="system-ui">B</text>
      <rect x={48} y={245} width={18} height={10} rx={3} fill={fc(keys['low-C#'])} stroke={S} strokeWidth={0.8} />
      <text x={57} y={252} textAnchor="middle" fontSize="5" fill={tc(keys['low-C#'])} fontFamily="system-ui">C#</text>
    </svg>
  );
}
