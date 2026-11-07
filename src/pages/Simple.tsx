import { Link } from 'react-router-dom';
import { TOPICS, DUAS, REMEDIES } from '../data';
import { Crisis, DuaCard, SplitTitle } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';
import { quranLabel, quranUrl, hadithUrl, srcLabel, isSahihayn } from '../lib/refs';
import { LESSONS } from '../journey/lessons';
import { load, save } from '../lib/storage';
import { useState } from 'react';
import type { Src } from '../types';

export function DuasPage() {
  usePageHue(45); usePageEffects();
  const used: Record<string, string[]> = {};
  TOPICS.forEach((t) => t.duas.forEach((k) => (used[k] ??= []).push(t.slug)));
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/">← Home</Link>
        <p className="eyebrow">Supplications</p>
        <SplitTitle text="Du’as for hard moments" />
        <p className="tagline">Words you can say when you have none of your own, and also in your own language.</p>
        <p className="intro">You can always speak to Allah in your own words. These are words taught by Allah and His Messenger ﷺ. Arabic Qur’an text is loaded live from a Qur’an API; the other Arabic is short and well-known, and each du’a lists its source.</p>
      </section>
      <section className="block"><div className="grid">{Object.entries(DUAS).map(([k, d]) => <DuaCard key={k} id={k} d={d} usedIn={used[k]} />)}</div></section>
    </>
  );
}

export function AboutPage() {
  usePageHue(45); usePageEffects();
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/">← Home</Link>
        <p className="eyebrow">About</p>
        <SplitTitle text="About & sources" />
        <p className="tagline">What this is, how to check it, and what it is not.</p>
      </section>
      <section className="block prose reveal">
        <h2>Why Sakīna exists</h2>
        <p>Sakīna (سكينة) means tranquility, the calm Allah places in hearts. This site gathers Qur’an and Hadith references on problems many young people face today: stress, loneliness, comparison, burnout, sleep, screens and more. The aim is comfort in dark times.</p>
        <h2>How references are written</h2>
        <ul>
          <li><strong>Qur’an:</strong> shown as <em>surah:verse</em> (for example 94:5–6), each linking to Quran.com. The Arabic text is fetched live from the Qur’an API so that no letter is typed by hand. English is a translation of the meaning, not the Qur’an itself.</li>
          <li><strong>Hadith:</strong> shown as collection + number (for example Ṣaḥīḥ al-Bukhārī 5641), each linking to Sunnah.com. Numbering follows Sunnah.com; some editions number hadith differently, so if a number looks off in your printed copy, search by the wording.</li>
          <li><strong>Grading:</strong> hadith found in Ṣaḥīḥ al-Bukhārī or Ṣaḥīḥ Muslim are marked Ṣaḥīḥ. Others carry the grade given by scholars (for example Ḥasan). Weak hadith are not used.</li>
          <li><strong>Partial verses:</strong> where only part of a verse is quoted, the card says so and sends you to the full verse.</li>
          <li><strong>Interpretations:</strong> the short notes under each reference are reflections, not tafsīr or fatwā.</li>
        </ul>
        <h2>The Journey (learning section)</h2>
        <p>The Journey gives very short beginner lessons on the basics of Islam. Each lesson lists the Qur’an verse or hadith it rests on, and the explanations are kept to widely agreed basics. Where scholars differ (for example, details of how to pray), the lessons say so and send you to a teacher or your local masjid. Quiz questions only test what the lesson just taught.</p>
        <h2>Review status</h2>
        <p><strong>This is a personal project and has not yet been formally reviewed by a qualified scholar or a mental health professional.</strong> Please treat it as a work in progress. The <Link to="/references">references page</Link> lists every verse and hadith so a reviewer can check them.</p>
        <h2>Please verify and ask</h2>
        <p>Please check anything important yourself on <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> and <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a>, and ask a qualified scholar about religious rulings. If you find a mistake, please report it so that it can be corrected.</p>
        <h2>What this site is not</h2>
        <p>It is not medical or psychological advice and it is not a substitute for therapy, medication or professional care. Depression, anxiety and other conditions are real health issues. Seeking treatment is encouraged in the Sunnah: “Allah has not sent down a disease except that He has also sent down its cure” (<a href="https://sunnah.com/bukhari:5678" target="_blank" rel="noopener">Ṣaḥīḥ al-Bukhārī 5678</a>).</p>
      </section>
      <Crisis />
    </>
  );
}

interface Row { kind: string; label: string; url: string; excerpt: string; grade: string; pages: string[] }
function buildRows(): Row[] {
  const rows = new Map<string, Row>();
  const add = (key: string, kind: string, label: string, url: string, excerpt: string, grade: string, page: string) => {
    const r = rows.get(key) ?? { kind, label, url, excerpt, grade, pages: [] };
    if (!r.pages.includes(page)) r.pages.push(page);
    rows.set(key, r);
  };
  const lab = (srcs: Src[]) => srcs.map(srcLabel).join(' / ');
  const url0 = (s: Src) => (s[0] ? (s[0] === 'quran' ? quranUrl(String(s[1])) : hadithUrl(s[0], s[1])) : '');
  TOPICS.forEach((t) => {
    t.verses.forEach((v) => add('q' + v.ref, 'Qur’an', quranLabel(v.ref), quranUrl(v.ref), v.en, v.arabic ? '' : 'partial verse', 'topic/' + t.slug));
    t.hadith.forEach((h) => add('h' + JSON.stringify(h.srcs), 'Hadith', lab(h.srcs), url0(h.srcs[0]), h.en.replace(/^\^/, ''), h.grade || (isSahihayn(h.srcs) ? 'Ṣaḥīḥ' : ''), 'topic/' + t.slug));
  });
  Object.entries(REMEDIES).forEach(([k, r]) => r.srcs.forEach((s) => {
    if (s[0] === 'quran') add('q' + s[1], 'Qur’an', quranLabel(String(s[1])), quranUrl(String(s[1])), r.en ?? r.title, '', 'feel:' + k);
    else add('r' + k + JSON.stringify(s), 'Dhikr / action source', srcLabel(s), url0(s), r.quote ?? r.title, r.grade ?? '', 'feel:' + k);
  }));
  Object.entries(DUAS).forEach(([k, d]) => d.srcs.forEach((s) => { if (s[0] !== 'quran') add('d' + k + JSON.stringify(s), 'Du’a source', srcLabel(s), url0(s), d.title + ': ' + d.en, d.grade ?? '', 'duas'); }));
  LESSONS.forEach((l) => l.sources.forEach((s) => {
    if (s[0] === 'quran') add('q' + s[1], 'Qur’an', quranLabel(String(s[1])), quranUrl(String(s[1])), l.title, '', 'journey/' + l.id);
    else add('j' + JSON.stringify(s), 'Hadith (Journey)', srcLabel(s), url0(s), l.title, isSahihayn([s]) ? 'Ṣaḥīḥ' : '', 'journey/' + l.id);
  }));
  return [...rows.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.label.localeCompare(b.label, undefined, { numeric: true }));
}
export function ReferencesPage() {
  usePageHue(45); usePageEffects();
  const rows = buildRows();
  const [checked, setChecked] = useState<Record<string, boolean>>(() => load('sakina-rev', {}));
  const n = rows.filter((r, i) => checked[`${i}-${r.label}`]).length;
  const href = (p: string) => (p.startsWith('feel:') ? null : '/' + p);
  return (
    <>
      <section className="hero topic-hero">
        <Link className="crumb" to="/about">← About</Link><p className="eyebrow">For reviewers</p>
        <SplitTitle text="Every reference, in one place" />
        <p className="tagline">{rows.length} references to check</p>
        <p className="intro">Tick each row after checking the wording and the source. Ticks are saved only in this browser, so use it as a personal checklist, and print the page if you need a record. Wording shown is the English used on the site.</p>
        <p className="rv-count">{n} of {rows.length} reviewed in this browser</p>
      </section>
      <section className="block"><div className="tablewrap reveal"><table className="reftable">
        <thead><tr><th>✓</th><th>Type</th><th>Reference</th><th>English on site</th><th>Grade</th><th>Used on</th></tr></thead>
        <tbody>{rows.map((r, i) => { const k = `${i}-${r.label}`; return (
          <tr key={k}>
            <td><input type="checkbox" className="rv" aria-label="Mark reviewed" checked={!!checked[k]} onChange={(e) => { const c = { ...checked, [k]: e.target.checked }; setChecked(c); save('sakina-rev', c); }} /></td>
            <td>{r.kind}</td>
            <td>{r.url ? <a href={r.url} target="_blank" rel="noopener">{r.label}</a> : r.label}</td>
            <td className="ex">{r.excerpt.length > 170 ? r.excerpt.slice(0, 170) + '…' : r.excerpt}</td>
            <td>{r.grade}</td>
            <td>{r.pages.map((p, j) => <span key={p}>{j > 0 && ', '}{href(p) ? <Link to={href(p)!}>{p}</Link> : 'to-feel-better: ' + p.slice(5)}</span>)}</td>
          </tr>); })}</tbody>
      </table></div></section>
    </>
  );
}

export function NotFound() {
  usePageHue(45);
  return <section className="hero topic-hero"><p className="eyebrow">404</p><SplitTitle text="Page not found" /><p className="tagline">That page doesn’t exist.</p><p><Link className="btn primary" to="/">Back home</Link></p></section>;
}
