# REFERENCE SOURCE LOG — Nguồn tham khảo UI/UX đã kiểm tra

Ngày truy cập cho mọi mục: **2026-11-15** (môi trường cloud, truy cập qua HTTPS proxy).
Mục đích sử dụng: **chỉ để phân tích thiết kế nội bộ**. Không có ảnh, icon, font, texture, chữ sự kiện hay thành phần giao diện nào của Victoria 3 được đưa vào repository hoặc sản phẩm. Ảnh đã tải chỉ nằm trong thư mục tạm (scratchpad) của phiên làm việc, không commit.

Trạng thái: **OK-xem** = đã tải và tự xem ảnh/đọc nội dung; **LỖI** = không truy cập được; **LỆCH** = truy cập được nhưng nội dung khác mô tả trong gói.

## A. Ảnh trong `02_Victoria3_UI_Reference.md` (gói UI)

| # | Chủ đề theo gói | URL | HTTP | Trạng thái | Quan sát chính (tóm tắt) |
|---|---|---|---|---|---|
| 1 | Bản đồ & HUD | https://www.ggrecon.com/media/zg4oo2rp/victoria-3-best-countries.jpg?quality=60&v=1daeed321be9820&width=1000 | 200 | OK-xem (1000×562) | Thanh tài nguyên 2 hàng góc trái trên; ngày + tốc độ góc phải; thanh công cụ dọc trái; cột "outliner" phải (mục tiêu, quan hệ, luật đang thông qua, chỉ huy); luồng thông báo phải-dưới; nút map mode giữa-dưới; nhãn quốc gia lớn trên bản đồ. |
| 2 | Thị trường thế giới | https://shared.akamai.steamstatic.com/…/ss_e6423f50…1920x1080.jpg | 200 | OK-xem (1920×1080) | Panel trái ~1/3 màn hình, map vẫn hiện; tab Goods/Participants; dòng lọc; bảng: giá, % lệch giá gốc kèm thanh, cán cân, nước xuất/nhập lớn nhất (cờ); nền dòng đổi màu theo trạng thái giá. |
| 3 | Danh sách công trình | https://images.ctfassets.net/u73tyf0fa8v1/3KcLq…/screenshot_11.jpg | 200 | OK-xem | Panel toàn màn hình; cột lọc trái (nhóm, vị trí, chủ sở hữu, chip loại công trình); bảng nhóm theo loại → mở rộng theo bang; cột PM, việc làm x/y, tiền mặt, năng suất, nút tương tác. |
| 4 | Hàng đợi xây dựng | https://forumcontent.paradoxplaza.com/public/892705/1667801921935.png | 200 | OK-xem | Tab Urban/Rural/Development/Construction; phân trang "Page 3/4"; mỗi dòng: tên, trạng thái, tuần còn lại, lên/xuống/hủy; "Pause all"; thanh lens dưới đáy với nút xây theo loại + số lượng. |
| 5 | Luật pháp | https://www.ggrecon.com/media/ouuklcd3/victoria-3-how-to-pass-laws.jpg | 200 | OK-xem | Tab Overview/Government/Laws/Institutions; 3 cột nhóm luật; thẻ luật: icon, nhóm (chữ nhỏ), luật hiện hành (chữ lớn), số phương án thay thế. |
| 6 | Chính phủ & nhóm lợi ích | https://www.4gamer.net/games/571/G057188/SS/004.jpg | 200 | OK-xem (ghi chú: bản "early footage") | Cột trái: biểu đồ clout theo thời gian, thẻ nguyên thủ + người kế vị, bầu cử; giữa: chính phủ (legitimacy), thẻ IG (clout %, mức hài lòng, luật mong muốn); phải: đối lập. |
| 7 | Cây công nghệ | https://images.gamewatcherstatic.com/image/file/8/44/121628/20221019113927_1.jpg | 403 | **LỖI** | Không xem được ảnh. Trang nguồn https://www.gamewatcher.com/reviews/victoria-3-review/13351 cũng trả 403. Thay thế bằng mô tả văn bản của DD#70 (mục C) về UI cây công nghệ. |
| 8 | Đàm phán hiệp ước | https://assets.games.gg/victoria_3_gameplay_897d7fe204.jpg | 200 | OK-xem | 3 cột: điều khoản của ta / bản thảo hiệp ước / điều khoản của đối phương; mỗi điều khoản có chi phí và mức chấp nhận AI; thời hạn ràng buộc; "Send proposal" kèm điểm chấp nhận. |
| 9 | Trận đánh | https://www.wargamer.com/wp-content/sites/wargamer/2022/10/Victoria-3-review-battle.jpg | 200 | OK-xem | Panel trận: mặt trận, ngày, địa hình, 2 chỉ huy, tiến độ; mỗi bên: quân hiện tại/ban đầu, chết, bị thương; map có ký hiệu mặt trận và số quân. |
| 10 | Nhật ký & sự kiện | https://shared.fastly.steamstatic.com/…/ss_ee3c20b6…1920x1080.jpg | 200 | OK-xem | Journal trái (nhóm Domestic/Foreign, Decisions); hộp sự kiện giữa: tiêu đề, địa điểm, minh họa, văn bản, nút lựa chọn; outliner phải với mục ghim và đồng hồ hết hạn. |

## B. Ảnh trong `08_VISUAL_REFERENCE_INDEX.md` (gói A)

| # | Chủ đề theo gói | URL | HTTP | Trạng thái | Quan sát |
|---|---|---|---|---|---|
| A1 | World Market | (trùng ảnh A.2) | 200 | OK-xem | — |
| A2 | Trade route/map selection | https://cdn.spaziogames.it/storage/wp/new-images/2022/10/victoria-3-51731.jpg | 200 | OK-xem | Danh sách thị trường đích (cấp, lượng, năng suất) đè lên map tô màu theo thị trường; thanh lens dưới chọn hàng xuất khẩu. |
| A3 | Country overview | https://media.godisageek.com/uploads/Victoria-3-003-1024x576.jpg | 200 | OK-xem | Tooltip quốc gia (hạng, GDP, văn hóa, tôn giáo, thủ đô, chính phủ, chư hầu, quân đội, hải quân) + panel bang với lưới công trình. |
| A4 | Military HQ / world map | https://forumcontent.paradoxplaza.com/public/895473/VIC%203.jpg | 200 | OK-xem | Bản đồ 3D cận cảnh với dấu HQ; luồng thông báo dài (chuỗi "declares neutrality") — minh họa nguy cơ quá tải thông báo. |
| A5 | Diplomatic Play | https://games.gg/cdn-cgi/image/…victoria_3_market_system_guide…webp | 200 | OK-xem | Panel Diplomatic Play: bên khởi xướng/mục tiêu, quân huy động, mức leo thang, các nước "đang cân nhắc", nút Back Down. |
| A6 | Journal | https://img.game8.co/3912859/c9c5c4c5a48e7b5e35b4c5343e56172b.png/show | 200 | OK-xem | Journal nhóm theo chủ đề, thanh tiến độ, hạn "time out". |
| A7 | Revolution / state view | https://forumcontent.paradoxplaza.com/public/969929/20230512200030_1.jpg | 200 | OK-xem | Tooltip ngân sách phân rã chi tiết + biểu đồ cán cân/dự trữ; thanh tiến độ cách mạng trong outliner. |

## C. Bài viết thiết kế

| Nguồn | URL | Trạng thái | Ghi chú |
|---|---|---|---|
| "Dev Diary #30: User Interface Overview" (link trong gói UI) | https://steamcommunity.com/games/529340/announcements/detail/3118180956264055547 | **LỆCH** | Link trả về **Dev Diary #33 – Decentralized Nations** (đã đọc toàn văn), không phải DD#30. Nội dung DD#33 vẫn hữu ích cho thiết kế các chính thể phi tập trung (đã áp dụng trong dữ liệu: 104 chính thể placeholder). |
| DD#30 trên diễn đàn Paradox | https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-30-user-interface-overview.1507166/ | **LỖI** | Trang yêu cầu JavaScript; công cụ không tải được nội dung bài. Chỉ có tóm tắt từ kết quả tìm kiếm (nguồn thứ cấp): cảm hứng "Victorian luxury", Art Nouveau tập trung ở khung/tiêu đề, nút dễ nhận diện, icon mã màu. **Không coi là đã đọc bài.** |
| DD#29 "User Experience" | https://forum.paradoxplaza.com/forum/developer-diary/victoria-3-dev-diary-29-user-experience.1506484/ | **LỖI** | Không tải được. Kết quả tìm kiếm nêu 3 trụ cột UX: đúng thông tin đúng lúc; phản hồi nhân–quả rõ; tách Hành động khỏi Thông tin; nested tooltips; colorblind mode. Ghi nhận là thông tin thứ cấp. |
| DD#70 Feature Game Jam pt.2 | https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-70-feature-game-jam-pt2 | OK (qua công cụ WebFetch; curl trực tiếp bị 406) | Quick-select chính phủ sắp theo legitimacy; cây công nghệ: chữ lớn hơn, tab mã màu, trạng thái màu (đã nghiên cứu/có thể/đang/không thể), hàng đợi nghiên cứu tối đa 5 icon; highlight công trình trên map. |
| DD#74 UX Improvements (bổ sung, tự tìm) | https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-74-ux-improvements | OK (WebFetch) | Cài đặt thông báo + auto-pause theo loại (giảm ~50% thông báo); outliner ghim hàng hóa; danh sách trade route sắp xếp/lọc; map interaction link sang panel; tooltip giải thích market access. |
| Official overview | https://www.paradoxinteractive.com/games/victoria-3/about | OK (WebFetch) | Trụ cột: Pops, xã hội, công nghiệp, thương mại, ngoại giao, bản đồ động. |

Ghi chú về quy trình: một lần thử gửi header giả trình duyệt để vượt lỗi 406 đã bị hệ thống chặn; tôi không cố vượt rào và chuyển sang công cụ WebFetch chính thức.

## D. Nguồn mở dự kiến cho tài sản của chúng ta (chưa đưa vào sản phẩm — cần duyệt giấy phép)

| Tài sản | Ứng viên | Giấy phép (theo hiểu biết, **phải kiểm tra lại**) |
|---|---|---|
| Font | Noto Sans, Noto Serif, Noto Sans Mono (Google) | SIL Open Font License 1.1 |
| Icon nền | Lucide | ISC |
| Đất liền bản đồ | Natural Earth (qua gói npm `world-atlas`) | Public domain |
| Bản thân icon game, minh họa sự kiện, chân dung | Tự sáng tác | — |
