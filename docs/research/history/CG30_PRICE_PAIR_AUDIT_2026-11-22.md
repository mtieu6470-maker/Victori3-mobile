# CG-30 — Kiểm toán cặp giá thuốc phiện Bengal và cà phê Java (2026-11-22)

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Status:** BLOCKED FOR PRICE-WEDGE CALIBRATION — đã tìm thấy các quan sát rời rạc nhưng chưa có cặp giá đáp ứng đồng thời điều kiện năm, phẩm cấp, đơn vị và địa bàn.  
**Kết luận vận hành:** giữ `procurement_ratio` / `consumer_markup` là `unknown`; không bật cơ chế giá thu mua trong gameplay.

## 1. Thuốc phiện Bengal

### 1.1 Quan sát bán đấu giá có thể xác minh

Nguồn tổng hợp đương thời *East India Prices Current* được trích trong bản tin thương mại năm 1837 ghi phiên đấu giá Calcutta ngày 12-06-1837:
- Patna: 3,167 chests được chào; giá trung bình 1,448 Company Rupees/chest.
- Benares: 2,089 chests được chào; giá trung bình 1,240 Company Rupees/chest.
- Tổng proceeds vượt 7 triệu rupees.
- Các lô không thanh toán được tái đấu giá; 23 lô được bán lại ở 1,385–1,415 Company Rupees.

Nguồn đọc được: “Opium 1836–1838 – part 3”, trích East India Prices Current 13 June 1837 và Calcutta Courier 28 June 1837: https://houghton.hk/opium-part-3/. Đây là bản biên soạn lại từ báo chí thương mại, không phải sổ gốc của phiên đấu giá; dùng làm quan sát bán đấu giá với confidence medium, không làm dữ liệu chính thức duy nhất.

### 1.2 Giá trả cho người trồng — không ghép được với 1837

- Parliamentary return năm 1832 có bảng bán công khai EIC 1792–93 đến 1828–29, gồm quantity sold, prime cost at sale và giá trả người trồng theo seer. Bảng kết thúc trước 1837; phần chú giải cũng nêu giới hạn dữ liệu do các chính quyền Ấn Độ không cung cấp đủ return. Scan: https://upload.wikimedia.org/wikipedia/commons/b/bd/Opium_Trade%3B_Correspondence_relating_to_China%3B_Rules_and_Regulations_concerning_the_Trade_in_China%2C_1846_%28for_the_half_year_ending_December_31%2C_1846%29_%28IA_dli.granth.106546%29.pdf.
- Cùng nguồn có ghi chú rằng mức bồi hoàn tối đa cho cultivator được Government đặt ở 3 rupees/seer trong 1823. Đây là trần lịch sử của năm 1823, không phải giá thực trả cho Patna/Benares trong 1837.
- Báo chí thương mại năm 1835 ghi giá thị trường Canton cho các loại Patna/Benares, nhưng đó là thị trường tiêu thụ tại Trung Quốc, phẩm cấp/tình trạng lô khác nhau và không cùng địa điểm với giá thu mua hoặc Calcutta auction. Không ghép các giá Canton với giá cultivator.
- Tài liệu *India as it Ought to be* ghi về sau giá chi phí/thu mua Patna khoảng 4–5 rupees/seer và chest 100 seers, nhưng ngữ cảnh thuộc đầu thập niên 1850; không backdate về 1837.

**Quyết định:** không có cặp 1837 farm-gate procurement price ↔ Calcutta auction price cùng phẩm cấp/địa bàn. Không tính markup hay procurement ratio từ các quan sát khác năm hoặc khác thị trường.

## 2. Cà phê Java

### 2.1 Giá thị trường Java coffee 1832–1849

Một bảng lịch sử giá được in lại trong *Nieuw Amsterdamsch handels- en effectenblad* ngày 21-04-1858 liệt kê quarterly quotations cho Java coffee từ 1832–1849. Ví dụ:
- 1836: khoảng 32–36 cents qua các quý.
- 1840: khoảng 27–34 cents qua các quý.
- 1841–1843: giá giảm dần; 1843 nhiều quý khoảng 19–21 cents.
- Bài báo phân biệt giá hàng “goed ord. Java” và ghi một số kết quả đấu giá NHM (ví dụ September 1837 dưới 30 cents).

Scan: https://upload.wikimedia.org/wikipedia/commons/9/92/Nieuw_Amsterdamsch_handels-_en_effectenblad_21-04-1858_%28IA_ddd_010130404_mpeg21%29.pdf.

**Giới hạn:** OCR/đoạn trích hiện có không khóa rõ đơn vị khối lượng, quy cách hợp đồng, địa điểm giao hàng và việc mỗi quý là quotation hay giá thực hiện của auction. Vì vậy không quy đổi cents sang guilders/picul hoặc coi toàn bộ bảng là auction transaction price.

### 2.2 Chi phí giao cà phê cho kho nhà nước 1840–1851

Bảng 5 trong nghiên cứu *State-run cultivation in Java and the colonial state* ghi số hộ được giao trồng, lượng coffee nhận vào government storehouses, crop payments, cost of coffee delivered to government và average cost per picul:
- 1840: 702,634 piculs; total cost delivered 7,554,270 guilders; average cost 10.90 guilders/picul.
- 1841: 872,807 piculs; 9,326,340 guilders; 10.82 guilders/picul.
- 1842: 971,564 piculs; 9,783,920 guilders; 10.08 guilders/picul.
- 1843: 1,040,444 piculs; 10,816,920 guilders; 10.47 guilders/picul.
- 1844: 950,186 piculs; 8,927,355 guilders; 9.47 guilders/picul.
- 1845: 633,031 piculs; 6,190,170 guilders; 9.93 guilders/picul.

Nguồn: *Historical foundations of a national economy in Indonesia*, Table 5, trang in 118: https://dwc.knaw.nl/DL/publications/PU00010123.pdf.

**Định nghĩa quan trọng:** chú thích bảng nói cost delivered to government bao gồm crop payments, staff ở storehouses, vận tải nội địa từ vùng trồng đến kho ở cảng, cultivation percentages và remission of land rent; không bao gồm vận tải sang Netherlands và chi phí bán ở đó. Do đó đây không phải pure farm-gate cash price. Nguồn không đưa cùng bảng giá đấu giá/realised sale price theo cùng grade và year.

### 2.3 Kết luận cho Java

Có thể dùng bảng 1840–45 làm cost-to-government benchmark (đã bao gồm một phần logistics/administration), và bảng 1832–49 làm market quotation series độc lập. Nhưng không ghép 1840 auction quotation với 1840 government-delivered cost thành markup: đơn vị/grade/market basis chưa được khóa. Cần bản auction catalogue/settlement accounts NHM hoặc annual return thể hiện quantity, grade, sale proceeds, commission và same-year landed cost.

## 3. Quy tắc hiệu chỉnh cho Victori3

1. `procurement_ratio` và `consumer_markup` tiếp tục để `unknown` cho OPium Bengal và Java coffee.
2. Không lấy tỷ lệ doanh thu ngân sách opium, batig slot Java hoặc cost-delivered-to-government thay cho company profit hay farm-gate/auction spread.
3. Không chuyển giá Canton, Calcutta auction, Amsterdam quotation và Java government storehouse sang cùng một market node nếu chưa có freight, insurance, tax, quality and unit bridge.
4. Chỉ bật price-wedge mechanic khi có ít nhất một cặp matched record: same crop/year or explicitly documented crop-year mapping, same grade, same quantity basis, farm-gate price and auction/market realised price, location and currency.
5. Khi chỉ có một phía của cặp, dữ liệu chỉ làm sanity bound / narrative evidence; không được dùng để sinh markup.

## 4. Nguồn

- Commons Parliamentary return, *Opium Trade; Correspondence relating to China; Rules and Regulations concerning the Trade in China* (1832 return, reprinted in 1846 volume): https://upload.wikimedia.org/wikipedia/commons/b/bd/Opium_Trade%3B_Correspondence_relating_to_China%3B_Rules_and_Regulations_concerning_the_Trade_in_China%2C_1846_%28for_the_half_year_ending_December_31%2C_1846%29_%28IA_dli.granth.106546%29.pdf
- *East India Prices Current* / *Calcutta Courier* 1837 auction notices, transcribed: https://houghton.hk/opium-part-3/
- *The Bombay Gazette*, 15 July 1835 (Canton market quotations; not farm-gate or Calcutta auction): https://upload.wikimedia.org/wikipedia/commons/7/7e/The_Bombay_Gazette%2C_15_July_1835_%28IA_dli.granth.30118%29.pdf
- *Nieuw Amsterdamsch handels- en effectenblad*, 21 April 1858, Java coffee quarterly price table: https://upload.wikimedia.org/wikipedia/commons/9/92/Nieuw_Amsterdamsch_handels-_en_effectenblad_21-04-1858_%28IA_ddd_010130404_mpeg21%29.pdf
- *Historical foundations of a national economy in Indonesia*, Table 5, p.118: https://dwc.knaw.nl/DL/publications/PU00010123.pdf

**Acceptance:** research gate remains OPEN/BLOCKED. CG-30 Phase 1 remains useful for institution/revenue history, but no matched price pair is accepted and no price-wedge coefficient may be enabled.
