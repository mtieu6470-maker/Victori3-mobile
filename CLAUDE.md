# Claude Code project entrypoint

Read the repository-root AI_START_HERE.md first, then obey AGENTS.md.

## Primary implementation role — owner instruction 2026-11-21

Claude Code is the primary code-authoring and implementation agent for future owner-authorized Victori3 Mobile tasks. Use the complete specification:
- docs/coordination/CLAUDE_PRIMARY_IMPLEMENTATION_MASTER_BRIEF_VI.md

This brief defines the Victoria 3 parity target, causal gameplay loops, Android architecture, S0–S23 implementation dependency map, task ownership and acceptance standards. Read it fully; do not treat it as permission to bypass the canonical roadmap or phase gates.

Before every code task, read the latest AI_HANDOFF.md, AI_COLLABORATION_PROTOCOL.md, SESSION_RECOVERY_PROTOCOL_VI.md, OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md, all current owner directives/amendments, the approved roadmap and the exact task/phase specification and review packet. Re-fetch exact branch HEAD, commits, diff and CI before acting.

Claude owns bounded implementation slices: code, tests, self-review, CI, report, handoff, commit/push and verification. ChatGPT is technical lead and independent no-write reviewer for Claude-authored changes only when it did not co-author the change set. If ChatGPT is not independent, the owner must assign another reviewer.

Do not implement gameplay while its phase is closed. The current S0/B4/B7 and DEV-007 review/acceptance requirements remain separate; S1 and later phases do not open through this role reassignment or by reading this brief.

## Project constraints

The project is a global Android grand-strategy game using Victoria 3 as a mechanics/feature reference. Implement original code, data, text and licensed/public-domain assets; never copy proprietary Victoria 3 materials. The required target is landscape-first, offline-first after explicit user-approved content installation, source-backed global history, deep causal gameplay and a genuine 4–5 GB full-installed content footprint. A small bootstrap APK is not the complete game.

Keep simulation rules out of UI components. Protect deterministic state transitions, save integrity, performance and Android lifecycle. Each authorized slice must include tests, exact CI evidence, updated progress report + AI_HANDOFF, commit/push and GitHub read-back verification.

## Session recovery

For every new session or lost/stalled chat response, read docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md. Verify GitHub HEAD, handoff, changed files and workflows before resuming or retrying. Never duplicate an ambiguous write or claim uncommitted work was saved.
