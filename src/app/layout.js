import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://arpelio.com'),
  title: 'Arpelio — Fingering Charts & Printable Quiz Worksheets for Band',
  description: 'Free fingering charts for 7 band instruments, plus a builder that turns any set of notes into a printable reference chart or auto-keyed quiz worksheet. No account needed.',
  keywords: 'fingering chart, band instrument, trumpet fingering, flute fingering, recorder fingering, french horn fingering, trombone slide positions, tuba fingering, euphonium fingering, music education, band director, fingering worksheet, quiz worksheet generator',
  openGraph: {
    title: 'Arpelio — Fingering Charts & Printable Quiz Worksheets',
    description: 'Free fingering charts for 7 band instruments, plus printable reference charts and quiz worksheets with answer keys.',
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
