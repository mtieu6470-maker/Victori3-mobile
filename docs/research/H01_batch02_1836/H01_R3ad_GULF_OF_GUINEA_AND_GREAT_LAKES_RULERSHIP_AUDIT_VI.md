# H01 R3ad — Kiểm toán người đứng đầu và niên đại kế vị tại Asante, Dahomey, Macina và Buganda

**Mốc mô phỏng:** 1836-01-01  
**Repository snapshot trước R3ad:** `b02af8dfc1ccac4ad5b3e0cbc42a51bf89ef1b79`  
**Phạm vi:** nghiên cứu lịch sử và kiểm tra hồ sơ nhân vật; không cập nhật dữ liệu chạy trong game.  
**Trạng thái:** `RESEARCH_LAYER_UPDATED / SELF_AUDIT_ONLY / NO_PRODUCT_PATCH`.

## 1. Kết luận điều hành

R3ad kiểm tra bốn hồ sơ hiện nằm trong `_core_profiles_asia_africa.json`:

| Entity | Hồ sơ live hiện tại | Kết luận R3ad | Xử lý đề xuất |
|---|---|---|---|
| ASH — Asante | Kwaku Dua I, Asantehene, since 1834, supported | Kwaku Dua (Fredua Agyeman) kế vị Osei Yaw Akoto năm 1834; lịch sử hoàng gia Asante ghi ngày 25/8/1834 là ngày “most probably” enstooled. Ivor Wilks cũng ghi 1834–1867 và nói ông được bầu vào Golden Stool sau khi Akoto mất | Giữ 1834; ghi rõ độ chính xác ngày 25/8 là xác suất từ biên niên sử được biên soạn hồi cố, không phải chứng thư đương thời được xác thực trong task này |
| DAH — Dahomey | Ghezo, King, since 1818, supported | Ghezo/Guezo/Gezo lên ngôi qua cuộc đảo chính/cách mạng năm 1818, lật Adandozan. Việc Adandozan bị xóa khỏi danh sách vua chính thức và mô tả ông như một “regent” vẫn là vấn đề sử học có tranh luận | Giữ Ghezo từ 1818; không mô tả việc lên ngôi như kế vị hòa bình; giữ Adandozan như tiền nhiệm lịch sử trong research layer dù danh sách triều đại chính thức xóa tên |
| MAS — Macina / Hamdallahi | Seku Amadu (Ahmadu Lobbo), Caliph, since 1818, supported | Ahmād Lobbo là người sáng lập và lãnh đạo Caliphate of Hamdallahi/Macina từ phong trào năm 1818. Nobili (2020) nhấn mạnh nhà nước tồn tại đến 1862 và chronicle quan trọng được viết trong thế kỷ XIX nhằm hợp thức hóa quyền lực của người sáng lập. Nguồn về năm mất của Ahmād Lobbo có dị bản 1844/1845 | Giữ người và mốc 1818; phân biệt thời gian trị vì của người sáng lập với thời gian tồn tại 1818–1862 của nhà nước; ghi dị bản 1844/1845, không sửa live data |
| BUG — Buganda | Suna II, Kabaka, since 1832, supported | Các nguồn cho mốc bắt đầu 1830 (Reid/Medard), 1832 (lịch sử chính thức của Buganda) hoặc 1836 (hồ sơ đề cử UNESCO). Tuy nhiên, các nguồn đều đặt Ssuuna II trên ngai trong năm 1836 và kế vị là Muteesa I năm 1856 | Giữ Ssuuna II là người cai trị tại snapshot 1836; đánh dấu năm bắt đầu chính xác là contested/approximate. Chuẩn hóa alias Suna/Ssuuna và kiểm tra biến thể “Kalema Ssuuna II” trước mọi sửa profile |

### Kết luận quan trọng

- Không có bằng chứng trong R3ad cho thấy bốn người đứng đầu hiện tại sai tại mốc mô phỏng 1836-01-01.
- Vấn đề lớn hơn nằm ở **độ chính xác của mốc kế vị, tên/alias, bản chất của sự chuyển ngôi và cách lưu ký ức triều đại**.
- Dahomey cho thấy danh sách triều đại chính thức có thể là sản phẩm của chính trị kế vị, không phải bảng liệt kê trung lập.
- Macina cho thấy tư liệu biên niên sử có thể là công cụ hợp thức hóa quyền lực và không được sử dụng như một chứng cứ trung tính cho lịch sử xa hơn.
- Buganda cho thấy ngay cả danh sách hoàng gia hiện đại, tài liệu UNESCO và nghiên cứu học thuật cũng có thể đưa ra các năm bắt đầu khác nhau.

Không có dữ liệu nào được promote vào game runtime trong R3ad.

## 2. Asante (ASH): Kwaku Dua I / Fredua Agyeman

### 2.1. Kế vị năm 1834

Hồ sơ hiện tại ghi Kwaku Dua I, chức danh Asantehene, từ năm 1834.

Ivor Wilks, mục “Kwaku Dua I” trong *Dictionary of African Biography* (được lưu trong Dictionary of African Christian Biography và Encyclopaedia Africana), ghi Kwaku Dua trước đây tên Fredua Agyeman; ông là con của Queenmother Amma Sewaa và Nkwantananhene Boakye Yam Kuma. Sau khi Osei Yaw Akoto qua đời, Kwaku Dua được bầu lên Golden Stool, dường như không có đối thủ, và trị vì 1834–1867.

Một nguồn nội bộ Asante có giá trị đặc biệt là *History of Ashanti*, được ủy ban các nhân vật Asante do Asantehene Agyeman Prempeh II triệu tập biên soạn trong giai đoạn 1937–1946, sau đó được T. C. McCaskie biên tập và British Academy phát hành trong series *Fontes Historiae Africanae* năm 2022. Ở chương 11 (bản in pp.403–423), văn bản ghi Fredua Agyeman được enstooled kế vị Osei Yaw Akoto vào “most probably” thứ Hai 25/8/1834.

**Đánh giá:** mốc năm 1834 được hỗ trợ độc lập bởi Wilks và lịch sử hoàng gia Asante. Ngày 25/8/1834 là một mốc có giá trị nghiên cứu, nhưng từ “most probably” cần được giữ lại. Đây là lịch sử triều đại được biên soạn hơn một thế kỷ sau sự kiện, không phải biên bản enstoolment đương thời đã được kiểm tra trực tiếp.

### 2.2. Chương trình chính sách khi lên ngôi

Wilks ghi Kwaku Dua đưa ra định hướng “Peace, Trade, and Open Roads”, tiếp tục hiệp ước với Anh do người tiền nhiệm ký năm 1831, duy trì thương mại tốt với thương nhân Anh ở Gold Coast và cho phép một số cơ sở truyền giáo hoạt động. Wilks đồng thời mô tả sự kiểm soát chính trị mạnh trong nội bộ, đợt thanh trừng các quan chức cũ năm 1839 và các xung đột sau đó với phe đối lập.

Do vậy, không nên diễn giải Kwaku Dua là người cai trị “hòa bình” theo nghĩa từ bỏ chiến tranh hoặc một nhà cải cách tự do. Chính sách đối ngoại thỏa hiệp với người Anh tồn tại song song với một triều đình có kỷ luật nội bộ nghiêm khắc và việc giữ quyền lực cá nhân.

### 2.3. Tên người và chức danh

- `Kwaku Dua I` là tên vương quyền.
- `Fredua Agyeman` là tên cá nhân trước khi enstoolment.
- `Asantehene` là chức danh người đứng đầu Asante; không nên thay bằng “King” trong các trường dữ liệu chuẩn nếu cần bảo tồn chức danh địa phương.
- Golden Stool là biểu tượng quyền lực/chính danh của Asante; không phải một chức vụ độc lập hay một ngai vàng vật lý theo nghĩa đơn giản.

Không thay đổi profile live hoặc government preset trong R3ad.

## 3. Dahomey (DAH): Ghezo/Guezo và cuộc đảo chính năm 1818

### 3.1. Mốc lên ngôi

Hồ sơ hiện tại ghi Ghezo là King từ năm 1818. Mốc này được hỗ trợ bởi:
- Augustus A. Adeyinka, “King Gezo of Dahomey, 1818–1858: A Reassessment of a West African Monarch in the Nineteenth Century”, *African Studies Review* 17(3) (1974), pp.541–548.
- David A. Boss, *The Autonomous Kingdom of Dahomey 1818–94* (PhD thesis, University of London, August 1967).
- Elisée Soumonni, “Slave and Palm Oil Trades in Dahomey, 1818–1858”, trong Robin Law (ed.), *From Slave Trade to ‘Legitimate’ Commerce: The Commercial Transition in Nineteenth-Century West Africa* (Cambridge University Press, African Studies Series 86, 1995), pp.79–92.
- Lynne Ellsworth Larsen, *Dahomey’s Royal Architecture: An Earthen Record of Construction, Subjugation, and Reclamation* (Routledge, 2022), chương 2.

Boss ghi cách mạng năm 1818 buộc vị vua Adanzan rời ngai và Prince Gahkpe lên thay, lấy vương hiệu Gezo. Soumonni cũng ghi Ghezo lên ngôi qua coup d’état lật Adandozan trong năm 1818 với sự trợ giúp của thương nhân nô lệ người Brazil Francisco Felix de Souza.

### 3.2. Adandozan: tiền nhiệm bị xóa tên và tranh cãi về tính chính danh

Soumonni cho biết truyền thống chính thức Dahomey đã xóa Adandozan khỏi danh sách các vua. Một số truyền thống mô tả ông chỉ là vua nhiếp chính trong thời gian Ghezo còn nhỏ; nhưng Soumonni dẫn Akinjogbin cho rằng cách mô tả này là sai lệch, nhằm hợp thức hóa việc Ghezo lên ngôi bất thường. Soumonni cũng lưu ý các tài liệu đương thời cho thấy Adandozan từng có chính sách đối đầu với thương nhân châu Âu và có thể đã bị đánh bại bởi một liên minh quyền lợi liên quan đến buôn bán nô lệ, trong đó de Souza đóng vai trò quan trọng.

Larsen (2022) mô tả Adandozan trị vì 1797–1818 nhưng bị loại khỏi danh sách triều đại; Ghezo thay thế ông và chiếm/định hình lại phần cung điện của người tiền nhiệm. Đây là ví dụ vật chất cho việc ký ức chính trị về triều đại được thể hiện ngay trong kiến trúc cung điện.

**Đánh giá:** R3ad không coi Adandozan là một “regent” đã được chứng minh, cũng không đưa ra kết luận đơn giản rằng ông chắc chắn là một vị vua hợp pháp theo mọi quan niệm. Định hướng an toàn là mô tả ông như một người cai trị/tiền nhiệm bị phế truất trong biến cố 1818, với tranh luận về tính chính danh và việc xóa tên khỏi king-list.

### 3.3. Chính sách kinh tế của Ghezo

Soumonni phân tích cách Ghezo xử lý sự chuyển đổi từ buôn bán nô lệ sang thương mại dầu cọ, nhưng nhấn mạnh hai loại hình thương mại cùng tồn tại trong nhiều thập kỷ; không nên gắn cho Ghezo một chính sách “chấm dứt buôn bán nô lệ và thay bằng dầu cọ” ngay từ năm 1818. Soumonni còn chỉ ra việc Ghezo chịu áp lực ngoại giao của Anh nhưng tận dụng cạnh tranh Anh–Pháp để duy trì lợi ích của Dahomey.

Đối với simulation:
- Năm 1818 là mốc thay đổi người cai trị bằng đảo chính, không phải một cuộc kế vị yên bình.
- Chính sách thương mại phải được mô hình hóa qua thời gian, không phải gán toàn bộ thay đổi kinh tế vào ngày Ghezo lên ngôi.
- Tư liệu về Adandozan cần được giữ trong journal/event layer như một cuộc tranh chấp ký ức/chính danh, không chỉ là một dòng tiền nhiệm bị xóa.

## 4. Macina / Hamdallahi (MAS): Ahmād Lobbo / Seku Amadu

### 4.1. Người sáng lập và phạm vi thời gian

Hồ sơ hiện tại ghi Seku Amadu (Ahmadu Lobbo), title Caliph, since 1818.

Mauro Nobili, *Sultan, Caliph, and the Renewer of the Faith: A Study of the West African Chronicle Tārīkh al-fattāsh* (Cambridge University Press, 2020), mở đầu bằng việc xác định Caliphate of Hamdallahi tồn tại 1818–1862 ở vùng Inner Niger Delta, ngày nay thuộc Mali; tác giả nhận diện Ahmād Lobbo là người sáng lập và cho biết ông mất năm 1845. Nobili cũng phân tích bối cảnh các tuyên bố quyền lực cạnh tranh tại Middle Niger.

Do đó:
- 1818 là mốc khởi đầu của nhà nước/Caliphate Hamdallahi, phù hợp với việc Seku Amadu là người đứng đầu ở mốc 1836.
- 1862 là mốc kết thúc của nhà nước, không phải thời gian trị vì cá nhân của Seku Amadu.
- Các tên `Seku Amadu`, `Ahmadu Lobbo`, `Ahmād Lobbo`, `Ahmad ibn Muhammadu Lobbo` cần được map về một nhân vật với alias/transliteration.

### 4.2. Niên đại mất và kế vị

Nguồn tổng hợp hiện đại khác nhau giữa 1844 và 1845. Nobili (2020) ghi Ahmād Lobbo mất năm 1845; các danh sách rulers và một số nghiên cứu khác ghi 1844, trong khi các bài tóm tắt thường dùng 1845. Vì ngày mô phỏng là 1836, bất đồng này không làm thay đổi người lãnh đạo tại snapshot, nhưng ảnh hưởng đến mô phỏng kế vị 1844–1845.

Không nên:
- Dùng ngày mất 20/4/1845 như một ngày chắc chắn nếu chưa kiểm tra chronicle/annal gốc.
- Đồng nhất ngày chấm dứt vai trò của Seku Amadu với ngày kết thúc toàn bộ Caliphate Hamdallahi.
- Gán toàn bộ 1818–1862 cho cá nhân Seku Amadu.

### 4.3. Nguồn chronicle và chính trị hợp thức hóa

Đóng góp quan trọng của Nobili là tái đánh giá *Tārīkh al-fattāsh*. Ông cho rằng dạng văn bản hiện được biết đến là một chronicle thế kỷ XIX được Nuḥ b. al-Ṭāhir (mất 1857–1858), một học giả Fulani thuộc elite Hamdallahi, biên soạn để củng cố tính chính danh cho người sáng lập Ahmād Lobbo và Caliphate. Tác giả phân biệt lớp văn bản cũ với phần sửa đổi/đưa thêm lời tiên tri về sự xuất hiện của Ahmād Lobbo.

Điều này không làm mọi nội dung chronicle trở nên vô giá trị; nó yêu cầu phân biệt:
- tư liệu dùng để dựng chronology đương thời;
- đoạn văn được chèn/sửa để tuyên truyền hoặc hợp thức hóa quyền lực;
- tuyên truyền chính trị như một bằng chứng về cách nhà nước tự mô tả và yêu cầu được công nhận.

Nghiên cứu tương lai về Macina phải lưu source-layer và mức độ xác thực của từng đoạn chronicle, không coi toàn bộ văn bản như một bản sử biên niên trung lập từ thế kỷ XVI.

## 5. Buganda (BUG): Ssuuna II và niên đại bắt đầu triều đại

### 5.1. Các mốc ngày khác nhau

Profile hiện tại ghi Suna II, Kabaka, since 1832, source `iliffe_2007`.

Các nguồn đưa ra các mốc khác nhau:
- Tài liệu lịch sử chính thức do Kingdom of Buganda công bố liệt kê “Kalema Ssuuna II” trị vì 1832–1856.
- Hồ sơ đề cử UNESCO cho Kasubi Tombs ghi các ngày trị vì chỉ được biết chính xác từ Kabaka Suuna II, người trị vì 1836–1856.
- Richard J. Reid, *Economic and Military Change in Nineteenth-Century Buganda* (PhD thesis, SOAS, 2002), cho rằng Suna có lẽ lên ngôi khoảng năm 1830 và mất vào cuối năm 1856; tác giả nói rõ rất khó xác định chắc chắn các triều đại trước Muteesa.
- Henri Médard, *Croissance et crises de la royauté du Buganda au XIXe siècle* (PhD thesis, Université Paris I, 2001), phụ lục chronology ghi Ssuuna lên ngai khoảng 1830 và Muteesa kế vị năm 1856.

Những nguồn này đều đặt Ssuuna II trên ngai trong năm 1836. Vì vậy, **người cai trị ở snapshot 1836 được xác định khá chắc chắn**, nhưng mốc bắt đầu chính xác là vấn đề riêng.

### 5.2. Tên và transliteration

Các dạng gặp trong nguồn:
- `Suna II`
- `Suuna II`
- `Ssuuna II`
- `Kalema Ssuuna II` trong tài liệu chính thức của Buganda.

Không được tự động tách “Kalema” thành một nhân vật khác, cũng không bỏ mất biến thể Ssuuna/Suna. Cần source-backed alias table trước khi sửa profile live.

### 5.3. Hệ quả đối với dữ liệu

- `hos= Suna II` phù hợp với mốc 1836.
- `since=1832` là giá trị nằm trong một chronology chính thức của Buganda, nhưng không phải ngày khởi đầu được tất cả các nguồn đồng thuận.
- Nếu hệ thống dữ liệu hỗ trợ date precision, nên biểu diễn start-date confidence/range (c.1830–1836) thay vì buộc một năm chính xác giả.
- Không lùi mốc về 1830 hoặc đẩy lên 1836 trong R3ad; đây là đề xuất chuẩn hóa nghiên cứu, không phải phê duyệt data patch.

## 6. Khuyến nghị cho hệ thống lịch sử/gameplay tương lai

R3ad không sửa code; các phát hiện gợi ý các yêu cầu dữ liệu cần có trong tương lai:

1. **Dynastic memory vs official king-list:** Dahomey cho thấy danh sách triều đại có thể bị sửa bởi chính trị kế vị; lưu cả “official state list” và “historical claimant/contested ruler”.
2. **Event type:** một coup, deposition, usurpation, election/enstoolment và hereditary succession không nên cùng được gọi chung là “change of ruler”.
3. **Name aliases:** Fredua Agyeman/Kwaku Dua; Gahkpe/Ghezo/Guezo/Gezo; Ahmād Lobbo/Seku Amadu; Suna/Ssuuna cần entity-level alias mapping.
4. **Date precision:** Asante có ngày enstoolment “most probably”; Buganda có reign-start estimates; Macina có death-year disagreement. Lưu mức năm/tháng/ngày và confidence riêng biệt.
5. **Source provenance:** chronicle được biên soạn để hợp thức hóa quyền lực vẫn là một nguồn quan trọng, nhưng phải gắn cờ source purpose và textual layer.

## 7. Nguồn tham khảo và giới hạn

1. Ivor Wilks, “Kwaku Dua I”, *Dictionary of African Biography*; bản mục được lưu tại Dictionary of African Christian Biography / Encyclopaedia Africana: https://dacb.org/stories/ghana/kwaku-dus/ và https://encyclopaediaafricana.com/kwaku-dua-i/.
2. Otumfuo Nana Osei Agyeman Prempeh II, *History of Ashanti*, edited by T. C. McCaskie, Fontes Historiae Africanae, vol.21, British Academy, 2022; chapter 11, printed pp.403–423, especially JSTOR chapter listing: https://www.jstor.org/stable/jj.31510226.20. The 1937–1946 committee compilation is retrospective; the enstoolment date is explicitly “most probably”.
3. Augustus A. Adeyinka, “King Gezo of Dahomey, 1818–1858: A Reassessment of a West African Monarch in the Nineteenth Century”, *African Studies Review* 17(3) (1974), pp.541–548, DOI 10.2307/523800: https://www.cambridge.org/core/journals/african-studies-review/article/abs/king-gezo-of-dahomey-18181858-a-reassessment-of-a-west-african-monarch-in-the-nineteenth-century/9B1806941578F189D9C69F06EBB87CCD.
4. David A. Boss, *The Autonomous Kingdom of Dahomey 1818–94* (PhD thesis, University of London, August 1967), opening abstract / chronology: https://eprints.soas.ac.uk/29461/1/10731617.pdf.
5. Elisée Soumonni, “Slave and Palm Oil Trades in Dahomey, 1818–1858”, in Robin Law (ed.), *From Slave Trade to ‘Legitimate’ Commerce: The Commercial Transition in Nineteenth-Century West Africa*, Cambridge University Press, African Studies Series 86 (1995), pp.79–92: https://ndl.ethernet.edu.et/bitstream/123456789/9789/1/133.pdf.pdf.
6. Lynne Ellsworth Larsen, *Dahomey’s Royal Architecture: An Earthen Record of Construction, Subjugation, and Reclamation* (Routledge, 2022), introduction: https://api.pageplace.de/preview/DT0400.9781000899634_A46195288/preview-9781000899634_A46195288.pdf.
7. Mauro Nobili, *Sultan, Caliph, and the Renewer of the Faith: A Study of the West African Chronicle Tārīkh al-fattāsh* (Cambridge University Press, 2020), especially introduction and “The Caliphate of Hamdallahi”: https://assets.cambridge.org/97811084/79509/excerpt/9781108479509_excerpt.pdf.
8. Richard J. Reid, *Economic and Military Change in Nineteenth-Century Buganda* (PhD thesis, SOAS, 2002), source discussion and king-list chronology: https://eprints.soas.ac.uk/33564/1/11010323.pdf.
9. Henri Médard, *Croissance et crises de la royauté du Buganda au XIXe siècle* (PhD thesis, Université Paris I, 2001), chronology appendix: https://files01.core.ac.uk/download/pdf/52811096.pdf.
10. Kingdom of Buganda, *Brief History of the Kingdom of Buganda*, official royal chronology (Kalema Ssuuna II 1832–1856): https://buganda.or.ug/wp-content/uploads/2025/04/Final-Print-BRIEF-HISTORY-OF-THE-KINGDOM-OF-BUGANDA-3.pdf.
11. UNESCO World Heritage Centre, “Tombs of Buganda Kings at Kasubi”, nomination dossier (states Suuna II 1836–1856): https://whc.unesco.org/uploads/nominations/1022.pdf.

## 8. Trạng thái

`SELF_AUDIT_ONLY / NO_PRODUCT_PATCH / PENDING_CLAUDE_REVIEW`.

- ASH: 1834 được hỗ trợ; ngày cụ thể 25/8 là “most probably”.
- DAH: Ghezo từ 1818 được hỗ trợ; Adandozan là tiền nhiệm bị phế truất và bị xóa khỏi official king-list, nhưng câu chuyện về tính chính danh cần trình bày như một vấn đề sử học đang tranh luận.
- MAS: Seku Amadu lãnh đạo Hamdallahi tại snapshot 1836; cần phân biệt triều đại cá nhân với tồn tại của nhà nước và xử lý dị bản năm mất 1844/1845.
- BUG: Ssuuna II là Kabaka năm 1836; mốc bắt đầu triều đại khoảng 1830–1836, profile 1832 không cần sửa trong nghiên cứu layer.
