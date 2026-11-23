# CG-37b — Decolonisation addendum and status distinctions

**Date:** 2026-11-23  
**Branch:** `ccr-b27f3fb8-epfpd6`  
**Scope:** Research/data only. No engine or gameplay code changed.

## Result

- Corrected the register header from 7 to 8 columns: `ISO3,name,colonial_power,independence_date,mode,predecessor_unit,source,notes`. The rows already carried both `name` and `notes`; the missing header field was `name` immediately after ISO3.
- Added 17 independence/state-formation records: VNM, LAO, KHM, MYS, SGP, BRN, KOR, PRK, EGY, IRQ, KWT, BHR, QAT, ARE, CYP, MLT, ERI. Existing NAM was retained without duplication.
- Register now has **112 data rows** (95 previous + 17 additions). The legacy filename still says 1945–1990; Eritrea 1993 is an explicit scope extension requested by the board.
- Added `CG37B_STATUS_TRANSITIONS_1836_2026.csv` for cases that must not be modelled as a simple independence event.

## Important chronology decisions

| Case | Dataset date / treatment | Reason |
|---|---|---|
| Viet Nam | 1945-09-02 declaration; 1954-06-04 Franco-Vietnamese treaty is a separate recognition/transfer milestone | The declaration and French treaty recognition are distinct legal events. Geneva 1954 then produced a temporary military demarcation; do not treat 1954 as a single uncomplicated independence date. |
| Laos | 1953-10-22 full sovereignty | 1949 was independence within the French Union with residual French powers; the 1953 treaty expressly recognized a fully independent and sovereign Kingdom. |
| Cambodia | 1953-11-09 full sovereignty | 1949 associated independence was incomplete; the 1953 transfer completed the exercise of sovereign powers. |
| Malaya / Malaysia | 1957-08-31 | The independent state in 1957 was the Federation of Malaya; Malaysia was formed in 1963. |
| Singapore | 1965-08-09 | Sovereign independence followed separation from Malaysia, not the 1957 Malayan event. |
| Korea | 1945 is end of Japanese colonial rule; KOR 1948-08-15 and PRK 1948-09-09 are separate state-formation dates | The peninsula was divided into US and Soviet occupation zones after 1945; do not spawn two sovereign states in 1945. |
| Taiwan | Separate administrative-transfer/status row; **not** an independence row | ROC administration began in 1945. The 1951 San Francisco Treaty made Japan renounce title but did not name a recipient. Competing legal interpretations mean the engine must not silently convert 1945 into a conventional independence event. |
| Egypt | 1922-02-28 independence with reservations; 1936 treaty is a later milestone | The 1922 declaration ended the formal protectorate but reserved communications, defence, foreign interests/minorities and Sudan to Britain. British forces remained in the Canal Zone after 1936. |
| Iraq | 1932-10-03 | End of the British mandate / independence; distinguish the date from earlier League of Nations Council proceedings. |
| Gulf states | Kuwait 1961-06-19; Bahrain 1971-08-15; Qatar 1971-09-03; UAE 1971-12-02 | Dates are tied to termination of treaty protection or formation of the federation. Ras Al Khaimah joined the UAE in 1972, not at the 1971 founding. |
| South Yemen | Historical code YMD, 1967-11-30; separate transition row | South Yemen was a distinct sovereign state before the 1990 union. YMD is a historical code, not a current ISO3 country code. |
| Oman | No 1970 independence event | Oman was not a British colony; 1970 marks Sultan Qaboos's accession. Portuguese expulsion is a much earlier sovereignty milestone. |
| Canada / Australia / New Zealand / South Africa | Separate Dominion/autonomy milestones: 1867 / 1901 / 1907 / 1910 | These dates mark Confederation, federation, Dominion status or Union, not a single date of complete external sovereignty. |

## Source register

1. Viet Nam Declaration of Independence, 2 Sep 1945 (primary text, Refworld / national legislative source): https://www.refworld.org/legal/legislation/natlegbod/1945/en/14459
2. UN Legal Series, Book 17, Viet Nam treaty of independence, 4 Jun 1954: https://legal.un.org/legislativeseries/pdfs/chapters/book17/book17_part1_II.pdf
3. UN International Law Commission, A/CN.4/730, Laos–France Treaty of 22 Oct 1953: https://documents.un.org/api/symbol/access?l=en&s=A%2FCN.4%2F730&t=pdf
4. Library of Congress, Laos country study, chronology of the 1953 treaty: https://tile.loc.gov/storage-services/master/frd/frdcstdy/la/laoscountrystudy00sava_0/laoscountrystudy00sava_0.pdf
5. Cambodia, 9 Nov 1953 transfer of military powers, FRUS: https://history.state.gov/historicaldocuments/frus1952-54v13p1/d445
6. Cambodian government historical record confirming 9 Nov 1953: https://pressocm.gov.kh/en/archives/46870
7. Government of Malaysia, Malaya independence and formation of Malaysia: https://www.malaysia.gov.my/en/government/kenali-malaysia
8. Singapore Statutes Online, Republic of Singapore Independence Act 1965: https://sso.agc.gov.sg/Act/RSIA1965
9. UN Treaty Series, Agreement relating to separation of Singapore from Malaysia: https://treaties.un.org/doc/Publication/UNTS/Volume%20563/v563.pdf
10. US Office of the Historian, Brunei recognition and protectorate status: https://history.state.gov/countries/brunei
11. Brunei government facts: https://www.un.int/brunei/brunei/country-facts
12. National Institute of Korean History, 1945 liberation and 1948 formation of both Korean states: https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i502100
13. British Declaration of Egyptian Independence, 28 Feb 1922 (reproduced primary text): https://dspace.gipe.ac.in/xmlui/bitstream/handle/10973/34318/GIPE-007292-Contents.pdf?isAllowed=y&sequence=2
14. World Bank Egypt historical note on the 1922 reservations and 1936 treaty: https://documents1.worldbank.org/curated/en/466121468038084316/pdf/669620SR0Box260E550economy0of0Egypt.pdf
15. UN legal study on Iraq's 1932 declaration and League membership: https://digitallibrary.un.org/record/573952/files/E_CN.4_367-EN.pdf
16. Kuwait Government Online, termination of the 1899 treaty and independence, 19 Jun 1961: https://e.gov.kw/sites/kgoenglish/Pages/Visitors/AboutKuwait/GoverningBodyOverView.aspx
17. US Office of the Historian, Bahrain independence: https://history.state.gov/countries/bahrain
18. Qatar Ministry of Interior, independence on 3 Sep 1971: https://portal.moi.gov.qa/wps/portal/MOIInternet/aboutqatar/qatarataglimpse
19. UAE Ministry of Foreign Affairs, federation on 2 Dec 1971: https://www.mofa.gov.ae/en/the-uae/history
20. UN Treaty Collection, Treaty concerning the Establishment of the Republic of Cyprus: https://treaties.un.org/Pages/showDetails.aspx?clang=_en&objid=08000002801388ac
21. Malta Independence Order 1964, appointed day 21 Sep 1964: https://legislation.mt/MediaCenter/PDFs/ORD/MaltaIndependenceOrder1964.pdf
22. UNOVER referendum record and UN admission resolution for Eritrea: https://unsco.unmissions.org/en/united-nations-observer-mission-to-verify-the-referendum-in-eritrea-unover-1992-1993 and https://digitallibrary.un.org/record/197307
23. South Yemen independence, FRUS, 30 Nov 1967: https://history.state.gov/historicaldocuments/frus1964-68v21/d117
24. Taiwan legal-status distinction: Treaty of San Francisco Article 2(b) and US FRUS note: https://history.state.gov/historicaldocuments/frus1951v07p2/d187
25. Canada, Australia, New Zealand and South Africa Dominion milestones: Government of Canada, Statute of Westminster background: https://www.canada.ca/en/intergovernmental-affairs/services/federation/statute-westminster.html
26. Namibia independence on 21 Mar 1990, Secretary-General report implementing UNSC 435: https://documents.un.org/api/symbol/access?l=en&s=s%2F21215&t=pdf

## Integration notes for Claude

- The builder `tools/data/build-decolonisation.ts` destructures seven fields from each row: `iso,name,power,date,mode,predecessor,source`; the eighth `notes` field is intentionally not consumed by the generated game records. The corrected header now documents all eight fields.
- Add Vietnamese display names for the 17 new ISO codes to the builder's `VI` map before shipping generated data; otherwise its fallback will display English names.
- Review region coverage for Korea, Cyprus, Malta, Brunei, Singapore and the Gulf states. The current majority-area matching may produce no regions or ambiguous region ownership; do not force a map match without inspecting the generated report.
- Taiwan, Oman, the four Dominion milestones and South Yemen remain in the companion transition file so they cannot accidentally be interpreted as ordinary modern-country release events.
- This is an evidence-based addendum, not a claim that the entire colonial world inventory is now exhaustive.
