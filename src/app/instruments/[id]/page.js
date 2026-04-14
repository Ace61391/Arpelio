import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS, getInstrument } from '@/data/instruments';
import { getInstrumentData } from '@/data/loader';
import InstrumentClient from './InstrumentClient';

export function generateStaticParams() {
  return INSTRUMENTS.filter(i => !i.hidden).map(inst => ({ id: inst.id }));
}

export function generateMetadata({ params }) {
  const inst = getInstrument(params.id);
  if (!inst) return { title: 'Instrument Not Found' };

  const title = `${inst.name} Fingering Chart — All Notes & Octaves`;
  const description = `Free interactive ${inst.name.toLowerCase()} fingering chart with ${inst.notes} notes. ${inst.description} Browse all fingerings, print PDF reference charts, and create quiz worksheets.`;

  return {
    title,
    description,
    openGraph: {
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      url: `https://arpelio.com/instruments/${inst.id}`,
      type: 'article',
      images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: `https://arpelio.com/instruments/${inst.id}`,
    },
  };
}

export default function InstrumentPage({ params }) {
  const id = params.id;
  const instMeta = getInstrument(id);
  const instData = getInstrumentData(id);

  if (!instMeta || !instData) {
    return (
      <>
        <Nav />
        <div className="px-8 py-20 max-w-[1160px] mx-auto text-center">
          <h1 className="text-2xl font-bold text-[#1a1d23] mb-4">Instrument not found</h1>
          <Link href="/instruments" className="text-accent font-semibold">&larr; Back to instruments</Link>
        </div>
        <Footer />
      </>
    );
  }

  const fingerings = instData.fingerings || [];
  const clef = instMeta.clef;
  const registers = instData.instrument?.registers || [];

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-8 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#7a8294] mb-6">
          <Link href="/instruments" className="hover:text-accent transition-colors">Instruments</Link>
          <span>/</span>
          <span className="text-[#1a1d23] font-medium">{instMeta.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-1">{instMeta.name} Fingering Chart</h1>
            <p className="text-sm text-[#4a5060]">{instMeta.description} &middot; {instMeta.notes} notes</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/builder?instrument=${id}&mode=reference`}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors">
              Build PDF Chart
            </Link>
            <Link href={`/builder?instrument=${id}&mode=quiz`}
              className="text-xs font-bold px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent-light transition-colors">
              Create Quiz
            </Link>
          </div>
        </div>

        {/* SEO-indexable intro text */}
        <div className="mb-8 text-sm text-[#4a5060] leading-relaxed max-w-[720px]">
          <p className="mb-2">
            This interactive {instMeta.name.toLowerCase()} fingering chart covers {instMeta.notes} notes
            {registers.length > 0 && ` across ${registers.length} registers`}.
            {instMeta.transposition !== 'C' ? ` Transposing instrument in ${instMeta.transposition}, reading ${instMeta.clef} clef.` : ` Concert pitch, ${instMeta.clef} clef.`}
          </p>
          <p>
            Every fingering is verified against professional sources. Use the filters below to browse by octave or beginner notes, or use the <Link href={`/builder?instrument=${id}&mode=reference`} className="text-accent font-semibold hover:underline">Worksheet Builder</Link> to generate a free print-ready PDF.
          </p>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalResource',
              name: `${instMeta.name} Fingering Chart`,
              description: `Interactive ${instMeta.name.toLowerCase()} fingering chart with ${instMeta.notes} notes. ${instMeta.description}`,
              url: `https://arpelio.com/instruments/${id}`,
              provider: {
                '@type': 'Organization',
                name: 'Arpelio',
                url: 'https://arpelio.com',
              },
              educationalLevel: 'Beginner to Advanced',
              learningResourceType: 'Reference Chart',
              about: {
                '@type': 'Thing',
                name: instMeta.name,
              },
              isAccessibleForFree: true,
            }),
          }}
        />

        <InstrumentClient id={id} instMeta={instMeta} fingerings={fingerings} clef={clef} />

        {/* More instruments in the same family */}
        {(() => {
          const related = INSTRUMENTS.filter(i => !i.hidden && i.family === instMeta.family && i.id !== id);
          if (related.length === 0) return null;
          return (
            <div className="mt-16 pt-10 border-t border-[#e5e8ed]">
              <h2 className="text-lg font-bold text-[#1a1d23] mb-4">More {instMeta.family} instruments</h2>
              <div className="flex flex-wrap gap-3">
                {related.map(r => (
                  <Link key={r.id} href={`/instruments/${r.id}`}
                    className="flex items-center gap-2.5 bg-white border border-[#e5e8ed] rounded-xl px-4 py-3 hover:border-accent hover:-translate-y-0.5 hover:shadow-md transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${r.family === 'brass' ? 'bg-brass' : 'bg-woodwind'}`}>
                      {r.shortName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1a1d23]">{r.name}</span>
                      <span className="block text-[11px] text-[#7a8294]">{r.notes} notes</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
      <Footer />
    </>
  );
}
