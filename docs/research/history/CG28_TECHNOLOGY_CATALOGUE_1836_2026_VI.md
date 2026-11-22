# CG-28 — Danh mục công nghệ 1836–2026 và khủng hoảng Mạc phủ Nhật

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Phạm vi:** danh mục 120+ mốc đổi mới, từ phát minh/nguyên mẫu đến phổ biến thương mại; nghiên cứu riêng Nhật Bản 1853–1868; chỉ dẫn dữ liệu adoption cross-country.  
**Phân biệt bắt buộc:** năm phát minh/nguyên mẫu không đồng nghĩa năm thương mại hóa hoặc phổ cập. CSV ghi năm phổ biến thương mại ở mức xấp xỉ, không phải năm mọi quốc gia áp dụng. Độ tin cậy đánh giá tính chắc chắn của mốc tổng quát, không thay thế kiểm chứng từng ngành/quốc gia.

## 1. Kết quả danh mục

CSV đi kèm có **123 mục** ở 8 nhóm: sản xuất, năng lượng, giao thông, nông nghiệp, y tế/dân số, tài chính/tổ chức, thông tin/điện tử và quân sự. Mỗi dòng có năm phát minh, năm phổ biến thương mại ước tính, vùng tiên phong, ngành tác động, điều kiện tiên quyết, mã nguồn và độ tin cậy.

### Cách dùng trong mô phỏng
- Dùng hai mốc riêng: `invention_year` mở khóa tri thức/khả năng nghiên cứu; `commercial_diffusion_year` chỉ mở cửa áp dụng thương mại ban đầu. Không coi năm thương mại hóa là năm phổ cập toàn quốc.
- Công nghệ chỉ tạo năng suất khi có **điều kiện bổ trợ**: vốn, kỹ năng, hạ tầng, năng lượng, nguyên liệu, tổ chức doanh nghiệp, nhà nước/quy định. Nếu thiếu điều kiện thì có thể nghiên cứu nhưng adoption chậm hoặc chỉ xuất hiện ở vài vùng.
- Tách adoption thành: phát minh → prototype → thương mại hóa tiên phong → adoption quốc gia → penetration/độ phủ. Không dùng một boolean technologyUnlocked để tự động cộng TFP.
- Công nghệ đa dụng (điện, động cơ, hóa chất cơ bản, ICT) nên tác động nhiều ngành với độ trễ; công nghệ ngành hẹp không được cộng năng suất toàn nền kinh tế.
- Ước lượng đóng góp tăng trưởng theo công nghệ: **unknown trong catalogue này**, trừ khi có growth-accounting/sector study gắn trực tiếp. Không phân bổ tùy tiện phần dư TFP cho một phát minh.

## 2. Các mốc ưu tiên có độ trễ khuếch tán

| Công nghệ | Phát minh/nguyên mẫu | Thương mại hóa/triển khai ban đầu | Hàm ý |
|---|---:|---:|---|
| Điện báo | 1837 | 1840s | Mạng lưới cần vốn, dây/cáp và chuẩn vận hành |
| Thép Bessemer | 1856 | 1860s | Tác động lan sang đường sắt, tàu, máy móc sau khi công suất lò và chất lượng ổn định |
| Dynamo | 1866 | 1870s | Máy phát không đồng nghĩa lưới điện quốc gia |
| Điện chiếu sáng và nhà máy điện | 1879–1882 | 1880s–1890s | Cần nhà máy, lưới phân phối, động cơ và tái tổ chức nhà xưởng |
| Động cơ đốt trong/ô tô | 1876–1886 | 1890s–1900s | Cần nhiên liệu, đường, sửa chữa, tiêu chuẩn và sản xuất hàng loạt |
| Haber–Bosch | 1909–1913 | 1910s | Cần áp suất cao, xúc tác, nhà máy hóa chất; không nên áp dụng rộng ngay 1909 |
| Container | 1956 | 1960s–1970s | Tác động lớn chỉ khi cảng, tàu, xe tải và tiêu chuẩn liên vận đồng bộ |
| Máy tính/vi xử lý | 1940s/1971 | 1950s/1970s–1980s | Tác động năng suất có độ trễ tổ chức và tái thiết kế quy trình |
| Internet/Web | 1969/1989 | 1980s/1990s | Cần mạng, thiết bị, chuẩn, nhân lực và mô hình kinh doanh |
| Điện thoại di động | 1973 | 1980s–1990s | Adoption phụ thuộc phổ tần, trạm gốc, giá thiết bị và thu nhập |
| Cách mạng xanh | 1940s–1960s | 1960s–1980s | Giống mới cần nước, phân bón, tín dụng và dịch vụ khuyến nông |

## 3. Nhật Bản 1853–1868: khủng hoảng Mạc phủ

### 3.1 Cú sốc ngoại giao và khủng hoảng chính danh
- Perry đến năm 1853 buộc bakufu hỏi ý kiến daimyo — bước phá vỡ thông lệ quản trị; việc ký hiệp ước thương mại 1858 mà không có sự chấp thuận của triều đình làm suy yếu thẩm quyền shogunate. Các đối thủ chính trị biến vấn đề ngoại giao thành tranh chấp nội trị, dùng khẩu hiệu `sonnō jōi` (tôn vương, bài ngoại). Nguồn: *The Emergence of Modern Japan* (preview học thuật); Auslin được trích trong nghiên cứu tổng quan về Bakumatsu. [S6][S7]
- Không nên mô hình hóa như một thanh legitimacy tự hồi phục sau mở cửa. Giai đoạn này có các cú sốc nối tiếp: tranh chấp kế vị, Ansei Purge 1858–59, ám sát Ii Naosuke năm 1860, xung đột giữa các phiên, bạo lực chống người nước ngoài, liên minh Satsuma–Chōshū năm 1866 và Boshin War 1868. Nguồn: *Japan's Imperial Army: Its Rise and Fall*, chương “Prelude to Imperial Restoration”; *The Mito Ideology*. [S7][S8]

### 3.2 Cú sốc tiền tệ, vàng–bạc và lạm phát
- Norio Tamaki, *Japanese Banking: A History, 1859–1959*, chương “Ryōgae struggling for survival, 1859–1868” ghi tỷ giá quy đổi vàng:bạc tại Nhật khoảng **1:6.44** tháng 6/1859 so với tỷ lệ quốc tế khoảng **1:15**; chênh lệch khuyến khích arbitrage và xuất vàng. Ước tính **100,000–150,000 ryō** vàng chảy ra nước ngoài qua cơ chế tỷ giá sai, chưa tính các kênh khác. Đây là ước tính nghiên cứu, không phải kiểm kê toàn bộ. [S9]
- Bank of Japan Currency Museum xác nhận mở cửa thương mại làm vàng chảy ra; Man’en recoinage năm 1860 điều chỉnh hàm lượng vàng và chặn dòng chảy, nhưng phát hành tiền giảm hàm lượng để bù thâm hụt góp phần gây lạm phát. [S10]
- Nghiên cứu của Hi-Stat ghi giá ở các vùng quen dùng vàng tăng khoảng **5 lần** từ mở cửa cảng đến 1869; nếu đo bằng bạc, tăng tới **10 lần**. Cùng nguồn ghi bất ổn giá góp phần vào nổi dậy nông dân và bạo động đô thị trong thập niên 1860. Đây là mức giá theo vùng/đơn vị tiền cụ thể, không được khái quát thành CPI quốc gia đồng nhất. [S11]
- Nghiên cứu Nhật về xuất vàng xác nhận mở cảng tháng 6/1859 và cải cách tiền tệ tháng 3/1860; nhấn mạnh cơ chế chênh lệch hàm lượng kim loại và tranh luận học thuật còn tồn tại. [S12]

### 3.3 Nổi dậy và bạo lực chính trị
- Dữ liệu tổng hợp được trích từ Stephen Vlastos, *Peasant Protests and Uprising in Tokugawa Japan* (1986), cho thấy số vụ phản kháng nông dân: 1800–1850 **814 vụ** (16.2/năm), 1851–1867 **373 vụ** (21.9/năm). Đây là chuỗi sự kiện lịch sử được biên soạn, phụ thuộc định nghĩa “protest”; không phải toàn bộ đều là nổi dậy vũ trang. [S13]
- Nghiên cứu về Mito ideology mô tả Tengu/ Tsukuba insurrection ngày 27-03-1864 với khoảng **150** samurai, tăng lữ và nông dân, phát động dưới khẩu hiệu sonnō jōi; xung đột này làm suy yếu bakufu nhưng không tự nó lật đổ chế độ. [S8]
- Vì thế mô hình không nên chỉ tăng “unrest” khi giá cả vượt ngưỡng. Cần các biến tích lũy: legitimacy của bakufu; quyền uy triều đình; áp lực ngoại giao; phân裂 giữa daimyo; giá gạo/giá tiêu dùng và tiền tệ; dòng vàng; mức huy động samurai; tổ chức chính trị và bạo lực theo phiên. Sự kiện có thể chuyển từ khủng hoảng chính trị sang nội chiến khi các điều kiện liên minh/quân sự hội tụ.

### 3.4 Đề xuất chuyển hóa thành gameplay — đề xuất của Victori3, không phải dữ kiện lịch sử
1. Từ 1853, thêm chuỗi pressure events: ngoại giao Perry → tranh luận mở cửa → Hiệp ước 1858 → tranh chấp phê chuẩn triều đình → Ansei Purge → ám sát Ii → khủng hoảng tiền tệ 1859–60 → xung đột phiên → liên minh đối lập → Boshin War.
2. Mỗi sự kiện làm thay đổi nhiều trạng thái: bakufu legitimacy, court authority, daimyo loyalty, foreign pressure, treasury, gold reserves, urban prices, rural unrest, military alignment. Không gán toàn bộ hiệu ứng vào một biến legitimacy.
3. Khủng hoảng tiền tệ: mô phỏng arbitrage kim loại khi tỷ giá nội địa và quốc tế lệch; outflow giảm sau recoinage nhưng debasement có thể tăng giá nội địa. Tránh đặt con số 5×/10× thành hệ số tự động toàn Nhật; dùng calibration theo vùng/chuỗi giá nếu có dữ liệu.
4. Biến động nông dân và đô thị nên là xác suất/điểm áp lực tích lũy, có kiểm tra phân vùng và tổ chức. Không đồng nhất mọi protest với rebellion.
5. Không cho legitimacy hồi phục tự động chỉ vì đã ký hiệp ước. Cần điều kiện: thắng lợi ngoại giao, phục hồi tài khóa/giá cả, thỏa hiệp với triều đình, hoặc củng cố liên minh trong nước — mỗi điều kiện có thể thất bại.

## 4. Đo độ trễ khuếch tán công nghệ

**Nguồn dữ liệu chính: Comin & Hobijn, Historical Cross-Country Technology Adoption (HCCTA), NBER.** Dataset bao phủ các công nghệ lớn trong khoảng 200 năm và các nền kinh tế công nghiệp hóa; có tệp ASCII CSV/flat file, workbook và documentation. Dùng để lấy adoption year/penetration theo nước, thay vì suy diễn từ năm phát minh. [S14]

**Nguồn tổng hợp bổ trợ:** WIPO, *Innovation driving human progress* (2019) đưa timeline đổi mới; WIPO *World Intellectual Property Report 2015* mô tả adoption lag theo công nghệ, cho thấy các công nghệ cũ như spindle/steamships có thể mất hơn một thế kỷ để đạt mốc lan tỏa, railways/telegraph khoảng nhiều thập kỷ, và công nghệ mới có xu hướng lan nhanh hơn. Đồ thị WIPO là tổng hợp theo định nghĩa báo cáo, không phải một tham số chung cho mọi quốc gia. [S1][S15]

### Quy tắc đưa HCCTA vào calibration
- Trích adoption year riêng theo công nghệ và quốc gia; tính `lag = first_adoption_year_country - first_commercial_year_frontier` chỉ khi định nghĩa hai mốc tương thích.
- Nếu dataset đo penetration (ví dụ số đơn vị trên đầu người), lấy năm đạt ngưỡng 10%/50% nếu có, không thay bằng năm xuất hiện đầu tiên.
- Ước lượng tốc độ lan tỏa theo công nghệ/ngành và năng lực hấp thụ của quốc gia; không gộp điện báo, đường sắt, điện, máy tính vào một hệ số.
- Dùng dữ liệu adoption để hiệu chỉnh diffusion, không dùng trực tiếp để suy ra TFP. Productivity effect cần nguồn growth-accounting/sector-specific riêng.

## 5. Giới hạn và kiểm soát chất lượng
- Catalogue là **khung nghiên cứu có cấu trúc**, không phải cơ sở dữ liệu hoàn chỉnh về mọi công nghệ. Các năm thương mại hóa sau 1950 là mốc xấp xỉ; một số mục hiện đại cần nghiên cứu chuyên ngành trước khi dùng làm event trigger chính xác.
- Không có ước lượng đóng góp GDP/TFP riêng cho phần lớn mục. Để `unknown`; không chia đều tăng trưởng TFP cho số công nghệ đã mở khóa.
- “Vùng tiên phong” xác định nơi xuất hiện/triển khai đầu tiên có ý nghĩa, không hàm ý độc quyền phát minh hoặc đóng góp của một cá nhân.
- Một số công nghệ có nhiều dòng phát minh độc lập; năm phát minh được dùng như mốc quy ước dễ kiểm tra.
- Trước khi nhập gameplay, Claude nên chuyển CSV sang schema với `invention_year`, `prototype_year`, `commercial_year`, `adoption_by_country`, `preconditions`, `sector_effects`, `confidence`, `source`; giữ commercial year khác adoption year.

## 6. Nguồn tham khảo

- [S1] WIPO, *200 years of transformative innovation driving human progress* (2019), timeline 1816–1914–1918: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_1061.pdf
- [S2] Encyclopaedia/industrial history reference for Bessemer and open-hearth steel chronology; use WIPO timeline and technical history as date cross-check. WIPO source above.
- [S3] General technical chronology cross-checked against patent/industrial histories; use as catalogue lead, not as sole proof of exact national diffusion date.
- [S4] Ford production-line historical chronology; treat commercial diffusion as approximate and industry-specific.
- [S5] Broad technical histories and institutional sources for post-1914 technologies; dates in CSV are milestones, not universal adoption dates.
- [S6] *The Emergence of Modern Japan: An Introductory History since 1853*, academic book preview: https://api.pageplace.de/preview/DT0400.9781317870869_A23913943/preview-9781317870869_A23913943.pdf
- [S7] *Japan's Imperial Army: Its Rise and Fall*, “Prelude to Imperial Restoration”: https://www.jstor.org/stable/j.ctt1bmzks5.4
- [S8] *The Mito Ideology: Discourse, Reform, and Insurrection in Late Tokugawa Japan, 1790–1864*: https://www.jstor.org/stable/jj.2430590
- [S9] Norio Tamaki, *Japanese Banking: A History, 1859–1959*, “Ryōgae struggling for survival, 1859–1868”, pp. 13–16: https://doi.org/10.1017/CBO9780511586415.007
- [S10] Bank of Japan Currency Museum, “Historical events and currencies in use”: https://www.imes.boj.or.jp/cm/english/history/content/index.html
- [S11] Hi-Stat Discussion Paper GD10-163, monetary reform, inflation and unrest in 1860s Japan: https://gcoe.ier.hit-u.ac.jp/english/research/discussion/2008/pdf/gd10-163.pdf
- [S12] Yoshio Kano, “Reconsidering the massive outflow of gold in the late Edo period”, *Local Financial History Research* 53: https://www.chiginkyo.or.jp/assets/chi_53_01.pdf
- [S13] Stephen Vlastos, *Peasant Protests and Uprising in Tokugawa Japan* (1986), p. 46; table reproduced in: https://leftypol.org/edu/src/1642687906557-0.pdf
- [S14] Comin & Hobijn, Historical Cross-Country Technology Adoption Dataset, NBER: https://www.nber.org/research/data/historical-cross-country-technology-adoption-hccta-dataset
- [S15] WIPO, *World Intellectual Property Report 2015*, executive summary, Figure 3 “Faster but less pervasive technology diffusion”: https://www.wipo.int/edocs/pubdocs/en/wipo_pub_944_2015-intro2.pdf

## 7. Đối chiếu ECON-GROWTH hiện tại
CG-28 không tự thay đổi growth coefficients. Scorecard GDP thực hiện có trên branch phải được giữ tách khỏi dữ liệu TFP/labour productivity: GDPpc growth không đồng nhất với Y/HW hoặc TFP residual. Catalogue này chỉ đề xuất mô hình hóa thời điểm và điều kiện adoption. Mọi hệ số tăng trưởng cần được hiệu chỉnh riêng từ growth accounting, năng suất ngành và độ phủ adoption.
