# Independent review — CATCHUP-01: prevent an unconditional latecomer buff

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Commit reviewed:** `f52530cb489f0682b24a93f73a3433e7f514cb99`  
**Scope:** `src/engine/systems/technology.ts`, `src/engine/ai/ai.ts`, `tools/growth-report.ts`, `tests/benchmark-data.test.ts`  
**Disposition:** **REQUEST CHANGES — do not accept CATCHUP-01 as calibrated/gameplay-ready yet.** No gameplay coefficients were changed by this review.

## Executive finding

The intended design is sound in principle: a follower should be able to adopt mature, already-diffused technology at lower cost than a pioneer pays to discover it. It must not receive a direct GDP, output, TFP, population or research-points bonus just because it is poor, behind, or late to the timeline.

The current implementation does not yet enforce that distinction. The technology cost equation applies a calendar-age discount even when no country has the technology, and then compounds it with a very large world-share discount. The law emulation bonus is based on global prevalence and array ordering rather than a validated, law-specific model of adoption. These can make convergence automatic rather than earned through access, institutions, domestic support and investment.

## Findings

### CATCHUP-01-P1 — Technology age alone reduces cost, even when no country knows the technology

**Location:** `src/engine/systems/technology.ts:29-31`.

Current code:

```ts
const diffusion = 1 - TECH_DIFFUSION_DISCOUNT * Math.sqrt(known);
const maturity = 1 / (1 + Math.max(0, year - t.historical_year) / TECH_MATURITY_YEARS);
return t.cost * era * diffusion * maturity * 1000;
```

If `knownShare === 0`, then `diffusion === 1`, but `maturity` still cuts the cost based only on calendar age. A 90-year-old technology costs about 14.3% of its base cost even when no country owns/knows it. At 180 years, it costs about 7.7%. Therefore a technology can become almost free without any actual diffusion or knowledge source. The maturity factor also has no lower bound.

When all sampled states know a technology, the diffusion factor is already 0.15 at the declared 0.85 coefficient. At 180 years old, the combined multiplier is about 0.011, or roughly 1.1% of the base technology cost before the era term. This is an extreme discount, not a modest follower advantage.

**Required change:** maturity may enable/scale a bounded imitation discount, but it must not discount a technology by itself. With no eligible source of knowledge, no imitation discount should apply. Cap the total reduction at a conservative ceiling (recommend starting no higher than 35–40%, pending scenario tests); do not retain an unbounded calendar-age denominator. Pioneer discovery and follower adoption should have distinct costs or modes if the engine needs both.

### CATCHUP-01-P1 — Global equal-country `knownShare` grants free riders without contact or access

**Location:** `src/engine/systems/technology.ts:65-71` (current share cache and `knownShare`).

The current share divides the count of living, non-decentralized countries that know a technology by the number of living, non-decentralized countries. It does not test trade access, adjacency, diplomatic ties, universities, migration, imperial/colonial links, market participation or any other plausible channel of knowledge transfer. It also weights a tiny state exactly the same as a large state. One small country's adoption changes the price signal for every isolated state on the map.

**Required change:** use an explicit knowledge-access/exposure model. If a full contact network is not ready, describe the global share as a temporary abstraction, apply a low bounded weight, and prevent the age term from granting discounts to countries with no knowledge exposure. Add tests for isolated states and unequal state sizes.

### CATCHUP-01-P1 — “Progressive” law is defined by array position and emulation is global

**Location:** `src/engine/ai/ai.ts:190, 194-201, 218, 228`.

Current logic defines `progressive` as whether the target law appears later than the current law in `LAW_ALTERNATIVES[g]`, then adds:

```ts
if (progressive) u += LAW_EMULATION * Math.max(0, lawShare(st, g, v) - 0.3);
```

This is not a semantic definition of progress. Economic/trade/army/legal systems are not necessarily a single universally ordered ladder. At `LAW_EMULATION = 1.2`, a globally prevalent alternative can receive as much as +0.84 utility. `lawShare` also treats all sovereign centralized states equally and does not represent whether the target country could observe or import that institutional model.

This is not a direct GDP buff, but it can cause premature policy convergence; policy effects (education, labour rules, taxes, political participation) can then indirectly alter growth without a domestic institutional basis.

**Required change:** replace array-index ordering with an explicit per-law transition classification or directed transition graph. Make emulation a small, bounded influence only when a credible contact/transfer channel exists. Domestic interest-group support, legitimacy, administrative capacity, fiscal cost and political conflict must remain decisive; foreign prevalence must never bypass `startReform` validation.

### CATCHUP-01-P2 — No dedicated regression tests or verifiable CI result for the new mechanic

**Location:** `tests/benchmark-data.test.ts` and commit `f52530c`.

The new test file checks extract checksums/row counts, source metadata and four MPD anchor values. It does not test CATCHUP-01. The commit's changed-file list includes no dedicated catch-up tests, and the GitHub commit status/workflow-run queries returned no check runs for this commit at review time. The commit message itself describes validation as still running.

**Required tests before acceptance:**

1. `knownShare = 0`: old calendar age alone must not lower adoption/research cost.
2. Mature technology with actual eligible exposure: discount is positive but never exceeds the declared cap.
3. Isolated or no-trade country: does not receive the same discount as a connected adopter.
4. Tiny state adoption cannot move the global discount as much as a major industrial economy unless population weighting is explicitly intended.
5. A low-literacy/low-university country does not research through the tree merely because its GDPpc is low or its competitors already know mature technologies.
6. No direct GDP/outputReal/TFP/population/researchPoints multiplier is applied based on relative GDPpc, rank or lateness.
7. Law emulation cannot turn a law with inadequate domestic support/legitimacy/capacity into an automatic reform; test each law group's transition map rather than array ordering.
8. Historical and Sandbox long-run tests report research counts, tech adoption timing, reform frequency, population and GDPpc by country at 1850/1900/1913/1950/1980/2000/2022, including at least one isolated and one small state.

## Recommended design boundary

- A follower advantage is a **conditional cost reduction for adopting mature knowledge**, not an unconditional national growth multiplier.
- It should require a credible source of knowledge and a domestic ability to absorb it (literacy, education, universities, institutions, market/transport links).
- It must not erase frontier advantages: pioneering remains more expensive and can still provide a temporary lead.
- It must not grant free TFP, GDP, population, production or research points because a country starts poor.
- Political emulation is separate from technology diffusion. The target country's coalitions and constraints determine whether it can reform; foreign examples can influence preferences, not replace the domestic process.
- Keep coefficients provisional until the same seeds are run with/without CATCHUP-01 and the full 1836–2022 scorecard is attached. The source data alone do not calibrate these coefficients.

## Benchmark-data review note

The data extract commit is useful and its provenance controls are appropriate. The data now support a 1950/1980/2000/2022 MPD2023 GDPpc panel and an 1850/1900/1950/1980/2000/2020 OWID population panel, with explicit territory caveats. Historical CBR/CDR before 1960 remain a mixed-source anchor set, not a balanced country panel. The updated CG-29 memo and CSV list the missing observations rather than fabricate them.

**Russia/USSR correction:** MPD `SUN` represents former-USSR territory; it is not the Russian Empire. MPD `RUS` is the Russian Federation series. For the engine's Russian Empire in 1870–1913, acquire an empire-boundary benchmark or mark it unscored.

## Requested handoff to Claude

Please revise the CATCHUP-01 formula and law-emulation classification against the findings above, add the scenario tests, rerun the full regression suite and growth report through 2022, and attach the actual result JSON/commands. Keep the changes on `ccr-b27f3fb8-epfpd6`; do not merge to the official branch before the review is clear.
