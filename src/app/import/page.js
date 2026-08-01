'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FingeringDiagram from '@/components/FingeringDiagram';
import InlineFingering from '@/components/InlineFingering';
import { INSTRUMENTS, getInstrument } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';

// Semitone offset from CONCERT pitch to WRITTEN pitch for each instrument.
const TRANSPOSE_TO_WRITTEN = {
  'recorder': 0, 'flute': 0, 'clarinet': 2, 'saxophone': 9,
  'bb-trumpet': 2, 'french-horn': 7, 'trombone': 0, 'euphonium': 0, 'bb-tuba': 0,
};

const NOTE_TO_PC = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 };
const PC_TO_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const PC_TO_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

function noteToAbs(step, alter, octave) {
  const base = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 }[step];
  return (octave + 1) * 12 + base + alter;
}
function absToNote(abs, preferFlat) {
  const pc = ((abs % 12) + 12) % 12;
  const octave = Math.floor(abs / 12) - 1;
  const name = preferFlat ? PC_TO_FLAT[pc] : PC_TO_SHARP[pc];
  return `${name}${octave}`;
}

export default function ImportPage() {
  const [instrumentId, setInstrumentId] = useState('flute');
  const [xmlContent, setXmlContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [osmdReady, setOsmdReady] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [stats, setStats] = useState({ total: 0, matched: 0 });
  const [overlayData, setOverlayData] = useState([]);

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const osmdRef = useRef(null);

  useEffect(() => {
    import('opensheetmusicdisplay').then(mod => {
      osmdRef.current = mod.OpenSheetMusicDisplay;
      setOsmdReady(true);
    }).catch(() => setError('Failed to load notation engine'));
  }, []);

  const instData = getInstrumentData(instrumentId);
  const instMeta = getInstrument(instrumentId);

  const buildFingeringLookup = useCallback(() => {
    const map = {};
    if (instData) instData.fingerings.forEach(f => { map[f.note.written] = f; });
    return map;
  }, [instData]);

  const lookupFingering = useCallback((writtenNote, map) => {
    if (map[writtenNote]) return map[writtenNote];
    const m = writtenNote.match(/^([A-G][#b]?)(\d+)$/);
    if (m) {
      const pc = NOTE_TO_PC[m[1]];
      const oct = parseInt(m[2]);
      const abs = (oct + 1) * 12 + pc;
      const sharpName = absToNote(abs, false);
      const flatName = absToNote(abs, true);
      if (map[sharpName]) return map[sharpName];
      if (map[flatName]) return map[flatName];
    }
    return null;
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); setLoading(true); setRendered(false); setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => { setXmlContent(evt.target.result); setLoading(false); };
    reader.onerror = () => { setError('Failed to read file'); setLoading(false); };
    reader.readAsText(file);
  }, []);

  useEffect(() => {
    if (!xmlContent || !osmdReady || !containerRef.current) return;
    let cancelled = false;
    setRendered(false);
    const container = containerRef.current;
    container.innerHTML = '';

    const OSMD = osmdRef.current;
    const osmd = new OSMD(container, {
      autoResize: false, backend: 'svg',
      drawTitle: false, drawSubtitle: false, drawComposer: false,
      drawLyricist: false, drawCredits: false, drawPartNames: false,
      drawMeasureNumbers: true,
      drawingParameters: 'default',
    });

    osmd.load(xmlContent).then(() => {
      if (cancelled) return;

      // --- Engraving-quality settings ---
      // Applied after load, before render. These tune spacing, sizing, and
      // layout so the notation looks professionally engraved.
      try {
        const r = osmd.EngravingRules;
        // Note spacing — give notes room to breathe (more than compact default)
        r.VoiceSpacingMultiplierVexflow = 1.3;   // horizontal note spacing factor
        r.VoiceSpacingAddendVexflow = 5.0;       // extra spacing addend
        // Leave generous room below the staff for our fingering diagrams
        r.MinSkyBottomDistBetweenSystems = 12;
        r.BetweenStaffDistance = 8;
        r.StaffDistance = 8;
        // Larger measure numbers, positioned cleanly
        r.MeasureNumberLabelHeight = 1.2;
        r.MeasureNumberLabelOffset = 2;
        // Consistent page margins
        r.PageLeftMargin = 1.5;
        r.PageRightMargin = 1.5;
        r.PageTopMargin = 1.0;
        // Slightly thicker staff lines read better on screen and print
        r.StaffLineWidth = 0.12;
        r.SheetTitleHeight = 0;
        // Render whole notes/rests cleanly, avoid collisions
        r.RenderMeasureNumbersOnlyAtSystemStart = false;
      } catch (e) {
        console.warn('Engraving rules partial:', e);
      }

      osmd.zoom = 1.0;
      osmd.render();

      const offset = TRANSPOSE_TO_WRITTEN[instrumentId] ?? 0;
      const map = buildFingeringLookup();
      const preferFlat = ['clarinet','bb-trumpet','french-horn','saxophone'].includes(instrumentId);
      let total = 0, matched = 0;

      // Convert an OSMD Pitch to a MIDI number (robustly, with fallbacks)
      const pitchToMidi = (pitch) => {
        try {
          if (typeof pitch.getHalfTone === 'function') {
            // getHalfTone: semitones from C0. MIDI C0 = 12.
            return pitch.getHalfTone() + 12;
          }
        } catch (e) {}
        // Fallback: FundamentalNote (semitone offset) + Octave
        const semi = pitch.fundamentalNote ?? pitch.FundamentalNote ?? 0;
        const oct = pitch.octave ?? pitch.Octave ?? 0;
        const acc = pitch.accidentalHalfTones ?? pitch.AccidentalHalfTones ?? 0;
        // OSMD NoteEnum semitone map fallback (C=0,D=2,E=4,F=5,G=7,A=9,B=11)
        const semiMap = [0,2,4,5,7,9,11];
        const s = (semi >= 0 && semi < 7) ? semiMap[semi] : semi;
        return (oct + 4) * 12 + s + acc + 12;
      };

      const midiToNote = (midi, preferFlat) => {
        const pc = ((midi % 12) + 12) % 12;
        const octave = Math.floor(midi / 12) - 1;
        const name = preferFlat ? PC_TO_FLAT[pc] : PC_TO_SHARP[pc];
        return `${name}${octave}`;
      };

      // Collect (pitch, svg element) pairs by walking the cursor through the score.
      const wrapper = wrapperRef.current;
      const wrapperRect = wrapper.getBoundingClientRect();
      const raw = [];
      let debugFirst = [];

      try {
        if (osmd.cursor) {
          osmd.cursor.reset();
          const it = osmd.cursor.Iterator;
          let guard = 0;
          while (it && !it.EndReached && guard < 10000) {
            guard++;
            let gnotes = [];
            try { gnotes = osmd.cursor.GNotesUnderCursor() || []; } catch (e) {}
            for (const gn of gnotes) {
              const sn = gn.sourceNote;
              if (!sn || sn.isRestFlag || (typeof sn.isRest === 'function' && sn.isRest())) continue;
              const pitch = sn.Pitch || sn.pitch;
              if (!pitch) continue;
              let el = null;
              try { el = gn.getSVGGElement(); } catch (e) {}
              if (!el) continue;
              const r = el.getBoundingClientRect();
              if (r.width === 0 && r.height === 0) continue;
              const concertMidi = pitchToMidi(pitch);
              const writtenMidi = concertMidi + offset;
              const writtenNote = midiToNote(writtenMidi, preferFlat);
              const xCenter = r.left - wrapperRect.left + wrapper.scrollLeft + r.width / 2;
              const noteTop = r.top - wrapperRect.top + wrapper.scrollTop;
              const noteBottom = noteTop + r.height;
              if (debugFirst.length < 3) {
                debugFirst.push({ concertMidi, writtenMidi, writtenNote, x: Math.round(xCenter) });
              }
              raw.push({ writtenNote, xCenter, noteTop, noteBottom });
            }
            it.moveToNext();
          }
          try { osmd.cursor.hide(); } catch (e) {}
        }
      } catch (err) {
        console.error('Cursor walk error:', err);
      }

      console.log('[import] notes found:', raw.length, 'first pitches:', debugFirst);

      // Cluster notes into rows by vertical band, so all diagrams in a system
      // share one clean baseline below the staff.
      const rowBaseline = {};
      raw.forEach(o => {
        const rowKey = Math.round(o.noteTop / 70);
        o.rowKey = rowKey;
        rowBaseline[rowKey] = Math.max(rowBaseline[rowKey] ?? 0, o.noteBottom);
      });

      const overlays = raw.map(o => {
        total++;
        const fingering = lookupFingering(o.writtenNote, map);
        if (fingering) matched++;
        return {
          x: o.xCenter,
          y: rowBaseline[o.rowKey] + 12,
          writtenNote: o.writtenNote,
          fingering,
        };
      });

      if (cancelled) return;
      setStats({ total, matched });
      setOverlayData(overlays);
      setRendered(true);
    }).catch(err => {
      console.error('OSMD error:', err);
      if (!cancelled) setError('Could not render this file. Make sure it is valid, uncompressed MusicXML (.xml or .musicxml).');
    });

    return () => { cancelled = true; };
  }, [xmlContent, osmdReady, instrumentId, buildFingeringLookup, lookupFingering]);

  const handleExport = () => window.print();

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">Score Import</h1>
          <p className="text-sm text-[#4a5060]">
            Upload a concert-pitch score. We transpose it for your instrument and print fingering diagrams under every note — ready to hand to students.
          </p>
        </div>

        <div className="bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#7a8294] mb-1">Instrument (we transpose from concert pitch)</label>
              <select value={instrumentId} onChange={e => setInstrumentId(e.target.value)}
                className="w-full border border-[#e5e8ed] rounded-lg px-3 py-2 text-sm text-[#1a1d23] bg-white">
                {INSTRUMENTS.filter(i => !i.hidden).map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <label className="flex-1 border-2 border-dashed border-[#d0d4dc] rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent-light/30 transition-all">
              <input type="file" accept=".xml,.musicxml" onChange={handleFileUpload} className="hidden" />
              <div className="text-sm font-semibold text-[#4a5060]">{fileName || 'Click to upload a MusicXML file'}</div>
              <div className="text-xs text-[#b0b5c0] mt-1">Concert-pitch .xml or .musicxml from MuseScore, Finale, Sibelius, Flat, Noteflight</div>
            </label>
            {rendered && (
              <button onClick={handleExport}
                className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                Print / Export PDF
              </button>
            )}
          </div>
          {error && <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</div>}
          {loading && <div className="mt-3 text-sm text-[#7a8294]">Loading…</div>}
          {rendered && (
            <div className="mt-3 text-xs text-[#7a8294]">
              {instMeta?.name} · {stats.matched}/{stats.total} notes matched
              {stats.total > stats.matched && <span className="text-[#b0b5c0]"> · {stats.total - stats.matched} out of range</span>}
            </div>
          )}
        </div>

        {xmlContent && (
          <div className="bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 print:border-none print:p-0 print:rounded-none">
            <div className="flex items-baseline justify-between mb-4 print:mb-6">
              <h2 className="text-lg font-bold text-[#1a1d23]">{fileName.replace(/\.(xml|musicxml)$/i,'')}</h2>
              <span className="text-xs text-[#b0b5c0]">{instMeta?.name} — fingerings</span>
            </div>
            <div ref={wrapperRef} className="relative overflow-x-auto" style={{ paddingBottom: 150 }}>
              <div ref={containerRef} />
              {rendered && overlayData.map((o, i) => (
                <div key={i} className="absolute flex flex-col items-center"
                  style={{ left: o.x - 12, top: o.y, width: 24 }}>
                  {o.fingering ? (
                    <>
                      <div className="text-[9px] font-mono font-semibold text-[#4a5060] mb-0.5 leading-none">{o.writtenNote.replace(/\d/,'')}</div>
                      <InlineFingering instrumentId={instrumentId} elements={o.fingering.primary.elements} width={18} />
                    </>
                  ) : (
                    <div className="text-[8px] text-[#c0392b] text-center leading-tight mt-1">out of<br/>range</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!xmlContent && !loading && (
          <div className="text-center py-20 text-[#7a8294]">
            <div className="text-4xl mb-4">🎼</div>
            <p className="text-lg mb-2">Upload a concert-pitch score to get started</p>
            <p className="text-sm text-[#b0b5c0]">We handle the transposition — you get a print-ready part with fingerings under each note.</p>
          </div>
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body { background: white !important; }
          @page { margin: 0.5in; size: letter portrait; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
        }
      `}</style>
    </>
  );
}
