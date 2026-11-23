# CG-42 — Năm áp dụng quyền bầu cử và bảo hiểm xã hội theo quốc gia

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Ngày:** 2026-11-23  
**Trạng thái:** Research staging; chưa tích hợp vào engine.

## 1. Tóm tắt

Bộ dữ liệu có **63 dòng chính thể/quốc gia**, vượt ngưỡng tối thiểu 60 của yêu cầu. Mỗi dòng ghi ISO3 (mã lịch sử khi cần), thủ đô, năm phổ thông đầu phiếu nam nếu đã xác minh, năm quyền bầu cử nữ, năm bình đẳng đầy đủ khi quyền ban đầu bị hạn chế, năm bảo hiểm xã hội đầu tiên, năm bảo hiểm hưu trí và năm bảo hiểm thất nghiệp. Có thêm các giai đoạn đình chỉ hoặc hạn chế bầu cử cạnh tranh.

**Không điền năm bằng suy đoán.** Trường chưa có nguồn đủ chắc chắn được để `null`; điều này có nghĩa là chưa xác minh trong gói nghiên cứu, không có nghĩa là quốc gia chưa từng có chế độ đó.

## 2. Nguồn và phương pháp

### Quyền bầu cử nữ
Nguồn nền tảng là bản ghi nhớ của Tổng Thư ký Liên Hợp Quốc A/2462 ngày 26/8/1953. Tài liệu phân biệt:
- quyền bầu cử cấp quốc gia với cấp địa phương/tỉnh;
- quyền hạn chế với quyền bình đẳng;
- năm ban hành quyền với năm phụ nữ lần đầu thực sự bỏ phiếu;
- các giới hạn theo tuổi, học vấn, tài sản, tình trạng hôn nhân hoặc chủng tộc.

Ví dụ:
- Bỉ: một số phụ nữ được bỏ phiếu từ 1921; quyền bình đẳng toàn quốc từ 1948.
- Canada: quyền liên bang mở rộng theo giai đoạn 1917–1918; loại trừ một số nhóm bản địa còn kéo dài.
- Ấn Độ: Đạo luật 1935 mở rộng quyền hạn chế; phổ thông đầu phiếu bình đẳng theo Hiến pháp 1950.
- Nam Phi: quyền năm 1930 chỉ áp dụng cho phụ nữ da trắng; phổ thông đầu phiếu không phân biệt chủng tộc chỉ có từ 1994.
- Anh: phụ nữ có quyền hạn chế từ 1918; bình đẳng tuổi và điều kiện với nam từ 1928.
- Thụy Sĩ: quyền liên bang năm 1971, dù một số bang có quyền địa phương sớm hơn.

IPU Parline là nguồn dữ liệu hiện hành có trường riêng cho năm, cấp bầu cử, tính hạn chế và chi tiết giới hạn. CRS đối chiếu các trường hợp theo giai đoạn. Không gộp quyền địa phương thành quyền bầu cử quốc gia.

### Phổ thông đầu phiếu nam
Các năm được điền chỉ khi tài liệu so sánh cung cấp mốc có thể kiểm chứng. Nguồn chính gồm nghiên cứu về chuyển đổi bầu cử Tây Âu, Pilon và các nghiên cứu lịch sử so sánh. OWID/Lexical Index v6.9 là nguồn country-year để Claude có thể trích xuất tự động và kiểm tra lại trước khi calibration production.

Một số điểm mốc đã điền:
- Pháp 1848; Đan Mạch 1849; Thụy Sĩ 1848; Hy Lạp 1864.
- Đức 1871; New Zealand 1879; Bỉ 1919; Hà Lan 1917.
- Na Uy 1897; Phần Lan 1906; Thụy Điển 1909; Anh 1918.
- Ý 1919; Nhật Bản 1925; Mỹ 1870 (quyền pháp lý theo Tu chính án 15, nhưng cản trở trên thực tế ở miền Nam kéo dài tới 1965).

**Không được hiểu các mốc này là quyền bỏ phiếu thực tế của mọi nhóm dân cư.** Ví dụ Mỹ sau 1870 vẫn có các biện pháp tước quyền người da đen; Canada và Australia có các loại trừ người bản địa; Brazil còn loại trừ người mù chữ tới 1985.

### Bảo hiểm xã hội, hưu trí và thất nghiệp
Bảng ILO 2019, trang in 18, được kiểm tra trực tiếp trên ảnh trang để xác nhận đúng thứ tự cột:
1. bảo hiểm tai nạn lao động;
2. bảo hiểm y tế;
3. bảo hiểm hưu trí;
4. bảo hiểm thất nghiệp;
5. trợ cấp gia đình.

Từ đó:
- `social_insurance_year` = năm sớm nhất trong năm nhánh được bảng ghi nhận;
- `old_age_pension_year` = năm luật bảo hiểm hưu trí đầu tiên trong bảng;
- `unemployment_insurance_year` = năm luật bảo hiểm thất nghiệp đầu tiên trong bảng.

Bảng ILO chỉ bao phủ 23 nước OECD được chọn. Không ngoại suy sang các nước khác. Đối với các nước không có dữ liệu so sánh cùng chuẩn, trường được để trống. Báo cáo SSA 1930s và phụ lục ILO về thất nghiệp giúp phân biệt bảo hiểm bắt buộc với quỹ tự nguyện được trợ cấp, và năm ban hành với năm có hiệu lực.

## 3. Phạm vi social insurance có dữ liệu so sánh

| ISO3 | Quốc gia | Bảo hiểm xã hội sớm nhất | Hưu trí | Thất nghiệp |
|---|---|---:|---:|---:|
| AUS | Australia | 1902 | 1908 | 1944 |
| AUT | Austria | 1887 | 1907 | 1920 |
| BEL | Belgium | 1894 | 1900 | 1920 |
| CAN | Canada | 1927 | 1927 | 1940 |
| DNK | Denmark | 1891 | 1891 | 1907 |
| FIN | Finland | 1895 | 1937 | 1917 |
| FRA | France | 1898 | 1910 | 1905 |
| DEU | Germany | 1883 | 1889 | 1927 |
| GRC | Greece | 1914 | 1934 | 1945 |
| ISL | Iceland | 1909 | 1909 | 1936 |
| IRL | Ireland | 1897 | 1911 | 1911 |
| ITA | Italy | 1898 | 1919 | 1919 |
| JPN | Japan | 1911 | 1941 | 1947 |
| LUX | Luxembourg | 1901 | 1911 | 1921 |
| NLD | Netherlands | 1901 | 1919 | 1916 |
| NZL | New Zealand | 1898 | 1898 | 1930 |
| NOR | Norway | 1895 | 1936 | 1906 |
| PRT | Portugal | 1913 | 1935 | 1975 |
| ESP | Spain | 1900 | 1919 | 1919 |
| SWE | Sweden | 1891 | 1913 | 1934 |
| CHE | Switzerland | 1911 | 1946 | 1982 |
| GBR | United Kingdom | 1897 | 1908 | 1911 |
| USA | United States | 1930 | 1935 | 1935 |

**Lưu ý:** các mốc là năm luật/nhánh bảo hiểm được ghi nhận trong bảng ILO, không phải năm đạt bao phủ phổ quát. Ví dụ bảo hiểm thất nghiệp của Phần Lan năm 1917 thuộc mô hình quỹ tự nguyện được trợ cấp, bị bãi bỏ và thay thế năm 1934.

## 4. Các giai đoạn đình chỉ/hạn chế được ghi riêng

Các ví dụ có trong dữ liệu: Đức 1933–1945, Ý 1926–1945, Tây Ban Nha 1936–1977, Hy Lạp 1967–1974, Bồ Đào Nha 1926–1975, Argentina 1976–1983, Brazil 1964–1985, Chile 1973–1989, Ấn Độ 1975–1977, Hàn Quốc 1961–1987 và Thổ Nhĩ Kỳ 1980–1983.

Đây là giai đoạn đình chỉ hoặc hạn chế cạnh tranh bầu cử/dân chủ nghị viện, **không đồng nghĩa trong mọi trường hợp với việc bãi bỏ quyền pháp lý bỏ phiếu**. Cần dùng cùng dữ liệu V-Dem/LIED về bầu cử thực tế và quyền cạnh tranh, không xóa năm luật suffrage gốc.

## 5. Cách sử dụng cho AI cải cách luật

1. Dùng các năm làm **mốc kiểm định lịch sử**, không phải lệnh bắt buộc đổi luật trong cùng năm.
2. Tách quyền pháp lý khỏi quyền được thực thi: có phổ thông đầu phiếu nhưng bầu cử bị đình chỉ vẫn không phải dân chủ cạnh tranh.
3. Tách universal male suffrage, female suffrage và universal adult suffrage; không thay một mốc bằng mốc kia.
4. Tách luật hưu trí, bảo hiểm y tế, tai nạn lao động, thất nghiệp và trợ cấp gia đình. Không dùng một biến “welfare” duy nhất để giả lập toàn bộ hệ thống.
5. Với nước chưa có dữ liệu, giữ `null`; AI có thể học xác suất cải cách từ literacy, GDP/người, công nghiệp hóa, đô thị hóa, tổ chức lao động, chiến tranh và sức mạnh nhóm lợi ích, nhưng không được đọc năm lịch sử từ một bảng chưa có dữ liệu.
6. Cần đưa vào model các biến interruption/suspension và effective franchise. Nếu không, engine sẽ đánh giá sai nước độc tài chỉ vì hiến pháp vẫn ghi quyền bầu cử.

## 6. Giới hạn và việc còn lại

- Male suffrage đã được xác minh cho một tập con; các dòng còn lại để `null` chờ trích xuất country-year LIED v6.9 hoặc nguồn luật quốc gia.
- ILO 2019 chỉ có 23 nước OECD trong bảng so sánh; không nội suy social-insurance dates cho phần còn lại.
- Các chính thể lịch sử như Byelorussian SSR, Ukrainian SSR và Yugoslavia dùng ISO3 lịch sử/định danh kế thừa; không xem đó là quốc gia hiện đại độc lập trong năm 1917/1946.
- Pakistan: báo cáo UN 1953 chỉ xác nhận quyền bầu cử nữ cấp tỉnh trong giai đoạn đó và ghi chưa có luật cho bầu cử quốc gia; không dùng 1951 làm năm phổ thông đầu phiếu quốc gia.
- Thailand: UN A/2462 ghi 1922, nhưng quyền hiến định quốc gia gắn với thay đổi chế độ 1932; cần đối chiếu văn bản luật Thái trước khi dùng như mốc chính thức.
- Thời gian “suspended” trong gói là các khoảng lớn để kiểm định, không thay thế một bảng country-year đầy đủ.

## 7. Source register

- `un_a2462_1953` — UN Secretary-General, A/2462: Franchise of women (26 August 1953) (verified). https://digitallibrary.un.org/record/855358/files/A_2462-EN.pdf
- `crs_women_2023` — Congressional Research Service, Statistics on Women in National Governments Around the Globe (R45483) (supported). https://www.everycrsreport.com/reports/R45483.html
- `ipu_women_dictionary` — IPU Parline data dictionary: women’s right to vote (verified). https://data.ipu.org/data-dictionary/suffrage.right_to_vote/
- `owid_lied_male_2026` — Our World in Data: Men’s universal right to vote (Lexical Index 2026) (supported). https://ourworldindata.org/grapher/universal-suffrage-men-lexical
- `owid_lied_female_2026` — Our World in Data: Universal right to vote (Lexical Index 2026) (supported). https://ourworldindata.org/grapher/universal-suffrage-lexical
- `vdem_codebook_16` — V-Dem Codebook v16 (2026) (verified). https://www.v-dem.net/documents/70/codebook_v16.pdf
- `male_suffrage_pilon` — Pilon, Electoral transformation in Western Europe in the 19th and early 20th century: an overview (supported). https://dalspaceb.library.dal.ca/server/api/core/bitstreams/afc025bd-1b47-48ce-8e20-f2c29f8fa21f/content
- `male_suffrage_europe` — Electoral transformation in Western Europe in the 19th and early 20th century (supported). https://ora.ox.ac.uk/objects/uuid:6c3ebcf9-f25b-4ce8-a837-619230729c33/files/m8ae2548076a9d067f57bc51ab1802900
- `male_suffrage_socio` — Global Struggle for Suffrage Expansion: The European Case for Male Suffrage in the Nineteenth Century (supported). https://www.sociostudies.org/almanac/articles/global_struggle/
- `ilo_social_2019` — ILO, Global social security and economic development: Retrospect and prospect (2019) (supported). https://www.ilo.org/sites/default/files/wcmsp5/groups/public/%40asia/%40ro-bangkok/%40ilo-beijing/documents/publication/wcms_723404.pdf
- `ilo_unemployment_2000` — ILO, Whither Social Security? Annex 6: Unemployment – date of first law (supported). https://webapps.ilo.org/public/spanish/protection/ses/download/docs/bonnet.pdf
- `ssa_unemployment_1937` — US Social Security Administration archive: Social Security in America, unemployment compensation (verified). https://www.ssa.gov/history/reports/ces/cesbookc1.html
- `ssa_bismarck_pensions` — US Social Security Administration: historical development of social insurance (supported). https://www.ssa.gov/history/bortz.html
- `pension_programs_table` — The Political Origin of Pension Funding, Table 1: Development of Pension Systems (supported). https://www.pseweb.eu/ydepot/semin/texte0607/PER2006POL.pdf
- `aec_australia_1902` — Australian Electoral Commission, A short history of federal electoral reform (verified). https://www.aec.gov.au/Elections/history-of-electoral-reform.htm
- `issa_profiles` — ISSA Country Profiles – methodology and coverage (verified). https://www.issa.int/databases/country-profiles/about
