import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { createScene, type SceneHandle } from '../lib/scene';
import { pointer, scrollState } from '../lib/input';

export default function Background3D() {
  const ref = useRef<HTMLCanvasElement>(null);
  const h = useRef<SceneHandle | null>(null);
  const { calm, reduce, hue } = useApp();
  const loc = useLocation();
  const hueRef = useRef(hue); hueRef.current = hue;
  useEffect(() => {
    if (calm || !ref.current) return;
    h.current = createScene({ canvas: ref.current, hue: hueRef.current, isHome: loc.pathname === '/', reduce, getMouse: () => pointer, getScroll: () => scrollState.p });
    return () => { h.current?.dispose(); h.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calm, reduce]);
  useEffect(() => { h.current?.setHue(hue); }, [hue]);
  return <canvas id="bg" ref={ref} aria-hidden="true" style={calm ? { display: 'none' } : undefined} />;
}
