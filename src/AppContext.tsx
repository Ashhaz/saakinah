import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadRaw, saveRaw } from './lib/storage';

interface Ctx {
  calm: boolean; reduce: boolean; toggleCalm: () => void;
  toast: (msg: string) => void; toastMsg: string;
  hue: number; setHue: (h: number) => void;
}
const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: ReactNode }) {
  const [calm, setCalm] = useState(() => loadRaw('sakina-calm') === '1');
  const sysReduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const reduce = calm || sysReduce;
  const [toastMsg, setToastMsg] = useState('');
  const [hue, setHueState] = useState(45);
  const t = useRef<number>();
  const toast = useCallback((m: string) => {
    setToastMsg(m); window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setToastMsg(''), 4200);
  }, []);
  const toggleCalm = useCallback(() => setCalm((c) => { saveRaw('sakina-calm', c ? '0' : '1'); return !c; }), []);
  const setHue = useCallback((h: number) => setHueState(h), []);
  useEffect(() => { document.body.classList.toggle('calm', calm); }, [calm]);
  useEffect(() => { document.body.style.setProperty('--h', String(hue)); }, [hue]);
  useEffect(() => { const r = requestAnimationFrame(() => document.body.classList.add('ready')); return () => cancelAnimationFrame(r); }, []);
  const v = useMemo(() => ({ calm, reduce, toggleCalm, toast, toastMsg, hue, setHue }), [calm, reduce, toggleCalm, toast, toastMsg, hue, setHue]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
