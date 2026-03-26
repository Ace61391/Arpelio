export const INSTRUMENTS = [
  { id: 'soprano-recorder', name: 'Soprano Recorder', shortName: 'Recorder', family: 'woodwind', familyColor: 'recorder', clef: 'treble', transposition: 'C', audience: 'Elementary', notes: 27, description: 'The standard elementary school instrument. English (Baroque) fingering.' },
  { id: 'alto-recorder', name: 'Alto Recorder', shortName: 'Alto Recorder', family: 'woodwind', familyColor: 'recorder', clef: 'treble', transposition: 'C', audience: 'Elementary', notes: 27, description: 'Treble recorder in F. Same fingering patterns as soprano.' },
  { id: 'flute', name: 'Flute', shortName: 'Flute', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'C', audience: 'Band', notes: 38, description: 'Concert C flute. Boehm system, closed G#.' },
  { id: 'piccolo', name: 'Piccolo', shortName: 'Piccolo', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'C', audience: 'Band', notes: 37, description: 'Sounds one octave higher than written. Same fingerings as flute.' },
  { id: 'bb-clarinet', name: 'B♭ Clarinet', shortName: 'Clarinet', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Bb', audience: 'Band', notes: 40, description: 'Boehm system. Overblows at a twelfth, not an octave.' },
  { id: 'bass-clarinet', name: 'Bass Clarinet', shortName: 'Bass Clarinet', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Bb', audience: 'Band', notes: 40, description: 'Same fingerings as B♭ clarinet. Sounds one octave lower.' },
  { id: 'alto-saxophone', name: 'Alto Saxophone', shortName: 'Alto Sax', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Eb', audience: 'Band / Jazz', notes: 33, description: 'E♭ transposition. The most common beginner saxophone.' },
  { id: 'tenor-saxophone', name: 'Tenor Saxophone', shortName: 'Tenor Sax', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Bb', audience: 'Band / Jazz', notes: 33, description: 'Same fingerings as alto. B♭ transposition.' },
  { id: 'baritone-saxophone', name: 'Baritone Saxophone', shortName: 'Bari Sax', family: 'woodwind', familyColor: 'woodwind', clef: 'treble', transposition: 'Eb', audience: 'Band / Jazz', notes: 33, description: 'Same fingerings as alto. E♭ transposition, sounds lowest.' },
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
