# AI Handoff — Victori3-mobile

> Shared status index for Claude Code, ChatGPT, and the project owner. Never put secrets or personal data here.

## 1. Current project state

| Field | Value |
|---|---|
| Repository | `mtieu6470-maker/Victori3-mobile` |
| Development branch observed | `claude/game-historical-sandbox-modes-kg7rj7` |
| Last independently observed baseline | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` |
| Current approved phase | NONE — awaiting final S0 specification approval |
| Current task status | NOT_STARTED |
| S0 execution authorized | NO |
| Gameplay/engine/save changes authorized | NO |
| Signing/keystore/Secrets changes authorized | NO |

The SHA above is a historical observation. Re-check GitHub HEAD before every task.

## 2. Current gate — do not start S0

Until the owner explicitly approves the final S0 specification:
- No S0 audit execution.
- No Diagnostic UI, CI workflow, signing, keystore, or secret changes.
- No gameplay, engine, data, UI, test, or save-format changes.
- No S1 or later work.

Documentation review is allowed only when separately requested.

## 3. Coordination setup task

| Field | Value |
|---|---|
| Task ID | `COORDINATION-SETUP` |
| Scope | Add collaboration protocol and shared handoff index only |
| Base SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` (re-check before commit) |
| Result SHA | Pending |
| Status | `READY_FOR_REVIEW` after files are committed; otherwise `NOT_STARTED` |
| Out of scope | All code, gameplay, workflows, Gradle, signing, secrets, save schema, assets, and S0 execution |

## 4. Phase register

| Phase | Status | Entry condition | Exit condition |
|---|---|---|---|
| S0 — Baseline audit and diagnostic tooling | `BLOCKED` | Owner approves final S0 specification and security design | All S0 gates evidenced; ChatGPT `REVIEW_PASS`; owner `ACCEPTED` |
| S1 — Data architecture and save foundation | `NOT_STARTED` | S0 accepted and S1 scope separately approved | S1 acceptance criteria met; independent review; owner accepted |
| S2+ | `NOT_STARTED` | Previous phase accepted and next scope approved | Phase-specific acceptance and owner approval |

Use the latest owner-approved roadmap for detailed phase scope. This table is not a substitute for that roadmap.

## 5. Work log

Append newest entries at the top. Do not overwrite earlier entries.

### Entry template

- Date (UTC):
- Task/phase:
- Implementer:
- Base SHA:
- Head SHA:
- Changed files:
- Summary:
- Commands and exit codes:
- Test results (counts and failures):
- CI run/jobs:
- Artifacts:
- Device evidence:
- Risks/limitations:
- Claude status (unverified):
- ChatGPT review:
- Owner decision:

## 6. Review findings

| ID | Severity | Finding | Evidence | Status | Required action |
|---|---|---|---|---|---|
| — | — | No findings recorded yet | — | — | — |

## 7. Owner decisions

Only explicit owner decisions may be recorded here. Recommendations are not approvals.

| Date (UTC) | Decision ID | Decision | Scope | Evidence/reference |
|---|---|---|---|---|
| — | — | No new phase approval recorded | — | — |

## 8. Update rules

- Claude updates status and implementation evidence after each approved task.
- ChatGPT appends independent review findings after checking GitHub.
- The owner-decision section changes only after an explicit owner decision.
- Preserve the work log; append rather than overwrite.
- If HEAD changes during review, report the new SHA and re-review that exact commit.
- A handoff update never substitutes for source code, logs, tests, or artifacts.
