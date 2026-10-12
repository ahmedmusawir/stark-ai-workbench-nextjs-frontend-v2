// QA-owned Playwright config (disposable). Own port/outputs; never the Engineer config or evidence paths.
import { defineConfig } from '@playwright/test';
import path from 'node:path';
const ROOT = path.resolve(__dirname, '../../../../..');
const Q = path.join(ROOT, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM');
const OUT = path.resolve(ROOT, process.env.QA_OUT || `${Q}/evidence/q2-attempt-001/q2-6`);
export default defineConfig({
  testDir: `${Q}/AUTOMATION/specs`, fullyParallel: false, workers: 1, retries: 0, timeout: 60000,
  outputDir: `${OUT}/artifacts`,
  reporter: [['list'], ['json', { outputFile: `${OUT}/playwright-results.json` }]],
  use: { baseURL: 'http://127.0.0.1:43181', browserName: 'chromium', launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] },
    viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, trace: 'off', screenshot: 'off', video: 'off' },
  webServer: { command: `node ${path.join(Q, 'AUTOMATION/qa-harness.cjs')}`, cwd: ROOT, url: 'http://127.0.0.1:43181/', reuseExistingServer: false, timeout: 120000,
    env: { QA_PORT: '43181', NODE_OPTIONS: '' } },
});
