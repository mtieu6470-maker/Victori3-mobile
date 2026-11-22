# CLAUDE EXECUTION PLAN — Victori3 Mobile

- Chủ sở hữu tài liệu: **Claude Code — Project Director / Lead Systems Architect / Primary Engineer** (owner directive 2026-11-21).
- Trạng thái: **LIVING DOCUMENT** — cập nhật sau mỗi lát cắt có ý nghĩa.
- Lập ngày: 2026-11-21. Base audit: `94d0d28d78cf8184b41df6b70ae4e7c55a85d38c`.
- Branch làm việc của phiên này: `ccr-b27f3fb8-epfpd6` (được tạo cùng HEAD với branch chỉ định `claude/game-historical-sandbox-modes-kg7rj7`; xem §12 về đồng bộ branch).
- Đọc cùng: `docs/coordination/AI_TASK_ASSIGNMENTS.md`, `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv`, `docs/spec/ADAPTIVE_HOURLY_CLOCK_SPEC_VI.md`, master brief.

## 1. Phạm vi sản phẩm và định nghĩa hoàn thành

Game đại chiến lược Android landscape-first, offline-first sau khi người dùng chủ động cài content pack; chiến dịch 01/01/1836 – 31/12/2026 với Historical và Sandbox trên **một engine**; độ rộng hệ thống tương đương Victoria 3 base game + các gói gameplay đã phát hành tại mốc 1.15.1 (11/11/2026); AI quốc gia/thế giới; save tin cậy; dữ liệu lịch sử có nguồn; media gốc/có giấy phép; full install thực chất ~4–5 GB; hiệu năng kiểm chứng trên thiết bị.

Hoàn thành = toàn bộ milestone M0–M9 dưới đây đạt exit criteria + owner nghiệm thu cuối. Không tính: APK nhỏ, build pass, menu, file media không dùng.

## 2. Audit hiện trạng (HEAD 94d0d28, code thực tế)

Engine ~3.900 dòng TypeScript trong `src/engine`, UI Preact trong `src/ui`, 15 file test / 139 test pass (local, 2026-11-21, `npm test` exit 0).

| Domain | Bằng chứng code | Đánh giá |
|---|---|---|
| Clock | `simulation.ts` stepMonth; `controller.ts` SPEED_MS 2–8 s/tháng | Không đạt chỉ thị → **CLOCK-01 đã sửa trong phiên này** |
| Shared engine 2 mode | `simulation.ts` SYSTEMS, `modes.ts`, `tests/modes.test.ts` | IMPLEMENTED (cùng pipeline; test divergence) |
| Pops | `systems/population.ts` (9 strata/region), `systems/populationCohorts.ts` (cohort projection ước lượng, DEV-005) | PARTIAL — cohort chưa có needs/wealth/identity riêng |
| Needs/SoL | SoL tổng hợp vùng trong economy/population | PARTIAL |
| Goods/market | `systems/economy.ts` 12 goods, recipe cố định, market quốc gia/customs union + world price, `marketStats` | PARTIAL — không có PM, buy/sell orders, local price đầy đủ |
| Buildings/construction | 10 building types; `constructionProjects` (DEV-004) | PARTIAL |
| Employment/wages | `region.employment/wages` (DEV-004/005) | PARTIAL |
| Finance | budget/thuế/nợ tổng hợp trong economy/politics | PARTIAL |
| Laws/IG | `systems/politics.ts` 8 IG, 9 law group, legitimacy, reform | PARTIAL — không movements/agitators/parties |
| Tech | `systems/technology.ts` cây + diffusion | PARTIAL |
| Diplomacy | `systems/diplomacy.ts` relations/rivalry/alliance/guarantee/customs union | PARTIAL — không diplomatic plays/Power Blocs |
| Military | `systems/military.ts` manpower, naval strength, war score, battles | PARTIAL — không formations/fronts/commanders/fleets/convoys |
| Events/journal | `systems/events.ts`, decision windows, `historical.ts` | PARTIAL |
| AI | `ai/ai.ts` đầu tư, nghiên cứu, cửa sổ quyết định | PARTIAL |
| Save | `save.ts` v2 → (CLOCK-01) v3, migration tuần tự, validation | PARTIAL — chưa engineVersion/dataBuildHash/backup rotation; B4-R1 RNG thiếu vẫn TypeError |
| UI | landscape manifest (ANDROID-LANDSCAPE-01), screens World/Country/Economy/Society/Politics/Tech/Diplomacy/Military/Journal | PARTIAL |
| Content packs | dữ liệu/ảnh build vào APK (~18 MB) | NOT_STARTED (downloader/manifest/verify/activate) |
| Media | 502 ảnh (cờ/huy hiệu/chân dung), không video/audio | PARTIAL / DATA_MISSING |
| Historical data 1937–2026 | không có | DATA_MISSING |
| Android device QA | chưa từng chạy trên thiết bị | NOT_STARTED |

Ma trận parity chi tiết (bao gồm từng gói DLC đã phát hành): `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv` (cột `status_2026_11_21`, `code_paths`, `tests`, `next_task`).

## 3. Kiến trúc mục tiêu

Phân lớp theo master brief §24: static data → domain model → simulation systems → command layer → read models → persistence → UI → Android bridge → content delivery → media runtime.

Quyết định kiến trúc của Project Director (2026-11-21):

1. **Thời gian canonical = giờ nguyên** (`clock.hour`), lịch Gregorian chính xác; mọi cadence suy ra từ giờ. (CLOCK-01, xong.)
2. **Mô phỏng chạy trong Web Worker** (CLOCK-02): UI thread chỉ giữ read-model snapshot; lệnh người chơi đi qua hàng đợi có sequence ID, áp dụng tại ranh giới giờ kế tiếp theo thứ tự tất định. Lý do: ranh giới tháng ~64 ms desktop sẽ gây giật frame trên điện thoại nếu ở UI thread.
3. **RNG theo domain** (SAVE-02): tách `st.rng` thành stream cho economy/population/politics/diplomacy/military/events/ai; migration v3→v4 tất định. Lý do: thêm subsystem cadence mịn sẽ không làm xáo trộn RNG của hệ thống khác.
4. **Static data tách khỏi mutable state** với ID ổn định và data-build hash trong save envelope (SAVE-01).
5. **Content pack**: manifest ký số + SHA-256 từng file, staging → verify → atomic activate → rollback; pack không chứa code (PACK-01..05).
6. **Read model/selector layer** cho UI (UI-01): component không đọc deep mutable state khi Worker hoàn tất; tooltip giải thích từ causal trace của engine.

## 4. Dependency graph và critical path

```
CLOCK-01 ─┬─ CLOCK-02 (worker) ─┬─ CLOCK-03 (daily/hourly cadences) ─┬─ ECON-03 shipments, MIL-03 supply/attrition
          │                     │                                     └─ POP-04 migration flows
          ├─ SAVE-01 envelope ──┴─ SAVE-02 RNG streams ─ SAVE-03 backup/restore
          └─ CLOCK-BENCH-DESKTOP ─ CLOCK-BENCH-ANDROID (owner: cài APK)

Economic spine:  POP-01 cohort identity ─ POP-02 needs/wealth ─ ECON-01 goods ledger ─ ECON-02 market orders/local prices
                 ─ IND-01 building sites + production methods ─ IND-02 jobs/qualification/wages ─ IND-03 ownership/companies
                 ─ IND-04 construction sectors ─ FIN-01 treasury ledger ─ POL-01 IG power from cohorts
Political spine: POL-01 ─ POL-02 laws process ─ POL-03 movements/agitators ─ POL-04 parties/elections ─ POL-05 revolution/civil war
Geo spine:       DIP-01 treaties lifecycle ─ DIP-02 diplomatic plays ─ DIP-03 subjects/autonomy ─ DIP-04 power blocs/leverage
                 ─ AI-01 strategic planner ─ MIL-01 formations/commanders ─ MIL-02 fronts/battles ─ MIL-04 navy/TGW ─ MIL-05 peace
History:         HIST-01 source register 1836 ─ HIST-02 1837–1936 events ─ HIST-03 1937–2026 data plan & events
UX/content:      UI-01 read models ─ UI-02 map lenses/inspector ─ PACK-01..05 ─ MEDIA-01..06 ─ REL-01..03
```

**Critical path:** CLOCK-01 → SAVE-01 → CLOCK-02 → SAVE-02 → POP-02 → ECON-02 → IND-01 → IND-02 → FIN-01 → POL-01 → DIP-02 → MIL-02 → AI-01 → PACK-03 → REL-02.

## 5. Milestones và exit criteria

| Milestone | Nội dung | Exit criteria |
|---|---|---|
| **M0 Clock & runtime foundation** | CLOCK-01/02/02b/03/04, SAVE-01/02/03, bench | Hourly canonical, worker, RNG streams, save v4+ có backup; test tương đương/tất định; desktop + Android bench ở 12h/s và 6h/s |
| **M1 Society & economy spine** | POP-01..04, ECON-01..03, IND-01..04, FIN-01 | Loop A, B, C chứng minh bằng test; bảo toàn dân số/hàng/tiền |
| **M2 Politics** | POL-01..05, INST-01 | Loop D; luật có tiến trình, movement/revolution có hậu quả |
| **M3 Diplomacy & international order** | DIP-01..04, COMP-01 (charters) | Loop E; diplomatic play nhiều kết cục; Power Bloc |
| **M4 War** | MIL-01..05, WS-01 (War Support 1.15) | Loop F; huy động/supply/casualties/peace nhất quán |
| **M5 AI** | AI-01..03 | 50 năm observer không oscillation, không tài nguyên vô hạn, ngân sách tick |
| **M6 History & DLC content layers** | HIST-01..04, DLC-* country layers | Dữ liệu có nguồn 1836; events 1837–1936; kế hoạch + dữ liệu 1937–2026 |
| **M7 UX** | UI-01..05 | Map→pop/building/market/law và giải thích nguyên nhân; landscape phone QA |
| **M8 Content & media** | PACK-01..05, MEDIA-01..06 | Pack verify/activate/rollback; media có rights; footprint đo được hướng 4–5 GB |
| **M9 Release readiness** | REL-01..03 | Device matrix, 60-phút session, process death, save migration; owner nghiệm thu |

## 6. Task register (Claude-owned engineering; delegated research ở AI_TASK_ASSIGNMENTS)

| ID | Task | Owner | Depends | Priority | Status |
|---|---|---|---|---|---|
| TAKEOVER-AUDIT | Verify HEAD/docs/code/tests | Claude | — | P0 | DONE (2026-11-21) |
| EXECUTION-PLAN | Tài liệu này | Claude | audit | P0 | DONE (living) |
| AI-TASK-REGISTER | `AI_TASK_ASSIGNMENTS.md` | Claude | plan | P0 | DONE (living) |
| PARITY-01 | Cập nhật ma trận parity + gói DLC | Claude (+CG-06) | audit | P0 | DONE v1; leaf-level chờ CG-06 |
| **CLOCK-01** | Hourly canonical clock, scheduler, AUTO 12→6 governor, presets, save v3, lifecycle pause | Claude | — | P0 | **IMPLEMENTED (phiên này)** |
| CLOCK-BENCH-DESKTOP | `tools/clock-bench.ts` | Claude | CLOCK-01 | P0 | DONE (desktop only) |
| SAVE-01 | Envelope: engineVersion, world-data fingerprint, savedAtHour; RNG fail-closed (B4-R1); slot write validated + backup trong cùng transaction + tự khôi phục | Claude | CLOCK-01 | P0 | **IMPLEMENTED (2026-11-22)** |
| CLOCK-02 | Simulation Web Worker (SimCore + generation protocol + backpressure) + kênh đồng hồ nhẹ | Claude | CLOCK-01, SAVE-01 | P0 | **IMPLEMENTED (2026-11-22)**, desktop-measured |
| CLOCK-02b | Lifecycle: pause + autosave nền (web-standard: visibilitychange/pagehide/freeze/pause) **đã làm 2026-11-22**; hook native `@capacitor/app` + đọc thermal: chờ được phép thêm dependency | Claude | CLOCK-02 | P1 | PARTIAL (web part IMPLEMENTED) |
| SAVE-02 | RNG streams theo domain (B4-R1 đã đóng ở SAVE-01) | Claude | SAVE-01 | P0 | NOT_STARTED |
| SAVE-03 | Backup/restore/export-import kiểm checksum | Claude | SAVE-01 | P1 | NOT_STARTED |
| CLOCK-03 | Cadence mịn cho daily flows | Claude (+CG-04) | CLOCK-02, ECON-03/MIL-03 | P1 | NOT_STARTED |
| CLOCK-04 | Scheduled event queue theo giờ trong save | Claude | SAVE-02 | P1 | NOT_STARTED |
| CLOCK-BENCH-ANDROID | Benchmark thiết bị, hiệu chỉnh ngưỡng governor | Claude (owner cài APK) | CLOCK-02 | P0 | BLOCKED_OWNER_ACTION (cần phép cài lên thiết bị cá nhân) |
| POP-01 | Cohort identity (culture/religion/profession/literacy) canonical | Claude (+CG-02) | SAVE-02 | P0 | NOT_STARTED |
| POP-02 | Needs baskets, wealth, SoL theo cohort | Claude (+CG-02) | POP-01, ECON-01 | P0 | NOT_STARTED |
| POP-03 | Discrimination/rights, acceptance | Claude | POP-01, POL-02 | P1 | NOT_STARTED |
| POP-04 | Migration flows, births/deaths theo cohort | Claude | POP-01, CLOCK-03 | P1 | NOT_STARTED |
| ECON-01 | Goods registry + material ledger bảo toàn. **ECON-01a xong 2026-11-22:** sổ cái dòng hàng (supply+imports = used+exports+unsold; Σimports = Σexports), marketStats dựng lại mỗi tháng (sửa số liệu cũ của thị trường đã giải thể) | Claude (+CG-01, CG-17) | SAVE-02 | P0 | PARTIAL |
| ECON-02 | Buy/sell orders, local market prices, market access | Claude (+CG-01) | ECON-01 | P0 | NOT_STARTED |
| ECON-03 | World Market + Trade Centers (sở hữu, capacity, World Market Access, hub chính/dự phòng), TradeFlow, tariffs, blockade; SupplyRoute quân sự là ledger riêng (thay mô hình trade route cũ, theo CG-01) | Claude | ECON-02, CLOCK-03 | P1 | NOT_STARTED |
| IND-01 | Building types/sites + selectable Production Methods | Claude (+CG-03) | ECON-01 | P0 | NOT_STARTED |
| IND-02 | Jobs, qualifications, hiring/firing, wages. **IND-02a 2026-11-22:** site operations phản ứng lợi nhuận (`src/engine/systems/industry.ts`) — IMPLEMENTED nhưng **TẮT mặc định** chờ ECON-CAL-01 | Claude (+CG-03, CG-17, CG-19) | IND-01, POP-01 | P0 | PARTIAL |
| ECON-CAL-01 | Hiệu chỉnh để bật IND-02a. **01b xong 2026-11-22:** openness theo mặt hàng từ bằng chứng thuế 1836 (CG-21) + thợ thủ công phản ứng giá. Còn: (1) nhập khẩu bị chặn ở `thiếu hụt × độ mở` nên nước phụ thuộc nguyên liệu nhập không tồn tại được; (2) thiếu đầu ra xuất khẩu cho vải Anh; (3) dư thừa lương thực tự cung — chuyển sang ECON-03 (+CG-22) | Claude (+CG-20/21/22) | ECON-01a | P0 | PARTIAL |
| IND-03 | Ownership, companies, dividends, investment pool | Claude (+CG-03) | IND-02 | P1 | NOT_STARTED |
| IND-04 | Construction sectors/queue/cost | Claude | IND-01, FIN-01 | P1 | NOT_STARTED |
| FIN-01 | Treasury ledger, taxes, debt/credit, default | Claude | IND-02 | P0 | NOT_STARTED |
| POL-01..05 | IG từ cohorts; luật có tiến trình; movements/agitators; parties/elections; revolution/civil war | Claude (+CG-05) | FIN-01 | P0–P1 | NOT_STARTED |
| INST-01 | Institutions, bureaucracy/authority/influence | Claude | POL-02 | P1 | NOT_STARTED |
| TECH-02 | Tech effects → PM/law/unit unlocks, diffusion | Claude | IND-01 | P1 | NOT_STARTED |
| DIP-01..04 | Treaty lifecycle; diplomatic plays; subjects; Power Blocs/leverage/investment | Claude (+CG-05) | POL-01 | P0–P1 | NOT_STARTED |
| COMP-01 | Companies & charters, monopolies, prestige goods | Claude (+CG-06) | IND-03, DIP-01 | P2 | NOT_STARTED |
| MIL-01..05 | Formations/commanders; fronts/battles; supply/attrition; navy + ship design/flagship/ship treaties/gunboat; peace | Claude (+CG-05) | DIP-02 | P0–P1 | NOT_STARTED |
| WS-01 | War Support 0–100 (1.15) thay War Exhaustion | Claude (+CG-05) | MIL-02 | P1 | NOT_STARTED |
| AI-01..03 | Strategic planner; economic AI; military/diplomatic AI; CPU budget | Claude | M1–M4 | P0 | NOT_STARTED |
| HIST-01..04 | Source register 1836; events 1837–1936; data plan + data 1937–2026; calibration | Claude (+CG-07, HY-*) | — (song song) | P0 | NOT_STARTED |
| DLC-* | Country/regional content layers trên hệ thống chung | Claude (+CG-06) | systems | P2 | NOT_STARTED |
| UI-01..05 | Read models; inspector; lenses; ledgers/tooltips; accessibility | Claude (+CG-09) | CLOCK-02 | P1 | NOT_STARTED |
| PACK-01..05 | Catalog UI; manifest/signature; downloader resume/consent; staging/activate/rollback; offline status | Claude | SAVE-01 | P1 | NOT_STARTED |
| MEDIA-01..06 | Registry; flags/arms; portraits; buildings/ships; music/ambience/SFX; video/animation | Claude (+HY-*, CG-10) | PACK-02 | P1–P2 | NOT_STARTED |
| REL-01..03 | Device matrix; long-session/thermal; release checklist (owner reserved) | Claude (owner) | all | P1 | NOT_STARTED |

## 7. Kế hoạch migration đồng hồ 12h/s (tóm tắt; chi tiết ở spec)

1. **CLOCK-01 (xong):** giờ canonical, scheduler cadence, monthly systems giữ nguyên thứ tự/RNG (test tương đương byte-for-byte), pacing nguyên số, AUTO governor có hysteresis, preset 3/6/12/24/48, lifecycle pause, save v3 + migration v1/v2→v3, biên 23:00 31/12/2026.
2. **CLOCK-02:** worker; UI nhận snapshot; command queue tất định.
3. **CLOCK-03/04:** cadence mịn theo domain + scheduled event queue; mỗi bước có test tương đương/tất định; không batching khi chưa chứng minh.
4. **Bench:** desktop (xong, ghi trong report) → Android 12h/s & 6h/s với world late-game đại diện → hiệu chỉnh ngưỡng governor.

## 8. Save/data migration plan

- v1 → v2 (cohorts, DEV-005) → v3 (clock, CLOCK-01) → v4 (SAVE-01/02: envelope engineVersion/dataBuildHash, RNG streams) → v5+ (cohort identity, goods ledger…). Migration thuần, tuần tự, không RNG; không ghi đè save gốc khi lỗi; giữ bản tốt cuối (SAVE-03).
- Mỗi migration có test: tiếp tục sau migration = chạy liên tục (hash/JSON), từ chối dữ liệu mâu thuẫn.

## 9. Kế hoạch dữ liệu lịch sử toàn cầu 1836–2026

- 1836 start: dùng registry 181 polity hiện có + audit coverage (`docs/audit/GLOBAL_COVERAGE.md`); bổ sung nguồn cho succession/population/borders theo SOURCE_REGISTER v3.3.
- 1837–1936: events/journal có trigger + temporal validity, không ép kết quả.
- 1937–2026: owner extension. CG-07 lập source register (biên giới theo thời kỳ, dân số, GDP — kiểm tra license Maddison/CShapes/v.v.), Claude định schema temporal validity. Thiếu dữ liệu → `unknown`, không bịa; không mở event post-1936 trước khi có nguồn.

## 10. Media/content và mục tiêu 4–5 GB

- Registry asset (MEDIA-01) với rights/provenance/entity/era/hash/usage; chỉ asset có rights và được runtime tham chiếu mới tính vào footprint.
- Nguồn ưu tiên: public domain (Wikimedia Commons PD/CC0 có xác minh), Natural Earth (PD), Musopen/PD recordings, CC0 SFX; tài sản tự tạo gốc. Không dùng tài sản Paradox.
- Đo riêng: source bytes, download bytes, installed bytes, staging/rollback bytes, decoded RAM.
- Không padding, không downscale hàng loạt.

## 11. Android performance & device QA plan

- Ngân sách: UI thread ≤ 8 ms mô phỏng/frame (CLOCK-01) → 0 ms sau CLOCK-02 (worker); ranh giới tháng trong worker; read-model diff nhỏ.
- Đo: startup p50/p95, frame time p50/p95/p99, ranh giới tháng p95/max, heap, save/load, 60 phút session, thermal — chỉ báo PASS khi đo trên thiết bị thật (model/OS/WebView/APK SHA).
- iQOO Z10 Turbo là thiết bị mục tiêu; cài APK lên thiết bị cá nhân là hành động **owner-reserved**.

## 11b. Chính sách branch (owner 2026-11-22: "làm kiểu gì tiện mà sau đỡ phải xóa nhiều")

- Claude làm việc trên `ccr-b27f3fb8-epfpd6`. Sau mỗi lát cắt đã test xong, Claude fast-forward `claude/game-historical-sandbox-modes-kg7rj7` lên cùng commit, không force-push và không rewrite lịch sử.
- Nếu branch chính thức có commit mới (ChatGPT hoặc owner), Claude merge nó vào `ccr` trước rồi mới fast-forward. Không bao giờ ghi đè.
- ChatGPT/Hydrogen có thể đọc/ghi trên branch nào cũng được; Claude đồng bộ cả hai về một HEAD.

## 12. Risk register

| ID | Rủi ro | Mức | Giảm thiểu |
|---|---|---|---|
| R-CLK-1 | Ranh giới tháng gây giật frame trên điện thoại | Trung bình (đã giảm) | CLOCK-02: mô phỏng ở worker, UI chỉ re-render khi sang tháng; còn cần read-model delta + bench Android |
| R-ECON-1 | Sản lượng không phản ứng với cầu/lợi nhuận: hàng dư không bán mỗi tháng rất lớn (ngũ cốc 53%, gỗ 93%, công cụ 94% ở tháng 12, seed 1) rồi mất đi | Cao | ECON-02/IND-02: phản ứng lợi nhuận (CG-17 nghiên cứu cách V3 xử lý) |
| R-CMD-1 | `start_reform` với nhóm luật không tồn tại trả `ok: true` (phát hiện khi smoke test CLOCK-02) | Đã đóng | BUG-CMD-01 (2026-11-22): `validateCommand` fail-closed + danh mục luật trong engine |
| R-CLK-2 | Ngưỡng governor chưa hiệu chỉnh trên thiết bị | Trung bình | Ngưỡng PROVISIONAL, tham số hóa; CLOCK-BENCH-ANDROID |
| R-SAVE-1 | RNG thiếu → TypeError khi tiếp tục (B4-R1) | Đã đóng | SAVE-01: deserialize từ chối RNG thiếu/sai/toàn 0 |
| R-BR-1 | Hai branch: phiên này đẩy lên `ccr-b27f3fb8-epfpd6`; tài liệu cũ chỉ định `claude/game-historical-sandbox-modes-kg7rj7`; workflow tests-only chỉ chạy trên branch chỉ định | Trung bình | Không tự đổi branch; ghi rõ trong handoff; owner/phiên sau fast-forward branch chỉ định từ `ccr-…` (lịch sử tuyến tính, cùng base) |
| R-SCOPE-1 | Khối lượng parity rất lớn so với engine 3.9k dòng | Cao | Critical path theo causal spine; lát cắt nhỏ có test |
| R-DATA-1 | Dữ liệu 1937–2026 chưa có nguồn | Cao | CG-07; unknown ≠ 0; không bịa |
| R-RIGHTS-1 | Media không rõ quyền | Cao | Registry rights bắt buộc; Hydrogen chỉ đưa reference, Claude duyệt |
| R-DEV-1 | Không có thiết bị thật trong CI | Cao | Không claim device QA; owner-reserved install |

## 13. Lịch sử thay đổi kế hoạch

- 2026-11-22 v1.1 (Claude): tích hợp gói nghiên cứu ChatGPT (merge `1f8896a`, review `docs/coordination/reviews/CLAUDE_REVIEW_CHATGPT_RESEARCH_2026-11-22.md`). ECON-03 đổi sang mô hình World Market/Trade Center. Mốc tham chiếu V3 cần xét lại lên 1.15.2 (tiêu đề hotfix đã xác nhận, nội dung chưa). V-Dem chỉ dùng tham chiếu. CLOCK-02b thêm thermal status qua plugin Capacitor. MEDIA dùng kiến trúc 2D.
- 2026-11-21 v1 (Claude): lập kế hoạch; triển khai CLOCK-01 ngay sau khi lập kế hoạch; ưu tiên SAVE-01 → CLOCK-02 tiếp theo vì ranh giới tháng trên UI thread là rủi ro lớn nhất của 12h/s.
