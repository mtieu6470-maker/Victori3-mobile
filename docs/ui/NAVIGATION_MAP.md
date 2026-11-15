# NAVIGATION MAP — Sơ đồ điều hướng

## 1. Nguyên tắc
1. **Bản đồ là trang chủ.** Mọi màn hình quản trị là lớp phủ trên bản đồ (ngang) hoặc màn hình con có breadcrumb (dọc); nút Back luôn quay về bản đồ sau tối đa 3 bước.
2. **Ba tầng**: Thế giới → Quốc gia → Vùng/Đối tượng (công trình, hàng hóa, nhóm lợi ích, quốc gia khác, cuộc chiến). Mỗi đối tượng có đúng **một** trang chi tiết dùng chung, mở được từ mọi nơi.
3. **Tách Hành động khỏi Thông tin**: hành động nằm ở chân panel hoặc trong DecisionSheet; phần thân panel chỉ là thông tin.
4. **Liên kết chéo**: mọi tên đối tượng trong bảng/nhật ký là link (chạm → trang chi tiết; nhấn giữ → hiện trên bản đồ).
5. Observer Mode dùng cùng sơ đồ, nhưng mọi hành động chuyển sang trạng thái chỉ-đọc và có thêm "World Dashboard".

## 2. Sơ đồ tổng (Mermaid)

```mermaid
flowchart TD
  Start[Màn hình khởi động] --> Menu[Menu chính]
  Menu --> NewGame[Chiến dịch mới]
  Menu --> Load[Tải game]
  Menu --> Settings[Cài đặt]
  Menu --> Glossary[Thuật ngữ & Trợ giúp]
  NewGame --> ModeSel[Chọn chế độ: Historical / Sandbox]
  ModeSel --> RoleSel[Vai trò: Chọn quốc gia / Observer]
  RoleSel --> CountryPick[Chọn quốc gia\n(bản đồ + danh sách tìm kiếm)]
  RoleSel --> ObsSetup[Observer: chọn quốc gia theo dõi ban đầu]
  CountryPick --> MapHome
  ObsSetup --> MapHome
  Load --> MapHome

  MapHome((BẢN ĐỒ\nTrang chủ)) --> Lens[Lens picker + chú giải]
  MapHome --> RegionCard[Thẻ vùng] --> RegionDetail[Chi tiết vùng]
  MapHome --> Inbox[Hộp thư & mục ghim]
  MapHome --> Country[Tổng quan quốc gia]
  MapHome --> Economy[Kinh tế]
  MapHome --> Society[Dân số & xã hội]
  MapHome --> Politics[Chính trị & luật]
  MapHome --> Tech[Công nghệ]
  MapHome --> Diplomacy[Ngoại giao]
  MapHome --> Military[Quân sự & chiến tranh]
  MapHome --> Chronicle[Biên niên: Nhật ký, Sự kiện, Lịch sử]
  MapHome --> World[World Dashboard\n(xếp hạng, chiến tranh, so sánh lịch sử)]
  MapHome --> SysMenu[Menu hệ thống: Lưu, Tải, Cài đặt, Thoát]

  Economy --> Budget[Ngân sách]
  Economy --> Market[Thị trường & hàng hóa] --> GoodDetail[Chi tiết hàng hóa]
  Economy --> Buildings[Sổ đăng ký công trình] --> BuildingDetail[Chi tiết công trình]
  Economy --> Construction[Xây dựng & hàng đợi]
  Society --> PopTable[Bảng dân cư theo vùng/tầng lớp]
  Society --> Migration[Di cư]
  Politics --> Government[Chính phủ & nhóm lợi ích] --> IGDetail[Chi tiết nhóm lợi ích]
  Politics --> Laws[Luật] --> LawDetail[Chi tiết luật + Cải cách]
  Diplomacy --> Relations[Quan hệ] --> OtherCountry[Hồ sơ quốc gia khác]
  Diplomacy --> Treaties[Hiệp ước & liên minh]
  Diplomacy --> Subjects[Chư hầu / bảo hộ]
  Military --> Forces[Lục quân & hải quân]
  Military --> Wars[Chiến tranh] --> WarDetail[Chi tiết chiến tranh & trận đánh]
  Chronicle --> Decisions[Quyết định đang chờ]
  Chronicle --> EventLog[Nhật ký sự kiện]
  Chronicle --> TerritoryLog[Biến động lãnh thổ]
  Chronicle --> HistCompare[So sánh với lịch sử thực]
  OtherCountry -.-> RegionDetail
  GoodDetail -.-> Buildings
  IGDetail -.-> Laws
  WarDetail -.-> RegionDetail
  RegionDetail -.-> Provenance[Nguồn & độ tin cậy]
  Country -.-> Provenance
```

## 3. Điều hướng theo hướng màn hình (đã triển khai trong `src/ui/App.tsx`)

| Thành phần | Ngang (landscape) | Dọc (portrait) |
|---|---|---|
| Điều hướng chính | Rail trái 60px, 8 nút tròn: Quốc gia, Kinh tế, Xã hội, Chính trị, Công nghệ, Ngoại giao, Quân sự, Biên niên. Thế giới và Hệ thống ở cụm nút trên phải | Thanh đáy: Bản đồ · Kinh tế · Xã hội · Ngoại giao · Quân sự · Thêm (Quốc gia, Chính trị, Công nghệ, Biên niên, Thế giới, Hệ thống) |
| Panel quản trị | Panel trái min(50%, 560px), bản đồ hiện bên phải; nút mở rộng toàn ngang | Panel toàn màn hình |
| Vùng được chọn | Thẻ vùng góc phải dưới → "Chi tiết vùng" mở hộp thoại | Thẻ vùng dải đáy |
| Thông báo | Nút chuông trên thanh trên (số chưa đọc) → hộp thoại | như bên trái |
| Thời gian | Năm/tháng + vạch tốc độ (chạm đổi 1–5) + nút dừng/chạy tròn | như bên trái |
| Lớp bản đồ | Khay nút tròn giữa đáy bản đồ + chú giải góc trên trái | như bên trái |

## 4. Back / ngăn xếp
- Back (nút hoặc cử chỉ) đóng lớp trên cùng theo thứ tự: Dialog → ExplainSheet → chi tiết đối tượng → panel → lens về "Chính trị" → hỏi "Thoát về menu?" (không thoát ứng dụng ngay).
- Breadcrumb hiển thị tối đa 3 cấp: `Kinh tế › Thị trường › Bông`.
- Trạng thái panel (tab, bộ lọc, sắp xếp, vị trí cuộn) được giữ khi quay lại.

## 5. Đường tắt
- Chạm KPI trên TopStatusStrip → panel tương ứng (ngân khố → Ngân sách, nghiên cứu → Công nghệ, xây dựng → hàng đợi).
- Chạm thông báo → đối tượng liên quan (cuộc chiến, luật, vùng).
- Nhấn giữ tên đối tượng ở bất kỳ đâu → đưa camera tới đối tượng trên bản đồ và nháy viền 2 lần.
