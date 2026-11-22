const DESCRIPTION =
  'Beta: upload a MusicXML score and get it back with a fingering diagram printed under every note, transposed for your instrument. Free, no account.';

export const metadata = {
  title: 'Score Import (Beta) — Fingerings Under Every Note',
  description: DESCRIPTION,
  openGraph: {
    title: 'Score Import (Beta) | Arpelio',
    description: DESCRIPTION,
    url: 'https://arpelio.com/import',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Score Import (Beta) | Arpelio',
    description: DESCRIPTION,
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com/import',
  },
};

export default function ImportLayout({ children }) {
  return children;
}
