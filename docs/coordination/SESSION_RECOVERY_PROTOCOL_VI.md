# SESSION_RECOVERY_PROTOCOL — Victori3 Mobile

**Mục tiêu:** bảo đảm tiến độ không phụ thuộc vào một phiên chat, một tin nhắn, một kết nối mạng hay trí nhớ tạm thời của AI. GitHub là sổ tiến độ bền vững; chỉ trạng thái đã xác minh tại commit mới được coi là đã lưu.

## 1. Nguyên tắc bất biến

1. **Không coi tin nhắn đã gửi là công việc đã chạy.** Người dùng gửi yêu cầu không chứng minh AI đã nhận, đã thực thi hay đã lưu.
2. **Không coi phản hồi bị mất là thất bại của thao tác.** Nếu tin nhắn/response bị treo sau khi gọi GitHub, thao tác có thể đã commit. Phải kiểm tra GitHub trước khi chạy lại.
3. **Không coi nội dung trong cửa sổ chat là checkpoint.** Chỉ commit đã xuất hiện trên đúng branch và được đọc lại từ GitHub mới là checkpoint bền vững.
4. **Không đoán trạng thái.** Không xác minh được thì ghi `UNKNOWN` hoặc `BLOCKED`, không báo PASS/hoàn thành.
5. **Không chạy hai bản công việc cùng lúc trên cùng task.** Khi phiên cũ có thể vẫn đang hoạt động, phiên mới phải kiểm tra branch/commit/workflow trước khi sửa cùng phạm vi.
6. **Không tự ý mở rộng quyền.** Cơ chế phục hồi không cấp quyền thay đổi phase/gate, roadmap, package/signing, secrets, release workflow hay merge.

## 2. Quy trình bắt đầu phiên mới / tiếp quản sau khi chat treo

Thực hiện theo thứ tự, không hỏi người dùng nhắc lại thông tin đã có trên GitHub:

### A. Xác định đúng repository và trạng thái mạng

- Repository: `mtieu6470-maker/Victori3-mobile`.
- Branch được chỉ định: `claude/game-historical-sandbox-modes-kg7rj7`; vẫn phải kiểm tra branch hiện tại trên GitHub, không giả định branch chưa đổi.
- Gọi GitHub để đọc branch HEAD, commit metadata và trạng thái repository.
- Nếu GitHub không truy cập được, thử lại có giới hạn theo mục 5. Nếu vẫn lỗi, dừng mọi thao tác ghi; báo `BLOCKED — GITHUB_UNREACHABLE`, kèm thời điểm, endpoint/action, lỗi đã thấy và SHA cuối cùng đã xác minh (nếu có). Không dùng SHA cũ để commit như thể nó là HEAD mới nhất.

### B. Đọc bộ tài liệu bắt buộc

1. `AI_START_HERE.md`
2. `AGENTS.md`
3. `CLAUDE.md` nếu dùng Claude Code
4. `docs/coordination/AI_HANDOFF.md`
5. `docs/coordination/AI_COLLABORATION_PROTOCOL.md`
6. `docs/coordination/OWNER_PRODUCT_ENGINEERING_PRINCIPLES_VI.md`
7. File roadmap/owner decision, phase gate, subsystem spec và review packet được AI_HANDOFF chỉ định.
8. Ma trận feature parity và báo cáo tiến độ mới nhất liên quan đến task.

Nếu một file bắt buộc không đọc được, không tự suy đoán nội dung. Ghi file/path lỗi và dừng phần công việc phụ thuộc vào nó.

### C. Đối chiếu trạng thái công việc

- Đọc commit gần nhất, diff từ base SHA, danh sách file đã đổi, các commit gần đây và workflow liên quan.
- Kiểm tra task ID trong AI_HANDOFF: `NOT_STARTED`, `IN_PROGRESS`, `READY_FOR_REVIEW`, `CHANGES_REQUESTED`, `BLOCKED`, v.v.
- Kiểm tra có commit mới nào được tạo sau checkpoint cuối, có workflow đang chạy, có artifact mới hay không.
- Nếu phiên cũ có thể đã thực hiện thao tác, tìm commit theo message/file/branch và xác minh nội dung. Không tạo lại commit chỉ vì chat không hiển thị phản hồi.
- Phân loại chính xác:
  - `COMMITTED_VERIFIED`: commit có trên branch, đọc lại được.
  - `WORKFLOW_RUNNING`: commit đã có, CI còn chạy.
  - `WORKFLOW_FAILED`: CI đã kết thúc thất bại.
  - `UNCOMMITTED_OR_UNKNOWN`: không có bằng chứng commit; thay đổi có thể chưa được lưu.
  - `GITHUB_UNREACHABLE`: chưa thể xác minh.
- Chỉ tiếp tục task sau khi biết base SHA và trạng thái thực tế. Nếu có thay đổi không rõ nguồn gốc hoặc xung đột với phiên khác, dừng và báo chủ dự án.

### D. Tiếp tục mà không làm mất hoặc nhân đôi công việc

- Tiếp tục từ checkpoint commit mới nhất đã xác minh, không từ câu trả lời chat cuối cùng.
- Đối chiếu lại các file đã thay đổi và test trước khi sửa.
- Nếu task đã hoàn thành và CI đủ bằng chứng, không làm lại; chuyển sang review/handoff theo protocol.
- Nếu task dở dang chưa commit, xác định phần còn thiếu từ repository. Không tuyên bố đã giữ được các chỉnh sửa chỉ tồn tại trong context của phiên cũ.
- Nếu không thể tái tạo an toàn phần chưa commit, ghi nhận mất checkpoint và xin chỉ dẫn thay vì bịa lại trạng thái.
- Không chạy lại thao tác không idempotent (tạo file, tạo release, thay đổi schema, gửi request bên ngoài) trước khi kiểm tra xem lần chạy trước đã thành công chưa.

## 3. Checkpoint bắt buộc trong lúc làm

Trước khi sửa:
- Ghi task ID, mục tiêu, scope được duyệt, base SHA, files in-scope/out-of-scope, rủi ro, test dự kiến.
- Xác minh branch sạch hoặc ghi rõ các thay đổi hiện có; không ghi đè thay đổi của người khác.
- Với task lớn, chia thành các lát cắt nhỏ có thể commit và kiểm tra độc lập.

Trong khi làm:
- Sau mỗi lát cắt có ý nghĩa, chạy test liên quan.
- Cập nhật rolling report và AI_HANDOFF cùng lát cắt đó.
- Commit/push checkpoint sau khi code + báo cáo nhất quán; không để toàn bộ công việc tích tụ đến cuối phiên.
- Commit message phải nêu task/domain và kết quả; không commit các file không liên quan.
- Sau commit, đọc lại branch HEAD và file đã ghi để xác minh.

Khi kết thúc:
- Ghi exact base SHA, commit SHA, changed files, tests/exit codes, CI run URL, artifact/hash, giới hạn và next action.
- Cập nhật trạng thái task lifecycle và gate verdict tách biệt theo protocol.
- Nếu chưa commit, nói rõ `NOT_PERSISTED`; nếu commit rồi nhưng chưa CI, ghi `COMMITTED — CI_PENDING`.
- Không nói "đã xong" nếu chưa đạt định nghĩa completion.

## 4. Xử lý tin nhắn chat không phản hồi / bị treo

### Trường hợp người dùng gửi yêu cầu nhưng AI không trả lời

- Không giả định yêu cầu đã được tiếp nhận hoặc công việc đã bắt đầu.
- Người dùng có thể mở phiên mới và gửi câu ngắn: **"Tiếp quản Victori3 Mobile từ GitHub theo AI_START_HERE và SESSION_RECOVERY_PROTOCOL. Kiểm tra HEAD, handoff, commit và CI trước; tiếp tục task dở dang, không làm trùng."**
- AI ở phiên mới phải thực hiện quy trình mục 2, không yêu cầu người dùng dán lại toàn bộ bàn giao.
- Nếu task cần quyền/phê duyệt chưa có trong repo, chỉ hỏi đúng quyết định còn thiếu.

### Trường hợp AI đang làm nhưng câu trả lời cuối cùng bị mất

- Không gửi lại nguyên yêu cầu ngay lập tức để tránh chạy trùng.
- Mở phiên mới, yêu cầu tiếp quản bằng câu khôi phục ở trên.
- AI kiểm tra commit/branch/workflow trước. Nếu thao tác đã thành công, tiếp tục từ kết quả; nếu chưa, mới thực hiện lại.
- Nếu không có commit mới, chỉ được nói "chưa tìm thấy checkpoint đã lưu", không được kết luận chắc chắn rằng không có bất kỳ thao tác nào xảy ra khi GitHub chưa truy cập được.

### Trường hợp ứng dụng ChatGPT/Claude hoặc thiết bị bị đóng

- Phiên mới phải khôi phục từ GitHub; không phụ thuộc vào lịch sử hiển thị trên điện thoại.
- Không hứa rằng AI vẫn chạy nền sau khi app bị đóng hoặc mất kết nối. Chỉ workflow/automation đã được hệ thống xác nhận đang chạy mới được xem là tiếp tục độc lập.
- Nếu có GitHub Actions đang chạy, lấy run status từ GitHub; không suy ra từ spinner hoặc màn hình chat.

## 5. Xử lý nghẽn mạng, timeout, rate limit và lỗi GitHub

### Quy tắc retry

- Đọc (GET) có thể thử lại có giới hạn với backoff tăng dần; ví dụ 2 giây → 5 giây → 15 giây, tối đa 3 lần trong một đợt. Tôn trọng `Retry-After` nếu được cung cấp.
- Với timeout/connection reset sau thao tác ghi (create/update/commit), **không retry ngay**. Trước tiên đọc branch HEAD và kiểm tra file/commit để xác định lần ghi có thành công không.
- Với HTTP 409 / SHA conflict: fetch lại file/branch, so sánh thay đổi và rebase logic bằng thao tác cập nhật có kiểm soát; không ghi đè mù.
- Với HTTP 422 / validation error: đọc thông báo lỗi, sửa nguyên nhân; không gửi lặp payload y hệt.
- Với HTTP 401/403: dừng; không tìm cách vượt quyền hoặc yêu cầu người dùng chia sẻ token. Ghi permission blocker.
- Với HTTP 429 hoặc rate limit: dừng request ghi, tôn trọng thời gian reset/Retry-After, tránh polling liên tục.
- Với 5xx hoặc mạng chập chờn: retry đọc có giới hạn; thao tác ghi phải xác minh hậu điều kiện trước khi thử lại.
- Nếu sau 3 lần vẫn không xác minh được: dừng, ghi `BLOCKED`, endpoint/action, thời điểm, lỗi và SHA cuối cùng đã xác minh.

### Bảo vệ dữ liệu và tránh ghi đè

- Mọi cập nhật file phải dùng SHA blob mới nhất mà GitHub trả về; nếu SHA thay đổi, fetch và reconcile trước.
- Trước khi tạo file, kiểm tra file đã tồn tại chưa. Nếu đã tồn tại, đọc và so sánh; không tạo bản trùng hoặc đổi tên tùy tiện.
- Trước khi tạo commit, kiểm tra branch HEAD. Nếu HEAD thay đổi từ base SHA, kiểm tra diff và tích hợp an toàn; không đẩy một trạng thái lỗi thời.
- Không force-push, không rewrite history, không xóa checkpoint cũ.
- Không commit credential, token, keystore, dữ liệu cá nhân hoặc log chứa bí mật.

## 6. Quy tắc chống báo cáo sai

Báo cáo phải phân biệt:
- **Đã sửa trong working context** — chưa chứng minh đã lưu.
- **Đã commit** — commit tồn tại trên đúng branch.
- **Đã xác minh** — đọc lại commit/file từ GitHub.
- **CI PASS/FAIL/PENDING** — trạng thái workflow thực tế tại exact SHA.
- **Đã cài/chạy trên Android thật** — chỉ khi có bằng chứng thiết bị thật.
- **Claude REVIEW_PASS** — chỉ khi Claude review độc lập đúng exact SHA.
- **Owner ACCEPTED** — chỉ khi chủ dự án xác nhận.

Không dùng các từ "đã lưu", "đã push", "đã chạy", "đã kiểm tra", "đã hoàn thành" nếu không có bằng chứng tương ứng.

## 7. Mẫu checkpoint tối thiểu trong AI_HANDOFF

Mỗi task đang làm nên có:
- Task ID / status / approved scope:
- Base SHA:
- Last verified commit SHA:
- Changed files:
- Last completed step:
- Last successful test + exit code:
- CI run(s) and current status:
- Last verified artifact/hash:
- Uncommitted or uncertain work:
- Blocker / network error / permission:
- Next exact action:
- Independent review / owner decision:

## 8. Mẫu báo cáo khi phải dừng do lỗi mạng/chat

```
STATUS: BLOCKED — GITHUB_UNREACHABLE (hoặc CHAT_RESPONSE_LOST / PERMISSION_DENIED)
Repository / branch:
Last verified HEAD:
Last confirmed checkpoint:
Last operation attempted:
Operation outcome: CONFIRMED_SUCCESS / CONFIRMED_FAILURE / UNKNOWN
Evidence checked:
Changes that are definitely persisted:
Changes that are not confirmed:
Workflow status:
Safe next action:
```

Không gửi báo cáo giả rằng công việc đã tiếp tục trong nền. Không yêu cầu người dùng giải thích lại toàn bộ dự án. Khi kết nối trở lại, bắt đầu từ exact checkpoint đã xác minh.

## 9. Câu lệnh khôi phục ngắn cho chủ dự án

Có thể dán nguyên văn vào phiên mới:

> **Tiếp quản Victori3 Mobile từ GitHub. Bắt buộc đọc AI_START_HERE.md, SESSION_RECOVERY_PROTOCOL.md, AI_HANDOFF.md và AI_COLLABORATION_PROTOCOL.md. Kiểm tra branch HEAD, commit, file đã đổi và GitHub Actions để xác định phiên trước đã lưu đến đâu. Xử lý trường hợp tin nhắn/chat bị mất, timeout hoặc thao tác ghi chưa rõ kết quả; tuyệt đối không làm trùng, không đoán, không ghi đè. Tiếp tục đúng task còn dở trong phạm vi đã được duyệt. Mỗi lát cắt xong phải test, cập nhật báo cáo + handoff, commit/push và xác minh lại. Báo cáo ngắn, chỉ nêu bằng chứng thực tế.**

