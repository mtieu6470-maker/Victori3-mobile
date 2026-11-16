# S0_B1_CI_EVIDENCE — S0-B bước B1 (CI checksums và test report)

| Trường | Giá trị |
|---|---|
| Task | `S0-B1-CI-CHECKSUMS-TEST-REPORT` |
| Nhãn bằng chứng | Pipeline bằng chứng: `AUDIT_INSTRUMENTED` (workflow có thêm bước ghi bằng chứng). Lệnh build sản phẩm: không đổi. Mã nguồn sản phẩm: giống `2240a8f` (mục 4). Payload: phân loại 4 nhóm ở mục 5 |
| Commit B1 | `382aaa84b2336854b4dbebfcdc719847ff463f41` (cha `d6edfc1`), chỉ `.github/workflows/android-apk.yml` (+288/−1). SHA-256 của workflow `82458e9cb4e1c7615d5a032d8e9b16195bbece314775fdfa2458d4f2795ffda6`; diff trùng từng byte với diff đã review (`fe6115b2eccd8b9fe67a3af4376098f066bfe48dd0bcca27a527fecff16ff7c6`) |
| CI | Run `43834719406` (https://github.com/mtieu6470-maker/Victori3-mobile/actions/runs/43834719406), job `133188390842` `apk`: `success`, 17/17 bước `success` |
| Kết luận kỹ thuật của reviewer | B1 `PASS` như một lát công việc độc lập (`docs/roadmap/S0_V3_3_GATE_RESTRUCTURE_PROPOSAL.md` §2.1, được chấp nhận bởi OD-20261116-11). Điều này **không** có nghĩa S0 hay G0.1–G0.9 đều PASS |
| Người ghi | Claude Code, 2026-11-16 |

## 1. Kết quả trong CI (log nguyên văn: `logs/b1/ci_job_133188390842.log`)

| Hạng mục | Kết quả | Dòng log |
|---|---|---|
| Quyền `GITHUB_TOKEN` | Chỉ `Contents: read`, `Metadata: read` | 22–25 |
| Test | `Test Files 5 passed (5)`, `Tests 58 passed (58)`; exit code Vitest `0` | 581–587 |
| Báo cáo test đã xác thực | `report_valid=true`. 9 bộ đếm của reporter JSON trùng với 9 bộ đếm dựng độc lập từ cây task Vitest (22 suite / 58 test); `unhandledErrorCount=0`; `invalidStates=[]` | 587–599; `ci_evidence_artifact/test_summary.txt`, `vitest-tree-results.json` |
| Tên test | 58 tên trùng danh sách của S0-A (`ci_tests.txt` có SHA-256 `c396cde9…`, giống `a4/tests_run_1.txt`) | — |
| Gradle | `BUILD SUCCESSFUL in 1m 6s` | 811 |
| Chữ ký APK (`apksigner` 37.0.0 trên runner) | Đạt với scheme v1 và v2; chứng chỉ `CN=Android Debug`; SHA-256 chứng chỉ `c2af3e2a0d5e65caa29d592ba45a4f2d5815883d160d8fd8a2b680f452b7efa2` (khác chứng chỉ của baseline, như F2 đã ghi) | `ci_evidence_artifact/apk_signing_certificate.txt` |

## 2. Mã băm — mỗi loại tệp ghi riêng

| Đối tượng | Giá trị | Xác minh độc lập của Claude (`b1_independent_verification.log`) |
|---|---|---|
| **Tệp APK** `app-debug.apk` | 18 042 486 byte; SHA-256 `314c8ca11c1d747550bbdb982326675e5f9dbdac870f3fc1cf04b9de7c22585c` | Tải ZIP qua API, giải nén, `sha256sum` → trùng `apk_sha256.txt` |
| **ZIP artifact APK** `dong-chay-lich-su-debug-apk` (ID `14210308010`) | 17 555 111 byte; SHA-256 `7717a2b79dd46fbf613845e33bac3a17634eae5b0c808328d8b21b5abc150ba0` | `sha256sum` ZIP tải về = digest API = `artifact_zip.txt` (output `artifact-digest`) |
| **ZIP artifact bằng chứng** `ci-evidence-382aaa84…-1` (ID `14209784110`) | 101 352 byte; SHA-256 `53cab2e334f59a92aed1ffb6404dd62cc534b943692885a9b45d9c2c3d578f05` | `sha256sum` ZIP tải về = digest API |
| Manifest `assets/public` của APK | 592 tệp | Tính lại từ APK tải về: trùng hoàn toàn `apk_assets_public_manifest.csv` |

Không so mã băm APK với digest ZIP. Hai artifact hết hạn ngày 2027-02-14; nội dung artifact bằng chứng được lưu lại trong `logs/b1/ci_evidence_artifact/`.

## 3. Kiểm tra trước khi commit (worktree tạm của `d6edfc1`; `logs/b1/local_precommit/`)

- `git diff --check` exit 0; parse YAML (16 bước); `bash -n` cho 11 khối `run:` exit 0; `node --check` cho reporter và validator exit 0; diff chỉ có 1 tệp và trùng từng byte với diff đã review.
- Chạy bộ test thật với reporter task-tree: 58/58, `report_valid=true`, 9 bộ đếm khớp.
- Thêm một test cố ý fail (chỉ trong worktree tạm, đã xoá): bước test trả **1** (exit code của Vitest), report vẫn hợp lệ (`success=false`, 59 test, 1 fail).

## 4. Mã nguồn sản phẩm

`git diff --quiet 2240a8f 382aaa8 -- . ':(exclude)docs' ':(exclude)README.md' ':(exclude).github/workflows/android-apk.yml'` trả exit 0: mã, dữ liệu và test giống hệt baseline.

## 5. Phân loại 4 nhóm trên dữ liệu thật của run (`b1_four_group_classification.log`)

| Phép so | Nhóm 1 trùng | Nhóm 2 | Nhóm 3 | Nhóm 4 |
|---|---|---|---|---|
| (i) Payload APK của run so với manifest APK baseline (artifact `14193446122`) | 589 | `assets/index-1X6Ixu45.js` | `assets/index-DBqUAOe4.js` | `content/registry.json`, `index.html` |
| (ii) `dist_manifest.csv` so với `dist` của S0-A (`a4/dist.csv`) | 587 | `assets/index-BK4lin7l.js` | `assets/index-DBqUAOe4.js` | `content/registry.json`, `index.html` |
| (iii) Assets Android sau `cap sync` so với payload APK của cùng run | 592 | — | — | — |

Giải thích từng tệp ở nhóm 2–4 bằng tệp thật:
- Bundle JS được ghép cặp theo thẻ `<script>` trong `index.html`.
- `cmp -l` cho thấy chỉ khác trong `built_at` (bundle JS) và `generated` (`registry.json`).
- Sau khi thay `built_at`, `generated` và tên bundle bằng hằng số, SHA-256 hai bên bằng nhau (`74907bf9…`, `5cb7b11e…`, `7ba21c11…`).

Không có khác biệt nào chưa giải thích. `public/generated/*` và `src/generated/map.json` trùng S0-A.

## 6. Giới hạn — chưa được kiểm chứng

| Hạng mục | Trạng thái |
|---|---|
| Job vẫn ở trạng thái failed trên GitHub Actions khi test thật sự fail | `NOT_TESTED` trên CI. Mới có probe trên máy (mục 3); chưa khẳng định đường fail end-to-end trên CI |
| `actionlint` | `NOT_TESTED` (lệnh chạy binary bị chính sách môi trường từ chối; không tìm cách vượt qua) |
| Thiết bị iQOO | `BLOCKED`, chờ chủ dự án (A5, R14) |
| Khóa ký | Mỗi lần chạy CI vẫn sinh khóa debug mới (F2). B1 không xử lý việc này; C3/B2 vẫn `BLOCKED` |

## 7. Tệp bằng chứng (`logs/b1/`)

Danh sách đầy đủ kèm SHA-256: chạy `sha256sum` trên `logs/b1/**`. Gồm:
- `ci_job_133188390842.log` — log job nguyên văn, 945 dòng, có 4 chỗ `***` do GitHub che;
- `ci_run_43834719406.json`, `ci_job_133188390842.json`, `ci_artifacts_run_43834719406.json` — trích từ GitHub API;
- `ci_evidence_artifact/` — 15 tệp bên trong artifact bằng chứng;
- `b1_independent_verification.log`, `b1_four_group_classification.log`, `apk_manifest_recomputed.csv`, `ci_tests.txt`;
- `local_precommit/` — log kiểm tra trước commit.

URL tải tạm thời có chữ ký đã được bỏ khỏi mọi log.
