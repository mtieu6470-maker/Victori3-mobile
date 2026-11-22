# Chỉ thị owner — tham chiếu thiết kế: Victoria 3 + mod kéo dài tới hiện đại (2026-11-22)

**Lời owner:** "Ô cứ làm theo victori 3 bản mod đến hiện đại ấy là đc."

## Diễn giải của Project Director (Claude)

- Tham chiếu là **cấu trúc và cơ chế** của Victoria 3, cộng với kiểu mở rộng mà các mod "tới hiện đại" thường làm cho giai đoạn 1936–2026:
  - các kỷ nguyên công nghệ nối tiếp nhau tới thế kỷ 21;
  - phương thức sản xuất có thể nâng cấp theo công nghệ;
  - hàng hóa và ngành mới xuất hiện theo thời kỳ (điện, ô tô, hóa dầu, điện tử, dịch vụ số);
  - nhân khẩu học hiện đại, kèm chính trị và thể chế hiện đại.
- **Không sao chép** mã, dữ liệu, tên, văn bản, hình ảnh hay âm thanh của Victoria 3 hoặc bất kỳ mod nào. Mọi nội dung là của dự án và có nguồn lịch sử (CG-xx).
- Thứ tự ưu tiên giữ nguyên: mô phỏng có nguồn và có kiểm thử trước, nội dung và media sau.

## Hệ quả cho kế hoạch

- **TECH-01:** cây công nghệ phủ 1836–2026, đã làm ở lát đầu (130 công nghệ).
- **IND-01:** phương thức sản xuất. Hiện mỗi công trình có một công thức cố định; cần nhiều công thức theo công nghệ.
- **ECON-GOODS-01:** mở rộng danh mục hàng hóa theo thời kỳ. Hiện có 12 hàng hóa của thế kỷ 19.
- **DEMO-01:** chuyển đổi nhân khẩu học tới hiện đại.
- **POL-MOD-01:** hệ tư tưởng, đảng phái và thể chế thế kỷ 20–21.

## Bổ sung — chế độ Lịch sử (2026-11-22)

**Lời owner:** "Ở chế độ history tham khảo victori 3 với lịch sử thế giới để điều chỉnh cho phù hợp nhé."

**Diễn giải:**
- **Mục tiêu hiệu chỉnh** của Historical Mode là lịch sử thế giới có nguồn: MPD2023 (GDP), UN/HYDE (dân số), CG-xx (công nghệ, sự kiện, thể chế). Mọi tham số đều đo bằng scorecard (`tools/growth-report.ts`, `tools/longrun-report.ts`) với sai số được ghi lại.
- **Cơ chế dẫn dắt** tham khảo cách Victoria 3 làm:
  - các bước ngoặt có khung thời gian và điều kiện (decision windows, như Kanagawa và Minh Trị);
  - AI nghiêng về lựa chọn lịch sử, nhưng có xác suất và không áp kết quả;
  - luật đã có sự kiện lịch sử quản lý thì để dành cho sự kiện đó (`lawReservedByHistory`).
- Sandbox Mode dùng cùng engine nhưng không có lớp dẫn dắt lịch sử.
