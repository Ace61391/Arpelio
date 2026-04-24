'use client';
import RecorderDiagram from './diagrams/RecorderDiagram';
import ValveDiagram from './diagrams/ValveDiagram';
import SlideDiagram from './diagrams/SlideDiagram';
import FluteDiagram from './diagrams/FluteDiagram';
import ClarinetDiagram from './diagrams/ClarinetDiagram';
import SaxDiagram from './diagrams/SaxDiagram';

const DIAGRAM_MAP = {
  'recorder': 'recorder',
  'flute': 'flute',
  'clarinet': 'clarinet',
  'saxophone': 'saxophone',
  'bb-trumpet': 'valve',
  'french-horn': 'valve',
  'euphonium': 'valve',
  'bb-tuba': 'valve',
  'trombone': 'slide',
};

const COMPONENTS = {
  recorder: RecorderDiagram,
  flute: FluteDiagram,
  clarinet: ClarinetDiagram,
  saxophone: SaxDiagram,
  valve: ValveDiagram,
  slide: SlideDiagram,
};

export default function FingeringDiagram({ instrumentId, elements = [], textNotation = '', size = 'md', blank = false, holeStyle }) {
  const type = DIAGRAM_MAP[instrumentId] || 'valve';
  const Component = COMPONENTS[type];

  if (!Component) {
    return (
      <div className="font-mono text-center px-3 py-2 rounded-lg bg-[#f8f9fb] border border-[#e5e8ed] text-sm text-[#4a5060]">
        {textNotation || 'No diagram available'}
      </div>
    );
  }

  return <Component elements={elements} size={size} blank={blank} holeStyle={holeStyle} />;
}

export function getDiagramType(instrumentId) {
  return DIAGRAM_MAP[instrumentId] || 'valve';
}
