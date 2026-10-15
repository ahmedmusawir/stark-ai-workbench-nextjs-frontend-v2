# FILE_INDEX — APBM001_ADK_SESSION_DISCOVERY_2026-10-14_123729_BDT

Generated 2026-10-14T12:41:59+06:00. Repository HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5`, branch `frontend-apbm-0001`.
Contents: the APBM001 ADK session-discovery report and its sanitized evidence only.
Excluded by design: .env files/values (none read), credentials, environment dumps, private retention originals, every APBM_000 ZIP, Q5_PROPOSAL_PATHS.json, POST_Q5_INVENTORY.json, raw response headers (trace IDs dropped), product source.
Remote calls behind this package: exactly 2 unauthenticated GETs (`/openapi.json`, `/list-apps`). No session, message, database or login operation.
This index lists every other member; it does not hash itself.

| Archive path | Repository source | Bytes | SHA-256 | Purpose |
|---|---|---:|---|---|
| `response_2026-10-14_123729_apbm001-adk-session-discovery.md` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery.md` | 15502 | `17540159651606189a06c9cddf3b2a4c5a0be8a7e31d1713a76369cf6e5fd5e3` | Report: recommendation, contracts, trace, change set, metadata answer, questions, live-test proposal |
| `evidence/http-requests.json` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/http-requests.json` | 1703 | `1cf1f103b0bc59a59d8bebfbf9ac61390a117cb38d037ce0a6aa910da2c98263` | Ledger of the only 2 remote calls (unauthenticated GETs), status/size/timing/body SHA-256 |
| `evidence/openapi.json` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/openapi.json` | 195000 | `4db73a7f7a3174bdc4e321a57b25ea9f396b5105e395d0e26db0cb1d26977dae` | Raw /openapi.json as served (public schema; placeholder-only secret hits adjudicated) |
| `evidence/openapi-session-contracts.json` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/openapi-session-contracts.json` | 12380 | `99bf35f7d7501330246e766cc2b225fcc4dcfbe39e02e743b5c7fa33f932e1a7` | Extract: path table, session/run operations, schemas, advertised-absent checks, security schemes |
| `evidence/list-apps.json` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/list-apps.json` | 86 | `0cf1db92bd30998286955b7f8a61115820e1189a6377af340dc60d747410660f` | Raw /list-apps as served |
| `evidence/source-anchors.txt` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/source-anchors.txt` | 10232 | `4af1b975725a3fb90b4a383b02edfb2eab9839853e65869910b2aaa9aac86c3b` | Frontend trace anchors with blob identities (user-ID mapping, history, discovery, UI metadata use) |
| `evidence/records-anchors.txt` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/records-anchors.txt` | 3422 | `d42688b28e763d082cb2d7f32f0a7a682e80fbb26d0fb8228d76208f0bb5bdee` | Prior tested behavior on this service (10-04 probe evidence, read only) and timing hint |
| `evidence/baseline-git.txt` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/baseline-git.txt` | 951 | `f4c8df929f103ba5fec5684252f77a27918b3ae38722ed0df44a5828fb0a6eb2` | Read-only Git baseline |
| `evidence/final-state.txt` | `agent_docs/RESPONSES/response_2026-10-14_123729_apbm001-adk-session-discovery_evidence/final-state.txt` | 6489 | `bd514f834ae42ee4fc459eb6bedad9562d0bb7b98b9ed2362ae0ecf34a39797c` | Final state + preservation checks (10-12, 10-14 P0, Downloads ZIPs, manifests, ACTIONS) |
