'use client';
import FingeringDiagram from '@/components/FingeringDiagram';
import { diagramType } from '@/lib/quiz/interact.mjs';

// A fingering diagram sized for a quiz: large enough to tap on a phone, never wider than the screen.
const WIDTH = { recorder: 'w-[150px]', flute: 'w-full max-w-[600px]', valve: 'w-full max-w-[320px]', slide: 'w-full max-w-[480px]' };
const SMALL = { recorder: 'w-[64px]', flute: 'w-full max-w-[260px]', valve: 'w-full max-w-[150px]', slide: 'w-full max-w-[240px]' };

export default function QuizDiagram({ instrumentId, elements, onKey, small = false }) {
  const type = diagramType(instrumentId);
  return (
    <div className={`mx-auto ${(small ? SMALL : WIDTH)[type]}`}>
      <FingeringDiagram instrumentId={instrumentId} elements={elements} size="fill" onKey={onKey} />
    </div>
  );
}
