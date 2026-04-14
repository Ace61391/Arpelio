'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { INSTRUMENTS } from '@/data/instruments';

const FAMILIES = [
  { id: 'all', label: 'All Instruments' },
  { id: 'woodwind', label: 'Woodwinds' },
  { id: 'brass', label: 'Brass' },
];

export default function InstrumentsClient() {
  const [filter, setFilter] = useState('all');
  const searchParams = useSearchParams();
  const preview = searchParams.get('preview') === 'true';
  const visible = preview ? INSTRUMENTS : INSTRUMENTS.filter(i => !i.hidden);
  const filtered = filter === 'all' ? visible : visible.filter(i => i.family === filter);

  return (
    <>
      <div className="flex gap-2 mb-8">
        {FAMILIES.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              filter === f.id
                ? 'border-accent bg-accent-light text-accent'
                : 'border-[#e5e8ed] bg-white text-[#4a5060] hover:border-[#d0d4dc]'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inst => (
          <Link key={inst.id} href={`/instruments/${inst.id}`}
            className="bg-white border border-[#e5e8ed] rounded-card p-6 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${inst.family === 'brass' ? 'bg-brass' : 'bg-woodwind'}`}>
                {inst.shortName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1d23] group-hover:text-accent transition-colors">{inst.name}</h3>
                <span className="text-xs text-[#7a8294]">{inst.audience}</span>
              </div>
            </div>
            <p className="text-sm text-[#4a5060] leading-relaxed mb-3">{inst.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f8f9fb] text-[#4a5060]">
                {inst.notes} notes
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f8f9fb] text-[#4a5060]">
                {inst.clef} clef
              </span>
              {inst.transposition !== 'C' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f8f9fb] text-[#4a5060]">
                  {inst.transposition} transposition
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
