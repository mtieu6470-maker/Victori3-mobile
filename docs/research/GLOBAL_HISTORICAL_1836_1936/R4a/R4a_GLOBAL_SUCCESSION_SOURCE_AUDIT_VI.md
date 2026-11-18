# R4a — Kiểm toán nguồn và chuỗi kế vị toàn cầu, đợt ưu tiên 01

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Base SHA:** `e7282de0e3b6aeb4ef81d28cd006c59d63b4c314`  
**Ngày:** 18/11/2026  
**Phạm vi:** 13 polity thuộc châu Mỹ, châu Âu, Bắc Phi, Tây Á, Nam Á, Đông Á, Đông Nam Á và châu Phi hạ Sahara  
**Disposition:** `DOCUMENTATION_ONLY / SELF_AUDIT / READY_FOR_INDEPENDENT_REVIEW / NO_PRODUCT_PATCH`

## 1. Mục tiêu và giới hạn

Đây là đợt nghiên cứu ưu tiên đầu tiên sau khi chủ dự án xác nhận phạm vi là **toàn thế giới**. Đợt này kiểm tra 13 trường hợp có giá trị kiểm chứng cao, bao gồm:
- kiểm toán nguồn của các chuỗi đang có;
- so sánh ngày nhiệm kỳ với nguồn lưu trữ, chính phủ, thư viện quốc gia và nghiên cứu học thuật;
- phát hiện những chuyển giao lâm thời, nhiếp chính, chức vụ song song, gián đoạn hoặc tranh chấp mà chuỗi “một nguyên thủ kế tiếp một nguyên thủ” có thể làm sai lịch sử;
- phân loại bước nghiên cứu cần làm tiếp cho 54 profile chưa có succession array.

**R4a không hoàn thành toàn bộ 439 bản ghi hoặc 54 profile thiếu.** Đây là một lát cắt ưu tiên; tất cả đề xuất sửa dữ liệu vẫn đang chờ review độc lập. Không sửa `historical_data/`, schema, engine, sự kiện hoặc tests.

## 2. Các phát hiện quan trọng có bằng chứng

### USA — ngày chuyển giao quyền tổng thống năm 1841

Repository hiện ghi William Henry Harrison kết thúc ngày 4/4/1841 và John Tyler bắt đầu cùng ngày. National Archives có bảng ghi Tyler giữ chức từ 6/4, trong khi một tài liệu NARA khác ghi thời điểm tổng thống kế nhiệm từ 4/4; hồ sơ bầu cử NARA ghi Harrison mất ngày 4/4 và Tyler tuyên thệ ngày 6/4. Do đó đây không thể giải quyết bằng cách đơn giản đổi một ngày: cần phân biệt **ngày tổng thống tiền nhiệm mất / quyền kế nhiệm theo hiến pháp / ngày tuyên thệ**. R4a đề nghị giữ trạng thái tranh chấp ngữ nghĩa, không patch ngày.

### Mexico — thiếu các tổng thống lâm thời và có khác biệt về ngày bàn giao

33/33 record hiện có trong `MEX` chỉ trích Wikipedia. Tài liệu của Cámara de Diputados (2016) ghi Nicolás Bravo làm tổng thống lâm thời 11–17/7/1839 và Anastasio Bustamante trở lại ngày 18/7; chuỗi hiện tại bỏ Bravo và bắt đầu Bustamante ngày 19/7. Phụ lục học thuật của Instituto de Investigaciones Históricas, UNAM có ngày khác ở một số mốc (ví dụ Bravo 10–19/7 và Bustamante 19/7), nên đây là **xung đột ngày cần giải thích**, không phải giấy phép chọn tùy ý.

Cùng nguồn UNAM ghi Francisco Javier Echeverría làm tổng thống từ 22/9–10/10/1841 và José Joaquín de Herrera 12–21/9/1844; hai khoảng này không xuất hiện trong chuỗi hiện tại. Phải phân biệt tổng thống lâm thời, chủ tịch hội đồng hành pháp và tổng thống được hiến pháp công nhận; một dòng “president” đơn giản có thể che giấu nhiều dạng thẩm quyền.

### Brazil — Emperor và Regency là hai lớp quyền lực

Library of Congress xác nhận Brazil được điều hành bởi Regency từ 1831 đến 1840, dù Pedro II là hoàng đế trong thời kỳ đó; chế độ quân chủ kết thúc ngày 15/11/1889. Record hiện tại của Pedro II kéo từ 7/4/1831 tới 15/11/1889, điều này có thể hợp lý cho **ngôi hoàng đế**, nhưng profile ghi chú riêng một regent và không thể hiện toàn bộ hệ thống Regency. Cần nghiên cứu ba giai đoạn Regency và phân biệt người giữ ngôi với cơ quan/nhân vật thực thi chính quyền.

### Nhật Bản — Shogun và Thiên hoàng không phải một chức vụ

Chuỗi `JAP` đang nối các Tokugawa Shogun từ Ienari tới Yoshinobu rồi chuyển sang Emperor Meiji, trong khi profile 1836 đã ghi Emperor Ninkō ở trường riêng. National Diet Library xác nhận Yoshinobu là Shogun thứ 15, trở thành Shogun năm 1866 và hoàn trả quyền chính trị cho Thiên hoàng năm 1867; bảng thời gian NDL ghi lệnh khôi phục chính quyền Hoàng gia và sự hình thành chính quyền Meiji ngày 3/1/1868 (theo lịch được NDL trình bày). Không được xem đây là một chuỗi kế vị duy nhất: cần ít nhất hai lớp **Bakufu/Shogunate** và **Imperial office**, rồi một mốc thay đổi chế độ/thực quyền.

### Qing — hoàng đế, nhiếp chính và sự chấm dứt của triều đại

Bộ bốn Daoguang–Xianfeng–Tongzhi–Guangxu có nền tảng từ Spence, nhưng record Tongzhi phải được đọc như hoàng đế dưới đồng nhiếp chính Cixi và Ci'an. Smithsonian ghi Cixi lựa chọn Guangxu sau khi Tongzhi chết năm 1875; năm 1908 Guangxu và Cixi qua đời, Puyi được chọn làm Xuantong. Cần nối Xuantong tới thoái vị 1912, nhưng **không** kéo chuỗi Qing sang Manchukuo sau 1932 như thể cùng một nhà nước.

### Qajar Persia — tách chỉ định kế vị, đăng cơ và đăng quang

Encyclopaedia Iranica (Jean Calmard) cho biết Moḥammad Mirzā được xác nhận làm nāyeb-al-salṭana ngày 20/6/1834; cha ông mất ngày 24/10/1834; ông được tuyên xưng làm Shah ở Tabriz ngày 9/11/1834 và đăng quang ngày 14/1/1835. Hồ sơ hiện tại dùng `from=1834-10-23` trong profile và succession array. Không thể tự động coi ngày cha mất, ngày được chỉ định, ngày được tuyên xưng và ngày đăng quang là một ngày. Đây là finding cần rà lại định nghĩa trường `from` trước khi patch.

### Ottoman — nguồn hiện có không đủ để bảo vệ ngày chính xác

Cả 5 record Ottoman trong `TUR` đều không có nguồn riêng cấp record và thừa hưởng nguồn mặc định của file. TDV İslâm Ansiklopedisi (Cevdet Küçük, 1988) ghi Abdülmecid lên ngôi ngày 1/7/1839. Bài chuyên khảo về regnal years của Ottoman Numismatic Society ghi Mahmud II mất ngày 3/7/1839. Hai mốc hiện không khớp với `to=1839-07-01` trong dữ liệu hiện có. Cần đối chiếu lịch Hijri/Gregorian và nguồn triều đình; không tự chọn một trong hai.

### Sokoto — chuỗi hiện tại có đủ tên nhưng thiếu provenance đáng tin cho ngày chính xác

10/10 record hiện tại trong `SOK` chỉ trích Wikipedia, trong khi profile có nguồn Last (1967). Một biểu đồ phả hệ trong A. C. Burns, *History of Nigeria* (1929), cùng một bài nghiên cứu 2014 có dẫn nguồn History and Culture Bureau Archives, Sokoto, hỗ trợ trật tự và niên đại theo **năm**: Bello (1817–1837), Abubakar Atiku (1837–1842), Aliyu Babba (1842–1859), Ahmadu Atiku (1859–1866), Aliyu Karami (1866–1867), Ahmadu Rufai (1867–1873), Abubakar II (1873–1877), Mu'azu (1877–1881), Umaru (1881–1891), Abd al-Rahman (1891–1902). Chưa đủ chứng cứ ở đợt này để giữ các ngày/ngày-tháng chính xác trong bản ghi hiện tại.

### Zulu — thừa kế, kiểm soát thực tế, ngôi vua và chủ quyền bị chia cắt

ODNB cho biết Cetshwayo có sự công nhận là người kế vị từ 1861 và tăng quyền kiểm soát sau 1856, nhưng chỉ chính thức trở thành vua khi Mpande chết năm 1872. Sau chiến tranh 1879, ông bị lưu đày; năm 1883 được phục vị trên lãnh thổ bị thu hẹp; ông chết năm 1884. ODNB về Dinuzulu mô tả chiến tranh nội bộ và tình trạng nguy hiểm đối với người kế vị. Vì vậy không được mô hình hóa đoạn 1879–1884 thành một nhiệm kỳ liên tục, không gián đoạn, kiểm soát toàn bộ vương quốc.

### Asante — có interregnum và chiến tranh triều đại

Manhyia Records Office liệt kê Kwaku Duah (1834–1867), Kofi Karikari (1867–1874), Mensah Bonsu (1874–1883), Kwaku Duah II năm 1884 (40 ngày), rồi Kwaku Duah III/Agyeman Prempeh I (1888–1931). Một chương Oxford/British Academy về *History of Ashanti* mô tả chiến tranh dân sự và triều đại 1883–1888; nghiên cứu của Cambridge nhấn mạnh sự kiện phế truất Prempeh và cuộc chiếm đóng của Anh năm 1896. Khoảng 1883–1888 không được lấp bằng một dãy vua giả định. Cần mô hình interregnum, tranh chấp và quyền lực thuộc địa/Crown Colony từ 1901 tách khỏi chức Asantehene.

### Morocco — Sultan, regent và protectorate phải tách nhau

Cambridge University Press (Susan Gilson Miller) ghi ʿAbd al-Rahman mất năm 1859, Muhammad IV trị vì 1859–1873, Hassan I 1873–1894. Sau khi Hassan I mất, con trai 14 tuổi ʿAbd al-ʿAziz lên ngôi dưới quyền nhiếp chính Ahmad ibn Musa (Ba Ahmad). Không thể gộp regent thành Sultan hoặc bỏ vai trò của ông. Cần nghiên cứu thêm tranh chấp 1908–1912 và sự phân tầng quyền lực khi protectorate bắt đầu; chưa có cơ sở trong R4a để viết toàn bộ các mốc này thành dữ liệu chính xác.

### Wallachia và Moldavia — hai ngôi thân vương và một lớp bảo hộ/chiếm đóng

Nghiên cứu của Babeș-Bolyai mô tả Organic Regulations của hai công quốc có hiệu lực 1834–1856; bài nghiên cứu của National Archives of Romania về Alexandru Dimitrie Ghica căn cứ vào hồ sơ lưu trữ đương thời, đặt lễ đăng cơ của ông tại Wallachia vào tháng 10/1834; nghiên cứu tại Bucharest ghi Mihail Sturdza được Ottoman Porte bổ nhiệm làm hoàng thân Moldavia ngày 22/3/1834 và cai trị tới 13/1/1849. Hai công quốc là hai chức vụ địa phương khác nhau trong bối cảnh Ottoman suzerainty và Russian protectorate/occupation; không được gom chúng thành một “Romanian ruler” liên tục từ 1836.

## 3. Kết luận theo tiêu chuẩn Historical Mode

1. Không giữ ngày chính xác chỉ vì nó đang nằm trong JSON. Ngày phải có nguồn và phải nói rõ đang ghi ngày nào của một transition.
2. Một polity có nhiều cấp quyền lực cần nhiều role/time-series; không nhét regent, governor, head of state và sovereign vào cùng một trường.
3. Polity giải thể, bị sáp nhập hoặc mất chủ quyền trước năm 1936 phải được kết thúc đúng lịch sử; timeline kế tiếp có thể thuộc một polity/state ID mới.
4. Interregnum, civil war, dual government, succession contest và foreign occupation phải được biểu diễn như trạng thái lịch sử, không lấp khoảng trống bằng leader sinh tự động.
5. Các record có nguồn tốt vẫn cần kiểm tra date precision và cross-dataset consistency; có citation không đồng nghĩa toàn bộ ngày/role đã chính xác.

## 4. Phạm vi dữ liệu chưa giải quyết

- 13 dossier trong ma trận R4a là tranche ưu tiên, không phải toàn bộ thế giới.
- 54 profile thiếu array đã được phân loại trong `GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv`; nhiều trường hợp cần timeline cơ quan/collective authority thay vì ruler list cá nhân.
- 439 record cũ chưa được tái xác minh từng mốc; R4a chỉ rà soát sâu một phần.
- Timeline 1901–1936 còn cần làm theo từng polity còn tồn tại, đồng thời đóng timeline những polity đã mất/đổi chủ thể trước 1936.
- Mọi source conflict nêu trên vẫn để mở; không thực hiện patch lịch sử trong R4a.

## 5. Artifacts và trạng thái

- `R4a_SOURCE_EVIDENCE_MATRIX.csv`: 13 dossier xuyên nhiều khu vực.
- `R4a_PATCH_DECISIONS.csv`: quyết định nghiên cứu và đề xuất cần xác minh; không phải patch được chấp thuận.
- `R4a_OPEN_EVIDENCE_REQUESTS.csv`: mốc/role/provenance chưa đóng.
- `R4a_SOURCE_REGISTRY_DELTA.csv`: nguồn mới, URL và vai trò chứng cứ.
- `GLOBAL_HOS_MISSING_PROFILE_TRIAGE_R4a.csv`: phân luồng toàn bộ 54 profile thiếu array.
- `docs/audit/s0/GLOBAL_R4A_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md`: yêu cầu review không ghi.
- `GITHUB_INTEGRATION_RECEIPT_R4a.md`: receipt và kiểm định cấu trúc.

**R4a status:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`. Không tuyên bố Claude REVIEW_PASS, owner acceptance hoặc S1.
