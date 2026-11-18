# H01 R3y — Oyo 1831–1836 political geography and population-unit audit

**Model anchor:** 1836-01-01  
**Status:** RESEARCH_LAYER_UPDATED / REQUEST_CHANGES / NO_NUMERIC_APPROVAL  
**Scope:** documentation and source provenance only. No gameplay, shipped population, ownership, map geometry or runtime changes.

## 1. Executive decision

R3y directly inspected Henry B. Lovejoy's peer-reviewed Historical GIS study, “Mapping Uncertainty: The Collapse of Oyo and the Trans-Atlantic Slave Trade, 1816–1836,” *Journal of Global Slavery* 4(2) (2019), pp.127–161.

The article gives an annual sequence showing that by 1832 Ilorin had overrun much of Oyo's former territory, while by 1833 almost all important Oyo towns had been destroyed or subjected by Ilorin, with Ede protected and only the newly established southern Oyo powers Ijaye, Abemo and Ibadan described as independent. In 1834 and 1835 Oluewu and his allies attempted to recover some former territory. In 1836 the capital district was finally abandoned, refugees moved south, and several new states competed for territorial control, including Abeokuta, Ilorin, Ibadan, New Oyo, Ijaye, Ijebu and Ife.

This is incompatible with treating the entire H01 geographic row “Yorubaland (Oyo / Ibadan / Abeokuta)” as one homogeneous Oyo-controlled territory without a dated control analysis. It is also a warning against treating Oyo's 1836 population profile as a single clear polity-resident stock.

R3y does **not** conclude that the Oyo entity must be deleted, nor does it assign new owners. It concludes that the H01 source package does not establish an exact, defensible 1836-01-01 political owner for every locality within the broad SSA_REG_18 region, and it does not provide reproducible derivations for either 650,000 or 1,450,000.

## 2. Source-method caveats that directly affect the 1836-01-01 anchor

Lovejoy explains that the maps are approximations based on incomplete oral and written evidence, secondary interpretations, and coordinate plotting. He explicitly adopts “fuzzy boundaries” because precise linear borders are often not recoverable. The selected political overlays include separate areas for Oyo, Ilorin, Dahomey, Ijebu, Badagry, Ibadan and Abeokuta; the overlays are not a validated cadastral boundary system.

For the QGIS TimeManager spreadsheet, Lovejoy assigned 2 January as the start of a year and 31 December as its end. He states that these dates/months carry zero historical value and were required only for software operation. The 1836 Oyo table row is therefore a software interval for that year, not evidence that abandonment or New Oyo's establishment occurred on 2 January, or before 1 January. The 1836 row changes the plotted place from Old Oyo to New Oyo, but its day-level timestamp must not be used to resolve the project's 1836-01-01 snapshot.

The article further warns that its maps are not intended as authoritative statements of historical truth. Its 75,000-plus figure is for people involuntarily embarking on Atlantic slave ships from the Bight of Benin between 1816 and 1836. It is not a count of all Oyo residents, all displaced people, or the unknown volume of the internal slave trade. It cannot be used to support the H01 650,000 refugee/polity estimate or the 1,450,000 regional estimate.

## 3. Annual political sequence relevant to the crosswalk

| Year | Lovejoy (2019) account | Consequence for H01 interpretation |
|---|---|---|
| 1831 | End of Majotu's reign and brief Amodu reign; several key Oyo towns abandoned. Forces from Ogodo and Ilorin entered and plundered Oyo; Oyo is described as becoming tributary to Ilorin. A coalition among Ikoyi, Gbogun, Ago Oja and Kanla followed; Kanla and Ikoyi became tributaries to Ilorin. Abeokuta's predominantly Egba and Owu refugees repulsed Ibadan and Ijebu forces near Isheri. | Not a single stable Oyo territorial block. Oyo, Ilorin, Abeokuta/Egba, Ibadan and Ijebu have distinct political trajectories. |
| 1832 | Pro-Oyo forces regrouped at Akese but Ilorin destroyed Gbogun. Ago Oja allied with Ilorin; Saki and Iganna became tributaries to Ilorin. Ilorin overran most of Oyo's Ibarapa province and raided as far south as Abeokuta. | A town that later becomes associated with New Oyo (Ago Oja) is described as allied with Ilorin at this stage; territory and allegiance are changing. |
| 1833 | Amodu was succeeded by Oluewu, identified as the last Alafin of Oyo. Ilorin had destroyed or subjected almost all important Oyo towns, including Ofa, Ikoyi, Gbogun, Saki, Iganna, Akese, Ago Oja and Ogbomoso. Ede was shielded from direct attack; only the newly established southern Oyo powers Ijaye, Abemo and Ibadan are described as independent. | Oyo title/claim and actual territorial control diverged. Southern successor polities cannot automatically be counted as direct Oyo-controlled territory. |
| 1834 | Oluewu sought to reassert Oyo independence with Bariba support; Oyo and Bariba forces recaptured Saki, Igbodo, Iganna, Iseyin and Otefan. | Oyo retained or recovered military capacity in some areas; do not reduce the entire period to a simple instantaneous collapse. |
| 1835 | Oyo's final attempt to regain former territory occurred after the rainy season; Oyo and Bariba forces, with reinforcements from Ede, Ijaye, Abemo and Ibadan, recaptured Ogbomoso. | Allied contingents from distinct southern polities are not proof that those polities were subordinate or that Oyo controlled the wider region. |
| 1836 | The capital district was finally abandoned and refugees moved south from the former metropolitan district. In the ensuing political void, Abeokuta, Ilorin, Ibadan, New Oyo, Ijaye, Ijebu and Ife competed for territorial control. | A broad 1836 Yorubaland region cannot be assigned wholesale to Oyo without locality-by-locality evidence and a precise date convention. |

## 4. Audit against the original H01 source package

### 4.1 OYO profile: 650,000 (400,000–1,000,000)

The source package sets the OYO entity population to 650,000, marks it as an uncertain reconstruction, and gives this method: severe demographic displacement in 1836 as northern Oyo refugees fled south into Ibadan, Ijaye and Abeokuta, citing Law (1977, pp.295–302).

That method names a movement process, but it does not say whether 650,000 means:
- people resident inside a still-functioning Oyo polity on the snapshot date;
- people of Oyo origin displaced from the former metropolitan district;
- refugees distributed among Ibadan, Ijaye, Abeokuta and other settlements;
- the residual population of a reduced political entity; or
- an inclusive combination of these groups.

No roster, demographic table, refugee-flow sum, base-year projection or calculation formula is supplied. Lovejoy (2019) describes the direction and political context of southward refugee movement but provides no total count for all Oyo refugees. The 75,000-plus Atlantic embarkation figure has a different population universe and cannot fill this gap.

**Decision:** 650,000 remains QUARANTINED as an unverified estimate with an undefined population universe. Its interval 400,000–1,000,000 has no demonstrated statistical or scenario methodology. Do not describe it as a census or a verified Oyo polity-resident count.

### 4.2 OYO_OYO regional fact: 1,450,000 (1,100,000–1,900,000)

The source package assigns 1,450,000 to repo region OYO_OYO, named “Yorubaland (Oyo / Ibadan / Abeokuta),” and says it is a regional backward projection anchored to Manning (2014) macro-series and Law (1977, pp.295–302) on 1835–1836 refugee displacement.

No local Manning subregional table, workbook, source-year population, polygon, growth rate, migration adjustment, denominator or interval calculation is supplied. Law's narrative supports conflict and refugee movement, not the 1.45-million regional total. The broad geographic region also spans political units which Lovejoy (2019) describes separately.

**Decision:** 1,450,000 remains QUARANTINED as an unverified broad regional reconstruction. It must not be treated as the direct population of the Oyo polity or as evidence that every locality in the mapped region belonged to Oyo.

### 4.3 The ownership/crosswalk conflict

The original H01 region crosswalk maps 100% of source slot SSA_REG_18 to OYO_OYO with controlling entity OYO. The H01 entity crosswalk separately records Yoruba successor states (Ibadan, Abeokuta, Ijebu, Ilorin) as unmodelled historical polities with different mapped game-region IDs and an umbrella annotation. The region fact's urban-centres note also includes Ilorin.

Lovejoy (2019) distinguishes Oyo, Ilorin, Ibadan, Abeokuta, Ijebu and other powers, describes Ilorin's territorial expansion and the independence of southern Oyo successor states, and identifies a multi-state competition for control in 1836. The current H01 1:1 join is therefore a technical allocation, not proof of historical sovereignty. The current crosswalk is insufficient to justify OYO as the owner of the entire broad region on 1836-01-01.

**Decision:** mark SSA_REG_18 / OYO_OYO as CONTROL_SCOPE_UNRESOLVED / OWNER_ASSIGNMENT_NOT_HISTORICALLY_VALIDATED. No owner reassignment or geometry patch is made in this documentation-only task.

## 5. Required distinctions for future historical data work

1. **Metropolitan Oyo:** Old Oyo / Oyo-Ile and its immediately controlled district.
2. **Residual Oyo authority:** Oluewu's court, surviving chiefs, military formations and areas actually held or temporarily recaptured.
3. **Refugee communities:** Oyo-origin people who relocated to Ibadan, Ijaye, Abeokuta and other towns; residence in a refuge centre does not itself establish Oyo sovereignty.
4. **Successor or independent polities:** Ibadan, Ijaye, Abemo, Abeokuta/Egba, Ijebu, Ife and Ilorin, each requiring separate dated control evidence.
5. **Tributary or allied towns:** e.g. locations Lovejoy records as tributary to Ilorin or allied to Ilorin at specific dates; these statuses must not be collapsed into direct ownership by Oyo.
6. **Broad Yoruba-speaking geography:** cultural/linguistic scope is not the same as one political entity or a direct-rule population.

## 6. R3y disposition and evidence requests

- OYO 650,000 / 400,000–1,000,000: UNVERIFIED_POPULATION_UNIVERSE / QUARANTINED.
- OYO_OYO 1,450,000 / 1,100,000–1,900,000: UNVERIFIED_REGIONAL_DERIVATION / QUARANTINED.
- SSA_REG_18 → OYO_OYO 1:1 assignment: arithmetic join verified previously; historical control and owner scope not verified.
- 1836 New Oyo time stamp: year-level transition only; no day-level claim at 1836-01-01.
- Atlantic embarkations 75,000+: a diaspora/slave-trade measure, not an Oyo population count or refugee total.
- No new population values, interval replacements, owner changes or map edits are approved.

The next evidence needed is: (a) readable Law (1977) pp.295–302 to inspect the original refugee narrative and notes; (b) a transparent derivation for OYO 650,000 and its interval; (c) Manning-derived local workbook and dated polygon for 1,450,000; and (d) a dated locality-level control table separating direct rule, tribute, alliance, refugee settlement, independent rule and contested control.

## 7. Sources and inspection limits

1. Henry B. Lovejoy, “Mapping Uncertainty: The Collapse of Oyo and the Trans-Atlantic Slave Trade, 1816–1836,” *Journal of Global Slavery* 4(2) (2019), pp.127–161, DOI: 10.1163/2405836X-00402002. Open-access PDF text inspected. The PDF screenshot endpoint returned 403, so page images were not visually authenticated. https://brill.com/view/journals/jgs/4/2/article-p127_2.pdf
2. Robin Law, *The Oyo Empire, c.1600–c.1836* (1977), pp.295–302 as referenced by H01 and Lovejoy (2019). The cited pages remain access-restricted in this session. Fulcrum table of contents confirms pp.278–302 lie in Chapter 14, “The Fall of Oyo (c.1823–c.1836).” https://www.fulcrum.org/concern/monographs/1r66j125t?locale=en
3. Henry B. Lovejoy, *Old Oyo Influences on the Transformation of Lucumí Identity in Colonial Cuba* (UCLA PhD dissertation, 2012), printed pp.66–67, inspected in the preceding R3w audit. https://escholarship.org/content/qt5md66554/qt5md66554_noSplash_020fec92701f1f94ff8b27a4c8e33766.pdf
4. Peter Morton-Williams, “The Yoruba Kingdom of Oyo,” in Forde & Kaberry (eds.), *West African Kingdoms in the Nineteenth Century* (1967), printed p.45, inspected in R3w. https://thinkyorubafirst.org/wp-content/uploads/2024/01/West-African-Kingdoms-in-the-Nineteenth-Century-by-Daryll-Forde-P.-M.-Kaberry-z-lib.org_.pdf

**Review status:** ChatGPT research and integration self-audit only, not independent REVIEW_PASS. Claude review and owner acceptance remain pending. No shipped game data or gameplay files changed.
