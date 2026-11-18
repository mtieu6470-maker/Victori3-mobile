# H01 R3ab — Kiểm toán người đứng đầu và quyền lực thực tế tại Ethiopia, Futa Jallon và Liberia

**Mốc mô phỏng:** 1836-01-01 (quy ước của game; độ chính xác của nguồn có thể chỉ đến năm hoặc tháng)  
**Repository snapshot:** `0f5685231569ed4c72783cdd79a8abed63819943`  
**Trạng thái:** `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`  
**Phạm vi:** nghiên cứu nguồn, phân biệt chức danh và khuyến nghị dữ liệu; không thay đổi runtime, historical data, schema hay APK.

## 1. Kết luận điều hành

R3ab kiểm tra ba hồ sơ mà trường `hos` hiện không mô tả đủ quan hệ giữa nguyên thủ danh nghĩa, người nắm quyền thực tế và viên chức hành chính:

| Thực thể | Hồ sơ hiện tại | Phát hiện R3ab | Định hướng xử lý |
|---|---|---|---|
| FJA — Futa Jallon | `hos=null`, `hos_q=missing` | Boubacar Barry ghi Bubakar giữ chức Almami đến tháng 11/1836; chức vụ bị giới hạn bởi cạnh tranh hai gia tộc, hội đồng trưởng lão và các thủ lĩnh tỉnh | Bubakar là ứng viên Almami tại mốc 1836; giữ provisional cho tới khi xác thực trang in và chuỗi nguồn |
| ETH — Ethiopia | `hos=Ras Ali II of Yejju`; ghi chức “Regent for the Gondarine emperor”; hoàng đế danh nghĩa chưa xác định | Sahle Dengel là hoàng đế danh nghĩa 1832–1840; Ras Ali Alula/Ali II là quyền lực thực tế của triều Yejju ở trung tâm Ethiopia; Mänän Libän Amäde có ảnh hưởng lớn | Tách “nguyên thủ danh nghĩa” khỏi “người nắm quyền thực tế”; không xóa Ras Ali khỏi hồ sơ |
| LIB — Liberia/Monrovia | `hos=null`, `hos_q=missing`; ghi ACS colonial agents | Năm 1836 chưa phải quốc gia có chủ quyền. Anthony D. Williams là agent; Thomas Buchanan đến tháng 1/1836 và quản lý các khu định cư Bassa riêng; Buchanan chỉ là governor từ 1839 | Không tạo tổng thống/nguyên thủ năm 1836; ghi vai trò agent và phân biệt quản trị Bassa |

**Không trường hợp nào được tự động ghi vào dữ liệu gameplay trong R3ab.** Những kết luận trên là nghiên cứu nguồn và đề xuất chuẩn hóa vai trò, không phải phê duyệt thay đổi dữ liệu hay schema.

## 2. Futa Jallon (FJA): Almami Bubakar và cấu trúc quyền lực phân tán

### 2.1. Bằng chứng về người giữ chức vụ

Boubacar Barry, *Senegambia and the Atlantic Slave Trade* (1997), phần về nửa đầu thế kỷ XIX, bản in pp.148–157, cho biết Bubakar giữ danh hiệu Almami từ tháng 5/1827 đến tháng 11/1836, ngoài một lần gián đoạn khoảng ba tháng trong năm 1831. Sau tháng 11/1836, ông phải nhường quyền cho Yaya thuộc phe Soriya. Barry cũng mô tả nỗ lực thỏa hiệp luân phiên nhiệm kỳ hai năm giữa hai gia tộc Alfaya và Soriya, nhưng thỏa thuận thường xuyên bị vi phạm.

Nếu chấp nhận mốc in p.150 của Barry, ngày mô phỏng 1836-01-01 nằm trong khoảng Bubakar giữ chức. Đây là căn cứ cho **ứng viên Almami Bubakar** tại mốc đó, không phải bằng chứng cho quyền lực tuyệt đối hay một triều đại quân chủ tập quyền.

**Giới hạn kiểm chứng:** văn bản cụ thể của p.150 hiện được đọc qua bản trích xuất/transcription số có thể tìm kiếm, không phải ảnh chụp trang in gốc đã xác thực. Trang Cambridge xác nhận sách, tác giả, phạm vi phần/chương và phân trang in pp.148–157; nhưng quyền truy cập phần toàn văn bị giới hạn. Vì vậy mốc tháng 11/1836 cần giữ trạng thái provisional và có yêu cầu kiểm tra bản in gốc.

Bài nghiên cứu của Alfa Mamadou Diallo Lélouma và Bernard Salvaing (2017) xác định Bubakar mo Almaami Bademba mo Karamoko Alfa mo Timbo, trở về Timbo và được bầu làm Almami lần đầu khoảng tháng 3/1824; bài này dẫn luận án Winston McGowan (1975), p.526. Nguồn này giúp xác định nhân vật và quá trình được bầu, nhưng **không độc lập xác nhận toàn bộ nhiệm kỳ 1827–1836**.

### 2.2. Cấu trúc chính trị và cách biểu diễn trong game

Nguồn Barry mô tả cạnh tranh giữa hai gia tộc hoàng gia Alfaya/Soriya tại Timbo; hội đồng trưởng lão và các thủ lĩnh tỉnh có vai trò giám sát hoặc kiềm chế Almami. Cambridge summary cũng nhấn mạnh tranh chấp giữa hai gia tộc về quyền lực trung tâm và khủng hoảng bên trong Futa Jallon.

Do đó:
- “Almami” là chức vụ lãnh đạo trung tâm phù hợp để biểu diễn nhân vật đứng đầu, nhưng không đồng nghĩa với quyền kiểm soát trực tiếp tuyệt đối trên toàn bộ các tỉnh.
- Trường `hos` trống ở FJA là một thiếu sót dữ liệu có thể khắc phục, nhưng cần xác minh tên, biến thể phiên âm và thời điểm trước khi sửa.
- Không nên mô hình Futa Jallon năm 1836 thành một quân chủ tuyệt đối chỉ vì profile hiện đang dùng government preset có nhãn monarchic/theocratic. Cấu trúc hai gia tộc, hội đồng trưởng lão và quyền tự chủ tỉnh phải được thể hiện trong mô hình chính trị khi hệ thống đó được mở phê duyệt.

### 2.3. Cảnh báo nhầm địa danh

Một công trình về “A Tentative Chronology of Futa Toro” là nghiên cứu **Futa Toro**, không phải Futa Jallon. Bảng Almamies trong bài này không được dùng làm danh sách người giữ chức Almami ở Timbo/Futa Jallon. Đây là hai thực thể lịch sử khác nhau, dù tên gọi gần nhau và đều có chức danh Almamy/Almami.

## 3. Ethiopia (ETH): tách hoàng đế danh nghĩa, Ras và người bảo trợ quyền lực

### 3.1. Hoàng đế danh nghĩa

Donald Crummey, “Śahlä Dǝngǝl,” *Encyclopaedia Aethiopica*, vol. IV (2010), pp.464–465, ghi Sahle Dengel là ruler danh nghĩa của Ethiopia trong các giai đoạn 1832–1840, 1842–1843, 1846–1850 và 1852–1855. Năm 1836 nằm trong giai đoạn 1832–1840. Bài viết mô tả vai trò của ông hạn chế và phụ thuộc vào các lãnh chúa quyền lực.

Cùng nguồn ghi Ras Ali phế truất Sahle Dengel năm 1832 trong tranh chấp giáo lý tại Gondar, đưa Gebre Krestos lên ngai khoảng ba tháng; sau khi Gebre Krestos qua đời, Sahle Dengel được phục vị. Đây là căn cứ rõ để không ghi “không xác định được hoàng đế danh nghĩa năm 1836”.

### 3.2. Người nắm quyền thực tế và vai trò của Mänän

Sven Rubenson, “Ali Alula,” *Encyclopaedia Aethiopica*, vol. I (2003), p.199, ghi Ali Alula, còn gọi Ali II, Ali Tannaš hoặc Ali Tǝkku, nắm quyền ở trung tâm Ethiopia giai đoạn 1830–1853. Ông là thành viên cuối cùng của triều Yejju cầm quyền trong thời Zämänä mäsafǝnt; quyền lực căn cứ ở Debre Tabor, với Begemder, Yejju và Wollo là vùng cơ sở chính. Trong thập niên đầu triều đại của Ali, mẹ ông là Mänän Libän Amäde chi phối chính trị tại Debre Tabor.

Sophia Dege, mục “Zämänä mäsafǝnt,” *Encyclopaedia Aethiopica*, vol. V (2014), pp.122–129, mô tả ngai nǝguśä nägäśt bị thu hẹp thành một vương quyền danh nghĩa, phụ thuộc các lãnh chúa để có quân đội và quyền lực; mục này cũng ghi Ras Ali Alula được trao vị trí sau Ras Dori năm 1831, khi Ali còn rất trẻ và Mänän Libän Amäde làm nhiếp chính cho ông.

Cần phân biệt hai tầng:
1. **Sahle Dengel:** hoàng đế/nguyên thủ danh nghĩa tại Gondar năm 1836.
2. **Ras Ali Alula (Ali II):** Ras Yejju và người nắm quyền lực trung tâm trên thực tế trong phần lớn giai đoạn này.

Mänän là nhân vật bảo trợ quyền lực lớn và từng làm nhiếp chính cho Ali khi ông còn vị thành niên. Không được mặc định bà vẫn giữ đúng chức danh “regent” vào ngày 1836-01-01 nếu không có chứng cứ ngày cụ thể; cách diễn đạt an toàn là “có ảnh hưởng chính trị lớn trong thập niên đầu triều đại của Ali”.

### 3.3. Sửa diễn giải profile, không sửa live data

Profile hiện ghi Ras Ali II of Yejju làm `hos` và mô tả như “Regent for the Gondarine emperor”, đồng thời ghi không xác định được hoàng đế danh nghĩa. Nguồn R3ab chứng minh hai thông tin cần tách:
- Ali II không phải Sahle Dengel; ông là Ras/nhân vật quyền lực thực tế, không phải hoàng đế danh nghĩa.
- Ali II còn được định danh là Ali Alula; tên hiển thị nên giữ liên kết tên/alias thay vì tạo nhân vật trùng lặp.
- Cần một khái niệm role rõ cho “nominal monarch”, “de facto ruler/kingmaker” và “regent”. Không ép Ras Ali vào trường head-of-government nếu nghĩa trường đó không tương thích.

Không sửa `hos`, `hog`, `hos_q` hay schema trong R3ab. Việc triển khai phải chờ phase/owner authorization riêng.

## 4. Liberia (LIB): colony agent không phải head of state

Frederick Starr, *Liberia: Description, History, Problems* (1913), phần phụ lục “Leading Events in Liberian History”, liệt kê năm 1836 Anthony D. Williams là agent; dòng kế tiếp ghi tháng 1 Thomas Buchanan đến và “in charge of Bassa settlements”. Cùng niên biểu ghi A.D. Williams relinquishes agency năm 1839 và Thomas Buchanan trở thành governor. Phần “Liberian Officials — Agents and Governors” cũng liệt kê A.D. Williams năm 1836, Buchanan năm 1839 và Joseph J. Roberts năm 1841.

U.S. Department of State, Office of the Historian, “Founding of Liberia, 1847,” xác nhận agent của American Colonization Society (ACS) quản lý khu định cư theo luật Mỹ; nhiều khu định cư nhập thành Commonwealth of Liberia năm 1838; Liberia chỉ trở thành quốc gia có chủ quyền khi tuyên bố độc lập năm 1847.

Hệ quả:
- Tại năm 1836, không được gán chức Tổng thống Liberia hoặc nguyên thủ của một nước độc lập.
- `hos=null` có thể đúng về mặt ý nghĩa cho một thuộc địa chưa có chủ quyền, nhưng `hos_q=missing` có thể gây hiểu nhầm rằng thiếu tên một nguyên thủ có thật. Nên phân biệt “không áp dụng vì chưa phải sovereign state” với “thiếu dữ liệu”.
- Anthony D. Williams là agent hành chính của thuộc địa tại Monrovia năm 1836 theo niên biểu của Starr. Đây là nguồn tổng thuật năm 1913; cần tìm hồ sơ ACS gốc để xác minh ngày bổ nhiệm/đảm nhiệm chính xác.
- Thomas Buchanan đến trong tháng 1/1836 và phụ trách các khu định cư Bassa; nguồn không nêu ngày cụ thể, nên không gán chắc chắn ông là người đứng đầu Bassa vào đúng ngày 1/1/1836. Không được mở rộng chức vụ địa phương này thành governor toàn thuộc địa năm 1836.

## 5. Kết luận patch decisions

Các khuyến nghị tại R3ab là:
- FJA: `Bubakar — Almami` là ứng viên hợp lý tại mốc 1836, với mức tin cậy provisional do chưa xác thực bản in p.150.
- ETH: bổ sung Sahle Dengel ở vai trò hoàng đế danh nghĩa; giữ Ras Ali Alula/Ali II ở vai trò người nắm quyền thực tế; biểu diễn vai trò Mänän riêng và không gán nhãn nhiếp chính ngoài khoảng nguồn hỗ trợ.
- LIB: không có head of state có chủ quyền năm 1836; A.D. Williams là agent của ACS; Buchanan phụ trách Bassa settlements từ thời điểm đến tháng 1, ngày chính xác còn mở.

**Không có giá trị nào được promote vào historical data.** Không thay owner, biên giới, population benchmark, government preset, event, AI, save schema, UI, Android, assets hoặc build workflow.

## 6. Nguồn và giới hạn truy cập

1. Boubacar Barry, *Senegambia and the Atlantic Slave Trade* (Cambridge University Press, 1997), phần đầu thế kỷ XIX, bản in pp.148–157, đặc biệt p.150. Cambridge metadata: https://www.cambridge.org/core/books/senegambia-and-the-atlantic-slave-trade/7ECE5F51680CB6FDD913164626AD07B8/listing. Exact tenure statement read in a searchable text reproduction; printed page image not authenticated.
2. Alfa Mamadou Diallo Lélouma and Bernard Salvaing, “Corners Conceal Treasures: Arabic Manuscripts’ Marginalia in Fuuta Jaloo and Fuuta Toro in the Nineteenth Century,” *Islamic Africa* 8 (2017), pp.70–110, DOI 10.1163/21540993-00801007: https://brill.com/view/journals/iafr/8/1-2/article-p70_70.pdf.
3. Donald Crummey, “Śahlä Dǝngǝl,” *Encyclopaedia Aethiopica*, vol. IV (2010), pp.464–465: https://www.habeshahistory.com/encyclopedia/sahla-dengel-p0491-a-y4857-v4.
4. Sven Rubenson, “Ali Alula,” *Encyclopaedia Aethiopica*, vol. I (2003), p.199: https://www.habeshahistory.com/encyclopedia/ali-alula-p0229-a-y1682.
5. Eloi Ficquet, “Yäǧǧu,” *Encyclopaedia Aethiopica*, vol. V (2014), pp.12–15: https://www.habeshahistory.com/encyclopedia/yaggu-p0044-b-y4980-v5.
6. Sophia Dege, “Zämänä mäsafǝnt,” *Encyclopaedia Aethiopica*, vol. V (2014), pp.122–129: https://www.habeshahistory.com/encyclopedia/zamana-masafent-p0154-b-y4842-v5.
7. Frederick Starr, *Liberia: Description, History, Problems* (Chicago, 1913), appendices “Leading Events in Liberian History” and “Liberian Officials”: https://www.gutenberg.org/files/54542/54542-h/54542-h.htm.
8. U.S. Department of State, Office of the Historian, “Founding of Liberia, 1847”: https://history.state.gov/milestones/1830-1860/liberia.

## 7. Tình trạng

`SELF_AUDIT_ONLY`; chưa có Claude independent `REVIEW_PASS`; chưa có owner acceptance mới; không có product patch. Yêu cầu Claude kiểm tra đúng commit và đúng changed-file range sau khi gói tài liệu được tích hợp.