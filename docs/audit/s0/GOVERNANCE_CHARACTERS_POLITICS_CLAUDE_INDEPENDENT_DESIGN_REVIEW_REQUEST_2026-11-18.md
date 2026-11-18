# S15–S17 Local Government, Characters and Politics — Claude Independent Design Review

**Repository:** `mtieu6470-maker/Victori3-mobile`  
**Branch:** `claude/game-historical-sandbox-modes-kg7rj7`  
**Review type:** independent no-write design review  
**Date:** 2026-11-18  
**Runtime authorization:** `NONE`

## 1. Exact review target

- **Design document:** `docs/spec/GOVERNANCE_CHARACTERS_POLITICS_ARCHITECTURE_PROPOSAL_VI.md`
- **Design commit:** `207722d612354f4d1bccc74064d24616efa4511a`
- **Code baseline:** `e4924ca48264f8d0818eface51a28a87cd363b89`
- **Normative roadmap:** `docs/roadmap/DECISIONS_AND_S0_REVISED_VI.v3.2.md`, with owner-approved v3.3 amendments.
- **Related designs:** POP Cohorts `b35c5367cfe41bea3036bec2b846d19060f495c0`; S7–S8 architecture `98a9aef1356f73004a78590eb45d63321b4b0ee2`; S10–S11 design `b1fa6abdeb3609c8acc31206405c05a0ee90898b`.

Fetch exact current branch HEAD before review. Confirm the target design's current content/blob and compare the branch against the design commit.

## 2. Independence and no-write requirements

Claude must not have authored or modified this design. This is a no-write review:
- Do not edit the target or related documents.
- Do not modify code, schema, save, historical data, tests, UI, assets, Android, Gradle, workflows or APKs.
- Do not create branches, fix commits or PRs.
- Do not implement any S15/S16/S17 slice.
- Do not treat this request as authorization to open S1 or a later phase.

If required corrections exist, report precise section/line locators and return `CHANGES_REQUESTED`.

## 3. Required technical review

### A. Current-state characterization

Verify at the exact code baseline:
- `src/engine/types.ts`: fixed 8 IGS, Country.leader/heir/reform/laws, Region population/strata/nationalism/radical, GameState.
- `src/engine/data/dbTypes.ts`: LawGroup, EntityRecord, LeaderRecord, DecisionWindow and source quality model.
- `src/engine/systems/politics.ts`: IG_PREFS, POWER_WEIGHTS, updatePolitics, reformSupport, startReform, revolutionCheck, generatedName, secessionCheck.
- `src/engine/systems/events.ts`: leadership succession, elections and Historical Mode decision windows.
- `src/engine/systems/diplomacy.ts`: treaty, subjects, relations and current war declaration boundary.
- Roadmap S15–S19 definitions and S6/S7/S8/S10–S14 dependencies.

Flag inaccurate, missing or overstated claims.

### B. S15 local government and public services

- Are de jure scope, de facto scope, delegated/contested authority and administrative reach sufficiently distinct?
- Can overlapping/customary/local/religious/colonial/tributary authorities be represented without forcing a single modern administrative hierarchy?
- Are service capacity, access/coverage and quality separate?
- Does public service delivery avoid creating money, goods, staff or population?
- Is urbanization conserved and linked to housing, water, sanitation, food, work, transport and service availability?
- Are dependencies on S3/S4/S6/S7/S8/S10/S11/S12/S14 respected?

### C. S16 characters and succession

- Are historical_verified/supported/uncertain, generated_simulated and placeholder_unknown safely distinguished?
- Does the document avoid fabricating historical people when source evidence only establishes an office or collective authority?
- Are collective/shared office, regency, vacancy, dual appointments, election, council selection and non-monarchical succession covered?
- Are IDs, lifecycles, appointments and relationships deterministic and bounded?
- Are generated traits/names safe from cultural/religious stereotyping and unsupported attribution?

### D. S17 institutions and politics

- Does InstitutionProfile replace universal monarchy/republic/parliament assumptions without overfitting too many special cases?
- Does the design adequately separate office authority, law proposal, consent, enactment and actual implementation?
- Are current fixed IGs treated as a legacy adapter, not universal mandatory groups?
- Are cohort support weights normalized to avoid double counting population?
- Are organizations and movements distinguished?
- Are protest, strike, rebellion, coup, revolution, civil war and secession distinct states with negotiation/resolution paths?
- Is legitimacy decomposed enough to avoid one universal score?
- Does the model preserve political agency of decentralized and non-European polities?

### E. Integration and safety

Confirm:
- S6 cohorts provide support/grievance but do not assign every cohort to one fixed IG;
- S7/S8 can create economic/transport shocks but do not automatically trigger revolution;
- S12 employment and S13 ownership are not assumed implemented;
- S18 diplomacy and S19 strategic AI remain later phases;
- Historical Mode is not railroaded, and Sandbox shares the start state/pipeline;
- S1 save/schema gate remains a hard prerequisite.

### F. Performance, UI and test coverage

Assess active authority/office/character/organization/movement count, historical retention, event/log growth, p95/p99 monthly political cost, memory/save size, Android portrait/landscape UI and multi-decade tests. Identify missing scenarios for collective authority, contested jurisdictions, uncertain succession, partial law implementation and movement settlement.

## 4. Required verdict

Return exactly one:
- `REVIEW_PASS`
- `CHANGES_REQUESTED`
- `BLOCKED`

Include exact reviewed HEAD and target blob, severity-ranked findings with precise evidence/locators, non-blocking recommendations separately, and explicit confirmation of no writes.

## 5. Gate boundary

Review is limited to the design document. Even `REVIEW_PASS` does not satisfy S0-B7 review, owner acceptance or S1-entry signoff. It does not open S1/S15/S16/S17 or authorize code, data, save, test, UI, Android or APK work.
