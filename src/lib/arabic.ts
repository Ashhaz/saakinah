import { load, save } from './storage';

const CK = 'sakina-ar-v1';
let cache: Record<string, string> | null = null;
const getCache = () => (cache ??= load<Record<string, string>>(CK, {}));

const norm = (s: string) => s.replace(/[ً-ٰٟۖ-ۭـ]/g, '').replace(/ٱ/g, 'ا');
const BASMALA = norm('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ');
function stripBasmala(t: string): string {
  const parts = t.split(/\s+/);
  if (parts.length > 4 && norm(parts.slice(0, 4).join(' ')) === BASMALA) return parts.slice(4).join(' ');
  return t;
}
const inflight: Record<string, Promise<string>> = {};
export function getAyah(key: string): Promise<string> {
  const c = getCache();
  if (c[key]) return Promise.resolve(c[key]);
  return (inflight[key] ??= fetch(`https://api.alquran.cloud/v1/ayah/${key}/quran-uthmani`)
    .then((r) => { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then((j) => {
      const d = j.data; let t: string = d.text;
      if (d.numberInSurah === 1 && d.surah.number !== 1) t = stripBasmala(t);
      c[key] = t; save(CK, c); return t;
    })
    .finally(() => { delete inflight[key]; }));
}
const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export const arNum = (n: string | number) => String(n).split('').map((d) => AR[+d] ?? d).join('');
