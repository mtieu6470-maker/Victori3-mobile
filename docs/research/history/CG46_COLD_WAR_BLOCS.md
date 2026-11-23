# CG-46 — Cold War alliances, economic blocs and political organisations

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Prepared:** 2026-11-23  
**Scope:** 1945–1993 core Cold War period, with explicitly marked treaty/organisation continuity beyond 1993.  
**Status:** Research deliverable in `docs/research/**`; staging and engine integration remain with Claude.

## Executive summary

The structured companion contains 22 organisations/treaty relationships and 264 member or founding-participant rows, supported by 33 source-register entries. It covers military alliances, bilateral defence treaties, economic blocs and political organisations. It intentionally distinguishes full membership from associate/observer status, treaty-protected territories, political participation and participation in an integrated command.

## Core findings and modelling cautions

### Military alliances and bilateral treaties

- **NATO:** treaty signed 4 April 1949; in force 24 August 1949. Greece and Türkiye joined in 1952, the Federal Republic of Germany in 1955, and Spain in 1982. France never left NATO: it withdrew from the integrated military command in 1966 and reintegrated in 2009. Greece likewise remained a political member while withdrawing its forces from the integrated military structure in August 1974; reintegration occurred in October 1980.
- **Warsaw Treaty Organization:** treaty signed 14 May 1955; in force 4 June 1955. Original parties were USSR, Albania, Bulgaria, Czechoslovakia, GDR, Hungary, Poland and Romania. Albania stopped participating de facto in 1961 but formally notified withdrawal in 1968. The GDR withdrew in September 1990; the Pact dissolved in 1991.
- **SEATO:** treaty signed 8 September 1954; in force 19 February 1955. Eight treaty parties: Australia, France, New Zealand, Pakistan, Philippines, Thailand, UK and US. Cambodia, Laos and the free territory under the jurisdiction of the State of Vietnam were designated by protocol as protected territories, not members. Pakistan withdrew in 1973; SEATO dissolved in 1977. The source register does not claim a fully verified day-precise French exit date.
- **Baghdad Pact/CENTO:** Turkey and Iraq signed the Baghdad Pact in February 1955; UK, Pakistan and Iran joined during 1955. It was renamed CENTO in 1959. Iraq withdrew in March 1959; Iran and Pakistan withdrew in March 1979; CENTO was dissolved on 26 September 1979. The US was an associate/observer, not a full member.
- **ANZUS:** signed 1 September 1951, in force 29 April 1952. New Zealand's 1986 nuclear-ship dispute affected US treaty obligations; it must not be encoded as an ordinary expulsion or a clean formal withdrawal absent a termination instrument.
- **Bilateral US treaties:** the 1951 Japan security treaty was replaced by the 1960 Treaty of Mutual Cooperation and Security; the US–ROK treaty entered into force in 1954; the US–Philippines treaty in 1952; the US–ROC treaty entered into force in 1955 and was terminated effective 1 January 1980.
- **Sino-Soviet treaty:** signed 14 February 1950 and entered into force 11 April 1950, with a 30-year term. The political split predates formal expiry.
- **USSR–Vietnam:** Treaty of Friendship and Cooperation signed 3 November 1978 and entered into force 13 December 1978. This is a bilateral treaty with mutual-assistance language, not a multilateral bloc.

### Economic blocs

- **Comecon/SEV:** founded in January 1949 by the USSR, Bulgaria, Czechoslovakia, Hungary, Poland and Romania. Albania joined in February 1949 and ceased participation de facto in 1961; GDR joined in 1950, Mongolia in 1962, Cuba in 1972 and Vietnam in 1978. Yugoslavia was an associate member, not a full member; Finland had a cooperation agreement, not full membership. Dissolution protocol signed 28 June 1991.
- **ECSC/CECA:** Treaty signed 18 April 1951, in force 23 July 1952, expired 23 July 2002. Six founding states. Do not merge it with the EEC or give it a 1993 dissolution date.
- **EEC/EU:** Treaty of Rome signed 25 March 1957, in force 1 January 1958; six founding states. Enlargements: Denmark/Ireland/UK 1973, Greece 1981, Spain/Portugal 1986. Maastricht entered into force 1 November 1993, establishing the EU with the then 12 EEC members. Austria, Finland and Sweden joined only in 1995.
- **EFTA:** Stockholm Convention signed 4 January 1960, in force 3 May 1960. Seven founders: Austria, Denmark, Norway, Portugal, Sweden, Switzerland and UK. Finland was an associate from 1961 and full member from 1986; Iceland joined 1970; Liechtenstein 1991. Denmark and UK left in 1973; Portugal in 1986; Austria, Sweden and Finland in 1995.

### Political organisations

- **NAM:** formally established at the Belgrade Summit, 1–6 September 1961. The 25 founding participants are recorded as a founding cohort. NAM is a political movement, not a mutual-defence treaty.
- **Arab League:** Charter signed 22 March 1945, in force 10 May 1945. Seven founding states. Egypt's membership was suspended in 1979 and restored in 1989; the suspension is not a state withdrawal from the League permanently.
- **OAU:** founded 25 May 1963 by 32 independent African states. Additional members joined as decolonisation proceeded; Morocco withdrew in 1984. The OAU was succeeded by the African Union in 2002, not dissolved in 1999.
- **ASEAN:** founded 8 August 1967 by Indonesia, Malaysia, Philippines, Singapore and Thailand. Brunei joined in 1984; Vietnam in 1995; Laos and Myanmar in 1997; Cambodia in 1999. Post-Cold-War accessions are marked as continuation context.
- **OAS:** Charter adopted 30 April 1948 and entered into force 13 December 1951. The 21 original signatories are distinguished from later accessions. Cuba's 1962 exclusion from participation is not equivalent to an ordinary membership exit.

## Data and integration rules

1. **Do not use current capitals for historical dates.** The package retains historical forms such as Karachi, Rangoon, Leopoldville, Lagos, Dar es Salaam, Zomba, Salisbury, East Berlin and Bonn.
2. **Do not treat all relationships as the same type.** NATO/SEATO/CENTO are multilateral military alliances; US–Japan and USSR–Vietnam are bilateral treaty relationships; Comecon/EEC/EFTA are economic blocs; NAM/Arab League/OAU/ASEAN/OAS are political organisations.
3. **Do not turn command participation into alliance membership.** France 1966–2009 and Greece 1974–1980 are the critical examples.
4. **Do not turn protected areas into member states.** SEATO's protocol coverage of Cambodia, Laos and the then State of Vietnam is not membership.
5. **Preserve associate/observer distinctions.** US in CENTO, Yugoslavia in Comecon, Finland's early EFTA status, and NAM founding participants each require their own status semantics.
6. **Date precision matters.** Some accessions are known only by year or month in the source register. Keep partial dates; do not manufacture a day.
7. **Capital city is not a region ID.** Claude must map the historical capital strings to canonical entities/regions and resolve any city that did not exist as the national capital at the time.
8. **Coverage limits:** Rio Treaty and OAS founding cohorts are not a complete member-by-member ratification/withdrawal chronology. OAU roster is selected through the Cold War rather than an exhaustive current AU roster. These limitations are explicit in JSON; do not promote them as exhaustive membership histories.

## Validation

- JSON parse: PASS (validated before commit).
- Organization records: 22.
- Member/founding-participant rows: 264.
- Source-register entries: 33.
- Each organization has a recognized requested type and a non-empty member list.
- Each member row has a name, historical capital and start date (partial date allowed where source precision is partial).
- This is structural research validation, not engine schema validation, gameplay simulation, regression testing or APK build.

## Source register

- **nato_france** — [France and NATO](https://www.nato.int/en/about-us/nato-history/history-by-theme/my-country-and-nato/france-and-nato). France remained a member after 1966 withdrawal from integrated command; 2009 reintegration.
- **nato_greece** — [Greece and NATO](https://www.nato.int/en/about-us/nato-history/history-by-theme/my-country-and-nato/greece-and-nato). Greece's 1974 command-structure withdrawal and 1980 return.
- **nato_dpc** — [NATO Defence Planning Committee 1963–2010](https://www.nato.int/en/about-us/organization/nato-structure/defence-planning-committee-1963-2010). France not represented on DPC 1966–2009.
- **warsaw_us_state** — [Warsaw Treaty Organization](https://history.state.gov/milestones/1953-1960/warsaw-treaty). Founding members, GDR withdrawal 1990, dissolution 1991.
- **seato_us_state** — [Southeast Asia Treaty Organization, 1954](https://history.state.gov/milestones/1953-1960/seato). Eight member states, Pakistan withdrawal 1973, SEATO dissolution 1977.
- **seato_untc** — [Southeast Asia Collective Defense Treaty, UN Treaty Collection](https://treaties.un.org/Pages/showDetails.aspx?objid=080000028014b021). Treaty signature, entry into force and treaty parties.
- **cento_nara** — [Records of International Military Agencies — CENTO](https://www.archives.gov/research/guide-fed-records/groups/333.html). Baghdad Pact accession sequence, Iraq withdrawal, CENTO inactivity/dissolution context.
- **cento_nato** — [The Baghdad Pact becomes CENTO](https://www.nato.int/en/news-and-events/articles/news/1959/08/19/the-baghdad-pact-becomes-the-central-treaty-organisation-cento). CENTO full and associate membership; 1979 dissolution.
- **cento_uk_treaties** — [UK Treaties Online — Baghdad Pact/CENTO status](https://treaties.fcdo.gov.uk/awweb/awarchive?item=70493&type=file). Iran/Pakistan withdrawal dates, Iraq denunciation, UK/Turkey termination.
- **anzus_state** — [U.S. Collective Defense Arrangements](https://2009-2017.state.gov/s/l/treaty/collectivedefense/index.htm). ANZUS and bilateral treaty parties.
- **rio_untc** — [Inter-American Treaty of Reciprocal Assistance, UN Treaty Collection](https://treaties.un.org/pages/showDetails.aspx?objid=0800000280163387). Rio Treaty signature and entry into force.
- **us_japan** — [Japan-U.S. Security Treaty](https://www.mod.go.jp/en/j-us-alliance/joint-declaration/treaty/index.html). 1960 revised treaty date and supersession of 1951 treaty.
- **us_rok_untc** — [Mutual Defense Treaty between US and Republic of Korea](https://treaties.un.org/Pages/showDetails.aspx?objid=0800000280146bb3). Signature and entry into force.
- **us_phil_untc** — [Mutual Defense Treaty between US and Philippines](https://treaties.un.org/Pages/showDetails.aspx?objid=080000028014df2a). Signature and entry into force.
- **us_roc_govinfo** — [United States Defense Policies in 1963](https://www.govinfo.gov/content/pkg/SERIALSET-12631_01_00-047-0335-0000/pdf/SERIALSET-12631_01_00-047-0335-0000.pdf). US–ROC treaty signature and entry into force.
- **sinosoviet_untc** — [Treaty of Friendship, Alliance and Mutual Assistance, PRC–USSR](https://treaties.un.org/Pages/showDetails.aspx?objid=0800000280147e29). Treaty signature and entry into force.
- **soviet_vietnam_untc** — [Treaty of Friendship and Cooperation USSR–Viet Nam](https://treaties.un.org/doc/Publication/UNTS/Volume%201145/v1145.pdf). Treaty signature and entry into force.
- **comecon_iaea** — [IAEA-TECDOC-922, Economic integration in Central and Eastern Europe](https://www-pub.iaea.org/MTCD/Publications/PDF/te_0922_scr.pdf). Comecon founding members, accessions, Albania's de facto withdrawal, dissolution context.
- **ecsc_eu** — [Founding agreements](https://european-union.europa.eu/principles-countries-history/principles-and-values/founding-agreements_en). ECSC signature, entry into force and expiry; EC enlargements.
- **eec_consilium** — [Treaty establishing the European Economic Community](https://www.consilium.europa.eu/en/documents/treaties-agreements/agreement/?id=1957002). EEC six original states, signature and entry into force.
- **eec_ep** — [Treaty of Rome](https://www.europarl.europa.eu/about-parliament/en/in-the-past/the-parliament-and-the-treaties/treaty-of-rome). EEC six founding states and treaty dates.
- **efta_faq** — [EFTA FAQs](https://www.efta.int/about-efta/faqs). Seven founding states and establishment.
- **efta_history** — [EFTA history](https://www.efta.int/about-efta/european-free-trade-association/history). Finland, Iceland accessions; Denmark, UK and Portugal departures; later membership changes.
- **nam_history** — [Non-Aligned Movement history](https://www.nam.go.ug/history). Belgrade summit and formal establishment in 1961.
- **nam_founders** — [NAM 16th Summit Final Document](https://www.nam.go.ug/sites/default/files/2023-06/NAM-16th%20SUmmit%20Final-Document%20Tehran-Iran%202012.pdf). List of 25 founding countries.
- **arab_untc** — [Pact of the League of Arab States](https://treaties.un.org/pages/showDetails.aspx?objid=080000028015a44b). Founding states, signature and entry into force.
- **arab_unterm** — [UNTERM — League of Arab States](https://unterm.un.org/unterm2/view/38727503-9e12-41bd-9e0b-ccb02590ec3c). Founding and subsequent Arab League accessions; Egypt suspension.
- **oau_au** — [OAU Charter](https://au.int/en/treaties/oau-charter-addis-ababa-25-may-1963). OAU Charter adoption and entry into force.
- **oau_members** — [African Union member states — OAU/AU accession dates](https://au.int/en/AU_Member_States). 32 OAU founders, later accession dates and Morocco's 1984 withdrawal.
- **oau_history** — [About the African Union](https://au.int/en/overview). OAU successor transition to AU in 2002.
- **asean_about** — [About ASEAN](https://asean.org/about-asean/). Founding date, five founding states and later accessions.
- **oas_charter** — [OAS Charter — signatures and ratifications](https://www.oas.org/en/iachr/mandate/Basics/charterOASrat.asp). Adoption and entry into force.
- **oas_members** — [OAS Member States](https://oas.org/en/about/member_states.asp). 21 original signatories and subsequent membership accessions.

## Promotion gate

This package is in `docs/research/history/` only. Claude should review the member rows against primary treaty instruments and institutional membership lists, map state names to canonical entity IDs, map historical capitals to region IDs, decide whether the diplomacy engine can represent bilateral treaties/associate members/suspension separately from full bloc membership, then create and validate the staging representation. In particular, do not silently promote the explicitly partial Rio Treaty/OAS/OAU coverage to exhaustive member lists.
