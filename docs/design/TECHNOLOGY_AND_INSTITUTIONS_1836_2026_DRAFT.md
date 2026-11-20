# TECHNOLOGY, INSTITUTIONS AND MILITARY EVOLUTION — 1836–2026

**Project:** Currents of History / Victori3 Mobile  
**Status:** `DESIGN DRAFT — OWNER SCOPE REQUEST RECORDED; NOT YET IMPLEMENTATION-AUTHORIZED`  
**Parent scope:** `docs/roadmap/OWNER_SCOPE_AMENDMENT_1836_2026_SYSTEM_DEPTH.md`  
**Target campaign:** 1836-01-01 through the defined 2026 terminal boundary  
**Design rule:** Learn from the systemic depth of Victoria 3; implement original rules, data, code, text and visual assets.

---

## 1. Purpose and design constraints

This document turns the 1836–2026 scope request into a first-pass design contract for the technology tree, technology adoption, institutions and military modernization.

The tree must not become a collection of date-gated bonuses. Each technology is a capability that requires research capacity and prerequisites, may diffuse unevenly between countries, must be adopted by firms/state/armed forces, and must create observable consequences in production, logistics, political power, welfare or military capability.

**Important distinctions**

- **Discovery / research:** knowledge exists in the world or is developed by a country.
- **Access / diffusion:** a country or organization can obtain the knowledge through education, trade, migration, licensing, espionage, conquest or cooperation.
- **Adoption:** the country has the skills, capital, infrastructure, institutions and inputs required to use it.
- **Deployment:** factories, public agencies or military formations have actually converted equipment, production methods or doctrine.
- **Operational readiness:** the capability is maintained, supplied, staffed, connected and available for use.

A technology being researched must never instantly replace all existing equipment or production methods.

### 1.1 Campaign and historical rules

- The world begins on the approved 1836 start date. All later dates are simulation outcomes, not scripted checkpoints.
- The campaign target is 2026; the precise inclusive/exclusive end boundary must be defined by the calendar/save contract.
- Historical start data should describe what was known, adopted and deployed by each polity at the start date. Future historical events may be used for validation and research, never as mandatory outcomes in Sandbox.
- Technology availability dates are approximate reference windows, not global unlock dates. Historical access and adoption differ by country and sector.
- A country with low literacy, weak fiscal capacity, limited infrastructure or no skilled workforce cannot instantly exploit expensive advanced technology merely because it can fund research.
- Technologies after the 2026 terminal boundary are excluded from the playable tree. Experimental technologies available by 2026 may be represented as low-readiness projects with uncertainty, not guaranteed future breakthroughs.

---

## 2. Era bands

Era bands group the content and change the kinds of strategic choices available. They do not force a country into a new era on a specific date.

| Planning band | Broad transformation | New strategic constraints |
|---|---|---|
| 1836–1870 | Steam industrialization, mechanized textile/metal production, rail and telegraph expansion | Coal, iron, skilled mechanics, capital, rail corridors and administrative reach |
| 1871–1913 | Heavy industry, electrification, chemicals, internal-combustion engines and mass production | Steel, copper, oil, chemical feedstocks, technical education and national infrastructure |
| 1914–1945 | Total war, mechanization, aviation, radio, submarines and early radar | Mass mobilization, fuel, munitions, industrial conversion, logistics and fiscal endurance |
| 1946–1991 | Nuclear age, jet transport, electronics, computing, space systems and global blocs | High-skill labor, research institutions, strategic materials, energy and complex supply chains |
| 1992–2010 | Globalization, container logistics, internet, mobile communications and advanced biotechnology | Global networks, standards, intellectual property, financial systems and resilient supply chains |
| 2011–2026 | AI, robotics, advanced chips, ubiquitous sensors, 5G, drones, cyber operations and new energy systems | Compute, semiconductors, electricity, data, specialized minerals, cyber resilience and institutional governance |

Use scenario-specific and country-specific availability data. No single country should receive every branch at the same time.

---

## 3. Research disciplines and technology tree

The following is a structured first-pass taxonomy. Node IDs are stable data identifiers; display names and translations must live in content data rather than being used as IDs.

### 3.1 Agriculture, food and bioeconomy — `AGR`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| AGR-01 | Improved crop rotation and selective breeding | AGR-00 baseline farming; education | Yield and soil-management improvements |
| AGR-02 | Agricultural implements and mechanized threshing | Metallurgy; workshops | Labor productivity, tool demand |
| AGR-03 | Synthetic fertilizers | Industrial chemistry; nitrogen feedstocks | Yield increase; chemical input and pollution costs |
| AGR-04 | Scientific plant breeding | Research institutions; agronomy | Better yield/resilience, slower adoption where skills are scarce |
| AGR-05 | Tractors and mechanized farming | Internal-combustion engines; steel; fuel | Lower farm labor demand, higher capital/fuel demand |
| AGR-06 | Modern irrigation and water management | Pumps; civil engineering; electric power | Higher output, water/infrastructure costs |
| AGR-07 | Pesticides and crop protection | Chemical industry; regulation | Reduced crop loss with health/environment trade-offs |
| AGR-08 | Green Revolution crop packages | AGR-03/04/06; extension services | Large yield potential, fertilizer/water dependency |
| AGR-09 | Precision agriculture | Sensors; satellite data; computing; connectivity | Input efficiency, specialized skills and capital |
| AGR-10 | Agricultural biotechnology | Genetics; laboratories; regulatory capacity | New crop traits, seed market concentration and biosecurity governance |

### 3.2 Materials, chemistry and industrial processes — `MAT`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| MAT-01 | Industrial iron and improved blast furnaces | Coal; iron ore; skilled works | Lower metal costs, higher coal/ore throughput |
| MAT-02 | Mass steelmaking | MAT-01; process engineering | Rail, ship, machinery and arms production |
| MAT-03 | Industrial chemical synthesis | Chemical laboratories; industrial feedstocks | Fertilizer, dyes, explosives and industrial inputs |
| MAT-04 | Aluminium refining | Electricity; bauxite; chemical processing | Lightweight transport and aircraft materials |
| MAT-05 | Petroleum refining and petrochemicals | Oil extraction; MAT-03 | Fuels, plastics and chemical feedstocks |
| MAT-06 | Industrial plastics and synthetic polymers | MAT-05; chemical engineering | New consumer, industrial and military goods |
| MAT-07 | Alloy steels and advanced heat treatment | Metallurgy; precision machinery | Durable machines, engines, ships and weapons |
| MAT-08 | Semiconductors and integrated circuits | Electronics; ultra-pure materials; research | Computers, telecoms, sensors and advanced weapons |
| MAT-09 | Composite materials and advanced ceramics | Chemical/materials research; precision industry | Aerospace and high-performance industrial equipment |
| MAT-10 | Advanced chip fabrication | MAT-08; ultra-clean facilities; precision equipment; global suppliers | High-end compute and electronics; major capital and supply-chain bottlenecks |
| MAT-11 | Nanomaterials and advanced coatings | Research institutions; precision chemistry | Specialized industrial and medical uses; uncertain costs at early adoption |
| MAT-12 | Critical-mineral processing and recycling | Mining; chemical processes; environmental governance | Reduces import risk, raises recycling and energy requirements |

### 3.3 Energy and power systems — `ENE`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| ENE-01 | Improved steam engines | Iron; coal; machine shops | Mechanized factories and steam transport |
| ENE-02 | High-pressure steam and industrial boilers | MAT-02; precision engineering | More efficient stationary power and shipping |
| ENE-03 | Commercial electricity generation | Electromagnetism; turbines; copper | Electric lighting, motors and grid infrastructure |
| ENE-04 | Grid transmission and distribution | ENE-03; copper; civil engineering | Industrial productivity and urban services |
| ENE-05 | Internal-combustion engines | Petroleum; precision machinery | Road transport, tractors, aircraft and motorization |
| ENE-06 | Large-scale hydroelectricity | Civil engineering; turbines; suitable geography | Low-carbon power with high construction costs |
| ENE-07 | Oil and gas power systems | Petroleum engineering; pipelines | Dispatchable electricity and fuel dependence |
| ENE-08 | Nuclear fission power | Nuclear science; heavy engineering; safety institutions | High-capital electricity, specialized fuel and waste governance |
| ENE-09 | Commercial wind and solar power | Electrical grids; industrial materials | Variable renewable generation and grid-balancing demand |
| ENE-10 | Advanced batteries and storage | Electrochemistry; MAT-08/12 | Grid storage, EVs and portable electronics |
| ENE-11 | Smart grids and demand management | ENE-04/10; sensors; software | Reduced losses, grid flexibility and cyber exposure |
| ENE-12 | Hydrogen and electrolysis systems | Electricity; catalysts; industrial water | Industrial fuel/feedstock with conversion and transport costs |
| ENE-13 | Carbon capture, utilization and storage | Chemical engineering; pipelines; storage geology | Emissions mitigation at capital and energy cost |
| ENE-14 | Advanced nuclear designs and fuel cycles | ENE-08; research and safety capacity | Additional generation options; licensing, security and waste constraints |
| ENE-15 | Fusion research programs | Advanced plasma/materials research; very high funding | Research prestige and uncertain breakthroughs; no automatic commercial power before verified deployment |

### 3.4 Transport, communications and infrastructure — `TRN` / `COM`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| TRN-01 | Rail engineering | MAT-02; surveying; steam power | Rail capacity, market access and troop movement |
| TRN-02 | Steel steamships | MAT-02; shipyards; coal | Larger trade and naval capacity |
| TRN-03 | Telegraph networks | Electrical science; copper; line construction | Faster diplomatic, military and market information |
| TRN-04 | Internal-combustion road vehicles | ENE-05; rubber; road networks | Motorized logistics and civilian mobility |
| TRN-05 | Modern port and canal engineering | Civil engineering; steel/concrete | Higher trade and naval throughput |
| TRN-06 | Radio communication | Electronics; electrical industry | Military coordination and mass communication |
| TRN-07 | Commercial aviation | Engines; aerodynamics; airports | Faster passenger/cargo movement and strategic air reach |
| TRN-08 | Container shipping and intermodal logistics | Port cranes; standardized containers; road/rail links | Lower handling costs and global trade integration |
| TRN-09 | Jet transport and advanced air traffic control | Turbine engines; radar; electronics | Long-distance transport and modern air logistics |
| TRN-10 | Satellite navigation and positioning | Space systems; precision clocks; receivers | Navigation, timing and logistics efficiency |
| TRN-11 | High-speed rail and modern transit | Advanced materials; power; signaling | High-capacity passenger mobility and urban integration |
| TRN-12 | Electric mobility and charging networks | Batteries; power grids; power electronics | Reduced liquid-fuel demand and new grid load |
| TRN-13 | Automated logistics and warehouse robotics | Robotics; sensors; software | Higher throughput, lower routine labor demand |
| COM-01 | Telephone networks | Electrical components; switching systems | Faster coordination and service-sector growth |
| COM-02 | Broadcast radio and television | Electronics; transmitters; mass production | National information reach and cultural influence |
| COM-03 | Transistors and microelectronics | Semiconductor materials; precision manufacturing | Compact electronics and computing |
| COM-04 | Computer networking | Digital computers; standards; telecoms | Data services and cross-border dependence |
| COM-05 | Public internet and commercial software | Network infrastructure; computing; institutions | Digital markets, productivity and cyber risk |
| COM-06 | Mobile broadband (3G/4G) | Cellular networks; semiconductors | Mobile services and digital inclusion |
| COM-07 | Cloud and data-center infrastructure | Computing; fiber networks; reliable power | Scalable digital production and electricity demand |
| COM-08 | 5G networks | Advanced radio; fiber/backhaul; spectrum governance | Low-latency connectivity and connected industry |
| COM-09 | Satellite broadband and Earth-observation services | Satellite manufacturing; launch services; ground stations | Remote connectivity, weather, mapping and security capabilities |
| COM-10 | 6G research and next-generation radio experiments | Advanced materials; AI; spectrum research | Research capacity only by 2026; do not grant mass-deployment effects without evidence |

### 3.5 Science, health and human capital — `SCI` / `HLT`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| SCI-01 | Modern scientific method and research academies | Literacy; universities; printing | Raises research capacity and technical diffusion |
| HLT-01 | Germ theory and sanitation engineering | Medical research; urban administration | Lower epidemic burden and mortality |
| HLT-02 | Vaccination programs | Medical institutions; cold chain; public trust | Reduced disease risk, public-health capacity |
| HLT-03 | Antibiotics and modern pharmaceuticals | Chemistry; microbiology; laboratories | Improved survival and workforce health |
| HLT-04 | Modern medical imaging and diagnostics | Electronics; physics; hospitals | Better diagnosis and health outcomes with high capital cost |
| HLT-05 | Public health surveillance and epidemiology | HLT-01/02; statistics; administration | Earlier outbreak detection and response |
| HLT-06 | Modern surgical and critical care | Medical education; equipment; reliable power | Reduced mortality, expensive skilled services |
| HLT-07 | Molecular biology and genetic analysis | Advanced laboratories; computing | Research and diagnostics capability |
| HLT-08 | Genomics and biotechnology platforms | HLT-07; MAT-08; data infrastructure | New therapies and agricultural applications |
| HLT-09 | mRNA and platform vaccine technology | HLT-08; biomanufacturing; regulatory systems | Faster vaccine platform response; manufacturing constraints |
| SCI-02 | Digital research and simulation | COM-05/07; advanced education | Higher productivity in science and engineering |
| SCI-03 | Quantum information research | Advanced physics; specialized laboratories | Research/early capability only; do not assume broad commercial advantage by 2026 |

### 3.6 Computing, AI and automation — `DIG` / `AUT`

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| DIG-01 | Mechanical calculation and statistics | Precision engineering; mathematics | Administrative and scientific throughput |
| DIG-02 | Electronic computers | Transistors; electrical power; technical workforce | Automation of calculation and state administration |
| DIG-03 | Mainframe and industrial control systems | DIG-02; software; electronics | Production planning and large institutions |
| DIG-04 | Microprocessors and personal computing | COM-03; mass electronics | Productivity, digital services and new markets |
| DIG-05 | Enterprise software and databases | DIG-04; networks; trained workforce | Firm and government coordination |
| DIG-06 | Internet platforms and e-commerce | COM-05; payment systems; logistics | Digital trade, platform concentration and data regulation |
| DIG-07 | Cloud computing and distributed systems | COM-07; cybersecurity; reliable power | Compute capacity and digital infrastructure investment |
| DIG-08 | Statistical machine learning | Computing; data; mathematics | Forecasting, optimization and automation |
| DIG-09 | Deep learning and computer vision | Accelerators; large datasets; research | Industrial inspection, recognition and specialized AI |
| DIG-10 | Generative and multimodal AI systems | Advanced compute; data governance; software | Knowledge-work productivity with labor, trust and compute trade-offs |
| DIG-11 | AI-assisted scientific and industrial R&D | DIG-10; research institutions; specialized data | Potential research productivity; uncertain and uneven realization |
| AUT-01 | Mechanized production control | Electrical machinery; process engineering | Factory throughput and labor substitution |
| AUT-02 | Industrial robots | Sensors; control systems; precision manufacturing | Higher capital intensity and skilled maintenance demand |
| AUT-03 | Collaborative and mobile robotics | AI; sensors; reliable networking | Flexible automation in factories and logistics |
| AUT-04 | Autonomous decision-support systems | DIG-08/10; data; oversight institutions | Productivity and governance/accountability trade-offs |

### 3.7 Land, naval and air military technology — `MIL`

Military nodes unlock capabilities and production recipes; actual force readiness depends on procurement, trained personnel, equipment stocks, doctrine, infrastructure and logistics. Do not treat researched technology as instantly deployed national strength.

| Node ID | Capability | Main dependencies | Gameplay effects |
|---|---|---|---|
| MIL-L01 | Rifled and breech-loading firearms | Precision metalworking; industrial arms production | Infantry range/firepower and ammunition demand |
| MIL-L02 | Smokeless powder and modern cartridges | MAT-03; chemical industry | Changes ammunition and artillery supply |
| MIL-L03 | Machine guns and modern field artillery | Steel; precision manufacture; doctrine | Firepower, logistics and training demands |
| MIL-L04 | Rail mobilization and staff systems | TRN-01; administration | Faster strategic concentration with rail bottlenecks |
| MIL-L05 | Motorized logistics and armored vehicles | ENE-05; MAT-02/07; fuel | Operational mobility, fuel and maintenance burdens |
| MIL-L06 | Mechanized combined-arms doctrine | MIL-L05; communications; staff education | Coordination among infantry, armor, artillery and air support |
| MIL-L07 | Radar-enabled air defense | Electronics; radio; power networks | Detection and defensive readiness |
| MIL-L08 | Guided conventional weapons | Sensors; electronics; precision manufacturing | Higher precision, high unit cost and specialized stocks |
| MIL-L09 | Modern integrated air defense | Radar; guided weapons; command networks | Layered defense, maintenance and interoperability demands |
| MIL-L10 | Uncrewed aerial systems | Sensors; batteries/engines; communications | Reconnaissance and strike options; counter-UAS pressure |
| MIL-L11 | Networked command, control and ISR | COM-05; satellites; secure communications | Situational awareness and coordination; cyber/electronic vulnerability |
| MIL-L12 | Electronic warfare and spectrum operations | Advanced electronics; signal processing | Degrades or protects information links; contested-spectrum effects |
| MIL-L13 | Cyber defense and cyber operations | DIG-05/07; trained operators; institutions | Disruption, intelligence and resilience at strategic abstraction |
| MIL-N01 | Steel-hulled steam fleets | MAT-02; ENE-01; shipyards | Modern naval construction and coal logistics |
| MIL-N02 | Torpedoes and submarines | Precision engineering; chemical/electrical systems | Sea denial and convoy risk |
| MIL-N03 | Dreadnought-era capital ships and naval gunnery | Heavy industry; fire-control systems | Fleet power with very high construction/maintenance cost |
| MIL-N04 | Naval aviation and aircraft carriers | MIL-A01; shipbuilding; doctrine | Extended fleet air reach and carrier logistics |
| MIL-N05 | Sonar and anti-submarine warfare | Electronics; acoustic research | Detection and convoy protection |
| MIL-N06 | Nuclear naval propulsion | Nuclear engineering; safety institutions | Long-endurance naval operations, high cost and specialized infrastructure |
| MIL-N07 | Guided-missile naval systems | Electronics; radar; guided weapons | Modern area defense and long-range strike capability |
| MIL-A01 | Military aviation | ENE-05; aerodynamics; manufacturing | Reconnaissance and tactical air support |
| MIL-A02 | Strategic bombers and jet fighters | Turbine engines; advanced materials | Long-range air power and high fuel/maintenance costs |
| MIL-A03 | Guided air-to-air and air-to-surface weapons | Sensors; electronics; precision industry | Modern aerial combat and precision strike |
| MIL-A04 | Stealth and low-observable design | Advanced materials; computing; precision manufacturing | Detection and survivability trade-offs; extremely high cost |
| MIL-A05 | Uncrewed aerial reconnaissance and strike systems | Sensors; secure links; autonomy | Persistent surveillance and remotely operated capabilities |
| MIL-S01 | Nuclear fission weapons and deterrence | Nuclear science; industrial capacity; state institutions | Strategic deterrence, escalation risk and diplomatic consequences |
| MIL-S02 | Ballistic missiles and strategic delivery systems | Rocket engineering; advanced materials | Longer-range strategic strike and warning requirements |
| MIL-S03 | Space-based reconnaissance and early warning | Space systems; sensors; secure networks | Strategic information and warning capability |
| MIL-S04 | Satellite communications and positioning for defense | COM-09; secure terminals | Navigation, coordination and dependence on space infrastructure |
| MIL-S05 | Integrated multi-domain command systems | MIL-L11; MIL-N07; MIL-A03; space support | Joint coordination with high interoperability and cyber requirements |

### 3.8 Research-only and uncertain capabilities by 2026

Some technology areas should exist as research projects rather than mature economic/military unlocks:

- Commercial nuclear fusion: research funding, scientific prestige and uncertain readiness; do not grant a cheap, scalable electricity good in 2026.
- Broad commercial quantum computing: research capability and specialized institutions, not universal industrial productivity.
- 6G: research and standards work; widespread operational deployment is not assumed by the 2026 endpoint.
- Fully autonomous general-purpose military formations: not a general deployment unlock; model constrained automation and human/institutional control.
- Large-scale carbon removal and low-emissions industrial processes: model project pipelines, cost, energy and policy uncertainty; do not assume announced projects have reached operating capacity.

---

## 4. Research, access, diffusion and adoption mechanics

### 4.1 Research capacity

Research output should be a function of:
- Number and quality of universities, academies, laboratories and technical schools.
- Literate and appropriately skilled population cohorts.
- Public and private funding, economic scale and fiscal health.
- Political support for education/science and institutional stability.
- Access to scientific networks, publications, patents, equipment and skilled migration.

Research points are not a substitute for money, materials or industrial capacity. High-level research can be funded but remain unused without infrastructure and trained staff.

### 4.2 Diffusion channels

A country may acquire or improve access through:
1. Trade in machinery, equipment, books, software and technical goods.
2. Foreign direct investment and joint ventures.
3. Skilled migration, diaspora and returning students.
4. Universities, scientific exchange and licensing.
5. Industrial espionage or military intelligence represented at strategic abstraction.
6. Technology transfer through alliances, security partnerships or international programs.
7. Captured equipment and postwar knowledge transfer, subject to integration capacity.

Diffusion is probabilistic or progress-based and requires a legal/economic/administrative channel. It must not copy an entire foreign technology tree instantly.

### 4.3 Adoption readiness

For every technology, define:
- Minimum technical workforce/skill level.
- Required production inputs and strategic materials.
- Required infrastructure (power, roads, ports, rail, broadband, laboratories, etc.).
- Capital and financing threshold.
- Institutional/regulatory conditions.
- Maintenance and operational cost.
- Compatibility with existing production/equipment.
- Environmental, health, safety or social trade-offs where relevant.

A country may possess knowledge but have low adoption, or adopt a technology in one region/sector while the remainder of the country still uses older methods.

### 4.4 Deployment and replacement

- Buildings change production methods only after investment, input availability, workforce training and a transition period.
- Military formations replace equipment only through procurement, production, maintenance and training. Old equipment remains in stock or reserve until retired, lost or exported.
- Infrastructure requires construction time, budget, materials and labor.
- State agencies must have trained staff and administrative capacity to enforce regulations or operate services.
- New systems can fail or perform below potential when maintenance, energy, components or trained staff are missing.

### 4.5 Technology effects are multidimensional

A technology may increase productivity and create negative externalities simultaneously:
- Tractors raise agricultural output but reduce demand for farm labor and increase fuel/repair needs.
- Synthetic fertilizer raises yields but increases chemical and energy dependence and can create environmental costs.
- Automation raises throughput but changes employment, skills, wages, capital concentration and political influence.
- Digital networks increase coordination and service productivity but introduce cyber risk, privacy/regulation issues and infrastructure dependencies.
- Nuclear systems provide strategic deterrence but increase fiscal, diplomatic, safety and escalation burdens.
- Drones and networked sensors expand reconnaissance and precision options but also increase demand for electronics, secure links, countermeasures and trained operators.

---

## 5. Institutions are a separate progression system

Institutions must not be reduced to research technologies. They are laws, organizations, administrative capabilities, budgets, trained personnel, legitimacy and enforcement reach.

### 5.1 Institutional domains

| Domain | 19th-century transitions | 20th-century transitions | 21st-century transitions |
|---|---|---|---|
| State capacity | Professional civil service, census, taxation and standardized administration | Welfare administration, planning agencies, central banks and regulatory states | Digital public services, data governance, cyber resilience and automated administration |
| Political participation | Constitutional systems, parliamentary expansion, organized parties and suffrage movements | Mass franchise, mass parties, labor movements and postcolonial state formation | Digital participation, platform influence, disinformation resilience and privacy protections |
| Labor and welfare | Factory regulation, unions, workplace safety and early social insurance | Labor rights, pensions, public health, unemployment protection and broad welfare systems | Platform/gig work regulation, reskilling, automation adjustment and portable protections |
| Education and science | Compulsory/basic education, universities and technical institutes | Mass secondary/tertiary education, research universities and national R&D programs | Lifelong learning, digital access, STEM/technical capacity and AI literacy |
| Health | Sanitation boards, vaccination and professional medical services | Public health systems, hospitals, insurance and epidemiological institutions | Biotechnology oversight, digital health, pandemic preparedness and data protection |
| Finance and regulation | National currencies, public debt administration and commercial banking | Central banking, securities regulation, deposit protection and development finance | Digital payments, fintech oversight, systemic cyber-risk and cross-border capital supervision |
| Industry/environment | Factory inspections and infrastructure authorities | Environmental regulation, energy ministries and industrial standards | Carbon pricing, grid regulation, critical-mineral policy, circular economy and AI safety governance |
| Security and defense | Professional armies, general staffs, logistics ministries | Joint commands, civil defense, intelligence oversight and nuclear command institutions | Cyber agencies, space-domain coordination, autonomous systems oversight and resilience policy |

### 5.2 Institutional implementation

Each institution should have:
- Legal basis and government type compatibility.
- Establishment and maintenance cost.
- Administrative staff and skill requirements.
- Coverage/reach by state, region or population group.
- Enforcement/effectiveness level separate from nominal existence.
- Support/opposition from political actors and affected POP cohorts.
- Effects on public services, rights, productivity, legitimacy and fiscal burden.
- Reform path, implementation delay, resistance and possible rollback.

A law passed in the capital does not instantly create a competent nationwide institution.

### 5.3 International institutions and treaty regimes

Represent international institutions as diplomatic organizations with:
- Founding treaty, members and accession/withdrawal dates.
- Governance structure and voting/decision rules.
- Membership obligations and financial contributions.
- Enforcement limits, dispute mechanisms and sanctions or penalties where modeled.
- Relationships with member sovereignty and existing bilateral treaties.

Do not model all international organizations as identical alliances or as global governments.

---

## 6. Military modernization is a combined economy–technology–institution system

### 6.1 Force-generation chain

`Research → doctrine and standards → industrial recipes → procurement budget → equipment production/import → training and integration → unit readiness → operations → maintenance/replacement`

Every stage can be constrained by shortages, debt, weak institutions, sanctions, transport, low literacy, corruption, industrial bottlenecks or strategic geography.

### 6.2 Branches and organizations

The armed forces should support, where historically and politically applicable:
- Land forces: infantry, cavalry, artillery, armor, mechanized forces, engineers, air defense, logistics and support formations.
- Naval forces: surface fleets, submarines, naval aviation, amphibious and maritime logistics formations.
- Air forces: fighters, bombers, transport, reconnaissance, air defense and uncrewed systems.
- Strategic capabilities: nuclear forces, missile forces, space support, cyber/electronic operations and strategic intelligence.

Not every country should unlock, afford or deploy every branch. A small state may focus on territorial defense, coastal denial, reserves, alliances or asymmetric capabilities. A major power may sustain a wider force only if its economy and institutions support it.

### 6.3 Military equipment inventory

Equipment should be modeled as actual stock categories at useful aggregation:
- Small arms and ammunition.
- Artillery and shells.
- Vehicles, engines, fuel and spare parts.
- Armor and specialized components.
- Aircraft, engines, guided munitions and maintenance parts.
- Ships, propulsion, sensors, missiles and naval stores.
- Radios, radar, computers, secure communications and sensors.
- Drones, batteries, ground stations and control systems.
- Medical, engineering, logistics and transport supplies.

Avoid creating heavyweight objects for every individual weapon. Use equipment batches/stock pools linked to formations and depots, with provenance/age/condition where needed.

### 6.4 Doctrine, command and readiness

Doctrine is not a technology unlock. It requires officer education, exercises, organizational reform, equipment compatibility, communications and supply systems. Readiness is derived from:
- Personnel trained and assigned.
- Equipment quantity, quality and serviceability.
- Ammunition/fuel/food/medical supply.
- Command organization and communication.
- Training, morale, cohesion and operational experience.
- Strategic transport and depot access.

A state with advanced designs but no industrial base or training should not have an elite modern force.

### 6.5 Military balance and diplomacy

Modernization changes:
- Procurement costs and military expenditure.
- Arms imports/exports and sanctions exposure.
- Alliances, guarantees, arms-control treaties and security dilemmas.
- Deterrence, escalation, mobilization and war support.
- Domestic taxation/debt and welfare trade-offs.
- Civilian industry conversion and labor demand.

Use high-level strategic simulation; do not turn the game into a tactical manual or expose operational instructions.

---

## 7. Data model contract — first proposal

Use normalized registries and references rather than embedded free-text labels.

### 7.1 Technology definition

Suggested fields:

- `id`: stable ID such as `DIG-10`.
- `nameKey`, `descriptionKey`: localization keys.
- `discipline`, `subBranch`, `eraBand`.
- `earliestKnownFrom`, `referenceWindowStart`, `referenceWindowEnd`: optional reference metadata, not universal unlock conditions.
- `prerequisiteTechIds[]`, `prerequisiteInstitutionIds[]`, `prerequisiteResourceIds[]`.
- `researchCost`, `researchWork`, `uncertainty`, `maturityLevel`.
- `requiredSkills`, `requiredInfrastructure`, `requiredCapital`.
- `unlocksProductionMethods[]`, `unlocksBuildingTypes[]`, `unlocksGoods[]`, `unlocksEquipmentTypes[]`, `unlocksDoctrineOptions[]`.
- `effects[]`: typed modifier/effect definitions; no arbitrary script execution.
- `sourceRefs[]`, `confidence`, `lastReviewed`.

### 7.2 Country technology state

Suggested fields:

- `researchedTechIds[]` or normalized progress records.
- `researchProgressByTech`, `researchQueue`.
- `accessChannels[]` and access level.
- `adoptionBySector` and `deploymentByFormation`.
- `institutionalReadiness`, `industrialReadiness`, `workforceReadiness`.
- `legacyEquipmentShare`, `transitionCost`, `maintenanceBurden`.

A single `techLevel` scalar is insufficient.

### 7.3 Institution state

Suggested records:

- Institution definition registry with legal prerequisites and effects.
- Country institution instance: legal status, funding, staffing, reach, effectiveness, establishment progress and legitimacy.
- Regional service/coverage metrics where the underlying data supports them.
- Historical validity and source provenance for initial conditions.

### 7.4 Military organization and equipment

Suggested registries:

- Formation types, unit roles, equipment types, doctrine options and branch organization.
- Country force-structure records and formation references.
- Equipment stock pools by country/formation/depot and condition/age bands.
- Recruitment, training, procurement and maintenance queues.
- Logistics network links and transport capacity.
- Operations/battles that reference formations, commanders, terrain, supplies and deterministic resolution inputs.

Do not migrate the present aggregate `manpower/quality/morale/supply` fields into fabricated historical regiments, commanders or equipment stocks. Any migration must mark unknown composition as unknown and preserve aggregate legacy values until a separately approved transition.

---

## 8. Validation scenarios

At least the following scenario classes should be used when implementation is authorized:

1. **Industrial adopter vs. agrarian state:** technology access alone does not erase workforce, capital or infrastructure differences.
2. **Late industrializer:** imported machinery helps but requires ports/rail, technicians, finance and imported inputs.
3. **Mass conscription under industrial war:** recruitment, ammunition, food, rail capacity, casualties, debt and political legitimacy interact.
4. **Postwar reconstruction:** military conversion, public finance, housing, transport and education compete for resources.
5. **Cold War arms race:** nuclear/space/jet/electronics investment competes with consumer welfare and foreign trade; deterrence affects diplomacy.
6. **Postcolonial industrial policy:** sovereignty, resource exports, education, infrastructure, institutional capacity and foreign investment create alternative paths.
7. **Globalized supply shock:** semiconductor, energy or shipping disruption propagates into production, employment and military readiness.
8. **Digital/AI adopter:** compute, electricity, data, education and regulation determine adoption; automation changes occupations and political coalitions.
9. **Small-state defense:** alliances, coastal geography, reserves, cyber resilience and selective procurement can substitute for matching a great power's total force.
10. **Sandbox divergence:** the same technology and institution rules produce plausible alternate trajectories without scripting the known future.

Required tests include prerequisite validation, deterministic research progress, diffusion caps, partial adoption, production input balance, equipment replacement accounting, treaty/institution compatibility, save/load at era boundaries and multi-country regression.

---

## 9. Open decisions before implementation

1. Define the 2026 terminal date and whether the final day is simulated inclusively.
2. Choose the new canonical logical clock and migration from the monthly legacy tick only after separate save/clock design approval.
3. Determine the desired scale of military formations and POP cohorts through target-device profiling; do not create one object per person or weapon without measured capacity.
4. Define how research points and investment are normalized across population and country sizes to avoid runaway snowballing.
5. Decide how to represent disputed borders, colonial status, de facto control and contested recognition with temporally valid source data.
6. Set country-specific historical adoption levels, uncertainty and source confidence; a shared global tech list does not imply identical starting knowledge.
7. Define which contemporary organizations/treaties are modeled as actors, memberships or clauses and what the simulation abstraction can actually enforce.
8. Build a licensing/provenance workflow for all new history data, images, maps, biographies and current political/institutional records.

---

## 10. Research and source register

These sources support contemporary technology-domain selection and current adoption context. They do not by themselves establish every historical invention date or country-specific adoption level; those require dedicated historical sources and data records before content integration.

- **IEA, Energy Technology Perspectives 2026 — Executive Summary.** Covers current energy-technology industries and deployment constraints including hydrogen, CCUS, near-zero-emissions steel, electrolysers, and the early-stage status/uncertainty of fusion and other frontier technologies.  
  https://www.iea.org/reports/energy-technology-perspectives-2026/executive-summary
- **ITU, Measuring Digital Development: Facts and Figures 2025.** Global and regional connectivity indicators; the 2025 report describes widespread but unequal mobile broadband, 5G coverage and persistent affordability/access gaps.  
  https://www.itu.int/itu-d/reports/statistics/facts-figures-2025/
- **Stanford HAI, AI Index Report 2026.** Current evidence on AI capability, industrial production, organizational adoption, compute investment and economic effects. Use to calibrate the contemporary AI-era content, not to assume every country has frontier capability.  
  https://hai.stanford.edu/ai-index/2026-ai-index-report
- **SIPRI, Trends in World Military Expenditure, 2025 (April 2026).** Current comparative military expenditure and regional burden data; useful for defense-economy calibration, not a complete order-of-battle source.  
  https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025
- **SIPRI Yearbook 2026 — Summary.** Wider evidence on military expenditure, arms, security and international stability for the contemporary scenario baseline.  
  https://www.sipri.org/yearbook/2026


### 10.1. Contemporary calibration snapshot — latest complete observations available in 2026

The playable terminal year is 2026, but a scenario must not pretend that full-year 2026 statistics are already known when the latest complete comparable observation is for 2025. Use the following as a **source-backed contemporary calibration snapshot** and store each value with its observation year, publication date, scope and uncertainty. Do not translate these global aggregates directly into flat country bonuses.

| Area | Latest source-backed observation | Simulation-design implication |
|---|---|---|
| Clean-energy markets | IEA reports a combined clean-energy technology/fuel/material market value close to USD 1.2 trillion in 2025; it notes rapid deployment but substantial policy and supply-chain uncertainty. | Represent industrial policy, manufacturing capacity, capital cost, grid bottlenecks and strategic supply chains. A published target or announcement is not commissioned capacity. |
| Energy supply chains | IEA reports highly concentrated steps across key clean-energy supply chains: China accounts for 60–85% of production capacity in key chains and over 95% in some production steps; some CCUS and near-zero-emissions material projects remain pre-final-investment-decision. | Model critical-mineral processing, components, refining, supplier concentration, export restrictions, substitution and stockpiles as network bottlenecks rather than treating "green technology" as a single unlock. |
| Digital connectivity | ITU 2025 estimates almost three-quarters of the global population are online, 2.2 billion remain offline, and 5G reaches more than half the global population, with coverage concentrated in high-income countries. | Country and regional adoption must be uneven; distinguish coverage, affordability, device ownership, quality, skills and actual productive use. |
| AI research and adoption | Stanford HAI's 2026 AI Index reports industry produced over 90% of notable frontier AI models in 2025; 88% of surveyed organizations reported AI use in at least one business function, while agent deployment remained early/single-digit in most functions. | Separate frontier R&D concentration from broad organizational adoption. Model compute, electricity, skills, data, enterprise integration and regulatory capacity separately; do not equate AI access with autonomous-agent deployment. |
| Industrial robotics | Stanford HAI reports China accounted for 54% of global industrial robot installations in 2024. | Robot adoption is spatially and industrially concentrated; require capital, skilled technicians, local suppliers and industrial structure. Do not give all countries the same automation multiplier. |
| Military expenditure | SIPRI estimates world military expenditure reached USD 2.887 trillion in 2025, up 2.9% in real terms; the global military burden was 2.5% of GDP. | Military modernization must compete with welfare, infrastructure and debt capacity; country spending is not equivalent to effective deployable capability. Use expenditure as one input, never as a complete order-of-battle dataset. |

**Interpretation safeguards**

- These observations refer to different years and statistical populations (for example, 2024 robot installations and 2025 military expenditure); preserve the observation year rather than relabeling every value as a 2026 fact.
- The Stanford AI organizational adoption statistic is a surveyed measure, not a census of every firm or government agency. The digital connectivity figures are global aggregates, not per-country coverage data.
- Global market value, AI model output and military expenditure cannot be compared as if they measured the same thing or had the same denominator.
- The simulation should import country-level values only from the source's country tables or other validated sources. Where no country-level observation exists, record the value as missing/estimated with an explicit method and confidence interval rather than allocating the global average to every country.
- These are calibration anchors for a sourced contemporary scenario, not required historical outcomes. Sandbox should remain free to diverge when the world state leads to different investment and institutions.

### 10.2. Verified source links and date boundaries

- **IEA — Energy Technology Perspectives 2026, published 26 March 2026.** Executive summary and full report coverage of deployment, manufacturing, trade, supply-chain resilience and competitiveness.  
  https://www.iea.org/reports/energy-technology-perspectives-2026/executive-summary
- **ITU — Measuring Digital Development: Facts and Figures 2025.** Global/regional connectivity estimates, 2.2 billion people offline and uneven 5G coverage.  
  https://www.itu.int/pub/D-IND-ICT_MDD-2025-3/
- **Stanford HAI — The 2026 AI Index Report.** AI R&D, technical performance, economy, science, medicine, education, policy and governance; use its underlying tables and methodology before creating country-level data.  
  https://hai.stanford.edu/ai-index/2026-ai-index-report
- **SIPRI — Trends in World Military Expenditure, 2025, published April 2026.** Annual expenditure estimates and regional/national comparisons.  
  https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025
- **SIPRI — Yearbook 2026.** Reference overview of international security, weapons and technology, military expenditure, arms trade, conflicts and conflict management.  
  https://www.sipri.org/yearbook/2026

For 1836–2026 historical research, add source records by topic and country: industrial history, energy, agricultural change, public health, political institutions, military organization/equipment, international treaties, science and education. Record publication, author/organization, URL, retrieval date, covered place/time range, license/usage rights, confidence and the exact claims supported. Do not convert an unsourced timeline into shipped game content.

---

## 11. Status and gate boundary

This document is a product design draft linked to the owner's 1836–2026 request. It is not a claim that these systems already exist and is not an implementation authorization.

At the recorded project state, S0-B7 remains `IN_PROGRESS`; independent review and owner phase acceptance are pending; overall S0 remains `PARTIAL — NOT COMPLETE`; the bounded S1-entry package remains `NOT_TESTED`; S1 remains `NOT AUTHORIZED`. No gameplay, engine, clock runtime, save schema, migration, shipped data, content, asset, signing or APK-install changes are authorized by this draft.
