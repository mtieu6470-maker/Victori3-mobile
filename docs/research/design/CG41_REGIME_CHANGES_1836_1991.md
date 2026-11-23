# CG-41 — Regime changes and state formation, 1836–1991

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Prepared:** 2026-11-23  
**Status:** Research staging; not integrated into the game database.

## Executive summary

This package contains **53 sourced transition records**, **41 references**, and a proposed minimal 20th-century law catalogue. It addresses the principal owner concern: Historical Mode must not leave the Russian Empire, Qing dynasty, July Monarchy, Tokugawa shogunate and other 1836 regimes frozen in place into the 20th century.

The central Russian sequence is explicitly represented as:
1. February Revolution and Nicholas II's abdication (15 March 1917 Gregorian).
2. Bolshevik seizure of power / October Revolution (7 November 1917 Gregorian; 25 October Old Style).
3. RSFSR constitution (10 July 1918), with the 1918–22 Civil War and territorial consolidation tracked as a separate process.
4. USSR foundation (30 December 1922).
5. Stalin-era constitutional and planned-economy consolidation (1936 Constitution; central planning developed through the Five-Year Plans).
6. Perestroika/glasnost from 1985, Article 6 amendment in March 1990, and dissolution of the USSR (formal termination recognised 26 December 1991).

## Data contents

- 53 event records with a principal date, process window, historical capital, predecessor/successor names in English and Vietnamese, event type, causal context, law changes, territorial changes and source IDs.
- 41 source entries, prioritising official state histories, national archives, constitutional texts, UN country reports and academic historical reference works.
- 18 proposed laws to extend the current nine-group law model.

## Chronological coverage

### Russia and the Soviet Union
The 1917 revolution is not represented as a single event. February 1917 ended the Romanov monarchy and produced the Provisional Government. The Bolshevik seizure in October/November 1917 displaced that government. The RSFSR's 1918 Constitution established a Soviet federal republic, while the USSR was only created on 30 December 1922 by the founding republics. The USSR's dissolution must be distinguished from the 8 December Belavezha Agreement, the 21 December Alma-Ata Declaration, Gorbachev's resignation on 25 December and the Soviet legislature's 26 December declaration. The UN's 2017 Russian Federation core report provides a continuous official chronology of these transitions. [Source: un_rus_2017]

### Germany
The German Empire was legally founded on 1 January 1871 and publicly proclaimed on 18 January. The Weimar Republic was proclaimed on 9 November 1918; its Constitution was adopted in 1919. Hitler's appointment as Chancellor on 30 January 1933 was the start of the Nazi takeover, not the instant completion of dictatorship: the Enabling Act and subsequent suppression of opposition completed the process. The FRG and GDR were founded separately in May and October 1949. On 3 October 1990 the GDR acceded to the FRG; this was not a merger under a newly drafted constitution. [Sources: german_history_docs, deutschlandmuseum, de_basic_law]

### Italy and France
Italian unification is a process: the Kingdom was proclaimed 17 March 1861, while Rome was incorporated in 1870 and became capital in 1871. Mussolini's appointment in October 1922 preceded full dictatorship consolidation in 1925–26. The 1946 referendum selected a republic; the result was officially proclaimed 18 June, and the Constitution entered into force in 1948. France's Second Republic, Second Empire, Third Republic, Vichy, Provisional Government, Fourth Republic and Fifth Republic are dated against the French National Assembly's official chronology. Vichy is modelled as an authoritarian regime controlling the unoccupied zone, not as the legitimate or effective government of all French territory. [Sources: italian_parliament, fr_assemblee_regimes, fr_assemblee_vichy, fr_assemblee_5rep]

### Austria-Hungary and successor states
The 1867 Ausgleich created a dualist monarchy with separate Austrian and Hungarian constitutional systems and shared foreign, military and selected fiscal institutions. Its 1918 dissolution was not one clean date: Czechoslovakia, German-Austria, Hungary and the State of Slovenes, Croats and Serbs / later Kingdom of Serbs, Croats and Slovenes emerged in separate acts between October and December. The Treaty of Saint-Germain and Treaty of Trianon later formalised the settlement. [Sources: ausgleich_aeiou, us_historian_austria, us_historian_hungary, us_historian_czechoslovakia, yugoslav_archives]

### Ottoman Empire / Türkiye; China; Japan; Spain; Vietnam
- The Ottoman Sultanate was abolished on 1 November 1922; the Republic of Türkiye was proclaimed on 29 October 1923. Caliphate abolition on 3 March 1924 is a separate legal milestone.
- The Republic of China was inaugurated on 1 January 1912; the Qing abdication followed on 12 February. The PRC was proclaimed on 1 October 1949, while the ROC government continued in Taiwan. Do not treat this as an uncontested rename of a single state.
- The Meiji Constitution was promulgated in 1889 and came into force in 1890. Japan's post-war Constitution was promulgated in 1946 and took effect on 3 May 1947; the monarchy remained, but sovereignty shifted to the people and Article 9 renounced war.
- Spain's Second Republic began in 1931; Franco's dictatorship emerged from the 1936 coup and Civil War, with victory declared in 1939. The democratic transition began after Franco's death in 1975 and was constitutionally ratified in 1978.
- Vietnam declared independence in 1945; the 1954 Geneva settlement created a provisional military demarcation rather than a permanent international border; the South Vietnamese government collapsed on 30 April 1975; legal reunification and the name Socialist Republic of Vietnam followed on 2 July 1976. [Sources: turkey_ataturk, china_national_museum, us_historian_china_1949, japan_mext_meiji, japan_ndl_constitution, spain_senate_constitution, vietnam_embassy, vietnam_constitution]

### Other successor states and partitions
The dataset includes the independence/state-formation milestones of Finland, Poland, Lithuania, Estonia, Latvia and the Ukrainian People's Republic. It also includes the 1947 partition of British India and the 1948 establishment of the Republic of Korea and DPRK. These are essential because the 1917–49 period was not simply a change of Russian or European regimes: it produced new states and competing claims to sovereignty. [Sources: finland_gov, poland_mfa, baltic_mfa, estonia_state, latvia_president, ukraine_encyclopedia, india_partition_archives, korea_history]


### Social and political law milestones
The research now records the 1861 Russian Emancipation Reform, Finland's 1906 equal suffrage reform (while Finland was still a Russian Grand Duchy), the US Social Security Act of 1935, and the UK National Health Service becoming operational on 5 July 1948. These additions prevent the simulation from treating labour, women's political rights and welfare as static background conditions. [Sources: russia_emancipation_1861, finland_parliament_1906, us_social_security_1935, uk_nhs_1946]

## Minimal 20th-century law extension proposal

The current engine exposes these nine law groups and values (from `src/engine/data/dbTypes.ts` and `historical_data/countries/_law_presets.json`):
- power: autocracy, oligarchy, census_suffrage, universal_male_suffrage, theocracy, tribal_council
- governance: monarchy, republic, theocracy, chiefdom, colonial_company
- economy: traditionalism, mercantilism, interventionism, laissez_faire
- trade: isolationism, protectionism, free_trade
- labor: slavery, serfdom, traditional_tenancy, free_labor
- church: state_religion, freedom_of_conscience, secularism
- press: censorship, limited_press, free_press
- education: no_schools, religious_schools, public_schools
- army: feudal_levies, professional_army, mass_conscription

Recommended additions (detailed in JSON):
| Group | Proposed law | Representative country / year | Why needed |
|---|---|---|---|
| power | One-party state | USSR 1922; PRC 1949 | Captures party monopoly not reducible to generic autocracy |
| power | One-party dictatorship | Nazi Germany 1933; Fascist Italy 1926 | Distinguishes authoritarian party-state from monarchy or generic autocracy |
| power | Universal adult suffrage | Finland 1906; Italy 1946 | Existing `universal_male_suffrage` is sex-specific and cannot model women's suffrage |
| power | Multiparty presidential republic | Russia 1991 | Distinguishes competitive presidential systems from autocracy |
| power | Authoritarian state | Vichy France 1940 | Allows authoritarian legal form without falsely mapping Vichy to monarchy |
| governance | Semi-presidential republic | France 1958 | Represents president/prime-minister dual executive |
| economy | State socialist economy | RSFSR 1918 | Distinguishes nationalisation/socialisation from mature central planning |
| economy | Central planned economy | USSR 1928; GDR 1949; PRC 1953 | Binding national production and investment plans |
| economy | Market-socialist transition | USSR 1987; China 1978 | Captures partial market mechanisms while party-state remains |
| trade | State foreign-trade monopoly | USSR 1918; PRC 1950 | Distinguishes state monopoly from ordinary protectionism |
| labor | State-directed labour system | USSR 1930 | Captures state allocation and coercive labour controls |
| army | Constitutional renunciation of war | Japan 1947 | Article 9 is not equivalent to low military spending or professional army |
| political_ideology (new dimension) | Communist / Fascist / National Socialist state ideology | USSR 1922; Italy 1925; Germany 1933 | Ideology is not interchangeable with government form or party-system law |
| welfare (new dimension) | Social insurance and welfare state | USA 1935; UK 1948 | Welfare provision is cross-cutting and does not imply a planned economy |
| gender_equality (new dimension) | Equal citizenship and suffrage | Finland 1906; Italy 1946 | Universal male suffrage is not universal adult suffrage |

**Do not implement all proposed laws as if they existed in the current enum.** They are a design proposal. Existing values in `lawChanges` are best-effort coarse mappings; new concepts are explicitly listed in `proposedLawChanges`.

## Important modelling cautions

1. **Date windows matter.** Use `date` as the principal legal/proclamation milestone and `windowStart/windowEnd` for transitions that took months or years. Do not force all political change into one tick.
2. **Regime form is not the same as legal state title.** Nazi Germany remained formally the German Reich; Fascist Italy remained a monarchy; Vichy retained the État français label; Japan remained a monarchy after 1947. The engine needs a distinction between constitutional form and de facto regime.
3. **Do not equate formal rights with practice.** Soviet constitutions proclaimed rights that coexisted with repression; Weimar and Franco-era transitions likewise need distinct effective-power fields.
4. **Territorial sovereignty is not always uncontested.** ROC/PRC, the two Korean states, the 1954 Vietnam demarcation, Ukraine 1917–21 and Baltic declarations require contested or transitional statuses.
5. **Successor-state identifiers.** Existing registry includes 1836 start entities such as RUS, QNG, TUR, FRA, PRU and JAP, but does not currently provide a full historical entity chain for Germany, USSR, PRC, GDR, FRG, Italy, Austria-Hungary, successor states or the two Koreas. Proposed identifiers in this JSON are research keys, not verified production IDs.
6. **Capitals are city names.** `capitalHistorical` intentionally stores names such as Petrograd, Moscow, Nanjing, Vichy, Bonn and East Berlin. It is not an engine region ID; map to actual region registry after checking date-specific ownership.
7. **Avoid anachronistic territory patches.** The state-formation records identify historic territory descriptions, not exact engine regions or automatic ownership changes. For example, Baltic independence declarations occurred under German occupation; Ukraine's 1918 independence was contested; Vietnam's 17th parallel was provisional.

## Integration recommendations for Claude

- Keep this file in research staging until a validator and historical entity registry exist.
- Add a first-class historical polity timeline keyed by stable polity IDs, with separate fields for constitutional regime, effective ruling coalition, sovereignty status, capital and territorial control.
- Apply event ordering at day resolution, not year-only resolution. Preserve multi-step events (e.g. Germany 1933, Russia 1917, Italy 1922–26, USSR 1991).
- Build a territory-transfer layer with `from`, `to`, `date`, `status` and contested-control metadata. Do not infer province IDs from city names.
- Add explicit support for state splits, successor chains, government-in-exile, occupation, temporary military demarcation and partial sovereignty.
- Add unit tests for critical transitions: RUS→Provisional Government→RSFSR→USSR→successor states; QNG→ROC and ROC/PRC dual continuation; AHM dissolution; Germany 1949 partition and 1990 accession; Vietnam 1954 temporary division and 1976 reunification.

## Unresolved / deliberately not inferred

- Exact territorial successor boundaries for Austria-Hungary require a treaty/map-to-engine-region crosswalk; this file records the named successor states, not a complete polygon assignment.
- The 1917–21 Ukrainian state sequence involved competing governments and military occupation; this package records the Central Rada/UNR milestones but not every regime in Kyiv, Kharkiv and western Ukraine.
- The 1918–20 Baltic and Finnish independence wars mean declaration dates do not equal complete effective sovereignty.
- India's universal adult suffrage was implemented with the 1950 Constitution; 1947 Dominion status did not itself equal immediate universal adult voting.
- The exact effective territorial reach of DRV in 1945 and the Republic of Vietnam after 1954 varied; do not infer that the 1945 declaration immediately transferred every province.
- The current law model cannot faithfully encode party-state monopoly, command economy, welfare state, women's suffrage, state foreign-trade monopoly, constitutional pacifism or semi-presidentialism without new enums. The added `political_ideology`, `welfare` and `gender_equality` proposals are intentionally separate dimensions rather than being forced into unrelated existing groups.

## Source register

- `un_rus_2017` — Russian Federation common core document, HRI/CORE/RUS/2017 (supported). https://digitallibrary.un.org/record/1308041/files/HRI_CORE_RUS_2017-EN.pdf
- `ushmm_russian_revolution` — Russian Revolution, 1917 (supported). https://encyclopedia.ushmm.org/content/en/article/the-russian-revolution-1917
- `fr_assemblee_regimes` — Régimes français depuis 1789 (verified). https://www.assemblee-nationale.fr/gouv_parl/regimes.asp
- `fr_assemblee_vichy` — Pétain full powers, 10 July 1940 (verified). https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/deuxieme-guerre-mondiale/des-decrets-lois-du-gouvernement-daladier-au-vote-par-la-chambre-des-deputes-et-le-senat-des-pleins-pouvoirs-au-marechal-petain
- `fr_assemblee_5rep` — Constitution of the Fifth Republic (verified). https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/cinquieme-republique
- `deutschlandmuseum` — German history timeline (supported). https://www.deutschlandmuseum.de/en/history/
- `deutschland_empire` — The German Empire: Foundation, Kaiser and WW1 (supported). https://www.deutschlandmuseum.de/en/history/imperial-germany/
- `german_history_docs` — Creation of the German Empire (1866–1871) (supported). https://germanhistorydocs.org/en/forging-an-empire-bismarckian-germany-1866-1890/creation-of-the-german-empire-1866-1871
- `de_basic_law` — Basic Law for the Federal Republic of Germany (verified). https://www.gesetze-im-internet.de/englisch_gg/englisch_gg.html
- `italian_parliament` — The History of the Italian Parliament (verified). https://www.camera.it/application/xmanager/projects/camera/attachments/pubblicazione/pdfs/000/000/778/Montecitorio_ingl_def.pdf
- `italy_un_core` — Italy common core document HRI/CORE/ITA/2016 (supported). https://digitallibrary.un.org/record/844446/files/HRI_CORE_ITA_2016-EN.pdf
- `ausgleich_aeiou` — Austro-Hungarian Compromise (Ausgleich) (supported). https://www.aeiou.at/aeiou.encyclop.a/a907407.htm
- `us_historian_austria` — Austria – Office of the Historian (supported). https://history.state.gov/countries/austria
- `us_historian_hungary` — Hungary – Office of the Historian (supported). https://history.state.gov/countries/hungary
- `us_historian_czechoslovakia` — Czechoslovakia – Office of the Historian (supported). https://history.state.gov/countries/czechoslovakia/summary
- `yugoslav_archives` — Constituent Acts of Yugoslavia (verified). https://www.arhivyu.rs/en/leksikon-jugoslavije/konstitutivni_akti_jugoslavije
- `turkey_ataturk` — Biography of Atatürk and political reforms (supported). https://www.ktb.gov.tr/EN-103908/biography-of-ataturk.html
- `china_national_museum` — Imperial Edict of the Abdication of the Qing Emperor (verified). https://en.chnmuseum.cn/collections_577/collection_highlights_608/objects_of_chinese_revolutionary_history_610/202008/t20200806_246813.html
- `us_historian_china_1949` — The Chinese Revolution of 1949 (supported). https://history.state.gov/milestones/1945-1952/chinese-rev
- `japan_mext_meiji` — Promulgation and entry into force of the Meiji Constitution (verified). https://www.mext.go.jp/b_menu/hakusho/html/others/detail/1317324.htm
- `japan_ndl_constitution` — Birth of the Constitution of Japan – chronology (verified). https://www.ndl.go.jp/constitution/e/etc/history.html
- `japan_house_reps` — Constitution of Japan (verified). https://www.shugiin.go.jp/internet/itdb_english.nsf/html/statics/english/constitution_e.htm
- `spain_senate_constitution` — The Senate in the constitutional history of Spain (verified). https://www.senado.es/web/conocersenado/temasclave/historiaconstitucional/index.html?lang=en
- `spain_senate_transition` — Constitutional periods – Transition to Democracy (supported). https://www.senado.es/web/conocersenado/senadohistoria/periodosconstitucionales/index.html?lang=en
- `vietnam_embassy` — Political Overview of Vietnam (verified). https://vietnamembassy-usa.org/node/56
- `vietnam_constitution` — Constitution of the Socialist Republic of Vietnam (verified). https://vietnam.gov.vn/constitution-1992-68962
- `finland_gov` — Finland’s road to independence in 1917 (verified). https://valtioneuvosto.fi/en/-/finland-s-centenary-is-filled-with-joy-and-dignity
- `baltic_mfa` — The roads to independence – Baltic States (supported). https://www.urm.lt/en/news/928/the-roads-to-independence-lithuania-in-the-world-no-2-2008-p.-4-7%3A28291
- `estonia_state` — National holiday and proclamation of Estonia (verified). https://riigikantselei.ee/en/national-holiday
- `latvia_president` — History of the Republic of Latvia (verified). https://www.president.lv/en/history
- `poland_mfa` — National Independence Day (verified). https://www.gov.pl/web/diplomacy/national-independence-day
- `ukraine_encyclopedia` — Struggle for Independence (1917–20) (supported). https://www.encyclopediaofukraine.com/display.asp?linkpath=pagesSTStruggleforIndependence1917hD720.htm
- `india_partition_archives` — Partition of British India (supported). https://www.nationalarchives.gov.uk/education/teaching-resources/partition-of-british-india/
- `korea_history` — Establishment of the Republic of Korea and DPRK (supported). https://contents.history.go.kr/mobile/kc/view.do?levelId=kc_i502100
- `ussr_belavezha` — Belovezha Agreement, 8 December 1991 (supported). https://governmentussr.org/en/pravitelstvo/voenno-narodnyy-sovet-sssr/belovezhskoe-soglashenie-08-12-1991-g/
- `ussr_dissolution_declaration` — Declaration No. 142-N, 26 December 1991 (supported). https://base.garant.ru/74619820/
- `aus_state_treaty` — History of Austria – 1955 State Treaty (verified). https://www.bmeia.gv.at/oev-wien/about-austria/history
- `finland_parliament_1906` — Brief history of Parliament – 1906 universal suffrage (verified). https://www.eduskunta.fi/en/parliament-and-its-activities/brief-history-of-parliament
- `russia_emancipation_1861` — Emancipation reform of 1861 – historical overview (supported). https://www.britannica.com/event/Emancipation-Manifesto
- `us_social_security_1935` — Social Security Act of 1935 (verified). https://www.ssa.gov/history/35act.html
- `uk_nhs_1946` — National Health Service Act 1946 (verified). https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/coll-9-health1/health-01/

