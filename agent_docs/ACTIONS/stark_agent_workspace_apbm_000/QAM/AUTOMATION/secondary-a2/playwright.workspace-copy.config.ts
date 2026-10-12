// QA config: maintained workspace spec copy (33 tests) — port/output rewiring + outer policy wrapper only. QA-owned outputs.
import { defineConfig } from '@playwright/test';
import path from 'node:path';
const ROOT = path.resolve(__dirname, '../../../../../..');
const OUT = path.join(ROOT, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-002/acceptance/H/workspace-copy');
process.env.QA_ORIGIN = 'http://127.0.0.1:43182'; process.env.QA_OUT = OUT;
export default defineConfig({
  testDir: __dirname, testMatch: 'workspace.spec.ts', fullyParallel: false, workers: 1, retries: 0, timeout: 30000,
  outputDir: `${OUT}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `${OUT}/playwright-results.json` }]],
  use: { baseURL: 'http://127.0.0.1:43182', browserName: 'chromium', launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] }, viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1, trace: 'off', screenshot: 'only-on-failure', serviceWorkers: 'block' },
  webServer: { command: 'node tests/workspace/harness.cjs', cwd: ROOT, url: 'http://127.0.0.1:43182', reuseExistingServer: false, timeout: 90000, env: { APBM_WORKSPACE_PORT: '43182', NODE_OPTIONS: '--require=./tests/workspace/network-guard.cjs' } },
});
