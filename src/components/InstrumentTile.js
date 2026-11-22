import InstrumentArt from './InstrumentArt';

// The picture + name block shared by every instrument card (builder, charts index, homepage).
export default function InstrumentTile({ inst, selected = false, compact = false }) {
  const tint = inst.family === 'brass' ? 'bg-[#fdf3e3] text-[#b5701a]' : 'bg-[#e8f6f0] text-[#1f7d5d]';
  return (
    <>
      <div className={`rounded-xl ${tint} flex items-center justify-center ${compact ? 'h-20 mb-3' : 'h-28 mb-4'} ${selected ? 'ring-2 ring-accent' : ''}`}>
        <InstrumentArt instrumentId={inst.id} className={compact ? 'h-14 w-auto' : 'h-20 w-auto'} />
      </div>
      <div className={`font-bold text-[#1a1d23] leading-tight ${compact ? 'text-sm' : 'text-lg'}`}>{inst.name}</div>
      <div className="text-xs text-[#7a8294] mt-1">{inst.notes} notes · {inst.clef} clef</div>
    </>
  );
}
