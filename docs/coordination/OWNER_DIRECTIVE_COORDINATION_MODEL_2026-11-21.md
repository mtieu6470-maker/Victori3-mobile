# OWNER DIRECTIVE — CƠ CHẾ PHỐI HỢP CLAUDE / CHATGPT (21/11/2026)

- Nguồn: chỉ thị của chủ dự án gửi trực tiếp cho Claude Code trong phiên làm việc ngày 21/11/2026; Claude ghi lại nguyên văn nội dung vào repository để làm bộ nhớ dự án.
- Quan hệ với chỉ thị trước: bổ sung `OWNER_DIRECTIVE_EXECUTION_MODEL_AND_CLOCK_2026-11-21.md`. Theo quy tắc "chỉ thị owner mới nhất thắng trong phạm vi của nó", vai trò ChatGPT nay là **Independent Technical Lead** (được giao cả phát triển module, xây dựng dữ liệu, hỗ trợ kiểm thử, audit và phản biện), không chỉ nghiên cứu/tài liệu. Claude vẫn là Project Director, quyết định kiến trúc và tích hợp cuối. Gemini Hydrogen giữ vai trò hỗ trợ hình ảnh/media cho ChatGPT. DeepSeek vẫn ngoài đội.

## Nội dung chỉ thị (nguyên văn)

> **CƠ CHẾ PHỐI HỢP VICTORI3 MOBILE**
>
> Từ nay, dự án sử dụng mô hình Claude làm Tổng chỉ huy, ChatGPT làm cộng sự kỹ thuật độc lập.
>
> **1. Claude – Project Director / Lead Architect**
> - Toàn quyền định hướng và quyết định kiến trúc dự án.
> - Lập kế hoạch, chia giai đoạn và giao nhiệm vụ cho ChatGPT.
> - Điều phối phát triển, tích hợp và quản lý tiến độ.
> - Đánh giá kết quả, quyết định nghiệm thu và quản lý bàn giao GitHub.
>
> **2. ChatGPT – Independent Technical Lead**
> - Nhận và thực hiện nhiệm vụ do Claude giao.
> - Nghiên cứu chuyên sâu về Victoria 3, lịch sử, kinh tế và gameplay.
> - Phát triển module, xây dựng dữ liệu và hỗ trợ kiểm thử.
> - Audit code, thuật toán, kiến trúc và hiệu năng Android.
> - Báo cáo kết quả và phản biện Claude khi phát hiện vấn đề kỹ thuật.
>
> **3. Nguyên tắc phối hợp**
> - Claude điều hành và phân công; ChatGPT chủ động thực hiện nhiệm vụ.
> - ChatGPT có quyền phản biện, không mặc định mọi quyết định của Claude đều đúng.
> - Hai bên phải trao đổi kết quả và cập nhật tài liệu trên GitHub.
> - Không tự ý thay đổi mục tiêu, kiến trúc hoặc branch đã thống nhất.
> - Ưu tiên sản phẩm thực sự hoạt động, có kiểm thử, hướng tới chiều sâu tương đương Victoria 3.
>
> Mục tiêu: Hai AI phối hợp như một đội ngũ phát triển thực thụ, không làm việc rời rạc hoặc trùng lặp.

Ghi chú vận hành của owner trong cùng tin nhắn: khi Claude cần tài liệu, hình ảnh, video hoặc tư liệu Victoria 3, Claude báo cho owner; owner nhờ ChatGPT tìm và chuyển lại cho Claude.

## Cách Claude áp dụng

1. Mọi nhiệm vụ cho ChatGPT/Hydrogen nằm trong `docs/coordination/AI_TASK_ASSIGNMENTS.md` (mục tiêu, output, nguồn/provenance, định dạng, tiêu chí nghiệm thu, phụ thuộc, trạng thái, người tích hợp).
2. Khi ChatGPT viết code/dữ liệu: làm trên phạm vi file Claude chỉ định để không ghi đè song song; có test; Claude review + tích hợp; ghi rõ tác giả trong handoff. Không tạo branch/kiến trúc mới ngoài thống nhất.
3. Phản biện của ChatGPT ghi vào `docs/coordination/reviews/CG_CRITIQUE_<task>_<date>.md`; Claude phải trả lời bằng văn bản (chấp nhận/không + lý do) trong lát cắt kế tiếp. Self-review của Claude luôn ghi là self-review; review của ChatGPT chỉ được gọi là độc lập khi ChatGPT không đồng tác giả thay đổi đó.
4. Tư liệu Victoria 3 (ảnh chụp màn hình, video, dev diary) chỉ dùng làm **tham chiếu nghiên cứu cơ chế/thông tin**; không đưa vào game, không sao chép text/art/âm thanh.
5. Không thay đổi các quyền dành riêng cho owner (chi phí, credentials/signing, phát hành, cài lên thiết bị cá nhân, truyền dữ liệu ra ngoài, hành động không thể đảo ngược).
