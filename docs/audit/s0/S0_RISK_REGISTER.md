# S0 — Risk Register

**Task:** S0-B7, OD-20261116-11  
**Status:** Drafted for independent review; owner signoff pending  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**Evidence scope:** S0-A, B1, B3, and B4; no product code, data, asset, signing, or device changes were made while preparing this register.

## 1. Severity and disposition rules

- **P0:** critical risk requiring an owner-accepted containment before any bounded S1 transition. R7 remains the known P0.
- **P1:** material risk requiring explicit evidence, containment/mitigation, owner, and a named stage/exit condition. An exception does not turn the finding into PASS or close the risk.
- **P2:** significant quality, completeness, compatibility, or process risk with a scheduled later-stage action.
- **P3:** lower-priority limitation or technical debt with a recorded destination.

“Contained” means the current exposure is restricted by an approved operating rule. It does not mean the product defect is fixed. “Open” means the risk still exists. Gate status is recorded separately in S0_SIGNOFF.md.

## 2. P0 risk

| ID | Risk / evidence | Impact | Current disposition and control | Owner | Target / closure criteria |
|---|---|---|---|---|---|
| R7 | No reliable lifecycle autosave, process-death recovery, or WebView renderer/WebGL recovery. Baseline grep found no visibilitychange, pagehide, beforeunload, webglcontextlost/restored, onRenderProcessGone, or appStateChange handling. The only autosave is tied to January in-game date. | Android may terminate the app or renderer and lose up to 11 in-game months or the whole unsaved session. | **OPEN P0; interim containment accepted in principle under OD-20261116-11 §5.1.** Warn owner that saves are not safe against process death; restrict play to short experimental sessions where loss is accepted; do not rely on Export as backup before R14 is device-tested; keep the installed baseline APK and do not uninstall it. This is not a fix. | Project owner accepts residual exposure; implementation owner closes technical defect. | S2. Close only after lifecycle autosave and renderer/process-death recovery are implemented and tested on Android, with evidence of save integrity and recovery. |

## 3. P1 risks

| ID | Risk / evidence | Impact | Current disposition and control | Owner | Target / closure criteria |
|---|---|---|---|---|---|
| R1 | CI debug APKs use ephemeral debug signing keys; two builds of equivalent product source had different certificate fingerprints. | Android may reject an update; uninstalling the old APK deletes IndexedDB saves. | **OPEN.** Do not install another APK or uninstall the baseline. Keep B2/C3 blocked until R14 is proven and a protected development-signing Environment is configured. No Repository Secrets fallback. | Project owner controls signing setup; Android implementer owns verification. | B2/C3, then device validation. Require two successive development APKs with identical certificate SHA-256 and successful in-place upgrade. |
| R2 | CC BY-SA text is already shipped in the identity content pack. Asset audit found attribution gaps at item level. | License/attribution non-compliance when content is displayed or redistributed. | **OPEN.** Preserve current content and attribution; do not remove or conceal text to avoid obligations. No new or modified content without complete provenance and license evidence. | Content/licensing owner. | S1 may only proceed under the tightly bounded G0.8 exception. Close when every displayed passage has author, article URL, revision, license, and license URL in the relevant UI. |
| R5 / RM-F3 | Simulation runs synchronously on the main thread. Baseline p95 stepMonth was about 29–33 ms in Node and 39–63 ms in the Chromium frame callback. S2 target is p95 ≤8 ms. | Long frames, UI stalls, reduced responsiveness, ANR risk under heavier game states/devices. | **OPEN.** Keep S1 limited to data contracts, schema and save compatibility; no runtime/tick-loop/Worker/rendering changes under an S1 exception. | Simulation/runtime lead. | S2. Measure on representative desktop and Android hardware; optimize only after repeatable profiling. |
| R7-related device limitation / G0.7 | iQOO Z10 Turbo has no verified runtime/performance measurements. Desktop measurement is Chromium headless + CPU SwiftShader, not GPU desktop or Android. | Current performance and reliability on the owner's device remain unknown. | **BLOCKED device evidence.** Do not substitute desktop/Node numbers for iQOO. Propose a G0.7 exception for S1 only; record that no device claim is made. | Project owner supplies device observations; QA owner records evidence. | Before S2. Close with measured boot, tick, command, save/load, lifecycle, WebView, memory, thermal and battery behavior on the actual device. |
| GD-F2 | Global data coverage is uneven: Sub-Saharan Africa has 84.8% of regional population facts marked missing; 51/65 entities lack population; 50/65 lack a ruler; 0/65 have GDP/person. East and South Asia contain mostly estimated/uncertain population facts despite representing about 58% of starting world population. | Country and regional comparisons may be materially distorted; the world simulation is less historically grounded in under-covered regions. | **OPEN.** Keep source/estimated/default/missing labels distinct; do not describe estimated/default facts as sourced. | Historical-data lead. | Later data research stages. Track coverage by region and polity type; improve evidence/provenance, not just raw record counts. |
| AS-F1 | 492 image assets have license/author/source recorded from ingestion metadata but were not re-verified against the live Commons source. | Legal status may differ from the recorded metadata. | **OPEN.** G0.8 stays PARTIAL. Request only the approved S1 exception: no additions, replacements, edits, or redistribution of these legacy assets/text during S1. All new content must have verified provenance. | Content/licensing owner; project owner accepts any exception. | Separate asset verification task before content expansion/release. |
| TC-F1 / TC-F2 | Two baseline tests in simulation.test.ts execute zero assertions (law flip-back and war-duration assertions). B3 catalog records both as P1. | Regression suite can report green without testing the advertised property. | **OPEN.** Do not interpret their green status as proof. Keep findings visible; proposed tests are scheduled for the stages that change AI/politics/military behavior. | Test/QA owner with relevant system implementer. | Relevant AI/politics and military stages. Require non-vacuous guards, tracked transitions, and boundary scenarios. |
| R13 | A future fixed development signing workflow could expose signing material if trust boundaries or permissions are wrong. Approved v3.2 design requires a separate workflow, workflow_dispatch only, protected Environment, reviewers, least privilege, no repository secrets, SHA-pinned actions, and a signing job that does not execute repository code. | Keystore compromise could allow unauthorized APK signing and malicious updates. | **OPEN / deferred.** No signing Environment, secrets, or keystore were created. Keep B2/C3 blocked; never place signing values in the repository, chat, or normal build job. | Project owner for Environment/secrets; CI/security implementer for workflow. | B2/C3 after R14. Review exact commit/workflow SHA before every signing approval; verify certificate fingerprint before release of artifact. |
| R14 | Export uses Blob + anchor download; baseline Android WebView code has no verified download listener. Import uses file chooser support, but end-to-end export/import has not been tested on the installed baseline APK. | Save may not be recoverable before first certificate-changing APK transition. | **BLOCKED.** Do not call Export a functioning backup; do not uninstall baseline or install a differently signed APK. O5 remains the owner's choice if test fails. | Project owner performs device steps; Android QA records output. | Before B2/C3 or any APK install. Export must create a real file; re-import must restore the same campaign/date/state. |
| DEP-F1 | Run #3 npm ci output reported 10 dependency vulnerabilities: 3 moderate, 5 high, 2 critical. The run log summary did not identify the affected packages or whether any are in shipped runtime dependencies. | Potential exposure in build/test toolchain or production dependency tree; severity and reach are not yet scoped. | **UNTRIAGED P1 (provisional).** Do not run npm audit fix or change the lockfile in S0. Capture npm audit --json against the frozen lockfile in a separate read-only audit and classify direct/transitive, dev/runtime, fixed version, exploitability and build exposure. | Dependency/security owner. | B7 follow-up audit, then approved dependency stage. Close only with a reviewed disposition for every advisory; no silent upgrade. |

## 4. P2 risks

| ID | Risk / evidence | Mitigation / destination | Owner |
|---|---|---|---|
| R6 | Natural Earth ETL downloads from an unpinned branch/CDN without a source checksum. | Pin upstream commit/version and store source checksum in the map-data stage (S3). | Map/data owner. |
| R8 / TC-F4 / TC-F6 / TC-F7 | Population test name says 1870 while querying 1875; it may skip countries; malformed-save coverage in the old suite was incomplete; some test names overstate what is checked. | Keep findings in catalog; correct tests when the corresponding system/test scope is authorized. Do not modify tests as a shortcut in this S0 gate. | QA owner. |
| R9 | Income/asset assumptions occur before detailed employment and wage simulation. | Preserve estimated labeling at S6; detailed hiring/wages and labor competition are accepted in S12. | Economy/population owner. |
| R10 | Map layers lack explicit future performance budgets. | Retain budget criteria for S4, S11 and S20; measure objects, draw cost, loading, RAM, and LOD/culling. | Map/rendering owner. |
| R11 | Development Android versionCode remains fixed at 1. | Keep only for development under the approved plan; test in-place upgrade on device after signing is safe; monotonic release versioning at S23c. | Android release owner. |
| R12 | Build-generated timestamps make db/content bundle bytes differ between runs. A4 identified built_at/generated fields and their downstream bundle-name effect. | Keep as documented non-reproducibility; do not change generators in S0. Define deterministic build inputs/metadata strategy in S1. | Build/data owner. |
| RM-F1 | 270/334 estimated and 18/62 uncertain facts have no method; only 29 facts have a range. | S1 data contracts require method/range where applicable; existing records remain unchanged in S0. | Historical-data owner. |
| RM-F2 | Engine log is capped at 4,000 entries; old entries are removed during long games. | Preserve finding; address archival/chronicle retention in S1/S22. | Simulation/history owner. |
| RM-F4 | Main simulation loop advances at most one tick per requestAnimationFrame; measured speed settings are constrained by frame production. | Address tick scheduling/backpressure in S2 after device profiling. | Runtime owner. |
| GD-F1 / GD-F3 / GD-F4 | Some supported labels have no source; literacy/army use defaults; several historical fields have no provenance/quality metadata. | Save/UI data contracts must distinguish sourced, estimated, default, missing, and not-classifiable. | Historical-data owner. |
| AS-F2 / AS-F3 / AS-F4 | Four BY assets lack author credit; text-source UI omits author/license URL; launcher/splash are largely Capacitor placeholders. | Add item-level credit/license UI and replace placeholders only in authorized content/release stage. | Content/UI owner. |
| WD-F3 | Five of eight starting wars capitulate at tick 5 in all four probe scenarios; historical end dates were not checked. | Historical calibration and war-balance investigation in S21/S22. | Military/history owner. |

## 5. P3 risks

| ID | Risk / evidence | Destination / closure |
|---|---|---|
| WD-F1 | Potential 145-month asymmetry for wars declared during a campaign; not observed in the four probes. | Clarify one counting rule and add a boundary test in S21. |
| WD-F2 | Historical war start dates before 1836 are dropped from state and duration counting. | Preserve true historical start dates/provenance in S1/S21. |
| RM-F5 | No explicit end-of-game condition at 1936; simulation continues beyond tick 1,200. | Define campaign end/continuation behavior in S22. |
| GD-F5 / GD-F6 | Some inhabited islands fall outside the Strategic Region grid; 34 modern admin-1 units are split across multiple regions by the raster crosswalk. | Review scope and crosswalk policy in map/geography stages; do not silently claim historical province equivalence. |
| AS-F5 / AS-F6 / AS-F7 | No consolidated third-party LICENSE/NOTICE; Natural Earth fetch is not pinned; portrait temporal-validity fields are null. | Release/legal inventory and source-pinning tasks in later approved content stages. |
| CI-F1 | GitHub runner warns that actions/checkout@v4 and actions/setup-node@v4 target Node 20, now deprecated and forced to Node 24. | Update/pin action/runtime versions in an explicitly reviewed CI maintenance task; test the build and workflow before use. |

## 6. Open controls and escalation

1. R7 remains OPEN P0. The temporary operating containment is owner-accepted by OD-20261116-11 §5.1 but does not fix the product.
2. R14 remains BLOCKED. No APK may be installed on the iQOO and the baseline APK must not be removed until export/import has been validated and the owner resolves O5.
3. B2/C3, B5, and B6 remain deferred. No keystore or signing secret was created.
4. G0.7 remains BLOCKED for iQOO. Desktop SwiftShader and Node results are not device evidence.
5. G0.8 remains PARTIAL. Any S1 exception is limited to preserving existing uncertain legacy assets/text without adding, editing, replacing, or distributing them; it does not waive license obligations.
6. DEP-F1 is provisional until package-level advisories are obtained and reviewed. No automatic dependency fix is authorized.
7. No gameplay, engine, save schema, RNG, data or asset remediation is included in this register's S0 work.

