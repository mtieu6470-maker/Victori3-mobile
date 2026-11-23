# CG-47C — Historical effects of economic and political organisations

**Task:** CG-47C (MSG-108)  
**Coverage:** COMECON, Non-Aligned Movement/UN General Assembly voting, Arab League, OAU, ASEAN/AFTA, OAS and EFTA.  
**Status:** Research and design evidence only. No engine modifiers or source data have been added to runtime.

## Executive findings

1. **COMECON was a substantial but asymmetric planned-trade system.** Intra-COMECON trade was roughly three-fifths of members' reported trade in several benchmark years, but country dependence varied sharply. Soviet energy and raw-material supplies were central; specialization agreements were concentrated in engineering, chemicals, machinery and transport equipment. The bloc did not create one frictionless common market.
2. **NAM and the wider G77 had agenda-setting power at the UN, not uniform voting discipline.** Their numerical weight helped put decolonization, sovereignty and the New International Economic Order on the agenda. Membership was heterogeneous and issue coalitions changed; a universal fixed voting-cohesion bonus would be historically false.
3. **The Arab League boycott of Israel had real institutional machinery, but enforcement was decentralized.** A Central Boycott Office coordinated primary, secondary and tertiary boycott lists; each member state decided how to apply them, so national lists and implementation differed.
4. **The OAU's strongest operational effect was decolonization support.** Its Liberation Committee coordinated diplomatic, financial, military and logistical assistance to liberation movements and internationalized anti-apartheid pressure.
5. **ASEAN combined non-interference and consensus with gradual economic integration.** The 1976 Treaty of Amity and Cooperation (TAC) codified peaceful settlement and non-interference. AFTA's 1992 CEPT scheme began in 1993 and reduced intra-ASEAN tariffs in stages; it was not a customs union.
6. **The OAS could coordinate diplomatic action and suspend participation, but was not a supranational government.** Cuba's participation was excluded in 1962; the 2009 repeal did not automatically restore Cuba's participation.
7. **EFTA liberalized industrial trade without a common external tariff.** Internal free trade in industrial products was achieved in 1966; EFTA and EEC industrial tariffs were eliminated in 1977 under their bilateral arrangements.

---

## 1. COMECON / CMEA

### 1.1 Intra-bloc trade shares

The following benchmark series are reported in a comparative historical study. Percentages are shares of each member's total trade conducted with other COMECON members, not shares of world trade. Statistical definitions, valuation and exchange-rate conversion differ across socialist economies; treat these as approximate historical benchmarks, not directly comparable national accounts.

| Member | 1950 | 1960 | 1972 | 1979 |
|---|---:|---:|---:|---:|
| Bulgaria | — | 80.7% | 80.2% | 75.7% |
| Czechoslovakia | 55.6% | 63.8% | 71.3% | 67.2% |
| East Germany (GDR) | — | — | 71.0% | 65.8% |
| Hungary | — | — | 68.1% | 52.0% |
| Poland | 58.4% | 56.6% | 62.3% | 54.7% |
| Romania | 89.2% | 65.8% | 53.7% | 35.4% |
| Soviet Union | — | — | 64.5% | 51.9% |
| All members (study's aggregate) | 61.8% | 60.8% | 62.6% | n/a |

**Interpretation**
- The aggregate remained near 61–63% in the cited 1950, 1960 and 1972 snapshots; it did not rise continuously.
- Bulgaria and Czechoslovakia were highly integrated. Romania deliberately diversified away from COMECON, falling to 35.4% by 1979. Hungary and Poland were also less dependent by the late 1970s.
- An IMF review of 1960–66 independently found that intra-CMEA trade remained slightly above 60% of total CMEA trade. A 1970s NATO assessment reported approximately 59% in 1970, 53% in 1974 and 56% in 1975, illustrating how annual values fluctuated with prices and trade with the West.
- Mid-1980s analysis still found substantial dependence, but the share ranged from less than one-half for Hungary and Poland to nearly three-quarters for Bulgaria and Czechoslovakia. The Soviet Union was the principal trading partner for each of the East European members in that study.

Sources: [Comparative COMECON trade-share series](https://webdoc.sub.gwdg.de/ebook/serien/qg/rkk/62.pdf); [IMF, East-West Trade and Payments Relations (1970)](https://www.elibrary.imf.org/view/journals/024/1970/001/article-A005-en.xml); [IMF, Whither Comecon? (1989)](https://www.elibrary.imf.org/view/journals/022/0027/003/article-A011-en.xml); [NATO declassified assessment of intra-CMEA trade](https://mfa.bg/upload/77215/AC_127-D_496_ENG_NHQL27566.pdf).

### 1.2 Specialization and production planning

- The 1971 Comprehensive Programme for Socialist Economic Integration promoted multilateral and bilateral specialization agreements.
- A World Bank study reports **101 multilateral specialization agreements signed in 1972–1977**, alongside approximately **620–700 bilateral agreements**.
- Of 120 multilateral agreements in effect in 1980, **87 concerned engineering industries**. Products included ball bearings, electrical equipment, measuring instruments, medical equipment, textile machinery, agricultural machinery, construction machinery and materials.
- In 1985, the cited study estimated that specialization agreements accounted for the following shares of machinery trade: Bulgaria 58%, Czechoslovakia 44%, GDR 54%, Hungary 50%, Poland 21%, Romania 62% and USSR 22%.
- The well-known Ikarus example illustrates product specialization: Hungary became a major bus producer, while passenger cars were produced principally in the USSR, Czechoslovakia, GDR and Poland. This is an illustrative division of production, not an exhaustive or permanently enforced national quota.

Sources: [World Bank study on COMECON specialization agreements](https://documents1.worldbank.org/curated/en/432791468752076765/pdf/multi0page.pdf); [Economic Cooperation Within COMECON, 1963](https://aei.pitt.edu/73837/1/DODGE001.pdf); [NATO declassified assessment of Bulgarian specialization and Soviet trade dependence](https://mfa.bg/upload/77182/AC_127-D_496_ENG_NHQL27566.pdf).

### 1.3 Recommended simulation mechanics

- Model **bilateral planned-trade links** and **sector-specific specialization**, not one universal intra-bloc trade bonus.
- Use time-varying member dependence. Bulgaria/Czechoslovakia should have stronger historical exposure than Romania in the 1970s; Romania's trade diversification should be visible.
- Represent Soviet oil, gas, raw materials and industrial equipment as strategic supply dependencies. Disruption should create production bottlenecks in dependent members.
- Specialization agreements should increase the availability and reliability of selected goods, but create switching costs and concentration risk.
- Do not treat COMECON as an EU-style customs union or as a single unified market. The evidence supports planned coordination and high intra-bloc trade, but also bilateral bargaining, uneven implementation and persistent national interests.

**Confidence:** High for broad asymmetry and specialization; medium for exact annual shares because historical trade statistics use non-uniform valuation and reporting conventions.

---

## 2. Non-Aligned Movement, G77 and UN General Assembly voting

### 2.1 What the movement could do

- The 1961 Belgrade summit institutionalized the Non-Aligned Movement as a political forum for states seeking strategic autonomy from the US-led and Soviet-led blocs.
- NAM's membership was never a single ideological or military bloc. It included monarchies, republics, socialist states, capitalist states and governments with conflicting regional interests.
- During 1970–1973 the movement increasingly acted as a pressure group for restructuring the international economic order. NAM members helped elevate development, commodity prices, sovereign control over resources, debt and technology transfer into high-level UN diplomacy.
- NAM members worked closely with the Group of 77, which became the principal negotiating vehicle for detailed proposals in UNCTAD and other UN economic forums.
- The Sixth Special Session of the UN General Assembly adopted the **Declaration and Programme of Action on the Establishment of a New International Economic Order on 1 May 1974**. The 1974 Charter of Economic Rights and Duties of States and later resolutions further articulated the programme.

Sources: [United Nations, The Early Days of the Group of 77](https://www.un.org/en/node/25961); [UN General Assembly Resolution 3201 (S-VI), NIEO Declaration](https://digitallibrary.un.org/record/218450); [NAM history](https://www.nam.go.ug/history).

### 2.2 Voting cohesion: quantitative evidence and limits

- A study of UNGA voting alignment for 1960–1963 reports a rising **dyadic affinity index** among non-aligned states: 0.330 (1960), 0.367 (1961), 0.443 (1962) and 0.568 (1963). This is the study's affinity statistic, **not** the percentage of all resolutions on which every NAM state voted identically.
- The same study estimates that non-aligned states numbered **81 of 112 UN members in 1963 (72%)**. That is a measure of potential voting weight, not proof that all 81 acted as a disciplined caucus on every vote.
- Broader research on UN voting emphasizes that roll-call alignment varies by issue and period. Group cohesion is not the same thing as membership, and voting together on colonialism or development does not imply agreement on regional security or domestic ideology.
- The UN's historical record also documents that the Group of 77 was heterogeneous, with different development levels, regional priorities and negotiating interests. No permanent central secretariat or binding party whip existed.

Sources: [Study reporting non-aligned affinity-index scores, 1960–1963](https://www.olivialau.org/papers/unreform.pdf); [UN, The Early Days of the Group of 77](https://www.un.org/en/node/25961); [Discovering Voting Groups in the United Nations, APSR](https://www.cambridge.org/core/journals/american-political-science-review/article/abs/discovering-voting-groups-in-the-united-nations/D443B1C941F48F0558CC68020D215E00); [UNGA voting alignment dataset analysis, 1946–2022](https://link.springer.com/article/10.1007/s11135-026-02814-x).

### 2.3 Recommended simulation mechanics

- Apply a **topic-dependent coordination probability**, not an unconditional NAM vote lock.
- Stronger coordination is plausible on decolonization, anti-apartheid, sovereignty, disarmament and NIEO/development proposals; weaker or divergent alignment is plausible on regional conflicts and issues directly affecting members' security.
- Let G77/NAM numerical weight affect agenda-setting, resolution passage probability and bargaining leverage. Do not equate a General Assembly resolution with an enforceable treaty or automatic domestic policy change.
- Keep NAM membership separate from military alliances and economic customs unions.

**Confidence:** High for agenda-setting and the NIEO sequence; medium for the affinity-index evidence because the index is one study's operationalization and must not be interpreted as a literal vote-agreement percentage.

---

## 3. League of Arab States: boycott of Israel

### 3.1 Actual mechanism

- In December 1945, the Arab League Council called for a boycott of Zionist goods and services in Mandatory Palestine, before the establishment of Israel.
- After 1948 the boycott was formalized against the State of Israel.
- In May 1951 the League established the **Central Boycott Office (CBO) in Damascus** to coordinate implementation. The system developed three tiers:
  1. **Primary boycott:** restrictions on trade with Israel and Israeli entities.
  2. **Secondary boycott:** restrictions on third-country firms doing business with Israel.
  3. **Tertiary boycott:** restrictions involving firms doing business with blacklisted companies.
- The CBO coordinated recommendations and lists, but implementation was not uniform. Each member state decided how to apply the recommendations and maintained national lists. The central committee's decisions were not automatically binding in every jurisdiction.
- The 1973 oil embargo was a separate set of national petroleum measures during the October War; it should not be conflated with the CBO's trade-blacklist mechanism.

Sources: [Congressional Research Service, Arab League Boycott of Israel](https://www.everycrsreport.com/reports/RL33961.html); [U.S. International Trade Commission, Effects of the Arab League Boycott of Israel on U.S. Businesses](https://www.usitc.gov/publications/332/pub2827_0.pdf); [declassified CIA report, Arab League Boycott of Israel](https://www.cia.gov/readingroom/docs/CIA-RDP08S01350R000200470001-4.pdf).

### 3.2 Recommended simulation mechanics

- Implement a League-level boycott resolution and CBO blacklist, then give each member a separate adoption/enforcement variable.
- Primary, secondary and tertiary restrictions should be distinct. A state may apply the primary boycott while limiting secondary/tertiary enforcement.
- Model trade diversion, compliance costs, blacklisted-firm exposure and diplomatic friction. Do not assume every League member automatically enforces identical restrictions.
- A boycott should affect trade and firm access, not automatically trigger war or a full military alliance.

**Confidence:** High for the institutional structure; medium for the degree of enforcement in each member and for aggregate economic impact. No single defensible League-wide loss percentage is supplied here.

---

## 4. Organization of African Unity (OAU)

### 4.1 Effective mechanisms

- The OAU established its **Coordinating Committee for the Liberation of Africa in 1963**.
- The Liberation Committee coordinated diplomatic support, financial assistance, and military/logistical aid to national liberation movements in territories including Angola, Mozambique, Guinea-Bissau, Zimbabwe, Namibia and South Africa.
- The OAU internationalized opposition to colonial and minority rule through UN diplomacy and legal action, including campaigns concerning Namibia, Rhodesia/Zimbabwe and apartheid South Africa.
- The committee's reports document practical assistance and coordination, not merely declarations. The committee was dissolved in June 1994 after the major decolonization and majority-rule objectives had been achieved; the OAU itself continued until its transformation into the African Union in 2002.

Sources: [African Union, OAU at 60 — decolonization and the struggle against apartheid](https://oau60.au.int/en/spotlight-60-years-achievements); [OAU Coordinating Committee for the Liberation of Africa, 1978 report](https://archives.au.int/handle/123456789/9757); [OAU resolution dissolving the Liberation Committee, 15 June 1994](https://africanlii.org/en/akn/aa-au/statement/resolution/oau/1994-06-15/resolution-on-dissolution-of-the-oau-liberation-committee/eng%401994-06-15).

### 4.2 Recommended simulation mechanics

- Give the OAU a **liberation-support capability**: funding, diplomatic recognition, training/logistical support and coordinated sanctions/embargo advocacy.
- Benefits should depend on member contributions, geographic access and the strength of the liberation movement; avoid a universal automatic independence event.
- Add international legitimacy and diplomatic-pressure effects against colonial or minority regimes, with possible retaliation and escalation.
- End the Liberation Committee's special mechanism in 1994; do not carry its exact Cold War liberation mandate unchanged into the AU era.

**Confidence:** High for the Liberation Committee's existence and mandate; medium for quantifying the independent causal effect of OAU support on the date a territory became independent.

---

## 5. ASEAN and AFTA

### 5.1 Political cooperation

- The **Treaty of Amity and Cooperation (TAC)** was signed on 24 February 1976.
- Its principles include mutual respect for sovereignty and territorial integrity, non-interference in domestic affairs, peaceful settlement of disputes, renunciation of force and effective cooperation.
- The 1976 Declaration of ASEAN Concord called for political solidarity, coordination of positions and common action where possible, alongside practical cooperation in food and energy.
- These are norms and consultation mechanisms, not a supranational enforcement authority.

Sources: [ASEAN, Treaty of Amity and Cooperation](https://asean.org/our-communities/asean-political-security-community/outward-looking-community/treaty-of-amity-and-cooperation-in-southeast-asia-tac/); [ASEAN Concord, Bali, 24 February 1976](https://asean.org/the-declaration-of-asean-concord-bali-indonesia-24-february-1976/).

### 5.2 AFTA / Common Effective Preferential Tariff (CEPT)

- AFTA was agreed at the Fourth ASEAN Summit in January 1992. The CEPT Scheme commenced on **1 January 1993**.
- The initial target was to bring covered intra-ASEAN tariffs to **0–5% within 15 years, by 2008**.
- Fast-track product groups included vegetable oils, cement, chemicals, pharmaceuticals, fertilizer, plastics, rubber products, leather, pulp and paper, textiles, furniture, ceramics/glass, gems/jewelry, copper cathodes and electronics.
- The schedule was accelerated. For older members, many normal-track tariff lines were targeted for 0–5% by 2003; new members had later schedules (Vietnam 2006; Laos and Myanmar 2008; Cambodia 2010).
- Sensitive and excluded products remained. The CEPT programme covered manufactured products and processed agricultural goods; unprocessed agricultural goods and permanently excluded products were treated differently.

Sources: [ASEAN, Questions and Answers on CEPT](https://asean.org/questions-and-answers-on-the-cept/); [ASEAN, acceleration of tariff reduction](https://asean.org/new-time-frame-acceleration-of-tariff-reduction/); [ASEAN FAQ on non-tariff issues](https://asean.org/frequently-asked-questions-on-non-tariff-issues-ntis/).

### 5.3 Recommended simulation mechanics

- Use a **gradual tariff schedule** by product group and member accession cohort. Do not set all tariffs to zero immediately in 1992.
- Track temporary exclusions, sensitive agricultural goods and the different deadlines for original and later members.
- Model TAC as diplomatic norms and consultation/mediation, not automatic war prevention.
- ASEAN is not a customs union: members retained their own external tariffs and trade policy toward non-members.

**Confidence:** High for the TAC and CEPT instruments and tariff targets; medium for the realized tariff level in each individual tariff line because implementation schedules and exclusions varied.

---

## 6. Organization of American States (OAS)

### 6.1 Actual mechanisms

- The OAS Charter created a regional forum for consultation, cooperation and collective action. It is not a supranational executive.
- In January 1962, the Eighth Meeting of Consultation adopted a resolution excluding the Cuban government from participation in the Inter-American System.
- On **3 June 2009**, the OAS General Assembly revoked that 1962 resolution. The same resolution stated that Cuba's participation would require a dialogue initiated at Cuba's request and consistent with OAS principles; repeal did **not** automatically restore Cuban participation.
- The Rio Treaty is a separate collective-security instrument and must not be conflated with the OAS Charter or with OAS membership.

Sources: [OAS, Resolution on Cuba, 3 June 2009](https://www.oas.org/en/media_center/press_release.asp?sCodigo=GA-12-09); [Congressional Research Service, OAS Background and Issues for Congress](https://www.everycrsreport.com/reports/R42639.html).

### 6.2 Recommended simulation mechanics

- Model OAS as a forum for resolutions, mediation, diplomatic pressure, election observation and coordinated sanctions where separately authorized.
- Participation suspension should be an explicit political decision with a dated legal basis; a later repeal should not auto-enroll a state.
- Keep Rio Treaty collective defence in the military-alliance system, not as an automatic effect of OAS membership.

**Confidence:** High for the Cuba resolutions and institutional distinction; medium for broader enforcement capacity, which varies by instrument and member consensus.

---

## 7. EFTA

### 7.1 Tariff-liberalization sequence

- EFTA was founded in 1960 by Austria, Denmark, Norway, Portugal, Sweden, Switzerland and the United Kingdom.
- Full free trade in industrial products among EFTA states was achieved in **1966**.
- Denmark and the United Kingdom left in 1972 to join the EEC; Portugal left in 1985.
- The remaining EFTA states concluded bilateral free-trade agreements with the EEC during the 1970s; tariffs on industrial goods in trade between the EEC and EFTA states were eliminated in **1977**.
- EFTA was a free-trade association, not a customs union: members retained separate external tariffs and independent commercial policy.

Source: [EFTA, History of the European Free Trade Association](https://www.efta.int/about-efta/european-free-trade-association/history).

### 7.2 Recommended simulation mechanics

- Implement an internal industrial-goods tariff phase-out ending in 1966.
- Represent the 1970s EEC–EFTA bilateral agreements as external preferential access, with 1977 as the industrial-tariff completion milestone.
- Do not give EFTA a common external tariff, common market or automatic common trade policy.

**Confidence:** High for founding membership and industrial tariff milestones; high for the distinction from a customs union.

---

## 8. Cross-organisation design matrix

| Organisation | Mechanism to model | What not to model |
|---|---|---|
| COMECON | Planned trade, specialization agreements, Soviet energy/material dependencies, bilateral bargaining | A frictionless customs union or uniform member dependence |
| NAM / G77 | Issue-based voting coordination, agenda-setting, NIEO bargaining leverage | A permanent military bloc or unanimous voting discipline |
| Arab League | CBO blacklist, primary/secondary/tertiary boycott, member-specific enforcement | Automatic identical enforcement by all members |
| OAU | Liberation Committee aid, diplomacy, sanctions advocacy and legitimacy pressure | Guaranteed independence or automatic military intervention |
| ASEAN / AFTA | TAC non-interference/consultation; phased CEPT tariff reductions and exclusions | A customs union or immediate zero tariffs on every product |
| OAS | Consultations, resolutions, mediation, participation suspension/repeal | Supranational government; automatic re-entry after repeal |
| EFTA | Industrial tariff phase-out and bilateral EEC free-trade access | Common external tariff or customs union |

## 9. Quantitative implementation cautions

- Use the COMECON trade figures as **benchmarks**, not as a complete annual panel. The source literature warns that socialist trade valuation, clearing currencies, price conventions and statistical coverage impede direct comparisons.
- The NAM affinity index is a **research statistic**. It must not be used as a literal vote-agreement percentage without reproducing the study's method and vote sample.
- No robust, comparable aggregate economic-loss estimate for the Arab League boycott is asserted here. Enforcement differed by member and period.
- OAU aid should be linked to specific liberation movements and time windows; do not assume identical support for every insurgency.
- AFTA and EFTA tariff schedules were product-specific and phased. A single flat tariff modifier would overstate the precision of the evidence.

## 10. Source register and reuse

This document links to official organization/UN/government records, declassified or government research, and academic historical work. Reuse must follow each source's terms. It contains paraphrased research summaries, not copied Paradox material. The numerical COMECON table and NAM affinity values are reproduced as attributed research benchmarks; verify the underlying source tables before using them as calibration targets.

**Promotion gate:** Claude should independently verify the numerical tables and decide which mechanisms can be mapped to existing engine systems. This document does not authorize runtime modifiers, treaty effects, tariff values or changes to the engine's law enums.
