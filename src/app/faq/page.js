import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FAQ & Help — Frequently Asked Questions',
  description: 'Answers to common questions about Arpelio fingering charts, the worksheet builder, PDF downloads, and supported instruments. Free music education resources for band directors and students.',
  openGraph: {
    title: 'FAQ & Help | Arpelio',
    description: 'Answers to common questions about Arpelio fingering charts, worksheets, and supported instruments.',
    url: 'https://arpelio.com/faq',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary',
    title: 'FAQ & Help | Arpelio',
    description: 'Answers to common questions about Arpelio fingering charts and worksheets.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com/faq',
  },
};

const FAQS = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is Arpelio?',
        a: 'Arpelio is a free music education tool that provides interactive fingering charts and printable worksheets for band instruments. Every chart is verified against professional sources like Trevor Wye, Taffanel & Gaubert, and manufacturer references.',
      },
      {
        q: 'Is Arpelio really free?',
        a: 'Yes — 100% free. No account needed, no paywalls, no limits on PDF downloads. Arpelio is built for teachers and students.',
      },
      {
        q: 'Who is Arpelio for?',
        a: 'Band directors, private lesson teachers, and students at any level. The beginner filters make it great for elementary and middle school programs, while full-range charts serve high school and college players.',
      },
    ],
  },
  {
    category: 'Instruments',
    questions: [
      {
        q: 'Which instruments are supported?',
        a: 'Arpelio currently covers 9 band instruments: Recorder, Flute, Trumpet (B♭), French Horn (F), Trombone, Euphonium, and Tuba (BB♭). Clarinet and Saxophone are coming soon.',
      },
      {
        q: 'Are the fingerings accurate?',
        a: <>Every fingering is verified against professional method books and manufacturer charts. Flute fingerings follow the standard Boehm system (closed G#). Brass instruments use standard valve combinations. Recorder uses English (Baroque) fingering. If you find an error, <Link href="/contact" className="text-accent font-semibold hover:underline">please let us know</Link>.</>,
      },
      {
        q: 'What fingering system does the recorder use?',
        a: 'English (Baroque) fingering — the professional standard used worldwide. The key difference from German fingering is how F and B♭ are played. Arpelio also offers a simple/baroque hole style toggle to show single circles or double holes for RH3 and RH4.',
      },
      {
        q: 'What system does the flute use?',
        a: 'Standard Boehm system with closed G# — the most common professional setup. All 38 notes across 3 octaves are included, from B3 to C7, with standard method book fingerings as primaries and common alternates listed where applicable.',
      },
      {
        q: 'Do all saxophones use the same fingerings?',
        a: 'Yes. Alto, tenor, baritone, and soprano saxophone all use identical fingerings. The written notes are the same — only the concert pitch differs due to transposition. One chart works for all saxophones.',
      },
      {
        q: 'What about trombone slide positions?',
        a: 'Trombone uses slide positions 1 through 7 instead of valves. Position 1 is fully in (shortest), position 7 is fully extended (longest). Arpelio shows the correct position for every note across the full range.',
      },
      {
        q: 'Will you add more instruments?',
        a: 'Clarinet and saxophone charts are in development and will be available soon. Oboe and bassoon are planned for future updates.',
      },
    ],
  },
  {
    category: 'Fingering Charts',
    questions: [
      {
        q: 'How do I read the fingering diagrams?',
        a: 'Filled (black) circles or keys mean pressed/covered. Open (white) circles mean not pressed. Half-filled circles (on recorder) mean the hole is partially covered. For brass instruments, filled valve circles mean the valve is pressed down.',
      },
      {
        q: 'What does the text notation mean?',
        a: 'The text notation shows the fingering in shorthand. For example, "T 123|45--" means: Thumb covered, left hand fingers 1-2-3 all down, right hand fingers 4-5 down, 6-7 open. The "|" divides left hand from right hand. "T" means thumb is pressed, "-" means thumb is open.',
      },
      {
        q: 'What are beginner notes?',
        a: 'Beginner notes are the subset of notes typically taught in the first year of instruction. They are marked in each instrument\'s data and can be filtered using the "Beginner" button on any instrument page.',
      },
      {
        q: 'Can I filter by octave?',
        a: 'Yes. Each instrument page has filter buttons for All Notes, Beginner, 1st Octave, 2nd Octave, and 3rd Octave (where applicable). The available filters depend on the instrument\'s range.',
      },
    ],
  },
  {
    category: 'Worksheet Builder',
    questions: [
      {
        q: 'How do I create a worksheet?',
        a: 'Go to the Worksheet Builder, choose an instrument, select a worksheet type (Reference Chart, Identify the Note quiz, or Fill the Chart quiz), pick which notes to include, add an optional title and school name, then preview and download as a PDF.',
      },
      {
        q: 'What worksheet types are available?',
        a: 'Three types: (1) Reference Chart — a study guide with filled diagrams and note names. (2) Identify the Note — students see a filled diagram and write the note name. (3) Fill the Chart — students see a note on the staff and fill in a blank diagram by hand.',
      },
      {
        q: 'Can I generate an answer key?',
        a: 'Yes. When creating a quiz worksheet (Identify or Fill mode), check the "Generate answer key" box. This creates a teacher copy with all answers filled in.',
      },
      {
        q: 'How many notes fit on one page?',
        a: 'Each PDF page holds 6 fingering charts arranged in 2 rows of 3. Charts never get cut off at page breaks — each page is captured separately.',
      },
      {
        q: 'What format is the download?',
        a: 'Worksheets download as clean PDF files with no browser headers, footers, or URLs. They include the Arpelio logo and are ready to print or share digitally.',
      },
      {
        q: 'Do I need an account to download PDFs?',
        a: 'No. Everything works without signing up. Just build your worksheet and download.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What browsers are supported?',
        a: 'Arpelio works in all modern browsers — Chrome, Firefox, Safari, and Edge. The PDF generator works best in Chrome and Edge.',
      },
      {
        q: 'Does Arpelio work on mobile?',
        a: 'Yes. The site is fully responsive. Fingering charts and the worksheet builder work on phones and tablets, though the PDF builder is easiest to use on a larger screen.',
      },
      {
        q: 'I found a fingering error. How do I report it?',
        a: 'We take accuracy seriously. Please reach out and describe which instrument, note, and what you believe the correct fingering should be. Include a reference source if possible.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[800px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          FAQ & Help
        </h1>
        <p className="text-base text-[#4a5060] mb-10">
          Everything you need to know about Arpelio fingering charts, worksheets, and supported instruments.
        </p>

        {FAQS.map(section => (
          <div key={section.category} className="mb-10">
            <h2 className="text-xs font-bold text-[#7a8294] uppercase tracking-widest mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.questions.map((item, i) => (
                <div key={i} className="border border-[#e5e8ed] rounded-xl p-5 bg-white">
                  <h3 className="text-base font-bold text-[#1a1d23] mb-2">{item.q}</h3>
                  <p className="text-sm text-[#4a5060] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="border border-accent rounded-xl p-6 bg-accent-light text-center mt-12">
          <h2 className="text-lg font-bold text-[#1a1d23] mb-2">Still have questions?</h2>
          <p className="text-sm text-[#4a5060] mb-4">We are always happy to help with instrument fingerings, worksheets, or anything else.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/contact" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-2.5 text-sm font-bold transition-all">
              Contact Us
            </Link>
            <Link href="/builder" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-6 py-2.5 text-sm font-semibold transition-all">
              Build a Worksheet
            </Link>
          </div>
        </div>

        {/* JSON-LD FAQ structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.flatMap(section =>
                section.questions.map(item => ({
                  '@type': 'Question',
                  name: item.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.a,
                  },
                }))
              ),
            }),
          }}
        />
      </div>
      <Footer />
    </>
  );
}
