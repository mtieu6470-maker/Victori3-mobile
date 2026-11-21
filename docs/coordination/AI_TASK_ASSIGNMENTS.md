# AI TASK ASSIGNMENTS — đội ba AI đang hoạt động

- Quản lý: **Claude Code (Project Director)**. Lập 2026-11-21; living document.
- Cơ chế phối hợp: `docs/coordination/OWNER_DIRECTIVE_COORDINATION_MODEL_2026-11-21.md`.
- Roster: **Claude Code** (điều hành, kiến trúc, code chính, tích hợp) · **ChatGPT** (Independent Technical Lead theo cơ chế phối hợp của owner 2026-11-21: nghiên cứu chuyên sâu, tổng hợp yêu cầu, audit/phản biện, hỗ trợ module/dữ liệu/kiểm thử khi được giao) · **Gemini Hydrogen** (nghiên cứu hình ảnh/media hỗ trợ ChatGPT). DeepSeek: đã rút khỏi dự án, không giao việc.
- Kênh chuyển giao: owner chuyển yêu cầu dưới đây cho ChatGPT/Hydrogen và đưa kết quả lại (commit vào repo hoặc dán cho Claude). Claude kiểm tra nguồn/quyền, tích hợp hoặc từ chối có lý do.
- ChatGPT có quyền phản biện quyết định của Claude: ghi phản biện vào `docs/coordination/reviews/CG_CRITIQUE_<task>_<date>.md`; Claude phải trả lời bằng văn bản (chấp nhận/không chấp nhận + lý do) trong lát cắt tiếp theo.

## Quy tắc chung cho mọi deliverable

1. File Markdown/CSV đặt đúng đường dẫn ghi trong task; tiếng Việt hoặc Anh; không dán nội dung có bản quyền (không chép text/ảnh/data của Paradox).
2. Mỗi claim cơ chế V3: URL nguồn chính thức (dev diary/patch notes/Steam news/Paradox wiki chính thức) + phiên bản/ngày + mức tin cậy (verified/supported/estimated/disputed/unknown). Nguồn cộng đồng (wiki, vic3tabula) ghi rõ là cộng đồng.
3. Mỗi dữ liệu lịch sử: giá trị, đơn vị, năm, phạm vi địa lý, nguồn (tác giả/tổ chức, tiêu đề, URL, trang/bảng), ngày truy cập, phương pháp, license, confidence. Không biết → `unknown`; không đổi missing thành 0.
4. Mỗi asset/media: URL, tác giả, license chính xác (PD/CC0/CC-BY x.y…), yêu cầu attribution, ngày/vùng/thực thể, độ phân giải/định dạng, phân loại `historical_reference` / `concept_reference` / `distributable_candidate`. Chỉ `distributable_candidate` với license cho phép phân phối + sửa đổi mới được xem xét đưa vào game.
5. Kết thúc mỗi deliverable bằng mục "Open questions / conflicts" và "Recommended acceptance tests".

## Nhiệm vụ ChatGPT

| ID | Mục tiêu | Output (đường dẫn) | Phụ thuộc | Ưu tiên | Trạng thái | Tích hợp |
|---|---|---|---|---|---|---|
| CG-01 | **Market & price formation V3 1.15.1**: buy/sell orders, local vs market price, market access, price bounds, imports/exports, tariffs, trade routes/trade centers (sau 1.9 "trade rework" nếu có), convoys/blockade ảnh hưởng thế nào | `docs/research/vic3/CG01_MARKETS_PRICES_TRADE_VI.md` | — | P0 | ASSIGNED | ECON-02/03 |
| CG-02 | **Pops, needs, wealth, SoL**: pop needs categories, goods substitution, wealth levels, SoL formula inputs, radical/loyalist triggers, literacy/qualifications, migration attraction | `docs/research/vic3/CG02_POPS_NEEDS_SOL_VI.md` | — | P0 | ASSIGNED | POP-01/02/04 |
| CG-03 | **Buildings, Production Methods, employment, ownership**: PM groups, throughput, workforce composition, qualifications, hiring/firing speed, wages, profits/dividends, ownership (financial district/manor house/companies), construction sectors | `docs/research/vic3/CG03_BUILDINGS_PM_JOBS_OWNERSHIP_VI.md` | — | P0 | ASSIGNED | IND-01..04 |
| CG-04 | **Cadence research**: V3 chạy theo ngày/tuần/tháng cho từng hệ thống nào (market update, pop growth, construction progress, battles, diplomatic play phases, migration); đề xuất mapping sang cadence menu hourly/daily/weekly/monthly/yearly của chúng ta + tài liệu về Web Worker trong Android WebView (giới hạn bộ nhớ, structured clone/transfer cost) | `docs/research/vic3/CG04_CADENCE_AND_WORKER_VI.md` | CLOCK-01 spec | P0 | ASSIGNED | CLOCK-02/03 |
| CG-05 | **Politics, diplomacy & war 1.15**: law enactment (stall/success chances), IG approval/clout, movements & agitators (Voice of the People), parties/elections; diplomatic plays (sway, escalation, backing); subjects/liberty desire; Power Blocs (principles, cohesion, leverage); War Support 1.15; fronts/battles/supply; peace | `docs/research/vic3/CG05_POLITICS_DIPLOMACY_WAR_VI.md` | — | P0 | ASSIGNED | POL/DIP/MIL/WS |
| CG-06 | **Leaf-level DLC parity decomposition** cho mọi gói đã phát hành (VotP, SoI, CotS, PoE, CoC, NA, IT, TGW, SaR + art/music packs); kiểm tra lại trạng thái Century of Strife | `docs/research/vic3/CG06_DLC_PARITY_LEAVES.csv` (cột: pack, leaf_id, mechanic, shared_system, country_layer, official_source_url, version_date, notes) | ma trận parity hiện tại | P0 | ASSIGNED | PARITY-01 |
| CG-07 | **Historical data plan 1937–2026**: nguồn có license cho biên giới theo thời kỳ, dân số, GDP, chính thể/nguyên thủ; danh sách khoảng trống; đề xuất schema temporal validity | `docs/research/history/CG07_1937_2026_SOURCE_REGISTER_VI.md` | — | P1 | ASSIGNED | HIST-03 |
| CG-08 | **Android/Capacitor runtime**: App plugin pause/resume, process death, WebView memory limits, thermal API khả dụng (PowerManager thermal status) và cách đọc từ Capacitor mà không cần quyền đặc biệt | `docs/research/android/CG08_LIFECYCLE_THERMAL_VI.md` | — | P1 | ASSIGNED | CLOCK-02b, bench |
| CG-09 | **UI information architecture** (không copy skin): outliner, ledgers, tooltip causal chains, map lenses cho màn hình ngang điện thoại; acceptance checklist | `docs/research/ui/CG09_UI_INFORMATION_ARCHITECTURE_VI.md` | — | P2 | ASSIGNED | UI-01..05 |
| CG-10 | **Art direction & asset taxonomy** (điều phối Hydrogen): danh mục asset theo entity/era/vùng, tiêu chí QA hình ảnh, ước lượng footprint theo nhóm để đạt 4–5 GB bằng nội dung thật | `docs/research/media/CG10_ART_DIRECTION_ASSET_TAXONOMY_VI.md` | HY-01..05 | P1 | ASSIGNED | MEDIA-01 |
| CG-11 | **Phản biện CLOCK-01** (advisory, no-write code): đọc `docs/spec/ADAPTIVE_HOURLY_CLOCK_SPEC_VI.md` + code `src/engine/clock/*`, `src/engine/simulation.ts`, `src/ui/game/controller.ts`; tìm lỗi tất định, biên lịch, governor, save migration | `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_<date>.md` | CLOCK-01 commit | P0 | ASSIGNED | Claude trả lời ở lát cắt sau |

## Nhiệm vụ Gemini Hydrogen (qua ChatGPT)

| ID | Mục tiêu | Output | Ưu tiên | Trạng thái |
|---|---|---|---|---|
| HY-01 | Cờ và huy hiệu 1836 cho các polity trong registry (`historical_data` / `docs/audit/GLOBAL_COVERAGE.md`): nguồn PD/CC0 có xác minh, mapping polity ID, khoảng thời gian hiệu lực | `docs/research/media/HY01_FLAGS_ARMS_1836.csv` | P1 | ASSIGNED |
| HY-02 | Chân dung nguyên thủ/nhân vật 1836–1936 PD (tranh/ảnh trước 1900 hoặc đã hết bảo hộ), mapping nhân vật | `docs/research/media/HY02_PORTRAITS_1836_1936.csv` | P1 | ASSIGNED |
| HY-03 | Âm nhạc/ambience/SFX: bản ghi PD/CC0 (vd Musopen, Internet Archive PD), CC0 SFX; hướng âm thanh theo vùng/thời kỳ; bitrate/sample rate | `docs/research/media/HY03_AUDIO_SOURCES.csv` + brief | P2 | ASSIGNED |
| HY-04 | Bản đồ/terrain/texture: Natural Earth (PD), bản đồ lịch sử PD để tham chiếu biên giới 1836 | `docs/research/media/HY04_MAP_SOURCES.csv` | P1 | ASSIGNED |
| HY-05 | Reference boards công trình/nhà máy/cảng/đường sắt/tàu chiến theo thời kỳ (1836–2026) — phân loại reference vs distributable | `docs/research/media/HY05_BUILDINGS_SHIPS_REFERENCES.md` | P2 | ASSIGNED |

## Việc Claude đang làm (không giao)

CLOCK-01 (xong phiên này) → SAVE-01 → CLOCK-02 → SAVE-02; xem execution plan §6.

## Nhật ký trạng thái

| Ngày | Task | Sự kiện |
|---|---|---|
| 2026-11-21 | CG-01..11, HY-01..05 | Claude giao việc lần đầu; chờ owner chuyển cho ChatGPT/Hydrogen |
| 2026-11-21 | (owner) | Nhận gói ảnh Dev Diary #49; phân tích tại `docs/ui/V3_DEV_DIARY_49_DESIGN_REFERENCE_ANALYSIS_VI.md`. Yêu cầu tiếp: ảnh/clip bản 1.15.x cho PM, Trade Routes, Diplomatic Play, Military fronts, Power Bloc, ship designer, War Support |
| 2026-11-22 | CG-01..05, 07..10, visual catalogue | ChatGPT nộp (`b3643b3`); Claude merge `1f8896a` và review: ACCEPTED_FOR_PLANNING (`docs/coordination/reviews/CLAUDE_REVIEW_CHATGPT_RESEARCH_2026-11-22.md`) |
| 2026-11-22 | CG-11 | BLOCKED do lệch branch (CLOCK-01 nằm trên `ccr-b27f3fb8-epfpd6`) → mở lại, đọc trên branch đó |
| 2026-11-22 | CG-06 | Chưa nộp; vẫn ASSIGNED |
| 2026-11-22 | CG-10 rev, CG-01b | Giao mới: ngân sách footprint theo kiến trúc 2D; nguồn chính thức cho công thức trade/giá 1.15.x |
| 2026-11-22 | CG-11 | ChatGPT nộp phản biện (`61155ee`); Claude chấp nhận cả 5 phát hiện và sửa (`docs/coordination/reviews/CLAUDE_RESPONSE_CG11_CLOCK01_2026-11-22.md`) |
| 2026-11-22 | CG-01b, CG-06, CG-10 rev, nguồn 1.15 | Đã nộp; Claude chấp nhận để lập kế hoạch. Gói zip link ảnh chỉ có manifest (không có ảnh); không chặn tiến độ |

## Đợt giao việc 2 (2026-11-22) — ChatGPT đọc/ghi trên `ccr-b27f3fb8-epfpd6`

| ID | Mục tiêu | Output | Ưu tiên |
|---|---|---|---|
| CG-12 | Review lại các fix CG-11 tại HEAD mới nhất (đối chiếu `CLAUDE_RESPONSE_CG11_CLOCK01_2026-11-22.md`). Chỉ báo lỗi còn tồn tại hoặc lỗi mới | `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_FIXES_<date>.md` | P0 |
| CG-13 | **Nguồn dữ liệu kinh tế lịch sử 1836** cho hiệu chỉnh POP-02/ECON-02: giá hàng hóa, lương thực tế, rổ tiêu dùng, welfare ratio (ví dụ Robert C. Allen, Gregory Clark, Mitchell *International Historical Statistics*, Global Price and Income History Group). Ghi license từng bộ, đơn vị, phạm vi, độ phủ quốc gia | `docs/research/history/CG13_1836_PRICES_WAGES_BASKETS_SOURCES_VI.md` | P0 |
| CG-14 | **Đề xuất danh mục hàng hóa gốc của dự án** cho 1836–2026, không chép danh sách V3. Gồm cả hàng hiện đại (dầu, điện, ô tô, điện tử, dược phẩm…). Mỗi hàng: nhóm nhu cầu nó đáp ứng, khả năng thay thế, kỷ nguyên công nghệ xuất hiện, đơn vị vật lý | `docs/research/vic3/CG14_GOODS_TAXONOMY_PROPOSAL_VI.md` | P1 |
| CG-15 | Điều phối Hydrogen hoàn thành HY-01 (cờ/huy hiệu 1836) và HY-04 (nguồn bản đồ PD) trước; HY-02/03/05 sau | các file `docs/research/media/HY0x_*` | P1 |
| — | Ảnh chụp 1.15.x có tooltip: **hoãn**. Chỉ làm được với bản game có bản quyền; nếu owner có game trên PC thì owner tự chụp. Không chặn tiến độ | — | P3 |
