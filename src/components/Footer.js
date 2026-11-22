import Link from 'next/link';
import { QUIZZES_ON } from '@/lib/quiz/flag';

export default function Footer() {
  return (
    <footer className="bg-[#1a1d23] px-8 py-12">
      <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.svg" alt="" className="w-7 h-7 rounded-[7px]" />
            <span className="text-lg font-extrabold text-[#f0f1f4] tracking-tight">Arpelio</span>
          </div>
          <p className="text-sm text-[#7a8294]">Fingering charts and printable quiz worksheets for band instruments. Free.</p>
        </div>
        <div className="flex gap-8 flex-wrap">
          {[
            { label: 'Fingering charts', href: '/instruments' },
            { label: 'Worksheet builder', href: '/builder' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
            ...(QUIZZES_ON ? [{ label: 'Teacher sign in', href: '/dashboard' }] : []),
          ].map(item => (
            <Link key={item.href} href={item.href} className="text-sm text-[#7a8294] hover:text-[#f0f1f4] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto mt-6 pt-6 border-t border-[#2a2d35] flex justify-between flex-wrap gap-3">
        <span className="text-xs text-[#7a8294]">© 2026 Arpelio · arpelio.com</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="text-xs text-[#7a8294] hover:text-[#f0f1f4]">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
