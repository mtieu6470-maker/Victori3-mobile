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
  it('every shipped image exists, has an allowed licence, an author or credit field, and a Commons source page', () => {
    for (const a of pack.assets) {
      expect(existsSync('public/' + a.path), a.path).toBe(true);
      expect(ALLOWED.test(a.license), `${a.id} licence ${a.license}`).toBe(true);
      expect(a.source).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(a.statement).toMatch(/^wikidata:Q\d+#P(41|94|18)$/);
      expect(a.bytes).toBeGreaterThan(100);
    }
  });

  it('assets, texts and characters only reference entities that exist in the database', () => {
    for (const a of pack.assets) expect(ids.has(a.entity), a.id).toBe(true);
    for (const k of Object.keys(pack.entities)) expect(ids.has(k), k).toBe(true);
    for (const c of Object.values<any>(pack.characters)) expect(ids.has(c.entity), c.id).toBe(true);
  });

  it('flags and arms are never shown outside 1836–1936 or outside their recorded period', () => {
    for (const a of pack.assets.filter((x: any) => x.type !== 'portrait')) {
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

  it('uses the period-correct Minh Mạng portrait for the Nguyễn ruler in 1838', () => {
    const minhMang = pack.characters['VNM:minh_mang'];
    const portrait = pack.assets.find((a: any) => a.id === 'portrait.VNM:minh_mang');
    expect(minhMang).toBeDefined();
    expect(minhMang.terms.some((t: any) => t.role === 'head_of_state' && t.from <= '1838-11-01' && (!t.to || t.to >= '1838-11-01'))).toBe(true);
    expect(minhMang.portrait).toBe('portrait.VNM:minh_mang');
    expect(portrait).toBeDefined();
    expect(portrait.character).toBe('VNM:minh_mang');
    expect(portrait.period.from).toBeLessThanOrEqual(1838);
    expect(portrait.period.to).toBeGreaterThanOrEqual(1838);
    expect(portrait.license).toBe('CC0 1.0');
    expect(portrait.source).toBe('https://commons.wikimedia.org/wiki/File:Minh_Mang.gif');
    expect(existsSync('public/' + portrait.path)).toBe(true);
    expect(portrait.bytes).toBe(1_198_951);
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
