'use client';
import { SAX_KEYS as DATA_TO_ID } from './keymaps.mjs';

// LOCKED TEMPLATE from sax_locked_21_template_v1.svg
// DO NOT modify any geometry, paths, coordinates, or stroke widths

// Element -> shape bindings live in keymaps.mjs (shared with the validator).
// Front view: palm keys and left-pinky table on the right, right-hand side keys on the left.

export default function SaxDiagram({ elements = [], size = 'md', blank = false }) {
  const pressed = new Set();
  if (!blank) elements.forEach(e => { if (DATA_TO_ID[e]) pressed.add(DATA_TO_ID[e]); });
  const c = id => pressed.has(id) ? 'pressed' : 'open';
  const w = size === 'lg' ? 394 : size === 'sm' ? 80 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 394 759" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>
      <rect fill="none" x="0" y="0" width="394" height="759"/>

      <ellipse className={c('FRONT_F')} cx="182" cy="50" rx="30" ry="15" transform="rotate(-20,182,50)"/>
      <ellipse className={c('PALM_Eb')} cx="305" cy="80" rx="16" ry="40" transform="rotate(-15,305,80)"/>
      <path className={c('OCTAVE')} d="M106 97 C98 90 90 83 81 78 C82 90 87 99 88 111 C88 124 93 131 105 133 C117 134 119 148 121 156 C131 151 129 132 125 122 C121 113 114 104 106 97 Z"/>
      <circle className={c('LH1')} cx="182" cy="121" r="33"/>
      <ellipse className={c('PALM_D')} cx="350" cy="120" rx="16" ry="38" transform="rotate(-15,350,120)"/>
      <ellipse className={c('PALM_F')} cx="305" cy="160" rx="16" ry="38" transform="rotate(-15,305,160)"/>
      <ellipse className={c('BIS')} cx="231" cy="165" rx="20" ry="17"/>
      <circle className={c('LH2')} cx="181" cy="210" r="33"/>
      <circle className={c('LH3')} cx="181" cy="300" r="33"/>
      <rect className={c('SIDE_E')} x="70" y="282" width="30" height="53" rx="8"/>
      <ellipse className={c('TABLE_GS')} cx="276" cy="319" rx="44" ry="14"/>
      <ellipse className={c('TABLE_B')} cx="253" cy="355" rx="20" ry="18"/>
      <ellipse className={c('TABLE_Cs')} cx="300" cy="355" rx="20" ry="18"/>
      <rect className={c('SIDE_C')} x="70" y="341" width="30" height="54" rx="8"/>
      <line className="divider" x1="148" y1="367" x2="214" y2="367"/>
      <ellipse className={c('TABLE_Bb')} cx="276" cy="395" rx="44" ry="14"/>
      <circle className={c('RH1')} cx="182" cy="433" r="33"/>
      <rect className={c('SIDE_Bb')} x="70" y="405" width="30" height="54" rx="8"/>
      <circle className={c('RH2')} cx="182" cy="525" r="33"/>
      <circle className={c('RH3')} cx="181" cy="612" r="33"/>
      <ellipse className={c('LOW_Eb')} cx="181" cy="679" rx="36" ry="14"/>
      <ellipse className={c('LOW_C')} cx="182" cy="716" rx="35" ry="14"/>
    </svg>
  );
}
