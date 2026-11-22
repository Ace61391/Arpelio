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
  const description = `Free ${inst.shortName.toLowerCase()} fingering chart covering all ${inst.notes} notes. ${inst.description} Browse every fingering with alternates, then print a reference chart or quiz worksheet.`;
  const url = `https://arpelio.com/instruments/${inst.id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      url,
      type: 'article',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${inst.name} fingering chart — Arpelio` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${inst.name} Fingering Chart | Arpelio`,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function InstrumentLayout({ children, params }) {
  const inst = getInstrument(params.id);
  if (!inst) return children;

  const url = `https://arpelio.com/instruments/${inst.id}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Arpelio', item: 'https://arpelio.com' },
          { '@type': 'ListItem', position: 2, name: 'Fingering charts', item: 'https://arpelio.com/instruments' },
          { '@type': 'ListItem', position: 3, name: `${inst.name} fingering chart`, item: url },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${inst.name} Fingering Chart`,
        description: `Complete ${inst.shortName.toLowerCase()} fingering chart: all ${inst.notes} notes with primary fingerings, alternates, and teaching notes.`,
        inLanguage: 'en',
        isPartOf: { '@id': 'https://arpelio.com/#website' },
        isAccessibleForFree: true,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
