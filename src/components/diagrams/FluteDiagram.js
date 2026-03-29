'use client';

// LOCKED TEMPLATE from flute_locked_16_template_v3.svg
// DO NOT modify any geometry, paths, coordinates, or stroke widths
// Only class toggles between "open" and "pressed"

const DATA_TO_ID = {
  'thumb': 'LH_AUX_2', 'L1': 'LH1', 'L2': 'LH2', 'L3': 'LH3',
  'G#': 'LH_AUX_1', 'Bb': 'THUMB',
  'R1': 'RH1', 'R2': 'RH2', 'R3': 'RH3',
  'D#-trill': 'RH_AUX_1', 'Eb': 'RH_PINKY_MAIN',
  'C#': 'RH_PINKY_BAR_1', 'C': 'RH_PINKY_BAR_2', 'B': 'RH_PINKY_LOWER',
};

export default function FluteDiagram({ elements = [], size = 'md', blank = false }) {
  const pressed = new Set();
  if (!blank) elements.forEach(e => { if (DATA_TO_ID[e]) pressed.add(DATA_TO_ID[e]); });
  const c = id => pressed.has(id) ? 'pressed' : 'open';
  const w = size === 'lg' ? 820 : size === 'sm' ? 160 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 820 355" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:3;stroke-linecap:round}`}</style>
      <rect fill="none" x="0" y="0" width="820" height="355"/>
      <line className="divider" x1="329" y1="124" x2="329" y2="186"/>

      <circle className={c('LH1')} cx="93" cy="156" r="31"/>
      <circle className={c('LH2')} cx="183" cy="156" r="31"/>
      <circle className={c('LH3')} cx="273" cy="156" r="31"/>
      <circle className={c('RH1')} cx="385" cy="156" r="31"/>
      <circle className={c('RH2')} cx="475" cy="156" r="31"/>
      <circle className={c('RH3')} cx="565" cy="156" r="31"/>

      <path className={c('THUMB')} d="M252 50 C238 50 230 58 230 70 C230 84 242 94 260 94 L288 94 C292 94 294 92 294 88 L294 76 C294 60 280 50 252 50 Z"/>
      <g transform="rotate(90, 93, 226)"><path className={c('LH_AUX_1')} d="M86 211 C76 211 73 218 73 226 C73 236 80 241 92 241 C107 241 113 234 113 225 C113 215 105 211 86 211 Z"/></g>
      <path className={c('LH_AUX_2')} d="M144 215 C136 217 130 224 130 231 C130 242 140 248 158 249 L195 249 C219 249 230 241 230 231 C230 220 218 213 193 213 L163 213 C154 213 148 214 144 215 Z"/>

      <ellipse className={c('RH_AUX_1')} cx="347" cy="221" rx="9" ry="16"/>
      <ellipse className="open" cx="430" cy="210" rx="9" ry="16"/>
      <ellipse className="open" cx="520" cy="210" rx="9" ry="16"/>

      <path className={c('RH_PINKY_MAIN')} d="M648 195 C643 195 640 191 638 184 C636 174 636 162 638 150 C640 142 643 134 647 130 C649 128 652 128 654 131 C656 135 656 142 656 150 L656 180 C656 189 655 194 651 195 Z"/>
      <rect className={c('RH_PINKY_BAR_1')} x="681" y="127" width="36" height="10" rx="5" ry="5"/>
      <rect className={c('RH_PINKY_BAR_2')} x="681" y="149" width="36" height="10" rx="5" ry="5"/>
      <path className={c('RH_PINKY_LOWER')} d="M694 168 C685 168 681 174 681 181 C681 189 688 195 700 195 L712 195 C724 195 729 189 729 181 C729 173 724 168 712 168 Z"/>
    </svg>
  );
}
