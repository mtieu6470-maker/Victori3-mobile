# AI_START_HERE — Victori3 Mobile

> **ĐIỂM VÀO BẮT BUỘC CHO CHATGPT, CLAUDE CODE VÀ MỌI AI/CONTRIBUTOR.** Đọc file này trước khi sửa code. Đây là chỉ mục điều hướng; các quyết định, trạng thái và tiêu chuẩn chi tiết nằm trong tài liệu được liên kết bên dưới.

**Repository:** [mtieu6470-maker/Victori3-mobile](https://github.com/mtieu6470-maker/Victori3-mobile)  
**Nhánh phát triển hiện được chỉ định:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Amendment thời kỳ chiến dịch (20/11/2026):** chiến dịch bao trùm từ tháng 1/1836 đến tháng 12/2026, theo `docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md`. Phạm vi dữ liệu lịch sử sau 1936 vẫn phải được nghiên cứu và nguồn hóa riêng; không được coi việc mở rộng lịch game là bằng chứng dữ liệu đã đầy đủ.
**Nguyên tắc sản phẩm của chủ dự án:** [OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md](docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md)  
**Chỉ thị mới nhất về parity Victoria 3, media đầy đủ và mục tiêu game 4–5 GB:** [OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md](docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md)  
**Master brief triển khai và phân nhiệm Claude (đọc toàn bộ):** [CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md](docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md)  
**Phân quyền mới (21/11/2026):** Claude Code là primary implementation/code-authoring agent; ChatGPT là technical lead và reviewer độc lập khi không đồng tác giả. Việc đổi vai trò không mở phase gate.  
**Bảng bàn giao/trạng thái hiện hành:** [AI_HANDOFF.md](docs/coordination/AI_HANDOFF.md)  
**Quy trình phối hợp và phân quyền:** [AI_COLLABORATION_PROTOCOL.md](docs/coordination/AI_COLLABORATION_PROTOCOL.md)

---

## 0. Quy tắc tiếp quản trong một phiên mới

**Quy trình chi tiết bắt buộc:** [SESSION_RECOVERY_PROTOCOL_VI.md](docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md). Tài liệu này quy định cách phục hồi khi mạng nghẽn, GitHub timeout, chat không trả lời, phản hồi bị mất hoặc thao tác ghi có kết quả không rõ. Không được bỏ qua.

Không yêu cầu chủ dự án nhắc lại các nguyên tắc đã lưu tại đây. Khi được giao tiếp tục dự án:

1. Xác nhận đúng repository, branch và HEAD trực tiếp từ GitHub. Không dùng SHA trong chat cũ làm HEAD hiện tại.
2. Đọc file này, `AGENTS.md`, `CLAUDE.md` (nếu áp dụng), [SESSION_RECOVERY_PROTOCOL_VI.md](docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md), [AI_HANDOFF.md](docs/coordination/AI_HANDOFF.md), [AI_COLLABORATION_PROTOCOL.md](docs/coordination/AI_COLLABORATION_PROTOCOL.md), [OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md](docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md) và TOÀN BỘ [OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md](docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md). Không chỉ đọc tóm tắt.
   - Đọc TOÀN BỘ [CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md](docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md), đặc biệt phân nhiệm, dependency S0–S23, causal loops và definition of done.
3. Đọc roadmap/owner decisions, phase gate, subsystem spec, parity matrix và báo cáo tiến độ mới nhất được AI_HANDOFF chỉ định.
4. Kiểm tra commit, diff, file đã đổi, workflow/CI và artifact để xác định chính xác phiên trước đã lưu đến đâu. Nếu phản hồi chat bị mất sau một thao tác ghi, phải kiểm tra GitHub trước khi thử lại; không được tạo commit/file trùng.
5. Phân loại rõ phần đã commit, đã xác minh, CI đang chạy/thất bại, chưa commit và chưa xác định. Nếu GitHub không truy cập được sau retry có giới hạn, dừng ghi và báo BLOCKED; không suy đoán.
6. Xác định task còn dở và phạm vi được phép. Nếu gate đóng hoặc thiếu owner approval thì không triển khai runtime.
7. Chia việc thành lát cắt nhỏ; sau mỗi lát cắt có ý nghĩa, chạy test, cập nhật báo cáo + AI_HANDOFF, commit/push và đọc lại GitHub để xác minh.
8. Khi kết thúc hoặc phải dừng, ghi exact SHA, bằng chứng, phần chưa lưu/chưa xác minh, lỗi mạng/quyền và hành động tiếp theo. Không tuyên bố hoàn thành nếu chưa đủ bằng chứng.

**Xử lý chat bị treo:** người dùng không cần dán lại toàn bộ yêu cầu. Có thể mở phiên mới và gửi: "Tiếp quản Victori3 Mobile từ GitHub theo AI_START_HERE và SESSION_RECOVERY_PROTOCOL. Kiểm tra HEAD, handoff, commit và CI trước; tiếp tục task dở dang, không làm trùng." Phiên mới phải kiểm tra GitHub trước khi thực hiện bất kỳ thao tác ghi nào.

**Nếu kết nối GitHub không tự đưa nội dung file vào ngữ cảnh:** AI phải chủ động mở các file trên repository trước khi làm. Kết nối repo không tự động chứng minh AI đã đọc tài liệu.

**Nếu tài liệu mâu thuẫn:** dừng thay đổi có ảnh hưởng, ghi rõ nguồn xung đột và xin quyết định nhỏ nhất cần thiết. Chat cũ không được ghi đè quyết định đã duyệt.

---

## 1. Đích sản phẩm

Xây dựng một trò chơi đại chiến lược xã hội–kinh tế trên Android, lấy Victoria 3 làm chuẩn tham chiếu về độ sâu hệ thống, phạm vi gameplay và cách thông tin được trình bày. Mục tiêu không phải tạo bản đồ đẹp hoặc menu giống giao diện; mục tiêu là một thế giới mô phỏng có thể chơi, nơi các hệ thống tác động qua lại và tạo ra diễn biến khó đoán nhưng hợp lý.

**Chuẩn hoàn chỉnh:** học và tái triển khai toàn bộ hệ thống gameplay của Victoria 3 (base game và các expansion/immersion/mechanics pack gameplay đã phát hành trong phiên bản tham chiếu), không chọn một vài hệ thống dễ làm rồi gọi là hoàn chỉnh. Đồng thời phải có thư viện hình ảnh, video/animation, âm nhạc và hiệu ứng âm thanh phong phú, chất lượng cao. Mục tiêu dung lượng là khoảng **4–5 GB cho game đầy đủ sau khi cài đủ nội dung**, không phải APK lõi đơn lẻ; xem chỉ thị owner mới nhất để biết yêu cầu chi tiết.

### Hai chế độ, một engine

- **Historical Mode:** bắt đầu từ 01/01/1836 và có thời kỳ chiến dịch đến 12/2026; dữ liệu lịch sử ở mọi mốc phải có nguồn và đúng niên đại. Các sự kiện/lực lượng lịch sử tạo bối cảnh và cơ hội, không ép kết quả lịch sử phải diễn ra giống hệt.
- **Sandbox / Alternate History:** dùng cùng engine và cùng quy tắc cốt lõi. Sau thời điểm bắt đầu, người chơi và AI được phép tạo ra diễn biến khác lịch sử.
- **Quan sát:** cho phép xem thế giới và AI tự vận hành nếu được thiết kế trong phạm vi game.
- Không tạo một engine giả riêng cho từng chế độ, không hard-code kết quả lịch sử vào logic mô phỏng.

### Tiêu chí nhìn nhận “giống Victoria 3”

Một tính năng chỉ được tính là có khi:
- Người chơi có thể xem và hiểu trạng thái của nó.
- Có hành động/quyết định thực sự tác động lên trạng thái game.
- Có quy tắc mô phỏng và dữ liệu hợp lệ.
- Có tương tác với các hệ thống liên quan.
- Kết quả thay đổi theo thời gian, quốc gia, điều kiện và hành động.
- Có test cho trường hợp bình thường, biên và lỗi.
- Có thể lưu, tải và tiếp tục mà không mất trạng thái.

Menu, nút bấm, số hiển thị, placeholder, hoặc dữ liệu tĩnh không được tính là hệ thống hoàn chỉnh.

---

## 2. Tóm tắt chi tiết từng hệ thống gameplay cần có

Danh sách dưới đây là bản phân rã yêu cầu sản phẩm để theo dõi parity. Đây không phải tuyên bố rằng các hệ thống đã được triển khai. Trạng thái thực tế phải căn cứ vào source code, test, CI, save data và thiết bị Android tại HEAD được kiểm tra.

### 2.1. Thế giới, bản đồ và địa lý

**Mục đích:** tạo sân chơi toàn cầu có ranh giới, địa hình, vùng chiến lược và thông tin địa lý nhất quán.

Cần có:
- Thế giới chia thành quốc gia, state/province hoặc đơn vị địa lý mô phỏng phù hợp; định danh phải ổn định qua save/load và các phiên bản data pack.
- Biên giới chính trị, chủ quyền, vùng tranh chấp, thuộc địa, vùng phụ thuộc và quyền kiểm soát quân sự phải là các khái niệm phân biệt, không gom thành một màu tô bản đồ.
- Địa hình, sông, biển, eo biển, cảng, bờ biển và khả năng tiếp cận địa lý ảnh hưởng đến di chuyển, xây dựng, tiếp tế và thương mại.
- Strategic regions/sea regions hoặc phân vùng tương đương để tổ chức AI, ngoại giao và chiến tranh.
- Các chế độ hiển thị/lens: chính trị, dân số, văn hóa/tôn giáo, kinh tế, hàng hóa/thị trường, cơ sở hạ tầng, quân sự, ngoại giao, thuộc địa và các lớp phù hợp khác.
- Phóng to/thu nhỏ phải thay đổi mật độ chi tiết; tránh render toàn bộ nhãn/đối tượng ở mọi mức zoom.
- Chọn một vùng phải mở được thông tin và dẫn liên kết sang dân số, công trình, thị trường, chủ quyền, quân đội và lịch sử của vùng đó.

**Liên kết hệ thống:** quốc gia, Pop, building site, hàng hóa, thị trường, logistics, di chuyển, chiến tranh và sự kiện.

**Nghiệm thu:** chọn một vùng bất kỳ trên thế giới, xem được thuộc tính, chủ sở hữu, dân số, kinh tế và kết nối địa lý; khi biên giới/chủ quyền đổi thì bản đồ, dữ liệu và save cùng phản ánh nhất quán.

### 2.2. Quốc gia, nhà nước và chủ quyền

**Mục đích:** mỗi polity là một tác nhân có chính phủ, lãnh thổ, năng lực, ngân sách và mục tiêu.

Cần có:
- Hồ sơ quốc gia: định danh, tên theo thời kỳ, chính thể, thủ đô/trung tâm, rank/prestige hoặc chỉ số vị thế, chủ quyền và phạm vi lãnh thổ.
- Quan hệ giữa quốc gia độc lập, chư hầu, protectorate, dominion, liên bang/liên minh, lãnh thổ phụ thuộc và các cấu trúc lịch sử tương ứng.
- Cơ chế hình thành quốc gia, thống nhất, phân tách, giải thể, thay đổi chính thể và kế thừa quyền lực.
- Quốc gia có ngân sách, luật, chính phủ, Pop, thị trường/quyền tiếp cận thị trường, ngoại giao và lực lượng vũ trang riêng.
- Không giả định mọi thực thể lịch sử đều là quốc gia hiện đại có biên giới và chủ quyền kiểu hiện nay.

**Liên kết:** bản đồ, lịch sử, diplomacy, laws, market, military, colonization và AI.

**Nghiệm thu:** thay đổi chủ quyền hoặc hình thành/giải thể quốc gia phải cập nhật đồng bộ lãnh thổ, ngoại giao, kinh tế, quân sự, UI và save.

### 2.3. Dân số / Pops / Population Cohorts

**Mục đích:** dân cư là trung tâm của mô phỏng, không phải một con số tổng.

Mỗi Pop hoặc cohort phải mô tả được các thuộc tính phù hợp với mô hình đã duyệt: quy mô dân số, vùng cư trú, nghề nghiệp/tầng lớp, văn hóa, tôn giáo, mức giàu có/thu nhập, trình độ học vấn, qualification, tình trạng việc làm và thuộc tính chính trị/xã hội cần thiết.

Cần có:
- Sinh, tử, tăng/giảm dân số, tuổi/cơ cấu tuổi nếu có dữ liệu và mô hình được duyệt.
- Chuyển nghề, thất nghiệp, tuyển dụng, sa thải, di cư nội địa/quốc tế.
- Thay đổi văn hóa/tôn giáo khi có điều kiện và bằng chứng lịch sử/mô hình được duyệt.
- Phân biệt dữ liệu chưa biết với giá trị bằng 0; không tự gán một tôn giáo/văn hóa/nationality cho nhóm thiếu bằng chứng.
- Tổng quy mô cohort phải bảo toàn qua merge/split và di chuyển; không tạo hoặc mất population do lỗi làm tròn.
- Aggregate region/national phải được tính nhất quán từ cohort nguồn; tránh lưu hai nguồn chân lý mâu thuẫn.
- Cohort identity phải ổn định, có versioning và migration an toàn.

**Liên kết:** lao động, sản xuất, tiêu dùng, thuế, standard of living, interest groups, migration, radicals/loyalists và chiến tranh.

**Nghiệm thu:** một thay đổi về công trình hoặc luật tạo ra biến động có thể kiểm chứng ở tuyển dụng/thu nhập/nhu cầu/chính trị; tổng dân số được bảo toàn theo quy tắc đã định.

### 2.4. Nhu cầu dân cư và mức sống (Needs / Standard of Living)

**Mục đích:** thể hiện người dân sống tốt lên hoặc nghèo đi do thu nhập, giá hàng hóa, thuế, luật và điều kiện xã hội.

Cần có:
- Nhóm nhu cầu và hàng hóa phục vụ nhu cầu theo từng tầng lớp/điều kiện.
- Khả năng mua hàng dựa trên thu nhập/wealth, giá hàng hóa, khả năng tiếp cận thị trường và các ràng buộc được mô hình hóa.
- Standard of Living hoặc chỉ số tương đương phải được tính từ các yếu tố giải thích được, không phải điểm tăng tùy ý.
- Thiếu hàng, giá tăng, thất nghiệp, thuế hoặc chiến tranh có thể làm giảm mức sống.
- Thu nhập, việc làm, năng suất, giáo dục, phúc lợi và nguồn cung có thể cải thiện mức sống.
- Bất mãn/radicalism phải có cơ chế liên quan đến trải nghiệm thực tế, không chỉ random.

**Liên kết:** market, Pop, wages, budget, laws, welfare, politics và migration.

**Nghiệm thu:** gây ra thiếu hụt một hàng hóa thiết yếu phải tác động được đến nhu cầu được đáp ứng và mức sống của nhóm Pop liên quan; tooltip cho biết nguyên nhân.

### 2.5. Hàng hóa, công trình và chuỗi sản xuất

**Mục đích:** nền kinh tế sản xuất/tiêu thụ hàng hóa bằng lao động, đầu vào, công nghệ và vốn.

Cần có:
- Goods Registry có ID ổn định, đơn vị, nhóm hàng, đặc điểm sử dụng và nguồn dữ liệu.
- Buildings/Building Types và Building Sites phải phân biệt loại công trình với địa điểm/cơ sở đang tồn tại.
- Level/quy mô, mức hoạt động, tình trạng xây dựng, chủ sở hữu, workforce và chi phí phải có quy tắc rõ.
- Production Methods quyết định đầu vào, đầu ra, năng suất, công nghệ, nhu cầu lao động và loại nghề.
- Tuyển dụng theo qualification và nguồn lao động có sẵn; thiếu nhân lực phải giới hạn sản xuất.
- Lương, lợi nhuận, chi phí đầu vào, cổ tức/ownership và quyết định đầu tư tác động tới Pop và doanh nghiệp.
- Chuỗi sản xuất: nguyên liệu → chế biến → hàng trung gian → hàng tiêu dùng/tư liệu sản xuất; có thể nhập khẩu khi thiếu và xuất khẩu khi dư.
- Construction phải tiêu thụ nguồn lực, lao động, thời gian và ngân sách; công trình không được xuất hiện tức thời nếu mô hình không cho phép.
- Đóng cửa/giảm công suất khi thua lỗ hoặc không có đầu vào phù hợp.

**Liên kết:** labor, goods, market, technology, transport, treasury, ownership và Pop wealth.

**Nghiệm thu:** thay đổi Production Method làm thay đổi input/output/workforce; thiếu input làm giảm công suất; tăng sản lượng tác động lên giá và thu nhập trong mô hình thị trường.

### 2.6. Thị trường, giá cả và thương mại

**Mục đích:** hàng hóa di chuyển trong một hệ thống cung–cầu có giá và giới hạn thực tế.

Cần có:
- Market membership và market access được xác định theo quan hệ/chính sách/địa lý đã duyệt.
- Cung, cầu, lượng mua/bán, tồn kho, shortage/surplus và giá phải có công thức hoặc thuật toán được mô tả.
- Các hàng hóa có thể tác động lẫn nhau qua chuỗi sản xuất; giá đầu vào ảnh hưởng chi phí và giá đầu ra.
- Trade routes có đối tác, hàng hóa, khối lượng, tuyến, capacity, chi phí, thuế/tariff và rủi ro.
- Khả năng nhập/xuất phụ thuộc cả chính sách và năng lực logistics, cảng, vận tải, quan hệ ngoại giao.
- Không để trade route tạo hàng hóa vô hạn hoặc bỏ qua bảo toàn vật chất.
- Cần có cơ chế cho thị trường trong nước và quốc tế, tùy thiết kế đã duyệt.

**Liên kết:** production, Pop needs, transport, tariff, diplomacy, naval security, treasury.

**Nghiệm thu:** cắt tuyến nhập khẩu quan trọng hoặc phá hủy năng lực cung ứng phải tạo phản ứng định lượng trong giá/thiếu hụt/đầu vào và các Pop/ngành chịu ảnh hưởng.

### 2.7. Hạ tầng và logistics dân sự

**Mục đích:** địa lý và hạ tầng giới hạn khả năng vận chuyển hàng hóa, kết nối thị trường và phát triển kinh tế.

Cần có:
- Roads/railways/ports/canals hoặc cơ sở hạ tầng tương đương theo thời đại.
- Capacity, maintenance, construction cost và thời gian xây dựng.
- Kết nối địa lý, tuyến đường, thời gian, chi phí, giới hạn năng lực.
- Infrastructure shortage làm giảm market access hoặc gây tắc nghẽn theo mô hình.
- Cảng và hải vận ảnh hưởng thương mại đường biển và convoy.
- Công nghệ mở khóa hoặc cải thiện phương tiện/hạ tầng.

**Liên kết:** map, construction, market, goods flow, trade, military supply và technology.

**Nghiệm thu:** thiếu capacity trên tuyến quan trọng phải hạn chế lượng vận chuyển hoặc tăng chi phí/thời gian; mở rộng hạ tầng phải có chi phí và hiệu ứng đo được.

### 2.8. Ngân khố, thuế và tài chính quốc gia

**Mục đích:** nhà nước có nguồn thu, chi tiêu, nợ, khả năng vay và giới hạn tài khóa.

Cần có:
- Thuế theo cơ sở đánh thuế/phương thức đánh thuế đã chọn; tác động đến Pop và doanh nghiệp.
- Thu nhập từ thuế, tariffs, dividends/thu nhập nhà nước và các nguồn hợp lệ khác.
- Chi thường xuyên: lương công chức, quân đội, navy, institutions, subsidies, welfare, construction, interest payments.
- Treasury balance, reserves, debt, credit/borrowing và lãi suất khi có mô hình tương ứng.
- Default/financial crisis hoặc khủng hoảng nợ phải có hậu quả và điều kiện rõ ràng.
- Ngân sách tác động lên legitimacy, dịch vụ công, năng lực hành chính, công trình và chiến tranh.

**Liên kết:** Pop wealth, buildings, trade, institutions, military và diplomacy.

**Nghiệm thu:** mỗi khoản thu/chi được truy vết; ngân sách không âm/đổi số vô cớ; thay đổi thuế phản ánh được trong thu ngân sách và nhóm chịu thuế.

### 2.9. Luật, chính phủ, năng lực và thể chế

**Mục đích:** luật pháp và bộ máy nhà nước thay đổi cách xã hội/vận hành kinh tế.

Cần có:
- Government structure/form và cách lập chính phủ.
- Law categories: citizenship, church/state, economic system, taxation, trade policy, land reform, education, health/welfare, policing, labor rights, migration, military model và những lĩnh vực phù hợp với thời kỳ.
- Luật có điều kiện hợp lệ, bên ủng hộ/chống, tiến trình thông qua, khả năng thất bại và hệ quả.
- Institutions có cấp độ, ngân sách/năng lực, phạm vi tác động và chi phí vận hành.
- Authority, Bureaucracy, Influence hoặc năng lực tương đương là tài nguyên hữu hạn có nguồn/cách dùng rõ.
- Thay luật phải tạo thay đổi về Pop, doanh nghiệp, thuế, giáo dục, quân dịch, migration hoặc quyền chính trị; không chỉ đổi nhãn.

**Liên kết:** interest groups, Pop, economy, treasury, technology, legitimacy và unrest.

**Nghiệm thu:** đề xuất và thông qua một luật phải trải qua tiến trình được mô tả; thay đổi thực sự làm thay đổi hành vi/chỉ số liên quan.

### 2.10. Interest Groups, phong trào, tính chính danh và cách mạng

**Mục đích:** mô phỏng xung đột lợi ích và biến động chính trị bên trong quốc gia.

Cần có:
- Interest Groups đại diện các lợi ích xã hội (ví dụ địa chủ, công nghiệp, giáo sĩ, nông dân, quân đội, lao động), với quy mô và ảnh hưởng từ thành phần Pop/cơ cấu quyền lực.
- Ideology và stance theo từng lĩnh vực luật; không ép mọi nhóm vào một trục trái/phải đơn giản.
- Approval/loyalty, clout, government membership, legitimacy và political strength phải giải thích được.
- Political movements có mục tiêu, điều kiện hình thành, sự ủng hộ, mức độ cấp bách và kết quả.
- Radical/loyalist hoặc trạng thái tương đương phản ánh bất mãn/ủng hộ, có đầu vào từ kinh tế và chính sách.
- Revolutions/civil conflict có ngưỡng, tiến trình, phe phái, lãnh thổ, quân đội, hậu quả và điều kiện kết thúc.

**Liên kết:** Pop, laws, SOL, economy, characters, military, events.

**Nghiệm thu:** khủng hoảng kinh tế hoặc luật gây tranh cãi có thể làm đổi approval/legitimacy/movement; kết quả chính trị tác động ngược lại luật và hoạt động nhà nước.

### 2.11. Công nghệ, nghiên cứu và lan truyền tri thức

**Mục đích:** công nghệ mở ra năng lực kinh tế, xã hội và quân sự theo thời đại.

Cần có:
- Các nhánh nghiên cứu (production, society, military hoặc phân loại được duyệt).
- Prerequisites, chi phí, thời gian, tốc độ nghiên cứu, mức ưu tiên và hiệu ứng công nghệ.
- Innovation/Research capacity có giới hạn và liên quan đến giáo dục/năng lực quốc gia.
- Technology spread/diffusion giúp các nước bắt kịp thông qua tiếp xúc, thương mại, literacy hoặc các điều kiện khác theo thiết kế.
- Công nghệ mở khóa building, production method, law, infrastructure, unit/formation hoặc phương pháp chiến tranh.
- Tránh công nghệ xuất hiện sai niên đại trong Historical Mode nếu không có điều kiện/ngoại lệ được chứng minh.

**Liên kết:** literacy, universities/education, production, institutions, military, trade và events.

**Nghiệm thu:** hoàn thành một công nghệ mở khóa đúng các đối tượng đã khai báo; hiệu ứng có thể kiểm tra trong gameplay.

### 2.12. Ngoại giao, quan hệ và cấu trúc quyền lực

**Mục đích:** quốc gia theo đuổi mục tiêu bằng quan hệ, hiệp ước, sức ép và đàm phán, không chỉ chiến tranh.

Cần có:
- Diplomatic relations/opinion, rivalries, alliances, defensive pacts, trade agreements, obligations và các thỏa thuận phù hợp.
- Subjects/overlord relationships với mức tự trị, nghĩa vụ, thu nhập, quyền kiểm soát và con đường thay đổi quan hệ.
- Power blocs hoặc tổ chức quốc tế/khu vực nếu thuộc phạm vi parity đã duyệt.
- Influence/capacity để duy trì quan hệ; giới hạn quan hệ và chi phí phải được giải thích.
- AI quốc gia có mục tiêu, đánh giá rủi ro, lợi ích, độ tin cậy và khả năng phản ứng.
- Quan hệ không chỉ là một điểm số: nó phải tác động tới khả năng ký kết, tham gia chiến tranh, tiếp cận thị trường và quyết định ngoại giao.

**Liên kết:** country AI, market, military, infamy, sovereignty, subjects và war.

**Nghiệm thu:** ký, hủy hoặc vi phạm hiệp ước phải cập nhật nghĩa vụ/quyền lợi và ảnh hưởng hành vi của các bên.

### 2.13. Diplomatic Plays, khủng hoảng và đàm phán

**Mục đích:** tạo giai đoạn leo thang căng thẳng trước chiến tranh; các nước khác có thể tham gia hoặc gây áp lực.

Cần có:
- Mục tiêu/đòi hỏi ban đầu, bên khởi xướng, bên chống đối, vùng/đối tượng tranh chấp.
- Giai đoạn leo thang và thời hạn phản ứng; counter-demands, backing và mobilization.
- Quốc gia thứ ba có thể chọn phe, giữ trung lập hoặc tận dụng tình thế dựa trên lợi ích.
- Back down/negotiation có thể giải quyết khủng hoảng mà không cần chiến tranh.
- Infamy/prestige/risk/cost hoặc chỉ số tương đương được tính từ quy tắc rõ.
- Kết quả chuyển sang chiến tranh, thỏa thuận, nhượng bộ hoặc kết thúc không thành công.

**Liên kết:** diplomacy AI, military mobilization, treasury, public opinion, territory và war support.

**Nghiệm thu:** một diplomatic play phải có thể kết thúc bằng nhiều kết quả có ý nghĩa; mọi bên tham gia được cập nhật chính xác.

### 2.14. Lục quân, tổ chức lực lượng và chỉ huy

**Mục đích:** lực lượng quân sự có cấu trúc, năng lực, quân số, trang bị và hậu cần.

Cần có:
- Military laws/model quyết định nghĩa vụ, conscription, professional forces hoặc cấu trúc tương ứng.
- Barracks/formation/unit/force pool phải có vai trò và định danh rõ; phân biệt quân thường trực, quân dự bị và lực lượng được huy động.
- Đơn vị có manpower, equipment, organization, training, morale/readiness hoặc thuộc tính đã duyệt.
- Generals/commanders có năng lực, trait, assignment, giới hạn và hệ quả.
- Mobilization tiêu thụ nhân lực, hàng hóa, tiền và có thể rút lao động khỏi nền kinh tế.
- Recruitment, reinforcement, casualties, demobilization và thay đổi chỉ huy có quy tắc rõ.

**Liên kết:** Pop labor, military goods, treasury, laws, logistics, fronts và battles.

**Nghiệm thu:** huy động/giải ngũ làm thay đổi quân số, nhân lực dân sự, chi tiêu và tiêu thụ hàng hóa; save/load không làm nhân đôi đơn vị.

### 2.15. Hải quân, convoy và chiến tranh trên biển

**Mục đích:** kiểm soát biển, tuyến thương mại, vận tải quân sự và khả năng tác chiến hải quân.

Cần có:
- Naval bases, fleets, ships/ship classes, admirals và vùng biển hoạt động.
- Convoy capacity, trade protection, naval invasions/transport khi được hỗ trợ.
- Blockade, escort, raiding và kiểm soát biển phải có tác động lên tuyến hàng hóa và tiếp tế.
- Sản xuất tàu, nhân lực thủy thủ, bảo trì, trang bị và công nghệ hải quân.
- Địa lý biển, cảng và khoảng cách giới hạn hoạt động.

**Liên kết:** trade routes, ports, market, diplomacy, military logistics và war.

**Nghiệm thu:** phong tỏa hoặc mất convoy phải làm giảm tuyến vận tải/tiếp tế liên quan; không cho quân vượt biển nếu không có năng lực vận tải phù hợp.

### 2.16. Mặt trận, trận đánh, tiếp tế và hòa ước

**Mục đích:** mô phỏng chiến tranh chiến lược theo mặt trận và hậu cần, không phải chỉ đổi màu lãnh thổ.

Cần có:
- Front formation/update từ biên giới và địa hình; chia/ghép khi lãnh thổ thay đổi.
- Advance/defend/standby hoặc mệnh lệnh chiến lược tương đương.
- Battle selection, lực lượng tham gia, địa hình, chỉ huy, tổ chức, công nghệ, trang bị và yếu tố ngẫu nhiên có kiểm soát.
- Supply chain, ammunition, artillery, food/fuel/medical hoặc hàng hóa hậu cần tùy thời kỳ.
- Attrition, casualties, reinforcement, occupation và control phải có quy tắc.
- War exhaustion/support và khả năng tiếp tục chiến tranh liên hệ với dân chúng, thiệt hại, ngân sách, mục tiêu.
- Peace terms/war goals, capitulation, treaty, reparations/territorial change và hậu chiến.

**Liên kết:** military units, navy, Pop, economy, logistics, diplomacy, treasury và map.

**Nghiệm thu:** chiến tranh kéo dài gây chi phí và hậu quả kinh tế/dân số; kết thúc chiến tranh cập nhật chủ quyền, hiệp ước, quân đội và save.

### 2.17. Thuộc địa, di cư, mở rộng và quan hệ bất bình đẳng

**Mục đích:** phản ánh các quá trình mở rộng lãnh thổ, định cư, tranh chấp và quan hệ đế quốc trong giai đoạn 1836–1936 một cách có căn cứ lịch sử.

Cần có:
- Claims, colonization rights/process, colonial administration và khả năng chống đối.
- Di cư do điều kiện sống, cơ hội việc làm, luật, phân biệt đối xử, chiến tranh và khả năng di chuyển.
- Subject/colonial status khác với ownership thông thường.
- Slavery, serfdom, forced labor, discrimination và các chế độ xã hội liên quan phải được mô tả đúng bản chất lịch sử, có nguồn và không giản lược thành bonus kinh tế.
- Tranh chấp thuộc địa, kháng cự, thay đổi chủ quyền và hệ quả dân số/kinh tế/chính trị.
- Không áp đặt ranh giới hiện đại vào quá khứ khi dữ liệu lịch sử cho thấy khác biệt.

**Liên kết:** map, country, diplomacy, Pop identity/migration, economy, military và events.

**Nghiệm thu:** các quan hệ chủ quyền/thuộc địa và di cư thay đổi có lịch sử; mọi trường hợp dữ liệu thiếu phải được gắn uncertainty.

### 2.18. Nhân vật, sự kiện, Journal và quyết định

**Mục đích:** biến các lực lượng cấu trúc thành trải nghiệm lịch sử cụ thể và mục tiêu chơi dễ hiểu.

Cần có:
- Characters: ruler, generals, political leaders, administrators hoặc vai trò phù hợp; có thời gian tồn tại, quan hệ, năng lực và kế thừa.
- Events có trigger/conditions, lựa chọn, effect, ngày/thời hạn, nguồn lịch sử và giới hạn tái kích hoạt.
- Journal entries/objectives/decisions giúp theo dõi mục tiêu, cơ hội và bối cảnh; không ép người chơi vào một tuyến cố định.
- Sự kiện Historical Mode phải là đúng thời kỳ và điều kiện; không chạy sự kiện theo ngày cố định nếu tiền đề không còn tồn tại.
- Sandbox được phép sinh kết quả khác lịch sử nhưng phải nhất quán với trạng thái mô phỏng.
- Lựa chọn hiển thị rõ hệ quả dự kiến và kết quả thật.

**Liên kết:** politics, diplomacy, wars, technology, country history và AI.

**Nghiệm thu:** event chỉ kích hoạt khi điều kiện đúng, không lặp vô hạn; lựa chọn làm thay đổi trạng thái đúng như mô tả và được lưu.

### 2.19. AI điều khiển quốc gia và thế giới tự vận hành

**Mục đích:** quốc gia không do người chơi điều khiển vẫn phải có hành vi có mục tiêu và phản ứng với tình hình.

Cần có:
- AI có mục tiêu quốc gia, ưu tiên nội bộ, đánh giá nguy cơ/nguồn lực/cơ hội và kế hoạch theo thời hạn.
- Quyết định xây dựng, thuế, luật, nghiên cứu, thương mại, ngoại giao, huy động quân và chiến tranh sử dụng chung các luật chơi với người chơi.
- AI phải xét giới hạn ngân sách, Pop, logistics, năng lực và dữ liệu tình báo; không được dùng thông tin mà người chơi không thể có nếu thiết kế yêu cầu fog-of-war.
- Có giới hạn số quyết định mỗi tick và cơ chế giảm tải toàn cầu.
- Lý do hành động phải có thể debug/ghi log ở mức không làm lộ thông tin nội bộ không cần thiết cho gameplay.
- Tránh các vòng lặp quyết định vô nghĩa, đổi luật liên tục hoặc xây công trình không có đầu vào/thị trường.

**Liên kết:** tất cả hệ thống gameplay. AI chỉ có ý nghĩa khi luật simulation thực sự thống nhất.

**Nghiệm thu:** chạy nhiều năm không điều khiển vẫn tạo diễn biến có lý; AI không phá save, không tạo tài nguyên vô hạn, không làm tick vượt ngân sách.

### 2.20. Giao diện, bản đồ tương tác và khả năng giải thích

**Mục đích:** trình bày lượng thông tin lớn như game đại chiến lược nhưng thao tác được trên màn hình điện thoại.

Cần có:
- Landscape là bố cục ưu tiên; bản đồ là trung tâm và các panel quản trị được tổ chức theo khu vực, tab, drawer hoặc overlay hợp lý.
- Màn hình quốc gia/vùng/Pop/building/goods/law/diplomacy/military phải có đường dẫn điều hướng qua lại và giữ context.
- Map lens cho từng mục tiêu; màu/ký hiệu/chú giải phải nhất quán, có khả năng phân biệt và không phụ thuộc chỉ vào màu sắc.
- Tooltip giải thích con số: giá trị hiện tại, thay đổi, nguồn tác động, công thức/tập hợp nguyên nhân và mức độ chắc chắn khi thích hợp.
- List dài phải virtualization/paging; tìm kiếm, lọc và sắp xếp phải dùng được trên điện thoại.
- Orientation change, back navigation, dialog/sheet và mở/đóng panel không làm mất selection hoặc game state.
- Font, touch target, độ tương phản, scaling, TalkBack/reduced motion và localization cần được kiểm thử.
- Không để UI giữ bản sao mutable của simulation state hoặc tự cập nhật kết quả giả.

**Liên kết:** mọi domain command và state selector.

**Nghiệm thu:** người chơi có thể từ bản đồ đi đến một Pop/building/market/law và hiểu vì sao chỉ số đổi; thao tác không gây mất trạng thái khi chuyển panel.

### 2.21. Lưu game, tải game và tính liên tục

**Mục đích:** chiến dịch là dữ liệu bền vững của người chơi, không phụ thuộc vòng đời một tiến trình WebView.

Cần có:
- Save slot, metadata, campaign mode, player country, date/tick, schema version, simulation RNG state và toàn bộ state cần cho deterministic continuation.
- Atomic write/checkpoint, giữ bản save tốt gần nhất, kiểm tra integrity trước khi thay thế.
- Migration theo version, kiểm tra dữ liệu cũ, từ chối save hỏng/không tương thích mà không sửa đè file gốc.
- Autosave có lịch và điều kiện, không giả định timer vẫn chạy khi Android đã kill process.
- Export/import qua Android phải kiểm thử trên thiết bị thật; xác minh file, kích thước, checksum và continuation sau khi import.
- Save không được phụ thuộc URL, session web hoặc dữ liệu chỉ còn trong memory.
- Data pack update phải giữ tương thích hoặc báo rõ save cần pack version nào.

**Nghiệm thu:** export → import → tiếp tục simulation từ đúng ngày với state/RNG tương ứng; không chỉ xác nhận file tồn tại.

### 2.22. APK, Resource Packs, media đầy đủ và chế độ offline

**Mục đích:** APK lõi có thể cài gọn, nhưng sản phẩm hoàn chỉnh sau khi cài đủ pack phải đạt khoảng **4–5 GB dung lượng game thực chất trên thiết bị**. Đây là yêu cầu về độ đầy đủ dữ liệu và media, không phải mục tiêu nén game xuống một APK nhỏ.

Luồng mục tiêu:
1. APK cài được, mở được, cung cấp giao diện bootstrap và Resource Pack Manager.
2. Người dùng thấy danh sách pack, dung lượng tải, dung lượng giải nén, phiên bản, phụ thuộc và khả năng tương thích.
3. Không truy cập mạng/tải dữ liệu khi người dùng chưa chủ động bật/chấp thuận.
4. Downloader hỗ trợ pause, cancel, resume đã xác minh, retry và preflight dung lượng.
5. Manifest được xác thực bằng chữ ký publisher; mỗi tệp được kiểm tra SHA-256, schema, MIME, path, size, duplicate IDs và license/provenance.
6. Tải về vùng staging; chỉ activate atomically sau khi toàn bộ kiểm tra đạt; giữ bản cũ và rollback nếu lỗi.
7. Cho xem trạng thái, version, dung lượng, lỗi, cập nhật và gỡ pack an toàn.
8. Sau khi cài đủ pack bắt buộc, khởi tạo campaign, simulation, map, save/load và gameplay cốt lõi chạy offline.
9. Pack dữ liệu không được thực thi JS/HTML/code; tách simulation data khỏi art/audio/locale khi hợp lý.
10. Full-content collection phải có dữ liệu lịch sử/gameplay toàn cầu và thư viện media hoàn chỉnh: cờ, huy hiệu, chân dung, nhân vật, công trình, tàu/thuyền, quân đội, minh họa sự kiện, texture/bản đồ, animation/video, soundtrack, ambience và hiệu ứng âm thanh. Video và audio phải có sẵn offline sau khi tải pack tương ứng; không phụ thuộc streaming.
11. Giữ ảnh độ phân giải cao, video có chất lượng hình/khung hình hợp lý và âm thanh bitrate/sample-rate tốt. Không downscale, giảm bitrate hoặc bỏ media hàng loạt chỉ để thu nhỏ dung lượng. Cho phép nén hiệu quả nhưng không làm suy giảm đáng kể chất lượng; đo riêng kích thước gốc, download, expanded và RAM giải mã.
12. Mục tiêu **4–5 GB là tổng dung lượng cài đặt khi đã cài bộ game đầy đủ** (APK + game data + media đã activate), không phải kích thước APK đơn lẻ, không phải RAM, và không phải quota bắt buộc nhồi file. Chỉ tính nội dung có dùng trong gameplay; cấm file rỗng, trùng lặp, ngẫu nhiên hoặc media lặp để tăng dung lượng.

**Nghiệm thu thực tế bắt buộc:** cài APK mới → mở offline → xem bootstrap → bật mạng theo hành động người dùng → tải pack → ngắt mạng giữa chừng → resume → xác minh signature/hash → activate → tắt mạng → tạo/chạy/lưu/tải campaign. Có test pack hỏng, sai version, hết dung lượng và rollback.

**Cảnh báo hiện trạng:** README hiện mô tả dữ liệu lịch sử và bản đồ được biên dịch vào asset APK khi build. Không được kết luận rằng downloader hoặc kiến trúc tải pack đã tồn tại chỉ vì có file nén/generated data. Phải audit APK, code và luồng người dùng để xác minh.

### 2.23. Android, hiệu năng, an toàn và phát hành

**Mục đích:** game chạy đáng tin cậy trên thiết bị thật trong phiên chơi dài.

Cần có:
- Landscape-first trên Android/Capacitor/WebView; xác minh đúng phiên bản Android và System WebView thực tế.
- Không làm parse dữ liệu lớn, giải nén, I/O, mô phỏng toàn cầu hoặc dựng danh sách nặng trên UI thread.
- Tick engine có giới hạn công việc, xử lý incremental, cache có giới hạn, map LOD/culling và virtualization.
- Xử lý app background/foreground, process death, memory pressure, WebGL context loss/restore, listener/resource cleanup.
- Đo startup p50/p95, panel latency, frame time/jank p50/p95/p99, tick duration, JS/native memory, texture memory, save/load, tải/giải nén pack, battery/thermal khi có thiết bị thật.
- Không báo PASS cho battery/thermal/ANR/60-minute session nếu chỉ chạy unit test hoặc CI.
- APK debug, release signing, package ID, versionCode và update compatibility là các vấn đề riêng; không tự thay đổi signing, secrets hoặc identity.
- Không gửi save/telemetry ra ngoài; không phân tích/thu thập dữ liệu người dùng nếu chưa có quyết định và consent rõ ràng.

**Nghiệm thu:** có test/đo trên thiết bị thật với model, OS, WebView, build SHA và APK SHA-256; xác minh cold/warm start, 60-minute session, orientation, process death, save/load và tình trạng bộ nhớ.

---

## 3. Nguyên tắc mô phỏng: hệ thống phải tạo thành vòng lặp nhân quả

Không triển khai các hệ thống như các bảng số tách rời. Ví dụ vòng lặp kinh tế–xã hội tối thiểu:

1. Pop có nhu cầu, nghề nghiệp, qualification, thu nhập và wealth.
2. Building tuyển lao động phù hợp, mua đầu vào và tạo hàng hóa.
3. Market tính cung/cầu/giá và khả năng tiếp cận.
4. Giá và việc làm quyết định sức mua, mức sống và lợi nhuận.
5. Pop thay đổi nghề, di cư, tăng/giảm dân số và thái độ chính trị.
6. Interest Groups và movements tác động chính phủ/luật.
7. Laws, institutions, taxes, education và infrastructure đổi điều kiện sản xuất/xã hội.
8. Country AI và diplomacy phản ứng với nguồn lực, xung đột và cơ hội.
9. Mobilization/war dùng nhân lực, goods, convoy và ngân sách; gây casualty, occupation, debt và hậu quả xã hội.
10. Các hệ thống tiếp tục chạy và tạo phản hồi mới trong các tick sau.

Nếu một bước không tác động sang bước kế tiếp trong code/test thì vòng lặp chưa hoàn chỉnh. Phải ghi rõ abstraction nào được dùng và vì sao, không che placeholder bằng con số giả.

---

## 4. Nghiên cứu Victoria 3 và lịch sử: chuẩn nguồn

### 4.1. Thứ tự ưu tiên nguồn

- **Cơ chế game:** tài liệu/website/dev diary/patch notes chính thức của Paradox; mô tả sản phẩm chính thức; sau đó là community wiki và công cụ tra cứu đã đối chiếu nguồn.
- **Cách vận hành hiện tại:** ưu tiên kiểm tra đúng phiên bản game/patch mà tài liệu đang nói đến. Một dev diary cũ chỉ giải thích ý đồ/thời kỳ phát triển, không tự chứng minh mechanics hiện tại.
- **Lịch sử:** văn bản/niên giám/thống kê đương thời; archive, academic press, scholarly books/papers; dữ liệu tổ chức thống kê/di sản/ngoại giao đáng tin cậy.
- **Dữ liệu kinh tế/dân số:** phải ghi đơn vị, năm, ranh giới địa lý, định nghĩa, phương pháp ước tính, độ phủ và missingness.
- **Ảnh/bản đồ/âm thanh:** kiểm tra license, quyền sửa đổi, attribution và quyền phân phối trong APK/data pack. Có URL không đồng nghĩa có quyền dùng.

### 4.2. Bản ghi nghiên cứu bắt buộc

Mỗi claim/data record quan trọng cần ghi:
- Claim hoặc trường dữ liệu.
- Giá trị/đơn vị/thời gian/địa lý.
- Nguồn, tiêu đề, tác giả/tổ chức, URL, ngày xuất bản và ngày truy cập.
- Trang/bảng/đoạn/bản lưu cụ thể.
- Phương pháp và cách chuyển đổi dữ liệu.
- License/quyền sử dụng nếu là asset/data.
- Confidence: verified / supported / estimated / disputed / unknown.
- Nguồn mâu thuẫn, lý do chọn hoặc lý do giữ trạng thái không xác định.
- Feature/system bị ảnh hưởng và test kiểm chứng.

### 4.3. Quy tắc không bịa

- Không tự suy ra ruler, border, population, GDP, religion, law, technology hay event chỉ từ dữ liệu hiện đại.
- Không dùng số của quốc gia hiện đại như thể biên giới lịch sử giống nhau.
- Không tự đổi missing thành zero.
- Không gộp “không biết” với “không có”.
- Nếu chỉ có ước tính, giữ nhãn ước tính và nguồn.
- Không nhập dữ liệu nghiên cứu candidate vào runtime trước khi đạt quy trình duyệt của phase.
- Không dùng asset/source của Victoria 3 để đóng gói vào game này.

---

## 5. Ma trận đối chiếu và bằng chứng

Duy trì ma trận theo từng feature area. Không dùng một phần trăm tổng thể để che lấp hệ thống chưa có.

Mỗi dòng feature cần có các cột:
- Feature ID / domain.
- Mô tả hành vi tham chiếu (Victoria 3) và phiên bản/nguồn.
- Hành vi mong muốn của Victori3 Mobile.
- Code modules/data/schema liên quan.
- Dependency upstream/downstream.
- Data coverage và geographic/temporal coverage.
- UI entry point và user actions.
- Tests: unit/integration/regression/end-to-end.
- Performance risk/budget.
- Status: NOT_STARTED / DESIGN_ONLY / PARTIAL / IMPLEMENTED_UNVERIFIED / VERIFIED / BLOCKED.
- Evidence links, exact commit SHA, reviewer và owner decision.
- Gap tiếp theo và task ID.

Không đánh dấu VERIFIED chỉ vì có component, số liệu tĩnh, mock, unit test đơn lẻ hoặc APK build thành công. VERIFIED cần có tích hợp và acceptance evidence phù hợp.

Điểm bắt đầu audit:
- [Victoria 3 feature parity audit](docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md)
- [Victoria 3 feature parity matrix](docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv)
- [Pass 16 repository audit](docs/research/PASS16_REPO_AUDIT.md)
- Các spec từng subsystem được AI_HANDOFF liệt kê.

---

## 6. Vertical slice bắt buộc trước khi mở rộng bề rộng

Ưu tiên hoàn thiện một chiến dịch chơi được đầu-cuối thay vì tiếp tục tạo module rời rạc. Một vertical slice phải chứng minh tối thiểu:

- Chọn một quốc gia bất kỳ có đủ dữ liệu và bắt đầu ở 1836.
- Bản đồ, quốc gia, state và Pop khởi tạo nhất quán.
- Chạy thời gian qua nhiều tick/tháng/năm; AI thế giới vận hành.
- Xây dựng/nâng cấp một chuỗi sản xuất với đầu vào, workforce, output, wages và giá.
- Một thay đổi cung/cầu tác động đến giá và Pop needs/SOL.
- Thay đổi luật hoặc chính sách có tiến trình chính trị và hiệu ứng thực.
- Nghiên cứu công nghệ mở khóa một năng lực.
- Có ít nhất một tương tác diplomacy thực sự thay đổi quan hệ/hiệp ước.
- Có chiến tranh hoặc khủng hoảng quân sự với huy động, supply, casualties và peace outcome (trong phạm vi slice được duyệt).
- Lưu game, đóng/mở lại app hoặc process, tải game và tiếp tục cùng trạng thái/RNG.
- Chạy tiếp chiến dịch mà không có crash/ANR hay tăng memory không kiểm soát trong ngưỡng được phê duyệt.
- Historical Mode và Sandbox dùng chung simulation engine; test cho thấy Sandbox có thể diverge mà không phá invariants.

Các ví dụ ở trên không phải giấy phép tự mở phase bị khóa. Chỉ triển khai theo thứ tự và authorization trong roadmap.

---

## 7. Định nghĩa một lát cắt công việc hoàn thành

Mỗi task/commit phải trả lời được:

1. **Why:** gap cụ thể nào trong parity/bug nào đang được xử lý?
2. **Scope:** task được phép sửa những file/module nào, điều gì ngoài phạm vi?
3. **Research:** cơ chế/dữ liệu dựa trên nguồn nào, mức độ tin cậy ra sao?
4. **Design:** contract, state transitions, invariants và failure modes là gì?
5. **Implementation:** code/data/schema/UI thay đổi cụ thể gì?
6. **Tests:** lệnh chính xác, exit code, số suite/test, edge/failure cases.
7. **CI:** URL run, exact SHA, kết quả từng job, artifacts.
8. **Android QA:** model/OS/WebView/app build và kết quả thật nếu có.
9. **Save compatibility:** migration/continuation/rollback được kiểm tra ra sao?
10. **Risks:** còn gì chưa xác minh, bị block hoặc có thể phá vỡ?
11. **Review:** exact HEAD, Claude/independent reviewer verdict.
12. **Owner decision:** accepted/rejected/pending; không tự điền thay chủ dự án.

Sau khi hoàn thành: cập nhật báo cáo tiến độ đang dùng + AI_HANDOFF, commit/push cùng lát cắt. Không để báo cáo trong chat làm bằng chứng duy nhất.

---

## 8. Tài liệu chuẩn — đọc theo thứ tự

| Thứ tự | File | Dùng để làm gì |
|---|---|---|
| 1 | [AI_START_HERE.md](AI_START_HERE.md) | Trang tiếp quản chung; mục tiêu và quy tắc đọc tài liệu |
| 2 | [AGENTS.md](AGENTS.md) | Chỉ dẫn cho coding agents |
| 3 | [CLAUDE.md](CLAUDE.md) | Điểm vào của Claude Code |
| 4 | [AI_HANDOFF.md](docs/coordination/AI_HANDOFF.md) | Trạng thái, task, commit, CI, reviewer, next step |
| 5 | [AI_COLLABORATION_PROTOCOL.md](docs/coordination/AI_COLLABORATION_PROTOCOL.md) | Vai trò, quyền hạn, source-of-truth, workflow |
| 6 | [OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md](docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md) | Chỉ thị dài hạn về sản phẩm, APK, pack, offline, QA |
| 7 | [OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md](docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md) | Chỉ thị mới nhất: full parity Victoria 3, thư viện hình ảnh/video/âm thanh chất lượng cao và mục tiêu 4–5 GB game đầy đủ sau cài đặt |
| 8 | Roadmap và owner decisions được AI_HANDOFF chỉ định | Phase/gate và quyền triển khai hiện hành |
| 9 | Spec subsystem + parity audit/matrix | Thiết kế và tiêu chí đúng của task |
| 10 | Rolling progress/audit report gần nhất | Bằng chứng, gap và việc tiếp theo |

### Tài liệu tham chiếu bên ngoài để bắt đầu nghiên cứu

- [Paradox — Victoria 3 official overview](https://www.paradoxinteractive.com/games/victoria-3/about): mô tả chính thức các trụ cột Pops, xã hội, công nghệ, công nghiệp, thương mại, ngoại giao và bản đồ.
- [Paradox Developer Diary #57 — The Journey So Far](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far): giải thích định hướng thiết kế và mối liên hệ giữa Pop, laws, institutions và economy; đây là diary năm 2022, cần đối chiếu patch hiện tại.
- [Victoria 3 on Steam](https://store.steampowered.com/app/529340/Victoria_3/): mô tả sản phẩm và các hệ thống chính thức.
- [Vic3 Tabula rules by topic](https://vic3tabula.com/en/rules): công cụ tra cứu giải thích trong game, tại thời điểm ghi nhận trang hiển thị game version 1.15.0 và ngày trích xuất 2026-11-05; đây là nguồn tham khảo cộng đồng/được trích xuất, không thay thế xác minh nguồn chính thức.
- [Victoria 3 official news/dev diaries](https://www.paradoxinteractive.com/games/victoria-3/news): tra cứu cập nhật/diary mới hơn mỗi khi review mechanics.

---

## 9. Phân quyền, gate và những điều tuyệt đối không tự ý làm

- Chủ dự án quyết định scope, sản phẩm, approval và phase transition.
- ChatGPT là technical lead/coordinator và implementer cho các task được ủy quyền; self-audit phải ghi rõ là self-audit.
- Claude là independent reviewer của đúng change set mà Claude không viết/sửa; Claude không được tự review công việc do chính mình làm.
- Gemini Hydrogen cung cấp nghiên cứu/tư liệu có nguồn; research candidate không tự động là runtime data đã verified.
- DeepSeek chỉ thay reviewer theo chỉ định của chủ dự án và phải độc lập với change set.
- Không tự mở S1–S23 hoặc gate đang khóa; không suy diễn rằng proposal/review PASS đồng nghĩa được phép code.
- Không thay package ID, versionCode, signing key, secrets, workflow release hoặc lưu trữ save nếu chưa có quyền rõ ràng.
- Không force-push, rewrite lịch sử, merge hoặc mở PR trái protocol.
- Không đưa credentials/keystore/token/dữ liệu riêng tư vào repo.
- Không copy source/assets/text/audio của Victoria 3.
- Không tự gửi telemetry/save ra mạng.
- Không tự tuyên bố REVIEW_PASS/ACCEPTED cho code do chính mình làm.

**Hoàn tất task** chỉ khi implementation + evidence + handoff + independent review + owner decision phù hợp được ghi lại theo protocol. Build APK thành công không đồng nghĩa sản phẩm đã hoàn chỉnh.

---

## 10. Nhắc nhở ngắn cho mọi phiên mới

**Đọc HEAD mới nhất → đọc trang này → đọc AI_HANDOFF → đọc protocol + nguyên tắc chủ dự án → xác định gate/authorization → kiểm tra parity gap → làm một lát cắt có test → cập nhật báo cáo → commit/push → bàn giao exact SHA.**

**Bắt buộc đọc thêm toàn bộ OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md:** phạm vi không được thu hẹp tùy tiện khỏi toàn bộ hệ thống Victoria 3; game hoàn chỉnh phải có hình ảnh, video, animation, âm nhạc và hiệu ứng âm thanh chất lượng cao, hướng tới 4–5 GB dung lượng cài đặt thực tế. 18 MB APK lõi không phải game hoàn chỉnh.

Đừng bắt chủ dự án nhắc lại điều đã có trong GitHub. Đừng đoán. Đừng làm vòng quanh. Đừng báo hoàn thành nếu chưa có bằng chứng.
