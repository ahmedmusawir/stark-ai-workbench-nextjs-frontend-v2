# Proposed selective commit inventory

Candidate `8eb5789d9021ad06c15db36db74419a2b5c68fc5`; actual `qa/frontend-apbm-000`. **Proposal only; no staging/commit/merge/push/branch operation.** 600 outstanding paths at this capture; the exact path-specific JSON includes every current outstanding path, existing QAM asset, maintained harness dependency and retained Stage E path, plus explicitly reserved post-export files.

| Class | Paths |
| --- | ---: |
| LOCAL_RETAINED_OUTPUT_OR_CACHE | 1128 |
| LOCAL_RETAINED_ARCHIVE | 16 |
| DIRECTOR_DECISION_PUBLICATION_HOLD | 8 |
| PROPOSED_GIT | 595 |
| ALREADY_VERSIONED_RETAIN | 616 |
| DIRECTOR_DECISION_HISTORICAL_PLACEMENT | 4 |

Proposed Git paths: **595**, literal lines in `proposed-git-paths.txt`. Include durable safe QAM evidence/records, independent instrument corrections/copies and current scoped documentation. Existing clean tracked dependencies need no staging. Do not blanket-stage QAM or treat all untracked assets as disposable.

Director decisions: publication hold on two records and six archive copies; historical nested startup-output placement. Originals stay unchanged. Local retained: archives, caches, build output and installed dependencies. No cleanup/untracking/relocation is authorized. The JSON lists held record/archive identities as public file identities, never the private-file digest. No held payload enters the new ZIP. Root historical recovery/session pointers remain in history; current routing uses QAM.

`tests/workspace/repair.config.ts` and `repair.spec.ts` depend on the preserved QAM engineering-repair harness/evidence paths. The maintained workspace harness, loader, network guard, fixtures and independent/secondary copies stay available. Node dependencies and Stage E production/dev output remain installed/retained locally and are excluded from the review ZIP. Git integration awaits Architect review, Tony's publication decision and selective Director-owned Git operations.
