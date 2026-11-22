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
import InstrumentTile from '@/components/InstrumentTile';
import WorksheetIcon from '@/components/WorksheetIcon';

const MODES = [
  { id: 'reference', label: 'Reference Chart', desc: 'Study guide — filled diagrams with note names' },
  { id: 'identify', label: 'Quiz: Identify Note', desc: 'See filled diagram → write the note name' },
  { id: 'fill', label: 'Quiz: Fill Chart', desc: 'See note on staff → fill blank diagram by hand' },
];

const MODE_IDS = MODES.map(m => m.id);

// Links elsewhere in the app used ?mode=quiz before the quiz split into
// identify/fill. Map old values forward instead of rendering an empty sheet.
const LEGACY_MODES = { quiz: 'identify' };

function normalizeMode(raw) {
  if (raw && MODE_IDS.includes(raw)) return raw;
  return LEGACY_MODES[raw] || 'reference';
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="px-8 py-20 text-center text-[#7a8294]">Loading builder...</div>}>
      <BuilderInner />
    </Suspense>
  );
}

function BuilderInner() {
  const searchParams = useSearchParams();
  const [instrumentId, setInstrumentId] = useState(() => {
    const q = searchParams.get('instrument');
    return INSTRUMENTS.some(i => i.id === q && !i.hidden) ? q : '';
  });
  const [mode, setMode] = useState(normalizeMode(searchParams.get('mode')));
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [title, setTitle] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const instMeta = instrumentId ? getInstrument(instrumentId) : null;
  const fingerings = instrumentId ? getFingeringsForInstrument(instrumentId) : [];

  // Notes grouped by octave/register, in the order they appear in the data.
  const groups = useMemo(() => {
    const out = [];
    fingerings.forEach(f => {
      const label = f.octave || f.register || 'Notes';
      let g = out.find(x => x.label === label);
      if (!g) { g = { label, notes: [] }; out.push(g); }
      g.notes.push(f);
    });
    return out;
  }, [fingerings]);

  const beginnerIds = useMemo(
    () => fingerings.filter(f => f.pedagogy?.beginner_note).map(f => f.note.written),
    [fingerings]
  );

  // The selection belongs to the instrument. It starts on the beginner notes and is only reset when the
  // instrument changes — never when the worksheet type, title or answer key changes.
  useEffect(() => {
    if (!instrumentId) { setSelectedNotes(new Set()); return; }
    setSelectedNotes(new Set(beginnerIds.length ? beginnerIds : fingerings.map(f => f.note.written)));
  }, [instrumentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Links such as /builder?mode=fill reach this page without remounting it; follow them, and keep the notes.
  const modeParam = searchParams.get('mode');
  const instrumentParam = searchParams.get('instrument');
  useEffect(() => { if (modeParam) setMode(normalizeMode(modeParam)); }, [modeParam]);
  useEffect(() => {
    if (instrumentParam && INSTRUMENTS.some(i => i.id === instrumentParam && !i.hidden)) setInstrumentId(instrumentParam);
  }, [instrumentParam]);

  const setGroup = (ids, on) => {
    setSelectedNotes(prev => {
      const next = new Set(prev);
      ids.forEach(id => (on ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const toggleNote = (noteId) => {
    setSelectedNotes(prev => {
      const next = new Set(prev);
      next.has(noteId) ? next.delete(noteId) : next.add(noteId);
      return next;
    });
  };

  const selectedFingerings = fingerings.filter(f => selectedNotes.has(f.note.written));

  // On brass, one fingering plays several notes, so "which note is this?" has more than one right answer.
  // The identify quiz therefore shows each fingering once and asks for every selected note that uses it.
  const groupByFingering = mode === 'identify' && instMeta?.family === 'brass';
  const cards = useMemo(() => {
    if (!groupByFingering) return selectedFingerings.map(f => ({ f, notes: [f] }));
    const out = [];
    selectedFingerings.forEach(f => {
      const key = [...f.primary.elements].sort().join(' ');
      const hit = out.find(c => c.key === key);
      if (hit) hit.notes.push(f); else out.push({ key, f, notes: [f] });
    });
    return out;
  }, [selectedFingerings, groupByFingering]); // eslint-disable-line react-hooks/exhaustive-deps
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
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {INSTRUMENTS.filter(i => !i.hidden).map(inst => (
                <button key={inst.id} aria-pressed={instrumentId === inst.id}
                  onClick={() => {
                    // A title that names the old instrument would be wrong on the new one; any other title is kept.
                    const names = [instMeta?.name, instMeta?.shortName].filter(Boolean).map(n => n.toLowerCase());
                    if (inst.id !== instrumentId && names.some(n => title.toLowerCase().includes(n))) setTitle('');
                    setInstrumentId(inst.id);
                  }}
                  className={`text-left p-3 rounded-xl transition-all border ${
                    instrumentId === inst.id
                      ? 'border-accent bg-accent-light shadow-sm'
                      : 'border-[#e5e8ed] bg-white hover:border-accent hover:-translate-y-0.5 hover:shadow-md'
                  }`}>
                  <InstrumentTile inst={inst} compact selected={instrumentId === inst.id} />
                </button>
              ))}
            </div>
          </div>

          {/* Before an instrument is picked, show what comes next so the page does not read as empty */}
          {!instrumentId && (
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-sm" aria-label="Next steps">
              {[
                ['2', 'Choose a worksheet type', 'Reference chart, identify-the-note quiz, or fill-the-chart quiz.'],
                ['3', 'Select notes', 'Start from beginner notes or one octave, then untick what you have not taught.'],
                ['4', 'Print', 'Add a title, tick the answer key if you want one, and print or save as PDF.'],
              ].map(([n, t, d]) => (
                <li key={n} className="border border-dashed border-[#d0d4dc] rounded-xl p-4 bg-[#f8f9fb]">
                  <div className="text-xs font-bold text-[#7a8294] uppercase tracking-widest mb-1">{n}. {t}</div>
                  <div className="text-[#4a5060]">{d}</div>
                </li>
              ))}
            </ol>
          )}

        </div>

        {instrumentId && (
          <div className="lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8 lg:items-start print:block">
            {/* Controls — stay in view on desktop while the worksheet updates beside them */}
            <div className="print:hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
              {/* Step 2: Choose mode */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">2. Choose worksheet type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {MODES.map(m => (
                    <button key={m.id} onClick={() => { setMode(m.id); }}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        mode === m.id
                          ? 'border-accent bg-accent-light'
                          : 'border-[#e5e8ed] bg-white hover:border-[#d0d4dc]'
                      }`}>
                      <div className={`mb-2 ${mode === m.id ? 'text-accent' : 'text-[#4a5060]'}`}><WorksheetIcon mode={m.id} /></div>
                      <div className={`text-sm font-bold ${mode === m.id ? 'text-accent' : 'text-[#1a1d23]'}`}>{m.label}</div>
                      <div className="text-xs text-[#7a8294] mt-1">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Select notes */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">3. Select notes</h2>
                {/* Quick picks replace the selection; the groups below add to or trim it */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-[#7a8294] mr-1">Quick pick:</span>
                  {beginnerIds.length > 0 && (
                    <button onClick={() => setSelectedNotes(new Set(beginnerIds))}
                      className="px-3 py-2 rounded-full text-sm font-semibold border border-[#e5e8ed] text-[#4a5060] hover:border-accent hover:text-accent">
                      Beginner
                    </button>
                  )}
                  <button onClick={() => setSelectedNotes(new Set(fingerings.map(f => f.note.written)))}
                    className="px-3 py-2 rounded-full text-sm font-semibold border border-[#e5e8ed] text-[#4a5060] hover:border-accent hover:text-accent">
                    All notes
                  </button>
                  <button onClick={() => setSelectedNotes(new Set())}
                    className="px-3 py-2 rounded-full text-sm font-semibold border border-[#e5e8ed] text-[#4a5060] hover:border-accent hover:text-accent">
                    Clear
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {groups.map(g => {
                    const ids = g.notes.map(f => f.note.written);
                    const picked = ids.filter(id => selectedNotes.has(id)).length;
                    const allOn = picked === ids.length;
                    return (
                      <div key={g.label} role="group" aria-label={g.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-sm font-bold text-[#1a1d23]">
                            {g.label} <span className="font-normal text-[#7a8294]">· {picked} of {ids.length}</span>
                          </div>
                          <button onClick={() => setGroup(ids, !allOn)}
                            aria-label={`${allOn ? 'Clear' : 'Select all of'} ${g.label}`}
                            className="text-sm font-semibold text-accent hover:underline px-2 py-1">
                            {allOn ? 'Clear' : 'Select all'}
                          </button>
                        </div>
                        {/* A fixed grid so every chip is the same size, whatever its label */}
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-6 gap-1.5">
                          {g.notes.map(f => {
                            const on = selectedNotes.has(f.note.written);
                            return (
                              <button key={f.note.written} onClick={() => toggleNote(f.note.written)}
                                aria-pressed={on}
                                title={f.pedagogy?.beginner_note ? 'Beginner note' : undefined}
                                className={`relative w-full h-10 px-0 rounded-md text-[13px] font-semibold border transition-all whitespace-nowrap ${
                                  on
                                    ? 'border-accent bg-accent text-white'
                                    : 'border-[#e5e8ed] bg-white text-[#7a8294] hover:border-[#d0d4dc]'
                                }`}>
                                {f.note.display}
                                {f.pedagogy?.beginner_note && (
                                  <span className={`absolute top-[3px] right-[3px] w-[5px] h-[5px] rounded-full ${on ? 'bg-white' : 'bg-accent'}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-[#7a8294] mt-3">
                  {selectedNotes.size} notes selected · <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent align-middle" /> marks a beginner note
                </p>
              </div>

              {/* Step 4: Customize */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">4. Customize</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <div>
                    <label htmlFor="ws-title" className="text-xs font-semibold text-[#4a5060] block mb-1">Title</label>
                    <input id="ws-title" type="text" value={title} onChange={e => setTitle(e.target.value)}
                      placeholder={`${instMeta?.name || ''} Fingering Chart`}
                      className="w-full px-3 py-2 rounded-lg border border-[#e5e8ed] text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label htmlFor="ws-school" className="text-xs font-semibold text-[#4a5060] block mb-1">School / teacher name</label>
                    <input id="ws-school" type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)}
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

            </div>

            {/* Live preview — always shown, updates as notes are ticked */}
            <div className="min-w-0">
              <div className="print:hidden flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="text-sm text-[#7a8294]">
                  <span className="font-bold text-[#1a1d23]">Live preview</span> · {selectedFingerings.length} {selectedFingerings.length === 1 ? 'note' : 'notes'}
                  {showAnswerKey && mode !== 'reference' ? ' · answer key' : ''}
                </div>
                <button onClick={handlePrint} disabled={selectedFingerings.length === 0}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 text-sm font-bold transition-all">
                  Print / Save as PDF
                </button>
              </div>

              {selectedFingerings.length === 0 && (
                <div className="print:hidden border border-dashed border-[#d0d4dc] rounded-2xl p-10 text-center text-[#7a8294] bg-[#f8f9fb]">
                  Select at least one note to see the worksheet.
                </div>
              )}

              {selectedFingerings.length > 0 && (
          <div className="border border-[#e5e8ed] rounded-2xl p-5 md:p-8 bg-white print:border-none print:rounded-none print:p-0">
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b border-[#e5e8ed] print:border-black">
              <h2 className="text-2xl font-extrabold text-[#1a1d23]">
                {title || `${instMeta?.name || ''} ${mode === 'reference' ? 'Fingering Chart' : mode === 'identify' ? 'Fingering Quiz — Identify the Note' : 'Fingering Quiz — Fill the Chart'}`}
              </h2>
              {schoolName && <p className="text-sm text-[#7a8294] mt-1">{schoolName}</p>}
              <p className="text-xs text-[#6b7385] mt-1">Name: __________________ Period: ____ Date: ________</p>
              {groupByFingering && (
                <p className="text-sm text-[#4a5060] mt-3">
                  Each fingering plays more than one note. Write every note you have learned that uses it, lowest first — one per blank.
                </p>
              )}
            </div>

            {/* Notes grid — 3 per row for readability */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 print:grid-cols-3">
              {cards.map(({ f, notes }, idx) => (
                <div key={f.note.written} className="border border-[#e5e8ed] rounded-xl p-5 flex flex-col items-center gap-3 print:border-gray-400 print:rounded-lg print:p-4 overflow-hidden">
                  <span className="text-xs text-[#6b7385] font-mono">{idx + 1}.</span>

                  {mode === 'reference' && (
                    <>
                      <div className="text-xl font-bold text-[#1a1d23]">{f.note.display}</div>
                      <StaffNote note={f.note.written} clef={clef} width={64} />
                      <div className="w-full flex justify-center"><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                      <div className="font-mono text-sm text-[#4a5060]">{f.primary.text_notation}</div>
                    </>
                  )}

                  {mode === 'identify' && (
                    <>
                      <div className="w-full flex justify-center"><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                      <div className="font-mono text-sm text-[#4a5060]">{f.primary.text_notation}</div>
                      {showAnswerKey ? (
                        <div className="text-base font-bold text-accent">{notes.map(n => n.note.display).join(' · ')}</div>
                      ) : (
                        <div className="flex gap-3 flex-wrap justify-center">
                          {notes.map(n => <div key={n.note.written} className="border-b-2 border-[#6b7385] w-14 h-6 mt-1" />)}
                        </div>
                      )}
                    </>
                  )}

                  {mode === 'fill' && (
                    <>
                      <div className="text-xl font-bold text-[#1a1d23]">{f.note.display}</div>
                      <StaffNote note={f.note.written} clef={clef} width={64} />
                      {showAnswerKey ? (
                        <div className="w-full flex justify-center"><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                      ) : (
                        <div className="w-full flex justify-center"><FingeringDiagram instrumentId={instrumentId} elements={[]} size="md" blank={true} /></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-[#e5e8ed] print:border-gray-300">
              <p className="text-xs text-[#6b7385]">
                {showAnswerKey && '✓ ANSWER KEY — '}
                Generated by Arpelio · arpelio.com · {selectedFingerings.length} notes{groupByFingering ? ` · ${cards.length} fingerings` : ''}
              </p>
            </div>
          </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          
          /* Force page setup */
          @page { margin: 0.5in; size: letter portrait; }
          
          /* Remove all screen-only styling */
          .border, .rounded-2xl, .shadow-lg { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
          
          /* Grid fits page width */
          .print\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
          
          /* Cards get thin borders for print */
          .print\\:border-gray-400 { border: 1px solid #999 !important; }
          .print\\:rounded-lg { border-radius: 8px !important; }
          .print\\:p-4 { padding: 12px !important; }
          
          /* Prevent cards from breaking across pages */
          .grid > div { break-inside: avoid; page-break-inside: avoid; }
          
          /* SVGs scale to fit their containers */
          svg { max-width: 100% !important; height: auto !important; }
          
          /* Keep the preview area clean */
          .print\\:border-none { border: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:border-black { border-color: #000 !important; }
          .print\\:border-gray-300 { border-color: #ccc !important; }
        }
      `}</style>
    </>
  );
}
