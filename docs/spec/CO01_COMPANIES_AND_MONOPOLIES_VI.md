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

## 6. Bổ sung sau review của ChatGPT (CO01_COMPANIES_AND_MONOPOLIES_REVIEW, 2026-11-22) — bắt buộc trước khi code

1. **Tách thực thể:**
   - `LegalEntity`: pháp nhân, có ngày đăng ký/giải thể và luật thành lập;
   - `CorporateGroup`: tập đoàn, quan hệ sở hữu giữa các pháp nhân, có ngày;
   - `Brand`: chỉ là nhãn hiển thị;
   - `StateEnterprise`: doanh nghiệp nhà nước, chủ sở hữu là nhà nước.
   - Không gộp chúng thành một đối tượng `Company`. Sáp nhập và tách công ty là sự kiện có ngày trên đồ thị sở hữu.
2. **Tách khái niệm:**
   - hình thức pháp lý (cổ phần, trách nhiệm hữu hạn);
   - hiến chương (đặc quyền có văn bản, mặt hàng, địa bàn, thời hạn);
   - sức mạnh thị trường (thị phần, phụ phí; là kết quả kinh tế, không phải đặc quyền);
   - độc quyền tài chính của nhà nước (thu ngân sách; không phải lợi nhuận công ty).
3. **Sổ cái dòng giá trị khép kín** cho mọi khoản: doanh thu, chi phí, tiền công, địa tô độc quyền, thuế, cổ tức, chuyển về chính quốc.
   - Test bắt buộc: tổng nguồn bằng tổng đích theo từng tháng.
   - Phân biệt GDP (sản xuất trong lãnh thổ) với GNI (cộng thu nhập ròng từ nước ngoài). Địa tô chuyển về chính quốc làm giảm GNI và thu nhập hộ gia đình của thuộc địa, **không trừ thẳng khỏi GDP** để làm đẹp scorecard.
4. **Phạm vi hiến chương:** mỗi hiến chương có văn bản pháp lý, mặt hàng, địa bàn và khoảng thời gian có nguồn (CG-30). Ô nào chưa có nguồn thì cơ chế tương ứng tắt.
   - Ví dụ: tỷ lệ giá thu mua chỉ dùng khi có cặp giá khớp năm, mặt hàng, phẩm cấp và địa bàn.
5. **Canh tác cưỡng bức và khai thác thuộc địa** phải mang hậu quả cho hộ gia đình: mức sống, cưỡng bức lao động, di cư, tử vong, bất ổn. Không có modifier "hiệu quả độc quyền" dương chung chung.
6. **Historical Mode:** chỉ công ty có bằng chứng quy mô đã xác minh (CG-31 scale evidence) mới được sinh ra với quy mô đó. Công ty còn PENDING không xuất hiện kèm quy mô tự bịa.

## 7. Công nghệ mở khóa công ty và đặc quyền (owner 2026-11-22)

**Lời owner:** "nên làm cty đầy đủ như victori 3 ấy, thấy khi mở khóa thanh công nghệ bất kỳ sẽ đc 1 đặc quyền cty, nên tham khảo thêm về phần này ở victori 3".

**Thiết kế của dự án** (chỉ tham khảo cơ chế; tên và số liệu là của dự án):
- Mỗi công nghệ trong cây (`historical_data/technologies/technologies.json`) có thể mang trường `unlocks`:
  - `company_kinds`: loại công ty mới được phép thành lập, ví dụ công ty đường sắt khi có railways, tập đoàn điện khi có central_power_stations, hãng ô tô khi có motor_cars, công ty phần mềm khi có internet;
  - `charters`: đặc quyền công ty mới.
- **Đặc quyền** (charter) là lựa chọn của người chơi hoặc AI khi một công ty đủ điều kiện. Mỗi công ty có số ô đặc quyền giới hạn, và ô tăng theo quy mô và thịnh vượng. Mỗi đặc quyền có lợi ích, chi phí và điều kiện pháp lý. Ví dụ loại hình (tên sẽ do dự án đặt):
  - độc quyền một mặt hàng trong thị trường: phụ phí giá, cần luật kinh tế cho phép, bị luật chống trust cấm;
  - ưu tiên mua sắm của nhà nước: đơn hàng quân sự hoặc hạ tầng;
  - khai thác thuộc địa hoặc nhượng địa: hậu quả phúc lợi theo §6;
  - mở rộng ra nước ngoài: chi nhánh ở thị trường khác, cần quan hệ ngoại giao/thương mại;
  - đầu tư nghiên cứu: tăng điểm công nghệ ngành, cần đại học;
  - liên kết ngân hàng: vốn rẻ hơn, liên quan FIN-01.
- **Thịnh vượng công ty:** dựa trên lợi nhuận thực tế của các site thuộc công ty (IND-02a). Thịnh vượng cao mở thêm ô đặc quyền; lỗ kéo dài làm mất đặc quyền và có thể dẫn tới phá sản.
- **Trụ sở:** vùng đặt trụ sở được hưởng tầng lớp trung lưu, tư bản và thuế. Công ty đa quốc gia chuyển lợi nhuận về nước trụ sở (GNI theo §6).
- **Historical Mode:** công ty lịch sử có quy mô đã xác minh (CG-31) xuất hiện khi đủ công nghệ và luật tương ứng.
- **Sandbox:** công ty được sinh ra theo cùng quy tắc mở khóa.
- **Cân bằng:** mọi lợi ích đặc quyền có chi phí hoặc điều kiện; không buff nước nào (owner 2026-11-22).

**Lát triển khai bổ sung:**
- **CO-1b:** trường `unlocks` trong dữ liệu công nghệ; danh mục loại công ty và đặc quyền (dữ liệu của dự án); test mọi loại đều được mở khóa bởi một công nghệ có thật.
- **CO-3b:** cơ chế ô đặc quyền, thịnh vượng và lựa chọn đặc quyền của AI.
- **CO-5:** giao diện công ty: danh sách, đặc quyền, mở khóa theo công nghệ (hiển thị ở màn hình công nghệ).

## 8. CO-2: dòng tiền công ty (triển khai 2026-11-22, nghiên cứu CG-33)

- **Lợi nhuận hoạt động** = doanh thu − chi phí (nguyên liệu và lương) của các cơ sở công ty sở hữu, lấy từ sổ IND-02a.
- **Chia lợi nhuận dương:**
  - `payoutRatio` = 0,6 phần là cổ tức. Đây là tham số thiết kế nằm trong dải lịch sử của CG-33: Anh 1895–1905 khoảng 49–73%; Đức 1870–1913 khoảng 75–80%; Mỹ thập niên 1940–1980 khoảng 40–61%. Không có tỷ lệ lịch sử chung.
  - Phần còn lại là lợi nhuận giữ lại.
- **Sổ khép kín, không tạo tiền:**
  - Giá trị gia tăng của cơ sở đã nằm trong GDP, và tiết kiệm tư nhân quốc gia (`privatePool`) đã bao gồm lợi nhuận. Vì vậy lợi nhuận giữ lại được **tách ra** từ `privatePool` của nước chủ nhà vào két công ty.
  - Bất biến của bước công ty: `Σ privatePool + Σ cash công ty` không đổi (có kiểm thử).
  - Cổ tức ở lại với hộ gia đình: không đổi dòng tiền, chỉ ghi lại để hiển thị.
  - Lỗ không rút từ két, vì lỗ đã làm giảm thu nhập của chủ sở hữu trong mô hình tổng hợp; lỗ được tính vào điều kiện giải thể.
- **Đầu tư (capex nội sinh, không theo tỷ lệ cố định):**
  - Mỗi quý, công ty có tiền chưa cam kết đủ cho một dự án sẽ chọn công trình thuộc loại của mình có lợi suất kỳ vọng (`buildingReturn`) > 0,08 ở nước chủ nhà.
  - Ưu tiên mở rộng cơ sở của chính mình; không được xây cạnh cơ sở không có chủ của nhà đầu tư khác.
  - Dự án mang trường `company` và chi từ két công ty. Khi hoàn thành, cơ sở mới thuộc về công ty.
  - Tiền vượt 3 dự án điển hình được trả về `privatePool`.
- **Giải thể:** két trả về `privatePool`; dự án dở dang chuyển cho quỹ tư nhân.
- **GDP và GNI:** mọi cơ sở đều ở nước chủ nhà, nên GDP = GNI với khu vực công ty. Sở hữu xuyên biên giới (thu nhập FDI, CG-33 §3) là một lát sau.
- **Còn thiếu:**
  - Doanh thu đường sắt (vận tải) chưa có mô hình, nên công ty đường sắt có lợi nhuận 0.
  - Đặc quyền hiến chương (CO-3b) chưa có.
  - Giao diện công ty (CO-5) chưa có.
- **Chi phí CPU:** bước công ty khoảng 2,5 ms/tháng (đo 1836–1880).

## 9. CO-3: suất công ty và người chơi tự lập công ty (triển khai 2026-11-22)

- **Suất công ty** = suất theo luật kinh tế + 1 suất cho mỗi `LEVELS_PER_SLOT` = 150 cấp công trình (dệt, sắt thép, cơ khí, vũ khí, xa xỉ, đường sắt, mỏ), tối đa 12.
  - Suất theo luật: truyền thống 0, trọng thương 1, can thiệp 2, tự do kinh doanh 3. Đây là tham số thiết kế.
  - Không có suất miễn phí; nước ít công nghiệp có ít công ty.
- **Người chơi** tự quyết định lập công ty bằng lệnh `found_company` (nút "Thành lập công ty" trên thẻ). Nước của người chơi không tự lập công ty.
- **AI** lập theo cùng luật, mỗi năm một lần, không vượt số suất. Khi số suất giảm (mất lãnh thổ, đổi luật), công ty đang có không bị giải thể vì lý do đó.
- **Điều kiện thành lập** (`foundCompanyBlocker`, dùng chung cho người chơi và AI):
  - luật cho phép (kinh tế không phải truyền thống, và đã có công nghệ ngân hàng cổ phần);
  - đã có công nghệ mở khóa loại công ty;
  - chưa có công ty cùng loại;
  - còn suất trống;
  - có ít nhất 8 cấp công trình phù hợp chưa có chủ.
- **Giao diện:**
  - Ô chỉ số "Công ty / suất" kèm nguồn gốc suất.
  - Thẻ "Có thể thành lập": viền vàng và nút bấm khi đủ điều kiện, hoặc thẻ xám ghi lý do còn thiếu bằng tiếng Việt.
- **Tiếp theo:** CO-3b, hiến chương và đặc quyền (độc quyền, giấy phép), cần cơ sở pháp lý (CG-30); có chi phí duy trì và giới hạn.

## 10. CO-3b: hiến chương độc quyền (triển khai 2026-11-22)

- **Hiệu lực.** Công ty giữ hiến chương có độc quyền xây loại công trình của mình trong nước:
  - quỹ tư nhân và các công ty khác không được khởi công công trình loại đó;
  - nhà nước vẫn xây được.
  - **Không cộng chỉ số trực tiếp.** Lợi ích đến từ việc ít cạnh tranh hơn: cung tăng chậm hơn thì giá cao hơn (cơ chế cung cầu sẵn có).
- **Luật.** Chỉ cấp được dưới luật trọng thương hoặc can thiệp. Khi chuyển sang tự do kinh doanh, mọi hiến chương tự động bị thu hồi. Đây là quan hệ nhân quả có cơ sở lịch sử: tự do kinh doanh là sự bãi bỏ đặc quyền thương mại, ví dụ EIC mất độc quyền thương mại năm 1813/1833.
- **Điều kiện cấp:**
  - thịnh vượng ≥ 0,3;
  - mỗi 4 suất công ty có 1 hiến chương, tối thiểu 1;
  - không trùng ngành với hiến chương đã có.
- **Ai quyết định:** người chơi cấp hoặc thu hồi bằng lệnh. AI cấp cho công ty thịnh vượng nhất đủ điều kiện (kiểm tra hằng năm).
- **Chưa làm:** đặc quyền có giá trị định lượng (thu mua dưới giá, đội giá tiêu dùng, chuyển địa tô về chính quốc). Phần này thuộc ECON-MONO-01 và chỉ bật khi có dữ liệu nguồn (CG-30, CG-34).
- **Đo kiểm.** Kiểm thử trong `tests/companies-founding.test.ts` (4 bài). Scorecard 1913: 0,229 (trước đó 0,236).

### 10.1 Sửa theo CG-34 (2026-11-22)

ChatGPT phản biện, kèm bằng chứng, rằng quy tắc "tự do kinh doanh tự động thu hồi mọi hiến chương" quá rộng. Trong lịch sử, đặc quyền chấm dứt vì một trong các lý do: một đạo luật bãi bỏ cụ thể (EIC mất độc quyền Ấn Độ năm 1813, Trung Quốc năm 1833), nhượng quyền hết hạn hoặc bị mua lại, hay lãnh thổ được chuyển giao (HBC năm 1870, Alaska năm 1867). Cải cách tự do thương mại không tự động xóa độc quyền nhà nước hay nhượng quyền hạ tầng. **Director chấp nhận.**

- Hiến chương có thời hạn: `CHARTER_PARAMS.termYears` = 30. Đây là giá trị thiết kế; nhượng quyền lịch sử dao động rất rộng, có trường hợp tới 99 năm (đường sắt Pháp sau 1859, Suez).
- Luật kinh tế chỉ quyết định việc cấp mới. Đổi luật không xóa hiến chương đang có.
- Hiến chương kết thúc khi hết hạn hoặc khi bị thu hồi rõ ràng bằng lệnh.
- Save cũ: hiến chương chưa có hạn được gán hạn tính từ ngày cấp.

**ECON-MONO-01 vẫn TẮT.** CG-34 không tìm được tỷ lệ thu mua hay mức đội giá có nguồn cho thuốc phiện và muối Bengal, NHM, HBC, RAC hay độc quyền thuốc lá. Số định lượng duy nhất là quyền hưởng 15% lợi nhuận ròng của Ai Cập theo nhượng quyền Suez, khoản trả một lần 300.000 bảng của HBC, và quyền đất đai. Không bật một wedge thiếu số liệu.

## 11. CO-2b: sổ sách công ty đường sắt (2026-11-22)

- **Doanh thu cơ sở đường sắt** = `RAIL_REVENUE_CAPTURE` (0,3) × sản lượng vùng × phần do đường sắt tạo ra (0,05·độ phủ / (1 + 0,05·độ phủ)).
- **Chi phí** = `RAIL_OPERATING_RATIO` (0,6) × doanh thu.
- Đây là phân bổ giá trị đã có trong GDP, không tạo sản lượng mới.
- **Kết quả:** doanh thu bằng khoảng 6% GDP ở các nước công nghiệp từ 1870. Hai tham số chờ kiểm định bằng CG-35.
- **Scorecard 1913:** 0,221 (trước đó 0,229).
