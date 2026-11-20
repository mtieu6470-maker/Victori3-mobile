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
import { DEFAULT_PREFERENCES, parsePreferences } from '../src/ui/game/preferences';
import { isLongPress, LONG_PRESS_MS, LONG_PRESS_SLOP_PX } from '../src/ui/map/gestures';
import { SIX_HOUR_INTERVAL_MS } from '../src/ui/game/controller';
import { fullName, shortName } from '../src/ui/game/names';

const bin = fs.readFileSync(path.resolve('public/generated/map.bin'));
const grid = decodeGrid(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength));
const measure = (t: string, size: number) => t.length * size * 0.56; // conservative width estimate

describe('date-effective Nguyễn country naming', () => {
  it('uses Việt Nam before 1838 and Đại Nam from the year of the imperial decree', () => {
    const st = fresh('historical', 301, 'VNM');
    st.date = { y: 1837, m: 12 };
    expect(shortName(st, 'VNM')).toBe('Việt Nam');
    expect(fullName(st, 'VNM')).toBe('Việt Nam (nhà Nguyễn)');
    st.date = { y: 1838, m: 11 };
    expect(shortName(st, 'VNM')).toBe('Đại Nam');
    expect(fullName(st, 'VNM')).toBe('Đại Nam (nhà Nguyễn)');
  });
});

describe('simulation speed contract', () => {
  it('caps speed 5 at no more than half a Gregorian game-day per real second', () => {
    const daysPerSecondAtSpeed5 = (1000 / SIX_HOUR_INTERVAL_MS[5]) / 4;
    expect(daysPerSecondAtSpeed5).toBeLessThanOrEqual(0.5);
    expect(SIX_HOUR_INTERVAL_MS[1]).toBeGreaterThan(SIX_HOUR_INTERVAL_MS[2]);
    expect(SIX_HOUR_INTERVAL_MS[2]).toBeGreaterThan(SIX_HOUR_INTERVAL_MS[3]);
    expect(SIX_HOUR_INTERVAL_MS[3]).toBeGreaterThan(SIX_HOUR_INTERVAL_MS[4]);
    expect(SIX_HOUR_INTERVAL_MS[4]).toBeGreaterThan(SIX_HOUR_INTERVAL_MS[5]);
  });
});

describe('map labels (Europe 1836 — many small German and Italian states)', () => {
  const st = fresh('historical', 1, 'GBR');
  setOwnerLookup(grid, st);
  const cands = buildCandidates(st, ['GBR', 'FRA', 'RUS', 'AUS', 'PRU'], 'GBR');
  // cameras defined geographically (centre lon/lat, degrees per CSS px) and converted to grid cells
  const cam0 = (w: number, h: number, lon: number, lat: number, degPerPx: number) => ({ w, h, cx: (lon + 180) * grid.cpd, cy: (grid.lat0 - lat) * grid.cpd, scale: degPerPx * grid.cpd });
  const views = { portrait: cam0(412, 653, 2.5, 47.5, 0.0475), landscape: cam0(855, 366, -2, 50, 0.0585), zoomedOut: cam0(855, 366, 0, 10, 0.3) };
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

describe('budget lines shown by the Budget tab', () => {
  it('monthly finance lines add up to the income and expense the engine applied', () => {
    const st = fresh('historical', 3, 'FRA'); stepMonth(st); stepMonth(st);
    const withLines = Object.values(st.countries).filter((x) => x.alive && x.finance);
    expect(withLines.length).toBeGreaterThan(50);
    for (const c of withLines) {
      const f = c.finance!;
      expect(f.tax + f.tariff).toBeCloseTo(c.income, 3);
      expect(f.army + f.navy + f.admin + f.education + f.health + f.construction + f.interest).toBeCloseTo(c.expense, 3);
    }
  });
});


describe('offline gameplay preferences', () => {
  it('uses safe defaults when there is no stored settings object', () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
  });
  it('preserves explicit booleans and fills missing fields from defaults', () => {
    expect(parsePreferences(JSON.stringify({ autoPause: { wars: false, disasters: true } }))).toEqual({
      autoPause: { decisions: true, wars: false, revolutions: true, disasters: true },
    });
  });
  it('recovers from malformed or wrong-shaped local data without throwing', () => {
    expect(parsePreferences('{not-json')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences(JSON.stringify({ autoPause: 'yes' }))).toEqual(DEFAULT_PREFERENCES);
  });
});


describe('map touch gestures', () => {
  const press = { downAt: 1000, sx: 40, sy: 60, pointerType: 'touch' };

  it('recognizes a stationary touch hold and rejects a short tap', () => {
    expect(isLongPress(press, 1000 + LONG_PRESS_MS, 40, 60)).toBe(true);
    expect(isLongPress(press, 1000 + LONG_PRESS_MS - 1, 40, 60)).toBe(false);
  });

  it('rejects holds that move beyond the touch slop or originate from a mouse', () => {
    expect(isLongPress(press, 1000 + LONG_PRESS_MS, 40 + LONG_PRESS_SLOP_PX + 1, 60)).toBe(false);
    expect(isLongPress({ ...press, pointerType: 'mouse' }, 1000 + LONG_PRESS_MS, 40, 60)).toBe(false);
  });
});
