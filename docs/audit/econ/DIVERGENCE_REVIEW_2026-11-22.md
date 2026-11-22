# Kiểm tra phân hóa giàu nghèo (owner yêu cầu, 2026-11-22)

**Yêu cầu của owner:** "Nên kiểm tra cẩn thận vì sẽ có nhiều nước trong lịch sử và đến bây giờ vẫn thụt lại so với thế giới." Kênh nhập công nghệ (TECH-02) không được làm cả thế giới hội tụ.

## Công cụ
- `tools/divergence-report.ts` so sánh engine với MPD2023 cho 169 nước.
- Vùng trong engine được quy sang nước hiện đại bằng cách chồng lưới bản đồ (`map.bin`) lên lưới admin-1 có mã ISO.
- Dữ liệu `docs/research/data/MPD2023_ALL_BENCHMARK_YEARS.csv` được trích bằng `tools/data/extract_mpd_all.py`; SHA-1 của workbook gốc khớp với nhà xuất bản (CC BY 4.0).
- Chỉ số dùng:
  - tương quan hạng Spearman;
  - độ lệch chuẩn của ln(GDP/người);
  - khoảng cách giữa 20 nước giàu nhất và 20 nước nghèo nhất;
  - GDP/người theo khu vực MPD, so với thế giới.
- Dân số quy đổi theo từng nước nhỏ rất nhiễu, vì vùng của engine ở châu Phi và châu Á rộng. Vì vậy kết luận dựa trên **khu vực**.

## Phát hiện (seed 1, Historical Mode)

1. **TECH-02 nâng các nước đi sau.** Năm 2022, Nam và Đông Nam Á là 0,72 lần mức thế giới khi bật TECH-02 và 0,52 khi tắt; MPD là 0,50. Lo ngại của owner là đúng.
2. **Lỗi lớn hơn có từ trước:** châu Phi hạ Sahara năm 2022 bằng 1,15 lần mức thế giới, cả khi bật lẫn tắt TECH-02; MPD là 0,21. Ba nguyên nhân:
   - **Năng suất là quốc gia.** Vùng bị chiếm nhận ngay năng suất của chính quốc, và mọi tăng trưởng sau đó của chính quốc truyền đủ 100% sang thuộc địa. Ví dụ: Ai Cập chiếm 391 triệu dân hạ Sahara với năng suất ×8.
   - **Không có phi thực dân hóa.** Năm 2022 Pháp vẫn giữ 134 triệu, Bồ Đào Nha 72 triệu dân châu Phi.
   - **Ai Cập bành trướng phi lịch sử.** Trong lịch sử, Ai Cập mất Sudan năm 1885 và bị Anh bảo hộ từ 1882.
3. Dân số hạ Sahara năm 2022 khớp: 1,19 tỷ trong engine so với 1,18 tỷ theo MPD. Nguyên nhân không nằm ở dân số.

## Đã sửa
- **DIV-01, năng suất vùng (`Region.prodRel`):**
  - Chiếm đất không chuyển năng suất; vùng giữ mức hiệu dụng của mình.
  - Vùng hội tụ dần về mức chủ mới, nhanh hơn khi biết chữ nhiều. Vùng thuộc địa hội tụ chậm hơn 5 lần.
  - Thuộc địa chỉ nhận 30% tăng trưởng năng suất của chính quốc.
  - Thuộc địa là vùng ngoài lãnh thổ gốc năm 1836 (chính quốc `_home/_core` với các đế quốc có chính quốc), hoặc vùng chiếm sau này khác họ văn hóa. Nước đa sắc tộc (Thanh, Ấn Độ, Brazil, Nga) không bị coi là thuộc địa của chính mình.
- **DIV-02, cường độ sử dụng công nghệ** (Comin & Mestieri 2018, AEJ: Macro 10(3)):
  - Hiệu ứng sản xuất nhân với `clamp(biết chữ của vùng / 0,6, 0,2, 1)`.
  - Nước dẫn đầu (biết chữ ≥ 0,6) không đổi.
  - Hiệu ứng quân sự, y tế và hành chính không bị nhân.

## Kết quả

| Chỉ số | Trước | Sau | MPD |
|---|---|---|---|
| Scorecard 1913 | 0,199 | **0,132** | |
| Spearman 2022 | 0,18 | **0,30** | 1 |
| Hạ Sahara / thế giới, 2022 | 1,15 | **0,71** | 0,21 |
| Khoảng cách giàu–nghèo, 2022 (ln) | 0,44 | **0,90** | 3,67 |
| Nam và Đông Nam Á / thế giới, 2022 | 0,72 | 0,57 | 0,50 |
| Western Offshoots / thế giới, 2022 | 2,87 | 3,37 | 3,38 |
| Scorecard 2022 (10 nước) | 1,035 | 1,19 (tệ hơn) | |

**Vì sao scorecard 2022 tệ hơn:** trước đây các nước đi sau được nâng sai lệch. Nay lộ ra phần thiếu thật là giai đoạn bứt phá sau 1950 của Đông Á và Brazil: engine cho Trung Quốc ×2,3 trong 1850–2022, MPD là ×22.

## Còn thiếu (đã đưa vào lộ trình)
1. **Phi thực dân hóa (DECOL-01):** trong Historical Mode, mốc độc lập lấy từ nguồn (CG-37); trong Sandbox, chạy theo chủ nghĩa dân tộc.
2. **Bành trướng phi lịch sử** (Ai Cập vào hạ Sahara): kiểm tra AI chiếm đất so với `territoryLog.historicalMatch`.
3. **Bứt phá sau 1950** (Nhật, Hàn, Đài Loan, Trung Quốc sau 1978): cần lan tỏa giáo dục, IND-01 (production methods) và hiệp ước kinh tế.
4. **Hiệp ước kiểu Victoria 3 (DIPLO-TREATY-01),** theo owner: nhập công nghệ qua hiệp ước hai bên cùng chấp nhận (điều khoản chia sẻ tri thức), cùng thương mại và đầu tư.
