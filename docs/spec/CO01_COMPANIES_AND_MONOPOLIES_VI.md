# CO-01 — Hệ thống công ty, hiến chương và độc quyền (đặc tả, 2026-11-22)

**Căn cứ:**
- Owner 2026-11-22: "nên suy nghĩ tới vấn đề công ty, rồi độc quyền thương mại nữa".
- Tham chiếu cấu trúc: Victoria 3 có công ty, trụ sở, hiến chương và độc quyền. Dự án chỉ lấy cơ chế, không sao chép tên, số liệu hay văn bản.
- Đặc tả này mở rộng `ECON_MONO01_CHARTERED_TRADE_MONOPOLIES_VI.md` (độc quyền có hiến chương) và thay thế mục IND-03 (sở hữu, cổ tức).

## 1. Công ty là chủ thể kinh tế

```
Company { id, name, kind: 'private'|'chartered'|'state', home: countryId, hq: regionId,
          sectors: Building[], ownedSites: siteKey[], capital, cash, debt,
          charter?: Charter, founded: tick, dissolved?: tick, historicalId? }
```

- **Sở hữu công trình:** mỗi site (IND-02a) có chủ sở hữu là công ty, nhà nước hoặc tư nhân phân tán. Lợi nhuận của site chảy về chủ, thay cho việc chỉ cộng vào quỹ đầu tư chung.
- **Đầu tư:** công ty tái đầu tư vào ngành của mình (thay một phần `privateInvestment`). Quy mô bị giới hạn bởi tiền mặt, vay nợ và lãi suất (liên quan FIN-01).
- **Cổ tức:** trả cho tầng lớp sở hữu (capitalists/aristocrats). Thu nhập này tác động đến mức sống và chính trị các nhóm lợi ích (POL-01).
- **Vòng đời:** thành lập khi ngành có lợi nhuận và luật cho phép (ngân hàng cổ phần, luật công ty). Phá sản khi lỗ kéo dài và không trả được nợ. Có thể sáp nhập.
- **Historical Mode:** công ty lịch sử có nguồn (CG-31) xuất hiện theo ngày và điều kiện, ví dụ công ty đường sắt, thép, dầu mỏ, hóa chất, điện. Không ép kết quả kinh doanh.
- **Sandbox Mode:** công ty được tạo theo quy luật chung, tên do engine sinh ra.

## 2. Hiến chương

| Loại hiến chương | Tác động | Ví dụ lịch sử (cần nguồn CG-30/31) |
|---|---|---|
| Độc quyền thương mại | kênh xuất khẩu độc quyền cho mặt hàng/lãnh thổ; thu mua dưới giá; địa tô chuyển về chính quốc | Hudson's Bay Company, các độc quyền thuốc phiện/muối ở Ấn Độ |
| Quản trị lãnh thổ | công ty cai trị thuộc địa (thuế, quân đội riêng) | EIC trước 1858, Royal Niger Company, British South Africa Company |
| Canh tác cưỡng bức hoặc nhượng địa | sản lượng bắt buộc, công nhân bị ép buộc, chi phí nhân đạo và bất ổn | Cultuurstelsel ở Java, nhượng địa ở Congo |
| Độc quyền nhà nước | nhà nước thu địa tô trên mặt hàng (muối, thuốc lá, rượu) | các độc quyền tài chính của nhà nước |

- Hiến chương có ngày cấp và ngày hết hạn. Có thể bị thu hồi do cải cách (laissez-faire, tự do thương mại), độc lập, chiến tranh hoặc bê bối.

## 3. Độc quyền và giá theo cung cầu

- **Giá cạnh tranh (hiện có):** giá thị trường do cung cầu từng thị trường quyết định, trộn với giá thế giới theo độ mở thương mại.
- **Sức mạnh thị trường:** khi một công ty nắm thị phần `s` của một mặt hàng trong một thị trường, giá bán có phụ phí theo mức tập trung, theo hướng Lerner/Cournot. Phụ phí làm giảm cầu (cầu co giãn theo giá) và tạo lợi nhuận độc quyền cho công ty.
- **Chống độc quyền:** luật chống trust (cùng các mốc lịch sử như Sherman Act 1890, cần nguồn) giới hạn thị phần và phụ phí, và có thể buộc tách công ty.
- **Sổ cái bảo toàn:** mọi địa tô và phụ phí phải đi đúng từ người mua/người sản xuất sang chủ sở hữu, không tạo hay mất giá trị. Test bắt buộc.
- **Không buff hay phạt nước nào tùy tiện.** Tham số lấy từ nguồn (CG-30/31) hoặc ghi rõ là tham số thiết kế đã được hiệu chỉnh bằng scorecard.

## 4. Lát triển khai

1. **CO-1:** state `companies` + chủ sở hữu site + dòng lợi nhuận và cổ tức. Save v3→v4 có migration; hợp đồng state; UI đọc được.
2. **CO-2:** hiến chương độc quyền thương mại (ECON-MONO-01) với dữ liệu CG-30. Đo scorecard Ấn Độ và Java.
3. **CO-3:** sức mạnh thị trường, phụ phí và chống độc quyền.
4. **CO-4:** công ty lịch sử (Historical Mode, CG-31) và công ty sinh ra (Sandbox).
5. **CO-5:** giao diện: danh sách công ty, sở hữu, hiến chương, cảnh báo độc quyền.

## 5. Dữ liệu cần

- **CG-30:** độc quyền có hiến chương (đã yêu cầu ở MSG-048).
- **CG-31:** công ty lớn theo thời kỳ, 1836–2026. Cho mỗi công ty cần: năm thành lập/giải thể, quốc gia, ngành, quy mô (vốn, doanh thu, lao động) ở một vài mốc. Cần thêm các mốc luật công ty, cổ phần, trách nhiệm hữu hạn, chống trust theo nước, và nguồn.
