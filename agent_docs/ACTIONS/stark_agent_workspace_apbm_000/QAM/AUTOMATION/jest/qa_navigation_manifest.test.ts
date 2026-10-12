// QA J-03 (query identity table) and J-01 / X-21 (approved roster projection + bindings). Independent oracles.
import { parseWorkspaceView, workspaceQuery } from '@/components/workspace/navigation';
import { workspaceAgentsForUi, MANIFEST } from '@/config/manifest';
import type { WorkspaceAgent } from '@/components/workspace/types';

const QR1: WorkspaceAgent[] = ['kestrel', 'a&b=c', '100%-sure', 'spaced id', 'ünï-ŝ', 'x/../y'].map(id => ({ id, name: id, backendId: 'b' }));
const enc = (s: string) => encodeURIComponent(s);
type Row = [string, unknown];
const TABLE: Row[] = [
  ['', { kind: 'directory' }],
  ['agent=kestrel', { kind: 'workspace', agentId: 'kestrel' }],
  [`agent=${enc('a&b=c')}`, { kind: 'workspace', agentId: 'a&b=c' }],
  [`agent=${enc('100%-sure')}`, { kind: 'workspace', agentId: '100%-sure' }],
  [`agent=${enc('spaced id')}`, { kind: 'workspace', agentId: 'spaced id' }],
  ['agent=spaced+id', { kind: 'workspace', agentId: 'spaced id' }],
  [`agent=${enc('ünï-ŝ')}`, { kind: 'workspace', agentId: 'ünï-ŝ' }],
  [`agent=${enc('x/../y')}`, { kind: 'workspace', agentId: 'x/../y' }],
  ['agent=kestrel&new=1', { kind: 'draft', agentId: 'kestrel' }],
  ['new=1&agent=kestrel', { kind: 'draft', agentId: 'kestrel' }],
  ['agent=kestrel&session=s1', { kind: 'conversation', agentId: 'kestrel', sessionId: 's1' }],
  [`agent=kestrel&session=${enc('a/b?c#d')}`, { kind: 'conversation', agentId: 'kestrel', sessionId: 'a/b?c#d' }],
  ['agent=kestrel&session=%20abc%20', { kind: 'conversation', agentId: 'kestrel', sessionId: ' abc ' }], // records untrimmed pass-through
  ['agent=kestrel&new=0', { kind: 'invalid' }],
  ['agent=kestrel&new=', { kind: 'invalid' }],
  ['agent=kestrel&new=true', { kind: 'invalid' }],
  ['agent=kestrel&new=1&session=s', { kind: 'invalid' }],
  ['agent=kestrel&session=', { kind: 'invalid' }],
  ['agent=kestrel&session=%20%20', { kind: 'invalid' }],
  ['agent=', { kind: 'invalid' }],
  ['agent=KESTREL', { kind: 'invalid' }],
  ['agent=unknown', { kind: 'invalid' }],
  ['session=s1', { kind: 'invalid' }],
  ['new=1', { kind: 'invalid' }],
  ['agent=kestrel&agent=kestrel', { kind: 'invalid' }],
  ['agent=kestrel&session=a&session=b', { kind: 'invalid' }],
  ['agent=kestrel&user=u2', { kind: 'invalid' }],
  ['agent=kestrel&backend=https%3A%2F%2Fevil', { kind: 'invalid' }],
  ['agent=kestrel&fixture=missing', { kind: 'invalid' }],
  ['view=conversation', { kind: 'invalid' }],
  ['Agent=kestrel', { kind: 'invalid' }],
  ['agent=kestrel&', { kind: 'workspace', agentId: 'kestrel' }],
];
const mismatches = (rows: Row[]) => rows.filter(([q, exp]) => JSON.stringify(parseWorkspaceView(q, QR1)) !== JSON.stringify(exp)).map(r => r[0]);

describe('J-03 query identity', () => {
  test(`table of ${TABLE.length} cases matches the DATA_CONTRACT oracle`, () => { expect(mismatches(TABLE)).toEqual([]); });
  test('round trip encode->parse for every QR1 id and session/draft forms', () => {
    for (const a of QR1) {
      expect(parseWorkspaceView(workspaceQuery(a.id), QR1)).toEqual({ kind: 'workspace', agentId: a.id });
      expect(parseWorkspaceView(workspaceQuery(a.id, undefined, true), QR1)).toEqual({ kind: 'draft', agentId: a.id });
      expect(parseWorkspaceView(workspaceQuery(a.id, 's&=%/ ü'), QR1)).toEqual({ kind: 'conversation', agentId: a.id, sessionId: 's&=%/ ü' });
    }
    expect(workspaceQuery()).toBe('');
  });
  test('CONTROL (expected-red oracle): a deliberately wrong row is detected', () => {
    expect(mismatches([...TABLE, ['agent=kestrel&new=0', { kind: 'draft', agentId: 'kestrel' }]])).toEqual(['agent=kestrel&new=0']);
  });
});

// Approved active roster (Lead L1 / Architect amendment): exact names, labels, bundles, urlEnv names.
const APPROVED = [['greeting_agent', 'Greeting Agent'], ['jarvis_agent', 'Jarvis'], ['calc_agent', 'Calc Agent'], ['product_agent', 'Product Agent'], ['ghl_mcp_agent', 'GHL CRM Agent'], ['moose_mcp_agent', 'MOOSE CRM Agent']];
const oracle = APPROVED.map(([id, name]) => ({ id, name, backendId: 'v1', description: undefined, icon: undefined }));
describe('J-01 / X-21 approved roster projection and bindings', () => {
  test('projection equals the approved roster, all on v1, with neutral optional fields', () => {
    expect(workspaceAgentsForUi()).toEqual(oracle);
  });
  test('projection never carries bundle URLs/env names; bundles and urlEnv unchanged', () => {
    const s = JSON.stringify(workspaceAgentsForUi());
    expect(s).not.toMatch(/urlEnv|ADK_BUNDLE|https?:/);
    expect(MANIFEST.bundles.map(b => [b.id, b.urlEnv])).toEqual([['v1', 'ADK_BUNDLE_URL_V1'], ['v2-local', 'ADK_BUNDLE_URL_V2_LOCAL']]);
  });
  test('Q1b manifest-test coverage review: v1 + v2-local bundle declaration is independently pinned here', () => {
    expect(MANIFEST.bundles.map(b => b.id)).toEqual(expect.arrayContaining(['v1', 'v2-local']));
  });
  test('CONTROL (expected-red oracle): an oracle with a fabricated default agent is detected', () => {
    expect(workspaceAgentsForUi()).not.toEqual([...oracle, { id: 'default_agent', name: 'Default', backendId: 'v1', description: undefined, icon: undefined }]);
  });
});
