export const INSTRUMENTS = [
  { id: 'recorder', name: 'Recorder', shortName: 'Recorder', family: 'woodwind', familyColor: 'recorder', clef: 'treble', transposition: 'C', audience: 'Elementary', notes: 27, description: 'Soprano & alto recorder. English (Baroque) fingering. Same fingerings for all sizes.' },
  { id: 'flute', name: 'Flute', shortName: 'Flute', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'C', audience: 'Band', notes: 38, description: 'Concert C flute. Boehm system, closed G#.' },
  { id: 'clarinet', name: 'Clarinet', shortName: 'Clarinet', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Bb', audience: 'Band', notes: 40, description: 'Boehm system. Same fingerings for B♭ soprano and bass clarinet.' },
  { id: 'saxophone', name: 'Saxophone', shortName: 'Saxophone', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'variable', audience: 'Band / Jazz', notes: 33, description: 'All saxophones share the same fingerings — alto, tenor, baritone, soprano.' },
  { id: 'bb-trumpet', name: 'B♭ Trumpet', shortName: 'Trumpet', family: 'brass', familyColor: 'brass', clef: 'treble', transposition: 'Bb', audience: 'Band / Jazz', notes: 31, description: 'Three valves. The most common brass beginner instrument.' },
  { id: 'french-horn', name: 'French Horn', shortName: 'French Horn', family: 'brass', familyColor: 'brass', clef: 'treble', transposition: 'F', audience: 'Band / Orchestra', notes: 43, description: 'Horn in F. Left-hand valves. Wide range.' },
  { id: 'trombone', name: 'Trombone', shortName: 'Trombone', family: 'brass', familyColor: 'brass', clef: 'bass', transposition: 'C', audience: 'Band / Jazz', notes: 31, description: 'Slide positions 1–7. Reads concert pitch in bass clef.' },
  { id: 'euphonium', name: 'Euphonium', shortName: 'Euphonium', family: 'brass', familyColor: 'brass', clef: 'bass', transposition: 'C', audience: 'Band', notes: 31, description: 'Three valves. Bass clef, concert pitch.' },
  { id: 'bb-tuba', name: 'BB♭ Tuba', shortName: 'Tuba', family: 'brass', familyColor: 'brass', clef: 'bass', transposition: 'C', audience: 'Band', notes: 40, description: 'Three valves. Lowest standard band instrument.' },
];

export function getInstrument(id) {
  return INSTRUMENTS.find(i => i.id === id);
}

export function getInstrumentsByFamily(family) {
  if (!family || family === 'all') return INSTRUMENTS;
  return INSTRUMENTS.filter(i => i.family === family);
}
