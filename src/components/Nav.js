'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="px-6 md:px-8 py-4 flex items-center justify-between max-w-[1160px] mx-auto sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e8ed]">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Arpelio" className="w-8 h-8 rounded-lg" />
        <span className="text-xl font-extrabold text-[#1a1d23] tracking-tight">Arpelio</span>
      </Link>
      <div className="flex items-center gap-5 md:gap-7">
        <Link href="/instruments" className={`text-sm font-semibold transition-colors ${pathname?.startsWith('/instruments') ? 'text-accent' : 'text-[#4a5060] hover:text-accent'}`}>
          Instruments
        </Link>
        <Link href="/builder" className={`text-sm font-semibold transition-colors ${pathname?.startsWith('/builder') ? 'text-accent' : 'text-[#4a5060] hover:text-accent'}`}>
          Builder
        </Link>
        <Link href="/faq" className={`text-sm font-semibold transition-colors ${pathname?.startsWith('/faq') ? 'text-accent' : 'text-[#4a5060] hover:text-accent'}`}>
          Help
        </Link>
        <Link href="/instruments" className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors hidden sm:block">
          Get Started Free
        </Link>
      </div>
    </nav>
  );
}
