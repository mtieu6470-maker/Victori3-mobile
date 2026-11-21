# CG-14 — Danh mục hàng hóa gốc đề xuất cho mô phỏng 1836–2026

- Ngày: 2026-11-22
- Loại tài liệu: **đề xuất thiết kế dữ liệu của Victori3 Mobile**, không phải bản chép danh sách hàng hóa Victoria 3.
- Mục tiêu: một taxonomy có thể mở rộng theo công nghệ, vùng, thời kỳ, chất lượng và nhu cầu POP; hỗ trợ economy/production/market/needs mà không tạo một mặt hàng cho mọi biến thể thương hiệu.
- Nguyên tắc: hàng hóa là **đầu ra có thể giao dịch/lưu chuyển**; quy trình sản xuất, dịch vụ công và năng lực sản xuất được mô hình hóa riêng. Một số dịch vụ được đưa vào phần cuối với đơn vị hoạt động vật lý để mô phỏng vận tải/thông tin.
- Thời kỳ công nghệ là mốc xuất hiện/khả dụng thương mại gần đúng, không phải ngày phát minh chính xác. Quốc gia có thể tiếp cận muộn hơn nhiều thập kỷ.

## 1. Quy ước taxonomy

### 1.1 Need groups

- `FOOD_CALORIE`: năng lượng cơ bản và lương thực.
- `FOOD_PROTEIN`: đạm động vật/thực vật.
- `FOOD_FAT`: chất béo và dầu ăn.
- `FOOD_MICRO`: rau quả, vi chất và đa dạng khẩu phần.
- `FOOD_TASTE`: gia vị, đồ uống kích thích và hàng xa xỉ.
- `CLOTHING`: quần áo, giày dép và vật liệu dệt.
- `SHELTER`: nhà ở, sửa chữa, vật liệu và đồ nội thất.
- `HEAT_LIGHT`: sưởi, nấu ăn, chiếu sáng.
- `HYGIENE`: vệ sinh cá nhân và gia đình.
- `HEALTH`: điều trị, phòng bệnh và thiết bị y tế.
- `MOBILITY`: vận tải cá nhân/công cộng và logistics.
- `COMMUNICATION`: liên lạc, thông tin và thiết bị số.
- `EDUCATION_CULTURE`: học tập, sách, giải trí và văn hóa.
- `PRODUCTION_INPUT`: đầu vào sản xuất nông nghiệp/công nghiệp.
- `CAPITAL_EQUIPMENT`: máy móc, thiết bị và tư liệu sản xuất.
- `DEFENSE_SECURITY`: vật tư quân sự/nhà nước; cần tách khỏi tiêu dùng hộ gia đình.

### 1.2 Era bands

| Code | Khoảng thời gian | Ý nghĩa |
|---|---|---|
| E0 | Trước 1836 | Có thể tồn tại trong thế giới bắt đầu game |
| E1 | 1836–1869 | Công nghiệp hóa hơi nước và cơ giới hóa ban đầu |
| E2 | 1870–1913 | Thép quy mô lớn, hóa chất công nghiệp, điện khí hóa sơ kỳ |
| E3 | 1914–1945 | Động cơ đốt trong, hàng không, hóa chất và sản xuất hàng loạt |
| E4 | 1946–1969 | Điện tử tiêu dùng, hóa dầu, ô tô đại chúng, dược phẩm hiện đại |
| E5 | 1970–1989 | Máy tính cá nhân, viễn thông số sơ kỳ, vật liệu tổng hợp |
| E6 | 1990–2009 | Internet, điện thoại di động, bán dẫn tiên tiến |
| E7 | 2010–2026 | Smartphone, cloud/data equipment, pin và năng lượng tái tạo quy mô lớn |

### 1.3 Unit rules

- Lưu khối lượng hàng rời bằng `t` (metric tonne), chất lỏng bằng `L` hoặc `m3`, điện/năng lượng bằng `MWh`, nhiên liệu lỏng có thể có unit thương mại nguồn nhưng phải có conversion sang kg/L.
- Hàng đếm chiếc dùng `piece`, `vehicle`, `machine`, `device`; vật nuôi sống dùng `head`.
- Vận tải dùng `passenger_km` hoặc `tonne_km`; dịch vụ khám chữa bệnh dùng `visit`; giáo dục dùng `student_year`.
- Unit chuẩn trong bảng là unit mô phỏng; khi nhập lịch sử phải giữ unit nguồn riêng và chuyển đổi có provenance.
- Hàng hóa có chất lượng khác nhau cần `quality_grade` hoặc `specification`; không trộn thép thô với thép hợp kim, crude oil với refined fuels, hoặc generic medicine với active ingredient cụ thể.

## 2. Danh mục hàng hóa đề xuất

### 2.1 Lương thực và thực phẩm cơ bản

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| FOOD-WHEAT | Lúa mì hạt | FOOD_CALORIE | gạo/ngô/lúa mạch (một phần) | E0 | t | Hạt chưa xay; chất lượng và độ ẩm |
| FOOD-RICE | Gạo | FOOD_CALORIE | lúa mì/ngô/sắn (một phần) | E0 | t | Gạo xay xát; phân biệt thóc nếu cần |
| FOOD-MAIZE | Ngô hạt | FOOD_CALORIE | lúa mì/khoai/sắn (một phần) | E0 | t | Thực phẩm và thức ăn chăn nuôi |
| FOOD-BARLEY | Lúa mạch | FOOD_CALORIE | yến mạch/lúa mì (một phần) | E0 | t | Thực phẩm, bia và thức ăn gia súc |
| FOOD-RYE | Lúa mạch đen | FOOD_CALORIE | lúa mì/lúa mạch (một phần) | E0 | t | Quan trọng ở vùng ôn đới |
| FOOD-OATS | Yến mạch | FOOD_CALORIE | lúa mạch/ngô (một phần) | E0 | t | Người và vật nuôi |
| FOOD-MILLET | Kê/các loại kê | FOOD_CALORIE | gạo/ngô/lúa miến (một phần) | E0 | t | Gộp theo nhóm vùng nếu dữ liệu ít |
| FOOD-SORGHUM | Cao lương | FOOD_CALORIE | kê/ngô (một phần) | E0 | t | Khả năng chịu hạn |
| FOOD-CASSAVA | Sắn | FOOD_CALORIE | khoai/ngô/gạo (một phần) | E0 | t | Tinh bột vùng nhiệt đới |
| FOOD-POTATO | Khoai tây | FOOD_CALORIE | sắn/khoai lang/ngũ cốc (một phần) | E0 | t | Cần lưu vùng khí hậu phù hợp |
| FOOD-SWEETPOTATO | Khoai lang | FOOD_CALORIE | khoai tây/sắn (một phần) | E0 | t | Củ giàu năng lượng |
| FOOD-FLOUR | Bột ngũ cốc | FOOD_CALORIE | củ nghiền/tinh bột khác (một phần) | E0 | t | Đầu ra xay xát, có loại bột |
| FOOD-BREAD | Bánh mì | FOOD_CALORIE | cơm/cháo/bánh ngô (một phần) | E0 | t | Hàng chế biến, khác flour |
| FOOD-PASTA | Mì/pasta khô | FOOD_CALORIE | bánh mì/gạo (một phần) | E0 | t | Phổ biến theo vùng, E0 |
| FOOD-PULSES | Đậu khô và đậu lăng | FOOD_PROTEIN | thịt/cá/đậu nành (một phần) | E0 | t | Nhóm đạm thực vật; có thể tách giống |
| FOOD-SOY | Đậu nành hạt | FOOD_PROTEIN;PRODUCTION_INPUT | đậu khác/thịt (một phần) | E0 | t | Thực phẩm, dầu và khô dầu |
| FOOD-VEGETABLES | Rau củ tươi | FOOD_MICRO | quả tươi/rau bảo quản (một phần) | E0 | t | Seasonal perishables |
| FOOD-FRUIT | Trái cây tươi | FOOD_MICRO | rau củ/quả khô (một phần) | E0 | t | Tách theo vùng nếu cần |
| FOOD-DRIED-FRUIT | Trái cây khô | FOOD_MICRO | trái cây tươi/mứt (một phần) | E0 | t | Bảo quản và vận tải xa |
| FOOD-BEEF | Thịt bò | FOOD_PROTEIN | cừu/lợn/gia cầm/cá (một phần) | E0 | t | Thịt đỏ; không đồng nhất với gia súc sống |
| FOOD-PORK | Thịt lợn | FOOD_PROTEIN | bò/cừu/gia cầm/đậu (một phần) | E0 | t | Thịt và mỡ có thể là phụ phẩm riêng |
| FOOD-MUTTON | Thịt cừu/dê | FOOD_PROTEIN | bò/lợn/cá (một phần) | E0 | t | Phân biệt cừu/dê khi dữ liệu đủ |
| FOOD-POULTRY | Thịt gia cầm | FOOD_PROTEIN | trứng/cá/thịt khác (một phần) | E0 | t | Gộp gà/vịt/gia cầm |
| FOOD-FISH | Cá và hải sản | FOOD_PROTEIN | thịt/đậu (một phần) | E0 | t | Tươi/khô/ướp muối là grade hoặc preservation |
| FOOD-MILK | Sữa tươi | FOOD_PROTEIN;FOOD_FAT | sữa bột/đồ uống thực vật (một phần) | E0 | L | Không dùng lít làm unit cho bơ/phô mai |
| FOOD-BUTTER | Bơ sữa | FOOD_FAT | mỡ động vật/dầu thực vật (một phần) | E0 | t | Chất béo chế biến |
| FOOD-CHEESE | Phô mai | FOOD_PROTEIN;FOOD_FAT | thịt/đậu/sữa (một phần) | E0 | t | Bảo quản và protein |
| FOOD-EGGS | Trứng | FOOD_PROTEIN | thịt/cá/đậu (một phần) | E0 | t | Khối lượng vỏ trứng; có thể quy piece |
| FOOD-EDIBLE-OIL | Dầu ăn thực vật | FOOD_FAT | bơ/mỡ động vật (một phần) | E0 | L | Tách dầu ô liu/cọ/hướng dương nếu vùng cần |
| FOOD-ANIMAL-FAT | Mỡ động vật | FOOD_FAT | dầu thực vật/bơ (một phần) | E0 | t | Mỡ lợn/bò |
| FOOD-SUGAR | Đường thô/tinh luyện | FOOD_TASTE;FOOD_CALORIE | mật ong/mật mía (một phần) | E0 | t | Phân biệt raw/refined grade |
| FOOD-HONEY | Mật ong | FOOD_TASTE | đường/mật mía (một phần) | E0 | t | Hàng ngọt truyền thống |
| FOOD-SALT | Muối ăn | FOOD_MICRO;PRODUCTION_INPUT | không có thay thế dinh dưỡng trực tiếp | E0 | t | Gia vị và bảo quản |
| FOOD-SPICES | Gia vị khô | FOOD_TASTE | gia vị vùng khác (một phần) | E0 | t | Nhóm giá trị cao, không phải calorie |
| FOOD-COFFEE | Cà phê | FOOD_TASTE | trà/cacao (một phần) | E0 | t | Hạt xanh; chế biến rang riêng nếu cần |
| FOOD-TEA | Trà khô | FOOD_TASTE | cà phê/cacao (một phần) | E0 | t | Sản phẩm lá chế biến |
| FOOD-COCOA | Ca cao | FOOD_TASTE | cà phê/trà (một phần) | E0 | t | Hạt thô và bột/cocoa products |
| FOOD-BEER | Bia | FOOD_TASTE | rượu vang/đồ uống không cồn (một phần) | E0 | L | Mô phỏng tiêu dùng và ngành đồ uống |
| FOOD-WINE | Rượu vang | FOOD_TASTE | bia/rượu mạnh (một phần) | E0 | L | Hàng vùng, chất lượng khác biệt |
| FOOD-SPIRITS | Rượu chưng cất | FOOD_TASTE | bia/rượu vang (một phần) | E0 | L | Hàng chịu thuế; không phải nhu cầu thiết yếu |
| FOOD-TOBACCO | Thuốc lá nguyên liệu/sản phẩm | FOOD_TASTE | không có thay thế trực tiếp | E0 | t | Hàng tiêu dùng gây hại; chính sách thuế riêng |

### 2.2 Dệt may, da và vệ sinh

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| TEXT-COTTON | Bông thô | PRODUCTION_INPUT;CLOTHING | lanh/gai/len (một phần) | E0 | t | Nguyên liệu dệt |
| TEXT-WOOL | Len thô | PRODUCTION_INPUT;CLOTHING | bông/lanh (một phần) | E0 | t | Nguyên liệu động vật |
| TEXT-FLAX | Sợi lanh | PRODUCTION_INPUT;CLOTHING | bông/gai (một phần) | E0 | t | Linen fibre |
| TEXT-JUTE | Đay và sợi gai | PRODUCTION_INPUT;SHELTER | bao tải/sợi khác (một phần) | E0 | t | Bao bì, dây và dệt thô |
| TEXT-SILK | Tơ tằm | CLOTHING;FOOD_TASTE | len/bông (thấp) | E0 | t | Hàng dệt cao cấp |
| TEXT-CLOTH-COTTON | Vải cotton | CLOTHING | vải lanh/len (một phần) | E0 | t | Hàng trung gian và tiêu dùng |
| TEXT-CLOTH-WOOL | Vải len | CLOTHING | cotton/lanh (một phần) | E0 | t | Quần áo giữ ấm |
| TEXT-CLOTH-LINEN | Vải lanh | CLOTHING | cotton/gai (một phần) | E0 | t | Dệt tự nhiên |
| TEXT-READYMADE | Quần áo may sẵn | CLOTHING | tự may từ vải (một phần) | E1 | piece | Sản phẩm cuối; chất lượng/độ bền |
| TEXT-FOOTWEAR | Giày dép | CLOTHING | dép/giày tự làm (một phần) | E0 | pair | Da, vải, cao su về sau |
| TEXT-LEATHER | Da thuộc | CLOTHING;PRODUCTION_INPUT | vật liệu giả da (một phần, E4+) | E0 | t | Đầu vào giày, yên, dây đai |
| TEXT-HIDES | Da sống/lông thú | PRODUCTION_INPUT | nguồn da khác (một phần) | E0 | t | Đầu vào thuộc da |
| TEXT-THREAD | Chỉ và sợi công nghiệp | PRODUCTION_INPUT | sợi tự kéo (một phần) | E1 | t | Cotton/wool/synthetic grade |
| HYGIENE-SOAP | Xà phòng | HYGIENE | tro/kiềm tự chế (thấp) | E0 | t | Vệ sinh gia đình |
| HYGIENE-DETERGENT | Chất giặt tẩy tổng hợp | HYGIENE | xà phòng (một phần) | E3 | t | Hóa chất tổng hợp quy mô công nghiệp |
| HYGIENE-PAPER | Giấy vệ sinh/giấy gia dụng | HYGIENE | vải tái sử dụng (thấp) | E2 | t | Sản phẩm giấy tiêu dùng |
| HYGIENE-COSMETICS | Mỹ phẩm và chăm sóc cá nhân | HYGIENE | sản phẩm tự chế (thấp) | E1 | t | Nhóm hàng tiêu dùng; không gộp thuốc |

### 2.3 Nhà ở, xây dựng và đồ gia dụng

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| BUILD-TIMBER | Gỗ xẻ | SHELTER;PRODUCTION_INPUT | gạch/đá/thép (một phần) | E0 | m3 | Đầu vào xây dựng, tàu, đồ gỗ |
| BUILD-FIREWOOD | Củi | HEAT_LIGHT | than/than củi/dầu (một phần) | E0 | t | Nhiên liệu hộ gia đình |
| BUILD-CHARCOAL | Than củi | HEAT_LIGHT;PRODUCTION_INPUT | than đá (một phần) | E0 | t | Nấu ăn và luyện kim truyền thống |
| BUILD-BRICK | Gạch | SHELTER | đá/gỗ/bê tông (một phần) | E0 | piece | Đơn vị piece; khối lượng quy đổi optional |
| BUILD-STONE | Đá xây dựng | SHELTER | gạch/bê tông (một phần) | E0 | t | Đá xây và đá nghiền |
| BUILD-LIME | Vôi xây dựng | SHELTER;PRODUCTION_INPUT | xi măng (E2+, một phần) | E0 | t | Vữa/trát |
| BUILD-CEMENT | Xi măng | SHELTER;PRODUCTION_INPUT | vôi/vữa truyền thống (thấp) | E2 | t | Portland cement industrial scale |
| BUILD-GLASS | Kính xây dựng | SHELTER;PRODUCTION_INPUT | cửa chớp/vật liệu mờ (thấp) | E1 | t | Tấm kính |
| BUILD-ROOFING | Tôn/tấm lợp kim loại | SHELTER | ngói/gỗ/đá (một phần) | E2 | t | Phân biệt thép mạ/kẽm |
| BUILD-STEEL | Thép xây dựng | SHELTER;CAPITAL_EQUIPMENT | gỗ/đá/gang (một phần) | E2 | t | Thép thanh/tấm/kết cấu |
| BUILD-FURNITURE | Đồ nội thất | SHELTER | đồ gỗ tự chế (một phần) | E0 | piece | Có thể chia đồ cơ bản/cao cấp |
| BUILD-PAINT | Sơn và chất phủ | SHELTER;PRODUCTION_INPUT | vôi quét/dầu tự nhiên (một phần) | E1 | L | Chất phủ bảo vệ và trang trí |
| BUILD-PIPE | Ống dẫn nước/khí | SHELTER;CAPITAL_EQUIPMENT | máng/ống gốm/gỗ (một phần) | E1 | m | Gang, thép, đồng, polymer theo era |
| BUILD-WINDOW | Cửa và khung cửa | SHELTER | cửa gỗ/kim loại (một phần) | E0 | piece | Có thể là sản phẩm hoàn thiện |
| BUILD-INSULATION | Vật liệu cách nhiệt | SHELTER;HEAT_LIGHT | tường dày/vật liệu tự nhiên (một phần) | E3 | m3 | Bông khoáng/foam hiện đại |

### 2.4 Năng lượng và nhiên liệu

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| ENERGY-COAL | Than đá | HEAT_LIGHT;PRODUCTION_INPUT | củi/than cốc/dầu (một phần) | E0 | t | Nhiên liệu và công nghiệp |
| ENERGY-COKE | Than cốc | PRODUCTION_INPUT | than củi (rất hạn chế) | E1 | t | Luyện gang/thép |
| ENERGY-CRUDE-OIL | Dầu thô | PRODUCTION_INPUT | than/khí (một phần) | E2 | t | Không dùng trực tiếp như xăng/diesel |
| ENERGY-KEROSENE | Dầu hỏa | HEAT_LIGHT | dầu thực vật/khí/điện (một phần) | E2 | L | Chiếu sáng và nhiệt |
| ENERGY-GASOLINE | Xăng | MOBILITY;PRODUCTION_INPUT | ethanol/diesel/điện (theo động cơ) | E3 | L | Nhiên liệu động cơ xăng |
| ENERGY-DIESEL | Diesel | MOBILITY;PRODUCTION_INPUT | dầu nặng/điện (theo máy) | E3 | L | Động cơ diesel |
| ENERGY-FUEL-OIL | Dầu nhiên liệu nặng | PRODUCTION_INPUT;MOBILITY | than/khí (một phần) | E3 | t | Tàu, lò hơi, công nghiệp |
| ENERGY-NATGAS | Khí tự nhiên | HEAT_LIGHT;PRODUCTION_INPUT | than/dầu/điện (một phần) | E3 | m3 | Khí đường ống/LNG phải phân biệt logistics |
| ENERGY-ELECTRICITY | Điện năng | HEAT_LIGHT;PRODUCTION_INPUT;COMMUNICATION | nhiên liệu trực tiếp/cơ năng (thấp) | E2 | MWh | Hàng năng lượng thứ cấp; grid loss riêng |
| ENERGY-NUCLEAR-FUEL | Nhiên liệu hạt nhân | PRODUCTION_INPUT | không thay trực tiếp ở nhà máy | E4 | kg | Uranium fuel; nguồn và enrichment riêng |
| ENERGY-RENEWABLE-POWER | Điện tái tạo | PRODUCTION_INPUT | điện từ than/khí/hạt nhân (cùng dịch vụ điện) | E7 | MWh | Không nên là hàng tiêu dùng khác biệt; phân biệt nguồn phát trong supply mix |
| ENERGY-HYDROGEN | Hydro công nghiệp/nhiên liệu | PRODUCTION_INPUT;MOBILITY | khí tự nhiên/điện (tùy quy trình) | E5 | kg | Phân biệt grey/blue/green bằng production tag |

### 2.5 Khoáng sản, kim loại và hóa chất cơ bản

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| MIN-IRON-ORE | Quặng sắt | PRODUCTION_INPUT | phế liệu sắt (một phần) | E0 | t | Hàm lượng Fe là quality grade |
| MIN-PIG-IRON | Gang | PRODUCTION_INPUT | thép/phế liệu (một phần) | E0 | t | Sản phẩm lò cao |
| MIN-IRON | Sắt rèn/sắt thanh | PRODUCTION_INPUT;CAPITAL_EQUIPMENT | gỗ/đồng/gang (một phần) | E0 | t | Vật liệu cơ khí sớm |
| MIN-STEEL | Thép carbon | PRODUCTION_INPUT;CAPITAL_EQUIPMENT | gang/sắt (thấp) | E1 | t | Sản phẩm kim loại công nghiệp |
| MIN-COPPER-ORE | Quặng đồng | PRODUCTION_INPUT | phế liệu đồng (một phần) | E0 | t | Hàm lượng Cu |
| MIN-COPPER | Đồng tinh luyện | PRODUCTION_INPUT;COMMUNICATION | nhôm (E4+, một phần) | E0 | t | Dây dẫn, ống và hợp kim |
| MIN-BAUXITE | Quặng bauxite | PRODUCTION_INPUT | không thay trực tiếp | E3 | t | Nguyên liệu nhôm |
| MIN-ALUMINIUM | Nhôm | PRODUCTION_INPUT;CAPITAL_EQUIPMENT | thép/gỗ (một phần) | E3 | t | Sản xuất quy mô lớn cuối thế kỷ XIX/đầu XX |
| MIN-LEAD | Chì | PRODUCTION_INPUT | vật liệu khác tùy ứng dụng | E0 | t | Pin, ống, đạn; quy định độc tính |
| MIN-ZINC | Kẽm | PRODUCTION_INPUT | sơn phủ khác (một phần) | E0 | t | Mạ và hợp kim |
| MIN-TIN | Thiếc | PRODUCTION_INPUT | nhôm/thép mạ (một phần) | E0 | t | Hàn và hợp kim |
| MIN-NICKEL | Niken | PRODUCTION_INPUT | hợp kim khác (một phần) | E2 | t | Thép không gỉ, pin |
| MIN-SULFUR | Lưu huỳnh | PRODUCTION_INPUT | nguồn hóa chất khác (thấp) | E0 | t | Hóa chất và phân bón |
| MIN-PHOSPHATE | Quặng phosphat | PRODUCTION_INPUT | nguồn phân hữu cơ (một phần) | E2 | t | Đầu vào phân bón |
| MIN-POTASH | Muối kali | PRODUCTION_INPUT | phân hữu cơ/nguồn kali khác (một phần) | E2 | t | Phân bón |
| MIN-LIMESTONE | Đá vôi | PRODUCTION_INPUT;SHELTER | nguồn carbonate khác (một phần) | E0 | t | Xi măng, vôi, luyện kim |
| CHEM-SULFURIC-ACID | Axit sulfuric | PRODUCTION_INPUT | hóa chất acid khác (thấp) | E2 | t | Hóa chất cơ bản |
| CHEM-SODA-ASH | Soda ash | PRODUCTION_INPUT | quy trình kiềm khác (một phần) | E1 | t | Kính, xà phòng, hóa chất |
| CHEM-CAUSTIC-SODA | Xút | PRODUCTION_INPUT | kiềm khác (thấp) | E2 | t | Giấy, dệt, hóa chất |
| CHEM-AMMONIA | Amoniac | PRODUCTION_INPUT | nguồn đạm khác (một phần) | E3 | t | Phân bón và hóa chất |
| CHEM-FERTILIZER-N | Phân đạm | PRODUCTION_INPUT | phân chuồng/đậu cố định đạm (một phần) | E3 | t | Hàm lượng dinh dưỡng N |
| CHEM-FERTILIZER-PK | Phân lân/kali | PRODUCTION_INPUT | phân hữu cơ/nguồn khoáng khác (một phần) | E2 | t | Tách N/P/K khi mô hình nông nghiệp cần |
| CHEM-PESTICIDE | Thuốc bảo vệ thực vật | PRODUCTION_INPUT | luân canh/biện pháp sinh học (một phần) | E3 | t | Độc tính/quy định riêng |
| CHEM-DYES | Thuốc nhuộm và pigment | PRODUCTION_INPUT | thuốc nhuộm tự nhiên (một phần) | E2 | t | Natural dyes E0; synthetic dyes E2 |
| CHEM-POLYMER | Nhựa polymer | PRODUCTION_INPUT;SHELTER | gỗ/kim loại/thuỷ tinh (một phần) | E4 | t | Nhóm nhựa; grade theo loại polymer |
| CHEM-SYNTHETIC-RUBBER | Cao su tổng hợp | PRODUCTION_INPUT;MOBILITY | cao su tự nhiên (một phần) | E3 | t | Đầu vào lốp và công nghiệp |
| CHEM-GLASS-FIBRE | Sợi thủy tinh | PRODUCTION_INPUT | kim loại/gỗ (một phần) | E4 | t | Vật liệu composite |
| CHEM-PAPER-PULP | Bột giấy | PRODUCTION_INPUT | sợi tái chế (một phần) | E1 | t | Đầu vào giấy |

### 2.6 Máy móc, tư liệu sản xuất và nông nghiệp

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| CAP-TEXTILE-MACHINE | Máy dệt/kéo sợi | CAPITAL_EQUIPMENT | lao động thủ công (năng suất thấp) | E1 | machine | Máy công nghiệp, không phải vải |
| CAP-STEAM-ENGINE | Động cơ hơi nước | CAPITAL_EQUIPMENT | sức kéo người/vật/nước/gió (một phần) | E1 | machine | Công suất kW là thuộc tính |
| CAP-LOCOMOTIVE | Đầu máy xe lửa | CAPITAL_EQUIPMENT;MOBILITY | ngựa/xe kéo/đầu máy khác | E1 | vehicle | Hàng vốn, dịch vụ vận tải tách riêng |
| CAP-RAIL-ROLLINGSTOCK | Toa xe đường sắt | CAPITAL_EQUIPMENT;MOBILITY | phương tiện vận tải khác | E1 | vehicle | Passenger/freight car |
| CAP-AGRI-IMPLEMENTS | Nông cụ | CAPITAL_EQUIPMENT | lao động/nông cụ thủ công | E0 | piece | Cày, bừa, liềm, máy gặt theo era |
| CAP-TRACTOR | Máy kéo nông nghiệp | CAPITAL_EQUIPMENT | sức kéo động vật (một phần) | E3 | vehicle | Nhiên liệu và công suất riêng |
| CAP-HARVESTER | Máy gặt/đập liên hợp | CAPITAL_EQUIPMENT | lao động/nông cụ (năng suất thấp) | E3 | machine | Nông nghiệp cơ giới |
| CAP-MACHINE-TOOLS | Máy công cụ | CAPITAL_EQUIPMENT | dụng cụ thủ công (năng suất thấp) | E1 | machine | Máy tiện, phay, khoan |
| CAP-INDUSTRIAL-MACHINERY | Máy móc công nghiệp | CAPITAL_EQUIPMENT | lao động thủ công (năng suất thấp) | E1 | machine | Nhóm máy sản xuất tổng quát |
| CAP-ELECTRIC-MOTOR | Động cơ điện | CAPITAL_EQUIPMENT | truyền động hơi/cơ khí (một phần) | E2 | machine | Công suất và hiệu suất |
| CAP-GENERATOR | Máy phát điện | CAPITAL_EQUIPMENT | cơ năng trực tiếp (một phần) | E2 | machine | Công suất MW là thuộc tính |
| CAP-BATTERY | Pin lưu trữ điện | CAPITAL_EQUIPMENT;HEAT_LIGHT | lưu trữ cơ/không lưu trữ (một phần) | E2 | kWh_capacity | Unit là dung lượng lưu trữ, không phải số cell |
| CAP-TELEGRAPH | Thiết bị điện báo | CAPITAL_EQUIPMENT;COMMUNICATION | bưu chính/đường sắt thông tin (một phần) | E1 | device | Hạ tầng thông tin |
| CAP-TELEPHONE | Thiết bị điện thoại | CAPITAL_EQUIPMENT;COMMUNICATION | điện báo/bưu chính (một phần) | E2 | device | Thiết bị đầu cuối; mạng tách riêng |
| CAP-COMPUTER | Máy tính | CAPITAL_EQUIPMENT;COMMUNICATION | xử lý thủ công/máy cơ (thấp) | E5 | device | Máy tính cá nhân và workstation là grade |
| CAP-SEMICONDUCTOR | Chip bán dẫn | PRODUCTION_INPUT;CAPITAL_EQUIPMENT | linh kiện điện tử rời (một phần) | E4 | piece | Phân loại theo node/performance/grade |
| CAP-SOLAR-PANEL | Tấm pin mặt trời | CAPITAL_EQUIPMENT | nguồn điện khác (dịch vụ điện) | E7 | kW_peak | Công suất danh định |
| CAP-WIND-TURBINE | Tuabin gió | CAPITAL_EQUIPMENT | nguồn điện khác (dịch vụ điện) | E6 | MW | Công suất danh định |

### 2.7 Vận tải, phương tiện và logistics

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| MOB-HORSE | Ngựa kéo/cưỡi | MOBILITY;PRODUCTION_INPUT | bò kéo/lừa/xe cơ giới (một phần) | E0 | head | Động vật sống, feed/maintenance riêng |
| MOB-CART | Xe ngựa/xe kéo | MOBILITY;CAPITAL_EQUIPMENT | vận tải gánh/đường sắt (một phần) | E0 | vehicle | Sức tải là thuộc tính |
| MOB-BICYCLE | Xe đạp | MOBILITY | đi bộ/xe máy (một phần) | E2 | vehicle | Hàng vốn hộ gia đình |
| MOB-AUTOMOBILE | Ô tô con | MOBILITY | xe đạp/xe buýt/đường sắt (một phần) | E3 | vehicle | Phân khúc xe phổ thông/cao cấp |
| MOB-TRUCK | Xe tải | MOBILITY;CAPITAL_EQUIPMENT | xe ngựa/đường sắt (một phần) | E3 | vehicle | Logistics hàng hóa |
| MOB-BUS | Xe buýt | MOBILITY | đường sắt/xe ngựa (một phần) | E3 | vehicle | Hàng vốn; passenger-km là dịch vụ |
| MOB-MOTORCYCLE | Xe máy | MOBILITY | xe đạp/ô tô (một phần) | E3 | vehicle | Hàng tiêu dùng bền |
| MOB-SHIP-COMMERCIAL | Tàu buôn | CAPITAL_EQUIPMENT;MOBILITY | tàu buồm/đường sắt (một phần) | E0 | vessel | Tấn trọng tải là thuộc tính; freight service tách riêng |
| MOB-SHIP-STEAM | Tàu hơi nước | CAPITAL_EQUIPMENT;MOBILITY | tàu buồm (một phần) | E1 | vessel | Hàng vốn hàng hải |
| MOB-AIRCRAFT | Máy bay dân dụng | CAPITAL_EQUIPMENT;MOBILITY | tàu/đường sắt (một phần) | E3 | aircraft | Sức chở/seat là thuộc tính |
| MOB-RAIL-SERVICE | Dịch vụ vận tải đường sắt | MOBILITY | đường bộ/đường thủy (một phần) | E1 | passenger_km hoặc tonne_km | Hai output tách biệt, không trộn |
| MOB-ROAD-FREIGHT | Dịch vụ vận tải đường bộ | MOBILITY | rail/water freight (một phần) | E0 | tonne_km | Dùng để tính logistics |
| MOB-SEA-FREIGHT | Dịch vụ vận tải biển | MOBILITY | rail/road/air freight (một phần) | E0 | tonne_km | Capacity/route/insurance riêng |
| MOB-AIR-TRAVEL | Dịch vụ hàng không | MOBILITY | rail/sea (một phần) | E3 | passenger_km | Hàng dịch vụ, không phải máy bay |

### 2.8 Hàng tiêu dùng bền, điện tử và công nghệ hiện đại

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| DURABLE-SEWING-MACHINE | Máy may gia đình | CLOTHING;CAPITAL_EQUIPMENT | may tay (năng suất thấp) | E2 | machine | Nâng năng suất hộ gia đình |
| DURABLE-STOVE | Bếp gia đình | HEAT_LIGHT | lò/bếp truyền thống (một phần) | E0 | piece | Grade nhiên liệu/hiệu suất |
| DURABLE-LAMP | Đèn chiếu sáng | HEAT_LIGHT | nến/đèn dầu/đèn gas (một phần) | E0 | piece | Đèn dầu E0, đèn điện E2 |
| DURABLE-REFRIGERATOR | Tủ lạnh | SHELTER;HEALTH | bảo quản muối/sấy/đá (thấp) | E4 | piece | Hàng bền, phụ thuộc điện |
| DURABLE-AIR-CONDITIONER | Điều hòa không khí | SHELTER;HEALTH | quạt/thông gió (một phần) | E4 | piece | Nhu cầu phụ thuộc khí hậu |
| DURABLE-WASHING-MACHINE | Máy giặt | SHELTER;HYGIENE | giặt tay/dịch vụ giặt (một phần) | E4 | piece | Hàng bền |
| DURABLE-RADIO | Máy thu thanh | COMMUNICATION;EDUCATION_CULTURE | báo/in/điện báo (một phần) | E3 | device | Nhận thông tin |
| DURABLE-TELEVISION | TV | COMMUNICATION;EDUCATION_CULTURE | radio/rạp chiếu phim (một phần) | E4 | device | Thiết bị đầu cuối |
| DURABLE-MOBILE-PHONE | Điện thoại di động | COMMUNICATION | điện thoại cố định/thư (một phần) | E5 | device | 2G→3G→4G/5G là capability tier |
| DURABLE-SMARTPHONE | Smartphone | COMMUNICATION;EDUCATION_CULTURE | mobile phone + computer (một phần) | E6 | device | Không đồng nhất với điện thoại phổ thông |
| DURABLE-HOME-COMPUTER | Máy tính cá nhân | COMMUNICATION;EDUCATION_CULTURE | máy chữ/thư viện (một phần) | E5 | device | PC/laptop có thể là subtype |
| DURABLE-INTERNET-ROUTER | Router/modem | COMMUNICATION | hạ tầng analog (thấp) | E6 | device | Phụ thuộc network coverage |
| DURABLE-POWER-ELECTRONICS | Thiết bị điện tử công suất | PRODUCTION_INPUT;CAPITAL_EQUIPMENT | relay/cơ khí (thấp) | E5 | device | Biến tần, bộ nguồn, controller |
| DURABLE-LED-LIGHTING | Đèn LED | HEAT_LIGHT | bóng sợi đốt/huỳnh quang (một phần) | E7 | piece | Hiệu suất và tuổi thọ |
| DURABLE-HOME-APPLIANCE | Thiết bị gia dụng điện khác | SHELTER | lao động thủ công (một phần) | E4 | piece | Chỉ dùng nhóm nếu không cần phân loại riêng |

### 2.9 Y tế, dược phẩm và chăm sóc sức khỏe

| ID | Hàng hóa | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| HEALTH-HERBAL | Dược liệu truyền thống | HEALTH | dược phẩm hiện đại (không tương đương trực tiếp) | E0 | kg | Nguồn và hiệu lực theo vùng |
| HEALTH-QUININE | Quinine/chống sốt rét lịch sử | HEALTH | biện pháp phòng bệnh/thuốc khác | E1 | kg | Chỉ xuất hiện khi công nghệ/chuỗi cung ứng cho phép |
| HEALTH-ANTISEPTIC | Chất sát trùng | HEALTH;PRODUCTION_INPUT | vệ sinh cơ bản (thấp) | E2 | L | Sản phẩm hóa chất |
| HEALTH-ANESTHETIC | Thuốc gây mê | HEALTH | phẫu thuật không gây mê (không tương đương) | E1 | dose | Dùng đơn vị liều chuẩn hóa |
| HEALTH-ANTIBIOTIC | Kháng sinh | HEALTH | không có thay thế điều trị tương đương | E4 | dose | Không cho phép xuất hiện trước thời đại |
| HEALTH-VACCINE | Vaccine | HEALTH | miễn dịch tự nhiên/phòng dịch (không tương đương) | E1 | dose | Lưu disease/coverage/efficacy |
| HEALTH-ANALGESIC | Thuốc giảm đau/hạ sốt | HEALTH | dược liệu khác (một phần) | E2 | dose | Phân loại OTC/prescription ở policy layer |
| HEALTH-INSULIN | Insulin | HEALTH | không có thay thế tương đương | E4 | dose | Hàng y tế hiện đại |
| HEALTH-PHARMA-GENERIC | Dược phẩm generic | HEALTH | hoạt chất khác cùng indication (một phần) | E4 | dose | Phải gắn active ingredient |
| HEALTH-MEDICAL-DEVICE | Thiết bị y tế | HEALTH;CAPITAL_EQUIPMENT | quy trình thủ công (năng suất thấp) | E2 | device | Dụng cụ/chẩn đoán/monitoring |
| HEALTH-PROTECTIVE | Thiết bị bảo hộ y tế | HEALTH;HYGIENE | vải/biện pháp vệ sinh cơ bản (một phần) | E3 | piece | PPE, găng, khẩu trang, vật tư |
| HEALTH-SERVICE | Dịch vụ khám chữa bệnh | HEALTH | tự chăm sóc (thấp) | E0 | visit | Dịch vụ, không phải hàng hóa vật lý |

### 2.10 Học tập, thông tin và dịch vụ thiết yếu

| ID | Hàng hóa/dịch vụ | Need group | Thay thế (mức) | Era | Unit chuẩn | Ghi chú |
|---|---|---|---|---|---|---|
| CULTURE-BOOK | Sách in | EDUCATION_CULTURE | truyền khẩu/bản chép tay (một phần) | E0 | piece | Nội dung/chất lượng là thuộc tính |
| CULTURE-PAPER | Giấy viết/in | EDUCATION_CULTURE;PRODUCTION_INPUT | bảng sáp/bản chép tay (thấp) | E0 | t | Tách khỏi giấy vệ sinh |
| CULTURE-NEWSPAPER | Báo in | COMMUNICATION;EDUCATION_CULTURE | truyền miệng/radio (một phần) | E1 | copy | Sản phẩm thông tin định kỳ |
| CULTURE-PHOTOGRAPHY | Ảnh/chụp và vật tư ảnh | EDUCATION_CULTURE | tranh/khắc in (một phần) | E1 | exposure hoặc piece | Dịch vụ/consumable tách riêng nếu cần |
| CULTURE-CINEMA | Vé/dịch vụ chiếu phim | EDUCATION_CULTURE | sân khấu/âm nhạc (một phần) | E3 | ticket | Dịch vụ văn hóa |
| CULTURE-RECORDING | Bản ghi âm | EDUCATION_CULTURE | biểu diễn trực tiếp (một phần) | E2 | copy | Đĩa than/tape/digital tier |
| CULTURE-DIGITAL-MEDIA | Nội dung số và phần mềm | EDUCATION_CULTURE;COMMUNICATION | sách/đĩa vật lý (một phần) | E6 | license_unit | Hàng số; không tính GB tải xuống như giá trị sản xuất |
| SERVICE-POSTAL | Dịch vụ bưu chính | COMMUNICATION | điện báo/điện thoại (một phần) | E0 | item_km | Số thư × khoảng cách hoặc parcel tonne_km |
| SERVICE-TELECOM | Dịch vụ viễn thông | COMMUNICATION | bưu chính/điện báo (một phần) | E2 | subscriber_month | Dịch vụ; network capacity riêng |
| SERVICE-INTERNET | Dịch vụ truy cập Internet | COMMUNICATION;EDUCATION_CULTURE | báo/radio/TV (một phần) | E6 | subscriber_month | Bandwidth/quality tier |
| SERVICE-EDUCATION | Dịch vụ giáo dục | EDUCATION_CULTURE | học nghề/gia đình (một phần) | E0 | student_year | Tách literacy/qualification outcomes |
| SERVICE-ELECTRIC-GRID | Dịch vụ truyền tải/phân phối điện | PRODUCTION_INPUT;SHELTER | tự phát điện (một phần) | E2 | MWh_delivered | Tách điện năng khỏi phí mạng nếu cần |
| SERVICE-WATER | Nước sạch cấp hộ gia đình | SHELTER;HEALTH | giếng/nước mặt (một phần) | E0 | m3 | Chất lượng và xử lý nước |
| SERVICE-SANITATION | Dịch vụ vệ sinh/thoát nước | SHELTER;HEALTH | hố xí/thoát nước tự phát (một phần) | E1 | household_month | Hạ tầng và dịch vụ công |
| SERVICE-INSURANCE | Dịch vụ bảo hiểm | SHELTER;HEALTH;PRODUCTION_INPUT | dự phòng hộ gia đình (một phần) | E1 | policy_year | Dịch vụ tài chính; không phải vật tư |
| SERVICE-FINANCE | Dịch vụ ngân hàng/tín dụng | PRODUCTION_INPUT | tín dụng phi chính thức (một phần) | E0 | account_year hoặc loan_currency_year | Dịch vụ tài chính; không phải hàng hóa vật lý |

## 3. Thiết kế thay thế và công nghệ

### 3.1 Không tạo substitution 1:1 toàn cục

Thay thế phụ thuộc:
- khẩu vị/văn hóa, tôn giáo, khí hậu và thói quen ăn uống;
- giá tương đối, thu nhập, chất lượng, độ sẵn có và thời gian bảo quản;
- công nghệ sử dụng (động cơ xăng không thể dùng diesel nếu không tương thích);
- hạ tầng (điện gia dụng không hữu ích nếu hộ không kết nối lưới);
- luật, tiêu chuẩn an toàn và rào cản thương mại.

Mỗi cạnh thay thế nên có:
`from_good_id`, `to_good_id`, `substitution_strength`, `conditions`, `region`, `valid_from`, `valid_to`, `source_or_design_rationale`.

Không dùng cặp hàng hóa có cùng Need group để suy ra tự động thay thế.

### 3.2 Technology gate

Hàng hóa chỉ được sản xuất/tiêu dùng khi:
- công nghệ hoặc kỹ năng liên quan đã khả dụng;
- có nguyên liệu và thiết bị cần thiết;
- tồn tại cơ sở hạ tầng/chuỗi cung ứng;
- POP/cơ sở sản xuất có khả năng tiếp cận;
- luật/tiêu chuẩn không cấm.

Ví dụ: điện năng có thể được phát hiện ở E2, nhưng mức phổ cập hộ gia đình phải tăng dần theo công suất phát, lưới điện, thu nhập và đô thị hóa; smartphone không được bật toàn cầu từ năm 1990 chỉ vì một số thiết bị di động đã tồn tại.

### 3.3 Tách hàng hóa khỏi ngành và tài sản vốn

- `steel` là hàng trung gian; `steel mill` là building; `steelmaking` là Production Method.
- `electricity` là hàng năng lượng; `power plant` là building; `grid` là hạ tầng; `MWh delivered` là output sau tổn thất mạng.
- `automobile` là hàng tiêu dùng bền; `automobile factory` là building; `passenger_km` là dịch vụ vận tải.
- `antibiotic dose` là hàng y tế; bệnh viện/clinic là building; visit là dịch vụ điều trị.
- `ship` là tư liệu vốn; `tonne_km` là dịch vụ vận tải biển; không dùng số lượng tàu làm đại diện trực tiếp cho throughput.

## 4. Data schema đề xuất

```ts
type EraBand = 'E0'|'E1'|'E2'|'E3'|'E4'|'E5'|'E6'|'E7';

interface GoodDefinition {
  id: string;
  canonicalName: string;
  category: string;
  needGroups: string[];
  canonicalUnit: string;
  firstCommercialEra: EraBand;
  earliestUseYear?: number;       // optional and source-backed when historical
  technologyGateIds: string[];
  perishability: 'perishable'|'storable'|'durable'|'capital'|'service';
  qualityDimensions: string[];
  regionAvailabilityRules: string[];
  isHouseholdGood: boolean;
  isIntermediate: boolean;
  isCapitalGood: boolean;
  isService: boolean;
}

interface SubstitutionEdge {
  fromGoodId: string;
  toGoodId: string;
  strength: number;               // 0..1, model parameter not historical fact
  conditions: string[];
  regionId?: string;
  validFromYear: number;
  validToYear?: number;
  rationale: string;
}
```

## 5. Implementation phasing

1. **1836 baseline:** grain/crops, food, livestock products, natural fibres, timber, coal, charcoal, iron, copper, salt, textiles, leather, soap, bricks, lime, glass, basic tools, sailing/steam transport as technology allows.
2. **1836–1913 unlocks:** steam engines, rail equipment, steel, chemical fertilizers/dyes, kerosene, telegraph, telephone, electricity, bicycles, early automobiles and industrial machinery.
3. **1914–1945 unlocks:** gasoline/diesel, trucks, aircraft, synthetic chemicals/rubber, early plastics, radio, cinema, mass-produced vehicles and modern medical supplies.
4. **1946–1969 unlocks:** antibiotics, vaccines at scale, synthetic fibers, household appliances, TV, aluminium mass production, industrial electronics, tractors and advanced machinery.
5. **1970–1989 unlocks:** computers, advanced batteries, telecom equipment, integrated circuits, modern polymers, air conditioning at mass scale.
6. **1990–2009 unlocks:** mobile phones, Internet hardware/services, advanced semiconductors, digital media, generic pharmaceuticals at global scale.
7. **2010–2026 unlocks:** smartphones, cloud/data equipment, LED, solar panels, utility-scale batteries, wind turbines, modern biologics and digital services.

Era bands are global technology availability categories; country-specific adoption must be modeled separately.

## 6. Scope control / what not to model as separate goods initially

- Do not create a separate good for every brand, model year, flavor, clothing style or smartphone model.
- Do not split every crop cultivar unless agricultural simulation requires it.
- Do not make each country's currency a tradable good; currencies, exchange rates and monetary policy belong to finance.
- Do not model land, shares, debt, patents or political rights as ordinary physical goods.
- Do not represent all military equipment as household consumption. Keep military procurement and defense stocks in separate ledgers.
- Do not model "technology" itself as a consumable good; technology is knowledge/capability with adoption costs and prerequisites.
- Do not mix services with physical inventory. Services use throughput units and cannot be stockpiled like coal or steel.

## Open questions / conflicts

- The final product needs a decision on the granularity of food categories and regional crops; too many separate goods will raise simulation cost and data burden.
- Need a policy for by-products (bran, molasses, hides, tallow, bone meal, slag, scrap metal) and recycling loops.
- Some goods (tobacco, alcohol, pharmaceuticals, pesticides, nuclear fuel) need special tax, health, safety or legal policy layers.
- Era bands are intentionally broad. Exact first-commercial-use years require source-backed historical data per good and region.
- Substitution strengths are proposed model parameters, not measured universal elasticities; they need calibration and should vary by income, culture, price and availability.
- Services and public infrastructure are included for economic completeness but are not physical inventory goods; keep their schemas distinct.

## Recommended acceptance tests

1. Every good has a stable unique ID, category, need group, canonical physical/throughput unit and era gate.
2. No modern good is available in 1836 without a documented technology gate.
3. A raw material, intermediate good, consumer good, capital good and service are not conflated.
4. All substitutions are directional/conditional and can vary by region and year.
5. Physical-unit conversions preserve mass/volume/energy dimensions.
6. Perishable goods cannot be stored indefinitely; durable/capital goods use separate depreciation rules.
7. Goods that share a need group are not automatically treated as perfect substitutes.
8. POP needs can map to multiple goods and goods can satisfy multiple needs with explicit weights.
9. Goods not present in a region/era remain unavailable, not zero-priced infinite supply.
10. Historical observations and model-generated estimates remain separately labeled and traceable.
