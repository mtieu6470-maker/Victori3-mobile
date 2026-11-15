# Dòng chảy Lịch sử — đại chiến lược 1836 cho điện thoại

Trò chơi đại chiến lược lấy bối cảnh thế giới năm 1836, chạy hoàn toàn offline. Hai chế độ dùng chung một engine mô phỏng:
**Lịch sử** (dữ liệu có nguồn, xu hướng và cửa sổ quyết định lịch sử, không ép lịch sử) và **Sandbox – Lịch sử thay thế**, cùng chế độ **Quan sát**.

## Chạy và xây dựng

```bash
npm ci
npm run dev            # dựng dữ liệu + bản đồ rồi mở máy chủ phát triển (http://localhost:5173)
npm run build          # dữ liệu + bản đồ + kiểm tra kiểu + bản web tĩnh trong dist/
npm test               # kiểm thử dữ liệu, mô phỏng hai chế độ, nhãn bản đồ, số liệu thị trường
npx tsx tools/ui-screenshots.ts   # chụp màn hình ứng dụng thật ở kích thước điện thoại (sau khi build)
npx tsx tools/ui-shots.ts <thư mục> L|P "<tham số>" plan.json   # chụp nhiều trạng thái trong một lần tải
```

Trạng thái kiểm thử QA có thể mở bằng tham số URL, ví dụ
`?mode=historical&seed=1&player=GBR&months=108&screen=economy&tab=market`.

## Android

Bản Android đóng gói bản web bằng Capacitor (`android/`). Workflow `.github/workflows/android-apk.yml` tự build **APK debug** trên GitHub Actions
cho mỗi lần push và đính kèm vào mục Artifacts của lần chạy. APK debug được ký bằng khóa debug do Gradle tự tạo — không có khóa ký nào trong repository.
Build cục bộ (cần Android SDK + JDK 21): `npm run build && npx cap sync android && cd android && ./gradlew assembleDebug`.

## Cấu trúc
- `src/engine/` — engine mô phỏng (kinh tế, dân số, chính trị, ngoại giao, quân sự, công nghệ, AI tự trị, lớp lịch sử).
- `historical_data/` — Cơ sở dữ liệu Lịch sử 1836 (nguồn, nhãn chất lượng); `tools/build-data.ts` biên dịch sang `src/generated/`.
- `src/ui/` — giao diện (Preact + WebGL): bản đồ atlas, hệ thống cửa sổ, các module quản trị.
- `docs/ui/` — hệ thống thiết kế v2, điều hướng, đặc tả màn hình, quy tắc tương tác, ảnh trước/sau (`V2_BEFORE_AFTER.md`).
- `docs/research/PASS16_REPO_AUDIT.md` — đối chiếu repository với ma trận tính năng của gói nghiên cứu Pass 16 (có/một phần/chưa có, kèm đường dẫn bằng chứng).

## Bản đồ
Nguồn địa lý là Natural Earth (phạm vi công cộng): ranh giới cấp 1 tỷ lệ 1:10m, hồ, sông và ảnh nổi địa hình 1:50m. `tools/etl/fetch_natural_earth.sh` tải nguồn vào bộ đệm (không commit), `tools/etl/prepare_map_sources.ts` và `tools/etl/make_relief.py` tạo các tệp đã commit trong `assets/map/` và `public/map/`; `tools/build-map.ts` dựng lưới vùng 8192×3868, biên giới vector và trường khoảng cách bờ biển khi build — CI không cần tải gì thêm. Ranh giới hành chính hiện đại được dùng làm xấp xỉ cho địa lý năm 1836.

## Bản quyền tài sản
Phông EB Garamond và Source Sans 3 (SIL OFL 1.1). Dữ liệu địa lý (ranh giới, sông, hồ, địa hình nổi): Natural Earth (phạm vi công cộng). Biểu tượng, bản đồ và giao diện do dự án tự thiết kế; không dùng tài sản của trò chơi thương mại nào.
