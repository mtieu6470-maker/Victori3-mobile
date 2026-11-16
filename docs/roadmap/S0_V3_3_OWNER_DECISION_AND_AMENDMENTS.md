# DỰ THẢO QUYẾT ĐỊNH CHỦ DỰ ÁN — CHẤP NHẬN S0 v3.3 CÓ BỔ SUNG

**Dự án:** Currents of History / `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Ngày soạn dự thảo:** 16/11/2026  
**Decision ID đề xuất ghi vào handoff:** `OD-20261116-11`  
**HEAD tại thời điểm quyết định:** `382aaa84b2336854b4dbebfcdc719847ff463f41`  
**Tài liệu đề xuất chấp nhận:** `S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` — sau khi hợp nhất các sửa đổi bắt buộc trong văn bản này.  
**Hiệu lực:** Chưa phải owner decision đã ghi vào repository. Văn bản này là quyết định được đề xuất để chủ dự án gửi nguyên văn cho Claude; chỉ có hiệu lực sau khi chủ dự án gửi/xác nhận và ghi nhận trong `AI_HANDOFF.md`.

## 1. Quyết định đề xuất

Tôi đề nghị chủ dự án gửi nguyên văn quyết định dưới đây để chấp nhận cấu trúc S0 v3.3 với các bổ sung và ràng buộc này. Khi được chủ dự án gửi/xác nhận, đây sẽ là chấp nhận bằng văn bản cho phạm vi công việc được nêu; không phải tuyên bố S0 đã PASS và không tự động mở S1. Trước thời điểm đó, Claude chưa được coi văn bản này là owner authorization.

- [x] **Duyệt cấu trúc S0 v3.3:** tách B3/B4/B7 khỏi phụ thuộc B2; giữ B2/B5/B6 ở làn thiết bị/signing.
- [x] **Ủy quyền gói S0-B3 + B4 + B7** đúng phạm vi v3.3 và các sửa đổi tại tài liệu này. Cho phép cập nhật tài liệu/handoff, tạo script, catalog, crosswalk, inventory, fixtures, characterization tests và các commit audit cần thiết. Không cho phép sửa gameplay/engine/data sản phẩm/save schema, signing, keystore, Secrets hoặc cài APK mới lên iQOO.
- [x] **Chấp nhận về nguyên tắc ngoại lệ S1** chỉ cho phần đo iQOO của G0.7 và phần license cũ chưa xác minh của G0.8, theo đúng điều kiện §4 bên dưới. Đây chưa phải chấp nhận ngoại lệ thực tế; ngoại lệ cụ thể phải được ghi trong `S0_SIGNOFF.md` và được reviewer xác minh trước S1.
- [x] **Không miễn trừ G0.6**, G0.1, G0.2, G0.3, G0.4, G0.5 hoặc P0 không kiểm soát.
- [x] **Đưa v3.3 đã hoàn thiện vào repository** dưới `docs/roadmap/`, giữ nội dung đã chấp nhận nguyên văn; ghi SHA-256 trong `SOURCE_REGISTER.v3.3.md` và handoff. Không ghi đè v3.2; v3.3 là phụ lục sửa đổi có hiệu lực ưu tiên trong phạm vi xung đột được nêu tại §2.
- [x] **Ghi nhận biện pháp kiểm soát R7 tạm thời** tại §5: cho phép xem xét chuyển tiếp S1 chỉ khi việc sử dụng trong giai đoạn này được giới hạn ở phiên thử nghiệm có thể mất dữ liệu; không coi Save/Export là an toàn nếu chưa kiểm chứng; không gỡ/cài APK baseline. Đây là chấp nhận biện pháp hạn chế rủi ro, không phải xác nhận lỗi R7 đã được sửa.

## 2. Thứ tự ưu tiên và điều khoản v3.2 bị thay thế

### 2.1. Thay thế đúng một phần v3.2 §6.3 B2

Câu trong v3.2 §6.3 B2:

> Environment `development-signing`/protection rules/Environment Secrets chưa có → C3 `BLOCKED`, S0 dừng tại cổng này.

**Được thay thế trong phạm vi hẹp** bằng quy tắc:

> Nếu C3/B2 `BLOCKED`, riêng B2 vẫn `BLOCKED` và không được thực hiện B5/B6; tuy nhiên trạng thái đó không còn chặn B3, B4 hoặc B7. B3/B4/B7 được tiếp tục tuần tự theo v3.3 vì không cần cài APK ký development, keystore hoặc Diagnostic UI. S0 tổng thể vẫn không được tuyên bố `PASS` khi thiếu bất kỳ gate bắt buộc nào. Chuyển tiếp S1 chỉ có thể được xem xét qua bộ hồ sơ `REVIEW_PASS` có ngoại lệ giới hạn, theo v3.3 và quyết định này.

Không có câu nào khác về điều kiện an toàn C3 bị nới lỏng. R14 vẫn chặn B2/C3 và mọi thao tác cài APK mới lên iQOO. Không dùng Repository Secrets thay Environment Secrets.

### 2.1.1. Làm rõ v3.2 §6.4 G0.9 về C3 BLOCKED

Trong v3.2 §6.4, G0.9 có trạng thái `BLOCKED` khi C3 bị `BLOCKED`. Quy tắc đó vẫn áp dụng cho **kết luận S0 đầy đủ**. Tuy nhiên, đối với **bộ hồ sơ chuyển tiếp S1 có giới hạn**, C3/B2 được xem là một workstream P1 đã cô lập và hoãn lại, không phải phụ thuộc kỹ thuật của S1: S1 không ký APK, không cài APK mới, không cần Diagnostic UI và không thay đổi runtime/lifecycle. Vì vậy reviewer có thể đánh giá riêng risk disposition của bộ hồ sơ S1 mà không đổi G0.9 trong sổ gate S0 thành PASS. G0.9 của S0 vẫn giữ `BLOCKED` nếu điều kiện v3.2 yêu cầu; bộ hồ sơ chuyển tiếp chỉ có thể nhận `REVIEW_PASS` khi R7/P0 đã có biện pháp được owner chấp thuận, R14/C3 được ghi P1 với owner/mitigation/stage/exit criteria rõ ràng, và không có P0 không kiểm soát. Đây là **cô lập dependency cho S1**, không phải miễn trừ hay đổi nhãn G0.9.

### 2.2. Giải thích `REVIEW_PASS` trong AI_COLLABORATION_PROTOCOL.md

Bổ sung câu sau vào phần quy tắc chuyển giai đoạn:

> **For S0 under the approved v3.3 transition procedure, `REVIEW_PASS` may apply only to the bounded S1-entry evidence package with its explicitly listed exceptions; it does not certify that every S0 gate passed or that S0 is fully complete. The owner's `ACCEPTED` decision accepts only that limited transition and its stated S1 scope. The overall S0 gate verdict remains `PARTIAL`/`BLOCKED` until G0.1–G0.9 are all `PASS`.**

Giữ nguyên nguyên tắc chung: không có `REVIEW_PASS` và `ACCEPTED` thì không bắt đầu giai đoạn tiếp theo. Ở trường hợp này, đối tượng được reviewer xem xét là **bộ hồ sơ chuyển tiếp S1**, không phải tuyên bố toàn bộ S0 đã hoàn tất.

## 3. G0.6 — lối ra bắt buộc nếu B4 phát hiện FAIL

G0.6 là hard blocker. Không được miễn trừ, đổi nhãn, bỏ test hoặc mở S1 khi kết quả là `FAIL`.

Nếu B4 phát hiện Historical hoặc Sandbox không tất định sau save/load:

1. Ghi G0.6 = `FAIL` trên baseline đang kiểm; giữ nguyên fixtures, seed, command sequence, state hash và state path đầu tiên khác nhau. Không viết lại lịch sử baseline thành PASS.
2. Dừng luồng xét mở S1 ngay khi có FAIL có thể tái lập. Có thể hoàn tất các case characterization read-only còn lại của B4 để thu thập đủ bằng chứng; tuyệt đối không tự sửa `save.ts`, RNG, engine hoặc schema trong S0.
3. Lập báo cáo phân loại nguyên nhân: serializer/deserializer; RNG state capture/restore; trường `GameState` bị bỏ sót; thứ tự/side effect khi load; hoặc nguyên nhân khác. Phải chứng minh bằng test tối thiểu, không suy đoán.
4. Tạo đề xuất task riêng **`PRE-S1-SAVE-DETERMINISM-REMEDIATION`**, ngoài phạm vi S0, giới hạn ban đầu ở save serialization/deserialization và RNG state persistence/restore. Nêu file dự kiến, API/state bị ảnh hưởng, migration compatibility, regression tests và rủi ro.
5. Không triển khai task sửa cho đến khi có owner authorization riêng. Nếu root cause đòi hỏi thay đổi mô phỏng/engine rộng hơn save/RNG, dừng và xin duyệt phạm vi mới; không tự mở rộng task.
6. Sau khi task sửa riêng được duyệt và hoàn tất, chạy lại cùng bộ characterization tests trên SHA đã sửa. Báo cáo phải giữ cả hai kết quả: **baseline SHA = FAIL** và **candidate SHA sau remediation = PASS** (chỉ khi mọi phép thử thực sự đạt). Không xóa hoặc ghi đè bằng chứng FAIL gốc.
7. S1 chỉ được xét khi kết quả G0.6 trên **candidate SHA dùng làm đầu vào S1** là PASS, task sửa riêng đã được reviewer kiểm tra và owner ACCEPTED. Nếu không đạt, S1 tiếp tục BLOCKED.

Kết luận: G0.6 không được miễn trừ. Lối ra là một task sửa riêng có ủy quyền và xác minh lại, không phải một ngoại lệ stage-gate.

## 4. G0.4 — nguồn yêu cầu chuẩn đã được chốt

**Nguồn chuẩn cho G0.4 là `MASTER_SPEC_VI.md` — “CURRENTS OF HISTORY — MASTER GAME DESIGN & TECHNICAL REQUIREMENTS / Đặc tả tái cấu trúc toàn diện cho game Grand Strategy Android (1836–1936)”.**

Tôi đã xác định được bản gốc trong Library của dự án. Bằng chứng nhận dạng:

- Tên: `MASTER_SPEC_VI.md`
- Phiên bản Library: `1`
- Kích thước: `50,355` bytes
- Số dòng: `753`
- SHA-256: `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8`

Để có thể tái lập audit độc lập trong repository, Claude được ủy quyền đưa **bản sao byte-for-byte, không chỉnh sửa** vào `docs/spec/MASTER_SPEC_VI.md`, rồi xác minh SHA-256 trong CI/local. Nếu hash không khớp, dừng và báo; không tự sửa nội dung nguồn. `SOURCE_REGISTER.v3.3.md` phải ghi nguồn bản gốc, hash, kích thước và đường dẫn bản sao trong repo.

### 4.1. Cách dùng ba nguồn đã nêu

1. **`MASTER_SPEC_VI.md` — nguồn yêu cầu sản phẩm chuẩn.** G0.4 phải lập ma trận từ toàn bộ yêu cầu có tính quy phạm trong §§0–17. §§18–19 là tài liệu tham khảo và concept illustrations, không phải tiêu chí tính năng; không lấy số liệu/chữ trong concept art làm dữ kiện.
2. **Roadmap v3.2 — nguồn chuẩn về thứ tự giai đoạn, dependency, kiến trúc và tiêu chí stage-gate.** v3.3 điều chỉnh hẹp các điểm đã nêu ở §2 và §3; không thay thế toàn bộ yêu cầu sản phẩm của MASTER_SPEC.
3. **`docs/audit/MASTER_SPEC_AUDIT.md` — tài liệu audit/evidence hiện có**, được dùng làm đầu vào để đối chiếu lại mã nguồn. Đây không phải bản đặc tả gốc và không được dùng thay danh sách yêu cầu.

Thứ tự xử lý xung đột: (a) quyết định chủ dự án được ghi rõ sau đó; (b) các quyết định đã chốt trong roadmap v3.2, trừ đúng phần được v3.3 thay thế; (c) MASTER_SPEC_VI cho yêu cầu sản phẩm; (d) roadmap cho trình tự và cách nghiệm thu; (e) audit report chỉ là bằng chứng hiện trạng. Mọi xung đột còn lại phải được ghi thành finding và dừng ở điểm ảnh hưởng, không tự hòa giải.

### 4.2. Tiêu chí G0.4 PASS

`S0_REQUIREMENT_MATRIX.csv` phải bao phủ tất cả yêu cầu nguyên tử có thể kiểm tra trong §§0–17 của MASTER_SPEC_VI; giữ ID/section gốc; mỗi dòng phải có:

- Requirement ID và section/subsection nguồn;
- nội dung yêu cầu hoặc diễn giải không làm đổi nghĩa;
- trạng thái hiện tại: `Implemented`, `Partial`, `Placeholder`, `Missing`, `Broken` hoặc `Unverified`;
- file/line và đường đi runtime nếu có;
- test/evidence tương ứng hoặc ghi rõ chưa có;
- mức độ và finding/gap;
- giai đoạn dự kiến xử lý theo roadmap đã duyệt.

G0.4 đánh giá **độ đầy đủ và tính trung thực của cuộc audit**, không yêu cầu mọi tính năng của MASTER_SPEC đã được triển khai. Một yêu cầu có trạng thái `Missing` vẫn có thể được audit đúng; không được coi `Missing` là `PASS` về mặt tính năng. Không tự tạo requirement mới từ ảnh minh họa hoặc từ diễn giải ngoài nguồn.

## 5. G0.7 — ghi nhận giới hạn desktop và actionlint

- Môi trường trình duyệt hiện có: **Chromium headless + SwiftShader (software renderer, render WebGL bằng CPU)**. Ghi chính xác phiên bản Chromium, OS/host, cờ khởi chạy, backend WebGL, độ phân giải và các API không hỗ trợ. Đây là số đo của môi trường headless/software-rendering cụ thể; **không** đại diện desktop GPU-accelerated và không được suy rộng thành hiệu năng PC có GPU.
- Vẫn có thể dùng kết quả này như một phép đo browser-runtime có giới hạn, bên cạnh Node/server. Nếu metric nào bị ảnh hưởng bởi SwiftShader hoặc headless, phải đánh dấu/giải thích riêng; không điền 0 cho metric unsupported.
- Môi trường này tuyệt đối **không thay thế số đo iQOO Z10 Turbo**. G0.7 phần iQOO giữ `BLOCKED` cho đến khi có bằng chứng thiết bị thật. Có thể xin ngoại lệ hẹp cho S1 theo §4.1 của tài liệu v3.3, nhưng không miễn trừ trước S2 hoặc các giai đoạn đụng runtime/performance.
- `actionlint` hiện chưa chạy: ghi `NOT_TESTED`, không ghi PASS. Thử chạy nếu môi trường B3 sẵn có công cụ/khả năng cài đặt an toàn; nếu không, giữ nguyên giới hạn và báo cáo. Không mở rộng B3 để xây một hệ thống CI mới chỉ nhằm có actionlint.
- Kiểm thử workflow cố ý fail trên GitHub Actions chưa có bằng chứng; local negative probe đã ghi nhận. Phải ghi đúng phân biệt này trong B1 evidence; không khẳng định đã kiểm chứng CI-failure path end-to-end.

## 6. Thứ tự thực hiện được ủy quyền

1. **Documentation acceptance commit trước:** cập nhật handoff ghi B1 `PASS` với commit `382aaa84...`, Actions run `43834719406`, test/artifact hashes và các giới hạn tại §5; không viết lại báo cáo baseline S0-A.
2. Đưa v3.3 hoàn thiện vào `docs/roadmap/` và bản sao byte-for-byte `MASTER_SPEC_VI.md` vào `docs/spec/`; tạo/cập nhật `SOURCE_REGISTER.v3.3.md` với SHA-256 đã kiểm; cập nhật `AI_COLLABORATION_PROTOCOL.md` bằng câu §2.2. Giữ nguyên v3.2 và ghi rõ v3.3 là phụ lục thay đổi giới hạn.
3. Commit/push các thay đổi tài liệu trên thành commit riêng, chỉ chứa tài liệu/handoff; cung cấp SHA-256 và commit SHA. Không force-push, không tạo PR tự động.
4. Sau đó thực hiện **B3 trước** trong worktree sạch theo baseline `2240a8f`. Khi B3 hoàn tất, dừng ở `READY_FOR_REVIEW` và gửi commit/diff/log/artifacts cho reviewer. Không tự chạy B4 trước khi B3 được review.
5. Sau `REVIEW_PASS` cho B3, tiếp tục B4 theo ủy quyền đã cấp. Nếu B4 phát hiện G0.6 FAIL, hoàn tất các case read-only an toàn, áp dụng §3 và không mở luồng xét S1.
6. Tiếp tục B7 để lập risk register/signoff trong cả hai trường hợp. Nếu G0.6 PASS, B7 có thể đề xuất bộ hồ sơ chuyển tiếp S1 và ngoại lệ G0.7/G0.8. Nếu G0.6 FAIL, B7 chỉ ghi nhận FAIL, remediation proposal và trạng thái BLOCKED; không đề xuất `REVIEW_PASS` cho S1. Reviewer kiểm tra toàn bộ hồ sơ trước khi đưa ra `REVIEW_PASS` cho **bộ hồ sơ chuyển tiếp S1** khi các điều kiện cứng đạt.
7. S1 vẫn cần owner `ACCEPTED` riêng trên kết quả signoff cuối cùng và scope S1. Văn bản này chấp nhận nguyên tắc ngoại lệ và ủy quyền B3/B4/B7; không tự động chấp nhận một ngoại lệ cụ thể chưa có evidence, không tự động mở S1.

## 7. Những việc KHÔNG được ủy quyền

- B2/C3, B5, B6; tạo keystore; cấu hình signing Environment/Secrets; sử dụng hoặc in secret.
- Gỡ APK baseline hoặc cài APK mới trên iQOO trước khi R14 được kiểm chứng và chủ dự án ra quyết định O5.
- Sửa gameplay, engine logic, RNG implementation, save serialization/schema, migration, dữ liệu lịch sử sản phẩm, asset/content đang ship.
- Triển khai task remediation G0.6 nếu chưa có owner authorization riêng.
- Bắt đầu S1, S2 hoặc giai đoạn sau trước `REVIEW_PASS` và owner `ACCEPTED` đúng quy trình.
- Ghi `S0 = PASS` trong khi bất kỳ gate nào còn `PARTIAL`, `BLOCKED`, `FAIL` hoặc `NOT_TESTED`.

## 8. Kết luận quyết định

**S0 v3.3 được chấp nhận có bổ sung. B3 + B4 + B7 được ủy quyền theo trình tự tuần tự; bắt đầu bằng cập nhật hồ sơ B1 và làm B3, sau đó dừng để review.**

Nguồn yêu cầu G0.4 được chốt là `MASTER_SPEC_VI.md` đã nhận diện bằng SHA-256 ở §4. G0.6 FAIL có lối ra duy nhất là dừng, lập task remediation riêng, xin phép riêng, sửa có giới hạn và xác minh lại trên candidate SHA; không miễn trừ. `REVIEW_PASS` của S0 chỉ áp dụng bộ hồ sơ chuyển tiếp có ngoại lệ, không có nghĩa toàn bộ S0 đã PASS.

---

## Tin nhắn quyết định để chủ dự án gửi Claude

Đọc `S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` này cùng v3.3 draft, v3.2, `AI_COLLABORATION_PROTOCOL.md` và `AI_HANDOFF.md`. Khi tôi gửi nguyên văn tin nhắn này, đây là chấp nhận bằng văn bản và ủy quyền gói B3+B4+B7 trong phạm vi nêu trên.

Thực hiện tuần tự: (1) cập nhật handoff cho B1; (2) commit tài liệu v3.3 đã hoàn thiện, bản sao nguyên vẹn `MASTER_SPEC_VI.md`, source register và câu sửa protocol; (3) làm B3 trong worktree sạch trên baseline `2240a8f`; (4) dừng để ChatGPT review B3. Không làm B4 trước khi B3 được review; sau đó B4; nếu G0.6 FAIL thì dừng và chỉ trình bày task remediation, không tự sửa. Không thực hiện B2/B5/B6/S1, không sửa sản phẩm/save/RNG, không thay đổi APK điện thoại. Ghi mọi SHA, hash, lệnh, exit code, logs, test counts và artifact vào handoff.
