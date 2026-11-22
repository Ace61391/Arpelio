import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { QUIZZES_ON } from '@/lib/quiz/flag';

// This page describes two states of the site. Until online quizzes are switched on (see docs/online-quizzes-setup.md)
// nothing is stored about anyone, and the page must keep saying so.
const DESCRIPTION = QUIZZES_ON
  ? 'What Arpelio collects: nothing to use the charts and worksheets, a teacher email for online quizzes, and a student name and score for each quiz taken. No ads, no tracking cookies.'
  : 'What Arpelio collects when you use the fingering charts and worksheet builder: no accounts, no ads, no tracking cookies, and nothing about students.';

// Optional: where the database lives, e.g. "the United States" or "the European Union". Shown when set.
const DATA_REGION = process.env.NEXT_PUBLIC_ARPELIO_DATA_REGION;
const MAIL = (
  <a href="mailto:info@arpelio.com" className="text-accent font-semibold hover:underline">info@arpelio.com</a>
);

export const metadata = {
  title: 'Privacy',
  description: DESCRIPTION,
  alternates: { canonical: 'https://arpelio.com/privacy' },
  openGraph: {
    title: 'Privacy | Arpelio',
    description: DESCRIPTION,
    url: 'https://arpelio.com/privacy',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Arpelio' }],
  },
};

const UPDATED = 'November 22, 2026';

function Section({ title, children }) {
  return (
    <section className="mb-9">
      <h2 className="text-xl font-extrabold text-[#1a1d23] tracking-tight mb-3">{title}</h2>
      <div className="text-base text-[#4a5060] leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="px-6 md:px-8 py-10 max-w-[760px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] tracking-tight mb-2">Privacy</h1>
        <p className="text-sm text-[#7a8294] mb-8">Last updated {UPDATED}</p>

        <div className="border border-[#e5e8ed] rounded-2xl bg-[#f8f9fb] p-6 mb-10">
          <h2 className="text-base font-bold text-[#1a1d23] mb-2">The short version</h2>
          <ul className="text-base text-[#4a5060] leading-relaxed list-disc pl-5 space-y-1">
            {QUIZZES_ON ? (
              <>
                <li>You do not need an account to use the fingering charts or to build and print worksheets.</li>
                <li>Teachers who share a quiz online sign in with an email address. Students never create an account.</li>
                <li>
                  When a student takes an online quiz, Arpelio stores the name they type, their answers and their score
                  so their teacher can see them. Nothing else about students is collected.
                </li>
                <li>There are no ads and no advertising or cross-site tracking cookies.</li>
              </>
            ) : (
              <>
                <li>You do not need an account, and Arpelio does not ask for your name or email to use it.</li>
                <li>There are no ads and no advertising or cross-site tracking cookies.</li>
                <li>What you type into the worksheet builder stays in your browser.</li>
                <li>Arpelio does not collect anything about students.</li>
              </>
            )}
          </ul>
        </div>

        <Section title="Who this covers">
          <p>
            This page describes arpelio.com. Questions about it, or about your information, go to{' '}
            <a href="mailto:info@arpelio.com" className="text-accent font-semibold hover:underline">info@arpelio.com</a>.
          </p>
        </Section>

        <Section title="What you give us">
          <p>
            <strong className="text-[#1a1d23]">Worksheet builder.</strong> The instrument, notes, title and school or
            teacher name you choose are used in your browser to draw the worksheet. They are not sent to Arpelio and are
            not saved. Printing or saving a PDF happens on your own device.
          </p>
          {QUIZZES_ON && (
            <>
              <p>
                <strong className="text-[#1a1d23]">Teacher accounts.</strong> If you sign in to share quizzes online,
                we store your email address and when you signed in. If you sign in with Google, Google also passes us
                the name and picture on your Google account; we use the email address to identify your account and do
                not use the rest. We never see your Google password.
              </p>
              <p>
                <strong className="text-[#1a1d23]">Online quizzes.</strong> A quiz you share is stored with its title,
                instrument and notes. For each student who submits it we store the name they typed, each answer, the
                score and the time. Only you, signed in, can see your students&apos; results. You can delete a single
                result or a whole quiz from your dashboard at any time, and it is removed from our database when you
                do.
              </p>
            </>
          )}
          <p>
            <strong className="text-[#1a1d23]">Score import (beta).</strong> A MusicXML file you open is read and
            displayed by your browser. It is not uploaded to Arpelio.
          </p>
          <p>
            <strong className="text-[#1a1d23]">Contact.</strong> The contact form opens your own email program with a
            message addressed to us. If you send it, we receive your email address and whatever you wrote, and we keep
            that correspondence only as long as needed to answer you and fix what you reported.
          </p>
        </Section>

        <Section title="What is collected automatically">
          <p>
            <strong className="text-[#1a1d23]">Page-view statistics.</strong> Arpelio uses Vercel Web Analytics to count
            visits and see which pages are used. It works without cookies and reports totals, not individual visitors.
          </p>
          <p>
            <strong className="text-[#1a1d23]">Hosting and security logs.</strong> The site is served by Vercel and
            protected by Cloudflare. Like any web host, they process the technical details your browser sends with each
            request, such as IP address, browser type and the page requested, to deliver the site and block abuse.
          </p>
          <p>
            <strong className="text-[#1a1d23]">Fonts.</strong> The site&apos;s typefaces are loaded from Google Fonts,
            so your browser makes a request to Google when a page loads.
          </p>
          {QUIZZES_ON && (
            <p>
              <strong className="text-[#1a1d23]">Cookies.</strong> The only cookies Arpelio itself sets are for teacher
              sign-in: one that keeps you signed in and a short-lived one that remembers which page to return to.
              Students taking a quiz get no cookie from Arpelio; their answers are held in their own browser until they
              submit. Cloudflare may set a short-lived security cookie of its own.
            </p>
          )}
          <p>Arpelio does not sell personal information and does not share it for advertising.</p>
        </Section>

        {QUIZZES_ON && (
          <Section title="Where it is kept, and for how long">
            <p>
              Teacher accounts, quizzes and results are stored with Supabase, our database and sign-in provider
              {DATA_REGION ? `, in ${DATA_REGION}` : ''}. Sign-in emails are sent through an email delivery service.
              These companies process the information for us and may not use it for anything else.
            </p>
            <p>
              We keep a quiz and its results until the teacher deletes them, and a teacher account until the teacher
              asks us to remove it. To delete your account and everything in it, write to {MAIL} from the address you
              sign in with.
            </p>
          </Section>
        )}

        <Section title="Students and children">
          {QUIZZES_ON ? (
            <>
              <p>
                Arpelio is a tool for teachers. Students do not create accounts and are never asked for an email
                address, a birthday or anything beyond a name. The name, period and date lines on a printed worksheet
                are filled in by hand, on paper.
              </p>
              <p>
                When a teacher shares an online quiz, the student types a name so the teacher can tell whose result it
                is. We ask for a first name and last initial; a teacher can tell their class to use a nickname or a
                number instead. With the name we store the student&apos;s answers, score and the time they submitted.
                This is used only to show the result to the student and to their teacher. It is not used for
                advertising or profiling, and it is not sold or shared.
              </p>
              <p>
                The teacher who shares a quiz decides whether to use online quizzes with their class and is responsible
                for having whatever permission their school requires. A teacher can delete any student&apos;s result
                from the dashboard. Parents and schools can also ask us directly, at {MAIL}, to see or delete a
                student&apos;s results.
              </p>
            </>
          ) : (
            <p>
              Arpelio is a tool for teachers. It has no student accounts and no place to enter student information. The
              name, period and date lines on a printed worksheet are filled in by hand, on paper.
            </p>
          )}
        </Section>

        <Section title="Your choices">
          <p>
            You can ask what we hold about you, or ask us to delete {QUIZZES_ON ? 'your account or ' : ''}an email
            you sent, by writing to {MAIL}.
            Depending on where you live, you may also have the right to complain to your local data protection authority.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this page changes, the date at the top changes with it.{' '}
            {QUIZZES_ON
              ? 'If Arpelio starts collecting anything more than is described here, this page will be updated before that goes live.'
              : 'If Arpelio ever adds accounts or anything else that collects more than is described here, this page will be updated before that goes live.'}
          </p>
        </Section>

        <p className="text-sm text-[#7a8294]">
          See also the <Link href="/faq" className="text-accent font-semibold hover:underline">FAQ</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
