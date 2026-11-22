# CG-21 — Thuế quan nguyên liệu và thành phẩm quanh năm 1836

- Ngày: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Phạm vi: Anh là trọng tâm; đối chiếu Pháp, Zollverein/Phổ và Hoa Kỳ khi có nguồn.
- Chuẩn chứng cứ: ưu tiên văn bản luật, Hansard và ấn phẩm đương thời đã hết bản quyền. Nguồn nghiên cứu hiện đại chỉ dùng làm cross-check và được gắn nhãn riêng.
- Nguyên tắc: thuế suất danh nghĩa không tự động bằng mức bảo hộ hiệu dụng; phải giữ đơn vị, phân loại hàng, nguồn gốc, ngày hiệu lực và drawback/re-export conditions.

## 1. Kết luận điều hành

**Không có một mẫu chung “nguyên liệu thô luôn được nhập dễ hơn thành phẩm” cho mọi nước năm 1836.** Có khác biệt đáng kể theo quốc gia và theo từng ngành:

1. **Anh:** raw cotton chịu thuế đặc định rất nhỏ về trị giá tuyệt đối nhưng vẫn là chi phí đầu vào có tính tích lũy qua các công đoạn: 5/16 penny/lb. Hansard ngày 6-5-1836 ghi đây là mức thuế đang áp dụng; số thu năm tài khóa đến 5-4-1836 là £400,000. Lúa mì ngoại quốc chịu Corn Law sliding scale rất nặng khi giá thấp: tại giá 62s/quart, duty 24s8d; giảm còn 1s khi giá đạt 73s/quart. Chưa xác minh được trong lượt này mức chính xác năm 1836 cho wool, timber, iron ore, pig iron và broad cotton manufactures; giữ `unknown`.
2. **Pháp:** cơ chế bảo hộ mạnh đối với cotton yarn và cotton textiles. Một nguồn đương thời năm 1848 ghi lệnh cấm nhập khẩu cotton yarn nói chung được duy trì đến 1834; từ 1834 chỉ cho nhập sợi cực mảnh metric no. 143 trở lên, mức 7 francs/kg sợi đơn và 8 francs/kg sợi kép, cộng differential duty và décime; luật 2-7-1836 xác nhận. Đây không phải thuế ad valorem và chỉ áp dụng cho nhóm sợi rất mảnh được miễn cấm. Cùng nguồn ghi wool thô lúc viết năm 1848 chịu 20%, wool đã chải 30%, wool nhuộm 300 francs/100kg — **không được backdate thành mức 1836**. Một nghiên cứu hiện đại tổng hợp cải cách 1836 ghi duty wool giảm còn 33% và cast iron còn 25%; không phải nguồn PD, vì vậy chỉ là đối chiếu thứ cấp, không phải dữ liệu tariff được phép nhúng.
3. **Prussia/Zollverein:** Hansard 1842 ghi rõ Prussian commercial league không đánh thuế nhập raw cotton; nhập khẩu raw cotton tăng từ 92,212 cwt năm 1833 lên 187,858 cwt năm 1836. Đây là bằng chứng trực tiếp mạnh cho raw cotton được nhập tự do, nhưng chưa có bảng tariff sơ cấp 1836 trong lượt này cho len, gỗ, quặng, gang, sắt thanh, wheat hoặc cotton cloth. Không tự suy ra toàn bộ nguyên liệu đều miễn thuế.
4. **Hoa Kỳ:** Tariff Act 1832 đặt raw wool dưới 8 cents/lb được miễn; wool trên 8 cents/lb chịu 4 cents/lb + 40% ad valorem. Pig iron chịu 50 cents/112 lb; bar/bolt iron cán chịu $30/ton; iron chưa cán chịu 90 cents/112 lb. Cotton manufactures chịu 25% ad valorem với minimum valuation (30 cents/sq yd cho loại không in/nhuộm; 35 cents/sq yd cho loại in/nhuộm). Compromise Tariff 1833 giảm từng phần phần thuế vượt 20%; ở giai đoạn bắt đầu 1836, 2/10 phần vượt đã được khấu trừ, nên mức danh nghĩa 25% giảm còn 24% nếu áp dụng cùng nhóm và định giá. Mức minimum valuation vẫn cần được xử lý cùng điều khoản gốc. Raw cotton sản xuất nội địa là nguồn đầu vào chủ yếu; chưa xác minh được mức duty cụ thể cho raw cotton nhập khẩu trong bảng này.

**Kết luận thiết kế:** cần tách trade openness / tariff treatment theo ít nhất `raw_material`, `intermediate_good`, `finished_good`, `food_grain`, và theo quốc gia + commodity. Không thể thay một hệ số openness chung bằng một hệ số chung khác cho mọi nguyên liệu.

## 2. Bảng bằng chứng có thể dùng

### Anh — 1836

| Hàng hóa | Thuế/điều kiện | Đơn vị | Nguồn / trạng thái |
|---|---|---|---|
| Bông thô | 5/16 penny | per lb | Hansard, Commons 6-5-1836; mức được phát biểu trong nghị viện, mức thu 1835/36 cũng được nêu |
| Lúa mì ngoại quốc | 24s8d khi giá 62s/quart; duty giảm theo sliding scale, còn 1s khi giá 73s/quart; dưới 62s tăng 1s duty cho mỗi 1s giảm giá | per imperial quarter | Hansard, Corn Laws debate 16-3-1837 mô tả chế độ đang áp dụng theo 9 Geo. IV c.60 (1828); dùng như rule gần mốc 1836 |
| Len thô | unknown | unknown | Chưa xác minh được mức cụ thể 1836 từ primary tariff schedule |
| Gỗ / timber | unknown | unknown | Chưa xác minh được biểu thuế 1836 theo loại gỗ, load và nguồn gốc |
| Quặng sắt | unknown | unknown | Chưa xác minh được |
| Gang / sắt thanh | unknown | unknown | Chưa xác minh được mức 1836; không lấy tariff của năm khác làm thay thế |
| Vải cotton thành phẩm | unknown | unknown | Chưa trích xuất được tariff line 1836 đủ tin cậy; không dùng thuế raw cotton để suy ra |
| Sợi cotton | unknown | unknown | Chưa xác minh được tariff line 1836 |

**Ghi chú Corn Laws:** wheat được phép nhập khẩu mọi lúc theo luật 1828, nhưng duty theo sliding scale làm chi phí nhập tăng mạnh khi giá nội địa thấp. Không dùng một số duty cố định cho toàn bộ năm 1836; phải lấy declared average price của kỳ tương ứng để tính duty theo thang.

### Pháp — 1834–1836, gần mốc

| Hàng hóa | Thuế/điều kiện | Đơn vị | Nguồn / trạng thái |
|---|---|---|---|
| Sợi cotton cực mảnh, metric no. 143 trở lên | 7 francs/kg sợi đơn; 8 francs/kg sợi kép; cộng differential duty và décime | per kg | Charles Coquelin, 1848, dẫn ordonnance 2-6-1834 được law 2-7-1836 xác nhận; PD contemporary account |
| Sợi cotton dưới ngưỡng / nhóm khác | Nhập khẩu bị cấm theo chế độ chung trước khi ngoại lệ cực mảnh được mở | prohibition, không phải rate | Coquelin 1848, footnote lịch sử tariff |
| Vải cotton | Cấm nhập khẩu nói chung, ngoại trừ một số loại đặc biệt như tulles, dentelles và nankins | prohibition / exceptions | Coquelin 1848 mô tả chế độ hiện hành và lịch sử; cần tra văn bản tariff cụ thể nếu dùng cho từng mã hàng |
| Len thô | 20% theo mô tả mức đang áp dụng khi tác giả viết năm 1848 | ad valorem | Không phải 1836; chỉ dùng làm mốc hậu kỳ, không backdate |
| Len đã chải | 30% theo mô tả năm 1848 | ad valorem | Không phải 1836 |
| Len nhuộm | 300 francs/100kg theo mô tả năm 1848 | specific duty | Không phải 1836 |
| Gang | 25% vào năm 1836 | ad valorem | Chỉ tìm thấy trong tổng hợp nghiên cứu hiện đại; không coi là PD primary evidence, không nhúng vào game |
| Len thô / gang 1836 chính xác theo tariff schedule | 33% / 25% | ad valorem | Cross-check thứ cấp: Accominotti & Flandreau, Table 3; nguồn không PD, không đủ làm license-cleared data |

Nguồn Coquelin là bài nghiên cứu đương thời 1848, không phải văn bản luật nguyên bản. Các chi tiết được tác giả dẫn lại gồm ngày ban hành, điều kiện và lượng nhập thực tế năm 1835–1836; dùng được như chứng cứ đương thời có provenance, nhưng nếu cần mức độ pháp lý cao nhất thì cần mở ordinance 2-6-1834 và law 2-7-1836 nguyên bản.

### Prussia / Zollverein — dữ kiện được ghi nhận năm 1836

| Hàng hóa | Thuế/điều kiện | Đơn vị | Nguồn / trạng thái |
|---|---|---|---|
| Bông thô | Miễn thuế nhập khẩu | free | Hansard, Commons 8-6-1842, phát biểu về Prussian commercial league |
| Bông thô nhập khẩu | 92,212 cwt (1833) → 187,858 cwt (1836) | cwt imported | Cùng Hansard; quantity, không phải tariff |
| Cotton manufactures | Chưa có rate sơ cấp được xác minh trong lượt này | unknown | Không suy từ số xuất khẩu |
| Len, gỗ, quặng, gang, sắt thanh, wheat | unknown | unknown | Cần bảng tariff Zollverein/Prussian tariff gốc |

Một nghiên cứu hiện đại (Tilly & Kopsidis 2020, dẫn Dumke 1994) đưa ước lượng nhóm Prussian tariff c.1831: raw materials 16.3%, industrial inputs 18.9%, semi-manufactures 12.4%, final manufactures 19.1% ad valorem equivalents. Đây là **bảng tổng hợp nhóm hàng**, không phải rate cho từng mặt hàng và không phải tài liệu PD. Không dùng làm tariff line hoặc dữ liệu đóng gói.

### Hoa Kỳ — Tariff Act 1832 và Compromise Tariff 1833 áp dụng trong 1836

| Hàng hóa | Mức cơ sở theo Act 1832 | Điều chỉnh tới 1836 | Ghi chú |
|---|---|---|---|
| Len thô trị giá không quá 8 cents/lb | Free | Free theo điều khoản được trích | Có chống khai giảm giá bằng cách trộn dirt/impurities |
| Len thô trị giá trên 8 cents/lb | 4 cents/lb + 40% ad valorem | 2/10 phần vượt 20% được khấu trừ đến đầu 1836; không áp dụng cơ học vào phần specific 4 cents | Exact treatment theo statutory clauses |
| Vải cotton không in/nhuộm | 25% ad valorem; minimum valuation 30 cents/sq yd | 24% danh nghĩa theo 8/10 excess-over-20 rule | Giữ minimum valuation và classification |
| Vải cotton in/nhuộm | 25% ad valorem; minimum valuation 35 cents/sq yd | 24% danh nghĩa theo 8/10 excess-over-20 rule | Printed/colored/stained |
| Pig iron | 50 cents/112 lb | Điều khoản giảm thuế vượt 20% không tự động giảm specific component; cần đối chiếu luật cụ thể | Specific duty |
| Iron bar/bolt cán | $30/ton | Specific component | Không gộp với pig iron |
| Iron bar/bolt không cán | 90 cents/112 lb | Specific component | Không gộp với rolled bar |
| Sheet/hoop/rod iron | 3 cents/lb | Specific component | Classification theo statute |
| Raw cotton | unknown | unknown | Cotton nội địa là đầu vào chủ lực; chưa xác minh tariff line nhập khẩu trong tài liệu đã đọc |
| Timber / wheat / iron ore | unknown | unknown | Không có line đủ xác minh trong lượt này |

**Tính mức 24% cotton cloth:** Act 1832 đặt 25% ad valorem. Compromise Act 2-3-1833 quy định từ 31-12-1833 khấu trừ 1/10 phần vượt 20%; từ 31-12-1835 khấu trừ thêm 1/10 phần vượt. Đến giai đoạn 1836, phần excess còn 8/10: (20% + 0.8 	imes (25%-20%) = 24%). Đây là phép tính trực tiếp từ statutory schedule, không phải một rate được ghi nguyên văn trong một dòng riêng.

## 3. Trả lời câu hỏi: nguyên liệu thô có được nhập dễ hơn thành phẩm không?

| Quốc gia | Kết luận có thể bảo vệ | Không được suy ra |
|---|---|---|
| Anh | Raw cotton chịu specific duty 5/16d/lb; wheat chịu sliding scale nặng; một số nguyên liệu khác chưa xác minh. Thuế cotton thô có thể cộng dồn qua chuỗi chế biến nếu không có drawback. | Không kết luận raw materials nói chung được ưu đãi hơn cotton cloth/iron goods khi chưa có đủ tariff lines cùng năm. |
| Pháp | Cotton yarn và cotton cloth chịu prohibition/ngoại lệ hẹp; một số yarn cực mảnh chịu specific duty rất cao. Điều này cho thấy thành phẩm và intermediate textile bị hạn chế mạnh; raw cotton duty chính xác chưa biết. | Không kết luận raw cotton free hoặc low-duty chỉ vì yarn/cloth bị cấm. |
| Prussia/Zollverein | Raw cotton được nhập miễn thuế theo phát biểu đương thời; nhập khẩu tăng mạnh trong 1833–1836. | Không suy ra mọi nguyên liệu miễn thuế hoặc mọi thành phẩm chịu thuế cao. |
| Hoa Kỳ | Một số raw wool giá thấp free, nhưng wool giá cao chịu specific + ad valorem; iron inputs chịu specific duties; cotton textiles chịu 24% nominal ad valorem trong 1836. | Không thể gọi toàn bộ nguyên liệu nhập khẩu là rẻ/miễn thuế. Raw cotton tariff line chưa xác minh. |

## 4. Hướng mô hình hóa cho Victori3 (đề xuất của dự án, không phải mô tả V3)

### 4.1 Không dùng một openness factor chung

Tối thiểu nên phân nhóm:
- `raw_material`: raw cotton, raw wool, ore, timber, coal.
- `intermediate_good`: yarn, pig iron, bar iron, semi-finished metal.
- `finished_good`: cloth, clothing, finished ironware, tools.
- `food_grain`: wheat và các grain chịu Corn Laws/sliding scale.

Mỗi tariff record nên có:
```ts
interface TariffRule {
  countryId: string;
  commodityId: string;
  stage: 'raw_material' | 'intermediate_good' | 'finished_good' | 'food_grain';
  validFrom: string;
  validTo?: string;
  dutyType: 'free' | 'specific' | 'ad_valorem' | 'sliding_scale' | 'prohibition' | 'unknown';
  specificAmount?: number;
  specificUnit?: string;
  adValoremRate?: number;
  minimumValuation?: number;
  priceTriggerTable?: Array<{ declaredPrice: number; duty: number }>;
  drawbackRule?: string;
  sourceId: string;
  confidence: 'verified' | 'supported' | 'unknown';
  notes: string;
}
```

### 4.2 Mô hình trade cost

- Specific duty phải quy đổi theo đúng đơn vị hàng hóa và currency; không biến thành % nếu thiếu giá nhập cùng thời kỳ.
- Sliding scale cần dùng declared average price theo kỳ, không phải một duty cố định quốc gia.
- Prohibition là rào cản định lượng/không cho nhập, không phải duty rate cực cao.
- Drawback/export rebate phải là thuộc tính riêng. Hansard 1843 nêu raw cotton duty ở Anh không được hoàn lại trên cotton manufactures xuất khẩu; điều này làm thuế đầu vào ảnh hưởng chuỗi xuất khẩu.
- Tách tariff legal rate khỏi realized landed cost: freight, insurance, port charges, exchange rates và smuggling chưa có dữ liệu thì để riêng `unknown`, không gộp thành một markup.

### 4.3 Hành vi gameplay được phép đề xuất

- Với Prussia/Zollverein, có thể dùng raw cotton tariff = 0 như một rule cụ thể cho cotton, nếu Claude chấp nhận Hansard 1842 làm chứng cứ lịch sử.
- Với Anh, áp 5/16d/lb lên raw cotton và sliding scale wheat theo declared price; chưa set rate cho wool/timber/ore/iron/cotton cloth.
- Với Pháp, có thể biểu diễn import prohibition và exception class cho cotton yarn fine count; không biến mức 7/8 francs/kg thành tariff chung cho toàn bộ yarn.
- Với Hoa Kỳ, dùng mức cotton cloth 24% nominal ad valorem (kèm minimum valuation) và các duty lines raw wool/iron theo đúng phân loại statute.
- Không suy ra giá thị trường từ tariff; thuế là một thành phần của landed cost, không thay thế supply/demand, domestic production, transport hoặc quality.

## 5. Nguồn và provenance

### PD / primary or contemporary sources

1. **Hansard, House of Commons, 6 May 1836 — raw cotton duty.**  
   https://hansard.parliament.uk/Commons/1836-05-06/debates/03185d87-4c8a-4213-a281-e295c4661637/CommonsChamber  
   Lời phát biểu nêu duty 5/16 penny/lb và duty collected £400,000 trong year ending 5 April 1836. Hansard OCR có thể có lỗi; kiểm tra scan nếu nhập thành dataset chính thức.

2. **Hansard, House of Commons, 16 March 1837 — Corn Laws.**  
   https://hansard.parliament.uk/commons/1837-03-16/debates/3767d68b-d5e8-43bc-aa78-b5a9e694296b/CornLaws  
   Mô tả 9 Geo. IV c.60 (1828): tại 62s wheat duty 24s8d, tại 73s duty 1s; dưới 62s cộng thêm 1s duty cho mỗi 1s giảm giá. Dùng như luật còn hiệu lực gần mốc 1836.

3. **Charles Coquelin, “Les douanes et les finances publiques,” Revue des Deux Mondes, tome 22, 1848, pp. 356–387.**  
   https://fr.wikisource.org/wiki/Les_Douanes_et_les_finances_publiques/01  
   Bài viết đương thời ghi lại ordinance 2 June 1834 và law 2 July 1836 về cotton yarn no. 143+; có nhập khẩu thực tế năm 1835/1836. Ghi rõ đây là contemporary account, không phải bản văn ordinance gốc.

4. **Hansard, House of Commons, 8 June 1842 — Prussian League raw cotton.**  
   https://hansard.parliament.uk/Commons/1842-06-08/debates/f88eeeef-696e-4822-8dbd-bc3f9a0e9a5e/CustomsActs%E2%80%94TheTariff%E2%80%94Cottons  
   Ghi raw cotton import vào Prussian commercial league 92,212 cwt (1833), 187,858 cwt (1836), 328,951 cwt (1840), và phát biểu raw cotton importation was free.

5. **United States Tariff Act of 14 July 1832, ch. 227, Statutes at Large, vol. 4.**  
   https://fraser.stlouisfed.org/title/tariff-1832-5889/fulltext  
   Bản luật gốc: wool, iron, cotton manufactures, minimum valuation. Các điều khoản được trích trong tài liệu này.

6. **United States Compromise Tariff Act of 2 March 1833, ch. 55, Statutes at Large, vol. 4.**  
   https://fraser.stlouisfed.org/title/compromise-tariff-1833-5860/fulltext  
   Bản luật gốc: giảm dần 1/10 phần vượt 20% theo các mốc ngày hiệu lực; tính đến đầu 1836 đã khấu trừ 2/10 phần vượt.

### Secondary cross-check — NOT PD / not distributable

- Accominotti & Flandreau, “Does Bilateralism Promote Trade? Nineteenth Century Liberalization Revisited” (2005), Table 3.  
  https://fondation.banque-france.fr/sites/default/files/media/2017/06/15/flandreau_0.pdf  
  Bảng tóm tắt cải cách Pháp 1836: wool 33%, cast iron 25%, prohibition on cotton threads repealed (phải hiểu cùng ngoại lệ/phân loại cụ thể). Dùng đối chiếu, không nhúng dữ liệu/bảng vào game.
- Tilly & Kopsidis, *From Old Regime to Industrial State* (2020), Table 5.2.  
  https://doi.org/10.7208/chicago/9780226725574.001.0001  
  Bảng tổng hợp Prussian tariff c.1831 theo nhóm hàng; copyrighted. Không dùng làm source asset hoặc tariff lines cho game.

## 6. Gaps — giữ unknown

- UK: wool, timber, iron ore, pig iron, bar iron và cotton manufactures đã có mức thuế trong các nguồn đương thời/near-year được bổ sung ở §7. Cotton yarn riêng biệt và phân loại chi tiết từng loại vải vẫn chưa có dòng thuế riêng đủ chắc.
- France 1836 raw cotton, wool raw exact 1836 rate, timber, coal, ore, pig iron, bar iron, wheat: exact tariff lines chưa được xác minh bằng luật gốc.
- Prussia/Zollverein 1836 wool, timber, ore, iron, wheat, cotton cloth: exact tariff schedule chưa được lấy.
- United States 1836 raw cotton import, timber, wheat, iron ore, exact duties on ore and selected iron subcategories: chưa trích đủ.
- Tariff drawback, bonded warehouse, transit, colonial preference và flag-of-origin differential: chưa lập ma trận theo commodity.
- Không chuyển mức 1848 của Pháp hoặc mức 1842/1843 của Anh về 1836; tariff schedule 1837–8 chỉ dùng làm đối chiếu gần năm, trừ khi được đối chiếu với hiệu lực luật/thuế thu thực tế 1836.
- Không suy ra giá trị tariff ad valorem equivalent nếu thiếu giá cùng năm, cùng phẩm cấp và cùng đơn vị.

---
**Trạng thái:** CG-21 là báo cáo nghiên cứu và đề xuất mô hình; không phải tariff database hoàn chỉnh. Không chạy build/test vì chỉ thay đổi tài liệu.

## 7. Bổ sung: tariff lines của Anh — nguồn đương thời 1835–1837

Lượt tra cứu bổ sung đã tìm được mức cho len, gỗ, sắt và vải cotton. Cần phân biệt:
- Các mức dưới đây là mức được ghi trong tài liệu thương mại/biểu thuế gần năm 1836.
- *The Yearly Journal of Trade, 1837–8* được xuất bản sau năm 1836, ghi luật và tariff đang có hiệu lực đến cuối kỳ 1837. Vì vậy, các mức của journal được gắn nhãn **near-year tariff schedule**, không tự động khẳng định từng dòng đã giữ nguyên suốt mọi ngày trong năm 1836.
- Dòng bar/unwrought iron có thêm đối chiếu độc lập bằng thu thuế và lượng home-consumption của năm 1836.

### 7.1 Bằng chứng cập nhật

| Hàng hóa | Thuế / điều kiện | Đơn vị | Độ chắc về mốc 1836 |
|---|---|---|---|
| Len thô ngoại quốc dưới 1s/lb | ½ penny | per lb | Cao — tài liệu thương mại 1843 mô tả đây là mức đang áp dụng từ 1825; Hansard 1842 xác nhận nhóm chịu ½d |
| Len thô ngoại quốc từ 1s/lb trở lên | 1 penny | per lb | Cao — tài liệu thương mại 1843 mô tả mức đang áp dụng; Hansard 1842 xác nhận nhóm chịu 1d |
| Len thô thuộc địa Anh dưới 1s/lb | Miễn thuế | per lb | Cao — bảng hồi cứu chi tiết 1815–1849 ghi miễn thuế từ 1825 |
| Len thô thuộc địa Anh từ 1s/lb trở lên | ½ penny | per lb | Cao — cùng bảng hồi cứu; không gộp vào nhóm wool ngoại quốc |
| Gỗ Baltic / châu Âu | 55 shillings (£2 15s) | per load | Cao — Hansard 1835 nêu mức hiện hành; McCulloch 1835 ghi chênh lệch 45s với gỗ thuộc địa |
| Gỗ thuộc địa Bắc Mỹ / Canada | 10 shillings | per load | Cao — Hansard 1835; Hansard 1840 xác nhận mức 55s Baltic / 10s Canada vẫn còn trước thay đổi 1842 |
| Iron in bars, or unwrought — nguồn ngoài thuộc địa | £1 10s | per ton | Cao — tariff schedule 1837–8; thống kê năm 1836 ghi £26,477 duty trên 17,631 tons entered for home consumption, xấp xỉ £1.50/ton |
| Iron in bars, or unwrought — thuộc địa Anh | 2s 6d | per ton | Near-year tariff schedule 1837–8 |
| Pig iron — nguồn ngoài thuộc địa | 10 shillings | per ton | Near-year tariff schedule 1837–8 |
| Pig iron — thuộc địa Anh | 1s 3d | per ton | Near-year tariff schedule 1837–8 |
| Iron ore | 5s 9d | per ton | Near-year tariff schedule 1837–8 |
| Cast iron | 10% ad valorem | value | Near-year tariff schedule 1837–8 |
| Wrought iron, not otherwise enumerated | 20% ad valorem | value | Near-year tariff schedule 1837–8 |
| Cotton manufactures | 10% ad valorem | £100 value | Near-year tariff schedule 1837–8 |
| Cotton manufactures wholly/partly made up, not otherwise charged | 20% ad valorem | £100 value | Near-year tariff schedule 1837–8 |
| Cotton yarn (separate tariff line) | unknown | — | Không gán mức thuế vải cotton cho sợi; chưa xác minh được dòng riêng |

### 7.2 Diễn giải và kiểm tra chéo

**Len:** Bài viết *Wool, &c.* trên *The Economist* (1843) nói mức đang áp dụng là ½d/lb cho wool dưới 1s/lb và 1d/lb cho wool trên 1s/lb; bài cũng cho biết mức 1d đã được giảm từ 6d năm 1824 và ½d được áp dụng từ 1825 cho loại giá thấp. Hansard 1842 phân biệt lượng len nộp thuế 1d, ½d và len thuộc địa miễn thuế. Bảng hồi cứu trong *The Economist* 1850 ghi rõ giai đoạn 5-7-1825 đến 15-5-1840: British possessions miễn thuế, ngoại lệ ½d ở nhóm từ 1s/lb; foreign countries 1d ở nhóm từ 1s/lb. Do đó không được gộp tất cả len thô thành một mức duy nhất.

**Gỗ:** Hansard 24-3-1835 ghi thuế 55s trên Baltic timber và 10s trên colonial timber; McCulloch, Supplement October 1835, xác nhận mức chênh lệch 45s và thảo luận đề xuất giảm chênh lệch. Hansard 1840 xác nhận 55s/10s vẫn là mức hiện hành trước cải cách 1842. Dòng này là ưu đãi theo nguồn gốc, không phải mở cửa chung cho mọi gỗ thô.

**Sắt:** *The Yearly Journal of Trade, 1837–8* liệt kê iron in bars/unwrought £1 10s/ton, pig iron 10s/ton, iron ore 5s9d/ton và các phân nhóm cast/wrought theo ad valorem. Để xác nhận bar/unwrought ở năm 1836, thống kê thuế năm 1836 ghi 17,631 tons tiêu thụ nội địa và £26,477 duty; chia ra £1.501/ton, phù hợp với £1 10s. Không lấy mức pig iron/ore trong schedule 1837–8 làm một quan sát chắc chắn cho toàn bộ năm 1836 nếu chưa có dòng thống kê 1836 theo đúng loại.

**Vải cotton:** tariff schedule 1837–8 phân biệt cotton manufactures thông thường 10% ad valorem và articles wholly/partly made up 20%. Đây là thuế nhập khẩu vào Anh đối với vải/hàng cotton nhập khẩu, không phải thuế xuất khẩu cotton goods của Anh. Cotton yarn không có dòng riêng được xác minh trong lượt này.

### 7.3 Nguồn bổ sung và trang

1. **Charles Pope (ed.), *The Yearly Journal of Trade, 1837–8*, 17th ed.**  
   Bản scan public domain: https://upload.wikimedia.org/wikipedia/commons/c/c3/California_Digital_Library_%28IA_yearlyjournaloft00pope%29.pdf  
   - pp. 70–71 (printed pp. 70–71): cotton manufactures 10%/20% ad valorem.
   - p. 84 (printed p. 84): iron in bars/unwrought £1 10s/ton; colonial 2s6d; pig iron 10s/ton; colonial 1s3d; ore 5s9d/ton; cast 10%; wrought not otherwise enumerated 20%.
   - p. xxviii (front matter/statistical returns): import, home consumption and duty receipts for 1836; iron in bars/unwrought row.
   - Title page says statutes are brought down to close of session 1 Victoria, 1837; use as near-year schedule, not as proof that every row was unchanged throughout 1836.

2. **Hansard, House of Commons, 24 March 1835 — Timber Duties.**  
   https://hansard.parliament.uk/commons/1835-03-24/debates/2559c53c-1b5e-49a3-959a-8391fd0e46c3/TimberDuties  
   Baltic timber 55s/load; colonial timber 10s/load.

3. **J. R. McCulloch, *Dictionary of Commerce*, Supplement, October 1835, “Timber”.**  
   https://darwin-online.org.uk/converted/pdf/1832_McCulloch_dictionary_A5105.pdf  
   Printed pp. 49–50, lines in scan around the timber committee report: 45s duty differential; recommendation to reduce by no more than 15s; shipments made in 1836 were not to be affected by the proposed change.

4. **Hansard, House of Commons, 1 June 1840 — Customs Duties.**  
   https://api.parliament.uk/historic-hansard/commons/1840/jun/01/customs-duties  
   Confirms 55s Baltic and 10s Canadian timber as then-current rates before the 1842 tariff changes.

5. **“Wool, &c.”, *The Economist*, August 1843.**  
   https://upload.wikimedia.org/wikipedia/commons/5/58/The_Economist_1843-08-_Vol_1_Preliminary_Number_%28IA_sim_economist_1843-08_1_preliminary-number%29.pdf  
   Contemporary retrospective: foreign wool 1d/lb above 1s/lb and ½d below; 1836 imports 64,239,977 lbs.

6. **“Rates of Duty on Wool—1815 to 1849”, *The Economist*, 23 November 1850.**  
   https://upload.wikimedia.org/wikipedia/commons/8/80/The_Economist_1850-11-23-_Vol_8_Iss_378_%28IA_sim_economist_1850-11-23_8_378%29.pdf  
   Retrospective schedule: 5 July 1825–15 May 1840, British possessions free (½d for wool valued at 1s/lb and upwards); foreign countries 1d for wool valued at 1s/lb and upwards. Lower-value wool rates described in the accompanying notes.

7. **Hansard, House of Commons, 8 June 1842 — Customs Acts, Tariff, Cottons.**  
   https://api.parliament.uk/historic-hansard/commons/1842/jun/08/customs-acts-the-tariff-cottons  
   Distinguishes quantities of wool paying 1d, ½d and no duty (colonial).

### 7.4 Revised UK conclusion

The UK did **not** apply a uniform “raw materials free / manufactures taxed” rule:
- Raw cotton: small specific duty 5/16d/lb.
- Wool: low specific duty, tiered by value and origin.
- Timber: strong origin-based preference (55s Baltic vs 10s Canada).
- Iron ore and pig/bar iron: specific duties, with colonial preferences and separate product-stage rates.
- Cotton manufactures: 10% ad valorem, rising to 20% for made-up articles.

This evidence supports Claude’s decision to split openness by commodity stage **and** add country/origin exceptions. It does not justify setting all raw materials to fully open. Keep yarn and any unverified commodity lines unknown.
