// Online quiz engine: turns a stored quiz into questions, and grades what a student sends back.
// Pure functions over the fingering data, so the server and the tests run exactly the same code.
//
// Three kinds of question:
//   identify      a fingering is shown; pick the note name (woodwinds, where a fingering means one note name)
//   identify-all  a fingering is shown; pick every note in the quiz that uses it (brass, where one fingering
//                 plays several notes, so "which note is this?" has no single answer)
//   fill          a note is shown; set the fingering on the diagram

export const QUIZ_MODES = ['identify', 'fill'];
export const SETTING_DEFAULTS = { shuffle: true, show_answers: true, accept_alternates: true };
export const MAX_NOTES = 60;

export const fingeringKey = (elements) => [...new Set(elements)].sort().join(' ');
const uniq = (list) => [...new Set(list)];

export function cleanSettings(raw = {}) {
  const out = {};
  for (const k of Object.keys(SETTING_DEFAULTS)) {
    out[k] = typeof raw?.[k] === 'boolean' ? raw[k] : SETTING_DEFAULTS[k];
  }
  return out;
}

// Check a quiz a teacher wants to create. Returns { ok, error } or { ok, quiz } with tidy values.
export function validateQuiz(input, { instruments, fingeringsFor }) {
  const inst = instruments.find((i) => i.id === input?.instrument && !i.hidden);
  if (!inst) return { ok: false, error: 'Choose an instrument.' };
  if (!QUIZ_MODES.includes(input.mode)) return { ok: false, error: 'Choose a quiz type.' };
  const known = new Set(fingeringsFor(inst.id).map((f) => f.note.written));
  const notes = uniq(Array.isArray(input.notes) ? input.notes.filter((n) => typeof n === 'string') : []);
  if (notes.length === 0) return { ok: false, error: 'Select at least one note.' };
  if (notes.length > MAX_NOTES) return { ok: false, error: `A quiz can have at most ${MAX_NOTES} notes.` };
  if (notes.some((n) => !known.has(n))) return { ok: false, error: 'One of the notes is not on this instrument.' };
  // keep the chart's low-to-high order whatever order the notes arrived in
  const ordered = fingeringsFor(inst.id).map((f) => f.note.written).filter((n) => notes.includes(n));
  const title = String(input.title || '').trim().slice(0, 120) || `${inst.name} quiz`;
  return { ok: true, quiz: { instrument: inst.id, mode: input.mode, notes: ordered, title, settings: cleanSettings(input.settings) } };
}

function context(fingerings, quiz, family) {
  const byId = new Map(fingerings.map((f) => [f.note.written, f]));
  const notes = quiz.notes.map((n) => byId.get(n)).filter(Boolean);
  const grouped = quiz.mode === 'identify' && family === 'brass';
  return { byId, notes, grouped };
}

// Note names offered as answers: the quiz's own, in chart order, padded to four with the nearest other notes.
function optionLabels(fingerings, notes, pad) {
  const labels = uniq(notes.map((f) => f.note.display));
  if (pad && labels.length < 4) {
    const first = fingerings.indexOf(notes[0]);
    const near = fingerings
      .map((f, i) => ({ f, d: Math.abs(i - first) }))
      .sort((a, b) => a.d - b.d);
    for (const { f } of near) {
      if (labels.length >= 4) break;
      if (!labels.includes(f.note.display)) labels.push(f.note.display);
    }
    // show them low to high
    const order = uniq(fingerings.map((f) => f.note.display));
    labels.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return labels;
}

// The questions, with what is needed to grade each. Never send `answer` to the browser: use publicQuestions().
export function buildQuestions(fingerings, quiz, family) {
  const { notes, grouped } = context(fingerings, quiz, family);
  if (quiz.mode === 'fill') {
    return notes.map((f) => ({
      id: f.note.written,
      kind: 'fill',
      label: f.note.display_with_octave || f.note.written,
      prompt: { display: f.note.display, written: f.note.written },
      answer: {
        primary: f.primary.elements,
        text: f.primary.text_notation,
        accepted: [f.primary.elements, ...(f.alternates || []).map((a) => a.elements)].map(fingeringKey),
      },
    }));
  }
  if (grouped) {
    const groups = [];
    for (const f of notes) {
      const key = fingeringKey(f.primary.elements);
      const hit = groups.find((g) => g.key === key);
      if (hit) hit.notes.push(f); else groups.push({ key, notes: [f] });
    }
    const options = optionLabels(fingerings, notes, false);
    return groups.map((g) => ({
      id: `g:${g.notes[0].note.written}`,
      kind: 'identify-all',
      label: g.notes[0].primary.text_notation,
      prompt: { elements: g.notes[0].primary.elements, text: g.notes[0].primary.text_notation, options, count: uniq(g.notes.map((f) => f.note.display)).length },
      answer: { labels: uniq(g.notes.map((f) => f.note.display)) },
    }));
  }
  const options = optionLabels(fingerings, notes, true);
  return notes.map((f) => {
    const key = fingeringKey(f.primary.elements);
    // every note name on the instrument that this picture stands for (a flute's octaves share fingerings)
    const labels = uniq(fingerings.filter((x) => fingeringKey(x.primary.elements) === key).map((x) => x.note.display));
    return {
      id: f.note.written,
      kind: 'identify',
      label: f.note.display_with_octave || f.note.written,
      prompt: { elements: f.primary.elements, text: f.primary.text_notation, options },
      answer: { labels, own: f.note.display },
    };
  });
}

export const publicQuestions = (questions) => questions.map(({ id, kind, prompt }) => ({ id, kind, prompt }));

// Grade one question. `value` is whatever the browser sent: a label, a list of labels, or a list of elements.
export function gradeQuestion(question, value, settings = SETTING_DEFAULTS) {
  const base = { q: question.id, label: question.label };
  if (question.kind === 'identify') {
    const given = typeof value === 'string' ? value.slice(0, 40) : '';
    return { ...base, given, correct: question.answer.labels.includes(given), expected: question.answer.own };
  }
  if (question.kind === 'identify-all') {
    const picked = Array.isArray(value) ? uniq(value.filter((v) => typeof v === 'string' && question.prompt.options.includes(v))) : [];
    const ordered = question.prompt.options.filter((o) => picked.includes(o));
    const want = question.answer.labels;
    const correct = ordered.length === want.length && want.every((l) => ordered.includes(l));
    return { ...base, given: ordered.join(' · '), correct, expected: question.prompt.options.filter((o) => want.includes(o)).join(' · ') };
  }
  // fill: null/undefined means the student never reached the question; [] means "nothing pressed" (open)
  if (!Array.isArray(value)) return { ...base, given: '', correct: false, expected: question.answer.text, expectedElements: question.answer.primary };
  const elements = uniq(value.filter((v) => typeof v === 'string' && v.length <= 20)).slice(0, 30);
  const key = fingeringKey(elements);
  const accepted = settings.accept_alternates === false ? question.answer.accepted.slice(0, 1) : question.answer.accepted;
  return { ...base, given: key || 'open', correct: accepted.includes(key), expected: question.answer.text, expectedElements: question.answer.primary };
}

// Grade a whole submission. `answers` maps question id -> value.
export function gradeQuiz(fingerings, quiz, family, answers = {}) {
  const settings = cleanSettings(quiz.settings);
  const questions = buildQuestions(fingerings, quiz, family);
  const results = questions.map((q) => gradeQuestion(q, Object.hasOwn(answers, q.id) ? answers[q.id] : undefined, settings));
  return {
    score: results.filter((r) => r.correct).length,
    total: results.length,
    results,
    // what is stored: no answer key, just what was asked, what was given and whether it was right
    stored: results.map(({ q, label, given, correct }) => ({ q, label, given, correct })),
  };
}

// Elements from a stored fill answer ("open" or "L1 L2 thumb"), for drawing it again on the dashboard.
export const elementsFromGiven = (given) => (!given || given === 'open' ? [] : given.split(' '));
