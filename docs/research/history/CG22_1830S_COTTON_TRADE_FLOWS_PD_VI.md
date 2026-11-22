# CG-22 — Luồng nhập bông thô và xuất khẩu sợi/vải cotton của Anh, 1830–1836

- Ngày nghiên cứu: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Phạm vi: Anh/Great Britain; ưu tiên quan sát 1830–1836; chỉ sử dụng nguồn thế kỷ XIX đã xuất bản và có thể kiểm tra.
- Mục tiêu: ràng buộc kiểm tra ECON-03; không nhúng nguyên bảng vào game.
- Quy ước: phân biệt số liệu theo lượng, tỷ lệ, giá trị; không đổi bales thành pounds nếu nguồn không cho phép; `unknown` nghĩa là chưa có dữ liệu tương thích được xác minh.

## 1. Kết luận điều hành

1. **Anh phụ thuộc nặng vào bông thô nhập khẩu**, với Hoa Kỳ là nguồn lớn nhất. Bảng G trong Levi Woodbury (Bộ Ngân khố Hoa Kỳ, 1836) cho thấy tỷ lệ nguồn cung Mỹ ở mức khoảng 60–67% năm 1830, 60–67% năm 1831, 75% năm 1832, 87% năm 1833, 83% năm 1834 và 75% năm 1835. Đây là tỷ lệ trong bảng nhập khẩu Liverpool/Anh, không phải tỷ lệ theo sản lượng bông toàn cầu.
2. Nguồn thứ hai có ích là Brazil; tiếp theo có East India/India, Egypt/Turkey, West Indies và Demerara/Berbice. Các tỷ lệ ở một số năm trong bảng G được ghi dưới dạng khoảng hoặc gộp vùng; không nên ép chúng thành một bộ tỷ trọng chính xác cộng đúng 100%.
3. Một bảng circular Liverpool được in trong *Merchants’ Magazine* (1845) cho lượng nhập 1835 và 1836 theo các vùng. Năm 1836, tổng ghi 1,201,185; trong đó Hoa Kỳ 735,236, Brazil 148,093, Demerara & Berbice 3,167, West Indies 32,586, Egypt 32,946, East Indies 219,157. **Bảng không ghi đơn vị ở tiêu đề được trích xuất**, vì vậy các con số này chỉ được dùng như lượng theo đơn vị bảng/circular, không chuyển thành pounds hoặc bales khi chưa xem được chú giải gốc.
4. Bảng N trong Woodbury (1836) cho giá trị xuất khẩu cotton manufactures từ Anh tới Pháp, Đức, Hà Lan, Ấn Độ/Trung Quốc và một số vùng khác. Năm 1835, các trị số được ghi lần lượt: Pháp 730,000; Đức 15,750; Hà Lan 10,000; Ấn Độ và Trung Quốc 7,500; Nam Mỹ và Mexico (không gồm Brazil) 8,000; Tây Ban Nha 6,000; Nga 6,000; Brazil 7,500. Đơn vị là dollars; bảng ghi các con số theo giá trị, không phải lượng vải. Năm 1830–1835 có chuỗi rõ cho Pháp, Đức và Hà Lan.
5. Không tìm được trong lượt này một chuỗi sơ cấp cùng định nghĩa, cùng phạm vi hàng hóa và cùng đơn vị để tính tỷ lệ sản lượng cotton manufacture của Anh xuất khẩu so với tiêu thụ nội địa. Baines ghi giá trị xuất khẩu năm 1833 là £18,486,400, nhưng không thể chia số đó cho một tổng giá trị sản xuất có cùng cơ sở kế toán một cách an toàn. **Tỷ lệ sản lượng xuất khẩu / tiêu thụ nội địa: unknown.**
6. Các dữ liệu đủ để bác bỏ mô hình thương mại Anh không có nguồn nhập bông hoặc không có đầu ra xuất khẩu; nhưng không đủ để hardcode một tỷ lệ xuất khẩu theo từng hàng/market share cho toàn bộ năm 1836. Dùng làm calibration constraints và acceptance tests, không biến các bảng lịch sử khác đơn vị thành số chính xác.

## 2. Nguồn sơ cấp và tình trạng quyền sử dụng

### CG22-S01 — Levi Woodbury, *Letter from the Secretary of the Treasury, transmitting tables and notes on the cultivation, manufacture, and foreign trade of cotton* (Washington, 5 April 1836)

- Bản số hóa: https://www.e-rara.ch/download/pdf/20271911.pdf
- Persistent link: https://doi.org/10.3931/e-rara-73156
- Đơn vị lưu trữ: ETH-Bibliothek Zürich, shelf mark Rar 33065.
- Bản in là báo cáo chính thức gửi Quốc hội Hoa Kỳ, ngày 5-4-1836; nội dung tự mô tả nguồn bảng và giới hạn dữ liệu ở phần thư trình (printed pp. 3–8).
- Phần giải thích nói lượng cotton thô được quy về pounds khi có thể; bảng N ghi giá trị bằng dollars. Các tỷ lệ của bảng G có thể lấy từ nhập khẩu Liverpool và không nhất thiết là toàn bộ Vương quốc Anh; ghi chú [2] và [3] nêu rõ các giới hạn đó.
- Tình trạng sử dụng: tác phẩm chính phủ Hoa Kỳ xuất bản năm 1836 là public domain tại Hoa Kỳ; bản số hóa được ETH cung cấp miễn phí. Cần giữ attribution/provenance và kiểm tra luật địa phương trước khi phân phối ảnh scan. Không đưa bản scan vào game.
- Các phần trực tiếp dùng: bảng G (printed pp. 53–54), bảng N (printed pp. 97–100), ghi chú [1]–[3] cho G và [1]–[5] cho N.

### CG22-S02 — *Merchants’ Magazine*, vol. XII, no. IV (April 1845), “Import of Cotton into Great Britain, in Ten Years”

- PDF: https://fraser.stlouisfed.org/files/docs/publications/merchmag/merchmag_v12_184504.pdf
- Trang in 392; bản lưu trữ FRASER, Federal Reserve Bank of St. Louis.
- Bài nói rõ bảng được lấy từ một Liverpool circular “authentic” và đưa tổng nhập hàng năm 1835–1844 cùng breakdown theo Atlantic States, New Orleans/Mobile, Brazil, Demerara & Berbice, West Indies, Egypt và East Indies.
- Tình trạng sử dụng: tạp chí năm 1845 là public domain theo thời hạn bản quyền; FRASER cung cấp bản số hóa. Giữ tên tạp chí, số, trang và provenance của circular. Bảng không ghi rõ đơn vị trong phần tiêu đề được trích xuất; không được tự gán bales hoặc pounds.
- Bảng dùng đối chiếu độc lập cho 1835–1836, không thay thế chuỗi bảng G.

### CG22-S03 — Edward Baines, *History of the Cotton Manufacture in Great Britain* (London, 1835)

- Bản ghi Wellcome: https://wellcomecollection.org/works/k7k5pfwc
- PDF scan Commons: https://commons.wikimedia.org/wiki/File:Edward_Baines,_History_of_the_cotton_manufacture,_1835.pdf
- Wellcome Collection gắn Public Domain Mark và ghi rõ có thể sử dụng tác phẩm cho mọi mục đích không bị hạn chế bởi luật bản quyền.
- Baines xác nhận cotton-wool nhập vào năm 1833 là 303,726,199 lbs và British cotton manufactures xuất khẩu năm 1833 có real/declared value £18,486,400 (printed p. 112). Đây là kiểm tra quy mô tổng thể, không phải breakdown theo nguồn gốc/điểm đến.
- Nội dung chương XV nhấn mạnh thống kê ngành còn rất thiếu và có nhiều ước lượng; không suy diễn tỷ trọng nội địa/xuất khẩu từ hai số tổng hợp khác cơ sở.

### CG22-S04 — G. R. Porter, *The Progress of the Nation* (1836)

- Bản scan được ghi trong CG-20: https://escoe-website.s3.amazonaws.com/wp-content/uploads/2018/10/18113758/Porter-The-Progress-of-the-Nation-1836-edition.pdf
- Có các bảng thống kê thương mại chính thức và được Woodbury dẫn như một nguồn cho bảng nhập khẩu/nhập xuất cotton.
- Lưu ý giấy phép truy cập scan Google Books được CG-20 ghi là hạn chế phi thương mại; không coi đây là quyền tái phân phối thương mại. Trong CG-22, Porter chỉ được dùng làm provenance/cross-reference, không dùng ảnh/bảng scan làm asset.

## 3. Nhập khẩu bông thô vào Anh theo nguồn gốc

### 3.1 Bảng G — tỷ lệ nguồn cung

Woodbury, Table G, printed pp. 53–54, tiêu đề “Imports of Cotton—Raw into England, and where from”. Bảng tổng nhập tính theo millions of lbs; các cột nguồn gốc là ratio/fraction. Ghi chú [2] nói tỷ lệ được tính từ imports vào Liverpool và “will not vary much” cho toàn kingdom; ghi chú [3] nói cột tổng bao gồm England, Scotland và Ireland, do nguồn khác nhau dùng phạm vi khác nhau.

| Năm | Tổng nhập trong bảng (million lbs) | Hoa Kỳ | Brazil | Demerara/Berbice + West Indies | Egypt/Turkey | India | Ghi chú |
|---|---:|---:|---:|---:|---:|---:|---|
| 1830 | 259.75 | 2/3 đến 3/5 | 1/7 đến 1/8 | 3/9 (gộp theo bảng) | 3/0 (dạng phân số in/OCR cần đối chiếu ảnh) | 1/9 | Không dùng các ô có OCR/typography mơ hồ làm tỷ lệ chính xác |
| 1831 | 280 | 2/3 đến 3/5 | 3/5 (cách đọc cần đối chiếu ảnh) | 1/60 (gộp) | 1/6 | 1/5 | Giữ nguyên transcription; không normalize khi chưa đối chiếu scan |
| 1832 | 270 2/3 | 3/4 | 1/3 | — | 3/5 | 1/3 | Các tỷ lệ nguồn trong bản text extraction có dấu hiệu lỗi OCR; xem ghi chú bên dưới |
| 1833 | 288 | 7/8 | 1/13 | — | 3/0 | 5/6 | Một số ô là ký hiệu phân số kiểu in cũ/OCR; không cộng lại |
| 1834 | 320.5 | 5/6 | 1/10 | 1/200 | 3/00 | 5/6 | Các ô có định dạng phân số bất thường, cần ảnh scan để đọc chính xác |
| 1835 | 361.5 | 3/4 | 1/12 | — | — | 1/8 | Bảng có chú thích dùng số liệu Liverpool circular tháng 1-1836 cho dòng mới nhất |

**Cảnh báo chất lượng:** bản text extraction của bảng G biểu diễn một số phân số cũ không nhất quán (ví dụ `3/0`, `3/00`, `3/5`), có khả năng mất định dạng phân số gốc. Vì thế chỉ dùng kết luận định tính có độ tin cậy cao — Hoa Kỳ là nguồn chi phối và Brazil/Ấn Độ/Egypt/West Indies bổ sung — còn các ô tỷ lệ nghi lỗi phải để unknown trong dữ liệu game. Không chép nguyên các phân số lỗi thành số thập phân.

### 3.2 Đối chiếu độc lập năm 1835–1836 từ Liverpool circular

*Merchants’ Magazine*, April 1845, p. 392, bảng “General Statement of Import into Great Britain, during the last ten years”. Số liệu được giữ đúng dạng số trong nguồn; **đơn vị không ghi rõ ở heading trích xuất**.

| Năm | Atlantic States | New Orleans, Mobile, etc. | Tổng U.S. | Brazil | Demerara & Berbice | West Indies etc. | Egypt | East Indies | Tổng cộng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1835 | 389,429 | 373,809 | 763,238 | 143,580 | 3,503 | 21,750 | 40,719 | 118,433 | 1,091,223 |
| 1836 | 384,183 | 351,053 | 735,236 | 148,093 | 3,167 | 32,586 | 32,946 | 219,157 | 1,201,185 |

Derived shares (tính từ cùng bảng, cùng đơn vị):
- 1835: Hoa Kỳ 69.9%; Brazil 13.2%; East Indies 10.9%; Egypt 3.7%; West Indies 2.0%; Demerara/Berbice 0.3%.
- 1836: Hoa Kỳ 61.2%; Brazil 12.3%; East Indies 18.2%; Egypt 2.7%; West Indies 2.7%; Demerara/Berbice 0.3%.
- Phần chênh giữa tổng và các cột có thể là các nguồn/nhóm khác không được liệt kê hoặc sai số transcription; không phân bổ phần dư cho một nước cụ thể.
- Đây là derived shares của bảng circular, không phải số quan sát độc lập và không xác minh đơn vị tuyệt đối.

### 3.3 Diễn giải dùng được cho mô hình

- Anh phải có tuyến nhập bông quy mô lớn từ Hoa Kỳ; năm 1835–1836 riêng nguồn Mỹ chiếm khoảng 61–70% tổng lượng của bảng Liverpool.
- Brazil là nguồn bổ sung có quy mô đáng kể; East Indies tăng rõ trong bảng 1836 so với 1835.
- Egypt và West Indies là nguồn nhỏ hơn trong bảng 1835–1836; không nên đặt chúng ngang quy mô với Mỹ/Brazil/India.
- Không gán “cotton nhập từ Ai Cập” cho một polity duy nhất nếu dữ liệu engine cần cảng/thị trường cụ thể; bảng nhóm Egypt có thể khác cách phân loại theo từng ấn phẩm.

## 4. Xuất khẩu sợi/vải cotton Anh theo điểm đến

### 4.1 Woodbury Table N — giá trị xuất khẩu theo vùng/thị trường

Woodbury, Table N, printed pp. 97–100, “Exports of their own—to what places—values of.” Bảng ghi dollars; các giá trị là các ước lượng/thống kê tổng hợp, không phải yardage. Những cột chính: England to United States; France; Germany; Netherlands; India and China; South America and Mexico (except Brazil); various places to Spain; various places to Russia; England to Brazil.

| Năm | Pháp ($) | Đức ($) | Hà Lan ($) | Ấn Độ & Trung Quốc ($) | Nam Mỹ & Mexico, trừ Brazil ($) | Tây Ban Nha ($) | Nga ($) | Brazil ($) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1830 | 162,000 | 14,250 | 6,000 | unknown | unknown | unknown | unknown | unknown |
| 1831 | 50,000 | 14,000 | 6,000 | unknown | unknown | unknown | unknown | unknown |
| 1832 | 240,000 | 13,250 | 6,500 | unknown | unknown | unknown | unknown | unknown |
| 1833 | 318,000 | 15,500 | 8,500 | unknown | unknown | unknown | unknown | unknown |
| 1834 | 450,000 | 14,500 | 9,500 | 7,500 | 8,000 | 6,000 | 6,500 | 8,500 |
| 1835 | 730,000 | 15,750 | 10,000 | 7,500 | 8,000 | 6,000 | 6,000 | 7,500 |

- Cột England to United States để trống trong các năm này. Không diễn giải thành zero hoặc khẳng định không có xuất khẩu; ghi `unknown`.
- Chú thích [1] của Woodbury nói các số 1820–1833 phần lớn lấy từ official documents và dẫn Porter, pp. 161–167 / p. 300; các ấn phẩm có thể khác nhau vì kỳ kết toán khác nhau.
- Chú thích [2] nói từ 1832 Belgium đã nhận khoảng 1.5 million (dollars) trong phần được ghi chung là Netherlands vào 1832–1833; năm 1834 số liệu Alexander cho Belgium nhập từ mọi nguồn khoảng 2.25 million, cùng một lượng buôn lậu được tác giả ước tính gấp đôi. Không cộng các con số này vào số Anh xuất sang Hà Lan: đây là cảnh báo phân loại/đích đến.
- Chú thích [3] ghi exports sang Germany và Netherlands có khoảng một phần ba đến một nửa là twist/yarn, được dệt tại chỗ; một phần lớn exports sang Russia cũng là twist/yarn; có một phần yarn xuất sang India. Vì vậy không được mô hình hóa toàn bộ giá trị này thành vải thành phẩm.
- Nguồn phân loại “Various places to Spain/Russia” không cho biết riêng hàng xuất phát từ Anh; giữ nguyên tiêu đề và không gán tất cả cho luồng Anh.

### 4.2 Đối chiếu official trade tables 1831–1840

Bản *Trade and Finance of the United Kingdom* số hóa tại Commons/Internet Archive có chương “Cotton Manufactures”, printed pp. 130–133:
- pp. 130–131: lượng (yards) và declared value (£) của cotton manufactures “entered by the yard” xuất khẩu từ UK, theo nước, 1831–1840.
- p. 132: “Hosiery, lace, etc.” theo declared value.
- p. 133: các bảng tổng/nhóm hàng bổ sung.
- Nguồn scan: https://upload.wikimedia.org/wikipedia/commons/6/62/Trade_and_Finance_of_the_United_Kingdom_%28IA_dli.granth.77949%29.pdf
- Text extraction cho thấy rõ Germany, France, Netherlands/Belgium, Italy, Turkey, Egypt, Brazil, Rio de la Plata, Chile… nhưng OCR của các cột và hàng bị lệch nghiêm trọng ở một số vùng. Không trích các con số chưa thể gắn chắc chắn với đúng nước/năm. Đây là nguồn để đối chiếu ảnh trang gốc ở một lượt tiếp theo, không phải dữ liệu đã khóa.

### 4.3 Hướng thương mại có bằng chứng

- Thị trường châu Âu lục địa là đầu ra quan trọng: Pháp có trị số lớn trong bảng Woodbury, Đức và Hà Lan nhỏ hơn nhưng liên tục.
- Bảng Woodbury xác nhận có các tuyến sang India/China, South America/Mexico, Spain, Russia và Brazil ít nhất ở 1834–1835.
- Một phần đáng kể hàng sang Đức/Hà Lan/Russia là yarn/twist để dệt tiếp tại điểm đến; do đó cần tách hàng trung gian (yarn) khỏi manufactures/cloth trong engine.
- Chưa có số lượng yard theo điểm đến đủ sạch trong lượt này. Không dùng giá trị dollars làm số lượng yard.

## 5. Tỷ lệ xuất khẩu so với tiêu thụ nội địa

- Baines 1835, printed p. 112, ghi:
  - Cotton-wool imported in 1833: **303,726,199 lbs**.
  - British cotton manufactures exported in 1833: **£18,486,400 real or declared value**.
- Hai số này đo hai loại đại lượng khác nhau (đầu vào thô theo khối lượng và hàng thành phẩm theo giá trị), không cho biết tổng output vật lý hay giá trị tiêu thụ trong nước.
- Baines chương XV (printed pp. 363 ff.) nói thống kê ngành rất không hoàn chỉnh và bàn nhiều ước lượng của Burn/Kennedy; cần một chuỗi production value cùng cơ sở để tính tỷ lệ.
- Chưa trích được bảng sản lượng/giá trị tiêu thụ nội địa có cùng năm, cùng loại hàng và cùng hệ giá. Vì vậy:
  - `export share of total cotton output`: **unknown**.
  - `domestic consumption share`: **unknown**.
  - Không lấy “một nửa tổng xuất khẩu Anh là cotton goods” từ các bài bình luận báo chí hoặc lấy £18.486m chia cho tổng giá trị hàng hóa xuất khẩu chung để suy ra share sản lượng.
- Kết luận an toàn: xuất khẩu cotton manufacture là một dòng thương mại lớn và đã có giá trị khai báo nhiều triệu bảng vào năm 1833; không thể kết luận tỷ lệ output exported từ dữ liệu đã xác minh ở đây.

## 6. Các ràng buộc nghiệm thu đề xuất cho ECON-03

Đây là đề xuất thiết kế/kiểm thử Victori3, không phải số liệu lịch sử hoặc cơ chế Victoria 3.

1. **Raw cotton import dependency:** ở cấu hình lịch sử Anh 1836, nguồn bông nội địa không đủ để cấp toàn bộ ngành dệt; engine phải cho nhập từ thị trường nước ngoài khi có tuyến thương mại và độ mở phù hợp.
2. **Origin mix constraint:** trong mô hình cân bằng dài hạn, Hoa Kỳ là nguồn lớn nhất; Brazil là nguồn thứ hai đáng kể; India/East Indies cũng có thể là nguồn đáng kể. Không khóa tỷ lệ chính xác từ bảng có đơn vị/định dạng không tương thích.
3. **No artificial import ceiling:** nhu cầu nhập nguyên liệu thiết yếu của Anh không được chặn cứng ở mức `shortage × openness` nếu luật/thuế quan và năng lực vận tải cho phép lượng nhập cao hơn; thay vào đó tính từ nhu cầu nhập, chi phí landed, capacity/route, tariff và khả năng cung ứng của đối tác.
4. **Export destinations:** phải có demand/export flows tới ít nhất một số thị trường châu Âu (France, Germany, Netherlands), và các thị trường ngoài châu Âu (India/China, South America/Mexico, Spain/Russia/Brazil) khi có điều kiện.
5. **Intermediate vs final goods:** luồng yarn/twist phải tách khỏi cloth; đặc biệt không tính toàn bộ hàng tới Germany/Netherlands/Russia là vải thành phẩm.
6. **Value is not quantity:** bảng giá trị dollars/pounds không được chuyển thành yards hoặc pounds cotton nếu không có giá đơn vị và loại hàng tương ứng.
7. **Domestic share guardrail:** không đặt tỷ lệ xuất khẩu/nội địa theo một số lịch sử giả định. Để `unknown` đến khi có output value và domestic consumption cùng cơ sở thống kê.

## 7. Những khoảng trống còn lại

- Bảng G của Woodbury: đối chiếu ảnh scan các phân số typography bất thường để đọc chính xác từng cột 1830–1835.
- Đơn vị tuyệt đối của bảng Liverpool circular 1835–1836: cần kiểm tra trang scan gốc hoặc circular gốc trước khi quy đổi.
- Bảng trade returns pp. 130–133: OCR lệch; cần đọc ảnh scan để trích đúng lượng yard và declared value cho từng nước/năm 1831–1840.
- Xuất khẩu sang Hoa Kỳ: các ô Woodbury để trống; cần một nguồn khác xác minh lượng/giá trị hợp pháp và/hoặc buôn lậu. Hiện `unknown`, không phải zero.
- Tỷ lệ sản lượng cotton manufacture xuất khẩu so với tiêu thụ nội địa: `unknown`.
- Giá trị hàng xuất khẩu theo loại (yarn/twist, grey cloth, printed cloth, hosiery/lace) cho mỗi destination: `unknown` trừ các phân biệt định tính trong ghi chú Woodbury.

## 8. Nguồn tham khảo

1. Levi Woodbury, *Letter from the Secretary of the Treasury… on the cultivation, manufacture, and foreign trade of cotton* (1836), e-rara / ETH-Bibliothek: https://doi.org/10.3931/e-rara-73156 — Table G, pp. 53–54; Table N, pp. 97–100; notes.
2. *Merchants’ Magazine*, vol. XII, no. IV (April 1845), p. 392, “Import of Cotton into Great Britain, in Ten Years”: https://fraser.stlouisfed.org/files/docs/publications/merchmag/merchmag_v12_184504.pdf.
3. Edward Baines, *History of the Cotton Manufacture in Great Britain* (1835), Wellcome Collection Public Domain Mark: https://wellcomecollection.org/works/k7k5pfwc; scan https://commons.wikimedia.org/wiki/File:Edward_Baines,_History_of_the_cotton_manufacture,_1835.pdf.
4. *Trade and Finance of the United Kingdom*, cotton manufactures export tables, printed pp. 130–133: https://upload.wikimedia.org/wikipedia/commons/6/62/Trade_and_Finance_of_the_United_Kingdom_%28IA_dli.granth.77949%29.pdf.

## 9. Handoff

- Output: `docs/research/history/CG22_1830S_COTTON_TRADE_FLOWS_PD_VI.md`
- Status: research handoff completed with explicit unknowns and data-quality caveats.
- No game code or CSV data was modified.
- No build/test was run; this is a source-research deliverable.
- HY-01 v2 remains a separate OPEN task. Latest branch CSV/progress artifacts must be checked before adding further rows; do not treat the 40-polity threshold as met.
