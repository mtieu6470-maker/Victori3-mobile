# PHẢN BIỆN PHẢN HỒI CLAUDE — ĐỀ XUẤT A–K VÀ S0 ĐÃ HIỆU CHỈNH

**Dự án:** Currents of History / `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Baseline code SHA:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`  
**Ngày rà soát:** 16/11/2026  
**Trạng thái:** Tài liệu thiết kế S0. **S0 vẫn chờ phê duyệt; không phải lệnh bắt đầu S0.**
**Phiên bản hiện tại:** v3.2 — Claude cập nhật từ input v3.1 theo `S0_V3_2_REVIEW_AND_CHANGE_REQUEST.md` (16/11/2026), đối chiếu lại tại HEAD `2240a8f` (working tree sạch, không có commit mới). Không sửa code, dữ liệu, test, workflow, Gradle, save schema; không tạo keystore, không cấu hình GitHub Environment/Secrets; không chạy S0; không commit/push.
**Input của lượt này:** v3.1 (`DECISIONS_AND_S0_REVISED_VI.v3.1.md`), `SOURCE_REGISTER.v3.1.md`, `APK_BASELINE_WEB_ASSETS_SHA256.csv`, diff v3 → v3.1.
**Lịch sử:** v1 reviewer → v2 Claude (nhãn, A–K đối chiếu, R1–R10) → v3 Claude (áp dụng quyết định V3, sửa 9 mâu thuẫn mục 4 của V3) → v3.1 Claude (áp dụng `V3_FINAL_REVIEW_FOR_CLAUDE.md`: nguồn gốc mã băm APK, O1–O4, 7 chỉnh sửa trước sign-off) → **v3.2 Claude** (áp dụng `S0_V3_2_REVIEW_AND_CHANGE_REQUEST.md`: C3 qua GitHub Environment `development-signing`, tách S0-A/S0-B, phép thử save/load, O2/G0.2, G0.7/iQOO, Diagnostic UI, G0.9, metadata).

**Quy ước nhãn của tài liệu hiện tại:**
- **[ĐÃ XÁC MINH]** — Claude kiểm tra lại trên repository/CI tại `2240a8f`, có file:dòng hoặc ID.
- **[CLAUDE ĐỀ XUẤT]** — thay đổi hoặc bổ sung của Claude so với bản reviewer; chờ chủ dự án.
- **[CHỦ DỰ ÁN QUYẾT ĐỊNH]** — không được coi là đã chốt cho đến khi chủ dự án xác nhận.
- **[ĐÃ CHỐT V3]** — chủ dự án đã quyết định trong `DECISIONS_FOR_CLAUDE_V3.md`.
- **[REVIEWER TÍNH ĐỘC LẬP]** — reviewer tính trực tiếp từ artifact `14193446122` đã tải về; Claude không tự tái tạo được trong môi trường hiện tại.
- **[DỰ KIẾN — CHƯA CHẠY]** — kết quả Claude dự đoán từ mã nguồn; chỉ được xác nhận khi chạy S0.
- **[CHƯA XÁC MINH]** — nhận định trích từ nguồn ngoài mà Claude chưa kiểm tra trong lượt này.
- **[v3.2 — CR §n]** — nội dung thêm/sửa theo mục n của `S0_V3_2_REVIEW_AND_CHANGE_REQUEST.md`.

**Thuật ngữ thống nhất [v3.2 — CR §9]:**
- **Repository Secrets** — secrets cấp repository; **không** dùng cho khóa ký trong tài liệu này.
- **Environment Secrets** — secrets gắn với GitHub Environment; chỉ job tham chiếu Environment mới đọc được, và chỉ sau khi các protection rule đã thông qua.
- **`development-signing`** — tên chính xác của GitHub Environment dùng cho C3.
- **`BASELINE_ORIGINAL`** — số liệu/kết quả đo trên mã và build sản phẩm **chưa sửa** của `2240a8f` (công cụ đo bên ngoài được phép, phiên bản công cụ phải ghi lại).
- **`AUDIT_INSTRUMENTED`** — số liệu/kết quả trên build có bất kỳ thay đổi S0-B nào (workflow checksum, C3, Diagnostic UI, script đo chạy trong app).
- **`BLOCKED` / `PARTIAL`** — `BLOCKED`: không thể làm vì thiếu điều kiện bên ngoài (thiết bị, quyền, secrets, quyết định); `PARTIAL`: một phần cổng đã có bằng chứng nhưng chưa đủ để PASS. Không đổi nhãn sang `PASS` khi chưa có bằng chứng mới.

---

## 1. Kết luận điều hành

Phản biện của Claude có chất lượng tốt và bổ sung nhiều bằng chứng quan trọng. Tôi chấp nhận phần lớn nhận định, nhưng không chấp nhận nguyên văn tất cả kết luận. Một số chỗ cần sửa thêm, đặc biệt là:

1. CI trên đúng SHA đã được xác minh: run `43793446130`, job `133056831671` thành công; artifact `14193446122` tồn tại. SHA-256 hiện có là của ZIP artifact, không phải APK bên trong.
2. Quan hệ giữa 662 Strategic Region và 4.596 admin-1 phải được xây từ lưới raster giao nhau, không được ép thành cây cha-con.
3. Công trình nên dùng mô hình site thưa, gộp công suất theo địa điểm/cơ sở vận hành, loại, phương pháp sản xuất và identity vận hành; tình trạng là bộ đếm cấp, sở hữu là sổ cổ đông trong site; không tạo object cho từng cấp công trình. *(v3: sửa theo quyết định E — bản v1 ghi gộp theo chủ sở hữu.)*
4. Không được giả lập trung đoàn, vị trí, chỉ huy hoặc lịch sử đơn vị khi migration từ bốn con số quân đội hiện tại.
5. Các giai đoạn về lao động, thị trường, AI và nhân vật phải được tách để tránh phụ thuộc vòng.
6. Bổ sung các vấn đề bị bỏ sót: autosave/vòng đời Android, mất WebGL context, phông chữ đa hệ chữ, giấy phép, i18n, dữ liệu bundle lớn và ngân sách vẽ bản đồ.
7. S0 phải phân biệt baseline nguyên trạng với công cụ đo bổ sung. Không để việc thêm màn hình chẩn đoán làm thay đổi baseline ban đầu.

**Quyết định [CHỜ PHÊ DUYỆT RIÊNG]:** A–K đã chốt ở V3 (mục 4; C3 hiệu chỉnh ở v3.2). Việc **bắt đầu S0** vẫn cần chỉ thị riêng của chủ dự án sau khi duyệt tài liệu v3.2 này. Khi được duyệt, S0 thực hiện theo bản hiệu chỉnh trong tài liệu này. S0 được phép kiểm toán, chạy build/test, tạo script đo và characterization tests. Không được sửa logic gameplay, schema save, dữ liệu lịch sử đang dùng, công thức mô phỏng hoặc triển khai S1.

## 2. GitHub và CI — trạng thái đã xác minh

Commit mới nhất được kiểm tra là `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`. Commit chỉ thêm:

- `docs/audit/MASTER_SPEC_AUDIT.md`
- `docs/architecture/PROVINCES_BUILDINGS_MILITARY.md`

Không có thay đổi engine/gameplay trong commit đó.

GitHub Actions run `43793446130` trên đúng SHA `2240a8f` có job `133056831671` với conclusion `success`. Các bước `npm ci`, build data/map/web, tests, Capacitor sync, Gradle assembleDebug và upload artifact đều hoàn tất thành công. Artifact:

- ID: `14193446122`
- Tên: `dong-chay-lich-su-debug-apk`
- Kích thước ZIP: `17,555,158` bytes
- Digest ZIP: `sha256:8bad8d7efd055e16630dc0770ebd6cf811722eb8592c04a7fe1f6c291f852077`

Claude báo cáo 58/58 test qua, 5 file test, 100,76 giây. Job và bước test được GitHub xác nhận thành công; log chi tiết số lượng test là bằng chứng do Claude trích xuất, cần lưu log nguyên văn trong S0.

**[ĐÃ XÁC MINH]** Dòng log nguyên văn của job `133056831671`: `2026-11-16T02:41:07.8633875Z Test Files 5 passed (5)` / `Tests 58 passed (58)` / `Duration 100.76s`; bước Gradle: `BUILD SUCCESSFUL in 1m 32s`. Artifact hết hạn `2027-02-14T02:38:57Z` — S0 phải lưu bằng chứng trước ngày này.

**[ĐÃ XÁC MINH] Giới hạn môi trường của Claude:** môi trường làm việc có Java nhưng **không có Android SDK** (`ANDROID_HOME` rỗng) và không có công cụ tải artifact GitHub có xác thực. Vì vậy Claude không tự build APK cục bộ và không tự tải artifact `14193446122` để băm APK.

**Không được gọi digest ZIP là SHA-256 APK.** S0 phải băm file `.apk` sau khi giải nén artifact hoặc tạo checksum APK trực tiếp trong CI.

### 2.1. Mã băm baseline — C2 [ĐÃ CHỐT V3: ĐÃ GIẢI QUYẾT]

| Đối tượng | Giá trị | Nhãn |
|---|---|---|
| Commit | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` | [ĐÃ XÁC MINH] |
| Run / Job / Artifact | `43793446130` / `133056831671` / `14193446122` (`dong-chay-lich-su-debug-apk`) | [ĐÃ XÁC MINH] qua GitHub API |
| ZIP artifact | 17 555 158 byte; `sha256:8bad8d7efd055e16630dc0770ebd6cf811722eb8592c04a7fe1f6c291f852077` | Digest GitHub [ĐÃ XÁC MINH qua API]; tính lại từ ZIP đã tải, khớp [REVIEWER TÍNH ĐỘC LẬP] |
| APK bên trong | `app-debug.apk`, 18 042 511 byte | [REVIEWER TÍNH ĐỘC LẬP] — giải nén từ artifact `14193446122` |
| **APK SHA-256** | **`8a4beb6af4d033346dd8c58994df72f2a1bfe980e6ef0e10d57a9ff013d0846c`** | [REVIEWER TÍNH ĐỘC LẬP từ artifact `14193446122`] — ghi tại `APK_BASELINE_CHECKSUMS.txt` |
| Manifest web/dữ liệu trong APK | `APK_BASELINE_WEB_ASSETS_SHA256.csv`: 592 tệp dưới `assets/public/`, tổng 17 764 559 byte; SHA-256 của chính tệp CSV `78c4a21f06607c60cc721801fb0209ca1bace0386831d743e2c7a8891fb00eca` | [REVIEWER TÍNH ĐỘC LẬP]; số tệp/tổng byte Claude đọc lại từ CSV |

Hai giá trị ZIP và APK định danh hai tệp khác nhau; S0 ghi riêng, không tráo. Mã băm APK định danh chính xác tệp trong artifact này, **không** chứng minh build tái lập và **không** chứng minh cài đặt hay chạy thành công trên iQOO hoặc bất kỳ thiết bị nào. Manifest payload (592 dòng) là **bằng chứng riêng** với mã băm APK.

**Lưu ý về chữ ký và tái lập (giữ từ v2; mục 2 cũ của hệ quả "không lấy được APK baseline" đã được giải quyết bởi 2.1).** [ĐÃ XÁC MINH] Workflow ký APK bằng khóa debug do Gradle tự sinh và không lưu keystore (`.github/workflows/android-apk.yml:2`). [SUY LUẬN, CHƯA KIỂM] Runner mới mỗi lượt nên khóa debug có thể khác nhau → **bytes APK khác nhau giữa các lượt, kể cả cùng mã nguồn**; kiểm chứng bằng `apksigner verify --print-certs` trên hai artifact. Hệ quả nếu suy luận đúng:
1. Sửa workflow theo lựa chọn C chỉ cho ra SHA-256 của APK **build từ commit audit mới**, không phải của APK baseline `2240a8f`; GitHub Actions chạy workflow của chính commit được build, nên không thể chạy workflow mới trên `2240a8f`.
2. ~~SHA-256 của APK baseline chỉ lấy được bằng cách tải đúng artifact `14193446122`.~~ **Đã giải quyết** — xem 2.1.
3. SHA-256 APK định danh **một artifact cụ thể**, không chứng minh tái lập build. Tái lập phải chứng minh ở mức web bundle (`dist/`) và dữ liệu (`db.json`, `map.json`, `registry.json`) — các tệp này có thể băm trong clean checkout.
4. Cài APK của lượt CI sau đè lên APK lượt trước có thể bị Android từ chối vì khác chữ ký → phải gỡ cài đặt → **mất bản lưu trong IndexedDB**. Xử lý bằng C3 (mục 4.1), trừ **lần chuyển đầu tiên** từ APK baseline sang APK ký khóa phát triển cố định.
5. **Kiểm tra tái lập baseline [O2-a, v3.1]:** dùng manifest `APK_BASELINE_WEB_ASSETS_SHA256.csv` (mục 2.1) — xem mục 6.6.

Liên kết:
- Commit: https://github.com/mtieu6470-maker/Victori3-mobile/commit/2240a8fb865e0021eec2f2f4f1c6803528be9e2c
- CI run: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43793446130
- Artifact: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43793446130/artifacts/14193446122

## 3. Các điểm phải sửa trong phản biện của Claude

### 3.1. Những nhận định được chấp nhận

- `src/engine/types.ts` hiện có 12 hàng hóa, 10 loại công trình, 9 strata; Army/Navy là số tổng hợp.
- `src/engine/systems/economy.ts` dùng công thức sản xuất cố định; `build()` tăng cấp tức thời; `statePool/privatePool` chưa phải sổ sở hữu thực.
- `src/engine/save.ts` chỉ chấp nhận version 1; có fallback ad-hoc cho `marketStats`, nhưng chưa có migration framework.
- `GameController` chạy `stepMonth()` đồng bộ trong `requestAnimationFrame`; fast-forward nhường event loop mỗi 6 tháng; speed 5 đặt chu kỳ bằng 0.
- Content registry hiện có cờ, huy hiệu, chân dung; chưa có bộ ảnh thành phố, công trình, xã hội, quân sự và sự kiện.
- Số đo 26,4 ms/tháng là Node/server benchmark, không suy ra hiệu năng iQOO Z10 Turbo.
- Test nhãn bản đồ hiện có trọng tâm góc nhìn châu Âu.
- Chưa có fixture migration save cũ.
- 662 vùng và lưới admin-1 không có quan hệ cha-con đơn giản; lưới raster cho phép tính crosswalk diện tích/giao nhau.
- Cần xem xét autosave, Android lifecycle, renderer/WebGL context loss, phông chữ nhiều hệ chữ, giấy phép, i18n, bundle parse time và LOD/culling.

### 3.2. Một điểm phản biện Claude cần sửa lại

Trong `tests/simulation.test.ts`, comment mô tả benchmark dân số là năm 1870, nhưng đoạn truy vấn benchmark sử dụng `date === '1875'`. Vì vậy không nên chỉ nói “test dùng năm 1870” hoặc “test dùng năm 1875” mà không ghi nhận sự không nhất quán giữa comment và code. S0 phải giữ nguyên test, ghi rõ sai lệch này; không tự sửa logic test trong giai đoạn audit.

**[ĐÃ XÁC MINH]** Reviewer đúng; Claude rút lại câu "test là mốc 1870" trong phản biện trước. Chi tiết:
- `tests/simulation.test.ts:21` tên test ghi "1870 benchmarks"; `:22` truy vấn `b.date === '1875'`.
- Mốc 1875 tồn tại trong `db.json` cho cả 5 nước được kiểm (GBR 32 839 000, FRA 36 660 000, USA 45 073 000, RUS 90 200 000, SPA 16 140 000); ván chạy 40 năm từ 1836 nên so ở 1876 — đoạn mã nhất quán với mốc 1875, chỉ **tên test sai**.
- Điểm yếu bổ sung: `:24` dùng `continue` khi nước đã diệt vong hoặc thiếu mốc → test có thể **qua mà không kiểm gì** nếu cả 5 nước biến mất. S0 ghi nhận "nguy cơ qua rỗng" trong test catalog, không sửa.

Đường dẫn `strataFor` thuộc `src/engine/init.ts`, còn `shiftStrata` nằm trong `population.ts`. Sửa mọi tham chiếu sai đường dẫn trong audit.

### 3.3. Điều chỉnh mô hình địa lý

- Giữ 662 Strategic Region hiện hữu làm đơn vị tính toán vĩ mô trong giai đoạn đầu.
- Giữ admin-1 hiện đại như lớp tham chiếu địa lý/xấp xỉ có nhãn thời kỳ và nguồn.
- Không trình bày chúng như tỉnh lịch sử năm 1836.
- Tạo crosswalk raster giữa ô bản đồ, admin-1 và Strategic Region; lưu tỷ trọng giao nhau/diện tích ước tính cùng phương pháp.
- Mô hình lịch sử dài hạn phải cho phép AdministrativeUnit có `valid_from`, `valid_to`, tên theo thời kỳ, cấp, loại, parent, owner/controller theo thời gian và nguồn.
- Settlement là thực thể địa điểm độc lập, không đồng nhất với AdministrativeUnit hay StrategicRegion.

### 3.4. Điều chỉnh mô hình công trình

Không chọn một object cho mỗi cấp công trình. Dùng mô hình **BuildingSite thưa và có thể gộp**:

**[ĐÃ CHỐT V3 — quy tắc duy nhất, thay cho các gạch đầu dòng mâu thuẫn của v1/v2]**
- Một site biểu diễn năng lực (các cấp) của **một loại công trình tại một địa điểm/cơ sở vận hành**.
- **Khóa site** = địa điểm hoặc cơ sở vận hành + loại công trình + production method + identity vận hành.
- **Tình trạng là bộ đếm cấp trong site** (bất biến chi tiết ở 3.4.1). Không tách site vì hư hại, thiếu lao động hay đang xây.
- **Sở hữu là sổ cổ đông (shareholder ledger) trong site**. Không tách site vì cổ đông khác nhau.
- Chỉ tách site khi là **cơ sở/địa điểm vận hành độc lập**, hoặc khác PM/loại theo quy tắc sẽ định nghĩa ở S10.
- Không tạo một object cho mỗi cấp.
- ID phải ổn định, không phụ thuộc chỉ số mảng hoặc thứ tự hiển thị.
- Dữ liệu tổng hợp theo Region/Settlement là projection/cache có thể tái tạo từ site, không phải nguồn dữ liệu thứ hai mâu thuẫn.
- Phải benchmark số site thật với các seed; không chấp nhận dự đoán 10–16 nghìn instance mà không đo.

#### 3.4.1. Bất biến trạng thái cấp [v3.1 — CLAUDE ĐỀ XUẤT theo yêu cầu V3-final #2]

Các nhóm trạng thái của **cấp đã xây** là **loại trừ lẫn nhau** (mỗi cấp thuộc đúng một nhóm):

| Trường | Lưu hay suy ra | Ý nghĩa |
|---|---|---|
| `levels_built` | lưu | số cấp đã hoàn thành |
| `levels_damaged` | lưu | cấp hư hại, không vận hành; `0 ≤ damaged ≤ built` |
| `levels_closed` | lưu | cấp đóng theo quyết định chủ sở hữu hoặc luật (thua lỗ, mất tiếp cận thị trường); `0 ≤ closed ≤ built − damaged` |
| `levels_input_short` | suy ra mỗi tick | cấp đang vận hành nhưng thiếu đầu vào |
| `levels_understaffed` | suy ra mỗi tick | cấp đang vận hành, đủ đầu vào nhưng thiếu lao động |
| `levels_active` | suy ra mỗi tick | cấp vận hành đủ |

- **Bất biến:** `levels_built = levels_active + levels_understaffed + levels_input_short + levels_damaged + levels_closed`; mọi giá trị là số nguyên ≥ 0.
- **Thứ tự ưu tiên khi một cấp có nhiều vấn đề:** hư hại → đóng → thiếu đầu vào → thiếu lao động → vận hành đủ.
- Sản lượng tính bằng **tỷ lệ liên tục** (tỷ lệ đủ lao động, tỷ lệ đáp ứng đầu vào). Ba nhóm suy ra là phân loại để báo cáo/UI/AI, tái tạo được từ trạng thái; không phải nguồn dữ liệu thứ hai.
- `levels_under_construction` **không** là trường của site: tính từ các `ConstructionProject` nhắm vào site; **không** cộng vào `levels_built` hay công suất cho tới khi dự án hoàn thành.

#### 3.4.2. ID ổn định khi đổi production method [v3.1 — CLAUDE ĐỀ XUẤT theo yêu cầu V3-final #3]

- **ID site là định danh mờ, cấp khi tạo** (ví dụ `site:<số thứ tự>`), **không** suy ra từ khóa. Khóa (địa điểm/cơ sở + loại + PM + identity vận hành) chỉ là chỉ mục để tìm site có thể gộp.
- **Đổi PM cho toàn bộ site:** giữ nguyên ID; cập nhật trường PM sau thời gian/chi phí chuyển đổi (định nghĩa ở S10); ghi một mục lịch sử.
- **Đổi PM cho một phần số cấp:** tạo site mới với ID mới và `lineage = { parent: <ID cũ>, event: 'pm_split', tick }`; site cũ giữ ID với số cấp còn lại.
- **Gộp hai site trùng khóa:** giữ ID cũ hơn; site kia thành tombstone `merged_into: <ID giữ lại>`; tham chiếu (dự án xây dựng, sổ cổ đông, đánh dấu UI) chuyển qua bảng chuyển hướng; migration bản lưu giữ tombstone.
- **Không re-key phá hủy:** không bao giờ đổi ID của site đang tồn tại.

**Cơ sở của quy tắc (đề xuất của Claude ở v2, đã được V3 chốt):**
- Tình trạng là **bộ đếm cấp trong site** (3.4.1) — đủ để đáp ứng mục 4.3 của MASTER_SPEC mà không phân mảnh site mỗi khi có hư hại.
- Sở hữu là **sổ cổ phần trong site** (tỷ lệ theo chủ thể); chỉ tạo site mới khi một chủ thể lập cơ sở riêng biệt (ví dụ đầu tư nước ngoài vào một nhà máy riêng).
- Lý do: tách theo tình trạng/chủ sở hữu làm số site tăng theo thời gian chiến tranh và đầu tư, khó dự báo cho bản lưu và tick; mô hình hiện tại đã là bộ đếm cấp theo loại trong vùng (`src/engine/types.ts:69`), chuyển sang bộ đếm trong site giữ được tính liên tục khi migration.

### 3.5. Migration quân đội

Save cũ chỉ có manpower/quality/morale/supply/strength. Không được tự tạo lịch sử trung đoàn hoặc khẳng định vị trí đóng quân khi không có dữ liệu.

Giải pháp: tạo `LegacyForcePool`/`UnorganizedForce` có provenance `migration_estimate`, giữ tổng quân số và chỉ số hiện có. **[CLAUDE ĐỒNG Ý]** — khớp với sửa bắt buộc F của bản roadmap trước. Người chơi/AI tổ chức thành đơn vị sau này bằng quyết định có kiểm soát. Nếu cần phân bố vị trí ban đầu, phải đánh dấu estimated và cho phép chỉnh sửa; không giả vờ là dữ liệu lịch sử xác minh.

## 4. Lựa chọn A–K [ĐÃ CHỐT V3]

Bảng dưới đây là quyết định của chủ dự án trong `DECISIONS_FOR_CLAUDE_V3.md` mục 3 (thay cho bảng đề xuất v1/v2).

| Mục | Quyết định [ĐÃ CHỐT V3] | Điều kiện/giới hạn |
|---|---|---|
| A — nơi lưu S0 | `docs/audit/s0/` trên branch hiện tại | Không tạo branch mới. Commit S0 đầu tiên chỉ ghi nhận baseline; script/test/fixture thêm sau, từng commit rõ ràng. |
| B — đo thiết bị | Cho phép Diagnostic UI debug-only | Chỉ sau baseline nguyên trạng. Bật bằng build flag; không có trong release; không gửi mạng; export JSON cục bộ. Không giả đo native RAM/GPU/thermal nếu không có API; API không có thì ghi `unsupported`, không điền 0. |
| C — CI checksums | Cho phép sửa workflow CI | Commit riêng; xuất APK SHA-256, ZIP digest, hash bundle/dữ liệu sinh ra và test report. Không sửa engine/gameplay. |
| C2 — APK baseline | **Đã giải quyết** | SHA-256 APK baseline ở mục 2.1. |
| C3 — keystore cố định | **Có, chỉ khóa development/test riêng** — **[v3.2 — CR §2] qua GitHub Environment `development-signing` với Environment Secrets**, không dùng Repository Secrets | Chi tiết mục 4.1. Commit riêng trong S0-B sau baseline. Environment/secrets chưa cấu hình → C3 `BLOCKED`, không fallback. |
| D — admin-1 | Lớp tham chiếu xấp xỉ hiện đại | Không gọi là biên giới lịch sử 1836; raster crosswalk admin-1 ↔ StrategicRegion; dữ liệu lịch sử bổ sung theo nguồn và thời kỳ. |
| E — BuildingSite | BuildingSite thưa, gộp công suất | Quy tắc duy nhất ở mục 3.4: khóa theo địa điểm/cơ sở + loại + PM + identity vận hành; tình trạng = bộ đếm cấp; sở hữu = shareholder ledger; không tách vì hư hại hay cổ đông khác nhau. |
| F — chơi được | Mọi polity có agency và đủ dữ liệu đều có thể chọn chơi | Mọi thực thể trong thế giới vẫn phải có identity, dữ liệu, mô tả và AI phù hợp. Thuộc địa/chư hầu/phi tập trung có checklist riêng; không ép thành quốc gia độc lập giả. Không loại trừ theo châu lục/quy mô. |
| G — văn bản | **G-a chuyển tiếp** | Giữ văn bản CC BY-SA hiện có kèm ghi công/URL/tác giả/phiên bản/giấy phép; không xóa hay ẩn để né nghĩa vụ giấy phép. Văn bản tự biên soạn có provenance từng khẳng định thêm dần; chỉ thay thế sau kiểm duyệt và cập nhật ghi công. Không paraphrase Wikipedia rồi coi là văn bản độc lập. |
| H — offline > 3 GB | Provider-neutral manifest + nhiều content pack | Tải một lần, resume, checksum, kiểm tra dung lượng trống, cập nhật an toàn, chơi offline. Google Play → đánh giá PAD/AAB; sideload → kênh pack riêng. Không tự phát sinh dịch vụ trả phí. |
| I — tất định | Cùng engine build + data build + seed + chuỗi lệnh | Lưu version/hash/seed cần thiết trong save. **Không** bắt buộc nhật ký lệnh đầy đủ trong mọi save; kiểm tất định bằng luồng lệnh do test cấp; replay log là sidecar debug tùy chọn. |
| J — hiệu năng | Giao thức đo 4 nhóm (mục 6.5) | S0 đo baseline; ngưỡng 8/16,7/50 ms là mục tiêu của S2, không phải điều kiện PASS của S0. S2 quyết định Worker/chunking theo số đo. |
| K — WebView | Giữ minSdk 23; Chromium WebView 111+ là sàn mục tiêu tạm thời | Feature detection/fallback và ma trận thiết bị thực tế; chưa phải sàn phát hành cuối cùng. |

### 4.1. C3 — khóa ký development cố định [ĐÃ CHỐT V3; thiết kế bảo mật viết lại ở v3.2 — CR §2]

#### 4.1.1. Vấn đề [ĐÃ XÁC MINH]

- Workflow hiện tại `.github/workflows/android-apk.yml` kích hoạt bằng `push` lên **mọi nhánh** (`branches: ['**']`) và `workflow_dispatch` (dòng 5–8); không khai báo `permissions`; dùng `actions/checkout@v4`, `actions/setup-node@v4`, `actions/setup-java@v4`, `actions/upload-artifact@v4` theo tag di động (dòng 15, 16, 25, 37).
- APK hiện được Gradle ký bằng **debug key tự sinh trên runner** (dòng 2), **không phải** khóa development cố định của C3.
- Nếu đặt khóa ký vào Repository Secrets và tham chiếu trong workflow này, **mọi lần push lên bất kỳ nhánh nào** đều có thể chạy bước dùng khóa → không chấp nhận.

#### 4.1.2. GitHub Environment `development-signing`

| Loại | Tên | Ý nghĩa |
|---|---|---|
| Environment Secret | `COH_DEV_KEYSTORE_B64` | keystore PKCS12 mã hóa base64, một dòng |
| Environment Secret | `COH_DEV_KEYSTORE_PASSWORD` | mật khẩu keystore |
| Environment Secret | `COH_DEV_KEY_ALIAS` | alias, dự kiến `coh-dev` |
| Environment Secret | `COH_DEV_KEY_PASSWORD` | mật khẩu private key |
| Environment Variable | `COH_DEV_CERT_SHA256` | SHA-256 fingerprint của certificate, **dạng chuẩn: 64 ký tự hex chữ thường, không dấu hai chấm**; thông tin công khai, không phải bí mật |

Protection rules bắt buộc:
- **Deployment branches and tags:** "Selected branches and tags", **một** quy tắc với tên nhánh chính xác `claude/game-historical-sandbox-modes-kg7rj7` (nhánh ký do chủ dự án chỉ định); không wildcard `*`.
- **Required reviewers:** chủ dự án (hoặc người bảo trì được chủ dự án ủy quyền) phải duyệt **từng** lần chạy job ký.
- **Bỏ chọn "Allow administrators to bypass configured protection rules"** (GitHub có tùy chọn này — [ĐÃ XÁC MINH] trang "Managing environments for deployment").
- **"Prevent self-review" — trade-off:** khi bật, người khởi chạy workflow **không** tự duyệt được lần chạy của mình. Nếu chỉ có **một** reviewer đáng tin cậy và chính người đó khởi chạy `workflow_dispatch`, bật tùy chọn này làm job **không thể được duyệt** (deadlock). → **Chỉ bật khi đã có reviewer thứ hai đáng tin cậy**; với cấu hình hiện tại (một chủ dự án) để **tắt**, và ghi rõ trong bằng chứng S0.
- [ĐÃ XÁC MINH] Repository `mtieu6470-maker/Victori3-mobile` hiện ở chế độ **public** (GitHub API, 16/11/2026). [ĐÃ XÁC MINH — Source Register [1], [3]] Trên gói Free, Environment secrets chỉ có ở repo public; trên Free/Pro/Team, Required reviewers và tùy chọn chặn administrator bypass chỉ có ở repo public. Tài liệu **không** khẳng định các quy tắc này áp dụng y hệt nếu repo chuyển sang private; khi đó phải kiểm lại theo gói thực tế trước khi chạy C3, nếu thiếu tính năng thì C3 = `BLOCKED`.

#### 4.1.3. Hai luồng tách biệt (thiết kế; **chưa viết YAML** trong v3.2)

**Luồng CI thông thường** (`android-apk.yml`, chỉ sửa theo quyết định C):
- Tiếp tục build/test khi push; có thể tạo debug APK bằng debug key mặc định của Gradle để kiểm tra build.
- **Không** tham chiếu Environment `development-signing`; **không** đọc bất kỳ secret ký nào.
- Không gọi APK này là "APK ký khóa development cố định".

**Luồng ký development cố định** — đề xuất **workflow riêng** (ví dụ `android-dev-signed.yml`):
- Trigger **duy nhất** là `workflow_dispatch` → không có cấu hình nào khiến sự kiện `push` khởi tạo workflow này.
- Job ký có điều kiện cấp job: `github.event_name == 'workflow_dispatch'` **và** `github.ref == 'refs/heads/claude/game-historical-sandbox-modes-kg7rj7'`.
- **Chỉ job ký** khai báo `environment: development-signing`; job build không khai báo.
- Deployment branch policy của Environment là **lớp kiểm soát thứ hai**, không thay thế điều kiện `if` trong workflow.
- Job ký chỉ chạy sau khi reviewer duyệt; GitHub chỉ cấp Environment Secrets cho job tham chiếu Environment **sau khi** protection rules thông qua ([ĐÃ XÁC MINH] trang GitHub "Managing environments for deployment").
- **[CLAUDE ĐỀ XUẤT] Tách build và ký thành hai job:** (1) job `build` không có Environment: chạy `npm ci`, build web, Gradle → tải lên APK chưa ký khóa development; (2) job `sign` có Environment: tải APK, ký lại bằng `apksigner sign` (apksigner thay thế chữ ký sẵn có), `apksigner verify --print-certs`, so SHA-256 certificate thực tế với `COH_DEV_CERT_SHA256` (chuẩn hóa chữ thường, bỏ dấu hai chấm) → khác thì **fail**; tải lên APK đã ký. Job `sign` **không chạy mã của repository** (không `npm`, không Gradle, không script dự án), nên dependency/build script không bao giờ tiếp cận secrets.
- Không tự động ký ở bất kỳ push nào; không cho job test/build thường đọc secrets.

**Lập luận "job ký không thể bị kích hoạt từ push và không đọc secrets trước khi protection rules thông qua":**
1. Workflow ký không khai báo trigger `push` → GitHub không tạo run cho sự kiện push.
2. Kể cả khi được khởi chạy thủ công trên ref khác, điều kiện `if` cấp job bỏ qua job ký; Environment branch policy là lớp thứ hai từ chối nhánh không nằm trong danh sách.
3. Secrets thuộc Environment, không thuộc repository → job không khai báo Environment không có quyền đọc; job khai báo Environment chỉ nhận secrets sau khi reviewer duyệt.
4. **Giới hạn còn lại (ghi rủi ro R13):** người có quyền push lên chính nhánh ký có thể sửa nội dung workflow trên nhánh đó; biện pháp: reviewer kiểm tra SHA commit và nội dung workflow của lần chạy trước khi duyệt. [CLAUDE ĐỀ XUẤT — CHỦ DỰ ÁN QUYẾT ĐỊNH, không cấu hình trong lượt này] Có thể bổ sung CODEOWNERS cho `.github/workflows/` kèm quy tắc bảo vệ nhánh (Source Register [4]); chỉ hiệu quả nếu thay đổi đi qua pull request, trong khi nhánh hiện được push trực tiếp.

#### 4.1.4. Least privilege và xử lý keystore

- Khai báo `permissions` tối thiểu cho từng workflow/job (đề xuất `contents: read`); không dùng `write-all`.
- Pin các action dùng trong job ký (và các action quan trọng khác) bằng **full commit SHA** lấy từ repository gốc của action (không lấy từ fork), ghi kèm tag/phiên bản nguồn của commit đó và lý do chọn. [CHƯA XÁC MINH chi tiết] Trang secure-use của GitHub (Source Register [4]) có nhắc cơ chế lockfile có thể thay cho SHA pinning; tài liệu giữ SHA pinning theo CR §2.4 cho tới khi được xem xét riêng.
- Không dùng `pull_request_target` để ký hoặc xử lý mã không tin cậy.
- Không `echo`, `cat`, dump environment hoặc đưa secret vào command log; không bật chế độ debug log của runner khi ký.
- Không upload keystore hay tệp tạm chứa private key làm artifact; không đưa vào cache.
- Giải mã keystore vào tệp tạm với quyền chỉ chủ sở hữu đọc được (ví dụ `umask 077`), xóa ngay sau khi ký (kể cả khi bước ký lỗi).
- Backup keystore mã hóa nằm ngoài repository, do chủ dự án kiểm soát.
- Fingerprint là thông tin công khai → đặt trong Environment Variable, không cần Secret.

#### 4.1.5. Điều kiện của chủ dự án và trạng thái dừng

- Chủ dự án tự tạo keystore, tự tạo Environment `development-signing`, tự thêm Environment Secrets/Variable trong GitHub Settings (Phụ lục A). Claude không có quyền và **không yêu cầu** chủ dự án gửi keystore, private key hay mật khẩu vào chat.
- Environment, protection rules hoặc secrets chưa cấu hình → C3 = **`BLOCKED`**. **Tuyệt đối không fallback** sang Repository Secrets hoặc ký bằng khóa cố định không được bảo vệ.
- Giữ `applicationId`. **O3-b (v3.1):** giữ `versionCode 1` (`android/app/build.gradle:10`) cho luồng development; Android chấp nhận cập nhật khi applicationId trùng, certificate trùng (hoặc proof-of-rotation hợp lệ) và versionCode mới ≥ bản đã cài ([ĐÃ XÁC MINH] Source Register [5]; gỡ cài đặt xóa toàn bộ dữ liệu app); xác nhận cài đè trên iQOO; không sửa Gradle trong C3 trừ khi thiết bị chứng minh cần; version code tăng đơn điệu cho phát hành công khai thuộc S23c.
- **Lần chuyển đầu tiên** từ APK baseline (debug key tự sinh) sang APK ký khóa development nhiều khả năng khác certificate: theo giao thức thiết bị mục 6.5.1 (sao lưu save, kiểm nhập lại, chỉ gỡ APK baseline sau khi chủ dự án xác nhận). C3 **không** bảo vệ dữ liệu của lần chuyển này.
- Sau khi chuyển: ít nhất hai APK ký liên tiếp có cùng certificate SHA-256 và cài nâng cấp thành công không cần gỡ.
- Thứ tự (O1-a): sau commit snapshot S0-A và commit checksum CI; trước Diagnostic UI.

### Ghi chú về H — quy mô gói nội dung

Mục tiêu trên 3 GB là tổng nội dung cài đặt/offline đã tải, không phải bắt buộc một file APK duy nhất. Google Play hiện công bố giới hạn base module 500 MB, từng asset pack 1,5 GB, tổng install-time modules/asset packs 4 GB và fast-follow/on-demand asset packs 30 GB. PAD cần quy trình App Bundle; không áp dụng trực tiếp cho một APK sideload đơn lẻ. Vì vậy hệ thống phải tách APK lõi và các content pack, nhưng người chơi tải một lần và chơi offline được.

Nguồn chính thức: https://support.google.com/googleplay/android-developer/answer/9859372 và https://developer.android.com/guide/playcore/asset-delivery

### Ghi chú về K — CSS/WebView

`color-mix()` có hỗ trợ đầy đủ trên Android WebView từ Chromium 111. Đây là lý do chọn 111 làm sàn mục tiêu tạm thời, không phải khẳng định mọi tính năng UI đều tương thích tuyệt đối. Cần feature detection và fallback.

Nguồn tham khảo: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix

## 4A. Bảng kiểm tra A–K sau V3

| Mục | V3 (C3 hiệu chỉnh v3.2) | Áp dụng ở (tài liệu hiện tại) | Ghi chú của Claude |
|---|---|---|---|
| A | `docs/audit/s0/`, commit baseline trước | Mục 4, 6.1, 6.3 | Fixture dự kiến ở `tests/fixtures/s0/`, test đặc tả ở `tests/s0/`, ghi chú "characterization — dự kiến đổi ở S1/S2" |
| B | Diagnostic UI debug-only qua build flag | Mục 4, 6.3 (S0-B), 6.8 | Hiện chỉ có một pipeline APK debug; tiêu chí kiểm chứng loại khỏi build phát hành ở 6.8 |
| C | Sửa CI xuất checksum + test report | Mục 4, 6.3 (S0-B bước B1) | Workflow mới chỉ áp dụng cho commit sau baseline; không tham chiếu `development-signing` |
| C2 | Đã giải quyết | Mục 2.1, G0.2 | Mã băm APK do reviewer tính độc lập từ artifact `14193446122`; Claude không tự tái tạo |
| C3 | Có, khóa development riêng, qua Environment `development-signing` | Mục 4.1, 6.3 (S0-B bước B2), Phụ lục A | O1-a, O3-b, O4; v3.2 viết lại theo Environment Secrets |
| D | Admin-1 là lớp tham chiếu xấp xỉ | Mục 3.3, 4, S3 | Nguồn Natural Earth chưa ghim phiên bản (`tools/etl/fetch_natural_earth.sh:7`) → ghim ở S3 |
| E | Quy tắc site duy nhất | Mục 3.4, 3.4.1 (bất biến), 3.4.2 (ID khi đổi PM), 4, S10–S13 | Mâu thuẫn V3 #1 đã sửa; V3-final #2, #3 đã thêm |
| F | Mọi polity có agency đều có thể chọn chơi khi đạt checklist | Mục 4, S19, mục 7 (UI đi cùng giai đoạn) | 147/274 là baseline hiện tại |
| G | G-a chuyển tiếp | Mục 4, S5, G0.8 | S0 kiểm UI có hiển thị đủ bài, URL, bản sửa, giấy phép cho từng đoạn |
| H | Provider-neutral | Mục 4, S23b | Phục vụ tệp đã tải cho WebView có thể cần plugin = dependency mới, xin duyệt ở S23b |
| I | Luồng lệnh do test cấp; replay sidecar tùy chọn | Mục 4, S1, 6.4 | Mâu thuẫn V3 #3 đã sửa: bỏ đề xuất v2 "nhật ký lệnh trong save" |
| J | 4 nhóm phép đo | Mục 4, 6.5, G0.7 | Mâu thuẫn V3 #2 đã sửa: tách thời lượng tick và thời gian chặn luồng chính |
| K | minSdk 23, WebView 111+ tạm thời | Mục 4, S2, S23c | iQOO Z10 Turbo không đại diện máy WebView cũ |

## 4B. Rủi ro và điểm mở sau V3

### Rủi ro (cập nhật từ v2)

| ID | Rủi ro | Bằng chứng | Mức | Trạng thái sau V3 |
|---|---|---|---|---|
| R1 | Cập nhật APK buộc gỡ cài đặt → mất save | Không lưu keystore (`.github/workflows/android-apk.yml:2`); save ở IndexedDB (`src/ui/game/storage.ts:1-5`) | P1 | Giảm bằng C3; **lần chuyển đầu tiên vẫn cần xuất/nhập save** (6.5.1) |
| R2 | Văn bản CC BY-SA đang ship | `historical_data/identity/texts.json` → `public/content/registry.json` | P1 | Đã chốt G-a; S0 kiểm đủ ghi công từng đoạn (G0.8) |
| R3 | Không có mã băm APK baseline | — | — | **Đóng** (mục 2.1) |
| R4 | Tất định "chuỗi lệnh" chưa kiểm được | `src/engine/commands.ts:34` không ghi nhật ký | P2 | Đã chốt I: kiểm bằng luồng lệnh do test cấp; replay sidecar tùy chọn |
| R5 | Đo theo khung hình che giấu tick dài | `src/ui/game/controller.ts:11, 69-80` | P1 | Đã chốt J: 4 nhóm phép đo |
| R6 | Natural Earth không ghim phiên bản | `tools/etl/fetch_natural_earth.sh:7` | P2 | Mở — S3 |
| R7 | Không autosave, không xử lý renderer/WebGL | grep không thấy `visibilitychange`, `pagehide`, `webglcontextlost`, `onRenderProcessGone` | **P0** | Mở — S2 |
| R8 | Test dân số có thể qua rỗng | `tests/simulation.test.ts:24` | P2 | Mở — ghi ở S0, sửa sau duyệt |
| R9 | Thu nhập ở S6 trước việc làm/lương | Roadmap | P2 | Đã ghi rõ ở S6/S12 |
| R10 | Lớp bản đồ mới thiếu ngân sách hiệu năng | Roadmap | P1 | Đã đưa vào tiêu chí PASS của S4, S11, S20 và quy tắc mục 7 |
| R11 | `versionCode` cố định = 1 | `android/app/build.gradle:10` | P2 | O3-b: giữ cho luồng development, kiểm cài đè trên iQOO; tăng đơn điệu ở S23c |
| R12 | Build sinh ra tệp chứa thời điểm build → web bundle không tái lập từng byte | `tools/build-data.ts:411` (`built_at: new Date()`), `tools/build-content.ts:59` (`generated: new Date()`) | P2 | [DỰ KIẾN — CHƯA CHẠY] so sánh O2 sẽ lệch ở các tệp này (mục 6.6); S0 chỉ ghi nhận, sửa thuộc S1 |
| R13 | Khóa ký development bị lộ qua workflow | Workflow hiện kích hoạt mọi nhánh, không `permissions`, action theo tag (`.github/workflows/android-apk.yml:5-8, 15-37`) | P1 | [v3.2] Environment `development-signing` + workflow ký chỉ `workflow_dispatch` + job ký không chạy mã repo + pin SHA + reviewer (4.1). Còn lại: người push được lên nhánh ký có thể sửa workflow → reviewer kiểm SHA commit trước khi duyệt |
| R14 | Nút "Xuất tệp" có thể không tạo được tệp trong WebView Android → không sao lưu được save trước lần chuyển chữ ký đầu tiên | [ĐÃ XÁC MINH mã] Xuất tệp dùng `Blob` + `<a download>` (`src/ui/screens/World.tsx:49`); `MainActivity` chỉ kế thừa `BridgeActivity` (`android/app/src/main/java/vn/dongchaylichsu/game/MainActivity.java:10`); mã nguồn `@capacitor/android` 7.6.10 đã cài không có `setDownloadListener` (grep). Nhập tệp dùng `<input type=file>`, Capacitor có `onShowFileChooser` (`BridgeWebChromeClient.java:276`). [CHƯA XÁC MINH trên thiết bị] | P1 | [v3.2] Thử ở 6.5.1 bước 3–4 **trước** mọi bước C3 trên thiết bị. Nếu không xuất được: bước cài APK ký development = `BLOCKED`, chủ dự án quyết định (điểm mở O5); không tự sửa mã xuất trong S0 |

### O1–O5 [O1–O4: v3.1 — áp dụng khuyến nghị `V3_FINAL_REVIEW_FOR_CLAUDE.md`; O5: điểm mở mới ở v3.2]

| ID | Câu hỏi | Lựa chọn áp dụng | Điều kiện | Ở đâu trong tài liệu |
|---|---|---|---|---|
| O1 | Thời điểm C3 | **O1-a — trong S0 (S0-B)** | Chỉ sau: (1) commit snapshot S0-A; (2) commit checksum CI; (3) APK baseline và quy trình xuất save đã được bảo toàn. Trước khi build/cài Diagnostic UI. Environment/secrets chưa có → C3 `BLOCKED`, không fallback | 4.1, 6.3 bước B2 |
| O2 | Tái lập baseline | **O2-a — so với manifest APK** | So từng đường dẫn, kích thước, SHA-256; báo **4 nhóm** (6.6, v3.2); kết luận chỉ "web/data payload comparison completed" hoặc `PARTIAL`/`FAIL`; **không** chứng minh tái lập toàn bộ APK hay khối chữ ký | 2.1, 6.6, G0.2 |
| O3 | versionCode | **O3-b — giữ `versionCode 1`** | Kiểm cài đè trên iQOO sau khi khóa cố định; không sửa Gradle trong C3 trừ khi thiết bị chứng minh cần; tăng đơn điệu trước phát hành công khai ở S23c | 4.1, R11 |
| O4 | Keystore + Environment | **Chủ dự án tạo** keystore, Environment `development-signing`, Environment Secrets/Variable và protection rules | Chỉ khóa development/test; **không** dùng Repository Secrets; không commit; không in log; không cấp cho PR không tin cậy; sao lưu mã hóa; **không dán keystore/khóa riêng/mật khẩu vào chat** | 4.1, Phụ lục A |
| O5 | [v3.2 — mới, **CHỦ DỰ ÁN QUYẾT ĐỊNH**] Nếu "Xuất tệp" không hoạt động trên APK baseline (R14) | Chưa chọn | Lựa chọn để chủ dự án cân nhắc: (a) chấp nhận mất ván hiện tại trên máy (dữ liệu thử nghiệm); (b) sao lưu dữ liệu WebView bằng `adb shell run-as` (APK debug thường debuggable) — [CHƯA XÁC MINH], cần adb qua máy tính hoặc gỡ lỗi không dây; (c) sửa chức năng xuất trong commit riêng — là thay đổi mã sản phẩm, **ngoài phạm vi S0** nếu chưa được duyệt riêng. Claude không tự chọn | R14, 6.5.1 |

## 5. Roadmap đã hiệu chỉnh sau phản biện

Đây là roadmap phụ thuộc kỹ thuật đã sửa, không phải lệnh triển khai. Các giai đoạn có thể có sub-gate; không gộp phần chưa đạt vào PASS.

### Nền móng

**S0 — Audit và baseline**
- **[v3.2]** Hai lớp bằng chứng trong cùng giai đoạn: S0-A `BASELINE_ORIGINAL`, S0-B `AUDIT_INSTRUMENTED` (mục 6.3).
- Snapshot repository/HEAD/branch/working tree/toolchain.
- Build sạch và CI đúng SHA; lưu log, APK hash.
- Catalog từng test và độ tin cậy của kết luận.
- Audit requirement matrix có file:dòng và runtime path.
- Audit data/asset/licenses/coverage toàn cầu.
- Fixture save, determinism và malformed-save behavior.
- Benchmark Node/desktop; thiết bị thật PASS hoặc BLOCKED.
- Risk register và sign-off.

**S1 — Data contracts, schema và save compatibility**
- Tách definition/static historical data khỏi mutable GameState.
- Versioning save, engine và data build độc lập.
- DB hash, stable IDs, provenance/quality/uncertainty.
- Migration tuần tự, fixture v1, rollback/backup, unknown fields/version policy.
- **[ĐÃ CHỐT V3 — I]** Save ghi `engineVersion`, `saveSchemaVersion`, `dataBuildHash`, seed. Không bắt buộc nhật ký lệnh đầy đủ trong mọi save; tất định kiểm bằng luồng lệnh do test cấp; replay log là sidecar debug tùy chọn (không làm phình save).
- **[CLAUDE ĐỀ XUẤT]** Chuẩn ước lượng chung cho dữ liệu thiếu (công thức, khoảng, độ tin cậy, người duyệt).
- Không thêm gameplay mới.

**S2 — Runtime, lifecycle và reliability**
- Đo baseline main-thread tick.
- Worker/chunking nếu vượt ngưỡng.
- Autosave, `visibilitychange/pagehide`, khôi phục sau process death.
- Xử lý WebView renderer bị thu hồi.
- Xử lý WebGL context lost/restored.
- Theo dõi memory/long task, không rò rỉ timer/listener.
- Kiểm tra IndexedDB transaction/error handling.
- **[ĐÃ CHỐT V3 — C3]** Cập nhật APK không mất save nhờ khóa development cố định (mục 4.1); nếu C3 ở S0 bị `BLOCKED` (O1-a) thì hoàn tất ở đây. Thêm sao lưu/khôi phục save trước cập nhật, gồm cơ chế xuất tệp hoạt động trong WebView Android (R14).
- **[ĐÃ CHỐT V3 — J]** Tối ưu theo 4 nhóm phép đo (mục 6.5); mục tiêu S2: chặn luồng chính do mô phỏng p95 ≤ 8 ms, p99 ≤ 16,7 ms (kèm frame budget theo refresh rate thực), không tick nào gây long task ≥ 50 ms; tốc độ 5 có backpressure, không mất tick, không chạy chồng.
- **[CLAUDE ĐỀ XUẤT]** Feature-check CSS/WebView + fallback theo quyết định K.

### Thế giới và dữ liệu

**S3 — Geography & administrative crosswalk**
- Giữ StrategicRegion ID.
- Raster crosswalk admin-1 ↔ region.
- Historical AdministrativeUnit có temporal validity/provenance.
- Boundary lineage khi chia/tách/sáp nhập/chuyển chủ.
- Không giả ranh giới hiện đại là ranh giới 1836.

**S4 — Settlement và địa danh đa ngôn ngữ**
- Thành phố, thị trấn, làng, cảng, thủ phủ và địa điểm.
- ID ổn định, tên theo thời kỳ/ngôn ngữ, tọa độ và confidence.
- Nguồn, sai số vị trí, dữ liệu dân số đô thị và phương pháp nội suy.
- Font fallback cho Latin, Cyrillic, Arabic, CJK, Mongolian/Manchu và hệ chữ cần thiết.
- Độ phủ phải thống kê theo 12 khu vực, không chỉ thủ đô/cường quốc.
- **[ĐÃ CHỐT V3]** Tiêu chí PASS có ngân sách hiệu năng cho lớp settlement (số điểm vẽ, LOD, culling, thời gian tải, RAM) và kiểm tra độ phủ theo 12 khu vực + loại polity.

**S5 — Asset Registry và quyền nội dung**
- Registry v2: SHA-256, dimensions, resolution variants, source, author, license, temporal validity, entity links.
- Audit tất cả tài sản hiện có và kiểm tra đúng đối tượng.
- Văn bản theo quyết định G-a: giữ trích đoạn CC BY-SA có ghi công đầy đủ trong giai đoạn chuyển tiếp; tách văn bản tự biên soạn (provenance từng khẳng định) khỏi trích đoạn CC BY-SA trong data model và UI; chỉ thay thế sau kiểm duyệt và cập nhật ghi công.
- Manifest/content pack, không tải tài sản vào bundle JS chính.
- Fallback và placeholder có nhãn, không giả ảnh thật.

### Xã hội và kinh tế

**S6 — Population Cohorts và xã hội nền tảng**
- Cohort theo region/settlement, culture, religion, strata và đặc điểm cần thiết.
- Tách strata, occupation, skill, employment, ownership.
- Thu nhập, nhu cầu, tài sản, literacy, health, migration, radicalism.
- Giai đoạn này mô phỏng phân bố nghề/việc làm nền tảng; tuyển dụng công trình chi tiết để ở **S12** *(v3.1: sửa tham chiếu S11 → S12)*.
- **[ĐÃ CHỐT V3]** Tuyển dụng theo công trình nghiệm thu ở **S12**. Thu nhập/tài sản ở S6 là ước lượng từ mô hình hiện tại, có nhãn.

**S7 — Goods, inventories và accounting**
- Goods taxonomy và đơn vị đo nhất quán.
- Supply/demand, inventory, spoilage/loss, prices và market clearing.
- Bảo toàn vật chất: đầu vào, đầu ra, tồn kho, nhập/xuất.
- Chưa yêu cầu khác biệt giá theo khoảng cách nếu transport chưa có.
- Hiệu chỉnh thay đổi GDP/giá bằng benchmark.

**S8 — Infrastructure, transport và market access**
- Đồ thị địa lý, đường bộ/đường thủy/đường sắt theo niên đại.
- Cảng, ga, cầu, kênh và nút logistics.
- Chi phí/thời gian vận tải, capacity, bottlenecks.
- Market access theo mạng lưới; phong tỏa và gián đoạn.
- Không dùng một hệ số railway duy nhất thay cho mạng vận tải.

**S9 — Technology và diffusion**
- Technology registry có năm, điều kiện và nguồn.
- Research, innovation, diffusion, adoption và capacity.
- Tác động thật lên PM, hạ tầng, quân sự, xã hội.
- Không mở công nghệ trước thời đại hoặc đồng nhất khả năng nghiên cứu toàn cầu.

### Công trình và phát triển

**S10 — BuildingType, Site potential và ProductionMethod definitions**
- Catalog công trình có loại, điều kiện, resource potential, land/terrain/climate, technology/law.
- Input/output, workforce templates, construction cost, infrastructure demand.
- PM groups, unlocks, era validity, data provenance.
- Không dùng số lượng loại công trình của Victoria 3 làm checklist cứng; xây danh mục phù hợp 1836–1936 toàn cầu.

**S11 — BuildingSite operations**
- BuildingSite sparse grouping, stable ID (quy tắc mục 3.4).
- Trạng thái cấp theo bất biến mục 3.4.1 (loại trừ lẫn nhau, cấp đang xây lấy từ `ConstructionProject`); ID khi đổi PM theo 3.4.2.
- Production, inputs, outputs, efficiency và closure.
- Mọi kết quả tính từ engine, UI không tự tính.
- **[ĐÃ CHỐT V3]** Nếu S12 chưa triển khai, S11 chỉ dùng **lao động sẵn có tổng hợp/placeholder có nhãn**; không tuyên bố đã có tuyển dụng hay tiền lương theo nghề.
- **[ĐÃ CHỐT V3]** Tiêu chí PASS có ngân sách hiệu năng cho lớp công trình (số site thật đo trên nhiều seed, chi phí tick, kích thước save, số đối tượng vẽ) và kiểm tra độ phủ nhiều khu vực.

**S12 — Employment, wages và labor competition**
- Jobs theo occupation/skill và site — **nghiệm thu tuyển dụng, tiền lương, cạnh tranh lao động thật ở đây** (không ở S11).
- Wages, hiring, unemployment, labor migration/competition.
- Liên kết population cohorts với công trình.
- Phân biệt lao động nông nghiệp truyền thống, lao động cưỡng bức/đồn điền, thợ thủ công, công nhân và lao động chuyên môn theo bối cảnh.

**S13 — Ownership, firms, capital và investment**
- State/private/aristocratic/capitalist/cooperative/foreign ownership theo thể chế.
- Revenue, cost, wage bill, profit, dividend, tax và subsidy.
- Investment pool và ownership transitions.
- Không giả định tất cả quốc gia có cùng cấu trúc sở hữu kiểu công nghiệp tư bản.

**S14 — Construction system**
- Construction capacity/sectors và queue.
- Project costs, goods, labor, progress, interruption, cancel/resume.
- AI dùng đúng queue.
- Không còn build tức thời.

**S15 — Local government, public services và urban development**
- Năng lực quản trị, cơ quan địa phương và administrative cost.
- Giáo dục, y tế, hành chính, an ninh và dịch vụ công.
- Đô thị hóa, nhà ở, dân cư thành phố và cơ sở hạ tầng.
- Không để thành phố tăng dân số không có việc làm/nhà ở/nguồn cung.

### Con người, chính trị và AI

**S16 — Character simulation foundation**
- Historical Character registry vào engine, không chỉ UI content.
- Sinh nhân vật mô phỏng, lifespan, traits, skills, offices, appointments.
- Provenance và độ chắc chắn tách biệt nhân vật lịch sử/giả lập.
- Cơ chế kế nhiệm và nhân vật thay thế khi thiếu dữ liệu.

**S17 — Politics and institutions**
- Thể chế đa dạng theo lịch sử, không áp một mô hình nghị viện.
- Nhóm lợi ích, phe phái, nội các/đảng/bầu cử khi phù hợp.
- Chính danh, cải cách, phản kháng, biểu tình, đình công, cách mạng, ly khai.
- Gắn với nhân vật, cohort và năng lực địa phương.

**S18 — Diplomacy and international order**
- Bilateral relations, treaty negotiation, crisis, ultimatum, concessions.
- Subjects/protectorates/colonies/autonomy/independence.
- Sanctions, trade pressure, great power interests and balance.
- Vector năng lực quốc gia, không dùng một `powerScore` làm logic duy nhất.

**S19 — Strategic AI (non-military first)**
- Goals/horizons, domestic assessment, economy, construction, research, diplomacy.
- **[v3.1 — V3-final #5]** Quyết định chính trị trong nước và thể chế từ S17: cải cách luật, bổ nhiệm/nội các khi thể chế có, phản ứng với biểu tình/đình công/ly khai, quan hệ trung ương–địa phương (S15).
- Explainable decision records and strategic memory.
- AI cho mọi polity có agency, kể cả nhỏ/yếu/phi tập trung phù hợp.
- Phần lập kế hoạch quân sự gắn với S20–S21, không giả định có quân đội chi tiết trước đó.

### Quân sự, lịch sử và phát hành

**S20 — Military organization**
- LegacyForcePool migration không bịa formation.
- UnitType, equipment, regiment/brigade/division/corps/army, fleet/task force.
- Commander/Character, recruitment, reserve, training, morale, supply stocks.
- Era/country-specific organization, không áp một cây tổ chức cho mọi nước.
- **[ĐÃ CHỐT V3]** Tiêu chí PASS có ngân sách hiệu năng cho lớp đơn vị quân sự (số đơn vị, tìm đường, chi phí tick, số đối tượng vẽ) và kiểm tra trên nhiều khu vực/loại polity.

**S21 — Operations, combat và logistics**
- Movement graph/pathfinding deterministic.
- Fronts, campaign objectives, supply lines, depots, attrition.
- Land battles, sieges, occupation and peace consequences.
- Naval fleets, blockade, convoy, transport, landing, naval combat.
- Tách S21a di chuyển/tiếp tế; S21b trận đánh/công thành; S21c hải quân nếu phạm vi quá lớn.

**S22 — Historical events and global calibration**
- Event registry với date/place/actors/context/cause/choice/outcomes.
- Kiểm định nhiều seed, nhiều khu vực, nhiều loại thể chế.
- Historical Mode là xu hướng/điều kiện, không khóa kết quả.
- Sandbox không dùng script cố định.
- Benchmark các mốc dân số/GDP/công nghiệp/quân sự/biên giới với khoảng tin cậy và nguồn.

**S23 — tách 3 sub-gate [ĐÃ CHỐT V3]**; mỗi sub-gate có ngân sách RAM, thời gian tải, số đối tượng vẽ, LOD/culling và test riêng. **[v3.1 — V3-final #4]** S23 **không** phải lần đầu người chơi tương tác với công trình, chính trị, thành phố hay quân đội: UI chức năng và nội dung/minh họa ngữ cảnh tối thiểu được giao ngay trong giai đoạn thêm hệ thống đó (mục 7).

**S23a — Tích hợp và hoàn thiện UI**
- Hợp nhất các màn hình đã có từ S3–S22 (world/country/province/settlement/building/unit), điều hướng xuyên hệ thống, nhất quán landscape-first và portrait riêng.
- Ngân sách: RAM WebView, thời gian mở từng màn hình, số đối tượng vẽ theo mức zoom.

**S23b — Hoàn tất độ phủ hình ảnh, content pack, offline delivery**
- Hình ảnh quốc gia, thành phố, công trình, xã hội, quân sự, nhân vật, sự kiện theo vùng/thời kỳ, có provenance/giấy phép.
- Manifest, nhiều pack, SHA-256, resume, kiểm tra dung lượng, cập nhật an toàn, chơi offline (quyết định H).
- Ngân sách: kích thước pack, thời gian giải mã ảnh, bộ nhớ ảnh đã giải mã, cache.

**S23c — Release QA và device matrix**
- Android real-device QA, phiên dài, pin/nhiệt/bộ nhớ, ma trận WebView (quyết định K), quyết định phân phối APK/AAB.
- Ngân sách: khởi động lạnh, phiên 60 phút không tăng bộ nhớ liên tục, không crash/ANR.

## 6. S0 — phạm vi thực hiện đã hiệu chỉnh

### 6.1. Không được làm trong S0

- Không sửa công thức mô phỏng, AI, economy, population, politics, diplomacy, military.
- Không thay schema `GameState` hoặc save format.
- Không đổi dữ liệu lịch sử đang chạy hoặc ID vùng.
- Không thêm gameplay.
- Không tạo các BuildingSite, Settlement hay Unit thật vào game.
- Không tuyên bố Android PASS nếu chưa đo trên thiết bị.

Được phép:
- Đọc source, Git, CI và logs.
- Chạy clean build/test và benchmark.
- Tạo tài liệu, script audit, checksum và fixture từ đúng baseline.
- Thêm characterization tests không đổi logic, sau khi commit baseline gốc đã được chốt. **[CLAUDE ĐỀ XUẤT]** "Baseline gốc" = commit `2240a8f` (đã tồn tại); commit S0 đầu tiên chỉ chứa `S0_REPOSITORY_SNAPSHOT.md` + log, trước mọi script/test/fixture, để tách bạch bằng chứng nguyên trạng.
- Thêm debug-only diagnostic UI theo quyết định B, trong commit riêng thuộc S0-B; chứng minh không vào build phát hành theo 6.8.
- Sửa workflow CI chỉ theo quyết định C (checksum/test report) và C3 (workflow ký riêng qua Environment `development-signing`) theo O1-a; mỗi thay đổi một commit riêng thuộc S0-B.
- **[v3.2 — CR §3]** Mọi lệnh sinh tệp (`db.json`, `map.json`, `registry.json`, `public/generated/**`, `dist/`) của S0-A chạy trong **worktree/checkout tạm** đúng `2240a8f`, không trong working tree chính.

### 6.2. Deliverables bắt buộc

- `S0_REPOSITORY_SNAPSHOT.md` — SHA, branch, upstream, clean status, 20 commit, diff, toolchain thực.
- `S0_BUILD_TEST_REPORT.md` — clean checkout, từng lệnh build, test, thời gian, log CI, APK SHA-256.
- `S0_TEST_CATALOG.md` + `s0_test_catalog.json` — từng test, file:dòng, input/action/expected, độ ổn định 3 lần, giới hạn.
- `S0_REQUIREMENT_MATRIX.csv` — từng yêu cầu, trạng thái, file:dòng, test, runtime reachability.
- `S0_GLOBAL_DATA_AUDIT.md` — 12 khu vực, loại thực thể, độ phủ, nguồn/ước tính/default/missing; crosswalk region × admin-1.
- `S0_ASSET_AUDIT.md` — toàn bộ asset, checksum, provenance, license, temporal validity, kích thước và sample review.
- `S0_SAVE_DETERMINISM_REPORT.md` + fixtures — Historical và Sandbox fixtures, hashes, malformed saves, exact continuation.
- `S0_RUNTIME_ANDROID_REPORT.md` — boot/tick/command/save/load/content/lifecycle/WebGL/WebView/fonts.
- `S0_PERFORMANCE_BASELINE.json` + `.md` — theo giao thức J (mục 6.5): ba môi trường tách riêng (Node/server, trình duyệt desktop, thiết bị Android), 4 nhóm phép đo; device result hoặc BLOCKED.
- `S0_RISK_REGISTER.md` — P0/P1/P2, bằng chứng, ảnh hưởng, mitigation và giai đoạn xử lý.
- `S0_SIGNOFF.md` — G0.1–G0.9 PASS/PARTIAL/BLOCKED/FAIL/NOT TESTED.

Mỗi tệp phải ghi baseline SHA, ngày giờ, lệnh tái tạo, nguồn dữ liệu và **nhãn `BASELINE_ORIGINAL` hoặc `AUDIT_INSTRUMENTED`** cho từng kết quả [v3.2 — CR §3]. Không dùng kết quả `AUDIT_INSTRUMENTED` để tuyên bố là số liệu baseline nguyên trạng.

### 6.3. Giao thức S0: S0-A rồi S0-B [ĐÃ CHỐT V3; tách lớp bằng chứng ở v3.2 — CR §3]

S0 vẫn là **một** giai đoạn audit/characterization/instrumentation; không thay đổi logic gameplay hay save schema. Mọi commit S0 là commit audit/instrumentation, không phải commit game; mỗi commit ghi baseline SHA `2240a8f` và SHA của chính nó.

#### S0-A — Baseline nguyên trạng (`BASELINE_ORIGINAL`)

- **A1 — Commit 1, snapshot:** chỉ `docs/audit/s0/S0_REPOSITORY_SNAPSHOT.md` + log nguyên văn (git, CI run/job/artifact, ZIP digest, APK SHA-256, SHA-256 của manifest CSV). Không script, test, fixture, workflow.
- **A2 — Clean build trong worktree tạm** đúng `2240a8f` (ví dụ `git worktree add <thư mục tạm> 2240a8f`, ngoài working tree chính): `npm ci`, `npm run data`, `npm run map`, `npm run content`, `npm run typecheck`, `npx vite build`, `npx vitest run` ×3; lưu log nguyên văn.
- **A3 — Ghi trạng thái tệp sinh trước/sau:** các công cụ ghi tệp và đích của chúng — `tools/build-data.ts` → `src/generated/db.json`; `tools/build-map.ts` → `src/generated/map.json`, `public/generated/*`; `tools/build-content.ts` → `public/content/registry.json`; Vite → `dist/`. Ghi SHA-256 trước và sau mỗi bước. [ĐÃ XÁC MINH] `npm run build` và `npm test` đều gọi `prepare-assets` (= data + map + content, `package.json:10, 12, 14`) nên **sinh lại** các tệp trên; log phải ghi rõ lệnh nào đã sinh lại tệp nào.
- **A4 — So payload với manifest APK** theo 6.6 (O2-a), chỉ dùng lệnh chuẩn (`sha256sum`, `diff`, …) có log nguyên văn.
- **A5 — Đo `BASELINE_ORIGINAL`:** benchmark Node và đo trình duyệt desktop bằng harness **nằm ngoài** mã sản phẩm, trỏ vào worktree baseline chưa sửa; harness được commit ở S0-B bước B3, nên A5 chạy sau B3 nhưng kết quả vẫn gắn `BASELINE_ORIGINAL` vì mã/build sản phẩm không đổi; ghi SHA commit của harness. Trên thiết bị: APK baseline chỉ đo bằng quan sát/công cụ bên ngoài (6.5.1 bước 2), không có Diagnostic UI; nhóm phép đo nào không đo được từ ngoài ghi `unsupported`.
- Không thêm Diagnostic UI, không instrument build gốc, không sửa workflow, test hay logic sản phẩm trong S0-A.

#### S0-B — Công cụ kiểm toán bổ sung (`AUDIT_INSTRUMENTED` khi build sản phẩm bị ảnh hưởng)

Chỉ bắt đầu sau khi A1–A4 đã có snapshot và log.
- **B1 — Commit 2, CI checksums/test reports (C):** chỉ sửa `.github/workflows/android-apk.yml`: xuất APK SHA-256, ZIP digest, hash bundle/dữ liệu, test report; thêm `permissions` tối thiểu. Không tham chiếu `development-signing`.
- **B2 — Commit 3, C3 [O1-a]:** chỉ sau khi (i) A1 và B1 đã ghi, (ii) chủ dự án giữ tệp APK baseline (SHA-256 ở 2.1) và (iii) quy trình xuất/nhập save đã được thử trên APK baseline (6.5.1). Thêm workflow ký riêng theo 4.1.3–4.1.4. Environment `development-signing`/protection rules/Environment Secrets chưa có → **C3 `BLOCKED`, S0 dừng tại cổng này**; không fallback Repository Secrets hay khóa không được bảo vệ. Nếu 6.5.1 bước 3–4 thất bại (R14) thì điều kiện (iii) không đạt → B2 `BLOCKED` chờ chủ dự án quyết định O5. Phải xong trước B5.
- **B3 — Commit 4, script audit:** harness benchmark, crosswalk vùng × admin-1 từ lưới raster, test catalog, coverage, asset checksum. Không đổi dữ liệu sản phẩm.
- **B4 — Commit 5, characterization tests + fixtures** sinh từ đúng baseline (6.7); chỉ mô tả hành vi hiện tại.
- **B5 — Commit 6, Diagnostic UI debug-only (B):** theo tiêu chí 6.8.
- **B6 — Đo `AUDIT_INSTRUMENTED`:** Node + desktop + thiết bị (6.5, 6.5.1) với Diagnostic UI; đo overhead bật/tắt.
- **B7 — Tổng hợp** risk register, sign-off theo G0.9. Không tự chuyển S1.

### 6.4. G0.1–G0.9

| Gate | PASS | BLOCKED | FAIL |
|---|---|---|---|
| G0.1 Snapshot | SHA/branch/status/diff/toolchain khớp | — | SHA không khớp hoặc không tái lập |
| G0.2 Build/CI | Clean build + 58 test trên đúng SHA trong worktree tạm; APK baseline SHA-256 ghi riêng với ZIP digest (2.1); hash tệp sinh trước/sau; so sánh manifest (6.6) báo đủ 4 nhóm và **mọi** khác biệt được chứng minh bằng diff thực tế; kết luận ghi đúng "web/data payload comparison completed" | Chỉ BLOCKED nếu clean build không chạy được vì môi trường, có lý do và phương án | Build/test lỗi không giải thích; tráo ZIP digest với APK digest; khác biệt chưa chứng minh mà bị bỏ qua; viết "whole APK reproducible" |
| G0.3 Test catalog | Mọi test được phân tích, ổn định 3/3 hoặc ghi flaky | — | Test flaky không phân tích |
| G0.4 Feature audit | Mọi yêu cầu có bằng chứng và runtime path | Mã không thể truy vết, cần audit bổ sung | Tuyên bố không có bằng chứng |
| G0.5 Global data | Độ phủ theo entity/12 vùng/crosswalk; không nhầm default là sourced | Nguồn/license chưa xác minh | Báo covered cho dữ liệu chung/mặc định |
| G0.6 Save/determinism | Phép thử 6.7 đạt cho cả Historical và Sandbox; fixture có hash; hành vi save hỏng/sai version/thiếu trường được ghi | Không có — đây là baseline test | Hai nhánh khác nhau (ghi FAIL kèm state path đầu tiên khác); test qua rỗng |
| G0.7 Runtime/perf | Ba môi trường × 4 nhóm phép đo (6.5) tái lập được; baseline **không** cần đạt ngưỡng S2 | Thiếu số đo iQOO thì BLOCKED | Benchmark không tái lập; quy đổi máy chủ thành điện thoại; điền 0 cho API không hỗ trợ |
| G0.8 Asset/license | Asset inventory, checksum và giấy phép đầy đủ; mọi đoạn văn bản CC BY-SA hiển thị ghi công/URL/bản sửa/giấy phép (G-a) | License nguồn cụ thể đang chờ xác minh | Có asset/văn bản thiếu nguồn/license không xử lý |
| G0.9 Risk/signoff | Risk register có evidence; **không còn P0** chưa xử lý hoặc chưa có biện pháp ngăn chặn được chủ dự án chấp thuận; mỗi P1 có bằng chứng, tác động, mitigation, giai đoạn xử lý và người chịu trách nhiệm; sign-off của chủ dự án sau khi reviewer kiểm tra artifact/report | Có hạng mục device BLOCKED (G0.7) hoặc C3 BLOCKED | Rủi ro trọng yếu không ghi nhận; đổi `BLOCKED` thành `PASS` chỉ bằng đổi nhãn |

**Quy tắc G0.9 [v3.2 — CR §8]:** không đổi `BLOCKED` thành `PASS` chỉ bằng cách đổi nhãn — phải có phép đo/bằng chứng bổ sung. Ngoại lệ của chủ dự án (bằng văn bản) không viết lại lịch sử test thành PASS. R7 (P0, mục 4B) cần biện pháp ngăn chặn được chủ dự án chấp thuận cho thời gian tới S2 (ví dụ: hướng dẫn lưu tay thường xuyên trong game; chỉ dựa vào "Xuất tệp" khi R14 đã được xác nhận hoạt động trên thiết bị) thì G0.9 mới PASS. Lựa chọn biện pháp là của chủ dự án.

**S0 chỉ PASS khi G0.1–G0.9 PASS.** Nếu G0.7 thiếu đo thiết bị thật thì S0 là PARTIAL/BLOCKED, không tự chuyển thành PASS. **Số đo máy chủ/desktop không bao giờ được dùng thay số đo iQOO** (v3.1 — V3-final #7). Chủ dự án có thể chấp nhận miễn trừ bằng văn bản, nhưng miễn trừ phải được ghi trong sign-off và không đổi kết quả đo thành PASS. **S0 không tự mở S1:** cần sign-off riêng của chủ dự án sau khi reviewer kiểm tra artifact và report.

### 6.5. Giao thức đo hiệu năng J [ĐÃ CHỐT V3]

| Nhóm | Đo gì | Thống kê |
|---|---|---|
| 1. Thời lượng tick | Thời gian tính `stepMonth` / một tick. Nếu sau này dùng Worker: tách thời gian compute trong worker và thời gian main-thread dispatch/receive/apply | p50, p95, p99, max |
| 2. Chặn luồng chính do mô phỏng | Thời gian đồng bộ một tick giữ luồng UI | p50, p95, p99, max; mục tiêu S2: p95 ≤ 8 ms, p99 ≤ 16,7 ms (60 Hz), không long task ≥ 50 ms do tick; ghi refresh rate thực và frame budget tương ứng |
| 3. Phản hồi/hiển thị | Frame interval/FPS, khung hình trễ, long task ≥ 50 ms trong 60 s ở mỗi tốc độ 1–5; input latency chạm → phản hồi nếu công cụ hỗ trợ | phân phối + số đếm |
| 4. Tốc độ 5 | Tick/giây, compute p50/p95/p99, queue/backlog; không xếp hàng vô hạn, không chạy chồng, không mất tick | thông lượng + backlog |

- Mỗi tốc độ 1–5 đo tối thiểu 60 s sau warm-up.
- Ghi: model thiết bị, Android, phiên bản Android System WebView/Chromium, refresh rate, build SHA, data hash, seed, thời điểm, trạng thái nhiệt nếu người dùng cung cấp được.
- Ba môi trường báo cáo riêng: Node/server, trình duyệt desktop, thiết bị Android; không quy đổi giữa chúng.
- API không hỗ trợ (`performance.memory`, PerformanceObserver `longtask`, phiên bản WebView) ghi `unsupported`, không điền 0.
- Không gửi dữ liệu ra mạng; export JSON cục bộ.
- **[v3.2 — CR §6]** Mỗi tốc độ ghi thêm: seed, ngày/tick count lúc bắt đầu và kết thúc đo. Không tuyên bố native RSS, bộ nhớ GPU, nhiệt độ pin hay trạng thái nhiệt nếu Diagnostic UI không có API native đáng tin cậy; dữ liệu nhiệt chỉ ghi khi chủ dự án tự cung cấp và gắn nhãn nguồn.
- Chưa có số đo iQOO thật → G0.7 = `BLOCKED`, S0 = `PARTIAL`; không chuyển sang PASS.
- [ĐÃ XÁC MINH] Baseline hiện chạy một tick mỗi `requestAnimationFrame` ở tốc độ 5 (`src/ui/game/controller.ts:11, 73-77`), không có hàng đợi → nhóm 4 ở baseline ghi "không có backlog do thiết kế, thông lượng bị giới hạn bởi tần số khung hình".

#### 6.5.1. Giao thức trên iQOO Z10 Turbo [v3.2 — CR §6]

Thứ tự so với 6.3: bước 1–4 làm trên APK baseline **trước** S0-B bước B2; bước 5 sau B2; bước 6–10 sau B5.

1. Ghi model, phiên bản Android, phiên bản Android System WebView/Chromium (Cài đặt → Ứng dụng), refresh rate đang dùng.
2. **Với APK baseline (đang cài):** chạy giao thức đo không instrument (`BASELINE_ORIGINAL`, quan sát/công cụ ngoài nếu có, ví dụ `adb`/`chrome://inspect` khi có máy tính).
3. **Sao lưu save trước khi cài APK ký khóa development:** cửa sổ Hệ thống → mục "Tệp" → "Xuất tệp" (`src/ui/screens/World.tsx:65`); lưu tệp ở nơi chủ dự án kiểm soát. **[CHƯA XÁC MINH — R14]** cơ chế xuất có thể không tạo được tệp trong WebView Android; nếu không có tệp → ghi `BLOCKED`, dừng, chờ chủ dự án quyết định O5; **không** gỡ APK baseline.
4. Kiểm **nhập lại** tệp vừa xuất trên APK baseline (Hệ thống → "Tệp" → "Nhập tệp") và mở được ván, đúng ngày trong game.
5. Cài APK đầu tiên ký khóa development (build của commit B2, chưa có Diagnostic UI). Nếu Android từ chối cập nhật vì khác certificate: **chỉ gỡ APK baseline sau khi chủ dự án xác nhận bước 4 thành công**, rồi cài APK mới và nhập lại save; kiểm ván mở đúng.
6. Sau B5: cài APK có Diagnostic UI, cũng ký khóa development, **đè lên** bản ở bước 5 **không gỡ** (kiểm O3-b: cùng applicationId, cùng certificate, `versionCode 1`); ghi kết quả và save có còn không. Đây là bằng chứng cho tiêu chí "hai APK ký liên tiếp cài nâng cấp được" ở 4.1.5.
7. Mở game; chạy từng tốc độ 1–5 (warm-up rồi ≥ 60 s mỗi tốc độ) theo 6.5; xuất JSON của Diagnostic UI (`AUDIT_INSTRUMENTED`).
8. Lưu/tải trong game; đưa app ra nền ≥ 5 phút rồi quay lại; ghi game có giữ trạng thái không.
9. Thử tình huống WebView/renderer bị hệ điều hành thu hồi **nếu tái hiện được** (ví dụ mở nhiều app nặng); ghi kết quả hoặc "không tái hiện được".
10. Gửi lại: JSON đã xuất, ảnh chụp/video, ghi chú; **không** gửi keystore/mật khẩu.

### 6.6. So sánh tái lập với manifest APK [O2-a, v3.1; làm chặt ở v3.2 — CR §5]

- **Đầu vào:** `APK_BASELINE_WEB_ASSETS_SHA256.csv` (592 dòng: `path_relative_to_assets_public`, `size_bytes`, `sha256`) và `dist/` build lại từ clean checkout `2240a8f`.
- **Cách so:** clean build tại đúng `2240a8f` trong worktree dùng một lần; so theo đường dẫn tương đối, kích thước và SHA-256. Báo **tối thiểu bốn nhóm**:
  1. Trùng khớp hoàn toàn (đường dẫn, kích thước, SHA-256).
  2. Có trong APK baseline nhưng thiếu trong `dist/` — tách riêng tệp do Capacitor chèn khi đóng gói.
  3. Có trong `dist/` nhưng không có trong APK baseline.
  4. Cùng vai trò/ứng viên nhưng khác kích thước hoặc SHA-256.
- **Tệp tên có hash nội dung (Vite `assets/index-*.js`, `assets/index-*.css`):** ghép cặp theo **vai trò** (entry JS, entry CSS) và nội dung, rồi đưa **diff thực tế**; không bỏ qua chỉ vì tên có hash.
- **Phạm vi kết luận:** chỉ payload web/dữ liệu trong `assets/public/`. Kết luận chỉ được là **"web/data payload comparison completed"** hoặc **`PARTIAL`/`FAIL`**; không được viết "whole APK reproducible". Manifest không chứng minh mã native, signing block, metadata ZIP hay toolchain Android tái lập từng byte.
- **[DỰ KIẾN — CHƯA CHẠY] Khác biệt có thể có — mỗi điểm phải được chứng minh bằng dữ liệu thực tế, không được tự động bỏ qua:**
  - `cordova.js`, `cordova_plugins.js` (0 byte trong manifest): nhiều khả năng Capacitor chèn khi `cap sync`/đóng gói → nhóm 2 "chèn bởi đóng gói" **chỉ khi** manifest thực tế và cơ chế đóng gói xác nhận.
  - `content/registry.json` chứa `generated: <thời điểm build>` (`tools/build-content.ts:59`).
  - `src/generated/db.json` chứa `meta.built_at` (`tools/build-data.ts:411`) và được đóng vào bundle JS → `assets/index-*.js` có thể khác nội dung **và** tên tệp.
  - **[v3.2 — sửa lỗi v3.1]** `index.html` tham chiếu tên tệp JS/CSS có hash → nếu tên bundle JS đổi thì `index.html` cũng khác. v3.1 ghi "586 tệp còn lại dự kiến trùng, kể cả `index.html`" là **sai**; bỏ con số đó.
  - Mọi khác biệt ngoài các trường thời gian đã nhận diện phải giải thích riêng; chưa giải thích → G0.2 `FAIL`/`PARTIAL`.
- **Không sửa generator** để bỏ timestamp trong S0; nếu muốn chuẩn hóa output build, ghi rủi ro R12 và chuyển sang S1.

### 6.7. Phép thử save/load và tiếp tục tất định [v3.2 — CR §4]

Test characterization, tái lập được, chạy trong S0-B bước B4 trên mã baseline:

1. Cố định cùng engine build, data build (hash `db.json`/`map.json`), mode, seed và chuỗi lệnh do test cấp.
2. **Nhánh A:** khởi tạo, chạy liên tục N tháng.
3. **Nhánh B:** khởi tạo cùng trạng thái, chạy K tháng, `serialize` đúng định dạng save hiện tại (`src/engine/save.ts:7-9`), `deserialize`, rồi chạy N − K tháng còn lại với cùng chuỗi lệnh.
4. So trạng thái cuối bằng **biểu diễn chuẩn hóa/hash** của `GameState`.
5. Biểu diễn chuẩn hóa **bao gồm** `seed` và trạng thái RNG (`rng`, `src/engine/types.ts:105`) cùng mọi dữ liệu ảnh hưởng tương lai mô phỏng (quốc gia, vùng, chiến tranh, hiệp ước, quan hệ, giá, thống kê thị trường, nhật ký, divergence, counters, quyết định chờ…). So sánh trên `GameState` (trường `state` của phong bì); các trường phong bì `format`, `version`, `savedAt` nằm ngoài phép so. [ĐÃ XÁC MINH] `savedAt` hiện là **ngày trong game** dạng `YYYY-MM` lấy từ `st.date` (`save.ts:8`), không phải thời điểm ghi tệp. Mặc định so **mọi** trường của `GameState`; chỉ loại trường được chứng minh là metadata không ảnh hưởng gameplay, và danh sách loại trừ phải ghi trong báo cáo.
6. **Không** sắp xếp lại mảng mang ý nghĩa thứ tự mô phỏng; chỉ chuẩn hóa thứ tự key của object hoặc tập hợp đã xác định là không có thứ tự.
7. Chạy riêng cho Historical và Sandbox; dùng ít nhất hai giá trị K (một giữa năm, một đúng ranh giới năm — nơi lấy mẫu chỉ số năm).
8. Thử save hỏng (không phải JSON), sai `format`, version không hỗ trợ, thiếu trường — ghi **đúng hành vi hiện tại** (ném lỗi, tải được với mặc định như `marketStats` ở `save.ts:17`, hoặc tải được nhưng lỗi khi chạy tiếp).
9. Hai nhánh khác nhau → ghi `FAIL` kèm **state path đầu tiên khác nhau**; không sửa `save.ts`, RNG hay engine trong S0.
- **Chống qua rỗng:** test phải khẳng định trạng thái không tầm thường (tick = N, có quốc gia còn tồn tại, có giá trị thay đổi giữa tháng 0 và tháng N) trước khi so; so sánh hai trạng thái rỗng không được tính là đạt.
- **Test dân số hiện có:** ghi nhận tên test/comment "1870" nhưng truy vấn mốc "1875" (`tests/simulation.test.ts:21-22`) và nhánh `continue` có thể bỏ qua đối tượng (`:24`); trong S0 **chỉ ghi nhận, không sửa** test gốc.

### 6.8. Diagnostic UI debug-only — tiêu chí kiểm chứng [v3.2 — CR §7]

Không chỉ ẩn menu bằng CSS hoặc cờ runtime. Phải kiểm:
- **Build debug, diagnostics bật:** màn hình chẩn đoán và export JSON hoạt động — **trên WebView Android thật**, không chỉ trên trình duyệt desktop. Vì R14 (tải `Blob` qua `<a download>` có thể không hoạt động trong WebView), design note của B5 phải nêu cơ chế export đã kiểm trên thiết bị; phương án dự phòng không cần quyền mới và không mạng (ví dụ hiển thị JSON để người dùng tự chọn/sao chép).
- **Build phát hành (hiện chưa có pipeline release riêng → dùng build web production với diagnostics tắt):** module/route/component/chuỗi của diagnostics **không có** trong output nếu build system loại được mã chết (ví dụ cờ thời điểm build + `import()` động để Vite không phát chunk); kiểm bằng tìm chuỗi đánh dấu duy nhất trong `dist/`. Nếu không loại được hoàn toàn: chứng minh entrypoint và tính năng không truy cập được và không chứa dữ liệu nhạy cảm.
- **Không mạng:** module không dùng `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`; kiểm thêm bằng nhật ký mạng của trình duyệt desktop khi chạy kịch bản đo.
- **Không quyền Android mới:** so `AndroidManifest.xml` (đã gộp) trước/sau — không thêm permission.
- **Không ghi đè save:** không ghi vào kho save IndexedDB; export JSON là tệp riêng do người dùng chủ động chia sẻ.
- **Không đổi kết quả mô phỏng:** cùng seed, cùng kịch bản, diagnostics bật/tắt → hash trạng thái giống nhau.
- **Overhead:** đo bật/tắt bằng cùng seed và kịch bản; báo số liệu thực; không tuyên bố overhead bằng 0 khi chưa đo.

## 7. Quy tắc stage gate cho mọi giai đoạn sau

- Chỉ giao một giai đoạn được duyệt tại một thời điểm.
- Trước khi code, Claude phải trình bày design note, dependency graph, schema/API, file dự kiến, migration, test plan và rủi ro.
- Sau khi duyệt mới code đúng phạm vi.
- Mỗi giai đoạn có commit riêng, test, screenshot, benchmark và changelog.
- Không đánh dấu PASS chỉ vì có type, file JSON, component hoặc UI.
- **[v3.1 — V3-final #4] UI đi cùng giai đoạn:** giai đoạn nào thêm một hệ thống gameplay phải giao trong chính giai đoạn đó UI chức năng (landscape và portrait) và nội dung/minh họa ngữ cảnh tối thiểu có nguồn/giấy phép; S23a chỉ tích hợp/hoàn thiện, S23b hoàn tất độ phủ asset và gói offline.
- Nếu thay đổi simulation, chạy nhiều seed và báo cáo chênh lệch population/GDP/price/war/territory.
- **[ĐÃ CHỐT V3] Độ phủ toàn cầu:** mọi giai đoạn kiểm trên nhiều khu vực trong 12 khu vực và nhiều loại polity (có chủ quyền, chư hầu, thuộc địa/công ty, phi tập trung, nổi dậy, tương lai); dữ liệu ước tính gắn nhãn, không tính là có nguồn; mọi quốc gia trong game có bản sắc và AI phù hợp.
- **[ĐÃ CHỐT V3] Ngân sách hiệu năng khi thêm đối tượng:** giai đoạn nào thêm đối tượng mô phỏng hoặc đối tượng vẽ bản đồ (S4 settlement, S11 building site, S20 đơn vị) phải benchmark ngay trong giai đoạn đó (số đối tượng thật, chi phí tick, kích thước save, RAM, số đối tượng vẽ, LOD/culling), không đợi S23.
- Nếu lỗi ảnh hưởng phạm vi tương lai, dừng và trình bày lựa chọn, không tự ý mở rộng.
- PASS chỉ sau khi người dùng và reviewer chấp thuận bằng chứng.

## 8. Tin nhắn chính thức gửi Claude [bản nháp của reviewer — đã được thay bằng `DECISIONS_FOR_CLAUDE_V3.md` và `PROMPT_TO_CLAUDE.md` của gói V3]

> Tôi đã đọc bản phản biện và chốt các quyết định A–K trong `DECISIONS_AND_S0_REVISED_VI.md`.
>
> Hãy cập nhật tài liệu S0 và roadmap theo quyết định này. Trước hết, chỉ tạo bản tài liệu hiệu chỉnh và liệt kê các mâu thuẫn còn lại. Chưa chạy S0, chưa thêm diagnostic UI, chưa sửa workflow, chưa sửa code hoặc commit.
>
> Sau khi cập nhật, gửi lại diff và bảng xác nhận A–K. Tôi sẽ duyệt bản thiết kế cuối cùng. Chỉ khi có chỉ thị riêng mới được bắt đầu S0.
>
> Đặc biệt: CI run `43793446130` trên SHA `2240a8f` đã được xác minh thành công; artifact digest hiện có là của ZIP, không phải APK. Không được nhầm hai hash. S0 phải giữ baseline gốc và phân biệt commit audit/instrumentation với commit game.

---

## 9. Nguồn và bằng chứng

### Repository / CI
- Commit: https://github.com/mtieu6470-maker/Victori3-mobile/commit/2240a8fb865e0021eec2f2f4f1c6803528be9e2c
- CI run: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43793446130
- Artifact: https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43793446130/artifacts/14193446122
- Audit: https://github.com/mtieu6470-maker/Victori3-mobile/blob/2240a8fb865e0021eec2f2f4f1c6803528be9e2c/docs/audit/MASTER_SPEC_AUDIT.md
- Global coverage: https://github.com/mtieu6470-maker/Victori3-mobile/blob/2240a8fb865e0021eec2f2f4f1c6803528be9e2c/docs/audit/GLOBAL_COVERAGE.md
- Proposed architecture: https://github.com/mtieu6470-maker/Victori3-mobile/blob/2240a8fb865e0021eec2f2f4f1c6803528be9e2c/docs/architecture/PROVINCES_BUILDINGS_MILITARY.md

### Claude's uploaded review
`PHAN_BIEN_ROADMAP_VA_S0.md`, received 16/11/2026. The A–K questions and S0 gates were used as the review baseline; this response resolves them with the restrictions above.

### Bằng chứng baseline (v3)
- Commit `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`; run `43793446130`; job `133056831671`; artifact `14193446122`
- ZIP digest `sha256:8bad8d7efd055e16630dc0770ebd6cf811722eb8592c04a7fe1f6c291f852077` (GitHub API, Claude xác minh)
- APK `app-debug.apk` 18 042 511 byte, SHA-256 `8a4beb6af4d033346dd8c58994df72f2a1bfe980e6ef0e10d57a9ff013d0846c` (reviewer tính độc lập từ artifact `14193446122`, `APK_BASELINE_CHECKSUMS.txt`)
- Manifest `APK_BASELINE_WEB_ASSETS_SHA256.csv`: 592 tệp, 17 764 559 byte; SHA-256 tệp CSV `78c4a21f06607c60cc721801fb0209ca1bace0386831d743e2c7a8891fb00eca` (reviewer tính độc lập)
- Quyết định bổ sung: `V3_FINAL_REVIEW_FOR_CLAUDE.md` (O1–O4, 7 chỉnh sửa)
- Bổ sung v3.2: repository **public** (GitHub API, 16/11/2026); `.github/workflows/android-apk.yml:5-8, 15, 16, 25, 37` (trigger mọi nhánh, action theo tag, không `permissions`); `src/engine/save.ts:7-9, 17`; `src/engine/types.ts:105`; `src/ui/game/controller.ts:73-77`; `package.json:10, 12, 14`; `tools/build-map.ts:232-236`, `tools/build-data.ts:14, 420`, `tools/build-content.ts:70` (đích ghi tệp sinh); `src/ui/screens/World.tsx:49-50, 65` (xuất/nhập tệp); `android/app/src/main/java/vn/dongchaylichsu/game/MainActivity.java:10`; `node_modules/@capacitor/android` 7.6.10 (`BridgeWebChromeClient.java:276`, không có `setDownloadListener`); nguồn GitHub về Environment trong `SOURCE_REGISTER.v3.2.md`.
- Bổ sung v3.1: `tools/build-data.ts:411`, `tools/build-content.ts:59` (timestamp trong output build); `.github/workflows/android-apk.yml:5-8` (kích hoạt `push` mọi nhánh và `workflow_dispatch`, không có `pull_request`)
- Quyết định: `DECISIONS_FOR_CLAUDE_V3.md` (16/11/2026)
- Bổ sung v3: `android/app/build.gradle:10` (`versionCode 1`)

### Bằng chứng Claude đối chiếu lại trong v2 (HEAD `2240a8f`)
- `tests/simulation.test.ts:21-24`; `db.json` benchmarks 1875 cho GBR/FRA/USA/RUS/SPA
- `.github/workflows/android-apk.yml:2` (ký debug tự sinh); log job `133056831671` (Tests 58 passed, BUILD SUCCESSFUL)
- `src/engine/commands.ts:34`, `src/engine/core.ts:10-12`, `src/ui/game/controller.ts:11, 69-80`, `src/ui/game/storage.ts:1-5`
- `tools/etl/fetch_natural_earth.sh:7` (nhánh `master`), `tools/build-map.ts:4-7`
- `android/variables.gradle:2-4`, `vite.config.ts:8`, `src/ui/styles/theme.css`
- Môi trường: không có Android SDK (`ANDROID_HOME` rỗng)

### Tham chiếu giấy phép (V3)
- Creative Commons BY-SA 4.0 deed: https://creativecommons.org/licenses/by-sa/4.0/deed.en
- Creative Commons BY-SA 4.0 legal code: https://creativecommons.org/licenses/by-sa/4.0/legalcode.en

### Official Android references
- App updates (O3; Claude đối chiếu 16/11/2026): https://developer.android.com/google/play/app-updates
- Version your app (Claude đối chiếu 16/11/2026): https://developer.android.com/studio/publish/versioning
- Nguồn GitHub về Environment/Secrets/reviewers [v3.2]: xem `SOURCE_REGISTER.v3.2.md` [1]–[4].
- Google Play app size limits: https://support.google.com/googleplay/android-developer/answer/9859372
- Play Asset Delivery: https://developer.android.com/guide/playcore/asset-delivery
- CSS `color-mix()` compatibility: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix

---

---

## Phụ lục A — O4: tạo khóa ký development và GitHub Environment `development-signing` (làm được trên điện thoại) [viết lại hoàn toàn ở v3.2 — CR §2.5]

**Không dán keystore, khóa riêng hay mật khẩu vào chat với Claude hoặc bất kỳ ai.** Claude không có quyền và không yêu cầu nhận các giá trị này. Claude chỉ cần **dấu vân tay SHA-256 của certificate** (thông tin công khai). Chủ dự án có thể gửi ảnh chụp màn hình **trang cấu hình** Environment (tên, protection rules, **tên** secrets) để reviewer kiểm — **không** chụp giá trị.

**Không tạo Repository Secrets cho khóa này.** Mọi giá trị ký nằm trong **Environment Secrets** của Environment `development-signing`. Environment/protection rules/secrets chưa cấu hình → C3 = `BLOCKED` (mục 4.1.5).

### A.1. Tên Environment Secrets/Variable (cuối cùng)

| Loại | Tên | Giá trị |
|---|---|---|
| Environment Secret | `COH_DEV_KEYSTORE_B64` | keystore PKCS12 mã hóa base64, **một dòng** |
| Environment Secret | `COH_DEV_KEYSTORE_PASSWORD` | mật khẩu keystore |
| Environment Secret | `COH_DEV_KEY_ALIAS` | `coh-dev` |
| Environment Secret | `COH_DEV_KEY_PASSWORD` | mật khẩu private key (với PKCS12 tạo bằng `keytool`, thường **trùng** mật khẩu keystore) |
| Environment Variable (không bí mật) | `COH_DEV_CERT_SHA256` | SHA-256 certificate: **64 ký tự hex chữ thường, không dấu hai chấm** |

### A.2. Bước 1 — tạo keystore trên điện thoại Android (Termux, miễn phí)

[CHƯA XÁC MINH trên iQOO] Tên gói Termux có thể thay đổi theo thời gian; nếu `openjdk-17` không có, dùng phiên bản OpenJDK mà `pkg search openjdk` liệt kê.

1. Cài **Termux** từ F-Droid hoặc trang phát hành chính thức của Termux (bản trên Google Play đã cũ).
2. Trong Termux:
   ```
   pkg update
   pkg install openjdk-17 openssl
   termux-setup-storage
   cd ~
   umask 077
   keytool -genkeypair -v -storetype PKCS12 -keystore coh-dev.p12 -alias coh-dev \
     -keyalg RSA -keysize 4096 -validity 10000 \
     -dname "CN=Currents of History DEVELOPMENT ONLY, O=Development"
   ```
   Nhập mật khẩu khi được hỏi (gõ trực tiếp vào Termux; không dán vào chat, ghi chú đồng bộ đám mây hay tin nhắn).
3. Lấy fingerprint dạng chuẩn (công khai, được phép gửi):
   ```
   keytool -list -v -keystore coh-dev.p12 -alias coh-dev \
     | grep 'SHA256:' | head -n1 | sed 's/.*SHA256: *//' | tr -d ':' | tr 'A-F' 'a-f'
   ```
   Kết quả phải đúng 64 ký tự `0-9a-f`. Đây là giá trị `COH_DEV_CERT_SHA256`.
4. Tạo bản base64 một dòng tạm thời để dán vào GitHub:
   ```
   base64 -w0 coh-dev.p12 > coh-dev.p12.b64
   cp coh-dev.p12.b64 ~/storage/downloads/
   ```
5. Sao lưu **mã hóa** keystore, giữ ở nơi chủ dự án kiểm soát (ngoài repository, không gửi qua chat):
   ```
   openssl enc -aes-256-cbc -pbkdf2 -salt -in coh-dev.p12 -out coh-dev.p12.enc
   cp coh-dev.p12.enc ~/storage/downloads/
   ```
   Thử giải mã lại một lần để chắc mật khẩu sao lưu đúng: `openssl enc -d -aes-256-cbc -pbkdf2 -in coh-dev.p12.enc -out /dev/null`.

### A.3. Bước 2 — tạo Environment `development-signing` (trình duyệt điện thoại)

GitHub → repository `mtieu6470-maker/Victori3-mobile` → **Settings → Environments → New environment** → tên chính xác `development-signing` → **Configure environment**:

1. **Required reviewers:** đánh dấu, thêm tài khoản chủ dự án (hoặc người bảo trì được ủy quyền).
2. **Prevent self-review:** **để tắt** khi chỉ có một reviewer đáng tin cậy (nếu bật, người khởi chạy workflow không tự duyệt được → job ký không bao giờ được duyệt). Chỉ bật khi đã có reviewer thứ hai đáng tin cậy.
3. **Allow administrators to bypass configured protection rules:** **bỏ chọn**.
4. **Deployment branches and tags:** chọn **Selected branches and tags** → **Add deployment branch or tag rule** → loại **Branch** → nhập chính xác `claude/game-historical-sandbox-modes-kg7rj7` → thêm. Không dùng wildcard `*`, không thêm quy tắc khác.
5. **Environment secrets → Add environment secret:** tạo 4 secret ở A.1; với `COH_DEV_KEYSTORE_B64`, mở `coh-dev.p12.b64` trong thư mục Tải xuống bằng trình soạn văn bản, chép toàn bộ một dòng rồi dán.
6. **Environment variables → Add environment variable:** `COH_DEV_CERT_SHA256` = giá trị 64 ký tự từ A.2 bước 3.
7. **Không** vào "Settings → Secrets and variables → Actions" để tạo Repository Secrets cho khóa này.

[ĐÃ XÁC MINH] Các mục Required reviewers, Prevent self-review, tùy chọn administrator bypass, Selected branches and tags, Environment secrets/variables có trong trang GitHub "Managing environments for deployment" (Source Register [1]). Vị trí/nhãn nút trên giao diện di động [CHƯA XÁC MINH] có thể khác chút; nếu không thấy, dùng chế độ "Trang web cho máy tính" của trình duyệt.

### A.4. Bước 3 — dọn dẹp

```
rm ~/storage/downloads/coh-dev.p12.b64 ~/coh-dev.p12.b64
```
Giữ `coh-dev.p12.enc` (bản sao lưu mã hóa) ở nơi chủ dự án kiểm soát. Quyết định giữ hay xóa `coh-dev.p12` bản rõ trong thư mục riêng của Termux là của chủ dự án; khuyến nghị xóa sau khi đã thử giải mã bản `.enc` thành công. Xóa cả mọi bản sao trong ứng dụng ghi chú/clipboard.

### A.5. Cách thay thế — GitHub Codespaces trên trình duyệt

Mở Codespace của repository → Terminal → chạy các lệnh `keytool`, `base64`, `openssl` như A.2 → tải `coh-dev.p12.enc` về → cấu hình Environment như A.3 → **xóa** mọi tệp keystore trong Codespace, rồi dừng/xóa Codespace. **Không commit** tệp nào. Lưu ý: Codespace chạy trên máy chủ GitHub; chủ dự án quyết định có chấp nhận việc keystore tồn tại tạm thời ở đó hay không.

### A.6. Chủ dự án báo lại cho reviewer/Claude (không có giá trị bí mật)

- Giá trị `COH_DEV_CERT_SHA256` (64 hex).
- Xác nhận đã tạo Environment `development-signing` với: 1 quy tắc nhánh chính xác, Required reviewers, admin bypass tắt, Prevent self-review theo số reviewer thực tế.
- Xác nhận tên 4 Environment Secrets và 1 Environment Variable (không giá trị); tùy chọn kèm ảnh chụp trang cấu hình không lộ giá trị.

### A.7. Ràng buộc khi Claude thực hiện C3 (chỉ sau khi được duyệt, ở S0-B bước B2)

- Theo 4.1.3–4.1.4: workflow ký riêng chỉ `workflow_dispatch`; điều kiện `if` cấp job theo event + ref; chỉ job ký khai báo `environment: development-signing`; job ký không chạy mã repository; `permissions` tối thiểu; action pin full SHA; không `pull_request_target`.
- Không `echo`/`cat`/dump secrets; keystore giải mã vào tệp tạm `umask 077`, xóa sau khi ký kể cả khi lỗi; không artifact/cache chứa keystore.
- So SHA-256 certificate thực tế (`apksigner verify --print-certs`) với `COH_DEV_CERT_SHA256`; lệch → fail.
- Reviewer kiểm SHA commit của lần chạy trước khi duyệt (R13).
- Khóa này **chỉ** cho development/test; khóa phát hành công khai là quyết định riêng ở S23c.
