# ĐỀ XUẤT KIẾN TRÚC — DAILY SIMULATION CLOCK & SYSTEM CADENCE

**Task:** TIME-ARCH-01  
**Status:** DESIGN ONLY / PRE-IMPLEMENTATION  
**Date:** 2026-11-20  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Design base HEAD:** `88baaf9c076f615a721436da1fdba0a33d4b9326`  
**Runtime authorization:** NONE  
**Owner decision:** REQUIRED before any engine tick, save schema, system cadence or runtime implementation.

> Mục tiêu của tài liệu là thiết kế chuyển đổi an toàn từ monthly-only simulation sang lịch ngày có cadence hỗn hợp. Đây không phải quyết định sản phẩm cuối cùng và không cấp quyền sửa runtime. Các gate S0/S1/S22 hiện tại giữ nguyên.

---

## 1. Vấn đề hiện tại

Bằng chứng tại HEAD thiết kế:

- `src/engine/types.ts`: `GameDate` chỉ có `y` và `m`; `GameState.tick` là chỉ số tháng.
- `src/engine/core.ts`: `dateToTick()` và `tickToDate()` quy đổi 12 tick/năm; `dateStr()` luôn trả ngày mùng 1.
- `src/engine/simulation.ts`: `stepMonth()` tăng tick, chạy toàn bộ pipeline mỗi tháng, sau đó mới lấy mẫu năm.
- `src/ui/game/controller.ts`: tốc độ realtime hiện được tính bằng mili-giây trên mỗi tháng; DEV-006 chỉ giới hạn tốc độ bộ lập lịch, không đổi độ phân giải lịch mô phỏng.
- Các cooldown, thời hạn chiến tranh, tiến độ cải cách, sản xuất, POP, ngoại giao và AI đang dùng cùng đơn vị monthly tick. Một số logic có chu kỳ 3/6/12/24/36/48/60/72/144 tick.

**Kết luận:** không thể đổi `tick += 1` thành ngày bằng một sửa đổi cục bộ. Nếu làm vậy, mọi cooldown, tốc độ tăng trưởng, xác suất, chi phí và thời hạn đang hiệu chỉnh theo tháng sẽ thay đổi ý nghĩa.

## 2. Mục tiêu kiến trúc

1. Lịch game có độ phân giải ngày, ngày tháng hợp lệ theo lịch Gregorian và không phụ thuộc timezone/đồng hồ thiết bị.
2. Không chạy toàn bộ mô phỏng kinh tế toàn cầu mỗi ngày nếu hệ thống không cần cadence đó.
3. Ngày chính xác được dùng cho sự kiện, di chuyển/chiến dịch quân sự và các thời hạn cần độ phân giải ngày.
4. Các hệ thống tháng/năm tiếp tục được thực thi đúng ranh giới lịch, không tích lũy sai số làm tròn.
5. Cùng seed + cùng lệnh người chơi + cùng phiên bản engine/data tạo cùng kết quả, độc lập tốc độ render, FPS, thiết bị và cách chia batch.
6. Save cũ không bị diễn giải lại âm thầm; migration phải xác định được ngày tương ứng và có kiểm chứng.
7. Có thể chạy campaign 1836–2026 mà không buộc xử lý toàn bộ hệ thống nặng mỗi ngày.

## 3. Mô hình thời gian đề xuất

### 3.1 Canonical calendar

Đề xuất canonical date:

```ts
interface GameDate {
  y: number;
  m: number; // 1..12
  d: number; // 1..daysInMonth(y, m)
}
```

- Dùng lịch Gregorian proleptic để có quy tắc leap-year xác định cho toàn bộ timeline.
- Engine calendar không sử dụng `Date.now()`, timezone, DST hay locale.
- Tạo hàm thuần: `isLeapYear`, `daysInMonth`, `dateToDayIndex`, `dayIndexToDate`, `addDays`, `compareDate`.
- `dayIndex` là số ngày nguyên từ epoch được định nghĩa rõ (đề xuất 1836-01-01); không tái sử dụng tên `tick` mơ hồ.
- Ngày bắt đầu campaign phải là dữ liệu start-date, không hard-code 1836 trong hàm quy đổi.
- Giữ hàm chuyển đổi monthly legacy riêng, không dùng chung một biến có hai đơn vị.

### 3.2 Hai lớp thời gian tách biệt

- **Simulation calendar:** ngày game nguyên, tăng đúng một ngày khi engine tiến một bước.
- **Wall-clock scheduler:** chỉ quyết định khi nào yêu cầu engine tiến ngày; không được tham gia vào kết quả mô phỏng hoặc RNG.

Engine API dự kiến:
- `advanceDay(state)`: tiến đúng một ngày game và chạy các hook đến hạn.
- `advanceDays(state, count)`: gọi lặp xác định, có giới hạn batch/yield do caller điều khiển.
- `runDailySystems`, `runWeeklySystems`, `runMonthlySystems`, `runAnnualSystems`: các cadence tách biệt, không để UI tự gọi hệ thống.

Không duy trì một `stepMonth()` vừa là đơn vị lưu trữ vừa là đơn vị scheduler sau khi migration hoàn tất. Có thể giữ adapter legacy tạm thời trong migration window, nhưng adapter phải gọi đúng số ngày của tháng.

## 4. Cadence matrix — đề xuất sơ bộ, cần subsystem owner/reviewer xác nhận

| Hệ thống | Cadence đề xuất | Lý do / điều kiện |
|---|---|---|
| Calendar, deadline, event eligibility | Daily | Sự kiện có ngày cụ thể, thời hạn và trigger chính xác |
| Military operations | Daily hoặc event-driven | Di chuyển, battle, occupation, supply attrition và blockade cần phản ứng theo ngày; không nhất thiết quét mọi đơn vị mỗi ngày |
| Diplomacy crisis / diplomatic play | Daily state transition; strategic evaluation weekly | Deadline/escalation chính xác; quyết định chiến lược không cần full scan mỗi ngày |
| Naval/convoy route incidents | Daily/event-driven | Rủi ro tuyến biển và blockade cần thời gian thực trong lịch game |
| AI strategic planner | Weekly | Lập kế hoạch trung hạn, giảm CPU; chỉ đánh giá quốc gia/actor bị dirty hoặc đến lịch |
| AI budget / construction / research | Monthly | Hợp với kế toán, tiến độ và dữ liệu đầu vào hiện tại; cần tái hiệu chỉnh nếu đổi |
| Economy / market clearing / prices | Monthly | Giá và chuỗi cung ứng được mô hình theo tháng; daily clearing có thể gây chi phí lớn và thay đổi mô hình |
| POP demography / migration / needs / wages | Monthly | Giữ calibration hiện có trong bước đầu; các cú sốc ngày được ghi nhận rồi settlement ở tháng |
| Politics / law progress / IG | Monthly, deadline daily | Tiến độ cải cách hiện tính theo tháng; deadline và trigger khẩn cấp phải nhận biết ngày |
| Technology research | Monthly | Tiến độ research hiện monthly; unlock có hiệu lực đúng ngày boundary đã định |
| Secession / revolution checks | Weekly or monthly + event trigger | Không quét toàn cầu hàng ngày; trigger khi threshold hoặc biến động chính trị quan trọng xảy ra |
| Annual metrics / historical benchmark sampling | Annual | Chỉ chạy tại ranh giới năm; định nghĩa rõ lấy mẫu đầu hay cuối năm |

**Lưu ý:** đây là phân loại thiết kế, không phải cadence đã được duyệt. Đặc biệt military/diplomacy có thể cần cadence theo từng subsystem và event-driven scheduling; không được gộp toàn bộ quân sự thành một hàm daily nặng.

## 5. Quy tắc boundary và thứ tự xử lý

Một ngày game phải có thứ tự ổn định, được version hóa. Đề xuất:

1. Xác lập ngày mới và kích hoạt scheduled events có timestamp ngày đó.
2. Áp dụng lệnh người chơi đã được xác nhận cho ngày đó theo command ordering contract.
3. Xử lý daily operations (quân sự, logistics/convoy, diplomatic-play deadlines) theo thứ tự subsystem cố định.
4. Xử lý event consequences và state transitions; không chạy lại cùng event hai lần.
5. Nếu là boundary tuần: chạy weekly AI/planner sau khi daily facts đã cập nhật.
6. Nếu là ngày cuối tháng: chạy monthly settlement theo thứ tự được chốt (market/economy → POP/labor → fiscal → politics → research/diplomacy/AI theo contract cuối cùng).
7. Nếu là boundary năm: chạy annual sampling sau monthly settlement cuối cùng của năm.
8. Commit ngày hoàn tất; cập nhật audit/event sequence và deterministic checkpoint.

Thứ tự trên chỉ là phương án. Cần test causal dependencies để chốt ordering; không tự suy diễn từ thứ tự pipeline hiện tại.

## 6. Event scheduler và hiệu năng

- Dùng priority queue / calendar buckets cho event có ngày kích hoạt; key tối thiểu: `(dayIndex, phaseOrder, stableEventId)`.
- Không quét toàn bộ lịch sử event mỗi ngày. Chỉ lấy event đến hạn.
- Actor/system có cờ dirty hoặc nextEvaluationDay để tránh full-world scans.
- Mọi iteration phải có thứ tự ổn định theo stable ID; không dựa vào thứ tự property enumeration không được cam kết.
- Event reschedule/cancel phải idempotent; một event chỉ fire một lần theo identity + schedule version.
- Daily batch có ngân sách công việc đo được; nếu cần yield, chỉ yield giữa các ngày hoặc sau checkpoint xác định, không tách nửa chừng một transition.
- Mobile background/pause không tạo catch-up burst. Người chơi chọn tiếp tục simulation; scheduler không tự bù vô hạn thời gian thiết bị đã ngủ.

## 7. Determinism và RNG

Rủi ro lớn nhất khi thêm daily cadence là thay đổi thứ tự gọi RNG toàn cục. Chỉ thêm một random draw mỗi ngày có thể làm thay đổi toàn bộ chuỗi kết quả sau đó, kể cả những hệ thống không liên quan.

Đề xuất:
- Không để wall-clock hoặc FPS gọi RNG.
- Version hóa simulation ordering và random contract.
- Nghiên cứu tách RNG streams theo subsystem (và khi cần actor/event) hoặc counter-based keyed randomness theo `seed + subsystemId + stableEntityId + dayIndex + purposeId`.
- Không chuyển sang random streams mà không có migration/version boundary và golden deterministic fixtures.
- Save phải giữ đủ state RNG/stream counters để resume cho ra cùng kết quả.
- So sánh cùng seed trên nhiều batch size, pause/resume, save/load và tốc độ render khác nhau; kết quả state hash phải trùng.

## 8. Save schema và migration legacy

Không sửa save trong task thiết kế này. Khi được cấp quyền, migration cần:

1. Đọc và xác thực đầy đủ save envelope/version hiện hành.
2. Nếu save cũ chỉ có monthly `tick` và `date.y/m`, ánh xạ về ngày đầu tháng tương ứng (ví dụ 1836-04 → 1836-04-01), trừ khi hợp đồng lịch sử của save cũ chứng minh một semantics khác.
3. Lưu rõ `calendarVersion`, `engineVersion`, `saveSchemaVersion`, `dayIndex`, canonical date và nguồn migration.
4. Không coi `legacyMonthTick` là daily tick; giữ metadata legacy để audit và rollback.
5. Chạy migration trên bản sao, validate invariants, serialize rồi deserialize, so sánh các aggregate quan trọng.
6. Nếu dữ liệu không nhất quán hoặc version không hỗ trợ, fail closed; không âm thầm reset ngày hoặc tiến trình.
7. Có fixture cho từng save version đã phát hành; kiểm tra continuation determinism sau migration.
8. Chỉ xóa adapter monthly khi toàn bộ save compatibility matrix và owner signoff cho phép.

**Rủi ro:** ánh xạ ngày đầu tháng không khôi phục được ngày thực tế đã trôi qua trong tháng save cũ. Đây là mất độ phân giải không thể phục hồi; phải hiển thị/ghi nhận semantics này thay vì giả vờ chính xác.

## 9. Realtime speed policy

- Scheduler nhận số ngày game muốn tiến theo lựa chọn speed, không truyền elapsed wall-clock vào engine.
- Mỗi speed cần có thông số owner-approved: milliseconds per game day hoặc game-days per second.
- Speed 5 vẫn phải có giới hạn; không được dùng interval 0 hoặc gắn với render FPS.
- Background pause, tab suspension và app resume phải có semantics rõ: mặc định pause simulation, không tự động tiến ngày để bù thời gian offline.
- Có giới hạn số daily steps mỗi callback và yield có kiểm soát để tránh ANR/jank.
- Không chốt các con số speed trong tài liệu này; cần playtest trên thiết bị mục tiêu và đo campaign speed/CPU/thermal.

## 10. Migration matrix — monthly → daily

| Concern | Hiện tại | Đích đề xuất | Điều kiện trước migration |
|---|---|---|---|
| Date | year + month | year + month + day | Gregorian utility + leap-year tests |
| Tick | month index | day index | Separate names/units; no silent reinterpretation |
| Economy | monthly | monthly settlement | Recalibrate all formulas only if daily inputs are introduced |
| POP | monthly | monthly settlement initially | Cohort identity/needs/labor contracts reviewed |
| Politics | monthly progress | monthly progress + daily deadlines | law/IG cadence contract |
| Military | monthly abstract | daily/event-driven operations | formations/fronts/logistics design and tests |
| Diplomacy | monthly checks | daily deadlines + weekly planning | diplomatic play lifecycle design |
| Events | month/date windows | exact day eligibility | stable scheduler identity and duplicate-fire tests |
| AI | monthly | weekly planning + monthly execution | deterministic plan lifecycle and bounded CPU |
| Annual stats | January sampling | explicit year-end or year-start contract | benchmark semantics decision |
| Saves | monthly tick/date | versioned daily calendar | migration fixtures, rollback, exact continuation |
| RNG | one global stream | versioned subsystem streams/counters | golden fixtures and old-save policy |
| UI | displays year/month | full date + speed/day | UX and accessibility review |

## 11. Required test and benchmark plan

### Calendar correctness
- Gregorian leap years: 1800/1900 non-leap, 2000/2400 leap; month lengths; year rollover.
- Date/index round-trip for every date in a multi-century interval.
- Negative/invalid dates rejected; no silent normalization unless explicitly specified.
- Timezone and DST changes on host device have no effect.

### Cadence correctness
- Monthly systems run exactly 12 times per year; annual systems exactly once.
- Weekly cadence crosses month/year boundaries without duplicate or skipped evaluations.
- Daily deadline/event fires on the exact intended date, once only.
- A month-end day triggers monthly settlement exactly once and in fixed order.
- Event-driven triggers are idempotent and stable under save/load.

### Determinism and migration
- Same seed/commands with different batch sizes and render rates produce identical state hashes.
- Pause/resume and save/load at arbitrary dates preserve continuation.
- Legacy monthly saves migrate to first day of month with explicit migration metadata.
- Golden save fixtures preserve date, ownership, POP totals, treasury, wars, treaties, event history and RNG continuation.
- Historical and Sandbox share the same calendar and cadence engine.

### Performance
- Benchmark daily advancement for full-world state and long campaigns; measure p50/p95 day cost, monthly boundary spikes, peak memory, GC and UI frame time separately.
- Test worst-case active wars, many scheduled events and dense diplomacy.
- Measure on actual target Android device before setting performance budgets. Desktop/CI timing is not a substitute for iQOO evidence.
- Test 1836–2026 fast-forward and normal play for deterministic state parity and no unbounded queue growth.

## 12. Risks and unresolved owner decisions

| ID | Decision / risk | Proposed default | Decision owner |
|---|---|---|---|
| TIME-OD-01 | Campaign epoch and date semantics | Explicit start date; historical start 1836-01-01 | Project owner |
| TIME-OD-02 | Daily vs hybrid cadence by subsystem | Hybrid daily/weekly/monthly/annual | Project owner after subsystem review |
| TIME-OD-03 | Military daily detail | Daily/event-driven only for operations that require it | Project owner + military design |
| TIME-OD-04 | Weekly boundary definition | Monday 00:00 game calendar, deterministic independent of locale | Project owner |
| TIME-OD-05 | Monthly settlement ordering | Publish exact subsystem ordering after dependency audit | Project owner + technical lead |
| TIME-OD-06 | Yearly sample semantics | Year-end snapshot after December settlement | Project owner + data/benchmark owner |
| TIME-OD-07 | Legacy save mapping | First day of saved month with migration notice | Project owner |
| TIME-OD-08 | RNG compatibility | New versioned subsystem streams; preserve old engine version for old saves if feasible | Project owner |
| TIME-OD-09 | Real-time speed values | Five nonzero owner-approved day intervals, calibrated on target device | Project owner |
| TIME-OD-10 | Offline resume semantics | Pause while app/background inactive; no elapsed-time catch-up | Project owner |

## 13. Explicit non-goals and gate constraints

- No runtime/source/test/schema/data/assets/Android/workflow/signing changes are part of this proposal.
- No conversion of `GameState.tick`, `GameDate`, `stepMonth()` or existing monthly cooldowns is authorized.
- No economic, POP, politics, military, diplomacy, technology or AI formula is changed.
- No daily-tick feature is claimed as implemented.
- S0 remains PARTIAL/BLOCKED; S1 remains NOT_STARTED; S22 remains DESIGN_ONLY; S23 remains closed, according to the current handoff/gate records.
- This proposal does not open a phase, satisfy a gate, replace an independent review or constitute owner acceptance.
- Any future implementation requires a separately approved scope, cadence contract, save migration plan, determinism plan, tests, mobile benchmarks and independent review.

## 14. Recommendation

Adopt a **hybrid daily calendar with weekly strategic evaluation and monthly economic/social settlement**, not a naïve “run every system every day” loop. This preserves meaningful daily military/event chronology while avoiding a 12× or 30× cost increase for systems whose existing rules are calibrated monthly.

The next engineering action after design review should be a separately authorized calendar utility + pure date/index tests, isolated from the live GameState migration. Do not touch the runtime tick loop until the owner and phase gates explicitly authorize the migration.


## 15. Code-grounded cadence inventory — verified at c5193894f5e2

This appendix maps the proposal to the actual engine at the design baseline. Line references are from that baseline; later edits must refresh them. The classifications below are recommendations, not runtime authorization.

| Current file/function | Current monthly behavior / state dependencies | Proposed target cadence | Migration rule / hazard |
|---|---|---|---|
| `simulation.ts:stepMonth` | Increments `tick`, assigns `tickToDate`, runs every system in fixed order, then annual sample and cohort projection refresh | Replace with one canonical day advance plus explicit boundary hooks | Preserve one authoritative scheduler; never call monthly pipeline once per day |
| `economy.ts:computeEconomy` | Full market clearing, regional production, employment/wages, price formation, GDP and finance; fiscal amounts divide by 12 | Monthly settlement | Keep monthly formulas unchanged in first daily-calendar release; daily military consumption must not read stale market output without a contract |
| `economy.ts:constructionMonth` | Advances one state and one private project per country; invests at most `totalCost/12`; `createdTick` stores current tick | Monthly | `createdTick` becomes a month-index or explicit creation date, not raw dayIndex; preserve minimum 12 funding ticks semantics |
| `population.ts:populationMonth` | Annual demographic rates are divided by 12; literacy convergence and strata movement use monthly coefficients; migration happens in a monthly batch | Monthly initially | Do not multiply birth/death/migration by 30.4; preserve the existing monthly transition exactly until a separately calibrated demographic model exists |
| `politics.ts:updatePolitics` / `politicsMonth` | IG clout, legitimacy and regional radicalism are recalculated monthly; reform progress adds a monthly increment | Monthly | Reform progress is a monthly quantity; daily call would accelerate laws by ~30× |
| `politics.ts:revolutionCheck` | Called from monthly political update and uses threshold/random logic | Monthly + event-triggered threshold recheck | If a daily trigger is introduced, split pure eligibility from state mutation; avoid extra RNG draws each day |
| `politics.ts:secessionCheck` | Returns unless `tick % 6 === 0` | Monthly/half-year boundary + event-trigger | Six monthly ticks means every six months, not every six days |
| `technology.ts:technologyMonth` | Adds monthly research points and completes technology at threshold; tech availability reads current year | Monthly | Research points are not daily points; unlock should become active at a deterministic monthly boundary |
| `diplomacy.ts:diplomacyMonth` | Returns unless `tick % 3 === 0`; relations converge by 4% per execution; infamy decays by 0.25 per execution | Monthly relation/infamy settlement; weekly/daily deadlines only after diplomatic-play state machine exists | Repeated daily application of 4% convergence or 0.25 infamy decay changes rates drastically |
| `military.ts:militaryMonth` | Replenishes manpower, adjusts navy strength, refreshes quality/supply/morale, reduces peace-time exhaustion; calls `warMonth` once per month | Split: monthly readiness/recruitment; daily/event-driven operational movement only after new unit/front/logistics model; monthly strategic war settlement initially | Calling `warMonth` daily would multiply battles, casualties, score smoothing and exhaustion by ~30; do not simply rename it `militaryDay` |
| `military.ts:warMonth` | One to three abstract battles per month; casualties and devastation per battle; score smoothing `0.85/0.15`; stalemate at 72 months, hard stop at 144 months | Keep current abstract battle settlement monthly until daily operation model is designed | War `start` and duration thresholds are month units; new operational daily events need distinct fields |
| `events.ts:eventsMonth` | Scans exogenous records by month tick; random drought/epidemic/blight hazards use annualized probabilities divided by 12; succession mortality uses age-dependent annual q divided by 12 | Exact-date queue for dated events; monthly stochastic hazard settlement until a hazard model is approved; succession monthly | Convert monthly hazard to per-day hazard using month length and survival compounding, not `p/30` blindly; preserve random draw ordering/version |
| `ai.ts:aiMonth` | Runs budget/construction/reform/diplomacy/war decisions; `stagger()` schedules by monthly tick | Weekly strategic evaluation plus monthly budget/construction/research execution | AI cooldowns and stagger periods currently use month units; do not reuse as day counts |
| `divergence.ts:divergenceMonth` | Evaluates historical divergence milestones/territory and similarity on monthly state | Monthly or event-triggered, with annual aggregate checkpoints | Must not become a full-world daily scan; dated milestone eligibility can be queued |
| `metrics.ts:sampleYear` | Called when date month is January, after the January monthly pipeline | Annual | Existing sample semantics are a January-boundary sample after that month's systems; changing to Dec 31 year-end changes data meaning and requires owner approval |
| `populationCohorts.ts:refreshPopulationState` | Rebuilds cohort projection after all monthly systems finish | After monthly settlement, and only after any daily cohort-affecting transitions if those are added | Never rebuild partially through a transition; maintain one authoritative projection boundary |
| `save.ts` | Save schema v2 stores monthly `tick`, year/month date, global RNG state and state payload; v1→v2 migration adds cohort projection only | New calendar/save schema version with explicit engine/calendar versions | Existing v1/v2 saves must map month to first day of month with explicit loss-of-precision metadata; do not mutate old `tick` in place |

### 15.1. Confirmed monthly-unit fields and thresholds to migrate individually

The following fields are not all interchangeable even though several currently store `st.tick`:

- `GameState.tick`: month index since 1836; also used by logs, territory/divergence entries and counters.
- `War.start`: month index; current stalemate/hard-stop thresholds are 72/144 months.
- `Country.lastWarLost`: month index; politics applies a 60-month post-defeat penalty.
- `AIMemory.cooldowns`, `lawHistory[].tick`, `Reform.startedTick`: monthly timing for anti-oscillation, cooldown and reform timeout.
- `ConstructionProject.createdTick`: FIFO tie-break/creation ordering for monthly project queues.
- `Region.epidemic.until`, `Region.blight.until`: monthly expiry tick; epidemic rate is annual mortality converted by division by 12.
- `LogEntry.tick`, `TerritoryChange.tick`, `DivergenceState.entries[].tick`, `pendingPlayerDecisions[].id`: chronology/identity fields; must retain stable identity and readable dates after migration.
- `Treaty.start`: month index; treaty expiry is not implemented yet but future expiry must use an explicit calendar date or duration unit.

Do not bulk-multiply every numeric tick by 30 or 365. Some fields represent elapsed months, some are identifiers/ordering metadata, and some are expiry boundaries. Each needs a named unit and a field-specific migration rule.

### 15.2. Existing monthly coefficients that cannot be replayed daily

Examples verified in source:

- Demography: `populationMonth` applies `(birth - death) / 12`; literacy and strata movement also divide or scale for monthly progression.
- Public finance: tax, tariffs, army/navy costs, debt interest and private investment divide annual amounts by 12.
- Construction: each monthly funding pass invests at most `totalCost / 12`.
- Diplomacy: relation convergence is 4% per 3-month execution; infamy decay is 0.25 per execution.
- Military: manpower reinforcement, navy growth, peace exhaustion decay and war battle count are per monthly execution; war score is smoothed once per month.
- Events: drought/epidemic/blight annual probability is split across 12 monthly opportunities; leader death chance is age-based annual probability split across 12.
- Politics: legitimacy/radicalism smoothing, reform progress and timeout/cooldown values are monthly.

If any such process is ever made daily, preserve its intended monthly/annual cumulative transition mathematically and test it against the old monthly baseline. For a monthly event probability (p_m) distributed over (D) days, the per-day independent hazard candidate is (p_d = 1-(1-p_m)^{1/D}); the probability semantics and RNG model must still be explicitly approved. For a deterministic monthly multiplier (M), a daily multiplier candidate is (M^{1/D}), but only if the original transition is multiplicative and no intra-month interactions alter its inputs. Additive and threshold-based rules require separate derivation.

### 15.3. Calendar and save risks discovered from source

- `core.ts:dateToTick` defaults its epoch to 1836 and only parses year/month; `parseDate` does not strictly validate month/day because day is not represented. New calendar utilities must reject invalid dates explicitly.
- `GameDate` has no day; `dateStr` always serializes day 01. Historical date records can therefore be more precise than runtime dates.
- `save.ts` currently stores `savedAt` as YYYY-MM and schema v2 does not separately identify engine version, data build hash or calendar version.
- Existing RNG is one global xoshiro state. Introducing daily checks changes how often and in what order random draws occur; a naive daily loop breaks continuation determinism even if average probabilities are rescaled.
- Existing annual metrics are sampled at the January boundary, not after December settlement. Preserve or explicitly change this contract.
- The current `GameController.fastForward()` yields to the browser every six months. Its interaction with the RAF scheduler should be included in DEV-006 reviewer checks before any concurrent fast-forward usage is enabled; no call site was found in the inspected `App.tsx` or `Setup.tsx` files at this baseline.

### 15.4. Required implementation decomposition after authorization

1. Pure Gregorian calendar helpers and exhaustive round-trip/leap-year tests; no GameState migration.
2. Versioned cadence scheduler with deterministic boundary tests and no runtime system rewiring.
3. Monthly-system adapter that proves exact parity against the current `runMonths` baseline over golden seeds.
4. Daily event/deadline queue with idempotency and stable ordering.
5. Daily military operations only after formations/fronts/supply contracts and independent review.
6. Save schema migration with v1/v2 fixtures, rollback and continuation hash comparisons.
7. Controller/UI scheduler integration and Android p50/p95/thermal/ANR benchmarks.
8. Owner acceptance and phase gate review before expanding into economy, POP, diplomacy or governance runtime work.
