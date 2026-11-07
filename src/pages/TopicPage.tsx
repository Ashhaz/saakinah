import { Link, Navigate, useParams } from 'react-router-dom';
import { TOPICS, BY_SLUG, DUAS, REMEDIES, FEEL, GROUP_NAME } from '../data';
import { Breath, Crisis, DuaCard, HadithCard, RemedyCard, ScrollLink, SplitTitle, SrcChips, VerseCard } from '../components/Bits';
import { usePageEffects, usePageHue } from '../components/hooks';

export default function TopicPage() {
  const { slug = '' } = useParams();
  const t = BY_SLUG[slug];
  usePageHue(t?.hue ?? 45);
  usePageEffects(slug);
  if (!t) return <Navigate to="/404" replace />;
  const i = TOPICS.indexOf(t);
  const prev = TOPICS[(i - 1 + TOPICS.length) % TOPICS.length], next = TOPICS[(i + 1) % TOPICS.length];
  const st = t.start, fl = FEEL[t.slug] ?? [];
  return (
    <div key={t.slug}>
      <section className="hero topic-hero">
        <Link className="crumb" to="/" state={{ scroll: 'topics' }}>← All topics</Link>
        <p className="eyebrow">{GROUP_NAME[t.group]}</p>
        <SplitTitle text={t.title} />
        <p className="tagline">{t.tagline}</p>
        <p className="intro">{t.intro}</p>
        <div className="chips">
          {st && <ScrollLink to="start">Start here</ScrollLink>}
          {fl.length > 0 && <ScrollLink to="feel">To feel better</ScrollLink>}
          <ScrollLink to="quran">{t.verses.length} Qur’an passages</ScrollLink>
          <ScrollLink to="hadith">{t.hadith.length} hadith</ScrollLink>
          {t.duas.length > 0 && <ScrollLink to="duas">Du’as</ScrollLink>}
        </div>
        <div className="scroll-cue" aria-hidden="true"><i /></div>
      </section>
      {t.callout && <aside className="callout reveal"><h3>{t.callout.title}</h3><p>{t.callout.body}</p></aside>}
      {t.widget === 'breath' && <Breath />}
      {st && (
        <section className="block start reveal" id="start">
          <div className="sec-head"><span className="num">★</span><h2>Start here</h2></div>
          <p className="plain">{st.plain}</p>
          <p className="muted">If you only have a minute, read these. The full library follows.</p>
          <div className="grid">
            <VerseCard v={t.verses[st.v]} page={t.slug} />
            <HadithCard h={t.hadith[st.h]} page={t.slug} />
            {st.d && <DuaCard d={DUAS[st.d]} />}
          </div>
          <p><ScrollLink to="quran" className="btn">The full library ↓</ScrollLink></p>
        </section>
      )}
      {fl.length > 0 && (
        <section className="block feel" id="feel">
          <div className="sec-head reveal"><span className="num">✺</span><h2>To feel better: do this</h2></div>
          <p className="muted reveal">Don’t try everything. Pick one that feels doable, and do it now. Fixed numbers are given only where the hadith gives them; otherwise say it as often as you like.</p>
          <div className="grid">{fl.map((k) => <RemedyCard key={k} id={k} r={REMEDIES[k]} />)}</div>
        </section>
      )}
      <section className="block" id="quran">
        <div className="sec-head reveal"><span className="num">I</span><h2>From the Qur’an</h2></div>
        <div className="grid">{t.verses.map((v) => <VerseCard key={v.ref + v.en.slice(0, 8)} v={v} page={t.slug} />)}</div>
      </section>
      <section className="block" id="hadith">
        <div className="sec-head reveal"><span className="num">II</span><h2>From the Prophet <span className="pbuh">ﷺ</span></h2></div>
        <div className="grid">{t.hadith.map((h, k) => <HadithCard key={k} h={h} page={t.slug} />)}</div>
      </section>
      {t.story && (
        <section className="block story reveal">
          <div className="sec-head"><span className="num">✦</span><h2>{t.story.title}</h2></div>
          {t.story.body.map((p, k) => <p key={k}>{p}</p>)}
          <footer><SrcChips srcs={t.story.src} /></footer>
        </section>
      )}
      {t.duas.length > 0 && (
        <section className="block" id="duas">
          <div className="sec-head reveal"><span className="num">III</span><h2>Du’as for this moment</h2></div>
          <div className="grid">{t.duas.map((k) => <DuaCard key={k} d={DUAS[k]} id={k} />)}</div>
        </section>
      )}
      <section className="block steps reveal" id="steps">
        <div className="sec-head"><span className="num">❋</span><h2>Gentle, practical steps</h2></div>
        <p className="muted">Small things you can try today. Not religious rulings, just ordinary wellbeing help that sits well alongside the guidance above.</p>
        <ol>{t.steps.map((s, k) => <li key={k}>{s}</li>)}</ol>
        {t.note_medical && <p className="small muted">These are general wellbeing suggestions, not religious rulings or medical advice. If symptoms persist, please see a health professional.</p>}
      </section>
      {t.crisis && <Crisis />}
      <section className="block related reveal">
        <h2>You might also need</h2>
        <div className="rel-row">{t.related.map((r) => <Link key={r} className="rel" to={`/topic/${r}`}><span>{BY_SLUG[r].glyph}</span>{BY_SLUG[r].title}</Link>)}</div>
      </section>
      <nav className="pager reveal">
        <Link to={`/topic/${prev.slug}`}><small>← Previous</small>{prev.title}</Link>
        <Link to={`/topic/${next.slug}`}><small>Next →</small>{next.title}</Link>
      </nav>
    </div>
  );
}
