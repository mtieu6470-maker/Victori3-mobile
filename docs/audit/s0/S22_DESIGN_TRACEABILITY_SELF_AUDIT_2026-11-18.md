# S22 Design Traceability — ChatGPT Technical Self-Audit

**Date:** 2026-11-18  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Source-code audit baseline:** `a99b5712ea7f40fb6ca9bbe1d326abf39edb2ef3`  
**Code baseline under review:** `e4924ca48264f8d0818eface51a28a87cd363b89`  
**Current amended design blob at this audit pass:** `ccdf34b846ce660808fa2d677f81cd48af8cbe70`  
**Code self-audit file blob:** `95a3d46cf555fadcd6bb5a9b3f5f61aae61ad264`  
**Review class:** `CHATGPT_SELF_AUDIT_ONLY`  
**Runtime/data/save/test/UI/Android authorization:** `NONE`

> This report maps the code-baseline findings to the current S22 design. It is a technical self-audit, not an independent Claude verdict, not owner acceptance and not permission to start implementation.

## 1. Executive result

The S22 proposal now includes explicit design responses for all twelve findings recorded in the code-baseline self-audit (SA-01–SA-12). This means **design coverage has been added**, not that the runtime defects have been fixed or independently approved.

The main additions in §§14.1–14.12 now cover:
- deterministic rank semantics, bounded decision priors and player-choice validation;
- regional-versus-global calibration boundaries and provisional milestone scoring;
- source-date precision and the Historical/Sandbox hazard contract;
- structural-rule execution and closed schemas for executable event data;
- condition/effect validation, event provenance, deterministic RNG streams and mobile performance measurement.

S22 remains design-only. S1's save/data foundations and the approved project gates remain prerequisites.

## 2. Finding-to-design traceability

| Finding | Current design response | Self-audit disposition |
|---|---|---|
| SA-01 — `rank_at_most` always succeeds | §14.1 defines the canonical `powerScore` ranking context, eligible actor set, competition rank, ties and fail-closed missing data. | **DESIGN-COVERED** |
| SA-02 — AI choice is historical-weight dominated | §14.11 makes current-state utility primary and proposes a maximum historical prior of 0.05 on normalized `[0,1]` utility. | **DESIGN-COVERED; 0.05 CEILING REQUIRES REVIEW/OWNER APPROVAL** |
| SA-03 — stale/invalid player decision can be consumed | §14.4 requires command-boundary definition/actor/option/date/precondition validation and atomic commit before resolving/firing. | **DESIGN-COVERED** |
| SA-04 — open effect records and `ig_approval` no-op | §§4.3 and 14.10 require a closed typed effect registry, validate-stage-commit and explicit rejection or approved semantics for unsupported no-op effects. | **DESIGN-COVERED; EFFECT HANDLERS NOT IMPLEMENTED** |
| SA-05 — compiled benchmarks lose measurement semantics | §§6.2–6.4 and 14.10 require source locator, unit, scope, method, uncertainty, quality, normalized source refs and explicit missingness in compiled records. | **DESIGN-COVERED** |
| SA-06 — narrow metrics omit decentralized actors | §§6.1, 6.3 and 7.1 require dimension-separated coverage by region and polity type, including decentralized/non-state actors and denominators. | **DESIGN-COVERED; SOURCE COVERAGE STILL REQUIRES RESEARCH** |
| SA-07 — Europe-specific predicate risks global scoring | §14.2 restricts the African-partition indicator to its named regional report and prohibits using it as a global actor class. | **DESIGN-COVERED** |
| SA-08 — day precision collapses to month | §14.5 preserves recorded source date/precision separately from deterministic monthly effective time and log wording. | **DESIGN-COVERED** |
| SA-09 — pending milestones are penalized during grace | §14.3 excludes pending milestones from both resolved-score numerator and denominator until achieved or missed; zero resolved records yield `NOT_SCORABLE`. | **DESIGN-COVERED** |
| SA-10 — open condition grammar and incomplete recursive validation | §14.7 defines the closed condition grammar, recursive validation, field/reference checks, path diagnostics and 8-level/64-node initial limits. | **DESIGN-COVERED; CONDITION INVENTORY/BOUNDS NEED INDEPENDENT CHECK** |
| SA-11 — structural-rule source is not the runtime source of truth | §14.9 defines a typed structural-rule registry and requires either actual data-driven execution or explicit reference-only status; removes duplicate hard-coded semantics as an authorized migration concern. | **DESIGN-COVERED; EXISTING RUNTIME STILL HARDCODED** |
| SA-12 — executable event payloads are weakly validated/typed | §14.10 closes decision/effect/exogenous/structural/milestone schemas, validates IDs/ranges/dates and retains normalized source metadata. | **DESIGN-COVERED; BUILDER/RUNTIME VALIDATION NOT IMPLEMENTED** |

## 3. Material design decisions requiring independent scrutiny

These items are explicit proposals, not historical facts or already accepted implementation decisions:

### 3.1 Historical-prior ceiling

§14.11 proposes a maximum historical prior of 0.05 absolute points on normalized current utility. This is a guardrail to prevent historical weight from overriding a materially better present-state option. It must be tested through sensitivity and multi-seed distributions; Claude should challenge the chosen normalization and ceiling. The project owner must approve the final balance before implementation.

### 3.2 Event classification and mode behavior

§14.8 separates physical forcing, biological hazard introduction, human-mediated discovery and social/economic consequences. The classification of each of the nine current records is a research hypothesis to verify against sources, not final accepted content. Hydrogen's evidence package should substantiate origin/date/scope/causal interpretation before a source record is migrated.

### 3.3 Structural-rule source of truth

§14.9 requires one executable source of truth for structural constraints. A migration must not remove the existing Salic behavior until the registry and test coverage are approved. If the data rule remains descriptive only, it must be labelled as such and must not be presented as an active runtime rule.

### 3.4 RNG and save migration

§14.12 proposes stable subsystem/event random streams to prevent adding an unrelated event from perturbing all later random outcomes. This changes save-state requirements and belongs behind S1 data/save foundation and migration gates. It is not an isolated S22 patch.

### 3.5 Condition and effect schema limits

§14.7's depth 8 / 64-node expression limit is an initial resource bound, not a proven optimum. The validator must record the exact path/type of errors. §14.10's effect inventory must be reconciled against every current source payload before a closed union is written; in particular, unsupported `ig_approval` cannot be silently accepted.

## 4. Required verification matrix before any runtime authorization

| Area | Required proof | Gate |
|---|---|---|
| Conditions/ranking | True/false tests for every supported condition, all/any recursion, rank ties/missing actors, malformed payload rejection | Data build + unit tests |
| Decision lifecycle | Expiry/invalidation/invalid option/authority change/save-load/failed effect transaction/idempotency | Command + integration + save tests |
| Effects/structural rules | Every current effect and structural rule typed, targets validated, no partial mutation, no duplicate hard-coded handler | Data builder + transaction tests |
| Historical/Sandbox | Same 1836 state and shared systems; no fixed post-divergence political outcome; explicit hazard policy per event class | Cross-mode integration tests |
| Date precision | Exact source day retained, monthly effective tick and log display deterministic | Calendar/event tests |
| Milestones/calibration | Pending/grace semantics, resolved denominator, NOT_SCORABLE, dimension-level uncertainty | Metrics tests |
| Benchmarks/global coverage | Units/source/scope/uncertainty/crosswalk, 12-region and polity-class coverage, missingness/holdouts | ETL + calibration validation |
| Determinism | Same seed/commands/data version/save yields exact replay; unrelated event insertion does not perturb unrelated streams | RNG/save replay tests |
| Performance | Full 100-year scenario, worst-case event density, p50/p95 step time/heap/GC/thermal profile | CI + Android device profile |

No test in this matrix is claimed as run by this documentation pass.

## 5. Current audit conclusion

- SA-01–SA-12 have corresponding design clauses in the amended S22 proposal.
- This is **not** evidence that any source-code defect has been fixed.
- Existing `evalCondition`, `applyWindowOption`, `eventsMonth`, milestone scoring, benchmark ETL and save version remain as characterized in the code-baseline audit.
- The code findings remain open until an owner-authorized implementation is written, tested and independently reviewed.
- Historical event classes and global benchmark coverage still require source-backed research; the design does not manufacture missing data.
- No engine, historical data, generated DB, save schema, tests, UI, assets, Android, workflow, signing or APK file was changed in this pass.
- No build, unit test, CI workflow or device test was run.
- This is not `REVIEW_PASS`, `ACCEPTED`, S1 entry or S22 implementation approval.

