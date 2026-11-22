# CG-31 — Bổ sung bằng chứng quy mô công ty (đợt 2, 2026-11-22)

**Branch:** `ccr-b27f3fb8-epfpd6`  
**Phạm vi:** đáp ứng yêu cầu CG-31/MSG-055 về ít nhất 20 công ty có bằng chứng quy mô; không phải hoàn tất toàn bộ danh mục 60 ứng viên.  
**Nguyên tắc:** chỉ ghi metric có nguồn; không biến mốc vận hành thành doanh thu/lợi nhuận; không hợp nhất các pháp nhân/group lineage nếu nguồn không chứng minh.

## 1. Kết quả

Bổ sung 8 thực thể vào `CG31_COMPANIES_SCALE_EVIDENCE.csv`, nâng số thực thể công ty/group có quan sát quy mô từ 12 lên **20** (không tính Congo Free State là comparator nhà nước). Các metric mới gồm lao động, vốn, doanh thu, số điện thoại, tàu/tonnage, lợi nhuận và mạng lưới chi nhánh.

| Entity | Quan sát đã thêm | Định nghĩa và giới hạn | Confidence |
|---|---|---|---|
| Krupp | 20,960 employees (1888); >24,000 (1891); >25,000 (1892) | BLS 1896 ghi tổng công ty, gồm cơ sở ngoài Essen; số trong Essen được tách riêng. Không cộng số gia đình phụ thuộc vào workforce. | High |
| John Cockerill / S.A. John Cockerill | locomotive đầu tiên 1835; hơn 60 locomotive trong bốn năm tiếp theo; nguồn chính phủ Bỉ mô tả khoảng 3,000 workers tại factories | Mốc locomotive là sản lượng tích lũy, không phải output mỗi năm. Con số lao động là mô tả tổng quát, chưa khóa cùng ngày với locomotive series. | Medium |
| General Electric | 1913 orders $111,819,142; billed sales $106,477,438.76; profit from sales $10,269,605.45; manufacturing floor space 13.9m sq ft | Annual report năm kết thúc 31-12-1913; doanh thu và profit from sales là hai chỉ tiêu kế toán khác nhau. | High |
| AT&T / Bell System | telephone stations: 855,911 (1900), 5,882,719 (1910), 8,133,017 (1913) | US Census tổng hợp Bell-owned và Bell-connecting stations, bao gồm associated operating companies; đây là quy mô mạng lưới, không phải số thuê bao riêng của công ty mẹ. | High |
| Crédit Lyonnais | 158 agencies (26 Paris/suburbs, 116 departments, 16 abroad); net profit 12,428,200 francs (1894); paid-up capital 100m francs (1894) | Bảng ngân hàng đương thời được tái bản năm 1896; phân biệt deposits/discounted bills với profit/capital. | High |
| Shell Transport & Trading | half of Shell fleet sat idle (1902); merger with Royal Dutch (1907) | Chỉ là chỉ báo utilisation/capacity shock theo lịch sử công ty; không có tổng số tàu trong nguồn này, không chuyển thành fleet size hoặc market share. | Medium |
| Nippon Yusen Kaisha (NYK) | 121 vessels / 265,446 tonnage (1907); 118 / 347,043 (1913); 1913 fares and freights ¥26,571,227 | Tokyo Chamber of Commerce Statistical Report, Table XLVI–XLVII, p.168–170; tonnage là gross tonnage theo bảng, không phải DWT. | High |
| Société Générale de Belgique | original capital 50m florins (1822); capital 32,804,232 Belgian francs (1853) | DFIH transcription of 1933 issuer yearbook; giữ nguyên currency và mốc, không quy đổi/so sánh trực tiếp giữa florin và franc. | Medium |

## 2. Tổng hợp theo tiêu chí CG-31

- Existing evidence set: 12 distinct company/group entities; Congo Free State là state-only comparator, không tính là company.
- New evidence set: 8 distinct companies/groups.
- **Total with at least one sourced scale observation: 20.**
- Catalogue still has 60 candidates. The other candidates remain PENDING; no annual revenue, workforce, production or market share was invented to force coverage.
- Historical Mode whitelist must use only rows whose identity, date and metric definition are verified. A group lineage or state concession must not be spawned as a single timeless legal person.

## 3. Nguồn mới

**S16 — Krupp workforce.** U.S. Department of Labor, *Bulletin of the Department of Labor*, No. 5 (July 1896), “Industrial Communities,” pp. 479–481; FRASER scan: https://fraser.stlouisfed.org/files/docs/publications/bls/bls_v01_0005_1896.pdf. The text states total employees 20,960 in 1888, over 24,000 in 1891, and over 25,000 in 1892; it explicitly distinguishes Essen employees from total workforce.

**S17 — John Cockerill locomotive output.** Ine Wouters, “The architectural and structural works of S.A. John Cockerill (1842–1955),” 8th International Congress on Construction History (2024), pp. 24–39, VUB repository: https://cris.vub.be/ws/portalfiles/portal/112718799/2024_8ICCH_Wouters_Cockerill.pdf. It states the first locomotive “Le Belge” in December 1835 and more than 60 locomotives over the following four years. The paper's licence is CC BY-NC-ND; it is cited as research evidence, not copied or redistributed. Employment cross-check: Belgian federal public diplomacy, “Bicentennial of John Cockerill in Seraing” (2017): https://focusonbelgium.be/en/business/bicentennial-john-cockerill-seraing (reports about 3,000 workers in the factories; use as approximate, not a dated payroll return).

**S18 — General Electric.** *Commercial & Financial Chronicle*, 25 April 1914, “General Electric Company — Twenty-Second Annual Report for the year ending 31 December 1913,” p.1323: https://fraser.stlouisfed.org/files/docs/publications/cfc/cfc_19140425.pdf. Primary annual report: orders $111,819,142; sales billed $106,477,438.76; profit from sales $10,269,605.45; plant floor space rose to 13,900,000 sq ft.

**S19 — AT&T / Bell System network.** U.S. Department of Commerce, *Statistical Abstract of the United States 1925*, table 349, p.346: https://www2.census.gov/library/publications/1926/compendia/statab/48ed/1925-06.pdf. The table reports Bell System telephone stations and wire mileage for 1895–1923; 1900 = 855,911; 1910 = 5,882,719; 1913 = 8,133,017. Scope includes Bell-owned and Bell-connecting stations.

**S20 — Crédit Lyonnais.** Alexander del Mar (ed.), *A History of Banking in all the Leading Nations*, vol. 3 (1896), pp.117–119, digitised by Online Library of Liberty: https://oll-resources.s3.us-east-2.amazonaws.com/oll3/store/titles/2239/Sumner_1453-03_EBk_v6.0.pdf. Reports 26 agencies in Paris/suburbs, 116 in French departments, 16 abroad; 1894 net profits 12,428,200 francs and capital fully paid at 100m francs.

**S21 — Shell Transport & Trading.** Shell, “Our company history,” section 1901–1907: https://www.shell.com/who-we-are/our-history/our-company-history.html. Company history says half the fleet was idle after the Texas overproduction shock and Royal Dutch's competing tanker/sales expansion; merger decision in 1907. Use only as qualitative utilisation evidence.

**S22 — Nippon Yusen Kaisha.** Tokyo Chamber of Commerce, *The Annual Statistical Report* (1919), Table XLVI–XLVII, pp.168–170: https://upload.wikimedia.org/wikipedia/commons/0/0a/NDL931879_%E6%9D%B1%E4%BA%AC%E5%95%86%E6%A5%AD%E4%BC%9A%E8%AD%B0%E6%89%80%E7%B5%B1%E8%A8%88%E5%B9%B4%E5%A0%B1_%E5%A4%A7%E6%AD%A38%E5%B9%B4_part1.pdf. Reports year-end fleet numbers/tonnage and fares/freights for NYK. The 1913 figures are calendar year-end.

**S23 — Société Générale de Belgique.** DFIH, issuer record transcribing the 1933 French financial yearbook: https://dfih.fr/issuers/472/yearbook-ocr?source=annuaire_df_1933. Gives incorporation 28 August 1822, Brussels registered office and original capital 50m florins; records the 1853 capital reduction/re-denomination. Secondary transcription; confidence medium and currency must remain as printed.

## 4. Research-to-game boundary

These observations are historical anchors, not direct gameplay coefficients. For Victori3:
- workforce and output observations can constrain firm scale only when the simulated entity, territory and production scope match;
- revenue, assets, capital, profit, orders and market share are distinct metrics and must not be substituted for one another;
- a fleet-idle observation can inform a capacity-utilisation event, not a permanent company modifier;
- a merger, legal conversion or group lineage requires explicit entity continuity rather than one company ID spanning every predecessor/successor;
- no firm should receive a fixed historical market share or guaranteed growth solely because it existed historically.

**Status:** CG-31 minimum 20-entity scale-evidence milestone reached. Full catalogue evidence for all 60 candidates remains incomplete; MSG-049 must stay OPEN.
