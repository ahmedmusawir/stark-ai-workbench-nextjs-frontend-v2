# APBM_000 — bounded remote-roster amendment

Issued: 5 October 2026, Asia/Dhaka
Authority: JARVIS, Architect, at Director Tony's request
Status: ARCHITECT SCOPE APPROVED for the exact configuration identities below. QA Lead candidate/plan approval and confirmation of the revised Q2 release remain pending. Gate Q NOT ISSUED.

## Decision

Retain Tony's current remote ADK roster. Authorize the specific three-file configuration transition recorded at commit `f21564cacb563ecddbf78b1685086c9489bf1c26`, on `qa/frontend-apbm-000`. Do not restore the Hermes roster, repair product code, change environment values, or switch branches. This is a narrow exception to R000-03 / AC000-21's original requirement that agent IDs remain unchanged from `22ce03ba3871ea53e5253f2e3f060a1bab3226a3`.

The candidate commit's parent is `9a65cdd80e89b435cfb721d560b5301803556bcb`. Q1's product candidate is an ancestor according to the supplied identity record. These identities were read from the exported evidence; the Architect has not accessed the live VM Git repository.

## Exact permitted file delta

The following SHA256 values are file-content hashes from `identity-head-f21564c.json`, not Git object IDs.

| Status | Path | Previous SHA256 at 22ce03b | SHA256 at f21564c |
|---|---|---|---|
| Modified | config/agents.manifest.json | 638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8 | 6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9 |
| Added | config/agents.manifest-hermes.json | absent | 638e95a166e9e196175bd630ce76560db1ef98dbe72d40f31d9a109782027ae8 |
| Deleted | config/agents.manifest copy.json | 6c27f420127db7125a43ddba6347470b19d3be39769b44bb2b85bd6d9526b6d9 | absent |

Thus, the recorded new active bytes match the previously present copy, and the recorded Hermes backup matches the old active bytes. No arbitrary future edits to those files are authorized by this amendment.

Evidence limitation: the supplied ZIP contains exact path/status/hash records but neither manifest bodies nor a unified patch. It is not honest to claim that the Architect inspected a line-by-line diff. Before final candidate binding, the Executor must export the actual complete three-file diff and file bodies from the named commits, validate these hashes, and let the Lead inspect the resulting concrete evidence. This is read-only evidence completion, not another product build or full recon.

Suggested evidence commands, run by the Executor from the repository, with outputs under QAM/evidence/remote-roster-rebind-001/:

- `git rev-parse f21564c^{commit}`
- `git diff --no-ext-diff --no-textconv --no-renames --binary 22ce03ba3871ea53e5253f2e3f060a1bab3226a3 f21564cacb563ecddbf78b1685086c9489bf1c26 -- config/agents.manifest.json config/agents.manifest-hermes.json 'config/agents.manifest copy.json'`
- Export the present old/new manifest blobs with `git show <full-SHA>:<path>` and calculate SHA256 of their exact bytes; record absent files as absent.
- Record the full changed-path list from old candidate to new candidate, separately classifying QAM/documentation changes and product changes.

Do not print or export .env values. Verify bundle definitions and each agent-to-bundle assignment from the JSON. The evidence report says only src/config/manifest.ts imports the active manifest and neither backup is imported; verify this source fact in the checkout.

## R000-03 / AC000-21 interpretation after this amendment

For APBM_000, the active roster is the exact `config/agents.manifest.json` blob specified above. The preservation test compares against this authorized roster, rather than requiring the prior Hermes agent IDs. The backup addition and unused-copy deletion are permitted only as listed.

Bundle identities and urlEnv mappings remain unchanged: `v1 → ADK_BUNDLE_URL_V1`, `v2-local → ADK_BUNDLE_URL_V2_LOCAL`, as reported in the supplied evidence and to be checked against actual JSON. This does not authorize endpoint changes, bundle reassignment beyond the specified blob, new environment values, server API changes, auth changes, schema/RLS changes, dependency changes, or frontend A2A/Hermes code.

All other protected product inputs and APBM_000 acceptance boundaries remain in force. Preserve config-only flexibility; continue alternate-roster fixture checks. A selected remote roster does not authorize live cloud agents, Supabase, GCS, GHL, or credentials during Q2. No live multi-session, security, durability or deployment certification is implied. DIRECTOR-OBS-001 remains open for evidence-based disposition.

## QA evidence and remaining anomalies

The supplied diagnostic Jest JSON records 286 pass / 1 fail / 287 tests and 38 pass / 1 fail suites. The comparison reports 36 previous A/B failures resolved, no new failures, and one C storage failure retained. These are Q2-preparation diagnostics, not completion of Q2. The Lead must update the retained-failure disposition; do not retain 36 obsolete waivers or erase the remaining failure. Do not infer overall roster correctness solely from a greener suite.

The identity record also flags regenerated next-env.d.ts, a root QA_HANDOFF.md pointer, QAM-record hash bookkeeping, and earlier RESPONSES documentation changes. This roster amendment does not silently waive those anomalies. The Lead must classify them individually against existing rulings. Generated next-env.d.ts must receive a bounded provenance/content disposition, not a blanket ignore. No new product mismatch may be hidden by refreshing every expected hash.

The root QA_HANDOFF.md pointer remains contrary to Tony's placement rule according to this export. Cody is authorized to remove that pointer only, updating any active links to QAM/HANDOFFS/QA_HANDOFF.md if needed. Preserve the canonical handoff. This is documentation housekeeping; it is not a product repair. The Executor may report the condition and coordinate the separate Engineer seat; do not have two writers work concurrently. Keep new QA records inside QAM/.

## Plan and candidate approval

The prior v0.2 approval does not automatically cover the new configuration. QA Lead must issue an explicit amended plan or candidate-binding addendum covering:

1. New product candidate full SHA and the exact configuration evidence above.
2. This amendment, unchanged acceptance/rulings plus its narrow exception, and actual hashes of the effective approval documents.
3. Changed inherited-failure status and remaining C conditions.
4. Updated identity tooling/records that allow only this exact roster transition while preserving all other protected comparisons.
5. QA execution HEAD after approved documentation commits, its ancestry, and product equivalence to the revised candidate. Do not demand execution HEAD equal product SHA after documentation-only commits.

Preserve historical evidence and approvals; append/version the new disposition. Authorize read-only preparation and QA-record updates before Q2; no acceptance execution until the effective approval and Director release conditions are satisfied.

## Director permissions and release interpretation

The recorded verbatim Director instruction is:

> Allow the font download needed for the build. Skip my optional visual check. Begin testing after verifying the commit.

Preserve D4 = ALLOW, within the separately restricted font-build lane already defined by the Lead, and D7 = OMIT. Do not ask Tony to decide those again. This amendment does not loosen network isolation or approve new font destinations. The existing v0.2 plan bytes and enforcement details were not included in this ruling ZIP; Lead remains responsible for those controls.

The recorded release does not name the new candidate or an amended plan. Verification against the then-approved candidate stopped on product drift. Therefore this Architect does not treat the old release as sufficient proof of release for the revised candidate. After the Lead supplies the effective revised approval, obtain one short confirmation from Tony extending testing to the new candidate. This is a candidate-release confirmation, not repetition of D4/D7 or a full new intake.

Suggested Director confirmation, used only after Lead approval:

“Extend my Q2 release to candidate f21564cacb563ecddbf78b1685086c9489bf1c26 under the QA Lead's revised approval incorporating the 5 October remote-roster amendment. Keep my font-build permission and skip the optional visual check. Begin after candidate verification.”

## Commit and handoff constraints

All new amendment, diff, identity, approval, release and test records go under `agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/`. Exclude `agent_docs/RESPONSES/response_2026-10-05_193516_apbm-000-q2-held-ruling-request.md` from the proposed QA commit. Do not blanket-stage RESPONSES, config, src, or the entire repository. The roster is already committed; do not reapply it. Existing historical commits containing response documents are not to be rewritten.

The QA Lead/Executor should return a precise selective-staging list after preparing the actual records. If deleting the root pointer, name that deletion separately in the staging list; it is removal of a misplaced QA file, not permission to create QA records at the root. Tony controls commits and push.

Next owner: QA Lead. Complete concrete diff verification, approve the revised binding, then request the single candidate-release confirmation. Q2 and Gate Q remain pending.
