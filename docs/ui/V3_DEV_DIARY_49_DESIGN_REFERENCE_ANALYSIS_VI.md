# Phân tích tham khảo thiết kế — Victoria 3 Dev Diary #49 (Graphic Overview)

- Nguồn: bộ tham khảo owner gửi ngày 21/11/2026 (`Victoria3_Reference_Pack.zip`: README + gallery liên kết 6 ảnh của Paradox Interactive, Dev Diary #49 – Graphic Overview, 08/06/2022: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-49-graphic-overview).
- Người phân tích: Claude Code. Ảnh được xem tạm trong scratchpad của phiên; **không commit ảnh vào repository**, không dùng trong sản phẩm, không sao chép bố cục pixel/biểu tượng/màu nhận diện/typography của Paradox.
- Giới hạn: ảnh có nhãn "WIP" năm 2022 (trước phát hành). Chúng cho biết **loại thông tin và hệ thống dữ liệu** mà màn hình phục vụ, không chứng minh cơ chế ở bản 1.15.1. Cơ chế phải xác minh qua CG-01..05.

Quy ước: **[Q]** = quan sát trực tiếp trên ảnh; **[S]** = suy luận về dữ liệu/hệ thống phía sau, cần xác minh.

## 1. Chính trị — Government (ảnh 01)

**[Q]** Chính thể ("Constitutional Monarchy"); nguyên thủ có chân dung, 3 trait, người thừa kế; thanh Legitimacy (%); số Radicals/Loyalists; chính phủ gồm các Interest Group với % clout, trạng thái hài lòng ("Neutral (+2)", "Unhappy (−6)"), các icon trait/ideology, chân dung leader của IG; IG có thể "muốn gia nhập" một party; cột Opposition nhóm IG theo party; danh sách luật được/không được chính phủ hoặc movement ủng hộ (có đếm); nút "Reform Government".

**[S] Dữ liệu cần có:** `Government {form, members: IG[], legitimacy, legitimacyBreakdown}`; `IG {clout từ cohort strength, approval với breakdown số, leader Character, ideologies[], partyMembership}`; `Party {IGs, votes}`; `Character {portrait, traits, role, heir}`; tổng radicals/loyalists từ cohort; luật được tính sẵn "có ủng hộ" từ stance IG + movement.

**Gap hiện tại:** `politics.ts` có 8 IG + clout/approval + legitimacy nhưng không có party, IG leader, approval breakdown, radicals/loyalists theo cohort, "reform government" (chọn IG vào chính phủ) → POL-01, POL-04, characters (POL-05).

**Thích ứng mobile:** màn ngang — trái: thẻ chính thể + nguyên thủ + legitimacy (gauge có tooltip nguồn); phải: danh sách IG cuộn dọc dạng hàng (clout bar, mặt cười approval kèm số, icon ideology ≤3). Chạm IG → sheet chi tiết (breakdown approval, cohort tạo clout, luật ủng hộ/phản đối). "Reform government" là sheet chọn IG với legitimacy dự báo trước khi xác nhận.

## 2. Công trình nông thôn — Buildings (ảnh 02)

**[Q]** Tab Urban / Rural / Development / Construction; mỗi loại công trình: ảnh minh họa, cấp (số), chuỗi icon production method theo nhóm (có badge số lựa chọn), lợi nhuận/thu nhập (£ 5.0), nút trợ cấp và nút xây (+); "Subsistence" không có tiền; lưới "Potential Rural Buildings" với số lượng hiện có (0/1) theo tài nguyên.

**[S]** `BuildingType {category urban/rural/development, PM groups[]}`; `BuildingSite {state, level, activePMs per group, subsidized, cashReserves, profit/productivity}`; tiềm năng xây phụ thuộc resource/arable land của state; construction queue riêng.

**Gap:** 10 building types, recipe cố định, không có PM selectable, subsidy, potential theo tài nguyên → IND-01 (ưu tiên P0), IND-04.

**Thích ứng mobile:** danh sách nhóm theo category; mỗi hàng: thumbnail (art gốc của dự án, MEDIA-04), cấp, chip PM (chạm → bottom sheet so sánh PM: input/output/jobs/lợi nhuận dự báo), lợi nhuận, nút xây (+) có xác nhận chi phí. Lưới "tiềm năng" thu gọn thành bộ lọc.

## 3. Thị trường — Market (ảnh 03)

**[Q]** Tên market, thành viên (cờ), market capital, link trade routes; bộ lọc 4 nhóm hàng (staple/industrial/luxury/military); bảng: Sell Orders, Buy Orders, Balance (+/−, màu), Market Price (£) với biểu tượng mức giá và % lệch so với giá cơ sở; tab Details / Trade Routes / States. Top bar quốc gia có các nguồn lực (+thu nhập), GDP, literacy, SoL, dân số, radicals/loyalists.

**[S]** Giá hình thành từ tỷ lệ buy/sell orders với biên giá quanh base price; `% so với base` là đại lượng cần hiển thị; market capital ảnh hưởng market access; state-level breakdown.

**Gap:** `economy.ts` có supply/demand/imports/short và price index nhưng không có buy/sell orders theo đơn vị, market capital, state access, phân nhóm hàng, trade route entity → ECON-01/02/03 (CG-01 xác minh công thức).

**Thích ứng mobile:** bảng 4 cột số thu gọn (Bán · Mua · Cân bằng · Giá ±%) dùng chữ số tabular; chạm hàng → biểu đồ lịch sử giá + nguồn cung/cầu (building/pop/trade); bộ lọc nhóm hàng là chip ngang. Màu + dấu +/− (không chỉ màu).

## 4. Sự kiện / Journal (ảnh 04)

**[Q]** Cửa sổ sự kiện gắn địa danh ("Event in Oromia"), minh họa lớn, đoạn mô tả có từ khóa tô sáng (culture), câu trích dẫn flavor, 2 lựa chọn (một có dấu ✓ khuyến nghị/AI); cột phải "Active Journal Entries" có đồng hồ đếm ngày (36 days), các hoạt động ngoại giao đang chạy (Improve Relations + quan hệ "Neutral (10)" có thanh), danh sách commanders.

**[S]** Event có hạn quyết định theo **ngày** → cần scheduled deadline trên đồng hồ canonical (CLOCK-04, khớp CLOCK-01); lựa chọn có tooltip hệ quả; outliner liệt kê tác vụ dài hạn (diplomatic actions có tiến độ).

**Gap:** decision windows có hạn theo tháng; không có outliner thống nhất; minh họa sự kiện chưa có → HIST-02, CLOCK-04, UI-03, MEDIA (event art gốc).

**Thích ứng mobile:** sự kiện là sheet toàn màn hình ngang 2 cột (minh họa | văn bản + lựa chọn), lựa chọn ≥ 48 dp; outliner là drawer bên phải có đếm ngược theo ngày/giờ game.

## 5. Bản đồ sống & giao thương (ảnh 05)

**[Q]** Địa hình 3D, rừng, sông, đường đất, thành phố/cảng mọc theo phát triển, tàu buồm, tuyến hải thương nét đứt.

**[S]** Bản đồ phản ánh trạng thái kinh tế (đô thị hóa, cảng, đường) và luồng thương mại.

**Thích ứng mobile (quyết định kiến trúc):** không làm 3D đầy đủ trên WebView; dùng bản đồ 2D canvas/WebGL hiện có với LOD: biểu tượng cảng/thành phố theo cấp phát triển, tuyến thương mại nét đứt có hướng chảy (animation tắt được – reduced motion), chỉ vẽ ở zoom gần. Ngân sách GPU đo trên thiết bị.

## 6. Papermap toàn cầu (ảnh 06)

**[Q]** Ở zoom xa, bản đồ chuyển sang "bản đồ giấy" phong cách thế kỷ 19: màu chính trị pastel, lưới kinh vĩ, la bàn, tên đại dương chữ serif, tuyến hàng hải chấm.

**[S]** Chuyển phong cách theo mức zoom giúp đọc biên giới khi xa và chi tiết khi gần.

**Thích ứng:** đã có lens chính trị + relief/terrain; bổ sung chế độ "bản đồ giấy" ở zoom xa với texture giấy/khắc **tự tạo hoặc public domain** (vd bản đồ thế kỷ 19 PD qua HY-04), tên vùng/đại dương serif, giảm mật độ nhãn.

## 7. Nguyên tắc thiết kế rút ra cho Victori3 Mobile

1. Mỗi con số có nguồn: tooltip/breakdown (approval, legitimacy, giá) — engine phải xuất causal breakdown, UI không tự tính.
2. Mọi màn hình là **ledger có hành động**: PM, xây, trợ cấp, reform, lựa chọn sự kiện đều đi qua command domain.
3. Thời gian hiển thị theo ngày/giờ (đã có HUD CLOCK-01) và deadline theo ngày.
4. Ngôn ngữ hình ảnh riêng của dự án: có thể theo tinh thần "bàn làm việc thế kỷ 19" (giấy, mực, đồng), nhưng icon, khung, font, bảng màu phải gốc; không dùng ảnh/icon của Paradox. Asset theo MEDIA-01 (rights/provenance).
5. Mobile: map trung tâm, panel là drawer/sheet, chữ số tabular, touch target ≥ 48 dp, không phụ thuộc màu.

## 8. Ánh xạ vào kế hoạch

| Ảnh | Task được tăng thông tin |
|---|---|
| 01 Politics | POL-01, POL-04, POL-05, UI-03 |
| 02 Buildings | IND-01, IND-04, MEDIA-04 |
| 03 Market | ECON-01, ECON-02, ECON-03 |
| 04 Event/Journal | HIST-02, CLOCK-04, UI-03 |
| 05 Living map | UI-02, ECON-03 |
| 06 Papermap | UI-02, HY-04, MEDIA-01 |

Yêu cầu bổ sung (gửi owner → ChatGPT/Hydrogen): ảnh/clip **bản 1.15.x** của các màn hình Production Methods, Trade Routes/market access, Diplomatic Play, Military fronts, Power Bloc, ship designer (The Great Wave) và War Support để đối chiếu với tài liệu chính thức mới nhất (chỉ dùng tham khảo).
