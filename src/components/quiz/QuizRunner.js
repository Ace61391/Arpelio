'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import StaffNote from '@/components/StaffNote';
import QuizDiagram from './QuizDiagram';
import { toggleElement, diagramType } from '@/lib/quiz/interact.mjs';
import { elementsFromGiven } from '@/lib/quiz/engine.mjs';

const HINT = {
  valve: 'Tap the valves you press. Leave all three up for an open note.',
  slide: 'Tap the slide position.',
  recorder: 'Tap a hole to cover it. Tap the thumb hole or a double hole a second time for a half-hole.',
  flute: 'Tap every key you press.',
};

const shuffled = (list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Progress is kept for this tab only, so a refresh does not lose a student's answers.
const store = {
  key: (code) => `arpelio-quiz-${code}`,
  load(code) { try { return JSON.parse(sessionStorage.getItem(this.key(code)) || 'null'); } catch { return null; } },
  save(code, value) { try { sessionStorage.setItem(this.key(code), JSON.stringify(value)); } catch {} },
  clear(code) { try { sessionStorage.removeItem(this.key(code)); } catch {} },
};

function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      <header className="bg-white border-b border-[#e5e8ed] px-5 py-3 flex items-center gap-2">
        <img src="/logo.svg" alt="" className="w-7 h-7 rounded-lg" />
        <span className="text-base font-extrabold text-[#1a1d23] tracking-tight">Arpelio</span>
        {title && <span className="text-sm text-[#6b7385] truncate ml-2">· {title}</span>}
      </header>
      <main className="flex-1 w-full max-w-[680px] mx-auto px-4 py-6 md:py-10">{children}</main>
    </div>
  );
}

const Card = ({ children }) => (
  <div className="bg-white border border-[#e5e8ed] rounded-2xl p-5 md:p-8">{children}</div>
);

const primary = 'bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 text-base font-bold transition-colors';
const secondary = 'border border-[#d0d4dc] hover:border-accent text-[#4a5060] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-5 py-3 text-base font-semibold transition-colors bg-white';

export default function QuizRunner({ code }) {
  const [quiz, setQuiz] = useState(null);
  const [stage, setStage] = useState('loading'); // loading | missing | unavailable | closed | name | questions | finish | done
  const [name, setName] = useState('');
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startedAt, setStartedAt] = useState(null);
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const top = useRef(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/quiz/${code}`, { cache: 'no-store' })
      .then(async (r) => ({ status: r.status, body: await r.json().catch(() => ({})) }))
      .then(({ status, body }) => {
        if (!live) return;
        if (status === 404) { setStage('missing'); return; }
        if (status !== 200) { setStage('unavailable'); return; }
        if (body.status === 'closed') { setQuiz(body); setStage('closed'); return; }
        setQuiz(body);
        const ids = body.questions.map((q) => q.id);
        const saved = store.load(code);
        if (saved && Array.isArray(saved.order) && saved.order.length === ids.length && saved.order.every((id) => ids.includes(id))) {
          setName(saved.name || ''); setOrder(saved.order); setIndex(Math.min(saved.index || 0, ids.length - 1));
          setAnswers(saved.answers || {}); setStartedAt(saved.startedAt || null);
          setStage(saved.stage === 'finish' ? 'finish' : 'questions');
        } else {
          setStage('name');
        }
      })
      .catch(() => live && setStage('unavailable'));
    return () => { live = false; };
  }, [code]);

  useEffect(() => {
    if (stage === 'questions' || stage === 'finish') store.save(code, { name, order, index, answers, startedAt, stage });
  }, [code, stage, name, order, index, answers, startedAt]);

  const byId = useMemo(() => new Map((quiz?.questions || []).map((q) => [q.id, q])), [quiz]);
  const question = stage === 'questions' ? byId.get(order[index]) : null;
  const type = quiz?.instrument ? diagramType(quiz.instrument.id) : 'valve';

  const isAnswered = (q) => {
    const v = answers[q.id];
    if (q.kind === 'identify') return typeof v === 'string' && v !== '';
    if (q.kind === 'identify-all') return Array.isArray(v) && v.length > 0;
    return Array.isArray(v);
  };
  const answeredCount = (quiz?.questions || []).filter(isAnswered).length;

  const start = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const ids = quiz.questions.map((q) => q.id);
    setOrder(quiz.settings.shuffle ? shuffled(ids) : ids);
    setIndex(0); setAnswers({}); setStartedAt(new Date().toISOString());
    setStage('questions');
  };

  // Leaving a fill question counts as answering it: "nothing pressed" is a real answer (an open note).
  const commit = (current) => {
    const q = byId.get(order[current]);
    if (q?.kind === 'fill') setAnswers((a) => (Array.isArray(a[q.id]) ? a : { ...a, [q.id]: [] }));
  };
  const go = (to) => {
    commit(index);
    setError('');
    if (to >= order.length) setStage('finish'); else { setIndex(Math.max(0, to)); setStage('questions'); }
    top.current?.focus?.();
  };

  const submit = async () => {
    setSending(true); setError('');
    try {
      const r = await fetch(`/api/quiz/${code}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, answers, started_at: startedAt }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.ok) { setError(body.message || 'Could not send your answers. Check your connection and try again.'); setSending(false); return; }
      store.clear(code);
      setResult(body); setStage('done');
    } catch {
      setError('Could not send your answers. Check your connection and try again.');
    }
    setSending(false);
  };

  if (stage === 'loading') return <Shell><p className="text-center text-[#6b7385] py-16">Loading quiz…</p></Shell>;
  if (stage === 'missing') {
    return (
      <Shell><Card>
        <h1 className="text-2xl font-extrabold text-[#1a1d23] mb-2">Quiz not found</h1>
        <p className="text-[#4a5060]">Check the link with your teacher. It may have been mistyped, or the quiz may have been deleted.</p>
      </Card></Shell>
    );
  }
  if (stage === 'unavailable') {
    return (
      <Shell><Card>
        <h1 className="text-2xl font-extrabold text-[#1a1d23] mb-2">The quiz did not load</h1>
        <p className="text-[#4a5060] mb-5">This is a problem on our side or with your connection, not with your link. Wait a moment and try again. If it keeps happening, tell your teacher.</p>
        <button onClick={() => window.location.reload()} className={primary}>Try again</button>
      </Card></Shell>
    );
  }
  if (stage === 'closed') {
    return (
      <Shell title={quiz.title}><Card>
        <h1 className="text-2xl font-extrabold text-[#1a1d23] mb-2">This quiz is closed</h1>
        <p className="text-[#4a5060]">Your teacher is not accepting answers for “{quiz.title}” right now.</p>
      </Card></Shell>
    );
  }

  if (stage === 'name') {
    return (
      <Shell title={quiz.title}><Card>
        <p className="text-sm font-semibold text-accent mb-1">{quiz.instrument.name} · {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-5">{quiz.title}</h1>
        <form onSubmit={start}>
          <label htmlFor="student-name" className="block text-sm font-semibold text-[#4a5060] mb-1.5">Your first name and last initial</label>
          <input id="student-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="off" autoFocus
            placeholder="For example: Maya R"
            className="w-full px-4 py-3 rounded-lg border border-[#d0d4dc] text-base focus:border-accent focus:outline-none mb-2" />
          <p className="text-sm text-[#6b7385] mb-5">Your teacher sees this name next to your score.</p>
          <button type="submit" disabled={!name.trim()} className={primary}>Start quiz</button>
        </form>
      </Card></Shell>
    );
  }

  if (stage === 'done') return <Shell title={quiz.title}><Result quiz={quiz} result={result} byId={byId} /></Shell>;

  if (stage === 'finish') {
    const missing = quiz.questions.length - answeredCount;
    return (
      <Shell title={quiz.title}><Card>
        <h1 className="text-2xl font-extrabold text-[#1a1d23] mb-2">Ready to submit?</h1>
        <p className="text-[#4a5060] mb-1">You answered {answeredCount} of {quiz.questions.length} questions.</p>
        {missing > 0 && <p className="text-[#b45309] font-semibold mb-1">{missing} {missing === 1 ? 'question has' : 'questions have'} no answer and will be marked wrong.</p>}
        <p className="text-sm text-[#6b7385] mb-6">You cannot change your answers after you submit.</p>
        {error && <p role="alert" className="text-sm font-semibold text-[#c0392b] mb-4">{error}</p>}
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => { setIndex(order.length - 1); setStage('questions'); }} disabled={sending} className={secondary}>Go back</button>
          <button onClick={submit} disabled={sending} className={primary}>{sending ? 'Submitting…' : 'Submit quiz'}</button>
        </div>
      </Card></Shell>
    );
  }

  // ---- one question
  const n = index + 1;
  const total = order.length;
  const value = answers[question.id];
  const set = (v) => setAnswers((a) => ({ ...a, [question.id]: v }));

  return (
    <Shell title={quiz.title}>
      <div className="mb-4" aria-hidden="true">
        <div className="h-2 bg-[#e5e8ed] rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${(n / total) * 100}%` }} />
        </div>
      </div>
      <Card>
        <p ref={top} tabIndex={-1} data-question={question.id} className="text-sm font-semibold text-[#6b7385] mb-4 outline-none" aria-live="polite">Question {n} of {total}</p>

        {question.kind === 'identify' && (
          <>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1a1d23] mb-5">Which note is this fingering?</h1>
            <div className="py-3" role="img" aria-label={`Fingering: ${question.prompt.text}`}>
              <QuizDiagram instrumentId={quiz.instrument.id} elements={question.prompt.elements} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-5" role="radiogroup" aria-label="Note names">
              {question.prompt.options.map((o) => (
                <button key={o} role="radio" aria-checked={value === o} onClick={() => set(o)}
                  className={`h-14 rounded-xl text-lg font-bold border-2 transition-colors ${value === o ? 'border-accent bg-accent text-white' : 'border-[#e5e8ed] bg-white text-[#1a1d23] hover:border-accent'}`}>
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {question.kind === 'identify-all' && (
          <>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1a1d23] mb-1">Which notes use this fingering?</h1>
            <p className="text-[#4a5060] mb-5">Choose {question.prompt.count === 1 ? 'the one note' : `all ${question.prompt.count} notes`} that use it.</p>
            <div className="py-3" role="img" aria-label={`Fingering: ${question.prompt.text}`}>
              <QuizDiagram instrumentId={quiz.instrument.id} elements={question.prompt.elements} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-5" role="group" aria-label="Note names">
              {question.prompt.options.map((o) => {
                const on = Array.isArray(value) && value.includes(o);
                return (
                  <button key={o} aria-pressed={on}
                    onClick={() => set(on ? value.filter((x) => x !== o) : [...(Array.isArray(value) ? value : []), o])}
                    className={`h-14 rounded-xl text-lg font-bold border-2 transition-colors ${on ? 'border-accent bg-accent text-white' : 'border-[#e5e8ed] bg-white text-[#1a1d23] hover:border-accent'}`}>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {question.kind === 'fill' && (
          <>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1a1d23] mb-1">Show the fingering for this note</h1>
            <p className="text-[#4a5060] mb-4">{HINT[type]}</p>
            <div className="flex items-center justify-center gap-5 mb-4">
              <span className="text-4xl font-extrabold text-[#1a1d23]">{question.prompt.display}</span>
              <StaffNote note={question.prompt.written} clef={quiz.instrument.clef} width={72} />
            </div>
            <div className="py-3 overflow-x-auto">
              <QuizDiagram instrumentId={quiz.instrument.id} elements={Array.isArray(value) ? value : []}
                onKey={(k) => set(toggleElement(quiz.instrument.id, Array.isArray(value) ? value : [], k))} />
            </div>
            <div className="text-center mt-2">
              <button onClick={() => set([])} className="text-sm font-semibold text-accent hover:underline px-3 py-2">Clear</button>
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-between gap-3 mt-5">
        <button onClick={() => go(index - 1)} disabled={index === 0} className={secondary}>Previous</button>
        <button onClick={() => go(index + 1)} className={primary}>{n === total ? 'Finish' : 'Next'}</button>
      </div>
    </Shell>
  );
}

function Result({ quiz, result, byId }) {
  const good = result.percent >= 80;
  return (
    <>
      <Card>
        <p className="text-sm font-semibold text-[#6b7385] mb-1">{result.name}</p>
        <h1 className="text-2xl font-extrabold text-[#1a1d23] mb-4">{quiz.title}</h1>
        <div className="flex items-end gap-4 mb-2">
          <span className={`text-6xl font-extrabold tracking-tight ${good ? 'text-[#1f7d5d]' : 'text-[#1a1d23]'}`} data-testid="score">{result.score} / {result.total}</span>
          <span className="text-2xl font-bold text-[#6b7385] pb-1.5">{result.percent}%</span>
        </div>
        <p className="text-[#4a5060]">Your answers have been sent to your teacher.</p>
      </Card>

      <h2 className="text-sm font-bold text-[#6b7385] uppercase tracking-widest mt-8 mb-3">Your answers</h2>
      <div className="flex flex-col gap-3">
        {result.results.map((r, i) => {
          const q = byId.get(r.q);
          const fill = q?.kind === 'fill';
          return (
            <div key={r.q} className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${r.correct ? 'border-[#bfe5d5]' : 'border-[#f1c4be]'}`}>
              <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${r.correct ? 'bg-[#22a06b]' : 'bg-[#e5483e]'}`} aria-label={r.correct ? 'Correct' : 'Wrong'}>
                {r.correct ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#6b7385]">Question {i + 1}{fill ? ` · ${q.prompt.display}` : ''}</div>
                {fill ? (
                  <div className="flex items-start gap-5 flex-wrap mt-2">
                    <div>
                      <div className="text-xs text-[#6b7385] mb-1">Your answer</div>
                      {r.given === '' ? <div className="text-sm text-[#4a5060]">No answer</div>
                        : <QuizDiagram small instrumentId={quiz.instrument.id} elements={elementsFromGiven(r.given)} />}
                    </div>
                    {!r.correct && r.expectedElements && (
                      <div>
                        <div className="text-xs text-[#6b7385] mb-1">Correct</div>
                        <QuizDiagram small instrumentId={quiz.instrument.id} elements={r.expectedElements} />
                        <div className="font-mono text-xs text-[#4a5060] mt-1 text-center">{r.expected}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-wrap mt-1">
                    {q && <QuizDiagram small instrumentId={quiz.instrument.id} elements={q.prompt.elements} />}
                    <div className="text-base text-[#1a1d23]">
                      <span className="font-bold">{r.given || 'No answer'}</span>
                      {!r.correct && r.expected && <span className="text-[#4a5060]"> · correct: <span className="font-bold">{r.expected}</span></span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3 flex-wrap items-center">
        <button onClick={() => window.location.reload()} className={secondary}>Take it again</button>
        <Link href="/" className="text-sm text-[#6b7385] hover:text-accent">Made with Arpelio</Link>
      </div>
    </>
  );
}
