import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { META } from '../data';
import { HadithCard, SplitTitle, VerseCard } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { PT_KEY, PRAYERS, dur, fetchTimes, hasLocation, nextPrayer, showTime, type PtData, type PtSettings } from '../lib/prayer';
import { load, save } from '../lib/storage';
import type { Hadith, Verse } from '../types';

const PV: Verse = { ref: '4:103', ayahs: ['4:103'], arabic: true, en: 'And when you have completed the prayer, remember Allah standing, sitting, or [lying] on your sides. But when you become secure, re-establish [regular] prayer. Indeed, prayer has been decreed upon the believers at specified times.', why: 'Prayer has appointed times, which is why accurate times matter.' };
const PH: Hadith = { en: '^Ibn Masʿūd asked the Prophet ﷺ: “Which deed is most beloved to Allah?” He said: “Prayer at its proper time.” He asked: “Then what?” He said: “Kindness to parents.” He asked: “Then what?” He said: “Jihad in the cause of Allah.”', by: 'ʿAbdullāh ibn Masʿūd (may Allah be pleased with him)', srcs: [['bukhari', 527], ['muslim', 85]], why: 'The first answer is the one to remember: prayer on time.', grade: null };
const PH2: Hadith = { en: '^The Prophet ﷺ asked: “What do you think if there were a river at the door of one of you in which he bathed five times every day; would any dirt remain on him?” They said, “No dirt would remain.” He said: “That is like the five prayers; by them Allah erases sins.”', by: 'Abū Hurayrah (may Allah be pleased with him)', srcs: [['bukhari', 528], ['muslim', 667]], why: '', grade: null };

function useTimes(st: PtSettings | null) {
  const [data, setData] = useState<PtData | null>(null);
  const [err, setErr] = useState(false), [loading, setLoading] = useState(false);
  const key = st ? JSON.stringify([st.country, st.city, st.lat, st.lon, st.method, st.school]) : '';
  useEffect(() => {
    if (!st || !hasLocation(st)) return;
    let live = true; setLoading(true); setErr(false);
    fetchTimes(st).then((d) => { if (live) { setData(d); setLoading(false); } }).catch(() => { if (live) { setErr(true); setLoading(false); } });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { data, err, loading };
}
function useTick(on: boolean) {
  const [, setN] = useState(0);
  useEffect(() => { if (!on) return; const t = window.setInterval(() => setN((n) => n + 1), 1000); return () => window.clearInterval(t); }, [on]);
}

export function PrayerMini() {
  const [sv] = useState(() => load<PtSettings | null>(PT_KEY, null));
  const { data, err } = useTimes(sv);
  useTick(!!data);
  const nx = data ? nextPrayer(data.timings, data.tz) : null;
  return (
    <section className="block pt-mini reveal" id="pt-mini">
      <div className="sec-head"><span className="num">☪</span><h2>Prayer times</h2></div>
      <p className="muted">Your times by country and city, with the next prayer counting down.</p>
      <div className="pt-mini-body">
        {nx && data ? <>
          <div className="pt-next mini"><span className="eyebrow">Next prayer</span><strong>{nx.name}{nx.tomorrow ? ' (tomorrow)' : ''} · {showTime(data.timings[nx.name], sv?.h12 !== false)}</strong><span>in {dur(nx.in)}</span></div>
          <Link className="btn" to="/prayer-times">All times</Link></>
          : hasLocation(sv) && !err ? <span className="muted">Loading…</span>
          : <Link className="btn primary" to="/prayer-times">{hasLocation(sv) ? 'Open prayer times' : 'Set your location'}</Link>}
      </div>
    </section>
  );
}

export default function PrayerTimesPage() {
  usePageHue(45); usePageEffects();
  const saved = load<PtSettings>(PT_KEY, {});
  const [country, setCountry] = useState(saved.country ?? ''), [city, setCity] = useState(saved.city ?? '');
  const [method, setMethod] = useState(saved.method ?? 'auto'), [school, setSchool] = useState(saved.school ?? '0');
  const [h12, setH12] = useState(saved.h12 !== false);
  const [active, setActive] = useState<PtSettings | null>(hasLocation(saved) ? saved : null);
  const [msg, setMsg] = useState('');
  const { data, err, loading } = useTimes(active);
  useTick(!!data);
  const persist = useCallback((s: PtSettings) => { setActive(s); save(PT_KEY, s); }, []);
  const submit = (e: FormEvent) => { e.preventDefault(); setMsg(''); persist({ country: country.trim(), city: city.trim(), method, school, h12 }); };
  const geo = () => {
    if (!navigator.geolocation) { setMsg('Your browser can’t share its location. Please type your city instead.'); return; }
    setMsg('Asking your browser for your location…');
    navigator.geolocation.getCurrentPosition((p) => { setMsg(''); persist({ lat: p.coords.latitude.toFixed(4), lon: p.coords.longitude.toFixed(4), method, school, h12 }); },
      () => setMsg('Location was not shared. Please type your country and city instead.'), { timeout: 12000 });
  };
  const toggle12 = () => { const v = !h12; setH12(v); if (active) save(PT_KEY, { ...active, h12: v }); };
  const nx = data ? nextPrayer(data.timings, data.tz) : null;
  const loc = active?.lat != null ? 'your location' : [active?.city, active?.country].filter(Boolean).join(', ');
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/">← Home</Link>
        <p className="eyebrow">Ṣalāh</p>
        <SplitTitle text="Prayer times" />
        <p className="tagline">Choose your country and city, or use your location.</p>
        <p className="intro">Prayer is the anchor of the day and a built-in rest from the screen. Times are calculated for your place, and methods differ between countries, so please also check with your local masjid.</p>
      </section>
      <section className="block pt" id="pt-app">
        <form className="pt-form reveal" onSubmit={submit} autoComplete="off">
          <label>Country<input value={country} onChange={(e) => setCountry(e.target.value)} list="countries" placeholder="e.g. India" required /></label>
          <label>City<input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Hyderabad" required /></label>
          <label>Calculation method
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="auto">Automatic (by location)</option><option value="1">University of Islamic Sciences, Karachi</option><option value="2">ISNA (North America)</option>
              <option value="3">Muslim World League</option><option value="4">Umm al-Qura, Makkah</option><option value="5">Egyptian General Authority</option>
              <option value="8">Gulf Region</option><option value="9">Kuwait</option><option value="10">Qatar</option><option value="11">Singapore (MUIS)</option>
              <option value="13">Turkey (Diyanet)</option><option value="15">Moonsighting Committee</option>
            </select></label>
          <label>Asr time
            <select value={school} onChange={(e) => setSchool(e.target.value)}><option value="0">Standard (Shāfiʿī, Mālikī, Ḥanbalī)</option><option value="1">Ḥanafī (later Asr)</option></select></label>
          <div className="pt-actions"><button className="btn primary" type="submit">Show times</button><button className="btn" type="button" onClick={geo}>Use my location</button><button className="btn" type="button" onClick={toggle12}>12 / 24 hour</button></div>
          <datalist id="countries">{META.countries.map((c) => <option key={c} value={c} />)}</datalist>
        </form>
        <p className="pt-status" role="status">{msg || (loading ? 'Loading prayer times…' : err ? 'Couldn’t load the times. Please check the country and city spelling and your connection, then try again. Meanwhile your local masjid timetable is the best guide.' : '')}</p>
        {nx && data && !loading && (
          <div className="pt-next"><span className="eyebrow">Next prayer</span><strong>{nx.name}{nx.tomorrow ? ' (tomorrow)' : ''}</strong><span>in {dur(nx.in)}</span></div>
        )}
        {data && !loading && <div className="pt-grid">{PRAYERS.map(([k, n, ar]) => (
          <div key={k} className={'pt-card' + (nx?.name === k ? ' next' : '')}><span className="pn">{n}</span><span className="pa" lang="ar">{ar}</span><span className="pv">{showTime(data.timings[k], h12)}</span></div>))}</div>}
        {data && !loading && <p className="small muted">{[loc, data.tz && 'Time zone: ' + data.tz, data.method && 'Method: ' + data.method, data.hijri && `${data.hijri.day} ${data.hijri.month.en} ${data.hijri.year} AH`, data.cached && '(saved copy, you are offline)'].filter(Boolean).join(' · ')}</p>}
      </section>
      <section className="block"><div className="sec-head reveal"><span className="num">I</span><h2>About the prayers</h2></div>
        <div className="grid"><VerseCard v={PV} page="prayer-times" /><HadithCard h={PH} page="prayer-times" /><HadithCard h={PH2} page="prayer-times" /></div></section>
      <section className="block prose reveal"><h2>About these times</h2>
        <p>Times come from the free <a href="https://aladhan.com/prayer-times-api" target="_blank" rel="noopener">AlAdhan prayer-times service</a>. Countries and communities use different calculation methods, and some masjids follow their own timetable. If the times here differ from your local masjid, please follow your masjid. Your chosen city is saved only in this browser.</p></section>
    </>
  );
}
