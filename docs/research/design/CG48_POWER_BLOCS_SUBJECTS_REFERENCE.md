# CG-48 — Victoria 3 Power Blocs & Subjects: design reference

- Researcher: ChatGPT
- Date: 2026-11-23
- Requested baseline: Victoria 3 1.7 Sphere of Influence
- Current comparison: 1.15.2 (hotfix 2026-11-19)
- Purpose: internal research for Victori3. This is a paraphrase, not copied game text.
- Copyright: all screenshots, logos and game assets remain the property of Paradox Interactive / their respective uploaders. The remote links below are reference-only. No image binary is redistributed or included in the game/APK/assets.
- Confidence: High = official Paradox source; Medium = maintained wiki / extracted game definitions; Low = secondary guide or interpretation.

## Executive findings

1. A Power Bloc is a persistent political-economic institution, not merely a military alliance. It has a central identity, principles, member-wide effects, leader-only powers, cohesion, mandates, leverage competition, internal leadership contests and identity-specific monuments.
2. The five identities in the 1.7 baseline are Trade League, Sovereign Empire, Ideological Union, Military Treaty and Religious Convocation. A later 1.13-era reference also lists Cultural Commonwealth; do not silently treat it as one of the original five.
3. The identity is effectively locked at formation and determines exclusive primary principle groups. Principles have three cumulative tiers; a bloc needs a primary principle matching its identity or suffers a cohesion penalty.
4. Joining requires both a leverage advantage and the target's acceptance. The 1.7-era reference uses a 1,000-point leverage pool divided between the target and competing blocs; invitation requires a 200-point lead over the next-highest share.
5. Sovereign Empire is not just a flat tribute rate. Its mechanics combine subject relationships, autonomy, payment, liberty desire, leader authority/influence, member authority/influence penalties and a separate 5% tax-income transfer at the highest Exploitation of Members tier.
6. Subject base income transfers are much higher than Victori3 PB-02's 2/4/6%: 1.15.0 extracted definitions list 30% for Puppet, Vassal, Colony and Chartered Company; 25% Dominion; 20% Tributary; 15% Crown Land. Protectorate and Personal Union have no base rate specified. These are pact base rates, before exemptions and modifiers.
7. Victori3 PB-02 already has five identities, principles, leverage, cohesion, invitations and mandates. Its biggest gaps are subject autonomy, liberty desire, differentiated member obligations, detailed leader/member effects and a meaningful net-benefit preview.

## 1. Scope and version discipline

The requested baseline is 1.7 Sphere of Influence, launched 2024-06-24. This report explains the original five identities first. The current comparison uses a maintained extraction of 1.15.0 definitions (extracted 2026-11-05), official 1.15 / 1.15.1 / 1.15.2 announcements, and wiki pages marked verified only through 1.13. This is important: the wiki's numeric tables are useful, but they are not proof every value remains unchanged in 1.15.2. The 1.15.2 patch notes reviewed here do not announce a wholesale redesign of bloc identities or subject payments; they do include diplomatic and subject/AI fixes. Recheck exact target-version files before treating every number as current.

### 1.1 The original five identities

| Identity | Strategic model | Leader advantage | Member benefits | Member obligations / risks |
|---|---|---|---|---|
| Trade League | Integrated market / customs union | Trade-capacity advantage; market-centre gravity | Shared market, trade and convoy bonuses | Surrenders independent market/tariff control; exposed to leader's economic gravity |
| Sovereign Empire | Hierarchical empire / suzerainty | Can subjugate weaker bloc members; subject-related extraction and authority benefits | Protection; may retain internal institutions depending on subject type | Income transfer, restricted diplomacy, war obligations and liberty pressure |
| Ideological Union | Political / regime alignment | Can impose selected political laws and force regime change | Easier enactment of laws matching the leader | Reduced policy autonomy; forced reforms can trigger movements or revolutions |
| Military Treaty | Collective security | Military prestige/projection bonuses; coordinated war actions | Training and collective defence | Cannot attack bloc members; war obligations and escalation risk |
| Religious Convocation | Confessional association | Can impose State Religion; clergy investment-pool benefits | Conversion, Devout political strength and demographic effects | Religious-law restrictions; incompatible secular laws can damage cohesion |

The identity is a strategic package. Tooltips must distinguish (a) effects for all members, (b) leader-only effects and (c) non-leader member effects.

### 1.2 Later identity: Cultural Commonwealth

The 1.13-era reference lists a sixth identity, Cultural Commonwealth, associated with Citizenship law and spreading the leader's primary culture; its primary principle is Freedom of Movement. It is not one of the original five requested for 1.7. Victori3 should ship the five first, or list the sixth as a deliberate later expansion. Do not state that all later versions always had only five identities.

## 2. Bloc formation, cohesion, leverage and mandates

### 2.1 Formation

The 1.13-verified reference says Great Powers, Major Powers and Unrecognized Major Powers can found a bloc; formation costs 500 Influence. Isolationism (and in the later reference Canton System) prevents formation. Subjects cannot independently found blocs and join/leave with their overlord. The first mandate is free and must be spent on one of the identity's primary principles. The central identity is effectively locked for the life of the bloc. Formation also reduces relations with other bloc leaders by 30 in the wiki reference.

### 2.2 Cohesion

Cohesion is the bloc's internal alignment and stability. It affects mandate generation, the effectiveness of high-tier principles and the risk of internal strain or defections. Identity-specific factors matter:

| Identity | Base | Positive drivers | Negative drivers |
|---|---:|---|---|
| Trade League | 15 | Leader's share of bloc GDP; leading-goods-producer tiers | −1 per independent non-leader member; worst negative relations; market shortages (−5 each); weak member economic dependence |
| Sovereign Empire | 30 | Leader's share of bloc prestige | −3 per independent non-leader member; worst negative relations; worst subject liberty desire |
| Ideological Union | 30 | Leader legitimacy | −2 per independent non-leader member; worst negative relations; worst government/law difference |
| Military Treaty | 30 | Leader's share of bloc power projection | −2 per independent non-leader member; worst negative relations; leader infamy; −5 per National Militia member |
| Religious Convocation | 30 | Leader Devout clout and faithful-population share | −2 per independent non-leader member; poor relations; no Devout in government (−15); members with Total Separation / State Atheism (−10 each) |

The wiki's table gives factor weights, not a simple final cohesion equation. Some terms are rank-scaled and use the single worst member rather than a sum. Do not implement it as a naive linear formula without reproducing those scopes and caps. A bloc led by a country that is no longer a Great Power has a −50% cohesion modifier in the reference.

### 2.3 Leverage: the sphere-of-influence contest

The target country has a pool of 1,000 current leverage divided proportionally among its own resistance and the factors generated by competing blocs. Thus:
- leverage factors are inputs, not the final visible leverage share;
- each actor's share is its factor divided by all factors;
- invitation requires at least 200 more current leverage than the next-highest bloc or the target itself;
- meeting the numerical threshold does not force acceptance: relations, attitude, relative rank, cohesion and identity fit still matter;
- an obligation can be offered to sway acceptance;
- rejection damages relations (−50 in the wiki reference).

Reference leverage factors (1.13-verified wiki; exact scopes matter):

| Source | Factor |
|---|---:|
| Leader has an interest in a target region | +100 |
| Leader has alliance with target | +400 |
| Guarantee independence | +300 |
| Defensive pact | +300 |
| Military assistance | +300 |
| Power Bloc embassy | +300 |
| Trade privileges | +300 |
| Investment rights | +300 |
| Economic dependence | +200 per point; Foreign Investment principle multiplies by 1.5 |
| Fighting the same war | +200 |
| Same religion in Religious Convocation | +100 |
| Treaty port in target | +200 |
| Direct adjacency | +150 (does not stack with strategic adjacency) |
| Strategic adjacency | +100 |
| Shared culture trait | +100 |
| Shared heritage trait | +50 |
| Shared heritage plus another trait | +50 |
| Target interest-group clout in lobby endorsing leader | +5 per clout percentage point |
| Target interest-group clout in lobby opposing leader | −5 per clout percentage point |

The complete list includes other resistance and modifiers. Infamy can reduce leverage generation. The target's resistance depends on rank, population and laws such as trade policy, free speech and migration.

**Worked leverage example:** if total factors equal 4,000 and one bloc contributes 1,000, it gets 25% of the 1,000-point pool = 250 current leverage. It can invite only if the next-best share is 50 or less, because the required lead is +200. Raw factor totals therefore cannot be compared directly to the +200 threshold.

### 2.4 Mandates and principle slots

Mandates are the bloc's governance currency:
- weekly progress from non-leader members by rank: Great Power +10, Major +5, Minor +2, Unrecognized Major +2, Unrecognized Regional +1; insignificant and unrecognized powers contribute zero;
- bloc prestige rank adds +5 for rank 1, +4 for rank 2, +3 for rank 3, +2 for rank 4, and +1 for other ranks;
- total progress is multiplied by current cohesion;
- 2,000 progress = one mandate;
- up to three mandates can be banked;
- principle tier costs mandates equal to its tier; upgrade pays only the difference;
- first principle is free at founding.

DLC-era slot conditions:
- slot 1 and slot 2: baseline;
- slot 3: bloc rank 5th or better and at least 5 members;
- slot 4: bloc rank 3rd or better and at least 10 members.
Once unlocked, a slot remains even if rank/member conditions later fall below the threshold. Without Sphere of Influence, the reference says only one principle is usable.

Do not confuse slots with tiers: a bloc can select multiple principle groups, and each group has its own level I, II or III.

### 2.5 Leadership struggle

A power struggle can start if an independent member has at least 20% more prestige than the leader. If it maintains at least 15% more prestige for 12 months, it becomes leader; the original founder needs 9 months in the wiki reference. This is distinct from an ordinary member leaving.

### 2.6 Monuments / statues

Members can build one Power Bloc statue per state (DLC feature; 2,500 construction in the wiki reference). The statue provides +3 prestige and an identity-specific local effect when monument effects are enabled:
- Sovereign Empire: local decree cost −25%;
- Trade League: +10% infrastructure from population and +10% loyalists from movements;
- Military Treaty: +25% local conscriptable battalions;
- Religious Convocation: +25% local conversion and −10% turmoil effects;
- Ideological Union: +25% local pop political strength and +5 Influence.

This is a local state monument, not a global bloc modifier. Dev Diary #116 shows the visual language: statue customization, emblem, bloc map mode and cohesion visualization.

## 3. The five identities in detail

### 3.1 Trade League

Purpose: integrate markets and make trade dependence the bloc's cohesion engine.
- Founding fit: open trade policy; Isolationism prevents formation.
- Identity effects: bloc is a customs union in the reference; leader gets +25% state trade capacity; non-leader members contribute convoys to the market owner.
- Primary principles:
  - **External Trade:** I +25% trade capacity and +25% trade advantage; II unlocks Influential Trade Center production method; III removes the trade-advantage penalty from lacking declared interests.
  - **Internal Trade:** I +20% convoys contribution to market owner and +10% infrastructure; II +30% convoys total and +5% company throughput; III +40% convoys total and port-connection cost −25%.
- Cohesion: leader's economic weight and goods-production leadership help; shortages, negative relations and weak economic dependence hurt. Base cohesion is 15, lower than the other four.
- Trade-off: members get market access and trade bonuses but surrender independent market/tariff control and may become economically dependent.

### 3.2 Sovereign Empire

Purpose: formal hierarchy with the leader at the centre and members as subjects or subordinate partners.
- Later verified founding fit: Monarchy or Social Monarchy.
- Identity effect: leader gets −5% weekly liberty desire from subjects and can subjugate weaker bloc members.
- Primary principles:
  - **Vassalization:** I +10 Authority per subject; II +15 total and +25% income from subjects; III +20 total and decrees in subject states.
  - **Exploitation of Members:** I −5 cohesion, leader +20% Authority and non-leader members −20% Authority; II −10 cohesion total, leader +20% Influence and members −20% Influence; III −20 cohesion total and transfers 5% tax income to bloc leader.
- Cohesion: subject loyalty/liberty desire and leader prestige matter; independent non-leader members cause a larger penalty (−3 each).
- Member trade-off: protection and potential military benefits, but subject payments and loss of authority/influence under exploitation; actual diplomatic and war autonomy depends on subject type.
- Exploitation has an explicit cohesion cost. It is powerful, but not free; high extraction should make the bloc less stable unless loyalty and protection are maintained.

### 3.3 Ideological Union

Purpose: make shared political institutions and regime type the basis of cooperation.
- Identity effect: leader law-enactment time −15%; can impose Governance Principles and Distribution of Power laws and force regime change on members. Non-leader members get +30% enactment success chance for laws already enacted by the leader.
- Primary principles:
  - **Creative Legislature:** I −33% law enactment stall chance; II reduces activism growth from disapproved enactment by 25% and increases activism reduction from approved enactment by 25%; III +1 maximum law-enactment setbacks.
  - **Ideological Truth:** I opposition agitator popularity −33%, suppression and bolstering costs −25%; II +10% party-whip impact on ideological incoherence; III +25 minimum legitimacy.
- Cohesion: leader legitimacy helps; government / distribution-of-power differences and poor relations hurt.
- Leader gets agenda-setting and regime-change tools; members gain easier enactment for aligned laws but accept political pressure.
- Risk: forced reform can create political movements, radicals and revolutions.

### 3.4 Military Treaty

Purpose: institutionalize mutual security and coordinated warfare.
- Later verified founding restriction: countries with National Militia cannot create it.
- Identity effect: leader +10% prestige from army/navy power projection; may add a free war goal when supporting another member; cannot enact National Militia. All members get +20% training rate.
- Primary principles:
  - **Defensive Cooperation:** I members cannot start/join diplomatic plays against bloc members; II −50% maneuver cost to sway bloc members in defensive plays and leader may impose same Army Model law; III Call Ally sway on bloc members in defensive plays.
  - **Aggressive Coordination:** I offensive war-goal maneuver cost −30%; II war exhaustion from casualties −15%; III −10 cohesion, Call Ally sway in all plays and infamy generation +15%.
- Cohesion: leader power projection helps; infamy and National Militia members hurt; independent members impose a penalty.
- Trade-off: internal non-aggression and coordinated defence, but real war obligations. Offensive coordination trades cohesion and infamy for military tempo.

### 3.5 Religious Convocation

Purpose: build a confessional bloc around the state faith and clergy.
- Later verified founding fit: State Religion or Freedom of Conscience.
- Identity effect: leader +25% Clergymen investment-pool contribution efficiency; may impose State Religion; members cannot enact Total Separation or State Atheism. All members get +33% conversion, +25% Devout political strength and +5% birth rate.
- Primary principles:
  - **Sacred Civics:** I improves diplomatic proposal acceptance among same-faith countries; II reduces liberty desire for same-faith subjects; III leader may impose the same Church and State law.
  - **Divine Economics:** I +50 co-religionist trade advantage and +50% income transfer from heathen subjects; II unlocks Increased Clergy Oversight for Financial Districts and Manor Houses; III +25% wages for state-religion pops.
- Cohesion: Devout clout, Devout presence in government and faithful-population share help; secular laws and poor relations hurt.
- Risk: religious minorities and secular member laws can destabilize the bloc.

## 4. Principle catalogue and tier effects

Tier III effects include the lower-tier effects; they are cumulative, not replacements. General principle examples from the 1.13-verified reference:

| Group | Tier I | Tier II | Tier III |
|---|---|---|---|
| Advanced Research | Education institution growth +25%; bureaucracy cost −10%; tech spread +5% per Education level; cannot enact No Schools; leader can impose Education System | Adds +15% institution growth and −15% bureaucracy cost (cumulative +40% / −25%); ahead-of-time penalty −5% per Education level | Adds +10% growth and −25% bureaucracy cost (cumulative +50% / −50%); +5 max innovation investment per Education level |
| Colonial Offices | Colonial Affairs growth +25%; bureaucracy cost −10%; leader can impose Colonization law | Adds +15% growth, −15% bureaucracy cost and +0.05 colonial growth per institution level | Adds +10% growth, −25% bureaucracy cost and −5% infamy generation against unrecognized powers per institution level |
| Construction | Construction sector infrastructure use −75% | State construction efficiency +10% | Unlocks United Construction Conglomerate company |
| Food Standardization | Agriculture throughput +10% | Mortality −10% | Standard of Living +1; unlocks Efficient Canning Practices |
| Foreign Investment | Increases leverage from economic dependence | Nationalization cost −50% | Investment rights in lower-rank bloc members |
| Market Unification (Trade League) | Infrastructure +10%; trade advantage +100 within bloc; members cannot embargo each other | Bloc becomes customs union | Convoys contribution to market owner +20% |
| Militarized Industry | Throughput +10% for automotive, arms, artillery and military shipyards | Military goods cost −15% | Supply-route cost −33%; unlocks Balloon Reconnaissance |
| Police Coordination | Law Enforcement institution growth +25%; bureaucracy cost −10%; cannot enact No Police; leader can impose Policing | Adds +15% growth, −15% bureaucracy cost; movement activism −5% per Law Enforcement level | Adds +10% growth, −25% bureaucracy cost; +50 Authority per Law Enforcement level |
| Transportation Infrastructure | +33% infrastructure per 100k population and +33% max infrastructure from population | Port throughput +20% | +10 Economy-of-Scale building-level cap; unlocks joint rail production methods |
| Companies | Company throughput +10% | +1 free company charter | +1 maximum companies |
| Maritime Supremacy | Ship and flagship involvement generation +10% | +5 max ship construction progress | Port access between members; navy goods cost −10% |

Most general groups require Sphere of Influence. The reference notes Internal Trade and External Trade are available without the DLC. Availability should be gated by content configuration.

Identity-primary principle summary:

| Identity | Primary group | Tier I | Tier II | Tier III |
|---|---|---|---|---|
| Ideological Union | Creative Legislature | Law stall chance −33% | Movement effects from approved/disapproved enactment improved | +1 max law setbacks |
| Ideological Union | Ideological Truth | Opposition agitator popularity −33%; suppression/bolstering cost −25% | Party-whip impact +10% | Minimum legitimacy +25 |
| Military Treaty | Defensive Cooperation | Cannot play against bloc members | Defensive sway maneuver cost −50%; same Army Model can be imposed | Call Ally in defensive plays |
| Military Treaty | Aggressive Coordination | Offensive war-goal maneuver cost −30% | Casualty war exhaustion −15% | −10 cohesion; Call Ally in all plays; infamy +15% |
| Religious Convocation | Sacred Civics | Higher same-faith proposal acceptance | Same-faith subject liberty desire reduced | Leader can impose Church and State law |
| Religious Convocation | Divine Economics | Co-religionist trade advantage +50; +50% transfer from heathen subjects | Unlocks clergy oversight methods | State-religion pop wages +25% |
| Sovereign Empire | Vassalization | +10 Authority per subject | +15 total; +25% subject income | +20 total; decrees in subject states |
| Sovereign Empire | Exploitation of Members | −5 cohesion; leader Authority +20%; member Authority −20% | −10 cohesion total; leader Influence +20%; member Influence −20% | −20 cohesion total; 5% tax-income transfer |
| Trade League | External Trade | Trade capacity +25%; trade advantage +25% | Influential Trade Center PM | No trade-advantage penalty from lacking interests |
| Trade League | Internal Trade | Convoys +20%; infrastructure +10% | Convoys +30% total; company throughput +5% | Convoys +40% total; port connection cost −25% |

## 5. Subject system: nine types in 1.15.0 extracted definitions

A subject remains a country: it has its own budget, construction, interest groups, laws and institutions. All subject types join the overlord's market as junior members and join/leave Power Blocs with their overlord. The 1.13 wiki gives an ongoing 10 Influence upkeep for the subject pact.

The rates below are **base income-transfer definitions**, not necessarily the final amount after exemptions, Raise/Decrease Payments, special pacts, identity modifiers or other effects. Vic3 Tabula explicitly warns that an unspecified rate does not mean zero.

| Type | Autonomy / diplomatic freedom | Ordinary diplomatic plays? | Base income transfer | War participation |
|---|---|---|---:|---|
| Puppet | Low; non-autonomous | No, except independence/autonomy paths | 30% | Automatically joins overlord's plays, unless exempted |
| Vassal | Low; non-autonomous; unrecognized overlord | No, except independence/autonomy paths | 30% | Automatically joins |
| Colony | Low; non-autonomous | No, except independence/autonomy paths | 30% | Automatically joins |
| Protectorate | High; autonomous | Yes | Not specified | Does not automatically join |
| Tributary | High; autonomous; unrecognized overlord | Yes | 20% | Does not automatically join |
| Dominion | Medium; semi-autonomous | Yes | 25% | Automatically joins overlord's plays |
| Chartered Company | Medium; semi-autonomous | Yes | 30% | Automatically joins |
| Personal Union | Medium; special dynastic relationship | No in the type table | Not specified | Special rules; do not treat as Puppet |
| Crown Land | Low; non-autonomous | No, except independence/autonomy paths | 15% | Automatically joins |

Five types are non-autonomous: Puppet, Vassal, Colony, Crown Land and Personal Union. Dominion and Chartered Company are semi-autonomous. Protectorate and Tributary are autonomous. The distinction affects external diplomacy, own-subject relationships and war participation. Non-autonomous subjects can receive Exempt from Service, preventing automatic participation.

### 5.1 What the overlord receives

- Market integration: subjects join the overlord's market as junior members unless granted own-market rights.
- Prestige: the 1.13 wiki gives prestige derived from 50% of subject GDP, 1.67% of subject army power projection and 10% of subject navy power projection; this does not subtract from subject prestige.
- Convoys: subject types contribute a share to the market leader.
- Military depth: participation depends on subject type and service exemption.
- Diplomatic control: payment changes, autonomy changes, market rights, knowledge sharing, governor/ruler actions and other subject interactions.

### 5.2 Liberty desire

Liberty desire measures the subject elite's appetite for autonomy or independence. Range 0–100:
- Low: 0–24.9
- Moderate: 25–74.9
- High: 75–100

Below 25, an overlord can reduce autonomy if a less-autonomous type is available. At 75 or higher, a subject can request increased autonomy if a more autonomous type exists. Autonomy changes have a five-year cooldown. If an autonomy request is denied, the subject can within the next five years demand autonomy again or initiate an independence play. A subject at the highest autonomy can demand independence at any time.

Weekly liberty-desire factors listed in the 1.13 wiki include:
- base +0.1/week;
- hostile relations +0.5, cold +0.25, poor +0.1; cordial −0.025, amicable −0.05, friendly −0.1;
- overlord infamy: infamous +0.1, notorious +0.25, pariah +2.0;
- Knowledge Sharing −0.05; Exempt from Service −0.05;
- Raise Payments +0.1; Decrease Payments −0.05; Support Regime −0.1;
- isolation from overlord's market +1.0;
- Sacred Civics II plus same religion −0.1;
- overlord below 1 prestige / army projection: +1.0 each; subject below 1 prestige: −0.1; subject below 1 army projection: −0.25;
- Isolationism at overlord: +2.0;
- additional culture-fervor, prestige-ratio, economic-dependence and modifier terms use formulas and caps.

These are weekly contributions before documented multiplier stages, not an unconditional sum. Positive pressure is scaled down as liberty desire approaches 100; negative pressure is scaled down as it approaches zero. A truce halves positive weekly pressure in the wiki reference.

Practical consequence: raising extraction can improve short-term revenue while increasing liberty desire. Protection, relations, knowledge sharing, market access, service relief and support can offset pressure. The UI should show predicted weekly change and a breakdown, not just a bar.

### 5.3 Overlord / subject interactions

The 1.7 update introduced relationship-specific diplomatic actions. Official patch notes call out:
- Raise / Reduce Subject Payments;
- increase / decrease autonomy;
- distribute conquered territory among subjects;
- knowledge sharing;
- grant a subject control over its own market;
- subject petitions for relief (often costing liberty desire);
- ruler / governor changes in supported cases;
- grant independence and annexation pathways;
- impose laws on eligible subjects.

The wiki's pact table gives useful examples:
- **Raise Payments:** +10% of subject income; target gains +0.1 liberty desire weekly; some types/states are excluded (e.g. Protectorate / Personal Union restrictions, liberty desire ≥75, default).
- **Decrease Payments:** reduces transfer by 10%; target liberty desire −0.05 weekly.
- **Support Regime:** liberty desire −0.1 weekly.
- **Knowledge Sharing:** liberty desire −0.05 weekly.
- **Grant Own Market:** subject controls its own market; can reduce economic dependence / liberty pressure, but removes overlord market integration.
- **Exempt from Service:** removes automatic military service and gives −0.05 weekly liberty desire.
- **Increase / Decrease Autonomy:** shifts one autonomy step when eligible; once every five years.
- **Annexation:** overlord can demand annexation of eligible Puppet, Colony, Vassal and Crown Land. Below 25 liberty desire or during rebellion, wiki lists a −75% infamy reduction. Annexing one subject adds +0.2 liberty desire to other subjects for five years.
- **Impose Laws:** eligible subjects still use normal enactment mechanics; enactment can fail or cause a revolution. Tributaries and Protectorates are excluded in the wiki reference.

Do not assume every action is available to every subject type or DLC setup. Implement per-action eligibility checks and show why an action is unavailable.

### 5.4 Foreign investment and building ownership

Sphere of Influence adds investment in willing foreign countries, not only direct subjects. Building ownership is separate from employment: investors can own building levels abroad, buildings can have different owners per level, and nationalization / privatization choices are constrained by the target's economic system. Nationalization can seize foreign assets and create diplomatic consequences.

Foreign Investment principle:
- Tier I increases leverage from economic dependence;
- Tier II reduces nationalization costs by 50%;
- Tier III grants investment rights in lower-rank bloc members.

This is more than a tariff-free market: ownership generates profit and leverage, but exposes the investor to expropriation risk.

## 6. Worked example: Great Britain and a Dominion

Illustrative calculation only; it does not assert that every historical British Indian entity used the same subject type for the whole period.

Assume a hypothetical Dominion has £10,000,000 annual government income:
- Base Dominion transfer = 25% = **£2,500,000/year** to the overlord.
- If Raise Payments increases the pact by 10 percentage points, transfer becomes 35% = **£3,500,000/year**, an additional £1,000,000/year.
- This is government-income transfer, not 25% of GDP, total production or all private wealth.
- If Decrease Payments moves the transfer from 25% to 15%, the overlord receives £1,500,000/year, £1,000,000 less than base; the subject gains the lower liberty-desire pressure from that pact.
- A separate Sovereign Empire principle at tier III adds 5% tax-income transfer to the bloc leader in the extracted principle table. Treat it as a distinct rule only after verifying stacking and tax base in the target build; do not double-count it blindly.
- Other overlord benefits include market integration, prestige credit from subject GDP/army/navy and possible military participation.
- The subject retains its budget, laws, construction and interest groups, but pays the transfer and accepts Dominion-specific diplomacy/war obligations.
- Raise Payments increases liberty desire (+0.1/week in the wiki pact table). The overlord must counterbalance with relations, market access, knowledge sharing, service exemption, support or reduced payments.

A Dominion is semi-autonomous: it can conduct external diplomacy and may have subjects, but is still called into its overlord's plays. A Puppet or Colony has a different autonomy and war profile. Do not represent all dependency by one tribute percentage.

## 7. AI strategy

Official descriptions frame the system as diplomatic competition using leverage, economic influence and bribery. Invitation acceptance depends on relations, attitude, relative rank, cohesion and identity; obligations can sway acceptance. Rejection worsens relations. Defections and leadership contests create counter-pressure.

Recommended bounded AI policy:
1. Identity selection: evaluate laws, subjects, market structure, religion and military strategy.
2. Recruitment: calculate current and predicted leverage; prioritize targets with plausible acceptance; avoid invitation spam below threshold.
3. Cohesion: Trade League reacts to trade, shortages and dependence; Sovereign Empire to liberty desire and subject loyalty; Ideological Union to law alignment and legitimacy; Military Treaty to projection, infamy and internal peace; Religious Convocation to faith composition and Devout clout.
4. Mandates: compare member-wide and leader-only value; prefer tier upgrades that benefit many members; stabilize cohesion before high extraction.
5. Subjects: compare income with liberty risk, war service, market integration and subject development. Do not raise payments on a near-rebellious subject unless deliberately provoking a crisis.
6. Leadership: monitor prestige relative to the strongest independent member; prepare for a power struggle or peaceful transfer.
7. War: distinguish defensive obligations from offensive coordination; account for war exhaustion, infamy, supply and service exemptions.
8. Explain decisions using the same factor breakdown visible to the player; do not give AI hidden omniscient information.

## 8. Comparison with Victori3 PB-02 on target branch

Reviewed:
- docs/design/POWER_BLOCS_VI.md
- src/engine/systems/powerBlocs.ts
- branch ccr-b27f3fb8-epfpd6

### 8.1 Existing Victori3 capabilities

| Area | Current implementation |
|---|---|
| Identities | Five original identities |
| Founding | Top-8 Great Power and identity-specific checks |
| Core principle | One identity core always active |
| Principles | Three levels; cohesion gates levels; slots grow with cohesion/member count |
| Cohesion | 0–100; target uses attitude, identity, leverage and size |
| Leverage | Power, relations, market, subject, alliance, border, culture, religion, companies, rivalry |
| Invitations | Leader score must beat other bloc leaders by join margin; relation/rival/war checks |
| Principles catalog | Trade, research, legislature, police, construction, movement, aggressive coordination, colonial partnership, holy alliance and identity cores |
| Mandates | Monthly progress; 100 progress per mandate; bank max 3 |
| Sovereign extraction | 2/4/6% of member income; leader may subjugate weak members |
| UI plan | Overview, members/leverage, principles, founding dialog and invitation preview |

### 8.2 Differences and gaps

| Area | PB-02 now | Victoria 3 reference | Assessment |
|---|---|---|---|
| Founding eligibility | Top-8 Great Powers | GP, Major, Unrecognized Major; 500 Influence | Victori3 stricter; no visible Influence price |
| Identity effects | Simplified custom bonuses | Strong leader/member asymmetry and restrictions | Biggest gap: explicit net-benefit contract |
| Cohesion | Generic monthly target | Identity-specific factors incl. worst member, market, faith and law conditions | Current model is legible but flattens identity differences |
| Leverage | Raw additive score; join margin 20 | Proportional 1,000 pool; invite at +200 current share | Different scales; 20 is custom, not V3's +200 |
| Mandates | Monthly rate 5 × cohesion × member multiplier; 100 per mandate | Weekly rank-based contributions + bloc-rank base; 2,000 per mandate | Current may generate mandates much faster; benchmark time-to-next |
| Principle slots | Cohesion 40/70 and 5 members; max 4 | Rank and member count: slot 3 at rank ≤5 + 5 members; slot 4 at rank ≤3 + 10 members | Current simpler; consider requiring both size and strength |
| Principle effects | Custom percentage bonuses | Institution, law, production, market, military and diplomacy effects | Expand carefully; avoid universal buff spam |
| Principle cost | One mandate per new/raised group | Cost equals tier; upgrade pays difference | Current tier III may be too cheap |
| Sovereign tribute | 2/4/6% | Subject pacts 15–30% base plus separate 5% at Exploitation III | Current 2/4/6% is weak if this is the only revenue |
| Subjects | Weak bloc members may become protectorates | Nine types, autonomy classes, payment rates, war obligations, liberty desire | Needs independent subject subsystem |
| Liberty desire | Not in reviewed PB-02 excerpt | Dynamic 0–100 weekly pressure; thresholds 25/75; autonomy and rebellion | Critical missing feedback loop |
| Member rights | Identity table gives gains/obligations | Identity-specific restrictions, law, market and war obligations | Expand contract and UI |
| Foreign investment | Company sites contribute to leverage | Building ownership, investment rights and nationalization | Current proxy is simplified |
| Power struggle | Not in reviewed PB-02 excerpt | +20% prestige trigger; maintain +15% for 12 months (9 for founder) | Later phase |
| Statues | Not in reviewed PB-02 excerpt | Local effects +3 prestige, identity-specific | Nice-to-have after core diplomacy |
| AI | Sandbox founds/invites; historical AI does not found | Considers leverage, cohesion and acceptance | Add subject economics and stability utility |

### 8.3 Code observations

From the reviewed powerBlocs.ts excerpt:
- BLOC.foundRank = 8, joinMargin = 20, mandateRate = 5, subjugateCohesion = 60, subjugatePowerShare = 0.25, subjugateLeverage = 50.
- exploit_members pays 2/4/6%; tier II/III adds member army quality and leader legitimacy, not the reference's authority/influence extraction structure.
- market_unification is an always-on customs union core; level II adds +5% trade and level III +10% trade plus +5% construction.
- ideological_alignment is an AI law-utility pull; level III lets leader press a law.
- defensive_cooperation is a generic defence/alliance effect, not the reference's tiered non-aggression / maneuver / Call Ally structure.
- sacred_civics gives clergy and legitimacy bonuses, not the reference's conversion, Devout clout and religious-law restrictions.
- leverage is a sum of custom values (e.g. same market +15, subject +30, alliance +10, shared culture +10), not the reference's proportional 1,000-pool model.

These are not automatically bugs. They are project-specific choices. The game must not label its own values as Victoria 3's values.

## 9. Recommendations for Victori3 (original design, not Victoria 3 rules)

### P0 — make membership valuable and legible

1. Every identity card should show Leader gains, Member gains, Member obligations and Exit/failure risks.
2. Invitation preview should show current/predicted cohesion, member annual payment, market position, war obligations, laws at risk and liberty pressure.
3. Principle tooltips should separate leader/member beneficiaries and show cumulative tier totals.
4. Five identities must have distinct cohesion drivers and distinct gameplay, not just different names over the same generic buffs.

### P0 — repair Sovereign Empire's value proposition

PB-02's 2/4/6% is too small to communicate an empire and far below the 15–30% subject-transfer reference. Suggested original Victori3 balance:

| Level | Additional bloc levy | Member return | Stability cost |
|---|---:|---|---|
| I | 8% | Defence guarantee; modest diplomatic protection | Low |
| II | 12% | Military aid / infrastructure-investment preference | Moderate |
| III | 16% | Decrees or investment privileges in subject states | High; cohesion and liberty pressure |

Keep subject pact payment (e.g. 10–25% by type) separate from bloc tribute (e.g. 0–8% additional, gated by principle). Never stack both against the same gross income without showing the combined effective rate and applying a cap. Suggested normal total extraction cap: **30% of government income**; exceptional wartime/punitive terms may exceed it temporarily but should create strong liberty pressure and diplomatic consequences. Independent members should not pay subject-style tribute; if a charter requires contributions, use a small consent-based 1–3% of tax revenue.

The leader should gain more than money: authority, market access, prestige projection, military access and controlled investment rights. Members need tangible returns: defence, infrastructure/technology transfer, market access and investment. If the leader extracts without protection, liberty desire should rise.

### P1 — build a real subject autonomy model

Create an independent subject contract:
- type and autonomy tier;
- overlord id;
- government-income transfer;
- market membership and market-control rights;
- diplomatic-play autonomy;
- automatic war-call rules and service exemption;
- law-imposition eligibility;
- liberty desire 0–100 and weekly breakdown;
- autonomy-change cooldown;
- annexation, independence and rebellion conditions.

Suggested first types:
- Puppet: low autonomy, 25–30% transfer, automatic war participation.
- Dominion: medium autonomy, 15–20%, limited diplomacy, war participation.
- Protectorate: high autonomy, 0–5% or no compulsory payment, no automatic offensive war participation.
- Tributary: high autonomy, 10–15% cash tribute, own external diplomacy.

Add Colony, Chartered Company, Personal Union, Crown Land and Vassal as distinct types only when historical data and UI support them. Avoid nine shallow aliases with no gameplay distinction.

### P1 — liberty desire feedback

Start with deterministic, auditable weekly pressure:
- base +0.05 to +0.10/week;
- increases for high payments, discriminatory laws, forced conscription, market isolation, lost wars, overlord infamy and poor relations;
- decreases for protection, knowledge sharing, investment, market access, service exemption, shared institutions and good relations;
- thresholds: <25 stable, 25–74.9 discontent, ≥75 autonomy request / independence risk;
- autonomy changes once per 5 years; refusal grants a time-limited escalation path;
- bounded change and hysteresis to prevent oscillation.

Show predicted weekly change, factor breakdown and a 12-month forecast.

### P1 — mandate and principle economics

- Benchmark time-to-next-mandate for blocs of 2, 5, 10 and 20 members; PB-02's monthly formula may over-reward large blocs.
- Consider rank-weighted member contribution and cohesion multiplier.
- Charge tier cost incrementally; e.g. T1=1, T2 additional 1, T3 additional 1 or a carefully balanced 2; bank cap 3.
- Keep the identity's primary principle required; dropping it should reduce cohesion.
- Require both member count and bloc power/rank for slots 3 and 4.

### P2 — leverage, AI and UI

- Keep additive leverage if desired, but label it project-specific; optionally normalize to a 0–1,000 visible share.
- Split leverage into relation, market, subject, alliance, border, culture, religion, investment and lobby factors.
- Show current vs predicted leverage and gate invitations on a clear advantage plus target acceptance.
- AI should compare tribute revenue against liberty risk and compare member protection against extraction.
- Do not let AI promise defence it cannot sustain.
- Full-screen bloc panel: Overview, Members, Principles, Invitation preview, Subject panel and Actions. Member rows should show rank, relation, leverage, economic dependence, obligations, annual contribution and exit risk. On mobile, use expandable rows and a sticky summary rather than nested tooltips.

## 10. Image references (remote links only; not redistributed)

No screenshot binary is stored. These public images provide UI context. See docs/research/reference_images/cg48/README.md for the copyright handling note.

| Image | What it demonstrates | Source / version |
|---|---|---|
| [Create a Power Bloc / identity selection / emblem](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2411231/ss_78c2942529de3440a596c23c7207dbcf5ac08e0f.1920x1080.jpg?t=1759321070) | Identity picker, primary principles, mandate, name and emblem | Sphere of Influence store media; 1.7-era |
| [Five identity picker / Religious Convocation tooltip](https://forumcontent.paradoxplaza.com/public/1124307/DD117_20.png) | Original five labels and separation of bloc/member/leader effects | Dev Diary #117; 1.7 pre-release |
| [Zollverein bloc overview](https://cdn.gracza.pl/galeria/galeria_duze3/1239780437.jpg) | Cohesion bar, identity pillar, principle, map and overview navigation | Public gameplay screenshot; exact version unverified |
| [Subjects overview and action panel](https://forumcontent.paradoxplaza.com/public/1124284/DD117_01.png) | Subject-type table, subject list, liberty desire and Overlord Actions | Dev Diary #117; 1.7 pre-release |
| [Great Britain / Dominion liberty desire breakdown](https://forumcontent.paradoxplaza.com/public/1100385/DD111_01.png) | Current liberty desire and weekly change factors | Dev Diary #111; 1.7 pre-release |
| [Exploitation of Members II tooltip](https://forumcontent.paradoxplaza.com/public/1127936/DD118_13.png) | Sovereign Empire cohesion cost and leader/member authority/influence asymmetry | Dev Diary #118; 1.7 pre-release |
| [Official subject interaction promotional image](https://images.ctfassets.net/u73tyf0fa8v1/4J3BUdJgUVawLfMKUl9Z8E/d2aaea8f12c0c53890c06094caf1a421/Subject_interactions.jpg) | Subject list, autonomy, payments, market control and action tiles | Paradox official Sphere of Influence media |
| [Liberty desire / Crown Land tooltip](https://forumcontent.paradoxplaza.com/public/1339444/DD154_07.png) | Later subject liberty-desire UI and weekly factors | Dev Diary #154; later than 1.7 |

These links are research-only. If a maintainer downloads an image, retain source URL and attribution, keep the copyright warning, do not include it in game assets and check the source's terms before redistributing.

## 11. Sources and provenance

### Official Paradox / Steam
1. Paradox Interactive, Sphere of Influence feature page: https://www.paradoxinteractive.com/games/victoria-3/add-ons/victoria-3-sphere-of-influence — power bloc customization, foreign investment, subject interactions, nationalization, monuments. High for feature scope, not a numeric rulebook.
2. Victoria 3, Dev Diary #111 — Subject Improvements (2024-04-04): https://steamcommunity.com/games/529340/announcements/detail/4212628592039432069 — subject redesign and liberty-desire UI. High.
3. Victoria 3, Dev Diary #117 — The UX of Sphere of Influence (2024-05-16): https://steamcommunity.com/games/529340/announcements/detail/4195743898791491305 — screenshots and UI structure. High.
4. Victoria 3, Dev Diary #118 — Power Blocs Round Two (2024-05-23): https://steamcommunity.com/games/529340/announcements/detail/4185611434351815137 — leverage, cohesion, identities and principles. High.
5. Victoria 3, Dev Diary #116 — The Art of Sphere of Influence (2024-05-09): https://steamcommunity.com/games/529340/announcements/detail/4199120970150416668 — bloc map mode, cohesion visualization, emblems and statues. High.
6. Victoria 3, Update 1.7 / Sphere of Influence live (2024-06-24): https://store.steampowered.com/news/posts/?enddate=1718892449&feed=steam_community_announcements — launch features, leverage, subject interactions and building ownership revision. High.
7. Victoria 3, current patch announcements: https://steamcommunity.com/app/529340/announcements — 1.15 and 1.15.2 context. High for dated patch announcements.
8. Victoria 3, Hotfix 1.15.2 (2026-11-19): https://steamcommunity.com/app/529340/announcements — current baseline and selected diplomatic / AI fixes. High.

### Maintained wiki and extracted definitions
9. Power Bloc wiki article mirror (article states verified for 1.13): https://vic3.paradoxwikis.com/wiki/Power_bloc — numeric cohesion, leverage, mandates, principle effects, leadership struggle and statues. Medium; not proof every number is unchanged in 1.15.2.
10. Subject wiki article mirror (article states verified for 1.13): https://vic3.paradoxwikis.com/wiki/Subject — autonomy, liberty desire, interactions, annexation and independence. Medium.
11. Vic3 Tabula, Subject Types (1.15.0 extraction dated 2026-11-05): https://vic3tabula.com/en/subject-types — nine types, base income-transfer rates and autonomy/eligibility flags. Medium–High for extracted definitions; unofficial and warns rates are pact base rates.
12. Vic3 Tabula, Power Blocs (1.15.0 extraction dated 2026-11-05): https://vic3tabula.com/en/power-blocs — identity/principle definition cross-check. Medium–High; runtime scopes are not evaluated.

### Version caveats
- The 1.7 baseline had five identities. The 1.13-era wiki mirror lists six, including Cultural Commonwealth.
- Wiki Power Bloc and Subject pages are marked verified for 1.13, not 1.15.2. Subject-type rates come from a separate 1.15.0 extraction and should be rechecked against 1.15.2 definitions before exact live use.
- No 1.8/1.9 patch note reviewed here established a wholesale redesign of the original five identities or subject autonomy model. This is a bounded negative finding, not proof no balancing fixes occurred.
- Where official sources describe a feature but do not publish a formula, no hidden formula is invented.
