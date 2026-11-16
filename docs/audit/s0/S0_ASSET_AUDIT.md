# S0_ASSET_AUDIT — S0-B3 (G0.8)

| Trường | Giá trị |
|---|---|
| Task | S0-B3 (OD-20261116-11) |
| Mã được kiểm | Baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`. Bản build `npm run build` trong worktree tạm sạch; mã và asset **không sửa** |
| Công cụ | `tools/audit/s0/asset_inventory.ts` (chỉ đọc; nằm ngoài mã sản phẩm) |
| Lệnh | `npx tsx tools/audit/s0/asset_inventory.ts <worktree baseline đã build> <android-template của @capacitor/cli 7.6.10, giải nén> docs/audit/s0/b3/asset_manifest.csv docs/audit/s0/b3/asset_inventory_summary.json` → exit 0 (`b3/logs/b3_asset_inventory.log`) |
| Manifest checksum | `docs/audit/s0/b3/asset_manifest.csv`: 627 dòng dữ liệu, SHA-256 `71c2f8f8722f6c634675007afdc0e5b469fa42d0528493cd90bc8b593cca8c94` |
| Tóm tắt máy đọc | `docs/audit/s0/b3/asset_inventory_summary.json`, SHA-256 `9e01409e4b5cb0be8cf7be8bb8c0d74eed64fcdf04572a5029642ec83fd4f015` |
| Nhãn | `BASELINE_ORIGINAL` (mã, asset và build không đổi) |
| Người lập | Claude Code, 2026-11-16 (tự đánh giá, **chưa được review độc lập**) |

## 1. Phạm vi và cột của manifest

Manifest liệt kê **mọi tệp** trong ba phạm vi:

| Phạm vi | Số tệp | Nội dung |
|---|---|---|
| `web_payload` | 590 | Toàn bộ `dist/`: phần web được Capacitor chép vào `assets/public` của APK |
| `android_res` | 35 | `android/app/src/main/res/**`: icon launcher, splash, tài nguyên giá trị |
| `build_input_not_shipped` | 2 | `assets/map/admin1_grid.bin.gz`, `admin1_meta.json` (đầu vào build bản đồ, không ship) |

Cột của manifest:

- `sha256`, `bytes`, `category`;
- `origin`: tệp được tạo ra thế nào;
- `source`: URL nguồn;
- `author`: tác giả và ghi công;
- `license`: giấy phép theo bản ghi hiện có;
- `licence_status`: trạng thái giấy phép (bảng §3);
- `period_from`/`period_to`: hiệu lực thời gian;
- `verification`: nhãn chất lượng trong registry;
- `registry_entries`: các bản ghi registry dùng tệp;
- `note`.

**Đối chiếu với APK baseline:** so với `inputs/APK_BASELINE_WEB_ASSETS_SHA256.csv` (592 tệp `assets/public` của APK baseline, S0-A):

- **587/590** tệp `dist/` trùng SHA-256.
- 3 tệp khác đúng như nhóm khác biệt đã giải thích ở S0-A/B1: `content/registry.json` (dấu thời gian `generated`), `index.html` (tên bundle) và bundle JS (`built_at` → tên `index-*.js` khác).
- APK có thêm `cordova.js` và `cordova_plugins.js` do `cap sync` sinh ra.

Vì vậy manifest này mô tả đúng nội dung asset của APK baseline, trừ các trường thời điểm build.

## 2. Thành phần payload web

| Nhóm | Tệp | Nguồn gốc | Giấy phép theo bản ghi |
|---|---|---|---|
| Quốc kỳ (`content/identity/flags`) | 176 | Wikimedia Commons, chuyển WebP (`tools/etl/fetch_identity.py`) | Ghi theo từng tệp trong `registry.json` |
| Huy hiệu (`content/identity/arms`) | 99 | như trên | như trên |
| Chân dung (`content/portraits`) | 217 tệp / 227 bản ghi | Wikimedia Commons (`tools/etl/fetch_portraits.py`) | như trên |
| `content/registry.json` | 1 | `tools/build-content.ts` | Hỗn hợp: dữ liệu dự án; đoạn trích Wikipedia CC BY-SA 4.0 (796 đoạn); liên kết Wikidata CC0 |
| Font (`assets/*.woff`, `*.woff2`) | 84 | `@fontsource/eb-garamond@5.3.0`, `@fontsource/source-sans-3@5.3.1` | OFL-1.1 (trường `license` và tệp `LICENSE` của package) |
| Bundle JS/CSS | 2 | Mã dự án + Preact 10.29.8 (MIT) + `@capacitor/core` 7.6.10 (MIT) | Mã dự án: **không có tệp LICENSE trong repository** |
| Bản đồ nền (`map/terrain.jpg`, `relief.jpg`, `lakes.json`, `rivers.json`) | 4 | Natural Earth qua `tools/etl/make_terrain.py`, `make_relief.py`, `prepare_map_sources.ts` | Public domain |
| Bản đồ sinh (`generated/map.bin`, `borders.json`, `coastdist.png`) | 3 | `tools/build-map.ts` từ admin-1 Natural Earth + vùng trong `db.json` | Dẫn xuất từ dữ liệu public domain |
| Vỏ ứng dụng (`index.html`, `icon.svg`, `manifest.webmanifest`, `sw.js`) | 4 | Dự án tự viết (lịch sử git) | Mã dự án |

**Tổng payload web:** 17 764 559 byte.

**Liên kết registry ↔ tệp:**

- Mọi đường dẫn trong registry đều có tệp trong `dist/`; không có tệp `content/` nào nằm ngoài registry (`orphan_content_files = []`).
- `bytes` trong registry khớp kích thước thật cho cả 502 bản ghi.
- 10 tệp chân dung được dùng chung bởi 2 bản ghi (cùng một người ở hai thực thể). Danh sách nằm trong `registry_files_shared_by_several_records`.

### 2.1. Giấy phép tài sản hình ảnh (502 bản ghi registry)

| Giấy phép ghi nhận | Bản ghi |
|---|---|
| Public domain | 384 |
| CC BY-SA 4.0 | 54 |
| CC BY-SA 3.0 | 34 |
| CC BY 3.0 | 10 |
| CC BY-SA 2.5 | 9 |
| CC0 | 6 |
| CC BY 2.5 | 2 |
| CC BY 4.0 | 2 |
| CC BY 2.0 | 1 |

**Nhãn chất lượng:**

- `uncertain` 259: thời kỳ hiệu lực được suy ra từ tuổi thọ chính thể.
- `supported` 243.

**Hiệu lực thời gian:**

- Quốc kỳ/huy hiệu: 273/275 có `period.from`. Hai bản ghi chỉ có `to` (`coat_of_arms.POL_CONGRESS.0`, `flag.ROM.0`). 13 bản ghi để mở `to`.
- Chân dung: **cả 227 bản ghi có `period = {from: null, to: null}`**. Hiệu lực thời gian của chân dung chỉ đi qua liên kết nhân vật; 199/227 có trường `date`.

## 3. Trạng thái giấy phép (`licence_status`)

| Trạng thái | Tệp | Ý nghĩa |
|---|---|---|
| `recorded_not_reverified` | 492 | Giấy phép, tác giả và nguồn được ghi từ metadata Commons lúc tải. **S0 không xác minh lại trên Commons.** Không coi là đã xác minh |
| `package_license_file` | 84 | Font OFL-1.1; trường `license` và tệp `LICENSE` có trong `node_modules`. Không kiểm việc tệp WOFF/WOFF2 có mang theo thông báo OFL |
| `project_authored_plus_packages` | 2 | Bundle JS/CSS: mã dự án + Preact/Capacitor core (MIT) |
| `project_authored` | 5 | Vỏ ứng dụng (4) + `res/values/strings.xml` |
| `public_domain_dataset` | 6 | Natural Earth (4 tệp `map/` + 2 đầu vào không ship) |
| `derived` | 4 | `registry.json` + 3 tệp bản đồ sinh |
| `template_default` | 34 | Tài nguyên Android **trùng từng byte** với template `android-template.tar.gz` của `@capacitor/cli@7.6.10` (MIT) |
| `unknown` | 0 | — |

## 4. Phát hiện (ghi nhận, **không sửa asset/nội dung trong S0**)

| ID | Mức | Phát hiện | Bằng chứng | Đề xuất xử lý |
|---|---|---|---|---|
| AS-F1 | P1 (điều kiện ngoại lệ S1) | 492 tệp hình ảnh mang giấy phép **theo bản ghi**, chưa xác minh lại. Đây là phần "license cũ chưa xác minh" mà v3.3 §4 cho phép xin ngoại lệ **chỉ cho S1**, với điều kiện S1 không thêm, thay, phân phối hoặc sửa asset/văn bản | `asset_manifest.csv` cột `licence_status` | Task xác minh giấy phép riêng (đối chiếu trang Commons theo `source`) trước giai đoạn nội dung |
| AS-F2 | P2 | 4 bản ghi CC BY/CC BY-SA **không có `author`**: `coat_of_arms.NAS.0`, `coat_of_arms.AKO.0` (CC BY 3.0, `credit` = "Own work"); `coat_of_arms.TUS.0` (CC BY-SA 4.0); `coat_of_arms.BUL.0` (CC BY-SA 3.0, không có cả `credit`). `AssetCredit` chỉ hiển thị `author`, không hiển thị `credit` (`src/ui/components/identity.tsx:15`); tooltip thay bằng "Wikimedia Commons" (`identity.tsx:31`). Các giấy phép BY yêu cầu ghi tên tác giả, nên ghi công trong UI cho 4 tài sản này **không đủ** | `registry.json` | Bổ sung tác giả từ trang Commons và hiển thị `credit` (giai đoạn nội dung/licensing) |
| AS-F3 | P2 | Văn bản CC BY-SA 4.0 (407 đoạn của thực thể, 389 của nhân vật): dữ liệu có đủ `url`, `revid`, `license`, `license_url`, `author`. Dòng nguồn trong UI (`identity.tsx:49`) có: liên kết bài viết, số bản sửa, tên giấy phép, dấu "(rút gọn)". Dòng này **không liên kết `license_url`** và không ghi tác giả; tác giả ("cộng đồng Wikipedia") chỉ có trong ghi chú gói nội dung ở màn hình World (`src/ui/screens/World.tsx:92`). Đây là đánh giá **tĩnh**; hiển thị runtime trên UI **chưa kiểm** (`NOT_TESTED`) | mã UI; `registry.json` | Thêm liên kết giấy phép và ghi tác giả vào dòng nguồn (giai đoạn nội dung/licensing) |
| AS-F4 | P2 | Icon launcher và splash của APK là **placeholder mặc định của Capacitor**: 34/35 tệp `res/` trùng từng byte với template của `@capacitor/cli@7.6.10`; chỉ `values/strings.xml` do dự án sửa. Giấy phép (MIT) không có vấn đề, nhưng đây là `Placeholder` về sản phẩm | `asset_manifest.csv` `scope=android_res` | Thiết kế icon/splash (giai đoạn release/branding) |
| AS-F5 | P3 | Không có tệp LICENSE hoặc NOTICE trong repository và trong payload. Bundle JS không còn chú thích giấy phép nào: 0 lần xuất hiện `@license`, `Copyright` hoặc `MIT`. Preact và Capacitor core (MIT) yêu cầu kèm thông báo bản quyền khi phân phối. Font OFL-1.1 cũng yêu cầu kèm giấy phép | `grep` trên `dist/assets/index-*.js` | Thêm màn hình hoặc tệp "giấy phép bên thứ ba" (giai đoạn release) |
| AS-F6 | P3 | Natural Earth được tải từ nhánh `master` của `nvkelso/natural-earth-vector` và từ CDN, **không ghim phiên bản và không có checksum** (`tools/etl/fetch_natural_earth.sh:7–15`). Đầu vào đã commit (`assets/map/*`) có checksum trong manifest, nhưng không tái lập được nguồn gốc theo phiên bản | mã ETL | Ghim phiên bản/commit và lưu checksum nguồn (giai đoạn dữ liệu bản đồ) |
| AS-F7 | P3 | Cả 227 chân dung không có hiệu lực thời gian riêng (`period` null). Kiểm tra "không hiển thị ngoài thời kỳ" (`tests/content.test.ts:34`) chỉ áp dụng cho quốc kỳ/huy hiệu | `registry.json` | Ghi nhận cho giai đoạn nhân vật/nội dung |

Không phát hiện tệp payload nào **không rõ nguồn gốc**. Mọi tệp đều thuộc một nhóm có nguồn gốc xác định ở §2.

## 5. Kết luận G0.8 (tự đánh giá, chờ review)

| Thành phần | Trạng thái | Căn cứ |
|---|---|---|
| Inventory + checksum | **PASS** | 627 tệp, mỗi tệp có SHA-256, kích thước, nguồn gốc và trạng thái giấy phép. Khớp payload APK baseline (587/590; 3 khác biệt đã giải thích) |
| Giấy phép đầy đủ, đã xác minh | **PARTIAL** | 492 tệp giấy phép chỉ theo bản ghi (AS-F1); 4 tài sản BY thiếu tác giả (AS-F2); thiếu thông báo bên thứ ba (AS-F5) |
| Ghi công CC BY-SA cho từng đoạn văn bản hiển thị đúng (G-a) | **PARTIAL** (tĩnh) / runtime `NOT_TESTED` | Dữ liệu đủ; UI thiếu liên kết giấy phép và tác giả trên dòng nguồn (AS-F3) |
| **G0.8 tổng** | **PARTIAL** | Không đổi thành PASS. Thuộc loại ngoại lệ S1 mà v3.3 §4 cho phép xin; ngoại lệ chỉ có hiệu lực khi được ghi trong `S0_SIGNOFF.md` (B7) và reviewer xác minh |

## 6. Tái lập

```bash
git worktree add --detach <tmp>/base 2240a8fb865e0021eec2f2f4f1c6803528be9e2c
(cd <tmp>/base && npm ci && npm run build)
mkdir <tmp>/captpl && tar -xzf <tmp>/base/node_modules/@capacitor/cli/assets/android-template.tar.gz -C <tmp>/captpl
npx tsx tools/audit/s0/asset_inventory.ts <tmp>/base <tmp>/captpl docs/audit/s0/b3/asset_manifest.csv docs/audit/s0/b3/asset_inventory_summary.json
```
