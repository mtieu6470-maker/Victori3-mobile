# H01 Batch 02 — gói tích hợp nghiên cứu R3aa

**Trạng thái R3ab:** `READY_FOR_INDEPENDENT_REVIEW / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`  
**Gói review cho Claude:** [H01 R3ab — Claude Independent Review Request](../../audit/s0/H01_R3AB_CLAUDE_INDEPENDENT_REVIEW_REQUEST_2026-11-18.md)

> **Điểm vào khi Claude kết nối GitHub:** mở review request ở đường dẫn trên trước. Review đúng HEAD mới nhất của nhánh `claude/game-historical-sandbox-modes-kg7rj7`, dùng base SHA và danh sách file được ghi trong request. Kết quả tự kiểm của ChatGPT không phải independent `REVIEW_PASS`.

**Trạng thái H01 tích hợp:** `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`.

Đây là gói tích hợp tài liệu nghiên cứu H01 lên repository Victori3-mobile, không phải bản cập nhật dân số chạy trong game.

## Thành phần
- `H01_INTEGRATED_AUDIT_REPORT_VI.md`: quyết định tổng hợp cho 17 entity và các tranh chấp về phạm vi dân số/quyền lực.
- `H01_INTEGRATED_17_ENTITY_RECONCILIATION.csv`: đối chiếu profile với tổng dân số vùng ánh xạ và trạng thái quyết định.
- `H01_REGION_SCOPE_AND_CONTROL_FLAGS.csv`: tách ánh xạ kỹ thuật khỏi chủ quyền lịch sử cho OYO, NDE, LIB và DZ_KRU.
- `H01_INTEGRATED_SOURCE_REGISTRY_DELTA.csv`: metadata nguồn bổ sung và locator được hiệu chỉnh; không ghi đè source registry đang chạy.
- `H01_OPEN_EVIDENCE_AND_ACCEPTANCE_REQUESTS.csv`: chứng cứ còn thiếu và cổng phê duyệt.
- `H01_VALIDATION_REPORT.md`: kiểm tra cấu trúc/số học và giới hạn kiểm định.
- `H01_REPO_INTEGRATION_MAP.md`: ranh giới tích hợp và các tệp runtime cố ý không thay đổi.

## Kết luận ngắn
- OYO 650k và OYO_OYO 1.45m: chưa đủ căn cứ định lượng; cách ly, không thay số.
- NDE 60k: có thể mô tả là ước lượng dân số polity do Mzilikazi lãnh đạo trong thập niên 1830, không phải lõi sắc tộc; khoảng 45k–85k chưa xác minh.
- NDE_MOS 210k: vùng địa lý rộng, không phải dân số được Ndebele trực tiếp cai trị.
- LIB 3,500 + 100: chưa xác minh; ACS 2,230 (chuỗi Liberia năm 1836) và Freeman ~1,500 (Monrovia khoảng 1837) khác phạm vi/ngày, không thể thay trực tiếp.
- DZ_KRU 356,400 là phần dư số học, không phải census.

## Giới hạn
Không sửa population benchmark, profile, registry, map owner, engine/runtime, save schema, assets, Android, workflow hoặc APK. S1 vẫn chưa bắt đầu theo handoff hiện hành. Cần independent Claude review và owner gate riêng trước khi nâng trạng thái.


## R3u — cập nhật nguồn mới
- Lye (1969) làm rõ 60k–80k là ước lượng subject population của polity Mzilikazi, không phải ethnic Ndebele core; 1k–5k là lực lượng chiến binh Nguni năm 1836.
- Hassell (1866) ghi 3.5k emigrants trong toàn Liberia năm 1838, không phải Monrovia năm 1836. Shick và Starr cung cấp các chuỗi arrival/population movement khác phạm vi.
- Không có số tranh chấp nào được đưa vào dữ liệu gameplay. Xem `H01_R3u_SUPPLEMENTAL_SOURCE_AUDIT_VI.md`.


## R3v — đối chiếu chuỗi nguồn Liberia
- Starr (1913) ghi 2.230 ở cột Pop. năm 1836 trong bảng immigrant vital statistics toàn Liberia (loại Maryland), không phải Monrovia census hoặc tổng cư dân bản địa. Bảng có anomaly số học ở 1834.
- Shick (1971) sử dụng individual ACS emigrant register: 242 arrivals năm 1836 và 4.571 arrivals toàn kỳ; Starr ghi 209 arrivals năm 1836. Khác biệt chuỗi đã xác nhận, chưa hòa giải.
- Freeman, được Hiller (1860) dẫn lại, ước lượng Monrovia khoảng 1.500 năm 1837; đây là quotation thứ cấp, không phải census. Roster Monrovia September 1843 mới chỉ tìm được dưới dạng transcription, chưa xác minh ảnh gốc và coverage.
- LIB 3.500 / LIB_MON 3.600 / +100 vẫn quarantine; DZ_KRU 356.400 vẫn là phần dư số học có điều kiện. Xem `H01_R3v_LIBERIA_PRIMARY_SERIES_RECONCILIATION_VI.md` và các CSV R3v.


## R3w — kiểm tra trích dẫn định lượng Oyo và niên đại chuyển tiếp
- Asiwaju (1989), đúng chương và trang in 704 mà Butcher & Griffiths dẫn, mô tả lõi Oyo, vùng nộp cống và các cấp độ ảnh hưởng/tự trị khác nhau; bản văn tra cứu được không có số dân 750.000. Dẫn chiếu >750k qua Asiwaju p.704 chưa được xác nhận, không đồng nghĩa đã chứng minh con số sai.
- Asiwaju đặt collapse khoảng 1835; Lovejoy (UCLA PhD, 2012) mô tả Old Oyo và vùng phụ cận bị bỏ hoang/phá hủy khoảng 1836, sau đó hình thành liên minh người Oyo lưu tán tại Ago Oja.
- Morton-Williams (1967, p.45) đặt lễ tấn phong chính thức Atiba làm Alafin ở Ago Oja khoảng 1838; Johnson (1921, pp.279–280) kể việc lên ngôi sau khi kinh đô cũ sụp đổ nhưng không chốt năm trong đoạn đó.
- Cần tách collapse/displacement (c.1835–36), liên minh người tị nạn ở Ago Oja, và formal ritual installation/reconstitution (c.1838). Không chiếu ngược một New Oyo đã củng cố đầy đủ về ngày 1836-01-01.
- OYO 650k, OYO_OYO 1.45m và claim >750k vẫn cách ly; không thay dữ liệu game. Xem `H01_R3w_OYO_CITATION_AND_TRANSITION_AUDIT_VI.md` và bộ CSV R3w.


## R3x — NDE: population universe và truy vết Rasmussen
- Lye (1969, pp.96–97) gọi 60k–80k là ước lượng rộng cho subject population của polity Mzilikazi, gộp Nguni/Sotho, quân sự/nhóm bị khuất phục, tributary/vassal; người Sotho bản địa chiếm phần lớn. Không phải lõi sắc tộc Ndebele/Nguni.
- Cùng nguồn tách lực lượng chiến binh Nguni 1k–5k năm 1836 khỏi subject population; 10k–20k theo Mzilikazi qua Limpopo là dòng di cư khi rút lui về sau, không phải tổng dân số 1836.
- Delius (2010), trích Rasmussen 1978 pp.23–26, 90–94, ghi 300 người ban đầu, khoảng 20k là ước lượng đáng tin cậy nhất cuối thập niên 1820, nhưng một số nguồn cao gấp 3–4 lần; tác giả nhấn mạnh sai số lớn. Warren et al. (2014) lặp lại quỹ đạo 300→20k và việc tiếp nhận người Sotho-Tswana.
- NDE 60k chỉ giữ như provisional approximate polity-subject estimate; khoảng 45k–85k không có phương pháp interval được xác minh. NDE_MOS 210k vẫn là broad geography, không phải direct-control total.
- Xem `H01_R3x_NDE_POPULATION_AND_CONTROL_SCOPE_AUDIT_VI.md`, source matrix, patch decisions và open evidence requests.


## R3y — chính trị Oyo 1831–1836 và đơn vị dân số
- Lovejoy (2019) mô tả Ilorin mở rộng mạnh từ 1832; đến 1833 phần lớn đô thị Oyo quan trọng bị phá hủy hoặc khuất phục; Oyo/Bariba thử phục hồi năm 1834–35; Old Oyo bị bỏ hoang năm 1836, khi Abeokuta, Ilorin, Ibadan, New Oyo, Ijaye, Ijebu và Ife cạnh tranh quyền kiểm soát.
- Lovejoy nói ranh giới bản đồ là fuzzy/approximate; ngày 2/1 và 31/12 là timestamp phần mềm, không có giá trị lịch sử. Không thể dùng hàng GIS New Oyo năm 1836 để khẳng định nhà nước mới đã tồn tại đầy đủ đúng 1/1/1836.
- OYO 650k được mô tả theo refugee displacement nhưng không có refugee cohort count hay stock definition; OYO_OYO 1.45m là vùng rộng Oyo/Ibadan/Abeokuta nhưng không có workbook/subregional projection/polygon minh bạch. Hai đại lượng khác bản chất và đều cách ly.
- SSA_REG_18 đang map 100% sang OYO_OYO/OYO; đây chỉ là join kỹ thuật, không chứng minh chủ quyền trực tiếp trên toàn khu vực. Cần locality-by-locality ownership/control table trước mọi sửa map.
- 75k+ trong Lovejoy là người bị cưỡng bức lên tàu nô lệ xuyên Đại Tây Dương, không phải tổng dân số Oyo hay refugee count.
- Xem `H01_R3y_OYO_1831_1836_POLITICAL_GEOGRAPHY_AND_POPULATION_AUDIT_VI.md` và CSV R3y.


## R3z — đánh giá chất lượng Rasmussen
- P. J. Colenbrander, bài điểm sách đương thời về *Migrant Kingdom* (Rasmussen, 1978), ghi nhận giá trị của cuốn sách trong tái dựng sự kiện/địa điểm/ngày tháng nhưng cảnh báo bằng chứng khan hiếm, thiên về chiến tranh/di cư và chưa phân tích đủ cấu trúc kinh tế–xã hội/sinh hoạt thường nhật.
- Điều này không bác bỏ Rasmussen, nhưng bổ sung caveat khi dùng làm nguồn dân số, sức mạnh quân sự hoặc tốc độ tăng trưởng Ndebele.
- NDE 60k chỉ giữ là ứng viên polity-subject ước lượng rộng, độ bất định cao; 45k–85k không có phương pháp interval được chứng minh; các số 300, 20k, 60–80k subjects, 1–5k chiến binh và 10–20k di cư muộn vẫn là các đại lượng khác nhau.
- Xem `H01_R3z_RASMUSSEN_SOURCE_QUALITY_REVIEW_VI.md` và CSV R3z. Thông tin tập/số của tạp chí điểm sách và trang gốc Rasmussen vẫn cần lấy bản gốc.


## R3aa — NDE: đối chiếu các ước lượng năm 1829
- Chase (1830, tr.407) ghi Malacatzie có khoảng 80.000 người dưới quyền, gồm các nhóm Batow/Bichuana bị chinh phục và lệ thuộc; đây là báo cáo du hành, không phải census.
- Archbell có thư tháng 12/1829 kể gặp Mzilikazi tại Plaatberg; Ferreira (2025, tr.38) xác nhận cuộc gặp qua *Missionary Notices* VI, no.179, tr.356, nhưng đoạn đó không đưa số dân. Lye liên kết Archbell với Chase, song ngày và ký hiệu hộp lưu trữ chưa khớp; thư gốc chưa được đọc.
- Kruger (2010, tr.140) dẫn Rasmussen khoảng 20.000 người dưới quyền Mzilikazi ở vùng Rustenburg năm 1829, thấp hơn 60–80 nghìn gắn với Archbell. Đây là dẫn lại qua Kruger; trang sách Rasmussen chưa được kiểm tra trực tiếp và phạm vi Rustenburg có thể hẹp hơn vùng Chase mô tả.
- Lye (1969) tổng hợp 60–80 nghìn subject của polity Mzilikazi; 1–5 nghìn năm 1836 là lực lượng chiến binh Nguni, không phải tổng dân số. Không gộp các đơn vị này.
- NDE 60k tiếp tục là provisional polity-subject candidate, độ bất định cao; khoảng 45–85k chưa có phương pháp; NDE_MOS 210k vẫn là broad geography. Xem `H01_R3aa_NDE_1829_ARCHBELL_CHASE_RASMUSSEN_TRACE_VI.md` và CSV R3aa.

 
## R3ab — người đứng đầu và quyền lực thực tế năm 1836

- **Futa Jallon:** Bubakar là ứng viên Almami ở mốc 1836 theo Barry (1997, p.150); nhiệm kỳ và mốc chuyển giao tháng 11/1836 vẫn cần xác thực ảnh trang in gốc. Không lấy niên biểu Futa Toro thay cho Futa Jallon.
- **Ethiopia:** Sahle Dengel là hoàng đế danh nghĩa giai đoạn 1832–1840; Ras Ali Alula/Ali II là người nắm quyền lực thực tế ở trung tâm Ethiopia; Mänän Libän Amäde là nhân vật quyền lực trong thập niên đầu của Ali. Không gộp các vai trò thành một HOS.
- **Liberia:** năm 1836 là thuộc địa ACS, chưa phải quốc gia có chủ quyền. Anthony D. Williams là agent; Thomas Buchanan đến tháng 1 và quản lý các khu định cư Bassa; governor từ 1839.
- Các kết quả được lưu trong audit, source matrix, patch decisions và open evidence requests R3ab. Không cập nhật live historical data, government, officeholder runtime hoặc schema.
- Xem `H01_R3ab_1836_AFRICAN_POLITY_OFFICEHOLDER_AUDIT_VI.md`; trạng thái `SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`, cần Claude independent review.

 
## R3ac — Sokoto, Bornu, Wadai và Darfur

- **Sokoto:** Muhammad Bello là Amīr al-muʾminīn 1817–1837; Naylor (2021) giải thích đây là chức danh xuất hiện phổ biến trong bản thảo. Last (1967) ghi chiến dịch Gawakuke tháng 3/1836.
- **Bornu:** al-Kanemi là Shehu nắm quyền thực tế, Mai Ibrahim còn giữ địa vị truyền thống đến khi triều Sayfawa bị bãi bỏ năm 1846. Năm mất của al-Kanemi có dị bản 1835/1837; 1837 được hỗ trợ tốt hơn.
- **Wadai:** mốc Muhammad al-Sharif lên ngôi còn tranh chấp 1834/1835/1838. Không thể khẳng định chắc mốc `since=1835` ở snapshot 1836-01-01.
- **Darfur:** Muhammad al-Fadl trị vì 1803–1838; Muhammad al-Husayn kế vị năm 1838.
- Xem `H01_R3ac_CENTRAL_SAHEL_RULERSHIP_AND_SOVEREIGNTY_AUDIT_VI.md`, ma trận nguồn, patch decisions và open requests. Không sửa dữ liệu runtime hoặc schema.

