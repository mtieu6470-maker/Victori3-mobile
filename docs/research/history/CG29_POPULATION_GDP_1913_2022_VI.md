# CG-29 — Population, vital rates and GDP benchmarks, 1913–2022

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Research status:** PARTIAL / NOT ACCEPTED FOR CALIBRATION. This memo deliberately separates verified observations from missing cells. No interpolation or synthetic country estimates are introduced.

## 1. Source selection and territorial rules

| Period / variable | Preferred source | Coverage and interpretation |
|---|---|---|
| Population 1950 onward | UN DESA, *World Population Prospects 2024* (WPP2024) | Annual estimates 1950–2023 for 237 countries/areas; use mid-year population. It is the UN official revision and supersedes 2022 for a new benchmark. |
| Population before 1950 | Gapminder Population v7 / OWID long-run dataset; HYDE 3.3 as a separate alternative | OWID states it uses Gapminder v7 for 1800–1949, WPP2024 from 1950, and HYDE 3.3 before 1800. Its historical series use today's geographical borders, not each historical polity's contemporary borders. Do not splice these into engine historical territories without a territory crosswalk. |
| GDP per capita 1950–2022 | Maddison Project Database 2023 | 169 countries/aggregates, 1–2022; 2011 international-$ for GDPpc. CC BY 4.0; cite Bolt & van Zanden (2024), DOI 10.1111/joes.12618 and source-sheet originals where required. |
| Vital rates after 1960 | UN WPP2024 / World Bank WDI | WDI crude birth/death rate series start in 1960; unit births/deaths per 1,000 population. WDI is CC BY 4.0 and sourced from WPP/NSO vital statistics. |
| Vital rates before 1960 | National historical statistical series / demographic histories | Definitions and territorial coverage vary; use period means when a source reports period averages. Do not pretend an observation at 1870, 1900 or 1930 is an exact single-year count if it is a multi-year mean. |

### Country/territory crosswalk that must be explicit
- **Germany:** pre-1871 Prussia or German customs/territorial aggregates are not the same series as unified Germany. Engine PRU must not be labelled Germany without a caveat.
- **Russia/USSR:** Russian Empire, RSFSR, USSR and present-day Russian Federation are different territories. WPP country code for modern Russia cannot stand in for the USSR.
- **China:** Qing territory, Republic/PRC historical boundaries and modern PRC differ; WPP's present-day China series is not Qing population.
- **India:** British India, undivided India and Republic of India have different borders. Post-1947 WPP India is not British India.
- **Ottoman/Turkey:** Ottoman Empire and modern Turkey differ substantially; do not bridge as one unchanged national territory.
- **Brazil, Japan, UK, France, USA:** still note colonial/overseas and boundary changes when comparing historical aggregate to modern national series.

## 2. Directly verified data captured in this pass

The attached CSV records the raw observations currently extracted and their source IDs. Selected findings:

### 2.1 World population
- WPP2024 is the authoritative post-1950 source. World population is about **2.493 billion in 1950** and about **7.887 billion in 2020** (rounded mid-year estimates; use exact WPP CSV values for production benchmark).
- The WPP2024 source states estimates from 1950 to the present for 237 countries/areas, based on censuses, vital registration and nationally representative surveys. The 2020 value is historical estimate, not a projection.

### 2.2 Crude birth/death rates before 1960
Livi-Bacci's historical demographic table gives selected-country estimates (‰):
| Geography / year | Birth | Death |
|---|---:|---:|
| England, c.1870 | 35.5 | 22.0 |
| England, c.1900 | 28.1 | 16.1 |
| Germany, c.1870 | 38.8 | 27.8 |
| Germany, c.1900 | 34.3 | 19.5 |
| France, c.1870 | 25.5 | 24.9 |
| France, c.1900 | 21.2 | 19.6 |
| Russia, c.1870 | 50.8 | 37.1 |
| Russia, c.1900 | 47.8 | 31.0 |

Japan's official Population Statistics of Japan (IPSS), Table 3.1, supplies registered annual vital rates:
| Japan / year | Birth ‰ | Death ‰ |
|---|---:|---:|
| 1873 | 23.1 | 18.9 |
| 1900 | 32.4 | 20.8 |
| 1930 | 32.4 | 18.2 |

**Caution:** the European source reports approximate reference years/periods and has its own boundary notes; Japan's values are national registration series. They are not a fully harmonized panel. The large discrepancy between Japan 1873 and later birth rates should not be smoothed away; early registration completeness and changing coverage need to be documented.

## 3. GDP per capita — MPD2023

MPD2023 is the selected release because it extends to 2022 and has a clear CC BY 4.0 licence. The MPD portal says it covers 169 countries and aggregate regions from 1 AD to 2022. The OWID Grapher page confirms 2011 international-$ units and identifies MPD2023 as its source.

**Extraction blocker:** the MPD2023 full-data workbook / sheet and WPP2024 bulk CSV were not available as directly inspectable rows in this review environment. I therefore do not fill country GDPpc for 1950/1980/2000/2022 from secondary snippets or another MPD release. Those 40 country-year cells remain **unknown pending raw-file extraction**. The world 2022 GDPpc value in the CSV is a surfaced OWID chart value (16,677 2011 int-$), marked medium confidence pending raw workbook check.

## 4. Population country panel — pending exact bulk extraction

Required matrix (million persons, mid-year) must be extracted from WPP2024 for 1950/1980/2000/2020 and from a single declared pre-1950 series for 1850/1900. The current pass does not claim exact values for country cells that could not be read from source files.

| Country/aggregate | 1850 | 1900 | 1950 | 1980 | 2000 | 2020 |
|---|---:|---:|---:|---:|---:|---:|
| World | Gapminder/HYDE | Gapminder | WPP | WPP | WPP | WPP |
| UK | pending | pending | pending | pending | pending | pending |
| France | pending | pending | pending | pending | pending | pending |
| Germany | pending | pending | pending | pending | pending | pending |
| USA | pending | pending | pending | pending | pending | pending |
| Russia / USSR | pending | pending | Russian Empire/USSR crosswalk | USSR/Russia crosswalk | Russia | Russia |
| China | pending | pending | pending | pending | pending | pending |
| India | pending | pending | pending | pending | pending | pending |
| Japan | pending | pending | pending | pending | pending | pending |
| Brazil | pending | pending | pending | pending | pending | pending |
| Ottoman / Turkey | pending | Ottoman crosswalk | Turkey | Turkey | Turkey | Turkey |

Use a consistent unit (million) and source-specific precision. For 1850 and 1900, do not silently use modern-border population for historical polities while labeling it Ottoman, Qing or British India; label it modern-territory backcast if that is the source definition.

## 5. Vital-rate panel — pending exact extraction

WDI provides crude birth rate (SP.DYN.CBRT.IN) and crude death rate (SP.DYN.CDRT.IN) beginning in 1960, with values per 1,000 people and CC BY 4.0. It cannot satisfy 1870/1900/1930. For those years, national historical series are required. The extracted European and Japanese values above provide anchor observations only; they do not fill the complete UK/France/Germany/USA/Japan/India/China panel at 1870, 1900, 1930, 1960, 1990 and 2020.

## 6. Demographic transition implications for the engine

These are model-design inferences, not direct observations:
1. Mortality decline must be staged by public health, nutrition, sanitation, vaccination/medical capacity and urban infrastructure; a generic "medical technology unlocked" flag must not instantly push mortality to a global floor.
2. Fertility decline is delayed and heterogeneous. Education, urbanization, child survival, female agency, contraception access, pension/old-age support and household opportunity costs are plausible state variables; do not make fertility automatically fall at the same time as mortality.
3. Model births and deaths separately. Natural increase is births minus deaths; migration and territorial changes must be accounted separately in total population.
4. Calibrate to observed rates and population paths, not a desired terminal world population alone. Add country-specific historical anchors and a global aggregate check.
5. Avoid double-counting: if age structure is modeled, fertility and mortality rates should operate on cohort exposure, not simply multiply total population by a fixed rate.

## 7. Sources

- **S1 — UN DESA Population Division**, *World Population Prospects 2024*, official estimates for 237 countries/areas from 1950; downloadable CSV/API; 2024 revision. https://population.un.org/wpp/ and https://www.un.org/development/desa/pd/node/4328
- **S2 — Massimo Livi-Bacci**, *A Concise History of World Population*, chapter “The Great Transformation (1800–1914)”, Table 6.3, demographic indices for selected European countries (per 1,000). PDF copy of the table: https://en-econ.tau.ac.il/sites/economy_en.tau.ac.il/files/media_server/Economics/PDF/Mini%20courses/Livi%20Bacci%20%282000%29%20Ch.%206.pdf. Russia c.1850 note: 1861–65; Germany 1913 territory includes Lorraine and Holstein.
- **S3 — National Institute of Population and Social Security Research (Japan)**, *Population Statistics of Japan 2003*, Table 3.1, “Numbers, Crude Rates and Standardized Rates of Birth, Death, Natural Increase: 1873–2001”. https://www.ipss.go.jp/p-info/e/psj2003/psj2003.pdf
- **S4 — Bolt, Jutta & Jan Luiten van Zanden (2024)**, *Maddison Project Database 2023*, DataverseNL DOI 10.34894/INZBF2; 169 countries/aggregates, 1–2022; cite paper DOI 10.1111/joes.12618. https://research.rug.nl/en/datasets/maddison-project-database-2023/
- **S5 — Our World in Data**, “What are the sources for Our World in Data's population estimates?” (revised Aug 2024): HYDE 3.3 to 1799, Gapminder v7 1800–1949, WPP2024 from 1950; historical values based on today's borders. https://ourworldindata.org/population-sources
- **S6 — Gapminder**, Population dataset documentation v8; historical country data reaches back to 1800; v7 is the OWID source for 1800–1949. https://www.gapminder.org/data/documentation/gd003/
- **S7 — World Bank WDI**, crude birth rate indicator SP.DYN.CBRT.IN, 1960–2024, CC BY 4.0, source includes WPP and national vital statistics. https://data.worldbank.org/indicator/SP.DYN.CBRT.IN
- **S8 — OWID Grapher**, GDP per capita 1820–2022, source MPD2023, 2011 international-$. https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database

## 8. Acceptance status

**CG-29 is not complete.** The sources and definitions are selected, and a subset of vital-rate anchors plus the world population anchors are captured. The requested full country population panel and full MPD2023 country GDPpc panel require direct extraction from WPP2024 and MPD2023 raw files; the full pre-1960 vital-rate panel also requires country-specific historical series for India, China, USA and missing European/Japanese dates. Do not use this partial CSV as a gameplay calibration target.
