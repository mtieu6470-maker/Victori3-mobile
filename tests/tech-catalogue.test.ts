// TECH-01: integrity of the technology tree after the CG-28 catalogue extension (1836-2026).
import { describe, expect, it } from 'vitest';
import { loadNodeData } from '../src/engine/node';
import { data } from '../src/engine/data/db';
import { TECH_VI } from '../src/ui/i18n/vi';

loadNodeData();
const techs = data().db.technologies;
const byId = new Map(techs.map((t) => [t.id, t]));

describe('TECH-01 technology tree', () => {
  it('covers the whole campaign (1836-2026) with well over a hundred technologies', () => {
    expect(techs.length).toBeGreaterThanOrEqual(120);
    expect(Math.max(...techs.map((t) => t.historical_year))).toBeGreaterThanOrEqual(2020);
    expect(techs.filter((t) => t.historical_year > 1913).length).toBeGreaterThanOrEqual(50);
  });

  it('has unique ids, known prerequisites, and no prerequisite dated after its dependant', () => {
    expect(byId.size).toBe(techs.length);
    for (const t of techs) for (const p of t.prereqs) {
      expect(byId.has(p), `${t.id} -> ${p}`).toBe(true);
      expect(byId.get(p)!.historical_year, `${t.id} needs later ${p}`).toBeLessThanOrEqual(t.historical_year);
    }
  });

  it('is acyclic', () => {
    const state = new Map<string, 0 | 1 | 2>();
    const visit = (id: string): void => {
      const s = state.get(id); if (s === 2) return; expect(s, `cycle at ${id}`).not.toBe(1);
      state.set(id, 1); for (const p of byId.get(id)!.prereqs) visit(p); state.set(id, 2);
    };
    for (const t of techs) visit(t.id);
  });

  it('catalogue entries cite CG-28, carry finite non-negative tfp weights and have Vietnamese names', () => {
    const catalogue = techs.filter((t) => t.source);
    expect(catalogue.length).toBeGreaterThanOrEqual(80);
    for (const t of catalogue) {
      expect(t.source).toMatch(/^CG-28 catalogue/);
      expect(t.historical_year).toBeGreaterThanOrEqual(1836);
      expect(t.historical_year).toBeLessThanOrEqual(2026);
    }
    for (const t of techs) {
      const v = t.effects.tfp;
      if (v !== undefined) { expect(typeof v).toBe('number'); expect(v as number).toBeGreaterThanOrEqual(0); expect(v as number).toBeLessThan(0.1); }
      expect(TECH_VI[t.id], `missing Vietnamese name for ${t.id}`).toBeTruthy();
    }
  });

  it('later technologies cost more research than earlier ones on average', () => {
    const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
    const early = techs.filter((t) => t.historical_year < 1900).map((t) => t.cost);
    const late = techs.filter((t) => t.historical_year >= 1950).map((t) => t.cost);
    expect(mean(late)).toBeGreaterThan(mean(early) * 1.5);
  });
});
