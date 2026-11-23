# CG-49 — Colonial events, decolonisation, subjects and sanctions

Date: 2026-11-23. Response to MSG-113 (A/B only); MSG-114 replaces its proposed generic event list.
Status: research synthesis; no engine code changed.

## Executive findings

1. Do not model decolonisation as a benevolent random grant. A transfer should follow pressure and cost: war exhaustion, defeat, sustained movement, metropolitan political change, fiscal burden, international isolation, sanctions, allied pressure, and the colony's strategic value. A settlement can preserve influence through base rights, trade access, currency or financial arrangements, defence pact or voluntary association. These are negotiated terms, not automatic historical facts.
2. A colonial crisis should be a multi-stage journal plus events: mobilisation → petition/strike/revolt → repression or negotiation → external intervention/sanctions → constitutional conference → transfer/independence → post-independence treaty.
3. V3 reference mechanics: diplomatic plays have phases, primary/secondary demands, sway offers and back-down decisions; AI evaluates neutrality, preference, confidence and boldness rather than accepting a fixed script.
4. V3 is updated frequently. The public 1.15 changelog includes war-support, war-goal enforcement and subject-liberty changes. Do not mix older war-exhaustion-era mechanics with current 1.15 behaviour without labeling the version.

## A. Victoria 3 reference — relevant mechanics

### Colonial rule and subject autonomy
- Colonial administrations and expansion are represented through dedicated journal objectives and country/subject relationships. The design tension is direct rule versus delegated administration and the political/economic cost of overseas possessions.
- Subject status is not one undifferentiated vassal type. Keep subject type, liberty desire, payment, diplomatic freedom and military obligations as separate dimensions.
- A subject's liberty desire should respond to overlord coercion, war exhaustion, treatment, local nationalism, foreign support and the subject's own political institutions. Current 1.15 patch notes explicitly add liberty desire when an overlord starts a diplomatic play against a subject or enforces a war goal on it. [1]
- Do not hard-code every colony to become independent on a date. Historical Mode may schedule dated events, but they must still require that the relevant country/region exists and event preconditions hold.

### Diplomatic plays, pressure and back-down
- Official Paradox Dev Diary #57 describes Diplomatic Plays as international crises where interested countries can support either side and war can be avoided if enough leverage accumulates. [2]
- Official Dev Diary #59 explains AI Neutrality, Confidence and Boldness: joining requires the side's score to beat both the opposing side and neutrality; confidence reflects military/economic/political ability to win; boldness adds controlled unpredictability to back-down decisions. [3]
- Official Dev Diary #75 explains primary/secondary demands: primary demands are enforced if the target backs down; secondary demands are only at stake if war occurs. Swaying a third country with a war goal against the main opponent can elevate that goal to a primary demand. [4]
- Official Dev Diary #79 records reverse-sway, foreign investment and deeper subject autonomy as areas considered but not then implemented. Do not describe these as shipped mechanics for the referenced version. [5]
- Current 1.15 notes state war support ranges 0–100 and changes with battles, occupation, goals, devastation, economic regression and war length; war goals can be enforced during war; subjects gain liberty desire from hostile overlord plays. The source available in this research pass is a SteamDB mirror, not the Paradox-hosted canonical page. Treat it as a version pointer and verify against the in-game 1.15 build. [6]

### Embargoes and sanctions
- Official V3 material surfaced in this pass does not publish a complete universal formula for embargo effectiveness, acceptance or trade loss. Mark exact percentages as unknown unless verified from the target game version or official patch notes.
- For Victori3, sanctions should be stateful: issuer, target, goods/scope, start date, expiry/review date, enforcement capacity, third-party compliance, evasion and retaliation. Sanctions can reduce trade access and relations, but should also impose costs on sanctioning states (lost exports, higher input prices, diplomatic friction).
- Sanctions should not guarantee regime change. They can raise fiscal strain, shortages, elite discontent or diplomatic pressure, while increasing nationalist solidarity or black markets in some cases.

### Journal/event patterns to emulate (not copy)
Use a journal with visible progress, milestones, timeout/failure and outcome events. Useful V3 reference themes include colonial administration/Scramble for Africa, British Raj, Indian Federation, dominion status, American Civil War/Reconstruction, Risorgimento, German unification and Tanzimat. Exact availability and objectives vary by version and country; validate against the current game build. A community-maintained journal index is a discovery aid, not an official source. [7]

## B. Historical reference — causal patterns

### India, 1857–1947
- The 1857 uprising led to the end of East India Company rule and transfer of government to the Crown in 1858; this was a change in governing instrument, not independence.
- The Indian National Congress (1885), Bengal partition (1905), Amritsar (1919), civil disobedience and Salt March (1930), Government of India Act (1935), Quit India (1942), post-war negotiations and partition/independence (1947) form a useful chain. UK Parliament's history describes the 1935 constitutional reforms, elected provincial ministries in 1937, post-war negotiations and 1947 transfer; India and Pakistan became independent dominions before later becoming republics. [8]
- Game choices should distinguish repression, limited constitutional reform, transfer to elected ministries, federation/partition negotiations, and an orderly transfer that preserves Commonwealth/defence/trade ties. These ties are potential treaty terms, not universal historical quid pro quo.

### Egypt and Suez, 1882–1956
- Britain occupied Egypt in 1882; the 1914 protectorate, 1922 declaration with reservations, 1936 treaty, 1952 revolution and 1956 nationalisation of the Suez Canal form a staged sovereignty story.
- In 1956 Nasser nationalised the Suez Canal Company while offering compensation. The US Office of the Historian documents Washington's diplomatic effort, the secret Anglo-French-Israeli plan, invasion and US pressure for a ceasefire; US policy was driven partly by alliance politics, anti-colonial opinion and fear of Soviet intervention. [9]
- This is a costly imperial crisis: intervention can win short-term occupation but trigger alliance fracture, financial/oil pressure, UN condemnation and domestic political consequences. US pressure was not a simple automatic embargo; the record includes diplomacy, supply and financial leverage. [9][10]

### Rhodesia, 1965 onward
- Following the unilateral declaration of independence in 1965, Britain requested UN action; the Security Council approved voluntary sanctions in 1966 and mandatory economic sanctions in December 1966. The US Office of the Historian's FRUS background paper records this sequence. [11]
- Game model: distinguish voluntary coalition measures, mandatory UN measures, selective trade/finance restrictions and evasion. Track coalition unity and leakage; sanctions are not equivalent to immediate military defeat.

### UN and Cold War pressure
- UN General Assembly resolution 1514 (XV), adopted 14 December 1960, proclaimed the right to self-determination and called for a speedy end to colonialism. It is a diplomatic/normative pressure milestone, not an automatic transfer event. [12]
- NATO and Warsaw Pact members did not act as perfectly unified colonial-policy blocs. Model country-level motives: strategic access, anti-communist/anti-imperial messaging, arms and training, diplomatic recognition, aid, and competition for influence. Each sponsorship should be a bargain with a stated price; do not assign blanket bloc-wide support without a source.
- Indonesia, Indochina, Algeria, Kenya, Ghana, Malaya, Cyprus and Portuguese Africa need their own country-specific evidence and timelines in later batches. This note does not claim those cases have been fully researched.

## C. Recommended Victori3 event architecture
1. Journal: Colonial Settlement / National Self-Rule with progress, milestones, timeout and failure route.
2. Event chain: petition → repression/negotiation → foreign pressure → constitutional conference → settlement terms → independence/association → treaty review.
3. Each choice gives a concrete benefit and cost. Every option should carry a named timed modifier or another concrete effect, per MSG-115.
4. Settlement terms: retain base rights; customs/trade preference; currency/financial union; defence pact; voluntary commonwealth; dominion autonomy; full independence; partition/federal settlement where historically justified.
5. AI scoring: colony value + strategic access + fiscal return + domestic legitimacy + movement strength + war exhaustion + sanctions + ally pressure + probability of successful repression. Include confidence and willingness to fight, not only a scalar movement score.
6. Anti-exploit controls: cooldowns, one active negotiation per movement, no free repeated concessions, no treaty benefit without enforceable term, explicit expiry/renewal/violation conditions.
7. Historical Mode uses dated windows with preconditions; if prerequisites fail, branch to plausible alternatives rather than force history. Sandbox uses generic roles and emergent pressures.

## D. Source register
[1] Victoria 3 1.15 changelog mirror (verify in-game): https://steamdb.info/patchnotes/26453692/
[2] Paradox Dev Diary #57: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-57-the-journey-so-far
[3] Paradox Dev Diary #59: https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-59-ai
[4] Paradox Dev Diary #75: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-75-diplomatic-improvements-in-1-2
[5] Paradox Dev Diary #79: https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-79-whats-next-after-12
[6] See [1].
[7] Community journal index (discovery only): https://alcaras.github.io/v3ref/journal-entries/
[8] UK Parliament, The Raj and independence 1914–47: https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/the-raj-and-independence-1914-47/
[9] US Department of State, Office of the Historian, Suez Crisis 1956: https://history.state.gov/milestones/1953-1960/suez
[10] FRUS 1955–57 Vol. XVI, document 511: https://history.state.gov/historicaldocuments/frus1955-57v16/d511
[11] FRUS 1964–68 Vol. XXIV, document 559: https://history.state.gov/historicaldocuments/frus1964-68v24/d559
[12] UN Digital Library, A/RES/1514(XV): https://digitallibrary.un.org/record/206145?v=pdf
