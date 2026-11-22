# CG-20 — Hiệu chỉnh kinh tế Anh thập niên 1830: giá tương đối, đầu vào và dệt thủ công/cơ khí

- Ngày: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Trạng thái: **nghiên cứu sơ bộ có nguồn sơ cấp; chưa đủ dữ liệu để khóa toàn bộ calibration ECON-CAL-01**
- Phạm vi ưu tiên: Anh, khoảng 1830–1840. Không suy rộng sang Pháp/Phổ/Mỹ nếu chưa có chuỗi so sánh tương thích.
- Quy ước: số liệu quan sát, số liệu dẫn lại, phép tính dẫn xuất và dữ liệu chưa tìm thấy được phân biệt. Không điền số giả định vào `unknown`.

## 1. Kết luận điều hành

Đã tìm được các nguồn thế kỷ XIX có thể kiểm tra trực tiếp, đặc biệt Edward Baines (1835), G. R. Porter (1836), Thomas Tooke (1838), Charles Babbage (1832) và chứng cứ điều trần Quốc hội Anh năm 1839. Chúng cho thấy:

1. Có cơ sở lịch sử cho việc **giá nguyên liệu, chi phí sợi và giá thành hàng dệt thay đổi rất mạnh theo phẩm cấp và cơ giới hóa**; không thể dùng một hệ số cotton→yarn→cloth duy nhất cho mọi loại vải.
2. Bằng chứng định lượng đủ tốt cho **cotton thô và chi phí kéo sợi năm 1830**: một lời khai của John Kennedy trước Quốc hội so sánh giá cotton 2s/lb (1812) với 10d/lb (1830); chi phí lao động kéo sợi tương ứng 1s6d và 1s0½d/lb; tổng chi phí sợi được nêu là 3s6d và 1s10½d/lb. Đây là so sánh 1812/1830, không phải giá quan sát năm 1836.
3. Baines ghi nhận khoảng **240.000–250.000 thợ dệt cotton thủ công** trong khoảng 1820–1833 (con số được các tác giả hiện đại dẫn lại từ Baines, pp. 235–237), trong khi năm 1833 có ít nhất **100.000 power looms**. Đây không phải tỷ lệ lao động thủ công/nhà máy: một máy dệt không tương đương một công nhân và một công nhân nhà máy có thể trông coi nhiều máy.
4. Một lời khai kỹ thuật được trích lại từ Baines mô tả 1 thợ dệt thủ công làm khoảng 2 pieces/tuần; công nhân power-loom trông 2 máy làm 7 pieces/tuần vào 1823; đến 1833, 4 máy với một tenter làm 18–20 pieces/tuần. Đây là chỉ báo năng suất theo loại vải/khổ và cách tổ chức cụ thể, không phải năng suất bình quân toàn ngành.
5. Chưa tìm được chuỗi sơ cấp có cùng năm, cùng đơn vị và cùng phẩm cấp cho cả **bông thô → sợi → vải**, cũng chưa tìm được tỷ trọng sản lượng vải thủ công so với nhà máy. Các trường này hiện phải để `unknown`.
6. Giá than, gang, sắt thanh có vài điểm chuẩn nhưng đơn vị và địa điểm khác nhau. Không gộp chúng thành một chuỗi thống nhất nếu chưa xác minh loại than, gross/net ton, chất lượng gang và giá tại mỏ hay tại lò.

**Khuyến nghị tạm thời cho ECON-CAL-01:** dùng dữ liệu dưới đây như các điểm neo độc lập để kiểm tra độ lớn và xu hướng; không dùng chúng để tính ngược một recipe chính xác duy nhất. Tắt mặc định cơ chế siteOperations cho tới khi calibration theo nhiều thị trường và nhiều loại hàng vượt qua kiểm thử.

## 2. Nguồn sơ cấp và quyền sử dụng

### CG20-S01 — Edward Baines, *History of the Cotton Manufacture in Great Britain* (London, 1835)

- Bản ghi Wellcome: https://wellcomecollection.org/works/k7k5pfwc
- Bản ghi và scan PDF Commons: https://commons.wikimedia.org/wiki/File:Edward_Baines,_History_of_the_cotton_manufacture,_1835.pdf
- Internet Archive identifier: https://archive.org/details/cottonmanufact00bain
- Thư mục: London, H. Fisher, R. Fisher, and P. Jackson, 1835; bản scan 610 trang.
- Quyền: Wellcome ghi **Public Domain Mark** và cho phép dùng không hạn chế theo luật bản quyền; Commons ghi PD tại Hoa Kỳ. Trước khi phân phối nguyên scan hoặc ảnh scan, vẫn giữ provenance và kiểm tra phạm vi pháp lý của nơi phát hành. Dữ kiện lịch sử trong tác phẩm thế kỷ XIX được trích dẫn theo trang in, không sao chép nguyên cuốn scan vào game.
- Trang liên quan: pp. 235–237 được nghiên cứu hiện đại dẫn là phần Baines bàn về số thợ dệt thủ công và power looms; cần đối chiếu ảnh trang gốc trước khi biến thành số liệu sản xuất.
- Baines là nguồn chính cho số lượng thợ dệt và máy dệt; không tự suy ra thị phần sản lượng từ số đầu người hoặc số máy.

### CG20-S02 — G. R. Porter, *The Progress of the Nation* (London, 1836)

- Bản scan PDF: https://escoe-website.s3.amazonaws.com/wp-content/uploads/2018/10/18113758/Porter-The-Progress-of-the-Nation-1836-edition.pdf
- Nội dung mục lục xác nhận chương về dệt có cotton nhập khẩu, chi phí sợi giảm, power looms, chi phí dệt, số power looms, hand-loom weavers và lao động trong nhà máy (bản in, Section II, Chapter II; bắt đầu khoảng p. 187).
- Porter cũng ghi chuỗi chỉ số giá chung: từ đầu 1833 đến tháng 8/1836, mức giá bình quân tăng gần 35%; đây là chỉ số giá chung mô tả trong phần Currency, không phải giá cotton/yarn/cloth.
- Quyền: bản scan mang thông báo Google Books nói sách đã vào public domain nhưng đồng thời yêu cầu dùng file Google Book Search cho mục đích cá nhân, phi thương mại và duy trì watermark. Vì vậy không coi điều khoản truy cập scan là giấy phép tái phân phối thương mại; chỉ dùng để nghiên cứu/đối chiếu, không đóng gói file scan.
- Chưa trích được bảng giá yarn/cloth trong chương dệt ở dạng văn bản có thể xác minh đủ cột; không tự điền số.

### CG20-S03 — Thomas Tooke, *A History of Prices… from 1793 to 1837*, vol. II (1838)

- Bản PDF scan: https://upload.wikimedia.org/wikipedia/commons/8/89/A_history_of_prices%2C_and_of_the_state_of_the_circulation%2C_from_1793_to_1837%3B_preceded_by_a_brief_sketch_of_the_state_of_the_corn_trade_in_the_last_two_centuries_%28IA_historyofpriceso02took%29.pdf
- Bản in, vol. II, Chapter X, pp. 225–274: giá và thị trường từ đầu 1833 đến cuối 1837; mục 3 (p. 257) là giá nông sản 1836–1837; mục 4 (p. 264) là thị trường hàng hóa khác 1836–1837.
- Đã kiểm tra phần mục lục và các đoạn nói về cotton: Tooke phân tích biến động cotton goods/raw cotton và vai trò cải tiến máy móc, nhưng bảng giá cotton/yarn/cloth cho đúng 1836 chưa được trích xuất và kiểm chứng trong lượt này.
- Dùng để tiếp tục trích giá theo đúng trang in; không coi mọi mức giá hàng hóa trong sách là cùng loại giá (wholesale, retail, institutional).

### CG20-S04 — Charles Babbage, *On the Economy of Machinery and Manufactures* (1832)

- Bản đọc trực tuyến: https://en.wikisource.org/wiki/On_the_Economy_of_Machinery_and_Manufactures/Chapter_17
- Bản PDF scan: https://upload.wikimedia.org/wikipedia/commons/7/7d/On_the_economy_of_manufactures_%28IA_oneconomyofmanuf00babbiala%29.pdf
- Bảng “Average Price of” trong §205 ghi giá trung bình tại Birmingham:
  - Wheat per quarter: 1830 £3 14s 6d; 1832 £2 19s 3d.
  - English pig iron: 1830 £4 10s 0d per ton; 1832 không có số.
  - English bar iron: 1830 £6 0s 0d per ton; 1832 £5 0s 0d per ton.
  - Swedish bar iron tại London: 1830 £13 15s 0d; 1832 £13 2s 0d per ton, chưa gồm thuế nhập khẩu 4–6½ guineas? (bảng ghi £4 đến £6 10s; phải đọc nguyên chú thích trước khi chuyển thành dữ liệu).
- Cùng sách, bảng giá vật tư tại các mỏ Cornwall ghi than năm 1830 là 51s/weigh (đơn vị in là “wey”), năm 1832 là 40s/wey; common bar iron 7s/cwt năm 1830 và 6s6d/cwt năm 1832. Đây là giá giao tại mỏ Cornwall, không thể so trực tiếp với giá mỗi tấn tại Birmingham.
- Các giá là điểm chuẩn 1830/1832, không phải 1836. Không nội suy tuyến tính nếu chưa có chuỗi bổ sung.

### CG20-S05 — Lời khai John Kennedy, Hansard, 15 March 1839

- Trang Hansard: https://hansard.parliament.uk/Commons/1839-03-15/debates/cdcb68d0-3bce-4cb8-9873-3916337610e8/CommonsChamber
- Lời khai so sánh giá thành kéo sợi cotton tại Anh:
  - 1812: cotton 2s/lb; labour 1s6d/lb; cost of manufactured article 3s6d/lb.
  - 1830: cotton 10d/lb; labour 1s0½d/lb; cost of manufactured article 1s10½d/lb.
- Người khai nói giả định tiền công dùng trong phép tính là 20d/ngày cho mỗi người được thuê, gồm nam, nữ và trẻ em; giảm chi phí lao động trên mỗi lb là do năng suất/hiệu quả kỹ thuật, không phải do giảm đơn giá ngày công theo phép tính này.
- Phạm vi: so sánh chi phí sản xuất yarn theo một loại/định nghĩa của Kennedy; không phải giá bán lẻ cotton, không phải một giá chuẩn mọi phẩm cấp sợi và không phải giá vải hoàn chỉnh.
- Đây là biên bản nghị viện đương thời, dùng làm nguồn sơ cấp bổ sung; cần giữ nguyên mô tả lời khai và không biến thành giá giao dịch phổ quát.

## 3. Bảng dữ liệu có thể dùng làm điểm neo

| Biến | Quan sát | Đơn vị/địa điểm | Nguồn và trang | Đánh giá |
|---|---:|---|---|---|
| Cotton thô (1812) | 2s = 24d | pence/lb; theo phép tính của Kennedy | Hansard, 15-03-1839, lời khai Kennedy | verified testimony |
| Cotton thô (1830) | 10d | pence/lb; theo phép tính của Kennedy | Hansard, 15-03-1839 | verified testimony |
| Labour cost in spinning (1812) | 1s6d = 18d | pence/lb yarn | Hansard, 15-03-1839 | verified testimony |
| Labour cost in spinning (1830) | 1s0½d = 12.5d | pence/lb yarn | Hansard, 15-03-1839 | verified testimony |
| Total yarn cost (1812) | 3s6d = 42d | pence/lb yarn | Hansard, 15-03-1839 | verified testimony |
| Total yarn cost (1830) | 1s10½d = 22.5d | pence/lb yarn | Hansard, 15-03-1839 | verified testimony |
| Wheat (1830) | £3 14s6d | per quarter; Birmingham price series table | Babbage 1832, §205 | verified table |
| Wheat (1832) | £2 19s3d | per quarter; Birmingham price series table | Babbage 1832, §205 | verified table |
| Pig iron (1830) | £4 10s | per ton; Birmingham | Babbage 1832, §205 | verified table |
| Pig iron (1832) | unknown | per ton; Birmingham | Babbage 1832, §205 | blank in table |
| Bar iron (1830) | £6 | per ton; Birmingham | Babbage 1832, §205 | verified table |
| Bar iron (1832) | £5 | per ton; Birmingham | Babbage 1832, §205 | verified table |
| Coal (1830) | 51s | per wey; delivered at Cornwall mines | Babbage, table “Prices of principal Materials…” | verified table; wey conversion unknown |
| Coal (1832) | 40s | per wey; delivered at Cornwall mines | Babbage, same table | verified table; wey conversion unknown |
| Cotton handloom weavers | 240,000–250,000 | persons; Great Britain, estimates for 1820–1833 | Baines 1835, pp. 235–237 (cited in later literature) | supported; estimate, not census |
| Power looms | at least 100,000 | machines; Britain, by 1833 | Baines 1835, pp. 235–237 (cited in later literature) | supported; machine count, not worker count |
| Output, handloom | 2 pieces/week | a specified shirting fabric | Baines-derived statement; exact page/image check pending | supported, narrow example |
| Output, power loom | 7 pieces/week on 2 looms (1823); 18–20 pieces/week on 4 looms + tenter (1833) | same referenced fabric family, but process/time differs | Baines-derived statement; exact page/image check pending | supported, narrow example |
| 1836 raw cotton price | unknown | pence/lb, England | no direct primary table extracted yet | unknown |
| 1836 yarn price | unknown | pence/lb, England | no direct primary table extracted yet | unknown |
| 1836 cloth price | unknown | pence/yard or per piece, quality-specific | no direct primary table extracted yet | unknown |
| Cotton consumed per lb of yarn/cloth | unknown | physical input/output ratio | no verified source observation yet | unknown |
| Cotton waste/loss rate | unknown | percentage | no verified source observation yet | unknown |
| Coal per ton pig iron | unknown | ton coal / ton pig iron | no compatible process-specific observation extracted | unknown |
| Ore per ton pig iron | unknown | ton ore / ton pig iron | no compatible process-specific observation extracted | unknown |
| Handloom share of total cloth output | unknown | % output, not workforce | no comparable output series extracted | unknown |
| Factory share of total cloth output | unknown | % output, not workforce | no comparable output series extracted | unknown |

## 4. Phép tính dẫn xuất (không phải số quan sát độc lập)

Từ lời khai Kennedy:

- Raw cotton price: 24d → 10d/lb, giảm khoảng **58.3%** giữa hai mốc.
- Labour cost per lb yarn: 18d → 12.5d, giảm khoảng **30.6%**.
- Total yarn cost: 42d → 22.5d/lb, giảm khoảng **46.4%**.
- Raw cotton share in total yarn cost theo phép tính: 24/42 = **57.1%** (1812); 10/22.5 = **44.4%** (1830). Đây là tỷ trọng chi phí trong ví dụ của Kennedy, không phải tỷ lệ nguyên liệu vật lý hay cấu trúc chi phí toàn ngành.
- Nếu lấy output theo tuần được dẫn từ Baines: 7 pieces / 2 looms = 3.5 pieces/loom-week năm 1823; 18–20 pieces / 4 looms = 4.5–5 pieces/loom-week năm 1833. Không so sánh trực tiếp với 2 pieces/handloom-week để suy ra chính xác năng suất lao động, vì một công nhân/tenter có thể quản lý nhiều máy và loại vải/ca làm việc cần được xác nhận.
- 100,000 power looms / 240,000–250,000 handloom weavers = 0.40–0.42 máy trên mỗi thợ thủ công được ước tính. **Không gọi đây là tỷ trọng sản lượng hay tỷ trọng việc làm nhà máy.**

## 5. Đầu vào cho ECON-CAL-01

### 5.1 Cotton chain

- Có thể dùng các mốc Kennedy 1812/1830 để xác nhận xu hướng chi phí kéo sợi giảm mạnh cùng với raw cotton và productivity.
- Không dùng 10d/lb làm raw cotton price mặc định cho năm 1836; đó là mốc 1830 trong lời khai, còn Tooke/Porter cho thấy thị trường tiếp tục biến động trong giai đoạn sau.
- Không suy ra giá vải từ giá sợi bằng một markup cố định. Dệt, hoàn tất, in/nhuộm, phẩm cấp, khổ vải, mật độ sợi và chi phí vận chuyển/thuế đều làm thay đổi giá.
- Bản ghi giá theo sản phẩm phải phân biệt: raw cotton, yarn count/quality, grey cloth, finished/printed cloth; wholesale/market quotation khác với retail.

### 5.2 Coal → pig iron → bar iron

- Babbage cung cấp giá điểm chuẩn, nhưng than được ghi theo wey tại mỏ Cornwall, gang/sắt theo tấn tại Birmingham. Đây không phải một chuỗi giá đầu vào/đầu ra cùng địa điểm.
- Giá bar iron/pig iron không cho biết lượng than hoặc quặng tiêu hao. Không thể tính recipe vật lý từ giá tương đối.
- Trước khi tạo recipe, cần một nguồn kỹ thuật đương thời cho furnace type, fuel type (charcoal/coke), ore grade, blast method, yield và đơn vị ton. Nếu không có, input coefficient vẫn unknown; chỉ dùng giá như calibration check riêng.

### 5.3 Handloom vs factory

- Phải tách 4 biến: số người làm handloom; số người làm trong spinning/weaving mills; số power looms; sản lượng vật lý theo loại vải.
- Baines count 240–250k là ước lượng người dệt thủ công; 100k là số máy, không phải 100k công nhân. Không lấy tỷ lệ hai số để kết luận 71% thủ công/29% nhà máy.
- Năng suất 2 pieces/tuần so với 18–20 pieces/tuần là một ví dụ công nghệ cụ thể, không đại diện mọi hàng dệt. Tỷ trọng sản lượng quốc gia vẫn unknown nếu thiếu tổng lượng vải theo hai phương thức.
- Tác động chuyển đổi lao động nên được mô phỏng qua thay đổi nhu cầu nghề, thu nhập/đơn giá và khả năng chuyển nghề; không gán toàn bộ thợ thủ công thành công nhân nhà máy ngay khi thêm power looms.

## 6. Những điểm còn thiếu — giữ unknown

1. Raw cotton, yarn và cloth prices theo cùng thị trường/niên đại (ưu tiên 1835–1837) và cùng hệ đơn vị.
2. Phẩm cấp/đếm sợi (yarn count) và loại vải tương ứng để có thể so sánh giá.
3. Lượng bông đầu vào trên một lb yarn và lượng yarn trên một yard/piece cloth, bao gồm waste/breakage.
4. Than và quặng trên một tấn gang theo công nghệ cụ thể; gang trên một tấn sắt thanh.
5. Số lao động factory spinning/weaving có định nghĩa nhất quán để so với handloom weavers.
6. Tổng sản lượng vải thủ công và vải nhà máy để tính thị phần sản lượng.
7. Chuỗi giá/tiền công tương thích của Pháp, Phổ và Hoa Kỳ. Không dùng số Anh làm proxy cho các nước này.

## 7. Tác động và quyết định tạm thời

**Không đưa một bộ hệ số recipe mới vào game chỉ dựa trên các điểm dữ liệu này.** Các điểm 1830/1832 và lời khai 1839 đủ để phát hiện mô hình sai cấp độ (ví dụ raw cotton và cloth bị định giá cùng một base price mà không có bước chế biến/quality differentiation), nhưng chưa đủ để xác định chính xác toàn bộ hệ số đầu vào và giá bán năm 1836.

Đề nghị Claude dùng CG-20 theo hai lớp:
- **Calibration constraints (được hỗ trợ):** thứ tự chi phí và mức chênh tương đối phải phản ánh các bước kéo sợi/dệt; chi phí yarn trong ví dụ Kennedy năm 1830 thấp hơn đáng kể so với 1812; máy dệt cơ khí có năng suất máy/tuần cao hơn dệt tay trong ví dụ Baines.
- **Unknown parameters:** recipe vật lý, waste rate, 1836 exact prices, handloom/factory output shares và coal/ore input coefficients không được hardcode như dữ kiện lịch sử.

Chỉ bật `siteOperations` khi các kịch bản ECON-02 không tạo ra tình trạng gần như toàn bộ nhà máy dệt thua lỗ do recipe/relative-price calibration, và khi các điểm chuẩn lịch sử nêu trên được tái hiện trong cùng đơn vị/thị trường.

## 8. Nguồn nghiên cứu bổ trợ (không thay thế nguồn sơ cấp)

- Acemoglu & Johnson, “Learning from Ricardo and Thompson…” (2024), PDF: https://economics.mit.edu/sites/default/files/2024-04/Learning%20from%20Ricardo%20and%20Thompson%20-%20Machinery%20and%20Labor%20in%20the%20Early%20Industrial%20Revolution%20-%20and%20in%20the%20Age%20of%20AI.pdf — footnote 23 dẫn Baines 1835 pp. 235–237 cho 100k power looms năm 1833 và 240–250k handloom weavers trong 1820–1834.
- “The Statistics of Wages in the Nineteenth Century. Part XIX — The Cotton Industry” (1910), PDF: https://zenodo.org/record/1941698/files/article.pdf — tổng hợp các ước lượng việc làm và dẫn lời Baines về số pieces/tuần; dùng như nguồn truy vết, không nâng thành số quan sát sơ cấp.
- Hansard là nguồn biên bản nghị viện đương thời, bổ sung trực tiếp lời khai Kennedy về chi phí cotton/yarn năm 1812 và 1830.

---
**Trạng thái kiểm chứng:** đây là báo cáo nghiên cứu sơ bộ, không phải dataset nhúng game. Không chạy build/test vì chỉ thay đổi tài liệu nghiên cứu.