import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';

/** Reveal-on-scroll + card tilt for everything in the current page. Re-runs on route change and when `dep` changes. */
export function usePageEffects(dep: unknown = null) {
  const { reduce } = useApp();
  const { pathname } = useLocation();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && !reduce) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io?.unobserve(en.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      els.forEach((el) => {
        const sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.setProperty('--d', (sib % 3) * 90 + 'ms'); io!.observe(el);
      });
    } else els.forEach((el) => el.classList.add('in'));

    const cleanups: (() => void)[] = [];
    if (!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll<HTMLElement>('.tilt').forEach((el) => {
        const mv = (e: PointerEvent) => {
          const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
          el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateZ(0)`;
        };
        const lv = () => { el.style.transform = ''; };
        el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv);
        cleanups.push(() => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv); });
      });
    }
    return () => { io?.disconnect(); cleanups.forEach((f) => f()); };
  }, [pathname, reduce, dep]);
}

/** Set the page hue (drives the accent colour + 3D scene). */
export function usePageHue(h: number) {
  const { setHue } = useApp();
  useEffect(() => { setHue(h); }, [h, setHue]);
}

/** After a route change: scroll to the requested section (location.state.scroll) or to the top. */
export function useRouteScroll() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    const id = (state as { scroll?: string } | null)?.scroll;
    if (id) { const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120); return () => window.clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [pathname, state]);
}
