# CG-17 — Victoria 3: dư cung, lợi nhuận công trình và subsistence

Ngày: 2026-11-22  
Phạm vi: nguồn phát triển/changelog chính thức Paradox phát hành qua Steam News. Công thức nội bộ không công bố được ghi unknown.

## Nguồn chính thức
1. Paradox, Dev Diary #9 — National Markets (05/08/2021): https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements
2. Paradox, Dev Diary #3 — Buildings (10/06/2021): https://store.steampowered.com/news/posts/?enddate=1623341987&feed=steam_community_announcements
3. Paradox, Dev Diary #78 — Update 1.2 changelog Part 2 (09/03/2023): https://store.steampowered.com/news/posts/?enddate=1678374065&feed=steam_community_announcements
4. Paradox, Dev Diary #86 — Changelog Update 1.3/VotP (18/05/2023): https://store.steampowered.com/news/posts/?enddate=1684418840&feed=steam_community_announcements
5. Paradox, Dev Diary #131 — Famines, Starvation, Harvest Conditions (10/10/2024): https://store.steampowered.com/news/posts/?enddate=1728568967&feed=steam_community_announcements
6. Paradox, Hotfix 1.15.2 (Nov 2026): https://store.steampowered.com/news/app/529340/view/680767470935474875

Giới hạn: Dev Diaries mô tả cơ chế nền tảng; changelog 1.2/1.3 cho biết logic tuyển dụng/tiền lương đã được tinh chỉnh. Hotfix 1.15.2 không công bố lại toàn bộ thuật toán giá và employment. Không khẳng định mọi ngưỡng lịch sử bất biến trong 1.15.x nếu không có tài liệu phiên bản hoặc kiểm tra trực tiếp.

## 1. Khi Sell Orders > Buy Orders
Paradox Dev Diary #9 công bố:
- Market price được xác định theo cân bằng Buy Orders/Sell Orders, với base price làm mốc.
- Buy Orders vượt Sell Orders đẩy giá lên; Sell Orders vượt Buy Orders kéo giá xuống.
- Khi sản xuất vượt cầu, hàng được bán ở mức giá depressed; người tiêu dùng hưởng lợi, người sản xuất bị giảm lợi nhuận.
- Không có stockpile hàng hóa vật lý trong mô hình thị trường được mô tả. Hàng được sản xuất và bán ngay theo mức giá người mua sẵn sàng trả tại thời điểm sản xuất.
- Tích lũy thể hiện bằng Cash Reserves, Treasury và Pop Wealth, không phải hàng nằm trong kho.

| Câu hỏi | Kết luận |
|---|---|
| Giá giảm khi sell > buy? | Có, xuống dưới base price. |
| Giá sàn chính xác? | unknown trong nguồn chính thức đã kiểm tra. |
| Công thức/độ co giãn chính xác? | unknown; diary chỉ mô tả định tính. |
| Có kho hàng vật lý? | Không theo mô hình Dev Diary #9 mô tả. |
| Hàng dư đi đâu? | Không thành stockpile; được bán ở giá depressed, còn tích lũy thể hiện bằng tiền/wealth. |

Dev Diary #131 (1.8) nói giá thực phẩm có thể chạm cap +75% trong bối cảnh Pop Needs được mô tả. Đây là trần giá trong bối cảnh đó, không phải bằng chứng về sàn giá -75% hay công thức chung trong 1.15.x. Không suy ra sàn đối xứng.

## 2. Công trình phản ứng với thua lỗ
Paradox Dev Diary #9: khi điều kiện không đổi, công trình cắt lương để bù đắp; Cash Reserves cuối cùng cạn, công trình trở nên inoperable và công nhân bỏ đi.

Update 1.2 changelog:
- Công trình tăng lương nếu lợi nhuận đáng kể và nhân viên có SoL dưới mức tối thiểu kỳ vọng; hoặc lợi nhuận hợp lý, cạnh tranh lao động và employment dưới 50%.
- Công trình hạ lương hoặc sa thải nếu deficit và Cash Reserves dưới 50%; hoặc lợi nhuận rất thấp và SoL nhân viên cao hơn mức tối thiểu kỳ vọng trên 33%.

Update 1.3 changelog:
- Công trình có Cash Reserves thấp, employment ít nhất 10% và lợi nhuận thấp sẽ tránh tuyển thêm người vì có thể sa thải họ vài tuần sau.

| Cơ chế | Kết luận |
|---|---|
| Cash Reserves | Bộ đệm tài chính; cạn reserves có thể khiến công trình ngừng hoạt động. |
| Giảm lương | Có, được mô tả trong Dev Diary #9. |
| Sa thải | Có, Update 1.2 nêu điều kiện cụ thể liên quan deficit/reserves hoặc lợi nhuận/SoL. |
| Hạn chế tuyển thêm | Có, Update 1.3 nêu low reserves + ≥10% employment + low profits. |
| Tự giảm throughput do lỗ | unknown; không thấy công thức trực tiếp được công bố. |
| Đóng/ngừng hoạt động | Có, khi reserves cạn và công nhân rời bỏ theo Dev Diary #9. |
| Downsize | Có các thay đổi/chính sách downsizing trong changelog, nhưng không có công thức phổ quát trong nguồn này. |
| Chu kỳ điều chỉnh | Không có lịch tổng quát. Update 1.3 chỉ nói có thể sa thải vài tuần sau trong ngữ cảnh tuyển dụng không bền vững. |

Không được viết “mọi công trình lỗ sẽ sa thải sau N ngày”. Điều kiện phụ thuộc nhiều biến; changelog không đưa ra một lịch áp dụng cho mọi công trình.

## 3. Subsistence có vào thị trường không?
Dev Diary #3:
- Subsistence Buildings tự xuất hiện trên arable land chưa dùng cho building khác; không thể xây/phá thủ công theo mô tả.
- Phần lớn dân số lúc đầu làm Peasants trong subsistence buildings.
- Đây là công trình kém hiệu quả; nông dân tạo ra sinh kế nhỏ và một lượng hàng dư nhỏ cho thị trường.

Kết luận: không phải toàn bộ sản lượng subsistence đều là hàng thương mại; phần lớn nuôi sống hộ nông dân, phần surplus nhỏ được đưa ra thị trường. Tỷ lệ chính xác, phân bổ theo từng loại hàng và công thức theo arable land: unknown trong nguồn đã kiểm tra.

## 4. Đề xuất cho Victori3 — thiết kế của dự án, không phải cơ chế Victoria 3
Khuyến nghị mô hình lai: sản lượng phản ứng với profitability, cộng tồn kho hữu hạn có chọn lọc.

1. Sản lượng cơ sở theo lao động, cấp building, công nghệ và điều kiện tự nhiên là planned/capacity output, không mặc định là realized/sold output.
2. Điều chỉnh utilization/hiring theo profitability trung bình 2–3 kỳ; nếu doanh thu trừ input, wages và upkeep âm liên tục thì giảm hiring/công suất trước, sau đó mới sa thải/đóng cửa theo ngưỡng.
3. Có độ trễ và hysteresis để tránh dao động giá–sản lượng và tuyển/sa thải luân phiên.
4. Kho hữu hạn cho hàng chiến lược/bảo quản được (grain, coal, iron, timber, arms), có capacity, storage cost, spoilage/decay và vốn bị khóa. Dịch vụ không cần inventory.
5. Hàng dễ hỏng hao hụt cao; công cụ/vật liệu có thể bảo quản hao hụt thấp.
6. Subsistence tách household_retained và market_surplus; chỉ surplus tạo sell orders. Không tự gán tỷ lệ lịch sử khi chưa có dữ liệu.

| Phương án | Lợi ích | Rủi ro |
|---|---|---|
| Kho hàng có hao hụt | Hấp thụ cú sốc cung cầu; hỗ trợ mùa vụ, chiến tranh, logistics và dự trữ lương thực. | Tốn CPU/RAM nếu lưu theo batch; cần cân bằng capacity/spoilage; có thể khóa vốn và tạo đầu cơ. |
| Điều chỉnh sản lượng theo lợi nhuận | Xử lý tận gốc sản xuất vượt cầu vô hạn; mô phỏng doanh nghiệp và thất nghiệp. | Trễ phản ứng có thể gây dao động; giảm quá nhanh gây thiếu hàng; cần wages/hiring/firing/cash flow nhất quán. |

Lộ trình:
- ECON-02A: tách planned_output, realized_output, sold_output, consumed, exported, stored, spoiled, curtailed.
- ECON-02B: profitability ledger cho mỗi building (revenue, inputs, wages, upkeep, taxes/subsidies, cash reserves).
- ECON-02C: utilization/hiring theo rolling profitability có hysteresis.
- ECON-02D: inventory hữu hạn cho nhóm goods chọn lọc, kiểm thử spoilage/capacity/cash lock-up/famine shock.
- ECON-02E: subsistence household-retained vs market-surplus.

## 5. Liên hệ sổ cái ECON-01a Victori3
Các tỷ lệ Claude nêu (grain 53%, timber 93%, tools 94%, textiles 47%, opium 76% sản lượng không dùng/xuất khẩu) là số liệu của Victori3, không phải Victoria 3.
Cần tách produced, consumed_final, consumed_intermediate, exported, stored, spoiled, unsold_or_curtailed. Nếu không có kho, unsold không được biến thành inventory ngầm. Nếu có kho, phải có capacity/cost/spoilage.

## 6. Kết luận
1. Sell Orders > Buy Orders kéo giá xuống dưới base price; price floor và công thức chính xác: unknown.
2. Mô hình được mô tả không lưu kho vật lý; hàng bán ngay, tích lũy bằng cash/wealth.
3. Công trình có thể giảm lương, sa thải, hạn chế tuyển và ngừng hoạt động khi reserves cạn; không có lịch điều chỉnh phổ quát được công bố.
4. Subsistence tự tiêu dùng phần lớn sinh kế và đưa surplus nhỏ ra thị trường; tỷ lệ chính xác: unknown.
5. Victori3 nên ưu tiên profitability-responsive output và bổ sung kho hữu hạn cho hàng chọn lọc. Đây là khuyến nghị thiết kế của dự án.

## Nguồn
- Dev Diary #9 — National Markets: https://store.steampowered.com/news/posts/?enddate=1628180040&feed=steam_community_announcements
- Dev Diary #3 — Buildings: https://store.steampowered.com/news/posts/?enddate=1623341987&feed=steam_community_announcements
- Dev Diary #78 — Update 1.2 changelog Part 2: https://store.steampowered.com/news/posts/?enddate=1678374065&feed=steam_community_announcements
- Dev Diary #86 — Update 1.3/VotP changelog: https://store.steampowered.com/news/posts/?enddate=1684418840&feed=steam_community_announcements
- Dev Diary #131 — Famines, Starvation, Harvest Conditions: https://store.steampowered.com/news/posts/?enddate=1728568967&feed=steam_community_announcements
- Hotfix 1.15.2: https://store.steampowered.com/news/app/529340/view/680767470935474875
