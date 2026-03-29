'use client';

export default function SlideDiagram({ elements = [], size = 'md', blank = false }) {
  let pos = blank ? 0 : 1;
  if (!blank) {
    elements.forEach(e => {
      const m = e.match?.(/pos-(\d)/);
      if (m) pos = parseInt(m[1]);
    });
  }

  const F = '#1a1d23', S = '#b0b5c0', BG = '#f8f9fb', L = '#7a8294', A = '#4f6df5';
  const scale = size === 'lg' ? 1.2 : size === 'sm' ? 0.7 : 1;
  const w = 180;
  const pct = pos > 0 ? (pos - 1) / 6 : 0;

  return (
    <svg width={Math.round(w * scale)} viewBox={`0 0 ${w} 55`} style={{ display: 'block' }}>
      <rect x={8} y={8} width={w - 16} height={32} rx={16} fill={BG} stroke={S} strokeWidth={1} />
      {pos > 0 && (
        <rect x={8} y={8} width={Math.max(32, (w - 16) * (0.1 + pct * 0.9))} height={32} rx={16} fill={F} />
      )}
      {pos > 0 && (
        <text x={w / 2} y={28} textAnchor="middle" fontSize="15" fill="#fff" fontFamily="system-ui" fontWeight="700" style={{ mixBlendMode: 'difference' }}>{pos}</text>
      )}
      {blank && (
        <text x={w / 2} y={28} textAnchor="middle" fontSize="12" fill={L} fontFamily="system-ui">?</text>
      )}
      {[1, 2, 3, 4, 5, 6, 7].map(p => {
        const x = 8 + (w - 16) * (0.1 + ((p - 1) / 6) * 0.9);
        return (
          <text key={p} x={x} y={52} textAnchor="middle" fontSize="9"
            fill={p === pos ? A : L} fontWeight={p === pos ? '700' : '400'} fontFamily="system-ui">{p}</text>
        );
      })}
    </svg>
  );
}
