import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { Workspace } from '../../src/components/workspace/Workspace';
import type { Catalogue, ThreadStatus, WorkspaceAgent, WorkspaceServices } from '../../src/components/workspace/types';

const params=new URLSearchParams(location.search);
const scenario=params.get('fixture')||'ready';
const primary: WorkspaceAgent[] = [{id:'atlas',name:'Atlas',description:'Research and planning workspace.',backendId:'fixture-a'},{id:'echo',name:'Echo',description:'A place to develop clear explanations.',backendId:'fixture-a'},{id:'studio',name:'Studio',description:'Explore ideas and presentation.',backendId:'fixture-b'}];
const alternate: WorkspaceAgent[] = [{id:'orbit/β',name:'Orbit Notes',backendId:'fixture-x'},{id:'moss',name:'Moss Review',description:'Review notes and compare alternatives.',backendId:'fixture-x'}];
// keyed: production-shaped agents carrying an opaque backend key and honest availability.
const keyed: WorkspaceAgent[] = [...primary.map(a=>({...a,backendKey:'0123456789abcdef',availability:'available' as const})),{id:'ghost',name:'Ghost Agent',description:'Configured but not deployed.',backendId:'fixture-a',backendKey:'0123456789abcdef',availability:'unavailable'}];
const agents=params.get('roster')==='alternate'?alternate:params.get('roster')==='keyed'?keyed:scenario==='directory-empty'?[]:primary;
const ledger: Array<{action:string;agent?:string;session?:string;message?:string;title?:string}>=[];
// A reload of a navigated URL (/?agent=…) keeps its route; fixture/roster params seed the first load.
const initial=params.get('view')==='workspace'?'agent=atlas':params.get('view')==='conversation'?'agent=atlas&session=a':params.has('agent')?location.search.slice(1):params.get('query')||'';
const rows=[{id:'row-a',sessionId:'a',title:'Planning the next research session',createdAt:'2026-10-04T10:42:00Z'},{id:'row-b',sessionId:'b',title:'Comparing approaches to a new idea',createdAt:'2026-10-03T16:15:00Z'}];
const long='long_identifier_'.repeat(35);
const markdown=`Here is a **clear starting point** for this conversation.\n\n| Approach | Notes | Owner | Status | Timing | Evidence | Alternatives | Outcome |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| Plan | A bounded next step | Researcher | Reviewing | Tomorrow | Reference | Alternative | Pending |\n| Compare | ${long} | Researcher | Reviewing | Tomorrow | Reference | Alternative | Pending |\n\n\`\`\`typescript\nconst conversation = "${long}";\nconsole.log(conversation);\n\`\`\`\n\n[Reference ${long}](https://example.invalid/reference)\n\n<script>window.badMarkup=true</script>`;
// APBM001 contract: list/history/create/send only (rename/archive deferred). Failures are explicit.
const delay=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const listDelay=Number(params.get('listDelay')||0);
const services: WorkspaceServices={
 async list(agent){ledger.push({action:'list',agent});if(listDelay)await delay(listDelay);return {status:['empty','loading','unavailable','access-unavailable'].includes(scenario)?scenario as Catalogue['status']:'ready',rows:['empty','loading','unavailable','access-unavailable'].includes(scenario)?[]:rows}},
 async history(agent,session){ledger.push({action:'history',agent,session});if(scenario==='late-history')await delay(session==='a'?700:20);const status=['loading','unavailable','missing','access-unavailable','empty'].includes(scenario)?scenario as ThreadStatus:'ready';return {status,messages:status!=='ready'?[]:[{role:'user',content:`Question in session ${session}`},{role:'assistant',content:session==='b'?'Only session B content.':markdown}]}},
 async create(agent,session,message){ledger.push({action:'create',agent,session,title:message});await delay(100);if(scenario==='create-uncertain')return{status:'uncertain'};if(scenario==='create-not-sent')return{status:'not-sent'};return{status:'created'}},
 async send(agent,session,message){ledger.push({action:'send',agent,session,message});await delay(150);if(scenario==='send-pending')return new Promise<never>(()=>{});if(scenario==='send-slow')await delay(1500);if(scenario==='send-uncertain')return{status:'uncertain'};if(scenario==='send-not-sent')return{status:'not-sent'};if(scenario==='send-missing')return{status:'missing'};return{status:'sent',reply:'Fixture reply: '+message}},
};
const api={ledger,resetIdentity:()=>{},unmount:()=>{}};
Object.assign(window,{workspaceFixture:api});
function Fixture(){
 const [query,setQuery]=useState(initial);const [identity,setIdentity]=useState('fixture-user-a');
 api.resetIdentity=()=>setIdentity(v=>v==='fixture-user-a'?'fixture-user-b':'fixture-user-a');
 React.useEffect(()=>{history.replaceState({query:initial},'',location.href);const fn=()=>setQuery(history.state?.query??'');addEventListener('popstate',fn);return()=>removeEventListener('popstate',fn)},[]);
 const navigate=useMemo(()=>((query:string,options?:{replace?:boolean})=>{(options?.replace?history.replaceState:history.pushState).call(history,{query},'','/?'+query);setQuery(query)}),[]);
 return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange><div id="unscoped-sibling" style={{position:'absolute',left:0,top:0,width:1,height:1,pointerEvents:'none'}}/><Workspace identityKey={identity} scope={{user:identity,mode:'fixture'}} agents={agents} services={services} query={query} navigate={navigate} rosterStatus={scenario==='directory-loading'?'loading':scenario==='directory-unavailable'?'unavailable':'ready'}/></ThemeProvider>;
}
const root=createRoot(document.getElementById('fixture-root')!);api.unmount=()=>root.unmount();root.render(<Fixture/>);
