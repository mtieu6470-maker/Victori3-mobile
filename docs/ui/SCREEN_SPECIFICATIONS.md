# SCREEN SPECIFICATIONS — Đặc tả màn hình

> **Cập nhật v3 (15/11/2026):** kiến trúc đã đổi sang bản đồ toàn màn hình với cửa sổ nổi thu gọn/mở rộng/đóng, rail và dock kim loại, thẻ ngữ cảnh khi chạm bản đồ, chế độ toàn bản đồ — xem `UI_DESIGN_SYSTEM.md` (v3). Phần dưới đây giữ nguyên như đặc tả v1; khi mâu thuẫn, `UI_DESIGN_SYSTEM.md` và mã nguồn được ưu tiên.

Mỗi màn hình: **Mục đích · Dữ liệu (đường dẫn trong engine) · Trạng thái · Hành động (lệnh engine) · Điều hướng · Biến thể theo chế độ**.

Ký hiệu sẵn sàng của engine (kiểm tra theo mã nguồn `src/engine/` hiện tại):
- ✅ **Có**: dữ liệu/lệnh đã tồn tại trong engine v0.1 và đã chạy trong kiểm thử.
- 🟡 **Một phần**: có dữ liệu thô nhưng thiếu trường UI cần (ví dụ chuỗi thời gian).
- ❌ **Chưa có**: engine chưa mô phỏng; **UI không được hiển thị nút/số giả** cho mục này — màn hình ẩn khối đó hoặc ghi "Chưa mô phỏng trong phiên bản này".

Trạng thái chung áp dụng cho mọi màn hình: **Đang tải** (skeleton, không spinner toàn màn), **Rỗng** (giải thích vì sao rỗng + gợi ý hành động), **Lỗi** (thông điệp + "Thử lại"; không mất dữ liệu đang nhập), **Chỉ đọc** (Observer hoặc đối tượng không thuộc quyền), **Bình thường**.

---

## S01 Menu chính
- Mục đích: vào chiến dịch mới, tiếp tục, tải, cài đặt, thuật ngữ.
- Dữ liệu: danh sách save cục bộ (meta: ngày trong game, chế độ, quốc gia, phiên bản save). ✅ (`save.ts`: format + version)
- Hành động: Tiếp tục (save gần nhất), Chiến dịch mới, Tải, Cài đặt, Thoát.
- Trạng thái: không có save → ẩn "Tiếp tục"; save khác phiên bản → cảnh báo "cần chuyển đổi" (❌ migration chưa có).

## S02 Chọn chế độ
- Mục đích: chọn **Historical** hoặc **Sandbox / Lịch sử thay thế**; giải thích khác biệt bằng 3 gạch đầu dòng mỗi bên (cùng engine, cùng dữ liệu xuất phát; Historical thêm xu hướng & cửa sổ quyết định; Sandbox không có).
- Dữ liệu: `MODES` ✅. Tùy chọn seed (số, nút "ngẫu nhiên") ✅.
- Hành động: chọn chế độ → S03.

## S03 Vai trò & chọn quốc gia
- Mục đích: chọn quốc gia hoặc **Observer**.
- Dữ liệu: danh sách thực thể `db.entities` (tên vi/en, tier, dân số + chấm chất lượng, chính thể, nguyên thủ 1836, mức hoàn thiện hồ sơ `research_completeness`) ✅; bản đồ chính trị 1836 ✅.
- Bộ lọc: châu lục, tier (A/B/C), "chỉ quốc gia có hồ sơ đầy đủ", tìm kiếm tên (vi/en). Sắp xếp: dân số, sức mạnh, tên.
- Trạng thái: chính thể placeholder (tier D) hiển thị nhãn "Chưa nghiên cứu riêng" — vẫn chơi được nhưng cảnh báo dữ liệu thiếu.
- Hành động: chọn → xem thẻ tóm tắt (bối cảnh 1836, khó khăn chính, nguồn) → "Bắt đầu". Observer → chọn quốc gia theo dõi ban đầu (đổi được bất kỳ lúc nào).

## S04 Bản đồ (trang chủ)
- Mục đích: quan sát và hành động theo không gian.
- Dữ liệu: lưới vùng `public/generated/map.bin` ✅, bờ biển `coast.json` ✅, `regions[].owner/controller` ✅, chiến tranh (vùng bị chiếm) ✅, nhãn quốc gia (tính từ tâm vùng) ✅.
- Thành phần: TopStatusStrip, NavRail/BottomNav, LensPicker, ContextCard, Inbox, TimeControl.
- Cử chỉ: xem ANDROID_INTERACTION_RULES.
- Trạng thái: Tạm dừng; tự dừng (sự kiện quan trọng — hiển thị lý do); Observer (nhãn "QUAN SÁT" cạnh ngày).
- Biến thể Historical: lens "Khác biệt so với lịch sử" ✅ (`historicalOwner()` + territoryLog); Sandbox: lens này vẫn có nhưng đặt tên "So với lịch sử thực" (chỉ tham khảo).

## S05 Lens & chú giải
| Lens | Dữ liệu | Sẵn sàng |
|---|---|---|
| Chính trị (chủ sở hữu / kiểm soát / chư hầu) | `owner`, `controller`, `overlord` | ✅ |
| Dân số (mật độ, tổng) | `pop`, `area` | ✅ |
| Mức sống | `sol` | ✅ |
| Biết chữ | `literacy` | ✅ |
| Văn hóa / tôn giáo | `culture`, `culture2`, `religion` | ✅ (tối đa 2 văn hóa/vùng) |
| Kinh tế (sản lượng/người) | `output` | ✅ |
| Tài nguyên | `res[]` | ✅ |
| Công nghiệp | `buildings.*` | ✅ |
| Bất ổn / dân tộc chủ nghĩa | `radical`, `nationalism` | ✅ |
| Ngoại giao (quan hệ với quốc gia chọn) | `relations`, `treaties`, `rivalries` | ✅ |
| Quân sự (chiến sự, chiếm đóng) | `wars`, `controller` | ✅ |
| Thị trường / liên minh thuế quan | `customsUnion` | ✅ |
| Chất lượng dữ liệu dân số | `db.regions[].pop_quality` | ✅ |
| Khác biệt với lịch sử | `historicalOwner()` | ✅ |
| Hạ tầng (đường sắt) | `buildings.railway` | ✅ |
| Tuyến thương mại, tiếp cận thị trường | — | ❌ |

## S06 Chi tiết vùng
- Dữ liệu: tên, chủ/kiểm soát, dân số (+ chất lượng + nguồn nhóm benchmark), cơ cấu 9 tầng lớp (`strata`), văn hóa/tôn giáo, biết chữ, mức sống, bất ổn, dân tộc chủ nghĩa, địa hình, diện tích, tài nguyên, công trình theo loại, sản lượng/tháng, thiên tai đang diễn ra (`blight`, `epidemic`). ✅
- Hành động: Xây công trình (lệnh `build`) ✅ — mở DecisionSheet: chi phí (`buildCost`), lợi suất dự kiến (`buildingReturn`), lao động khả dụng; Đặt mục tiêu chiến tranh (nếu vùng của nước khác) → S22; Xem trên bản đồ.
- Trạng thái: vùng của nước khác → chỉ xem + hành động ngoại giao; vùng bị chiếm → banner "Bị chiếm bởi …".

## S07 Tổng quan quốc gia
- Mục đích: "bức tranh 10 giây" về quốc gia.
- Dữ liệu: nguyên thủ (tên, năm sinh, từ năm, lịch sử/được sinh ra), chính thể (`govLabel`, `laws.power/governance`), xếp hạng sức mạnh (`powerScore`), GDP, dân số, biết chữ, mức sống, chính danh, cực đoan, ngân khố/nợ, quân số/hải quân, uy tín, tiếng xấu, chư hầu/quan hệ lệ thuộc, liên minh thuế quan. ✅ Biểu đồ năm (`history[id]`) ✅. Hồ sơ lịch sử (profile) với chất lượng từng mục ✅.
- Khối "Hồ sơ lịch sử 1836": các mục A–H (chính trị, lãnh thổ, kinh tế, xã hội, ngoại giao, quân sự, công nghệ, sự kiện) với trạng thái hoàn thiện `profile_sections` ✅.
- Hành động: không có (thông tin); link sang các panel.

## S08 Ngân sách
- Dữ liệu: thu (`income`, `tariffIncome`), chi (`expense`; phân rã: quân đội, hải quân, hành chính, giáo dục, y tế, xây dựng, lãi), ngân khố, nợ, thuế suất. ✅ Phân rã chi theo khoản: 🟡 (engine tính trong `financeMonth` nhưng chưa lưu từng khoản → cần trường `lastBudget` trong engine).
- Hành động: chỉnh thuế (`set_tax`) ✅, tỷ trọng ngân sách (`set_budget` cho admin/education/health/construction) ✅, mục tiêu quân số/hải quân (`set_army_target`, `set_navy_target`) ✅. Mọi thanh trượt hiển thị **dự báo cán cân tháng sau** (cần hàm dự báo — 🟡).
- Cảnh báo: nợ > 4 năm thu → nguy cơ vỡ nợ (luật trong `financeMonth`).

## S09 Thị trường & hàng hóa
- Dữ liệu: 12 hàng hóa, giá thị trường quốc gia/liên minh (`marketPrices[market][good]`) và giá thế giới (`worldPrices`) ✅; cung/cầu/nhập khẩu từng mặt hàng 🟡 (tính trong `computeEconomy` nhưng chưa lưu → cần lưu `marketStats`); xu hướng giá 🟡 (cần chuỗi tháng).
- Bảng: hàng · giá · % so với giá gốc · cung/cầu · thiếu hụt (●) · nhập/xuất.
- Hành động: không có lệnh thương mại trực tiếp (engine dùng mô hình thị trường mở theo luật thương mại) — thay đổi luật thương mại ở S16. Tuyến thương mại ❌.

## S10 Chi tiết hàng hóa
- Dữ liệu: giá, công trình sản xuất (từ `RECIPES`), vùng sản xuất chính (theo `res` và công trình) ✅; ai tiêu thụ 🟡.

## S11 Sổ đăng ký công trình
- Dữ liệu: theo vùng × loại công trình: cấp (`buildings`), lợi suất dự kiến (`buildingReturn`) ✅; việc làm/thực tế/lợi nhuận từng công trình 🟡; phương thức sản xuất ❌ (engine dùng công thức cố định/loại).
- Bảng: nhóm theo loại → mở theo vùng; bộ lọc: loại, vùng, có thể xây thêm.

## S12 Chi tiết công trình
- Dữ liệu: đầu vào/đầu ra (recipe), lao động cần, cấp hiện tại, lợi suất ✅.
- Hành động: Xây thêm cấp (`build`) ✅. Phá dỡ/trợ cấp ❌.

## S13 Xây dựng & hàng đợi
- Dữ liệu: quỹ xây dựng nhà nước (`statePool`), quỹ tư nhân (`privatePool`) ✅. **Hàng đợi có thời gian thi công ❌** — engine hiện xây xong ngay khi đủ tiền. Trước khi có UI hàng đợi phải bổ sung `constructionQueue` (tiến độ, ETA, lý do bị chặn) vào engine.
- Trong lúc chờ: màn hình chỉ hiển thị "Dự án hoàn thành gần đây" (từ log) và nút "Xây" mở S06/S11.

## S14 Dân số & xã hội
- Dữ liệu: dân số, cơ cấu tầng lớp, biết chữ, mức sống, nạn đói (`famine`), văn hóa/tôn giáo theo vùng ✅; luồng di cư 🟡 (tính nhưng chưa lưu).
- Bảng theo vùng: dân số · SoL · biết chữ · cực đoan · dân tộc chủ nghĩa.
- Biểu đồ: dân số theo năm ✅; cơ cấu tầng lớp toàn quốc ✅.

## S15 Chính phủ & nhóm lợi ích
- Dữ liệu: 8 nhóm lợi ích với `clout` và `approval` ✅; chính danh, cực đoan ✅; nguyên thủ, người kế vị ✅; luật nhóm mong muốn (từ `IG_PREFS`) ✅; lãnh đạo nhóm/nhân vật ❌; kết quả bầu cử ❌.
- Thẻ IG: tên, clout %, mức hài lòng (chữ + ▲▼), 3 luật ủng hộ / 3 luật phản đối.

## S16 Luật & cải cách
- Dữ liệu: 9 nhóm luật (`laws`) ✅; cải cách đang tiến hành (`reform`: nhóm, giá trị, tiến độ, tháng đã trôi) ✅; mức ủng hộ dự kiến (`reformSupport`, `previewReform`) ✅.
- Hành động: Bắt đầu cải cách (`start_reform`) ✅ qua DecisionSheet: nhóm ủng hộ/phản đối (theo clout), xác suất tiến triển/tháng (theo luật trong `politicsMonth`), rủi ro (thất bại sau 48 tháng → giảm chính danh), tác động dự kiến (danh sách hiệu ứng của luật).
- Trạng thái: đã có cải cách → nút khác bị khóa kèm lý do.

## S17 Công nghệ
- Dữ liệu: 38 công nghệ, 3 nhánh, tiền đề, năm áp dụng lịch sử, chi phí hiện tại (`techCost`: hệ số thời đại + khuếch tán), điểm nghiên cứu/tháng (`researchPoints`), đang nghiên cứu ✅.
- Bố cục: cột theo thời đại (năm lịch sử), hàng theo nhánh; zoom/pan; chạm nút → thẻ chi tiết (hiệu ứng, tiền đề, % thế giới đã biết).
- Hành động: Chọn nghiên cứu (`set_research`) ✅; hàng đợi nghiên cứu ❌ (engine chỉ có 1 mục hiện tại).

## S18 Ngoại giao — quan hệ
- Dữ liệu: quan hệ (−100..100), đối thủ, liên minh, bảo đảm, chư hầu, sức mạnh tương đối ✅.
- Bảng: quốc gia · quan hệ · hiệp ước · sức mạnh · khoảng cách (giáp biên ✅ qua `sharesBorder`).
- Hành động: Cải thiện quan hệ, Đề nghị liên minh (hiển thị điểm chấp nhận `allianceAcceptance` + lý do), Hủy liên minh, Tuyên bố đối thủ, Bảo đảm độc lập, Gia nhập liên minh thuế quan ✅. Khủng hoảng ngoại giao (diplomatic play) ❌; đàm phán hiệp ước nhiều điều khoản ❌.

## S19 Hồ sơ quốc gia khác
- Như S07 nhưng chỉ đọc + khối "Quan hệ với ta" + hành động ngoại giao/chiến tranh.

## S20 Hiệp ước & chư hầu
- Dữ liệu: `treaties` (liên minh, bảo đảm, liên minh thuế quan) và quan hệ lệ thuộc (`overlord`, `subjectType`) ✅; nguồn CoW của liên minh khởi đầu ✅.

## S21 Lực lượng
- Dữ liệu: quân số hiện tại/mục tiêu, chất lượng, tiếp tế (giá vũ khí), tinh thần; hải quân (sức mạnh, chất lượng) ✅. Đơn vị/tướng lĩnh/HQ ❌.
- Hành động: mục tiêu quân số/hải quân ✅.

## S22 Chiến tranh & trận đánh
- Dữ liệu: các cuộc chiến (`wars`): phe, mục tiêu chiến tranh, điểm chiến tranh `score`, vùng bị chiếm, số trận, mệt mỏi chiến tranh ✅; nhật ký từng trận ❌ (chỉ có bộ đếm).
- Hành động: Tuyên chiến (`declare_war` với mục tiêu: chiếm vùng / chư hầu hóa / mở cửa thị trường / độc lập) ✅ qua DecisionSheet: so sánh lực lượng (gồm đồng minh dự kiến), rủi ro can thiệp của cường quốc, tiếng xấu; Đề nghị hòa trắng (`offer_white_peace`) ✅.

## S23 Nhật ký & quyết định
- Dữ liệu: cửa sổ quyết định đang chờ của người chơi (`pendingPlayerDecisions`) ✅ — chỉ Historical Mode; mốc lịch sử (milestones) và trạng thái ✅.
- Thẻ quyết định: tiêu đề, quốc gia, thời hạn, điều kiện, các lựa chọn (phương án lịch sử được đánh dấu "Lịch sử" nhưng không được khóa các phương án khác).
- Hành động: `decide` ✅.

## S24 Nhật ký sự kiện & biến động lãnh thổ
- Dữ liệu: `log` (tối đa 4.000 mục: loại, ngày, văn bản vi/en, tác nhân) ✅; `territoryLog` (vùng, từ, đến, nguyên nhân, khớp lịch sử?) ✅.
- Bộ lọc: loại sự kiện, quốc gia, khoảng năm, "chỉ khác lịch sử".

## S25 So sánh với lịch sử thực
- Dữ liệu: điểm tương đồng lãnh thổ/mốc/tổng hợp theo năm (`divergence.similarity`) ✅, trạng thái từng mốc ✅, nhật ký khác biệt (`divergence.entries`) ✅.
- Có ở cả hai chế độ (Sandbox: nhãn "chỉ tham khảo, không ảnh hưởng mô phỏng").

## S26 World Dashboard (bắt buộc cho Observer; có ở mọi chế độ)
- Dữ liệu: xếp hạng sức mạnh/GDP/dân số (`rankings`) ✅, chiến tranh đang diễn ra ✅, thay đổi chế độ (log loại `revolution`, `law`) ✅, biến động biên giới ✅, khuếch tán công nghệ (% quốc gia biết từng công nghệ) ✅, di cư 🟡, biểu đồ năm ✅.
- Hành động: "Theo dõi quốc gia" (đổi quốc gia đang xem), tốc độ tối đa.

## S27 Hộp thư & mục ghim
- Dữ liệu: thông báo phát sinh từ log theo mức quan trọng (cài đặt theo loại, như DD#74 cho thấy cần thiết) ✅ (nguồn log có sẵn; bộ lọc mức quan trọng là phần UI).
- Hành động: ghim KPI/đối tượng; đánh dấu đã đọc; cài đặt auto-pause theo loại.

## S28 Lưu / Tải
- Dữ liệu: `serialize`/`deserialize` ✅ (JSON, tất định). Lưu tự động mỗi năm trong game (cấu hình). Xuất/nhập file save.
- Trạng thái lỗi: file không phải save của game → thông báo rõ (đã kiểm thử).

## S29 Cài đặt
- Ngôn ngữ (vi/en), cỡ chữ, chủ đề sáng/tối, chế độ mù màu, giảm chuyển động, tự động tạm dừng theo loại thông báo, tốc độ mặc định, lưu tự động.

## S30 Thuật ngữ & trợ giúp
- Mục thuật ngữ (GDP, chính danh, clout, cải cách, mức sống, chất lượng dữ liệu, Historical vs Sandbox…), tìm kiếm; mở từ mọi ExplainSheet ("Thuật ngữ này là gì?").

## S31 Provenance Sheet (nguồn & độ tin cậy)
- Dữ liệu: `Fact.quality/sources/method/range/alternatives/note`, citation đầy đủ từ `db.sources` ✅.

## S32 DecisionSheet (khung xác nhận dùng chung)
- Bố cục cố định: **Chi phí → Điều kiện → Lợi ích dự kiến → Rủi ro → Không thể hoàn tác?** → nút xác nhận (giữ 600ms cho hành động không đảo ngược như tuyên chiến).
- Mọi con số dự báo ghi rõ "ước tính".
