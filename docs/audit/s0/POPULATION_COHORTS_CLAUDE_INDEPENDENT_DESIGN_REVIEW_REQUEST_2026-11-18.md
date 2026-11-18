# Population Cohorts — Claude Independent Design Review Request

**Project:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Review branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent technical design review, no-write  
**Request date:** 2026-11-18  
**Status:** `READY_FOR_INDEPENDENT_REVIEW`  
**Product/runtime authorization:** `NONE`

## 1. Exact review target

Review only the design proposal and its consistency with the frozen runtime baseline and owner-approved roadmap:

- **Design proposal:** `docs/spec/POPULATION_COHORTS_DATA_MODEL_PROPOSAL_VI.md`
- **Design revision commit:** `b35c5367cfe41bea3036bec2b846d19060f495c0`
- **Previous proposal commit:** `c58d5e6bc6a1a5206bdc67687cb32203bcef11d9`
- **Product/code baseline to inspect:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Coordination baseline before this review packet:** `6b2c5ad219278aa4085a314d9285ef89ad3312b2`
- **Primary roadmap:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, as amended by the owner-approved v3.3 decisions and current handoff.
- **Current phase status:** S1 `NOT_STARTED`; S0-B7 independent review and owner acceptance remain pending.

Fetch the exact latest branch HEAD before reviewing. Confirm the proposal still matches the reviewed revision commit. The proposal revision from `6b2c5ad` to `b35c536` is intended to change only the design document; verify this using the GitHub compare view. Later review-packet/handoff-only commits are coordination records, not changes to the design target.

## 2. Independence and no-write requirements

Claude must be an independent reviewer and must not have authored or edited the proposal under review. This review is **no-write**:

- Do not edit the proposal, runtime, historical data, tests, workflows, UI, assets, Android files, save implementation or roadmap.
- Do not create a fix commit, branch or PR.
- Do not implement any part of S1/S6.
- If the proposal requires changes, report them with exact section/line locators and return `CHANGES_REQUESTED`; wait for a separately scoped correction task.

A ChatGPT self-audit or this review request is not an independent review verdict.

## 3. Required technical review

### A. Accuracy of current-state characterization

Re-read the exact code baseline, particularly:

- `src/engine/types.ts`: `Region`, `GameState`, strata and save-relevant state contracts.
- `src/engine/init.ts`: `strataFor()`, `createGame()`, population/culture/religion initialization.
- `src/engine/systems/population.ts`: `populationMonth()`, `shiftStrata()`, migration and aggregate updates.
- `src/engine/systems/economy.ts`: labor approximation, production and current building interactions.
- `src/engine/save.ts`: envelope, accepted versions and current migration behavior.
- `src/engine/data/dbTypes.ts` and relevant population historical data inputs.

Confirm every stated limitation is true at the cited baseline. Flag any incorrect or overstated claim.

### B. Cohort identity and data invariants

Review sections 4.2–4.4, including the revision in `b35c536`:

1. Is the canonical tuple sufficient to prevent identity collision and duplicate cohort rows?
2. Is it correct that age distribution is represented by `ageCounts`, rather than being part of the cohort identity key?
3. Are `size` and age counts adequately constrained as non-negative safe integers, with exact mass preservation on split, merge and migration?
4. Are unknown culture/religion/occupation/qualification represented without inventing historical precision? In particular, does `religionId = null` remain distinct from an explicit unaffiliated/no-religion category?
5. Does the document correctly explain that the composite cohort key changes when its identity dimensions change, and prohibit unsafe durable foreign keys to it?
6. Are the weighted-merge rules implementable and deterministic? What provenance/quality representation is still missing for cohorts originating from multiple seeds or methods?
7. Are the mutable cohort fields, optional fields, static definitions and read-model projections sufficiently specified for a future data contract without prematurely over-designing it?

### C. Historical fidelity and source quality

- Does the design avoid deriving occupation, age, literacy, wealth, religion or culture composition from population totals alone?
- Are unknown, estimated, supported and verified data handled without false precision?
- Does it preserve the distinction between geographic population, population under effective control and polity population?
- Does the same 1836 population snapshot and simulation pipeline apply to Historical and Sandbox, without deterministic railroading after the start date?
- Are slavery, serfdom, rights and non-European polity contexts treated as source-backed contextual rules rather than one global heuristic?

### D. Save/schema, determinism and failure safety

- Is the proposed S1-first migration boundary consistent with the approved roadmap and current S0-B7 gates?
- Is v1 → next-schema migration deterministic, pure and non-destructive, including RNG/state preservation and unknown-version rejection?
- Does the proposal avoid inventing `religion2` for legacy saves where runtime never stored it?
- Are backup/rollback and exact save-load continuation requirements adequate?
- Are split/merge, remainder allocation, tie-break, migration routing and iteration order deterministic?

### E. Scope and sequence

Confirm the proposal respects the roadmap order and does not claim that:
- S6 has real building hiring, firing or wages (those belong to S12);
- S6 has market clearing or material needs satisfaction before S7;
- S10/S11 production systems are already authorized or implemented;
- this design review opens S1 or any runtime implementation.

### F. Performance and acceptance-test coverage

Assess whether the proposed benchmarks cover real 662-region and seeded cohort scale, monthly p95/p99, initialization, save/load size, memory growth and Android constraints. Identify missing stress cases, especially multi-decade runs, cohort churn, migration and save/load continuation.

## 4. Required response format

Return exactly one verdict:

- `REVIEW_PASS` — technically coherent as a design proposal, with no blocking or required design changes.
- `CHANGES_REQUESTED` — one or more material design corrections are required.
- `BLOCKED` — target/baseline/evidence cannot be verified or reviewer independence is not satisfied.

Then provide:

1. Exact reviewed branch HEAD and proposal commit/blob identity.
2. Verdict and a brief rationale.
3. Findings ordered by severity (`P0/P1/P2/P3`), each with exact section/line locator, evidence, consequence and required correction.
4. Any non-blocking recommendations separately from required changes.
5. Explicit confirmation that no files were modified.

Do not use `APPROVED`, `ACCEPTED` or `S1_READY` as a substitute for the verdict.

## 5. Gate boundary

Even a `REVIEW_PASS` applies only to this technical design document. It does **not**:

- satisfy the separate independent review of S0-B7;
- constitute project-owner acceptance of R7, EX-G07-01, EX-G08-01 or the bounded S1-entry proposal;
- declare overall S0 `PASS`;
- open S1, S6 or any implementation phase;
- authorize changes to engine code, save schema, historical data, tests, assets, UI, workflows, Android packaging or APKs.

S1 remains `NOT_STARTED` until the complete S0-B7 package receives an independent `REVIEW_PASS`, the project owner records the required `ACCEPTED` decisions and exact scope, and the owner separately authorizes the phase transition.
