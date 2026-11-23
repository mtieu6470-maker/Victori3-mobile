# CG-53 — Diplomatic Play: design input for implementation

Date: 2026-11-24  
Branch: `ccr-b27f3fb8-epfpd6`  
Status: **DESIGN INPUT v1 — Claude must reconcile with the engine before implementation.**

## 1. Scope and design intent

A Diplomatic Play is a time-bounded international crisis in which an initiator presses one or more demands against a target. Other states assess interests, choose a side, remain neutral, or bargain for support. The crisis may end by concession, negotiated settlement (future extension), or war.

This document synthesizes the project's CG-49 and CG-51 references with public Victoria 3 developer diaries. It does **not** claim to reproduce the complete current V3 implementation or its hidden AI formula. All proposed numbers below are original Victori3 tuning values.

Project constraints:
- Main simulation clock: **12 in-game hours per real second** (2 game-days/second).
- The player must have time to understand the crisis and respond on a phone.
- Simulation must be deterministic for a fixed seed and ordered action log.
- Never force a historical outcome when country, region, regime or diplomatic preconditions are absent.
- Keep the existing monthly war resolver as the post-escalation integration point until front/battle systems are expanded.

## 2. Lifecycle and phase machine

Use an explicit finite-state machine. A play has one initiator and one target; other countries are participants with side/stance state.

| State | Proposed base duration | Available actions | Exit |
|---|---:|---|---|
| `opening_moves` | 10 game days | target's first demand; both leaders add first demand; overlords/subjects auto-join where rules require; third parties lean | timer ends or an explicit valid resolution |
| `maneuvering` | 30 game days | add demands; promote eligible demand to primary; invite/sway; accept/decline; join/lean/declare neutrality; mobilise; back down | timer ends or leader backs down |
| `countdown` | 10 game days | final back-down / capitulation; no new demands or new participants; show war forecast and locked sides | timer ends -> war |
| `resolved_concession` | terminal | enforce primary demands; create treaty/subject/transfer only after preconditions validate | terminal |
| `resolved_settlement` | terminal, optional v1.1 | apply explicitly negotiated articles | terminal |
| `war_started` | terminal for play | create war record and pass locked goals/participants to war engine | terminal |
| `cancelled` | terminal | invalidated if initiator/target ceases to exist or all demands become impossible; apply cooldown/refund policy | terminal |

**Clock math:** at 12h/real-second, 2 game days pass each second. The proposed 10/30/10-day phases therefore take about **25 real seconds** if the simulation runs continuously. This is deliberately shorter than V3's commonly documented 20/60/20-day reference cycle; it fits mobile pacing but needs playtesting. If the player opens the crisis panel, pause only the play's escalation clock while the global simulation continues only if the game already supports modal-time pause; otherwise pause the global clock. Never silently allow a crisis to expire while a modal decision is open.

After a leader action, add a **2-game-day response lock** (one real second at the normal clock) to prevent several AI decisions stacking in one tick. This is a project proposal, not a V3 value. Do not let repeated actions reset the entire phase timer; apply a maximum +4 game-day extension per phase.

### Phase transition rules
1. Create play with `createdAt`, incident, initiator, target, strategic region, initial demand and public justification.
2. Validate demand target/scope and country existence before accepting the play.
3. The target may add a counter-demand during opening moves; if it does not, do not invent a punitive demand automatically in v1.
4. When opening ends, resolve automatic subject/overlord obligations, then calculate third-party preferences.
5. During maneuvering, each accepted action is an append-only play action. Recompute only affected scores.
6. At countdown, freeze participants, demands, sway offers and side switches. Back-down remains available.
7. At war start, create one war from the final participant set and valid goals. Mark the play terminal before handing off, to prevent duplicate wars on retry.

## 3. Demands: primary vs secondary

A demand has:
- `id`, `type`, `from`, `against`, `scope`, `regions[]`, `subjectId?`, `beneficiary?`;
- `primary | secondary`, `maneuverCost`, `infamyCost`, `validity`, `createdAt`;
- `enforcement`: concession/back-down effect and war-victory effect, separately.

Primary demands are the stakes a target accepts if it backs down. Secondary demands are only resolved through war/peace outcome. This distinction is essential: a back-down must not accidentally enforce goals that were only risked in war.

Initial demand families: `conquer_region`, `transfer_subject`, `make_subject`, `liberate_subject`, `independence`, `humiliation`, `reparations`, `open_market`, `change_law`, `return_claimed_region`, `recognition`, `naval_basing_rights`, `treaty_port`, `disarm`.

Validation:
- No demand may target a missing entity/region.
- No transfer may transfer a region not owned by the target or a legally represented subject.
- A subject transfer must preserve the subject entity and validate its current overlord.
- Independence requires a represented subject/rebel/nation and explicit region set; do not fabricate a country from a name string.
- `open_market`, `change_law`, `reparations` need separate effect implementations and cannot be accepted as decorative goals.
- Duplicate or mutually exclusive demands are rejected before maneuver cost is deducted.

## 4. Maneuver budget and action costs

Use rank-based starting budget as a first approximation. These are **Victori3 proposals**, not values claimed from V3:

| Rank | Starting maneuvers |
|---|---:|
| Great Power | 100 |
| Major Power | 75 |
| Regional Power | 60 |
| Minor Power | 50 |
| Decentralized / local polity | 30 |

Proposed costs (calibrate after playtests):
- Add secondary demand: 10–30 depending on scope/risk.
- Promote own demand to primary: base demand cost + 10; extra infamy where not justified by a sway.
- Offer obligation: 10.
- Call in an existing obligation: 10.
- Call an ally: 20.
- Transfer subject offer: 25.
- Offer a region to a third party: 25–40; only if the offering state owns it and can legally transfer it.
- Offer treaty port / basing: 10–20 depending on strategic value.
- Sway with a war goal: cost of that goal, with a minimum of 10.

Do not make maneuvers a currency that regenerates. Refund only if the target/beneficiary becomes invalid due to an external state change, not because the player dislikes the result.

## 5. Sway: offers, acceptance and price

A sway is a conditional contract: a country commits to a side in exchange for a benefit if that side wins or the target backs down. Store offer and obligation separately; an accepted offer must not pay out merely because it was accepted.

Offer kinds:
1. `obligation`: one-time diplomatic obligation with expiry and issuer/beneficiary.
2. `call_ally`: invokes an existing alliance clause; do not create a new alliance.
3. `war_goal`: promises a specific valid war goal to the swayed country.
4. `transfer_state`: transfers a named state only if the offering side owns it and the legal transfer is possible.
5. `transfer_subject`: changes overlord only after victory and subject/overlord validation.
6. `subject_status`: grant autonomy or subject status; define exact target status.
7. `treaty_article`: port access, transit, basing or trade access with explicit scope and term.
8. `financial_aid`: one-time treasury transfer or time-bounded loan with principal, interest and due date.
9. `investment_access`: right to invest in named sectors/regions; not ownership transfer.
10. `recognition`: recognition of state/regime, with a diplomatic cost and a date.

Each offer includes `conditionsToPay`, `expiry`, `costToOfferor`, `benefitToRecipient`, `enforcement`, `fallbackIfUnfulfilled`. A promise to transfer a state cannot be fulfilled if the offeror does not own it after the war.

### AI acceptance score — proposed transparent heuristic

Calculate a score in integer points, clamp to [-100, +100]:
- preference for side vs opponent: -35…+35;
- strategic interest in region: 0…+20;
- relations with side leader minus opponent: -15…+15;
- ideological / bloc sympathy: -10…+10;
- offered benefit value: 0…+35;
- expected military contribution / chance of enforcement: -15…+10;
- neutrality cost / domestic instability / debt exposure: 0…-35;
- credibility penalty for impossible, expired or unaffordable promise: -100 (hard reject).

Accept if score >= +12 and the recipient's neutrality threshold is met. Decline if score <= -10. In the middle band, use deterministic seeded choice weighted by score, with a visible "uncertain" state. AI must not accept the same benefit twice, must reserve an accepted offer's future cost, and must compare all simultaneous offers before choosing one. A country can accept only one incompatible promise.

This is an original initial scoring model. Log every score component for debugging and allow a scenario test to assert why a state joined.

## 6. Neutrality, sympathy, confidence and back-down

Separate:
- **Neutrality:** value of staying out (debt, domestic unrest, low strategic interest, depleted army, other active war, trade exposure).
- **Sympathy:** preference toward defender/ally, relations, treaty ties, perceived legitimacy and infamy of demands.
- **Confidence:** leader's expected ability to survive/win if war starts (effective force, mobilisation, logistics, naval reach, treasury runway, allies' reliability, internal stability).
- **Resolve / boldness:** willingness to accept risk, influenced by regime, war goal severity, national prestige, public support and seeded bounded variance.

Back-down should compare:
`expectedWarCost + expectedDefeatLoss + internalRisk`
against
`concessionCost + humiliationCost + futureThreatCost`.
The target may back down if concession is cheaper than war; the initiator may back down if expected war cost exceeds the value of its demands. Do not use one global "AI bravery" number. An existential demand (annexation/independence) should raise resolve and domestic cost of concession, but not force war in every case.

Suggested back-down evaluation moments: after each major sway/demand, at 50% maneuvering, and at countdown entry. AI can re-evaluate when a major ally joins/leaves or a demand changes. No random reroll each tick.

## 7. Escalation and incident costs

Escalation is not the same as infamy. Track separately:
- `escalationProgress` 0–100;
- `infamyAdded` and international opinion;
- `mobilizationLevel`;
- `warSupportEstimate` / confidence;
- `economicDisruption`;
- `domesticRadicalism`.

A crisis can raise trade risk, convoy insurance costs, capital flight and price volatility only if those systems exist. Do not invent a fixed GDP penalty. Aggressive demands may generate infamy and increase sympathy for the target. Mobilization consumes treasury and creates temporary labour disruption through explicit existing effects.

## 8. Treaty and war integration

A back-down enforces only valid primary demands. A negotiated settlement (future version) creates a treaty with explicit articles and terms; it is not an informal bundle of unrelated effects. War start freezes the play and hands its participants and demands to the war engine. A play must never create both a concession outcome and a war.

On war completion, resolve each goal independently and create the appropriate treaty/subject/transfer record. A demand invalidated during war is dropped with an audit log; it must not keep a war alive by itself.

## 9. UI and player comprehension

Mobile play panel should show:
- incident and disputed issue;
- phase + countdown in game days and approximate real seconds;
- two sides, participants, stance and contribution;
- demands with Primary / Secondary labels and cost;
- maneuver points and remaining actions;
- sway offers with exact obligation, duration and conditions;
- war forecast as a range, not false precision;
- back-down consequences;
- event log with timestamp and reasons.

Never hide a promised payment, territory transfer, treaty duration or infamy cost behind a generic "support" button. Show "accept offer" only after validating the benefit can be delivered.

## 10. Determinism, performance and regression cases

- Store play state as serializable data; no timers or wall-clock dependencies in the simulation core.
- Tick only active plays. Cache participant score inputs and invalidate on relevant diplomacy, economy, military or domestic changes.
- Use a stable ordering by country ID for score aggregation and action resolution.
- Fixed seed + same ordered player actions must yield identical outcomes.
- Idempotent transition: retrying a save/load or event must not create duplicate war/treaty records.
- Mobile performance: avoid scanning all countries every half-second. Build the interested-country candidate list once on play creation and update on strategic-interest changes.

Minimum tests:
1. Target backs down in opening: reject (phase disallows it).
2. Target backs down in maneuvering: only primary goals enforced.
3. Secondary demand is not enforced on concession.
4. Impossible sway (offered state not owned) is hard-rejected.
5. Obligation expires before resolution: no payout.
6. Two incompatible sway offers: AI accepts at most one.
7. New ally joins: confidence changes once, deterministic.
8. Target disappears / region no longer exists: play cancels safely.
9. Countdown locks new participants/demands.
10. War is created exactly once and receives final participant set.
11. Pausing the crisis UI does not silently expire the play.
12. Save/load during each phase preserves exact remaining game-days.

## 11. Reference sources and caveats

- Paradox Dev Diary #57 describes the crisis / international participant design: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
- Paradox Dev Diary #59 explains Neutrality, Sympathy, Confidence and Boldness as AI concepts; it does not publish the complete scoring formula: https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-59-ai
- Paradox Dev Diary #75 describes Primary vs Secondary Demands and maneuver/infamy trade-offs in the 1.2 update: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-75-diplomatic-improvements-in-1-2
- Paradox Dev Diary #78 is the 1.2 changelog and is version-specific: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-78-update-1-2-changelog
- Paradox Dev Diary #79 explicitly lists reverse-sway and additional diplomatic features as not implemented at that time: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-79-whats-next-after-12
- CG-49: `docs/research/design/CG49_COLONIAL_EVENTS_REFERENCE.md`.
- CG-51: `docs/research/design/CG51_V3_UI_MECHANICS_REFERENCE.md`.

**Acceptance boundary:** this is an implementation input, not code completion. Claude must map states/effects to existing `src/engine/systems/diplomacy.ts`, war records and save schema, and must not implement unbacked demand/effect types as cosmetic success.
