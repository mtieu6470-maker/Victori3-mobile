# Global Historical Mode — Claude independent review request

**Task:** GLOBAL-HISTORICAL-MODE-FIDELITY-BASELINE  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review base HEAD:** `f5ba6542ed2944f392d0d72b530122ce6f58b498`  
**Scope:** worldwide Historical Mode fidelity standard, 1836–1936; all-world succession coverage matrix; current-data and engine baseline audit  
**Implementer:** ChatGPT  
**Reviewer:** Claude Code, only if Claude did not author or modify these documents  
**Status:** `PENDING / SELF_AUDIT_ONLY`

## Owner direction

The project-wide scope is **the whole world, not Africa only**. Historical Mode must use historically accurate, source-backed and temporally consistent data. Sandbox / Alternate History may be flexible and must not be forced to follow historical ruler/event timelines after the initial date. Historical Mode must still obey Master Spec §§2.2 and 10.2: historical outcomes are conditional and may diverge when the player or AI changes the causes; this is not a railroad.

Campaign period is **1836–1936**, following `docs/spec/MASTER_SPEC_VI.md`.

## Review files

1. `docs/spec/GLOBAL_HISTORICAL_MODE_FIDELITY_STANDARD_VI.md`
2. `docs/audit/GLOBAL_HISTORICAL_MODE_DATA_BASELINE_AUDIT_VI.md`
3. `docs/audit/GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv`
4. This review request.
5. `docs/coordination/AI_HANDOFF.md`

## Mandatory checks

### A. Master Spec alignment
- Compare with `docs/spec/MASTER_SPEC_VI.md`, especially §§2.2, 10.2–10.3, 13.2 and 15.9.
- The new standard must not turn Historical Mode into fixed outcome scripts.
- Confirm Sandbox is not constrained by post-1836 succession or event rails.
- Confirm 1836–1936 is the stated campaign period, and 1836-01-01 the initial snapshot.

### B. Global scope and coverage matrix
- Re-fetch `historical_data/political_entities/registry.json`, all core/detailed country profiles, `historical_data/leaders/heads_of_state.json` and the matrix at the exact latest HEAD.
- Independently verify 181 registry entities, 147 profiles, 93 succession arrays, 439 leader records and 54 profiles without arrays.
- Verify the matrix has one row for every registry entity: 181 data rows, 23 columns, no duplicate or missing IDs, rectangular CSV.
- Check the 34 registry entities without profiles are correctly distinguished: 19 future polities, 4 subject components and 11 decentralized placeholders. Do not classify all as a missing individual ruler.
- Recalculate the 1836, 1900 and 1936 coverage flags and the date-span/disposition fields.

### C. Source quality and precision
- Verify 346 records have record-level source references, 288 are Wikipedia-only, 58 have a non-Wikipedia source, and 93 have no record-level source (inherit global defaults).
- Confirm the audit does not imply that Wikipedia-only records are necessarily false; it says they are not independently validated to the proposed Historical Mode standard.
- Recalculate precision counts for `from`, `to`, `born` and `died`; check that year/month-only dates are not silently treated as exact days.
- Assess whether the proposed source hierarchy and confidence definitions are practical globally.

### D. Schema/build/engine audit
- Inspect `src/engine/data/dbTypes.ts`, `tools/build-data.ts`, `src/engine/modes.ts` and `src/engine/systems/events.ts`.
- Verify the summary of current succession matching/fallback behavior.
- Independently investigate the concern around `after_regime_change`: the succession candidate path appears to require `!c.regimeChangedAt` while filtering out records marked `after_regime_change`. Determine whether another code path makes this valid or whether it is a real engine defect. Do not change code in this review.
- Verify that build validation does not currently enforce the proposed richer provenance, date-precision, timeline-continuity or role/authority requirements.

### E. Scope integrity
- Compare from the review base SHA to the newest branch HEAD.
- All changed paths for this task must remain under `docs/`.
- No change to `historical_data/`, source runtime, schema, engine, events, tests, assets, saves, Android, Gradle, workflows or APK.
- This is a no-write review. Do not edit files, create a fix commit, or expand scope.

## Required verdict

Return one overall verdict: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Provide evidence-linked findings for:
1. Master Spec alignment and Historical/Sandbox separation
2. Global scope and 1836–1936 temporal scope
3. Matrix structure and coverage count accuracy
4. Source/provenance standard and date precision
5. Role/authority modeling
6. Schema/build/engine behavior and the `after_regime_change` concern
7. Docs-only diff integrity

For each issue, cite the exact file/line/CSV row and the source or code path supporting the finding. Re-fetch the latest HEAD immediately before review; this request's base SHA is only the starting point.

ChatGPT's own validation is self-audit only. A clean review does not constitute owner acceptance or S1 authorization.
