// Small line icons for the three worksheet types (replaces emoji, which render differently on every device).
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const ICONS = {
  // filled diagram + note name: a reference card
  reference: (<><rect {...S} x="4" y="3" width="16" height="18" rx="2.5" /><circle cx="9" cy="9" r="1.8" fill="currentColor" /><circle cx="15" cy="9" r="1.8" fill="currentColor" /><path {...S} d="M8 15h8M8 18h5" /></>),
  // filled diagram, name left blank
  identify: (<><rect {...S} x="4" y="3" width="16" height="18" rx="2.5" /><circle cx="9" cy="9" r="1.8" fill="currentColor" /><circle cx="15" cy="9" r="1.8" fill="currentColor" /><path {...S} d="M8 17h8" strokeDasharray="1.5 2.5" /></>),
  // blank diagram to fill in, name given
  fill: (<><rect {...S} x="4" y="3" width="16" height="18" rx="2.5" /><circle {...S} cx="9" cy="9" r="1.8" /><circle {...S} cx="15" cy="9" r="1.8" /><path {...S} d="M8 15h8M8 18h5" /></>),
};
export default function WorksheetIcon({ mode, className = 'w-7 h-7' }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">{ICONS[mode] || ICONS.reference}</svg>;
}
