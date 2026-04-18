'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FingeringDiagram from '@/components/FingeringDiagram';
import { INSTRUMENTS } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';

export default function ImportPage() {
  const [xmlContent, setXmlContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [instrumentId, setInstrumentId] = useState('flute');
  const [notes, setNotes] = useState([]);
  const [maxMeasures, setMaxMeasures] = useState(4);
  const [osmdReady, setOsmdReady] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);

  // Load OSMD dynamically (it's a large library, only load when needed)
  useEffect(() => {
    import('opensheetmusicdisplay').then(mod => {
      osmdRef.current = mod.OpenSheetMusicDisplay;
      setOsmdReady(true);
    }).catch(err => {
      console.error('Failed to load OSMD:', err);
      setError('Failed to load notation engine');
    });
  }, []);

  // Parse MusicXML to extract notes
  const parseNotes = useCallback((xmlString, measures) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');

      // Check for parse errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        setError('Invalid XML file');
        return [];
      }

      const measureEls = doc.querySelectorAll('measure');
      const extracted = [];
      const limit = Math.min(measureEls.length, measures);

      for (let m = 0; m < limit; m++) {
        const noteEls = measureEls[m].querySelectorAll('note');
        for (const noteEl of noteEls) {
          // Skip rests
          if (noteEl.querySelector('rest')) {
            extracted.push({ type: 'rest', measure: m + 1 });
            continue;
          }

          const pitchEl = noteEl.querySelector('pitch');
          if (!pitchEl) continue;

          // Skip notes that are tied (continuation) — only show the first
          const tieEl = noteEl.querySelector('tie');
          if (tieEl && tieEl.getAttribute('type') === 'stop') continue;

          const step = pitchEl.querySelector('step')?.textContent || '';
          const octave = pitchEl.querySelector('octave')?.textContent || '';
          const alterEl = pitchEl.querySelector('alter');
          const alter = alterEl ? parseInt(alterEl.textContent) : 0;

          let noteName = step;
          if (alter === 1) noteName += '#';
          else if (alter === -1) noteName += 'b';
          else if (alter === 2) noteName += '##';
          else if (alter === -2) noteName += 'bb';

          const written = noteName + octave;
          extracted.push({ type: 'note', written, step, octave: parseInt(octave), alter, measure: m + 1 });
        }
      }

      return extracted;
    } catch (e) {
      setError('Error parsing MusicXML: ' + e.message);
      return [];
    }
  }, []);

  // Look up fingering for a note
  const lookupFingering = useCallback((written, instId) => {
    const data = getInstrumentData(instId);
    if (!data) return null;

    // Direct match
    const match = data.fingerings.find(f => f.note.written === written);
    if (match) return match;

    // Try enharmonic equivalents
    const enharmonics = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
      'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
    };
    // Extract note name and octave
    const noteMatch = written.match(/^([A-G][#b]?)(\d+)$/);
    if (noteMatch) {
      const [, name, oct] = noteMatch;
      const altName = enharmonics[name];
      if (altName) {
        const altWritten = altName + oct;
        const altMatch = data.fingerings.find(f => f.note.written === altWritten);
        if (altMatch) return altMatch;
      }
    }

    return null;
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setXmlContent(content);
      const parsed = parseNotes(content, maxMeasures);
      setNotes(parsed);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsText(file);
  }, [maxMeasures, parseNotes]);

  // Render OSMD when we have XML content
  useEffect(() => {
    if (!xmlContent || !osmdReady || !osmdContainerRef.current) return;

    const container = osmdContainerRef.current;
    container.innerHTML = '';

    const OSMD = osmdRef.current;
    const osmd = new OSMD(container, {
      autoResize: true,
      drawTitle: false,
      drawSubtitle: false,
      drawComposer: false,
      drawCredits: false,
      drawPartNames: false,
      drawPartAbbreviations: false,
      drawMeasureNumbers: true,
      drawingParameters: 'compact',
    });

    osmd.load(xmlContent).then(() => {
      // Limit to N measures
      if (osmd.Sheet && osmd.Sheet.SourceMeasures) {
        const total = osmd.Sheet.SourceMeasures.length;
        if (total > maxMeasures) {
          osmd.setOptions({ drawFromMeasureNumber: 1, drawUpToMeasureNumber: maxMeasures });
        }
      }
      osmd.render();
    }).catch(err => {
      console.error('OSMD render error:', err);
      setError('Could not render this MusicXML file. It may be in an unsupported format.');
    });
  }, [xmlContent, osmdReady, maxMeasures]);

  // Re-parse when maxMeasures changes
  useEffect(() => {
    if (xmlContent) {
      const parsed = parseNotes(xmlContent, maxMeasures);
      setNotes(parsed);
    }
  }, [maxMeasures, xmlContent, parseNotes]);

  // Export / Print
  const handleExport = () => {
    window.print();
  };

  const noteItems = notes.filter(n => n.type === 'note');
  const matchedNotes = noteItems.map(n => ({
    ...n,
    fingering: lookupFingering(n.written, instrumentId),
  }));

  const matchCount = matchedNotes.filter(n => n.fingering).length;

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">
            Score Import
          </h1>
          <p className="text-sm text-[#4a5060]">
            Upload a MusicXML file and get fingering diagrams for every note. Export the result as a PDF study guide.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Instrument picker */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#7a8294] mb-1">Instrument</label>
              <select
                value={instrumentId}
                onChange={e => setInstrumentId(e.target.value)}
                className="w-full border border-[#e5e8ed] rounded-lg px-3 py-2 text-sm text-[#1a1d23] bg-white"
              >
                {INSTRUMENTS.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            {/* Measures */}
            <div>
              <label className="block text-xs font-semibold text-[#7a8294] mb-1">Measures</label>
              <select
                value={maxMeasures}
                onChange={e => setMaxMeasures(parseInt(e.target.value))}
                className="border border-[#e5e8ed] rounded-lg px-3 py-2 text-sm text-[#1a1d23] bg-white"
              >
                {[2, 4, 8, 16].map(n => (
                  <option key={n} value={n}>{n} measures</option>
                ))}
              </select>
            </div>
          </div>

          {/* File upload */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <label className="flex-1 border-2 border-dashed border-[#d0d4dc] rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent-light/30 transition-all">
              <input
                type="file"
                accept=".xml,.musicxml,.mxl"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-sm font-semibold text-[#4a5060]">
                {fileName ? fileName : 'Click to upload MusicXML file'}
              </div>
              <div className="text-xs text-[#b0b5c0] mt-1">
                .xml or .musicxml files from MuseScore, Finale, Sibelius, Flat, Noteflight
              </div>
            </label>

            {noteItems.length > 0 && (
              <button
                onClick={handleExport}
                className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Export PDF
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</div>
          )}

          {loading && (
            <div className="mt-3 text-sm text-[#7a8294]">Loading score...</div>
          )}
        </div>

        {/* Score display */}
        {xmlContent && (
          <div className="bg-white border border-[#e5e8ed] rounded-2xl p-6 mb-6 print:border-none print:p-0 print:rounded-none">
            <h2 className="text-lg font-bold text-[#1a1d23] mb-4 print:text-center">
              {fileName.replace(/\.(xml|musicxml|mxl)$/i, '')}
            </h2>

            {/* OSMD notation render */}
            <div ref={osmdContainerRef} className="mb-6 overflow-x-auto" />

            {/* Stats */}
            {noteItems.length > 0 && (
              <div className="text-xs text-[#b0b5c0] mb-4 print:hidden">
                {noteItems.length} notes found · {matchCount} fingerings matched · {noteItems.length - matchCount} not in range
              </div>
            )}

            {/* Fingering diagrams grid */}
            {matchedNotes.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-[#4a5060] mb-3">
                  Fingerings — {INSTRUMENTS.find(i => i.id === instrumentId)?.name}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 print:grid-cols-8">
                  {matchedNotes.map((n, i) => (
                    <div key={i} className="border border-[#e5e8ed] rounded-lg p-2 flex flex-col items-center gap-1 print:border-gray-300">
                      <span className="text-xs font-bold text-[#1a1d23]">{n.written}</span>
                      {n.fingering ? (
                        <>
                          <FingeringDiagram
                            instrumentId={instrumentId}
                            elements={n.fingering.primary.elements}
                            size="sm"
                          />
                          <span className="font-mono text-[9px] text-[#b0b5c0]">
                            {n.fingering.primary.text_notation}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-[#b0b5c0] italic py-4">
                          Out of range
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty state */}
        {!xmlContent && !loading && (
          <div className="text-center py-20 text-[#7a8294]">
            <div className="text-4xl mb-4">🎵</div>
            <p className="text-lg mb-2">Upload a MusicXML file to get started</p>
            <p className="text-sm text-[#b0b5c0]">
              Export from MuseScore, Finale, Sibelius, Flat.io, or Noteflight as MusicXML
            </p>
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
          .print\\:text-center { text-align: center !important; }
          .print\\:grid-cols-8 { grid-template-columns: repeat(8, 1fr) !important; }
          .print\\:border-gray-300 { border: 1px solid #ccc !important; }
          svg { max-width: 100% !important; height: auto !important; }
        }
      `}</style>
    </>
  );
}
