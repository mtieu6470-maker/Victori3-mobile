# CG-05 — Politics, diplomacy, Power Blocs and war (Victoria 3 1.15.x)

Research date: 2026-11-22. Baseline: Update 1.15 and hotfix 1.15.2. Exact internal probability weights are unknown unless explicitly published.

## Diplomatic Plays

Diplomatic Plays are diplomacy under coercive pressure, not an immediate war declaration. Dev Diary #21 describes using diplomatic maneuvering to obtain objectives that could otherwise be achieved by war, potentially forcing concessions without fighting. Side commitments, participants, war goals, sway offers and escalation must be stateful and auditable.

Source: Dev Diary #21, 2021-10-28: https://store.steampowered.com/news/posts/?enddate=1635437078&feed=steam_community_announcements

Update 1.15 adds Return State to Subject for demanding a state claimed by a subject. 1.15.2 improves treaty acceptance breakdown and makes law commitments clickable:
- https://steamdb.info/patchnotes/26453692/
- https://store.steampowered.com/news/app/529340/view/680767470935474875

Exact 1.15.1 phase names/timers, sway formula and acceptance weights remain unknown in this research pass.

## Laws, Interest Groups and movements

Law enactment must be modeled as a process with proposal, progress, stall/success/failure, Interest Group approval and modifiers—not an immediate button effect. Approval and clout are distinct concepts. Political movements and agitators should be actors with goals, support, activism and causal effects. Exact enactment probability formulas, party/election details and agitator modifiers are not verified here; mark unknown pending source-specific research.

## Subjects and Liberty Desire in 1.15

Verified changes:
- A subject with high Liberty Desire can attack its overlord even if allied in a war/play, if no war goal in that war explicitly targets the subject; it leaves plays/wars where it was supporting the overlord.
- Subjects do not automatically join their overlord's civil war. They can choose a side; autonomous subjects may sit out. Non-autonomous subjects that do not choose before closing phase automatically back loyalists.
- Subjects gain Liberty Desire when overlord starts a play against them or enforces a war goal against them.
- Overlords normally join plays/wars of a newly-subjugated country to protect the acquisition.
- Return State to Subject play was added.

Source: Update 1.15 / Dev Diary #196: https://steamdb.info/patchnotes/26453692/

## Power Blocs

Verified: Power Blocs are multinational associations led by Great or Major Powers. They have an identity and principles; principles can be added/removed over time. Blocs can be named/customized and compete for influence and expansion. Model membership, leader, identity, principles, cohesion and leverage as persistent state, but exact cohesion/leverage formulas remain unknown.

Sources:
- Dev Diary #109, Power Blocs, 2024-03-21: https://store.steampowered.com/news/posts/?enddate=1711034117&feed=steam_community_announcements
- Dev Diary #108, Sphere of Influence / 1.7 overview: https://store.steampowered.com/news/posts/?enddate=1710430809&feed=steam_community_announcements

## War Support rework, live in 1.15

- War Support is 0–100% and can increase or decrease during a war.
- Initial value depends on willingness to enter the war.
- Factors include battles, occupation, war-goal progress, devastation, economic regression and war duration.
- Low War Support radicalizes Pops, weakens military forces and increases Liberty Desire for subject belligerents.
- Reaching zero no longer automatically capitulates a country; when both sides are exhausted, war can end in stalemate.
- War goals can be enforced mid-war after controlling their objective long enough. The affected side may receive an infamy-free mirror war goal. Regime Change and Cut Down to Size remain peace/capitulation-only cases.
- 1.15.2 adjusts casualty accounting so Recovery Rate and Kill Rate shift casualties between dead and wounded; battle casualty statistics should match Pop losses.

Sources:
- Dev Diary #185 / AI update overview: https://steamcommunity.com/app/529340/announcements/?l=english
- Dev Diary #191 confirms integration into 1.15: https://steamcommunity.com/app/529340/announcements/?l=english
- Update 1.15 / Dev Diary #196: https://steamdb.info/patchnotes/26453692/
- Hotfix 1.15.2: https://store.steampowered.com/news/app/529340/view/680767470935474875

## Fronts, battles, supply and naval

Verified 1.15 changes include rebuilt army/fleet travel network; military map can display own, allied and enemy supply routes; defeated state belongs to fleets rather than Admirals; defeated fleets cannot transfer ships or split/merge until repaired and re-crewed; damaged ships withdraw more readily; after naval invasion delivery, fleet orders can return home, stay near landing or guard supply route. Hotfix 1.15.2 adds per-fleet automatic replacement queue for sunk ships.

Source: Update 1.15 and 1.15.2 links above.

## Suggested data contract

DiplomaticPlay: initiator, target, phase, deadline, sides, participants, war goals, sway offers, commitments and escalation.
LawEnactment: law group, current/proposed law, progress, stall/success modifiers and IG approval snapshot.
InterestGroupState: clout, approval, ideology, government status and Pop weights.
PoliticalMovement: goal, support, activism, scope and agitators.
SubjectRelation: overlord, subject type, autonomy, Liberty Desire and treaty obligations.
PowerBloc: identity, principles, cohesion, leverage, leader and members.
War: participants, goals, War Support 0..100, battles, occupation, casualties, devastation, economic regression and stalemate.
Front/Battle/SupplyRoute/Fleet: separate lifecycle-managed entities.

## Open questions / conflicts

- Exact law success/stall formulas, IG clout/approval, party/election rules and agitator details: unknown.
- Exact Power Bloc cohesion/leverage formulas: unknown.
- War Support factor weights, thresholds and stalemate timing: unknown.
- Fleet auto-replacement is 1.15.2, not 1.15.1.
- War Support rework originated in 1.14 beta and was integrated into 1.15; do not treat interim beta behavior as final.

## Recommended acceptance tests

1. Diplomatic Play phases and deadlines persist across save/load.
2. Sway changes commitments only after acceptance and shows reason breakdown.
3. Subject backstab obeys the stated 1.15 conditions.
4. Subject civil-war participation follows autonomy and closing-phase rules.
5. Law enactment exposes deterministic probability inputs and modifiers.
6. War Support stays in 0..100 and responds to documented factors.
7. Zero War Support does not force immediate capitulation.
8. Mid-war war-goal enforcement and mirror goals work where permitted.
9. Defeated fleets block transfer/split/merge until repaired/re-crewed.
10. Supply disruption affects overseas forces and is visible.
11. Save/load preserves bloc membership, principles, leverage, war state and RNG.
