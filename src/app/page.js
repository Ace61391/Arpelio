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
  const isHorizontal = inst.id === 'flute' || inst.id === 'piccolo' || inst.id === 'trombone';

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
        <div className={`${isHorizontal ? 'flex flex-col gap-3' : 'flex gap-4 justify-center'} items-center my-2 flex-1`}>
          {samples.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-[#1a1d23]">{f.note.display}</span>
              <div className={isHorizontal ? 'overflow-x-auto max-w-full' : ''}>
                <FingeringDiagram instrumentId={inst.id} elements={f.primary.elements} size="sm" />
              </div>
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
  const visible = INSTRUMENTS.filter(i => !i.hidden);
  const woodwinds = visible.filter(i => i.family === 'woodwind');
  const brass = visible.filter(i => i.family === 'brass');

  return (
    <>
      <Nav />

      {/* Hero — spotlight import */}
      <section className="px-8 pt-16 pb-14 text-center max-w-[1160px] mx-auto">
        <div className="inline-block bg-accent-light rounded-full px-4 py-1.5 text-sm font-semibold text-accent mb-6">
          For band &amp; elementary music teachers · 100% free
        </div>
        <h1 className="text-4xl md:text-[48px] font-extrabold leading-[1.12] tracking-tight text-[#1a1d23] max-w-[720px] mx-auto mb-5">
          Turn any song into a fingering guide for your students
        </h1>
        <p className="text-lg text-[#4a5060] leading-relaxed max-w-[560px] mx-auto mb-9">
          Upload a concert-pitch score. We transpose it for each instrument and print a fingering diagram under every note — ready to hand out in 60 seconds.
        </p>
        <div className="flex gap-3 justify-center flex-wrap items-center">
          <Link href="/import" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3.5 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Import a score
          </Link>
          <Link href="/builder" className="text-[#4a5060] hover:text-accent px-4 py-3.5 text-base font-semibold transition-all underline underline-offset-4 decoration-[#d0d4dc] hover:decoration-accent">
            or build a practice worksheet
          </Link>
        </div>
      </section>

      {/* How import works — 3 steps */}
      <section className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">From score to student handout in three steps</h2>
            <p className="text-base text-[#4a5060] max-w-[520px] mx-auto">No account. No hand-writing note names. Works with MuseScore, Finale, Sibelius, Flat, and Noteflight exports.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Upload a concert-pitch score', d: 'Any MusicXML file — the actual piece your class is playing.' },
              { n: '2', t: 'Pick the instrument', d: 'We transpose automatically — Bb, Eb, F, concert pitch, all handled.' },
              { n: '3', t: 'Print the part', d: 'A fingering diagram sits under every note, ready to hand out.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-xl font-extrabold text-accent mx-auto mb-4">{s.n}</div>
                <h3 className="text-base font-bold text-[#1a1d23] mb-1">{s.t}</h3>
                <p className="text-sm text-[#4a5060]">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/import" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3.5 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5 inline-block">
              Try it with your score
            </Link>
          </div>
        </div>
      </section>

      {/* Instruments — browsable reference layer */}
      <section className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Or just browse the fingering charts</h2>
            <p className="text-base text-[#4a5060] max-w-[520px] mx-auto">Every note for every instrument, verified against professional sources. Click any instrument to see all fingerings and alternates.</p>
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

      {/* Secondary: worksheet builder */}
      <section className="px-8 py-20">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Need a worksheet instead?</h2>
            <p className="text-base text-[#4a5060] max-w-[520px] mx-auto">When you just want a blank quiz or a reference chart for a specific set of notes — build one by hand, no song required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/builder?mode=reference" className="bg-white border border-[#e5e8ed] rounded-2xl p-7 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all group">
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2 group-hover:text-accent">Reference chart</h3>
              <p className="text-sm text-[#4a5060] leading-relaxed">Pick notes and octaves, download a print-ready PDF with filled diagrams. Add your school name and class period.</p>
            </Link>
            <Link href="/builder?mode=quiz" className="bg-white border border-[#e5e8ed] rounded-2xl p-7 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all group">
              <h3 className="text-lg font-bold text-[#1a1d23] mb-2 group-hover:text-accent">Quiz worksheet</h3>
              <p className="text-sm text-[#4a5060] leading-relaxed">Print quizzes students complete by hand — identify the note or fill the blank diagram. Auto-generated answer key.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-4 tracking-tight">Stop hand-writing note names under every part</h2>
        <p className="text-base text-[#4a5060] mb-8 max-w-[520px] mx-auto">Upload the piece your class is playing. Every instrument gets a transposed part with fingerings under each note — free, no account.</p>
        <div className="flex gap-3 justify-center items-center flex-wrap">
          <Link href="/import" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-10 py-4 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Import a score
          </Link>
          <Link href="/instruments" className="text-[#4a5060] hover:text-accent px-4 py-4 text-base font-semibold transition-all underline underline-offset-4 decoration-[#d0d4dc] hover:decoration-accent">
            or browse fingering charts
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
