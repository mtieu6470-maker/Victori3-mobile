# CG-02 — Pops, needs, wealth and Standard of Living

Research date: 2026-11-22. Confidence: direct public descriptions are verified; exact numeric formulas not published in the sources collected here remain unknown.

## Pop as a social-economic cohort

A Pop is not merely a population total. The simulation needs cohort-level location/state, size, profession, culture, religion, wealth, literacy/education, employment, needs/consumption and political state. Historical missing values must remain unknown, not silently become zero or an invented identity.

Dev Diary #74 describes the population overview as showing who Pops are, how many there are, how much money they make, what they spend it on and how spending changes SoL: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-74-ux-improvements

## Needs and shortages

Pops consume goods through needs packages. The cost of fulfilling needs depends on required quantities, market prices and actual availability. A shortage is not equivalent to a high price. Dev Diary #131 explicitly explains the old design problem: Pop Needs previously had no shortages, and the food price cap (+75% in that historical implementation) meant food was treated as available even when expensive. Famine/shortage changes were intended to represent availability more realistically.

Source: Dev Diary #131, 2024-10-10: https://store.steampowered.com/news/posts/?enddate=1728568967&feed=steam_community_announcements

**Do not assume** the old +75% cap is a universal 1.15.1 price bound. Exact current needs formula and substitution weights are unknown in this source pass. Substitution should only occur among explicitly compatible goods and must be availability-constrained.

## Wealth and SoL

Wealth represents economic resources/purchasing capacity; SoL is a broader living-standard measure. Income, needs cost, taxes, goods availability and social conditions affect it. Exact mapping from wealth level to SoL and the complete 1.15.1 formula remain unknown; do not fabricate a conversion table.

Patch 1.9.6 says consuming Prestige Goods increases Pop SoL according to the share of the value of their buy package represented by Prestige Goods: https://store.steampowered.com/news/posts/?enddate=1752152993&feed=steam_community_announcements (verified for this specific effect).

## Employment, wages and qualifications

Production Methods define building functions, inputs, outputs and required employee types. Buildings adjust wages over time to pursue full employment at minimal wage cost, but avoid wage increases that would make them run at a deficit. As employment rises, throughput rises, increasing input consumption and output. This creates a causal relationship between job openings, qualification, wage, throughput, profitability and market demand.

Sources:
- Dev Diary #5, Production Methods: https://store.steampowered.com/news/posts/?enddate=1624550641&feed=steam_community_announcements
- Dev Diary #47, Conversion and Assimilation: https://store.steampowered.com/news/posts/?enddate=1652976562&feed=steam_community_announcements
- Dev Diary #74: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-74-ux-improvements

DD#47 describes the earlier discrimination model affecting political strength, wages, qualification access, radicalism and turmoil. Later updates moved toward Acceptance (0–100), so do not implement the old binary discrimination model as the current 1.15 state.

## Radicalism, loyalism and migration

Low War Support in 1.15 can radicalize Pops. Other exact radical/loyalist formulas and migration attraction formulas are not confirmed in this research slice. 1.15 adds Cossack Hosts, which can provide migration attraction and policing services; that is a concrete building effect, not a complete migration formula.

Source: Update 1.15 / Dev Diary #196: https://steamdb.info/patchnotes/26453692/

## Suggested data contract

PopCohort: stable id, state, size, profession, culture?, religion?, wealth?, literacy?, acceptance?, employment state, data quality.
PopNeedsProfile: need category, requested quantity, fulfilled quantity, shortage quantity, weighted cost.
IncomeLedger: wages, dividends, welfare, transfers, taxes and other income.
ConsumptionLedger: good, requested, purchased, substituted, unmet and price paid.
PoliticalState: IG weights, political strength, radicals, loyalists, movements and grievances.
MigrationFlow: origin, destination, cohort, amount, reason, attraction components and travel duration.

## Open questions / conflicts

- Exact 1.15.1 SoL formula, wealth thresholds and needs packages by class: unknown.
- Exact radical/loyalist change and migration attraction formulas: unknown.
- DD#47 is historical design context, not current Acceptance specification.
- Missing historical data must remain unknown.

## Recommended acceptance tests

1. PM changes job mix and qualification requirements.
2. Wage decrease plus needs price increase affects disposable income/SoL.
3. Shortage creates unmet needs and starvation consequences, not just infinite price escalation.
4. Substitution only selects compatible available goods.
5. Acceptance/law effects are separate from old binary discrimination.
6. Migration preserves population except explicitly ledgered births/deaths.
7. Radical/loyalist changes expose cause breakdown.
8. Save/load preserves cohorts, needs, migration queues and RNG state.
