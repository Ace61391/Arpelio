'use client';
import { CLARINET_KEYS as DATA_TO_ID } from './keymaps.mjs';

// LOCKED TEMPLATE from clarinet-locked-template-v1.svg (Mason's Inkscape traces)
// DO NOT modify any geometry, paths, coordinates, or stroke widths

// Element -> shape bindings live in keymaps.mjs (shared with the validator).
// Front view: thumb hole and register key on the left, tone holes L1-L3 | R1-R3 down the centre.

export default function ClarinetDiagram({ elements = [], size = 'md', blank = false }) {
  const pressed = new Set();
  if (!blank) elements.forEach(e => { if (DATA_TO_ID[e]) pressed.add(DATA_TO_ID[e]); });
  const c = id => pressed.has(id) ? 'pressed' : 'open';
  const w = size === 'lg' ? 338 : size === 'sm' ? 65 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox="0 0 338 858" style={{display:'block'}}>
      <style>{`.open{fill:none;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.pressed{fill:#000;stroke:#000;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.divider{stroke:#000;stroke-width:2.5;stroke-linecap:round}`}</style>
      <rect fill="none" x="0" y="0" width="338" height="858"/>

      <ellipse className={c('THROAT_A')} cx="138.9563" cy="88.777634" rx="16.542416" ry="34.739075"/>
      <path className={c('REGISTER')} d="m 70.213369,100.90874 c 7.007988,37.82959 -6.007326,69.66195 -13.417738,69.66195 -7.410412,0 -20.886381,-31.92061 -13.417738,-69.66195 7.613477,-38.473238 14.995574,-73.237706 13.417738,-69.66196 -0.745607,1.689721 6.488012,32.254834 13.417738,69.66196 z"/>
      <path className={c('THROAT_GS')} d="m 214.3162,107.5257 c 5.36976,42.88798 -4.28371,54.15327 -14.15296,53.85476 -11.35531,-0.34346 -25.46154,-26.45575 -13.41774,-52.75193 16.64403,-36.340232 -20.53206,-77.027994 2.75707,-64.883034 7.51772,3.920387 20.93176,32.77598 24.81363,63.780204 z"/>

      <circle className={c('LH1')} cx="139" cy="171.33162" r="29"/>
      <circle className={c('THUMB_HOLE')} cx="57.102825" cy="215.55785" r="29"/>
      <circle className={c('LH2')} cx="139" cy="262.52185" r="29"/>

      <ellipse className={c('LH_SLIVER')} cx="107.14288" cy="337.52231" rx="37.421284" ry="5.3115134" transform="matrix(0.97281585,-0.23158006,0.2324928,0.97259812,0,0)"/>

      <ellipse className={c('SIDE_1')} cx="68.299484" cy="381.76352" rx="16.358612" ry="8.8226223"/>
      <ellipse className={c('SIDE_2')} cx="68.682518" cy="405.8252" rx="16.358612" ry="8.8226223"/>
      <ellipse className={c('SIDE_3')} cx="67.823906" cy="430.47043" rx="16.358612" ry="8.8226223"/>
      <ellipse className={c('SIDE_4')} cx="68.137535" cy="456.42416" rx="16.358612" ry="8.8226223"/>

      <circle className={c('LH3')} cx="139" cy="352.49612" r="29"/>
      <path className={c('CS_GS')} d="m 222.03599,397.7532 c -0.50885,6.76479 -8.22061,15.4375 -30.32777,9.55785 -22.20588,-5.90592 -34.00426,-5.49744 -34.00386,-9.55785 4e-4,-4.0605 15.61206,-3.55447 34.00386,-7.35218 21.29214,-4.3966 30.80122,1.05788 30.32777,7.35218 z"/>
      <line className="divider" x1="110.3" y1="418.5" x2="167.3" y2="418.5"/>

      <circle className={c('RH1')} cx="139" cy="483.79434" r="29"/>
      <ellipse className={c('LH_F')} cx="144.35934" cy="486.4281" rx="27.938303" ry="12.131105" transform="rotate(-13.08148)"/>
      <path className={c('LH_E')} d="m 219.09512,496.82391 c 0,27.71291 3.85909,58.93303 -5.14653,60.47173 -7.33399,1.25308 -7.03439,-30.41964 -21.32134,-56.79564 -13.19916,-24.36776 3.73021,-53.85476 12.86633,-53.85475 9.13612,1e-5 13.60154,22.46576 13.60154,50.17866 z"/>
      <path className={c('LH_FS')} d="m 254.38561,506.56555 c -5.79475,20.04445 -19.09032,46.19122 -22.97558,48.15682 -6.97469,3.52857 -5.33034,-25.21499 -5.33034,-48.15682 0,-22.94183 2.6604,-41.90746 10.47687,-41.90745 7.81646,-10e-6 24.20051,19.86812 17.82905,41.90745 z"/>
      <ellipse className={c('RH_SLIVER')} cx="244.38393" cy="575.25623" rx="34.18766" ry="8.0874033" transform="rotate(13.538116)"/>

      <circle className={c('RH2')} cx="139" cy="576" r="29"/>
      <circle className={c('RH3')} cx="139" cy="664.85345" r="29"/>

      <ellipse className={c('RH_GS')} cx="353.53809" cy="642.53223" rx="41.907455" ry="15.255784" transform="rotate(18.639353)"/>
      <ellipse className={c('RH_FS')} cx="307.1553" cy="658.04291" rx="41.907455" ry="15.255784" transform="rotate(18.639353)"/>
      <ellipse className={c('RH_F')} cx="369.29614" cy="685.42151" rx="41.907455" ry="15.255784" transform="rotate(18.639353)"/>
      <ellipse className={c('RH_E')} cx="325.09189" cy="701.04523" rx="41.907455" ry="15.255784" transform="rotate(18.639353)"/>
    </svg>
  );
}
