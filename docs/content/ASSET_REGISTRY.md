# Asset Registry và gói nội dung bản sắc

Mục tiêu (đặc tả phần III.7): mọi hình ảnh và văn bản mô tả trong game có ID, loại, thực thể/nhân vật liên quan, thời kỳ áp dụng, nguồn, giấy phép, định dạng, kích thước và fallback; được tải lười, lưu đệm ngoại tuyến; **không dùng tệp không rõ bản quyền**.

## Luồng dữ liệu

```
historical_data/identity/wiki_titles.json        (chọn tay: bài Wikipedia cho từng thực thể, ưu tiên bài về chính thể thời 1830)
        │  tools/etl/link_entities.py            → wikidata_links.json  (QID, tên chính thức/bản địa, kiểm tra niên đại 1836)
        │  tools/etl/link_people.py              → people_links.json    (nhân vật ↔ Wikidata, khớp năm sinh/mất)
        │  tools/etl/fetch_identity.py           → historical_data/assets/identity_assets.json + public/content/identity/*.webp
        │  tools/etl/fetch_portraits.py          → historical_data/assets/portrait_assets.json + public/content/portraits/*.webp
        │  tools/etl/fetch_texts.py              → historical_data/identity/texts.json  (đoạn mở đầu Wikipedia vi/en)
        ▼
tools/build-content.ts  (chạy trong `npm run prepare-assets`, kể cả CI)  → public/content/registry.json
        ▼
src/ui/game/content.ts  (tải lười sau khi vào game; fallback huy hiệu khiên / chữ lồng khi thiếu)
```

Các bước ETL gọi API Wikimedia (có User-Agent mô tả, giãn nhịp, tuân thủ `Retry-After`), lưu đệm vào `tools/etl/.cache/` (không commit). Kết quả đã xử lý **được commit**, nên build và CI không cần mạng.

## Trường của một tài sản (`historical_data/assets/*_assets.json`)

| Trường | Ý nghĩa |
|---|---|
| `id` | `flag.<ENTITY>.<n>`, `coat_of_arms.<ENTITY>.<n>`, `portrait.<ENTITY>:<person>` |
| `type` | `flag` · `coat_of_arms` · `portrait` |
| `name`, `description` | tên hiển thị tiếng Việt; mô tả gốc của tệp trên Commons |
| `entity`, `character` | thực thể / nhân vật liên quan |
| `period.from/to` | năm áp dụng (null = mở); game chỉ hiển thị biểu tượng trong khoảng này theo ngày của ván chơi |
| `quality` | `supported` = thời kỳ có trong Wikidata (qualifier P580/P582); `uncertain` = thời kỳ suy ra từ tuổi thọ chính thể |
| `source` | Commons file page, tên tệp, mệnh đề Wikidata (`wikidata:Q…#P41` cờ, `#P94` huy hiệu, `#P18` ảnh người) |
| `license`, `author`, `credit`, `restrictions` | giấy phép (tên ngắn + URL), tác giả, ghi công, hạn chế (vd. "insignia") |
| `original` | kích thước và MIME gốc |
| `path`, `width`, `height`, `bytes`, `format` | tệp thực sự đóng gói (WebP) |
| `fallback` | `emblem` (khiên màu quốc gia) hoặc `monogram` (chữ lồng) |

## Quy tắc chấp nhận

1. **Giấy phép**: chỉ Public domain / PD-* / CC0 / CC BY / CC BY-SA. Tệp khác bị loại và ghi vào `rejected`.
2. **Thời kỳ** (quốc kỳ, huy hiệu): mệnh đề có qualifier thời gian được giữ nếu giao với 1836–1936; mệnh đề không qualifier chỉ được nhận cho chính thể lịch sử có tuổi thọ biết rõ; biểu tượng không qualifier của quốc gia hiện đại, dân tộc, vùng, thời kỳ, triều đại **bị loại** (thường là biểu tượng hiện đại).
3. **Duyệt tay**: tệp sai (lăng mộ, ấn tín, tượng hiện đại dùng làm ảnh chính của một người; cờ phục dựng không có căn cứ) được ghi vào `historical_data/assets/review.json → reject` kèm lý do; lần chạy sau tự loại.
4. **Văn bản**: chỉ trích nguyên văn đoạn mở đầu bài Wikipedia (CC BY-SA 4.0), cắt ở ranh giới câu, kèm tên bài, URL, số bản sửa; không viết lại hay tự sinh mô tả.
5. **Nhân vật**: liên kết "strong" khi năm sinh và/hoặc năm mất khớp CSDL (±1); "weak" khi CSDL chưa có ngày và chỉ một ứng viên hợp lý; ứng viên lệch > 2 năm luôn bị loại.

## Ngoại tuyến

- `public/content/` nằm trong bản build web và được Capacitor đóng vào APK: toàn bộ gói hoạt động không cần mạng.
- Trình duyệt: service worker (`public/sw.js`) lưu đệm từng ảnh khi được hiển thị lần đầu.
- Ảnh tải lười (`loading="lazy"`), `registry.json` tải sau khi vào game; mô phỏng không phụ thuộc gói này.

## Kiểm thử

`tests/content.test.ts`: mọi tệp tồn tại, giấy phép hợp lệ, có trang nguồn Commons và mệnh đề Wikidata; biểu tượng không hiển thị ngoài thời kỳ; mọi tham chiếu thực thể/nhân vật tồn tại trong CSDL; văn bản có URL, bản sửa và giấy phép; nhân vật "strong" khớp năm sinh/mất với CSDL; liên kết chính thể vượt qua kiểm tra niên đại 1836.

## Chưa có (trung thực)

- Hình ảnh kinh tế, xã hội, quân sự, sự kiện, kiến trúc, cảnh quan (đặc tả 6.2–6.5): chưa có quy trình chọn ảnh theo thời kỳ đủ tin cậy để tự động; cần duyệt tay từng ảnh để tránh dùng ảnh hiện đại hoặc ảnh sai văn hóa.
- Gói nội dung tải riêng nhiều độ phân giải và mục tiêu > 3 GB: chưa có. Gói hiện tại là một độ phân giải, đóng trong APK.
- Thực thể "phi tập trung" đại diện bởi bài viết về dân tộc/vùng: được ghi rõ trên giao diện; không có quốc kỳ (đúng quy tắc 2).
