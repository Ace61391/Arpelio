'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StaffNote from '@/components/StaffNote';
import FingeringDiagram from '@/components/FingeringDiagram';
import { INSTRUMENTS, getInstrument } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';

const MODES = [
  { id: 'reference', label: 'Reference Chart', desc: 'Study guide — filled diagrams with note names', icon: '📖' },
  { id: 'identify', label: 'Quiz: Identify Note', desc: 'See filled diagram → write the note name', icon: '🔍' },
  { id: 'fill', label: 'Quiz: Fill Chart', desc: 'See note on staff → fill blank diagram by hand', icon: '✏️' },
];

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="px-8 py-20 text-center text-[#7a8294]">Loading builder...</div>}>
      <BuilderInner />
    </Suspense>
  );
}

function BuilderInner() {
  const searchParams = useSearchParams();
  const [instrumentId, setInstrumentId] = useState(searchParams.get('instrument') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || 'reference');
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [selectMode, setSelectMode] = useState('beginner');
  const [title, setTitle] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const instMeta = instrumentId ? getInstrument(instrumentId) : null;
  const fingerings = instrumentId ? getFingeringsForInstrument(instrumentId) : [];

  const filteredNotes = useMemo(() => {
    if (selectMode === 'all') return fingerings;
    if (selectMode === 'beginner') return fingerings.filter(f => f.pedagogy?.beginner_note);
    if (selectMode === '1st') return fingerings.filter(f => {
      const o = (f.octave || f.register || '').toLowerCase();
      return o.includes('1st') || o.includes('chalumeau') || o.includes('low');
    });
    if (selectMode === '2nd') return fingerings.filter(f => {
      const o = (f.octave || f.register || '').toLowerCase();
      return o.includes('2nd') || o.includes('clarion') || o.includes('mid');
    });
    return fingerings;
  }, [fingerings, selectMode]);

  useEffect(() => {
    setSelectedNotes(new Set(filteredNotes.map(f => f.note.written)));
  }, [filteredNotes, instrumentId, selectMode]);

  const toggleNote = (noteId) => {
    setSelectedNotes(prev => {
      const next = new Set(prev);
      next.has(noteId) ? next.delete(noteId) : next.add(noteId);
      return next;
    });
  };

  const selectedFingerings = fingerings.filter(f => selectedNotes.has(f.note.written));
  const clef = instMeta?.clef || 'treble';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto print:max-w-none print:px-4">
        <div className="print:hidden">
          <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">Worksheet Builder</h1>
          <p className="text-base text-[#4a5060] mb-8">Create reference charts and quiz worksheets. Everything is free.</p>

          {/* Step 1: Choose instrument */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">1. Choose instrument</h2>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map(inst => (
                <button key={inst.id} onClick={() => { setInstrumentId(inst.id); setShowPreview(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    instrumentId === inst.id
                      ? 'border-accent bg-accent-light text-accent'
                      : 'border-[#e5e8ed] bg-white text-[#4a5060] hover:border-[#d0d4dc]'
                  }`}>
                  {inst.shortName}
                </button>
              ))}
            </div>
          </div>

          {instrumentId && (
            <>
              {/* Step 2: Choose mode */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">2. Choose worksheet type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MODES.map(m => (
                    <button key={m.id} onClick={() => { setMode(m.id); setShowPreview(false); }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        mode === m.id
                          ? 'border-accent bg-accent-light'
                          : 'border-[#e5e8ed] bg-white hover:border-[#d0d4dc]'
                      }`}>
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className={`text-sm font-bold ${mode === m.id ? 'text-accent' : 'text-[#1a1d23]'}`}>{m.label}</div>
                      <div className="text-xs text-[#7a8294] mt-1">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Select notes */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">3. Select notes</h2>
                <div className="flex gap-2 mb-4">
                  {['beginner', '1st', '2nd', 'all'].map(s => (
                    <button key={s} onClick={() => { setSelectMode(s); setShowPreview(false); }}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                        selectMode === s
                          ? 'border-accent bg-accent-light text-accent'
                          : 'border-[#e5e8ed] text-[#7a8294]'
                      }`}>
                      {s === 'beginner' ? 'Beginner' : s === 'all' ? 'All notes' : `${s} octave`}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filteredNotes.map(f => (
                    <button key={f.note.written} onClick={() => toggleNote(f.note.written)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${
                        selectedNotes.has(f.note.written)
                          ? 'border-accent bg-accent text-white'
                          : 'border-[#e5e8ed] bg-white text-[#7a8294] hover:border-[#d0d4dc]'
                      }`}>
                      {f.note.display}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#7a8294] mt-2">{selectedNotes.size} notes selected</p>
              </div>

              {/* Step 4: Customize */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">4. Customize</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[600px]">
                  <div>
                    <label className="text-xs font-semibold text-[#4a5060] block mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                      placeholder={`${instMeta?.name || ''} Fingering Chart`}
                      className="w-full px-3 py-2 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#4a5060] block mb-1">School / teacher name</label>
                    <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none" />
                  </div>
                </div>
                {(mode === 'identify' || mode === 'fill') && (
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input type="checkbox" checked={showAnswerKey} onChange={e => setShowAnswerKey(e.target.checked)}
                      className="w-4 h-4 rounded border-[#e5e8ed] text-accent focus:ring-accent" />
                    <span className="text-sm text-[#4a5060]">Generate answer key (teacher copy)</span>
                  </label>
                )}
              </div>

              {/* Preview / Download */}
              <div className="flex gap-3 mb-8">
                <button onClick={() => setShowPreview(true)}
                  className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-sm font-bold transition-all"
                  disabled={selectedNotes.size === 0}>
                  Preview Worksheet
                </button>
                {showPreview && (
                  <button onClick={handlePrint}
                    className="bg-[#1a1d23] hover:bg-[#2a2d33] text-white rounded-lg px-6 py-3 text-sm font-bold transition-all">
                    Print / Save as PDF
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Preview area */}
        {showPreview && selectedFingerings.length > 0 && (
          <div className="border border-[#e5e8ed] rounded-2xl p-8 bg-white print:border-none print:rounded-none print:p-0">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b border-[#e5e8ed] print:border-black">
              <h2 className="text-2xl font-extrabold text-[#1a1d23]">
                {title || `${instMeta?.name || ''} ${mode === 'reference' ? 'Fingering Chart' : mode === 'identify' ? 'Fingering Quiz — Identify the Note' : 'Fingering Quiz — Fill the Chart'}`}
              </h2>
              {schoolName && <p className="text-sm text-[#7a8294] mt-1">{schoolName}</p>}
              <p className="text-xs text-[#b0b5c0] mt-1">Name: __________________ Period: ____ Date: ________</p>
            </div>

            {/* Notes grid */}
            <div className={`grid gap-4 ${mode === 'fill' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
              {selectedFingerings.map((f, idx) => (
                <div key={f.note.written} className="border border-[#e5e8ed] rounded-xl p-4 flex flex-col items-center gap-2 print:border-gray-400 print:rounded-lg">
                  <span className="text-xs text-[#b0b5c0] font-mono">{idx + 1}.</span>

                  {mode === 'reference' && (
                    <>
                      <div className="text-lg font-bold text-[#1a1d23]">{f.note.display}</div>
                      <StaffNote note={f.note.written} clef={clef} width={48} />
                      <FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="sm" />
                      <div className="font-mono text-[9px] text-[#b0b5c0]">{f.primary.text_notation}</div>
                    </>
                  )}

                  {mode === 'identify' && (
                    <>
                      <FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="sm" />
                      <div className="font-mono text-[9px] text-[#b0b5c0]">{f.primary.text_notation}</div>
                      {showAnswerKey ? (
                        <div className="text-sm font-bold text-accent">{f.note.display}</div>
                      ) : (
                        <div className="border-b-2 border-[#b0b5c0] w-16 h-6 mt-1" />
                      )}
                    </>
                  )}

                  {mode === 'fill' && (
                    <>
                      <div className="text-lg font-bold text-[#1a1d23]">{f.note.display}</div>
                      <StaffNote note={f.note.written} clef={clef} width={48} />
                      {showAnswerKey ? (
                        <FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="sm" />
                      ) : (
                        <FingeringDiagram instrumentId={instrumentId} elements={[]} size="sm" blank={true} />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-[#e5e8ed] print:border-gray-300">
              <p className="text-xs text-[#b0b5c0]">
                {showAnswerKey && '✓ ANSWER KEY — '}
                Generated by Arpelio · arpelio.com · {selectedFingerings.length} notes
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </>
  );
}
