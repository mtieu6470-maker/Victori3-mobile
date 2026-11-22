# CG-32 — Tham chiếu cơ chế công ty Victoria 3 và thiết kế công nghệ mở khóa (2026-11-22)

**Đầu vào đã đọc:** `docs/spec/CO01_COMPANIES_AND_MONOPOLIES_VI.md` §7; `historical_data/technologies/technologies.json` (130 tech IDs).  
**Đầu ra kèm theo:** `docs/research/design/CG32_TECH_TO_COMPANY_MAP.csv` (130 rows, one per tech ID).  
**Status:** DESIGN REFERENCE — không phải lệnh bật gameplay, không có thông số cân bằng được chứng thực từ game gốc.

## 1. Ranh giới nguồn và bản quyền

Victoria 3 là **tham chiếu cơ chế**, không phải nguồn lịch sử. Không sao chép danh sách tên công ty, văn bản mô tả, hình ảnh, dữ liệu số hay thông số cân bằng. Cơ chế đã thay đổi giữa các phiên bản (đặc biệt trước/sau bản cập nhật có Charters of Commerce); không khẳng định số lượng ô, điều kiện unlock hay hiệu ứng cụ thể là bất biến. Dùng các nguồn công khai để Claude kiểm tra theo **phiên bản game**:

- **V1 — Official developer diaries index / Companies:** https://forum.paradoxplaza.com/forum/forums/victoria-3-dev-diaries.1098/ (tìm “Companies”, “Prosperity”).
- **V2 — Official dev diary / Charters of Commerce:** https://forum.paradoxplaza.com/forum/forums/victoria-3-dev-diaries.1098/ (tìm “Charters of Commerce”, “Company Charters”, “Company Expansion”).
- **V3 — Official Victoria 3 news and patch notes:** https://www.paradoxinteractive.com/games/victoria-3/news (kiểm tra patch cụ thể trước khi gán hành vi).
- **V4 — Community wiki:** https://vic3.paradoxwikis.com/Company ; https://vic3.paradoxwikis.com/Technology (wiki không phải tài liệu pháp lý/lịch sử).
- **V5 — Community feedback (qualitative only):** https://www.reddit.com/r/victoria3/search/?q=companies%20charters&restrict_sr=1 (không coi phản hồi cộng đồng là dữ liệu cân bằng được kiểm chứng).

**Evidence classification:** V1–V4 là địa chỉ đối chiếu, không phải bằng chứng đã kiểm chứng từng patch trong lượt này. Các chi tiết ở §2 là mô tả khái quát của hệ thống; số slot cụ thể, công thức prosperity và charter unlock theo phiên bản cần được Claude đối chiếu bản build trước khi triển khai.

## 2. Cơ chế Victoria 3 — mô tả khái quát, không sao chép dữ liệu

| Trục | Mô tả tham chiếu | Cảnh báo phiên bản / thiết kế |
|---|---|---|
| Thành lập | Quốc gia có thể lập công ty khi đáp ứng điều kiện của loại hình, ngành hoạt động và giới hạn năng lực/quyền thành lập | Đừng đồng nhất unlock công nghệ với tự động spawn |
| Ngành | Công ty có ngành chuyên môn, tương tác với công trình sản xuất và năng lực kinh tế | Một nhóm công ty không tương đương một pháp nhân lịch sử |
| Trụ sở | HQ gắn với địa bàn và tạo đầu mối công ty | HQ không mặc nhiên chuyển toàn bộ GDP từ tỉnh khác về |
| Thịnh vượng | Prosperity liên hệ hiệu quả kinh tế/khả năng sinh lời và mở thêm lợi ích công ty khi đạt điều kiện | Không nên cấp buff thụ động chỉ vì đã tồn tại |
| Ô đặc quyền | Company charter là lựa chọn có điều kiện; hệ thống hiện đại có giới hạn số ô và mở rộng khả năng qua tiến triển | Số ô và danh mục charter thay đổi theo patch; không ghi hằng số như sự thật bất biến |
| Tiến bộ | Công nghệ và luật có thể mở thêm khả năng thành lập, hoạt động và lựa chọn charter | Luật, capital, site, market và geopolitical rights là điều kiện độc lập |
| Kinh tế | Công ty chuyên môn hóa/đầu tư/mở rộng tạo hiệu ứng trong chuỗi sản xuất, thương mại và sở hữu | Phải chống double-count TFP, GDP, dividends và capital |
| Chính trị | Quyền sở hữu, giới chủ, công đoàn, nhà nước và ưu đãi pháp lý ảnh hưởng phân phối lợi ích | Không suy diễn một charter luôn tăng legitimacy hoặc loyalty |

**Cảm nhận người chơi (chủ đề cần khảo sát định lượng thêm):** khen việc công ty tạo mục tiêu kinh tế theo ngành và lựa chọn chuyên môn; phê bình khi hiệu ứng cộng dồn quá mạnh, slot/chỉ tiêu khó hiểu, công ty có lợi ích mà không có chi phí, và AI lựa chọn thiếu bối cảnh. Đây là *giả thuyết thiết kế từ thảo luận cộng đồng*, không phải kết quả khảo sát đã thống kê.

## 3. Map 130 công nghệ của dự án

`CG32_TECH_TO_COMPANY_MAP.csv` chứa chính xác 130 hàng dữ liệu, mỗi hàng tương ứng một `id` thực trong cây công nghệ:
- `PROPOSED_CONDITIONAL`: tech mở **khả năng** lập loại hình công ty và **khả năng xin xét** đặc quyền, không cấp trực tiếp.
- `NO_DIRECT_UNLOCK`: tech quân sự/tri thức/tổ chức công không mở loại công ty tư nhân hoặc charter trực tiếp; vẫn có thể ảnh hưởng các điều kiện khác của engine.
- `historical_year`: sao chép mốc practical diffusion từ cây dự án, **không phải năm luật cấp charter**.
- `source_ids`: mã nguồn tham khảo cho ngành; chưa phải chứng minh một đặc quyền đã tồn tại trong mọi quốc gia/năm.

Ví dụ các liên kết thiết kế (tên tự đặt):
- `railways` → `railway_operator` + `network_franchise` (đường sắt, cần luật/nhượng quyền hạ tầng).
- `bessemer_steel` → `integrated_steelworks` + `industrial_financing` (thép, cần vốn và nguồn nguyên liệu).
- `oil_refining` → `petroleum_refiner` + `storage_license` (lọc dầu, cần kho/bảo đảm an toàn).
- `central_power_stations` → `electric_utility` + `grid_concession` (điện lực, cần lưới và quản lý giá).
- `motor_cars` → `automobile_manufacturer` + `dealer_network` (ô tô, cần demand, cao su và cơ khí).
- `containerisation` → `container_logistics` + `terminal_access` (vận tải container, cần cảng và hạ tầng).
- `internet` → `internet_service_operator` + `network_interconnection` (hạ tầng số, cần quyền truy cập mạng).

**Quan trọng:** `charter_kind` trong CSV là **candidate privilege/right**, không phải chứng cứ một quốc gia đã cấp văn bản hiến chương cho doanh nghiệp. Các mục như `supplier_contract`, `dealer_network`, `service_contract` là hợp đồng thương mại, **không phải charter theo nghĩa pháp lý**. Trước khi code phải chuẩn hóa trường `right_kind` với `legal_class = CHARTER | LICENSE | CONTRACT | CAPABILITY`; chỉ `CHARTER` mới có `legal_basis_id`, scope, start/end dates và cơ quan cấp. Nếu không có nguồn, không tự kích hoạt độc quyền.

## 4. Phản biện CO-01 §7

1. **“Mở khóa bất kỳ công nghệ = một đặc quyền công ty”**: phản đối áp dụng máy móc. Trong 130 tech có vaccine, học thuyết, vũ khí, quản trị nhà nước; bắt buộc tạo charter cho tất cả sẽ vô lý. Nên hiển thị “khả năng kinh doanh mới” hoặc “năng lực công nghiệp” thay cho charter khi phù hợp.
2. **Ô đặc quyền tăng theo thịnh vượng**: nếu prosperity → thêm slot → buff → prosperity thì hình thành vòng phản hồi dương không giới hạn. Giới hạn theo luật và quy mô, thêm upkeep/oversight và diminishing returns; không cộng thẳng TFP.
3. **Độc quyền hàng hóa = phụ phí giá**: không tự cấp khi research; phải có market definition, legal basis, competition enforcement, demand elasticity và nguồn CG-30. Khi thiếu dữ liệu, **OFF**.
4. **Ưu tiên mua sắm nhà nước**: phải dùng ngân sách và hợp đồng đấu thầu có giới hạn; không spawn doanh thu. Có cơ chế chống tham nhũng và cạnh tranh.
5. **Nhượng địa/khai thác thuộc địa**: không phải productivity bonus. Ghi đầy đủ cưỡng bức lao động, chuyển lợi nhuận, giảm phúc lợi, bất ổn và chi phí quản trị theo §6.
6. **Mở rộng nước ngoài**: cần chủ quyền, luật đầu tư, quyền sở hữu và ngoại giao; GNI nhận thu nhập ròng xuyên biên giới, GDP ở nơi sản xuất.
7. **Đầu tư R&D**: trích tiền thật khỏi cash flow, giới hạn bởi nhân lực/kỹ năng và nghiên cứu trong ngành; không cấp điểm nghiên cứu vô hạn.
8. **Liên kết ngân hàng**: giảm chi phí vốn phải được bù bởi phí, collateral, default risk và credit supply; tránh “free money”.
9. **Company HQ**: việc làm/thuế phát sinh tại HQ phải đến từ hoạt động dịch vụ thực, không nhân bản sản lượng của sites.
10. **Historical Mode**: `CG31` có thể chứng minh công ty tồn tại nhưng chưa chứng minh loại charter, market share hay khả năng sản xuất ở 1836. Dùng separate gates.

## 5. Đề xuất schema/kiểm định cho Claude

```ts
type RightClass = 'CHARTER' | 'LICENSE' | 'CONTRACT' | 'CAPABILITY';
interface CompanyUnlock {
  techId: string;
  companyKind?: string;
  rightKind?: string;
  rightClass?: RightClass;
  requiresLawIds?: string[];
  requiresSiteKinds?: string[];
  requiresCapital?: number;
  legalBasisId?: string;
  validFrom?: number;
  validTo?: number;
}
```

**Validation bắt buộc:**
- 130/130 tech IDs là duy nhất, không có unknown ID, không trùng unlock gây stack hiệu ứng.
- Không có `CHARTER` hoạt động nếu thiếu law + legal basis + jurisdiction + goods/territory + date.
- Không có quyền độc quyền xuất hiện chỉ vì research tech.
- Cùng seed: trước/sau unlock tech, nếu không có site/capital/law thì công ty không tự sinh và GDP không tự tăng ngoài TFP vốn đã có.
- Prosperity/slot cap và upkeep; test chống exploit vòng lặp bonus.
- Ownership ledger: sum(inflows)=sum(outflows), không double-count dividends, GDP/GNI.
- Historical Mode chỉ tạo quy mô đã được CG-31 chứng thực; Sandbox dùng quy luật nội sinh.
- Tốc độ Android: cache unlock indexes theo tech-set version, không quét 130 tech cho từng công ty mỗi tick.

## 6. Nguồn lịch sử cho mapping

- **S1** — Project CG-28 research catalogue: `docs/research/history/CG28_TECH_CATALOGUE.csv` và trường `source` trong `technologies.json`. Đây là mốc practical adoption của dự án, không chứng minh legal privileges.
- **S2** — Project CG-31 company research: `docs/research/history/CG31_COMPANIES_AND_COMPANY_LAW_VI.md`; các ví dụ lịch sử như Siemens, Krupp, Standard Oil, Ford, Mitsubishi, NYK; nguồn chính thức và hồ sơ đương thời liệt kê tại §6 tài liệu đó.
- **S3** — UK company law: Joint Stock Companies Act 1844, Limited Liability Act 1855, Companies Act 1862; https://www.legislation.gov.uk/ukpga/Vict/7-8/110/contents ; https://www.legislation.gov.uk/ukpga/Vict/18-19/133/contents ; https://www.legislation.gov.uk/ukpga/Vict/25-26/89/contents. Luật công ty không tự cấp độc quyền theo ngành.
- **S4** — Các mốc hậu 1950 dùng để phân loại ngành/technology diffusion, không phải chứng cứ charter: CG-28 và tài liệu lịch sử dự án. Cần nguồn luật theo từng nước trước khi bật right.

**Acceptance:** research design/map complete; **not implementation-ready for legal charter activation**. Claude cần phân loại rightClass, kiểm chứng patch Victoria 3 nếu muốn sao sát chi tiết slot và tạo test trước khi tích hợp.
