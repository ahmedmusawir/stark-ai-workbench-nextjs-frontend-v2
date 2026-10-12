jest.mock('@/services/chatService',()=>({chatService:{sendMessage:jest.fn(),getHistory:jest.fn()}}));
jest.mock('@/services/sessionIndexService',()=>({sessionIndexService:{listSessions:jest.fn(),createSession:jest.fn(),touchSession:jest.fn(),renameSession:jest.fn(),archiveSession:jest.fn()},titleFromMessage:(text:string)=>text}));
import { chatService } from '@/services/chatService';
import { sessionIndexService } from '@/services/sessionIndexService';
import { createProductionWorkspaceServices } from '@/components/workspace/productionAdapter';
import { workspaceAgentsForUi, MANIFEST } from '@/config/manifest';
const chat=jest.mocked(chatService), index=jest.mocked(sessionIndexService);
beforeEach(()=>jest.resetAllMocks());
test('projection retains configured identities without URL/env names and permits neutral fields',()=>{
 const a=workspaceAgentsForUi();expect(a.map(x=>x.id)).toEqual(MANIFEST.agents.map(x=>x.name));expect(a.map(x=>x.backendId)).toEqual(MANIFEST.agents.map(x=>x.bundle));expect(JSON.stringify(a)).not.toMatch(/urlEnv|ADK_BUNDLE|https?:/);
});
test('creation occurs only after explicit send returns a durable ID, then uses existing metadata binding once',async()=>{
 const api=createProductionWorkspaceServices('fixture-user');expect(chat.sendMessage).not.toHaveBeenCalled();expect(index.createSession).not.toHaveBeenCalled();
 chat.sendMessage.mockResolvedValue({session_id:'durable-a',response:'Reply'});index.createSession.mockResolvedValue(null);
 expect(await api.send('configured-a',null,'Hello')).toEqual({status:'sent',sessionId:'durable-a',reply:'Reply',metadataWarning:true});
 expect(chat.sendMessage).toHaveBeenCalledWith({agent_name:'configured-a',user_id:'fixture-user',session_id:null,message:'Hello'});expect(index.createSession).toHaveBeenCalledTimes(1);
});
test('existing session reuses ID and touch binding without create',async()=>{
 const api=createProductionWorkspaceServices('fixture-user');chat.sendMessage.mockResolvedValue({session_id:'a',response:'Reply'});index.listSessions.mockResolvedValue([{id:'row-a',adk_session_id:'a'} as never]);
 await api.send('configured-a','a','Again');expect(index.createSession).not.toHaveBeenCalled();expect(index.touchSession).toHaveBeenCalledWith('row-a');
});
test('legacy sentinel and absent ID are uncertain, never not-sent or successful transcript',async()=>{
 const api=createProductionWorkspaceServices('fixture-user');chat.sendMessage.mockResolvedValue({session_id:'a',response:'Error: Could not reach Agent Service. Details: timeout'});expect(await api.send('a','a','x')).toEqual({status:'uncertain'});expect(index.createSession).not.toHaveBeenCalled();
});
test('history/list retain inherited empty outcome without invented missing distinction',async()=>{
 const api=createProductionWorkspaceServices('fixture-user');chat.getHistory.mockResolvedValue([]);index.listSessions.mockResolvedValue([]);
 expect(await api.history('a','s')).toEqual({status:'empty',messages:[]});expect(await api.list('a')).toEqual({status:'empty',rows:[]});
});
test('rename and archive call existing operations with literal title and no transcript delete',async()=>{
 const api=createProductionWorkspaceServices('fixture-user'),row={id:'row',sessionId:'s',title:'Before'};await api.rename(row,'<literal> & punctuation');await api.archive(row);expect(index.renameSession).toHaveBeenCalledWith('row','<literal> & punctuation');expect(index.archiveSession).toHaveBeenCalledWith('row');
});
test('missing user context prevents every existing-service call',async()=>{
 const api=createProductionWorkspaceServices('');await expect(api.list('a')).rejects.toThrow('User context unavailable');await expect(api.send('a',null,'x')).rejects.toThrow();expect(chat.sendMessage).not.toHaveBeenCalled();expect(index.listSessions).not.toHaveBeenCalled();
});

test('metadata rejection never discards a confirmed ADK ID and reply',async()=>{
 const api=createProductionWorkspaceServices('fixture-user');chat.sendMessage.mockResolvedValue({session_id:'confirmed-id',response:'Confirmed reply'});index.createSession.mockRejectedValue(Error('metadata unavailable'));
 expect(await api.send('a',null,'Hello')).toEqual({status:'sent',sessionId:'confirmed-id',reply:'Confirmed reply',metadataWarning:true});expect(chat.sendMessage).toHaveBeenCalledTimes(1);
});
