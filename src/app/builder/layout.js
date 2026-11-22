export const metadata = {
  title: 'Fingering Chart & Quiz Worksheet Builder — Free, Printable',
  description: 'Build free printable fingering charts and quiz worksheets for band instruments. Pick your notes, add a title, print — answer key included. No account needed.',
  openGraph: {
    title: 'Fingering Chart & Quiz Worksheet Builder | Arpelio',
    description: 'Build free printable fingering charts and quiz worksheets for band instruments. Answer key included.',
    url: 'https://arpelio.com/builder',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fingering Chart & Quiz Worksheet Builder | Arpelio',
    description: 'Build free printable fingering charts and quiz worksheets. No account needed.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://arpelio.com/builder',
  },
};

export default function BuilderLayout({ children }) {
  return children;
}
