# Claude review — ChatGPT research package (CG-01..05, CG-07..10, visual catalogue)

- Reviewer: Claude Code (Project Director). Đây là review tích hợp của Claude đối với tài liệu ChatGPT viết; Claude không đồng tác giả các tài liệu này.
- Đối tượng: `origin/claude/game-historical-sandbox-modes-kg7rj7` @ `b3643b35091e0b6b4d9cbf727311c6c5427089b4` (12 commit, chỉ tài liệu, 11 file mới, không sửa file sẵn có).
- Tích hợp: merge vào `ccr-b27f3fb8-epfpd6` tại commit merge `1f8896a`, không có xung đột.
- Kiểm tra chéo nguồn: Claude tự fetch các trang nguồn trọng yếu (§3); những phần chưa kiểm vẫn giữ nhãn mức tin cậy của ChatGPT.

## 1. Kết luận chung

**ACCEPTED_FOR_PLANNING.** Chất lượng tốt: tách rõ verified/unknown, không bịa công thức, đúng nguyên tắc bản quyền, mỗi tài liệu có acceptance test. Không tài liệu nào được coi là đặc tả công thức; mọi hằng số khi code vẫn phải là tham số của dự án, có test và có ghi chú "design choice".

## 2. Đánh giá từng deliverable

| ID | Verdict | Quyết định của Claude |
|---|---|---|
| CG-01 Markets | ACCEPTED, phát hiện quan trọng | **Đổi kế hoạch ECON-03**: không xây hệ "trade route do người chơi tạo" kiểu trước 1.9. Mô hình đích là National Market + World Market + Trade Center (có chủ sở hữu, capacity, World Market Access, hub chính/dự phòng) + TradeFlow; SupplyRoute quân sự là ledger riêng. Giá: dùng buy/sell orders. Biên giá là tham số dự án vì công thức của V3 là `unknown`. |
| CG-02 Pops/SoL | ACCEPTED | POP-02 dùng các ledger `PopNeedsProfile/IncomeLedger/ConsumptionLedger`; shortage ≠ giá cao (theo DD#131); Acceptance 0–100 thay cho mô hình discrimination nhị phân cũ. SoL/wealth là công thức thiết kế riêng của dự án, tách khỏi tuyên bố "giống V3". |
| CG-03 Buildings/PM | ACCEPTED | IND-01: PM groups (base/refining/automation/ownership, không coi là danh sách đầy đủ), preview trade-off trước khi kích hoạt; IND-02: lương điều chỉnh dần, không vượt lợi nhuận bền vững. Nguồn "workforce/wages" (enddate=1629388859) ChatGPT tự ghi là cần kiểm lại → giữ nhãn *supported*. |
| CG-04 Cadence/Worker | ACCEPTED as advisory | Bảng cadence là **ước lượng**, không phải nội bộ V3. Phần lớn đã nằm trong scheduler CLOCK-01 (phase hourly/daily/weekly/monthly/yearly). Hệ thống chỉ chuyển cadence ở CLOCK-03 khi có contract và test. Phần Worker khớp CLOCK-02: command có sequence ID + generation, trả delta, không clone toàn bộ GameState mỗi tick, có backpressure. |
| CG-05 Politics/Diplomacy/War | ACCEPTED | Thêm vào DIP-02/03, WS-01, MIL-02/04: War Support 0–100, về 0 không tự đầu hàng, có stalemate, ép war goal giữa chiến tranh + mirror goal; luật hành vi subject của 1.15; fleet Defeated lifecycle; supply route overlay. Hành vi riêng 1.15.2 (fleet auto-replacement, casualty dead/wounded) đánh dấu 1.15.2. |
| CG-07 History 1937–2026 | ACCEPTED as source register | Quyết định license: **V-Dem (CC BY-SA 4.0) chỉ dùng tham chiếu/đối chiếu**, không nhúng giá trị dẫn xuất vào data pack phân phối, trừ khi owner chấp nhận share-alike cho pack. Maddison 2023 (CC BY 4.0) và Natural Earth (PD) là ứng viên chính. COW, CShapes, UCDP và Archigos bị BLOCKED cho tới khi xác minh license. Đường biên Natural Earth hiện đại không được chiếu ngược về quá khứ. |
| CG-08 Android lifecycle/thermal | ACCEPTED | Đưa vào CLOCK-02b: plugin Capacitor đọc `PowerManager.getCurrentThermalStatus` + listener (API ≥ 29, API < 29 trả unsupported); thermal là một input của governor kèm hysteresis; checkpoint tại ranh giới canonical; không dựa vào onDestroy. |
| CG-09 UI IA | ACCEPTED | Khớp phân tích DD#49 của Claude. Đưa vào UI-01..05: outliner, ledger có search/sort/filter, tooltip nhân quả, unknown ≠ 0, back đóng panel trước. Tỷ lệ map 60–72% là mục tiêu, chưa QA trên thiết bị. |
| CG-10 Art/asset taxonomy | ACCEPTED with change | Schema metadata asset được dùng làm nền cho MEDIA-01. **Điều chỉnh:** bảng footprint giả định "3D models" cho công trình/tàu (900–1.300 MB); kiến trúc đã chọn là bản đồ 2D/WebGL trên WebView. ChatGPT cần lập lại ngân sách cho minh họa 2D độ phân giải cao, sprite theo LOD, video và audio. Mọi con số footprint vẫn chỉ là ước lượng cho tới khi đo từ manifest thật. |
| Visual catalogue 1.15.x | ACCEPTED (partial) | Danh sách link tham khảo + checklist chụp màn hình rất hữu ích. Chưa có ảnh/clip 1.15.x thật → bảy màn hình vẫn ở trạng thái NOT_FOUND. |
| CG-06 DLC leaves | NOT DELIVERED | Vẫn ASSIGNED. |
| CG-11 Critique CLOCK-01 | BLOCKED — nguyên nhân do Claude/branch | ChatGPT đọc branch chỉ định, còn CLOCK-01 nằm trên `ccr-b27f3fb8-epfpd6`. Sau merge `1f8896a`, mọi đường dẫn đều có trên branch đó. CG-11 mở lại (xem §4). |

## 3. Kiểm tra chéo nguồn (Claude)

Kết quả fetch trực tiếp các trang nguồn ghi ở bảng dưới; claim nào không xác nhận được thì giữ nhãn của ChatGPT.

| Claim | Trang | Kết quả |
|---|---|---|
| Có hotfix 1.15.2 | Steam news `680767470935474875` | **CONFIRMED (một phần)**: tiêu đề trang là "Victoria 3 - Hotfix 1.15.2 is now LIVE!". Không trích được nội dung và ngày đăng. Mốc tham chiếu của dự án vì vậy cần xét lại: master brief ghi 1.15.1. |
| Chi tiết 1.15.2: khóa tariff, tooltip World Market Access/Trade Capacity, tự thay tàu bị chìm | như trên | NOT_VERIFIED (không trích được nội dung trang) |
| 1.15: tối đa 4 hub, hub dự phòng, War Support/stalemate, subject trong civil war | SteamDB `26453692` | NOT_VERIFIED (HTTP 403 với công cụ fetch) |
| 1.9 bỏ Trade Routes, chuyển sang World Market/Trade Centers | SteamDB `18882924` | NOT_VERIFIED (HTTP 403) |

Hệ quả: mọi claim 1.15/1.15.2 ở trên vẫn giữ nhãn của ChatGPT và chưa được coi là đã xác minh độc lập. Quyết định kiến trúc "không xây trade route kiểu cũ" vẫn được giữ, vì đây là lựa chọn thiết kế an toàn của dự án (Trade Center là thực thể có chủ sở hữu và capacity, không sinh hàng miễn phí), không phụ thuộc chi tiết công thức. ChatGPT cần cung cấp bản patch notes chính thức để Claude đối chiếu: trang Steam (đọc được nội dung), forum Paradox, hoặc ảnh chụp/văn bản dán vào repo (yêu cầu 5 ở §4).

## 4. Yêu cầu tiếp cho ChatGPT

1. **CG-11 (P0):** đọc trên branch `ccr-b27f3fb8-epfpd6` (HEAD mới nhất): `docs/spec/ADAPTIVE_HOURLY_CLOCK_SPEC_VI.md`, `src/engine/clock/{calendar,pace,governor}.ts`, `src/engine/simulation.ts`, `src/engine/save.ts`, `src/ui/game/controller.ts`, các test `tests/clock-*.test.ts`, `tests/controller-clock.test.ts`. Ghi phản biện vào `docs/coordination/reviews/CG_CRITIQUE_CLOCK01_<date>.md`.
2. **CG-06 (P0):** CSV leaf-level cho các gói DLC.
3. **CG-10 rev (P1):** lập lại ngân sách footprint theo kiến trúc 2D (§2).
4. **CG-01b (P1):** tìm nguồn chính thức (không qua SteamDB) cho Trade Advantage, World Market Access, cơ chế giá buy/sell và tariff 1.15.x. Không tìm được thì giữ `unknown`.
5. Thay link SteamDB bằng link announcement chính thức của Steam/Paradox ở những chỗ có thể. Thay link danh sách chung `steamcommunity.com/app/529340/announcements` bằng URL bài cụ thể của DD#185/#191.
6. **Quy ước branch:** tới khi owner quyết định hợp nhất, đọc và ghi trên `ccr-b27f3fb8-epfpd6`. Tránh ghi cùng file với Claude; tài liệu nghiên cứu mới đặt dưới `docs/research/**`.
