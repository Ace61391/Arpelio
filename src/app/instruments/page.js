'use client';
import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS } from '@/data/instruments';

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
  const filtered = filter === 'all' ? INSTRUMENTS : INSTRUMENTS.filter(i => i.family === filter);

  return (
    <>
      <Nav />
      <div className="px-6 md:px-8 py-10 max-w-[1160px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1d23] mb-2 tracking-tight">
          Choose Your Instrument
        </h1>
        <p className="text-base text-[#4a5060] mb-8">
          Select an instrument to view its interactive fingering chart, study with flashcards, or take a quiz.
        </p>

        {/* Family filter */}
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

        {/* Instrument grid */}
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
      </div>
      <Footer />
    </>
  );
}
