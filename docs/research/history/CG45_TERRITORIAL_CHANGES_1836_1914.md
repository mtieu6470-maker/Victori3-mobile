# CG-45 — Territorial changes and imperial expansion, 1836–1914

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Prepared:** 2026-11-23  
**Status:** Research deliverable in `docs/research/**`; staging/engine import remains with Claude.

## Executive summary

The companion JSON contains **59 event/process records** and **47 source-register entries**. It covers the requested priority theatres: French Indochina; East Asia and the Russian Far East; the Balkans; Russian Central Asia; selected Scramble-for-Africa milestones; United States expansion; Punjab; Burma; and British Malaya.

The data intentionally separates **cession, purchase, annexation, protectorate, lease, military occupation, administrative federation and effective control**. These are not interchangeable. The source precision is retained: where a source supports only a year or month, the JSON uses a partial date rather than inventing day 01.

## Deliverables

- `docs/research/history/CG45_TERRITORIAL_CHANGES_1836_1914.json` — structured event data.
- `docs/research/history/CG45_TERRITORIAL_CHANGES_1836_1914.md` — this research report and source register.

## Coverage summary

### 1. Indochina

- **Vietnam:** French landing at Tourane/Da Nang (1858), First Treaty of Saigon (5 June 1862) ceding three eastern Cochinchina provinces and strategic concessions, seizure of the remaining western provinces (June 1867), protectorate treaties for Annam/Tonkin (1883/1884), and the Union of French Indochina (1887).
- **Cambodia:** protectorate treaty of 11 August 1863. Cambodia remained a monarchy under French paramountcy; it was not simply annexed.
- **Laos:** Franco-Siamese Treaty of 3 October 1893. Article I records Siam's renunciation of claims to territories on the left bank of the Mekong and river islands. This does not justify transferring every Lao-speaking territory or all modern Isan to France.
- **Modelling rule:** Cochinchina was a colony; Annam, Tonkin and Cambodia were protectorates; Laos entered the French sphere through a later treaty. Do not model the entire Union as a uniform annexation.
- **Map caution:** existing 1836 region centres are too coarse to encode exact colonial borders. No region IDs are fabricated where no safe crosswalk exists.

### 2. East Asia and Russian Far East

- **Qing–Russia:** Treaty of Aigun (1858) transferred the left bank of the Amur; Convention of Peking (1860) confirmed Russian possession east of the Ussuri to the Pacific.
- **Taiwan/Penghu:** Treaty of Shimonoseki signed 17 April 1895; handover completed 2 June 1895. The Liaodong Peninsula was also ceded to Japan in the treaty but was retroceded to Qing after the Triple Intervention. Do not model it as a durable Japanese possession in 1895.
- **Manchuria:** Russia leased the Kwantung/Liaodong territory, including Port Arthur and Dairen, in 1898. The leasehold rights passed to Japan under the Treaty of Portsmouth (1905); this was not sovereignty over all Manchuria. The 1905 treaty required the restoration of the remainder of Manchuria to Chinese administration.
- **Korea:** Japanese protectorate phase (1905) precedes annexation. The annexation treaty was signed 22 August 1910 and promulgated 29 August 1910; the latter is used as the effective date.
- **Modelling rule:** preserve leasehold, protectorate, occupation and sovereign ownership as separate statuses.

### 3. Balkans

- **Greece:** independent kingdom recognised by the 1832 settlement; Ionian Islands united with Greece in 1864; Thessaly and part of Epirus transferred in 1881.
- **Treaty of Berlin (13 July 1878):** recognised independence of Serbia, Montenegro and Romania; created an autonomous tributary Principality of Bulgaria; authorised Austria-Hungary to occupy and administer Bosnia-Herzegovina while Ottoman sovereignty was not immediately extinguished. Romania also ceded southern Bessarabia to Russia and received Northern Dobruja.
- **Bosnia:** Austro-Hungarian occupation/administration in 1878 is separate from formal annexation in October 1908.
- **Albania:** declaration at Vlora on 28 November 1912; Great Powers recognised an independent neutral state on 29 July 1913. The new state's borders excluded some Albanian-inhabited lands.
- **Macedonia:** Treaty of Bucharest (10 August 1913) settled the Second Balkan War among the Balkan allies. The dataset distinguishes Vardar, Aegean and Pirin Macedonia as a proposed geographic allocation; exact boundaries require a historical polygon crosswalk. The Ottoman Empire's loss of most remaining European territories was addressed separately by the Treaty of London (30 May 1913).
- **Modelling rule:** the Treaty of Berlin did not make Bulgaria fully independent in 1878; the Principality remained under Ottoman suzerainty until the 1908 declaration of independence. Eastern Rumelia was a separate autonomous province and united with Bulgaria in 1885.

### 4. Russian Central Asia

- Tashkent captured in June 1865; formal annexation decree in August 1866.
- Turkestan Governor-Generalship organised in 1867 (administrative reorganisation, not a conquest event).
- Bukhara defeated in 1868: Samarkand/Zarafshan territories annexed, but the Emirate survived as a Russian protectorate.
- Khiva defeated in 1873: the Khanate survived as a protectorate with territorial concessions.
- Kokand abolished and Fergana incorporated in 1876.
- Geok Tepe fell in January 1881; Merv submitted in 1884; Panjdeh frontier crisis occurred in 1885.
- **Modelling rule:** do not collapse all three khanates into one annexation. Protectorate arrangements retained local rulers and institutions; military conquest did not mean instant uniform administration.

### 5. Africa — selected Scramble-for-Africa milestones

- **Algeria:** capitulation of Algiers on 5 July 1830 applied only to the city and immediate environs; it did not legally transfer all Algeria. The conquest of the interior continued, with the surrender of Abd el-Kader in December 1847 marking the collapse of the principal organised resistance, not a single all-Algeria annexation date.
- **Tunisia:** Treaty of Bardo (12 May 1881) established a French protectorate; the Bey retained nominal rule.
- **Egypt:** British occupation from 1882 was military and political control while the Khedivate/Ottoman formal framework persisted. Do not encode as annexation.
- **Congo basin:** the Berlin West Africa Conference (1884–85) created rules for colonial claims and effective occupation. It did not draw specific colonial borders and did not consult African representatives. The Congo Free State was associated with a side process and the personal rule of Leopold II; it was not annexed to Belgium in 1885.
- **German East Africa:** 1885 imperial protection/claim is recorded as a protectorate claim, not complete effective control.
- This is a **selected milestone set**, not an exhaustive province-by-province African partition. Production needs further region-level research for West Africa, Cameroon, Togo, Southwest Africa, East Africa and the Horn.

### 6. United States expansion

- Texas admitted on 29 December 1845.
- Oregon Treaty (15 June 1846) settled the boundary with Britain; it was a boundary settlement, not conquest.
- Treaty of Guadalupe Hidalgo (2 February 1848) ceded extensive Mexican territories after war; exact modern state borders should not be projected onto 1848 regions.
- Gadsden Purchase (30 December 1853) was a purchase, not annexation by conquest.
- Alaska Purchase Treaty (30 March 1867) transferred Alaska from Russia to the United States.
- Hawaii annexed by joint resolution on 7 July 1898; formal transfer ceremony followed on 12 August. The report retains the historical context of the overthrow of the Hawaiian monarchy and Native Hawaiian opposition.
- Treaty of Paris (10 December 1898): Puerto Rico and Guam ceded; Philippines sold to the United States. Spain relinquished sovereignty over Cuba, which was occupied by the United States but not ceded as a US territory by that treaty.
- The Philippine cession was followed by war and contested control; it should not be treated as uncontested immediate administration.

### 7. South Asia and Southeast Asia

- **Punjab:** proclamation of annexation dated 29 March 1849 after the Second Anglo-Sikh War. Do not confuse with the 1846 partial cession/residency arrangements.
- **Lower Burma/Pegu:** annexation proclaimed 20 January 1853 following the Second Anglo-Burmese War.
- **Upper Burma:** annexation proclaimed 1 January 1886 after the Third Anglo-Burmese War; resistance continued for years.
- **Perak:** Pangkor Treaty (20 January 1874) introduced a British Resident and indirect rule; the Sultan remained. This was not outright annexation.
- **Pahang:** British intervention extended in 1888; exact instrument date is not claimed in this dataset.
- **Federated Malay States:** administrative federation formed in 1896; rulers retained formal positions. This was not annexation.

## Full event index

| Date | Treaty / event | Transfer or status change | Type | Quality |
|---|---|---|---|---|
| 1830-07-05 | Capitulation of Algiers | Regency of Algiers → French military occupation of Algiers | conquest_and_occupation | verified |
| 1847-12-23 | Surrender of Emir Abd el-Kader | Algerian resistance polity under Abd el-Kader → French Algeria (expanding military control) | conquest | supported |
| 1845-12-29 | Admission of the Republic of Texas to the United States | Republic of Texas → United States of America | annexation | verified |
| 1846-06-15 | Oregon Treaty | United Kingdom → United States of America | boundary_settlement_and_cession | verified |
| 1848-02-02 | Treaty of Guadalupe Hidalgo | Mexican Republic → United States of America | cession_after_war | verified |
| 1853-12-30 | Gadsden Purchase Treaty | Mexican Republic → United States of America | purchase | verified |
| 1849-03-29 | Proclamation annexing the Punjab after the Second Anglo-Sikh War | Sikh Empire → British India / East India Company | annexation | verified |
| 1853-01-20 | British annexation of Lower Burma (Pegu) | Konbaung Burma → British India | annexation | supported |
| 1858-05-28 | Treaty of Aigun | Qing Empire → Russian Empire | cession_by_treaty | supported |
| 1860-11-14 | Convention of Peking | Qing Empire → Russian Empire | cession_by_treaty | supported |
| 1858-09-01 | French-Spanish invasion of Tourane (Da Nang) | Nguyễn Vietnam → French military occupation | military_occupation | supported |
| 1862-06-05 | First Treaty of Saigon | Nguyễn Vietnam → French Empire / Cochinchina | cession_by_treaty | supported |
| 1863-08-11 | Treaty establishing French protection over Cambodia | Kingdom of Cambodia → French protectorate over Cambodia | protectorate | supported |
| 1867-06 | French seizure of the remaining three western Cochinchina provinces | Nguyễn Vietnam → French Cochinchina | conquest_and_annexation | supported |
| 1865-06-29 | Russian capture of Tashkent | Khanate of Kokand → Russian military occupation of Tashkent | conquest_and_occupation | supported |
| 1866-08 | Russian imperial annexation of Tashkent and Khujand (decree, month precision) | Khanate of Kokand → Russian Empire / Turkestan | annexation | supported |
| 1867 | Creation of the Governor-Generalship of Turkestan | Russian Empire → Russian Turkestan administration | administrative_reorganisation | supported |
| 1868 | Defeat of Bukhara and treaty imposing Russian protectorate conditions | Emirate of Bukhara → Emirate of Bukhara under Russian protectorate | protectorate_and_partial_annexation | supported |
| 1873 | Treaty of Gandimyan after Russian campaign against Khiva | Khanate of Khiva → Khanate of Khiva under Russian protectorate | protectorate_and_partial_cession | supported |
| 1876-02-19 | Abolition of the Khanate of Kokand and creation of Fergana Oblast | Khanate of Kokand → Russian Empire / Turkestan | annexation | supported |
| 1881-01 | Russian capture of Geok Tepe | Teke Turkmen polities → Russian military occupation of Transcaspian Turkmen territory | conquest | supported |
| 1884 | Merv submits to Russian rule (month/day not established) | Merv Turkmen oasis polity → Russian Empire / Transcaspian administration | submission_and_annexation | supported |
| 1885-03-30 | Panjdeh incident and Russian occupation | Emirate of Afghanistan → Russian military control at Panjdeh | conquest_and_frontier_crisis | supported |
| 1832-05-07 | Treaty of Constantinople recognising the Kingdom of Greece | Ottoman Empire → Kingdom of Greece | independence_and_cession | supported |
| 1864 | Union of the Ionian Islands with Greece | United Kingdom → Kingdom of Greece | cession | supported |
| 1881 | Convention of Constantinople | Ottoman Empire → Kingdom of Greece | cession_by_treaty | supported |
| 1878-07-13 | Treaty of Berlin — recognition of Serbia | Ottoman Empire → Principality of Serbia | independence_and_territorial_adjustment | verified |
| 1878-07-13 | Treaty of Berlin — recognition of Montenegro | Ottoman Empire → Principality of Montenegro | independence_and_territorial_adjustment | verified |
| 1878-07-13 | Treaty of Berlin — recognition of Romania and Bessarabia/Dobruja settlement | Ottoman Empire → Kingdom of Romania | independence_and_territorial_exchange | verified |
| 1878-07-13 | Treaty of Berlin — autonomous tributary Principality of Bulgaria | Ottoman Empire → Autonomous Principality of Bulgaria under Ottoman suzerainty | autonomy_and_state_formation | verified |
| 1878-07-13 | Treaty of Berlin Article XXV — Austro-Hungarian occupation and administration of Bosnia-Herzegovina | Ottoman Empire → Austria-Hungary military occupation and administration | occupation_and_administration | verified |
| 1908-10-06 | Austria-Hungary annexes Bosnia and Herzegovina | Ottoman Empire → Austria-Hungary | annexation | supported |
| 1912-11-28 | Albanian Declaration of Independence at Vlora | Ottoman Empire → Provisional Albanian Government | declaration_of_independence | verified |
| 1913-07-29 | Great Powers recognise Albania as an independent neutral state | Ottoman Empire → Principality of Albania (internationally recognised) | international_recognition_and_boundary_settlement | verified |
| 1913-08-10 | Treaty of Bucharest after Second Balkan War | Ottoman Empire → Serbia, Greece and Bulgaria (partition of Ottoman Macedonia) | partition_and_territorial_settlement | supported |
| 1881-05-12 | Treaty of Bardo establishes French protectorate over Tunisia | Beylik of Tunis under Ottoman suzerainty → French protectorate over Tunisia | protectorate | supported |
| 1882-09-13 | British occupation of Egypt after Battle of Tel el-Kebir | Khedivate of Egypt → Egypt under British military occupation | military_occupation | supported |
| 1885-02-26 | Berlin West Africa Conference / recognition framework for Congo Free State | Congo basin polities → Congo Free State | colonial_state_creation_and_recognition | supported |
| 1885-02-27 | German East Africa protectorate claim (charter) | East African coastal and inland polities → German East Africa (protectorate claim) | protectorate_and_colonial_claim | supported |
| 1895-06-02 | Treaty of Shimonoseki territorial handover of Taiwan and Penghu | Qing Empire → Empire of Japan | cession_by_treaty | verified |
| 1905-11-17 | Japan-Korea Protectorate Treaty (Eulsa Treaty) | Korean Empire → Korea under Japanese protectorate | protectorate | supported |
| 1910-08-29 | Promulgation/effect of Japan-Korea Annexation Treaty | Korean Empire → Empire of Japan / Korea under colonial rule | annexation | verified |
| 1874-01-20 | Pangkor Treaty — British Resident in Perak | Sultanate of Perak → Perak under British indirect rule | protectorate_and_indirect_rule | supported |
| 1888 | Pahang accepts British Resident / protection | Sultanate of Pahang → Pahang under British protection | protectorate_and_indirect_rule | supported |
| 1896 | Formation of Federated Malay States | Perak, Selangor, Negeri Sembilan and Pahang under British Residents → Federated Malay States under British paramountcy | federation_and_administrative_reorganisation | supported |
| 1886-01-01 | British proclamation annexing Upper Burma | Konbaung Kingdom of Burma → British India | annexation | verified |
| 1898-07-07 | Newlands Resolution annexing Hawaii | Republic of Hawaii → United States of America | annexation | verified |
| 1898-12-10 | Treaty of Paris ending Spanish-American War | Kingdom of Spain → United States of America | cession_by_treaty | verified |
| 1898-12-10 | Philippine cession under Treaty of Paris | Kingdom of Spain → United States of America (military occupation/claim) | cession_and_contested_occupation | verified |
| 1882-09-13 | British occupation status reaffirmed (not a second transfer) | Khedivate of Egypt → Egypt under British occupation | occupation_status | supported |
| 1883-08-25 | Treaty of Huế (Harmand Treaty) establishing French protectorate over Tonkin and Annam | Nguyễn Vietnam → French protectorates over Annam and Tonkin | protectorate | supported |
| 1884-06-06 | Treaty of Huế (Patenôtre Treaty) confirms French protectorates over Annam and Tonkin | Nguyễn Vietnam → French protectorates over Annam and Tonkin | protectorate_treaty_revision | supported |
| 1887-10-17 | Creation of the Union of French Indochina | Nguyễn Vietnam → French Indochinese Union | colonial_federation_and_administrative_reorganisation | supported |
| 1893-10-03 | Franco-Siamese Treaty: Siam renounces claims west/east? to territories on left bank of Mekong | Kingdom of Siam → French Indochinese Union / Laos protectorate | cession_and_protectorate | verified |
| 1885-09 | Union of Eastern Rumelia with the Principality of Bulgaria | Eastern Rumelia (autonomous Ottoman province) → Principality of Bulgaria | union_and_effective_control_change | supported |
| 1878-07-13 | Treaty of Berlin: Southern Bessarabia transferred from Romania to Russia | Principality of Romania → Russian Empire | cession_by_treaty | verified |
| 1898-03-27 | Russo-Qing Convention leases southern Liaodong Peninsula to Russia | Qing Empire → Russian leased territory in Kwantung | lease_and_foreign_administration | supported |
| 1905-09-05 | Treaty of Portsmouth transfers Russian leasehold rights in Liaodong to Japan | Russian leased territory in Kwantung → Japanese leased territory in Kwantung | transfer_of_leasehold_rights | verified |
| 1905-09-05 | Treaty of Portsmouth: southern Sakhalin ceded to Japan | Russian Empire → Empire of Japan | cession_by_treaty | verified |

## Data quality, schema and integration cautions

1. **Entity registry mapping:** many IDs (for example `FRA_OCC`, `ANNAM_TONKIN_PROT`, `FRA_INDOCHINA`, `RUS_LEASE`, `BUL_AUT`, `ALB_PROV`) are research keys, not guaranteed current registry IDs. Claude must map them to canonical entities before promotion.
2. **Date precision:** partial dates such as `1867-06`, `1867`, `1873`, `1884`, `1888` mean the source does not establish a day. The Merv event is year precision. Do not parse them as the first day of the period.
3. **Status semantics:** `type` differentiates annexation, cession, protectorate, occupation, lease, purchase, federation and boundary settlement. The engine should use an explicit sovereignty/control layer rather than treating every event as `owner = to`.
4. **Region crosswalk:** `regionIds: []` means the current 1836 map does not provide a safe one-to-one region. The named historical area and principal cities are descriptive clues, not a license to infer a region ID. Several areas require region splitting or new map units.
5. **No fabricated province IDs:** all empty region arrays are intentional. The current 1836 map is coarse and some event-era borders do not match modern national boundaries.
6. **Africa scope:** selected major milestones only. No comprehensive colonial boundary dataset is claimed.
7. **Historical Mode:** event triggers should depend on the world state and historical preconditions. Sandbox must allow alternate outcomes. Where events are contested or delayed, do not force a fixed outcome solely by date.
8. **No Paradox material:** the research is based on treaties, government archives, institutional history and academic sources; it does not copy Victoria 3 data or text.

## Structural validation

- JSON parse: PASS.
- Event count matches metadata: 59/59.
- Source count matches metadata: 47/47.
- Duplicate event IDs: 0.
- Missing source references: 0.
- Required event fields: all present.
- This is structural validation only; no engine tests or build were run.

## Source register

- **fr_algeria_1830** — [Algiers capitulation, 5 July 1830 (UN document reproduction)](https://digitallibrary.un.org/record/3857853/files/A_C.1_PV.831-EN.pdf) (verified; UN document quoting capitulation instrument). Surrender covered Algiers city and immediate environs only; it did not transfer sovereignty over all Algeria.
- **algeria_conquest** — [Bugeaud’s conquest of Algeria from 1841 to 1847](https://www.tandfonline.com/doi/full/10.1080/09592318.2025.2608799) (supported; Journal of Strategic Studies). Explains long military conquest and Abd el-Kader's surrender in December 1847.
- **us_texas** — [The Annexation of Texas, the Mexican-American War, and the Treaty of Guadalupe-Hidalgo, 1845–1848](https://history.state.gov/milestones/1830-1860/texas-annexation) (verified; US Department of State Office of the Historian). Texas admission 29 December 1845; Oregon Treaty 1846; Mexican cession 1848.
- **us_guadalupe** — [Treaty of Guadalupe Hidalgo (1848)](https://www.archives.gov/milestone-documents/treaty-of-guadalupe-hidalgo) (verified; US National Archives). Primary treaty; signed 2 February 1848; Mexico ceded extensive northern territories.
- **us_gadsden** — [Gadsden Purchase](https://history.state.gov/milestones/1830-1860/gadsden-purchase) (verified; US Department of State Office of the Historian). Treaty signed 30 December 1853; land purchase from Mexico.
- **us_alaska** — [Alaska Purchase Treaty, 1867](https://www.archives.gov/milestone-documents/treaty-with-russia-for-purchase-of-alaska) (verified; US National Archives). Cession by Russia to United States; signed 30 March 1867.
- **us_hawaii** — [Joint Resolution to Provide for Annexing the Hawaiian Islands to the United States (1898)](https://www.archives.gov/milestone-documents/joint-resolution-for-annexing-the-hawaiian-islands) (verified; US National Archives). Annexation resolution 7 July 1898; formal transfer ceremony 12 August.
- **us_spanishwar** — [Spanish-American War and Treaty of Paris](https://history.state.gov/milestones/1866-1898/spanish-american-war) (verified; US Department of State Office of the Historian). Treaty 10 December 1898: Puerto Rico, Guam ceded; Philippines sold; Cuba sovereignty relinquished.
- **punjab_proclamation** — [Proclamation annexing Punjab, 29 March 1849](https://upload.wikimedia.org/wikipedia/commons/7/73/Annals_of_India_for_the_year_1848_-_An_outline_of_the_principal_events_which_have_occurred_in_the_British_dominions_in_India_from_1st_January_1848_to_the_end_of_the_second_Seikh_war_in_March_%28IA_dli.ministry.09248%29.pdf) (verified; Contemporary official India annual record (digitized)). The proclamation declares Punjab a portion of British dominions; date 29 March 1849.
- **punjab_history** — [Accumulation by Attachment: Colonial Benevolence and the Rule of Capital in Nineteenth-Century Panjab](https://academic.oup.com/past/article/256/1/203/6422593) (supported; Past & Present, Oxford Academic). Confirms March 1849 annexation after Second Anglo-Sikh War.
- **burma_annex** — [Third Burma War](https://www.nam.ac.uk/explore/third-burma-war) (verified; National Army Museum). Upper Burma annexation proclaimed 1 January 1886 after 1885 invasion.
- **burma_lower** — [A timeline of Burma and the Army](https://www.nam.ac.uk/explore/timeline-burma-army) (supported; National Army Museum). Lower Irrawaddy annexed 20 January 1853; earlier coastal acquisitions 1826 outside requested period.
- **pangkor** — [Pangkor—Resistance, Retaliation, and Reflection, 1874–1877](https://academic.oup.com/book/57608/chapter-abstract/469225856) (supported; Oxford University Press). Pangkor Treaty 20 January 1874; British Resident in Perak, extended indirect rule.
- **malay_states** — [The Early British Administrators in the Malay States, 1874–1909](https://ajba.um.edu.my/index.php/SEJARAH/article/view/9310) (supported; SEJARAH / University of Malaya). British intervention expanded to Selangor and Sungai Ujong in 1874, Pahang 1888; federation 1896.
- **vn_cochinchina** — [The Land Boundaries of Indochina](https://www.dur.ac.uk/media/durham-university/research-/research-centres/ibru-centre-for-borders-research/maps-and-databases/publications-database/Boundary--Territory-Briefings-%28Vol.-2-no.-6%29.pdf) (supported; Durham University International Boundaries Research Unit). Treaty of Saigon 1862; occupation of remaining southern provinces 1867; Cambodia protectorate context.
- **vn_french** — [French colonial rule in Vietnam](https://www.cna.org/archive/CNA_Files/pdf/iop-2014-u-008433.pdf) (supported; Center for Naval Analyses). French invasion 1858; Saigon 1859; 1862 treaty and 1864 formal declaration of Cochinchina as French territory.
- **cambodia_1863** — [Treaty of 11 August 1863 establishing French protection over Cambodia (quoted in ICJ filing)](https://icj-web.leman.un-icc.cloud/sites/default/files/case-related/45/9253.pdf) (supported; ICJ case document reproducing treaty). Treaty date 11 August 1863; protectorate, not outright annexation.
- **berlin_treaty** — [Treaty of Berlin, 13 July 1878 (FRUS text)](https://history.state.gov/historicaldocuments/frus1878/d523) (verified; US Department of State, FRUS primary treaty text). Articles define autonomous tributary Bulgaria, independence of Serbia and Montenegro, Romania, and Austro-Hungarian occupation of Bosnia-Herzegovina.
- **berlin_treaty_context** — [Treaty of Berlin provisions and territorial settlement](https://history.state.gov/historicaldocuments/frus1878/papers) (verified; US Department of State, FRUS). Contemporaneous diplomatic index summarises treaty articles and territorial changes.
- **albania_independence** — [Hall of Independence of Albania (1912–1939)](https://www.mhk.gov.al/en/?elemenfolio=pavijoni-i-pavaresise-2) (verified; National Historical Museum of Albania). Declaration 28 November 1912; recognition as independent neutral state 29 July 1913.
- **balkan_bucharest** — [Treaty of Bucharest, 10 August 1913](https://www.macedonianleague.org/documents/the-treaty-of-bucharest-august-10-1913) (supported; Treaty transcription). Peace settlement among Romania, Greece, Montenegro, Serbia and Bulgaria; used with caution for exact territorial clauses.
- **russia_centralasia** — [Central Asia vii. In the 18th–19th Centuries](https://www.iranicaonline.org/articles/central-asia-vii/) (supported; Encyclopaedia Iranica). Tashkent captured 1865 and annexed 1866; Bukhara defeated 1868; Samarkand fell; Kokand's later absorption.
- **russia_centralasia_army** — [Russian-Soviet Unconventional Wars in the Caucasus, Central Asia, and Afghanistan](https://history.army.mil/portals/143/Images/Publications/catalog/107-1.pdf) (supported; US Army Center of Military History). Broad conquest chronology: Kazakh steppe, khanates, Khiva 1873, Turkmen lands in 1880s.
- **russia_centralasia_loc** — [Central Asian law and Russian imperial expansion](https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/16/03/54/32/2016035432/2016035432.pdf) (supported; Library of Congress-hosted academic monograph). Tashkent 1865; Bukhara and Khiva protectorates; Turkestan administration.
- **taiwan_1895** — [Takeover of Taiwan in Accordance with the Treaty](https://archives.ith.sinica.edu.tw/collections_con2_en.php?no=175) (verified; Academia Sinica, Archives of Institute of Taiwan History). Treaty signed 17 April 1895; sovereignty handover completed 2 June 1895.
- **shimonoseki** — [Treaty of Shimonoseki (1895), Article II](https://history.state.gov/historicaldocuments/frus1895p1/d203) (verified; US Department of State, FRUS primary treaty text). Cession to Japan of Taiwan/Pescadores and Liaodong (the latter subsequently retroceded under pressure).
- **korea_annex** — [Japan's Annexation of Korea](https://www.ndl.go.jp/modern/e/cha2/description27.html) (verified; National Diet Library of Japan). Annexation treaty signed 22 August 1910; Japanese annexation.
- **korea_treaty** — [Treaty on the Annexation of Korea, 1910](https://history.state.gov/historicaldocuments/frus1910/d705) (verified; US Department of State, FRUS primary treaty text). Article I transfers sovereignty; Article VIII effective upon promulgation.
- **russia_china_1858** — [Treaty of Aigun (1858) and Russian expansion in the Amur region](https://www.britannica.com/event/Treaty-of-Aigun) (supported; Encyclopaedia Britannica). Treaty ceded left bank of Amur to Russia; Ussuri territory remained jointly administered pending later settlement.
- **russia_china_1860** — [Convention of Peking (1860)](https://www.britannica.com/event/Convention-of-Peking) (supported; Encyclopaedia Britannica). Confirmed Russian possession east of Ussuri to Pacific, including area of Vladivostok.
- **egypt_1882** — [The British occupation, 1882–1922](https://www.cambridge.org/core/books/abs/cambridge-history-of-egypt/british-occupation-18821922/179398E6D722904951A25256F524C963) (supported; Cambridge University Press). British military occupation from 1882 while formal Egyptian/Ottoman status continued; do not model as annexation.
- **egypt_africa** — [Egypt and the Anglo-Egyptian Sudan](https://www.cambridge.org/core/books/abs/cambridge-history-of-africa/egypt-and-the-angloegyptian-sudan/38BE40DCC9DA94C4B4F8CCB3540F24DB) (supported; Cambridge University Press). British control over Egypt while formal Egyptian government and Ottoman status persisted.
- **congo_1885** — [Berlin Conference and Congo Free State](https://www.britannica.com/event/Berlin-West-Africa-Conference) (supported; Encyclopaedia Britannica). Conference 1884–85 recognised framework of Congo Free State; not a transfer to Belgium until 1908.
- **germany_africa** — [German colonial acquisitions 1884–1885](https://www.britannica.com/place/German-East-Africa) (supported; Encyclopaedia Britannica). German East Africa declared protectorate in 1885; coastal treaties/claims require distinction from effective control.
- **tunisia_1881** — [Treaty of Bardo (1881)](https://www.britannica.com/event/Treaty-of-Bardo) (supported; Encyclopaedia Britannica). French protectorate over Tunisia; Bey retained nominal rule.
- **suez_canal** — [Convention of Constantinople (1888)](https://avalon.law.yale.edu/19th_century/suez.asp) (verified; Yale Avalon Project). Suez Canal neutrality instrument; contextual only, not territorial transfer.
- **greece_1832** — [Treaty of Constantinople (1832) and Greek independence](https://www.britannica.com/event/Treaty-of-Constantinople-1832) (supported; Encyclopaedia Britannica). Recognised Greece as independent kingdom; boundary and state formation.
- **ionian_1864** — [Union of the Ionian Islands with Greece, 1864](https://www.britannica.com/place/Ionian-Islands) (supported; Encyclopaedia Britannica). Britain ceded Ionian Islands to Greece in 1864.
- **thessaly_1881** — [Convention of Constantinople (1881)](https://www.britannica.com/event/Convention-of-Constantinople-1881) (supported; Encyclopaedia Britannica). Ottoman cession of Thessaly and part of Epirus to Greece.
- **gadsden** — [Gadsden Purchase](https://history.state.gov/milestones/1830-1860/gadsden-purchase) (verified; US Department of State Office of the Historian). 1853–54 purchase; US-Mexico boundary settlement.
- **alaska** — [Alaska Purchase Treaty, 1867](https://www.archives.gov/milestone-documents/treaty-with-russia-for-purchase-of-alaska) (verified; US National Archives). Russia sold Alaska to the United States.
- **taiwan_japan** — [Takeover of Taiwan in Accordance with the Treaty](https://archives.ith.sinica.edu.tw/collections_con2_en.php?no=175) (verified; Academia Sinica). Taiwan and Penghu handover 2 June 1895.
- **laos_1893** — [Franco-Siamese Treaty of 3 October 1893](https://history.state.gov/historicaldocuments/frus1893/d543) (verified; US Department of State, FRUS primary treaty text). Siam renounced claims to all territory on the left bank of the Mekong and islands in the river.
- **berlin_act_1885** — [General Act of the Berlin West Africa Conference, 26 February 1885](https://archiv.diplo.de/arc-en/the-political-archive/general-act-2684414) (verified; German Federal Foreign Office / Political Archive). Conference created rules for claims and effective occupation; did not draw colonial borders and did not consult African representatives.
- **manchuria_lease_1898** — [Russian lease of Port Arthur and Dairen, 1898 (FRUS retrospective)](https://history.state.gov/historicaldocuments/frus1945Berlinv02/d1215) (supported; US Department of State, FRUS). Russia received a 25-year lease of Liaodong ports; lease rights passed to Japan under Portsmouth 1905.
- **portsmouth_1905** — [Treaty of Portsmouth, 1905](https://history.state.gov/historicaldocuments/frus1905/d915) (verified; US Department of State, FRUS primary treaty text). Russia ceded the lease of Port Arthur/Dairen to Japan with China's consent and both powers agreed to restore most of Manchuria to Chinese administration.
- **portsmouth_context** — [The Treaty of Portsmouth and the Russo-Japanese War, 1904–1905](https://history.state.gov/milestones/1899-1913/portsmouth-treaty) (supported; US Department of State Office of the Historian). Explains Russian/Japanese competition in Manchuria, Korea and Sakhalin.

## Outstanding review gates

- Primary-source verification of the exact Patenôtre/Harmand treaty legal effects and the precise administrative decree establishing the 1887 Indochinese Union.
- Primary treaty verification for the 1885 Bulgaria/Eastern Rumelia union and the precise Pahang Resident instrument date.
- Region-level GIS/historical map crosswalk for Indochina, Balkans, Central Asia, Taiwan, Manchuria, Africa and US acquisitions.
- Broaden Africa coverage before claiming a complete Scramble-for-Africa timeline.
- Canonical entity mapping and import schema validation by Claude before promotion to `historical_data/research_staging/CG45_TERRITORIAL_CHANGES_1836_1914.json`.
