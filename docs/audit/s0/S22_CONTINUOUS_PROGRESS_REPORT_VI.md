# BÁO CÁO TIẾN ĐỘ TÍCH LŨY — VICTORI3 MOBILE / S22

**Ngày cập nhật:** 19/11/2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**HEAD được xác minh trước lần đồng bộ này:** f2db3c23c6c28d3bf58b526da4170c3419e37d0b  
**Chế độ báo cáo:** rolling report — mọi lượt làm xong phải append một progress entry mới; không tạo báo cáo rời nếu không cần thiết.

> Đây là báo cáo điều phối và tự kiểm toán của ChatGPT. Không phải Claude REVIEW_PASS, không phải owner ACCEPTED, không phải bằng chứng S1/S22 đã mở. Mọi research candidate chưa được owner chấp nhận vẫn là tài liệu nghiên cứu, không phải game data đã duyệt.

## 1. Trạng thái tổng quan

| Hạng mục | Trạng thái hiện tại tại HEAD đã xác minh |
|---|---|
| Nhánh / HEAD | `claude/game-historical-sandbox-modes-kg7rj7` / `f2db3c23c6c28d3bf58b526da4170c3419e37d0b` |
| S22 architecture | `DESIGN_ONLY`; design §§14.1–14.15 đã cập nhật |
| Code self-audit | SA-01–SA-13; chưa có finding nào được coi là đã sửa |
| Traceability | Có mapping SA-01–SA-13 → design clauses; design coverage only |
| Test matrix | Có test plan; bổ sung GEO-01–GEO-10 và BEN-11–BEN-18; chưa có test code/result S22 |
| Event research | 9 event records được rà soát + 1 global-drought candidate; còn open evidence requests |
| Benchmark research | 181 × 6 CoW entity/metric matrix (1,086 rows) và 160 Maddison 2010 unit rows |
| Hydrogen research | Request đã cập nhật; independent deliverables chưa được nhận/kiểm chứng trong hồ sơ hiện tại |
| Claude review | No-write request đã pin chính xác; verdict chưa có |
| S0 overall | G0.7 `BLOCKED`, G0.8 `PARTIAL`, G0.9 `BLOCKED` theo gate ledger |
| S1 transition | `NOT_STARTED`; signoff còn draft, chưa có independent REVIEW_PASS + owner ACCEPTED |
| S22 runtime authorization | `NONE`; S22 tiếp tục pre-implementation |
| Engine / historical runtime data / save schema / UI / Android / APK | Không thay đổi trong tranche S22 này |
| S22 build / tests / CI / device QA | Không chạy; không có status checks được trả về cho HEAD `f2db3c2` |

> Báo cáo này là technical coordination/self-audit, không phải independent review hay owner acceptance. Không dùng kết quả research candidate làm dữ liệu game đã duyệt.

## 2. Các công việc kỹ thuật đã hoàn thành trước lượt này

### 2.1. Thiết kế S22

Thiết kế S22 hiện mở rộng tới §§14.1–14.15. Các hợp đồng chính:

- Event taxonomy và causal gating: tách physical forcing, biological hazard, human-mediated discovery, institutional/political process, decision opportunity, benchmark và narrative log.
- Historical/Sandbox dùng cùng snapshot 1836 và cùng simulation pipeline; historical outcomes sau 1836 không được railroading khi preconditions đã đổi.
- Deterministic ranking context, bounded historical decision prior (giá trị đề xuất 0.05 utility points vẫn cần owner approval), pending-decision lifecycle, command-boundary validation và atomic effects.
- Source-date precision tách khỏi monthly effective tick; milestone có provisional/grace state.
- Regional indicators không được biến thành actor class toàn cầu; macro-region calibration cần taxonomy/crosswalk có phiên bản.
- Closed schemas cho conditions, decisions, effects, exogenous events và structural rules; recursive validation, diagnostics, provenance.
- Structural-rule source-of-truth, RNG stream isolation, save compatibility, event scheduler indexing và Android performance measurement.
- §14.15 bổ sung WorldRegionTaxonomy (12 stable IDs do owner phê duyệt), StrategicRegionGeography, HistoricalGeographicUnit, GeographicCrosswalk và PolityTerritoryMembership.
- Không suy ra macro-region từ tọa độ hoặc modern state; không nhân bản benchmark cấp quốc gia sang từng strategic region nếu thiếu crosswalk có căn cứ.

**Design hiện tại:** commit `df74ed35cbdb4161b531c9199bee1931e347f6c9`; blob `f0b326823c76a01c353ab30ef72ee550a3aae990`.

Design coverage không chứng minh runtime implementation, test pass hay owner approval.

### 2.2. Code findings

Code-baseline self-audit hiện ghi nhận **13 finding**; đây là finding phân tích nguồn, chưa phải các lỗi đã được sửa:

- SA-01: `rank_at_most` evaluator luôn trả true trong code được kiểm.
- SA-02: AI decision score bị historical weight chi phối mạnh, thiếu current utility.
- SA-03: pending decision có thể bị consume trước khi kiểm tra option/preconditions/effects.
- SA-04: effect records còn mở; có nhánh `ig_approval` no-op và thiếu atomic validation.
- SA-05: compiled benchmarks làm mất provenance/unit/method.
- SA-06: benchmark scope và polity classes còn hẹp, thiếu decentralized/local actors.
- SA-07: Europe-specific predicates có nguy cơ bị dùng như global class.
- SA-08: source dates theo ngày bị collapse vào monthly tick/log.
- SA-09: milestone còn trong grace period bị tính vào denominator quá sớm.
- SA-10: Condition type/payload chưa closed và validator chưa áp dụng đồng nhất.
- SA-11: structural rule được compile nhưng runtime Salic behavior còn hard-coded; source target HAN nhưng runtime loop ảnh hưởng rộng hơn tới personal unions của GBR.
- SA-12: event/decision/effect/exogenous payload chưa có closed schema và validation đầy đủ.
- SA-13 (P1): thiếu canonical 12-macro-region taxonomy và geographic crosswalk; không thể tái lập regional denominator. Đây là governance/calibration blocker, không chứng minh bản đồ thiếu đất/vùng.

**Code self-audit:** commit `acfc1e78b2097561dc10a2c1d9a7f7c136130fe9`; blob `8cf4fa017f321b1ca402da1117dc9c314b2faae7`.  
**Traceability supplement:** commit `17045b337a717dedcbf565bc3452aa9f512eeb99`; blob `d50eac10872e57c406a62d6dee48971fd1bf3cee`.

Mọi finding phải được kiểm chứng độc lập và gắn với exact code baseline trước khi triển khai remediation.

### 2.3. Test plan và Claude package

- **Implementation test matrix:** `docs/audit/s0/S22_IMPLEMENTATION_TEST_MATRIX_2026-11-18.md`; blob `8e6b518a637a954fc0c9a4f80b9c22c33c594704`. Đây là test specification, chưa phải test code hay test result.
- Matrix bao phủ conditions/ranking, decision lifecycle/effect atomicity, structural/exogenous events, calibration, deterministic RNG, save compatibility, Android performance, GEO-01–GEO-10 và BEN-11–BEN-18.
- **Claude no-write review request:** `docs/audit/s0/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`; latest request commit `5eb49c5ab6f8441bfbd75c6dea4b868d6469df4f`; blob `fc5565ce5e4ac556efafd3f6d1965006a589b5a6`.
- Review request pin one consistent evidence set: design `f0b326...`, traceability `d50eac...`, code audit `8cf4fa...`, test matrix `8e6b51...`, benchmark review `d2d510...`, entity matrix `9dd62f...`, Maddison matrix `f714e1...`.
- Request covers SA-01–SA-13 and §§14.1–14.15. Claude's independent verdict remains pending; this request does not authorize writes or runtime implementation.
- Hydrogen's latest research request update is commit `f7acf811b2bde6a1bca2f914fc73f09ac4e4d36a`, blob `2c40bc20136e1927822542dbd13fcc78070136e4`; independent event/benchmark findings remain pending.

## 3. Công việc mới hoàn thành trong lượt 19/11/2026

### 3.1. Rà soát 9 exogenous events hiện có

Đã đọc trực tiếp:
- historical_data/events/historical_events.json — blob 49fd720bca9eb86b705ad975b1edb9cf5d31a2e8.
- historical_data/borders/regions_1836.csv — blob 904bae66f03c36821e4f32d7526c61bd779d5c42.
- historical_data/sources/sources.json — blob 154f7d5f54cd2bd43d0adfcfb289fa7b75fefd84.

Đã đối chiếu với nguồn scholarly/institutional bên ngoài. Phát hiện chính:
1. Cholera 1836–37: không có căn cứ từ nguồn kiểm tra để coi 1836-06-01 là ngày khởi phát chung cho tất cả vùng Italy hiện ghi trong record; Naples có hai wave 1836–37.
2. Agra famine 1837–38: famine có cơ sở; cơ chế gồm drought, harvest failure, tax/market/water/relief và disease. Ngày tháng và yield-loss theo từng game region cần thêm evidence.
3. Potato blight 1845: lây lan theo wave; Flanders/continental Europe bị tác động trước mốc đầu tháng 9 của Ireland/Scotland. Một date áp cùng lúc chín vùng làm mất chronology.
4. Cholera 1846–60: periodization của pandemic thứ ba không chứng minh ngày 1847-06-01 và 12 vùng cùng bắt đầu đồng thời.
5. California gold: 24/01/1848 tại Sutter's Mill gần Coloma được NPS/California Geological Survey corroborate; discovery phải tách khỏi geological deposit, public announcement và actor access.
6. Victoria gold rush: First Nations đã biết vàng; Clunes European discovery năm 1850, official announcement July 1851. Record đang gọi discovery nhưng phù hợp hơn với public announcement/rush; DZ_AUS_SE không đại diện một Victoria colonial administration.
7. North China famine: 1876–79 tại Shanxi, Henan, Shandong, Zhili, Shaanxi; 5 region hiện có khớp rộng với 5 province. Ngày June 1876 cần date precision thận trọng.
8. Great Indian famine: Madras famine 1876–78 có căn cứ; các region và yield loss từng vùng vẫn cần crosswalk; không đại diện toàn bộ Global Famine.
9. Witwatersrand: phân biệt phát hiện nhỏ 1884 với payable Main Reef của George Harrison tại Langlaagte tháng 7/1886 và public diggings tháng 9/1886. Mapping về DZ_PEDI/NDE_MOS cần chứng minh.

### 3.2. Candidate global drought 1875–1878

Bài nghiên cứu khí hậu của Singh et al. (2018) xác định multi-year drought ở Asia, Brazil và Africa, cùng các vùng Australia/Southeast Asia trong một số mùa. Đây là candidate có giá trị cho phạm vi toàn cầu nhưng không nên tạo một event toàn thế giới có cùng ngày và cùng effect. Cần crosswalk từng vùng, mùa, lượng mưa và hậu quả xã hội riêng.

### 3.3. Gói nghiên cứu mới trên GitHub

Đã tạo thư mục:
docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_AND_CALIBRATION/

Tệp và content blobs:
- README_VI.md — 9 event review + global drought candidate; blob 448631ec01239ee2b796d269ccfb24d337e2154b.
- EVENT_CANDIDATES.csv — 9 records + 1 global drought candidate; blob af5b4efd366d19d504e08280a5b2c1f265c2d1d5.
- OPEN_EVIDENCE_REQUESTS.csv — 13 yêu cầu evidence còn mở; blob 922c181285b698c149976d24eeb4042ade7a9328.
- SOURCE_REGISTRY_DELTA.csv — 15 external source entries được đề xuất; blob da1da8524976aa01ddb11b5a1a38e21eb9b88b1b.

CSV structural check:
- EVENT_CANDIDATES: 11 data rows + header; 11 columns; all rows same width.
- OPEN_EVIDENCE_REQUESTS: 13 data rows + header; 7 columns; all rows same width.
- SOURCE_REGISTRY_DELTA: 15 data rows + header; 8 columns; all rows same width.

Đây chỉ là kiểm tra rectangular CSV. Không phải data schema validation của game, không phải source registry acceptance. Các source entries chưa được nhập vào historical_data/sources/sources.json.

### 3.4. Hydrogen research request

Đã append section 12 vào:
docs/research/GLOBAL_HISTORICAL_1836_1936/EVENTS_CALIBRATION_HYDROGEN_RESEARCH_REQUEST_2026-11-18.md

Hydrogen được yêu cầu kiểm chứng độc lập:
- từng wave cholera;
- từng vùng potato blight;
- Agra/North China/India famine footprint;
- First Nations prior knowledge và Victoria colonial/jurisdiction record;
- Coloma và Langlaagte spatial crosswalk;
- 1875–78 Global Drought tại Africa, Brazil, Australia, Southeast Asia;
- claim-level source locators và date precision.

Yêu cầu output gồm HYDROGEN_EVENT_EVIDENCE_REVIEW_VI.md, HYDROGEN_EVENT_EVIDENCE_MATRIX.csv, HYDROGEN_EVENT_SOURCE_DELTA.csv và HYDROGEN_EVENT_OPEN_GAPS.csv. Không được sửa runtime data hay code.

**Hydrogen request latest blob:** 79bbc914a3bfc6e67c2b9b070f521650fdefae9e.

## 4. Nguồn đối chiếu chính trong lượt mới

- Tanturri, RiMe — Two Sicilies cholera reaches 1836–37: https://rime.cnr.it/index.php/rime/article/view/584
- Forti Messina, 1976 — Naples two cholera waves 1836–37: https://www.persee.fr/doc/mefr_0223-5110_1976_num_88_1_2349
- Warren, 2026 — Agra famine 1836–38 and climate/colonial causes: https://doi.org/10.1016/j.jhg.2025.11.005
- Major, 2020 — Agra famine political/humanitarian context: https://www.cambridge.org/core/journals/journal-of-british-studies/article/abs/british-humanitarian-political-economy-and-famine-in-india-18381842/A5C1A7568D855B42DD03633E4AE60B8D
- Ristaino, 2026 — potato late blight historical spread: https://doi.org/10.1146/annurev-phyto-011325-113146
- Edgerton-Tarpley, 2008 — North China famine 1876–79: https://academic.oup.com/california-scholarship-online/book/20727/chapter-abstract/180103465
- Sami, 2011 — Madras famine mortality 1876–78: https://doi.org/10.1093/shm/hkq112
- Singh et al., 2018 — global drought/famine 1876–78: https://doi.org/10.1175/JCLI-D-18-0159.1
- US National Park Service — California Gold Rush, 24 Jan 1848: https://home.nps.gov/cali/learn/historyculture/california-gold-rush.htm
- Resources Victoria — First Nations knowledge, Clunes 1850, July 1851 announcement: https://resources.vic.gov.au/geology-and-data/minerals/metals/gold/gold-mining-in-victoria
- South African History Online — 1884 discoveries vs Harrison main reef 1886: https://sahistory.org.za/article/discovery-gold-1884

Rights note: at least one reviewed 2026 article carries CC BY-NC-ND terms. Citation/reference does not grant permission to adapt or redistribute article text/images. Rights must be recorded per source before assets/content are packaged.

## 5. Ranh giới thay đổi

Trong lượt mới này:
- Chỉ thêm research documents, CSV candidate matrices, source proposal list và Hydrogen request updates.
- Không sửa historical_events.json, regions_1836.csv, sources.json, generated db, engine, save schema, tests, UI, assets, Android, Gradle, workflows, signing hoặc APK.
- Không chạy build, unit tests, CI hay device test.
- Không tuyên bố SA-01–SA-12 đã được fix.
- S1/S22 tiếp tục đóng theo gate hiện có.

## 6. Việc tiếp theo trong cùng báo cáo

1. **Claude independent review (no-write):** review exact S22 design blob `f0b326823c76a01c353ab30ef72ee550a3aae990` và bộ supporting blobs được pin trong request; trả về `REVIEW_PASS` hoặc `CHANGES_REQUESTED`. Không coi ChatGPT self-audit là independent verdict.
2. **Hydrogen evidence audit:** kiểm chứng độc lập event chronology/causal class, CoW identifier reconciliation, MPD workbook/codebook, geographic crosswalk và license/rights; nếu không lấy được nguồn thì ghi rõ exact blocker, không tự suy ra.
3. **Owner decisions:** dùng bảng quyết định mở dưới đây làm danh sách chuẩn bị; các nhãn OD-S22 là mã theo dõi đề xuất của báo cáo, không phải decision ID chính thức và không có hiệu lực cho đến khi owner xác nhận.
4. **Implementation gate:** chỉ sau review và owner authorization cho một slice có exact base SHA, scope, test plan và rollback plan mới xem xét sửa code/data. S1 và S22 runtime vẫn đóng.
5. Mỗi tranche tiếp theo append vào chính báo cáo này và cập nhật AI_HANDOFF; không tạo báo cáo tiến độ rời.

### 6.1. S22 decision / evidence register — chưa được owner phê duyệt

| Mã theo dõi đề xuất | Nội dung cần chốt hoặc xác minh | Bằng chứng / phụ thuộc | Điều kiện đóng |
|---|---|---|---|
| OD-S22-01 | Canonical taxonomy: đúng 12 macro-region IDs, tên, inclusion rules, boundary reference và versioning | SA-13; §14.15; chưa tìm thấy taxonomy chuẩn trong schema/repository đã kiểm | Owner phê duyệt bằng văn bản; mọi strategic region được map hoặc ghi unresolved; không tự suy từ lat/lon/modern states |
| OD-S22-02 | Có dùng historical decision prior hay không; nếu có, mức trần và sensitivity policy | §14.11 đề xuất tối đa 0.05 absolute utility points trên normalized [0,1]; con số này chưa được suy ra từ evidence | Claude review; sensitivity analysis trên current-state utility; owner chấp thuận hoặc loại bỏ trước implementation |
| OD-S22-03 | Metric families, source quality tiers và metric-specific denominator cho calibration | CoW hiện tại 6 chỉ tiêu nhưng chỉ 4 field compile; Maddison units là present-day territories; các nguồn ngoài còn rights/crosswalk gaps | Hydrogen/Claude xác minh source, quality, scope, rights; owner phê duyệt metric set và missingness rules |
| OD-S22-04 | Quy tắc cân bằng global/regional và trọng số benchmark để Europe data density không lấn át khu vực thiếu dữ liệu | §12 decisions 3–5; SA-05/06/07/13; chưa thể tính regional denominator trước OD-S22-01 | Taxonomy + metric set đã chốt; scoring có regional coverage/missingness/uncertainty minh bạch; owner duyệt weights |
| OD-S22-05 | Mức multi-seed tối thiểu và holdout design | §12 decision 6; cần tách calibration/training khỏi validation/holdout; cần budget tính toán thực tế | Đề xuất seed-count dựa trên variance/stability và CI budget đo được; owner duyệt trước khi score được coi là nghiệm thu |
| OD-S22-06 | Tiêu chí “historical plausibility” khi alternate history rẽ khỏi trajectory thật | §12 decision 7; phải giữ player/AI agency, causality và không railroading | Claude đánh giá định nghĩa/acceptance cases; owner chốt tiêu chí, không lấy exact-path similarity làm mục tiêu duy nhất |
| OD-S22-07 | Versioning event rules/parameters và tương thích save | §12 decision 8; §14.12 yêu cầu lưu RNG/rule version; phụ thuộc S1 data/save foundation | S1 được review/owner ACCEPTED; schema/migration/version contract được duyệt; deterministic continuation tests được xây và pass |
| OD-S22-08 | Device performance envelope và worst-case caps cho event/decision processing | §14.12; G0.7 hiện BLOCKED, iQOO chưa có số đo, desktop dùng SwiftShader | G0.7 evidence trên thiết bị mục tiêu và minimum supported tier; owner duyệt budget p50/p95, heap, GC, nhiệt, pin và caps |

Các dòng trên phân biệt **quyết định sản phẩm**, **evidence review** và **phụ thuộc giai đoạn**; không được coi tất cả là một lần phê duyệt chung. OD-S22-07 không được dùng để lách cổng S1; OD-S22-08 không được dùng để tuyên bố hiệu năng mobile đã đạt khi thiếu device evidence.

---

## 7. Progress entries

### 2026-11-19 — Event evidence review and global drought candidate

- Rà soát 9 exogenous event records hiện có, region mapping liên quan và source IDs.
- Tạo research package EVENT_CANDIDATES, OPEN_EVIDENCE_REQUESTS và SOURCE_REGISTRY_DELTA.
- Phát hiện chronology/causal issues đáng chú ý: cholera 1836/1847 date scope, potato blight wave chronology, Victoria First Nations gold knowledge, Agra/India famine causality, Witwatersrand 1884 vs 1886, North China five-province mapping.
- Thêm Global Drought 1875–1878 làm research candidate đa khu vực, không phải runtime event.
- Cập nhật Hydrogen research brief với independent verification tasks.
- CSV widths checked; no build/tests/device run; no runtime/data changes.


### 2026-11-19 — Global benchmark coverage audit and source upgrade candidates

- Parsed five checked-in datasets and current entity registry; inspected the exact ETL selection in `tools/build-data.ts` and compiled type `HistoricalDB.benchmarks`.
- Checked-in CoW inputs contain 3,161 records across six indicator fields, 59 entity IDs and 17 sparse year points (1816–1914). The builder compiles only four fields (2,356 records), omitting 805 observations for urban population and military expenditure.
- Raw source locators are present for the inspected input rows, but the compile step drops the unit, source locator, collection method, note and related metadata; `dbTypes.ts` also has no field for uncertainty/scope/crosswalk in its benchmark record.
- Per-field quality/entity/year counts are recorded in `BENCHMARK_FIELD_COVERAGE.csv`. All 59 CoW extract entity IDs resolve in the registry, but the extract includes only 47 sovereign, 5 subject and 7 future entities. It has no complete coverage of 181 entities or decentralized/local actors. Five registry entities with CoW codes have no observation in these extracts (AFG, LUX, TRN, OFS, COS); three extracted IDs (ROM, NOR, ETH) have no CoW numeric code in the registry. Reconciliation is open; no IDs were substituted.
- Checked-in Maddison 2010 contains 574 population records / 94 present-day territorial units and 365 GDP-per-capita records / 66 units, eleven sparse years through 1913, all marked estimated. It has no direct stable-ID mapping to game polity registry. These are not 1836 polity totals without a documented territorial crosswalk.
- Official source research identified an upgrade path: CoW NMC v7.0 advertises annual six-indicator data from 1816–2022; MPD 2023 covers 169 countries and aggregate regions up to 2022 (CC BY 4.0 with citation obligations); HFS has many pre-1950 fiscal/trade/monetary data but explicit restrictions on database reproduction. The official releases need independent download/codebook/source-sheet/rights review before adoption.
- New benchmark artifacts:
  - `BENCHMARK_COVERAGE_REVIEW_VI.md` — review commit `54d7ccf674909508d230b90e88a687f1bd2916ff`.
  - `BENCHMARK_FIELD_COVERAGE.csv` — commit `fe7e92f5a5fd17a0133d48c7d4586274b2d419dc`.
  - `OPEN_BENCHMARK_COVERAGE_REQUESTS.csv` — commit `65ca464bdcbf7f18158454e2be1c9068232491ba`.
  - `BENCHMARK_SOURCE_CANDIDATES.csv` — commit `cf97c5496bbb5d5aee2b2219c062ed1328728e2a`.
- Updated `EVENTS_AND_CALIBRATION/README_VI.md` with benchmark package index (commit `bb6acac29031e210928aadec7ef61487d3ef391a`) and Hydrogen research request with independent NMC/MPD/HFS audit tasks (commit `030c667b72cfc9383d19a440a16c2d5b486b1c0a`).
- This is inventory/source research only. No external dataset was downloaded/imported; no canonical source registry, ETL, compiled DB, runtime data or code was changed. No build, tests, CI or device test was run.
- Global 12-macro-region calibration coverage remains OPEN because the reviewed project standard refers to twelve macro-regions but no canonical enumeration/mapping was found in the inspected standard section. Do not invent region assignments.

**External sources checked:**
- CoW NMC v7.0: https://correlatesofwar.org/data-sets/national-material-capabilities/
- Maddison Project Database 2023: https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023?lang=en ; DOI https://doi.org/10.34894/INZBF2
- Historical Financial Statistics: https://centerforfinancialstability.org/hfs.php ; Data Notes https://centerforfinancialstability.org/hfs/Data_notes.pdf


### 2026-11-19 — SA-13: canonical twelve-macro-region taxonomy gap

- Đối chiếu yêu cầu “12 macro-region” trong GLOBAL_HISTORICAL_MODE_FIDELITY_STANDARD_VI.md với schema RegionRecord, political entity registry và regions_1836.csv.
- Trong các schema/file được kiểm tra không thấy macroRegionId, versioned taxonomy hoặc source-geography crosswalk. Search trong repository cho 12 macro-region/macro_region/world_regions cũng không tìm thấy canonical taxonomy.
- Thêm finding SA-13 (P1) vào code-baseline self-audit; đây là thiếu hụt khả năng xác định denominator cho calibration, không phải bằng chứng rằng bản đồ game thiếu vùng đất.
- Bổ sung §14.15: WorldRegionTaxonomy (12 stable IDs), StrategicRegionGeography, HistoricalGeographicUnit, GeographicCrosswalk và PolityTerritoryMembership. Tách physical macro-region assignment khỏi political ownership; source observations không có crosswalk thì giữ nguyên scope và không được nhân bản sang các region.
- Bổ sung 10 test cases GEO-01–GEO-10 cho taxonomy owner-approved, mapping đầy đủ, crosswalk thời gian, split/merge, no silent equal split, border changes, missing regions và version migration.
- Cập nhật Claude independent review request để kiểm tra SA-13 và đúng design blob mới. Claude verdict vẫn pending.
- Không tự đặt tên 12 macro-region, không sửa RegionRecord/registry/regions CSV runtime, không tạo mapping suy đoán. Owner phải phê duyệt taxonomy và boundary semantics trước khi claim regional coverage.
- Thiết kế mới: commit df74ed35cbdb4161b531c9199bee1931e347f6c9; blob f0b326823c76a01c353ab30ef72ee550a3aae990.
- Self-audit SA-13: commit acfc1e78b2097561dc10a2c1d9a7f7c136130fe9; blob 8cf4fa017f321b1ca402da1117dc9c314b2faae7.
- Traceability update: commit 17045b337a717dedcbf565bc3452aa9f512eeb99; blob d50eac10872e57c406a62d6dee48971fd1bf3cee.
- Test matrix update: commit 4bc7dfc31905d74a0877368c11a79acac575b80b; blob f0a577ee6ced8428722556b69c613aa0fbd0c3fb.
- Claude request update: commit f78ecf4e89296d26c26e39bd678a6e0c8e9b5a47; blob bea8f7d89c9884cfc0a827d74ccfa85f7c46ed8c.

**Trạng thái gate:** S1/S22 vẫn đóng. Không có runtime/data/test/schema/Android/APK sửa đổi; chưa chạy build/test/CI/device QA.


### 2026-11-19 — SA-13 taxonomy contract and external dataset retrieval check

- Thêm SA-13 (P1) về thiếu canonical twelve-macro-region taxonomy/denominator trong schema địa lý được kiểm tra.
- Thiết kế §14.15 đã xác định các khái niệm WorldRegionTaxonomy, StrategicRegionGeography, HistoricalGeographicUnit, GeographicCrosswalk và PolityTerritoryMembership; yêu cầu owner phê duyệt chính xác 12 stable IDs/boundaries trước khi claim regional completeness.
- Claude review request đã được cập nhật để kiểm tra SA-13, design §14.15 và test cases GEO-01–GEO-10. Claude vẫn chưa đưa verdict.
- Đã thử truy xuất workbook MPD 2023 từ liên kết Excel chính thức của Groningen/Dataverse. Dataverse redirect sang signed object-store URL; download trong phiên này thất bại. Vì vậy chưa có row-level MPD 2023 audit, chưa tải workbook và chưa nhập dữ liệu. Các kết luận về MPD 2023 trong hồ sơ hiện chỉ dựa metadata/tài liệu chính thức.
- Không đặt ra tên 12 vùng, không tự gán macro-region, không import benchmark mới. Owner taxonomy decision và Hydrogen source audit còn mở.
- No runtime/schema/data/test/build changes; S1/S22 remain closed.


### 2026-11-19 — Entity-level benchmark missingness matrices

- Added `BENCHMARK_ENTITY_METRIC_COVERAGE.csv`: 181 registry entities × 6 CoW metric fields = 1,086 rows. 322 entity/metric rows have observations; 764 are explicit missing rows. 59 entities have at least one CoW metric. No duplicate entity/metric/date records were found in the inspected input matrix. Missingness remains explicit, never a numeric zero.
- Added `MADDISON_2010_UNIT_COVERAGE.csv`: 160 rows (94 population present-day territorial units + 66 GDP-per-capita units), with exact year lists, estimated quality and source locator counts. These source units have no direct stable-ID match to 1836 registry; no automatic crosswalk was attempted.
- Verified both new CSVs are rectangular: entity matrix 1,086 × 18; Maddison unit matrix 160 × 13.
- Updated package README to index the matrices and updated Hydrogen's research request to independently verify entity/cow crosswalk and missingness (request update commit `f7acf811b2bde6a1bca2f914fc73f09ac4e4d36a`).
- Expanded S22 test matrix with BEN-11–BEN-18 for full entity/metric enumeration, explicit missing rows, CoW code reconciliation, Maddison geographic scope, two omitted CoW fields, raw-to-compiled reconciliation and quality preservation (test-plan update commit `ad227f40a26d8c760992ed315c0014c6187f29ad`).
- No runtime or source benchmark values were altered; these matrices describe the checked-in input only. No data import, build, test, CI or device run.


### 2026-11-19 — Final review pointer consistency pass

- Phát hiện Claude request còn một đoạn chỉ định design/traceability blob cũ dù phần đầu đã được cập nhật. Đã thay đoạn đó bằng một bộ pointer duy nhất cho design §§14.1–14.15, code self-audit, traceability, test matrix, benchmark review, entity-metric matrix và Maddison unit matrix.
- Đã kiểm tra request mới không còn chứa hai SHA cũ (fbbad73... và 2671216...) ở vị trí target/supporting evidence; request content blob mới fc5565ce5e4ac556efafd3f6d1965006a589b5a6.
- Review request update commit: 5eb49c5ab6f8441bfbd75c6dea4b868d6469df4f.
- No code/data changes and no tests/build/CI/device run.


### 2026-11-19 — Governance gate and cumulative-report consistency pass

- Re-fetched branch ref and confirmed pre-update HEAD `f2db3c23c6c28d3bf58b526da4170c3419e37d0b`; repository still uses `claude/game-historical-sandbox-modes-kg7rj7` as the default/only observed development branch.
- Reconciled the top-level rolling-report summary with the append-only history: S22 design is §§14.1–14.15; code self-audit is SA-01–SA-13; test matrix includes GEO-01–GEO-10 and BEN-11–BEN-18; current Claude request and exact support blobs are pinned.
- Re-read `S0_GATE_LEDGER.csv`: G0.1–G0.6 are recorded PASS, G0.7 BLOCKED, G0.8 PARTIAL, and full-S0 G0.9 BLOCKED. Re-read `S0_SIGNOFF.md`: it remains DRAFT, with independent reviewer and owner decision fields unchecked/blank. Therefore S1 remains NOT_STARTED.
- Re-verified the S22 Claude request is no-write and runtime authorization NONE. No independent Claude verdict is recorded in the reviewed request.
- GitHub combined commit status returned an empty status list for pre-update HEAD; no open PR was found for the current branch. Empty status list is not a CI pass.
- Corrected this report's current-state table and exact design/audit/test/review pointers; rewrote the next-step list to distinguish independent review, Hydrogen research, owner decisions and implementation authorization.
- No engine, historical runtime data, source registry, benchmark values, ETL, save schema, test code, UI, assets, Android, Gradle, workflow, signing, APK or runtime changes. No build/test/CI/device QA was run in this tranche.


### 2026-11-19 — S22 owner-decision and evidence register

- Extracted the eight explicit open questions in design §12 and the additional normative gates in §§14.11, 14.12 and 14.15.
- Added a structured decision/evidence register to this same rolling report: proposed tracking labels OD-S22-01–OD-S22-08 cover 12-region taxonomy, historical decision prior, benchmark dimensions/denominators, regional weighting, multi-seed/holdout policy, alternate-history plausibility, versioning/save dependency and device performance envelope.
- Each row distinguishes owner product decisions from independent evidence review and upstream S1/G0.7 dependencies. The OD labels are report-local tracking aids only, not formal owner decision IDs and not approvals.
- No taxonomy names/boundaries, benchmark weights, seed count or numeric performance budget were invented or applied. No code/data/schema changes or tests/build/CI/device run.
