# Kiểm toán baseline lịch sử toàn cầu — Historical Mode

**Ngày:** 18/11/2026  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Data baseline SHA:** `44ab55f34c2069207be6d5dd23b49ba5c38fdfd0`  
**Documentation baseline SHA:** `b63149242618c09d722f06068826f1651dc226ad`  
**Trạng thái:** `SELF_AUDIT / DOCUMENTATION_ONLY / NO_PRODUCT_PATCH`

## 1. Kết luận điều hành

Dữ liệu trong repository hiện là **nền tảng ban đầu**, chưa đủ để tuyên bố chuỗi lịch sử kế vị chính xác toàn cầu cho toàn chiến dịch 1836–1936. Có nhiều chuỗi tốt ở một số nước, nhưng còn thiếu country profiles, thiếu timeline kế vị, phụ thuộc Wikipedia/default citations, và mô hình hiện tại chưa biểu diễn đầy đủ các tầng quyền lực.

Đây là audit dữ liệu và đường sử dụng của engine, không phải kiểm định toàn bộ nội dung game. Không có dữ liệu gameplay hoặc engine nào bị sửa trong gói này.

## 2. Coverage baseline

| Chỉ số | Giá trị |
|---|---:|
| Political entities trong `historical_data/political_entities/registry.json` | 181 |
| Country profiles (136 core + 11 detailed) | 147 |
| Succession arrays trong `heads_of_state.json` | 93 |
| Tổng succession records | 439 |
| Profile có succession array | 93 / 147 = 63,3% |
| Profile chưa có succession array | 54 / 147 = 36,7% |
| Tier A | 11 / 11 có array |
| Tier B | 24 / 29 có array |
| Tier C | 58 / 104 có array |
| Tier D | 0 / 3 profile có array |
| Registry entities không có country profile | 34 |

54 profile thiếu succession array:

`ION, WAL, MOL, CIR, IMM, HER, KAN, KHI, BUK, KOK, NAJ, YEM, SND, KAL, NAG, AWA, GWA, HOL, BRD, PRI, BHU, SKM, TIB, RYU, LUA, MLY, BRN, SUL, ACE, MAO, MOR, TUN, CON, ABD, ETH, SHE, BOR, WAD, DAR, ASH, DAH, OYO, MAS, FJA, LIB, ZUL, NDE, BSO, MER, BUG, TEX, CAF, RGS, HAI`.

34 registry entities không có country profile gồm 19 future polities, 4 subject components và 11 decentralized placeholders. Không được gộp 34 này vào “thiếu vua”: future polity cần formation/leader timeline; subject component cần xác định authority; decentralized placeholder có thể cần mô hình hội đồng/collective authority.

Ma trận `GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv` có một dòng cho mỗi 181 registry ID.

## 3. Provenance và chất lượng nguồn

Trong 439 records:
- 346 records có `sources` riêng ở cấp record.
- **288 records chỉ được trích `wikipedia_en`**, không có nguồn non-Wikipedia kèm theo.
- 58 records có ít nhất một nguồn non-Wikipedia.
- 93 records không có source reference cấp record; file chỉ khai báo `sources_default = [bayly_2004, osterhammel_2014]`.
- 436 records thừa hưởng `quality_default = supported`; chỉ 3 records gắn `quality = uncertain`.

Điều này không chứng minh 288 records sai. Nhưng nó **không đủ để coi chúng đã được xác minh độc lập** theo tiêu chuẩn Historical Mode. Wikipedia là đầu mối truy nguồn, không phải chứng cứ cuối cho mốc kế vị quan trọng. Hai nguồn mặc định là sách tổng quan lịch sử toàn cầu; nếu không có locator theo từng record, không thể kiểm chứng riêng từng ngày sinh/ngày mất/nhiệm kỳ.

## 4. Temporal coverage và precision

`heads_of_state.json` tự mô tả phạm vi “1836–1900”. Master Spec mô tả campaign **1836–1936**.

Kết quả kiểm tra:
- 92/93 arrays có ít nhất một record bao phủ 01/01/1836. PEU có record đầu tiên từ 08/01/1836; cần đối chiếu với profile start.
- 48/93 arrays có record bao phủ năm 1900.
- Chỉ 1/93 arrays có record bao phủ năm 1936 (NED, record kéo dài đến 1948).
- 45 arrays có record cuối trước năm 1900; 92 arrays có record cuối trước năm 1936. Đây không tự động là lỗi vì một số polity đã giải thể/đổi chủ thể, nhưng cần nối rõ với formation/dissolution và kế vị của thực thể tiếp theo.
- `from`: 428 giá trị ngày, 1 giá trị tháng, 10 giá trị năm.
- `to`: 432 ngày, 1 tháng, 6 năm.
- `born`: 251 ngày, 4 năm; còn lại thiếu.
- `died`: 254 ngày, 1 năm; còn lại thiếu.

Không được ép dữ kiện chỉ có năm/tháng thành ngày giả. Cần biểu diễn date precision và interval semantics rõ trước khi yêu cầu engine xử lý các mốc đó.

## 5. Schema và validation hiện tại

### 5.1. Schema

`src/engine/data/dbTypes.ts` định nghĩa `LeaderRecord` với name/title/born/died/from/to/end/governance/after_regime_change/note/quality, nhưng interface chưa khai báo provenance record-level dù JSON có trường `sources`. Schema cũng chưa mô hình hóa rõ:
- role (head of state, regent, governor, claimant, local paramount chief, council);
- authority scope (de jure, de facto, local, colonial/overlord);
- claimant và authority công nhận;
- joint/rotating/collective office;
- date precision/range/circa và calendar conversion;
- một cá nhân giữ nhiều office hoặc một polity có nhiều tầng quyền lực.

### 5.2. Build validation

`tools/build-data.ts` kiểm tra cơ bản `from <= to`, `born <= died` và source ID tồn tại. Chưa có kiểm tra chuyên biệt cho date precision, overlapping/gaps, coverage 1836/1936, source strength/locator, role/sovereignty scope hoặc loại transition (kế vị, regency, restoration, coup, colonial appointment, state formation).

Các gaps hiện thấy có thể là interregnum, nội chiến hoặc chính quyền lâm thời; cần nghiên cứu nguồn trước khi kết luận là lỗi và trước khi lấp bằng một tên lãnh đạo sinh ngẫu nhiên.

### 5.3. Engine behavior

- `src/engine/modes.ts`: Historical bật succession, decision windows, dated exogenous events và historical priorities; Sandbox tắt những lớp lịch sử sau khi khởi tạo (vẫn dùng ruler/heir ở profile 1836).
- `src/engine/systems/events.ts`: khi historical leader chết, engine tìm successor cùng governance và chỉ trong cửa sổ start tối đa khoảng 2 năm; không tìm thấy thì sinh leader thay thế.
- Các end reason như abdication/deposition/revolution không bị ép xảy ra. Đây phù hợp Master Spec về việc không railroad lịch sử, nhưng có nghĩa Historical Mode hiện tại không tự tái hiện mọi chuyển giao chính trị nếu simulation không tạo ra nguyên nhân.
- Mô hình hiện tại chưa thể hiện đầy đủ regency, multiple claimant, colonial/local dual authority, collective leadership và recognition delays.

**Finding cần review độc lập:** nhánh succession có điều kiện `!c.regimeChangedAt` đồng thời loại record `after_regime_change`. Điều này có vẻ không khớp với ý nghĩa cờ và cần xác minh có đường code nào khác xử lý chúng. Không tự sửa code trong audit này.

## 6. Khoảng trống cần xử lý

1. Re-audit provenance cho toàn bộ 439 records, nhất là 288 record chỉ Wikipedia và 93 record không có nguồn riêng.
2. Research 54 profile chưa có succession array, phân lô theo vùng và độ quan trọng.
3. Extend timeline 1901–1936 cho mọi polity còn tồn tại; bổ sung formation timeline cho future state.
4. Model authority đa tầng cho subject, colony, protectorate, princely state, councils, rotating office, regency và contested claim.
5. Date precision, calendar conversion, reign overlap/gaps, interim officeholders.
6. Cross-check succession với polity transitions, territorial sovereignty, government type, events và wars.
7. Historical Mode acceptance: nếu không có can thiệp làm đổi nguyên nhân, đường lịch sử phải phù hợp bối cảnh tham chiếu; nếu diverge, phải có nguyên nhân truy vết được.
8. Sandbox acceptance: không bị ép theo lịch sử sau 1836, nhưng vẫn tuân theo quan hệ nhân quả của simulation.

## 7. Lộ trình khuyến nghị

| Giai đoạn | Việc | Điều kiện đóng |
|---|---|---|
| G0 | Tiêu chuẩn toàn cầu, date precision, role taxonomy, source policy | Review độc lập + owner acceptance |
| G1 | Re-audit 439 records hiện có | Locator/source grade cho mọi record quan trọng; dispute được giữ nguyên |
| G2 | Bổ sung 54 profile thiếu array và xử lý entity không có nguyên thủ đơn nhất | Matrix từng entity được đóng hoặc có disposition |
| G3 | Mở rộng đến 1936 | Timeline có coverage hoặc ghi rõ polity đã chấm dứt/chuyển đổi |
| G4 | Nối succession, events, borders, wars và government | Temporal consistency tests |
| G5 | Multi-region History/Sandbox tests | Nhiều seed, 12 macro-region, divergence giải thích được |

## 8. Phạm vi và giới hạn

Tệp này và coverage matrix là tài liệu audit. Không sửa `historical_data/`, `heads_of_state.json`, profile, source runtime, political registry, schema, engine, events, tests, assets, save, Android, Gradle, workflows hay APK. Không chạy build/test trong gói này. Đây là self-audit, không phải Claude `REVIEW_PASS`, owner acceptance hoặc S1 authorization.


## 9. R4a — first global cross-region succession/source tranche (18 November 2026)

R4a checks 13 polity cases: USA, Mexico, Brazil, Japan, Qing China, Qajar Persia, Ottoman Empire, Sokoto, Zulu, Asante, Morocco, Wallachia and Moldavia. It does not change the global baseline counts.

- **Mexico:** 33/33 existing records cite Wikipedia only. Chamber of Deputies and UNAM chronologies identify interim office-holders omitted from the current list; their date boundaries differ. Preserve the discrepancy until the office/date semantics are resolved.
- **USA:** NARA sources distinguish presidential succession after Harrison’s death (4 April 1841) from Tyler’s oath (6 April); date semantics need a separate field/role, not a blind replacement.
- **Japan:** the current line joins Tokugawa Shoguns with Emperor Meiji although the Imperial office existed concurrently. The Bakufu/Shogunate and Imperial office need separate timelines.
- **Brazil:** Pedro II’s nominal reign overlaps the Regency government of 1831–1840; regents/executive authority must be modeled separately from the Emperor’s title.
- **Qajar Persia:** designation, Fath-Ali Shah’s death, accession at Tabriz and coronation are distinct; the current 23 October 1834 start needs semantic/source review.
- **Ottoman Empire:** five existing records have no record-level sources; TDV and the specialist regnal-years paper disagree on Mahmud II’s final date.
- **Sokoto:** 10/10 current records cite Wikipedia only; sources in this tranche support broad order/year but not all exact day-level dates.
- **Asante and Zulu:** civil/dynastic conflict, interrupted control, partial restoration and claimant status must not be flattened into continuous ruler lists.
- **Morocco:** Sultan Abd al-Aziz and regent Ba Ahmad are separate offices.
- **Wallachia/Moldavia:** separate local princes, Ottoman/Russian suzerainty/protectorate, occupation, provisional government and union transition.

R4a adds a 13-polity evidence matrix, 24 non-executing research decisions, 15 open evidence requests, 28 source registry entries and triage for all 54 profiles without succession arrays. It distinguishes collective/aggregate, rebel/provisional, subject-local and colonial/company/protectorate authorities rather than assuming each needs an individual monarch.

R4a is only the first tranche. The remaining 426 records and other global data layers remain backlog; no claim of complete Historical Mode validation is made.


## 10. R4b — second global succession/authority tranche (18 November 2026)

R4b researches 15 additional entities that have 1836 profiles but no dedicated succession array: KHI, BUK, HER, NAJ, TUN, NAG, AWA, GWA, HOL, TIB, RYU, BRN, ACE, MER and NDE. It adds 33 source records, each with an inspection-level and limitation note.

Principal findings:
- **KHI / BUK:** current profile uses `levi_2017`, a Kokand-centered study, for Khiva/Bukhara. This is a source-scope mismatch. Khiva's Agahi chronicle chronology has variant year ranges (Allah Quli/Rahim Quli transition 1842 vs 1843) requiring Hijri/calendar and manuscript checking. Bukhara requires Bukhara-specific court sources rather than relying on the Kokand monograph.
- **HER:** Kamran Shah's formal rule and Yar Muhammad's vizier/de facto authority must be split; Kamran was deposed/murdered in 1842. Qajar claim, local Sadozay rule and later Afghan sovereignty are distinct.
- **NAJ:** Faisal bin Turki's first reign ends with Egyptian capture/occupation in 1838; an interregnum and alternative rulers follow; he returns in 1843 for a second reign. The existing profile's uninterrupted start in 1834 is not an accurate representation of effective rule.
- **TUN:** Ahmad Bey succeeds Mustafa Bey in 1837 and remains Bey until 1855. Mustafa's current profile has no per-record source; do not infer an exact accession day without Husaynid evidence.
- **NAG:** Raghoji III dies on 11 December 1853, but British Commissioner administration starts on 13 March 1854. Personal death and annexation/state-end dates must be separate.
- **AWA:** Nasir-ud-Din Haidar's death in July 1837 is followed by a disputed succession involving Badshah Begum/Munna Jan and the British-supported installation of Muhammad Ali Shah. Dynastic claim and recognized/installed ruler are not identical.
- **GWA / HOL:** regents, adopted heirs, local rulers and East India Company/British Resident intervention affect who exercises power; do not flatten these into simple ruler transitions.
- **TIB:** Dalai Lama and Regent are concurrent offices. The 11th Dalai Lama was enthroned in 1842 but received ruling seals only around 1855. Petech explicitly warns that Tibetan/Chinese calendar conversion can shift Gregorian dates by a month or more.
- **RYU:** Shō Iku (1835–1847) and Shō Tai (from 1848) are local monarchs under dual Qing/Satsuma relationships; 1874 diplomatic coercion and 1879 Japanese annexation are different events.
- **BRN:** Omar Ali Saifuddin II's accession tradition has competing 1825/1826/1828 dates; Hashim acceded in 1885 but coronation was in 1895. Protectorate (1888) and Resident system (1906) are authority transitions, not Sultan changes.
- **ACE:** strong candidate baseline mismatch: the 1836 Sultan in Leyten's chronology is the young Sulayman/Ali Iskandar Shah after Ala'ad-Din Muhammad Shah's death, while uncle Tuanku Ibrahim also assumes a Sultan title and controls the Kraton, creating divided authority/civil war. Current profile's “Alauddin Muhammad Da'ud Syah I, since 1823” does not match that account. This is a high-priority discrepancy, **not a live-data correction** until Acehnese primary genealogy and independent review establish identity/transliteration.
- **MER:** Queens and Rainilaiarivony as Prime Minister/effective executive must be represented as separate office histories; French protectorate, conquest, annexation and entity-end dates need separate legal verification.
- **NDE:** Mzilikazi's death (1868), Mncumbathe regency, Lobengula's contested installation (1870) and Nkulumane's claim form an interrupted/contested succession.

R4b includes 15 evidence dossiers, 25 non-executing decisions, 18 open evidence requests and 33 source registry entries. The dossier distinguishes full searchable text, abstracts, search excerpts, OCR/transcriptions and source records whose PDF page-image screenshots could not be fetched. No claim of visual page inspection is made for failed screenshot attempts.

R4b is a second tranche only. The remaining missing arrays, 439 current records, all-world cross-dataset consistency and 1901–1936 timeline remain open.
