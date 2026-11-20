# APK-FIRST DELIVERY AND OFFLINE DATA-PACK ARCHITECTURE
## Victori3 Mobile / Currents of History — 1836–2026

**Date:** 2026-11-20  
**Repository:** mtieu6470-maker/Victori3-mobile  
**Branch snapshot before this documentation commit:** `9a1acf17859f112135d79fa15f7301a4ca55a955`  
**Status:** DESIGN DRAFT — product requirements only; not implementation authorization  
**Owner clarification:** install APK first, then choose data downloads in-app; optionally request the entire dataset in one action, with a target estimate of 4–5 GB.

---

## 1. Decision to preserve

The delivery model is **APK first, data second**.

1. The player downloads and installs one APK.
2. The app opens without requiring a multi-gigabyte payload to be bundled into the APK.
3. A Data Center explains which packs are required for each scenario and provides explicit download choices.
4. The player can download only the required/base data, select packs, or press one button to request the full 1836–2026 data collection (target estimate 4–5 GB).
5. Once the chosen packs are verified and activated, the game runs offline. Network access is only needed when the player explicitly starts a download or requests a data-version check.

The 4–5 GB figure is an owner-provided planning target, **not a measured release size**. Actual compressed download size and installed size must be measured from final generated assets before the UI displays a definitive size.

A single “Download all” action does not require a single 4–5 GB archive. The app may orchestrate several versioned packs/shards while presenting one progress bar and one user-visible job.

## 2. Why the APK and data must be separate

- A large history/map/media corpus increases APK download and installation friction for every player, even when they only want a small scenario.
- Data corrections should be publishable without rebuilding/reinstalling the APK when the data schema and engine compatibility allow it.
- The player should control network cost, timing, storage and which optional media are installed.
- Full data must remain local after download; normal simulation must not depend on a server, account, cloud API or telemetry.

The current repository's Android module is still an experimental build: `android/app/build.gradle` declares application ID `vn.dongchaylichsu.game.experiment` and version name `1.0-experiment`. That is not a production release identity. This design does not change package ID, signing or release configuration.

## 3. Pack model

The following are logical pack families; exact boundaries and byte sizes must be decided by the data inventory and dependency audit, not guessed in advance.

| Pack family | Contents | Required status |
|---|---|---|
| Core/runtime data | Stable IDs, catalogs, scenario bootstrap, required 1836 baseline, common rules/data definitions and small indexes | Required for the scenarios it supports |
| Historical world data | Date-valid countries, territories, leaders/governments, wars, treaties, organizations, events and source/provenance records through supported eras | Required for a complete historical campaign through the selected end date |
| Simulation content | Economy/POP/political/military/technology/institution definitions and supporting time-series inputs | Required according to enabled simulation systems |
| Optional visual/media | High-resolution map layers, portraits, illustrations, audio and other non-rule assets | Optional; visual fallback must be clearly labelled |
| Language/localization | Additional language resources where they can be safely separated from core UI | Optional |

Packs must declare dependencies. A complete 1836–2026 Historical campaign may not be advertised as complete when required era or world-history packs are absent. Historical and Sandbox modes continue to use the same simulation rules; Sandbox must not receive a reduced engine merely because its scenario initialization differs.

Potential partitioning by era (for example 1836–1913, 1914–1945, 1946–1991, 1992–2026) is only a download/data-organization option. It must not create artificial simulation discontinuities at those boundaries. Shared identifiers, cross-era dependencies and country/territory continuity have to validate.

## 4. User experience and consent

Data Center should provide:

- **Required starter data:** the smallest verified set that enables the selected initial scenario.
- **Choose packs:** view pack purpose, version, required/optional state, compressed size, installed size, dependencies and license/provenance.
- **Download all data (estimated 4–5 GB):** one explicit action that schedules all required and selected optional packs.
- **Manage installed data:** inspect version, verification state, storage use, update compatibility and safe removal.

Before starting a download, show the measured download size, expected installed size, required free space, destination volume and network policy.

Default network policy:
- Wi-Fi/unmetered only.
- No automatic download after APK installation.
- No silent switch to mobile data or roaming.
- Mobile-data use requires a separate confirmation showing the total bytes.
- Pause, resume, retry and cancel must be available. The app should expose progress in the UI and an OS notification for a long-running transfer.

No mandatory account, cloud subscription, analytics upload or save-file upload is part of this design.

## 5. Manifest, integrity and compatibility contract

Each release has a signed manifest. Proposed fields:

| Field | Purpose |
|---|---|
| manifestFormatVersion | Parser/version negotiation |
| releaseId, channel, createdAt | Immutable release identity |
| packId, packVersion | Stable pack identity and revision |
| engineCompatibility | Minimum/maximum compatible engine build |
| dataSchemaVersion, rulesVersion, calendarVersion | Data/rules/calendar compatibility |
| dependencies | Required pack IDs and compatible version ranges |
| compressedBytes, installedBytes | Honest pre-download and storage estimate |
| shards[] | URL, exact byte length, SHA-256, ordering and archive format |
| files[] | Relative path, decompressed length and SHA-256 where practical |
| provenance[] and licenses[] | Source attribution and redistribution rights |
| signature | Signature over canonical manifest bytes |

Security requirements:
1. The app contains a pinned public verification key; the private signing key stays outside the repository and CI logs.
2. Fetch the manifest only over HTTPS from an allowlisted release host.
3. Verify the manifest signature before trusting any URL, size, version or hash it contains.
4. Verify every shard's exact byte count and SHA-256, then verify extracted files/indexes as defined by the manifest.
5. Reject path traversal, duplicate/overlapping paths, symlink entries, unexpected files, decompression bombs and unsupported archive formats.
6. Data packs contain declarative data/assets only. They cannot ship JavaScript/native executable logic, plugins or instructions that mutate app code.
7. Reject packs whose engine/schema/rules/calendar compatibility does not match the installed app or selected save.

A SHA-256 value alone is not a trust anchor if an attacker can replace both the data and unsigned manifest. The signed manifest plus pinned public key is therefore required.

## 6. Large-download transport and 4–5 GB full option

GitHub Releases currently documents a per-file release asset ceiling of **under 2 GiB**, while allowing multiple assets and no aggregate release-size limit. Therefore, the full package should not be published as one 4–5 GB release asset.

Recommended approach:
- Build logical pack archives/shards with a conservative target below 2 GiB per asset (for example around 1–1.5 GiB, adjusted after actual compression and hosting tests).
- Keep each shard independently verifiable.
- A full-data button queues the required shard list and reports total progress across all shards.
- Download and verify sequentially by default to reduce temporary disk requirements; parallelism can be enabled only after device/storage benchmarks.
- Do not concatenate shards into another huge temporary archive unless a measured format requirement makes that necessary. Extract verified shards into a staging tree and remove each temporary shard only after its extracted content is verified.
- Never store the production payload in normal Git history, Git LFS by default, or short-retention CI artifacts. CI artifacts are build/test evidence, not the permanent public data CDN.

Initial hosting candidate: public GitHub Releases assets, avoiding a recurring hosting subscription. Any paid object storage/CDN or paid API must be presented with its expected recurring cost and receive explicit owner approval before use. A mirror may be added later if download reliability or hosting policy requires it.

Useful platform references:
- GitHub Releases storage/bandwidth quotas: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- Android DownloadManager (long-running HTTP downloads, retry across connectivity changes/reboots): https://developer.android.com/reference/android/app/DownloadManager
- Android app-specific storage: https://developer.android.com/training/data-storage/app-specific
- Android data-transfer choices, including user-initiated transfers: https://developer.android.com/develop/background-work/background-tasks/data-transfer-options

## 7. Android storage and safe activation

- Use persistent app-specific storage for installed packs; do not put multi-GB core data in cache.
- Check available bytes on the actual target volume before download and again before extraction. Consider app-specific external files storage for large non-sensitive game assets where appropriate; check volume availability and handle removal.
- Do not request broad `MANAGE_EXTERNAL_STORAGE` access merely to install game data if app-specific storage is sufficient.
- Maintain separate `downloads/`, `staging/` and `installed/` areas. Staging and installed state must not be confused.
- Download a shard to a temporary file, verify its byte count/hash, safely extract to staging, validate data indexes and dependencies, then delete that temporary shard.
- Only after all required content validates should an atomic manifest/pointer switch mark the new pack set active.
- A crash, cancellation, low-storage event, bad hash or incompatible version leaves the last active pack untouched.
- On updates, retain compatible installed packs. If replacement requires substantial extra storage, state the required free space and any rollback limitation before the player agrees.
- Android app-specific files are removed on uninstall; saved campaigns and export/backup behavior need a separate explicit design so players do not mistake an installed data pack for a backup.

The transfer implementation should use Android-native long-running transfer facilities appropriate to the supported Android API levels (for example DownloadManager for straightforward HTTP assets, or a user-initiated transfer/foreground-work path when coordinating validation and extraction). The final API choice must be benchmarked and tested for app process death, connectivity changes, reboot, notification controls, cancellation and Android-version restrictions.

## 8. Offline behavior

After the user has installed all packs required by a scenario:
- the map, data indexes, historical events, simulation definitions and chosen media resolve locally;
- no server is required for turns, AI decisions, saves, load or late-game simulation;
- Internet mode remains off by default;
- optional manifest checking or pack updates happen only on explicit user action or a separate opt-in setting;
- missing packs are reported before starting a campaign, not discovered halfway through a run;
- the player can see exactly which years/regions/features are and are not covered by installed data.

## 9. Acceptance criteria

| ID | Acceptance condition |
|---|---|
| DP-01 | APK installs and opens Data Center with no multi-GB dataset embedded |
| DP-02 | No automatic data download on first launch or after APK update |
| DP-03 | Player can choose starter, individual packs or one-action full-data download |
| DP-04 | Full-data size is measured from release artifacts; 4–5 GB remains a target estimate until verified |
| DP-05 | Full-data operation can consist of multiple <2 GiB release assets while showing one aggregate job |
| DP-06 | Manifest signature, shard byte size/hash, schema and compatibility are verified before activation |
| DP-07 | Wi-Fi-only is default; metered/mobile/roaming needs explicit consent |
| DP-08 | Storage preflight, pause/resume/retry/cancel and crash-safe staging pass device tests |
| DP-09 | Failed or interrupted install leaves the previous active pack untouched |
| DP-10 | Installed required packs support offline campaign play without account/cloud runtime calls |
| DP-11 | App update retains compatible data packs and reports incompatible ones before replacement |
| DP-12 | No save, personal file, device identifier or gameplay telemetry is uploaded by the data-pack downloader |
| DP-13 | Public hosting is used where practical; any recurring paid hosting is disclosed and approved in advance |

## 10. Implementation order — proposed only

| Work package | Deliverable | Gate |
|---|---|---|
| D0 — Inventory | Packable file inventory, source/license review, actual byte-size estimate, dependency graph | Read-only audit first |
| D1 — Builder/manifest | Reproducible pack builder, canonical signed manifest, shard hashes | Separate implementation authorization |
| D2 — Hosting | Versioned public release assets, mirror and retention policy | Owner approves hosting and licensing |
| D3 — Native transfer | Download coordinator, app-specific storage, resume/retry, verification and atomic activation | Separate Android/runtime authorization |
| D4 — Data Center | Pack catalogue, consent, progress, storage warnings, installed-pack management | UI implementation authorization + device QA |

**Current status:** no production data-pack manifest, pack builder, permanent data hosting, native downloader, activation code or Data Center download flow is certified as implemented. This document is design only. It does not authorize runtime, asset, data, workflow, signing or APK distribution changes.
