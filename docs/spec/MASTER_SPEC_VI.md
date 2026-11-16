# CURRENTS OF HISTORY — MASTER GAME DESIGN & TECHNICAL REQUIREMENTS
## Đặc tả tái cấu trúc toàn diện cho game Grand Strategy Android (1836–1936)

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch tham chiếu:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Nền tảng ưu tiên:** Android, hỗ trợ landscape và portrait  
**Chế độ:** Historical Mode, Sandbox / Alternate History, Observer Mode  
**Định hướng thiết kế:** học hỏi chiều sâu mô phỏng của Victoria 3, nhưng xây dựng hệ thống, nội dung, dữ liệu và hình ảnh riêng cho dự án.

> **Mục đích tài liệu:** Đây là đặc tả sản phẩm và yêu cầu triển khai thống nhất. Nó không khẳng định những tính năng được mô tả đã tồn tại trong repository. Claude phải kiểm toán mã nguồn, đánh dấu trạng thái thực tế, rồi lập kế hoạch triển khai có thể kiểm chứng.

---

# 0. HƯỚNG DẪN SỬ DỤNG BỘ BÀN GIAO

Bộ bàn giao gồm:
- `MASTER_SPEC_VI.md`: bản đặc tả gốc có thể đọc, tìm kiếm và chỉnh sửa.
- `MASTER_SPEC_VI.docx`: bản tài liệu Word có bố cục và ảnh minh họa được chèn sẵn.
- `illustrations/`: các ảnh PNG độc lập để dùng làm reference khi thiết kế UI và xây dựng tài sản.
- `README_FOR_CLAUDE.md`: hướng dẫn Claude cách tiếp nhận tài liệu, kiểm toán và triển khai.

**Quy tắc quan trọng về ảnh:** tất cả hình ảnh trong thư mục `illustrations/` là concept art do AI tạo để minh họa bố cục, phong cách và loại thông tin cần có. Tên địa danh, số dân, giá trị kinh tế, cấp công trình, số lượng đơn vị hoặc chữ xuất hiện trong ảnh có thể là dữ liệu giả dùng cho hình minh họa. Không được đưa những số liệu đó vào database lịch sử. Claude phải thay chúng bằng dữ liệu có nguồn khi triển khai.

**Quy tắc về tham chiếu Victoria 3:** học hỏi các khái niệm gameplay như State/Building, Production Methods, Construction, Employment, Infrastructure và Market Access; không sao chép mã nguồn, đồ họa, UI, dữ liệu độc quyền hoặc tài sản của Paradox. Xây dựng triển khai độc lập và tài sản có giấy phép phù hợp.

---

# 1. TẦM NHÌN VÀ MỤC TIÊU SẢN PHẨM

## 1.1. Mục tiêu

Xây dựng một game đại chiến lược mô phỏng toàn thế giới trong giai đoạn 1836–1936. Người chơi không chỉ xem bảng thống kê mà có thể quan sát, tìm hiểu, quản lý và thay đổi một thế giới có địa lý, dân cư, thành phố, tỉnh, công trình, thị trường, chính quyền, quân đội, ngoại giao và lịch sử.

Game phải tạo được cảm giác mỗi quốc gia là một thực thể có bản sắc và hoàn cảnh riêng; mỗi tỉnh là một đơn vị phát triển có địa lý, dân cư, tài nguyên và công trình; mỗi thành phố là một trung tâm dân cư và hoạt động; mỗi công trình có thể tuyển dụng, sản xuất, tiêu thụ đầu vào và thay đổi theo thời đại; mỗi đơn vị quân sự có tổ chức, trang bị, chỉ huy, vị trí và hậu cần.

## 1.2. Phạm vi toàn cầu

Bao phủ các khu vực: châu Âu, Đông Á, Nam Á, Đông Nam Á, Trung Á, Tây Á, Trung Đông, Bắc Phi, châu Phi hạ Sahara, Bắc Mỹ, Trung Mỹ, Nam Mỹ và châu Đại Dương.

Đối tượng chính trị cần hỗ trợ:
- Quốc gia độc lập, đế quốc, vương quốc, công quốc, tiểu quốc và liên bang.
- Thuộc địa, lãnh thổ bảo hộ, chư hầu, vùng phụ thuộc và công ty đặc quyền.
- Chính thể bản địa, chính thể phi tập trung và thực thể địa phương.
- Chính quyền nổi dậy, phe ly khai, chính thể hình thành hoặc tan rã trong mô phỏng.

Không được chăm chút riêng các cường quốc rồi để các nước nhỏ hoặc các khu vực ngoài châu Âu chỉ còn tên và vài chỉ số. Mức độ nghiên cứu có thể khác nhau vì độ phủ nguồn lịch sử, nhưng mọi quốc gia phải đạt mức nội dung nền tảng và có logic gameplay hợp lý.

## 1.3. Không biến game thành bảng số liệu

Mỗi chỉ số quan trọng phải có cơ chế tạo ra nó và nguyên nhân làm nó thay đổi. UI phải giải thích được tình hình, xu hướng và nguyên nhân. Hình ảnh phải giúp người chơi hình dung đối tượng; mô tả phải bổ sung bối cảnh; mô phỏng phải tạo ra thay đổi thực sự.

Không chấp nhận việc thay một hệ thống thiếu bằng biểu đồ giả, văn bản trang trí, giá trị cố định hoặc nút bấm không có hành vi.

## 1.4. Tham chiếu sản phẩm

Victoria 3 là tham chiếu về độ sâu hệ thống kinh tế, công trình, sản xuất, dân cư và chính trị; không phải đích sao chép nguyên trạng. Dự án phải có bản sắc, thiết kế dữ liệu, hình ảnh và trải nghiệm riêng; phù hợp thao tác trên điện thoại Android.

---

# 2. NGUYÊN TẮC DỮ LIỆU LỊCH SỬ VÀ ĐỘ TIN CẬY

## 2.1. Mọi dữ kiện phải có provenance

Mỗi dữ liệu lịch sử quan trọng cần có:
- Giá trị và đơn vị.
- Ngày hoặc khoảng thời gian hiệu lực.
- Đối tượng áp dụng.
- Nguồn tham khảo.
- Độ tin cậy: verified, supported, estimated, uncertain hoặc missing.
- Phương pháp ước tính nếu không có số liệu trực tiếp.
- Ghi chú tranh luận hoặc sai khác nguồn nếu cần.

Không biến ước lượng thành dữ kiện đã xác minh. Không lấy số liệu hiện đại gán ngược cho năm 1836 mà không ghi rõ cách hiệu chỉnh.

## 2.2. Mô hình lịch sử không được khóa kết quả

Historical Mode dùng dữ liệu ban đầu, xu hướng, lợi ích, điều kiện và cửa sổ sự kiện có điều kiện. Kết quả lịch sử không được hard-code thành kết quả bắt buộc. Nếu người chơi hoặc AI làm thay đổi nguyên nhân, kết quả có thể rẽ nhánh.

## 2.3. Dữ liệu thiếu

Khi dữ liệu một quốc gia hoặc tỉnh không đủ:
1. Ghi nhận rõ trường bị thiếu.
2. Tìm nguồn phù hợp và ghi provenance.
3. Nếu buộc phải ước lượng, ghi công thức, giả định, phạm vi và độ tin cậy.
4. Dùng fallback có giới hạn, không dùng dữ liệu mặc định chung gây sai lệch lớn.
5. Đưa độ phủ dữ liệu vào báo cáo audit.

---

# 3. CẤU TRÚC ĐỊA LÝ, TỈNH THÀNH VÀ BẢN ĐỒ

## 3.1. Mô hình phân cấp linh hoạt

Cần phân biệt các lớp dữ liệu:

**World / Geographic Area → Political Entity → Administrative Unit → Settlement / Location.**

Ngoài ra, engine có thể có lớp **Strategic Region** để tính toán kinh tế, dân số, chiến tranh và hậu cần. Strategic Region không bắt buộc trùng với đơn vị hành chính lịch sử.

Ví dụ tên đơn vị hành chính có thể là tỉnh, bang, xứ, phủ, hạt, tổng trấn, vùng, quận hoặc loại tương đương. Không áp đặt một kiểu gọi cho toàn thế giới. Mỗi quốc gia và thời kỳ có thể có số cấp khác nhau.

Một Strategic Region có thể bao gồm nhiều đơn vị hành chính; một đơn vị hành chính có thể chứa nhiều settlement. Phải giữ liên kết lịch sử giữa các cấp.

## 3.2. Hồ sơ tỉnh / đơn vị hành chính

Mỗi tỉnh cần có:
- ID ổn định, tên hiện tại, tên lịch sử, tên địa phương, loại đơn vị.
- Quốc gia sở hữu, đơn vị cấp trên, thời gian thành lập và chấm dứt.
- Polygon ranh giới, diện tích, tọa độ trung tâm.
- Thủ phủ, đô thị, thị trấn và làng liên quan.
- Địa hình, khí hậu, sông, hồ, bờ biển, đất canh tác và tài nguyên.
- Dân số tổng, nhóm văn hóa, tôn giáo, ngôn ngữ, tầng lớp và phân bố đô thị/nông thôn.
- Kinh tế, ngành nghề, công trình, việc làm, sản lượng và hạ tầng.
- Chính quyền địa phương, quyền tự trị, năng lực hành chính, bất ổn và phong trào ly khai.
- Công trình quân sự, đồn trú, kho, pháo đài, cảng và tuyến hậu cần.
- Nguồn dữ liệu và độ tin cậy.

## 3.3. Thành phố và settlement

Thành phố là đối tượng dữ liệu độc lập, không chỉ là nhãn trên bản đồ. Hỗ trợ thủ đô, đô thị lớn, thành phố công nghiệp, thương mại, cảng, quân sự, trung tâm hành chính, thị trấn, làng và khu dân cư nông thôn.

Mỗi settlement cần có tên theo thời kỳ, tọa độ, đơn vị hành chính, loại hình, dân số hoặc khoảng ước lượng, vai trò kinh tế, cơ sở hạ tầng, công trình, vai trò chiến lược và hình ảnh/mô tả nếu là địa điểm quan trọng.

Thành phố phải phát triển theo dân cư, việc làm, công nghiệp hóa, thương mại, đầu tư, nhà ở, giao thông, dịch bệnh và chiến tranh. Không tăng dân số vô hạn khi không có việc làm, nhà ở, lương thực và hạ tầng tương ứng.

## 3.4. Bản đồ lịch sử theo thời gian

Không dùng ranh giới hành chính hiện đại làm ranh giới 1836 mà không ghi rõ là xấp xỉ. Cần phiên bản ranh giới có hiệu lực theo thời gian, hỗ trợ:
- Thành lập, giải thể, chia tách và sáp nhập tỉnh.
- Chuyển giao lãnh thổ, chiếm đóng và khôi phục chủ quyền.
- Đổi tên quốc gia, tỉnh và thành phố.
- Thay đổi thủ đô và cơ cấu hành chính.
- Thay đổi biên giới theo chiến tranh, hiệp ước hoặc cải cách.

Dữ liệu tối thiểu: `valid_from`, `valid_to`, `parent_id`, `owner_id`, `controller_id`, `boundary_version`, `historical_name`, `source_ids`.

Khi lãnh thổ đổi chủ phải bảo toàn lịch sử, không nhân đôi dân số/công trình và không phá hỏng save cũ.

## 3.5. Các mức bản đồ

- **World map:** biên giới quốc gia, chủ quyền, thủ đô, đô thị lớn, tuyến thương mại và vùng chiến lược.
- **Country map:** tỉnh, thủ phủ, thành phố, địa hình, tài nguyên, dân cư, công trình và căn cứ.
- **Province map:** đơn vị cấp dưới, thành phố, thị trấn, làng, đường, cụm công nghiệp, nông nghiệp, mỏ, cảng và công trình.
- **Campaign map:** đơn vị quân đội, đường hành quân, mặt trận, tuyến tiếp tế, địa hình, sông, điểm vượt sông, pháo đài, cảng và khu vực bị bao vây.

## 3.6. Lớp bản đồ chuyên biệt

Tối thiểu: chính trị, địa hình, dân số, mật độ, văn hóa, tôn giáo, tài nguyên, đất canh tác, công nghiệp, nông nghiệp, đô thị hóa, hạ tầng, đường sắt, cảng, thị trường, ngoại giao, quân sự, hậu cần, chiến tranh và kiểm soát lãnh thổ.

Mỗi lớp phải có chú giải, đơn vị đo, ngày dữ liệu và hành vi chọn đối tượng. Không dùng màu mà không giải thích.

---

# 4. HỆ THỐNG CÔNG TRÌNH TỈNH THÀNH (BUILDING SYSTEM)

## 4.1. Nguyên tắc

Mỗi tỉnh phải là một đơn vị phát triển thực sự. Người chơi phải biết tỉnh sản xuất gì, có công trình nào, ai làm việc ở đâu, tài nguyên lấy từ đâu, hàng hóa đi đâu, hạ tầng có đủ không và điều gì khiến tỉnh phát triển hoặc suy thoái.

Công trình không chỉ là biểu tượng trang trí. Một cấp công trình đại diện cho năng lực sản xuất hoặc dịch vụ; nó có thể là một cụm cơ sở thay vì một tòa nhà vật lý duy nhất. Khi zoom gần, hình ảnh có thể thể hiện cụm kiến trúc tiêu biểu.

## 4.2. Phân loại công trình

### A. Nông nghiệp và tài nguyên sinh học
- Nông trại lúa gạo, lúa mì, ngô, kê, khoai và cây lương thực phù hợp địa phương.
- Đồn điền bông, chè, cà phê, ca cao, mía, thuốc lá, thuốc phiện, cao su, tơ lụa và cây công nghiệp khác theo thời kỳ.
- Chăn nuôi gia súc, cừu, ngựa, gia cầm và vật nuôi phù hợp.
- Lâm nghiệp, đánh bắt thủy sản, nuôi trồng và khai thác tự nhiên.
- Trang trại tự cung tự cấp và kinh tế nông thôn truyền thống.

### B. Khai khoáng
- Mỏ than, sắt, đồng, chì, thiếc, lưu huỳnh, vàng, bạc, đá và khoáng sản khác.
- Giếng dầu khi công nghệ và lịch sử cho phép.
- Mỏ có trữ lượng, mức khai thác, chi phí, lao động, công nghệ, vật tư, vận tải và mức suy giảm phù hợp.
- Cho phép tài nguyên chưa được phát hiện; khi thăm dò thành công phải phát sinh sự kiện phát hiện.

### C. Công nghiệp nhẹ
- Dệt, quần áo, giấy, đồ gỗ, thủy tinh, thực phẩm, đồ uống, hàng tiêu dùng và xưởng thủ công.

### D. Công nghiệp nặng
- Luyện sắt, thép, công cụ, máy móc, động cơ, hóa chất, phân bón, vật liệu xây dựng, năng lượng và các ngành mới theo thời đại.

### E. Công nghiệp quốc phòng
- Súng, đạn, pháo, thuốc nổ, quân nhu, thiết bị quân sự, xưởng sửa chữa và đóng tàu.

### F. Thương mại và dịch vụ
- Chợ, trung tâm phân phối, kho hàng, thương mại, ngân hàng, khu tài chính và dịch vụ phù hợp nền kinh tế.

### G. Hạ tầng và giao thông
- Đường bộ, cầu, đường sắt, nhà ga, ga hàng hóa, cảng, bến, xưởng tàu, kênh đào, hệ thống tưới tiêu, phát điện, truyền tải điện, bưu điện và điện báo.

### H. Hành chính, giáo dục và xã hội
- Tòa nhà hành chính, cơ quan thuế, trường học, đại học, học viện, cơ sở nghiên cứu, bệnh viện và dịch vụ công.

### I. Quân sự
- Doanh trại, trung tâm tuyển quân, trường quân sự, kho vũ khí, kho đạn, kho lương, căn cứ lục quân, cảng quân sự, pháo đài và công sự.

### J. Văn hóa và công trình đặc biệt
- Cung điện, thành cổ, đền, chùa, nhà thờ, thánh đường, tượng đài, nhà hát, bảo tàng, di tích, kỳ quan, công trình kỹ thuật và biểu tượng quốc gia.

Không phải mọi tỉnh đều xây được mọi loại công trình. Điều kiện phải phản ánh địa hình, khí hậu, đất, tài nguyên, lao động, công nghệ, chính sách, vốn, hạ tầng và bối cảnh lịch sử.

## 4.3. Cấp công trình và công suất

Mỗi loại có thể có nhiều cấp. Phải phân biệt:
- Cấp đã xây.
- Cấp tối đa theo điều kiện hiện tại.
- Cấp đang hoạt động.
- Cấp thiếu lao động.
- Cấp thiếu đầu vào.
- Cấp thiếu hạ tầng.
- Cấp hư hại.
- Cấp đang xây.

Tăng cấp phải thay đổi công suất, lao động, tiêu thụ đầu vào, sản lượng, chi phí và tác động xã hội. Không tăng số cấp mà không có thay đổi gameplay.

## 4.4. Điều kiện xây dựng

### Tự nhiên
Đất canh tác, độ màu mỡ, khí hậu, mưa, địa hình, độ cao, sông, bờ biển, rừng, mỏ và trữ lượng.

### Xã hội
Dân số, cơ cấu lao động, tay nghề, giáo dục, mức lương, dân cư sẵn có, khả năng di cư và ổn định.

### Kinh tế
Vốn, ngân sách, giá hàng hóa, chi phí nguyên liệu, thị trường tiêu thụ, lợi nhuận, vận tải và năng lực xây dựng.

### Công nghệ
Công nghệ xây dựng, khai thác, sản xuất, máy móc, năng lượng và giao thông.

Không dùng giới hạn ô xây dựng vô lý. Tài nguyên và hạ tầng phải tạo ra giới hạn có nguyên nhân.

## 4.5. Production Methods

Mỗi loại công trình có các phương pháp sản xuất quyết định:
- Đầu vào hàng hóa và nguyên liệu.
- Đầu ra và sản phẩm phụ.
- Số lượng và loại lao động.
- Máy móc, năng lượng và công nghệ.
- Chi phí vận hành.
- Năng suất và chất lượng.
- Tác động môi trường và xã hội.

Ví dụ nhà máy dệt có thể chuyển từ sản xuất thủ công sang cơ khí rồi tự động hóa từng phần. Phương pháp mới có thể tăng sản lượng nhưng cần vốn, máy móc, năng lượng, nguyên liệu hoặc lao động kỹ thuật; đồng thời làm thay đổi nhu cầu nhân công và cơ cấu xã hội.

Không tự nâng phương pháp sản xuất nếu không đủ điều kiện. Nâng cấp phải có chi phí, lợi ích và rủi ro.

## 4.6. Việc làm và tiền lương

Mỗi cấp công trình có nhu cầu lao động theo nghề: nông dân, công nhân, thợ thủ công, thợ mỏ, kỹ thuật viên, kỹ sư, quản lý, chủ sở hữu, công chức, giáo viên, nhân viên thương mại và các nghề khác.

Mô phỏng tuyển dụng, thiếu lao động, dư lao động, tiền lương, tay nghề, năng suất, điều kiện làm việc, lợi nhuận và mức hài lòng. Công trình mở rộng có thể hút lao động khỏi nông nghiệp, thúc đẩy đô thị hóa, tăng thu nhập, gây thiếu lao động ở ngành khác hoặc tạo xung đột xã hội.

## 4.7. Sở hữu công trình

Hỗ trợ nhà nước, tư nhân, quý tộc, công ty, nhà đầu tư, hợp tác xã, cộng đồng và sở hữu kết hợp khi phù hợp lịch sử.

Mỗi công trình lưu chủ sở hữu, tỷ lệ sở hữu, vốn, doanh thu, chi phí, lương, lợi nhuận, cổ tức, thuế và trợ cấp. Luật pháp có thể cho phép tư nhân hóa, quốc hữu hóa, chuyển giao, đầu tư nước ngoài hoặc thành lập công ty.

Không coi `statePool` và `privatePool` là hệ thống sở hữu hoàn chỉnh nếu không có sổ sở hữu công trình.

## 4.8. Construction Queue

Quy trình: chọn tỉnh → chọn loại công trình → số cấp → xác thực điều kiện → tính chi phí → xếp hàng → phân bổ năng lực xây dựng → tiêu thụ vật liệu và tiền theo tiến độ → hoàn thành → tuyển lao động → vận hành.

Cần hàng đợi quốc gia, ưu tiên, tiến độ, chi phí còn lại, vật liệu thiếu, thời gian dự kiến, trạng thái tạm dừng, hủy hoặc điều chỉnh.

Construction Capacity phụ thuộc công trình xây dựng, công nghệ, nhân công, máy móc, vật liệu, ngân sách và hiệu quả quản trị. Không xây mọi thứ tức thời hoặc vô hạn.

## 4.9. Hạ tầng và Market Access

Đường, cầu, đường sắt, cảng, đường thủy và các phương tiện vận tải tạo năng lực hạ tầng. Công trình tiêu thụ năng lực này. Khi thiếu hạ tầng, thời gian vận chuyển và chi phí tăng, hàng hóa lưu thông giảm, nguồn cung và hiệu quả công trình suy yếu.

Phải phân biệt khả năng tiếp cận thị trường với chỉ số kết nối hình thức. Mất cảng, chiến tranh, phong tỏa hoặc phá hoại đường sắt phải tác động tới thương mại và hậu cần.

## 4.10. Liên kết sản xuất

Ví dụ chuỗi thép: quặng sắt + than → luyện sắt/thép → công cụ và máy móc → đường sắt, nhà máy và công nghiệp quốc phòng.

Ví dụ cảng: hạ tầng cảng + lao động + kho bãi → tăng năng lực giao thương và vận tải; chiến tranh có thể làm cảng bị phong tỏa hoặc hư hại.

Ví dụ đại học: cần giảng viên và tài chính → đào tạo nhân lực → hỗ trợ năng lực kỹ thuật và nghiên cứu.

Ví dụ doanh trại: cần ngân sách, cơ sở vật chất và nhân lực → huấn luyện, đồn trú, hỗ trợ tổ chức đơn vị; không tự sinh quân đội không giới hạn.

## 4.11. Đô thị hóa

Công trình phải làm thay đổi thành phố theo thời gian: mở rộng khu dân cư, công nghiệp, thương mại, nhà ở và hạ tầng. Thành phố có thể suy thoái khi mất việc, thương mại, tài nguyên hoặc bị chiến tranh tàn phá.

## 4.12. Công trình độc nhất và di tích

Các công trình đặc biệt có thể có giới hạn độc nhất hoặc giới hạn theo lịch sử. Hiệu ứng có thể là uy tín, văn hóa, đoàn kết, du lịch, quản trị hoặc chiến lược; không bắt buộc tạo sản phẩm kinh tế.

---

# 5. DÂN CƯ VÀ XÃ HỘI

## 5.1. Pop Cohorts

Không xem dân số là một con số tổng. Chia dân cư theo tầng lớp, nghề nghiệp, văn hóa, tôn giáo, vùng cư trú, tình trạng việc làm và mức sống. Mô hình có thể dùng cohort tổng hợp để phù hợp hiệu năng Android; không cần mô phỏng từng cá nhân.

## 5.2. Thuộc tính

Mỗi nhóm dân cư cần có quy mô, tuổi hoặc cơ cấu nhân khẩu phù hợp, nghề, thu nhập, tài sản, nhu cầu tiêu dùng, việc làm, thất nghiệp, mức sống, giáo dục, y tế, văn hóa, tôn giáo, mức ủng hộ chính trị, bất mãn và xu hướng di cư.

## 5.3. Hành vi

Dân cư phản ứng với giá, thuế, lương, thất nghiệp, thiếu lương thực, chiến tranh, dịch bệnh, luật pháp, giáo dục và thay đổi công nghệ. Hệ quả phải nối với tiêu dùng, cung lao động, chính trị, di cư, biểu tình, cách mạng và ly khai.

## 5.4. Khác biệt khu vực

Không ép mọi nước có cùng cơ cấu tầng lớp. Nông nghiệp tự cung, đồn điền, thương mại, du mục, thủ công nghiệp và công nghiệp hóa phải được mô tả bằng dữ liệu và điều kiện riêng.

---

# 6. KINH TẾ, THỊ TRƯỜNG VÀ TÀI CHÍNH

## 6.1. Kinh tế vật chất

Mô phỏng sản xuất, tiêu thụ, đầu vào, đầu ra, sản phẩm phụ, tồn kho, vận tải, cung cầu, giá, thị trường địa phương/quốc gia/quốc tế và hạn chế tiếp cận thị trường.

## 6.2. Các chỉ số phải tách biệt

Không dùng GDP làm đại diện cho toàn bộ sức mạnh. Phân biệt:
- Tổng GDP và GDP/người.
- Cơ cấu ngành.
- Năng lực công nghiệp.
- Năng lực tài chính nhà nước.
- Năng lực thương mại.
- Thu nhập hộ gia đình.
- Năng lực huy động thời chiến.
- Năng lực cung cấp quân nhu.

## 6.3. Tài chính nhà nước

Thuế, thuế quan, nợ, lãi suất, ngân sách, chi tiêu, trợ cấp, đầu tư, vỡ nợ, tiền tệ và ngân hàng khi dữ liệu/thời kỳ cho phép. Cần có các dòng thu chi có thể giải thích và đối chiếu với hoạt động kinh tế.

## 6.4. Thương mại

Tuyến thương mại, cảng, phương tiện vận tải, hợp đồng, thuế quan, liên minh thuế quan, phụ thuộc hàng hóa, phong tỏa, chiến tranh và rủi ro. Thương mại không chỉ là con số nhập khẩu giả định.

---

# 7. CHÍNH TRỊ, THỂ CHẾ VÀ NGOẠI GIAO

## 7.1. Chính trị

Thể chế và luật phải phù hợp từng nước: quân chủ, quân chủ lập hiến, cộng hòa, đế quốc, liên bang, chính quyền thuộc địa, chính thể địa phương hoặc cơ cấu lịch sử khác.

Hệ thống gồm người cai trị, nội các, quan chức, nhóm lợi ích, phe phái, đảng phái khi phù hợp, quyền bầu cử, bầu cử thực sự khi thể chế cho phép, cải cách, phong trào, biểu tình, đình công, cách mạng, ly khai và nội chiến.

## 7.2. Quản trị địa phương

Có quyền hạn trung ương/địa phương, năng lực hành chính, thu thuế, quản lý dân cư, thực thi luật và trung thành. Tỉnh có thể có vấn đề riêng và phản ứng khác nhau với chính sách quốc gia.

## 7.3. Ngoại giao

Quan hệ song phương, mục tiêu chiến lược, liên minh, hiệp ước, bảo hộ, chư hầu, chủ quyền, khủng hoảng, tối hậu thư, đàm phán, tranh chấp, thuộc địa, trừng phạt, gây sức ép kinh tế, cân bằng quyền lực và ảnh hưởng khu vực.

## 7.4. Vector năng lực quốc gia

Không gộp sức mạnh quốc gia vào một `powerScore` đơn giản. Dùng vector có thể giải thích: kinh tế, công nghiệp, tài chính, quản trị, quân sự, hải quân, ngoại giao, công nghệ, hậu cần, nhân lực và khả năng huy động.

---

# 8. HỆ THỐNG QUÂN ĐỘI VÀ TỔ CHỨC LỰC LƯỢNG

## 8.1. Nguyên tắc

Quân đội không phải chỉ là `manpower × quality × morale`. Phải có đơn vị, tổ chức, quân chủng, trang bị, chỉ huy, vị trí, trạng thái sẵn sàng, tiếp tế và lịch sử chiến đấu.

Cơ cấu và tên gọi phải thay đổi theo quốc gia và thời kỳ. Không ép tất cả quốc gia dùng cùng một mẫu biên chế.

## 8.2. Quân chủng

### Lục quân
Bộ binh, bộ binh nhẹ/chính quy/tinh nhuệ, vệ binh, kỵ binh nhẹ/nặng/khinh kỵ, pháo binh dã chiến/hạng nặng/công thành, công binh, trinh sát, quân y, hậu cần, dân quân, lực lượng dự bị, lực lượng địa phương hoặc thuộc địa khi phù hợp.

### Hải quân
Tàu buồm, tàu tuyến, frigate, corvette, gunboat, tàu vận tải, tàu tiếp tế, tàu hơi nước, tàu bọc sắt, thiết giáp hạm, tuần dương hạm, khu trục hạm, tàu ngầm và các lớp tàu chỉ được mở khóa đúng thời đại.

### Không quân
Không có từ đầu 1836. Có thể xuất hiện khinh khí cầu, máy bay trinh sát, máy bay chiến đấu và các loại khác khi công nghệ, công nghiệp và thời gian lịch sử cho phép.

### An ninh và lực lượng địa phương
Hiến binh, dân quân, lực lượng bảo vệ, cảnh sát quân sự và lực lượng chống nổi dậy. Phân biệt an ninh nội địa với đơn vị chiến đấu chính quy.

## 8.3. Cấp tổ chức lục quân

Cấu trúc tham chiếu linh hoạt:

**Bộ chỉ huy chiến trường → Tập đoàn quân → Quân đoàn → Sư đoàn → Lữ đoàn → Trung đoàn → Tiểu đoàn → Đại đội.**

Không bắt buộc mọi nước có đầy đủ các cấp. Một số quân đội có thể tổ chức theo trung đoàn, lữ đoàn độc lập, lực lượng địa phương hoặc cơ cấu khác. Engine phải hỗ trợ cây tổ chức linh hoạt và không giả định một tổ chức cố định.

## 8.4. Đơn vị quân đội

Mỗi đơn vị cần ID, tên, quốc gia, quân chủng, loại, cấp tổ chức, đơn vị cấp trên, chỉ huy, vị trí, quân số thực, biên chế chuẩn, thành phần, trang bị, huấn luyện, kinh nghiệm, tinh thần, sẵn sàng, tiếp tế, tổn thất, tình trạng trang bị và lịch sử chiến đấu.

Sư đoàn hoặc đơn vị tương đương có thể gồm các lữ đoàn/trung đoàn/tiểu đoàn và đơn vị hỗ trợ như pháo binh, công binh, trinh sát, quân y, hậu cần. Không đồng nhất mọi sư đoàn.

## 8.5. Chỉ huy

Thống soái, tham mưu trưởng, tư lệnh chiến trường, tư lệnh tập đoàn quân/quân đoàn/sư đoàn, chỉ huy hải quân và đô đốc. Nhân vật quan trọng cần tiểu sử, chân dung hoặc minh họa, cấp bậc, kinh nghiệm, năng lực, phong cách, quan hệ chính trị và thành tích.

Chỉ huy ảnh hưởng đến lập kế hoạch, tổ chức, cơ động, tinh thần, phòng thủ, tổn thất và phối hợp.

## 8.6. Tuyển quân và huy động

Tuyển quân tình nguyện, nghĩa vụ, quân dịch, dự bị, dân quân, huy động thời chiến, tuyển theo vùng, huấn luyện và giải ngũ. Giới hạn bởi dân số, luật, tài chính, trang bị, sĩ quan, cơ sở huấn luyện, năng lực hành chính và hậu cần.

## 8.7. Trang bị và công nghiệp quốc phòng

Súng, súng trường, pháo, đạn, thuốc nổ, vũ khí công thành, tàu và vật tư vận tải. Mỗi loại có năm xuất hiện, công nghệ, nguyên liệu, chi phí, năng lực sản xuất, khả năng cung cấp và đơn vị sử dụng. Thiếu đạn/súng/vận tải phải ảnh hưởng đến khả năng tác chiến.

## 8.8. Học thuyết

Học thuyết phản ánh truyền thống và cải cách quân sự, ảnh hưởng tới tổ chức, binh chủng, huấn luyện, dự bị, phòng thủ, tấn công, cơ động, hậu cần và tác chiến hải quân. Có thể thay đổi theo kinh nghiệm và công nghệ.

## 8.9. Hải quân và hạm đội

Cấu trúc linh hoạt: Bộ chỉ huy hải quân → Hạm đội → Hải đoàn/Phân hạm đội → Nhóm tàu → Từng tàu. Mỗi tàu có lớp, năm đóng, trọng tải, tốc độ, hỏa lực, giáp, tầm hoạt động, thủy thủ, tình trạng và chi phí bảo dưỡng.

Nhiệm vụ: kiểm soát biển, tuần tra, hộ tống, vận tải, đổ bộ, phong tỏa, bảo vệ thương mại và trinh sát.

## 8.10. Không gian chiến tranh

- Cấp chiến lược: mục tiêu, liên minh, huy động, phân bổ lực lượng.
- Cấp chiến dịch: tập đoàn quân, quân đoàn, hướng tiến công, tuyến tiếp tế, mục tiêu địa lý.
- Cấp trận đánh: lực lượng tham chiến, thành phần, chỉ huy, trang bị, địa hình, thời tiết, tiếp tế, tinh thần, kinh nghiệm và tổn thất.
- Công thành: phòng thủ thành phố, pháo đài, bao vây, lương thực, tiếp tế, đầu hàng và thiệt hại.

Không cần mô phỏng từng người lính, nhưng trận đánh phải có nguyên nhân và thành phần cụ thể.

## 8.11. Hậu cần

Hậu cần gồm lương thực, đạn, vũ khí, quân nhu, vận tải, kho, trạm y tế và tuyến tiếp tế. Hiệu quả phụ thuộc khoảng cách, địa hình, đường bộ, đường sắt, cảng, đường thủy, kiểm soát lãnh thổ, thời tiết và khả năng bảo vệ.

Quân đội đi xa khỏi tuyến tiếp tế phải suy yếu. Mất cảng, đường sắt hoặc kho phải ảnh hưởng chiến dịch.

## 8.12. UI quân sự

Cần cây tổ chức, danh sách đơn vị, hồ sơ đơn vị, bản đồ vị trí, trang chỉ huy, trang trang bị, hậu cần, chiến dịch và nhật ký trận đánh. Hỗ trợ tự tổ chức theo quy tắc: AI xếp đơn vị vào cấp trên nhưng người chơi có thể chỉnh sửa/khóa. Tối ưu cho điện thoại, không bắt người chơi quản lý từng tiểu đội như RTS.

## 8.13. Liên kết xã hội và kinh tế

Chiến tranh làm thay đổi tuyển quân, lao động, sản xuất, ngân sách, thuế, giá cả, thương mại, dân cư và mức ủng hộ. Hòa bình cho phép giải ngũ, bổ sung kho, phục hồi công nghiệp dân sự và tái phân bổ ngân sách.

---

# 9. NHÂN VẬT, SỰ KIỆN VÀ NỘI DUNG LỊCH SỬ

## 9.1. Nhân vật

Nguyên thủ, quan chức, chính khách, tướng, đô đốc, nhà tư tưởng và nhân vật xã hội có vai trò. Phân biệt nhân vật lịch sử có nguồn với nhân vật mô phỏng được tạo ra. Không gắn chân dung không đúng người.

## 9.2. Sự kiện

Mỗi sự kiện quan trọng cần thời gian, địa điểm, hình ảnh/minh họa, nhân vật, các bên liên quan, bối cảnh, nguyên nhân, diễn biến, lựa chọn, hệ quả ngắn hạn và dài hạn, liên kết tới nhật ký và bản đồ.

## 9.3. Journal và chronicle

Lưu các quyết định, thay đổi lãnh thổ, chiến tranh, cải cách, phát minh, khủng hoảng, biến động dân cư và sự kiện đáng chú ý. Cần phân biệt sự kiện lịch sử thật, sự kiện mô phỏng và kết quả alternate history.

---

# 10. AI TOÀN CẦU VÀ HAI CHẾ ĐỘ CHƠI

## 10.1. Shared Simulation Engine

Historical, Sandbox và Observer dùng chung một engine. Khác biệt nằm ở dữ liệu khởi tạo, lớp thiên hướng lịch sử, quy tắc quyết định và vai trò người chơi; không tạo hai hệ thống mô phỏng rời rạc.

## 10.2. Historical Mode

Bắt đầu 01/01/1836 theo dữ liệu có nguồn. Mỗi nước có hoàn cảnh, thể chế, mục tiêu và quan hệ phù hợp. Sự kiện có điều kiện và cửa sổ thời gian; không bắt buộc kết quả lịch sử. Người chơi có thể thay đổi nguyên nhân và làm lịch sử rẽ nhánh.

## 10.3. Sandbox / Alternate History

Không ép kết quả đã biết. Quốc gia tự lập mục tiêu, cạnh tranh, cải cách, công nghiệp hóa, suy yếu, tan rã, liên minh hoặc chiến tranh theo điều kiện. Mọi biến động cần có quan hệ nhân quả và tính nhất quán.

## 10.4. Observer

Tất cả quốc gia còn tồn tại được AI điều hành; người chơi chỉ quan sát. Có timeline, báo cáo quốc gia, chiến tranh, thay đổi lãnh thổ và giải thích các quyết định quan trọng.

## 10.5. Hierarchical AI Planner

AI mỗi nước cần:
- Hồ sơ lợi ích quốc gia và mục tiêu dài hạn.
- Đánh giá kinh tế, xã hội, chính trị, quân sự, ngoại giao.
- Đánh giá láng giềng, đồng minh và đối thủ.
- Kế hoạch xây dựng, ngân sách, công nghệ và nhân lực.
- Kế hoạch quân sự và hậu cần.
- Chiến lược ngoại giao.
- Điều chỉnh theo rủi ro và thay đổi hoàn cảnh.
- Lý do quyết định có thể xem được trong UI.

Không chỉ chọn hành động có điểm utility cao trong từng module mà không có chiến lược tổng thể. AI nước nhỏ cũng phải hành động phù hợp nguồn lực và hoàn cảnh riêng.

---

# 11. HÌNH ẢNH, MÔ TẢ VÀ ASSET PIPELINE

## 11.1. Nhóm hình ảnh

- Chân dung nguyên thủ, chính khách, tướng lĩnh, đô đốc và nhân vật lịch sử.
- Quốc kỳ, huy hiệu, trang phục, kiến trúc và biểu tượng văn hóa.
- Thành phố, thủ đô, cảng, làng, nhà máy, mỏ, nông trại, đường sắt và công trình.
- Dân cư, tầng lớp, nghề nghiệp và đời sống.
- Quân phục, vũ khí, tàu, pháo, công sự và chiến trường.
- Sự kiện lịch sử, hiệp ước, cách mạng, khủng hoảng và chiến tranh.

Không dùng chung một ảnh để đại diện cho nhiều nền văn hóa hoặc công trình khác nhau nếu gây sai lệch. Ưu tiên tài sản có giấy phép, public domain phù hợp hoặc tự tạo; ghi nguồn và điều kiện sử dụng.

## 11.2. Asset Registry

Mỗi asset có ID, loại, tên, mô tả, quốc gia/vùng/nhân vật/sự kiện liên quan, thời kỳ áp dụng, nguồn, license, định dạng, độ phân giải, kích thước, biến thể, asset fallback và checksum.

Hỗ trợ nhiều độ phân giải, lazy loading, cache, gói tải nội dung, offline và kiểm tra tài sản thiếu.

## 11.3. Mô tả

Quốc gia, tỉnh, thành phố, công trình, nhân vật, đơn vị quân sự, công nghệ và sự kiện đều cần mô tả thực chất. Không dùng mô tả chung chung có thể áp dụng cho mọi đối tượng.

## 11.4. Visual reference

Các ảnh trong `illustrations/` chỉ hướng dẫn phong cách và bố cục. Không sao chép nguyên văn UI, nhãn, chỉ số hoặc dữ liệu trên ảnh. Claude phải dùng dữ liệu game có nguồn khi tạo screenshot thật.

---

# 12. GIAO DIỆN VÀ TRẢI NGHIỆM ANDROID

## 12.1. Landscape

Là bố cục chiến lược chính: bản đồ chiếm vùng trung tâm; thanh thời gian/tốc độ; rail chức năng; cửa sổ có thể thu gọn/mở rộng; cửa sổ tỉnh và chi tiết; legend; map lenses; outliner.

## 12.2. Portrait

Là bố cục riêng, không thu nhỏ landscape. Dùng dock điều hướng, bottom sheet nhiều mức, tab theo ngữ cảnh, ưu tiên thao tác một tay và giữ bản đồ có thể quan sát.

## 12.3. Màn hình tỉnh

Cần các tab tối thiểu: Tổng quan, Địa lý, Dân cư, Công trình, Kinh tế, Hạ tầng, Chính trị/Quản trị, Quân sự, Lịch sử.

Trang Công trình có bộ lọc theo nhóm, trạng thái, cấp, lợi nhuận, sở hữu và việc làm. Trang từng công trình có ảnh, mô tả, cấp, việc làm, nguyên liệu, sản lượng, doanh thu, chi phí, lợi nhuận, sở hữu, production method, hiệu suất, nhu cầu hạ tầng và cảnh báo.

## 12.4. Màn hình quân sự

Có cây tổ chức, roster, bản đồ đơn vị, chỉ huy, trang bị, học thuyết, kho, hậu cần, chiến dịch và kết quả trận đánh. Mọi chỉ số phải có tooltip giải thích nguồn tính và tác động.

## 12.5. Hình ảnh và phân cấp

Dùng ảnh lớn tại hồ sơ quốc gia, nhân vật, thành phố, sự kiện và công trình đặc biệt; dùng thumbnail tại danh sách công trình/đơn vị; bản đồ dùng sprite/icon theo mức zoom. Tránh nhồi ảnh không có ngữ cảnh hoặc khiến giao diện nặng.

---

# 13. KIẾN TRÚC DỮ LIỆU VÀ ENGINE

## 13.1. Registry / domain model gợi ý

Các registry có thể gồm:
- `PoliticalEntityRegistry`
- `AdministrativeUnitRegistry`
- `StrategicRegionRegistry`
- `SettlementRegistry`
- `BoundaryVersionRegistry`
- `ResourceDepositRegistry`
- `BuildingTypeRegistry`
- `BuildingInstanceRegistry`
- `ProductionMethodRegistry`
- `BuildingOwnershipRegistry`
- `ConstructionQueueRegistry`
- `InfrastructureRegistry`
- `PopCohortRegistry`
- `MarketRegistry`
- `MilitaryUnitRegistry`
- `MilitaryOrganizationRegistry`
- `CharacterRegistry`
- `HistoricalEventRegistry`
- `AssetRegistry`
- `SourceRegistry`

Tên trên là định hướng domain, không phải yêu cầu tạo một class cho mỗi registry nếu kiến trúc hiện tại có cách tốt hơn. Phải tách rõ dữ liệu định nghĩa (definition) khỏi trạng thái mô phỏng (instance/state).

## 13.2. Temporal data

Dữ liệu thay đổi theo thời gian phải có ngày hiệu lực. Không ghi đè lịch sử khi tỉnh đổi tên, đơn vị được sáp nhập, công trình đóng cửa hoặc nhân vật rời chức vụ.

## 13.3. Save compatibility

Có version migration cho save. Không thay ID ổn định tùy tiện. Các migration cần kiểm tra tỉnh/công trình/đơn vị đã bị xóa, hợp nhất hoặc thay đổi cấu trúc.

## 13.4. Hiệu năng

Không tính mọi công trình/đơn vị mỗi frame. Dùng tick mô phỏng, dirty flags, cache, batch update, dữ liệu compact, spatial index, culling và LOD. Duy trì tính xác định khi dùng RNG seed để save/load tiếp tục nhất quán.

## 13.5. Android reliability

Chống ANR, memory leak, race condition và crash; tránh xử lý nặng trên UI thread; giới hạn tải ảnh; giải phóng bitmap/texture; có trạng thái phục hồi khi tiến trình bị hệ điều hành thu hồi. Đo trên thiết bị Android thật, không suy diễn hiệu năng từ trình duyệt desktop.

---

# 14. QUY MÔ GÓI NỘI DUNG OFFLINE

Mục tiêu yêu cầu của dự án là **tổng nội dung cài đặt offline trên 3 GB** khi đạt bản mobile đầy đủ. Đây là mục tiêu ngân sách nội dung, không phải tiêu chuẩn chứng minh chất lượng và không được tạo dung lượng bằng ảnh trùng hoặc dữ liệu rác.

Phải tách:
- APK cài đặt.
- Gói bản đồ/dữ liệu.
- Gói hình ảnh/chân dung/công trình.
- Gói âm thanh/nhạc/hiệu ứng.
- Gói nội dung lịch sử và mô tả.
- Gói dự phòng hoặc ngôn ngữ khác nếu có.

Cho phép tải một lần và chơi offline về sau. Hiển thị kích thước, checksum, trạng thái tải, dung lượng cần thiết và khả năng tiếp tục tải. Không bắt buộc nhồi toàn bộ 3 GB vào một APK duy nhất.

---

# 15. KIỂM TOÁN VÀ NGHIỆM THU

## 15.1. Audit trạng thái

Mỗi hệ thống phải được đánh dấu:
- Implemented: logic thật, hoạt động và có test phù hợp.
- Partial: có một phần, còn thiếu hoặc giả lập đơn giản.
- Placeholder: giao diện/dữ liệu mẫu/fallback.
- Missing: chưa có.
- Broken: có nhưng lỗi.

Mỗi phát hiện phải có file/line, bằng chứng, tác động, ưu tiên, cách sửa và tiêu chí nghiệm thu. Không đánh dấu PASS chỉ vì có file hoặc component.

## 15.2. Global coverage audit

Với mọi thực thể chính trị, kiểm tra nhận diện, dữ liệu lịch sử, địa lý, tỉnh/thành, dân cư, kinh tế, chính trị, quân sự, ngoại giao, AI, hình ảnh, mô tả và sự kiện. Mức độ hoàn thiện phải đo được và thể hiện thiếu dữ liệu.

## 15.3. Administrative audit

Kiểm tra ranh giới quốc gia, tỉnh, đơn vị cấp dưới, settlement, thủ phủ, tọa độ, tài nguyên, công trình, tuyến giao thông, dữ liệu lịch sử và nguồn. Không coi có polygon là đã hoàn thiện tỉnh.

## 15.4. Building audit

Công trình chỉ hoàn thành khi có điều kiện xây, vị trí, cấp, xây dựng, đầu vào/đầu ra, lao động, phương pháp sản xuất, sở hữu, chi phí/lợi nhuận, tác động tới xã hội và kinh tế, hình ảnh/mô tả phù hợp và test.

## 15.5. Military audit

Kiểm tra quân chủng, cơ cấu đơn vị, quân số/biên chế, trang bị, chỉ huy, tuyển quân, hậu cần, vị trí, cơ động, chiến dịch, trận đánh, hải quân và thời đại công nghệ. Không chấp nhận cây tổ chức chỉ có tên đơn vị giả.

## 15.6. Test cases bắt buộc cho công trình

1. Xây nông trại tại tỉnh có đất phù hợp; từ chối/hạn chế khi không phù hợp.
2. Khai thác mỏ theo tài nguyên và trữ lượng.
3. Phát hiện tài nguyên mới.
4. Nhà máy dùng nguyên liệu từ tỉnh khác.
5. Thiếu đầu vào làm giảm sản xuất.
6. Thiếu lao động làm giảm công suất.
7. Đổi production method làm thay đổi đầu vào/đầu ra và nghề nghiệp.
8. Đường sắt/cảng cải thiện vận tải và tiếp cận thị trường.
9. Doanh trại hỗ trợ tổ chức lực lượng nhưng có chi phí.
10. Chiến tranh phá hủy công trình và gián đoạn sản xuất.
11. Hòa bình phục hồi công trình.
12. Thay đổi quyền sở hữu theo luật.
13. Save/load giữ nguyên trạng thái.

## 15.7. Test cases bắt buộc cho địa lý

Chọn quốc gia → xem tỉnh → xem thành phố → xem công trình; đổi chủ quyền; chia tách/sáp nhập; đổi thủ đô; đổi tên; cải cách hành chính; save/load bảo toàn ID và lịch sử.

## 15.8. Test cases bắt buộc cho quân đội

Tạo đơn vị, xếp cấp tổ chức, bổ nhiệm chỉ huy, tuyển quân, trang bị, huy động, hành quân, cắt tuyến tiếp tế, công thành, đổ bộ, phong tỏa, chiến đấu, hòa ước, giải ngũ và tái tổ chức.

## 15.9. Historical calibration

Tạo bộ kiểm định đa khu vực, không chỉ một cặp quốc gia. Bao gồm các trường hợp ở Tây Âu, Trung Âu, Đông Âu, Đông Á, Nam Á, Đông Nam Á, Trung Đông, châu Phi, Bắc Mỹ, Trung/Nam Mỹ và châu Đại Dương. Kiểm tra dân số, kinh tế, công nghiệp hóa, chính trị, chiến tranh, ngoại giao, hình thành/tan rã quốc gia và AI.

Anh và nhà Thanh chỉ là ví dụ kiểm tra một số động lực cụ thể, không phải trọng tâm duy nhất của dự án.

## 15.10. Android QA

Unit, integration, data integrity, long-term simulation, multi-seed sandbox, historical calibration, save/load, UI, performance, memory, battery và thermal tests. Có kiểm tra thiết bị Android thật; screenshot trình duyệt không được dùng thay thế nghiệm thu thiết bị.

---

# 16. LỘ TRÌNH TRIỂN KHAI

Triển khai theo lát cắt dọc có thể kiểm thử, không viết toàn bộ hệ thống cùng lúc:

1. Audit repository và xác định baseline.
2. Chuẩn hóa dữ liệu thế giới, nguồn và temporal boundaries.
3. Hoàn thiện administrative units, strategic regions và settlements.
4. Hoàn thiện province UI và bản đồ nhiều cấp.
5. Xây Building Registry, Building Instance và Resource Deposits.
6. Hoàn thiện công trình nông nghiệp, khai khoáng và công nghiệp.
7. Hoàn thiện production methods, lao động và sở hữu.
8. Hoàn thiện construction queue, infrastructure và market access.
9. Hoàn thiện công trình hành chính, giáo dục, quân sự và văn hóa.
10. Nâng cấp Pop Cohorts, thị trường và tài chính.
11. Xây Military Organization, Units, Equipment, Logistics và Naval Fleets.
12. Hoàn thiện chính trị, ngoại giao, nhân vật và sự kiện.
13. Nâng cấp AI chiến lược toàn cầu.
14. Hoàn thiện Historical/Sandbox/Observer.
15. Tạo asset pipeline và bổ sung nội dung/hình ảnh toàn cầu.
16. Hoàn thiện landscape/portrait.
17. Tối ưu Android, đóng gói và QA.

Mỗi giai đoạn có commit riêng, danh sách file, migration nếu có, test, ảnh chụp ứng dụng thực, benchmark và danh sách việc còn thiếu. Không gộp thay đổi lớn thành một commit không thể review.

---

# 17. ĐIỀU KIỆN BÀN GIAO VÀ NGHIỆM THU CUỐI

Game chỉ được xem là đạt mục tiêu khi:
- Thế giới có độ phủ địa lý và nội dung toàn cầu.
- Quốc gia có bản sắc và hành vi khác nhau.
- Người chơi đi được từ world map xuống tỉnh, thành phố, địa điểm và công trình.
- Tỉnh có tiềm năng, công trình, dân cư, hạ tầng, thị trường và chính quyền địa phương.
- Công trình hoạt động qua lao động, nguyên liệu, production methods và ownership.
- Xây dựng cần thời gian, vật liệu, năng lực và ngân sách.
- Quân đội có đơn vị thật, tổ chức linh hoạt, trang bị, chỉ huy, hậu cần và chiến dịch.
- AI điều hành mọi quốc gia với chiến lược và lý do có thể giải thích.
- Historical Mode không khóa kết quả; Sandbox có thế giới thay thế có nhân quả.
- Hình ảnh và mô tả phong phú, đúng vùng và thời đại, có nguồn/license.
- Android hoạt động ổn định và được kiểm thử trên thiết bị thật.
- Save/load, migration và hiệu năng được đo lường.

**Tuyên bố sản phẩm:** Xây dựng một thế giới lịch sử có thể quan sát, tìm hiểu, điều hành và thay đổi; không phải một bảng số liệu lớn được phủ lên bản đồ.

---

# 18. TÀI LIỆU THAM KHẢO THIẾT KẾ

Các tài liệu sau dùng để nghiên cứu nguyên lý gameplay và đối chiếu thiết kế, không phải nguồn để sao chép tài sản:

- Victoria 3 — Buildings Dev Diary: https://store.steampowered.com/news/posts/?enddate=1623341987&feed=steam_community_announcements
- Victoria 3 — Production Methods Dev Diary: https://store.steampowered.com/news/posts/?enddate=1624550641&feed=steam_community_announcements
- Victoria 3 — Construction Dev Diary: https://store.steampowered.com/news/posts/?enddate=1632153502&feed=steam_community_announcements
- Victoria 3 Tabula — Buildings reference: https://vic3tabula.com/en/buildings
- Victoria 3 Tabula — States reference: https://vic3tabula.com/en/states

Các phiên bản game có thể thay đổi theo patch; khi cần đối chiếu phải ghi rõ phiên bản và ngày tra cứu.

---

# 19. DANH MỤC ẢNH MINH HỌA

Các ảnh dưới đây là concept art để truyền đạt ý tưởng giao diện và nội dung. Tất cả số liệu, tên địa phương và nhãn trong ảnh là minh họa, không phải dữ liệu lịch sử chính thức.

![Hình 1. Concept bản đồ tỉnh: địa giới, thành phố, cụm công trình, hạ tầng và bảng thông tin tỉnh.](illustrations/01_province_map_and_buildings_concept.png)
![Hình 2. Concept tổng quan: phạm vi thế giới, tỉnh thành, công trình, production methods, quân đội và các lớp nội dung.](illustrations/02_global_game_design_overview_concept.png)
![Hình 3. Concept giao diện tỉnh: danh sách công trình, phương pháp sản xuất, chuỗi cung ứng, hàng đợi xây dựng và phát triển theo thời gian.](illustrations/03_province_buildings_production_concept.png)
![Hình 4. Concept hệ thống công trình: hồ sơ công trình, bản đồ tỉnh, loại công trình, chuỗi sản xuất và tổ chức quân đội.](illustrations/04_building_system_and_military_concept.png)
---

**Kết thúc đặc tả.**
