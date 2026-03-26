import sopranoRecorder from './soprano-recorder.json';
import altoRecorder from './alto-recorder.json';
import flute from './flute.json';
import piccolo from './piccolo.json';
import bbClarinet from './bb-clarinet.json';
import bassClarinet from './bass-clarinet.json';
import altoSaxophone from './alto-saxophone.json';
import tenorSaxophone from './tenor-saxophone.json';
import baritoneSaxophone from './baritone-saxophone.json';
import bbTrumpet from './bb-trumpet.json';
import frenchHorn from './french-horn.json';
import trombone from './trombone.json';
import euphonium from './euphonium.json';
import bbTuba from './bb-tuba.json';

const DATA_MAP = {
  'soprano-recorder': sopranoRecorder,
  'alto-recorder': altoRecorder,
  'flute': flute,
  'piccolo': piccolo,
  'bb-clarinet': bbClarinet,
  'bass-clarinet': bassClarinet,
  'alto-saxophone': altoSaxophone,
  'tenor-saxophone': tenorSaxophone,
  'baritone-saxophone': baritoneSaxophone,
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
