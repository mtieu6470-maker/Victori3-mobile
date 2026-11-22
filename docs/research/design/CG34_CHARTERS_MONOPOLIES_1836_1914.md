# CG-34 — Hiến chương, độc quyền và nhượng quyền 1836–1914

Companion dataset: CG34_CHARTERS_MONOPOLIES_1836_1914.csv. This register separates exclusive corporate charters, state fiscal monopolies, colonial extraction systems, infrastructure concessions, and privatization. They are not interchangeable.

## Findings

### EIC: Bengal salt and opium
- Bengal salt monopoly dates to 1772. A major institutional change occurred in 1836, but academic research dates final abolition to 1863. It must not be coded as ending in 1858. High prices were maintained by strict supply control; salt became the Company's second-largest revenue source, but no numeric markup was verified.
- EIC opium trade control is documented from 1761/1765; Hastings moved control to the Company in 1773. Regulation VI of 1799 required specified cultivation, advance payments, quantities and fixed delivery prices. EIC rule ended in 1858, but this did not end the successor colonial state's opium system. Do not use 1858 as the commodity monopoly end date.
- The EIC's India trade monopoly ended in 1813; its remaining China/tea monopoly ended in 1833. These are clear examples of statutory opening of a chartered trade.

### NHM and Cultivation System
NHM was founded in 1824 and functioned as a privileged state-backed trading/marketing channel within the Cultivation System (1830–1870). The system involved colonial coercion and government control of cultivation/delivery; it was not simply a private NHM monopoly on every crop. Dutch batig slot remittances are documented qualitatively, but no NHM-specific markup or defensible aggregate is inserted. The Cultivation System ended in 1870; NHM survived.

### HBC and Russian-American Company
- HBC's 1670 charter granted exclusive commercial and settlement rights in Rupert's Land. Transfer to Canada took effect in 1870. Terms included £300,000 compensation and land rights. Those are one-off transfer terms, not annual monopoly profit. HBC continued as a trading company.
- Russian-American Company was chartered in 1799 with a trade monopoly and administrative authority in Russian America. The 1867 Alaska transfer ended its territorial administration. No reliable rent or market-share figure was found.

### State salt/tobacco monopolies
- France: gabelle abolished in 1790, restored in 1806, finally abolished in 1945; tobacco trade liberalized in 1791 then state monopoly restored in Dec 1810. SEITA separation in 1926 is outside the game window.
- Italy: Law 13 July 1862 no.710 reserved salt/tobacco production/import/distribution to the state. Tobacco management was outsourced to Regìa cointeressata from 1869; state direct management resumed in 1884. Monopoly persisted through 1914.
- Austria: tobacco sales monopoly permanent from 1783 and continued through the game period.
- Japan: 1898 Leaf Tobacco Monopoly Act; 1904 Tobacco Monopoly Act expanded control to procurement, manufacture and sale. The requested 1904 Japanese salt monopoly is not substantiated by the sources consulted; do not conflate later Japan Tobacco and Salt Public Corporation (1949) with a 1904 salt act.

### Railways and Suez
- France's 1842 law is a public-private railway development framework, not one national monopoly. The 1859 conventions reorganized obligations and concessions; duration and guarantees require line/company-specific records. Do not infer monopoly rents from the existence of a concession.
- Suez: concessions of 1854/1856 gave a 99-year term from opening; Egypt was entitled to 15% of annual net company profits. Canal opened 1869, so scheduled expiry was 1968; nationalization in 1956 superseded it. The 15% is a contractual profit share, not a measured markup.

### Japan's zaibatsu and state enterprise sales
The Meiji state sold many state-founded factories and firms to private buyers in the 1880s–1890s, helping private enterprise and zaibatsu grow. This is privatization/asset transfer, not a monopoly charter. Military and communications firms were exceptions. No aggregate discount or rent figure is inserted.

## Liberalization chronology and game rule

| Jurisdiction | Date | Verified change | Implication |
|---|---:|---|---|
| EIC India trade | 1813 | Charter trade monopoly removed | Revoke only the relevant trade charter |
| EIC China/tea | 1833 | Last China trade monopoly removed | Revoke the specific China/tea privilege |
| Britain | 1846 | Corn Laws repealed | Tariff reform does not revoke unrelated charters |
| Britain | 1849 | Navigation Laws repealed | Maritime protection ends, not all domestic monopolies |
| France | 1790/1806/1945 | Gabelle abolished, restored, finally abolished | Fiscal monopoly can be reinstated |
| France | 1791/1810 | Tobacco liberalized then monopoly restored | Reforms are reversible |
| Italy | 1862/1869/1884 | State monopoly; private management; state management restored | Management change is not monopoly abolition |
| Japan | 1898/1904 | Leaf monopoly then full tobacco monopoly | Monopoly scope may deepen |
| Dutch East Indies | 1870 | Cultivation System ended | Colonial extraction regime ends; NHM survives |
| Rupert's Land | 1870 | HBC territorial rights transferred | Territorial charter ends; corporation survives |
| Russian America | 1867 | Alaska transferred | Colonial administration ends |
| Suez | 1956/1968 | Nationalization / scheduled concession expiry | Outside game period except concession terms |

**Conclusion:** The generic rule “free business automatically revokes all charters” is too broad. Evidence supports narrower triggers: statute explicitly abolishes an exclusive right; sovereignty/territory transfers; concession expires or is bought out; or a reform expressly opens the relevant trade/sector. Free-trade reforms such as tariff or Navigation Act repeal do not automatically cancel unrelated domestic state monopolies, railway concessions, or infrastructure franchises.

## CO-3b / ECON-MONO-01 recommendations
1. Store charterScope/legalBasis separately: trade route, commodity procurement, production, distribution, territorial administration, infrastructure concession, state fiscal monopoly.
2. Replace generic free_business revocation with explicit revocationTrigger IDs: India trade opened 1813; China trade opened 1833; Cultivation System ended 1870; territory transferred 1870; concession expired; state monopoly repealed.
3. Quantify only supported effects: Suez 15% annual net profit entitlement; HBC £300,000 one-off compensation and land rights; Bengal salt high-price supply control but markup unknown; Bengal opium fixed-price procurement but amount unknown; NHM batig slot qualitative; RAC rent unknown.
4. State monopolies should be government-owned/exclusive-license systems, not automatically private corporations receiving dividends.
5. Zaibatsu formation via state asset sales is a privatization event, not a monopoly charter.
6. Railway concessions require company/line-level terms: duration, guarantee, construction subsidy, fare rules, buyback. Do not infer rent from concession existence.

## Evidence limitations
No reliable numeric markup/procurement share was found for Bengal salt/opium, NHM, HBC, RAC, European/Japanese tobacco monopolies, or railway concessions in the sources consulted. The CSV records unknowns rather than fabricated values. EIC rule ending in 1858 is not the same as commodity monopoly ending. Japanese 1904 tobacco monopoly is documented; a corresponding 1904 salt monopoly is not.

## Sources
- UK Parliament EIC: https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/east-india-company-and-raj-1785-1858/
- Royal Museums Greenwich EIC: https://www.rmg.co.uk/collections/research-guides/research-guide-f5-east-india-company
- Cambridge, Bengal opium: https://www.cambridge.org/core/journals/modern-asian-studies/article/poor-mans-crop-evading-opium-monopoly/199D0743201BF76C8ADA72F625B85FAD
- Cambridge, Bengal salt: https://www.cambridge.org/core/journals/international-review-of-social-history/article/environmental-changes-the-emergence-of-a-fuel-market-and-the-working-conditions-of-salt-makers-in-bengal-c-17801845/EFF95B979EA1BC59C12DAFD1E623FB58
- J-STAGE Miki 2002: https://www.jstage.jst.go.jp/article/sehs/68/2/68_KJ00004582558/_article/-char/en
- Cambridge Bosma 2007: https://www.cambridge.org/core/journals/journal-of-southeast-asian-studies/article/abs/cultivation-system-18301870-and-its-private-entrepreneurs-on-colonial-java/68DFABD378129EE7BE39D58FCF181FCE
- Canadian Justice Rupert's Land: https://justice.canada.ca/eng/rp-pr/csj-sjc/constitution/lawreg-loireg/p1t33.html
- US National Archives RAC: https://www.archives.gov/research/guide-fed-records/groups/261.html
- LOC Russian colonization: https://www.loc.gov/collections/meeting-of-frontiers/articles-and-essays/alaska/russian-colonization/
- French Ministry gabelle: https://www.economie.gouv.fr/saef/document-du-mois/la-gabelle-et-les-taxes-sur-le-sel-une-longue-histoire
- French Ministry tobacco: https://www.economie.gouv.fr/saef/service-dexploitation-industrielle-des-tabacs-et-allumettes-seita
- Italian State Archives: https://search.acs.beniculturali.it/OpacACS/guida/IT-ACS-AS0001-0001112
- Tobacco & Salt Museum Japan: https://www.tabashio.jp/collection/tobacco/t21/index.html
- Suez Canal Authority: https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalHistory.aspx
- US State Department Suez concession: https://history.state.gov/historicaldocuments/frus1955-57v16/d1
- Oxford Meiji enterprise sales: https://academic.oup.com/book/57373/chapter/464681087
- UK Parliament free trade: https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/importexport/overview/freetrade/
