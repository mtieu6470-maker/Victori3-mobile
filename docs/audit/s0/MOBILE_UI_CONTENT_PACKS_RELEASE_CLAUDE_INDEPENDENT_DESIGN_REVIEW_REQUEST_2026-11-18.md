# S23a–S23c Mobile UI, Offline Content Packs and Release QA — Claude Independent Design Review

**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** NONE

## 1. Exact review target

- **Design document:** docs/spec/MOBILE_UI_CONTENT_PACKS_RELEASE_ARCHITECTURE_PROPOSAL_VI.md
- **Design commit:** e3a983b16717b18c755d74a1747e36e12ab27637
- **Code baseline:** e4924ca48264f8d0818eface51a28a87cd363b89
- **Normative roadmap:** docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md with owner-approved v3.3 amendments.
- **Relevant current implementation:** src/ui/App.tsx; src/ui/main.tsx; src/ui/game/content.ts; src/ui/game/storage.ts; src/ui/screens/World.tsx; src/ui/map/MapView.tsx; src/ui/map/mapData.ts; src/ui/styles/theme.css; android/app/src/main/AndroidManifest.xml; android/app/build.gradle; capacitor.config.ts; .github/workflows/android-apk.yml.
- **Gate dependency:** S0-B7 review and owner acceptance; S1 and S23 remain NOT_STARTED.

Fetch exact latest branch HEAD before review and verify the target file blob/commit.

## 2. Independence and no-write

Claude must not have authored or modified the target design. This is a no-write review:
- Do not edit the target or any related repository file.
- Do not change source/UI/content/assets/Android/Gradle/workflows/signing/secrets/save schema.
- Do not create branches, commits, fixes or PRs.
- Do not run build/APK or install anything.
- Do not request or modify signing credentials.
- Do not treat this design review as S23 or S1 authorization.

If changes are required, return CHANGES_REQUESTED with exact section/line locators.

## 3. Required technical review

### A. Baseline characterization
Verify that the design correctly describes:
- map-first App shell with landscape rail and portrait dock/sheets;
- current indexed screen/tab/navigation identity and viewport switching;
- boot process and QA query hooks;
- content pack v1 lazy fetch from content/registry.json, separate from simulation;
- current asset/text/character provenance fields and fallback placeholders;
- IndexedDB save slots, yearly autosave, Blob/anchor export and file-input import;
- WebGL + 2D overlay map renderer and requestAnimationFrame lifecycle;
- Android INTERNET permission, FileProvider, allowBackup and current Capacitor offline packaging comment;
- package ID/versionCode/debug signing and broad push-triggered APK workflow;
- existing S0 R14/C3 and signing gates.

Identify any inaccurate or missing characterization.

### B. S23a responsive UI/navigation
- Is one stable navigation identity across landscape/portrait sufficient?
- Are map context, entity references, breadcrumbs and tab state preserved through orientation?
- Is the dedicated portrait sheet model suitable, without reducing it to a scaled-down desktop layout?
- Are UI/domain command boundaries and pure selector contracts clear?
- Is contextual screen delivery per feature phase adequately protected?
- Are list virtualization, source-quality display, localization/accessibility, TalkBack/reduced motion and right-to-left scripts covered?
- Are WebGL context loss, canvas resize, listener cleanup, image decode cancellation and texture disposal sufficiently specified?

### C. S23b pack architecture/security
- Is simulation data correctly separated from presentation content?
- Is pack taxonomy/dependency/compatibility model implementable and deterministic?
- Does the proposal distinguish SHA-256 integrity from publisher authenticity?
- Is manifest signature verification, trust root/key rotation and canonical serialization specified enough?
- Are path traversal, symlink, decompression bomb, oversized file/image, duplicate path/ID and unknown MIME cases addressed?
- Is offline-first/no-network-until-explicit-action enforceable?
- Are staged download, verified resume, free-space preflight, atomic activation and rollback safe?
- Can multiple packs resolve IDs deterministically without last-download-wins conflicts?
- Are license/provenance and unverified asset blockers sufficient?
- Are memory/cache budgets expressed in decoded bytes and GPU resource lifetime?

### D. S23c Android QA and release
- Does the device matrix distinguish Android OS from actual System WebView package/version?
- Are lifecycle/process death/IndexedDB persistence/quotas/corruption scenarios sufficient?
- Is R14 export/import proof correctly treated as a hard precondition for signing transition?
- Are 60-minute memory growth, ANR/crash, WebGL recovery, battery/thermal and p95/p99 metrics measured on physical devices rather than inferred from desktop/CI?
- Are versionCode/package/signature/distribution and APK/AAB decisions correctly separated from this proposal?
- Does the document avoid silently authorizing workflow/signing/secret changes despite current push-triggered APK workflow?

### E. Privacy and offline guarantees
- Can simulation, save/load and installed content operate without network?
- Are optional updates explicitly user-triggered and cancellable?
- Does the proposal prohibit telemetry/save upload unless separately authorized and consented?
- Are external asset/URL requests blocked unless explicitly user initiated?
- Can invalid or missing packs never prevent playing/loading a campaign?

### F. Performance and acceptance criteria
Assess screen open time, map object counts by zoom, WebView RAM, decoded asset memory, pack size, extraction/download time, save size and 60-minute Android stability. Check that pass thresholds are fixed before testing rather than chosen after observing results.

## 4. Required verdict

Return exactly one:
- REVIEW_PASS
- CHANGES_REQUESTED
- BLOCKED

Include:
1. exact reviewed branch HEAD and target blob;
2. verdict and rationale;
3. P0/P1/P2/P3 findings with section/line locator, evidence, consequence and required correction;
4. non-blocking recommendations separately;
5. explicit confirmation that no files were modified and no builds/devices were used.

## 5. Gate boundary

A REVIEW_PASS applies only to this design proposal. It does not satisfy S0-B7 review/owner acceptance, does not open S1/S23, and does not authorize UI/content/Android/Gradle/workflow/signing/save/test/APK implementation. Device evidence and owner decisions remain separate requirements.
