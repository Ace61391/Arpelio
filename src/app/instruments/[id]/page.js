'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StaffNote from '@/components/StaffNote';
import FingeringDiagram from '@/components/FingeringDiagram';
import KeyReference from '@/components/KeyReference';
import { getInstrument } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';

const OCTAVE_FILTERS = [
  { id: 'all', label: 'All Notes' },
  { id: 'beginner', label: 'Beginner' },
  { id: '1', label: '1st Octave' },
  { id: '2', label: '2nd Octave' },
  { id: '3', label: '3rd Octave' },
];

export default function InstrumentPage() {
  const params = useParams();
  const id = params.id;
  const instMeta = getInstrument(id);
  const instData = getInstrumentData(id);
  const [octaveFilter, setOctaveFilter] = useState('beginner');
  const [selectedNote, setSelectedNote] = useState(null);
  const [holeStyle, setHoleStyle] = useState('simple');

  const fingerings = instData?.fingerings || [];

  const availableOctaves = useMemo(() => {
    const octaves = new Set();
    fingerings.forEach(f => {
      const o = (f.octave || f.register || '').toLowerCase();
      if (o.includes('1st') || o.includes('chalumeau') || o.includes('low')) octaves.add('1');
      if (o.includes('2nd') || o.includes('clarion') || o.includes('mid') || o.includes('palm')) octaves.add('2');
      if (o.includes('3rd') || o.includes('altissimo') || o.includes('high') || o.includes('upper')) octaves.add('3');
    });
    return octaves;
  }, [fingerings]);

  const filteredNotes = useMemo(() => {
    return fingerings.filter(f => {
      if (octaveFilter === 'all') return true;
      if (octaveFilter === 'beginner') return f.pedagogy?.beginner_note;
      const o = (f.octave || f.register || '').toLowerCase();
      if (octaveFilter === '1') return o.includes('1st') || o.includes('chalumeau') || o.includes('low');
      if (octaveFilter === '2') return o.includes('2nd') || o.includes('clarion') || o.includes('mid') || o.includes('palm');
      if (octaveFilter === '3') return o.includes('3rd') || o.includes('altissimo') || o.includes('high') || o.includes('upper');
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

  const clef = instMeta.clef;

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#7a8294] mb-6">
          <Link href="/instruments" className="hover:text-accent transition-colors">Instruments</Link>
          <span>/</span>
          <span className="text-[#1a1d23] font-medium">{instMeta.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-1">{instMeta.name} Fingering Chart</h1>
            <p className="text-sm text-[#4a5060]">{instMeta.description} · {instMeta.notes} notes</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/builder?instrument=${id}&mode=reference`}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
              Build a printable chart
            </Link>
            <Link href={`/builder?instrument=${id}&mode=identify`}
              className="text-xs font-bold px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent-light transition-colors">
              Create a quiz
            </Link>
          </div>
        </div>

        <KeyReference instrumentId={id} />

        <div className="flex flex-wrap items-center gap-1.5 mb-8">
          {OCTAVE_FILTERS.filter(f => f.id === 'all' || f.id === 'beginner' || availableOctaves.has(f.id)).map(f => (
            <button key={f.id} onClick={() => setOctaveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap ${
                octaveFilter === f.id
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-[#e5e8ed] bg-white text-[#7a8294] hover:border-[#d0d4dc]'
              }`}>
              {f.label}
            </button>
          ))}
          <span className="text-xs text-[#6b7385] self-center ml-2">{filteredNotes.length} notes</span>

          {id === 'recorder' && (
            <div className="flex items-center gap-2 ml-auto border border-[#e5e8ed] rounded-full px-3 py-1">
              <button onClick={() => setHoleStyle('simple')}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${holeStyle === 'simple' ? 'bg-accent text-white' : 'text-[#7a8294]'}`}>
                Simple
              </button>
              <button onClick={() => setHoleStyle('baroque')}
                className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${holeStyle === 'baroque' ? 'bg-accent text-white' : 'text-[#7a8294]'}`}>
                Baroque
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNotes.map(f => {
            const isSelected = selectedNote === f.note.written;
            const altCount = (f.alternates || []).length;
            return (
              <div key={f.note.written}
                onClick={() => setSelectedNote(isSelected ? null : f.note.written)}
                className={`bg-white border rounded-card p-4 flex flex-col items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 ${
                  isSelected ? 'border-accent shadow-md' : 'border-[#e5e8ed] hover:border-[#d0d4dc]'
                }`}>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-[#1a1d23]">{f.note.display}</div>
                  {altCount > 0 && (
                    <span className="text-[10px] font-semibold text-accent bg-accent-light px-1.5 py-0.5 rounded-full">
                      +{altCount} alt
                    </span>
                  )}
                </div>
                <StaffNote note={f.note.written} clef={clef} width={52} />
                <FingeringDiagram instrumentId={id} elements={f.primary.elements} size="md" holeStyle={holeStyle} />
                <div className="font-mono text-sm text-[#4a5060] text-center">{f.primary.text_notation}</div>

                {isSelected && altCount > 0 && (
                  <div className="w-full mt-2 pt-3 border-t border-[#e5e8ed]">
                    <div className="text-xs font-semibold text-[#7a8294] mb-2 text-center">Alternate fingerings</div>
                    <div className="flex flex-col gap-3">
                      {f.alternates.map((alt, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <FingeringDiagram instrumentId={id} elements={alt.elements} size="md" holeStyle={holeStyle} />
                          <div className="font-mono text-xs text-[#4a5060]">{alt.text_notation}</div>
                          {alt.description && (
                            <div className="text-[10px] text-[#6b7385] text-center italic">{alt.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Every note in plain text: readable without the filters, and by search engines and screen readers */}
        <section className="mt-14" aria-labelledby="all-notes">
          <h2 id="all-notes" className="text-2xl font-extrabold text-[#1a1d23] tracking-tight mb-2">
            All {fingerings.length} {instMeta.shortName.toLowerCase()} fingerings
          </h2>
          <p className="text-sm text-[#4a5060] mb-5">
            The complete written range, lowest to highest, with alternates and teaching notes.
          </p>
          <div className="overflow-x-auto border border-[#e5e8ed] rounded-card bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f8f9fb] text-xs uppercase tracking-wide text-[#7a8294]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Note</th>
                  <th scope="col" className="px-4 py-3 font-bold">Fingering</th>
                  <th scope="col" className="px-4 py-3 font-bold">Alternates</th>
                  <th scope="col" className="px-4 py-3 font-bold">Teaching notes</th>
                </tr>
              </thead>
              <tbody>
                {fingerings.map(f => {
                  const notes = [...(f.pedagogy?.practice_tips || []), ...(f.pedagogy?.common_errors || []).map(e => `Common error: ${e}`)];
                  return (
                    <tr key={f.note.written} className="border-t border-[#e5e8ed] align-top">
                      <th scope="row" className="px-4 py-3 font-bold text-[#1a1d23] whitespace-nowrap">
                        {f.note.display_with_octave || f.note.written}
                      </th>
                      <td className="px-4 py-3 font-mono text-[#1a1d23] whitespace-nowrap">{f.primary.text_notation}</td>
                      <td className="px-4 py-3 font-mono text-[#4a5060]">
                        {(f.alternates || []).map(a => a.text_notation).join(' · ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#4a5060] min-w-[220px]">{notes.join(' ') || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {filteredNotes.length === 0 && (
          <div className="text-center py-16 text-[#7a8294]">
            <p className="text-lg mb-2">No notes match this filter</p>
            <button onClick={() => setOctaveFilter('all')} className="text-accent font-semibold">Show all notes</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
