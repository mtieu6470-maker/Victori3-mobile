# CG-54 — Multi-article treaties, concessions and company privileges: implementation input

Date: 2026-11-24  
Branch: `ccr-b27f3fb8-epfpd6`  
Status: **DESIGN INPUT v1 — builds on CG-31/32/33/34/38; not a claim that all rights are currently implemented.**

## 1. Core model: treaty is a container, not a boolean

One instrument can contain multiple independently enforceable articles. An article has its own parties, scope, beneficiary, term, obligations, performance evidence, breach rule and remedy. A treaty can be legally in force while one article is suspended or breached.

Recommended object shape (adapt names to the project's TypeScript conventions):

```ts
type TreatyStatus =
  | 'draft' | 'signed' | 'ratified' | 'in_force'
  | 'partially_suspended' | 'breached' | 'denounced'
  | 'expired' | 'superseded' | 'disputed';

type ArticleStatus =
  | 'pending' | 'in_force' | 'complied' | 'breached'
  | 'suspended' | 'terminated' | 'expired';

type PartyRole =
  | 'sovereign_party' | 'protected_state' | 'guarantor'
  | 'company' | 'beneficiary' | 'creditor';

interface Treaty {
  id: string;
  title: string;
  parties: Array<{ entityId: string; role: PartyRole }>;
  signedAt: string;
  effectiveAt?: string;
  ratificationRequired: boolean;
  ratifiedAt?: string;
  status: TreatyStatus;
  articles: TreatyArticle[];
  sourceIds: string[];
  supersedes?: string[];
  createdBy: 'historical_event' | 'diplomatic_play' | 'peace_treaty' | 'manual';
}

interface TreatyArticle {
  id: string;
  type: ArticleType;
  status: ArticleStatus;
  obligor: string;
  obligee: string[];
  beneficiary?: string[];
  scope: {
    regions?: string[];
    ports?: string[];
    corridors?: string[];
    goods?: string[];
    industries?: string[];
    market?: string;
  };
  terms: Record<string, string | number | boolean>;
  startsAt: string;
  expiresAt?: string;
  renewal?: { mode: 'none' | 'automatic' | 'by_consent'; noticeMonths?: number };
  obligations: Array<{ actor: string; action: string; target?: string; condition?: string }>;
  breachTriggers: Array<{ type: string; threshold?: number; graceDays?: number }>;
  remedies: Array<{ type: string; conditions?: string[] }>;
  evidence: Array<{ sourceId: string; locator?: string; note?: string }>;
}
```

Treat this as a conceptual contract. The production schema should use typed discriminated unions rather than an unvalidated `Record` for each article's terms.

## 2. Article taxonomy and minimum terms

| Article type | What it grants / requires | Required fields / checks |
|---|---|---|
| `most_favoured_nation` | partner receives treatment no worse than named comparator | comparator, goods/sector scope, exceptions, effective date |
| `tariff_schedule` | binds tariff ceilings or staged reductions | goods, rate, valuation basis, start/end, safeguard clause |
| `port_access` | access to named port and services | port ID, users, fees, customs, security and duration |
| `transit_right` | passage through corridor/river/rail/road | corridor IDs, eligible cargo, toll basis, inspection and closure rules |
| `treaty_port` | special port regime, possibly customs/jurisdictional privileges | territory owner, legal scope, customs rules, jurisdiction; never imply sovereignty transfer |
| `extraterritorial_jurisdiction` | defined consular/court jurisdiction over nationals | nationality, civil/criminal scope, exceptions, court and termination condition |
| `investment_protection` | protects named investments from specified state actions | covered investor/assets, expropriation definition, compensation formula, exceptions |
| `concession` | time-limited right to build/operate/extract | asset/site, operator, capex, milestones, fees/revenue share, reversion, termination |
| `exclusive_trade` | exclusive rights for named goods/route/territory | monopoly scope, named holder, legal basis, enforcement, expiry, competition review |
| `military_alliance` | consultation and conditional military support | casus foederis, covered attack, geography, consultation, exclusions, term |
| `defense_guarantee` | guarantee of a named state's territorial integrity | guarantor, protected territory, triggering breach, response is political unless automatic clause explicitly exists |
| `neutrality_guarantee` | commitment to respect a state's neutrality | protected state, guarantors, prohibited actions, breach/remedy; breach does not auto-trigger war |
| `military_basing` | access/use of a named base | base/region, permitted units, command, cost, duration, withdrawal |
| `technology_transfer` | licence, equipment, experts, training or know-how | technology, licensor/licensee, IP/use limits, experts, payment, training, term |
| `loan_credit` | principal and disbursement schedule | currency, principal, interest type/rate, maturity, grace, collateral, default |
| `debt_revenue_assignment` | assigns specified public revenue to debt service | revenue stream, percentage/priority, administrator, audit, end condition |
| `reparations_indemnity` | one-time or scheduled compensation | amount/currency, due dates, payer/payee, default remedy |
| `customs_union` | internal tariff removal/common external tariff | members, common schedule, revenue split, exceptions, accession/withdrawal |
| `currency_union` | shared currency/peg/clearing | issuer/anchor, convertibility, reserve rules, lender of last resort, exit |
| `fisheries_resource_access` | extraction rights in defined waters/lands | area, quotas, species/resource, monitoring, local rights, duration |
| `arbitration_dispute` | forum and process for disputes | tribunal, applicable law, standing, interim relief, award enforcement |

Do not collapse port access, basing, treaty-port jurisdiction and territorial cession into one generic "access" field. They have different sovereignty and enforcement implications.

## 3. Duration, renewal and legal lifecycle

Every article must choose one term model:
- **Fixed term:** `startsAt`, `expiresAt`; ends automatically unless renewed.
- **Perpetual until denounced:** no expiry; requires notice period and explicit denunciation.
- **Milestone-bound:** ends when construction, debt repayment or another objective completes.
- **Conditional:** remains active only while the stated condition holds.
- **Emergency/temporary:** short term, explicit review date and maximum extension.

Store treaty status and article status separately. A treaty can be partially suspended. A breach does not erase the article; it changes status and opens remedies. Do not confuse:
- expiry (term naturally ends);
- denunciation (party uses a legal exit clause);
- suspension (temporary non-performance);
- breach (failure to perform);
- supersession (new instrument replaces the old);
- revocation (competent grantor withdraws a privilege under its legal terms).

Use notice periods and grace periods. Never let a monthly tick silently terminate an article without a lifecycle event/log.

## 4. Breach, enforcement and remedies

A breach is an observed failure against an article's obligation, not merely a hostile opinion. Examples:
- tariff exceeds the agreed ceiling after grace period;
- transit/port access is blocked without an exception;
- debt payment misses due date;
- concessionaire fails a construction milestone;
- protected investment is expropriated without the agreed process;
- guarantor violates a defined neutrality/defence commitment.

Remedy ladder (article-specific):
1. notice and cure period;
2. consultation / joint commission;
3. arbitration or inspection;
4. compensation / late fee / indemnity;
5. suspend only the affected article;
6. retaliatory tariff or access restriction if allowed;
7. denounce/terminate under the exit clause;
8. diplomatic play or war as a political choice — never an automatic engine action unless an explicit casus foederis rule requires it.

Enforcement capacity matters: a weak guarantor may be legally obligated but unable to enforce. Store legal obligation and de facto enforcement separately.

## 5. AI acceptance and bargaining

AI evaluates a proposed article bundle as net utility over the treaty term:
- market access / export demand;
- input security and strategic resources;
- port/corridor/naval access;
- military risk reduction;
- investment and technology spillovers;
- fiscal transfer, debt burden and contingent liabilities;
- sovereignty / jurisdiction / domestic legitimacy costs;
- distributional effects on interest groups and firms;
- enforcement credibility and opportunity cost.

Suggested utility scale: -100…+100, explainable component ledger. Accept if total >= +15 and no critical sovereignty red-line is violated. Values are **starting project tuning only**, not V3 data. The AI should:
- reject impossible obligations (missing regions, company, treasury or legal authority);
- price duration and renewal risk;
- value a guarantee less if guarantor cannot project force;
- require compensation for expropriation, debt assumption or exclusive access;
- compare bundles, not sum incompatible promises;
- prefer narrow scope and sunset clauses when uncertainty is high;
- account for domestic veto actors (interest groups, parliament, court, monarch/cabinet) where modeled.

Never accept a promise to transfer property the offeror does not own, to spend funds it does not have, or to grant a right beyond its jurisdiction.

## 6. Company and privilege model

Keep separate records for:
1. **LegalEntity:** registered legal person, jurisdiction, legal form, incorporation/dissolution dates.
2. **CorporateGroup:** parent/subsidiary/controlled entities; group membership can change over time.
3. **Brand:** trade name, not necessarily a legal person.
4. **CompanyOperation:** sites, employees, output, inputs, costs and market sales.
5. **CharterPrivilege:** sovereign grant of a defined privilege, distinct from company formation.
6. **MarketPower:** measured market share/concentration for a good and market; not inferred from a company's fame.
7. **StateEnterprise:** state-owned operator, distinct from a private chartered company.

Right classes must be explicit:
- `CHARTER`: sovereign/statutory privilege, potentially exclusive, with legal basis and jurisdiction.
- `LICENSE`: permission to perform regulated activity, not an exclusive right unless explicitly stated.
- `CONTRACT`: procurement, service, supply, employment or construction agreement.
- `CONCESSION`: time-limited operation/extraction/infrastructure right; may be exclusive only within its stated scope.
- `CAPABILITY`: unlocked ability to operate a business line; no legal privilege implied.

A technology unlock can expose a business capability, but cannot by itself create a charter, monopoly, revenue stream or company. A charter needs a legal basis, grantor, holder, scope, effective date, expiry/revocation conditions and enforcement.

### Company special rights

- exclusive trade: named goods + geography + channel + term + enforcement;
- monopoly of supply: named buyer/market + procurement volume + price formula + review;
- mining/resource concession: deposit/site, extraction limits, royalties, local obligations, environmental/worker costs, reversion;
- railway/port/utility franchise: network/route, service duty, rates, capex milestones, public access and reversion;
- tax/customs farming: revenue source, remittance share, audit, term, anti-corruption safeguards;
- colonial administrative charter: territory and delegated powers; keep political sovereignty separate and model coercion/rights costs;
- patent/licence: invention, term, jurisdiction and royalty; not a market monopoly outside the legal scope.

A company may hold several contracts and licences without holding any charter. A charter can be suspended/revoked while the company continues to exist. A company dissolution must not silently delete outstanding treaty obligations; transfer/novation or default resolution is required.

## 7. Accounting and anti-exploit invariants

- Treaty indemnity is a transfer between treasuries, not a GDP multiplier.
- Loan principal is a liability/asset pair; disbursement increases borrower cash and debt equally, not free GDP.
- Interest is a flow from borrower to creditor; do not count it twice as firm profit and state revenue.
- Concession revenue share is applied to the contractually defined base (gross receipts or net profit); never substitute one for the other.
- Dividends, wages, taxes, royalties and retained earnings must reconcile to company cash flow.
- Market share is calculated from actual sales of a specified good in a specified market and period.
- Charter rights do not spawn buildings, workers, output or treasury.
- Territory access, basing and transit rights do not transfer sovereignty or ownership.
- A treaty's legal status does not prove compliance; track observed compliance separately.
- No automatic monopoly surcharge/price premium without a sourced market-power and demand model; keep ECON-MONO-01 disabled until evidence and engine mechanics exist.

## 8. Historical calibration cases (facts are case-specific)

| Case | What it demonstrates | Do not overgeneralise |
|---|---|---|
| Treaty of Nanking (1842) | five treaty ports, Hong Kong cession, 21m Spanish-dollar indemnity and scheduled payments | one-time indemnity is not a recurring GDP debuff |
| Ansei treaties (Japan, 1858) | treaty ports, tariff constraints, MFN and consular jurisdiction; later revision/abolition of extraterritoriality | do not use a universal tariff rate for every year/commodity |
| Bowring Treaty (Siam–Britain, 1855) | 3% ad valorem import-duty ceiling in the treaty text | ceiling is not actual average tariff paid |
| Cobden–Chevalier (UK–France, 1860) | reciprocal tariff schedules and MFN diffusion | MFN applies within defined treaty terms/exceptions |
| Suez concession (1854/1856) | 99-year concession and 15% of annual net profits to Egypt | profit share is contractual term, not guaranteed realised receipt |
| Berlin General Act (1885) | bounded free-trade/navigation regime in Congo/Niger basins | does not create blanket global free trade |
| Triple Alliance (1882) | conditional defence obligations and fixed initial term | do not auto-enter war without matching casus foederis/decision |
| Ottoman Public Debt Administration (1881) | assigned revenue streams under creditor-supervised administration | do not invent aggregate revenue shares absent primary evidence |
| Sino-Soviet Treaty (1950) + separate credit agreement | defence treaty distinct from credit/railway side agreements | do not merge separate instruments into one article |

Project CG-38 contains the source register and evidence gaps for these cases. Keep the source's currency, unit, legal wording and date.

## 9. Suggested acceptance tests

1. One treaty with three articles can have one article breached and two in force.
2. Expiry of one fixed-term article does not terminate the whole treaty.
3. Denunciation respects notice period and only applies to denouncing party's eligible articles.
4. A breach opens remedy flow but does not declare war automatically.
5. A treaty port grants only named port rights; region ownership remains unchanged.
6. A basing article does not create an alliance unless a separate article says so.
7. A loan creates matching borrower liability and creditor asset; no free money.
8. A concession expires/reverts without deleting the legal company.
9. Company dissolution with live concession/treaty obligations requires novation or default handling.
10. A technology unlock without capital/site/law creates no company and no output.
11. Monopoly/market-power effect stays disabled without a verified share and applicable market scope.
12. Save/load preserves article status, due dates, obligations, breach log and renewal notices.

## 10. Existing project references

- `docs/research/design/CG31_COMPANIES_AND_COMPANY_LAW_VI.md` — legal entities, historical companies and scale evidence.
- `docs/research/design/CG32_COMPANY_MECHANICS_REFERENCE_VI.md` — V3 reference, unlock cautions and anti-exploit rules.
- `docs/research/design/CG33_COMPANY_VALUE_LEDGER_VI.md` and `CG33_ECONOMIC_EFFECT_PARAMETERS.csv` — economic accounting.
- `docs/research/design/CG34_CHARTERS_MONOPOLIES_1836_1914.md` and CSV — charters and monopolies.
- `docs/research/design/CG38_TREATY_ARTICLES_1836_2026.md` and CSV — article taxonomy and historical examples.
- `docs/spec/CO01_COMPANIES_AND_MONOPOLIES_VI.md` — product requirements.
- `docs/research/design/CG49_COLONIAL_EVENTS_REFERENCE.md` — diplomatic pressure and colonial settlement.
- `docs/research/design/CG51_V3_UI_MECHANICS_REFERENCE.md` — V3 mechanics and UI reference.

**Acceptance boundary:** this is a data-contract and design input. Claude must map it to actual engine/save types and implement tests before enabling gameplay. It does not authorize turning on unsupported monopoly pricing or auto-creating charter privileges.
