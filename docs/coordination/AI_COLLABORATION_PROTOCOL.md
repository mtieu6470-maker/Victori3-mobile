# AI Collaboration Protocol — Victori3-mobile

> Revision 2026-11-17: owner-directed role allocation. ChatGPT is technical lead/coordinator and authorized implementation agent; Claude Code is the independent reviewer for work it did not author; Gemini Hydrogen supplies research and source-backed materials; DeepSeek may be assigned as an independent fallback reviewer only when it did not author the work. This supersedes the earlier default assignment of Claude as implementer and ChatGPT as independent reviewer for subsequent tasks. Historical review records are unchanged.

## Purpose

GitHub is the shared source of truth between:
- **Project owner:** owns scope, product decisions, approvals, and phase transitions.
- **Claude Code:** implementation agent.
- **ChatGPT:** independent architect/reviewer.

This protocol does not itself authorize implementation, phase execution, signing changes, secret access, or merging.

## Roles

### ChatGPT — technical lead and coordinator
- Owns technical coordination: repository inspection, architecture and algorithm review, scope control, implementation of owner-authorized changes, tests, CI/log verification, GitHub commits, documentation and handoff.
- Reads this protocol, the current handoff, the owner-approved specification and the exact branch HEAD before acting.
- Makes focused changes only within the explicitly approved scope; records exact base/head SHAs, changed files, test commands, exit codes, CI evidence and limitations.
- May perform a technical self-audit of its own work, but must label it as a self-audit. It must never present its own work or self-review as an independent REVIEW_PASS.
- Prepares the review packet and responds to reviewer findings with bounded corrections. Does not accept its own work or advance a phase without the owner's decision.

### Claude Code — independent reviewer
- Reviews the exact repository branch/HEAD, changed-file range, source, tests, CI logs, artifacts and device evidence for work implemented by ChatGPT or another agent.
- Re-fetches the current HEAD before review and records the exact SHA and inspected evidence.
- Does not modify the reviewed branch or author the target changes during review. Returns evidence-linked findings and one bounded verdict: REVIEW_PASS or CHANGES_REQUESTED.
- A review is independent only when Claude did not author or modify the work being reviewed. If Claude contributes implementation to the same change set, another reviewer must be assigned.
- Does not build or install an APK, alter signing or secrets, or extend scope unless the owner separately authorizes that task.

### Gemini Hydrogen — research and content support
- Supplies historical research, country/person/event datasets, maps, imagery, asset provenance, licensing and specialist documentation when requested by the technical lead or project owner.
- Provides source URLs, publication/validity dates, methodology, uncertainty and attribution/licence details with research deliverables.
- Does not silently commit research as verified game data; integration and acceptance remain subject to the approved phase scope and review.

### DeepSeek — fallback reviewer
- May replace Claude as the independent reviewer when Claude is unavailable or out of quota, when the project owner assigns it.
- Must inspect the exact current HEAD and must not have authored or modified the reviewed change set. Otherwise it is a second implementer, not an independent reviewer.
- Uses the same evidence and verdict requirements as Claude. The project owner retains final acceptance authority.

### Project owner
- Owns scope, product decisions, approvals, device evidence and phase transitions.
- Supplies physical-device evidence when required.
- Never shares keystores, passwords, access tokens, or private keys in chat, issues, commits, or handoff files.

## Source-of-truth order

1. Latest explicit owner-approved decision/specification.
2. Approved phase scope and acceptance criteria.
3. Repository content at the exact reviewed commit SHA.
4. CI logs, tests, benchmark reports, artifacts, and device evidence.
5. `docs/coordination/AI_HANDOFF.md` as the status index.
6. Chat summaries are context only and cannot override repository evidence or owner decisions.

If sources conflict, stop and report the conflict. Do not silently choose one.

Canonical roadmap: `AI_HANDOFF.md` records its path and status. Until the owner approves a roadmap and it is committed (for example at `docs/roadmap/MASTER_ROADMAP.md`), its status is `PENDING_OWNER_APPROVAL`: no document in the repository is the canonical roadmap, and phase scope comes only from explicit owner authorizations. Older roadmaps and phase reports are historical evidence, indexed in `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md`; they do not authorize implementation.

## Standard task cycle

1. The owner authorizes a specific phase/task and scope.
2. ChatGPT reads this protocol, the current handoff, the owner-approved specification and the exact branch HEAD.
3. ChatGPT posts a plan covering files to change, files out of scope, tests, risks and expected artifacts. The owner supplies any required scope approval.
4. ChatGPT implements only the approved scope on the designated branch. Gemini Hydrogen may supply separately requested research/content inputs; DeepSeek may be assigned only within its stated fallback role.
5. ChatGPT runs relevant tests and updates the handoff with base/head SHAs, changed files, commands, exit codes, CI, artifacts, limitations and risks. All self-audit statements are labelled as such.
6. ChatGPT commits the authorized change to the designated branch and provides the exact commit URL(s). It does not create a PR unless the owner explicitly requests one (see "Branch and PR policy"). Never merge without explicit owner approval.
7. Claude independently reviews the exact current GitHub HEAD and its evidence without modifying the reviewed change set. DeepSeek may substitute only under the fallback rule above.
8. ChatGPT addresses bounded reviewer findings, updates evidence and returns the corrected exact HEAD for re-review.
9. The owner explicitly accepts or rejects the reviewed result and authorizes the next phase.

## Required handoff evidence

Every task records:
- Task/phase ID and approved scope reference.
- Base SHA and resulting commit SHA(s).
- Changed files and rationale.
- Exact test/build commands and exit codes.
- CI run URL, job results, test counts, failures, and artifact URLs.
- Device model, OS/build, app version, procedure, raw measurement file for device claims.
- Save/load or migration evidence when relevant.
- Known limitations, unsupported measurements, and unresolved risks.
- Implementer self-assessment, labelled **unverified** until independent review.
- Independent reviewer identity, exact reviewed HEAD and verdict (Claude or owner-assigned DeepSeek fallback).
- ChatGPT technical status and owner decision, filled only by the respective party.

## Status vocabulary

Two separate dimensions. Do not mix them.

### Task lifecycle status (applies to a task or phase)

- `NOT_STARTED`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `BLOCKED`
- `REVIEW_PASS` — the assigned independent reviewer has passed the exact bounded review scope; owner decision still pending. Under the current owner-directed allocation, this is normally Claude Code, or DeepSeek only when the owner assigns it as an independent fallback. Historical review records identifying ChatGPT as reviewer remain unchanged.
- `ACCEPTED` — owner explicitly accepted.
- `REJECTED`
- `DEFERRED`

### Gate verdicts (apply to one acceptance criterion or gate, e.g. S0 gates G0.1–G0.9)

- `PASS` — the criterion was run and met, with evidence.
- `PARTIAL` — the criterion was run but only partly met.
- `BLOCKED` — could not be evaluated because a dependency, permission, device, or input is unavailable.
- `FAIL` — the criterion was evaluated and violated.
- `NOT_TESTED` — no test was performed.
- `NOT_APPLICABLE` — the criterion genuinely does not apply, with a written reason.

`PARTIAL`, `NOT_TESTED` and `NOT_APPLICABLE` are not task lifecycle states. Never convert `BLOCKED` or `NOT_TESTED` to `PASS` because a test could not be run or by relabelling. Never mark `ACCEPTED` without explicit owner approval.

### Pre-protocol work classification

- `PRE_PROTOCOL_IMPLEMENTED_REPORTED` — historical work with reported commits/tests, done before this protocol and not yet assessed under its stage-gate process. It is neither `REVIEW_PASS` nor `ACCEPTED`. It is part of the current baseline: audits verify what is actually present at the frozen SHA and do not reimplement it merely because it predates the protocol. Register: `docs/roadmap/LEGACY_DOCUMENTS_INDEX.md`.

## Branch and PR policy

The repository currently has one branch, `claude/game-historical-sandbox-modes-kg7rj7`, which is also the default branch.

- Use the existing sole development/default branch for owner-authorized work while it remains the only branch.
- Direct pushes to that branch are allowed only for a task whose scope the owner explicitly authorized.
- Never force-push, rewrite shared history, or push unapproved scope.
- Do not create a `main` branch merely to satisfy a generic PR convention.
- Create another branch only when the owner explicitly asks for branch isolation or a separate release/stable branch.
- ChatGPT, as technical lead/implementer, must not create a PR automatically. On the current single-branch repository, commit reviewable authorized changes to the designated branch and provide the exact commit URL(s) to the independent reviewer.
- Create a PR only when the owner explicitly requests one and a distinct base/target branch exists. A PR is not required when there is no distinct target branch.
- Never merge without explicit owner approval.
- Use focused commits, one reviewable slice at a time; record exact base and head SHAs for every review.

## Security policy

- Never place secrets, keystores, passwords, tokens, signing material, or personal data in repository files, issues, logs, artifacts, or chat.
- Normal build/test jobs must not receive signing secrets.
- Signing must use a protected GitHub Environment and a separately gated signing job, after the owner approves the design.
- This protocol does not authorize creation of a keystore or GitHub secret.
- If additional permissions or secrets are required, stop and ask the owner.

## Project guardrails

- Historical and Sandbox/Alternate History modes share the same simulation engine unless an approved specification explicitly says otherwise.
- Global country coverage is required. Vietnam, Britain, Qing, or any showcase subset cannot substitute for worldwide systems.
- Provinces/administrative units, settlements, buildings, population, economy, politics, diplomacy, military, and visual assets must be real systems, not decorative numbers.
- No gameplay, engine, or save-format changes during S0.
- S0 cannot begin until the owner explicitly approves its final specification.
- No later phase begins until the previous phase has `REVIEW_PASS` and owner `ACCEPTED`.
- **For S0 under the approved v3.3 transition procedure, `REVIEW_PASS` may apply only to the bounded S1-entry evidence package with its explicitly listed exceptions; it does not certify that every S0 gate passed or that S0 is fully complete. The owner's `ACCEPTED` decision accepts only that limited transition and its stated S1 scope. The overall S0 gate verdict remains `PARTIAL`/`BLOCKED` until G0.1–G0.9 are all `PASS`.** (Added by owner decision OD-20261116-11; see `docs/roadmap/S0_V3_3_OWNER_DECISION_AND_AMENDMENTS.md` §2.2.)

## Uncertainty and disputes

If evidence is unavailable, contradictory, or irreproducible:
1. Mark `BLOCKED` or `FAIL`.
2. State exactly what is missing.
3. Preserve current files and logs.
4. Do not fabricate values or infer PASS.
5. Ask for the smallest necessary owner action.

## Completion definition

A task is complete only when implementation, evidence, handoff update, independent review, and owner decision are recorded. A successful commit or CI run alone is not completion.


## Session continuity and failure recovery

All agents must follow `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md` when starting a new session or recovering from a stalled/lost chat response, network congestion, GitHub timeout, rate limit, or ambiguous write result. GitHub commits at the latest verified branch HEAD are the durable checkpoints. Before retrying a write, inspect the branch, commit history, target file and workflow status to avoid duplicate operations or overwriting newer work. If repository state cannot be verified after bounded retries, stop writes and report `BLOCKED`; do not infer success or failure. The owner may resume in a new chat with the recovery prompt in that document; no full project re-explanation should be required.
