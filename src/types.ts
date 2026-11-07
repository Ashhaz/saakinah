export type Src = [string | null, number | string];
export interface Verse { ref: string; ayahs: string[]; en: string; why: string; arabic: boolean; note?: string }
export interface Hadith { en: string; by: string; srcs: Src[]; why: string; grade: string | null }
export interface Dua { title: string; ar?: string; tr?: string; en: string; ayahs?: string[]; srcs: Src[]; note?: string; grade?: string }
export interface Counter { label: string; target: number | null }
export interface Remedy {
  title: string; do: string; ar?: string; tr?: string; en?: string; ayahs?: string[];
  quote?: string; quote_by?: string; extra?: string; counters?: Counter[]; srcs: Src[]; grade?: string;
}
export interface Story { title: string; body: string[]; src: Src[] }
export interface Start { v: number; h: number; d: string | null; plain: string }
export interface Topic {
  slug: string; group: string; hue: number; glyph: string; title: string; tagline: string; intro: string;
  callout?: { title: string; body: string };
  verses: Verse[]; hadith: Hadith[]; story?: Story; duas: string[]; steps: string[];
  crisis?: boolean; related: string[]; start?: Start | null; widget?: string; note_medical?: boolean;
}
export interface HeroVerse { ref: string; ayahs: string[]; en: string; arabic?: boolean }
export interface Meta {
  surahs: Record<string, string>; collections: Record<string, string>;
  moods: [string, string][]; heroVerses: HeroVerse[]; countries: string[]; groups: [string, string][];
}
