'use client';

// LOCKED TEMPLATE from sax_locked_21_template_v1.svg
// DO NOT modify any geometry, paths, coordinates, or stroke widths

const DATA_TO_ID = {
  'octave': 'OCTAVE', 'L1': 'LH1', 'L2': 'LH2', 'L3': 'LH3',
  'R1': 'RH1', 'R2': 'RH2', 'R3': 'RH3',
  'palm-D': 'PALM_D', 'side-Bb': 'SIDE_Bb', 'side-C': 'SIDE_C',
  'G#': 'BIS', 'side-E': 'SIDE_E', 'side-F#': 'SIDE_F_SHARP',
  'low-B': 'LH_PINKY_1', 'low-Bb': 'LH_PINKY_2', 'low-C#': 'RH_PINKY',
  'low-Eb': 'BELL_1', 'low-C': 'BELL_2',
};

export default function SaxDiagram({ elements = [], size = 'md', blank = false }) {
  const pressed = new Set();
  if (!blank) elements.forEach(e => { if (DATA_TO_ID[e]) pressed.add(DATA_TO_ID[e]); });
  const c = id => pressed.has(id) ? 'pressed' : 'open';
  const w = size === 'lg' ? 394 : size === 'sm' ? 80 : 200;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 394 759" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>
      <rect fill="#F3F3F3" x="0" y="0" width="394" height="759"/>

      <ellipse className={c('OCTAVE')} cx="182" cy="50" rx="30" ry="15" transform="rotate(-20,182,50)"/>
      <ellipse className={c('PALM_D')} cx="305" cy="80" rx="16" ry="40" transform="rotate(-15,305,80)"/>
      <path className={c('THUMB_REST')} d="M106 97 C98 90 90 83 81 78 C82 90 87 99 88 111 C88 124 93 131 105 133 C117 134 119 148 121 156 C131 151 129 132 125 122 C121 113 114 104 106 97 Z"/>
      <circle className={c('LH1')} cx="182" cy="121" r="33"/>
      <ellipse className={c('SIDE_Bb')} cx="350" cy="120" rx="16" ry="38" transform="rotate(-15,350,120)"/>
      <ellipse className={c('SIDE_C')} cx="305" cy="160" rx="16" ry="38" transform="rotate(-15,305,160)"/>
      <ellipse className={c('BIS')} cx="231" cy="165" rx="20" ry="17"/>
      <circle className={c('LH2')} cx="181" cy="210" r="33"/>
      <circle className={c('LH3')} cx="181" cy="300" r="33"/>
      <rect className={c('LH_PINKY_1')} x="70" y="282" width="30" height="53" rx="8"/>
      <ellipse className={c('SIDE_E')} cx="276" cy="319" rx="44" ry="14"/>
      <ellipse className={c('SIDE_F_SHARP')} cx="253" cy="355" rx="20" ry="18"/>
      <ellipse className={c('SIDE_ALT')} cx="300" cy="355" rx="20" ry="18"/>
      <rect className={c('LH_PINKY_2')} x="70" y="341" width="30" height="54" rx="8"/>
      <line className="divider" x1="148" y1="367" x2="214" y2="367"/>
      <ellipse className={c('SIDE_LOW')} cx="276" cy="395" rx="44" ry="14"/>
      <circle className={c('RH1')} cx="182" cy="433" r="33"/>
      <rect className={c('RH_PINKY')} x="70" y="405" width="30" height="54" rx="8"/>
      <circle className={c('RH2')} cx="182" cy="525" r="33"/>
      <circle className={c('RH3')} cx="181" cy="612" r="33"/>
      <ellipse className={c('BELL_1')} cx="181" cy="679" rx="36" ry="14"/>
      <ellipse className={c('BELL_2')} cx="182" cy="716" rx="35" ry="14"/>
    </svg>
  );
}
