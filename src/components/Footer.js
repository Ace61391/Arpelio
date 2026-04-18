import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1d23] px-8 py-12">
      <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-white font-extrabold text-sm">A</div>
            <span className="text-lg font-extrabold text-[#f0f1f4] tracking-tight">Arpelio</span>
          </div>
          <p className="text-sm text-[#7a8294]">Interactive fingering charts & assessments for every band instrument.</p>
        </div>
        <div className="flex gap-8">
          {['Instruments', 'Features', 'Pricing', 'Contact'].map(item => (
            <Link key={item} href={item === 'Instruments' ? '/instruments' : `/#${item.toLowerCase()}`} className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto mt-6 pt-6 border-t border-[#2a2d35] flex justify-between flex-wrap gap-3">
        <span className="text-xs text-[#4a5060]">© 2026 Arpelio · arpelio.com</span>
        <div className="flex gap-5">
          <Link href="#" className="text-xs text-[#4a5060] hover:text-[#7a8294]">Privacy</Link>
          <Link href="#" className="text-xs text-[#4a5060] hover:text-[#7a8294]">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
