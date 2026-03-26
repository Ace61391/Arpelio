'use client';

export default function RecorderDiagram({ elements = [], interactive = false, onToggle, size = 'md' }) {
  const s = size === 'lg' ? 20 : size === 'md' ? 16 : 12;
  const gap = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const thumbS = s * 0.8;

  // Parse elements to determine hole states
  const holeMap = { L1: 0, L2: 1, L3: 2, R1: 3, R2: 4, R3: 5, R4: 6 };
  const holes = [0, 0, 0, 0, 0, 0, 0];
  let thumb = 'off';

  elements.forEach(e => {
    if (e === 'thumb') thumb = 'full';
    else if (e === 'thumb-half') thumb = 'half';
    else if (holeMap[e] !== undefined) holes[holeMap[e]] = 1;
  });

  const filled = '#1a1d23';
  const empty = '#ffffff';
  const stroke = '#c0c4cc';
  const interactiveStroke = '#4f6df5';

  return (
    <div className="flex flex-col items-center" style={{ gap }}>
      {/* Thumb (square with rounded corners) */}
      <div
        onClick={interactive ? () => onToggle?.('thumb') : undefined}
        className={interactive ? 'cursor-pointer' : ''}
        style={{
          width: thumbS, height: thumbS * 0.75, borderRadius: 3,
          border: `1.5px solid ${thumb === 'half' ? '#4f6df5' : interactive ? interactiveStroke : stroke}`,
          background: thumb === 'full' ? filled : thumb === 'half' ? `linear-gradient(180deg, ${filled} 50%, ${empty} 50%)` : empty,
          transition: 'all 0.15s',
        }}
      />
      <div style={{ width: 1, height: 4, background: '#e5e8ed' }} />
      {/* Left hand holes */}
      {[0, 1, 2].map(i => (
        <div
          key={`L${i}`}
          onClick={interactive ? () => onToggle?.(i) : undefined}
          className={interactive ? 'cursor-pointer' : ''}
          style={{
            width: s, height: s, borderRadius: '50%',
            border: `1.5px solid ${interactive ? interactiveStroke : stroke}`,
            background: holes[i] ? filled : empty,
            transition: 'all 0.15s',
            boxShadow: holes[i] ? 'inset 0 1px 2px rgba(0,0,0,0.2)' : 'none',
          }}
        />
      ))}
      {/* Hand divider */}
      <div style={{ width: s * 1.5, height: 1, background: '#e5e8ed' }} />
      {/* Right hand holes */}
      {[3, 4, 5, 6].map(i => (
        <div
          key={`R${i}`}
          onClick={interactive ? () => onToggle?.(i) : undefined}
          className={interactive ? 'cursor-pointer' : ''}
          style={{
            width: s, height: s, borderRadius: '50%',
            border: `1.5px solid ${interactive ? interactiveStroke : stroke}`,
            background: holes[i] ? filled : empty,
            transition: 'all 0.15s',
            boxShadow: holes[i] ? 'inset 0 1px 2px rgba(0,0,0,0.2)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
