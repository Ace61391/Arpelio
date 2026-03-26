'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className={`px-6 md:px-8 py-4 flex items-center justify-between max-w-[1160px] mx-auto ${!isHome ? 'sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e8ed]' : ''}`}>
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-extrabold text-base">A</div>
        <span className="text-xl font-extrabold text-[#1a1d23] tracking-tight">Arpelio</span>
      </Link>
      <div className="flex items-center gap-6 md:gap-7">
        <Link href="/instruments" className={`text-sm font-semibold transition-colors ${pathname?.startsWith('/instruments') ? 'text-accent' : 'text-[#4a5060] hover:text-accent'}`}>
          Instruments
        </Link>
        <Link href="/#features" className="text-sm font-semibold text-[#4a5060] hover:text-accent transition-colors hidden sm:block">
          Features
        </Link>
        <Link href="/#pricing" className="text-sm font-semibold text-[#4a5060] hover:text-accent transition-colors hidden sm:block">
          Pricing
        </Link>
        <Link href="/instruments" className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
          Get Started Free
        </Link>
      </div>
    </nav>
  );
}
