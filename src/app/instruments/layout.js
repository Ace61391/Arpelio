const DESCRIPTION =
  'Free fingering charts for 7 band instruments: recorder, flute, trumpet, French horn, trombone, euphonium, and tuba. Every note and octave, with alternates — plus printable charts and quiz worksheets.';

export const metadata = {
  title: 'Band Instrument Fingering Charts — Flute, Trumpet, Recorder & More',
  description: DESCRIPTION,
  openGraph: {
    title: 'Band Instrument Fingering Charts | Arpelio',
    description: DESCRIPTION,
    url: 'https://arpelio.com/instruments',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Band Instrument Fingering Charts | Arpelio',
    description: DESCRIPTION,
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com/instruments',
  },
};

export default function InstrumentsLayout({ children }) {
  return children;
}
