// QA config: repair spec copy (27 tests) — port/output rewiring + outer policy wrapper only; QAM-owned harness copy on 43183.
import { defineConfig } from '@playwright/test';
import path from 'node:path';
const ROOT = path.resolve(__dirname, '../../../../../..');
const Q = path.join(ROOT, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM');
const OUT = path.join(Q, 'evidence/q2-attempt-002/acceptance/H/repair-copy');
process.env.QA_ORIGIN = 'http://127.0.0.1:43183'; process.env.QA_OUT = OUT;
export default defineConfig({
  testDir: __dirname, testMatch: 'repair.spec.ts', workers: 1, retries: 0, timeout: 30000,
  outputDir: `${OUT}/browser-artifacts`,
  reporter: [['list'], ['json', { outputFile: `${OUT}/browser-results.json` }]],
  use: { baseURL: 'http://127.0.0.1:43183', browserName: 'chromium',
    launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] },
    viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, screenshot: 'only-on-failure', trace: 'off', serviceWorkers: 'block' },
  webServer: { command: `node ${path.join(Q, 'AUTOMATION/repair-harness/browser_harness.cjs')}`, cwd: ROOT,
    url: 'http://127.0.0.1:43183', reuseExistingServer: false, timeout: 90000, env: { NODE_OPTIONS: `--require=${path.join(ROOT, 'tests/workspace/network-guard.cjs')}` } },
});
