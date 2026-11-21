# AI Collaboration Protocol — Victori3-mobile

> Revision 2026-11-21 (owner execution directive): Claude Code is Project Director, Lead Systems Architect and Primary Engineer with authority to plan, delegate, sequence and execute the project to completion without routine per-task/per-phase owner approval. ChatGPT synthesizes requirements/research and supports visual planning; Gemini Hydrogen supports ChatGPT with visual/media research. DeepSeek is retired from active project work. This supersedes prior active role allocation and routine phase-approval requirements; historical records remain archival and must not be rewritten.

## Purpose

GitHub is the shared source of truth between:
- **Claude Code:** Project Director, Lead Systems Architect and Primary Engineer; owns implementation and final technical decisions.
- **ChatGPT:** research synthesis, requirements intelligence, documentation and visual-planning support.
- **Gemini Hydrogen:** visual research and media support to ChatGPT.
- **Project owner:** reserves external actions, spending, credentials, release/publication and final product acceptance.

This protocol records the owner's project-wide execution delegation to Claude. Routine implementation and phase sequencing do not require new per-task approval; reserved external actions and security safeguards remain restricted.

## Roles

### Claude Code — Project Director, Lead Systems Architect and Primary Engineer
- Owns end-to-end project delivery, architecture, roadmap, task breakdown, priorities, AI assignment, production code, tests and final integration.
- Has authority to plan, sequence, reprioritize and execute ordinary dependency-ready implementation work without per-task/per-phase owner approval.
- Creates and maintains docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md and docs/coordination/AI_TASK_ASSIGNMENTS.md.
- Delegates research synthesis and visual/media work to ChatGPT and Gemini Hydrogen with exact outputs, source/provenance requirements and acceptance checks.
- Performs implementer self-review, runs tests/CI, commits/pushes to the designated branch and records exact evidence.
- May request ChatGPT advisory review but remains final technical decision-maker.
- Must not claim an independent review of its own work or fabricate evidence.
- Must not spend money, use paid services, expose secrets, perform unapproved release/store publication, install on the owner's device, force-push, erase owner work or take other reserved irreversible actions.

### ChatGPT — Research Synthesis and Requirements Intelligence
- Collects, compares, reconciles and synthesizes Victoria 3 mechanics, official patch/DLC behavior, historical research, architecture references, Android constraints, performance techniques and system dependencies.
- Produces traceable briefs, feature comparisons, requirement maps, source registers, acceptance criteria, risk notes and cross-system summaries for Claude.
- Supports visual planning with art direction, asset taxonomy, era/style references, image prompts/briefs, asset coverage maps and visual QA criteria.
- Does not own primary code authorship, project priority or final integration decisions. Claude directs and decides.
- May provide advisory technical critique when Claude requests it.

### Gemini Hydrogen — Visual Research and Media Support to ChatGPT
- Supports ChatGPT with visual research for flags, coats of arms, portraits, uniforms, buildings, ships, maps, terrain, period architecture, animation/video references, music and sound direction.
- Supplies source links, date/region/entity mapping, license/rights, provenance, confidence and asset metadata.
- Distinguishes historical reference material, generated concept art and distributable licensed/original production assets.
- Delivers visual boards, image briefs, asset manifests and visual QA notes as assigned by Claude or ChatGPT.
- Does not silently convert unsupported images into historical facts or ship unlicensed references.

### Project owner
- Defines product intent and receives concise progress summaries.
- Reserves decisions involving spending/paid services, credentials/secrets/signing, public release/store submission, personal-device installation, unapproved external data transfer and irreversible external actions.
- Does not need to approve routine technical choices, task ordering or ordinary phase progression.
- Never shares keystores, passwords, access tokens or private keys in chat, issues, commits or handoff files.

## Source-of-truth order

1. Latest explicit owner-approved decision/specification.
2. Approved phase scope and acceptance criteria.
3. Repository content at the exact reviewed commit SHA.
4. CI logs, tests, benchmark reports, artifacts, and device evidence.
5. `docs/coordination/AI_HANDOFF.md` as the status index.
6. Chat summaries are context only and cannot override repository evidence or owner decisions.

If sources conflict, Claude resolves ordinary technical/product implementation conflicts using the latest owner directive and records the rationale. If the conflict involves a reserved owner action, legal rights, spending, privacy, secrets, destructive data loss or contradictory explicit owner decisions, stop only that affected action and continue safe independent work.

Canonical execution plan: Claude creates and maintains `docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md`. The old S0–S23 roadmap and gate records remain dependency/evidence inputs; they do not require a new owner approval for each ordinary implementation task. Claude may revise sequencing and workstream status after checking technical prerequisites and preserving underlying safety/integrity checks.

## Standard task cycle

1. Claude verifies repository, branch, exact HEAD, current handoff, owner directives, source docs, code, tests and CI.
2. Claude audits the requested system and updates the parity/task register with evidence.
3. Claude creates or updates the execution plan and AI assignment register. Routine task ordering and implementation do not require another owner prompt.
4. Claude delegates source synthesis to ChatGPT and visual/media research to Gemini Hydrogen when useful. Each assignment has objective, context, exact deliverable, format, source/rights requirements, acceptance checks and integration owner.
5. Claude implements the next dependency-ready vertical slice. Claude may reorganize the roadmap when new evidence shows a better dependency order.
6. Claude runs focused tests, relevant regression suites, build/CI and profiling as applicable. It records exact commands, exit codes, tested SHA, CI run, artifacts and unresolved risks.
7. Claude updates parity matrix, execution plan, AI_TASK_ASSIGNMENTS.md, rolling progress report and AI_HANDOFF.md; commits/pushes to the designated branch and verifies GitHub read-back.
8. ChatGPT may provide requested advisory critique and research reconciliation; Gemini provides visual/media support. Claude makes final technical decisions and integrates deliverables.
9. Claude proceeds to the next dependency-ready task. It does not stop for routine per-phase/per-task approval. The owner is contacted only for a reserved action or a genuinely ambiguous product decision that cannot be resolved from existing requirements.
10. At project completion, Claude presents a concise evidence-based completion report. The owner retains final product acceptance.

## Required handoff evidence

Every task records:
- Task/phase ID and source owner directive or execution-plan reference.
- Base SHA and resulting commit SHA(s).
- Changed files and rationale.
- Exact test/build commands and exit codes.
- CI run URL, job results, test counts, failures, and artifact URLs.
- Device model, OS/build, app version, procedure, raw measurement file for device claims.
- Save/load or migration evidence when relevant.
- Known limitations, unsupported measurements, and unresolved risks.
- Implementer self-review, exact reviewed HEAD, test evidence and verdict.
- ChatGPT advisory critique/research synthesis when requested. Do not claim an independent third-party verdict unless a genuinely independent reviewer was actually assigned.
- ChatGPT research/technical synthesis status and owner-reserved decisions, filled by the respective party.

## Status vocabulary

Two separate dimensions. Do not mix them. Claude owns implementation status and must preserve truthful evidence; the absence of a separate AI reviewer does not block routine progress.

### Task lifecycle status (applies to a task or phase)

- `NOT_STARTED`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `BLOCKED`
- `REVIEW_PASS` — use only when a genuinely independent review actually occurred. Claude self-review and ChatGPT advisory critique are not an independent REVIEW_PASS. Do not require this label as a blocker for ordinary work under the 2026-11-21 execution directive.
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

- Use the existing designated development/default branch unless Claude's execution plan records a technical reason for branch isolation.
- Direct pushes to the designated branch are allowed for work within the owner-delegated project scope.
- Never force-push, rewrite shared history, or push unapproved scope.
- Do not create a `main` branch merely to satisfy a generic PR convention.
- Create another branch only when the owner explicitly asks for branch isolation or a separate release/stable branch.
- Claude, as Project Director/Primary Engineer, may use focused commits and the designated branch. PR creation/merging remains subject to repository safety and explicit owner authorization where an external merge action is required.
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
- Global country coverage is required. Vietnam, Britain, Qing or any showcase subset cannot substitute for worldwide systems.
- Provinces/administrative units, settlements, buildings, population, economy, politics, diplomacy, military and visual assets must be real systems, not decorative numbers.
- Owner target simulation speed is 12 game-hours per real second at 1.0x, with deterministic scheduler, cadence contracts, safe save migration and Android performance evidence. Existing monthly-tick code is not assumed to meet this target.
- Campaign range is 1 January 1836 through 31 December 2026 inclusive. No January 2027 tick.
- Claude may proceed across implementation workstreams without per-phase owner approval. S0–S23 are retained as dependency/audit references, not routine authorization barriers.
- Preserve the substance of old gate checks when they protect save integrity, determinism, security, provenance or data safety. Historical verdicts remain historical; never relabel old BLOCKED/PARTIAL as PASS without evidence.
- No paid services, unapproved spending, credentials/secrets/signing key exposure, public release/store submission, personal-device installation or unapproved external data transfer.
- No copying proprietary Victoria 3 code, text, data or expressive assets. Research mechanics; implement independently with original/licensed material.
- DeepSeek is not in the active team or any new assignment. Historical mentions remain archival only.

## Uncertainty and disputes

If evidence is unavailable, contradictory, or irreproducible:
1. Mark `BLOCKED` or `FAIL`.
2. State exactly what is missing.
3. Preserve current files and logs.
4. Do not fabricate values or infer PASS.
5. Ask for the smallest necessary owner action.

## Completion definition

A task is complete when implementation, tests, evidence, handoff update and Claude's self-review are recorded. ChatGPT may provide advisory critique when requested. The full product is complete only when the execution-plan definition of done is met and the owner gives final product acceptance. A successful commit or CI run alone is not completion.


## Session continuity and failure recovery

All agents must follow `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md` when starting a new session or recovering from a stalled/lost chat response, network congestion, GitHub timeout, rate limit, or ambiguous write result. GitHub commits at the latest verified branch HEAD are the durable checkpoints. Before retrying a write, inspect the branch, commit history, target file and workflow status to avoid duplicate operations or overwriting newer work. If repository state cannot be verified after bounded retries, stop writes and report `BLOCKED`; do not infer success or failure. The owner may resume in a new chat with the recovery prompt in that document; no full project re-explanation should be required.
