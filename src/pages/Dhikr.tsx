import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SrcChips, SplitTitle } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { load, save } from '../lib/storage';
import type { Src } from '../types';

interface Phrase { id: string; ar: string; tr: string; en: string; say: string[]; srcs: Src[]; note?: string }
// Phrases and sources are the ones already used on the "To feel better" cards.
const PHRASES: Phrase[] = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', tr: 'SubḥānAllāh', en: 'Glory be to Allah', say: ['سبحان الله', 'subhanallah', 'subhanallah'], srcs: [['muslim', 2137]] },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Alḥamdulillāh', en: 'All praise is for Allah', say: ['الحمد لله', 'alhamdulillah'], srcs: [['muslim', 2137]] },
  { id: 'lailaha', ar: 'لَا إِلَهَ إِلَّا اللَّهُ', tr: 'Lā ilāha illā Allāh', en: 'There is no god but Allah', say: ['لا اله الا الله', 'la ilaha illallah', 'la ilaha illa allah'], srcs: [['muslim', 2137]] },
  { id: 'akbar', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allāhu akbar', en: 'Allah is the Greatest', say: ['الله اكبر', 'allahu akbar'], srcs: [['muslim', 2137]] },
  { id: 'istighfar', ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'Astaghfirullāh', en: 'I seek Allah’s forgiveness', say: ['استغفر الله', 'astaghfirullah'], srcs: [['bukhari', 6307]], note: 'The Prophet ﷺ said he asks Allah’s forgiveness more than seventy times a day. Seventy is an example of often, not a required number.' },
  { id: 'lahawla', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Lā ḥawla wa lā quwwata illā billāh', en: 'There is no power and no strength except with Allah', say: ['لا حول ولا قوة الا بالله', 'la hawla wa la quwwata illa billah'], srcs: [['bukhari', 6384], ['muslim', 2704]] },
  { id: 'salawat', ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', tr: 'Ṣallā Allāhu ʿalayhi wa sallam', en: 'May Allah send blessings and peace upon him', say: ['صلى الله عليه وسلم', 'sallallahu alayhi wasallam'], srcs: [['quran', '33:56']], note: 'Allah and His angels send blessings upon the Prophet ﷺ, and we are told to do so too (33:56).' },
];
const TARGETS: [string, number][] = [['No target', 0], ['33', 33], ['34', 34], ['100', 100]];
const KEY = 'sakina-dhikr';
interface Saved { phrase: string; target: number; counts: Record<string, number>; day: string; today: number }
const today = () => new Date().toDateString();

const norm = (s: string) => s.toLowerCase().replace(/[ً-ٰۖ-ۭـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}]/gu, '');
function countIn(text: string, p: Phrase): number {
  const t = norm(text);
  return Math.max(0, ...p.say.map((v) => { const n = norm(v); return n ? t.split(n).length - 1 : 0; }));
}

type SR = { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; onresult: ((e: any) => void) | null; onend: (() => void) | null; onerror: ((e: any) => void) | null };
const getSR = (): (new () => SR) | null => { const w = window as any; return w.SpeechRecognition || w.webkitSpeechRecognition || null; };

export default function DhikrPage() {
  usePageHue(160); usePageEffects();
  const init = load<Saved>(KEY, { phrase: 'subhanallah', target: 33, counts: {}, day: today(), today: 0 });
  const [st, setSt] = useState<Saved>(() => (init.day === today() ? init : { ...init, day: today(), today: 0 }));
  const [listening, setListening] = useState(false), [heard, setHeard] = useState(''), [msg, setMsg] = useState('');
  const [setVal, setSetVal] = useState('');
  const supported = !!getSR();
  const p = PHRASES.find((x) => x.id === st.phrase) ?? PHRASES[0];
  const count = st.counts[p.id] ?? 0;
  const stRef = useRef(st); stRef.current = st;
  const applied = useRef(0), countedPhrase = useRef(''), ignoreBefore = useRef(0), finalSeen = useRef<Record<number, number>>({}), lastFinal = useRef({ t: '', at: 0 });
  const recRef = useRef<SR | null>(null), wantRef = useRef(false);

  const commit = useCallback((fn: (s: Saved) => Saved) => setSt((s) => { const n = fn(s); save(KEY, n); return n; }), []);
  const add = useCallback((d: number) => commit((s) => {
    const c = Math.max(0, (s.counts[s.phrase] ?? 0) + d);
    const delta = c - (s.counts[s.phrase] ?? 0);
    if (s.target && (s.counts[s.phrase] ?? 0) < s.target && c >= s.target) { try { navigator.vibrate?.(80); } catch { /* ignore */ } }
    return { ...s, counts: { ...s.counts, [s.phrase]: c }, today: Math.max(0, s.today + delta) };
  }), [commit]);

  const stop = useCallback(() => { wantRef.current = false; recRef.current?.stop(); recRef.current = null; setListening(false); }, []);
  useEffect(() => stop, [stop]);
  const start = () => {
    const SRc = getSR(); if (!SRc) return;
    setMsg(''); setHeard(''); ignoreBefore.current = 0; finalSeen.current = {};
    const r = new SRc(); r.lang = 'ar-SA'; r.continuous = true; r.interimResults = true;
    // Counting rules (they make the count robust across browsers):
    //  - every FINAL result is one finished utterance: its occurrences are summed;
    //  - not-yet-final results AFTER the last final are cumulative guesses of the current utterance, so only the best one counts (max, not sum);
    //    guesses before a final are stale (that final replaced them);
    //  - the counter only ever goes up from this total (a revised guess never subtracts or double-adds);
    //  - a final that repeats the previous final within 1.2 s is treated as the browser re-sending it.
    applied.current = 0; lastFinal.current = { t: '', at: 0 }; countedPhrase.current = stRef.current.phrase;
    r.onresult = (e) => {
      const ph = PHRASES.find((x) => x.id === stRef.current.phrase) ?? PHRASES[0];
      if (countedPhrase.current !== ph.id) { applied.current = 0; countedPhrase.current = ph.id; ignoreBefore.current = e.results.length; }
      let finals = 0, pending = 0, latest = '', lastFinalIdx = -1;
      for (let i = ignoreBefore.current; i < e.results.length; i++) if (e.results[i].isFinal) lastFinalIdx = i;
      for (let i = ignoreBefore.current; i < e.results.length; i++) {
        const res = e.results[i], t: string = res[0].transcript, n = countIn(t, ph);
        latest = t;
        if (res.isFinal) {
          const key = norm(t), now = Date.now();
          const dup = finalSeen.current[i] === undefined && key === lastFinal.current.t && now - lastFinal.current.at < 1200;
          if (finalSeen.current[i] === undefined) { finalSeen.current[i] = dup ? 0 : n; lastFinal.current = { t: key, at: now }; }
          finals += finalSeen.current[i];
        } else if (i > lastFinalIdx) pending = Math.max(pending, n); // guesses before a final are superseded by it
      }
      const total = finals + pending;
      if (total > applied.current) { add(total - applied.current); applied.current = total; }
      if (latest) setHeard(latest.trim());
    };
    r.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { setMsg('Microphone permission was blocked. Allow the microphone for this site, or keep using the tap button.'); stop(); }
      else if (e.error === 'network') { setMsg('The speech service needs an internet connection.'); stop(); }
      else if (e.error === 'audio-capture') { setMsg('No microphone was found.'); stop(); }
    };
    r.onend = () => { if (wantRef.current) { applied.current = 0; ignoreBefore.current = 0; finalSeen.current = {}; try { r.start(); } catch { /* already started */ } } else setListening(false); };
    wantRef.current = true; recRef.current = r;
    try { r.start(); setListening(true); } catch { setMsg('Could not start listening. Please try again.'); wantRef.current = false; }
  };

  const pct = st.target ? Math.min(1, count / st.target) : 0, R = 92, C = 2 * Math.PI * R;
  const done = st.target > 0 && count >= st.target;
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/">← Home</Link>
        <p className="eyebrow">Remembrance</p>
        <SplitTitle text="Dhikr counter" />
        <p className="tagline">Tap, type a number, or say it out loud and let it count.</p>
        <p className="intro">Remembering Allah brings peace to the heart (Qur’an 13:28). Pick a phrase and count however is easiest. Fixed numbers are only given in the hadith for specific times (for example 33, 33 and 34 at bedtime). Otherwise, say it as often as you like.</p>
      </section>
      <section className="block dhikr">
        <div className="phrase-tabs reveal" role="tablist" aria-label="Dhikr phrase">
          {PHRASES.map((x) => <button key={x.id} role="tab" aria-selected={x.id === p.id} className={'ptab' + (x.id === p.id ? ' on' : '')} onClick={() => commit((s) => ({ ...s, phrase: x.id }))}>{x.tr}</button>)}
        </div>
        <article className="card dh-card reveal">
          <div className="ar static" lang="ar" dir="rtl">{p.ar}</div>
          <p className="translit">{p.tr}</p>
          <p className="en">{p.en}</p>
          {p.note && <p className="why small">{p.note}</p>}
          <footer><SrcChips srcs={p.srcs} /></footer>
        </article>
        <div className="dh-main reveal">
          <button type="button" className={'dh-btn' + (done ? ' done' : '')} onClick={() => { add(1); try { navigator.vibrate?.(8); } catch { /* ignore */ } }} aria-label={`Add one. Current count ${count}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r={R} className="dh-track" /><circle cx="100" cy="100" r={R} className="dh-prog" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 100 100)" /></svg>
            <span className="dh-num" aria-live="polite">{count}</span>
            <span className="dh-sub">{st.target ? (done ? `✓ target ${st.target} reached` : `of ${st.target}`) : 'tap to count'}</span>
          </button>
          <div className="dh-row">
            <button className="btn" type="button" onClick={() => add(-1)} aria-label="Subtract one">− 1</button>
            <button className="btn" type="button" onClick={() => commit((s) => ({ ...s, counts: { ...s.counts, [s.phrase]: 0 } }))}>Reset</button>
            <label className="dh-set">Set number <input inputMode="numeric" value={setVal} onChange={(e) => setSetVal(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="e.g. 40" />
              <button className="btn" type="button" onClick={() => { if (setVal === '') return; const n = +setVal; commit((s) => ({ ...s, counts: { ...s.counts, [s.phrase]: n }, today: Math.max(0, s.today + n - (s.counts[s.phrase] ?? 0)) })); setSetVal(''); }}>Set</button></label>
          </div>
          <div className="dh-row">
            <span className="muted">Target:</span>
            {TARGETS.map(([l, v]) => <button key={l} className={'ptab' + (st.target === v ? ' on' : '')} onClick={() => commit((s) => ({ ...s, target: v }))}>{l}</button>)}
            <label className="dh-set">Custom <input inputMode="numeric" placeholder="e.g. 99" onChange={(e) => { const n = +e.target.value.replace(/\D/g, ''); if (n > 0) commit((s) => ({ ...s, target: n })); }} /></label>
          </div>
          <p className="small muted">Today, across all phrases: <strong>{st.today}</strong></p>
        </div>
        <article className="card voice reveal">
          <h3>Voice counting (beta)</h3>
          {supported ? <>
            <p>Choose a phrase above, press the button, then say it in Arabic. Each time you say <strong>{p.tr}</strong> it adds one. You can say it several times in a row.</p>
            <p><button type="button" className={'btn ' + (listening ? '' : 'primary')} onClick={() => (listening ? stop() : start())} aria-pressed={listening}>{listening ? '■ Stop listening' : '🎙 Start voice counting'}</button></p>
            {listening && <p className="listening"><span className="pulse-dot" /> Listening… {heard && <em>heard: “{heard}”</em>}</p>}
            {msg && <p className="why">{msg}</p>}
            <p className="small muted">How it works: your browser’s speech recognition listens through the microphone and sends the audio to the browser maker’s speech service (for example Google for Chrome), so it needs internet and microphone permission. Sakīna does not record or keep anything. Recognition is not perfect, especially with accents or background noise, so if the number looks off, use − 1, Set number, or tap instead.</p>
          </> : <p className="muted">Voice counting isn’t supported in this browser. It works in recent Chrome, Edge and Safari. The tap button and number entry work everywhere.</p>}
        </article>
      </section>
    </>
  );
}
