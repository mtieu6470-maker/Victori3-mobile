# ĐỀ XUẤT ĐIỀU CHỈNH S0 v3.3 — THÁO NÚT THẮT ĐỂ MỞ S1 CÓ KIỂM SOÁT

**Dự án:** Currents of History / `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày:** 16/11/2026  
**Trạng thái:** **DỰ THẢO ĐIỀU CHỈNH — CHỜ CHỦ DỰ ÁN CHẤP NHẬN**  
**Tài liệu gốc:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`  
**Handoff:** `docs/coordination/AI_HANDOFF.md`  
**Baseline code:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`  
**HEAD đã kiểm tra khi lập đề xuất:** `382aaa84b2336854b4dbebfcdc719847ff463f41`

> Đây là phụ lục điều chỉnh quy trình, không ghi đè v3.2 và chưa trở thành roadmap chuẩn cho đến khi chủ dự án chấp nhận và được ghi nhận trong repository. Đề xuất này không sửa gameplay, engine, dữ liệu, save schema, APK hay signing.

---

## 1. Quyết định thiết kế của v3.3

S0 v3.2 đang buộc các công việc kiểm toán độc lập phải chờ B2/C3 — signing development — dù các việc đó không cần APK ký development. Điều này tạo một nút thắt không cần thiết: thiếu thao tác sao lưu/khôi phục trên điện thoại hoặc chưa cấu hình GitHub Environment làm dừng cả audit scripts và characterization tests.

**v3.3 tách S0 thành hai làn độc lập:**

1. **Làn kiểm toán nền tảng — phải hoàn thành trước S1:** B1 đã xong; tiếp tục B3, B4 và B7. Đây là các công việc có thể chạy trong CI/worktree và không cần đổi chữ ký APK, cài APK mới hoặc dùng keystore.
2. **Làn thiết bị/signing — hoãn có điều kiện:** B2/C3, B5 và B6 chỉ chạy sau khi điều kiện sao lưu/khôi phục R14 được giải quyết và Environment `development-signing` được cấu hình an toàn. Làn này không được làm chặn B3/B4.

S1 chỉ được mở theo **cơ chế chấp nhận có ngoại lệ được ghi rõ**. Các gate chưa đủ bằng chứng vẫn giữ nguyên `PARTIAL`, `BLOCKED` hoặc `NOT_TESTED`; không đổi nhãn thành `PASS` để hợp thức hóa việc chuyển giai đoạn.

## 2. Trạng thái repository và bằng chứng đầu vào

### 2.1. Trạng thái đã kiểm tra

- Branch duy nhất được tìm thấy: `claude/game-historical-sandbox-modes-kg7rj7`.
- HEAD mới nhất được tìm thấy: `382aaa84b2336854b4dbebfcdc719847ff463f41`.
- Parent của commit B1: `d6edfc1c008000b6048459b835dd0cf47f825f03`.
- Commit B1 chỉ sửa `.github/workflows/android-apk.yml` (workflow-only), không sửa mã gameplay, engine, data, UI hoặc save.
- GitHub Actions run B1: `43834719406`; job kết thúc `success`.
- Bằng chứng B1 được báo cáo và đã được rà soát độc lập: 58/58 tests, 5 test files; Gradle build thành công; APK và evidence artifacts được xuất riêng; APK SHA-256 được tách khỏi ZIP artifact digest; local negative probe giữ exit code lỗi khi test cố ý fail.

**Kết luận kỹ thuật của reviewer:** B1 `PASS` như một lát công việc độc lập. Điều này **không** có nghĩa toàn bộ S0 hoặc mọi gate G0.1–G0.9 đã PASS.

### 2.2. Snapshot gate hiện tại theo S0-A

B1 không tự động làm thay đổi các gate S0-A. Trạng thái gần nhất được ghi trong `S0_A_RESULTS.md` vẫn là:

| Gate | Trạng thái gần nhất | Ý nghĩa trong v3.3 |
|---|---|---|
| G0.1 Snapshot | `PASS` | Giữ nguyên; kiểm tra lại HEAD/handoff trước task tiếp theo |
| G0.2 Build/CI | `PASS` | Bằng chứng S0-A + CI B1 bổ sung; vẫn phải lưu riêng APK SHA và ZIP digest |
| G0.3 Test catalog | `PARTIAL` | B3 phải hoàn tất catalog |
| G0.4 Feature audit | `NOT_TESTED` | B3 phải thực hiện |
| G0.5 Global data | `NOT_TESTED` | B3 phải thực hiện |
| G0.6 Save/determinism | `NOT_TESTED` | B4 phải thực hiện; hard blocker cho S1 |
| G0.7 Runtime/perf | `BLOCKED` | A5/device chưa có số đo iQOO; Node/desktop chạy sau khi có harness B3 |
| G0.8 Asset/license | `NOT_TESTED` | B3 tạo inventory; license chưa rõ giữ nguyên trạng thái |
| G0.9 Risk/signoff | `NOT_TESTED` | B7 phải lập và xin chấp nhận R7/ngoại lệ |

Đây là trạng thái xuất phát, không phải kết quả nghiệm thu mới cho S0. Mọi trạng thái chỉ được thay đổi sau khi có report và bằng chứng tương ứng.

### 2.3. Các giới hạn B1 còn phải ghi nhận

- Chưa có lần chạy CI cố ý làm test fail để xác nhận hành vi fail trên chính GitHub Actions; mới có local negative probe.
- `actionlint` chưa được chạy.
- Chưa có bằng chứng đo trên iQOO Z10 Turbo.
- `AI_HANDOFF.md` hiện chưa phản ánh commit B1 mới; handoff còn ghi S0-A là giai đoạn duy nhất được phép và S0-B chưa được ủy quyền.

Claude phải cập nhật handoff bằng chứng B1 khi bắt đầu gói công việc tiếp theo. Không được sửa lịch sử S0-A hoặc ghi B1 như một phần của baseline `BASELINE_ORIGINAL`.

Nguồn kiểm tra:
- [B1 commit](https://github.com/mtieu6470-maker/Victori3-mobile/commit/382aaa84b2336854b4dbebfcdc719847ff463f41)
- [B1 Actions run](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43834719406)
- [Roadmap v3.2](https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md)
- [AI handoff hiện tại](https://github.com/mtieu6470-maker/Victori3-mobile/blob/claude/game-historical-sandbox-modes-kg7rj7/docs/coordination/AI_HANDOFF.md)

## 3. Trình tự S0-B điều chỉnh

| Bước | Trạng thái v3.3 | Phạm vi | Điều kiện phụ thuộc |
|---|---|---|---|
| B1 — CI checksums/test report | **DONE / reviewer technical verdict: PASS** | Workflow-only, commit `382aaa8` | Không cần B2 |
| B3 — Audit scripts/catalog/coverage | **NEXT — REQUIRED** | Benchmark harness; test catalog; requirement/feature audit; global coverage; region × admin-1 raster crosswalk; asset checksum/inventory; không sửa dữ liệu sản phẩm | Chỉ cần baseline S0-A và B1 đã ghi nhận |
| B4 — Characterization tests/fixtures | **REQUIRED** | Save/load determinism cho Historical và Sandbox; malformed/incompatible/missing-field cases; fixture/hash/first divergence | Dùng baseline code `2240a8f`; không cần B2, signing hay Diagnostic UI |
| B7 — Risk register/signoff package | **REQUIRED BEFORE S1** | Ghi P0/P1/P2, evidence, impact, mitigation, owner, phase; lập ma trận gate và đề nghị ngoại lệ | Sau B3/B4; R7 phải có biện pháp kiểm soát được chủ dự án chấp thuận |
| B2 — C3 development signing | **DEFERRED / BLOCKED UNTIL R14 + ENVIRONMENT** | Signing workflow riêng qua Environment `development-signing`; không Repository Secrets | Phải giữ APK baseline và chứng minh export/import save; cấu hình Environment/protection/secrets đúng v3.2 |
| B5 — Diagnostic UI | **DEFERRED WITH B2** | Debug-only UI, không vào release build, không ghi save, không network | Chỉ sau B2 theo quy tắc signing hiện hành |
| B6 — AUDIT_INSTRUMENTED measurements | **DEFERRED** | Đo Node/desktop/device với diagnostic UI, overhead bật/tắt | Sau B5; device evidence chỉ được ghi khi đo thật trên iQOO |

### 3.1. B3 — đầu ra bắt buộc

B3 cần tạo tối thiểu các deliverables sau, trong thư mục audit S0:

- `S0_TEST_CATALOG.md` và `s0_test_catalog.json`: từng test, file:dòng, hành vi được kiểm, điều kiện qua/rỗng, độ ổn định và giới hạn.
- `S0_REQUIREMENT_MATRIX.csv`: yêu cầu → file:dòng → runtime path → test/evidence.
- `S0_GLOBAL_DATA_AUDIT.md`: coverage theo 12 khu vực, loại thực thể, nguồn/default/ước tính/missing; không tính dữ liệu mặc định là dữ liệu có nguồn.
- Crosswalk raster giữa admin-1 và 662 Strategic Regions; không ép hai hệ thống thành quan hệ cha-con giả.
- `S0_ASSET_AUDIT.md` và manifest checksum: inventory, source, author, license, temporal validity, kích thước, trạng thái xác minh.
- Harness Node/desktop để A5 có thể chạy trên baseline gốc. Mọi số liệu ghi đúng nhãn `BASELINE_ORIGINAL` nếu harness chạy ngoài mã sản phẩm và trỏ vào đúng `2240a8f`.
- Ghi lại chính xác các test có nguy cơ pass rỗng, gồm test dân số có tên 1870 nhưng truy vấn mốc 1875.

Không sửa generator, test logic, dữ liệu sản phẩm hoặc engine trong B3. Nếu phát hiện lỗi, ghi finding và đề xuất stage xử lý.

### 3.2. B4 — tiêu chí không được nới lỏng

B4 phải giữ nguyên kiểm thử cốt lõi của v3.2 §6.7:

1. Cùng engine build, data build/hash, mode, seed và chuỗi lệnh test cấp.
2. Nhánh A chạy liên tục N tháng.
3. Nhánh B chạy K tháng, serialize đúng định dạng save hiện tại, deserialize, chạy tiếp N−K tháng.
4. So sánh chuẩn hóa toàn bộ `GameState`, gồm seed, RNG state và mọi trường ảnh hưởng tương lai mô phỏng.
5. Chạy riêng Historical và Sandbox.
6. Kiểm tra save lỗi, sai version, thiếu field, field không tương thích; xác định hành vi thực tế, không tự sửa trong S0.
7. Nếu khác biệt, báo state path đầu tiên khác và hash hai nhánh. Test không được pass rỗng.

**G0.6 bắt buộc PASS trước S1.** Không cho miễn trừ G0.6 vì S1 trực tiếp thay đổi data contracts/save compatibility.

## 4. Cơ chế mở S1: chấp nhận có ngoại lệ, không giả PASS

v3.2 giữ nguyên quy tắc S0 chỉ `PASS` khi tất cả G0.1–G0.9 đều `PASS`. v3.3 **không xóa quy tắc này**. Thay vào đó, phân biệt:

- **S0 gate verdict:** kết quả sự thật của từng gate và kết luận tổng thể S0. Có thể vẫn là `PARTIAL` vì thiếu đo thiết bị hoặc giấy phép chưa xác minh.
- **Task lifecycle:** reviewer có thể xác nhận bộ hồ sơ đạt `REVIEW_PASS` cho một chuyển tiếp có giới hạn; chủ dự án có thể ghi `ACCEPTED` kèm danh sách ngoại lệ, phạm vi và điều kiện đóng. Đây không phải tuyên bố S0 đã hoàn tất toàn bộ.

### 4.1. Điều kiện bắt buộc trước chuyển tiếp S1

Tất cả điều kiện dưới đây phải được chứng minh:

| Điều kiện | Yêu cầu |
|---|---|
| G0.1 | `PASS` — snapshot/baseline không thay đổi ngoài các commit audit đã kê khai |
| G0.2 | `PASS` — clean build/CI, hashes và payload comparison đúng phạm vi; không nhầm APK hash với ZIP digest |
| G0.3 | `PASS` — catalog đầy đủ; flaky/test pass rỗng đã được phân loại |
| G0.4 | `PASS` — yêu cầu hiện hữu có evidence và runtime path; không kết luận theo tên component/file đơn thuần |
| G0.5 | `PASS` — global data audit đủ 12 khu vực; phân biệt sourced/estimated/default/missing |
| G0.6 | **`PASS — HARD BLOCKER`** — save/load continuation deterministic trong cả Historical và Sandbox; malformed saves được mô tả |
| G0.7 | Node + desktop baseline phải có số đo tái lập và report riêng. Phần iQOO có thể để `BLOCKED`/`PARTIAL` và xin ngoại lệ **chỉ cho S1**, vì S1 bị giới hạn ở data/save contracts, không làm runtime/performance/lifecycle/rendering |
| G0.8 | Inventory/checksum phải có. Các license chưa xác minh được giữ nguyên `BLOCKED`/`PARTIAL`; xin ngoại lệ **chỉ cho S1** với điều kiện không thêm, thay, phân phối hoặc sửa asset/văn bản có license chưa rõ. Mọi nội dung mới trong S1 phải có provenance; không được coi unknown là licensed |
| G0.9 | `PASS` cho gói signoff: mọi P0 có biện pháp kiểm soát được chủ dự án chấp thuận; từng P1 có evidence, impact, mitigation, stage và owner. Các ngoại lệ G0.7/G0.8 phải được liệt kê cụ thể |

### 4.2. Các điều kiện tuyệt đối không được miễn trừ

- G0.1/G0.2: không miễn trừ snapshot, build/CI, checksum hoặc integrity evidence.
- G0.3/G0.4/G0.5: không mở S1 khi chưa hiểu hệ thống/test/data hiện có ở mức đủ để thiết kế contracts.
- G0.6: không miễn trừ determinism/save compatibility baseline.
- Không có P0 chưa được ghi nhận; không có P0 bị đổi nhãn thành P1 để qua gate.
- Không được cài APK mới lên điện thoại hoặc gỡ APK baseline khi R14 chưa được giải quyết.

### 4.3. Ngoại lệ được phép cho S1

Chỉ có hai ngoại lệ dự kiến:

1. **G0.7 — thiếu số đo iQOO:** chấp nhận hoãn phần đo thiết bị đến trước S2. Phải có Node và desktop measurements; ghi rõ thiết bị chưa đo; cấm S1 thay đổi tick loop, Worker, renderer, WebView lifecycle, memory/performance strategy hoặc UI runtime nặng.
2. **G0.8 — license chưa xác minh của tài sản cũ:** cho phép S1 thiết kế trường provenance/license và save/data contracts mà không thay đổi asset hoặc nội dung. Bất kỳ asset/văn bản mới hoặc chỉnh sửa nào cần license rõ ràng trước khi đưa vào.

Ngoại lệ phải nằm trong `S0_SIGNOFF.md`, có owner, lý do, phạm vi, hạn xử lý và giai đoạn đóng. Không sửa lịch sử test thành `PASS`. Nếu reviewer không chấp nhận căn cứ hoặc phát hiện P0 chưa kiểm soát, không cấp `REVIEW_PASS` cho chuyển tiếp S1.

## 5. R7 và R14 — quy tắc an toàn thiết bị

### 5.1. R7 — không autosave/khôi phục renderer (P0)

Trước S1, B7 phải ghi biện pháp kiểm soát tạm thời cho đến khi S2 xử lý đầy đủ. Tối thiểu:

- Chủ dự án được cảnh báo rõ game hiện chưa có bằng chứng autosave/process-death/WebGL recovery đáng tin cậy.
- Không khuyến nghị chơi phiên dài hoặc coi dữ liệu phiên hiện tại là an toàn khi app bị hệ điều hành thu hồi.
- Chỉ dựa vào thao tác Save hiện hữu sau khi xác minh hành vi thực tế. Không gọi nút Export là backup hoạt động cho đến khi R14 được test trên Android.
- Giữ nguyên APK baseline đang cài; không gỡ/cài đè APK test khác chữ ký.
- Ghi rõ rủi ro còn lại, người chấp nhận và điều kiện đóng ở S2.

Đây là biện pháp hạn chế mức phơi nhiễm, **không** phải bằng chứng rằng game đã có autosave hoặc renderer recovery. Chủ dự án phải chấp nhận bằng văn bản trong signoff; nếu không, G0.9 không PASS và S1 không mở.

### 5.2. R14 — export/import save trên APK baseline

- Vẫn phải thực hiện v3.2 §6.5.1 bước 3–4 trước B2/C3 và trước mọi thao tác cài APK có chữ ký khác.
- Nếu Export không tạo file hoặc Import không phục hồi đúng ván/ngày: R14 `BLOCKED`; không gỡ APK baseline.
- O5 vẫn thuộc chủ dự án: (a) chấp nhận mất save thử nghiệm; (b) chọn một phương pháp backup WebView được xác minh riêng; hoặc (c) phê duyệt task sửa chức năng export ngoài S0.
- **R14 không chặn B3/B4 hoặc S1 chỉ chạy CI/desktop. R14 chặn B2/C3, B5 trên thiết bị và mọi cài đặt APK mới lên máy.**

Không gửi keystore, secret, mật khẩu hoặc private key trong chat/issue/repository.

## 6. Giới hạn phạm vi S1 khi mở theo v3.3

S1 vẫn là `Data contracts, schema và save compatibility` theo v3.2. Được phép:

- Tách static historical definitions khỏi mutable `GameState`.
- Versioning riêng cho save schema, engine và data build.
- Stable IDs, DB/data hashes, provenance, quality, uncertainty.
- Migration tuần tự, fixture v1, rollback/backup strategy, unknown-field/version policy.
- Save chứa `engineVersion`, `saveSchemaVersion`, `dataBuildHash`, seed theo quyết định đã chốt.
- Thiết kế và triển khai migration/compatibility tests, serialization contract và tài liệu API/schema.

**Không được làm trong S1 theo ngoại lệ v3.3:**

- Không thêm gameplay, thay công thức mô phỏng, AI/economy/population/politics/diplomacy/military.
- Không đổi geography IDs hoặc bổ sung dữ liệu lịch sử thực vào runtime nếu ngoài schema contract đã duyệt.
- Không thêm/sửa/xóa asset hoặc văn bản chưa xác minh giấy phép.
- Không làm performance optimization, Worker, tick loop, renderer/WebGL, lifecycle, autosave hoặc Diagnostic UI; các việc đó thuộc S2/S0 device lane.
- Không thay signing, keystore, GitHub Environment/Secrets.
- Không cài APK S1 lên iQOO, không yêu cầu người dùng gỡ APK baseline. Build và test chỉ trong CI/desktop cho đến khi R14 được giải quyết.

Mọi mở rộng ngoài phạm vi này phải dừng và xin phê duyệt riêng.

## 7. S1 entry checklist — reviewer phải kiểm trước khi chấp nhận

- [ ] B1 được ghi nhận trong handoff, bao gồm commit/run/artifact, test count, APK SHA và ZIP digest tách riêng, giới hạn còn lại.
- [ ] B3 deliverables tồn tại, tái lập; G0.3/G0.4/G0.5 `PASS`.
- [ ] B4 Historical + Sandbox deterministic continuation qua; G0.6 `PASS`.
- [ ] G0.7 có Node/desktop report; thiếu iQOO được giữ nguyên `BLOCKED`/`PARTIAL` và nêu rõ ngoại lệ chỉ cho S1.
- [ ] G0.8 có inventory; license chưa rõ được giữ nguyên trạng thái và không có asset/content change trong S1.
- [ ] B7 risk register đầy đủ; R7 có biện pháp tạm thời được owner chấp nhận; không còn P0 không kiểm soát.
- [ ] R14 vẫn chưa được dùng làm điều kiện cho build CI, nhưng được đánh dấu chặn cài APK mới trên điện thoại.
- [ ] ChatGPT review xác nhận `REVIEW_PASS` cho bộ hồ sơ chuyển tiếp có ngoại lệ.
- [ ] Chủ dự án ghi `ACCEPTED` cho ngoại lệ và phạm vi S1; S1 được ủy quyền bằng văn bản.

Nếu một mục cứng không đạt, dừng ở S0. Không thay đổi trạng thái gate bằng cách sửa tài liệu.

## 8. Thứ tự thực thi sau khi chủ dự án chấp nhận v3.3

1. Claude đồng bộ HEAD mới nhất và cập nhật `AI_HANDOFF.md` ghi B1 đã hoàn thành; không sửa report S0-A cũ.
2. Thực hiện B3 trong worktree sạch, giữ nguyên baseline `2240a8f`; commit chỉ chứa công cụ/tài liệu audit được phép.
3. Reviewer kiểm tra B3 và yêu cầu sửa nếu cần.
4. Thực hiện B4 fixtures/characterization tests trên baseline; không thay logic sản phẩm.
5. Thực hiện B7 risk register, G0.1–G0.9 và dự thảo `S0_SIGNOFF.md`, nêu rõ ngoại lệ G0.7/G0.8.
6. Reviewer kiểm tra toàn bộ artifact và phát hành kết luận `REVIEW_PASS` hoặc `CHANGES_REQUESTED`.
7. Chủ dự án chấp nhận/không chấp nhận ngoại lệ và quyết định mở S1. Không tự động mở S1.
8. B2/B5/B6 tiếp tục ở làn riêng khi R14 và Environment đã đủ điều kiện; không dùng Repository Secrets.

## 9. Quyết định của chủ dự án cần được ghi nhận

Đề xuất gói quyết định một lần, tránh phải xin phép lại cho từng bước nhỏ:

- [ ] **Duyệt cấu trúc S0 v3.3**: tách B3/B4/B7 khỏi phụ thuộc B2; giữ B2/B5/B6 ở làn thiết bị/signing.
- [ ] **Ủy quyền gói S0-B3 + B4 + B7** đúng phạm vi tài liệu này; cho phép Claude tạo/commit/push các deliverables audit và cập nhật handoff, không sửa sản phẩm.
- [ ] **Chấp nhận về nguyên tắc ngoại lệ S1**: có thể mở S1 dù G0.7 phần iQOO còn `BLOCKED` và/hoặc G0.8 license của tài sản cũ còn `PARTIAL`, nhưng chỉ khi checklist §7 đạt và reviewer xác nhận.
- [ ] **Không miễn trừ** G0.6, build/integrity, test catalog, feature audit, global data audit hoặc P0 không kiểm soát.
- [ ] S1 vẫn cần signoff/review và phạm vi data/save contracts như §6; không tự mở gameplay.

**Lưu ý:** việc chấp nhận đề xuất v3.3 không đồng nghĩa xác nhận R14 thành công, không đồng nghĩa cho phép gỡ APK baseline, không đồng nghĩa cung cấp signing secrets, và không đồng nghĩa toàn bộ S0 được gọi là `PASS`.

---

## 10. Chỉ dẫn triển khai dành cho Claude sau khi có chấp nhận

Hãy đọc tài liệu này cùng `AI_COLLABORATION_PROTOCOL.md`, roadmap v3.2 và handoff. Kiểm tra lại HEAD trước khi thao tác. Chỉ thực hiện gói S0-B3 + B4 + B7 theo phạm vi đã được owner đánh dấu chấp nhận. Ghi task ID, base/head SHA, file changed, command + exit code, test count, artifact, device limitation và risk trong handoff. Không tự đánh dấu gate PASS khi thiếu bằng chứng. Không thực hiện B2/C3, B5, B6, S1, sửa gameplay, sửa save schema, sửa data sản phẩm, signing, keystore hoặc secrets trong cùng task. Khi kết thúc, dừng để reviewer độc lập kiểm tra; không tự tuyên bố S0 hoàn tất hoặc tự mở S1.
