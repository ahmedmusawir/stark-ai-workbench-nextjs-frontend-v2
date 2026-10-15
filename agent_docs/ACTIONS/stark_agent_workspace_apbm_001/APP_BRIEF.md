# Product brief

Tony can sign in, select an available agent, create independent conversations, switch between them, reload/reopen and continue the right history through the existing ADK API. The approved workspace remains familiar and responsive. Errors tell the truth; a lost response never triggers hidden replay.

Five deliverables: authenticated server integration; real conversation discovery/history; reliable creation/continuation/recovery; state/navigation isolation; independent-QA-ready evidence and handoff.

Existing stack and dependencies remain as checked out. Use existing Next App Router, React, TypeScript, Supabase auth helpers and state conventions; no Context rewrite, dependency upgrade or runtime migration. Confirm exact versions from package/lock files at entry rather than importing assumptions from manuals.

In scope: /chat workspace and its owned API/services, bounded legacy consumer compatibility, approved mock mode, browser navigation, server identity, explicit failures, fresh session IDs, scoped recovery metadata, tests and documentation. Title from first message written as initial ADK state, with safe deterministic fallback for older untitled sessions. Ordering is newest-created first.

Deferred: rename/archive/delete controls, extra metadata tables, auth project migration, ADK runtime/IAM/storage changes, streaming redesign, multi-user deployment certification, scale/performance guarantees, second-live-backend or Hermes-chain certification, deployment/Gate D, general dead-code cleanup. Existing demo context/instructions remain clearly labeled and must not write GCS or live agent instructions.

Design retained: zinc/charcoal, Inter, dark default with saved light preference, responsive drawer below 1024px, existing bubbles/markdown/code/copy/read-aloud, 12px panels, 10px controls, 16px composer. Reference the existing APBM000 DESIGN assets and current workspace as the approved baseline. Read and record their identities at entry; do not rebuild the UI from memory. New recovery wording/controls use existing components and tokens.

Success is independently demonstrated in the actual local frontend against the named cloud bundle under Tony's permitted login, plus fixture negatives and regression. Direct API probes are capability evidence only, not frontend acceptance evidence.
