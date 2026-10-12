# APBM_000 — QA Lead repair intake decision

11 October 2026 · JARVIS, independent QA Lead.

**ACCEPT FOR INDEPENDENT RETEST. Plan v0.3 approved for attempt-002 after the candidate-specific Director release and successful preflight. Gate Q remains PENDING.**

Candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5`, parent `9c50884d4c4513b6969311d5be7c05828104ed3d`, branch `qa/frontend-apbm-000`. The supplied post-commit receipt controls identity over pre-commit notes. Architect engineering acceptance is accepted as stated by Tony; it is not QA certification.

## Review evidence and limits

Independently hashed all 575 indexed payload members; the only unindexed member is the index itself. All 269 reviewed commit-member bytes match the preparation inventory and committed-scope list (19 product/test, one changelog, 249 QAM). Reversed and reapplied the 19-path binary-capable patch in scratch: all 19 final files match supplied candidate bytes. Verified seven font assets and included OFL against provenance. Reviewed actual repair source and raw current AddMember/full-Jest/typecheck results; earlier failure records are retained. This was an artifact review, not execution on Tony's repository. Exported commit claims require Claudy's real-checkout ancestry/blob checks.

Raw latest Engineer evidence reports AddMember 7/7, full Jest 290/290 in 40 suites and typecheck 0 on restored committed dependencies. Prior reconciliation full suite remains 289 pass / 1 fail in its historical record. Focused 64/64 and browser 27/27 are dated supporting engineering evidence, not independent passes. The build remains outstanding.

| Finding/change | Intake disposition | Independent closure evidence required |
|---|---|---|
| F01 | Entry boundary now handles reset persistence exceptions and both logout promise outcomes; real stores unchanged. Eligible for retest; still open | Normal/getter-throws/write-throws: cleared in-memory user/chat/draft/demo, one navigation, no rejection. No server logout claim |
| F02 | Current visible item prioritized in modal close-focus callback; timeout race removed. Eligible for retest; still open | Current item after teardown, fallback, normal close, inert/keyboard behavior |
| F03 | Mobile breadcrumb min-width44 added. Eligible for retest; still open | Actual >=44x44 at375 in all three screens and no overflow |
| F04 | Literal independent v1/v2-local urlEnv assertions restored. Eligible for retest; still open | Maintained assertion execution plus independent configuration/source checks |
| Local Inter | Seven exact WOFF2 subsets, CSS/fallback/provenance/OFL supplied; authorized root-layout wiring only | Normal offline production build/output scan, current-font renders and root collateral probes. Automatic Latin preload differs; no timing equivalence claim |
| AddMember test | Deferred loading submission is settled; error test awaits toast/completion; seven tests and original assertions retained | Fresh full maintained run. Historical unexpected callback was not conclusively traced |

The old QA browser fixture is opt-in and S-19 creates separate contexts. The old render harness also serves four Designer TTFs and adds sibling furniture to every page. v0.3 expressly requires policy coverage for all contexts, current product fonts and clean normal pages. The old identity scripts still bind original inventories; author/freeze a new fail-closed gate instead of repointing a constant and accepting its verdict.

## Approved next action

Install this QAM-only delivery; preserve v0.2 and original evidence. Claudy may prepare the explicitly bounded instruments and route current state/checkpoints to v0.3. After Tony's single candidate release and the plan's self-checks, Claudy executes continuously within the bound. No additional routine Lead review of those specified instrument corrections is required; unexpected scope or failed prerequisites return a blocker.

D4 ALLOW and D7 OMIT remain unchanged. No old candidate release is extended implicitly. No Git mutation or mandatory extra documentation commit is introduced. Historical QAM state/commit subjects saying completed do not close QA. Q5 and certification follow a separate Lead findings disposition. Architect owns subsequent engineering/phase closeout.

The indexed binding is the source authority for inputs; the corrected instrument freeze is separate evidence. Neither an editable state JSON nor an unverified manifest is approval. The release template is not an executed Director decision until Tony sends/records it.
