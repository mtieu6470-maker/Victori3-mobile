# R4e — Kiểm toán chính thể tập thể và aggregate Mã Lai trong Historical Mode

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `103ab66b227809fae358e082fa253c0e50a1f78c`  
**Khoảng chiến dịch:** 1836–1936  
**Trạng thái:** `DOCUMENTATION_ONLY / SELF_AUDIT / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

## 1. Câu hỏi nghiên cứu

R4d kết luận rằng hai mục còn lại trong queue 54 profile là MAO và MLY, nhưng đây là các thực thể tập thể/aggregate. Không được “đóng coverage” bằng cách tìm một tên cá nhân rồi tạo succession array. R4e kiểm tra cấu trúc quyền lực thực tế, snapshot 1836, những chuyển tiếp tới 1936 và ranh giới giữa evidence với mô hình gameplay.

Nguồn được phân loại theo cấp truy cập trong registry. Tài liệu này không tuyên bố đã kiểm chứng mọi bản thảo, hồ sơ triều đình hoặc bản đồ gốc. Những kết luận phụ thuộc vào trang tóm lược, nguồn thứ cấp hay chronology xung đột đều được ghi rõ.

## 2. MAO — United Tribes of New Zealand / Te Whakaminenga

### 2.1. Snapshot 1836

Ngày 28/10/1835, 34 rangatira miền Bắc ký He Whakaputanga tại Waitangi, trong cuộc họp do British Resident James Busby triệu tập. Tuyên bố có bốn điều khoản: tuyên bố một nhà nước độc lập; quyền lực/chủ quyền được các rangatira giữ **một cách tập thể**; dự kiến một huihuinga/congress họp hằng năm để làm luật; và đề nghị Vua William IV bảo vệ “infant state”. NZ History ghi nhận 52 chữ ký vào tháng 7/1839, trong đó các chữ ký bổ sung bao gồm những rangatira ngoài nhóm Bắc ban đầu.

Đây là một liên minh của các rangatira tham gia tuyên bố, không phải bằng chứng về một vương triều tập quyền hoặc một cá nhân đứng đầu toàn bộ Aotearoa. Te Ara ghi rằng kế hoạch họp congress hằng năm đã không thành hiện thực. Vì vậy không được biến một kế hoạch hiến định thành một nghị viện đang hoạt động. James Busby là viên chức Anh và người triệu tập/cuộc họp; ông không phải HOS Māori.

Phạm vi địa lý/chính trị cần giới hạn: 34 người ký ban đầu chủ yếu là rangatira miền Bắc; chữ ký sau mở rộng danh sách, nhưng không chứng minh rằng mọi iwi/hapū đều là thành viên hoặc đã trao quyền cho một chính quyền duy nhất. Tên “United Tribes of New Zealand” trong game phải mang ý nghĩa mô hình lịch sử có phạm vi xác định, không đại diện thay cho toàn bộ xã hội Māori.

### 2.2. Chuyển tiếp 1840 và 1836–1936

Te Tiriti o Waitangi được ký từ 06/02/1840. Không nên biểu diễn mốc này như một thao tác đơn giản “quốc gia biến mất, tất cả quyền lực chuyển cho Crown”. Waitangi Tribunal trong Stage 1 của Te Paparahi o Te Raki kết luận He Whakaputanga là tuyên bố rõ ràng về chủ quyền Māori; đối với các rangatira ký te Tiriti trong phạm vi cuộc điều tra đó, họ không nhượng chủ quyền mà đồng ý để Crown kiểm soát người Pākehā, với những vấn đề quyền lực hỗn hợp cần được thương lượng. Kết luận này có phạm vi inquiry cụ thể và không thay thế mọi tranh luận pháp lý/lịch sử về toàn bộ New Zealand.

Do đó, trường `hist_to=1840-02-06` hiện có trên registry MAO cần được diễn giải thận trọng. Nó có thể đánh dấu một chuyển tiếp về hiệp ước, tuyên bố/thiết chế và chính sách thuộc địa; nó không đủ để tuyên bố mọi polity Māori bị giải thể cùng ngày. Quan hệ rangatiratanga, quyền lực của các iwi/hapū và các hình thức tổ chức địa phương tiếp tục có lịch sử riêng trong giai đoạn 1840–1936.

### 2.3. Hệ quả mô hình hóa

- Giữ `hos: null` và `government: confederation_of_chiefs` ở mức candidate cho tới khi có thiết kế thể chế được duyệt.
- Không tạo succession array gồm danh sách signatories; chữ ký không phải danh sách người kế vị.
- Nếu game cần chức năng điều hành, cần mô hình riêng cho rangatira/constituent iwi, phạm vi tham gia, cơ chế huihuinga được đề xuất và cơ chế thực tế đã vận hành. Không gán “president” cho Busby hoặc cho một signatory chỉ vì người đó nổi bật.
- Tách MAO khỏi các polity Māori không ký hoặc không thuộc liên minh. Bản đồ và quyền sở hữu phải có evidence ở cấp rohe/iwi, không lấy danh sách chữ ký làm bản đồ kiểm soát.
- Không áp dụng một mốc dissolution duy nhất cho toàn bộ các cộng đồng Māori.

## 3. MLY — Malay Peninsula Sultanates aggregate

### 3.1. Lỗi khái niệm cần tránh

Political registry hiện mô tả MLY là aggregate của Perak, Selangor, Negeri Sembilan, Pahang và Johor; ghi Kelantan và Terengganu dưới Siam. Đây là một simplification phục vụ gameplay, không phải một quốc gia liên bang thống nhất ở năm 1836. Mỗi thành phần có triều đại, luật lệ, quan hệ địa phương và nguồn kế vị riêng; Johor còn có sự tách biệt giữa Sultan và Temenggong.

Federated Malay States không tồn tại trong snapshot 1836. Conference of Rulers Malaysia ghi nhóm này được thành lập năm 1895/1896 với Perak, Selangor, Negeri Sembilan và Pahang. Johor và các bang phía Bắc thuộc nhóm Unfederated Malay States trong giai đoạn sau đó. Không được gán cấu trúc FMS ngược về năm 1836, hoặc coi 5 thành phần MLY là một chính thể có chung succession.

### 3.2. Các authority layer có thể xác định ở mức hiện tại

| Thành phần / lân cận | Tình hình 1836 có thể hỗ trợ | Giới hạn |
|---|---|---|
| Perak | Sultan Shahabuddin Riayat Shah, chronology chính thức 1830–1851 | Đây là Sultan của Perak, không phải ruler của MLY tổng hợp |
| Selangor | Sultan Muhammad Shah (III), kế vị 1826 và trị vì 31 năm theo cổng chính quyền bang | Chính nguồn bang mô tả quyền lực trung ương yếu và quyền lực các daerah phân tán |
| Johor | Sultan và Temenggong là hai chức vụ riêng. Temenggong Daeng Ibrahim được bổ nhiệm 1825; Anh công nhận sau 14 năm; chuyển giao chính quyền Johor cho ông theo hiệp ước năm 1855 | Không backdate quyền kiểm soát năm 1855; exact Sultan Ali accession/territorial reach cần hồ sơ gốc |
| Pahang | Bendahara Tun Ali được cài đặt năm 1806; Linehan gọi giai đoạn là “Rule of Bendahara Ali (1806–1857)” | Bendahara không phải một Sultan toàn bán đảo; niên đại cần đối chiếu bản thảo/court records |
| Negeri Sembilan | Cấu trúc Luak, Undang, penghulu và Yamtuan; tuyển chọn và adat có vai trò thực | Nguồn thứ cấp khác nhau về dòng Yamtuan/niên đại; chưa chốt succession 1836 |
| Kedah (lân cận, ngoài 5 phần MLY hiện tại) | Siam xâm lược/annexed Kedah năm 1821; Sultan Ahmad Tajuddin ở lưu vong và được phục hồi năm 1842 | Phải phân biệt chiếm đóng/suzerainty và phục hồi; không coi là một thành phần đã nằm trong MLY |
| Perlis (lân cận, ngoài 5 phần MLY hiện tại) | Năm 1839 Perlis trở thành đơn vị hành chính riêng trong tái tổ chức Kedah dưới ảnh hưởng Siam; Syed Hussein được công nhận/đặt làm Raja năm 1843 | Không tạo một sovereign Raja Perlis tại snapshot 1836 |
| Kelantan (registry gán quan hệ Siam) | Chronology xung đột về cái chết của Sultan Muhammad I (1835/1837), Long Zainal và Long Senik; Sultan Muhammad II từ 1838 | Không gán Muhammad II cho 1836; cần phân biệt quyền cai trị tranh chấp với chức danh chính thức |
| Terengganu (registry gán quan hệ Siam) | Nguồn UniSZA ghi Tengku Omar được đặt làm Yang di-Pertuan Besar năm 1831, bị đẩy khỏi trung tâm năm 1832; Sultan Mansor II rồi Sultan Muhammad I giữ ngôi; Omar trở lại năm 1839 | Có khác biệt 1836/1837 trong chronology; không quy giản thành một succession event không tranh chấp |

### 3.3. Siam: tribute, suzerainty hay direct rule?

Các nguồn về Kelantan và Terengganu ghi nhận bunga mas tribute và yêu sách suzerainty của Siam từ cuối thế kỷ XVIII/đầu XIX, nhưng quan hệ này không đồng nghĩa trong mọi thời điểm với quản trị trực tiếp từ Bangkok. Nghiên cứu về hiệp ước Kelantan 1903 còn cho thấy các ruler địa phương có khi hành động theo thẩm quyền riêng, có khi phải tuân lệnh Siam; điều đó cảnh báo không nên biểu diễn overlord thành quyền kiểm soát hành chính tuyệt đối.

Với Kedah, nguồn học thuật Oxford mô tả cuộc xâm lược/annexation năm 1821 và giai đoạn Sultan lưu vong đến 1842. Perlis là trường hợp phát sinh từ tái tổ chức hành chính năm 1839 và được công nhận Raja năm 1843. Mỗi quan hệ phải có semantics riêng: tribute, suzerainty, occupation, governor appointment, protectorate hay direct administration.

### 3.4. Hệ quả mô hình hóa

- Giữ MLY là container/aggregate gameplay; không thêm HOS chung hay succession array.
- Khi được phê duyệt để tái cấu trúc dữ liệu, tách các constituent polity có thể chơi/không thể chơi và authority relation độc lập. Một polity địa phương có thể đồng thời có ruler truyền thống, overlord có yêu sách suzerainty và một colonial/foreign resident.
- Không dùng “FMS” cho 1836. FMS bắt đầu cuối thế kỷ XIX; Johor không thuộc FMS.
- Không chuyển ngày kế vị từ một trang tổng hợp sang độ chính xác ngày-tháng nếu nguồn chỉ hỗ trợ năm hoặc còn xung đột.
- Không coi tribute hoặc quan hệ triều cống là bằng chứng đủ cho direct control.
- Không cập nhật những trường đang có trong `historical_data/` ở R4e; tất cả candidate decisions là non-executing.

## 4. Các giới hạn và kiểm soát chất lượng nguồn

- Các nguồn NZ History, Te Ara và Waitangi Tribunal được đọc ở dạng trang text/searchable page; hồ sơ facsimile IA9-1 đã xác định nhưng chưa hoàn tất transcription đối chiếu từng chữ.
- Trang Perak, Selangor, Johor, Perlis và UniSZA là nguồn chính thức theo từng cơ quan/bang; các trang có góc nhìn thể chế riêng, cần đối chiếu hồ sơ triều đình.
- Linehan (1936), Buyong Adil (1981), Skinner và các bài nghiên cứu là nguồn thứ cấp/học thuật; không được nâng độ tin cậy vượt nội dung thực sự đọc.
- Tài liệu R4e không giải quyết toàn bộ lịch sử 1901–1936, biên giới chi tiết, demographic/economy hoặc mọi quan hệ chủ quyền tại bán đảo.

## 5. Kết luận

R4e bổ sung dossier cho hai mục cuối trong queue succession ban đầu mà không bịa thêm tên ruler. MAO cần collective authority modelling và phạm vi đại diện rõ ràng; MLY cần constituent-polity modelling với quan hệ suzerainty/tribute/occupation tách biệt. Với hai trường hợp, “không có một HOS duy nhất” là kết luận lịch sử có cơ sở, không phải một ô dữ liệu bị bỏ sót.

**Coverage:** R3af + R4a + R4b + R4c + R4d + R4e hiện có dossier nghiên cứu cho 54/54 mục của queue ban đầu; đây chỉ là research coverage. Chưa phải Claude REVIEW_PASS, owner ACCEPTED hay live-data readiness.

## 6. Change boundary

Không thay đổi `historical_data/`, country profiles, political registry, succession arrays, source runtime, schema, engine, events, tests, map, assets, saves, Android, Gradle, workflows, signing hoặc APK. Không chạy test/build/APK workflow. R4e chỉ bổ sung tài liệu nghiên cứu và yêu cầu review độc lập.
