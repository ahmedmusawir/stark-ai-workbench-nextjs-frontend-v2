# Frozen rulings at assembly — 14 October 2026

| ID | Ruling | Authority and effect |
|---|---|---|
| R001-01 | Single signed-in-user functionality, existing login, existing cloud bundle | Tony's 14 October scope direction. This is a functional demo scope, not a multi-user production certificate. Server authorization remains required. |
| R001-02 | ADK is catalogue and transcript authority; no frontend chat_sessions dependency for the workspace | Architect recommendation accepted by Tony; live capability evidence. No SQL prerequisites for the core flow. |
| R001-03 | Defer workspace rename/archive; hide controls and remove misleading promises | Tony's 18:16 approval of the explicit deferral. Supersedes APBM000 R000-07 only for this workspace release. Historical code outside this route is not broadly deleted. |
| R001-04 | Newest-created first using observed ADK timestamp, deterministic ID tie-break | Architect ruling accepted at launch. Do not market that field as last activity or fetch every transcript just for sorting. |
| R001-05 | Explicit empty/missing/unavailable/access/uncertain outcomes replace error-to-[] | Architect ruling supersedes prior frozen A1/A2 error behavior in affected services. Review and migrate all consumers/tests; no silent legacy break. |
| R001-06 | Use tested camelCase ADK wire format; never recreate/resend continuation on 404 | Tested deployed contract. New UUID session creation is separate from continuation. Supersedes old fallback tests deliberately. |
| R001-07 | Uncertain delivery is not automatically resolved by text/cursor/stateDelta | Marker was absent from returned stored events. Check history refreshes evidence only. Explicit user acknowledgement may allow further new messages without asserting the prior send succeeded. |
| R001-08 | Preserve design; repair sidebar continuity and race behavior | Approved shell/tokens remain. New-draft view must keep conversation navigation. No fixed six-file limit. |
| R001-09 | Configuration separation tested with local fixture endpoints; one named live bundle | Preserve manifest and configuration flexibility. Second live backend/Hermes and cross-user live tests deferred from this demo qualification. |
| R001-10 | New modules include QAM; engineering 2 passes + QA 2 passes is the target | Tony's 14 October instruction and QAM playbook. Extra recon/repair when necessary, never suppress a genuine stop. |
| R001-11 | Server identity is authoritative; reject supplied mismatched user_id with 403 | Do not forward untrusted identity. Missing authenticated user = 401. Normal internal requests need no browser-selected user ID. |
| R001-12 | No deployment authorization or risk waiver implied | Existing unauthenticated ADK access remains documented. Any public deployment needs its own release decision. |

Subsequent rulings: append date, approving seat/source, original requirement, exact correction, affected ACs/paths and rationale. Never edit prior results to make them look compliant.
