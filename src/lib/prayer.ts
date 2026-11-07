import { load, save } from './storage';

export const PT_KEY = 'sakina-pt';
export interface PtSettings {
  country?: string; city?: string; lat?: string; lon?: string; method?: string; school?: string; h12?: boolean;
}
export interface PtData {
  timings: Record<string, string>; tz?: string;
  hijri?: { day: string; month: { en: string }; year: string };
  method?: string; day: string; cached?: boolean;
}
export const PRAYERS: [string, string, string][] = [
  ['Fajr', 'Fajr', 'الفجر'], ['Sunrise', 'Sunrise', 'الشروق'], ['Dhuhr', 'Dhuhr', 'الظهر'],
  ['Asr', 'Asr', 'العصر'], ['Maghrib', 'Maghrib', 'المغرب'], ['Isha', 'Isha', 'العشاء'],
];
export const hasLocation = (s: PtSettings | null | undefined) => !!s && (!!s.city || s.lat != null);

export function ptUrl(st: PtSettings): string {
  const q: string[] = [];
  if (st.method && st.method !== 'auto') q.push('method=' + encodeURIComponent(st.method));
  if (st.school) q.push('school=' + encodeURIComponent(st.school));
  const extra = q.length ? '&' + q.join('&') : '';
  if (st.lat != null) return `https://api.aladhan.com/v1/timings?latitude=${st.lat}&longitude=${st.lon}${extra}`;
  return `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(st.city ?? '')}&country=${encodeURIComponent(st.country ?? '')}${extra}`;
}
const hm = (t?: string): [number, number] | null => { const m = /(\d{1,2}):(\d{2})/.exec(t || ''); return m ? [+m[1], +m[2]] : null; };
const p2 = (n: number) => (n < 10 ? '0' : '') + n;
export function showTime(t: string | undefined, h12: boolean): string {
  const x = hm(t); if (!x) return '–';
  if (!h12) return p2(x[0]) + ':' + p2(x[1]);
  return `${x[0] % 12 || 12}:${p2(x[1])} ${x[0] >= 12 ? 'PM' : 'AM'}`;
}
function nowSecs(tz?: string): number {
  try {
    const o: Record<string, string> = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      .formatToParts(new Date()).forEach((p) => { o[p.type] = p.value; });
    return (+o.hour % 24) * 3600 + +o.minute * 60 + +o.second;
  } catch { const d = new Date(); return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds(); }
}
export function nextPrayer(timings: Record<string, string>, tz?: string): { name: string; in: number; tomorrow?: boolean } {
  const now = nowSecs(tz);
  for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const x = hm(timings[name]); if (!x) continue;
    const t = x[0] * 3600 + x[1] * 60;
    if (t > now) return { name, in: t - now };
  }
  const f = hm(timings.Fajr) ?? [0, 0];
  return { name: 'Fajr', in: 24 * 3600 - now + f[0] * 3600 + f[1] * 60, tomorrow: true };
}
export function dur(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? h + 'h ' : '') + m + 'm' + (h ? '' : ' ' + p2(s) + 's');
}
export async function fetchTimes(st: PtSettings): Promise<PtData> {
  const url = ptUrl(st);
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('http ' + r.status);
    const j = await r.json();
    if (!j?.data?.timings) throw new Error('bad');
    const d = j.data;
    const out: PtData = { timings: d.timings, tz: d.meta?.timezone, hijri: d.date?.hijri, method: d.meta?.method?.name, day: new Date().toDateString() };
    save(PT_KEY + '-cache', { key: url, out });
    return out;
  } catch (err) {
    const c = load<{ key: string; out: PtData } | null>(PT_KEY + '-cache', null);
    if (c && c.key === url && c.out.day === new Date().toDateString()) return { ...c.out, cached: true };
    throw err;
  }
}
