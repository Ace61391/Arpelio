import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';
import FingeringDiagram from '@/components/FingeringDiagram';

function InstrumentCard({ inst }) {
  const fingerings = getFingeringsForInstrument(inst.id);
  const beginner = fingerings.filter(f => f.pedagogy?.beginner_note);
  const samples = (beginner.length >= 2 ? beginner : fingerings).slice(0, 2);

  return (
    <Link href={`/instruments/${inst.id}`}
      className="bg-white border border-[#e5e8ed] rounded-card p-5 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group flex flex-col">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold ${inst.family === 'brass' ? 'bg-brass' : 'bg-woodwind'}`}>
          {inst.shortName.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#1a1d23] group-hover:text-accent transition-colors leading-tight">{inst.name}</h3>
          <span className="text-[11px] text-[#7a8294]">{inst.notes} notes</span>
        </div>
      </div>
      {samples.length > 0 && (
        <div className={`${['flute', 'piccolo'].includes(inst.id) ? 'flex flex-col gap-3' : 'flex gap-4'} justify-center items-center my-2 flex-1`}>
          {samples.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-[#1a1d23]">{f.note.display}</span>
              <FingeringDiagram instrumentId={inst.id} elements={f.primary.elements} size="sm" />
              <span className="text-[9px] text-[#b0b5c0] font-mono">{f.primary.text_notation}</span>
            </div>
          ))}
        </div>
      )}
      <span className="text-xs text-accent font-semibold mt-auto pt-2">View all fingerings →</span>
    </Link>
  );
}

export default function Home() {
  const woodwinds = INSTRUMENTS.filter(i => i.family === 'woodwind');
  const brass = INSTRUMENTS.filter(i => i.family === 'brass');

  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="px-8 pt-16 pb-14 text-center max-w-[1160px] mx-auto">
        <div className="inline-block bg-accent-light rounded-full px-4 py-1.5 text-sm font-semibold text-accent mb-6">
          14 instruments · 484 verified fingerings · 100% free
        </div>
        <h1 className="text-4xl md:text-[48px] font-extrabold leading-[1.12] tracking-tight text-[#1a1d23] max-w-[680px] mx-auto mb-5">
          Fingering charts and worksheets for every band instrument
        </h1>
        <p className="text-lg text-[#4a5060] leading-relaxed max-w-[540px] mx-auto mb-9">
          Browse interactive charts, generate print-ready reference PDFs, and create fingering quizzes. Free for every teacher.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/instruments" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3.5 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Browse Instruments
          </Link>
          <Link href="/builder" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-8 py-3.5 text-base font-semibold transition-all">
            Build a Worksheet
          </Link>
        </div>
      </section>

      {/* Instruments with sample charts */}
      <section className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Every instrument in the band room</h2>
            <p className="text-base text-[#4a5060] max-w-[500px] mx-auto">Click any instrument to see all fingerings. Each card shows sample charts so you can see the quality.</p>
          </div>

          <h3 className="text-xs font-bold text-[#7a8294] uppercase tracking-widest mb-3">Woodwinds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {woodwinds.map(inst => <InstrumentCard key={inst.id} inst={inst} />)}
          </div>

          <h3 className="text-xs font-bold text-[#7a8294] uppercase tracking-widest mb-3">Brass</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brass.map(inst => <InstrumentCard key={inst.id} inst={inst} />)}
          </div>
        </div>
      </section>

      {/* Two builders */}
      <section className="px-8 py-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Two tools, zero cost</h2>
            <p className="text-base text-[#4a5060]">Generate professional materials in seconds. No account needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/builder?mode=reference" className="bg-white border border-[#e5e8ed] rounded-2xl p-8 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-[#1a1d23] mb-2 group-hover:text-accent">Reference Chart Builder</h3>
              <p className="text-sm text-[#4a5060] leading-relaxed mb-4">Pick an instrument, select which notes and octaves to include, and download a print-ready PDF with filled diagrams.</p>
              <ul className="text-sm text-[#4a5060] space-y-1.5">
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> Choose notes by octave, scale, or custom</li>
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> Add school name, title, class period</li>
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> Print-ready black &amp; white PDF</li>
              </ul>
            </Link>
            <Link href="/builder?mode=quiz" className="bg-white border border-[#e5e8ed] rounded-2xl p-8 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="text-3xl mb-4">✏️</div>
              <h3 className="text-xl font-bold text-[#1a1d23] mb-2 group-hover:text-accent">Quiz Worksheet Builder</h3>
              <p className="text-sm text-[#4a5060] leading-relaxed mb-4">Create print quizzes your students complete by hand. Two quiz modes for different skill levels.</p>
              <ul className="text-sm text-[#4a5060] space-y-1.5">
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> <strong>Identify the note:</strong> see diagram, write the name</li>
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> <strong>Fill the chart:</strong> see note on staff, fill blank diagram</li>
                <li className="flex gap-2 items-start"><span className="text-accent">✓</span> Auto-generated answer key for teachers</li>
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Ready in 60 seconds</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Pick instrument', d: 'Select from 14 band instruments' },
              { n: '2', t: 'Choose notes', d: 'By octave, scale, or custom selection' },
              { n: '3', t: 'Download PDF', d: 'Reference chart or quiz worksheet' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-xl font-extrabold text-accent mx-auto mb-4">{s.n}</div>
                <h3 className="text-base font-bold text-[#1a1d23] mb-1">{s.t}</h3>
                <p className="text-sm text-[#4a5060]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-4 tracking-tight">Stop hand-drawing fingering charts</h2>
        <p className="text-base text-[#4a5060] mb-8 max-w-[500px] mx-auto">Every chart is verified against professional sources. Every PDF is print-ready. Every tool is free.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/instruments" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-10 py-4 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Browse All Instruments
          </Link>
          <Link href="/builder" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-10 py-4 text-base font-semibold transition-all">
            Build a Worksheet
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
