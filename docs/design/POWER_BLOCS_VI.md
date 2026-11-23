# Power blocs (khối quyền lực) — design (PB-01)

Owner 2026-11-23: "the player founds their own bloc; it must be as complete as Victoria 3". Mechanics take
Victoria 3's power blocs as the reference; code, names and text are original.

## 1. Concepts

- **Bloc**: founded by a great power (power rank ≤ 8, not already in a bloc), with a name, an **identity** and
  **principles**. Members are sovereign states; the founder is the **leader**.
- **Identity** (one, chosen at founding): what holds the bloc together and how cohesion is earned.
  | id | VI | cohesion from | special |
  |---|---|---|---|
  | trade_league | Liên minh thương mại | members in the leader's market, trade ties | may unify markets |
  | sovereign_empire | Đế chế chủ quyền | members that are the leader's subjects | may extract tribute |
  | ideological_union | Liên minh ý thức hệ | members sharing the leader's power and economy laws | pulls members' laws towards the leader's |
  | military_treaty | Tổ chức hiệp ước quân sự | members not at war with each other, common rivals | mutual defence |
  | religious_convocation | Hội đồng tôn giáo | members sharing the leader's state religion | clergy support |
- **Principles**: groups with levels 1–3; the bloc has a number of **principle slots** that grows with
  cohesion and size (1 + 1 at cohesion ≥ 40 + 1 at ≥ 70 + 1 with ≥ 5 members; max 4). The level a group can
  reach also depends on cohesion (L2 ≥ 40, L3 ≥ 70). Some groups need an identity.
- **Cohesion** (0–100): moves each month toward a target made of members' attitude to the leader, the
  identity's own condition, the leader's leverage and a size strain. Below 25 members may leave and the
  highest principles stop working.
- **Leverage** (computed, not stored): a leader's hold over a country from relative power, relations,
  shared market, subjects, alliance, culture and religion, borders and the leader's companies in that
  country. A country weighs the leverage of every bloc leader.

## 2. Principle groups and effects

| group | identity | L1 | L2 | L3 |
|---|---|---|---|---|
| market_unification | trade_league | members' AI favours the leader's customs union | members may be invited into it | every member is in the bloc's customs union |
| internal_trade | any | +5% trade capacity for members | +10% | +15% |
| advanced_research | any | tech import from bloc members ×1.10 | ×1.20 | ×1.30 |
| defensive_cooperation | any (L3 military_treaty) | allies estimate: members count each other fully | members form one mutual-defence alliance | +5% army quality |
| creative_legislature | any | reform progress +0.01/month | +0.02 | +0.03 |
| police_coordination | any | radicalism −5% of its level/yr | −10% | −15% |
| exploit_members | sovereign_empire | 2% of members' income to the leader | 4% | 6% |
| ideological_alignment | ideological_union | members' AI reform utility +0.5 toward the leader's law in a group | +1.0 | +1.5 |
| sacred_civics | religious_convocation | members' clergy approval +1 | +2 | +3 |

## 3. Diplomacy

- **Found** (command `found_bloc {name, identity, principle}`): great power, not in a bloc.
- **Invite** (`bloc_invite {target}`): an AI country accepts if the leader's leverage over it exceeds every
  other leader's (and its current bloc's) by the join margin, relations ≥ 0 and it is not a rival or at war
  with the leader; identity fit adds (shared laws/religion). The player receives a journal entry.
- **Leave** (`bloc_leave`), **expel** (`bloc_expel {target}`), **change principles** (`bloc_principle
  {group, level}`, one change per 12 months).
- **AI**: AI great powers found blocs in **Sandbox** (identity chosen from their situation) and invite
  neighbours/partners; members leave when cohesion is low and another leader's leverage is higher. In
  **Historical Mode** history's own blocs (NATO, Warsaw Pact…) exist as alliances; the AI does not found
  power blocs, but the player can, and AI countries may join the player's bloc.

## 4. Slices

1. PB-01a engine: state, contract, leverage, cohesion, identities, principles and their effects, commands,
   AI, tests.
2. PB-01b UI: Diplomacy → "Khối quyền lực" tab (overview, members with leverage, principles, actions);
   founding dialog; journal invitation for the player.
3. PB-01c balance: calibration runs (bloc counts, sizes, stability) in Sandbox.

## 5. PB-02 — distinct identities and concrete effects (owner 2026-11-23: "make clear what joining gives")

Each identity has a **founding requirement**, its own **cohesion source**, a **core principle** (always in
force, no slot, level = what cohesion allows), **rights for the leader**, **gains for members** and
**obligations for members**. The UI shows all of these at founding, on the bloc card and as an "if you join"
preview for other blocs and in the journal invitation.

| identity | requirement | cohesion from | core principle | leader may | members gain | members must |
|---|---|---|---|---|---|---|
| trade_league | not isolationism | members in the leader's market | market_unification | one bloc customs union from day one; internal trade ×1.5 | the leader's market without tariffs; L2–3 trade +5/10%, construction +5% | share the market; AI drops isolationism |
| sovereign_empire | ≥ 1 subject | members that are the leader's subjects | exploit_members | subjects join automatically; tribute 2/4/6%; make weak members (power ≤ 25%, leverage ≥ 50, cohesion ≥ 60) protectorates; L3 legitimacy +5 | the leader's protection (defend +2); L2–3 army +3/5% | pay tribute; may become protectorates |
| ideological_union | — (label from leader's laws) | members sharing power and economy laws | ideological_alignment | pulls members' laws; L3 presses a reform on an AI member (cohesion ≥ 60) | aligned members radicalism −10%; L2–3 −5/10% more | AI prefers the leader's laws; may be pressed |
| military_treaty | a rival or an ally | the leader's share of the bloc's power | defensive_cooperation | a mutual-defence alliance from day one | defence by the whole bloc; L3 army +5% | answer calls to arms; a refusal costs cohesion −10 |
| religious_convocation | state religion / theocracy | shared faith (only the leader's faith may join) | sacred_civics | legitimacy +2 for the whole bloc | legitimacy +2/4/6, clergy approval +1/2/3 | same faith |

**Principles** (each level is the full effect; tiers stack like the reference): internal_trade,
advanced_research, creative_legislature, police_coordination, shared_construction, freedom_of_movement,
aggressive_coordination (members join the leader's offensive wars), colonial_partnership, holy_alliance, plus
the five cores. The exact numbers live in `PRINCIPLES` in `src/engine/systems/powerBlocs.ts`; effect keys
reach trade capacity, tech import, reform speed, radicalism, army quality, AI law utility, clergy approval,
construction speed, migration choice, legitimacy, war-joining interest, tribute, alliance and customs union.

**Mandates** replace the 12-month cooldown: progress per month = 5 × cohesion/100 × (1 + other members/10,
max 2); 100 = one mandate (bank of 3). Adding or raising a principle costs one mandate; dropping one is free.

**Breakdowns**: `leverageParts` (power, relations, market, subject, alliance, border, culture, religion,
companies, rivalry) and `cohesionParts` (base, attitude, identity, leverage, size) are shown in the UI.
