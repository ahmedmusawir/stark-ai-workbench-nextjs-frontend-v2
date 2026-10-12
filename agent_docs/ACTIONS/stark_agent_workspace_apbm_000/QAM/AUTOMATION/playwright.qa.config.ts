// QA-owned Playwright config (disposable). Own port/outputs; never the Engineer config or evidence paths.
// Attempt-002: output under evidence/q2-attempt-002 (QA_OUT required), attempt-001 diagnostic spec excluded, service workers blocked,
// Node network guard preloaded for the webServer subtree. Policy/error capture is enforced by specs/_qa.ts auto fixtures.
import { defineConfig } from '@playwright/test';
import path from 'node:path';
const ROOT = path.resolve(__dirname, '../../../../..');
const Q = path.join(ROOT, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM');
if (!process.env.QA_OUT) throw new Error('QA_OUT must name a unique attempt-002 output directory');
const OUT = path.resolve(ROOT, process.env.QA_OUT);
process.env.QA_ORIGIN = 'http://127.0.0.1:43181';
export default defineConfig({
  testDir: `${Q}/AUTOMATION/specs`, testIgnore: ['diag_run2.spec.ts'], fullyParallel: false, workers: 1, retries: 0, timeout: 60000,
  outputDir: `${OUT}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `${OUT}/playwright-results.json` }]],
  use: { baseURL: 'http://127.0.0.1:43181', browserName: 'chromium', launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] },
    viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, trace: 'off', screenshot: 'off', video: 'off', serviceWorkers: 'block' },
  webServer: { command: `node ${path.join(Q, 'AUTOMATION/qa-harness.cjs')}`, cwd: ROOT, url: 'http://127.0.0.1:43181/', reuseExistingServer: false, timeout: 120000,
    env: { QA_PORT: '43181', NODE_OPTIONS: `--require=${path.join(ROOT, 'tests/workspace/network-guard.cjs')}` } },
});
