# VICTORI3 MOBILE — MASTER PRODUCT & IMPLEMENTATION BRIEF FOR CLAUDE
## Định hướng sản phẩm, Victoria 3 parity, kiến trúc mô phỏng, phân nhiệm và lộ trình triển khai

- Repository: mtieu6470-maker/Victori3-mobile
- Branch được chỉ định: claude/game-historical-sandbox-modes-kg7rj7
- Ngày chốt nội dung: 2026-11-21
- Vai trò triển khai: Claude Code là primary implementation agent theo chỉ thị mới của chủ dự án.
- Trạng thái tài liệu: MASTER BRIEF / IMPLEMENTATION DIRECTION; không thay thế roadmap canonical, task authorization hoặc phase gate.
- Phạm vi lịch chiến dịch của dự án: 01/01/1836 đến 31/12/2026, theo owner amendment 2026-11-20.
- Chuẩn tham chiếu: Victoria 3 và các bản cập nhật/content pack gameplay đã phát hành tại mốc tham chiếu được ghi trong §3.

> Mục đích: giúp Claude hiểu đầy đủ loại game cần xây, chiều sâu gameplay phải đạt, những gì được coi là triển khai thực, những hệ thống cần có, cách phân rã công việc và cách phối hợp. Không được hiểu tài liệu này là quyền vượt S0/S1 hoặc tự mở một phase đang đóng.

---

# PHẦN I — TẦM NHÌN VÀ CHUẨN SẢN PHẨM

## 1. Sản phẩm phải trở thành gì?

Victori3 Mobile phải là một trò chơi đại chiến lược mô phỏng xã hội, kinh tế, chính trị và địa chính trị toàn cầu trên Android. Victoria 3 là chuẩn tham chiếu về độ rộng hệ thống, mối quan hệ nhân quả và cách trình bày thông tin. Mục tiêu không phải tạo bản sao giao diện, không phải một bản đồ tô màu có nhiều menu, và cũng không phải mô phỏng tăng các con số độc lập.

Người chơi phải điều hành một quốc gia hoặc thực thể chính trị có thật trong bối cảnh lịch sử, quản trị dân cư, phân bổ nguồn lực, thúc đẩy hoặc kiềm chế công nghiệp hóa, thiết kế hệ thống luật và thể chế, xử lý xung đột lợi ích, xây dựng hạ tầng, giao thương, đàm phán với các nước khác, tổ chức lực lượng vũ trang và đối diện các hệ quả không thể dự đoán hoàn toàn.

Thế giới phải tiếp tục vận động khi người chơi không trực tiếp can thiệp. Các quốc gia AI phải có lợi ích, năng lực, ràng buộc và mục tiêu riêng. Quyết định của người chơi không được chỉ làm thay đổi một thanh chỉ số; chúng phải đi qua các hệ thống mô phỏng, gây ra tác động có thể giải thích tới Pops, thị trường, ngân khố, chính trị, ngoại giao và quân sự.

Trải nghiệm cuối cùng phải có các đặc điểm:

1. **World simulation:** bản đồ toàn cầu và hệ thống địa lý/chính trị thay đổi theo thời gian.
2. **Society simulation:** dân cư được mô hình hóa thành cohort/Pops có nghề, tầng lớp, văn hóa, tôn giáo, thu nhập, tài sản, nhu cầu, kỹ năng và lợi ích khác nhau.
3. **Economic simulation:** sản xuất tiêu thụ đầu vào, sử dụng lao động, tạo hàng hóa, thu nhập và lợi nhuận; hàng hóa được trao đổi qua thị trường có giá, tồn kho, thiếu hụt và giới hạn logistics.
4. **Political simulation:** luật, chính phủ, thể chế, nhóm lợi ích, nhân vật và phong trào chính trị tạo áp lực và phản ứng qua thời gian.
5. **Geopolitical simulation:** quan hệ, thỏa thuận, phụ thuộc, khối quyền lực, khủng hoảng, đàm phán và chiến tranh tạo ra trật tự quốc tế.
6. **Military simulation:** lực lượng có tổ chức, trang bị, hậu cần, chỉ huy, hành quân, chiến trường, hải quân, phong tỏa và hậu quả sau chiến tranh.
7. **Historical simulation:** dữ liệu có niên đại, provenance, độ tin cậy và khoảng trống được công khai; lịch sử tạo điều kiện ban đầu chứ không ép mọi kết quả tương lai.
8. **Alternate history:** Sandbox dùng chung engine với Historical và cho phép thế giới rẽ nhánh bởi lựa chọn người chơi/AI.
9. **Persistent campaign:** save/load/backup/restore phải bảo toàn trạng thái và tiếp tục tất định theo hợp đồng đã chọn.
10. **Premium mobile experience:** landscape-first, điều khiển chạm, thông tin dày nhưng đọc được, hiệu năng ổn định và nội dung offline phong phú.

## 2. Đích sản phẩm và các ràng buộc không được đánh đổi

### 2.1. Phạm vi thế giới và thời gian

- Khởi đầu chuẩn: 01/01/1836.
- Chiến dịch mới của dự án: kết thúc vào 31/12/2026.
- Historical Mode và Sandbox dùng chung một engine, cùng cấu trúc lệnh và cùng quy tắc mô phỏng. Hai mode có thể dùng lớp dữ liệu/điều kiện lịch sử khác nhau nhưng không được có hai bộ luật mô phỏng khác nhau.
- Bản tham chiếu Victoria 3 được xây quanh thời kỳ 1836–1936. Việc dự án mở chiến dịch đến 2026 là owner extension, không phải bằng chứng rằng dữ liệu lịch sử 1937–2026 đã sẵn sàng.
- Dữ liệu lịch sử 1836–1936 và dữ liệu 1937–2026 đều cần nguồn, phạm vi thời gian/địa lý, phương pháp, độ tin cậy và quyền sử dụng. Phải đánh dấu rõ giai đoạn nào có dữ liệu tốt, dữ liệu ước lượng hoặc còn thiếu.
- Không giả lập sự kiện lịch sử tương lai thành kết quả bắt buộc. Event, journal, nhân vật và tình hình chính trị tạo bối cảnh/áp lực/cơ hội; kết quả vẫn phát sinh từ simulation.

### 2.2. Phạm vi toàn cầu

- Không làm game chỉ cho Anh, Pháp, Qing, Nhật, Việt Nam hoặc một nhóm quốc gia trình diễn.
- Mọi polity có agency theo định nghĩa gameplay phải có dữ liệu và hành vi AI phù hợp với mức độ lịch sử, năng lực và loại hình thể chế.
- Không tự động biến mọi xã hội, lãnh thổ hoặc cộng đồng thành quốc gia hiện đại có chủ quyền, biên giới và bộ máy nhà nước giống nhau.
- Phải phân biệt quốc gia có chủ quyền, polity tập thể, lãnh thổ phụ thuộc, protectorate, colony, subject, vùng tranh chấp, vùng chiếm đóng và quyền kiểm soát quân sự.
- Coverage phải được đo theo vùng thế giới, loại polity, niên đại và chất lượng dữ liệu; không sử dụng một vài showcase country để tuyên bố toàn cầu hoàn chỉnh.

### 2.3. Android và giao diện

- Android APK là sản phẩm phân phối chính.
- Landscape-first: khi mở game trên điện thoại, trải nghiệm chiến lược chính phải ưu tiên ngang. Portrait chỉ là layout thích ứng bổ sung, không thay thế bản ngang.
- Bản đồ phải giữ vai trò trung tâm; panel thông tin, lens, timeline, alert và lệnh điều khiển được tổ chức như một command interface của grand strategy.
- Không hi sinh độ sâu gameplay để đổi lấy màn hình đẹp. Cũng không nhồi toàn bộ dữ liệu lên cùng lúc.
- Tách simulation/domain commands khỏi UI. Component không tự sửa GameState và không tự tính các công thức gameplay.
- Mọi nút gameplay phải gọi lệnh domain có validation, cost, effect, history/log, test và save persistence. Không có nút giả hoặc con số chỉ để trang trí.

### 2.4. Dung lượng và nội dung

- Mục tiêu của chủ dự án: khoảng **4–5 GB dung lượng thực cài trên thiết bị sau khi cài đủ Full Offline Content**.
- APK lõi có thể nhỏ để chứa bootstrap, runtime, UI và tối thiểu cần thiết. APK khoảng 18 MB không phải game hoàn chỉnh.
- Full content phải gồm dữ liệu lịch sử/gameplay, world/map data, assets hình ảnh theo đối tượng/thời kỳ, texture, portrait, animation/video, âm nhạc, ambience và sound effects có mục đích trong game.
- Không padding bằng tệp rỗng, file ngẫu nhiên, bản sao, ảnh lặp, âm thanh im lặng, video vô nghĩa hoặc dữ liệu không được game sử dụng.
- Không downscale hàng loạt, giảm bitrate mạnh, cắt mất cảnh, bỏ animation hoặc nén lại nhiều lần chỉ để ép dung lượng.
- Tách riêng số liệu: source bytes, compressed download bytes, expanded installed bytes, temporary staging/rollback bytes và peak decoded/resident RAM.
- Phải dùng content pack offline có manifest, hash, provenance/license, compatibility, resumable download, verify-before-activate, atomic activation và rollback. Network/download chỉ sau thao tác đồng ý rõ ràng của người dùng; không tự dùng mobile data.

## 3. Victoria 3 làm chuẩn tham chiếu như thế nào?

Victoria 3 được dùng để nghiên cứu và tham chiếu:

- Phạm vi hệ thống, các thực thể gameplay và quan hệ phụ thuộc.
- Chu trình nhân quả giữa dân cư, sản xuất, thị trường, luật, ngoại giao và quân sự.
- Cách game phơi bày trạng thái phức tạp bằng map lens, panel, tooltip, ledger, forecast và lịch sử thay đổi.
- Cách tạo replayability từ các điều kiện ban đầu khác nhau, hành động của người chơi, AI và các hệ thống có tương tác.
- Các cơ chế gameplay từ base game và nội dung gameplay-bearing trong các expansion, immersion pack và mechanics pack đã phát hành tại mốc tham chiếu.

**Không được sao chép** code, data file, event text, localization, artwork, model, music, audio, animation, video, UI skin hoặc tài sản độc quyền của Paradox. Chỉ học thiết kế cơ chế và triển khai lại độc lập bằng code, dữ liệu, ngôn ngữ, art direction và tài sản hợp pháp của dự án.

### 3.1. Mốc tham chiếu hiện hành tại 21/11/2026

Theo các trang/sự kiện chính thức được kiểm tra ngày 21/11/2026:

- Steam thông báo Victoria 3 Update 1.15 cùng State and Revolution phát hành ngày 05/11/2026.
- Hotfix 1.15.1 xuất hiện ngày 11/11/2026; các điểm được nêu gồm cải thiện AI chọn production method tính đến tiền lương, điều chỉnh copper và các sửa lỗi regime change.
- The Great Wave phát hành ngày 28/04/2026, bổ sung ship designer, flagship customization, ship-purchase treaties và các lựa chọn gunboat diplomacy.
- State and Revolution tập trung vào Tsarist government, dynamic journal entries/character traits, các đường cách mạng, Russian Civil War, Russification, cultural renaissance và nội dung Nga/Đông Âu.
- Catalogue chính thức liệt kê thêm các gói gameplay/immersion/mechanics như Sphere of Influence, Charters of Commerce, Pivot of Empire, National Awakening, Iberian Twilight, Voice of the People và Colossus of the South.
- Các gói Art/Music như Dawn of Wonder, Songs of the Homeland và Melodies for the Masses thuộc media/content parity. Không nhầm art/music pack với một hệ thống mô phỏng độc lập.
- Century of Strife được liệt kê là nội dung dự kiến Q1/2027 tại trang Volume 3 khi kiểm tra; ở mốc 21/11/2026, không được ghi nó là gameplay đã phát hành hoặc đã triển khai. Theo dõi riêng và kiểm tra lại khi thực sự phát hành.

Nguồn chính thức và mốc cần tái kiểm tra khi bắt đầu triển khai một feature:
- Victoria 3 overview: https://www.paradoxinteractive.com/games/victoria-3/about
- Add-ons catalogue: https://www.paradoxinteractive.com/games/victoria-3/add-ons
- Volume 3 / The Great Wave / State and Revolution / Century of Strife: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-volume-3
- The Great Wave feature page: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-the-great-wave
- Sphere of Influence: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-sphere-of-influence
- Charters of Commerce: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-charters-of-commerce
- Pivot of Empire: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-pivot-of-empire
- National Awakening: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-national-awakening
- Iberian Twilight: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-iberian-twilight
- Voice of the People: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-voice-of-the-people
- Colossus of the South: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-colossus-of-the-south
- Official 1.15.1 Steam announcement: https://store.steampowered.com/news/posts/?enddate=1790258448&feed=steam_community_announcements
- Official 1.15 / State and Revolution launch news: https://store.steampowered.com/news/posts/?enddate=1790258448&feed=steam_community_announcements
- Official Paradox developer diary/news archive: https://www.paradoxinteractive.com/games/victoria-3/news

Các trang marketing là điểm bắt đầu, không phải bản đặc tả kỹ thuật đầy đủ. Với mỗi cơ chế, Claude phải đọc dev diary/patch note liên quan, kiểm tra phiên bản hiện hành, tách official behavior khỏi lịch sử thực tế và thiết kế thích ứng của Victori3 Mobile.

---

# PHẦN II — CÁC HỆ THỐNG GAMEPLAY PHẢI CÓ

## 4. World map, địa lý và political control

Bản đồ là lớp dữ liệu địa lý có logic, không chỉ là ảnh nền. Phải có:

- Strategic Regions và các đơn vị địa lý/administrative unit phù hợp, ID ổn định.
- Đường biên giới theo niên đại; lineage khi chia/tách/sáp nhập/chuyển chủ.
- Địa hình, sông, hồ, bờ biển, biển, eo biển, kênh đào, núi, sa mạc, rừng và khả năng tiếp cận.
- Political ownership, sovereignty, de facto control, occupation, claims, contested territory và subject relationships là các thuộc tính tách biệt.
- Strategic regions/sea regions, cảng, đường bộ, đường sắt, đường thủy và các nút logistics.
- Settlement/cities/towns/villages/ports/capitals có tên theo thời kỳ/ngôn ngữ, vị trí, provenance và confidence.
- Zoom-dependent LOD: nhãn, biên giới, công trình, đơn vị, settlement và hiệu ứng chỉ hiển thị khi phù hợp mức zoom.
- Map lenses: political, population, culture/religion, employment, wealth/SOL, goods, production, infrastructure/market access, trade, technology, diplomacy, subjects, military, war, colonization, legitimacy/unrest và các lớp cần thiết khác.
- Chọn một region phải drill-down đến country/state/settlement, Pops, buildings, jobs, goods, local market, infrastructure, law/government coverage, military presence và historical timeline.

**Nghiệm thu:** đổi chủ quyền, occupation, biên giới hoặc quyền tiếp cận phải cập nhật đồng bộ map, data, economy/logistics/diplomacy/military và save. Không được có map layer hiển thị khác GameState.

## 5. Countries, polities, sovereignty và state capacity

Mỗi thực thể chính trị phải có định danh, loại hình, temporal validity, lãnh thổ, chính phủ/quyền lực, thủ đô/trung tâm, vị thế quốc tế, ngân khố, Pops, kinh tế, luật, diplomacy và military capability thích hợp.

Phân biệt:
- Sovereign state.
- Collective polity/indigenous authority.
- Decentralized polity.
- Subject/tributary/protectorate/dominion/vassal theo mô hình được nghiên cứu.
- Colony, company-administered territory và colonial administration.
- Federation/union/confederation.
- Occupied territory và de facto administration.
- Rebel movement, breakaway state và successor polity.

Không dùng một boolean độc nhất để biểu diễn tất cả quyền lực/chủ quyền. Country formation, unification, fragmentation, succession, annexation, independence, autonomy và regime transformation cần là domain transitions có preconditions, effects, history, event hooks và tests.

## 6. Pops / Population Cohorts — trung tâm của mô phỏng

Pops không phải một con số population tổng. Mỗi cohort đại diện một nhóm người có thuộc tính chung; không cần mô phỏng cá thể để vẫn thể hiện cấu trúc dân cư sâu.

Cohort cần hỗ trợ có điều kiện và theo dữ liệu:
- Size nguyên, non-negative và mass-conserving.
- Region/settlement residence.
- Culture, language, religion; unknown không đồng nghĩa với unaffiliated.
- Social strata/class và occupation.
- Age distribution khi nguồn/phương pháp cho phép.
- Literacy/education, health và qualifications.
- Employment status, unemployment, job attachment và skill.
- Income, wealth/assets, debt hoặc security theo mô hình.
- Needs basket, consumption, satisfaction và Standard of Living.
- Legal status, rights, discrimination, coercion/slavery/serfdom khi có căn cứ lịch sử.
- Political ideology/alignment, interest-group attraction, approval, radicalism/loyalty.
- Migration propensity và mobility constraints.

Cần có:
- Birth/death/fertility/mortality, epidemics, famine và shocks.
- Internal/international migration, push/pull factors, travel/access constraints.
- Urbanization, rural-to-urban transition và settlement growth.
- Occupation/qualification progression.
- Cohort split/merge với ID ổn định/canonical tuple; tổng population được bảo toàn.
- Aggregate read models được tính từ cohort canonical state; không cho nhiều hệ thống tự cập nhật tổng POP riêng.
- Provenance/quality/uncertainty của historical seeds và fallback methods.

Không biến census total thành occupation/religion/age shares nếu nguồn không chứng minh. Không tự bịa tôn giáo/văn hóa/nhóm dân cư còn thiếu. Không dùng tỷ lệ ngẫu nhiên làm dữ liệu lịch sử.

## 7. Needs, wealth và Standard of Living

Mỗi cohort có nhu cầu theo hàng hóa/dịch vụ và mức sống. Khả năng mua phụ thuộc thu nhập, wealth, giá, tiếp cận thị trường, pháp luật và hoàn cảnh.

Cần có:
- Need categories và need baskets.
- Basic vs discretionary/luxury needs.
- Price sensitivity, substitution có điều kiện và unmet needs.
- Income source: wages, dividends, rents, transfers, state support, subsistence output.
- Savings/wealth accumulation và depletion.
- Poverty, inequality, debt/distress khi mô hình được phê duyệt.
- SoL được tính bằng phương pháp giải thích được, không phải một scalar tăng tùy tiện.
- Thiếu hàng thiết yếu/giá cao/thu nhập giảm/thất nghiệp/thuế/chiến tranh làm SoL giảm qua cơ chế có thể truy vết.
- Việc làm tốt hơn, lương tăng, hàng hóa rẻ hơn, y tế/giáo dục/phúc lợi cải thiện có thể tăng SoL.
- Radicals, political movements, migration và unrest phản ứng với trải nghiệm xã hội thực tế.

**Vòng nhân quả tối thiểu:** job/income → purchasing power → market demand → price/availability → consumption/unmet needs → SoL/wealth → migration/politics.

## 8. Goods registry, production chains, markets và price formation

### 8.1. Goods

Goods Registry có ID ổn định, family, canonical units, display units, inventory policy, mass/volume khi áp dụng, perishability, transportability, valid era, substitutes có điều kiện và source refs.

Không gom các hàng hóa khác bản chất thành một loại quá rộng chỉ để giảm số lượng ID. Không dùng một chỉ số giá toàn cầu duy nhất làm đại diện cho mọi vùng nếu market access/logistics không cho phép.

### 8.2. Inventory và material accounting

- Stock đầu kỳ + production + imports − consumption − production inputs − exports − spoilage/destruction = stock cuối kỳ, theo từng good/location/market.
- Inventory không âm.
- Không có output được ghi nhận nếu input chưa được cấp phát đủ theo phương pháp production.
- Transfer nội bộ không tạo hoặc hủy hàng hóa.
- Phân biệt storable goods, flow-only goods và non-material services.
- Có ledger truy nguyên quantity/value/time/origin/destination/source entity.
- Tách hàng hóa vật chất khỏi monetary value; tiền không thay thế mass balance.

### 8.3. Markets

- Market membership/access phải dựa vào treaty/policy/geography/logistics theo thiết kế được duyệt.
- Buy/sell orders hoặc cơ chế clearing tương đương.
- Supply, demand, stock, shortages, surpluses, imports/exports, prices và local access.
- Prices hình thành từ scarcity/order balance/transport/tariff/market conditions theo thuật toán minh bạch và ổn định.
- Price elasticity và substitutions chỉ áp dụng nếu có rule rõ.
- Không để một market aggregate che khuất thiếu hụt ở vùng không thể tiếp cận.
- Chuyển chủ quyền, thay đổi hạ tầng, blockade hoặc tariff phải phản ánh vào price/access.

### 8.4. Trade

Trade route là đối tượng trạng thái thực, có origin/destination, good, volume, capacity, cost, tariff, transport mode, convoy demand/risk, ownership/profit và temporal lifecycle.

Tuyến được tạo, mở rộng, thu hẹp, đình chỉ hoặc chấm dứt theo lợi nhuận, năng lực, chính sách, diplomacy, security và rủi ro. AI và player phải chịu cùng giới hạn. Không tạo nhập khẩu vô hạn để bù thiếu hụt.

## 9. Buildings, Production Methods, jobs và công nghiệp

Tách các khái niệm:

- BuildingType: định nghĩa loại hình/recipe/requirements.
- ProductionMethod: lựa chọn kỹ thuật/đầu vào/đầu ra/workforce/qualification/technology/era.
- BuildingSite: địa điểm/cơ sở cụ thể đang tồn tại.
- ConstructionProject: dự án đang xây/nâng cấp/chuyển đổi.
- Firm/Company/Owner: tổ chức và quyền sở hữu (theo phase).

Một BuildingSite phải có location, type, size/levels, production method, status, capacity, inputs, outputs, workforce demand, profitability, ownership và history. Các status phải theo bất biến loại trừ lẫn nhau. Không tạo cơ sở lịch sử cụ thể khi chỉ có aggregate regional estimate.

Production Methods phải thay đổi thực sự:
- Input bundle và quantity.
- Output goods và yield.
- Labour demand/occupation/qualification.
- Productivity/capacity.
- Technology requirement.
- Operating cost, wage bill, profit và environmental/social consequences nếu có model.
- Era validity và region/resource constraints.

Employment thật chỉ được nghiệm thu ở S12 theo roadmap: vacancies/job slots, qualification matching, hiring/firing, wages, unemployment, labor competition, migration và labor-law constraints. Trước S12, chỉ dùng workforce aggregate có nhãn theo quyết định roadmap.

**Vòng nhân quả tối thiểu:** PM → input demand + job vacancies → input allocation/hiring → production/output → market supply/prices → wage/profit/tax → Pops/IG/investment.

## 10. Construction, companies, ownership và capital

Construction không được chỉ là click nút và tăng level ngay lập tức.

Cần có:
- Construction sectors/capacity, queue và priority.
- Goods/material cost, workforce, cost overrun/risk nếu có căn cứ, progress per tick.
- Pause/resume/cancel, input shortage, capacity bottleneck và project completion.
- AI sử dụng cùng queue/cost/capacity rules.
- Building ownership: state, private, aristocratic/landed, capitalist, cooperative, foreign hoặc hình thức phù hợp lịch sử.
- Revenue/cost/wage/dividend/profit/tax/subsidy.
- Investment pool, reinvestment, ownership transfer, nationalization và foreign investment.
- Firms/companies có charter, business field, assets, headquarters, expansion, monopoly influence và relations với state.
- Phân biệt legal ownership với operational control khi cần.

Các cơ chế tham chiếu từ Charters of Commerce cần được nghiên cứu/đối chiếu: trade/investment/colony/industry charters, company expansion, monopolies, uneven diplomatic trade deals, colonization limits và prestige goods. Không coi chúng là menu; charter phải giới hạn hành vi doanh nghiệp và tạo ra hiệu quả kinh tế/ngoại giao.

## 11. Treasury, taxation, debt và fiscal state

Ngân khố có ledger có thể đối chiếu:
- Tax base và tax method/law.
- Taxes theo nhóm/hoạt động phù hợp.
- Tariffs, customs, dividends, state-owned enterprise income và các nguồn thu khác.
- Government wages, administration, military/navy, institutions, welfare, subsidies, construction, interest payments.
- Reserves, debt, credit, interest, borrowing limits, default/crisis.
- Budget balance và fiscal capacity.

Mỗi khoản phải có source, formula, currency/unit, period và payer/recipient. Thuế tác động đến disposable income, firm profitability, needs và interest groups. Debt có financing cost và crowding-out/credit/sovereignty implications theo mô hình. Không sửa một treasury scalar bằng random delta.

## 12. Laws, institutions, government và political society

### 12.1. Laws

Law là state transition có điều kiện, duration, political support, enactment process, possible stall/failure, enforcement và hậu quả.

Các nhóm cần khảo sát:
- Power structure / governance.
- Distribution of power / franchise / representation.
- Citizenship, migration, cultural/religious rights và discrimination.
- Economic system / taxation / trade / property.
- Labor rights, slavery/serfdom, workplace conditions.
- Education, health, welfare và social security.
- Internal security, police, censorship.
- Military service/organization.
- Church/state, religious institutions.
- Colonial administration/autonomy.
- Other legally relevant frameworks theo thời kỳ.

Không dùng bộ law giống hệt cho mọi polity. Không áp mô hình nghị viện hiện đại cho xã hội không có nền tảng lịch sử đó.

### 12.2. Interest Groups, movements và legitimacy

- Interest groups có ideology/interests, membership/pop support, clout, approval, leadership, government/opposition position.
- Clout phải được suy ra từ tài sản/địa vị/luật/education/occupation/ownership và những yếu tố có căn cứ, không phải fixed categories với một scalar độc lập.
- Political movements có demands, supporters, radicalism, organization, leaders, stages, negotiation, reform support, secession/revolution potential và outcomes.
- Political lobbies có thể thúc đẩy foreign policy và phản ứng với các quan hệ quốc tế.
- Elections/parties/legislatures chỉ khi thể chế hiện hành có; không áp phổ quát.
- Legitimacy/government composition ảnh hưởng khả năng enact law và stability.
- Protest, strike, uprising, revolution và civil war phải có điều kiện/cơ chế/hệ quả.
- Regime change hoặc forced law change phải có treaty/war/diplomacy cost và domestic blowback.

**Vòng nhân quả tối thiểu:** economic/rights shock → cohort interest alignment → group clout/movement support → legitimacy/law pressure → reform/repression/conflict → changed incentives and outcomes.

## 13. Institutions và public services

Tách InstitutionDefinition khỏi mutable institution state. Mỗi institution có level/capacity, funding, bureaucracy/admin cost, staffing, coverage, quality, access, effects, legal prerequisites và location/temporal applicability.

Các lĩnh vực: education, healthcare, welfare, administration, policing, military administration, infrastructure governance và các tổ chức xã hội/hành chính có căn cứ.

Public service không được chỉ là ngân sách trừ đi. Phải mô hình hóa capacity và quality/access khác nhau giữa các vùng. Local government có thẩm quyền, năng lực, resource và quan hệ với central state. Urbanization phải gắn với housing, employment, transport, service capacity và food supply.

## 14. Technology, innovation và diffusion

- Technology registry có prerequisite, era, origin/region applicability, effect, source và confidence.
- Research capacity, scholar/innovation, literacy/education, institutions, funding và political support.
- Diffusion qua trade, migration, diplomacy, occupation, colonial transfer, education và contact tùy mô hình.
- Adoption không tự động bằng invention; quốc gia cần năng lực và điều kiện thực tế.
- Technology mở khóa/điều chỉnh Production Methods, infrastructure, ships, military organization, public services và social institutions.
- Không cho tất cả nước bắt đầu cùng công nghệ hoặc cùng tốc độ.
- Historical Mode có điều kiện khởi đầu theo niên đại và nguồn; Sandbox có thể phát triển khác thông qua cùng rule engine.

## 15. Characters, rulers, offices và narrative agents

Character là entity runtime, không chỉ portrait trong UI.

Thuộc tính có thể gồm:
- Stable ID, historical/generated/unknown classification, provenance.
- Name variants, culture, religion nếu có bằng chứng.
- Birth/death/active intervals.
- Traits, ideology, skills, relationships, prestige/popularity.
- Office/appointment, employer/polity, succession role, command role.
- Journal/event participation và history.

Cần có lifecycle: birth/appearance, education/skill, appointment, promotion, exile, imprisonment, death, succession, office vacancy và political/military consequences. Character-driven systems từ State and Revolution gồm ruler traits tác động journal/actions, royal favorites, court factions, exile of dissidents, dynamic revolutionary paths và hậu quả của người kế nhiệm. Đây là tham chiếu cơ chế, không phải copy narrative content.

Unknown historical individuals phải giữ unknown; generated replacement phải được phân biệt với người thật.

## 16. Diplomacy, subjects, Power Blocs và diplomatic plays

Diplomacy không chỉ là relation score và nút declare war.

Cần có:
- Bilateral relations, attitude, rivalry, trust, obligations, treaties, guarantees, alliances và truces.
- Recognition/legitimacy quốc tế, prestige/rank và interest.
- Subject relationships với type, autonomy, obligations, taxation/tribute, market access, military obligations, liberty desire và integration/independence.
- Diplomatic actions có cost, cooldown, conditions, target, duration, breach rules và history.
- Diplomatic play/crisis: initiator, target, demands, participants, stance, backing, sway, escalation, mobilization, concession, mediation, settlement và possible war transition.
- Colonization/claims/annexation theo luật/technology/competition/historical facts.
- Power Blocs: cohesion, identity/ideology, principle, membership, leader, cohesion/reward, leverage, obligations, exit/expulsion, diplomatic and economic effects.
- Lobbies, foreign investment, subject management and bloc monuments/effects as applicable.
- Gunboat diplomacy: naval projection can influence a diplomatic play only if the fleet, logistics, distance, naval capability and political risk support it.
- Ship-purchase treaties link shipyards/companies, finance, military capability and diplomacy.

Diplomatic plays phải có thể kết thúc bằng nhượng bộ/đàm phán mà không nhất thiết dẫn tới chiến tranh. AI phải đánh giá stakes, capability, geography, alliances, domestic pressure, economy and risk. Không chuyển mọi khủng hoảng sang chiến tranh chỉ bằng random chance.

## 17. Military organization, operations và warfare

### 17.1. Organization

- UnitType/equipment/formation templates theo thời kỳ.
- Recruitment, reserves, conscription/mobilization, training, readiness, morale, commander, command capacity.
- Army formations/units and fleets/task forces.
- Country-specific/historical organizational differences; không áp cùng một mẫu quân đội cho mọi polity.
- Military buildings/industry và supply requirements.
- Navy ship design/fleet composition, shipyard production, prestige flagship, readiness, crew, maintenance và naval technology.

### 17.2. Operations

- Deterministic movement graph/pathfinding.
- Fronts, theater, objectives, orders, routes, supply depots, transport and reinforcement.
- Terrain/climate/season/river/sea choke points and movement capacity.
- Attrition, disease, desertion, supply shortage and war exhaustion/support.
- Battles, tactics, command, equipment, morale, casualties and retreat.
- Siege/occupation/control, resistance, devastation and post-war reconstruction.
- Naval battles, convoy protection/raiding, blockade, amphibious transport/landing, naval presence and sea control.
- Peace negotiation, war goals, reparations, territorial transfer, subject changes, demobilization, debt and political aftermath.

### 17.3. The Great Wave parity

Mô hình độc lập các khả năng:
- Ship Designer: thiết kế tàu theo role, hull/size/technology/armament/propulsion/range/maintenance/cost trade-off.
- Fleet composition: coastal defense vs blue-water power projection.
- Flagship: identity, leader, prestige, command bonus, lifecycle, loss consequences.
- Ship purchase/sale treaties: ownership transfer, payment, delivery, naval access and diplomatic effects.
- Gunboat diplomacy: naval coercion tied to actual deployed capability and strategic geography.
- Sea lanes, straits, ports, coaling/fuel/repair/supply and convoy protection.

Không chỉ thêm panel ship designer. Ship spec phải tác động cost, build time, performance, range, logistics, maintenance and combat outcomes.

## 18. Colonization, slavery/coercive labor và historical social systems

- Colonization must be historically scoped and legally/politically modeled, with indigenous polity agency, resistance, disease, displacement and resource extraction represented carefully.
- Distinguish colonial claims, treaty rights, protectorate, company rule, occupation, settlement, annexation and decolonization.
- Coercive labor/slavery/serfdom/indenture systems where source-backed must have legal and economic mechanics, effects on Pops, productivity, rights, resistance, migration and political conflict.
- Do not trivialize human harm as simple productivity buff. Provide clear, historically careful language and consequences.
- Discrimination and rights laws can affect access, employment, mobility, political power and migration.
- Avoid false precision and anachronistic social categories.

## 19. Events, Journal Entries, decisions và narrative history

A historical event record needs:
- ID, title/body authored independently, dates/validity interval, geography, actor, source refs, provenance/license, confidence.
- Trigger conditions, prerequisites, causal class, outcomes, follow-up hooks and cooldown/repeat policy.
- Player choice and AI decision, where appropriate.
- Deterministic effects and logged reasons.
- Relationship to historical mode vs sandbox.
- UI history, event artwork/media and localization.

Journal entry/objective should be long-running state machines with conditions, progress, actions, expiry/failure, reward/cost and branch outcomes. Country-specific content can enrich systems but must not replace global mechanics.

Events must not hard-code all future history. They can create decisions, pressures, incentives and branch points. Historical outcomes should emerge where feasible from simulation; scripted outcomes need explicit justification and must remain optional where the design allows.

## 20. AI quốc gia và thế giới

- Player and AI use the same command validation, costs, rules and state mutation pipeline.
- AI decisions are bounded by CPU/time budgets and reproducible per seed/state.
- Strategy has goals/horizons, economic priorities, domestic stability, technology, diplomacy, security, military capability and risk tolerance.
- Separate strategic planning from tactical execution.
- Explainable decision record: selected action, alternatives considered, constraints, utility/rationale, expected effects and outcome.
- Avoid infinite loops, oscillation, contradictory commitments and excessive repeated actions.
- AI for small/decentralized polities should fit their institutional/economic agency instead of pretending they operate a modern centralized ministry.
- Stagger/partition country evaluation; cache safe read models; avoid global expensive scans each month.
- Deterministic RNG streams must be isolated by system/entity to avoid one optional UI/event changing unrelated outcomes.

---

# PHẦN III — GAME LOOP, INVARIANTS VÀ DEFINITION OF DONE

## 21. Các causal loops bắt buộc phải chứng minh bằng code/test

Đây là những vòng gameplay tối thiểu để xác định game đã có chiều sâu hay chưa.

### Loop A — Pops, market và mức sống

Cohort composition/needs → demand orders → goods availability/prices → affordability/consumption → wealth/SoL/unmet needs → migration/political pressure.

Test: giảm cung một good thiết yếu phải ảnh hưởng cohort tiêu dùng loại good đó; cohort chịu shock có SoL/unmet needs khác cohort không chịu shock; effect có giải thích và persist qua save/load.

### Loop B — Production, employment và markets

BuildingType/ProductionMethod → inputs/jobs/qualifications → hiring/input allocation → actual output → market supply/prices → wages/profits/tax → Pops and investment.

Test: thiếu input làm output thật giảm trước khi ghi supply; Production Method thay đổi input/output/jobs; buildings cạnh tranh lao động theo qualification/wages khi S12 được mở.

### Loop C — Transport và regional access

Geography/infrastructure capacity → path/transport cost/time → shipment capacity → local goods availability/prices → viability of sites and investment.

Test: mất port/rail/sea lane phải thay đổi shipment/access/prices cho các vùng phụ thuộc, nhưng không làm hàng hóa tự mất ngoài ledger.

### Loop D — Laws, institutions và political power

Law/institution → rights/capacity/cost/access → cohort/company incentives/outcomes → interest groups/movements → government legitimacy/reform/conflict → new laws/institutions.

Test: thay đổi một law có trace được đến nhóm chịu ảnh hưởng và hệ thống downstream; không chỉ thay đổi label hoặc icon.

### Loop E — Diplomacy và international order

Treaty/obligation/Power Bloc/subject → market access, foreign investment, autonomy, military support → AI strategic reaction → future negotiations/crisis.

Test: treaty expiry/breach hoặc subject autonomy change tác động đến các hệ thống phụ thuộc và save/load.

### Loop F — Mobilization và war

Mobilization → manpower/equipment/finance/supply → movement/front/battle/blockade → casualties/occupation/war support → debt/population/politics/peace settlement.

Test: war consumes resources and changes military/population/fiscal/political state; peace settlement changes territory/relations/subjects consistently.

### Loop G — Time, save and continuation

Command → deterministic monthly/day phase updates as designed → state transitions → save envelope + RNG/system state → process/app restart → load → identical continuation.

Test: save at same point in two identical runs and continue with same command sequence; compare canonical state hash and first differing path.

## 22. Invariants cấp engine

Các hệ thống phải có invariant riêng, đồng thời tuân thủ các nguyên tắc chung:

- Population mass không âm và bảo toàn qua split/merge/migration; births/deaths là các flow rõ.
- Goods physical stock không âm; mọi production/consumption/import/export/transfer/spoilage được hạch toán.
- Treasury/debt/financial ledger không có giá trị thay đổi ngoài transaction hợp lệ.
- Building status buckets loại trừ nhau; construction projects sở hữu trạng thái đang xây.
- Job counts không vượt nhu cầu/capacity/qualified labor; một worker cohort không bị gán trùng ngoài mô hình.
- Ownership shares hợp lệ và tổng sở hữu theo policy.
- Treaties/relations/subjects có dates, legal states và lifecycle hợp lệ.
- Unit manpower/equipment/supply có giới hạn và transitions hợp lệ.
- RNG calls and simulation order deterministic under the declared contract.
- Historical validity intervals không rò rỉ dữ liệu từ tương lai vào mốc trước.
- Save migration tuần tự, fail-safe và không phá bản save tốt cuối cùng.
- UI read model là projection từ engine state; không phải nguồn chân lý song song.
- Invalid input must fail closed with domain validation errors rather than partial mutation.

## 23. Definition of done cho một gameplay feature

Một feature chỉ được coi là implemented khi tất cả điều kiện phù hợp được chứng minh:

1. Requirement và reference mechanics đã được nghiên cứu, nêu đúng phiên bản.
2. Domain model/schema rõ, static data tách mutable state.
3. Có player/AI command thực sự thao tác được.
4. Có validation, prerequisites, costs, resource constraints và failure behavior.
5. Có tác động trong simulation và liên kết hệ thống downstream.
6. Có UI để inspect, hiểu causal chain và ra quyết định.
7. Có tooltip/ledger/history giải thích kết quả; không cần phải phỏng đoán.
8. Save/load/backup/migration giữ được trạng thái.
9. Unit, integration, invariant, regression và determinism tests bao phủ normal/edge/error cases.
10. Performance budget và profiler/test evidence có ở mức phù hợp.
11. Historical data có provenance/license/confidence khi có dữ liệu lịch sử.
12. CI pass trên exact commit.
13. Rolling report và AI_HANDOFF cập nhật exact SHA/evidence.
14. Claude self-review được đánh dấu implementer self-audit; ChatGPT/độc lập reviewer đánh giá exact SHA.
15. Chủ dự án quyết định ACCEPTED/gate transition riêng.

Không dùng các tiêu chí thay thế sau để tuyên bố feature done: thêm menu, thêm nút, thêm counter, tạo nhiều file, tăng số dòng code, tăng số ảnh nhưng không link vào game, build thành công, hoặc APK có kích thước lớn.

---

# PHẦN IV — KIẾN TRÚC ANDROID VÀ KỸ THUẬT

## 24. Kiến trúc phân lớp bắt buộc

Thiết kế theo các lớp có boundary rõ:

1. **Static content/data layer:** country, region, good, building, production method, technology, law, character/event definitions, localization, map geometry, asset registry, sources and licenses.
2. **Domain model:** mutable GameState, typed entities, stable identifiers, versioned state and indexes.
3. **Simulation systems:** population, demographics, economy, market, logistics, construction, politics, diplomacy, military, events and AI.
4. **Command/application layer:** validation, authorization, preconditions, cost, execution order, transactions and event history.
5. **Read-model/selector layer:** derived UI snapshots, aggregations, indexes and causal explanation.
6. **Persistence layer:** versioned save schema, migrations, backup/restore, validation and recovery.
7. **UI layer:** map, lenses, panels, dialogs, ledgers, alerts, timeline and action controls.
8. **Android bridge/runtime:** Capacitor/WebView lifecycle, orientation, storage, files, app state and device capability.
9. **Content delivery layer:** signed catalog/manifest, explicit opt-in, download/resume/verify/stage/activate/rollback, offline status.
10. **Media runtime:** lazy-load, streaming, bounded cache, LOD, decoded asset eviction, audio/video controls and accessibility.

Không để React/TSX component import trực tiếp và mutate deep engine state. Không để UI tính lại economics riêng. Không để static definitions bị sửa theo từng campaign. Không để downloadable data pack chứa executable JavaScript/native code.

## 25. Determinism, state transitions và save

- Tách simulation RNG streams theo domain/system; seed và state cần thiết đều được persist.
- Command order phải được định nghĩa rõ. Optional UI/media/rendering không được thay đổi simulation RNG.
- Engine tick phải tách các phases rõ ràng, có contract trước/sau từng subsystem.
- Nếu task cần asynchronous/batched execution, phải có cancellation/invalidation, sequence IDs, race protection và deterministic commit order.
- Save envelope phải theo roadmap S1: engineVersion, saveSchemaVersion, dataBuildHash, seed/RNG state và các state references cần thiết.
- Migrations tuần tự, có backup/rollback. Không ghi đè bản save cuối cùng khi migration/serialization fail.
- Unknown fields, future version, invalid IDs, missing data packs, corrupted data và data hash mismatch phải được xử lý rõ.
- Do not inflate every save with full command history. Determinism is proven through controlled command sequences in tests; replay log may be optional debug sidecar.

## 26. Android performance and resource budgets

Target device class is Android phone, including project owner's iQOO Z10 Turbo / Dimensity 8400 Turbo / 12 GB RAM. This is a test target, not permission to assume all devices have equal resources.

- Simulation and heavy parsing/IO/decompression must not block UI.
- Use bounded work per frame/tick; backpressure prevents runaway fast-forward.
- No overlapping simulation batches. Cancellation after load/new game/background lifecycle must invalidate stale operations.
- Use incremental indexes and deterministic partitions; avoid repeated full scans of all world entities.
- Map uses LOD, viewport culling, layer culling, label density limits, spatial indexes and simplified geometry where safe.
- Media uses lazy loading, bounded texture/audio caches and eviction. Source-quality installed assets remain intact.
- Avoid long-lived references to Activity/WebView/context; remove listeners/timers on lifecycle transitions.
- Test memory growth over long sessions, WebView renderer loss, WebGL context loss, orientation changes, app background/process death, storage pressure and interrupted pack download.
- Performance numbers must be measured and reported. Desktop CI is not physical Android QA.
- Keep CPU, RAM, GPU, battery, storage and thermal envelope visible in test plan and profiling report.

## 27. Landscape-first command interface

The UI should borrow the information architecture of a sophisticated grand-strategy game without copying its proprietary skin.

### Persistent frame
- Top bar: date/time controls, country flag/identity, treasury, prestige/rank, alerts and speed.
- Main area: interactive map with selectable lenses and contextual highlighting.
- Side panel: context-sensitive inspector for selected country, state, settlement, building, cohort, character, unit or treaty.
- Bottom/overlay layer: event timeline, alerts, command queue, active diplomatic plays, construction and war summaries.
- Global navigation: World, Country, Population, Economy, Production, Market/Trade, Politics, Technology, Diplomacy, Military, Journal, History, Settings.

### Domain-specific visual grammar
- Economy: supply/demand, production flow, input bottleneck, prices, wage/profit, construction queues and fiscal ledger.
- Population: cohort composition, needs, SoL, employment, identity/rights, migration and political weight.
- Politics: government, law cards, support/legitimacy, IGs, movements, reforms and unrest.
- Diplomacy: relations, treaty terms, obligations, subject chains, bloc membership, diplomatic plays and negotiation.
- Military: theaters/fronts, formations, supply route, naval task forces, convoy/blockade, readiness and battle reports.
- Technology: prerequisites, research progress, diffusion and production method unlocks.
- Map: selectable lenses, consistent legends, temporal filters and geographic drilldown.

Panels should show causal explanation and forecast range when appropriate, not opaque score bars. Touch targets, typography, safe areas, clipping, scroll depth and navigation state must be tested on actual landscape phone dimensions.

---

# PHẦN V — CONTENT, MEDIA VÀ OFFLINE DELIVERY

## 28. Asset and media catalogue

Media is product content, not an optional placeholder. Maintain a registry with:
- asset_id, content type, format, resolution/dimensions, frame rate/duration, audio sample rate/bitrate where relevant;
- entity/place/feature links and temporal validity;
- source, author, license/rights, attribution, provenance and confidence;
- source hash, packaged hash, quality check, file size and content-pack membership;
- UI/gameplay reference showing where the asset is actually used.

Content groups:
1. Country flags, coats of arms, banners and historical identity.
2. Country/ruler/political/military/character portraits.
3. Culture/clothing/uniform/period visual references.
4. Settlement/capital/region/country background illustrations.
5. Building/factory/industrial/rail/port/canal/shipyard artwork.
6. Army/navy/unit/ship models or 2D/3D representations.
7. Event and journal illustrations with date/place/entity binding.
8. Map textures, terrain, geographic overlays and paper-map skins.
9. UI icons, panel illustrations and contextual diagrams.
10. Video/cinematic/event sequences and realtime animations.
11. Original/licensed music, region/era soundscapes, UI feedback, industry, transport, battle and naval sounds.
12. Optional narration/voice where designed, with captions/subtitles and mute/accessibility alternatives.

No asset is considered covered because an image file exists. It must match the entity, place, era, content purpose and license, and be addressable in runtime.

## 29. Offline content packs

Required architecture:
- Core bootstrap/APK with engine/UI/pack manager/minimum boot data.
- Visible catalog of required and optional packs, sizes, versions, dependencies, coverage and installed/verified state.
- Explicit user action before any data transfer.
- User chooses Wi-Fi/mobile-data policy; never silently switch to mobile data.
- Resume/retry/pause/cancel and preflight storage.
- Signed canonical manifest plus per-file SHA-256 and compatibility checks.
- Validate paths, MIME types, file sizes, IDs, schema and provenance.
- Stage separately, verify everything, then atomic activate; preserve last known-good pack and rollback.
- Data packs cannot execute code or inject HTML/JS.
- Offline play after required packs installed; no forced streaming or paid provider requirement.
- Safe removal only if saves do not depend on removed data; clearly show dependencies.
- Missing/partial content must be honestly represented: Core Only / Partial Content / Full Offline Content.
- Real installed footprint approaches owner target 4–5 GB through meaningful and used game content.

---

# PHẦN VI — ROADMAP VÀ PHÂN RÃ CÔNG VIỆC

## 30. Quy tắc thực hiện roadmap

Roadmap canonical hiện vẫn là docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md áp dụng owner amendments v3.3. Master brief này giúp định nghĩa sản phẩm và phân nhiệm, **không thay thế** thứ tự S0–S23, sub-gate, owner decision hoặc acceptance criteria đã được duyệt.

Chỉ triển khai **một phase/task được phép tại một thời điểm**. Mỗi phase cần scope, baseline SHA, in-scope/out-of-scope files, dependencies, tests, performance and acceptance criteria. Không tự ý nhảy thẳng tới S6, S7 hoặc UI vì đó là phần dễ nhìn thấy hơn.

### 30.1. Giai đoạn và phụ thuộc

| Phase | Phạm vi | Kết quả chính | Ràng buộc |
|---|---|---|---|
| S0 | Audit/baseline/gates | Evidence, test catalog, risk register, bounded S1-entry package | Đang còn B4/B7 review, G0.7/G0.8/G0.9 issues; không gameplay changes |
| S1 | Data contracts, schema, save compatibility | Static data vs mutable state, IDs, provenance, DB hash, versioned save/migration | Chưa bắt đầu; chỉ sau gate/owner acceptance và scope duyệt |
| S2 | Runtime/lifecycle/reliability | Autosave, lifecycle/process death, WebView/WebGL recovery, performance/backpressure | Sau S1 theo roadmap |
| S3 | Geography/admin crosswalk | Temporal admin units, region crosswalk, boundary lineage | Không sửa historical borders không có nguồn |
| S4 | Settlements/multilingual place names | City/town/village/port/capital records, coordinates and uncertainty | Coverage toàn cầu + performance budgets |
| S5 | Asset registry/rights | Registry, provenance, temporal coverage, licenses, manifests | Không ship asset rights-unknown như hợp pháp |
| S6 | Population cohorts/social foundation | Cohort canonical state, identity, demographics, skills, migration, mass balance | Không tuyên bố hiring/wages thật; phần đó là S12 |
| S7 | Goods/inventory/accounting | Goods registry, stock-flow ledger, clearing, price rules and conservation | Không đi trước dependencies |
| S8 | Infrastructure/transport/market access | Transport graph, capacity, routes, shipments, access and blockades | Geography/market contracts phải phù hợp |
| S9 | Technology/diffusion | Research, innovation, diffusion, adoption and unlocks | Era/region-specific |
| S10 | BuildingType/site potential/ProductionMethod definitions | Building catalog, recipes, input/output, workforce and unlock requirements | No invented historical facilities |
| S11 | BuildingSite operations | Actual site operations, input allocation, production, efficiency, closure | Workforce only aggregate/labelled until S12 |
| S12 | Employment/wages/labor competition | Job slots, qualifications, hiring/firing, wages and unemployment | Real hiring only here |
| S13 | Ownership/firms/capital/investment | Owners, dividends, pools, foreign investment, ownership changes | Follow approved data model |
| S14 | Construction | Capacity, queue, project costs/progress, pause/cancel and delays | No instant-build shortcut |
| S15 | Local government/public services/urbanization | Administrative capacity, service access/quality and city growth | Population/employment/housing coupling |
| S16 | Characters | Historical/generated character runtime entities, office, traits and succession | Unknown persons remain unknown |
| S17 | Politics/institutions | Laws, IGs, movements, legitimacy, reform and unrest | Institution-specific; not universal parliament |
| S18 | Diplomacy/international order | Relations, treaties, subjects, crises, diplomatic plays and blocs | Real treaty terms/lifecycle |
| S19 | Strategic AI, non-military first | Goals, economy, domestic policy, diplomacy and explainable decisions | Military planning joins S20–S21 |
| S20 | Military organization | Unit/formation/fleet types, recruitment, commanders and equipment | Migration of legacy forces must not invent |
| S21 | Operations/combat/logistics | Movement, fronts, supply, battles, sieges, naval/blockade and peace | Split S21a/b/c if authorized and needed |
| S22 | Historical events/global calibration | Event registry, temporal/geographic data, seed scenarios and benchmarks | Currently DESIGN_ONLY; no runtime authority |
| S23a | UI integration/polish | Full cross-system navigation, map panels and landscape-first UX | Domain UI must exist alongside system phases |
| S23b | Media/content packs/offline delivery | Full media coverage, pack manager, integrity, offline play | 4–5 GB real content target |
| S23c | Release/device QA | Device matrix, long sessions, thermal/memory, distribution decision | Signing/secrets/release steps require separate authorization |

### 30.2. P0 order of causal system dependencies

The practical gameplay construction order should respect the roadmap dependency graph. The main economic spine is:

S1 data/save → S2 reliability → S3/S4 geography and places → S5 asset rights → S6 cohorts → S7 goods/inventory/accounting → S8 logistics/access → S9 technology → S10 definitions → S11 site operations → S12 labor/wages → S13 ownership → S14 construction → S15 services/urbanization.

Political/character/diplomatic/military layers integrate on top according to approved roadmap:

S16 characters → S17 politics/institutions → S18 diplomacy → S19 strategic AI; S20 organization → S21 operations; S22 events/calibration. S23a/b/c integrate UX/media/offline/release after systems have user-facing surfaces and acceptance evidence.

Do not skip dependencies because a later feature is visually attractive.

## 31. Task assignment and role ownership

This section records the new owner instruction: **Claude Code is the primary code author for future authorized implementation work.** The protocol update in AI_COLLABORATION_PROTOCOL.md is the governing role record.

### 31.1. Project owner
- Owns product goals, priority decisions, acceptance and phase transitions.
- Explicitly approves scope when a gate or decision requires it.
- Supplies real-device evidence/approval where required.
- Does not share secrets/keystores/private keys in chat or repository.

### 31.2. Claude Code — primary implementation agent
- Primary owner of implementation code for each explicitly authorized task.
- Reads every mandatory project/phase/spec/research/review document fully before modifying files.
- Owns technical decomposition, domain contracts, implementation, tests, self-review, exact-SHA CI, commit/push and handoff for assigned tasks.
- Makes one reviewable slice per task; do not mix unrelated domains.
- Keeps simulation logic in engine/domain modules, commands in command layer, read models in selectors and presentation in UI.
- Updates actual source/tests, not just design documents, when a task is authorized.
- Never marks its own work as independent REVIEW_PASS or ACCEPTED.
- Never changes a closed phase, save schema outside S1, package/signing/secrets, workflows, release configuration or data packs outside its authorized scope.

### 31.3. ChatGPT — technical lead, architecture coordinator and independent reviewer
- Maintains product/system coherence, task ordering, dependency mapping and scope control.
- Reviews Claude's proposed contracts and bounded plans before code where useful.
- For Claude-authored code, performs a no-write technical review only when ChatGPT did not co-author the same change set; checks invariants, concurrency, determinism, migration, performance, test quality and exact GitHub evidence.
- Does not pretend to be an independent reviewer if it contributed implementation to that change set. In that case owner may assign DeepSeek or another independent reviewer.
- Coordinates CI evidence, handoff, parity matrix and cross-system integration.
- Does not independently change phase/gate status or accept deliverables.

### 31.4. Gemini Hydrogen — research and content support
- Researches historical entities, population/economy/event data, borders, characters, maps and media provenance when assigned.
- Provides sources, date/coverage, methodology, uncertainty, rights/license and machine-readable delivery.
- Research outputs remain candidates until validation and explicit integration approval.
- Never silently invent or commit unverified history.

### 31.5. DeepSeek — independent reviewer fallback
- May be assigned by owner if Claude or ChatGPT cannot be independent due to authorship/conflict/quota.
- Must inspect exact current HEAD and provide evidence-linked findings.
- Cannot review code it authored.

## 32. Current assignment queue at this checkpoint

**Verified baseline at preparation:** repository mtieu6470-maker/Victori3-mobile; branch claude/game-historical-sandbox-modes-kg7rj7; documentation HEAD observed as 764fd121ce614678c8ab476ede33aacfd97c6efa before this master brief was added. Re-fetch before acting; this SHA is not a future/current guarantee.

| Order | ID | Owner | Assignment | State / restriction |
|---|---|---|---|---|
| 1 | TAKEOVER-READ-01 | Claude | Read this brief, AI_START_HERE, AGENTS, CLAUDE, recovery protocol, handoff, collaboration protocol, owner principles/directives, canonical roadmap, current gate files and relevant implementation/tests fully | Required before any code |
| 2 | REVIEW-DEV007 | Claude | No-write independent review of DEV-007 exact code/test target 387ae24eae91b560b0f10cec6d59febb11396401 using docs/audit/s0/DEV007_CAMPAIGN_CALENDAR_CLAUDE_REVIEW_REQUEST_2026-11-20.md | Only independent if Claude did not author that target; no phase change |
| 3 | REVIEW-S0-B4-B7 | Claude | No-write review of exact B4/B7 packages, source/tests, risk register, ledger, signoff and known G0.6/R14/C3/R7 issues | Independent review only; owner acceptance remains separate |
| 4 | S0-GATE-CLOSE | Owner + reviewers | Resolve documented blockers and obtain the bounded independent REVIEW_PASS plus owner ACCEPTED required for S1 entry | Claude cannot approve its own gate or bypass this step |
| 5 | S1-IMPLEMENTATION | Claude | After S1 is explicitly opened and exact scope approved: implement data contracts, static/mutable separation, schema versioning, save migration and deterministic continuation under S1 | NOT AUTHORIZED at this checkpoint |
| 6 | S2-RELIABILITY | Claude | After S1 acceptance and S2 authorization: lifecycle, autosave/backup/restore, WebView/WebGL recovery and performance/backpressure | NOT AUTHORIZED at this checkpoint |
| 7 | S3-TO-S23 | Claude + research support | Execute the approved roadmap one phase at a time, following §30 and current owner amendments | No parallel phase jumping |

The first two Claude assignments are review/verification of earlier work, not new gameplay coding. The first code task is the first task whose phase gate is open and whose exact scope is approved. If S1 remains closed, do not start S1 runtime code.

## 33. Definition of one delivery slice

Before code:
- Task ID, authorization source, phase/gate and target acceptance.
- Exact base SHA and target branch.
- In-scope/out-of-scope files.
- Domain contract, state transitions, invariants and expected causal loops.
- Static data/schema/save implications.
- Normal, edge, invalid and failure tests.
- Determinism and performance test plan.
- External research and license/provenance requirements.

During code:
- One coherent vertical slice only.
- Domain logic, command path, read model and UI as appropriate to phase.
- Tests added beside source changes.
- No placeholders that masquerade as implementation.
- No unbounded work or full-world scan on UI thread.
- Run targeted tests before broad CI.

At checkpoint:
- Exact command/exit codes.
- Exact commit SHA and changed files.
- Test counts and CI run IDs/URLs on exact SHA.
- Logs and artifact references.
- Save migration evidence if relevant.
- Device evidence only if actually collected.
- Update parity matrix and rolling progress report.
- Update AI_HANDOFF and commit/push.
- Re-fetch GitHub HEAD and the written files after push.
- Set status to IN_PROGRESS/READY_FOR_REVIEW/REVIEW_PASS/ACCEPTED only when evidence and authority justify it.

## 34. Claude's required report format (short but evidence-complete)

Every completed slice should report in repository files:
1. Task ID and authorization.
2. Base SHA → result SHA.
3. Files changed and system interactions implemented.
4. Causal loop proven.
5. Tests/commands/exit codes.
6. CI workflow/run and exact tested head_sha.
7. Artifact and separate APK SHA / ZIP digest if relevant.
8. Save/load/determinism/performance notes.
9. Remaining gaps and risks.
10. Independent reviewer and verdict.
11. Owner acceptance/gate status.
12. Exact next task.

Do not send the owner a long repeated audit. Keep the user-facing summary compact; preserve technical evidence in GitHub.

---

# PHẦN VII — GOVERNANCE, SAFETY VÀ STOP CONDITIONS

## 35. Phase gates are hard boundaries

- The master brief is not a phase authorization.
- The owner's new role instruction changes who is the primary code author; it does not open S1/S2/S22 or any other closed phase.
- S0-B4/B7 and DEV-007 review statuses are not silently changed by this brief.
- Current handoff records B4 and B7 READY_FOR_REVIEW, independent verdict/owner ACCEPTED pending; S1 NOT_STARTED; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED. Re-fetch and reconcile exact current records before acting.
- No gameplay/engine/save changes in S0 audit lane.
- No use of an old "full discretion" chat statement to override a newer phase gate or exact owner decision.
- No phase transition without independent REVIEW_PASS for the required package and separate owner ACCEPTED, as specified by OD-20261116-11 and the collaboration protocol.
- Any conflict between this brief and a later explicit owner decision: latest owner decision wins within its stated scope; document the conflict and do not silently rewrite canonical roadmap.

## 36. Security, privacy and legal requirements

- No credentials, API tokens, keystore, password, private key or signing data in code, documents, chat, artifact or logs.
- No unapproved signing workflow, package identity or release changes.
- No paid APIs, paid cloud providers, data feeds or mandatory services unless the owner explicitly approves cost.
- No silent network call or background content download. Offline-first.
- No unlicensed copyrighted assets or proprietary Victoria 3 materials.
- No injection/executable code in content packs.
- Historical content must remain traceable to lawful sources and must distinguish facts, estimates, contested claims and unknowns.
- Never mark a source candidate as verified merely because it exists in a CSV or research dossier.

## 37. Stop / blocker protocol

Stop the affected write and report BLOCKED if:
- Required owner authorization/gate is missing.
- Exact HEAD or prior write result cannot be verified.
- A required canonical source/spec is inaccessible.
- Owner decisions conflict materially.
- Migration could destroy existing saves or no rollback exists.
- Data license/provenance is not acceptable.
- A test demonstrates loss of population/goods/money or nondeterministic state mutation.
- Performance can cause ANR, memory runaway or corrupted saves.
- A security-sensitive permission/secret is required.
- Scope expansion would change phase, save format, package or workflow without approval.

Do not ask the owner to repeat details already present in GitHub. Ask only the smallest decision genuinely missing.

---

# PHẦN VIII — PARITY REGISTER VÀ ACCEPTANCE CHECKLIST

## 38. System parity checklist

Use this list to update docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv. Each item must have implementation state, source file(s), data coverage, tests, performance evidence and known differences.

- [ ] World map, geography, administrative units and temporal borders.
- [ ] Countries/polities, sovereignty, subjects, dependencies and formation/succession.
- [ ] Population cohorts, identity, professions, wealth, education, needs and demographics.
- [ ] Standard of Living, unmet needs, migration and political response.
- [ ] Goods taxonomy, inventories, material accounting and stock-flow conservation.
- [ ] Production chains and selectable Production Methods.
- [ ] Building Types, Sites, workforce and operational lifecycle.
- [ ] Employment, qualifications, hiring, firing, unemployment and wages.
- [ ] Ownership, companies, profit/dividends, investment and nationalization.
- [ ] Construction capacity, queues, costs, delay and completion.
- [ ] Local government, bureaucracy, services and urban development.
- [ ] Markets, local prices, market access, shortages/surpluses and trade.
- [ ] Companies/charters, monopolies, prestige goods and trade policy.
- [ ] Infrastructure, transport, ports, rail, shipping, convoys and blockades.
- [ ] Treasury, tax, debt, credit, interest and fiscal crisis.
- [ ] Laws, government, interest groups, legitimacy, elections where relevant.
- [ ] Political lobbies, agitation, movements, reform, revolution and civil war.
- [ ] Institutions, research, innovation, diffusion and technology unlocks.
- [ ] Characters, traits, appointments, rulers, succession and generals/admirals.
- [ ] Bilateral diplomacy, treaties, obligations, guarantees and alliances.
- [ ] Diplomatic plays, sway, backing, escalation and negotiation.
- [ ] Subjects, autonomy, liberty desire, integration and independence.
- [ ] Power Blocs, principles, leverage, cohesion and bloc interactions.
- [ ] Colonization, indigenous polity agency, slavery/serfdom and historical rights.
- [ ] Land forces, formations, recruitment, commanders, readiness and equipment.
- [ ] Fronts, operations, movement, supply, combat, siege, occupation and peace.
- [ ] Naval ship design, fleet composition, flagships, ship treaties and gunboat diplomacy.
- [ ] Journal entries, events, decisions, historical characters and country content.
- [ ] Strategic AI and world AI, with explainable decisions and shared rules.
- [ ] Historical/Sandbox shared engine and non-railroaded alternate history.
- [ ] Deterministic time progression, save/load, migration and recovery.
- [ ] Landscape-first map UI, lenses, panels, inspector, tooltip and localization.
- [ ] Asset/media coverage, licensing/provenance and period-aware presentation.
- [ ] Offline content-pack delivery, signature/hash verification, rollback and offline play.
- [ ] Android lifecycle, reliability, memory, performance and physical-device QA.

## 39. Acceptance examples: no superficial substitutes

| Superficial result | Actual required behavior |
|---|---|
| Population counter | Cohort composition, needs, work/wealth/political effect, migration and mass balance |
| Building level counter | BuildingSite, PM, input/output, capacity, workforce/status, costs and consequences |
| Good price number | Market stock-flow, price formation, access, shortages, producer/consumer effects |
| Trade route line | Persistent route with volume/capacity/cost/tariff/convoys and actual shipped goods |
| Law dropdown | Legal process, political support, time, legitimacy, rights and downstream outcomes |
| IG list | Cohort/wealth/ownership-derived power and approval with movement/cabinet effects |
| Treaty badge | Terms, dates, obligations, breach, expiry and effects on economy/diplomacy/military |
| War button | Diplomatic play, escalation, mobilization, supply, operations, casualties and peace |
| Ship designer form | Specs alter production cost, build time, fleet range/readiness, combat and diplomacy |
| Historical event pop-up | Source-backed trigger, temporal validity, actors, choices and deterministic state effects |
| AI action counter | AI goals, legal commands, budget/resource constraints, reasoning and observable outcomes |
| Save button | Versioned safe serialization, migration, backup and deterministic continuation |
| 4–5 GB download | Useful licensed/provenanced game data/media installed and actually used offline |

## 40. Mandatory pre-code reading for Claude

Before any implementation, read full current versions (not excerpts):
1. AI_START_HERE.md
2. AGENTS.md
3. CLAUDE.md
4. docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md
5. docs/coordination/AI_HANDOFF.md
6. docs/coordination/AI_COLLABORATION_PROTOCOL.md
7. docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md
8. docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md
9. docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md
10. docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md
11. docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md
12. Exact phase spec, review packet, relevant subsystem specs, parity audit/matrix, rolling report and actual code/tests.
13. This master brief in full.

Re-fetch branch HEAD and relevant files from GitHub before reading; the SHAs in this document are checkpoint references, never assumed current.

---

# PHẦN IX — KẾT LUẬN CHỈ ĐẠO

Claude là người viết code chính cho những task mà chủ dự án đã cho phép. Hãy xây dựng game theo từng lát cắt vertical, bắt đầu từ nền tảng phụ thuộc thấp nhất đang được mở, không chạy theo việc tăng số menu hoặc dung lượng. Mỗi phần phải tạo ra hành vi mô phỏng thật, liên kết hệ thống, có test và bằng chứng.

Ưu tiên theo thứ tự:

1. Đúng governance và save safety.
2. Domain model, conservation, determinism và reliability.
3. Causal gameplay loop có thể chơi được.
4. Toàn cầu và historical validity.
5. AI và tương tác chiến lược.
6. Map/UI/visual grammar đủ sâu để ra quyết định.
7. Asset/media và offline content delivery.
8. Polish, performance tuning và release.

**Không vượt phase gate để tạo cảm giác tiến độ. Không dừng ở audit khi task được duyệt đã rõ. Không gọi placeholder là gameplay. Không tuyên bố parity khi chưa có bằng chứng.**

Chủ dự án muốn một sản phẩm grand strategy thực sự, có chiều sâu ngang tầm mục tiêu Victoria 3, trên Android landscape-first, hoạt động offline sau khi người dùng cài đủ nội dung, và có nội dung thật hướng tới 4–5 GB. Tất cả quyết định kỹ thuật phải phục vụ mục tiêu đó.
