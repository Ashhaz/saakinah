import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import Background3D from './Background3D';
import { pointer, scrollState } from '../lib/input';
import { useProgress } from '../journey/progress';
import { useRouteScroll } from './hooks';

export default function Layout() {
  const { calm, toggleCalm, toastMsg } = useApp();
  const { pathname } = useLocation();
  const bar = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const { streak } = useProgress();
  useRouteScroll();

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollState.p = Math.min(1, window.scrollY / max);
      if (bar.current) bar.current.style.transform = `scaleX(${scrollState.p})`;
    };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (glow.current && e.pointerType === 'mouse') glow.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('pointermove', onMove); };
  }, [pathname]);

  return (
    <>
      <Background3D />
      <div className="vignette" aria-hidden="true" />
      <div className="glow" ref={glow} aria-hidden="true" />
      <div className="progress" aria-hidden="true"><i ref={bar} /></div>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/"><span className="mark">✶</span><span>Sakīna</span></Link>
        <nav>
          <Link to="/" state={{ scroll: 'topics' }}>Topics</Link>
          <NavLink to="/journey">Journey{streak > 0 && <span className="streak-pill" title="Your learning streak"> 🔥{streak}</span>}</NavLink>
          <NavLink to="/dhikr">Dhikr</NavLink>
          <NavLink to="/prayer-times">Prayer times</NavLink>
          <NavLink to="/duas">Du’as</NavLink>
          <NavLink to="/about">About &amp; sources</NavLink>
          <button className="calm-btn" type="button" aria-pressed={calm} onClick={toggleCalm} title="Turn off 3D background and animations">{calm ? 'Calm mode: on' : 'Calm mode'}</button>
        </nav>
      </header>
      <main id="main" tabIndex={-1} key={pathname} className="page"><Outlet /></main>
      <footer className="site-footer">
        <div className="verse-line">
          <span lang="ar" dir="rtl">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</span>
          <em>“Truly, in the remembrance of Allah do hearts find peace.” (Qur’an 13:28)</em>
        </div>
        <p>Sakīna was made with the intention of comfort. It is a collection of references, not a source of fatwā or medical advice. Please verify any reference on <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> and <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> and ask qualified scholars about religious rulings.</p>
        <p><Link to="/about" state={{ scroll: 'crisis' }}>In crisis? Get help now →</Link> · <Link to="/about">About &amp; sources</Link> · <Link to="/references">All references (for reviewers)</Link></p>
        <p className="small">Status: a personal project, not yet formally reviewed by a qualified scholar. Please verify before relying on anything here.</p>
      </footer>
      <div className={'toast' + (toastMsg ? ' show' : '')} id="toast" role="status" aria-live="polite">{toastMsg}</div>
    </>
  );
}
