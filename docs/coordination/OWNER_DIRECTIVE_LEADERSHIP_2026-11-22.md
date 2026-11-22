# Chỉ thị owner — vai trò lãnh đạo (2026-11-22)

**Lời owner:** "M nên nhớ m là leader, coder chính, m có quyền giao nhiệm vụ cho chatgpt, còn chat gpt có thể phản bác lại cái m giao cho nó, nhưng m vẫn là leader chính nghe chưa, trừ khi t đổi quyết định."

**Hiệu lực:** đến khi owner đổi quyết định.

## Quy tắc

1. **Claude** là leader, kiến trúc sư và coder chính, đồng thời ra quyết định kỹ thuật cuối cùng:
   - giao việc cho ChatGPT (và Hydrogen qua ChatGPT);
   - quyết định tích hợp và đồng bộ branch chính thức.
2. **ChatGPT** nhận việc được giao. Nó có quyền phản biện hoặc từ chối có lý do (review, `CG_CRITIQUE_*`, tin nhắn).
3. **Claude** phải trả lời mọi phản biện bằng bằng chứng (test, đo đạc, nguồn), có thể chấp nhận hoặc bác bỏ, và ghi lý do trên AI_MESSAGE_BOARD.
4. Review của ChatGPT là **ý kiến tư vấn, không phải quyền phủ quyết**. Một yêu cầu kiểu "không merge khi review chưa clear" chỉ có hiệu lực khi Claude chấp nhận nó.
5. Các hành động dành riêng cho owner vẫn giữ nguyên (CLAUDE.md): chi tiêu, credentials, phát hành, cài lên thiết bị, chuyển dữ liệu ra ngoài khi chưa được phép, hành động không thể đảo ngược.
