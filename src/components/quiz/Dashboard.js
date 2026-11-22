'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizDiagram from './QuizDiagram';
import { elementsFromGiven } from '@/lib/quiz/engine.mjs';

const small = 'text-sm font-semibold px-3 py-2 rounded-lg border transition-colors';

export const shareUrl = (code) => (typeof window === 'undefined' ? `/q/${code}` : `${window.location.origin}/q/${code}`);

// The student link, with a button that copies it.
export function ShareLink({ code }) {
  const [url, setUrl] = useState(`/q/${code}`);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setUrl(shareUrl(code)); }, [code]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl(code)); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  return (
    <span className="inline-flex items-center gap-2 max-w-full">
      <a href={`/q/${code}`} target="_blank" rel="noopener" className="font-mono text-sm text-accent hover:underline truncate" data-testid="share-url">{url}</a>
      <button onClick={copy} className={`${small} border-[#d0d4dc] text-[#4a5060] hover:border-accent shrink-0`}>{copied ? 'Copied' : 'Copy link'}</button>
    </span>
  );
}

const percent = (score, total) => Math.round((score / total) * 100);
const when = (iso) => { try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; } };

// Open/close and delete, for one quiz.
export function QuizActions({ quiz }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const call = async (method, body) => {
    setBusy(true); setError('');
    const r = await fetch(`/api/quizzes/${quiz.id}`, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    setBusy(false);
    if (!r.ok) { setError('That did not work. Reload and try again.'); return false; }
    return true;
  };
  const toggle = async () => { if (await call('PATCH', { status: quiz.status === 'open' ? 'closed' : 'open' })) router.refresh(); };
  const remove = async () => {
    if (!window.confirm(`Delete “${quiz.title}” and all of its results? This cannot be undone.`)) return;
    if (await call('DELETE')) { router.push('/dashboard'); router.refresh(); }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={toggle} disabled={busy} className={`${small} border-[#d0d4dc] text-[#4a5060] hover:border-accent`}>
        {quiz.status === 'open' ? 'Close quiz' : 'Reopen quiz'}
      </button>
      <button onClick={remove} disabled={busy} className={`${small} border-[#f1c4be] text-[#c0392b] hover:bg-[#fef0ef]`}>Delete quiz</button>
      {error && <span role="alert" className="text-sm text-[#c0392b]">{error}</span>}
    </div>
  );
}

function csvCell(v) {
  const s = String(v ?? '');
  // a leading = + - @ would be run as a formula by a spreadsheet
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

// Students, scores, and which questions were missed.
export function Results({ quiz, attempts, questions, instrumentId }) {
  const router = useRouter();
  const [open, setOpen] = useState(null);
  const fill = quiz.mode === 'fill';

  const remove = async (a) => {
    if (!window.confirm(`Delete ${a.student_name}'s result?`)) return;
    const r = await fetch(`/api/attempts/${a.id}`, { method: 'DELETE' });
    if (r.ok) router.refresh();
  };

  const download = () => {
    const labels = (attempts[0]?.answers || []).map((x) => x.label);
    const rows = [['Student', 'Score', 'Out of', 'Percent', 'Submitted', ...labels]];
    attempts.forEach((a) => rows.push([
      a.student_name, a.score, a.total, percent(a.score, a.total), a.submitted_at,
      ...labels.map((l) => { const x = (a.answers || []).find((y) => y.label === l); return x ? (x.correct ? 'right' : 'wrong') : ''; }),
    ]));
    const blob = new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${quiz.title.replace(/[^\w-]+/g, '-').toLowerCase() || 'quiz'}-results.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (attempts.length === 0) {
    return (
      <div className="border border-dashed border-[#d0d4dc] rounded-2xl p-10 text-center bg-[#f8f9fb]">
        <p className="text-lg font-bold text-[#1a1d23] mb-1">No one has taken this quiz yet</p>
        <p className="text-[#4a5060]">Share the link above. Results appear here as students submit.</p>
      </div>
    );
  }

  const scores = attempts.map((a) => percent(a.score, a.total));
  const average = Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[['Submissions', attempts.length], ['Class average', `${average}%`], ['Range', `${Math.min(...scores)}–${Math.max(...scores)}%`]].map(([k, v]) => (
          <div key={k} className="bg-white border border-[#e5e8ed] rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b7385]">{k}</div>
            <div className="text-2xl font-extrabold text-[#1a1d23] mt-1">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 items-start">
        <section aria-labelledby="students-h">
          <div className="flex items-center justify-between mb-3">
            <h2 id="students-h" className="text-sm font-bold text-[#6b7385] uppercase tracking-widest">Students</h2>
            <button onClick={download} className={`${small} border-[#d0d4dc] text-[#4a5060] hover:border-accent`}>Download CSV</button>
          </div>
          <div className="bg-white border border-[#e5e8ed] rounded-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#f8f9fb] text-xs uppercase tracking-wide text-[#6b7385]">
                <tr><th scope="col" className="px-4 py-3 font-bold">Student</th><th scope="col" className="px-4 py-3 font-bold">Score</th><th scope="col" className="px-4 py-3 font-bold hidden sm:table-cell">Submitted</th><th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <FragmentRow key={a.id} a={a} isOpen={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} onDelete={() => remove(a)} fill={fill} instrumentId={instrumentId} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="missed-h">
          <h2 id="missed-h" className="text-sm font-bold text-[#6b7385] uppercase tracking-widest mb-3">Most missed</h2>
          <div className="bg-white border border-[#e5e8ed] rounded-card p-4 flex flex-col gap-4">
            {questions.map((q) => {
              const right = Number(q.answered) - Number(q.wrong);
              const pct = Number(q.answered) ? Math.round((right / Number(q.answered)) * 100) : 0;
              return (
                <div key={q.question} data-testid="question-stat">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold text-[#1a1d23]">{q.label}</span>
                    <span className="text-sm text-[#4a5060]">{q.wrong} of {q.answered} wrong</span>
                  </div>
                  <div className="h-2 bg-[#f1c4be] rounded-full overflow-hidden mt-1.5" role="img" aria-label={`${pct}% answered correctly`}>
                    <div className="h-full bg-[#22a06b]" style={{ width: `${pct}%` }} />
                  </div>
                  {q.common_wrong.length > 0 && (
                    <div className="mt-2 text-sm text-[#4a5060]">
                      <span className="text-[#6b7385]">Common wrong {q.common_wrong.length === 1 ? 'answer' : 'answers'}:</span>
                      {fill ? (
                        <div className="flex gap-4 flex-wrap mt-1.5">
                          {q.common_wrong.map((w) => (
                            <div key={w.given} className="flex flex-col items-center gap-1">
                              <QuizDiagram small instrumentId={instrumentId} elements={elementsFromGiven(w.given)} />
                              <span className="text-xs text-[#6b7385]">{w.count}×</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span> {q.common_wrong.map((w) => `${w.given} (${w.count}×)`).join(', ')}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

function FragmentRow({ a, isOpen, onToggle, onDelete, fill, instrumentId }) {
  const pct = percent(a.score, a.total);
  return (
    <>
      <tr className="border-t border-[#e5e8ed]" data-testid="attempt-row">
        <th scope="row" className="px-4 py-3 font-semibold text-[#1a1d23]">{a.student_name}</th>
        <td className="px-4 py-3 whitespace-nowrap"><span className="font-bold text-[#1a1d23]">{a.score}/{a.total}</span> <span className="text-[#6b7385]">· {pct}%</span></td>
        <td className="px-4 py-3 text-[#4a5060] hidden sm:table-cell whitespace-nowrap">{when(a.submitted_at)}</td>
        <td className="px-4 py-3 text-right whitespace-nowrap">
          <button onClick={onToggle} aria-expanded={isOpen} className="text-sm font-semibold text-accent hover:underline px-2 py-1">{isOpen ? 'Hide' : 'Answers'}</button>
          <button onClick={onDelete} className="text-sm font-semibold text-[#c0392b] hover:underline px-2 py-1">Delete</button>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-[#f8f9fb]">
          <td colSpan={4} className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {(a.answers || []).map((x) => (
                <span key={x.q} className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm bg-white ${x.correct ? 'border-[#bfe5d5]' : 'border-[#f1c4be]'}`}>
                  <span className="font-bold text-[#1a1d23]">{x.label}</span>
                  <span className={x.correct ? 'text-[#1f7d5d]' : 'text-[#c0392b]'}>{x.correct ? '✓' : '✗'}</span>
                  {!x.correct && (fill
                    ? (x.given ? <span className="inline-block align-middle"><QuizDiagram small instrumentId={instrumentId} elements={elementsFromGiven(x.given)} /></span> : <span className="text-[#6b7385]">no answer</span>)
                    : <span className="text-[#4a5060]">{x.given || 'no answer'}</span>)}
                </span>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
