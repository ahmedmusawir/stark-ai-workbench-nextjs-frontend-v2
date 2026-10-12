# Phase map — two build phases

| Stage | Outcome | Current status |
|---|---|---|
| Preparation | Recon, cloud capability evidence, current theme extraction, canonical lock, final design, Architect assembly | Complete for the supplied baseline; Engineer checks material drift on entry |
| APBM_000 | FFM workspace implementation and fixture-backed UI QA; preserve existing service integration | This assignment, ready for Engineer preflight; no build yet |
| APBM_001 | Verified server identity, real create/list/reload/resume, request isolation, backend namespace, recovery and config-switch qualification | Planned, NOT AUTHORIZED by this pack |
| Engine 2 | Whole-app reviews after build phases, then separately scoped remediation | Later |
| Deployment / Gate D | Verify exact deployed revision when Tony authorizes hosting/release | Not scheduled or authorized here |

After APBM_000 Gate Q/closeout, refresh only affected recon against the new actual HEAD and verify schema/RLS before authoring APBM_001. Phase 001 will contain its own frozen acceptance, request budgets, dedicated accounts and QAM. Do not copy the original SHA into a future certificate.

Live cloud probe already supports two Greeting Agent sessions with separate stored/recalled markers for one test identity. It does not establish frontend correctness, cross-user authorization, datastore provenance, restart durability or Hermes runtime isolation. No repeat live probe is needed for phase 000.

Configuration-only compatibility is preserved by architecture here, tested as frontend configuration routing and namespace separation in phase 001, and qualified against a named second live ADK/A2A/Hermes target only when available. Generic compatibility with every ADK bundle is never a blanket certificate.
