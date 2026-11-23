# CG-37 — Independence, decolonization and Egypt territorial-control chronology

**Status: PARTIAL / research register v1.** CSV contains 87 country/territory cases: post-1945 independence examples across Africa, Asia, Caribbean and Oceania; Latin American independence comparison; and separate British dominion/protected-state cases are discussed below. It is not yet a claim that every former colony and protectorate in 1945–1990 has been exhaustively enumerated. Some dates distinguish declaration from recognized transfer; classification mode is an analytical label, not a claim that every case was purely peaceful or purely military.

## 1. How to use the CSV

- `independence_date` is the date used in the relevant UN decolonization chronology or national instrument; where declaration, recognition and transfer differ, the notes say so.
- `mode`: negotiated, war, or partition. Cases with both war and negotiations are assigned by dominant transition mechanism and annotated.
- The UN list of former Trust and Non-Self-Governing Territories is a strong baseline for colonial administering powers and outcomes, but it does not by itself enumerate every non-self-governing colony outside the UN system.
- UN admission date is not interchangeable with independence date. The CSV uses independence/transfer dates where available, not UN membership dates.
- ISO3 is the modern successor-state code; historical polities and predecessor territories are preserved in `predecessor_unit`.

## 2. Key distinctions and omissions requiring follow-up

### British dominions are not equivalent to full sovereign independence
Canada 1867 (Confederation/Dominion), Australia 1901 (Federation/Commonwealth), New Zealand 1907 (Dominion status), and South Africa 1910 (Union) were constitutional milestones, not full independence dates. The Statute of Westminster 1931 and later constitutional acts are relevant to legal autonomy. They are therefore not inserted as independence dates in the core CSV; a separate status timeline should record them as constitutional autonomy milestones.

### Latin America 1810–1830
The rows use the principal independence declaration or recognized separation year. Some countries had multiple stages: Venezuela's 1811 declaration and 1821 military consolidation; Peru's 1821 declaration and 1824 military outcome; Uruguay's 1828 settlement was a British-mediated buffer-state arrangement. These dates must not be treated as a single synchronized “decolonization wave.”

### Egypt and Sudan, 1836–1914 — territorial-control correction

- **Egypt 1836:** under Muhammad Ali, Egypt was an autonomous hereditary Ottoman province/de facto state, not a fully independent sovereign state in the modern international-law sense. It was not a colony of Britain in 1836.
- **Sudan 1820–1885:** Egyptian-Ottoman forces under Muhammad Ali conquered and incorporated large parts of the Sudanese Nile valley beginning in 1820–21. This was expansion by the Egyptian-Ottoman state, involving military conquest and colonial-style extraction; avoid rendering every modern Sudanese border as a single clean Egyptian province. Darfur remained independent until 1874 and other peripheral regions were incorporated at different times.
- **Mahdist state 1881–1898:** Egyptian control collapsed across much of Sudan during the Mahdist revolt; Khartoum fell in 1885. It is incorrect to say Egypt continuously administered all Sudan from 1820 through 1899.
- **Anglo-Egyptian reconquest 1896–1898; condominium 1899:** the 1899 agreement formally established joint British-Egyptian rule, but M. W. Daly’s study explains that the arrangement operated as British management with Egypt paying much of the administration. It was not simple restoration of Egyptian sovereignty.
- **1882 occupation of Egypt:** British forces occupied Egypt after the Urabi revolt and the Battle of Tel el-Kebir. Formally the Egyptian government and Khedive remained; British control became decisive. Treat 1882 as the beginning of British military occupation/de facto control, not a legal transfer of Egyptian sovereignty or a colonial independence event.
- **1914:** Britain declared a protectorate over Egypt and deposed Ottoman suzerainty when the Ottoman Empire entered the war. This is the relevant formal status change inside the game period.

For AI territorial claims, use separate flags for `de_jure_suzerainty`, `de_facto_occupation`, `military_control`, `tributary/condominium`, and `recognized_sovereignty`. Never infer a valid annexation solely from a historical army presence or a map's color.

## 3. Sources and evidence quality

- UN, *Basic Facts about the United Nations* (2017), Appendix III, lists trust and non-self-governing territories that achieved independence after the 1960 Declaration. https://digitallibrary.un.org/record/1291384/files/1138094_EN.pdf
- UN, former Trust and Non-Self-Governing Territories register, records administering power, predecessor unit, successor and year; it includes the French, British, Belgian, Portuguese, Dutch, Italian, New Zealand and Australian cases. https://www.un.org/dppa/decolonization/en/history/former-trust-and-nsgts
- National independence instruments are cited in notes for selected cases: Indian Independence Act 1947; Treaty of Manila 1946; Évian Accords 1962; Lancaster House Agreement 1979; UN Security Council Resolution 435 for Namibia.
- Egypt: *Cambridge History of Africa*, “Egypt and the Anglo-Egyptian Sudan” describes the 1882 occupation and evolving British control; M. W. Daly, “The Development of the Governor-Generalship of the Sudan, 1899–1934,” *Journal of African History* 24(1), 1983, explains the formal condominium and its practical British dominance. https://www.cambridge.org/core/books/abs/cambridge-history-of-africa/egypt-and-the-angloegyptian-sudan/38BE40DCC9DA94C4B4F8CCB3540F24DB ; https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/development-of-the-governorgeneralship-of-the-sudan-18991934/3331C84D0DAEA4BF0EA0842824732B58

## 4. Known coverage gaps before final acceptance

- Add all small island dependencies and non-UN-listed colonies/protectorates, including French, British, Dutch and US Caribbean and Pacific territories whose constitutional status changed without full independence.
- Distinguish independence from free association, internal self-government, annexation, integration, and change of administering power (e.g., French overseas departments, Cook Islands/Niue, Netherlands Antilles, Greenland).
- Add detailed 1810–1830 independence/recognition stages for each Latin American state; current rows are a compact comparator only.
- Add separate records for Tanganyika, Zanzibar, British Somaliland, Italian Somaliland, British Cameroons, Southern Cameroons, Northern Cameroons, Ruanda-Urundi and the New Hebrides if the engine simulates predecessor units rather than successor states.
- Verify every independence date against the corresponding national instrument/official gazette before making this an authoritative simulation input.
