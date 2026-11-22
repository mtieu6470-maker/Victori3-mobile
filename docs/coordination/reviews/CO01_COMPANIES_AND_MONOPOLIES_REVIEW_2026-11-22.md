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
