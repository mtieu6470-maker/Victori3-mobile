# S0-B7 — Frozen-baseline dependency audit plan

**Status:** `RUN COMPLETE — ARTIFACT REVIEWED`; DEP-F1 is OPEN P1 pending remediation and owner disposition.
**Product baseline:** `2240a8fb865e0021eec2f2f4f1c6803528be9e2c`
**Workflow:** `.github/workflows/s0-b7-dependency-audit.yml` (manual only, present on default and experiment branches)
**Purpose:** resolve DEP-F1 without changing product dependencies or the lockfile.

## 1. Existing evidence and discrepancy

- The read-only audit in `docs/audit/s0/logs/a2/10_npm_audit.log` was run against baseline `2240a8f` on 2026-11-16. It reported 6 vulnerabilities: 3 moderate, 1 high, 2 critical. The report named advisories `GHSA-82fw-gwwq-j7x9`, `GHSA-qxg6-89mg-rqv8`, `GHSA-67mh-4wv8-2f99`, `GHSA-5gmw-xhrv-c9v3`, and `GHSA-85c8-ppgw-ccpr`, with affected dependency families including Vitest/@vitest/mocker, tinypool, Vite/vite-node and esbuild.
- The successful B4 Run #3 on 2026-11-18 reported 10 vulnerabilities during `npm ci`: 3 moderate, 5 high, 2 critical. That job log contains only the summary line, not the advisory/package details.
- The two totals must not be merged or treated as the same advisory set. The commands, collection dates and npm execution context differ; the available logs do not explain the numerical difference or identify which advisories account for it.

## 2. Read-only scan design

The workflow checks out the exact frozen baseline, verifies its commit SHA, and records SHA-256 hashes for `package.json` and `package-lock.json`. It then runs:

```bash
npm audit --package-lock-only --json
npm audit --package-lock-only --omit=dev --json
```

The first command reports the full dependency tree; the second excludes development dependencies to help distinguish possible shipped-runtime exposure. npm documents `--package-lock-only` as using the lockfile and ignoring `node_modules`, and `--omit=dev` as selecting the production dependency tree.

The workflow does not run `npm ci`, package lifecycle scripts, `npm audit fix`, builds, tests, Gradle, APK assembly, or any product script. It does not write `package.json`, `package-lock.json`, source, data, or assets. It stores raw JSON, stderr, exit codes, a concise package/advisory summary, Node/npm versions and lockfile provenance in a GitHub Actions artifact. `npm audit` submits the dependency description for this public baseline lockfile to the configured npm registry; this scan does not submit game saves, source files, user data, or signing secrets.

All third-party Actions are pinned to full commit SHAs verified against their release tags:

| Action | Release | Pinned commit |
|---|---|---|
| `actions/checkout` | `v7.0.1` | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node` | `v7.1.0` | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| `actions/upload-artifact` | `v7.0.2` | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |

These releases use the Node 24 action runtime. This avoids introducing another Node 20 action in the new audit workflow; it does not update existing APK/B4 workflows.

## 3. Dispatch and evidence location

Manual workflow page:

https://github.com/mtieu6470-maker/Victori3-mobile/actions/workflows/s0-b7-dependency-audit.yml

Select `experiment/vic3-visual-upgrade` (or the coordination branch) and run the workflow. Expected artifact name: `s0-b7-dependency-audit-<workflow-sha>`; retention: 30 days.

Expected evidence files:

- `provenance.txt` — baseline SHA, workflow SHA/ref, Node/npm/registry versions, package manifest hashes.
- `audit-all.json` and `audit-production.json` — raw npm audit JSON reports.
- `audit-*.stderr` and `audit-*.exit_code` — diagnostics and native npm exit codes.
- `audit-summary.json` — totals and package-level advisories with severity, affected range, directness and fix availability.

An npm audit exit code of 1 is expected when findings exist; it does not by itself mean the workflow malfunctioned. Missing/invalid JSON, npm error payloads, or exit codes greater than 1 are scan errors and must be investigated. The artifact must be reviewed before assigning DEP-F1 a final disposition.

## 4. Decision after review

For each advisory, record package, version/range, direct or transitive status, dev or production status, severity, GHSA/URL, practical exposure in this application, fixed version, whether the fix is semver-compatible, and required test/upgrade plan. Do not upgrade packages in S0. Any dependency or lockfile change requires a separately authorized task and an isolated commit.

The exact run and both raw audit reports have now been reviewed (see §6). DEP-F1 is `OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING`. The production-only audit reports zero vulnerabilities in the lockfile's production dependency graph; this does not prove that build tooling is safe or replace APK/SBOM inspection.

## 5. Pre-dispatch lockfile/advisory preflight (2026-11-19; not an audit run)

- Read-only GitHub contents inspection confirms baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` and the experiment branch have the identical `package-lock.json` blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168`.
- The lockfile resolves `vitest@2.1.9`, `@vitest/mocker@2.1.9`, `tinypool@1.1.1`, `vite@5.4.21`, root `esbuild@0.28.2`, and nested `node_modules/vite/node_modules/esbuild@0.21.5`; all are marked development dependencies. The nested esbuild version is within GHSA-67mh-4wv8-2f99's affected range; the root esbuild version is not.
- External advisory cross-checks identify version matches for GHSA-82fw-gwwq-j7x9 / GHSA-qxg6-89mg-rqv8 on Vitest packages and GHSA-5gmw-xhrv-c9v3 / GHSA-85c8-ppgw-ccpr on tinypool. The locked esbuild version 0.28.2 is above the fixed version 0.25.0 for GHSA-67mh-4wv8-2f99, so it is outside that advisory's affected range.
- This was a preliminary cross-reference only and is superseded by the full raw audit evidence in §6. It missed the nested Vite dependency `esbuild@0.21.5` because it inspected only the root `esbuild@0.28.2` entry.
- Do not change dependencies in S0. The manual workflow has now run and both JSON reports have been inspected; see §6 for exact counts, versions, advisory IDs and remaining limitations.



## 6. Completed read-only audit evidence — 2026-11-19

**Workflow run:** [44572915201](https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/44572915201)  
**Workflow commit/ref:** `9b150cff57e79bdb5356e431cc140b3b1b9eda2d` / `experiment/vic3-visual-upgrade`  
**Run result:** SUCCESS; job `135732603544` completed successfully.  
**Artifact:** `s0-b7-dependency-audit-9b150cff57e79bdb5356e431cc140b3b1b9eda2d`, ID `14555141888`, 4,753 bytes, API SHA-256 `b9124fa9c6f0272abaf970557ce248ef32c4d85397d21dbe64ebb19221a65a28`. Downloaded and inspected all eight archive entries.

| Evidence | Result |
|---|---|
| `audit-all.json` | Valid JSON; 6 vulnerable package entries; 3 moderate, 1 high, 2 critical; exit code 1 (expected because findings exist) |
| `audit-production.json` | Valid JSON; 0 reported vulnerabilities; exit code 0 |
| stderr | Both full-tree and production stderr files are empty |
| `audit-summary.json` | Valid summary; agrees with both raw reports |
| `provenance.txt` | Baseline `2240a8f`; workflow SHA `9b150cff`; Node 22.23.4; npm 10.9.9; npmjs registry |
| Lockfile identity | `package.json` SHA-256 `9ad6ad7d9b8a59041eb391284a26ef240b7d691277f7737947497701432271f4`; `package-lock.json` SHA-256 `1efd2948d7c885df345c3ab3bbb9a7e46dc1f14e849e19652ef78c042453d423`; tracked manifest status empty |

### Package-level findings from the raw full-tree report

All six vulnerable package entries are development dependencies in the frozen baseline lockfile. Highest package severities and exact resolved versions:

| Package | Locked version | Highest severity | Relevant advisory families |
|---|---:|---|---|
| `@vitest/mocker` | 2.1.9 | Moderate | GHSA-82fw-gwwq-j7x9; GHSA-qxg6-89mg-rqv8 |
| `esbuild` nested under Vite | 0.21.5 | Moderate | GHSA-67mh-4wv8-2f99 |
| `tinypool` | 1.1.1 | Critical | GHSA-5gmw-xhrv-c9v3; GHSA-85c8-ppgw-ccpr |
| `vite` | 5.4.21 | High | GHSA-4w7w-66w2-5vf9; GHSA-v6wh-96g9-6wx3; GHSA-698v-4r3x-3vcv; GHSA-r825-w8mm-5pxw; GHSA-587h-7wmj-h5pm; GHSA-9jrq-w75r-8gcw; GHSA-rq7h-c2jc-7f22; GHSA-fx2h-pf6j-xcff |
| `vite-node` | 2.1.9 | Moderate | Inherited via Vite |
| `vitest` | 2.1.9 | Critical | GHSA-5xrq-8626-4rwp; inherited Vitest/Vite/tinypool advisories |

The root-level `esbuild@0.28.2` is also marked dev and is outside GHSA-67mh-4wv8-2f99's affected range; however, the lockfile separately contains nested `node_modules/vite/node_modules/esbuild@0.21.5`, which is within the affected range and is the entry reported by npm audit. The earlier preflight that considered only the root esbuild version was incomplete and is superseded by this package-path-aware result.

The production-only `--omit=dev` audit reports no vulnerabilities in the production dependency graph represented by this lockfile. This is not proof that every build-time tool is safe, that the final APK contains no vulnerable code, or that future advisories cannot arise. It is also not a substitute for APK/SBOM inspection.

### Reconciliation and disposition

- The full-tree audit's 6 / (3 moderate, 1 high, 2 critical) summary matches the count/severity summary from the 2026-11-16 A2 audit. The raw advisory/package detail is now available for this exact frozen-baseline lockfile.
- The 2026-11-18 B4 Run #3 `npm ci` warning of 10 (3 moderate, 5 high, 2 critical) remains unreconciled: that log contains no package/advisory JSON, and the command/context differs. Do not claim the 10 count is explained by this audit.
- npm reports available fixes involving major upgrades (Vitest 5.1.1 and Vite 8.3.8); no fix, install, lockfile update or package change was performed.
- **DEP-F1: OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING.** The finding is no longer untriaged. Do not close it or change dependencies under S0-B7. A separate owner-authorized dependency-maintenance task must assess compatibility, update packages in isolation, run the complete test/build matrix and review resulting SBOM/APK evidence.

This audit is evidence for the frozen baseline only; it does not certify the experiment branch's package tree or current APK pipeline.


## 7. Follow-up inspection of B4 Run #3 install-time audit summary — 2026-11-20

The earlier 10-finding line has now been rechecked against the original GitHub Actions job log rather than relying only on the report summary.

- Run: `44325257261`, job `134874698600`, branch `claude/game-historical-sandbox-modes-kg7rj7`, checkout SHA `7f17b1f0177d712366e31e4e8c879cc4b6dd5741`.
- Raw job log at 2026-11-18T14:32:02Z: `added 220 packages, and audited 221 packages in 2s`; then `10 vulnerabilities (3 moderate, 5 high, 2 critical)`. The job uploads no package/advisory-level audit JSON or artifact. Its completed steps are install, data preparation and Vitest only.
- GitHub confirms `package-lock.json` has the same blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168` at frozen baseline `2240a8f`, B4 checkout `7f17b1f` and the experiment branch.
- The later dependency audit run `44572915201` used explicit `npm audit --package-lock-only --json` on the frozen lockfile and separately `npm audit --package-lock-only --omit=dev --json`. It produced six vulnerable package entries (3 moderate, 1 high, 2 critical) in the full lockfile report and zero in the production-only report.
- npm's v10 CLI documentation says install-time auditing is enabled by default for `npm ci`; it also documents that audit requests use registry advisory data and npm calculates vulnerability/meta-vulnerability objects. References: https://docs.npmjs.com/cli/v10/commands/npm-ci/ and https://docs.npmjs.com/cli/v10/commands/npm-audit/.
- The two outputs are not identical evidence formats: one is the install-time human summary over the installed/audited tree; the other is an explicit package-lock-only JSON scan. The report metadata also records 292 lockfile dependencies (including 76 optional) for the later scan, versus 221 packages audited in the install log. This makes a direct numeric comparison unsafe, but it does **not** establish the exact cause of the severity/count delta.
- No identical raw npm-ci JSON was preserved and the historical registry response cannot be reconstructed from the job log. Therefore the exact 10-versus-6 and severity difference remains **UNRECONCILED / NOT REPRODUCED**. Do not relabel it as resolved or infer exploitability from the count alone.

**Disposition unchanged:** DEP-F1 remains `OPEN P1 — AUDIT COMPLETE; REMEDIATION / OWNER DISPOSITION PENDING`. No package install, upgrade, npm audit fix or lockfile change was performed in this follow-up.
