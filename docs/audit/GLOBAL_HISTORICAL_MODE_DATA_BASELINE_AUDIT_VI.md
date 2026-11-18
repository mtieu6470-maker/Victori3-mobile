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


## 11. R4c — third global succession and authority tranche (18 November 2026)

R4c researches 15 additional missing-array profiles: ION, CIR, IMM, CON, ABD, KAN, KOK, YEM, SND, KAL, BRD, PRI, BHU, SKM and LUA. It adds 34 source-registry entries and records source inspection level/limitations.

Principal findings:
- **ION:** British Lord High Commissioner is not the Ionian elected executive; constitutional parliament, Senate, Regent and High Commissioner are separate roles; 1864 cession is a polity transition.
- **CIR:** no single nationwide ruler or supreme authority is evidenced for 1836; keep regional/collective leadership rather than inventing a king.
- **IMM:** Shamil's election/bay'a (September 1834) and Hamzat Bek's assassination (October 1834 New Style) are separate events; the Imamate's geographic scope must not be conflated with Circassia.
- **CON:** French deposition claim in 1830 differs from de facto control until Constantine fell in 1837; the 1836 assault failed.
- **ABD:** tribal election, Desmichels treaty recognition, Treaty of Tafna and 1847 surrender are distinct.
- **KAN:** Dil brothers exercised joint authority; 1839–1842 foreign interruption means Kohandil's rule is not a simple continuous solo term.
- **KOK:** Bukhara's 1842 invasion/occupation, uprising, Shir Ali and the 1844 Qipchaq coup require separate events and ruler terms.
- **YEM:** al-Mansur Ali II is only a candidate for the 1836 snapshot. No original Yemeni Zaydi chronicle was directly inspected in this tranche; exact bay'a and effective control remain open.
- **SND:** Hyderabad, Khairpur and Mirpur Talpur branches were separate authorities; the current aggregate "collegial rule" must not be interpreted as one common ruler.
- **KAL:** Mehrab Khan's death, British-installed Shah Nawaz and local sardar recall/recognition of Nasir Khan are separate legitimacy events; exact November 1839 dates conflict.
- **BRD:** Sayajirao II/Ganpatrao are year-level candidate succession only; exact 1819 date lacks an official Baroda locator in this tranche.
- **PRI:** project entity is a gameplay grouping, not one historical polity; do not create a shared HOS succession array.
- **BHU:** Druk Desi and Je Khenpo are concurrent temporal/religious offices; Penlop authority is another layer.
- **SKM:** Treaty of Tumlong (1861) is a protectorate/foreign-policy-control event, not full annexation; Tsugphud remained Chogyal until 1863.
- **LUA:** Manthaturath's death, Oun Keo regency and Siamese recognition of Sukha Soem in 1839 are distinct; start/death dates need primary decree confirmation.

R4c adds a 15-polity evidence matrix, 27 non-executing research decisions, 18 open evidence requests and 34 source entries. The source registry distinguishes full searchable text, abstracts/search extracts, secondary chronology and sources for which only bibliographic metadata was available. It does not claim page-image inspection where screenshots were not obtained.

Cumulative missing-profile tranche accounting: R3af covers SHE/ZUL/BSO; R4a adds four other unique IDs from the original 54-profile triage (ASH/MOR/WAL/MOL plus MEX? note R4a's 13-polity batch includes some IDs not originally in that missing list); R4b covers 15; R4c covers 15. For unique IDs from the 54-profile triage, the confirmed batches close 37 of 54, leaving 17: ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI, SUL, MAO and MLY. This is dossier coverage, not owner-approved data coverage.

R4c remains a third tranche only. The 439 existing leader records, remaining historical profiles, sovereignty/territory, economy/population/military/events and full 1901–1936 timelines remain open.


## 12. R4d — final tranche of the original 54 missing succession profiles (18 November 2026)

R4d covers ETH, BOR, WAD, DAR, DAH, OYO, MAS, FJA, LIB, BUG, TEX, CAF, RGS, HAI and SUL. The tranche adds 15 evidence dossiers, 26 non-executing research decisions, 17 open evidence requests and 34 source-registry entries.

Principal findings:
- **ETH:** Emperor Sahle Dengel is the nominal sovereign at the 1836 snapshot, while Ras Ali II of Yejju is the de facto regent/kingmaker. They must be separate concurrent roles.
- **BOR:** the existing profile still names Muhammad al-Amin al-Kanemi as HOS although the current snapshot is 1836 and the Shehu died before/around this transition; references conflict on death year (1835 vs 1837). Umar's Shehu office and the nominal Sayfawa Mai Ibrahim IV must be separated.
- **WAD:** Muhammad Sharif's effective authority and formal enthronement have conflicting dates (c.1835 vs 1838); some chronologies list Kolak Adam as titular ruler.
- **DAR:** Muhammad al-Fadl → Muhammad al-Husayn → Ibrahim Qarad; 1874 conquest, Turco-Egyptian/Mahdist rule and Ali Dinar's 1898 restoration are separate phases.
- **DAH:** Ghezo 1818–1858 is well supported; Glele's designation as heir is not his accession.
- **OYO:** Old Oyo collapsed around 1836; New Oyo and successor Yoruba states cannot be represented as a single uninterrupted polity or ruler list.
- **MAS:** Seku Amadu's death is disputed between 1844 and 1845; preserve alternate year and title Almami pending source resolution.
- **FJA:** rival Alfaya/Soriya lines contested the Almami; the evidence inspected does not safely identify the exact holder on 1 January 1836.
- **LIB:** ACS colony at the start; Commonwealth 1838/39; independence 1847; Roberts' presidency begins with 1848 inauguration, not at the initial snapshot.
- **BUG:** Suna II accession year conflicts (1832 vs 1836) between royal/local chronology and UNESCO nomination.
- **TEX:** Henry Smith and James W. Robinson disputed the provisional governorship in January 1836; David Burnet's ad interim government follows the 2 March declaration.
- **CAF:** Morazán as Federal President is not equivalent to direct control of all constituent states; the federation dissolved in stages in 1838–1841.
- **RGS:** rebellion began in 1835, but the Republic was proclaimed on 11 September 1836 and Bento Gonçalves' republican presidency must not be backdated to the rebel uprising.
- **HAI:** Boyer's resignation, the provisional executive and Hérard's later formal presidency in January 1844 are distinct stages.
- **SUL:** Majul's genealogy puts Pulalun's accession in 1842; current Sulu royal-house genealogy says 1844. Preserve the conflict and investigate tarsila/Spanish records.

With R3af and R4a–R4d deduplicated, research dossiers now cover 52 of the original 54 missing-array profile IDs. The two remaining IDs are **MAO** (United Tribes of New Zealand) and **MLY** (aggregate Malay Sultanates). These are collective/aggregate units and must not be assigned a single invented ruler; the next work is constituent-authority modelling, not a simple succession list.

## 13. Victoria 3 feature parity audit

Owner direction was expanded to require the game to be like Victoria 3 “in every respect”. A codebase snapshot audit was added separately:
- `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_AUDIT_VI.md`
- `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv` (41 system areas)

The codebase has a working monthly simulation foundation spanning economy, population, politics, secession, technology, diplomacy, military, events, AI and divergence. However current parity is **FOUNDATION PRESENT / CORE DEPTH PARTIAL / FULL VICTORIA 3 PARITY NOT ACHIEVED**. The 41-area audit identifies 12-good/10-building/9-strata/8-Interest-Group inventories, fixed production recipes, simplified markets, missing persistent Pop cohorts, incomplete Production Methods/employment/wages/ownership, absent Diplomatic Plays, abstract military/war support, partial Journal Entries and heuristic rather than hierarchical AI.

P0 implementation priorities are detailed Pop cohorts, employment/wages, building/Production Methods, markets/logistics, Interest Groups/political movements, diplomatic plays, detailed land/naval warfare and War Support, and persistent Journal Entries. This is a technical roadmap, **not an authorization** to alter the runtime or data.

The comparison baseline is the public Victoria 3 1.15/1.15.1 line. Official announcements list 1.15.1 hotfix on 11 November 2026; the 1.15 changelog documents War Support (0–100) and consequences for Pops, army, subject liberty desire and stalemate. The official 2022 developer diary explains how Pops, buildings, wages, ownership/profits, Interest Groups, institutions and trade are causally connected.

No R4d or parity-audit runtime/code/data changes were made. The full world succession and the V3-like feature targets remain pending independent review and owner implementation gate.
