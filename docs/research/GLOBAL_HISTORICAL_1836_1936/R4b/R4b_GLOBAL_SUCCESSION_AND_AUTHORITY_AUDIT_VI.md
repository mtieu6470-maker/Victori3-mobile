# R4b — Kiểm toán kế vị và thẩm quyền toàn cầu, đợt 02

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `e5dead90d15cab772a8a0fa00ee76f76e4d08916`  
**Ngày:** 18/11/2026  
**Phạm vi:** 15 polity còn thiếu succession array, từ Trung Á, Tây Á, Nam Á, Đông Á, Đông Nam Á, Bắc Phi và châu Phi.  
**Trạng thái:** `DOCUMENTATION_ONLY / SELF_AUDIT / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

## 1. Mục tiêu

R4b tiếp tục công việc toàn cầu sau tranche R4a. Nó tập trung vào 15 profile 1836 chưa có succession array. Không phải mọi profile đều cần một danh sách vua liên tục: phải nghiên cứu regency, thủ lĩnh địa phương, chức vụ đồng thời, chính thể phụ thuộc, chủ quyền bên ngoài, nội chiến và tranh chấp kế vị.

R4b không bổ sung 15 arrays vào `historical_data/leaders/heads_of_state.json`. Tất cả mốc đề xuất vẫn phải được Claude kiểm tra độc lập và được chủ dự án chấp thuận riêng trước khi patch dữ liệu chạy game.

## 2. Kết quả theo polity

### KHI — Khiva
- Snapshot 1836: Allah Quli Khan là Khan; nghiên cứu của William A. Wood dựa trên sử ký triều đình Agahi ghi thời kỳ Allah Quli 1825–1843, tiếp đó Rahim Quli Khan 1843–1846, rồi Muhammad Amin Khan 1846–1855.
- Các tác phẩm Agahi *Riyāż al-dawla* và *Zubdat al-tavārīkh* là nguồn triều đình quan trọng; một số tác phẩm khác chưa được xuất bản. Các quy đổi niên đại Hijri/lịch địa phương cần giữ precision ở năm hoặc range cho đến khi đối chiếu bản thảo.
- Profile hiện dùng `levi_2017` (sách về Kokand) làm nguồn cho Khiva; đây là **source-scope mismatch** cần sửa nguồn trong tương lai. Không patch.

### BUK — Bukhara
- Nasrullah trị vì 1827–1860; tiếp theo là Muzaffar (1860–1885), Abd al-Ahad (1885–1910) và Alim Khan (1910–1920) trong chronology tổng quát.
- Iranica mô tả Nasrullah tập trung hóa quyền lực và xây dựng quân đội thường trực; *Khusrawi’s Zafar-Name* là nguồn viết về giai đoạn ông trị vì và tranh chấp với Kokand/Khiva.
- Profile Bukhara hiện cũng dựa vào `levi_2017`, một chuyên khảo trọng tâm về Kokand. Có thể sách đề cập Nasrullah trong bối cảnh chiến tranh với Kokand, nhưng chưa đủ làm nguồn duy nhất cho toàn bộ succession Bukhara.

### HER — Herat
- Kamran Shah Durrani là người cai trị Sadōzāy của Herat từ 1826 đến 1842. Iranica mô tả ông phụ thuộc ngày càng nhiều vào vizier Yar Muhammad Alekozai; Yar Muhammad phế truất và sát hại Kamran năm 1842, sau đó nắm quyền tại Herat.
- Qajar siege 1837–1838, lời cam kết trung thành với Qajar năm 1841, việc Yar Muhammad trở thành người cai trị và Dost Muhammad chiếm Herat năm 1863 là các sự kiện khác nhau. Không coi Herat là một phần hoàn toàn của Afghanistan hoặc Iran trong toàn giai đoạn; phải ghi rõ claim, allegiance và effective control.
- Profile chỉ ghi “Kamran Shah (vizier Yar Mohammad)” làm một chức vụ, nhưng không phân tách Shah và vizier/de facto controller.

### NAJ — Nejd (Second Saudi State)
- Faisal bin Turki bắt đầu triều đại thứ nhất năm 1834, bị quân Ai Cập bắt/đưa đi năm 1838. QDL cho thấy ông trốn/trở về năm 1843, sau giai đoạn Ai Cập chiếm Nejd và các tiểu vương khác thay thế.
- Lorimer chia rõ interregnum 1838–1840; tiếp đó Khalid bin Saud (1840–1842), Abdullah bin Thunayyan (1842–1843) và Faisal lần thứ hai (1843–1865).
- Profile hiện ghi Faisal từ 1834 mà không ngắt quãng; đây là mô hình sai nếu engine hiểu là quyền lực thực tế liên tục. QDL/Lorimer là nguồn hành chính Anh đương thời, có thiên kiến chính trị/thuộc địa cần ghi chú.

### TUN — Beylik of Tunis
- Mustafa Bey là người đứng đầu tại thời điểm đầu giai đoạn; ông mất năm 1837 và con trai Ahmad Bey kế vị, trị vì 1837–1855. TDV İslâm Ansiklopedisi xác nhận Ahmad là Bey thứ mười của triều Husaynid và bắt đầu năm 1837.
- Tunis vẫn là beylik tự trị dưới Ottoman suzerainty; việc Ahmad Bey theo đuổi cải cách và bãi bỏ nô lệ năm 1846 không làm mất ngay quan hệ chủ quyền danh nghĩa với Ottoman.
- Profile hiện ghi `Mustafa Bey` bắt đầu 20/3/1835 nhưng `sources=[]`; mốc bắt đầu và tên đầy đủ cần được xác minh từ hồ sơ Husaynid/triều đình.

### NAG — Nagpur Kingdom
- Raghoji III được nhận làm người kế vị/adopted heir năm 1818 khi còn là trẻ em; Resident Jenkins trực tiếp điều hành trong thời gian ông vị thành niên. Treaty năm 1826 giới hạn quan hệ đối ngoại của Raja.
- Ông mất ngày 11/12/1853, không có con trai sống sót. Quyền nhận con nuôi và quyền kế vị bị tranh luận giữa Resident, triều đình và London; Chính phủ Anh công bố annexation và Commissioner bắt đầu làm việc ngày 13/3/1854.
- Registry hiện `hist_to=1853-12-11` trùng ngày Raghoji mất, nhưng Nagpur chỉ chính thức được quản trị như lãnh thổ Anh từ tháng 3/1854. Cần tách personal ruler death khỏi polity termination/annexation.

### AWA — Awadh (Oudh)
- Nasir-ud-Din Haidar chết/được báo cáo bị đầu độc trong đêm 7–8/7/1837. Anh đã định người kế vị; Muhammad Ali Shah lên ngôi ngày 8/7/1837 sau cuộc tranh chấp với Badshah Begum và Munna Jan.
- Các vua sau: Amjad Ali Shah (1842–1847), Wajid Ali Shah (1847–1856); Anh annex Awadh năm 1856.
- District Lucknow Government cung cấp một chronology địa phương chi tiết; album lịch sử Oudh thế kỷ XIX cũng liệt kê các triều vua và annexation. Ngày chết/đăng cơ nên đối chiếu với công văn Resident và hồ sơ triều đình trước khi dùng ngày exact.

### GWA — Gwalior (Scindia)
- Jankoji Rao Scindia II được nhận làm con nuôi/kế vị năm 1827; Baiza Bai làm regent cho tới khi buộc phải rời quyền năm 1833. Năm 1843 Jankoji chết không có con trai; Tara Bai nhận một trẻ nhỏ làm người kế vị, Mama Sahib được làm regent.
- Phe Dada Khasgiwale loại Mama Sahib và buộc British Resident rời lãnh thổ; Company đánh Gwalior vào tháng 12/1843 và áp đặt subsidiary alliance theo treaty tháng 1/1844.
- Nên tách Maharaja, regent, kiểm soát hành chính thực tế và quyền lực của Resident/Company. Không mô hình hóa 1843–1844 như chuyển giao ngai vàng đơn giản.

### HOL — Indore (Holkar)
- Hari Rao Holkar được chính thức đưa vào Indore và cài đặt vào tháng 4/1834; ông chọn Khande Rao làm heir năm 1841 và mất tháng 10/1843. British Government công nhận Khande Rao, nhưng Khande Rao mất tháng 2/1844 mà không có người kế vị hợp lệ.
- Tài liệu Government of India năm 1933 ghi quyền chọn successor sau đó được tuyên bố thuộc British Government; Resident và Mah Sahiba tham gia tiến trình lựa chọn người từ gia tộc Holkar.
- Đây là chính thể princely state chịu treaty/Resident influence; phải tách ruler local khỏi quyền can thiệp kế vị của EIC/British Government. Các ngày trong nguồn này chủ yếu là tháng/năm, không cần tự suy ra ngày exact.

### TIB — Tibet / Ganden Phodrang
- 10th Dalai Lama Tsultrim Gyatso (1816–1837) vẫn là người đứng đầu tôn giáo/dynastic ở snapshot 1836 nhưng quyền hành chính thực tế nằm trong tay regent Tsemonling II (1819–1844).
- 11th Dalai Lama Khedrup Gyatso được chọn qua Golden Urn năm 1841 và enthroned ngày 25/5/1842 theo phép quy đổi của Petech; ông chỉ nhận seals/ruling powers khoảng tháng 3/1855 và mất đầu năm 1856. Regent Reting I trị vì 1845–1862.
- Petech cảnh báo lịch Tây Tạng/Chinese-month có thể làm ngày Gregorian quy đổi sai một tháng hoặc hơn; do đó ngày chính xác phải lưu kèm lịch nguồn và phương pháp chuyển đổi. Không đồng nhất Dalai Lama với người thực tế điều hành chính quyền.

### RYU — Ryukyu Kingdom
- Shō Iku trị vì 1835–1847; nghiên cứu của Yoshiyuki Maemura từ tài liệu hoàng gia xác nhận ông chỉ định con trai trưởng Shō Shun làm thái tử nhưng Shō Shun chết trước khi đăng cơ; người kế vị là con trai thứ hai.
- Shō Tai lên ngôi năm 1848. Ryukyu đồng thời chịu ảnh hưởng/chế độ tributary của Qing và quyền kiểm soát của Satsuma; năm 1874 Nhật Bản ép cắt quan hệ với Trung Quốc và năm 1879 sáp nhập Ryukyu thành Okinawa Prefecture, đưa vua Shō Tai tới Tokyo.
- Phải tách local king, Satsuma suzerain, Qing tributary/diplomatic relation và Japanese annexation. Không gọi Shō Tai là vua của một quốc gia độc lập xuyên suốt đến 1879.

### BRN — Brunei
- Omar Ali Saifuddin II được ghi trị vì 1828–1852; Islam Museum lưu ý ngày ông assertion claim năm 1825, ngày accession/installation 1826 hoặc 1828 có mâu thuẫn giữa các danh sách.
- Abdul Momin kế vị năm 1852 và trị vì đến 1885; Hashim Jalilul Alam Aqamaddin lên ngôi năm 1885 nhưng lễ đăng quang năm 1895. Nghiên cứu UBD/University of Brunei Darussalam và bài chuyên đề nghi lễ hoàng gia phân biệt accession với coronation.
- Brunei mất lãnh thổ cho Sarawak và Bắc Borneo; British Protectorate Agreement 1888 và British Resident 1906 là chuyển đổi chủ quyền/ngoại giao riêng, không phải sự thay đổi Sultan.

### ACE — Aceh
- Nguồn J. Leyten (2004) ghi Sultan Ala’ad-Din Muhammad Shah trị vì 1823–1836; con trai nhỏ Sulayman mang tước Sultan Ali Iskandar Shah từ năm 1836 đến 1857.
- Người chú Tuanku Ibrahim làm guardian nhưng từ chối trao chính quyền; ông tự xưng Sultan Ala’ad-Din Mansur Shah và giữ Kraton, trong khi Ali Iskandar kiểm soát một phần vương quốc. Civil war nổ ra và Ali Iskandar chết năm 1857.
- Đây là một **mismatch nghiêm trọng tại profile 1836**: dữ liệu hiện ghi “Alauddin Muhammad Da'ud Syah I, since=1823”, không khớp với chuỗi tên/tước hiệu mà Leyten dẫn. Cần kiểm tra bản gốc và các nguồn Aceh trước khi quyết định chuẩn hóa tên, không tự đổi profile trong R4b.

### MER — Merina Kingdom of Madagascar
- Ranavalona I trị vì 1828–1861; Radama II kế vị nhưng bị giết trong cuộc đảo chính năm 1863; sau đó là Rasoherina (1863–1868), Ranavalona II (1868–1883), Ranavalona III (1883–1896).
- Gwyn Campbell mô tả Rainilaiarivony nắm vai trò effective ruler với tư cách Prime Minister, kết hôn lần lượt với các nữ hoàng. Vì vậy phải có dòng office riêng cho Prime Minister/de facto chief executive và dòng Queen/monarch.
- Phải phân biệt chiến tranh/áp lực Pháp, protectorate 1885, annexation/colony proclamation năm 1896 và registry entity end 1897-02-28. Các mốc này cần nguồn pháp lý/ngoại giao trước khi gắn vào polity transition.

### NDE — Ndebele kingdom
- Mzilikazi mất tháng 9/1868. Mncumbathe/Umcumbata làm regent trong giai đoạn kế vị; Lobengula được cài đặt tháng 2/1870 sau tranh chấp liên quan đến claim của Nkulumane và các phe ủng hộ.
- Government of South Africa nêu vai trò regent của Mncumbathe và Lobengula tiếp quản sau hai năm; nghiên cứu Springer 2024 thảo luận sự mơ hồ và tranh chấp quanh heir-designation, còn bài Rhodesiana nêu ngày installation February 1870.
- Cần tránh viết một đường kế vị “êm”: đây là interregnum/contested succession rồi consolidation. Việc vương quốc kết thúc trong chiến dịch Matabele 1893–1894 cần thêm source chronology và phân biệt military conquest với legal colonial incorporation.

## 3. Mô hình dữ liệu rút ra

1. `from` không thể mặc định luôn là ngày lên ngôi: có thể là ngày được tuyên bố, ngày cài đặt, ngày regent nắm thực quyền, ngày đăng quang hoặc ngày quyền lực có hiệu lực.
2. Một polity có thể có nhiều timeline đồng thời: ruler/regent/prime minister/guardian/Resident/claimant.
3. Một người có thể có danh xưng chính thức nhưng không kiểm soát toàn lãnh thổ (Aceh, Nejd, Herat).
4. Interregnum, foreign occupation, civil war, annexation, protectorate và suzerainty phải là trạng thái/event riêng, không phải end_reason của một ruler đơn lẻ.
5. Khi ngày trong calendar gốc có độ bất định, chỉ dùng year/month precision; ghi rõ lịch gốc, cách quy đổi, source confidence.
6. Không biến một historical source có góc nhìn colonial/missionary thành chân lý duy nhất; đối chiếu với nguồn địa phương, triều đình, biên bản, oral history hoặc nghiên cứu hiện đại.

## 4. Phạm vi chưa khép lại

R4b nghiên cứu 15/54 profile không có array. Các profile còn thiếu khác, 439 records đang có, các vùng chưa có trong tranche, các political-entity transitions, map/territory, population/economy/military, và 1901–1936 timeline đều còn backlog. Đây không phải tuyên bố hoàn tất toàn cầu.

**R4b disposition:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.
