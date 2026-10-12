# APBM_000 — revised candidate and QA plan approval

Issued: 7 October 2026, Asia/Dhaka. Owner: JARVIS, independent QA Lead.
Status: APPROVED FOR Q2 under the release and verification conditions below. Q2 acceptance execution has not been demonstrated. Gate Q NOT ISSUED.

## Effective approval and precedence

Approve product candidate `f21564cacb563ecddbf78b1685086c9489bf1c26` on `qa/frontend-apbm-000`. Its reported parent is `9a65cdd80e89b435cfb721d560b5301803556bcb`. The original product reference `22ce03ba3871ea53e5253f2e3f060a1bab3226a3` remains historical; baseline `20ef380bdd6eed5e111d953d6404992add7a88a6` remains the regression baseline.

Effective plan: unchanged **QA-APBM000-PLAN v0.2 plus this dated binding addendum**. Preserve v0.2 and Q1B_REVIEW bytes. This is not a claim that the old approval already covered f21564c. For future Q2 execution, this addendum replaces v0.2's old candidate, identity-instrument selection, A/B failure allowances, generated-header disposition and pending D4/D7 wording. All other requirements remain effective.

The Architect's 5 October amendment supplies the sole R000-03 / AC000-21 roster exception. Canonical ACCEPTANCE_SPEC and RULINGS_ADDENDUM remain unchanged. Hashes of those documents, v0.2, the Architect amendment, this approval and approved tools are recorded in `HANDOFFS/LEAD_REMOTE_ROSTER_BINDING_HASHES_2026-10-07.json`. Check that record against the supplied package index and installation receipt; do not edit an authority document and regenerate its expected hash to approve it.

## Review basis and limits

Reviewed the 21:57:15 roster-rebind ZIP: all 32 indexed members matched their sizes and SHA256 values. Read the complete three-file patch and four manifest blobs. Independently applied the patch to disposable copies of the old blobs: it produces the exact supplied new blobs and removes the old copy. Bundle definitions remain identical, both env-variable names remain unchanged, and all six current agents bind to v1. No endpoint values are present in those manifests.

The exported commit-bound inventory reports exactly three product/config paths, 40 QAM paths and three historical RESPONSES documents changed between old and new candidates. The exported source search identifies `src/config/manifest.ts` and its test as the active-manifest importers, with no backup-manifest references in the searched tracked source. These repository facts and ancestry are reviewed Executor evidence; the Lead has not accessed Tony's live Git checkout. Revalidate execution identity locally before Q2. The archive is not a complete product/source/design export.

Recounted raw diagnostic Jest: 287 tests, 286 passed and one failed; 39 suites, 38 passed and one failed. All 36 resolved names in the supplied comparison occur as passed in the raw revised-candidate results. The comparison reports zero new failures and no removed tests. The old raw run is not in this ZIP; its baseline classification is retained from Q1b, not represented as a newly executed comparison here. No build, browser or acceptance run was performed by this Lead review.

## L1 — candidate and exact roster transition: APPROVED

| Path | Permitted transition, SHA256 |
|---|---|
| config/agents.manifest.json | 638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8 → 6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9 |
| config/agents.manifest-hermes.json | absent → 638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8 |
| config/agents.manifest copy.json | 6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9 → absent |

Preserve `v1 → ADK_BUNDLE_URL_V1` and `v2-local → ADK_BUNDLE_URL_V2_LOCAL`. The revised roster is greeting_agent, jarvis_agent, calc_agent, product_agent, ghl_mcp_agent and moose_mcp_agent, all on v1. This is configuration approval, not proof these names are deployed or reachable remotely. No config reapplication, reversal, endpoint change, environment-value change or product repair is authorized.

For X-21/J-01/J-21 compare to this active roster and unchanged bindings. Keep alternate-roster fixtures. X-02's hardcoded-agent scan must consider both old and revised configured IDs/names; its old examples are not an exhaustive list. The original manifest-test replacement remains subject to Q1b's coverage review; greener tests do not dispose of that obligation.

## L2 — identity tool v2: APPROVED with explicit verification gate

Approve the supplied, hash-bound `AUTOMATION/q2_identity_v2.py` and `AUTOMATION/roster_amendment_2026-10-05.json`. Preserve v1. Use the exact revised candidate, `--head HEAD`, the approved amendment and `--accept-next-env-dev-variant`. Record actual execution HEAD separately; documentation commits may advance HEAD.

The v2 diff keeps product/config/design/contract comparisons and reports the bounded roster exceptions. The exported six self-test scenarios report expected blocking outcomes. The claimed seven checks include two assertions in one scenario; the compact export does not expose every per-assertion result. In particular, it omits nonblocking QAM anomaly detail for the copied-record control. Do not repeat “7/7 independently verified” as a Lead result. Preserve the raw per-control outputs and summary in the normal Q2-0 instrument validation, or recover the existing outputs read-only if available.

**Raw PRODUCT_EQUIVALENT is not sufficient authorization.** This tool reports QAM hash and placement anomalies without necessarily making them blocking, and reads transitions from its input JSON rather than independently pinning that JSON's authority. Before any test body, separately verify the approval/plan/contract/tool/amendment hashes from the binding record and classify every raw anomaly. Any unexpected or unexplained instruction/tool hash mismatch blocks Q2 regardless of the raw verdict. Use the pinned amendment file only, never a caller-supplied expanded transition list. A negative copied-record control must demonstrate detection and rejection by this combined gate, not merely an unrelated product failure.

At Q2-0 prove correct branch, revised-candidate ancestry, committed and working-tree product equality, empty staging area, no unapproved intervening changes and no concurrent dev/product writer. Inspect all intervening path/status changes, including renames and merge-parent changes if any; do not rely solely on the instrument's ordinary diff-tree output for merges. Check the original changed/protected/pinned inventories plus the three permitted config transitions. Preserve original expected product hashes. Approved QAM records and the separately authorized placement correction are classified individually, not treated as a general agent_docs exemption.

## L3 — generated next-env.d.ts: APPROVED, narrowly

Accept only the pinned build variant SHA256 `7b550dda9686c16f36a17bf9051d5dbf31e98555b30d114ac49fc49a1e712651` or the reported exact dev variant `7ad303e40d4fddf44f156129e397511953a71481c5cfd86b1862649aaaf240cc`. The difference must be solely `./.next/types/routes.d.ts` versus `./.next/dev/types/routes.d.ts`; the v2 normalizing check must agree. No blanket generated-file waiver.

Keep Next dev stopped while QA runs. Record pre/post hashes and the generating command for build changes. A missing generated types file causing tsc failure remains a visible environment result; acceptance of this header does not make typecheck pass. Any other content/hash is a stop for affected qualification. Do not start a dev server or edit product inputs merely to hide a failure. Existing bounded environment/instrument correction rules remain in force.

## L4 — inherited failures: UPDATED

Retire all 24 class-A and 12 class-B waivers for the revised candidate. Their reappearance is a finding, not an automatic waiver. Fresh full Jest is still required in the isolated Q2 body; the preparation diagnostic does not satisfy Q2-2.

Expected maintained suite: 287 total, 286 pass and exactly the following failure:

- File: `src/__tests__/chat/chatStore.persist.test.ts`
- Full name: `chatStore persistence (FIX-001) SSR guard: storage getter throws (server: no window) → store still creates and works in-memory (F5)`
- Observed cause: undefined storage `setItem` during real store `setSession`.

Keep exit 1 and the complete failure visible. C remains conditionally deferred under v0.2 section 6: J-13, real store/reset seam inspection and relevant real-store regression, no setter during render/SSR, safe logout/reset/new-state clearing, and successful production build must support no phase-000 impact. A spy-only test is insufficient. Demonstrated phase-000 impact invalidates the deferral and blocks affected acceptance. Missing evidence leaves that conclusion unproven.

Unexpected totals, missing/skipped tests, changed failure cause or a newly green C result require explanation and evidence; never weaken a test or retry to force the expected count. No new failure is preaccepted. Compare to the historical baseline and this revised diagnostic by exact file/test identity. This does not certify live backend behavior.

## L5 — plan binding and Director release: APPROVED / RELEASE PENDING

The approved plan is the frozen v0.2 plus this addendum and the Architect amendment, at the hashes supplied. Q2-0/0b and AC000-22 evidence must cite this effective combination and the revised product candidate. All remaining AC rows, independent tests, controls, render matrix, three-hour bound, retry limits, separation and repair chain remain unchanged.

D4 = ALLOW and D7 = OMIT remain recorded. Do not ask Tony to choose either again. Preserve v0.2 section 11.2's separately confined font-build lane and exact destination/path policy; no live service calls. If its required enforcement cannot be established using permitted tools, record build proof BLOCKED and continue independent released safe checks. The visual-check omission applies only to Tony's optional comfort check, never required automated browser/visual evidence.

The Architect amendment explicitly requires one revised-candidate release confirmation after this approval. Its requirement supersedes the older release record's claim that release automatically becomes effective upon rebinding. Until the confirmation and committed-instruction verification exist, only reversible QAM preparation is authorized.

Record Tony's actual confirmation verbatim, with time and reference to this approval. Suggested text:

> Extend my Q2 release to candidate f21564cacb563ecddbf78b1685086c9489bf1c26 under the QA Lead's revised approval incorporating the 5 October remote-roster amendment. Keep my font-build permission and skip the optional visual check. Begin after candidate verification.

This quotation is a template, not a Director decision. Tony can supply it together with his completed commit. The release transcript/record may be appended after the instruction commit; it does not require another approval or commit loop before execution. Verify the committed instructions unchanged, record the release as the authorized new QAM record, then perform Q2-0. Do not assume the uploaded ZIP or the Lead's approval supplies this confirmation.

## L6 — individual anomalies and bookkeeping: DISPOSED

| Item | Disposition |
|---|---|
| Root QA_HANDOFF.md pointer | Nonblocking documentation-placement finding for Q2. Architect authorized Cody to remove that pointer only and correct active links as needed, preserving canonical QAM handoff. Executor reports; no simultaneous writers. Verify separately for final cleanup/process verdict. |
| Three already committed RESPONSES docs | Historical documentation-only departures reported in candidate ancestry. Preserve history; no rewrite and no product waiver. |
| Untracked RESPONSES 19:35 report | Exclude from proposed commit; leave untouched. Its old start/staging instructions do not supersede this approval. |
| QAM Python bytecode cache | Disposable QA-owned debris, not authority or a product change. Exclude from staging; remove only verified owned cache if desired, use Python -B to avoid new bytecode. No broad cleanup. |
| Self-referential q2_approved_qam_records.json | A file cannot contain its own final content hash. Keep historical file as evidence. Prepare a new frozen records manifest omitting its own entry and future outputs; record its final hash separately in the Q2 start receipt. Do not chase a self-hash or refresh product hashes. |
| Stale QAM_STATE fields | Routing metadata only. Update candidate, effective plan/addendum hashes, permissions and pending release truthfully; retain historical evidence. director_pending must reflect the single revised-candidate release until received. Remove obsolete current claims such as NOT YET COMMITTED after verification. |
| Missing LEAD_REMOTE_ROSTER_PREP file | Preparation purpose superseded by this complete review/approval and continuation. Evidence requested by the Architect is supplied. No need to recover or install that earlier prep-only file; remove it as a current blocker. Do not fabricate its contents. |

The revised records manifest may index reviewed existing records, these supplied files and narrowly authorized routing/preparation updates. Preserve their provenance. Freeze instruction/tool hashes before execution; list later release/results as append-only outputs with separate evidence hashes. For changed routing records, retain the exact diff and hashes. Do not use an allowlist refresh to waive an unexplained authority or product change.

DIRECTOR-OBS-001 remains UNTRIAGED. Perform the v0.2 section 11.3 mocked A+B catalog/reopen and metadata-failure scenarios and source-seam review. A new frontend regression stays in scope; sound offline evidence does not establish the cause of disappearing live conversations. No live diagnostic, localStorage repair or phase-001 expansion is authorized.

## Installation, execution and return

Merge this package's QAM contents into the existing module QAM; preserve other files and all historical evidence. This package adds records only and is not installed in Tony's repository by the Lead. Claudy updates QAM routing/record manifests and prepares an explicit per-file staging list with status and hashes for Tony. Use the supplied reviewed-path inventory as a reference, not permission to stage every current file under QAM. Exclude RESPONSES, config, src, caches and recursive ZIP copies. Name any Cody placement correction separately. Tony alone commits/pushes; Claudy performs no Git mutations.

After committed-instruction verification and the single revised release, proceed autonomously through released Q2. Return one indexed, sanitized QAM handoff with actual candidate/execution identities, approvals/release, commands/exits, exact AC expected/actual evidence, anomaly dispositions, original failures, C non-impact proof or gaps, DIRECTOR-OBS-001 disposition and owned-runtime teardown. Missing build/browser proof prevents full Gate Q. Do not perform Q5 before Lead disposition. No Gate Q, merge, deployment or product repair is authorized by this approval.
