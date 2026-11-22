#!/usr/bin/env node
// Tests the quiz engine against the real fingering data. Run: node scripts/test-quiz-engine.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildQuestions, publicQuestions, gradeQuiz, validateQuiz, fingeringKey, elementsFromGiven } from '../src/lib/quiz/engine.mjs';
import { toggleElement } from '../src/lib/quiz/interact.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (id) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', `${id}.json`), 'utf8')).fingerings;
const instrumentsJs = fs.readFileSync(path.join(ROOT, 'src', 'data', 'instruments.js'), 'utf8');
const instruments = [...instrumentsJs.matchAll(/\{ id: '([^']+)', name: '([^']+)'.*?family: '([^']+)'(.*?)\}/g)]
  .map((m) => ({ id: m[1], name: m[2], family: m[3], hidden: /hidden: true/.test(m[4]) }));
const family = (id) => instruments.find((i) => i.id === id).family;
let checks = 0;
const eq = (a, b, msg) => { assert.deepEqual(a, b, msg); checks++; };
const ok = (c, msg) => { assert.ok(c, msg); checks++; };

// ---- validation
const deps = { instruments, fingeringsFor: load };
eq(validateQuiz({ instrument: 'clarinet', mode: 'fill', notes: ['E3'] }, deps).ok, false, 'a hidden instrument cannot be quizzed');
eq(validateQuiz({ instrument: 'flute', mode: 'reference', notes: ['D4'] }, deps).ok, false, 'reference is not a quiz type');
eq(validateQuiz({ instrument: 'flute', mode: 'fill', notes: ['D4', 'Z9'] }, deps).ok, false, 'an unknown note is refused');
eq(validateQuiz({ instrument: 'flute', mode: 'fill', notes: [] }, deps).ok, false, 'an empty quiz is refused');
const v = validateQuiz({ instrument: 'flute', mode: 'fill', notes: ['G4', 'D4', 'D4'], title: '  ', settings: { shuffle: false, junk: 1 } }, deps);
eq([v.quiz.notes, v.quiz.title, v.quiz.settings], [['D4', 'G4'], 'Flute quiz', { shuffle: false, show_answers: true, accept_alternates: true }], 'notes are de-duplicated and put in chart order; title and settings get defaults');

// ---- identify on a woodwind
const flute = load('flute');
const fq = { instrument: 'flute', mode: 'identify', notes: ['D4', 'E4', 'E5', 'G#4', 'B4', 'C5'], settings: {} };
const fQs = buildQuestions(flute, fq, family('flute'));
eq(fQs.map((q) => q.kind), Array(6).fill('identify'), 'woodwind identify asks one note per question');
ok(publicQuestions(fQs).every((q) => !('answer' in q) && !('label' in q)), 'the answer key is not in what the browser gets');
ok(fQs.every((q) => q.prompt.options.includes(q.answer.own)), 'the right name is always among the options');
let g = gradeQuiz(flute, fq, 'woodwind', { D4: 'D', E4: 'E', E5: 'E', 'G#4': 'G', B4: 'C', C5: 'C' });
eq([g.score, g.total], [4, 6], 'four right, two wrong');
eq(g.results.filter((r) => !r.correct).map((r) => [r.q, r.given, r.expected]), [['G#4', 'G', 'G♯/A♭'], ['B4', 'C', 'B']], 'wrong answers carry what was given and what was expected');
ok(g.stored.every((s) => Object.keys(s).join() === 'q,label,given,correct'), 'what is stored has no answer key');
eq(gradeQuiz(flute, fq, 'woodwind', {}).score, 0, 'no answers scores zero');
eq(gradeQuiz(flute, fq, 'woodwind', { D4: ['D'], E4: 7, __proto__: 'x' }).score, 0, 'malformed answers are wrong, not a crash');
// small quiz: options are padded to four
eq(buildQuestions(flute, { mode: 'identify', notes: ['D4', 'E4'] }, 'woodwind')[0].prompt.options.length, 4, 'a two-note quiz still offers four choices');

// ---- identify on brass: one question per fingering
const tpt = load('bb-trumpet');
const beginner = tpt.filter((f) => f.pedagogy?.beginner_note).map((f) => f.note.written);
const tq = { instrument: 'bb-trumpet', mode: 'identify', notes: beginner, settings: {} };
const tQs = buildQuestions(tpt, tq, family('bb-trumpet'));
eq(new Set(tQs.map((q) => fingeringKey(q.prompt.elements))).size, tQs.length, 'brass identify shows each fingering once');
const open = tQs.find((q) => q.prompt.elements.length === 0);
ok(open.answer.labels.length > 1 && open.prompt.count === open.answer.labels.length, 'the open fingering expects several notes and says how many');
const all = Object.fromEntries(tQs.map((q) => [q.id, q.answer.labels]));
eq(gradeQuiz(tpt, tq, 'brass', all).score, tQs.length, 'picking exactly the right notes is full marks');
const partial = { ...all, [open.id]: open.answer.labels.slice(0, 1) };
eq(gradeQuiz(tpt, tq, 'brass', partial).score, tQs.length - 1, 'picking only some of the notes for a fingering is wrong');
const extra = { ...all, [open.id]: [...open.prompt.options] };
eq(gradeQuiz(tpt, tq, 'brass', extra).score, tQs.length - 1, 'picking every option is wrong too');

// ---- fill
const fillQ = { instrument: 'bb-trumpet', mode: 'fill', notes: ['C4', 'D4', 'E4'], settings: {} };
const key = (id, n) => (id ? load(id) : tpt).find((f) => f.note.written === n).primary.elements;
g = gradeQuiz(tpt, fillQ, 'brass', { C4: [], D4: ['valve-3', 'valve-1'], E4: ['valve-1'] });
eq(g.results.map((r) => [r.correct, r.given]), [[true, 'open'], [true, 'valve-1 valve-3'], [false, 'valve-1']], 'open counts when answered; order does not matter; a wrong fingering is wrong');
eq(gradeQuiz(tpt, fillQ, 'brass', { D4: key(null, 'D4') }).results.map((r) => r.given), ['', 'valve-1 valve-3', ''], 'a question never reached is unanswered, not "open"');
// alternates
const withAlt = tpt.find((f) => (f.alternates || []).length > 0);
const altQ = { instrument: 'bb-trumpet', mode: 'fill', notes: [withAlt.note.written], settings: {} };
eq(gradeQuiz(tpt, altQ, 'brass', { [withAlt.note.written]: withAlt.alternates[0].elements }).score, 1, 'an alternate fingering is accepted by default');
eq(gradeQuiz(tpt, { ...altQ, settings: { accept_alternates: false } }, 'brass', { [withAlt.note.written]: withAlt.alternates[0].elements }).score, 0, 'and refused when the teacher turns alternates off');
// every instrument: the chart's own primary fingering is full marks in fill mode
for (const inst of instruments.filter((i) => !i.hidden)) {
  const fl = load(inst.id);
  const q = { instrument: inst.id, mode: 'fill', notes: fl.map((f) => f.note.written).slice(0, 60), settings: {} };
  const answers = Object.fromEntries(fl.slice(0, 60).map((f) => [f.note.written, f.primary.elements]));
  const r = gradeQuiz(fl, q, inst.family, answers);
  eq(r.score, r.total, `${inst.id}: the charted fingering for every note is graded correct`);
  const iq = { ...q, mode: 'identify' };
  const qs = buildQuestions(fl, iq, inst.family);
  const right = Object.fromEntries(qs.map((x) => [x.id, x.kind === 'identify' ? x.answer.own : x.answer.labels]));
  const ri = gradeQuiz(fl, iq, inst.family, right);
  eq(ri.score, ri.total, `${inst.id}: the right note names are graded correct in identify mode`);
}
eq(elementsFromGiven('open'), [], 'a stored open answer draws as nothing pressed');
eq(elementsFromGiven('valve-1 valve-3'), ['valve-1', 'valve-3'], 'a stored fingering can be drawn again');

// ---- tapping the diagrams
eq(toggleElement('bb-trumpet', [], 'valve-2'), ['valve-2'], 'a valve goes down');
eq(toggleElement('bb-trumpet', ['valve-3', 'valve-1'], 'valve-3'), ['valve-1'], 'and comes back up');
eq(toggleElement('trombone', ['pos-2'], 'pos-5'), ['pos-5'], 'the slide has one position at a time');
eq(toggleElement('trombone', ['pos-5'], 'pos-5'), [], 'tapping the position again clears it');
let r = [];
r = toggleElement('recorder', r, 'thumb'); eq(r, ['thumb'], 'thumb: covered');
r = toggleElement('recorder', r, 'thumb'); eq(r, ['thumb-half'], 'thumb: half');
r = toggleElement('recorder', r, 'thumb'); eq(r, [], 'thumb: open again');
r = toggleElement('recorder', toggleElement('recorder', ['L1', 'thumb'], 'R4'), 'R4'); eq(r, ['thumb', 'L1', 'R4-half'], 'a double hole cycles to half, in chart order');
eq(toggleElement('flute', ['thumb', 'L1'], 'G#'), ['thumb', 'L1', 'G#'], 'a flute key toggles on');
// a student can reach every charted fingering by tapping
for (const inst of instruments.filter((i) => !i.hidden)) {
  for (const f of load(inst.id)) {
    let cur = [];
    for (const el of f.primary.elements) {
      const base = el.replace('-half', '');
      cur = toggleElement(inst.id, cur, base);
      if (el.endsWith('-half')) cur = toggleElement(inst.id, cur, base);
    }
    assert.equal(fingeringKey(cur), fingeringKey(f.primary.elements), `${inst.id} ${f.note.written} can be entered by tapping`);
  }
}
checks++;

console.log(`Quiz engine tests passed: ${checks} checks.`);
