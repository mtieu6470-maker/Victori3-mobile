# CG-39 — United Nations system, veto history and Victoria 3 infamy parity

**Research date:** 2026-11-23  
**Repository branch:** `ccr-b27f3fb8-epfpd6`  
**Scope:** Historical research and data only; no gameplay code changed.

## Deliverables

- `docs/research/data/CG39_UN_MEMBER_ADMISSIONS_1945_2026.csv` — 193 current UN Member States, ISO3, admission date and continuity notes.
- `docs/research/data/CG39_UNSC_VETOES_BY_DECADE_1946_2026.csv` — P5 veto counts by decade and member.
- `docs/research/data/CG39_COLLECTIVE_SECURITY_CASES_1950_1990.csv` — Korea 1950, Southern Rhodesia 1966 and Iraq/Kuwait 1990 resolutions.
- This report records the rules, evidence, caveats and implementation guidance.

## 1. Membership: what the data means

As of 23 Nov 2026 the UN has **193 Member States**. The admissions file records the date on which the current member entered the Organization; this is not necessarily its independence date, its founding date, or the date it acquired its current name. The 51 original members joined at the founding in 1945; subsequent entries reflect admission decisions under Article 4.

Important continuity cases are explicitly noted:

- **China:** the Republic of China was an original member and occupied the China seat until 25 Oct 1971. General Assembly resolution 2758 recognized PRC representatives as the only lawful representatives of China and restored China's rights; this was a representation/seat change, not a new admission of China.
- **USSR / Russian Federation:** the USSR was an original member. On 24 Dec 1991 Russia notified the Secretary-General that USSR membership, including the Security Council seat and all other UN organs, would be continued by the Russian Federation. Russia is not a new 1991 admission.
- **Ukraine and Belarus:** the Ukrainian SSR and Byelorussian SSR were original members in their own right; independence in 1991 did not create new admission dates.
- **Germany:** the Federal Republic and German Democratic Republic were both admitted on 18 Sep 1973; after unification on 3 Oct 1990 the Federal Republic's membership continued.
- **Yemen:** the Yemen Arab Republic (North Yemen) was admitted in 1947; the People's Democratic Republic of Yemen (South Yemen) was admitted in 1967. They united in 1990 and the current Yemen continued membership.
- **Tanzania:** Tanganyika was admitted in 1961; Zanzibar was admitted separately in 1963; the union formed in 1964 and continued as one member.
- **Syria / UAR:** Syria was an original member, joined Egypt in the United Arab Republic in 1958, then resumed separate membership in 1961.
- **Indonesia:** announced withdrawal in 1965 and resumed participation in 1966 without a new admission.
- **Serbia:** the Federal Republic of Yugoslavia was admitted in 2000; Serbia continued membership after Montenegro separated in 2006.

### Admission politics and veto history

Under Charter Article 4(2), admission requires a Security Council recommendation and a General Assembly decision. A permanent member can therefore block an application at the Council stage. The 1950–1955 deadlock is a major historical example: the USSR vetoed applications from 14 non-Soviet candidates; five Soviet-sponsored candidates also failed to secure the required support. A compromise then enabled the admission of **16 states on 14 Dec 1955** under Security Council resolution 109. Japan, the Republic of Korea and Viet Nam were still blocked at that time and joined later (Japan 1956, Viet Nam 1977, both Korean states 1991).

The dataset deliberately separates UN admission dates from independence dates. Examples: Malaya became independent in 1957 but joined the UN on 17 Sep 1957; Cyprus became independent in Aug 1960 and joined in Sep; Namibia became independent in Mar 1990 and joined in Apr; Eritrea became independent in May 1993 and joined the UN on 28 May.

## 2. Security Council structure and voting

The actual Security Council has **15 seats: five permanent members (China, France, Russia, United Kingdom, United States) and ten elected members**. The Council had 11 seats at the UN's founding; the 1965 Charter amendment enlarged it to 15. Article 27 now requires nine affirmative votes for decisions. On substantive matters, those votes must include the concurring votes of the permanent members; a negative vote by any P5 member blocks adoption. An abstention or absence is not a veto. Procedural matters do not carry the P5 veto; Article 27(3) also provides for a party to a dispute to abstain in specified Chapter VI / Article 52(3) decisions.

**Project design warning:** the board's four-permanent-seat rule is a deliberate gameplay abstraction, not historical parity. If historical accuracy is the priority, use all five P5 seats. If the four-seat limit is retained for performance or balance, document which powers are abstracted and do not label the result a literal UN simulation.

## 3. Veto statistics, 1946–2026

Source: Magnus Lundgren, *UN Security Council Vetoes Dataset*, version 1 (6 Nov 2026), covering 16 Feb 1946–30 Oct 2026. The unit is a vetoed item: **274 items** received **332 member vetoes** because joint vetoes count once for each permanent member that voted no. The dataset includes not only complete draft resolutions but also parts of drafts, amendments, membership applications and procedural questions. Therefore 332 is not the number of resolutions.

### By permanent member

| Member (historical continuity) | Vetoes | Share of 332 |
|---|---:|---:|
| Russia / USSR | 164 | 49.4% |
| United States | 95 | 28.6% |
| United Kingdom | 32 | 9.6% |
| China (ROC until 25 Oct 1971; PRC after) | 23 | 6.9% |
| France | 18 | 5.4% |
| **Total** | **332** | **100%** |

### By decade and permanent member

| Decade | China | France | Russia / USSR | UK | US | Total member vetoes |
|---|---:|---:|---:|---:|---:|---:|
| 1940s (1946–49) | 0 | 2 | 46 | 0 | 0 | 48 |
| 1950s | 1 | 2 | 45 | 2 | 0 | 50 |
| 1960s | 0 | 0 | 18 | 1 | 0 | 19 |
| 1970s | 2 | 7 | 7 | 14 | 21 | 51 |
| 1980s | 0 | 7 | 4 | 15 | 46 | 72 |
| 1990s | 2 | 0 | 2 | 0 | 6 | 10 |
| 2000s | 2 | 0 | 4 | 0 | 10 | 16 |
| 2010s | 9 | 0 | 19 | 0 | 3 | 31 |
| 2020s (through 30 Oct 2026) | 7 | 0 | 19 | 0 | 9 | 35 |
| **Total** | **23** | **18** | **164** | **32** | **95** | **332** |

The 1980s are the highest decade by member-veto events (72), followed by the 1970s (51) and 1950s (50). The Russia column includes the USSR before 1992; the China column includes the ROC before 25 Oct 1971. The 2020s figure is partial through 30 Oct 2026.

The veto dataset's issue-area coding is also useful for simulation priorities: UN membership/appointments 63 items; use of force and ceasefires 61; occupation/territory/settlements 26; decolonization/self-determination 22; accountability/investigations 21; peace operations 21; political crises/human rights 21; sanctions 16; humanitarian access/protection 12; non-proliferation/disarmament 9; other thematic 2. This is a coded research taxonomy, not a list of 274 adopted resolutions.

## 4. Collective-security cases for game rules

### Korea, 1950 — collective military assistance

Resolutions 82 (25 Jun), 83 (27 Jun) and 84 (7 Jul) called for withdrawal, assistance to the Republic of Korea and a unified command under the United States. The USSR was not participating in the Council during its boycott over the China representation dispute; **there was no Soviet veto**. Resolution 84 recommended that contributing states place their forces under a US-led unified command and allowed the UN flag. This was not a standing UN peacekeeping force.

### Southern Rhodesia, 1966 — mandatory sanctions

Resolution 232 (16 Dec 1966) imposed commodity sanctions under Charter Articles 39 and 41. It passed 11–0–4; France and the USSR abstained. This demonstrates that a P5 abstention does not block adoption when the required affirmative votes are met.

### Iraq / Kuwait, 1990 — sanctions and delegated force

Resolution 661 (6 Aug 1990) imposed broad economic and financial restrictions under Chapter VII, with medical and humanitarian exceptions, and passed 13–0–2. Resolution 678 (29 Nov 1990) authorized member states cooperating with Kuwait to use “all necessary means” if Iraq failed to comply by 15 Jan 1991; it passed 12–2–1, with China abstaining and no P5 veto. The latter was an authorization for a multinational force, not a UN-commanded operation.

## 5. Victoria 3 infamy — current-version comparison

The infamy concept is a diplomatic cost/reputation system, not a UN veto score. It increases through aggressive war goals and sovereignty violations; actions can create a diplomatic incident localized to a strategic region. Other states' reactions, willingness to make agreements or join a play, and the possibility of a containment-style response should be driven by the target and observer states' interests, rank and relations.

### Legacy vanilla thresholds and decay (verify against 1.15 files)

The familiar vanilla bands are Reputable below 25, Infamous at 25, Notorious at 50 and Pariah at 100. The familiar base decay define is 5 infamy per year; unallocated Influence capacity can increase the decay rate. These are useful baseline values, but the project should verify the actual installed 1.15 `common/defines/00_defines.txt` before freezing numbers. The 1.15 release notes describe a major cost rebalance but do not themselves publish new tier thresholds or a new decay constant.

### Update 1.15 changes that must be represented

- Infamy cost is recalculated around a target state's share of **global GDP and population**; low-impact and marginal states cost much less, while economically/demographically important territory costs much more.
- Most war goals anchor their costs to the new state-infamy valuation. A fixed per-province cost will not reproduce 1.15.
- A game rule scales infamy generation up or down; a State Infamy map mode shows the cost of taking each state from the current country's perspective.
- The Release Country war goal now requires a minority movement with at least **50% activism**. A separate Release as Subject goal creates an autonomous subject and generates significant infamy.
- Historical wars configured at game start no longer give participants infamy. Infamy reductions must not turn a war goal into a net infamy-generating/infamy-reducing exploit.

The 1.15 patch notes are the controlling reference for this update. Legacy thresholds/decay should be treated as a data-validation task, not assumed to have been redesigned simply because the cost formula changed.

## 6. Recommended implementation contract

1. **No UN before 1945.** Create the institution through a post-war founding event in historical mode; do not project the UN backward into 1836–1944.
2. **Membership is a dated state machine.** Keep `admission_date`, optional `withdrawal_date`, continuity/succession metadata and historical entity IDs. Do not derive admission from independence.
3. **Council membership is separate from UN membership.** Ten elected seats rotate on two-year terms with regional allocation; P5 seats are permanent. In 1945–1965 use 11 total seats and a 7-vote threshold; from the 1965 amendment use 15 seats and a 9-vote threshold.
4. **Veto logic is vote-based.** On substantive items, any P5 negative vote blocks; abstention/absence does not. Procedural items do not use the veto. Record the P5 vote, total yes/no/abstain/absent and resolution outcome.
5. **Resolution outcomes are not automatic world events.** Separate recommendation, adopted resolution, sanctions, peacekeeping mandate, delegated force authorization, and actual member-state compliance. Add implementation and enforcement delays.
6. **Do not equate the Security Council with Victoria 3 Power Blocs.** The UN is a universal intergovernmental organization with a Council; Power Blocs are voluntary influence/economic/security groupings. They may interact, but are different systems.
7. **Infamy is independent of UN membership/voting.** Calculate it from war goals, state value and modifiers; use UN sanctions or condemnation as external consequences that may modify diplomacy, trade or legitimacy without rewriting the infamy value itself.
8. **Keep historical exceptions explicit.** China, USSR/Russia, Korea, Yemen, Tanzania, Germany and Syria need continuity rules. Do not silently collapse them to today's ISO3 rows.

## Sources

- UN Member States, official list and admission dates: https://www.un.org/en/about-us/member-states
- UN Dag Hammarskjöld Library, Member States research guide and membership history: https://research.un.org/en/unmembers
- UN Digital Library / UN Library member-state names dataset (2026): https://digitallibrary.un.org/
- UN Charter, Chapter V, Article 27: https://www.un.org/en/about-us/un-charter/chapter-5
- Security Council voting system and veto explanation: https://main.un.org/securitycouncil/en/content/voting-system
- 1955 admission deadlock and 14 Soviet-blocked candidates (FRUS): https://history.state.gov/historicaldocuments/frus1955-57v11/d102
- 1955 Security Council Resolution 109 admitting 16 states: https://digitallibrary.un.org/record/112083
- UNGA Resolution 2758 and China representation: https://digitallibrary.un.org/record/498905
- Russian Federation continuation of USSR membership: https://www.un.org/en/about-us/member-states/russian-federation and https://ask.un.org/faq/378083
- UN Security Council Vetoes Dataset, Magnus Lundgren, v1, 6 Nov 2026: https://magnuslundgren.org/unsc-vetoes/ and https://magnuslundgren.org/unsc-vetoes/data/codebook
- UN official Korea resolutions 82/83/84: https://digitallibrary.un.org/record/112025, https://digitallibrary.un.org/record/112026, https://digitallibrary.un.org/record/112027
- UN official Southern Rhodesia Resolution 232 and vote: https://digitallibrary.un.org/record/90502 and https://digitallibrary.un.org/record/280432
- UN official Iraq/Kuwait Resolutions 661 and 678: https://digitallibrary.un.org/record/94221 and https://digitallibrary.un.org/record/102245
- Victoria 3 official 1.15 changelog / Dev Diary 196: https://steamcommunity.com/app/529340/announcements/
- Victoria 3 1.15 infamy rebalance, release-country rules and state-infamy map mode: https://steamcommunity.com/app/529340/announcements/?l=spanish
- Victoria 3 official Dev Diary on infamy and diplomatic incidents: https://store.steampowered.com/news/posts/?enddate=1634227241&feed=steam_community_announcements
- Community reference for legacy infamy thresholds (verify against 1.15 installed game data): https://steamcommunity.com/sharedfiles/filedetails/?id=2891239044
- Community reference sometimes cited for the legacy decay value (not authoritative; verify against installed 1.15 defines): https://gamebox.jp/victoria3/infamy.html

## Parity matrix review notes

The current global parity matrix still marks diplomatic plays as missing and power blocs as missing, while Infamy and United Nations are partial. The matrix's production-method row should be rechecked against the current branch because the latest code commit includes an initial PM-1 implementation. For CG-39, keep UN membership, Council/veto/resolution simulation and sanctions as separate tracked capabilities; the 193-row membership dataset alone does not constitute a working UN feature.

## 7. Current-branch implementation audit (read-only)

Files inspected on this branch:

- `src/engine/systems/un.ts` — the live UN implementation.
- `src/engine/systems/diplomacy.ts` — infamy, aggression, decay, alliances and war declaration.
- `src/engine/systems/politics.ts` — interest groups, legitimacy, reforms and revolution checks.
- `docs/audit/GLOBAL_VICTORIA3_FEATURE_PARITY_MATRIX.csv` — 63 tracked parity rows.

### UN engine versus the historical record

The current engine already implements the owner's deliberate **four-permanent-seat** rule, 6/10 elected seats, 7/9 affirmative-vote thresholds, an October 1945 founding event, veto counting, and automatic condemnation of certain member-on-member wars. Keep the four-seat rule as an owner-directed gameplay abstraction; do not silently describe it as the actual P5 arrangement.

The research identifies several gaps between the present code and historical process:

1. `foundUn()` adds every sovereign country alive in the simulated world in October 1945. That is not the historical 51-member founding list. Use the membership register and the game's country/territory mapping to seed 1945 members.
2. Later members are admitted automatically 12 months after a country forms. Real admission requires a Security Council recommendation and a General Assembly decision; P5 vetoes can block the Council recommendation. The 1955 package and continuity cases in the CSV are not yet consumed by the engine.
3. Elected seats are selected by weighted random power/prestige, not a General Assembly election with regional allocation. Terms rotate, but the current initial one-year/two-year staggering is a game approximation.
4. A Council vote is currently triggered automatically for every qualifying conquest/colonial war between members. Historically the Council does not automatically vote on every war; an item must reach the Council's agenda. The current automatic rule is a project abstraction.
5. The engine currently models condemnation as one outcome with fixed project effects (+10 infamy, +10 war exhaustion, −20 relations). It does not yet model resolution types, sanctions, peacekeeping mandates, delegated force authorizations, reporting, compliance or enforcement delays.
6. `holdVote()` models substantive veto logic but has no separate procedural-vote path, admission recommendation, or General Assembly vote. An abstention is not a veto, and that distinction should remain explicit.

### Infamy: concrete parity differences

Current branch values in `src/engine/systems/diplomacy.ts`:

| Project implementation | Value / behavior | Victoria 3 reference |
|---|---|---|
| `INFAMY_TIERS` | 25 / 50 / **80** | Familiar vanilla thresholds are 25 / 50 / **100** (Pariah); the official legacy Dev Diary explicitly gives 100. Confirm installed 1.15 defines before locking values. |
| `INFAMY_DECAY_PER_MONTH` | 0.25 = **3 per year** | Some community references cite a legacy base of 5 per year; the official Dev Diary confirms slow decay and an increase from unallocated Influence but does not publish the numeric base. Treat 5/year as an unverified legacy reference and read the installed 1.15 define before adopting any constant. |
| Decay condition | Stops while the country is an attacker in a conquest/colonial war | Public 1.15 notes and the official Infamy diary describe slow decay and an Influence-related boost, but do not establish this offensive-war pause. Treat the pause as a project rule until verified against 1.15 game data. |
| `warInfamy()` | number of targeted regions × 3, multiplied by 4 after 1945; independence is free | Victoria 3 1.15 bases most territorial war-goal costs on a target-state value derived primarily from global GDP and population, then applies rank, recognition, subject, interest and other modifiers. A flat region multiplier is not parity. |
| `CONTAIN_AGGRESSOR` | Target infamy ≥25 or currently attacking; attacker pays 25% normal infamy | This is a project-specific discount for fighting an aggressor. It is **not** Victoria 3's Pariah containment war goal. |
| `POST_1945_NORM` | Conquest multiplier ×4 from 1945 | This is a project historical-norm rule, not the Victoria 3 infamy formula. Keep it separate and label it as a project rule. |

### What “containment” means in Victoria 3

The older official Dev Diary calls the play **Contain Threat**; current references and 1.15 notes use **Cut Down to Size**. It is a punitive war goal against a **Pariah** (legacy threshold 100), not a blanket rule that makes every war against a country with 25 infamy cheap.

The reference play is launched by a Great Power against a Pariah; the Great Powers are drawn into the response. If enforced, the target must release states and subjects acquired through conquest in the previous ten years, and its other active war-goal claims are removed. In 1.15, Cut Down to Size is one of the exceptional war goals that is enforced only through capitulation or a peace deal, not by the normal mid-war occupation progress bar.

Infamy itself is generated when aggressive demands are added to a diplomatic play and creates diplomatic incidents/relationship damage. It decays over time; available sources do not support a universal claim that merely being at war erases or suspends the infamy value. Some unpressed demands can receive refunds, but the relationship damage is not reversed. Thus:
- **Containment war** = other Great Powers attempt to roll back recent expansion by a Pariah.
- **Project anti-aggressor discount** = a separate owner rule that makes fighting an aggressor cheaper.
- **Offensive-war decay pause** = currently implemented project behavior, not verified as Victoria 3 parity.

## 8. Core Victoria 3 parity gaps, ranked by gameplay dependency

The matrix has 63 rows. The list below prioritizes the systems that create the actual grand-strategy loop, not optional visual or content-pack detail.

### P0 — must become functional before claiming Victoria 3-like depth

1. **Diplomatic plays — MISSING / NOT_STARTED (`DIPLOMATIC_PLAYS`).** Add opening moves, escalation, maneuvers, primary/secondary demands, sways, neutrality, backdown, countdown and transition into war. Immediate `declareWar()` is not a substitute. This is the largest blocker for meaningful diplomacy and UN interaction.
2. **POP cohorts, needs and identity — PARTIAL (`POP_COHORTS`, `POP_NEEDS`, `IDENTITY_RIGHTS`).** Cohorts need population, culture, religion, strata/class, occupation, age/household structure, wealth and political identity. Needs baskets and Standard of Living must respond to prices, wages, taxes, shortages and access; discrimination and accepted-culture/religion rules must feed jobs, migration, radicalism and politics.
3. **Employment, qualifications and wages — PARTIAL (`EMPLOYMENT_WAGES`).** Buildings need job slots by profession, qualification eligibility, hiring competition, wage setting, unemployment, layoffs and labor mobility. Without this, production cannot react credibly to shortages or profitability.
4. **Production methods and full supply chains — PM-1 now IMPLEMENTED as an initial slice; matrix status is stale.** Commit `3d47b0274726f8c72c862a6a8928d65e4194aa3c` adds methods for four factory buildings and player selection, but the methods currently change input mix; output per worker remains RECIPES × technology. Extend to the remaining building sectors, method-specific productivity, goods (including electricity), by-products, throughput and technology unlocks. Then make supply/demand, inventories or unsold-output handling, input shortages and prices interact consistently.
5. **Markets, trade and logistics — PARTIAL (`MARKETS`, `TRADE`, `LOGISTICS`).** Add market membership/market access, buy/sell orders, price convergence and bounds, tariffs, trade routes, ports, convoys, shipping capacity and blockade effects. This is a direct dependency for industrialization and naval strategy.
6. **Construction, budget and credit — PARTIAL (`CONSTRUCTION`, `FINANCE`).** Construction sectors must consume goods and labor, queue projects, compete for inputs and be limited by throughput. Budget must model taxes by base, tariffs, government wages, institutions, interest, debt service, credit constraints, deficits and default/creditworthiness.
7. **Interest groups, laws, institutions and organized movements — PARTIAL / NOT_STARTED (`INTEREST_GROUPS`, `LAWS_INSTITUTIONS`, `MOVEMENTS`).** The current code has clout/approval, law reform progress and a stochastic revolution check; it does not yet have organized movements with activism, radicalism, support, demands, political agitation and movement-driven law changes/revolutions. Implement `POL-03` before treating politics as parity.
8. **Military, war support and peace — PARTIAL (`ARMIES`, `NAVIES`, `WAR_SUPPORT`, `PEACE`).** Complete formations, fronts, commanders, mobilization, supply, naval missions/invasions, battle resolution, war-support dynamics, occupation and negotiated peace/war-goal enforcement. 1.15's mid-war goal enforcement and 0–100 war-support loop are important reference behaviors.
9. **National AI planner — PARTIAL (`AI`).** AI needs goals, strategic regions, budgets, industrial priorities, diplomacy, war-risk evaluation, coalition preferences and consistent multi-year planning; isolated heuristics are not enough.
10. **Journal and event chains — PARTIAL (`JOURNAL`, `EVENTS`).** Add persistent objectives with triggers, progress, completion/failure, rewards and branching event chains; support both historically grounded and emergent outcomes.
11. **Save compatibility and Android performance — NEEDS_QA (`SAVE`, `MOBILE_PERF`, `CLOCK_HOURLY`).** Regression tests, long-run determinism, save migrations, memory/CPU/thermal profiling and large-world AI turn budgets are release gates, not polish.

### P1 — important depth after the P0 loop is stable

- **Parties, elections and legislature** (`PARTIES_ELECTIONS`, NOT_STARTED): party formation, vote eligibility, electoral systems, seats, government formation and legislative constraints.
- **Subjects and autonomy** (`SUBJECTS`, PARTIAL): subject types, obligations, autonomy, liberty desire, overlord interventions and independence plays.
- **Power blocs** (`POWER_BLOCS`, MISSING): membership, cohesion, leverage, principles, bloc leader, joining/leaving and treaty-based defensive/offensive coordination. Do not substitute the UN for this system.
- **National awakening / colonization / indigenous agency** (`NATIONALISM_FORMATION`, `COLONIZATION`): cultural movements, unification candidacies, decentralized polities, colonial claims, resistance and decolonization.
- **Ship design and gunboat diplomacy** (`SHIP_DESIGN`, NOT_STARTED): hulls/modules, ship classes, fleet roles, ship transfer treaties and power projection.
- **Map, UI, localization and observer mode**: complete strategic overlays, readable ledgers/tooltips, Vietnamese historical names and reliable AI-vs-AI observation.

### P2 — content breadth, not substitutes for core mechanics

Companies/charters, individual released content packs, portraits, building art, music/audio/video and cosmetic asset delivery expand flavor and presentation. They should not displace the P0 simulation systems above.

## 9. Recommended next slices for Claude

1. **DIP-02:** implement the diplomatic-play state machine and tests before deepening the automatic UN condemnation rule.
2. **POP-01 / POP-02 / POP-03:** cohort model, needs/SoL, discrimination and identity, with migration and radicalism derived from those cohorts.
3. **IND-01 continuation + GOODS-1 + ECON-01/02:** mark PM-1 as partial/implemented, add goods and method productivity, then close the input/output and market-price loop.
4. **FIN-01 / IND-04:** connect construction and fiscal capacity to the goods/labor market.
5. **POL-03:** movements/activism before adding more revolutions or election UI.
6. **MIL-01..05 / WS-01:** complete military logistics, war support and peace settlement.
7. **AI-01..03 + HIST-02:** national planning and journal/event chains, then run long historical and sandbox benchmarks.

The above order is a dependency recommendation from the matrix, not a request to abandon the current branch plan or change branches.
