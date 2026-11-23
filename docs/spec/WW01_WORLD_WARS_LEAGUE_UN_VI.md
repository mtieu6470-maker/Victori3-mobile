# WW-01 — Thế chiến 1 và 2, Hội Quốc Liên, Liên Hợp Quốc (đặc tả, 2026-11-23)

**Căn cứ:** owner 2026-11-23:
- "LHQ được thành lập sau CTTG2";
- chọn phương án **dựng Thế chiến 1 và 2 theo lịch sử ở Chế độ Lịch sử**; Sandbox dùng cơ chế tự phát.

**Ghế thường trực LHQ (owner, đã cài DIPLO-UN-01b):**
- 4 ghế cố định cho các nước giữ London, Paris, Washington, Moskva lúc thành lập;
- 1 ghế cho nước mạnh nhất còn lại, được 4 nước kia chấp thuận;
- ghế giữ theo vị thế (owner sửa 2026-11-23): mỗi tháng Giêng, thành viên rơi khỏi top 8 sức mạnh mất ghế; nước kế thừa lớn nhất của một thành viên sụp đổ chỉ giữ ghế nếu đủ mạnh; ghế trống trao cho nước mạnh nhất được các thành viên thường trực khác chấp thuận.

## 1. Chế độ Lịch sử: hai cuộc thế chiến theo dữ liệu (CG-40)

- **Dữ liệu** `historical_data/wars/world_wars.json`. Mỗi cuộc chiến gồm:
  - ngày bắt đầu và kết thúc;
  - các phe, mỗi thành viên kèm ngày tham chiến và ngày rút lui. Ví dụ Thế chiến 1: Nga ra khỏi chiến tranh năm 1917/18 (Brest-Litovsk), Mỹ vào năm 1917, Ý vào năm 1915. Thế chiến 2: Pháp năm 1940, Liên Xô năm 1941, Mỹ năm 1941, Ý đổi phe năm 1943;
  - kết cục;
  - các hòa ước và thay đổi lãnh thổ (Versailles, Saint-Germain, Trianon, Neuilly, Sèvres/Lausanne, Brest-Litovsk; Potsdam/Yalta, hòa ước Paris 1947, San Francisco 1951).
- **Xác định thành viên trong engine:** mỗi thành viên lịch sử là nước đang giữ thủ đô lịch sử của nó (Berlin, Vienna, Constantinople, St Petersburg/Moskva, London, Paris, Rome, Tokyo, Washington, Belgrade, Bucharest, Sofia...). Cách này giống ghế LHQ, nên nó đi theo thế giới đã mô phỏng. Nếu không có ai giữ thủ đô, hoặc người giữ là nước khác đã có trong chiến tranh, thì bỏ qua thành viên đó và ghi lại độ lệch.
- **Diễn biến:** chiến tranh dùng hệ quân sự có sẵn. Ở Chế độ Lịch sử, kết cục được kéo về phía lịch sử bằng `historicalBias` hiện có (tăng tinh thần và tiếp viện cho phe thắng lịch sử theo thời gian), không phải kết quả gán cứng. Nếu mô phỏng lệch quá xa, ghi divergence.
- **Hòa bình:** áp dụng thay đổi lãnh thổ của hòa ước cho các vùng mà thành viên tương ứng còn giữ.

## 2. Hội Quốc Liên (sau Thế chiến 1)

- Thành lập khi Thế chiến 1 kết thúc (lịch sử: 1920).
- Hội đồng có thành viên thường trực là các cường quốc thắng trận (lịch sử: Anh, Pháp, Ý, Nhật; Đức vào năm 1926, Liên Xô năm 1934). Quyết định cần nhất trí, nên yếu hơn LHQ.
- Không có quyền phủ quyết riêng: mọi thành viên Hội đồng đều chặn được. Nghị quyết lên án chỉ tăng tai tiếng; không có thêm kiệt quệ.
- Giải thể khi LHQ ra đời.

## 3. Liên Hợp Quốc (sau Thế chiến 2)

- **Chế độ Lịch sử:** thành lập khi Thế chiến 2 trong engine kết thúc. Chừng nào WW-01 chưa có dữ liệu, giữ mốc tháng 10/1945.
- **Sandbox:** thành lập sau cuộc "chiến tranh thế giới" tự phát thứ hai (mục 4).

## 4. Sandbox: chiến tranh thế giới tự phát

- **Định nghĩa:** một cuộc chiến có ít nhất 2 cường quốc ở mỗi phe và kéo dài ít nhất 24 tháng.
- **Trình tự:** cuộc thứ nhất sau năm 1900 dẫn tới Hội Quốc Liên; cuộc thứ hai dẫn tới LHQ.
- **Ghế cố định:** dành cho các cường quốc phe thắng, cộng 1 ghế cho nước mạnh nhất.

## 5. Lát triển khai

1. **WW-01a:** nhận diện chiến tranh thế giới tự phát; Hội Quốc Liên và LHQ thành lập theo trigger (Sandbox). Chế độ Lịch sử vẫn giữ mốc cố định.
2. **WW-01b:** nạp dữ liệu CG-40; tạo chiến tranh theo ngày; tham chiến và rút lui theo ngày; nghiêng kết cục về lịch sử; hòa ước.
3. **WW-01c:** Hội Quốc Liên đầy đủ (Hội đồng nhất trí, rút khỏi Hội như Nhật/Đức năm 1933); chuyển Chế độ Lịch sử sang trigger "Thế chiến 2 kết thúc".
4. Mỗi lát có test, chạy longrun 1836–1950 kiểm tra không vỡ hiệu chỉnh, và cập nhật scorecard.
