# TIÊU CHUẨN ĐỘ CHÍNH XÁC LỊCH SỬ TOÀN CẦU — HISTORICAL MODE

**Dự án:** Currents of History / Victori3 Mobile  
**Branch baseline:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Baseline SHA:** `b63149242618c09d722f06068826f1651dc226ad`  
**Phạm vi chiến dịch:** **01/01/1836–31/12/1936**  
**Trạng thái:** `PROJECT-WIDE DIRECTION / DOCUMENTATION ONLY / NO CODE AUTHORIZATION`

## 1. Phạm vi quyết định

Phạm vi nghiên cứu lịch sử là **toàn thế giới**, không giới hạn châu Phi, châu Âu hay nhóm cường quốc. Mọi thực thể, vùng, chính thể và dân cư được mô hình hóa trong repository đều nằm trong phạm vi kiểm tra: quốc gia có chủ quyền, chư hầu, thuộc địa, công ty đặc quyền, chính thể bán độc lập, nhà nước chưa được công nhận, chính quyền nổi dậy, thực thể tương lai và xã hội phi tập trung.

- **Historical Mode:** phải ưu tiên độ chính xác lịch sử, tính nhất quán thời gian, provenance và khả năng giải thích. Dữ liệu khởi tạo phản ánh trạng thái tại **01/01/1836**; chuỗi lịch sử bao phủ chiến dịch đến **1936**, theo `docs/spec/MASTER_SPEC_VI.md`.
- **Sandbox / Alternate History:** được tự do hơn nhiều. Không bắt buộc tái hiện chuỗi người cai trị, sự kiện hay kết quả lịch sử sau ngày bắt đầu; thế giới được phát triển theo logic mô phỏng và quan hệ nhân quả.
- **Shared baseline:** hai chế độ có thể dùng chung trạng thái khởi đầu 1836. Sự khác biệt là lớp dữ liệu/lực đẩy lịch sử được sử dụng sau thời điểm bắt đầu.
- Các gói R3ab–R3af về châu Phi chỉ là các lát cắt nghiên cứu, **không phải giới hạn địa lý** của dự án.

## 2. Historical Mode: chính xác nhưng không railroad

Đặc tả gốc tại `MASTER_SPEC_VI.md` §§2.2, 10.2 quy định kết quả lịch sử không bị hard-code thành kết quả bắt buộc. Vì vậy:

1. Trạng thái 1836, nhân vật, chính thể, mục tiêu, quan hệ, lãnh thổ và sự kiện ban đầu phải có nguồn và đúng ngày.
2. AI phải có bối cảnh, động cơ, ưu tiên và cửa sổ quyết định lịch sử phù hợp từng polity; không dùng một bộ tính cách chung làm thay cho hiểu biết lịch sử.
3. Khi các nguyên nhân lịch sử còn tồn tại, Historical Mode cần có xu hướng tái hiện các quỹ đạo lịch sử đã biết.
4. Nếu người chơi/AI thay đổi nguyên nhân (chiến tranh, cải cách, liên minh, cách mạng, chính sách, lãnh thổ…), kết quả có thể rẽ nhánh.
5. Sai lệch lớn phải có nguyên nhân và dấu vết giải thích. Không được xem “kết quả không bị ép” là giấy phép dùng dữ liệu sai hoặc sinh lịch sử tùy tiện.
6. Sandbox không bị ràng buộc bởi các succession/event rail lịch sử sau 1836; vẫn cần tính nhất quán nội tại.

## 3. Đơn vị lịch sử: không mặc định mọi polity có một vị vua

Mỗi timeline phải xác định đúng chủ thể, cơ quan và phạm vi quyền lực:

- Nguyên thủ hợp hiến; người đứng đầu chính phủ; người cai trị thực tế.
- Nhiếp chính, đồng trị, người kế vị được tuyên bố nhưng chưa được công nhận, người kiểm soát thực địa.
- Hội đồng, chức vụ luân phiên, thủ lĩnh liên minh/bộ tộc, imam, shehu, emir, sultan, monarch hoặc chức vụ địa phương có tên gọi lịch sử riêng.
- Thống đốc thuộc địa/công ty được bổ nhiệm bởi một đế quốc/công ty; người đứng đầu bản địa trong cùng vùng.
- Chính quyền nổi dậy, chính phủ lưu vong, nhà nước chưa được công nhận hoặc chính thể đang tranh chấp.
- Thủ lĩnh/chính quyền của một subject, protectorate, princely state hoặc autonomous region.

Phải tách riêng:
- **de jure sovereignty** — chủ quyền theo pháp lý/được công nhận;
- **de facto control** — quyền lực thực tế;
- **local authority** — quyền lực bản địa/địa phương;
- **overlord/colonial authority** — quyền lực bá chủ/thuộc địa;
- **personal office** — chức vụ cá nhân mà một người đang nắm giữ.

Không dùng “độc lập”, “vua”, “tổng thống”, “thống đốc” hay “nguyên thủ quốc gia” nếu bằng chứng và bối cảnh thể chế không hỗ trợ. Với confederation, council, rotating office hoặc decentralized society, không bịa ra một cá nhân duy nhất để lấp ô dữ liệu.

## 4. Chuẩn nguồn và provenance

### 4.1. Thứ tự ưu tiên nguồn

1. **Nguồn sơ cấp đương thời:** công báo, sắc lệnh, hiệp ước, thư từ, biên bản nghị viện/hội đồng/pitso, sổ triều đình, hồ sơ hành chính, báo cáo ngoại giao, census, bản đồ, tài liệu lưu trữ.
2. **Nghiên cứu học thuật có phản biện:** chuyên khảo của nhà xuất bản đại học, bài peer-reviewed, luận án học thuật, từ điển/encyclopedia chuyên ngành có biên tập.
3. **Cơ quan lưu trữ, bảo tàng, đại học, tổ chức lịch sử uy tín:** sử dụng khi có tác giả/cơ quan, tài liệu gốc và locator rõ.
4. **Báo chí, website tổng hợp, bách khoa mở:** dùng để tìm đầu mối/đối chiếu phụ, không là nguồn duy nhất cho dữ kiện quan trọng trong Historical Mode.
5. **Wikipedia:** công cụ discovery/đầu mối; không phải nguồn đủ để chấp thuận một mốc kế vị quan trọng. Phải truy ngược nguồn dẫn trong bài hoặc thay bằng nghiên cứu có thẩm quyền.

### 4.2. Yêu cầu với từng dữ kiện

Mỗi nhân vật, mốc chức vụ, sự kiện, lãnh thổ hoặc số liệu quan trọng cần có:
- `source_id` và locator cụ thể (trang, mục, số văn bản, archive shelfmark hoặc đoạn).
- Tác giả/cơ quan, tên tài liệu, ấn bản, năm xuất bản và ngày truy cập đối với nguồn trực tuyến.
- Loại nguồn: primary / secondary / reference / dataset.
- Cấp độ đã kiểm tra: toàn văn, đoạn trích, abstract/metadata, transcription, ảnh trang scan hay chỉ search snippet.
- Phạm vi địa lý/thời gian và giới hạn của nguồn.
- Độ chắc chắn; các nguồn mâu thuẫn phải được giữ lại, không tự chọn ngày thuận tiện.

Không dùng một cuốn sách tổng quan về lịch sử thế kỷ XIX làm căn cứ ngầm cho hàng trăm ngày sinh, ngày mất hoặc nhiệm kỳ riêng lẻ mà không có locator theo từng record.

### 4.3. Quy tắc xác nhận

- Mốc có hậu quả chính trị lớn (đảo chính, phế truất, độc lập, sáp nhập, đổi chế độ, chiến tranh, kế vị tranh chấp) cần ít nhất một nguồn sơ cấp hoặc một nghiên cứu học thuật trực tiếp xử lý sự kiện; khi có mâu thuẫn, đối chiếu nguồn độc lập thứ hai.
- Ngày chính xác chỉ dùng khi nguồn hỗ trợ độ chính xác đó. Nguồn chỉ ghi năm/tháng thì giữ năm/tháng.
- Khi tư liệu khan hiếm, có thể dùng một nghiên cứu học thuật tốt nhưng phải gắn `supported` hoặc `uncertain` phù hợp; không suy ra ngày cụ thể.
- Tách “nguồn xác nhận”, “tác giả suy luận”, “ước tính”, “tranh chấp” và “chưa biết”.

## 5. Chuẩn thời gian và nhân vật

- Không tự điền 01/01 hoặc 31/12 để biến dữ kiện chỉ có năm thành ngày chính xác.
- Giữ rõ precision `day / month / year / circa / range`. Nếu schema ISO hiện tại không biểu diễn đủ precision, mở yêu cầu schema riêng thay vì làm giả độ chính xác.
- Phân biệt ngày tuyên bố, ngày được công nhận, ngày nhậm chức, lễ đăng quang, ngày kiểm soát thực tế, ngày mất, ngày bị phế truất và ngày chế độ mới có hiệu lực.
- Với lịch Julian, Gregorian, Hijri và lịch địa phương: ghi ngày nguồn, phương pháp chuyển đổi và ngày chuẩn hóa.
- Không gộp người cùng tên nhưng khác cá nhân; không tách một nhân vật thành nhiều người chỉ vì khác phiên âm/tước hiệu.
- Nhiếp chính, đồng trị, tổng thống lâm thời, chủ tịch luân phiên và thống đốc thuộc địa phải có vai trò riêng.
- Một người có thể đồng thời giữ nhiều office; một polity có thể có nhiều tầng quyền lực. Không copy một nhiệm kỳ thành nhiều “nguyên thủ” nếu quan hệ chức vụ không được xác minh.

## 6. Phạm vi lịch sử toàn cầu cần được kiểm

Historical Mode không chỉ là file danh sách vua. Mỗi polity/khu vực cần được kiểm theo các lớp:

1. **Polity identity:** tên lịch sử, loại chính thể, tình trạng công nhận và quan hệ phụ thuộc.
2. **Territory/sovereignty:** biên giới, chủ quyền, kiểm soát thực tế, vùng tranh chấp, bảo hộ, thuộc địa, sáp nhập và tan rã.
3. **Political offices:** nguyên thủ, người đứng đầu chính phủ, regent, governor, council, người kế vị và chức vụ địa phương.
4. **Institutions/government:** triều đại, luật kế vị, bổ nhiệm/bầu cử, thiết chế địa phương và quyền tự trị.
5. **Population/society:** dân số đúng phạm vi/ngày, nhóm dân cư, nô lệ/lao động cưỡng bức/di cư, tôn giáo, ngôn ngữ và cấu trúc xã hội.
6. **Economy/technology:** công nghiệp, thương mại, thuế, hạ tầng, tài nguyên và kỹ thuật; mọi proxy phải được gắn nhãn.
7. **Military/diplomacy:** chiến tranh, lực lượng, tổ chức, hiệp ước, chư hầu, liên minh, khủng hoảng và áp lực ngoại bang.
8. **Events/characters:** sự kiện có điều kiện, nhân vật, ngày, tác nhân, nguyên nhân, hậu quả và nguồn.
9. **Historical AI intent:** ưu tiên chiến lược, ràng buộc và quyết định có thể giải thích; không dùng bias chung thay cho bối cảnh từng nước.
10. **Chronicle/divergence:** lưu ngày, tác nhân, nguyên nhân và khác biệt so với lịch sử tham chiếu.

## 7. Độ tin cậy

- `verified`: nguồn trực tiếp/primary phù hợp, thông tin nhất quán và đã được kiểm tra.
- `supported`: nghiên cứu học thuật đáng tin hỗ trợ rõ, nhưng chưa đạt mức kiểm chứng trực tiếp cao nhất.
- `estimated`: phương pháp/giả định/range được ghi rõ; không hiển thị như sự thật chính xác.
- `uncertain`: có mâu thuẫn hoặc nguồn yếu; phải chỉ ra điều gì chưa biết.
- `missing`: chưa có chứng cứ đủ dùng; fallback phải có nhãn, không giả vờ là dữ liệu lịch sử.

Không tự động gán `supported` chỉ vì record có một tên nguồn. Một link hỏng, một abstract, một search snippet hay một mục Wikipedia không đủ để biến dữ kiện thành `verified`.

## 8. Lộ trình phủ dữ liệu toàn cầu

### G0 — Chuẩn và baseline
- Chốt source policy, role taxonomy, date precision và phạm vi 1836–1936.
- Audit 181 entity registry, 147 country profiles và các timeline hiện có.
- Tách active 1836 polity, future polity, subject component, colonial administration và decentralized placeholder.

### G1 — Sửa chất lượng dữ liệu hiện có
- Đối chiếu toàn bộ 439 succession records; không chỉ thêm mới.
- Truy nguồn học thuật/primary cho record chỉ dựa Wikipedia; xử lý record thừa hưởng nguồn mặc định không có locator.
- Kiểm tra alignment 1836-01-01, khoảng trống, nhiệm kỳ chồng lấn, tên/chức vụ và timeline dừng sớm.
- Các khoảng trống có thể là interregnum, nội chiến hoặc chính quyền lâm thời; nghiên cứu nguồn trước khi kết luận là lỗi.

### G2 — Phủ các profile còn thiếu
- Nghiên cứu 54 polity có country profile nhưng chưa có succession array.
- Phân luồng council/confederation/aggregate/decentralized/subject/local authority; không ép tạo một danh sách vua.
- Với future polity, nghiên cứu formation timeline và người lãnh đạo ban đầu khi chính thể xuất hiện.

### G3 — Mở rộng đến hết 1936
- Bổ sung nhân vật và chuyển giao chức vụ 1901–1936 cho mọi khu vực và thể chế phù hợp.
- Kiểm tra tồn tại/giải thể polity, hình thành quốc gia, thuộc địa hóa/phi thực dân hóa, đế quốc và liên bang.
- Liên kết nhà nước tương lai với formation events thay vì chỉ sinh một lãnh đạo ngẫu nhiên.

### G4 — Đồng bộ với thế giới lịch sử
- Nối succession với political transitions, border/ownership history, wars, treaties, milestones, decision windows và events.
- Bảo đảm người đứng đầu, chính thể, chủ quyền và lãnh thổ tại cùng một ngày không mâu thuẫn.
- Mọi rẽ nhánh lịch sử phải có điều kiện và nguyên nhân truy vết được.

### G5 — Kiểm định
- Chọn case tại đủ 12 macro-region và nhiều loại polity: sovereign, subject, colony/company, rebel, confederation/decentralized, future.
- Historical Mode: nhiều seed, so timeline, đo sai lệch và kiểm tra giải thích divergence.
- Sandbox: nhiều seed, bảo đảm không bị historical rails ép buộc sau 1836.
- Ước tính/uncertain không được tính là verified trong coverage score.

## 9. Baseline hiện tại

Audit và ma trận từng entity:
- `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
- `docs/audit/GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv`

Tại baseline SHA ghi ở đầu tài liệu:
- 181 political entities trong registry.
- 147 country profiles (136 core + 11 detailed).
- 93 succession arrays / 439 leader records.
- 54/147 profiles chưa có succession array.
- 288 records chỉ trích Wikipedia; 93 records không có nguồn riêng cấp record và chỉ thừa hưởng hai nguồn mặc định toàn cục.
- File succession mô tả 1836–1900 trong khi Master Spec quy định campaign 1836–1936.
- Date precision, authority role modelling và engine selection là backlog cần xử lý có evidence, không tự sửa lén trong gói tài liệu này.

## 10. Cổng phê duyệt

Đây là tiêu chuẩn nghiên cứu và phạm vi toàn dự án, không tự cấp phép thay đổi runtime. Mọi sửa `historical_data/`, schema, engine, events, country profiles, political registry, save format hoặc tests phải là task cụ thể, có base SHA, review độc lập, kiểm thử và phạm vi được chủ dự án cho phép.

**Mục tiêu:** Historical Mode có dữ kiện lịch sử toàn cầu chính xác, nhất quán và truy nguyên được; Sandbox có quyền tạo lịch sử thay thế tự do nhưng vẫn nhất quán về nhân quả.
