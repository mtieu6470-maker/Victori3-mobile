// Vietnamese UI strings and number formatting. Glossary decisions (see docs/ui/UI_DESIGN_SYSTEM.md §8):
// "Lớp bản đồ" (never "Lens"), "Chỉ số giá" (1,00 = giá gốc), "¤" = engine currency unit (Maddison 1990 GK$ scale).
import { REFORMABLE_LAWS } from '../../engine/laws';
import type { LawGroup } from '../../engine/data/dbTypes';
import type { IG } from '../../engine/types';

export const LAW_VI: Record<string, string> = {
  autocracy: 'Chuyên chế', oligarchy: 'Đầu sỏ', census_suffrage: 'Bầu cử theo tài sản', universal_male_suffrage: 'Phổ thông đầu phiếu nam', theocracy: 'Thần quyền', tribal_council: 'Hội đồng bộ lạc',
  monarchy: 'Quân chủ', republic: 'Cộng hòa', colonial_company: 'Công ty thuộc địa', chiefdom: 'Tù trưởng',
  traditionalism: 'Truyền thống', mercantilism: 'Trọng thương', interventionism: 'Can thiệp', laissez_faire: 'Tự do kinh doanh',
  protectionism: 'Bảo hộ', free_trade: 'Thương mại tự do', isolationism: 'Bế quan',
  serfdom: 'Nông nô', slavery: 'Nô lệ', traditional_tenancy: 'Tá điền truyền thống', free_labor: 'Lao động tự do',
  state_religion: 'Quốc giáo', freedom_of_conscience: 'Tự do tín ngưỡng', secularism: 'Thế tục',
  censorship: 'Kiểm duyệt', limited_press: 'Báo chí hạn chế', free_press: 'Tự do báo chí',
  no_schools: 'Không trường công', religious_schools: 'Trường tôn giáo', public_schools: 'Trường công',
  feudal_levies: 'Quân phong kiến', professional_army: 'Quân chuyên nghiệp', mass_conscription: 'Nghĩa vụ đại trà',
};
/** Reformable law values per group: re-exported from the engine catalogue (single source of truth). */
export const LAW_OPTIONS = REFORMABLE_LAWS as Record<LawGroup, string[]>;
export const GROUP_VI: Record<LawGroup, string> = { power: 'Quyền lực', governance: 'Chính thể', economy: 'Kinh tế', trade: 'Thương mại', labor: 'Lao động', church: 'Tôn giáo', press: 'Báo chí', education: 'Giáo dục', army: 'Quân đội' };
export const IG_VI: Record<IG, string> = { landowners: 'Địa chủ', industrialists: 'Nhà công nghiệp', intelligentsia: 'Trí thức', petty_bourgeoisie: 'Tiểu tư sản', clergy: 'Giáo sĩ', armed_forces: 'Quân nhân', rural_folk: 'Nông dân', trade_unions: 'Công đoàn' };
export const GOOD_VI: Record<string, string> = { grain: 'Lương thực', cash_crops: 'Nông sản hàng hóa', cotton: 'Bông', timber: 'Gỗ', coal: 'Than', iron: 'Sắt', steel: 'Thép', textiles: 'Vải', tools: 'Công cụ', arms: 'Vũ khí', luxury: 'Hàng xa xỉ', opium: 'Thuốc phiện' };
export const GOOD_GROUP: Record<string, 'agri' | 'raw' | 'ind' | 'cons'> = { grain: 'agri', cash_crops: 'agri', cotton: 'agri', opium: 'agri', timber: 'raw', coal: 'raw', iron: 'raw', steel: 'ind', tools: 'ind', arms: 'ind', textiles: 'cons', luxury: 'cons' };
export const BUILD_VI: Record<string, string> = { plantation: 'Đồn điền', mine: 'Mỏ', logging: 'Khai thác gỗ', textile_mill: 'Nhà máy dệt', ironworks: 'Xưởng luyện sắt', tool_works: 'Xưởng công cụ', arms_works: 'Xưởng vũ khí', luxury_workshop: 'Xưởng hàng xa xỉ', railway: 'Đường sắt', university: 'Đại học' };
export const STRATA_VI: Record<string, string> = { peasants: 'Nông dân', slaves: 'Nô lệ', laborers: 'Lao động phổ thông', artisans: 'Thợ thủ công', workers: 'Công nhân', middle: 'Trung lưu', clergy: 'Giáo sĩ', aristocrats: 'Quý tộc', capitalists: 'Tư bản' };
export const GOV_VI: Record<string, string> = {
  constitutional_monarchy: 'Quân chủ lập hiến', absolute_monarchy: 'Quân chủ chuyên chế', estates_monarchy: 'Quân chủ đẳng cấp', presidential_republic: 'Cộng hòa tổng thống', federal_republic: 'Cộng hòa liên bang',
  protectorate_republic: 'Cộng hòa được bảo hộ', chartered_company_rule: 'Công ty đặc quyền cai trị', rebel_claimant: 'Phe tranh ngôi nổi dậy', confederation: 'Liên bang', city_republic: 'Cộng hòa thành phố',
  confederation_of_tribes: 'Liên minh bộ lạc', theocracy: 'Thần quyền', autonomous_principality: 'Thân vương quốc tự trị', autonomous_beylik: 'Beylik tự trị', theocratic_emirate: 'Tiểu vương quốc thần quyền',
  tribal_monarchy: 'Quân chủ bộ lạc', collective_monarchy: 'Quân chủ tập thể', princely_state: 'Phiên vương quốc', aggregate_princely_states: 'Nhóm phiên vương quốc', feudal_shogunate: 'Mạc phủ phong kiến',
  aggregate_sultanates: 'Nhóm vương quốc Hồi giáo', confederation_of_chiefs: 'Liên minh tù trưởng', fragmented_monarchy: 'Quân chủ phân quyền', caliphate: 'Vương triều Caliph', collapsing_monarchy: 'Quân chủ suy tàn',
  theocratic_imamate: 'Lãnh địa Imam thần quyền', private_colony: 'Thuộc địa tư nhân', provisional_government: 'Chính phủ lâm thời', dictatorship: 'Độc tài', rebel_republic: 'Cộng hòa nổi dậy', republic: 'Cộng hòa',
};
export const TECH_TREE_VI: Record<string, string> = { production: 'Sản xuất', society: 'Xã hội', military: 'Quân sự' };
export const SUBJECT_VI: Record<string, string> = { protectorate: 'Xứ bảo hộ', puppet: 'Bù nhìn', personal_union: 'Liên minh cá nhân', tributary: 'Triều cống', chartered_company: 'Công ty đặc quyền', dominion: 'Lãnh thổ tự trị', colony: 'Thuộc địa', vassal: 'Chư hầu' };
export const QUALITY_VI: Record<string, { sym: string; label: string; cls: string }> = {
  verified: { sym: '●', label: 'Đã kiểm chứng', cls: 'q-verified' },
  supported: { sym: '◆', label: 'Có nguồn hỗ trợ', cls: 'q-supported' },
  estimated: { sym: '▲', label: 'Ước tính (có phương pháp)', cls: 'q-estimated' },
  uncertain: { sym: '◇', label: 'Nguồn mâu thuẫn', cls: 'q-uncertain' },
  missing: { sym: '○', label: 'Thiếu dữ liệu — giá trị gameplay', cls: 'q-missing' },
};
export const LOG_TYPE_VI: Record<string, string> = { war: 'Chiến tranh', law: 'Luật', state: 'Nhà nước', diplomacy: 'Ngoại giao', succession: 'Kế vị', revolution: 'Cách mạng', economy: 'Kinh tế', territory: 'Lãnh thổ', tech: 'Công nghệ', event: 'Sự kiện', decision: 'Quyết định', disaster: 'Thiên tai' };

export const lawVi = (v: string) => LAW_VI[v] ?? v.replace(/_/g, ' ');
export const govVi = (v: string) => GOV_VI[v] ?? v.replace(/_/g, ' ');
export const techName = (id: string) => TECH_VI[id] ?? id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
// Technology names (UI copy). Ids without a translation fall back to a readable form of the id.
export const TECH_VI: Record<string, string> = {
  mechanized_spinning: 'Kéo sợi cơ giới', steam_engines: 'Động cơ hơi nước', puddling_iron: 'Luyện sắt khuấy', coke_smelting: 'Luyện gang bằng than cốc', railways: 'Đường sắt', steamships: 'Tàu hơi nước',
  mechanical_reaper: 'Máy gặt cơ khí', telegraph: 'Điện báo', chemical_fertilizers: 'Phân bón hóa học', interchangeable_parts: 'Linh kiện lắp lẫn', bessemer_steel: 'Thép Bessemer', oil_refining: 'Lọc dầu',
  open_hearth: 'Lò bằng (Siemens–Martin)', refrigeration: 'Làm lạnh', electricity: 'Điện', internal_combustion: 'Động cơ đốt trong', assembly_line: 'Dây chuyền lắp ráp',
  percussion_caps: 'Kíp nổ', general_staff: 'Bộ tổng tham mưu', rifled_muskets: 'Súng nòng xoắn', breech_loading_rifles: 'Súng trường nạp hậu', rifled_artillery: 'Pháo nòng xoắn', ironclads: 'Tàu bọc sắt',
  railway_mobilization: 'Động viên bằng đường sắt', quinine_prophylaxis: 'Dự phòng bằng quinine', machine_guns: 'Súng máy', smokeless_powder: 'Thuốc súng không khói', steel_warships: 'Chiến hạm thép',
  quick_firing_artillery: 'Pháo bắn nhanh', dreadnoughts: 'Thiết giáp hạm dreadnought', joint_stock_banking: 'Ngân hàng cổ phần', public_schooling: 'Trường học công', steam_press: 'Máy in hơi nước',
  public_health: 'Y tế công cộng', anesthesia: 'Gây mê', germ_theory: 'Thuyết vi trùng', telephone: 'Điện thoại', socialist_thought: 'Tư tưởng xã hội chủ nghĩa',
};

// ---------------------------------------------------------------- numbers (vi-VN: "." thousands, "," decimals)
const nf = new Map<number, Intl.NumberFormat>();
export function fmt(v: number, dp = 0): string {
  let f = nf.get(dp); if (!f) { f = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: dp, maximumFractionDigits: dp }); nf.set(dp, f); }
  return f.format(v);
}
export function compact(v: number): string {
  const a = Math.abs(v);
  if (a >= 1e9) return `${fmt(v / 1e9, a >= 1e11 ? 0 : 1)} tỷ`;
  if (a >= 1e6) return `${fmt(v / 1e6, a >= 1e8 ? 0 : 1)} tr`;
  if (a >= 1e4) return `${fmt(v / 1e3, 0)} N`;
  return fmt(v, 0);
}
export const money = (v: number) => `¤ ${compact(v)}`;
export const pct = (v: number, dp = 0) => `${fmt(v * 100, dp)}%`;
export const signedPct = (v: number, dp = 0) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${fmt(Math.abs(v) * 100, dp)}%`;
export const monthName = (m: number) => `Tháng ${m}`;
