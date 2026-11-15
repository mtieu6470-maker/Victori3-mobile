// UI-layer tests that run headless: map-label placement rules and the market statistics the Market screen binds to.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fresh, run } from './helpers';
import { decodeGrid } from '../src/ui/map/mapData';
import { buildCandidates, layoutLabels, setOwnerLookup, ownerAtCell } from '../src/ui/map/labels';
import { serialize, deserialize } from '../src/engine/save';
import { GOODS } from '../src/engine/types';
import { stepMonth } from '../src/engine/simulation';

const bin = fs.readFileSync(path.resolve('public/generated/map.bin'));
const grid = decodeGrid(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
const measure = (t: string, size: number) => t.length * size * 0.56; // conservative width estimate

describe('map labels (Europe 1836 — many small German and Italian states)', () => {
  const st = fresh('historical', 1, 'GBR');
  setOwnerLookup(grid, st);
  const cands = buildCandidates(st, ['GBR', 'FRA', 'RUS', 'AUS', 'PRU'], 'GBR');
  const views = { portrait: { w: 412, h: 653, cx: 730, cy: 150, scale: 0.19 }, landscape: { w: 855, h: 366, cx: 712, cy: 140, scale: 0.234 }, zoomedOut: { w: 855, h: 366, cx: 720, cy: 300, scale: 1.2 } };
  for (const [name, v] of Object.entries(views)) {
    const cam = { x0: v.cx - (v.w * v.scale) / 2, y0: v.cy - (v.h * v.scale) / 2, scale: v.scale };
    const placed = layoutLabels(cands, cam, v.w, v.h, grid, measure, st);
    it(`${name}: no two labels overlap and all stay on screen`, () => {
      expect(placed.length).toBeGreaterThan(2);
      for (const [i, a] of placed.entries()) {
        expect(a.box.x).toBeGreaterThanOrEqual(0); expect(a.box.y).toBeGreaterThanOrEqual(0);
        expect(a.box.x + a.box.w).toBeLessThanOrEqual(v.w); expect(a.box.y + a.box.h).toBeLessThanOrEqual(v.h);
        for (const b of placed.slice(i + 1)) {
          const overlap = a.box.x < b.box.x + b.box.w && b.box.x < a.box.x + a.box.w && a.box.y < b.box.y + b.box.h && b.box.y < a.box.y + a.box.h;
          expect(overlap, `${a.text} / ${b.text}`).toBe(false);
        }
      }
    });
    it(`${name}: every country name is anchored inside its own country`, () => {
      for (const l of placed.filter((p) => p.kind === 'country')) expect(ownerAtCell(st, cam.x0 + l.x * cam.scale, cam.y0 + l.y * cam.scale), l.text).toBe(l.owner);
    });
  }
  it('the player country is labelled at the Europe zoom', () => {
    const v = views.landscape; const cam = { x0: v.cx - (v.w * v.scale) / 2, y0: v.cy - (v.h * v.scale) / 2, scale: v.scale };
    expect(layoutLabels(cands, cam, v.w, v.h, grid, measure, st).some((l) => l.owner === 'GBR')).toBe(true);
  });
});

describe('market statistics persisted for the Market screen', () => {
  it('every market with prices has per-good supply, demand, imports and shortage after a month', () => {
    const st = fresh('historical', 1, 'GBR'); stepMonth(st);
    for (const mk of Object.keys(st.marketPrices)) {
      const ms = st.marketStats[mk]; expect(ms, mk).toBeDefined();
      for (const g of GOODS) {
        const s = ms[g]; expect(Number.isFinite(s.supply) && s.supply >= 0).toBe(true); expect(Number.isFinite(s.demand) && s.demand >= 0).toBe(true);
        expect(s.imports).toBeGreaterThanOrEqual(0); expect(s.short).toBeGreaterThanOrEqual(0); expect(s.short).toBeLessThanOrEqual(1);
        if (s.demand > 0) expect(s.imports).toBeLessThanOrEqual(Math.max(0, s.demand - s.supply) + 1e-6);
      }
    }
  });
  it('survives save/load, and saves written before the field existed still load', () => {
    const st = run('historical', 1, 2, 'GBR');
    const back = deserialize(serialize(st)); expect(back.marketStats.GBR.grain.demand).toBeCloseTo(st.marketStats.GBR.grain.demand);
    const old = JSON.parse(serialize(st)); delete old.state.marketStats;
    const loaded = deserialize(JSON.stringify(old)); expect(loaded.marketStats).toEqual({}); stepMonth(loaded); expect(Object.keys(loaded.marketStats).length).toBeGreaterThan(50);
  });
});
