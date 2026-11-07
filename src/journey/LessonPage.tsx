import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SrcChips } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { LESSONS, UNITS } from './lessons';
import { levelOf, useProgress, type Result } from './progress';

const shuffle = <T,>(a: T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export default function LessonPage() {
  const { id } = useParams();
  return <LessonInner key={id} />; // fresh state for every lesson
}

function LessonInner() {
  const { id } = useParams();
  const idx = LESSONS.findIndex((l) => l.id === id);
  const l = LESSONS[idx];
  const { isUnlocked, record, xp } = useProgress();
  usePageHue(l ? UNITS[l.unit].color : 45);
  const [run, setRun] = useState(0);
  usePageEffects(run);
  const [step, setStep] = useState(0);            // 0..cards-1 = cards, then quiz questions
  const [qi, setQi] = useState(0), [picked, setPicked] = useState<number | null>(null), [correct, setCorrect] = useState(0);
  const [res, setRes] = useState<Result | null>(null);
  const quiz = useMemo(() => (l ? l.quiz.map((q) => ({ ...q, opts: shuffle(q.options.map((o, i) => ({ o, ok: i === 0 }))) })) : []), [l, run]);
  if (!l || !isUnlocked(idx)) return <Navigate to="/journey" replace />;
  const nCards = l.cards.length, inCards = step < nCards, finished = res !== null;
  const again = () => { setStep(0); setQi(0); setPicked(null); setCorrect(0); setRes(null); setRun((r) => r + 1); };
  const answer = (k: number) => { if (picked !== null) return; setPicked(k); if (quiz[qi].opts[k].ok) setCorrect((c) => c + 1); };
  const nextQ = () => {
    if (qi + 1 < quiz.length) { setQi(qi + 1); setPicked(null); return; }
    setRes(record(l.id, correct, quiz.length));
  };
  const nextLesson = LESSONS[idx + 1];
  const progressPct = finished ? 100 : ((inCards ? step : nCards + qi) / (nCards + quiz.length)) * 100;
  return (
    <section className="block lesson" key={run}>
      <Link className="crumb" to="/journey">← Back to the map</Link>
      <p className="eyebrow">{UNITS[l.unit].title} · Lesson {idx + 1} of {LESSONS.length}</p>
      <h1 className="lesson-title">{l.title}</h1>
      <div className="lbar" aria-hidden="true"><i style={{ width: progressPct + '%' }} /></div>

      {!finished && inCards && (
        <article className="card lcard" key={'c' + step}>
          <p className="eyebrow">Card {step + 1} of {nCards}</p>
          <h2>{l.cards[step].h}</h2>
          <p className="en">{l.cards[step].body}</p>
          {l.cards[step].ref && <footer><SrcChips srcs={l.cards[step].ref!} /></footer>}
          <div className="lnav">
            {step > 0 && <button className="btn" type="button" onClick={() => setStep(step - 1)}>← Back</button>}
            <button className="btn primary" type="button" onClick={() => setStep(step + 1)}>{step + 1 < nCards ? 'Next →' : 'Start the quiz →'}</button>
          </div>
        </article>
      )}

      {!finished && !inCards && (
        <article className="card lcard" key={'q' + qi}>
          <p className="eyebrow">Question {qi + 1} of {quiz.length}</p>
          <h2>{quiz[qi].q}</h2>
          <div className="opts" role="group">
            {quiz[qi].opts.map((o, k) => {
              const state = picked === null ? '' : o.ok ? ' right' : picked === k ? ' wrong' : ' dim';
              return <button key={k} type="button" className={'opt' + state} onClick={() => answer(k)} disabled={picked !== null}>{o.o}</button>;
            })}
          </div>
          {picked !== null && (
            <div className="fb" role="status"><strong>{quiz[qi].opts[picked].ok ? 'Correct!' : 'Not quite.'}</strong> {quiz[qi].why}
              <p><button className="btn primary" type="button" onClick={nextQ}>{qi + 1 < quiz.length ? 'Next question →' : 'See result →'}</button></p></div>
          )}
        </article>
      )}

      {finished && res && (
        <article className={'card lcard result' + (res.passed ? ' pass' : '')}>
          {res.passed && <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>}
          <h2>{res.passed ? (res.first ? 'Lesson complete!' : 'Well done!') : 'Almost there'}</h2>
          <div className="rstars" aria-label={`${res.stars} of 3 stars`}>{[0, 1, 2].map((i) => <span key={i} className={i < res.stars ? 'on' : ''} style={{ ['--i' as string]: i }}>★</span>)}</div>
          <p className="en">{correct} of {quiz.length} correct.{res.passed ? ` +${res.xp} XP. You’re a ${levelOf(xp).name} · 🔥 ${res.streak}-day streak.` : ` You need at least ${Math.ceil(quiz.length * 0.6)} correct to pass. Read the cards again and try once more; there is no penalty.`}</p>
          <p className="small muted">Sources for this lesson: <SrcChips srcs={l.sources} /></p>
          <div className="lnav">
            <button className="btn" type="button" onClick={again}>{res.passed ? 'Replay' : 'Try again'}</button>
            {res.passed && nextLesson && <Link className="btn primary" to={`/journey/${nextLesson.id}`}>Next lesson →</Link>}
            <Link className="btn" to="/journey">Map</Link>
          </div>
        </article>
      )}
    </section>
  );
}
