'use client';
import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
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

  const previewRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  // Group fingerings into pages of 6
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < selectedFingerings.length; i += 6) {
      result.push(selectedFingerings.slice(i, i + 6));
    }
    return result;
  }, [selectedFingerings]);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const pageW = 8.5;
      const pageH = 11;
      const margin = 0.5;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });

      const pageDivs = previewRef.current.querySelectorAll('[data-pdf-page]');
      for (let i = 0; i < pageDivs.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(pageDivs[i], { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const imgW = contentW;
        const imgH = (canvas.height / canvas.width) * imgW;
        // Center vertically if shorter than page
        const yOffset = imgH < contentH ? margin : margin;
        pdf.addImage(imgData, 'PNG', margin, yOffset, imgW, Math.min(imgH, contentH));
      }

      const fileName = (title || `${instMeta?.name || 'Arpelio'} Fingering Chart`).replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
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
                  <button onClick={handleDownloadPDF} disabled={generating}
                    className="bg-[#1a1d23] hover:bg-[#2a2d33] text-white rounded-lg px-6 py-3 text-sm font-bold transition-all disabled:opacity-50">
                    {generating ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Preview area */}
        {showPreview && selectedFingerings.length > 0 && (
          <div ref={previewRef} className="border border-[#e5e8ed] rounded-2xl p-8 bg-white print:border-none print:rounded-none print:p-0">
            {/* Pages — 6 cards each (2 rows of 3) */}
            {pages.map((pageCards, pageIdx) => (
              <div key={pageIdx} data-pdf-page className={`bg-white p-4 ${pageIdx > 0 ? 'mt-8 pt-6 border-t-2 border-dashed border-[#e5e8ed]' : ''}`}>
                {/* Logo + header on every page */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 rounded-xl">
                    <rect width="140" height="140" rx="28" fill="#4F46B8"/>
                    <circle cx="28" cy="99" r="6.5" fill="#fff" opacity="0.35"/>
                    <circle cx="41" cy="77" r="7" fill="#fff" opacity="0.5"/>
                    <circle cx="54" cy="55" r="7.5" fill="#fff" opacity="0.7"/>
                    <circle cx="70" cy="33" r="8.5" fill="#fff" opacity="1"/>
                    <circle cx="86" cy="55" r="7.5" fill="#fff" opacity="0.7"/>
                    <circle cx="99" cy="77" r="7" fill="#fff" opacity="0.5"/>
                    <circle cx="112" cy="99" r="6.5" fill="#fff" opacity="0.35"/>
                    <circle cx="60" cy="77" r="4.5" fill="#fff" opacity="0.5"/>
                    <circle cx="80" cy="77" r="4.5" fill="#fff" opacity="0.5"/>
                  </svg>
                  <span className="text-3xl font-extrabold text-[#1a1d23] tracking-tight">Arpelio</span>
                </div>
                {pageIdx === 0 && (
                  <div className="text-center mb-4 pb-3 border-b border-[#e5e8ed]">
                    <h2 className="text-2xl font-extrabold text-[#1a1d23]">
                      {title || `${instMeta?.name || ''} ${mode === 'reference' ? 'Fingering Chart' : mode === 'identify' ? 'Fingering Quiz — Identify the Note' : 'Fingering Quiz — Fill the Chart'}`}
                    </h2>
                    {schoolName && <p className="text-sm text-[#7a8294] mt-1">{schoolName}</p>}
                    <p className="text-xs text-[#b0b5c0] mt-1">Name: __________________ Period: ____ Date: ________</p>
                  </div>
                )}
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {pageCards.map((f, idx) => (
                    <div key={f.note.written} className="border border-[#e5e8ed] rounded-xl p-3 flex flex-col items-center gap-1.5 overflow-hidden">
                      <span className="text-xs text-[#b0b5c0] font-mono">{pageIdx * 6 + idx + 1}.</span>

                      {mode === 'reference' && (
                        <>
                          <div className="text-xl font-bold text-[#1a1d23]">{f.note.display}</div>
                          <StaffNote note={f.note.written} clef={clef} width={64} />
                          <div className="w-full flex justify-center" style={{maxWidth: '120px'}}><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                          <div className="font-mono text-sm text-[#4a5060]">{f.primary.text_notation}</div>
                        </>
                      )}

                      {mode === 'identify' && (
                        <>
                          <div className="w-full flex justify-center" style={{maxWidth: '120px'}}><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                          <div className="font-mono text-sm text-[#4a5060]">{f.primary.text_notation}</div>
                          {showAnswerKey ? (
                            <div className="text-base font-bold text-accent">{f.note.display}</div>
                          ) : (
                            <div className="border-b-2 border-[#b0b5c0] w-20 h-6 mt-1" />
                          )}
                        </>
                      )}

                      {mode === 'fill' && (
                        <>
                          <div className="text-xl font-bold text-[#1a1d23]">{f.note.display}</div>
                          <StaffNote note={f.note.written} clef={clef} width={64} />
                          {showAnswerKey ? (
                            <div className="w-full flex justify-center" style={{maxWidth: '120px'}}><FingeringDiagram instrumentId={instrumentId} elements={f.primary.elements} size="md" /></div>
                          ) : (
                            <div className="w-full flex justify-center" style={{maxWidth: '120px'}}><FingeringDiagram instrumentId={instrumentId} elements={[]} size="md" blank={true} /></div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <p className="text-xs text-[#b0b5c0]">
                    {showAnswerKey && '✓ ANSWER KEY — '}
                    Generated by Arpelio · arpelio.com · Page {pageIdx + 1} of {pages.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          
          /* Force page setup — minimal margins suppress browser headers/footers */
          @page { margin: 0.3in 0.5in; size: letter portrait; }
          
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
