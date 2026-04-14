import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-20 max-w-[600px] mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-[#1a1d23] mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-base text-[#4a5060] mb-10">
          Sorry, we could not find the page you were looking for. It may have been moved or no longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-sm font-bold transition-all">
            Go Home
          </Link>
          <Link href="/instruments" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-6 py-3 text-sm font-semibold transition-all">
            Browse Instruments
          </Link>
          <Link href="/builder" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-6 py-3 text-sm font-semibold transition-all">
            Worksheet Builder
          </Link>
          <Link href="/faq" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-6 py-3 text-sm font-semibold transition-all">
            FAQ & Help
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
