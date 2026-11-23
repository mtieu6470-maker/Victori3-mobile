// Vietnamese UI strings and number formatting. Glossary decisions (see docs/ui/UI_DESIGN_SYSTEM.md §8):
// "Lớp bản đồ" (never "Lens"), "Chỉ số giá" (1,00 = giá gốc), "¤" = engine currency unit (Maddison 1990 GK$ scale).
import { REFORMABLE_LAWS } from '../../engine/laws';
import type { LawGroup } from '../../engine/data/dbTypes';
import type { IG } from '../../engine/types';

export const LAW_VI: Record<string, string> = {
  autocracy: 'Chuyên chế', oligarchy: 'Đầu sỏ', census_suffrage: 'Bầu cử theo tài sản', universal_male_suffrage: 'Phổ thông đầu phiếu nam', universal_suffrage: 'Phổ thông đầu phiếu', one_party_state: 'Nhà nước độc đảng', theocracy: 'Thần quyền', tribal_council: 'Hội đồng bộ lạc',
  monarchy: 'Quân chủ', republic: 'Cộng hòa', colonial_company: 'Công ty thuộc địa', chiefdom: 'Tù trưởng',
  traditionalism: 'Truyền thống', mercantilism: 'Trọng thương', interventionism: 'Can thiệp', laissez_faire: 'Tự do kinh doanh', command_economy: 'Kinh tế chỉ huy',
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
  // TECH-01: names from the CG-28 technology catalogue (descriptive, original wording).
  vulcanized_rubber: 'Lưu hóa cao su',
  sewing_machine: 'Máy may khóa mũi',
  dynamo: 'Máy phát điện cảm ứng/dynamo',
  dynamite: 'Dynamite công nghiệp',
  oil_drilling: 'Khoan dầu thương mại hiện đại',
  urban_metro: 'Tàu điện ngầm đô thị',
  transatlantic_cable: 'Cáp điện tín xuyên Đại Tây Dương',
  reinforced_concrete: 'Bê tông cốt thép',
  transcontinental_railways: 'Đường sắt xuyên lục địa',
  machine_tools: 'Máy công cụ thay dao nhanh',
  antiseptic_surgery: 'Phẫu thuật sát trùng',
  electric_lighting: 'Đèn sợi đốt thực dụng',
  steel_plough: 'Máy cày thép',
  central_power_stations: 'Nhà máy điện trung tâm',
  large_steel_casting: 'Đúc thép quy mô lớn',
  standard_time: 'Hệ thống múi giờ đường sắt',
  telegraphic_exchanges: 'Sở giao dịch điện tín',
  sound_recording: 'Máy ghi và phát âm thanh',
  steam_turbines: 'Tuabin hơi phát điện',
  aluminium_electrolysis: 'Quy trình Hall–Héroult',
  rabies_vaccine: 'Vaccine bệnh dại',
  pneumatic_tyres: 'Lốp khí nén',
  diesel_engine: 'Động cơ diesel',
  motor_cars: 'Ô tô chạy xăng thương mại',
  hydroelectric_power: 'Thủy điện quy mô lớn',
  radio_telegraphy: 'Vô tuyến điện báo',
  x_ray_diagnosis: 'Chụp X-quang chẩn đoán',
  high_speed_steel: 'Thép tốc độ cao',
  tractors: 'Máy kéo động cơ đốt trong',
  punched_card_tabulation: 'Máy lập bảng thẻ đục lỗ',
  vacuum_tubes: 'Ống chân không diode/triode',
  powered_flight: 'Máy bay có động cơ',
  diesel_electric_submarines: 'Tàu ngầm diesel-điện',
  scientific_management: 'Quản trị khoa học công nghiệp',
  central_banking: 'Ngân hàng trung ương hiện đại',
  tanks: 'Xe tăng chiến trường',
  nitrogen_fixation: 'Cố định nitơ Haber–Bosch',
  synthetic_polymers: 'Polymer tổng hợp quy mô công nghiệp',
  hybrid_maize: 'Lai tạo ngô ưu thế lai',
  television: 'Truyền hình điện tử',
  nylon: 'Nylon thương mại',
  radar: 'Radar phát hiện mục tiêu',
  antibiotics: 'Penicillin và kháng sinh đầu tiên',
  national_accounts: 'Kế toán quốc gia hiện đại',
  jet_aircraft: 'Máy bay phản lực',
  high_yield_wheat: 'Giống lúa mì năng suất cao',
  transistor: 'Transistor bán dẫn',
  ballistic_missiles: 'Tên lửa đạn đạo tầm xa',
  nuclear_power: 'Phản ứng phân hạch hạt nhân',
  dna_structure: 'Cấu trúc xoắn kép DNA',
  synthetic_pesticides: 'Thuốc trừ sâu tổng hợp',
  nuclear_weapons: 'Vũ khí hạt nhân',
  integrated_circuit: 'Mạch tích hợp',
  polio_vaccine: 'Vaccine bại liệt',
  containerisation: 'Container vận tải tiêu chuẩn',
  high_speed_rail: 'Đường sắt cao tốc',
  combine_harvesters: 'Máy gặt đập liên hợp',
  organ_transplants: 'Ghép tạng',
  orbital_reconnaissance: 'Vệ tinh trinh sát quỹ đạo',
  high_yield_rice: 'Giống lúa năng suất cao',
  microprocessor: 'Vi xử lý đơn chip',
  packet_networks: 'Mạng chuyển mạch gói',
  electronic_payments: 'Mạng thanh toán điện tử liên ngân hàng',
  drip_irrigation: 'Tưới nhỏ giọt',
  solar_photovoltaics: 'Pin mặt trời silicon',
  ct_scanning: 'Chụp cắt lớp CT',
  wind_turbines: 'Tua-bin gió nối lưới',
  mri_imaging: 'Chụp cộng hưởng từ',
  precision_munitions: 'Đạn dẫn đường chính xác',
  pcr_amplification: 'PCR khuếch đại DNA',
  tissue_culture: 'Nuôi cấy mô thực vật',
  internet: 'Internet liên mạng',
  world_wide_web: 'World Wide Web',
  mobile_networks: 'Mạng di động số',
  lithium_ion_batteries: 'Pin lithium-ion',
  enterprise_software: 'Phần mềm quản trị doanh nghiệp tích hợp',
  gm_crops: 'Cây trồng biến đổi gen',
  tactical_uavs: 'UAV trinh sát chiến thuật',
  genome_sequencing: 'Giải trình tự bộ gene',
  smartphones: 'Điện thoại thông minh',
  electric_vehicles: 'Xe điện pin lithium',
  deep_learning: 'Học sâu tăng tốc GPU',
  precision_agriculture: 'Nông nghiệp chính xác',
  mobile_payments: 'Thanh toán di động',
  grid_storage: 'Pin lưu trữ quy mô lưới',
  immunotherapy: 'Liệu pháp miễn dịch',
  network_warfare: 'Hệ thống tác chiến mạng',
  mrna_vaccines: 'Vaccine mRNA',
  transformer_ai: 'Kiến trúc Transformer',
  combat_drones: 'UAV thương mại chuyển dụng quân sự',
  crispr_crops: 'Chỉnh sửa gen CRISPR cây trồng',
  autonomous_vehicles: 'Xe tự hành',
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

// CO-1b: Vietnamese names of company kinds (CG-32 map; project wording).
export const COMPANY_KIND_VI: Record<string, string> = {
  agricultural_implements_maker: 'Hãng nông cụ',
  agricultural_machine_maker: 'Hãng máy nông nghiệp',
  agritech_services: 'Dịch vụ nông nghiệp công nghệ cao',
  aircraft_manufacturer: 'Hãng chế tạo máy bay',
  aluminium_smelter: 'Nhà máy luyện nhôm',
  audit_and_statistics_service: 'Dịch vụ kiểm toán và thống kê',
  automobile_manufacturer: 'Hãng ô tô',
  autonomous_mobility_operator: 'Hãng vận tải tự hành',
  battery_manufacturer: 'Hãng sản xuất pin',
  biomedical_research_firm: 'Công ty nghiên cứu y sinh',
  biotech_seed_company: 'Công ty giống công nghệ sinh học',
  broadcast_television_company: 'Đài truyền hình',
  civil_engineering_contractor: 'Nhà thầu công trình dân dụng',
  coke_furnace_works: 'Xưởng lò luyện than cốc',
  cold_chain_carrier: 'Hãng vận tải chuỗi lạnh',
  commercial_seed_producer: 'Công ty giống thương mại',
  container_logistics: 'Hãng logistics container',
  crop_protection_firm: 'Công ty bảo vệ thực vật',
  data_network_operator: 'Nhà mạng dữ liệu',
  data_processing_bureau: 'Văn phòng xử lý dữ liệu',
  diagnostics_company: 'Công ty chẩn đoán',
  diesel_engine_maker: 'Hãng động cơ diesel',
  electric_utility: 'Công ty điện lực',
  electric_vehicle_manufacturer: 'Hãng xe điện',
  electrical_equipment_maker: 'Hãng thiết bị điện',
  engine_manufacturer: 'Hãng động cơ',
  enterprise_software_vendor: 'Hãng phần mềm doanh nghiệp',
  fertilizer_producer: 'Nhà máy phân bón',
  foundation_model_services: 'Công ty mô hình AI nền tảng',
  gene_edited_seed_company: 'Công ty giống chỉnh sửa gen',
  generator_manufacturer: 'Hãng máy phát điện',
  genomics_lab: 'Phòng thí nghiệm hệ gen',
  grid_storage_operator: 'Công ty lưu trữ điện lưới',
  harvester_manufacturer: 'Hãng máy gặt đập',
  heavy_casting_firm: 'Xưởng đúc nặng',
  high_speed_rail_operator: 'Công ty đường sắt cao tốc',
  hydropower_utility: 'Công ty thủy điện',
  immunotherapy_developer: 'Công ty liệu pháp miễn dịch',
  industrial_ammonia_producer: 'Nhà máy amoniac công nghiệp',
  industrial_explosives_firm: 'Công ty thuốc nổ công nghiệp',
  industrial_management_consultancy: 'Công ty tư vấn quản trị công nghiệp',
  integrated_circuit_fab: 'Nhà máy vi mạch',
  integrated_steelworks: 'Liên hợp gang thép',
  internet_service_operator: 'Nhà cung cấp Internet',
  irrigation_equipment_firm: 'Hãng thiết bị tưới tiêu',
  jet_aircraft_manufacturer: 'Hãng máy bay phản lực',
  joint_stock_bank: 'Ngân hàng cổ phần',
  lighting_equipment_maker: 'Hãng thiết bị chiếu sáng',
  long_distance_rail_operator: 'Công ty đường sắt đường dài',
  machine_learning_services: 'Công ty dịch vụ học máy',
  machine_tool_maker: 'Hãng máy công cụ',
  mass_production_firm: 'Hãng sản xuất hàng loạt',
  mechanised_textile_mill: 'Công ty dệt cơ giới',
  medical_imaging_manufacturer: 'Hãng thiết bị chẩn đoán hình ảnh',
  medical_scanner_manufacturer: 'Hãng máy quét y tế',
  microprocessor_fab: 'Nhà máy vi xử lý',
  mobile_carrier: 'Nhà mạng di động',
  mobile_payment_processor: 'Công ty thanh toán di động',
  mrna_vaccine_manufacturer: 'Hãng vaccine mRNA',
  nuclear_utility: 'Công ty điện hạt nhân',
  oil_extraction_firm: 'Công ty khai thác dầu',
  open_hearth_steelworks: 'Nhà máy thép lò bằng',
  payment_processor: 'Công ty xử lý thanh toán',
  petroleum_refiner: 'Nhà máy lọc dầu',
  pharmaceutical_manufacturer: 'Hãng dược phẩm',
  plant_tissue_culture_lab: 'Phòng nuôi cấy mô thực vật',
  polymer_manufacturer: 'Nhà máy polymer',
  precision_parts_manufacturer: 'Hãng linh kiện chính xác',
  railway_operator: 'Công ty đường sắt',
  recording_media_firm: 'Hãng ghi âm',
  regulated_clearing_bank: 'Ngân hàng thanh toán bù trừ',
  rice_seed_producer: 'Công ty giống lúa',
  rubber_processor: 'Xưởng chế biến cao su',
  seed_breeder: 'Công ty lai tạo giống',
  semiconductor_components_firm: 'Hãng linh kiện bán dẫn',
  sewing_machine_maker: 'Hãng máy may',
  smartphone_manufacturer: 'Hãng điện thoại thông minh',
  solar_module_manufacturer: 'Hãng tấm pin mặt trời',
  specialist_hospital_operator: 'Hệ thống bệnh viện chuyên khoa',
  specialty_steelmaker: 'Nhà máy thép đặc chủng',
  steam_engine_foundry: 'Xưởng đúc máy hơi nước',
  steamship_carrier: 'Hãng tàu hơi nước',
  submarine_cable_operator: 'Công ty cáp ngầm',
  synthetic_fibre_producer: 'Nhà máy sợi tổng hợp',
  telegraph_finance_service: 'Dịch vụ tài chính điện tín',
  telegraph_network: 'Công ty điện báo',
  telephone_operator: 'Công ty điện thoại',
  tractor_manufacturer: 'Hãng máy kéo',
  turbine_manufacturer: 'Hãng tuabin',
  tyre_manufacturer: 'Hãng lốp xe',
  urban_transit_operator: 'Công ty giao thông đô thị',
  vaccine_manufacturer: 'Hãng vaccine',
  vacuum_tube_maker: 'Hãng đèn điện tử',
  web_service_company: 'Công ty dịch vụ web',
  wind_turbine_operator: 'Công ty điện gió',
  wireless_telegraph_operator: 'Công ty vô tuyến điện báo',
  wrought_iron_works: 'Xưởng sắt rèn',
};
export const companyKindName = (id: string) => COMPANY_KIND_VI[id] ?? id.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
