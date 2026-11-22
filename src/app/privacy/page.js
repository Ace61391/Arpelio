import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const DESCRIPTION =
  'What Arpelio collects when you use the fingering charts and worksheet builder: no accounts, no ads, no tracking cookies, and nothing about students.';

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
            <li>You do not need an account, and Arpelio does not ask for your name or email to use it.</li>
            <li>There are no ads and no advertising or cross-site tracking cookies.</li>
            <li>What you type into the worksheet builder stays in your browser.</li>
            <li>Arpelio does not collect anything about students.</li>
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
          <p>Arpelio does not sell personal information and does not share it for advertising.</p>
        </Section>

        <Section title="Students and children">
          <p>
            Arpelio is a tool for teachers. It has no student accounts and no place to enter student information. The
            name, period and date lines on a printed worksheet are filled in by hand, on paper.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask what we hold about you, or ask us to delete an email you sent, by writing to{' '}
            <a href="mailto:info@arpelio.com" className="text-accent font-semibold hover:underline">info@arpelio.com</a>.
            Depending on where you live, you may also have the right to complain to your local data protection authority.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this page changes, the date at the top changes with it. If Arpelio ever adds accounts or anything else
            that collects more than is described here, this page will be updated before that goes live.
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
