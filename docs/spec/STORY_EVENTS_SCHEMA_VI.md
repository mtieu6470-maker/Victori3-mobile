# Story events: data schema (EVT-01)

Owner, 2026-11-23: "Make events for every country, like Victoria 3. The more the better; that is what makes it fun to play."

Story events are data. The engine loads every file in `historical_data/events/story/*.json` (one file per country or theme, e.g. `GBR.json`, `FRA.json`, `colonies_africa.json`, `superpowers.json`) and fires them; the player chooses an option and the AI picks by weight. All wording is our own: no Victoria 3 text, names or numbers are copied.

## File

```json
{
  "schema": "story_events_v1",
  "country": "GBR",
  "sources": { "judd_2004": "Denis Judd, The Lion and the Tiger (OUP, 2004)" },
  "events": [ /* event objects */ ]
}
```

## Event object

```json
{
  "id": "gbr_quit_india_1942",
  "country": "GBR",
  "mode": "historical",
  "window": ["1942-07-01", "1943-12-31"],
  "date_historical": "1942-08-08",
  "trigger": { "conditions": [ { "type": "owns", "entity": "GBR", "region": "EIC_DEL" } ], "mtth_months": 3 },
  "chain": { "after": ["gbr_cripps_mission_1942"], "flag": "gbr_quit_india" },
  "title_vi": "Phong trào Rời khỏi Ấn Độ",
  "title_en": "The Quit India Movement",
  "text_vi": "2–5 câu mô tả tình huống, bằng lời của chúng ta.",
  "text_en": "2–5 sentences.",
  "image": { "ref": "optional: asset id or public-domain URL", "credit": "…", "license": "PD / CC BY 4.0 …" },
  "options": [
    { "id": "arrest", "label_vi": "Bắt giam toàn bộ lãnh đạo Quốc đại", "label_en": "Arrest the Congress leadership", "historical": true,
      "ai_weight": 3, "ai_modifiers": [ { "if": { "type": "war_exhaustion_above", "entity": "GBR", "value": 40 }, "factor": 0.5 } ],
      "effects": [ { "type": "movement", "owner": "GBR", "regions": ["EIC_DEL", "EIC_BEN"], "delta": -15 }, { "type": "radicalism", "regions": ["EIC_DEL"], "delta": 0.1 } ] },
    { "id": "negotiate", "label_vi": "Mở đàm phán", "label_en": "Open talks", "historical": false, "ai_weight": 1, "effects": [ … ] }
  ],
  "sources": [ "judd_2004" ]
}
```

- **id:** unique, `snake_case`, prefixed with the country code.
- **country:** the country that gets the event. It can be a colony or a subject: events for a player who plays India, Algeria and so on are wanted.
- **mode:**
  - `historical`: fires only in Historical Mode, inside `window`. The AI favours the option marked `historical` (weight × 4). Nothing is forced: if the conditions do not hold, the window passes.
  - `both`: fires in both modes, by conditions.
  - `sandbox`: fires only in Sandbox Mode. Write these generically, using roles instead of fixed ids (see Roles).
- **trigger.mtth_months:** mean months to fire once the conditions hold. Use `fire_date` instead for an exact historical date.
- **chain:**
  - `after`: the events that must have fired first.
  - `flag`: a flag set when the event fires.
  - Use these for event chains, e.g. India 1885 → 1905 → 1919 → 1930 → 1942 → 1947.
- **options:** 2–4. Each option has a clear benefit and a clear cost. Effects should be concrete; the UI renders them as text automatically.

### Roles (for `sandbox` and generic events)

In ids, write `"$owner"` (the colonial power), `"$colony"` (the movement's regions), `"$nation"` (the movement's nation), `"$overlord"`, `"$subject"`, `"$supporter"` and `"$self"`. The engine binds them when the trigger matches.

Example trigger: `{ "type": "movement_strength_above", "owner": "$self", "value": 60 }` binds `$colony` and `$nation` to that movement.

## Conditions

**Already in the engine:** `exists`, `exists_independent`, `owns`, `owner_in`, `owner_not`, `same_owner`, `law`, `law_not`, `not_at_war`, `not_subject_of`, `regime_changed`, `lost_war_recently`, `legitimacy_below`, `radicalism_above`, `food_shortage`, `ig_clout_above`, `foreign_naval_pressure`, `at_war_with_rebels`, `leader_changed_since_start`, `rank_at_most`, `gov_power`, `foreign_pressure`, `any`, `all`, `count_owner_european`.

**New in EVT-01:**

| type | fields |
|---|---|
| `year_between` | `from`, `to` |
| `is_player` / `is_ai` | `entity` |
| `movement_strength_above` | `owner`, `nation` or `regions`, `value` (0–100) |
| `wave_above` | `value` (anti-colonial wave, 0–1) |
| `subject_of` | `a` (subject), `b` (overlord) |
| `liberty_above` | `subject`, `value` (0–100) |
| `at_war` | `entity` |
| `war_exhaustion_above` | `entity`, `value` (0–100) |
| `embargoed` | `entity`, `min` (number of embargoes) |
| `relation_above` / `relation_below` | `a`, `b`, `value` (−100 to 100) |
| `bloc_camp` | `entity`, `camp` (`west`/`east`) |
| `in_power_bloc` | `entity` |
| `treasury_months_above` | `entity`, `value` (treasury / monthly income) |
| `event_fired` / `event_not_fired` | `id` |
| `flag` / `not_flag` | `flag` |
| `colonies_count_above` | `entity`, `value` (overseas colonial regions) |

## Effects

**Already in the engine:** `set_law`, `legitimacy`, `legitimacy_crisis`, `relation`, `drop_claims`, `transfer_region`, `regime_change`, `merge`, `ig_approval`.

**New in EVT-01:**

| type | fields | meaning |
|---|---|---|
| `movement` | `owner`, `nation` or `regions`, `delta` | independence movement strength ± |
| `grant_independence` | `owner`, `regions`, `nation`, `name_en`, `name_vi`, `mode` (`ties` / `dominion` / `full`) | creates the new state; ties = customs union, alliance and bloc |
| `make_subject` | `subject`, `overlord`, `subject_type` | |
| `subject_type` | `subject`, `to` | autonomy change |
| `subject_liberty` | `subject`, `delta` | |
| `subject_payment` | `subject`, `delta` (±0.1) | |
| `treasury` | `entity`, `months_income` (may be negative) | |
| `war_exhaustion` / `prestige` / `infamy` | `entity`, `delta` | |
| `radicalism` / `nationalism` | `regions` or `entity`, `delta` (0–1) | |
| `embargo` | `by`, `target`, `on` | |
| `support_movement` | `by`, `owner`, `nation` | |
| `alliance` | `a`, `b` | |
| `base_rights` | `host`, `user` | a basing treaty: alliance-like, relations + |
| `customs_union_join` | `entity`, `with` | |
| `declare_war` | `attacker`, `defender`, `goal` (`conquer` / `independence` / `subjugate`), `regions` | |
| `set_flag` / `clear_flag` | `flag` | |
| `trigger_event` | `id`, `delay_months` | |
| `army` | `entity`, `delta_share` (±fraction of manpower) | |
| `trade` | `entity`, `delta` (temporary openness ±, `months`) | |
| **`modifier`** | `entity`, `id`, `name_vi`, `name_en`, `months`, `decaying` (bool), `effects` {key: value} | **a timed buff/debuff, V3-style** (e.g. "The Heroic Era, 2 years, decaying") |
| `start_journal` | `entity`, `id` | opens a story journal (below) |
| `trigger_event` | `entity`, `id` | fires a follow-up event now (chains) |

### Modifier keys (`effects` of `modifier`)

| key | meaning |
|---|---|
| `trade`, `tariff`, `construction`, `research`, `innovation`, `tax`, `literacy`, `attraction`, `army`, `police` | fractions, e.g. 0.05 = +5% |
| `reform` | law reform progress per month (0.01 = +1%/month) |
| `radicalism` | target radicalism ± (0.02 = +2 points) |
| `legitimacy` | legitimacy target ± (points) |
| `birth` | birth rate ± (0.001 = +1‰) |
| `prestige`, `war_exhaustion` | per month ± |
| `clergy` | clergy approval ± |
| `ig_landowners`, `ig_industrialists`, `ig_intelligentsia`, `ig_petty_bourgeoisie`, `ig_clergy`, `ig_armed_forces`, `ig_rural_folk`, `ig_trade_unions` | approval of that interest group ± (−10…10 scale) |

**Owner rule (2026-11-23): every option must give something.** Each option carries at least one `modifier` (buff or debuff, with a name and a duration) or another concrete effect. Options trade gains for costs so that no option is free.

## Story journals (V3-style journal entries)

In the same file, put `"journals": [ … ]`:

```json
{ "id": "ita_risorgimento", "country": "SAR", "mode": "both",
  "trigger": { "conditions": [ … ] },
  "title_vi": "…", "text_vi": "…",
  "progress": { "start": 0, "max": 100, "label_vi": "Thống nhất", "monthly": [ { "if": { … }, "add": 2 }, { "add": -1 } ] },
  "complete": [ conditions, all must hold; may use { "type": "progress_at_least", "value": 100 } ],
  "fail": [ conditions, any one fails it; may use { "type": "months_elapsed", "value": 120 } ],
  "timeout_months": 120, "on_timeout": "fail",
  "on_complete": [ effects ], "on_fail": [ effects ] }
```

- **Progress steps (EVT-02, 2026-11-27):**
  - A step runs every month while its `if` holds ("rate" steps: e.g. `+2` while at war, `-1` always).
  - A step is a **one-shot milestone** if it has `"once": true`, and by default when its `if` is `event_fired` (that condition stays true forever, so it must not add points every month). `"once": false` forces a repeating step. An optional `"id"` names the milestone.
  - Milestone journals: the milestones must add up to the `progress_at_least` threshold, and must not be paired with an unconditional decay (`{ "add": -1 }`), which makes the threshold unreachable. Give era journals a `year_between` trigger, and a timeout that outlasts the last milestone.
  - Better than pure milestones or pure timers: mix milestones with rate steps that depend on the player's situation (laws, wars, radicalism, legitimacy), so the journal reflects how the country is doing, not only the calendar.
- **Exact dates and the monthly clock:** an event with `fire_date` is dispatched on the first monthly tick (the 1st) on or after that date, and a country gets at most one story event per month. Keep `window` and any `year_between` open for at least two months after `fire_date`; a December date needs the window to run into the next year. `tests/story-journals-once.test.ts` checks this for every pack.
- A journal opens by its `trigger`, or by a `start_journal` effect.
- Use `trigger_event` in `on_complete` / `on_fail` for outcome events.
- **Interest-group petitions** are a journal with a deadline: "Expect law X within 5 years" → kept: approval buff; broken: debuff.
- See `historical_data/events/story/generic_politics.json` (written by Claude, `tools/data/build-story-generic.py`) for working examples: petitions, 1848, strikes, epidemics, inventors.

Ids of countries and regions must exist in `historical_data/political_entities/registry.json` and `historical_data/borders/regions_1836.csv`. If an id is missing, write `"TODO:<name>"` and list it at the end of the file; the build reports it.
