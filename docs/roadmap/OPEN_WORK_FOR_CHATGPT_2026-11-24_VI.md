# Việc còn lại: phân việc cho ChatGPT / Hydrogen, và việc chờ Claude (2026-11-24)

Owner: ChatGPT làm tiếp phần dưới đây. Khi Claude có hạn mức trở lại, owner sẽ nhờ Claude **soát và nhập** những gì ChatGPT đã đẩy.

Trạng thái hiện tại (commit `95a2869`, nhánh `ccr-b27f3fb8-epfpd6`):
- 166 sự kiện và 20 nhật ký trong game: Anh và thuộc địa (GBR, EIC, HYD, BUR, EGY, CAN, `generic_more`: 88), Việt Nam (VNM: 48 sự kiện, 5 nhật ký), gói chung `generic_politics` (30 sự kiện, 15 nhật ký).
- 87/94 ảnh sự kiện đã nhập vào game; ảnh gói Việt Nam chưa nhập (Claude nhập).
- Ảnh còn thiếu: `gbr_singapore_fall_1942` (chỉ PD ở Nhật).

## A. Việc cho ChatGPT (không cần code, ghi thẳng vào `historical_data/events/story/` và `story_selection.json`)

Tiêu chuẩn chất lượng: MSG-118 (mỗi sự kiện có lời dẫn riêng, lựa chọn riêng, modifier có tên và thời hạn, điều kiện kích hoạt, `title_en`/`label_en` bằng tiếng Anh, `ai_weight`). Định dạng: `docs/spec/STORY_EVENTS_SCHEMA_VI.md`. Lô Anh (GBR.json) là mẫu đạt.

**A1. Sự kiện cho 7 nước lớn (mỗi nước 40–60 sự kiện + 3–6 nhật ký):** thứ tự Pháp (FRA), Nhật (JAP), Thanh (QNG), Nga (RUS), Phổ/Đức (PRU; chú ý `PRU` là Prussia, `PRS` là Ba Tư), Mỹ (USA), Ottoman (TUR). Gợi ý mạch ở MSG-126. Mỗi nước kèm sự kiện cho phía nước bị tác động. Kèm ảnh ứng viên trong `story_selection.json` (ưu tiên trước 1931, PD-USGov, CC0, có PD ở Mỹ; tránh một bản đồ dùng chung cho nhiều sự kiện).

**A2. Lô tiếp theo (sau 8 nước lớn):** Ý/Sardinia, Áo, Tây Ban Nha, Bồ Đào Nha, Hà Lan, Bỉ, Thụy Điển, Ba Lan, Ấn Độ (phía Ấn), Ai Cập, Ba Tư, Thái Lan, Brazil, Mexico, Argentina, Nam Phi, các nước châu Phi và Mỹ Latinh sau độc lập. Mục tiêu tổng trên 2.000 sự kiện.

**A3. Gói ≥ 300 sự kiện chung cho Sandbox** (vai `$self`, `$owner`, `$colony`, `$nation`), không trùng `generic_politics.json` và `generic_more.json`: kiến nghị nhóm lợi ích, khủng hoảng kinh tế, thiên tai, dịch bệnh, bê bối, phong trào xã hội, tôn giáo, tội phạm, văn hóa, khoa học, thể thao. Mỗi lựa chọn có modifier (buff hoặc debuff) có tên và thời hạn.

**A4. Sự kiện và nhật ký "hậu độc lập" cho các nước mới** (Ấn Độ, Pakistan, Indonesia, Ghana, Algérie, Kenya, Malaysia…), để người chơi các nước đó có trải nghiệm riêng. Dùng `exists` làm điều kiện.

**A5. Ảnh (Hydrogen/ChatGPT):**
- 4 sự kiện còn thiếu ảnh hợp lệ (`gbr_singapore_fall_1942`…) và thay các **bản đồ dùng chung** bằng ảnh người hoặc cảnh riêng cho sự kiện lớn (Ấn Độ 1947, Suez 1956, Malaya 1957, Miến Điện 1948, Ghana 1957).
- Ảnh cho mọi gói mới (VNM, các nước lớn). Chỉ cần gửi tên tệp Commons ứng viên; công cụ của Claude tự kiểm tra giấy phép (PD/CC0, nếu sau 1931 thì phải có thêm PD ở Mỹ).
- **Mục tiêu dài hạn:** hàng nghìn ảnh cho công trình, hàng hóa, công nghệ, thời đại; chân dung lãnh đạo, tướng, chính khách theo thời kỳ; cờ và quốc huy theo thời kỳ. Dùng cùng định dạng `*_selection.json`.

**A6. Nhạc và âm thanh:** danh sách bản thu thập phạm vi công cộng (nhạc cổ điển thế kỷ 19, nhạc dân gian, quốc ca cũ) theo khu vực và thời kỳ, kèm nguồn, giấy phép, thời lượng, dung lượng. Ghi vào `docs/research/media/`. Chưa nhập, chờ hệ thống gói nội dung.

**A7. Tài liệu nghiên cứu thiết kế (đầu vào cho code):**
- CG-56 chiến tranh: mặt trận, tướng lĩnh (đặc điểm, cấp bậc), trận đánh, hải chiến, đổ bộ, tuyển quân, tiếp tế, con số gốc đề xuất, theo CG-51.
- CG-57 đảng phái, bầu cử, nghị viện: các đảng theo thời kỳ và nước, cách tính ủng hộ luật, phong trào chính trị và agitator.
- CG-58 hệ thống gói nội dung tải về cho Android: kích thước hợp lý, kiểu chia gói, chiến lược tải offline, kiểm tra toàn vẹn (chỉ thiết kế, không bí mật hay khóa ký).
- CG-59 tutorial và tooltips: danh sách các khái niệm cần giải thích và thứ tự dạy người chơi mới.

**A8. Kiểm chứng lịch sử:** soát các sự kiện đã có (GBR, VNM…) xem sai năm, sai nhân vật, sai quy mô; ghi các chỗ nghi ngờ vào `docs/research/review/`, đừng tự sửa dữ liệu đã nhập mà không ghi lại lý do.

## B. Việc chờ Claude (cần code, chạy test hoặc kiểm tra tự động)

1. **Nhập và soát:** chạy `npm run data` (xem cảnh báo), chạy nhập ảnh (`python3 -I tools/media/loc_ingest.py … --resume`), `npm run content`, chạy mô phỏng thử và bộ test đầy đủ, build APK.
2. **Diplomatic play** (CG-53): leo thang, yêu cầu chính và phụ, lôi kéo, lùi bước, AI. Thay cho tuyên chiến ngay.
3. **Chiến tranh sâu** (CG-51, CG-56): mặt trận, tướng, trận đánh, hải quân, tuyển quân.
4. **Hiệp ước có điều khoản và công ty độc quyền** (CG-54).
5. **Chính trị:** đảng phái, bầu cử, bảng ủng hộ luật (CG-57).
6. **Khối quyền lực:** tranh vị trí đứng đầu, tượng đài, huy hiệu; đầu tư nước ngoài và sở hữu công trình.
7. **Hệ thống gói nội dung tải về** (CG-58): APK nhỏ và các gói offline.
8. **Sửa lỗi dữ liệu và mô phỏng đã biết:** Ai Cập giữ vùng Angola năm 1970 (Lịch sử); vùng Bengal (EIC_BEN) chưa tách đúng; hiệu ứng tổ chức (Comecon, Phong trào Không liên kết, ASEAN, Liên đoàn Ả Rập: CG-47C); vài nước Trung Á và Baltic thiếu vùng.
9. **Hoàn thiện:** tutorial, âm thanh và nhạc, đồ họa bản đồ, đo hiệu năng trên điện thoại thật ở 12h/s, bản phát hành thử.

## C. Chỗ ChatGPT nên tránh
- Không sửa code (`src/`), không sửa test, không viết đè công việc của Claude; chỉ ghi `docs/**`, `historical_data/events/story/**`, `historical_data/assets/illustration_sources/story_selection.json` và bảng tin.
- Không bịa tên tệp ảnh, nguồn hay con số. Không chắc thì ghi rõ "chưa xác minh" trong ghi chú.
- Mã nước và mã vùng phải có trong `historical_data/political_entities/registry.json` và `historical_data/borders/regions_1836.csv`; bản build bỏ qua mục sai kèm cảnh báo.

## D. Quy trình khi Claude có hạn mức trở lại (owner nhắn một câu)
Owner nhắn: "Đọc `docs/roadmap/OPEN_WORK_FOR_CHATGPT_2026-11-24_VI.md`, soát những gì ChatGPT đã đẩy và nhập vào game". Claude sẽ:
1. fetch nhánh `ccr-b27f3fb8-epfpd6`, xem các commit ChatGPT mới;
2. chạy `npm run data`, soát nội dung (lời dẫn riêng, lựa chọn riêng, điều kiện, hiệu ứng hợp lệ); trả lại lô không đạt kèm lý do trên bảng tin;
3. nhập ảnh, build lại nội dung, chạy mô phỏng thử và bộ test đầy đủ;
4. ghi kết quả vào bảng tin và bàn giao, đẩy lên cả hai nhánh, rồi build APK cho owner thử;
5. sau đó làm tiếp mục B theo thứ tự trên.


---

## Cập nhật tiến độ — 2026-11-24 (ChatGPT, FRA checkpoint)

- **A1: FRA — DATA PACKAGE DELIVERED FOR CLAUDE REVIEW.** File `historical_data/events/story/FRA.json` hiện có 59 sự kiện và 6 nhật ký; 31 nguồn tham chiếu. Dải thời gian hiện có: 1848-02-24 đến 2024-07-26. Đây chưa phải phạm vi đầy đủ 1836–2026; còn thiếu giai đoạn 1836–1847 và 2025–2026.
- Mọi sự kiện dùng `trigger.fire_date` theo `date_historical`; các nhật ký có tiến độ dựa trên `event_fired` milestones (mỗi tuyến tổng 100 điểm). Claude phải xác minh ngữ nghĩa ngày và journal trong runtime, vì kiểm tra cấu trúc không chứng minh engine xử lý đúng.
- Đã thêm 7 ứng viên ảnh riêng cho sự kiện vào `story_selection.json`; chưa nhập ảnh, chưa có binary asset mới. Verdun và Paris Liberation cần xét quyền theo lãnh thổ; không nới rights gate.
- Kiểm tra cấu trúc tĩnh: JSON parse, 59 ID duy nhất, nguồn/chain/modifier/region/image refs đều resolve, 6 journal và milestone IDs hợp lệ. **Chưa chạy** `npm run data`, `npm run content`, mô phỏng, automated tests, Android build hoặc APK.
- Commit dữ liệu: `1f47785ae8b230715258d101d532e5e3294a8c12`, `4b3bad321d810bc8135afb063952705ccaf8ccf5`, `e740546861c32f6180c79f88ab20ce6edd7ba379`. Ảnh: `52677f83801dd3ddfb0eee8bef577289522c3555`, `2586da5b04e31023632d55f4c6582f5083aea3a5`.
- Báo cáo đầy đủ và checklist Claude: `docs/research/history/CG60_FRA_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md` (commit `aeef7c47c85ec10697d9d5da6b4fe098bce42f52`).
- **Tiếp theo A1:** JAP → QNG → RUS → PRU → USA → TUR. MSG-129 vẫn IN_PROGRESS; chưa đánh dấu DONE cho đến khi đủ bảy gói.


## Cập nhật tiến độ — JAP checkpoint (2026-11-24)

- **A1 / JAP — initial data batch delivered.** `historical_data/events/story/JAP.json`: 53 sự kiện, 6 journal, 18 source references; ngày hiện có 1836-09-01 → 2024-01-01.
- Read-back audit: JSON hợp lệ, 53 ID duy nhất, source refs và journal milestone refs resolve; mỗi journal có 5 mốc × 20 = 100; không có mã vùng không tồn tại trong effects. Mỗi event có 2 lựa chọn và named timed modifier; `fire_date` khớp `date_historical`.
- Commit: `f14bbbd5e946e77dd1cd89727efdda1515c92675`.
- Báo cáo: `docs/research/history/CG61_JAP_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md` (commit `08f34f4848e8df582b37856a0b8514bffe1f5b32`).
- **Chưa release-ready:** narratives hiện là mô tả khung song ngữ ngắn, cần nghiên cứu/viết lại theo từng sự kiện; source links chưa được mở xác minh từng claim; chưa có ảnh; chưa chạy data/content builder, runtime, tests, Android build/APK.
- Claude cần kiểm tra monthly `fire_date`, one-shot journal milestone semantics và tính liên tục entity/regime JAP (registry ghi Tokugawa Japan); không tự ý tạo country ID mới.
- **Tiếp theo A1:** QNG → RUS → PRU → USA → TUR. MSG-129 tiếp tục IN_PROGRESS.


## Cập nhật tiến độ — QNG / Nhà Thanh (CG-62, 2026-11-24)

- **A1 / QNG — initial historical story pack delivered for integration review.** `historical_data/events/story/QNG.json`: 51 sự kiện, 4 journal, 3 source references; dải ngày 1838-12-31 → 1912-02-12.
- Bao phủ khủng hoảng thuốc phiện và hai cuộc chiến Nha phiến, hệ thống cảng hiệp ước, Thái Bình Thiên Quốc, Tự Cường, chiến tranh Pháp–Thanh và Thanh–Nhật, Mậu Tuất, Nghĩa Hòa Đoàn, Tân Chính, Cách mạng Tân Hợi và thoái vị.
- Mỗi sự kiện có title/narrative VI+EN, 2 lựa chọn có label_en, mỗi lựa chọn có named timed modifier; modifier keys đã đối chiếu allowlist `src/engine/mods.ts`.
- Bốn journal dùng tiến độ thời gian +0.5/tháng, tránh lặp milestone `event_fired` vốn có nguy cơ cộng điểm nhiều lần.
- Đã thêm 2 ứng viên ảnh Commons riêng cho sự kiện Nghĩa Hòa Đoàn / liên quân tám nước vào `historical_data/assets/illustration_sources/story_selection.json`; chưa ingest binary, pipeline phải kiểm tra lại quyền và dung lượng.
- Commits: QNG initial `2f7d922ff0346f6ff35a33253e8703bee5f360e0`; scheduler/journal adjustment `74a305ae2dedc246e799efed4d48c28a96a27d5e`; image refs `8638289911cade7eb81a2e2319724e969cfcccdd`; image candidates `3c9b74fce3c1bfff2346a2a0a8bb52a348ae5bc0`; checkpoint `e061ad119ae4f089bd9b1accee9d65f1f2701c26`.
- Báo cáo đầy đủ: `docs/research/history/CG62_QNG_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`.
- **Chưa release-ready:** nguồn mới là timeline/bibliography cấp cao, chưa kiểm chứng từng claim; cần Claude kiểm tra monthly `fire_date` và cửa sổ kéo dài sang năm sau; event thoái vị 12-02-1912 trùng ngày registry `hist_to`; hai ảnh mới chỉ là candidate. Chưa chạy `npm run data`, `npm run content`, tests, simulation, Android build/APK.
- **Tiếp theo A1:** RUS → PRU → USA → TUR. PRU là Phổ, không phải PRS/Ba Tư. MSG-129 vẫn IN_PROGRESS.


## Cập nhật tiến độ — RUS / Đế quốc Nga (CG-63, 2026-11-24)

- **A1 / RUS — initial historical story pack delivered for integration review.** `historical_data/events/story/RUS.json`: 54 sự kiện, 5 journal, 5 source references; dải ngày 1837-02-10 → 1917-03-15.
- Bao phủ Nicholas I, chiến tranh Krym, Đại cải cách và giải phóng nông nô, zemstvo/tư pháp, Caucasus và Viễn Đông, chiến tranh Nga–Ottoman, Aleksandr II bị ám sát, đường sắt xuyên Siberia, Nicholas II, công nghiệp hóa, chiến tranh Nga–Nhật, Cách mạng 1905, Duma/Stolypin, Thế chiến I, Brusilov, Cách mạng tháng Hai và thoái vị.
- Mỗi event có narrative VI+EN, 2 lựa chọn có label_en và named timed modifier; modifier keys đã đối chiếu `src/engine/mods.ts`. Năm journal dùng tiến độ thời gian +1/tháng, không dùng `event_fired` để tránh cộng điểm lặp.
- Đã thêm 3 ứng viên ảnh riêng: Bloody Sunday (tranh tái dựng 1925), Duma khóa I (ảnh gốc rất lớn ~124 MB, cần derivative), ảnh Nicholas II sau thoái vị (rights còn provisional). Chưa ingest binary.
- Commits: RUS data `bf32b6b75266e4042d07d8a507b006d8cbb1f9de`; image refs `1cfcb140e341d96067d05172dccad8b712d88995`; candidates `b65104e64a5989a5956cb01e2cb7ad5f9dd57144`; checkpoint `68398132f75769f180f61a7ef26f2a5ac791a638`.
- Báo cáo đầy đủ: `docs/research/history/CG63_RUS_STORY_EVENT_BATCH_CHECKPOINT_2026-11-24_VI.md`.
- **Chưa release-ready:** cần xác minh lịch Julian/Gregorian, scheduler tháng với fire_date giữa tháng, event thoái vị trùng `hist_to=1917-03-15`, nguồn từng claim và rights/size ảnh. Chưa chạy builders, tests, simulation, Android build/APK.
- **Tiếp theo A1:** PRU → USA → TUR. PRU là Phổ, không phải PRS/Ba Tư. MSG-129 vẫn IN_PROGRESS.


## Cập nhật tích hợp — CG-64 (2026-11-24)

- Đã fast-forward dữ liệu từ `ccr-b27f3fb8-epfpd6` vào nhánh tích hợp, HEAD dữ liệu `d877a3ffd71e84726098b4a58ae8f5f404036351`.
- FRA/JAP/QNG/RUS/VNM: **265 sự kiện, 26 nhật ký, 530 lựa chọn**. Kiểm tra tĩnh JSON, ID, nguồn, entity, region và modifier đều đạt; 106 ứng viên ảnh chưa phải binary đã ingest.
- **Chặn nghiệm thu:** 102 milestone `event_fired` trong FRA/JAP/VNM đang bị cộng lặp theo tháng. Cần sửa one-shot milestone và regression tests. 187 event có ngày fire giữa tháng nhưng engine chạy theo tháng; cần test boundary, nhất là QNG/RUS ở ngày kết thúc entity.
- Chưa chạy builders/tests/simulation/Android build/APK/device QA. Không release-ready.
- Báo cáo: `docs/research/history/CG64_CHATGPT_IMPORT_REVIEW_2026-11-24_VI.md`.
- A1 tiếp theo: PRU → USA → TUR. MSG-129 vẫn IN_PROGRESS.
