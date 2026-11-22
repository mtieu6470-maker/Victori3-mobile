# CATCHUP-01 — so sánh A/B cùng seed (MSG-054 R5)

**Lệnh:** `npx tsx tools/growth-report.ts <seed> 2022 [--no-catchup] --json docs/audit/econ/CATCHUP_ABLATION_seed<seed>_<on|off>_2026-11-22.json`

`--no-catchup` khôi phục quy tắc trước CATCHUP: chi phí công nghệ × (1 − 0.55 × √share, trong đó share có trọng số bằng nhau giữa các nước), và bỏ lực noi theo cải cách. Mọi thứ khác giữ nguyên.

| Seed | Sai số log trung bình 2022 — ON | OFF | Nhóm công nghiệp hóa ON / OFF |
|---|---|---|---|
| 1 | 1.328 | 1.341 | 0.712 / 0.709 |
| 2 | 1.342 | 1.348 | 0.710 / 0.709 |

**Tác động theo nước** (tỷ lệ GDP/người năm 2022 bật so với tắt; cả hai seed):
- Nhật ×1.25 và ×1.19. Đây là nước mở cửa và có dân trí sau Minh Trị, nên được hưởng lợi thế bắt chước có điều kiện.
- Nga ×0.94 ở cả hai seed; Thổ ×0.87 và ×0.98; Brazil ×0.91 và ×1.00. Đây là các nước có khả năng hấp thụ thấp, nên quy tắc mới **không** cho họ chiết khấu như quy tắc cũ.
- Anh, Pháp, Phổ, Mỹ nằm trong khoảng ±1% năm 2022.

**Kết luận của Project Director:**
1. CATCHUP-01 bản sửa **không phải buff**. Lợi thế chỉ đến với nước tự tạo điều kiện (mở cửa, dân trí), đúng chỉ thị owner.
2. CATCHUP-01 **không phải đòn bẩy** của sai số dài hạn. Phần lệch sau 1950 là cấu trúc: hàng hóa hiện đại (IND-01/ECON-GOODS-01), phổ cập giáo dục, phi thực dân hóa, công ty và độc quyền (CO-01).
3. **Chấp nhận tích hợp:** review R1–R4 đã đóng; R5 (hiệu chỉnh vĩ mô) không phải tiêu chí chấp nhận riêng của subsystem này. Hệ số CATCHUP giữ nguyên và không chỉnh theo scorecard tổng.
