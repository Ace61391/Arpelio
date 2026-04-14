export const metadata = {
  title: 'Fingering Chart Worksheet Builder — Free PDF Generator',
  description: 'Create free print-ready fingering chart PDFs and quiz worksheets for any band instrument. Choose notes, customize titles, and download instantly. No account needed.',
  openGraph: {
    title: 'Fingering Chart Worksheet Builder | Arpelio',
    description: 'Create free print-ready fingering chart PDFs and quiz worksheets for any band instrument.',
    url: 'https://arpelio.com/builder',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fingering Chart Worksheet Builder | Arpelio',
    description: 'Create free fingering chart PDFs and quiz worksheets. No account needed.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com/builder',
  },
};

export default function BuilderLayout({ children }) {
  return children;
}
