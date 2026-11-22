# CG-26 — GDP dài hạn, cơ cấu nghề nghiệp và nhiên liệu hộ gia đình (1830s–1913)

**Ngày nghiên cứu:** 2026-11-22  
**Phạm vi:** nguồn thống kê lịch sử / học thuật công khai; không dùng dữ liệu hay cơ chế từ Paradox.  
**Đơn vị GDP:** international-$, giá cố định 2011, trừ khi ghi khác.  
**Nguyên tắc:** `—` nghĩa là không có quan sát được xác minh cho đúng mốc/quốc gia trong tập dữ liệu đã kiểm tra; không nội suy và không lấy số của nước khác thay thế.

## 1. Tóm tắt kết quả

1. Dùng **Maddison Project Database 2023 (MPD2023)** làm chuỗi GDP/đầu người thống nhất, thay vì ghép các phiên bản 2018/2020/2023. MPD2023 do Bolt và van Zanden công bố; bản phân phối được kiểm tra ghi CC BY 4.0. Chỉ số được diễn giải ở international-$ giá 2011. Bộ dữ liệu quốc gia có 169 nền kinh tế, giai đoạn 1–2022; bản mirror có schema 2023 `Full data` trích từ workbook gốc `mpd2023_web.xlsx`. Bản 2020 là một release khác; không nối/ghép hai release thành một chuỗi duy nhất.
2. Có quan sát chính xác 1836 và 1850 cho UK, France, Germany và USA; Trung Quốc/Brazil có lỗ hổng 1836 nhưng có 1850; India/Japan không có đúng năm 1836 nhưng có 1850. Những con số này là **ước lượng lịch sử tái dựng**, không phải national accounts được đo trực tiếp như thống kê thế kỷ 20.
3. Không có chuỗi “Prussia” riêng trong bảng đã mở; mã Germany là **Germany aggregate**, không được gắn nhãn là Vương quốc Phổ. Tương tự, “China” không đồng nghĩa biên giới Qing tại mọi mốc, và “India” không phải một nhà nước có chủ quyền năm 1836. Không tìm thấy chuỗi World theo đúng workbook MPD2023 trong lượt truy xuất này, vì vậy World để `unknown`, không thay bằng World từ Maddison 2010/2018.
4. Census England 1831 cho số nghề nghiệp nam giới từ 20 tuổi rất cụ thể. Nhóm manufacture có 310,808 người; retail trade/handicraft có 957,503. Hai nhóm khác nhau theo câu hỏi của biểu mẫu và không thể coi tất cả là công nhân nhà máy.
5. Bảng phân bổ than của Anh cho thấy domestic coal 7.2 triệu long tons năm 1830 và 8.2 triệu năm 1840. Domestic tương ứng 30.5% và 24.2% tổng các khoản sử dụng được liệt kê trong cùng bảng; đây là tỷ trọng của bảng use-allocation, không phải share phổ quát của mọi loại nhiên liệu hộ gia đình.
6. Với Bắc Trung Quốc, bằng chứng mạnh về địa lý cung ứng và ứng dụng than ở hộ gia đình/đô thị nhưng yếu về tổng lượng đại diện cho cả Qing. Với Belgium/Ghent, nghiên cứu định lượng có share **nhiên liệu hộ gia đình nói chung**, không phải share than riêng; không chuyển trực tiếp thành tỷ lệ than cho Ruhr.
7. Dữ liệu gỗ: một câu trả lời tại Hansard ghi khoảng 360,000 loads timber nhập từ Norway/Sweden/Russia năm 1830 (141,000 trên tàu nước ngoài + 219,000 trên tàu Anh). Đây là số được phát biểu trong tranh luận nghị viện, không phải bảng hải quan độc lập đã đối chiếu; chỉ là tín hiệu thương mại, chưa dùng để hiệu chỉnh tiêu thụ gỗ/củi.

## 2. GDP per capita — MPD 2023

### 2.1 Bảng quan sát theo năm

Bảng dưới đây tổng hợp các điểm dữ liệu đã xác minh trong chuỗi MPD2023. `—` không có quan sát đã khóa trong lượt nghiên cứu này.

| Nền kinh tế / chuỗi MPD | 1836 | 1850 | 1870 | 1900 | 1913 |
|---|---:|---:|---:|---:|---:|
| United Kingdom | 3,937 | 4,332 | 5,829 | 7,594 | 8,212 |
| France | 2,089 | 2,545 | 2,990 | 4,584 | 5,555 |
| Germany (không phải Prussia riêng) | 2,173 | 2,276 | 2,931 | 4,758 | 5,815 |
| United States | 3,470 | 3,632 | 4,803 | 8,038 | 10,108 |
| China (không phải biên giới Qing được tái dựng theo game) | — | 858 | 945 | 972 | 985 |
| India (lãnh thổ lịch sử, không phải sovereign state năm 1836) | — | 947 | 850 | 955 | 1,073 |
| Japan | — | 1,436 | 1,580 | 2,123 | 2,431 |
| Brazil | — | 867 | 1,084 | 874 | 1,046 |
| Russia | — | — | 789 | 1,049 | 1,163 |
| Ottoman / Turkey | — | — | 1,165 | — | 1,473 |
| World | — | — | — | — | — |

**Cách đọc và giới hạn:**
- Tất cả giá trị hiện diện là 2011 international-$ per person, không phải GBP, USD hiện hành, giá danh nghĩa hoặc GDP tổng.
- UK/France/Germany/USA có quan sát hàng năm quanh 1836 và 1850. Với China/Brazil, MPD2023 không có observation 1836 trong chuỗi đã mở; China có các mốc 1830 = 846, 1840 = 849, 1850 = 858; Brazil có 1820 = 867 và 1850 = 867. Không tự nội suy ra năm 1836.
- India có 1831 = 945 và 1841 = 944, không có exact 1836 trong bảng đã kiểm tra; Japan có 1820 = 1,317 và 1846 = 1,436, không có exact 1836.
- World GDPpc nằm trong bộ dữ liệu regional/world khác với full country file; chưa khóa được workbook sheet và observations của MPD2023 cho các năm yêu cầu. Không lấy World 1870/1913 từ bảng Maddison đời cũ để trộn.
- MPD2023 “Germany” không phải chuỗi Prussia. Không nên gọi 1836 GDPpc Germany là GDPpc của Phổ, dù Phổ là một thành phần quan trọng.
- Nga và Ottoman có độ phủ lịch sử khác nhau; các ô trống không có nghĩa GDP bằng 0.

### 2.2 Gợi ý sử dụng cho ECON-GROWTH

- Ưu tiên GDPpc làm **mốc living-standard / productivity index**, không nhân thẳng GDPpc vào physical output.
- Tính growth factors từ cùng một country series và cùng MPD release: ví dụ `GDPpc(t) / GDPpc(1836)` chỉ khi cả hai mốc đều tồn tại trong cùng chuỗi.
- Với country lacking 1836 (China, India, Japan, Brazil, Russia, Ottoman trong bảng đã xác minh), không chế tạo denominator bằng nội suy không được chấp nhận. Hoặc dùng benchmark nearest-year đã được phê duyệt và ghi rõ, hoặc giữ growth calibration unknown.
- Không suy diễn GDP world bằng cách cộng GDPpc các quốc gia; cần population-weighted regional/world aggregate từ workbook regional data.
- Các chuỗi là estimates, có thể sửa theo nghiên cứu mới. Không coi chênh lệch từng năm là biến động ngắn hạn hàng tháng; lấy annual/decadal trend và smoothing cho game.

## 3. England 1831 — cơ cấu nghề nghiệp nam giới trên 20 tuổi

### 3.1 Bảng gốc

Nguồn bảng: *1831 Census of Great Britain, Abstract of Answers*, Table [1], “Population Abstract”, England Country (Vision of Britain digitization). Biểu mẫu hỏi số nam giới “upwards of Twenty Years old”. Phân loại được xác định ngay trong Census Act 1830 và giải thích trong tài liệu Census 1831.

| Nhóm điều tra | Người | % trên tổng sáu nhóm nghề nghiệp |
|---|---:|---:|
| Farmers employing labourers | 139,779 | — |
| Farmers not employing labourers | 93,640 | — |
| Agricultural labourers | 739,488 | — |
| **Agriculture subtotal** | **972,907** | **32.6%** |
| **Manufacturing** | **310,808** | **10.4%** |
| **Retail trade & handicrafts** | **957,503** | **32.1%** |
| **Labourers (non-agricultural)** | **493,746** | **16.5%** |
| **Capitalists, professionals** | **179,153** | **6.0%** |
| **Servants (male)** | **70,282** | **2.4%** |
| **Six principal employed classes subtotal** | **2,984,399** | **100.0%** |
| Other males over 20 (not servants) | 188,348 | tách riêng |
| Sum of displayed category rows | 3,172,747 | — |

Census table has a small reconciliation issue: sum of the displayed rows is 3,172,747; the separate total male 20+ count cited by later literature is approximately 3,173,000 (Wrigley rounds the employed male group to 2.985 million). Keep the printed category counts and disclose the rounding/discrepancy; do not make a hidden adjustment.

### 3.2 Giải thích phân loại

- **Manufacture** asks about people employed in manufacturing or making manufacturing machinery; it specifically excludes warehouse labourers, porters and messengers (these move to the non-agricultural labour class).
- **Retail trade or handicraft** includes masters, shopmen, journeymen, apprentices and skilled work in the business. Census guidance defines retailers as selling to the consumer. It is not identical to modern manufacturing.
- **Non-agricultural labourers** includes miners, fishermen, boatmen, canal excavators, roadmakers, toll collectors and other bodily labour not already classified in agriculture/manufacture/retail.
- **Capitalists/professionals** includes wholesale merchants, bankers, capitalists, professional persons, artists, architects, teachers, clerks, surveyors and other educated men.
- **Other** is not a clean occupation class; do not distribute it to a sector without evidence.
- These are male counts; female servants were separately enumerated (515,648 in the England table) and women in other economic categories are not represented in this male-only breakdown.

Wrigley (2018) explains why manufacture is narrower than craft/trade: the census separates occupations serving national/international markets from local retail and handicraft activity. Therefore:
- Do **not** translate all 957,503 retail/handicraft to “workers”.
- Do **not** treat 310,808 manufacturing as total factory employment; it includes manufacturing broadly and does not mean everyone worked in a mechanized factory.
- The census categories are a useful England 1831 anchor, not a transferable fixed factory share for every country in 1836.

### 3.3 Other countries

No sufficiently comparable country-wide male occupational cross-tab for France or Prussia in the requested 1836–1840 window was verified in this pass. The available country-specific material does not match the English 1831 age/sex/occupation definitions. Record France/Prussia occupation shares as `unknown` rather than transplant England’s categories.

## 4. Household coal and regional access

### 4.1 Great Britain — allocation by use

Bethan Lloyd Jones (Cardiff dissertation, 2008), Table 1.1 (source: Pollard 1964, p.229) and Table 1.2 (calculated from Mitchell 1984, p.16) provide these historical series.

**Annual average output, thousand tons:**

| Decade | Average coal output (000 tons) | Change |
|---|---:|---:|
| 1820–1830 | 22,659 | — |
| 1830–1840 | 32,379 | +42% |
| 1840–1850 | 46,337 | +43% |

**Estimated consumption of the output of the main British coalfields, million tons:**

| Use | 1816 | 1830 | 1840 | 1855 |
|---|---:|---:|---:|---:|
| Exports | 0.3 | 0.3 | 1.6 | 4.4 |
| Coastwise | 3.5 | 4.8 | 6.7 | 8.3 |
| Ironworks | 2.8 | 4.8 | 7.3 | 15.7 |
| General manufacturing | 3.5 | 5.2 | 7.9 | 15.0 |
| Domestic | 5.4 | 7.2 | 8.2 | 10.4 |
| Manufacturing & domestic railed south | — | — | — | 1.4 |
| Railways | — | — | 0.1 | 1.2 |
| Steamships | — | — | 0.6 | 1.7 |
| Collieries | 0.9 | 1.3 | 2.2 | 3.8 |

The first five uses plus colliery use sum to 23.6 Mt in 1830 and 33.9 Mt in 1840 (the 1855 table adds additional use headings). Domestic share of the listed uses is therefore:
- 1830: 7.2 / 23.6 = **30.5%**;
- 1840: 8.2 / 33.9 = **24.2%**.

These ratios are calculated from the source table, not quoted official national ratios. “Domestic” is the study’s end-use category; it is a more useful household benchmark than total coal output, but must not be read as a universal share of all household energy (wood, peat, charcoal, etc.). Source text states domestic was the biggest single use category until the 1850s. Industrial demand grew quickly: ironworks went from 4.8 Mt (1830) to 7.3 Mt (1840), and general manufacturing from 5.2 to 7.9 Mt.

**Caveat:** the 1830s decade average of 32.379 Mt is not the single-year 1830 production figure. The “1830” and “1840” entries in the use table are allocated consumption estimates, not a mine census. Do not use their sum as a replacement for a national production series without checking the underlying definition.

### 4.2 Qing China — Beijing and Shanxi

Research on coal marketing in Qing Beijing describes an identifiable supply chain from Xishan mining areas toward the capital: wholesalers/merchants transported coal using pack animals, sold through depots and coal shops near city gates, and households bought processed coal. One described fuel form was “coal cake” made from crushed coal/cinders mixed with loess. This is evidence of domestic household consumption and a market/distribution system, but not evidence that all Qing provinces or villages had comparable access.

A secondary estimate cited in the Beijing coal literature puts household/city use at roughly 250 kg per capita per year for a population estimate around 0.8–1.0 million (roughly 200,000–250,000 tonnes/year). Treat this as **low-confidence order-of-magnitude context**, not an 1836 census measurement: the period alignment, boundary and source method are not sufficiently precise for a national coefficient.

For the engine, `householdCoalAccess` should be spatially differentiated:
- Higher probability in Beijing/North China basins and urban corridors with established coal transport.
- Lower probability where transport costs, distance to coalfields, river/road connection or local fuel substitutes constrain access.
- Do not set every Qing POP to a uniform coal consumption coefficient.
- Do not equate presence of a coalfield with household access: transport, market depots, fuel processing and purchasing power matter.

### 4.3 Belgium and Ruhr

The inspected comparative research on Ghent/Leiden provides domestic-fuel expenditure/consumption context: household use dominates the energy mix in the cited mid-19th-century urban comparisons (reported around 74% in Ghent and 85% in Leiden). **Those percentages are for domestic fuels/energy use, not a coal-only percentage**, and Leiden is in the Netherlands. They cannot be copied into a Belgium-wide or Ruhr coal share.

For Ruhr and the wider Belgian industrial districts, the sources inspected establish the broader mining/industrial geography and the importance of coal to industry, but did not yield a harmonized 1830s split of coal between households, ironworks and other industry. Keep numeric household-coal shares for Belgium/Ruhr `unknown` until a comparable regional end-use series is found.

## 5. Timber and firewood — optional evidence

A Commons debate in the UK House of Commons on 18 March 1831 stated that timber imports from Norway, Sweden and Russia in 1830 amounted to approximately 141,000 loads in foreign ships and 219,000 loads in British ships, or **360,000 loads** total. This is a parliamentary statement in debate, not a customs table independently reconciled here. It gives evidence of substantial Baltic/Nordic timber trade, but does not measure domestic firewood use, total timber supply or the share of timber used as fuel.

Use only as a qualitative/import-availability clue. Do not infer a physical wood production or household-firewood coefficient from this single shipping figure.

## 6. Calibration implications for Victori3 (project proposals, not historical facts)

1. **GDP growth:** use MPD2023 per-capita series as long-run annual reference, not an instantaneous multiplier. Keep one release and one unit; for a country without 1836 observation, use explicit fallback logic with provenance or leave its initial growth calibration unknown. Never treat Germany aggregate as Prussia.
2. **Occupations:** England 1831 provides a narrow but valuable cross-check. It supports that manufacture was ~10.4% of the six enumerated employed male classes, while agriculture ~32.6% and retail/handicraft ~32.1%. It does not support a universal 21% factory share. If engine’s `FACTORY_SHARE_OF_WORKERS_1836` remains 0.21, keep it labelled as a **project assumption**, not a census finding.
3. **Household coal:** UK end-use evidence supports a domestic allocation of roughly 24–31% within that source’s 1830/1840 allocation tables. Treat this as a country/time anchor only. A spatial-access model should consider fuel availability, travel cost, markets and urbanization.
4. **China:** make coal access regional, especially around coalfield-to-city supply corridors; source evidence is strong for parts of north China, not Qing-wide share.
5. **Belgium/Ruhr:** keep exact household-coal fractions unknown; do not convert total domestic-energy percentages into coal percentages.
6. **Timber:** treat imports as supply capacity and trade, not household fuel production. A separate timber/firewood balance is needed before changing output or consumption constants.

## 7. Remaining unknowns / source limits

| Question | Current result |
|---|---|
| MPD2023 exact 1836 values for China, India, Japan, Brazil, Russia, Ottoman | No exact 1836 observation confirmed for these series in this pass; keep unknown |
| MPD2023 separate Prussia series | Not found; use Germany only with correct label |
| MPD2023 World GDPpc at all requested points | Not extracted from official regional/world workbook; keep unknown |
| Comparable national occupation counts for France/Prussia 1836–1840 | Unknown under the same definitions |
| China/Qing national household-coal share | Unknown |
| Belgium/Ruhr 1830s household coal split | Unknown |
| UK 1830s wood/firewood domestic-use share | Unknown; timber imports alone do not determine it |

## 8. Sources and provenance

### GDP per capita
- Bolt, J. and J. L. van Zanden (2024), “Maddison style estimates of the evolution of the world economy: A new 2023 update,” *Journal of Economic Surveys*, DOI: https://doi.org/10.1111/joes.12618.
- University of Groningen / GGDC, Maddison Project Database 2023: https://www.rug.nl/ggdc/historicaldevelopment/maddison/ ; downloadable workbook and dataset landing page: https://dataverse.nl/dataset.xhtml?persistentId=doi:10.34894/INZBF2. Release notes and source structure checked against the 2023 data documentation. License: CC BY 4.0 as stated by the dataset distributor; retain required attribution and DOI.
- Our World in Data, “GDP per capita — Maddison Project Database”: https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database (source Bolt & van Zanden MPD2023; 2011 international-$; minor OWID processing; CC BY).
- Individual annual-value extracts cross-checked on Statizoid’s annual tables, which identify MPD2023 / OWID source and 2011 international-$:
  - United Kingdom: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/united-kingdom/
  - United States: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/united-states/
  - France: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/france/
  - Germany: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/germany/
  - China: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/china/
  - India: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/india/
  - Japan: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/japan/
  - Brazil: https://economy.statizoid.com/stat/gdp-per-capita-maddison-project-database/brazil/
- Nations Inquiry country tables for 1870 and 1913 were used as secondary value cross-checks, not as a replacement for the MPD data: https://www.nationsencyclopedia.com/WorldStats/World-GDP-per-capita-1870.html and https://www.nationsencyclopedia.com/WorldStats/World-GDP-per-capita-1913.html. Use the original MPD2023 workbook/source for final downstream distribution.

### Occupations
- *Census Act 1830*, 11 Geo. IV & 1 Will. IV c.30, schedule/question wording: https://www.legislation.gov.uk/ukpga/Geo4and1Will4/11/30/pdfs/ukpga_18300030_en.pdf.
- *1831 Census of Great Britain, Abstract of Answers*, Table [1], “Population Abstract”, England Country, digitized in Vision of Britain / Historical Statistics on Industry: https://www.visionofireland.org/unit/10061325/cube/OCC_PAR1831.
- Wrigley, E. A. (2018), “The occupational structure of England in the early nineteenth century,” *Local Population Studies* 100, pp. 25–32. Used for contextual interpretation and rounded labour-force figures; primary category counts remain from the census table.

### Coal / energy
- Lloyd Jones, Bethan (2008), Cardiff University dissertation, coal output and allocated uses, Tables 1.1–1.2. Table 1.1 cites Pollard (1964, p.229); Table 1.2 calculated from Mitchell (1984, p.16). PDF: https://orca.cardiff.ac.uk/id/eprint/55770/3/U584296-%20DEC%20PAGE%20REMOVED.pdf.
- Chiu, Chung-lin, “The Marketing and Use of Coal in Beijing during the Qing Dynasty,” Institute of History and Philology, Academia Sinica: https://www1.ihp.sinica.edu.tw/en/Publications/Bulletin/1177/Article/1768. Used for the Xishan–Beijing supply chain and household fuel context.
- “Technology, economics, and politics in China's coal-mining industry, 1850–1895,” historical study (used only for qualitative context about distribution costs and limited early demand): cite the article’s journal record before using any numeric calibration.
- “Energy and natural resource dependency in Europe, 1600–1900” / Ghent-Leiden energy comparisons: used only to distinguish domestic energy expenditure from coal-specific use; no coal-share coefficient adopted for Belgium/Ruhr.
- UK House of Commons debate, 18 March 1831, timber imports from Norway/Sweden/Russia: https://api.parliament.uk/historic-hansard/commons/1831/mar/18/timber-duties.

## 9. Status for the project

- No simulation code, country initial values, householdCoalAccess, occupation coefficients, timber output or GDP-growth constants were modified.
- This report supplies research anchors and explicitly labelled unknowns; Claude owns the final engineering choice and implementation.
