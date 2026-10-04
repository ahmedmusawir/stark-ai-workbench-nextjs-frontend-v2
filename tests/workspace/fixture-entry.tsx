import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { Workspace } from '../../src/components/workspace/Workspace';
import type { Catalogue, ThreadStatus, WorkspaceAgent, WorkspaceServices } from '../../src/components/workspace/types';

const params=new URLSearchParams(location.search);
const scenario=params.get('fixture')||'ready';
const primary: WorkspaceAgent[] = [{id:'atlas',name:'Atlas',description:'Research and planning workspace.',backendId:'fixture-a'},{id:'echo',name:'Echo',description:'A place to develop clear explanations.',backendId:'fixture-a'},{id:'studio',name:'Studio',description:'Explore ideas and presentation.',backendId:'fixture-b'}];
const alternate: WorkspaceAgent[] = [{id:'orbit/β',name:'Orbit Notes',backendId:'fixture-x'},{id:'moss',name:'Moss Review',description:'Review notes and compare alternatives.',backendId:'fixture-x'}];
const agents=params.get('roster')==='alternate'?alternate:scenario==='directory-empty'?[]:primary;
const ledger: Array<{action:string;agent?:string;session?:string;message?:string;title?:string}>=[];
const initial=params.get('view')==='workspace'?'agent=atlas':params.get('view')==='conversation'?'agent=atlas&session=a':params.get('query')||'';
const rows=[{id:'row-a',sessionId:'a',title:'Planning the next research session',updatedAt:'2026-10-04T10:42:00Z'},{id:'row-b',sessionId:'b',title:'Comparing approaches to a new idea',updatedAt:'2026-10-03T16:15:00Z'}];
const long='long_identifier_'.repeat(35);
const markdown=`Here is a **clear starting point** for this conversation.\n\n| Approach | Notes | Owner | Status | Timing | Evidence | Alternatives | Outcome |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n| Plan | A bounded next step | Researcher | Reviewing | Tomorrow | Reference | Alternative | Pending |\n| Compare | ${long} | Researcher | Reviewing | Tomorrow | Reference | Alternative | Pending |\n\n\`\`\`typescript\nconst conversation = "${long}";\nconsole.log(conversation);\n\`\`\`\n\n[Reference ${long}](https://example.invalid/reference)\n\n<script>window.badMarkup=true</script>`;
let count=0;
const services: WorkspaceServices={
 async list(agent){ledger.push({action:'list',agent});return {status:['empty','loading','unavailable','partial','recovered'].includes(scenario)?scenario as Catalogue['status']:'ready',rows:scenario==='empty'||scenario==='loading'||scenario==='unavailable'?[]:rows.map(r=>({...r,title:scenario==='recovered'?'':r.title}))}},
 async history(agent,session){ledger.push({action:'history',agent,session});if(scenario==='late-history')await new Promise(r=>setTimeout(r,session==='a'?700:20));return {status:['loading','unavailable','missing','access-unavailable','pending','uncertain','not-sent','metadata-warning','empty'].includes(scenario)?scenario as ThreadStatus:'ready',messages:scenario==='empty'||scenario==='missing'||scenario==='access-unavailable'?[]:[{role:'user',content:`Question in session ${session}`},{role:'assistant',content:session==='b'?'Only session B content.':markdown}],attemptedText:scenario==='not-sent'?'My preserved draft':scenario==='uncertain'?'An attempted message':undefined}},
 async send(agent,session,message){ledger.push({action:'send',agent,session:session||undefined,message});await new Promise(r=>setTimeout(r,150));if(scenario==='send-uncertain')return{status:'uncertain'};if(scenario==='send-not-sent')return{status:'not-sent'};return{status:'sent',sessionId:session||`created-${++count}`,reply:'Fixture reply: '+message,metadataWarning:scenario==='send-metadata'}},
 async rename(row,title){ledger.push({action:'rename',title});if(scenario==='metadata-failure')throw Error('Fixture metadata rejection');},
 async archive(){ledger.push({action:'archive'});if(scenario==='metadata-failure')throw Error('Fixture metadata rejection');}
};
const api={ledger,resetIdentity:()=>{},unmount:()=>{}};
Object.assign(window,{workspaceFixture:api});
function Fixture(){
 const [query,setQuery]=useState(initial);const [identity,setIdentity]=useState('fixture-user-a');
 api.resetIdentity=()=>setIdentity(v=>v==='fixture-user-a'?'fixture-user-b':'fixture-user-a');
 React.useEffect(()=>{history.replaceState({query:initial},'',location.href);const fn=()=>setQuery(history.state?.query??'');addEventListener('popstate',fn);return()=>removeEventListener('popstate',fn)},[]);
 const navigate=useMemo(()=>((query:string)=>{history.pushState({query},'','/?'+query);setQuery(query)}),[]);
 return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange><div id="unscoped-sibling" style={{position:'absolute',left:0,top:0,width:1,height:1,pointerEvents:'none'}}/><Workspace identityKey={identity} agents={agents} services={services} query={query} navigate={navigate} rosterStatus={scenario==='directory-loading'?'loading':scenario==='directory-unavailable'?'unavailable':'ready'}/></ThemeProvider>;
}
const root=createRoot(document.getElementById('fixture-root')!);api.unmount=()=>root.unmount();root.render(<Fixture/>);
