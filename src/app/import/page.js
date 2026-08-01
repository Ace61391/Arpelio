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
  const [printMode, setPrintMode] = useState(false);

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const osmdRef = useRef(null);
  const osmdModRef = useRef(null);

  useEffect(() => {
    import('opensheetmusicdisplay').then(mod => {
      osmdRef.current = mod.OpenSheetMusicDisplay;
      osmdModRef.current = mod;
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
      autoResize: true, backend: 'svg',
      drawTitle: false, drawSubtitle: false, drawComposer: false,
      drawLyricist: false, drawCredits: false, drawPartNames: false,
      drawMeasureNumbers: true,
      drawingParameters: 'default',
    });
    // Enable native, key-aware transposition
    try {
      if (osmdModRef.current?.TransposeCalculator) {
        osmd.TransposeCalculator = new osmdModRef.current.TransposeCalculator();
      }
    } catch (e) { console.warn('TransposeCalculator unavailable:', e); }

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

      // Transpose the whole sheet for this instrument (concert -> written).
      // OSMD handles key signature + enharmonic spelling correctly.
      const offset = TRANSPOSE_TO_WRITTEN[instrumentId] ?? 0;
      try {
        if (offset !== 0 && osmd.Sheet && osmd.TransposeCalculator) {
          osmd.Sheet.Transpose = offset;
          osmd.updateGraphic();
        }
      } catch (e) { console.warn('Transpose failed:', e); }

      osmd.zoom = 1.0;
      osmd.render();

      const map = buildFingeringLookup();
      let total = 0, matched = 0;

      // Spell an OSMD pitch using its natural letter + accidental, exactly as
      // rendered (respects the transposed key signature). Returns e.g. "Eb5".
      const LETTER = { 0:'C', 2:'D', 4:'E', 5:'F', 7:'G', 9:'A', 11:'B' };
      const spellPitch = (pitch) => {
        const fund = pitch.FundamentalNote ?? pitch.fundamentalNote ?? 0;
        const letter = LETTER[fund] ?? 'C';
        const alter = pitch.AccidentalHalfTones ?? pitch.accidentalHalfTones ?? 0;
        const octave = (pitch.Octave ?? pitch.octave ?? 0) + 3; // OSMD octave -> scientific
        let acc = '';
        if (alter > 0) acc = '#'.repeat(alter);
        else if (alter < 0) acc = 'b'.repeat(-alter);
        return `${letter}${acc}${octave}`;
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
              // Use the transposed pitch when present, else the (untransposed) pitch
              const pitch = sn.TransposedPitch || sn.transposedPitch || sn.Pitch || sn.pitch;
              if (!pitch) continue;
              let el = null;
              try { el = gn.getSVGGElement(); } catch (e) {}
              if (!el) continue;
              const r = el.getBoundingClientRect();
              if (r.width === 0 && r.height === 0) continue;
              const writtenNote = spellPitch(pitch);
              const xCenter = r.left - wrapperRect.left + wrapper.scrollLeft + r.width / 2;
              const noteTop = r.top - wrapperRect.top + wrapper.scrollTop;
              const noteBottom = noteTop + r.height;
              if (debugFirst.length < 4) {
                debugFirst.push({ writtenNote });
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

      // Group notes into staff-line "systems" by detecting large vertical gaps.
      // All notes in one system share ONE baseline, so their columns form a
      // uniform row (higher/lower pitches don't stagger the fingerings).
      const sortedBottoms = [...new Set(raw.map(o => Math.round(o.noteBottom)))].sort((a, b) => a - b);
      const systems = []; // each: { minTop, maxBottom }
      let cur = null;
      raw.slice().sort((a, b) => a.noteBottom - b.noteBottom).forEach(o => {
        if (!cur || o.noteBottom - cur.maxBottom > 55) {
          cur = { maxBottom: o.noteBottom, notes: [o] };
          systems.push(cur);
        } else {
          cur.maxBottom = Math.max(cur.maxBottom, o.noteBottom);
          cur.notes.push(o);
        }
      });
      // Assign each note the baseline of the system it belongs to
      const baselineFor = (o) => {
        for (const sys of systems) {
          if (o.noteBottom <= sys.maxBottom + 1) return sys.maxBottom;
        }
        return systems.length ? systems[systems.length - 1].maxBottom : o.noteBottom;
      };

      const overlays = raw.map(o => {
        total++;
        const fingering = lookupFingering(o.writtenNote, map);
        if (fingering) matched++;
        return {
          x: o.xCenter,
          y: baselineFor(o) + 12,
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

  const handleExport = () => setPrintMode(true);

  useEffect(() => {
    if (!printMode) return;
    const t = setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 150);
    return () => clearTimeout(t);
  }, [printMode]);

  return (
    <>
      {!printMode && <Nav />}
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">Score Import</h1>
          <p className="text-sm text-[#4a5060]">
            Upload a concert-pitch score. We transpose it for your instrument and print fingering diagrams under every note — ready to hand to students.
          </p>
        </div>

        {!printMode && (
        <div className="no-print bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 print:hidden">
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
        )}

        {xmlContent && (
          <div className="print-page bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 mx-auto" style={{ maxWidth: 720 }}>
            <div className="flex items-baseline justify-between mb-4 print:mb-6">
              <h2 className="text-lg font-bold text-[#1a1d23]">{fileName.replace(/\.(xml|musicxml)$/i,'')}</h2>
              <span className="text-xs text-[#b0b5c0]">{instMeta?.name} — fingerings</span>
            </div>
            <div ref={wrapperRef} className="relative overflow-x-auto" style={{ paddingBottom: 120 }}>
              <div ref={containerRef} style={{ width: 672 }} />
              {rendered && overlayData.map((o, i) => (
                <div key={i} className="absolute flex flex-col items-center"
                  style={{ left: o.x - 12, top: o.y, width: 24 }}>
                  {o.fingering ? (
                    <>
                      <div className="text-[10px] font-bold text-[#3a3f4a] mb-1 leading-none tracking-tight">{o.writtenNote.replace(/\d/,'')}</div>
                      <InlineFingering instrumentId={instrumentId} elements={o.fingering.primary.elements} width={16} />
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
      {!printMode && <Footer />}
    </>
  );
}
