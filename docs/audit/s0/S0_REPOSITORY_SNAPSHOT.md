# S0_REPOSITORY_SNAPSHOT — S0-A bước A1

| Trường | Giá trị |
|---|---|
| Nhãn bằng chứng | `BASELINE_ORIGINAL` |
| Đặc tả | `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md` §6.2, §6.3 (A1), G0.1 — chủ dự án phê duyệt 2026-11-16 (OD-20261116-09), commit `574ddc7` |
| Uỷ quyền | S0-A (OD-20261116-10). S0-B và các giai đoạn sau: chưa được phép |
| Baseline code SHA | `2240a8fb865e0021eec2f2f4f1c6803528be9e2c` (tree `53b88f23928f4848d21d1be7c7865bac0cef5bf5`) |
| HEAD lúc chụp | `e4ef9539e97b15488394cea24e4ce5368d749368` |
| Thời điểm | 2026-11-16 06:28–06:30 UTC |
| Người thực hiện | Claude Code (tự đánh giá, **chưa được kiểm tra độc lập**) |
| Log nguyên văn | `docs/audit/s0/logs/a1/` (bảng cuối tài liệu) |

Commit này chỉ chứa tài liệu snapshot và log; không có script, test, fixture hay workflow (§6.3 A1).

## 1. Danh tính baseline

[ĐÃ XÁC MINH — `logs/a1/a1_git.log`]

- Nhánh `claude/game-historical-sandbox-modes-kg7rj7`, theo dõi `origin/claude/game-historical-sandbox-modes-kg7rj7`; đây là nhánh duy nhất trên remote và cũng là nhánh mặc định (`git ls-remote --symref origin HEAD`).
- Working tree sạch (`git status --porcelain=v1 --branch` không có dòng thay đổi); `git worktree list` chỉ có working tree chính.
- Sau baseline có 5 commit, **chỉ tài liệu**: `bd5787f`, `6c4d02a`, `c74b606`, `574ddc7`, `e4ef953`. `git diff --name-status 2240a8f HEAD` chỉ liệt kê `README.md` và các tệp dưới `docs/`.
- Kiểm tra mã/dữ liệu/test/workflow không đổi: `git diff --quiet 2240a8f HEAD -- . ':(exclude)docs' ':(exclude)README.md'` trả về **exit 0** (không khác biệt).
- Tệp sinh tự động **không** được theo dõi trong git: `src/generated/`, `public/generated/`, `public/content/registry.json`, `dist/` đều bị `.gitignore` (dòng 2, 3, 4, 10); `git ls-files` trên các đường dẫn này rỗng. Vì vậy một checkout sạch của `2240a8f` bắt đầu **không có** các tệp sinh (dùng cho A2–A3).
- 20 commit gần nhất (đến `585dd67`): xem `a1_git.log`.

## 2. Toolchain

[ĐÃ XÁC MINH — `logs/a1/a1_toolchain_local.log` và `logs/a1/ci_job_133056831671.log`]

| Thành phần | Máy của Claude (S0-A) | CI job `133056831671` |
|---|---|---|
| Hệ điều hành | Ubuntu 24.04.5 LTS, Linux 6.18.44, x86_64, 4 vCPU Intel Xeon 2.30 GHz, 16 GB RAM | Runner image `ubuntu-26.04` (version 20261111.196.1) |
| Node.js | v22.23.4 | v22.23.4 (`node-version: 22`) |
| npm | 10.9.9 | 10.9.9 |
| Vite | (theo `package-lock.json`, ghi ở A2) | v5.4.21 |
| Java | OpenJDK 21.0.12.1 | Temurin 21.0.13+9 |
| Android SDK / `apksigner` / `adb` | **không có** | có (runner) |

Node/npm trùng khớp với CI. Hệ điều hành khác nhau; ảnh hưởng (nếu có) được ghi ở A4.

## 3. CI baseline

[ĐÃ XÁC MINH qua GitHub API — `logs/a1/ci_run_43793446130.json`, `ci_job_133056831671.json`, `ci_artifacts_run_43793446130.json`; log job nguyên văn `ci_job_133056831671.log`, 598 dòng]

| Mục | Giá trị |
|---|---|
| Workflow run | `43793446130` (`Android APK (debug)`, run #16, event `push`, head `2240a8f`), conclusion `success` |
| Job | `133056831671` (`apk`), 02:39:00–02:42:46 UTC, mọi bước `success` |
| Test (log dòng 346–349) | `Test Files 5 passed (5)`, `Tests 58 passed (58)`, `Duration 100.76s` |
| Gradle (log dòng 546) | `BUILD SUCCESSFUL in 1m 32s` |
| Artifact | `14193446122` `dong-chay-lich-su-debug-apk`, 17 555 158 byte, hết hạn `2027-02-14T02:38:57Z` |
| ZIP digest (GitHub, log dòng 571) | `sha256:8bad8d7efd055e16630dc0770ebd6cf811722eb8592c04a7fe1f6c291f852077` |

Các tệp JSON là trích các trường từ phản hồi GitHub API (công cụ GitHub MCP `actions_get` / `actions_list`); không sửa giá trị nào, chỉ bỏ URL avatar, node ID và nội dung commit message. Log job lưu nguyên văn, giữ BOM và mã màu ANSI; 4 chỗ `***` là token do GitHub tự che.

## 4. ZIP, APK và manifest payload — Claude tự xác minh

[ĐÃ XÁC MINH — `logs/a1/a1_artifact_verification.log`]

Ở v3.2, mã băm APK và manifest chỉ có nhãn "reviewer tính độc lập". Trong A1, Claude đã tải artifact `14193446122` qua GitHub API và tự tính lại:

| Đối tượng | Kết quả của Claude | So với giá trị đã ghi |
|---|---|---|
| ZIP artifact | 17 555 158 byte, SHA-256 `8bad8d7efd055e16630dc0770ebd6cf811722eb8592c04a7fe1f6c291f852077` | Khớp digest GitHub và giá trị của reviewer |
| `app-debug.apk` | 18 042 511 byte, SHA-256 `8a4beb6af4d033346dd8c58994df72f2a1bfe980e6ef0e10d57a9ff013d0846c`; 1 031 mục trong APK | Khớp giá trị của reviewer |
| Manifest `assets/public/` | Claude dựng lại từ APK: 592 tệp, 17 764 559 byte | **Trùng từng dòng** với `APK_BASELINE_WEB_ASSETS_SHA256.csv` của reviewer sau khi đổi CRLF → LF |
| Tệp CSV của reviewer | SHA-256 `78c4a21f06607c60cc721801fb0209ca1bace0386831d743e2c7a8891fb00eca`, 593 dòng, cả 593 dòng kết thúc bằng CRLF | Khớp giá trị đã ghi |
| Chứng chỉ ký (JAR signer, `keytool -printcert -jarfile`) | `CN=Android Debug, O=Android, C=US`, RSA 2048, hiệu lực từ **2026-11-16 02:42:33 UTC** (trong lúc bước Gradle đang chạy), SHA-256 `C5:D8:55:A7:EF:17:32:D6:0B:C2:C5:CF:E7:A7:05:F8:16:09:39:29:3F:A3:F6:1A:57:16:1C:9B:A6:89:E2:A0` | Là khóa debug tạo ngay trên runner, không phải khóa development cố định |

Giới hạn:
- `keytool` chỉ đọc chữ ký JAR (v1). Không có `apksigner` nên **chưa** kiểm chữ ký APK Signature Scheme v2/v3.
- Mã băm APK định danh đúng tệp trong artifact này; nó **không** chứng minh build tái lập và **không** chứng minh cài đặt hay chạy được trên thiết bị (v3.2 §2.1).
- Artifact hết hạn 2027-02-14. Bằng chứng tồn tại sau ngày đó là mã băm và manifest đã ghi; tệp APK/ZIP **không** được commit vào repository.

## 5. Kết quả cổng

| Cổng / bước | Kết quả | Căn cứ |
|---|---|---|
| A1 — snapshot + log | `PASS` (Claude tự đánh giá, chưa kiểm độc lập) | Mục 1–4; commit chỉ gồm tài liệu này và log |
| G0.1 Snapshot | `PASS` (Claude tự đánh giá, chưa kiểm độc lập) | SHA, nhánh, trạng thái sạch, diff sau baseline (chỉ tài liệu) và toolchain đã ghi; Node/npm trùng CI |
| Mã băm APK/ZIP/manifest (đầu vào của G0.2) | Đã xác minh độc lập bởi Claude | Mục 4 |

## 6. Tái lập

```
git rev-parse HEAD 2240a8fb865e0021eec2f2f4f1c6803528be9e2c^{tree}
git status --porcelain=v1 --branch
git diff --name-status 2240a8fb865e0021eec2f2f4f1c6803528be9e2c HEAD
git diff --quiet 2240a8fb865e0021eec2f2f4f1c6803528be9e2c HEAD -- . ':(exclude)docs' ':(exclude)README.md'; echo $?
# Artifact: tải 14193446122 (GitHub UI hoặc API), rồi:
sha256sum dong-chay-lich-su-debug-apk.zip
unzip dong-chay-lich-su-debug-apk.zip && sha256sum app-debug.apk
unzip app-debug.apk 'assets/public/*' -d apk_x && find apk_x/assets/public -type f | wc -l
```

## 7. Tệp log

| Tệp | Nội dung | SHA-256 |
|---|---|---|
| `logs/a1/a1_git.log` | Lệnh git và kết quả nguyên văn | `924de2e6e01bb1f2ed50172ab3792adbfbde28823fda98ff118039c0b600be4b` |
| `logs/a1/a1_toolchain_local.log` | Toolchain máy của Claude | `7ad536274034403f836a02303c67e3563c2f88d32ddc533f1bba5794301e65b0` |
| `logs/a1/a1_artifact_verification.log` | Băm ZIP/APK, chứng chỉ, so manifest (đã bỏ URL tải tạm thời có chữ ký) | `6dae106c154e64cd33b7dc8a2c1e29f74b61fd3a81c265fed08a3ec468b62c1f` |
| `logs/a1/ci_job_133056831671.log` | Log job CI baseline nguyên văn (598 dòng) | `44eeb943cfefb535f8e24f5122670511dc789beca8a2408f12177bc892845b9a` |
| `logs/a1/ci_run_43793446130.json` | Metadata run | `133e386c3918317840021789c5736011121e5e1c3396dc0d4a82524df0c0a21b` |
| `logs/a1/ci_job_133056831671.json` | Metadata job và các bước | `65905405e6237a9311a1ad899e61ec8d651a3d90f322f2280b470f1fc0bd9682` |
| `logs/a1/ci_artifacts_run_43793446130.json` | Metadata artifact | `e3e71645d830bd94e03cbcda557088dcd201cdf457b4192e25da7a7e88c4891b` |
