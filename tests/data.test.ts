// Historical Research Database: integrity, provenance, quality labels, temporal integrity and starting data.
import { describe, it, expect } from 'vitest';
import { data } from '../src/engine/data/db';
import { QUALITY_ORDER } from '../src/engine/data/dbTypes';
import { fresh } from './helpers';

const d = data();
const db = d.db;

describe('database integrity and provenance', () => {
  it('every source id cited by entities, groups and events exists', () => {
    const ids = new Set(db.sources.map((s) => s.id));
    const walk = (o: unknown): void => {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      const rec = o as Record<string, unknown>;
      if (Array.isArray(rec.sources)) for (const s of rec.sources) { const id = typeof s === 'string' ? s : (s as { id: string }).id; expect(ids.has(id), `unknown source ${id}`).toBe(true); }
      for (const [k, v] of Object.entries(rec)) if (k !== 'sources') walk(v);
    };
    walk(db.entities); walk(db.wars); walk(db.decision_windows);
  });

  it('uses only the five quality labels', () => {
    for (const r of db.regions) expect(QUALITY_ORDER).toContain(r.pop_quality);
    for (const e of db.entities) { expect(QUALITY_ORDER).toContain(e.population.quality); if (e.laws) expect(QUALITY_ORDER).toContain(e.laws.quality); }
  });

  it('a "verified" population total always carries a source; missing data is flagged as a fallback, never verified', () => {
    for (const e of db.entities) {
      if (e.population.quality === 'verified') expect(e.population.sources.length).toBeGreaterThan(0);
      if (e.population.quality === 'missing') expect(e.population.method).toMatch(/fallback|Provisional|no benchmark/i);
    }
    const missingGdp = Object.entries(db.gdp_pc_1836).filter(([, f]) => f.quality === 'missing');
    for (const [, f] of missingGdp) expect(f.fallback).toBe(true);
  });

  it('covers small states, not only great powers', () => {
    const playable = db.entities.filter((e) => e.model === 'playable');
    expect(playable.length).toBeGreaterThanOrEqual(145); // 147 researched polities are playable at 1836 (see registry)
    for (const id of ['LIE', 'SMR', 'RGR', 'MCO', 'HHO', 'KRA', 'SKM', 'TAH', 'LUA']) expect(d.entity.get(id), id).toBeDefined();
    expect(db.entities.filter((e) => e.kind === 'decentralized').length).toBeGreaterThan(90);
  });

  it('every map region belongs to exactly one valid owner and is drawn on the map', () => {
    expect(db.regions.length).toBe(d.map.regionIds.length);
    for (const r of db.regions) { expect(d.entity.has(r.owner), r.id).toBe(true); expect(d.map.regions[d.regionIndex.get(r.id)!].cells).toBeGreaterThan(0); }
  });

  it('world population at start is consistent with Maddison (~1.04 bn in 1820, ~1.26 bn in 1850)', () => {
    const tot = db.regions.reduce((s, r) => s + r.pop, 0);
    expect(tot).toBeGreaterThan(1.04e9); expect(tot).toBeLessThan(1.26e9);
  });

  it('records disagreement between sources instead of choosing silently (e.g. Mexico, Portugal, India)', () => {
    const groups = ['MEX', 'POR_home', 'SOUTH_ASIA'];
    for (const g of groups) {
      const e = db.entities.find((x) => x.population.method?.includes(g));
      expect(e, g).toBeDefined();
    }
    const mex = db.entities.find((x) => x.id === 'MEX')!;
    expect(mex.population.quality).toBe('uncertain');
  });
});

describe('temporal integrity (no later-period information at start)', () => {
  const st = fresh('historical');
  it('starting heads of state are those in office on 1 Jan 1836', () => {
    const expected: Record<string, string> = { GBR: 'William IV', FRA: 'Louis-Philippe I', RUS: 'Nicholas I', PRU: 'Frederick William III', AUS: 'Ferdinand I', TUR: 'Mahmud II', QNG: 'Daoguang', USA: 'Andrew Jackson', VNM: 'Minh Mạng', JAP: 'Tokugawa Ienari', SIA: 'Rama III', BRA: 'Pedro II', SIK: 'Ranjit Singh' };
    for (const [id, name] of Object.entries(expected)) expect(st.countries[id].leader.name, id).toContain(name.split(' (')[0]);
  });
  it('no leader or heir in the starting state took office or was born after the start date', () => {
    for (const c of Object.values(st.countries)) {
      expect(c.leader.since).toBeLessThanOrEqual(1836);
      if (c.heir?.born) expect(c.heir.born).toBeLessThanOrEqual(1836);
    }
    // Francis II of the Two Sicilies (born 16 Jan 1836) must not appear at start
    expect(JSON.stringify(st.countries.SIC.heir ?? '')).not.toContain('Francis II');
  });
  it('the historical ownership timeline is never applied to the simulation state', () => {
    expect(st.regions.find((r) => r.id === 'TEX_TEX')!.owner).toBe('MEX');
    expect(st.regions.find((r) => r.id === 'TEX_TEX')!.controller).toBe('TEX');
    expect(d.historicalOwner('TEX_TEX', '1846-01-01')).toBe('USA');
  });
  it('initial alliances and wars come from CoW records active on the start date', () => {
    const ally = (a: string, b: string) => st.treaties.some((t) => t.type === 'alliance' && t.members.includes(a) && t.members.includes(b));
    expect(ally('GBR', 'POR')).toBe(true); // Anglo-Portuguese
    expect(ally('RUS', 'AUS')).toBe(true); // Münchengrätz
    expect(ally('GBR', 'FRA')).toBe(true); // Quadruple Alliance 1834
    expect(st.wars.map((w) => w.id)).toEqual(expect.arrayContaining(['war_carlist_1', 'war_texas', 'war_farroupilha']));
  });
  it('populations of benchmark groups match their sources', () => {
    const fra = st.regions.filter((r) => r.owner === 'FRA' && !['FRA_ALG', 'FRA_ORA', 'FRA_SEN', 'FRA_ANT', 'FRA_GUY', 'FRA_REU'].includes(r.id)).reduce((s, r) => s + r.pop, 0);
    expect(Math.abs(fra - 33_540_000)).toBeLessThan(50); // 1836 census
    const usa = st.regions.filter((r) => r.owner === 'USA').reduce((s, r) => s + r.pop, 0);
    expect(Math.abs(usa - 15_423_000)).toBeLessThan(50); // CoW
  });
});
