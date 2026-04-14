import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import InstrumentsClient from './InstrumentsClient';

export const metadata = {
  title: 'Band Instrument Fingering Charts — Flute, Clarinet, Trumpet & More',
  description: 'Free interactive fingering charts for 9 band instruments: flute, clarinet, saxophone, recorder, trumpet, French horn, trombone, euphonium, and tuba. Browse all notes and octaves, print PDF reference charts, and create quiz worksheets.',
  keywords: 'band instrument fingering charts, flute fingering chart, clarinet fingering chart, trumpet fingering chart, saxophone fingering chart, recorder fingering chart, trombone slide positions, French horn fingering chart',
  openGraph: {
    title: 'Band Instrument Fingering Charts | Arpelio',
    description: 'Free interactive fingering charts for 9 band instruments. Browse, print, and quiz.',
    url: 'https://arpelio.com/instruments',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Band Instrument Fingering Charts | Arpelio',
    description: 'Free interactive fingering charts for 9 band instruments.',
  },
  alternates: {
    canonical: 'https://arpelio.com/instruments',
  },
};

export default function InstrumentsPage() {
  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[1160px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          Band Instrument Fingering Charts
        </h1>
        <p className="text-base text-[#4a5060] mb-8">
          Select an instrument to view its interactive fingering chart with every note and octave. Print PDF reference charts or create quiz worksheets — all free.
        </p>

        <InstrumentsClient />
      </div>
      <Footer />
    </>
  );
}
