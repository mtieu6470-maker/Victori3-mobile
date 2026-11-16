# AI Collaboration Protocol — Victori3-mobile

## Purpose

GitHub is the shared source of truth between:
- **Project owner:** owns scope, product decisions, approvals, and phase transitions.
- **Claude Code:** implementation agent.
- **ChatGPT:** independent architect/reviewer.

This protocol does not itself authorize implementation, phase execution, signing changes, secret access, or merging.

## Roles

### Project owner
- Approves every phase and any scope/security change.
- Supplies physical-device evidence when required.
- Never shares keystores, passwords, access tokens, or private keys in chat, issues, commits, or handoff files.

### Claude Code — implementer
- Reads this protocol, the current handoff, and the owner-approved specification before work.
- Works only on the explicitly approved task and branch.
- Uses small, reviewable commits and records exact SHAs.
- Runs relevant tests and records exact commands, exit codes, logs, and artifacts.
- Updates `docs/coordination/AI_HANDOFF.md` before reporting completion.
- Does not self-approve work or advance to another phase.
- Does not change gameplay, engine, save format, CI signing, or secrets unless explicitly authorized.

### ChatGPT — independent reviewer
- Reviews exact GitHub commits/PRs, diffs, CI logs, tests, artifacts, and device evidence.
- Does not accept Claude's summary or a green CI badge as proof by itself.
- Records findings as PASS / BLOCKED / FAIL with evidence.
- Issues bounded correction requests when needed.
- Recommends acceptance; the owner makes the final decision.

## Source-of-truth order

1. Latest explicit owner-approved decision/specification.
2. Approved phase scope and acceptance criteria.
3. Repository content at the exact reviewed commit SHA.
4. CI logs, tests, benchmark reports, artifacts, and device evidence.
5. `docs/coordination/AI_HANDOFF.md` as the status index.
6. Chat summaries are context only and cannot override repository evidence or owner decisions.

If sources conflict, stop and report the conflict. Do not silently choose one.

## Standard task cycle

1. Owner authorizes a specific phase/task and scope.
2. Claude reads this protocol, handoff, and relevant specification.
3. Claude posts a plan: files to change, files out of scope, tests, risks, expected artifacts.
4. Claude implements only the approved scope on the designated branch.
5. Claude runs tests and updates the handoff with base/head SHAs, changed files, commands, exit codes, CI, artifacts, limitations, and risks.
6. Claude opens or updates a reviewable PR where appropriate. Do not merge it.
7. ChatGPT reviews the exact GitHub commit/PR and its evidence.
8. If changes are needed, ChatGPT writes a bounded review request; Claude fixes only those findings and updates evidence.
9. The owner explicitly accepts or rejects the result and authorizes the next phase.

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
- Claude self-assessment, labelled **unverified** until independent review.
- ChatGPT review status and owner decision, filled only by the respective party.

## Status vocabulary

- `NOT_STARTED`
- `IN_PROGRESS`
- `READY_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `BLOCKED`
- `REVIEW_PASS` — ChatGPT review passed; owner decision still pending.
- `ACCEPTED` — owner explicitly accepted.
- `REJECTED`
- `DEFERRED`

Never convert BLOCKED to PASS because a test could not be run. Never mark ACCEPTED without explicit owner approval.

## Branch and PR policy

- Use the current development branch unless the owner selects another.
- Prefer one focused branch/PR per phase or reviewable slice.
- Do not push directly to the default branch.
- Do not merge without owner approval.
- Do not rewrite or force-push shared history.
- Record exact base and head SHAs for every review.

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

## Uncertainty and disputes

If evidence is unavailable, contradictory, or irreproducible:
1. Mark `BLOCKED` or `FAIL`.
2. State exactly what is missing.
3. Preserve current files and logs.
4. Do not fabricate values or infer PASS.
5. Ask for the smallest necessary owner action.

## Completion definition

A task is complete only when implementation, evidence, handoff update, independent review, and owner decision are recorded. A successful commit or CI run alone is not completion.
