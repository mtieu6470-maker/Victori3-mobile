# S0_BUILD_TEST_REPORT — S0-A bước A2, A3, A4

| Trường | Giá trị |
|---|---|
| Nhãn bằng chứng | `BASELINE_ORIGINAL` (mã/build sản phẩm không sửa; mọi lệnh chạy trên checkout tạm của baseline) |
| Đặc tả | `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` §6.3 (A2–A4), §6.6, G0.2 — commit `574ddc7` |
| Baseline code SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` |
| HEAD của repository lúc chạy | `d5b9820aae9a96d57e9486845c164ae591fa69de` (sau commit A1; chỉ tài liệu sau baseline — xem `S0_REPOSITORY_SNAPSHOT.md`) |
| Thời điểm | 2026-11-16 06:31–06:37 UTC |
| Máy | Máy của Claude: Ubuntu 24.04.5, Node v22.23.4, npm 10.9.9 (`logs/a1/a1_toolchain_local.log`) |
| Người thực hiện | Claude Code (tự đánh giá, **chưa được kiểm tra độc lập**) |

## 1. Cách chạy — worktree tạm, không đụng working tree chính

- `git worktree add --detach <scratch>/s0a_wt 2240a8f` tạo checkout tạm **ngoài** working tree chính (`logs/a2/00_worktree_add.log`). Trước khi chạy, worktree không có tệp sinh nào và `git status --ignored` rỗng (`logs/a2/state_00_before.txt`).
- Các lệnh chuẩn của §6.3 A2 chạy theo đúng thứ tự trong worktree đó. Mỗi lệnh có log nguyên văn (lệnh, giờ bắt đầu/kết thúc, exit code, thời gian).
- Sau mỗi lệnh ghi SHA-256 và kích thước của các tệp sinh, kèm `git status --porcelain=v1 --ignored` của worktree (`logs/a2/state_*.txt`).
- Phần so sánh A4 chạy trên `dist/` của worktree, APK đã giải nén của artifact `14193446122`, và CSV của reviewer (`logs/a4/a4_payload_comparison.log`).
- Kết thúc: `git worktree remove --force` rồi `git worktree prune`. Working tree chính vẫn sạch, HEAD không đổi (`logs/a2/99_worktree_remove.log`).
- Wrapper dùng để chạy lệnh và ghi trạng thái nằm ở Phụ lục A. Đây là công cụ ghi log nằm ngoài repository, không phải script audit của S0-B.

## 2. A2 — clean build và test

[ĐÃ XÁC MINH — `logs/a2/summary.txt` và log từng bước]

| # | Lệnh | Exit | Thời gian | Kết quả chính (trích log) |
|---|---|---|---|---|
| 01 | `npm ci` | 0 | 5,0 s | `added 220 packages, and audited 221 packages`; `6 vulnerabilities (3 moderate, 1 high, 2 critical)` (mục 6) |
| 02 | `npm run data` | 0 | 0,4 s | `build-data: OK — 274 entities (104 placeholder polities), 662 regions, 13 active alliances, 0 warnings` |
| 03 | `npm run map` | 0 | 6,3 s | `build-map: 8192x3868, 662 regions, 1426 land borders, 423 sea links, 2667 landmasses, 5024 boundary lines, 181318 runs; regions with a single cell: none` |
| 04 | `npm run content` | 0 | 0,3 s | `{"assets":502,"bytes":8715750,"flags":176,"arms":99,"portraits":227,"entities_linked":266,"entity_texts":265,"characters":473,"characters_linked":275}` |
| 05 | `npm run typecheck` (`tsc --noEmit`) | 0 | 4,3 s | Không có lỗi |
| 06 | `npx vite build` | 0 | 2,1 s | `vite v5.4.21`, 65 modules; `dist/assets/index-BK4lin7l.js`, `dist/assets/index-HljkG6qO.css`, `dist/index.html`; không có cảnh báo |
| 07 | `npx vitest run` (lượt 1) | 0 | 80,2 s | `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 79.80s` |
| 08 | `npx vitest run` (lượt 2) | 0 | 82,5 s | `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 82.05s` |
| 09 | `npx vitest run` (lượt 3) | 0 | 83,4 s | `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 82.93s` |

Phiên bản công cụ trong `node_modules` của worktree: vite 5.4.21 (trùng log CI), vitest 2.1.9, typescript 5.9.3, tsx 4.23.15.

**Độ ổn định test (3/3):**
- Ở cả ba lượt, đúng 58 test cùng tên đều qua; không có test thất bại hay bị bỏ qua.
- Danh sách tên test (bỏ thời gian chạy) của ba lượt giống hệt nhau: `a4/tests_run_1.txt`, `_2`, `_3` cùng SHA-256 `c396cde9…`.
- Phân bố: `content` 7, `data` 12, `modes` 16, `simulation` 13, `ui` 10.
- Đây mới là dữ liệu ổn định của từng test. Catalog phân tích từng test (input/action/expected, giới hạn) thuộc S0-B bước B3 và **chưa** làm.

So với CI baseline (job `133056831671`): cùng 5 tệp test, 58/58 test qua; CI chạy 100,76 s, máy này 79,8–82,9 s. Thời gian chỉ để tham khảo, không dùng làm số đo hiệu năng.

## 3. A3 — tệp sinh trước/sau từng bước

[ĐÃ XÁC MINH — `logs/a2/state_*.txt`]

| Tệp | Công cụ ghi | Trước | Sau bước tạo ra nó (SHA-256, byte) | Sau các bước sau đó |
|---|---|---|---|---|
| `src/generated/db.json` | `npm run data` (`tools/build-data.ts`) | không có | `5bf57da6937e08788cafca074f79af27c190661cce57e7c8ea54e8ed601315b2`, 1 402 541 | Không đổi qua bước 03–09 |
| `src/generated/map.json` | `npm run map` (`tools/build-map.ts`) | không có | `9a6a6979dd5e7adc9d5953fc5f089ac94dee4079433ed1d340535dcbe877a696`, 112 631 | Không đổi |
| `public/generated/map.bin` | `npm run map` | không có | `ad225a022e088eba665e2577120622cba713bb72492f60b0fa1c85a5bb9dfd4b`, 725 272 | Không đổi |
| `public/generated/coastdist.png` | `npm run map` | không có | `2b564d2d0300fb432f620df6360aa9f17bf073fbb7fb2657865ea59690fc0da9`, 867 476 | Không đổi |
| `public/generated/borders.json` | `npm run map` | không có | `04740d97b302f59c32a5e0edff78d935596000a59c3102b1f7b56a8e10c3b805`, 971 674 | Không đổi |
| `public/content/registry.json` | `npm run content` (`tools/build-content.ts`) | không có | `8155ed20078cba461dd864e4f667d4c23c3eddebf45d1326cfe529142e04ed7a`, 1 698 193 | Không đổi |
| `dist/` | `npx vite build` | không có | 590 tệp; SHA-256 của danh sách `sha256sum` đã sắp xếp = `3060b286447eabaec87bff5b9797c5c9280dba77c7b0d329793025df5d6a4682` | Không đổi qua 3 lượt vitest |

- `npm ci` chỉ tạo `node_modules/`.
- `npm run typecheck` và ba lượt `npx vitest run` không tạo hay sửa tệp nào: phần `git status --ignored` và mọi mã băm sau bước 06, 07, 08, 09 giống hệt nhau.
- Không lệnh nào sửa tệp được git theo dõi: `git status --porcelain` của worktree chỉ có các mục bị ignore.
- `db.json` chứa `built_at` (`tools/build-data.ts:411`) và `registry.json` chứa `generated` (`tools/build-content.ts:59`). Hai giá trị này đổi theo thời điểm build, nên hai tệp này **không** tái lập từng byte giữa các lần build (R12). Ba tệp của `public/generated/` sinh ra giống hệt bản trong APK baseline (mục 4).
- Không áp dụng `npm run build` hay `npm test` vì cả hai đều chạy lại `prepare-assets` (`package.json:10, 12, 14`). A2 dùng đúng các lệnh tách rời của §6.3.

## 4. A4 — so payload với manifest APK (§6.6, O2-a)

[ĐÃ XÁC MINH — `logs/a4/a4_payload_comparison.log`; dữ liệu trong `a4/`; CSV reviewer trong `inputs/`]

Đầu vào:
- Manifest APK: `inputs/APK_BASELINE_WEB_ASSETS_SHA256.csv`. Đây là tệp của reviewer, SHA-256 `78c4a21f06607c60cc721801fb0209ca1bace0386831d743e2c7a8891fb00eca`, dòng kết thúc CRLF. Ở A1, Claude đã xác minh nó trùng từng dòng với APK thật (`logs/a1/a1_artifact_verification.log`). Bản chuyển sang LF và sắp xếp là `a4/apk.csv`.
- `dist/` của worktree: `a4/dist.csv` (590 tệp, **17 764 559 byte** — đúng bằng tổng của payload APK vì hai tệp cordova có 0 byte).

### 4.1. Bốn nhóm

| Nhóm | Số tệp | Tệp | Tệp dữ liệu |
|---|---|---|---|
| 1. Trùng hoàn toàn (đường dẫn, kích thước, SHA-256) | **587** | Toàn bộ phông, ảnh nội dung, bản đồ, `public/generated/*`, CSS `assets/index-HljkG6qO.css`, `sw.js`, `icon.svg`, `manifest.webmanifest`… | `a4/group1_exact_match.csv` |
| 2. Có trong APK, thiếu trong `dist/` | 3 | `cordova.js`, `cordova_plugins.js` (**do Capacitor chèn khi đóng gói**); `assets/index-1X6Ixu45.js` (bundle JS cũ, ghép cặp ở 4.2) | `a4/group2_in_apk_not_in_dist.txt` |
| 3. Có trong `dist/`, không có trong APK | 1 | `assets/index-BK4lin7l.js` (bundle JS mới, ghép cặp ở 4.2) | `a4/group3_in_dist_not_in_apk.txt` |
| 4. Cùng đường dẫn, khác kích thước/SHA-256 | 2 | `content/registry.json`, `index.html` (cùng kích thước, khác SHA-256) | `a4/group4_same_path_differs.csv` |

### 4.2. Chứng minh từng khác biệt bằng dữ liệu thực

1. **`cordova.js`, `cordova_plugins.js`** (0 byte, SHA-256 của chuỗi rỗng `e3b0c442…`): có bằng chứng ở hai chỗ.
   - Mã Capacitor CLI 7.6.10: khi không có plugin Cordova, `handleCordovaPluginsJS` gọi `createEmptyCordovaJS` và ghi hai tệp rỗng vào thư mục web của nền tảng (`node_modules/@capacitor/cli/dist/cordova.js:136-139, 218-229`). Log CI baseline có bước `npx cap sync android` → `Copying web assets from dist to android/app/src/main/assets/public` (`logs/a1/ci_job_133056831671.log` dòng 388–400).
   - Kiểm chứng thực nghiệm (mục 4.3): chạy `npx cap sync android` trong worktree tạo ra đúng hai tệp này, 0 byte.
2. **Bundle JS — ghép cặp theo vai trò.** Đây là entry script mà `index.html` tham chiếu: APK `assets/index-1X6Ixu45.js` ↔ dist `assets/index-BK4lin7l.js`. Cả hai cùng 1 683 725 byte.
   - `cmp -l` cho thấy 6 byte khác nhau, ở offset 11806–11816, nằm trong chuỗi `built_at:"…"` bắt đầu ở offset 11783.
   - Giá trị: APK `built_at:"2026-11-16T02:39:10.863Z"`, dist `built_at:"2026-11-16T06:31:44.820Z"` (trùng `meta.built_at` của `db.json` vừa sinh). Mỗi tệp chỉ có một lần xuất hiện `built_at`.
   - Thay trường này bằng hằng số ở cả hai tệp thì SHA-256 **bằng nhau**: `74907bf91b66958c596d0ea0a6e04b77c4dc308f9b41f75dc6a5173db4b61616`.
   - Tên tệp khác nhau vì Vite đặt tên theo hash nội dung.
3. **`content/registry.json`**: `cmp -l` cho thấy 7 byte khác, ở offset 39–49, nằm trong `"generated":"…"` bắt đầu ở offset 13.
   - Giá trị: APK `2026-11-16T02:39:18.974Z`, dist `2026-11-16T06:31:51.498Z`.
   - Thay trường bằng hằng số thì SHA-256 bằng nhau: `5cb7b11ec57c4d092e5dcf0d97c6e7f0e33e7165763d9627735d77c89cf8e6e1`.
   - Tệp trong `dist/` trùng byte với `public/content/registry.json` vừa sinh (`cmp` exit 0).
4. **`index.html`**: `diff` chỉ có dòng 10, là thẻ `<script>` trỏ tới tên bundle JS (`index-1X6Ixu45.js` ↔ `index-BK4lin7l.js`). Thẻ CSS trỏ cùng `index-HljkG6qO.css` ở cả hai.
   - Thay tên bundle bằng hằng số thì SHA-256 bằng nhau: `7ba21c1150bc87a8bf5c666cd05c588242066d462c97d60ad3c9a10315f893b5`.
   - Điều này xác nhận chỗ sửa ở v3.2: `index.html` khác khi tên bundle JS đổi.

Không có khác biệt nào khác ngoài hai trường thời gian (`built_at`, `generated`), tên bundle phụ thuộc vào chúng, và hai tệp do Capacitor chèn.

### 4.3. Bổ sung — chạy đúng bước đóng gói của CI

[ĐÃ XÁC MINH — `logs/a4/a4b_cap_sync_supplementary.log`, `a4/android_public.csv`]

`npx cap sync android` trong worktree, đúng bước của CI:
- Thao tác Capacitor in ra: `Copying web assets from dist to android/app/src/main/assets/public`, `Creating capacitor.config.json in android/app/src/main/assets`, `copy android`, `update android`, exit 0. Lệnh chỉ tạo các mục bị ignore (`android/app/src/main/assets/`, `android/app/src/main/res/xml/config.xml`, `android/capacitor-cordova-android-plugins/`); không sửa tệp nào được git theo dõi.
- `android/app/src/main/assets/public` có **592** tệp. **589** tệp trùng hoàn toàn với manifest APK, gồm cả `cordova.js` và `cordova_plugins.js` 0 byte. 3 tệp còn lại là bundle JS, `registry.json`, `index.html`, đều đã giải thích ở 4.2.
- Không chạy Gradle (máy không có Android SDK).

### 4.4. Bằng chứng bổ trợ — hai lần build CI của cùng mã nguồn

[ĐÃ XÁC MINH — `logs/a4/ci_vs_ci_2240a8f_bd5787f.log`]

So artifact `14193446122` (run `43793446130`, `2240a8f`) với artifact `14201681874` (run `43814108497`, `bd5787f`). Commit `bd5787f` bằng `2240a8f` cộng thay đổi tài liệu, nên mã sản phẩm như nhau. Cả hai do workflow chưa sửa build ra.
- Payload `assets/public/`: đúng 3 tệp khác, cùng kiểu như 4.2 (bundle JS `built_at` 8 byte, `registry.json` `generated` 8 byte, `index.html` tên bundle). 589 tệp còn lại trùng.
- APK: 18 042 511 byte, `8a4beb6a…` ↔ 18 042 492 byte, `35cb9196…`.
- Chứng chỉ ký JAR: cả hai đều `CN=Android Debug`, nhưng **khác nhau**.
  - Baseline: SHA-256 `C5:D8:55:A7:…:E2:A0`, hiệu lực từ 02:42:33 UTC.
  - `bd5787f`: SHA-256 `C5:94:A7:EE:…:45:2D`, hiệu lực từ 06:05:32 UTC.

  Mỗi lần chạy CI sinh một khóa debug mới. Điểm v3.2 §2.1 ghi là "[SUY LUẬN, CHƯA KIỂM]" nay **đã được xác minh trên hai lần chạy**. Hệ quả: hai APK CI liên tiếp không cài đè lên nhau được (R1), và C3 là cần thiết.

### 4.5. Kết luận A4

**`web/data payload comparison completed`**:
- 587/590 tệp của `dist/` trùng từng byte với payload APK baseline.
- Mọi khác biệt còn lại được chứng minh bằng diff thực tế là chỉ do hai trường thời gian build và tên bundle phụ thuộc vào chúng.
- Hai tệp chỉ có trong APK do Capacitor chèn lúc đóng gói, đã kiểm chứng bằng mã nguồn và bằng chạy thực.

Phạm vi kết luận chỉ là payload web/dữ liệu trong `assets/public/`. Nó **không** khẳng định APK tái lập toàn bộ: không xét mã native/dex, `AndroidManifest.xml`, khối chữ ký, metadata ZIP hay toolchain Android. Không sửa generator để bỏ timestamp; việc đó thuộc S1 (R12).

## 5. Kết quả cổng / bước

Mọi kết quả dưới đây là Claude tự đánh giá, **chưa được kiểm tra độc lập**.

| Hạng mục | Kết quả | Căn cứ |
|---|---|---|
| A2 — clean build + test ×3 trong worktree tạm | `PASS` | Mục 2: 9 lệnh exit 0; 58/58 ×3 |
| A3 — tệp sinh trước/sau | `PASS` | Mục 3 |
| A4 — so payload | `PASS` — kết luận "web/data payload comparison completed" | Mục 4 |
| G0.2 Build/CI | `PASS` | Đủ các điều kiện PASS của G0.2: clean build + 58 test trên đúng SHA trong worktree tạm; mã băm APK ghi riêng với digest ZIP (A1); hash tệp sinh trước/sau; so manifest đủ 4 nhóm, mọi khác biệt chứng minh bằng diff thực tế; kết luận đúng mẫu |
| G0.3 Test catalog (một phần) | `PARTIAL` | Đã có dữ liệu ổn định 3/3 cho cả 58 test; chưa có catalog phân tích từng test (S0-B B3, chưa được phép) |

## 6. Phát hiện ghi nhận (không sửa trong S0-A)

| # | Phát hiện | Bằng chứng | Ghi chú |
|---|---|---|---|
| F1 | `npm audit`: 6 lỗ hổng (3 moderate, 1 high, 2 critical) ở công cụ dev/test/build: `vitest`/`@vitest/mocker`, `tinypool`, `vite`/`vite-node`/`esbuild` (dev server). Bản sửa đều là nâng cấp phá vỡ tương thích (vitest 5.1.0, vite 8.3.8) | `logs/a2/10_npm_audit.log`, `logs/a2/01_npm_ci.log` | Chưa đánh giá chúng có lọt vào bundle phát hành không. Đưa vào risk register (S0-B B7); không chạy `npm audit fix` |
| F2 | Khóa debug của CI đổi mỗi lần chạy (đã xác minh trên 2 lần chạy) | Mục 4.4 | Khẳng định R1; không đổi kế hoạch C3 |
| F3 | Nội dung dựng ở `2240a8f`: 473 nhân vật, 275 nhân vật liên kết Wikidata, 227 chân dung, 266 thực thể liên kết, 265 mô tả, 176 cờ, 99 huy hiệu, 502 tài sản / 8 715 750 byte | `logs/a2/04_npm_run_content.log` | Khớp số trong `docs/content/PHASE_REPORT_IDENTITY.md`. Các số 479/278/225 trong thông điệp commit `3617c0a` là trước khi gộp bản ghi trùng ở `e9fcd47`. Đây chỉ là số do công cụ báo; chưa kiểm định nội dung |
| F4 | Quy tắc `*.log` trong `.gitignore` khiến log A1 không vào commit A1; đã thêm bằng `git add -f` ở commit `d5b9820`, không sửa `.gitignore` | `git check-ignore -v` | Log của commit này cũng được thêm bằng `git add -f` |
| F5 | Test dân số in tên "…1870 benchmarks…" nhưng truy vấn mốc 1875 (đã ghi ở v3.2 §6.7) | `logs/a2/07_npx_vitest_run_1.log` | Chỉ ghi nhận; không sửa test |

## Phụ lục A — wrapper dùng ở A2/A3

Wrapper nằm ngoài repository và được gọi là `run_a2.sh <worktree> <thư mục log>`. Nó chỉ chạy các lệnh chuẩn và ghi trạng thái; không sửa tệp nào của sản phẩm.

```bash
#!/usr/bin/env bash
# S0-A A2/A3 driver: runs the standard commands of v3.2 §6.3 A2 in a temporary worktree of 2240a8f
# and records SHA-256 of generated files before/after each step. Not part of the repository.
set -u
WT="$1"; OUT="$2"; BASE=2240a8fb865e0021eec2f2f4f1c6803528be9e2c
gen_state() {  # $1 = label
  local f="$OUT/state_$1.txt"
  {
    echo "# generated-file state: $1  $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    for p in src/generated/db.json src/generated/map.json public/generated/map.bin public/generated/coastdist.png public/generated/borders.json public/content/registry.json; do
      if [ -f "$WT/$p" ]; then printf '%s  %s  %s\n' "$(sha256sum "$WT/$p" | cut -d' ' -f1)" "$(stat -c %s "$WT/$p")" "$p"; else printf 'ABSENT  -  %s\n' "$p"; fi
    done
    if [ -d "$WT/dist" ]; then
      n=$(find "$WT/dist" -type f | wc -l)
      m=$(cd "$WT/dist" && find . -type f | sed 's#^\./##' | LC_ALL=C sort | xargs -d '\n' sha256sum | sha256sum | cut -d' ' -f1)
      echo "dist/: $n files, sha256 of sorted 'sha256sum' listing = $m"
    else echo "dist/: ABSENT"; fi
    echo "--- git status --porcelain=v1 --ignored (worktree)"
    git -C "$WT" status --porcelain=v1 --ignored
  } > "$f"
}
step() {  # $1 = id, rest = command
  local id="$1"; shift
  local log="$OUT/$id.log"
  { echo "\$ cd <worktree of $BASE> && $*"; echo "# start $(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"; } > "$log"
  local t0=$(date +%s.%N)
  ( cd "$WT" && "$@" ) >> "$log" 2>&1
  local rc=$?
  local t1=$(date +%s.%N)
  { echo "# end $(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"; echo "# exit code: $rc"; echo "# wall time: $(echo "$t1 - $t0" | bc) s"; } >> "$log"
  echo "$id exit=$rc wall=$(echo "$t1 - $t0" | bc)s" >> "$OUT/summary.txt"
  gen_state "after_$id"
}
: > "$OUT/summary.txt"
echo "worktree HEAD: $(git -C "$WT" rev-parse HEAD)" >> "$OUT/summary.txt"
gen_state "00_before"
step 01_npm_ci npm ci
step 02_npm_run_data npm run data
step 03_npm_run_map npm run map
step 04_npm_run_content npm run content
step 05_npm_run_typecheck npm run typecheck
step 06_npx_vite_build npx vite build
step 07_npx_vitest_run_1 npx vitest run
step 08_npx_vitest_run_2 npx vitest run
step 09_npx_vitest_run_3 npx vitest run
echo DONE >> "$OUT/summary.txt"
```

Các lệnh A4 được ghi nguyên văn, kèm kết quả, trong `logs/a4/a4_payload_comparison.log`.

## Phụ lục B — SHA-256 của tệp bằng chứng

| Tệp | SHA-256 |
|---|---|
| `inputs/APK_BASELINE_WEB_ASSETS_SHA256.csv` | `78c4a21f06607c60cc721801fb0209ca1bace0386831d743e2c7a8891fb00eca` |
| `logs/a2/summary.txt` | `13eda30e0f1fe27a73065453d217da9a05e9bc06a94e8bd48ffd173aa6257172` |
| `logs/a2/07_npx_vitest_run_1.log` | `a83760964f2e09a299ebc6471109fadb4505e9f35fb0a3a1ad3fdf0c3125dade` |
| `logs/a2/08_npx_vitest_run_2.log` | `b21037ccafb3feca086003778973e5680a5dc6a8c228bd125d873341d3d3225b` |
| `logs/a2/09_npx_vitest_run_3.log` | `826e2718c9b678ab7fa71a2c540e795b0a6691f29b2ee9b4db68f17949a20108` |
| `logs/a2/10_npm_audit.log` | `cdca722fe9d7905c08c0fc225ba3a7a01d0e1a4133b4a8bf89a79769bbcd9504` |
| `logs/a4/a4_payload_comparison.log` | `d34efeba727b7a52f95a926f903b3abfb8ea805f60bb1b249fcce2c04be4c9a7` |
| `logs/a4/a4b_cap_sync_supplementary.log` | `2949b15952c298d304e3ddd05ea9113b9124df5838354a7a6a7ad7cd960b1bbd` |
| `logs/a4/ci_vs_ci_2240a8f_bd5787f.log` | `11bbd77a872e329e70f71647b910a276f5ff6aa539ff2b81c1ea2b1833267056` |
| `a4/dist.csv` | `03b8cad08212a2a472871f62416478197df8ba926e66ebc898ff2958f01497d7` |
| `a4/apk.csv` | `d650f52141ac2fd245efb6aa761869ffeed23e7059639b0e9b01236fe9fc0d26` |
| `a4/android_public.csv` | `24ce5efb0ad9894733a0da3c4c2e109cb13450a452c0402a7662b4e56a480505` |

Mã băm của mọi tệp còn lại kiểm bằng `sha256sum` trên chính repository.
