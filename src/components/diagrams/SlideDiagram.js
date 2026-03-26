'use client';

export default function SlideDiagram({ elements = [], interactive = false, onToggle, size = 'md' }) {
  const w = size === 'lg' ? 180 : size === 'md' ? 140 : 100;
  const h = size === 'lg' ? 36 : size === 'md' ? 28 : 20;

  // Parse slide position from elements
  let position = 1;
  elements.forEach(e => {
    const match = e.match?.(/position-(\d)/);
    if (match) position = parseInt(match[1]);
    // Also handle text_notation format
    if (typeof e === 'string' && /^[1-7]$/.test(e)) position = parseInt(e);
  });

  const positions = [1, 2, 3, 4, 5, 6, 7];
  const slidePercent = (position - 1) / 6;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Slide bar */}
      <div style={{
        width: w, height: h, borderRadius: h / 2,
        border: '1.5px solid #c0c4cc',
        background: '#f8f9fb',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fill to position */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${14 + slidePercent * 86}%`,
          background: 'linear-gradient(90deg, #1a1d23 0%, #4a5060 100%)',
          borderRadius: h / 2,
          transition: 'width 0.2s ease',
        }} />
        {/* Position number */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: h * 0.5, fontWeight: 700, color: '#fff',
          fontFamily: '"JetBrains Mono", monospace',
          mixBlendMode: 'difference',
        }}>
          {position}
        </div>
      </div>
      {/* Position markers */}
      <div className="flex" style={{ width: w, justifyContent: 'space-between', padding: '0 4px' }}>
        {positions.map(p => (
          <div
            key={p}
            onClick={interactive ? () => onToggle?.(p) : undefined}
            className={interactive ? 'cursor-pointer' : ''}
            style={{
              fontSize: 9, fontWeight: p === position ? 700 : 400,
              color: p === position ? '#4f6df5' : '#b0b5c0',
              fontFamily: '"JetBrains Mono", monospace',
              transition: 'all 0.15s',
            }}
          >{p}</div>
        ))}
      </div>
    </div>
  );
}
