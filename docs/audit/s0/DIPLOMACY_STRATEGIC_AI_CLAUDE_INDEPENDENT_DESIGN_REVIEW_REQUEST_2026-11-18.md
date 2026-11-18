# S18–S19 Diplomacy and Strategic AI — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** `NONE`

## 1. Review target

- **Design:** `docs/spec/DIPLOMACY_STRATEGIC_AI_ARCHITECTURE_PROPOSAL_VI.md`
- **Design commit:** `8f01556bd70fed05be6f880f287a0f3691cd7674`
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Related design:** Governance/Characters S15–S17 `207722d612354f4d1bccc74064d24616efa4511a`.
- **Related system designs:** S7–S8 `98a9aef1356f73004a78590eb45d63321b4b0ee2`, military S20–S21 to be reviewed separately.

Fetch exact current HEAD and verify the target document's blob/commit before review.

## 2. Independence/no-write

Claude must not have authored or modified this design. Do not write or edit files, create commits/branches/PRs, run build/APK, or implement any S18/S19 slice. If required corrections exist, return `CHANGES_REQUESTED` with section/line locators.

## 3. Review areas

### A. Current code characterization
Verify against:
- `src/engine/systems/diplomacy.ts`: powerScore/greatPowers, relation drift, treaties, subject rules, warSides/declareWar/joinWillingness.
- `src/engine/ai/ai.ts`: aiMonth cadence, budget/reform/diplomacy/war AI, historicalBias, decision-window selection.
- `src/engine/commands.ts`: shared player command API.
- `src/engine/types.ts`: Treaty, War, AIMemory, Personality, GameState.
- `src/engine/simulation.ts`: same monthly pipeline for both modes.
Confirm the characterization is accurate and identify any omitted contracts.

### B. S18 diplomacy
- Does InternationalActor avoid assuming all diplomatic agency belongs to nation-states?
- Are sovereignty, suzerainty, tributary status, protectorates, subject autonomy, contested recognition and collective authority represented safely?
- Are typed relations/treaty terms/ratification/obligations/expiry/breach adequate?
- Is DiplomaticPlay a coherent finite state machine with explicit transitions and time windows?
- Are participants/backers/sway commitments deterministic and frozen at transition to war?
- Can crisis resolution end through concessions, mediation, arbitration or withdrawal rather than inevitable war?
- Is power a vector rather than one scalar, without creating expensive all-pairs evaluation?
- Are historical validity and global institutional diversity preserved?

### C. S19 Strategic AI
- Does the goal hierarchy and horizon model remain computationally bounded?
- Are planning, command validation and execution monitoring separated?
- Are decisions explainable and reproducible without storing huge verbose traces?
- Are uncertainty and information access explicit; can AI avoid hidden player/future information?
- Does personality bias avoid overriding constraints or deterministically stereotyping cultures/religions?
- Does minor/decentralized polity agency remain feasible and non-conquest-oriented?
- Does Historical Mode bias provide context rather than force decisions?
- Is the same command API used by player and AI?

### D. Integration and safety
Check links to S15–S17 institutional authority, S7/S8 trade/transport, and S20/S21 war organization. Verify S18 war authorization and treaty settlement are not prematurely implemented inside S19 AI. Confirm S1 save gate and S0-B7 owner acceptance remain prerequisites.

### E. Performance/tests
Assess relation graph size, active crises, treaties/terms, AI plans/candidates, p95/p99 monthly CPU, memory/save growth and long 1836–1936 runs. Check save/load while a crisis or AI plan is active.

## 4. Required verdict

Return exactly one: `REVIEW_PASS`, `CHANGES_REQUESTED` or `BLOCKED`.

Include exact reviewed HEAD, target blob, P0/P1/P2/P3 findings with evidence/locators, non-blocking recommendations separately, and explicit no-write confirmation.

## 5. Gate boundary

A pass applies only to this design. It does not satisfy S0-B7 review or owner acceptance and does not open S1/S18/S19 or authorize code/data/save/test/UI/Android/APK changes.
