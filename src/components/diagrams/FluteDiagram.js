'use client';
import { FLUTE_KEYS as DATA_TO_ID } from './keymaps.mjs';
import { INK, key, body, guide, divider, nameLabel, noteLabel } from './diagramStyle';

// Flute, head joint to the left. Redrawn November 2026; treat the geometry as locked.
// Which data element lights which shape is set in keymaps.mjs, not here.
//
// Layout, each point checked against published key schemes (docs/fingering-sources.md):
//   - thumb keys below L1: the B-flat lever toward the head, the B key beside it toward the foot
//   - G-sharp lever above, just past L3 (left little finger)
//   - below, on the thumb-key side: the B-flat lever before R1, the D trill between R1 and R2, the D-sharp trill between R2 and R3
//   - E-flat key after R3, then the foot keys side by side across the tube: C-sharp nearest the player, then C, then B

const MAIN = { LH1: 80, LH2: 112, LH3: 144, RH1: 204, RH2: 236, RH3: 268 };

export default function FluteDiagram({ elements = [], size = 'md', blank = false, labels = false }) {
  const pressed = new Set();
  if (!blank) elements.forEach(e => { if (DATA_TO_ID[e]) pressed.add(DATA_TO_ID[e]); });
  const k = id => key(pressed.has(id));
  const h = labels ? 128 : 110;
  const w = size === 'lg' ? 380 : size === 'sm' ? 160 : '100%';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} viewBox={`0 0 380 ${h}`} style={{ display: 'block', maxWidth: size === 'md' && !labels ? 380 : undefined, margin: '0 auto' }}>
      {/* tube, with the head joint and foot joint marked */}
      <rect {...body} x="8" y="50" width="364" height="20" rx="10" />
      <path {...guide} d="M50 50 V70 M298 50 V70" />
      <ellipse cx="28" cy="60" rx="8" ry="4.5" style={{ fill: '#fff', stroke: '#aab1bd', strokeWidth: 1.2 }} />

      {Object.entries(MAIN).map(([id, x]) => <circle key={id} {...k(id)} cx={x} cy="60" r="12" />)}
      <path {...divider} d="M174 40 V80" />

      <rect {...k('THUMB_Bb')} x="52" y="84" width="16" height="15" rx="6.5" />
      <rect {...k('THUMB_B')} x="72" y="84" width="42" height="15" rx="7.5" />
      <rect {...k('G_SHARP')} x="150" y="20" width="26" height="14" rx="7" transform="rotate(-18 163 27)" />

      <ellipse {...k('Bb_LEVER')} cx="186" cy="93" rx="5.5" ry="8.5" />
      <ellipse {...k('D_TRILL')} cx="220" cy="93" rx="5" ry="8.5" />
      <ellipse {...k('DS_TRILL')} cx="252" cy="93" rx="5" ry="8.5" />

      <rect {...k('Eb')} x="282" y="78" width="15" height="27" rx="7.5" transform="rotate(-14 289 91)" />
      <rect {...k('FOOT_B')} x="312" y="38" width="24" height="10" rx="5" />
      <rect {...k('FOOT_C')} x="312" y="53" width="24" height="10" rx="5" />
      <rect {...k('FOOT_Cs')} x="309" y="68" width="30" height="18" rx="7" />

      {labels && (
        <>
          {Object.entries(MAIN).map(([id, x], i) => (
            <text key={id} x={x} y="64" textAnchor="middle" fontSize="11" style={{ ...nameLabel.style, fill: pressed.has(id) ? '#fff' : INK }}>{(i % 3) + 1}</text>
          ))}
          <text {...noteLabel} x="112" y="38" textAnchor="middle" fontSize="8">left hand</text>
          <text {...noteLabel} x="236" y="38" textAnchor="middle" fontSize="8">right hand</text>
          <text {...nameLabel} x="60" y="111" textAnchor="middle" fontSize="8.5">B♭</text>
          <text {...nameLabel} x="93" y="111" textAnchor="middle" fontSize="8.5">B</text>
          <text {...noteLabel} x="76" y="122" textAnchor="middle" fontSize="7.5">thumb</text>
          <text {...nameLabel} x="163" y="12" textAnchor="middle" fontSize="8.5">G♯</text>
          <text {...nameLabel} x="186" y="113" textAnchor="middle" fontSize="8">B♭</text>
          <text {...noteLabel} x="186" y="122" textAnchor="middle" fontSize="7">lever</text>
          <text {...nameLabel} x="220" y="113" textAnchor="middle" fontSize="8">D</text>
          <text {...nameLabel} x="252" y="113" textAnchor="middle" fontSize="8">D♯</text>
          <text {...noteLabel} x="236" y="122" textAnchor="middle" fontSize="7">trill</text>
          <text {...nameLabel} x="290" y="118" textAnchor="middle" fontSize="8.5">E♭</text>
          <text {...nameLabel} x="343" y="46.5" fontSize="8.5">B</text>
          <text {...nameLabel} x="343" y="61.5" fontSize="8.5">C</text>
          <text {...nameLabel} x="343" y="80.5" fontSize="8.5">C♯</text>
        </>
      )}
    </svg>
  );
}
