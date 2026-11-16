# S0_TEST_CATALOG — S0-B3 (G0.3)

| Trường | Giá trị |
|---|---|
| Task | S0-B3 (OD-20261116-11) |
| Mã được kiểm | Baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`, worktree tạm sạch. Mã sản phẩm và test chạy **không sửa** |
| Công cụ kiểm toán (ngoài sản phẩm) | `tools/audit/s0/test_catalog.ts` (cấu trúc tĩnh bằng TypeScript compiler API, ghép kết quả); `tools/audit/s0/vitest.assertion-count.config.ts` + `vitest-assertion-counter.setup.ts` (một hook `afterEach` quan sát số `expect` thực sự chạy, nạp nguyên `vitest.config.ts` của baseline); `tools/audit/s0/probe_empty_pass.ts` (probe chỉ đọc) |
| Nhãn | Kết quả test: `BASELINE_ORIGINAL` (mã và test không đổi). Số đếm assertion lấy qua hook quan sát của công cụ kiểm toán, không phải qua sửa test |
| Dữ liệu máy đọc | `docs/audit/s0/s0_test_catalog.json` (1 mục cho mỗi test runtime: file:dòng, chuỗi `describe`, tiêu đề, số assertion, độ ổn định, phân tích) |
| Người lập | Claude Code, 2026-11-16 (tự đánh giá, **chưa được review độc lập**) |

## 1. Tổng quan

- **51** vị trí khai báo `it(...)` trong 5 tệp test. Hai vị trí nằm trong vòng lặp (`simulation.test.ts:10/14/21` theo mode, `ui.test.ts:26/37` theo camera), nên có **58** test runtime: `modes` 16, `simulation` 13, `data` 12, `ui` 10, `content` 7. Mọi test runtime đều ghép được với đúng một vị trí khai báo.
- **Độ ổn định:** cả 58 test pass trong **7/7** lượt chạy độc lập:
  - 3 lượt máy của S0-A (`logs/a2/07–09`);
  - CI baseline run `43793446130` (`2240a8f`);
  - lượt máy kiểm trước commit B1;
  - CI B1 run `43834719406` (`382aaa8`, mã sản phẩm như baseline);
  - lượt catalog B3 (`b3/logs/b3_assertion_count_run.log`).

  Không quan sát thấy test flaky. Mọi test dùng seed cố định và chạy tất định.
- **Số assertion thực sự chạy** trong lượt catalog: từ 0 đến 15 489 mỗi test (`b3/assertions.jsonl`).

## 2. Phân loại nguy cơ "pass rỗng"

| Phân loại | Số test | Ý nghĩa |
|---|---|---|
| `none` | 40 | Assertion luôn chạy trên dữ liệu khác rỗng, hoặc có assertion bảo vệ kiểm "không rỗng" |
| `conditional` | 15 | Assertion nằm trong vòng lặp/điều kiện không có kiểm "không rỗng"; có thể pass mà không kiểm gì nếu dữ liệu đầu vào thay đổi. **Không xảy ra** ở baseline (mọi test này đều chạy > 0 assertion) |
| `vacuous_observed` | **2** | **0 assertion** chạy trong lượt catalog |
| `core_vacuous_observed` | **1** | Phần assertion mang ý nghĩa của test chạy 0 lần; chỉ assertion phụ chạy |

## 3. Phát hiện (ghi nhận, **không sửa test trong S0**)

| ID | Mức | Test | Phát hiện | Bằng chứng | Đề xuất xử lý |
|---|---|---|---|---|---|
| TC-F1 | P1 | `tests/simulation.test.ts:34` "no law flips back to a value it left within 15 years" | **Pass rỗng: 0 assertion.** AI không bao giờ đổi cùng nhóm luật hai lần trong 180 tick (`src/engine/ai/ai.ts:119`), nên không tồn tại cặp nào để test kiểm. Probe: 174 lần đổi luật, 0 cặp cùng nhóm trong 180 tick. Test không thể fail với engine hiện tại | `b3/assertions.jsonl`; `b3/probe_empty_pass.json` | Viết lại test thành phép kiểm có ý nghĩa (ví dụ khẳng định có đổi luật và không có flip-back trong mọi khoảng 180 tick), trong giai đoạn đụng tới AI/politics |
| TC-F2 | P1 | `tests/simulation.test.ts:43` "wars end: no war lasts more than 12 years" | **Pass rỗng: 0 assertion.** Test chỉ duyệt chiến tranh **còn đang diễn ra** ở cuối lượt chạy (`for (const w of st.wars)`), trong khi 0 cuộc còn diễn ra ở tick 480. **Làm rõ sau review vòng 1 (điểm D, `b3/review1/probe_war_duration_*.json`):** con số 145 là **quy ước đếm**, không phải sai lệch logic quan sát được. (1) Chỉ chiến tranh khởi đầu mới chạm quy tắc 12 năm; engine gán `start = -1` cho chiến tranh bắt đầu trước 1836 (`src/engine/init.ts:143`). (2) Với các cuộc đó, `months = st.tick - w.start` (`military.ts:122`) = 145 ở tick 144, đúng lúc điều kiện `months > 144` (`military.ts:128`) kết thúc chiến tranh; chúng tồn tại qua 144 trạng thái cuối tháng (1836-01 → 1847-12), tức đúng 12 năm trong game. (3) Chiến tranh do AI tuyên bố trong 4 kịch bản (Sandbox/Historical × 40/100 năm) dài nhất 7–9 tháng; không cuộc nào chạm quy tắc 12 năm. Chi tiết, phát hiện WD-F1…F3 và test đề xuất: `S0_B3_RESULTS.md` §4.1 | `b3/assertions.jsonl`; `b3/probe_empty_pass.json`; `b3/review1/probe_war_duration_*.json` | Theo dõi mọi chiến tranh qua từng tick, có guard "ít nhất một chiến tranh đã kết thúc", và một test biên cho quy tắc 12 năm (đề xuất ở `S0_B3_RESULTS.md` §4.1). Không sửa test trong S0 |
| TC-F3 | P2 | `tests/content.test.ts:41` "unqualified symbols … were rejected, not shipped" | **Phần cốt lõi pass rỗng:** chỉ 1 assertion phụ chạy (id tài sản là duy nhất). 68 thực thể kind `people/region/period` có liên kết và 0 tài sản không phải chân dung được đóng gói cho chúng, nên vòng kiểm `quality === 'supported'` không chạy lần nào. Tính chất "không đóng gói" đúng, nhưng test không phân biệt được "đã từ chối đúng" với "không tra cứu được gì" | như trên | Khẳng định thêm bản ghi từ chối trong `historical_data/assets/review.json` |
| TC-F4 | P2 | `tests/simulation.test.ts:21` (×2 mode) | Tên test và comment ghi "1870 benchmarks" nhưng truy vấn `date === '1875'` (dòng 21–22). `continue` (dòng 24) bỏ qua quốc gia đã diệt vong hoặc không có benchmark, nên test có thể kiểm < 5 nước. Ở seed 1 cả 5 nước đều được kiểm (10 assertion mỗi mode) | `b3/assertions.jsonl` | Sửa tên và thêm kiểm số nước đã kiểm |
| TC-F5 | P1 (đầu vào cho B4/G0.6) | `tests/simulation.test.ts:51` save/load | Chỉ có Sandbox, 1 seed (21), 1 điểm cắt (K=30, N=60), không có lệnh người chơi, không có Historical; so sánh bằng chuỗi `serialize` (gồm toàn bộ state và RNG), không báo state path đầu tiên khác nhau | mã test | B4 thực hiện đầy đủ v3.2 §6.7 |
| TC-F6 | P2 (đầu vào cho B4) | `tests/simulation.test.ts:57` | Chỉ kiểm sai `format`; không kiểm JSON hỏng, version không hỗ trợ, thiếu trường | mã test | B4 §6.7 bước 8 |
| TC-F7 | P2 | `content.test.ts:34`, `simulation.test.ts:44`, `data.test.ts:44` | Tiêu đề hứa nhiều hơn phần được kiểm: "never shown" (thực tế chỉ kiểm dữ liệu khoảng thời gian, không kiểm UI); "over the whole period" (chỉ kiểm tổng); "exactly one owner" (chỉ kiểm trường owner) | mã test | Ghi chú cho giai đoạn liên quan |

Không có test nào bị xếp `flaky`. TC-F1/TC-F2 không có nghĩa engine sai: probe cho thấy các tính chất đó đúng nhờ ràng buộc trong mã. Vấn đề là các test này **không chứng minh** được điều đó.

## 4. Danh sách 58 test

Phân tích chi tiết từng test (kiểm gì, điều kiện pass, giới hạn) nằm trong `s0_test_catalog.json`, nguồn là `b3/test_annotations.json`.

| # | Test (file:line) | Area | Title | Assertions run | Pass 7 runs | Empty-pass risk |
|---|---|---|---|---|---|---|
| 1 | `tests/content.test.ts:18` | content/licensing | every shipped image exists, has an allowed licence, an author or credit field, and a Commons source page | 2510 | 7/7 | conditional |
| 2 | `tests/content.test.ts:28` | content/integrity | assets, texts and characters only reference entities that exist in the database | 1249 | 7/7 | conditional |
| 3 | `tests/content.test.ts:34` | content/temporal validity | flags and arms are never shown outside 1836–1936 or outside their recorded period | 275 | 7/7 | conditional |
| 4 | `tests/content.test.ts:41` | content/licensing | unqualified symbols of present-day states, peoples, regions and eras were rejected, not shipped | 1 | 7/7 | **core vacuous** |
| 5 | `tests/content.test.ts:50` | content/licensing | every text carries article, URL, revision and the CC BY-SA licence | 3185 | 7/7 | none |
| 6 | `tests/content.test.ts:61` | content/temporal validity | linked polities passed the 1836 lifetime check (no silent mismatches) | 266 | 7/7 | conditional |
| 7 | `tests/content.test.ts:65` | content/characters | characters linked to Wikidata agree with the database on birth and death years (±2) | 460 | 7/7 | conditional |
| 8 | `tests/data.test.ts:11` | data/provenance | every source id cited by entities, groups and events exists | 1095 | 7/7 | conditional |
| 9 | `tests/data.test.ts:23` | data/quality labels | uses only the five quality labels | 1210 | 7/7 | none |
| 10 | `tests/data.test.ts:28` | data/provenance | a "verified" population total always carries a source; missing data is flagged as a fallback, never verified | 328 | 7/7 | conditional |
| 11 | `tests/data.test.ts:37` | data/global coverage | covers small states, not only great powers | 11 | 7/7 | none |
| 12 | `tests/data.test.ts:44` | data/map | every map region belongs to exactly one valid owner and is drawn on the map | 1325 | 7/7 | none |
| 13 | `tests/data.test.ts:49` | data/population | world population at start is consistent with Maddison (~1.04 bn in 1820, ~1.26 bn in 1850) | 2 | 7/7 | none |
| 14 | `tests/data.test.ts:54` | data/provenance | records disagreement between sources instead of choosing silently (e.g. Mexico, Portugal, India) | 4 | 7/7 | none |
| 15 | `tests/data.test.ts:67` | temporal integrity | starting heads of state are those in office on 1 Jan 1836 | 13 | 7/7 | none |
| 16 | `tests/data.test.ts:71` | temporal integrity | no leader or heir in the starting state took office or was born after the start date | 258 | 7/7 | none |
| 17 | `tests/data.test.ts:79` | temporal integrity | the historical ownership timeline is never applied to the simulation state | 3 | 7/7 | none |
| 18 | `tests/data.test.ts:84` | temporal integrity | initial alliances and wars come from CoW records active on the start date | 4 | 7/7 | none |
| 19 | `tests/data.test.ts:91` | data/population | populations of benchmark groups match their sources | 2 | 7/7 | none |
| 20 | `tests/modes.test.ts:13` | modes/parity | both modes run exactly the same systems the same number of times | 2 | 7/7 | none |
| 21 | `tests/modes.test.ts:18` | modes/parity | mode configuration only toggles historical data layers (no rule or system switches) | 1 | 7/7 | none |
| 22 | `tests/modes.test.ts:22` | modes/AI | AI activity is not reduced in either mode | 20 | 7/7 | none |
| 23 | `tests/modes.test.ts:30` | modes/historical layer | the historical layer is active only in Historical Mode | 4 | 7/7 | none |
| 24 | `tests/modes.test.ts:42` | modes/divergence | mean milestone similarity is higher in Historical Mode than in Sandbox (paired seeds) | 1 | 7/7 | none |
| 25 | `tests/modes.test.ts:48` | modes/divergence | Historical Mode does not reproduce history exactly (some milestones are missed) | 3 | 7/7 | none |
| 26 | `tests/modes.test.ts:51` | modes/historical priorities | historical priorities stop applying when their prerequisites disappear | 3 | 7/7 | none |
| 27 | `tests/modes.test.ts:69` | modes/sandbox freedom | different seeds produce different worlds | 1 | 7/7 | none |
| 28 | `tests/modes.test.ts:74` | modes/sandbox freedom | wars, alliances, territorial and institutional changes emerge | 12 | 7/7 | none |
| 29 | `tests/modes.test.ts:82` | modes/sandbox freedom | produces non-historical outcomes (territory changes that differ from the historical owner) | 1 | 7/7 | none |
| 30 | `tests/modes.test.ts:90` | AI coverage | every surviving country — including the smallest — takes AI decisions | 6 | 7/7 | conditional |
| 31 | `tests/modes.test.ts:99` | player intervention | a non-historical war declared by the player creates divergence from the AI-only run | 2 | 7/7 | none |
| 32 | `tests/modes.test.ts:106` | commands | Observer Mode rejects player commands (no country under control) | 1 | 7/7 | none |
| 33 | `tests/modes.test.ts:114` | historical succession | Victoria succeeds William IV in June 1837 and Hanover separates (Salic law) | 2 | 7/7 | none |
| 34 | `tests/modes.test.ts:120` | historical succession | Sandbox Mode does not use recorded death dates (generated or heir successions only) | 1 | 7/7 | conditional |
| 35 | `tests/modes.test.ts:128` | divergence metric | is 1.0 at start in both modes (same starting world) | 2 | 7/7 | none |
| 36 | `tests/simulation.test.ts:10` | simulation sanity | historical: no NaN/negative values in regions and countries | 3284 | 7/7 | none |
| 37 | `tests/simulation.test.ts:14` | simulation/population | historical: world population growth 1836-1876 is within a plausible band (0.2%-1.2% per year) | 2 | 7/7 | none |
| 38 | `tests/simulation.test.ts:21` | simulation/population | historical: national trends stay within a factor of 2 of the 1870 benchmarks (population: CoW; not a script) | 10 | 7/7 | conditional |
| 39 | `tests/simulation.test.ts:10` | simulation sanity | sandbox: no NaN/negative values in regions and countries | 3335 | 7/7 | none |
| 40 | `tests/simulation.test.ts:14` | simulation/population | sandbox: world population growth 1836-1876 is within a plausible band (0.2%-1.2% per year) | 2 | 7/7 | none |
| 41 | `tests/simulation.test.ts:21` | simulation/population | sandbox: national trends stay within a factor of 2 of the 1870 benchmarks (population: CoW; not a script) | 10 | 7/7 | conditional |
| 42 | `tests/simulation.test.ts:34` | AI behaviour | no law flips back to a value it left within 15 years | 0 | 7/7 | **VACUOUS (0)** |
| 43 | `tests/simulation.test.ts:43` | war resolution | wars end: no war lasts more than 12 years | 0 | 7/7 | **VACUOUS (0)** |
| 44 | `tests/simulation.test.ts:44` | AI behaviour | countries keep researching and building over the whole period | 2 | 7/7 | none |
| 45 | `tests/simulation.test.ts:51` | save/load determinism | a loaded game continues exactly like the uninterrupted game | 1 | 7/7 | none |
| 46 | `tests/simulation.test.ts:57` | save/load robustness | rejects foreign files | 1 | 7/7 | none |
| 47 | `tests/simulation.test.ts:61` | war resolution | an exhausted attacker that is winning stays in the war | 1 | 7/7 | none |
| 48 | `tests/simulation.test.ts:73` | war resolution | an exhausted attacker that is losing gives up | 1 | 7/7 | none |
| 49 | `tests/ui.test.ts:26` | UI/map labels | portrait: no two labels overlap and all stay on screen | 61 | 7/7 | none |
| 50 | `tests/ui.test.ts:37` | UI/map labels | portrait: every country name is anchored inside its own country | 7 | 7/7 | conditional |
| 51 | `tests/ui.test.ts:26` | UI/map labels | landscape: no two labels overlap and all stay on screen | 40 | 7/7 | none |
| 52 | `tests/ui.test.ts:37` | UI/map labels | landscape: every country name is anchored inside its own country | 5 | 7/7 | conditional |
| 53 | `tests/ui.test.ts:26` | UI/map labels | zoomedOut: no two labels overlap and all stay on screen | 131 | 7/7 | none |
| 54 | `tests/ui.test.ts:37` | UI/map labels | zoomedOut: every country name is anchored inside its own country | 11 | 7/7 | conditional |
| 55 | `tests/ui.test.ts:41` | UI/map labels | the player country is labelled at the Europe zoom | 1 | 7/7 | none |
| 56 | `tests/ui.test.ts:48` | UI/market data | every market with prices has per-good supply, demand, imports and shortage after a month | 15489 | 7/7 | conditional |
| 57 | `tests/ui.test.ts:59` | save/load compatibility | survives save/load, and saves written before the field existed still load | 3 | 7/7 | none |
| 58 | `tests/ui.test.ts:68` | UI/budget data | monthly finance lines add up to the income and expense the engine applied | 503 | 7/7 | none |

## 5. Tái lập

```bash
# Trong một checkout sạch của 2240a8f đã build (npm ci; npm run data; npm run map; npm run content):
S0_BASE_CONFIG=$PWD/vitest.config.ts S0_ASSERTION_LOG=/tmp/assertions.jsonl \
  npx vitest run --config <repo>/tools/audit/s0/vitest.assertion-count.config.ts \
  --reporter=verbose --reporter=json --outputFile=/tmp/vitest-results.json
npx tsx <repo>/tools/audit/s0/probe_empty_pass.ts $PWD > /tmp/probe_empty_pass.json
# Rồi chạy test_catalog.ts với các tham số ghi trong b3/logs/b3_test_catalog_build.log (exit 0)
```

## 6. Kết quả cổng

**G0.3 Test catalog: `PASS`** (Claude tự đánh giá, chờ review):
- mọi test runtime đều được phân tích, có file:dòng;
- độ ổn định 7/7;
- nguy cơ pass rỗng đã phân loại bằng số đếm thực tế, gồm 2 test pass rỗng và 1 test rỗng phần cốt lõi (TC-F1–F3, ghi P1/P2 cho B7).

PASS ở đây là PASS của **cuộc kiểm kê**, không có nghĩa bộ test đủ tốt: các phát hiện trên vẫn mở.
