// What happens to a fingering when a student taps a key on a diagram.
import { KEYS_BY_INSTRUMENT } from '../../components/diagrams/keymaps.mjs';

const TYPE = { recorder: 'recorder', flute: 'flute', trombone: 'slide' };
export const diagramType = (instrumentId) => TYPE[instrumentId] || 'valve';

// Keys that have a half-covered state on the recorder: tap cycles open -> covered -> half -> open.
const CYCLE = { thumb: ['thumb', 'thumb-half'], R3: ['R3', 'R3-half'], R4: ['R4', 'R4-half'] };

export function toggleElement(instrumentId, elements, key) {
  const type = diagramType(instrumentId);
  const set = new Set(elements);

  if (type === 'slide') {
    // one position at a time; tapping the current one clears it
    return set.has(key) ? [] : [key];
  }
  if (type === 'recorder' && CYCLE[key]) {
    const [full, half] = CYCLE[key];
    if (set.has(full)) { set.delete(full); set.add(half); }
    else if (set.has(half)) { set.delete(half); }
    else { set.add(full); }
  } else if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  // keep a stable, chart-like order
  const order = KEYS_BY_INSTRUMENT[instrumentId] || [];
  return [...set].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}
