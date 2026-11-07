import topicsJson from './topics.json';
import duasJson from './duas.json';
import remediesJson from './remedies.json';
import feelJson from './feel.json';
import metaJson from './meta.json';
import type { Topic, Dua, Remedy, Meta } from '../types';

export const TOPICS = topicsJson as unknown as Topic[];
export const DUAS = duasJson as unknown as Record<string, Dua>;
export const REMEDIES = remediesJson as unknown as Record<string, Remedy>;
export const FEEL = feelJson as unknown as Record<string, string[]>;
export const META = metaJson as unknown as Meta;
export const BY_SLUG: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.slug, t]));
export const GROUP_NAME: Record<string, string> = Object.fromEntries(META.groups);
