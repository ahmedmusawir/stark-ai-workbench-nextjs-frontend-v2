# FILE_INDEX — APBM001_P0_ADDENDUM_2026-10-14_090926_BDT

Generated 2026-10-14T09:10:50+06:00. Repository HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`, branch `frontend-apbm-0001`.
Contents: the new APBM_001 P0 addendum, its read-only owner-run kit and selected non-sensitive metadata only.
Excluded by design: .env files/values, credentials, environment dumps, private retention originals, every APBM_000 ZIP, Q5_PROPOSAL_PATHS.json, POST_Q5_INVENTORY.json, self-test fixtures (fake secrets; scratchpad only), product source.
This index lists every other member; it does not hash itself.

| Archive path | Repository source | Bytes | SHA-256 | Purpose |
|---|---|---:|---|---|
| `RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14.md` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14.md` | 10109 | `fc63e2ef58cbead77327098ef2d2fdf806b8e9661c408c4d1b7bb16e4a4700ee` | P0 addendum (short) |
| `response_2026-10-14_090926_apbm001-p0-addendum.md` | `agent_docs/RESPONSES/response_2026-10-14_090926_apbm001-p0-addendum.md` | 2845 | `2611c772a9f0c06842ab5b2f4e4cd1c4dfc262ce582f88acdd665991b9de809c` | RESPONSES summary |
| `owner-run/p0_1_frontend_target_identity.py` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_1_frontend_target_identity.py` | 3846 | `d9e6495976d075a4725320ee50e2654279bc281a2ca8e34cd88b036acb2e5acf` | Owner-run: local target identity (public identifiers only) |
| `owner-run/p0_2_supabase_chat_sessions_readonly.sql` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_2_supabase_chat_sessions_readonly.sql` | 5694 | `4bc8b3aeed390b0f4ac7883100a9c0008f0445cea6e1b13426d3608fcb2fd75a` | Owner-run: single catalog-only SELECT for public.chat_sessions |
| `owner-run/p0_3_adk_cloud_run_metadata.sh` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_3_adk_cloud_run_metadata.sh` | 11516 | `b05e29429d7981a44a74635b5a5ac3fab064977e31c741297745cce062631ae0` | Owner-run: Cloud Run describe/get-iam-policy, allowlisted output |
| `owner-run/p0_4_adk_bundle_source_scan.sh` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_4_adk_bundle_source_scan.sh` | 2133 | `d1334cc50ec3e8f51f507f5e2bde70f75fb7a77646f5a1eeae9cf919b68d2ef6` | Owner-run (optional): masked ADK bundle source scan |
| `evidence/records-scan.txt` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/records-scan.txt` | 2772 | `092956bb2f775d53f0d69d0ec63fbacb680c932b8889b0c5d824f2ef755b8256` | Non-secret records: ADK/Supabase identity, storage claims |
| `evidence/environment-access.txt` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/environment-access.txt` | 961 | `93c4bbf38782af300598e4f86a9a5affd3cbc9512695118747d3912c4e1a012b` | Access determination (no authorized cloud/DB access) |
| `evidence/selftest.txt` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/selftest.txt` | 2125 | `96f6cc0928f4dda558ed80ecec0c067d2190245ad2da48c786cc8a1e9d120e47` | Offline kit self-test 22/22 with script hashes |
| `evidence/baseline-git.txt` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/baseline-git.txt` | 1895 | `951fc534f3c7f7984a4e84af4e1df5b975fe9958205ba00585470c2d35929142` | Read-only Git baseline |
| `evidence/final-state.txt` | `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/final-state.txt` | 3458 | `68df97ea34f4cb2d1acb71031ae88f4c01308c42c7233f7de09c20cf65584b71` | Final state + 10-12/APBM_000 preservation checks |
