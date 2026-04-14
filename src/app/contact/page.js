import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Arpelio team. Report fingering errors, request features, or ask questions about our free band instrument fingering charts and worksheets.',
  openGraph: {
    title: 'Contact Us | Arpelio',
    description: 'Get in touch with the Arpelio team.',
    url: 'https://arpelio.com/contact',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Arpelio',
    description: 'Get in touch with the Arpelio team.',
  },
  alternates: {
    canonical: 'https://arpelio.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[700px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          Contact Us
        </h1>
        <p className="text-base text-[#4a5060] mb-10">
          Have a question, found a fingering error, or want to request a feature? We would love to hear from you.
        </p>

        <div className="border border-[#e5e8ed] rounded-xl p-8 bg-white mb-8">
          <h2 className="text-lg font-bold text-[#1a1d23] mb-4">Email us</h2>
          <p className="text-sm text-[#4a5060] mb-4">
            The fastest way to reach us is by email. We typically respond within 24 hours.
          </p>
          <a href="mailto:info@arpelio.com"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-base font-bold transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            info@arpelio.com
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="border border-[#e5e8ed] rounded-xl p-6 bg-white">
            <h3 className="text-sm font-bold text-[#1a1d23] mb-2">Report a fingering error</h3>
            <p className="text-xs text-[#4a5060] leading-relaxed">
              Please include the instrument name, note, and what you believe the correct fingering should be. A reference source (method book, manufacturer chart) is helpful.
            </p>
          </div>
          <div className="border border-[#e5e8ed] rounded-xl p-6 bg-white">
            <h3 className="text-sm font-bold text-[#1a1d23] mb-2">Request an instrument</h3>
            <p className="text-xs text-[#4a5060] leading-relaxed">
              Want to see an instrument that is not listed yet? Let us know and we will prioritize it.
            </p>
          </div>
          <div className="border border-[#e5e8ed] rounded-xl p-6 bg-white">
            <h3 className="text-sm font-bold text-[#1a1d23] mb-2">Feature suggestions</h3>
            <p className="text-xs text-[#4a5060] leading-relaxed">
              Have an idea for a new worksheet type, quiz mode, or tool? We build based on teacher feedback.
            </p>
          </div>
          <div className="border border-[#e5e8ed] rounded-xl p-6 bg-white">
            <h3 className="text-sm font-bold text-[#1a1d23] mb-2">General questions</h3>
            <p className="text-xs text-[#4a5060] leading-relaxed">
              Anything else — how to use the site, partnerships, or just to say hello. We are happy to help.
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-[#7a8294]">
          <p>You can also check our <Link href="/faq" className="text-accent font-semibold hover:underline">FAQ & Help</Link> page for quick answers to common questions.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
