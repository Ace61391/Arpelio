// Shared look for the redrawn diagrams (recorder, flute, valves, slide).
// Colours are set inline, not through a <style> block, so two kinds of diagram on one page cannot restyle each other.
// Every key or hole still carries class "open", "pressed" or "half" for tests and tooling.

export const INK = '#1a1d23';   // keys, holes, pressed fill
export const EDGE = '#aab1bd';  // instrument outline
export const SOFT = '#f6f7f9';  // instrument body
export const LABEL = '#6b7385'; // secondary labels

const base = { stroke: INK, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Props for a key or hole: filled when pressed, white when open (white, not "none", so the body outline does not show through).
export const key = (on) => ({ className: on ? 'pressed' : 'open', style: { ...base, fill: on ? INK : '#fff' } });

export const body = { style: { fill: SOFT, stroke: EDGE, strokeWidth: 1.5, strokeLinejoin: 'round' } };
export const guide = { style: { stroke: EDGE, strokeWidth: 1.2, fill: 'none' } };
export const divider = { style: { stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round' } };

const font = 'system-ui, sans-serif';
export const nameLabel = { style: { fontFamily: font, fontWeight: 700, fill: INK } };
export const noteLabel = { style: { fontFamily: font, fontWeight: 600, fill: LABEL } };

// Makes a key or hole tappable when a diagram is given `onKey` (online quizzes). Without `onKey` it adds nothing.
// `hit` is an invisible, larger shape so small keys are still easy to tap on a phone.
export function Tap({ onKey, element, label, on = false, hit = null, children }) {
  if (!onKey) return children;
  const fire = () => onKey(element);
  return (
    <g role="button" tabIndex={0} aria-label={label} aria-pressed={on} data-key={element} className="diagram-key"
      style={{ cursor: 'pointer' }}
      onClick={fire}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } }}>
      {hit}
      {children}
    </g>
  );
}

export const HIT = { fill: 'transparent', stroke: 'none' };
