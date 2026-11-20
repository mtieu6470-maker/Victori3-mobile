// Identity content pack (flags, coats of arms, portraits, descriptive texts, character records) built by
// tools/build-content.ts into public/content/registry.json. Loaded lazily after the game starts: the simulation
// never depends on it, and every view falls back to the generated emblem / monogram when an item is missing.
import { useEffect, useState } from 'preact/hooks';

export interface ContentAsset {
  id: string; type: 'flag' | 'coat_of_arms' | 'portrait'; entity: string; character?: string; name: string;
  period: { from: number | null; to: number | null }; quality: string; path: string; w: number; h: number; bytes: number;
  license: string; license_url: string | null; author: string | null; credit: string | null; source: string; file: string; statement: string;
  date: string | null; description: string;
}
export interface ContentText { lang: 'vi' | 'en'; text: string; truncated: boolean; article: string; url: string; revid: number; retrieved: string; license: string; license_url: string; author: string }
export interface ContentName { text: string; lang: string; from: number | null; to: number | null }
export interface ContentEntity {
  qid: string | null; article?: string; kind?: string; label_vi?: string | null; description_en?: string | null; reason?: string;
  names?: ContentName[]; flags: string[]; arms: string[]; texts: ContentText[]; desc_override?: boolean;
}
export interface ContentCharacter {
  id: string; entity: string; name: string; title: string | null; roles: string[]; born: string | null; died: string | null;
  terms: { role: string; from: string; to: string | null; source: string }[]; match: 'strong' | 'weak' | 'none'; qid: string | null;
  label_vi: string | null; description_vi: string | null; description_en: string | null; wd_born: string | null; wd_died: string | null;
  portrait: string | null; texts: ContentText[];
}
export interface ContentPack {
  version: number; generated: string; licence_note: string; counts: Record<string, number>;
  assets: ContentAsset[]; entities: Record<string, ContentEntity>; characters: Record<string, ContentCharacter>;
}

let pack: ContentPack | null = null;
let byId = new Map<string, ContentAsset>();
let byEntityChars = new Map<string, ContentCharacter[]>();
let loading: Promise<void> | null = null;
let failed = false;
const listeners = new Set<() => void>();

export function loadContent(base = ''): Promise<void> {
  if (loading) return loading;
  loading = fetch(`${base}content/registry.json`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then((p: ContentPack) => {
    pack = p; byId = new Map(p.assets.map((a) => [a.id, a]));
    byEntityChars = new Map();
    for (const c of Object.values(p.characters)) { const l = byEntityChars.get(c.entity) ?? []; l.push(c); byEntityChars.set(c.entity, l); }
    for (const fn of listeners) fn();
  }).catch(() => { failed = true; for (const fn of listeners) fn(); });
  return loading;
}
/** Re-renders when the content pack finishes loading. */
export function useContent(): ContentPack | null {
  const [, force] = useState(0);
  useEffect(() => { listeners.add(f); function f() { force((x) => x + 1); } loadContent(); return () => { listeners.delete(f); }; }, []);
  return pack;
}
export const contentReady = () => pack !== null;
export const contentFailed = () => failed;
export const asset = (id: string | null | undefined) => (id ? byId.get(id) : undefined);
export const entityContent = (eid: string) => pack?.entities[eid];

const inPeriod = (a: ContentAsset, year: number) => (a.period.from == null || a.period.from <= year) && (a.period.to == null || a.period.to >= year);
/** The flag (or arms) of an entity valid in the given year: qualified periods first, then the narrowest period. */
export function symbolFor(eid: string, kind: 'flag' | 'coat_of_arms', year: number): ContentAsset | undefined {
  const e = pack?.entities[eid]; if (!e) return undefined;
  const ids = kind === 'flag' ? e.flags : e.arms;
  const ok = ids.map((i) => byId.get(i)!).filter((a) => a && inPeriod(a, year));
  const span = (a: ContentAsset) => (a.period.to ?? 2100) - (a.period.from ?? 1500);
  return ok.sort((a, b) => (a.quality === 'supported' ? 0 : 1) - (b.quality === 'supported' ? 0 : 1) || span(a) - span(b))[0];
}
export function charactersOf(eid: string): ContentCharacter[] {
  const l = byEntityChars.get(eid) ?? [];
  const start = (c: ContentCharacter) => c.terms.map((t) => t.from).filter(Boolean).sort()[0] ?? c.born ?? '9999';
  return [...l].sort((a, b) => start(a).localeCompare(start(b)));
}

/**
 * Convert source dates into inclusive boundaries without inventing precision.
 * YYYY spans a whole year; YYYY-MM spans a whole month; YYYY-MM-DD is exact.
 * Invalid dates never match an office term.
 */
export function historicalDateBoundary(value: string | null | undefined, edge: 'start' | 'end'): string | null {
  if (!value) return null;
  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : edge === 'start' ? 1 : 12;
  if (year < 1 || year > 9999 || month < 1 || month > 12) return null;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = match[3] ? Number(match[3]) : edge === 'start' ? 1 : monthDays[month - 1];
  if (day < 1 || day > monthDays[month - 1]) return null;
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** True while a sourced office term covers this Gregorian date, with inclusive endpoints. */
export function characterHoldsRoleOnDate(
  character: Pick<ContentCharacter, 'terms'>,
  date: string,
  role = 'head_of_state',
): boolean {
  const day = historicalDateBoundary(date, 'start');
  if (!day || day !== date) return false;
  return character.terms.some((term) => {
    if (term.role !== role) return false;
    const from = historicalDateBoundary(term.from, 'start');
    const to = term.to == null ? null : historicalDateBoundary(term.to, 'end');
    return !!from && from <= day && (term.to == null || (!!to && day <= to));
  });
}

/** Resolve a person only if their name matches and their sourced office term covers the game date. */
export function characterByNameOnDate(
  eid: string,
  name: string,
  date: string,
  role = 'head_of_state',
): ContentCharacter | undefined {
  const base = name.split(' (')[0];
  return (byEntityChars.get(eid) ?? []).find((c) =>
    (c.name === name || c.name.split(' (')[0] === base) && characterHoldsRoleOnDate(c, date, role),
  );
}

/** Legacy name-only lookup for non-current references. Prefer characterByNameOnDate for rulers. */
export function characterByName(eid: string, name: string): ContentCharacter | undefined {
  const base = name.split(' (')[0];
  return (byEntityChars.get(eid) ?? []).find((c) => c.name === name || c.name.split(' (')[0] === base);
}
/** Vietnamese text when available, English otherwise. */
export const bestText = (t: ContentText[] | undefined) => t?.find((x) => x.lang === 'vi') ?? t?.[0];
export const assetUrl = (a: ContentAsset) => a.path;
