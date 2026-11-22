# CG-25 — Chuỗi sắt, than, công cụ và cơ cấu giá trị bông Anh, 1830–1840

- Ngày: 2026-11-22
- Branch: `ccr-b27f3fb8-epfpd6`
- Yêu cầu: MSG-027, P0
- Phạm vi: Great Britain, tập trung mốc 1830–1837; mở rộng đến 1840 khi nguồn có dữ liệu liên quan.
- Nguyên tắc: ghi rõ số liệu thống kê, ước lượng của tác giả, phép suy ra và phần chưa biết. Không dùng số liệu game Paradox. Đơn vị gốc được giữ lại; mọi quy đổi/ratio được đánh dấu derived.
- Kết luận không phải thay đổi game code hoặc calibration constants.

## 1. Kết luận điều hành

1. **Giá trị bông thô trong giá trị ngành cotton manufacture năm 1833 là 26.27%, không phải 21%.** Robert Kane (1845) trích phân tích của Edward Baines (1833) và cho tổng giá trị thành phẩm £31,338,693, cotton wool £8,244,693, tiền công £10,419,200. Tỷ trọng raw cotton là 26.27%; tiền công 33.16%; coal 1.08%. Đây là ước tính ngành được Kane tái bản, không phải census/accounting return toàn quốc. Nếu hệ số 0.21 của ECON-CAL-02 có nghĩa là raw-cotton input value / manufactured cotton value, bằng chứng này gợi ý 0.263; không được áp dụng tỷ lệ giá trị này trực tiếp như tỷ lệ khối lượng cotton-to-cloth.
2. **Pig iron:** McCulloch (1837), Vol. II, printed p. 10, đưa bảng district returns với tổng năm 1830 là 678,417 tons. James M. Swank (1902), dựa trên Government statistics, ghi 677,417 gross tons. Hai tổng lệch 1,000 tons; các dòng district trong McCulloch cũng không cộng khớp total row. Giữ cả hai, đánh dấu discrepancy, không âm thầm chọn một số. Swank cho mốc 1833 700,000 và 1836 1,000,000 gross tons.
3. McCulloch nói năm 1835 lượng iron produced “at least as great as in 1830” và có thể lớn hơn; đó là nhận định đương thời, không phải annual official figure. Khoảng 70% pig iron được chuyển thành wrought iron (bars, bolts, rods etc.); đây là tỷ lệ tổng hợp, không phải bảng annual bar-iron output.
4. **Than:** không tìm thấy annual national coal production series 1830–1836 đủ đáng tin để chốt. McCulloch (1837), Vol. II, printed p. 8, ước lượng 4.2m tons Tyne/Wear trade, khoảng một phần năm tổng lượng coal consumed in and exported from Great Britain. Phép suy ra 4.2m × 5 ≈ 21m tons là throughput/consumption-and-export proxy, không phải mine output. McCulloch nói rõ 135,000 người trực tiếp tham gia coal trade chỉ là approximation.
5. **Coal intensity in iron:** French Commission of Inquiry observations for Staffordshire during 1828–1837, reproduced by Kane (1845), give approximately 8 tons 6 cwt coal + 1 ton 16 cwt slack per ton of merchant bar iron, plus 4 tons 9 cwt ore and one ton limestone. Kane says total fuel is about ten times the weight of bar iron and roughly 40% of cost. Summing the two fuel cost lines in his table gives 37.0% of the stated total; use the author's 40% as a rounded prose claim and preserve the exact table.
6. **Iron employment:** McCulloch's estimate is about 69,000 persons directly engaged in the iron business; 207,000–240,000 people including dependants. This is an extrapolation from South Wales/Monmouthshire, not a census. A five-furnace works producing about 200 tons bar iron weekly is said to provide direct employment for nearly 1,400 people, but its printed occupational subtotals do not fully reconcile with its total row; do not calibrate per-level workers from it.
7. **Tools and hardware:** McCulloch reports 13,430 hands in 10 named Sheffield trades in 1833 (including knives/forks, pocket-knives, razors, scissors, files, saws and edged tools), explicitly excluding steel conversion and other trades. Birmingham's 1831 official returns list about 10,000 adult males aged 20+ across a very wide range of metal/hardware occupations; it is not a complete all-age workforce. A broad 300,000–325,000 GB estimate for iron, hardware and cutlery workers is explicitly conjectural and should not be used as a clean tool-workers count.
8. **Cross-country industrial employment:** the sources located do not provide a consistent 1836–1840 total industrial workforce for France, Belgium, Prussia/Zollverein and Russia. Woodbury (1836) does provide cotton-sector comparisons and wage estimates: US cotton-factory workers about 57,466 in 1832 per McCulloch (with conflicting estimates); France's 1834 count is attributed to Baines p. 621 but the Woodbury table/OCR does not provide a safely recoverable value in this review. Do not turn these into all-industry worker counts. Keep non-UK factory-share coefficients marked as project assumptions until better country-specific data are sourced.

## 2. Cotton manufacture — raw cotton share and wages, England, 1833

### 2.1 Baines estimate as reproduced by Kane

Source: Robert Kane, *The Industrial Resources of Ireland* (1845), printed pp. 63–65. Kane states that Edward Baines, in his *History of the Cotton Manufacture*, supplied an analysis of the elements of value for 1833; Kane reproduces the amounts and says the proportions of the elements can reasonably be treated as stable even if absolute value changed.

| Element | Amount (£) | Share of total |
|---|---:|---:|
| Cotton wool/raw cotton | 8,244,693 | 26.27% |
| Wages | 10,419,200 | 33.16% |
| Interest on capital | 3,400,000 | 10.84% |
| Coal | 339,680 | 1.08% |
| Rent, taxes, insurance, other charges and profit | 8,935,320 | 28.65% |
| **Total manufactured cotton goods** | **31,338,693** | **100.00%** |

Other related Baines figures reproduced by Kane:
- Capital employed: £34,000,000.
- Persons supported by the branch: 1,500,000.
- Operatives receiving wages: 487,000.
- Total wages: £10,419,000 (table rounds to £10,419,200).
- Motive power: 44,000 hp, comprising 33,000 steam hp and 11,000 water hp.
- Kane infers average wages in Baines' 1833 estimate of about 6s. 6d. per week.

**Comparison with ECON-CAL-02 assumption 0.21**
- Observed/reproduced raw-cotton value share: 0.2627.
- Assumed share: 0.21.
- Difference: +5.27 percentage points; the source-based share is about 25.1% higher relative to 0.21.
- This is a **value share**, not a physical recipe. It should only calibrate the value-cost composition if the engine's 0.21 has that semantic definition. For physical input quantities, use separate mass balance/yield data.
- The 33.16% wage share is a useful independent cost-composition constraint; don't infer headcount directly without wage/year/worker-scope reconciliation.

### 2.2 Coal calculation caveat

Kane's coal cost £339,680 is calculated by assuming all 44,000 hp is steam, each burns 12 lb coal per hour, and works 300 days × 12 hours; this yields 636,900 tons and cost at 8s/ton. In reality 11,000 hp was water power. Treat this as Kane's simplifying upper-case fuel-cost calculation, not an observed national coal consumption return. Even under this simplifying assumption coal's value share is only 1.08% of cotton-manufacture value.

## 3. Pig iron and wrought/bar iron

### 3.1 Pig iron output

McCulloch, *A Statistical Account of the British Empire* (1837), Vol. II, printed p. 10, reproduces returns from inquiries by government and iron-trade participants over several years. The table reports:

| District | 1830 pig iron (tons) |
|---|---:|
| South Wales | 277,645 |
| Staffordshire | 213,604 |
| Shropshire | 74,418 |
| Yorkshire | 37,996 |
| Scotland | 37,500 |
| Derbyshire | 17,999 |
| North Wales | 25,000 |
| Forest of Dean | 5,000 |
| Various | 5,397 |
| **Printed total row** | **678,417** |

**Data integrity warning:** the listed district rows sum to 694,559, not the printed total row of 678,417. Swank (1902), printed p. 17, says his Great Britain figures are official Government statistics and gives 1830 as 677,417 gross tons. Therefore there are at least two conflicting totals (678,417 and 677,417), and the district sum is a third figure. Keep the source discrepancy explicit; do not use the district sum as a corrected national total without the original return.

Swank's table (official Government statistics as reported by Swank):
| Year | Pig iron (gross tons) | Status |
|---|---:|---|
| 1830 | 677,417 | Swank's official-statistics series; conflicts with McCulloch |
| 1833 | 700,000 | Reported official-statistics point |
| 1836 | 1,000,000 | Reported official-statistics point |

McCulloch additionally says that in 1835 production was at least as great as in 1830 and probably greater. This is a contemporary qualitative estimate, not a measured annual quantity.

### 3.2 Pig-to-wrought conversion

McCulloch, Vol. II, printed p. 10, says about three tenths of total iron was used in the pig/cast state, while the other seven tenths was converted into wrought iron, formed into bars, bolts, rods, etc. Exports of pig iron did not exceed 22,000 tons; exports of the different sorts of iron were about 155,000 tons.

- The 70% is a broad contemporary proportion, not a direct annual bar-iron production series.
- Applying 70% to the 1830 Swank pig-iron total would give a **derived indicative** wrought-iron flow of about 474,192 gross tons, but it should not be treated as measured bar iron. It also does not account for conversion loss, stocks, internal casting, or product mix.
- No verified annual bar-iron series for every year 1830–1836 was recovered in this pass.

## 4. Coal trade, output and iron fuel

### 4.1 Coal employment and trade proxy

McCulloch, Vol. II, printed p. 8, quotes coal engineer Mr. Buddle:
- Tyne mines: 8,491 underground workers and 3,463 above ground, total 11,954 (rounded to 12,000 because the return likely omitted some).
- Wear: estimated 9,000.
- Tyne + Wear: 21,000 engaged in digging coal and delivering it to ships.
- Add 15,000 seamen and 2,000 keel-men/coal-boatmen/casters/trimmers: 38,000 in the northern coal trade.
- London: 5,000 whippers/lightermen etc. and 2,500 factors/agents; 7,500.
- Combined Tyne/Wear/northern and London departments: 45,500.
- Annual Tyne/Wear trade including home consumption: about 4,200,000 tons, said to be about one fifth of all coal consumed in and exported from Great Britain.
- McCulloch extrapolates 105,000 engaged in raising coal and land carriage across Great Britain, plus 30,000 seamen/wharfingers/others, for **135,000 directly engaged in the British coal trade**.

McCulloch explicitly warns that 135,000 is an approximation, not an accurate count. The 4.2m ÷ 0.2 ≈ 21m tons implied by the one-fifth statement is a derived national consumed-and-exported throughput proxy, **not coal production**. It must not be substituted for coal mine output.

### 4.2 National coal production remains unknown

Porter, *The Progress of the Nation* (1836), Chapter V “Mining”, printed pp. 326 ff., provides:
- annual shipment series from Newcastle/Sunderland and other ports;
- prices at Newcastle/Sunderland and London;
- shipments from various parts of the kingdom;
- “produce of inland collieries”.

These are port shipments, prices or partial regional flows. They do not provide a reliable, exhaustive annual Great Britain mine-output series for 1830–1836 in the inspected pages. Swank's later official coal production series begins in 1854. Therefore national coal output for each year 1830–1836 remains **unknown** in this accepted evidence set.

## 5. Coal, ore and cost per ton of bar iron

Source: Robert Kane, *The Industrial Resources of Ireland* (1845), printed pp. 156–157. Kane reproduces French Commission of Inquiry observations for Staffordshire during 1828–1837. This is a contemporary technical cost model, not an annual national average.

### 5.1 Cost stages

**To produce one ton of fine metal:**
| Input/process | Cost |
|---|---:|
| 22¼ cwt pig iron at £3 12s | £4 0s 1d |
| 3 packs coke | £0 4s 1d |
| Workmen | £0 1s 4d |
| Blast and management | £0 1s 1d |
| Repairs and sundries | £0 0s 11d |
| **Total** | **£4 7s 6d** |

**Convert fine metal to one ton of mill bar iron:**
| Input/process | Cost |
|---|---:|
| 22 cwt fine metal | £4 16s 3d |
| 20 cwt coal | £0 5s 6d |
| 10 cwt slack for engine | £0 1s 4d |
| Labour (puddling, rolling, weighing) | £0 10s 4d |
| Repairs of furnaces and machinery | £0 3s 0d |
| Management | £0 1s 10d |
| **Total** | **£5 18s 3d** |

**Form one ton of common merchantable bar iron:**
| Input/process | Cost |
|---|---:|
| 22½ cwt mill bar | £6 14s 1d |
| 12 cwt coal | £0 3s 6d |
| 10 cwt slack | £0 1s 6d |
| Rolling | £0 5s 0d |
| General expenses | £0 5s 6d |
| **Total** | **£7 9s 7d** |

### 5.2 Aggregate material recipe for one ton of merchantable bar iron

Kane combines the processes and gives:

| Input | Quantity | Cost |
|---|---:|---:|
| Iron ore | 4 tons 9 cwt | £1 11s 3d |
| Coal | 8 tons 6 cwt | £2 9s 10d |
| Slack | 1 ton 16 cwt | £0 5s 6d |
| Limestone | 1 ton | £0 5s 6d |
| Labour, management and repairs | — | £2 17s 6d |
| **Total** | | **£7 9s 7d** |

Kane says total fuel consumed is about ten times the weight of bar iron and accounts for 40% of total cost. Adding the exact coal and slack lines gives £2 15s 4d, approximately 37.0% of £7 9s 7d; the author's 40% is a rounded statement. Kane cautions that the estimates are from Staffordshire, where iron production costs were high, and were taken some years earlier when labour and material costs were greater than at the time of writing. He says merchant bar iron would then sell for about £6 per ton. Do not treat the £7 9s 7d as a 1836 national market price; it is a historical process-cost breakdown for 1828–1837.

## 6. Ironworkers, miners, tools and hardware

### 6.1 Iron industry employment

McCulloch, Vol. II, printed pp. 11–12:
- Estimated direct employment in the iron business: about **69,000**.
- Estimated persons dependent on these workers: 3–3½ per worker; total population supported **207,000–240,000**, with the author preferring the lower figure.
- The 69,000 is extrapolated from the South Wales and Monmouthshire works, scaled by the ratio of South Wales output to total UK output (277 to 680, or 1:2.45). It is not an official census count.
- A five-furnace work with a forge and mill said to make about 200 tons of bar iron weekly is described with occupational categories including colliers, miners, furnace labour, forge/mill workers and agents. The printed total row (1,108 men + 84 women + 191 boys = 1,383) does not reconcile with the sum of the visible occupational rows (1,350); do not use its implied labour productivity as a precise coefficient.

### 6.2 Coal workers — separate from ironworkers

McCulloch's 135,000 coal-trade workers include mining, land carriage, seamen, wharfingers and other trade jobs. It overlaps conceptually with the mine/coal labour associated with ironworks and should not simply be added to the 69,000 iron-industry estimate as if all categories were disjoint.

### 6.3 Sheffield tools and cutlery

McCulloch, Vol. II, printed pp. 114–115, quotes the Commons Report of 1833 on Manufactures, Commerce and Shipping, Minutes of Evidence, p. 175. In 1833, ten Sheffield branches listed **13,430 hands**:

| Branch | Hands |
|---|---:|
| Table knives and forks | 3,689 |
| Pen and pocket knives | 2,680 |
| Razors | 754 |
| Scissors | 600 |
| Files | 1,765 |
| Saws | 563 |
| Edged tools | 703 |
| Stove grates, fenders, etc. | 1,530 |
| White metal | 643 |
| Silver-plated goods | 500 |
| **Total** | **13,430** |

The source explicitly says this excludes hands engaged in converting iron into steel and several other important trades. It is a partial count of named Sheffield branches, not total Sheffield industrial employment. It also describes file cutting and much cutlery as hand labour, despite mechanization elsewhere.

### 6.4 Birmingham hardware

McCulloch, Vol. II, printed pp. 110–112:
- Official returns for 1831 show about **10,000 males aged 20 and upwards** in Birmingham, Aston and Edgbaston in a very wide list of metal/hardware trades.
- This is adult male employment only; it excludes women, boys, and potentially outworkers not captured in that age/sex scope.
- Birmingham manufacturers commonly operated small workshops: many employed **5–30 hands**; substantial piecework was performed in workers' homes.
- Examples in the 1831 occupation list include brass workers, gun makers, platers, jewellers, buttons, wire drawers, tools and many other branches. Do not label the entire 10,000 as tool makers.
- The author says no reliable estimate of total Birmingham output value was available; £3m is a conjecture.

### 6.5 Broad British hardware/cutlery estimate — low confidence

McCulloch, Vol. II, printed pp. 115–116:
- He conjectures annual value of iron, hardware and cutlery goods at about £17m.
- He conjectures persons employed at **300,000–325,000**.
- The author explicitly says no materials existed for an accurate estimate, and the estimate is a conjecture. It covers broad iron/hardware/cutlery, not just tool works; do not use as an accepted count for the `tool_works` building.

## 7. Cross-country comparisons, 1830s

### 7.1 United States cotton factories

Levi Woodbury, U.S. Treasury, *Cotton: Cultivation, Manufacture and Foreign Trade* (1836), printed pp. 51–53:
- For US cotton factories in 1832, Reuss is cited at **28,683** persons; McCulloch at **57,466**.
- New York Convention (1830) gives **57,520** workers and **117,626 dependants**, or 175,146 including dependants.
- Woodbury's note says some estimates include machinery makers and people connected with the manufacture, not only mill-floor workers.
- Use 28,683–57,520 only as a disputed cotton-sector estimate, not total US industrial employment.

### 7.2 Wages, not employment counts

Woodbury (1836), printed p. 50, citing Wade and Westminster Review, gives average weekly cotton-factory wages in 1832:
- United States: about 14s 11d sterling.
- England: about 10s, sometimes 12s.
- France: 5s 6d.
- Switzerland: 4s 5d.
- Austria: 3s 9d.
- Saxony: 3s 6d.
- India: 1s–2s (Woodbury warns some lower figures may be too low).

These are wage comparisons, not headcounts or productivity coefficients. They show that one uniform wage/worker-cost assumption across countries would be poorly grounded.

### 7.3 France, Belgium, Prussia/Zollverein, Russia

The inspected PD/contemporary sources did not yield a harmonized total industrial-workforce series for 1836–1840 for France, Belgium, Prussia/Zollverein or Russia. Woodbury attributes a French cotton-worker number for 1834 to Baines p. 621, but the table/OCR examined here does not safely establish the value and scope; it is therefore left unreported rather than guessed. No accepted count for all-industry workers in these countries is supplied by this report.

**Implication for `FACTORY_SHARE_OF_WORKERS_1836 = 0.21`:** CG-25 does not validate applying the same factory share to every polity. The UK has a direct factory-headcount anchor for cotton textiles and a separate, partial industry/occupation evidence base; other countries do not have equivalent coverage. Retain a clearly labelled project assumption or seek country-specific sources. Do not present 0.21 as a historical constant.

## 8. Implications for ECON-CAL-02 and IND-02

1. **Cotton value share:** if the code's 0.21 parameter specifically means raw cotton's share of finished cotton-goods value, run a sensitivity case at 0.2627. Keep this separate from physical cotton consumption/yield.
2. **Wages:** the 1833 estimate places wages at 33.16% of cotton manufactured value. It supports calibrating labour cost as a major cost component, but the 487,000 paid operatives and 1.5m supported persons have broader scope than 1835 factory inspectors' textile factory-hands table.
3. **Iron recipe:** use Kane's process recipe as a candidate historical benchmark for one ton of merchantable bar iron: 4t 9cwt ore, 8t 6cwt coal, 1t 16cwt slack, 1t limestone, plus £2 17s 6d labour/management/repairs in the 1828–1837 Staffordshire cost model. Treat as regional/process evidence, not a universal 1836 recipe.
4. **Coal:** do not use 21m tons as national mine output; it is an inference from coal trade flow. National annual production remains unknown in the sources checked.
5. **Tools:** Sheffield 13,430 named-trade hands (1833) and Birmingham ~10,000 adult males (1831) are partial, non-comparable counts. They support regional specialization and hand-workshops, not a direct nationwide tool_works labour total.
6. **Building calibration:** do not change ironworks/tool_works levels or workers-per-level solely from these figures. The iron employment estimate is uncertain, broad hardware numbers are conjectural, and the ironworks sample has inconsistent subtotals.
7. **Cross-country scale:** no evidence here supports applying one UK-derived factory share to all countries as a historical fact. Label it as a temporary simulation assumption and expose sensitivity.

## 9. Source register and exact page references

1. Edward Baines, *History of the Cotton Manufacture in Great Britain* (1835), esp. printed pp. 398, 406, 412, 431 and 621 as referenced by Kane/Woodbury. Wellcome Collection identifies the 1835 work as Public Domain Mark: https://wellcomecollection.org/works/k7k5pfwc. The detailed 1833 cost breakdown used above is reproduced in Kane, below.
2. Robert Kane, *The Industrial Resources of Ireland* (1845), printed pp. 63–65: cotton-manufacture value components, cotton wool, wages, coal, power and headcounts. PDF: https://upload.wikimedia.org/wikipedia/commons/e/ec/The_industrial_resources_of_Ireland_%28IA_industrialresour00kane%29.pdf
3. Robert Kane, same work, printed pp. 156–157: French Commission of Inquiry Staffordshire iron-cost tables for 1828–1837 and material/fuel recipe. Same PDF as source 2.
4. J. R. McCulloch, *A Statistical Account of the British Empire* (1837), Vol. II, printed p. 8: Buddle coal-trade employment and approximate coal throughput; printed pp. 10–12: pig iron districts, wrought conversion, iron employment; printed pp. 110–116: Birmingham, Sheffield, hardware/cutlery and tools. PDF: https://upload.wikimedia.org/wikipedia/commons/3/3a/Statistical_Account_of_the_British_Empire_Exhibiting_Its_Extent%2C_Physical_Capacr_Population%2C_Industry_and_Civil%2C_and_Religious_Institutions_in_Two_Vols%2C_%28Vol._II%29_%28IA_dli.granth.35375%29.pdf
5. G. R. Porter, *The Progress of the Nation* (1836), Chapter V “Mining”, printed pp. 326 ff.: coal shipments, regional flows and inland colliery produce; not a complete national mine-output series. PDF: https://escoe-website.s3.amazonaws.com/wp-content/uploads/2018/10/18113758/Porter-The-Progress-of-the-Nation-1836-edition.pdf
6. James M. Swank, *Iron and Steel, Iron Ore, and Coal Statistics for the United States, Great Britain, Germany, France, and Belgium* (1902), printed pp. 17–18: British pig iron and later official coal series. PDF: https://upload.wikimedia.org/wikipedia/commons/0/07/Iron_and_steel%2C_iron_ore%2C_and_coal_statistics_for_the_United_States%2C_Great_Britain%2C_Germany%2C_France%2C_and_Belgium_%28IA_ironsteelironore00swan%29.pdf
7. Levi Woodbury, U.S. Treasury, *Cotton: Cultivation, Manufacture and Foreign Trade* (1836), printed pp. 50–53: wages and cotton-factory employment comparisons. PDF: https://upload.wikimedia.org/wikipedia/commons/b/ba/Levi_Woodbury%2C_Cotton%2C_1836.pdf
8. *Commons Report of 1833, on Manufactures, Commerce, and Shipping; Minutes of Evidence*, p. 175, as cited by McCulloch for Sheffield trades.

## 10. Handoff

- Output: `docs/research/history/CG25_IRON_COAL_TOOLS_1830S_VI.md`
- Status: research handoff completed.
- No game code, building levels, worker coefficients, or ECON-CAL-02 constants modified.
- No build/test run.
- Main actionable finding: the 0.21 raw-cotton value-share assumption is below the Baines 1833 estimate reproduced by Kane (26.27%); distinguish this value share from physical input mass. UK iron/coal/tool employment and material-use data exist but vary greatly in scope and confidence; national coal output and comparable foreign industrial-workforce totals remain unknown.
