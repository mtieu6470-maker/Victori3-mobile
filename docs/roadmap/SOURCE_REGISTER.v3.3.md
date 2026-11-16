# SOURCE REGISTER — S0 v3.3 (amendment to v3.2)

**Version:** v3.3, 2026-11-16. Companion to the owner-accepted S0 v3.3 amendment (OD-20261116-11). `SOURCE_REGISTER.v3.2.md` stays valid for everything v3.3 does not change. Recorded by Claude Code.

## 1. What "S0 v3.3" consists of

The accepted v3.3 is the proposal **as amended by** the owner decision; both files are committed byte-for-byte, nothing was merged or rewritten. Where they differ, the decision document wins (its §2–§7), and v3.2 stays in force except for the narrow parts v3.3 replaces.

| Document | Repository path | SHA-256 | Size / lines | Status |
|---|---|---|---|---|
| S0 v3.3 gate-restructure proposal | `docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` | `929c06f4b993a6c395d3633bcb8b207554c833d023debe073cb5252f51929cf5` | 21 502 bytes / 239 lines | Accepted with amendments (OD-20261116-11). Its own header still says "DỰ THẢO … CHỜ CHỦ DỰ ÁN CHẤP NHẬN" because it is the verbatim pre-acceptance text |
| Owner decision and amendments | `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` | `582a8a4e3f0275f5b88debf8b90967c84c077684c104540fc6a5e961847267b6` | 18 012 bytes / 139 lines | Confirmed by the owner in the Claude Code session on 2026-11-16 as the official decision OD-20261116-11. Its own header still says "DỰ THẢO … chưa phải owner decision" because it is the verbatim text that the owner then confirmed |
| Roadmap v3.2 (unchanged) | `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` | `208a08ef46f7623d6ebbec02765fc1c70cbfcee09af7b4555aa8f7fb85f7b3e8` | — | Owner-approved (OD-20261116-09); still canonical except the replaced clauses below |

Clauses of v3.2 replaced or clarified by v3.3 (decision §2):
- v3.2 §6.3 B2, the sentence "… C3 `BLOCKED`, S0 dừng tại cổng này": replaced in a narrow scope. A blocked B2 keeps B2/B5/B6 blocked, but no longer blocks B3/B4/B7.
- v3.2 §6.4 G0.9 with C3 `BLOCKED`: still applies to the full S0 verdict. For the bounded S1-entry package, C3/B2 is treated as an isolated, deferred P1 workstream. This is not a waiver and does not relabel G0.9.
- `AI_COLLABORATION_PROTOCOL.md`: one sentence added on what `REVIEW_PASS` means for the bounded S1-entry package (decision §2.2).

Conflict order (decision §4.1):
1. later explicit owner decisions;
2. decisions fixed in v3.2, except the parts v3.3 replaces;
3. `MASTER_SPEC_VI.md` for product requirements;
4. the roadmap for sequence and acceptance;
5. audit reports, which are evidence of current state only.

Any other conflict is recorded as a finding and work stops at the affected point.

## 2. Canonical requirement source for G0.4

| Field | Value |
|---|---|
| Document | `MASTER_SPEC_VI.md` — "CURRENTS OF HISTORY — MASTER GAME DESIGN & TECHNICAL REQUIREMENTS / Đặc tả tái cấu trúc toàn diện cho game Grand Strategy Android (1836–1936)" |
| Identity stated in the owner decision §4 (project Library) | version 1; 50 355 bytes; 753 lines; SHA-256 `d7fa8995dee96046da79d23dd16b2c56c2e0acd0330b28e05d8a0a3ff6afc2f8` |
| Repository copy | `docs/spec/MASTER_SPEC_VI.md` — byte-for-byte; SHA-256 checked before commit and from the committed blob |
| Where Claude's copy came from | Entry `Currents_of_History_Handover/MASTER_SPEC_VI.md` of the owner's handover package `Currents_of_History_Handover.zip` (ZIP SHA-256 `1485e5b685a8a37810da245061154a5c79100dea6229a203448b7a4d73ed4744`), received in the Claude Code session on 2026-11-16. The extracted entry hashes to the Library identity above |
| Scope for G0.4 | Normative requirements in §§0–17. §§18–19 are references and concept illustrations, not feature criteria; no data or text is taken from concept art. The illustrations and the `.docx`/`.pdf` editions of the package are **not** committed |
| Related, non-canonical | `docs/audit/MASTER_SPEC_AUDIT.md` (commit `2240a8f`) is evidence of the earlier audit, not the requirement list |

## 3. Evidence referenced by v3.3

| Item | Reference |
|---|---|
| B1 commit | `382aaa84b2336854b4dbebfcdc719847ff463f41` (workflow only) |
| B1 CI run / job | `43834719406` / `133188390842` — success |
| B1 artifacts | APK ZIP `14210308010` (ZIP SHA-256 `7717a2b79dd46fbf613845e33bac3a17634eae5b0c808328d8b21b5abc150ba0`; APK file SHA-256 `314c8ca11c1d747550bbdb982326675e5f9dbdac870f3fc1cf04b9de7c22585c`); evidence ZIP `14209784110` (SHA-256 `53cab2e334f59a92aed1ffb6404dd62cc534b943692885a9b45d9c2c3d578f05`). Both expire on 2027-02-14 |
| B1 evidence in the repository | `docs/audit/s0/S0_B1_CI_EVIDENCE.md`, `docs/audit/s0/logs/b1/` (commit `e13d964f343ab1ba01fb705fbbd8bcac2674ea80`) |
| Upstream code read for the B1 reporter | Vitest `v2.1.9`: `packages/vitest/src/node/reporters/json.ts`, `packages/runner/src/utils/tasks.ts`, cited by the reviewer. The installed copies `node_modules/vitest` 2.1.9 and `node_modules/@vitest/runner` 2.1.9 were checked by Claude |

## 4. Environment limits recorded under v3.3 (decision §5)

- **Desktop browser measurements:** headless Chromium with SwiftShader (software WebGL) in Claude's container. Not representative of GPU-accelerated desktops; never a substitute for iQOO Z10 Turbo measurements.
- **`actionlint`:** `NOT_TESTED`. Running the downloaded binary was refused by the environment policy; no workaround was attempted.
- **CI failure path:** not exercised end-to-end on GitHub Actions; only a local negative probe exists.
