# H01 R3ac — Kiểm toán quyền lực, chức danh và kế vị tại Sokoto, Bornu, Wadai và Darfur

**Mốc mô phỏng:** 1836-01-01  
**Repository snapshot trước R3ac:** `1dea95b089b8e2a661223e414f18ee2891c50ca8`  
**Phạm vi:** nghiên cứu lịch sử và đối chiếu hồ sơ nhân vật; không sửa dữ liệu gameplay, schema hoặc runtime.  
**Trạng thái:** `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

## 1. Kết luận điều hành

R3ac kiểm tra bốn hồ sơ Tây–Trung Sudan có liên hệ chính trị trực tiếp trong thập niên 1830:

| Entity | Hồ sơ hiện tại tại repo | Kết luận R3ac | Đề xuất xử lý nghiên cứu |
|---|---|---|---|
| SOK — Sokoto | Muhammad Bello; “Sarkin Musulmi (Caliph)”; từ 1817 | Muhammad Bello lãnh đạo Sokoto 1817–1837. Nghiên cứu thư tịch hiện đại của Paul Naylor xác định thuật ngữ thường gặp trong bản thảo là **Amīr al-muʾminīn** (Commander of the Faithful); Murray Last ghi triều đại 1817–1837 và chiến dịch Gawakuke năm 1836 | Giữ người; bổ sung alias/chức danh học thuật “Amīr al-muʾminīn”. “Caliph” vẫn là cách gọi quen thuộc trong nhiều nghiên cứu nhưng không nên làm mất thuật ngữ văn kiện |
| BOR — Bornu | Muhammad al-Amin al-Kanemi; Shehu (de facto ruler); ghi Sayfawa mai còn danh nghĩa đến 1846 | Al-Kanemi nắm quyền thực tế; Mai Ibrahim vẫn giữ địa vị truyền thống. Năm 1846 mới chấm dứt chức vị Mai/Sayfawa và Shehu trở thành chủ quyền chính thức. Có nguồn thứ cấp cũ ghi al-Kanemi mất năm 1835, nhưng National Portrait Gallery và nghiên cứu lịch sử Nigeria đặt ông mất năm 1837 | Giữ phân biệt Shehu thực quyền / Mai danh nghĩa; giữ 1837 là năm mất có hỗ trợ tốt hơn, ghi nhận dị bản 1835. Không biến 1836 thành chế độ quân chủ al-Kanemi đã có chủ quyền pháp thức |
| WAD — Wadai | Muhammad Sharif; bắt đầu năm 1835; chất lượng supported | Mốc cài đặt Muhammad al-Sharif dao động giữa 1834, 1835 và 1838 tùy nguồn. Robert O. Collins ghi Darfur can thiệp năm 1838 và Muhammad al-Sharif trị vì 1838–1858; bài nghiên cứu của Dennis D. Cordell nhấn mạnh ít nhất sáu danh sách vua khác nhau và khó định niên đại chính xác giai đoạn 1813–1835 | Không xác nhận ngày 1835 như sự thật chắc chắn; hạ mức tin cậy/đặt cách ly nghiên cứu cho mốc bắt đầu. Chưa đủ căn cứ chọn một người duy nhất chắc chắn ở ngày 1836-01-01 |
| DAR — Darfur | Muhammad al-Fadl; Sultan; từ 1803 | M. W. Daly ghi Muhammad al-Fadl trị vì 1803–1838 và con ông, Muhammad al-Husayn, kế vị 1838–1873 | Hồ sơ hiện tại đúng cho mốc 1836; ghi rõ mốc kết thúc 1838 và thay đổi triều đại kế tiếp |

**Kết luận quan trọng:** SOK, BOR và DAR có thể được mô tả với độ tin cậy tương đối cao tại ngày mô phỏng. WAD chưa có một mốc kế vị thống nhất đủ để khẳng định “since 1835” là chính xác. Không đưa bất kỳ thay đổi nào vào dữ liệu đang chạy trong R3ac.

## 2. Sokoto (SOK): Muhammad Bello và chức danh Amīr al-muʾminīn

### 2.1. Thời gian nắm quyền

Murray Last, *The Sokoto Caliphate* (1967), chương 4, ghi tiểu mục “The Caliphate of Muḥammad Bello” trong giai đoạn 1817–1837. Paul Naylor, *From Rebels to Rulers: Writing Legitimacy in the Early Sokoto State* (2021), phần “Note on Language”, cũng nói người lãnh đạo Sokoto là Usman từ khoảng 1804 đến 1817 và Muhammad Bello từ 1817 đến 1837.

Do đó, Muhammad Bello là người đứng đầu tại mốc 1836-01-01. Không có tranh chấp nghiêm trọng về danh tính hoặc khoảng thời gian trong hai nguồn này.

### 2.2. Chức danh nên dùng

Naylor giải thích ông dùng thuật ngữ Ả Rập **Amīr al-muʾminīn** (“Commander of the Faithful”) vì đây là thuật ngữ gặp phổ biến nhất trong bản thảo. Naylor đồng thời phân biệt rulers of Gwandu, các emirate và polities trực thuộc bằng thuật ngữ **Emir**.

Hệ quả cho dữ liệu:
- “Sarkin Musulmi” là cách gọi Hausa có ý nghĩa trong bối cảnh Sokoto; “Caliph” được dùng rộng rãi trong nghiên cứu hiện đại.
- Tuy nhiên, nếu muốn lưu chức danh lịch sử chính xác theo bản thảo, nên giữ “Amīr al-muʾminīn” là chức danh chuẩn và lưu “Caliph”/“Sarkin Musulmi” như tên gọi hoặc cách dịch thay thế.
- Không nên suy luận rằng lãnh thổ caliphate vận hành như một nhà nước tập quyền hiện đại. Last mô tả các emirates có tính tự quản đáng kể và hoạt động chính trị/lịch sử riêng.

### 2.3. Mốc quân sự năm 1836

Last ghi trận Gawakuke năm 1836, nơi lực lượng của Muhammad Bello đánh bại liên minh gồm Gobir, lực lượng Katsina từ Maradi và các nhóm Tuareg; các lãnh đạo ‘Ali và Rauda bị giết, Ibra chết sau đó. Last đặt chiến dịch Gawakuke vào tháng 3/1836 và liên hệ việc xây dựng ribāṭ/đồn biên giới ở Lajinge, Shinaka và Kware.

Đây là mốc lịch sử hữu ích cho event/war layer tương lai, nhưng R3ac không sửa event data.

## 3. Bornu (BOR): al-Kanemi là Shehu thực quyền, Mai Ibrahim vẫn tồn tại

### 3.1. Tách hai trung tâm quyền lực

Toyin Falola, Abdullahi Mahadi, Martin Uhomoibhi và Ukachukwu Anyanwu, *History of Nigeria 2: Nigeria in the Nineteenth Century* (Longman Nigeria, 1991; tái bản 2003/2007), chương 2 “Borno under the Shehus”, mô tả:

- Al-Kanemi là người có quyền lực thực tế mạnh nhất ở Bornu từ thập niên 1820.
- Ông giữ danh hiệu Sheikh/Shehu; thuật ngữ Shehu bắt nguồn từ danh xưng Sheikh.
- Ông không thể công khai tự nhận là Mai vì địa vị truyền thống của dòng Sayfawa/Mai vẫn được người dân Bornu công nhận.
- Al-Kanemi chọn/chi phối việc đưa Mai Ibrahim lên ngai; văn bản ghi Ibrahim còn chưa đến 20 tuổi khi được cài đặt.
- Năm 1846, sau cuộc liên minh thất bại giữa Mai Ibrahim và Wadai chống lại Shehu Umar, triều Sayfawa bị bãi bỏ; từ năm 1846, dòng al-Kanemi mới chính thức trở thành chủ quyền của Bornu.

Do đó, việc profile hiện ghi “Shehu (de facto ruler)” và chú thích Mai Sayfawa còn tồn tại đến 1846 là một phân biệt quan trọng, không phải lỗi dữ liệu.

### 3.2. Năm mất của Muhammad al-Amin al-Kanemi

Có một xung đột nguồn cần giữ công khai:

- Robert O. Collins, trong tuyển tập *Western African History: Text and Readings* (1990), phần trích từ Thomas Hodgkin, *Nigerian Perspectives* (1960), pp.198–201, ghi al-Kanemi tiếp tục cai quản Bornu đến khi mất năm **1835**.
- National Portrait Gallery ghi al-Kanemi sống **1776–1837**, đồng thời nói con ông Umar chỉ tuyên bố mình là Shehu đầu tiên năm 1846 khi dòng Sayfawa kết thúc.
- *History of Nigeria 2* ghi Umar kế vị sau khi al-Kanemi mất năm **1837**; đoạn văn mô tả Mai Ibrahim đến Kukawa để tuyên thệ với Shehu mới.
- Encyclopaedia of Islam entry về al-Kanemi cũng được các thư mục thứ cấp dẫn là 1775/76–1837, nhưng bản scan/entry gốc cần được đối chiếu trực tiếp trước khi dùng như chứng cứ quyết định.

**Đánh giá:** 1837 được hỗ trợ bởi National Portrait Gallery và chuyên khảo lịch sử Nigeria, trong khi 1835 xuất hiện trong bản tóm tắt/đoạn trích thứ cấp cũ. Giữ 1837 là ứng viên tốt hơn cho profile; ghi 1835 là dị bản cần xem xét, không tự sửa live data trong task nghiên cứu.

### 3.3. Ý nghĩa mô hình game

Nếu chỉ có một trường `hos`, việc điền al-Kanemi là hợp lý khi nó biểu diễn người nắm quyền thực tế. Nhưng dữ liệu dài hạn cần khả năng thể hiện đồng thời:
- Mai Ibrahim: chủ thể mang tính chính danh/truyền thống của Sayfawa đến 1846.
- Shehu al-Kanemi: trung tâm quyền lực hành pháp, quân sự và ngoại giao thực tế trước 1837.
- Umar: Shehu kế vị sau năm 1837; việc chấm dứt địa vị Mai chỉ diễn ra năm 1846.

Không được tạo một chuyển tiếp sovereign-state duy nhất vào năm 1837 nếu bằng chứng thể chế cho thấy quá trình kết thúc Sayfawa kéo dài đến 1846.

## 4. Wadai (WAD): mốc Muhammad al-Sharif chưa thể chốt ở 1835

### 4.1. Các niên đại không thống nhất

R3ac xác định ít nhất ba cách định niên đại nổi bật:

1. **1834:** các danh sách gắn với Barth và Carbou đặt Muhammad al-Sharif lên ngôi vào năm 1834; một bài tổng hợp về Wadai dẫn Barth ghi ông nhận quyền lực trong tháng Jumādā I 1250 AH, diễn giải vào cuối hè 1834.
2. **1835:** cách định niên đại của Gustav Nachtigal và một số bảng vua khác đặt sự kiện vào 1835; nhiều nguồn phổ thông sử dụng mốc khoảng 1835.
3. **1838:** Robert O. Collins, “Bagirmi, Wadai, and Darfur”, *Encyclopedia of African History* (2005), p.120, viết Darfur can thiệp vào năm 1838 và đặt Muhammad al-Sharif trị vì 1838–1858. 1911 *Encyclopaedia Britannica* cũng ghi Muhammad Sherif làm sultan từ 1838 đến 1858. Dennis D. Cordell (1977), trong ghi chú về Wadai, dẫn Evans-Pritchard và các nguồn liên quan trong cuộc tranh luận niên đại này.

### 4.2. Độ tin cậy của các danh sách vua

Dennis D. Cordell, “Eastern Libya, Wadai and the Sanūsīya: A Ṭarīqa and a Trade Route,” *Journal of African History* 18(1) (1977), pp.21–36, ghi rõ có ít nhất sáu danh sách vua Wadai khác nhau và việc đối chiếu chúng còn chưa hoàn thành; ông kết luận không thể xác định chính xác nhiệm kỳ các ruler trong giai đoạn 1813–1835. Ghi chú của Cordell dẫn Fresnel (1849), Nachtigal (1971 bản dịch) và Tubiana (1960).

Điều này có nghĩa:
- `since=1835` trong profile hiện tại không nên được coi là mốc ngày/năm đã xác thực chỉ vì một tài liệu tổng hợp dùng nó.
- Tuy nhiên, cũng không thể tự động thay bằng 1838, vì nguồn khác ghi 1834 hoặc 1835.
- Không thể khẳng định chắc chắn Muhammad al-Sharif đã nắm quyền đúng vào 1836-01-01, cũng không thể khẳng định chắc chắn ông chưa nắm quyền.
- Quan hệ chính trị cấp vùng vẫn có thể mô tả: Darfur can thiệp vào khủng hoảng kế vị của Wadai, đưa một claimant lên ngôi để nhận lòng trung thành/cống nạp; Muhammad al-Sharif sau đó củng cố quyền tự chủ và trở thành một ruler mạnh trong lưu vực Chad.

### 4.3. Quyết định đối với hồ sơ hiện tại

R3ac đề xuất:
- Giữ Muhammad al-Sharif như một claimant/ruler ứng viên trong dải giữa thập niên 1830–1838.
- Hạ mức tin cậy của mốc bắt đầu năm 1835 khỏi `supported` cho đến khi source chain được hòa giải.
- Không gán Adam hoặc một claimant khác cho 1836 chỉ dựa trên king list thứ cấp đơn lẻ.
- Không sửa profile live data hoặc `hos.since` trong R3ac.

## 5. Darfur (DAR): Muhammad al-Fadl trị vì đến năm 1838

M. W. Daly, *Darfur’s Sorrow: A History of Destruction and Genocide* (Cambridge University Press, 2007), chronology of events ghi:
- Muhammad al-Fadl trị vì **1803–1838**.
- Muhammad al-Husayn, con ông, kế vị và trị vì **1838–1873**.

R. S. O’Fahey, M. I. Abu Salim và các cộng sự, *Land in Dar Fur: Charters and Related Documents from the Dar Fur Sultanate* (Cambridge University Press, 1983), chương “Translations and Commentary”, đưa một charter trong đó Sultan Muhammad al-Husayn xác nhận một khoản cấp đất trước đó do Muhammad al-Fadl ban cho một faqīh. Nguồn này hỗ trợ việc kiểm tra quan hệ cha–con và tính kế thừa trong văn kiện Darfur.

Vì vậy, hồ sơ Muhammad al-Fadl (từ 1803) đúng với mốc 1836. Cần giữ transition sang Muhammad al-Husayn ở 1838, không kết thúc triều đại tại 1836 hoặc gán người kế vị sớm hơn.

## 6. Những tác động đối với mô hình lịch sử/gameplay trong tương lai

Các phát hiện này tác động trực tiếp đến độ chính xác của hệ thống lịch sử:

- **Office model:** một quốc gia có thể có người đứng đầu chính danh và người nắm quyền thực tế khác nhau (Bornu); không nên ép cả hai vào một `hos` đơn.
- **Titles:** chức danh địa phương/Ả Rập không nên bị rút gọn thành “King” hoặc “Caliph” nếu thư tịch cho thấy vai trò cụ thể hơn.
- **Succession windows:** những năm chuyển triều có thể chỉ chính xác đến khoảng năm hoặc dải năm, không phải ngày 1/1.
- **Diplomacy/vassalage:** Darfur can thiệp Wadai và quan hệ cống nạp là tiền đề cho các sự kiện ngoại giao/chiến tranh sau này.
- **Historical Mode:** khi nguồn không thống nhất, mô phỏng cần lưu trạng thái bất định thay vì khóa một mốc sự kiện giả chính xác.

**R3ac không cập nhật dữ liệu gameplay, head-of-state, government preset, event, map owner, population, engine, save schema hoặc UI.**

## 7. Nguồn tham khảo và giới hạn

1. Paul Naylor, *From Rebels to Rulers: Writing Legitimacy in the Early Sokoto State* (James Currey/Boydell & Brewer, 2021), “Note on Language”, phần trước nội dung chính. Publisher preview: https://api.pageplace.de/preview/DT0400.9781800102347_A42901854/preview-9781800102347_A42901854.pdf.
2. Murray Last, *The Sokoto Caliphate* (Longmans, 1967), chapter 4, pp.63–80; Gawakuke discussion, pp.73–76; scanned searchable copy: https://www.internationalafricaninstitute.org/downloads/sokoko_caliph.pdf.
3. Toyin Falola, Abdullahi Mahadi, Martin Uhomoibhi and Ukachukwu Anyanwu, *History of Nigeria 2: Nigeria in the Nineteenth Century* (Longman Nigeria, 1991; reprints 2003/2007), chapter 2 “Borno under the Shehus”, especially pp.23–35. National Library of Nigeria repository PDF: https://nigeriareposit.nln.gov.ng/server/api/core/bitstreams/d5eb22ea-73b0-4867-9cf2-d7cfadc08534/content. Text extraction is accessible; original page screenshot endpoint timed out during this review.
4. National Portrait Gallery, “Sheikh Muhammad el Amin el Kanemi (1776–1837)”: https://www.npg.org.uk/collections/search/person/mp84770/sheikh-muhammad-el-amin-el-kanemi.
5. Robert O. Collins, *Western African History: Text and Readings* (Markus Wiener, 1990), chapter “Al-Kanami”, excerpt from Thomas Hodgkin, *Nigerian Perspectives* (1960), pp.198–201; this is the trace for the conflicting 1835 death claim: https://isamveri.org/pdfdkm/11/DKM110303.pdf.
6. Robert O. Collins, “Bagirmi, Wadai, and Darfur”, in *Encyclopedia of African History*, vol. 1, p.120 (2005). Preview: https://api.pageplace.de/preview/DT0400.9781135456702_A23803520/preview-9781135456702_A23803520.pdf. Page 120 screenshot was visually inspected.
7. Dennis D. Cordell, “Eastern Libya, Wadai and the Sanūsīya: A Ṭarīqa and a Trade Route,” *Journal of African History* 18(1) (1977), pp.21–36, especially note 10; Cambridge: https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/eastern-libya-wadai-and-the-sanusiya-a-tariqa-and-a-trade-route/B79B4B1CD1F87C86A857CC20BA4FF746.
8. *Encyclopaedia Britannica* (1911), “Wadai”: https://en.wikisource.org/wiki/1911_Encyclop%C3%A6dia_Britannica/Wadai.
9. M. W. Daly, *Darfur’s Sorrow: A History of Destruction and Genocide* (Cambridge University Press, 2007), chronology, pp. xiii–xiv; frontmatter: https://assets.cambridge.org/97805218/76186/frontmatter/9780521876186_frontmatter.pdf.
10. R. S. O’Fahey, M. I. Abu Salim, M. J. Tubiana and J. Tubiana, *Land in Dar Fur: Charters and Related Documents from the Dar Fur Sultanate* (Cambridge University Press, 1983), chapter “Translations and Commentary”, pp.35–118: https://www.cambridge.org/core/books/abs/land-in-dar-fur/translations-and-commentary/F2D238E6A87B75C0CFFB97807C664DD6.

## 8. Trạng thái

`SELF_AUDIT_ONLY / NO_PRODUCT_PATCH / PENDING_CLAUDE_REVIEW`.

- SOK and DAR officeholder periods are well supported at the 1836 snapshot.
- BOR dual authority is well supported; the 1837 death year is better supported than the 1835 secondary variant, but the variant remains recorded.
- WAD's accession date is materially contested and remains open.
- None of the findings authorizes runtime/data/schema changes or opens S1.
