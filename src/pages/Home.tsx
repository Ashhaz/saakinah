import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, META } from '../data';
import { Arabic, ScrollLink, SplitTitle, TopicCard } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { PrayerMini } from './PrayerTimes';
import { useProgress } from '../journey/progress';
import { LESSONS } from '../journey/lessons';
import { quranUrl } from '../lib/refs';
import { useApp } from '../AppContext';
import type { Verse } from '../types';


// ───────── Ayah of the day ─────────
// Drawn only from the already-curated verses on the topic pages (complete verses with Arabic), so nothing new is introduced.
const POOL = (() => {
  const seen = new Map<string, { v: Verse; slug: string; title: string }>();
  TOPICS.forEach((t) => t.verses.forEach((v) => { if (v.arabic && v.ayahs.length && !seen.has(v.ref)) seen.set(v.ref, { v, slug: t.slug, title: t.title }); }));
  return [...seen.values()].sort((a, b) => { const [s1, a1] = a.v.ref.split(':'), [s2, a2] = b.v.ref.split(':'); return +s1 - +s2 || parseInt(a1) - parseInt(a2); });
})();
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
function dayNumber(d: Date) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
export function ayahOfDay(d = new Date()) {
  const n = POOL.length; let step = Math.round(n * 0.382); while (gcd(step, n) !== 1) step++;
  return POOL[(dayNumber(d) * step) % n]; // different verse every day, no repeats for n days
}
function AyahOfDay() {
  const { toast } = useApp();
  const it = ayahOfDay(), v = it.v;
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const copy = () => {
    const txt = `“${v.en}” (Qur’an ${v.ref.replace('-', '–')}) quran.com/${v.ref.replace(':', '/')}`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => toast('Copied the verse and its reference.'), () => toast(txt)); else toast(txt);
  };
  return (
    <section className="block aotd reveal" id="ayah-of-the-day">
      <p className="eyebrow">Ayah of the day · {date}</p>
      <Arabic ayahs={v.ayahs} big />
      <p className="en big">{v.en}</p>
      <p className="vom-ref"><a target="_blank" rel="noopener" href={quranUrl(v.ref)}>Qur’an {v.ref.replace('-', '–')} ↗</a> · Sūrat {META.surahs[v.ref.split(':')[0]]}</p>
      <p className="small muted">Also on the page for <Link to={`/topic/${it.slug}`}>{it.title}</Link>. A new verse every day.</p>
      <button className="btn" type="button" onClick={copy}>Copy verse &amp; reference</button>
    </section>
  );
}

function VerseOfMoment() {
  const items = META.heroVerses;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * items.length));
  const [out, setOut] = useState(false);
  const it = items[idx];
  const showAr = it.arabic !== false && it.ayahs.length > 0;
  const next = () => { setOut(true); window.setTimeout(() => { setIdx((i) => (i + 1) % items.length); setOut(false); }, 420); };
  return (
    <section className="block vom reveal" id="vom" aria-live="polite">
      <p className="eyebrow">A verse for right now</p>
      {showAr && <div className={'swap' + (out ? ' out' : '')}><Arabic ayahs={it.ayahs} big /></div>}
      <p className={'en big swap' + (out ? ' out' : '')}>{it.en}</p>
      <p className={'vom-ref swap' + (out ? ' out' : '')}><a target="_blank" rel="noopener" href={quranUrl(it.ref)}>Qur’an {it.ref.replace('-', '–')} ↗</a></p>
      <button className="btn" type="button" onClick={next}>Show another ↻</button>
    </section>
  );
}

export default function Home() {
  usePageHue(45); usePageEffects();
  const { completedCount, streak } = useProgress();
  const groups = META.groups;
  return (
    <>
      <section className="hero home-hero">
        <p className="eyebrow">Qur’an &amp; Sunnah · for the heaviest days</p>
        <SplitTitle text="You are not alone in the dark." />
        <p className="tagline">A quiet corner of the internet with verses, hadith and du’as for the things young people actually carry, each with its source.</p>
        <div className="cta"><ScrollLink to="feel" className="btn primary">How are you feeling?</ScrollLink><ScrollLink to="topics" className="btn">Browse all topics</ScrollLink><Link className="btn" to="/journey">Start the Journey →</Link><Link className="btn" to="/dhikr">Dhikr counter</Link></div>
        <div className="scroll-cue" aria-hidden="true"><i /></div>
      </section>
      <AyahOfDay />
      <section className="block" id="feel">
        <div className="sec-head reveal"><span className="num">♡</span><h2>How are you feeling right now?</h2></div>
        <div className="moods reveal">{META.moods.map(([l, s]) => <Link key={s} className="mood" to={`/topic/${s}`}>{l}</Link>)}</div>
      </section>
      <section className="block journey-promo reveal">
        <div className="sec-head"><span className="num">✦</span><h2>Learn Islam, one small step at a time</h2></div>
        <p className="muted">A gentle, game-style Journey: short lessons, a tiny quiz after each, stars, and a daily streak. Every lesson shows its source.</p>
        <p><Link className="btn primary" to="/journey">{completedCount ? 'Continue your Journey' : 'Begin the Journey'}</Link>{' '}
          <span className="muted">{completedCount}/{LESSONS.length} lessons{streak > 0 ? ` · 🔥 ${streak}-day streak` : ''}</span></p>
      </section>
      <PrayerMini />
      <VerseOfMoment />
      {groups.map(([gk, gname], gi) => (
        <section className="block" key={gk} id={gi === 0 ? 'topics' : undefined}>
          <div className="sec-head reveal"><span className="num">{['I', 'II', 'III', 'IV'][gi]}</span><h2>{gname}</h2></div>
          <div className="cards">{TOPICS.filter((t) => t.group === gk).map((t) => <TopicCard key={t.slug} t={t} />)}</div>
        </section>
      ))}
      <section className="block principles reveal">
        <div className="sec-head"><span className="num">✦</span><h2>How this site works</h2></div>
        <div className="three">
          <div><h3>Sourced</h3><p>Every Qur’an passage shows surah and verse. Every hadith shows its collection and number, with a link to check it.</p></div>
          <div><h3>Honest</h3><p>Where a hadith is not from the two Ṣaḥīḥ collections, the grading is stated. Partial verses are marked as partial.</p></div>
          <div><h3>Gentle</h3><p>Each page opens with a short “Start here”. Faith and professional help go together, and crisis support is one click away.</p></div>
        </div>
      </section>
    </>
  );
}
