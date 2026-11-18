# H01 Batch 02 — consolidated research integration report (R3z)

**Status: `RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL`**  
Snapshot used by the source package: `1836-01-01` (simulation anchor; source temporal precision is often annual or circa-year).  
Scope: 17 H01 political entities, 78 region fact rows, 90 crosswalk rows, 81 unique repository region slots, 35 R3l source-register rows, 128 provenance claims.

## 1. Decision summary
- The 17-entity reconciliation has 15 interval-overlap matches and two non-overlaps: OYO and NDE. Interval overlap is only arithmetic consistency; it does not prove historical population scope, sovereignty or source quality.
- All 81 distinct repository region slots in the R3l crosswalk had allocation weights summing to 1.000 in the original validation. That validates join arithmetic, not political control.
- No numeric H01 value is promoted to verified game data in this integration.
- The research dossier is integrated under `docs/research/H01_batch02_1836/`; live population benchmarks, profiles, ownership, game runtime and S1 remain unchanged.

## 2. OYO — peak, collapse and successor powers
R3l reports OYO profile 650,000 (400,000–1,000,000) and broad OYO_OYO/Yorubaland 1,450,000 (1,100,000–1,900,000), with no interval overlap. The profile's Law (1977) pp.295–302 citation has not been directly inspected; the table of contents establishes these pages lie in Chapter 14, “The Fall of Oyo (c.1823–c.1836)”, beginning p.278. The pages themselves remain access-restricted.

Manning (2014) is mislocated in R3l: correct locator is Chapter 4, pp.131–150 (Table 4.1 pp.132–133), not Chapter 2, pp.27–52. The chapter gives continental and six macroregional estimates, not Oyo/Yoruba 1836. It does not independently support OYO_OYO=1.45m.

Law (1982) supports qualitative defeat/abandonment of Old Oyo around 1836 and a weakened southern reconstitution, but no 650k or 1.45m population. Lovejoy's close-to-one-million figure and the archaeological Old Oyo city estimates relate to peak c.1780, not 1836. Kusimba et al. estimate the late-18th-century urban Old Oyo population, not the empire. Morton-Williams places Atiba's formal installation at Ago Oja/New Oyo around 1838; do not back-project that successor structure onto the 1 Jan 1836 snapshot.

**Decision:** OYO 650k = `UNVERIFIED_SCOPE / QUARANTINED`; OYO_OYO 1.45m = `UNVERIFIED_DERIVATION / QUARANTINED`. Keep the technical slot join for now, but annotate it as a broad, multi-polity Yoruba geography, not proof that all population was directly controlled by Oyo. No replacement number, no owner/map change.

## 3. NDE — polity population vs broad Mosega region
R3l reports NDE 60,000 (45,000–85,000), described as a Ndebele core, and NDE_MOS 210,000 (155,000–280,000), a broad Mosega/Western Transvaal region. Landau (2010, p.83) says Mzilikazi's highveld polity ruled “perhaps 60,000 people” in the 1830s. The polity included Nguni, Sotho and other incorporated/subject communities; it is not an ethnic Ndebele census. Its “perhaps” wording does not establish an empirical 45k–85k confidence interval.

Sources also distinguish incorporated followers, tributaries where individually evidenced, raided/displaced groups and independent neighbours. They do not prove that all Pedi/Venda/Tswana communities across the 210k macro-region were under direct Ndebele rule.

**Decision:** 60k may be retained only as a provisional circa-1830s population of Mzilikazi-led polity, not “Ndebele ethnic core”; mark the 45k–85k interval unverified. NDE_MOS 210k remains a broad geographic reconstruction only; no numeric split, no owner change.

## 4. LIB / Monrovia and DZ_KRU
R3l reports LIB 3,500 (3,000–4,000) and LIB_MON 3,600 = 3,500 ACS settlers + 100 additional enclave residents. Everill metadata is misdated: publisher lists eBook publication in 2012 and copyright 2013, not 2014; the cited pp.48–55 cross the chapter boundary. Public metadata/preview does not verify the 3,500 or 100 components.

The ACS 1844 annual report's retrospective Liberia series gives 2,230 for 1836, and Starr (1913) reproduces 2,230 for Liberia excluding Maryland. Neither is Monrovia-only. Freeman's near-contemporary estimate of c.1,500 is Monrovia around 1837, not a 1836 census. These figures are different dates/universes and must not be substituted directly.

Arithmetic: SSA_REG_06 = 3,600 + 356,400 = 360,000; DZ_KRU = 356,400 + 480,000 = 836,400. The 356,400 is a residual if LIB_MON is 3,600; if the unverified 100 is excluded and LIB_MON is 3,500, residual would be 356,500. Neither arithmetic case validates the inputs. R3l's prose contains stale 356,500 text inconsistent with the tabulated 356,400 residual.

**Decision:** 3,500, 100 and the 3,600 aggregate are unverified/provisional; do not call them census-verified. 356,400 is arithmetic residual only; 836,400 is a geographic aggregation, not one polity census. Correcting live source data or method text requires a separately authorized data patch.

## 5. Other 14 H01 entities
The remaining entities show interval overlap in the R3l profile-vs-mapped geography arithmetic. Preserve their existing values for traceability only. The reconciliation in this package does not certify their historical estimates; individual source/scope review remains necessary before promotion to verified game data.

## 6. Data safety and integration status
This documentation integration intentionally leaves all `historical_data/` inputs and the population builder unchanged. The current repo's 1836 benchmark groups are aggregate sets and do not include a dedicated source-backed OYO, NDE or LIB population group. Adding H01 raw population values to runtime at this point would bypass the phase gate and could mis-scale selected regions.

No assets/media binaries were supplied in the H01 data batch; visual assets are not required to resolve these population/provenance findings. No workflow, APK or engine changes were made.

## 7. Required evidence before numeric/data acceptance
1. Law (1977) pp.295–302 readable page scan and exact calculation context.
2. Law (1977) pp.81–90 to verify peak estimate context cited through Lovejoy.
3. Asiwaju (1989) English p.704 plus adjacent pages to reconcile the >750k secondary citation.
4. Manning-derived 1.45m workbook, polygon, base year, denominator, migration and uncertainty treatment.
5. Rasmussen/Lye page-level evidence for NDE 60k and interval definition.
6. Everill pages or primary rolls proving Monrovia 3,500 and enclave 100 with correct date and population universe.
7. Owner-authorized S1 scope for shipped population/control edits; independent Claude review of this docs integration.


## 8. R3u — supplemental source-trace findings (2026-11-18)

R3u bổ sung Lye (1969), Shick (1971), Hassell (1866), Starr (1913) và Butcher & Griffiths (2021). Các phát hiện tăng độ rõ về population universe nhưng không mở phê duyệt con số mới.

### 8.1 NDE
Lye (1969, p.91) nói các cuộc đột kích qua Vaal/Limpopo không đồng nghĩa kiểm soát những vùng đó. Ở pp.96–97, khách phương Tây năm 1829 ước lượng tổng population 60k–80k; đến 1836 lực lượng quân sự Nguni được ước lượng 1k–5k chiến binh. Lye mô tả phần lớn population của Mzilikazi là Sotho bản địa, và gộp Nguni/Sotho, military/subjugated, tributary/vassal thành ước lượng 60k–80k subjects. Footnote 55 nói nhóm subject đông hơn người Ndebele. Do đó cách gọi R3l “60k Ndebele/Nguni core” sai về population universe; khoảng 45k–85k vẫn không có căn cứ.

### 8.2 LIB/MONROVIA
Hassell (1866, p.169) liệt kê nhiều khu định cư rồi ghi population toàn Liberia năm 1838 khoảng 5,000, gồm 3,500 emigrants từ Hoa Kỳ và 1,500 Africans gia nhập khu định cư. Đây là candidate explanation cho số 3,500, không chứng minh source lineage của R3l; không phải Monrovia-only hay 1836. Starr (1913, pp.24–25) cho cột Pop. 2,230 năm 1836 và 2,281 năm 1838 trong chuỗi Liberia không gồm Maryland. Shick (1971, pp.45–47) ghi 4,571 lượt emigrants đến trong 1820–1843, 242 arrivals năm 1836; p.49 ghi 1,819 người sống trong settlements năm 1843. Các đại lượng khác nhau, không thể hợp thành Monrovia census. 100 người bổ sung vẫn không có chứng cứ độc lập.

### 8.3 OYO
Butcher & Griffiths (2021, p.385) nói Oyo tại đỉnh c.1780 có thể cai trị hơn 750,000 người, dẫn Asiwaju (1989, p.704). Bài viết mô tả các thị trấn dưới suzerainty/tribute với mức tự trị nội bộ khác nhau. Trang Asiwaju English p.704 vẫn chưa được đọc trực tiếp; đây là secondary peak-era statement, không áp dụng cho OYO 1836. Manning 2014 không có giá trị subregional Oyo/Yoruba năm 1836.

### 8.4 Bibliographic correction
Springer xác nhận Everill eBook xuất bản 15 Dec 2012, copyright 2013; softcover 1 Jan 2013. Chương pp.33–54 là “An African Middle Class”, pp.55–78 là “Americans in Africa”, nên R3l pp.48–55 qua ranh giới chương. Manning locator trong R3l cũng được sửa ở R3t: Chapter 4 pp.131–150, không phải Chapter 2 pp.27–52.

### 8.5 R3u disposition
OYO 650k/1.45m tiếp tục quarantine; NDE 60k được diễn giải là polity subjects circa-1830s, không phải ethnic core; khoảng 45k–85k unresolved; NDE_MOS 210k broad geographic only; LIB_MON 3.5k/100 unresolved; DZ_KRU 356.4k arithmetic-only. Không thay live game data, ownership, geometry, benchmark, runtime, save schema, asset, workflow hay APK.


## 9. R3v — Liberia primary-series reconciliation (2026-11-18)

R3v xác định rõ hơn hai dòng số liệu thường bị hiểu nhầm là cùng một chuỗi. Starr (1913, printed pp.24–25) nói bảng “Population Movement for Liberia (exclusive of Maryland)” lấy từ *African Repository* nhằm trình bày vital statistics của immigrants; phần “Society” định nghĩa immigrant population và tách biệt aboriginal population. Cột Pop. 1836 là 2,230; cùng hàng ghi 209 arrivals, 145 deaths, 13 removals và 47 live births. Vì vậy 2,230 không phải Monrovia-only hay tổng dân số bao gồm người bản địa. Bảng có bất thường số học ở dòng 1834 (printed 1,016, trong khi tính theo stock/flows là 2,016), nên R3v giữ nguyên bản in và gắn cờ anomaly.

Shick (1971, pp.45–47) tái lập dữ liệu từ individual emigrant roll của ACS được trình Quốc hội: 4,571 arrivals giai đoạn 1820–1843 và 242 arrivals trong 1836. Con số arrivals của Starr là 209; khoảng cách 33 và sự khác biệt ở 1829/1835 cho thấy hai chuỗi không đồng nhất. R3U-09 được chuyển thành PARTIALLY_RESOLVED; SOURCE_SERIES_CONFLICT_CONFIRMED, nhưng chưa có common reconciliation.

Hiller (1860), Section IV, dẫn lời Freeman (writing in 1837) ước lượng Monrovia khoảng 1,500 inhabitants; New Georgia và Millsburgh mỗi nơi khoảng 500 được ghi riêng. Đây là secondary quotation của nguồn gốc chưa truy được, không phải census. Một transcription bảy trang gắn nhãn census Monrovia September 1843 đã tìm thấy, nhưng trang ảnh gốc và inclusion universe chưa được xác minh; nó không cung cấp số năm 1836.

**R3v disposition:** LIB 3,500, LIB_MON 3,600 và additional 100 tiếp tục quarantine; Starr 2,230 và Shick 242 chỉ được lưu như giá trị trong đúng chuỗi nguồn; Freeman ~1,500 chỉ là comparator xấp xỉ c.1837. DZ_KRU 356,400 vẫn là arithmetic residual có điều kiện. Không có numeric/data patch hoặc thay đổi runtime/ownership/geometry. Claude independent review và owner acceptance tiếp tục pending.


## 10. R3w — Oyo numeric citation and transition chronology audit (2026-11-18)

Asiwaju (1989), “Dahomey, Yorubaland, Borgu and Benin in the Nineteenth Century,” pp.703–704, was inspected in a page-numbered web transcription. The chapter distinguishes Oyo's core (around the Osun–Ogun basins) from a much wider Mono–Niger region receiving tribute or experiencing military, political, economic and cultural influence/control “of varying degrees.” Dahomey, Porto Novo, Egba/Egbado, Ketu/Sabe, eastern Borgu and south-western Nupe are described under different arrangements, including tributary status, administrative intervention, settler/trade penetration, protection and retained political autonomy. This does not constitute a homogeneous direct-rule territory or a local population count.

Butcher & Griffiths (2021, p.385) state that peak Oyo c.1780 probably ruled >750,000 people and cite Asiwaju p.704. The accessible text of that cited page/chapter contains no 750,000 demographic estimate; a chapter-wide text search did not locate 750,000/750000/700,000 in the Oyo chapter. This is a citation-path problem (SOURCE_LOCATOR_NOT_SUBSTANTIATED), not proof that the figure is false: an alternate edition, omitted table/footnote or secondary calculation remains possible. The numerical source chain must be independently traced.

Chronology sources now distinguish staged events. Asiwaju dates collapse c.1835 and describes subsequent insecurity and southward population shifts; his pp.710–711 describe destruction of Old Oyo, Igboho, Ikoyi, Igbon, Iresa and Oje and growth of southern towns. Lovejoy (2012 UCLA PhD dissertation, pp.66–67) states Old Oyo and its surrounding district had been deserted/destroyed by c.1836, after which displaced Oyo formed a working alliance at Ago Oja and Atiba gained recognition from surviving senior chiefs and warriors. Morton-Williams (1967, printed p.45) places Atiba's formal installation as Alafin at Ago Oja with proper ritual c.1838, followed by reconstruction of royal offices. Johnson (1921, pp.279–280) narrates his accession after the fall of the ancient capital and death of Oluewu but gives no exact calendar year in that passage.

The staged reading is: (1) collapse/desertion and displacement c.1835–1836; (2) refugee/political alliance at Ago Oja; (3) formal ritual installation and fuller royal-office reconstruction c.1838. This prevents the later consolidated New Oyo structure from being projected backwards to 1836-01-01. Dates remain approximate; no exact day-level sovereignty change is established.

**Disposition:** OYO 650k and OYO_OYO 1.45m remain quarantined; Butcher & Griffiths' >750k c.1780 figure is an unverified secondary claim whose cited Asiwaju p.704 text does not substantiate the demographic number; the wider Oyo sphere is non-homogeneous; no new population, control, ownership or runtime patch.


## 11. R3x — NDE population universe and Rasmussen trace (2026-11-18)

R3x reopened Lye (1969), pp.88, 91 and 96–97. Lye p.88 says that by the end of 1823 Mzilikazi fled Zululand with about 300 young warriors and women. This is an initial migration nucleus, not the later polity. Delius (2010) cites Rasmussen (1978, pp.23–26 and 90–94) and attributes a plausible 300-person departure to 1821, creating a date discrepancy that is not silently reconciled. Delius says the most reliable estimates by the end of the 1820s were around 20,000, while some sources proposed three or four times that number; he stresses ample room for error. Warren, Hall & Ackermann (2014) independently repeat the 300-to-20,000 late-1820s trajectory and significant Sotho-Tswana incorporation, citing Rasmussen.

Lye p.91 explicitly distinguishes raids beyond the Vaal and Limpopo from territorial control: those areas were not controlled merely because they were raided. On p.96, the 10,000–20,000 people who followed Mzilikazi beyond the Limpopo are part of the later departure after the 1836–37 conflicts; many subjects stayed behind and most followers were Sotho. This is a migration flow, not the total NDE population on 1836-01-01.

Lye p.97 reports that 1829 visitors estimated a total population of 60,000–80,000; by 1836 Andrew Smith and others estimated the Nguni military force at 1,000–5,000 warriors plus subject peoples. Lye combines Nguni and Sotho, military and subjugated, tributary and vassal elements and regards 60,000–80,000 as a reasonable estimate of the polity's subjects. He says indigenous Sotho were the greater part and subject peoples greatly outnumbered the Ndebele. This is an approximate broad-polity estimate, not an ethnic Ndebele/Nguni core or exact census. Delius's lower late-1820s estimate and discussion of higher alternatives mean the numeric evidence remains contested and fragile.

**Updated disposition:** NDE 60,000 may remain only as a provisional approximate circa-1830s population of Mzilikazi-led polity subjects; the original “Ndebele/Nguni core” label is not supported. NDE 45,000–85,000 remains an unverified bracket with no demonstrated statistical interval method. The separate 1,000–5,000 figure is a military-core comparator, not total population. NDE_MOS 210,000 remains broad geography only: no direct-rule total, numeric split, owner reassignment or geometry patch is supported. No live game data changes.


## 12. R3y — Oyo 1831–1836 political geography and population-unit audit (2026-11-18)

Lovejoy (2019), “Mapping Uncertainty: The Collapse of Oyo and the Trans-Atlantic Slave Trade, 1816–1836,” supplies a year-by-year sequence that complicates any single Oyo territorial/population reading at the 1836 anchor. By 1832 Ilorin had overrun most of Oyo's Ibarapa and Ago Oja was allied with Ilorin; in 1833 Ilorin had destroyed or subjected most key Oyo towns, while independent southern Oyo powers included Ijaye, Abemo and Ibadan. Oyo and Bariba forces attempted territorial recovery in 1834–35 with support from several distinct southern polities. In 1836 the old capital district was abandoned, refugees moved south, and Abeokuta, Ilorin, Ibadan, New Oyo, Ijaye, Ijebu and Ife competed for territory.

Lovejoy stresses that the map overlays are approximations with fuzzy boundaries and are not authoritative declarations of historical truth. The 2 January / 31 December time stamps in the GIS table were software placeholders with zero historical value. The 1836 New Oyo time-row must therefore not be used to prove a day-level transition by 1836-01-01. The article's 75,000-plus total concerns involuntary Atlantic slave-ship embarkations from the Bight of Benin, not Oyo resident population, all refugees or the unknown internal slave trade.

The original H01 profile states OYO=650,000 with method “severe demographic displacement in 1836 as northern Oyo refugees fled south into Ibadan, Ijaye, and Abeokuta” (Law 1977, pp.295–302), but supplies no census, refugee cohort total, stock definition, calculation or interval method. The OYO_OYO regional fact states 1,450,000 for “Yorubaland (Oyo / Ibadan / Abeokuta)” and cites a Manning macro-series plus Law; no subregional workbook, dated polygon, denominator, growth/migration calculation or interval method is included. These figures refer to different conceptual populations (possible polity/refugee profile vs broad regional resident population) and must not be conflated.

The original crosswalk assigns 100% of SSA_REG_18 to OYO_OYO / owner OYO. Lovejoy's timeline and overlay separate Oyo, Ilorin, Ibadan, Abeokuta, Ijebu, Ife, Ijaye and Abemo with changing and sometimes contested political relationships. The H01 Oyo successor-states crosswalk separately lists Ibadan, Abeokuta, Ijebu and Ilorin as unmodelled historical polities. The 1:1 join is therefore technical allocation arithmetic, not proof of Oyo sovereignty over every locality in the broad region on 1836-01-01.

**R3y disposition:** OYO 650k and OYO_OYO 1.45m remain quarantined; their universes/derivations and intervals are unverified. SSA_REG_18's OYO owner assignment remains historically unvalidated at locality level. No replacement numeric value, owner change, regional split, or geometry edit is approved. See `H01_R3y_OYO_1831_1836_POLITICAL_GEOGRAPHY_AND_POPULATION_AUDIT_VI.md` and R3y CSVs.


## 13. R3z — Rasmussen source-quality review (2026-11-18)

Colenbrander's contemporary review of Rasmussen's *Migrant Kingdom* (1978), preserved in an archived periodical PDF, regards the book as useful for reconstructing dates, events, places and people, but critiques its heavy emphasis on war and migration and limited treatment of ecological, political, socioeconomic and everyday agricultural/domestic/commercial/governmental structures. The review also explicitly attributes some limits to the scarcity and nature of available evidence. This does not invalidate Rasmussen; it adds a source-quality caveat when using the monograph for NDE size, military potential or growth rate.

The R3x distinction among initial migration nucleus (~300), Delius's most reliable late-1820s follower estimate (~20,000), Lye's broad 60,000–80,000 subject estimate, 1836 Nguni military force (1,000–5,000), and later 10,000–20,000 withdrawal stream remains unchanged. These measures have different dates and population universes. The legacy NDE 45,000–85,000 range still has no demonstrated statistical/scenario method; Rasmussen pp.23–26 and 90–94 remain indirectly traced, not directly inspected.

**R3z disposition:** no numerical, scope, owner, geometry or runtime change. Retain NDE 60k only as a provisional high-uncertainty circa-1830s polity-subject candidate; 45–85k remains quarantined without interval semantics. Full periodical metadata for the review and the original Rasmussen pages remain open evidence requests.


## 14. R3aa — NDE 1829 estimate source chain: Chase, Archbell and Rasmussen (2026-11-18)

Chase (1830, *South African Quarterly Journal* 1(4), p.407) publishes material from the 1829 journey of traders Scoon and Luckie and reports that Malacatzie had about 80,000 people under him, having conquered the country from Batow and other Bichuana tribes and made them dependants. It is a contemporary travel-report estimate, not a census or enumerated count.

Archbell's December 1829 encounter with Mzilikazi at Plaatberg is independently corroborated by Ferreira (2025, printed p.38), who cites the contemporary *Missionary Notices* VI, no.179, p.356. This accessible passage describes the encounter and traders at Port Natal but gives no population figure. Lye (1969) footnote 50 links Chase p.407 and an Archbell Plaatberg item; footnote 88 cites a 31 Dec 1829 letter and an archival locator. Other published archival listings give S.A. III (1829), no.37, whereas Lye footnote 88 is rendered as South Africa box II, file 1829, no.37; one Lye citation also appears as 3 Dec 1829. The original letter and exact item metadata remain unverified. Do not assign Chase's 80k wording directly to Archbell.

Kruger (2010, printed p.140) attributes to Rasmussen (1978) a more realistic estimate of about 20,000 people under Mzilikazi in the Rustenburg area in 1829, contrasting it with 60,000–80,000 attributed to Methodist missionary Archbell. This remains an indirect secondary quotation; Rasmussen's cited pages have not been directly inspected. The geographic wording “Rustenburg area” may be narrower than Chase's “country he now possesses” including conquered Bichuana dependants, so the two numbers cannot yet be treated as rival estimates of the same universe.

Lye (1969, p.97) reports 60k–80k for the first white visitors in 1829, then gives a composite 60k–80k estimate of Mzilikazi polity subjects, drawing together Nguni, indigenous Sotho, military/subjugated, tributary and vassal groups. This is not an independent census that validates Chase or Archbell. The same page separately reports 1k–5k Nguni warriors in 1836; footnote 51 gives distinct military-force observations (A. Smith 1k–2k trained warriors, Harris 5k, American missionaries 3k total force). These are not demographic totals.

**R3aa disposition:** NDE 60k remains a provisional high-uncertainty composite polity-subject candidate circa the 1830s, not a verified 1836 resident census or ethnic core; the 45k–85k band remains unverified with no CI/scenario method; NDE_MOS 210k remains broad geography only. No numeric, runtime, owner or map patch.
