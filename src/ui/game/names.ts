// Display names. Full formal names come from the Historical Database (`vi`/`en`); the short form used on the map
// and in compact rows strips the formal prefix ("Vương quốc", "Đại công quốc", …) unless a conventional
// Vietnamese short name exists (UI copy). Countries created during play use their engine name.
import { data } from '../../engine/data/db';
import type { GameState } from '../../engine/types';

const SHORT: Record<string, string> = {
  GBR: 'Anh', USA: 'Hoa Kỳ', TUR: 'Ottoman', RUS: 'Nga', FRA: 'Pháp', PRU: 'Phổ', AUS: 'Áo', SPA: 'Tây Ban Nha', POR: 'Bồ Đào Nha', NED: 'Hà Lan',
  SAR: 'Sardegna', SIC: 'Hai Sicilia', PAP: 'Giáo hoàng', QNG: 'Đại Thanh', EIC: 'Công ty Đông Ấn', SWE: 'Thụy Điển', NOR: 'Na Uy', DEN: 'Đan Mạch',
  GRE: 'Hy Lạp', SWI: 'Thụy Sĩ', BAV: 'Bayern', EGY: 'Ai Cập', PER: 'Ba Tư', MOR: 'Maroc', JAP: 'Nhật Bản', VNM: 'Đại Nam', SIA: 'Xiêm', BRA: 'Brasil', MEX: 'México',
  KOR: 'Triều Tiên', BUR: 'Miến Điện', SIK: 'Đế quốc Sikh', AFG: 'Afghanistan', ETH: 'Ethiopia', GER: 'Đức', ITA: 'Ý', BEL: 'Bỉ', CAN: 'Canada',
};
const PREFIX = /^(Vương quốc Hồi giáo|Vương quốc|Đế quốc|Đại công quốc|Công quốc|Thân vương quốc|Bá quốc|Tuyển hầu quốc|Liên bang|Thành phố tự do|Lãnh thổ|Hợp chúng quốc|Cộng hòa|Hãn quốc|Tiểu vương quốc|Lãnh địa|Quốc gia|Liên minh)\s+/;

export function fullName(st: GameState | null, id: string): string {
  const c = st?.countries[id]; if (c?.nameVi) return c.nameVi;
  return data().entity.get(id)?.vi ?? c?.name ?? id;
}
/** Short names that changed during 1836–1936, by the first year of each name (sources in historical_data/identity/local_names.json). */
const DATED: Record<string, [number, string][]> = { VNM: [[1804, 'Việt Nam'], [1839, 'Đại Nam']] };
export function shortName(st: GameState | null, id: string): string {
  const dated = DATED[id];
  if (dated) { const y = st?.date.y ?? 1836; return [...dated].reverse().find(([from]) => y >= from)?.[1] ?? dated[0][1]; }
  if (SHORT[id]) return SHORT[id];
  const full = fullName(st, id);
  return full.replace(/\s*\(.*\)$/, '').replace(PREFIX, '');
}
/** Abbreviation for small polities with hyphenated names (e.g. "Mecklenburg-Strelitz" → "Meckl.-Strel."); others keep their name. */
export function abbrevName(name: string): string {
  if (name.length <= 9 || !name.includes('-') || name.includes(' ')) return name;
  return name.split('-').map((p) => (p.length > 6 ? p.slice(0, 5) + '.' : p)).join('-');
}
