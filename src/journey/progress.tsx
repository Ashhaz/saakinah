import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { load, save } from '../lib/storage';
import { LESSONS } from './lessons';

const KEY = 'sakina-journey-v1';
interface LessonRec { done: boolean; stars: number; best: number }
interface State { lessons: Record<string, LessonRec>; xp: number; days: string[] }
export interface Result { passed: boolean; stars: number; xp: number; first: boolean; streak: number }

export const LEVELS: [number, string][] = [[0, 'Seeker'], [50, 'Learner'], [150, 'Student'], [300, 'Explorer'], [500, 'Companion'], [700, 'Guide'], [1000, 'Steadfast'], [1500, 'Luminary']];
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const shift = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); };

export function streakOf(days: string[]): number {
  const set = new Set(days);
  let start = set.has(shift(0)) ? 0 : set.has(shift(-1)) ? -1 : null;
  if (start === null) return 0;
  let n = 0;
  while (set.has(shift(start - n))) n++;
  return n;
}
export function levelOf(xp: number) {
  let i = 0; LEVELS.forEach(([min], k) => { if (xp >= min) i = k; });
  const next = LEVELS[i + 1];
  return { name: LEVELS[i][1], index: i, next: next ? next[0] : null, base: LEVELS[i][0] };
}

interface Ctx {
  xp: number; streak: number; completedCount: number; lessons: Record<string, LessonRec>; days: string[];
  isUnlocked: (index: number) => boolean; currentIndex: number;
  record: (id: string, correct: number, total: number) => Result; reset: () => void;
}
const C = createContext<Ctx>(null as unknown as Ctx);
export const useProgress = () => useContext(C);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [st, setSt] = useState<State>(() => load<State>(KEY, { lessons: {}, xp: 0, days: [] }));
  const completedCount = LESSONS.filter((l) => st.lessons[l.id]?.done).length;
  const currentIndex = Math.min(completedCount, LESSONS.length - 1);
  const isUnlocked = useCallback((i: number) => i === 0 || !!st.lessons[LESSONS[i - 1].id]?.done, [st.lessons]);
  const record = useCallback((id: string, correct: number, total: number): Result => {
    const passed = correct >= Math.ceil(total * 0.6);
    const prev = st.lessons[id];
    const first = passed && !prev?.done;
    const stars = !passed ? 0 : correct === total ? 3 : correct >= total * 0.8 ? 2 : 1;
    const gained = !passed ? 0 : first ? 20 + 10 * correct : 5 + 2 * correct;
    const days = passed && !st.days.includes(dayKey()) ? [...st.days, dayKey()].slice(-400) : st.days;
    const next: State = {
      xp: st.xp + gained, days,
      lessons: { ...st.lessons, [id]: { done: !!prev?.done || passed, stars: Math.max(prev?.stars ?? 0, stars), best: Math.max(prev?.best ?? 0, correct) } },
    };
    setSt(next); save(KEY, next);
    return { passed, stars, xp: gained, first, streak: streakOf(next.days) };
  }, [st]);
  const reset = useCallback(() => { const e = { lessons: {}, xp: 0, days: [] }; setSt(e); save(KEY, e); }, []);
  const v = useMemo(() => ({ xp: st.xp, streak: streakOf(st.days), completedCount, lessons: st.lessons, days: st.days, isUnlocked, currentIndex, record, reset }),
    [st, completedCount, isUnlocked, currentIndex, record, reset]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
