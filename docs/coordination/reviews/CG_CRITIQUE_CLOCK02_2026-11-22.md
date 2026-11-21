# CG-16 — Phản biện độc lập CLOCK-02 (Web Worker)

Ngày: 2026-11-22  
Branch: ccr-b27f3fb8-epfpd6  
Kết luận: Kiến trúc chính đúng (authoritative state cô lập, request tuần tự, generation, backpressure), nhưng có lỗi failure handling cần xử lý trước khi coi là production-grade. Review tĩnh; không tuyên bố đã chạy test.

## Phát hiện

| ID | Mức độ | File/dòng | Vấn đề |
|---|---|---|---|
| CG16-01 | P1 | src/ui/game/simHost.ts:46-61, 64-72 | Worker crash sau khi khởi tạo không có fallback inline. createSimHost chỉ fallback nếu Worker constructor ném lỗi. fail() làm host failed vĩnh viễn. |
| CG16-02 | P1 | src/ui/game/simHost.ts:53-60; src/ui/game/controller.ts:317-340 | postMessage có thể ném (ví dụ DataCloneError), khiến Promise reject. sendAdvance chỉ .then(), không catch/finally để clear inflight; backpressure có thể kẹt vĩnh viễn và unhandled rejection. |
| CG16-03 | P2 | src/ui/game/simHost.ts:37-45, 53-60 | Không timeout/watchdog. Worker im lặng hoặc request không reply giữ pending Promise vô hạn, chặn inflight/backpressure. |
| CG16-04 | P2 | src/ui/game/simHost.ts:23-28 | InlineSimHost request xếp microtask rồi dispose trước khi microtask chạy vẫn gọi core.handle; khác semantics terminate worker. |
| CG16-05 | P2 | tests/sim-core-protocol.test.ts; tests/controller-clock.test.ts; tests/controller-fast-forward.test.ts | Các test được giao kiểm tra SimCore/InlineSimHost và wrapper Inline; chưa thấy test WorkerSimHost cho message ordering, error, messageerror, postMessage throw, pending cleanup và dispose. |

### CG16-01 — Runtime worker failure
Kịch bản: worker chạy được một thời gian, sau đó phát error/messageerror. fail() đánh dấu failed, settle pending bằng response lỗi gen=-1; request mới tiếp tục trả lỗi. Không có đường khôi phục.
Tác động: mô phỏng dừng vĩnh viễn dù inline có thể chạy.
Khuyến nghị: pause và settle pending. Chỉ fallback khi có checkpoint authoritative (snapshot/save) có generation hợp lệ để khởi tạo InlineSimHost và load lại. Không được tạo inline state mới hoặc dùng bản UI cũ như authoritative nếu chưa khôi phục được. Nếu không có checkpoint, hiển thị lỗi khôi phục rõ ràng.
Acceptance: worker crash không để controller tiếp tục running; pending đều settle; fallback chỉ báo thành công sau khi state/generation được phục hồi.

### CG16-02 — Promise rejection kẹt inflight
Kịch bản: postMessage ném lỗi trong Promise executor. Promise reject nhưng controller sendAdvance không có catch/finally. this.inflight vẫn trỏ tới Promise rejected; tickFrame không gửi advance mới vì !inflight sai.
Tác động: mô phỏng chết cứng, whenIdle có thể reject và phát sinh unhandled rejection.
Khuyến nghị: bắt lỗi postMessage tại WorkerSimHost, xóa pending; controller dùng catch/finally có request token để chỉ clear đúng inflight hiện hành, pause và thông báo. Không để finally cũ xóa Promise mới.
Acceptance: fake Worker throw DataCloneError; inflight được clear; controller pause; không unhandled rejection; có đường phục hồi rõ.

### CG16-03 — Worker request treo
Không có timeout cho pending request. Nếu worker không crash nhưng không reply, backpressure bị giữ vô hạn. Thêm watchdog cấu hình theo benchmark Android; timeout phải fail host, settle mọi pending và pause, không tự đoán state.

### CG16-04 — Inline dispose race
request() kiểm tra disposed trước khi schedule microtask, nhưng không kiểm tra lại bên trong microtask. Test request(); dispose(); flush microtasks; xác nhận core không mutate.

### CG16-05 — Thiếu test worker host
Bổ sung fake Worker kiểm tra correlation id, response ordering, error/messageerror, postMessage throw, pending cleanup, terminate/dispose, request im lặng và message lỗi cấu trúc.

## Những điểm được xác minh hợp lý
1. Generation: newGame/load chỉ nhận safe integer tăng dần; request thế hệ cũ bị stale. Load parse trước khi thay state.
2. Arrival order: worker xử lý message đồng bộ; SimCore không có async nội bộ. Các request được xử lý tuần tự theo thứ tự nhận.
3. Snapshot isolation: Worker structured clone; InlineSimHost clone request/response.
4. Backpressure: controller chỉ gửi advance khi chưa có inflight; backlog giữ giờ nợ.
5. Clock-only patch hợp lệ với spec hiện tại vì hourly/daily/weekly phase hiện rỗng. Khi CLOCK-03 thêm subsystem vào cadence mịn, giả định này phải được xem xét lại.

## Giới hạn
- Review tĩnh các file được giao; không chạy test suite.
- Chưa benchmark Android.
- Chưa audit toàn bộ consumer UI của controller.st.

## Kết luận cho Claude
Ưu tiên sửa CG16-02 và chốt chính sách CG16-01. Tiếp theo là watchdog, InlineSimHost dispose parity và test WorkerSimHost. Không fallback inline nếu không có checkpoint authoritative vì có nguy cơ mất tiến độ hoặc state sai.
