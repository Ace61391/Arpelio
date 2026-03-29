import recorder from './recorder.json';
import flute from './flute.json';
import clarinet from './clarinet.json';
import saxophone from './saxophone.json';
import bbTrumpet from './bb-trumpet.json';
import frenchHorn from './french-horn.json';
import trombone from './trombone.json';
import euphonium from './euphonium.json';
import bbTuba from './bb-tuba.json';

const DATA_MAP = {
  'recorder': recorder,
  'flute': flute,
  'clarinet': clarinet,
  'saxophone': saxophone,
  'bb-trumpet': bbTrumpet,
  'french-horn': frenchHorn,
  'trombone': trombone,
  'euphonium': euphonium,
  'bb-tuba': bbTuba,
};

export function getInstrumentData(id) {
  return DATA_MAP[id] || null;
}

export function getFingeringsForInstrument(id) {
  const data = DATA_MAP[id];
  if (!data) return [];
  return data.fingerings || [];
}

export function getInstrumentInfo(id) {
  const data = DATA_MAP[id];
  if (!data) return null;
  return data.instrument;
}
