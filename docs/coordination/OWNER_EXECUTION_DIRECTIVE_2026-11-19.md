# OWNER EXECUTION DIRECTIVE — Victori3 Mobile

**Date:** 2026-11-19  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Source:** Explicit project-owner instruction in the ChatGPT project session on 2026-11-19.  
**Recording status:** Captured by ChatGPT from the owner's instruction; this file does not impersonate an owner-signed decision or a Claude review.

## 1. Delegated execution responsibility

The project owner delegates day-to-day technical execution and coordination to ChatGPT. ChatGPT is to continue the project proactively, choose the next bounded engineering task from the repository's approved specifications and roadmap, implement it, test it, update reports/handoff, commit/push, and verify the exact result on GitHub.

The project target and product requirements remain those in `AI_START_HERE.md`, `AGENTS.md`, `AI_COLLABORATION_PROTOCOL.md`, the standing owner principles, the canonical roadmap and task-specific specifications. Do not ask the owner to repeat requirements already documented.

This delegation removes the need to ask for a separate confirmation for every routine implementation detail inside an already-authorized task. It does **not** permit silently changing owner decisions, skipping required phase order, fabricating independent review, marking a gate accepted without evidence, or representing a draft as an approval. Claude remains the independent reviewer where the collaboration protocol requires independent review; the project owner retains formal acceptance and phase-transition decisions unless a later explicit owner decision changes that rule.

## 2. Product outcome

Build an Android grand-strategy game with Victoria 3-class systemic depth and global scope, using original project code, data compilation, text, art and assets. Victoria 3 is a mechanics and feature-depth reference only; do not copy proprietary code, extracted game data, text, images, music or other assets.

- Historical Mode starts in 1836 with source-backed, temporally valid, worldwide historical data and plausible simulation rather than scripted outcomes.
- Sandbox / Alternate History uses the same simulation engine and can diverge through player and AI decisions.
- A feature is not complete merely because a screen, menu, counter or placeholder exists. It must have valid data, rules, player/AI actions, causal integration, save/load behavior and relevant tests.

## 3. APK-first distribution and large offline data

The intended delivery is an installable Android APK containing the application shell and minimum bootstrap content, followed by user-controlled installation of separately downloadable data/content packs.

The owner explicitly accepts that the complete data set may be large, approximately **4–5 GB**. This is a planning allowance, not a requirement to pad the download or a reason to discard useful verified data. Compressed download size, extracted on-device footprint, temporary staging space and runtime memory must be measured and reported separately; none may be conflated.

The implementation target, when its phase is authorized, must include:

- Multiple versioned, provider-neutral packs with explicit dependencies and compatibility metadata.
- User opt-in before network access or any download; clear pack sizes, free-space preflight, progress, pause, cancel and verified resume.
- Per-file SHA-256 integrity, trusted publisher signature/authenticity policy, canonical manifest validation, path/MIME/size limits and duplicate-ID checks.
- Staging separate from active packs; activate atomically only after complete verification; preserve the last known-good version and support rollback.
- Offline campaign creation, simulation, save and load after required packs are installed.
- Presentation/content packs must not execute JavaScript, WebAssembly, HTML, scripts or arbitrary commands and must never be required for simulation correctness.
- No save/telemetry upload or background content download without separate, explicit user consent.

## 4. Data quality is more important than raw size

Every shipped historical dataset must have traceable provenance and an explicit quality state. For each material record, preserve as applicable:

- Source title, publisher/author, URL, publication/access date and the exact page/table/record.
- Temporal validity, geographic coverage and the geographic crosswalk/method used.
- Original units, transformations, estimation method and uncertainty/confidence.
- License, permitted use, attribution and redistribution conditions.
- Stable record ID, schema/data-build version and content hash.

Use distinct states such as verified, supported, estimated, disputed and unknown. Unknown is not zero. Do not infer historical 1836 borders, rulers, population, religion, GDP, laws or military facts from modern data without an explicit, documented method. Candidate research is not runtime data until it passes the required review and acceptance process. Do not import assets or datasets whose redistribution rights are unclear.

## 5. Cost and privacy guardrails

Do not introduce a paid API, subscription, hosted service, recurring charge, automatic top-up or paid data source without explicit owner approval. Prefer local/offline operation and freely usable, properly licensed sources. Never put credentials, private keys, keystores or personal data in the repository.

## 6. Execution and evidence rules

- Work in bounded slices and follow the latest verified GitHub HEAD, session recovery protocol and phase order.
- Preserve all existing save data and backward compatibility; use migrations and rollback rather than destructive replacement.
- Run the relevant tests for each code slice. For documentation-only slices, perform and record cross-document/path/content consistency checks; do not claim runtime tests were run.
- Update the relevant rolling report and `docs/coordination/AI_HANDOFF.md` in the same work slice.
- Commit/push, then fetch the new branch HEAD and changed files from GitHub to verify persistence. After a timeout or lost response, inspect GitHub before retrying any write.
- Record exact base/result SHA, files changed, commands/results, CI run URLs, APK/pack hashes, physical-device evidence and remaining limitations.
- Never claim Android device QA, a complete game, data accuracy, independent review or owner acceptance without the corresponding evidence.

## 7. Current gate state is preserved

This directive does not rewrite historical audit results. At the time this directive is recorded, the handoff reports S0 G0.1–G0.6 PASS, G0.7 BLOCKED, G0.8 PARTIAL and full-S0 G0.9 BLOCKED; S1 and S23 are not started. The 4–5 GB pack direction is recorded for planning and subsequent authorized work, but it does not by itself turn a closed phase into an accepted phase or waive outstanding review/device/licensing requirements.

**Immediate operational priority:** complete the current S0 handoff/review obligations without duplicating work; then advance the approved roadmap in sequence. Prepare the APK + large verified offline data-pack architecture for implementation when the required phase gate is legitimately open.
