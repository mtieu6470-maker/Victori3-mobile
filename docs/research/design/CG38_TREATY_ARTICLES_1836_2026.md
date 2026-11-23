# CG-38 — Hiệp ước và điều khoản mô phỏng cho DIPLO-TREATY-01 (1836–2026)

**Status: PARTIAL — mechanism taxonomy and evidence register v1.** This is original comparative research for game-system design, not a reproduction of Victoria 3 text or mechanics. The companion CSV lists 13 treaty/contract examples. Some rows are strong primary-source cases; others are explicitly marked as needing further primary-text verification before they become simulation data.

## 1. Recommended treaty architecture

A treaty should be a container with multiple independently typed articles. Avoid a single boolean “alliance” or “trade treaty”.

Suggested article schema:
- `articleType`: MFN, tariff_schedule, port_access, transit_right, investment_protection, concession, territorial_access, military_alliance, defense_guarantee, neutrality_guarantee, technology_transfer, loan_credit, debt_revenue_assignment, customs_union, extraterritorial_jurisdiction, exclusive_trade.
- `parties`: sovereign parties, protected states, companies, guarantors and third-party beneficiaries as separate roles.
- `scope`: domestic, colonial, port, corridor, river basin, named infrastructure, or global.
- `effectiveDate`, `expiryDate`, `renewalRule`, `noticePeriod`.
- `obligations`: actor, action, target, conditions, reciprocity, enforcement.
- `beneficiary`: which state, firm, bondholders, or nationals receive the right.
- `fiscalTerms`: tariff ceiling, revenue share, loan principal, interest, amortization, fee schedule; keep currency and price basis.
- `breachTriggers`: non-payment, attack, obstruction, unilateral tariff change, expropriation, failure to construct, unauthorized withdrawal.
- `remedies`: renegotiation, arbitration, sanctions, indemnity, suspension, termination, war (never automatic unless specified).
- `legalStatus`: ratified, in force, suspended, breached, denounced, expired, superseded, disputed.
- `deFactoCompliance`: separate from legal status. A signed guarantee does not guarantee compliance.

## 2. Historical article families

### A. Trade access, tariff schedules and MFN
Cobden–Chevalier (UK–France, 1860) is a model for reciprocal tariff reductions and unconditional MFN clauses. The WTO historical analysis describes the treaty as a trigger for a wider network of bilateral commercial agreements. For game purposes, tariff schedules should be item/sector-specific, while MFN propagates the best applicable tariff treatment to a named partner; do not turn it into a universal free-trade law.

### B. Port opening, indemnity and transit duties
Treaty of Nanking (1842) opened five ports, ceded Hong Kong and imposed a 21-million-dollar indemnity, with scheduled payments in 1843–45. Article X required a published tariff and capped transit duties, but the treaty text's blank percentage was later addressed in tariff arrangements. Keep indemnity as a one-time transfer, not recurring GDP loss.

### C. Fixed tariff and extraterritorial jurisdiction
Bowring Treaty (Siam–Britain, 1855) capped import duties at 3% ad valorem and allowed British consular jurisdiction. It also allowed opium imports duty-free but restricted sale to the opium farmer/agents. The 3% is a contractual ceiling, not the realized average effective tariff.

The Ansei treaties (Japan, 1858) included treaty-port access, tariff schedules, MFN and consular jurisdiction. Japan Customs states the 1866 tariff revision forced a uniform 5% ad valorem rate; extraterritoriality ended only after revised treaties took effect in 1899. This is a strong example of sovereignty/fiscal-autonomy constraints with a dated legal exit.

### D. Infrastructure and resource concessions
Suez concession (1854/1856) granted a 99-year operating concession from opening, which occurred in 1869; Egypt was entitled to 15% of annual net profits. This is a contractual profit share, not an observed markup or realized fiscal receipt. Nationalization in 1956 terminated the concession in practice before its scheduled 1968 expiry.

French railway concessions must be modeled at line/company level. The 1842 law and 1859 conventions are a framework, not a single national monopoly contract. Each concession needs its own line, company, term, subsidies, land rights, state guarantees and reversion clauses.

### E. Transit and navigation rights
The Berlin General Act (1885) declared freedom of trade in the Congo basin and equal navigation on the Congo and Niger. Article 13 rejected exclusive navigation privileges; Article 14 prohibited transit tolls except charges equivalent to services rendered. This is a corridor/river-basin rule with multilateral beneficiaries and geographically bounded scope.

### F. Defense, alliance and neutrality guarantee
The Triple Alliance (1882) linked Germany, Austria-Hungary and Italy through conditional military obligations and consultation, with an initial five-year term. The game should represent casus foederis conditions, neutrality options, consultation and no-separate-peace clauses separately.

The 1839 London settlement guaranteed Belgian neutrality. The 1914 German invasion demonstrates that a guarantee can be breached; the engine must not force guarantors to intervene automatically unless the text and actual political choice warrant it.

### G. Technical cooperation and technology transfer
Meiji Japan hired foreign experts under individual contracts from 1870–85 to transfer, install and supervise modern technologies. This was not one treaty: represent it as a bundle of procurement contracts, expert employment, training and licensing articles. The OUP chapter reports roughly 500 Ministry of Industry foreign experts in 1872 and 1875–78 and costs exceeding 50% of the ministry's annual budget in those years. Treat this as a reported fiscal burden, not a permanent universal multiplier.

The 1950 Sino-Soviet treaty lasted 30 years from entry into force and included a defense commitment; separate agreements provided a US$300m credit over five years at 1% and arrangements for restoration of Chinese Changchun Railway, Port Arthur and Dairen. Do not merge the loan agreement into the treaty's defense article.

### H. Loans, debt administration and customs unions
Ottoman Public Debt Administration (1881) shows how a debt settlement can assign specified revenues to creditor-supervised servicing. Before adding fiscal magnitudes, list each assigned revenue source and its share; this register does not invent an aggregate.

Zollverein is a customs-union example: internal customs barriers removed and a common external tariff administered among member states. Model membership/accession, common tariff, revenue-sharing formula, external trade policy and withdrawal separately. Avoid assuming every customs union is a military alliance.

## 3. Design rules

1. **Treaty ≠ single switch.** Each article has its own conditions, scope, beneficiaries, duration and remedy.
2. **Legal and de facto status are separate.** A concession may remain on paper after nationalization; a neutrality guarantee may be violated.
3. **No automatic annexation.** Transit, basing, investment and extraterritorial jurisdiction are not sovereignty transfer.
4. **No automatic war from breach.** Breach opens remedies and diplomatic escalation; the signatories still choose enforcement.
5. **Quantitative terms must be literal.** Use 3% tariff, 5% tariff, 15% net-profit share, 30-year treaty, US$300m at 1%, only in their exact contexts and units.
6. **No inferred macroeconomic effect.** Do not convert tariff clauses or treaty indemnities into GDP multipliers without a separate empirical source.
7. **Companies can be parties/beneficiaries but not sovereigns.** Concession holder, guarantor, sovereign grantor and affected state are distinct entities.
8. **Expiry and denunciation differ.** Some instruments have fixed term and renewal notice; others are perpetual or remain until superseded; still others are contracts with line-specific reversion.

## 4. Sources

- Cobden–Chevalier and 19th-century bilateralism: WTO, Markus Lampe, “Explaining Nineteenth-Century Bilateralism.” https://www.wto.org/english/res_e/publications_e/wtr11_forum_e/wtr11_11jan11_e.htm
- Nanjing Treaty excerpts and indemnity schedule: Columbia University East Asia, primary text. https://afe.easia.columbia.edu/main_pop/ps/ps_china-nanjing.htm
- Bowring Treaty Article VIII: primary treaty transcription. https://en.wikisource.org/wiki/Bowring_Treaty/Treaty
- Japan Customs, history of treaty-port tariff regime and extraterritoriality. https://www.customs.go.jp/english/zeikan/history_e.htm
- Japan MOFA, 1858 treaty and diplomatic documents. https://www.mofa.go.jp/mofaj/annai/honsho/shiryo/archives/pdfs/meiji_joyaku_3_02.pdf
- Suez Canal Authority, 1854 concession, 99 years, 15% net profit share. https://www.suezcanal.gov.eg/English/About/SuezCanal/Pages/CanalHistory.aspx
- US FRUS, definitive Suez concession and 1968 scheduled expiry. https://history.state.gov/historicaldocuments/frus1955-57v16/d1
- Berlin Act, official German Federal Foreign Office summary and primary text. https://archiv.diplo.de/arc-en/the-political-archive/general-act-2684414 ; https://worldjpn.net/documents/texts/docs/18850226.T1EX.html
- Triple Alliance primary text, Article 7 five-year term. https://ctv1ahxtz8fjts3q.search.firstworldwar.com/source/triplealliance.htm
- Meiji foreign experts: OUP, *Capitalism and Entrepreneurship in the Meiji Period*, Public sector chapter. https://academic.oup.com/book/57373/chapter/464681087
- Sino-Soviet treaty: UN Treaty Series registration 3103. https://treaties.un.org/Pages/showDetails.aspx?objid=0800000280147e29
- Sino-Soviet credit and railway agreements: US FRUS 1950, vol. VI, doc.157. https://history.state.gov/historicaldocuments/frus1950v06/d157
- Transit passage modern legal model: UNCLOS Part III, Articles 37–38. https://www.un.org/depts/los/convention_agreements/texts/unclos/part3.htm

## 5. Evidence gaps before full acceptance

- Add full text/source and exact duration/termination for Cobden–Chevalier and Belgian neutrality guarantee.
- Add primary texts for the 1855 Bowring Treaty, 1858 Ansei treaties, 1881 Muharrem Decree and Zollverein customs treaties.
- Add treaty-specific examples for investment protection, railway concessions, basing/territorial access, extradition, arbitration and technology licensing.
- Add post-1945 treaty examples beyond the Sino-Soviet case for transit, investment, mutual defense and customs unions.
- Distinguish treaty text, side agreements, domestic contracts and unilateral concessions; do not label a private employment contract as an international treaty.
