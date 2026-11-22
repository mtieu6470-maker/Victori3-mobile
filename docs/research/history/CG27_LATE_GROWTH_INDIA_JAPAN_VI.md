# CG-27 — Late-century growth, colonial India and Meiji Japan (1870–1913)

**Ngày nghiên cứu:** 2026-11-22  
**Branch:** `ccr-b27f3fb8-epfpd6`  
**Đơn vị:** tỷ lệ tăng trưởng phần trăm mỗi năm; GDPpc của MPD2023 dùng 2011 international-$; các chuỗi lịch sử khác giữ nguyên đơn vị nguồn.  
**Quy ước:** phân biệt số thống kê/ước tính, không tự nội suy năm thiếu và không xem TFP residual là thước đo thuần túy của phát minh công nghệ.

## 1. Kết luận điều hành

1. Tăng trưởng lao động năng suất 1871–1913 của Đức nhanh hơn Anh; trong phân rã Crafts (2020), Đức đạt 1.75%/năm so với UK 1.06%. Cả capital deepening và crude TFP đều đóng góp lớn hơn tại Đức. Structural shift khỏi nông nghiệp năng suất thấp đóng góp ước tính 0.36 điểm phần trăm/năm ở Đức, so với 0.06 điểm ở UK.
2. Bảng so sánh 1890–1913 của Crafts–Woltjer cho thấy net TFP (sau phần đóng góp education) khoảng 0.37% UK, 1.13% France, 1.15% Germany, 0.91% USA và 0.34% Japan. Japan có labour productivity tăng nhanh 2.49%/năm nhưng capital deepening lên tới 1.60 điểm phần trăm/năm; không thể quy toàn bộ tăng trưởng Nhật thành TFP.
3. MPD2023 cho India GDPpc 1850→1913 chỉ tăng **1.133×** (~0.20%/năm), Japan tăng **1.693×** (~0.84%/năm), China tăng **1.148×** (~0.22%/năm). Đây là benchmark cùng một release, cùng đơn vị.
4. **Lỗi so sánh benchmark trong ECON_GROWTH_REPORT cần sửa trước khi tune:** engine report ghi India “1.71× vs MPD 1.13× from 1850”, nhưng 1.713 là engine 1913 so với Jan 1837, trong khi 1.133 là MPD 1913 so với 1850. Từ chính bảng engine, EIC 1850 = 0.814 và 1913 = 1.713, nên cùng-baseline ratio là **1.713/0.814 = 2.104×**, không phải 1.71×. Japan và China cũng phải chuẩn hóa tương tự. Xem §5.
5. Ấn Độ không phải một câu chuyện “không có công nghiệp”: công nghiệp bông và jute tăng nhanh từ nền thấp, nhưng nông nghiệp vẫn chi phối sinh kế và GDP. Nghiên cứu của Bishnupriya Gupta cho rằng stagnation nông nghiệp/yield là vấn đề lớn hơn deindustrialisation trong giai đoạn cuối thế kỷ XIX–đầu XX. Railways tích hợp thị trường nhưng không tự động nâng yield.
6. Nhật Bản có các kênh định lượng rõ: railways từ 29 km năm 1872 lên 12,401 km năm 1913; raw silk production từ 278 nghìn kwan (1868, số đầu kỳ được Allen ghi) lên bình quân 3,375 nghìn kwan năm 1909–13; raw silk exports 2,563 nghìn kwan trong cùng giai đoạn. School attendance tăng từ 35.4% năm 1875 lên 95.6% năm 1905. Đây là attendance, không phải literacy rate.
7. Chưa có cơ sở để gán TFP một mức cố định riêng cho điện, hóa chất, Bessemer/Siemens–Martin và động cơ đốt trong. Nguồn so sánh tìm được chỉ lượng hóa steam và electricity trong một số giai đoạn; với hóa chất/thép/ICE giữ `unknown` cho đến khi có sector-specific growth accounting.

## 2. Growth accounting — UK, Germany, France, USA, Japan

### 2.1 UK và Germany: 1871–1913 (Crafts 2020)

Bảng 2 trong Nicholas Crafts, *British Relative Economic Decline in the Aftermath of German Unification* (Warwick Economics Research Paper 1295, July 2020), pp. 13–14. Đơn vị %/năm.

| Nước / giai đoạn | Capital deepening (K/HW) | Crude TFP | Labour productivity (Y/HW) |
|---|---:|---:|---:|
| Germany 1851–1871 | 0.39 | 0.39 | 0.78 |
| Germany 1871–1898 | 0.55 | 1.13 | 1.68 |
| Germany 1898–1913 | 0.79 | 1.10 | 1.89 |
| **Germany 1871–1913** | **0.63** | **1.12** | **1.75** |
| UK 1856–1873 | 0.72 | 1.34 | 2.06 |
| UK 1873–1899 | 0.37 | 0.81 | 1.18 |
| UK 1899–1913 | 0.42 | 0.42 | 0.84 |
| **UK 1873–1913** | **0.38** | **0.68** | **1.06** |

Crafts notes:
- Germany's real GDP/person grew 1.48%/year 1871–1913; UK 0.81%/year. German GDP/person relative to UK moved from 56.2% in 1871 to 74.1% in 1913 (1990 Geary-Khamis dollars in that source, not MPD2023 dollars).
- The TFP gap is 0.68 percentage points/year. Crafts estimates structural shift from agriculture contributed 0.36 percentage points/year in Germany (1871–1910) versus 0.06 in UK (1873–1913).
- Years of schooling in the paper's cited estimates: UK 4.13 years (1870) → 6.35 (1910); Germany 5.25 (1879) → 6.92 (1910). These are separate schooling estimates, not literacy percentages.
- If an extra year of schooling raises labour quality by 6%, Crafts estimates an annual labour-productivity contribution of 0.22 pp in UK and 0.17 pp in Germany over the 40-year period. This is a sensitivity assumption, not a directly measured annual output contribution.

### 2.2 International comparison: 1890–1913 (Crafts & Woltjer)

Table 1, Nicholas Crafts and Pieter Woltjer, “Growth Accounting in Economic History: Findings, Lessons and New Directions,” *Journal of Economic Surveys* 35(3), pp. 670–696 (first published online 2019). Values are annual percentage rates. Y/HW = output per hour worked; K/HW = capital per hour worked; crude TFP is the Solow residual before subtracting education; TFP is after the estimated education contribution.

| Country | Y/HW | K/HW | Crude TFP | Education | Net TFP |
|---|---:|---:|---:|---:|---:|
| USA | 1.62 | 0.57 | 1.05 | 0.14 | 0.91 |
| France | 1.92 | 0.49 | 1.43 | 0.30 | 1.13 |
| Germany | 1.89 | 0.51 | 1.38 | 0.23 | 1.15 |
| UK | 0.79 | 0.19 | 0.60 | 0.23 | 0.37 |
| Japan | 2.49 | 1.60 | 0.89 | 0.55 | 0.34 |

**Interpretation:** Japan's 2.49% labour-productivity growth was primarily associated with capital deepening and education in this accounting, not a large measured net-TFP residual. France/Germany/USA figures cover 1890–1913 only; do not relabel them as 1870–1913 estimates. UK/Germany 1871–1913 table above is a separate source/method and is not directly interchangeable with this table.

### 2.3 General-purpose technology — measured contribution, not invention bonus

Crafts–Woltjer Table 5 reports the following contributions to labour-productivity growth:

| Technology / country / period | Capital deepening | TFP | Total |
|---|---:|---:|---:|
| Steam, UK 1760–1830 | 0.011 | 0.003 | 0.014 |
| Steam, UK 1830–1870 | 0.18 | 0.12 | 0.30 |
| **Steam, UK 1870–1910** | **0.15** | **0.16** | **0.31** |
| Electricity, USA 1899–1919 | 0.04 | 0.06 | 0.10 |
| Electricity, USA 1919–1929 (estimate 1) | 0.07 | 0.07 | 0.14 |
| Electricity, USA 1919–1929 (estimate 2 incl. spillovers) | 0.07 | 0.30 | 0.37 |

All values are percentage points per year. The article notes that the impact of general-purpose technologies typically takes time to materialize; steam's maximum British productivity impact was delayed until the third quarter of the 19th century, almost a century after Watt's patent. TFP is not synonymous with technological change.

**Not found in the accepted source set:** a directly comparable aggregate TFP contribution specifically attributed to chemical industries, Bessemer/Siemens–Martin steel, or internal-combustion engines for 1870–1913. Do not invent a per-tech multiplier from the general TFP residual.

## 3. British India, 1850–1913

### 3.1 GDP per capita benchmark and growth rate

MPD2023 values from CG-26, 2011 international-$ per person:

| Year | GDPpc | Ratio to 1850 |
|---|---:|---:|
| 1850 | 947 | 1.000 |
| 1870 | 850 | 0.898 |
| 1913 | 1,073 | **1.133** |

- 1850–1913 factor: **1.133×**, annualized **0.20%/year**.
- 1870–1913 factor: **1.262×**, annualized **0.54%/year**.
- These are MPD2023 estimates, not direct annual national accounts. The mid-century decline is part of the series and must not be smoothed away without a deliberate model choice.

Meghnad Desai's RBI lecture (2004), drawing on P. R. Brahmananda's *Money, Income and Prices in 19th Century India*, reports a different historical reconstruction: GDP per capita in Maddison's older 1990 PPP dollars rose from M$533 in 1870 to M$599 in 1900 and grew 0.54%/year 1870–1913; the Brahmananda estimates imply roughly 0.5–1% annual per-capita growth in 1861–1900 depending on the income definition. These are not the same data release or price base as MPD2023. The broad finding is slow growth, but preserve the series distinction.

### 3.2 Why growth remained slow: agriculture, not simply absence of factories

Bishnupriya Gupta, “Falling behind: India under colonial rule” (2018):
- Between 1830 and 1880 India deindustrialised as British industrial textiles displaced traditional producers; textile workers were pushed back toward agriculture. However, industrial exports at their peak were less than 5% of GDP, while agriculture accounted for over 60% of GDP in 1800. This limits how much aggregate per-capita GDP can be explained by textile deindustrialisation alone.
- Agricultural growth was mainly extensive. Yields rose in irrigated areas but stagnated elsewhere; foodgrain yields declined in parts of eastern India. Irrigation covered only about 20% of cultivated land in 1935.
- Public investment allocation cited for 1895–1935: about 3–5% of budget to irrigation versus 15–25% to railways. Railways integrated markets but had limited effect on agricultural productivity.
- Modern industries (cotton, jute, tea) did grow rapidly, but were too small to offset broad agricultural stagnation and low human/physical capital across the economy.

### 3.3 Railways — major network expansion, mixed productivity transmission

Historical official compilation, *Collection of Materials* (Government of India, early 20th-century review), section “Communications,” para. 52:
- Open railway mileage (India excluding Burma): 1871 5,077 miles; 1881 9,000 miles; 1891 16,606 miles; 1901 24,082 miles; 1911 31,268 miles; 1912 31,981 miles.
- The same text reports roughly 33,000 miles in India and Burma at the time of writing.
- A separate academic article, “Railways, Development, and Literacy in India,” notes the first passenger line Bombay–Thane opened in 1853 (20 miles), early lines connected ports to hinterlands, and guaranteed returns were backed by the Government of India. A recent comparative study estimates that 5% guarantees shifted downside risk to Indian taxpayers.
- Railways improved market integration and movement of goods, but did not automatically create agricultural yield growth, domestic locomotive production or broad technical spillovers.

### 3.4 Cotton textiles — rapid modern-industry growth from a low base

Census of India 1911 report summary and historical industrial tables:
- 1880–81: 58 cotton mills, approximately 48,000 employees.
- 1910–11: approximately 250 mills and 231,000 employees.
- A longer series in Allen's industrial-history source / historical cotton-industry compilation gives 1875–76: 47 mills, 1.1 million spindles, 9.1 thousand looms; 1913–14: 271 mills, 6.779 million spindles, 104.2 thousand looms, approximately 260 thousand average daily employees.
- A 1913–14 table records the regional capacity becoming more dispersed over time: Bombay still a major centre, but other Indian regions gained share. Do not equate the entire Indian cotton industry with Bombay alone.

These figures show modern industrial expansion, but do not contradict slow aggregate GDPpc growth: the industrial sector started from a small base, and agriculture remained the dominant livelihood sector.

### 3.5 Land revenue, famine and the “drain” — quantified, with geographic and interpretive caveats

**Land revenue (Bombay Deccan case, not all-India average):**
David Hall-Matthews, *Famine Process and Famine Policy: A Case Study of Ahmednagar District, Bombay Presidency, India, 1870–84* (Oxford DPhil, 2002), Table 4.1, p.145, reports land-revenue assessment as a share of estimated produce value:
- 1830–37 before first settlement: 22.17%;
- 1837–48 first ten years of settlement: 14.7%;
- 1862–67 last five years of settlement: 4.17%;
- 1870–75 first five years of revision settlement: 10.00%.

This is a Deccan district/settlement comparison, not a British India-wide uniform tax rate. The thesis argues that rigid ryotwari assessments, revisions, indebtedness and non-remission increased peasant vulnerability in Ahmednagar; the thesis also cautions that rainfall, moneylenders, markets and district-specific transport conditions mattered. Do not implement a flat all-India land tax coefficient from this table.

**Famine excess mortality estimates (all-India, disputed methodology):**
Arup Maharatna, *The Demography of Indian Famines: A Historical Perspective* (LSE PhD thesis, 1992), Table 1.1, pp.34–35:
| Famine | Seavoy | Visaria & Visaria | Maharatna lower–upper |
|---|---:|---:|---:|
| 1876–78 | 6,135,000 | 5,550,000 | 8,217,692–8,217,692 |
| 1896–97 | 5,150,000 | 5,150,000 | 2,624,574–4,055,396 |
| 1899–1900 | 3,250,000 | n.a. | 2,968,757–4,399,579 |
| 1907–08 | n.a. | n.a. | 2,148,788–3,218,776 |

These are estimates of excess deaths, not a single agreed official death count. The thesis explains that baseline mortality, period attribution and under-registration corrections produce large differences. It estimates correction factors of 1.74 for the 1870s, 1.45 for the 1890s and 1.27 for the decade beginning 1901.

**Home Charges / drain (interpretive debate):**
Meghnad Desai's 2004 RBI lecture, using Brahmananda's monetary-history estimates, reports net export surplus rising from 2% of NDP in 1861 to 3.2% in 1899; about half of that surplus was absorbed by Home Charges. Home Charges were estimated at 1.1% of NDP in 1861, 2.34% in 1894 and 2.05% in 1899. The lecture describes these as salaries/pensions, imported stores, debt service and other imperial payments; it also notes that estimates and the interpretation of the “drain” remain debated. Do not use the nationalist critique or the revisionist counter-argument as a single settled coefficient.

### 3.6 Human capital

Census of India 1911 summary reports only 59 persons per 1,000 population able to read and write (5.9%); literate males 106 per 1,000, females 10 per 1,000. A uniform definition of literacy as ability to read and write a short letter was adopted in 1911. Earlier census definitions and enumeration differ; a comparable 1850/1870/1900 all-India literacy series was not verified in this pass. Use 1911 as an anchor only, not a backcasted constant.

## 4. Japan, 1868–1913

### 4.1 GDP per capita benchmark

MPD2023 values from CG-26, 2011 international-$ per person:

| Year | GDPpc | Ratio to 1850 |
|---|---:|---:|
| 1850 | 1,436 | 1.000 |
| 1870 | 1,580 | 1.100 |
| 1913 | 2,431 | **1.693** |

1850–1913 factor **1.693×**, annualized **0.84%/year**. This is a long-run benchmark; the model should not force the economy to match an exact path every month.

### 4.2 Education — attendance proxy, not literacy

Japanese Ministry of Education, *Japan's Modern Educational System*, and MEXT historical summary:
- Elementary school attendance in 1875: 35.4% total (boys 50.8%, girls 18.7%).
- 1887: 45.0% total (boys 60.3%, girls 28.3%).
- 1895: 61.2% total (boys 76.7%, girls 43.9%).
- 1905: 95.6% total (boys 97.7%, girls 93.3%).
- 1907: 97.4% total; the compulsory elementary period was extended to six years from 1908.

Attendance is not the same as adult literacy or years of schooling completed. It also changed with fees, local funding and economic conditions; MEXT notes the 1886 order and 1900 abolition of tuition affected attendance. Do not map attendance directly to a national literacy share without a separate cohort model.

### 4.3 Railways

Naofumi Nakamura, University of Tokyo ISS Discussion Paper F-196 (2021), railway-distance series:
- 1872: 29 km;
- 1880: 123 km;
- 1890: 2,251 km;
- 1900: 5,999 km;
- 1910: 8,661 km;
- 1913: 12,401 km.

The paper discusses international locomotive trade and technology transfer; the expansion was supported by state and private railways, imported rolling stock and international firms. Railway route growth is a measurable capital/infrastructure channel, but route length alone does not measure utilisation, freight productivity or domestic production of locomotives.

### 4.4 Raw silk and exports

G. C. Allen, *A Short Economic History of Modern Japan, 1867–1937* (1946), Appendix B, Table XII, pp.172–173; source notes cite Department of Agriculture and Forestry / Oriental Economist / Japan Silk Year-Book.

| Period | Raw silk production (thousand kwan) | Raw silk exports (thousand kwan) | Export value (million yen) |
|---|---:|---:|---:|
| 1868 (initial value shown in 1868–72 row) | 278 | 175 | 6 |
| 1889–93 annual average | 1,110 | 662 | 27 |
| 1899–1903 annual average | 1,924 | 1,110 | 69 |
| 1909–13 annual average | 3,375 | 2,563 | 144 |

Allen's conversion table gives 1 kwan = 8.27 lb. Keep the original kwan in the data register to avoid false precision from historical unit conversions. The source labels the first row “1868–72 (annual average)” but annotates production as “(1868) 278”; treat 278 as the stated initial value, not a fully harmonized five-year average.

The data show a large export-oriented productivity and market channel in sericulture, but do not imply every region or POP was engaged in silk. A model should represent regional specialization, seasonal work and trade demand rather than distribute the silk output uniformly.

### 4.5 Cotton industry and imported raw cotton

Allen, Table XIV, pp.173–174, records raw-cotton imports (thousand piculs):
- 1875–79: 20;
- 1885–89: 100;
- 1890–94: 710;
- 1895–99: 2,230;
- 1900–04: 2,740;
- 1905–09: 3,610;
- 1910–14: 5,610.

This indicates late take-off in cotton manufacturing and increasing dependence on imported raw cotton. Do not backdate this industrial scale to 1836 or treat imports as domestic raw-cotton production.

## 5. Review of Claude's ECON-GROWTH report and calibration metrics

### 5.1 Important baseline mismatch in the reported India error

The JSON report states:
- measure: engine GDPpc ratio to January 1837;
- engine after: EIC 1850 = 0.814; EIC 1913 = 1.713;
- MPD target: India 1913 over 1850 = 1.133.

These are different denominators. The comparable engine ratio is:

`1.713 / 0.814 = 2.104×`

not 1.713×. Annualized over 63 years:
- MPD2023 India 1850–1913: about 0.20%/year;
- engine after 1850–1913: about 1.19%/year.

Thus India overshoots by about 0.99 percentage points/year on this comparison, materially more than the MSG-037 “1.71 vs 1.13” wording suggests. Correct the benchmark table and growth report before tuning.

For the same 1850–1913 comparison:
| Country | Engine after 1850 | Engine after 1913 | Engine ratio 1913/1850 | MPD2023 target |
|---|---:|---:|---:|---:|
| EIC / India | 0.814 | 1.713 | **2.104×** | **1.133×** |
| JAP | 0.933 | 1.006 | **1.078×** | **1.693×** |
| QNG / China | 1.020 | 1.400 | **1.373×** | **1.148×** |

The engine ratios above are calculated from the values in Claude's report, not independently simulated by ChatGPT. They assume the 1850 and 1913 output rows use the same engine denominator (January 1837), so division cancels that denominator.

### 5.2 Formula critique

Claude's reported productivity expression is:

`ln(p/p0) = 0.035 × newEconTechs × literacy² + 0.4 × (literacy − literacy0)`

with a reported 6%/month adjustment.

This is a project design, not a historical equation. Research suggests:
- TFP residual is not equivalent to technology invention; it also contains organisation, resource allocation, structural change, measurement error and other omitted influences.
- Germany's catch-up benefited materially from structural labour reallocation out of agriculture (Crafts estimates 0.36 pp/year in 1871–1910), not only new technology.
- Japan's 1890–1913 labour-productivity growth had much larger capital deepening (1.60 pp/year) and education contribution (0.55 pp/year) than net TFP (0.34 pp/year).
- India's railways integrated markets, but low irrigation investment and weak agricultural yield growth constrained aggregate growth. A national tech counter cannot substitute for sector mix, agricultural productivity and capital formation.
- General-purpose technology spillovers take time; steam's measured contribution was delayed and modest before 1870. Electricity's measured US contribution in 1899–1919 was only 0.10 pp/year total in one table, with a later 1919–29 estimate showing larger spillovers.

**Recommendations (project design, not historical facts):**
1. Correct all country comparisons to identical start/end years and territory definitions before adjusting coefficients.
2. Keep a distinction between capital deepening, labour quality/education, within-sector productivity and structural reallocation. Do not force all GDPpc growth into one national productivity scalar.
3. Use country-specific historical target bands, not one universal TFP coefficient. UK/Germany data support different catch-up paths; Japan and India show different factor mixes.
4. Treat technology unlocks as availability, then model adoption/diffusion with lags, capital requirements, trained labour and sector exposure. Avoid a full national productivity jump at the instant a tech is researched.
5. Use historical proxies with correct definitions: Japan's school attendance is not literacy; India 1911 literacy is not directly comparable with earlier census classifications.
6. Keep 1836/1850 baseline gaps explicit. Do not invent 1836 India/Japan/China denominators from a different MPD series or interpolate silently.
7. Run sensitivity tests for the 0.035 coefficient, literacy-squared term and 6%/month adjustment. Track annual GDPpc growth, productivity by sector, capital/worker, agricultural yield, employment shares and country rank order. Guard against monthly oscillation and one-tech discontinuities.

## 6. Data confidence and gaps

| Item | Confidence / status |
|---|---|
| UK/Germany growth-accounting table 1871–1913 | High for source-defined estimates; crude TFP is a residual |
| France/USA/Japan growth accounting | High for 1890–1913 only; not a 1870–1913 series |
| Technology-specific steam/electricity contributions | Medium-high; model-based aggregate contributions, not pure invention effect |
| India MPD2023 GDPpc | Medium; historical reconstruction, exact release/unit preserved |
| India land revenue incidence | Medium for Bombay Deccan case study; not all-India coefficient |
| India famine mortality | Medium/low due baseline, under-registration and attribution differences |
| India railway mileage | High for the cited official historical compilation; 1913 value is approximate 33,000 miles including Burma |
| India cotton mills/employment | Medium-high; official census/industrial tables, definitions and coverage vary |
| Japan school attendance | High as attendance statistics; not literacy |
| Japan rail route length | High for source series; route length does not equal utilisation |
| Japan silk output/export | Medium-high historical series; first-row dating/unit caveat retained |
| India literacy before 1911 | Unknown under comparable definition |
| Exact annual TFP attributed to chemicals, Bessemer/Siemens–Martin steel, ICE, 1870–1913 | Unknown in inspected sources |
| Japan/India sector-specific capital stock and annual labour productivity for each year | Unknown in this pass |

## 7. Sources and references

### Growth accounting
- Nicholas Crafts (2020), *British Relative Economic Decline in the Aftermath of German Unification*, Warwick Economics Research Paper 1295 / CAGE Discussion Paper 501, especially pp.13–14, Tables 1–2. Working-paper version; WRAP access terms permit personal research/study and educational/non-profit use with attribution, not redistribution of the paper as a project asset. https://wrap.warwick.ac.uk/id/eprint/140314/1/WRAP-twerp-1295-Crafts-2020.pdf
- Nicholas Crafts and Pieter Woltjer, “Growth Accounting in Economic History: Findings, Lessons and New Directions,” *Journal of Economic Surveys* 35(3), 670–696, DOI 10.1111/joes.12348, especially Tables 1 and 5. https://onlinelibrary.wiley.com/doi/10.1111/joes.12348

### India
- Maddison Project Database 2023, via CG-26 report: https://www.rug.nl/ggdc/historicaldevelopment/maddison/ ; DOI dataset record https://doi.org/10.34894/INZBF2.
- Bishnupriya Gupta (2018), “Falling behind: India under colonial rule,” Ideas for India, especially sections “Agricultural stagnation” and “Rise of modern industries.” https://www.ideasforindia.in/topics/macroeconomics/falling-behind-india-under-colonial-rule
- Government of India, *Collection of Materials* (early 20th-century review), §52 “Improvement in communications,” railway mileage table. https://ignca.gov.in/Asi_data/39609.pdf
- “Railways, Development, and Literacy in India,” *The Journal of Economic History* (2023), DOI/article page. https://www.cambridge.org/core/journals/journal-of-economic-history/article/railways-development-and-literacy-in-india/3AE85D33F6AF48540412908FA8A80EFF
- David Hall-Matthews (2002), *Famine Process and Famine Policy: A Case Study of Ahmednagar District, Bombay Presidency, India, 1870–84*, Oxford DPhil thesis, especially Table 4.1 p.145. https://ora.ox.ac.uk/objects/uuid:5e072387-d56c-496a-a90a-2ee2f31c29dd
- Arup Maharatna (1992), *The Demography of Indian Famines: A Historical Perspective*, LSE PhD thesis, Table 1.1 pp.34–35. https://etheses.lse.ac.uk/1279/1/U062489.pdf
- Meghnad Desai (2004), “Drains, Hoards and Foreigners: Does the Nineteenth Century Indian Economy Have any Lessons for the Twenty First Century India?”, RBI Bulletin, 18 October 2004. https://www.rbi.org.in/scripts/BS_ViewBulletin.aspx?Id=5644
- Edward Albert Gait, *Census of India, 1911, Vol. I, Part I — Report*, 1913 (public domain original; 1911 literacy and industry factoids). https://wagtail.ruralindiaonline.org/en/library/resource/census-of-india-1911-volume-i-part-i---report/
- *Statistical Abstract Relating to British India, 1903–04 to 1912–13*, 48th number (1915), Digital South Asia Library. https://dsal.uchicago.edu/statistics/1903_excel/

### Japan
- G. C. Allen (1946), *A Short Economic History of Modern Japan, 1867–1937*, Appendix B, Tables XII and XIV, pp.172–174. Historical statistical series; scan hosted by Lal Bahadur Shastri National Academy of Administration. https://gsl.lbsnaa.gov.in/opac-tmpl/bootstrap/Books/105723.pdf
- Naofumi Nakamura (2021), “The First Globalization and the US-East Asian Locomotive Trade: Focusing on Baldwin Locomotive Work and Frazar & Co. in Japan,” University of Tokyo ISS Discussion Paper F-196, railway distance series. https://www.iss.u-tokyo.ac.jp/publishments/dpf/pdf/f-196.pdf
- Japanese Ministry of Education, *Japan's Modern Educational System*, “The Upward Trend in the Attendance Rate.” https://www.mext.go.jp/b_menu/hakusho/html/others/detail/1317322.htm

## 8. Project status

- No simulation code, country initial values, productivity coefficient, technology effect, literacy, railways, cotton, land revenue or famine parameters were modified.
- This is a research and review deliverable. Claude remains technical decision owner.
