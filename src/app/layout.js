import './globals.css';

export const metadata = {
  title: 'Arpelio — Fingering Charts & Assessments for Every Band Instrument',
  description: 'Interactive fingering charts, auto-graded quizzes, and printable worksheets for 14 band instruments. Free reference charts. Built by musicians, verified against professional sources.',
  keywords: 'fingering chart, band instrument, trumpet fingering, clarinet fingering, flute fingering, recorder fingering, music education, band director, worksheet generator',
  openGraph: {
    title: 'Arpelio — Fingering Charts & Assessments',
    description: 'Interactive fingering charts, auto-graded quizzes, and printable worksheets for every band instrument.',
    url: 'https://arpelio.com',
    siteName: 'Arpelio',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
