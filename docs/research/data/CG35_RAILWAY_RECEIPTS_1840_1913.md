# CG-35 — Kiểm định doanh thu và chi phí vận hành đường sắt, 1840–1913

**Trạng thái:** PARTIAL — đã có các chuỗi quan sát định lượng truy nguyên được cho Anh, Mỹ, Đức và Nga; Pháp có chỉ số trên mỗi km cho các kỳ bình quân; chưa có GDP đồng nhất đủ nguồn để tính receipts/GDP. Ấn Độ và Nhật chưa đưa số tổng doanh thu/chi phí vào register vì chưa xác minh được bộ thống kê quốc gia tương thích trong lượt này.

## Kết quả chính

- **Anh:** thống kê railway returns cho thấy tỷ lệ working expenses/gross receipts tăng từ khoảng 48.2% năm 1870 lên 63.0% năm 1907. Mạng lưới (miles open) tăng từ 15,537 miles năm 1870 lên 23,108 miles năm 1907. Bảng 1867–1908 là thống kê quốc gia tổng hợp, có receipts ancillary/miscellaneous trong các năm sau; cần giữ nguyên định nghĩa.
- **Anh 1913:** một bản tổng hợp dựa trên Railway Returns 1913 nêu gross receipts xấp xỉ £136m và expenses £87m, ratio khoảng 64.0%. Đây là số xấp xỉ và có thể khác định nghĩa operating-only; không dùng thay cho annual return gốc.
- **Mỹ 1913:** năm tài khóa kết thúc 30-06-1913, operating revenue $3,125,135,798; operating expenses $2,169,968,924; expense ratio 69.44%; average mileage operated 242,657.12 miles. Phạm vi loại trừ các tuyến có gross operating revenue dưới $100,000. Không phải năm lịch 1913.
- **Đức 1913:** bảng hồi cứu của Statistisches Reichsamt ghi 55,872 km Betriebslänge, tổng thu 3,348 triệu Mark và tổng chi 2,347 triệu Mark; ratio tính từ hai tổng là 70.1%. Đây là toàn Đế quốc Đức theo bảng 1923, không đồng nhất tuyệt đối với chỉ riêng Phổ.
- **Nga 1912:** bình quân chiều dài tuyến khai thác 61,507 verst (xấp xỉ 65,615 km); doanh thu 1,124,284 nghìn ruble; chi phí 666,985 nghìn ruble; ratio 59.3%. Năm 1912 là mốc gần nhất có bộ tổng hợp trong nguồn đã xác minh.
- **Pháp:** T. Loua công bố số bình quân năm trên mỗi km khai thác, không phải tổng doanh thu quốc gia: 1850–54 receipts 48,237 francs/km, expenses 16,497; 1865–69 là 42,726 và 20,343; 1875–79 là 42,847 và 22,174. Không thể suy ra tổng quốc gia nếu không ghép thêm độ dài mạng lưới bình quân cùng kỳ.

## CSV và cách đọc

Tệp CSV giữ đúng các trường yêu cầu của Claude. Trường để trống là dữ liệu không được nguồn xác nhận tương ứng, **không phải số 0**. Các quan sát Pháp giữ kỳ dữ liệu trong trường year và ghi chỉ số/km ở notes vì nguồn không công bố tổng quốc gia trong bảng được trích. GDP và receipts_share_gdp để trống cho toàn bộ các dòng; không ghép GDP/GNP từ chuỗi khác định nghĩa hoặc giá.

## Phương pháp và giới hạn

1. `operating_ratio = operating_expenses / gross_receipts`; ratio là phép tính từ hai đại lượng nguồn, không phải một quan sát được chép lại nếu nguồn không công bố ratio.
2. Không quy đổi tiền tệ giữa các nước, không quy đổi giá danh nghĩa sang giá thực, không nội suy các năm trống.
3. Anh dùng miles open; Mỹ dùng average mileage operated; Đức dùng Betriebslänge; Nga dùng average verst operated. Các khái niệm này không đồng nhất hoàn toàn. CSV để route_km trống ở nơi không đủ căn cứ chuyển đổi phạm vi đo.
4. 1913 Mỹ là fiscal year ended June 30; 1913 Đức và Anh là năm lịch; Nga dùng 1912. Không nên đặt chúng lên một trục so sánh mà không gắn nhãn kỳ.
5. GDP cùng đơn vị/giá/năm chưa được ghép. Vì vậy không có căn cứ kết luận doanh thu đường sắt chiếm 6% GDP ở các nước; cần bộ GDP lịch sử tương thích (GDP hay GNP, giá hiện hành, biên giới lãnh thổ và năm tài khóa phải rõ).
6. Nguồn Pháp có tuyên bố bản quyền hạn chế tái sử dụng thương mại trên trang Numdam. Chỉ dùng để kiểm định nội bộ và trích dẫn; không đưa bản scan/ảnh/bảng nguyên dạng vào game hoặc gói dữ liệu phân phối nếu chưa có quyền.
7. Các nguồn FRASER, Statistische Bibliothek, HSUS/Cambridge, Numdam và bản tổng hợp Nga có điều kiện truy cập/quyền khác nhau. Bản ghi nguồn không đồng nghĩa dữ liệu đã được cấp phép tái phân phối.

## Khuyến nghị cho hiệu chỉnh CO-2b

- **Không giữ 0.3 revenue capture chỉ vì mô phỏng cho ra ~6% GDP.** Không có receipts/GDP quan sát đồng nhất trong tập hiện tại để xác nhận tham số đó.
- **Không đặt operating ratio toàn cầu cố định 0.6.** Các quan sát có ratio khoảng 0.48–0.70 trong các trường hợp và năm khác nhau; khác biệt định nghĩa, cơ cấu tuyến, phạm vi ancillary và kế toán ngăn việc lấy trung bình cơ học.
- Dùng các khoảng quan sát theo quốc gia/niên đại làm sanity checks, không phải target cứng: UK 1870 0.482; UK 1907 0.630; US FY1913 0.694; German Reich 1913 0.701; Russia 1912 0.593.
- Mô hình nên phân biệt **gross traffic receipts**, **operating expenses**, **net operating surplus** và **ancillary revenue**. Đừng gộp vốn đầu tư, lãi vay, thuế, trợ cấp hoặc lợi nhuận ngoài vận hành vào operating ratio.
- Tốc độ mở mạng lưới cần được kiểm riêng bằng km tuyến khai thác theo năm; không dùng tỷ lệ doanh thu để hiệu chỉnh tốc độ phủ.

## Nguồn và vị trí

1. **United Kingdom, Statistical Abstract 1847–1861**, bảng đường sắt, PDF trang in 72 (dữ liệu 1847–1860). Bản scan chính phủ, truy cập qua bản sao thư viện: https://escoe-website.s3.amazonaws.com/wp-content/uploads/2021/01/26151329/Statistical-Abstract-for-the-UK-1847-1861.pdf
2. **National Monetary Commission, Statistics for Great Britain, Germany, and France, 1867–1909**, Table No. 6, in-book p.16 / PDF table lines. FRASER: https://fraser.stlouisfed.org/files/docs/historical/nmc/nmc_578_1910_greatbritain.pdf
3. **Encyclopaedia Britannica (1911), “Railways”**, UK table 1860–1909; independent cross-check of mileage, receipts and expense ratios: https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/United_Kingdom/Railways
4. **Railway Returns for 1913**, summarized in RCHS Journal 225 (March 2016), Table 1 and reproduced official title page; 1913 return itself is Board of Trade/Cd.8038, published 1915. The journal article is copyrighted and is a finding aid, not a redistribution license: https://rchs.org.uk/wp-content/uploads/2020/02/Journal-225-Mar-2016.pdf
5. **Commercial and Financial Chronicle**, 18 July 1914, Railway Earnings Section, U.S. railways year ended 30 June 1913, “Revenues and Expenses” section: https://fraser.stlouisfed.org/title/commercial-financial-chronicle-1339/july-18-1914-518143/fulltext
6. **Historical Statistics of the United States, Millennial Edition**, Tables Df991–1001 (operating revenue/expenses) and Df927–955 (mileage): https://hsus.cambridge.org/HSUSWeb/toc/treeTablePathIdDf991-1001.html and https://hsus.cambridge.org/HSUSWeb/toc/treeTablePathIdDf927-955.html
7. **Statistisches Reichsamt**, “Die Eisenbahnen wichtiger Länder vor und nach dem Kriege,” *Wirtschaft und Statistik*, 20 June 1923, p.362; 1913 German Reich and Great Britain rows: https://www.statistischebibliothek.de/mir/servlets/MCRFileNodeServlet/DEAusgabe_derivate_00001605/Wirtschaft_und_Statistik-1923-12.pdf
8. **Edmond Théry**, *La transformation économique de la Russie*, chapter IV, section on railway system, comparative table 1902/1912: https://istmat.org/node/64
9. **T. Loua**, “Les chemins de fer français depuis 1841,” *Journal de la Société de Statistique de Paris*, vol.23 (1882), pp.5–12, table “Recettes et dépenses brutes par kilomètre exploité”: https://www.numdam.org/article/JSFS_1882__23__5_0.pdf

## Việc còn lại để đóng CG-35 hoàn toàn

- Lấy bảng gốc Board of Trade Railway Returns 1913 và xác nhận chính xác phạm vi 1913 UK (all companies, ancillary businesses, mileage).
- Trích HSUS đầy đủ cho 1890 US, ghép mileage từ đúng series cùng định nghĩa.
- Tìm annual railway statistics Ấn Độ và Nhật trước 1914 có revenue, expenses và route length.
- Tìm GDP/GNP nominal cùng năm và cùng lãnh thổ, có định nghĩa giá rõ ràng, cho các nước muốn tính receipts/GDP.
- Tìm chuỗi Pháp/Đức/Nga theo từng năm thay vì kỳ bình quân hoặc bảng hồi cứu.
