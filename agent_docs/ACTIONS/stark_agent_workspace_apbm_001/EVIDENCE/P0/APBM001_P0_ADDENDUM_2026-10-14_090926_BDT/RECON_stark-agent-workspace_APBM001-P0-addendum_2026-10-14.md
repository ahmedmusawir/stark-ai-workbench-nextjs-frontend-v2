# P0 ADDENDUM — APBM_001 environment evidence (Supabase `chat_sessions`, ADK deployment)

**Date:** 2026-10-14, Asia/Dhaka (UTC+06:00). **Seat:** Claudy, Engineer and checkout owner. Tony retains Git.
**Authority:** Architect instruction of 2026-10-14 ("APBM001 recon accepted for package authoring … prepare the remaining P0 environment evidence").
**Parent report (unchanged):** `RECON_stark-agent-workspace_APBM001-prep_2026-10-12.md`. **APBM_001 NOT LAUNCHED.** DIRECTOR-OBS-001 stays UNTRIAGED-live.
**Baseline:** HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`, `frontend-apbm-0001` (= `main` = `origin/main`). There are no product, config, test or ACTIONS changes (`…_evidence/baseline-git.txt`).
**Labels:** EVIDENCE / INFERENCE / CLAIM / GAP / QUESTION, as in the parent report.

## 1. Result

**P0 is not yet established. It is ready for one short owner-run pass.** This seat has **no existing authorized access**:
- `gcloud`, the Supabase CLI and `psql` are absent here.
- No record grants this seat cloud-console, Supabase or database access.

So no cloud or database call was made (`…_evidence/environment-access.txt`). Everything that records can settle is settled below. The rest closes with the owner-run kit in §2.

| P0 item | Established now | Status | Closed by |
|---|---|---|---|
| Intended Supabase project | Only identifier in records: `zldxzlbkoayhyhzxpjrq.supabase.co`, from the **predecessor Streamlit** extraction (`_extraction/00-REPO-PROFILE.md:148`). Nothing ties it to this app | CANDIDATE only (CLAIM) | P0-1 (prints this app's public project ref) |
| `public.chat_sessions` existence / columns / defaults / constraints / indexes | Checked-in DDL only (`supabase/chat_sessions_setup.sql:13-52`). Running it was a **pending** step in July, with no later execution record (parent §6, H1) | GAP: deployed state unverified | P0-2 |
| RLS enabled/forced, policies, grants | Declared: RLS enabled; SELECT/INSERT/UPDATE own-row for `authenticated`; no DELETE policy | GAP | P0-2 |
| Intended ADK service / region | Record: the 10-04 Director-authorized target `https://adk-bundle-prod-v2-952978338090.us-east1.run.app` (`RECON_ADK_CONTINUATION_20261004-115739.md:50`). That gives service **`adk-bundle-prod-v2`**, project number **`952978338090`**, region **`us-east1`** (Cloud Run deterministic URL format) | EVIDENCE of record; INFERENCE of mapping. Whether this app's `ADK_BUNDLE_URL_V1` points there is **unverified** (10-03: loopback; 10-05: "remote cloud", CLAIM) | P0-1, then P0-3 |
| Deployed revision / image | Not in any record | GAP | P0-3 |
| Session storage implementation and persistence configuration | Not in any record. Kickoff CLAIM: "existing … ADK v1 deployment, with its existing Supabase-backed history" (`STARK_AGENT_WORKSPACE_KICKOFF_v0_1.md:12`) | GAP (configured state unknown) | P0-3, plus P0-4 if needed |
| Experimentally proven durability | **OBSERVED:** stored events served seconds after a reply (BIM-002 N7, July: `BIM002/RETROSPECTIVE.md:37-41`). Two sessions listed, read back and appended within ~3 minutes (10-04 probe). **Not shown:** survival across restart, revision change or instances | Persistence over minutes proven for one service; **restart durability UNPROVEN** | A later P2-class probe (not run; consolidated in the package) |
| Ingress and invocation authorization | Not in any record. **INFERENCE:** the app sends no `Authorization` header (`chatService.ts:43-48`; routes forward only an inbound header), yet live replies worked on 10-05 (CLAIM). So that target accepted unauthenticated server-to-server calls, consistent with a public invoker or a non-Cloud-Run target | GAP (configured state unknown) | P0-3 |

## 2. Owner-run kit (exact, minimal; about 5 minutes; nothing to design)

The files are in `…_evidence/`. All are read-only. Each prints only allowlisted non-secret metadata and is safe to paste back. Each was self-tested offline against fake-secret fixtures (`selftest.txt`: 22/22 PASS). **No step reads application rows, restarts, deploys, invokes an agent or creates a session.**

| Step | Where | Run exactly | Returns |
|---|---|---|---|
| **P0-1** Target identity | This machine, repo root | `python3 -I agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_1_frontend_target_identity.py` | Chat mode; **this app's Supabase project ref** (public); ADK URL class (loopback, or Cloud Run service + region + project number). Reads only 4 named settings and never prints keys or full URLs. Tony runs it; Claudy does not read `.env` |
| **P0-2** `chat_sessions` catalog | Supabase Dashboard → the project whose ref P0-1 printed → SQL Editor | Paste all of `p0_2_supabase_chat_sessions_readonly.sql` → **Run** → copy the single JSON cell | `table_exists`; columns/defaults; constraints; indexes; RLS enabled/forced; policies; ACL grants; effective privileges for `anon`/`authenticated`/`service_role`; triggers; similarly named tables; ADK-like table *names* (no rows). A single catalog-only `SELECT` |
| **P0-3** ADK Cloud Run metadata | Google Cloud Shell (has `gcloud` + `python3`) → ⋮ → Upload `p0_3_adk_cloud_run_metadata.sh` | `bash p0_3_adk_cloud_run_metadata.sh` (defaults `adk-bundle-prod-v2 us-east1 952978338090`; pass P0-1's service/region/project if they differ; a project ID also works) | Service URL, **ingress**, invoker-IAM-disabled flag, serving revision(s), image digest, min/max scale, concurrency, session affinity, Cloud SQL attachments. Masked command/args. Env **names** with value reduced to URI scheme/host class (Supabase ref if a Supabase DB). Secret **reference names**. **IAM bindings** with `allUsers` flagged and user emails redacted. `storage_hints`. Uses only `describe`/`get-iam-policy`; needs `roles/run.viewer` |
| **P0-4** (only if P0-3's `storage_hints` say the session config isn't visible, or P0-1 shows a non-Cloud-Run target) | Machine with the ADK bundle repo | `bash p0_4_adk_bundle_source_scan.sh /path/to/adk-bundle-repo` | Masked lines for session-service config, `get_fast_api_app`/`api_server` usage, the `google-adk` version pin and deploy flags. Skips `.env*`, venvs and `.git` |

**Return:** paste each output back into the Claudy session, or save it as `p0_1_result.json` / `p0_2_result.json` / `p0_3_result.json` / `p0_4_result.txt`. Claudy then records the P0 results without any further access.

## 3. How results will be classified (configured vs proven)

| Observation | Configured persistence | Proven durability |
|---|---|---|
| Session URI `postgresql…`/`mysql…` to an external DB (Supabase pooler/direct, Cloud SQL) | Persistent DB-backed session service (configured) | Still needs a restart/revision-change re-read (P2-class). A Supabase ref equal to P0-1's means **ADK history shares the frontend's Supabase project** |
| `agentengine://…` | Managed Vertex AI session service (configured) | Same: needs a re-read |
| `sqlite://…` on Cloud Run | Per-instance file on ephemeral container disk | **Not durable** across instances or restarts (INFERENCE from the Cloud Run filesystem model) |
| `adk api_server` with no session URI / `memory://` | In-memory. CLAIM: ADK CLI default when no session URI is given; confirm against the bundle's `google-adk` pin (P0-4) | **Not durable.** With max scale > 1 or scale-to-zero, sessions vanish. This would strongly support DIRECTOR-OBS-001 H3 and parent dependency D1 |
| Custom server (no `adk` entrypoint) | Decided by P0-4 | — |
| Ingress `all` + `allUsers` invoker | — | Publicly invokable: frontend identity cannot protect ADK (parent D6) |
| Invoker IAM without `allUsers` / ingress `internal*` | — | Callers need ID tokens or VPC/LB. **Contradicts** the 10-05 unauthenticated live use, unless the app targeted something else; reconcile with P0-1 |
| P0-2 `table_exists=false`, or schema/RLS ≠ checked-in DDL | — | Settles DIRECTOR-OBS-001 H1/H2 **for schema**. The live symptom still needs P1 to be formally triaged |

## 4. Architect clarifications carried into package authoring

The 10-12 report is not edited; these supersede its wording where they conflict.

- **C-1 Cancellation.** Client and server timeouts already abort requests (`AbortSignal.timeout` at `chatService.ts:47,86`; `adk.ts:146,170`; `history/route.ts:49`), as acknowledged. The gaps are:
  - (a) navigation- and identity-driven cancellation of in-flight list/history/send (`Workspace` guards discard late results, but requests continue);
  - (b) propagating a client abort to the Next.js route (`req.signal` unused) and on to ADK.

  This replaces the shorthand "no request is ever cancelled" in parent §1 bullet 5 and the §5.4 lead sentence.
- **C-2 Uncertain-send reconciliation.** An `uncertain` send may resolve only on reliable operation/event evidence that binds the attempt to a stored turn. Candidates:
  - an operation ID issued before the send, recorded with the ADK invocation/event IDs;
  - a pre-send event cursor plus attributable event metadata.

  **Identical message text alone is never sufficient** (repeats and concurrent tabs make it ambiguous). This amends parent §10.2 item 7 and AC001-05. QUESTION for the Architect: which mechanism? Whether ADK accepts a client-supplied operation marker is UNVERIFIED.
- **C-3 Probes.** P1–P5 were **not** executed. The operation totals in parent §7.3 are proposals for the package to consolidate.

## 5. Boundaries and preservation

- **Not done:** no `.env` read or hash, no environment dump, no secret retrieval, no private-retention or digest-bearing archive access, no application-row read, no schema change, no restart/deploy/agent call/session, no product/test/config/dependency edit. Git read-only.
- **Preserved:** the 10-12 recon report and evidence, and every APBM_000 record (`final-state.txt` confirms by hash against the 10-12 FILE_INDEX).
- **Package:** `/home/moose/Downloads/APBM001_P0_ADDENDUM_2026-10-14_090926_BDT.zip` with `FILE_INDEX.md`. Its SHA-256 is in `…_RECEIPT.txt` beside it. Summary: `agent_docs/RESPONSES/response_2026-10-14_090926_apbm001-p0-addendum.md`.
