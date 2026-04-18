'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FingeringDiagram from '@/components/FingeringDiagram';
import { INSTRUMENTS, getInstrument } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';

// Convert OSMD pitch info to our note key format (e.g. "C#4", "Bb3")
function pitchToNoteKey(step, alter, octave) {
  const SHARP_MAP = { 1: '#', 2: '##' };
  const FLAT_MAP = { '-1': 'b', '-2': 'bb' };
  let suffix = '';
  if (alter > 0) suffix = SHARP_MAP[alter] || '#';
  if (alter < 0) suffix = FLAT_MAP[String(alter)] || 'b';
  return `${step}${suffix}${octave}`;
}

// Enharmonic equivalents for lookup fallback
function getEnharmonics(noteKey) {
  const ENHARMONICS = {
    'C#': 'Db', 'Db': 'C#', 'D#': 'Eb', 'Eb': 'D#',
    'F#': 'Gb', 'Gb': 'F#', 'G#': 'Ab', 'Ab': 'G#',
    'A#': 'Bb', 'Bb': 'A#', 'B#': 'C', 'Cb': 'B',
    'E#': 'F', 'Fb': 'E',
  };
  const match = noteKey.match(/^([A-G][#b]*)(\d+)$/);
  if (!match) return [];
  const [, name, oct] = match;
  const alt = ENHARMONICS[name];
  if (!alt) return [];
  // Handle octave shift for B#/Cb
  let altOct = parseInt(oct);
  if (name === 'B#') altOct += 1;
  if (name === 'Cb') altOct -= 1;
  return [`${alt}${altOct}`];
}

export default function ViewerPage() {
  const [instrumentId, setInstrumentId] = useState('flute');
  const [xmlContent, setXmlContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState([]);
  const [maxMeasures, setMaxMeasures] = useState(4);
  const [error, setError] = useState('');
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);

  const instMeta = getInstrument(instrumentId);
  const instData = getInstrumentData(instrumentId);

  // Build fingering lookup map
  const fingeringMap = {};
  if (instData) {
    instData.fingerings.forEach(f => {
      fingeringMap[f.note.written] = f;
    });
  }

  // Look up fingering with enharmonic fallback
  function lookupFingering(noteKey) {
    if (fingeringMap[noteKey]) return fingeringMap[noteKey];
    const alts = getEnharmonics(noteKey);
    for (const alt of alts) {
      if (fingeringMap[alt]) return fingeringMap[alt];
    }
    return null;
  }

  // Parse MusicXML to extract notes
  function parseXml(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      setError('Invalid XML file. Please upload a valid MusicXML file.');
      return [];
    }

    const parts = doc.querySelectorAll('part');
    if (parts.length === 0) {
      setError('No parts found in this MusicXML file.');
      return [];
    }

    // Use first part
    const part = parts[0];
    const measures = part.querySelectorAll('measure');
    const extracted = [];
    let measureCount = 0;

    for (const measure of measures) {
      if (measureCount >= maxMeasures) break;
      measureCount++;
      const measureNum = measure.getAttribute('number') || measureCount;

      const noteElements = measure.querySelectorAll('note');
      for (const noteEl of noteElements) {
        // Skip rests
        if (noteEl.querySelector('rest')) {
          extracted.push({ type: 'rest', measure: measureNum });
          continue;
        }

        // Skip chord notes (secondary notes in a chord) for now
        if (noteEl.querySelector('chord')) continue;

        const pitch = noteEl.querySelector('pitch');
        if (!pitch) continue;

        const step = pitch.querySelector('step')?.textContent || 'C';
        const alterEl = pitch.querySelector('alter');
        const alter = alterEl ? parseInt(alterEl.textContent) : 0;
        const octave = pitch.querySelector('octave')?.textContent || '4';

        const noteKey = pitchToNoteKey(step, alter, parseInt(octave));
        const type = noteEl.querySelector('type')?.textContent || 'quarter';

        extracted.push({
          type: 'note',
          noteKey,
          step,
          alter,
          octave: parseInt(octave),
          duration: type,
          measure: measureNum,
        });
      }
    }

    setError('');
    return extracted;
  }

  // Handle file upload
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target.result;
      setXmlContent(content);
      const parsed = parseXml(content);
      setNotes(parsed);
    };
    reader.readAsText(file);
  }

  // Render OSMD
  const renderOsmd = useCallback(async () => {
    if (!xmlContent || !osmdContainerRef.current) return;

    try {
      const { OpenSheetMusicDisplay } = await import('opensheetmusicdisplay');

      if (osmdRef.current) {
        osmdRef.current.clear();
      }

      const osmd = new OpenSheetMusicDisplay(osmdContainerRef.current, {
        backend: 'svg',
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false,
        drawCredits: false,
        drawPartNames: false,
        drawPartAbbreviations: false,
        drawMeasureNumbers: false,
        autoResize: true,
      });

      await osmd.load(xmlContent);

      // Limit to maxMeasures
      if (osmd.Sheet && osmd.Sheet.SourceMeasures) {
        const totalMeasures = osmd.Sheet.SourceMeasures.length;
        if (totalMeasures > maxMeasures) {
          osmd.setOptions({
            drawFromMeasureNumber: 1,
            drawUpToMeasureNumber: maxMeasures,
          });
        }
      }

      osmd.render();
      osmdRef.current = osmd;
    } catch (err) {
      console.error('OSMD render error:', err);
      setError('Error rendering notation. The file may not be a valid MusicXML file.');
    }
  }, [xmlContent, maxMeasures]);

  useEffect(() => {
    if (xmlContent) {
      renderOsmd();
    }
  }, [xmlContent, renderOsmd]);

  // Re-parse when maxMeasures changes
  useEffect(() => {
    if (xmlContent) {
      const parsed = parseXml(xmlContent);
      setNotes(parsed);
    }
  }, [maxMeasures]);

  const noteItems = notes.filter(n => n.type === 'note');

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">
          Sheet Music Fingering Viewer
        </h1>
        <p className="text-sm text-[#4a5060] mb-8">
          Upload a MusicXML file and see fingering diagrams for every note. Works with exports from MuseScore, Finale, Sibelius, Noteflight, and Flat.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Instrument selector */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#7a8294] mb-1.5">Instrument</label>
            <select value={instrumentId} onChange={e => setInstrumentId(e.target.value)}
              className="w-full border border-[#e5e8ed] rounded-lg px-4 py-2.5 text-sm text-[#1a1d23] bg-white focus:border-accent focus:outline-none">
              {INSTRUMENTS.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>

          {/* Measures */}
          <div>
            <label className="block text-xs font-semibold text-[#7a8294] mb-1.5">Measures</label>
            <select value={maxMeasures} onChange={e => setMaxMeasures(parseInt(e.target.value))}
              className="border border-[#e5e8ed] rounded-lg px-4 py-2.5 text-sm text-[#1a1d23] bg-white focus:border-accent focus:outline-none">
              {[2, 4, 8, 16].map(n => (
                <option key={n} value={n}>{n} measures</option>
              ))}
            </select>
          </div>

          {/* File upload */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#7a8294] mb-1.5">MusicXML File</label>
            <label className="flex items-center gap-2 border border-[#e5e8ed] rounded-lg px-4 py-2.5 text-sm cursor-pointer hover:border-accent transition-colors bg-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12V3M4 7l4-4 4 4"/>
                <path d="M2 14h12"/>
              </svg>
              <span className="text-[#4a5060]">{fileName || 'Choose file...'}</span>
              <input type="file" accept=".xml,.musicxml,.mxl" onChange={handleFile} className="hidden" />
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Notation display */}
        {xmlContent && (
          <div className="border border-[#e5e8ed] rounded-2xl p-6 bg-white mb-8">
            <h2 className="text-sm font-bold text-[#7a8294] mb-4">Notation</h2>
            <div ref={osmdContainerRef} className="overflow-x-auto" />
          </div>
        )}

        {/* Fingering diagrams grid */}
        {noteItems.length > 0 && (
          <div className="border border-[#e5e8ed] rounded-2xl p-6 bg-white">
            <h2 className="text-sm font-bold text-[#7a8294] mb-4">
              Fingerings — {instMeta?.name || instrumentId} ({noteItems.length} notes)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {noteItems.map((n, idx) => {
                const fingering = lookupFingering(n.noteKey);
                const found = !!fingering;

                return (
                  <div key={idx}
                    className={`border rounded-xl p-3 flex flex-col items-center gap-2 ${
                      found ? 'border-[#e5e8ed]' : 'border-red-200 bg-red-50'
                    }`}>
                    <span className="text-xs text-[#b0b5c0] font-mono">{idx + 1}</span>
                    <div className="text-lg font-bold text-[#1a1d23]">
                      {n.noteKey.replace('#', '♯').replace('b', '♭')}
                    </div>
                    {found ? (
                      <>
                        <FingeringDiagram instrumentId={instrumentId} elements={fingering.primary.elements} size="sm" />
                        <div className="font-mono text-xs text-[#4a5060] text-center">{fingering.primary.text_notation}</div>
                      </>
                    ) : (
                      <div className="text-xs text-red-500 text-center py-2">
                        Not in range
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!xmlContent && (
          <div className="text-center py-20 text-[#7a8294]">
            <div className="text-5xl mb-4">🎵</div>
            <p className="text-lg mb-2">Upload a MusicXML file to get started</p>
            <p className="text-sm">Export from MuseScore, Finale, Sibelius, Noteflight, or Flat</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
