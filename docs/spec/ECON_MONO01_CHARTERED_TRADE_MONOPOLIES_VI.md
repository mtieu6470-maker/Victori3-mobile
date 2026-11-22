# ECON-MONO-01 — Công ty độc quyền thương mại và giá theo cung cầu (đặc tả, 2026-11-22)

**Căn cứ:**
- Owner 2026-11-22: "còn phải tính tới chuyện cty độc quyền thương mại nữa, với chưa kể sản phẩm dùng rộng rãi thì giá cả sẽ phụ thuộc vào cung cầu".
- Scorecard: Ấn Độ (EIC) tăng quá nhanh so với MPD2023. Một phần lý do là engine coi mọi giá trị sản xuất ở thuộc địa là thu nhập tại chỗ, trong khi thực tế độc quyền và cống nạp chuyển một phần giá trị về chính quốc.

## 1. Giá theo cung cầu (đã có, giữ nguyên)

- Mỗi thị trường tính giá cục bộ từ cung và cầu: `clamp(sqrt((cầu+1)/(cung sẵn có+1)), 0.45, 3)`.
- Giá được trộn với giá thế giới theo độ mở thương mại của từng mặt hàng (ECON-03a, CG-21).
- Giá thế giới đi theo cân bằng cung cầu toàn cầu.
- Hàng dùng rộng rãi (lương thực, vải, than) vì vậy đã có giá do cung cầu quyết định. Độc quyền là ngoại lệ **bóp méo** cơ chế này.

## 2. Mô hình độc quyền (mới)

Mỗi độc quyền là một bản ghi dữ liệu có nguồn:

```
{ id, company, metropole, markets/regions, goods[], start, end, procurementShare, consumerMarkup, basis, sources[] }
```

- **Thu mua dưới giá thị trường:** người sản xuất trong vùng độc quyền chỉ nhận `procurementShare × giá` cho các mặt hàng đó, ví dụ thuốc phiện Bengal hay cây trồng bắt buộc ở Java. Phần chênh là **địa tô độc quyền**.
- **Chuyển về chính quốc:** địa tô không vào tiền lương hay GDP địa phương. Nó cộng vào ngân khố hoặc quỹ đầu tư của chính quốc. Đây là "drain", có tranh luận học thuật, nên hệ số phải lấy từ nguồn.
- **Kênh thương mại độc quyền:** xuất khẩu mặt hàng đó chỉ đi qua thị trường chính quốc. Độ mở thương mại với nước khác bằng 0 cho các mặt hàng này.
- **Đội giá tiêu dùng:** với độc quyền bán lẻ (ví dụ muối), giá tiêu dùng trong vùng được nhân `consumerMarkup`. Cầu giảm theo giá.
- **Kết thúc:** theo ngày lịch sử trong Historical Mode (decision window hoặc thay đổi lịch sử). Trong Sandbox, độc quyền có thể bị bãi bỏ khi chính quốc chuyển sang tự do kinh tế hoặc tự do thương mại, khi thuộc địa độc lập, hoặc khi chiến tranh thay đổi chủ quyền.
- **Không buff hay phạt nước nào một cách tùy tiện.** Mọi tham số lấy từ nguồn CG-30. Nếu chưa có nguồn, độc quyền không được bật.

## 3. Kiểm thử và chấp nhận

- **Sổ cái bảo toàn:** địa tô thu ở thuộc địa đúng bằng khoản cộng vào chính quốc.
- Thị trường không có độc quyền thì kết quả giống hệt trước.
- Scorecard: Ấn Độ 1850–1913 giảm sai số và không làm xấu Anh. Đo bằng `tools/growth-report.ts`.
- Save: thêm trạng thái độc quyền đang hiệu lực (schema/contract), có migration.

## 4. Dữ liệu cần (CG-30)

Các ứng viên 1836+:
- EIC: độc quyền thuốc phiện và muối ở Bengal; mất độc quyền chè Trung Quốc năm 1833; chuyển sang Raj năm 1858.
- Hệ thống Canh tác Java (Cultuurstelsel) và Hội Thương mại Hà Lan (NHM), 1830–1870; batig slot là khoản thặng dư chuyển về Hà Lan.
- Hudson's Bay Company (đến 1870).
- Công ty Nga–Mỹ (đến 1867).
- Royal Niger Company (1886–1900).
- Nhà nước Tự do Congo và các nhượng địa (1885–1908).
- Các độc quyền nhà nước (muối, thuốc lá) nếu liên quan.

Mỗi mục cần: thời gian, phạm vi, mặt hàng, quy mô doanh thu và lợi nhuận, và tỷ lệ chuyển về chính quốc, ghi rõ mức tranh luận học thuật.
