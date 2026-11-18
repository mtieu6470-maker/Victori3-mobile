# S22 Design Traceability — ChatGPT Self-Audit Supplement

**Date:** 2026-11-18  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Inspected branch HEAD:** `31bf6f22198c086f9db1054ec5091338f742e269`  
**Design:** `docs/spec/HISTORICAL_EVENTS_GLOBAL_CALIBRATION_ARCHITECTURE_PROPOSAL_VI.md`  
**Design blob:** `1951816446ab3df5b800e4ad2c338948005590bd`  
**Related code self-audit:** `docs/audit/s0/S22_CODE_BASELINE_SELF_AUDIT_2026-11-18.md`  
**Review class:** `CHATGPT_SELF_AUDIT_ONLY`  
**Runtime/data/save/test/UI/Android authorization:** `NONE`

> This supplement checks whether the current S22 design explicitly answers the code-baseline findings. It is not an independent review, does not modify product behavior, and does not open S1 or S22.

## 1. Executive result

The proposal has strong coverage for event taxonomy, bounded historical priors, effect validation/atomicity, benchmark provenance, holdout sets, multi-seed evaluation and diagnostic/gameplay separation. The later SA-10 source audit added a further requirement: close and recursively validate the condition grammar before implementation.

The following details must be normative before an implementation proposal is considered complete:

1. deterministic rank evaluation and tie/inclusion semantics (SA-01);
2. explicit separation of region-specific indicators such as the African partition from global aggregates (SA-07);
3. exact milestone scoring semantics while an item is pending inside its tolerance/grace window (SA-09).

Pending-decision validation in SA-03 is addressed conceptually, but the proposal should explicitly require command-boundary revalidation and atomic non-consumption on rejection.

## 2. Finding-to-design traceability

| Finding | Design coverage | Self-audit disposition |
|---|---|---|
| SA-01 — `rank_at_most` always succeeds | §4.2 describes current-state utility; §7.1 adds dimensions. Neither defines a rank resolver, eligible population, tie rule or fail-closed missing-rank behavior. | **OPEN DESIGN GAP** |
| SA-02 — AI choice is historical-weight dominated | §4.2 requires current utility first and a bounded, explainable historical prior. §6.5 requires multi-seed distributions. | **COVERED IN PRINCIPLE**; require quantitative prior cap/calibration tests in implementation spec |
| SA-03 — stale/invalid player decision can be consumed | §§4.1 and 4.4 describe authority, expiry, stale invalidation and save/load. §4.3 defines atomic effect processing. | **PARTIAL**; explicitly require command-boundary validation of actor, option membership, current date, preconditions and pending status before any mutation |
| SA-04 — open effect records and `ig_approval` no-op | §4.3 specifies versioned typed registry, strict validation, authorized commands and validate-stage-commit. | **COVERED IN PRINCIPLE**; the concrete registry must enumerate every currently used effect, including `ig_approval`, before runtime authorization |
| SA-05 — benchmark ETL loses provenance/units/method | §§6.2–6.4 specify scope, unit, source locator, method, uncertainty, holdout and comparability. | **COVERED IN PRINCIPLE** |
| SA-06 — narrow metrics and omitted decentralized actors | §§6.1, 6.3 and 7.1 broaden dimensions and require coverage by region/polity type. | **COVERED IN PRINCIPLE**; implementation must preserve explicit denominators and missingness |
| SA-07 — Europe-specific predicate risks global scoring | §7.1 separates territorial/political and other dimensions; §6.3 requires 12 world regions. It does not explicitly state that the African partition / European-owner count remains a named regional indicator excluded from generic global actor-class aggregation. | **OPEN DESIGN GAP** |
| SA-08 — day precision collapsed to month | §3.2 explicitly lists `date_precision` and distinguishes exact date, range and uncertain chronology. | **COVERED IN PRINCIPLE**; specify monthly effective-tick policy and log display contract |
| SA-09 — pending milestones penalized during grace | §7.2 distinguishes late/partial achievement but does not define whether a pending milestone inside its tolerance interval enters the score denominator or counts as a failure. | **CLOSED BY DESIGN AMENDMENT §14.3** |
| SA-10 — open condition grammar / incomplete recursive validation | Original §§3–4 and §10 do not require a closed condition union, recursive validation for priorities/windows/milestones, path-specific diagnostics or bounded nesting. | **CLOSED BY DESIGN AMENDMENT §14.7** |

## 3. Required design amendments

### D-01 — Deterministic rank semantics (SA-01)

Before any implementation:
- define the authoritative rank metric and whether it is a multi-dimensional power score;
- define eligible actors, including treatment of dead, decentralized, subject, rebel and newly formed polities;
- define deterministic tie handling;
- define behavior when an entity or rank is missing (fail closed with a diagnostic);
- ensure all condition evaluation paths receive the same rank context rather than silently returning success.

### D-02 — Regional indicator isolation (SA-07)

- Keep `count_owner_european` / African partition as a specifically named regional historical indicator.
- Do not use its actor class as a universal global ownership category.
- Global aggregates must be dimensioned by region and polity/actor class with source-backed classification.
- A regional milestone must not compensate for missing or failing evidence in other world regions.

### D-03 — Provisional milestone scoring (SA-09)

Choose and test one explicit policy:
- exclude pending milestones from both numerator and denominator until resolution; or
- expose a separately labelled provisional score that cannot be represented as a resolved historical-fidelity score.

At the end of the tolerance interval, an unmet milestone may become missed and enter the resolved denominator. Specify late-achievement credit, partial achievement and save/load determinism. Do not silently penalize a milestone while the simulation still considers it achievable.

### D-04 — Decision command validation (SA-03)

At command execution, before consuming a pending record:
- re-fetch the canonical decision definition;
- verify pending lifecycle state and option membership;
- verify actor authority and current regime/institution;
- verify date window and current causal/resource preconditions;
- stage and commit effects atomically;
- only then transition to resolved/fired.
Rejected or failed choices must leave the pending record and fired-event state unchanged, except for an explicit deterministic expiry/invalidation transition.

## 4. Gate and authorization boundary

- This is a documentation-only self-audit supplement.
- No engine, data, save schema, tests, UI, assets, Android, workflow, signing or APK files were changed.
- No tests, build, CI or device run was performed.
- This document is not Claude's independent review and cannot be labelled `REVIEW_PASS`.
- S22 and S1 remain closed. The supplement grants no implementation authorization.
