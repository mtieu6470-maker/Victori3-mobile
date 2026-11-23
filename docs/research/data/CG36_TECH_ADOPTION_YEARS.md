# CG-36 — Kiểm chứng cửa sổ áp dụng công nghệ và mốc tiếp nhận

**Trạng thái: PARTIAL.** Đã kiểm tra trực tiếp ba cửa sổ trong `historical_data/technologies/adoption_windows.json`; hai mốc có thể giữ với định nghĩa được siết lại, một mốc phải phân biệt first foreign/operational use với official government adoption. Chưa thay bảng 21 nước trong `tools/tech-adoption-report.ts`: CHAT raw panel chưa được trích xuất và biến adoption không đồng nghĩa năm đầu tiên có công nghệ.

## 1. Ba cửa sổ

### QNG — railways, earliest 1876
**Kết luận: giữ 1876 như first operational railway in Qing territory, nhưng không mô tả là chính quyền Qing đã chấp thuận/tiếp nhận chủ động.** Wusong/Woosung line do Jardine, Matheson & Co. xây dựng mà không có sự cho phép đầy đủ của triều đình; hoạt động từ 1876 đến 1877. Chính quyền Qing mua lại và tháo dỡ; vật liệu được dự định chuyển đi. Đây là một trường hợp tiếp xúc công nghệ bị đảo ngược, không phải bằng chứng mạng lưới quốc gia đã adoption. Đường sắt do Qing bảo trợ và giám sát trong nước tại Tangshan–Xugezhuang bắt đầu xây năm 1881.

Nguồn: Hsien-Chun Wang, “Merchants, Mandarins, and the Railway: Institutional Failure and the Wusong Railway, 1874–1877,” *International Journal of Asian Studies* 12(1), 2015, 31–53; FRUS 1878 doc.77 xác nhận việc tháo dỡ đang diễn ra và đường ray/đầu máy được đưa vào kho.

**Sửa wording đề xuất:** `earliest: 1876`, block mô tả “first foreign-built railway was tolerated briefly, then purchased and dismantled in 1877; durable Qing-sponsored railway construction followed in 1881”. Trong gameplay, 1876 chỉ mở khả năng thử nghiệm/ngoại nhập, không tự sinh mạng lưới.

### QNG — telegraph, earliest 1877
**Kết luận: giữ có điều kiện, nhưng cần đổi thành official state adoption window.** Không được khẳng định 1877 là lần đầu tiên điện báo hiện diện ở Trung Quốc; cần phân biệt tuyến do nước ngoài xây/khai thác, tuyến quân sự/tỉnh, và mạng lưới chính phủ. Nguồn lịch sử điện báo (Baark, 1997) đặt quá trình hiện đại hóa điện báo Trung Quốc trong giai đoạn 1860–1890; các tuyến chính thức được mở rộng sau thập niên 1870, gồm Tianjin–Shanghai năm 1881. Trong lượt này chưa lấy được trang nguồn học thuật xác định đủ chắc ngày tuyến 1877 cho mục hiện tại.

**Khuyến nghị:** để status pending cho đến khi Claude/ChatGPT trích được trang Baark hoặc primary record cụ thể; không đổi trạng thái sang verified chỉ dựa vào narrative chung.

### JAP — railways, earliest 1869
**Kết luận: 1869 là mốc quyết định chính sách, không phải năm tàu chạy.** Nhật Bản quyết định xây tuyến đường sắt trong triều nghị ngày 10/11/1869; thi công bắt đầu năm 1870; đoạn Shinagawa–Yokohama mở thử 1872 và tuyến Shimbashi–Yokohama khai trương chính thức ngày 14/10/1872. Vì game cần mô hình hóa thời điểm chính phủ có thể bắt đầu đầu tư, 1869 hợp lệ như policy/adoption decision; nếu benchmark là first operating railway, dùng 1872.

Nguồn: Japan Ministry of Land, Infrastructure, Transport and Tourism, *Railway Chronology*, trang PDF 1, các mốc 1869, 1870, 1872.

### JAP — telegraph, 1869
Kanagawa Prefectural Archives ghi năm 1869 có tuyến điện báo thử nghiệm 760m ở Yokohama; tuyến gần 32km đến Tsukiji/Tokyo bắt đầu vận hành vào tháng 12/1869. Mốc 1869 có căn cứ cho pilot/initial official use, không phải national coverage.

Nguồn: Kanagawa Prefectural Archives, *The Modern Period*, p.194.

## 2. CHAT: định nghĩa phải dùng đúng

NBER mô tả HCCTA/CHAT là panel không cân bằng về mức sử dụng hơn 100 công nghệ tại hơn 150 quốc gia từ khoảng 1800. Các biến công nghệ là đại lượng sử dụng (ví dụ tuyến đường sắt, telegram sent, telephone lines, electricity production, gross tonnage steam/motor ships), không phải một trường “first year introduced” duy nhất. Nghiên cứu Comin–Hobijn mô tả các biến đo adoption/diffusion; cần đọc mã biến và chuỗi country-year trước khi xác định năm đầu tiên.

**Quy tắc chuyển đổi nếu dùng CHAT:**
1. Lọc đúng country, technology và measure; không lấy “year đầu tiên dataset có dòng”.
2. Chọn năm đầu tiên giá trị quan sát dương chỉ khi chuỗi bao phủ trước năm đó và documentation xác nhận zero/missing semantics.
3. Nếu chuỗi bắt đầu ở giá trị dương mà các năm trước missing, ghi `left-censored`, không coi là first adoption.
4. “First railway” trong bảng engine là sự kiện khai trương tuyến; CHAT rail passenger-km/freight tonne-km là mức sử dụng vận tải, có thể xuất hiện sau khi đường ray đầu tiên hoạt động.
5. CHAT technology list cần xác định biến phù hợp: railways (passenger/freight/railline), telegraph (telegram counts), steam/motor ships (gross tonnage), telephone (main lines), electricity (production). Không dùng electricity production để tuyên bố first power station nếu chuỗi có coverage muộn.

NBER dataset page và Comin–Hobijn 2009 note xác nhận phạm vi, cấu trúc panel, nguồn và cách cite; DataHub mirror nêu license ODC-PDDL. NBER original is authoritative for provenance; DataHub mirror license applies to that mirror's distributed copy, not automatically every upstream source.

## 3. Giao việc / dữ liệu

Tệp CSV đi kèm chỉ ghi các mốc đã có căn cứ và ghi rõ measure. Không tạo 21×5 hàng giả hoặc bịa ngày từ bảng hiện tại. `tools/tech-adoption-report.ts` chưa được sửa trong lượt này; current FIRST_RAILWAY remains benchmark legacy, not source-validated.

### Nguồn
- NBER, Historical Cross-Country Technology Adoption (HCCTA): https://www.nber.org/research/data/historical-cross-country-technology-adoption-hccta-dataset
- Comin & Hobijn, “The CHAT Dataset,” NBER Working Paper 15319 (2009): https://www.nber.org/papers/w15319
- Comin & Hobijn, “Cross-Country Technology Adoption: Making the Theories Face the Facts,” NY Fed Staff Report 169 (2003): https://www.newyorkfed.org/research/staff_reports/sr169.html
- Hsien-Chun Wang (2015), Wusong Railway: https://www.cambridge.org/core/journals/international-journal-of-asian-studies/article/abs/merchants-mandarins-and-the-railway-institutional-failure-and-the-wusong-railway-18741877/A754C471CC86872183CE90F0A3FFF4A5
- FRUS 1878, document 77: https://history.state.gov/historicaldocuments/frus1878/d82
- Japan MLIT railway chronology: https://www.mlit.go.jp/common/000227427.pdf
- Kanagawa Prefectural Archives, *The Modern Period*: https://archives.pref.kanagawa.jp/2024/10/03/english-14.pdf
- NC State, China’s First Railroads: https://scalar.chass.ncsu.edu/bodies-and-structures-2/chinas-first-railroads-the-wusong-and-tianjin-railways

## 4. Hành động tiếp theo cần thiết
- Lấy raw CHAT panel và documentation file; tính first-positive years với left-censor flags.
- Xác minh Baark (1997) page và nguồn sơ cấp cho official Qing telegraph window.
- Xác định chính xác danh sách 21 nước trong bản benchmark của engine; không đồng nhất PRU/GER, AUS/Austria, EIC/India, TUR/Ottoman nếu không có crosswalk lịch sử.
- Sau khi có CSV đầy đủ mới thay `FIRST_RAILWAY` và mở rộng report cho 5 công nghệ.
