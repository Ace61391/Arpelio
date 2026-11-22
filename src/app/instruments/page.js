'use client';
import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS } from '@/data/instruments';
import InstrumentTile from '@/components/InstrumentTile';

const FAMILIES = [
  { id: 'all', label: 'All Instruments' },
  { id: 'woodwind', label: 'Woodwinds' },
  { id: 'brass', label: 'Brass' },
];

const FAMILY_COLORS = {
  woodwind: 'bg-woodwind',
  brass: 'bg-brass',
};

export default function InstrumentsPage() {
  const [filter, setFilter] = useState('all');
  const visible = INSTRUMENTS.filter(i => !i.hidden);
  const filtered = filter === 'all' ? visible : visible.filter(i => i.family === filter);

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[1160px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          Band Instrument Fingering Charts
        </h1>
        <p className="text-base text-[#4a5060] mb-8">
          Pick an instrument to see every note, its fingering, and common alternates — then turn any selection into a printable chart or quiz worksheet.
        </p>

        {/* Family filter */}
        <div className="flex gap-2 mb-8">
          {FAMILIES.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                filter === f.id
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-[#e5e8ed] bg-white text-[#4a5060] hover:border-[#d0d4dc]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Instrument grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(inst => (
            <Link key={inst.id} href={`/instruments/${inst.id}`}
              className="bg-white border border-[#e5e8ed] rounded-card p-6 hover:border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group">
              <InstrumentTile inst={inst} />
              <p className="text-sm text-[#4a5060] leading-relaxed mt-3 mb-3">{inst.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f8f9fb] text-[#4a5060]">{inst.audience}</span>
                {inst.transposition !== 'C' && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#f8f9fb] text-[#4a5060]">
                    {inst.transposition} transposition
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
