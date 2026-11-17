# S0-B7 Results — Risk register and signoff package

**Task:** S0-B7  
**Status:** READY_FOR_REVIEW — draft evidence package; not owner accepted  
**Owner decision:** OD-20261116-11, especially §§1, 5 and 6 steps 5–7  
**Product baseline:** 2240a8fb865e0021eec2f2f4f1c6803528be9e2c  
**B4 test source:** ae29c99330081ba2f6af3a6d4478ec8aefc8a1ad  
**B4 CI:** run 44041104723, job 133895641421, tested HEAD d2ae88e557e9895413462c5b069886bfc606adc7  
**Preparation HEAD before B7 files:** 5d92101e56d6f60045f51f25f926b124eaf892ef  
**Date:** 2026-11-17

> This is a bounded S0-B7 audit deliverable. It does not declare S0 PASS and does not authorize S1. Product/gameplay/engine/save-schema/data/assets/Android signing changes are outside scope.

## 1. Why B7 is proceeding now

OD-20261116-11 §1 authorizes B3 + B4 + B7 sequentially. More specifically, §6 step 6 directs the team to continue B7 after B4 to prepare the risk register and signoff in either G0.6 outcome. If G0.6 is PASS, B7 may propose the bounded S1-entry package and G0.7/G0.8 exceptions; if G0.6 is FAIL, B7 must record the failure and remediation/block status, not recommend S1.

This means B7 drafting does **not** wait for B4 independent REVIEW_PASS and owner ACCEPTED. Those independent review/owner acceptance requirements apply to the final complete bounded S1-entry package before S1 can begin. The earlier handoff phase-table wording that gated B7 itself on B4 REVIEW_PASS + ACCEPTED was inconsistent with OD §6 step 6 and has been corrected.

## 2. Deliverables created

| Deliverable | Purpose | Status |
|---|---|---|
| S0_RISK_REGISTER.md | P0/P1/P2/P3 risks with evidence, impact, mitigation, accountable owner, stage and exit criteria | Draft complete; pending review |
| S0_GATE_LEDGER.csv | Current G0.1–G0.9 state, evidence and limitations | Draft complete; pending review |
| S0_SIGNOFF.md | Bounded S1-entry proposal, G0.7/G0.8 exception requests, R7 owner acknowledgement, reviewer and owner decision sections | Draft complete; not signed |
| AI_HANDOFF.md | Phase register, governance clarification, owner-directed AI roles and B7 work log | Updated; current status B7 READY_FOR_REVIEW; independent review and owner decision pending |

## 3. Gate proposal

| Gate | Proposed status | Key limitation |
|---|---|---|
| G0.1 | PASS | Recheck exact HEAD and diff at final review |
| G0.2 | PASS | B4 run is tests-only, not an application/APK build; B1 APK SHA and ZIP digest remain distinct |
| G0.3 | PASS | Known vacuous tests TC-F1…F7 remain visible as findings |
| G0.4 | PASS | 353 atomic requirements mapped; missing/partial/placeholder/unverified are not called implemented |
| G0.5 | PASS | 12 analysis groups, not 13 independent regions; data coverage gaps remain |
| G0.6 | PASS | Four valid-save continuation cases MATCH; missing-RNG TypeError is separately recorded as a compatibility risk |
| G0.7 | BLOCKED | Node PASS; desktop PARTIAL with headless SwiftShader limitations; iQOO BLOCKED |
| G0.8 | PARTIAL | Asset inventory/checksum PASS; 492 image licences not independently verified; attribution gaps remain; 227 portraits lack period validity metadata (AS-F7) |
| G0.9 | BLOCKED | Full-S0 G0.9 remains BLOCKED while R14/C3 are BLOCKED under v3.3 §2.1.1; bounded S1-entry risk disposition is reviewed separately |

Overall S0 remains PARTIAL/BLOCKED, not PASS.

## 4. Principal risk conclusions

- **P0 R7 remains open:** no verified lifecycle autosave/process-death recovery or WebView renderer/WebGL recovery. Only the owner-approved interim exposure-limiting policy is recorded; no technical fix is claimed.
- **R14 remains BLOCKED:** no baseline-device evidence that Export produces a file and Import restores the same campaign/date. This continues to block B2/C3, B5/B6 on-device and any different-signature APK installation.
- **G0.7:** only the limited S1 exception can be requested for absent iQOO measurement. No runtime/performance/tick/renderer/lifecycle work is allowed in S1.
- **G0.8:** only the limited S1 exception can be requested for pre-existing unverified content licences. S1 must not add/replace/edit/repackage or newly distribute unverified assets/text.
- **B4-R1:** a save missing RNG currently deserializes but crashes on continuation with TypeError. It is characterized, not fixed, and belongs in future save validation/migration work.
- Other P1/P2/P3 findings retain their evidence and assigned stages in the register.

## 5. Scope and change-boundary check

The B7 additions are documentation only. They do not alter gameplay, engine, RNG, save implementation/schema, migrations, historical source data, assets, Android resources, Gradle, signing or secrets. The prior B4 tests-only workflow remains separate from the APK workflow. The existing android-apk workflow is unchanged by this B7 task.

No APK was intentionally built, downloaded or installed as part of the B7 task. However, later documentation-only pushes inadvertently triggered the unchanged Android APK workflow; see §9 for run IDs and artifact evidence. No APK was installed or tested on the iQOO.

## 6. Required next review and decision

A genuine independent reviewer must inspect the exact current GitHub HEAD, the risk register, gate ledger, signoff proposal, B4 source/evidence and underlying B3/S0 evidence. The reviewer must decide whether the bounded S1-entry package has no uncontrolled P0 and whether the proposed G0.7/G0.8 exceptions meet v3.3.

The project owner must then explicitly accept or reject:
1. R7 residual-risk exposure and its interim controls.
2. EX-G07-01 (iQOO measurement deferred for S1 only).
3. EX-G08-01 (existing unverified licence records deferred for S1 only).
4. The exact bounded S1 data-contract/save-foundation scope.

Until independent REVIEW_PASS and owner ACCEPTED are both recorded, S1 remains NOT_STARTED. B7 is not a declaration that S0 has passed.

## 7. ChatGPT pre-review consistency check — 2026-11-17

This is a technical coordination/self-audit record, **not** an independent review verdict and not a REVIEW_PASS.

- **Verified pre-check HEAD:** 20099d0d97bdcb3f1f2af499eb3c2fc25538577a on claude/game-historical-sandbox-modes-kg7rj7. The branch ref was fetched directly from GitHub and matched the handoff SHA. The branch remains the repository's default branch.
- **B7 change boundary:** compare from B7 preparation base 5d92101e56d6f60045f51f25f926b124eaf892ef to the pre-check HEAD reports 26 commits and exactly these seven changed paths: S0_B7_PACKAGE_SUMMARY_VI.md, S0_B7_RESULTS.md, S0_B7_REVIEW_REQUEST.md, S0_GATE_LEDGER.csv, S0_RISK_REGISTER.md, S0_SIGNOFF.md and AI_HANDOFF.md. They are all audit/coordination documentation. No product source, engine, RNG, save implementation/schema, migration, historical data, assets, Android resources, Gradle, APK workflow or tests changed in the B7 range.
- **Risk-ID coverage:** the register contains all 42 inherited identifiers (R1–R14, TC-F1…F7, GD-F1…F6, AS-F1…F7, RM-F1…F5 and WD-F1…F3), including R3 explicitly marked CLOSED, plus the separate B4-R1 missing-RNG observation and new owner-scope R15 (3–4 GB offline content delivery). Combined rows preserve the individual identifiers; no inherited ID was missing in the row-label cross-check.
- **Gate/risk consistency:** the ledger, risk register, signoff and Vietnamese summary agree on G0.7 BLOCKED, G0.8 PARTIAL and full-S0 G0.9 BLOCKED while R14/C3 remain BLOCKED. R7 remains an open P0. G0.1–G0.6 are proposed PASS states on bounded evidence, not a declaration that all of S0 passed. No owner exception or S1 acceptance is recorded.
- **B4 evidence re-fetch:** GitHub Actions run 44041104723 is completed/success on exact checked-out SHA d2ae88e557e9895413462c5b069886bfc606adc7; job 133895641421 succeeded; 6/6 suites and 70/70 tests passed. The job log contains four Historical/Sandbox × tick-6/tick-12 MATCH results with firstDifferingPath=null and the missing-RNG continuation TypeError characterization. The run has no artifacts. The workflow source is tests-only and contains no web build, Capacitor sync, Gradle, signing, APK packaging or artifact-upload step.
- **Consistency correction:** the deliverables table in §2 previously labelled the current handoff/B7 state IN_PROGRESS, while the phase register and current handoff both said READY_FOR_REVIEW. The table is corrected to READY_FOR_REVIEW; this is a status-text correction only.
- **Role governance:** the owner-directed allocation dated 2026-11-17 is recorded in AI_COLLABORATION_PROTOCOL.md and AI_HANDOFF.md. ChatGPT is the technical lead/coordinator; Claude is the independent reviewer for work it did not author; Gemini Hydrogen supports research/content; DeepSeek may be an owner-assigned independent fallback only when it did not author the reviewed change. Historical B3 review records are unchanged.
- **Remaining decision:** Claude must review the exact HEAD after these documentation updates and issue REVIEW_PASS or CHANGES_REQUESTED. The project owner must separately record ACCEPTED for the bounded S1-entry package, R7 residual exposure, EX-G07-01, EX-G08-01 and the exact S1 scope. Until both are recorded, S1 remains NOT_STARTED.

No APK was intentionally built, downloaded or installed as part of the pre-review check. Documentation pushes inadvertently triggered automatic APK workflow runs; see §9. No APK was installed on the iQOO.

## 8. Revalidation after B7 documentation corrections — 2026-11-17

This section supersedes the earlier pre-review snapshot in §7 for the current review packet. It remains a ChatGPT technical verification, **not** an independent REVIEW_PASS.

- **Exact branch and HEAD re-fetched:** `claude/game-historical-sandbox-modes-kg7rj7`, HEAD `db6346f2cc2213dd063064a6c8b32d7a1ad5ba61`. This branch remains the repository's default branch and the only branch in the active task scope.
- **B7 diff rechecked:** compare from B7 preparation base `5d92101e56d6f60045f51f25f926b124eaf892ef` to the exact HEAD above reports 34 commits and eight changed paths: the six B7 audit deliverables plus `docs/coordination/AI_COLLABORATION_PROTOCOL.md` and `docs/coordination/AI_HANDOFF.md`. All changed paths are audit/coordination documentation. No product source, engine, RNG, save implementation/schema, migration, historical data, asset, Android resource, Gradle, workflow or test file changed in this range.
- **Risk-register completeness:** all 42 inherited IDs remain present (R1–R14; TC-F1…F7; GD-F1…F6; AS-F1…F7; RM-F1…F5; WD-F1…F3), plus B4-R1, S0-SEC-01 and new owner-scope R15. R3 remains explicitly CLOSED only for the baseline APK-hash identification gap; the entry states that this does not close whole-APK reproducibility or R1/R14. TC-F5/F6 preserve the historical findings while recording the new B4 characterization coverage.
- **P3 detail correction:** GD-F5/GD-F6, WD-F1/WD-F2, RM-F5 and AS-F5/AS-F6/AS-F7 now each include source evidence, bounded impact/interpretation, interim mitigation, accountable owner, stage and objective exit criteria. Their source severity is preserved. AS-F6 is cross-linked with R6 because both concern Natural Earth upstream provenance; a local asset hash is not represented as upstream pinning.
- **R11 evidence correction:** the risk entry now identifies `android/app/build.gradle:10` at baseline `2240a8fb`, where `defaultConfig.versionCode = 1` is set. No Gradle file was edited.
- **Protocol/signoff consistency:** `REVIEW_PASS` now means the assigned independent reviewer passed the bounded review, normally Claude; DeepSeek can substitute only when the owner assigns it and it is independent. The B7 signoff names Claude as reviewer and retains a separate owner decision. Historical B3 records naming ChatGPT as reviewer were not rewritten.
- **Gate consistency remains unchanged:** G0.1–G0.6 are bounded proposed PASS states; G0.7 remains BLOCKED; G0.8 remains PARTIAL; full-S0 G0.9 remains BLOCKED while R14/C3 remain BLOCKED. R7 remains an open P0. No owner acceptance is recorded.
- **B4 evidence remains tied to the executed test revision:** run `44041104723`, job `133895641421`, checkout SHA `d2ae88e557e9895413462c5b069886bfc606adc7`, 6/6 suites and 70/70 tests passed; all four valid-save continuations MATCH with `firstDifferingPath=null`; missing RNG continuation remains a characterized TypeError. Run artifact list is empty. No new test run was necessary for this documentation-only correction.
- **Final pre-review disposition:** B7 is `READY_FOR_REVIEW`, not REVIEW_PASS or ACCEPTED. Claude must independently review the current HEAD after re-fetching it. The project owner must then separately accept/reject R7 residual exposure, EX-G07-01, EX-G08-01 and the exact bounded S1 scope. S1 remains `NOT_STARTED`; overall S0 remains PARTIAL/BLOCKED.

No APK was intentionally built or installed; automatic APK workflow runs were triggered by documentation pushes as detailed in §9. No APK was downloaded or installed on the iQOO, and no iQOO device action was performed.

## 9. Governance incident — documentation pushes triggered the APK workflow

**Incident:** On 2026-11-17, documentation commits made during the B7 coordination/review work omitted the `[skip ci]` commit-message marker. The unchanged `.github/workflows/android-apk.yml` is configured to run on push to this branch without a documentation-path exclusion. As a result, the document-only pushes automatically triggered the `Android APK (debug)` workflow. This was an operational mistake by the ChatGPT coordinator; it was not an intentional APK build request and is not evidence that the APK workflow was changed.

**Observed GitHub Actions status at the 2026-11-17 09:16 UTC recheck:**

- 21 push-triggered `Android APK (debug)` runs associated with the B7 documentation push sequence (2026-11-17 08:06:36–09:14:38 UTC).
- 19 runs completed with conclusion `success`.
- 1 run completed with conclusion `failure` (`44048307793`).
- 1 run remained `in_progress` (`44053773347`) at the last status query.
- Verified example: run `44053488213`, commit `0ec54d8b936369b294174ebd2b894b8b0603ab1b`, job `133936826466`, conclusion `success`. Its raw job log records `./gradlew assembleDebug --no-daemon`, `BUILD SUCCESSFUL in 1m 30s`, and the successful upload of APK artifact `14315256630` (`dong-chay-lich-su-debug-apk`, 17,555,130 bytes); CI evidence artifact `14314802216` was also uploaded. The log confirms this was an APK build, not only a test run.
- Second verified example: run `44053599571`, commit `84e951ad0b92a10111438e5bda27125611dcd2fb`, completed `success`; APK artifact `14314932258` (`dong-chay-lich-su-debug-apk`, 17,555,068 bytes) and CI evidence artifact `14315825776` were present.
- Failed run `44048307793` did complete 70/70 tests across 6/6 suites, then the Gradle stage failed while resolving Maven Central dependencies after HTTP 429 responses (including Kotlin stdlib and jsr305). Its artifact listing had CI evidence only and no APK artifact. This failure is a dependency-rate-limit failure, not a simulation-test failure.
- No APK was downloaded, installed, or tested on the iQOO by ChatGPT. The existence of CI APK artifacts does not resolve R14, does not test the installed baseline APK, does not validate a signature transition, and does not authorize installation.

**Containment / subsequent handling:**

- `.github/workflows/android-apk.yml` was not edited. Workflow modifications remain outside the authorized B7 scope.
- The current GitHub connector has no workflow-cancellation action; ChatGPT could read run state/logs/artifacts but could not cancel the remaining in-progress run.
- Subsequent documentation commits use `[skip ci]` to avoid triggering push workflows. This is a commit-message control, not a permanent workflow fix.
- The B7 review packet must include this incident in the exact-HEAD review. Any permanent path-filter or workflow change requires separate owner approval.
- Do not treat the 19 successful APK workflow runs as B4 tests-only CI or as device acceptance. The independently identified B4 tests-only run remains `44041104723`.

## 10. Final exact-HEAD and incident revalidation — 2026-11-17

This section supersedes the earlier run-count snapshot in §9 after all automatic push-triggered runs had completed. It remains ChatGPT's technical coordination record, not an independent review or an owner acceptance.

- **Branch:** `claude/game-historical-sandbox-modes-kg7rj7`.
- **Pre-report-update HEAD:** `9aa51ccd5ce18483d4d3fe8eb44903cb9b3cf059`, fetched from the GitHub branch ref.
- **B7 preparation-base comparison:** compare from `5d92101e56d6f60045f51f25f926b124eaf892ef` to that HEAD reports 49 commits and exactly eight changed paths: the six B7 audit documents plus `docs/coordination/AI_COLLABORATION_PROTOCOL.md` and `docs/coordination/AI_HANDOFF.md`. No product source, engine, RNG, save implementation/schema, migrations, historical data, assets, Android resources, Gradle, workflow or test file changed in this B7 documentation range.
- **Final automatic workflow status:** 21 push-triggered `Android APK (debug)` runs between 08:06:36 and 09:14:38 UTC on 2026-11-17: **20 success, 1 failure, 0 in progress**. The two last successful runs were `44053724459` (APK artifact `14314562616`, 17,555,134 bytes) and `44053773347` (APK artifact `14314174885`, 17,555,116 bytes). Earlier verified examples and the failed Maven HTTP 429 run are detailed in §9.
- **Workflow integrity:** `.github/workflows/android-apk.yml` remains unchanged at blob SHA `7a2639057272d2629f2d6b89cfc8fb07682dad31`. Its push trigger has no docs-only path filter. No workflow modification was made in B7.
- **Containment verification:** after applying `[skip ci]` to subsequent documentation commits, a fresh Actions query found no new `android-apk.yml` push run after the containment time (09:16 UTC). This is evidence for those specific commits, not a permanent protection against future omitted markers.
- **Device/R14 status:** no APK artifact was downloaded or installed on the iQOO by ChatGPT. No export/import or signature-transition test was performed. R14 remains BLOCKED; automatic APK build artifacts do not satisfy R14.
- **B4 test evidence:** the dedicated tests-only run `44041104723` remains separate: exact tested SHA `d2ae88e557e9895413462c5b069886bfc606adc7`, job `133895641421`, 6/6 suites, 70/70 tests, four valid-save cases MATCH, no APK artifacts. The automatic APK workflow runs are not substituted for that evidence.
- **Final B7 disposition:** B7 remains `READY_FOR_REVIEW`. Claude must independently review the exact latest branch HEAD (re-fetch it rather than assuming the pre-report-update SHA above), including the updated P3 risk details, R2/AS-F3 separation, R5/RM-F3/RM-F4 separation, §9 governance incident and R15/§11 3–4 GB offline-content target. Owner `ACCEPTED` remains pending. R7 remains open P0; G0.7 remains BLOCKED; G0.8 remains PARTIAL; full-S0 G0.9 remains BLOCKED; S1 remains `NOT_STARTED`.

No new product tests were necessary for this documentation-only revalidation. All future coordination/documentation commits must use `[skip ci]` unless the owner separately approves a workflow change or an intentional CI run.

## 11. Owner target — 3–4 GB complete offline content footprint — 2026-11-17

The project owner has now stated a product target of approximately **3–4 GB for the complete game**, with stability taking priority over reaching a byte count. For engineering purposes this is recorded as the target **expanded offline content footprint across the core application plus verified content packs**, not as a requirement that one monolithic APK be 3–4 GB. This aligns with the existing v3.2 decision H (offline >3 GB, provider-neutral manifest and multiple content packs) and S23b (image coverage, content packs and offline delivery). This statement does not open S1 or authorize S23b implementation.

### 11.1. Current scale and architecture evidence

- Git tree at the inspected product baseline contains 983 tracked blobs and approximately 51.8 MB total; this includes 34.4 MB of documentation and is not the install size.
- The S0-A APK baseline web payload manifest contains 592 `assets/public` files totalling **17,764,559 bytes**. The current repository `public/` tree is approximately 10.2 MB; these are different measurements and must not be substituted for one another.
- `src/ui/main.tsx` statically imports `dbJson` and `mapJson` before boot; `HistoricalData` builds entity/region/technology maps from the full database in memory (`src/engine/data/db.ts`).
- The map pipeline is a whole-grid pipeline: `tools/build-map.ts` defines an 8,192 × 3,868 raster; `src/ui/map/mapData.ts` decodes the complete RLE payload to a single `Uint16Array` of width × height cells. This is about 63.4 MB of raw grid storage, before other map buffers/textures.
- Identity metadata is loaded lazily after game start, but `src/ui/game/content.ts` fetches and parses the whole `content/registry.json` in one operation. Individual images use browser lazy loading/async decode; there is not yet an explicit global decoded-image/GPU LRU budget or content-pack installer.
- The current image inventory has 502 registry records; the asset audit records 492 image files whose licence data has not been re-verified. Increasing media volume must not bypass source, author, period-validity or licence requirements.

### 11.2. Delivery constraints to carry into the approved roadmap

- Keep three budgets separate: (1) compressed download bytes, (2) expanded on-disk offline bytes, and (3) peak runtime resident memory/decoded GPU texture bytes. A 3–4 GB disk footprint is not a 3–4 GB RAM budget.
- A Google Play build for this size must assess Android App Bundle + Play Asset Delivery (PAD), rather than assume a single base APK. Current official Play guidance lists a 500 MB base module, 1.5 GB per asset pack, 4 GB cumulative install-time delivery, and up to 30 GB for fast-follow/on-demand packs. PAD is a Google Play delivery mechanism; it does not automatically serve a sideload APK. Official sources: https://support.google.com/googleplay/android-developer/answer/9859372 and https://developer.android.com/guide/playcore/asset-delivery.
- Sideload distribution therefore needs a separate content-pack channel (for example, pre-built archives imported/installed by the app or an approved free hosting method). No hosting provider, account requirement, paid CDN or recurring cost is selected by this record.
- Required engineering controls for the eventual pack system: provider-neutral manifest; pack ID/version/dependency and minimum engine/data-build compatibility; compressed/uncompressed size; archive and per-file SHA-256; licence/provenance; explicit Wi-Fi-first behavior; resumable download/import; free-space preflight; safe staging; atomic activation and rollback; offline completeness verification.
- Runtime controls: do not eagerly inflate the entire media library into WebView memory. Keep simulation-critical data distinct from optional narrative/media; use map tile/LOD packs and lazy image/audio loading; enforce bounded decoded-image/texture cache and evict unused assets safely.
- Acceptance tests for the future delivery stage must cover interrupted/resumed download, low-storage refusal before mutation, corrupt/hash-mismatched packs, dependency/version mismatch, app process death during update, rollback to the previous valid pack set, missing optional content, no-network cold launch and complete offline play after all required packs are installed.

### 11.3. Hai phương án giao nội dung để APK không còn bị hiểu nhầm là game đầy đủ

**Phương án A — tải gói nén rồi giải nén (khuyến nghị cho bản sideload/GitHub trước mắt):**

- APK chứa engine, UI, màn hình quản lý nội dung và manifest nhỏ. APK có thể vẫn chỉ vài chục/vài trăm MB; điều đó không còn có nghĩa game chỉ có từng ấy nội dung.
- Khi người chơi chọn **Tải toàn bộ dữ liệu**, ứng dụng tải các archive của từng pack. Mỗi archive có ID/version, compressed size, expanded size, SHA-256, danh sách file và checksum từng file.
- Chia thành nhiều archive độc lập; với GitHub Releases, giới hạn hiện hành là mỗi file asset phải **dưới 2 GiB**, tối đa 1.000 assets cho một release và tài liệu GitHub nêu không giới hạn tổng dung lượng/băng thông release. Có thể phát hành 3–4 archive ở cỡ thực tế phù hợp, không cần ép tất cả vào một file. Tính năng resume/Range phải được kiểm tra với URL redirect của từng asset trước khi cam kết.
- Ứng dụng tải vào khu vực staging, xác minh SHA-256 archive, giải nén theo luồng (không đọc toàn bộ 3–4 GB vào RAM), kiểm tra checksum/tính toàn vẹn từng file, sau đó kích hoạt cả pack set bằng bước commit nguyên tử. Nếu tải/giải nén/kiểm tra lỗi thì xóa staging, giữ pack set cũ và không báo "đã cài đầy đủ".
- Cần preflight dung lượng gồm archive tạm, vùng giải nén staging, bộ nội dung cũ để rollback và khoảng trống an toàn. Cập nhật pack lớn phải có thể từ chối an toàn khi thiếu chỗ, không ghi đè pack đang hoạt động.
- Dùng Android native downloader (Android DownloadManager hoặc user-initiated data-transfer job phù hợp phiên bản hệ điều hành) cho tác vụ dài, không dùng một request JavaScript trong WebView làm downloader 3–4 GB. Android DownloadManager có cơ chế xử lý HTTP dài, retry khi lỗi/mất kết nối và qua lần khởi động lại thiết bị; tiến trình resume thực tế vẫn phải được integration-test với máy chủ/redirect được chọn.
- Lưu nội dung đã xác minh trong thư mục app-private riêng. Để WebView đọc ảnh/âm thanh/tài nguyên từ thư mục này an toàn, dùng một đường dẫn HTTPS nội bộ qua AndroidX `WebViewAssetLoader.InternalStoragePathHandler`, chỉ ánh xạ đúng thư mục content công khai cho game; không bật file:// universal access và tuyệt đối không ánh xạ thư mục save/database/cache. Tài liệu Android cảnh báo chỉ expose một thư mục chuyên biệt trong internal storage vì tài nguyên tại đó có thể được truy cập bởi nội dung web cùng origin.

**Phương án B — phát hành AAB + Play Asset Delivery (nếu sau này chọn Google Play):**

- Base module giữ phần khởi chạy, engine và manifest thiết yếu.
- Dùng install-time chỉ cho nội dung thật sự cần ngay; nội dung lớn chia thành fast-follow hoặc on-demand asset packs theo vùng/hệ thống.
- Hướng dẫn hiện hành nêu base module tối đa 500 MB, mỗi asset pack tối đa 1,5 GB, tổng module + install-time packs tối đa 4 GB compressed download; fast-follow/on-demand packs có tổng giới hạn 30 GB compressed download. Đây là giới hạn download nén, không phải cam kết về kích thước sau giải nén.
- Không dùng OBB như giải pháp mặc định cho AAB; tài liệu Android nói AAB không hỗ trợ APK expansion OBB. Tài nguyên do PAD quản lý phải được truy xuất theo API/location của PAD, không giả định một đường dẫn cố định.

Hai phương án là hai adapter phân phối cùng một **provider-neutral pack manifest**, không tạo hai bộ dữ liệu khác nhau. Khi có điều kiện, người chơi chỉ cần một thao tác **Tải toàn bộ**; ứng dụng tự tuần tự tải pack, hiển thị tổng tiến độ và sau khi xác minh xong có thể chạy offline hoàn toàn. Người chơi cũng có thể tải từng khu vực để tiết kiệm dung lượng.

### 11.4. Không chấp nhận "phình dung lượng giả" — tiêu chí nội dung thực

Mục tiêu 3–4 GB chỉ được công nhận khi mỗi byte thuộc về tài nguyên có ích và đã qua kiểm tra:

1. **Bản đồ có độ sâu thật:** dữ liệu địa lý có provenance, raster/vector nhiều mức chi tiết (LOD), địa hình/thủy hệ/biên giới/cửa sông/hải cảng và vùng bản đồ cần thiết; zoom xa dùng lớp tổng quát, zoom gần mới nạp tile/chi tiết, không giải mã toàn thế giới vào RAM.
2. **Lịch sử có cấu trúc và có thể mô phỏng:** quốc gia/chính thể, vùng, tỉnh, thành phố/địa điểm, dân số/POP, nghề nghiệp, văn hóa, tôn giáo, tài nguyên, công nghiệp, luật, nhân vật, sự kiện, chiến tranh, liên minh, thương mại và mốc kinh tế theo năm/địa bàn; mỗi bộ dữ liệu có nguồn, thời kỳ, phương pháp, quality/uncertainty và không bịa số để lấp chỗ trống.
3. **Tài sản hình ảnh được dùng trong gameplay/UI:** chân dung có niên đại, quốc kỳ/huy hiệu đúng thời kỳ, kiến trúc/nhà máy/công trình, tàu/đơn vị/quân phục, thành phố/cảng/đời sống và ảnh minh họa sự kiện. Mỗi tài sản có license, author/credit, nguồn, ID, thời kỳ và vị trí sử dụng. Tài sản bị trùng, sai niên đại hoặc không có nơi hiển thị sẽ không được tính vào mục tiêu.
4. **Âm thanh có nội dung:** nhạc nền theo vùng/thời kỳ/tình huống, âm thanh môi trường thành phố/công nghiệp/chiến trường/biển, UI và hiệu ứng; mỗi track có loop/volume/metadata/license và được nghe kiểm tra. Không thêm tiếng im lặng hoặc audio lặp để đạt dung lượng.
5. **Đa ngôn ngữ và nội dung biên soạn:** tên địa danh/nhân vật, mô tả, sự kiện, tooltip, hướng dẫn và bách khoa trong game phải có nguồn hoặc nhãn do biên tập; text không được sao chép/paraphrase trái điều kiện giấy phép.

**Không được dùng** tệp rỗng, dữ liệu ngẫu nhiên, bản sao trùng, ảnh độ phân giải phóng to giả, âm thanh im lặng hoặc archive padding để chạm 3–4 GB. Không lấy kích thước node_modules, tài liệu phát triển, source code, screenshot QA hay cache build để cộng vào dung lượng sản phẩm.

### 11.5. Quy tắc nén và ngưỡng "Full Offline Ready"

- Nội dung dạng JSON/CSV/văn bản/geometry chưa nén có thể nén mạnh bằng archive (ví dụ Zstandard/Deflate) và mở rộng khi cài. Media đã nén như WebP/JPEG/AVIF, OGG/Opus và video thường không thể thu nhỏ 10 lần mà vẫn giữ nguyên chất lượng; vì vậy không cam kết 3–4 GB thành vài trăm MB khi chưa có đo thực tế.
- Có thể cung cấp **hai lựa chọn người dùng**: "Tải gói dữ liệu nén" (tải ít byte hơn, cần thêm chỗ tạm để giải nén) hoặc "Tải/cài gói đầy đủ" theo nhiều pack. Dù archive nén hay pack trực tiếp, kết quả sau cài phải có footprint và manifest giống nhau về nội dung/phiên bản.
- UI phải có trạng thái kiểm chứng được: `CORE_ONLY`, `DOWNLOADING`, `VERIFYING`, `FULL_OFFLINE_READY`, `MISSING_OR_CORRUPT_PACK`, `UPDATE_REQUIRED`. Chỉ được hiển thị **FULL OFFLINE READY** khi toàn bộ pack bắt buộc đã được tải/cài và hash/version/dependency đều hợp lệ. APK 18 MB không thể tự tuyên bố là bản đầy đủ khi thiếu pack.
- Build/release pipeline phải xuất manifest tổng: phiên bản engine/data/content; tổng compressed bytes; tổng expanded bytes; dung lượng theo pack và theo loại tài sản; số file; orphan/duplicate/missing counts; checksum. Nếu release được gắn nhãn "Full Offline", CI/release audit phải fail khi pack bắt buộc thiếu, checksum sai hoặc coverage/size gate chưa đạt.
- Chưa chốt phân bổ MB từng nhóm. Chỉ lập ngân sách sau khi có inventory thực tế; mọi số liệu dự toán phải có nguồn/tập tài sản đếm được và sample review.

### 11.3. Scope and reviewer disposition

This target is recorded as new finding **R15** in the B7 risk register. It is a future P1 delivery/resource risk for S23b/S23c; it does not alter G0.7/G0.8/G0.9 or the current S1-entry scope. No 3–4 GB content was fabricated, downloaded or committed. No image, audio, historical dataset, pack installer, engine, save schema, workflow or APK was modified/generated for this task.

B7 remains `READY_FOR_REVIEW`. Claude's independent review request must inspect R15 and this owner target at the exact current HEAD. S1 remains `NOT_STARTED` until the independent REVIEW_PASS and owner ACCEPTED conditions are both fulfilled.

## 12. Final B7 revalidation after owner 3–4 GB target — 2026-11-17

This is the latest ChatGPT technical consistency check before independent review; it is **not** an independent REVIEW_PASS or owner ACCEPTED decision.

- **Exact branch HEAD fetched:** `7acd702559f6a51933d49b8b331910a63c8352e1` on `claude/game-historical-sandbox-modes-kg7rj7`.
- **B7 scope compare:** from B7 preparation base `5d92101e56d6f60045f51f25f926b124eaf892ef` to this HEAD, GitHub compare reports 58 commits and exactly eight changed paths: `S0_B7_PACKAGE_SUMMARY_VI.md`, `S0_B7_RESULTS.md`, `S0_B7_REVIEW_REQUEST.md`, `S0_GATE_LEDGER.csv`, `S0_RISK_REGISTER.md`, `S0_SIGNOFF.md`, `AI_COLLABORATION_PROTOCOL.md` and `AI_HANDOFF.md`. All are audit/coordination documentation. No product source, engine, RNG, save implementation/schema, historical data, assets, Android resources, Gradle, test or workflow path changed in this B7 change range.
- **Inherited risk coverage:** all 42 inherited IDs remain present (R1–R14; TC-F1…F7; GD-F1…F6; AS-F1…F7; RM-F1…F5; WD-F1…F3). R3 remains CLOSED only for the baseline APK-hash identification gap. B4-R1 and S0-SEC-01 remain separate. New owner-scope R15 is recorded in addition to those inherited items.
- **P3 completeness:** GD-F5, GD-F6, WD-F1, WD-F2, RM-F5, AS-F5, AS-F6 and AS-F7 each have evidence, impact/interpretation, mitigation, owner, stage and objective exit criteria.
- **New owner target:** R15 and §§11.1–11.5 specify the 3–4 GB meaningful expanded offline content target across core plus packs, not one monolithic APK or a RAM target. The design gives two routes: sideload/GitHub archives (each GitHub release asset under 2 GiB; public release is only a candidate until redirect/resume tests pass) and Google Play AAB/PAD. It requires native long-running downloads, streaming staging extraction, free-space preflight, per-archive/per-file SHA-256, atomic activation/rollback and a dedicated app-private content folder exposed only through WebViewAssetLoader. The UI must distinguish CORE_ONLY/VERIFYING/FULL_OFFLINE_READY; full readiness requires all pack versions/dependencies/hashes. Release checks must reject empty/random/duplicate/padded assets, silent audio, unlicensed/out-of-period files and assets with no actual in-game use. Compression must be measured separately for text/vector data and already-compressed media; no 300 MB-for-4 GB promise is made. S0 baseline payload remains 17,764,559 bytes/592 files. Current boot path statically imports DB/map JSON, decodes the complete grid and loads identity metadata registry as one JSON; this requires pack/data/cache architecture before scaling.
- **Signoff/review consistency:** S0_SIGNOFF P1 table includes R15 as an S23b/S23c risk only. Review Request contains 13 questions; question 13 explicitly challenges delivery/size/compression/hash/storage/rollback/WebView and real-content acceptance. The independent reviewer is Claude Code; DeepSeek is allowed only as an owner-assigned independent fallback. Historical B3 review records remain unchanged.
- **Gate states are unchanged:** G0.1–G0.6 proposed PASS on bounded evidence; G0.7 BLOCKED; G0.8 PARTIAL; full-S0 G0.9 BLOCKED. R7 remains an open P0; R14/C3 remain BLOCKED. B4 and B7 remain READY_FOR_REVIEW. Overall S0 remains PARTIAL/BLOCKED.
- **APK workflow incident:** 21 automatic APK workflow runs from document pushes remain recorded in §§9–10 (20 success, 1 failure, 0 in progress). No new `android-apk.yml` push run was observed after the 09:16 UTC `[skip ci]` containment point. Workflow blob remains unchanged; no APK was downloaded/installed on iQOO and R14 remains unverified.
- **B4 evidence remains separate:** run `44041104723`, tested SHA `d2ae88e557e9895413462c5b069886bfc606adc7`, 6/6 suites and 70/70 tests, no APK artifacts.
- **Disposition:** B7 is `READY_FOR_REVIEW`. Claude must re-fetch and review the exact latest HEAD after this report update. The owner must then separately record `ACCEPTED` or rejection. S1 remains `NOT_STARTED`; R15 does not authorize S23b or expand S1.

No image, video, audio, historical dataset, asset pack, gameplay or product code was created or changed for this target. No product test/build or APK generation was intentionally run.
