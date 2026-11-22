import { INSTRUMENTS, getInstrument } from '@/data/instruments';

// Pre-render a route for each public instrument so these pages ship as static
// HTML with their own title — they are the pages teachers arrive on from search.
export function generateStaticParams() {
  return INSTRUMENTS.filter(i => !i.hidden).map(inst => ({ id: inst.id }));
}

export function generateMetadata({ params }) {
  const inst = getInstrument(params.id);
  if (!inst) return { title: 'Instrument Not Found' };

  const title = `${inst.name} Fingering Chart — All Notes & Octaves`;
  const description = `Free ${inst.name.toLowerCase()} fingering chart covering all ${inst.notes} notes. ${inst.description} Browse every fingering with alternates, then print a reference chart or quiz worksheet.`;
  const url = `https://arpelio.com/instruments/${inst.id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      url,
      type: 'article',
      images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: `${inst.name} fingering chart — Arpelio` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function InstrumentLayout({ children }) {
  return children;
}
