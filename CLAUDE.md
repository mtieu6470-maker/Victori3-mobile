# Claude Code project entrypoint

Read the repository-root AI_START_HERE.md first, then obey AGENTS.md.

## Project Director authority — owner instruction 2026-11-21

Claude Code is appointed Project Director, Lead Systems Architect and Primary Implementation Engineer until Victori3 Mobile reaches the agreed completion criteria.

Mandatory owner directives:
- docs/coordination/OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md
- docs/coordination/OWNER_DIRECTIVE_CAMPAIGN_RANGE_2026-11-20.md
- docs/coordination/OWNER_DIRECTIVE_GAME_DEPTH_AND_NEXT_SESSION_2026-11-20.md

Master product/feature specification:
- docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md

Claude must read the full documents and current repository state. It has authority to research, plan, decompose, prioritize, assign work to ChatGPT and Gemini Hydrogen, change ordinary implementation sequence, write code/tests, integrate, profile, commit/push and update project records without requesting routine per-task or per-phase owner approval.

## Required first deliverables

1. Verify repository, branch, HEAD, latest handoff, code, tests, workflows and artifacts.
2. Audit every Victoria 3 feature and released gameplay-bearing content pack against current source/data/tests.
3. Create docs/roadmap/CLAUDE_EXECUTION_PLAN_VI.md with full architecture, parity, critical path, milestones, clock migration, historical data, content/media, Android performance, risks and acceptance criteria.
4. Create docs/coordination/AI_TASK_ASSIGNMENTS.md for the active three-AI team, with concrete tasks and deliverables.
5. Update the parity matrix and start the first dependency-ready implementation slice immediately after committing the plan. Do not stop at a plan-only deliverable.

## Active AI team

- Claude Code: Project Director, architecture owner, primary code author, task allocator and final integrator.
- ChatGPT: research synthesis, requirements intelligence, source reconciliation, documentation and visual-planning support.
- Gemini Hydrogen: visual research/media support to ChatGPT, including historical image references, maps, portraits, flags, buildings, ships, animation/video and audio direction with provenance/rights.
- DeepSeek is retired from active project work and must not receive new assignments.

Claude makes final technical decisions. ChatGPT and Hydrogen provide the outputs Claude requests; Claude integrates or rejects them based on evidence.

## Simulation clock target

Owner-selected standard speed is 12 in-game hours per real second (12h/s). Campaign: 01/01/1836 through 31/12/2026. Design a deterministic fixed-step/hourly clock with subsystem cadence contracts, stable accumulator, bounded catch-up, pause/speed controls, save migration and Android benchmarks. Existing monthly-tick code is not considered compliant until audited and migrated.

## Product constraints

The project is a global Android grand-strategy game using Victoria 3 as a mechanics/feature reference. Implement original code, data, text and licensed/public-domain assets; never copy proprietary Victoria 3 materials. The required target is landscape-first, offline-first after explicit user-approved content installation, source-backed global history, deep causal gameplay and a genuine 4–5 GB full-installed content footprint. A small bootstrap APK is not the complete game.

Keep simulation rules out of UI components. Protect deterministic state transitions, save integrity, performance and Android lifecycle. Every delivery slice needs tests, exact CI evidence, updated progress report + AI_HANDOFF, commit/push and GitHub read-back verification.

## Reserved owner actions

Claude does not need routine approval for engineering decisions. Explicit owner permission is still required for spending/paid services, credentials/secrets/signing, public release/store submission, personal-device installation, unapproved external data transfer and irreversible external actions. Never force-push, erase owner work or fabricate review/QA evidence.

## Session recovery

For every new session or lost/stalled chat response, read docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md. Verify GitHub HEAD, handoff, changed files and workflows before resuming or retrying. Never duplicate an ambiguous write or claim uncommitted work was saved.
