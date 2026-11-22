import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';
import FingeringDiagram from '@/components/FingeringDiagram';
import InstrumentTile from '@/components/InstrumentTile';
import WorksheetIcon from '@/components/WorksheetIcon';

export const metadata = {
  alternates: { canonical: 'https://arpelio.com' },
};

const WORKSHEET_TYPES = [
  {
    mode: 'reference',
    title: 'Reference chart',
    desc: 'Every note you pick, with its diagram, staff position, and fingering shorthand. The handout students tape inside their folder.',
  },
  {
    mode: 'identify',
    title: 'Quiz: identify the note',
    desc: 'Students see a filled diagram and write the note name. Tick one box to print the answer key for yourself.',
  },
  {
    mode: 'fill',
    title: 'Quiz: fill the chart',
    desc: 'Students see a note on the staff and fill in the blank diagram by hand. The same note set, tested the other direction.',
  },
];

function InstrumentCard({ inst }) {
  const fingerings = getFingeringsForInstrument(inst.id);
  const beginner = fingerings.filter(f => f.pedagogy?.beginner_note);
  const samples = (beginner.length >= 2 ? beginner : fingerings).slice(0, 2);
  const isHorizontal = inst.id === 'flute' || inst.id === 'trombone';

  return (
    <Link href={`/instruments/${inst.id}`}
      className="bg-white border border-[#e5e8ed] rounded-card p-5 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group flex flex-col">
      <InstrumentTile inst={inst} compact />
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

  // Derived from the data so the marketing copy can never drift from reality.
  const instrumentCount = visible.length;
  const noteCount = visible.reduce((sum, i) => sum + (i.notes || 0), 0);

  // Structured data — claims only what the site actually provides.
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://arpelio.com/#website',
        url: 'https://arpelio.com',
        name: 'Arpelio',
        description: `Free fingering charts and printable quiz worksheets for band instruments. ${noteCount} verified fingerings across ${instrumentCount} instruments.`,
        inLanguage: 'en',
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://arpelio.com/#builder',
        url: 'https://arpelio.com/builder',
        name: 'Arpelio Worksheet Builder',
        description: 'Pick an instrument and a set of notes, then print a fingering reference chart or a quiz worksheet with an optional answer key.',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any modern web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'teacher',
          audienceType: 'Band directors and music teachers',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />

      {/* Hero */}
      <section className="px-8 pt-16 pb-12 text-center max-w-[1160px] mx-auto">
        <div className="inline-block bg-accent-light rounded-full px-4 py-1.5 text-sm font-semibold text-accent mb-6">
          For band &amp; elementary music teachers · 100% free
        </div>
        <h1 className="text-4xl md:text-[48px] font-extrabold leading-[1.12] tracking-tight text-[#1a1d23] max-w-[760px] mx-auto mb-5">
          Fingering charts and quiz worksheets, ready to print
        </h1>
        <p className="text-lg text-[#4a5060] leading-relaxed max-w-[620px] mx-auto mb-4">
          Pick an instrument, pick the notes you are teaching this week, and print a reference chart or a quiz — with an answer key. {noteCount} verified fingerings across {instrumentCount} instruments.
        </p>
        <p className="text-sm text-[#7a8294] mb-9">
          No account, nothing to install, no limit on how much you print.
        </p>
        <div className="flex gap-3 justify-center flex-wrap items-center">
          <Link href="/builder" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3.5 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Build a worksheet
          </Link>
          <Link href="/instruments" className="text-[#4a5060] hover:text-accent px-4 py-3.5 text-base font-semibold transition-all underline underline-offset-4 decoration-[#d0d4dc] hover:decoration-accent">
            or browse the fingering charts
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="px-8 pb-4 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t: 'Fingerings you can trust', d: 'Every primary fingering is checked against at least two independent published charts, and every brass fingering against the harmonic series. Sources are listed in the FAQ.' },
            { t: 'Charts and quizzes from one list', d: 'Choose your notes once. Print them as a study guide, as a name-the-note quiz, or as blank diagrams to fill in.' },
            { t: 'An answer key in one click', d: 'Tick a box and you get the teacher copy with every answer filled in. Grade a stack of these in a couple of minutes.' },
          ].map(v => (
            <div key={v.t} className="bg-white border border-[#e5e8ed] rounded-2xl p-6">
              <h3 className="text-base font-bold text-[#1a1d23] mb-2">{v.t}</h3>
              <p className="text-sm text-[#4a5060] leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three worksheet types */}
      <section className="px-8 py-16">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Three worksheets from the same note list</h2>
            <p className="text-base text-[#4a5060] max-w-[560px] mx-auto">
              Filter to beginner notes or a single octave, uncheck anything you have not taught yet, and print.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WORKSHEET_TYPES.map(w => (
              <Link key={w.mode} href={`/builder?mode=${w.mode}`}
                className="bg-white border border-[#e5e8ed] rounded-2xl p-6 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group flex flex-col">
                <div className="mb-3 text-accent"><WorksheetIcon mode={w.mode} className="w-8 h-8" /></div>
                <h3 className="text-base font-bold text-[#1a1d23] mb-2 group-hover:text-accent transition-colors">{w.title}</h3>
                <p className="text-sm text-[#4a5060] leading-relaxed flex-1">{w.desc}</p>
                <span className="text-xs text-accent font-semibold mt-4">Build this one →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Every note for every instrument</h2>
            <p className="text-base text-[#4a5060] max-w-[560px] mx-auto">
              Click an instrument to see its full range with alternates, common errors, and practice notes — then send any selection straight to the builder.
            </p>
          </div>

          {/* One grid for all instruments: 4 + 3 on desktop, no orphaned rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map(inst => <InstrumentCard key={inst.id} inst={inst} />)}
          </div>

          <p className="text-sm text-[#7a8294] text-center mt-8">
            Clarinet and saxophone charts are in development.
          </p>
        </div>
      </section>

      {/* Score import — honest beta placement */}
      <section className="px-8 py-14">
        <div className="max-w-[760px] mx-auto bg-white border border-[#e5e8ed] rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="flex-1">
            <h3 className="text-base font-bold text-[#1a1d23] mb-1 flex items-center gap-2 flex-wrap">
              Also in the works: score import
              <span className="text-[10px] font-bold uppercase tracking-wide text-accent bg-accent-light rounded px-1.5 py-0.5">Beta</span>
            </h3>
            <p className="text-sm text-[#4a5060] leading-relaxed">
              Upload a MusicXML file and Arpelio prints a fingering diagram under every note. It works for concert-pitch melodies on the instruments above — still rough, and worth a look if you are curious.
            </p>
          </div>
          <Link href="/import" className="text-sm font-bold text-accent hover:underline whitespace-nowrap">
            Try the beta →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-20 pt-6 text-center">
        <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-4 tracking-tight">Stop drawing fingering charts on the whiteboard</h2>
        <p className="text-base text-[#4a5060] mb-8 max-w-[520px] mx-auto">
          Pick your instrument and this week&apos;s notes. You will have something to hand out in about a minute — free, no account.
        </p>
        <div className="flex gap-3 justify-center items-center flex-wrap">
          <Link href="/builder" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-10 py-4 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Build a worksheet
          </Link>
          <Link href="/instruments" className="text-[#4a5060] hover:text-accent px-4 py-4 text-base font-semibold transition-all underline underline-offset-4 decoration-[#d0d4dc] hover:decoration-accent">
            or browse the fingering charts
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
