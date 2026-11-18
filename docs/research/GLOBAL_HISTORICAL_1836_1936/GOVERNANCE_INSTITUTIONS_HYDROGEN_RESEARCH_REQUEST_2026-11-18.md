# Global Governance, Institutions and Political Agency — Gemini Hydrogen Research Task

**Project:** Currents of History / Victori3 Mobile  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Research period:** 1836-01-01 through 1936-12-31  
**Reference snapshot:** 1 January 1836, with dated changes through 1936  
**Scope:** every historical/playable polity in the current global baseline; include decentralized, confederated, tributary, colonial, indigenous, religious and multi-polity gameplay aggregates  
**Status:** `RESEARCH_REQUEST_ONLY / CANDIDATE_HISTORICAL_EVIDENCE / NO_RUNTIME_AUTHORIZATION`

## 1. Purpose

Prepare source-backed historical evidence for the future S15–S17 systems:

- S15 Local Government, Public Services and Urban Development
- S16 Character Simulation Foundation
- S17 Politics and Institutions

Design proposal under review:
`docs/spec/GOVERNANCE_CHARACTERS_POLITICS_ARCHITECTURE_PROPOSAL_VI.md`

This is research only. Do not modify product code, runtime historical DB, generated DB, save schema, tests, UI, assets, Android or workflows. Do not label candidate facts as accepted game data.

## 2. Global coverage requirement

Use the current baseline entity IDs and source registry. Every current entity must appear in a coverage matrix, even when evidence is missing. Research must balance coverage across Europe, Africa, Asia, the Americas and Oceania. Do not let quality of European constitutional archives dictate a universal institutional model.

For each entity, distinguish:
- sovereign state/polity;
- subordinate/tributary/suzerain relationship;
- confederation/federation/union;
- colony/protectorate/concession/chartered company;
- decentralized/local authority;
- contested or overlapping authority;
- game-only aggregate combining multiple historical polities.

For aggregate gameplay entities, list constituent polities and explain why they are grouped. Do not invent a unified government, sovereign, ruler, legislature or succession chain if historical actors did not share one.

## 3. S15 — Local government and public administration

Research these dimensions separately:

1. Central authority and decision center (court, ruler, council, assembly, cabinet, religious authority, military authority, company board, etc.).
2. Territorial administration and local authority (province, district, city, village, customary authority, clan/tribal council, estate, tributary ruler, local notable, religious court, etc.).
3. De jure claim vs de facto control and administrative reach.
4. Fiscal extraction and administration (tax, tribute, customs, rent, corvée, land revenue, office fees, communal contribution, in-kind obligations).
5. Justice and enforcement (formal courts, customary law, religious courts, local arbitration, policing, military coercion).
6. Education provision (state, religious, community, mission, private, customary, informal institutions; language and access limits).
7. Health and sanitation provision (hospitals, physicians, traditional practitioners, epidemic response, water/sanitation and local capacity).
8. Infrastructure/public works responsibility (roads, bridges, ports, canals, drainage, irrigation, urban services).
9. Urban governance and settlement organization (municipal bodies, guilds, ward/quarter leaders, town authorities, landlord/estate governance).
10. Gender, status, class, religion and legal eligibility restrictions only where source-backed and relevant to access/rights.

Do not use modern administrative units or modern ministry structures as if they existed in 1836. Record temporal validity and changes by date. A central decree does not prove universal local implementation.

## 4. S16 — Historical characters and offices

Research only notable persons with meaningful game roles or positions, not a complete population list.

For each potential character:
- canonical ID proposal and name variants/scripts/transliterations;
- historical titles and offices;
- birth/death or active-date ranges with uncertainty;
- appointment, accession, resignation, deposition, exile or succession dates;
- office/jurisdiction held and whether authority was personal, delegated, collegial or contested;
- kinship/dynasty ties only when documented;
- roles as ruler, heir, minister, governor, chief, council member, military commander, religious leader, diplomat, reformer, movement organizer, notable landholder/merchant;
- sources for the person and separately for their office/authority;
- disputed identities, transliteration and genealogy alternatives;
- confidence/quality per field, not just one confidence label per person.

Important:
- If the evidence identifies an office but not its holder, record `holder_unknown`, not a generated historical person.
- If authority was shared or collective, record the office/council/rangatira group and source; do not invent one Head of State.
- Generated game characters must never be mixed into the historical research registry.
- Do not infer traits, beliefs, motives, ethnicity or family relationships from a name alone.

## 5. S17 — Political institutions, laws and organizations

For each polity, identify:

### Institutions
- executive/decision-making authority;
- advisory, consultative, representative or elective bodies where they existed;
- council, court, assembly, parliament, estates, confederate congress, tribal authority, religious authority, military authority or corporate authority;
- who could participate, consent, veto, ratify or implement decisions;
- lawmaking/customary decision process;
- division between central/local authority;
- succession/appointment rules;
- recognition and legitimacy bases;
- institution changes with date and source.

### Laws and rights
- political participation/eligibility;
- land tenure/property;
- labor status (free, enslaved, bonded, serfdom, corvée, tribute obligations);
- religious/legal jurisdiction;
- taxation/tribute;
- press/association/speech restrictions only where relevant and source-backed;
- military service/levy/conscription;
- local autonomy and rights.
Do not force all legal arrangements into the present code's nine LawGroups. Preserve source terms and explain any proposed abstract mapping.

### Political organizations and movements
- estates, guilds, court factions, merchant networks, religious orders, professional bodies, military corps, rural communities, labor organizations, parties, reform societies, anti-colonial organizations and independence movements;
- start/end dates, geography, leadership, constituency, goals and political methods;
- petitions/protests/strikes/rebellions/revolutions/secession movements and negotiation/concession outcomes;
- distinguish a short-lived movement from a permanent institution or political party;
- distinguish exogenous event from endogenous political organization and player/AI agency.

## 6. Source standard

Prioritize:
1. archives and original constitutional/legal/government records;
2. official national archives, museums, historical commissions and treaty databases;
3. peer-reviewed scholarship and specialist monographs;
4. scholarly prosopographical/biographical databases;
5. established historical reference works as leads/corroboration.

Avoid citations to AI-generated content, unsourced web summaries and Wikipedia-only claims. For every quantitative or contested claim provide exact page/article/folio/table locator where possible.

For every source record:
- `source_id`;
- author/institution, title;
- publication date and/or archive date;
- direct URL or catalogue accession;
- pages/folios/articles;
- subject polity/person/institution;
- original evidence date and validity period;
- source type and methodology;
- limitations, political bias and scope;
- licence/reuse/access terms;
- field(s) supported and confidence.

Citations must be verifiable independently. Do not invent URLs, pages or accession identifiers.

## 7. Deliverables

Create research-only directory:
`docs/research/GLOBAL_HISTORICAL_1836_1936/GOVERNANCE_INSTITUTIONS/`

Recommended files:

1. `README_VI.md` — scope, date coverage, methods, coverage/gaps and caveats.
2. `POLITY_INSTITUTION_COVERAGE.csv` — one row per current entity and institution dimension, including explicit missing records.
3. `AUTHORITY_AND_ADMINISTRATION_CANDIDATES.csv` — authority type, scope, local/central relationship, effective dates, de jure/de facto and source quality.
4. `INSTITUTION_PROFILES_CANDIDATES.csv` — decision bodies, consent/participation, veto, lawmaking and validity.
5. `LAW_AND_RIGHTS_EVIDENCE.csv` — source term, date, coverage, rights/obligations, locally valid variants and source.
6. `CHARACTER_CANDIDATES.csv` — potential people only, with field-level certainty; no invented historical actors.
7. `OFFICE_AND_SUCCESSION_EVIDENCE.csv` — offices, joint/collective authority, selection/succession/delegation and vacancy/unknown status.
8. `POLITICAL_ORGANIZATIONS_AND_MOVEMENTS.csv` — organization/movement dates, geography, demands, constituency, leadership and outcomes.
9. `SOURCE_REGISTRY_DELTA.csv` — normalized source records.
10. `OPEN_EVIDENCE_REQUESTS.csv` — missing/contested fields and specific evidence needed.
11. `WORLD_REGION_COVERAGE_SUMMARY.csv` — coverage across Europe, Africa, Asia, Americas and Oceania.

Every CSV must have stable unique IDs, one claim/fact per row, rectangular columns and UTF-8 quoting. Preserve original historical terms and translations alongside any normalized game concept.

## 8. Method and quality labels

Use field-level quality:
- `verified`: primary evidence or high-quality direct record with clear scope;
- `supported`: specialist scholarship directly supports claim;
- `estimated`: explicit method and uncertainty bounds;
- `uncertain`: conflicting sources, disputed chronology or unclear jurisdiction;
- `missing`: insufficient evidence.

Do not transfer confidence from one field to another. A verified ruler name does not verify the full constitutional system. A well-documented constitution does not prove local implementation. A dated treaty does not prove that all subjects were effectively controlled.

## 9. Completion and acceptance checks

- Every current baseline entity appears in coverage matrix.
- All five world regions represented; non-European/local/collective forms have their own evidence, not copied European equivalents.
- Each authority claim distinguishes stated jurisdiction from effective control.
- Offices and holders remain distinct; collective authority and unknown holders remain explicit.
- Each character candidate has sources for identity and offices, and field-specific quality.
- No generated/simulated person is passed as a real historical actor.
- Laws and customary rules preserve local terms and validity; no blanket mapping to parliamentary categories.
- Movements, organizations and institutions are not merged into one category.
- Every non-null claim has a source locator, date, scope and quality.
- Contradictions remain visible; no silent resolution to make a clean dataset.
- Candidate files are not imported into runtime or presented as accepted game data.

## 10. Handoff boundary

This task supplies research evidence only. It does not authorize:
- engine implementation;
- static data integration;
- save schema or migration changes;
- tests/UI/assets/Android/APK changes;
- S1/S15/S16/S17 implementation;
- accepting or closing any S0 gate.

ChatGPT will validate file structure and cross-reference evidence. Claude may independently review the design/research package. The project owner retains acceptance and phase authorization.
