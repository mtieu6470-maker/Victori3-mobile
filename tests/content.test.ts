// Identity content pack: provenance, licences, period validity and references (built by tools/build-content.ts).
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { data } from '../src/engine/data/db';
import { loadNodeData } from '../src/engine/node';

loadNodeData();

if (!existsSync('public/content/registry.json')) execFileSync('npx', ['tsx', 'tools/build-content.ts'], { stdio: 'inherit' });
const pack = JSON.parse(readFileSync('public/content/registry.json', 'utf8'));
const links = JSON.parse(readFileSync('historical_data/identity/wikidata_links.json', 'utf8'));
const db = data().db;
const ids = new Set(db.entities.map((e) => e.id));
const ALLOWED = /^(public domain|pd\b|pd-|cc0|cc[ -]by(-sa)?[ -]\d|cc[ -]by(-sa)?$)/i;

describe('identity content pack', () => {
  const identity = (a: any) => !String(a.type).startsWith('illustration_');
  it('every shipped identity image exists, has an allowed licence, an author or credit field, and a Commons source page', () => {
    for (const a of pack.assets.filter(identity)) {
      expect(existsSync('public/' + a.path), a.path).toBe(true);
      expect(ALLOWED.test(a.license), `${a.id} licence ${a.license}`).toBe(true);
      expect(a.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(a.statement).toMatch(/^wikidata:Q\d+#P(41|94|18)$/);
      expect(a.bytes).toBeGreaterThan(100);
    }
  });

  // MEDIA-ILL-01: illustrations come from reviewed open-access repositories (public domain / CC0) or are
  // project originals with a provenance record. Each names a subject, has a 480 px variant and a credit line.
  it('every illustration has a subject, an open-access source page or project provenance, a credit and a small variant', () => {
    const ill = pack.assets.filter((a: any) => !identity(a));
    expect(ill.length).toBeGreaterThan(0);
    for (const a of ill) {
      expect(existsSync('public/' + a.path), a.path).toBe(true);
      expect(a.subject, a.id).toBeTruthy();
      expect(pack.illustrations[`${a.type}:${a.subject}`], a.id).toContain(a.id);
      if (/^project original$/i.test(a.license)) expect(a.provenance?.method && a.provenance?.creator, a.id).toBeTruthy();
      else {
        expect(ALLOWED.test(a.license), `${a.id} licence ${a.license}`).toBe(true);
        expect(a.source, a.id).toMatch(/^https:\/\/(www\.loc\.gov\/item\/|commons\.wikimedia\.org\/|www\.metmuseum\.org\/|www\.artic\.edu\/artworks\/)/);
        expect(a.credit || a.author, a.id).toBeTruthy();
      }
      expect(a.thumb && existsSync('public/' + a.thumb), `${a.id} thumbnail`).toBe(true);
      expect(a.bytes).toBeGreaterThan(1000);
    }
  });

  it('assets, texts and characters only reference entities that exist in the database', () => {
    for (const a of pack.assets.filter(identity)) expect(ids.has(a.entity), a.id).toBe(true);
    for (const k of Object.keys(pack.entities)) expect(ids.has(k), k).toBe(true);
    for (const c of Object.values<any>(pack.characters)) expect(ids.has(c.entity), c.id).toBe(true);
  });

  it('flags and arms are never shown outside 1836–1936 or outside their recorded period', () => {
    for (const a of pack.assets.filter((x: any) => x.type === 'flag' || x.type === 'coat_of_arms')) {
      const lo = a.period.from ?? -9999, hi = a.period.to ?? 9999;
      expect(hi >= 1836 && lo <= 1936, `${a.id} ${lo}-${hi}`).toBe(true);
    }
  });

  it('unqualified symbols of present-day states, peoples, regions and eras were rejected, not shipped', () => {
    const shipped = new Set(pack.assets.map((a: any) => a.id));
    for (const [eid, l] of Object.entries<any>(links.links)) {
      if (!l.linked || !['people', 'region', 'period'].includes(l.kind)) continue;
      for (const a of pack.assets.filter((x: any) => x.entity === eid && x.type !== 'portrait')) expect(a.quality, `${eid} ${a.file}`).toBe('supported');
    }
    expect(shipped.size).toBe(pack.assets.length);
  });

  it('every text carries article, URL, revision and the CC BY-SA licence', () => {
    const all = [...Object.values<any>(pack.entities).flatMap((e) => e.texts), ...Object.values<any>(pack.characters).flatMap((c) => c.texts)];
    expect(all.length).toBeGreaterThan(0);
    for (const t of all) {
      expect(t.url).toMatch(/^https:\/\/(vi|en)\.wikipedia\.org\//);
      expect(t.revid).toBeGreaterThan(0);
      expect(t.license).toBe('CC BY-SA 4.0');
      expect(t.text.length).toBeGreaterThan(40);
    }
  });

  it('linked polities passed the 1836 lifetime check (no silent mismatches)', () => {
    for (const [eid, l] of Object.entries<any>(links.links)) if (l.linked) expect(['ok', 'not_applicable'], `${eid}: ${l.check}`).toContain(l.check);
  });

  it('characters linked to Wikidata agree with the database on birth and death years (±2)', () => {
    for (const c of Object.values<any>(pack.characters)) {
      if (c.match !== 'strong') continue;
      const y = (s: string | null) => (s ? parseInt(s.slice(0, 4), 10) : null);
      if (y(c.born) && y(c.wd_born)) expect(Math.abs(y(c.born)! - y(c.wd_born)!), c.id).toBeLessThanOrEqual(2);
      if (y(c.died) && y(c.wd_died)) expect(Math.abs(y(c.died)! - y(c.wd_died)!), c.id).toBeLessThanOrEqual(2);
      if (c.portrait) expect(pack.assets.some((a: any) => a.id === c.portrait && a.character === c.id)).toBe(true);
    }
  });
});
