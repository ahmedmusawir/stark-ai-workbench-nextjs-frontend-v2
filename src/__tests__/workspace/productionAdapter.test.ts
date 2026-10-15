jest.mock('@/services/chatService',()=>({chatService:{listConversations:jest.fn(),getHistory:jest.fn(),createConversation:jest.fn(),runTurn:jest.fn(),getWorkspace:jest.fn()},conversationTitle:(text:string)=>text.trim().slice(0,80)}));
jest.mock('@/services/sessionIndexService',()=>{throw Error('APBM001: the workspace adapter must not load the chat_sessions index');});
import { chatService } from '@/services/chatService';
import { createProductionWorkspaceServices, workspaceAgentsFor } from '@/components/workspace/productionAdapter';
import { workspaceAgentsForUi, MANIFEST } from '@/config/manifest';
import type { WorkspaceDescriptor } from '@/types';
const chat=jest.mocked(chatService);
const KEY='0123456789abcdef';
const descriptor:WorkspaceDescriptor={user:{id:'server-user',email:null},mode:'live',supabase_ref:null,roster_checked_at:null,agents:[{agent_name:'greeting_agent',backend_key:KEY,availability:'available'},{agent_name:'moose_mcp_agent',backend_key:KEY,availability:'unavailable'}]};
beforeEach(()=>jest.resetAllMocks());
test('projection retains configured identities without URL/env names and permits neutral fields',()=>{
 const a=workspaceAgentsForUi();expect(a.map(x=>x.id)).toEqual(MANIFEST.agents.map(x=>x.name));expect(a.map(x=>x.backendId)).toEqual(MANIFEST.agents.map(x=>x.bundle));expect(JSON.stringify(a)).not.toMatch(/urlEnv|ADK_BUNDLE|https?:/);
});
test('descriptor adds key and honest availability; the manifest roster is never filtered or rewritten',()=>{
 const agents=workspaceAgentsFor(descriptor);expect(agents.map(a=>a.id)).toEqual(MANIFEST.agents.map(x=>x.name));
 expect(agents.find(a=>a.id==='moose_mcp_agent')).toMatchObject({availability:'unavailable',backendKey:KEY});expect(agents.find(a=>a.id==='jarvis_agent')?.availability).toBeUndefined();
 expect(workspaceAgentsFor(null).every(a=>a.backendKey===undefined)).toBe(true);
});
test('list maps the ADK catalogue with scoped row keys and the server identity/backend key',async()=>{
 chat.listConversations.mockResolvedValue({status:'ready',conversations:[{sessionId:'s1',title:'T',titleSource:'stored',createdAt:'2026-10-14T00:00:00.000Z'}]});
 const api=createProductionWorkspaceServices(descriptor);
 expect(await api.list('greeting_agent')).toEqual({status:'ready',rows:[{id:`${KEY}:s1`,sessionId:'s1',title:'T',createdAt:'2026-10-14T00:00:00.000Z'}]});
 expect(chat.listConversations).toHaveBeenCalledWith('greeting_agent',{backendKey:KEY,userId:'server-user'},undefined);
});
test('list/history failures stay explicit (R001-05 supersedes the inherited empty-on-error limit)',async()=>{
 const api=createProductionWorkspaceServices(descriptor);chat.listConversations.mockResolvedValue({status:'unavailable',conversations:[]});chat.getHistory.mockResolvedValue({status:'missing',messages:[]});
 expect(await api.list('greeting_agent')).toEqual({status:'unavailable',rows:[]});expect(await api.history('greeting_agent','s')).toEqual({status:'missing',messages:[]});
 expect(chat.getHistory).toHaveBeenCalledWith({agent_name:'greeting_agent',user_id:'server-user',session_id:'s',backend_key:KEY},undefined);
});
test('create carries the first-message title; send is one continuation run; nothing writes metadata',async()=>{
 const api=createProductionWorkspaceServices(descriptor);chat.createConversation.mockResolvedValue({status:'created',sessionId:'u1',title:'Hello',createdAt:null});chat.runTurn.mockResolvedValue({status:'sent',sessionId:'u1',reply:'Reply',eventIds:[],invocationId:null});
 expect(await api.create('greeting_agent','u1','  Hello  ')).toEqual({status:'created'});expect(chat.createConversation).toHaveBeenCalledWith('greeting_agent','u1','Hello',{backendKey:KEY,userId:'server-user'});
 expect(await api.send('greeting_agent','u1','Again')).toEqual({status:'sent',reply:'Reply'});expect(chat.runTurn).toHaveBeenCalledTimes(1);
});
test('write failures pass through unchanged; uncertain is never upgraded to sent or not-sent',async()=>{
 const api=createProductionWorkspaceServices(descriptor);
 for(const status of ['uncertain','not-sent','missing','access-unavailable'] as const){chat.runTurn.mockResolvedValueOnce({status,code:null});expect(await api.send('greeting_agent','s','x')).toEqual({status});}
 chat.createConversation.mockResolvedValueOnce({status:'uncertain',code:null});expect(await api.create('greeting_agent','u','x')).toEqual({status:'uncertain'});
});
test('APBM001 deferral: the adapter exposes no rename/archive/delete operations',()=>{
 const api=createProductionWorkspaceServices(descriptor) as unknown as Record<string,unknown>;expect(Object.keys(api).sort()).toEqual(['create','history','list','send']);
});
