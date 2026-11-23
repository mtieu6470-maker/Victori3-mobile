# Independence movements, the colonial calculus and international pressure (DECOL-03)

Owner, 2026-11-23:
- "After 1950 independence movements were strong everywhere, so Britain granted independence to many countries."
- "But countries do not want to grant independence unless their position stays strong, or there are other levers (embargoes, an exchange of interests, isolation), as the NATO and Warsaw Pact blocs did."

Engine: `src/engine/systems/independence.ts`, system `independence`, which runs after `decolonisation`.

## 1. Scope: overseas colonies

- A movement is the overseas colonial regions of one nation held by one owner.
- "Overseas" follows the UN "salt-water" criterion (General Assembly resolution 1541, 1960). The region is colonial (`isColonialRegion`) and is not land-connected to the owner's home through the owner's own territory.
- Contiguous empires keep the nationalist secession rules (`secessionCheck`): Russia's Asia, the American West, Ottoman Arab lands.
- Overseas colonies no longer secede through `secessionCheck`; they rise through movements instead.

## 2. The anti-colonial wave

`eraWave(year)`:

| from | wave |
|---|---|
| before 1885 | 0 |
| 1885 | 0.1 |
| 1919 | 0.25 |
| 1945 | 0.6 |
| 1955 | 1.0 (peak) |
| 1966 | 0.8 |
| 1976 | 0.4 |

The owner having lost a war in the last 10 years adds +0.1. In overseas colonies the wave adds:
- nationalism +0.6 × wave (mobilisation beyond the literate elite);
- radicalism +0.25 × wave in nationalist regions.

The wave also feeds subjects' liberty desire after 1945.

## 3. Movement strength (0–100)

- Strength moves 5% a month toward its target. The target is the sum of:
  - nationalism × 60;
  - radicalism × 60;
  - wave × 30;
  - foreign supporters, 10 each (max 30);
  - owner weakness: lost a war in the last 10 years +15, war exhaustion > 40 +10;
  - repression −35.
- **Demand** at strength ≥ 55. It also requires population ≥ 50,000, and either wave ≥ 0.25 or strength ≥ 75. A decision has a 5-year cooldown.
  - The player gets an `independence_movement` journal entry (24 months; no answer counts as a refusal).
  - An AI owner decides in January.
- **Rising** at strength ≥ 85 held for 12 months, when not repressed:
  - a rebel state takes the field in the regions;
  - its supporters join it if their interest says so.

## 4. The owner's calculus

- **Value** = max(15, 100 × colony population / owner population, capped at 80). The floor of 15 stands for the prestige and strategic value every colony carries.
- **Cost** is the sum of these parts, multiplied by (0.4 + wave):

  | part | contribution |
  |---|---|
  | movement | strength × 0.6 |
  | great-power embargoes on the owner | 12 each |
  | foreign supporters | 8 each |
  | great-power allies without colonial troubles (after 1945) | 6 each (US-style pressure) |
  | war exhaustion | × 0.3 |
  | lost war in the last 10 years | 15 |

  A top-3 power with exhaustion < 20 bears it better (× 0.7): it is still strong.
- **AI choice.** Owner 2026-11-23: "granting needs a benefit or a cause".
  - No grant happens without a concrete cause: great-power embargo, allies' pressure, a lost war, war exhaustion ≥ 40, or an imminent rising (strength ≥ 85).
  - Without a cause, the owner keeps the colony: it represses if it can pay, otherwise refuses.
  - With causes: cost/value < 1.5 → repress; < 3 → grant with ties (a top-5 power: half the time as a dominion); otherwise grant outright.
  - The causes are written into the news.
  - **Next:** these decisions become events with options (CG-49, MSG-113).

## 5. Options (player and AI)

| option | effect |
|---|---|
| Repress | Costs 50% of a month's income and +5 war exhaustion. The movement gets −35 for 3 years, but radicalism +0.05 (resentment). |
| Grant with ties (exchange of interests) | The new state joins the former owner's customs union, a bilateral alliance (`source: 'ties'`) and its power bloc; relations +60. |
| Grant as a dominion | The new state is a dominion subject (pays 20%); relations +40. |
| Grant outright | Relations +20. |
| Refuse | Radicalism +0.1 in the regions. |

Supporters gain +40 relations with the new state.

## 6. International pressure

- **Support** (`support_movement`): a great power backs a movement and the owner's relations fall by 20.
  - AI great powers (top 8) do so yearly with chance 0.3 when the movement has strength ≥ 40 and wave ≥ 0.25.
  - Who backs: rivals of the owner, the other Cold War camp, or (after 1945) countries without colonial troubles of their own.
- **Embargo** (`embargo`), usable by the player against anyone:
  - the target's trade openness falls 8% per great-power embargo and 3% per other, capped at 35%;
  - relations fall by 30.
  - AI supporters embargo an owner whose movement has strength ≥ 60, after 1945 or in Sandbox. They lift it when the movement is over or after 10 years.

## 7. Historical Mode

- Colonies in the decolonisation register (CG-37) follow their dates while an AI owns them. Their movements are shown but do not decide or rise.
- The player's colonies, and colonies outside the register, follow these rules.
