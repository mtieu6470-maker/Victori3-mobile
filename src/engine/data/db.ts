// HistoricalDataService: read-only access to the compiled Historical Database and map topology.
// The engine never hard-codes history: everything period-specific is read from here, by date.
import type { HistoricalDB, EntityRecord, RegionRecord, LeaderRecord, TechRecord } from './dbTypes';

export interface MapTopology {
  width: number; height: number; cpd: number; lat0: number; regionIds: string[];
  regions: { id: string; area_km2: number; coastal: boolean; cells: number; label: [number, number] }[];
  adjacency: [string, string, number][]; seaLinks: [string, string, number][];
}

export class HistoricalData {
  readonly db: HistoricalDB;
  readonly map: MapTopology;
  readonly entity = new Map<string, EntityRecord>();
  readonly region = new Map<string, RegionRecord>();
  readonly regionIndex = new Map<string, number>();
  readonly tech = new Map<string, TechRecord>();
  readonly landNeighbors: string[][] = [];
  readonly seaNeighbors: { r: string; km: number }[][] = [];
  readonly cultureNation = new Map<string, string>();
  readonly religionFamily = new Map<string, string>();
  readonly sourceIds: Set<string>;
  private equivalence = new Map<string, Set<string>>();
  private changesSorted: HistoricalDB['historical_changes'];

  constructor(db: HistoricalDB, map: MapTopology) {
    this.db = db; this.map = map;
    for (const e of db.entities) this.entity.set(e.id, e);
    db.regions.forEach((r, i) => { this.region.set(r.id, r); this.regionIndex.set(r.id, i); this.landNeighbors.push([]); this.seaNeighbors.push([]); });
    for (const t of db.technologies) this.tech.set(t.id, t);
    for (const [a, b] of map.adjacency) { this.landNeighbors[this.regionIndex.get(a)!].push(b); this.landNeighbors[this.regionIndex.get(b)!].push(a); }
    for (const [a, b, km] of map.seaLinks) { this.seaNeighbors[this.regionIndex.get(a)!].push({ r: b, km }); this.seaNeighbors[this.regionIndex.get(b)!].push({ r: a, km }); }
    for (const c of db.cultures) this.cultureNation.set(c.id, c.nation);
    for (const r of db.religions) this.religionFamily.set(r.id, r.family);
    for (const cls of db.equivalence) for (const id of cls) { const s = this.equivalence.get(id) ?? new Set<string>(); cls.forEach((x) => s.add(x)); this.equivalence.set(id, s); }
    this.sourceIds = new Set(db.sources.map((s) => s.id));
    this.changesSorted = [...db.historical_changes].sort((a, b) => a.date.localeCompare(b.date));
  }

  equivalent(a: string, b: string): boolean { return a === b || (this.equivalence.get(a)?.has(b) ?? false); }

  /** Historical owner of a region at an ISO date, reconstructed from the 1836 owner and the dated changes. Never used to drive the simulation. */
  historicalOwner(regionId: string, iso: string): string {
    let owner = this.region.get(regionId)!.owner;
    for (const c of this.changesSorted) {
      if (c.date > iso) break;
      for (const r of c.regions) {
        if (r === regionId) owner = c.to;
        else if (r.startsWith('*') && this.equivalent(owner, r.slice(1))) owner = c.to;
      }
    }
    return owner;
  }

  /** Leaders recorded for an entity whose reign intersects the given date window. */
  leadersOf(entity: string): LeaderRecord[] { return this.db.leaders[entity] ?? []; }

  /** Facts are only available for dates up to `iso` (anachronism guard used by tests and the UI). */
  benchmarksUpTo(entity: string, field: string, iso: string) {
    return this.db.benchmarks.filter((b) => b.entity === entity && b.field === field && b.date <= iso.slice(0, 4));
  }
}

let cached: HistoricalData | null = null;
export function setData(d: HistoricalData) { cached = d; }
export function data(): HistoricalData { if (!cached) throw new Error('Historical data not loaded'); return cached; }
