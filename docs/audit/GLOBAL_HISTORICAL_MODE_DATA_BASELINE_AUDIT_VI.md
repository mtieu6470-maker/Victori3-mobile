# Kiểm toán baseline lịch sử toàn cầu — Historical Mode

**Ngày:** 18/11/2026  
**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Data baseline SHA:** `44ab55f34c2069207be6d5dd23b49ba5c38fdfd0`  
**Documentation baseline SHA:** `b63149242618c09d722f06068826f1651dc226ad`  
**Trạng thái:** `SELF_AUDIT / DOCUMENTATION_ONLY / NO_PRODUCT_PATCH`

## 1. Kết luận điều hành

Dữ liệu trong repository hiện là **nền tảng ban đầu**, chưa đủ để tuyên bố chuỗi lịch sử kế vị chính xác toàn cầu cho toàn chiến dịch 1836–1936. Có nhiều chuỗi tốt ở một số nước, nhưng còn thiếu country profiles, thiếu timeline kế vị, phụ thuộc Wikipedia/default citations, và mô hình hiện tại chưa biểu diễn đầy đủ các tầng quyền lực.

Đây là audit dữ liệu và đường sử dụng của engine, không phải kiểm định toàn bộ nội dung game. Không có dữ liệu gameplay hoặc engine nào bị sửa trong gói này.

## 2. Coverage baseline

| Chỉ số | Giá trị |
|---|---:|
| Political entities trong `historical_data/political_entities/registry.json` | 181 |
| Country profiles (136 core + 11 detailed) | 147 |
| Succession arrays trong `heads_of_state.json` | 93 |
| Tổng succession records | 439 |
| Profile có succession array | 93 / 147 = 63,3% |
| Profile chưa có succession array | 54 / 147 = 36,7% |
| Tier A | 11 / 11 có array |
| Tier B | 24 / 29 có array |
| Tier C | 58 / 104 có array |
| Tier D | 0 / 3 profile có array |
| Registry entities không có country profile | 34 |

54 profile thiếu succession array:

`ION, WAL, MOL, CIR, IMM, HER, KAN, KHI, BUK, KOK, NAJ, YEM, SND, KAL, NAG, AWA, GWA, HOL, BRD, PRI, BHU, SKM, TIB, RYU, LUA, MLY, BRN, SUL, ACE, MAO, MOR, TUN, CON, ABD, ETH, SHE, BOR, WAD, DAR, ASH, DAH, OYO, MAS, FJA, LIB, ZUL, NDE, BSO, MER, BUG, TEX, CAF, RGS, HAI`.

34 registry entities không có country profile gồm 19 future polities, 4 subject components và 11 decentralized placeholders. Không được gộp 34 này vào “thiếu vua”: future polity cần formation/leader timeline; subject component cần xác định authority; decentralized placeholder có thể cần mô hình hội đồng/collective authority.

Ma trận `GLOBAL_HISTORICAL_SUCCESSION_COVERAGE_1836.csv` có một dòng cho mỗi 181 registry ID.

## 3. Provenance và chất lượng nguồn

Trong 439 records:
- 346 records có `sources` riêng ở cấp record.
- **288 records chỉ được trích `wikipedia_en`**, không có nguồn non-Wikipedia kèm theo.
- 58 records có ít nhất một nguồn non-Wikipedia.
- 93 records không có source reference cấp record; file chỉ khai báo `sources_default = [bayly_2004, osterhammel_2014]`.
- 436 records thừa hưởng `quality_default = supported`; chỉ 3 records gắn `quality = uncertain`.

Điều này không chứng minh 288 records sai. Nhưng nó **không đủ để coi chúng đã được xác minh độc lập** theo tiêu chuẩn Historical Mode. Wikipedia là đầu mối truy nguồn, không phải chứng cứ cuối cho mốc kế vị quan trọng. Hai nguồn mặc định là sách tổng quan lịch sử toàn cầu; nếu không có locator theo từng record, không thể kiểm chứng riêng từng ngày sinh/ngày mất/nhiệm kỳ.

## 4. Temporal coverage và precision

`heads_of_state.json` tự mô tả phạm vi “1836–1900”. Master Spec mô tả campaign **1836–1936**.

Kết quả kiểm tra:
- 92/93 arrays có ít nhất một record bao phủ 01/01/1836. PEU có record đầu tiên từ 08/01/1836; cần đối chiếu với profile start.
- 48/93 arrays có record bao phủ năm 1900.
- Chỉ 1/93 arrays có record bao phủ năm 1936 (NED, record kéo dài đến 1948).
- 45 arrays có record cuối trước năm 1900; 92 arrays có record cuối trước năm 1936. Đây không tự động là lỗi vì một số polity đã giải thể/đổi chủ thể, nhưng cần nối rõ với formation/dissolution và kế vị của thực thể tiếp theo.
- `from`: 428 giá trị ngày, 1 giá trị tháng, 10 giá trị năm.
- `to`: 432 ngày, 1 tháng, 6 năm.
- `born`: 251 ngày, 4 năm; còn lại thiếu.
- `died`: 254 ngày, 1 năm; còn lại thiếu.

Không được ép dữ kiện chỉ có năm/tháng thành ngày giả. Cần biểu diễn date precision và interval semantics rõ trước khi yêu cầu engine xử lý các mốc đó.

## 5. Schema và validation hiện tại

### 5.1. Schema

`src/engine/data/dbTypes.ts` định nghĩa `LeaderRecord` với name/title/born/died/from/to/end/governance/after_regime_change/note/quality, nhưng interface chưa khai báo provenance record-level dù JSON có trường `sources`. Schema cũng chưa mô hình hóa rõ:
- role (head of state, regent, governor, claimant, local paramount chief, council);
- authority scope (de jure, de facto, local, colonial/overlord);
- claimant và authority công nhận;
- joint/rotating/collective office;
- date precision/range/circa và calendar conversion;
- một cá nhân giữ nhiều office hoặc một polity có nhiều tầng quyền lực.

### 5.2. Build validation

`tools/build-data.ts` kiểm tra cơ bản `from <= to`, `born <= died` và source ID tồn tại. Chưa có kiểm tra chuyên biệt cho date precision, overlapping/gaps, coverage 1836/1936, source strength/locator, role/sovereignty scope hoặc loại transition (kế vị, regency, restoration, coup, colonial appointment, state formation).

Các gaps hiện thấy có thể là interregnum, nội chiến hoặc chính quyền lâm thời; cần nghiên cứu nguồn trước khi kết luận là lỗi và trước khi lấp bằng một tên lãnh đạo sinh ngẫu nhiên.

### 5.3. Engine behavior

- `src/engine/modes.ts`: Historical bật succession, decision windows, dated exogenous events và historical priorities; Sandbox tắt những lớp lịch sử sau khi khởi tạo (vẫn dùng ruler/heir ở profile 1836).
- `src/engine/systems/events.ts`: khi historical leader chết, engine tìm successor cùng governance và chỉ trong cửa sổ start tối đa khoảng 2 năm; không tìm thấy thì sinh leader thay thế.
- Các end reason như abdication/deposition/revolution không bị ép xảy ra. Đây phù hợp Master Spec về việc không railroad lịch sử, nhưng có nghĩa Historical Mode hiện tại không tự tái hiện mọi chuyển giao chính trị nếu simulation không tạo ra nguyên nhân.
- Mô hình hiện tại chưa thể hiện đầy đủ regency, multiple claimant, colonial/local dual authority, collective leadership và recognition delays.

**Finding cần review độc lập:** nhánh succession có điều kiện `!c.regimeChangedAt` đồng thời loại record `after_regime_change`. Điều này có vẻ không khớp với ý nghĩa cờ và cần xác minh có đường code nào khác xử lý chúng. Không tự sửa code trong audit này.

## 6. Khoảng trống cần xử lý

1. Re-audit provenance cho toàn bộ 439 records, nhất là 288 record chỉ Wikipedia và 93 record không có nguồn riêng.
2. Research 54 profile chưa có succession array, phân lô theo vùng và độ quan trọng.
3. Extend timeline 1901–1936 cho mọi polity còn tồn tại; bổ sung formation timeline cho future state.
4. Model authority đa tầng cho subject, colony, protectorate, princely state, councils, rotating office, regency và contested claim.
5. Date precision, calendar conversion, reign overlap/gaps, interim officeholders.
6. Cross-check succession với polity transitions, territorial sovereignty, government type, events và wars.
7. Historical Mode acceptance: nếu không có can thiệp làm đổi nguyên nhân, đường lịch sử phải phù hợp bối cảnh tham chiếu; nếu diverge, phải có nguyên nhân truy vết được.
8. Sandbox acceptance: không bị ép theo lịch sử sau 1836, nhưng vẫn tuân theo quan hệ nhân quả của simulation.

## 7. Lộ trình khuyến nghị

| Giai đoạn | Việc | Điều kiện đóng |
|---|---|---|
| G0 | Tiêu chuẩn toàn cầu, date precision, role taxonomy, source policy | Review độc lập + owner acceptance |
| G1 | Re-audit 439 records hiện có | Locator/source grade cho mọi record quan trọng; dispute được giữ nguyên |
| G2 | Bổ sung 54 profile thiếu array và xử lý entity không có nguyên thủ đơn nhất | Matrix từng entity được đóng hoặc có disposition |
| G3 | Mở rộng đến 1936 | Timeline có coverage hoặc ghi rõ polity đã chấm dứt/chuyển đổi |
| G4 | Nối succession, events, borders, wars và government | Temporal consistency tests |
| G5 | Multi-region History/Sandbox tests | Nhiều seed, 12 macro-region, divergence giải thích được |

## 8. Phạm vi và giới hạn

Tệp này và coverage matrix là tài liệu audit. Không sửa `historical_data/`, `heads_of_state.json`, profile, source runtime, political registry, schema, engine, events, tests, assets, save, Android, Gradle, workflows hay APK. Không chạy build/test trong gói này. Đây là self-audit, không phải Claude `REVIEW_PASS`, owner acceptance hoặc S1 authorization.
