# Kiểm toán độ phủ toàn cầu (tự sinh)

> Tạo bởi `npx tsx tools/audit/coverage.ts` từ `src/generated/db.json` và `public/content/registry.json` — dữ liệu game thực sự đóng gói, không phải dữ liệu kế hoạch. Lần chạy: 2026-11-16.

Ký hiệu: ● có nguồn (verified/supported) · ◐ ước tính hoặc chưa đủ · ○ suy ra từ mô hình chung / mặc định · ✕ thiếu. Điểm = trung bình (●1 · ◐0,6 · ○0,25 · ✕0) trên 16 khía cạnh.

## Tổng hợp theo khu vực

| Khu vực | Thực thể | Chơi được | Điểm TB | Nguyên thủ | Nhân vật có chân dung | Quốc kỳ/huy hiệu thật | Mô tả | Quân số có nguồn | AI nghiên cứu |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Châu Âu | 75 | 65 | 64% | 79% | 52% | 81% | 99% | 28% | 32% |
| Đông Á | 6 | 5 | 67% | 83% | 50% | 67% | 100% | 0% | 50% |
| Nam Á | 18 | 16 | 58% | 78% | 33% | 56% | 94% | 0% | 11% |
| Đông Nam Á | 22 | 8 | 46% | 32% | 14% | 23% | 86% | 0% | 14% |
| Trung Á | 8 | 5 | 51% | 63% | 25% | 25% | 100% | 0% | 13% |
| Tây Á & Trung Đông | 13 | 7 | 53% | 38% | 31% | 54% | 100% | 8% | 31% |
| Bắc Phi | 11 | 5 | 50% | 45% | 9% | 9% | 100% | 9% | 27% |
| Châu Phi hạ Sahara | 65 | 17 | 41% | 22% | 9% | 14% | 98% | 0% | 5% |
| Bắc Mỹ | 16 | 3 | 43% | 19% | 13% | 25% | 100% | 13% | 19% |
| Trung Mỹ & Caribe | 9 | 2 | 41% | 22% | 22% | 78% | 100% | 0% | 0% |
| Nam Mỹ | 18 | 11 | 56% | 61% | 56% | 50% | 89% | 11% | 28% |
| Châu Đại Dương | 13 | 3 | 43% | 15% | 15% | 23% | 92% | 0% | 0% |
| **Toàn thế giới** | **274** | **147** | **52%** | 48% | 29% | 45% | 97% | 10% | 19% |

## Phân bố trạng thái theo khía cạnh (toàn thế giới)

| Khía cạnh | ● | ◐ | ○ | ✕ |
|---|---:|---:|---:|---:|
| Tên & nhận diện | 96 | 178 | 0 | 0 |
| Quốc kỳ / huy hiệu | 122 | 0 | 152 | 0 |
| Thủ đô & lãnh thổ | 248 | 0 | 0 | 26 |
| Dân số | 22 | 96 | 0 | 156 |
| Xã hội (tầng lớp) | 0 | 0 | 274 | 0 |
| Văn hóa & tôn giáo | 248 | 0 | 0 | 26 |
| Kinh tế | 0 | 109 | 165 | 0 |
| Chính thể & luật | 12 | 262 | 0 | 0 |
| Nguyên thủ | 127 | 5 | 0 | 142 |
| Nhân vật | 80 | 58 | 0 | 136 |
| Quân sự | 27 | 5 | 242 | 0 |
| Ngoại giao | 48 | 18 | 208 | 0 |
| Lịch sử & mô tả | 265 | 2 | 0 | 7 |
| AI | 46 | 5 | 223 | 0 |
| Sự kiện | 15 | 21 | 0 | 238 |
| Hình ảnh | 142 | 0 | 0 | 132 |

## Theo cấp nghiên cứu

| Cấp | Thực thể | Điểm TB |
|---|---:|---:|
| A | 11 | 88% |
| B | 29 | 75% |
| C | 123 | 56% |
| D | 111 | 37% |

## Chi tiết từng thực thể

### Châu Âu (75)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| AUS | Đế quốc Áo | sovereign/playable | A | 93% | ● | ● | ● | ● | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| FRA | Vương quốc Pháp (Quân chủ tháng Bảy) | sovereign/playable | A | 93% | ● | ● | ● | ● | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| PRU | Vương quốc Phổ | sovereign/playable | A | 93% | ● | ● | ● | ● | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| RUS | Đế quốc Nga | sovereign/playable | A | 93% | ● | ● | ● | ● | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| GBR | Vương quốc Liên hiệp Anh và Ireland | sovereign/playable | A | 90% | ● | ● | ● | ◐ | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| NED | Vương quốc Hà Lan | sovereign/playable | B | 88% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ● | ● |
| SIC | Vương quốc Hai Sicilia | sovereign/playable | B | 88% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ◐ | ● |
| SAR | Vương quốc Sardegna (Piemonte-Sardegna) | sovereign/playable | B | 86% | ● | ○ | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ● | ● |
| PAP | Lãnh thổ Giáo hoàng | sovereign/playable | B | 83% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ○ | ● | ● | ◐ | ● |
| BEL | Vương quốc Bỉ | sovereign/playable | B | 82% | ● | ● | ● | ✕ | ○ | ● | ◐ | ● | ● | ◐ | ● | ● | ● | ● | ◐ | ● |
| DEN | Vương quốc Đan Mạch | sovereign/playable | B | 81% | ● | ○ | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ○ | ● | ● | ● | ● |
| SPA | Vương quốc Tây Ban Nha | sovereign/playable | B | 81% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ◐ | ● |
| BAD | Đại công quốc Baden | sovereign/playable | C | 79% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ○ | ✕ | ● |
| BAV | Vương quốc Bayern | sovereign/playable | B | 79% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| GRE | Vương quốc Hy Lạp | sovereign/playable | B | 79% | ● | ○ | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ✕ | ● |
| HDA | Đại công quốc Hessen (Darmstadt) | sovereign/playable | C | 79% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ○ | ✕ | ● |
| TUS | Đại công quốc Toscana | sovereign/playable | C | 79% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ○ | ✕ | ● |
| SAX | Vương quốc Sachsen | sovereign/playable | B | 79% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ◐ | ● | ● | ● | ◐ | ✕ | ● |
| POR | Vương quốc Bồ Đào Nha | sovereign/playable | B | 78% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ✕ | ● |
| HKA | Tuyển hầu quốc Hessen-Kassel | sovereign/playable | C | 77% | ◐ | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ○ | ✕ | ● |
| WUR | Vương quốc Württemberg | sovereign/playable | C | 77% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ◐ | ● | ● | ● | ○ | ✕ | ● |
| NOR | Vương quốc Na Uy | subject/playable | C | 74% | ● | ● | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ◐ | ✕ | ● |
| MOL | Thân vương quốc Moldavia | subject/playable | B | 73% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| SER | Thân vương quốc Serbia | subject/playable | B | 73% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| WAL | Thân vương quốc Wallachia | subject/playable | B | 72% | ◐ | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ● | ● |
| SWE | Vương quốc Thụy Điển | sovereign/playable | B | 72% | ● | ○ | ● | ● | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ◐ | ✕ | ● |
| HAN | Vương quốc Hannover | subject/playable | C | 72% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ◐ | ✕ | ● |
| SWI | Liên bang Thụy Sĩ | sovereign/playable | B | 67% | ◐ | ○ | ● | ● | ○ | ● | ◐ | ◐ | ◐ | ◐ | ● | ○ | ● | ● | ● | ✕ |
| MOD | Công quốc Modena và Reggio | sovereign/playable | C | 65% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| MSC | Đại công quốc Mecklenburg-Schwerin | sovereign/playable | C | 65% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| ADE | Công quốc Anhalt-Dessau | sovereign/playable | C | 64% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| LUC | Công quốc Lucca | sovereign/playable | C | 64% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| PMA | Công quốc Parma | sovereign/playable | C | 64% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SMN | Công quốc Sachsen-Meiningen | sovereign/playable | C | 64% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SWM | Đại công quốc Sachsen-Weimar-Eisenach | sovereign/playable | C | 64% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| ABE | Công quốc Anhalt-Bernburg | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| MNT | Montenegro (Giáo vương quốc) | de_facto_independent/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| MST | Đại công quốc Mecklenburg-Strelitz | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SAA | Công quốc Sachsen-Altenburg | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SCG | Công quốc Sachsen-Coburg và Gotha | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| WLD | Thân vương quốc Waldeck và Pyrmont | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| HHO | Bá quốc Hessen-Homburg | sovereign/playable | C | 61% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| MCO | Thân vương quốc Monaco | subject/playable | C | 61% | ● | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ○ | ✕ | ● |
| NAS | Công quốc Nassau | sovereign/playable | C | 61% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| OLD | Đại công quốc Oldenburg | sovereign/playable | C | 61% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| SLI | Thân vương quốc Schaumburg-Lippe | sovereign/playable | C | 61% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| ION | Hợp chúng quốc Quần đảo Ionia | subject/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ✕ | ● |
| CAR | Phe Carlist (Tây Ban Nha) | rebel/playable | C | 60% | ● | ○ | ✕ | ✕ | ○ | ✕ | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ◐ | ● |
| LIE | Thân vương quốc Liechtenstein | sovereign/playable | C | 59% | ● | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| AKO | Công quốc Anhalt-Köthen | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| BRU | Công quốc Braunschweig | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| HHE | Thân vương quốc Hohenzollern-Hechingen | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| HSI | Thân vương quốc Hohenzollern-Sigmaringen | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| LIP | Thân vương quốc Lippe | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| RGR | Thân vương quốc Reuss-Greiz | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| RSC | Thân vương quốc Reuss-Schleiz | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| SRU | Thân vương quốc Schwarzburg-Rudolstadt | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| SSO | Thân vương quốc Schwarzburg-Sondershausen | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| FRK | Thành phố tự do Frankfurt | sovereign/playable | C | 55% | ● | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| KRA | Thành phố tự do Kraków | subject/playable | C | 55% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ◐ | ● | ○ | ✕ | ● |
| LUB | Thành phố tự do Lübeck | sovereign/playable | C | 52% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| BRE | Thành phố tự do Bremen | sovereign/playable | C | 44% | ● | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| HAM | Thành phố tự do Hamburg | sovereign/playable | C | 44% | ● | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| SMR | Cộng hòa San Marino | sovereign/playable | C | 44% | ● | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| RLE | Thân vương quốc Reuss-Lobenstein-Ebersdorf | sovereign/playable | C | 42% | ◐ | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ✕ | ○ | ✕ | ✕ |
| FIN_GD | Đại công quốc Phần Lan | subject/part_of:RUS | D | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| GER | Quốc gia dân tộc Đức (có thể hình thành) | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| ITA | Quốc gia dân tộc Ý (có thể hình thành) | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| LUX | Đại công quốc Luxembourg | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| POL | Quốc gia dân tộc Ba Lan | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| POL_CONGRESS | Vương quốc Ba Lan (Ba Lan Quốc hội) | subject/part_of:RUS | D | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| ROM | Quốc gia dân tộc Romania | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| SAM | Thân vương quốc Samos | subject/part_of:TUR | D | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| BUL | Nhà nước Bulgaria | future/future | C | 34% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| HUN | Nhà nước Hungary | future/future | C | 34% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |

### Đông Á (6)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| JAP | Nhật Bản (Mạc phủ Tokugawa) | sovereign/playable | A | 88% | ● | ● | ● | ◐ | ○ | ● | ◐ | ● | ● | ● | ◐ | ● | ● | ● | ● | ● |
| QNG | Đại Thanh | sovereign/playable | A | 85% | ● | ● | ● | ◐ | ○ | ● | ◐ | ● | ● | ● | ◐ | ● | ● | ● | ◐ | ● |
| KOR | Triều Tiên (nhà Joseon) | sovereign/playable | B | 74% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ● | ● | ● | ✕ | ● |
| RYU | Vương quốc Lưu Cầu | subject/playable | C | 65% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ◐ | ● | ○ | ◐ | ● | ○ | ✕ | ● |
| TIB | Tây Tạng | subject/playable | C | 54% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ✕ | ✕ |
| DZ_SAKHALIN | Sakhalin (Ainu and Nivkh) | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Nam Á (18)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| EIC | Công ty Đông Ấn Anh (cai trị Ấn Độ) | subject/playable | A | 78% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ◐ | ◐ | ● | ● | ◐ | ● |
| SIK | Đế quốc Sikh | sovereign/playable | B | 72% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ◐ | ● | ● | ● | ✕ | ● |
| HYD | Hyderabad (Nizam) | subject/playable | C | 71% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ○ | ◐ | ● |
| AWA | Vương quốc Awadh | subject/playable | C | 68% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ◐ | ● |
| NEP | Vương quốc Nepal | sovereign/playable | C | 68% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| HOL | Indore (Holkar) | subject/playable | C | 67% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ○ | ✕ | ● |
| TRV | Vương quốc Travancore | subject/playable | C | 67% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ◐ | ● | ○ | ✕ | ● |
| BRD | Baroda (Gaekwad) | subject/playable | C | 65% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ✕ | ● |
| GWA | Gwalior (Scindia) | subject/playable | C | 65% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ✕ | ● |
| KAL | Hãn quốc Kalat | sovereign/playable | C | 60% | ◐ | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| SKM | Vương quốc Sikkim | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| NAG | Vương quốc Nagpur | subject/playable | C | 56% | ● | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ◐ | ● | ○ | ✕ | ✕ |
| KAN | Công quốc Kandahar | sovereign/playable | C | 52% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| SND | Sindh (các Amir Talpur) | sovereign/playable | C | 52% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| PRI | Các tiểu bang chư hầu dưới quyền Công ty (gộp) | aggregate/playable | D | 45% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ✕ | ✕ | ○ | ◐ | ◐ | ○ | ◐ | ✕ |
| DZ_HAZARA | Hazarajat | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| BHU | Bhutan | sovereign/playable | C | 38% | ◐ | ○ | ● | ✕ | ○ | ● | ◐ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| MUG | Đế quốc Mogul (danh nghĩa) | subject/part_of:EIC | D | 26% | ● | ○ | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Đông Nam Á (22)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| VNM | Việt Nam (nhà Nguyễn) | sovereign/playable | B | 77% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| SIA | Xiêm La (Rattanakosin) | sovereign/playable | B | 76% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ● | ● |
| BUR | Miến Điện (nhà Konbaung) | sovereign/playable | B | 67% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ● | ✕ | ● |
| LUA | Vương quốc Luang Prabang | subject/playable | C | 62% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ◐ | ◐ | ○ | ◐ | ● | ○ | ✕ | ● |
| BRN | Vương quốc Hồi giáo Brunei | sovereign/playable | C | 61% | ◐ | ● | ● | ✕ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| ACE | Vương quốc Hồi giáo Aceh | sovereign/playable | C | 60% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ◐ | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| SUL | Vương quốc Hồi giáo Sulu | sovereign/playable | C | 54% | ● | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BANJAR | Banjarmasin and south Borneo | decentralized/placeholder | D | 42% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PONTIANAK | Pontianak and the West Borneo kongsi | decentralized/placeholder | D | 42% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BALI | Bali and Lombok kingdoms | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BATAK | Batak lands (North Sumatra) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_CELEBES | Bugis-Makassar kingdoms (Bone, Gowa, Wajo) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_DAYAK | Dayak peoples of interior Borneo | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_HIGHLANDS | Central Highlands peoples | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KACHIN | Kachin hills | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_MAGUINDANAO | Maguindanao and Lanao (Mindanao) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_NUSA | Lesser Sunda states (Sumbawa, Flores, Timor) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SABAH | North Borneo (Sabah) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| MLY | Các vương quốc Mã Lai (gộp) | aggregate/playable | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ✕ | ✕ | ○ | ○ | ◐ | ○ | ✕ | ✕ |
| DZ_PNG_W | Western New Guinea | decentralized/placeholder | D | 33% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |
| DZ_PNG_E | Eastern New Guinea | decentralized/placeholder | D | 29% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |
| CAM | Vương quốc Campuchia | future/future | C | 23% | ◐ | ○ | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Trung Á (8)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| AFG | Tiểu vương quốc Kabul | sovereign/playable | B | 72% | ● | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| BUK | Tiểu vương quốc Bukhara | sovereign/playable | C | 62% | ● | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| KOK | Hãn quốc Kokand | sovereign/playable | C | 59% | ● | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| HER | Công quốc Herat | sovereign/playable | C | 54% | ● | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| KHI | Hãn quốc Khiva | sovereign/playable | C | 48% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KUNDUZ | Uzbek khanates of Kunduz and Balkh | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KYRGYZ | Kyrgyz tribes of the Tian Shan | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SEMIRECHYE | Senior Zhuz Kazakhs (Semirechye) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Tây Á & Trung Đông (13)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| TUR | Đế quốc Ottoman | sovereign/playable | A | 87% | ● | ● | ● | ✕ | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| PRS | Ba Tư (nhà Qajar) | sovereign/playable | B | 77% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| IMM | Lãnh địa Imam Kavkaz | de_facto_independent/playable | C | 72% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ● | ● | ● | ◐ | ● |
| NAJ | Tiểu vương quốc Nejd | sovereign/playable | C | 60% | ◐ | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| OMA | Vương quốc Hồi giáo Muscat và Oman | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_SHAMMAR | Jabal Shammar (Ha'il) | decentralized/placeholder | D | 50% | ◐ | ● | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_KUWAIT | Kuwait | decentralized/placeholder | D | 47% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| CIR | Circassia | decentralized/playable | C | 46% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ● | ● | ◐ | ◐ | ✕ |
| DZ_ADEN | Sultanate of Lahej (Aden) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_HADRAMAUT | Hadramawt | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| YEM | Lãnh địa Imam Zaydi (Yemen) | sovereign/playable | C | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_TURKMEN | Turkmen tribes (Merv, Akhal, Tejen) | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_TRUCIAL | Trucial sheikhdoms, Qatar and Bahrain | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Bắc Phi (11)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| EGY | Ai Cập dưới thời Muhammad Ali | subject/playable | A | 71% | ◐ | ○ | ● | ✕ | ○ | ● | ◐ | ● | ● | ● | ◐ | ● | ● | ● | ✕ | ● |
| TUN | Beylik Tunis | subject/playable | C | 69% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ● | ◐ | ● | ○ | ✕ | ● |
| ABD | Tiểu vương quốc Abd al-Qadir | de_facto_independent/playable | C | 65% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ● | ● | ● | ◐ | ✕ |
| MOR | Vương quốc Hồi giáo Maroc | sovereign/playable | B | 63% | ● | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ● | ● | ● | ✕ | ✕ |
| CON | Beylik Constantine | de_facto_independent/playable | C | 52% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_FEZZAN | Fezzan | decentralized/placeholder | D | 42% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KABYLIA | Kabylia | decentralized/placeholder | D | 42% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_ALG_S | Algerian oases (Mzab, Ouargla, Touat) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SAHARA_C | Tuareg confederations (Ahaggar, Aïr, Ajjer) | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_LIBYAN_DES | Libyan Desert and Kufra | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SAHARA_W | Moorish emirates (Trarza, Brakna, Adrar) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Châu Phi hạ Sahara (65)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| MER | Vương quốc Merina (Madagascar) | sovereign/playable | C | 65% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| ZUL | Vương quốc Zulu | sovereign/playable | B | 65% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ● | ✕ | ● |
| NDE | Vương quốc Ndebele | sovereign/playable | C | 62% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ◐ | ● |
| ASH | Đế quốc Ashanti | sovereign/playable | B | 61% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ● | ✕ | ● |
| DAH | Vương quốc Dahomey | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SHE | Vương quốc Shewa | de_facto_independent/playable | C | 58% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| BOR | Bornu | sovereign/playable | C | 57% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| MAS | Caliphate Massina | sovereign/playable | C | 57% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ● |
| BSO | Vương quốc Basotho | sovereign/playable | C | 54% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| SOK | Vương quốc Hồi giáo Sokoto | sovereign/playable | B | 50% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ● | ✕ | ✕ |
| ETH | Ethiopia (Thời kỳ các Hoàng thân) | sovereign/playable | C | 49% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DAR | Vương quốc Hồi giáo Darfur | sovereign/playable | C | 48% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_XHOSA | Xhosa chiefdoms | decentralized/placeholder | D | 48% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ● | ● | ○ | ◐ | ✕ |
| DZ_KONGO | Kingdom of Kongo | decentralized/placeholder | D | 47% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| FJA | Lãnh địa Imam Futa Jallon | sovereign/playable | C | 47% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| BUG | Vương quốc Buganda | sovereign/playable | C | 46% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| WAD | Vương quốc Hồi giáo Wadai | sovereign/playable | C | 46% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ● | ◐ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PEDI | Pedi kingdom | decentralized/placeholder | D | 43% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ◐ | ✕ |
| DZ_AFAR | Afar (Aussa Sultanate) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_GRIQUA | Griqua and Korana (Orange River) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_HARAR | Harar and the northern Somali clans | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_MPONDO | Mpondo kingdom | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_OROMO | Oromo groups and the Gibe kingdoms | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SAKALAVA | Sakalava and southern Madagascar | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SOMALI | Somali clans of the south and the Benadir | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_RWANDA | Kingdoms of Rwanda and Burundi | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| POR_GUI_X | Bijagós and Rio Grande peoples | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| OFS | Nhà nước Tự do Orange | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_AZANDE | Azande and Ubangi-Uele peoples | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BAGIRMI | Bagirmi Sultanate | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BENIN | Kingdom of Benin and the Niger Delta states | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_BUNYORO | Bunyoro and Toro | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_CAMEROON | Duala and Grassfields kingdoms | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_FANTE | Fante states and the Gold Coast forts | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_FUTATORO | Imamate of Futa Toro | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_GABON | Gabon coast and Ogooué peoples | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_GAZA | Gaza kingdom (Soshangane) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_IGBO | Igbo communities and the Aro confederacy | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KASANJE | Kasanje, Matamba and Mbundu states | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KENYA_INT | Kikuyu, Kamba and Maasai lands | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KONG | Kong and Senufo states | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KRU | Kru and Grebo coast | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_KUBA | Kuba and Kasai peoples | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_LOANGO | Loango and Teke kingdoms | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_LOZI | Lozi (Barotse) and the upper Zambezi | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_LUBA | Luba Kingdom | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_LUNDA | Lunda Empire (Mwata Yamvo) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_MARAVI | Chewa and Maravi states | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_MOMBASA | Mombasa (Mazrui) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_MOSSI | Mossi kingdoms (Ouagadougou, Yatenga) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_NAMA | Nama and Oorlam | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_NYAMWEZI | Nyamwezi and the Tanganyika interior | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_OVAMBO | Ovambo and Herero | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_OVIMBUNDU | Ovimbundu kingdoms (Bié, Bailundo) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SEGOU | Bambara kingdoms of Ségou and Kaarta | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SENEGAMBIA | Wolof and Serer kingdoms (Cayor, Walo, Jolof) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SHONA | Shona states | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SLE_INT | Temne and Mende chiefdoms | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SWAZI | Swazi kingdom | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_TSWANA | Tswana chiefdoms | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_YAO | Yao and Makua chiefdoms | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| LIB | Liberia (thuộc địa của Hội Thuộc địa Mỹ) | subject/playable | C | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| OYO | Oyo và các quốc gia Yoruba | sovereign/playable | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| TRN | Cộng hòa Nam Phi (Transvaal) | future/future | C | 34% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_CONGO_W | Middle Congo basin peoples | decentralized/placeholder | D | 29% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |

### Bắc Mỹ (16)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| USA | Hợp chúng quốc Hoa Kỳ | sovereign/playable | A | 93% | ● | ● | ● | ● | ○ | ● | ◐ | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| MEX | Mexico | sovereign/playable | B | 83% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ◐ | ● |
| TEX | Texas (chính quyền lâm thời) | rebel/playable | C | 57% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ◐ | ◐ | ◐ | ◐ | ○ | ● | ● | ● | ◐ | ● |
| DZ_SEMINOLE | Seminole lands (central and south Florida) | decentralized/placeholder | D | 44% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ● | ● | ○ | ◐ | ✕ |
| DZ_ARCTIC | Inuit of the Arctic archipelago | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_ALASKA | Interior and northern Alaska (Athabaskan, Iñupiat) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_APACHERIA | Apachería and Navajo lands | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_COMANCHE | Comanchería (Comanche and Kiowa) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_GREATBASIN | Great Basin and the Rockies (Shoshone, Ute, Paiute) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_NWCOAST | Pacific Northwest coast nations | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_OREGON | Oregon Country (joint British-American occupation) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PLAINS_C | Central Plains (Pawnee, Osage, Kansa) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PLAINS_N | Northern Plains (Lakota, Cheyenne, Arapaho) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PLAINS_UP | Upper Missouri (Blackfoot, Crow, Mandan) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| CSA | Liên minh miền Nam | future/future | C | 34% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| CAN | Canada | future/future | C | 23% | ◐ | ○ | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Trung Mỹ & Caribe (9)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| CAF | Cộng hòa Liên bang Trung Mỹ | sovereign/playable | C | 65% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| HAI | Cộng hòa Haiti | sovereign/playable | C | 63% | ◐ | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_MOSQUITO | Mosquito Coast (Miskito kingdom) | decentralized/placeholder | D | 47% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| COS | Costa Rica | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| ELS | El Salvador | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| HON | Honduras | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| NIC | Nicaragua | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| GUA | Guatemala | future/future | C | 26% | ● | ○ | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DOM | Cộng hòa Dominica | future/future | C | 23% | ◐ | ○ | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |

### Nam Mỹ (18)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| BRA | Đế quốc Brasil | sovereign/playable | B | 88% | ● | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ● | ● | ● | ● | ● | ● |
| ARG | Liên bang Argentina | sovereign/playable | C | 75% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| BOL | Bolivia | sovereign/playable | C | 75% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| NGR | Cộng hòa Tân Granada | sovereign/playable | C | 73% | ● | ● | ● | ● | ○ | ● | ○ | ◐ | ● | ● | ● | ○ | ● | ○ | ✕ | ● |
| CHL | Chile | sovereign/playable | C | 70% | ◐ | ○ | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ● | ● | ● | ✕ | ● |
| ECU | Ecuador | sovereign/playable | C | 65% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| PAR | Paraguay | sovereign/playable | C | 65% | ● | ● | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| VEN | Venezuela | sovereign/playable | C | 65% | ◐ | ● | ● | ◐ | ○ | ● | ◐ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| PEU | Peru | sovereign/playable | C | 61% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| URU | Uruguay | sovereign/playable | C | 61% | ● | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| RGS | Phe Farrapos (Rio Grande) | rebel/playable | C | 59% | ◐ | ● | ✕ | ✕ | ○ | ✕ | ◐ | ◐ | ● | ◐ | ○ | ● | ● | ● | ◐ | ● |
| DZ_ARAUCANIA | Araucanía (Mapuche) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PAMPAS | Pampas and northern Patagonia (Ranquel, Mapuche, Tehuelche) | decentralized/placeholder | D | 38% | ● | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| PBC | Liên bang Peru-Bolivia | future/future | C | 37% | ● | ● | ✕ | ✕ | ○ | ✕ | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_CHACO | Gran Chaco peoples (Toba, Wichí) | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_PATAGONIA | Southern Patagonia and Tierra del Fuego | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_AMAZON_NW | Upper Amazon peoples (Putumayo, Caquetá, Napo) | decentralized/placeholder | D | 29% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |
| DZ_AMAZON_W | Western Amazon peoples (Maynas, Ucayali) | decentralized/placeholder | D | 29% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |

### Châu Đại Dương (13)

| ID | Tên | Loại | Cấp | Điểm | Tên | Quốc | Thủ | Dân | Xã | Văn | Kinh | Chính | Nguyên | Nhân | Quân | Ngoại | Lịch | AI | Sự | Hình |
|---|---|---|---|---:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| HAW | Vương quốc Hawaii | sovereign/playable | C | 65% | ◐ | ● | ● | ● | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| TAH | Vương quốc Tahiti | sovereign/playable | C | 59% | ◐ | ● | ● | ✕ | ○ | ● | ○ | ◐ | ● | ● | ○ | ○ | ● | ○ | ✕ | ● |
| MAO | Liên minh các bộ tộc New Zealand | decentralized/playable | C | 50% | ◐ | ● | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ● |
| DZ_AUS_SE | Aboriginal nations of the south-east (Port Phillip, Murray) | decentralized/placeholder | D | 43% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ◐ | ✕ |
| DZ_AUS_C | Aboriginal nations of central Australia | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_AUS_N | Aboriginal nations of the north (Top End, Kimberley) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_AUS_SA | Adelaide plains and the Murray mouth | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_AUS_W | Aboriginal nations of the west | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_NZ_S | South Island (Ngāi Tahu and southern iwi) | decentralized/placeholder | D | 39% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_FIJI | Fiji | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_SAMOA | Samoa | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_TONGA | Tonga | decentralized/placeholder | D | 36% | ◐ | ○ | ● | ✕ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ● | ○ | ✕ | ✕ |
| DZ_AUS_Q | Aboriginal nations of the north-east | decentralized/placeholder | D | 33% | ◐ | ○ | ● | ◐ | ○ | ● | ○ | ◐ | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ | ✕ |

