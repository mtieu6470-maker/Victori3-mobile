# CG-33 — Sổ cái dòng giá trị doanh nghiệp và ảnh hưởng kinh tế (2026-11-22)

**Phạm vi:** research/design cho CO-2; không phải code engine hay thông số cân bằng cuối. **Chuẩn:** United Nations et al., System of National Accounts 2008 (SNA 2008). CSV kèm theo: CG33_ECONOMIC_EFFECT_PARAMETERS.csv (20 quan sát có nguồn từ UK, Germany, US).

## 1. Kết luận trọng yếu

1. **GDP theo nơi sản xuất, không theo quốc tịch cổ đông.** GDP là tổng gross value added của các producer resident, cộng thuế sản phẩm trừ trợ cấp sản phẩm. GVA = output − intermediate consumption (SNA §§2.138–2.140, 6.82–6.84).
2. **GNI theo nơi cư trú của chủ thể nhận thu nhập sơ cấp.** GNI = GDP − primary incomes payable to non-residents + primary incomes receivable from non-residents (SNA §2.143). Dividends, interest, reinvested earnings và compensation cross-border có thể làm GNI khác GDP.
3. **Cổ tức không phải chi phí sản xuất, không trừ GDP.** Đây là phân phối property income từ công ty sang chủ sở hữu. Lợi nhuận giữ lại là saving/disposable income còn lại ở khu vực công ty, không phải output mới.
4. **Retained earnings khác capex.** Lợi nhuận giữ lại là nguồn tài trợ nội bộ; gross fixed capital formation là việc tạo/mua tài sản cố định. Không giả định toàn bộ retained earnings trở thành nhà máy/máy móc ngay tháng đó.
5. **Interest khác principal.** Lãi vay là property income payable/receivable; giải ngân và hoàn trả gốc là giao dịch tài chính, không phải sản xuất hay chi phí GDP.
6. **Không dùng doanh thu công ty làm GDP.** Doanh thu có thể chứa đầu vào mua từ công ty khác; cộng doanh thu mọi tầng chuỗi cung ứng sẽ double-count. Chỉ GVA của từng producer được cộng.

## 2. Sổ cái theo SNA — phân loại giao dịch

Mỗi transaction cần: transaction_id, accrual_period, payer, payee, company/legal_entity, site/establishment, jurisdiction/residency, currency, amount, transaction_class, tax_treatment và hai vế debit/credit. Mỗi giao dịch phải cân bằng; mọi giao dịch có ít nhất hai đơn vị tham gia phải được ghi nhất quán ở cả hai phía.

| Dòng | Bản chất / người nhận | GDP | GNI |
|---|---|---|---|
| Output at basic prices | Sản lượng bán ra hoặc đưa vào tồn kho | Ghi tại site/producer resident | Không phụ thuộc quốc tịch cổ đông |
| Intermediate consumption | Đầu vào bị tiêu dùng trong sản xuất | Trừ khi tính GVA của producer mua; supplier ghi output riêng | Theo residency của supplier |
| Gross value added | Output − intermediate consumption | Đóng góp GDP tại nơi producer cư trú | Chưa phải thu nhập cổ đông |
| Compensation of employees | Wages, salaries và employer social contributions | Thành phần phân phối GVA; không trừ GDP | Thu nhập lao động theo residency người lao động |
| Other taxes on production less subsidies | Thuế trên lao động/tài sản/hoạt động sản xuất | Thành phần phân phối GVA | Theo đơn vị nộp và chính phủ nhận |
| Gross operating surplus (GOS) | Phần GVA còn lại sau compensation và taxes less subsidies on production | Thành phần income-side GDP | Thu nhập sơ cấp của corporate unit |
| Consumption of fixed capital (CFC) | Hao mòn tài sản cố định | GDP là gross; NDP = GDP − CFC | GNI gross; NNI = GNI − CFC |
| Interest payable/receivable | Property income giữa borrower và lender | Không tạo output; không trừ GDP kiểu expense kế toán | Làm đổi GNI nếu payer/payee khác residency |
| Corporate income tax | Current tax on income/profits | Không trừ GDP; không phải production tax | Phân phối thu nhập thứ cấp, giảm disposable income/saving của công ty |
| Dividends | Distributed income of corporations tới cổ đông | Không trừ GDP; không ghi output lần hai | Property income theo residency cổ đông |
| Retained earnings | Corporate saving giữ lại | Không phải output mới, không tự động tăng GDP | Saving của công ty; FDI có thể ghi reinvested earnings cross-border |
| Capex / GFCF | Tạo/mua máy móc, nhà xưởng, hạ tầng | GFCF nơi tài sản được tạo; expenditure reconciliation phải tránh cộng trùng với output nhà sản xuất | Theo residency producer tài sản |
| Change in inventories | Hàng đã sản xuất nhưng chưa bán | Sản phẩm tồn kho vẫn là output; inventory change thuộc capital formation | Không phải dividend |
| Loan drawdown / principal repayment | Giao dịch tài chính | Không phải GDP | Không phải income; chỉ interest là property income |
| Cross-border profit transfer | Dividend, interest, reinvested earnings | Không xóa sản lượng đã tạo tại site; GDP host không giảm | Primary income payable giảm GNI host; receivable tăng GNI home |

**Residency quan trọng hơn HQ.** Subsidiary có trung tâm lợi ích kinh tế tại nước sở tại thường là institutional unit resident tại nước đó dù 100% vốn nước ngoài. Chi nhánh không độc lập có thể cần xử lý như quasi-corporation nếu có sổ sách và hoạt động đủ tách biệt. Không gán GDP cho nước đặt HQ chỉ vì parent đặt trụ sở ở đó.

## 3. Công thức ledger đề xuất

### 3.1 Production account (site-level)

- output_at_basic_prices − intermediate_consumption = gross_value_added
- gross_value_added − compensation_of_employees − other_taxes_on_production + subsidies_on_production = gross_operating_surplus
- gross_operating_surplus − consumption_of_fixed_capital = net_operating_surplus

Thuế sản phẩm/trợ cấp sản phẩm là cầu nối từ giá cơ bản sang GDP giá thị trường. Không đưa VAT thu hộ nộp nhà nước thành company revenue. Thuế thu nhập công ty không nằm trong production account.

### 3.2 Allocation / secondary distribution

- GOS + property_income_receivable − property_income_payable (ví dụ interest) = entrepreneurial income (khái niệm SNA, khi áp dụng).
- Entrepreneurial income − current_taxes_on_income − current transfers payable = gross disposable income of corporation.
- Gross disposable income − distributed income of corporations (dividends) = gross saving of corporation.

Đây là khung rút gọn; SNA allocation accounts chi tiết hơn. Không dùng một công thức P&L kế toán làm thay thế toàn bộ SNA.

### 3.3 Capital and financial accounts

- Gross saving + capital transfers net tài trợ cho capital formation và net lending/borrowing.
- Retained earnings là corporate saving, không phải cash balance: cash có thể trả nợ, tăng deposits, mua financial assets hoặc đầu tư capex.
- Capex tạo tài sản cố định; mua cổ phiếu hiện hữu/merger consideration là giao dịch tài chính, không phải GFCF.
- Loan principal drawdown/repayment đổi financial assets/liabilities; không ghi vào revenue/expense hay profit/loss.
- Nếu parent có FDI controlling interest, retained/reinvested earnings của affiliate có thể được ghi như investment income receivable bởi parent và reinvestment vào equity affiliate. Không ghi vừa cash dividend vừa toàn bộ profit transfer lần hai.

## 4. Ví dụ thuộc địa — GDP không bị trừ bởi dividend

Giả sử nhà máy tại thuộc địa tạo GVA 100; trả wages 40, taxes on production 5, GOS 55. Parent ở chính quốc nhận dividend 20 từ profit đã phát sinh.

- GDP thuộc địa vẫn ghi GVA 100. Dividend 20 không trừ sản lượng.
- Nếu cổ đông/parent là non-resident, 20 được ghi là property income payable; GNI thuộc địa giảm 20 so với GDP (các yếu tố khác giữ nguyên).
- GNI nước mẹ tăng bởi property income receivable 20 nếu parent resident ở đó.
- Nếu 20 vẫn giữ trong subsidiary, đó là saving của subsidiary; trong quan hệ FDI, reinvested earnings có thể được ghi là primary income payable cho foreign direct investor và đối ứng là reinvestment, dù không có cash remittance.
- Nếu 20 chỉ chuyển giữa hai đơn vị resident trong cùng nước, tổng GNI quốc gia không đổi.

Các số trên chỉ là ví dụ accounting, không phải dữ liệu lịch sử. Rent tài nguyên, royalty, tax và profit phải được phân loại riêng theo hợp đồng; không gọi tất cả là “thuế” hay “lợi nhuận”.

## 5. Bằng chứng lịch sử về cổ tức và lợi nhuận giữ lại

Dữ liệu chi tiết trong CG33_ECONOMIC_EFFECT_PARAMETERS.csv.

### UK — London Stock Exchange, 1895–1905
Braggion & Moore dựng lịch sử cổ tức 323 công ty, payout tính trên company-years có earnings dương. Payout trung bình cân bằng mọi ngành là **73% với tất cả lớp cổ phiếu**, nhưng **49% nếu chỉ ordinary shares**. Railways 88%, textiles 83%, iron & steel 77%, electricity 75%, engineering 68%. Công ty trưởng thành thường phân phối cao hơn ngành mới tăng trưởng; retained earnings có thể hỗ trợ tăng vốn ngành mới. Phần 27% còn lại chỉ là earnings không phân phối qua dividend, không phải capex quan sát trực tiếp.

### Germany — Đế quốc Đức, 1870–1913
Burhop & Selgert xây panel 91 công ty cổ phần, 1,672 firm-year trong sample mô hình. Payout mean trong descriptive statistics 0.8 (SD 0.2); từ cuối thập niên 1880, mean payout ổn định khoảng **75–80% reported/accounting profit**. Những năm đầu đế quốc dao động mạnh. Kế toán bảo thủ và hidden reserves làm accounting profit khác economic profit. Luật 1884 và governance reforms ảnh hưởng quyền cổ đông/quy trình phân phối; 80% không phải tỷ lệ bắt buộc theo luật.

### Germany — 32 công ty lớn, 1962–1988
Behm & Zimmermann nghiên cứu 32 công ty; aggregate net-profit analysis loại ngân hàng, còn 27 công ty. Payout theo net profit theo ngành khoảng **25% (construction/automobiles) tới 50% (supermarkets)**. Dữ liệu cho thấy dividend smoothing: doanh nghiệp điều chỉnh cổ tức chậm hơn biến động earnings. Không lấy mean dividend per share chia mean net profit per share để tạo pooled ratio.

### US — corporate sector, 1929–1986
Poterba tổng hợp NIPA. Theo adjusted earnings (điều chỉnh Inventory Valuation Adjustment và Capital Consumption Adjustment), payout average là 52% trong thập niên 1940, 46% thập niên 1950, 40% thập niên 1960, 45% thập niên 1970 và 61% giai đoạn 1980–86. Theo accounting earnings, các tỷ lệ tương ứng là 39%, 39%, 42%, 34%, 59%. Chênh lệch denominator đáng kể, đặc biệt 1980s; không dùng một tỷ lệ duy nhất toàn thế kỷ. Chuỗi dividends không gồm stock repurchases.

**Kết luận:** các tỷ lệ là quan sát theo thị trường, thời kỳ, mẫu và định nghĩa earnings. Đây là prior/validation band, không phải global default. Không có bằng chứng đủ để xác định tỷ lệ capex reinvestment phổ quát cho mỗi nước/ngành trong 1836–2026. Dùng retained_earnings_share cho phần không phân phối; capex_rate phải nội sinh theo opportunity set, cash, debt, prices, demand, depreciation và financing cost.

## 6. Mốc luật công ty theo nước — điều kiện pháp lý, không tự động unlock

| Jurisdiction | Date | Instrument / change | Ý nghĩa mô phỏng |
|---|---:|---|---|
| UK | 1844 | Joint Stock Companies Act 1844 (7 & 8 Vict. c.110) | Mở rộng registration/incorporation joint-stock companies; chưa đồng nghĩa limited liability phổ quát |
| UK | 1855 | Limited Liability Act 1855 (18 & 19 Vict. c.133) | Limited liability cho công ty đủ điều kiện theo cơ chế đăng ký |
| UK | 1856 | Joint Stock Companies Act 1856 | Điều chỉnh lại framework đăng ký và thành lập |
| UK | 1862 | Companies Act 1862 (25 & 26 Vict. c.89) | Hợp nhất incorporation, regulation, winding-up |
| France | 1807 | Code de commerce | Société anonyme tồn tại nhưng thành lập cần government authorisation |
| France | 1863 | Loi du 23 mai 1863 | Bước nới một phần, vẫn giới hạn loại hình/vốn |
| France | 1867 | Loi du 24 juillet 1867 sur les sociétés commerciales | Bãi bỏ yêu cầu authorisation chính phủ để thành lập société anonyme; chuyển sang registration-based formation |
| Prussia / German states | 1843 | Prussian Act on Aktiengesellschaften | Quy tắc cổ phần có trước thống nhất Đức; không áp thành luật liên bang toàn nước |
| North German Confederation / Germany | 1870 | Aktienrechtsnovelle, 11 June 1870 | Loại bỏ concession system cho AG, tăng vai trò shareholder/AGM |
| Germany | 1884 | Act of 18 July 1884, RGBl. pp.123–170 | Siết formation/capital verification và safeguards sau Gründerkrise |
| Germany | 1897 | Handelsgesetzbuch (HGB) | Hợp nhất luật thương mại/công ty trong HGB |
| Japan | 1890/1893 | Old Commercial Code | Code đầu tiên dựa trên mô hình Đức; implementation postponed, hiệu lực ngắn |
| Japan | 9 Mar / Jun 1899 | Commercial Code, Act No.48 of 1899 | Promulgated 9 March, effective June 1899; general commercial law and company rules |
| US | 1795, 1799, 1811, 1832 | Early state general incorporation acts: North Carolina, Massachusetts, New York (manufacturing), Connecticut | Incorporation là luật bang; New York 1811 chỉ manufacturing |
| US | 1864 | National Bank Act | Một số ngân hàng có federal charter; ngoại lệ theo ngành |
| US | 1875 | New Jersey general incorporation law | Mốc general incorporation hiện đại của NJ |
| US | 1899 | Delaware general incorporation law | Delaware tham gia cạnh tranh incorporation, dựa phần lớn trên NJ |

**Lưu ý:** không áp một ngày “corporation law unlocked” cho cả nước nếu luật phân cấp bang, liên bang, thuộc địa hoặc tiểu bang Đức. Ngày 1-1-1836: UK đã có joint-stock registration framework; France vẫn hạn chế SA cho tới cải cách 1863/1867; German states có luật riêng trước 1870; Japan chưa có Commercial Code 1899; US tùy bang/ngành. Luật công ty cho phép hình thành pháp nhân không đồng nghĩa có độc quyền, quyền khai thác tài nguyên, đường sắt hay ngân hàng; các quyền này cần license/charter/concession riêng, địa bàn, thời hạn và cơ quan cấp.

## 7. Đề xuất CO-2 cho engine

### 7.1 Không dùng một “profit” duy nhất
Lưu tách: gross_operating_surplus; net_operating_surplus; interest_payable/receivable; corporate_income_tax; legal_distributable_profit; dividends_declared; dividends_paid; retained_earnings/corporate_saving; gross_fixed_capital_formation; change_in_inventories; net_lending_borrowing; debt_principal_change; primary_income_cross_border với payer/payee residency.

### 7.2 Quy trình tháng
1. Tính output/intermediate consumption theo site, ghi accrual.
2. Tính GVA, wages, production taxes/subsidies, GOS.
3. Trừ CFC để có NOS; ghi interest/property income.
4. Tính corporate income tax theo luật; không trừ thuế này khỏi GDP.
5. Xác định legal distributable profit sau lỗ lũy kế/reserves theo luật hiện hành.
6. Board/shareholder decision chọn dividend, retained earnings, debt reduction hoặc capex; không auto-distribute mọi lợi nhuận.
7. Ghi dividend khi quyền nhận phát sinh (SNA accrual timing); cash settlement ở financial ledger; không trừ GDP.
8. Ghi capex khi asset produced/acquired; không ghi loan principal thành cost.
9. Ghi cross-border property income; GDP theo nơi producer resident, GNI theo nơi income recipient resident.
10. Reconcile double-entry/quadruple-entry; debit = credit theo transaction currency và functional currency.

### 7.3 Validation bắt buộc
- output − intermediate_consumption = GVA.
- GVA = compensation + taxes_less_subsidies_on_production + GOS (theo valuation convention).
- GOS − CFC = NOS.
- opening_cash + receipts − payments = closing_cash.
- Corporate saving không được đồng thời ghi là dividend.
- Dividend không làm giảm GDP; cross-border dividend làm đổi GNI theo residency.
- Interest không cộng output; principal drawdown/repayment không ghi profit/loss.
- GFCF không cộng lại vào GDP nếu cùng asset đã được tính trong output nhà sản xuất.
- Parent/subsidiary intra-group sale phải có transfer-pricing policy; eliminate duplicate flows khi lập group consolidated, nhưng national accounts theo resident institutional units vẫn giữ production ở từng đơn vị.
- Stress tests: negative earnings, arrears, bankruptcy, foreign shareholder, reinvested FDI, tax holiday, SOE, unincorporated enterprise, concession, merger/split.

## 8. Nguồn

- **SNA-08** — European Commission, IMF, OECD, UN, World Bank, System of National Accounts 2008 (2009): https://unstats.un.org/unsd/nationalaccount/docs/SNA2008.pdf. §§2.138–2.143 GDP/GNI; §§6.82–6.84 GDP by resident producers; Chapter 7 distribution of income; §3.168 accrual timing.
- **S1** — Fabio Braggion & Lyndon Moore, “Dividend Policies in an Unregulated Market: The London Stock Exchange 1895–1905”: https://www.researchgate.net/publication/23804879_Dividend_Policies_in_an_Unregulated_Market_The_London_Stock_Exchange_1895-1905.
- **S2** — Carsten Burhop & Felix Selgert, “Dividend Policy: An Empirical Analysis for Imperial Germany,” German Economic Review 27(1), 2026, DOI 10.1515/ger-2024-0039: https://www.econstor.eu/bitstream/10419/339549/1/1967416125.pdf.
- **S3** — Ulrich Behm & Heinz Zimmermann, “The Empirical Relationship between Dividends and Earnings in Germany,” ZWS 113(2), 1993, DOI 10.3790/schm.113.2.225: https://www.econstor.eu/bitstream/10419/291797/1/schm.113.2.225.pdf.
- **S4** — James M. Poterba, “Tax Policy and Corporate Saving,” Brookings Papers on Economic Activity 2 (1987): https://www.brookings.edu/wp-content/uploads/1987/06/1987b_bpea_poterba_hall_hubbard.pdf.
- **S5** — Federal Reserve Bulletin, October 1955, p.1161, corporate profits/taxes/dividends: https://fraser.stlouisfed.org/files/docs/publications/FRB/1950s/frb_101955.pdf.
- **S6** — UK Joint Stock Companies Act 1844: https://www.legislation.gov.uk/ukpga/Vict/7-8/110/contents/enacted.
- **S7** — UK Limited Liability Act 1855: https://www.legislation.gov.uk/ukpga/Vict/18-19/133/enacted.
- **S8** — UK Joint Stock Companies Act 1856, referenced in statutory history: https://www.legislation.gov.uk/ukpga/2006/46/section/1171/2025-01-01/data.htm.
- **S9** — UK Companies Act 1862: https://www.legislation.gov.uk/ukpga/Vict/25-26/89/contents/enacted.
- **S10** — OECD, Governance Culture and Development (2004), French Code de commerce 1807: https://www.oecd.org/content/dam/oecd/en/publications/reports/2004/09/governance-culture-and-development_g1gh4622/9789264017290-en.pdf.
- **S11** — Persee, “Les origines de la libération des sociétés de capitaux à responsabilité limitée, 1856–1863”: https://www.persee.fr/doc/rhmc_0048-8003_1981_num_28_2_1142.
- **S12** — Loi du 24 juillet 1867 (Légifrance): https://www.legifrance.gouv.fr/loda/id/LEGISCTA000006084119; Assemblée nationale historical summary: https://www.assemblee-nationale.fr/13/rapports/r0817.asp.
- **S13** — Haufe legal history, Prussian AG law 1843 and German reforms: https://www.haufe.de/id/kommentar/kuetingweber-handbuch-der-rechnungslegung-einzelabsch-a-entwicklung-der-aktienrechtlichen-vorschriften-HI6747071.html.
- **S14** — German Federal Law Gazette register, 1870 Act, BGBl. 1870 p.375: https://www.reichsgesetzblatt.de/D/FN1867-1919/FN1870.htm.
- **S15** — German Act of 18 July 1884, RGBl. 1884 pp.123–170: https://de.wikisource.org/wiki/Gesetz%2C_betreffend_die_Kommanditgesellschaften_auf_Aktien_und_die_Aktiengesellschaften._Vom_18._Juli_1884.
- **S16** — Haufe legal history (HGB 1897): https://www.haufe.de/id/kommentar/kuetingweber-handbuch-der-rechnungslegung-einzelabsch-a-entwicklung-der-aktienrechtlichen-vorschriften-HI6747071.html.
- **S17** — Osaka University Law Review, Japanese Commercial Code history: https://ir.library.osaka-u.ac.jp/repo/ouka/all/11764/oulr041-023.pdf.
- **S18** — Japan Commercial Code Act No.48 of 1899, promulgated 9 March/effective June 1899: https://japanlaw.org/en/commercial-code/about.
- **S19** — Peter V. Letsou, “The Changing Face of Corporate Governance Regulation in the United States,” Willamette Law Review 46 (2009): https://willamette.edu/law/resources/journals/review/pdf/volume-46/wlr46-2-letsou.pdf.

**Acceptance:** CG-33 research/design and sourced CSV delivered. Do not use payout ratios as a fixed global parameter; legal eligibility and cashflow/market opportunity decide distributions. No engine code changed and no test/build run in this research pass.
