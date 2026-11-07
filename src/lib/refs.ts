import { META } from '../data';
import type { Hadith, Dua, Src } from '../types';

export const quranUrl = (ref: string) => { const [s, a] = ref.split(':'); return `https://quran.com/${s}/${a}`; };
export const quranLabel = (ref: string) => 'Qur’an ' + ref.replace('-', '–');
export const hadithUrl = (coll: string, n: number | string) => `https://sunnah.com/${coll}:${n}`;
export const srcLabel = (s: Src) => (s[0] ? `${META.collections[s[0]] ?? s[0]} ${s[1]}` : String(s[1]));

const SAHIHAYN = new Set(['bukhari', 'muslim']);
export function isSahihayn(srcs: Src[]): boolean {
  const colls = srcs.map((s) => s[0]).filter((c): c is string => !!c && c !== 'quran');
  return colls.length > 0 && colls.every((c) => SAHIHAYN.has(c));
}
export const hadithGrade = (h: Hadith | Dua) => h.grade || (isSahihayn(h.srcs) ? 'Ṣaḥīḥ' : '');
export const SAHIH_TITLE = 'Found in Ṣaḥīḥ al-Bukhārī and/or Ṣaḥīḥ Muslim';
