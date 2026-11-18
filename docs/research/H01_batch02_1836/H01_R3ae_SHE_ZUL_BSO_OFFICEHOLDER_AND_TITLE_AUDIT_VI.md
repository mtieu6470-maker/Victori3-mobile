# H01 R3ae — Kiểm toán người đứng đầu và chức danh tại Shewa, Zulu và Basotho

**Mốc mô phỏng:** 1836-01-01  
**Repository snapshot trước R3ae:** `3ba97713c2e767f201c300de51fddcc888d45321`  
**Phạm vi:** nghiên cứu lịch sử, đối chiếu hồ sơ người đứng đầu và succession coverage; không cập nhật dữ liệu chạy trong game.  
**Trạng thái:** `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

## 1. Kết luận điều hành

R3ae kiểm tra ba hồ sơ H01 đang có trong `_core_profiles_asia_africa.json`:

| Entity | Hồ sơ hiện tại | Kết luận nghiên cứu cho 1836-01-01 | Xử lý đề xuất |
|---|---|---|---|
| SHE — Shewa | Sahle Selassie, “Negus of Shewa”, since 1813 | Sahle Selassie là người cai trị Shewa ở mốc 1836. Hai vấn đề cần tách: (a) một mục bách khoa ghi 1806–1847 nhưng chính nội dung mục đó lại đặt cha ông cai trị 1808–1813 và nói Sahle Selassie được đưa lên ngai sau khi cha mất; (b) Darkwah và Bekele cho biết ông nhận/đảm nhiệm chức Ras khi lên nắm quyền, rồi tự xưng Negus khoảng năm 1839. | Giữ nhận diện người cai trị năm 1836; không coi “Negus từ 1813” là đã được chứng minh. Ghi rõ xung đột 1806/1813 và mốc tự xưng Negus khoảng 1839. Chưa sửa live profile. |
| ZUL — Zulu | Dingane kaSenzangakhona, King, since 1828-09-22 | Dingane cai trị Zulu tại snapshot 1836. SAHO nêu ngày giết Shaka là 22-09-1828; ODNB chỉ ghi tháng 9/1828. Mpande ly khai và liên minh với Voortrekkers từ 1839, nhưng Dingane chỉ bị đánh bại trong chiến dịch 1840 và Mpande được công nhận/kế vị trong năm 1840. | Giữ Dingane là người đứng đầu năm 1836. Ngày 22/9/1828 có thể giữ như một ứng viên ngày chính xác nhưng phải ghi nguồn thứ cấp và khác biệt độ chính xác. Không dịch chuyển kế vị sang năm 1839. |
| BSO — Basotho | Moshoeshoe I, King, since 1822 | Moshoeshoe đã lãnh đạo nhóm/cộng đồng BaMokoteli và đang là trung tâm của quá trình tập hợp các nhóm Basotho trước năm 1836. SAHO ghi ông kế vị cha làm chief năm 1820. Tuy nhiên, nghiên cứu về luật kế vị Lesotho cảnh báo không thể xác định chắc thời điểm/cách thức ông đảm nhận chức Morena; danh xưng Morena e Moholo/“paramount chief” phát triển theo thời gian và cách gọi “King” trong lịch sử hiện đại không nên biến thành một mốc lên ngôi chính xác. | Giữ Moshoeshoe là người lãnh đạo tại snapshot 1836; hạ mức chắc chắn đối với `since=1822` và chức danh “King” như một chức vụ đã định hình đầy đủ. Biểu diễn quyền lực Basotho như quá trình kết tụ/chính trị hóa dần, không gán một ngày chuyển đổi nhà nước giả chính xác. |

### Kết luận trọng yếu

1. **SHE:** người cai trị không phải điều tranh cãi chính; mốc bắt đầu và chức danh mới là điểm cần chỉnh lý. Không đồng nhất quyền lực của Shewa với ngai vàng đế quốc Ethiopia ở Gondar.
2. **ZUL:** phải phân biệt cuộc đảo chính năm 1828, cuộc đào thoát/liên minh của Mpande từ 1839, trận Maqongqo và sự công nhận Mpande năm 1840. “1839” không phải năm kế vị đã hoàn tất.
3. **BSO:** tách việc Moshoeshoe kế vị cha làm chief, sự phát triển của danh xưng Morena/Morena e Moholo, và quá trình hình thành vương quốc Basotho. Không áp khái niệm “King” hiện đại một cách hồi tố mà không giải thích.
4. **Historical Mode:** `heads_of_state.json` hiện không có các chuỗi kế vị riêng cho SHE, ZUL hoặc BSO. Các successor sau năm 1836 của ba đơn vị này vì thế chưa có lịch sử chuyên biệt trong tệp; đây là khoảng trống dữ liệu tiếp diễn, không được lấp bằng việc tự bịa succession.

R3ae không thay đổi profile, source runtime, dữ liệu dân số, political entity, map owner, event, engine, save/schema hoặc APK.

## 2. SHE — Shewa: Sahle Selassie, Ras và danh xưng Negus

### 2.1. Người cai trị tại snapshot

Hồ sơ hiện tại nhận diện Sahle Selassie là người đứng đầu Shewa. Các nguồn được kiểm tra đều hỗ trợ ông cai trị Shewa trước và trong năm 1836; tranh luận chính nằm ở năm bắt đầu và danh hiệu được sử dụng tại từng thời điểm.

Richard Pankhurst là nguồn tổng quan đang được profile tham chiếu. Bổ sung đối chiếu R3ae gồm:
- R. H. K. Darkwah, “A New Approach to Ethiopia in the 18th and 19th Century,” *Research Review (Legon)* 3(3) (1967), pp.44–53.
- Shiferaw Bekele, mục “Śahlä Śǝllase,” *Encyclopaedia Aethiopica*, vol. IV (2010), pp.465–467.
- Bộ sách giáo khoa Lịch sử lớp 9 do Bộ Giáo dục Ethiopia phát hành năm 2023, mục “The Kingdom of Shewa”.

Darkwah mô tả Wäsän Sägäd là người tiền nhiệm, sau đó Sahle Selassie trở thành Ras và về sau tự xưng Negus. Darkwah dẫn chứng một bức thư năm 1839 của Antoine d’Abbadie và phản ứng của giới giáo sĩ/quý tộc tại Gondar đối với danh hiệu mới. Bekele cũng phân biệt danh hiệu Ras khi Sahle Selassie đảm nhiệm quyền lực với việc tự xưng `nəgus` khoảng năm 1839.

### 2.2. Xung đột niên đại 1806 và 1813

Mục Bekele ghi triều đại 1806–1847, nhưng cùng mục lại nói:
- cha ông, Wäsän Sägäd, cai trị giai đoạn 1808–1813;
- Sahle Selassie được đưa tới triều đình và đăng quang sau khi cha mất;
- ông được cho là khoảng 18 tuổi vào thời điểm đó.

Các mệnh đề này không thể đồng thời tạo thành một chronology khép kín nếu hiểu 1806 là ngày bắt đầu quyền lực thực tế. Darkwah đặt thời kỳ Wäsän Sägäd 1809–1813 và nói Sahle Selassie kế nhiệm sau đó; sách giáo khoa Bộ Giáo dục Ethiopia cũng dùng 1813–1847. Vì vậy 1813 hiện có sự hỗ trợ đối chiếu tốt hơn cho mốc bắt đầu quyền lực, nhưng vẫn cần kiểm tra king-list/chronicle gốc trước khi tuyên bố ngày hoặc tháng chính xác.

R3ae **không tự giải quyết** mâu thuẫn 1806 bằng cách xóa nguồn hoặc coi một nguồn là tuyệt đối. Bất đồng được ghi thành yêu cầu chứng cứ.

### 2.3. Chức danh tại năm 1836

Đây là điểm quan trọng nhất đối với hồ sơ live:
- Darkwah ghi Wäsän Sägäd sử dụng tước Ras; Sahle Selassie cũng đảm nhiệm chức Ras khi lên quyền lực.
- Darkwah mô tả việc tự xưng Negus vào năm 1839 và trích nhận xét đương thời rằng giới giáo sĩ/quý tộc trung tâm không công nhận danh hiệu ấy.
- Bekele cũng đặt việc tự xưng `nəgus` khoảng 1839 và nhấn mạnh mức độ công nhận không đồng nhất.

Do snapshot game là 1836-01-01, ghi “Negus of Shewa” như thể danh hiệu này đã được sử dụng liên tục từ năm 1813 có nguy cơ hồi tố một danh xưng mà các nguồn đặt vào khoảng 1839. Mệnh đề có thể bảo vệ tốt hơn ở snapshot là **Sahle Selassie, Ras và người cai trị Shewa**. Tuy nhiên, việc sửa title live cần quyết định dữ liệu riêng; R3ae chỉ đề nghị không gộp `Ras` và `Negus` thành một chức danh bất biến.

Cũng cần phân biệt người đứng đầu Shewa với hoàng đế/negus của trung tâm Ethiopia. Quyền lực Shewa có mức tự chủ thực tế, trong khi các trung tâm quyền lực ở Gondar và vùng Yejju có cách nhìn riêng về tính hợp pháp của danh hiệu.

### 2.4. Kết luận SHE

- Ruler identity tại 1836: **supported** — Sahle Selassie.
- Start year: **contested / needs source collation** — 1813 được Darkwah và sách giáo khoa Ethiopia hỗ trợ; mục Bekele có con số 1806 nhưng nội tại không nhất quán.
- Title at 1836: **revision candidate** — Ras phù hợp hơn Negus nếu đọc theo trình tự chức danh trong Darkwah/Bekele; Negus tự xưng khoảng 1839.
- Không chỉnh hồ sơ live trong R3ae.

## 3. ZUL — Zulu: Dingane và thời điểm kế vị của Mpande

### 3.1. Dingane tại snapshot 1836

John D. Omer-Cooper, mục “Dingane ka Senzangakhona” trong *Oxford Dictionary of National Biography* (2004), xác định Dingane là vua Zulu khoảng 1828–1840. South African History Online (SAHO) ghi Dingane lên nắm quyền sau khi Shaka bị giết ngày 22 September 1828. Do đó, nhận diện Dingane là người đứng đầu tại 1836-01-01 được hỗ trợ tốt.

### 3.2. Độ chính xác ngày 22 September 1828

SAHO nêu ngày cụ thể 22-09-1828; trích đoạn ODNB được kiểm tra chỉ xác định sự kiện xảy ra trong September 1828. R3ae vì vậy phân biệt:
- tháng/năm 9/1828: được hỗ trợ bởi tài liệu tham khảo học thuật;
- ngày 22/9/1828: được ghi trong nguồn lịch sử tổng hợp SAHO, nhưng chưa được đối chiếu ở đây với biên niên hoặc tư liệu đương thời cấp sơ cấp.

Không cần hạ toàn bộ sự kiện xuống “không biết ngày”; chỉ cần ghi rõ cấp độ chứng cứ và không mô tả ngày chính xác như một dữ kiện đã được hai nguồn độc lập xác nhận.

### 3.3. Mpande: 1839 hay 1840?

Mô tả ngắn “Dingane bị Mpande thay thế” dễ nén nhiều sự kiện khác nhau:
- năm 1839: Mpande rời bỏ Dingane cùng người ủng hộ và liên kết với Voortrekkers; điều này mở một cuộc nội chiến/chiến dịch kế vị.
- đầu năm 1840: lực lượng Dingane thất bại trong chiến dịch kết thúc tại Maqongqo; Dingane chạy khỏi trung tâm quyền lực.
- tháng 2/1840: Mpande được công nhận/thiết lập làm vua Zulu theo trình tự chronology trong nguồn thứ cấp được dùng.

Vì vậy, **1839 là mốc nổi dậy/liên minh**, không phải ngày chuyển ngôi hoàn tất. Với mô phỏng Historical Mode, cần tách `defection/alliance`, `civil_war`, `decisive_battle`, `flight/death` và `accession/recognition` thành các loại sự kiện riêng. Không ghi Mpande kế vị năm 1839 chỉ vì cuộc nổi dậy bắt đầu trong năm ấy.

### 3.4. Kết luận ZUL

- Dingane là người đứng đầu Zulu ở snapshot 1836: **supported**.
- Ngày 22-09-1828: **supported by secondary online history; exact-day primary verification open**.
- Mpande’s accession: **1840 year-level**, không phải 1839; chuỗi sự kiện cần tách.
- Không thay đổi succession runtime hoặc `heads_of_state.json`.

## 4. BSO — Basotho: Moshoeshoe I và sự hình thành quyền lực

### 4.1. Moshoeshoe tại snapshot 1836

South African History Online ghi Moshoeshoe kế vị cha, Mokhachane, làm chief của BaMokoteli vào năm 1820. Nghiên cứu của Elizabeth A. Eldredge về thung lũng Caledon mô tả BaMokoteli là một chiefdom nhỏ trong thập niên 1810; Moshoeshoe là con trai lớn của Mokhachane và đã xây dựng một làng riêng sau giai đoạn initiation. Bối cảnh đầu thập niên 1820 gồm hạn hán, mất mùa, mất gia súc, di cư và tái định cư — các yếu tố góp phần thay đổi cấu trúc chiefdom.

Đến năm 1836, Moshoeshoe là nhân vật lãnh đạo và trung tâm của quá trình tập hợp cộng đồng Basotho. Điều này không có nghĩa một vương quốc tập quyền đã ra đời bằng một lễ đăng quang có ngày chính xác năm 1822.

### 4.2. “Chief”, “Morena”, “Morena e Moholo” và “King”

H. Nyane (2019) trong nghiên cứu về quy tắc kế vị thể chế quân chủ Lesotho dẫn lại Duncan và Machobane để làm rõ một điểm quan trọng:
- khó xác lập chính xác ngày và cách Moshoeshoe đảm nhiệm chức Morena trước thời kỳ Lifaqane;
- danh xưng “Paramount Chief” là thuật ngữ hiện đại gắn với vị thế cá nhân của Moshoeshoe; không nên đọc nó như một chức danh hiến định đã định hình sẵn từ đầu thế kỷ XIX;
- sự khác nhau giữa Morena và Morena e Moholo phải được giữ lại khi mô tả cấu trúc lãnh đạo.

Nguồn SAHO đưa 1820 như năm kế vị cha; profile hiện tại ghi `since=1822`. Chưa có đủ chứng cứ để khẳng định 1822 là ngày bắt đầu chính xác của một chức vụ “King” theo nghĩa hiện đại. Cũng không nên thay 1822 bằng 1820 như thể bất đồng đã được giải quyết hoàn toàn; cần ghi năm 1820 là chronology của SAHO và ghi yêu cầu truy vết đến oral history/nguồn gốc.

### 4.3. Hình thành Basotho polity và Thaba Bosiu

Sự phát triển của quyền lực Moshoeshoe là quá trình thu hút, bảo vệ, sáp nhập và liên kết nhiều nhóm người trong bối cảnh chiến tranh và di cư. Lịch sử Basotho không nên được mô hình hóa như một sự kiện duy nhất “thành lập vương quốc” có ngày chính xác, trừ khi có chứng cứ cụ thể cho từng hành động và phạm vi quyền lực.

R3ae không khẳng định ngày chính xác chiếm/định cư Thaba Bosiu, không định lượng số người tị nạn, và không áp dụng ranh giới lãnh thổ hiện đại Lesotho ngược về năm 1836. Các mốc này cần được xác minh theo nguồn địa phương, oral traditions và lịch sử không gian trước khi dùng cho map ownership.

### 4.4. Kết luận BSO

- Moshoeshoe là người lãnh đạo Basotho tại snapshot 1836: **supported**.
- Kế vị cha làm chief năm 1820: **supported by SAHO; exact timing/source chain needs corroboration**.
- `since=1822` của live profile: **not sufficiently supported as precise accession date**.
- “King” / “paramount chief” từ một năm cố định: **historically over-simplified**; cần phân biệt Morena, Morena e Moholo và quá trình hình thành polity.
- Không sửa live profile hoặc map ownership trong R3ae.

## 5. Historical Mode — khoảng trống succession sau năm 1836

Tại branch HEAD trước R3ae, `historical_data/leaders/heads_of_state.json` có mô tả các chuỗi người đứng đầu từ 1836–1900 nhưng không có các key riêng cho SHE, ZUL hoặc BSO trong `entities`. Điều này có nghĩa các successor sau snapshot có thể được tạo bằng cơ chế fallback thay vì lịch sử chuyên biệt theo từng nước.

Đây là vấn đề chất lượng Historical Mode:
1. ZUL cần chuỗi Dingane → Mpande (1840) và successor sau đó, có điều kiện chính xác về governance và ngày hiệu lực.
2. BSO cần chuỗi Moshoeshoe I và các giai đoạn tiếp theo, nhưng phải phân biệt người kế vị / vai trò thủ lĩnh / danh hiệu được sử dụng.
3. SHE cần chuỗi Sahle Selassie → Haile Malakot (1847) và successor về sau, tách người cai trị Shewa khỏi các người nắm ngai ở Gondar/đế quốc Ethiopia.

Không bổ sung các chuỗi này trong R3ae. Cần một task riêng có source genealogy, governance matching và event tests trước khi thêm dữ liệu vào tệp succession.

## 6. Khuyến nghị thiết kế dữ liệu lịch sử

1. **Title chronology:** chức danh có thể thay đổi trong cùng một thời gian cầm quyền; lưu title `valid_from`, `valid_to`, confidence và source riêng thay vì một title bất biến theo toàn bộ reign.
2. **Ruler vs polity status:** một cá nhân có thể là chief, leader of a confederating process hoặc Morena e Moholo ở các thời điểm khác nhau; không tự động gọi tất cả là king.
3. **Event chronology:** phân biệt revolt/defection, alliance, battle, flight, death, accession, recognition và consolidation.
4. **Date precision:** lưu năm, tháng, ngày và mức độ chắc chắn riêng; không tạo ngày tháng giả chỉ để thỏa schema.
5. **Historical Mode succession:** successor phải có source, dates, title, governance constraints và điều kiện chế độ rõ ràng; thiếu dữ liệu thì đánh dấu gap thay vì sinh lịch sử giả được trình bày như thật.

## 7. Nguồn và giới hạn kiểm tra

1. R. H. K. Darkwah, “A New Approach to Ethiopia in the 18th and 19th Century,” *Research Review (Legon)* 3(3) (1967), pp.44–53. PDF scan was visually inspected at printed pp.49–50 for Ras/Negus distinction and contemporary recognition context: https://pdfproc.lib.msu.edu/?file=%2FDMC%2FAfrican+Journals%2Fpdfs%2FInstitue+of+African+Studies+Research+Review%2F1967v3n3%2Fasrv003003003.pdf
2. Shiferaw Bekele, “Śahlä Śǝllase,” *Encyclopaedia Aethiopica*, vol. IV (2010), pp.465–467. Searchable entry inspected; it contains an internal 1806/1813 chronology issue: https://www.habeshahistory.com/encyclopedia/sahla-sellase-p0492-a-y2418-v4
3. Federal Democratic Republic of Ethiopia, Ministry of Education, Grade 9 History Student Textbook (2023), Unit 8.5, “The Kingdom of Shewa”: https://anrseb.gov.et/Backup%20dec%202021/wp-content/uploads/New_Text_Books/Grade9/G9-History-STB-2023-ANRSEB.pdf
4. R. H. K. Omer-Cooper, “Dingane ka Senzangakhona,” *Oxford Dictionary of National Biography* (2004), DOI: 10.1093/ref:odnb/53756. Publisher extract/metadata inspected; full entry access limited: https://academic.oup.com/oxford-dictionary-of-national-biography/reference/63486/reference-article-abstract/580017742
5. South African History Online, “King Dingane ka Senzangakhona,” revised 20 July 2026. Searchable page inspected: https://sahistory.org.za/people/king-dingane-ka-senzangakhona
6. Elizabeth A. Eldredge, “The Caledon River Valley and the BaSotho of Moshoeshoe, 1821–33,” in *Kingdoms and Chiefdoms of Southeastern Africa: Oral Traditions and History, 1400–1830* (Boydell & Brewer, 2015), pp.267–293. Cambridge chapter summary inspected; full chapter text not available in the inspected view: https://www.cambridge.org/core/books/abs/kingdoms-and-chiefdoms-of-southeastern-africa/caledon-river-valley-and-the-basotho-of-moshoeshoe-182133/6B34835F371D0480D5FBBF5460A27CE3
7. South African History Online, “King Moshoeshoe I,” revised 23 August 2019. Searchable page inspected: https://sahistory.org.za/people/king-moshoeshoe-i
8. H. Nyane, “The Constitutional Rules of Succession to the Institution of Monarch in Lesotho,” *Potchefstroom Electronic Law Journal* 22 (2019), DOI: 10.17159/1727-3781/2019/v22i0a4461. Full open-text article inspected; discussion of historical titles relies on prior scholarship cited in its bibliography: https://www.scielo.org.za/scielo.php?pid=S1727-37812019000100027&script=sci_arttext
9. Motlatsi Thabane, “History of Lesotho,” *Oxford Research Encyclopedia of African History* (2023), DOI: 10.1093/acrefore/9780190277734.013.1328. Publisher abstract/metadata inspected: https://oxfordre.com/africanhistory/view/10.1093/acrefore/9780190277734.001.0001/acrefore-9780190277734-e-1328
10. Christopher Saunders, “Moshoeshoe (c.1786–1870),” *Oxford Dictionary of National Biography* (2004), DOI: 10.1093/ref:odnb/53041. Metadata/abstract search only; full entry not independently inspected: https://doi.org/10.1093/ref:odnb/53041

## 8. Trạng thái và biên giới tích hợp

`SELF_AUDIT_ONLY / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`.

- Không thay đổi ba hồ sơ SHE/ZUL/BSO trong `historical_data/countries/_core_profiles_asia_africa.json`.
- Không thêm hoặc sửa dữ liệu trong `historical_data/leaders/heads_of_state.json`, `historical_data/sources/sources.json`, population, events, diplomacy, military, borders, political entities hoặc map owners.
- Không thay đổi `src/`, engine, UI, tests, assets, save/schema/migrations, Android, Gradle, workflows, signing hoặc APK artifacts.
- Không chạy build/APK, không tạo PR, không merge.
- Các patch decisions chỉ là khuyến nghị research; không phải chấp thuận của chủ dự án.
- Claude phải kiểm tra độc lập ở HEAD mới nhất; owner acceptance và mọi quyết định sửa dữ liệu sau đó là các cổng riêng.
