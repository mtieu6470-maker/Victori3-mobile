# R4e — Hồ sơ hai thực thể tập thể còn lại trong hàng đợi succession toàn cầu

**Phạm vi:** MAO (United Tribes of New Zealand) và MLY (Malay sultanates aggregate)  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `103ab66b227809fae358e082fa253c0e50a1f78c`  
**Ngày:** 18/11/2026  
**Trạng thái:** `DOCUMENTATION_ONLY / SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

R4e đóng hồ sơ nghiên cứu cho hai mục cuối của hàng đợi 54 profile ban đầu. Đây **không phải hai cá nhân bị thiếu tên trong danh sách vua**: MAO là liên minh các rangatira với quyền lực tập thể; MLY là một aggregate gameplay gộp nhiều chính thể độc lập.

## Tài liệu

- [Báo cáo nghiên cứu R4e](R4e_COLLECTIVE_POLITIES_AUDIT_VI.md)
- [Ma trận chứng cứ 2 thực thể](R4e_SOURCE_EVIDENCE_MATRIX.csv)
- [19 quyết định nghiên cứu không thực thi](R4e_PATCH_DECISIONS.csv)
- [12 yêu cầu chứng cứ còn mở](R4e_OPEN_EVIDENCE_REQUESTS.csv)
- [Registry 20 nguồn và giới hạn kiểm tra](R4e_SOURCE_REGISTRY_DELTA.csv)
- [Yêu cầu Claude review độc lập](../../../audit/s0/GLOBAL_R4E_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)
- [Biên nhận tích hợp GitHub](GITHUB_INTEGRATION_RECEIPT_R4e.md)

## Kết luận chính

- **MAO:** giữ mô hình quyền lực tập thể; không tạo một vua, tổng thống hay chuỗi succession cá nhân. Ngày 06/02/1840 là một chuyển tiếp hiệp ước/diễn giải quyền lực phức tạp, không được dùng như bằng chứng rằng mọi iwi/hapū Māori chấm dứt hoặc toàn bộ rangatiratanga biến mất.
- **MLY:** giữ là container/aggregate gameplay cho đến khi có mô hình constituent polity. Perak, Selangor, Negeri Sembilan, Pahang và Johor không dùng chung một HOS. FMS chỉ hình thành 1895/1896, không thể gán ngược cho 1836; Johor vẫn ở ngoài FMS. Kedah, Kelantan, Terengganu và Perlis có các trạng thái Siamese/local khác nhau, không đồng nghĩa tất cả bị trực tiếp quản trị từ Bangkok.

## Hàng rào

Không thay đổi `historical_data/`, registry, succession arrays, code engine, schema, events, tests, assets, map, save, Android, Gradle, workflow, signing hoặc APK. Không có build/test/APK workflow nào được chạy. Mọi candidate data/model correction còn chờ Claude review và owner authorization riêng. R4e research dossier coverage không đồng nghĩa với dữ liệu runtime đã sẵn sàng.
