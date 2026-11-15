// Map layers ("Lớp bản đồ"): every colour is computed from engine state or the Historical Database;
// each layer carries its own legend with units/ranges. Political colours are muted so the map never
// out-shouts the interface, and status (occupation) is also drawn as a hatch pattern, not by colour alone.
import { data } from '../../engine/data/db';
import { marketOf } from '../../engine/systems/economy';
import { getRel } from '../../engine/core';
import type { GameState, Region } from '../../engine/types';
import { PAL_W } from './renderer';
import type { LensId } from '../game/ui';

export interface LegendItem { color: string; label: string; pattern?: 'hatch' }
export interface LensDef { id: LensId; name: string; desc: string; unit?: string; legend: (st: GameState, focus: string | null) => LegendItem[]; color: (r: Region, st: GameState, focus: string | null) => string }

type RGB = [number, number, number];
/** Accepts #rrggbb or the engine's `hsl(h s% l%)` colours for countries formed during play. */
const hexToRgb = (h: string): RGB => {
  const m = /^hsl\(\s*([\d.]+)[ ,]+([\d.]+)%[ ,]+([\d.]+)%\s*\)$/.exec(h ?? '');
  if (m) {
    const H = Number(m[1]) / 360, S = Number(m[2]) / 100, L = Number(m[3]) / 100;
    const q = L < 0.5 ? L * (1 + S) : L + S - L * S, p = 2 * L - q;
    const f = (t: number) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(H + 1 / 3) * 255, f(H) * 255, f(H - 1 / 3) * 255];
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(h ?? '')) return [150, 140, 120];
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
};
const rgbToHex = (c: RGB) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mixHex = (a: string, b: string, t: number) => { const x = hexToRgb(a), y = hexToRgb(b); return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); };
const PARCHMENT = '#efe6cf', INK = '#3a3226';
/** Colour of a land-cover sample after the Terrain-mode grading in the shader (saturation ×1.7, contrast ×1.3). */
export function terrainSwatch(hex: string): string {
  const c = hexToRgb(hex).map((v) => v / 255); const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  return rgbToHex(c.map((v) => ((l + (v - l) * 1.7 - 0.6) * 1.3 + 0.52) * 0.92 * 255) as RGB);
}
/** Political colour: the country's colour, moderately saturated and slightly warmed toward parchment so the land
 *  cover and relief still read through it (the shader multiplies it by the land cover). */
export function pastel(hex: string): string {
  let [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  s = Math.min(0.62, s * 0.92); const L = 0.5 + l * 0.2;
  const q = L < 0.5 ? L * (1 + s) : L + s - L * s, p = 2 * L - q;
  const f = (t: number) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  [r, g, b] = s === 0 ? [L, L, L] : [f(h + 1 / 3), f(h), f(h - 1 / 3)];
  return mixHex(rgbToHex([r * 255, g * 255, b * 255]), PARCHMENT, 0.1);
}
/** Border shade: a darker, slightly inked version of a fill colour. */
export const shade = (fill: string) => mixHex(fill, INK, 0.45);
export const mute = pastel;
export const SEQ = ['#efe3c4', '#dcc48c', '#c79c5f', '#9f6c45', '#6c4331']; // sepia ramp, light → dark
const UNCLAIMED = '#d8cfb6';
const step = (v: number, cuts: number[]) => { const i = cuts.findIndex((c) => v < c); return SEQ[i < 0 ? cuts.length : i]; };
const seqLegend = (labels: string[]) => labels.map((label, i) => ({ color: SEQ[i], label }));

export const LENSES: LensDef[] = [
  {
    id: 'political', name: 'Chính trị', desc: 'Màu theo quốc gia sở hữu. Vùng bị chiếm đóng có gạch chéo theo màu bên chiếm.',
    color: (r, st) => { const c = st.countries[r.owner]; return !c || c.decentralized ? UNCLAIMED : mute(c.color); },
    legend: () => [{ color: '#c9b9d6', label: 'Màu = quốc gia sở hữu' }, { color: UNCLAIMED, label: 'Chính thể phi tập trung' }, { color: '#c98b7a', label: 'Đang bị chiếm đóng', pattern: 'hatch' }],
  },
  {
    id: 'terrain', name: 'Địa hình', desc: 'Lớp phủ mặt đất và địa hình nổi (Natural Earth I, phạm vi công cộng) với biên giới quốc gia. Loại địa hình mô phỏng của mỗi vùng xem trong cửa sổ Vùng.',
    color: (r, st) => { const c = st.countries[r.owner]; return !c || c.decentralized ? UNCLAIMED : mute(c.color); },
    legend: () => [{ color: terrainSwatch('#acc8af'), label: 'Rừng nhiệt đới, rừng rậm' }, { color: terrainSwatch('#dee3bb'), label: 'Đồng bằng, đồng cỏ, đất canh tác' }, { color: terrainSwatch('#f3eeda'), label: 'Sa mạc, bán khô hạn' }, { color: terrainSwatch('#d4d5d6'), label: 'Núi cao, lãnh nguyên' }, { color: terrainSwatch('#e9eef4'), label: 'Băng tuyết' }],
  },
  {
    id: 'population', name: 'Mật độ dân số', unit: 'người/km²', desc: 'Dân số vùng chia diện tích (km²) theo mô phỏng hiện tại.',
    color: (r) => step(r.pop / Math.max(1, r.area), [5, 20, 50, 100]),
    legend: () => seqLegend(['< 5', '5–20', '20–50', '50–100', '≥ 100']),
  },
  {
    id: 'economy', name: 'Kinh tế', unit: '¤ sản lượng / người / năm', desc: 'Giá trị gia tăng của vùng trong tháng gần nhất × 12, chia dân số (đơn vị tiền của mô phỏng, thang Maddison 1990 GK$).',
    color: (r) => step((r.output * 12) / Math.max(1, r.pop), [400, 700, 1000, 1500]),
    legend: () => seqLegend(['< 400', '400–700', '700–1.000', '1.000–1.500', '≥ 1.500']),
  },
  {
    id: 'sol', name: 'Mức sống', unit: 'chỉ số engine', desc: 'Chỉ số mức sống của dân cư trong vùng (thang của engine, ~0–1,2).',
    color: (r) => step(r.sol, [0.4, 0.55, 0.7, 0.85]),
    legend: () => seqLegend(['< 0,40', '0,40–0,55', '0,55–0,70', '0,70–0,85', '≥ 0,85']),
  },
  {
    id: 'literacy', name: 'Biết chữ', unit: '% dân số', desc: 'Tỷ lệ biết chữ của vùng theo mô phỏng hiện tại.',
    color: (r) => step(r.literacy, [0.1, 0.25, 0.4, 0.55]),
    legend: () => seqLegend(['< 10%', '10–25%', '25–40%', '40–55%', '≥ 55%']),
  },
  {
    id: 'resources', name: 'Tài nguyên', desc: 'Tài nguyên nổi bật của vùng theo Cơ sở dữ liệu Lịch sử (ưu tiên khoáng sản, rồi cây công nghiệp; ngũ cốc khi không có gì khác).',
    color: (r) => RES_COL[mainRes(r.res)] ?? UNCLAIMED,
    legend: () => RES_ORDER.map((k) => ({ color: RES_COL[k], label: RES_VI[k] })),
  },
  {
    id: 'diplomacy', name: 'Ngoại giao', unit: 'quan hệ −100…+100', desc: 'Quan hệ của mỗi quốc gia với quốc gia đang chọn; đồng minh và kẻ thù đang giao chiến được tách riêng.',
    color: (r, st, focus) => {
      if (!focus) return UNCLAIMED;
      if (r.owner === focus) return '#86bfb4';
      const c = st.countries[r.owner]; if (!c || c.decentralized) return UNCLAIMED;
      if (c.overlord === focus) return '#a9d2c8';
      if (st.wars.some((w) => (w.attackers.members.includes(focus) && w.defenders.members.includes(r.owner)) || (w.defenders.members.includes(focus) && w.attackers.members.includes(r.owner)))) return '#c4705f';
      if (st.treaties.some((t) => t.type === 'alliance' && t.members.includes(focus) && t.members.includes(r.owner))) return '#9cc28a';
      const v = getRel(st, focus, r.owner);
      return v >= 30 ? '#cbd9a6' : v <= -30 ? '#dba893' : '#ddd4bf';
    },
    legend: () => [{ color: '#86bfb4', label: 'Quốc gia đang chọn' }, { color: '#9cc28a', label: 'Đồng minh' }, { color: '#cbd9a6', label: 'Quan hệ ≥ +30' }, { color: '#ddd4bf', label: 'Trung lập' }, { color: '#dba893', label: 'Quan hệ ≤ −30' }, { color: '#c4705f', label: 'Đang chiến tranh' }],
  },
  {
    id: 'military', name: 'Quân sự', desc: 'Các cuộc chiến của quốc gia đang chọn: phe ta, đồng minh trong chiến tranh, kẻ thù; vùng bị chiếm có gạch chéo theo màu bên chiếm; vùng bị tàn phá tối hơn.',
    color: (r, st, focus) => {
      if (!focus) return UNCLAIMED;
      const wars = st.wars.filter((w) => w.attackers.members.includes(focus) || w.defenders.members.includes(focus));
      let base = r.owner === focus ? '#86bfb4' : UNCLAIMED;
      for (const w of wars) { const mine = w.attackers.members.includes(focus) ? w.attackers.members : w.defenders.members; const foe = mine === w.attackers.members ? w.defenders.members : w.attackers.members;
        if (r.owner !== focus && mine.includes(r.owner)) base = '#a9c99a'; if (foe.includes(r.owner)) base = '#d98b78'; }
      if (base === UNCLAIMED && st.wars.some((w) => w.attackers.members.includes(r.owner) || w.defenders.members.includes(r.owner))) base = '#e2c9a6';
      return r.devastation > 0.05 ? mixHex(base, '#3a3226', Math.min(0.45, r.devastation)) : base;
    },
    legend: () => [{ color: '#86bfb4', label: 'Quốc gia đang chọn' }, { color: '#a9c99a', label: 'Cùng phe trong chiến tranh' }, { color: '#d98b78', label: 'Kẻ thù' }, { color: '#e2c9a6', label: 'Nước khác đang có chiến tranh' }, { color: '#c98b7a', label: 'Vùng bị chiếm', pattern: 'hatch' }],
  },
  {
    id: 'market', name: 'Thị trường', desc: 'Mỗi màu là một thị trường (quốc gia hoặc liên minh thuế quan) dùng chung giá.',
    color: (r, st) => { const c = st.countries[r.owner]; if (!c || c.decentralized) return UNCLAIMED; const m = st.countries[marketOf(st, c)] ?? c; return mute(m.color); },
    legend: () => [{ color: '#c9b9d6', label: 'Màu = thị trường chung giá' }, { color: UNCLAIMED, label: 'Ngoài thị trường quốc gia' }],
  },
];
const RES_ORDER = ['gold', 'silv', 'coal', 'iron', 'opium', 'cott', 'cash', 'lux', 'timb', 'live', 'fish', 'grain'];
const RES_COL: Record<string, string> = { gold: '#e5c35c', silv: '#c8ccd2', coal: '#6d6a66', iron: '#9a7f72', opium: '#c49ab6', cott: '#efe9dc', cash: '#9fbf7d', lux: '#b59bd6', timb: '#7f9f6e', live: '#d6b48b', fish: '#8fb7c9', grain: '#e9dcae' };
const RES_VI: Record<string, string> = { gold: 'Vàng', silv: 'Bạc', coal: 'Than', iron: 'Sắt', opium: 'Thuốc phiện', cott: 'Bông', cash: 'Cây công nghiệp', lux: 'Hàng xa xỉ', timb: 'Gỗ', live: 'Gia súc', fish: 'Cá', grain: 'Ngũ cốc' };
const mainRes = (res: string[]) => RES_ORDER.find((k) => res.includes(k)) ?? 'grain';
export const lensById = (id: LensId) => LENSES.find((l) => l.id === id) ?? LENSES[0];

/** Builds the 4-row palette texture consumed by the shader (see renderer.ts). */
export function buildPalette(st: GameState, lens: LensDef, focus: string | null, selRegion: string | null, selCountry: string | null): Uint8Array {
  const d = data(); const pal = new Uint8Array(PAL_W * 4 * 4);
  const ownerCode = new Map<string, number>(); let next = 1;
  const byId = new Map(st.regions.map((r) => [r.id, r]));
  d.map.regionIds.forEach((id, i) => {
    const r = byId.get(id); if (!r) return; const k = i + 1;
    const fill = lens.color(r, st, focus); const [cr, cg, cb] = hexToRgb(fill);
    pal.set([cr, cg, cb, 255], k * 4);
    const ownerFill = lens.id === 'political' || lens.id === 'market' ? fill : (st.countries[r.owner] && !st.countries[r.owner].decentralized ? pastel(st.countries[r.owner].color) : UNCLAIMED);
    const [sr, sg, sb] = hexToRgb(shade(ownerFill)); pal.set([sr, sg, sb, 255], (PAL_W * 3 + k) * 4);
    let code = ownerCode.get(r.owner); if (code === undefined) { code = next++; ownerCode.set(r.owner, code); }
    const flags = (id === selRegion ? 1 : 0) | (selCountry && r.owner === selCountry ? 2 : 0) | ((lens.id === 'political' || lens.id === 'military') && r.controller !== r.owner ? 4 : 0);
    pal.set([code & 255, code >> 8, flags, 255], (PAL_W + k) * 4);
    const ctrl = st.countries[r.controller]; const [hr, hg, hb] = hexToRgb(ctrl ? shade(pastel(ctrl.color)) : '#a0503f');
    pal.set([hr, hg, hb, 255], (PAL_W * 2 + k) * 4);
  });
  return pal;
}
