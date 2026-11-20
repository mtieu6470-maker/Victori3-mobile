# S0-B7 — Risk and finding traceability matrix

**Baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`  
**Companion:** `S0_RISK_REGISTER.md`  
**Purpose:** allow a reviewer to trace every source risk/finding ID to its severity and exact Risk Register disposition without treating a mention elsewhere in prose as a complete risk entry.

## 1. Original roadmap risks R1–R14

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| R1 | P1 | §3, `R1` | OPEN — ephemeral debug signing; B2/C3 blocked pending R14 and protected development signing. |
| R2 | P1 | §3, `R2` | OPEN — CC BY-SA attribution remains incomplete; unchanged legacy text only under bounded G0.8 exception; full UI/runtime attribution remediation targets S5. |
| R3 | — | §6, Closed / no longer active | CLOSED — APK file SHA-256 and artifact ZIP digest recorded separately in A1/B1 evidence. |
| R4 | P2 | §4, `R4` | OPEN P2 / accepted design boundary — test-supplied command traces; production replay journal is optional, not claimed. |
| R5 | P1 | §3, `R5 / RM-F3` | OPEN P1 — frame-based metrics may hide long synchronous simulation ticks; protocol J measurements required. |
| R6 | P2 | §4, `R6` | OPEN P2 — Natural Earth source branch/CDN is not version-pinned. |
| R7 | P0 | §2, `R7` | OPEN P0 — no reliable lifecycle autosave or renderer/process-death recovery; interim exposure containment is not a fix. |
| R8 | P2 | §4, `R8 / TC-F4` | OPEN P2 — the population benchmark test can skip expected countries and under-check population coverage. |
| R9 | P2 | §4, `R9` | OPEN P2 — income/asset assumptions precede detailed employment and wage simulation. |
| R10 | P1 | §3, `R10` | OPEN P1 — numeric budgets must be approved and measured separately for S4/S11/S20 map/object layers. |
| R11 | P2 | §4, `R11` | OPEN P2 — development `versionCode` remains fixed at 1 under the approved development constraint. |
| R12 | P2 | §4, `R12` | OPEN P2 — build-generated timestamps make generated payloads differ; deterministic metadata strategy deferred. |
| R13 | P1 | §3, `R13` | OPEN / deferred — protected signing workflow and Environment remain unconfigured; no secrets created. |
| R14 | P1 | §3, `R14` | BLOCKED — Android WebView export/import not verified on installed baseline APK; blocks APK installation transitions. |

## 2. Performance and runtime findings RM-F1…RM-F5

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| RM-F1 | P2 | §4, `RM-F1` | OPEN P2 — estimated/uncertain facts lack method/range metadata; S1 data contract. |
| RM-F2 | P2 | §4, `RM-F2` | OPEN P2 — engine log cap discards earlier history; S1/S22. |
| RM-F3 | P1 | §3, `R5 / RM-F3` | OPEN P1 — synchronous main-thread simulation and over-budget tick durations; S2. |
| RM-F4 | P2 | §4, `RM-F4` | OPEN P2 — requestAnimationFrame bounds tick throughput; S2 after device profiling. |
| RM-F5 | P3 | §5, `RM-F5` | OPEN P3 — no 1936 campaign end condition; S22. |

## 3. Test catalog findings TC-F1…TC-F7

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| TC-F1 | P1 | §3, `TC-F1 / TC-F2` | OPEN P1 — zero effective assertions; replacement test targets S17/S19 and must guard a real law transition before checking the 180-tick flip-back property. |
| TC-F2 | P1 | §3, `TC-F1 / TC-F2` | OPEN P1 — zero effective assertions; replacement test targets S20/S21, observes completed wars and checks the documented 144-month boundary. |
| TC-F3 | P2 | §4, `TC-F3` | OPEN P2 — asset rejection assertion is vacuous without qualifying fixtures. |
| TC-F4 | P2 | §4, `R8 / TC-F4` | OPEN P2 — test says 1870 but queries 1875 and can skip countries. |
| TC-F5 | P1 | §3, `TC-F5` | MITIGATED FOR G0.6 — supplementary B4 cases passed, but original baseline test remains narrow. |
| TC-F6 | P2 | §4, `TC-F6` | MITIGATED FOR G0.6 by B4 malformed/unsupported-version/missing-state/legacy characterization; original test itself remains narrow and is not represented as repaired. |
| TC-F7 | P2 | §4, `TC-F7` | OPEN P2 — several test names imply stronger checks than are actually performed. |

## 4. Global data findings GD-F1…GD-F6

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| GD-F1 | P2 | §4, `GD-F1` | OPEN P2 — some `supported` labels have no source. |
| GD-F2 | P1 | §3, `GD-F2` | OPEN P1 — uneven coverage; staged remediation targets S3/S6 and relevant economic/historical-character data tasks, with a 12-region × polity-type provenance/coverage exit report. |
| GD-F3 | P2 | §4, `GD-F3` | OPEN P2 — literacy/army/GDP defaults or missing values need provenance distinctions. |
| GD-F4 | P2 | §4, `GD-F4` | OPEN P2 — fields such as culture, religion, terrain/resources and government lack quality/source metadata. |
| GD-F5 | P3 | §5, `GD-F5 / GD-F6` | OPEN P3 — inhabited islands may fall outside the Strategic Region grid. |
| GD-F6 | P3 | §5, `GD-F5 / GD-F6` | OPEN P3 — modern admin-1 units can cross multiple Strategic Regions; design limitation is documented. |

## 5. Asset and licensing findings AS-F1…AS-F7

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| AS-F1 | P1 | §3, `AS-F1` | OPEN P1 — 492 image records require live source-page verification and rights/attribution reconciliation in S5 before content expansion/release. |
| AS-F2 | P2 | §4, `AS-F2` | OPEN P2 — four BY assets lack author credit in the UI data path. |
| AS-F3 | P2 | §4, `AS-F3` | OPEN P2 — text attribution UI lacks author/license URL on the source line; runtime rendering not tested. |
| AS-F4 | P2 | §4, `AS-F4` | OPEN P2 — launcher/splash resources remain Capacitor placeholders. |
| AS-F5 | P3 | §5, `AS-F5 / AS-F6 / AS-F7` | OPEN P3 — no consolidated third-party LICENSE/NOTICE. |
| AS-F6 | P3 | §5, `AS-F5 / AS-F6 / AS-F7` | OPEN P3 — Natural Earth ETL source is not pinned and source checksum is not stored. |
| AS-F7 | P3 | §5, `AS-F5 / AS-F6 / AS-F7` | OPEN P3 — portrait temporal-validity fields are null. |

## 6. War-duration and historical-war findings WD-F1…WD-F3

| Source ID | Source severity | Risk Register location | Disposition |
|---|---:|---|---|
| WD-F1 | P3 | §5, `WD-F1` | OPEN P3 — possible 145-month convention for wars declared during a campaign; not observed in the four probes. |
| WD-F2 | P3 | §5, `WD-F2` | OPEN P3 — historical war start dates before 1836 are not retained in the state/duration counter. |
| WD-F3 | P2 | §4, `WD-F3` | OPEN P2 — five of eight starting wars capitulate at tick 5 in all four probes; historical end-date accuracy was not assessed. |

## 7. CI, dependency and gate-specific items

| Source ID / gate | Severity / verdict | Risk Register location | Disposition |
|---|---|---|---|
| CI-F1 | P2 | §4, `CI-F1` | OPEN P2 — existing workflows use actions flagged for Node 20 runtime deprecation; new B7 workflow is SHA-pinned to Node 24 actions. |
| CI-F2 | P2 | §4, `CI-F2` | OPEN P2 — actionlint was not run; do not claim static lint PASS. |
| CI-F3 | P2 | §4, `CI-F3` | OPEN P2 — B1 did not exercise an intentionally failing test on GitHub Actions; local negative probe only. |
| CI-F4 | P1 | §3, `CI-F4` | **CLOSED (narrow scope)** — commit `b5948f0` excludes the frozen-baseline-only `tests/s0-save-determinism.test.ts` from the experiment APK suite while retaining the separate pinned-baseline B4 path. Run #318 (`44573351798`) passed 97/97 tests, assembled APK, and uploaded verified checksum/signing evidence. Reopen only if this separation regresses. |
| DEP-F1 | P1 | §3, `DEP-F1` | **OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING.** B7 read-only audit run `44572915201`, artifact `14555141888`: six vulnerable dev-dependency package entries (3 moderate / 1 high / 2 critical); production-only scan zero. Nested Vite esbuild `0.21.5` is affected; root `0.28.2` is not. B4 Run #3 `44325257261`, job `134874698600`, raw `npm ci` log independently confirms 221 packages audited and 10 vulnerabilities (3 moderate / 5 high / 2 critical), but no package/advisory JSON was uploaded. The package-lock SHA is identical across the frozen baseline, B4 checkout and experiment branch (`29ac661a36bb03bae62a80ce7abf9af0c15bb168`). The commands/report contexts differ; the exact 10-versus-6/severity delta remains **UNRECONCILED**. No dependency change authorized in S0. |
| G0.7 device evidence | BLOCKED | §3, G0.7 device-evidence limitation | iQOO Z10 Turbo has no verified measurements; Node/desktop data are not substitutes. |

## 8. Review rules and limitations

- This matrix is a navigation and completeness aid; the detailed evidence, impact, owner role, mitigation, target stage and closure criteria remain in `S0_RISK_REGISTER.md` and the source reports.
- A source ID appearing in a sentence is not sufficient: the reviewer must verify that the mapped Risk Register row has the required disposition fields.
- `R3` is the only roadmap risk marked closed in this register. `TC-F5` is mitigated only for G0.6; its original baseline test limitation remains open.
- `WD-F3` is a historical-calibration observation, not proof of a simulation defect and not authorization to change game behavior in S0.
- This matrix does not change any gate verdict. Full-S0 G0.9 remains `BLOCKED` while C3/B2 is blocked; the separate bounded S1-entry package remains `NOT_TESTED`. Overall S0 is `PARTIAL`, and S1 is `NOT AUTHORIZED`.
- No product source, gameplay, engine, RNG, save serializer/schema, historical data, assets, dependencies, APK build, signing, or secrets are changed by this document.