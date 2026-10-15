import { parseWorkspaceView, workspaceQuery } from '@/components/workspace/navigation';
const agents=[{id:'alpha/β',name:'Alpha',backendId:'fixture'}];
const KEY='0123456789abcdef';
describe('workspace URL identity',()=>{
 test('encodes stable IDs and restores each view',()=>{
  expect(parseWorkspaceView('',agents)).toEqual({kind:'directory'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β'),agents)).toEqual({kind:'workspace',agentId:'alpha/β'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β',{draft:'d0a1b2c3d'}),agents)).toEqual({kind:'draft',agentId:'alpha/β',draftId:'d0a1b2c3d'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β',{session:'a&b/#'}),agents)).toEqual({kind:'conversation',agentId:'alpha/β',sessionId:'a&b/#',backendKey:null});
  expect(parseWorkspaceView(workspaceQuery('alpha/β',{session:'s-1',backendKey:KEY}),agents)).toEqual({kind:'conversation',agentId:'alpha/β',sessionId:'s-1',backendKey:KEY});
 });
 test('APBM001: each draft has its own identity; the legacy new=1 selector still opens a draft',()=>{
  expect(parseWorkspaceView('agent=alpha%2F%CE%B2&new=1',agents)).toEqual({kind:'draft',agentId:'alpha/β',draftId:'1'});
  expect(workspaceQuery('alpha/β',{draft:'d12345678'})).not.toBe(workspaceQuery('alpha/β',{draft:'d87654321'}));
 });
 test.each(['agent=unknown','session=a','new=1','agent=alpha%2F%CE%B2&new=0','agent=alpha%2F%CE%B2&new=dZZ','agent=alpha%2F%CE%B2&session=','agent=alpha%2F%CE%B2&session=a&new=1','agent=alpha%2F%CE%B2&agent=alpha%2F%CE%B2','agent=alpha%2F%CE%B2&user=other','state=ready','backend=http://example.invalid','agent=alpha%2F%CE%B2&bk='+KEY,'agent=alpha%2F%CE%B2&session=a&bk=https://example.invalid','agent=alpha%2F%CE%B2&session=a&bk='+KEY+'&bk='+KEY])('rejects unsafe/conflicting selection %s',q=>expect(parseWorkspaceView(q,agents)).toEqual({kind:'invalid'}));
 test('empty roster never fabricates a default',()=>expect(parseWorkspaceView('agent=alpha',[])).toEqual({kind:'invalid'}));
});
