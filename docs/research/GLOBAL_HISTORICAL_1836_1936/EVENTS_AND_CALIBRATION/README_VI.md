# Rà soát chứng cứ và phân loại nhân quả — Historical Events (S22)

**Ngày:** 19/11/2026  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Phạm vi nguồn runtime được đọc:** historical_data/events/historical_events.json (9 exogenous records), historical_data/borders/regions_1836.csv, historical_data/sources/sources.json  
**Trạng thái:** RESEARCH_ONLY / CHATGPT_SOURCE_REVIEW / NO_RUNTIME_PATCH

> Đây là một lượt kiểm tra chứng cứ thứ cấp/bibliographic trên chín event records hiện có. Không phải xác nhận độc lập toàn bộ lịch sử, không phải data acceptance và không ủy quyền thay đổi game. Các phát hiện cần Hydrogen/Claude/owner đối chiếu trước khi trở thành nội dung runtime.

## 1. Kết quả chính

Chín record hiện tại không nên được hiểu là chín “sự kiện ngày cố định” có cùng ngữ nghĩa:

- Cholera và potato blight là **hazard introductions / disease spread**. Ngày khởi phát, địa điểm đầu tiên được ghi nhận và vùng lây lan là ba khái niệm khác nhau.
- Agra, North China và Great Indian famine là **drought + food-system/political vulnerability + social outcome**. Không nên biến số người chết, famine hoặc unrest thành hiệu ứng cố định của một cú nhấp ngày tháng.
- California, Victoria và Witwatersrand là **human-mediated discovery / public knowledge / prospecting / legal opening**. Mỏ/quặng tồn tại, con người biết đến nó, thông tin được công bố và rush/migration là những trạng thái khác nhau.
- Ngày tháng trong JSON có dạng YYYY-MM-01 nhưng nhiều nguồn chỉ hỗ trợ năm, mùa hoặc khoảng thời gian. Không được coi ngày 01 là ngày lịch sử thật nếu nguồn không nêu.
- Phần lớn event source hiện chỉ lưu một hoặc hai source IDs ở cấp record, không có page/table locator, claim-level confidence hoặc source-date precision.
- Chín record không chứng minh độ bao phủ toàn thế giới. Đặc biệt, nghiên cứu về Global Drought 1875–1878 cho thấy các vùng ở châu Phi, Brazil, Australia và Đông Nam Á cũng bị tác động; đây là hàng đợi nghiên cứu, không phải lệnh thêm một event runtime tổng hợp.

## 2. Đánh giá từng record hiện có

### EXO_CHOLERA_2 — Second cholera pandemic (Italian wave)

Nguồn học thuật xác nhận đợt đại dịch thứ hai lan từ Nam Á và đến Vương quốc Hai Sicilia trong 1836–1837. Nghiên cứu về Naples ghi nhận một đợt từ 02/10/1836 đến 08/03/1837 và một đợt khác từ 13/04/1837 đến 24/10/1837. Vì vậy, mốc 1836-06-01 chưa được nguồn đã kiểm tra chứng minh là ngày khởi phát chung của các vùng Sicily, Papal States, Sardinia và Lombardy.

**Phân loại đề xuất:** biological hazard introduction + regional spread.  
**Cần làm rõ:** tách Naples/Two Sicilies khỏi các vùng Italy khác; xác minh Lombardy và Sardinia bằng nguồn riêng; giữ tháng/năm hoặc khoảng khi chưa có ngày chính xác. Không áp cùng một mortality rate cho sáu region nếu không có bằng chứng định lượng theo vùng.

Nguồn: [Tanturri, RiMe — cholera prevention in the Two Sicilies](https://rime.cnr.it/index.php/rime/article/view/584); [Forti Messina, 1976 — cholera in Naples 1836–1837](https://www.persee.fr/doc/mefr_0223-5110_1976_num_88_1_2349).

### EXO_AGRA_FAMINE — Agra famine (drought)

Nguồn Cambridge xác nhận famine lớn ở vùng Agra, north-central India, trong 1837–1838. Nghiên cứu mới hơn về giai đoạn 1831–1838 mô tả mưa mùa hè 1837 muộn/thưa, sau đó thất bại mưa mùa đông, gây hỏng cả mùa kharif và rabi; hậu quả còn liên quan cơ sở thủy lợi, dự trữ, thu thuế, thị trường, dịch bệnh và phản ứng của East India Company.

**Phân loại đề xuất:** physical drought forcing riêng; endogenous crop/price/food shortage/mortality/migration; institutional relief/tax response riêng.  
**Cần làm rõ:** ngày 1837-09-01 có vẻ chính xác hơn mức chứng cứ hiện tìm được; bốn region EIC_DEL, EIC_ROH, AWA_LKO, PRI_RAJE chưa được xác minh từng vùng bằng crosswalk nguồn. Không đồng nhất toàn bộ famine với một drought modifier cố định.

Nguồn: [Major, 2020 — Agra famine 1837–38](https://www.cambridge.org/core/journals/journal-of-british-studies/article/abs/british-humanitarian-political-economy-and-famine-in-india-18381842/A5C1A7568D855B42DD03633E4AE60B8D); [Warren, 2026 — climate, crisis and colonialism](https://doi.org/10.1016/j.jhg.2025.11.005).

### EXO_POTATO_BLIGHT — Phytophthora infestans

Nghiên cứu tổng quan 2026 xác nhận pathogen được báo cáo tại Hoa Kỳ từ 1843 và lan sang châu Âu/Ireland năm 1845. Tư liệu dựa trên Atlas of the Great Irish Famine mô tả Flanders/Belgium, southern Netherlands và Rhineland bị ảnh hưởng từ giữa năm 1845; đến cuối mùa hè bệnh đã lan rộng ở miền bắc/tây Âu; đầu tháng 9 bệnh có mặt ở Ireland và Scotland. Có khác biệt nhỏ giữa các nguồn về tháng đầu tiên tại Flanders (June/July), nên cần giữ uncertainty.

**Phân loại đề xuất:** biological hazard introduction + propagation through seed trade, shipping and current contact network.  
**Cần làm rõ:** một mốc 1845-09-01 áp đồng loạt cho Flanders, Netherlands, Rhineland và Ireland/Scotland làm mất trật tự thời gian. Tách các đợt evidence hoặc dùng spread model có origin/observation dates. Famine, mortality, migration và government response là hậu quả mô phỏng, không phải effect của pathogen record.

Nguồn: [Ristaino, 2026 — Centuries of Potato Late Blight](https://doi.org/10.1146/annurev-phyto-011325-113146); [RTÉ / Atlas of the Great Irish Famine — spread chronology](https://www.rte.ie/history/famine-ireland/2020/1116/1178464-how-the-blight-spread-an-interactive-map/).

### EXO_CHOLERA_3 — Third cholera pandemic

Nguồn tổng quan ghi nhận đại dịch thứ ba thường được định niên đại 1846–1860, khởi phát ở Nam Á rồi lan đến châu Âu và châu Mỹ. Điều này không tự chứng minh ngày 1847-06-01 là khởi phát đồng thời tại 12 region ở Russia, Prussia, Austria/Hungary, France, Britain, USA, Qing China và India.

**Phân loại đề xuất:** pandemic introduction and spread, with separate region-level first-observation/arrival records.  
**Cần làm rõ:** chứng minh từng vùng và thời điểm; tránh một event có cùng date/mortality/duration cho mọi địa điểm. Nếu chưa có chứng cứ, chỉ giữ period-level context, không tạo exact tick.

Nguồn: [Al-Adham et al., 2024 — historical cholera pandemic chronology](https://academic.oup.com/jambio/article/135/3/lxae055/7623596); [Imperato et al., 2015 — Second pandemic in the Two Sicilies](https://doi.org/10.1007/s10900-015-0089-y) (dùng để phân biệt giai đoạn đại dịch thứ hai, không phải nguồn cho đợt thứ ba).

### EXO_GOLD_CALIFORNIA — Sutter's Mill

Ngày 24/01/1848 tại sawmill của Sutter trên South Fork American River, gần Coloma, được National Park Service xác nhận. Đây là ngày phát hiện/nhận diện mẫu vàng trong một bối cảnh lao động và tiếp cận cụ thể; nó không phải ngày hình thành mỏ địa chất.

**Phân loại đề xuất:** human-mediated discovery / knowledge transition.  
**Cần làm rõ:** region MEX_CAL là vùng Alta California rất rộng, không phải tọa độ sawmill. Actor access, control/sovereignty trong Mexican–American War, local labor/knowledge và public announcement phải được mô tả riêng. Ghi ngày nguồn chính xác nhưng effective simulation time vẫn là tick tháng 01/1848.

Nguồn: [US National Park Service — California Gold Rush](https://home.nps.gov/cali/learn/historyculture/california-gold-rush.htm); [California Geological Survey — Discovery of Gold in California](https://www.conservation.ca.gov/cgs/Pages/program-minerals/GoldDiscovery.aspx).

### EXO_GOLD_VICTORIA — Victorian gold rush

Nguồn của cơ quan tài nguyên bang Victoria nêu rõ First Nations đã biết vàng trong các con suối/khu vực trung tâm Victoria từ trước; người định cư châu Âu phát hiện trong thập niên 1840; vàng tại Clunes được tìm thấy năm 1850, nhưng chỉ công bố chính thức tháng 7/1851; sau thông tin này, rush lan đến Ballarat, Bendigo và Castlemaine.

**Phân loại đề xuất:** public announcement / legal opening / prospecting rush, không phải first geological discovery.  
**Cần làm rõ:** DZ_AUS_SE hiện là placeholder “Aboriginal nations of the south-east” chứ không phải một polity/administration đại diện Victoria Colony. Cần tách First Nations knowledge/land relationships khỏi British colonial administration, mining rights, settler migration và mining production. Không được ghi nhận “người châu Âu phát hiện” như thể trước đó không có tri thức bản địa.

Nguồn: [Resources Victoria — History of gold mining in Victoria](https://resources.vic.gov.au/geology-and-data/minerals/metals/gold/gold-mining-in-victoria); [National Museum of Australia — Gold rushes](https://www.nma.gov.au/defining-moments/resources/gold-rushes).

### EXO_NORTH_CHINA_FAMINE — 1876–1879

Nghiên cứu của Kathryn Edgerton-Tarpley xác định drought-famine tại năm tỉnh Shanxi, Henan, Shandong, Zhili và Shaanxi; drought bắt đầu năm 1876, nặng hơn nhiều khi mưa gần như thất bại năm 1877, mưa trở lại cuối 1878. Năm region QNG_SHX, QNG_HEN, QNG_SHD, QNG_ZHI, QNG_SHA trong source hiện khớp với năm tỉnh nêu trong tài liệu.

**Phân loại đề xuất:** multi-year drought forcing + food-market/state-relief failure + famine outcomes.  
**Cần làm rõ:** vùng địa lý có chứng cứ tốt hơn các record khác, nhưng mốc 1876-06-01 không phải ngày bắt đầu lịch sử chính xác đã được chứng minh; nên giữ year/season precision nếu không có observation cụ thể. Duration 36 tháng cần đối chiếu với mưa quay lại cuối 1878 và các pha famine/relief.

Nguồn: [Edgerton-Tarpley, 2008 — Tears from Iron](https://academic.oup.com/california-scholarship-online/book/20727/chapter-abstract/180103465); [MIT Visualizing Cultures — The North China Famine 1876–1879](https://visualizingcultures.mit.edu/tears_from_iron/tfi_essay01.html).

### EXO_GREAT_INDIAN_FAMINE — 1876–1878

Nghiên cứu về Madras famine xác định giai đoạn 1876–1878; nghiên cứu khí hậu về Global Famine cho thấy đợt đại hạn 1875–1878 bắt đầu tại India từ thất bại mùa mưa mùa đông 1875, kéo dài qua 1877 và đồng thời ảnh hưởng nhiều khu vực ở Asia, Brazil và Africa.

**Phân loại đề xuất:** drought forcing (possibly part of global drought event family) + regional food-system crisis + famine outcomes.  
**Cần làm rõ:** region set EIC_MAD, EIC_CED, EIC_MYS, EIC_DEC, HYD_HYD có vẻ là mô hình hóa bán đảo Nam Ấn, nhưng cần crosswalk từng vùng và thời gian. Mốc 1876-09-01 và yield loss 0.45 chưa được nguồn đã kiểm tra xác nhận ở mức chính xác này. Không dùng một famine event để đại diện toàn bộ Global Famine.

Nguồn: [Sami, 2011 — Starvation, Disease and Death in Madras 1876–1878](https://doi.org/10.1093/shm/hkq112); [Singh et al., 2018 — Climate and the Global Famine of 1876–78](https://doi.org/10.1175/JCLI-D-18-0159.1).

### EXO_GOLD_WITWATERSRAND — 1886 Main Reef

South African History Online phân biệt: first recorded gold discovery ở Witwatersrand năm 1884 (Bantjes; các reef nhỏ), còn main gold reef thường được ghi công cho George Harrison tại farm Langlaagte vào tháng 7/1886; Harrison ký affidavit về payable gold ngày 24/07/1886; các farm được tuyên bố public diggings ngày 08/09/1886.

**Phân loại đề xuất:** payable main-reef discovery / prospecting confirmation / mining-rights opening.  
**Cần làm rõ:** record nên được đặt tên “Main Reef payable-gold discovery” để không xóa các phát hiện 1884. Region IDs DZ_PEDI và NDE_MOS cần spatial crosswalk minh bạch tới Langlaagte/Main Reef; hai region tổng quát không tự chứng minh vị trí của farm. Mốc tháng 7 được hỗ trợ; ngày 01 không được nguồn hỗ trợ.

Nguồn: [South African History Online — Discovery of the Gold in 1884](https://sahistory.org.za/article/discovery-gold-1884); [Johannesburg Timeline 1800–1991](https://sahistory.org.za/article/johannesburg-timeline-1800-1991).

## 3. Candidate mới — Global Drought / Global Famine 1875–1878

Nghiên cứu khí hậu của Singh et al. mô tả drought nhiều năm tại Asia, Brazil và Africa từ 1875–1878; thêm các vùng Australia và Southeast Asia trong các mùa tiếp theo. India bị thiếu mưa từ mùa đông 1875, East Asia từ mùa xuân 1876, còn các vùng phía nam/châu Phi và Brazil có các đợt drought nặng trong 1877–78.

Đây là candidate quan trọng cho yêu cầu toàn thế giới, nhưng **không nên thêm ngay một event “global drought” với một danh sách region áp đồng thời**. Cần tách vùng, mùa, dữ liệu rainfall, crop exposure và social response. Dữ liệu nguồn 19th-century có độ phủ không đồng đều; chính nghiên cứu cũng cảnh báo station data thưa ngoài India, một phần Europe và North America.

Nguồn: [Singh et al., 2018 — Journal of Climate](https://doi.org/10.1175/JCLI-D-18-0159.1); [NASA GISS publication abstract](https://www.giss.nasa.gov/pubs/abs/si00300e.html).

## 4. Hành động kiến trúc được đề xuất (không phải patch)

1. Mỗi event cần event_class, causal_class, recorded_date, date_precision, effective_time_policy, origin_scope, observed_spread_scope, actor/authority, mode_policy, confidence, source locators.
2. Tách hazard forcing khỏi social outcomes. Drought không tự động tương đương famine; epidemic introduction không đồng nghĩa toàn bộ vùng lịch sử cùng nhiễm; gold discovery không đồng nghĩa deposit sinh ra vào ngày tìm thấy.
3. Region mapping phải lưu crosswalk và uncertainty, nhất là các region lịch sử rộng, placeholder polity và các địa điểm cụ thể như Coloma, Clunes, Langlaagte.
4. Nếu source chỉ cung cấp năm hoặc range, đừng ghi YYYY-01-01 hoặc YYYY-06-01 như ngày chính xác. Giữ recorded precision và map sang monthly tick theo policy riêng.
5. Historical Mode có thể dùng nguồn lịch sử để đặt context/origin/arrival candidates, nhưng spread, migration, food shortage, fiscal strain và phản ứng chính trị phải được tính từ state hiện tại.
6. Sandbox không dùng political/decision outcomes scripts sau 1836; hazard generation theo causal-class policy riêng, không mặc định “mọi historical hazard tắt” hoặc “mọi physical hazard luôn lặp”.
7. Evidence coverage cần ghi missingness theo region/entity/year. Không dùng nguồn toàn quốc để tự suy ra mức yield loss cho từng strategic region.

## 5. Giới hạn

- Đây là review 9 records có trong file hiện tại, không phải kiểm kê tất cả sự kiện 1836–1936.
- Không có primary archive page locator được kiểm tra cho mọi record; các nguồn ở trên là scholarly/institutional secondary evidence.
- Chưa kiểm chứng trực tiếp từng mortality/yield severity trong JSON.
- Chưa xác minh toàn bộ geopolitical status/control và spatial crosswalk của từng region tại event date.
- Không thay đổi canonical source registry hoặc historical data; Source Registry Delta chỉ là đề xuất.
- Không build, không chạy tests và không sửa runtime.

## 6. Tệp dữ liệu trong gói

- EVENT_CANDIDATES.csv: 9 source records hiện có + 1 candidate global drought, tất cả research-only.
- OPEN_EVIDENCE_REQUESTS.csv: các vấn đề cần source/geo/temporal verification trước khi data acceptance.
- SOURCE_REGISTRY_DELTA.csv: các nguồn bên ngoài đã kiểm tra, chưa nhập vào canonical source registry.


## 7. Benchmark coverage package (added 19/11/2026)

- `BENCHMARK_COVERAGE_REVIEW_VI.md` — checked-in benchmark audit and external source assessment.
- `BENCHMARK_FIELD_COVERAGE.csv` — 8 metric rows with observation count, entity coverage, year points, quality and compile status.
- `BENCHMARK_SOURCE_CANDIDATES.csv` — CoW NMC v7.0 (rights hold), MPD 2023 (CC BY 4.0 metadata verified; row-level audit blocked), existing Maddison 2010 (licence not established), GGDC Historical National Accounts (rights hold) and HFS (rights hold).
- `OPEN_BENCHMARK_COVERAGE_REQUESTS.csv` — 12 research/decision tasks covering dataset access, country/region crosswalk, licence clearance and additional dimensions.

Key discrepancy: current checked-in CoW extracts cover 17 irregular year points from 1816–1914; official CoW NMC v7.0 documentation advertises annual component data from 1816–2022. However, CoW's terms impose commercial-use and redistribution/other-use restrictions; NMC v7 remains `RIGHTS_REVIEW_REQUIRED`, not an approved game-data source. Do not download/import/repackage it without written permissions. MPD 2023 has an official CC BY 4.0 statement and is the preferred macro candidate, but row-level file audit remains blocked; the 2010 release has no licence statement on the official page inspected, so do not assume its rights are inherited from 2023. GGDC Historical National Accounts is a promising sectoral source, but no reuse licence is shown in the datahub page. Do not map present-day/source territories straight into 1836 polities.

These benchmark artifacts remain research-only. No source was added to canonical registry; no ETL/runtime patch was made.


### 7.1 CoW NMC v7 — rights hold (19/11/2026)

- CoW Terms & Conditions cấm dùng dữ liệu cho hoạt động thương mại, cấm phân phối cho bên thứ ba nếu không có văn bản đồng ý của CoW director và data host, và yêu cầu xin phép cho các hình thức phổ biến/đăng tải/sử dụng khác.
- `cow_nmc_v7` hiện có trạng thái `RIGHTS_REVIEW_REQUIRED`. Không tải, tích hợp, biến đổi thành derived game data hay phân phối trong APK/data pack trước khi có rights clearance bằng văn bản bao phủ đúng mục đích của sản phẩm.
- Việc trang cung cấp ZIP miễn phí không đồng nghĩa license mở. Audit hiện tại chỉ ghi nhận metadata công khai; không có dữ liệu NMC v7 được tải hoặc nhập.
- Nguồn chính thức: https://correlatesofwar.org/data-sets/ (Terms and Conditions); https://correlatesofwar.org/data-sets/national-material-capabilities/.

### 7.2 Entity-by-metric coverage matrices (19/11/2026)

- `BENCHMARK_ENTITY_METRIC_COVERAGE.csv` — complete 181 entity × 6 CoW metric matrix (1,086 rows). 322 entity-metric combinations have one or more observations; 764 are explicit missing rows. 59 entities have at least one CoW metric. Missing is not zero.
- `MADDISON_2010_UNIT_COVERAGE.csv` — 160 rows: 94 present-day territorial population units and 66 GDP-per-capita units, with exact year lists, quality and locators. The 160 rows do not directly map to 1836 registry polity IDs.
- These files are row-level coverage inventories only; no source values have been imported into runtime data and no time interpolation or geographic allocation has been performed.

### 7.3 Maddison 2023 and GGDC alternatives (19/11/2026)

- MPD 2023 is officially licensed CC BY 4.0. Required project citation: Bolt & van Zanden (2024), DOI 10.1111/joes.12618; retain the original-source citations in the workbook source sheet when charting or using subsets smaller than 12 countries. This is metadata-level licence verification only: the official workbook download remains blocked by Dataverse's signed object-store redirect, so exact row/field/year coverage is not yet checked.
- The repository's Maddison 2010 inputs are a separate legacy release. The official 2010 page inspected (AD 1–2008 population/GDP/GDPpc) does not display an explicit licence statement. Do not infer that the MPD 2023 CC BY 4.0 licence applies retroactively. BEN-13 tracks this rights issue.
- GGDC Historical National Accounts catalog includes selected country-level GDP/industry series, World Agriculture 1800–1938 and an All Countries overview ca.1870–2005. Coverage differs across files/countries. The datahub requires Smits, Woltjer & Ma (2009) citation but does not state a reuse licence on the page inspected; status remains RIGHTS_REVIEW_REQUIRED (BEN-12).
- No MPD 2023 or HNA data values were imported; no third-party mirror was used as the canonical dataset.

