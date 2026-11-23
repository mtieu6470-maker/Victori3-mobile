# CG-40 — World Wars, Peace Settlements and the League of Nations

**Research date:** 2026-11-23  
**Branch:** `ccr-b27f3fb8-epfpd6`  
**Status:** research staging; not yet wired to engine.

## Deliverables

- `historical_data/research_staging/CG40_WORLD_WARS.json` — structured research dataset.
- This report — chronology, methodological caveats, treaty territorial crosswalk, League institutional history, casualty estimate quality and integration notes.

## 1. War chronology and participant rules

### World War I

The conventional global start is **28 July 1914**, when Austria-Hungary declared war on Serbia. The global end marker in this dataset is **11 November 1918**, the Compiègne Armistice; it is not a peace treaty. The Central Powers left the war on separate dates: Bulgaria 29 September 1918, Ottoman Empire 30 October, Austria-Hungary 3 November, and Germany 11 November. Soviet Russia left through the separate Treaty of Brest-Litovsk on 3 March 1918. Romania signed the Treaty of Bucharest on 7 May 1918 and re-entered the war on 10 November 1918.

The participant register distinguishes principal combatants from associated/formal belligerents. Some smaller states declared war late and had little direct combat participation. The entry date is the legal declaration or recognized belligerency date, not necessarily the first troop deployment. The end date is the armistice, separate peace, capitulation or general end of war as applicable.

### World War II

The conventional global start is **1 September 1939** (Germany's invasion of Poland). The end is split:
- **8 May 1945:** German surrender effective in Europe (9 May in Moscow).
- **2 September 1945:** Japan signed the formal Instrument of Surrender, ending the Pacific/global war.

China's war with Japan began on **7 July 1937**; this is represented as a prelude theatre, not as a replacement for the conventional 1939 global start. France's armistice in June 1940, Belgium's capitulation in May 1940 and Norway/Greece/Yugoslavia's metropolitan defeats do not mean their governments-in-exile and forces ceased Allied participation.

**Side changes:**
- Italy: armistice announced 8 September 1943; Kingdom of Italy declared war on Germany on 13 October 1943 and became a co-belligerent. The Italian Social Republic in northern Italy remained aligned with Germany. The Slovak Republic participated in the invasion of Poland from 1 September 1939 as a German satellite; formal Axis alignment followed later.
- Romania: King Michael's coup on 23 August 1944 ended the Antonescu regime and turned Romania against Germany; armistice signed 12 September 1944.
- Bulgaria: joined the Axis Pact in March 1941 and declared war on Britain/US in December 1941, but did not declare war on the USSR before the Soviet invasion. Bulgaria declared war on Germany in September 1944; armistice with the Allies followed on 28 October.
- Finland: co-belligerent with Germany against the USSR, not a formal Tripartite Pact member; armistice 19 September 1944 and Lapland War against Germany began 15 September. The Netherlands and Belgium entered the war when Germany invaded them on 10 May 1940, not in September 1939. Poland's government-in-exile continued belligerency through the end of the global war.

## 2. Peace treaties and territorial crosswalk

| Instrument | Date | Principal territorial outcomes | Critical implementation caveat |
|---|---|---|---|
| Brest-Litovsk | 3 Mar 1918 | Russian sovereignty renounced west of the treaty line; territories included Poland, Lithuania, Courland, Livonia, Estonia and parts of Belarus; Ukraine had a separate treaty | Treaty was voided by the Central Powers' defeat; do not encode as permanent modern borders |
| Versailles | 28 Jun 1919 | Alsace-Lorraine to France; Eupen-Malmedy to Belgium; Posen/most West Prussia and parts of Upper Silesia to Poland; Hultschin to Czechoslovakia; Northern Schleswig after plebiscite to Denmark; Danzig Free City; Saar under League administration; German colonies became mandates | Plebiscites and later transfers must be separate dated events |
| Saint-Germain | 10 Sep 1919 | South Tyrol, Trentino, Trieste and Istria to Italy; Bohemia/Moravia to Czechoslovakia; Bukovina to Romania; former Habsburg lands reorganized among successor states | Some borders were settled by later treaties/plebiscites; map each article to engine regions |
| Neuilly | 27 Nov 1919 | Western Thrace ceded by Bulgaria to Allied control then transferred to Greece; Strumica/western border districts to the Kingdom of Serbs, Croats and Slovenes | Southern Dobruja was already ceded to Romania in 1913, not by Neuilly |
| Trianon | 4 Jun 1920 | Slovakia and Carpathian Ruthenia to Czechoslovakia; Transylvania/Partium/eastern Banat to Romania; Croatia-Slavonia/Backa/Prekmurje to the SHS Kingdom; Burgenland to Austria, except Sopron after plebiscite | Treaty borders and later plebiscite outcomes should be distinct |
| Sèvres | 10 Aug 1920 | Proposed Greek administration in Smyrna and Greek acquisition of Eastern Thrace; mandates in Arab provinces; proposed Armenian and Kurdish arrangements | **Never ratified or implemented as written**; must not be applied as a real transfer |
| Lausanne | 24 Jul 1923 | Recognized Turkish sovereignty in Anatolia and Eastern Thrace; Dodecanese to Italy; Turkey recognized British annexation of Cyprus; Mosul referred to later negotiation/League process | Superseded Sèvres; Mosul settled later in favour of Iraq |
| Yalta | 4–11 Feb 1945 | Poland's eastern frontier aligned broadly to the Curzon Line; Soviet territorial claims in the Far East promised in return for entry against Japan | Conference agreement, not a comprehensive final peace treaty; western Polish frontier remained unsettled |
| Potsdam | 17 Jul–2 Aug 1945 | Former German territories east of the Oder-Neisse line placed under Polish administration pending final settlement; northern East Prussia including Königsberg to USSR; occupation zones established | Provisional administration and occupation are not identical to final sovereign cession |
| Paris Peace Treaties | 10 Feb 1947 | Italy: most Istria/Fiume/Zara to Yugoslavia, Trieste Free Territory, Dodecanese to Greece, Tende/La Brigue to France; Finland: Petsamo to USSR; Romania's 1940 Soviet losses confirmed; Hungary ceded three villages to Czechoslovakia | Treaty set restored Bulgaria's 1 Jan 1941 borders; Southern Dobruja remained Bulgarian |
| San Francisco | 8 Sep 1951 (in force 28 Apr 1952) | Japan renounced Korea, Taiwan/Pescadores, Kuriles/southern Sakhalin, Spratlys and Paracels | The treaty does not name recipients for several renounced territories; do not infer a transfer to a particular state |

Territorial strings are deliberately **historical place names**, not guessed engine region IDs. The receiving country is not always identical to the administering power, and the legal status may be provisional, mandated, plebiscitary or disputed. Claude should resolve these strings against the region registry and only then generate engine mappings.

## 3. League of Nations

- Covenant entered into force and the League officially came into existence **10 January 1920**.
- First Assembly opened **15 November 1920**.
- The League had **63 members over its lifetime**, with at most 60 concurrently; the United States never joined because the Senate did not ratify the Versailles Treaty.
- The Covenant Annex lists original signatories and states invited to accede; it is not itself a complete dated membership ledger.
- The Council began with four non-permanent seats, expanded to six in 1922, nine in 1926, ten in 1933 and eleven in 1936.
- The four actual permanent Council members in 1920 were Britain, France, Italy and Japan. The United States was named in the Covenant's Principal Allied and Associated Powers but never joined. Germany received permanent Council status in 1926; the USSR in 1934.
- Article 5 made decisions generally unanimous among members represented, except procedural matters and express exceptions. Article 15's dispute process excludes parties to the dispute from the relevant unanimity calculation.
- Germany announced withdrawal on 19 October 1933 (effective after the two-year notice period); Japan gave notice on 27 March 1933 (effective 1935); Italy gave notice in December 1937 (effective December 1939). The USSR was **expelled** on 14 December 1939 after its attack on Finland; this was not a voluntary withdrawal.
- The League formally dissolved on **20 April 1946**, after transfer of remaining assets and functions to the United Nations.

The 1926–1939 Council year table is transcribed from a study based on the League's Official Journal. Exact non-permanent Council composition for 1920–1925 remains incomplete in this staging version and is explicitly marked unverified rather than invented.

## 4. Fatalities: estimates and calibration cautions

### World War I

The JSON contains selected country estimates, not a fabricated complete global ledger. Sources disagree because they count military deaths, missing presumed dead, civilian deaths, famine, disease and influenza differently. The US Census history resource reproduces a CVCE/REPERES table with separate military and civilian losses for many Allied countries; the 1919 Ayres statistical survey provides contemporary battle-death figures; USHMM and Open University provide additional ranges.

Examples:
- Germany: approximately 1.6–2.04 million military deaths; civilian estimates approximately 0.43–0.70 million in the selected sources.
- Russia: approximately 1.7–2.0 million military; 1.5–2.0 million civilian.
- France: approximately 1.33–1.40 million military; civilian estimates vary widely (about 0.04–0.60 million).
- Serbia: approximately 0.275–0.278 million military; civilian estimates roughly 0.30–0.65 million.
- Romania: approximately 0.25–0.336 million military; around 0.43 million civilian in the cited series.

For Austria-Hungary, Ottoman Empire and Bulgaria, the selected sources do not provide a sufficiently harmonized civilian split; those fields remain null/unverified.

### World War II

The National WWII Museum provides country military deaths and total civilian-plus-military deaths; SIPRI provides separate military and civilian approximations for a selected group. For Finland and Bulgaria, source intervals are sorted numerically in the JSON (Finland civilian 2,000–15,000; Bulgaria 3,000–10,000), while preserving the source totals. The JSON preserves source variation and marks derived/residual estimates. The Museum warns that estimates vary widely and that China may exceed the cited 20 million total.

Examples from the cited series:
- USSR: about 24 million total; SIPRI's separate estimates put military deaths around 4.75 million and civilian around 1.47 million for Germany, while Soviet source ranges vary materially.
- China: Museum baseline 20 million total and 3–4 million military; other estimates can be substantially higher.
- Germany: 6.6–8.8 million total; 4.75–5.53 million military.
- Poland: around 5.6 million total, mostly civilian.
- Japan: 2.6–3.1 million total; 1.5–2.12 million military in the selected sources.

**Important data-quality note:** a few residual civilian values in the JSON are derived by subtracting the military estimate from a total estimate, not independently counted. They are flagged in notes and must not be treated as primary-source observations. Before gameplay balancing, use broad bands rather than exact integers.

## 5. Source register

### World War I
- USHMM, WWI overview and armistice chronology: https://encyclopedia.ushmm.org/content/en/article/world-war-i
- US Office of the Historian, US entry into WWI: https://history.state.gov/milestones/1914-1920/wwi
- Statistics Canada, contemporary historical chronology of belligerent entry dates: https://www65.statcan.gc.ca/acyb07/acyb07_2017f-eng.htm
- Treaty of Brest-Litovsk primary text (Yale Avalon): https://avalon.law.yale.edu/20th_century/brest.asp
- US Census history resource reproducing REPERES/CVCE WWI deaths table: https://www.census.gov/history/pdf/reperes112018.pdf
- US Government Publishing Office, Ayres 1919 statistical survey: https://www.govinfo.gov/content/pkg/GPO-CRECB-1919-pt4-v58/pdf/GPO-CRECB-1919-pt4-v58-4-1.pdf
- Open University, WWI military/civilian death estimates and caveats: https://www.open.edu/openlearn/mod/oucontent/view.php?id=79698&section=_unit1.1.3

### World War II
- USHMM, WWII key dates: https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates
- USHMM, Axis Powers and side changes: https://encyclopedia.ushmm.org/content/en/article/axis-powers-in-world-war-ii
- USHMM, WWII in depth: https://encyclopedia.ushmm.org/content/en/article/world-war-ii-in-depth
- US National Archives, German surrender instrument: https://www.archives.gov/milestone-documents/surrender-of-germany
- National WWII Museum, country deaths: https://www.nationalww2museum.org/students-teachers/student-resource/research-starters/research-starters-worldwide-deaths-world-war
- SIPRI, fatalities approximation: https://www.sipri.org/sites/default/files/files/books/SIPRI80Westing.pdf

### League of Nations
- UN Geneva, League overview: https://www.ungeneva.org/en/about/league-of-nations/overview
- UN Geneva, organs and Council membership: https://www.ungeneva.org/en/about/league-of-nations/organs
- UN Geneva, Covenant of the League: https://www.ungeneva.org/en/about/league-of-nations/covenant
- League Council reform study (Council composition 1926–1939): https://www.tandfonline.com/doi/full/10.1080/13600826.2020.1739629
- Library of Congress, Germany's 1933 withdrawal notice: https://www.loc.gov/resource/gdcwdl.wdl_11598/

### Peace settlements
- US National Archives, American Commission to Negotiate Peace records: https://www.archives.gov/files/research/foreign-policy/related-records/rg-256-inventory.pdf
- USHMM, Versailles territorial changes: https://encyclopedia.ushmm.org/content/en/article/world-war-i-treaties-and-reparations
- German History in Documents and Images, Versailles boundaries: https://germanhistorydocs.org/en/weimar-germany-1918-1933/ghdi:document-3932
- Lausanne Treaty, Türkiye MFA: https://www.mfa.gov.tr/lausanne-peace-treaty.en.mfa
- Potsdam territorial settlement, FRUS: https://history.state.gov/historicaldocuments/frus1945Berlinv01/d509
- San Francisco Treaty of Peace with Japan, FRUS: https://history.state.gov/historicaldocuments/frus1951v06p1/d596
- Treaty of Saint-Germain text: https://www.dipublico.org/3671/\n- Treaty of Trianon text: https://mjp.univ-perp.fr/traites/1920trianon.htm\n- Treaty of Peace with Italy (Paris 1947), UN Treaty Series vol. 49: https://treaties.un.org/doc/publication/unts/volume%2049/v49.pdf\n- Treaty repositories for Neuilly and Sèvres: https://treaties.un.org/

## 6. Integration instructions for Claude

1. Keep this file in `historical_data/research_staging/` until the owner approves its schema and engine mappings.
2. Add a dedicated schema validator before moving it to `historical_data/wars/world_wars.json`.
3. Map participant IDs to engine countries only after checking the country registry. Several IDs (GMY, AUH, MNG, ROM, GRE, YUG, FIN, HUN, BUL, SVK, HRV, THA, NPL, POL) may be absent or use different project identifiers.
4. Resolve each historical capital city to the actual region that contains it at the relevant date; capitals are not guaranteed to correspond to today's metropolitan region or sovereignty.
5. Convert every treaty transfer into dated, conditional region transitions. Include plebiscites, provisional occupation, mandate status, disputed sovereignty, and treaty ratification status.
6. Implement armistice, surrender, capitulation, government-in-exile, separate peace and side-switch as distinct event types. Do not remove countries from a side just because their capital fell.
7. Add casualty calibration as broad intervals by country and theatre. Never treat wounded, missing, prisoners, famine deaths or influenza as interchangeable with military fatalities.
8. The League should dissolve on 1946-04-20; the UN founded 1945-10-24. There is a historical overlap, so do not model League dissolution as the prerequisite for UN founding.
9. Before engine integration, independently verify every treaty territorial clause against the full primary text and the engine region map. The treaty crosswalk in this staging file is a research guide, not a ready-to-apply map patch.

## Unverified / follow-up list

- Exact League Council non-permanent members in each year 1920–1925.
- Full dated League membership register for all 63 members, including accessions, withdrawals and expulsions.
- Article-level territorial crosswalk for Saint-Germain, Neuilly, Trianon, Sèvres and Paris 1947.
- Complete belligerent lists for colonial forces, minor declarations, resistance movements and governments-in-exile.
- Harmonized civilian casualty ranges for Austria-Hungary, Ottoman Empire, Bulgaria and several smaller states.
- Exact casualty definitions and source series for USSR/China; some source totals conflict substantially.


## 7. Corrections from validation pass

The first staging validation caught and corrected:
- Netherlands and Belgium were initially assigned a 1939 entry date; both entered after the German invasion on **10 May 1940**.
- Slovakia's 1939 state-formation date was not a valid war-entry date; its participation in the invasion of Poland is dated **1 September 1939**.
- Poland's government-in-exile continued Allied belligerency beyond the 1939 campaign; its global-war end marker is now 2 September 1945.
- Romania's 1918 re-entry is explicitly represented as a side event on 10 November 1918 after the separate Treaty of Bucharest.
- The French armistice is separated from Free France's continued Allied war.
- Finland, Bulgaria and Austria civilian fatality ranges were sorted and checked for internal consistency.
- The Council permanent-seat end markers for Germany, Japan and Italy now reflect the two-year withdrawal notice period rather than the notice date.

The JSON was reparsed after the correction. It remains staging data; no engine or region ownership was changed.
