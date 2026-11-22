# CG-29 — Population, vital rates and GDP benchmarks, 1850–2022

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Revision:** 2026-11-22, expanded after MSG-046 / commit `f52530c`  
**Research status:** DATA PANEL EXPANDED; **NOT YET ACCEPTED FOR GAMEPLAY CALIBRATION**. The provided extracts support complete population and GDPpc tables for the listed modern-border series, and WPP2024 vital-rate observations for 1960/1990/2020. Earlier vital-rate rows are heterogeneous historical observations/period means; missing or territorially incomparable values remain explicitly unavailable.

## 1. Data and interpretation rules

| Variable | Selected release | Unit / coverage |
|---|---|---|
| Population, 1850/1900 | OWID long-run population extract (Gapminder v7/earlier source chain) | persons; historical observations are backcast to **today's geographical borders**, not the borders of historical states |
| Population, 1950/1980/2000/2020 | OWID long-run extract using WPP2024 from 1950 | persons; WPP2024 mid-year estimates |
| Population, supplementary former-USSR territory | MPD2023 population column, code SUN | thousand persons; aggregate on former-USSR territory, not the Russian Empire and not a sovereign USSR before 1922 |
| GDP per capita, 1950/1980/2000/2022 | Maddison Project Database 2023, original workbook extract | 2011 international dollars/person; no interpolation |
| CBR/CDR, 1960/1990/2020 | UN DESA WPP2024 Demographic Indicators, Medium estimates | births/deaths per 1,000 population/year |
| CBR/CDR before 1960 | National historical series / demographic histories listed in §5 | Exact years where available; otherwise the source's actual multi-year period is retained |

The source extracts, original download checksums, derived-file SHA-256 values, sizes, and licences are recorded in `docs/research/data/CG29_DATA_MANIFEST.json`. The MPD workbook's downloaded SHA-1 matches the publisher checksum (`1480521f602fbd5df64e108867ac971caa00ed1a`). The extraction commit also reports 41 previously used MPD values checked against the original workbook with zero mismatches. The new raw-panel CSV is `CG29_COMPLETE_DATA_PANEL_2026-11-22.csv`; it preserves native units and carries source/confidence/status fields.

### Territory crosswalk — mandatory reading

- **Germany / Prussia:** OWID's Germany series is a modern-border backcast. It is not the Prussian state in the game in 1836, nor a single unchanged pre-1871 German state.
- **Russia / USSR:** OWID RUS is the modern Russian Federation territory backcast. MPD `SUN` is a former-USSR-territory aggregate. Neither series is a direct Russian Empire observation for 1836–1917. Do **not** substitute SUN for the Tsarist Empire. A separate historical-empire territory reconstruction is required to calibrate the engine's Russian Empire.
- **China / Qing:** modern-border China backcast is not Qing territory.
- **India / EIC:** modern-border India backcast is not British India or the East India Company's 1836 possessions.
- **Ottoman / Turkey:** modern-border Turkey backcast is not the Ottoman Empire. The extracted TUR series is a Turkey benchmark only.
- **United Kingdom:** OWID population is a modern-UK-border backcast. The historical vital-rate series below is **England and Wales**, a proxy rather than the whole UK.
- **SUN:** before 1922 this is a retrospective aggregate for the territory later comprising the USSR, not a historical polity existing under that name.

These boundary differences mean the panel is appropriate for source-aware benchmark context, not a direct one-to-one comparison with every 1836 game-country boundary.

## 2. Population panel

Values below are **million persons**, rounded to three decimals for display. Exact source values in persons and native MPD-thousand units are retained in the CSV.

| Geography / series definition | 1850 | 1900 | 1950 | 1980 | 2000 | 2020 |
|---|---:|---:|---:|---:|---:|---:|
| World | 1,275.602 | 1,627.274 | 2,493.093 | 4,447.606 | 6,171.703 | 7,887.001 |
| United Kingdom (modern-border backcast) | 27.255 | 41.090 | 50.121 | 56.282 | 59.057 | 67.352 |
| France (modern-border backcast) | 36.318 | 40.019 | 41.883 | 53.941 | 59.484 | 65.905 |
| Germany (modern-border backcast) | 33.718 | 55.775 | 69.848 | 78.315 | 81.797 | 83.629 |
| United States | 23.600 | 74.830 | 154.203 | 229.859 | 281.484 | 339.436 |
| Russia (modern-border backcast) | 41.297 | 64.844 | 103.392 | 138.573 | 146.718 | 146.371 |
| China (modern-border backcast) | 409.822 | 395.929 | 544.044 | 983.164 | 1,269.581 | 1,426.106 |
| India (modern-border backcast) | 235.732 | 280.714 | 346.279 | 687.354 | 1,057.923 | 1,402.618 |
| Japan | 32.050 | 44.417 | 86.443 | 118.359 | 127.028 | 126.305 |
| Brazil | 7.233 | 18.059 | 53.409 | 121.207 | 174.018 | 208.661 |
| Turkey (modern-border backcast; **not Ottoman Empire**) | 11.073 | 13.973 | 21.021 | 45.409 | 65.426 | 86.092 |
| Former USSR territory (MPD code SUN; retrospective territorial aggregate) | 73.750 | 124.500 | 179.571 | 265.926 | 288.730 | 296.211 |

**Use limit:** Do not label the historical-border backcasts as the actual population of Qing China, British India/EIC, the Ottoman Empire, Prussia, or the Russian Empire. For those game polities, create a separate historical-territory crosswalk or leave the observation unavailable. The SUN row is helpful for post-1922 Soviet-era aggregate comparison and for its future-territory backcast, but it does not solve the Russian Empire problem.

## 3. MPD2023 GDP per capita panel

2011 international dollars/person. Display rounded to the nearest dollar; complete precision is preserved in the source CSV.

| MPD series | 1950 | 1980 | 2000 | 2022 |
|---|---:|---:|---:|---:|
| World (regional aggregate) | 3,360 | 7,239 | 9,904 | 16,677 |
| United Kingdom (GBR) | 11,061 | 20,612 | 31,946 | 38,407 |
| France (FRA) | 8,266 | 23,537 | 33,410 | 39,066 |
| Germany (DEU; not Prussia) | 6,186 | 22,497 | 33,367 | 46,648 |
| United States (USA) | 15,240 | 29,611 | 45,886 | 58,487 |
| Russian Federation (RUS; not Russian Empire) | 3,311 | 12,204 | 10,553 | 25,437 |
| Former USSR aggregate (SUN) | 4,529 | 10,245 | 8,194 | 19,355 |
| China (CHN; not Qing territory) | 799 | 1,930 | 4,730 | 19,238 |
| India (IND; not EIC/British India territory) | 987 | 1,495 | 2,753 | 7,766 |
| Japan (JPN) | 3,062 | 21,404 | 33,211 | 38,269 |
| Brazil (BRA) | 2,236 | 8,249 | 9,834 | 14,640 |
| Turkey (TUR; not Ottoman Empire) | 2,079 | 6,070 | 11,904 | 27,362 |

**Russia recommendation (answer to MSG-046):** retain two separate series:
1. `RUS` = Russian Federation, modern Russia country series;
2. `SUN` = former USSR aggregate.
Neither is an adequate substitute for Russian Empire GDPpc/population on its actual 19th-century territory. For a pre-1917 Empire scorecard, obtain a historically bounded Russian Empire estimate from an explicitly documented historical national-accounts source, or mark it unavailable. Do not use the SUN series for the Tsarist period merely because it is geographically closer to a later empire.

**Turkey recommendation:** the `TUR` MPD series is Turkey, not the Ottoman Empire. It may benchmark modern Turkey; it must not be presented as Ottoman GDPpc in 1870/1900/1913.

## 4. CBR/CDR — observations around 1870, 1900 and 1930

All rates are per 1,000 population per year. “Period” is the period actually reported by the cited source; it is not silently converted into an exact-year observation.

| Country requested | Around 1870: CBR / CDR | Around 1900: CBR / CDR | Around 1930: CBR / CDR | Interpretation |
|---|---:|---:|---:|---|
| UK | 35.2 / 22.9 (1870) | 28.7 / 18.2 (1900) | 16.3 / 11.4 (1930) | England & Wales only; proxy, not UK total |
| France | 25.5 / 24.9 (c.1870) | 21.2 / 19.6 (c.1900) | 18.0 / 15.6 (1930) | First two are approximate historical reference periods; 1930 is an annual observation |
| Germany | 38.8 / 28.2 (1871–75) | 36.0 / 21.2 (1896–1900) | 17.6 / 11.0 (1930) | Knodel period means for first two; 1930 official comparative table includes Saarland |
| USA | 41.16 / 23.66 (1870–80) | 32.22 / 19.44 (1890–1900) | 18.9 / 11.4 (1930) | First two are decade rates; 1930 birth/death registration areas cover 94.7%/96.2% of population respectively |
| Japan | 23.1 / 18.9 (1873) | 32.4 / 20.8 (1900) | 32.4 / 18.2 (1930) | Annual official national vital-statistics observations |
| India | — / — | 48 / 48 (1891–1901) | 47 / 37 (1921–31) | Census-derived period averages; no comparable 1870 national rate in selected source |
| China | — / — | — / — | — / — | No sufficiently robust nationwide comparable CBR/CDR observation established for these requested years; do not substitute a provincial or partial-registration rate |

Historical values are **anchors, not a harmonized balanced panel**. For example, UK means England & Wales; India uses historical census-derived intervals; Germany uses ranges; France c.1870/c.1900 are approximate. Keep those provenance labels with every value during calibration. China has no fabricated or regionally extrapolated values.

## 5. WPP2024 CBR/CDR panel, 1960/1990/2020

UN WPP2024 Demographic Indicators, Medium estimates. Rates per 1,000 population/year; all values are directly extracted from `WPP2024_DEMOGRAPHY_SUBSET_1950_2023.csv`.

| Country | 1960 CBR | 1960 CDR | 1990 CBR | 1990 CDR | 2020 CBR | 2020 CDR |
|---|---:|---:|---:|---:|---:|---:|
| UK | 17.332 | 11.440 | 13.902 | 11.303 | 10.204 | 10.268 |
| France | 17.911 | 11.273 | 13.527 | 9.268 | 10.560 | 10.084 |
| Germany | 17.414 | 11.885 | 11.385 | 11.584 | 9.269 | 11.848 |
| USA | 24.246 | 9.230 | 16.466 | 8.597 | 10.730 | 9.970 |
| Japan | 17.340 | 7.684 | 9.537 | 6.734 | 6.656 | 11.269 |
| India | 42.902 | 19.421 | 32.569 | 10.726 | 16.744 | 7.214 |
| China | 29.491 | 29.789 | 24.341 | 6.913 | 8.305 | 7.301 |

**Important:** the WPP table is the 2024 revision's historical estimate series, not a population projection. The 2020 values are not forecasts. These WPP historical estimates can differ from registered national series and revisions published by national statistical offices; do not splice releases without marking the source change.

## 6. Demographic-transition implications — model design, not direct observations

1. Mortality decline must be gradual and multi-causal: public health, nutrition, sanitation, vaccination/medicine, clean water, urban infrastructure and state capacity. A single technology unlock must not instantly force mortality to a global floor.
2. Fertility decline is separate and delayed. Relevant mechanisms include child survival, female education and agency, urbanisation, contraception access, household opportunity costs and old-age support. Do not force fertility to decline as soon as mortality falls.
3. Keep births, deaths and migration separate. Natural increase is births minus deaths; migration and territorial changes must be separately represented.
4. Calibrate against both observed CBR/CDR anchors and population trajectories. A fit to global population alone can hide severe country-level errors.
5. Where age structure is modeled, apply rates to cohort exposure rather than multiplying total population by an arbitrary fixed rate.
6. Do not reinterpret GDP per capita growth as TFP or labour-productivity growth. MPD GDPpc is a benchmark outcome; this file does not identify causal contributions by technology or institution.
7. Do not use the pre-1960 historical rates as if they were a continuous, equally reliable country panel. The blanks are intentional.

## 7. Sources and provenance

- **S1 — OWID population sources and long-run data.** OWID documents HYDE before 1800, Gapminder v7 for 1800–1949 and WPP2024 from 1950; historical population series use today's geographical borders. Source data extract URL: https://ourworldindata.org/grapher/population.csv?v=1&csvType=full&useColumnShortNames=true. Source explanation: https://ourworldindata.org/population-sources.
- **S2 — Bolt, Jutta & Jan Luiten van Zanden (2024), Maddison Project Database 2023.** DataverseNL DOI 10.34894/INZBF2; 2011 international-$ GDPpc; CC BY 4.0. https://dataverse.nl/dataset.xhtml?persistentId=doi:10.34894/INZBF2 ; paper DOI 10.1111/joes.12618.
- **S3 — UN DESA Population Division, World Population Prospects 2024, Demographic Indicators Medium.** Estimates from 1950 onward, 2024 revision; CC BY 3.0 IGO. https://population.un.org/wpp/ ; source CSV URL and file checksums in the manifest.
- **S4 — Wrigley & Schofield / Mitchell, “Crude Birth and Death Rates (per 1,000), England and Wales 1541–2015”.** Annual England-and-Wales series, hosted on Wikimedia Commons. https://commons.wikimedia.org/wiki/Data:Crude_Birth_and_Death_Rates_(per_1,000),_England_and_Wales_1541-2015_-_Wrigley_and_Schofield,_Mitche_(OWID_532).tab.
- **S5 — Massimo Livi-Bacci, A Concise History of World Population, ch. 6, Table 6.3.** Historical European demographic indicators; approximate reference periods. https://en-econ.tau.ac.il/sites/economy_en.tau.ac.il/files/media_server/Economics/PDF/Mini%20courses/Livi%20Bacci%20%282000%29%20Ch.%206.pdf.
- **S6 — John Knodel (1974), The Decline of Fertility in Germany, 1871–1939, Table 1.2.** Germany's reported 5-year period CBR/CDR series. https://api.pageplace.de/preview/DT0400.9781400869848_A26068095/preview-9781400869848_A26068095.pdf.
- **S7 — Historical Statistics of the United States, Millennial Edition, Table Aa15–21.** US decade rates, 1870–1930. https://hsus.cambridge.org/HSUSWeb/toc/treeTablePathIdAa15-21.html.
- **S8 — US Bureau of the Census, Vital Statistics of the United States 1939, Table I / international country tables.** US 1930 registration-area CBR/CDR and annual comparative values for France/Germany. https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/DVD/DVD_1/VSUS_1890-1974/1890-1974/1939_VSUS_1.pdf.
- **S9 — Registrar General of India, Census series (reproduced in “Population Growth and Rising Dowries”, Table 2).** Period CBR/CDR rates for 1891–1981; periods are retained. https://www.cirje.e.u-tokyo.ac.jp/research/workshops/micro/documents/Oct25.pdf.
- **S10 — National Institute of Population and Social Security Research (Japan), Population Statistics 2025, Table 3-1.** National annual birth/death rate series 1873–2023. https://www.ipss.go.jp/syoushika/tohkei/Data/Popular2025/T03-01.files/sheet001.htm.
- **S11 — Mi Hong & Jiang Zhenghua (1996), “A Study on the Population Census Data in the Republic of China”.** Explains incomplete registration and the lack of a true nationwide census until the 1953 census; basis for leaving early China national CBR/CDR cells unavailable. https://rkyj.ruc.edu.cn/CN/article/downloadArticleFile.do?attachType=PDF&id=1737.

## 8. Calibration gate

The panel is a research benchmark, **not approval to tune coefficients**. Before accepting it for calibration:
- map engine tags to source territories explicitly and exclude invalid territory substitutions;
- run the historical and sandbox population scenarios and compare country plus world aggregates;
- show actual commands, seeds, output JSON, regression test counts and failures;
- keep missing historical vital-rate observations missing unless a new source is supplied;
- do not infer TFP from GDPpc or use the CATCHUP-01 discount to hide demographic/economic errors.
