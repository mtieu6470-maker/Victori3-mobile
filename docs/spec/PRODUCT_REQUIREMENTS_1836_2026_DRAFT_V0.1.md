# PRODUCT REQUIREMENTS — VICTORI3 MOBILE 1836–2026 (DRAFT v0.1)

**Ngày:** 2026-11-20  
**Product:** Victori3 Mobile / Currents of History  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch snapshot:** experiment/owner-authorized-clock-runtime  
**Trạng thái:** DRAFT — chờ chủ dự án duyệt phạm vi; không phải implementation authorization  
**Supersedes:** đề xuất sản phẩm mới 1836–2026; không thay thế frozen S0 Master Spec 1836–1936 cho mục đích audit baseline.

---

## 1. Product vision

Xây dựng một grand-strategy historical simulation mobile, cho phép người chơi điều hành quốc gia từ ngày 1/1/1836 tới hết ngày 31/12/2026. Gameplay xoay quanh sự phát triển của xã hội, nền kinh tế, thể chế, công nghệ, ngoại giao, lãnh thổ và sức mạnh quân sự qua nhiều thời đại.

Mục tiêu là tái tạo chiều sâu hệ thống và vòng lặp quyết định của thể loại grand strategy hiện đại, lấy Victoria 3 làm chuẩn tham chiếu chức năng ở cấp độ sản phẩm. Không sao chép code, giao diện, artwork, text, data tables hay tài sản có bản quyền của game khác.

Hai luồng phải được hoàn thành đồng bộ:

- **Stream A — Historical World 1836–2026:** thế giới, quốc gia, biên giới, rulers/governments, wars, treaties, technology/institutions và dữ liệu lịch sử có thời gian hiệu lực.
- **Stream B — Simulation Depth:** POP, economy, firms/markets, political institutions, diplomacy/subjects, military/logistics, technology adoption và AI.

---

## 2. Product goals

PG-01. Campaign có thể chơi từ 1836-01-01 tới sau khi xử lý xong 2026-12-31; campaign complete tại boundary 2027-01-01 00:00.

PG-02. Historical, Sandbox và Observer dùng cùng simulation rules, calendar và state model.

PG-03. Mọi hệ thống chính phải tương tác bằng state contracts và resource flows có thể kiểm tra, thay vì các chỉ số tổng hợp độc lập không có nguyên nhân.

PG-04. Mọi dữ liệu lịch sử phải phân biệt verified, supported, estimated, uncertain, missing và projected.

PG-05. Simulation phải deterministic theo seed và thứ tự command/task; save/load không được chạy trùng hoặc làm mất task.

PG-06. Engine phải có mobile-safe scheduling và slowdown behavior; không tăng tốc theo FPS và không bỏ logic khi thiết bị quá tải.

PG-07. Campaign phải cho phép alternate history: lịch sử thực tế là baseline/events/context, không phải đường ray bắt buộc trong mọi run.

---

## 3. Non-goals và ranh giới

- Không mô phỏng từng cá nhân POP, từng viên đạn hoặc từng sản phẩm vật lý độc lập. Dùng aggregates/cohorts với bảo toàn dòng và tồn kho.
- Không yêu cầu mọi quốc gia có cùng độ chi tiết. Country/era coverage phải minh bạch và có quality flags.
- Không giả định mọi công nghệ có mặt đồng đều ở mọi quốc gia ngay khi được nghiên cứu ở một nước.
- Không giả định 2026 có dữ liệu thống kê hoàn chỉnh cho mọi biến. Dùng latest available observation, estimates và projections được gắn nhãn.
- Không sửa baseline S0 hoặc coi draft này là kết quả review/phase acceptance.

---

## 4. Game modes và campaign lifecycle

### FR-MODE-001 — Historical
Khởi tạo world theo dữ liệu và scenario tại 1836-01-01. Historical events, milestones và AI priorities có thể tạo bias/pressure, nhưng người chơi và AI vẫn có thể làm lịch sử rẽ nhánh.

### FR-MODE-002 — Sandbox
Dùng cùng world rules, technology prerequisites, economic/POP/political/diplomatic/military systems và calendar như Historical. Khác ở scenario initialization, event constraints và mức độ người chơi muốn thay đổi lịch sử.

### FR-MODE-003 — Observer
Cho phép quan sát thế giới và AI vận hành mà không điều khiển một quốc gia; mọi state mutations vẫn qua cùng engine.

### FR-CAL-001 — Calendar start/end
Campaign bắt đầu 1836-01-01 00:00, xử lý ngày cuối 2026-12-31 và hoàn tất tại 2027-01-01 00:00.

### FR-CAL-002 — Gregorian calendar
Độ dài tháng và leap year tuân thủ Gregorian calendar. Không hard-code mọi tháng 30 ngày.

### FR-CAL-003 — Logical resolution
Target design dùng 4 regular logical steps/ngày, mỗi step 6 giờ. Regular step chỉ advance clock/deadlines/operations; heavy systems có cadence riêng.

### FR-CAL-004 — Speed cap
Speed 5 có hard ceiling 0,5 Gregorian game-day/real-second. Đây là owner requirement hiện hành. Speed 1–4 phải chậm hơn; mapping cuối cùng cần benchmark thiết bị và owner play-test.

### FR-CAL-005 — Renderer independence
Logical time không được phụ thuộc FPS, refresh rate hay requestAnimationFrame.

### FR-CAL-006 — Overload
Khi thiết bị không theo kịp, simulation slowdown/backlog được phép; không drop logical events/tasks, không catch-up burst vô hạn.

### FR-CAL-007 — Completion
Không dừng campaign giữa ngày cuối trước khi xử lý toàn bộ task đã due tại ngày 2026-12-31.

---

## 5. Core simulation requirements

### 5.1 POP and society

FR-POP-001. POP được lưu theo aggregate cohorts ổn định, có tối thiểu region, culture, religion, age band, social stratum, occupation/employment, literacy/education và population count.

FR-POP-002. Birth/death phụ thuộc tuổi, nutrition/living standards, health, urbanization, war, famine, epidemic, public-health institutions và môi trường.

FR-POP-003. Internal/international migration có push/pull drivers: wages, work, land, housing, instability, legal access, transport cost và subject/war constraints.

FR-POP-004. POP transitions giữa strata/occupations và labor-force participation phải có mass balance. Một worker không được phân bổ đồng thời cho nhiều jobs.

FR-POP-005. Age transition không phụ thuộc số lần render; phải đúng qua leap-day/year boundaries.

### 5.2 Economy and firms

FR-ECO-001. Goods có stable ID, unit, category, base value, perishability, strategic criticality, storage properties và substitution constraints.

FR-ECO-002. Buildings/firms có recipes, inputs/outputs, capacity, utilization, worker demand by strata, ownership, wages, maintenance, profitability và production-method prerequisites.

FR-ECO-003. Market/region inventory ledger phải bảo toàn vật chất: opening stock + inflows − outflows − spoilage = closing stock.

FR-ECO-004. Hàng hóa thiếu phải tạo unmet demand/production curtailment; không tạo supply âm hoặc ẩn.

FR-ECO-005. Trade routes có capacity, transit time, tariff, transport mode, risk, blockade exposure, convoy requirement và treaty restrictions.

FR-ECO-006. Price/shortage phụ thuộc demand, available stock, unmet demand, transport/access cost và market integration; settlement không phụ thuộc iteration order.

FR-ECO-007. Firm, household và state cash-flow phải reconcile; taxes, wages, debt service, subsidies, tariffs, investment và construction không được tạo tiền vô cớ.

FR-ECO-008. Construction tiêu thụ cả tiền, materials và labor; delivery/capacity quyết định tiến độ, không chỉ treasury balance.

### 5.3 Politics and institutions

FR-POL-001. Hỗ trợ interest groups hiện có và mở rộng thành parties, coalitions, movements, petitions và tổ chức chính trị phù hợp từng thời kỳ.

FR-POL-002. Elections/suffrage/representation có eligibility, turnout, districts/constituencies, mandates và term validity nếu thể chế áp dụng.

FR-POL-003. Cabinets/government composition, confidence, legitimacy, executive constraints và institutional capacity ảnh hưởng policy execution.

FR-POL-004. Law lifecycle có eligibility, sponsors/opposition, legislative path, enactment time, enforcement coverage, resistance, court/constitutional constraints và repeal/amendment.

FR-POL-005. Revolution/coup/civil conflict là process có actors, objectives, control, loyalty, diplomacy và outcome, không chỉ là random regime flip.

FR-POL-006. Institutions/laws có validity interval và historical applicability; không mở quyền/tổ chức hiện đại cho mọi nước từ 1836.

### 5.4 Diplomacy, subjects and treaties

FR-DIP-001. Subject relationships phải mô tả type, autonomy, foreign-policy control, fiscal obligations, military obligations, market access, succession/integration và termination.

FR-DIP-002. Treaty là contract có parties, typed clauses, start/end, renewal, ratification, obligations, violation penalty, enforcement và termination.

FR-DIP-003. Diplomatic play có lifecycle từ proposal/demands qua escalation, sway/maneuver, countdown/ultimatum tới peaceful resolution hoặc war; phải có exactly-one terminal outcome.

FR-DIP-004. Multi-party alliances, guarantees, neutrality, access, non-aggression, trade/customs, reparations, spheres/influence, subject/autonomy và peace clauses phải có semantics rõ ràng.

FR-DIP-005. Không tự động coi every open-ended relationship là tồn tại tới năm 2026; historical treaty validity phải dựa trên record và termination rules.

### 5.5 Military and logistics

FR-MIL-001. Force hierarchy gồm military branches, theaters/army groups, formations/units, commanders, fronts/sea zones, orders, operations và supply depots.

FR-MIL-002. Recruitment/mobilization có lead time, reserve/manpower limits, training, economic opportunity cost và political effects.

FR-MIL-003. Equipment inventories theo type/location; sản xuất, nhập khẩu, hao mòn, maintenance, replacement, reserve, capture và transport phải được ghi sổ.

FR-MIL-004. Supply delivery phụ thuộc depot, route throughput, rail/road/port/river/sea access, terrain/weather, blockade/interdiction, stock và transport delay.

FR-MIL-005. Operations/battles có order issue/arrival time, command delay, target, objective, deterministic resolution inputs, casualties, morale, organization, equipment loss và occupation changes.

FR-MIL-006. National arms price hoặc aggregate manpower không được tự động thay thế inventory/equipment/readiness thực tế khi logistics slice đã được triển khai.

### 5.6 Technology, institutions and industrial adoption

FR-TECH-001. Tree hiện tại phải được mở rộng qua 2026 ở production, society/health, communications/transport, energy/materials, computing/AI/automation, science và military.

FR-TECH-002. Research, access, diffusion, adaptation, adoption, industrial deployment và operational readiness là các trạng thái khác nhau.

FR-TECH-003. Deployment cần capital, skilled labor, institutions, infrastructure, energy, materials, supply chains, imports và maintenance.

FR-TECH-004. Country-specific access/adoption phải không đồng đều và có dated provenance; discovery tại một nước không tự động cấp capability toàn cầu.

FR-TECH-005. Modern technology records phải có historical introduction/adoption window, prerequisites, uncertainty và valid era.

### 5.7 AI and decision making

FR-AI-001. AI strategic planning có multi-year horizon: industrialization, fiscal policy, institutions, alliances, subjects, research và national goals.

FR-AI-002. AI operational planning có monthly/weekly horizon: construction, diplomatic plays, trade routes, mobilization, force allocation và supply preparations.

FR-AI-003. AI tactical execution theo six-hour/daily order timing chỉ được thực thi orders đã được engine validate; không re-plan toàn bộ quốc gia mỗi logical step.

FR-AI-004. AI gửi intents/plans qua Command API; engine kiểm tra invariants và áp dụng state mutations.

FR-AI-005. Plans có objective, constraints, expected benefit, risk, expiry, cancellation condition và audit reason.

---

## 6. Historical World Data Requirements — Stream A

### FR-HIS-001 — Time-dependent country registry
Lưu state existence, recognized/de facto status, name, tag, regime, capital, claims, successor/parent, start/end dates và source.

### FR-HIS-002 — Time-dependent territory
Lưu owner/control/occupation/dispute/administrative level theo date interval; region map static 1836 không đủ để đại diện biên giới tới 2026.

### FR-HIS-003 — Governments and leaders
Lưu ruler/head of state/head of government, cabinet, party, term, succession, constitutional office và source/date validity.

### FR-HIS-004 — Historical events and wars
Lưu participants, objectives, triggers, start/end, territorial effects, outcomes, deaths/stock/economic effects khi có dữ liệu phù hợp, source và uncertainty.

### FR-HIS-005 — Treaties and organizations
Lưu membership, accession/withdrawal, clauses, ratification, validity, enforcement, successor organizations và source.

### FR-HIS-006 — Quantitative observations
Mọi demographic/economic/military/energy/trade/education/health observations phải có variable, unit, denominator, observation year, quality, uncertainty, source and territory mapping.

### FR-HIS-007 — Provenance
Mỗi record có source ID, locator, publication/access date, license/rights, transformation method, content hash và ETL version.

### FR-HIS-008 — Temporal completeness
Nếu không có dữ kiện cho một country-year-variable thì mark missing/estimated/projected rõ ràng; không nội suy âm thầm hoặc dùng current value cho historical year.

---

## 7. Save, compatibility and offline requirements

FR-SAVE-001. Tách save format version, rules version, data-pack version, content version và engine compatibility version.

FR-SAVE-002. Save mới phải lưu calendar logical step, one-shot deadlines, task cursor cần thiết, RNG state và state-domain records để replay deterministic.

FR-SAVE-003. Migration v1 monthly to calendar v2 phải map trạng thái legacy về day 1, 00:00 của tháng save, không tự bịa phần ngày/giờ còn thiếu.

FR-SAVE-004. Migration phải giữ nguyên bytes gốc làm recovery, dry-run validation, migrate, serialize, reload, compare và chỉ atomic activate sau khi pass. Khi lỗi không ghi đè bản gốc.

FR-SAVE-005. Offline campaign không được phụ thuộc bắt buộc vào kết nối mạng sau khi data pack cần thiết đã cài/verified.

FR-SAVE-006. Data packs cần version, trusted manifest, hash/signature verification, explicit download consent, rollback và compatibility check. Đây là yêu cầu sản phẩm, chưa phải implementation.

---

## 8. Non-functional requirements

NFR-PERF-001. Không có state transition do render/FPS. Same seed, same commands, same logical steps phải cho cùng state.

NFR-PERF-002. Scheduler work per callback có giới hạn; backlog/slowdown được theo dõi, không catch-up unbounded loop trên UI thread.

NFR-PERF-003. Benchmark bắt buộc trên target Android device; Node/desktop CI không thay thế thiết bị.

NFR-PERF-004. Đo step p50/p95/p99/max, long tasks, frame interval, memory, storage, battery/thermal và campaign time-to-progress.

NFR-RELIABILITY-001. Save/load deterministic tại boundary ngày, tuần, tháng, năm, treaty expiry, mobilization, battle và campaign completion.

NFR-RELIABILITY-002. Không execute task hai lần sau pause/resume/load/retry.

NFR-DATA-001. Mọi field quan trọng có provenance, quality and missingness; no fake zero for unsupported measurement.

NFR-CONTENT-001. Không sử dụng dữ liệu/tài sản không có quyền sử dụng/redistribution phù hợp.

---

## 9. Acceptance criteria cấp sản phẩm

AC-01. New campaign starts at 1836-01-01 and can process all scheduled tasks through 2026-12-31 before completing at 2027-01-01.

AC-02. Historical, Sandbox and Observer share all core simulation rules.

AC-03. Speed 5 never exceeds 0.5 game-day/real-second; pause/background does not advance logical time; renderer frequency does not change deterministic results.

AC-04. Every periodic/event task has stable ID, due rule, owner, dependency, idempotence policy and deterministic tests.

AC-05. Economy stock and cash-flow equations reconcile; no silent stock/financial creation.

AC-06. POP cohorts reconcile with region totals; migration conserves population except explicit births/deaths.

AC-07. Political law/election/movement lifecycle respects institution eligibility and time validity.

AC-08. Treaties, subjects and diplomatic plays have date validity, obligations and deterministic terminal resolution.

AC-09. Military readiness depends on equipment, manpower, training, doctrine and deliverable supply, not merely aggregate national price/strength.

AC-10. Technology research is distinct from access/adoption/deployment; country-level modern capability is evidence-bounded.

AC-11. Every campaign-era country/region has valid date applicability or explicit unknown/missing handling.

AC-12. v1 save migration is lossless within explicitly defined semantics and preserves recoverable original.

AC-13. No feature is declared device-ready until iQOO benchmark and hands-on owner acceptance are recorded.

---

## 10. Delivery phases and dependencies

| Phase | Scope | Exit deliverable |
|---|---|---|
| A0 | Approve 1836–2026 product requirements and data contract | Owner-approved PRD/SRS revision |
| A1 | Historical source/coverage audit and crosswalk | Country x era x domain coverage matrix, missing-data ledger |
| A2 | Temporal country/territory/government/treaty/event records | Versioned world-history pack and validation |
| B0 | Calendar v2 and v1 save migration | Approved schema, migration implementation and deterministic test evidence |
| B1 | Cadence registry/task runner | Stable six-hour/daily/weekly/monthly/yearly task execution |
| B2 | Economy firm and stock ledger | Stock/cash-flow conservation tests |
| B3 | POP cohorts and demographic processes | Population/migration mass-balance tests |
| B4 | Political institutions and law lifecycle | Elections/reforms/movements deterministic tests |
| B5 | Diplomacy, subjects and treaty lifecycle | Treaty/subject/diplomatic-play test suite |
| B6 | Military formations, equipment and logistics | Equipment/supply/operations deterministic test suite |
| A3/B7 | Modern technology/institution adoption and strategic AI | Era/country access and multi-horizon AI tests |
| A4/B8 | Full campaign integration/calibration/device profiling | 1836–2026 acceptance and device benchmark report |

Critical dependencies: B0 before B1; B1 before daily/weekly system extraction; B2 before detailed POP purchasing-power and military supply; B4/B5 before complex subject/war politics; A1/A2 before extending campaign terminal year or modern data; A3/B7 before declaring modern technology parity.

---

## 11. Current implementation status (must not be confused with target requirements)

At the recorded branch snapshot:

- Implemented and CI-tested: owner-authorized S1-CLK-01 monthly scheduler refactor on experiment/owner-authorized-clock-runtime.
- Not implemented: calendar v2, six-hour logical tick, v1 save migration, daily/weekly/monthly/yearly cadence registry, stock-ledger economy, POP age cohorts, political parties/elections, diplomatic plays/typed treaty lifecycle, military units/equipment/convoys, 1836–2026 campaign end, modern technology dataset.
- Current GameState.tick remains monthly; current GAME_END_YEAR remains 1936.
- Current historical data coverage has major gaps; see HISTORICAL_DATA_COVERAGE_AUDIT_1836_2026_DRAFT.md.
- S0-B7 remains IN_PROGRESS, overall S0 PARTIAL — NOT COMPLETE, bounded S1-entry NOT_TESTED; no general S1 authorization is inferred.

This PRD is a proposed product requirement baseline for owner review. It does not itself authorize code, schema, historical data, content, assets, workflow, signing or APK changes.
