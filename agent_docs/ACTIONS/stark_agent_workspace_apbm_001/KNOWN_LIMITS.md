# Limits and qualification boundary

| ID | Current evidence / limit | Disposition |
|---|---|---|
| LIM01 | Two old sessions retained ten days; storage engine and actual restart durability unverified | Retain owner-reported Supabase setup separately from evidence. No restart/deployment change in this module. |
| LIM02 | Actual list/get/create/run accepted unauthenticated requests in the tested synthetic namespace | Frontend auth fixes protect the frontend path only. No public deployment/security-complete claim. Tony/DevOps must address or explicitly decide deployment risk. Other advertised endpoints were not exercised. |
| LIM03 | One cloud bundle and Greeting Agent tested | Other agents may use tools; no implied Hermes/A2A/second-target qualification. A/B config separation uses local fixtures. |
| LIM04 | ADK timestamp stayed at creation and run stateDelta marker was absent in captured results | Use creation ordering and explicit uncertain-send handling. No claim marker is durable or run idempotent. |
| LIM05 | First read took 24–26s | Honest loading and bounded deadlines; not proof of cold start or scalability. |
| LIM06 | Rename/archive deferred | Hidden workspace controls, automatic initial titles retained. No transcript deletion substitute. |
| LIM07 | Recovery journal local to same browser | Cross-device pending-delivery reconciliation unqualified. ADK history remains authoritative across clients. No exactly-once guarantee. |
| LIM08 | Frontend auth project and chat DB are distinct | Keep current login; no migrations or direct DB coupling. |

Gate Q may certify only the explicit local frontend/live-bundle scope and its limits. It cannot erase a security finding; the QA Lead classifies implications and Tony owns deployment risk. Gate D and broader production hardening are separate work. A failed required live frontend walk is BLOCKED/FAIL as observed, never excused by these limitations.
