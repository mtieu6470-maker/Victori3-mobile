# Audit mã nguồn theo MASTER_SPEC_VI (bộ bàn giao "Currents of History")

- Repository `mtieu6470-maker/Victori3-mobile`, nhánh `claude/game-historical-sandbox-modes-kg7rj7`, HEAD tại thời điểm audit: `26b6369` (đồng bộ với `origin`).
- Trạng thái theo định nghĩa mục 15.1 của đặc tả: **Implemented** (logic thật, chạy, có test) · **Partial** · **Placeholder** (giao diện/dữ liệu mẫu/fallback) · **Missing** · **Broken**.
- Ảnh concept trong `illustrations/` **không** được dùng làm bằng chứng và không có số liệu nào từ ảnh đi vào dữ liệu game.
- Bằng chứng là vị trí mã nguồn thật; "test" là tệp kiểm thử đang chạy trong CI (`npx vitest run`, 58 test).

## 2. Dữ liệu lịch sử và độ tin cậy

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú / việc cần làm |
|---|---|---|---|
| 2.1 Provenance (giá trị, nguồn, độ tin cậy 5 mức, phương pháp) | **Implemented** cho dữ kiện quốc gia | `src/engine/data/dbTypes.ts:4-20` (`Fact<T>`, `Quality`), `tools/build-data.ts`; test `tests/data.test.ts` (nguồn tồn tại, 5 nhãn chất lượng) | Chưa có provenance cho tỉnh ngoài `pop_quality` (`dbTypes.ts` `RegionRecord`) |
| 2.2 Lịch sử không khóa kết quả | **Implemented** | `src/engine/modes.ts`, `src/engine/historical.ts`, `src/engine/systems/events.ts:13-60` (cửa sổ quyết định có điều kiện); test `tests/modes.test.ts` (rẽ nhánh khi người chơi can thiệp) | — |
| 2.3 Dữ liệu thiếu: ghi nhận, fallback có giới hạn | **Partial** | `tools/build-data.ts` (`coverage.gaps`, `fallback` flag); `docs/audit/GLOBAL_COVERAGE.md` | Tầng lớp ban đầu là fallback chung không có phạm vi/độ tin cậy (`src/engine/init.ts:17` `strataFor`) |

## 3. Địa lý, tỉnh thành, bản đồ

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 3.1 Phân cấp World → Entity → Administrative Unit → Settlement; Strategic Region | **Partial** | Chỉ có 2 cấp: thực thể (`EntityRecord`) và **vùng** 662 (`src/engine/types.ts:65-73` `Region`, `historical_data/borders/regions_1836.csv`) | Vùng đang đóng cả vai đơn vị hành chính lẫn strategic region; không có cấp dưới, không có settlement |
| 3.2 Hồ sơ tỉnh (tên lịch sử/địa phương, cấp trên, thời gian, thủ phủ, khí hậu, sông, đất canh tác, chính quyền địa phương, quân sự, nguồn) | **Partial** | `RegionRecord` (`dbTypes.ts`): id, name, lat/lon, owner, controller, culture×2, religion×2, terrain, pop+quality, res; UI `src/ui/screens/StateCard.tsx` | Thiếu: tên lịch sử/bản địa, cấp trên, valid_from/to, thủ phủ, khí hậu, sông, đất canh tác, hành chính địa phương, nguồn ngoài dân số |
| 3.3 Thành phố/settlement là đối tượng dữ liệu | **Missing** | Không có kiểu dữ liệu settlement; thủ đô chỉ là id vùng (`Country.capital`) | — |
| 3.4 Ranh giới theo thời gian (`valid_from/to`, `boundary_version`) | **Partial** | Chuyển chủ sở hữu vùng có nhật ký (`src/engine/world.ts:9` `transferRegion`, `territoryLog`); thay đổi lịch sử 1836–1914 (`historical_data/borders/historical_ownership_changes.json`) | Đa giác là ranh giới cấp 1 hiện đại của Natural Earth, ghi rõ là xấp xỉ; không có phiên bản ranh giới, chia tách/sáp nhập tỉnh, đổi tên tỉnh/thành phố |
| 3.5 Các mức bản đồ (world/country/province/campaign) | **Partial** | Một bản đồ liên tục có LOD theo zoom (`src/ui/map/MapView.tsx`, `renderer.ts` `regionSmooth`, nhãn vùng khi zoom gần) | Không có cấp province (settlement, công trình), không có campaign map (đơn vị, tuyến tiếp tế) |
| 3.6 Lớp bản đồ có chú giải, đơn vị, ngày dữ liệu | **Partial** | 10 lớp có chú giải và đơn vị (`src/ui/map/lenses.ts:55-128`) | Thiếu lớp văn hóa, tôn giáo, đất canh tác, đô thị hóa, đường sắt, cảng, thị trường riêng, hậu cần, kiểm soát lãnh thổ; chưa hiển thị "ngày dữ liệu" |

## 4. Hệ thống công trình

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 4.2 Phân loại A–J | **Partial (10 loại)** | `src/engine/types.ts:8-9` `BUILDINGS` = plantation, mine, logging, textile_mill, ironworks, tool_works, arms_works, luxury_workshop, railway, university | Không có nông trại lương thực riêng (lương thực tính từ địa hình), chăn nuôi, đánh bắt, giấy, hóa chất, đóng tàu, chợ/ngân hàng, cảng, đường bộ, kênh, hành chính, doanh trại, pháo đài, công trình văn hóa |
| 4.3 Cấp công trình và trạng thái (đã xây/tối đa/hoạt động/thiếu lao động/thiếu đầu vào/hư hại/đang xây) | **Partial** | Cấp là số nguyên (`Region.buildings: Record<Building, number>`, `types.ts:69`); thiếu lao động được tính (`economy.ts:91` `factoryWorkersLeft`) | Không lưu trạng thái từng cấp; không có cấp tối đa theo điều kiện (trừ railway ≤ 5), hư hại, đang xây |
| 4.4 Điều kiện xây dựng | **Partial** | `economy.ts:254-264` `canBuild`: chủ quyền, tài nguyên vùng, công nghệ | Không xét đất canh tác, khí hậu, lao động, hạ tầng, vốn ngoài quỹ |
| 4.5 Production methods | **Missing** | Một công thức cố định mỗi loại (`economy.ts:16-22` `RECIPES`) | — |
| 4.6 Việc làm, tiền lương theo nghề | **Partial** | Lao động `LEVEL_WORKERS = 2000` mỗi cấp (`economy.ts:11`), lấy từ tầng lớp vùng (`economy.ts:279-283`) | Không có tiền lương theo công trình, tay nghề, thất nghiệp theo nghề |
| 4.7 Sở hữu công trình | **Placeholder** | `statePool` / `privatePool` (`economy.ts:269-276`, `293`) — đặc tả 4.7 ghi rõ đây **không** là hệ thống sở hữu | Không có sổ sở hữu, cổ tức, quốc hữu hóa |
| 4.8 Construction queue | **Missing** | `build()` tăng cấp **tức thời** (`economy.ts:274` `r.buildings[b] += 1`) | Không có hàng đợi, tiến độ, vật liệu, năng lực xây dựng |
| 4.9 Hạ tầng và market access | **Partial** | Thị trường theo liên minh thuế quan và độ mở (`economy.ts:31-43` `marketOf`, `openness`); railway tăng giá trị vùng (`economy.ts:285`) | Không có năng lực hạ tầng/tiêu thụ hạ tầng, chi phí vận tải theo khoảng cách, phong tỏa cảng |
| 4.10 Liên kết sản xuất | **Partial** | Chuỗi sắt+than → thép → công cụ/vũ khí qua thị trường (`RECIPES`) | Không có hàng hóa từ tỉnh khác theo vận tải; không có máy móc, đóng tàu |
| 4.11 Đô thị hóa do công trình | **Partial** | Dịch chuyển tầng lớp theo việc làm (`src/engine/systems/population.ts:72` `shiftStrata`) | Không có thành phố để tăng trưởng |
| 4.12 Công trình độc nhất/di tích | **Missing** | — | — |
| Test bắt buộc 15.6 (13 ca) | **Missing** (0/13) | `tests/` không có test công trình theo các ca này | — |

## 5. Dân cư và xã hội

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 5.1 Pop cohorts | **Partial** | 9 tầng lớp × vùng (`types.ts:12` `STRATA`, `Region.strata`); văn hóa/tôn giáo chính+phụ | Không tách theo nghề, việc làm, mức sống từng nhóm |
| 5.2 Thuộc tính (thu nhập, tài sản, nhu cầu, thất nghiệp, y tế…) | **Partial** | Biết chữ, mức sống, cực đoan, bất ổn, dân tộc chủ nghĩa theo vùng (`types.ts:68`) | Không có thu nhập/tài sản/thất nghiệp theo nhóm |
| 5.3 Hành vi (di cư, biểu tình, cách mạng) | **Partial** | Di cư trong/ngoài nước (`population.ts:24-60`), cách mạng/ly khai (`politics.ts:122`, `202`) | Không có đình công/biểu tình |
| 5.4 Khác biệt khu vực | **Placeholder** | Tầng lớp ban đầu chung (`init.ts:17` `strataFor`) | Vi phạm trực tiếp mục 5.4 |

## 6. Kinh tế, thị trường, tài chính

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 6.1 Kinh tế vật chất | **Partial** | 12 hàng hóa (`types.ts:5`), cung–cầu–giá thị trường + thị trường thế giới (`economy.ts:44` `computeEconomy`) | Không có tồn kho, vận tải, thị trường địa phương |
| 6.2 Chỉ số tách biệt | **Partial** | GDP, GDP/người, công nghiệp hóa, ngân khố (`Country.stats`, `finance`) | Không có năng lực huy động, cung cấp quân nhu tách riêng |
| 6.3 Tài chính nhà nước | **Partial** | Thuế, thuế quan, nợ, lãi, ngân sách 6 mục (`economy.ts:224` `financeMonth`); UI phân rã ngân khố | Không có tiền tệ/ngân hàng, vỡ nợ |
| 6.4 Thương mại | **Partial** | Liên minh thuế quan, thuế quan, nhập khẩu theo độ mở | Không có tuyến thương mại, phương tiện, phong tỏa |

## 7. Chính trị, ngoại giao

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 7.1 Chính trị | **Partial** | 9 nhóm luật, 8 nhóm lợi ích, cải cách, cách mạng (`src/engine/systems/politics.ts`) | Nhóm lợi ích đồng nhất toàn cầu (`types.ts:16` `IGS`); không có nội các, đảng, bầu cử |
| 7.2 Quản trị địa phương | **Missing** | — | — |
| 7.3 Ngoại giao | **Partial** | Quan hệ, liên minh, bảo đảm, chư hầu, kình địch, chiến tranh (`src/engine/systems/diplomacy.ts`) | Không có tối hậu thư, khủng hoảng, trừng phạt, đàm phán nhiều bước |
| 7.4 Vector năng lực quốc gia | **Placeholder** | `diplomacy.ts:13` `powerScore` đơn chỉ số dùng cho xếp hạng và AI | Đặc tả cấm rõ |

## 8. Quân đội

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 8.1 Đơn vị, tổ chức, trang bị, chỉ huy, vị trí, tiếp tế | **Placeholder** | `types.ts:25-26` `Army { manpower, target, quality, morale, supply }`, `Navy { strength, target, quality }`; `military.ts:19-21` `armyStrength = manpower × quality × supply × morale` | Đúng điều mục 8.1 nói "không chấp nhận" |
| 8.2 Quân chủng | **Missing** (lục quân/hải quân là hai con số) | — | — |
| 8.3–8.4 Cấp tổ chức, đơn vị | **Missing** | — | — |
| 8.5 Chỉ huy | **Missing** | Nhân vật chỉ có nguyên thủ, đứng đầu chính phủ, người kế vị (`public/content/registry.json` characters) | — |
| 8.6 Tuyển quân/huy động | **Partial** | Giới hạn theo dân số × luật quân đội, nhân đôi khi chiến tranh (`military.ts:9-10`, `24-40`) | Không có sĩ quan, huấn luyện, giải ngũ |
| 8.7 Trang bị, công nghiệp quốc phòng | **Partial** | Giá vũ khí ảnh hưởng tiếp tế (`military.ts:30`), `arms_works` sản xuất vũ khí | Không có kho, loại vũ khí theo năm |
| 8.9 Hạm đội | **Missing** (hải quân là một số) | — | — |
| 8.10–8.11 Chiến dịch, trận đánh, hậu cần | **Partial** | Mặt trận theo vùng giáp ranh, chiếm đóng, điểm chiến tranh, hòa ước (`military.ts:50-150`) | Không có đơn vị di chuyển, tuyến tiếp tế, công thành |
| Test bắt buộc 15.8 | **Missing** | — | — |

## 9. Nhân vật, sự kiện

| Yêu cầu | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| 9.1 Nhân vật | **Partial** | 473 nhân vật có nguồn, 275 đối chiếu Wikidata, 227 chân dung (`historical_data/identity/people_links.json`, `src/ui/screens/Country.tsx` tab Nhân vật); phân biệt nhân vật mô phỏng (`Leader.historical`); test `tests/content.test.ts` | Chỉ nguyên thủ có vai trò mô phỏng (kế vị) |
| 9.2 Sự kiện có hình ảnh, bối cảnh, hệ quả | **Partial** | Cửa sổ quyết định và sự kiện ngoại sinh (19 + 9), nhật ký | Không có hình ảnh/mô tả sự kiện |
| 9.3 Journal phân biệt lịch sử / mô phỏng / rẽ nhánh | **Implemented** | `LogEntry.historical/divergence` (`types.ts:89`), `src/engine/divergence.ts`; test `tests/modes.test.ts` | — |

## 10. AI và chế độ chơi

| Yêu cầu | Trạng thái | Bằng chứng |
|---|---|---|
| 10.1 Một engine chung | **Implemented** — `src/engine/simulation.ts`, `modes.ts`; test `tests/modes.test.ts` |
| 10.2–10.4 Historical / Sandbox / Observer | **Implemented** — test `tests/modes.test.ts` (Observer: mọi nước còn sống đều ra quyết định AI) |
| 10.5 AI phân tầng có kế hoạch dài hạn và lý do hiển thị | **Partial** — `src/engine/ai/ai.ts:31-237` (ngân sách, xây dựng, cải cách, ngoại giao, chiến tranh theo utility + tính cách); không có planner dài hạn, không hiển thị lý do |

## 11. Hình ảnh, Asset Registry

| Yêu cầu | Trạng thái | Bằng chứng |
|---|---|---|
| 11.1 Nhóm hình ảnh | **Partial** — chỉ quốc kỳ, huy hiệu, chân dung (502 tệp); không có thành phố, công trình, dân cư, quân sự, sự kiện |
| 11.2 Asset Registry (ID, loại, liên kết, thời kỳ, nguồn, license, định dạng, kích thước, fallback) | **Partial** — `tools/build-content.ts`, `historical_data/assets/*.json`, test `tests/content.test.ts`; **thiếu checksum, nhiều độ phân giải, gói tải riêng** |
| 11.3 Mô tả thực chất | **Partial** — 265 quốc gia và 274 nhân vật có đoạn mở đầu Wikipedia có trích dẫn; tỉnh, công trình, đơn vị, công nghệ, sự kiện: chưa có |

## 12. Giao diện Android

| Yêu cầu | Trạng thái | Bằng chứng |
|---|---|---|
| 12.1 Landscape | **Implemented** (cơ bản) — `src/ui/App.tsx` (HUD, rail, cửa sổ nổi thu gọn/mở rộng, legend, lens, outliner); ảnh `docs/ui/screenshots/v3/`, `docs/content/screenshots/` |
| 12.2 Portrait riêng | **Implemented** (cơ bản) — dock + bottom sheet 3 mức (`App.tsx` `useSheetDrag`) |
| 12.3 Màn hình tỉnh 9 tab | **Partial** — cửa sổ Vùng (`src/ui/screens/StateCard.tsx`) là một trang không chia tab, gồm các khối "Vùng", "Xã hội", "Tài nguyên & công trình" (cấp từng loại), "Có thể xây"; không có Địa lý, Hạ tầng, Chính trị/Quản trị, Quân sự, Lịch sử, trang từng công trình |
| 12.4 Màn hình quân sự | **Placeholder** — `src/ui/screens/Military.tsx` hiển thị các con số tổng hợp, chiến tranh; không có cây tổ chức/roster |

## 13. Kiến trúc dữ liệu và engine

| Yêu cầu | Trạng thái | Bằng chứng |
|---|---|---|
| 13.1 Tách definition / state | **Partial** — DB tĩnh (`src/generated/db.json`, `src/engine/data/db.ts`) tách khỏi `GameState` (`types.ts:103`) |
| 13.2 Dữ liệu theo thời gian | **Partial** — kế vị nguyên thủ, thay đổi lãnh thổ có ngày; quốc kỳ/tên theo năm (`src/ui/game/content.ts` `symbolFor`, `src/ui/game/names.ts`) |
| 13.3 Save versioning + migration | **Partial / dễ vỡ** — `src/engine/save.ts:14` từ chối mọi version ≠ 1, không có bộ migration |
| 13.4 Hiệu năng (tick, cache, batch, RNG xác định) | **Partial** — tick tháng, `src/engine/cache.ts`, RNG trong state; không có dirty flags/spatial index |
| 13.5 Android reliability | **Không kiểm chứng được** — chưa đo trên thiết bị thật |

## 14. Gói nội dung offline

**Partial**: gói nội dung 8,7 MB đóng trong APK, service worker cho bản web. Thiếu gói tách riêng, kích thước/checksum, tải tiếp, mục tiêu 3 GB (hiện ~0,3 %).

## 15. Kiểm thử

| Yêu cầu | Trạng thái |
|---|---|
| Unit / integration / data integrity | **Partial** — 58 test (`tests/data`, `modes`, `simulation`, `ui`, `content`) |
| Long-term simulation, multi-seed Sandbox | **Partial** — có trong `tests/modes.test.ts` (nhiều seed), `tests/simulation.test.ts` |
| Historical calibration đa khu vực | **Partial** — `historical_data/events/milestones.json` thiên về châu Âu |
| Save/load test | **Partial** — test xác định sau khi tải (`tests/simulation.test.ts`), chưa test migration |
| Android device QA (bộ nhớ, pin, nhiệt) | **Missing** — không có thiết bị; ảnh Chromium không thay thế |

## Kết luận ưu tiên

Ba khoảng trống lớn nhất so với MASTER_SPEC đều là **mô hình dữ liệu**, không phải giao diện: (1) không có cấp đơn vị hành chính dưới vùng và không có settlement; (2) công trình là bộ đếm cấp tức thời, không có production method, hàng đợi, sở hữu, hạ tầng; (3) quân đội là bốn con số mỗi nước. Vì vậy theo README, bước tiếp theo là đề xuất kiến trúc (`docs/architecture/PROVINCES_BUILDINGS_MILITARY.md`) trước khi viết mã.
