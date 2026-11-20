# UI-REDESIGN-01 — Claude independent design review request

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-20  
**Runtime/UI authorization:** NONE

## 1. Exact review target

- **Design proposal:** `docs/spec/PREMIUM_GRAND_STRATEGY_UI_REDESIGN_PROPOSAL_VI.md`
- **Exact design commit:** `150bf857aac7dbc4905a14a932ec6157507325ed`
- **Target proposal blob SHA:** `340b04e707794a1f146fe68642fd022e82f6d255`
- **Code/source baseline used by the proposal:** `a38749ba4f45bf8b05c3890874b10ac555905106`
- **Existing design system:** `docs/ui/UI_DESIGN_SYSTEM.md`
- **Product requirements:** `AI_START_HERE.md` and `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`
- **Relevant source baseline:** `src/ui/App.tsx`, `src/ui/styles/theme.css`, `src/ui/screens/World.tsx`, `Economy.tsx`, `Society.tsx`, `Politics.tsx`, `Tech.tsx`, `Diplomacy.tsx`, `Military.tsx`; inspect the exact source at the code baseline rather than assuming a newer UI implementation exists.
- **Related evidence:** `docs/audit/IDENTITY_ASSET_DISPLAY_COVERAGE_AUDIT_VI.md`, `docs/audit/COUNTRY_SPECIFIC_TECHNOLOGY_STARTING_STATE_AUDIT_VI.md`, and the latest feature-parity matrix.

Fetch the current branch HEAD and verify the review target/target blob before starting. Documentation commits after the target do not change the design target unless the proposal blob changes.

## CI evidence for the exact design target

The source/design target commit `150bf857aac7dbc4905a14a932ec6157507325ed` was checked out by GitHub Actions with `checked_out_head` equal to the target SHA.

- Android debug workflow: [44761419700](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700) — SUCCESS; `npm ci`, data/map/web build, unit/simulation tests, Capacitor sync, Gradle `assembleDebug`, APK checksums/signature verification and artifact upload all completed.
- Test report from the CI evidence bundle: **44/44 suites, 129/129 tests, 0 failures, 0 pending, 0 todo**; `vitest_exit_code=0`, `report_valid=true`.
- APK: 18,052,470 bytes; SHA-256 `2a683948370ced167f814460cd21d1b357ad50d896b17e1266b767c9f3633ea6`.
- Signing: Android Debug; apksigner exit code 0; v1 and v2 verification true; certificate SHA-256 `5d6de1c814791e75a189fb5b06482bdbae2e4e290f6f99f2dfbfcd5ee7186252`. This is not a release-signed APK.
- APK artifact: [14640599891](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700/artifacts/14640599891); artifact ZIP size 17,564,574 bytes; artifact ZIP SHA-256 `e022ff2e9ab56d93a5b11222de48d6fc28644abf869be516bccd44d2f373a4ac`.
- CI evidence artifact: [14642660607](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44761419700/artifacts/14642660607); ZIP SHA-256 `d1754a20385e118ce2c1e54f90bfe715f5d733f24b47f5ccca3da62c27f3533b`. The downloaded evidence ZIP was independently hashed in this session and matched the GitHub digest.
- **Limitations:** this CI run applies to exact target `150bf857aac7dbc4905a14a932ec6157507325ed`; it does not claim physical-device install/runtime QA. The current branch HEAD after documentation-only review-packet updates is `7d7b3d56d011520a93c8504784744cc9afcc8cc7`; no runtime/source changes followed the design target.

## 2. Independence and no-write boundary

This is a **design-only, no-write review**. The reviewer must not have authored or modified the proposal.

- Do not edit the proposal, design system, source code, assets, historical data, tests, Android/Gradle files, workflows, signing or save schema.
- Do not implement UI components, redesign screens, create assets or update runtime code.
- Do not create branches, commits, fixes or pull requests.
- Do not infer implementation authority from this request or a review verdict.
- Do not change S0/S1/S22/S23 gate status.

If a recommendation requires an owner decision, identify the smallest explicit decision needed; do not silently rewrite an existing principle.

## 3. Required review

### A. Accuracy of the source-based baseline
Verify the proposal against the exact source baseline:
- Map-first stage, HUD, navigation rail/dock, floating windows, context card and map lenses.
- Existing typography, dark ink/brass/gold tokens, panel/window primitives and responsive portrait behavior.
- Actual screens and state selectors for World, Economy, Society, Politics, Tech, Diplomacy, Military and Chronicle.
- Which displayed statistics and actions are backed by current engine state versus aggregates, approximations or placeholders.

Identify every material mismatch between the proposal and the real source.

### B. Product and existing-design consistency
- Does the strategic hierarchy (current state → cause → player action → cost/risk → evidence) fit the game’s mobile map-first workflow?
- Is the proposal consistent with the landscape-first requirement and a usable portrait adaptation?
- Resolve or explicitly flag the conflict between `docs/ui/UI_DESIGN_SYSTEM.md` §0 (“không chân dung”) and proposal §4.7 (historical leader portraits). Check whether an owner decision authorizes this change; do not infer that decorative portraits and verified historical identity assets are equivalent.
- Does the proposal retain an original visual identity without copying Victoria 3’s proprietary layout, art, text, icons or other assets?

### C. Domain-specific screens and truthfulness
Assess whether each proposed visual grammar is both useful and supported by present data contracts:
- **Economy:** supply/demand, stock, output/input, market access, trade routes, tariffs, production chains and construction queues. Do not imply inventory conservation or route shipments where the current engine does not model them.
- **Society:** POP cohorts/strata, standard of living, literacy, employment and migration. Distinguish implemented aggregate/projection data from unimplemented cohort-authoritative behavior.
- **Politics:** interest-group power, government composition, legitimacy, laws, reform progress and political movements. Do not display cabinet/bloc details unsupported by state.
- **Diplomacy:** treaties, subjects, alliances, relationship types and diplomatic-play stages. A graph must represent actual typed relations, not inferred/decorative edges.
- **Military:** current abstract monthly war/battle model versus any future formations, fronts, supply routes, naval operations or daily movement. The UI must not imply those mechanics already exist.
- **Technology:** country-specific known/adopting/accessible/unknown states and diffusion channels. Reconcile proposal claims with the starting-technology audit; avoid presenting tier bundles as verified country-level facts.
- **Country identity:** flags, arms and portraits must be period-valid, accurately labeled and rights-cleared. Verify the coverage counts against the audit; distinguish verified assets from generated fallback emblems/monograms.

Identify any screen that should be deferred until the underlying simulation contract exists.

### D. Component architecture
- Are the proposed primitives small and typed enough to avoid a generic dashboard framework?
- Are `DecisionCard`, `RelationshipGraph`, `FlowDiagram`, `Timeline` and `EvidenceBadge` bound to real selectors/actions and explicit domain contracts?
- Are costs, prerequisites, risks, outcomes and confirmation states represented consistently?
- Can the design be introduced incrementally with Country identity + Economy overview without rewriting all screens?

### E. Mobile usability, accessibility and performance
- Evaluate landscape on narrow phones and tablets, portrait sheets/docks, safe areas, orientation changes and retained map context.
- Check minimum text sizes, numeric alignment, touch targets, overflow, scroll containment, keyboard focus, TalkBack labels, contrast and reduced motion.
- Identify measurable visual regression fixtures and Android test sizes; do not treat desktop screenshots as device QA.
- Consider WebView memory, map/WebGL compositing, chart/table density and image decoding cost.

### F. Legal, provenance and implementation gates
- Verify no unlicensed or extracted Victoria 3 assets/UI are proposed.
- Respect the outstanding rights audit; do not add or redistribute images merely because a URL exists.
- Confirm that the proposal is design-only and does not authorize runtime UI, assets, historical content, save/data schema, Android packaging or workflow changes.
- Identify the minimum owner approvals and phase-gate conditions required before any implementation.

## 4. Required verdict

Return exactly one:
- **REVIEW_PASS**
- **CHANGES_REQUESTED**
- **BLOCKED**

Include:
1. Exact branch HEAD, target commit and proposal blob inspected.
2. Verdict and concise rationale.
3. P0/P1/P2/P3 findings with section/line, source evidence, consequence and bounded correction.
4. Non-blocking recommendations separately.
5. Confirmation that no files were modified and no code/build/device work was performed.

## 5. Gate boundary and next step

A `REVIEW_PASS` applies only to this design proposal. It does **not**:
- authorize runtime/UI implementation or new assets;
- approve any unsupported economy, diplomacy, military or technology mechanic;
- resolve the portrait/design-system conflict or asset licensing;
- open S0, S1, S22 or S23;
- replace physical Android QA or owner acceptance.

After the independent review, record its exact verdict and obtain the required owner decision/implementation authorization before changing runtime/UI files. Until then the implementation state is unchanged.
