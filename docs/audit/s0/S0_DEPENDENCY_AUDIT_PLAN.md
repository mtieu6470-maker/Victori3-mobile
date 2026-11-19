# S0-B7 — Frozen-baseline dependency audit plan

**Status:** `PREPARED — NOT RUN`; manual GitHub Actions dispatch and artifact review are pending.
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

Until the run and artifact are reviewed, DEP-F1 remains `OPEN P1 — UNTRIAGED`; no claim is made that the vulnerabilities are only development dependencies or are absent from the shipped APK.

## 5. Pre-dispatch lockfile/advisory preflight (2026-11-19; not an audit run)

- Read-only GitHub contents inspection confirms baseline `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` and the experiment branch have the identical `package-lock.json` blob SHA `29ac661a36bb03bae62a80ce7abf9af0c15bb168`.
- The lockfile resolves `vitest@2.1.9`, `@vitest/mocker@2.1.9`, `tinypool@1.1.1`, `vite@5.4.21`, and `esbuild@0.28.2`. The first four named advisory package entries inspected (`vitest`, `@vitest/mocker`, `tinypool`, `esbuild`) are marked development dependencies.
- External advisory cross-checks identify version matches for GHSA-82fw-gwwq-j7x9 / GHSA-qxg6-89mg-rqv8 on Vitest packages and GHSA-5gmw-xhrv-c9v3 / GHSA-85c8-ppgw-ccpr on tinypool. The locked esbuild version 0.28.2 is above the fixed version 0.25.0 for GHSA-67mh-4wv8-2f99, so it is outside that advisory's affected range.
- This is only a preliminary cross-reference of selected advisory IDs against selected lockfile package versions. It is not an npm audit, not a complete inventory, does not reconcile the earlier 6-vulnerability count and does not prove that production dependencies are clear.
- Do not change dependencies. The workflow remains manual-only; run both exact `npm audit --package-lock-only --json` and `npm audit --package-lock-only --omit=dev --json` against the pinned baseline and inspect both uploaded JSON reports before disposition.

