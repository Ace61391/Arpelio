'use client';

export default function ValveDiagram({ elements = [], interactive = false, onToggle, size = 'md' }) {
  const s = size === 'lg' ? 28 : size === 'md' ? 22 : 16;
  const gap = size === 'lg' ? 8 : size === 'md' ? 6 : 4;

  // Parse valve states from elements
  const valves = [0, 0, 0];
  elements.forEach(e => {
    if (e === 'valve-1' || e === '1') valves[0] = 1;
    if (e === 'valve-2' || e === '2') valves[1] = 1;
    if (e === 'valve-3' || e === '3') valves[2] = 1;
  });

  const filled = '#1a1d23';
  const empty = '#ffffff';
  const stroke = '#c0c4cc';
  const interactiveStroke = '#4f6df5';
  const labels = ['1', '2', '3'];

  return (
    <div className="flex items-center" style={{ gap }}>
      {valves.map((on, i) => (
        <div key={i} className="flex flex-col items-center" style={{ gap: 2 }}>
          <div
            onClick={interactive ? () => onToggle?.(i) : undefined}
            className={`flex items-center justify-center ${interactive ? 'cursor-pointer' : ''}`}
            style={{
              width: s, height: s, borderRadius: '50%',
              border: `2px solid ${interactive ? interactiveStroke : stroke}`,
              background: on ? filled : empty,
              transition: 'all 0.15s',
              boxShadow: on ? 'inset 0 2px 4px rgba(0,0,0,0.25)' : '0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{
              fontSize: s * 0.4,
              fontWeight: 700,
              color: on ? '#fff' : '#7a8294',
              fontFamily: '"JetBrains Mono", monospace',
            }}>{labels[i]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
