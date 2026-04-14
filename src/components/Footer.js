import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1d23] px-8 py-12">
      <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.svg" alt="Arpelio" className="w-7 h-7 rounded-[7px]" />
            <span className="text-lg font-extrabold text-[#f0f1f4] tracking-tight">Arpelio</span>
          </div>
          <p className="text-sm text-[#7a8294]">Free fingering charts &amp; worksheets for every band instrument.</p>
        </div>
        <nav aria-label="Footer navigation">
          <div className="flex gap-8">
            <Link href="/instruments" className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              Instruments
            </Link>
            <Link href="/builder" className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              Worksheet Builder
            </Link>
            <Link href="/faq" className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              FAQ & Help
            </Link>
            <Link href="/contact" className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              Contact
            </Link>
          </div>
        </nav>
      </div>
      <div className="max-w-[1160px] mx-auto mt-6 pt-6 border-t border-[#2a2d35] flex justify-between flex-wrap gap-3">
        <span className="text-xs text-[#4a5060]">&copy; 2026 Arpelio &middot; arpelio.com</span>
        <div className="flex gap-5">
          <span className="text-xs text-[#4a5060]">Free for teachers and students</span>
        </div>
      </div>
    </footer>
  );
}
