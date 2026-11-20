# OWNER IMPLEMENTATION AUTHORIZATION — 2026-11-20

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Working branch:** `experiment/vic3-visual-upgrade`  
**Owner instruction:** explicit direction in the ChatGPT project session on 2026-11-20.

## Authorization

The owner explicitly delegated full technical execution discretion to ChatGPT to continue developing Victori3 Mobile toward a detailed, coherent, performant and stable Victoria 3-class grand-strategy simulation, rather than a small demo or a collection of shallow screens.

This is an explicit owner authorization to commence product implementation on the designated experiment branch. It supersedes the earlier `S1 NOT AUTHORIZED` restriction **for implementation under this new owner directive**. It does not retroactively change S0 evidence, claim that S0 passed, claim that S0-B7 received an independent review, or mark any reviewer/owner acceptance that has not actually occurred.

ChatGPT is the technical lead/implementer for this delegated work. Work must remain incremental, evidence-driven and reviewable. Each vertical slice must include domain invariants, deterministic tests, compatibility handling, relevant CI evidence, progress report and handoff. Do not declare a subsystem complete from a UI stub or a green APK build alone.

## Product direction and engineering order

The implementation target is the owner-requested worldwide 1836–2026 campaign with connected population, production, physical goods, markets, inventories, trade, transport, treasury, politics, institutions, diplomacy, subjects/treaties, military/logistics, technology and autonomous country AI.

The owner has also set the Speed 5 ceiling at no more than **0.5 Gregorian game-day per real second**. Rendering frame rate must not determine simulation time. The current monthly tick implementation must not be represented as having met this requirement until a separately tested scheduler slice is implemented.

The first authorized implementation slice is **ECONOMY-INVENTORY-LEDGER-01**:
- Add deterministic market stock balances and monthly inventory accounting for physical goods.
- Reconcile opening stock + production + imports against exports + consumption + closing stock.
- Keep unmet demand explicit; never allow stock to become negative.
- Bound detailed journal history to avoid unbounded save/RAM growth.
- Preserve the distinction between physical goods and the separately calculated non-material services flow.
- Add an additive migration for existing saves and regression tests for determinism and accounting.
- Integrate with the existing market-clearing path without inventing sourced historical opening stocks, warehouse capacities, spoilage rates or transport distances.

## Guardrails that remain in force

- Work only on `experiment/vic3-visual-upgrade`; do not rewrite, merge, rebase, force-push or modify the default branch.
- Preserve the historical S0 reports and gate verdicts. The current S0-B7 review and its unresolved risks remain accurately reported; this authorization is not an S0 signoff.
- Do not access, create or change signing keys, GitHub Secrets, protected Environments, release signing or package identity without a separate explicit owner decision.
- Do not merge or create a PR without the owner's explicit request.
- Do not copy Victoria 3 proprietary code, data files, art, text, music or other protected assets. Use original implementation and properly licensed/sourced material.
- Do not invent historical quantities. Unknown opening inventory is explicitly marked unseeded until a source-backed data pack provides a starting stock.
- Physical-device QA, APK installation and performance claims require actual device evidence; CI cannot substitute for them.

## Completion record

This file records the owner's authorization only. It is not evidence that implementation, tests, CI, device QA, independent review or final acceptance have already occurred. Those results must be appended to `docs/coordination/AI_HANDOFF.md` after they are observed.
