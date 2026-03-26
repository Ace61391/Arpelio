'use client';
import RecorderDiagram from './diagrams/RecorderDiagram';
import ValveDiagram from './diagrams/ValveDiagram';
import SlideDiagram from './diagrams/SlideDiagram';

const INSTRUMENT_DIAGRAM_MAP = {
  'soprano-recorder': 'recorder',
  'alto-recorder': 'recorder',
  'flute': 'woodwind-keys',
  'piccolo': 'woodwind-keys',
  'bb-clarinet': 'woodwind-keys',
  'bass-clarinet': 'woodwind-keys',
  'alto-saxophone': 'woodwind-keys',
  'tenor-saxophone': 'woodwind-keys',
  'baritone-saxophone': 'woodwind-keys',
  'bb-trumpet': 'valve',
  'french-horn': 'valve',
  'euphonium': 'valve',
  'bb-tuba': 'valve',
  'trombone': 'slide',
};

// For keyed woodwinds (flute, clarinet, sax), show text notation as primary diagram
// Full SVG key diagrams are Sprint 2b — for now, text notation is accurate and useful
function TextNotationDiagram({ textNotation, size = 'md' }) {
  const fontSize = size === 'lg' ? 16 : size === 'md' ? 13 : 11;
  return (
    <div className="font-mono text-center px-3 py-2 rounded-lg bg-[#f8f9fb] border border-[#e5e8ed]"
      style={{ fontSize }}>
      {textNotation}
    </div>
  );
}

export default function FingeringDiagram({ instrumentId, elements = [], textNotation = '', interactive = false, onToggle, size = 'md' }) {
  const type = INSTRUMENT_DIAGRAM_MAP[instrumentId];

  switch (type) {
    case 'recorder':
      return <RecorderDiagram elements={elements} interactive={interactive} onToggle={onToggle} size={size} />;
    case 'valve':
      return <ValveDiagram elements={elements} interactive={interactive} onToggle={onToggle} size={size} />;
    case 'slide':
      return <SlideDiagram elements={elements} interactive={interactive} onToggle={onToggle} size={size} />;
    case 'woodwind-keys':
      // Keyed woodwinds use text notation for now — full SVG diagrams in Sprint 2b
      return <TextNotationDiagram textNotation={textNotation} size={size} />;
    default:
      return <TextNotationDiagram textNotation={textNotation} size={size} />;
  }
}
