// Builds the identity content pack index (public/content/registry.json) from the researched sources:
//   historical_data/identity/wikidata_links.json   entity -> Wikidata item, official / native names
//   historical_data/identity/people_links.json     persons -> Wikidata item, dates, short descriptions
//   historical_data/identity/texts.json            Wikipedia leads (CC BY-SA 4.0) with attribution
//   historical_data/assets/*_assets.json           licensed images (flags, arms, portraits) with provenance
// The game loads this index lazily (it is not needed to start a game) and every image file only when shown.
// Integrity is checked here: every referenced file must exist and every licence must be in the allow-list.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';

const J = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const links = J('historical_data/identity/wikidata_links.json')?.links ?? {};
const people = J('historical_data/identity/people_links.json')?.people ?? {};
const texts = J('historical_data/identity/texts.json') ?? { entities: {}, people: {} };
// Researched local / official names where Wikidata has none (each with its source).
const localNames: Record<string, { text: string; lang: string; from: number | null; to: number | null; source: string }[]> = J('historical_data/identity/local_names.json')?.names ?? {};
const assetFiles = ['historical_data/assets/identity_assets.json', 'historical_data/assets/portrait_assets.json', 'historical_data/assets/illustration_assets.json'];
// MEDIA-ILL-01: 'Project original' covers art made for this project (hand-drawn, code-generated or
// AI-generated); it is allowed only with a provenance record (method, tool, creator, date).
const ALLOWED = /^(public domain|pd\b|pd-|cc0|cc[ -]by(-sa)?[ -]\d|cc[ -]by(-sa)?$|project original$)/i;
const ILLUSTRATION_TYPES = new Set(['illustration_tech', 'illustration_company', 'illustration_good', 'illustration_building', 'illustration_event', 'illustration_era']);

type Asset = Record<string, any> & { id: string; type: string; path: string };
const assets: Asset[] = [];
const problems: string[] = [];
for (const f of assetFiles) {
  for (const a of (J(f)?.assets ?? []) as Asset[]) {
    if (!existsSync('public/' + a.path)) { problems.push(`missing file ${a.path}`); continue; }
    if (!ALLOWED.test(a.license?.short ?? '')) { problems.push(`licence not allowed ${a.id}: ${a.license?.short}`); continue; }
    if (/^project original$/i.test(a.license.short) && !(a.provenance?.method && a.provenance?.creator && a.provenance?.created)) { problems.push(`project-original asset without provenance ${a.id}`); continue; }
    if (a.type?.startsWith('illustration_') && (!ILLUSTRATION_TYPES.has(a.type) || !a.subject)) { problems.push(`illustration without a known type/subject ${a.id}`); continue; }
    assets.push({
      id: a.id, type: a.type, entity: a.entity, character: a.character, subject: a.subject ?? null, provenance: a.provenance ?? null, name: a.name, period: a.period ?? { from: null, to: null }, quality: a.quality ?? 'supported',
      path: a.path, thumb: a.thumbnail_path && existsSync('public/' + a.thumbnail_path) ? a.thumbnail_path : null, w: a.width, h: a.height, bytes: statSync('public/' + a.path).size,
      license: a.license.short, license_url: a.license.url, author: a.author || null, credit: a.credit || null,
      source: a.source.page, file: a.source.file, statement: a.source.statement, date: a.date ?? null, description: a.description,
    });
  }
}
const byEntity = (type: string, eid: string) => assets.filter((a) => a.type === type && a.entity === eid).map((a) => a.id);

const entities: Record<string, unknown> = {};
for (const [eid, l] of Object.entries<any>(links)) {
  const t = texts.entities[eid]?.texts ?? [];
  entities[eid] = l.linked
    ? { qid: l.qid, article: l.article, kind: l.kind, label_vi: l.label_vi ?? null, description_en: l.description_en ?? null, names: [...(l.names ?? []), ...(localNames[eid] ?? [])],
        flags: byEntity('flag', eid), arms: byEntity('coat_of_arms', eid), texts: t, desc_override: texts.entities[eid]?.desc_override ?? false }
    : { qid: null, reason: l.reason, flags: [], arms: [], texts: [] };
}

const characters: Record<string, unknown> = {};
for (const [pid, p] of Object.entries<any>(people)) {
  const linked = p.match === 'strong' || p.match === 'weak';
  const portrait = assets.find((a) => a.type === 'portrait' && a.character === pid)?.id ?? null;
  characters[pid] = {
    id: pid, entity: p.entity, name: p.name, title: p.title ?? null, roles: p.roles, born: p.born ?? null, died: p.died ?? null, terms: p.terms,
    match: p.match, qid: linked ? p.qid : null, label_vi: linked ? p.label_vi ?? null : null,
    description_vi: linked ? p.description_vi ?? null : null, description_en: linked ? p.description_en ?? null : null,
    wd_born: linked ? p.wd_born ?? null : null, wd_died: linked ? p.wd_died ?? null : null,
    portrait, texts: texts.people[pid]?.texts ?? [],
  };
}

const out = {
  version: 1, generated: new Date().toISOString(),
  licence_note: 'Hình ảnh: giấy phép ghi theo từng tệp (phạm vi công cộng / CC0 / CC BY / CC BY-SA, Wikimedia Commons). Văn bản: phần mở đầu bài Wikipedia, CC BY-SA 4.0, tác giả là cộng đồng Wikipedia. Liên kết danh tính: Wikidata (CC0).',
  counts: {
    assets: assets.length, bytes: assets.reduce((s, a) => s + a.bytes, 0),
    flags: assets.filter((a) => a.type === 'flag').length, arms: assets.filter((a) => a.type === 'coat_of_arms').length, portraits: assets.filter((a) => a.type === 'portrait').length, illustrations: assets.filter((a) => ILLUSTRATION_TYPES.has(a.type)).length,
    entities_linked: Object.values<any>(links).filter((l) => l.linked).length, entity_texts: Object.keys(texts.entities).length,
    characters: Object.keys(characters).length, characters_linked: Object.values<any>(characters).filter((c) => c.qid).length,
  },
  assets, entities, characters,
  // MEDIA-ILL-01: illustrations indexed by `${type}:${subject}` (e.g. illustration_tech:railways).
  illustrations: assets.filter((a) => ILLUSTRATION_TYPES.has(a.type)).reduce((m: Record<string, string[]>, a) => { (m[`${a.type}:${a.subject}`] ??= []).push(a.id); return m; }, {}),
};
mkdirSync('public/content', { recursive: true });
writeFileSync('public/content/registry.json', JSON.stringify(out));
console.log(JSON.stringify(out.counts));
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
