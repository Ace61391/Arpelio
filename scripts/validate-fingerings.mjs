#!/usr/bin/env node
// Validates every fingering chart in src/data. Run with `npm run validate`; it also runs before `npm run build`.
// It catches the classes of error found in the Nov 2026 audit (see docs/fingering-sources.md):
//   - a brass fingering that cannot sound its note on the harmonic series
//   - a key that a fingering uses but the diagram has no shape for (so it silently fails to draw)
//   - two different notes that draw the same picture
//   - gaps, duplicates and pitch metadata that does not add up
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEYS_BY_INSTRUMENT } from '../src/components/diagrams/keymaps.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data');
const errors = [];
const err = (inst, note, msg) => errors.push(`${inst} ${note}: ${msg}`);

const STEP = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = (n) => {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(n);
  if (!m) throw new Error(`bad note name ${n}`);
  return 12 * (Number(m[3]) + 1) + STEP[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
};

// Written pitch (MIDI) of the open fundamental, and how far each valve combination lowers it.
const FUNDAMENTAL = { 'bb-trumpet': 48, 'french-horn': 36, 'euphonium': 34, 'bb-tuba': 22, 'trombone': 34 };
const VALVE_DROP = { '': 0, '2': 1, '1': 2, '12': 3, '3': 3, '23': 4, '13': 5, '123': 6 };
// Partials a primary fingering may use. 7, 11, 13 and 14 are too far out of tune to teach as a primary.
const PRIMARY_PARTIALS = new Set([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24]);

function partialFor(inst, noteMidi, elements) {
  let drop;
  if (inst === 'trombone') {
    if (elements.length !== 1) return null;
    drop = Number(elements[0].split('-')[1]) - 1;
  } else {
    const key = elements.map((e) => e.split('-')[1]).sort().join('');
    if (!(key in VALVE_DROP)) return null;
    drop = VALVE_DROP[key];
  }
  const target = noteMidi + drop - FUNDAMENTAL[inst];
  for (let n = 2; n <= 24; n++) if (Math.abs(12 * Math.log2(n) - target) < 0.5) return n;
  return null;
}

const instrumentsJs = fs.readFileSync(path.join(DATA, 'instruments.js'), 'utf8');
const declaredCounts = Object.fromEntries(
  [...instrumentsJs.matchAll(/id: '([^']+)'[^}]*?notes: (\d+)/g)].map((m) => [m[1], Number(m[2])]),
);

let total = 0;
for (const file of fs.readdirSync(DATA).filter((f) => f.endsWith('.json')).sort()) {
  const inst = file.replace('.json', '');
  const data = JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
  const drawn = new Set(KEYS_BY_INSTRUMENT[inst] || []);
  const modelled = new Set(data.diagram.elements.map((e) => e.id));
  if (inst === 'recorder') ['thumb-half', 'R3-half', 'R4-half'].forEach((k) => modelled.add(k));
  const offset = data.instrument.concert_pitch_offset;
  const isBrass = inst in FUNDAMENTAL;

  for (const id of modelled) if (!drawn.has(id)) err(inst, '(key model)', `key "${id}" has no shape in the diagram`);
  if (declaredCounts[inst] !== undefined && declaredCounts[inst] !== data.fingerings.length) {
    err(inst, '(count)', `instruments.js says ${declaredCounts[inst]} notes, data has ${data.fingerings.length}`);
  }

  const seen = new Map();
  let prev = null;
  for (const f of data.fingerings) {
    total++;
    const w = f.note.written;
    const m = midi(w);
    if (f.note.midi !== m) err(inst, w, `midi ${f.note.midi} does not match the written note (${m})`);
    if (prev !== null && m !== prev + 1) err(inst, w, `not chromatic: previous note was MIDI ${prev}`);
    prev = m;
    const concert = midi(f.note.concert);
    if (Math.abs(concert - m) !== Math.abs(offset)) err(inst, w, `concert ${f.note.concert} is not ${offset} semitones from written`);
    const hz = 440 * 2 ** ((concert - 69) / 12);
    if (Math.abs(hz - f.note.frequency) > 0.6) err(inst, w, `frequency ${f.note.frequency} should be ${hz.toFixed(2)}`);

    const all = [['primary', f.primary], ...f.alternates.map((a, i) => [`alternate ${i + 1}`, a])];
    const sets = new Set();
    for (const [label, fg] of all) {
      for (const e of fg.elements) {
        if (!modelled.has(e)) err(inst, w, `${label} uses "${e}", which is not in the key model`);
        else if (!drawn.has(e)) err(inst, w, `${label} uses "${e}", which the diagram cannot draw`);
      }
      const key = [...fg.elements].sort().join(' ');
      if (sets.has(key)) err(inst, w, `${label} repeats another fingering of the same note`);
      sets.add(key);

      if (isBrass) {
        const p = partialFor(inst, m, fg.elements);
        const raised = (fg.text_notation || '').startsWith('♯');
        if (p === null) err(inst, w, `${label} (${fg.text_notation || fg.valve_notation}) cannot sound this note on the harmonic series`);
        else if (label === 'primary' && !(PRIMARY_PARTIALS.has(p) || (p === 7 && raised))) {
          err(inst, w, `primary uses partial ${p}, which is too far out of tune to be a primary`);
        }
        if (inst !== 'trombone') {
          const vn = fg.elements.map((e) => e.split('-')[1]).sort().join('') || '0';
          if (fg.valve_notation != null && fg.valve_notation !== vn) err(inst, w, `${label}: valve_notation "${fg.valve_notation}" does not match the valves pressed (${vn})`);
        } else if (!String(fg.text_notation).includes(fg.elements[0].split('-')[1])) {
          err(inst, w, `${label}: text "${fg.text_notation}" does not match ${fg.elements[0]}`);
        }
      }
    }

    // Two notes less than an octave apart must not draw the same picture (flute/recorder octaves legitimately repeat).
    const pk = [...f.primary.elements].sort().join(' ');
    if (!isBrass && seen.has(pk) && m - seen.get(pk).m < 12) {
      err(inst, w, `primary is identical to ${seen.get(pk).w}`);
    }
    if (!isBrass) seen.set(pk, { m, w });
  }
}

// public/llms.txt states note counts as plain text; keep them in step with the data.
const llmsPath = path.join(ROOT, 'public', 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  const hidden = new Set([...instrumentsJs.matchAll(/id: '([^']+)'[^}]*?hidden: true/g)].map((m) => m[1]));
  let visibleTotal = 0;
  for (const [id, count] of Object.entries(declaredCounts)) {
    if (hidden.has(id)) continue;
    visibleTotal += count;
    const m = new RegExp(`/instruments/${id}\\): (\\d+) notes`).exec(llms);
    if (m && Number(m[1]) !== count) err(id, '(llms.txt)', `llms.txt says ${m[1]} notes, data has ${count}`);
  }
  const t = /across (\d+) individually verified notes/.exec(llms);
  if (t && Number(t[1]) !== visibleTotal) err('llms.txt', '(total)', `says ${t[1]} notes, published instruments have ${visibleTotal}`);
}

if (errors.length) {
  console.error(`Fingering validation FAILED — ${errors.length} problem(s):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`Fingering validation passed: ${total} fingerings checked.`);
