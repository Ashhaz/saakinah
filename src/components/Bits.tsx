import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { META, BY_SLUG } from '../data';
import { getAyah, arNum } from '../lib/arabic';
import { quranUrl, quranLabel, hadithUrl, srcLabel, hadithGrade, SAHIH_TITLE, isSahihayn } from '../lib/refs';
import type { Src, Verse, Hadith, Dua, Remedy, Topic } from '../types';

/** In-page anchor that scrolls (HashRouter-safe: never touches the URL hash). */
export function ScrollLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return <a href={'#' + to} className={className} onClick={(e) => { e.preventDefault(); document.getElementById(to)?.scrollIntoView({ behavior: 'smooth' }); }}>{children}</a>;
}

/** Headline split into animated words. */
export function SplitTitle({ text, as: Tag = 'h1' }: { text: string; as?: 'h1' | 'h2' }) {
  return (
    <Tag className="split" aria-label={text}>
      {text.trim().split(/\s+/).map((w, i, a) => (
        <span key={i}><span className="w" aria-hidden="true"><span style={{ ['--i' as string]: i }}>{w}</span></span>{i < a.length - 1 ? ' ' : ''}</span>
      ))}
    </Tag>
  );
}

export function ReportBtn({ label, page }: { label: string; page: string }) {
  const { toast } = useApp();
  const click = () => {
    const msg = `Sakina – possible mistake. Page: ${page} | Reference: ${label} | What looks wrong: `;
    const done = () => toast(`Copied a note about ${label}. Paste it into a message to the site owner and add what looks wrong.`);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(msg).then(done, () => toast(msg)); else toast(msg);
  };
  return <button className="report" type="button" title="Report a possible mistake" aria-label={`Report a possible mistake in ${label}`} onClick={click}>⚑</button>;
}

export function SrcChip({ s }: { s: Src }) {
  const [c, n] = s;
  if (c === 'quran') return <a className="ref" href={quranUrl(String(n))} target="_blank" rel="noopener">{quranLabel(String(n))}</a>;
  if (c === null) return <span className="ref plain">{n}</span>;
  return <a className="ref" href={hadithUrl(c, n)} target="_blank" rel="noopener">{srcLabel(s)}</a>;
}
export const SrcChips = ({ srcs }: { srcs: Src[] }) => <>{srcs.map((s, i) => <span key={i}><SrcChip s={s} />{' '}</span>)}</>;

export function Grade({ g, sahih }: { g: string; sahih?: boolean }) {
  if (!g) return null;
  return <span className="grade" title={sahih ? SAHIH_TITLE : 'Grading of the narration'}>{g}</span>;
}

/** Live Arabic from the Qur'an API, with an offline fallback link. */
export function Arabic({ ayahs, big, className = '' }: { ayahs: string[]; big?: boolean; className?: string }) {
  const [state, setState] = useState<{ status: 'loading' | 'ok' | 'fail'; texts: string[] }>({ status: 'loading', texts: [] });
  const key = ayahs.join(',');
  useEffect(() => {
    let live = true; setState({ status: 'loading', texts: [] });
    Promise.all(ayahs.map(getAyah)).then((t) => { if (live) setState({ status: 'ok', texts: t }); }).catch(() => { if (live) setState({ status: 'fail', texts: [] }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const cls = `ar${big ? ' big' : ''} ${state.status === 'ok' ? 'loaded' : state.status === 'fail' ? 'failed' : ''} ${className}`;
  if (state.status === 'fail') {
    const k = ayahs[0].split(':'), ref = ayahs[0] + (ayahs.length > 1 ? '–' + ayahs[ayahs.length - 1].split(':')[1] : '');
    return <div className={cls} lang="ar" dir="rtl">Arabic text loads when you are online. <a href={`https://quran.com/${k[0]}/${k[1]}`} target="_blank" rel="noopener">Read {ref} on Quran.com ↗</a></div>;
  }
  if (state.status === 'loading') return <div className={cls} lang="ar" dir="rtl"><span className="ar-ph">…</span></div>;
  return <div className={cls} lang="ar" dir="rtl">{state.texts.map((t, i) => <span key={i}>{t} <span className="ayah-no">۝{arNum(ayahs[i].split(':')[1])}</span>{' '}</span>)}</div>;
}

export function VerseCard({ v, page }: { v: Verse; page: string }) {
  const s = v.ref.split(':')[0];
  return (
    <article className="card verse reveal tilt">
      {v.arabic && v.ayahs.length ? <Arabic ayahs={v.ayahs} /> :
        <p className="ar-note">Only part of this verse is quoted. <a href={quranUrl(v.ref)} target="_blank" rel="noopener">Read the full verse in Arabic on Quran.com ↗</a></p>}
      <p className="en">{v.en}</p>
      {v.why && <p className="why">{v.why}</p>}
      {v.note && <p className="why small">{v.note}</p>}
      <footer><a className="ref" href={quranUrl(v.ref)} target="_blank" rel="noopener">{quranLabel(v.ref)}</a>
        <span className="surah">Sūrat {META.surahs[s]}</span><ReportBtn label={quranLabel(v.ref)} page={page} /></footer>
    </article>
  );
}

export function HadithCard({ h, page }: { h: Hadith; page: string }) {
  const text = h.en.startsWith('^') ? h.en.slice(1) : `“${h.en}”`;
  const label = h.srcs.map((s) => srcLabel(s)).join(' / ');
  return (
    <article className="card hadith reveal tilt">
      <p className="en">{text}</p>
      <p className="by">Narrated by {h.by}</p>
      {h.why && <p className="why">{h.why}</p>}
      <footer><SrcChips srcs={h.srcs} /><Grade g={hadithGrade(h)} sahih={!h.grade && isSahihayn(h.srcs)} /><ReportBtn label={label} page={page} /></footer>
    </article>
  );
}

export function DuaCard({ d, id, usedIn }: { d: Dua; id?: string; usedIn?: string[] }) {
  const sahih = !d.grade && isSahihayn(d.srcs);
  return (
    <article className="card dua reveal tilt" id={id}>
      <h3>{d.title}</h3>
      {d.ayahs?.length ? <Arabic ayahs={d.ayahs} /> : d.ar ? <div className="ar static" lang="ar" dir="rtl">{d.ar}</div> : null}
      {d.tr && <p className="translit">{d.tr}</p>}
      <p className="en">{d.en}</p>
      {d.note && <p className="why">{d.note}</p>}
      {usedIn && usedIn.length > 0 && <p className="used">Used on: {usedIn.map((s, i) => <span key={s}>{i > 0 && ' · '}<Link to={`/topic/${s}`}>{BY_SLUG[s].title}</Link></span>)}</p>}
      <footer><SrcChips srcs={d.srcs} /><Grade g={hadithGrade(d)} sahih={sahih} /></footer>
    </article>
  );
}

function Tasbih({ label, target }: { label: string; target: number }) {
  const [n, setN] = useState(0);
  const done = target > 0 && n >= target;
  useEffect(() => { const f = () => setN(0); window.addEventListener('sakina-reset-tasbih', f); return () => window.removeEventListener('sakina-reset-tasbih', f); }, []);
  return (
    <button type="button" className={`tasbih${done ? ' done' : ''}${n ? ' pop' : ''}`} onClick={() => {
      if (done) return; const m = n + 1; setN(m);
      try { navigator.vibrate?.(target && m === target ? 60 : 8); } catch { /* ignore */ }
    }}>
      <span className="tl" lang="ar">{label}</span>
      <span className="tn" key={n}>{done ? `✓ ${target}` : target ? `${n} / ${target}` : String(n)}</span>
    </button>
  );
}

export function RemedyCard({ r, id }: { r: Remedy; id: string }) {
  let en: ReactNode = r.en ? <p className="en">{r.en}</p> : null, quote: ReactNode = null;
  if (r.quote) quote = <p className="why">“{r.quote}” <span className="by-inline">({r.quote_by})</span></p>;
  else if (r.quote_by) { quote = <p className="why">{r.en} <span className="by-inline">({r.quote_by})</span></p>; en = null; }
  return (
    <article className="card remedy reveal tilt" id={'rem-' + id}>
      <h3>{r.title}</h3>
      <p className="do">{r.do}</p>
      {r.ayahs?.length ? <Arabic ayahs={r.ayahs} /> : r.ar ? <div className="ar static" lang="ar" dir="rtl">{r.ar}</div> : null}
      {r.tr && <p className="translit">{r.tr}</p>}
      {en}{quote}
      {r.extra && <p className="why small">{r.extra}</p>}
      {r.counters && (
        <div className="tasbihs" aria-label="Tap counters">
          {r.counters.map((c, i) => <Tasbih key={i} label={c.label} target={c.target || 0} />)}
          <button type="button" className="tasbih-reset" title="Reset counters" onClick={() => window.dispatchEvent(new Event('sakina-reset-tasbih'))}>↺</button>
        </div>
      )}
      <footer><SrcChips srcs={r.srcs} />{r.grade && <span className="grade">{r.grade}</span>}<ReportBtn label={r.title} page="remedies" /></footer>
    </article>
  );
}

export function Crisis() {
  return (
    <section className="crisis reveal" id="crisis">
      <h2>If it feels like too much right now</h2>
      <p>If you are thinking about ending your life or harming yourself, or you are in danger, please <strong>contact your local emergency number or a crisis line now</strong>, and tell someone near you. You deserve support.</p>
      <ul className="lines">
        <li><strong>India:</strong> Tele-MANAS, <a href="tel:14416">14416</a> (toll-free; also 1800-891-4416)</li>
        <li><strong>USA:</strong> call or text <a href="tel:988">988</a></li>
        <li><strong>UK &amp; Ireland:</strong> Samaritans, <a href="tel:116123">116 123</a></li>
        <li><strong>Anywhere:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</a> lists services by country</li>
      </ul>
      <p className="small">Numbers can change, so please check one is current for your country. Allah says: “…and do not kill yourselves. Indeed, Allah is ever Merciful to you” (<a href="https://quran.com/4/29" target="_blank" rel="noopener">Qur’an 4:29</a>).</p>
    </section>
  );
}

export function Breath() {
  const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle');
  useEffect(() => {
    if (phase === 'idle') return;
    const t = window.setTimeout(() => setPhase(phase === 'in' ? 'out' : 'in'), phase === 'in' ? 4000 : 6000);
    return () => window.clearTimeout(t);
  }, [phase]);
  return (
    <section className="breath-wrap reveal" aria-label="Breathing exercise">
      <h2>Take a breath first</h2>
      <p className="muted">Slow breathing helps your body calm down. Tap the circle, breathe with it, and if you like, remember Allah in your heart as you do (<a href="https://quran.com/13/28" target="_blank" rel="noopener">13:28</a>).</p>
      <button className={'breath' + (phase !== 'idle' ? ' ' + phase : '')} type="button" aria-label="Start or stop the breathing guide" onClick={() => setPhase((p) => (p === 'idle' ? 'in' : 'idle'))}>
        <span className="ring r1" /><span className="ring r2" /><span className="orb" />
        <span className="cue">{phase === 'in' ? 'Breathe in…' : phase === 'out' ? 'Slowly out…' : 'Tap to begin'}</span>
      </button>
    </section>
  );
}

export function TopicCard({ t }: { t: Topic }) {
  return (
    <Link className="topic-card reveal tilt" to={`/topic/${t.slug}`} style={{ ['--h' as string]: t.hue }}>
      <span className="glyph">{t.glyph}</span><h3>{t.title}</h3><p>{t.tagline}</p><span className="go">Open →</span>
    </Link>
  );
}
