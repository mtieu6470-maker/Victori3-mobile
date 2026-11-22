# Review CO-01 / ECON-MONO-01 — company, charter and market-power architecture

**Verdict:** ACCEPT AS ARCHITECTURAL DIRECTION; REQUEST CHANGES BEFORE IMPLEMENTATION.

## Accepted
- Separate company actor, charter privileges and market power.
- Staged CO-1 to CO-5 sequence.
- Historical firms spawn based on date and economic conditions, not forced success.
- Ledger invariants are mandatory.
- Monthly/quarterly aggregate accounting suits mobile performance.

## Required changes
### P1 — Legal entity, group and brand differ
Add LegalEntity, CorporateGroup, Brand and PublicEnterprise. Mitsubishi/Mitsui/Sumitomo are group lineages, not unchanged legal persons; brand continuity does not imply legal continuity.

### P1 — Charter, corporate form and monopoly differ
Add CorporateForm (partnership, joint-stock, limited-liability company, statutory corporation), CharterPrivilege (exclusive trade, concession, territorial administration, forced cultivation, franchise), MarketPower and StateFiscalMonopoly. Bengal salt, Java Cultivation System and Congo concession system demonstrate why one generic monopoly flag is wrong.

### P1 — Value-flow ledger
Track farm-gate price, company purchase, freight/storage/auction, export price, consumer price, tax/customs/excise, operating profit, dividends, colonial/state receipt and actual remittance. A wedge cannot be company rent and state tax simultaneously. If matched prices are missing, ratio is null and effect disabled.

### P1 — Legal/time/geography scope
Store issuer, statute/contract, goods, region/market, obligations, start/end and revocation. EIC Bengal vs Malwa differs; HBC lost territory in 1870 but company continued; RNC's charter ended 1899 while trade assets persisted; RAC lost Alaska in 1867.

### P2 — Coercion and externalities
Forced cultivation/concession affects household labour, food security, migration/flight, mortality, unrest and local capital. Never make coercion just a cheap-input throughput modifier.

### P2 — Market-power model per market-good
Company scale is not monopoly. Use share/concentration, elasticity, substitution and entry barriers; distinguish cartel, trust, vertical integration and legal monopoly.

### P2 — Antitrust process
Model investigation, legal standard, court independence, political capture, remedy, appeal and compliance. Sherman Act 1890 did not instantly dissolve all trusts; Standard Oil break-up followed 1911 litigation.

Victoria 3 is a mechanic reference only. Historical names/outcomes require CG-30/31 sources. No gameplay code changed.

## Addendum — review against the exact CO-01 / ECON-MONO-01 source specs

This pass opened both source specifications directly. The following are concrete changes required before implementation, beyond the high-level separation already accepted above.

### CO-01 source spec: Company.kind conflates legal form, ownership and privilege

The current Company type uses kind: 'private'|'chartered'|'state' and nests one optional charter inside the company. That is too coarse:
- a private limited-liability corporation can have no charter;
- a legally ordinary company can receive several concessions in different territories/goods and at different dates;
- a state-owned corporation is not necessarily the state's fiscal monopoly;
- a state-operated monopoly need not be a company at all.

**Required modelling:** keep LegalEntity and CorporateForm separate from one-or-more CharterPrivilege records, Ownership and StateFiscalMonopoly. A single entity may have a time-varying set of privileges; charter revocation must not dissolve the legal entity.

### ECON-MONO-01 source spec: procurementShare × price is not operationally defined

The spec says the producer receives procurementShare × price and the difference is monopoly rent. It does not define which price this is. The existing market price is a supply-demand price index blended with world prices, not necessarily a cash farm-gate price or a counterfactual competitive auction price.

Before coding, define:
- a region/year/good counterfactual competitive farm-gate price;
- the observed/mandated procurement price and quantity under the legal system;
- a matching basis for quality, currency, units, tax and transport;
- the eligible production share actually subject to the charter;
- the accounting recipient of the wedge (private company, colonial treasury, metropolitan treasury or a mixture).

When no matched observations exist, do not apply a generic share to all regional production. Keep the price wedge disabled. The CG-30 dataset currently has no matched procurement/auction price pairs for the major examples.

### GDP versus GNI — critical macroeconomic distinction

A profit or fiscal transfer to the metropole does **not** automatically subtract that value from the colony's territorial GDP. GDP measures production/value added within the territory; ownership income and cross-border remittances affect national income/GNI, disposable income, investment and the destination of savings. The game must keep these ledgers separate.

Therefore:
- record output/value added where it is produced;
- record wage, tax, rent, profit and dividend claims separately;
- transfer only the actual remitted amount across country ledgers;
- allow extraction to reduce local capital formation, household welfare, public services or future productivity only through explicitly modelled mechanisms with evidence/design calibration;
- do not subtract all drain or remittance directly from GDP per capita to force an India-vs-MPD scorecard fit. MPD GDPpc is a GDP benchmark, not a GNI benchmark.

This is essential to avoid improving the colonial benchmark by measuring the wrong macroeconomic aggregate.

### consumerMarkup and market-power layer

The current ECON-MONO-01 spec contains consumerMarkup, and CO-01 proposes a Lerner/Cournot direction. Neither yet specifies demand elasticity, substitution, entry, market definition or concentration denominator. A universal markup is not acceptable. Markups must be per market-good with explicit demand response and competitor entry; state fiscal monopolies and company monopolies must not share one default parameter.

### Exclusivity / export routing

The proposal that exports of the affected good only pass through the metropole and that trade openness to other countries becomes zero is too absolute without case-level evidence. Store actual destinations, licensed buyers, routes, customs/pass systems and exemptions. Bengal Malwa transit duties, Java-NHM marketing, HBC fur routes and RAC Alaska export channels differ; no global “route all exports to metropole” rule.

### Sandbox charter expiry

The current spec allows abolition when the metropole adopts laissez-faire/free trade, a colony gains independence or war changes sovereignty. These are possible triggers, not sufficient historical/legal conditions. Use them as political eligibility signals only; the charter ends when a statutory date, treaty, decision or explicit state action legally revokes it. Sandbox can create alternate law, but the legal event must still be recorded and its consequences simulated.

**Decision remains:** architecture accepted as direction; implementation blocked on ledger definitions, legal scope, demand/market-power equations and tests.
