'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close the menu whenever the route changes
  useEffect(() => { setToolsOpen(false); }, [pathname]);

  const linkCls = (active) =>
    `text-sm font-semibold transition-colors ${active ? 'text-accent' : 'text-[#4a5060] hover:text-accent'}`;

  return (
    <nav className="px-6 md:px-8 py-4 flex items-center justify-between max-w-[1160px] mx-auto sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e8ed]">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Arpelio" className="w-8 h-8 rounded-lg" />
        <span className="text-xl font-extrabold text-[#1a1d23] tracking-tight">Arpelio</span>
      </Link>
      <div className="flex items-center gap-5 md:gap-7">
        <Link href="/import" className={linkCls(pathname?.startsWith('/import'))}>
          Import a score
        </Link>
        <Link href="/instruments" className={linkCls(pathname?.startsWith('/instruments'))}>
          Instruments
        </Link>

        {/* More tools dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setToolsOpen(o => !o)}
            className={`flex items-center gap-1 ${linkCls(pathname?.startsWith('/builder'))}`}
            aria-haspopup="true" aria-expanded={toolsOpen}>
            More tools
            <span className={`text-[10px] transition-transform ${toolsOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {toolsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e5e8ed] rounded-xl shadow-lg p-1.5 z-50">
              <Link href="/builder?mode=reference" className="block px-3 py-2.5 rounded-lg hover:bg-[#f8f9fb] transition-colors">
                <div className="text-sm font-semibold text-[#1a1d23]">Reference chart builder</div>
                <div className="text-xs text-[#7a8294]">Pick notes → print a fingering chart</div>
              </Link>
              <Link href="/builder?mode=quiz" className="block px-3 py-2.5 rounded-lg hover:bg-[#f8f9fb] transition-colors">
                <div className="text-sm font-semibold text-[#1a1d23]">Quiz worksheet builder</div>
                <div className="text-xs text-[#7a8294]">Blank charts with an answer key</div>
              </Link>
            </div>
          )}
        </div>

        <Link href="/import" className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors hidden sm:block">
          Import a score
        </Link>
      </div>
    </nav>
  );
}
