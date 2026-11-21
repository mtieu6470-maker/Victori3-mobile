# Repository-wide AI agent instructions

Before any code, data, test, asset, build or workflow change:

1. Read `AI_START_HERE.md` at repository root.
2. Read `docs/coordination/AI_HANDOFF.md` and fetch the latest HEAD of the designated branch.
3. Read `docs/coordination/AI_COLLABORATION_PROTOCOL.md`.
4. Read `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`.
5. Read the owner-approved roadmap/decision amendments and the exact subsystem spec/task review packet.
6. Read the complete docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md and docs/coordination/OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md; Claude is Project Director and has autonomous execution authority under the 2026-11-21 owner instruction.
6. Inspect the latest feature-parity matrix and progress report relevant to the task.
7. Read `docs/coordination/AI_MESSAGE_BOARD.md` and handle every OPEN message addressed to you (Claude ↔ ChatGPT coordinate there directly; contact the owner only for owner-reserved decisions).

## Hard requirements

- Treat GitHub at the latest verified HEAD as project memory and source of truth; chat history is context only.
- Do not ask the owner to repeat a requirement already recorded in these files.
- Do not infer implementation authority from a design proposal or review request alone. The latest owner directive 2026-11-21 delegates project-wide ordinary implementation and phase sequencing to Claude; preserve underlying data/save/security checks and all owner-reserved external actions.
- Victoria 3 is a reference for mechanics and feature breadth, not a source from which to copy code, data files, text, art, music or other proprietary assets.
- Research mechanics and historical claims before implementation. Record URLs, dates, page/table/section, method, uncertainty and licensing/provenance. Never fabricate historical values.
- Build globally integrated gameplay, not decorative counters, disconnected screens or placeholder features.
- The target is an Android APK, landscape-first, with the owner-directed base APK + separately downloadable verified data/content pack architecture and explicit online consent. Audit actual implementation; do not claim this exists just because build assets are compressed into the APK.
- Prioritize correctness, save integrity, crash/ANR avoidance, smoothness and bounded RAM/CPU/GPU/storage/thermal cost. Never claim physical-device QA from CI.
- Keep simulation rules out of UI components; use explicit domain contracts and deterministic state transitions.
- After every completed work slice, run relevant tests, record exact commands/results and SHA, update the rolling report and AI_HANDOFF, then commit/push the report with the change.
- Never report tests/build/device checks as PASS without evidence for the exact commit. Label self-audits as self-audits.
- Never bypass permissions, change signing/secrets/package identity/release workflow, force-push or merge without authorization.
- Keep changes bounded and reviewable. Claude may decide ordinary technical scope/order without routine owner approval. Preserve security, privacy, licensing, cost and data-integrity safeguards; resolve ordinary source conflicts using the latest owner directive and record the rationale.

## Required completion handoff

Report: task/scope ID; base SHA and new commit SHA; changed files; rationale; tests and exit codes; CI URLs; APK/artifact hashes if applicable; physical device evidence if actually collected; save/data migration evidence; unresolved issues; implementer self-review and exact verdict; advisory critique if requested; owner-reserved decision if applicable; next task.

Start from `AI_START_HERE.md`, not from an old chat transcript.

## Session/network failure recovery

Read `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md` before resuming work after a new session, lost chat response, timeout, rate limit or ambiguous GitHub write. Verify current branch HEAD and inspect commits/files/workflows before retrying any operation. Never blindly repeat non-idempotent writes, overwrite newer SHAs, or claim uncommitted work persisted. If GitHub remains unreachable after bounded retries, stop writes and report `BLOCKED` with the last verified SHA and exact uncertainty.
