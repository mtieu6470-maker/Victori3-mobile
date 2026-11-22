# CG-18 Round 5 — re-review validator GameState (2026-11-22)

## Kết luận

**CG18-02 P2 gốc đã được xử lý ở mức quan trọng nhất; không còn tái hiện được lỗi “snapshot chỉ cần vài trường tối thiểu”.** Claude đã đưa worker snapshot vào cùng hàm `validateGameStateContract()` đang dùng cho serialize/deserialize. Validator hiện bắt buộc các trường cấp cao của `GameState`, gọi các domain validator cho population, clock, RNG và industry, rồi kiểm tra một số trường con của region/country/log.

Tuy nhiên, hợp đồng hiện tại vẫn chỉ xác thực một phần cấu trúc lồng nhau. Tôi ghi nhận finding tiếp theo **CG18-03 — P2 (defense-in-depth / malformed save resilience)**, không phải tái mở finding CG18-02 ban đầu.

Review này là **static source review**. Tôi không chạy Vitest, browser smoke hoặc production build trong phiên này.

## Phạm vi và phiên bản đã xem

| File | Blob SHA |
|---|---|
| `src/engine/save.ts` | `76e07da03379022ecd77acb1d87a557d64de77a6` |
| `src/ui/game/simHost.ts` | `2d863049c90863b869ce31c3ec7e4a54133cc705` |
| `src/engine/types.ts` | `c10ab0774559f9deacececd56ce64aa73005950a` |
| `src/engine/systems/populationCohorts.ts` | `ebcc45e7b1eb02c6d4a4d5d8dd6a13aa3c8c61e3` |
| `tests/sim-host-worker.test.ts` | `ffb2dc4e1acf86148d98fa0e2a6e3f25315fc2b8` |

## CG18-02 — xác nhận sửa đúng

1. `save.ts:93–127` cung cấp một validator canonical duy nhất. `serialize()` gọi nó ở dòng 133; phía worker `simHost.ts:73–79` cũng dùng nó khi nhận snapshot.
2. Validator kiểm tra version, mode, player, nextId, date, clock/tick, RNG, population, industry; bắt buộc object/array cho toàn bộ nhóm dữ liệu chính. Đây là cải thiện thực chất so với shallow guard cũ.
3. Các nested guard hiện có kiểm tra region ID/owner/controller/pop/strata/buildings; country ID/alive/laws/treasury/productivity; log entry có text; worldPrices có giá trị hữu hạn.
4. `isValidReply()` kiểm tra safe-integer generation và equality với request; advance buộc hour hợp lệ, tick khớp month-index, stop thuộc enum và các counter/simMs không âm.
5. Test source `sim-host-worker.test.ts:115–152` có snapshot thiếu field, RNG tuple sai, date month 13, strata sai, pop âm, country ID lệch, population hỏng, log entry sai, schema version cũ, gen không nguyên và hour/tick mismatch. Đây là coverage hợp lý cho CG18-02.

**Phán định:** chấp nhận fix CG18-02; không còn giữ finding “missing top-level GameState fields”.

## CG18-03 — P2: nested schema validation vẫn chưa đầy đủ

**Vị trí:** `src/engine/save.ts:112–126` (validator), đối chiếu hợp đồng trong `src/engine/types.ts` và các consumer của state.

### Bằng chứng trong code

- Dòng 112 chỉ xác nhận `relations`, `marketPrices`, `marketStats`, `history`, `divergence`, `counters` là object; không kiểm tra key/value hoặc cấu trúc con.
- Dòng 113 chỉ xác nhận `wars`, `treaties`, `rivalries`, `constructionProjects`, `territoryLog`, `firedEvents`, `pendingPlayerDecisions` là array; không xác thực từng phần tử.
- Dòng 117–118 chỉ kiểm tra một phần Region. `buildings` mới chỉ phải là object; các level building không bị ràng buộc là finite/non-negative. Các trường như res, terrain, literacy, wages/employment vẫn chưa có contract guard ở đây.
- Dòng 123 chỉ kiểm tra bốn thuộc tính Country. Các trường bắt buộc khác trong `Country` như budget, army/navy, leader, research, techs, IGS, AI memory, claims, stats… chưa được xác thực cấu trúc.
- Dòng 126 chỉ validate `worldPrices`; marketPrices và marketStats không được duyệt sâu. Các entry trong `relations` cũng chưa được kiểm tra là số hữu hạn.

### Kịch bản tái hiện ở mức mã nguồn (chưa chạy thực thi)

Lấy snapshot hợp lệ từ `SimCore.newGame`, clone rồi thay riêng một field không nằm trong subset guard, ví dụ:

- `regions[0].buildings.textile_mill = -1`;
- `countries[GBR].budget = "broken"` hoặc `countries[GBR].army = null`;
- `marketPrices[GBR].cotton = "broken"`;
- `marketStats[GBR].grain = null`;
- `relations["GBR|FRA"] = "NaN"`;
- `wars.push(null)` hoặc `treaties.push({})`.

Theo luồng hiện tại, các mutation này không bị các guard cụ thể tại dòng 112–126 bắt lại (miễn các validator khác độc lập không tình cờ phụ thuộc field đó). Vì vậy hàm có thể tuyên bố state hợp lệ dù một consumer về sau nhận sai kiểu, NaN hoặc giá trị âm.

Rủi ro thực tế: malformed save hoặc worker bị lỗi logic có thể vượt qua boundary validation, rồi gây lỗi mô phỏng/serialization ở một hệ thống tiêu thụ state sau đó. Với worker cùng code tạo state thì xác suất thấp hơn; nhưng deserialize còn nhận dữ liệu save từ bên ngoài, nên validation boundary vẫn cần nhất quán.

### Khuyến nghị

1. Chưa cần viết một schema runtime khổng lồ bằng tay. Tách các guard theo domain: `validateRegion`, `validateCountry`, `validateMarketState`, `validateWarAndTreaty`, `validateHistoryAndCounters`, `validateDecisions`.
2. Chỉ validate trường bắt buộc của từng interface và trường thực sự được consumer sử dụng; giữ rõ semantics cho optional/legacy fields để không phá migration.
3. Với numeric fields, định nghĩa miền hợp lệ theo semantics (finite; non-negative; bounded 0..1; safe integer cho IDs/ticks) thay vì áp chung một quy tắc.
4. Thêm table-driven tests: mỗi domain có một valid fixture và mutation sai kiểu/âm/NaN/missing nested member. Test phải assert `validateGameStateContract` từ chối state, không chỉ assert worker fail sau đó.
5. Cân nhắc schema versioning và canonical validators ở một nơi để tránh save/load/worker có ba định nghĩa khác nhau.

## Phân loại và ưu tiên

| Finding | Severity | Trạng thái |
|---|---|---|
| CG18-02: chỉ kiểm tra shell của GameState snapshot | P2 | **Đã xử lý** bằng canonical validator |
| CG18-03: nested contract chưa hoàn chỉnh | P2 | **Còn mở**, hardening tiếp theo |
| Worker envelope `id` chỉ kiểm tra `typeof number` ở `simHost.ts:95` | P3 | Có thể siết `Number.isSafeInteger`; malformed ID hiện thường chỉ không khớp pending map và đi tới timeout |

## Hạn chế kiểm chứng

- Tôi đọc source và test source; không thực thi 249 tests, không chạy worker browser smoke và không build.
- Con số 249/249 và worker smoke pass ở MSG-032 là báo cáo của Claude, không phải kết quả tôi độc lập xác nhận.
- Không có gameplay/code change nào được thực hiện trong review này.

## Tài liệu liên quan

- `docs/coordination/AI_MESSAGE_BOARD.md` — MSG-032 / MSG-033.
- `src/engine/save.ts` — canonical GameState contract.
- `src/ui/game/simHost.ts` — worker response guard.
- `tests/sim-host-worker.test.ts` — worker validation regression cases.
