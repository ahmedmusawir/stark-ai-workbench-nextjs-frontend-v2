# DIRECTOR-OBS-001: Executor addendum 001 (facts only, no diagnosis)

Recorded 2026-10-05T18:26+06:00 by the independent QA Executor (Claudy). The Lead's original finding (`DIRECTOR-OBS-001.md`, SHA256 `11f614bf…3f6d`) is left unchanged. This addendum adds Tony's direct report to the Executor and checkout facts observed read-only. It does not change state, severity or classification. Those belong to the Lead.

## Tony's words to the Executor (verbatim, 2026-10-05)

> "i logged in normally, spoke with all my boyz live ... i mean from the remote cloude ADK bundle ... jarvis, greeting calc etc. all looks good ... but nothing is remembered ... multi session options are there but doesn't work ... a few things i have questions about but i guess i can wait for the full product ... look and feel is perfect ... didn't try the mobile version yet ... that's ok let's move on"

## Checkout facts relevant to the observation (read-only inspection)

| Fact | Evidence |
|---|---|
| The served roster was **not** the committed candidate's | Working-tree `config/agents.manifest.json` was modified at 2026-10-05 13:33:50 +06:00 (uncommitted). SHA256 is `6c27f420…b6d9`; the candidate's is `638e95a1…7ae8`. The agents became greeting_agent, jarvis_agent, calc_agent, product_agent, ghl_mcp_agent and moose_mcp_agent, all on bundle `v1`. The candidate has architect/hermes/designer/devops/ghl_mcp. |
| The candidate manifest is kept beside it | Untracked `config/agents.manifest_hermes.json` (mtime 2026-10-03 18:22) is byte-identical to the candidate manifest (`638e95a1…`). |
| Bundles/urlEnv unchanged by the swap | The diff touches only the `agents` array. The `v1 → ADK_BUNDLE_URL_V1` and `v2-local → ADK_BUNDLE_URL_V2_LOCAL` entries are unchanged. The bundle URL comes from the private `.env.local`, which QA did not read. |
| Reported symptoms | Live replies worked for several agents. "Nothing is remembered." Multi-session controls appear but "don't work". Mobile not tried. No URL, mode, session ID, metadata-warning text or list state was reported. |

## Implications for triage (not conclusions)

- Tony's live run used a **locally modified roster** on top of candidate 22ce03b. A roster-only change of this kind is a supported configuration edit (DATA_CONTRACT allows presentation fields; R000-03 preserves the committed IDs). It still means the observation is **not** of the exact committed candidate configuration. The offline Q2 A+B scenarios (plan v0.2 §11.3) do not depend on roster identity.
- The report is consistent with the Lead's hypotheses (catalog write/list path empty or failing, or in-memory-only thread). Nothing here distinguishes them. Executor will not run live diagnostics.
- Before Q2 can run, the working-tree manifest must equal the candidate again (see the pending-decision report). The swap is a **config drift stop condition** for Q2 identity, not a product finding.
