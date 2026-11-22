// Data element id -> SVG shape id, per diagram family.
// Single source of truth: the diagram components and scripts/validate-fingerings.mjs both read this.
// Shape identities were checked against the Woodwind Fingering Guide key descriptions
// (wfg.woodwind.org/*/..._fing.html) — see docs/fingering-sources.md.

export const FLUTE_KEYS = {
  'thumb': 'THUMB_B',        // long key below L1–L2: B (B-natural) thumb key
  'Bb': 'THUMB_Bb',          // small key beside it, toward the head: thumb B♭ (Briccialdi) lever
  'L1': 'LH1', 'L2': 'LH2', 'L3': 'LH3',
  'G#': 'G_SHARP',           // lever above, just past L3: G♯ (left little finger)
  'Bb-lever': 'Bb_LEVER',    // small key below, just before R1: B♭ side lever
  'R1': 'RH1', 'R2': 'RH2', 'R3': 'RH3',
  'D-trill': 'D_TRILL',      // between R1 and R2
  'D#-trill': 'DS_TRILL',    // between R2 and R3
  'Eb': 'Eb',
  'C#': 'FOOT_Cs',           // largest foot key, nearest the player
  'C': 'FOOT_C',             // middle foot key
  'B': 'FOOT_B',             // farthest foot key (B foot)
};

// Front view (as someone facing the player sees it): thumb hole + register key in the left column,
// right-hand side keys stacked on the left, left-pinky keys on the right, right-pinky keys 2x2 at the bottom.
export const CLARINET_KEYS = {
  'register': 'REGISTER', 'thumb': 'THUMB_HOLE',
  'A-key': 'THROAT_A', 'throat-G#': 'THROAT_GS',
  'L1': 'LH1', 'L2': 'LH2', 'L3': 'LH3',
  'L-sliver': 'LH_SLIVER', 'C#-key': 'CS_GS',
  'L4-C': 'LH_F', 'L4-E': 'LH_E', 'L4-Cs': 'LH_FS',
  'side-1': 'SIDE_1', 'side-2': 'SIDE_2', 'side-3': 'SIDE_3', 'side-4': 'SIDE_4',
  'R1': 'RH1', 'R2': 'RH2', 'R3': 'RH3',
  'R-sliver': 'RH_SLIVER',
  'R4-Eb': 'RH_GS', 'R4-Cs': 'RH_FS', 'R4-C': 'RH_F', 'R4-E': 'RH_E',
};

// Front view: palm keys and the left-pinky table on the right, right-hand side keys on the left.
export const SAX_KEYS = {
  'octave': 'OCTAVE',        // bean at top left (thumb)
  'front-F': 'FRONT_F',      // ellipse above L1
  'palm-Eb': 'PALM_Eb',      // topmost palm key
  'palm-D': 'PALM_D',        // outermost palm key
  'palm-F': 'PALM_F',        // lower palm key
  'L1': 'LH1', 'bis': 'BIS', 'L2': 'LH2', 'L3': 'LH3',
  'G#': 'TABLE_GS', 'low-B': 'TABLE_B', 'low-C#': 'TABLE_Cs', 'low-Bb': 'TABLE_Bb',
  'side-E': 'SIDE_E', 'side-C': 'SIDE_C', 'side-Bb': 'SIDE_Bb',
  'R1': 'RH1', 'R2': 'RH2', 'R3': 'RH3',
  'low-Eb': 'LOW_Eb', 'low-C': 'LOW_C',
};

export const RECORDER_KEYS = ['thumb', 'thumb-half', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'R3-half', 'R4', 'R4-half', 'bell'];
export const VALVE_KEYS = ['valve-1', 'valve-2', 'valve-3'];
export const SLIDE_KEYS = ['pos-1', 'pos-2', 'pos-3', 'pos-4', 'pos-5', 'pos-6', 'pos-7'];

export const KEYS_BY_INSTRUMENT = {
  'flute': Object.keys(FLUTE_KEYS),
  'clarinet': Object.keys(CLARINET_KEYS),
  'saxophone': Object.keys(SAX_KEYS),
  'recorder': RECORDER_KEYS,
  'bb-trumpet': VALVE_KEYS, 'french-horn': VALVE_KEYS, 'euphonium': VALVE_KEYS, 'bb-tuba': VALVE_KEYS,
  'trombone': SLIDE_KEYS,
};
