# HY-03 — Company and late-industrial technology image source survey (2026-11-22)

Branch: `ccr-b27f3fb8-epfpd6`  
Reply target: MSG-067. This is a first-pass source survey, not an asset-ingestion approval. No binary image was downloaded or committed, and no selection manifest was changed.

## Scope verified from repository data

- `historical_data/companies/company_kinds.json`: exactly **24** company kinds have non-empty `buildings`; this matches the HY-03 company scope.
- `historical_data/technologies/technologies.json`: **32** technologies have `historical_year` between 1880 and 1914 inclusive.
- Existing `historical_data/assets/illustration_sources/loc_selection.json` already covers many related building/technology subjects. Reusing an image across company kinds is possible only where it genuinely depicts the same industrial activity; avoid falsely presenting one generic factory as a unique historical company.

## Rights gate and technical caveat

The LOC candidates below are only retained where the catalogue displays **“No known restrictions on publication”** and the work/date is compatible with the project's 95-year cutoff (publication before 1931 for this 2026 review). This is the project's operational screening rule, not a universal legal guarantee; final asset ingestion should preserve the LOC rights note and source attribution.

The search-result catalogue records do not expose pixel dimensions for every selected TIFF. Therefore this report marks dimensions as **not verified from catalogue text** rather than inventing values. The TIFF/original download metadata must be inspected before the image can pass the 1,600×900 source-art gate. Stereo cards should use the full card or one eye only as appropriate; do not stretch them to 16:9.

## A. Twenty-four active company kinds

### Verified high-quality source leads

| Source key | Exact title / item | Creator, date, repository | Rights shown | Original / download | Best-fit company kinds |
|---|---|---|---|---|---|
| C1 | [Machine shop, the Westinghouse Air-Brake Co., Wilmerding, Pa.](https://www.loc.gov/pictures/item/2016805390/) | Detroit Publishing Co.; c.1905; Library of Congress (LOC) | No known restrictions on publication | TIFF 20.0 MB / 159.6 MB options; digital original hdl.loc.gov/loc.pnp/det.4a12748; pixel dimensions not stated in catalogue text | machine_tool_maker; precision_parts_manufacturer; engine_manufacturer; steam_engine_foundry |
| C2 | [Factory workers assembling engines at Leland & Faulconer Manufacturing Co., Detroit, Mich.](https://www.loc.gov/item/2016816767/) | Detroit Publishing Co.; c.1903; LOC | No known restrictions on publication | Digital original LC-DIG-det-4a26764; dimensions not stated in catalogue text | engine_manufacturer; diesel_engine_maker (context only; engine is not proven diesel); mass_production_firm |
| C3 | [Homestead Steel Works, Homestead, Pa.](https://www.loc.gov/item/2016802408/) | Detroit Publishing Co.; 1900–1910; LOC | No known restrictions on publication | Six-part panorama, original sections include det.4a10142 / det.4a10143 / det.4a10141 / det.4a10139 / det.4a10138 / det.4a10137; dimensions not stated in catalogue text | integrated_steelworks; specialty_steelmaker; heavy_casting_firm; open_hearth_steelworks; aluminium_smelter only as a generic heavy-metalworks stand-in (not a literal aluminium image) |
| C4 | [Removing ingot slab from furnace, Homestead Steel Works](https://www.loc.gov/item/2016814565/) | Detroit Publishing Co.; 1900–1910; LOC | No known restrictions on publication | Digital original det.4a22874; dimensions not stated in catalogue text | integrated_steelworks; open_hearth_steelworks; heavy_casting_firm |
| C5 | [Coke ovens and their smoke consumers, Monongahela River, Pittsburg](https://www.loc.gov/item/2007678126/) | Keystone View Company; 1905; LOC | No known restrictions on publication | Digital original stereo.1s15277; dimensions not stated in catalogue text | coke_furnace_works |
| C6 | [Women and machinery in New England cotton mill](https://www.loc.gov/pictures/item/2012647904/) | Bain News Service; c.1900; LOC | No known restrictions on publication | Digital file cph.3a41760; dimensions not stated in catalogue text | mechanised_textile_mill; sewing_machine_maker only as textile-machinery context, not factory evidence |
| C7 | [Bird's eye view of cotton mill at Manchester, N.H.](https://www.loc.gov/pictures/item/2007662555/) | Alphonso H. Sanborn; c.1903; LOC | No known restrictions on publication | TIFF 6.9 MB; source pan.6a14021; dimensions not stated in catalogue text | mechanised_textile_mill |
| C8 | [Long distance telephone switchboard](https://www.loc.gov/pictures/item/2017651466/) | Sears, Roebuck & Co.; 1900–1910; LOC | No known restrictions on publication | Digital original stereo.1s08725; dimensions not stated in catalogue text | Not one of the 24 building-backed company kinds; reserve for later technology illustration telephone/telegraphic exchanges |

### Mapping all 24 company kinds (source reuse is explicit)

| Company kind | Best source key | Fit assessment |
|---|---|---|
| agricultural_implements_maker | C1 | Machine shop context; not a dedicated plough works. Search further for a specialist maker. |
| agricultural_machine_maker | C1 | General machine shop only; seek reaper works if possible. |
| aluminium_smelter | C3 | Heavy industry only; **not** a verified aluminium plant. Do not caption as aluminium. |
| coke_furnace_works | C5 | Direct subject match. |
| diesel_engine_maker | C2 | Engine factory, but diesel type not established; generic engine-factory depiction only. |
| engine_manufacturer | C2 | Direct engine foundry/machine-shop match. |
| harvester_manufacturer | C1 | Generic machine shop; seek dedicated harvester factory. |
| heavy_casting_firm | C4 | Furnace/ingot handling is directly relevant to heavy casting. |
| high_speed_rail_operator | Existing railway station/yard images in current LOC selection | Infrastructure/operator context, not an operator's office; source IDs already exist in `loc_selection.json`. |
| integrated_steelworks | C3 | Direct steelworks match. |
| long_distance_rail_operator | Existing railway yard/railway images in current LOC selection | Infrastructure context; do not imply this specific yard is a long-distance operator HQ. |
| machine_tool_maker | C1 | Direct machine-shop context; maker identity is Westinghouse Air-Brake, not a machine-tool specialist. |
| mass_production_firm | C2 | Engine assembly/foundry, appropriate as mass-production context but assembly-line method not proven. |
| mechanised_textile_mill | C6 or C7 | Direct cotton mill match. |
| open_hearth_steelworks | C4 | Furnace scene at Homestead Steel Works; source record does not itself label furnace type as open-hearth in this item. Pair with existing LOC open-hearth selection if that is more exact. |
| precision_parts_manufacturer | C1 | Machine shop; precision-parts specialization not established. |
| railway_operator | Existing railway yard/railway images in current LOC selection | Use current rail assets; not a unique company facility. |
| sewing_machine_maker | C1 | Generic machine shop only; insufficient to depict a sewing-machine maker specifically. |
| specialty_steelmaker | C3 | General steelworks only; no specialty-alloy evidence. |
| steam_engine_foundry | C1 or C2 | General machinery/engine shop; source doesn't identify steam engine output. |
| synthetic_fibre_producer | C6 | **Not suitable**: 1900 cotton mill predates commercial synthetic fibres. Keep unfilled; do not relabel cotton as synthetic fibre. |
| tractor_manufacturer | C1 or C2 | General machine/engine shop only; no tractor product shown. Seek a post-1910 tractor works photo. |
| turbine_manufacturer | C1 | Generic machine shop only; no turbine shown. Seek turbine factory or power-house machinery. |
| wrought_iron_works | C3/C4 | Steelworks/furnace are adjacent but not wrought-iron evidence. Keep unfilled unless a puddling/rolling mill image is found. |

**Company-phase result:** eight source leads are identified, but several are contextual rather than subject-exact. The table deliberately does not pretend all 24 kinds have a cleared, exact image. The most defensible exact matches currently are coke furnaces, integrated steelworks, heavy casting/furnace work, and mechanised cotton textiles. The rest require targeted follow-up or may reuse a suitable existing image only after Claude visually approves the fit.

## B. Technology inventory for the next HY-03 pass

The repository contains 32 technology IDs in the 1880–1914 interval. These are the full worklist; no claim is made that each has been individually source-cleared in this first pass.

| Technology ID | Historical year | Initial source direction / likely visual |
|---|---:|---|
| electricity | 1882 | central generating station, dynamo hall; use existing dynamo only if image actually matches |
| internal_combustion | 1895 | early engine works / stationary internal-combustion engine |
| assembly_line | 1913 | moving production line; C2 is an engine assembly/foundry but not proof of a moving line |
| machine_guns | 1885 | period machine-gun field or factory image; must check rights and date |
| smokeless_powder | 1886 | powder works / laboratory; exclude modern military imagery |
| steel_warships | 1880 | shipyard iron/steel warship construction |
| quick_firing_artillery | 1897 | period artillery gun and crew / arsenal |
| dreadnoughts | 1906 | HMS Dreadnought-era battleship or shipyard construction |
| germ_theory | 1880 | historical microbiology laboratory / microscope |
| telephone | 1885 | telephone apparatus or switchboard; C8 is a strong 1900–1910 lead |
| transcontinental_railways | 1880 | long-distance rail corridor / terminal / construction |
| machine_tools | 1880 | C1 machine shop is a strong lead |
| antiseptic_surgery | 1880 | period operating theatre / surgical instruments; verify no post-1914 imagery |
| electric_lighting | 1885 | Edison Menlo Park / early electric illumination; prior LOC lead: item 89714482 (1880) |
| steel_plough | 1890 | steel plough / agricultural implement in use |
| central_power_stations | 1890 | power station turbine-generator hall |
| large_steel_casting | 1890 | C4 ingot/furnace handling is relevant |
| standard_time | 1890 | observatory time ball / railway clocks / time signal equipment |
| telegraphic_exchanges | 1890 | C8 telephone exchange is not a telegraph exchange; seek telegraph operating room |
| sound_recording | 1890 | phonograph / gramophone recording apparatus |
| steam_turbines | 1895 | Parsons steam turbine / turbine hall |
| aluminium_electrolysis | 1895 | Hall-Héroult aluminium reduction works; C3 steelworks is not suitable |
| rabies_vaccine | 1895 | Pasteur Institute laboratory / vaccination historical photograph |
| pneumatic_tyres | 1900 | tyre factory / bicycle or motor-car pneumatic tyre workshop |
| diesel_engine | 1900 | early Diesel engine / MAN works |
| motor_cars | 1905 | C2 engine works is adjacent; need finished early motor-car factory or assembly scene |
| hydroelectric_power | 1905 | early hydroelectric station / dam powerhouse |
| radio_telegraphy | 1905 | Marconi wireless station / shipboard radio room |
| x_ray_diagnosis | 1905 | early radiology room / X-ray apparatus |
| high_speed_steel | 1910 | tool-steel furnace / machine-tool cutting operation |
| tractors | 1910 | early tractor in field or factory; C1/C2 not exact |
| punched_card_tabulation | 1910 | Hollerith tabulating machine / census bureau room |

## C. Concrete first-pass candidate URLs and known source facts

1. Westinghouse Air-Brake machine shop (C1): https://www.loc.gov/pictures/item/2016805390/ — Detroit Publishing Co., c.1905, LOC rights “No known restrictions on publication”; original digital handle https://hdl.loc.gov/loc.pnp/det.4a12748; catalogue lists 20.0 MB and 159.6 MB TIFF choices.
2. Leland & Faulconer engine foundry (C2): https://www.loc.gov/item/2016816767/ — Detroit Publishing Co., c.1903, LOC “No known restrictions on publication”; digital original LC-DIG-det-4a26764.
3. Homestead Steel Works (C3): https://www.loc.gov/item/2016802408/ — Detroit Publishing Co., 1900–1910, LOC “No known restrictions on publication”; six-part panorama with original sections.
4. Removing ingot slab (C4): https://www.loc.gov/item/2016814565/ — Detroit Publishing Co., 1900–1910, LOC “No known restrictions on publication”; digital original det.4a22874.
5. Coke ovens (C5): https://www.loc.gov/item/2007678126/ — Keystone View Company, 1905, LOC “No known restrictions on publication”; digital original stereo.1s15277.
6. Cotton mill interior (C6): https://www.loc.gov/pictures/item/2012647904/ — Bain News Service, c.1900, LOC “No known restrictions on publication”; digital file cph.3a41760.
7. Cotton mill panorama (C7): https://www.loc.gov/pictures/item/2007662555/ — Alphonso H. Sanborn, c.1903, LOC “No known restrictions on publication”; TIFF 6.9 MB; source pan.6a14021.
8. Long-distance telephone switchboard (C8): https://www.loc.gov/pictures/item/2017651466/ — Sears, Roebuck & Co., 1900–1910, LOC “No known restrictions on publication”; digital original stereo.1s08725.
9. Automatic telephone switchboard alternative: https://www.loc.gov/resource/stereo.2s08726/ — Sears, Roebuck & Co., c.1900–1910, LOC “No known restrictions on publication”; digital originals stereo.1s08726 / stereo.2s08726.
10. Edison electric illumination wood engraving (technology lead): https://www.loc.gov/pictures/item/89714482/ — Frank Leslie's Illustrated Newspaper, 10 Jan 1880; LOC “No known restrictions on publication”; six views of Menlo Park and electric light apparatus.

## D. Follow-up still required before source pack is complete

- Verify TIFF pixel dimensions for C1–C8 and inspect actual image content/crop, rather than relying on catalogue captions alone.
- Find subject-exact sources for agricultural implements/reapers, sewing-machine manufacture, aluminium electrolysis, turbine works, synthetic fibres, tractor works and wrought-iron puddling/rolling. Do not use an adjacent industry image as if it depicted the named company.
- Complete per-ID source research for the 32 technology entries. The table in section B is the verified repository inventory and research plan, not a claim of source clearance.
- Claude must visually approve every chosen image and may reject any candidate before ingestion.

