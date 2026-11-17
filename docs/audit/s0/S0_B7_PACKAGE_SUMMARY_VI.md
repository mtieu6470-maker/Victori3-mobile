# S0-B7 — Bản tổng hợp hồ sơ rủi ro và chuyển tiếp S1

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** https://github.com/mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Trạng thái B7:** READY_FOR_REVIEW  
**HEAD trước commit tạo bản tổng hợp:** 804fcabef43603763f66f4acb6cd34463d8fc0ae  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**Owner authorization:** OD-20261116-11 (S0 v3.3)  
**Ngày:** 2026-11-17

> Đây là bản chỉ mục/tổng hợp để đọc nhanh. Các file chi tiết bên dưới là nguồn bằng chứng chính thức; không thay thế log, report gốc, independent review hoặc quyết định của chủ dự án.

## 1. Kết luận hiện tại

S0-B7 đã hoàn thành việc lập hồ sơ rủi ro, gate ledger và đề xuất signoff. Bộ hồ sơ đang **READY_FOR_REVIEW**, chưa có independent REVIEW_PASS và chưa có owner ACCEPTED.

**S1 vẫn NOT_STARTED. Toàn bộ S0 chưa PASS.**

Theo OD-20261116-11 §6 step 6, B7 được ủy quyền tiếp tục sau khi B4 có kết quả thực thi, trong cả hai trường hợp G0.6 PASS hoặc FAIL. Việc chuẩn bị hồ sơ B7 không cần đợi B4 có independent REVIEW_PASS. Tuy vậy, toàn bộ gói chuyển tiếp S1 vẫn bắt buộc được reviewer độc lập kiểm tra và chủ dự án chấp nhận trước khi làm S1.

## 2. Trạng thái các cổng G0.1–G0.9

| Gate | Trạng thái trong ledger | Bằng chứng chính / giới hạn |
|---|---|---|
| G0.1 — Snapshot | **PASS (đề xuất)** | S0-A snapshot baseline 2240a8f; phạm vi B7 chỉ audit/docs/handoff, không đổi sản phẩm |
| G0.2 — Build/CI | **PASS (đề xuất)** | S0-A clean build/B1 CI; B4 tests-only CI chạy đúng SHA và thành công. Không coi B4 CI là APK build |
| G0.3 — Test catalog | **PASS (đề xuất)** | 58/58 test được catalog, có assertion counts và stability evidence; TC-F1…F7 vẫn được ghi nhận |
| G0.4 — Requirement audit | **PASS (đề xuất)** | 353 requirement nguyên tử từ MASTER_SPEC_VI §§0–17; trạng thái Partial/Missing/Placeholder/Unverified được giữ nguyên |
| G0.5 — Global data | **PASS (đề xuất)** | 274 thực thể, 662 vùng, 12 nhóm phân tích và 4.374 cặp crosswalk; Tây Á và Trung Đông gộp, không tuyên bố 13 vùng độc lập |
| G0.6 — Save determinism | **PASS (đề xuất)** | Bốn valid-save case Historical/Sandbox × tick 6/12 đều MATCH; hành vi malformed/legacy được mô tả riêng |
| G0.7 — Runtime/performance | **BLOCKED** | Node PASS; desktop PARTIAL do Chromium headless + SwiftShader; iQOO Z10 Turbo chưa có số đo |
| G0.8 — Asset/licensing | **PARTIAL** | Inventory/checksum PASS; 492 giấy phép ảnh chưa xác minh lại; còn thiếu authorship/attribution; 227 chân dung thiếu period validity |
| G0.9 — Risk/signoff | **BLOCKED cho toàn S0** | Theo v3.3 §2.1.1, G0.9 của S0 giữ BLOCKED khi R14/C3 còn BLOCKED. Bộ risk disposition chuyển tiếp S1 được reviewer đánh giá riêng, không đổi nhãn gate S0 |

G0.1–G0.6 là trạng thái được đề xuất theo bằng chứng hiện có, chưa thay thế independent review cuối cùng. Không được hiểu bảng trên là tuyên bố S0 đã nghiệm thu.

## 3. Rủi ro quan trọng nhất

### P0

- **R7 — mất tiến trình / renderer:** chưa có autosave đáng tin cậy theo lifecycle, process-death recovery hoặc WebView renderer/WebGL recovery. Chưa sửa kỹ thuật. Owner đã chấp nhận về nguyên tắc biện pháp hạn chế rủi ro; signoff cuối vẫn cần chủ dự án xác nhận rõ mức rủi ro còn lại.

### P1

- **R1/R14:** rủi ro mất save khi thay APK; Export/Import chưa xác minh trên APK baseline iQOO. Giữ APK hiện tại, không gỡ/cài APK khác chữ ký.
- **R13/C3:** chưa có development-signing Environment/workflow được cấu hình và kiểm tra an toàn; không tạo keystore/secret trong B7.
- **R2 / AS-F3 / AS-F1:** R2 là rủi ro cấp nội dung do đang ship 796 đoạn trích CC BY-SA; AS-F3 là finding P2 riêng về dòng nguồn UI thiếu liên kết license và tác giả; AS-F1 là 492 hồ sơ giấy phép ảnh chưa được xác minh lại. Không gộp các mức độ này thành một finding.
- **GD-F2:** độ phủ dữ liệu toàn cầu không đồng đều; Sub-Saharan Africa có 84,8% dân số vùng mang nhãn missing theo audit.
- **TC-F1/TC-F2:** hai test luật/chiến tranh có pass rỗng; green CI không chứng minh được các invariant đó.
- **R5 / RM-F3 / RM-F4:** R5 (P1) cảnh báo số đo frame/FPS không tách được tick cost; callback `stepMonth + emit` trên desktop có p95 38,8–63,4 ms, max 97,1 ms, còn browser `stepMonth` riêng là unsupported. RM-F3 (P1) ghi mô phỏng đồng bộ trên main thread; RM-F4 (P2) ghi loop `requestAnimationFrame` giới hạn throughput. Đây là ba góc rủi ro liên quan nhưng không đồng nhất.
- **R10:** cần ngân sách hiệu năng cho các lớp bản đồ mới ở các giai đoạn S4/S11/S20.

### Các finding đã được bổ sung hoặc bảo toàn

Risk register giữ đầy đủ R1–R14, ghi R3 là CLOSED, và bao gồm TC-F1…F7, GD-F1…F6, AS-F1…F7, RM-F1…F5, WD-F1…F3 cùng B4-R1. TC-F5/TC-F6 được đánh dấu có bổ sung test coverage trong B4, nhưng lỗi missing-RNG vẫn được giữ riêng trong B4-R1.

## 4. B4 — bằng chứng test được xác minh lại

- **Workflow run:** 44041104723
- **Event:** workflow_dispatch
- **Branch:** claude/game-historical-sandbox-modes-kg7rj7
- **Exact checked-out SHA:** d2ae88e557e9895413462c5b069886bfc606adc7
- **Job:** 133895641421 — success
- **Steps:** checkout, setup Node, npm ci, prepare generated test data, npm run test:fast — đều success
- **Vitest:** 6/6 suites, 70/70 tests, 0 failures; process exit success
- **Artifact list:** rỗng; workflow không chạy Vite build, Capacitor sync, Gradle, assembleDebug, signing, APK packaging hoặc artifact upload
- **Valid-save matrix:** Historical tick 6/12 và Sandbox tick 6/12 đều MATCH; firstDifferingPath=null
- **Missing RNG:** deserialize vẫn nạp rng=undefined; stepMonth tiếp theo ném TypeError. Đây là hành vi baseline được characterize, không phải bug đã sửa.

So sánh từ test-correction commit ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad đến B4 tested HEAD d2ae88e cho thấy test source không bị sửa thêm; thay đổi ở đoạn này chỉ là tests-only workflow và audit/handoff documentation.

## 5. Ngoại lệ S1 được đề xuất — không tự động được chấp nhận

### EX-G07-01 — hoãn số đo iQOO trong S1

Chỉ cho phép S1 data contracts/save compatibility chạy CI/desktop. Không đổi tick loop, Worker, renderer, WebGL, WebView lifecycle, autosave, performance strategy hoặc cài APK trên iQOO. G0.7 vẫn BLOCKED cho đến khi đo thiết bị thật trước S2.

### EX-G08-01 — hoãn xác minh giấy phép nội dung cũ trong S1

Chỉ cho phép schema/data contract/save compatibility không làm thay đổi asset/content. Không thêm, sửa, thay, xóa, đóng gói lại hoặc phát hành thêm asset/text chưa xác minh. G0.8 vẫn PARTIAL.

### R14/C3 không phải ngoại lệ cài đặt thiết bị

R14 tiếp tục BLOCKED. Không gỡ APK baseline, không cài APK khác chữ ký, không thực hiện B2/C3 hoặc B5/B6 trên thiết bị cho tới khi export/import được kiểm chứng và điều kiện signing được chủ dự án xử lý.

## 6. Các file chi tiết trong gói

1. [S0_RISK_REGISTER.md](S0_RISK_REGISTER.md) — risk IDs, severity, evidence, impact, mitigation, accountable owner, stage và exit criteria.
2. [S0_GATE_LEDGER.csv](S0_GATE_LEDGER.csv) — trạng thái G0.1–G0.9 cùng giới hạn.
3. [S0_SIGNOFF.md](S0_SIGNOFF.md) — đề xuất chuyển tiếp có ngoại lệ, xác nhận R7, phần independent reviewer và owner decision.
4. [S0_B7_RESULTS.md](S0_B7_RESULTS.md) — kết quả và phạm vi công việc B7.
5. [S0_B7_REVIEW_REQUEST.md](S0_B7_REVIEW_REQUEST.md) — 11 câu hỏi reviewer và danh sách file/log phải kiểm.
6. [../b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md](b4/S0_B4_CHATGPT_TECHNICAL_SELF_AUDIT_2026-11-17.md) — self-audit B4 và CI evidence.
7. [../S0_B3_RESULTS.md](S0_B3_RESULTS.md) — audit B3, gate proposal và index findings.
8. [../../coordination/AI_HANDOFF.md](../../coordination/AI_HANDOFF.md) — phase register, work log và trạng thái hiện hành.

## 7. Thay đổi GitHub và phạm vi

B7 chỉ thêm/cập nhật tài liệu audit và handoff. Đối chiếu từ HEAD trước khi bắt đầu B7 (5d92101e56d6f60045f51f25f926b124eaf892ef) tới HEAD của bản tổng hợp cho thấy các file thay đổi đều nằm trong docs/audit/s0 và docs/coordination; không có product source, historical_data, assets, Android resource, Gradle hoặc gameplay changes.

Workflow hiện hữu .github/workflows/android-apk.yml giữ nguyên blob SHA:
7a2639057272d2629f2d6b89cfc8fb07682dad31.

Không tạo APK, không cài APK, không tạo signing key hoặc secret trong B7.

## 8. Việc cần làm tiếp theo

1. Gửi [S0_B7_REVIEW_REQUEST.md](S0_B7_REVIEW_REQUEST.md) và bản tổng hợp này cho Claude để review độc lập tại exact HEAD mới nhất.
2. Reviewer ghi REVIEW_PASS hoặc CHANGES_REQUESTED cho **bộ hồ sơ chuyển tiếp S1 có giới hạn**, không ghi S0 là PASS.
3. Chủ dự án ghi ACCEPTED/REJECTED cho R7 residual risk, EX-G07-01, EX-G08-01 và scope S1.
4. Chỉ sau đủ independent REVIEW_PASS và owner ACCEPTED mới xem xét mở S1; không tự bắt đầu implementation.

**Trạng thái cuối tại HEAD ghi ở đầu file: B7 READY_FOR_REVIEW; B4 READY_FOR_REVIEW; S1 NOT_STARTED; overall S0 PARTIAL/BLOCKED.**
