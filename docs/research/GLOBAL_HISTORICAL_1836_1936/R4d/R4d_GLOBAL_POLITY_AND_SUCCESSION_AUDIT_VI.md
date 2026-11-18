# R4d — Kiểm toán chính thể toàn cầu và chuỗi kế vị, đợt 04

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base HEAD:** `f0745f1fd1eb381434cba4aa8576b3c2271d8732`  
**Phạm vi:** 15 profile cuối của queue succession ban đầu, trải từ châu Phi, châu Âu, châu Mỹ và Đông Nam Á.  
**Khoảng chiến dịch:** 1836–1936  
**Trạng thái:** `DOCUMENTATION_ONLY / SELF_AUDIT / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

## 1. Tổng quan

R4d nghiên cứu 15 profile còn lại trong queue 54 profile thiếu succession array ban đầu: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI và SUL. Không phải tất cả đều có thể được mô hình hóa bằng một dòng nguyên thủ quốc gia; một số cần tách vua danh nghĩa và nhiếp chính, Shehu và Mai, thuộc địa ACS và Commonwealth, hoặc chính phủ lâm thời và chính thể tuyên bố độc lập.

R4d cũng kèm một **Victoria 3 feature-parity audit** theo yêu cầu chủ dự án. Phạm vi đối chiếu không chỉ là danh sách tính năng mà là quan hệ nhân quả giữa Pop, công việc, tiền lương, nhu cầu, building, hàng hóa, thị trường, ngân sách, nhóm lợi ích, luật, ngoại giao, chiến tranh, công nghệ và sự kiện. Tài liệu dùng Victoria 3 1.15.1 / State and Revolution (11/11/2026) làm mốc tham chiếu công khai tại ngày kiểm tra, đồng thời phân biệt tính năng base game với content pack/DLC.

## 2. Các phát hiện lịch sử quan trọng

### ETH — Ethiopian Empire / Zemene Mesafint
Ras Ali II của triều Yejju giữ quyền điều hành thực tế và là nhiếp chính/kingmaker, nhưng không đồng nhất với ngôi Negusä Nägäst. Sahle Dengel là hoàng đế danh nghĩa trong các giai đoạn 1832–1840; sau đó Yohannes III và Sahle Dengel luân phiên trên ngôi. Tại 01/01/1836, evidence tốt hơn ủng hộ Sahle Dengel là hoàng đế danh nghĩa trong khi Ras Ali II nắm quyền thực tế. Profile hiện chỉ ghi Ras Ali II là HOS, khiến vai trò của hoàng đế bị bỏ khỏi mô hình. Tigray dưới Dejazmach Wube cũng có quyền tự trị de facto; không được giả định Ras Ali kiểm soát toàn bộ đế quốc như nhà nước tập quyền.

### BOR — Bornu
Mốc mất của Muhammad al-Amin al-Kanemi đang có xung đột nguồn: Bosworth đặt năm 1835, trong khi mục *Encyclopaedia of Islam* ghi 1837. Vì vậy chưa thể kết luận ông chắc chắn đã mất trước snapshot 01/01/1836. Bosworth đồng thời liệt Umar ibn Muhammad Amin là Shehu de jure từ 1835; cần xác minh đây là chuyển giao quyền lực, tước vị kế vị hay đồng tồn tại với al-Kanemi trong giai đoạn cuối. Mai Ibrahim IV Lefiami vẫn giữ ngôi Sayfawa danh nghĩa đến 1846. Profile hiện ghi al-Kanemi từ 1814; cần rà lại quan hệ giữa al-Kanemi, Umar (Shehu) và Mai thay vì tự động xóa một trong các vai trò. Mô hình tối thiểu phải hỗ trợ hai tầng Mai/Shehu và có thể phải hỗ trợ chồng lấn quyền lực.

### WAD — Wadai
Không thể đặt một ngày kế vị chính xác duy nhất cho Muhammad Sharif dựa trên nguồn hiện có. Wadai trải qua nội chiến sau khi Sabun chết; Kolak Adam được liệt kê trong một số chronology cho giai đoạn 1834–1843, trong khi Muhammad Sharif kiểm soát ngày càng lớn từ 1830 và nắm quyền trực tiếp khoảng 1835; một nguồn học thuật về Wadai nói Darfur chỉ chính thức can thiệp và đặt Muhammad Sharif lên ngôi năm 1838 để đổi lấy cống nạp. Vì vậy cần phân biệt người giữ tước hiệu, quyền lực de facto, người được Darfur bảo trợ và thời điểm formal enthronement. Profile hiện ghi Muhammad Sharif từ 1835 có thể mô tả effective control, nhưng không đủ để coi là ngày accession đã được xác minh.

### DAR — Darfur
Muhammad al-Fadl trị vì 1803–1838; con trai Muhammad al-Husayn kế vị 1838–1873; Ibrahim Qarad nắm ngôi 1873–1874 trước cuộc chinh phục của al-Zubayr Pasha. Cambridge chronology ghi rõ mốc 1803–38 và 1838–73. Darfur bị chinh phục năm 1874, nằm dưới chế độ Turco-Egyptian/Mahdist, sau đó Ali Dinar phục hồi Sultanate năm 1898 và trị vì đến 1916. Vì vậy timeline 1874–1898 không được lấp bằng một danh sách sultan liên tục; cần biểu diễn occupation, Mahdist authority và restoration.

### DAH — Dahomey
Ghezo trị vì 1818–1858; con trai Badahun lên ngôi với tên Glele năm 1858; Béhanzin 1889–1894; Agoli-Agbo 1894–1900. Nghiên cứu Robin Law cho thấy Glele đã được chỉ định làm heir ít nhất chín năm trước khi Ghezo mất, nhưng succession vẫn bị thách thức. Không nên nhầm heir designation với accession. Chuỗi sau năm 1892 phải gắn với chiến tranh Pháp–Dahomey và kết thúc quyền lực quân chủ thực tế.

### OYO — Oyo và các chính thể Yoruba kế tiếp
Đây không còn là một nhà nước thống nhất vào đầu 1836. Robin Law mô tả Old Oyo bị đánh bại hoàn toàn khoảng 1836 và thủ đô bị bỏ hoang; sau đó Oyo tái lập ở phía nam (New Oyo) với Atiba được các trưởng lão/chiến binh công nhận là Aláàfin. Các thế lực khác như Ilorin, Ibadan, Ijaye và Abeokuta phát triển thành các trung tâm quyền lực riêng. Entity hiện có một khoảng 1835–36 collapse nhưng lại kéo dài tới 1896, dễ tạo ảo giác về một polity duy nhất. Cần tách Old Oyo, New Oyo và các Yoruba states hoặc dùng aggregate container không có một chuỗi HOS chung.

### MAS — Massina / Diina of Hamdullahi
Seku Amadu (Ahmadu Lobbo) sáng lập và cai trị từ 1818 đến 1844/1845; nguồn hiện mâu thuẫn về năm mất (nguồn museum mô tả 20/4/1845 nhưng cũng ghi một nguồn khác là 1844). Con trai Amadu II kế vị khoảng 1845 đến 1852/1853; cháu Amadu III tiếp tục đến cuộc xâm lược của Umar Tall năm 1862. Không ép ngày mất thành ngày chính xác cho đến khi đối chiếu Tombouctou manuscripts và nguồn Fulfulde/Arabic. Cần tách danh hiệu Almami với mô tả "Caliph" nếu nguồn đương thời dùng khác.

### FJA — Futa Jallon
Imamate có cơ chế kế vị cạnh tranh giữa hai nhánh Alfaya (hậu duệ Karamokho Alfa) và Soriya (hậu duệ Ibrahim Sori). Tranh chấp/đảo chính/nội chiến kéo dài; thỏa thuận luân phiên hai năm giữa hai nhánh được chuẩn hóa trong thập niên 1840, thường gắn với mốc 1845. Không đủ bằng chứng được kiểm tra trong R4d để chốt chính xác Almami đang giữ chức vào đúng 01/01/1836. Không được tự chọn một cái tên từ danh sách ruler thứ cấp vốn phần lớn truy ngược Wikipedia. Mô hình phải hỗ trợ quyền lực song song/ứng viên kế vị, Almami được cài đặt tại Fugumba và các thủ lĩnh tỉnh có tự chủ thực tế.

### LIB — Liberia Colony / Commonwealth / Republic
Năm 1836 chưa có Cộng hòa Liberia độc lập. Settlement nằm dưới American Colonization Society (ACS) và các tổ chức thuộc địa thành viên; việc tập hợp thành Commonwealth of Liberia với constitution/gov appointed diễn ra 1838–1839. Thomas Buchanan được ACS bổ nhiệm Governor và nhận chức tại Monrovia ngày 4/4/1839; Joseph Jenkins Roberts là lieutenant governor, trở thành quyền Governor sau khi Buchanan chết năm 1841 và được bổ nhiệm governor từ 1842. Liberia tuyên bố độc lập 26/7/1847, Roberts được chọn làm president vào tháng 10/1847 và nhậm chức tháng 1/1848. Cần phân biệt ACS Board (overlord/appointing authority), agents/superintendents, Governor của Commonwealth và President của Republic.

### BUG — Buganda
Suna II (Kalema Ssuuna II) là Kabaka tại snapshot 1836; một số chronology ghi 1832–1856, hồ sơ UNESCO ghi 1836–1856 và cho biết các reign dates chỉ được biết tương đối chắc từ Suna II. Muteesa I kế vị năm 1856 và trị vì đến 1884. Vì vậy profile `since=1832` là một nguồn tranh chấp có thật, không nên đổi ngày mà không ghi alternative. Nội bộ Buganda có các chức vụ Katikkiro, chiefs và clan authorities; Kabaka không đồng nghĩa với một bộ máy tập quyền hiện đại.

### TEX — Texas provisional government
Henry Smith được bầu Governor năm 1835. Ngày 11/1/1836 General Council đình chỉ Smith và tuyên bố James W. Robinson là Acting Governor; Smith từ chối rời chức, dẫn tới hai người cùng tuyên bố quyền lực. Chính phủ lâm thời gần như tan rã trong tháng 2/1836. Convention ban hành Declaration of Independence ngày 2/3/1836, lập ad interim government do David G. Burnet đứng đầu, vận hành từ tháng 3 đến tháng 10/1836; Sam Houston nhậm chức President ngày 22/10/1836. Profile hiện gán Henry Smith liên tục từ 1835 mà không phản ánh tranh chấp và chuyển đổi chế độ.

### CAF — Federal Republic of Central America
Francisco Morazán là President của federation, nhưng federation trên thực tế có cấu trúc gần confederation, các bang thành viên có chủ quyền đáng kể trong lãnh thổ mình. Morazán làm President 1830–1834 rồi lại giữ nhiệm kỳ 1835–1839. Nội chiến, xung đột giữa Guatemala và các bang, cùng sự ly khai làm federation tan rã trong 1838–1841. Cần tách Federal President, các bang thành viên, chính quyền ly khai và việc dissolution; không xem Morazán là người cai trị thống nhất từng bang.

### RGS — Riograndense Republic / Farroupilhas
Cuộc nổi dậy bắt đầu năm 1835, nhưng Cộng hòa Rio-Grandense chỉ tuyên bố ngày 11/9/1836. Bento Gonçalves được bầu interim President sau tuyên bố; ông bị bắt trong chiến tranh và các cơ quan lâm thời/commander vẫn hoạt động. Sau đó ông từ chức tháng 8/1843; José Gomes de Vasconcelos Jardim kế nhiệm, và Treaty of Ponche Verde chấm dứt nền cộng hòa vào tháng 2/1845. Profile hiện bắt đầu Bento từ 20/9/1835, tức là trộn thời kỳ rebel provincial movement với chính thể cộng hòa chưa được tuyên bố.

### HAI — Haiti
Jean-Pierre Boyer là President for Life từ 30/3/1818 tới khi từ chức ngày 13/3/1843. Cách mạng Praslin và quân đội phía Nam chiếm Port-au-Prince; ngày 24/3/1843 có tuyên cáo phế truất. Charles Hérard dần nắm vị trí điều hành của chính phủ lâm thời trong tháng 4; ông chỉ tuyên thệ President tháng 1/1844. Vì vậy không thay Boyer bằng Hérard ngay cùng một ngày, và không gọi Hérard là tổng thống chính thức từ tháng 3/1843 nếu chưa phân biệt provisional executive. Occupation of Santo Domingo kết thúc năm 1844 và làm thay đổi phạm vi lãnh thổ của Haiti.

### SUL — Sultanate of Sulu
Jamalul Kiram I trị vì 1823–1842 theo nghiên cứu genealogy của Cesar Adib Majul; một số genealogy hoàng tộc hiện đại ghi kết thúc 1844. Pulalun/Muhammad Fadl Kiram kế vị khoảng 1842/1844–1862; Jamalul A'lam 1862–1881. Đây là tranh chấp ngày chuyển giao phải giữ trong evidence matrix. Sulu có quyền lực hàng hải và mạng lưới tributary/vassal ở Sulu Archipelago, North Borneo và các vùng lân cận; quan hệ với Tây Ban Nha, Anh và Brunei không thể giản hóa thành kiểm soát toàn bộ lãnh thổ như chủ quyền quốc gia hiện đại. Cần nghiên cứu thêm Carpenter Agreement 1915 và địa vị Sultan đến 1936.

## 3. R4d kết luận

- 15/15 profile đã có dossier nghiên cứu; không có succession array nào được tạo.
- Các điểm nghiêm trọng nhất: BOR head-of-state hiện tại đã mất trước snapshot; ETH cần hai lớp Emperor/Regent; WAD cần phân biệt effective power và formal enthronement; TEX có dual claimant; OYO không còn là một polity đơn nhất; RGS chưa tuyên bố republic ở 1835; LIB còn là thuộc địa của ACS, chưa phải quốc gia độc lập.
- Các chronology có độ precision year-level hoặc conflicting year/month phải được giữ như vậy.
- MAO và MLY còn lại trong 54-profile triage là hai aggregate/decentralized units, cần nghiên cứu component polity/council, không gắn một ruler chung.

## 4. Giới hạn

R4d kiểm toán succession/authority, không xác nhận toàn bộ 1901–1936 chronology, border history, demographic data hay toàn bộ nguồn. Nhiều nguồn được đọc ở dạng abstract, institutional chronology, searchable text hoặc bibliography; source registry ghi rõ cấp độ truy cập. Các quyết định sửa live data đều chờ Claude review và owner gate.

**R4d status:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.
