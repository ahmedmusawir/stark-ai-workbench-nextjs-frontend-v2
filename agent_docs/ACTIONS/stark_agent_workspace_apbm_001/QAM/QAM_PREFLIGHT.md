# Executable readiness obligations

Run from the actual repository root. Confirm commands exist before executing and capture exit status. Read-only Git may use --no-optional-locks. No command below implies Git mutation.

| Check | Action | Expected / owner if blocked |
|---|---|---|
| Identity | git rev-parse --show-toplevel; git branch --show-current; git rev-parse HEAD; git status --short --branch; git diff --name-status; git ls-files --others --exclude-standard | Expected repo and phase branch; complete inventory. Director resolves wrong branch/candidate. |
| Candidate | Compare actual full SHA and ancestry/diff to baseline and Director's engineering receipt | Product candidate pinned separately from QA-doc successor; unexpected product changes stop. |
| Contract | Read actual acceptance/data/rulings and hash non-secret source files | All paths exist; no unresolved grading conflict. Architect resolves ambiguity. |
| Handoff | Inspect manifest/engineering report/claim matrix and command evidence | Factual entries complete or consolidated blockers; Engineer supplies omissions. |
| Setup | node --version; npm --version; inspect package/lock/scripts; check browser executable and unused loopback ports | Match locked project. Record actual versions. No blind install/upgrade. |
| Build | Use recorded typecheck/build/test scripts in isolated QA-controlled processes | Builds from candidate; stale build artifacts cannot substantiate compile claims. |
| Target | Safe running-server config descriptor and guarded test connection | Mode=live, intended bundle identity, auth project ref. Never read/hash/export .env.local. |
| Auth | If helper used: git check-ignore .env.qa.local; git ls-files --error-unmatch .env.qa.local must show not tracked; helper schema validation emits no values | Target/account authorized; Director supplies login if absent. Unexpected identity stops. |
| Browser | One bounded readiness open/login/navigation within Q1 caps | Driver renders app; capture no auth traces. This is not AC011/012 completion. |
| Instrument | Validate network guard, fixture auth isolation, event counters and privacy scanner using synthetic controls | Bad measurement → STOP-INSTRUMENT before relying on it. |
| Export | Safe-path ZIP/index/privacy trial under QAM evidence with synthetic content | Exact hash/member agreement; evidence route available. |

Stops: STOP-IDENTITY wrong candidate/concurrent writes; STOP-CONTRACT unresolved grading; STOP-ENV wrong target/missing essential tool; STOP-AUTH missing/unexpected login; STOP-AUTHORITY exceeded effects/write lane; STOP-INSTRUMENT invalid measurement; STOP-EVIDENCE cannot retain/export; STOP-PRIVACY exposure. Record time, candidate, affected ACs, evidence, owner, remedy and safe resume point. Aggregate independent readiness gaps; don't exceed authority to finish a checklist.

Reuse valid readiness evidence by identity and provenance. Do not reinstall or rerun everything at every phase without cause. Changes affecting a required proof require a fresh check. Scope a first environment diagnostic retry; preserve both outcomes. No empty-diff/grep over missing paths counted as PASS.
