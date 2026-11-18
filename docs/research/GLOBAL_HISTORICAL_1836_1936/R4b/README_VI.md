# R4b — Global Historical Mode Research Batch 02

**Phạm vi:** toàn thế giới; 15 polity nghiên cứu sâu, campaign 1836–1936  
**Base SHA:** `e5dead90d15cab772a8a0fa00ee76f76e4d08916`  
**Trạng thái:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`

R4b tiếp tục công việc toàn cầu sau R4a, ưu tiên các profile 1836 chưa có succession array tại Trung Á, Tây Á, Nam Á, Đông Á, Đông Nam Á, Bắc Phi và châu Phi. Phần nghiên cứu tách người cai trị chính thức, người thực thi quyền lực, nhiếp chính, người tuyên bố kế vị và quyền lực bảo hộ/thuộc địa.

## Artifacts

- [Báo cáo R4b — succession and authority audit](R4b_GLOBAL_SUCCESSION_AND_AUTHORITY_AUDIT_VI.md)
- [Ma trận chứng cứ 15 polity](R4b_SOURCE_EVIDENCE_MATRIX.csv)
- [25 quyết định nghiên cứu không thực thi](R4b_PATCH_DECISIONS.csv)
- [18 yêu cầu chứng cứ còn mở](R4b_OPEN_EVIDENCE_REQUESTS.csv)
- [Registry delta 33 nguồn](R4b_SOURCE_REGISTRY_DELTA.csv)
- [Yêu cầu Claude kiểm tra độc lập](../../../audit/s0/GLOBAL_R4B_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)
- [Biên nhận GitHub](GITHUB_INTEGRATION_RECEIPT_R4b.md)

## Polities trong tranche này

KHI Khiva; BUK Bukhara; HER Herat; NAJ Nejd; TUN Tunis; NAG Nagpur; AWA Awadh; GWA Gwalior; HOL Indore; TIB Tibet; RYU Ryukyu; BRN Brunei; ACE Aceh; MER Madagascar; NDE Ndebele.

## Findings cần chú ý

- **KHI/BUK:** source scope của profile dùng `levi_2017` (nghiên cứu về Kokand) cần xem lại khi dùng cho Khiva/Bukhara.
- **HER:** Kamran Shah và vizier Yar Muhammad là hai vai trò; Yar Muhammad phế truất Kamran năm 1842.
- **NAJ:** Faisal bin Turki có triều đại thứ nhất kết thúc khi bị Ai Cập bắt năm 1838, quay lại năm 1843; giữa hai giai đoạn có occupation/interregnum.
- **NAG:** Raghoji III mất 11/12/1853 nhưng Commissioner của Anh bắt đầu tiếp quản 13/3/1854; tách ruler death và annexation.
- **GWA/HOL:** regent, người được nhận làm heir, quyền lựa chọn successor của British Resident/Government là những sự kiện khác nhau.
- **TIB:** Dalai Lama và Regent cùng tồn tại; quyền lực thực tế thay đổi theo tuổi và việc trao seals; lịch Tây Tạng khiến quy đổi ngày Gregorian không chắc chắn.
- **BRN:** accession, assumption of title và coronation có thể cách nhau nhiều năm.
- **ACE:** profile 1836 có dấu hiệu không khớp với nguồn Acehnese genealogy: Sultan Muhammad/Ala’ad-Din Muhammad Shah chết năm 1836, con trai Sulayman/Ali Iskandar Shah và chú Tuanku Ibrahim cùng mang danh Sultan trong nội chiến.
- **MER:** Nữ hoàng và Rainilaiarivony (Prime Minister/effective ruler) là hai chuỗi office khác nhau.
- **NDE:** Mzilikazi mất 1868, regency và tranh chấp Nkulumane/Lobengula kéo dài tới 1870.

R4b không thay đổi bất kỳ dữ liệu runtime nào. 15 dossiers không có nghĩa là 15 chuỗi đã được chấp thuận, và 18 yêu cầu mở vẫn cần đóng bằng nguồn phù hợp.

## Guardrails

No changes to `historical_data/`, country profiles, political registry, source runtime, schema, engine, events, tests, save format, assets, Android, Gradle, workflows, signing or APK. No test/build/APK workflow run. All proposed data corrections remain pending Claude independent review and a separate owner gate.
