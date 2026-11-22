# CG-24 — Quy mô công nghiệp và nguyên liệu, khoảng 1830–1836

- Ngày: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Yêu cầu: MSG-021, P0
- Mục đích: cung cấp tỷ lệ tương đối để hiệu chỉnh số cấp công trình khởi đầu 1836; không nhúng nguyên bảng lịch sử vào game.
- Nguyên tắc: ưu tiên tác phẩm/báo cáo thế kỷ XIX public domain; phân biệt thống kê nhà máy, lao động thủ công, sản lượng, vận chuyển và ước lượng. Không chuyển đổi đơn vị hoặc lấp khoảng trống bằng dữ liệu thứ cấp hiện đại mà không ghi rõ.

## 1. Kết luận điều hành

1. **Dữ liệu công nhân nhà máy dệt Anh năm 1835 đã có số trực tiếp từ báo cáo Government Inspectors of Factories:** cotton 1,262 nhà máy / 220,134 lao động; woollen 1,313 / 71,274; flax 347 / 33,283; silk 238 / 30,682. Tổng headcount bốn nhóm là 355,373 lao động. Lưu ý số lượng cơ sở có bất nhất: cộng bốn dòng được 3,160, trong khi bản Hansard tường thuật cùng returns ghi tổng 3,236 (bao gồm 76 cơ sở trống). Không dùng tổng số nhà máy hoặc bình quân lao động/nhà máy để calibration cho tới khi đối chiếu Parliamentary return gốc. Bảng được in trong *Merchants’ Magazine* (July 1840), p. 93, nói rõ số liệu 1835 lấy từ các báo cáo thanh tra nhà máy của Chính phủ.
2. Số này là **factory hands**, không gồm toàn bộ lao động thủ công tại nhà. Vì vậy không được gộp thợ dệt thủ công với công nhân nhà máy thành một tổng nếu chưa đồng nhất phạm vi. Porter (1836) cũng cảnh báo census 1831 không phân loại chính xác các ngành nghề; một phần lao động mỏ, đường sá, kênh đào và vận tải được ghi thành nhóm labourers không nông nghiệp.
3. Với số engine Claude báo cáo: Anh có 855 cấp `textile_mill` × 2,000 lao động = 1,710,000 lao động nhà máy. So với 220,134 cotton factory hands năm 1835, mức engine là **7.77 lần**. Ngay cả khi so với toàn bộ 355,373 lao động của bốn ngành dệt nhà máy, 1.71m vẫn là 4.81 lần; tuy nhiên đây là so sánh không đồng nhất ngành, chỉ để nhận diện quy mô sai.
4. Porter/Baines có thêm các chỉ dấu cho lao động ngoài nhà máy và cơ giới hóa cotton; chúng không thay thế bảng factory inspectors. Cần giữ riêng factory workers, handloom workers, power looms và số lượng cơ sở.
5. **Bông Mỹ:** contemporary gazetteer (1837) ghi crop Mỹ 1834 là 460m lb và cho sản lượng bang: Alabama 85m, Mississippi 85m, Georgia 75m, South Carolina 65.55m, Louisiana 62m, Tennessee 45m. Sáu bang này cộng 417.55m lb; phần còn lại 42.45m lb không được phân bổ ở bảng này. Không ép phần dư vào các bang khác.
6. **Gang (pig iron):** bảng tổng hợp của James M. Swank (1902), trích official Government statistics của Anh, cho Great Britain: 1830 677,417 gross tons; 1833 700,000; 1836 1,000,000. Với Hoa Kỳ, bảng cho 1830 165,000 gross tons, nhưng chú thích rõ đây là ước tính của nhà thống kê đương thời, không phải census. Dữ liệu Mỹ 1833–1836 có trong một nghiên cứu hiện đại nhưng không đáp ứng yêu cầu nguồn PD, vì vậy không đưa vào bộ số liệu accepted.
7. **Than:** chưa tìm được chuỗi production toàn quốc Anh 1830–1836 đủ điều kiện. Swank (1902) nói thống kê official coal production của Great Britain chỉ bắt đầu năm 1854. Porter (1836) có shipment series theo cảng và vùng 1819–1835, còn *Standard Library Cyclopaedia* có lượng coal đến London 1832–1836; cả hai là vận chuyển/nhập cảng, không phải tổng sản lượng mỏ. Do đó production coal 1830–1836 vẫn `unknown`.
8. **Pháp, Bỉ, Phổ/Đức:** trong nguồn PD đã kiểm tra, chưa tìm được chuỗi đủ chắc cho công nhân nhà máy theo ngành hoặc output coal/pig iron từng năm 1830–1836. Swank cho thấy các chuỗi chính thức/được xác minh của Đức và Pháp chỉ bắt đầu từ các mốc muộn hơn (ví dụ pig iron Germany từ 1844; coal Germany/France từ 1848 hoặc muộn hơn). Ghi `unknown`, không nội suy ngược.
9. **Trung Quốc/Ấn Độ:** Woodbury Table A (1836) cho các vùng rộng, không cho output theo tỉnh/bang hoặc polity: Ấn Độ 185m lb và “Rest of Asia” 110m lb năm 1834. Không được gán toàn bộ Rest of Asia cho Qing/Trung Quốc. Dữ liệu cotton crop theo địa phương ở Trung Quốc/Ấn Độ cho 1830–1836: `unknown` trong bộ nguồn PD này.

## 2. Công nhân nhà máy dệt — Great Britain, 1835

### 2.1 Factory Inspectors’ Reports, số liệu được in lại năm 1840

Nguồn: *Merchants’ Magazine*, vol. III, no. I (July 1840), printed p. 93, mục “Increase of British Manufactures”. Bài ghi rằng Government Inspectors of Factories đã công bố returns về số mills và hands employed trong năm 1835; returns năm 1838 được trình Parliament và in gần đây. Bảng 1835/1838 được chép trong bài.

| Ngành | Nhà máy 1835 | Công nhân 1835 | Bình quân người/nhà máy |
|---|---:|---:|---:|
| Cotton | 1,262 | 220,134 | 174.5 |
| Woollen | 1,313 | 71,274 | 54.3 |
| Flax | 347 | 33,283 | 95.9 |
| Silk | 238 | 30,682 | 128.9 |
| **Tổng** | **3,160** | **355,373** | **112.5** |

Bảng so sánh 1838 trong cùng nguồn: cotton 1,815 / 259,301; woollen 1,738 / 86,446; flax 392 / 43,487; silk 268 / 34,318. Đây là bằng chứng về mở rộng nhanh trong giai đoạn 1835–1838, không phải số 1836. Hansard ngày 12-3-1839 cũng chép returns này, nêu rõ 42 cotton, 9 woollen và 25 silk factories đang trống (76 tổng cộng), nhưng lại ghi tổng 3,236 cơ sở, không khớp phép cộng 3,160 của bốn dòng. Vì vậy giữ headcount theo từng ngành; factory count và average workers/factory chưa được khóa.

**Chất lượng nguồn:** đây là một ấn phẩm đương thời public domain (1840) chép lại số liệu báo cáo chính phủ. Nên dẫn là “Government Inspectors’ returns, as transcribed in Merchants’ Magazine (1840)”, không gọi bản tạp chí là báo cáo thanh tra gốc. Cần tìm Parliamentary Paper gốc nếu sau này cần audit từng vùng/thanh tra.

### 2.2 So sánh với engine khởi tạo

Từ handoff MSG-021, Claude báo:
- `textile_mill`: 855 levels.
- 2,000 workers/level.
- Tổng mô phỏng: 855 × 2,000 = **1,710,000 workers**.
- Cotton factory hands lịch sử 1835: **220,134**.
- Tỷ lệ engine / cotton factory workforce: 1,710,000 / 220,134 = **7.77×**.
- Số factory workers ở cả bốn ngành dệt: 355,373; 1.71m / 355,373 = **4.81×** (không phải so sánh cùng một ngành).

Không suy ra bình quân lao động/cotton factory từ các con số hiện có do số cơ sở trống và tổng số cơ sở bị bất nhất giữa bảng/tường thuật. Dùng headcount trực tiếp để hiệu chỉnh quy mô lao động; không map 1:1 số building levels sang số cơ sở lịch sử nếu engine định nghĩa level khác.

### 2.3 Phân biệt lao động nhà máy và handloom

- Edward Baines, *History of the Cotton Manufacture in Great Britain* (1835), các phần về labour employed in spinning/weaving, power-looms và hand-loom weavers, là nguồn đương thời quan trọng để phân biệt nhà máy cơ giới với dệt thủ công tại nhà.
- Không cộng số handloom weavers vào factory-hands table: phạm vi thống kê, thời điểm và định nghĩa việc làm khác nhau.
- Số lượng power looms là thiết bị, không phải số người. Số người/loom phụ thuộc ca làm, quy trình, spinning vs weaving và mức cơ giới hóa.
- Trong lượt này chưa trích được một con số handloom workers đủ ổn định, cùng năm và cùng phạm vi từ bản scan Baines để đưa vào acceptance table. **Handloom workforce exact 1835: `unknown` trong dữ liệu đã khóa.**
- Porter (1836), *The Progress of the Nation*, Chapter II “Manufactures”, printed pp. 187 onward, mô tả power looms, hand-loom weavers và lao động spinning/weaving; ông dùng nguồn official/parliamentary khi có thể. Đây là nguồn để mở rộng trích xuất trang ảnh, không được dùng một OCR không hoàn chỉnh làm số chốt.

## 3. Census và công nhân mỏ / luyện kim

Porter, *The Progress of the Nation* (1836), Chapter I “Occupations of the People”, printed pp. 62–68:
- Mô tả census 1831 ghi số families, không phải tổng số lao động chi tiết theo từng ngành.
- Porter nói việc phân loại “trade, manufactures and handicraft” có độ bất định; các loại nghề không thể chia thành các cột đáng tin cậy cho mọi địa phương.
- Ông nêu 608,712 nam giới trưởng thành làm các công việc hỗ trợ thương mại/sản xuất như mining, road-making, canal-digging và inland navigation, nhưng đây là nhóm rộng, không phải số thợ mỏ than hoặc công nhân gang thép.
- Porter cảnh báo danh mục nghề có những bất thường rõ rệt và không nên xem như bảng chính xác cho từng ngành.

Vì vậy:
- UK coal miners, ironworkers, blast-furnace workers, forge/puddling workers, 1833–1836: **unknown** từ các nguồn đã xác minh.
- France/US/Belgium/Prussia industrial workers by industry: **unknown** trong bộ nguồn PD đã kiểm tra.
- Không lấy số người làm mining/road/canal tổng hợp rồi gán hết cho coal miners.

## 4. Cotton production by US state — 1834

Nguồn: *A Complete Reference Gazetteer of the United States of North America* (1837), printed p. 7, phần “Agriculture”. Đây là một contemporary public-domain gazetteer; bảng nêu tổng crop và các bang lớn.

| Bang | Cotton crop 1834 (million lb) |
|---|---:|
| Alabama | 85.00 |
| Mississippi | 85.00 |
| Georgia | 75.00 |
| South Carolina | 65.55 |
| Louisiana | 62.00 |
| Tennessee | 45.00 |
| **Sáu bang trên** | **417.55** |
| **Tổng Hoa Kỳ** | **460.00** |
| **Phần dư chưa phân bổ trong bảng** | **42.45** |

Derived concentration:
- Alabama + Mississippi = 170m lb (36.96% US crop).
- Georgia + South Carolina = 140.55m lb (30.55%).
- Louisiana + Tennessee = 107m lb (23.26%).
- Sáu bang nêu trên = 90.77% US crop; phần dư 9.23% không phân bổ.
- Các phần trăm là phép chia số trong bảng gazetteer, không phải số liệu độc lập.

### Đối chiếu Woodbury 1836

Woodbury Table A, printed pp. 12–15, ước tính tổng crop Hoa Kỳ 1834 là **460m lb**, cùng tổng với gazetteer. Woodbury Table A cho các khu vực thế giới, không phải phân chia bang. Hai nguồn khớp ở tổng quốc gia; không cộng hai bảng với nhau.

## 5. Pig iron / gang — 1830–1836

### 5.1 Great Britain

James M. Swank, *Iron and Steel, Iron Ore, and Coal Statistics for the United States, Great Britain, Germany, France, and Belgium* (1902), printed p. 17, “Production of Pig Iron in Great Britain”. Swank nói bảng dưới đây là official Government statistics cho England, Scotland and Wales; Ireland không có iron industry đáng kể từ khoảng 1740.

| Năm | Pig iron (gross tons) |
|---|---:|
| 1830 | 677,417 |
| 1833 | 700,000 |
| 1836 | 1,000,000 |

Đây là ba mốc quan sát, không phải chuỗi annual đầy đủ. 1833 và 1836 là số tròn trong bảng nguồn; không tạo nội suy 1831, 1832, 1834, 1835.

### 5.2 United States

Swank, printed p. 13, “Production of Pig Iron in the United States”:
- 1830: **165,000 gross tons**.
- Swank ghi rõ 1820 và 1830 là estimates by early statisticians, vì thiếu census statistics; không phải census count.
- Không có 1833–1836 trong bảng.
- Một nghiên cứu kinh tế hiện đại đưa ra chuỗi revised estimates 1830–1836, nhưng không đáp ứng yêu cầu chỉ dùng nguồn public-domain/đương thời của CG-24. Không nhập các giá trị revised đó vào calibration evidence.

### 5.3 France, Belgium, Prussia/Germany

- Swank 1902 ghi pig iron Germany/Luxemburg năm 1844 là 171,000 metric tons (dẫn Dr. Wedding) và 1848 là 205,342 metric tons; do đó không có mốc 1830–1836 trong bảng.
- Swank có pig iron France và Belgium trong các phần sau, nhưng các chuỗi được trích xuất trong bảng bắt đầu muộn hơn giai đoạn yêu cầu; không có số 1830–1836 để dùng.
- Porter 1836 mô tả các ngành sản xuất Pháp và Đức nhưng chưa khóa được một bộ annual pig-iron quantities cùng đơn vị cho giai đoạn này.
- Vì vậy pig iron France/Belgium/Prussia 1830–1836: **unknown** trong bộ dữ liệu PD đã xác minh. Không dùng số liệu modern secondary làm số game.

## 6. Coal production và coal flows

### 6.1 Great Britain — production

Swank (1902), printed p. 18, nói bảng production of coal in Great Britain dựa trên reports of His Majesty’s inspectors of mines và **bắt đầu năm 1854**. Tức là chính compilation này không cung cấp annual official national coal production trước 1854.

Do đó:
- Great Britain coal production 1830–1836: **unknown** trong nguồn annual national production đã xác minh.
- Germany/France/Belgium: các chuỗi trong Swank bắt đầu muộn hơn, không có 1830–1836.
- United States: Swank ghi rõ authentic coal production statistics không sẵn có trước các census/USGS years từ 1870; 1830–1836 **unknown**.

### 6.2 Không nhầm shipment với production

- Porter (1836), *The Progress of the Nation*, Chapter V “Mining”, printed pp. 326 ff., có shipment series từ Newcastle/Sunderland, Stockton/Seaham và các cảng khác, cùng “produce of inland collieries”. Những bảng shipment đo hàng đi qua cảng, không phải tổng sản lượng mỏ toàn quốc.
- *The Standard Library Cyclopaedia of Political, Constitutional, Statistical and Forensic Knowledge* (ấn bản thế kỷ XIX, public domain), mục “Coal Trade of the Port of London”, ghi coal arrived at London:
  - 1832: 2,139,078 tons
  - 1833: 2,020,409 tons
  - 1834: 2,078,685 tons
  - 1835: 2,298,812 tons
  - 1836: 2,398,352 tons
- Đây chỉ là lượng coal tới cảng London, không phải sản lượng Anh, không phải toàn bộ tiêu thụ Anh và không được cộng với các cảng khác nếu chưa loại trùng.
- Có thể dùng như một benchmark cho logistics/demand tại London, không dùng làm production capacity.

## 7. Ấn Độ và Trung Quốc

Woodbury Table A (1836), printed pp. 12–15, ước tính crop 1834:
- India: **185m lb**.
- Rest of Asia: **110m lb**.

Đây là vùng thống kê rộng, không cho bang/tỉnh. Không được gán toàn bộ “Rest of Asia” cho Qing/China; nó có thể gồm nhiều khu vực khác. Không có một con số Trung Quốc độc lập đủ chắc chắn trong bộ nguồn PD đã khóa.

- India cotton crop by province 1830–1836: **unknown**.
- China/Qing cotton crop by province 1830–1836: **unknown**.
- Nếu engine có plantation level theo tỉnh, chỉ dùng Woodbury để ràng buộc tổng khu vực; phân bổ tỉnh phải đợi nguồn khác.

## 8. Gợi ý hiệu chỉnh và acceptance tests

Đây là đề xuất cho engine dựa trên bằng chứng lịch sử, không phải dữ liệu lịch sử bổ sung.

### 8.1 Employment scale

- Cotton factory employment UK 1835 benchmark: 220,134.
- Textile factory employment (cotton+woollen+flax+silk) 1835 benchmark: 355,373.
- Với 2,000 workers per `textile_mill` level, 855 levels tạo 1.71m workers. Điều này lớn hơn 7.77× cotton factory hands hoặc 4.81× toàn bộ bốn ngành dệt nhà máy.
- Test bắt buộc: tính employment từ `building_level × workers_per_level × employment_modifier`; không nhân lại cùng GDP productivity factor vào số lao động.
- Nếu engine muốn đại diện cả domestic handloom workers, phải có job/building type riêng hoặc một factor được hiệu chỉnh riêng; không đẩy toàn bộ vào factory jobs.

### 8.2 Cotton production allocation

- US 1834 world share trong Woodbury: khoảng 51.1%.
- US state crop 1834: AL 85m, MS 85m, GA 75m, SC 65.55m, LA 62m, TN 45m lb; 42.45m lb remainder unallocated.
- Woodbury Table A 1834: India 185m, Rest of Asia 110m; không gán Rest of Asia cho Qing.
- Test: US crop lớn nhất trong world supply; India đứng thứ hai theo vùng; Rest of Asia không tự động biến thành Qing-only production.

### 8.3 Iron and coal

- Pig iron Great Britain: 677,417 gross tons (1830), 700,000 (1833), 1,000,000 (1836).
- US pig iron: 165,000 gross tons (1830 estimate; confidence thấp hơn).
- Coal national output 1830–1836: unknown. Dùng London receipts/Porter shipments chỉ cho logistics/flows, không dùng làm national production.
- Test không được tạo coal output từ port shipments, cũng không suy ngược số công nhân mỏ từ tonnage nếu không có productivity evidence.

### 8.4 GDP productivity multiplier

MSG-021 nói hệ số GDP của Anh (6.5) nhân output nhà máy thêm khoảng 2.55 lần. CG-24 không tìm thấy bằng chứng lịch sử nào cho phép áp một hệ số GDP trực tiếp lên sản lượng vật chất của textile mill. Khuyến nghị:
- Tách GDP calibration khỏi physical output coefficient.
- GDP/worker có thể tác động wages/income/standard of living hoặc nominal value; không tự động nhân physical quantity of cotton cloth/coal/iron.
- Acceptance test phải so physical output, input consumption, employment và trade quantities trên cùng time basis; không chỉ so nominal GDP.
- Không tự ý đặt hệ số mới từ CG-24; Claude cần kiểm tra implementation và quyết định thay đổi trong ECON-03.

## 9. Bảng tổng hợp dùng cho calibration

| Country / region | Indicator | Year | Value | Unit | Status / caveat |
|---|---|---:|---:|---|---|
| Great Britain | Cotton factory hands | 1835 | 220,134 | persons | Government inspectors' returns transcribed 1840 |
| Great Britain | Woollen factory hands | 1835 | 71,274 | persons | Same source |
| Great Britain | Flax factory hands | 1835 | 33,283 | persons | Same source |
| Great Britain | Silk factory hands | 1835 | 30,682 | persons | Same source |
| United States | Cotton crop | 1834 | 460,000,000 | lb | Contemporary gazetteer; Woodbury corroborates total |
| Alabama | Cotton crop | 1834 | 85,000,000 | lb | State breakdown |
| Mississippi | Cotton crop | 1834 | 85,000,000 | lb | State breakdown |
| Georgia | Cotton crop | 1834 | 75,000,000 | lb | State breakdown |
| South Carolina | Cotton crop | 1834 | 65,550,000 | lb | State breakdown |
| Louisiana | Cotton crop | 1834 | 62,000,000 | lb | State breakdown |
| Tennessee | Cotton crop | 1834 | 45,000,000 | lb | State breakdown |
| India | Cotton crop | 1834 | 185,000,000 | lb | Broad region, Woodbury estimate |
| Rest of Asia | Cotton crop | 1834 | 110,000,000 | lb | Broad region, not Qing-only |
| Great Britain | Pig iron | 1830 | 677,417 | gross tons | Swank reproduces official Government statistics |
| Great Britain | Pig iron | 1833 | 700,000 | gross tons | Same |
| Great Britain | Pig iron | 1836 | 1,000,000 | gross tons | Same |
| United States | Pig iron | 1830 | 165,000 | gross tons | Early estimate, not census |
| London port | Coal arrivals | 1832 | 2,139,078 | tons | Port arrivals, not production |
| London port | Coal arrivals | 1833 | 2,020,409 | tons | Port arrivals, not production |
| London port | Coal arrivals | 1834 | 2,078,685 | tons | Port arrivals, not production |
| London port | Coal arrivals | 1835 | 2,298,812 | tons | Port arrivals, not production |
| London port | Coal arrivals | 1836 | 2,398,352 | tons | Port arrivals, not production |
| Great Britain | National coal production | 1830–1836 | unknown | — | Official Swank series begins 1854 |
| France | Pig iron / coal / factory hands | 1830–1836 | unknown | — | No accepted PD series verified |
| Belgium | Pig iron / coal / factory hands | 1830–1836 | unknown | — | No accepted PD series verified |
| Prussia / Germany | Pig iron / coal / factory hands | 1830–1836 | unknown | — | Swank's relevant series begin later |
| China/Qing | Cotton crop by province | 1830–1836 | unknown | — | Woodbury only provides broad Rest of Asia |
| India | Cotton crop by province | 1830–1836 | unknown | — | Woodbury only provides India aggregate |

## 10. Nguồn và URL scan

1. *Merchants’ Magazine*, vol. III, no. I (July 1840), printed p. 93, “Increase of British Manufactures”: https://fraser.stlouisfed.org/files/docs/publications/merchmag/merchmag_v03_184007.pdf. Contains 1835/1838 Government Inspectors’ factory returns transcribed in contemporary publication.
2. Edward Baines, *History of the Cotton Manufacture in Great Britain* (1835), Wellcome Collection record with Public Domain Mark and scan: https://wellcomecollection.org/works/k7k5pfwc. Use the chapters on labour, power-looms, handloom weaving and factory growth; do not conflate home workers and factory hands.
3. G. R. Porter, *The Progress of the Nation* (1836), scan: https://escoe-website.s3.amazonaws.com/wp-content/uploads/2018/10/18113758/Porter-The-Progress-of-the-Nation-1836-edition.pdf. Chapter I, printed pp. 62–68 (census/occupations); Chapter II, printed pp. 187 onward (manufactures); Chapter V, printed pp. 326 ff. (mining/coal shipments).
4. *A Complete Reference Gazetteer of the United States of North America* (1837), printed p. 7, “Agriculture” cotton table: https://upload.wikimedia.org/wikipedia/commons/3/35/Books_from_the_Library_of_Congress_%28IA_completereferenc01chap%29.pdf. Contemporary public-domain gazetteer.
5. Levi Woodbury, U.S. Treasury, *Cotton: cultivation, manufacture and foreign trade* (1836), Table A printed pp. 12–15; Commons identifies the 1836 government report as public domain: https://commons.wikimedia.org/wiki/File:Levi_Woodbury,_Cotton,_1836.pdf.
6. James M. Swank, *Iron and Steel, Iron Ore, and Coal Statistics for the United States, Great Britain, Germany, France, and Belgium* (1902), printed pp. 13, 17–18: https://upload.wikimedia.org/wikipedia/commons/0/07/Iron_and_steel%2C_iron_ore%2C_and_coal_statistics_for_the_United_States%2C_Great_Britain%2C_Germany%2C_France%2C_and_Belgium_%28IA_ironsteelironore00swan%29.pdf. This is a public-domain contemporary compilation; its text explicitly identifies the source basis and limits of early statistics.
7. *The Standard Library Cyclopaedia of Political, Constitutional, Statistical and Forensic Knowledge*, article “Coal Trade of the Port of London” (19th-century public-domain scan): https://upload.wikimedia.org/wikipedia/commons/c/c2/Cornell_University_Library_digitization_%28IA_cu31924101156929%29.pdf. Use London coal arrivals only as port throughput.

## 11. Handoff

- Output: `docs/research/history/CG24_1830S_INDUSTRY_SCALE_PD_VI.md`
- Status: research handoff completed; explicit unknowns preserved.
- No game code, building-level data, or calibration constants modified.
- No build/test run.
- Main actionable finding: the reported 855 UK textile-mill levels × 2,000 workers imply 1.71m workers, versus 220,134 cotton factory hands in 1835; this is a strong scale mismatch requiring Claude's engine-level reconciliation. Keep GDP productivity scaling separate from physical output.
