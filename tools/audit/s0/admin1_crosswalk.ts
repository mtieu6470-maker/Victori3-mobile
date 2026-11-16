// S0-B3 audit tool (not product code; read-only). Raster crosswalk between modern admin-1 units (Natural Earth,
// assets/map/admin1_grid.bin.gz) and the 662 strategic regions of the audited build (public/generated/map.bin).
// Both rasters are 8192×3868, equirectangular, same cell grid. For every (region, admin-1) pair the tool counts shared
// cells and an approximate area (cells weighted by cos(latitude)); it does not force a parent-child relation.
// Usage: npx tsx tools/audit/s0/admin1_crosswalk.ts <checkout> <out.csv> <out-summary.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

const [base, outCsv, outJson] = process.argv.slice(2);
if (!base || !outCsv || !outJson) throw new Error('usage: admin1_crosswalk.ts <checkout> <out.csv> <out-summary.json>');
const meta = JSON.parse(readFileSync(join(base, 'assets/map/admin1_meta.json'), 'utf8'));
const topo = JSON.parse(readFileSync(join(base, 'src/generated/map.json'), 'utf8'));
const W: number = topo.width, H: number = topo.height, CPD: number = topo.cpd, LAT0: number = topo.lat0;
if (meta.width !== W || meta.height !== H) throw new Error('grid size mismatch between admin-1 raster and region raster');

function decodeRuns(buf: Buffer): Uint16Array {
  const runs = new Uint16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const out = new Uint16Array(W * H); let k = 0;
  for (let i = 0; i < runs.length; i += 2) { out.fill(runs[i], k, k + runs[i + 1]); k += runs[i + 1]; }
  if (k !== W * H) throw new Error(`expected ${W * H} cells, got ${k}`);
  return out;
}
const admin = decodeRuns(gunzipSync(readFileSync(join(base, 'assets/map/admin1_grid.bin.gz'))));
const region = decodeRuns(readFileSync(join(base, 'public/generated/map.bin')));
const LAKE = meta.lake as number, UNASSIGNED = 0xffff;

const features = new Map<number, any>(meta.features.map((f: any) => [f.id, f]));
const pairCells = new Map<number, number>(), pairArea = new Map<number, number>();
const regCells = new Float64Array(topo.regionIds.length + 1), regArea = new Float64Array(topo.regionIds.length + 1);
const admCells = new Map<number, number>(), admArea = new Map<number, number>();
let regionCellsWithoutAdmin = 0, adminCellsWithoutRegion = 0, landWithoutRegion = 0;
const unassignedByAdm0 = new Map<string, { cells: number; area: number }>();
for (let y = 0; y < H; y++) {
  const w = Math.cos(((LAT0 - (y + 0.5) / CPD) * Math.PI) / 180);
  for (let x = 0; x < W; x++) {
    const k = y * W + x; const r = region[k]; const a = admin[k];
    const hasRegion = r !== 0 && r !== UNASSIGNED; const hasAdmin = a !== 0 && a !== LAKE;
    if (r === UNASSIGNED) landWithoutRegion++;
    if (hasAdmin) { admCells.set(a, (admCells.get(a) ?? 0) + 1); admArea.set(a, (admArea.get(a) ?? 0) + w); }
    if (hasRegion) { regCells[r] += 1; regArea[r] += w; }
    if (hasRegion && !hasAdmin) regionCellsWithoutAdmin++;
    if (hasAdmin && !hasRegion) {
      adminCellsWithoutRegion++;
      const adm0 = String(features.get(a)?.adm0 ?? '?'); const u = unassignedByAdm0.get(adm0) ?? { cells: 0, area: 0 };
      u.cells++; u.area += w; unassignedByAdm0.set(adm0, u);
    }
    if (hasRegion && hasAdmin) { const key = r * 65536 + a; pairCells.set(key, (pairCells.get(key) ?? 0) + 1); pairArea.set(key, (pairArea.get(key) ?? 0) + w); }
  }
}

const rows: string[] = ['region_id,region_index,admin1_id,admin1_name,admin1_adm0,admin1_type,shared_cells,shared_area_cos_lat,share_of_region_area,share_of_admin1_area'];
const q = (s: unknown) => { const t = s == null ? '' : String(s); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
const regionsPerAdmin = new Map<number, number>(), adminsPerRegion = new Map<number, number>();
const keys = [...pairCells.keys()].sort((p, s) => p - s);
for (const key of keys) {
  const r = Math.floor(key / 65536), a = key % 65536; const f = features.get(a) ?? {};
  regionsPerAdmin.set(a, (regionsPerAdmin.get(a) ?? 0) + 1); adminsPerRegion.set(r, (adminsPerRegion.get(r) ?? 0) + 1);
  const area = pairArea.get(key)!;
  rows.push([topo.regionIds[r - 1], r - 1, a, q(f.name), q(f.adm0), q(f.type), pairCells.get(key), area.toFixed(3), (area / regArea[r]).toFixed(6), (area / admArea.get(a)!).toFixed(6)].join(','));
}
writeFileSync(outCsv, rows.join('\n') + '\n');

const hist = (m: Map<number, number>) => { const h: Record<string, number> = {}; for (const v of m.values()) { const b = v >= 5 ? '5+' : String(v); h[b] = (h[b] ?? 0) + 1; } return h; };
const regionsWithoutAdmin = topo.regionIds.filter((_: string, i: number) => !adminsPerRegion.has(i + 1) && regCells[i + 1] > 0);
const emptyRegions = topo.regionIds.filter((_: string, i: number) => regCells[i + 1] === 0);
const summary = {
  schema: 's0-admin1-crosswalk-v1',
  grid: { width: W, height: H, cells_per_degree: CPD, lat0: LAT0, area_weight: 'cos(latitude of cell centre), relative units' },
  admin1_features_in_meta: meta.features.length,
  admin1_features_with_land_cells: admCells.size,
  regions_in_topology: topo.regionIds.length,
  regions_with_cells: topo.regionIds.length - emptyRegions.length,
  pairs: pairCells.size,
  regions_per_admin1_histogram: hist(regionsPerAdmin),
  admin1_per_region_histogram: hist(adminsPerRegion),
  admin1_split_across_regions: [...regionsPerAdmin.values()].filter((v) => v > 1).length,
  region_cells_without_admin1: regionCellsWithoutAdmin,
  admin1_cells_without_region: adminCellsWithoutRegion,
  land_cells_unassigned_to_any_region: landWithoutRegion,
  land_unassigned_by_adm0: Object.fromEntries([...unassignedByAdm0.entries()].sort((x, y) => y[1].area - x[1].area).map(([k, v]) => [k, { cells: v.cells, area_cos_lat: +v.area.toFixed(1) }])),
  regions_with_cells_but_no_admin1: regionsWithoutAdmin,
  regions_without_cells: emptyRegions,
  note: 'Admin-1 boundaries are modern (Natural Earth); this is an approximate reference layer, not an 1836 historical boundary set.',
};
writeFileSync(outJson, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary));
