# CG-44 — Post-war regime transitions, partitions and state dissolution, 1944–1999

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Prepared:** 2026-11-23  
**Status:** Research staging; not production data and not an engine patch.

## Executive summary

The companion JSON contains **54 sourced event/process records** and **29 source-register entries**. It covers the requested post-war communist regime consolidations and 1989–91 transitions in Eastern Europe; all 15 former Soviet republics; the breakup of Yugoslavia; the peaceful dissolution of Czechoslovakia; the Korean partition; the successive Vietnamese state forms and reunification; and the PRC's establishment alongside the ROC government's relocation to Taiwan.

The JSON follows the event shape used by CG-41: `id`, `date`, historical capital, before/after entities, event type, causes, law changes, territorial changes, sources and quality. It adds `culturalAssignments` as an explicit map-allocation hint. Proposed entity IDs are research identifiers, not a declaration that all such entities already exist in the current registry.

## Deliverables

- `docs/research/history/CG44_POSTWAR_REGIMES_1944_1999.json`
- This companion report: `docs/research/history/CG44_POSTWAR_REGIMES_1944_1999.md`

## Chronology and interpretation

### Eastern Europe

| Country | Communist consolidation / state-form milestone | Democratic transition / constitutional milestone | Important distinction |
|---|---|---|---|
| Poland | 19 Feb 1947 Small Constitution under communist-led government; official name **Polish People's Republic** adopted 22 Jul 1952 | 29 Dec 1989 constitutional amendment restored **Republic of Poland** and removed the PUWP's leading role | Do not backdate the official PRL name to 1944; communist control was a process, not one proclamation |
| Hungary | 20 Aug 1949 People's Republic constitution/state form | 23 Oct 1989 proclamation of the Republic | 1948 was the decisive communist takeover; 1949 is the constitutional state-form milestone |
| Czechoslovakia | Communist coup 25 Feb 1948; socialist-state name adopted 11 Jul 1960 | Velvet Revolution began 17 Nov 1989; federal name changed 23 Apr 1990 | 1948 did not create a new sovereign country; 1993 split is a separate event |
| Romania | Law of 30 Dec 1947 abolished monarchy and proclaimed the People's Republic | Government fell 22 Dec 1989; Constitution approved 8 Dec 1991 | The 1947 legal act is reproduced in the UN Yearbook; 1989 collapse and 1991 constitutional settlement differ |
| Bulgaria | People's Republic proclaimed 15 Sep 1946 | Zhivkov removed 10 Nov 1989; Republic name adopted 15 Nov 1990; Constitution adopted 12 Jul 1991 | Transition is multi-stage; 1989 is not the constitutional completion date |
| Yugoslavia | Federal People's Republic founded 29 Nov 1945; renamed SFR Yugoslavia 7 Apr 1963 | Multiparty elections took place at different dates in constituent republics during 1990 | There was no single federal democratization date; republic-level transitions must be represented individually |
| Albania | People's Republic proclaimed 11 Jan 1946 | Parliamentary Republic transition marked 30 Apr 1991 | The communist dictatorship period and the later formal socialist-state name are not identical milestones |

Sources: Library of Congress Poland timeline and Polish President's 1989 chronology; Romanian law reproduced by the UN; Bulgarian Council of Ministers; Presidency of Albania; Czech public diplomacy portal; Archives of Yugoslavia.

### Dissolution of the USSR — 15 republics

The JSON records the date, historical capital and dominant titular/national culture for each republic. These culture codes are present in the current 1836 region culture vocabulary. They are **allocation keys only**, not claims that a republic was ethnically homogeneous.

| Entity key | Republic / successor | Date used | Capital (at transition) | Dominant culture code | Date interpretation |
|---|---|---:|---|---|---|
| LTU | Lithuania | 1990-03-11 | Vilnius | `lithuanian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| GEO | Georgia | 1991-04-09 | Tbilisi | `georgian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| EST | Estonia | 1991-08-20 | Tallinn | `estonian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| LVA | Latvia | 1991-08-21 | Riga | `latvian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| UKR | Ukraine | 1991-08-24 | Kyiv | `ukrainian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| BLR | Belarus | 1991-08-25 | Minsk | `belarusian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| MDA | Republic of Moldova | 1991-08-27 | Chișinău | `romanian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| AZE | Azerbaijan | 1991-08-30 | Baku | `azeri` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| UZB | Uzbekistan | 1991-08-31 | Tashkent | `uzbek` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| KGZ | Kyrgyzstan | 1991-08-31 | Bishkek | `kyrgyz` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| ARM | Armenia | 1991-09-21 | Yerevan | `armenian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| TJK | Tajikistan | 1991-09-09 | Dushanbe | `tajik` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| TKM | Turkmenistan | 1991-10-27 | Ashgabat | `turkmen` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| KAZ | Kazakhstan | 1991-12-16 | Almaty | `kazakh` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |
| RUS-FED | Russian Federation | 1991-12-25 | Moscow | `russian` | Dominant culture assignment is a proposed map-splitting key, not a claim that the republic was ethnically homogeneous |

**Important Russia/USSR distinction:** the Russian Federation is not assigned a fabricated independence date. The RSFSR adopted the name Russian Federation on 25 December 1991; on 24 December Russia notified the UN that it would continue the USSR's UN membership and obligations. The USSR's formal dissolution is dated 26 December 1991. The Alma-Ata Declaration creating the CIS was signed on 21 December 1991. These are three distinct events.

**Date precision:** Lithuania's 11 March 1990 is a restoration-of-independence act; Georgia's 9 April 1991 is a restoration declaration; Ukraine's 24 August 1991 act was confirmed by referendum on 1 December; Azerbaijan's 30 August declaration preceded its 18 October constitutional act; Turkmenistan's 27 October date is its independence constitutional law. Other dates are recorded as the principal declaration, referendum or constitutional act and are marked supported where a primary text was not included in the source register.

### Yugoslavia and Czechoslovakia

| Successor | Capital | Legal/state-existence date used | Notes |
|---|---|---:|---|
| Slovenia | Ljubljana | 8 Oct 1991 (effective); declaration 25 Jun 1991 | The declaration and effective independence are separate; the Brioni moratorium intervened |
| Croatia | Zagreb | 8 Oct 1991 (effective); declaration 25 Jun 1991 | Same date distinction as Slovenia |
| Republic of Macedonia (North Macedonia today) | Skopje | 17 Nov 1991 | Referendum was 8 Sep 1991; Badinter/UN chronology uses 17 Nov for state existence |
| Bosnia and Herzegovina | Sarajevo | 6 Mar 1992 | Referendum 29 Feb–1 Mar; result promulgated 6 Mar |
| Federal Republic of Yugoslavia (Serbia and Montenegro) | Belgrade | 27 Apr 1992 | Reconstituted federation of Serbia and Montenegro; claim to continue SFRY legal personality was disputed |
| Czech Republic | Prague | 1 Jan 1993 | Czechoslovakia ceased to exist at the end of 31 Dec 1992 |
| Slovak Republic | Bratislava | 1 Jan 1993 | Peaceful dissolution; not a war or annexation |

The UN Treaty Collection and the Badinter Commission dates are preferred over simplistic declaration-only chronologies. The 25 June 1991 Slovenia/Croatia declarations are retained in the event notes and are not silently substituted for the later legal-effect date.

### Korea

- **15 August 1945:** Japanese colonial rule ended; the peninsula was administered in separate Soviet and US occupation zones near the 38th parallel.
- **15 August 1948:** Republic of Korea established, capital Seoul.
- **9 September 1948:** Democratic People's Republic of Korea established, capital Pyongyang.

The 38th parallel was an occupation-zone line, not a negotiated permanent international border. The current map's `KOR_HAM` region spans both sides of the line. The JSON therefore labels the north/south parts as approximate and requires a region split before any exact territorial transfer.

### Vietnam

| Date | Event | State / capital | Territorial and legal interpretation |
|---|---|---|---|
| 2 Sep 1945 | Declaration of independence | Democratic Republic of Vietnam; Hanoi | Establishes the DRV claim and government; control and recognition remained contested during the First Indochina War |
| 14 Jun 1949 | State of Vietnam formed | State of Vietnam; Saigon | Associated state within the French Union; not yet the Republic of Vietnam |
| 21 Jul 1954 | Geneva agreements / regroupment | DRV north; State of Vietnam south | 17th-parallel military demarcation was expressly provisional, not a political or territorial boundary |
| 26 Oct 1955 | Republic proclaimed | Republic of Vietnam; Saigon | Distinct from the State of Vietnam; do not collapse their leadership/state histories |
| 30 Apr 1975 | Fall of Saigon | RVN government collapses; PRG assumes authority in the South | Military control transfer, not the legal reunification date |
| 2 Jul 1976 | Formal reunification | Socialist Republic of Vietnam; Hanoi | National Assembly resolution formally names the unified state and confirms Hanoi as capital |

**Map crosswalk caveat:** suggested northern regions are `VNM_HAN`, `VNM_TBC`, `VNM_THN`; suggested southern regions are `VNM_HUE`, `VNM_SCE`, `VNM_GDI`. `VNM_HUE` straddles the 17th parallel and cannot be transferred as one exact region. It must be split or assigned through a more detailed historical boundary dataset. The Geneva line must never be encoded as a permanent international border.

### China and Taiwan

- **1 October 1949:** PRC established on the mainland, capital Beijing.
- **9 December 1949:** ROC government moved its effective seat to Taipei after the mainland military collapse.
- The ROC did **not** become a new state in 1949; it continued in Taiwan. The PRC and ROC are competing governments with distinct territorial control and claims.
- The current `QNG_TAI` region is an 1836 map unit; its later administrative status must be modelled through a dated control/ownership transition, not by treating its 1836 owner as a 1949 sovereignty verdict.

## Law mapping and modelling cautions

The dataset uses the project law vocabulary conservatively:

- `one_party_state`: political monopoly by a ruling party; use for communist party-states where supported. It does not itself encode the degree of mass participation.
- `command_economy`: central allocation and state ownership/plan mechanisms; do not apply as if every post-war socialist country reached the same degree of central planning on its proclamation date.
- `universal_suffrage`: project abstraction for transition toward competitive adult suffrage; it is not a guarantee of liberal democracy, free media, minority rights or uninterrupted elections.
- `governance: republic` is a formal state form, not a measure of democracy.
- Yugoslav self-management is not equivalent to Soviet command planning; use a separate market-socialist model if the engine supports it.
- Independence does not imply immediate democratization or market liberalization. The former Soviet republics retain their own regime-transition histories after statehood; this package does not force all of them into a democratic law set.

Where an engine enum or legal interpretation is not safely supported, the record leaves `lawChanges` empty and explains the issue in `note`.

## Integration and validation gates for Claude

1. **Entity registry:** verify every proposed ID against `historical_data/political_entities/registry.json`. The current registry has 1836 start entities; most 1945–93 successor-state IDs in this package are future/research keys and need a controlled migration.
2. **Date-aware entity identity:** do not treat a change of state name as a new sovereign entity in every case; distinguish constitutional renaming, rival governments, restoration, succession, secession and dissolution.
3. **Territorial control vs sovereignty:** model occupation zones, civil-war control and legal sovereignty separately. Do not use the 1945 Korea occupation line, the 1954 Vietnam demarcation, or the 1949 ROC relocation as if each were a permanent internationally agreed border.
4. **Region splitting:** split `KOR_HAM` at the 38th parallel and `VNM_HUE` at the 17th parallel before exact ownership transfer. Other USSR/Yugoslavia successor crosswalks still need a region-level GIS/historical boundary audit; no fabricated region IDs are supplied.
5. **Cultural allocation:** map the `culturalAssignments` codes to actual regions only after checking the 1836 culture fields, demographic change and minority shares. Do not overwrite mixed or indigenous regions with a national majority code.
6. **Historical Mode conditions:** transitions should be conditional on the player/world reaching the corresponding historical preconditions, unless the design explicitly requires a fixed historical event. Sandbox should not force these dates.
7. **No false precision:** dates marked supported and notes that describe windows should retain their precision; day-level date strings are the principal event date, not proof that every institutional change happened on that day.
8. **Legal and constitutional review:** verify the exact primary constitutional texts for Hungary 1949, Bulgaria 1991 and several Soviet republic declarations before production. This package is a sourced research staging set, not a production-ready event script.

## Event IDs in the JSON

POL-1947-02, POL-1952-07, HUN-1949-08, CZE-1948-02, CZE-1960-07, ROM-1947-12, BUL-1946-09, YUG-1945-11, YUG-1963-04, ALB-1946-01, POL-1989-12, HUN-1989-10, CZE-1989-11, CZE-1990-04, ROM-1989-12, ROM-1991-12, BUL-1989-11, BUL-1990-11, ALB-1991-04, USSR-LTU-1990, USSR-GEO-1991, USSR-EST-1991, USSR-LVA-1991, USSR-UKR-1991, USSR-BLR-1991, USSR-MDA-1991, USSR-AZE-1991, USSR-UZB-1991, USSR-KGZ-1991, USSR-ARM-1991, USSR-TJK-1991, USSR-TKM-1991, USSR-KAZ-1991, USSR-RUS-FED-1991, USSR-1991-12-DISSOLVE, CIS-1991-12, YUG-SLO-CRO-1991-06, YUG-MKD-1991-11, YUG-BIH-1992-03, YUG-FRY-1992-04, CZE-SVK-1993-01, KOR-1945-08, KOR-ROK-1948-08, KOR-PRK-1948-09, VNM-DRV-1945-09, VNM-SVN-1949-06, VNM-GENEVA-1954-07, VNM-RVN-1955-10, VNM-1975-04, VNM-1976-07, ROC-1949-12, PRC-1949-10, YUG-1990-MULTIPARTY, BUL-1991-07-CONSTITUTION

## Source register

- **loc_poland** — [A Brief Timeline of Modern Polish History](https://guides.loc.gov/poland-manuscripts/timeline) (supported; Library of Congress research guide). Polish People's Republic period, 1952 Constitution and 1989 constitutional restoration; cross-check with Polish presidential chronology.
- **poland_1989** — [1989 – Freedom Day](https://www.president.pl/archives/bronislaw-komorowski/freedom-day/1989) (verified; President of Poland official chronology). 24 August 1989 Mazowiecki government; 29 December 1989 restoration of Republic of Poland name and removal of PUWP leading role.
- **romania_1947** — [Romania: Law on the New Form of State, 30 December 1947](https://digitallibrary.un.org/record/860913/files/1947-E.pdf) (verified; UN Yearbook reproduction of primary law). Primary text records abdication, abrogation of 1866 Constitution and proclamation of People's Republic.
- **bulgaria_gov** — [History of Bulgaria](https://www.gov.bg/en/About-Bulgaria/HISTORY/tabsss1) (supported; Council of Ministers of Bulgaria). Official government chronology: 1946 People's Republic; communist regime; 1989 transition; 1991 parliamentary constitution.
- **albania_pres** — [The History of the Institution of the President](https://president.al/the-history-of-the-institution/?lang=en) (verified; Presidency of Albania). Official chronology: People's Republic period from 11 January 1946; communist rule to 1990/91; parliamentary republic president elected 30 April 1991.
- **cze_history** — [History – Czechia](https://www.czechia.eu/history/) (supported; Czech official public diplomacy portal). February 1948 communist takeover, November 1989 Velvet Revolution and peaceful separation on 1 January 1993.
- **cze_us** — [Czechoslovakia – A Country Study / historical summary](https://history.state.gov/countries/czechoslovakia/summary) (supported; US Department of State Office of the Historian). Post-war political chronology and communist consolidation; use with Czech official history.
- **hungary_law** — [Act VIII of 1991 on the national holidays of the Republic of Hungary](https://njt.jog.gov.hu/jogszabaly/1991-8-00-00) (verified; Hungarian National Legislation Database). Official law identifies 23 October as the proclamation of the Republic in 1989.
- **yugoslavia_archives** — [Constitutive Acts of Yugoslavia](https://www.arhivyu.rs/en/leksikon-jugoslavije/konstitutivni_akti_jugoslavije) (verified; Archives of Yugoslavia). Primary/archival constitutive documents for post-war federal Yugoslav state forms.
- **yugoslavia_un** — [Yugoslavia and Successor States](https://www.un.org/en/node/123222) (verified; United Nations). UN succession and admission chronology for successor states.
- **yugoslavia_un_tc** — [United Nations Treaty Collection – Historical information: former Yugoslavia](https://treaties-prod.un.org/pages/HistoricalInfo.aspx) (verified; United Nations Treaty Collection). Dates of successor-state existence: Slovenia, Croatia, Macedonia, Bosnia and Herzegovina; FRY Constitution 27 April 1992.
- **yugoslavia_icty** — [What is the former Yugoslavia?](https://www.icty.org/en/about/what-former-yugoslavia) (supported; International Criminal Tribunal for the former Yugoslavia). Six constituent republics; declarations of Slovenia and Croatia on 25 June 1991; FRY declared 27 April 1992.
- **ussr_yearbook** — [Yearbook Express 1991 – Regional questions: Europe](https://digitallibrary.un.org/record/4018544/files/1991%252520Yearbook%252520Express-EN.pdf) (verified; United Nations Yearbook). Contemporaneous UN account of USSR breakup and independence declarations of former Soviet republics.
- **ussr_map** — [Guidance Bulletin No. 3 (2 January 1992): Depiction of the Former Soviet Union](https://data.geodata.state.gov/guidance/DoS_Bulletin_03-Soviet-Union-1992.pdf) (verified; US Board on Geographic Names / Department of State). Official list of 12 successor republics and capitals; Baltic republics treated separately.
- **ussr_un** — [Twenty-five years at the United Nations: My Journey](https://www.un.org/en/node/25493) (supported; United Nations Chronicle, first-person account by Kazakhstan's first UN representative). Alma-Ata Declaration 21 December 1991; Russia succeeds to USSR UN membership; Kazakhstan independence law 16 December 1991.
- **ukraine_un** — [Letter dated 26 August 1991 from Ukraine's Foreign Minister](https://digitallibrary.un.org/record/127875/files/A_46_484-EN.pdf) (verified; United Nations document A/46/484). Reproduces Ukraine's Act of Declaration of Independence adopted 24 August 1991.
- **lithuania_un** — [Lithuania – report to the UN under the International Covenant](https://digitallibrary.un.org/record/500279/files/E_1990_5_Add.55-EN.pdf) (verified; UN document / state report). Restoration of independence by Act of 11 March 1990.
- **tajik_un** — [Tajikistan – Initial report under ICESCR](https://documents.un.org/access.nsf/get%3FOpenAgent%26DS%3DE/C.12/TJK/1%26Lang%3DE) (verified; UN state report). States Declaration of Independence adopted 9 September 1991.
- **turkmen_un** — [Turkmenistan – CEDAW initial report](https://digitallibrary.un.org/nanna/record/548655/files/CEDAW_C_TKM_1-2-EN.pdf?registerDownload=1&version=1&withMetadata=0&withWatermark=0) (verified; UN state report). Constitutional Law on Independence adopted 27 October 1991.
- **moldova_un** — [Moldova – Third Biennial Update Report](https://moldova.un.org/sites/default/files/2022-01/BUR3-EN-211211_web.pdf) (supported; UN country report). Independence declaration 27 August 1991; continued within USSR until formal dissolution.
- **kazakhstan_un** — [Kazakhstan's first UN representative: chronology](https://www.un.org/en/chronicle/article/twenty-five-years-united-nations-my-journey) (supported; United Nations Chronicle). Constitutional Law on Independent Statehood adopted 16 December 1991; Alma-Ata Declaration 21 December.
- **russia_un** — [Russian Federation – historical information in the UN Treaty Collection](https://treaties.un.org/pages/historicalinfo.aspx) (verified; United Nations Treaty Collection). Russia notified UN on 24 December 1991 that it continued USSR membership and requested use of the name Russian Federation.
- **korea_history** — [Establishment of the Republic of Korea and DPRK](https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i502100) (supported; National Institute of Korean History). Historical chronology of 1945 division and establishment of the two Korean governments.
- **korea_rok** — [Republic of Korea – Introduction book](https://api.army.mil/e2/c/downloads/2024/03/07/22a06d28/rok-introduction-book.pdf) (supported; US Army official country reference). 38th parallel occupation division; ROK 15 August 1948 and DPRK 9 September 1948.
- **vietnam_embassy** — [History of Vietnam](https://www.mobile.vietnamembassy-usa.org/vietnam/history) (supported; Embassy of Vietnam). DRV declaration 2 September 1945; Geneva Accords 1954 and provisional 17th-parallel demarcation.
- **vietnam_archive** — [National Assembly Resolution of 2 July 1976 on the name, flag, emblem, capital and anthem](https://luutru.moha.gov.vn/chinh-phu-xua-va-nay/nghi-quyet-cua-quoc-hoi-ngay-2-7-1976-ve-ten-nuoc-quoc-ky-quoc-huy-thu-do-quoc-ca-nuoc-cong-hoa-xa-hoi-chu-nghia-viet-nam.htm) (verified; Vietnam National Archives III reproduction of primary resolution). Primary resolution formally names the unified state Socialist Republic of Vietnam and confirms Hanoi as capital.
- **vietnam_frus** — [Agreement on Ending the War and Restoring Peace in Vietnam – Article 10](https://history.state.gov/historicaldocuments/frus1969-76v42/d70) (verified; US Department of State, FRUS primary document). Explicitly says the 17th-parallel military demarcation line was provisional, not a political or territorial boundary.
- **roc_mac** — [Major Events across the Taiwan Strait – Chronology](https://www.mac.gov.tw/en/News_Content.aspx?n=1C6028CA080A27B3&s=3DFE86AC7521F064&sms=6F070A2443531120) (supported; Mainland Affairs Council, Republic of China (Taiwan)). ROC government moved to Taiwan 9 December 1949; official cross-strait chronology.
- **roc_us** — [China – Office of the Historian](https://history.state.gov/countries/china) (supported; US Department of State Office of the Historian). US embassy chronology confirms ROC government move to Taipei in December 1949 and PRC establishment on 1 October 1949.

## Scope limitations

- The dataset covers the specifically requested regions and transition families, not every post-war state or every decolonisation event.
- It does not provide a complete Soviet/Yugoslav region-to-successor map; this must be derived against the current region registry and checked against historical boundaries.
- Several political transitions were gradual or contested. The quality field and notes deliberately distinguish legal dates from effective control and constitutional consolidation.
- No source or event is copied from Paradox; the research uses government, UN, archival and institutional historical sources.
