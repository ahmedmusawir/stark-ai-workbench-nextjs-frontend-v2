# JARVIS Architect handoff

The canonical workspace/style tile is recorded as Tony-approved. The final design package now includes the directory and explicit conversation HTML/PNG artifacts. Both themes and375/768/1280 coverage are supplied. The conversation retains the existing chat renderer’s visual character and adds the approved shell, identity and navigation.

Use UI_SPEC.md and COMPONENT_MANIFEST.md to reconcile design with the existing `/chat` app, data contract and APBM_000. Retain ADK transcript authority and the backend/user/agent/session namespace. Fixture state transitions establish visual intent only. Demo context remains visibly demo-only in the product.

TOKENS.css remains a standalone :root/.dark export. TAILWIND_MAPPING.md and WORKSPACE_TOKENS.scoped.css propose route-container plus portal-host scoping with unchanged approved values. Reconcile wrapper container forwarding and workbench-only zinc variants before installation. Sheet/Accordion wrappers remain absent; the two documented compositions use installed primitives/native disclosure without another library.

No material scope conflict or pending Tony visual decision was found. Production route syntax, actual store/service binding, portal wiring and backend metadata/schema details remain assembly/engineering decisions under their existing authorization. No new canonical approval round is required. Engineering launch, APBM acceptance freeze, independent QA and Gate Q are separate.
