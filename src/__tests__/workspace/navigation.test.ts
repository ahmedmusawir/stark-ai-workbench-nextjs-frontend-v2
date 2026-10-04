import { parseWorkspaceView, workspaceQuery } from '@/components/workspace/navigation';
const agents=[{id:'alpha/β',name:'Alpha',backendId:'fixture'}];
describe('workspace URL identity',()=>{
 test('encodes stable IDs and restores each view',()=>{
  expect(parseWorkspaceView('',agents)).toEqual({kind:'directory'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β'),agents)).toEqual({kind:'workspace',agentId:'alpha/β'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β',undefined,true),agents)).toEqual({kind:'draft',agentId:'alpha/β'});
  expect(parseWorkspaceView(workspaceQuery('alpha/β','a&b/#'),agents)).toEqual({kind:'conversation',agentId:'alpha/β',sessionId:'a&b/#'});
 });
 test.each(['agent=unknown','session=a','new=1','agent=alpha%2F%CE%B2&new=0','agent=alpha%2F%CE%B2&session=','agent=alpha%2F%CE%B2&session=a&new=1','agent=alpha%2F%CE%B2&agent=alpha%2F%CE%B2','agent=alpha%2F%CE%B2&user=other','state=ready','backend=http://example.invalid'])('rejects unsafe/conflicting selection %s',q=>expect(parseWorkspaceView(q,agents)).toEqual({kind:'invalid'}));
 test('empty roster never fabricates a default',()=>expect(parseWorkspaceView('agent=alpha',[])).toEqual({kind:'invalid'}));
});
