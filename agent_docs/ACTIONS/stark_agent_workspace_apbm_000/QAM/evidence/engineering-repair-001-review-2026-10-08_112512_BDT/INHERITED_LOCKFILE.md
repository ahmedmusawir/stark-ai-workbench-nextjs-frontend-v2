# Preserved lockfile change — separate from repair

`package-lock.json` **existed as a local change before repair**. Entry status was exactly ` M package-lock.json`; entry evidence was recorded at 2026-10-08T04:24:12.357371+00:00. Its current bytes and exact diff still match that entry. Nothing was reverted, installed or rewritten during packaging.

**It does change dependency versions.** Relative to HEAD `9c50884d4c4513b6969311d5be7c05828104ed3d`, 162 shared package entries have different versions, 63 entries are added and 19 are removed. These are package-entry counts, including nested/platform dependencies, not counts of unique package names. Root dependency declarations and `package.json` are unchanged.

| Direct dependency | HEAD lock version | Preserved local lock version |
| --- | --- | --- |
| `@google-cloud/storage` | 7.21.0 | 7.22.0 |
| `@tailwindcss/typography` | 0.5.13 | 0.5.20 |
| `jest` | 30.0.5 | 30.5.2 |
| `next` | 16.2.6 | 16.4.0 |
| `postcss` | 8.5.15 | 8.5.29 |
| `sass` | 1.77.8 | 1.105.1 |
| `tailwindcss` | 3.4.6 | 3.4.19 |

Exact diff: [pre-existing-lock.diff](../engineering-repair-001/pre-existing-lock.diff) (1912 additions / 1069 deletions).

Current/entry file SHA-256: `c62a48123a50b5289a6179ebafb1a13960f1c3636992ddcc0df0b435ebf556eb`.
Exact diff SHA-256: `183d53ecee485b8f6608401023cab237201a6dae1e0dd2751f7c1e231ddeed20`.
All version changes, additions and removals: [INHERITED_LOCKFILE_ANALYSIS.json](INHERITED_LOCKFILE_ANALYSIS.json).

This inherited dependency change is excluded from the product/test patch and `staging-paths.txt`. Tony owns its separate disposition. QA must qualify the actual committed candidate and installed toolchain; the repair's recorded results do not establish results for an older dependency tree.
