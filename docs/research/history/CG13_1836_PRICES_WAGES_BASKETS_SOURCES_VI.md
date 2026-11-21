# CG-13 — Nguồn dữ liệu kinh tế lịch sử quanh năm 1836: giá, lương, rổ tiêu dùng và welfare ratio

- Ngày nghiên cứu: 2026-11-22
- Phạm vi: dữ liệu có thể dùng để hiệu chỉnh POP-02 / ECON-02 tại mốc khởi đầu 1836.
- Nguyên tắc: phân biệt **chuỗi có khoảng năm bao trùm 1836** với **một quan sát thực tế đúng năm 1836**. Không tự nội suy năm thiếu và không biến dữ liệu của một thành phố thành trung bình quốc gia.
- Trạng thái quyền: quyền truy cập để đọc/tải không đồng nghĩa giấy phép phân phối lại hoặc sử dụng thương mại. Nếu trang dữ liệu không công bố license cụ thể, ghi `license=not stated / permission required`.

## 1. Kết luận điều hành

Không tồn tại một bảng dữ liệu đồng nhất, miễn phí, có license mở, phủ toàn bộ quốc gia năm 1836 và đồng thời có giá từng hàng hóa, lương theo nghề, rổ tiêu dùng và welfare ratio. Cần ghép nhiều nguồn cấp thành phố/quốc gia, giữ đơn vị gốc và gắn mức tin cậy theo từng quan sát.

Nguồn ưu tiên để lập benchmark 1836:

1. **GPIH (UC Davis)** — cổng tra cứu tốt nhất để tìm chuỗi giá/lương đa khu vực và bộ rổ tiêu dùng; coverage rất không đồng đều, phải mở từng spreadsheet để xác nhận observation thực tế năm 1836.
2. **Allen–Unger Global Commodity Prices Database** — giá hàng hóa theo địa điểm, nhiều loại hàng, khoảng thời gian dài đến 1914; phù hợp giá hàng hóa và kiểm tra chéo, không phải một CPI quốc gia hoàn chỉnh.
3. **Gregory Clark, England data** — chuỗi Anh có tần suất năm/5 năm/10 năm, bao gồm tiền lương và 22 nông sản; nguồn benchmark mạnh cho Anh nhưng không đại diện thế giới.
4. **Robert C. Allen và các nghiên cứu welfare ratio** — khung phương pháp, rổ subsistence/respectability và so sánh giá-lương; cần giữ rõ giả định về số ngày làm, quy mô hộ và tính đại diện của giá.
5. **Mitchell, International Historical Statistics** — nguồn tham chiếu thống kê tổng hợp nhiều quốc gia (giá, tiền lương, sản lượng, lao động); hữu ích để đối chiếu chỉ số và bối cảnh, nhưng là ấn phẩm có bản quyền, không phải kho dữ liệu mở để nhúng vào game.

## 2. Source register

### CG13-S01 — Global Price and Income History Group (GPIH), UC Davis

- Tổ chức/đơn vị: Global Price and Income History Group, University of California, Davis.
- Trang chủ: https://gpih.ucdavis.edu/
- Danh mục chuỗi: https://gpih.ucdavis.edu/Datafilelist.htm
- Consumer bundles: https://gpih.ucdavis.edu/Bundles.htm
- Early income distributions: https://gpih.ucdavis.edu/Distribution.htm
- Purchasing-power comparisons: https://gpih.ucdavis.edu/PP.htm
- Phạm vi: dữ liệu giá, lương, thu nhập và mức sống từ thời trung đại đến khoảng 1950; các trang chia theo Africa, Asia, Europe, North America, Latin America và Oceania. Đây là một danh mục nhiều bộ dữ liệu do các tác giả khác nhau xây dựng, không phải panel cân bằng.
- Chuỗi có khoảng bao trùm 1836 được danh mục nêu:
  - China wages 1807–1925; Beijing prices 1738–1923.
  - Japan wages/prices/living standards 1600–1938.
  - India prices and wages 1595–1930.
  - Java monthly rice prices 1824–1855.
  - Thai prices and wages 1820–1959.
  - Portuguese city prices, wage rates and exchange rates 1750–1855.
  - Europe monthly wheat prices 1800–1913.
  - England/Clark prices and wages since the thirteenth century.
  - South Africa/Cape Colony price and wage datasets bắt đầu từ 1837; **không phải quan sát 1836**.
- Đơn vị: phụ thuộc file gốc — local currency per local weight/volume, daily wage, annual wage/salary, index, hoặc welfare ratio. Trang danh mục không bảo đảm mọi file dùng cùng đơn vị; phải lưu đơn vị từng series và conversion notes.
- Độ phủ: nhiều địa điểm thuộc châu Âu, Đông Á, Nam Á, Đông Nam Á, châu Phi, châu Mỹ và châu Đại Dương; độ phủ theo từng hàng hóa/nghề/năm khác nhau. Dữ liệu thường là city/region series, không được tự gán thành national average.
- License: các trang danh mục và file tải công khai đã xem **không công bố một license chuẩn như CC BY/CC0 cho toàn bộ bộ dữ liệu**. Public download ≠ permission to redistribute. Trạng thái an toàn: `license=not stated; research access only; request permission before redistribution/commercial bundling`.
- Cách dùng: nguồn discovery và đối chiếu chính. Mỗi file phải được tải/kiểm tra header, source notes, observation years, units, missing values và copyright statement trước khi nhập dữ liệu.
- Confidence: **verified** về sự tồn tại/phạm vi các chuỗi được danh mục liệt kê; **supported** về khả năng có coverage 1836 do range bao trùm; **unknown** về observation thực tế 1836 cho tới khi kiểm tra từng file.

### CG13-S02 — Allen–Unger Global Commodity Prices Database / Allen Unger Commodities Dataset

- Tác giả: Robert C. Allen và Richard W. Unger.
- IISH Data Collection record: https://hdl.handle.net/10622/3SV0BO
- Dataset landing page: https://datasets.iisg.amsterdam/dataset.xhtml?persistentId=hdl%3A10622%2F3SV0BO
- Bài mô tả dataset: https://doi.org/10.1163/24523666-00401006
- Phạm vi: giá hàng hóa từ khoảng 1260 đến 1914; nguồn mô tả dataset cho biết có chuỗi ở châu Âu và các địa điểm ở châu Mỹ, Trung Đông và Viễn Đông. Độ phủ phụ thuộc mặt hàng và địa điểm; không phải mọi địa điểm có mọi mặt hàng.
- Nội dung: thực phẩm, đồ uống, nguyên liệu, hàng chế tạo; dữ liệu máy đọc được (Excel/CSV/tabular). Có giá gốc theo nguồn và các bảng quy đổi tiền tệ/đơn vị; một số giao diện thứ cấp mô tả chuẩn hóa giá theo gram bạc/lít. **Không được áp một đơn vị chuẩn cho tất cả series**; dùng unit và measure notes của từng bản ghi.
- Năm 1836: nằm trong khung niên đại tổng thể; phải lọc theo commodity-location và kiểm tra observation cụ thể. Không khẳng định toàn bộ mặt hàng có giá năm 1836.
- License: record IISH/Dataverse phiên bản 1.0 không hiện một license identifier chuẩn trong phần metadata đã xác minh. Một trang giới thiệu thứ cấp ghi “must provide credit, no fee”, nhưng đó không đủ để kết luận có quyền sửa đổi/phân phối thương mại. Trạng thái: `license=not stated on primary dataset record; attribution required by secondary catalogue; permission required before redistribution`.
- Cách dùng: benchmark giá hàng hóa tại địa điểm cụ thể; lưu nguyên giá gốc, tiền tệ, đơn vị đo, conversion factor, nguồn lịch sử và địa danh gốc. Chỉ chuyển về đơn vị chuẩn sau khi xác minh measure.
- Confidence: **verified** về dataset, tác giả, phạm vi tổng quát và định dạng; **supported** cho một số chuỗi có thể bao trùm 1836; **unknown** cho từng observation/giấy phép nếu metadata không hiển thị.

### CG13-S03 — Gregory Clark, Data on the History of the English Economy, 1150–1914

- Tác giả: Gregory Clark, University of California, Davis.
- Trang dữ liệu: https://faculty.econ.ucdavis.edu/faculty/gclark/data.html
- Tài liệu phương pháp tiêu biểu:
  - “The Macroeconomic Aggregates for England, 1209–1869”, Research in Economic History (2010).
  - “The Price History of English Agriculture, 1500–1914”.
  - “Farm Wages and Living Standards in the Industrial Revolution: England, 1670–1850”.
- Nội dung và tần suất theo trang tác giả:
  - Nominal and Real Wages, England, 1209–1869.
  - National income, prices, wages, land rents and population, England, 1209–1869.
  - Prices of 22 domestic farm products, 1500–1914: wheat, barley, oats, rye, peas, beans, potatoes, hops, straw, hay, beef, mutton, pork, bacon, tallow, milk, cheese, butter, wool, eggs, firewood and timber.
  - Farm day wages 1208–1869; annual from 1670–1869 and quinquennial for earlier periods.
  - Các series có annual, quinquennial hoặc decadal frequency; kiểm tra workbook để biết tần suất của từng biến.
- Đơn vị: wages thường là nominal day wages bằng pence/day trong các bảng lịch sử; real wage/cost-of-living series có thể là index với base year; commodity prices giữ đơn vị giá và measure được tài liệu hóa trong workbook. Không gộp nominal wage với real wage index.
- Phạm vi: England (một số series theo bốn vùng lớn hoặc toàn quốc); không đại diện Scotland, Ireland hay các nước khác.
- Năm 1836: thuộc range của các chuỗi 1209–1869 và 1500–1914; trang tác giả cho biết tần suất theo loại series. Phải mở workbook để xác nhận có hàng năm 1836 thay vì nội suy từ quinquennium.
- License: trang dữ liệu công khai các file Excel nhưng không thấy license CC0/CC BY hay tuyên bố cho phép phân phối lại. Trạng thái: `license=not stated; do not redistribute raw workbooks without permission`.
- Cách dùng: benchmark tiền lương danh nghĩa/nông sản Anh; kiểm tra giá trị 1836, đơn vị, vùng, nghề, tần suất và phương pháp splice trước khi dùng.
- Confidence: **verified** về phạm vi và cấu trúc series theo trang tác giả; **supported** về khả năng có năm 1836; **unknown** về license và observation cụ thể nếu chưa mở workbook.

### CG13-S04 — Robert C. Allen (2001), “The Great Divergence in European Wages and Prices from the Middle Ages to the First World War”

- Trích dẫn: Robert C. Allen, *Explorations in Economic History*, 38(4), 2001, pp. 411–447.
- DOI: https://doi.org/10.1006/exeh.2001.0775
- Publisher: https://www.sciencedirect.com/science/article/pii/S0014498301907752
- Phạm vi: lịch sử giá và lương ở các thành phố châu Âu từ thời trung đại đến WWI; phù hợp khung so sánh thế kỷ XIX, nhưng không phải một bảng thống kê toàn cầu.
- Giá và tính đại diện: bài nghiên cứu phân biệt grain prices (wholesale), bread prices (retail/regulated) và nhiều giá thịt, vải lanh, nến… lấy từ tài khoản các tổ chức lớn. Các giá tổ chức có thể phản ánh mua số lượng lớn hoặc hợp đồng, không mặc nhiên là retail price mà mọi hộ POP trả.
- Bài mô tả tập dữ liệu bread-price có 1.754 quan sát từ London, Milan, Edinburgh, Amsterdam, Antwerp, Paris, Strasbourg, Krakow, Madrid và Vienna; biến giá bánh mì được phân tích cùng grain price, mason wage và city indicators. Đây là mô hình ước lượng lịch sử, không phải công thức giá bánh mì của game.
- Phương pháp welfare ratio: so sánh thu nhập lao động với chi phí một rổ tiêu dùng thiết yếu; cần bảo toàn giả định số ngày làm, household size/consumption units, loại lao động và basket definition của từng nghiên cứu.
- Đơn vị: giá gốc theo local currency và local weights/measures; bài nghiên cứu mô tả việc quy đổi sang grams of silver và metric units để so sánh. Nhiên liệu có thể được chuẩn hóa theo calorific content (grams silver per million BTU). Không tái sử dụng hệ số quy đổi nếu không có bảng chuyển đổi gốc.
- License: bài báo Elsevier có bản quyền; truy cập full text phụ thuộc quyền truy cập publisher. Không có giấy phép mở cho việc tái phân phối toàn văn/bảng dữ liệu được xác minh. Trạng thái: `license=publisher copyright; citation and limited quotation only; permission required for republication`.
- Cách dùng: dùng phương pháp và source notes để xây benchmark; tìm series gốc tương ứng trong GPIH/Allen-Unger. Không chép bảng số liệu/bài báo vào repository.
- Confidence: **verified** về thông tin thư mục và các caveat phương pháp được nêu trong bài.

### CG13-S05 — Allen et al. (2011), “Wages, prices, and living standards in China, 1738–1925”

- Tác giả: Robert C. Allen, Jean-Pascal Bassino, Debin Ma, Christine Moll-Murata và Jan Luiten van Zanden.
- Bài báo: *Economic History Review*, 64, Supplement 1 (2011), pp. 8–38.
- DOI/record: https://ideas.repec.org/a/bla/ehsrev/v64y2011is1p8-38.html
- Bản PDF tham khảo: https://www.sss.tsinghua.edu.cn/__local/E/85/E8/B038464C45C0295E9395FB60EBC_DE226308_D794DF.pdf
- Phạm vi: Beijing, Canton và Suzhou/Shanghai; so sánh với các thành phố tiêu biểu ở châu Âu, Nhật Bản và Ấn Độ; giai đoạn 1738–1925.
- Nội dung: nominal wages, cost of living, real wages/welfare ratios; hữu ích để tránh lấy London/England làm proxy cho toàn thế giới.
- Đơn vị: tiền lương danh nghĩa và chi phí basket được chuẩn hóa theo phương pháp nghiên cứu; bài nêu giả định 250 ngày làm việc/năm để quy đổi full-time annual earnings trong phần mô tả welfare ratio. Kiểm tra bảng và appendix trước khi nhập số cụ thể.
- License: bài báo publisher-copyright; bản PDF truy cập qua host học thuật không tự động cấp quyền phân phối lại. Trạng thái: `license=publisher copyright / repository access; no open redistribution license verified`.
- Cách dùng: benchmark East Asia; so sánh city-level chứ không suy ra national average của Trung Quốc/Nhật/Ấn Độ.
- Confidence: **verified** về khung địa lý, thời gian và phương pháp được bài mô tả.

### CG13-S06 — GPIH Household Budgets / Consumer Bundles

- URL: https://gpih.ucdavis.edu/Bundles.htm
- Danh mục gồm: Europe baskets 1500–1832; Beijing 1745–1754; Beijing and London c.1750; Canton 1757; Kyoto 1745–1754; Lima, Peru 1837, 1869, 1957; Strasbourg c.1745–1754; Peru 18th century; Sichuan 1905; Thailand 1930–35 và các nghiên cứu khác.
- Giá trị cho 1836: bộ Europe 1500–1832 **kết thúc trước năm 1836**; Lima có benchmark 1837, không phải 1836; các rổ châu Á được liệt kê chủ yếu là giữa thế kỷ XVIII. Đây là tài liệu tham chiếu cấu trúc/định lượng basket, không phải một basket toàn cầu năm 1836.
- Đơn vị: quantities theo consumer unit/household và đơn vị vật lý của từng hàng (kg, litre, piece hoặc đơn vị lịch sử). Không chuẩn hóa trước khi kiểm tra file.
- License: trang danh mục không công bố license mở chung cho các workbook. Quyền của từng tác giả/bộ dữ liệu cần xác minh riêng.
- Cách dùng: xây các archetype basket (subsistence/respectability hoặc regional basket) với source provenance; không coi một basket duy nhất là universal.

### CG13-S07 — Brian R. Mitchell, International Historical Statistics (IHS)

- Tác giả: B. R. Mitchell.
- Bộ sách ấn bản 6: *International Historical Statistics 1750–2005* (2007), ba tập:
  - Europe: https://link.springer.com/book/9780230005143
  - Africa, Asia & Oceania: https://link.springer.com/book/9780230005150
  - Americas: https://link.springer.com/book/9780230005136
- Bản reference work cập nhật: *International Historical Statistics 1750–2010*, 3-volume set (2013): https://link.springer.com/referencework/10.1057/978-1-137-30568-8
- Phạm vi: nhiều quốc gia thuộc Europe, Americas, Africa, Asia và Oceania; chủ đề gồm population, labour force, agriculture, industry, trade, transport, finance, prices, education và national accounts.
- Chỉ số phù hợp: money wages in industry, wages in agriculture, wage/earnings indices, wholesale price indices, consumer price indices, commodity/agricultural production và national accounts. Tùy bảng, chuỗi có thể là annual hoặc benchmark-year; không giả định mọi nước đều có observation 1836.
- Đơn vị: chỉ số (base year theo bảng), local currency, physical output hoặc rates; đọc table headings, notes và source bibliography từng bảng.
- Năm 1836: khung sách bắt đầu 1750 nhưng không bảo đảm mọi series chạy liên tục từ 1750. Phải kiểm tra từng bảng quốc gia/biến.
- License: © Palgrave Macmillan / Springer; ấn phẩm thương mại và nội dung có bản quyền. Thư viện đại học mô tả điều kiện chỉ tải/in phần giới hạn cho mục đích cá nhân/nghiên cứu, không phân phối lại hoặc dùng thương mại. Trạng thái: `license=copyrighted reference work; subscription/library access; no redistribution or commercial game embedding`.
- Cách dùng: xác minh nguồn gốc series, chỉ số và bối cảnh quốc gia; không sao chép bảng Mitchell vào asset/data pack.
- Confidence: **verified** về thư mục, thời kỳ tổng quát và phạm vi chủ đề; **unknown** về observation 1836 của từng bảng nếu chưa xem bảng.

### CG13-S08 — African Commodity Trade Database (ACTD 2.0), dữ liệu bổ sung

- Đơn vị: African Economic History Network (AEHN).
- Trang: https://aehnetwork.org/data-research/african-commodity-trade-database/
- Bộ dữ liệu: ACTD 2.0, prices, quantities and values 1790–2020.
- Phạm vi: chuỗi xuất khẩu theo hàng hóa từ các nước châu Phi trong hơn hai thế kỷ; có thể dùng để xem giá trị/khối lượng xuất khẩu và cấu trúc hàng hóa năm 1836 nếu series của quốc gia/hàng hóa đó có quan sát.
- Không phải: retail prices, household consumption basket, wage series hoặc welfare ratio.
- Đơn vị: quantity, value, unit value có thể suy ra từ value/quantity nếu đơn vị/coverage tương thích; không gọi unit value là market price khi thiếu chất lượng/định nghĩa thống nhất.
- License: AEHN nêu dữ liệu được cung cấp miễn phí khi trích dẫn công trình Frankema & Meier zu Selhausen (2026), nhưng trang không nêu một license CC chuẩn. Trạng thái: `free with citation; exact redistribution/license terms not stated; request permission before repackaging`.
- Cách dùng: bổ sung bối cảnh thương mại/xuất khẩu châu Phi, không thay cho giá bán lẻ hoặc wage/basket.

## 3. Coverage matrix — khả năng hiệu chỉnh mốc 1836

| Khu vực / benchmark | Nguồn phù hợp | Mức coverage có thể khẳng định | Giới hạn |
|---|---|---|---|
| England | Clark; GPIH; Allen | Series ranges span 1836; farm wages and 22 farm-product prices are listed | Confirm exact 1836 row, regional definition, annual vs quinquennial |
| Northwest/Central/South Europe | Allen–Unger; Allen 2001; GPIH; Mitchell | Many city-level price/wage series; wheat series 1800–1913 | City and commodity coverage varies; not a complete national basket |
| Portugal | GPIH 1750–1855 Portuguese city series; Lisbon/Coimbra prices and wages | 1836 falls inside the stated range | Inspect city and commodity observations; local measures |
| China | GPIH Beijing prices 1738–1923; China wages 1807–1925; Allen et al. | Range spans 1836 for Beijing/China series | Beijing/Canton/Suzhou-Shanghai are city proxies, not national data |
| Japan | GPIH Japanese wages/prices/living standards 1600–1938 | Range spans 1836 | Confirm which city, commodity and occupation series contain 1836 |
| India | GPIH India prices/wages 1595–1930 | Range spans 1836 | Geographic and occupational coverage must be checked; do not assume all India |
| Java / Thailand | GPIH Java monthly rice prices 1824–1855; Thai prices/wages 1820–1959 | Range spans 1836 | Commodity/location-specific; not national CPI |
| South Africa / Cape Colony | GPIH series start 1837 | **No direct 1836 observation from the listed series** | Use as 1837+ follow-on evidence only; do not backdate to 1836 |
| Latin America | Allen–Unger location/commodity series; GPIH Lima basket 1837 | Some commodity series may span 1836; Lima basket benchmark is 1837 | Lima 1837 is not 1836; no universal Latin American basket |
| North America | GPIH early US incomes; Allen–Unger commodity series | Candidate historical series exist | This research pass did not verify a consistent 1836 price/wage/basket panel |
| Africa outside Cape Colony | Allen–Unger and individual GPIH series; ACTD 2.0 export data | Fragmentary candidates | ACTD is trade export data, not retail/wages; exact 1836 country coverage requires filtering |

## 4. Measurement and data-ingestion contract for POP-02 / ECON-02

Every observation must be stored with source lineage; never store only a normalized number.

Suggested raw observation schema:

```ts
interface HistoricalEconomicObservation {
  observationId: string;
  sourceId: string;
  authorOrInstitution: string;
  title: string;
  sourceUrl: string;
  publicationYear?: number;
  accessDate: string;
  observationYear: number;       // exact year, never a range label
  periodStart?: string;          // month/date only when source gives it
  periodEnd?: string;
  geographyId: string;           // city/region/country; never promote city to country silently
  geographyLevel: 'city' | 'region' | 'country' | 'colony' | 'market';
  variable: 'commodity_price' | 'nominal_wage' | 'real_wage_index'
    | 'consumer_price_index' | 'basket_cost' | 'welfare_ratio'
    | 'trade_value' | 'trade_quantity';
  commodityOrOccupationId?: string;
  value: number | null;           // null = missing; never coerce to 0
  unit: string;                   // source unit, verbatim where possible
  currency?: string;
  priceType?: 'retail' | 'wholesale' | 'institutional' | 'farm_gate' | 'unknown';
  frequency: 'monthly' | 'annual' | 'quinquennial' | 'decadal' | 'benchmark' | 'unknown';
  conversion?: {
    targetUnit: string;
    formula: string;
    factor: number;
    sourceUrl: string;
    confidence: 'verified' | 'supported' | 'estimated';
  };
  licenseStatus: 'open' | 'restricted' | 'not_stated' | 'permission_required';
  licenseName?: string;
  attribution: string;
  confidence: 'verified' | 'supported' | 'estimated' | 'disputed' | 'unknown';
  methodNotes: string;
}
```

### Normalization rules

1. Preserve nominal local-currency values and original local weights/measures. Store conversions as derived fields with a cited conversion table.
2. Keep retail, wholesale, institutional, farm-gate and export unit values distinct.
3. Daily wage × 250 workdays is an Allen-style annualization assumption, not a universal historical fact. Use the source's own working-day assumption when known; otherwise retain daily wage and set annual earnings to unknown.
4. Welfare ratio requires a defined basket, family/consumption-unit assumption, wage occupation, annual working days and price geography. Do not calculate one if any required input is missing.
5. Store both subsistence and respectability basket definitions when the source supports them. Do not blend their prices/quantities.
6. Local diets, climate, household size and substitution patterns differ. A single global basket creates false comparability; regional basket archetypes are required.
7. If a series is quinquennial or decadal, do not create a precise 1836 observation by interpolation without marking the estimate and method.
8. Currency-to-silver, volume-to-mass and historical measure conversions require a source-specific conversion record; no generic factor.
9. A city observation can calibrate a city/market archetype. National values require a separately justified aggregation model.
10. License review is independent from data-quality review. No raw workbook enters a distributed game pack until redistribution and commercial-use permissions are documented.

## 5. Recommended calibration plan

- **England benchmark:** Clark wages + farm product prices; cross-check selected food/fuel prices against Allen–Unger/GPIH; build one urban and one rural basket if evidence permits.
- **Continental Europe:** use city-specific Allen/GPIH series. Start with the cities for which both wage and food/fuel prices coexist; do not force a national panel where only one city exists.
- **East Asia:** build separate Beijing/Canton/Suzhou-Shanghai and Japan city benchmarks using Allen et al. and GPIH series.
- **South Asia / Southeast Asia:** India, Java and Thailand are separate regional archetypes; rice/wheat and local wage structures must not be merged into a European basket.
- **Data gap:** for countries without a directly observed 1836 series, store `unknown` and use a transparent model prior only as a gameplay estimate, not as a historical fact.
- **Economic model output:** price/wage calibration should be a range/distribution with confidence, not a single exact national number for every POP.

## Open questions / conflicts

- GPIH and Clark provide public downloads but a blanket open license for all hosted spreadsheets was not identified. Obtain explicit permission or rely on separately licensed source datasets before redistribution.
- Allen–Unger record and secondary catalogue do not establish a clear CC license for the complete database. Credit/no-fee wording is not equivalent to commercial redistribution rights.
- Mitchell IHS is copyrighted commercial reference material. It can guide research but must not be copied into the game's distributed data files without permission.
- Allen's basket assumptions and price source types are method-specific; later scholarship challenges the fixed family-size, single male breadwinner and fixed working-day assumptions. Keep those assumptions explicit and permit alternative household models.
- Exact 1836 observations must be verified workbook-by-workbook. A dataset whose overall range includes 1836 may still omit the year for a specific commodity/city/occupation.
- A 1837 Cape Colony or Lima observation is not a 1836 observation; do not backdate it.
- Unit value from trade value/quantity is not equivalent to a local retail market price.

## Recommended acceptance tests

1. Every raw observation includes source URL, author/institution, title, access date, observation year, geography level, unit, frequency, license status and confidence.
2. Exact year 1836 is distinguished from a dataset's broad date range.
3. No missing value is converted to zero.
4. No city wage/price is relabeled as national without a documented aggregation method.
5. Retail, wholesale, institutional and export prices remain separate variable classes.
6. Every currency and physical-unit conversion has a source and factor.
7. Every welfare ratio records basket, household size/consumption units, occupation, workdays/year and geography.
8. Allen-style 250 workdays/year is never silently imposed on another dataset.
9. Mitchell/GPIH/Clark/Allen files with no verified redistribution license are excluded from distributable game packs.
10. Calibration runs preserve original observations and produce separate derived estimates with confidence labels.
