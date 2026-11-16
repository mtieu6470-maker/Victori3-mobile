// S0-B3 audit tool (not product code; read-only). Asset inventory with checksums for G0.8: every file of the built web
// payload (dist/), the Android resources packaged into the APK and the committed map build inputs, each with its
// origin, source, author/credit, licence as recorded, temporal validity and verification status. Licences are taken
// from the records that already exist (content registry, package licence fields, dataset notes); nothing is
// re-verified online here, so recorded licences keep the status 'recorded_not_reverified'.
// Usage: npx tsx tools/audit/s0/asset_inventory.ts <built checkout> <capacitor android template dir> <out.csv> <out.json>
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const [base, capTemplate, outCsv, outJson] = process.argv.slice(2);
if (!base || !capTemplate || !outCsv || !outJson) throw new Error('usage: asset_inventory.ts <checkout> <capacitor template dir> <out.csv> <out.json>');

const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]);
const pkg = (name: string) => JSON.parse(readFileSync(join(base, 'node_modules', name, 'package.json'), 'utf8'));

const registry = JSON.parse(readFileSync(join(base, 'public/content/registry.json'), 'utf8'));
const byPath = new Map<string, any[]>();
for (const a of registry.assets) { const l = byPath.get(a.path) ?? []; l.push(a); byPath.set(a.path, l); }

interface Row { scope: string; path: string; bytes: number; sha256: string; category: string; origin: string; source: string; author: string; license: string; licence_status: string; period_from: string; period_to: string; verification: string; registry_entries: string; note: string }
const rows: Row[] = [];
const add = (r: Partial<Row> & { scope: string; path: string; abs: string }) => {
  const { abs, ...rest } = r;
  rows.push({ bytes: statSync(abs).size, sha256: sha(abs), category: '', origin: '', source: '', author: '', license: '', licence_status: '', period_from: '', period_to: '', verification: '', registry_entries: '', note: '', ...rest } as Row);
};

const fonts: Record<string, { name: string; version: string; license: string }> = {
  'eb-garamond': { name: '@fontsource/eb-garamond', version: pkg('@fontsource/eb-garamond').version, license: pkg('@fontsource/eb-garamond').license },
  'source-sans-3': { name: '@fontsource/source-sans-3', version: pkg('@fontsource/source-sans-3').version, license: pkg('@fontsource/source-sans-3').license },
};
const prodDeps = Object.keys(JSON.parse(readFileSync(join(base, 'package.json'), 'utf8')).dependencies ?? {});
const depLicences = prodDeps.map((d) => { const p = pkg(d); return { name: d, version: p.version, license: p.license ?? null, licence_file: readdirSync(join(base, 'node_modules', d)).filter((f) => /licen[cs]e/i.test(f)) }; });

const NE = 'Natural Earth (public domain), https://www.naturalearthdata.com/';
const mapOrigin: Record<string, string> = {
  'map/terrain.jpg': 'tools/etl/make_terrain.py from Natural Earth I land-cover raster',
  'map/relief.jpg': 'tools/etl/make_relief.py from Natural Earth shaded-relief rasters',
  'map/lakes.json': 'tools/etl/prepare_map_sources.ts from Natural Earth lakes',
  'map/rivers.json': 'tools/etl/prepare_map_sources.ts from Natural Earth rivers',
};

for (const abs of walk(join(base, 'dist')).sort()) {
  const p = relative(join(base, 'dist'), abs);
  const reg = byPath.get(p);
  if (reg) {
    const a = reg[0]; const lic = [...new Set(reg.map((x) => x.license))];
    add({ scope: 'web_payload', path: p, abs, category: a.type === 'portrait' ? 'portrait' : a.type, origin: 'Wikimedia Commons file, converted to WebP by tools/etl/fetch_identity.py / fetch_portraits.py',
      source: a.source, author: [a.author, a.credit].filter(Boolean).join(' | '), license: lic.join(' / '), licence_status: 'recorded_not_reverified',
      period_from: a.period?.from ?? '', period_to: a.period?.to ?? '', verification: [...new Set(reg.map((x) => x.quality))].join('/'),
      registry_entries: reg.map((x) => x.id).join(' '), note: reg.length > 1 ? `file shared by ${reg.length} registry entries` : '' });
  } else if (p.startsWith('content/') && p !== 'content/registry.json') {
    add({ scope: 'web_payload', path: p, abs, category: 'content_unreferenced', origin: 'not referenced by registry.json', licence_status: 'unknown', note: 'ORPHAN: no registry entry' });
  } else if (p === 'content/registry.json') {
    add({ scope: 'web_payload', path: p, abs, category: 'generated_content_index', origin: 'tools/build-content.ts from historical_data/identity/* and historical_data/assets/*',
      license: 'mixed: project data; embedded Wikipedia extracts CC BY-SA 4.0 with attribution fields', licence_status: 'derived', note: `generated timestamp field 'generated' (R12); ${registry.assets.length} asset records` });
  } else if (p.startsWith('map/')) {
    add({ scope: 'web_payload', path: p, abs, category: 'map_raster_or_vector', origin: mapOrigin[p] ?? 'Natural Earth derived', source: NE, license: 'Public domain', licence_status: 'public_domain_dataset' });
  } else if (p.startsWith('generated/')) {
    add({ scope: 'web_payload', path: p, abs, category: 'generated_map', origin: 'tools/build-map.ts from assets/map/admin1_grid.bin.gz (Natural Earth admin-1) and db.json regions', source: NE, license: 'Public domain source data; derived', licence_status: 'derived' });
  } else if (/^assets\/.*\.woff2?$/.test(p)) {
    const f = Object.entries(fonts).find(([k]) => p.includes(k));
    add({ scope: 'web_payload', path: p, abs, category: 'font', origin: f ? `${f[1].name}@${f[1].version} (bundled by Vite)` : 'unknown font package', license: f ? f[1].license : '', licence_status: f ? 'package_license_file' : 'unknown' });
  } else if (/^assets\/index-.*\.(js|css)$/.test(p)) {
    add({ scope: 'web_payload', path: p, abs, category: p.endsWith('.js') ? 'app_bundle_js' : 'app_bundle_css', origin: 'project source compiled by Vite with bundled production dependencies',
      license: 'project code (no licence file in repository) + ' + depLicences.filter((d) => !d.name.startsWith('@capacitor/android')).map((d) => `${d.name} ${d.license}`).join(', '), licence_status: 'project_authored_plus_packages',
      note: p.endsWith('.js') ? "embeds db.json incl. 'built_at' (R12)" : '' });
  } else {
    add({ scope: 'web_payload', path: p, abs, category: 'app_shell', origin: 'project-authored (git history)', licence_status: 'project_authored' });
  }
}

const resDir = join(base, 'android/app/src/main/res');
const capVersion = pkg('@capacitor/cli').version, capLicense = pkg('@capacitor/cli').license;
for (const abs of walk(resDir).sort()) {
  const p = relative(join(base, 'android/app/src/main'), abs);
  const tpl = walk(capTemplate).find((t) => t.endsWith('/' + p));
  const same = tpl ? readFileSync(tpl).equals(readFileSync(abs)) : false;
  add({ scope: 'android_res', path: p, abs, category: p.includes('mipmap') ? 'launcher_icon' : p.includes('drawable') ? 'drawable/splash' : 'android_resource',
    origin: same ? `identical to @capacitor/cli@${capVersion} android template (default placeholder)` : 'project-modified',
    license: same ? `${capLicense} (Capacitor template)` : '', licence_status: same ? 'template_default' : 'project_authored' });
}
for (const abs of walk(join(base, 'assets')).sort()) {
  add({ scope: 'build_input_not_shipped', path: relative(base, abs), abs, category: 'map_source', origin: 'tools/etl/prepare_map_sources.ts from Natural Earth 10m admin-1', source: NE, license: 'Public domain', licence_status: 'public_domain_dataset' });
}

const head = ['scope', 'path', 'bytes', 'sha256', 'category', 'origin', 'source', 'author', 'license', 'licence_status', 'period_from', 'period_to', 'verification', 'registry_entries', 'note'] as const;
const q = (v: unknown) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
writeFileSync(outCsv, [head.join(','), ...rows.map((r) => head.map((h) => q((r as any)[h])).join(','))].join('\n') + '\n');

const count = (f: (r: Row) => string) => rows.reduce((m: Record<string, number>, r) => { const k = f(r); m[k] = (m[k] ?? 0) + 1; return m; }, {});
const registryPathsMissing = [...byPath.keys()].filter((p) => !existsSync(join(base, 'dist', p)));
const summary = {
  schema: 's0-asset-inventory-v1',
  files: rows.length,
  by_scope: count((r) => r.scope),
  by_category: count((r) => `${r.scope}:${r.category}`),
  by_licence_status: count((r) => r.licence_status),
  web_payload_bytes: rows.filter((r) => r.scope === 'web_payload').reduce((s, r) => s + r.bytes, 0),
  registry_asset_records: registry.assets.length,
  registry_records_by_licence: registry.assets.reduce((m: Record<string, number>, a: any) => { m[a.license] = (m[a.license] ?? 0) + 1; return m; }, {}),
  registry_records_by_quality: registry.assets.reduce((m: Record<string, number>, a: any) => { m[a.quality] = (m[a.quality] ?? 0) + 1; return m; }, {}),
  registry_files_shared_by_several_records: [...byPath.entries()].filter(([, l]) => l.length > 1).map(([p, l]) => ({ path: p, records: l.map((x) => x.id) })),
  registry_paths_missing_in_dist: registryPathsMissing,
  orphan_content_files: rows.filter((r) => r.category === 'content_unreferenced').map((r) => r.path),
  production_dependency_licences: depLicences,
  android_res_identical_to_capacitor_template: rows.filter((r) => r.licence_status === 'template_default').length,
  android_res_total: rows.filter((r) => r.scope === 'android_res').length,
};
writeFileSync(outJson, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ files: summary.files, by_scope: summary.by_scope, by_licence_status: summary.by_licence_status, orphans: summary.orphan_content_files.length, missing: registryPathsMissing.length }));
