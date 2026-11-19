# Claude Code project entrypoint

Read the repository-root `AI_START_HERE.md` first, then obey `AGENTS.md`.

Before acting, read the latest `docs/coordination/AI_HANDOFF.md`, `docs/coordination/AI_COLLABORATION_PROTOCOL.md`, `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`, the owner-approved roadmap and the relevant exact task/spec/review packet.

The project is a global, systemic Android grand-strategy game using Victoria 3 as a mechanics/feature reference. The authoritative product requirements, detailed system breakdown, research rules, landscape-first APK + downloadable offline pack model, stability requirements and reporting cadence are documented in `AI_START_HERE.md`.

Do not infer implementation authorization from a design document or review request. Follow the current owner-approved phase gates. Research before implementing; cite and qualify historical data; do not copy proprietary Victoria 3 assets/code. Update the rolling report and AI_HANDOFF and commit/push each completed work slice with exact evidence. Preserve the independent-review rules in AI_COLLABORATION_PROTOCOL.

## Session recovery requirement

For every new session or lost/stalled chat response, read `docs/coordination/SESSION_RECOVERY_PROTOCOL_VI.md`. Verify GitHub HEAD, handoff, changed files and workflows before resuming or retrying. Never duplicate an ambiguous write or claim uncommitted work was saved.
