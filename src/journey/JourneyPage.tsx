import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitTitle } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { LESSONS, UNITS } from './lessons';
import { LEVELS, levelOf, useProgress } from './progress';

const W = 360, STEP = 128, TOP = 120;
function Stars({ n, x, y }: { n: number; x: number; y: number }) {
  return <g transform={`translate(${x},${y})`}>{[0, 1, 2].map((i) => <text key={i} x={(i - 1) * 15} y={i === 1 ? -3 : 3} textAnchor="middle" fontSize="14" fill={i < n ? '#ecd28f' : 'rgba(255,255,255,.18)'}>★</text>)}</g>;
}

export default function JourneyPage() {
  usePageHue(45); usePageEffects();
  const nav = useNavigate();
  const { xp, streak, completedCount, lessons, isUnlocked, currentIndex, days } = useProgress();
  const lv = levelOf(xp);
  const pts = useMemo(() => LESSONS.map((_, i) => ({ x: W / 2 + Math.sin(i * 0.95) * 105, y: TOP + i * STEP })), []);
  const H = TOP + LESSONS.length * STEP + UNITS.length * 56 + 20;
  const path = useMemo(() => {
    const p = [{ x: W / 2, y: 30 }, ...pts];
    let d = `M${p[0].x},${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] ?? p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] ?? p2;
      d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
    }
    return d;
  }, [pts]);
  const week = useMemo(() => Array.from({ length: 7 }, (_, k) => { const d = new Date(); d.setDate(d.getDate() - (6 - k)); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; return { key, on: days.includes(key), label: 'SMTWTFS'[d.getDay()], today: k === 6 }; }), [days]);
  const cur = LESSONS[currentIndex];
  const allDone = completedCount === LESSONS.length;
  const open = (i: number) => { if (isUnlocked(i)) nav(`/journey/${LESSONS[i].id}`); };
  const nextLevel = lv.next;
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/">← Home</Link>
        <p className="eyebrow">Learn Islam step by step</p>
        <SplitTitle text="Your Journey" />
        <p className="tagline">Tiny lessons, one idea at a time. Finish a lesson to unlock the next.</p>
        <p className="intro">Each lesson has three short cards and a short quiz (4 to 5 questions). Every lesson shows its source from the Qur’an or Hadith. For details of practice, please also learn from a teacher or your local masjid.</p>
      </section>
      <section className="block j-stats reveal">
        <div className="stat"><b>🔥 {streak}</b><span>day streak</span></div>
        <div className="stat"><b>⭐ {xp}</b><span>XP · {lv.name}</span></div>
        <div className="stat"><b>{completedCount}/{LESSONS.length}</b><span>lessons done</span></div>
        <div className="week" aria-label="Last 7 days">{week.map((d) => <span key={d.key} className={'dot' + (d.on ? ' on' : '') + (d.today ? ' today' : '')} title={d.key}>{d.label}</span>)}</div>
        {nextLevel !== null && <p className="small muted">{nextLevel - xp} XP to reach {LEVELS[lv.index + 1][1]}. Pass a lesson on any day to keep your streak. Missing a day only resets the streak, never your progress.</p>}
        <p>{allDone
          ? <span className="muted">You have finished every lesson. Replay any lesson from the map to keep your streak.</span>
          : <button className="btn primary" type="button" onClick={() => open(currentIndex)}>{completedCount ? 'Continue: ' : 'Start: '}{cur.title} →</button>}</p>
      </section>
      <section className="block jmap-wrap">
        <svg className="jmap" viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Lesson map">
          <path d={path} className="jpath-bg" /><path d={path} className="jpath" />
          {LESSONS.map((l, i) => {
            const p = pts[i], rec = lessons[l.id], unlocked = isUnlocked(i), done = !!rec?.done, current = i === currentIndex && !allDone;
            const first = i === 0 || LESSONS[i - 1].unit !== l.unit;
            return (
              <g key={l.id}>
                {first && <g transform={`translate(${W / 2},${p.y - 78})`}><rect x="-92" y="-14" width="184" height="26" rx="13" className="jbanner" /><text textAnchor="middle" y="4" className="jbanner-t">{UNITS[l.unit].title}</text></g>}
                <g className={`jnode${done ? ' done' : ''}${current ? ' current' : ''}${!unlocked ? ' locked' : ''}`} transform={`translate(${p.x},${p.y})`} role="link" tabIndex={unlocked ? 0 : -1}
                  aria-label={`${l.title}${!unlocked ? ' (locked)' : done ? ` (done, ${rec.stars} stars)` : ''}`} aria-disabled={!unlocked}
                  onClick={() => open(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } }}>
                  {current && <circle r="40" className="jpulse" />}
                  <circle r="31" className="jdisc" />
                  <text textAnchor="middle" y="9" className="jicon">{!unlocked ? '🔒' : done ? '✓' : l.icon}</text>
                </g>
                {(unlocked || done) && <Stars n={rec?.stars ?? 0} x={p.x} y={p.y - 40} />}
                <text x={p.x} y={p.y + 52} textAnchor="middle" className="jlabel">{l.title}</text>
              </g>
            );
          })}
        </svg>
      </section>
    </>
  );
}
