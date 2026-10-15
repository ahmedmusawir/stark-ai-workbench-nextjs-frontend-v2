# APBM_001 P0 addendum: ready for one owner-run pass (about 5 minutes). APBM_001 NOT LAUNCHED.

**Package:** `/home/moose/Downloads/APBM001_P0_ADDENDUM_2026-10-14_090926_BDT.zip` (SHA-256 and content check in the `…_RECEIPT.txt` beside it)
**Addendum:** `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14.md` (+ `_evidence/`)
**Baseline:** HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` on `frontend-apbm-0001`, unchanged. The 10-12 recon and all APBM_000 records are preserved.

## What I could establish from records

- **ADK target (from the 10-04 record):** service `adk-bundle-prod-v2`, project `952978338090`, region `us-east1`. It's not yet confirmed that the app's `ADK_BUNDLE_URL_V1` points there.
- **Supabase project:** the only ref in the records, `zldxzlbkoayhyhzxpjrq`, belongs to the old Streamlit app, so it's a candidate only.
- **Not in any record:** the ADK revision, its session-storage setting, its ingress/IAM settings, and the deployed `chat_sessions` schema/RLS.
- **Durability:** sessions have been shown to persist for seconds to minutes. Survival across a restart is **not** proven.

## Why there's an owner-run kit

This seat has no authorized cloud or database access, and `gcloud`, the Supabase CLI and `psql` aren't installed here. So I made no remote calls and built four read-only steps for Tony. All four were tested offline against fake secrets (22/22 PASS):

1. **P0-1:** `python3 -I agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_1_frontend_target_identity.py` (repo root). Prints this app's Supabase project ref and the class of the ADK URL; no secrets.
2. **P0-2:** paste `p0_2_supabase_chat_sessions_readonly.sql` into the Supabase SQL Editor for that project and run it. It's one catalog-only `SELECT` that returns one JSON cell and reads no app rows.
3. **P0-3:** in Cloud Shell, `bash p0_3_adk_cloud_run_metadata.sh`. It shows the revision, ingress, IAM (public or not), scaling and session-storage hints. Env values and secrets are never printed.
4. **P0-4 (only if P0-3 can't show the storage config):** `bash p0_4_adk_bundle_source_scan.sh /path/to/adk-bundle-repo`.

Paste the outputs back here and I'll record them. Addendum §3 says how each result will be classified (configured persistence vs proven durability).

## Clarifications carried forward (addendum §4)

- Timeout aborts already exist. The gaps are cancellation on navigation or identity change, and propagating a client abort through the route to ADK.
- An uncertain send can resolve only on operation/event evidence, never on matching message text.
- P1–P5 were not run.

**Limits I kept to:**
- No `.env` reads, environment dumps or secrets.
- No application rows read, no schema changes.
- No restarts, deploys, agent calls or sessions.
- Git was read-only.
