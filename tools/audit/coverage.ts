// Global coverage audit: for every political entity in the compiled Historical Database, report what is
// actually present per content dimension (sourced / estimated / derived from a generic model / missing), grouped
// by world macro-region. Reads only build outputs (src/generated/db.json and the content registry when present),
// so the report always reflects what the game ships.
//
//   npx tsx tools/audit/coverage.ts            -> docs/audit/GLOBAL_COVERAGE.md + docs/audit/coverage.json
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import type { HistoricalDB, EntityRecord, Quality } from '../../src/engine/data/dbTypes';
import { macroRegion, MACRO_REGIONS, type MacroRegion } from './regions';

const db: HistoricalDB = JSON.parse(readFileSync('src/generated/db.json', 'utf8'));
const REG = 'public/content/registry.json';
type Asset = { id: string; type: string; entity?: string; character?: string; license: string };
type Character = { id: string; entity: string; role: string; portrait?: string; bio?: unknown };
type Description = { entity: string; text: string; lang: string };
const content: { assets: Asset[]; characters: Character[]; descriptions: Description[]; local_names?: Record<string, unknown> } =
  existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : { assets: [], characters: [], descriptions: [] };

type Status = 'sourced' | 'estimated' | 'derived' | 'missing';
const SCORE: Record<Status, number> = { sourced: 1, estimated: 0.6, derived: 0.25, missing: 0 };
const q2s = (q?: Quality | null): Status => (!q || q === 'missing' ? 'missing' : q === 'verified' || q === 'supported' ? 'sourced' : 'estimated');

const DIMS = [
  ['identity', 'Tên & nhận diện'], ['symbols', 'Quốc kỳ / huy hiệu'], ['territory', 'Thủ đô & lãnh thổ'], ['population', 'Dân số'],
  ['society', 'Xã hội (tầng lớp)'], ['culture', 'Văn hóa & tôn giáo'], ['economy', 'Kinh tế'], ['politics', 'Chính thể & luật'],
  ['ruler', 'Nguyên thủ'], ['characters', 'Nhân vật'], ['military', 'Quân sự'], ['diplomacy', 'Ngoại giao'], ['history', 'Lịch sử & mô tả'],
  ['ai', 'AI'], ['events', 'Sự kiện'], ['images', 'Hình ảnh'],
] as const;
type Dim = (typeof DIMS)[number][0];

const owned = new Map<string, number>();
for (const r of db.regions) owned.set(r.owner, (owned.get(r.owner) ?? 0) + 1);
const regionsOf = (id: string) => db.regions.filter((r) => r.owner === id);

function audit(e: EntityRecord) {
  const s = {} as Record<Dim, Status>; const note = {} as Record<Dim, string>;
  const assets = content.assets.filter((a) => a.entity === e.id);
  const chars = content.characters.filter((c) => c.entity === e.id);
  const desc = content.descriptions.filter((d) => d.entity === e.id);
  const regs = regionsOf(e.id); const p = (e.profile ?? {}) as any;
  const local = content.local_names?.[e.id];
  s.identity = e.en && e.vi ? (local ? 'sourced' : 'estimated') : 'missing'; note.identity = local ? 'tên chính thức, tiếng Việt, bản địa' : 'chưa có tên bản địa';
  const flag = assets.find((a) => a.type === 'flag'), coa = assets.find((a) => a.type === 'coat_of_arms');
  s.symbols = flag || coa ? 'sourced' : 'derived'; note.symbols = flag || coa ? [flag && 'quốc kỳ', coa && 'huy hiệu'].filter(Boolean).join(', ') : 'chỉ có huy hiệu khiên do game tạo';
  s.territory = e.model === 'future' ? 'missing' : regs.length && e.capital ? 'sourced' : regs.length ? 'estimated' : 'missing'; note.territory = `${regs.length} vùng`;
  s.population = e.model === 'future' ? 'missing' : q2s(e.population?.quality); note.population = e.population?.quality ?? '—';
  s.society = 'derived'; note.society = 'tầng lớp theo mô hình chung (init.ts strataFor)';
  s.culture = regs.length ? 'sourced' : 'missing'; note.culture = `${new Set(regs.map((r) => r.culture)).size} văn hóa, ${new Set(regs.map((r) => r.religion)).size} tôn giáo`;
  const gdp = db.gdp_pc_1836[e.id];
  s.economy = gdp ? (gdp.fallback ? 'derived' : q2s(gdp.quality) === 'sourced' ? 'sourced' : 'estimated') : 'missing'; note.economy = gdp ? (gdp.fallback ? 'mặc định' : 'GDP/người Maddison (proxy)') : '—';
  s.politics = e.laws ? q2s(e.laws.quality) : e.government ? 'estimated' : 'derived'; note.politics = e.government ?? 'mặc định';
  s.ruler = e.head_of_state?.value ? q2s(e.head_of_state.quality) : 'missing'; note.ruler = e.head_of_state?.value?.name ?? '—';
  const nLeaders = db.leaders[e.id]?.length ?? 0;
  s.characters = chars.some((c) => c.portrait && c.bio) ? 'sourced' : chars.length || nLeaders ? 'estimated' : 'missing'; note.characters = `${nLeaders} nguyên thủ kế vị; ${chars.length} hồ sơ; ${chars.filter((c) => c.portrait).length} chân dung`;
  s.military = e.army ? q2s(e.army.quality) : 'derived'; note.military = e.army ? `${e.army.value}` : 'ước lượng từ dân số';
  const allied = db.alliances.filter((a) => a.members.includes(e.id)).length;
  const wars = db.wars.filter((w) => w.attackers.includes(e.id) || w.defenders.includes(e.id)).length;
  s.diplomacy = e.relations.length || allied || wars ? 'sourced' : e.overlord ? 'estimated' : 'derived'; note.diplomacy = `${e.relations.length} quan hệ, ${allied} liên minh, ${wars} chiến tranh`;
  s.history = desc.length ? 'sourced' : p.political?.formation || p.notes ? 'estimated' : 'missing'; note.history = desc.length ? `mô tả (${desc.map((d) => d.lang).join('/')})` : p.political?.formation ? 'ghi chú hình thành' : p.notes ? 'ghi chú ngắn' : '—';
  s.ai = e.personality_source === 'profile' ? (e.priorities.length ? 'sourced' : 'estimated') : 'derived'; note.ai = `${e.personality_source === 'profile' ? 'tính cách nghiên cứu' : 'tính cách suy ra'}; ${e.priorities.length} ưu tiên`;
  const dw = db.decision_windows.filter((d) => d.entity === e.id).length;
  const regIds = new Set(regs.map((r) => r.id)); const ex = db.exogenous.filter((x) => x.regions.some((r) => regIds.has(r))).length;
  s.events = dw ? 'sourced' : ex || wars ? 'estimated' : 'missing'; note.events = `${dw} quyết định lịch sử, ${ex} sự kiện ngoại sinh, ${wars} chiến tranh`;
  s.images = assets.length ? 'sourced' : 'missing'; note.images = `${assets.length} tài sản`;
  const score = DIMS.reduce((t, [d]) => t + SCORE[s[d]], 0) / DIMS.length;
  return { id: e.id, en: e.en, vi: e.vi, kind: e.kind, tier: e.tier, model: e.model, macro: macroRegion(db, e), status: s, note, score };
}

const rows = db.entities.map(audit);
const byMacro = new Map<MacroRegion, typeof rows>();
for (const r of rows) { if (!byMacro.has(r.macro)) byMacro.set(r.macro, []); byMacro.get(r.macro)!.push(r); }

const pctOf = (xs: typeof rows, f: (r: (typeof rows)[number]) => boolean) => (xs.length ? Math.round((xs.filter(f).length / xs.length) * 100) : 0);
const avg = (xs: typeof rows) => (xs.length ? Math.round((xs.reduce((t, r) => t + r.score, 0) / xs.length) * 100) : 0);
const ICON: Record<Status, string> = { sourced: '●', estimated: '◐', derived: '○', missing: '✕' };

const out: string[] = [];
out.push('# Kiểm toán độ phủ toàn cầu (tự sinh)', '');
out.push(`> Tạo bởi \`npx tsx tools/audit/coverage.ts\` từ \`src/generated/db.json\`${existsSync(REG) ? ' và `public/content/registry.json`' : ''} — dữ liệu game thực sự đóng gói, không phải dữ liệu kế hoạch. Lần chạy: ${new Date().toISOString().slice(0, 10)}.`, '');
out.push('Ký hiệu: ● có nguồn (verified/supported) · ◐ ước tính hoặc chưa đủ · ○ suy ra từ mô hình chung / mặc định · ✕ thiếu. Điểm = trung bình (●1 · ◐0,6 · ○0,25 · ✕0) trên 16 khía cạnh.', '');
out.push('## Tổng hợp theo khu vực', '');
out.push('| Khu vực | Thực thể | Chơi được | Điểm TB | Nguyên thủ | Nhân vật có chân dung | Quốc kỳ/huy hiệu thật | Mô tả | Quân số có nguồn | AI nghiên cứu |');
out.push('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const m of MACRO_REGIONS) {
  const xs = byMacro.get(m.id) ?? []; if (!xs.length) continue;
  out.push(`| ${m.vi} | ${xs.length} | ${xs.filter((r) => r.model === 'playable').length} | ${avg(xs)}% | ${pctOf(xs, (r) => r.status.ruler !== 'missing')}% | ${pctOf(xs, (r) => r.status.characters === 'sourced')}% | ${pctOf(xs, (r) => r.status.symbols === 'sourced')}% | ${pctOf(xs, (r) => r.status.history === 'sourced')}% | ${pctOf(xs, (r) => r.status.military === 'sourced')}% | ${pctOf(xs, (r) => r.status.ai !== 'derived')}% |`);
}
out.push(`| **Toàn thế giới** | **${rows.length}** | **${rows.filter((r) => r.model === 'playable').length}** | **${avg(rows)}%** | ${pctOf(rows, (r) => r.status.ruler !== 'missing')}% | ${pctOf(rows, (r) => r.status.characters === 'sourced')}% | ${pctOf(rows, (r) => r.status.symbols === 'sourced')}% | ${pctOf(rows, (r) => r.status.history === 'sourced')}% | ${pctOf(rows, (r) => r.status.military === 'sourced')}% | ${pctOf(rows, (r) => r.status.ai !== 'derived')}% |`, '');
out.push('## Phân bố trạng thái theo khía cạnh (toàn thế giới)', '');
out.push('| Khía cạnh | ● | ◐ | ○ | ✕ |', '|---|---:|---:|---:|---:|');
for (const [d, vi] of DIMS) { const c = (k: Status) => rows.filter((r) => r.status[d] === k).length; out.push(`| ${vi} | ${c('sourced')} | ${c('estimated')} | ${c('derived')} | ${c('missing')} |`); }
out.push('', '## Theo cấp nghiên cứu', '', '| Cấp | Thực thể | Điểm TB |', '|---|---:|---:|');
for (const t of ['A', 'B', 'C', 'D']) { const xs = rows.filter((r) => r.tier === t); out.push(`| ${t} | ${xs.length} | ${avg(xs)}% |`); }
out.push('', '## Chi tiết từng thực thể', '');
const head = DIMS.map(([, vi]) => vi.split(' ')[0]).join(' | ');
for (const m of MACRO_REGIONS) {
  const xs = (byMacro.get(m.id) ?? []).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)); if (!xs.length) continue;
  out.push(`### ${m.vi} (${xs.length})`, '', `| ID | Tên | Loại | Cấp | Điểm | ${head} |`, `|---|---|---|---|---:|${DIMS.map(() => ':-:').join('|')}|`);
  for (const r of xs) out.push(`| ${r.id} | ${r.vi} | ${r.kind}/${r.model} | ${r.tier} | ${Math.round(r.score * 100)}% | ${DIMS.map(([d]) => ICON[r.status[d]]).join(' | ')} |`);
  out.push('');
}
mkdirSync('docs/audit', { recursive: true });
writeFileSync('docs/audit/GLOBAL_COVERAGE.md', out.join('\n') + '\n');
writeFileSync('docs/audit/coverage.json', JSON.stringify({ generated: new Date().toISOString(), dims: DIMS, rows }, null, 1));
console.log(`entities ${rows.length}, world score ${avg(rows)}%`);
for (const m of MACRO_REGIONS) { const xs = byMacro.get(m.id) ?? []; console.log(m.id.padEnd(14), String(xs.length).padStart(3), `${avg(xs)}%`); }
