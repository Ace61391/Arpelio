'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StaffNote from '@/components/StaffNote';
import FingeringDiagram from '@/components/FingeringDiagram';
import { getInstrument, INSTRUMENTS } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';

const OCTAVE_FILTERS = [
  { id: 'all', label: 'All Notes' },
  { id: 'beginner', label: 'Beginner' },
  { id: '1', label: '1st' },
  { id: '2', label: '2nd' },
  { id: '3', label: '3rd' },
];

const MODES = [
  { id: 'reference', label: '📖 Reference', desc: 'Browse all fingerings' },
  { id: 'quiz', label: '✏️ Quiz', desc: 'Test your knowledge' },
  { id: 'flashcard', label: '⚡ Flashcards', desc: 'Study & memorize' },
];

export default function InstrumentPage() {
  const params = useParams();
  const id = params.id;
  const instMeta = getInstrument(id);
  const instData = getInstrumentData(id);
  const [mode, setMode] = useState('reference');
  const [octaveFilter, setOctaveFilter] = useState('beginner');
  const [selectedNote, setSelectedNote] = useState(null);

  // Quiz state
  const [quizState, setQuizState] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [submitted, setSubmitted] = useState(false);

  // Flashcard state
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);

  const fingerings = instData?.fingerings || [];
  const instrument = instData?.instrument;

  const availableOctaves = useMemo(() => {
    const octaves = new Set();
    fingerings.forEach(f => {
      const octName = f.octave || f.register;
      if (octName?.includes('1st') || octName?.includes('Chalumeau') || octName?.includes('Low')) octaves.add('1');
      if (octName?.includes('2nd') || octName?.includes('Clarion') || octName?.includes('Mid') || octName?.includes('Palm')) octaves.add('2');
      if (octName?.includes('3rd') || octName?.includes('Altissimo') || octName?.includes('High') || octName?.includes('Upper')) octaves.add('3');
    });
    return octaves;
  }, [fingerings]);

  const filteredNotes = useMemo(() => {
    return fingerings.filter(f => {
      if (octaveFilter === 'all') return true;
      if (octaveFilter === 'beginner') return f.pedagogy?.beginner_note;
      const octName = (f.octave || f.register || '').toLowerCase();
      if (octaveFilter === '1') return octName.includes('1st') || octName.includes('chalumeau') || octName.includes('low');
      if (octaveFilter === '2') return octName.includes('2nd') || octName.includes('clarion') || octName.includes('mid') || octName.includes('palm');
      if (octaveFilter === '3') return octName.includes('3rd') || octName.includes('altissimo') || octName.includes('high') || octName.includes('upper');
      return true;
    });
  }, [fingerings, octaveFilter]);

  if (!instMeta || !instData) {
    return (
      <>
        <Nav />
        <div className="px-8 py-20 max-w-[1160px] mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#1a1d23] mb-4">Instrument not found</h1>
          <Link href="/instruments" className="text-accent font-semibold">← Back to instruments</Link>
        </div>
        <Footer />
      </>
    );
  }

  const startQuiz = () => {
    const shuffled = [...filteredNotes].sort(() => Math.random() - 0.5).slice(0, Math.min(8, filteredNotes.length));
    setQuizState({ questions: shuffled, current: 0 });
    setSubmitted(false);
    setScore({ correct: 0, total: 0 });
  };

  const clef = instMeta.clef;

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#7a8294] mb-6">
          <Link href="/instruments" className="hover:text-accent transition-colors">Instruments</Link>
          <span>/</span>
          <span className="text-[#1a1d23] font-medium">{instMeta.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-1">{instMeta.name}</h1>
            <p className="text-sm text-[#4a5060]">{instMeta.description} · {instMeta.notes} notes</p>
          </div>
          <div className="flex gap-2">
            {instMeta.transposition !== 'C' && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-light text-accent">{instMeta.transposition} Transposition</span>
            )}
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#f8f9fb] text-[#4a5060]">{clef} clef</span>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {MODES.map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setQuizState(null); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap ${
                mode === m.id
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-[#e5e8ed] bg-white text-[#4a5060] hover:border-[#d0d4dc]'
              }`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Octave filter */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto">
          {OCTAVE_FILTERS.filter(f => f.id === 'all' || f.id === 'beginner' || availableOctaves.has(f.id)).map(f => (
            <button key={f.id} onClick={() => setOctaveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                octaveFilter === f.id
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-[#e5e8ed] bg-white text-[#7a8294] hover:border-[#d0d4dc]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* ─── REFERENCE MODE ─── */}
        {mode === 'reference' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredNotes.map(f => {
              const isSelected = selectedNote === f.note.written;
              return (
                <div key={f.note.written}
                  onClick={() => setSelectedNote(isSelected ? null : f.note.written)}
                  className={`bg-white border rounded-card p-4 flex flex-col items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 ${
                    isSelected ? 'border-accent shadow-md' : 'border-[#e5e8ed] hover:border-[#d0d4dc]'
                  }`}>
                  <div className="text-lg font-bold text-[#1a1d23]">{f.note.display}</div>
                  <StaffNote note={f.note.written} clef={clef} width={52} />
                  <FingeringDiagram
                    instrumentId={id}
                    elements={f.primary.elements}
                    textNotation={f.primary.text_notation}
                    size="sm"
                  />
                  <div className="font-mono text-[11px] text-[#7a8294]">{f.primary.text_notation}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── QUIZ MODE ─── */}
        {mode === 'quiz' && !quizState && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎵</div>
            <h2 className="text-xl font-bold text-[#1a1d23] mb-2">Fingering Quiz</h2>
            <p className="text-sm text-[#4a5060] mb-6">See a note on the staff — identify the correct fingering.</p>
            <p className="text-xs text-[#7a8294] mb-4">{filteredNotes.length} notes available · {octaveFilter === 'beginner' ? 'Beginner' : octaveFilter} level</p>
            <button onClick={startQuiz} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3 text-base font-bold transition-all">
              Start Quiz ({Math.min(8, filteredNotes.length)} questions)
            </button>
          </div>
        )}
        {mode === 'quiz' && quizState && quizState.current < quizState.questions.length && (() => {
          const q = quizState.questions[quizState.current];
          return (
            <div className="bg-white border border-[#e5e8ed] rounded-2xl p-8 max-w-[500px] mx-auto flex flex-col items-center gap-5">
              <div className="text-xs font-semibold text-[#7a8294]">Question {quizState.current + 1} of {quizState.questions.length}</div>
              <div className="text-lg font-bold text-[#1a1d23]">What is the fingering for <span className="text-accent">{q.note.display}</span>?</div>
              <StaffNote note={q.note.written} clef={clef} width={64} />
              
              {submitted ? (
                <>
                  <div className="text-center">
                    <FingeringDiagram instrumentId={id} elements={q.primary.elements} textNotation={q.primary.text_notation} size="md" />
                    <div className="font-mono text-sm text-[#4a5060] mt-2">{q.primary.text_notation}</div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-lg text-sm font-bold ${score.correct > (score.total - 1) ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
                    {score.correct > (score.total - 1) ? '✓ Correct!' : '✗ Study this one!'}
                  </div>
                  <div className="text-sm text-[#7a8294]">Score: {score.correct}/{score.total}</div>
                  {quizState.current < quizState.questions.length - 1 ? (
                    <button onClick={() => { setQuizState(s => ({ ...s, current: s.current + 1 })); setSubmitted(false); }}
                      className="bg-[#f1f3f6] hover:bg-[#e5e8ed] text-[#1a1d23] rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors">
                      Next Question →
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#1a1d23] mb-1">Quiz Complete!</div>
                      <div className="text-sm text-[#4a5060] mb-4">Score: {score.correct}/{score.total} ({Math.round(score.correct / score.total * 100)}%)</div>
                      <button onClick={startQuiz} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-2.5 text-sm font-bold transition-colors">
                        Try Again
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[#7a8294] mb-4">Think about the answer, then reveal it below.</p>
                  <button onClick={() => { setSubmitted(true); setScore(s => ({ ...s, total: s.total + 1, correct: s.correct + 1 })); }}
                    className="bg-success hover:opacity-90 text-white rounded-lg px-5 py-2.5 text-sm font-bold transition-all mr-2">
                    I Know It ✓
                  </button>
                  <button onClick={() => { setSubmitted(true); setScore(s => ({ ...s, total: s.total + 1 })); }}
                    className="bg-[#f1f3f6] hover:bg-[#e5e8ed] text-[#1a1d23] rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors">
                    Show Answer
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* ─── FLASHCARD MODE ─── */}
        {mode === 'flashcard' && filteredNotes.length > 0 && (() => {
          const note = filteredNotes[flashIdx % filteredNotes.length];
          return (
            <div>
              <div onClick={() => setFlashRevealed(!flashRevealed)}
                className="bg-white border border-[#e5e8ed] rounded-2xl p-10 max-w-[400px] mx-auto flex flex-col items-center gap-4 cursor-pointer hover:shadow-md transition-all min-h-[320px] justify-center">
                {!flashRevealed ? (
                  <>
                    <div className="text-3xl font-extrabold text-[#1a1d23]">{note.note.display}</div>
                    <StaffNote note={note.note.written} clef={clef} width={64} />
                    <div className="text-xs text-[#b0b5c0]">tap to reveal fingering</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-[#1a1d23]">{note.note.display}</div>
                    <FingeringDiagram instrumentId={id} elements={note.primary.elements} textNotation={note.primary.text_notation} size="md" />
                    <div className="font-mono text-sm text-[#4a5060]">{note.primary.text_notation}</div>
                    <div className="text-xs text-[#b0b5c0]">tap to continue</div>
                  </>
                )}
              </div>
              <div className="flex gap-3 justify-center mt-4">
                <button onClick={() => { setFlashIdx(i => (i - 1 + filteredNotes.length) % filteredNotes.length); setFlashRevealed(false); }}
                  className="bg-[#f1f3f6] hover:bg-[#e5e8ed] text-[#1a1d23] rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors">
                  ← Prev
                </button>
                <button onClick={() => { setFlashIdx(i => (i + 1) % filteredNotes.length); setFlashRevealed(false); }}
                  className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-2.5 text-sm font-bold transition-colors">
                  Next →
                </button>
              </div>
              <div className="text-center text-xs text-[#7a8294] mt-2">
                {flashIdx % filteredNotes.length + 1} of {filteredNotes.length}
              </div>
            </div>
          );
        })()}
      </div>
      <Footer />
    </>
  );
}
