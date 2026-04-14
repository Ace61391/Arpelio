import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://arpelio.com'),
  title: {
    default: 'Arpelio — Free Fingering Charts & Worksheets for Every Band Instrument',
    template: '%s | Arpelio',
  },
  description: 'Free interactive fingering charts, print-ready reference PDFs, and quiz worksheets for 9 band instruments. Built by musicians, verified against professional sources.',
  authors: [{ name: 'Arpelio' }],
  creator: 'Arpelio',
  openGraph: {
    title: 'Arpelio — Free Fingering Charts & Worksheets for Every Band Instrument',
    description: 'Interactive fingering charts, print-ready reference PDFs, and quiz worksheets for every band instrument. Free for every teacher.',
    url: 'https://arpelio.com',
    siteName: 'Arpelio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Arpelio — Fingering Charts for Every Band Instrument',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arpelio — Free Fingering Charts & Worksheets',
    description: 'Interactive fingering charts, print-ready PDFs, and quiz worksheets for 9 band instruments. 100% free.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Arpelio',
              url: 'https://arpelio.com',
              description: 'Free interactive fingering charts, print-ready reference PDFs, and quiz worksheets for 9 band instruments.',
              publisher: {
                '@type': 'Organization',
                name: 'Arpelio',
                url: 'https://arpelio.com',
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
