# S0 Signoff — B7 proposal for bounded S1 entry

**Status:** DRAFT — pending independent review and owner decision  
**Task:** S0-B7 — Risk register and signoff package  
**Owner decision:** OD-20261116-11 (v3.3)  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**B4 test source:** ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad  
**B4 CI run:** 44041104723 — tested HEAD d2ae88e557e9895413462c5b069886bfc606adc7, 6/6 suites, 70/70 tests  
**Draft prepared against repository HEAD:** 5d92101e56d6f60045f51f25f926b124eaf892ef  
**Date:** 2026-11-17

> This is a proposal, not an executed acceptance. It does not declare S0 complete and does not authorize S1. Under v3.3, B3/B4/B7 are the authorized sequential S0 audit lane; the independent review and owner's ACCEPTED decision apply to the complete bounded S1-entry evidence package after B7. The S1 transition remains closed until both are recorded.

## 1. Executive status

- S0-B3 was independently reviewed by ChatGPT at the exact review target recorded in the handoff and has REVIEW_PASS for its bounded audit scope.
- S0-B4 test corrections are committed. Corrected tests-only CI passed 70/70 tests across 6/6 suites, including all four Historical/Sandbox save-load comparisons. A separate, genuine second-party review of B4 is still pending.
- B7 is authorized by OD-20261116-11 §6 step 6 after B4; this draft starts the risk/signoff workstream. It does not override the independent review requirement for the final S1-entry package.
- R7 remains P0 and open as a product defect. An interim risk-control policy was accepted in principle under OD-20261116-11 §1/§5.1; final residual-risk acknowledgement is requested below.
- G0.7 remains BLOCKED overall (iQOO not measured; desktop is SwiftShader-limited). G0.8 remains PARTIAL (licence verification/attribution gaps).
- R14 remains BLOCKED for device update/signing. No new APK was built by the B4 tests-only workflow, and no APK was installed on the iQOO.
- Overall S0 is PARTIAL/BLOCKED, not PASS. No S1 work is authorized by this draft.

## 2. Gate ledger

| Gate | Proposed verdict | Evidence / reason | Remaining condition |
|---|---|---|---|
| G0.1 Snapshot | **PASS** | S0_REPOSITORY_SNAPSHOT.md and S0-A records identify baseline 2240a8f. Compare baseline → current draft HEAD lists only authorized workflow/documentation/audit additions; no product src/**, android/** or game-data mutation is shown in the current change range. | Recheck exact HEAD/diff at independent signoff review. |
| G0.2 Build/CI integrity | **PASS** | S0-A clean baseline build and B1 CI evidence; B4 tests-only run 44041104723 checked out exact SHA and passed. APK SHA vs ZIP digest distinction is preserved in B1 evidence. | Do not interpret tests-only run as a new app/APK build. Any future build must have its own provenance/evidence. |
| G0.3 Test catalog | **PASS** | S0_TEST_CATALOG.md: 58/58 runtime tests mapped to 51 declaration locations, assertion counts and stability probes; empty-pass findings TC-F1…F7 preserved rather than hidden. | Keep vacuous tests visible until fixed in their authorized future stages. |
| G0.4 Requirement audit | **PASS** | S0_REQUIREMENT_MATRIX.csv: 353 atomic requirements from MASTER_SPEC_VI §§0–17; missing/partial/placeholder/unverified are not described as implemented. | No additional requirements inferred from concept illustrations. |
| G0.5 Global data | **PASS** | S0_GLOBAL_DATA_AUDIT.md: 274/274 entities, 662 regions, 12 analysis groups (West Asia and Middle East combined), raster crosswalk 4,374 pairs. Missing/default/estimated/sourced categories are distinct. | Preserve the stated 12-group limitation; do not claim 13 separate regions were independently reported. |
| G0.6 Save/determinism | **PASS** | B4 CI run 44041104723: four valid-save continuation cases (Historical/Sandbox × tick 6/12) report MATCH and firstDifferingPath=null; malformed/legacy behaviors are characterized, including missing-RNG continuation TypeError. | The missing-RNG TypeError remains a product/save-compatibility risk (B4-R1), not a successful compatibility case. |
| G0.7 Runtime/performance | **BLOCKED** | S0_PERFORMANCE_BASELINE.md: Node PASS; desktop PARTIAL (Chromium headless + SwiftShader, unsupported/unmeasured input latency); iQOO Z10 Turbo BLOCKED (no device measurement). | Request only v3.3 S1 exception; retain BLOCKED; iQOO evidence required before S2. |
| G0.8 Asset/licensing | **PARTIAL** | S0_ASSET_AUDIT.md: inventory/checksum PASS; 492 licence records unverified; authorship/attribution and runtime display gaps; 227 portraits lack period validity metadata. | Request only v3.3 S1 exception; no unverified asset/text changes or new distribution during S1. |
| G0.9 Risk/signoff | **BLOCKED for the overall S0 gate** | v3.3 owner decision §2.1.1 requires full-S0 G0.9 to remain BLOCKED while R14/C3 are BLOCKED. This draft separately prepares the bounded S1-entry risk disposition and records R7 control plus R14/C3 P1 isolation proposal. | Do not relabel full-S0 G0.9. Independent reviewer assesses the bounded S1-entry package separately; owner must explicitly accept R7 residual exposure, G0.7/G0.8 exceptions and exact S1 scope. |

**Overall S0 verdict: PARTIAL/BLOCKED.** G0.7 is BLOCKED, G0.8 is PARTIAL and G0.9 remains BLOCKED for full S0 under v3.3 §2.1.1 because R14/C3 remain BLOCKED. A bounded S1-entry review is separate and does not change these gate verdicts. The table does not declare S0 PASS.

## 3. Proposed bounded S1 exceptions

These are requests for the final reviewer/owner decision. OD-20261116-11 accepts the principle of these exception categories; it does not grant the concrete exceptions without evidence and a recorded signoff.

### EX-G07-01 — iQOO measurement deferred for S1 only

- **Unmet evidence:** no device measurement on iQOO Z10 Turbo; desktop browser measurement uses Chromium headless + SwiftShader and is not a physical GPU/mobile proxy.
- **Allowed scope:** S1 data contracts, schema versioning, provenance/quality metadata, save compatibility and migration tests, executed in CI/desktop without installing a new APK.
- **Forbidden scope:** runtime/performance optimization, tick loop changes, Worker/chunking, renderer/WebGL changes, WebView lifecycle, autosave/recovery, UI runtime-heavy features and any device installation.
- **Owner:** Project owner; device measurements due before S2.
- **Closure:** real-device measurements under the approved protocol before S2; retain raw reports. This exception does not turn G0.7 into PASS.

### EX-G08-01 — existing unverified licence records deferred for S1 only

- **Unmet evidence:** 492 image licence records have not been re-verified against their source pages; author/attribution and text licence URL gaps remain; runtime attribution is NOT_TESTED.
- **Allowed scope:** schema/data contracts and save compatibility that do not change content/assets.
- **Forbidden scope:** adding, replacing, editing, removing, repackaging or newly distributing unverified assets/text; no assumption that unknown licence means cleared rights.
- **Owner:** Project owner and content/licensing owner; resolve before S5/content work.
- **Closure:** per-asset source/licence/author/temporal review; runtime-tested CC BY-SA attribution. This exception does not turn G0.8 into PASS.

### EX-R14-01 — device export/import remains blocked; not an S1 device exception

- **Status:** R14 remains BLOCKED until export creates a real file on the installed baseline APK and import restores the same campaign/date.
- **Consequence:** no B2/C3, B5/B6 on-device, uninstall, different-signature update or new APK installation on iQOO.
- **S1 boundary:** CI/desktop-only S1 work may be considered under v3.3, but must not ask the owner to remove/update the baseline app or rely on export as backup.
- **Owner:** Project owner performs O5/device decision if export/import fails; CI/release maintainer preserves the baseline workflow.
- **Closure:** device evidence and explicit O5 decision; do not change this status by inference.

## 4. P0 control and owner acknowledgement

### R7 — open P0, interim control

OD-20261116-11 §1 and v3.3 §5.1 accepted the interim-control principle: S1 may be considered only as a constrained test workflow where progress may be lost; do not claim reliable lifecycle save/export; keep the baseline APK installed.

The final signoff must include this exact acknowledgement (owner to complete):

- [ ] I understand that the game has no verified lifecycle autosave/process-death recovery or WebView renderer/WebGL recovery.
- [ ] I understand that a long campaign or unsaved session may be lost if Android kills the process or the renderer fails.
- [ ] I accept only the limited S1 test exposure: use short, disposable test sessions and do not rely on Export as a backup until R14 passes on the baseline device.
- [ ] I will not uninstall or install a different-signature APK on the iQOO while R14/C3 is blocked.

**Owner name/identifier:** ____________________  
**Decision date:** ____________________  
**Decision:** ACCEPT / REJECT / CHANGES REQUESTED  
**Notes or additional conditions:** __________________________________________

A rejected or incomplete R7 acknowledgement means G0.9 does not pass and S1 remains closed. R7 itself remains open until S2 evidence proves the technical fix.

## 5. P1 risk owner and exit summary

| Risk | Accountable owner | Required before / stage | Exit evidence |
|---|---|---|---|
| R1, R14 | Project owner + Android/release maintainer | Before B2/C3 or any different-signature install | Real-device export/import, protected fixed-signing workflow and install/update test |
| R13 | Project owner + CI maintainer | Before B2/C3 | Environment-only secrets; dedicated workflow_dispatch; pinned/reviewed exact commit; least privilege |
| R2, AS-F1 | Content/licensing owner | Before S5/content changes | Source-page verification and runtime attribution/licence evidence |
| GD-F2, GD-F3, GD-F4, RM-F1, B4-R1 | Historical data/schema owner | S1 contracts; research by data stages | Schema validation, migration fixtures, source/method/quality contract and regression tests |
| TC-F1, TC-F2 | AI/politics/military test owners | Before changing the relevant subsystems | Non-vacuous tests with positive exercised sample counts |
| RM-F3, RM-F4 | Runtime/performance owner | Before S2 | Node/desktop/device performance evidence and target budgets met |
| S0-SEC-01 | Dependency/CI maintainer | Before accepting untrusted build inputs and before release | Current lockfile audit, exposure analysis and approved dependency updates |

## 6. S1 scope that may be considered after acceptance

Only the v3.2 S1 data-contract/save-foundation scope, under the v3.3 exclusions:

- Separate immutable historical definitions from mutable GameState.
- Version save schema, engine and data build independently.
- Stable IDs, DB/data hashes, provenance, quality and uncertainty contracts.
- Sequential migration, v1 fixtures, rollback/backup design and unknown-field/version policy.
- Save metadata for engineVersion, saveSchemaVersion, dataBuildHash and seed.
- Compatibility/migration tests and API/schema documentation.

Not allowed under this S1 exception: gameplay changes; formula/AI/economy/population/politics/diplomacy/military changes; geography ID changes; unverified assets/content changes; performance, Worker, tick loop, renderer/WebGL, lifecycle, autosave or Diagnostic UI; signing/keystore/Secrets; APK installation on iQOO. Any expansion requires a separate owner approval.

## 7. Independent review and owner decision

### Reviewer section — must be completed after inspecting exact GitHub HEAD

- [ ] B4 test source and run 44041104723 verified.
- [ ] Risk register evidence, severity, impact, mitigation, accountable owner, stage and closure criteria verified.
- [ ] R7 interim control is sufficient for the bounded S1 test exposure; no uncontrolled P0 remains.
- [ ] R14/C3 remain isolated and correctly blocked.
- [ ] G0.7/G0.8 exceptions meet v3.3 §§4–5 and do not rewrite the gate verdicts.
- [ ] Proposed S1 scope matches v3.2/v3.3 and includes no prohibited runtime/content work.

**Reviewer:** ____________________  
**Exact reviewed HEAD:** ____________________  
**Verdict:** REVIEW_PASS / CHANGES_REQUESTED  
**Date and findings:** __________________________________________

### Project owner section

- [ ] I reviewed the independent reviewer verdict and exact signoff package.
- [ ] I explicitly accept/reject EX-G07-01.
- [ ] I explicitly accept/reject EX-G08-01.
- [ ] I explicitly accept/reject the R7 residual-risk control above.
- [ ] I acknowledge R14 remains BLOCKED and no APK installation on iQOO is authorized.
- [ ] I approve the bounded S1 scope above (this does not mean overall S0 is PASS).

**Owner:** ____________________  
**Decision:** ACCEPTED / REJECTED / CHANGES REQUESTED  
**Accepted S1 scope and exceptions:** __________________________________________  
**Date:** ____________________

**Until both the independent REVIEW_PASS and owner ACCEPTED are recorded, S1 remains NOT_STARTED. B7 work may be completed/revised, but no S1 implementation may begin.**
