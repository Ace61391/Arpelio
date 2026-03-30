import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Arpelio — Fingering Charts & Worksheets for Every Band Instrument',
  description: 'Interactive fingering charts, print-ready reference PDFs, and quiz worksheets for 9 band instruments. Free for every teacher. Built by musicians, verified against professional sources.',
  keywords: 'fingering chart, band instrument, trumpet fingering, clarinet fingering, flute fingering, saxophone fingering, recorder fingering, music education, band director, worksheet generator',
  openGraph: {
    title: 'Arpelio — Fingering Charts & Worksheets',
    description: 'Interactive fingering charts, print-ready reference PDFs, and quiz worksheets for every band instrument.',
    url: 'https://arpelio.com',
    siteName: 'Arpelio',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
