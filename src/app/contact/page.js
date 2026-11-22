import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Arpelio team. Report fingering errors, request features, or ask questions about our free band instrument fingering charts and worksheets.',
  openGraph: {
    title: 'Contact Us | Arpelio',
    description: 'Get in touch with the Arpelio team.',
    url: 'https://arpelio.com/contact',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Arpelio — Fingering Charts for Every Band Instrument' }],
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Arpelio',
    description: 'Get in touch with the Arpelio team.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://arpelio.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[600px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          Contact Us
        </h1>
        <p className="text-base text-[#4a5060] mb-8">
          Have a question, found a fingering error, or want to request a feature? Fill out the form below and we will get back to you.
        </p>

        <ContactForm />

        <div className="text-center text-sm text-[#7a8294] mt-8">
          <p>You can also check our <Link href="/faq" className="text-accent font-semibold hover:underline">FAQ & Help</Link> page for quick answers to common questions.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
