# AI Collaboration Protocol — Victori3-mobile

> Revision 2026-11-21: new explicit owner role allocation. Claude Code is the primary implementation/code-authoring agent for future owner-authorized work. ChatGPT is technical lead, architecture coordinator, scope controller and independent no-write reviewer of Claude-authored work only when ChatGPT did not co-author it. Gemini Hydrogen supplies source-backed research/content; DeepSeek is an owner-assigned independent-review fallback when the normal reviewer has an authorship/conflict constraint. This supersedes the 2026-11-17 role allocation for future tasks only; historical reviews, task records, phase gates and author identities remain unchanged.

## Purpose

GitHub is the shared source of truth between:
- **Project owner:** owns scope, product decisions, approvals, and phase transitions.
- **ChatGPT:** technical lead, architecture coordinator, scope controller and independent reviewer where authorship independence permits.
- **Claude Code:** primary implementation/code-authoring agent for owner-authorized tasks; also reviews earlier work only when it did not author that work.
- **Gemini Hydrogen:** research and source-backed content support.
- **DeepSeek:** independent fallback reviewer only when assigned by the owner and genuinely independent.

This protocol does not itself authorize implementation, phase execution, signing changes, secret access, or merging.

## Roles

### Claude Code — primary implementation agent
- Is the default primary code author for future implementation tasks explicitly authorized by the owner and permitted by the current phase gate.
- Reads the complete mandatory entrypoint, recovery protocol, handoff, collaboration protocol, owner directives, canonical roadmap, phase specification, parity matrix and relevant source/tests before touching code.
- Owns bounded implementation slices end-to-end: domain contracts, code, tests, self-review, exact-SHA CI, commit/push, progress report and handoff update.
- Must separate simulation/domain logic, command validation, read models, persistence and UI; must not implement gameplay inside presentation components.
- Must not start a phase merely because it appears in the master brief. The exact phase/task must be open and owner-authorized.
- Must not independently approve or mark its own work REVIEW_PASS or ACCEPTED. If Claude authored a change set, that change set requires a genuinely independent reviewer.
- May perform no-write review of earlier changes only if Claude did not author or modify the exact reviewed change set. A later implementation role does not retroactively invalidate an independent review of someone else's work.
- Must not change package identity, signing, secrets, release workflow, save schema outside the approved phase, or other protected scope without separate authorization.

### ChatGPT — technical lead, architecture coordinator and independent reviewer
- Owns cross-system architecture coordination, dependency order, task decomposition, scope control and consistency with the owner-approved product direction.
- Prepares/refines specifications and bounded acceptance criteria; checks that Claude's plan respects the canonical roadmap and phase gate before implementation.
- Reviews Claude-authored code without writing to the reviewed change set. Review covers correctness, data invariants, algorithmic behavior, null/error handling, concurrency, determinism, migration, Android lifecycle, performance, tests and CI evidence.
- May issue an evidence-linked technical review verdict for Claude-authored work only when ChatGPT did not co-author or modify that same change set. Such a review does not equal owner acceptance.
- Coordinates parity matrix, source/provenance standards, CI evidence, handoff and cross-system integration.
- If ChatGPT has co-authored or modified the target change set, it must label its assessment as self-audit and request another independent reviewer; it must not claim independent REVIEW_PASS.
- Does not change phase/gate status, accept deliverables or authorize scope expansion on behalf of the owner.

### Gemini Hydrogen — research and content support
- Supplies historical research, country/person/event datasets, maps, imagery, asset provenance, licensing and specialist documentation when requested by the technical lead or project owner.
- Provides source URLs, publication/validity dates, methodology, uncertainty and attribution/licence details with research deliverables.
- Does not silently commit research as verified game data; integration and acceptance remain subject to the approved phase scope and review.

### DeepSeek — independent reviewer fallback
- May be assigned by the owner when ChatGPT cannot independently review due to authorship/conflict, or when the owner wants a second independent review.
- Must inspect the exact current HEAD and must not have authored or modified the reviewed change set.
- Uses the same evidence-linked REVIEW_PASS / CHANGES_REQUESTED / BLOCKED vocabulary.
- Does not receive implementation authority merely by serving as reviewer.

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

1. The owner authorizes a specific phase/task and scope; the current phase gate must permit it.
2. Claude reads the full mandatory project documents, current handoff, owner-approved specification and exact branch HEAD.
3. Claude prepares a bounded implementation plan with task ID, base SHA, files in/out of scope, contracts, invariants, risks, tests and expected artifacts. ChatGPT performs scope/architecture review; the owner supplies any approval genuinely missing.
4. Claude implements only the authorized scope on the designated branch. Gemini Hydrogen may supply separately assigned research/content inputs.
5. Claude runs targeted and full relevant tests, then updates the rolling report and AI_HANDOFF with exact SHAs, changed files, commands, exit codes, CI, artifacts, limitations and risks.
6. Claude commits/pushes the authorized change to the designated branch and supplies exact commit URL(s). No automatic PR, force-push, merge or protected configuration change.
7. ChatGPT performs an independent no-write review of Claude's exact change set only if ChatGPT did not co-author or modify it. If that independence condition is not met, the owner assigns DeepSeek or another independent reviewer.
8. Claude addresses bounded findings, reruns tests/CI and returns the corrected exact HEAD for re-review.
9. The owner explicitly accepts or rejects the result and authorizes the next phase. A code commit or CI pass alone is not acceptance.

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
- `REVIEW_PASS` — the assigned independent reviewer has passed the exact bounded review scope; owner decision still pending. Under the 2026-11-21 allocation, ChatGPT normally reviews Claude-authored work when it is independent; DeepSeek may substitute when assigned by the owner. Claude may review earlier work only when it did not author that exact work. Historical review records remain unchanged.
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
- Claude, as primary implementation agent, must not create a PR automatically. On the current single-branch repository, commit reviewable authorized changes to the designated branch and provide exact commit URL(s) to the independent reviewer; ChatGPT coordinates/reviews but does not silently take over code authorship.
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
