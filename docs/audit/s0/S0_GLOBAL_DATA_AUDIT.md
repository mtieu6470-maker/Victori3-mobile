# S0_GLOBAL_DATA_AUDIT — S0-B3 (G0.5)

| Trường | Giá trị |
|---|---|
| Task | S0-B3 (OD-20261116-11) |
| Mã/dữ liệu được kiểm | Baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`, worktree tạm sạch. `src/generated/db.json` sinh bởi `npm run build` của baseline (S0-A đã chứng minh trùng với bản commit, trừ `built_at`). Dữ liệu **không sửa** |
| Công cụ | `tools/audit/s0/global_data_audit.ts`; `tools/audit/s0/admin1_crosswalk.ts` (chỉ đọc; nằm ngoài mã sản phẩm). Gán vùng vĩ mô dùng **chính** `tools/audit/regions.ts` của baseline (thủ đô → trung bình vùng sở hữu → toạ độ cố định cho thực thể không có lãnh thổ; có 5 ngoại lệ quy ước TUR, RUS, EGY, TIB, DZ_KACHIN) |
| Lệnh | `npx tsx tools/audit/s0/global_data_audit.ts <worktree baseline> docs/audit/s0/b3/global_data_audit.json` → exit 0<br>`npx tsx tools/audit/s0/admin1_crosswalk.ts <worktree baseline> docs/audit/s0/b3/region_admin1_crosswalk.csv docs/audit/s0/b3/region_admin1_crosswalk_summary.json` → exit 0<br>(`b3/logs/b3_global_data_audit.log`, `b3/logs/b3_admin1_crosswalk.log`) |
| Đầu ra (SHA-256) | `b3/global_data_audit.json` `423473e2a8dcf50b2a22e44f9550bb11bceff43cce7e020b7276f9051ba50093`<br>`b3/region_admin1_crosswalk.csv` `965fa5cd23bba43aafdf6bd393b58a42ddcbccc93089499fb9874af74108f8c5`<br>`b3/region_admin1_crosswalk_summary.json` `e095200e5c09e989961681c98b645265f49937097190732f7d8f6a225604c6c1` |
| Nhãn | `BASELINE_ORIGINAL` |
| Người lập | Claude Code, 2026-11-16 (tự đánh giá, **chưa được review độc lập**) |

## 1. Quy tắc phân loại

Mỗi trường dữ liệu của thực thể được xếp vào **đúng một** trong các loại sau. Loại không nhầm "mặc định" với "có nguồn".

| Loại | Điều kiện trong `db.json` |
|---|---|
| `sourced` | Nhãn `verified` hoặc `supported` **và** có ít nhất một nguồn (`sources` không rỗng) |
| `estimated` | Nhãn `estimated` hoặc `uncertain` (có phương pháp; không tính là có nguồn) |
| `default` | Trường không có giá trị nghiên cứu; engine tự suy ra giá trị (ví dụ literacy: `src/engine/init.ts:33–36`; army: `init.ts:170–171`) |
| `missing` | Nhãn `missing` rõ ràng; engine dùng giá trị dự phòng |
| `labelled_without_source` | Nhãn `verified`/`supported` nhưng **không có nguồn**: nhãn không nhất quán |

Trường được đếm cho thực thể:

- dân số (`population`);
- người đứng đầu nhà nước (`head_of_state`);
- quân đội (`army`);
- tỉ lệ biết chữ (`literacy`);
- luật (`laws`);
- GDP/người năm 1836 (`db.gdp_pc_1836`).

Với 662 vùng bản đồ, công cụ đếm nhãn `pop_quality` của từng vùng. Nhãn này đi theo nhóm dân số `pop_group`, và nguồn nằm ở cấp nhóm; công cụ **không** kiểm lại nguồn cho từng vùng.

**Không phân loại được** vì không có nhãn chất lượng trong `db.json`:

- văn hoá, tôn giáo, địa hình, tài nguyên của vùng;
- `tech_level` và `government` của thực thể.

Các trường này được ghi là `not_classifiable`, không được coi là có nguồn.

## 2. Tổng quan

- **274 thực thể**, 274 được gán vùng vĩ mô, 0 không gán được.
- **662 vùng bản đồ**, mỗi vùng thuộc đúng một vùng vĩ mô theo toạ độ.
- Dân số khởi đầu trên bản đồ: **1 119 971 577**.

### 2.1. Toàn cầu theo trường (274 thực thể)

| Trường | sourced | estimated | default | missing | labelled_without_source |
|---|---|---|---|---|---|
| population | 22 | 96 | 0 | 156 | 0 |
| head_of_state | 122 | 6 | 0 | 141 | **5** |
| army | 27 | 5 | 242 | 0 | 0 |
| literacy | 0 | 9 | 265 | 0 | 0 |
| laws | 12 | 262 | 0 | 0 | 0 |
| gdp_pc_1836 | 0 | 109 | 0 | 165 | 0 |

**Vùng bản đồ theo nhãn dân số:**

| Nhãn | Số vùng | Tỉ lệ dân số khởi đầu |
|---|---|---|
| verified | 73 | 9,0 % |
| supported | 95 | 11,2 % |
| estimated | 181 | 13,5 % |
| uncertain | 145 | **60,3 %** |
| missing | 168 | 5,9 % |

Như vậy chỉ **20,2 %** dân số khởi đầu có nhãn `verified`/`supported`.

### 2.2. Theo 12 vùng vĩ mô

Các cột dân số, nguyên thủ và GDP/người ghi theo dạng `sourced / estimated / missing`.

| Vùng | Thực thể (playable / placeholder / future / part_of) | Dân số | Nguyên thủ | Army sourced | Literacy default | GDP/người | Vùng bản đồ | % dân số vùng có nhãn verified+supported | % dân số vùng nhãn missing | research_completeness TB |
|---|---|---|---|---|---|---|---|---|---|---|
| Châu Âu | 75 (65/0/7/3) | 19/6/50 | 57/1/16 (+1 không nguồn) | 21 | 70 | 0/65/10 | 196 | 81,6 | 6,9 | 0,164 |
| Đông Á | 6 (5/1/0/0) | 0/5/1 | 4/1/1 | 0 | 4 | 0/5/1 | 54 | 0,4 | 0,0 | 0,272 |
| Nam Á | 18 (16/1/0/1) | 0/15/3 | 14/0/4 | 0 | 18 | 0/15/3 | 45 | 0,0 | 0,1 | 0,136 |
| Đông Nam Á | 22 (8/13/1/0) | 0/19/3 | 3/2/15 (+2 không nguồn) | 0 | 22 | 0/8/14 | 54 | 0,0 | 1,1 | 0,061 |
| Trung Á | 8 (5/3/0/0) | 0/3/5 | 5/0/3 | 0 | 8 | 0/2/6 | 11 | 22,4 | 51,4 | 0,096 |
| Tây Á & Trung Đông | 13 (7/6/0/0) | 0/6/7 | 5/0/8 | 1 | 12 | 0/2/11 | 43 | 40,4 | 5,2 | 0,126 |
| Bắc Phi | 11 (5/6/0/0) | 0/7/4 | 4/0/6 (+1 không nguồn) | 1 | 11 | 0/5/6 | 26 | 5,1 | 5,6 | 0,115 |
| Châu Phi hạ Sahara | 65 (17/46/2/0) | 0/14/51 | 14/1/50 | 0 | 65 | 0/0/65 | 81 | 0,0 | **84,8** | 0,037 |
| Bắc Mỹ | 16 (3/11/2/0) | 1/1/14 | 2/1/13 | 2 | 15 | 0/3/13 | 65 | 65,8 | 1,6 | 0,071 |
| Trung Mỹ & Caribe | 9 (2/1/6/0) | 0/2/7 | 2/0/7 | 0 | 9 | 0/0/9 | 18 | 1,9 | 9,7 | 0,029 |
| Nam Mỹ | 18 (11/6/1/0) | 1/10/7 | 11/0/7 | 2 | 18 | 0/4/14 | 53 | 11,1 | 2,9 | 0,113 |
| Châu Đại Dương | 13 (3/10/0/0) | 1/8/4 | 1/0/11 (+1 không nguồn) | 0 | 13 | 0/0/13 | 16 | 14,3 | 26,3 | 0,030 |

Phân bổ theo `kind`, số thực thể có `industrialization` nghiên cứu và đủ năm loại cho từng trường nằm trong `b3/global_data_audit.json` → `regions.<id>`.

## 3. Crosswalk admin-1 × 662 vùng (raster)

Hai raster dùng cùng lưới 8192 × 3868, plate carrée, 22,7556 ô/độ, vĩ độ 85 → −85:

- `assets/map/admin1_grid.bin.gz`: 4596 đơn vị admin-1 hiện đại của Natural Earth;
- `public/generated/map.bin`: vùng chiến lược của bản build.

Với mỗi cặp (vùng, admin-1), công cụ đếm số ô chung và diện tích xấp xỉ (trọng số cos vĩ độ). Công cụ cũng tính tỉ lệ cặp đó trong diện tích vùng và trong diện tích admin-1. **Không ép quan hệ cha–con.** Ranh giới admin-1 là ranh giới hiện đại, chỉ là lớp tham chiếu, không phải ranh giới năm 1836.

| Chỉ số | Giá trị |
|---|---|
| Cặp (vùng, admin-1) có ô chung | 4 374 |
| Admin-1 có ô đất | 4 403 / 4 596 |
| Số vùng chứa một admin-1 | 1 vùng: 4 278; 2: 20; 3: 7; 4: 4; ≥5: 3 → **34 admin-1 bị chia** cho nhiều vùng |
| Số admin-1 trong một vùng | 1: 174; 2: 77; 3: 55; 4: 48; ≥5: 308 |
| Vùng có ô nhưng không có admin-1 | 0 |
| Ô vùng không có admin-1 | 0 |
| Ô đất **không thuộc vùng nào** | **2 214 874** |

Phân bổ ô đất không thuộc vùng nào:

- Châu Nam Cực: 2 197 194 ô. Ngoài phạm vi game, chấp nhận được.
- 30 mã quốc gia khác, theo diện tích giảm dần:
  - NOR 13 321 ô (Svalbard);
  - quần đảo Thái Bình Dương: SLB 1 155, NCL 851, VUT 540, PNG 401;
  - ECU 325 (Galápagos);
  - ATF 458, SGS 287;
  - các đảo nhỏ PYF, NZL, KIR, FSM, MNP, PLW, GUM, SYC, HMD, SHN, MHL, COK, AUS, PCN, MDV, NRU, RUS, NFK, BMU, IOT, MUS, UMI.

Chi tiết nằm trong `b3/region_admin1_crosswalk_summary.json` → `land_unassigned_by_adm0`.

## 4. Phát hiện (ghi nhận, **không sửa dữ liệu trong S0**)

| ID | Mức | Phát hiện | Bằng chứng | Đề xuất xử lý |
|---|---|---|---|---|
| GD-F1 | P2 | 5 nguyên thủ có nhãn `supported` nhưng **không có nguồn**: `MCO`, `TUN`, `BRN`, `SUL`, `TAH`. Test `data.test.ts:28` chỉ kiểm dân số `verified`, nên không bắt được trường hợp này | `global_data_audit.json` → `labelled_without_source` | Bổ sung nguồn hoặc hạ nhãn (S1 data contract: quy tắc "nhãn ≥ supported phải có nguồn" cho mọi trường) |
| GD-F2 | P1 | Độ phủ không đồng đều giữa các vùng. Châu Phi hạ Sahara: 84,8 % dân số vùng nhãn `missing`; 51/65 thực thể không có dân số; 50/65 không có nguyên thủ; 0/65 có GDP/người. Đông Á và Nam Á (≈ 58 % dân số thế giới khởi đầu) gần như toàn bộ `uncertain`/`estimated` | §2.2 | Kế hoạch nghiên cứu dữ liệu theo vùng (giai đoạn dữ liệu sau S1). S1 cần contract phân biệt rõ ba loại sourced/estimated/default/missing trong save và UI |
| GD-F3 | P2 | Literacy: 265/274 thực thể dùng giá trị mặc định suy từ luật giáo dục (`init.ts:35`); 0 có nguồn. Army: 242/274 mặc định theo tỉ lệ dân số (`init.ts:171`). GDP/người: 0 có nguồn; 165 `missing` | §2.1 | Ghi nhận cho S1 contract (`default` phải được gắn nhãn) và giai đoạn dữ liệu |
| GD-F4 | P2 | Văn hoá, tôn giáo, địa hình, tài nguyên của vùng; `tech_level`, `government` của thực thể **không có nhãn chất lượng/nguồn**, nên không phân loại được | `not_classifiable` | S1 data contract: mọi trường lịch sử cần trường provenance |
| GD-F5 | P3 | Đất không thuộc vùng nào ngoài Nam Cực: Svalbard và nhiều đảo Thái Bình Dương/Ấn Độ Dương (≈ 17 680 ô). Đảo có người ở năm 1836 (Solomon, New Caledonia, Vanuatu, Galápagos…) không có vùng, nên dân số và chủ sở hữu bị bỏ qua | §3 | Giai đoạn bản đồ/tỉnh: quyết định có thêm vùng đảo hay không |
| GD-F6 | P3 | 34 admin-1 hiện đại bị chia cho 2–5+ vùng do vùng được gán theo khoảng cách khi một admin-1 có nhiều tâm. Đây là thiết kế đã biết, không phải lỗi; crosswalk ghi tỉ lệ diện tích | `region_admin1_crosswalk.csv` | Tham chiếu cho thiết kế tỉnh (H2) |

## 5. Kết luận G0.5 (tự đánh giá, chờ review)

| Tiêu chí (v3.2 §G0.5, v3.3 §3) | Trạng thái | Căn cứ |
|---|---|---|
| Độ phủ theo thực thể | Đạt | 274/274 thực thể, 6 trường × 5 loại |
| Đủ 12 vùng vĩ mô | Đạt | §2.2; 0 thực thể không gán được |
| Crosswalk admin-1 × 662 vùng, không ép cha–con | Đạt | §3; 4 374 cặp, 0 vùng thiếu admin-1 |
| Không nhầm default là sourced | Đạt | Tách `default`/`missing`/`labelled_without_source`; trường không có nhãn được ghi `not_classifiable` |
| **G0.5 tổng** | **PASS (tự đánh giá)** | Gate đánh giá **độ đầy đủ và trung thực của audit**, không phải chất lượng dữ liệu. Các thiếu hụt dữ liệu (GD-F1…F6) là phát hiện cho các giai đoạn sau, không được báo là "đã có nguồn" |

## 6. Tái lập

```bash
git worktree add --detach <tmp>/base 2240a8fb865e0021eec2f2f4f1c6803528be9e2c
(cd <tmp>/base && npm ci && npm run build)
npx tsx tools/audit/s0/global_data_audit.ts <tmp>/base docs/audit/s0/b3/global_data_audit.json
npx tsx tools/audit/s0/admin1_crosswalk.ts <tmp>/base docs/audit/s0/b3/region_admin1_crosswalk.csv docs/audit/s0/b3/region_admin1_crosswalk_summary.json
```
