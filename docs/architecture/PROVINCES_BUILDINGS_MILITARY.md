> **LEGACY PROPOSAL — NOT AN APPROVED IMPLEMENTATION SPECIFICATION. Do not implement conflicting instructions from this file. Use the latest owner-approved canonical roadmap and phase specification.**
>
> **ĐỀ XUẤT CŨ — KHÔNG PHẢI ĐẶC TẢ TRIỂN KHAI ĐÃ DUYỆT.** Tài liệu được giữ làm tham khảo lịch sử (commit `2240a8f`, 2026-11-16). Phân loại theo quyết định của chủ dự án ngày 2026-11-16 (rà soát commit `bd5787f`). Roadmap chính thức: `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, chủ dự án phê duyệt 2026-11-16 (commit `574ddc7`) — xem `docs/coordination/AI_HANDOFF.md` và `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md`.
>
> Các mâu thuẫn đã biết — **không** làm theo những điểm sau trong tài liệu này:
> 1. **Đánh số lát cắt S1–S15** (mục 3, 7) là đánh số cục bộ, xung đột với roadmap tổng S0–S23 của tài liệu đã phê duyệt; "S1", "S13"… ở đây **không** phải các giai đoạn cùng tên của roadmap.
> 2. **Migration quân đội** (mục 2, bước v2 → v3) đổi quân số tổng thành các trung đoàn đặt tại thủ đô/vùng biên. Hướng đã duyệt: giữ `LegacyForcePool` có provenance; **không** tự tạo đội hình, chỉ huy, vị trí hay lịch sử đơn vị.
> 3. **Chuyển mô phỏng sang Web Worker trước S13** (mục 5) xung đột với quyết định J: S2 đo runtime trước rồi mới quyết định có cần Worker hay không và ở đâu.
> 4. **`AdministrativeUnit[]` lồng trực tiếp dưới `StrategicRegion`** (sơ đồ mục 1) không được ghi đè quan hệ đã duyệt: crosswalk không gian nhiều–nhiều giữa hình học hành chính hiện đại và vùng mô phỏng chiến lược.
> 5. **ID công trình `"<region>:<type>"`, một instance cho mỗi vùng × loại** (bảng mục 1.2) không được ghi đè quyết định E: BuildingSite thưa, khóa theo địa điểm/cơ sở + loại + production method + identity vận hành, ID ổn định dạng opaque có lineage khi tách/gộp/đổi production method.
>
> Phần còn lại (số đo Node ở mục 0, nguồn dữ liệu dự kiến ở mục 4, rủi ro hiệu năng ở mục 5, danh sách "không làm" ở mục 6) chỉ là ghi chú lịch sử chưa được duyệt; số đo máy chủ không phải bằng chứng Android.

# Đề xuất kiến trúc: tỉnh – settlement – công trình – quân đội (trước khi viết mã)

Theo `README_FOR_CLAUDE.md` bước 6 của bộ bàn giao: đề xuất kiến trúc domain, migration, thứ tự triển khai, rủi ro hiệu năng Android và tiêu chí nghiệm thu **trước khi** sửa engine. Điểm xuất phát là audit `docs/audit/MASTER_SPEC_AUDIT.md` (HEAD `26b6369`).

## 0. Số đo hiện tại (để so sánh sau mỗi lát cắt)

Đo bằng Node trên CPU máy chủ (không phải điện thoại), ván Lịch sử seed 1, 120 tháng:

| Chỉ số | Giá trị |
|---|---|
| Vùng (strategic region) / quốc gia còn sống | 662 / 252 |
| Thời gian một tháng mô phỏng | 26,4 ms |
| Kích thước bản lưu JSON / gzip | 1,9 MB / 350 KB |
| Đơn vị hành chính có sẵn trong lưới bản đồ | 4 596 (Natural Earth admin-1, ranh giới hiện đại) |

Ngân sách đề xuất cho bản đầy đủ: ≤ 120 ms/tháng trên máy chủ (≈ 3–4 lần chậm hơn trên điện thoại tầm trung → vẫn < 0,5 s mỗi tháng ở tốc độ nhanh nhất), bản lưu gzip ≤ 3 MB. Số đo trên điện thoại thật phải được bổ sung khi có thiết bị.

## 1. Mô hình domain

Nguyên tắc: **định nghĩa** (tĩnh, trong cơ sở dữ liệu lịch sử, có nguồn) tách khỏi **trạng thái** (trong `GameState`, được lưu). ID ổn định, không đổi khi đổi tên.

```
World
 └ PoliticalEntity (đã có: EntityRecord / Country)
    └ StrategicRegion  ← 662 "vùng" hiện tại, giữ nguyên ID; đơn vị tính kinh tế, dân cư, chiến tranh, hậu cần
       ├ AdministrativeUnit[]  ← mới; ban đầu = 4 596 đặc trưng admin-1 Natural Earth đã có trong lưới bản đồ,
       │                          gắn nhãn "ranh giới hiện đại – xấp xỉ"; tên/cấp lịch sử bổ sung dần có nguồn
       ├ Settlement[]          ← mới; thủ đô, thành phố, cảng, thị trấn (tọa độ, dân số ước lượng + độ tin cậy)
       ├ ResourceDeposit[]     ← mở rộng từ `res` hiện có: loại, trữ lượng (khoảng), đã phát hiện hay chưa
       ├ BuildingInstance[]    ← thay `Region.buildings: Record<Building, number>`
       └ Infrastructure        ← năng lực (đường bộ theo địa hình, đường sắt, cảng, đường thủy) và mức sử dụng
```

### 1.1 Định nghĩa (dữ liệu, có nguồn, `historical_data/` → `db.json`)

| Định nghĩa | Trường chính |
|---|---|
| `BuildingType` | id, nhóm (A–J của đặc tả 4.2), điều kiện xây (địa hình, khí hậu, tài nguyên, công nghệ, luật), cấp tối đa theo điều kiện, chi phí xây (hàng hóa + công), nhu cầu hạ tầng, `productionMethodGroups[]` |
| `ProductionMethod` | id, nhóm, công nghệ mở khóa, đầu vào/đầu ra theo hàng hóa mỗi cấp, lao động theo nghề mỗi cấp, chi phí vận hành, ghi chú nguồn |
| `Good` | mở rộng từ 12 lên khoảng 30 (lương thực tách gạo/lúa mì/ngô, gia súc, cá, giấy, hóa chất, máy móc, tàu, đạn…) — mỗi hàng hóa có giá cơ sở và nguồn |
| `Occupation` | nông dân, thợ thủ công, thợ mỏ, công nhân, kỹ sư, thư lại, sĩ quan… gắn với `STRATA` hiện có |
| `UnitType`, `EquipmentType` | quân chủng, năm/công nghệ xuất hiện, biên chế chuẩn, trang bị cần, hàng hóa tiêu thụ |
| `SettlementDef` | id, tên theo thời kỳ, tọa độ, vùng, loại, dân số ước lượng 1836 + khoảng + nguồn |

### 1.2 Trạng thái (`GameState`, lưu)

| Trạng thái | Trường chính |
|---|---|
| `BuildingInstance` | id `"<region>:<type>"`, cấp đã xây, cấp đang xây, cấp hư hại, PM đang dùng theo nhóm, lao động tuyển được theo nghề, tỷ lệ đáp ứng đầu vào, doanh thu/chi phí/lợi nhuận tháng trước, **sổ sở hữu** `{state, aristocrats, capitalists, foreign:<id>, cooperative}` |
| `ConstructionProject` | id, quốc gia, vùng, loại, số cấp, tổng chi phí, đã chi, vật liệu thiếu, ưu tiên, tạm dừng |
| `Formation` | id, quốc gia, cấp (tập đoàn quân/quân đoàn/sư đoàn/lữ đoàn/trung đoàn hoặc hạm đội/hải đoàn), cấp trên, chỉ huy (id nhân vật), vị trí (vùng), mục tiêu di chuyển |
| `Unit` | id, loại, biên chế/quân số thực, trang bị (tỷ lệ đủ), huấn luyện, kinh nghiệm, tinh thần, tiếp tế, tổn thất tích lũy |
| `Commander` | nhân vật (dùng `CharacterRegistry` đã có), cấp bậc, kỹ năng, kinh nghiệm |

`Country.army` / `Country.navy` hiện tại trở thành **giá trị tổng hợp tính từ** `Unit[]` (giữ để AI và UI cũ không vỡ trong giai đoạn chuyển tiếp).

## 2. Migration và tương thích bản lưu

1. Thêm khung migration: `migrations[v] = (state) => state'` áp dụng tuần tự trong `deserialize` (hiện `src/engine/save.ts:14` từ chối mọi version ≠ 1).
2. v1 → v2 (công trình): mỗi `Region.buildings[b] = n` → một `BuildingInstance` cấp `n`, PM mặc định đúng với công thức cũ (để kết quả kinh tế không đổi ngay khi chuyển), sở hữu khởi tạo theo luật kinh tế của nước (ghi rõ là giả định có phương pháp).
3. v2 → v3 (quân đội): `Country.army.manpower` → các trung đoàn theo mẫu biên chế của nước (hoặc mẫu chung có đánh dấu "ước lượng"), đặt tại thủ đô và các vùng biên.
4. Test bắt buộc: bản lưu v1 cố định trong `tests/fixtures/` được tải, migrate, chạy tiếp 12 tháng, rồi lưu–tải lại cho kết quả trùng khớp (tính xác định).

## 3. Thứ tự triển khai (lát cắt dọc, mỗi lát một hoặc vài commit có test và ảnh chụp)

| Lát | Nội dung | Thay đổi kết quả mô phỏng? | Tiêu chí nghiệm thu (rút từ đặc tả 15.6–15.8) |
|---|---|---|---|
| S1 | Khung version + migration bản lưu | Không | Bản lưu v1 tải được qua migration; test tính xác định |
| S2 | `BuildingType` / `ProductionMethod` dữ liệu hóa; 10 loại hiện có chuyển sang định nghĩa, mỗi loại 1 PM tái tạo đúng công thức cũ | Không (test hồi quy so số liệu 10 năm trước/sau) | Kết quả kinh tế trùng (sai số < 0,5 %) |
| S3 | `BuildingInstance` + trạng thái (thiếu lao động, thiếu đầu vào) + trang "Công trình" của vùng và trang từng công trình | Có (nhỏ) | Ca 5, 6 của 15.6; UI hiển thị số liệu engine |
| S4 | Hàng đợi xây dựng + năng lực xây dựng (thay `build()` tức thời); AI dùng hàng đợi | Có | Ca 1, 13; xây cần thời gian, vật liệu, ngân sách |
| S5 | Production methods nhiều cấp (thủ công → cơ khí → …), đổi PM có chi phí và thay đổi nghề nghiệp | Có | Ca 7 |
| S6 | Sổ sở hữu thay `statePool`/`privatePool`; luật tư nhân hóa/quốc hữu hóa | Có | Ca 12 |
| S7 | Hạ tầng + market access (đường bộ theo địa hình, đường sắt, cảng, phong tỏa) | Có | Ca 4, 8 |
| S8 | Nông nghiệp/chăn nuôi/thủy sản; mỏ có trữ lượng, phát hiện tài nguyên | Có | Ca 1, 2, 3 |
| S9 | Công trình hành chính, giáo dục, quân sự (doanh trại, pháo đài), văn hóa | Có | Ca 9 |
| S10 | Chiến tranh phá hủy / hòa bình phục hồi công trình | Có | Ca 10, 11 |
| S11 | Settlement (dữ liệu có nguồn) + lớp bản đồ cấp tỉnh (điểm dân cư, biểu tượng công trình theo zoom) | Không (hiển thị) → Có khi đô thị hóa nối vào | Đi từ bản đồ thế giới → tỉnh → thành phố → công trình (15.7) |
| S12 | Đơn vị hành chính (admin-1 xấp xỉ) trong cửa sổ tỉnh; đổi tên/chia tách có ngày hiệu lực | Không | 15.7: đổi chủ, chia tách, đổi tên, save/load giữ ID |
| S13 | Quân đội: Formation/Unit/Commander, tuyển quân, trang bị tiêu thụ hàng hóa | Có | 15.8: tạo, xếp cấp, bổ nhiệm, tuyển, trang bị |
| S14 | Di chuyển trên đồ thị kề vùng, tiếp tế theo khoảng cách/hạ tầng, trận đánh theo thành phần, công thành, hải quân phong tỏa/đổ bộ | Có | 15.8: hành quân, cắt tiếp tế, công thành, đổ bộ, phong tỏa |
| S15 | Hiệu chỉnh lại theo bộ kiểm định đa khu vực | Có | Mốc lịch sử nhiều khu vực trong khoảng dung sai |

Các lát sau S2 làm thay đổi kết quả mô phỏng: mỗi lát chạy lại toàn bộ test hiện có và báo cáo chênh lệch các chỉ số tổng (dân số, GDP, chiến tranh) trên nhiều seed.

## 4. Nguồn dữ liệu dự kiến (phải xác minh giấy phép trước khi dùng)

| Dữ liệu | Nguồn dự kiến | Ghi chú |
|---|---|---|
| Dân số đô thị lịch sử có tọa độ | Reba, Reitsma & Seto (2016), *Spatializing 6,000 years of global urbanization*, Scientific Data — bộ dữ liệu trên SEDAC | Dựa trên Chandler / Modelski; năm 1800 và 1850 → nội suy 1836 có ghi phương pháp; **giấy phép cần kiểm tra** |
| Vị trí thị trấn, cảng | GeoNames (CC BY 4.0) | Chỉ tọa độ/tên, không có dân số lịch sử |
| Đơn vị hành chính | Natural Earth admin-1 (công cộng, đã có) | Ranh giới hiện đại — luôn ghi là xấp xỉ |
| Đường sắt theo năm | Các bộ dữ liệu lịch sử đường sắt quốc gia (cần tìm theo từng khu vực) | Có thể chỉ có cho một số nước → hiển thị độ phủ |
| Biên chế quân đội 1836 | CoW NMC (quân số tổng, đã có) + tài liệu lịch sử từng nước | Mẫu biên chế không có nguồn phải ghi "ước lượng" |

## 5. Rủi ro hiệu năng Android và cách giảm

| Rủi ro | Quy mô | Cách xử lý |
|---|---|---|
| Số công trình | ~662 × 15–25 loại ≈ 10–16 nghìn instance | Mảng typed theo loại, tính theo lô mỗi tháng; chỉ tính lại vùng "dirty" (đổi giá, đổi lao động) |
| Số đơn vị quân sự | vài nghìn trung đoàn toàn cầu | Gộp ở cấp trung đoàn; AI quân sự chạy so le theo nước (đã có `stagger`) |
| Tìm đường quân đội | đồ thị 662 nút | A* trên đồ thị kề có sẵn, cache theo cặp; không tính mỗi khung hình |
| Settlement trên bản đồ | 2–5 nghìn điểm | Spatial grid, LOD theo zoom, vẽ trên canvas overlay chỉ khi camera đổi |
| Bản lưu | hiện 1,9 MB JSON | Nén gzip khi lưu (CompressionStream), mục tiêu ≤ 3 MB nén |
| Luồng UI | mô phỏng chạy trên luồng chính | Chuyển mô phỏng sang Web Worker trước S13 để tránh ANR |
| Bộ nhớ ảnh | gói nội dung lớn dần | Ảnh lazy, kích thước cố định, giải phóng khi cửa sổ đóng; đo trên thiết bị thật |

## 6. Những gì **không** làm

- Không đưa bất kỳ số liệu, địa danh, cấp công trình hay quân số nào từ ảnh concept vào dữ liệu.
- Không sao chép danh sách công trình, production method, tên hàng hóa hay số liệu từ Victoria 3 / Vic3 Tabula; chỉ dùng như nguyên lý thiết kế.
- Không tuyên bố đạt Android khi chưa đo trên thiết bị thật.

## 7. Cần xác nhận trước khi bắt đầu S2 trở đi

1. Giữ 662 vùng hiện tại làm **Strategic Region** (đơn vị tính toán), thêm 4 596 đơn vị hành chính hiện đại làm lớp xấp xỉ bên dưới — hay muốn đầu tư dựng lại ranh giới hành chính năm 1836 (rất tốn công, nguồn không đồng đều giữa các khu vực).
2. Chấp nhận rằng từ S3 kết quả mô phỏng (GDP, tăng trưởng, chiến tranh) sẽ thay đổi và các mốc hiệu chỉnh cần chạy lại.
3. Thứ tự: công trình (S1–S10) trước quân đội (S13–S14), như lộ trình mục 16 của đặc tả.
