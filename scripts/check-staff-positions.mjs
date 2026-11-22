#!/usr/bin/env node
// Checks that StaffNote puts notes where standard notation puts them.
// Run with: node scripts/check-staff-positions.mjs
//
// The positions are computed in src/components/staffPosition.mjs. This script holds the facts they must
// satisfy, written out independently: which notes sit on the five lines and four spaces of each clef,
// where middle C goes, and that a flat or sharp never changes the line or space of its letter.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { staffStep, STAFF_LINES } from '../src/components/staffPosition.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const expect = (what, got, want) => { if (got !== want) errors.push(`${what}: step ${got}, expected ${want}`); };

const LINES = { treble: ['E4', 'G4', 'B4', 'D5', 'F5'], bass: ['G2', 'B2', 'D3', 'F3', 'A3'] };
const SPACES = { treble: ['F4', 'A4', 'C5', 'E5'], bass: ['A2', 'C3', 'E3', 'G3'] };
for (const clef of ['treble', 'bass']) {
  LINES[clef].forEach((n, i) => expect(`${clef} line ${i + 1} (${n})`, staffStep(n, clef), STAFF_LINES[clef][i]));
  SPACES[clef].forEach((n, i) => expect(`${clef} space ${i + 1} (${n})`, staffStep(n, clef), STAFF_LINES[clef][i] + 1));
}
// Middle C: first ledger line below the treble staff, first ledger line above the bass staff.
expect('middle C, treble', staffStep('C4', 'treble'), STAFF_LINES.treble[0] - 2);
expect('middle C, bass', staffStep('C4', 'bass'), STAFF_LINES.bass[4] + 2);

// Every charted note must have a position, and an accidental must not move it off its letter.
const instrumentsJs = fs.readFileSync(path.join(ROOT, 'src', 'data', 'instruments.js'), 'utf8');
const clefOf = Object.fromEntries([...instrumentsJs.matchAll(/id: '([^']+)'[^}]*?clef: '([^']+)'/g)].map((m) => [m[1], m[2]]));
let checked = 0;
for (const [id, clef] of Object.entries(clefOf)) {
  const { fingerings } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', `${id}.json`), 'utf8'));
  let prev = null;
  for (const f of fingerings) {
    const n = f.note.written;
    const step = staffStep(n, clef);
    checked++;
    if (step === null) { errors.push(`${id} ${n}: no staff position`); continue; }
    expect(`${id} ${n} vs its natural`, step, staffStep(n.replace(/[#b]/, ''), clef));
    if (prev !== null && step < prev) errors.push(`${id} ${n}: sits lower on the staff than the note before it`);
    prev = step;
  }
}

if (errors.length) {
  console.error(`Staff position check FAILED — ${errors.length} problem(s):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`Staff position check passed: ${checked} charted notes.`);
