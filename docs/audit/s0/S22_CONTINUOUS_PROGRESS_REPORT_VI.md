# BÁO CÁO TIẾN ĐỘ TÍCH LŨY — VICTORI3 MOBILE / S22

**Ngày cập nhật:** 19/11/2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**HEAD trước commit báo cáo:** ecdfcfa4ff7b3b4310c36219951290bbbe1c4c26  
**Chế độ báo cáo:** rolling report — mọi lượt làm xong phải append một progress entry mới; không tạo báo cáo rời nếu không cần thiết.

> Đây là báo cáo điều phối và tự kiểm toán của ChatGPT. Không phải Claude REVIEW_PASS, không phải owner ACCEPTED, không phải bằng chứng S1/S22 đã mở. Mọi research candidate chưa được owner chấp nhận vẫn là tài liệu nghiên cứu, không phải game data đã duyệt.

## 1. Trạng thái tổng quan

| Hạng mục | Trạng thái |
|---|---|
| S22 kiến trúc / design | DESIGN_ONLY; §§14.1–14.15 đã mở rộng |
| Code baseline self-audit | SA-01–SA-12 đã ghi nhận |
| Traceability | Có báo cáo nối SA-01–SA-12 vào thiết kế |
| Implementation test matrix | Đã lập test plan; chưa tạo/chạy test code |
| Event research | Đã rà 9 event hiện tại và thêm 1 candidate global drought |
| Hydrogen follow-up | Đã cập nhật research brief để yêu cầu kiểm chứng độc lập |
| Claude review | Request đã chuẩn bị; chưa có verdict |
| S1 / S22 runtime authorization | Vẫn đóng theo gate của repository |
| Engine/data/save/test/UI/APK changes | Không có thay đổi trong lượt này |
| Build/CI/device test | Không chạy |

## 2. Các công việc kỹ thuật đã hoàn thành trước lượt này

### 2.1. Thiết kế S22

Thiết kế S22 được mở rộng tới §14.14. Các hợp đồng quan trọng:
- Event taxonomy và causal gating; tách physical forcing, biological hazard, human-mediated discovery, institutional/political process, decision opportunity, benchmark và narrative log.
- Historical/Sandbox contract với cùng snapshot 1836 và cùng simulation pipeline; không railroading sau khi preconditions lịch sử đã thay đổi.
- Rank condition semantics, bounded historical prior, pending decision lifecycle, command-boundary validation và atomic effects.
- Source-date precision riêng với monthly effective tick.
- Milestone scoring có provisional/grace state, pending không bị tính là resolved miss.
- Regional indicator isolation; Africa-specific metric không được trở thành global actor class.
- Closed condition/effect/event/structural-rule schemas; recursive validation và path diagnostics.
- Structural-rule source-of-truth, RNG stream isolation, save compatibility, event scheduler indexing và Android profiling.
- Predicate semantics và effect contracts cụ thể.

**Exact design:** commit 4b8efe94a4f37ad878c15bb4fa6a08d1c205af83; blob fbbad73aae57a26a52aefadc630c8b6cb340040c.

### 2.2. Code findings

Báo cáo code-baseline self-audit ghi nhận 12 finding:
- SA-01: rank_at_most luôn trả true trong evaluator đang kiểm.
- SA-02: AI decision score bị historical weight chi phối mạnh, thiếu utility hiện tại.
- SA-03: pending decision có thể bị consume trước khi validate option/preconditions/effects.
- SA-04: effect records mở; có nhánh ig_approval no-op và không có atomic validation đầy đủ.
- SA-05: compiled benchmarks bỏ provenance/units/method.
- SA-06: annual metrics và coverage còn hẹp, thiếu decentralized/non-state actors.
- SA-07: Europe-specific predicate có nguy cơ bị dùng như global class.
- SA-08: day-level source dates bị collapse về monthly tick/log day 01.
- SA-09: pending milestone trong grace period bị tính vào denominator quá sớm.
- SA-10: Condition type/payload mở và validator chưa áp dụng đồng nhất.
- SA-11: structural-rule record được compile nhưng runtime có hành vi Salic hard-coded riêng; source target HAN nhưng runtime loop áp rộng hơn lên personal unions của GBR.
- SA-12: event/decision/effect payloads thiếu closed schemas, range/date/target/provenance validation.

**Exact code self-audit blob:** 791ac317444fc660a9bcc45a11c6b30ff217b278.  
**Exact traceability report blob:** 2671216d760efc4245db47b7bc3cc3d1613494be.

Các finding này là phân tích code, không phải defect đã được sửa. Chưa có runtime patch.

### 2.3. Test plan và Claude package

- Implementation test matrix: docs/audit/s0/S22_IMPLEMENTATION_TEST_MATRIX_2026-11-18.md; blob 8c973460cf9333f003490154056e28c7e01353a9.
- Claude no-write request: docs/audit/s0/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md; request commit 77483993cff15ee8a78aecaae249631c3444ea2b.
- Test matrix có scenario cho conditions, ranking, decision lifecycle, effect atomicity, structural rules, hazards, calibration, determinism, save migration và Android performance. Đây là plan, không phải test result.

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

1. Hydrogen đối chiếu độc lập 13 evidence requests và bổ sung source locators; không chấp nhận các candidate chỉ vì ChatGPT đã ghi.
2. ChatGPT review kết quả Hydrogen, xử lý disagreement và cập nhật cùng thư mục này.
3. Claude, khi có quota, review đúng design blob fbbad73aae57a26a52aefadc630c8b6cb340040c và supporting audit/test matrix; review phải no-write.
4. Sau independent review và owner gate decision, mới xác định slice triển khai được mở. Mọi code change phải có exact base SHA, scope, test evidence và rollback plan.
5. Mỗi lần làm xong một phần, append một mục mới vào báo cáo này và cập nhật AI_HANDOFF.md; không tạo bản tiến độ rời trừ khi cần artifact chuyên biệt.

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
