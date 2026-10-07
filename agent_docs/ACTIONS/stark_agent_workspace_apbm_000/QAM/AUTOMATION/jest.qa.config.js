// QA-owned Jest config (disposable). Same preset/transform/moduleNameMapper/setup as the root config; QA tests only.
const path = require('path');
const root = require(path.resolve(__dirname, '../../../../../jest.config.js'));
module.exports = { ...root, rootDir: path.resolve(__dirname, '../../../../..'),
  roots: ['<rootDir>/agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/jest'],
  testPathIgnorePatterns: ['/node_modules/'] };
