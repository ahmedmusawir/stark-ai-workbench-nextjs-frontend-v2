# Director authorization — selective local commit and QA Lead package

Received 11 October 2026. Tony's instruction below supersedes the earlier manual-only commit instruction. The supplied Architect review accepted ADDMEMBER_TEST_REPAIR_001 for candidate inclusion as engineering review, not Gate Q certification. No new QA attempt is authorized.

## Tony's current instruction (verbatim)

Cody — Tony authorizes you to perform the selective local commit
and prepare the complete QA Lead handoff ZIP.

Use the existing reviewed staging proposal and intake note.
No additional Director terminal steps are required.

1. Verify the expected branch, parent HEAD and candidate evidence
   from your selective-commit preparation. Check the index and
   working tree for unexpected changes. Preserve unrelated work.
   If a material discrepancy exists, report it without overwriting
   or incorporating it.

2. Stage only the explicitly approved paths, including the QA Lead
   intake note. Check the staged diff, scope and whitespace.
   Exclude RESPONSES, archives, caches, credentials and unrelated
   changes. Do not use blanket staging.

3. Execute the prepared local commit:
   APBM-000: workspace/font repairs and maintained test lifecycle

   Record the resulting full SHA. Confirm the committed product/test
   contents match the reviewed candidate. Report any remaining
   working-tree changes and whether they affect QA execution.

4. After committing, create a candidate receipt under QAM/HANDOFFS/
   with the actual full SHA, branch, parent, committed scope and
   verification results. Clearly identify this receipt as a
   post-commit handoff record; do not amend the candidate merely
   to embed its own SHA.

5. Create one self-contained QA Lead intake ZIP containing:
   - REVIEW_START_HERE.md and the post-commit candidate receipt.
   - QA_LEAD_REPAIRED_CANDIDATE_INTAKE_001.md.
   - Current canonical QAM/HANDOFFS/QA_HANDOFF.md.
   - Installed post-Q2 Lead disposition and relevant authorizations.
   - Engineering repair, dependency reconciliation, diagnostic and
     maintained-test repair returns.
   - Exact cumulative product/test diff and supporting evidence
     needed to review these repairs.
   - An indexed file inventory with SHA-256 hashes.

   Preserve repository-relative paths. Include the relevant files
   directly, not nested review ZIPs. Exclude credentials, .env,
   private chat data, dependencies, caches and build output.
   Keep all repository QA records inside QAM/.

6. Validate ZIP integrity and inventory hashes. Place an identical
   copy in Tony’s actual Downloads folder.

Do not rerun tests, modify product code, start independent QA,
push, merge, switch branches, amend history or close APBM_000.
Gate Q remains pending. Preserve D4 ALLOW and D7 OMIT.

Return only:
- Commit success and full SHA.
- Any relevant remaining working-tree changes.
- Exact Downloads ZIP path.
- Confirmation that the package is ready for QA Lead intake.
