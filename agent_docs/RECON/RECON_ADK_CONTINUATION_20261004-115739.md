# ADK capability probe — continuation

**Verdict: SUPPORTED FOR THE TESTED CASE.**  
**Seat:** Cody / Codex, Engineer. **Date:** 4 October 2026, Asia/Dhaka (UTC+06:00).  
**Assignment:** Remaining bounded direct-cloud probe; continuation of `RECON_ADK_FRONTEND_20261003-234722.md`. This is recon evidence, not Gate Q certification.

## 1. Director summary

- **Observed:** Both existing sessions returned the expected agent/user/session identities and original user/ACK exchanges. Neither history contained the other marker.
- **Observed:** The exact agent/user session list returned both `session-a` and `session-b`.
- **Observed:** One camelCase `POST /run` per session returned its own earlier marker, without either marker being included in the submitted question.
- **Observed:** Final detail GETs each returned four events: the original two unchanged, followed by the resume question and correct reply. Returned run event IDs match stored model event IDs; A/B event IDs are disjoint.
- **Observed:** No tool calls appear in the returned run or stored history events. GCS context behavior remains Director-supplied context; no GCS content was read or changed by this probe tooling.
- **Budget:** Six service GET requests including one ambiguous timeout, two POST requests, zero creates/deletes, and zero automatic retries. One additional sandbox access attempt failed DNS before an HTTP request could be sent. All attempts are retained in the ledger.
- **Limit:** This proves the tested direct-API history/list/resume case with Director-created sessions. It does not certify frontend behavior, user authorization, a Supabase implementation, or restart durability.
- **Next:** JARVIS should select the pilot deployment/agent roster and freeze the authenticated session-ownership and conversation-catalogue recovery contract, using this backend evidence plus the prior frontend findings.

## 2. Repo/runtime identity and checks

| Item | Recorded state |
|---|---|
| Repo root | `/home/moose/NEXTJS/stark-ai-workbench-nextjs-frontend-v2` |
| Branch, before and after | `frontend-apbm` |
| Full HEAD, before and after | `20ef380bdd6eed5e111d953d6404992add7a88a6` |
| Start | 2026-10-04T11:57:39.479567+06:00 |
| Starting tracked state | `CHANGELOG.md` and `RECOVERY.md` modified; 24 response Markdown files already deleted |
| Starting untracked state | 16 files: kickoff packet, prior report, prior evidence files and 3 October session log |
| Preservation | Starting tracked and untracked file hashes checked; only authorized logging documents changed among pre-existing files. Existing deletions remain deleted. See `repo-state.json`. |
| Applicable instructions | Root `CLAUDE.md`, `RECOVERY.md`, current session log; kickoff and prior recon report. Earlier historical module assignments remain inactive. |
| Authorization | Latest Director launch explicitly authorizes this probe and documentation, supplies the target, namespace, prior state and request structure, and supersedes the original create/send steps. |
| Checks run now | Bounded API checks, exact sanitized-event comparison, request-budget checks, repo preservation, archive integrity and sanitization. Full recon/product tests were not repeated. |

Daily session: `session_2026-10-04.md`. The root response-logging convention is followed: the short return note is saved before screen output. No source, tests, frontend environment, manifests, dependencies, SQL, GCS content, deployment configuration or Git state was changed.

## 3. Session capability matrix

| Capability | Evidence provenance | Result | Remaining limit |
|---|---|---|---|
| Creation and first messages | Director reported two creates and two initial runs, all HTTP 200; Engineer observed their stored exchanges | Carry-in identities and histories verified | Engineer did not execute or independently capture those creation responses |
| Two sessions for one agent/user | Engineer detail GETs and list | PASS: A and B distinct and discoverable | Only this namespace/agent/service |
| Original history separation | Engineer baseline detail GETs | PASS: own marker/ACK, no other marker, two events each | No claim of authorization isolation between different users |
| Resume recall | Engineer one `/run` per existing ID | PASS: A → `amber-lantern-7c7e`; B → `blue-orbit-479f` | Simple marker recall only |
| Stored append and separation | Engineer post-resume detail GETs | PASS: original prefix preserved, exact two-event append, correct run/stored event IDs, no other marker | Does not identify storage engine or restart durability |
| Next.js/index/UI integration | Prior source recon only; not exercised now | UNVERIFIED in this probe | Authenticated browser and concurrency/recovery checks remain |

## 4. Live probe, ledger and evidence

### Confirmed target and carry-in

Director-authorized base: `https://adk-bundle-prod-v2-952978338090.us-east1.run.app`. The hostname is supplied target identity, not an exported environment value. It does not establish a deployed revision, ADK package version or storage backend.

Agent: `greeting_agent`. Test user: `stark-apbm-probe-20261004-7c7e479f`.

| Existing session | Director-supplied marker | Director-supplied initial reply | Engineer baseline observation |
|---|---|---|---|
| `session-a` | `amber-lantern-7c7e` | `ACK amber-lantern-7c7e` | Exact identity; original user instruction and ACK present; B marker absent |
| `session-b` | `blue-orbit-479f` | `ACK blue-orbit-479f` | Exact identity; original user instruction and ACK present; A marker absent |

The Director also supplied that Greeting Agent reads instructions/resume context from GCS and its context tool is read-only. Those statements are not independent observations of deployment configuration.

### Requests and access handling

All history paths have prefix `/apps/greeting_agent/users/stark-apbm-probe-20261004-7c7e479f/sessions`; detail adds `/session-a` or `/session-b`. The list uses the prefix itself. All model calls use `/run`. No redirects or automatic retries are enabled. GET timeout: 25 seconds; POST timeout: 60 seconds; response-size bound: 2 MB. Exact routes, payloads, timestamps and errors are in `request-ledger.json`.

| Attempt | Start (Dhaka) | Operation | HTTP status | Elapsed seconds | Result |
|---|---|---|---|---|---|
| 1 | 11:58:16 | GET get-a-before | No HTTP response | 0.004 | <urlopen error [Errno -3] Temporary failure in name resolution> |
| 2 | 11:58:28 | GET get-a-before | No HTTP response | 25.201 | The read operation timed out |
| 3 | 12:00:01 | GET get-b-before | 200 | 2.594 | Verified; see get-b-before.json |
| 4 | 12:00:35 | GET get-a-before | 200 | 0.571 | Verified; see get-a-before.json |
| 5 | 12:00:47 | GET list | 200 | 0.566 | Verified; see list.json |
| 6 | 12:00:56 | POST resume-a | 200 | 1.773 | Verified; see resume-a.json |
| 7 | 12:01:12 | POST resume-b | 200 | 1.475 | Verified; see resume-b.json |
| 8 | 12:01:24 | GET get-a-after | 200 | 0.524 | Verified; see get-a-after.json |
| 9 | 12:01:33 | GET get-b-after | 200 | 0.575 | Verified; see get-b-after.json |

**Accounting clarification:** There were seven GET transport attempts, but at most six service GET requests. Attempt 1 failed DNS in the sandbox before HTTP transmission and charges zero to the service-request budget. Attempt 2 ran through supported approval escalation and timed out without a response; its remote receipt is unknown, so it charges one. After B succeeded, A was inspected using the remaining read allowance. The preliminary progress statement conservatively charged the unsent DNS failure; the final ledger explicitly corrects that distinction rather than hiding the extra access attempt. No POST was retried or duplicated. The six service GET allowance and two POST allowance are exhausted; no further calls were made.

Escalation was supported and allowed. There was no automatic-approval rejection and no bypass, alternate service, provider, identity, manual Director command sequence or network/configuration change. The initial DNS error and subsequent read timeout were recovered access interruptions, not observed backend-capability failures; the cause of the timeout is unknown.

### Exact resume contract

Both runs used this question, byte-for-byte, without an expected marker:

> What test marker did I give you earlier in this conversation? Reply only with the marker. No tools or context lookup are needed.

```json
{
  "appName": "greeting_agent",
  "userId": "stark-apbm-probe-20261004-7c7e479f",
  "sessionId": "session-a",
  "newMessage": {
    "role": "user",
    "parts": [{"text": "What test marker did I give you earlier in this conversation? Reply only with the marker. No tools or context lookup are needed."}]
  }
}
```

For B, only `sessionId` changed to `session-b`. Both responses were arrays containing one model event. CamelCase succeeds in this tested deployment. Snake_case was not tested; no incompatibility conclusion is justified.

### Stored event evidence

Final identities on both detail GETs exactly match the expected `id`, `appName` and `userId`. Before histories had two events; after histories had four. Each initial user instruction was `Remember this test marker for this conversation: <its marker>. Reply only with ACK followed by the marker. No tools or context lookup are needed.` Exact test text, event timestamps and invocation IDs are retained in the sanitized detail evidence.

| Session | Order / role | Event ID | Relevant text |
|---|---|---|---|
| A | 1 / user | `bbc51928-2578-4bb4-ae6b-ebca942075b0` | Initial marker instruction (exact text in evidence) |
| A | 2 / model | `2e833e12-c623-498a-99f8-01b016b729c0` | ACK amber-lantern-7c7e |
| A | 3 / user | `195afd32-1b3b-41f8-be1c-3ef9e167c296` | Resume question (exact text below) |
| A | 4 / model | `72daecf2-b7de-438f-a1e8-55b1f6d11449` | amber-lantern-7c7e |
| B | 1 / user | `13264de3-f4a8-456c-bc76-ee8eea627b51` | Initial marker instruction (exact text in evidence) |
| B | 2 / model | `753d9bd5-42e3-4933-9da9-503a4c6c2090` | ACK blue-orbit-479f |
| B | 3 / user | `7fa190f8-5ad9-4f8a-b50b-60175b61a6bc` | Resume question (exact text below) |
| B | 4 / model | `207715aa-0270-4293-8d6d-5fe50af31410` | blue-orbit-479f |

`verification.json` records all checks. Comparisons establish unchanged sanitized original event prefixes, exact appended question/reply, run-event equivalence, disjoint IDs, own-marker presence and other-marker absence. Opaque thought signatures and unrelated fields were deliberately excluded, so “unchanged” refers to the captured identity/event/text fields, not a byte comparison of full private payloads. No raw response bodies were saved. No tool calls appear in the captured events; that does not assert absence of internal deployment context loading.

## 5. Integration implications

**Prior source-derived findings, not re-tested here:** The frontend already has New Chat, a conversation panel, active-session pointers and a native ADK connector; its conversation catalogue uses Supabase `chat_sessions`, while transcript history is retrieved from ADK. See prior report §§3 and 5, `src/services/sessionIndexService.ts`, `src/app/api/agent/_lib/adk.ts`, and `src/app/(cyberize)/chat/ChatPageContent.tsx`.

**New observation:** ADK list/detail/resume operations work for two carried-in sessions in this service. This removes the prior lack of direct backend capability evidence for this specific target. It does not establish that the current frontend points here or includes `greeting_agent`; no configuration changes were made.

**Architectural inference:** A same-agent single-session backend constraint did not appear in this case. The prior frontend risks still prevent claiming dependable multiple resumable conversations end to end: pending responses/history write into an agent-level message slot without session guards; API ownership trusts client identity; discovery relies on an unverified index without ADK-list reconciliation; local pointers lack user/backend scoping. These are prior source findings and predicted consequences, not live frontend failures demonstrated today.

## 6. Necessary work, unknowns and scope

- **Decision needed:** Select the deployment and roster for the pilot. The kickoff prefers deployed v1; today's Director-authorized target contains `v2` in its hostname. Neither naming convention establishes runtime revision or automatically authorizes migration.
- **Decision needed:** Freeze verified server identity/ownership, canonical conversation keys and catalogue policy: retain the metadata index with explicit reconciliation, or use ADK listing where its contract suffices. Do not infer a duplicate transcript database is necessary.
- **Pilot engineering scope to author:** Session-safe asynchronous state updates, explicit history/error/recovery behavior, user/backend scoping and authenticated end-to-end integration checks, as supported by the earlier recon.
- **Unresolved evidence:** Actual deployed storage implementation, retention/restart behavior, cross-user authorization, multi-agent coverage and Next.js/index/browser operation. No cloud restart, direct database query or other-user history access was authorized or attempted.
- **Optional features:** Rename/archive, document context and instructions UI remain subject to JARVIS's scope ruling. This probe adds no feature authorization.

There is no remaining access blocker for this completed probe. No setup step or further Director intervention is needed to review this package.

## 7. Phase and browser-testing handoff

The earlier provisional APBM_000 workspace/design and APBM_001 live-session split remains a planning choice. This result supplies direct backend evidence to the live-session contract; it does not certify either phase or justify replacing useful working integration with mocks. JARVIS should freeze the App Brief/Data Contract and scoped integration repairs before launching implementation. Later authorized browser coverage should exercise create/list/reopen/reload/switch/resume and pending-request races with server-verified identity. No browser or Playwright setup was performed here.

## 8. Time, interventions and final state

- Continuation start: **2026-10-04T11:57:39.479567+06:00**. Package preparation snapshot: **2026-10-04T12:03:15.020643+06:00**; elapsed **335.5 seconds** to this snapshot. Packaging validation follows without further API traffic.
- Live access/probe span: **198.508 seconds**, from first sandbox access attempt to last history response. Sum of measured request/transport wait time: **33.283 seconds**. Tool approval/agent work is outside those request durations; no estimate is presented as measured approval latency.
- **Director carry-in:** Two sessions and two original exchanges, supplied before launch. **Additional Director interventions during this run: 0.** Supported escalation invocations: **8**, all executed; separately counted from Director interventions. Automatic retries: **0**.
- Unexpected interruptions: one unsent DNS failure and one ambiguous read timeout. Both are preserved in the ledger. No model refusals, authorization HTTP failures or rate limits were observed.
- Final remote state observed: `session-a` and `session-b` remain under the authorized namespace, each with four events. No new sessions or deletions; one resumed user/model exchange added per existing session. Leave these identifiable for Tony's disposition.
- Local additions: this report, short response, same-stem ZIP, minimal evidence and `session_2026-10-04.md`. Updated required logs: `RECOVERY.md`, `CHANGELOG.md`. Probe tooling is temporary under `/tmp`, outside product paths. No build/cache/dependency output generated by this continuation.
- Starting branch/HEAD and pre-existing work preserved; full baseline/final status and preservation checks are in `repo-state.json`. Historical reports and module files were preserved, including pre-existing response deletions.

**Package validation:** Completed at 2026-10-04T12:04:16.281991+06:00; 396.8 seconds from continuation start. Verified 345 tracked paths, 16 unchanged pre-existing untracked files and all 24 pre-existing deletions. ZIP CRC and byte-for-byte entry checks passed; 13 explicitly allowed files, with test-text/event-field allowlists and credential-pattern scan passing. Only required logging documents changed among existing files.

**Conclusion: SUPPORTED FOR THE TESTED CASE.** Direct API listing, stored-history separation and resume succeeded for the two Director-created conversations. This report is Engineer recon evidence, not Gate Q certification.
