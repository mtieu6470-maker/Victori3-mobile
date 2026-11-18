# Đề xuất kiến trúc — UI Mobile, Content Packs Offline và Release QA (S23a–S23c)

**Dự án:** Currents of History / Victori3 Mobile  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch:** claude/game-historical-sandbox-modes-kg7rj7  
**Ngày:** 18/11/2026  
**Code baseline:** e4924ca48264f8d0818eface51a28a87cd363b89  
**Roadmap:** S23a/S23b/S23c, theo owner-approved roadmap v3.2/v3.3  
**Trạng thái:** DESIGN_PROPOSAL_ONLY / PRE-S1 / NO_RUNTIME_AUTHORIZATION

> Đây là thiết kế trước triển khai. Không mở S1/S23, không sửa code/UI/assets/Android/Gradle/workflows/signing/save schema và không build APK. Các yêu cầu device QA chỉ là kế hoạch; không phải bằng chứng đã kiểm thử trên thiết bị.

---

## 1. Mục tiêu và nguyên tắc

S23 là giai đoạn tích hợp, hoàn thiện content packs và kiểm tra phát hành; không phải thời điểm đầu tiên game có UI cho các hệ thống. Mỗi giai đoạn S3–S22 khi bổ sung tính năng phải cung cấp ngay giao diện ngữ cảnh tối thiểu đủ để người chơi quan sát, hiểu và điều khiển tính năng đó.

S23 cần đạt:
- giao diện nhất quán giữa landscape và portrait, điều hướng xuyên hệ thống rõ ràng;
- mọi hành động UI đi qua command/domain API; UI không tự tính hoặc sửa luật mô phỏng;
- thông tin nguồn, độ tin cậy, ước lượng và unknown được thể hiện đúng;
- content packs theo vùng/thời kỳ/loại nội dung, có provenance và license;
- game chạy offline không cần tải nội dung ngoài hoặc truy cập mạng;
- người dùng chủ động bật mạng và chọn pack trước khi tải/cập nhật;
- pack có manifest, kiểm tra hash/signature, quản lý dung lượng, resume, rollback và compatibility;
- Android QA chứng minh được khởi động, lưu/tải, lifecycle, bộ nhớ, nhiệt, pin, WebView, cảm ứng và phiên dài;
- không phát hành APK thay đổi chữ ký khi chưa xử lý R14/C3 và các gate được owner phê duyệt.

### 1.1. Những điều không được làm

- Không trì hoãn contextual UI của S6/S7/S10/S15/S17/S20… đến S23.
- Không biến giao diện mới thành một bộ dashboard chỉ số không có hành động thật.
- Không cho UI chứa công thức mô phỏng, AI decision hoặc rule enforcement.
- Không tự tải asset/content pack qua mạng khi người dùng chưa bật tính năng online.
- Không cho content pack mang JavaScript, WebAssembly, HTML thực thi, command script hay arbitrary effect payload.
- Không coi SHA-256 đơn lẻ là xác thực nguồn phát hành; hash kiểm tra integrity, chữ ký hoặc trust policy mới kiểm tra authenticity.
- Không xóa/bỏ qua pack cũ trước khi pack mới được xác minh và kích hoạt thành công.
- Không giả định IndexedDB được Android Auto Backup hoặc file download bảo vệ đầy đủ.
- Không tự sửa Android signing/workflow hoặc tăng versionCode trong S23 khi chưa có scope/gate riêng.
- Không đánh đồng Node/Desktop benchmark với kết quả iQOO/Android thực tế.

---

## 2. Hiện trạng đã kiểm tra

Baseline nguồn dùng cho khảo sát là e4924ca48264f8d0818eface51a28a87cd363b89.

### 2.1. Application shell và navigation

src/ui/App.tsx:
- App là map-first shell: bản đồ chiến lược chiếm nền; màn hình/module mở trong panel/frame.
- Landscape dùng rail module bên trái; portrait dùng dock dưới.
- Portrait có sheet snap ba mức; landscape có main panel và side detail panel.
- Danh sách module hiện có country, economy, society, politics, tech, diplomacy, military, chronicle, world, system.
- App dùng screen IDs/tab IDs và state store trong UI layer.
- Viewport được đo bằng window.innerWidth/innerHeight; orientation được suy ra từ width/height.

src/ui/main.tsx:
- Boot tải generated database/map, map grid/vector/raster và fonts trước khi render.
- URL parameters hỗ trợ reproducible QA state và fast-forward.
- QA hook được expose khi boot với QA parameters.
- PWA service worker đăng ký ở web https; nhánh Capacitor không đăng ký service worker.

Điểm cần giữ:
- Một domain screen không được có hai nguồn điều khiển khác nhau cho landscape/portrait.
- Các screen phải hỗ trợ drill-down từ map → Region → Settlement → authority/site/unit khi những hệ thống đó được triển khai.
- Panel/sheet không che các hành động cốt lõi hoặc làm người chơi mất vị trí bản đồ.
- Các màn hình dài cần virtualization/windowing và giới hạn DOM nodes.

### 2.2. Save/load và local storage

src/ui/game/storage.ts:
- Save slots lưu JSON trong IndexedDB database dong-chay-lich-su, object store saves, version 1.
- Comment cho biết save có thể nhiều MB và IndexedDB dùng offline.

src/ui/App.tsx:
- Auto-save chạy vào tháng 1 hằng năm, thông qua saveSlot('Tự động lưu', game.save()).
- Lỗi IndexedDB chỉ tạo toast; hiện chưa có UI health/backup state chuyên biệt.

src/ui/screens/World.tsx:
- Save nhanh/lưu mới/tải dùng IndexedDB.
- Export file dùng Blob + object URL + anchor download.
- Import dùng file input và File.text().
- Đây là chức năng cần xác minh trên WebView Android trước khi dùng làm bằng chứng backup an toàn. Không khẳng định export/import đã chạy được trên mọi thiết bị.
- Không được cài APK khác chữ ký hoặc thực hiện bước C3 trước khi baseline save được sao lưu/restore thật sự theo gate R14.

### 2.3. Content pack hiện tại

src/ui/game/content.ts:
- ContentPack version 1 có assets/entities/characters, generated timestamp và licence note.
- Assets hỗ trợ flag/coat_of_arms/portrait, entity/character IDs, period, quality, path, dimensions/bytes, license, license URL, author/credit/source/file/statement/date/description.
- Text có ngôn ngữ, truncation, article/url/revid/retrieved/license/author.
- Content được fetch lazily từ content/registry.json sau khi game bắt đầu.
- Simulation không phụ thuộc content; khi pack thiếu thì UI fallback generated emblem/monogram.
- Content map được tạo trong memory; chưa thấy nhiều pack/dependency graph/staged install/resumable update/atomic activation trong loader.

src/ui/screens/World.tsx:
- Content Credits cho thấy counts của flags/arms/portraits/entities/characters và provenance/attribution.
- Đây là foundation tốt để mở rộng sang region/period/topic packs; cần giữ nguyên khả năng chạy game khi pack vắng hoặc hỏng.

### 2.4. Map và rendering

src/ui/map/mapData.ts:
- Grid raster được decode vào Uint16Array; region index tra cứu theo cell.
src/ui/map/MapView.tsx:
- WebGL fill layer và 2D overlay canvas; interaction pan/pinch/tap/zoom; renderer được giữ qua refs.
- Render loop dùng requestAnimationFrame, camera/label/path caches.
- Cần kiểm tra WebGL context loss/restore, canvas recreation, texture lifetime và memory sau nhiều lần đổi screen/orientation.
- Không vẽ từng BuildingSite/Unit/Settlement ở world zoom; phải có LOD/clustering/culling.

### 2.5. Android và build baseline

android/app/src/main/AndroidManifest.xml:
- MainActivity cấu hình xử lý orientation/configChanges, FileProvider hiện diện, INTERNET permission có trong manifest.
- INTERNET permission không đồng nghĩa app được tự ý truy cập mạng; chính sách online/offline phải được áp ở app/content layer.
- allowBackup hiện true; cần audit thực tế dữ liệu save nằm trong IndexedDB/WebView và hành vi Android backup/restore, không suy luận rằng bản lưu IndexedDB chắc chắn được backup.

android/app/build.gradle:
- applicationId hiện là vn.dongchaylichsu.game, versionCode 1/versionName 1.0 tại baseline khảo sát.
- Không thay đổi package ID/versionCode chỉ bằng tài liệu S23; các thay đổi phát hành phải có decision/scope riêng.

capacitor.config.ts:
- WebDir là dist; build web bundle được package vào APK.
- Source comment mô tả offline build và không cần network runtime.

.github/workflows/android-apk.yml:
- Push trigger trên mọi branch và workflow_dispatch.
- Workflow chạy npm ci, npm run build, test, Capacitor sync, Gradle assembleDebug, artifact/evidence.
- Các commit docs trước đây dùng [skip ci] để tránh tự động chạy broad APK workflow.
- Không sửa workflow hoặc cố ý trigger APK build trong S23 pre-design; push authorized doc commits vẫn giữ [skip ci].

---

## 3. S23a — Tích hợp và hoàn thiện UI

### 3.1. Navigation model

Duy trì một navigation graph có cùng screen identity trên cả orientation:
- World Map / Strategic Overview;
- Country/Polity;
- Region/AdministrativeUnit;
- Settlement;
- Economy/Market/Trade;
- Society/Population;
- Government/Institutions/Characters;
- Technology;
- Diplomacy/Crises/Treaties;
- Military/Forces/Operations;
- Chronicle/Events/Calibration;
- System/Save/Content Packs/Settings.

Đây là nhóm chức năng, không bắt buộc mọi screen phải xuất hiện cùng lúc trong dock. Navigation có ba lớp:
1. Primary modules — các nhóm người chơi dùng thường xuyên.
2. Contextual drill-down — đi sâu từ đối tượng hiện tại, giữ context và breadcrumb.
3. System/tools — save, content, diagnostics, settings, credits.

Mỗi screen phải có:
- stable screen ID;
- title/icon/localization key;
- contextual entity references;
- tab/sub-route definitions;
- entry/exit behavior;
- query/view-model data source;
- allowed commands;
- empty/loading/error/unsupported states.

Không để module UI đọc/ghi global GameState tùy tiện hoặc nhân bản domain rule.

### 3.2. Landscape-first và portrait riêng

Landscape:
- map remains visible whenever useful;
- primary rail bên trái;
- main panel kích thước giới hạn, không che toàn bộ map;
- side detail panel khi viewport đủ rộng;
- multi-column/table/charts có thể hiển thị đồng thời;
- window collapse/expand không làm mất screen context.

Portrait:
- dedicated bottom navigation/dock;
- contextual bottom sheet có snap levels và safe areas;
- mỗi panel có hierarchy đơn cột, không ép table desktop thu nhỏ;
- dữ liệu hàng ngang phải chuyển sang card/label-value rows;
- action quan trọng giữ ở vùng dễ chạm;
- back gesture/button ưu tiên đóng sheet/detail trước khi thoát screen/map;
- không để keyboard che input/decision actions.

Orientation change:
- giữ screen/tab/entity selection/camera/scroll state;
- chuyển đổi layout không tạo domain command;
- không reset campaign hoặc reload content;
- renderer/canvas phải resize/recreate an toàn.

### 3.3. Cross-system navigation and provenance

Ví dụ drill-down:
- POP cohort → occupation → BuildingSite/employer (khi S12 có thật) → market goods → local transport access.
- Settlement → local authority → public services → institution/office.
- Diplomatic crisis → actor → treaty/obligations → war participants → military objectives.
- Battle → formation/commander → supply line → depot/market.
- Historical event → event sources → benchmark → divergence diagnostic.

Mọi historical/estimated/unknown field cần hiển thị:
- quality/status;
- source list/citation link nếu có;
- date validity;
- estimate/method/range;
- population/geographic scope;
- unresolved alternatives.

Không hiển thị số giả precision (ví dụ 2 chữ số thập phân) khi source chỉ cho biết khoảng hoặc qualitative evidence.

### 3.4. UI architecture and command boundary

- UI components chỉ render view models/selectors.
- Người chơi action gọi Command API/domain service; validation/authorization nằm trong engine/domain layer.
- AI và UI dùng cùng command validation; UI không tự sửa giá, luật, owner, unit, inventory hoặc tick.
- Selector phải pure/memoized và có invalidation theo simulation tick/relevant state version.
- View models không serialize vào save trừ khi có lý do được duyệt.
- Long lists (characters, sites, units, sources, logs) phải virtualize/window.
- Large charts/tables chỉ load khi screen mở; cleanup listeners/canvas/object URLs khi đóng.

### 3.5. Accessibility and internationalization

- Touch targets đủ lớn, spacing rõ; không dùng màu duy nhất để phân biệt status.
- Hỗ trợ keyboard navigation cho web/desktop QA và screen reader labels cho Android TalkBack.
- Reduced motion, contrast và text scaling.
- Text không hard-code chiều rộng; hỗ trợ tiếng Việt/Anh và các hệ chữ Latin mở rộng, Cyrillic, Arabic, CJK, Indic và script cần thiết theo dữ liệu game.
- Font fallback theo script; không nhúng một font khổng lồ nếu subset/locale fallback giảm bundle tốt hơn.
- Localized numerals/date/units phải nhất quán; canonical units không phụ thuộc locale.
- UI phải thể hiện right-to-left text khi cần, không đảo layout toàn game một cách sai lệch.

### 3.6. Renderer/lifecycle resilience

- Detect WebGL context lost/restored; pause render work trong lúc context invalid.
- Rebuild renderer resources/textures/buffers deterministically; preserve camera/selection/lens.
- Canvas resize theo devicePixelRatio có upper bound; không tự tăng độ phân giải vô hạn.
- Cancel requestAnimationFrame, observers, event listeners và timers khi unmount/recreate.
- Image decode dùng async path có cancellation/priority; không decode mọi portrait trên app start.
- Memory cache có LRU/size budget theo decoded bytes, không chỉ count.
- Khi renderer không thể phục hồi, fallback map/overlay degraded mode có thể hiểu được; không crash app hoặc làm hỏng campaign.

### 3.7. S23a acceptance

- Mỗi module có primary/context route trên landscape và portrait.
- Screen transitions không mutate GameState và không thay tick.
- Player/AI commands qua cùng validation path.
- Chuyển orientation không mất state hoặc tạo duplicate listener.
- Table/list virtualization không tạo hàng nghìn DOM nodes.
- Contextual links không trỏ đến stale IDs sau load/migration.
- Provenance/quality/uncertainty hiển thị rõ ở các screen có dữ liệu lịch sử.
- WebGL context loss/recreate không crash và giữ camera/selection.
- Không có sustained event listener/heap growth sau repeated open/close.
- UI test coverage gồm viewport nhỏ, bàn phím, text scale, TalkBack labels và landscape/portrait.

---

## 4. S23b — Content Packs Offline và Asset Delivery

### 4.1. Tách Simulation Data và Presentation Content

**Simulation/static game data**
- Historical DB, rules, unit/production definitions, benchmark definitions và data build hash.
- Versioned cùng engine/schema compatibility.
- Không được cập nhật âm thầm từ một content pack hiển thị.

**Presentation content**
- flags, coats of arms, portraits, city/building/society/military/event illustrations, maps/overlays, audio/subtitle nếu tương lai có.
- Có manifest/license/provenance/period/entity/locale metadata.
- Có thể thiếu mà game vẫn chạy với placeholder.
- Không chứa executable code, script, arbitrary effects, HTML hoặc module imports.

Content pack không được thay đổi luật mô phỏng hoặc state save.

### 4.2. Pack taxonomy

Đề xuất các pack class:
- Core identity pack — asset nhỏ, cần thiết cho nhận dạng UI cơ bản; có fallback.
- Regional pack — assets theo geography/region.
- Period pack — assets theo giai đoạn 1836–1936.
- Character pack — portraits/biographies có provenance.
- Environment/city pack — settlement/building/landscape visuals.
- Military pack — unit/ship/fortification illustrations.
- Events/history pack — event images/chronicle illustrations.
- Locale pack — text, typography metadata, translation resources.

Pack class là metadata; một pack có thể chứa nhiều asset types nhưng không nên trùng lặp file giữa các packs nếu có thể dùng shared asset references.

### 4.3. Manifest schema

Mỗi pack cần manifest machine-readable có tối thiểu:
- pack_id, pack_version, manifest_schema_version;
- content_schema_version;
- min_engine_version, max_engine_version hoặc compatibility range;
- base_pack_requirements/dependency pack IDs and versions;
- region_ids, period_range, asset_types, locales;
- compressed_size, uncompressed_size, file_count;
- per-file relative path, size, MIME/type, dimensions, SHA-256;
- total pack SHA-256 or Merkle/hash tree;
- license_id, author, source, credit, license URL, attribution statement;
- pack creation/version metadata and release channel;
- signature metadata and signing key ID;
- update predecessor/minimum version where rollback policy requires.

Manifest phải có canonical serialization khi tính chữ ký/hash. Không được ký JSON không canonical rồi serialize lại khác thứ tự key.

### 4.4. Integrity and authenticity

Phải phân biệt:
- file SHA-256: kiểm tra file có bị hỏng/thay đổi so với manifest;
- manifest signature: xác thực manifest do publisher được trust ký;
- HTTPS: bảo vệ kênh truyền nhưng không thay thế kiểm tra signature;
- content license: quyền sử dụng/redistribute, không phải security property.

Client:
1. có pinned public key/trust root trong app release;
2. xác minh signature trước khi tin metadata/URLs;
3. verify manifest schema, compatibility, per-file hash/size;
4. kiểm tra duplicate/path traversal/absolute path/symlink;
5. enforce maximum file count, per-file size, total uncompressed size, compression ratio, image dimensions và pixel count;
6. reject unknown content types/executable files;
7. giữ sandbox storage và không đưa pack path vào dynamic import/code execution.

SHA-256 đơn thuần không chứng minh pack do publisher tin cậy phát hành.

### 4.5. Multi-pack registry and deterministic merge

Pack manager duy trì:
- installed packs and versions;
- available packs (chỉ khi user đã bật online check);
- dependency graph;
- compatibility status;
- source and trust status;
- storage size and last validation result;
- attribution/license summary.

Asset resolution:
- stable asset_id;
- deterministic pack priority/override rule;
- exact temporal validity first;
- quality/locale resolution explicit;
- no arbitrary “last downloaded wins” behavior;
- if duplicate ID with conflict, reject or require explicit override policy in manifest.

Optional pack unavailable/invalid:
- use generated placeholder;
- retain the underlying simulation entity;
- expose an explanatory status and pack install action;
- never block New Game/Load/Simulation.

### 4.6. Offline-first and network consent

Default behavior:
- New Game, simulation, save/load, core UI and installed content work without network.
- No silent pack download, analytics, external image requests or background update check.
- Online mode is explicit user action in Settings/Content Packs.
- User chooses pack and sees total download size, uncompressed size, compatibility, license and publisher before download.
- On metered/cellular network require explicit confirmation; allow Wi-Fi-only policy.
- User can revoke online mode; core gameplay continues offline.
- Download failure never disables installed pack or saves.

Nếu project owner chọn background update feature sau này, cần quyết định riêng và settings hiển thị rõ; không mặc định trong thiết kế này.

### 4.7. Resume, staging, atomic activation and rollback

Update workflow:
1. Fetch signed index/manifest only after user action.
2. Validate publisher signature and pack compatibility.
3. Check free storage against compressed + uncompressed + temporary staging + safety margin.
4. Download to temporary staging area, with chunk/resume metadata.
5. Resume must verify existing chunk hashes or restart invalid chunk; do not append blindly.
6. Verify total size, per-file hashes, pack hash/signature and file type/dimensions.
7. Validate dependencies and license metadata.
8. Build registry index in staging and run consistency checks.
9. Atomically switch active-pack pointer/version only after every check passes.
10. Keep previous verified pack until new pack has been opened/used successfully or rollback window has expired.
11. If activation fails, restore previous registry/index; never leave half-updated pack state.

Atomic activation means registry resolution cannot observe a mixture of old and new file contents for the same pack version.

### 4.8. Storage, cache and image decode

Track:
- compressed bytes on disk;
- uncompressed bytes;
- temporary/resumable bytes;
- decoded texture/image bytes;
- in-memory metadata/index size;
- free storage headroom.

Decoded asset cache:
- LRU by estimated decoded bytes and priority;
- dispose GPU textures on eviction;
- avoid holding raw ImageBitmap/HTMLImageElement after unmount;
- only load assets for current visible screen/map zoom/period;
- thumbnails at list level, full-resolution only for detail/lightbox;
- dimension/format limits; prefer variants sized to display needs;
- image decode off critical UI path; cancellation for stale screens;
- graceful fallback when WebGL/GPU memory allocation fails.

Map and simulation data are separate from decorative image packs. A failed image pack cannot break map topology or game state.

### 4.9. License/provenance model

Every redistributable asset needs:
- creator/author;
- exact source and source page/file;
- license name/version and license URL;
- required attribution text;
- attribution placement/format;
- derivative/modified/cropped status;
- date retrieved/accessed;
- temporal validity/entity association;
- license verification state.

A citation URL is not itself a license. unknown license status must block shipping in a released pack unless the owner explicitly approves a documented exception under current licensing gates. Do not silently repackage or modify existing uncertain assets.

---

## 5. S23c — Release QA và Android Device Matrix

### 5.1. Device profile matrix

Define representative device groups:
- target high-performance device (owner's iQOO test device, when physical test is authorized);
- mid-range 6–8 GB RAM Android device;
- lower-end supported RAM/device profile;
- minimum supported Android/WebView version from owner-approved K decision;
- modern Android/WebView version;
- small portrait/large portrait and landscape tablet/phone dimensions where available.

Record exact:
- device/model/SOC/RAM;
- Android version/security patch;
- System WebView package/version;
- app package/versionCode/versionName;
- build commit SHA and artifact SHA-256;
- install/update path and signing certificate fingerprint;
- screen resolution/density;
- free storage;
- network state;
- ambient/thermal conditions only if real measurements exist.

Never infer WebView version from Android version.

### 5.2. Functional QA matrix

Minimum scenarios:
- cold start first install, warm start and relaunch;
- offline first launch, new game and simulation;
- Historical and Sandbox initialization with same seed baseline;
- portrait → landscape → portrait with open panel/sheet/detail;
- screen/tab/context navigation and map drill-down;
- WebGL context loss and restore;
- background/foreground, orientation change, process death and OS memory reclaim;
- save quick/new slot/overwrite/list/load/delete;
- export file then verify actual file exists and hash is correct;
- import exact file and continue simulation from expected date/state;
- corrupt/unsupported save rejection without source overwrite;
- content pack missing/invalid/old/incompatible;
- pack partial download, resume, cancellation, integrity failure, activation rollback;
- no network permission interaction beyond user action;
- 60-minute continuous session with fast-forward/pause/zoom/pan/open-close screens;
- rapid repeated screen open/close and list scrolling;
- no crash/ANR, no progressive unbounded heap/native/GPU resource growth.

### 5.3. Lifecycle and save safety

- Test autosave while foregrounded and when app is backgrounded; don't assume timer callbacks run during process death.
- Define crash recovery using atomic save writes/checkpoints/backup retention; avoid overwriting last valid save before new serialization validates.
- Export/import test on physical Android WebView is mandatory for R14; file picker/download route must be proven.
- IndexedDB persistence/quota/eviction/private browsing behavior must be verified on actual target WebView.
- Test storage full/quota exceeded/transaction abort/upgrade blocked/corrupt DB.
- A restore test must compare campaign date, RNG state, all relevant GameState fields and deterministic continuation; file existence alone is not enough.
- If local IndexedDB cannot be safely exported, block a different-signature APK update until owner approves alternate backup path.

### 5.4. Performance and stability budgets

S23c budget is specified and measured, not assumed:
- cold start and warm start p50/p95;
- time to first interactive UI;
- screen open/render time by module;
- monthly tick p50/p95/p99 under several world scales/seeds;
- WebView JS heap and native process PSS over 60 minutes;
- peak decoded image/texture memory;
- map draw calls/visible labels/objects by zoom;
- save serialize/write/load/import/export time and size;
- thermal throttling, CPU frequency, battery drain during long session (only measured on device);
- GC pause/jank/frame-time p50/p95/p99;
- content pack download/unpack/hash/activation duration (when network QA authorized).

Do not define a pass threshold only after observing poor results. Pre-register thresholds per device tier and record blocked/unsupported metrics honestly. Node/desktop CI is not evidence of Android battery, thermal, WebView memory or ANR.

### 5.5. APK/AAB and release identity

At baseline:
- package ID is vn.dongchaylichsu.game;
- versionCode is fixed at 1;
- debug APK workflow uses Gradle auto-generated debug key;
- signing/release identity and C3 remain restricted by S0 gate.

Therefore:
- S23 does not independently change package ID, versionCode, signing key, keystore or GitHub Secrets.
- Debug APK and release APK/AAB are different distribution classes; define release signing workflow separately and only after owner authorization.
- VersionCode must increase monotonically for every distributable update; decision to change it requires a dedicated authorized implementation scope.
- A signed update must be tested over the installed baseline with backup/restore plan and matching signature; do not make the user uninstall and lose IndexedDB.
- Artifact provenance must include commit SHA, toolchain, app ID/version, certificate fingerprint, APK/AAB hash and test report.
- No APK/AAB is called release-ready without actual device QA and owner acceptance.

---

## 6. Security and privacy requirements

- No executable content packs; only whitelisted data/media MIME types.
- Pack paths canonicalized; reject traversal, absolute paths, symlink escape and duplicate normalized paths.
- Enforce archive/decompression limits and image dimension/pixel limits to prevent zip bombs/decompression bombs.
- Verify manifest signature before download/install; verify every file after transfer.
- Updates are opt-in, visible, cancellable and rollback-safe.
- Core simulation does not make network calls.
- External URLs open only on user action and show destination clearly.
- No analytics/telemetry transmission unless owner-approved, user-visible and explicitly consented.
- Save files and local campaign data remain on-device by default; never include save content in diagnostics/telemetry.
- Content packs cannot alter engine rules/commands or inject HTML/JS.
- Keep app INTERNET permission policy aligned with offline-first behavior; permission presence itself is not consent to use network.

---

## 7. Implementation sequence and dependencies

S23a/S23b/S23c are future phases. Proposed order:

1. Precondition audit: verify all S0/S1 and preceding phase gates, current UI contracts and data IDs.
2. S23a-A navigation/view-model contract: stable screen registry, contextual route/selection state, pure selectors.
3. S23a-B responsive integration: landscape panels, dedicated portrait sheets, cross-system drill-down, virtualization.
4. S23a-C lifecycle/accessibility: orientation, WebGL restore, input/focus, TalkBack/reduced motion/script fallback.
5. S23b-A pack manifest/registry: schema, signature/trust, license/provenance and deterministic asset resolution.
6. S23b-B local pack storage: install/uninstall/list/compatibility and no-network fallback.
7. S23b-C optional downloader: user-opted online mode, resume, verification, staging, atomic activation and rollback.
8. S23b-D cache/LOD: image decode, texture cache, pack budgets and attribution UI.
9. S23c-A QA harness and device matrix: scripted QA routes, baseline recordings, logs and evidence bundle.
10. S23c-B lifecycle/save/content QA: 60-minute tests, R14 export/import, process death, corrupted DB, pack failure.
11. S23c-C release artifact policy: only after separate owner approval of signing/versionCode/distribution path.

Each slice needs explicit owner authorization, exact base SHA, changed files, tests, CI/device evidence and independent review. S23 must not bundle app redesign, content redistribution, data migration and signing into one large release patch.

---

## 8. Acceptance criteria

### S23a
- Landscape and portrait expose the same capabilities with layout adapted appropriately.
- UI state survives orientation and WebGL context restoration.
- All mutations go through domain Command API; UI contains no simulation rule.
- Each completed phase's system has contextual UI before S23a.
- Deep links retain entity/tick/context and handle stale/missing IDs safely.
- Source quality/license/uncertainty are visible.
- Virtualized lists and map LOD meet measured RAM/render budgets.
- Accessibility/localization checks cover text scaling, scripts, RTL and TalkBack.

### S23b
- Offline new game/simulation/save/load works without network.
- Missing content pack falls back to placeholder and does not block gameplay.
- Manifest signature, pack compatibility and per-file SHA-256 verified before activation.
- Multi-pack resolver is deterministic; conflicts fail safely.
- Installer handles partial download/resume/cancel/storage full/corrupt archive.
- Activation atomic; failed update restores prior valid pack.
- License/provenance present for every shipped asset; unverified items gated.
- No content pack executes code or changes simulation data.
- Pack/cache image decode stays within budgets on target device.

### S23c
- Device matrix contains exact OS/WebView/build versions.
- 60-minute session has no crash/ANR and no continuous memory growth beyond approved budget.
- WebGL context loss/recovery verified.
- Save/load/export/import and deterministic continuation verified on physical target.
- Process death/background/foreground/IndexedDB quota/corrupt DB scenarios covered.
- Battery/thermal/memory figures measured on real devices, not estimated.
- APK/AAB app identity/signature/version/artifact hashes independently verifiable.
- No install/update flow sacrifices user save without approved backup/restore.

---

## 9. Open decisions

1. Which packs are included in base APK versus optional downloadable packs, with size budgets by device tier?
2. Is pack manifest signing owned by an offline release key with a pinned public key in app? Define key rotation/revocation.
3. What is the canonical pack/index format, compression format and resume chunk size?
4. Where are packs stored within app-private storage and how are Android backup/restore rules applied?
5. Which locales/scripts ship in base app and which use optional locale packs?
6. Which content classes have hard offline requirement versus optional visual enhancement?
7. What image resolutions/variants are needed per viewport/zoom and how large may decoded cache be?
8. What are cold-start, screen open, tick p95/p99, memory and 60-minute growth thresholds per device tier?
9. How will WebView minimum version and Android API support be verified over time?
10. What is the release identity/package/version/signing strategy? This requires a separate owner decision and is not approved by this proposal.
11. What exact R14 backup/restore evidence is required before replacing the installed baseline?
12. Does S23b allow manual pack sideload/import, or only signed packs from an online catalog? Either path must retain signature/compatibility checks.

Any normative roadmap changes or release signing decisions require explicit owner decision trace.

---

## 10. Review and gate boundary

Claude independent no-write review should assess:
- fit with current UI shell/map renderer/content loader;
- landscape/portrait accessibility and state preservation;
- UI/domain command separation;
- offline-first and no-silent-network guarantees;
- signed manifest/authenticity vs simple checksums;
- safe multi-pack merge/update/resume/rollback;
- content provenance/licensing and asset cache;
- IndexedDB/Android lifecycle/save export/import and R14;
- device QA matrix and performance budgets;
- no unauthorized signing/workflow/Android modifications.

A REVIEW_PASS applies only to this document. It does not satisfy S0-B7 review/owner acceptance and does not open S1/S23 or authorize UI/content/Android/workflow/signing/APK implementation.

**Kết luận:** S23 hoàn thiện giao diện theo cùng một hệ navigation, đưa content packs offline vào quy trình an toàn có xác thực và rollback, rồi chứng minh ứng dụng ổn định trên Android bằng kiểm thử thật. Không có bước nào được coi là đạt chỉ vì build APK thành công trên CI.
